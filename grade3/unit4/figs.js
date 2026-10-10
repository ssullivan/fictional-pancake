/* Pictures that Grade 3 Unit 4's game and its Learn pages both use. Needs util.js, figures.js (svgWrap), multiply.js (ctr, and
   the .plate and .hc styles in multiply.css), and pictures.css (the .lbl text styles).

   dealFig(groups, each, loose, {label})   equal groups in circles with `each` counters in each, and `loose` counters not in a
                                           group yet, in rows under them (svg): sharing out, or making groups of a size
   timesTable({cls, show, tap, label})     the multiplication table from 1 × 1 to 10 × 10, with its factors along the top and
                                           down the side (svg)
   tableRow(n, upTo, missing)              the products in the row of n's, from n × 1 to n × upTo, with one left blank (svg)
   Equal groups of base-ten blocks are divideFig (shared/blocks.js), and rectangles cut in two splitFig (shared/shapes.js). */

/* ---------- counters in equal groups, and loose ---------- */
/* `groups` circles with `each` counters in each (up to 10), and `loose` counters under them, 10 to a row (up to 100).
   With no groups it's a pile to sort; with groups and loose counters, sharing is part way done. */
function dealFig(groups, each, loose, { label } = {}) {
  /* plateW: the room each circle takes; up to 5 circles in a row. counterGap: between counters in a circle and in the pile */
  const plateW = 92,
    plateR = 40,
    counterGap = 17,
    perRow = Math.min(groups, 5),
    plateRows = Math.ceil(groups / 5),
    pileTop = plateRows * plateW + (groups ? 10 : 0),
    pileRows = Math.ceil(loose / 10),
    /* the pile takes 26 pixels a counter, up to 10 in a row */
    width = Math.max(perRow * plateW, loose ? Math.min(loose, 10) * 26 + 8 : 0);
  /* the counters in a circle go in lines of up to 4, the longer lines first (5 is 3 then 2, 10 is 4, 3, 3) */
  const lines = each <= 4 ? 1 : each <= 8 ? 2 : 3,
    perLine = range(lines).map((i) => Math.ceil((each - i) / lines));
  let markup = "";
  range(groups).forEach((k) => {
    /* a short last row of circles is centered */
    const inRow = Math.floor(k / 5) === plateRows - 1 && groups % 5 ? groups % 5 : perRow,
      rowLeft = (width - inRow * plateW) / 2,
      cx = rowLeft + plateW / 2 + (k % 5) * plateW,
      cy = plateW / 2 + Math.floor(k / 5) * plateW;
    markup += `<circle class="plate" cx="${cx}" cy="${cy}" r="${plateR}"/>`;
    perLine.forEach((count, i) =>
      range(count).forEach((j) => {
        markup += ctr(cx + (j - (count - 1) / 2) * counterGap, cy + (i - (lines - 1) / 2) * counterGap, "a", 7);
      }),
    );
  });
  /* the loose counters, blue, 10 to a row, centered under the circles */
  const pileLeft = (width - Math.min(loose, 10) * 26) / 2;
  range(loose).forEach((i) => {
    markup += ctr(pileLeft + 13 + (i % 10) * 26, pileTop + 17 + Math.floor(i / 10) * 26, "b", 10);
  });
  return svgWrap(
    width,
    pileTop + (pileRows ? pileRows * 26 + 8 : 0),
    markup,
    label ||
      [
        groups ? `${groups} group${groups === 1 ? "" : "s"} with ${each} in each` : "",
        loose ? `${loose} not in a group` : "",
      ]
        .filter(Boolean)
        .join(", "),
  );
}

/* ---------- the multiplication table ---------- */
/* The multiplication table: the factors 1 to 10 along the top and down the left side (gray), and the product of a row's
   factor and a column's factor where they meet. cls(row, col): classes for that square ('a' gold, 'b' blue, 'ab' green, 'cur'
   outlined), or ''. show(row, col): whether its product is written (default all). tap: 'cell' makes every product square
   tappable (data-v="row-col"); 'cand' makes each one a tap answer for engine.js instead (.cand, data-id="row-col"). */
function timesTable({ cls = () => "", show = () => true, tap = "", label } = {}) {
  const cellSize = 34,
    cellX = (col) => 2 + col * cellSize,
    cellY = (row) => 2 + row * cellSize;
  /* one square at row, col (0 is the factors); text is what it says */
  const square = (row, col, attrs, text) =>
    `<g ${attrs}><rect x="${cellX(col)}" y="${cellY(row)}" width="${cellSize}" height="${cellSize}"/><text class="lbl s" x="${cellX(col) + cellSize / 2}" y="${cellY(row) + cellSize / 2}">${text}</text></g>`;
  let markup = square(0, 0, 'class="hc one"', "×");
  range(10).forEach((i) => {
    markup += square(0, i + 1, 'class="hc one"', i + 1) + square(i + 1, 0, 'class="hc one"', i + 1);
  });
  range(10).forEach((i) =>
    range(10).forEach((j) => {
      const row = i + 1,
        col = j + 1,
        id = `${row}-${col}`,
        text = show(row, col) ? row * col : "",
        attrs =
          tap === "cand"
            ? `class="cand hc ${cls(row, col)}" data-id="${id}" tabindex="0" role="button" aria-label="${row} times ${col}"`
            : `class="hc ${cls(row, col)}"${tap ? ` data-v="${id}"` : ""}`;
      markup += square(row, col, attrs, text);
    }),
  );
  return svgWrap(11 * cellSize + 4, 11 * cellSize + 4, markup, label || "The multiplication table, 1 × 1 to 10 × 10");
}
/* The row of n's from the table: n × 1 to n × upTo, each product in a square under its factor, with the one for n × missing
   left as a gold ? (missing: 0 for none). */
function tableRow(n, upTo, missing = 0) {
  const cellSize = 40,
    left = 48;
  let markup = `<text class="lbl en" x="${left - 10}" y="${20}">×</text><text class="lbl en" x="${left - 10}" y="${20 + cellSize}">${n}</text>`;
  range(upTo).forEach((i) => {
    const factor = i + 1,
      x = left + i * cellSize,
      asked = factor === missing;
    markup +=
      `<text class="lbl s dm" x="${x + cellSize / 2}" y="20">${factor}</text>` +
      `<g class="hc${asked ? " a" : ""}"><rect x="${x}" y="${cellSize}" width="${cellSize}" height="${cellSize}"/>` +
      `<text class="lbl s${asked ? " cy" : ""}" x="${x + cellSize / 2}" y="${20 + cellSize}">${asked ? "?" : n * factor}</text></g>`;
  });
  return svgWrap(
    left + upTo * cellSize + 4,
    2 * cellSize + 4,
    markup,
    `The row of ${n}s: ${range(upTo)
      .map((i) => (i + 1 === missing ? "?" : n * (i + 1)))
      .join(", ")}`,
  );
}
