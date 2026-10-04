/* Year-End Fair: limits and checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero digits, max =
   largest value, for the answer and every number in the prompt. Typed answers can be fractions, so the fraction station's dp
   and nz are loose. check() works every answer out again from the facts each problem carries, and checks that those numbers
   are the ones in the prompt. */
const plain = (html) =>
  String(html)
    .replace(/<[^>]*>/g, "")
    .replace(/(\d),(?=\d{3})/g, "$1");
const near = (x, y) => Math.abs(x - y) < 1e-9;
const roundTo = (n, unit) => Math.floor(n / unit + 0.5) * unit;
module.exports = {
  limits: {
    fractions: { dp: 6, nz: 7, max: 40 },
    algorithms: { dp: 0, nz: 4, max: 99999 },
    compare: { dp: 0, nz: 3, max: 810 },
    problems: { dp: 0, nz: 3, max: 500 },
    estimate: { dp: 0, nz: 4, max: 20000 },
  },
  // what's wrong with problem p (an empty list when nothing is)
  check(p) {
    const bad = [],
      f = p.facts || {},
      prompt = plain(p.prompt),
      numbers = [...prompt.matchAll(/\d+/g)].map((m) => +m[0]),
      labels = (p.choices || []).map((c) => plain(c.label)),
      right = p.kind === "mc" ? labels[p.choices.findIndex((c) => c.id === p.answer)] : null;
    const shows = (...values) =>
      values.forEach((v) => {
        if (!numbers.includes(v)) bad.push(`the prompt doesn't show ${v}`);
      });
    const want = (v, what) => {
      if (!near(p.answer, v)) bad.push(`${what}: ${p.answer} should be ${v}`);
    };
    switch (f.t) {
      case "add":
        if (f.d) (shows(...f.nums, f.d), want(f.nums.reduce((x, y) => x + y) / f.d, "fraction sum"));
        else (shows(f.a, f.b), want(f.a + f.b, "sum"));
        break;
      case "subtract":
        if (f.d) want((f.start - f.minus) / f.d, "fraction difference");
        else (shows(f.a, f.b), want(f.a - f.b, "difference"));
        break;
      case "times":
        shows(f.n, f.a, f.d);
        want((f.n * f.a) / f.d, "groups of a fraction");
        break;
      case "choose": {
        /* the story's expression: one amount plus 1/d more, what's left minus what's eaten, or n groups of a/d */
        const expected = {
          "+": `${f.a}/${f.d} + 1/${f.d}`,
          "−": `${f.d - 1}/${f.d} − ${f.a}/${f.d}`,
          "×": `${f.n} × ${f.a}/${f.d}`,
        }[f.op];
        if (right !== expected) bad.push(`${right} is not ${expected}`);
        break;
      }
      case "multiply":
        shows(f.a, f.b);
        want(f.a * f.b, "product");
        break;
      case "divide":
        shows(f.n, f.d);
        want(f.n / f.d, "quotient");
        if (f.n % f.d) bad.push("doesn't divide");
        break;
      case "compare":
        want(
          { big: f.small * f.times, times: f.times, small: f.small, more: f.small * f.times - f.small }[f.ask],
          `compare ${f.ask}`,
        );
        if (f.big !== f.small * f.times) bad.push("big isn't small × times");
        break;
      case "twoStep":
        shows(f.a, f.b, f.minus);
        want(f.a * f.b - f.minus, "two steps");
        if (f.minus > f.a * f.b) bad.push("gives away more than it has");
        break;
      case "remainder":
        shows(f.n, f.d);
        if (!(f.n % f.d)) bad.push("no remainder");
        want(Math.floor(f.n / f.d) + (f.up ? 1 : 0), "remainder story");
        break;
      case "bestEstimate": {
        shows(f.a, f.b);
        const estimate = roundTo(f.a, 10) * roundTo(f.b, 10);
        if (+right !== estimate) bad.push(`${right} is not the best estimate, ${estimate}`);
        break;
      }
      case "roundAdd":
        shows(f.a, f.b);
        want(roundTo(f.a, f.unit) + roundTo(f.b, f.unit), "rounded sum");
        break;
      default:
        bad.push("no facts for checks.js");
    }
    // every whole-number sum, difference, product, and quotient it states is true
    const told = [p.hint, p.explain, ...(p.misc || []).map((m) => m[1])].map(plain).join(" ");
    for (const [text, a, op, b, c] of told.matchAll(
      /(?<![\d+−×÷\/] ?)\b(\d+) ([+−×÷]) (\d+) = (\d+)\b(?! [+−×÷]| R|\/)/g,
    )) {
      const result = op === "+" ? +a + +b : op === "−" ? a - b : op === "×" ? a * b : a / b;
      if (result !== +c) bad.push(`says ${text}`);
    }
    return bad;
  },
};
