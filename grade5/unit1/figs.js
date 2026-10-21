/* Pictures that Grade 5 Unit 1's game and its Learn pages both use: boxes and unit cubes drawn at an angle. Styles are in
   figs.css. Needs util.js (range) and figures.js (svgWrap).

   x goes across (length), y up (height), and z back (width, or depth): a box at [x, y, z] of size [l, h, w].
   prismFig(boxes, {label, max, notes})   boxes, each a solid prism or a single unit cube, drawn front, top, and right faces,
                                     with labels anywhere on it (svg)
   box(l, h, w, {at, cls, grid, ghost, lab})   one box for prismFig
   cubesOf(cells, cls)               unit cubes at the cells [[x, y, z], …], as boxes for prismFig
   columnsOf(heights, cls)           columns of cubes standing on the table: heights[z][x] cubes tall, row 0 in front
   layersOf(l, h, w, filled, {dir})  a box l by h by w with `filled` layers of cubes, bottom up (dir 'up'), front to back
                                     ('back'), or left to right ('side'), and the rest of the box dashed
   iconCube(x, y, size, fill)        a small cube for a 64 × 64 icon, its front bottom left corner at (x, y) (markup) */

/* the screen offset of one unit back: right and up, as a share of a cube's edge */
const DEPTH_X = 0.6,
  DEPTH_Y = 0.45;

/* One box for prismFig. at: its front bottom left corner. cls: its color ('b' cyan, 'g' green, 'p' pink; gold by default).
   grid: lines between its unit cubes. ghost: only its outline, dashed (the empty part of a box).
   lab: edge labels {l: bottom front edge, lt: top back edge, h: left front edge, hr: right back edge, w: bottom right edge}. */
const box = (l, h, w, { at = [0, 0, 0], cls = "", grid = false, ghost = false, lab = {} } = {}) => ({
  at,
  size: [l, h, w],
  cls,
  grid,
  ghost,
  lab,
});
/* unit cubes at the cells [[x, y, z], …] */
const cubesOf = (cells, cls = "") => cells.map((at) => box(1, 1, 1, { at, cls }));
/* columns of cubes on the table, heights[z][x] tall (row 0 in front) */
const columnsOf = (heights, cls = "") =>
  cubesOf(
    heights.flatMap((row, z) => row.flatMap((tall, x) => range(tall).map((y) => [x, y, z]))),
    cls,
  );
/* a box with `filled` layers of cubes and the rest dashed. dir 'up': layers bottom to top (each l × w); 'back': front to back
   (each l × h); 'side': left to right (each w × h). The filled cubes are gold, every other layer cyan so the layers show. */
function layersOf(l, h, w, filled, { dir = "up" } = {}) {
  const boxes = range(filled).map((i) => {
    const cls = i % 2 ? "b" : "";
    if (dir === "up") return box(l, 1, w, { at: [0, i, 0], cls, grid: true });
    if (dir === "back") return box(l, h, 1, { at: [0, 0, i], cls, grid: true });
    return box(1, h, w, { at: [i, 0, 0], cls, grid: true });
  });
  return [box(l, h, w, { ghost: true }), ...boxes];
}

/* Boxes drawn at an angle: the front, top, and right faces, with the depth going back up and to the right. Boxes are drawn
   back to front, then bottom to top, then left to right, so nearer faces cover farther ones (this works for unit cubes and for
   boxes that sit side by side or stack). Ghost boxes are drawn first, as dashed outlines, so solid boxes cover the parts of
   them they'd hide. max: the largest a unit may be, in pixels. label: what a screen reader says.
   notes: more labels, [[text, [a, b, k], side]], each beside the point a across, b up, and k back: 'below', 'above', 'left',
   'right', or 'edge' (right and a little below, for an edge going back) (for a label on an edge that spans two boxes, like a
   figure's whole length). */
function prismFig(boxes, { label = "A figure made of cubes", max = 40, notes = [] } = {}) {
  /* the figure is spanX units across and spanY up, counting the depth's slant */
  const spanX = Math.max(...boxes.map(({ at: [x, , z], size: [l, , w] }) => x + l + (z + w) * DEPTH_X)),
    spanY = Math.max(...boxes.map(({ at: [, y, z], size: [, h, w] }) => y + h + (z + w) * DEPTH_Y)),
    unit = Math.min(max, 380 / spanX, 230 / spanY),
    /* room for edge labels left of the figure, right of it, above, and below (a little room when it has none) */
    labelled = notes.length > 0 || boxes.some((b) => Object.keys(b.lab).length > 0),
    left = labelled ? 76 : 8,
    right = labelled ? 92 : 8,
    top = labelled ? 26 : 8,
    bottom = labelled ? 34 : 8,
    width = Math.ceil(left + spanX * unit + right),
    height = Math.ceil(top + spanY * unit + bottom);
  /* at(a, b, k): the screen point a units across, b up, and k back */
  const at = (a, b, k) => [left + (a + k * DEPTH_X) * unit, top + (spanY - b - k * DEPTH_Y) * unit];
  const pt = ([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`,
    face = (cls, corners) => `<polygon class="${cls}" points="${corners.map((c) => pt(at(...c))).join(" ")}"/>`,
    line = (cls, from, to) => {
      const [x1, y1] = at(...from),
        [x2, y2] = at(...to);
      return `<line class="${cls}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
    };
  /* a label beside the point (a, b, k): below or above it (centered), or left or right of it (ending or starting there) */
  const text = (words, [a, b, k], side) => {
    const [px, py] = at(a, b, k),
      [dx, dy, anchor] = {
        below: [0, 16, ""],
        above: [0, -12, ""],
        left: [-8, 0, "en"],
        right: [8, 0, "st"],
        edge: [10, 8, "st"],
      }[side];
    return `<text class="lbl s ${anchor}" x="${(px + dx).toFixed(1)}" y="${(py + dy).toFixed(1)}">${words}</text>`;
  };
  /* ghosts first, then back to front, bottom to top, left to right */
  const order = [...boxes].sort(
    (p, q) => q.ghost - p.ghost || q.at[2] - p.at[2] || p.at[1] - q.at[1] || p.at[0] - q.at[0],
  );
  let markup = "";
  for (const {
    at: [x, y, z],
    size: [l, h, w],
    cls,
    grid,
    ghost,
  } of order) {
    if (ghost) {
      /* the 9 edges you'd see: around the front, the top's back and side, and the right face's back */
      markup += [
        [
          [x, y, z],
          [x + l, y, z],
        ],
        [
          [x + l, y, z],
          [x + l, y + h, z],
        ],
        [
          [x + l, y + h, z],
          [x, y + h, z],
        ],
        [
          [x, y + h, z],
          [x, y, z],
        ],
        [
          [x, y + h, z],
          [x, y + h, z + w],
        ],
        [
          [x, y + h, z + w],
          [x + l, y + h, z + w],
        ],
        [
          [x + l, y + h, z],
          [x + l, y + h, z + w],
        ],
        [
          [x + l, y, z],
          [x + l, y, z + w],
        ],
        [
          [x + l, y, z + w],
          [x + l, y + h, z + w],
        ],
      ]
        .map(([from, to]) => line("pgh", from, to))
        .join("");
      continue;
    }
    const c = cls ? ` ${cls}` : "";
    markup +=
      face(`pf f${c}`, [
        [x, y, z],
        [x + l, y, z],
        [x + l, y + h, z],
        [x, y + h, z],
      ]) +
      face(`pf t${c}`, [
        [x, y + h, z],
        [x + l, y + h, z],
        [x + l, y + h, z + w],
        [x, y + h, z + w],
      ]) +
      face(`pf r${c}`, [
        [x + l, y, z],
        [x + l, y, z + w],
        [x + l, y + h, z + w],
        [x + l, y + h, z],
      ]);
    if (grid) {
      /* the lines between unit cubes on each face: across and up on the front, across and back on the top, back and up on the right */
      for (let i = 1; i < l; i++)
        markup += line("pg", [x + i, y, z], [x + i, y + h, z]) + line("pg", [x + i, y + h, z], [x + i, y + h, z + w]);
      for (let j = 1; j < h; j++)
        markup += line("pg", [x, y + j, z], [x + l, y + j, z]) + line("pg", [x + l, y + j, z], [x + l, y + j, z + w]);
      for (let k = 1; k < w; k++)
        markup +=
          line("pg", [x, y + h, z + k], [x + l, y + h, z + k]) + line("pg", [x + l, y, z + k], [x + l, y + h, z + k]);
    }
  }
  /* edge labels go on top of everything */
  for (const {
    at: [x, y, z],
    size: [l, h, w],
    lab,
  } of boxes) {
    if (lab.l) markup += text(lab.l, [x + l / 2, y, z], "below");
    if (lab.lt) markup += text(lab.lt, [x + l / 2, y + h, z + w], "above");
    if (lab.h) markup += text(lab.h, [x, y + h / 2, z], "left");
    if (lab.hr) markup += text(lab.hr, [x + l, y + h / 2, z + w], "right");
    if (lab.w) markup += text(lab.w, [x + l, y, z + w / 2], "edge");
  }
  for (const [words, point, side] of notes) markup += text(words, point, side);
  return svgWrap(width, height, markup, label);
}

/* a small cube at an angle for the icons, `size` pixels on an edge, its front bottom left corner at (x, y), its front `fill` */
const iconCube = (x, y, size, fill = "#ffc93c") => {
  const dx = size * DEPTH_X,
    dy = size * DEPTH_Y;
  return (
    `<path d="M${x},${y}h${size}v${-size}h${-size}Z" fill="${fill}" stroke="#0a2340" stroke-width="1.5"/>` +
    `<path d="M${x},${y - size}l${dx},${-dy}h${size}l${-dx},${dy}Z" fill="#ffe08a" stroke="#0a2340" stroke-width="1.5"/>` +
    `<path d="M${x + size},${y}l${dx},${-dy}v${-size}l${-dx},${dy}Z" fill="#a9822a" stroke="#0a2340" stroke-width="1.5"/>`
  );
};
