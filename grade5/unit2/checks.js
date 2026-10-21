/* Picnic Park: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. Typed answers can be fractions (5/3 is
   1.666667), so dp and nz are loose; check() holds every fraction to Grade 5's denominators, works every answer out again from
   the facts each problem carries, checks those numbers are in the prompt, and checks every equation the game states
   (4 ÷ 3 = 4/3 = 1 1/3, 3 × (12 ÷ 4) = 9). */
const LOOSE = { dp: 6, nz: 8, max: 60 };
const DEN = [2, 3, 4, 5, 6, 8, 10, 12];
const near = (x, y) => Math.abs(x - y) < 1e-9;
// The text a student reads, with each stacked fraction written n/d and its markup gone. A fraction whose top is a calculation
// (2 × 5 over 3) is written (2 × 5)/3.
const plain = (html) =>
  String(html)
    .replace(
      /<span class="fr"><span>([^<]*)<\/span><span class="sr">\/<\/span><span>([^<]*)<\/span><\/span>/g,
      (whole, top, bottom) => `${/ /.test(top) ? `(${top})` : top}/${bottom}`,
    )
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&");
// the value of an expression like "3 × (12 ÷ 4)", "(2 × 5)/3", or "6 + 3/4", with mixed numbers like "1 1/3"; NaN if it isn't one
function evaluate(expr) {
  const js = expr
    .trim()
    .replace(/(\d+) (\d+)\/(\d+)/g, "($1+$2/$3)")
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
  limits: { share: LOOSE, stories: LOOSE, of: LOOSE, area: LOOSE, decompose: LOOSE },
  // what's wrong with problem p in the real world (an empty list when nothing is)
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
    // every fraction shown uses Grade 5's denominators
    for (const [text, d] of [told, ...labels].join(" ").matchAll(/\b\d+\/(\d+)\b/g))
      if (!DEN.includes(+d)) bad.push(`${text}: ${d} is not one of Grade 5's denominators`);
    switch (f.t) {
      case "share":
        shows(f.a, f.b);
        if (f.a > 8 || f.b > 8) bad.push("too many to share at a picnic");
        want(f.a / f.b, "each share");
        break;
      case "shareExpr":
        shows(f.a, f.b);
        rightIs(`${f.a} ÷ ${f.b}`, "the share");
        break;
      case "shareStory":
        rightIs(
          labels.find((label) => label.startsWith(`${f.a} `) && label.endsWith(`shared equally by ${f.b} friends`)),
          `${f.a} shared by ${f.b}`,
        );
        if (!right || evaluate(prompt.match(/matches ([\d ÷]+) =/)[1]) !== f.a / f.b)
          bad.push("the equation isn't a ÷ b");
        break;
      case "shared":
        shows(f.b);
        if (!prompt.includes(`${f.a}/${f.b}`)) bad.push("the prompt doesn't show the share");
        want(f.a, "how many were shared");
        break;
      case "split":
        shows(f.a, f.b);
        if (f.a / f.b > 4) bad.push(`${f.a / f.b} is a lot for one part`);
        want(f.a / f.b, "each part");
        break;
      case "mixed": {
        const whole = Math.floor(f.a / f.b);
        rightIs(`${whole} ${f.a % f.b}/${f.b}`, `${f.a} ÷ ${f.b}`);
        shows(f.a, f.b);
        break;
      }
      case "missing":
        if (!prompt.includes(`${f.a}/${f.b}`)) bad.push("the prompt doesn't show the fraction");
        want(f.askTop ? f.a : f.b, "the missing number");
        break;
      case "line": {
        shows(f.a, f.b);
        const ticks = [...p.fig(false).matchAll(/data-id="(\d+)"/g)].map((m) => +m[1]);
        if (!ticks.includes(f.a)) bad.push("the number line doesn't reach the answer");
        if (p.answer !== String(f.a)) bad.push(`tap ${p.answer} is not ${f.a}/${f.b}`);
        break;
      }
      case "ofExpr":
        shows(f.a, f.b, f.n);
        rightIs(`${f.a} × (${f.n} ÷ ${f.b})`, "a × (n ÷ b)");
        if (labels.filter((label) => near(evaluate(label), (f.a * f.n) / f.b)).length !== 1)
          bad.push("not exactly one choice has the value");
        break;
      case "of":
        shows(f.b, f.n);
        if (f.n % f.b) bad.push("the berries don't split evenly");
        want((f.a * f.n) / f.b, "a fraction of the berries");
        break;
      case "ofFrac":
        shows(f.a, f.b, f.n);
        want((f.a * f.n) / f.b, "a fraction of the pounds");
        break;
      case "area": {
        const [wn, wd] = f.w,
          [hn, hd] = f.h;
        if (wn / wd > 8 || hn / hd > 8) bad.push("a side is too long");
        want((wn / wd) * (hn / hd), "area");
        break;
      }
      case "splitExpr":
        shows(f.n, f.whole);
        rightIs(`(${f.n} × ${f.whole}) + (${f.n} × ${f.a}/${f.b})`, "split by parts");
        break;
      default:
        bad.push("no facts for checks.js");
    }
    bad.push(...wrongEquations(told));
    return bad;
  },
};
