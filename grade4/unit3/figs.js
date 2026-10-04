/* Fractions that Grade 4 Unit 3's game and its Learn pages both use. Needs pictures.js (fr, mixed).

   frMix(k, d)                       k/d, and its mixed number when it's 1 or more (html) */
/* k/d, and its mixed number when it's 1 or more: "9/4 = 2 1/4" */
const frMix = (k, d) => fr(k, d) + (k >= d ? ` = ${mixed(k, d)}` : "");
