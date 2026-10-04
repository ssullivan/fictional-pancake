/* Learn Rational Numbers (Grade 6 Unit 7): code more than one chapter uses. Loaded by every chapter page in learn/. */
/* the values from lo to hi in steps of step, without floating-point dust: a stepper moves through them by index */
const valuesFrom = (lo, hi, step = 1) =>
  range(Math.round((hi - lo) / step) + 1).map((i) => Math.round((lo + i * step) * 1e6) / 1e6);
/* which side of 0 a number is on, in words */
const sideOf = (v) => (v < 0 ? "to the left of 0" : v > 0 ? "to the right of 0" : "at 0");
/* a < b, a > b, or a = b, comparing the numbers a and b as written */
const compareText = (a, b) => `${fmt(a)} ${a < b ? "<" : a > b ? ">" : "="} ${fmt(b)}`;
/* the distance between a and b on one line, from each one's distance to 0: added when they're on opposite sides of 0,
   subtracted when they're on the same side. Returns the distance and the work, in words. */
function lineGap(a, b) {
  const far = Math.max(Math.abs(a), Math.abs(b)),
    near = Math.min(Math.abs(a), Math.abs(b)),
    gap = Math.abs(a - b);
  if (!a || !b) return { gap, work: `${fmt(far)} from 0` };
  if (a < 0 !== b < 0) return { gap, work: `${abs(a)} + ${abs(b)} = ${Math.abs(a)} + ${Math.abs(b)} = ${gap}` };
  return { gap, work: `${far} − ${near} = ${gap}` };
}
