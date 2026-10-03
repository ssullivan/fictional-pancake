/* Learn Arithmetic in Base Ten (Grade 6 Unit 5): code more than one chapter uses. Loaded by the chapter pages in learn/, after chapters.js. */
/* numbers as written: 0.5, 1.25, 10,000 (up to 4 decimal places) */
const fmt = (n) => (Math.round(n * 1e4) / 1e4).toLocaleString("en-US", { maximumFractionDigits: 4 });
/* $6.00, $2.50 */
const money = (n) => "$" + (Math.round(n * 100) / 100).toFixed(2);
/* decimal places of a number as written */
const places = (n) => {
  const s = String(Math.round(n * 1e4) / 1e4),
    i = s.indexOf(".");
  return i < 0 ? 0 : s.length - i - 1;
};
/* numbers in columns with their decimal points lined up (zeros filled in so every row has the same places); op: '+' or '−'
   on the second row; result: written under the line */
function columns(rows, op, result) {
  const all = [...rows, ...(result == null ? [] : [result])],
    shownPlaces = Math.max(...all.map(places)),
    texts = all.map((n) => n.toFixed(shownPlaces));
  const width = Math.max(...texts.map((text) => text.length)) + 2,
    line = (text, before = "  ") => before + text.padStart(width - 2);
  const out = [line(texts[0]), line(texts[1], op + " "), "─".repeat(width)];
  if (result != null) out.push(`<span class="rev">${line(texts[2])}</span>`);
  return `<pre class="vert" role="img" aria-label="${texts[0]} ${op} ${texts[1]} in columns">${out.join("\n")}</pre>`;
}
