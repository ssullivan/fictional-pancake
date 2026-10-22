/* Mall Rush: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. check() works every answer out again from the
   prices, percents, and fractions each problem carries, and holds rates, prices, and percents to realistic sizes. Money is
   to the cent, so a named mistake must be at least a cent from the answer (near). */
const close = (a, b) => Math.abs(a - b) < 1e-6;
const val = ([n, d]) => n / d;
/* the label of the choice that's the answer, without its tags */
const answerLabel = (p) =>
  p.choices
    .find((c) => c.id === p.answer)
    .label.replace(/<[^>]*>/g, "")
    .trim();
module.exports = {
  near: (x, y) => Math.abs(x - y) < 0.005,
  limits: {
    // a rate from fractions can be a fraction like 5/2, typed as one
    rates: { dp: 2, nz: 3, max: 30 },
    // growing by a fraction multiplies by a fraction like 5/3, typed as one
    again: { dp: 6, nz: 7, max: 1200 },
    change: { dp: 2, nz: 4, max: 2000 },
    tax: { dp: 2, nz: 4, max: 220 },
    deals: { dp: 2, nz: 4, max: 920 },
    error: { dp: 2, nz: 4, max: 2200 },
  },
  // what's wrong with problem p (an empty list when nothing is), from the facts it carries
  check(p) {
    const bad = [],
      facts = p.facts || {};
    if (!facts.t) return ["no facts for checks.js"];
    const wrongAnswer = (want) => {
      if (p.kind === "num" && !close(p.answer, want)) bad.push(`answer ${p.answer}, but it works out to ${want}`);
    };
    // money comes out to the cent
    if (p.kind === "num" && /dollars/.test(p.unit) && !close(Math.round(p.answer * 100), p.answer * 100))
      bad.push(`${p.answer} dollars isn't a whole number of cents`);
    // rates with fractions: amount ÷ time, a steady rate of a few per hour
    if (facts.t === "unit") wrongAnswer(val(facts.amount) / val(facts.time));
    if (facts.t === "use") wrongAnswer((val(facts.amount) / val(facts.time)) * facts.hours);
    if ((facts.t === "unit" || facts.t === "use") && val(facts.amount) / val(facts.time) > 5)
      bad.push("faster than 5 an hour");
    if (facts.t === "decimal") wrongAnswer(facts.price * facts.pounds);
    // growing or shrinking by a fraction
    if (facts.t === "grow") wrongAnswer(facts.old * (1 + val(facts.part)));
    if (facts.t === "shrink") wrongAnswer(facts.old * (1 - val(facts.part)));
    if (facts.t === "factor") wrongAnswer(facts.grow ? 1 + val(facts.part) : 1 - val(facts.part));
    if (facts.t === "back") {
      wrongAnswer(facts.old);
      if (!close(facts.now, facts.old * (1 + val(facts.part)))) bad.push("the new size doesn't match");
    }
    if (facts.old !== undefined && facts.part && !Number.isInteger(facts.old * val(facts.part)))
      bad.push(`${val(facts.part)} of ${facts.old} isn't whole`);
    // percent change: the new price is (100 ± p)% of the old
    if (facts.t === "up" || facts.t === "markup") wrongAnswer((facts.old * (100 + facts.p)) / 100);
    if (facts.t === "down" || facts.t === "discount") wrongAnswer((facts.old * (100 - facts.p)) / 100);
    if (facts.t === "original") {
      wrongAnswer(facts.old);
      if (!close(facts.now, (facts.old * (100 + (facts.up ? 1 : -1) * facts.p)) / 100))
        bad.push("the new price is off");
    }
    if (facts.t === "equation") {
      const want = 1 + ((facts.up ? 1 : -1) * facts.p) / 100,
        m = answerLabel(p).match(/^n = ([\d.]+)p$/);
      if (!m || !close(+m[1], want)) bad.push(`"${answerLabel(p)}" isn't n = ${want}p`);
    }
    if (facts.t === "small") {
      wrongAnswer((facts.small * facts.amount) / 100);
      if (facts.small >= 1) bad.push("not less than 1%");
    }
    // tax, tip, commission, interest: a realistic rate of the amount
    if (facts.t === "tax") wrongAnswer((facts.rate * facts.price) / 100);
    if (facts.t === "total") wrongAnswer((facts.price * (100 + facts.rate)) / 100);
    if (facts.t === "tip") {
      wrongAnswer((facts.rate * facts.price) / 100);
      if (facts.rate < 15 || facts.rate > 25) bad.push(`a ${facts.rate}% tip`);
    }
    if (facts.t === "rate") wrongAnswer((100 * facts.tax) / facts.price);
    if (["tax", "total"].includes(facts.t) && facts.rate > 10) bad.push(`a ${facts.rate}% sales tax`);
    if (facts.t === "commission") wrongAnswer((facts.p * facts.amount) / 100);
    if (facts.t === "interest") {
      wrongAnswer((facts.amount * (100 + facts.p)) / 100);
      if (facts.p > 6) bad.push(`${facts.p}% interest`);
    }
    if (facts.t === "discount" && facts.p >= 100) bad.push("free");
    if (facts.t === "pctChange") wrongAnswer((100 * Math.abs(facts.now - facts.old)) / facts.old);
    // measurement error: the difference, and the difference as a percent of the real size
    if (facts.t === "error") wrongAnswer(Math.abs(facts.measured - facts.actual));
    if (facts.t === "percent") wrongAnswer((100 * Math.abs(facts.measured - facts.actual)) / facts.actual);
    if (facts.measured !== undefined && Math.abs(facts.measured - facts.actual) > facts.actual / 4)
      bad.push("a measurement off by more than a quarter");
    if (facts.t === "interval") wrongAnswer(facts.actual * (1 + ((facts.least ? -1 : 1) * facts.p) / 100));
    return bad;
  },
};
