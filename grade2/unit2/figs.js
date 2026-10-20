/* Pictures that Grade 2 Unit 2's game and its Learn pages both use. Needs util.js, figures.js (svgWrap), pictures.js, and
   blocks.js (blocks, BLOCK), and pictures.css and blocks.css for the styles.

   tensOf(n)                         the tens in n
   bpic(items, label)                base-ten blocks for several numbers in a row, with signs like + between them (svg) */
/* the tens in n */
const tensOf = (n) => Math.floor(n / 10);
/* Base-ten blocks in a row. items: numbers, {n, cls, opt} or {t, u, cls, opt} (t tens and u ones; opt goes to blocks()),
   or strings like '+' drawn between them. */
function bpic(items, label) {
  let x = 6,
    markup = "";
  items.forEach((item) => {
    if (typeof item === "string") {
      markup += `<text class="lbl big" x="${x + 14}" y="${10 + BLOCK * 5}">${item}</text>`;
      x += 34;
      return;
    }
    const { n, t = tensOf(n), u = n % 10, cls = "a", opt = {} } = typeof item === "number" ? { n: item } : item,
      [blockMarkup, width] = blocks(x, 10, t, u, cls, opt);
    markup += blockMarkup;
    x += width + 14;
  });
  return svgWrap(Math.max(x, 120), BLOCK * 10 + 20, markup, label);
}
