/* The pictures and number formats that Grade 7 Unit 6's game (Code Breakers) and its Learn pages both use. Styles are in
   figs.css. Needs util.js (range), figures.js (svgWrap, qbox), and algebra.js (mathVar). Number lines are signedLine from
   shared/signed.js and hangers hanger from shared/hanger.js, which use fmt from here.

   fmt(n)                                   a number as written: a true minus sign (−), commas, up to 2 decimal places
   par(n)                                   a number as it goes after an operation sign: negatives in parentheses, (−3)
   lin(a, b, letter)                        a·x + b as written, with signs tidied: 3x + 7, −x − 4, 2x (html)
   tapeFor(p, q, r, {groups, show, ask})    a tape diagram for px + q = r, or for p(x + q) = r with groups (svg) */

/* a number as written: a true minus sign (−), commas, and up to 2 decimal places (signed.js labels use it too) */
const fmt = (n) => {
  const rounded = Math.round(n * 100) / 100;
  return (rounded < 0 ? "−" : "") + Math.abs(rounded).toLocaleString("en-US", { maximumFractionDigits: 2 });
};
/* a number after an operation sign: 5 − (−3), not 5 − −3 */
const par = (n) => (n < 0 ? `(${fmt(n)})` : fmt(n));
/* a·x + b as written: the letter in italics, 1x as x, −1x as −x, a 0 term left out, and "+ −4" as "− 4" */
function lin(a, b, letter = "x") {
  const x = mathVar(letter),
    xTerm = a === 0 ? "" : a === 1 ? x : a === -1 ? `−${x}` : `${fmt(a)}${x}`;
  if (!xTerm) return fmt(b);
  if (b === 0) return xTerm;
  return `${xTerm} ${b < 0 ? "−" : "+"} ${fmt(Math.abs(b))}`;
}

/* A tape diagram. For px + q = r: p boxes for x and one box for q, with a brace for the total r. With groups, for
   p(x + q) = r: p groups, each an x box and a q box. show: write the value of x in its boxes. ask: put a "?" box where the
   total goes instead of r. letter: the unknown's name. */
function tapeFor(p, q, r, { groups = false, show = false, ask = false, value = null, letter = "x" } = {}) {
  const boxW = groups ? Math.min(46, 400 / (2 * p)) : Math.min(56, 360 / (p + 1.4)),
    qW = groups ? boxW : boxW * 1.4,
    left = 14,
    top = 14,
    tapeH = 40,
    xText = show && value !== null ? fmt(value) : letter;
  let x = left,
    markup = "";
  /* one box at x, its width, its class, and its text */
  const box = (w, cls, text) => {
    const out = `<rect class="tp ${cls}" x="${x}" y="${top}" width="${w}" height="${tapeH}"/><text class="lbl${cls === "tx" ? " tp-x" : ""}" x="${x + w / 2}" y="${top + tapeH / 2}">${text}</text>`;
    x += w;
    return out;
  };
  if (groups)
    range(p).forEach((i) => {
      markup += box(boxW, "tx", xText) + box(qW, "tq", fmt(q));
      /* a thick line where one group ends and the next begins */
      if (i < p - 1) markup += `<line class="tp-gap" x1="${x}" y1="${top - 4}" x2="${x}" y2="${top + tapeH + 4}"/>`;
    });
  else {
    range(p).forEach(() => (markup += box(boxW, "tx", xText)));
    markup += box(qW, "tq", fmt(q));
  }
  /* the brace under the tape, from end to end, and the total below its middle */
  const right = x,
    braceY = top + tapeH + 8,
    mid = (left + right) / 2;
  markup += `<path class="brace" d="M${left},${braceY} q0,10 10,10 H${mid - 8} q8,0 8,8 q0,-8 8,-8 H${right - 10} q10,0 10,-10"/>`;
  markup += ask ? qbox(mid, braceY + 40) : `<text class="lbl" x="${mid}" y="${braceY + 38}">${fmt(r)}</text>`;
  return svgWrap(
    right + left,
    braceY + 60,
    markup,
    groups
      ? `A tape diagram of ${p} groups of ${letter} and ${q}, ${r} in all`
      : `A tape diagram of ${p} ${letter}s and ${q}, ${r} in all`,
  );
}
