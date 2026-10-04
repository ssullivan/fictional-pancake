/* Learn Fraction Equivalence and Comparison (Grade 4 Unit 2): code used by more than one chapter. Loaded by the chapter pages in learn/,
   after ../figs.js (DEN, sign, cmpWhy, and the rest the game uses too) and chapters.js. Fractions are [numerator, denominator]. */
/* how many equal pieces each 1/d can be split into, keeping the denominator in DEN (2, 3, …, up to the first that doesn't fit) */
const maxSplit = (d) => {
  let n = 1;
  while (DEN.includes(d * (n + 1))) n++;
  return n;
};
