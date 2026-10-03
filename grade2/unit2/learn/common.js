/* Learn Adding and Subtracting within 100 (Grade 2 Unit 2): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
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
