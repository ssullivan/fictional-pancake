/* Shapes that Grade 4 Unit 8's game and its Learn pages both use: triangles and quadrilaterals with what's true of them, and
   how to draw them with their marks. Styles are in figs.css. Needs util.js and figures.js (svgWrap).

   SHAPES, SHAPE_IDS, aName(id)      the shapes: {name, pts, sides, angles, ticks, rights, parallel, sym} (below), and "a square"
   polyFig(pts, {ticks, rights, lines, sideText, ghost, w, h})   a polygon with its equal sides ticked, right angles boxed,
                                     dashed lines, side lengths written, and another outline over it (svg)
   shapeFig(id, {ticks, rights, sym, lines, sideText, ghost})   one of SHAPES drawn with its marks and lines of symmetry (svg)
   lShape(wide, tall, cutWide, cutTall, sideText)   an L-shaped figure: a rectangle with a corner cut away (svg)
   foldLine(pts, way)                a fold through a shape's middle: 'up', 'across', or 'corner' to corner
   reflect(p, a, b), isSymmetryLine(pts, a, b)   p folded over the line through a and b, and whether that line is a line of
                                     symmetry of a shape */
/* Each shape, in a 200 × 180 box: pts its corners in order; sides and angles what kind of triangle it is (or null for
   quadrilaterals); ticks how many tick marks each side gets (sides with the same number are equal; side i goes from corner i
   to the next); rights the corners with right angles; parallel how many pairs of parallel sides; sym its lines of symmetry
   as [x1, y1, x2, y2]. */
const SHAPES = {
  equilateral: {
    name: "equilateral triangle",
    pts: [
      [100, 14],
      [190, 170],
      [10, 170],
    ],
    sides: "equilateral",
    angles: "acute",
    ticks: [1, 1, 1],
    rights: [],
    parallel: 0,
    sym: [
      [100, 4, 100, 178],
      [190, 170, 48, 88],
      [10, 170, 152, 88],
    ],
  },
  isoscelesAcute: {
    name: "isosceles triangle",
    pts: [
      [100, 10],
      [160, 170],
      [40, 170],
    ],
    sides: "isosceles",
    angles: "acute",
    ticks: [1, 0, 1],
    rights: [],
    parallel: 0,
    sym: [[100, 2, 100, 178]],
  },
  rightIsosceles: {
    name: "right isosceles triangle",
    pts: [
      [20, 20],
      [20, 170],
      [170, 170],
    ],
    sides: "isosceles",
    angles: "right",
    ticks: [1, 1, 0],
    rights: [1],
    parallel: 0,
    sym: [[20, 170, 110, 80]],
  },
  rightScalene: {
    name: "right scalene triangle",
    pts: [
      [20, 40],
      [20, 170],
      [196, 170],
    ],
    sides: "scalene",
    angles: "right",
    ticks: [0, 0, 0],
    rights: [1],
    parallel: 0,
    sym: [],
  },
  obtuseIsosceles: {
    name: "obtuse isosceles triangle",
    pts: [
      [100, 90],
      [190, 160],
      [10, 160],
    ],
    sides: "isosceles",
    angles: "obtuse",
    ticks: [1, 0, 1],
    rights: [],
    parallel: 0,
    sym: [[100, 70, 100, 172]],
  },
  obtuseScalene: {
    name: "obtuse scalene triangle",
    pts: [
      [60, 100],
      [196, 160],
      [10, 160],
    ],
    sides: "scalene",
    angles: "obtuse",
    ticks: [0, 0, 0],
    rights: [],
    parallel: 0,
    sym: [],
  },
  acuteScalene: {
    name: "acute scalene triangle",
    pts: [
      [80, 15],
      [190, 165],
      [20, 165],
    ],
    sides: "scalene",
    angles: "acute",
    ticks: [0, 0, 0],
    rights: [],
    parallel: 0,
    sym: [],
  },
  square: {
    name: "square",
    pts: [
      [25, 15],
      [175, 15],
      [175, 165],
      [25, 165],
    ],
    ticks: [1, 1, 1, 1],
    rights: [0, 1, 2, 3],
    parallel: 2,
    sym: [
      [100, 5, 100, 175],
      [15, 90, 185, 90],
      [15, 5, 185, 175],
      [185, 5, 15, 175],
    ],
  },
  rectangle: {
    name: "rectangle",
    pts: [
      [10, 40],
      [190, 40],
      [190, 150],
      [10, 150],
    ],
    ticks: [1, 2, 1, 2],
    rights: [0, 1, 2, 3],
    parallel: 2,
    sym: [
      [100, 30, 100, 160],
      [2, 95, 198, 95],
    ],
  },
  rhombus: {
    name: "rhombus",
    pts: [
      [100, 8],
      [180, 90],
      [100, 172],
      [20, 90],
    ],
    ticks: [1, 1, 1, 1],
    rights: [],
    parallel: 2,
    sym: [
      [100, 2, 100, 178],
      [12, 90, 188, 90],
    ],
  },
  parallelogram: {
    name: "parallelogram",
    pts: [
      [60, 40],
      [196, 40],
      [140, 150],
      [4, 150],
    ],
    ticks: [1, 2, 1, 2],
    rights: [],
    parallel: 2,
    sym: [],
  },
  trapezoid: {
    name: "trapezoid",
    pts: [
      [60, 40],
      [140, 40],
      [190, 150],
      [10, 150],
    ],
    ticks: [0, 1, 0, 1],
    rights: [],
    parallel: 1,
    sym: [[100, 30, 100, 160]],
  },
  rightTrapezoid: {
    name: "trapezoid with two right angles",
    pts: [
      [10, 40],
      [120, 40],
      [190, 150],
      [10, 150],
    ],
    ticks: [0, 0, 0, 0],
    rights: [0, 3],
    parallel: 1,
    sym: [],
  },
  kite: {
    name: "kite",
    pts: [
      [100, 8],
      [160, 70],
      [100, 172],
      [40, 70],
    ],
    ticks: [1, 2, 2, 1],
    rights: [],
    parallel: 0,
    sym: [[100, 2, 100, 178]],
  },
};
const SHAPE_IDS = Object.keys(SHAPES);
/* a shape's name with "a" or "an": "an isosceles triangle" */
const aName = (id) => (/^[aeiou]/.test(SHAPES[id].name) ? "an " : "a ") + SHAPES[id].name;
/* the unit vector from point p to point q */
const toward = ([px, py], [qx, qy]) => {
  const length = Math.hypot(qx - px, qy - py);
  return [(qx - px) / length, (qy - py) / length];
};
const round1 = (v) => +v.toFixed(1);
/* A polygon with its marks, in a box w × h (with room around it for text). pts: its corners in order. ticks: how many tick
   marks each side gets (side i goes from corner i to the next); rights: the corners to box as right angles; lines: dashed
   lines [[x1, y1, x2, y2]] (lines of symmetry, or a fold to test); sideText: text for each side (or null), written outside the
   shape at the side's middle; ghost: the corners of another polygon drawn as a dashed outline (the shape folded over). */
function polyFig(
  pts,
  { ticks = [], rights = [], lines = [], sideText = null, ghost = null, w = 200, h = 180, label = "A shape" } = {},
) {
  const n = pts.length,
    /* which way the corners go round: the shoelace sum adds up the signed area under each side, positive when the corners go
       clockwise on the page (y down). Outside a side is to its left when walking clockwise. */
    turning = pts.reduce((sum, [x, y], i) => sum + x * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * y, 0) > 0 ? 1 : -1,
    pad = 60;
  let markup = `<polygon class="shp" points="${pts.map(([x, y]) => `${x},${y}`).join(" ")}"/>`;
  if (ghost)
    markup += `<polygon class="sghost" points="${ghost.map(([x, y]) => `${round1(x)},${round1(y)}`).join(" ")}"/>`;
  pts.forEach((p, i) => {
    const q = pts[(i + 1) % n],
      [mx, my] = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2],
      [ux, uy] = toward(p, q);
    /* ticks across the middle of a side, side by side when there are two */
    range(ticks[i] || 0).forEach((k) => {
      const offset = (k - (ticks[i] - 1) / 2) * 7,
        [tx, ty] = [mx + ux * offset, my + uy * offset];
      markup += `<line class="stick" x1="${round1(tx - uy * 7)}" y1="${round1(ty + ux * 7)}" x2="${round1(tx + uy * 7)}" y2="${round1(ty - ux * 7)}"/>`;
    });
    /* text beside the side, outside the shape: along the side's outward normal, farther for an up-and-down side, where the
       text runs across */
    if (sideText && sideText[i] != null) {
      const [nx, ny] = [uy * turning, -ux * turning],
        push = 16 + 18 * Math.abs(nx),
        [lx, ly] = [mx + nx * push, my + ny * push];
      markup += `<text class="lbl s${sideText[i] === "?" ? " cy" : ""}" x="${round1(lx)}" y="${round1(ly)}">${sideText[i]}</text>`;
    }
  });
  rights.forEach((i) => {
    /* a small square in the corner: along each side from the corner, then across */
    const v = pts[i],
      [ax, ay] = toward(v, pts[(i + 1) % n]),
      [bx, by] = toward(v, pts[(i + n - 1) % n]),
      size = 12;
    markup += `<path class="sright" d="M${round1(v[0] + ax * size)},${round1(v[1] + ay * size)}L${round1(v[0] + (ax + bx) * size)},${round1(v[1] + (ay + by) * size)}L${round1(v[0] + bx * size)},${round1(v[1] + by * size)}"/>`;
  });
  lines.forEach(([x1, y1, x2, y2]) => {
    markup += `<line class="ssym" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  });
  return svgWrap(w + 2 * pad, h + 2 * pad, `<g transform="translate(${pad},${pad})">${markup}</g>`, label);
}
/* One of SHAPES drawn with its marks: ticks on equal sides and boxes on right angles (unless false), its lines of symmetry
   when sym, plus any other dashed lines, side text, and ghost (as polyFig). */
function shapeFig(
  id,
  { ticks = true, rights = true, sym = false, lines = [], sideText = null, ghost = null, label } = {},
) {
  const shape = SHAPES[id];
  return polyFig(shape.pts, {
    ticks: ticks ? shape.ticks : [],
    rights: rights ? shape.rights : [],
    lines: [...(sym ? shape.sym : []), ...lines],
    sideText,
    ghost,
    label: label || aName(id),
  });
}
/* p reflected across the line through a and b: where it lands when the shape is folded on that line */
function reflect([px, py], [ax, ay], [bx, by]) {
  const [ux, uy] = toward([ax, ay], [bx, by]),
    /* how far along the line p is, and the foot of the perpendicular from p to the line */
    along = (px - ax) * ux + (py - ay) * uy,
    [footX, footY] = [ax + along * ux, ay + along * uy];
  return [2 * footX - px, 2 * footY - py];
}
/* is the line through a and b a line of symmetry of the shape with corners pts? Folding on it sends every corner onto a corner */
const isSymmetryLine = (pts, a, b) =>
  pts.every((p) => {
    const [rx, ry] = reflect(p, a, b);
    return pts.some(([x, y]) => Math.hypot(x - rx, y - ry) < 1.5);
  });
/* An L-shaped figure from a rectangle `wide` × `tall` with the top right corner cut away, `cutWide` × `cutTall` (in cm, drawn
   18 pixels a cm). Its sides, from the top left going clockwise: [top, inner up-down, inner across, right, bottom, left].
   sideText: what to write on each side (null for nothing). */
function lShape(wide, tall, cutWide, cutTall, sideText, label) {
  const unit = 18,
    top = wide - cutWide,
    pts = [
      [0, 0],
      [top, 0],
      [top, cutTall],
      [wide, cutTall],
      [wide, tall],
      [0, tall],
    ].map(([x, y]) => [x * unit, y * unit]);
  return polyFig(pts, {
    rights: [0, 1, 3, 4, 5],
    sideText,
    w: wide * unit,
    h: tall * unit,
    label: label || "An L-shaped figure",
  });
}
/* the fold line for a shape: two points on it, through the shape's middle (corner to corner: from the first corner to the third,
   or for a triangle from a corner to the middle of the opposite side) */
function foldLine(pts, way) {
  const cx = pts.reduce((sum, [x]) => sum + x, 0) / pts.length,
    cy = pts.reduce((sum, [, y]) => sum + y, 0) / pts.length;
  if (way === "up")
    return [
      [cx, -6],
      [cx, 186],
    ];
  if (way === "across")
    return [
      [-6, cy],
      [206, cy],
    ];
  if (pts.length === 4) return [pts[0], pts[2]];
  return [pts[1], [(pts[0][0] + pts[2][0]) / 2, (pts[0][1] + pts[2][1]) / 2]];
}
