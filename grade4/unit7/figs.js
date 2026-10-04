/* What Grade 4 Unit 7's game and its Learn pages both use. Needs angles.js (polar, angleMark) and figures.js (svgWrap).

   angleKind(deg)                    the name for an angle of deg degrees: "acute", "right", "obtuse", "straight", …
   splitFig(parts, texts)            an angle split into parts by rays from one vertex, with text in each part (svg) */
/* the kind of angle: less than 90° is acute, 90° right, between 90° and 180° obtuse, 180° straight; past that it's more than
   a straight angle, and 360° is a full turn */
const angleKind = (deg) =>
  deg === 0
    ? "no turn at all"
    : deg < 90
      ? "acute"
      : deg === 90
        ? "right"
        : deg < 180
          ? "obtuse"
          : deg === 180
            ? "straight"
            : deg < 360
              ? "more than a straight angle"
              : "a full turn";
/* An angle split into parts by rays from one vertex: parts are the parts' sizes in degrees, in order counterclockwise from
   pointing right; texts are written in each part (like "40°" or "?"). The last ray is where the parts add up to. */
function splitFig(parts, texts, label) {
  const center = 170,
    r = 120,
    /* where each ray points: 0, then the running total of the parts */
    rays = parts.reduce((dirs, part) => [...dirs, dirs[dirs.length - 1] + part], [0]);
  let markup = rays
    .map((dir) => {
      const [x, y] = polar(center, center, r, dir);
      return `<line class="gray" x1="${center}" y1="${center}" x2="${x}" y2="${y}"/>`;
    })
    .join("");
  parts.forEach((part, i) => {
    markup += angleMark(center, center, rays[i], rays[i + 1], { r: 30 + 14 * (i % 2), text: texts[i] });
  });
  markup += `<circle class="gpt" cx="${center}" cy="${center}" r="5"/>`;
  /* a turn of 180° or less needs only the top half of the picture */
  const total = rays[rays.length - 1],
    height = total <= 180 ? center + 30 : 2 * center;
  return svgWrap(2 * center, height, markup, label || `An angle of ${total} degrees split into ${parts.length} parts`);
}
