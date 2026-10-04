/* Zoo Crew: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. check() works every answer out again from the
   facts each problem carries, checks that those numbers are the ones in the prompt, keeps units changing only from bigger
   to smaller, and checks every sum, difference, and product the game states. */
// the text without its markup, with numbers' commas taken out
const plain = (html) =>
  String(html)
    .replace(/<[^>]*>/g, "")
    .replace(/(\d),(?=\d{3})/g, "$1");
const near = (x, y) => Math.abs(x - y) < 1e-9;
module.exports = {
  limits: {
    times: { dp: 0, nz: 2, max: 100 },
    bigger: { dp: 0, nz: 2, max: 6000 },
    metric: { dp: 0, nz: 3, max: 9950 },
    customary: { dp: 0, nz: 3, max: 600 },
    perimeter: { dp: 0, nz: 2, max: 60 },
  },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      f = p.facts || {},
      prompt = plain(p.prompt),
      numbers = [...prompt.matchAll(/\d+/g)].map((m) => +m[0]),
      labels = (p.choices || []).map((c) => plain(c.label));
    const right = p.kind === "mc" ? labels[p.choices.findIndex((c) => c.id === p.answer)] : null;
    // the numbers a problem was made from are the ones it shows
    const shows = (...values) =>
      values.forEach((v) => {
        if (!numbers.includes(v)) bad.push(`the prompt doesn't show ${v}`);
      });
    const want = (v, what) => {
      if (!near(p.answer, v)) bad.push(`${what}: ${p.answer} should be ${v}`);
    };
    if (!f.t) bad.push("no facts for checks.js");
    // times as many: the bigger amount, how many times, the smaller amount, or how many more
    if (f.t === "times") {
      if (f.ask === "big") (shows(f.small, f.times), want(f.small * f.times, "times as many"));
      if (f.ask === "more") (shows(f.small, f.times), want(f.small * f.times - f.small, "how many more"));
      if (f.ask === "times")
        (shows(f.small, f.big),
          want(f.big / f.small, "how many times"),
          f.big % f.small && bad.push("not a whole number of times"));
      if (f.ask === "small")
        (shows(f.big, f.times),
          want(f.big / f.times, "the smaller amount"),
          f.big % f.times && bad.push("doesn't divide"));
      if (f.ask === "equation") {
        shows(f.small, f.times);
        if (right !== `${f.times} × ${f.small} = ${f.small * f.times}`) bad.push(`the right equation is ${right}`);
      }
    }
    // a change of units: amounts of the big unit times how many small ones make it, plus or minus some of the small unit
    if (f.t === "convert") {
      f.amounts.forEach(([n]) => n && shows(n));
      if (f.minus) shows(f.minus);
      const total = f.amounts.reduce((sum, [n, per]) => sum + n * per, 0) + (f.extra || 0) - (f.minus || 0);
      want(total, "converting");
      if (!(total > 0)) bad.push("nothing is left");
      if (/How many (meters|centimeters|grams|milliliters|ounces|minutes|seconds)/.test(prompt) === false)
        bad.push("the answer isn't in a smaller unit");
    }
    if (f.t === "compare") {
      /* the small unit's choice shows f.small; the big unit's is the other one with a number */
      const smallLabel = labels.find((l) => parseInt(l) === f.small),
        bigLabel = labels.find((l) => /^\d/.test(l) && l !== smallLabel),
        winner = f.big > f.small ? bigLabel : smallLabel;
      if (right !== winner) bad.push(`${right} is not the bigger one (${f.big} vs ${f.small})`);
      if (f.big === f.small) bad.push("they're the same");
    }
    // fences: around a rectangle or a square, a missing width, a square's side, and the pen that needs the most
    if (f.t === "perimeter") (shows(f.len, f.wid), want(2 * (f.len + f.wid), "perimeter"));
    if (f.t === "missing")
      (shows(f.perimeter, f.len),
        want(f.perimeter / 2 - f.len, "missing width"),
        p.answer >= f.len && bad.push("wider than long"));
    if (f.t === "square") (shows(f.side), want(4 * f.side, "square's perimeter"));
    if (f.t === "squareSide") (shows(f.perimeter), want(f.perimeter / 4, "square's side"));
    if (f.t === "most") {
      const perimeters = f.pens.map(([l, w]) => 2 * (l + w)),
        best = f.pens[perimeters.indexOf(Math.max(...perimeters))];
      if (right !== `${best[0]} m by ${best[1]} m`) bad.push(`${right} doesn't need the most fence`);
      f.pens.forEach(([l, w]) => shows(l, w));
    }
    // every sum, difference, and product it states is true
    const told = [p.hint, p.explain, ...(p.misc || []).map((m) => m[1]), ...Object.values(p.why || {})]
      .map(plain)
      .join(" ");
    for (const [text, a, op, b, c] of told.matchAll(/(?<![\d+−×] ?)\b(\d+) ([+−×]) (\d+) = (\d+)\b/g)) {
      const result = op === "+" ? +a + +b : op === "−" ? a - b : a * b;
      if (result !== +c) bad.push(`says ${text}`);
    }
    // real-world sizes: a giraffe up to 5 meters tall, pens up to 15 meters long
    if (/giraffe is (\d+)/.test(prompt) && +prompt.match(/giraffe is (\d+)/)[1] > 5) bad.push("a giraffe that tall");
    return bad;
  },
};
