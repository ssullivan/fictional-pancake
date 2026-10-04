/* The statistics and pictures that Grade 6 Unit 8's game (Data Detectives) and its Learn pages both use. Styles are in
   figs.css. Needs util.js (range) and figures.js (svgWrap); pages load pictures.css for the label and axis styles.

   fmt(n)                                   a number as written: commas, up to 2 decimal places
   sortUp(values)                           the values from least to greatest (a copy)
   meanOf, medianOf, madOf, rangeOf (values)   the mean, the median, the mean absolute deviation, and the range
   quartilesOf(values)                      [Q1, median, Q3], IM's way: the medians of the lower and upper halves, leaving out
                                            the middle value when there's an odd number of values
   fiveOf(values)                           the five-number summary: [minimum, Q1, median, Q3, maximum]
   dotPlot(values, {…})                     a dot plot on a numbered axis, with a mean or median line, distances to the mean, a
                                            fulcrum, box plots under the dots, and tap targets (svg)
   boxPlot(five, {…})                       a box plot on a numbered axis: dotPlot with no dots (svg)
   histogram(counts, {…})                   a histogram: bars side by side, one for each interval, the counts up the side (svg) */

/* a number as written: commas and up to 2 decimal places */
const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });

/* ---------- statistics ---------- */
const sortUp = (values) => values.slice().sort((a, b) => a - b);
/* the sum shared equally: add them all, divide by how many */
const meanOf = (values) => values.reduce((s, v) => s + v, 0) / values.length;
/* the middle of the sorted values, or halfway between the two middle ones */
const medianOf = (values) => {
  const sorted = sortUp(values),
    half = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[half] : (sorted[half - 1] + sorted[half]) / 2;
};
/* the average distance from the mean: each value's distance to the mean, then the mean of those distances */
const madOf = (values) => {
  const center = meanOf(values);
  return meanOf(values.map((v) => Math.abs(v - center)));
};
const rangeOf = (values) => Math.max(...values) - Math.min(...values);
/* Q1 is the median of the values below the middle and Q3 of the values above it; with an odd count the middle value is in
   neither half */
const quartilesOf = (values) => {
  const sorted = sortUp(values),
    half = Math.floor(sorted.length / 2),
    lower = sorted.slice(0, half),
    upper = sorted.slice(sorted.length % 2 ? half + 1 : half);
  return [medianOf(lower), medianOf(sorted), medianOf(upper)];
};
const fiveOf = (values) => [Math.min(...values), ...quartilesOf(values), Math.max(...values)];

/* ---------- pictures ---------- */
/* A dot plot of values on an axis from lo to hi, with ticks every `step` and numbers every `every`, and xLabel (the variable
   and its unit) under it. Dots of the same value stack up.
   blue: a value or a test (v => true/false) for dots to draw blue; mean, median: a dashed line at that value, labeled;
   mark: {v, text} another line like the median's, labeled text (a guess, a fulcrum's place).
   dists: a line from each dot to the mean (or the fulcrum), for the mean absolute deviation. fulcrum: a triangle under the axis
   at that value.
   box: a five-number summary to draw as a box plot under the dots; boxes: [{five, name}] for several, each named at the left.
   tap: 'cand' makes each tick's column a tap answer for engine.js (data-id = the value), true a plain target (data-v);
   'parts' makes the four parts of a single box plot tap answers (data-id w1, b1, b2, w2: whisker, box, box, whisker).
   label: what a screen reader says. */
function dotPlot(
  values,
  {
    lo,
    hi,
    step = 1,
    every = step,
    xLabel = "",
    blue = null,
    mean = null,
    median = null,
    mark = null,
    dists = false,
    fulcrum = null,
    box = null,
    boxes = box ? [{ five: box }] : [],
    tap = false,
    width = 440,
    label,
  } = {},
) {
  /* the axis runs from xOf(lo) to xOf(hi), with room on the left for box plot names. The dots stack in rows dotGap apart,
     above room for the line labels; box plots come next, boxH each; then the axis */
  const named = boxes.some((b) => b.name),
    left = named ? 80 : 24,
    right = 24,
    unitW = (width - left - right) / (hi - lo),
    xOf = (v) => left + (v - lo) * unitW,
    counts = {},
    stackOf = values.map((v) => (counts[v] = (counts[v] || 0) + 1) - 1),
    tallest = Math.max(0, ...Object.values(counts)),
    dotR = Math.max(4, Math.min(9, unitW * step * 0.42)),
    dotGap = 2 * dotR + 3,
    labelRoom = mean !== null || median !== null || mark !== null ? 40 : 10,
    dotsBottom = labelRoom + tallest * dotGap + (values.length ? 6 : 0),
    boxH = 46,
    axisY = dotsBottom + boxes.length * boxH + 8,
    isBlue = typeof blue === "function" ? blue : (v) => v === blue,
    /* distances are drawn to the mean, or to the fulcrum when there's no mean line */
    target = mean !== null ? mean : fulcrum;
  let markup = "";
  /* tap targets go first, under everything: a column a tick wide at each tick */
  const ticks = range(Math.round((hi - lo) / step) + 1).map((i) => Math.round((lo + i * step) * 1e6) / 1e6);
  if (tap === "cand" || tap === true)
    ticks.forEach((v, i) => {
      const box = `x="${xOf(v) - (step * unitW) / 2}" y="4" width="${step * unitW}" height="${axisY + 6}"`;
      markup +=
        tap === "cand"
          ? `<rect class="cand hit" data-id="${v}" tabindex="0" role="button" aria-label="Column ${i + 1}" ${box}/>`
          : `<rect class="hit" data-v="${v}" ${box}/>`;
    });
  /* the mean and median lines, labeled at the top: the mean on the first row, the median on the second */
  const centerLine = (v, cls, text, row) =>
    `<line class="dp-${cls}" x1="${xOf(v)}" y1="${8 + row * 16 + 8}" x2="${xOf(v)}" y2="${axisY}"/>` +
    `<text class="lbl s dp-${cls}t" x="${xOf(v)}" y="${8 + row * 16}">${text}</text>`;
  if (mean !== null) markup += centerLine(mean, "mean", `mean ${fmt(mean)}`, 0);
  if (median !== null) markup += centerLine(median, "med", `median ${fmt(median)}`, mean !== null ? 1 : 0);
  if (mark !== null) markup += centerLine(mark.v, "med", mark.text, mean !== null || median !== null ? 1 : 0);
  /* each dot, stacked from the bottom up; with dists, a line from it across to the mean */
  values.forEach((v, i) => {
    const cx = xOf(v),
      cy = dotsBottom - dotR - stackOf[i] * dotGap;
    if (dists && target !== null && v !== target)
      markup += `<line class="dp-dist" x1="${cx}" y1="${cy}" x2="${xOf(target)}" y2="${cy}"/>`;
    markup += `<circle class="dp-dot${isBlue(v) ? " cy" : ""}" cx="${cx}" cy="${cy}" r="${dotR}"/>`;
  });
  /* box plots: whiskers out to the least and greatest values, the box from Q1 to Q3, and a line at the median */
  boxes.forEach(({ five, name }, b) => {
    const [least, q1, mid, q3, most] = five,
      y = dotsBottom + b * boxH + boxH / 2,
      half = 14,
      parts = [
        ["w1", `<line class="bp-w" x1="${xOf(least)}" y1="${y}" x2="${xOf(q1)}" y2="${y}"/>`, least, q1],
        [
          "b1",
          `<rect class="bp-box" x="${xOf(q1)}" y="${y - half}" width="${xOf(mid) - xOf(q1)}" height="${2 * half}"/>`,
          q1,
          mid,
        ],
        [
          "b2",
          `<rect class="bp-box" x="${xOf(mid)}" y="${y - half}" width="${xOf(q3) - xOf(mid)}" height="${2 * half}"/>`,
          mid,
          q3,
        ],
        ["w2", `<line class="bp-w" x1="${xOf(q3)}" y1="${y}" x2="${xOf(most)}" y2="${y}"/>`, q3, most],
      ];
    if (name) markup += `<text class="lbl s en" x="${left - 14}" y="${y}">${name}</text>`;
    parts.forEach(([id, drawn, from, to], k) => {
      markup +=
        tap === "parts"
          ? `<g class="cand" data-id="${id}" tabindex="0" role="button" aria-label="Part ${k + 1} of the box plot"><rect class="hit" x="${xOf(from) - 4}" y="${y - half - 6}" width="${xOf(to) - xOf(from) + 8}" height="${2 * half + 12}"/>${drawn}</g>`
          : drawn;
    });
    markup +=
      `<line class="bp-mid" x1="${xOf(mid)}" y1="${y - half}" x2="${xOf(mid)}" y2="${y + half}"/>` +
      `<line class="bp-w" x1="${xOf(least)}" y1="${y - 8}" x2="${xOf(least)}" y2="${y + 8}"/>` +
      `<line class="bp-w" x1="${xOf(most)}" y1="${y - 8}" x2="${xOf(most)}" y2="${y + 8}"/>`;
  });
  /* the axis, its ticks and numbers, its label, and the fulcrum under it */
  markup += `<line class="axis" x1="${xOf(lo) - 10}" y1="${axisY}" x2="${xOf(hi) + 10}" y2="${axisY}"/>`;
  /* numbers on every tall tick when they fit (about 10.5 pixels a character at this size, and 8 between), otherwise on every
     second or fifth one */
  const longest = Math.max(fmt(lo).length, fmt(hi).length),
    skip = [1, 2, 5, 10].find((k) => k * every * unitW >= longest * 10.5 + 8) || 10;
  ticks.forEach((v) => {
    const tall = Math.abs(Math.round(v / every) * every - v) < 1e-9,
      big = tall && Math.abs(Math.round(v / (every * skip)) * every * skip - v) < 1e-9;
    markup += `<line class="tick" x1="${xOf(v)}" y1="${axisY}" x2="${xOf(v)}" y2="${axisY + (tall ? 8 : 5)}"/>`;
    if (big) markup += `<text class="lbl" x="${xOf(v)}" y="${axisY + 22}">${fmt(v)}</text>`;
  });
  let bottom = axisY + 34;
  if (fulcrum !== null) {
    markup += `<polygon class="dp-fulcrum" points="${xOf(fulcrum)},${axisY + 2} ${xOf(fulcrum) - 9},${axisY + 13} ${xOf(fulcrum) + 9},${axisY + 13}"/>`;
  }
  if (xLabel) {
    markup += `<text class="lbl s dm" x="${left + (width - left - right) / 2}" y="${bottom + 8}">${xLabel}</text>`;
    bottom += 20;
  }
  return svgWrap(
    width,
    bottom,
    markup,
    label ||
      (values.length
        ? `Dot plot of ${values.length} values from ${fmt(Math.min(...values))} to ${fmt(Math.max(...values))}`
        : "Box plot"),
  );
}
/* a box plot of the five-number summary five, on an axis like dotPlot's (same options, no dots) */
const boxPlot = (five, opts = {}) =>
  dotPlot([], { ...opts, box: five, label: opts.label || `Box plot: ${five.map(fmt).join(", ")}` });

/* A histogram: counts[i] values from lo + i·width up to lo + (i + 1)·width (each interval includes its left end), as bars side
   by side, with the counts numbered up the side. xLabel: the variable and its unit; yLabel: what the counts count.
   hi: the index of a bar to draw blue. tap: each bar is a tap answer for engine.js (.cand, data-id = its index).
   label: what a screen reader says. */
function histogram(counts, { lo, width: binW, xLabel = "", yLabel = "frequency", hi = -1, tap = false, label } = {}) {
  /* the plot is plotW by plotH, its bottom left at (left, bottom); the count axis goes up in steps of 1, 2, or 5 */
  const plotW = 360,
    plotH = 190,
    left = 52,
    top = 14,
    bottom = top + plotH,
    tallest = Math.max(1, ...counts),
    countStep = tallest <= 8 ? 1 : tallest <= 16 ? 2 : 5,
    yMax = Math.ceil(tallest / countStep) * countStep,
    barW = plotW / counts.length,
    yOf = (n) => bottom - (plotH * n) / yMax;
  let markup = "";
  range(yMax / countStep + 1).forEach((i) => {
    const n = i * countStep;
    markup +=
      `<line class="hg-grid" x1="${left}" y1="${yOf(n)}" x2="${left + plotW}" y2="${yOf(n)}"/>` +
      `<text class="lbl dm en" x="${left - 8}" y="${yOf(n)}">${n}</text>`;
  });
  counts.forEach((n, i) => {
    const x = left + i * barW,
      bar = `<rect class="hg-bar${i === hi ? " cy" : ""}" x="${x}" y="${yOf(n)}" width="${barW}" height="${bottom - yOf(n)}"/>`;
    markup += tap
      ? `<g class="cand" data-id="${i}" tabindex="0" role="button" aria-label="Bar ${i + 1}"><rect class="hit" x="${x}" y="${top}" width="${barW}" height="${plotH}"/>${bar}</g>`
      : bar;
  });
  markup += `<line class="axis" x1="${left}" y1="${bottom}" x2="${left + plotW}" y2="${bottom}"/><line class="axis" x1="${left}" y1="${top}" x2="${left}" y2="${bottom}"/>`;
  /* the interval edges under the bars */
  range(counts.length + 1).forEach((i) => {
    markup += `<text class="lbl" x="${left + i * barW}" y="${bottom + 18}">${fmt(lo + i * binW)}</text>`;
  });
  markup +=
    `<text class="lbl s dm" x="${left + plotW / 2}" y="${bottom + 42}">${xLabel}</text>` +
    `<text class="lbl s dm" x="14" y="${top + plotH / 2}" transform="rotate(-90 14 ${top + plotH / 2})">${yLabel}</text>`;
  return svgWrap(
    left + plotW + 20,
    bottom + 52,
    markup,
    label ||
      `Histogram: ${counts.map((n, i) => `${n} from ${fmt(lo + i * binW)} to ${fmt(lo + (i + 1) * binW)}`).join(", ")}`,
  );
}
