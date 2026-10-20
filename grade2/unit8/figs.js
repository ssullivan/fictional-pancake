/* Pictures that Grade 2 Unit 8's game and its Learn pages both use. Needs util.js, figures.js (svgWrap), multiply.js (ctr,
   ARRAY); styles are in figs.css, with pictures.css, multiply.css, and shapes.css (pieces).

   pl(n, word), addends(n, a)        "3 pairs", and "4 + 4 + 4"
   ring(x, y, r), pairsFig(n, {mark, label})   a dashed ring around a counter (markup), and n counters in pairs (svg)
   pileAt(x, y, n, cls), pile(n, label), plateFig(n, given, names)   counters in rows of 10 (markup, and svg), and n counters
                                     being shared fairly by the 2 friends named (svg)
   spots(points, label)              counters at [column, row] spots, for pictures that aren't arrays (svg)
   tileFig(rows, cols, {gap, label})   square tiles in rows, apart or pushed into a rectangle (svg)
   fx(v), pieces(w, h, rects, {U, on, num, tap, label}), cutGrid(w, h, rows, cols)   a rectangle cut into pieces (svg), and
                                     the pieces of a rectangle cut into rows and columns */
/* n and the word for it: "1 pair", "3 pairs" */
const pl = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
/* "4 + 4 + 4": n equal addends of a */
const addends = (n, a) => Array(n).fill(a).join(" + ");
/* a dashed ring around a counter (ctr, in shared/multiply.js) with no partner */
const ring = (x, y, r = 14) => `<circle class="extra" cx="${x}" cy="${y}" r="${r + 6}"/>`;
/* n counters in pairs, one above the other, each pair outlined. mark: ring the one with no partner (odd n). */
function pairsFig(n, { mark = true, label } = {}) {
  /* pairX(i): where pair i is, with a little more room after every 5 pairs */
  const pairs = Math.floor(n / 2),
    odd = n % 2,
    pairX = (i) => 32 + i * 44 + Math.floor(i / 5) * 12;
  let markup = range(pairs)
    .map(
      (i) =>
        `<rect class="pairbox" x="${pairX(i) - 20}" y="4" width="40" height="84" rx="20"/>` +
        ctr(pairX(i), 26) +
        ctr(pairX(i), 66),
    )
    .join("");
  if (odd) markup += ctr(pairX(pairs), 26, mark ? "b" : "a") + (mark ? ring(pairX(pairs), 26) : "");
  return svgWrap(
    pairX(pairs + odd - 1) + 32,
    92,
    markup,
    label || `${n} counters: ${pl(pairs, "pair")}` + (odd ? " and 1 with no partner" : ", none left over"),
  );
}
/* n counters from x, y in rows of 10, with a gap after every 5 */
const pileAt = (x, y, n, cls = "a") =>
  range(n)
    .map((i) => ctr(x + (i % 10) * 36 + (i % 10 >= 5 ? 10 : 0), y + Math.floor(i / 10) * 36, cls))
    .join("");
/* a pile of n counters on its own (svg) */
const pile = (n, label) =>
  svgWrap(
    Math.min(n, 10) * 36 + (n > 5 ? 10 : 0) + 12,
    Math.ceil(n / 10) * 36 + 12,
    pileAt(24, 24, n),
    label || `${n} counters`,
  );
/* n counters being shared by 2 friends (names: theirs), 1 to each at a time: `given` of them are on the plates, the rest wait on top.
   When 1 is left that can't be shared, it gets a ring. */
function plateFig(n, given, names) {
  /* platesY: the plates go under the pile */
  const left = n - given,
    each = given / 2,
    platesY = Math.ceil(n / 10) * 36 + 34,
    alone = left === 1 && given > 0;
  let markup =
    `<text class="lbl s dm st" x="10" y="12">To share</text>` +
    pileAt(24, 40, left, alone ? "b" : "a") +
    (alone ? ring(24, 40) : "");
  [0, 1].forEach((friend) => {
    const x = 10 + friend * 236;
    markup +=
      `<rect class="plate" x="${x}" y="${platesY}" width="214" height="96" rx="20"/><text class="lbl" x="${x + 107}" y="${platesY + 116}">${names[friend]}</text>` +
      range(each)
        .map((i) => ctr(x + 35 + (i % 5) * 36, platesY + 30 + Math.floor(i / 5) * 36))
        .join("");
  });
  return svgWrap(
    460,
    platesY + 130,
    markup,
    `${n} counters. ${names[0]} has ${each}, ${names[1]} has ${each}, and ${left} ${left === 1 ? "is" : "are"} left`,
  );
}
/* counters at [column, row] spots (fractions allowed), for pictures that aren't arrays; spaced like arrayFig's */
function spots(points, label) {
  const cols = Math.max(...points.map((point) => point[0])) + 1,
    rows = Math.max(...points.map((point) => point[1])) + 1;
  const gap = ARRAY.g,
    pad = ARRAY.pad;
  return svgWrap(
    2 * pad + cols * gap,
    2 * pad + rows * gap,
    points.map(([x, y]) => ctr(pad + gap / 2 + x * gap, pad + gap / 2 + y * gap, "a", 16)).join(""),
    label,
  );
}
/* rows of cols square tiles, gap pixels apart (0: pushed together into a rectangle). The picture keeps the same size either way. */
function tileFig(rows, cols, { gap = 0, label } = {}) {
  /* tiles are tileSize square; the picture is sized for the widest gap (MAX_GAP), and the tiles are centered in it */
  const tileSize = 40,
    MAX_GAP = 14,
    width = cols * tileSize + (cols - 1) * MAX_GAP,
    height = rows * tileSize + (rows - 1) * MAX_GAP,
    dx = (width - cols * tileSize - (cols - 1) * gap) / 2,
    dy = (height - rows * tileSize - (rows - 1) * gap) / 2;
  let markup = range(rows * cols)
    .map(
      (n) =>
        `<rect class="tile" x="${8 + dx + (n % cols) * (tileSize + gap)}" y="${8 + dy + Math.floor(n / cols) * (tileSize + gap)}" width="${tileSize}" height="${tileSize}"/>`,
    )
    .join("");
  if (!gap)
    markup += `<rect class="rim" x="${8 + dx}" y="${8 + dy}" width="${cols * tileSize}" height="${rows * tileSize}"/>`;
  return svgWrap(
    width + 16,
    height + 16,
    markup,
    label ||
      (gap
        ? `${rows * cols} square tiles in ${pl(rows, "row")} of ${cols}, with gaps`
        : `A rectangle made of ${pl(rows * cols, "square")}: ${pl(rows, "row")} of ${cols}`),
  );
}
/* v to 2 decimal places, so pieces cut in thirds write short numbers */
const fx = (v) => +v.toFixed(2);
/* A w × h rectangle cut into pieces: rects [[x, y, width, height]] in units of U pixels.
   on(i): color piece i in. num(i): a number to write in piece i. tap: pieces can be tapped (data-i). */
function pieces(w, h, rects, { U = 56, on = () => false, num = () => null, tap = false, label } = {}) {
  const markup = rects
    .map(([x, y, width, height], i) => {
      const left = fx(6 + x * U),
        top = fx(6 + y * U),
        n = num(i);
      return (
        `<g${tap ? ` data-i="${i}"` : ""}><rect class="pc${on(i) ? " on" : ""}" x="${left}" y="${top}" width="${fx(width * U)}" height="${fx(height * U)}"/>` +
        (n != null
          ? `<text class="lbl dk" x="${fx(left + (width * U) / 2)}" y="${fx(top + (height * U) / 2)}">${n}</text>`
          : "") +
        "</g>"
      );
    })
    .join("");
  return svgWrap(12 + w * U, 12 + h * U, markup, label);
}
/* the pieces of a w × h rectangle cut into `rows` rows and `cols` columns */
const cutGrid = (w, h, rows, cols) =>
  range(rows * cols).map((n) => [((n % cols) * w) / cols, (Math.floor(n / cols) * h) / rows, w / cols, h / rows]);
