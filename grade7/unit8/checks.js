/* Carnival of Chance: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most
   nonzero digits, max = largest value, for the answer and every number in the prompt. check() works every probability out
   again by counting outcomes (every pair of number cubes, every path of a tree), scales samples up again, recomputes means
   and MADs from the dots, and checks each right choice. */
const close = (a, b) => Math.abs(a - b) < 1e-9;
/* the label of the choice that's the answer, as plain text */
const answerLabel = (p) =>
  p.choices
    .find((c) => c.id === p.answer)
    .label.replace(/<[^>]*>/g, "")
    .trim();
const meanOf = (values) => values.reduce((s, v) => s + v, 0) / values.length;
/* the words for how likely, by probability */
const likelyWord = (p) =>
  p === 0 ? "Impossible" : p < 0.5 ? "Unlikely" : p === 0.5 ? "Equally likely as not" : p < 1 ? "Likely" : "Certain";
/* the outcomes of each two-step experiment, counted separately from stations.js */
const OUTCOMES = {
  "flip a coin and roll a number cube": 12,
  "roll two number cubes": 36,
  "spin a 3-color spinner and flip a coin": 6,
  "pick a shirt (4 colors) and pants (3 colors)": 12,
  "flip a coin three times": 8,
};
module.exports = {
  limits: {
    chance: { dp: 0, nz: 2, max: 10 },
    prob: { dp: 6, nz: 7, max: 30 },
    estimate: { dp: 6, nz: 7, max: 200 },
    multi: { dp: 6, nz: 7, max: 36 },
    sample: { dp: 0, nz: 2, max: 1200 },
    estimatePop: { dp: 0, nz: 3, max: 2000 },
    compare: { dp: 0, nz: 2, max: 60 },
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
    if (p.kind === "num" && !Number.isInteger(p.answer) && !p.frac)
      bad.push("a fraction answer without the fraction keyboard");
    // single-step probabilities: favorable outcomes over all of them
    if (facts.t === "chance") wrongChoice(likelyWord(facts.k / facts.n));
    if (["bag", "cube", "spinner"].includes(facts.t)) {
      wrongAnswer(facts.k / facts.n);
      if (facts.k < 1 || facts.k >= facts.n) bad.push(`${facts.k} of ${facts.n}`);
    }
    if (facts.t === "cube" && facts.ways.length !== facts.k) bad.push("the cube's ways don't match");
    // experiments
    if (facts.t === "relFreq") wrongAnswer(facts.hits / facts.trials);
    if (facts.t === "expected") {
      wrongAnswer((facts.tries * facts.k) / facts.n);
      if (!Number.isInteger((facts.tries * facts.k) / facts.n)) bad.push("an expected count that isn't whole");
    }
    if (facts.t === "simulate") wrongChoice(facts.right);
    // two steps: count the outcomes again
    if (facts.t === "count") wrongAnswer(OUTCOMES[facts.what]);
    if (facts.t === "dice") {
      let ways = 0;
      for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === facts.sum) ways++;
      wrongAnswer(ways / 36);
    }
    if (facts.t === "tree") wrongAnswer(1 / facts.total);
    // samples
    if (facts.t === "fair") wrongChoice(facts.fair[0].toUpperCase() + facts.fair.slice(1));
    if (facts.t === "population")
      wrongChoice(
        facts.askPop ? `All ${facts.total} students at the school` : `The ${facts.asked} students who were asked`,
      );
    if (facts.t === "share") {
      wrongAnswer((facts.yes * facts.total) / facts.n);
      if (facts.yes >= facts.n) bad.push("everyone in the sample");
    }
    if (facts.t === "mean") {
      wrongAnswer(meanOf(facts.values));
      if (facts.values.some((v) => v < 0)) bad.push("a negative count of books");
    }
    // comparing: the gap between the means in MADs
    if (facts.t === "howMany") wrongAnswer((facts.meanB - facts.meanA) / facts.mad);
    if (facts.t === "meaningful") {
      const gap = (facts.meanB - facts.meanA) / facts.mad;
      if (gap === 2) bad.push("a gap of exactly 2 MADs");
      wrongChoice(gap > 2 ? "Yes, the populations are likely different" : "No, the difference could be chance");
    }
    return bad;
  },
};
