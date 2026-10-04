/* The pictures that Grade 6 Unit 6's game (Balance Lab) and its Learn pages both use. Styles are in figs.css.
   Needs util.js (range), figures.js (svgWrap, qbox, and the table styles), and fracmath.js (fT, ftx).

   hanger(left, right, {tip, letter, label})   a hanger diagram: a beam on a hook with weights hanging from each end (svg)
   areaSplit(side, parts, {whole, label})      a rectangle `side` tall, split into parts side by side, not to scale (svg)
   graphQ1(points, {…})                        a first-quadrant graph: gridlines, numbered and labeled axes, and points (svg)
   valueTable(headers, rows, {hi, q, label})   a table of values: a header row, then a row for each entry (html)
   mathVar(letter)                             a letter that stands for a number, in italics (html)
   withVars(text)                              text with its letters for numbers in italics (html)
   power(base, exponent)                       base with a raised exponent (html) */

/* Hanger diagram. left and right list what hangs on each side: 'x' is a circle for the unknown (written with `letter`), 1 is a
   square weighing 1, any other number is a block with its weight written on it, and [n, d] is a block with a fraction.
   tip: 0 balanced, 1 the right side lower (heavier), −1 the left side lower. label: what a screen reader says. */
function hanger(left, right, { tip = 0, letter = "x", label } = {}) {
  /* the beam turns tiltDeg about the hook at (hookX, hookY); its ends are armLen out; weights hang stringLen under each end */
  const width = 420,
    hookX = width / 2,
    hookY = 34,
    armLen = 130,
    tiltDeg = 7,
    stringLen = 26,
    rowMax = 170,
    gap = 6,
    angle = (tip * tiltDeg * Math.PI) / 180;
  /* how wide a weight is drawn: unknowns 36, unit squares 26, labeled blocks wide enough for their label */
  const sizeOf = (w) =>
    w === "x" ? 36 : w === 1 ? 26 : Array.isArray(w) ? 50 : Math.max(44, String(w).length * 11 + 16);
  /* one weight with its top left corner at (x, y); rowH is the height of its row */
  const weight = (w, x, y, rowH) => {
    const size = sizeOf(w),
      cy = y + rowH / 2;
    if (w === "x")
      return `<circle class="hg-x" cx="${x + size / 2}" cy="${cy}" r="${size / 2}"/><text class="lbl hg-let" x="${x + size / 2}" y="${cy}">${letter}</text>`;
    if (w === 1) return `<rect class="hg-one" x="${x}" y="${cy - size / 2}" width="${size}" height="${size}" rx="3"/>`;
    return (
      `<rect class="hg-w" x="${x}" y="${y}" width="${size}" height="${rowH}" rx="5"/>` +
      (Array.isArray(w) ? fT(x + size / 2, cy, w) : `<text class="lbl" x="${x + size / 2}" y="${cy}">${w}</text>`)
    );
  };
  /* a side's weights in rows no wider than rowMax, each row centered under the end of the beam at (endX, endY) */
  const side = (list, endX, endY) => {
    const rows = [[]];
    let rowW = 0;
    list.forEach((w) => {
      const size = sizeOf(w);
      if (rows[rows.length - 1].length && rowW + gap + size > rowMax) {
        rows.push([]);
        rowW = 0;
      }
      rowW += (rows[rows.length - 1].length ? gap : 0) + size;
      rows[rows.length - 1].push(w);
    });
    const rowH = list.some((w) => w !== 1 && w !== "x") ? 40 : 36;
    let y = endY + stringLen,
      markup = `<line class="hg-str" x1="${endX}" y1="${endY}" x2="${endX}" y2="${y}"/>`;
    rows.forEach((row) => {
      const total = row.reduce((s, w) => s + sizeOf(w), 0) + gap * (row.length - 1);
      let x = endX - total / 2;
      row.forEach((w) => {
        markup += weight(w, x, y, rowH);
        x += sizeOf(w) + gap;
      });
      y += rowH + gap;
    });
    return { markup, bottom: y };
  };
  const dx = armLen * Math.cos(angle),
    dy = armLen * Math.sin(angle),
    leftEnd = [hookX - dx, hookY - dy],
    rightEnd = [hookX + dx, hookY + dy],
    leftSide = side(left, ...leftEnd),
    rightSide = side(right, ...rightEnd);
  const markup =
    `<path class="hg-hook" d="M${hookX},4 V${hookY}"/><circle class="hg-pin" cx="${hookX}" cy="${hookY}" r="5"/>` +
    `<line class="hg-beam" x1="${leftEnd[0]}" y1="${leftEnd[1]}" x2="${rightEnd[0]}" y2="${rightEnd[1]}"/>` +
    leftSide.markup +
    rightSide.markup;
  /* what each side holds, said in words */
  const say = (list) => {
    const xs = list.filter((w) => w === "x").length,
      ones = list.filter((w) => w === 1).length,
      blocks = list.filter((w) => w !== "x" && w !== 1).map((w) => (Array.isArray(w) ? ftx(w) : String(w)));
    return (
      [
        xs ? `${xs} ${letter}` : "",
        ones ? `${ones} unit square${ones === 1 ? "" : "s"}` : "",
        blocks.length ? `block${blocks.length === 1 ? "" : "s"} of ${blocks.join(" and ")}` : "",
      ]
        .filter(Boolean)
        .join(", ") || "nothing"
    );
  };
  const state = tip ? `tipped, the ${tip > 0 ? "right" : "left"} side lower` : "balanced";
  return svgWrap(
    width,
    Math.max(leftSide.bottom, rightSide.bottom) + 6,
    markup,
    label || `Hanger diagram, ${state}: left side ${say(left)}; right side ${say(right)}`,
  );
}

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

/* First-quadrant graph from 0 to xMax across and 0 to yMax up, with gridlines every xStep and yStep, each numbered, and the
   axes labeled xLabel and yLabel. points: [{x, y, id, cls, t}]: cls 'b' draws it blue and 'hi' outlines it; t is written
   beside it. tap: each point is a .cand for engine.js to tap (data-id = its id). line: [m, b] draws the dashed line
   y = m·x + b behind the points. label: what a screen reader says. */
function graphQ1(
  points,
  { xMax, yMax, xStep = 1, yStep = 1, xLabel = "x", yLabel = "y", tap = false, line = null, label } = {},
) {
  /* the plot is plotW by plotH, its bottom left (the origin) at (left, bottom); xOf and yOf turn values into pixels */
  const plotW = 340,
    plotH = 230,
    left = 62,
    topPad = 16,
    bottom = topPad + plotH,
    xOf = (v) => left + (plotW * v) / xMax,
    yOf = (v) => bottom - (plotH * v) / yMax;
  let markup = "";
  /* gridlines and their numbers; every other number is left off when the lines are closer than 22 pixels */
  const xEvery = (plotW * xStep) / xMax < 22 ? 2 : 1,
    yEvery = (plotH * yStep) / yMax < 22 ? 2 : 1;
  range(Math.round(xMax / xStep) + 1).forEach((i) => {
    const v = i * xStep;
    markup += `<line class="gq-grid" x1="${xOf(v)}" y1="${yOf(0)}" x2="${xOf(v)}" y2="${yOf(yMax)}"/>`;
    if (i % xEvery === 0) markup += `<text class="lbl s dm" x="${xOf(v)}" y="${bottom + 16}">${v}</text>`;
  });
  range(Math.round(yMax / yStep) + 1).forEach((i) => {
    const v = i * yStep;
    markup += `<line class="gq-grid" x1="${xOf(0)}" y1="${yOf(v)}" x2="${xOf(xMax)}" y2="${yOf(v)}"/>`;
    if (i % yEvery === 0) markup += `<text class="lbl s dm en" x="${left - 8}" y="${yOf(v)}">${v}</text>`;
  });
  markup +=
    `<line class="gq-axis" x1="${xOf(0)}" y1="${yOf(0)}" x2="${xOf(xMax)}" y2="${yOf(0)}"/>` +
    `<line class="gq-axis" x1="${xOf(0)}" y1="${yOf(0)}" x2="${xOf(0)}" y2="${yOf(yMax)}"/>` +
    `<text class="lbl s" x="${left + plotW / 2}" y="${bottom + 40}">${xLabel}</text>` +
    `<text class="lbl s" x="16" y="${topPad + plotH / 2}" transform="rotate(-90 16 ${topPad + plotH / 2})">${yLabel}</text>`;
  /* the line y = m·x + b, from x = 0 to where it leaves the plot (the top or the right side) */
  if (line) {
    const [m, b] = line,
      xEnd = m > 0 ? Math.min(xMax, (yMax - b) / m) : xMax;
    markup += `<line class="gq-line" x1="${xOf(0)}" y1="${yOf(b)}" x2="${xOf(xEnd)}" y2="${yOf(m * xEnd + b)}"/>`;
  }
  points.forEach((p) => {
    const cx = xOf(p.x),
      cy = yOf(p.y),
      dot = `<circle class="gq-pt${p.cls ? " " + p.cls : ""}" cx="${cx}" cy="${cy}" r="6"/>`;
    markup += tap
      ? `<g class="cand" data-id="${p.id}" tabindex="0" role="button" aria-label="Point (${p.x}, ${p.y})"><circle class="hit" cx="${cx}" cy="${cy}" r="16"/>${dot}</g>`
      : dot;
    if (p.t) markup += `<text class="lbl s gd st" x="${cx + 10}" y="${cy - 12}">${p.t}</text>`;
  });
  return svgWrap(
    left + plotW + 20,
    bottom + 52,
    markup,
    label ||
      `Graph of ${yLabel} against ${xLabel}${points.length ? `, with points ${points.map((p) => `(${p.x}, ${p.y})`).join(", ")}` : ""}`,
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

/* a letter that stands for a number, in italics */
const mathVar = (letter) => `<i class="mv">${letter}</i>`;
/* text with each letter that stands for a number in italics: a lowercase letter with no letter or apostrophe on either side,
   as in 3x or x + 4. Left alone: the words "a" and "i" (never letters for numbers here), an s after a digit (the plural in
   "how many 2s"), and HTML tags. */
const withVars = (text) =>
  text.replace(/<[^>]*>|(?<![A-Za-z’'])[b-hj-z](?![A-Za-z’'])/g, (match, offset) =>
    match[0] === "<" || (match === "s" && /\d/.test(text[offset - 1])) ? match : mathVar(match),
  );
/* base to the power exponent, written with a raised exponent */
const power = (base, exponent) => `${base}<sup>${exponent}</sup>`;
