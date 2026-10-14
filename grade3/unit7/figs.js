/* Pictures and shape facts that Grade 3 Unit 7's game and its Learn pages both use. Styles are in figs.css. Needs util.js,
   figures.js (svgWrap), and shapes.js (shapeAt, shapeFig, picRow).

   POLYS                             triangles, quadrilaterals, and other polygons with whole-number sides, as corners on a grid
   sideLengths(pts), rightCorners(pts), quadKind(pts), isConvex(pts)   a polygon's side lengths, the corners that are right
                                     angles, what kind of quadrilateral it is ('square', 'rhombus', 'rectangle', or 'other'),
                                     and whether no corner bends in
   extentOf(pts), toBox(pts, scale)  how far a polygon reaches, and its corners scaled into the 100 × 100 box shapeAt draws in
   polyFig(pts, {lens, sq, nums, s}, label)   one polygon, drawn to scale (svg); polyRow(items, {letters, tap, label}) polygons
                                     side by side at one scale, where an item is [pts, options] or the name of a shape in ODD (svg)
   ODD                               shapes that aren't polygons: 'open' (4 straight sides with a gap) and 'curved'
   boundary(cells), perimeterOf(cells)   the outline of a shape made of unit squares, as unit lengths in order around it
   gridFig(cells, {walk, count, size, label}), gridRow(shapes, {letters, tap, label})   shapes of unit squares on a grid, with
                                     the first `walk` unit lengths of the outline numbered, or the squares numbered (svg) */

/* ---------- polygons ---------- */
/* Each polygon's corners on a grid (y goes down), in order around it. Every side is a whole number of units long (sides that
   slant use 3-4-5, 5-12-13, and 6-8-10 triangles), so side lengths can be written on it and it's still drawn to scale. */
const SQRT3 = Math.sqrt(3);
const POLYS = {
  /* triangles */
  rightTri: [
    [0, 0],
    [0, 6],
    [8, 6],
  ],
  rightTri2: [
    [0, 0],
    [8, 0],
    [0, 6],
  ],
  isoTri: [
    [3, 0],
    [6, 4],
    [0, 4],
  ],
  isoTri2: [
    [0, 0],
    [12, 0],
    [6, 8],
  ],
  equiTri: [
    [3, 0],
    [6, 3 * SQRT3],
    [0, 3 * SQRT3],
  ],
  scaleneTri: [
    [9, 0],
    [14, 12],
    [0, 12],
  ],
  /* quadrilaterals: squares and rectangles (some turned), rhombuses, and quadrilaterals that are none of those */
  square: [
    [0, 0],
    [5, 0],
    [5, 5],
    [0, 5],
  ],
  tiltedSquare: [
    [3, 0],
    [7, 3],
    [4, 7],
    [0, 4],
  ],
  rectangle: [
    [0, 0],
    [8, 0],
    [8, 4],
    [0, 4],
  ],
  tallRectangle: [
    [0, 0],
    [3, 0],
    [3, 7],
    [0, 7],
  ],
  tiltedRectangle: [
    [0, 3],
    [4, 0],
    [10, 8],
    [6, 11],
  ],
  rhombus: [
    [3, 0],
    [6, 4],
    [3, 8],
    [0, 4],
  ],
  wideRhombus: [
    [4, 0],
    [8, 3],
    [4, 6],
    [0, 3],
  ],
  leanRhombus: [
    [3, 0],
    [8, 0],
    [5, 4],
    [0, 4],
  ],
  parallelogram: [
    [3, 0],
    [9, 0],
    [6, 4],
    [0, 4],
  ],
  trapezoid: [
    [3, 0],
    [7, 0],
    [10, 4],
    [0, 4],
  ],
  rightTrapezoid: [
    [0, 0],
    [5, 0],
    [8, 4],
    [0, 4],
  ],
  kite: [
    [12, 0],
    [24, 5],
    [12, 14],
    [0, 5],
  ],
  oddQuad: [
    [0, 0],
    [8, 0],
    [11, 4],
    [5, 12],
  ],
  /* a quadrilateral with a corner that bends in (its sides aren't whole numbers, so it never gets side lengths) */
  dart: [
    [0, 0],
    [4, 3],
    [8, 0],
    [4, 8],
  ],
  /* more sides */
  house: [
    [3, 0],
    [6, 4],
    [6, 9],
    [0, 9],
    [0, 4],
  ],
  pentagon: [
    [0, 0],
    [6, 0],
    [6, 4],
    [3, 8],
    [0, 4],
  ],
  lHexagon: [
    [0, 0],
    [4, 0],
    [4, 3],
    [7, 3],
    [7, 6],
    [0, 6],
  ],
};
/* each side's length, side i going from corner i to the next (rounded off, since an equilateral triangle's corners aren't whole) */
const sideLengths = (pts) =>
  pts.map(([x, y], i) => {
    const [nx, ny] = pts[(i + 1) % pts.length];
    return Math.round(Math.hypot(nx - x, ny - y) * 1000) / 1000;
  });
/* The shoelace sum: twice the polygon's area, signed by which way its corners go round (positive when they go clockwise on
   the page, where y goes down). A corner turns the same way as this sign when it points out, and the other way when it bends in. */
const shoelace = (pts) =>
  pts.reduce((sum, [x, y], i) => {
    const [nx, ny] = pts[(i + 1) % pts.length];
    return sum + x * ny - nx * y;
  }, 0);
/* which way the polygon turns at corner i: the cross product of the side coming in and the side going out */
const turnAt = (pts, i) => {
  const n = pts.length,
    [px, py] = pts[(i + n - 1) % n],
    [x, y] = pts[i],
    [nx, ny] = pts[(i + 1) % n];
  return (x - px) * (ny - y) - (y - py) * (nx - x);
};
/* does every corner point out (no corner bends in)? */
const isConvex = (pts) => pts.every((p, i) => turnAt(pts, i) * Math.sign(shoelace(pts)) > 0);
/* The corners (their indexes) that are right angles: the two sides meeting there are perpendicular (their dot product is 0)
   and the corner points out. A corner that bends in at a square corner is 3 right angles' worth, not a right angle. */
const rightCorners = (pts) =>
  range(pts.length).filter((i) => {
    const n = pts.length,
      [px, py] = pts[(i + n - 1) % n],
      [x, y] = pts[i],
      [nx, ny] = pts[(i + 1) % n],
      dot = (px - x) * (nx - x) + (py - y) * (ny - y);
    return Math.abs(dot) < 1e-9 && turnAt(pts, i) * Math.sign(shoelace(pts)) > 0;
  });
/* A quadrilateral's kind: a square has 4 sides the same length and 4 right angles; a rhombus has 4 sides the same length; a
   rectangle has 4 right angles; any other quadrilateral is 'other'. */
function quadKind(pts) {
  const lengths = sideLengths(pts),
    equalSides = lengths.every((len) => Math.abs(len - lengths[0]) < 1e-6),
    allRight = rightCorners(pts).length === 4;
  return equalSides && allRight ? "square" : equalSides ? "rhombus" : allRight ? "rectangle" : "other";
}
/* how far a polygon reaches across or down, whichever is more */
const extentOf = (pts) =>
  Math.max(
    Math.max(...pts.map(([x]) => x)) - Math.min(...pts.map(([x]) => x)),
    Math.max(...pts.map(([, y]) => y)) - Math.min(...pts.map(([, y]) => y)),
  );
/* the corners scaled into a 100 × 100 box and centered: `scale` box units to a grid unit, or as big as fits with 4 to spare
   on each side */
function toBox(pts, scale = 92 / extentOf(pts)) {
  const xs = pts.map(([x]) => x),
    ys = pts.map(([, y]) => y),
    width = Math.max(...xs) - Math.min(...xs),
    height = Math.max(...ys) - Math.min(...ys),
    left = 50 - (width * scale) / 2,
    top = 50 - (height * scale) / 2;
  return pts.map(([x, y]) => [left + (x - Math.min(...xs)) * scale, top + (y - Math.min(...ys)) * scale]);
}
/* One polygon drawn to scale, s pixels across (shapeFig's options: lens a label for each side, sq marks the right angles,
   nums numbers the sides). */
const polyFig = (pts, options = {}, label) =>
  shapeFig(toBox(pts), { s: 180, ...options }, label || `A shape with ${pts.length} sides`);
/* Shapes that aren't polygons, drawn in the 100 × 100 box from x, y, s pixels across (markup): 'open' has 4 straight sides
   that don't meet at one corner, and 'curved' has 3 straight sides and a curved one. */
const ODD = {
  open: (x, y, s) => {
    const at = (a, b) => `${x + (a * s) / 100},${y + (b * s) / 100}`;
    return `<path class="shp oddshp" d="M${at(30, 10)}L${at(92, 10)}L${at(92, 90)}L${at(8, 90)}L${at(8, 30)}"/>`;
  },
  curved: (x, y, s) => {
    const at = (a, b) => `${x + (a * s) / 100},${y + (b * s) / 100}`;
    return `<path class="shp" d="M${at(8, 20)}L${at(92, 20)}L${at(92, 80)}L${at(8, 80)}Q${at(-12, 50)} ${at(8, 20)}Z"/>`;
  },
};
/* Shapes side by side, each 200 pixels across (they wrap onto two rows on a phone), the polygons all drawn to the same scale
   so their sizes can be compared. items: [pts, shapeAt options] for a polygon, or a name from ODD. letters, tap, label: as
   picRow. */
function polyRow(items, { letters = false, tap = null, label = "Shape" } = {}) {
  const polygons = items.filter((item) => typeof item !== "string"),
    hasLens = polygons.some(([, options]) => options && options.lens),
    margin = hasLens ? 36 : 24,
    size = 200 - 2 * margin,
    scale = 92 / Math.max(...polygons.map(([pts]) => extentOf(pts)));
  return picRow(
    items.length,
    200,
    200,
    (i) =>
      typeof items[i] === "string"
        ? ODD[items[i]](margin, margin, size)
        : shapeAt(toBox(items[i][0], scale), margin, margin, size, items[i][1] || {}),
    { letters, tap, label },
  );
}

/* ---------- shapes made of unit squares, for perimeter ---------- */
/* The outline of a shape made of unit squares ([col, row] cells), as unit lengths [x1, y1, x2, y2] in order, going clockwise
   from the top left corner. Each unit length is the edge of a square in the shape that no other square in it shares, pointed
   so the shape is on its right; then each one's end is the next one's start. The number of them is the perimeter. */
function boundary(cells) {
  const has = (c, r) => cells.some(([col, row]) => col === c && row === r),
    edges = [];
  cells.forEach(([c, r]) => {
    if (!has(c, r - 1)) edges.push([c, r, c + 1, r]);
    if (!has(c + 1, r)) edges.push([c + 1, r, c + 1, r + 1]);
    if (!has(c, r + 1)) edges.push([c + 1, r + 1, c, r + 1]);
    if (!has(c - 1, r)) edges.push([c, r + 1, c, r]);
  });
  /* start at the top edge of the top row's leftmost square, then follow the edges round */
  const top = Math.min(...cells.map(([, r]) => r)),
    left = Math.min(...cells.filter(([, r]) => r === top).map(([c]) => c));
  let at = edges.findIndex(([x1, y1, x2, y2]) => x1 === left && y1 === top && y2 === top);
  const walk = [];
  while (at >= 0 && walk.length < edges.length) {
    const edge = edges[at];
    walk.push(edge);
    at = edges.findIndex(([x1, y1], j) => x1 === edge[2] && y1 === edge[3] && !walk.includes(edges[j]));
  }
  return walk;
}
/* the number of unit lengths around a shape made of unit squares */
const perimeterOf = (cells) => boundary(cells).length;
/* A shape of unit squares on a grid, drawn from x0, y0 with squares `size` pixels on a side and a square of empty grid all
   round it (markup). walk: how many unit lengths of the outline to light up and number, going round from the top left.
   count: number the squares, row by row, to count the area. */
function gridAt(cells, x0, y0, size, { walk = 0, count = false } = {}) {
  const cols = Math.max(...cells.map(([c]) => c)) + 1,
    rows = Math.max(...cells.map(([, r]) => r)) + 1,
    /* the pixel where grid line k starts, across and down (the grid has an empty square before column 0 and row 0) */
    px = (k) => x0 + (k + 1) * size,
    py = (k) => y0 + (k + 1) * size;
  let markup = "";
  range(cols + 3).forEach((k) => {
    markup += `<line class="ggrid" x1="${px(k - 1)}" y1="${py(-1)}" x2="${px(k - 1)}" y2="${py(rows + 1)}"/>`;
  });
  range(rows + 3).forEach((k) => {
    markup += `<line class="ggrid" x1="${px(-1)}" y1="${py(k - 1)}" x2="${px(cols + 1)}" y2="${py(k - 1)}"/>`;
  });
  cells.forEach(([c, r]) => {
    markup += `<rect class="gcell" x="${px(c)}" y="${py(r)}" width="${size}" height="${size}"/>`;
  });
  if (count)
    cells
      .slice()
      .sort(([c1, r1], [c2, r2]) => r1 - r2 || c1 - c2)
      .forEach(([c, r], i) => {
        markup += `<text class="lbl s gsq" x="${px(c) + size / 2}" y="${py(r) + size / 2}">${i + 1}</text>`;
      });
  const outline = boundary(cells);
  markup += `<path class="gout" d="${outline.map(([x1, y1, x2, y2]) => `M${px(x1)},${py(y1)}L${px(x2)},${py(y2)}`).join("")}"/>`;
  /* each walked unit length is lit, with its number in a disc on its middle (beside it, numbers would crowd at a corner that
     bends in) */
  outline.slice(0, walk).forEach(([x1, y1, x2, y2], i) => {
    const midX = (px(x1) + px(x2)) / 2,
      midY = (py(y1) + py(y2)) / 2;
    markup +=
      `<line class="gwalk" x1="${px(x1)}" y1="${py(y1)}" x2="${px(x2)}" y2="${py(y2)}"/>` +
      `<circle class="gdot" cx="${midX}" cy="${midY}" r="${Math.min(10, size * 0.32)}"/>` +
      `<text class="lbl s gnum" x="${midX}" y="${midY}">${i + 1}</text>`;
  });
  return markup;
}
/* the width and height of a shape of unit squares, in squares */
const spanOf = (cells) => [Math.max(...cells.map(([c]) => c)) + 1, Math.max(...cells.map(([, r]) => r)) + 1];
/* One shape of unit squares on a grid (svg). size: pixels on a side of a square (to fit 360 × 260 by default). walk, count:
   as gridAt. */
function gridFig(cells, { walk = 0, count = false, size, label } = {}) {
  const [cols, rows] = spanOf(cells);
  size = size || Math.min(34, 360 / (cols + 2), 260 / (rows + 2));
  return svgWrap(
    (cols + 2) * size,
    (rows + 2) * size,
    gridAt(cells, 0, 0, size, { walk, count }),
    label || `A shape made of ${cells.length} unit squares on a grid`,
  );
}
/* Shapes of unit squares side by side, each on its own grid, all with squares the same size (they wrap onto two rows on a
   phone). letters, tap, label: as picRow. */
function gridRow(shapes, { letters = false, tap = null, label = "Shape" } = {}) {
  const spans = shapes.map(spanOf),
    widest = Math.max(...spans.map(([cols]) => cols)) + 2,
    tallest = Math.max(...spans.map(([, rows]) => rows)) + 2,
    size = Math.min(28, 190 / widest, 190 / tallest),
    width = widest * size + 10,
    height = tallest * size + 10;
  return picRow(
    shapes.length,
    width,
    height,
    (i) => {
      const [cols, rows] = spans[i];
      return gridAt(shapes[i], (width - (cols + 2) * size) / 2, (height - (rows + 2) * size) / 2, size);
    },
    { letters, tap, label },
  );
}
