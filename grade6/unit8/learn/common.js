/* Learn Data Sets and Distributions (Grade 6 Unit 8): code more than one chapter uses. Loaded by every chapter page in learn/. */
/* the values from lo to hi in steps of step, without floating-point dust: a stepper moves through them by index */
const valuesFrom = (lo, hi, step = 1) =>
  range(Math.round((hi - lo) / step) + 1).map((i) => Math.round((lo + i * step) * 1e6) / 1e6);
