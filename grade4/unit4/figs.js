/* Numbers and pictures that Grade 4 Unit 4's game and its Learn pages both use. Needs numlines.js (numLine) and blocks.js (commas).

   dS(k)                             k hundredths as a decimal, as short as it goes: 47 → "0.47", 50 → "0.5"
   WIDE                              the columns hundred-thousands to ones, for pvChart
   PL, SYM, signOf(a, b)             place names (PL[3] is ['thousand', 'thousands']), < > = as html, and how a compares to b
   decLine(lo, hi, step, options)    a number line in hundredths (svg)
   roundTo(n, unit), nearest(unit)   n rounded to the nearest unit, and "the nearest thousand"
   roundLine(n, unit, label)         n on a number line between the multiples of unit around it (svg) */
/* k hundredths as a decimal, as short as it goes: 47 → "0.47", 50 → "0.5", 100 → "1" */
const dS = (k) => (k % 100 === 0 ? String(k / 100) : (k / 100).toFixed(k % 10 ? 2 : 1));
/* the columns hundred-thousands to ones */
const WIDE = [5, 4, 3, 2, 1, 0];
/* a place's name for 1 and for more: PL[3] is ['thousand', 'thousands'] */
const PL = {
  5: ["hundred-thousand", "hundred-thousands"],
  4: ["ten-thousand", "ten-thousands"],
  3: ["thousand", "thousands"],
  2: ["hundred", "hundreds"],
  1: ["ten", "tens"],
  0: ["one", "ones"],
};
/* <, >, and = as html */
const SYM = { "<": "&lt;", ">": "&gt;", "=": "=" };
/* how a compares to b: '<', '>', or '=' */
const signOf = (a, b) => (a < b ? "<" : a > b ? ">" : "=");
/* a number line in hundredths from lo to hi (lo and hi in hundredths), a tick every `step`, about 380 pixels long; options go to numLine */
const decLine = (lo, hi, step, options = {}) =>
  numLine(lo, hi, {
    u: 380 / ((hi - lo) / step) / step,
    step,
    big: step === 10 ? 50 : 5,
    lab: (v) => step === 10 || v % 5 === 0,
    fmt: dS,
    ...options,
  });
/* n rounded to the nearest multiple of unit (halfway rounds up) */
const roundTo = (n, unit) => Math.floor(n / unit + 0.5) * unit;
/* "the nearest thousand" */
const nearest = (unit) =>
  `the nearest ${unit === 1000 ? "thousand" : unit === 10000 ? "ten thousand" : "hundred thousand"}`;
/* n on a number line from the multiple of unit below it to the one above, in 10 ticks, with the halfway point */
function roundLine(n, unit, label) {
  const below = Math.floor(n / unit) * unit,
    tick = unit / 10;
  return numLine(0, 10, {
    u: 36,
    step: 1,
    big: 5,
    pad: 36,
    fmt: (v) => commas(below + v * tick),
    pts: [{ v: (n - below) / tick, t: commas(n) }],
    label:
      label ||
      `Number line from ${commas(below)} to ${commas(below + unit)}, with ${commas(below + unit / 2)} halfway and a point at ${commas(n)}`,
  });
}
