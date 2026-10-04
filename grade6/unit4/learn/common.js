/* Learn Dividing Fractions (Grade 6 Unit 4): code more than one chapter uses. Loaded by the chapter pages in learn/, after chapters.js
   and ../figs.js (pictures the game uses too). */
/* a number as a fraction (denominators up to 48): 1.875 is [15, 8] */
const toFrac = (v) => {
  for (let d = 1; d <= 48; d++) {
    const n = Math.round(v * d);
    if (Math.abs(n / d - v) < 1e-9) return frac(n, d);
  }
  return frac(Math.round(v * 48), 48);
};
/* lines of worked steps, the first `shown` of them */
const workLines = (lines, shown) =>
  `<ol class="work-steps">${lines
    .slice(0, shown)
    .map((line) => `<li>${line}</li>`)
    .join("")}</ol>`;
