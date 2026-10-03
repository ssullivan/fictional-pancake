/* Fraction Workshop: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. Answers are fractions (2/3 is 0.666667), so dp and
   nz are loose here; check() holds the fractions to friendly sizes instead, using the facts each problem carries. */
const F = {dp: 6, nz: 8};
module.exports = {
  limits: {
    size:   {...F, max: 9000},
    groups: {...F, max: 16},
    part:   {...F, max: 12},
    fill:   {...F, max: 24},
    recip:  {...F, max: 40},
    tile:   {...F, max: 30},
    crate:  {...F, max: 216},
  },
  check(p, zone) {
    const bad = [], f = p.facts || {};
    if (!f.t) bad.push('no facts for checks.js');
    // friendly fractions: denominators 2, 3, 4, 5, 6, 8, 10, or 12 (and 16 for an area, fourths times fourths), and small numbers on the way (numerators and denominators when you multiply across)
    for (const [n, d] of [...(f.f || []), ...(f.ans ? [f.ans] : [])]) {
      if (!(Number.isInteger(n) && Number.isInteger(d) && d > 0)) bad.push(`${n}/${d} is not a fraction`);
      else if (![1, 2, 3, 4, 5, 6, 8, 10, 12, ...(f.t === 'area' ? [16] : [])].includes(d)) bad.push(`denominator ${d} is not friendly`);
    }
    for (const w of f.work || []) if (w > 216) bad.push(`a step reaches ${w}, too big to do in your head`);
    if (f.ans && f.t !== 'cubes' && f.ans[0] / f.ans[1] > 40) bad.push(`answer ${f.ans[0]}/${f.ans[1]} is too big`);
    // real-world: a part is less than its whole, a piece is shorter than the board it's cut from, the amounts fit the context
    if (f.part !== undefined && !(f.part > 0 && f.part < 1)) bad.push(`a container ${f.part} full`);
    if (f.piece !== undefined && !(f.piece < f.total)) bad.push(`a piece ${f.piece} long from ${f.total}`);
    if (f.max !== undefined && f.total > f.max) bad.push(`${f.total} is too much for this context`);
    if (p.kind === 'num' && p.unit === 'dollars' && Math.round(p.answer * 100) % 25) bad.push(`price ${p.answer} is not friendly`);
    return bad;
  },
};
