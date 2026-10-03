/* Fractions and the pictures that Grade 6 Unit 4's game (Fraction Workshop) and its Learn pages both use. Styles are in figs.css.
   Needs util.js, figures.js (svgWrap), and pictures.js (fr, frT, mixed).

   A fraction is a pair [n, d] in lowest terms, with d > 0.
   frac(n, d)                        [n, d] in lowest terms; frac(3) is [3, 1]
   fAdd, fSub, fMul, fDiv (a, b)     a + b, a − b, a × b, a ÷ b, in lowest terms
   fVal(a), fInv(a), isWhole(a)      its value as a number, its reciprocal, and whether it's a whole number
   fx(a), ftx(a)                     written as a whole number, a fraction, or a mixed number: html (stacked), and plain text "4 2/3"
   fim(a)                            written as a fraction even when it's more than 1 (html): 14/3
   cash(n)                           dollars: $6, $4.50
   unitOf(a, [one, many])            the unit for a: 'cup' for 1 or less, 'cups' for more
   fT(x, y, a, {cls, unit})          the same in a picture, centered on x, y (markup)
   groupTape(total, group, {…})      how many groups of `group` are in `total`: one tape, the groups bracketed under it (svg)
   oneGroup(d, k, {…})               one group cut into d equal parts, k of them shaded, with labels above and below (svg)
   rectGrid(w, h, p, {…})            a rectangle w by h tiled in squares 1/p on a side (svg)
   cubeBox(l, w, h, p, {…})          a box l by w by h filled with cubes 1/p on an edge, drawn at an angle (svg) */
/* the sign goes on the numerator; dividing by the greatest common factor puts it in lowest terms */
const frac = (n, d = 1) => {
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(Math.abs(n), d) || 1;
  return [n / g, d / g];
};
/* a/b + c/d over the common denominator b × d (and likewise for −); × multiplies across; ÷ multiplies by the reciprocal */
const fAdd = ([a, b], [c, d]) => frac(a * d + c * b, b * d);
const fSub = ([a, b], [c, d]) => frac(a * d - c * b, b * d);
const fMul = ([a, b], [c, d]) => frac(a * c, b * d);
const fDiv = ([a, b], [c, d]) => frac(a * d, b * c);
const fVal = ([n, d]) => n / d;
const fInv = ([n, d]) => frac(d, n);
const isWhole = (f) => f[1] === 1;
const fx = ([n, d]) => mixed(n, d);
const ftx = ([n, d]) => {
  const whole = Math.floor(n / d),
    rest = n % d;
  return !rest ? `${whole}` : whole ? `${whole} ${rest}/${d}` : `${rest}/${d}`;
};
const fim = ([n, d]) => (d === 1 ? `${n}` : fr(n, d));
const cash = (n) => "$" + (Number.isInteger(n) ? n : n.toFixed(2));
const unitOf = (f, unit) => (fVal(f) <= 1 ? unit[0] : unit[1]);

/* a mixed number in a picture: the whole number, then the fraction stacked, then the unit; about 10 px a character */
function fT(x, y, [n, d], { cls = "", unit = "" } = {}) {
  /* wholeText: the whole number as written ('' when there's only a fraction); fracW and unitW: the widths of the stacked
     fraction and the unit; the whole thing is totalW wide, centered on x, and left moves across it */
  const whole = Math.floor(n / d),
    rest = n % d,
    wholeText = whole || !rest ? String(whole) : "",
    fracW = rest ? 10 + 9 * Math.max(String(rest).length, String(d).length) : 0,
    unitW = unit ? 8 + unit.length * 9 : 0,
    totalW = wholeText.length * 10 + (wholeText && rest ? 4 : 0) + fracW + unitW;
  let left = x - totalW / 2,
    markup = "";
  if (wholeText) {
    markup += `<text class="lbl ${cls}" x="${left + wholeText.length * 5}" y="${y}">${wholeText}</text>`;
    left += wholeText.length * 10 + (rest ? 4 : 0);
  }
  if (rest) {
    markup += frT(left + fracW / 2, y, rest, d, cls);
    left += fracW;
  }
  if (unit) markup += `<text class="lbl s st ${cls}" x="${left + 6}" y="${y}">${unit}</text>`;
  return markup;
}

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

/* A rectangle w by h (fractions) tiled in squares 1/p on a side, with bold lines at every whole unit and its sides labeled.
   shade: how many columns of small squares to shade gold, left to right (default all). unit: for the side labels. */
function rectGrid(w, h, p, { shade = Infinity, unit = "in", label } = {}) {
  /* cols by rows small squares, each `size` pixels, fitting 440 by 260; xOf and yOf give their edges */
  const cols = (w[0] * p) / w[1],
    rows = (h[0] * p) / h[1],
    size = Math.min(30, 440 / cols, 260 / rows),
    left = 70,
    top = 12,
    xOf = (i) => left + i * size,
    yOf = (j) => top + j * size;
  let markup = "";
  range(cols).forEach((i) =>
    range(rows).forEach((j) => {
      markup += `<rect class="rg${i < shade ? " on" : ""}" x="${xOf(i)}" y="${yOf(j)}" width="${size}" height="${size}"/>`;
    }),
  );
  /* bold lines at every whole unit, counted from the bottom left */
  range(Math.floor(cols / p) + 1).forEach((i) => {
    markup += `<line class="rg-whole" x1="${xOf(i * p)}" y1="${yOf(0)}" x2="${xOf(i * p)}" y2="${yOf(rows)}"/>`;
  });
  range(Math.floor(rows / p) + 1).forEach((j) => {
    markup += `<line class="rg-whole" x1="${xOf(0)}" y1="${yOf(rows - j * p)}" x2="${xOf(cols)}" y2="${yOf(rows - j * p)}"/>`;
  });
  markup += `<rect class="rg-out" x="${xOf(0)}" y="${yOf(0)}" width="${cols * size}" height="${rows * size}"/>`;
  markup += fT(xOf(cols / 2), yOf(rows) + 24, w, { unit }) + fT(left - 34, yOf(rows / 2), h, { unit });
  return svgWrap(
    xOf(cols) + 16,
    yOf(rows) + 44,
    markup,
    label || `A rectangle ${ftx(w)} by ${ftx(h)} ${unit}, tiled in squares 1/${p} ${unit} on a side`,
  );
}

/* A box l wide, w deep, and h tall (fractions) filled with cubes 1/p on an edge: the front, top, and right faces drawn at an
   angle with a line between every cube, bold lines at every whole unit, and the edges labeled. */
function cubeBox(l, w, h, p, { unit = "in", label } = {}) {
  /* the box is cubesL by cubesW by cubesH small cubes of `size` pixels; depth goes up and right by (depthX, depthY) per cube.
     at(a, b, k): the screen point a cubes across, b up, and k deep */
  const cubesL = (l[0] * p) / l[1],
    cubesW = (w[0] * p) / w[1],
    cubesH = (h[0] * p) / h[1],
    size = Math.min(34, 300 / (cubesL + cubesW * 0.6), 200 / (cubesH + cubesW * 0.45)),
    depthX = size * 0.6,
    depthY = size * 0.45,
    left = 56,
    top = 14 + cubesW * depthY,
    at = (a, b, k) => [left + a * size + k * depthX, top + cubesH * size - b * size - k * depthY];
  const pt = ([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`,
    face = (cls, points) => `<polygon class="${cls}" points="${points.map(pt).join(" ")}"/>`,
    line = (a, b, cls) =>
      `<line class="${cls}" x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"/>`;
  let markup =
    face("cb f", [at(0, 0, 0), at(cubesL, 0, 0), at(cubesL, cubesH, 0), at(0, cubesH, 0)]) +
    face("cb t", [at(0, cubesH, 0), at(cubesL, cubesH, 0), at(cubesL, cubesH, cubesW), at(0, cubesH, cubesW)]) +
    face("cb r", [at(cubesL, 0, 0), at(cubesL, 0, cubesW), at(cubesL, cubesH, cubesW), at(cubesL, cubesH, 0)]);
  /* a line between every cube, bold at every whole unit */
  const cls = (i) => (i % p ? "cb-l" : "cb-w");
  range(cubesL + 1).forEach((i) => {
    markup += line(at(i, 0, 0), at(i, cubesH, 0), cls(i)) + line(at(i, cubesH, 0), at(i, cubesH, cubesW), cls(i));
  });
  range(cubesH + 1).forEach((j) => {
    markup += line(at(0, j, 0), at(cubesL, j, 0), cls(j)) + line(at(cubesL, j, 0), at(cubesL, j, cubesW), cls(j));
  });
  range(cubesW + 1).forEach((k) => {
    markup +=
      line(at(0, cubesH, k), at(cubesL, cubesH, k), cls(k)) + line(at(cubesL, 0, k), at(cubesL, cubesH, k), cls(k));
  });
  /* the edge labels: length under the front, height left of it, and depth beside the right face */
  const [lengthX, lengthY] = at(cubesL / 2, 0, 0),
    [heightX, heightY] = at(0, cubesH / 2, 0),
    [depthLabelX, depthLabelY] = at(cubesL, 0, cubesW / 2);
  markup +=
    fT(lengthX, lengthY + 22, l, { unit }) +
    fT(heightX - 30, heightY, h, { unit }) +
    fT(depthLabelX + 36, depthLabelY + 8, w, { unit });
  const [rightX] = at(cubesL, 0, cubesW);
  return svgWrap(
    rightX + 90,
    top + cubesH * size + 42,
    markup,
    label || `A box ${ftx(l)} by ${ftx(w)} by ${ftx(h)} ${unit} filled with cubes 1/${p} ${unit} on an edge`,
  );
}
