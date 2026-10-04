/* Pictures that Grade 4 Unit 5's game and its Learn pages both use. Styles are in figs.css. Needs util.js, figures.js (svgWrap),
   pictures.js (the .lbl text styles), and blocks.js (commas).

   timesTape(rows, {label})          tape diagrams for "times as many": each row is copies of one box, with its total (svg)
   convTable(units, rows, {ask, hi}) a two-column table of the same amounts in a big unit and a small unit (html)
   rectFig(length, width, {…})       a rectangle with its side lengths, in unit squares when it's small enough (svg) */
/* Tape diagrams, one row under another, every box the same width so rows line up. rows: [{label, times, each, total, span,
   plus, plusBoxes}]: `times` boxes each showing `each` (a number or '?'), then the row's total (or '?') after it; span: one
   box as wide as `span` boxes instead (a whole amount not yet split into copies); plus: a dashed box after them showing how
   many more (for "more than"), as wide as plusBoxes boxes. The first row is gold and the others blue. */
function timesTape(rows, { label = "Tape diagram" } = {}) {
  /* boxesIn(r): how many box widths row r takes */
  const boxesIn = (r) => (r.span || r.times) + (r.plus ? r.plusBoxes || 1 : 0),
    most = Math.max(...rows.map(boxesIn)),
    labelW = 72,
    totalW = 74,
    boxW = Math.min(64, 330 / most),
    boxH = 36,
    rowGap = 16;
  let markup = "";
  rows.forEach((r, i) => {
    const y = 6 + i * (boxH + rowGap),
      textY = y + boxH / 2;
    markup += `<text class="lbl en" x="${labelW - 10}" y="${textY}">${r.label}</text>`;
    const pieceW = r.span ? r.span * boxW : boxW;
    range(r.span ? 1 : r.times).forEach((j) => {
      const x = labelW + j * pieceW;
      /* a small label is about 8.5 pixels a character: a box too narrow for its number leaves it out */
      const fits = String(r.each).length * 8.5 <= pieceW - 4;
      markup +=
        `<rect class="tt ${i ? "tt1" : "tt0"}" x="${x}" y="${y}" width="${pieceW}" height="${boxH}" rx="3"/>` +
        (fits
          ? `<text class="lbl${r.each === "?" ? " cy" : ""}${pieceW < 44 ? " s" : ""}" x="${x + pieceW / 2}" y="${textY}">${r.each}</text>`
          : "");
    });
    let end = labelW + (r.span || r.times) * boxW;
    if (r.plus) {
      const plusW = (r.plusBoxes || 1) * boxW;
      markup +=
        `<rect class="tt tgap" x="${end}" y="${y}" width="${plusW}" height="${boxH}" rx="3"/>` +
        `<text class="lbl s" x="${end + plusW / 2}" y="${textY}">${r.plus}</text>`;
      end += plusW;
    }
    if (r.total !== undefined)
      markup += `<text class="lbl st${r.total === "?" ? " cy" : ""}" x="${end + 10}" y="${textY}">${r.total === "?" ? "?" : `= ${r.total}`}</text>`;
  });
  return svgWrap(labelW + most * boxW + totalW, 12 + rows.length * (boxH + rowGap) - rowGap, markup, label);
}
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
/* A rectangle length by width, with the length written along the top and the width down the left side (unit: "m", "cm").
   ask: 'length' or 'width' writes ? for that side instead. grid: draw the unit squares inside (only when it has 15 or
   fewer along each side). Scaled so the longer side fits 300 pixels. */
function rectFig(length, width, { unit = "", ask = null, grid = true, label } = {}) {
  const scale = Math.min(32, 300 / length, 200 / width),
    left = 58,
    top = 34,
    w = length * scale,
    h = width * scale,
    sideText = (v, which) => (ask === which ? "?" : `${commas(v)}${unit ? " " + unit : ""}`);
  let markup = "";
  if (grid && length <= 15 && width <= 15) {
    range(length - 1).forEach((i) => {
      const x = left + (i + 1) * scale;
      markup += `<line class="rgrid" x1="${x}" y1="${top}" x2="${x}" y2="${top + h}"/>`;
    });
    range(width - 1).forEach((i) => {
      const y = top + (i + 1) * scale;
      markup += `<line class="rgrid" x1="${left}" y1="${y}" x2="${left + w}" y2="${y}"/>`;
    });
  }
  markup +=
    `<rect class="rside" x="${left}" y="${top}" width="${w}" height="${h}"/>` +
    `<text class="lbl${ask === "length" ? " cy" : ""}" x="${left + w / 2}" y="${top - 16}">${sideText(length, "length")}</text>` +
    `<text class="lbl en${ask === "width" ? " cy" : ""}" x="${left - 8}" y="${top + h / 2}">${sideText(width, "width")}</text>`;
  return svgWrap(
    left + w + 16,
    top + h + 10,
    markup,
    label ||
      `A rectangle ${ask === "length" ? "?" : length} by ${ask === "width" ? "?" : width}${unit ? " " + unit : ""}`,
  );
}
