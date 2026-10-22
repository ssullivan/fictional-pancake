/* Grand Opening: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. check() works every answer out again from
   the amounts, prices, and measures each problem carries, and keeps prices, rooms, and neighborhoods realistic. Money is to
   the cent, so a named mistake must be at least a cent from the answer (near). */
const close = (a, b) => Math.abs(a - b) < 1e-6;
const val = ([n, d]) => n / d;
/* the label of the choice that's the answer, as plain text */
const answerLabel = (p) =>
  p.choices
    .find((c) => c.id === p.answer)
    .label.replace(/<[^>]*>/g, "")
    .trim();
module.exports = {
  near: (x, y) => Math.abs(x - y) < 0.005,
  limits: {
    // a recipe amount can be a fraction like 3/8, typed as one
    recipe: { dp: 6, nz: 7, max: 120 },
    costs: { dp: 2, nz: 3, max: 1200 },
    plan: { dp: 0, nz: 3, max: 400 },
    crowded: { dp: 0, nz: 3, max: 40000 },
    measure: { dp: 2, nz: 3, max: 800 },
  },
  // what's wrong with problem p (an empty list when nothing is), from the facts it carries
  check(p) {
    const bad = [],
      facts = p.facts || {};
    if (!facts.t) return ["no facts for checks.js"];
    const wrongAnswer = (want) => {
      if (p.kind === "num" && !close(p.answer, want)) bad.push(`answer ${p.answer}, but it works out to ${want}`);
    };
    if (p.kind === "num" && /dollars/.test(p.unit) && !close(Math.round(p.answer * 100), p.answer * 100))
      bad.push(`${p.answer} dollars isn't a whole number of cents`);
    // recipes
    if (facts.t === "scale") wrongAnswer((val(facts.amount) * facts.servings) / 4);
    if (facts.t === "servings") wrongAnswer((facts.have / facts.perBatch) * facts.makes);
    // costs
    if (facts.t === "markup") wrongAnswer(facts.cost * (1 + facts.up / 100));
    if (facts.t === "serving") wrongAnswer(Math.round((facts.price / facts.servings) * 100) / 100);
    if (
      facts.t === "serving" &&
      !close(Math.round((facts.price / facts.servings) * 100), (facts.price / facts.servings) * 100)
    )
      bad.push("a serving that isn't a whole number of cents");
    if (facts.t === "profit") {
      wrongAnswer(facts.meals * facts.price - facts.costs);
      if (facts.meals * facts.price <= facts.costs) bad.push("a night that loses money");
    }
    // the floor plan
    if (facts.t === "length") wrongAnswer(facts.w * facts.each);
    if (facts.t === "area") wrongAnswer(facts.w * facts.each * facts.h * facts.each);
    if (facts.w !== undefined && (facts.w * facts.each > 25 || facts.h * facts.each > 15))
      bad.push("a huge dining room");
    if (facts.t === "tables") {
      wrongAnswer(facts.room / facts.space);
      if (!Number.isInteger(facts.room / facts.space)) bad.push("part of a table");
    }
    // how crowded
    if (facts.t === "density") wrongAnswer(facts.people / facts.area);
    if (facts.t === "compare") {
      const perA = facts.popA / facts.areaA,
        perB = facts.popB / facts.areaB;
      if (answerLabel(p) !== (perA > perB ? "Maple Hill" : "River Park"))
        bad.push("the less crowded one is the answer");
      if (facts.popA > facts.popB === perA > perB) bad.push("the one with more people is also more crowded: too easy");
    }
    // measuring the course
    if (facts.t === "trundle") wrongAnswer(facts.circ * facts.clicks);
    if (facts.t === "percentError") wrongAnswer((100 * Math.abs(facts.measured - facts.actual)) / facts.actual);
    if (facts.t === "loops") {
      wrongAnswer((facts.total - facts.done) / facts.each);
      if (facts.total > 5) bad.push("a 5K route longer than 5 km");
    }
    return bad;
  },
};
