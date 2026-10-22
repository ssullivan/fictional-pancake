/* The pictures that Grade 6 Unit 6's game (Balance Lab) and its Learn pages both use. Styles are in figs.css.
   Needs util.js (range), figures.js (svgWrap, qbox, and the table styles), and fracmath.js (fT, ftx). Hanger diagrams
   (hanger) are in shared/hanger.js; graphs (coordPlane) and letters for numbers (mathVar, withVars) are in shared/algebra.js.

   areaSplit(side, parts, {whole, label})      a rectangle `side` tall, split into parts side by side, not to scale (svg)
   valueTable(headers, rows, {hi, q, label})   a table of values: a header row, then a row for each entry (html)
   power(base, exponent)                       base with a raised exponent (html) */

/* Area diagram, not to scale: a rectangle `side` tall (text, like '3') split into parts side by side.
   parts: [{w, top, area, cut}] where w is the part's width compared with the others, top is written above it, area is
   written inside it ('?' puts the gold box there, '' leaves it empty), and cut draws it dashed: a piece taken away.
   whole: written above all the parts, with a bracket (like 45 over 40 and 5). label: what a screen reader says. */
function areaSplit(side, parts, { whole = null, label } = {}) {
  /* the rectangle is rectW by rectH, its top left at (left, top); xOf(i) is where part i starts */
  const rectW = 380,
    rectH = 110,
    left = 54,
    top = whole === null ? 34 : 70,
    sum = parts.reduce((s, part) => s + part.w, 0),
    starts = parts.map((part, i) => parts.slice(0, i).reduce((s, p) => s + p.w, 0)),
    xOf = (i) => left + (rectW * starts[i]) / sum,
    widthOf = (i) => (rectW * parts[i].w) / sum;
  let markup = "";
  if (whole !== null)
    markup +=
      `<path class="brace" d="M${left},${top - 30} v-8 H${left + rectW} v8"/>` +
      `<text class="lbl" x="${left + rectW / 2}" y="${top - 54}">${whole}</text>`;
  parts.forEach((part, i) => {
    const x = xOf(i),
      w = widthOf(i),
      mid = x + w / 2;
    markup += `<rect class="as-part ${part.cut ? "cut" : `c${i % 2}`}" x="${x}" y="${top}" width="${w}" height="${rectH}"/>`;
    markup += `<text class="lbl${part.cut ? " dm" : ""}" x="${mid}" y="${top - 14}">${part.top}</text>`;
    if (part.area === "?") markup += qbox(mid, top + rectH / 2);
    else if (part.area)
      markup += `<text class="lbl${part.cut ? " dm" : " as-area"}" x="${mid}" y="${top + rectH / 2}">${part.area}</text>`;
  });
  markup += `<text class="lbl" x="${left - 22}" y="${top + rectH / 2}">${side}</text>`;
  return svgWrap(
    left + rectW + 14,
    top + rectH + 10,
    markup,
    label ||
      `Area diagram, not to scale: a rectangle ${side} tall, split into parts ${parts.map((p) => p.top).join(" and ")} wide`,
  );
}

/* A table of values: headers across the top, then rows of cells (numbers or markup). hi: the index of a row to color cyan;
   q: [row, column] puts the gold "?" in that cell instead. label: what a screen reader says. */
function valueTable(headers, rows, { hi = -1, q = null, label = "Table of values" } = {}) {
  const head = headers.map((h) => `<th>${h}</th>`).join(""),
    body = rows
      .map(
        (row, i) =>
          `<tr${i === hi ? ' class="rev"' : ""}>${row
            .map((cell, j) => `<td>${q && q[0] === i && q[1] === j ? '<span class="q">?</span>' : cell}</td>`)
            .join("")}</tr>`,
      )
      .join("");
  return `<table class="rt" aria-label="${label}"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

/* base to the power exponent, written with a raised exponent */
const power = (base, exponent) => `${base}<sup>${exponent}</sup>`;
