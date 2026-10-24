/* The moves and pictures that Grade 8 Unit 1's game (Sprite Studio) and its Learn pages both use. Styles are in figs.css.
   Needs util.js (range), figures.js (svgWrap), angles.js (polar, arrowHead, angleMark), and tex.js (math); pages load
   pictures.css for the label styles. Points are [x, y] with y going up, as on a coordinate plane.

   fmt(n)                                   a number as written: a true minus sign, up to 2 decimal places
   ptText([x, y])                           a point as written: (3, −2)
   prime(letter, times)                     a corner's name after one move (A′) or two (A″)
   LETTERS                                  corner names, in order around a shape: A, B, C, …
   SPRITES                                  shapes with no turn or mirror that fits them onto themselves, corners on the grid
   movePt(p, move), movePts(pts, move)      where a point (or every corner) lands after a move:
                                            {kind: 'translate', dx, dy}, {kind: 'rotate', center, turn} (turn 90 is a quarter
                                            turn counterclockwise, −90 clockwise, 180 a half turn), or {kind: 'reflect', line}
                                            (line {x: k} is the vertical line x = k, {y: k} the horizontal line y = k)
   moveAll(pts, moves)                      the corners after several moves, one after another
   samePts(a, b)                            whether two corner lists are the same corners in the same order
   turnText(turn), lineText(line)           a turn as written (90° clockwise) and a line as written (the y-axis, the line x = 2)
   moveText(move, {centerName, lineName})   a move as written: "Translate 3 units right and 2 units down"
   ruleTex(move)                            a move about the origin or over an axis as a coordinate rule, in TeX:
                                            (x, y) \to (x + 3, y - 2)
   boundsOf(pts)                            the smallest and largest x and y of some points
   planeFig({shapes, …})                    shapes on a grid or a coordinate plane, with corner letters, sides, angles, centers
                                            of rotation, lines of reflection, arrows, and turns (svg)
   panelsFig(panels, {view, …})             small grids side by side, each a tap target lettered A, B, C, … (svg)
   transversalFig(deg, {texts, …})          two parallel lines crossed by a third at deg degrees, with its 8 angles (svg)
   triangleFig(a, b, {texts, …})            a triangle with angles a and b at its base, its angles marked, and a line through
                                            its top corner parallel to the base (svg) */

/* a number as written: a true minus sign, and up to 2 decimal places */
const fmt = (n) => {
  const rounded = Math.round(n * 100) / 100;
  return (rounded < 0 ? "−" : "") + Math.abs(rounded).toLocaleString("en-US", { maximumFractionDigits: 2 });
};
/* a point as written: (3, −2) */
const ptText = ([x, y]) => `(${fmt(x)}, ${fmt(y)})`;
/* a corner's name after one move (A′) or two (A″) */
const prime = (letter, times = 1) => letter + (times === 2 ? "″" : "′");
/* corner names, in order around a shape */
const LETTERS = ["A", "B", "C", "D", "E", "F"];

/* Shapes for the moves, corners in grid squares (y up) going around in order. Each has no turn or mirror that fits it onto
   itself, so every image comes from just one move, and each corner of an image matches just one corner of the original. */
const SPRITES = [
  {
    name: "right triangle",
    pts: [
      [0, 0],
      [3, 0],
      [0, 2],
    ],
  },
  {
    name: "triangle",
    pts: [
      [0, 0],
      [4, 0],
      [1, 3],
    ],
  },
  {
    name: "L-shape",
    pts: [
      [0, 0],
      [2, 0],
      [2, 1],
      [1, 1],
      [1, 3],
      [0, 3],
    ],
  },
  {
    name: "trapezoid",
    pts: [
      [0, 0],
      [3, 0],
      [2, 2],
      [0, 2],
    ],
  },
  {
    name: "flag",
    pts: [
      [0, 0],
      [1, 0],
      [1, 2],
      [3, 3],
      [0, 3],
    ],
  },
];

/* where the point [x, y] lands after one move (see the header for the moves) */
function movePt([x, y], move) {
  if (move.kind === "translate") return [x + move.dx, y + move.dy];
  /* a reflection lands as far past the line as the point was before it */
  if (move.kind === "reflect") return "x" in move.line ? [2 * move.line.x - x, y] : [x, 2 * move.line.y - y];
  /* a rotation turns the arrow from the center to the point: a quarter turn counterclockwise takes (dx, dy) to (−dy, dx) */
  const [cx, cy] = move.center,
    dx = x - cx,
    dy = y - cy;
  if (move.turn === 90) return [cx - dy, cy + dx];
  if (move.turn === -90) return [cx + dy, cy - dx];
  return [cx - dx, cy - dy];
}
/* every corner after one move */
const movePts = (pts, move) => pts.map((p) => movePt(p, move));
/* the corners after several moves, one after another */
const moveAll = (pts, moves) => moves.reduce((moved, move) => movePts(moved, move), pts);
/* whether a and b are the same corners in the same order */
const samePts = (a, b) => a.length === b.length && a.every(([x, y], i) => x === b[i][0] && y === b[i][1]);

/* a turn as written: 180°, 90° clockwise, 90° counterclockwise */
const turnText = (turn) => (Math.abs(turn) === 180 ? "180°" : `90° ${turn > 0 ? "counterclockwise" : "clockwise"}`);
/* a line as written: the x-axis, the y-axis, the line x = 2 */
const lineText = (line) =>
  "x" in line
    ? line.x === 0
      ? `the <span class="nw">${math("y")}-axis</span>`
      : `the line ${math(`x = ${texNum(line.x)}`)}`
    : line.y === 0
      ? `the <span class="nw">${math("x")}-axis</span>`
      : `the line ${math(`y = ${texNum(line.y)}`)}`;
/* a number in TeX: a minus sign TeX spaces as one */
const texNum = (n) => (n < 0 ? `-${-n}` : `${n}`);
/* A move as written: "Translate 3 units right and 2 units down", "Rotate 90° clockwise around P", "Reflect over the
   y-axis". centerName and lineName name the center or the line (P, line ℓ) instead of giving its coordinates. */
function moveText(move, { centerName, lineName } = {}) {
  if (move.kind === "translate") {
    const units = (n) => `${Math.abs(n)} ${Math.abs(n) === 1 ? "unit" : "units"}`,
      parts = [];
    if (move.dx) parts.push(`${units(move.dx)} ${move.dx > 0 ? "right" : "left"}`);
    if (move.dy) parts.push(`${units(move.dy)} ${move.dy > 0 ? "up" : "down"}`);
    return `Translate ${parts.join(" and ")}`;
  }
  if (move.kind === "rotate") {
    const atOrigin = move.center[0] === 0 && move.center[1] === 0;
    return `Rotate ${turnText(move.turn)} around ${centerName || (atOrigin ? "the origin" : ptText(move.center))}`;
  }
  return `Reflect over ${lineName || lineText(move.line)}`;
}
/* A move as a coordinate rule, in TeX: (x, y) → (x + 3, y − 2). Only for translations, reflections over the axes or a line
   x = k or y = k, and rotations around the origin. */
function ruleTex(move) {
  /* a coordinate plus or minus a number: x + 3, y - 2, or just x */
  const shift = (letter, by) => (by === 0 ? letter : `${letter} ${by > 0 ? "+" : "-"} ${Math.abs(by)}`);
  /* a coordinate taken from twice the line's number: 4 - x, or -x for an axis */
  const flip = (letter, at) => (at === 0 ? `-${letter}` : `${texNum(2 * at)} - ${letter}`);
  let image;
  if (move.kind === "translate") image = [shift("x", move.dx), shift("y", move.dy)];
  else if (move.kind === "reflect")
    image = "x" in move.line ? [flip("x", move.line.x), "y"] : ["x", flip("y", move.line.y)];
  else image = move.turn === 90 ? ["-y", "x"] : move.turn === -90 ? ["y", "-x"] : ["-x", "-y"];
  return `(x, y) \\to (${image[0]}, ${image[1]})`;
}

/* the smallest and largest x and y of some points */
const boundsOf = (pts) => ({
  minX: Math.min(...pts.map((p) => p[0])),
  maxX: Math.max(...pts.map((p) => p[0])),
  minY: Math.min(...pts.map((p) => p[1])),
  maxY: Math.max(...pts.map((p) => p[1])),
});
/* is the pixel (x, y) inside the polygon with corners pts (in pixels)? A ray to the right crosses its sides an odd number of
   times when it is */
function insidePx(pts, x, y) {
  let crossings = 0;
  pts.forEach(([x1, y1], i) => {
    const [x2, y2] = pts[(i + 1) % pts.length];
    if (y1 > y !== y2 > y && x < x1 + ((y - y1) * (x2 - x1)) / (y2 - y1)) crossings++;
  });
  return crossings % 2 === 1;
}
/* the direction from pixel (x1, y1) to (x2, y2), in degrees counterclockwise from pointing right (pixel y goes down) */
const headingPx = (x1, y1, x2, y2) => (Math.atan2(y1 - y2, x2 - x1) * 180) / Math.PI;

/* The view a picture needs: every corner, point, arrow end, and turn in it, one square to spare on each side, and the origin
   when the axes are drawn. Returns [xMin, xMax, yMin, yMax]. */
function viewFor({ shapes = [], points = [], lines = [], segs = [], arrows = [], turns = [], axes = false }) {
  const all = [
    ...shapes.flatMap((s) => s.pts),
    ...points.map((p) => p.at),
    ...segs.flatMap((s) => [s.from, s.to]),
    ...arrows.flatMap((a) => [a.from, a.to]),
    ...turns.flatMap((t) => [t.center, t.from]),
  ];
  lines.forEach(({ line }) =>
    all.push("x" in line ? [line.x, all[0] ? all[0][1] : 0] : [all[0] ? all[0][0] : 0, line.y]),
  );
  if (axes) all.push([0, 0]);
  const b = boundsOf(all);
  return [b.minX - 1, b.maxX + 1, b.minY - 1, b.maxY + 1];
}

/* The markup of a grid or coordinate plane and what's on it, and its size: {markup, width, height}. planeFig and panelsFig
   draw it. Options:
   shapes: [{pts, cls, verts, sides, angles, hi}]: cls 'a' gold, 'b' cyan, 'c' pink, 'd' green, 'ghost' a dashed outline;
     verts: a name for each corner, written outside it; sides: a label for each side (side i runs from corner i to i + 1),
     null for none; angles: {corner index: text} written inside the corner; hi: sides (indexes) to draw thick.
   points: [{at, text, cls, dir}]: a dot (a center of rotation), with text beside it: up and to the right, or toward dir
     degrees (counterclockwise from pointing right).
   lines: [{line, text, cls}]: a whole line across the view ({x: k}, {y: k}, or {through: [p, q]}), dashed, named by text.
   segs: [{from, to, cls}]: dashed segments (from a center to a corner). arrows: [{from, to}]: an arrow (a translation).
   turns: [{center, from, turn}]: a curved arrow from the point `from` turning `turn` degrees around center (a rotation).
   view: [xMin, xMax, yMin, yMax] (viewFor's by default). axes: number the axes through the origin. grid: false draws no
   grid. cell: pixels a grid square. */
function planeMarkup(opts) {
  const {
      shapes = [],
      points = [],
      lines = [],
      segs = [],
      arrows = [],
      turns = [],
      axes = false,
      grid = true,
      cell = 24,
    } = opts,
    [xMin, xMax, yMin, yMax] = opts.view || viewFor(opts),
    /* room around the grid for corner names and the axes' numbers */
    pad = axes ? 30 : 22,
    width = (xMax - xMin) * cell + 2 * pad,
    height = (yMax - yMin) * cell + 2 * pad,
    xOf = (x) => pad + (x - xMin) * cell,
    yOf = (y) => pad + (yMax - y) * cell;
  let markup = "";
  /* the grid, and the axes with every number (every other one when squares are small), clear of the origin */
  if (grid) {
    range(xMax - xMin + 1).forEach((i) => {
      const x = xOf(xMin + i);
      markup += `<line class="tf-grid" x1="${x}" y1="${yOf(yMax)}" x2="${x}" y2="${yOf(yMin)}"/>`;
    });
    range(yMax - yMin + 1).forEach((j) => {
      const y = yOf(yMin + j);
      markup += `<line class="tf-grid" x1="${xOf(xMin)}" y1="${y}" x2="${xOf(xMax)}" y2="${y}"/>`;
    });
  }
  if (axes) {
    const every = cell < 20 ? 2 : 1,
      originX = xOf(0),
      originY = yOf(0);
    markup +=
      `<line class="tf-axis" x1="${xOf(xMin)}" y1="${originY}" x2="${xOf(xMax)}" y2="${originY}"/>` +
      `<line class="tf-axis" x1="${originX}" y1="${yOf(yMin)}" x2="${originX}" y2="${yOf(yMax)}"/>` +
      `<text class="lbl s dm" x="${xOf(xMax) + 14}" y="${originY}">x</text>` +
      `<text class="lbl s dm" x="${originX}" y="${yOf(yMax) - 14}">y</text>`;
    range(xMax - xMin + 1).forEach((i) => {
      const v = xMin + i;
      if (v !== 0 && v % every === 0)
        markup += `<text class="lbl tf-num" x="${xOf(v)}" y="${originY + 11}">${fmt(v)}</text>`;
    });
    range(yMax - yMin + 1).forEach((j) => {
      const v = yMin + j;
      if (v !== 0 && v % every === 0)
        markup += `<text class="lbl tf-num en" x="${originX - 5}" y="${yOf(v)}">${fmt(v)}</text>`;
    });
  }
  /* whole lines across the view: a line of reflection, or a line through two points */
  lines.forEach(({ line, text, cls = "" }) => {
    let x1, y1, x2, y2;
    if ("x" in line) [x1, y1, x2, y2] = [xOf(line.x), yOf(yMin), xOf(line.x), yOf(yMax)];
    else if ("y" in line) [x1, y1, x2, y2] = [xOf(xMin), yOf(line.y), xOf(xMax), yOf(line.y)];
    else {
      /* the line through p and q, cut where it leaves the view: the part of p + t(q − p) inside every edge */
      const [[px, py], [qx, qy]] = line.through,
        dx = qx - px,
        dy = qy - py;
      let tLo = -Infinity,
        tHi = Infinity;
      [
        [px, dx, xMin, xMax],
        [py, dy, yMin, yMax],
      ].forEach(([start, step, lo, hi]) => {
        if (step === 0) return;
        const a = (lo - start) / step,
          b = (hi - start) / step;
        tLo = Math.max(tLo, Math.min(a, b));
        tHi = Math.min(tHi, Math.max(a, b));
      });
      [x1, y1, x2, y2] = [xOf(px + tLo * dx), yOf(py + tLo * dy), xOf(px + tHi * dx), yOf(py + tHi * dy)];
    }
    markup += `<line class="tf-line ${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    /* its name just past the top (or right) end, whichever end is higher up */
    if (text) {
      const [tx, ty] = y2 < y1 || (y2 === y1 && x2 > x1) ? [x2, y2] : [x1, y1];
      markup += `<text class="lbl s cy" x="${tx + ("y" in line ? -10 : 10)}" y="${ty + ("y" in line ? -10 : 8)}">${text}</text>`;
    }
  });
  shapes.forEach((s) => {
    const pts = s.pts.map(([x, y]) => [xOf(x), yOf(y)]),
      count = pts.length;
    markup += `<polygon class="tf ${s.cls || "a"}" points="${pts.map(([x, y]) => `${x},${y}`).join(" ")}"/>`;
    (s.hi || []).forEach((i) => {
      const [x1, y1] = pts[i],
        [x2, y2] = pts[(i + 1) % count];
      markup += `<line class="tf-hi" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    });
    /* side labels sit just outside the middle of each side, along the normal that points out of the shape */
    (s.sides || []).forEach((text, i) => {
      if (text === null || text === undefined) return;
      const [x1, y1] = pts[i],
        [x2, y2] = pts[(i + 1) % count],
        len = Math.hypot(x2 - x1, y2 - y1),
        midX = (x1 + x2) / 2,
        midY = (y1 + y2) / 2;
      let nx = (y2 - y1) / len,
        ny = -(x2 - x1) / len;
      if (insidePx(pts, midX + nx * 3, midY + ny * 3)) [nx, ny] = [-nx, -ny];
      /* a label beside a side that runs up and down stands off farther, by about 4 pixels a character */
      const off = 12 + Math.abs(nx) * String(text).length * 4;
      markup += `<text class="lbl s${(s.hi || []).includes(i) ? " gd" : ""}" x="${midX + nx * off}" y="${midY + ny * off}">${text}</text>`;
    });
    /* the line that splits corner i in half, pointing into the shape */
    const bisector = (i) => {
      const [x, y] = pts[i],
        [px, py] = pts[(i + count - 1) % count],
        [nx, ny] = pts[(i + 1) % count],
        toPrev = Math.hypot(px - x, py - y),
        toNext = Math.hypot(nx - x, ny - y);
      let dx = (px - x) / toPrev + (nx - x) / toNext,
        dy = (py - y) / toPrev + (ny - y) / toNext;
      const len = Math.hypot(dx, dy) || 1;
      [dx, dy] = [dx / len, dy / len];
      /* at a corner that points in, the sum points out of the shape: turn it around */
      return insidePx(pts, x + dx * 3, y + dy * 3) ? [dx, dy] : [-dx, -dy];
    };
    /* corner names outside the corner, and angles inside it, farther in at a sharp corner so they clear both sides */
    (s.verts || []).forEach((name, i) => {
      if (!name) return;
      const [dx, dy] = bisector(i),
        [x, y] = pts[i];
      markup += `<text class="lbl s tf-vx" x="${x - dx * 13}" y="${y - dy * 13}">${name}</text>`;
    });
    Object.entries(s.angles || {}).forEach(([i, text]) => {
      const corner = +i,
        [dx, dy] = bisector(corner),
        [x, y] = pts[corner],
        [px, py] = pts[(corner + count - 1) % count],
        [nx, ny] = pts[(corner + 1) % count],
        cosine =
          ((px - x) * (nx - x) + (py - y) * (ny - y)) / (Math.hypot(px - x, py - y) * Math.hypot(nx - x, ny - y)),
        halfAngle = Math.acos(Math.max(-1, Math.min(1, cosine))) / 2,
        away = Math.min(60, 16 / Math.sin(halfAngle));
      markup += `<text class="lbl s cy" x="${x + dx * away}" y="${y + dy * away}">${text}</text>`;
    });
  });
  segs.forEach(({ from, to, cls = "" }) => {
    markup += `<line class="tf-seg ${cls}" x1="${xOf(from[0])}" y1="${yOf(from[1])}" x2="${xOf(to[0])}" y2="${yOf(to[1])}"/>`;
  });
  arrows.forEach(({ from, to }) => {
    const [x1, y1, x2, y2] = [xOf(from[0]), yOf(from[1]), xOf(to[0]), yOf(to[1])];
    markup +=
      `<line class="tf-arrow" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>` +
      arrowHead(x2, y2, headingPx(x1, y1, x2, y2));
  });
  /* a curved arrow: the arc around the center from `from`, turning `turn` degrees, with an arrowhead pointing along it */
  turns.forEach(({ center, from, turn }) => {
    const cx = xOf(center[0]),
      cy = yOf(center[1]),
      fx = xOf(from[0]),
      fy = yOf(from[1]),
      r = Math.hypot(fx - cx, fy - cy),
      start = headingPx(cx, cy, fx, fy),
      end = start + turn,
      [ex, ey] = polar(cx, cy, r, end);
    /* counterclockwise on the page is sweep-flag 0 */
    markup +=
      `<path class="tf-turn" d="M${fx},${fy}A${r},${r} 0 0 ${turn > 0 ? 0 : 1} ${ex},${ey}"/>` +
      arrowHead(ex, ey, end + (turn > 0 ? 90 : -90));
  });
  points.forEach(({ at, text, cls = "", dir }) => {
    const [x, y] = [xOf(at[0]), yOf(at[1])];
    markup += `<circle class="tf-pt ${cls}" cx="${x}" cy="${y}" r="5"/>`;
    if (text && dir !== undefined) {
      const [tx, ty] = polar(x, y, 16, dir);
      markup += `<text class="lbl s gd" x="${tx}" y="${ty}">${text}</text>`;
    } else if (text) markup += `<text class="lbl s gd st" x="${x + 8}" y="${y - 11}">${text}</text>`;
  });
  return { markup, width, height };
}
/* Shapes on a grid or a coordinate plane (see planeMarkup for the options). label: what a screen reader says. */
function planeFig(opts = {}) {
  const { markup, width, height } = planeMarkup(opts);
  return svgWrap(width, height, markup, opts.label || "Shapes on a grid");
}
/* Small grids side by side, cols to a row, all with the same view, each a .cand to tap (data-id = its id) lettered with its
   tag in the corner. panels: [{id, tag, …planeMarkup's options}]. */
function panelsFig(panels, { view, cell = 16, cols = 2, label = "Pictures to pick from" } = {}) {
  const gap = 12,
    drawn = panels.map((panel) => planeMarkup({ ...panel, view, cell })),
    { width, height } = drawn[0],
    rows = Math.ceil(panels.length / cols);
  let markup = "";
  panels.forEach((panel, i) => {
    const left = (i % cols) * (width + gap),
      top = Math.floor(i / cols) * (height + gap);
    markup +=
      `<g class="cand tf-panel" data-id="${panel.id}" tabindex="0" role="button" aria-label="Picture ${panel.tag}" transform="translate(${left},${top})">` +
      `<rect class="tf-box" x="1" y="1" width="${width - 2}" height="${height - 2}" rx="10"/>` +
      drawn[i].markup +
      `<text class="lbl tf-tag" x="13" y="14">${panel.tag}</text></g>`;
  });
  return svgWrap(cols * width + (cols - 1) * gap, rows * height + (rows - 1) * gap, markup, label);
}

/* Two parallel lines (ℓ on top, m below) crossed by a third line at deg degrees (35 to 145). Its eight angles are numbered
   0 to 3 at the top crossing and 4 to 7 at the bottom one, each going counterclockwise from the angle between the line going
   right and the crossing line going up, so the even ones measure deg and the odd ones 180 − deg. texts: the angles' texts
   (empty for none); hi: angles to shade. */
function transversalFig(deg, { texts = [], hi = [], label } = {}) {
  const width = 340,
    height = 250,
    topY = 72,
    bottomY = 182,
    /* how far right the top crossing is from the bottom one, so the crossing line runs at deg */
    run = (bottomY - topY) / Math.tan((deg * Math.PI) / 180),
    topX = width / 2 + run / 2,
    bottomX = width / 2 - run / 2,
    /* the crossing line runs on past each crossing by this much */
    past = 62,
    [farX, farY] = polar(topX, topY, past, deg),
    [nearX, nearY] = polar(bottomX, bottomY, past, deg + 180);
  let markup = "";
  /* the parallel lines, with arrows at both ends and matching chevrons that mark them parallel */
  [topY, bottomY].forEach((y, i) => {
    /* the chevron goes at the end of the line farther from where the crossing line meets it */
    const crossX = i ? bottomX : topX,
      chevX = crossX < width / 2 ? width - 70 : 66;
    markup +=
      `<line class="gline" x1="18" y1="${y}" x2="${width - 18}" y2="${y}"/>` +
      arrowHead(width - 18, y, 0) +
      arrowHead(18, y, 180) +
      `<path class="tf-chev" d="M${chevX - 4},${y - 6} L${chevX + 4},${y} L${chevX - 4},${y + 6}"/>` +
      `<text class="lbl s dm" x="${width - 12}" y="${y - 16}">${i ? "m" : "ℓ"}</text>`;
  });
  markup +=
    `<line class="gline b" x1="${nearX}" y1="${nearY}" x2="${farX}" y2="${farY}"/>` +
    arrowHead(farX, farY, deg) +
    arrowHead(nearX, nearY, deg + 180);
  /* the four angles at each crossing: between 0 and deg, deg and 180, 180 and 180 + deg, 180 + deg and 360 */
  const spans = [
    [0, deg],
    [deg, 180],
    [180, 180 + deg],
    [180 + deg, 360],
  ];
  [
    [topX, topY],
    [bottomX, bottomY],
  ].forEach(([cx, cy], crossing) =>
    spans.forEach(([from, to], i) => {
      const index = crossing * 4 + i,
        r = i % 2 ? 20 : 26;
      if (hi.includes(index)) {
        const [ax, ay] = polar(cx, cy, r + 6, from),
          [bx, by] = polar(cx, cy, r + 6, to);
        markup += `<path class="tf-wedge" d="M${cx},${cy}L${ax},${ay}A${r + 6},${r + 6} 0 0 0 ${bx},${by}Z"/>`;
      }
      if (texts[index]) markup += angleMark(cx, cy, from, to, { r, text: texts[index] });
    }),
  );
  return svgWrap(width, height, markup, label || `Parallel lines ℓ and m crossed by a line at ${deg}°`);
}

/* A triangle ABC with angle a at A (bottom left) and b at B (bottom right), so angle C at the top is 180 − a − b.
   texts: [A's text, B's text, C's text] written in the corners (empty for none). parallel: draw the line through C parallel to
   AB, with outside: [the text of the angle between it and CA, of the angle between it and CB]. */
function triangleFig(a, b, { texts = [], parallel = false, outside = [], label } = {}) {
  /* the corners with AB 1 long and y up: C is where the sides from A (at a) and B (at 180 − b) meet, and by the law of
     sines AC is sin b / sin(a + b) */
  const rad = (d) => (d * Math.PI) / 180,
    sideAC = Math.sin(rad(b)) / Math.sin(rad(a + b)),
    corners = [
      [0, 0],
      [1, 0],
      [sideAC * Math.cos(rad(a)), sideAC * Math.sin(rad(a))],
    ],
    reach = parallel ? 0.42 : 0,
    b0 = boundsOf([...corners, [corners[2][0] - reach, 0], [corners[2][0] + reach, 0]]),
    /* fit the triangle (and the parallel line) in 280 by 170 pixels */
    scale = Math.min(280 / (b0.maxX - b0.minX), 170 / (b0.maxY - b0.minY || 1)),
    left = 30,
    top = 44,
    width = (b0.maxX - b0.minX) * scale + 2 * left,
    height = (b0.maxY - b0.minY) * scale + top + 30,
    at = ([x, y]) => [left + (x - b0.minX) * scale, top + (b0.maxY - y) * scale],
    [[ax, ay], [bx, by], [cx, cy]] = corners.map(at);
  let markup = `<polygon class="tf a" points="${ax},${ay} ${bx},${by} ${cx},${cy}"/>`;
  if (parallel) {
    const lineLeft = cx - reach * scale,
      lineRight = cx + reach * scale;
    markup +=
      `<line class="gline b" x1="${lineLeft}" y1="${cy}" x2="${lineRight}" y2="${cy}"/>` +
      arrowHead(lineRight, cy, 0) +
      arrowHead(lineLeft, cy, 180);
    if (outside[0]) markup += angleMark(cx, cy, 180, 180 + a, { r: 24, text: outside[0] });
    if (outside[1]) markup += angleMark(cx, cy, 360 - b, 360, { r: 24, text: outside[1] });
  }
  /* each corner's angle mark, between its two sides (counterclockwise), and its letter outside it */
  [
    [ax, ay, 0, a, "A", 225],
    [bx, by, 180 - b, 180, "B", 315],
    [cx, cy, 180 + a, 360 - b, "C", 90],
  ].forEach(([x, y, from, to, name, away], i) => {
    if (texts[i]) markup += angleMark(x, y, from, to, { r: i === 2 ? 20 : 24, text: texts[i] });
    const [lx, ly] = polar(x, y, 16, away);
    markup += `<text class="lbl s tf-vx" x="${lx}" y="${ly}">${name}</text>`;
  });
  return svgWrap(width, height, markup, label || `Triangle ABC with angles ${a}° and ${b}° at its base`);
}
