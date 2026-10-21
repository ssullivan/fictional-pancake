/* Record Breakers: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. check() works every answer out again from the
   facts each problem carries, checks those numbers are in the prompt, holds the numbers to the unit's limits (friendly
   divisors, at most two carries), and checks every equation the game states (347 × 6 = 2,082, 50 + 20 + 2 = 72). */
// the text without its markup, with numbers' commas taken out
const plain = (html) =>
  String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/(\d),(?=\d{3})/g, "$1");
const near = (x, y) => Math.abs(x - y) < 1e-9;
const DIVISORS = [11, 12, 15, 20, 25, 30, 40, 50];
// the expressions in a chain like "4 × 3 = 12" are all equal (a chain that starts after a word, an operator, or "?" is skipped)
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
// how many columns of a × b (b one digit) carry
const carries = (a, b) => {
  let carry = 0,
    count = 0;
  [...String(a)].reverse().forEach((d, i, all) => {
    const val = d * b + carry;
    carry = i === all.length - 1 ? 0 : Math.floor(val / 10);
    if (carry) count++;
  });
  return count;
};
module.exports = {
  limits: {
    // estimates start from numbers that are not friendly (that is the point), and a claimed product can be 10 times too big
    estimate: { dp: 0, nz: 6, max: 1000000 },
    partial: { dp: 0, nz: 4, max: 60000 },
    standard: { dp: 0, nz: 4, max: 40000 },
    quotients: { dp: 0, nz: 4, max: 2500 },
    sides: { dp: 0, nz: 4, max: 2500 },
    work: { dp: 0, nz: 4, max: 5000 },
  },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      f = p.facts || {},
      prompt = plain(p.prompt),
      numbers = [...prompt.matchAll(/\d+/g)].map((m) => +m[0]),
      labels = (p.choices || []).map((c) => plain(c.label).trim()),
      right = p.kind === "mc" ? labels[p.choices.findIndex((c) => c.id === p.answer)] : null;
    const shows = (...values) =>
      values.forEach((v) => {
        if (!numbers.includes(v)) bad.push(`the prompt doesn't show ${v}`);
      });
    const want = (v, what) => {
      if (!near(p.answer, v)) bad.push(`${what}: ${p.answer} should be ${v}`);
    };
    const round = (n, unit) => Math.floor(n / unit + 0.5) * unit;
    // a list of numbers joined by " + " adds up to the total
    const sumOf = (label) => label.split(" + ").reduce((x, y) => x + +y, 0);
    const divisorOk = (d) => {
      if (!DIVISORS.includes(d)) bad.push(`${d} is not a friendly divisor`);
    };
    switch (f.t) {
      case "estimate":
        shows(f.a, f.b);
        if (right !== String(round(f.a, 100) * round(f.b, 10))) bad.push(`${right} is not the estimate`);
        break;
      case "reasonable": {
        shows(f.a, f.b, f.claim);
        const ok = f.claim === f.a * f.b;
        if (!right.startsWith(ok ? "Yes: it’s close" : "No:")) bad.push(`${right} for ${f.a} × ${f.b} = ${f.claim}`);
        break;
      }
      case "estimateNum":
        shows(f.a, f.b);
        want(round(f.a, 100) * round(f.b, 10), "estimate");
        break;
      case "product":
        shows(f.a, f.b);
        if (f.b < 10 && (carries(f.a, f.b) < 1 || carries(f.a, f.b) > 2)) bad.push("needs one or two carries");
        want(f.a * f.b, "product");
        break;
      case "partials": {
        shows(f.a, f.b);
        if (sumOf(right) !== f.a * f.b) bad.push(`${right} doesn't add to ${f.a * f.b}`);
        if (labels.filter((label) => sumOf(label) === f.a * f.b).length !== 1) bad.push("not exactly one list adds up");
        break;
      }
      case "piece":
        shows(f.col, f.row);
        want(f.col * f.row, "partial product");
        break;
      case "tensRow":
        shows(f.a, f.b);
        want(f.a * Math.floor(f.b / 10) * 10, "the second row");
        break;
      case "quotient":
        shows(f.n, f.d);
        divisorOk(f.d);
        if (f.n % f.d) bad.push("has a remainder");
        want(f.n / f.d, "quotient");
        break;
      case "left":
        shows(f.n, f.d, f.chunk);
        divisorOk(f.d);
        want(f.n - f.chunk * f.d, "what's left");
        break;
      case "chunks":
        shows(f.n, f.d);
        if (sumOf(right) * f.d !== f.n) bad.push(`${right} isn't ${f.n} ÷ ${f.d}`);
        if (labels.filter((label) => sumOf(label) * f.d === f.n).length !== 1) bad.push("not exactly one list works");
        break;
      case "side":
        shows(f.area, f.known);
        if (f.area % f.known) bad.push("the side isn't whole");
        want(f.area / f.known, "missing side");
        break;
      case "milk":
        shows(f.perDay, f.days, f.perCase);
        want((f.perDay * f.days) / f.perCase, "cases of milk");
        break;
      case "trash":
        shows(f.perHome, f.homes, f.weeks);
        want(f.perHome * f.homes * f.weeks, "pounds of trash");
        break;
      case "trips":
        shows(f.load, f.pounds);
        if (f.pounds % f.load === 0) bad.push("no paper left over: no rounding up");
        want(Math.ceil(f.pounds / f.load), "trips");
        break;
      default:
        bad.push("no facts for checks.js");
    }
    const told = [p.hint, p.explain, ...(p.misc || []).map((m) => m[1]), ...Object.values(p.why || {})]
      .map(plain)
      .join(" | ");
    bad.push(...wrongEquations(told));
    return bad;
  },
};
