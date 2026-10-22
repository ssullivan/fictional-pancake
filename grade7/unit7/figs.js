/* The pictures that Grade 7 Unit 7's game (Skate Park Builders) and its Learn pages both use. Styles are in figs.css.
   Needs util.js (range), figures.js (svgWrap), and angles.js (polar, angleMark, arrowHead); pages load pictures.css for the
   label styles.

   fmt(n)                                   a number as written: commas, up to 2 decimal places
   raysFig(rays, {marks, label})            rays from one point, at angles in degrees, with arcs and text between them (svg)
   crossFig(deg, {texts, label})            two lines crossing at deg degrees, each of the four angles marked with a text (svg)
   triFig(a, b, c, {label})                 a triangle with sides a, b, and c, or, when they can't make one, the two short
                                            sides hinged at the ends of the long one, falling short (svg)
   prismFig(base, h, {labels, label})       a prism: the polygon base (corners in units) in front, pushed back h units (svg)
   SECTION_SHAPES, sectionFig(name)         shapes a slice can make, and one drawn (svg) */

/* a number as written: commas and up to 2 decimal places */
const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });

/* Rays from one point at (cx, cy), each [direction in degrees, cls] ('b' cyan; gold by default), with a line along the
   bottom when `line` is set (so the rays stand on a straight angle). marks: [{from, to, text, r}] arcs between two
   directions, with text beside them (a 90° mark is a small box). */
function raysFig(rays, { marks = [], line = false, label = "Rays from a point" } = {}) {
  const width = 340,
    height = 190,
    cx = width / 2,
    cy = 160,
    len = 140;
  let markup = "";
  if (line)
    markup +=
      `<line class="gline" x1="${cx - len - 10}" y1="${cy}" x2="${cx + len + 10}" y2="${cy}"/>` +
      arrowHead(cx + len + 10, cy, 0) +
      arrowHead(cx - len - 10, cy, 180);
  rays.forEach(([deg, cls = ""]) => {
    const [x, y] = polar(cx, cy, len, deg);
    markup += `<line class="gray ${cls}" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>` + arrowHead(x, y, deg);
  });
  marks.forEach(({ from, to, text, r = 34 }) => (markup += angleMark(cx, cy, from, to, { r, text })));
  markup += `<circle class="gpt" cx="${cx}" cy="${cy}" r="5"/>`;
  return svgWrap(width, height, markup, label);
}

/* Two lines crossing at deg degrees (0 < deg < 180): one across, one tilted. texts: the four angles' texts, going
   counterclockwise from the angle between the line going right and the tilted line going up. */
function crossFig(deg, { texts = [], label } = {}) {
  const width = 340,
    height = 220,
    cx = width / 2,
    cy = height / 2,
    half = 150,
    tilt = 100;
  const [x1, y1] = polar(cx, cy, tilt, deg),
    [x2, y2] = polar(cx, cy, -tilt, deg);
  let markup =
    `<line class="gline" x1="${cx - half}" y1="${cy}" x2="${cx + half}" y2="${cy}"/>` +
    arrowHead(cx + half, cy, 0) +
    arrowHead(cx - half, cy, 180) +
    `<line class="gline b" x1="${x2}" y1="${y2}" x2="${x1}" y2="${y1}"/>` +
    arrowHead(x1, y1, deg) +
    arrowHead(x2, y2, deg + 180);
  /* the four angles: between 0 and deg, deg and 180, 180 and 180 + deg, 180 + deg and 360 */
  const spans = [
    [0, deg],
    [deg, 180],
    [180, 180 + deg],
    [180 + deg, 360],
  ];
  spans.forEach(([from, to], i) => {
    if (texts[i]) markup += angleMark(cx, cy, from, to, { r: i % 2 ? 26 : 34, text: texts[i] });
  });
  return svgWrap(width, height, markup, label || `Two lines crossing`);
}

/* A triangle with sides a, b (the two that meet at the top), and c (the base), drawn to fit. When a + b isn't more than c,
   they can't meet: the two sides hang down from the base's ends, reaching toward each other and falling short. */
function triFig(a, b, c, { label } = {}) {
  const longest = Math.max(a, b, c),
    scale = 260 / longest,
    left = 40,
    baseY = 170,
    canMake = a + b > c && a + c > b && b + c > a;
  let markup = "";
  const lbl = (x, y, text) => `<text class="lbl s" x="${x}" y="${y}">${text}</text>`;
  if (canMake) {
    /* the top corner: a from the left end, b from the right end (law of cosines for the angle at the left) */
    const cosLeft = (a * a + c * c - b * b) / (2 * a * c),
      topX = left + a * cosLeft * scale,
      topY = baseY - a * Math.sqrt(1 - cosLeft * cosLeft) * scale,
      rightX = left + c * scale;
    markup +=
      `<polygon class="tri" points="${left},${baseY} ${rightX},${baseY} ${topX},${topY}"/>` +
      lbl((left + rightX) / 2, baseY + 18, fmt(c)) +
      lbl((left + topX) / 2 - 14, (baseY + topY) / 2, fmt(a)) +
      lbl((rightX + topX) / 2 + 14, (baseY + topY) / 2, fmt(b));
    return svgWrap(left + c * scale + 40, baseY + 30, markup, label || `A triangle with sides ${a}, ${b}, and ${c}`);
  }
  /* can't make one: the long side, and the two others swung up as far as they go (lying along it), with the gap left */
  const sides = [a, b, c].sort((u, v) => u - v),
    [short1, short2, long] = sides,
    rightX = left + long * scale,
    reach1 = left + short1 * scale,
    reach2 = rightX - short2 * scale;
  markup +=
    `<line class="tri-side" x1="${left}" y1="${baseY}" x2="${rightX}" y2="${baseY}"/>` +
    `<line class="tri-side b" x1="${left}" y1="${baseY - 14}" x2="${reach1}" y2="${baseY - 14}"/>` +
    `<line class="tri-side b" x1="${rightX}" y1="${baseY - 28}" x2="${reach2}" y2="${baseY - 28}"/>` +
    lbl((left + rightX) / 2, baseY + 18, fmt(long)) +
    lbl((left + reach1) / 2, baseY - 30, fmt(short1)) +
    lbl((rightX + reach2) / 2, baseY - 44, fmt(short2));
  if (reach2 > reach1)
    markup += `<line class="tri-gap" x1="${reach1}" y1="${baseY - 20}" x2="${reach2}" y2="${baseY - 20}"/>`;
  return svgWrap(left + long * scale + 40, baseY + 30, markup, label || `Sides ${a}, ${b}, and ${c} can't meet`);
}

/* A prism drawn at an angle: base is the polygon's corners [x, y] in units (y up), drawn in front, and the same polygon
   pushed back h units (up and to the right). labels: [{at: [x, y] in units, text}] on the front face, and the depth's text. */
function prismFig(base, h, { labels = [], depthText = "", unitPx = 18, label = "A prism" } = {}) {
  const xs = base.map((p) => p[0]),
    ys = base.map((p) => p[1]),
    depthX = Math.min(h, 12) * unitPx * 0.55,
    depthY = Math.min(h, 12) * unitPx * 0.4,
    left = 30,
    top = 20 + depthY,
    width = (Math.max(...xs) - Math.min(...xs)) * unitPx + depthX + 2 * left,
    height = (Math.max(...ys) - Math.min(...ys)) * unitPx + top + 40,
    at = ([x, y], back = false) => [
      left + (x - Math.min(...xs)) * unitPx + (back ? depthX : 0),
      top + (Math.max(...ys) - y) * unitPx - (back ? depthY : 0),
    ],
    front = base.map((p) => at(p)),
    rear = base.map((p) => at(p, true)),
    points = (list) => list.map(([x, y]) => `${x},${y}`).join(" ");
  let markup = `<polygon class="pr-back" points="${points(rear)}"/>`;
  front.forEach(
    ([x, y], i) => (markup += `<line class="pr-edge" x1="${x}" y1="${y}" x2="${rear[i][0]}" y2="${rear[i][1]}"/>`),
  );
  markup += `<polygon class="pr-front" points="${points(front)}"/>`;
  labels.forEach(({ at: spot, text }) => {
    const [x, y] = at(spot);
    markup += `<text class="lbl s" x="${x}" y="${y}">${text}</text>`;
  });
  if (depthText) {
    /* the depth's label beside the edge going back from the bottom right corner */
    const corner = front.reduce((best, p) => (p[0] + p[1] > best[0] + best[1] ? p : best)),
      i = front.indexOf(corner);
    markup += `<text class="lbl s st" x="${(corner[0] + rear[i][0]) / 2 + 8}" y="${(corner[1] + rear[i][1]) / 2 + 10}">${depthText}</text>`;
  }
  return svgWrap(width, height, markup, label);
}

/* shapes a slice through a solid can make, each as corners in a 100 × 100 box (a circle has none) */
const SECTION_SHAPES = {
  square: [
    [20, 20],
    [80, 20],
    [80, 80],
    [20, 80],
  ],
  rectangle: [
    [5, 30],
    [95, 30],
    [95, 70],
    [5, 70],
  ],
  triangle: [
    [50, 12],
    [90, 85],
    [10, 85],
  ],
  trapezoid: [
    [30, 25],
    [70, 25],
    [92, 78],
    [8, 78],
  ],
  hexagon: [
    [30, 15],
    [70, 15],
    [92, 50],
    [70, 85],
    [30, 85],
    [8, 50],
  ],
  pentagon: [
    [50, 10],
    [90, 40],
    [75, 88],
    [25, 88],
    [10, 40],
  ],
  circle: null,
};
/* one of SECTION_SHAPES, drawn 100 pixels across */
function sectionFig(name) {
  const corners = SECTION_SHAPES[name],
    markup = corners
      ? `<polygon class="cut" points="${corners.map(([x, y]) => `${x + 10},${y + 10}`).join(" ")}"/>`
      : `<circle class="cut" cx="60" cy="60" r="44"/>`;
  return svgWrap(120, 120, markup, `A ${name}`);
}
