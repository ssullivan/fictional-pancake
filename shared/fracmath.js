/* Exact fractions for Grade 6 pages: the math, fractions as labels in pictures, and rectangles and boxes with fractional sides.
   Needs util.js (gcd, range), figures.js (svgWrap), and pictures.js (fr, frT, mixed). Styles are in fracmath.css.

   A fraction is a pair [n, d] in lowest terms, with d > 0.
   frac(n, d)                        [n, d] in lowest terms; frac(3) is [3, 1]
   fAdd, fSub, fMul, fDiv (a, b)     a + b, a − b, a × b, a ÷ b, in lowest terms
   fVal(a), fInv(a), isWhole(a)      its value as a number, its reciprocal, and whether it's a whole number
   fx(a), ftx(a)                     written as a whole number, a fraction, or a mixed number: html (stacked), and plain text "4 2/3"
   fim(a)                            written as a fraction even when it's more than 1 (html): 14/3
   fT(x, y, a, {cls, unit})          a fraction or mixed number in a picture, centered on x, y (markup)
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
