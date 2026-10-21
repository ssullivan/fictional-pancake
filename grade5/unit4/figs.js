/* Pictures that Grade 5 Unit 4's game and its Learn pages both use: the standard algorithm with a two-digit factor. Styles
   are blocks.css's (the same look as mulFig). Needs util.js, figures.js (svgWrap), and blocks.js (commas).

   mul2Steps(a, b)                   the rows of a × b (b two digits): a × b's ones, a × b's tens (with its 0), and their sum
   mul2Fig(a, b, done)               a × b in columns, the first `done` rows written (svg) */

/* a × b's rows for the standard algorithm, b two digits: [a × the ones digit, a × the tens digit × 10, the product] */
const mul2Steps = (a, b) => [a * (b % 10), a * Math.floor(b / 10) * 10, a * b];
/* a × b (b two digits) in columns: a, × b, and a line; then the first `done` rows: a × b's ones digit, a × b's tens digit
   (ending in 0, since it's tens), and after a second line their sum. The next row to write is outlined. Same look as mulFig. */
function mul2Fig(a, b, done = 0, label) {
  const rows = mul2Steps(a, b),
    cols = Math.max(String(a * b).length, String(a).length, 2) + 1,
    colW = 30,
    left = 16,
    lineGap = 22,
    rowH = 40,
    /* rows down the page: a, × b, the two partial rows, and the sum */
    rowY = (k) => 30 + k * rowH + (k >= 4 ? 16 : 0),
    /* the center of column i (0 is the ones) */
    colX = (i) => left + (cols - 1 - i) * colW + colW / 2;
  /* a number's digits under the columns, ones on the right; shaded: gold, for an answer row */
  const digitsAt = (n, y, cls = "") =>
    [...String(n)]
      .reverse()
      .map((d, i) => `<text class="adg${cls}" x="${colX(i)}" y="${y}">${d}</text>`)
      .join("");
  let markup = "";
  if (done < 3) {
    const y = rowY(done + 2);
    markup += `<rect class="acur" x="${left - 4}" y="${y - rowH / 2 + 2}" width="${cols * colW + 8}" height="${rowH - 4}" rx="6"/>`;
  }
  markup +=
    digitsAt(a, rowY(0)) +
    digitsAt(b, rowY(1)) +
    `<text class="adg" x="${colX(cols - 1)}" y="${rowY(1)}">×</text>` +
    `<line class="aline" x1="${left}" y1="${rowY(1) + lineGap}" x2="${left + cols * colW}" y2="${rowY(1) + lineGap}"/>`;
  if (done >= 1) markup += digitsAt(rows[0], rowY(2), " ares");
  if (done >= 2)
    markup +=
      digitsAt(rows[1], rowY(3), " ares") +
      `<text class="adg" x="${colX(cols - 1)}" y="${rowY(3)}">+</text>` +
      `<line class="aline" x1="${left}" y1="${rowY(3) + lineGap}" x2="${left + cols * colW}" y2="${rowY(3) + lineGap}"/>`;
  if (done >= 3) markup += digitsAt(rows[2], rowY(4), " ares");
  return svgWrap(
    left * 2 + cols * colW,
    rowY(4) + 24,
    markup,
    label ||
      `${commas(a)} times ${b} in columns` +
        (done
          ? `: ${rows.slice(0, Math.min(done, 2)).map(commas).join(" and ")}${done >= 3 ? `, sum ${commas(a * b)}` : ""}`
          : ""),
  );
}
