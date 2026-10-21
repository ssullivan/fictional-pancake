/* Community Garden: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most
   nonzero digits, max = largest value, for the answer and every number in the prompt. Typed answers can be fractions (1/15 is
   0.066667), so dp and nz are loose; check() holds every fraction to the unit's denominators (2 to 6, and their products),
   works every answer out again from the facts each problem carries, checks those numbers are in the prompt, and checks every
   equation the game states (2/3 × 3/4 = (2 × 3)/(3 × 4) = 6/12 = 1/2, 3 ÷ 1/4 = 12). */
const LOOSE = { dp: 6, nz: 8, max: 40 };
const FACTOR_DEN = [2, 3, 4, 5, 6];
const DEN = [...new Set([...FACTOR_DEN, ...FACTOR_DEN.flatMap((b) => FACTOR_DEN.map((d) => b * d))])];
const near = (x, y) => Math.abs(x - y) < 1e-9;
// The text a student reads, with each stacked fraction written n/d and its markup gone. A fraction whose top or bottom is a
// calculation (2 × 3 over 3 × 4) is written (2 × 3)/(3 × 4).
const plain = (html) =>
  String(html)
    .replace(
      /<span class="fr"><span>([^<]*)<\/span><span class="sr">\/<\/span><span>([^<]*)<\/span><\/span>/g,
      (whole, top, bottom) => `${/ /.test(top) ? `(${top})` : top}/${/ /.test(bottom) ? `(${bottom})` : bottom}`,
    )
    .replace(/<[^>]*>/g, "")
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
    .replace(/−/g, "-");
  if (!/^[\d\s()+\-*/]+$/.test(js) || /\d\s+\d/.test(js)) return NaN;
  try {
    return Function(`return (${js})`)();
  } catch {
    return NaN;
  }
}
// every chain like "4 ÷ 3 = 4/3 = 1 1/3" whose sides aren't all equal (a chain after a word, an operator, or a "?" is skipped)
function wrongEquations(text) {
  const bad = [];
  for (const [chain] of text.matchAll(/(?<![×+−÷?/]\s*)[\d(][\d\s()×+−÷/]*(?:=\s*[\d(][\d\s()×+−÷/]*)+/g)) {
    const values = chain.split("=").map(evaluate);
    if (values.some((v) => !Number.isFinite(v) || !near(v, values[0]))) bad.push(`says ${chain.trim()}`);
  }
  return bad;
}
module.exports = {
  limits: { piece: LOOSE, multiply: LOOSE, divunit: LOOSE, divwhole: LOOSE, which: LOOSE },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      f = p.facts || {},
      prompt = plain(p.prompt),
      labels = (p.choices || []).map((c) => plain(c.label)),
      right = p.kind === "mc" ? labels[p.choices.findIndex((c) => c.id === p.answer)] : null;
    // the prompt shows each fraction and number given
    const shows = (...texts) =>
      texts.forEach((text) => {
        if (!new RegExp(`(^|[^\\d/])${String(text).replace("/", "\\/")}(?![\\d/])`).test(prompt))
          bad.push(`the prompt doesn't show ${text}`);
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
    // every fraction multiplied or divided has a denominator from 2 to 6 and is less than 1
    const fractionOk = (a, b) => {
      if (!FACTOR_DEN.includes(b) || a < 1 || a >= b)
        bad.push(`${a}/${b} is not a fraction less than 1 with a small denominator`);
    };
    switch (f.t) {
      case "piece":
        fractionOk(1, f.a);
        fractionOk(1, f.b);
        shows(`1/${f.a}`, `1/${f.b}`);
        want(1 / (f.a * f.b), "a piece of a part");
        break;
      case "pieceExpr":
        rightIs(`1/${f.a} × 1/${f.b}`, "the dark piece");
        break;
      case "product":
        fractionOk(f.a, f.b);
        fractionOk(f.c, f.d);
        shows(`${f.a}/${f.b}`, `${f.c}/${f.d}`);
        want((f.a * f.c) / (f.b * f.d), "product");
        break;
      case "productExpr":
        shows(`${f.a}/${f.b}`, `${f.c}/${f.d}`);
        if (labels.filter((label) => near(evaluate(label), (f.a * f.c) / (f.b * f.d))).length !== 1)
          bad.push("not exactly one choice is the product");
        if (!near(evaluate(right), (f.a * f.c) / (f.b * f.d))) bad.push(`${right} is not the product`);
        break;
      case "size":
        fractionOk(f.a, f.b);
        rightIs(`Less than ${f.c}/${f.d}`, "less, since a/b < 1");
        break;
      case "divUnit":
        fractionOk(1, f.b);
        shows(`1/${f.b}`, f.n);
        if (f.n < 2 || f.n > 5) bad.push(`${f.n} is not a small whole number`);
        want(1 / (f.b * f.n), "1/b ÷ n");
        break;
      case "divUnitExpr":
        shows(`1/${f.b}`, f.n);
        rightIs(`1/${f.b} ÷ ${f.n}`, "sharing 1/b");
        break;
      case "divWhole":
        fractionOk(1, f.b);
        shows(`1/${f.b}`, f.n);
        want(f.n * f.b, "n ÷ 1/b");
        break;
      case "divWholeExpr":
        shows(`1/${f.b}`, f.n);
        rightIs(`${f.n} ÷ 1/${f.b}`, "how many 1/b in n");
        break;
      case "greater":
        rightIs(`${f.n} ÷ 1/${f.b}`, `greater than ${f.n}`);
        if (labels.filter((label) => evaluate(label) > f.n).length !== 1) bad.push("not exactly one choice is greater");
        break;
      case "which":
      case "solve": {
        const value = { share: 1 / (f.b * f.n), howMany: f.n * f.b, of: 1 / (f.a * f.d) }[f.kind],
          words = { share: /shares .* equally among/, howMany: /How many .* are in/, of: /of the herbs are/ }[f.kind];
        if (!words.test(prompt)) bad.push(`the story isn't a ${f.kind} story`);
        if (f.t === "solve") want(value, `${f.kind} story`);
        else
          rightIs(
            { share: `1/${f.b} ÷ ${f.n}`, howMany: `${f.n} ÷ 1/${f.b}`, of: `1/${f.a} × 1/${f.d}` }[f.kind],
            `the ${f.kind} story`,
          );
        break;
      }
      default:
        bad.push("no facts for checks.js");
    }
    bad.push(...wrongEquations(told));
    return bad;
  },
};
