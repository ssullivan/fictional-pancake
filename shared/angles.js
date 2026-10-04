/* Angles for K–5 pages (Grade 4): points, lines, rays, and segments; angles with their arcs and right-angle marks; protractors;
   and pairs of lines. Styles are in angles.css. Needs util.js and figures.js (svgWrap). Angles are in degrees, measured
   counterclockwise from pointing right, the way a protractor reads them.

   polar(cx, cy, r, deg)             the point r from (cx, cy) in the direction deg: [x, y] (svg y goes down)
   geoFig(kind, {names, tilt})       a point, line, ray, or segment, with a letter at each point (svg)
   angleMark(cx, cy, from, to, {r, text})   the arc between two rays from a vertex (a box when it's 90°), with text (markup)
   angleFig(deg, {turn, letters, mark, text})   an angle of deg degrees, its first ray turned `turn` from pointing right (svg)
   protractor(deg, {base, ray})      a protractor with an angle on it, its first ray along the base line, right or left (svg)
   linesFig(cross, {gap})            two lines: parallel (cross 0), or crossing at cross degrees (svg) */
/* the point r away from (cx, cy) in the direction deg (counterclockwise from pointing right); y is flipped for svg */
const polar = (cx, cy, r, deg) => [
  +(cx + r * Math.cos((deg * Math.PI) / 180)).toFixed(2),
  +(cy - r * Math.sin((deg * Math.PI) / 180)).toFixed(2),
];
/* an arrowhead at (x, y) pointing in the direction deg */
const arrowHead = (x, y, deg) => {
  const [x1, y1] = polar(x, y, 14, deg + 155),
    [x2, y2] = polar(x, y, 14, deg - 155);
  return `<polygon class="garrow" points="${x},${y} ${x1},${y1} ${x2},${y2}"/>`;
};
/* a dot at (x, y) with a letter beside it, away from the direction `away` */
const namedPoint = (x, y, name, away = 90) => {
  const [lx, ly] = polar(x, y, 20, away);
  return (
    `<circle class="gpt" cx="${x}" cy="${y}" r="5"/>` +
    (name ? `<text class="lbl s" x="${lx}" y="${ly}">${name}</text>` : "")
  );
};
/* A point, line, ray, or segment through two points named names[0] and names[1] (a point uses only the first), tilted `tilt`
   degrees. A line has arrows at both ends, a ray at the far end only, and a segment none. */
function geoFig(kind, { names = ["A", "B"], tilt = 0, label } = {}) {
  const cx = 160,
    cy = 60,
    [ax, ay] = polar(cx, cy, -80, tilt),
    [bx, by] = polar(cx, cy, 80, tilt),
    /* how far a line or ray goes past its points before the arrow */
    [farBx, farBy] = polar(cx, cy, 135, tilt),
    [farAx, farAy] = polar(cx, cy, -135, tilt);
  let markup = "";
  if (kind === "point") markup = namedPoint(cx, cy, names[0]);
  else {
    const [x1, y1] = kind === "line" ? [farAx, farAy] : [ax, ay],
      [x2, y2] = kind === "segment" ? [bx, by] : [farBx, farBy];
    markup =
      `<line class="gline" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>` +
      (kind !== "segment" ? arrowHead(x2, y2, tilt) : "") +
      (kind === "line" ? arrowHead(x1, y1, tilt + 180) : "") +
      namedPoint(ax, ay, names[0], tilt + 90) +
      namedPoint(bx, by, names[1], tilt + 90);
  }
  return svgWrap(
    320,
    120,
    markup,
    label || (kind === "point" ? `Point ${names[0]}` : `${kind[0].toUpperCase() + kind.slice(1)} ${names.join("")}`),
  );
}
/* The mark for the angle at (cx, cy) from the ray pointing `from` degrees to the one pointing `to` (counterclockwise): an arc of
   radius r (a whole circle for a full turn), or a small box when it's exactly 90°. text: written inside the angle, along the middle (like "50°"). */
function angleMark(cx, cy, from, to, { r = 30, text = "" } = {}) {
  const size = to - from,
    mid = from + size / 2;
  let markup;
  if (size === 90) {
    const [ax, ay] = polar(cx, cy, 16, from),
      [bx, by] = polar(cx, cy, 16, to),
      [cornerX, cornerY] = polar(cx, cy, 16 * Math.SQRT2, mid);
    markup = `<path class="gbox" d="M${ax},${ay}L${cornerX},${cornerY}L${bx},${by}"/>`;
  } else if (size >= 360) markup = `<circle class="garc" cx="${cx}" cy="${cy}" r="${r}"/>`;
  else {
    const [ax, ay] = polar(cx, cy, r, from),
      [bx, by] = polar(cx, cy, r, to);
    /* counterclockwise on the page is sweep-flag 0; more than 180° takes the long way round */
    markup = `<path class="garc" d="M${ax},${ay}A${r},${r} 0 ${size > 180 ? 1 : 0} 0 ${bx},${by}"/>`;
  }
  if (text) {
    const [tx, ty] = polar(cx, cy, r + 22, mid);
    markup += `<text class="lbl s cy" x="${tx}" y="${ty}">${text}</text>`;
  }
  return markup;
}
/* An angle of deg degrees (up to 360): two rays from a vertex, the first turned `turn` degrees from pointing right.
   letters: [first ray's point, vertex, second ray's point] written beside them; mark: draw its arc or right-angle box;
   text: written in the angle (like "?" or "50°"). The picture is cropped to what's drawn. */
function angleFig(deg, { turn = 0, letters = null, mark = true, text = "", r = 110, label } = {}) {
  const center = 200,
    [ax, ay] = polar(center, center, r, turn),
    [bx, by] = polar(center, center, r, turn + deg),
    /* the picture's corners: the vertex, both rays' ends, and the arc's text, with room for letters */
    bounds = [[center, center], [ax, ay], [bx, by], polar(center, center, 70, turn + deg / 2)];
  let markup =
    `<line class="gray" x1="${center}" y1="${center}" x2="${ax}" y2="${ay}"/>` +
    `<line class="gray" x1="${center}" y1="${center}" x2="${bx}" y2="${by}"/>` +
    arrowHead(ax, ay, turn) +
    arrowHead(bx, by, turn + deg) +
    `<circle class="gpt" cx="${center}" cy="${center}" r="5"/>`;
  if (mark) markup += angleMark(center, center, turn, turn + deg, { text });
  if (letters) {
    const [first, vertex, second] = letters,
      outside = turn + deg / 2 + 180;
    markup +=
      (first
        ? `<text class="lbl s" x="${polar(ax, ay, 18, turn - 90)[0]}" y="${polar(ax, ay, 18, turn - 90)[1]}">${first}</text>`
        : "") +
      `<text class="lbl s" x="${polar(center, center, 20, outside)[0]}" y="${polar(center, center, 20, outside)[1]}">${vertex}</text>` +
      (second
        ? `<text class="lbl s" x="${polar(bx, by, 18, turn + deg + 90)[0]}" y="${polar(bx, by, 18, turn + deg + 90)[1]}">${second}</text>`
        : "");
  }
  const pad = 30,
    xs = bounds.map(([x]) => x),
    ys = bounds.map(([, y]) => y),
    minX = Math.min(...xs) - pad,
    minY = Math.min(...ys) - pad;
  return svgWrap(
    Math.max(...xs) + pad - minX,
    Math.max(...ys) + pad - minY,
    `<g transform="translate(${-minX},${-minY})">${markup}</g>`,
    label || `An angle of ${deg} degrees`,
  );
}
/* A protractor (a half circle) with both scales: the inner one counts from 0 on the right, the outer one from 0 on the left.
   The angle's first ray lies along the base line, pointing right (base 'right') or left ('left'); its second ray is deg degrees
   from it. ray: false leaves the second ray off (to read an empty protractor, or to draw your own). */
function protractor(deg, { base = "right", ray = true, label } = {}) {
  const r = 170,
    cx = r + 44,
    cy = r + 26,
    baseDir = base === "right" ? 0 : 180,
    rayDir = base === "right" ? deg : 180 - deg;
  let markup = `<path class="prot" d="M${cx - r},${cy}A${r},${r} 0 0 1 ${cx + r},${cy}Z"/>`;
  /* a tick every 5°, longer every 10°; numbers every 10° on both scales */
  range(37).forEach((i) => {
    const a = 5 * i,
      [x1, y1] = polar(cx, cy, r, a),
      [x2, y2] = polar(cx, cy, r - (a % 10 ? 7 : 13), a);
    markup += `<line class="ptick" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    if (a % 10 === 0) {
      /* the numbers at the ends sit just above the base line, not on it */
      const lift = a === 0 || a === 180 ? 9 : 0,
        [ix, iy] = polar(cx, cy, r - 30, a),
        [ox, oy] = polar(cx, cy, r + 14, a);
      markup += `<text class="pnum in" x="${ix}" y="${iy - lift}">${a}</text><text class="pnum out" x="${ox}" y="${oy - lift}">${180 - a}</text>`;
    }
  });
  const [bx, by] = polar(cx, cy, r + 10, baseDir),
    [rx, ry] = polar(cx, cy, r + 10, rayDir);
  markup +=
    `<line class="pbase" x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}"/>` +
    `<line class="gray" x1="${cx}" y1="${cy}" x2="${bx}" y2="${by}"/>` +
    (ray ? `<line class="gray b" x1="${cx}" y1="${cy}" x2="${rx}" y2="${ry}"/>` : "") +
    `<circle class="gpt" cx="${cx}" cy="${cy}" r="5"/>`;
  return svgWrap(
    2 * cx,
    cy + 12,
    markup,
    label || (ray ? `A protractor with an angle whose first ray points ${base}` : "A protractor"),
  );
}
/* Two lines: parallel (cross 0), or the second crossing the first at cross degrees, with the angle between them marked (a box
   at 90°). gap: how far apart parallel lines are. */
function linesFig(cross, { gap = 60, label } = {}) {
  const cx = 160,
    cy = 90,
    half = 130;
  let markup;
  if (cross === 0)
    markup = [-gap / 2, gap / 2]
      .map(
        (dy) =>
          `<line class="gline" x1="${cx - half}" y1="${cy + dy}" x2="${cx + half}" y2="${cy + dy}"/>` +
          arrowHead(cx + half, cy + dy, 0) +
          arrowHead(cx - half, cy + dy, 180),
      )
      .join("");
  else {
    const [x1, y1] = polar(cx, cy, 80, cross),
      [x2, y2] = polar(cx, cy, -80, cross);
    markup =
      `<line class="gline" x1="${cx - half}" y1="${cy}" x2="${cx + half}" y2="${cy}"/>` +
      arrowHead(cx + half, cy, 0) +
      arrowHead(cx - half, cy, 180) +
      `<line class="gline b" x1="${x2}" y1="${y2}" x2="${x1}" y2="${y1}"/>` +
      arrowHead(x1, y1, cross) +
      arrowHead(x2, y2, cross + 180) +
      angleMark(cx, cy, 0, cross, { r: 24 });
  }
  return svgWrap(
    2 * cx,
    2 * cy,
    markup,
    label || (cross === 0 ? "Two parallel lines" : `Two lines crossing at ${cross} degrees`),
  );
}
