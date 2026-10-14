/* Learn Two-dimensional Shapes and Perimeter (Grade 3 Unit 7): code used by more than one chapter. Loaded by the chapter pages
   in learn/, after ../figs.js (POLYS, sideLengths, rightCorners, quadKind, toBox, polyFig, polyRow, gridFig, gridRow,
   perimeterOf) and chapters.js. Shapes come from shared/shapes.js (shapeAt, picRow) and L-shaped figures from lFig there too. */
/* n and the word for it: "1 side", "3 sides" (plural: the word for more than one) */
const pl = (n, word, plural = word + "s") => `${n} ${n === 1 ? word : plural}`;
/* a list in words: "A", "A and B", "A, B, and C" */
const listWords = (items) =>
  items.length < 3 ? items.join(" and ") : `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
/* the letter a picture gets in a row of them */
const letter = (i) => "ABCDEF"[i];
/* a polygon's side lengths to write on it, each one times `times`: ["10", "8", …] */
const lensOf = (pts, times = 1) => sideLengths(pts).map((len) => `${len * times}`);
/* A right-angle mark at corner i of a polygon whose corners are in pixels: a small square in the corner, `size` along each
   side from it, then across (markup) */
function rightMark(corners, i, size = 12) {
  const n = corners.length,
    [x, y] = corners[i],
    round1 = (v) => +v.toFixed(1),
    /* the unit vector from this corner toward corner j */
    along = (j) => {
      const [qx, qy] = corners[j],
        length = Math.hypot(qx - x, qy - y);
      return [(qx - x) / length, (qy - y) / length];
    },
    [ax, ay] = along((i + 1) % n),
    [bx, by] = along((i + n - 1) % n);
  return `<path class="sqc" d="M${round1(x + ax * size)},${round1(y + ay * size)}L${round1(x + (ax + bx) * size)},${round1(y + (ay + by) * size)}L${round1(x + bx * size)},${round1(y + by * size)}"/>`;
}
/* A polygon drawn to scale, s pixels across, with more on it than polyFig gives: lens a label for each side; lit how many
   sides, from the first, are lit up; marks the corners (indexes) to mark as right angles; ring a corner to circle. */
function polySvg(pts, { lens = null, lit = 0, marks = [], ring = null, s = 180, label } = {}) {
  const margin = lens ? 48 : 30,
    box = toBox(pts),
    /* each corner in pixels, as shapeAt places it */
    corners = box.map(([x, y]) => [margin + (x * s) / 100, margin + (y * s) / 100]),
    n = pts.length,
    round1 = (v) => +v.toFixed(1);
  let markup = shapeAt(box, margin, margin, s, { lens });
  range(lit).forEach((i) => {
    const [x1, y1] = corners[i],
      [x2, y2] = corners[(i + 1) % n];
    markup += `<line class="gwalk" x1="${round1(x1)}" y1="${round1(y1)}" x2="${round1(x2)}" y2="${round1(y2)}"/>`;
  });
  marks.forEach((i) => (markup += rightMark(corners, i)));
  if (ring !== null)
    markup += `<circle class="cring" cx="${round1(corners[ring][0])}" cy="${round1(corners[ring][1])}" r="16"/>`;
  return svgWrap(s + 2 * margin, s + 2 * margin, markup, label || `A shape with ${pl(n, "side")}`);
}
/* a rectangle `rows` tall and `cols` long, as unit squares */
const rectCells = (rows, cols) => range(rows).flatMap((r) => range(cols).map((c) => [c, r]));
