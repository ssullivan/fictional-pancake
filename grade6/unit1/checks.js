/* Blueprint Builders: limits and checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero digits,
   max = largest value, for the answer and every number in the prompt. Keep numbers friendly for mental math. */
const SIDES = {triangular: 3, square: 4, pentagonal: 5, hexagonal: 6, heptagonal: 7, octagonal: 8};
const counts = (kind, n) => kind === 'prism' ? {faces: n + 2, edges: 3 * n, vertices: 2 * n} : {faces: n + 1, edges: 2 * n, vertices: n + 1};
const plain = t => String(t).replace(/<[^>]*>/g, '');
const area = P => Math.abs(P.reduce((s, [x1, y1], i) => { const [x2, y2] = P[(i + 1) % P.length]; return s + x1 * y2 - x2 * y1; }, 0)) / 2;
// distance from a point inside a convex polygon to its nearest side (negative when outside)
const inset = (P, [x, y]) => Math.min(...P.map(([x1, y1], i) => { const [x2, y2] = P[(i + 1) % P.length], L = Math.hypot(x2 - x1, y2 - y1);
  return ((x2 - x1) * (y - y1) - (y2 - y1) * (x - x1)) / L * Math.sign(P.reduce((s, [a, b], j) => { const [c, d] = P[(j + 1) % P.length]; return s + a * d - c * b; }, 0)); }));
module.exports = {
  limits: {
    para:  {dp: 0, nz: 2, max: 70},
    tri:   {dp: 1, nz: 3, max: 40},
    poly:  {dp: 0, nz: 2, max: 80},
    solid: {dp: 0, nz: 2, max: 40},
    net:   {dp: 0, nz: 3, max: 160},
    cube:  {dp: 0, nz: 3, max: 500},
    frame: {dp: 1, nz: 3, max: 80},
  },
  // Polyhedron Yard: every count, name, and picture has to be right
  check(p) {
    const bad = [], prompt = plain(p.prompt);
    // Figure A, Figure B, both, or neither: work out each figure's answer from its kind and base
    if (p.ab) {
      const {solids, st} = p.ab, SHAPE = {3: 'triangle', 4: 'square', 5: 'pentagon', 6: 'hexagon'};
      const holds = ({kind, n}) => {
        const c = counts(kind, n);
        return {poly: true, tri: kind === 'pyramid' || n === 3, rect: kind === 'prism', moreV: c.vertices > c.edges, pyr: kind === 'pyramid', prism: kind === 'prism',
          one: kind === 'pyramid' && n !== 3, triBase: n === 3, two: kind === 'prism', count: c[st.what] === st.k, face: n === st.m}[st.id];
      };
      const t = solids.map(holds), want = t[0] && t[1] ? 'both' : t[0] ? 'A' : t[1] ? 'B' : 'neither';
      if (p.answer !== want) bad.push(`${st.id} about a ${solids.map(x => x.n + '-sided ' + x.kind).join(' and ')}: answer ${p.answer}, should be ${want}`);
      if (st.id === 'rect' && solids.some(x => x.kind === 'pyramid' && x.n === 4)) bad.push('rectangular faces asked about a square pyramid (a square is a rectangle)');
      if (st.id === 'face' && !SHAPE[st.m]) bad.push(`a face with ${st.m} sides`);
    }
    // two nets, the same prism?: does each net fold closed (a base on each end, a rectangle on every side), and do the sizes match the answer?
    if (p.nets) {
      const {c, bad: which, flat} = p.nets, mid = P => P.reduce((a, q) => [a[0] + q[0] / P.length, a[1] + q[1] / P.length], [0, 0]);
      const folds = net => {
        const {h, a} = net, ends = net.faces.filter(f => f.col === 0).map(f => mid(f.poly)[1]);
        if (net.type === 'strip') return ends.filter(y => y < 0).length === 1 && ends.filter(y => y > h).length === 1;
        const wings = net.faces.filter(f => f.col === 2).map(f => mid(f.poly)), top = wings.find(w => w[1] < 0), bot = wings.find(w => w[1] > h);
        return !!top && !!bot && (top[0] - a / 2) * (bot[0] - a / 2) < 0;
      };
      const ok = flat.map(folds), sameA = flat[0].a === flat[1].a, sameH = flat[0].h === flat[1].h;
      const want = !ok[0] || !ok[1] ? 'fold' : !sameA ? 'a' : !sameH ? 'h' : 'yes';
      if (c !== want) bad.push(`two nets: dealt as ${c}, but they're ${want} (folds ${ok}, a ${flat.map(n => n.a)}, h ${flat.map(n => n.h)})`);
      if (want === 'fold' && ok.filter(x => !x).length !== 1) bad.push('two nets: both are broken');
      if (want === 'fold' && ok['AB'.indexOf(which)]) bad.push(`two nets: says net ${which} is the broken one`);
      const areas = net => net.faces.map(f => Math.round(area(f.poly) * 100)).sort((x, y) => x - y).join();
      if (want === 'yes' && areas(flat[0]) !== areas(flat[1])) bad.push('two nets: same prism, but different faces');
    }
    // Frame & Subtract holes: the hole sits inside the shape (it may rest on a side), its top corners well clear of the sides
    if (p.cut) {
      const {outer, hole} = p.cut, d = hole.map(v => inset(outer, v));
      if (d.some(x => x < -1e-9)) bad.push('the hole pokes out of the shape');
      if (d.filter(x => x > 1e-9).some(x => x < .5)) bad.push(`a corner of the hole nearly touches a side (${Math.min(...d.filter(x => x > 1e-9)).toFixed(2)})`);
      if (!d.some(x => x > 1e-9)) bad.push('the hole has no corner inside the shape');
      if (Math.abs(area(outer) - area(hole) - p.answer) > 1e-9) bad.push(`answer ${p.answer}, but the shape minus the hole is ${area(outer) - area(hole)}`);
    }
    const right = p.kind === 'mc' ? p.choices.find(c => c.id === p.answer).label : null;
    let m;
    if (p.solid) {
      const s = p.solid, c = counts(s.kind, s.n);
      if (s.V.length - s.E.length + s.F.length !== 2) bad.push(`${s.name}: V − E + F is not 2`);
      if (s.F.length !== c.faces || s.E.length !== c.edges || s.V.length !== c.vertices) bad.push(`${s.name}: its drawing has ${s.F.length} faces, ${s.E.length} edges, ${s.V.length} vertices`);
      if (s.name !== `${Object.keys(SIDES).find(k => SIDES[k] === s.n)} ${s.kind}`) bad.push(`a ${s.n}-sided ${s.kind} called ${s.name}`);
    }
    if ((m = prompt.match(/How many (faces|edges|vertices) does this (\w+) (prism|pyramid) have\?/)) && p.answer !== counts(m[3], SIDES[m[2]])[m[1]]) bad.push(`${m[2]} ${m[3]} with ${p.answer} ${m[1]}`);
    if ((m = prompt.match(/A (prism|pyramid) has (?:two bases, and each base has|a base with) (\d+) sides\. How many (faces|edges|vertices)/)) && p.answer !== counts(m[1], +m[2])[m[3]]) bad.push(`${m[2]}-sided ${m[1]} with ${p.answer} ${m[3]}`);
    if (/What is this polyhedron called\?/.test(prompt) && plain(right).toLowerCase() !== p.solid.name) bad.push(`answer ${plain(right)} for a ${p.solid.name}`);
    if (/What polyhedron does this net fold into\?/.test(prompt) && !plain(right).endsWith(p.solid.name)) bad.push(`answer ${plain(right)} for a net of a ${p.solid.name}`);
    // picture choices: their labels name what they show
    if (/is <b>not<\/b> a polyhedron|<b>is<\/b> a polyhedron/.test(p.prompt)) {
      const poly = p.choices.map(c => / (prism|pyramid)\b/.test(c.label.match(/aria-label="([^"]*)"/)[1]));
      const want = /not/.test(p.prompt) ? false : true;
      if (poly.filter(x => x === want).length !== 1 || poly[p.choices.findIndex(c => c.id === p.answer)] !== want) bad.push(`pictures: ${poly}`);
    }
    return bad;
  },
};
