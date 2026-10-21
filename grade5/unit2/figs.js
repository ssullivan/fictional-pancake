/* Pictures that Grade 5 Unit 2's game and its Learn pages both use: sandwiches shared out, tapes and strips for a fraction of
   a whole number, and rectangles with fraction side lengths on a grid of unit squares. Styles are in figs.css. Needs util.js (range), figures.js (svgWrap), pictures.js (frT),
   fractions.js (strips), and numlines.js (partWhole).

   A fraction is a pair [n, d]; a whole number k is [k, 1].
   ofTape(n, b, a, show)             a tape for n, split into b equal parts with the first a outlined once show is on (svg)
   poundsFig(n, b, a)                n wholes, one strip each, cut into b parts with the first a of each shaded (svg)
   mixT(x, y, [n, d], cls)           n/d in a picture as a whole number, a fraction, or a mixed number, centered on x, y (markup)
   sandwichFig(count, people, {cut, mine})   sandwiches in a row, each cut into one piece for each person (svg)
   areaFig(w, h, {split, labels})            a rectangle w by h shaded on a grid of unit squares cut into parts (svg) */

/* n/d in a picture: the whole number, then the fraction stacked beside it; about 10 px a digit */
function mixT(x, y, [n, d], cls = "") {
  const whole = Math.floor(n / d),
    rest = n % d,
    wholeText = whole || !rest ? String(whole) : "",
    /* fracW: the stacked fraction's width; the whole thing is totalW wide, centered on x */
    fracW = rest ? 10 + 9 * Math.max(String(rest).length, String(d).length) : 0,
    totalW = wholeText.length * 10 + (wholeText && rest ? 4 : 0) + fracW,
    left = x - totalW / 2;
  return (
    (wholeText ? `<text class="lbl ${cls}" x="${left + wholeText.length * 5}" y="${y}">${wholeText}</text>` : "") +
    (rest ? frT(left + totalW - fracW / 2, y, rest, d, cls) : "")
  );
}

/* Sandwiches in rows of 4, each cut into `people` equal pieces when cut is on. mine: the first piece of each sandwich is gold,
   one person's share (the others stay bread colored). */
function sandwichFig(count, people, { cut = true, mine = true, label } = {}) {
  /* each sandwich is breadW by breadH, gap apart */
  const breadW = 96,
    breadH = 58,
    gap = 14,
    perRow = Math.min(count, 4),
    rows = Math.ceil(count / perRow);
  let markup = "";
  range(count).forEach((i) => {
    const x = 4 + (i % perRow) * (breadW + gap),
      y = 4 + Math.floor(i / perRow) * (breadH + gap),
      pieceW = breadW / people;
    markup += `<rect class="sw" x="${x}" y="${y}" width="${breadW}" height="${breadH}" rx="10"/>`;
    if (cut && mine) markup += `<rect class="sw mine" x="${x}" y="${y}" width="${pieceW}" height="${breadH}" rx="6"/>`;
    if (cut)
      for (let j = 1; j < people; j++)
        markup += `<line class="swcut" x1="${x + j * pieceW}" y1="${y + 3}" x2="${x + j * pieceW}" y2="${y + breadH - 3}"/>`;
  });
  return svgWrap(
    perRow * (breadW + gap) - gap + 8,
    rows * (breadH + gap) - gap + 8,
    markup,
    label || `${count} sandwiches${cut ? `, each cut into ${people} equal pieces` : ""}`,
  );
}

/* A rectangle w by h on a grid of unit squares: each square is cut into w's denominator columns and h's denominator rows, and
   the rectangle is shaded from the bottom left corner. split 'w': the whole-number part of the width gold and the rest cyan
   (split 'h' does the same up the height). labels: w under the rectangle and h to its left (each part under its own color
   when split). */
function areaFig([wn, wd], [hn, hd], { split = null, labels = true, label } = {}) {
  /* the grid is cols by rows unit squares, each `size` pixels; xOf and yOf turn lengths into screen points (y from the bottom) */
  const cols = Math.max(1, Math.ceil(wn / wd)),
    rows = Math.max(1, Math.ceil(hn / hd)),
    size = Math.min(110, 360 / cols, 230 / rows),
    left = labels ? 70 : 6,
    top = 8,
    bottom = labels ? 46 : 6,
    xOf = (v) => left + v * size,
    yOf = (v) => top + (rows - v) * size,
    w = wn / wd,
    h = hn / hd;
  /* shaded pieces: [x from, x to, y from, y to, class] */
  const wholeW = Math.floor(w),
    wholeH = Math.floor(h),
    pieces =
      split === "w" && wholeW && w > wholeW
        ? [
            [0, wholeW, 0, h, "on"],
            [wholeW, w, 0, h, "on b"],
          ]
        : split === "h" && wholeH && h > wholeH
          ? [
              [0, w, 0, wholeH, "on"],
              [0, w, wholeH, h, "on b"],
            ]
          : [[0, w, 0, h, "on"]];
  let markup = `<rect class="ag" x="${xOf(0)}" y="${yOf(rows)}" width="${cols * size}" height="${rows * size}"/>`;
  for (const [x1, x2, y1, y2, cls] of pieces)
    markup += `<rect class="ag ${cls}" x="${xOf(x1)}" y="${yOf(y2)}" width="${(x2 - x1) * size}" height="${(y2 - y1) * size}"/>`;
  /* thin lines for the parts, bold ones around each unit square */
  for (let i = 1; i < cols * wd; i++)
    if (i % wd)
      markup += `<line class="agl" x1="${xOf(i / wd)}" y1="${yOf(0)}" x2="${xOf(i / wd)}" y2="${yOf(rows)}"/>`;
  for (let j = 1; j < rows * hd; j++)
    if (j % hd)
      markup += `<line class="agl" x1="${xOf(0)}" y1="${yOf(j / hd)}" x2="${xOf(cols)}" y2="${yOf(j / hd)}"/>`;
  for (let i = 0; i <= cols; i++)
    markup += `<line class="agu" x1="${xOf(i)}" y1="${yOf(0)}" x2="${xOf(i)}" y2="${yOf(rows)}"/>`;
  for (let j = 0; j <= rows; j++)
    markup += `<line class="agu" x1="${xOf(0)}" y1="${yOf(j)}" x2="${xOf(cols)}" y2="${yOf(j)}"/>`;
  markup += `<rect class="agr" x="${xOf(0)}" y="${yOf(h)}" width="${w * size}" height="${h * size}"/>`;
  if (labels) {
    /* the width under the rectangle (each part under its own color when the width is split), the height to its left */
    const widths =
      pieces.length === 2 && split === "w"
        ? [
            [0, wholeW, [wholeW, 1]],
            [wholeW, w, [wn - wholeW * wd, wd]],
          ]
        : [[0, w, [wn, wd]]];
    for (const [from, to, length] of widths) markup += mixT((xOf(from) + xOf(to)) / 2, yOf(0) + 24, length);
    const heights =
      pieces.length === 2 && split === "h"
        ? [
            [0, wholeH, [wholeH, 1]],
            [wholeH, h, [hn - wholeH * hd, hd]],
          ]
        : [[0, h, [hn, hd]]];
    for (const [from, to, length] of heights) markup += mixT(left - 30, (yOf(from) + yOf(to)) / 2, length);
  }
  return svgWrap(
    Math.ceil(left + cols * size + (labels ? 40 : 6)),
    Math.ceil(top + rows * size + bottom),
    markup,
    label || `A rectangle ${wn}/${wd} by ${hn}/${hd} on a grid of unit squares`,
  );
}

/* a tape of n split into b equal parts, the first a of them outlined; before a hint, the tape is in one piece */
const ofTape = (n, b, a, show) =>
  show
    ? partWhole(
        range(b).map((i) => ({ n: 1, show: n / b, hi: i < a })),
        n,
        `${n} split into ${b} equal parts of ${n / b}`,
      )
    : partWhole([{ n: 1, show: "" }], n, `A tape for ${n}`);
/* n wholes (pounds of fruit), one strip each, cut into b parts with the first a of each shaded: a/b of every pound */
const poundsFig = (n, b, a) =>
  strips(
    range(n).map(() => ({ d: b, k: a, parts: b > 1 })),
    { wholes: 1, W: 360, label: `${n} pounds, each cut into ${b} parts with ${a} shaded` },
  );
