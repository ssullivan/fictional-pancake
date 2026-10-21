/* Pictures that Grade 5 Unit 2's game and its Learn pages both use: sandwiches shared out, and tapes and strips for a
   fraction of a whole number. Styles are in figs.css. Needs util.js (range), figures.js (svgWrap), fractions.js (strips), and
   numlines.js (partWhole).

   ofTape(n, b, a, show)             a tape for n, split into b equal parts with the first a outlined once show is on (svg)
   poundsFig(n, b, a)                n wholes, one strip each, cut into b parts with the first a of each shaded (svg)
   sandwichFig(count, people, {cut, mine})   sandwiches in a row, each cut into one piece for each person (svg)
   Rectangles on a grid of unit squares (areaFig) are in shared/fractions.js, since Unit 3 draws them too. */

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
