/* Wheel Works: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt (answers with π are the number in front of
   it). check() works every answer out again from the radius, diameter, and turns each problem carries, and checks the
   choice that's right in the multiple-choice problems. */
const close = (a, b) => Math.abs(a - b) < 1e-9;
/* the label of the choice that's the answer, without its tags */
const answerLabel = (p) =>
  p.choices
    .find((c) => c.id === p.answer)
    .label.replace(/<[^>]*>/g, "")
    .trim();
/* a number as written: commas and up to 2 decimal places (the same as figs.js) */
const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });
/* realistic radii, in their units: a coin is at least 1 cm across, a Ferris wheel at most 30 m in radius */
const SMALLEST = { cm: 1, inches: 4, m: 1, feet: 2 },
  LARGEST = { cm: 70, inches: 8, m: 30, feet: 10 };
module.exports = {
  limits: {
    parts: { dp: 1, nz: 2, max: 140 },
    circum: { dp: 2, nz: 4, max: 450 },
    wheels: { dp: 2, nz: 3, max: 25000 },
    area: { dp: 2, nz: 4, max: 15500 },
    pieces: { dp: 0, nz: 2, max: 72 },
    which: { dp: 0, nz: 2, max: 100 },
  },
  // what's wrong with problem p (an empty list when nothing is), from the facts it carries
  check(p) {
    const bad = [],
      facts = p.facts || {};
    if (!facts.t) return ["no facts for checks.js"];
    const wrongAnswer = (want) => {
      if (p.kind === "num" && !close(p.answer, want)) bad.push(`answer ${p.answer}, but it works out to ${want}`);
    };
    const wrongChoice = (want) => {
      if (answerLabel(p) !== want) bad.push(`the answer is "${answerLabel(p)}", not "${want}"`);
    };
    // a diameter is always two radii, and round things are realistic sizes
    if (facts.r !== undefined && facts.d !== undefined && !close(facts.d, 2 * facts.r)) bad.push("d isn't 2r");
    if (facts.r !== undefined && facts.unit) {
      if (facts.r < SMALLEST[facts.unit] / 2 || facts.r > LARGEST[facts.unit])
        bad.push(`a radius of ${facts.r} ${facts.unit}`);
    }
    if (facts.t === "dFromR") wrongAnswer(2 * facts.r);
    if (facts.t === "rFromD") wrongAnswer(facts.d / 2);
    if (facts.t === "which") wrongChoice(`Segment ${facts.asked === "radius" ? "AB" : "CD"}`);
    // circumference: C = πd, typed as d
    if (facts.t === "fromD" || facts.t === "fromR") wrongAnswer(facts.d);
    if (facts.t === "back") wrongAnswer(facts.wantR ? facts.r : facts.d);
    if (facts.t === "circApprox") wrongChoice(`about ${fmt(3.14 * facts.d)} ${facts.unit}`);
    // wheels: each turn rolls one circumference
    if (facts.t === "distance") wrongAnswer(facts.turns * facts.d);
    if (facts.t === "turns") wrongAnswer(facts.far / facts.circ);
    if (facts.t === "times") wrongAnswer(facts.big / facts.small);
    if (facts.t === "rollApprox") wrongChoice(`about ${fmt(3.14 * facts.turns * facts.d)} cm`);
    if (["distance", "rollApprox"].includes(facts.t) && (facts.d < 5 || facts.d > 70))
      bad.push(`a wheel ${facts.d} cm across`);
    // area: A = πr², typed as r × r
    if (facts.t === "area") {
      wrongAnswer(facts.r * facts.r);
      if (!(Number.isInteger(facts.r) && (facts.r <= 12 || facts.r % 10 === 0)))
        bad.push(`squaring ${facts.r} in your head`);
    }
    if (facts.t === "areaApprox") wrongChoice(`about ${fmt(3.14 * facts.r * facts.r)} square ${facts.unit}`);
    if (facts.t === "pizzas") {
      wrongAnswer((facts.big / facts.small) ** 2);
      if (facts.big > 18 || facts.small < 4) bad.push(`pizzas ${facts.small} and ${facts.big} inches across`);
    }
    // pieces: a share of the whole circle's area or circumference
    if (facts.t === "halfArea" || facts.t === "quarterArea") wrongAnswer((facts.r * facts.r) / facts.parts);
    if (facts.t === "arc") wrongAnswer((2 * facts.r) / facts.parts);
    if (facts.t === "perimeter") {
      const arc = (2 * facts.r) / facts.parts;
      if (!answerLabel(p).startsWith(`${arc === 1 ? "" : fmt(arc)}π + ${2 * facts.r} `))
        bad.push("the wrong distance around");
    }
    // circumference or area
    if (facts.t === "kind") wrongChoice(facts.kind === "C" ? "Circumference" : "Area");
    if (facts.t === "solve") wrongAnswer(facts.kind === "C" ? 2 * facts.r : facts.r * facts.r);
    return bad;
  },
};
