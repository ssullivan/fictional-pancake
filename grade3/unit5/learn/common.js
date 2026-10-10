/* Learn Fractions as Numbers (Grade 3 Unit 5): code used by more than one chapter. Loaded by the chapter pages in learn/,
   after ../figs.js (DENS, partsOf, aPart, cap, compareFr, SIGN_HTML) and chapters.js. Fraction strips and number lines
   (strips, fracLine) are in shared/fractions.js, and shapes cut into parts (shareFig) in shared/shapes.js. */
/* n and the word for it: "1 part", "3 parts" (plural: the word for more than one) */
const pl = (n, word, plural = word + "s") => `${n} ${n === 1 ? word : plural}`;
