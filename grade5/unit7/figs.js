/* Pictures and shape facts that Grade 5 Unit 7's game and its Learn pages both use: a first-quadrant grid with square cells,
   and what's true of a quadrilateral or triangle drawn on it, worked out from its corners. Needs util.js (range), figures.js
   (svgWrap), and algebra.js (coordPlane); styles are algebra.css's.

   gridFig(points, {shapes, xMax, yMax, tap, label})   the grid from (0, 0) to (xMax, yMax), cells square, with points and shapes (svg)
   quadFacts(pts)                    a quadrilateral's {parallel: pairs of parallel sides, rights: right angles, equal: whether
                                     all 4 sides are equal, names: every name it has, best: its most specific name}
   triFacts(pts)                     a triangle's {sides: 'equilateral' | 'isosceles' | 'scalene', angles: 'acute' | 'right' | 'obtuse'}
   ptText([x, y])                    "(3, 5)" */

/* the grid's cells are this many pixels on a side */
const GRID_CELL = 30;
/* A first-quadrant grid from (0, 0) to (xMax, yMax) with square cells, points [{x, y, id, cls, t}], and shapes
   [{pts, closed, cls}] (as coordPlane). tap: the points are tap answers for engine.js. */
const gridFig = (points, { shapes = [], xMax = 10, yMax = 8, tap = false, label } = {}) =>
  coordPlane(points, { xMax, yMax, width: xMax * GRID_CELL, height: yMax * GRID_CELL, shapes, tap, label });
/* "(3, 5)" */
const ptText = ([x, y]) => `(${x}, ${y})`;

/* the sides of a polygon as vectors, side i from corner i to the next */
const sidesOf = (pts) => pts.map(([x, y], i) => [pts[(i + 1) % pts.length][0] - x, pts[(i + 1) % pts.length][1] - y]);
/* a side's length, squared (whole numbers on a grid, so they compare exactly) */
const lengthSq = ([dx, dy]) => dx * dx + dy * dy;
/* two sides are parallel when the cross product of their directions is 0: neither turns away from the other */
const parallel = ([ax, ay], [bx, by]) => ax * by - ay * bx === 0;
/* two sides meet at a right angle when their dot product is 0 */
const perpendicular = ([ax, ay], [bx, by]) => ax * bx + ay * by === 0;

/* What's true of a quadrilateral, from its corners in order. Names go from least to most specific: every quadrilateral; a
   trapezoid has at least one pair of parallel sides; a parallelogram two; a rectangle four right angles; a rhombus four equal
   sides; a square is both a rectangle and a rhombus. */
function quadFacts(pts) {
  const sides = sidesOf(pts),
    pairs = [parallel(sides[0], sides[2]), parallel(sides[1], sides[3])].filter(Boolean).length,
    rights = sides.filter((side, i) => perpendicular(sides[(i + 3) % 4], side)).length,
    equal = sides.every((side) => lengthSq(side) === lengthSq(sides[0])),
    names = [
      "quadrilateral",
      ...(pairs >= 1 ? ["trapezoid"] : []),
      ...(pairs === 2 ? ["parallelogram"] : []),
      ...(rights === 4 ? ["rectangle"] : []),
      ...(equal ? ["rhombus"] : []),
      ...(rights === 4 && equal ? ["square"] : []),
    ];
  return { parallel: pairs, rights, equal, names, best: names[names.length - 1] };
}

/* What kind of triangle, from its corners: by its sides (how many are the same length), and by its largest angle (compare
   the longest side squared with the other two squared added: equal is a right angle, more is obtuse, less is acute). */
function triFacts(pts) {
  const lengths = sidesOf(pts)
      .map(lengthSq)
      .sort((a, b) => a - b),
    [a, b, c] = lengths;
  return {
    sides: a === c ? "equilateral" : a === b || b === c ? "isosceles" : "scalene",
    angles: c === a + b ? "right" : c > a + b ? "obtuse" : "acute",
  };
}
