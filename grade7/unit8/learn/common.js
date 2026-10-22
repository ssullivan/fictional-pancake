/* Learn Probability and Sampling (Grade 7 Unit 8): code more than one chapter uses. Loaded by every chapter page in learn/. */
/* A random number maker that gives the same numbers every time it starts from the same seed (mulberry32), so experiments
   on these pages repeat exactly: each call gives a number from 0 up to 1. */
function seeded(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/* a probability k/n as written: a fraction in lowest terms (plain text) */
const pFrac = (k, n) => {
  const [a, b] = frac(k, n);
  return b === 1 ? `${a}` : `${a}/${b}`;
};
