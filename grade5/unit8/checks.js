/* Moving Up Day: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. check() holds fractions to the year's
   denominators (2 to 12, and common denominators up to 24), works every answer out again from the facts each problem carries,
   checks those numbers are in the prompt, keeps the numbers to the year's limits, and checks every equation the game states
   (214 × 23 = 4,922, 3/6 + 2/6 = 5/6, 0.7 × 0.6 = 0.42). near is the game's: answers must match to the hundredth. */
const LOOSE = { dp: 6, nz: 8, max: 1000000 };
const BASE_DEN = [2, 3, 4, 5, 6, 8, 10, 12];
const lcmOf = (a, b) => {
  const g = (x, y) => (y ? g(y, x % y) : x);
  return (a * b) / g(a, b);
};
// the year's denominators: 2 to 12, common denominators up to 24, and products of fractions with denominators 2 to 6
const FACTOR_DEN = [2, 3, 4, 5, 6];
const DEN = [
  ...new Set([
    ...BASE_DEN,
    ...BASE_DEN.flatMap((b) => BASE_DEN.map((d) => lcmOf(b, d))).filter((d) => d <= 24),
    ...FACTOR_DEN.flatMap((b) => FACTOR_DEN.map((d) => b * d)),
  ]),
];
const near = (x, y) => Math.abs(x - y) < 1e-9;
// The text a student reads, with each stacked fraction written n/d, exponents written ^ (10^4), numbers' commas taken out,
// and its markup gone. A fraction whose top or bottom is a calculation (2 × 3 over 3 × 4) is written (2 × 3)/(3 × 4).
const plain = (html) =>
  String(html)
    .replace(
      /<span class="fr"><span>([^<]*)<\/span><span class="sr">\/<\/span><span>([^<]*)<\/span><\/span>/g,
      (whole, top, bottom) => `${/ /.test(top) ? `(${top})` : top}/${/ /.test(bottom) ? `(${bottom})` : bottom}`,
    )
    .replace(/<sup>(\d+)<\/sup>/g, "^$1")
    .replace(/<[^>]*>/g, "")
    .replace(/(\d),(?=\d{3})/g, "$1")
    .replace(/&amp;/g, "&");
// the value of an expression like "3 ÷ 1/4", "(2 × 5)/3", or "6 + 3/4", with mixed numbers like "1 1/3" and each fraction
// one number; NaN if it isn't one
function evaluate(expr) {
  const js = expr
    .trim()
    .replace(/(\d+) (\d+)\/(\d+)/g, "($1+$2/$3)")
    .replace(/(\d+)\/(\d+)/g, "($1/$2)")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/\^/g, "**");
  if (!/^[\d.\s()+\-*/]+$/.test(js) || /\d\s+\d/.test(js)) return NaN;
  try {
    return Function(`return (${js})`)();
  } catch {
    return NaN;
  }
}
// every chain like "4 ÷ 3 = 4/3 = 1 1/3" whose sides aren't all equal (a chain after a word, an operator, or a "?" is skipped)
function wrongEquations(text) {
  const bad = [];
  // a decimal point counts only between digits, so a sentence's period ends the chain
  const part = String.raw`[\d(](?:[\d^\s()×+−÷/]|\.(?=\d))*`;
  for (const [chain] of text.matchAll(new RegExp(String.raw`(?<![×+−÷?/.^\d]\s*)${part}(?:=\s*${part})+`, "g"))) {
    const values = chain.split("=").map(evaluate);
    if (values.some((v) => !Number.isFinite(v) || !near(v, values[0]))) bad.push(`says ${chain.trim()}`);
  }
  return bad;
}
module.exports = {
  limits: { products: LOOSE, quotients: LOOSE, volume: LOOSE, fractions: LOOSE, decimals: LOOSE, fproducts: LOOSE },
  near: (x, y) => Math.abs(x - y) < 0.005,
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      f = p.facts || {},
      prompt = plain(p.prompt),
      numbers = [...prompt.matchAll(/\d+(?:\.\d+)?/g)].map((m) => +m[0]),
      labels = (p.choices || []).map((c) => plain(c.label)),
      right = p.kind === "mc" ? labels[p.choices.findIndex((c) => c.id === p.answer)] : null;
    const shows = (...values) =>
      values.forEach((v) => {
        if (!numbers.some((n) => near(n, v))) bad.push(`the prompt doesn't show ${v}`);
      });
    const want = (v, what) => {
      if (!near(p.answer, v)) bad.push(`${what}: ${p.answer} should be ${v}`);
    };
    const told = [
      p.prompt,
      p.hint,
      p.explain,
      ...(p.misc || []).map((m) => m[1]),
      ...Object.entries(p.why || {})
        .filter(([id]) => id !== String(p.answer))
        .map(([, m]) => m),
      right,
    ]
      .map(plain)
      .join(" | ");
    for (const [text, d] of [told, ...labels].join(" ").matchAll(/\b\d+\/(\d+)\b/g))
      if (!DEN.includes(+d)) bad.push(`${text}: ${d} is not one of the year's denominators`);
    switch (f.t) {
      case "largest": {
        const ways = [
          [0, 1, 2, 3],
          [0, 2, 1, 3],
          [0, 3, 1, 2],
          [1, 0, 2, 3],
          [2, 0, 1, 3],
          [3, 0, 1, 2],
        ].map(([a, b, c, d]) => (f.digits[a] * 10 + f.digits[b]) * (f.digits[c] * 10 + f.digits[d]));
        if (evaluate(right) !== Math.max(...ways)) bad.push(`${right} isn't the largest product`);
        labels.forEach((label) => {
          const digits = label.replace(/\D/g, "").split("").sort().join("");
          if (digits !== [...f.digits].sort().join("")) bad.push(`${label} doesn't use the cards`);
        });
        break;
      }
      case "product":
        shows(f.a, f.b);
        want(f.a * f.b, "product");
        break;
      case "quotient":
        shows(f.n, f.d);
        if (f.n % f.d) bad.push("has a remainder");
        want(f.n / f.d, "quotient");
        break;
      case "box":
        shows(f.l, f.w, f.h);
        want(f.l * f.w * f.h, "volume");
        break;
      case "estimate": {
        shows(f.l, f.w, f.h);
        const estimate = Math.round(f.l / 10) * 10 * Math.round(f.w / 10) * 10 * f.h;
        if (right !== `about ${estimate} cubic feet`) bad.push(`${right} isn't the estimate ${estimate}`);
        break;
      }
      case "combo": {
        const [[l1, h1, w1], [l2, h2, w2]] = f.parts;
        if (w1 !== w2 || h2 >= h1) bad.push("the stage isn't two boxes side by side");
        want(l1 * h1 * w1 + l2 * h2 * w2, "two boxes");
        break;
      }
      case "add":
      case "subtract": {
        if (f.a === undefined || f.b === undefined) break;
        const value =
          f.c === undefined
            ? f.t === "add"
              ? f.a + f.b
              : f.a - f.b
            : f.t === "add"
              ? f.a / f.b + f.c / f.d
              : f.a / f.b - f.c / f.d;
        if (!(value > 0)) bad.push("not a positive result");
        if (f.c !== undefined && lcmOf(f.b, f.d) > 24) bad.push("common denominator over 24");
        want(value, f.t);
        break;
      }
      case "times":
        shows(f.a, f.b);
        want(f.a * f.b, "decimal product");
        break;
      case "divide":
        shows(f.a, f.b);
        want(f.a / f.b, "decimal quotient");
        break;
      case "fractionTimes":
        want((f.a * f.c) / (f.b * f.d), "fraction product");
        break;
      case "fractionOf":
        shows(f.n);
        if (f.n % f.b) bad.push("doesn't split evenly");
        want((f.a * f.n) / f.b, "a fraction of the ribbons");
        break;
      default:
        bad.push("no facts for checks.js");
    }
    bad.push(...wrongEquations(told));
    return bad;
  },
};
