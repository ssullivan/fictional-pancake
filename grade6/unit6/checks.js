/* Balance Lab: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero digits,
   max = largest value, for the answer and every number in the prompt. Hanger Lab and Power Up have fraction answers (7/3 is
   2.333333), so dp and nz are loose there; check() holds the fractions to friendly sizes instead, using the facts each problem
   carries. */
const LOOSE = { dp: 6, nz: 8 };
// a number's decimal places as written
const places = (v) => (String(Math.round(v * 1e6) / 1e6).split(".")[1] || "").length;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
module.exports = {
  limits: {
    tape: { dp: 0, nz: 3, max: 100 },
    hang: { ...LOOSE, max: 20 },
    write: { dp: 2, nz: 3, max: 400 },
    equiv: { dp: 0, nz: 3, max: 60 },
    split: { dp: 0, nz: 3, max: 100 },
    power: { ...LOOSE, max: 10000 },
    graph: { dp: 0, nz: 3, max: 216 },
  },
  // what's wrong with problem p in the real world (an empty list when nothing is), from the facts it carries
  check(p, zone) {
    const bad = [],
      facts = p.facts || {};
    if (!facts.t) bad.push("no facts for checks.js");
    // friendly fractions: denominators up to 12 with no sevenths, ninths, or elevenths; a fraction to a power may square them
    const friendly = facts.t === "small" ? [1, 2, 4, 8, 9, 16, 25, 100] : [1, 2, 3, 4, 5, 6, 8, 10, 12];
    for (const [n, d] of facts.f || []) {
      if (!(Number.isInteger(n) && Number.isInteger(d) && d > 0)) bad.push(`${n}/${d} is not a fraction`);
      else if (!friendly.includes(d)) bad.push(`denominator ${d} is not friendly`);
    }
    // decimals in a problem have at most 2 places
    for (const v of facts.dec || []) if (places(v) > 2) bad.push(`${v} has more than 2 decimal places`);
    // a hanger's two sides really weigh the same
    if (facts.balance && facts.balance[0] !== facts.balance[1]) bad.push(`hanger sides ${facts.balance} don't balance`);
    // counts of people and things are whole numbers
    for (const v of facts.count || []) if (!(Number.isInteger(v) && v > 0)) bad.push(`a count of ${v}`);
    // a percent's part is less than its whole
    if (facts.pct && !(facts.pct[0] < facts.pct[1]))
      bad.push(`a part of ${facts.pct[0]} from a whole of ${facts.pct[1]}`);
    // prices come in quarters
    for (const v of facts.money || []) if (Math.round(v * 100) % 25) bad.push(`price $${v} is not friendly`);
    // ages are realistic
    for (const v of facts.age || []) if (v > 90) bad.push(`an age of ${v}`);
    // powers stay at 1,000 or less (10,000 for powers of 10), so they can be worked out by hand
    if (facts.pow) {
      const [base, exponent] = facts.pow;
      if (base ** exponent > (base === 10 ? 10000 : 1000)) bad.push(`${base}^${exponent} is too big`);
    }
    // coefficients and other small numbers stay at 12 or less
    for (const v of facts.coef || []) if (v > 12) bad.push(`coefficient ${v} is too big`);
    // factoring: the greatest common factor is more than 1 and really is the greatest
    if (facts.factor) {
      const [c, k, g] = facts.factor;
      if (g < 2 || gcd(c, k) !== g) bad.push(`${g} is not the greatest common factor of ${c} and ${k}`);
    }
    // rates are friendly
    for (const v of facts.rate || []) if (v > 24) bad.push(`a rate of ${v}`);
    // every solution is positive: negative numbers come in Unit 7
    if (p.kind === "num" && !(p.answer > 0)) bad.push(`answer ${p.answer} is not positive`);
    return bad;
  },
};
