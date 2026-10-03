/* Rate Racers: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most
   nonzero digits, max = largest value, for the answer and every number in the prompt. */
module.exports = {
  limits: {
    conv:   {dp: 1, nz: 3, max: 5000},
    rate:   {dp: 2, nz: 4, max: 250},
    speed:  {dp: 0, nz: 3, max: 150},
    strip:  {dp: 0, nz: 3, max: 150},
    bench:  {dp: 2, nz: 3, max: 500},
    detect: {dp: 0, nz: 3, max: 300},
  },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const text = p.prompt.replace(/<[^>]*>/g, ''), bad = [];
    for (const [, v] of text.matchAll(/(\d+(?:\.\d+)?)%/g)) {
      // a part of a group or of a full tank can't be over 100%; a savings goal or a scaled-up recipe can
      if (+v > 100 && !/savings goal|recipe/.test(text)) bad.push(`${v}% makes no sense here`);
    }
    for (const [, v] of text.matchAll(/(\d+(?:\.\d+)?)% off/g)) if (+v >= 100) bad.push(`${v}% off is not a sale`);
    return bad;
  },
};
