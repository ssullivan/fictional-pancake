/* Track Meet: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. check() works every answer out again from the
   facts each problem carries (in thousandths, so the math is exact), checks those numbers are in the prompt, keeps race times
   realistic, and checks every equation the game states (6 × 0.4 = 2.4, 3.476 rounds to 3.5). near is the game's: answers
   must match to the thousandth. */
// the text without its markup, with stacked fractions written n/d and numbers' commas taken out
const plain = (html) =>
  String(html)
    .replace(/<span class="fr"><span>([^<]*)<\/span><span class="sr">\/<\/span><span>([^<]*)<\/span><\/span>/g, "$1/$2")
    .replace(/<[^>]*>/g, " ")
    .replace(/(\d),(?=\d{3})/g, "$1");
const close = (x, y) => Math.abs(x - y) < 1e-9;
// k thousandths as a decimal, as short as it goes (as figs.js writes it)
const dec = (k) => String(+(k / 1000).toFixed(3));
// every chain like "6 × 0.4 = 2.4" or "1.2 ÷ 4 = 0.3" whose sides aren't all equal (a chain after an operator or "?" is skipped)
function wrongEquations(text) {
  const bad = [];
  // a decimal point counts only between digits, so a sentence's period ends the chain
  const part = String.raw`[\d(](?:[\d/\s()×+−÷]|\.(?=\d))*`;
  for (const [chain] of text.matchAll(new RegExp(String.raw`(?<![×+−÷?./\d]\s*)${part}(?:=\s*${part})+`, "g"))) {
    const values = chain.split("=").map((side) => {
      const js = side.trim().replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
      if (!/^[\d.\s()+\-*/]+$/.test(js) || /\d\s+\d/.test(js)) return NaN;
      try {
        return Function(`return (${js})`)();
      } catch {
        return NaN;
      }
    });
    if (values.some((v) => !Number.isFinite(v) || Math.abs(v - values[0]) > 1e-9)) bad.push(`says ${chain.trim()}`);
  }
  return bad;
}
const LIMIT = { dp: 3, nz: 5, max: 1000 };
module.exports = {
  limits: { read: LIMIT, compare: LIMIT, round: LIMIT, addsub: LIMIT, multiply: LIMIT, divide: LIMIT },
  near: (x, y) => Math.abs(x - y) < 0.0005,
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      f = p.facts || {},
      prompt = plain(p.prompt),
      numbers = [...prompt.matchAll(/\d+(?:\.\d+)?/g)].map((m) => m[0]),
      labels = (p.choices || []).map((c) => plain(c.label).trim()),
      right = p.kind === "mc" ? labels[p.choices.findIndex((c) => c.id === p.answer)] : null;
    // the prompt shows each number, written as the game writes it
    const shows = (...texts) =>
      texts.forEach((text) => {
        if (!numbers.includes(String(text))) bad.push(`the prompt doesn't show ${text}`);
      });
    const want = (v, what) => {
      if (!close(p.answer, v)) bad.push(`${what}: ${p.answer} should be ${v}`);
    };
    const rightIs = (label, what) => {
      if (right !== label) bad.push(`${right} is not ${what} (${label})`);
    };
    // a race time for 100 meters is from 11 to 20 seconds
    const timeOk = (k) => {
      if (k < 11000 || k > 20000) bad.push(`${dec(k)} seconds is not a 100-meter time`);
    };
    const roundK = (k, unit) => Math.floor(k / unit + 0.5) * unit;
    switch (f.t) {
      case "words":
        want(f.k / 1000, "words to a decimal");
        break;
      case "digit": {
        shows(dec(f.k));
        const digit = Math.floor((f.k % 1000) / f.size) % 10;
        if (!new RegExp(`digit ${digit} in`).test(prompt)) bad.push("the prompt asks about another digit");
        if ([...String(f.k % 1000)].filter((d) => +d === digit).length !== 1) bad.push("the digit appears twice");
        want((digit * f.size) / 1000, "a digit's value");
        break;
      }
      case "expanded":
        shows(f.whole, dec(f.parts[0]), dec(f.parts[1]));
        want((f.whole * 1000 + f.parts[0] + f.parts[1]) / 1000, "expanded form");
        break;
      case "fraction":
        want(f.n / 1000, "n/1000");
        break;
      case "same":
        if (+right !== f.k / 1000) bad.push(`${right} is not ${dec(f.k)}`);
        if (labels.filter((label) => +label === f.k / 1000).length !== 1) bad.push("not exactly one choice is equal");
        break;
      case "faster": {
        timeOk(f.a);
        timeOk(f.b);
        shows(dec(f.a), dec(f.b));
        rightIs(f.a === f.b ? "They tied" : f.a < f.b ? f.first : f.second, "the faster runner");
        break;
      }
      case "order": {
        const sorted = [...f.list]
          .sort((x, y) => x - y)
          .map(dec)
          .join(", ");
        rightIs(sorted, "least to greatest");
        break;
      }
      case "line": {
        if (f.k <= f.lo || f.k >= f.lo + 10) bad.push("the point isn't between the ends");
        shows(dec(f.k));
        if (p.answer !== String(f.k)) bad.push(`tap ${p.answer} is not ${dec(f.k)}`);
        break;
      }
      case "round":
        shows(dec(f.k));
        if ((f.k % f.unit) * 2 === f.unit) bad.push("exactly halfway");
        want(roundK(f.k, f.unit) / 1000, "rounded");
        break;
      case "roundsTo":
        if (labels.filter((label) => roundK(Math.round(+label * 1000), f.unit) === f.target).length !== 1)
          bad.push("not exactly one choice rounds to it");
        if (roundK(Math.round(+right * 1000), f.unit) !== f.target)
          bad.push(`${right} doesn't round to ${dec(f.target)}`);
        break;
      case "add":
        timeOk(f.a + 10000);
        shows(dec(f.a), dec(f.b));
        want((f.a + f.b) / 1000, "sum");
        break;
      case "subtract":
        shows(dec(f.big), dec(f.small));
        want((f.big - f.small) / 1000, "difference");
        break;
      case "estimate":
        shows(dec(f.a), dec(f.b));
        rightIs(String(Math.round(f.a / 1000) + Math.round(f.b / 1000)), "the estimate");
        break;
      case "times":
        shows(f.n, dec(f.k));
        want((f.n * f.k) / 1000, "product");
        break;
      case "tenthsTimes":
        shows(dec(f.a * 100), dec(f.b * 100));
        want((f.a * f.b) / 100, "tenths × tenths");
        break;
      case "divide":
        shows(dec(f.n), dec(f.d));
        want(f.n / f.d, "quotient");
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
