/* Trail Rangers: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. check() holds fractions to the unit's
   denominators (2 to 12, and common denominators up to 24), works every answer out again from the facts each problem carries,
   checks those numbers are in the prompt, keeps measurements realistic, and checks every equation the game states
   (3.5 × 100 = 350, 10^4 = 10,000, 4/12 + 3/12 = 7/12). near is the game's: answers must match to the hundredth. */
const LOOSE = { dp: 6, nz: 8, max: 1000000 };
const BASE_DEN = [2, 3, 4, 5, 6, 8, 10, 12];
const lcmOf = (a, b) => {
  const g = (x, y) => (y ? g(y, x % y) : x);
  return (a * b) / g(a, b);
};
const DEN = [
  ...new Set([...BASE_DEN, ...BASE_DEN.flatMap((b) => BASE_DEN.map((d) => lcmOf(b, d))).filter((d) => d <= 24)]),
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
  limits: { powers: LOOSE, metric: LOOSE, customary: LOOSE, unlike: LOOSE, plots: LOOSE, size: LOOSE },
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
    const rightIs = (label, what) => {
      if (right !== label) bad.push(`${right} is not ${what} (${label})`);
    };
    // what the game tells a student: the prompt, hint, worked answer, each mistake's message, and the right choice
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
    // every fraction shown uses the unit's denominators
    for (const [text, d] of [told, ...labels].join(" ").matchAll(/\b\d+\/(\d+)\b/g))
      if (!DEN.includes(+d)) bad.push(`${text}: ${d} is not one of the unit's denominators`);
    const count = (counts) => Object.values(counts).reduce((x, y) => x + y, 0);
    switch (f.t) {
      case "times":
        shows(f.start, 10 ** f.p);
        want(f.start * 10 ** f.p, "× a power of 10");
        break;
      case "divide":
        shows(f.n, 10 ** f.p);
        want(f.n / 10 ** f.p, "÷ a power of 10");
        break;
      case "exponent":
        shows(f.a, f.p);
        want(f.a * 10 ** f.p, "× 10 to a power");
        break;
      case "power":
        rightIs(`10^${f.p}`, "the power");
        if (prompt.split("10 ×").length !== f.p) bad.push(`the prompt doesn't multiply ${f.p} tens`);
        break;
      case "toSmall":
        shows(f.amount);
        want(f.amount * f.per, "converted to the smaller unit");
        break;
      case "toBig":
        shows(f.amount);
        want(f.amount / f.per, "converted to the bigger unit");
        break;
      case "bottles":
        shows(f.each, f.count);
        want((f.each * f.count) / 1000, "liters");
        if ((f.each * f.count) / 1000 > 5) bad.push("too much water to carry");
        break;
      case "trail":
        shows(f.km, ...f.parts);
        want(f.km + (f.parts[0] + f.parts[1]) / 1000, "trail in kilometers");
        break;
      case "feetInches":
        shows(f.feet, f.inches);
        if (f.inches >= 12) bad.push("12 inches or more should be a foot");
        want(f.feet * 12 + f.inches, "inches");
        break;
      case "pieces":
        shows(f.feet, f.piece);
        if ((f.feet * 12) % f.piece) bad.push("pieces don't fit evenly");
        want((f.feet * 12) / f.piece, "pieces");
        break;
      case "add":
      case "subtract": {
        const value = f.t === "add" ? f.a / f.b + f.c / f.d : f.a / f.b - f.c / f.d;
        if (!(value > 0)) bad.push("not a positive result");
        if (lcmOf(f.b, f.d) > 24) bad.push("common denominator over 24");
        if (!prompt.includes(`${f.a}/${f.b}`) || !prompt.includes(`${f.c}/${f.d}`))
          bad.push("the prompt doesn't show the fractions");
        want(value, f.t);
        break;
      }
      case "same":
        if (!near(evaluate(right), f.a / f.b + f.c / f.d)) bad.push(`${right} isn't the sum`);
        if (labels.filter((label) => near(evaluate(label), f.a / f.b + f.c / f.d)).length !== 1)
          bad.push("not exactly one choice is the sum");
        break;
      case "mixed": {
        const first = f.first + f.a / f.b,
          second = f.second + f.c / f.d;
        if (f.a / f.b >= f.c / f.d) bad.push("no whole to trade");
        want(first - second, "mixed difference");
        break;
      }
      case "spread": {
        const values = Object.keys(f.counts).map(Number);
        want((Math.max(...values) - Math.min(...values)) / 8, "spread");
        if (count(f.counts) < 8) bad.push("too few days");
        break;
      }
      case "total":
        want((f.counts[f.k] * f.k) / 8, "total at one amount");
        if (!f.counts[f.k]) bad.push("no days at that amount");
        break;
      case "more":
        want(
          Object.keys(f.counts)
            .map(Number)
            .filter((v) => v > f.cut)
            .reduce((n, v) => n + f.counts[v], 0),
          "days with more",
        );
        break;
      case "compare": {
        shows(f.n);
        const kind = f.a < f.b ? "Less" : f.a === f.b ? "Equal" : "More";
        if (!right.startsWith(kind)) bad.push(`${right} for ${f.a}/${f.b} × ${f.n}`);
        break;
      }
      case "greater":
        rightIs(`${f.big}/${f.b} × ${f.n}`, "greater");
        if (labels.filter((label) => evaluate(label) > f.n).length !== 1) bad.push("not exactly one is greater");
        break;
      default:
        bad.push("no facts for checks.js");
    }
    bad.push(...wrongEquations(told));
    return bad;
  },
};
