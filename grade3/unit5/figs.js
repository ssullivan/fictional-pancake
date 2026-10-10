/* Fraction words and comparisons that Grade 3 Unit 5's game and its Learn pages both use. Needs pictures.js (PART).
   Fractions are [numerator, denominator].

   DENS                              the denominators Grade 3 uses
   partsOf(d), aPart(d), cap(text)   "eighths", "an eighth", and "Text" with its first letter capitalized
   compareFr(a, b), SIGN_HTML        how fraction a compares to b ('<', '=', or '>'), and those signs as html */
/* the denominators Grade 3 uses */
const DENS = [2, 3, 4, 6, 8];
/* the plural name of 1/d's parts: "eighths" */
const partsOf = (d) => PART[d][1];
/* "a third", "an eighth" */
const aPart = (d) => (PART[d][0][0] === "e" ? "an " : "a ") + PART[d][0];
/* the text with its first letter capitalized */
const cap = (text) => text[0].toUpperCase() + text.slice(1);
/* how fraction a compares to b: '<', '>', or '='. Cross-multiplying puts both over the same denominator. */
const compareFr = ([n1, d1], [n2, d2]) => (n1 * d2 < n2 * d1 ? "<" : n1 * d2 > n2 * d1 ? ">" : "=");
/* <, >, and = as html */
const SIGN_HTML = { "<": "&lt;", ">": "&gt;", "=": "=" };
