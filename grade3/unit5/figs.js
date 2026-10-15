/* Fraction words and comparisons that Grade 3 Unit 5's game and its Learn pages both use. Needs pictures.js (PART).
   Fractions are [numerator, denominator].

   DENS                              the denominators Grade 3 uses
   partsOf(d), aPart(d), cap(text)   "eighths", "an eighth", and "Text" with its first letter capitalized
   Comparing fractions (compareFr, SIGN_HTML) is in shared/fractions.js. */
/* the denominators Grade 3 uses */
const DENS = [2, 3, 4, 6, 8];
/* the plural name of 1/d's parts: "eighths" */
const partsOf = (d) => PART[d][1];
/* "a third", "an eighth" */
const aPart = (d) => (PART[d][0][0] === "e" ? "an " : "a ") + PART[d][0];
/* the text with its first letter capitalized */
const cap = (text) => text[0].toUpperCase() + text.slice(1);
