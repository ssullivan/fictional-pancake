/* The pictures and number formats that Grade 6 Unit 7's game (Expedition Zero) and its Learn pages both use. Styles are in
   figs.css. Needs util.js (range), figures.js (svgWrap), and algebra.js (coordPlane, mathVar); pages load pictures.css for the
   label and number-line styles.

   fmt(n)                                   a number as written: a true minus sign (−), commas, up to 2 decimal places
   money(n)                                 dollars as written: −$40, $12.50
   pt(x, y), abs(v)                         a point as written, (−3, 5), and an absolute value, |−7|
   plane(points, {size, …})                 a coordinate plane from −size to size both ways (6 by default), square (svg)
   signedLine(lo, hi, {…})                  a number line through negative numbers: dots, rays, brackets, tap targets (svg)
   vLine(lo, hi, {…})                       an up-and-down number line: a thermometer, sea level, or a bank balance (svg)
   ineqText(letter, sign, value)            an inequality as written, with its letter in italics: x ≥ −2 (html) */

/* a number as written: a true minus sign (−), commas, and up to 2 decimal places (figures.js labels use it too) */
const fmt = (n) => {
  const rounded = Math.round(n * 100) / 100;
  return (rounded < 0 ? "−" : "") + Math.abs(rounded).toLocaleString("en-US", { maximumFractionDigits: 2 });
};
/* dollars as written: −$40, $12.50 (cents only when there are some) */
const money = (n) => {
  const cents = Math.round(Math.abs(n) * 100) % 100;
  return (
    (n < 0 ? "−" : "") +
    "$" +
    Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: 2 })
  );
};
/* a point as written: (−3, 5) */
const pt = (x, y) => `(${fmt(x)}, ${fmt(y)})`;
/* |v| written with bars */
const abs = (v) => `|${fmt(v)}|`;
/* an inequality as written, like x ≥ −2: sign is one of < > ≤ ≥ */
const ineqText = (letter, sign, value) => `${mathVar(letter)} ${sign} ${fmt(value)}`;

/* A number line from lo to hi, with arrowheads at both ends (it keeps going). Ticks every `step`; tall ticks and numbers at
   multiples of `every` (every second or fifth one when the numbers wouldn't fit, and none where lab(v) is false, so a question
   can hide one).
   pts: [{v, cls, t, open, lv}] dots on the line (cls 'b' blue, 'g' green, 'r' red; open: a hollow circle), t written above
   (lv 1: a level higher, clear of a neighbor's).
   ray: {v, dir, open} the graph of an inequality: a circle at v (open: hollow, for < and >) and a thick ray to the end of the
   line, toward the greater numbers (dir 1) or the lesser (dir −1).
   spans: [{a, b, t, lv}] brackets above the line from a to b, labeled t, at level lv (0 lowest): distances.
   tap: 'cand' makes every tick a tap answer for engine.js (.cand, data-id = the number), true makes each tick a plain target
   (data-v) for a Learn widget. label: what a screen reader says. */
function signedLine(
  lo,
  hi,
  {
    step = 1,
    every = hi - lo > 16 ? 5 : 1,
    lab = () => true,
    pts = [],
    ray = null,
    spans = [],
    tap = false,
    width = 420,
    label = "Number line",
  } = {},
) {
  /* the line runs from xOf(lo) to xOf(hi), pad in from each side. Above it: the dots' labels (dotRoom, 18 more for a raised
     one), then brackets (30 a level) from spanBase up */
  const pad = 34,
    arrowLen = 18,
    unitW = (width - 2 * pad) / (hi - lo),
    levels = spans.length ? Math.max(...spans.map((s) => s.lv || 0)) + 1 : 0,
    dotRoom = pts.some((p) => p.t != null) ? 30 + (pts.some((p) => p.lv) ? 18 : 0) : 12,
    lineY = 26 + dotRoom + levels * 30,
    spanBase = lineY - dotRoom - 6,
    xOf = (v) => pad + (v - lo) * unitW,
    ticks = Math.round((hi - lo) / step) + 1,
    /* tick i's value, without floating-point dust (−2.5, not −2.4999999) */
    tickAt = (i) => Math.round((lo + i * step) * 1e6) / 1e6,
    isBig = (v) => Math.abs(Math.round(v / every) * every - v) < 1e-9,
    /* numbers on every tall tick when they fit (about 10.5 pixels a character, and 8 between), otherwise on every second
       or fifth one, counted from an inequality's boundary (or from 0) so it keeps its number */
    longest = Math.max(fmt(lo).length, fmt(hi).length),
    skip = [1, 2, 5, 10].find((k) => k * every * unitW >= longest * 10.5 + 8) || 10,
    anchor = ray ? ray.v : 0,
    numbered = (v) =>
      isBig(v) && Math.abs(Math.round((v - anchor) / (every * skip)) * every * skip - (v - anchor)) < 1e-9;
  let markup =
    `<line class="axis" x1="${pad - arrowLen}" y1="${lineY}" x2="${width - pad + arrowLen}" y2="${lineY}"/>` +
    `<polygon class="arrh ax" points="${pad - arrowLen - 10},${lineY} ${pad - arrowLen + 2},${lineY - 7} ${pad - arrowLen + 2},${lineY + 7}"/>` +
    `<polygon class="arrh ax" points="${width - pad + arrowLen + 10},${lineY} ${width - pad + arrowLen - 2},${lineY - 7} ${width - pad + arrowLen - 2},${lineY + 7}"/>`;
  range(ticks).forEach((i) => {
    const v = tickAt(i),
      big = isBig(v),
      x = xOf(v);
    markup += `<line class="tick${v === 0 ? " zero" : ""}" x1="${x}" y1="${lineY - (big ? 9 : 5)}" x2="${x}" y2="${lineY + (big ? 9 : 5)}"/>`;
    if (numbered(v) && lab(v)) markup += `<text class="lbl" x="${x}" y="${lineY + 25}">${fmt(v)}</text>`;
  });
  /* an inequality's ray: thick from v to the line's end, with an arrowhead, then the circle at v on top */
  if (ray) {
    const x = xOf(ray.v),
      end = ray.dir > 0 ? width - pad + arrowLen : pad - arrowLen;
    markup +=
      `<line class="sl-ray" x1="${x}" y1="${lineY}" x2="${end}" y2="${lineY}"/>` +
      `<polygon class="sl-rayh" points="${end + ray.dir * 12},${lineY} ${end - ray.dir * 2},${lineY - 9} ${end - ray.dir * 2},${lineY + 9}"/>` +
      `<circle class="sl-end${ray.open ? " open" : ""}" cx="${x}" cy="${lineY}" r="8"/>`;
  }
  spans.forEach(({ a, b, t, lv = 0 }) => {
    const y = spanBase - lv * 30,
      xa = xOf(a),
      xb = xOf(b);
    markup +=
      `<path class="sl-span" d="M${xa},${y + 8} V${y} H${xb} V${y + 8}"/>` +
      `<text class="lbl s cy" x="${(xa + xb) / 2}" y="${y - 11}">${t}</text>`;
  });
  pts.forEach(({ v, cls = "", t, open, lv = 0 }) => {
    markup += `<circle class="pt ${cls}${open ? " sl-hollow" : ""}" cx="${xOf(v)}" cy="${lineY}" r="7"/>`;
    if (t != null)
      markup += `<text class="lbl ${cls === "b" ? "cy" : "gd"}" x="${xOf(v)}" y="${lineY - 21 - lv * 18}">${t}</text>`;
  });
  /* tap targets: a box around each tick, a step wide */
  if (tap)
    range(ticks).forEach((i) => {
      const v = tickAt(i),
        box = `x="${xOf(v) - (step * unitW) / 2}" y="${lineY - 30}" width="${step * unitW}" height="62"`;
      markup +=
        tap === "cand"
          ? `<rect class="cand hit" data-id="${v}" tabindex="0" role="button" aria-label="Tick mark ${i + 1}" ${box}/>`
          : `<rect class="hit" data-v="${v}" ${box}/>`;
    });
  return svgWrap(width, lineY + 40, markup, label);
}

/* An up-and-down number line from lo (bottom) to hi (top), numbered every `every` with `unit` after each number.
   kind: 'temp' draws a thermometer filled up to `value`; 'sea' draws water below 0 and sky above, with sea level marked;
   'money' writes "owe" below 0 and "have" above. pts: [{v, t, cls}] dots on the line with t written to their right
   (cls 'b' blue, 'r' red). label: what a screen reader says. */
function vLine(lo, hi, { every = 5, step = every, unit = "", kind = "", value = null, pts = [], label } = {}) {
  /* the line runs up x = lineX from yOf(lo) to yOf(hi) */
  const height = 300,
    top = 20,
    bottomPad = kind === "temp" ? 48 : 20,
    lineX = 110,
    width = 330,
    unitH = (height - top - bottomPad) / (hi - lo),
    yOf = (v) => top + (hi - v) * unitH,
    isBig = (v) => Math.abs(Math.round(v / every) * every - v) < 1e-9;
  let markup = "";
  if (kind === "sea")
    markup +=
      `<rect class="vl-sky" x="${lineX - 60}" y="${top - 10}" width="${width - lineX + 50}" height="${yOf(0) - top + 10}"/>` +
      `<rect class="vl-sea" x="${lineX - 60}" y="${yOf(0)}" width="${width - lineX + 50}" height="${yOf(lo) - yOf(0) + 10}"/>` +
      `<text class="lbl s cy en" x="${width - 12}" y="${yOf(0) - 12}">sea level</text>`;
  if (kind === "money")
    markup +=
      `<text class="lbl s dm st" x="${width - 74}" y="${(yOf(hi) + yOf(0)) / 2}">have</text>` +
      `<text class="lbl s dm st" x="${width - 74}" y="${(yOf(0) + yOf(lo)) / 2}">owe</text>` +
      `<line class="guide" x1="${lineX}" y1="${yOf(0)}" x2="${width - 20}" y2="${yOf(0)}"/>`;
  if (kind === "temp") {
    /* the glass tube, the bulb at the bottom, and the liquid from the bulb up to the temperature */
    const tubeW = 18,
      bulbY = yOf(lo) + 26;
    markup += `<rect class="vl-tube" x="${lineX - tubeW / 2}" y="${yOf(hi) - 12}" width="${tubeW}" height="${bulbY - yOf(hi) + 12}" rx="9"/>`;
    if (value !== null)
      markup += `<rect class="vl-fill${value < 0 ? " cold" : ""}" x="${lineX - 4}" y="${yOf(value)}" width="8" height="${bulbY - yOf(value)}"/>`;
    markup += `<circle class="vl-bulb${value !== null && value < 0 ? " cold" : ""}" cx="${lineX}" cy="${bulbY}" r="15"/>`;
  } else markup += `<line class="axis" x1="${lineX}" y1="${yOf(hi) - 10}" x2="${lineX}" y2="${yOf(lo) + 10}"/>`;
  range(Math.round((hi - lo) / step) + 1).forEach((i) => {
    const v = Math.round((lo + i * step) * 1e6) / 1e6,
      big = isBig(v),
      y = yOf(v);
    markup += `<line class="tick${v === 0 ? " zero" : ""}" x1="${lineX - (big ? 18 : 12)}" y1="${y}" x2="${lineX - 9}" y2="${y}"/>`;
    if (big) markup += `<text class="lbl s en" x="${lineX - 24}" y="${y}">${fmt(v)}${unit}</text>`;
  });
  pts.forEach(({ v, t, cls = "" }) => {
    markup += `<circle class="pt ${cls}" cx="${lineX + (kind === "temp" ? 22 : 0)}" cy="${yOf(v)}" r="7"/>`;
    if (t != null)
      markup += `<text class="lbl s st ${cls === "b" ? "cy" : "gd"}" x="${lineX + 36}" y="${yOf(v)}">${t}</text>`;
  });
  return svgWrap(width, height, markup, label || `Vertical number line from ${fmt(lo)} to ${fmt(hi)}`);
}

/* a coordinate plane from −size to size both ways (6 by default), with square grid cells; other options go to coordPlane */
const plane = (points, opts = {}) =>
  coordPlane(points, {
    xMin: -opts.size || -6,
    xMax: opts.size || 6,
    yMin: -opts.size || -6,
    yMax: opts.size || 6,
    width: 300,
    height: 300,
    ...opts,
  });
