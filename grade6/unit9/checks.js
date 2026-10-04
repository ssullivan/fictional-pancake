/* Town Hall: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. check() holds classes, schools, and elections
   to realistic sizes and confirms the counting, using the facts each problem carries. */
/* the most squares a rectangle may cut into, and the largest rectangle */
const MOST_SQUARES = 12,
  LONGEST = 30;
/* realistic sizes for each kind of place that shares representatives */
const PLACE_SIZES = { school: [10, 500], family: [1, 8], neighborhood: [1000, 25000] };
/* the squares a w by h rectangle cuts into, largest first (the same cuts as figs.js, worked out again here) */
function squareCount(w, h) {
  let count = 0;
  while (w && h) {
    if (w < h) [w, h] = [h, w];
    count += Math.floor(w / h);
    w %= h;
  }
  return count;
}
module.exports = {
  limits: {
    world: { dp: 2, nz: 2, max: 100 },
    squares: { dp: 0, nz: 2, max: 30 },
    yessier: { dp: 0, nz: 2, max: 100 },
    super: { dp: 0, nz: 3, max: 240 },
    turnout: { dp: 0, nz: 2, max: 10000 },
    ballot: { dp: 0, nz: 2, max: 72 },
    seats: { dp: 0, nz: 2, max: 25000 },
  },
  // what's wrong with problem p in the real world (an empty list when nothing is), from the facts it carries
  check(p) {
    const bad = [],
      facts = p.facts || {};
    if (!facts.t) bad.push("no facts for checks.js");
    // a class has 20 to 40 students, and the students counted are a whole number of them
    if (facts.n !== undefined && ["scale", "percent", "up"].includes(facts.t)) {
      if (facts.n < 20 || facts.n > 40) bad.push(`a class of ${facts.n}`);
      if (!(Number.isInteger(facts.k) && facts.k > 0 && facts.k < facts.n))
        bad.push(`${facts.k} of ${facts.n} students`);
    }
    // a rectangle is longer than it is wide, at most 30 long, and cuts into a few squares (not just one size)
    if (facts.w !== undefined) {
      if (!(facts.w > facts.h && facts.w <= LONGEST && facts.h >= 2)) bad.push(`a ${facts.w} by ${facts.h} rectangle`);
      if (facts.w % facts.h === 0) bad.push(`${facts.w} by ${facts.h} is a row of squares`);
      if (squareCount(facts.w, facts.h) > MOST_SQUARES) bad.push(`${facts.w} by ${facts.h} cuts into too many squares`);
    }
    // a class that votes has 20 to 36 students, and its yes and no votes are whole numbers that add up to it
    for (const c of facts.classes || []) {
      if (c.size < 20 || c.size > 36) bad.push(`a class of ${c.size}`);
      if (c.yes !== undefined && !(Number.isInteger(c.yes) && c.yes + c.no === c.size))
        bad.push(`votes ${c.yes} and ${c.no}`);
    }
    // the fewest votes that pass really pass, and one fewer doesn't
    if (facts.need !== undefined) {
      const passes = (yes) =>
        facts.rule === "more than half"
          ? yes > facts.n / 2
          : yes * RULE_FRACS[facts.rule][1] >= facts.n * RULE_FRACS[facts.rule][0];
      if (!passes(facts.need) || passes(facts.need - 1)) bad.push(`${facts.need} isn't the fewest for ${facts.rule}`);
      if (facts.need > facts.n) bad.push(`needs ${facts.need} of ${facts.n}`);
    }
    // percents of a group are 10% to 80%, and the people who chose are a whole number of a town
    for (const part of facts.parts || []) if (part < 10 || part > 80) bad.push(`${part}% of a group`);
    if (facts.parts && !facts.school && facts.parts[0] > 50) bad.push(`${facts.parts[0]}% of a town subscribes`);
    if (facts.town && (facts.school ? facts.town > 1000 : facts.town < 1000))
      bad.push(`${facts.town} ${facts.school ? "students in a school" : "people in a town"}`);
    if (facts.town) {
      const share = facts.parts.reduce((s, part) => (s * part) / 100, 1);
      if (!Number.isInteger(Math.round(facts.town * share * 1e6) / 1e6)) bad.push(`${share} of ${facts.town} people`);
    }
    // an election has 15 to 36 voters in groups that each rank the choices differently
    if (facts.groups) {
      const total = facts.groups.reduce((s, g) => s + g.n, 0),
        orders = new Set(facts.groups.map((g) => g.rank.join("")));
      if (total < 15 || total > 36) bad.push(`${total} voters`);
      if (orders.size !== facts.groups.length) bad.push("two groups rank the choices the same way");
    }
    // places that share representatives are realistic sizes, and each gets a whole number of them
    if (facts.place) {
      const [lo, hi] = PLACE_SIZES[facts.place];
      for (const size of facts.sizes) if (size < lo || size > hi) bad.push(`a ${facts.place} of ${size}`);
      for (const seat of facts.seats) if (!(Number.isInteger(seat) && seat >= 1)) bad.push(`${seat} representatives`);
    }
    return bad;
  },
};
/* each supermajority rule's fraction, written the way the problems write it */
const RULE_FRACS = { "at least 2/3": [2, 3], "at least 3/4": [3, 4], "at least 60%": [3, 5], "at least 55%": [11, 20] };
