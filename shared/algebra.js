/* Letters for numbers and coordinate planes, for Grade 6 (Units 6 and 7) and up. Styles are in algebra.css.
   Needs util.js (range) and figures.js (svgWrap).

   mathVar(letter)                   a letter that stands for a number, in italics (html)
   withVars(text)                    text with its letters for numbers in italics (html)
   coordPlane(points, {…})           a coordinate plane: the first quadrant or all four, with gridlines, numbered axes, points,
                                     lines, and shapes (svg) */

/* a letter that stands for a number, in italics */
const mathVar = (letter) => `<i class="mv">${letter}</i>`;
/* text with each letter that stands for a number in italics: a lowercase letter with no letter or apostrophe on either side,
   as in 3x or x + 4. Left alone: the words "a" and "i" (never letters for numbers here), an s after a digit (the plural in
   "how many 2s"), and HTML tags. */
const withVars = (text) =>
  text.replace(/<[^>]*>|(?<![A-Za-z’'])[b-hj-z](?![A-Za-z’'])/g, (match, offset) =>
    match[0] === "<" || (match === "s" && /\d/.test(text[offset - 1])) ? match : mathVar(match),
  );

/* A coordinate plane from xMin to xMax across and yMin to yMax up (both minimums 0 by default: the first quadrant), with
   gridlines every xStep and yStep, each numbered (negative numbers with a minus sign), the axes through 0, and the axes labeled
   xLabel and yLabel. The plot is width by height pixels.
   points: [{x, y, id, cls, t}]: cls 'b' draws it blue, 'hi' outlines it, and 'r' draws it red; t is written beside it.
   tap: each point is a .cand for engine.js to tap (data-id = its id). line: [m, b] draws the dashed line y = m·x + b behind the
   points, from x = xMin. shapes: [{pts: [[x, y], …], closed, cls}] draws lines through those points in order (closed: back to
   the first), behind the points; cls 'walk' is a dashed path and 'fill' a shaded shape. quads: write I, II, III, and IV in the
   quadrants. shade: a quadrant to shade ('I' to 'IV'). label: what a screen reader says. */
function coordPlane(
  points,
  {
    xMin = 0,
    xMax,
    yMin = 0,
    yMax,
    xStep = 1,
    yStep = 1,
    xLabel = "x",
    yLabel = "y",
    width = 340,
    height = 230,
    tap = false,
    line = null,
    shapes = [],
    quads = false,
    shade = null,
    label,
  } = {},
) {
  /* the plot is plotW by plotH, its bottom left at (left, bottom); xOf and yOf turn values into pixels */
  const plotW = width,
    plotH = height,
    left = 62,
    topPad = 16,
    bottom = topPad + plotH,
    xOf = (v) => left + (plotW * (v - xMin)) / (xMax - xMin),
    yOf = (v) => bottom - (plotH * (v - yMin)) / (yMax - yMin),
    /* a number as written, with a true minus sign */
    num = (v) => (v < 0 ? `−${-v}` : `${v}`);
  let markup = "";
  /* a shaded quadrant, and the quadrants' names, behind everything else */
  const quadrants = { I: [1, 1], II: [-1, 1], III: [-1, -1], IV: [1, -1] };
  if (shade) {
    const [sx, sy] = quadrants[shade],
      x0 = xOf(0),
      y0 = yOf(0),
      x1 = xOf(sx > 0 ? xMax : xMin),
      y1 = yOf(sy > 0 ? yMax : yMin);
    markup += `<rect class="gq-shade" x="${Math.min(x0, x1)}" y="${Math.min(y0, y1)}" width="${Math.abs(x1 - x0)}" height="${Math.abs(y1 - y0)}"/>`;
  }
  if (quads)
    Object.entries(quadrants).forEach(([name, [sx, sy]]) => {
      const x = (xOf(0) + xOf(sx > 0 ? xMax : xMin)) / 2,
        y = (yOf(0) + yOf(sy > 0 ? yMax : yMin)) / 2;
      markup += `<text class="lbl gq-quad" x="${x}" y="${y}">${name}</text>`;
    });
  /* gridlines and their numbers, along the bottom and the left side (clear of the axes when they cross in the middle);
     every other number is left off when the lines are closer than 22 pixels */
  const xEvery = (plotW * xStep) / (xMax - xMin) < 22 ? 2 : 1,
    yEvery = (plotH * yStep) / (yMax - yMin) < 22 ? 2 : 1;
  range(Math.round((xMax - xMin) / xStep) + 1).forEach((i) => {
    const v = xMin + i * xStep;
    markup += `<line class="gq-grid" x1="${xOf(v)}" y1="${yOf(yMin)}" x2="${xOf(v)}" y2="${yOf(yMax)}"/>`;
    if (i % xEvery === 0) markup += `<text class="lbl s dm" x="${xOf(v)}" y="${bottom + 16}">${num(v)}</text>`;
  });
  range(Math.round((yMax - yMin) / yStep) + 1).forEach((i) => {
    const v = yMin + i * yStep;
    markup += `<line class="gq-grid" x1="${xOf(xMin)}" y1="${yOf(v)}" x2="${xOf(xMax)}" y2="${yOf(v)}"/>`;
    if (i % yEvery === 0) markup += `<text class="lbl s dm en" x="${left - 8}" y="${yOf(v)}">${num(v)}</text>`;
  });
  markup +=
    `<line class="gq-axis" x1="${xOf(xMin)}" y1="${yOf(0)}" x2="${xOf(xMax)}" y2="${yOf(0)}"/>` +
    `<line class="gq-axis" x1="${xOf(0)}" y1="${yOf(yMin)}" x2="${xOf(0)}" y2="${yOf(yMax)}"/>` +
    `<text class="lbl s" x="${left + plotW / 2}" y="${bottom + 40}">${xLabel}</text>` +
    /* a one-letter label (y) reads upright; a longer one runs up the side */
    (yLabel.length > 1
      ? `<text class="lbl s" x="16" y="${topPad + plotH / 2}" transform="rotate(-90 16 ${topPad + plotH / 2})">${yLabel}</text>`
      : `<text class="lbl s" x="16" y="${topPad + plotH / 2}">${yLabel}</text>`);
  /* the line y = m·x + b, from x = xMin to where it leaves the plot (the top or the right side) */
  if (line) {
    const [m, b] = line,
      xEnd = m > 0 ? Math.min(xMax, (yMax - b) / m) : xMax;
    markup += `<line class="gq-line" x1="${xOf(xMin)}" y1="${yOf(m * xMin + b)}" x2="${xOf(xEnd)}" y2="${yOf(m * xEnd + b)}"/>`;
  }
  /* lines through points in order: paths and shapes */
  shapes.forEach(({ pts, closed = false, cls = "" }) => {
    const at = pts.map(([x, y]) => `${xOf(x)},${yOf(y)}`).join(" ");
    markup += closed
      ? `<polygon class="gq-shape ${cls}" points="${at}"/>`
      : `<polyline class="gq-shape ${cls}" points="${at}"/>`;
  });
  points.forEach((p) => {
    const cx = xOf(p.x),
      cy = yOf(p.y),
      dot = `<circle class="gq-pt${p.cls ? " " + p.cls : ""}" cx="${cx}" cy="${cy}" r="6"/>`;
    markup += tap
      ? `<g class="cand" data-id="${p.id}" tabindex="0" role="button" aria-label="Point (${num(p.x)}, ${num(p.y)})"><circle class="hit" cx="${cx}" cy="${cy}" r="16"/>${dot}</g>`
      : dot;
    /* t goes up and to the right of the point, or to the left when it would run off the right side (about 8.5 pixels a
       character) */
    if (p.t)
      markup +=
        cx + 10 + 8.5 * String(p.t).length > left + plotW + 20
          ? `<text class="lbl s gd en" x="${cx - 10}" y="${cy - 12}">${p.t}</text>`
          : `<text class="lbl s gd st" x="${cx + 10}" y="${cy - 12}">${p.t}</text>`;
  });
  return svgWrap(
    left + plotW + 20,
    bottom + 52,
    markup,
    label ||
      `Graph of ${yLabel} against ${xLabel}${points.length ? `, with points ${points.map((p) => `(${num(p.x)}, ${num(p.y)})`).join(", ")}` : ""}`,
  );
}
