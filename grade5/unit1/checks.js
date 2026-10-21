/* Cargo Port: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. check() works every answer out again from the
   facts each problem carries, checks that those numbers are in the prompt or labelled in the picture, and checks every
   equation the game states (3 + 2 + 1 = 6, 4 × 3 = 12, 60 ÷ 12 = 5). */
// the text without its markup
const plain = (html) => String(html).replace(/<[^>]*>/g, " ");
const near = (x, y) => Math.abs(x - y) < 1e-9;
const sum = (list) => list.reduce((a, b) => a + b, 0);
// the expressions in a chain like "4 × 3 = 12" or "(2 × 3 × 4) + (3 × 3 × 2) = 42" are all equal (a chain that starts with a
// word or a "?", like "base × 8 = 320", is skipped)
function wrongEquations(text) {
  const bad = [];
  for (const [chain] of text.matchAll(/(?<![×+−÷?]\s*)[\d(][\d\s()×+−÷]*(?:=\s*[\d(][\d\s()×+−÷]*)+/g)) {
    const values = chain.split("=").map((side) => {
      const js = side.trim().replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
      if (!/^[\d\s()+\-*/]+$/.test(js) || /\d\s+\d/.test(js)) return NaN;
      try {
        return Function(`return (${js})`)();
      } catch {
        return NaN;
      }
    });
    if (values.some((v) => !Number.isFinite(v) || !near(v, values[0]))) bad.push(`says ${chain.trim()}`);
  }
  return bad;
}
module.exports = {
  limits: {
    count: { dp: 0, nz: 2, max: 80 },
    layers: { dp: 0, nz: 3, max: 120 },
    edges: { dp: 0, nz: 3, max: 400 },
    combo: { dp: 0, nz: 3, max: 200 },
    solve: { dp: 0, nz: 3, max: 400 },
  },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      f = p.facts || {},
      prompt = plain(p.prompt),
      numbers = [...prompt.matchAll(/\d+/g)].map((m) => +m[0]),
      picture = p.fig ? plain(p.fig(false)) : "",
      labels = (p.choices || []).map((c) => c.label),
      right = p.kind === "mc" ? labels[p.choices.findIndex((c) => c.id === p.answer)] : null;
    const shows = (...values) =>
      values.forEach((v) => {
        if (!numbers.includes(v)) bad.push(`the prompt doesn't show ${v}`);
      });
    // the picture labels each edge with its length and unit
    const labelled = (u, ...edges) =>
      edges.forEach((v) => {
        if (!picture.includes(`${v} ${u}`)) bad.push(`the picture doesn't label ${v} ${u}`);
      });
    const want = (v, what) => {
      if (!near(p.answer, v)) bad.push(`${what}: ${p.answer} should be ${v}`);
    };
    // boxes are realistic: whole edges from 1 to 10
    const edgesOk = (...edges) =>
      edges.forEach((v) => {
        if (!Number.isInteger(v) || v < 1 || v > 10) bad.push(`edge ${v} is out of range`);
      });
    const vol = ([l, h, w]) => l * h * w;
    switch (f.t) {
      case "columns":
        // every back column is at least as tall as the one in front, so its top shows
        if (f.heights[1] && f.heights[1].some((tall, x) => tall < f.heights[0][x])) bad.push("a back column is hidden");
        want(sum(f.heights.flat()), "cubes in the columns");
        break;
      case "box":
        edgesOk(f.l, f.h, f.w);
        if (f.u) labelled(f.u, f.l, f.h, f.w);
        want(f.l * f.h * f.w, "volume");
        break;
      case "more":
        edgesOk(f.l, f.h, f.w);
        shows(f.h);
        if (f.packed < 1 || f.packed >= f.h) bad.push("the box is empty or full");
        want(f.l * f.w * (f.h - f.packed), "cubes left to fill");
        break;
      case "whichFig": {
        const fits = (label) => {
          const fig = f.figs.find((x) => x.label === label);
          return !!fig && sum(fig.heights.flat()) === f.target;
        };
        shows(f.target);
        labels.forEach((label, i) => {
          if (fits(label) !== (p.choices[i].id === p.answer))
            bad.push(`choice ${p.choices[i].id} is wrong about the volume`);
        });
        break;
      }
      case "perLayer": {
        edgesOk(f.l, f.h, f.w);
        const per = { up: f.l * f.w, back: f.l * f.h, side: f.w * f.h }[f.dir];
        want(per, `cubes in a layer ${f.dir}`);
        break;
      }
      case "layers":
        shows(f.perLayer, f.layers);
        want(f.perLayer * f.layers, "volume by layers");
        break;
      case "layerExpr": {
        const per = { [f.l * f.w]: f.h, [f.l * f.h]: f.w, [f.w * f.h]: f.l };
        if (per[f.perLayer] !== f.layers && f.perLayer * f.layers !== f.l * f.h * f.w)
          bad.push("layers don't fill the box");
        if (right !== `${f.perLayer} × ${f.layers}`) bad.push(`${right} is not layers × cubes`);
        break;
      }
      case "baseHeight":
        shows(f.base, f.h);
        want(f.base * f.h, "base × height");
        break;
      case "unit": {
        const ok = { small: "cubic centimeters", big: "cubic meters" }[f.size];
        if (right !== ok) bad.push(`${right} for ${f.what}`);
        if (labels.filter((label) => label.startsWith("cubic")).length !== 2) bad.push("needs two cubic units");
        break;
      }
      case "expr":
        edgesOk(f.l, f.h, f.w);
        if (right !== `(${f.l} × ${f.w}) × ${f.h}`) bad.push(`${right} is not the volume`);
        break;
      case "combo": {
        f.parts.flat().forEach((v) => edgesOk(v));
        f.parts.forEach(([l, h, w]) => labelled(f.u, l, h, w));
        // the two parts are w deep alike, and the outer box holds them with room to spare
        if (f.parts[0][2] !== f.parts[1][2]) bad.push("the parts aren't the same depth");
        if (vol(f.outer) <= vol(f.parts[0]) + vol(f.parts[1])) bad.push("the figure fills its outer box");
        want(vol(f.parts[0]) + vol(f.parts[1]), "two prisms");
        break;
      }
      case "comboExpr": {
        const [a, b] = f.parts.map(([l, h, w]) => `${l} × ${w} × ${h}`);
        if (right !== `(${a}) + (${b})`) bad.push(`${right} is not the sum of the parts`);
        break;
      }
      case "height":
        shows(f.volume, f.l, f.w);
        want(f.volume / (f.l * f.w), "height");
        if (!Number.isInteger(p.answer)) bad.push("height isn't whole");
        break;
      case "compare":
        shows(...f.first, ...f.second);
        f.first.concat(f.second).forEach((v) => edgesOk(v));
        want(Math.abs(vol(f.first) - vol(f.second)), "how much more");
        break;
      case "several":
        shows(f.l, f.w, f.h, f.count);
        want(f.l * f.w * f.h * f.count, "total volume");
        break;
      case "base":
        shows(f.volume, f.h);
        want(f.volume / f.h, "base");
        if (!Number.isInteger(p.answer)) bad.push("base isn't whole");
        break;
      default:
        bad.push("no facts for checks.js");
    }
    // every equation it states is true
    const told = [p.hint, p.explain, ...(p.misc || []).map((m) => m[1]), ...Object.values(p.why || {})]
      .map(plain)
      .join(" | ");
    bad.push(...wrongEquations(told));
    return bad;
  },
};
