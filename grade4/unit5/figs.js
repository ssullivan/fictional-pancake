/* Pictures that Grade 4 Unit 5's game and its Learn pages both use. Styles are in figs.css. Needs util.js, figures.js (svgWrap),
   pictures.js (the .lbl text styles), and blocks.js (commas).

   convTable(units, rows, {ask, hi}) a two-column table of the same amounts in a big unit and a small unit (html)
   Tape diagrams for "times as many" (timesTape) are in shared/numlines.js, and rectangles with their side lengths (rectFig)
   in shared/shapes.js. */
/* A table of the same amounts in two units. units: [big, small] column headings; rows: [[big amount, small amount], …], numbers
   or text. ask: the row whose small amount is a ? (−1 for none). hi: a row to color. */
function convTable(units, rows, { ask = -1, hi = -1 } = {}) {
  const cell = (v) => (typeof v === "number" ? commas(v) : v);
  const body = rows
    .map(
      ([big, small], i) =>
        `<tr class="${i === hi ? "hi" : ""}"><td>${cell(big)}</td><td>${i === ask ? '<span class="q">?</span>' : cell(small)}</td></tr>`,
    )
    .join("");
  return `<table class="conv" aria-label="Table of ${units[0]} and ${units[1]}"><thead><tr><th>${units[0]}</th><th>${units[1]}</th></tr></thead><tbody>${body}</tbody></table>`;
}
