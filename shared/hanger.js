/* Hanger diagrams: a beam on a hook with weights hanging from each end, for solving equations by keeping both sides equal.
   Grade 6 Unit 6 and Grade 7 Unit 6. Styles are in hanger.css (load it after pictures.css, whose label styles these use).
   Needs util.js, figures.js (svgWrap), and fracmath.js (fT, ftx, for weights that are fractions).

   hanger(left, right, {tip, letter, label})   a hanger diagram: a beam on a hook with weights hanging from each end (svg) */

/* Hanger diagram. left and right list what hangs on each side: 'x' is a circle for the unknown (written with `letter`), 1 is a
   square weighing 1, any other number is a block with its weight written on it, and [n, d] is a block with a fraction.
   tip: 0 balanced, 1 the right side lower (heavier), −1 the left side lower. label: what a screen reader says. */
function hanger(left, right, { tip = 0, letter = "x", label } = {}) {
  /* the beam turns tiltDeg about the hook at (hookX, hookY); its ends are armLen out; weights hang stringLen under each end */
  const width = 420,
    hookX = width / 2,
    hookY = 34,
    armLen = 130,
    tiltDeg = 7,
    stringLen = 26,
    rowMax = 170,
    gap = 6,
    angle = (tip * tiltDeg * Math.PI) / 180;
  /* how wide a weight is drawn: unknowns 36, unit squares 26, labeled blocks wide enough for their label */
  const sizeOf = (w) =>
    w === "x" ? 36 : w === 1 ? 26 : Array.isArray(w) ? 50 : Math.max(44, String(w).length * 11 + 16);
  /* one weight with its top left corner at (x, y); rowH is the height of its row */
  const weight = (w, x, y, rowH) => {
    const size = sizeOf(w),
      cy = y + rowH / 2;
    if (w === "x")
      return `<circle class="hg-x" cx="${x + size / 2}" cy="${cy}" r="${size / 2}"/><text class="lbl hg-let" x="${x + size / 2}" y="${cy}">${letter}</text>`;
    if (w === 1) return `<rect class="hg-one" x="${x}" y="${cy - size / 2}" width="${size}" height="${size}" rx="3"/>`;
    return (
      `<rect class="hg-w" x="${x}" y="${y}" width="${size}" height="${rowH}" rx="5"/>` +
      (Array.isArray(w) ? fT(x + size / 2, cy, w) : `<text class="lbl" x="${x + size / 2}" y="${cy}">${w}</text>`)
    );
  };
  /* a side's weights in rows no wider than rowMax, each row centered under the end of the beam at (endX, endY) */
  const side = (list, endX, endY) => {
    const rows = [[]];
    let rowW = 0;
    list.forEach((w) => {
      const size = sizeOf(w);
      if (rows[rows.length - 1].length && rowW + gap + size > rowMax) {
        rows.push([]);
        rowW = 0;
      }
      rowW += (rows[rows.length - 1].length ? gap : 0) + size;
      rows[rows.length - 1].push(w);
    });
    const rowH = list.some((w) => w !== 1 && w !== "x") ? 40 : 36;
    let y = endY + stringLen,
      markup = `<line class="hg-str" x1="${endX}" y1="${endY}" x2="${endX}" y2="${y}"/>`;
    rows.forEach((row) => {
      const total = row.reduce((s, w) => s + sizeOf(w), 0) + gap * (row.length - 1);
      let x = endX - total / 2;
      row.forEach((w) => {
        markup += weight(w, x, y, rowH);
        x += sizeOf(w) + gap;
      });
      y += rowH + gap;
    });
    return { markup, bottom: y };
  };
  const dx = armLen * Math.cos(angle),
    dy = armLen * Math.sin(angle),
    leftEnd = [hookX - dx, hookY - dy],
    rightEnd = [hookX + dx, hookY + dy],
    leftSide = side(left, ...leftEnd),
    rightSide = side(right, ...rightEnd);
  const markup =
    `<path class="hg-hook" d="M${hookX},4 V${hookY}"/><circle class="hg-pin" cx="${hookX}" cy="${hookY}" r="5"/>` +
    `<line class="hg-beam" x1="${leftEnd[0]}" y1="${leftEnd[1]}" x2="${rightEnd[0]}" y2="${rightEnd[1]}"/>` +
    leftSide.markup +
    rightSide.markup;
  /* what each side holds, said in words */
  const say = (list) => {
    const xs = list.filter((w) => w === "x").length,
      ones = list.filter((w) => w === 1).length,
      labeled = list.filter((w) => w !== "x" && w !== 1).map((w) => (Array.isArray(w) ? ftx(w) : String(w)));
    return (
      [
        xs ? `${xs} ${letter}` : "",
        ones ? `${ones} unit square${ones === 1 ? "" : "s"}` : "",
        labeled.length ? `block${labeled.length === 1 ? "" : "s"} of ${labeled.join(" and ")}` : "",
      ]
        .filter(Boolean)
        .join(", ") || "nothing"
    );
  };
  const state = tip ? `tipped, the ${tip > 0 ? "right" : "left"} side lower` : "balanced";
  return svgWrap(
    width,
    Math.max(leftSide.bottom, rightSide.bottom) + 6,
    markup,
    label || `Hanger diagram, ${state}: left side ${say(left)}; right side ${say(right)}`,
  );
}
