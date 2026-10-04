/* The pictures that Grade 6 Unit 4's game (Fraction Workshop) and its Learn pages both use. Styles are in figs.css.
   Needs util.js, figures.js (svgWrap), pictures.js (fr, frT), and fracmath.js (the fraction math and fT).

   cash(n)                           dollars: $6, $4.50
   unitOf(a, [one, many])            the unit for a: 'cup' for 1 or less, 'cups' for more
   groupTape(total, group, {…})      how many groups of `group` are in `total`: one tape, the groups bracketed under it (svg)
   oneGroup(d, k, {…})               one group cut into d equal parts, k of them shaded, with labels above and below (svg) */
const cash = (n) => "$" + (Number.isInteger(n) ? n : n.toFixed(2));
const unitOf = (f, unit) => (fVal(f) <= 1 ? unit[0] : unit[1]);

/* How many groups of `group` are in `total` (both fractions): one tape of the wholes, cut into equal parts (the smallest
   denominator that fits both), with the whole numbers above (only every 2nd, 5th, or 10th when they're close). The groups are
   bracketed and numbered under it, every other one blue; a part of a group left at the end is green, with the rest of that group
   dashed past the end and "2/3 of a group" under it.
   upto: how many groups to show (0 for just the tape); parts: false leaves out the lines between parts (just the wholes);
   tell: false leaves out the "2/3 of a group" label (a game hint shows the groups but not the answer); W: width. The tape keeps its size as groups appear. */
function groupTape(total, group, { upto = Infinity, parts = true, tell = true, W = 600, label } = {}) {
  /* in parts of 1/d: the total is totalParts, a group is groupParts; full groups fit, with `left` parts over (a fraction
     `leftover` of a group). shown: the groups drawn; span: the tape's length in parts, room for the last group; xOf(i): where part i starts */
  const d = lcm(total[1], group[1]),
    totalParts = (total[0] * d) / total[1],
    groupParts = (group[0] * d) / group[1],
    full = Math.floor(totalParts / groupParts),
    left = totalParts - full * groupParts,
    shown = Math.min(upto, full + (left ? 1 : 0)),
    span = left ? (full + 1) * groupParts : totalParts,
    margin = 14,
    partW = (W - 2 * margin) / span,
    xOf = (i) => margin + i * partW,
    tapeY = 40,
    tapeH = 42,
    leftover = frac(left, groupParts);
  let markup = "";
  /* each part takes its group's color: gold and blue by turns, green for the part-group at the end */
  range(totalParts).forEach((i) => {
    const groupIndex = Math.floor(i / groupParts);
    markup += `<rect class="gt${groupIndex < shown ? (groupIndex < full ? (groupIndex % 2 ? " b" : " a") : " p") : ""}" x="${xOf(i)}" y="${tapeY}" width="${partW}" height="${tapeH}"/>`;
  });
  if (left && shown > full)
    range(groupParts - left).forEach((i) => {
      markup += `<rect class="gt gh" x="${xOf(totalParts + i)}" y="${tapeY}" width="${partW}" height="${tapeH}"/>`;
    });
  if (partW >= 5 && parts)
    range(totalParts + 1).forEach((i) => {
      if (i % d) markup += `<line class="gt-part" x1="${xOf(i)}" y1="${tapeY}" x2="${xOf(i)}" y2="${tapeY + tapeH}"/>`;
    });
  /* the wholes, numbered every 1, 2, 5, or 10 so the numbers are at least 24 pixels apart */
  const every = [1, 2, 5, 10].find((k) => k * partW * d >= 24) || 20;
  range(Math.floor(totalParts / d) + 1).forEach((i) => {
    markup +=
      `<line class="gt-whole" x1="${xOf(i * d)}" y1="${tapeY - 6}" x2="${xOf(i * d)}" y2="${tapeY + tapeH + 6}"/>` +
      (i % every ? "" : `<text class="lbl s" x="${xOf(i * d)}" y="${tapeY - 15}">${i}</text>`);
  });
  if (totalParts % d)
    markup +=
      `<line class="gt-whole" x1="${xOf(totalParts)}" y1="${tapeY - 6}" x2="${xOf(totalParts)}" y2="${tapeY + tapeH + 6}"/>` +
      fT(xOf(totalParts), tapeY - 20, total, { cls: "cy" });
  /* the groups' brackets under the tape, numbered (all but the ends skipped when they're narrow) */
  const bracketY = tapeY + tapeH + 10;
  range(shown).forEach((j) => {
    const start = xOf(j * groupParts) + 2,
      end = xOf(Math.min((j + 1) * groupParts, totalParts)) - 2,
      mid = (start + end) / 2;
    markup += `<path class="gt-br${j < full ? "" : " p"}" d="M${start},${bracketY}v6H${end}v-6"/>`;
    if (j < full) {
      if (end - start >= 16 || j === 0 || j === full - 1)
        markup += `<text class="lbl s" x="${mid}" y="${bracketY + 20}">${j + 1}</text>`;
    } else if (tell)
      markup +=
        frT(mid, bracketY + 26, leftover[0], leftover[1], "gn") +
        `<text class="lbl s gn" x="${Math.min(Math.max(mid, 64), W - 64)}" y="${bracketY + 52}">of a group</text>`;
  });
  const fallback =
    label ||
    `Tape diagram: ${ftx(total)} cut into parts of 1/${d}, with ${shown} group${shown === 1 ? "" : "s"} of ${ftx(group)} marked`;
  return svgWrap(W, tapeY + tapeH + (left && shown > full ? 74 : shown ? 42 : 14), markup, fallback);
}

/* One group (a pitcher, a batch, a board) cut into d equal parts, the first k shaded. Labels are text, or a fraction with a
   unit: [[n, d], 'cups']. top: over the shaded parts; each: inside every part (or inside the shaded ones with eachShaded);
   whole: under the whole tape; q: 'top', 'each', or 'whole' puts the gold "?" there instead. */
function oneGroup(d, k, { top = null, each = null, eachShaded = false, whole = null, q = null, W = 520, label } = {}) {
  const margin = 14,
    partW = (W - 2 * margin) / d,
    xOf = (i) => margin + i * partW,
    tapeY = 52,
    tapeH = 46;
  /* a label at cx, cy: text, or [fraction, unit] */
  const say = (text, cx, cy, cls = "") =>
    Array.isArray(text)
      ? fT(cx, cy, text[0], { cls, unit: text[1] })
      : `<text class="lbl ${cls}" x="${cx}" y="${cy}">${text}</text>`;
  let markup = "";
  range(d).forEach((i) => {
    markup += `<rect class="gt${i < k ? " a" : ""}" x="${xOf(i)}" y="${tapeY}" width="${partW}" height="${tapeH}"/>`;
  });
  range(d - 1).forEach((i) => {
    markup += `<line class="gt-sep" x1="${xOf(i + 1)}" y1="${tapeY}" x2="${xOf(i + 1)}" y2="${tapeY + tapeH}"/>`;
  });
  markup += `<rect class="gt-out" x="${xOf(0)}" y="${tapeY}" width="${d * partW}" height="${tapeH}"/>`;
  if (each !== null || q === "each")
    range(eachShaded ? k : d).forEach((i) => {
      markup +=
        q === "each" && i === 0
          ? qbox(xOf(i) + partW / 2, tapeY + tapeH / 2)
          : say(each ?? "", xOf(i) + partW / 2, tapeY + tapeH / 2, q === "each" ? "dm" : "");
    });
  if (k && (top !== null || q === "top")) {
    markup += `<path class="gt-br" d="M${xOf(0) + 2},${tapeY - 8}v-6H${xOf(k) - 2}v6"/>`;
    markup += q === "top" ? qbox((xOf(0) + xOf(k)) / 2, tapeY - 30) : say(top, (xOf(0) + xOf(k)) / 2, tapeY - 30, "cy");
  }
  if (whole !== null || q === "whole") {
    markup += `<path class="gt-br" d="M${xOf(0) + 2},${tapeY + tapeH + 8}v6H${xOf(d) - 2}v-6"/>`;
    markup +=
      q === "whole"
        ? qbox((xOf(0) + xOf(d)) / 2, tapeY + tapeH + 36)
        : say(whole, (xOf(0) + xOf(d)) / 2, tapeY + tapeH + 36);
  }
  return svgWrap(
    W,
    tapeY + tapeH + 60,
    markup,
    label || `Tape diagram: one group cut into ${d} equal parts, ${k} of them shaded`,
  );
}
