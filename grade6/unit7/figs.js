/* The number formats and coordinate planes that Grade 6 Unit 7's game (Expedition Zero) and its Learn pages both use. Its
   number lines (signedLine, vLine) are in shared/signed.js, which uses fmt from here. Needs util.js (range), figures.js
   (svgWrap), and algebra.js (coordPlane, mathVar); pages load pictures.css for the label styles.

   fmt(n)                                   a number as written: a true minus sign (−), commas, up to 2 decimal places
   money(n)                                 dollars as written: −$40, $12.50
   pt(x, y), abs(v)                         a point as written, (−3, 5), and an absolute value, |−7|
   plane(points, {size, …})                 a coordinate plane from −size to size both ways (6 by default), square (svg)
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
