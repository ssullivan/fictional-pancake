/* Fraction Workshop: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. Answers are fractions (2/3 is 0.666667), so dp and
   nz are loose here; check() holds the fractions to friendly sizes instead, using the facts each problem carries. */
const LOOSE = {dp: 6, nz: 8};
module.exports = {
  limits: {
    size:   {...LOOSE, max: 9000},
    groups: {...LOOSE, max: 16},
    part:   {...LOOSE, max: 12},
    fill:   {...LOOSE, max: 24},
    recip:  {...LOOSE, max: 40},
    tile:   {...LOOSE, max: 30},
    crate:  {...LOOSE, max: 216},
  },
  // what's wrong with problem p in the real world (an empty list when nothing is), from the facts it carries
  check(p, zone) {
    const bad = [], facts = p.facts || {};
    if (!facts.t) bad.push('no facts for checks.js');
    // friendly fractions: denominators 2, 3, 4, 5, 6, 8, 10, or 12 (and 16 for an area, fourths times fourths), and small numbers on the way (numerators and denominators when you multiply across)
    for (const [n, d] of [...(facts.f || []), ...(facts.ans ? [facts.ans] : [])]) {
      if (!(Number.isInteger(n) && Number.isInteger(d) && d > 0)) bad.push(`${n}/${d} is not a fraction`);
      else if (![1, 2, 3, 4, 5, 6, 8, 10, 12, ...(facts.t === 'area' ? [16] : [])].includes(d)) bad.push(`denominator ${d} is not friendly`);
    }
    for (const step of facts.work || []) if (step > 216) bad.push(`a step reaches ${step}, too big to do in your head`);
    if (facts.ans && facts.t !== 'cubes' && facts.ans[0] / facts.ans[1] > 40) bad.push(`answer ${facts.ans[0]}/${facts.ans[1]} is too big`);
    // real-world: a part is less than its whole, a piece is shorter than the board it's cut from, the amounts fit the context
    if (facts.part !== undefined && !(facts.part > 0 && facts.part < 1)) bad.push(`a container ${facts.part} full`);
    if (facts.piece !== undefined && !(facts.piece < facts.total)) bad.push(`a piece ${facts.piece} long from ${facts.total}`);
    if (facts.max !== undefined && facts.total > facts.max) bad.push(`${facts.total} is too much for this context`);
    if (p.kind === 'num' && p.unit === 'dollars' && Math.round(p.answer * 100) % 25) bad.push(`price ${p.answer} is not friendly`);
    return bad;
  },
};
