/* Small pieces the K–5 picture files and pages share: cells for ten-frames and hundred grids, a red cross-out line, fractions
   written stacked, and the names of equal parts. Styles for every K–5 picture (labels, number-line marks, tap targets, counters,
   and controls) are in pictures.css, which every K–5 page loads. Load this file before blocks.js, fractions.js, and graphs.js,
   which use it, and on any page that uses it directly.

   cellsOf([n, cls], …)              a list of n cls, then the next group: the cells for tenFrames and hundredGrid
   xOut(x, y, w, h)                  a red line through something taken away (markup)
   fr(n, d), frT(x, y, n, d, cls)    a fraction written stacked (html), and the same in a picture (markup)
   mixed(k, d)                       k parts of 1/d as a whole number, a fraction, or a mixed number (html)
   PART, partName(n, k)              the names of equal parts: partName(3, 2) is "2 thirds" */
const cellsOf = (...groups) => groups.flatMap(([n, c]) => Array(n).fill(c));
/* a red line through a block that was taken away */
const xOut = (x, y, w, h) => `<path class="xout" d="M${x - 3},${y + h + 3}L${x + w + 3},${y - 3}"/>`;
/* n/d written stacked. The slash is kept for screen readers and copied text, hidden on screen. */
const fr = (n, d) => `<span class="fr"><span>${n}</span><span class="sr">/</span><span>${d}</span></span>`;
/* k parts of 1/d as a whole number, a fraction, or a mixed number: mixed(9, 4) is 2 1/4 */
const mixed = (k, d) => {
  const whole = Math.floor(k / d),
    rest = k % d;
  return !rest ? `${whole}` : whole ? `${whole} ${fr(rest, d)}` : fr(rest, d);
};
/* the same in a picture, centered on x, y: the fraction bar is as long as the longer number */
const frT = (x, y, n, d, cls = "") => {
  const halfBar = 5 + 4.5 * Math.max(String(n).length, String(d).length);
  return `<g class="frt ${cls}"><text class="lbl s" x="${x}" y="${y - 10}">${n}</text><line x1="${x - halfBar}" y1="${y}" x2="${x + halfBar}" y2="${y}"/><text class="lbl s" x="${x}" y="${y + 11}">${d}</text></g>`;
};
/* Equal parts. PART[n]: the name of 1 part and of more than 1. partName(3, 2) is "2 thirds". */
const PART = {
  2: ["half", "halves"],
  3: ["third", "thirds"],
  4: ["fourth", "fourths"],
  5: ["fifth", "fifths"],
  6: ["sixth", "sixths"],
  8: ["eighth", "eighths"],
  10: ["tenth", "tenths"],
  12: ["twelfth", "twelfths"],
  100: ["hundredth", "hundredths"],
};
const partName = (n, k = 1) => `${k} ${PART[n][k === 1 ? 0 : 1]}`;
