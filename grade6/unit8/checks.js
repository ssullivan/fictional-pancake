/* Data Detectives: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. check() holds data sets to realistic values
   for their context and confirms the statistics, using the facts each problem carries. */
/* the realistic range of each context's values */
const RANGES = {
  pets: [0, 6],
  sleep: [6, 11],
  quiz: [0, 10],
  siblings: [0, 5],
  goals: [0, 6],
  books: [0, 8],
  trip: [5, 80],
};
const mean = (values) => values.reduce((s, v) => s + v, 0) / values.length;
const median = (values) => {
  const sorted = values.slice().sort((a, b) => a - b),
    half = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[half] : (sorted[half - 1] + sorted[half]) / 2;
};
module.exports = {
  limits: {
    question: { dp: 0, nz: 2, max: 30 },
    dot: { dp: 2, nz: 2, max: 20 },
    hist: { dp: 0, nz: 3, max: 170 },
    mean: { dp: 2, nz: 3, max: 60 },
    mad: { dp: 2, nz: 3, max: 15 },
    median: { dp: 1, nz: 2, max: 80 },
    box: { dp: 1, nz: 2, max: 10 },
  },
  // what's wrong with problem p in the real world (an empty list when nothing is), from the facts it carries
  check(p) {
    const bad = [],
      facts = p.facts || {};
    if (!facts.t) bad.push("no facts for checks.js");
    // every value is a whole number in its context's realistic range
    const [lo, hi] = RANGES[facts.ctx] || [0, Infinity];
    for (const v of facts.values || [])
      if (!(Number.isInteger(v) && v >= lo && v <= hi)) bad.push(`a value of ${v} for ${facts.ctx}`);
    // counts are positive whole numbers, and a histogram's bars are whole numbers
    for (const v of facts.count || []) if (!(Number.isInteger(v) && v >= 0)) bad.push(`a count of ${v}`);
    for (const v of facts.counts || []) if (!(Number.isInteger(v) && v >= 0)) bad.push(`a bar of ${v}`);
    // a mean is a whole number or a half, and really is the sum shared equally
    if (facts.mean !== undefined) {
      if (!Number.isInteger(facts.mean * 2)) bad.push(`a mean of ${facts.mean}`);
      if (facts.values && Math.abs(mean(facts.values) - facts.mean) > 1e-9) bad.push(`${facts.mean} isn't the mean`);
    }
    // a median really is the middle of the sorted values
    if (facts.median !== undefined && Math.abs(median(facts.values) - facts.median) > 1e-9)
      bad.push(`${facts.median} isn't the median`);
    // a MAD has at most 2 decimal places
    if (facts.mad !== undefined && Math.round(facts.mad * 100) !== facts.mad * 100) bad.push(`a MAD of ${facts.mad}`);
    // a fraction of a data set has a friendly denominator
    if (facts.frac && ![10, 20].includes(facts.frac[1])) bad.push(`a fraction out of ${facts.frac[1]}`);
    return bad;
  },
};
