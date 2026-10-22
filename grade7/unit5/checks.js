/* Deep Dive: limits and real-world checks for tools/fuzz.mjs. Answers may be negative (signed), and max limits their size.
   Per station: dp = most decimal places, nz = most nonzero digits, max = largest value, for the answer and every number in
   the prompt. check() works every answer out again from the numbers each problem carries, keeps multiplying and dividing
   within the 12 × 12 facts, and keeps temperatures, depths, and balances realistic. */
const close = (a, b) => Math.abs(a - b) < 1e-9;
/* the label of the choice that's the answer, as plain text with plain minus signs */
const answerLabel = (p) =>
  p.choices
    .find((c) => c.id === p.answer)
    .label.replace(/<[^>]*>/g, "")
    .replace(/−/g, "-")
    .trim();
module.exports = {
  signed: true,
  limits: {
    temps: { dp: 0, nz: 3, max: 300 },
    add: { dp: 0, nz: 2, max: 100 },
    subtract: { dp: 0, nz: 3, max: 120 },
    multiply: { dp: 0, nz: 3, max: 120 },
    divide: { dp: 0, nz: 3, max: 100 },
    equations: { dp: 0, nz: 3, max: 100 },
  },
  // what's wrong with problem p (an empty list when nothing is), from the facts it carries
  check(p) {
    const bad = [],
      facts = p.facts || {};
    if (!facts.t) return ["no facts for checks.js"];
    const wrongAnswer = (want) => {
      if (p.kind === "num" && !close(p.answer, want)) bad.push(`answer ${p.answer}, but it works out to ${want}`);
    };
    if (p.kind === "num" && !p.neg) bad.push("a typed answer without the minus key");
    // temperatures and elevations
    if (facts.t === "after") wrongAnswer(facts.start + facts.change);
    if (facts.t === "change") wrongAnswer(facts.end - facts.start);
    if (facts.start !== undefined && facts.end !== undefined) {
      if (!close(facts.end, facts.start + facts.change)) bad.push("the temperatures don't match the change");
      if (Math.abs(facts.start) > 20 || Math.abs(facts.end) > 20) bad.push("a temperature past ±20°F");
    }
    if (facts.t === "elevation") {
      wrongAnswer(facts.high - facts.low);
      if (facts.high <= 0 || facts.low >= 0 || facts.low < -200)
        bad.push(`a pelican at ${facts.high} and a fish at ${facts.low}`);
    }
    // adding and subtracting
    if (facts.t === "sum" || facts.t === "debt") wrongAnswer(facts.a + facts.b);
    if (facts.t === "missing") wrongAnswer(facts.b);
    if (facts.t === "diff" || facts.t === "depth") wrongAnswer(facts.a - facts.b);
    if (facts.t === "opposite") {
      const m = answerLabel(p).match(/^(-?\d+) \+ \(?(-?\d+)\)?$/);
      if (!m || +m[1] !== facts.a || +m[2] !== -facts.b)
        bad.push(`"${answerLabel(p)}" isn't ${facts.a} plus the opposite of ${facts.b}`);
    }
    if (facts.t === "depth" && (facts.b >= 0 || facts.b < -100)) bad.push(`a diver at ${facts.b} m`);
    // multiplying and dividing stay within the facts
    if (facts.t === "product" || facts.t === "motion") wrongAnswer(facts.a * facts.b);
    if (["product", "motion", "quotient"].includes(facts.t) && (Math.abs(facts.a) > 12 * 12 || Math.abs(facts.b) > 12))
      bad.push("past the 12 × 12 facts");
    if (facts.t === "sign") {
      const product = facts.factors.reduce((s, f) => s * f, 1);
      if (answerLabel(p) !== (product > 0 ? "Positive" : "Negative")) bad.push("the wrong sign");
    }
    if (facts.t === "quotient") {
      wrongAnswer(facts.a / facts.b);
      if (!Number.isInteger(facts.a / facts.b)) bad.push("a quotient that isn't whole");
    }
    if (facts.t === "rate") {
      wrongAnswer(facts.start + facts.rate * facts.hours);
      if (facts.rate >= 0) bad.push("a negative rate that isn't negative");
    }
    if (facts.t === "rateOf") wrongAnswer(facts.change / facts.hours);
    // expressions and equations: put the answer back in
    if (facts.t === "evaluate") wrongAnswer(facts.a * facts.v + facts.b);
    if (facts.t === "addEq" && !close(p.answer + facts.b, facts.c))
      bad.push("the answer doesn't make the equation true");
    if (facts.t === "mulEq" && !close(facts.a * p.answer, facts.c))
      bad.push("the answer doesn't make the equation true");
    return bad;
  },
};
