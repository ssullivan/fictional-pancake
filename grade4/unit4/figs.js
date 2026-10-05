/* Numbers and pictures that Grade 4 Unit 4's game and its Learn pages both use. Needs numlines.js (numLine).

   dS(k)                             k hundredths as a decimal, as short as it goes: 47 → "0.47", 50 → "0.5"
   WIDE                              the columns hundred-thousands to ones, for pvChart
   PL, SYM, signOf(a, b)             place names (PL[3] is ['thousand', 'thousands']), < > = as html, and how a compares to b
   decLine(lo, hi, step, options)    a number line in hundredths (svg)
   nearest(unit)                     "the nearest thousand"
   Rounding (roundTo) is in shared/util.js, and its number line (roundLine) in shared/numlines.js. */
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
/* "the nearest thousand" */
const nearest = (unit) =>
  `the nearest ${unit === 1000 ? "thousand" : unit === 10000 ? "ten thousand" : "hundred thousand"}`;
