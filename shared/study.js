/* Study guides (grade<N>/unit<M>/study.html): Diagram, which draws a guide's pictures as inline SVG. Each unit's own study.js
   says what to draw (its FIGURES) and puts each picture into its <figure data-fig="name">. The classes are styled in
   shared/study.css (g, sh, frame, ed, lb, lb sm, lb hl) and the unit's page (any others). Needs nothing else.

   new Diagram(x0, x1, y0, y1, scale, {pad, label, left, right})   a picture of x0…x1 by y0…y1 units, y going up
     .at([x, y])                         that point in pixels, y going down
     .grid(x0, x1, y0, y1)               faint lines on every whole unit
     .poly(points, cls)                  a polygon (sh)
     .box(x, y, w, h, cls)               a rectangle with corner (x, y), w wide and h tall (sh)
     .circle(p, r, cls)                  a circle at p, r units across from its middle (sh)
     .line(p, q, cls)                    a segment (ed)
     .right(c, u, v, size)               a right-angle mark at corner c
     .text(p, words, {dx, dy, cls, anchor})   a label (lb)
     .side(p, q, words, inside, {gap, cls})   a label beside a side, away from the point inside
     .svg()                              the markup
   Each method but at() and svg() returns the diagram, so calls chain.

   namesWidth(names)                     pixels to leave on a diagram's left for these names written there
   doubleLine([topName, bottomName], ticks, label, {length, scale, hl})   a double number line (svg) */

/* A diagram covering x0…x1 by y0…y1 units, `scale` pixels per unit, with `pad` pixels around it (left and right add more
   on that side, for labels). Its methods add parts and return the diagram, so calls chain; svg() gives the markup. */
class Diagram {
  constructor(x0, x1, y0, y1, scale, { pad = 26, label = "Diagram", left = 0, right = 0 } = {}) {
    Object.assign(this, { x0, y0, scale, label, padX: pad + left, padY: pad, parts: [] });
    this.width = Math.round((x1 - x0) * scale + 2 * pad + left + right);
    this.height = Math.round((y1 - y0) * scale + 2 * pad);
  }
  /* a point in units as [x, y] pixels, y going down */
  at([x, y]) {
    const round = (v) => Math.round(v * 10) / 10;
    return [round(this.padX + (x - this.x0) * this.scale), round(this.height - this.padY - (y - this.y0) * this.scale)];
  }
  /* faint grid lines on every whole unit from x0…x1 and y0…y1 */
  grid(x0, x1, y0, y1) {
    for (let x = x0; x <= x1; x++) this.line([x, y0], [x, y1], "g");
    for (let y = y0; y <= y1; y++) this.line([x0, y], [x1, y], "g");
    return this;
  }
  poly(points, cls = "sh") {
    this.parts.push(`<polygon class="${cls}" points="${points.map((p) => this.at(p).join(",")).join(" ")}"/>`);
    return this;
  }
  box(x, y, w, h, cls = "sh") {
    return this.poly(
      [
        [x, y],
        [x + w, y],
        [x + w, y + h],
        [x, y + h],
      ],
      cls,
    );
  }
  circle(p, r, cls = "sh") {
    const [cx, cy] = this.at(p);
    this.parts.push(`<circle class="${cls}" cx="${cx}" cy="${cy}" r="${Math.round(r * this.scale * 10) / 10}"/>`);
    return this;
  }
  line(p, q, cls = "ed") {
    const [x1, y1] = this.at(p),
      [x2, y2] = this.at(q);
    this.parts.push(`<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
    return this;
  }
  /* a right-angle mark `size` pixels on a side at corner c, along the unit directions u and v (y up) */
  right(c, u, v, size = 9) {
    const [cx, cy] = this.at(c),
      [ux, uy] = [u[0] * size, -u[1] * size],
      [vx, vy] = [v[0] * size, -v[1] * size];
    this.parts.push(
      `<polyline class="ra" points="${cx + ux},${cy + uy} ${cx + ux + vx},${cy + uy + vy} ${cx + vx},${cy + vy}"/>`,
    );
    return this;
  }
  /* text at point p, nudged dx, dy pixels */
  text(p, words, { dx = 0, dy = 0, cls = "lb", anchor = "middle" } = {}) {
    const [x, y] = this.at(p);
    this.parts.push(`<text class="${cls}" x="${x + dx}" y="${y + dy}" text-anchor="${anchor}">${words}</text>`);
    return this;
  }
  /* a label beside segment pq at its middle, `gap` pixels out on the side away from the point `inside`; it's anchored away
     from the segment so a slanted side doesn't run through it */
  side(p, q, words, inside, { gap = 13, cls = "lb" } = {}) {
    const [ax, ay] = this.at(p),
      [bx, by] = this.at(q),
      [mx, my] = [(ax + bx) / 2, (ay + by) / 2],
      [ix, iy] = this.at(inside),
      length = Math.hypot(bx - ax, by - ay) || 1;
    /* (nx, ny): the segment's normal, flipped to point away from inside */
    let [nx, ny] = [-(by - ay) / length, (bx - ax) / length];
    if ((ix - mx) * nx + (iy - my) * ny > 0) [nx, ny] = [-nx, -ny];
    const anchor = nx < -0.3 ? "end" : nx > 0.3 ? "start" : "middle",
      round = (v) => Math.round(v * 10) / 10;
    this.parts.push(
      `<text class="${cls}" x="${round(mx + nx * gap)}" y="${round(my + ny * gap + 5)}" text-anchor="${anchor}">${words}</text>`,
    );
    return this;
  }
  svg() {
    return `<svg viewBox="0 0 ${this.width} ${this.height}" width="${this.width}" role="img" aria-label="${this.label}">${this.parts.join("")}</svg>`;
  }
}

/* pixels to leave on the left for row or line names written there (small labels are about 7.4 pixels a letter) */
const namesWidth = (names) => 14 + Math.ceil(7.4 * Math.max(...names.map((name) => name.length)));

/* A double number line: two lines, named [topName, bottomName] on their left, with a tick for each [at, top, bottom] in
   ticks. Ticks are placed by `at` (the last one sits at the end, `length` units along); top and bottom are the words by the
   tick on each line, null for none or "_" for a box to fill in. hl: the `at`s whose words are blue (the ones worked out). */
function doubleLine([topName, bottomName], ticks, label, { length = 8, scale = 40, hl = [] } = {}) {
  /* the top line is at y = topY and the bottom at y = 0; both run on `arrow` units past the last tick to their arrowheads */
  const max = ticks[ticks.length - 1][0],
    xOf = (at) => (length * at) / max,
    topY = 1.6,
    arrow = 0.5,
    end = length + arrow,
    tickHalf = 0.18,
    d = new Diagram(0, end + 0.3, -0.9, topY + 0.9, scale, { pad: 12, label, left: namesWidth([topName, bottomName]) });
  [topY, 0].forEach((y) =>
    d.line([0, y], [end, y]).poly(
      [
        [end + 0.3, y],
        [end - 0.05, y + 0.16],
        [end - 0.05, y - 0.16],
      ],
      "tip",
    ),
  );
  ticks.forEach(([at, top, bottom]) => {
    const x = xOf(at),
      cls = hl.includes(at) ? "lb hl" : "lb";
    d.line([x, topY - tickHalf], [x, topY + tickHalf]).line([x, -tickHalf], [x, tickHalf]);
    /* the top line's words go above it, the bottom line's below; a box to fill in takes their place */
    if (top === "_") d.box(x - 0.45, topY + 0.3, 0.9, 0.5, "frame");
    else if (top !== null) d.text([x, topY], top, { dy: -12, cls });
    if (bottom === "_") d.box(x - 0.45, -0.8, 0.9, 0.5, "frame");
    else if (bottom !== null) d.text([x, 0], bottom, { dy: 24, cls });
  });
  return d
    .text([0, topY], topName, { dx: -12, dy: 5, cls: "lb sm", anchor: "end" })
    .text([0, 0], bottomName, { dx: -12, dy: 5, cls: "lb sm", anchor: "end" })
    .svg();
}
