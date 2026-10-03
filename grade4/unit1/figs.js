/* Pictures that Grade 4 Unit 1's game and its Learn pages both use. Styles are in figs.css. Needs util.js and figures.js (svgWrap).

   lockers(open, {hi, sel})          the Locker Problem's 20 lockers, open or closed (svg) */
/* The 20 lockers in two rows of 10. open[v]: locker v is open; hi: lockers to highlight; sel: the locker picked (its number in color). */
function lockers(open, { hi = [], sel = null } = {}) {
  /* each locker is lockerW by lockerH, gap apart; its number sits under it */
  const lockerW = 28,
    gap = 2,
    lockerH = 64;
  let markup = "";
  range(20).forEach((i) => {
    const v = i + 1,
      x = 2 + (i % 10) * (lockerW + gap),
      y = 4 + Math.floor(i / 10) * (lockerH + 34);
    /* an open locker shows its door swung in; a closed one shows its vents */
    markup +=
      `<g data-v="${v}"><rect class="lk${open[v] ? " open" : ""}${hi.includes(v) ? " hi" : ""}${v === sel ? " sel" : ""}" x="${x}" y="${y}" width="${lockerW}" height="${lockerH}" rx="2"/>` +
      (open[v]
        ? `<polygon class="door" points="${x},${y} ${x + 9},${y + 8} ${x + 9},${y + lockerH - 8} ${x},${y + lockerH}"/>`
        : `<path class="vent" d="M${x + 7},${y + 10}h14M${x + 7},${y + 15}h14M${x + 7},${y + 20}h14"/>`) +
      `<text class="lbl s${v === sel ? " cy" : ""}" x="${x + lockerW / 2}" y="${y + lockerH + 16}">${v}</text></g>`;
  });
  return svgWrap(
    10 * (lockerW + gap) + 2,
    2 * (lockerH + 34),
    markup,
    "20 lockers. Open: " +
      (range(20)
        .filter((i) => open[i + 1])
        .map((i) => i + 1)
        .join(", ") || "none"),
  );
}
