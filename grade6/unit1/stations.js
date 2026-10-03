/* Blueprint Builders (Grade 6 Unit 1): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Figures are drawn on grid paper in grid units (Fig below). Each generator deals one of a few kinds of problem (type or t),
   each with a comment saying what it asks. b and h are a base and a height; A, B, C are corners. */
/* pixels per grid unit */
const U = 40;
/* a number to 2 decimal places, with commas */
const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US");
/* n to 1 decimal place */
const r1 = (n) => Math.round(n * 10) / 10;

/* ---------- figure builder (grid units → SVG) ---------- */
/* A figure on grid paper, built in layers: base (always drawn), hint (drawn with the hint, highlighted), and build (drawn in
   Build it mode). Each method draws into the current layer and returns the figure, so calls chain; svg() draws it all on a
   grid that fits the figure. */
class Fig {
  constructor() {
    this.bounds = [Infinity, Infinity, -Infinity, -Infinity];
    this.layers = { base: [], hint: [], build: [] };
    this.current = this.layers.base;
  }
  /* draw into the hint layer, or into a named layer */
  onHint() {
    this.current = this.layers.hint;
    return this;
  }
  on(name) {
    this.current = this.layers[name];
    return this;
  }
  /* grow the bounds [minX, minY, maxX, maxY] to take in x, y */
  ext(x, y) {
    const box = this.bounds;
    if (x < box[0]) box[0] = x;
    if (y < box[1]) box[1] = y;
    if (x > box[2]) box[2] = x;
    if (y > box[3]) box[3] = y;
  }
  /* points as an SVG points list in pixels (growing the bounds) */
  P(points) {
    points.forEach((point) => this.ext(point[0], point[1]));
    return points.map((point) => `${point[0] * U},${point[1] * U}`).join(" ");
  }
  poly(points, cls = "shape", attr = "") {
    this.current.push(`<polygon class="${cls}" points="${this.P(points)}" ${attr}/>`);
    return this;
  }
  line(x1, y1, x2, y2, cls = "edge") {
    this.ext(x1, y1);
    this.ext(x2, y2);
    this.current.push(`<line class="${cls}" x1="${x1 * U}" y1="${y1 * U}" x2="${x2 * U}" y2="${y2 * U}"/>`);
    return this;
  }
  /* a label in a rounded box centered on x, y, about 13.5 pixels a character */
  lbl(x, y, text, cls = "") {
    text = String(text);
    const width = text.length * 13.5 + 18;
    this.ext(x, y);
    this.current.push(
      `<g class="lbl ${cls}"><rect x="${x * U - width / 2}" y="${y * U - 17}" width="${width}" height="34" rx="8"/><text x="${x * U}" y="${y * U + 1}">${text}</text></g>`,
    );
    return this;
  }
  /* a number written inside a shape (an area) */
  txt(x, y, text) {
    this.current.push(`<text class="area-t" x="${x * U}" y="${y * U}">${text}</text>`);
    return this;
  }
  /* a right-angle mark at x, y between the directions (ux, uy) and (vx, vy), size units on a side */
  ra(x, y, ux, uy, vx, vy, size = 0.42) {
    const corner = [
      [x + ux * size, y + uy * size],
      [x + (ux + vx) * size, y + (uy + vy) * size],
      [x + vx * size, y + vy * size],
    ];
    this.current.push(`<polyline class="ra" points="${corner.map((p) => p[0] * U + "," + p[1] * U).join(" ")}"/>`);
    return this;
  }
  /* polygons as one path, so inner rings are holes (evenodd) */
  rings(rings, cls) {
    this.current.push(
      `<path class="${cls}" fill-rule="evenodd" d="${rings.map((ring) => "M" + this.P(ring).replace(/ /g, "L") + "Z").join("")}"/>`,
    );
    return this;
  }
  /* a segment to tap as an answer (id), with a wide invisible hit line */
  cand(id, x1, y1, x2, y2) {
    this.ext(x1, y1);
    this.ext(x2, y2);
    const ends = `x1="${x1 * U}" y1="${y1 * U}" x2="${x2 * U}" y2="${y2 * U}"`;
    this.current.push(
      `<g class="cand" data-id="${id}" tabindex="0" role="button" aria-label="Segment ${id}"><line class="hit" ${ends}/><line class="seg" ${ends}/></g>`,
    );
    return this;
  }
  /* the figure on a grid with 1.3 units of room around it; withHint adds the hint layer, extra adds other layers (['build']) */
  svg(withHint, extra = []) {
    const pad = 1.3,
      [minX, minY, maxX, maxY] = this.bounds;
    const x0 = Math.floor(minX - pad),
      y0 = Math.floor(minY - pad),
      x1 = Math.ceil(maxX + pad),
      y1 = Math.ceil(maxY + pad);
    let grid = "";
    for (let x = x0; x <= x1; x++) grid += `<line x1="${x * U}" y1="${y0 * U}" x2="${x * U}" y2="${y1 * U}"/>`;
    for (let y = y0; y <= y1; y++) grid += `<line x1="${x0 * U}" y1="${y * U}" x2="${x1 * U}" y2="${y * U}"/>`;
    return `<svg viewBox="${x0 * U} ${y0 * U} ${(x1 - x0) * U} ${(y1 - y0) * U}" role="img" aria-label="Figure drawn on grid paper"><g class="grid">${grid}</g>${this.layers.base.join("")}${extra.map((name) => this.layers[name].join("")).join("")}${withHint ? `<g class="hl">${this.layers.hint.join("")}</g>` : ""}</svg>`;
  }
}
/* where to put a label for side p1–p2 of the polygon pts: d units out from the side's middle, away from the polygon's center */
function outward(p1, p2, pts, d = 0.85) {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length,
    cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  const mx = (p1[0] + p2[0]) / 2,
    my = (p1[1] + p2[1]) / 2;
  let vx = mx - cx,
    vy = my - cy;
  const length = Math.hypot(vx, vy) || 1;
  return [mx + (vx / length) * d, my + (vy / length) * d];
}
/* A box l by w by h drawn at an angle into f: the top, right side, and front. lab: [l, w, h] labels (null to leave one off).
   Returns the depth (how far up and right the back is). */
function box(f, l, w, h, lab) {
  const depth = w * 0.5;
  f.poly(
    [
      [0, depth],
      [l, depth],
      [l + depth, 0],
      [depth, 0],
    ],
    "shape top",
  );
  f.poly(
    [
      [l, depth],
      [l + depth, 0],
      [l + depth, h],
      [l, depth + h],
    ],
    "shape side",
  );
  f.poly(
    [
      [0, depth],
      [l, depth],
      [l, depth + h],
      [0, depth + h],
    ],
    "shape",
  );
  if (lab[0] != null) f.lbl(l / 2, depth + h + 0.8, lab[0]);
  if (lab[1] != null) f.lbl(l + depth / 2 + 0.85, h + depth / 2 + 0.35, lab[1]);
  if (lab[2] != null) f.lbl(-0.85, depth + h / 2, lab[2]);
  return depth;
}
const SQ = "square units";

/* ---------- Zone 1: parallelograms ---------- */
function genPara() {
  /* base b, height h, and the top shifted `shift` across, so the slanted side is `slant` long */
  /* not a perimeter that equals the area (base 5, height 4, slanted side 5) */
  let b, h, shift, slant;
  do {
    b = R(4, 9);
    h = R(3, 7);
    shift = R(1, Math.min(3, b - 2));
    slant = r1(Math.hypot(shift, h));
  } while (Math.abs(2 * b + 2 * slant - b * h) < 0.011);
  /* mirror: 1 leans right, −1 leans left (X mirrors an x across the figure) */
  const mirror = pick([1, -1]),
    width = b + shift;
  const X = (x) => (mirror > 0 ? x : width - x);
  const type = pick(["area", "area", "tap", "missing"]);
  const f = new Fig();
  f.poly([
    [X(0), h],
    [X(b), h],
    [X(width), 0],
    [X(shift), 0],
  ]);
  if (type === "tap") {
    /* tap the height: the other choices are a side and a leaning segment */
    f.lbl(X(b / 2), h + 0.8, "base");
    const midX = (shift + b) / 2;
    const segments = shuffle([
      { ok: 1, p: [X(midX), 0, X(midX), h], lp: [X(midX + 0.6), h * 0.3] },
      {
        why: "That is a side of the parallelogram. It leans, so it does not meet the base at a right angle.",
        p: [X(0), h, X(shift), 0],
        lp: [X(shift / 2 - 0.7), h / 2],
      },
      {
        why: "This segment leans. A height has to meet the base at a right angle, like the corner of a sheet of paper.",
        p: [X(width - 0.4), 0, X(b - 0.3), h],
        lp: [X((width + b - 0.7) / 2 + 0.7), h * 0.62],
      },
    ]);
    const why = {};
    let answer;
    segments.forEach((segment, i) => {
      const id = "ABC"[i];
      f.cand(id, ...segment.p);
      if (segment.ok) answer = id;
      else why[id] = segment.why;
    });
    segments.forEach((segment, i) => f.lbl(...segment.lp, "ABC"[i], "letter"));
    f.onHint();
    f.ra(X(midX), h, 0, -1, mirror, 0);
    return {
      kind: "tap",
      fig: f,
      answer,
      why,
      prompt: "Tap the segment that is a <b>height</b> for this base.",
      hint: "Look for the segment that makes a square corner with the base. Follow the grid lines.",
      explain:
        "A height meets the base at a right angle. It can sit anywhere between the base and the opposite side, even inside the shape.",
    };
  }
  f.line(X(shift), 0, X(shift), h, "hgt");
  f.ra(X(shift), h, 0, -1, mirror, 0);
  f.lbl(X(b / 2), h + 0.8, b);
  f.lbl(X(shift + 0.85), h / 2, type === "missing" ? "?" : h, type === "missing" ? "q" : "h");
  f.lbl(X(shift / 2 - 0.85), h / 2 - 0.2, slant, "dim");
  /* the hint cuts off the triangle on one end and slides it to the other, making a rectangle */
  f.onHint();
  f.poly(
    [
      [X(shift), 0],
      [X(width), 0],
      [X(width), h],
      [X(shift), h],
    ],
    "ghost",
  );
  f.poly(
    [
      [X(0), h],
      [X(shift), 0],
      [X(shift), h],
    ],
    "piece slide",
    `style="--dx:${mirror * b * U}px"`,
  );
  const hint =
    "Cut off the triangle on one end and slide it to the other end. The parallelogram turns into a rectangle with the same base and height.";
  if (type === "missing") {
    /* the height, from the area and the base */
    const area = b * h;
    return {
      kind: "num",
      unit: "units",
      fig: f,
      answer: h,
      hint,
      prompt: `This parallelogram has an area of ${area} square units and a base of ${b} units. How tall is its height?`,
      misc: [
        [area - b, "Area comes from multiplying, so undo it by dividing: area ÷ base."],
        [area / 2, "Halving is for triangles. Here, height = area ÷ base."],
        [slant, "That is the slanted side. The height is the dashed segment."],
      ],
      explain: `Area = base × height, so height = ${area} ÷ ${b} = ${h} units.`,
    };
  }
  /* area */
  return {
    kind: "num",
    unit: SQ,
    fig: f,
    answer: b * h,
    hint,
    prompt: "Find the area of this parallelogram.",
    misc: [
      [
        b * slant,
        "You multiplied by the slanted side. Use the height: the dashed segment that meets the base at a right angle.",
      ],
      [(b * h) / 2, "Halving is for triangles. A parallelogram is base × height with no halving."],
      [2 * b + 2 * slant, "That is the distance around the shape (perimeter). Area measures the space inside."],
      [b + h, "Area multiplies the base and height. It does not add them."],
    ],
    explain: `Area = base × height = ${b} × ${h} = ${b * h} square units. The slanted side (${slant}) isn't needed.`,
  };
}

/* ---------- Zone 2: triangles ---------- */
function genTri() {
  const b = R(3, 9);
  let h = R(2, 7);
  /* apexX: where the top corner is above the base line; outside the base for an obtuse triangle, at an end for a right one */
  const shape = pick(["acute", "acute", "right", "obtuse", "obtuse"]);
  const apexX = shape === "right" ? pick([0, b]) : shape === "acute" ? R(1, b - 1) : pick([b + R(1, 3), -R(1, 3)]);
  let type = pick(["area", "area", "tap", "missing"]);
  if (shape === "right" && type === "tap") type = "area";
  if (type === "missing" && (b * h) % 2) h++;
  /* outside: the height lands past the base, so the base is extended */
  const A = [0, h],
    B = [b, h],
    C = [apexX, 0],
    area = (b * h) / 2,
    outside = apexX > b || apexX < 0;
  const f = new Fig();
  f.poly([A, B, C]);
  if (outside) f.line(apexX > b ? b : apexX, h, apexX > b ? apexX : 0, h, "ext");
  /* markDir: which way the right-angle mark opens along the base */
  const markDir = apexX >= b ? -1 : 1;
  if (type === "tap") {
    /* tap the height: the other choices are a side and a leaning segment (leanX: where it meets the base) */
    f.lbl(b / 2, h + 0.8, "base");
    const sideEnd = outside ? (apexX > b ? B : A) : apexX > b / 2 ? A : B;
    let leanX = outside ? b / 2 : apexX > b / 2 ? apexX - 2 : apexX + 2;
    leanX = Math.min(b - 0.5, Math.max(0.5, leanX));
    if (!outside && Math.abs(leanX - sideEnd[0]) < 0.6) leanX = (leanX + apexX) / 2;
    const segments = shuffle([
      { ok: 1, p: [apexX, 0, apexX, h] },
      {
        why: "That is a side of the triangle. It does not meet the base at a right angle.",
        p: [apexX, 0, sideEnd[0], h],
      },
      {
        why: outside
          ? "This segment leans. For this triangle the height falls outside: extend the base and drop a straight-down segment to it."
          : "This segment leans. A height makes a right angle with the base.",
        p: [apexX, 0, leanX, h],
      },
    ]);
    const why = {};
    let answer;
    segments.forEach((segment, i) => {
      const id = "ABC"[i];
      f.cand(id, ...segment.p);
      if (segment.ok) answer = id;
      else why[id] = segment.why;
    });
    /* each letter 62% of the way down its segment, a little to the right */
    segments.forEach((segment, i) => {
      const [x1, y1, x2, y2] = segment.p;
      const along = 0.62;
      f.lbl(x1 + (x2 - x1) * along + 0.55, y1 + (y2 - y1) * along, "ABC"[i], "letter");
    });
    f.onHint();
    f.ra(apexX, h, 0, -1, markDir, 0);
    return {
      kind: "tap",
      fig: f,
      answer,
      why,
      prompt: "Tap the segment that is the <b>height</b> for this base.",
      hint: outside
        ? "The height can be outside the triangle. Look for a straight-down segment that meets the dotted extension of the base at a square corner."
        : "Look for the segment that makes a square corner with the base.",
      explain: outside
        ? "For this obtuse triangle, the height lands outside. We extend the base (dotted) and measure straight down to it."
        : "The height goes from the top vertex straight down to the base, making a right angle.",
    };
  }
  /* the height's label goes beside the dashed line, on the side away from the triangle */
  const heightLabelX =
    apexX === 0
      ? -0.85
      : apexX === b
        ? b + 0.85
        : apexX > b
          ? apexX + 0.85
          : apexX < 0
            ? apexX - 0.85
            : apexX <= b / 2
              ? apexX + 0.85
              : apexX - 0.85;
  if (apexX !== 0 && apexX !== b) f.line(apexX, 0, apexX, h, "hgt");
  f.ra(apexX, h, 0, -1, markDir, 0);
  f.lbl(b / 2, h + 0.8, b);
  f.lbl(heightLabelX, h / 2, type === "missing" ? "?" : h, type === "missing" ? "q" : "h");
  /* the longest slanted side gets its length (a mistake to use) */
  const sides = [
    [C, A],
    [C, B],
  ]
    .filter(([p, q]) => p[0] !== q[0])
    .sort((u, v) => Math.hypot(v[0][0] - v[1][0], h) - Math.hypot(u[0][0] - u[1][0], h));
  const slantSide = sides[0],
    slant = r1(Math.hypot(slantSide[0][0] - slantSide[1][0], h));
  f.lbl(...outward(slantSide[0], slantSide[1], [A, B, C]), slant, "dim");
  /* the hint adds a turned copy, making a parallelogram */
  f.onHint();
  f.poly([B, [b + apexX, 0], C], "ghost");
  const hint =
    "Two copies of any triangle fit together into a parallelogram with the same base and height. The triangle is half of that parallelogram.";
  if (type === "missing") {
    /* the height, from the area and the base */
    return {
      kind: "num",
      unit: "units",
      fig: f,
      answer: h,
      hint,
      prompt: `This triangle has an area of ${fmt(area)} square units and a base of ${b} units. What is its height?`,
      misc: [
        [area / b, "The triangle is half of base × height. Double the area first, then divide by the base."],
        [area * 2, "That is base × height. Now divide by the base."],
      ],
      explain: `½ × ${b} × height = ${fmt(area)}, so ${b} × height = ${b * h}, and height = ${h} units.`,
    };
  }
  /* area */
  return {
    kind: "num",
    unit: SQ,
    fig: f,
    answer: area,
    hint,
    prompt: "Find the area of this triangle.",
    misc: [
      [b * h, "That is the area of the whole parallelogram. A triangle is half of it, so divide by 2."],
      [(b * slant) / 2, "You used the slanted side. Use the height: the dashed segment at a right angle to the base."],
      [b * slant, "You used the slanted side and forgot to halve. Use base × height ÷ 2."],
    ],
    explain: `Area = ½ × base × height = ½ × ${b} × ${h} = ${fmt(area)} square units.${outside ? " The height lands outside this triangle, so the base is extended with a dotted line." : ""}`,
  };
}

/* ---------- Zone 3: trapezoids & other polygons ---------- */
function genPoly() {
  const type = pick(["trap", "trap", "L", "house"]);
  const f = new Fig();
  if (type === "trap") {
    /* a trapezoid with bottom a, top c (starting `offset` across), and height h; the hint adds a turned copy */
    const a = R(6, 10),
      c = R(2, a - 2);
    let h = R(2, 6);
    if (((a + c) * h) % 2) h++;
    const offset = R(0, a - c),
      area = ((a + c) * h) / 2;
    f.poly([
      [0, h],
      [a, h],
      [offset + c, 0],
      [offset, 0],
    ]);
    f.lbl(a / 2, h + 0.8, a);
    f.lbl(offset + c / 2, -0.8, c);
    if (offset === 0) {
      f.ra(0, h, 0, -1, 1, 0);
      f.lbl(-0.85, h / 2, h, "h");
    } else {
      f.line(offset, 0, offset, h, "hgt");
      f.ra(offset, h, 0, -1, 1, 0);
      f.lbl(offset + 0.85, h / 2, h, "h");
    }
    f.onHint();
    f.poly(
      [
        [a, h],
        [a + c, h],
        [a + offset + c, 0],
        [offset + c, 0],
      ],
      "ghost",
    );
    f.lbl(a + c / 2, h + 0.8, c, "h");
    return {
      kind: "num",
      unit: SQ,
      fig: f,
      answer: area,
      prompt: "Find the area of this trapezoid.",
      hint: `Rotate a copy of the trapezoid and fit it on the end. Together they make a parallelogram with base ${a} + ${c} and height ${h}. The trapezoid is half.`,
      misc: [
        [(a + c) * h, "Close! That is the parallelogram made from two copies. One trapezoid is half of it."],
        [a * h, "You used only the bottom side. Both parallel sides count."],
        [c * h, "You used only the top side. Both parallel sides count."],
      ],
      explain: `Two copies make a parallelogram: (${a} + ${c}) × ${h} = ${(a + c) * h}. Half of that is ${fmt(area)} square units.`,
    };
  }
  if (type === "L") {
    /* a W by H rectangle with a cutW by cutH corner cut out (bottom right), leaving the left part leftW wide */
    const W = R(6, 9),
      H = R(5, 8),
      cutW = R(2, W - 3),
      cutH = R(2, H - 3),
      area = W * H - cutW * cutH,
      leftW = W - cutW;
    f.poly([
      [0, 0],
      [leftW, 0],
      [leftW, cutH],
      [W, cutH],
      [W, H],
      [0, H],
    ]);
    f.lbl(W / 2, H + 0.8, W);
    f.lbl(-0.85, H / 2, H);
    f.lbl(leftW / 2, -0.8, leftW);
    f.lbl(W + 0.85, cutH + (H - cutH) / 2, H - cutH);
    f.onHint();
    f.line(leftW, cutH, leftW, H, "hgt");
    f.txt(leftW / 2, H / 2, leftW * H);
    f.txt(leftW + cutW / 2, cutH + (H - cutH) / 2, cutW * (H - cutH));
    f.lbl(leftW + cutW / 2, cutH - 0.8, cutW, "h");
    return {
      kind: "num",
      unit: SQ,
      fig: f,
      answer: area,
      prompt: "Find the area of this shape.",
      hint: `Split it into two rectangles. The missing width on the right is ${W} − ${leftW} = ${cutW}.`,
      misc: [
        [W * H, "That counts the missing corner too. Subtract the cut-out, or split the shape into two rectangles."],
        [2 * W + 2 * H, "That is the perimeter. Area counts the squares inside."],
        [leftW * H + W * (H - cutH), "Your two rectangles overlap. Split the shape so no part is counted twice."],
      ],
      explain: `${leftW} × ${H} = ${leftW * H}, plus ${cutW} × ${H - cutH} = ${cutW * (H - cutH)}. Total: ${area} square units.`,
    };
  }
  /* house: a W by H rectangle with a triangle roof `roof` tall, peaking at the middle */
  const W = R(4, 9),
    H = R(2, 5);
  let roof = R(2, 4);
  if ((W * roof) % 2) roof++;
  const peakX = W / 2,
    area = W * H + (W * roof) / 2;
  f.poly([
    [0, roof],
    [peakX, 0],
    [W, roof],
    [W, roof + H],
    [0, roof + H],
  ]);
  f.lbl(W / 2, roof + H + 0.8, W);
  f.lbl(-0.85, roof + H / 2, H);
  f.line(peakX, 0, peakX, roof, "hgt");
  f.ra(peakX, roof, 0, -1, 1, 0);
  f.lbl(peakX + 0.9, roof * 0.55, roof, "h");
  f.onHint();
  f.line(0, roof, W, roof, "hgt");
  f.txt(W / 2, roof + H / 2, W * H);
  f.txt(peakX - 0.9, roof * 0.62, (W * roof) / 2);
  return {
    kind: "num",
    unit: SQ,
    fig: f,
    answer: area,
    prompt: "Find the area of this house-shaped pentagon.",
    hint: "Split it into a rectangle (the walls) and a triangle (the roof). Find each area and add.",
    misc: [
      [W * H + W * roof, "The roof is a triangle, so its area is half of base × height."],
      [W * H, "Don’t forget the triangle roof on top."],
      [(W * roof) / 2, "That is only the roof. Add the rectangle underneath."],
    ],
    explain: `Rectangle: ${W} × ${H} = ${W * H}. Roof: ½ × ${W} × ${roof} = ${(W * roof) / 2}. Total: ${area} square units.`,
  };
}

/* ---------- Zone 4: nets & surface area ---------- */
/* the 11 cube nets, as [column, row] cells: a row of 4 with one square above and one below (16 ways), and the rest */
const CUBE_OK = (() => {
  const v = [];
  for (let a = 0; a < 4; a++)
    for (let b = 0; b < 4; b++)
      v.push([
        [a, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1],
        [b, 2],
      ]);
  [1, 2, 3].forEach((x) =>
    v.push([
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
      [3, 1],
      [x, 2],
    ]),
  );
  v.push(
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
      [2, 2],
      [3, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [3, 1],
      [4, 1],
    ],
  );
  return v;
})();
/* nets that don't fold into a cube, and why */
const CUBE_BAD = [
  {
    c: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
    ],
    why: "Six in a row wraps all the way around, so the last squares overlap the first ones.",
  },
  {
    c: [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    why: "It has a 2×2 block. Four squares can’t all fold around one corner of a cube, so faces overlap.",
  },
  {
    c: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
    ],
    why: "It has a 2×2 block. Four squares can’t all fold around one corner of a cube, so faces overlap.",
  },
  {
    c: [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 1],
    ],
    why: "A row of 5 wraps past the start, so two faces land in the same spot.",
  },
  {
    c: [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 1],
    ],
    why: "A row of 5 wraps past the start, so two faces land in the same spot.",
  },
];
/* two nets, the same prism? (like the Lesson 14 practice problems). Both are drawn at the same scale, so sizes can be compared. */
/* the height of an equilateral triangle with sides 1 */
const S3 = Math.sqrt(3) / 2;
/* a triangular prism's net: one side rectangle with a triangle on each end, and the other two rectangles hinged to the triangles'
   slanted edges ('l' or 'r'). It folds only when they're on opposite edges: the same edge twice covers one side twice. */
function fanNet(a, h, top, bot) {
  /* the triangles above and below the a by h rectangle */
  const upper = [
      [0, 0],
      [a, 0],
      [a / 2, -a * S3],
    ],
    lower = [
      [0, h],
      [a, h],
      [a / 2, h + a * S3],
    ];
  /* an h-long rectangle hinged on edge p–q, on the side away from the triangle's third corner `far`: (nx, ny) is the edge's
     unit normal, flipped if it points toward `far` */
  const wing = (p, q, far) => {
    const length = Math.hypot(q[0] - p[0], q[1] - p[1]);
    let nx = (p[1] - q[1]) / length,
      ny = (q[0] - p[0]) / length;
    if ((far[0] - (p[0] + q[0]) / 2) * nx + (far[1] - (p[1] + q[1]) / 2) * ny > 0) {
      nx = -nx;
      ny = -ny;
    }
    return [p, q, [q[0] + nx * h, q[1] + ny * h], [p[0] + nx * h, p[1] + ny * h]];
  };
  return {
    type: "fan",
    a,
    h,
    faces: [
      {
        poly: [
          [0, 0],
          [a, 0],
          [a, h],
          [0, h],
        ],
        col: 1,
      },
      { poly: upper, col: 0 },
      { poly: lower, col: 0 },
      {
        poly: top === "r" ? wing(upper[1], upper[2], upper[0]) : wing(upper[0], upper[2], upper[1]),
        col: 2,
        wing: top,
      },
      {
        poly: bot === "r" ? wing(lower[1], lower[2], lower[0]) : wing(lower[0], lower[2], lower[1]),
        col: 2,
        wing: bot,
      },
    ],
  };
}
/* a row of side rectangles with a base on each end (shared/solids.js netOf). ok: false puts both bases along the top edge */
function stripNet(n, a, h, ok) {
  /* topSide and bottomSide: which rectangles the bases hang from (a bad net's bottom one is flipped onto the top edge) */
  const topSide = R(0, n - 1),
    bottomSide = ok ? R(0, n - 1) : pick([...Array(n).keys()].filter((i) => i !== topSide)),
    net = netOf("prism", n, { a, h, top: topSide, bottom: bottomSide });
  return {
    type: "strip",
    a,
    h,
    faces: net.faces.map((f) => ({
      poly: ok || f.id !== "bottom" ? f.poly : f.poly.map(([x, y]) => [x, h - y]),
      col: f.col,
    })),
  };
}
/* a net turned a quarter turn `quarters` times */
const turnNet = (net, quarters) => ({
  ...net,
  faces: net.faces.map((f) => ({
    ...f,
    poly: f.poly.map((p) => {
      for (let i = 0; i < quarters; i++) p = [-p[1], p[0]];
      return p;
    }),
  })),
});
/* two nets side by side, labeled A and B, at one scale that fits both in 520 by 300 */
function netPairSvg(nets) {
  /* each net's bounds [minX, minY, maxX, maxY]; together they're widthUnits by heightUnits with a gap between */
  const bounds = nets.map((net) => {
    const points = net.faces.flatMap((f) => f.poly),
      xs = points.map((p) => p[0]),
      ys = points.map((p) => p[1]);
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  });
  const gap = 0.9,
    widthUnits = bounds.reduce((total, box) => total + box[2] - box[0], 0) + gap,
    heightUnits = Math.max(...bounds.map((box) => box[3] - box[1])),
    scale = Math.min(520 / widthUnits, 300 / heightUnits),
    top = 36;
  let x = 10,
    markup = "";
  nets.forEach((net, i) => {
    /* each net is centered top to bottom */
    const box = bounds[i],
      left = x,
      netTop = top + ((heightUnits - (box[3] - box[1])) * scale) / 2;
    markup += `<text class="np-lbl" x="${r1d(left + ((box[2] - box[0]) * scale) / 2)}" y="20">${"AB"[i]}</text>`;
    markup += net.faces
      .map(
        (f) =>
          `<polygon class="sd-net${f.col ? "" : " sd-base"}" points="${f.poly.map(([px, py]) => `${r1d(left + (px - box[0]) * scale)},${r1d(netTop + (py - box[1]) * scale)}`).join(" ")}"/>`,
      )
      .join("");
    x += (box[2] - box[0] + gap) * scale;
  });
  return svgOf(
    r1d(x - gap * scale + 10),
    r1d(top + heightUnits * scale + 10),
    markup,
    "Two nets, A and B, drawn at the same scale",
  );
}
/* Do two nets fold into the same prism? The answer (truth): yes, no because one won't fold (fold), or no because their heights
   (h) or bases (a) differ. P and B: the base's shape and name; a, h and a2, h2: the two nets' base sides and heights */
function makeSameNets() {
  const n = pick([3, 3, 3, 4]),
    P = POLYGON[n],
    B = BASE_NAME[n],
    who = pick(NAMES),
    truth = pick(["yes", "yes", "yes", "fold", "fold", "h", "a"]);
  const a = pick([1.2, 1.5]),
    h = pick([1.8, 2.4]),
    a2 = truth === "a" ? (a === 1.2 ? 1.8 : 1) : a,
    h2 = truth === "h" ? (h === 1.8 ? 3 : 1.2) : h,
    bad = truth === "fold" ? pick(["A", "B"]) : null;
  /* a net that folds (ok) or doesn't: a triangular prism's is a fan or a strip, a square prism's a strip */
  const make = (aa, hh, ok) =>
    n === 3 && Math.random() < 0.5
      ? ok
        ? ((t) => fanNet(aa, hh, t, t === "r" ? "l" : "r"))(pick(["l", "r"]))
        : ((t) => fanNet(aa, hh, t, t))(pick(["l", "r"]))
      : stripNet(n, aa, hh, ok);
  const flat = [make(a, h, bad !== "A"), make(a2, h2, bad !== "B")];
  /* net B is turned a random number of quarter turns */
  if (JSON.stringify(flat[0].faces) === JSON.stringify(flat[1].faces)) return makeSameNets(); // net B is never a copy of net A
  const nets = [flat[0], turnNet(flat[1], R(0, 3))];
  /* why a net that won't fold is wrong; choices: each answer, and why it's wrong when another is right */
  const why =
    bad &&
    (flat[bad === "A" ? 0 : 1].type === "fan"
      ? `In net ${bad}, both loose rectangles land on the same side of the prism when it folds, so one side would be left open.`
      : `In net ${bad}, both bases sit along the same edge of the rectangles, so they’d fold onto the same end. The other end would be left open.`);
  const choices = {
    yes: [
      "Yes. They have the same faces, and both fold into the same prism.",
      {
        h: "Compare the rectangles: they’re the same length in both nets.",
        a: "Compare the gold bases: they’re the same size in both nets.",
        fold: `Both nets fold up: each has a base for each end, and one rectangle for each side of the base.`,
      },
    ],
    h: [
      "No. The rectangles are different lengths, so one prism would be taller.",
      {
        yes: "Compare the rectangles. In one net they’re longer, so that prism is taller.",
        a: "The gold bases are the same size. Compare the rectangles.",
        fold: "Both nets fold up. They just fold into different prisms.",
      },
    ],
    a: [
      "No. The bases are different sizes.",
      {
        yes: "Compare the gold bases. One net’s bases are bigger.",
        h: "The rectangles are the same length. Compare the gold bases.",
        fold: "Both nets fold up. They just fold into different prisms.",
      },
    ],
    fold: ["No. One of the nets won’t fold into a closed prism.", { yes: why, h: why, a: why }],
  };
  return {
    ...mcOf(
      Object.keys(choices).map((id) => [choices[id][0], id === truth ? null : choices[truth][1][id]]),
      { stack: true },
    ),
    fig: { svg: () => netPairSvg(nets) },
    nets: { c: truth, bad, flat },
    prompt: `${who} says both nets fold into the same ${B} prism. Do you agree?`,
    hint: `Check each net: a ${B} prism needs a ${P} base on each end, and one rectangle for each side. Then compare the sizes of the pieces.`,
    explain: {
      yes: `Both nets have 2 matching ${P}s and ${n} matching rectangles, and each folds with one base on each end and a rectangle on every side. They fold into the same prism.`,
      h: `Both nets fold into ${an(B)} ${B} prism, but the rectangles in one are longer, so that prism is taller. Not the same prism.`,
      a: `Both nets fold into ${an(B)} ${B} prism, but one net’s bases (and the rectangles around them) are bigger. Not the same prism.`,
      fold: why,
    }[truth],
  };
}
function genNet() {
  const type = pick(["box", "rnet", "rnet", "cube", "tri", "same", "same"]);
  if (type === "same") return makeSameNets();
  const f = new Fig();
  if (type === "cube") {
    /* will it fold into a cube: a good or bad net, turned and maybe flipped */
    const good = Math.random() < 0.5,
      source = good ? pick(CUBE_OK) : pick(CUBE_BAD);
    let cells = (good ? source : source.c).map((p) => p.slice());
    const turns = R(0, 3);
    for (let i = 0; i < turns; i++) cells = cells.map(([x, y]) => [y, -x]);
    if (Math.random() < 0.5) cells = cells.map(([x, y]) => [-x, y]);
    const minX = Math.min(...cells.map((p) => p[0])),
      minY = Math.min(...cells.map((p) => p[1]));
    cells.forEach(([x, y]) => {
      x -= minX;
      y -= minY;
      f.poly([
        [x, y],
        [x + 1, y],
        [x + 1, y + 1],
        [x, y + 1],
      ]);
    });
    return {
      kind: "mc",
      fig: f,
      answer: good ? "yes" : "no",
      choices: [
        { id: "yes", label: "Yes, it folds into a cube" },
        { id: "no", label: "No, faces would overlap" },
      ],
      why: good
        ? {
            no: "Try it: pick one square as the bottom and fold its neighbors up as walls. Every square finds its own face.",
          }
        : { yes: source.why },
      prompt: "Will this net fold up into a cube?",
      hint: "Pick one square to be the bottom. Fold the squares next to it up as walls. Watch for two squares that would land on the same face.",
      explain: good ? "Yes. When it folds, each of the 6 squares covers a different face of the cube." : source.why,
    };
  }
  if (type === "tri") {
    /* the surface area of a 3-4-5 right triangular prism `length` long, from its net */
    const length = R(3, 8),
      SA = 12 + 12 * length;
    f.poly([
      [0, 3],
      [3, 3],
      [3, 3 + length],
      [0, 3 + length],
    ]);
    f.poly([
      [3, 3],
      [7, 3],
      [7, 3 + length],
      [3, 3 + length],
    ]);
    f.poly([
      [7, 3],
      [12, 3],
      [12, 3 + length],
      [7, 3 + length],
    ]);
    f.poly([
      [3, 3],
      [7, 3],
      [3, 0],
    ]);
    f.poly([
      [3, 3 + length],
      [7, 3 + length],
      [3, 6 + length],
    ]);
    f.ra(3, 3, 0, -1, 1, 0);
    f.ra(3, 3 + length, 0, 1, 1, 0);
    f.lbl(1.5, 3 + length + 0.8, 3);
    f.lbl(5, 3.75, 4);
    f.lbl(9.5, 2.2, 5);
    f.lbl(2.15, 1.5, 3);
    f.lbl(5.75, 1.1, 5);
    f.lbl(-0.85, 3 + length / 2, length);
    f.onHint();
    f.poly(
      [
        [0, 3],
        [3, 3],
        [3, 3 + length],
        [0, 3 + length],
      ],
      "fb2",
    );
    f.poly(
      [
        [3, 3],
        [7, 3],
        [7, 3 + length],
        [3, 3 + length],
      ],
      "fb2",
    );
    f.poly(
      [
        [7, 3],
        [12, 3],
        [12, 3 + length],
        [7, 3 + length],
      ],
      "fb2",
    );
    f.poly(
      [
        [3, 3],
        [7, 3],
        [3, 0],
      ],
      "fa",
    );
    f.poly(
      [
        [3, 3 + length],
        [7, 3 + length],
        [3, 6 + length],
      ],
      "fa",
    );
    f.txt(1.5, 3 + length / 2, 3 * length);
    f.txt(5, 3 + length / 2, 4 * length);
    f.txt(9.5, 3 + length / 2, 5 * length);
    f.txt(4.2, 2.1, 6);
    f.txt(4.2, 3.9 + length, 6);
    return {
      kind: "num",
      unit: SQ,
      fig: f,
      answer: SA,
      prompt: "This net folds into a triangular prism. The triangles are right triangles. What is its surface area?",
      hint: "Find the area of all 5 pieces and add them: 3 rectangles plus 2 triangles. Each triangle is ½ × 4 × 3.",
      misc: [
        [6 + 12 * length, "There are two triangles, one at each end."],
        [12 * length, "Don’t forget the two triangle faces."],
        [24 + 12 * length, "Each triangle is ½ × 4 × 3 = 6, not 12."],
      ],
      explain: `Rectangles: ${3 * length} + ${4 * length} + ${5 * length} = ${12 * length}. Triangles: 6 + 6 = 12. Surface area = ${SA} square units.`,
    };
  }
  /* box or rnet: a rectangular prism's surface area, from a drawing or a net */
  const l = R(2, 6),
    w = R(2, 4),
    h = R(2, 5),
    SA = 2 * (l * w + l * h + w * h);
  const misc = [
    [l * w + l * h + w * h, "That covers only 3 faces. A prism has 6: every face has a twin on the opposite side."],
    [l * w * h, "That is the volume (cubes that fill it). Surface area covers the outside."],
  ];
  const explain = `Faces come in pairs: 2×(${l}×${w}) + 2×(${l}×${h}) + 2×(${w}×${h}) = ${2 * l * w} + ${2 * l * h} + ${2 * w * h} = ${SA} square units.`;
  if (type === "box") {
    const depth = box(f, l, w, h, [l, w, h]);
    f.onHint();
    f.txt(l / 2, depth + h / 2, l * h);
    f.txt((l + depth) / 2, depth / 2, l * w);
    f.txt(l + depth / 2, depth / 2 + h / 2, w * h);
    return {
      kind: "num",
      unit: SQ,
      fig: f,
      answer: SA,
      misc,
      explain,
      prompt: "Find the surface area of this rectangular prism.",
      hint: "Each face you can see has a matching face hidden on the opposite side. Find these 3 areas, then double them.",
    };
  }
  /* the net's faces: rectangles [x, y, width, height], their colors (matching faces match), and areas */
  const faces = [
    { r: [w, 0, l, w], c: "fa", a: l * w },
    { r: [w, w, l, h], c: "fb2", a: l * h },
    { r: [w, w + h, l, w], c: "fa", a: l * w },
    { r: [w, 2 * w + h, l, h], c: "fb2", a: l * h },
    { r: [0, w, w, h], c: "fc", a: w * h },
    { r: [w + l, w, w, h], c: "fc", a: w * h },
  ];
  const rect = ([x, y, rw, rh]) => [
    [x, y],
    [x + rw, y],
    [x + rw, y + rh],
    [x, y + rh],
  ];
  faces.forEach((face) => f.poly(rect(face.r)));
  f.lbl(w + l / 2, -0.8, l);
  f.lbl(w - 0.85, w / 2, w);
  f.lbl(-0.85, w + h / 2, h);
  f.onHint();
  faces.forEach((face) => {
    f.poly(rect(face.r), face.c);
    f.txt(face.r[0] + face.r[2] / 2, face.r[1] + face.r[3] / 2, face.a);
  });
  return {
    kind: "num",
    unit: SQ,
    fig: f,
    answer: SA,
    misc,
    explain,
    prompt: "This net folds into a rectangular prism. What is its surface area?",
    hint: "Find the area of each of the 6 rectangles and add them. Matching colors are matching faces.",
  };
}

/* ---------- Zone: polyhedra (Lesson 13) ---------- */
/* Prisms and pyramids, their drawings, curved shapes, and nets come from shared/solids.js. */
const NAMES = ["Tyler", "Priya", "Diego", "Mai", "Han", "Lin", "Noah", "Elena"];
const SOLID_N = [3, 4, 5, 6, 8];
/* "a" or "an" for a word; the word capitalized */
const an = (word) => (/^[aeiou]/.test(word) ? "an" : "a");
const up = (word) => word[0].toUpperCase() + word.slice(1);
/* a prism or pyramid on a regular base; a prism is never as tall as it is wide, so it is never a cube */
const someSolid = (kind = pick(["prism", "pyramid"]), n = pick(SOLID_N)) =>
  solidOf(kind, n, { a: n > 6 ? 1.3 : 2, h: kind === "prism" ? pick([2.6, 3.2]) : 2.8 });
/* the game's figure: a drawing that, with the hint, colors the bases gold and dots every vertex */
const solidPic = (s) => ({ svg: (show) => solidSvg(s, { W: 300, dots: show, bases: show }) });
const HINT_PIC =
  "Gold faces are the bases. Dots mark every vertex (hollow ones are at the back), and dashed lines are edges at the back.";
/* how a prism's or pyramid's faces, edges, or vertices add up */
function howMany(kind, n, what) {
  const P = POLYGON[n] || `${n}-sided`,
    counts = countsOf(kind, n);
  if (kind === "prism")
    return {
      faces: `2 ${P} bases + ${n} rectangles = ${counts.faces} faces`,
      edges: `${n} edges around each base, and ${n} going up the sides: ${n} + ${n} + ${n} = ${counts.edges} edges`,
      vertices: `${n} vertices on each base: ${n} + ${n} = ${counts.vertices} vertices`,
    }[what];
  return {
    faces: `1 ${P} base + ${n} triangles = ${counts.faces} faces`,
    edges: `${n} edges around the base, and ${n} going up to the top: ${n} + ${n} = ${counts.edges} edges`,
    vertices: `${n} vertices around the base, and 1 at the top: ${n} + 1 = ${counts.vertices} vertices`,
  }[what];
}
const MIX = {
  faces: "That’s the number of faces",
  edges: "That’s the number of edges",
  vertices: "That’s the number of vertices",
};
/* the other two counts, as mistakes (leaving out one that is the answer too: a pyramid has as many faces as vertices) */
const mixUps = (counts, what) =>
  Object.keys(counts)
    .filter((other) => other !== what && counts[other] !== counts[what])
    .map((other) => [counts[other], `${MIX[other]}. Count the ${what}.`]);
/* Figure A, Figure B, both, or neither (like the Lesson 13 practice problems): one statement about two polyhedra */
/* what a solid's faces are, in words */
const facesOf = (s) =>
  s.kind === "prism"
    ? `${POLYGON[s.n]}s and rectangles`
    : s.n === 3
      ? "all triangles"
      : `triangles and ${an(POLYGON[s.n])} ${POLYGON[s.n]}`;
/* the statements to choose from for solids A and B: id, weight (how often it's picked), text, test(solid), and why(solid) */
function statementsFor(A, B) {
  const both = [A, B],
    cnt = (s) => countsOf(s.kind, s.n),
    kindWhy = (s) =>
      s.kind === "pyramid"
        ? "it has 1 base, and triangles that meet at a point"
        : "it has 2 matching bases joined by rectangles";
  const L = [
    {
      id: "poly",
      w: 1,
      text: "This figure is a polyhedron.",
      test: () => true,
      why: () => "it’s closed, and every face is a polygon",
    },
    {
      id: "tri",
      w: 3,
      text: "This figure has triangular faces.",
      test: (s) => s.kind === "pyramid" || s.n === 3,
      why: (s) => `its faces are ${facesOf(s)}`,
    },
    {
      id: "moreV",
      w: 1,
      text: "There are more vertices than edges in this figure.",
      test: (s) => cnt(s).vertices > cnt(s).edges,
      why: (s) => `it has ${cnt(s).vertices} vertices and ${cnt(s).edges} edges`,
    },
    { id: "pyr", w: 2, text: "This figure is a pyramid.", test: (s) => s.kind === "pyramid", why: kindWhy },
    { id: "prism", w: 2, text: "This figure is a prism.", test: (s) => s.kind === "prism", why: kindWhy },
    {
      id: "one",
      w: 3,
      text: "There is exactly one face that can be the base for this figure.",
      test: (s) => s.kind === "pyramid" && s.n > 3,
      why: (s) =>
        s.kind === "prism"
          ? "it has 2 bases, one at each end"
          : s.n === 3
            ? "every face is a triangle, so any face can be the base"
            : `only the ${POLYGON[s.n]} can be the base`,
    },
    {
      id: "triBase",
      w: 2,
      text: "The base of this figure is a triangle.",
      test: (s) => s.n === 3,
      why: (s) =>
        s.kind === "prism" ? `its 2 bases are ${POLYGON[s.n]}s` : `its base is ${an(POLYGON[s.n])} ${POLYGON[s.n]}`,
    },
    {
      id: "two",
      w: 3,
      text: "This figure has two identical and parallel faces that can be the base.",
      test: (s) => s.kind === "prism",
      why: (s) =>
        s.kind === "prism"
          ? `its 2 ${POLYGON[s.n]} bases are identical and parallel`
          : "it has only 1 base, and its top is a point",
    },
  ];
  /* a square is a rectangle, so skip rectangles when there's a square pyramid */
  if (!both.some((s) => s.kind === "pyramid" && s.n === 4))
    L.push({
      id: "rect",
      w: 3,
      text: "This figure has rectangular faces.",
      test: (s) => s.kind === "prism",
      why: (s) => `its faces are ${facesOf(s)}`,
    });
  /* a count that's right for one of them; a face shape one of them has (more than 3 sides) */
  const what = pick(["faces", "edges", "vertices"]),
    k = cnt(pick(both))[what];
  L.push({
    id: "count",
    what,
    k,
    w: 3,
    text: `This figure has ${k} ${what}.`,
    test: (s) => cnt(s)[what] === k,
    why: (s) => `it has ${cnt(s)[what]} ${what}`,
  });
  const m = both.map((s) => s.n).filter((v) => v > 3);
  if (m.length) {
    const v = pick(m);
    L.push({
      id: "face",
      m: v,
      w: 2,
      text: `This figure has ${an(POLYGON[v])} ${POLYGON[v]} face.`,
      test: (s) => s.n === v,
      why: (s) => `its faces are ${facesOf(s)}`,
    });
  }
  return L;
}
/* Figure A, Figure B, both, or neither: two solids (the same base, or not) and one statement, picked by weight */
function makeAB() {
  const all = SOLID_N.filter((n) => n <= 6).flatMap((n) => ["prism", "pyramid"].map((k) => [k, n])),
    first = pick(all);
  const second =
    Math.random() < 0.4
      ? [first[0] === "prism" ? "pyramid" : "prism", first[1]]
      : pick(all.filter(([k, n]) => k !== first[0] || n !== first[1]));
  const [A, B] = shuffle([first, second]).map(([k, n]) => someSolid(k, n)),
    L = statementsFor(A, B);
  /* each statement appears its weight's number of times, so the pick favors the higher weights */
  const statement = L.flatMap((x) => Array(x.w).fill(x))[R(0, L.reduce((t, x) => t + x.w, 0) - 1)],
    truth = [A, B].map(statement.test);
  const answer = truth[0] && truth[1] ? "both" : truth[0] ? "A" : truth[1] ? "B" : "neither";
  const says = { A: [1, 0], B: [0, 1], both: [1, 1], neither: [0, 0] },
    fig = [A, B];
  const line = (i, yes) =>
    `Figure ${"AB"[i]} is ${an(fig[i].name)} ${fig[i].name}: ${yes ? "yes" : "no"}, ${statement.why(fig[i])}.`;
  const why = {};
  Object.keys(says).forEach((c) => {
    if (c !== answer)
      why[c] = [0, 1]
        .filter((i) => !!says[c][i] !== truth[i])
        .map((i) => line(i, truth[i]))
        .join(" ");
  });
  return {
    kind: "mc",
    answer,
    why,
    choices: [
      { id: "A", label: "Figure A only" },
      { id: "B", label: "Figure B only" },
      { id: "both", label: "Both" },
      { id: "neither", label: "Neither" },
    ],
    fig: {
      svg: (show) =>
        `<div class="pair">${fig.map((s, i) => `<figure>${solidSvg(s, { W: 200, dots: show, bases: show })}<figcaption>${"AB"[i]}</figcaption></figure>`).join("")}</div>`,
    },
    ab: {
      solids: fig.map((s) => ({ kind: s.kind, n: s.n })),
      st: { id: statement.id, k: statement.k, what: statement.what, m: statement.m },
    },
    prompt: `Does this describe Figure A, Figure B, both, or neither?<br><b>“${statement.text}”</b>`,
    hint: HINT_PIC + " Decide for each figure on its own: is it a prism or a pyramid, and what shape is its base?",
    explain: `${line(0, truth[0])} ${line(1, truth[1])}`,
  };
}
function genSolid() {
  const type = pick([
    "count",
    "count",
    "count",
    "name",
    "name",
    "rule",
    "not",
    "why",
    "net",
    "tyler",
    "ab",
    "ab",
    "ab",
  ]);
  if (type === "ab") return makeAB();
  if (type === "count") {
    /* count the faces, edges, or vertices in a drawing */
    const s = someSolid(),
      { kind, n } = s,
      what = pick(["faces", "edges", "vertices"]),
      counts = countsOf(kind, n),
      seen = seenOf(s);
    /* a drawing may show every vertex: leave out the hidden-vertex mistake then */
    const others = mixUps(counts, what);
    const miss = {
      faces: [
        [seen.faces, "That’s the faces you can see. Count the ones at the back and on the bottom too."],
        [
          n,
          kind === "prism"
            ? "Those are the rectangles around the side. Add the 2 bases."
            : "Those are the triangles. Add the base.",
        ],
      ],
      edges: [
        [seen.edges, "Count the dashed edges at the back too."],
        kind === "prism"
          ? [2 * n, `Don’t forget the ${n} edges going up the sides.`]
          : [n, `That’s just the edges around the base. Add the ${n} going up to the top.`],
      ],
      vertices: [
        ...(seen.vertices !== counts.vertices ? [[seen.vertices, "Count the hidden vertices at the back too."]] : []),
        kind === "prism"
          ? [n, `That’s one base. The other base has ${n} vertices too.`]
          : [n, "Don’t forget the vertex at the top."],
      ],
    }[what];
    return {
      kind: "num",
      unit: what,
      fig: solidPic(s),
      answer: counts[what],
      solid: s,
      prompt: `How many ${what} does this ${s.name} have?`,
      misc: miscOf(counts[what], [...miss, ...others]),
      hint:
        HINT_PIC +
        (what === "faces" ? " Count the bases, then the faces around the side." : " Count around one base first."),
      explain: `A ${s.name} has ${howMany(kind, n, what)}.`,
    };
  }
  if (type === "name") {
    /* name it by its base: never "rectangular prism" for a square prism, or "triangular pyramid" for one that is */
    const s = someSolid(),
      { kind, n } = s,
      other = kind === "prism" ? "pyramid" : "prism",
      nearby = SOLID_N.filter((m) => m !== n && Math.abs(m - n) <= 2);
    const list = [
      [s.name, null],
      [
        `${BASE_NAME[n]} ${other}`,
        kind === "prism"
          ? `A pyramid has one base, and triangles that meet at a point. This one has 2 bases joined by rectangles.`
          : `A prism has 2 matching bases joined by rectangles. This one has 1 base, and triangles that meet at a point.`,
      ],
      [
        `${BASE_NAME[pick(nearby)]} ${kind}`,
        `Count the sides of the gold base: ${n}. It’s ${an(POLYGON[n])} ${POLYGON[n]}.`,
      ],
    ];
    if (kind === "pyramid" && n !== 3)
      list.push([
        "triangular pyramid",
        `The triangles are its sides. A pyramid is named for its base, and the base is ${an(POLYGON[n])} ${POLYGON[n]}.`,
      ]);
    if (kind === "prism" && n !== 4)
      list.push([
        "rectangular prism",
        `The rectangles are its sides. A prism is named for its bases, and the bases are ${POLYGON[n]}s.`,
      ]);
    return {
      ...mcOf(
        list
          .filter(([label], i) => list.findIndex(([other]) => other === label) === i)
          .slice(0, 4)
          .map(([label, why]) => [up(label), why]),
      ),
      fig: { svg: () => solidSvg(s, { W: 300, bases: true }) },
      solid: s,
      prompt: "What is this polyhedron called? The gold faces are its bases.",
      hint: `How many bases does it have: 1 or 2? And how many sides does a base have?`,
      explain:
        kind === "prism"
          ? `2 matching ${POLYGON[n]} bases joined by ${n} rectangles: it’s ${an(s.name)} ${s.name}.`
          : `1 ${POLYGON[n]} base, and ${n} triangles that meet at a point: it’s ${an(s.name)} ${s.name}.`,
    };
  }
  if (type === "rule") {
    /* bases with more sides than can be drawn nicely: find the pattern */
    const kind = pick(["prism", "pyramid"]),
      n = R(7, 12),
      what = pick(["faces", "edges", "vertices"]),
      counts = countsOf(kind, n);
    const say =
      kind === "prism"
        ? `A prism has two bases, and each base has ${n} sides.`
        : `A pyramid has a base with ${n} sides.`;
    const miss = {
      faces:
        kind === "prism"
          ? [
              [n, "Those are the rectangles around the side. Add the 2 bases."],
              [n + 1, "A prism has 2 bases, not 1."],
            ]
          : [
              [n, "Those are the triangles. Add the base."],
              [n + 2, "A pyramid has only 1 base."],
            ],
      edges:
        kind === "prism"
          ? [
              [2 * n, `That’s the edges around the 2 bases. Add the ${n} going up the sides.`],
              [n, "That’s one base. There are more edges."],
            ]
          : [
              [n, `That’s the edges around the base. Add the ${n} going up to the top.`],
              [3 * n, "That’s a prism. A pyramid has one base and edges up to one point."],
            ],
      vertices:
        kind === "prism"
          ? [
              [n, `That’s one base. The other base has ${n} too.`],
              [n + 1, "That’s a pyramid. A prism has 2 bases and no top point."],
            ]
          : [
              [n, "Don’t forget the vertex at the top."],
              [2 * n, "That’s a prism. A pyramid has one base and a single top vertex."],
            ],
    }[what];
    return {
      kind: "num",
      unit: what,
      fig: null,
      answer: counts[what],
      prompt: `${say} How many ${what} does it have?`,
      misc: miscOf(counts[what], [...miss, ...mixUps(counts, what)]),
      hint:
        kind === "prism"
          ? "Picture a pentagonal prism: 2 pentagons joined by 5 rectangles. Now use this base instead."
          : "Picture a pentagonal pyramid: 1 pentagon, and 5 triangles meeting at the top. Now use this base instead.",
      explain: `It has ${howMany(kind, n, what)}.`,
    };
  }
  if (type === "not") {
    /* pictures: one shape that isn't a polyhedron among polyhedra, or the other way around */
    const odd = Math.random() < 0.5,
      curvedKinds = shuffle(["cylinder", "cone", "sphere", "open"]),
      pic = (html, w) => html.replace(/style="max-width:[\d.]+px"/, `style="max-width:${w}px"`);
    const solids = shuffle(SOLID_N.flatMap((n) => ["prism", "pyramid"].map((k) => [k, n])))
      .slice(0, 3)
      .map(([k, n]) => someSolid(k, n));
    const polyChoice = (s) => [
      pic(solidSvg(s, { W: 150 }), 120),
      `That’s ${an(s.name)} ${s.name}: it’s closed, and every face is a polygon.`,
    ];
    const curvedChoice = (k) => [
      pic(curvedSvg(k, { W: 150 }), 110),
      `That’s ${an(CURVED[k].name)} ${CURVED[k].name}. ${CURVED[k].why}`,
    ];
    if (odd) {
      const k = curvedKinds[0];
      return {
        ...mcOf([[curvedChoice(k)[0], null], ...solids.map(polyChoice)]),
        fig: null,
        prompt: "Which shape is <b>not</b> a polyhedron?",
        hint: "A polyhedron is closed, and every face is a polygon: flat, with straight sides. Look for a curved surface or a missing face.",
        explain: `The ${CURVED[k].name} isn’t a polyhedron. ${CURVED[k].why}`,
      };
    }
    const s = solids[0];
    return {
      ...mcOf([[polyChoice(s)[0], null], ...curvedKinds.slice(0, 3).map(curvedChoice)]),
      fig: null,
      prompt: "Which shape <b>is</b> a polyhedron?",
      hint: "A polyhedron is closed, and every face is a polygon: flat, with straight sides.",
      explain: `The ${s.name} is a polyhedron: it’s closed, and all ${s.F.length} of its faces are polygons.`,
    };
  }
  if (type === "why") {
    /* why a curved or open shape isn't a polyhedron */
    const k = pick(["cylinder", "cone", "sphere", "open"]),
      C = CURVED[k];
    const list =
      k === "open"
        ? [
            [C.why, null],
            ["Its faces are curved.", "Its faces are flat rectangles. The problem is the missing lid."],
            [
              "It has too few faces.",
              "Some polyhedra have only 4 faces. What matters is that it’s closed and every face is a polygon.",
            ],
          ]
        : [
            [C.why, null],
            [
              "It isn’t closed.",
              `A ${C.name} is closed: it has no gaps or missing faces. The problem is that it’s curved.`,
            ],
            [
              "It has too few faces.",
              "Some polyhedra have only 4 faces. What matters is that every face is a flat polygon.",
            ],
          ];
    return {
      ...mcOf(list, { stack: true }),
      fig: { svg: () => curvedSvg(k, { W: 200 }) },
      prompt: `Why isn’t ${an(C.name)} ${C.name} a polyhedron?`,
      hint: "A polyhedron is closed, and every face is a polygon: flat, with straight sides.",
      explain: `${C.why} A polyhedron has to be closed, with every face a polygon.`,
    };
  }
  if (type === "net") {
    /* which polyhedron a net folds into */
    const kind = pick(["prism", "pyramid"]),
      n = pick(SOLID_N),
      s = someSolid(kind, n),
      other = kind === "prism" ? "pyramid" : "prism",
      m = pick(SOLID_N.filter((v) => v !== n && Math.abs(v - n) <= 2));
    const net = netOf(kind, n, {
      a: n > 6 ? 1 : 1.4,
      h: kind === "prism" ? 2 : 1.8,
      top: R(0, n - 1),
      bottom: R(0, n - 1),
    });
    const shapes = kind === "prism" ? `2 ${POLYGON[n]}s and ${n} rectangles` : `1 ${POLYGON[n]} and ${n} triangles`;
    return {
      ...mcOf([
        [`${up(an(s.name))} ${s.name}`, null],
        [
          `${up(an(BASE_NAME[n]))} ${BASE_NAME[n]} ${other}`,
          kind === "prism"
            ? "A pyramid’s net has 1 base and triangles. This one has 2 bases and rectangles."
            : "A prism’s net has 2 bases and rectangles. This one has 1 base and triangles.",
        ],
        [
          `${up(an(BASE_NAME[m]))} ${BASE_NAME[m]} ${kind}`,
          `Count the ${kind === "prism" ? "rectangles" : "triangles"}: ${n}, one for each side of the base. So the base is ${an(POLYGON[n])} ${POLYGON[n]}.`,
        ],
      ]),
      fig: { svg: () => netFig(net, { W: 320 }) },
      solid: s,
      prompt: "What polyhedron does this net fold into?",
      hint: "Count the bases (the gold faces) and the shapes around them. A prism’s net has 2 bases and rectangles; a pyramid’s has 1 base and triangles.",
      explain: `The net has ${shapes}, so it folds into ${an(s.name)} ${s.name}.`,
    };
  }
  /* Tyler's question: a prism's side faces don't have to match its bases */
  const n = pick([3, 4, 5, 6]),
    P = POLYGON[n],
    B = BASE_NAME[n],
    who = pick(NAMES),
    net = netOf("prism", n, { a: 1, h: pick([1.8, 2.2, 2.6]), top: R(0, n - 1), bottom: R(0, n - 1) });
  return {
    ...mcOf(
      [
        [`No. Only the 2 bases have to be ${P}s. The faces around the side are rectangles.`, null],
        [
          `Yes. Every face of ${an(B)} ${B} prism is ${an(P)} ${P}.`,
          `Only the 2 bases are ${P}s. A prism’s side faces are rectangles${n === 4 ? ", and only in a cube are they squares too" : ""}.`,
        ],
        [
          `Yes. It has rectangles, so it’s a rectangular prism.`,
          n === 4
            ? "It is a rectangular prism too, since a square is a rectangle. But its bases are squares, so it’s also a square prism."
            : `A rectangular prism has rectangle bases. This one’s bases are ${P}s.`,
        ],
      ],
      { stack: true },
    ),
    fig: { svg: () => netFig(net, { W: 300 }) },
    prompt: `${who} says this net can’t fold into ${an(B)} ${B} prism, because not all its faces are ${P}s. Do you agree?`,
    hint: `Which faces are the bases? A prism is named for its bases. What shape are the faces around the side?`,
    explain: `The 2 gold ${P}s are the bases, and ${n} rectangles wrap around the side. It folds into ${an(B)} ${B} prism, so ${who} is wrong.`,
  };
}

/* ---------- Zone 5: squares & cubes ---------- */
/* things to measure: [what, unit, dimensions (1 length, 2 area, 3 volume)] */
const UNIT_Q = [
  ["the length of a fence around a garden", "ft", 1],
  ["the carpet covering a bedroom floor", "ft", 2],
  ["the sand that fills a sandbox", "ft", 3],
  ["the wrapping paper covering a gift box", "in", 2],
  ["the space inside a cereal box", "in", 3],
  ["the height of a bookshelf", "in", 1],
  ["the paint covering a wall", "m", 2],
  ["the water filling a swimming pool", "m", 3],
];
const DIM_MSG = {
  1: "That measures length: a distance in one direction.",
  2: "Square units measure area: a flat surface to cover.",
  3: "Cubic units measure volume: space that gets filled.",
};
function genCube() {
  const type = pick(["sq", "cu", "sqroot", "cubeSA", "cubeSA", "cuberoot", "units", "expr"]);
  const f = new Fig();
  if (type === "sq" || type === "sqroot") {
    /* n squared, or the side of a square from its area */
    /* not 2 squared (2 × 2 = 2 + 2 = 4) or the side of 16 (16 ÷ 4 = 4) */
    let n;
    do n = type === "sq" ? R(2, 12) : R(3, 11);
    while (n === (type === "sq" ? 2 : 4));
    f.poly([
      [0, 0],
      [n, 0],
      [n, n],
      [0, n],
    ]);
    f.lbl(n / 2, n + 0.8, type === "sq" ? n : "?", type === "sq" ? "" : "q");
    if (type === "sq")
      return {
        kind: "num",
        unit: "",
        fig: f,
        answer: n * n,
        prompt: `What is ${n}<sup>2</sup>?`,
        hint: `${n}<sup>2</sup> is the area of a square with side ${n}. Count the grid squares, or multiply ${n} × ${n}.`,
        misc: [
          [2 * n, `${n}<sup>2</sup> means ${n} × ${n}, not ${n} × 2.`],
          [n + 2, `The small 2 means multiply ${n} by itself.`],
        ],
        explain: `${n}<sup>2</sup> = ${n} × ${n} = ${n * n}. It’s the area of a square with side ${n}.`,
      };
    return {
      kind: "num",
      unit: "units",
      fig: f,
      answer: n,
      prompt: `A square has an area of ${n * n} square units. How long is each side?`,
      hint: `Look for the number that, times itself, makes ${n * n}.`,
      misc: [
        [(n * n) / 2, `Area is side × side. Find the number that times itself makes ${n * n}.`],
        [(n * n) / 4, "Dividing by 4 works for perimeter, not area."],
      ],
      explain: `${n} × ${n} = ${n * n}, so each side is ${n} units.`,
    };
  }
  if (type === "cu" || type === "cuberoot") {
    /* n cubed, or the edge of a cube from its volume */
    const n = R(2, 5);
    const V = n ** 3;
    box(f, n, n, n, [type === "cu" ? n : "?", null, null]);
    if (type === "cu")
      return {
        kind: "num",
        unit: "",
        fig: f,
        answer: V,
        prompt: `What is ${n}<sup>3</sup>?`,
        hint: `${n}<sup>3</sup> is the volume of a cube with edge ${n}: ${n} × ${n} × ${n}.`,
        misc: [
          [3 * n, `${n}<sup>3</sup> means ${n} × ${n} × ${n}, not ${n} × 3.`],
          [n * n, `That is ${n}<sup>2</sup>. Cubed means one more factor of ${n}.`],
        ],
        explain: `${n}<sup>3</sup> = ${n} × ${n} × ${n} = ${V}. It’s the volume of a cube with edge ${n}.`,
      };
    return {
      kind: "num",
      unit: "units",
      fig: f,
      answer: n,
      prompt: `A cube has a volume of ${V} cubic units. How long is each edge?`,
      hint: `Look for the number that, multiplied by itself 3 times, makes ${V}.`,
      misc: [[V / 3, `Volume is edge × edge × edge. Find the number used 3 times as a factor.`]],
      explain: `${n} × ${n} × ${n} = ${V}, so each edge is ${n} units.`,
    };
  }
  if (type === "cubeSA") {
    /* a cube's surface area */
    /* not an edge of 6, where the volume (6 × 6 × 6) is also the surface area (6 · 6²) */
    let s;
    do s = R(2, 9);
    while (s === 6);
    const depth = box(f, s, s, s, [s, null, null]);
    f.onHint();
    f.txt(s / 2, depth + s / 2, s * s);
    f.txt((s + depth) / 2, depth / 2, s * s);
    f.txt(s + depth / 2, depth / 2 + s / 2, s * s);
    return {
      kind: "num",
      unit: SQ,
      fig: f,
      answer: 6 * s * s,
      prompt: `Find the surface area of a cube with edges of ${s} units.`,
      hint: `A cube has 6 identical square faces. Each face is ${s} × ${s}.`,
      misc: [
        [s ** 3, "That is the volume. Surface area covers the 6 square faces."],
        [4 * s * s, "A cube has 6 faces, not 4."],
        [s * s, "That is just one face. A cube has 6."],
        [6 * s, `Each face is ${s} × ${s} = ${s * s}. Multiply that by 6.`],
      ],
      explain: `One face: ${s} × ${s} = ${s * s}. Six faces: 6 × ${s * s} = ${6 * s * s} square units. (You can write it 6 · ${s}<sup>2</sup>.)`,
    };
  }
  if (type === "units") {
    /* which unit fits: length, area, or volume */
    const [what, unit, dim] = pick(UNIT_Q);
    const labels = [unit, unit + "<sup>2</sup>", unit + "<sup>3</sup>"];
    const why = {};
    [1, 2, 3].forEach((d) => {
      if (d !== dim) why["d" + d] = DIM_MSG[d];
    });
    return {
      kind: "mc",
      fig: null,
      answer: "d" + dim,
      choices: [1, 2, 3].map((d) => ({ id: "d" + d, label: labels[d - 1] })),
      why,
      prompt: `Which unit fits <b>${what}</b>?`,
      hint: "Is it a distance (length), a surface to cover (area), or a space to fill (volume)?",
      explain: DIM_MSG[dim] + ` So use ${labels[dim - 1]}.`,
    };
  }
  /* expr: repeated multiplication as an exponent */
  let n = R(2, 9),
    k = R(3, 4);
  if (n === k) n++;
  const prod = Array(k).fill(n).join(" × ");
  const choices = shuffle([
    { id: "a", label: `${n}<sup>${k}</sup>` },
    { id: "b", label: `${k}<sup>${n}</sup>` },
    { id: "c", label: `${n} × ${k}` },
    { id: "d", label: `${n * k}` },
  ]);
  return {
    kind: "mc",
    fig: null,
    answer: "a",
    choices,
    why: {
      b: "The big number is what gets multiplied. The small raised number counts how many times.",
      c: `${n} × ${k} is ${n} added ${k} times. Repeated multiplication uses an exponent.`,
      d: `${n * k} is ${n} × ${k}. The expression multiplies ${n} by itself.`,
    },
    prompt: `Which means the same as ${prod}?`,
    hint: `Count how many times ${n} is used as a factor. That count becomes the small raised number.`,
    explain: `${n} is multiplied ${k} times, so it’s ${n}<sup>${k}</sup> = ${n ** k}.`,
  };
}

/* ---------- Zone 6: frame & subtract (shape inside a rectangle) ---------- */
/* the pieces' colors, in order */
const PCLS = ["fa", "fb2", "fc", "fd"];
/* a piece cut off the rectangle: its corners, its two legs along the grid (h, v), its kind ('tri', 'rect', or 'base': a
   triangle on the rectangle's edge), and its area */
const piece = (pts, h, v, kind = "tri") => ({ pts, legs: [h, v], kind, area: kind === "rect" ? h * v : (h * v) / 2 });
/* a piece's area as worked: "3 × 4 ÷ 2 = 6" */
const pieceWork = (q) =>
  q.kind === "rect"
    ? `${q.legs[0]} × ${q.legs[1]} = ${fmt(q.area)}`
    : `${q.legs[0]} × ${q.legs[1]} ÷ 2 = ${fmt(q.area)}`;
/* the center of a polygon (the average of its corners), for a label */
const cen = (P) => [P.reduce((s, p) => s + p[0], 0) / P.length, P.reduce((s, p) => s + p[1], 0) / P.length];
/* a polygon's area by the shoelace formula: half the sum of each side's cross product (x1 y2 − x2 y1), which counts the
   area swept from the origin, with the sign taken off */
function shoelace(p) {
  let s = 0;
  for (let i = 0; i < p.length; i++) {
    const [x1, y1] = p[i],
      [x2, y2] = p[(i + 1) % p.length];
    s += x1 * y2 - x2 * y1;
  }
  return Math.abs(s) / 2;
}
/* the lengths along each side of the W by H rectangle, split wherever a corner of the shape sh touches that side */
function sideLabels(f, W, H, sh) {
  /* put(middle, length) for each gap between the sorted values */
  const seg = (vals, put) => {
    vals = [...new Set(vals)].sort((a, b) => a - b);
    for (let i = 0; i < vals.length - 1; i++) put((vals[i] + vals[i + 1]) / 2, vals[i + 1] - vals[i]);
  };
  seg([0, W, ...sh.filter((p) => p[1] === 0).map((p) => p[0])], (m, v) => f.lbl(m, -0.8, v));
  seg([0, W, ...sh.filter((p) => p[1] === H).map((p) => p[0])], (m, v) => f.lbl(m, H + 0.8, v));
  seg([0, H, ...sh.filter((p) => p[0] === 0).map((p) => p[1])], (m, v) => f.lbl(-0.85, m, v));
  seg([0, H, ...sh.filter((p) => p[0] === W).map((p) => p[1])], (m, v) => f.lbl(W + 0.85, m, v));
}
/* A shape inside a W by H rectangle, with the pieces around it that get subtracted. kind: corner (a triangle touching three
   sides), edge (a triangle with two corners on the left and right sides), quad or psym (a quadrilateral with a corner on each
   side; psym a parallelogram), para (a parallelogram across the full height), or dent (a dart with a notch up from the bottom).
   Returns {W, H, name, shape, pieces, extra?, notch?}, or null when the numbers don't work. */
function shapeOf(t) {
  if (t === "corner") {
    const W = R(6, 11),
      H = R(4, 8),
      b = R(1, W - 1),
      c = R(1, H - 1),
      A = [0, H],
      B = [b, 0],
      C = [W, c];
    return {
      W,
      H,
      name: "triangle",
      shape: [A, B, C],
      pieces: [piece([A, [0, 0], B], b, H), piece([B, [W, 0], C], W - b, c), piece([C, [W, H], A], W, H - c)],
    };
  }
  if (t === "edge") {
    const W = R(6, 11),
      H = R(5, 8),
      a = R(1, H - 2);
    let c = R(1, H - 2);
    if (c === a) c = a === 1 ? 2 : a - 1;
    const b = R(1, W - 1),
      A = [0, a],
      B = [b, 0],
      C = [W, c],
      lo = Math.max(a, c);
    const tri = a < c ? piece([A, [0, lo], C], W, lo - a) : piece([C, [W, lo], A], W, lo - c);
    return {
      W,
      H,
      name: "triangle",
      shape: [A, B, C],
      pieces: [
        piece([A, [0, 0], B], b, a),
        piece([B, [W, 0], C], W - b, c),
        tri,
        piece(
          [
            [0, lo],
            [W, lo],
            [W, H],
            [0, H],
          ],
          W,
          H - lo,
          "rect",
        ),
      ],
    };
  }
  if (t === "quad" || t === "psym") {
    let W,
      H,
      p,
      q,
      r,
      s,
      name = "quadrilateral";
    if (t === "psym") {
      W = R(6, 11);
      H = R(5, 8);
      p = R(1, W - 1);
      q = R(1, H - 1);
      r = W - p;
      s = H - q;
      name = "parallelogram";
    } else if (Math.random() < 0.4) {
      const n = R(5, 9),
        k = R(1, n - 1);
      W = H = n;
      p = q = k;
      r = s = n - k;
      name = "square";
    } else {
      W = R(6, 11);
      H = R(5, 8);
      p = R(1, W - 1);
      q = R(1, H - 1);
      r = R(1, W - 1);
      s = R(1, H - 1);
    }
    const P1 = [p, 0],
      P2 = [W, q],
      P3 = [r, H],
      P4 = [0, s];
    return {
      W,
      H,
      name,
      shape: [P1, P2, P3, P4],
      pieces: [
        piece([P1, [W, 0], P2], W - p, q),
        piece([P2, [W, H], P3], W - r, H - q),
        piece([P3, [0, H], P4], r, H - s),
        piece([P4, [0, 0], P1], p, s),
      ],
    };
  }
  if (t === "para") {
    const W = R(6, 11),
      H = R(3, 7),
      p = R(1, W - 3),
      A = [0, H],
      B = [W - p, H],
      C = [W, 0],
      D = [p, 0];
    return {
      W,
      H,
      name: "parallelogram",
      shape: [A, B, C, D],
      pieces: [piece([A, [0, 0], D], p, H), piece([B, [W, H], C], p, H)],
      extra: `Check: base ${W - p} × height ${H} = ${(W - p) * H}. Same answer!`,
    };
  }
  if (t === "dent") {
    const W = R(6, 11),
      H = R(4, 8),
      m2 = R(1, W - 1),
      d = R(1, H - 2);
    const ok = [];
    for (let m = 1; m < W; m++) if (m > (m2 * d) / H + 0.01 && m < W - ((W - m2) * d) / H - 0.01) ok.push(m);
    if (!ok.length) return null;
    const m = pick(ok);
    return {
      W,
      H,
      name: "shape",
      shape: [
        [0, 0],
        [m, d],
        [W, 0],
        [m2, H],
      ],
      notch: [[m, d], [m, 0], d],
      pieces: [
        piece(
          [
            [0, 0],
            [W, 0],
            [m, d],
          ],
          W,
          d,
          "base",
        ),
        piece(
          [
            [0, 0],
            [0, H],
            [m2, H],
          ],
          m2,
          H,
        ),
        piece(
          [
            [W, 0],
            [W, H],
            [m2, H],
          ],
          W - m2,
          H,
        ),
      ],
    };
  }
  return null;
}
/* The figure for shapeOf's shape: flipped and maybe turned at random, with the side lengths, the lettered pieces (in the build
   layer), and each piece's area (in the hint). Returns {f, R: the rectangle's area, ans: the shape's area}, or null when
   subtracting the pieces doesn't give the shape's real area. */
function frameFig(s) {
  const { W, H } = s,
    flipX = Math.random() < 0.5,
    flipY = Math.random() < 0.5,
    turn = Math.random() < 0.5;
  const T = ([x, y]) => {
    if (flipX) x = W - x;
    if (flipY) y = H - y;
    return turn ? [y, x] : [x, y];
  };
  const W2 = turn ? H : W,
    H2 = turn ? W : H,
    sh = s.shape.map(T);
  s.pieces.forEach((q, i) => {
    q.P = q.pts.map(T);
    q.k = "ABCD"[i];
  });
  const rectArea = W * H,
    piecesArea = s.pieces.reduce((a, q) => a + q.area, 0),
    ans = rectArea - piecesArea;
  if (ans <= 0 || Math.abs(shoelace(sh) - ans) > 0.01) return null;
  const f = new Fig();
  f.poly(
    [
      [0, 0],
      [W2, 0],
      [W2, H2],
      [0, H2],
    ],
    "frame",
  );
  f.poly(sh, "shape solid");
  /* the notch's height, labeled beside it */
  if (s.notch) {
    const a = T(s.notch[0]),
      b = T(s.notch[1]),
      v = a[0] === b[0];
    f.line(a[0], a[1], b[0], b[1], "hgt");
    f.lbl((a[0] + b[0]) / 2 + (v ? 0.8 : 0), (a[1] + b[1]) / 2 + (v ? 0 : 0.8), s.notch[2], "h");
  }
  sideLabels(f, W2, H2, sh);
  f.on("build");
  s.pieces.forEach((q, i) => f.poly(q.P, "pc " + PCLS[i], `data-k="${q.k}"`));
  s.pieces.forEach((q) => f.lbl(...cen(q.P), q.k, "letter"));
  f.onHint();
  s.pieces.forEach((q, i) => f.poly(q.P, PCLS[i]));
  s.pieces.forEach((q) => f.lbl(...cen(q.P), `${q.k}: ${fmt(q.area)}`, "letter"));
  return { f, R: rectArea, ans };
}
/* the worked answer, a line at a time */
function frameWork(s, fr) {
  return [
    `Rectangle: ${s.W} × ${s.H} = ${fr.R}`,
    ...s.pieces.map((q) => `${q.k}: ${pieceWork(q)}`),
    `Shape: ${fr.R} − ${s.pieces.map((q) => fmt(q.area)).join(" − ")} = ${fmt(fr.ans)}`,
  ];
}
/* Worked lines with one mistake in them: a triangle not halved, a leg that's the whole side, the rectangle's area wrong, or
   the last subtraction wrong. Returns {all: the lines, bad: the first wrong line, why}, or null when no mistake fits. */
function spotLines(s, fr) {
  const P = s.pieces;
  for (const mistake of shuffle(["halve", "halve", "leg", "rect", "final"])) {
    let rc = fr.R,
      rLine = `Rectangle: ${s.W} × ${s.H} = ${fr.R}`,
      bad,
      why;
    const vals = P.map((q) => q.area),
      lines = P.map((q) => `${q.k}: ${pieceWork(q)}`);
    if (mistake === "rect") {
      rc = fr.R + pick([s.W, s.H]);
      rLine = `Rectangle: ${s.W} × ${s.H} = ${rc}`;
      bad = 0;
      why = `${s.W} × ${s.H} is ${fr.R}, not ${rc}.`;
    } else if (mistake === "halve" || mistake === "leg") {
      const i = pick(P.map((q, j) => j).filter((j) => P[j].kind !== "rect")),
        q = P[i];
      if (mistake === "halve") {
        vals[i] = q.legs[0] * q.legs[1];
        lines[i] = `${q.k}: ${q.legs[0]} × ${q.legs[1]} = ${vals[i]}`;
        why = `Piece ${q.k} is a triangle, so it needs ÷ 2. It should be ${fmt(q.area)}.`;
      } else {
        const full = [s.W, s.H],
          j = pick([0, 1]);
        if (q.legs[j] === full[j]) continue;
        const L = q.legs.slice();
        L[j] = full[j];
        vals[i] = (L[0] * L[1]) / 2;
        lines[i] = `${q.k}: ${L[0]} × ${L[1]} ÷ 2 = ${fmt(vals[i])}`;
        why = `Piece ${q.k} used ${full[j]}, the whole side of the rectangle. Its side is only ${q.legs[j]}, so it should be ${fmt(q.area)}.`;
      }
      bad = i + 1;
    }
    let fin = rc - vals.reduce((a, b) => a + b, 0);
    if (mistake === "final") {
      fin = fr.ans + pick([-3, -2, 2, 3, 5]);
      bad = P.length + 1;
      why = `${fr.R} − ${P.map((q) => fmt(q.area)).join(" − ")} is ${fmt(fr.ans)}, not ${fmt(fin)}.`;
    }
    if (fin <= 0) continue;
    return { all: [rLine, ...lines, `Shape: ${rc} − ${vals.map(fmt).join(" − ")} = ${fmt(fin)}`], bad, why };
  }
  return null;
}
/* reverse: the rectangle's width, from the area of the parallelogram in it (base, height H) and one corner triangle's width p */
function makeReverse() {
  /* not when area − corner width happens to be the width too (height 3, base 3, corner 3) */
  let H, p, base;
  do {
    H = R(3, 6);
    p = R(1, 4);
    base = R(3, 7);
  } while (base * H - p === base + p);
  const W = base + p,
    A = base * H,
    f = new Fig();
  f.poly(
    [
      [0, 0],
      [W, 0],
      [W, H],
      [0, H],
    ],
    "frame",
  );
  f.poly(
    [
      [0, H],
      [base, H],
      [W, 0],
      [p, 0],
    ],
    "shape solid",
  );
  f.lbl(-0.85, H / 2, H);
  f.lbl(p / 2, -0.8, p);
  f.lbl(W / 2, H + 0.8, "?", "q");
  f.onHint();
  f.poly(
    [
      [0, H],
      [0, 0],
      [p, 0],
    ],
    "fb2",
  );
  f.poly(
    [
      [base, H],
      [W, H],
      [W, 0],
    ],
    "fb2",
  );
  f.line(p, 0, p, H, "hgt");
  f.lbl(base / 2, H - 0.8, "base", "h");
  return {
    kind: "num",
    unit: "units",
    fig: f,
    answer: W,
    prompt: `The shaded parallelogram has an area of ${A} square units. How wide is the rectangle around it?`,
    hint: "The parallelogram and the rectangle have the same height. Find the parallelogram’s base first (area ÷ height), then add the width of one corner triangle.",
    misc: [
      [base, "That’s the parallelogram’s base. The rectangle is wider: add the corner triangle’s width."],
      [A - p, "Area ÷ height gives the base. Then add the corner triangle’s width."],
      [base - p, "Add the corner triangle’s width to the base, don’t subtract it."],
    ],
    explain: `Parallelogram: base × ${H} = ${A}, so base = ${A} ÷ ${H} = ${base}.<br>Rectangle width: ${base} + ${p} = ${W} units.`,
  };
}
/* a shape with a hole cut out (like the Lesson 3 practice problems): the whole shape minus the hole. Lengths come in
   pieces along the sides, so students add them up first. p.cut is for checks.js. */
/* the mistakes that aren't the answer or each other, and are positive */
function holeMisc(ans, m) {
  const seen = new Set([ans]);
  return m.filter(([v]) => v > 0 && !seen.has(v) && seen.add(v));
}
/* Build it for a shape with a hole: the whole shape and the hole (A, drawn in the build layer). q: the hole's kind, area, and label */
function holeBuild(f, hole, whole, wholeLabel, wholeKind, q) {
  f.on("build");
  f.poly(hole, "pc fb2", 'data-k="A"');
  f.lbl(...cen(hole), "A", "letter");
  return {
    R: whole,
    label: wholeLabel,
    kind: wholeKind,
    intro: "Find the area of the whole shape, as if nothing were cut out, and of the hole (A).",
    pieces: [{ k: "A", P: hole, ...q }],
  };
}
/* A triangle with a rectangle (or square) cut out of its base: the base is a + w + b with the hole w wide and h tall, and the
   height is t above the hole plus h. The apex is at px. */
function makeTriHole() {
  const a = R(2, 5),
    b = R(2, 5),
    w = R(2, 4),
    h = Math.random() < 0.5 ? w : R(2, 3),
    t = R(2, 4),
    W = a + w + b,
    H = h + t,
    px = R(a + 1, a + w - 1);
  if ((W * H) % 2) return null;
  const gap = (x) =>
    Math.min((H * x - px * h) / Math.hypot(H, px), (H * (W - x) - (W - px) * h) / Math.hypot(H, W - px)); // top corner to the slanted sides
  if (gap(a) < 0.5 || gap(a + w) < 0.5) return null;
  const T = (W * H) / 2,
    S = w * h,
    ans = T - S,
    sq = w === h ? "square" : "rectangle",
    f = new Fig();
  const outer = [
      [0, H],
      [W, H],
      [px, 0],
    ],
    hole = [
      [a, H],
      [a + w, H],
      [a + w, H - h],
      [a, H - h],
    ];
  f.rings([outer, hole], "shape solid");
  f.lbl(a / 2, H + 0.8, a);
  f.lbl(a + w / 2, H + 0.8, w);
  f.lbl(a + w + b / 2, H + 0.8, b);
  f.lbl(a - 0.85, H - h / 2, h);
  f.line(px, 0, px, H - h, "hgt");
  f.ra(px, H - h, 0, -1, 1, 0);
  f.lbl(px + 0.85, (H - h) / 2, t, "h");
  const build = holeBuild(f, hole, T, "Whole triangle, hole and all", "wtri", {
    kind: "rect",
    area: S,
    label: `Hole A (${sq})`,
  });
  f.onHint();
  f.line(px, H - h, px, H, "hgt");
  f.lbl(W / 2, H + 1.9, `${a} + ${w} + ${b} = ${W}`, "h");
  f.lbl(px, -0.9, `${t} + ${h} = ${H}`, "h");
  return {
    kind: "num",
    unit: SQ,
    fig: f,
    answer: ans,
    build,
    cut: { outer, hole },
    prompt: `Find the area of the shaded region. The ${sq} is cut out of the triangle.`,
    hint: `Find the whole triangle first, as if nothing were cut out. Its base is all three lengths along the bottom, and its height is the dashed line plus the ${sq}’s side. Then subtract the ${sq}.`,
    misc: holeMisc(ans, [
      [T, `That’s the whole triangle, hole and all. Now subtract the ${sq}.`],
      [T + S, `The ${sq} is a hole, so subtract its area. Don’t add it.`],
      [W * H - S, "The big shape is a triangle, so its area is half of base × height."],
      [(W * t) / 2 - S, `The triangle’s height goes from the base all the way to the top: ${t} + ${h}.`],
      [
        t * W - S,
        `The triangle’s height goes from the base all the way to the top: ${t} + ${h}, and a triangle needs ÷ 2.`,
      ],
      [((a + b) * H) / 2 - S, "The triangle’s base runs all the way across the bottom, under the hole too."],
      [T - S / 2, `The hole is a ${sq}, not a triangle, so don’t halve it.`],
    ]),
    explain: `Base: ${a} + ${w} + ${b} = ${W}. Height: ${t} + ${h} = ${H}.<br>Whole triangle: ${W} × ${H} ÷ 2 = ${T}.<br>Hole: ${w} × ${h} = ${S}.<br>Shaded: ${T} − ${S} = ${fmt(ans)} square units.`,
  };
}
/* A rectangle with a triangle cut out of its top edge: the top is a + b + c, the triangle b wide and h deep with its point at x */
function makeRectHole() {
  const a = R(1, 4),
    b = R(3, 6),
    c = R(1, 4),
    W = a + b + c,
    H = R(5, 7),
    h = R(3, H - 2),
    x = a + R(1, b - 1),
    A = W * H,
    T = (b * h) / 2,
    ans = A - T;
  if (A > 80 || (b * h) % 2) return null;
  const outer = [
      [0, 0],
      [W, 0],
      [W, H],
      [0, H],
    ],
    hole = [
      [a, H],
      [a + b, H],
      [x, H - h],
    ],
    f = new Fig();
  f.rings([outer, hole], "shape solid");
  f.lbl(a / 2, H + 0.8, a);
  f.lbl(a + b / 2, H + 0.8, b);
  f.lbl(a + b + c / 2, H + 0.8, c);
  f.lbl(-0.85, H / 2, H);
  f.line(x, H - h, x, H, "hgt");
  f.ra(x, H, 0, -1, 1, 0);
  f.lbl(cen(hole)[0] < x ? x + 0.85 : x - 0.85, H - h / 2, h, "h"); // on the side of the dashed line away from the letter A
  const build = holeBuild(f, hole, A, "Whole rectangle, hole and all", "frame", {
    kind: "hole",
    area: T,
    label: "Hole A (triangle)",
  });
  f.onHint();
  f.lbl(W / 2, -0.8, `${a} + ${b} + ${c} = ${W}`, "h");
  return {
    kind: "num",
    unit: SQ,
    fig: f,
    answer: ans,
    build,
    cut: { outer, hole },
    prompt: "Find the area of the shaded region. The triangle is cut out of the rectangle.",
    hint: "Find the whole rectangle first, as if nothing were cut out. Its width is all three lengths along the bottom. Then subtract the triangle: half of its base × its height (the dashed line).",
    misc: holeMisc(ans, [
      [A, "That’s the whole rectangle, hole and all. Now subtract the triangle."],
      [A + T, "The triangle is a hole, so subtract its area. Don’t add it."],
      [A - b * h, "The hole is a triangle, so its area is half of base × height."],
      [T, "That’s the hole. Subtract it from the whole rectangle."],
      [(a + c) * H - T, "The rectangle’s width runs all the way across the bottom, under the hole too."],
    ]),
    explain: `Width: ${a} + ${b} + ${c} = ${W}.<br>Whole rectangle: ${W} × ${H} = ${A}.<br>Hole: ${b} × ${h} ÷ 2 = ${T}.<br>Shaded: ${A} − ${T} = ${fmt(ans)} square units.`,
  };
}
/* a frame problem of kind t (see genFrame's pool), or null when the numbers don't work out (genFrame tries again) */
function makeFrame(t) {
  if (t === "reverse") return makeReverse();
  if (t === "trihole") return makeTriHole();
  if (t === "recthole") return makeRectHole();
  const s = shapeOf(t === "spot" ? pick(["corner", "edge", "quad"]) : t);
  if (!s) return null;
  const framed = frameFig(s);
  if (!framed) return null;
  const work = frameWork(s, framed);
  let hint =
    "Draw the rectangle around the shape. Find the area of each unshaded piece, then subtract them all from the rectangle.";
  if (s.notch) hint += " Piece A sits on the rectangle’s edge: ½ × that edge × the height up to the dent.";
  if (t === "spot") {
    const spotted = spotLines(s, framed);
    if (!spotted) return null;
    const why = {};
    spotted.all.forEach((l, i) => {
      if (i < spotted.bad) why["l" + i] = "That line checks out. Is every triangle halved? Is every length right?";
      else if (i > spotted.bad) why["l" + i] = "That line uses an earlier mistake. Find where the mistake starts.";
    });
    return {
      kind: "mc",
      stack: true,
      showBuild: true,
      fig: framed.f,
      answer: "l" + spotted.bad,
      why,
      choices: spotted.all.map((l, i) => ({ id: "l" + i, label: l })),
      prompt: `A classmate found the area of the shaded ${s.name}. Which line has the first mistake?`,
      hint: "Check each line against the grid: count the sides of each piece, and make sure every triangle is halved.",
      explain: `${spotted.why}<br><br>Correct work:<br>${work.join("<br>")} square units.`,
    };
  }
  const R0 = framed.R,
    S = R0 - framed.ans,
    tris = s.pieces.filter((q) => q.kind !== "rect").reduce((a, q) => a + q.area, 0);
  const misc = [
    [R0, "That’s the whole rectangle. Now subtract the unshaded pieces."],
    [S, "That’s the unshaded area around the shape. Subtract it from the rectangle."],
    [R0 - S - tris, "The triangles weren’t halved. Each corner triangle is half of a rectangle."],
    [framed.ans * 2, "Check your subtraction. Find each piece’s area, then subtract them from the rectangle."],
  ];
  s.pieces.forEach((q) => {
    misc.push([framed.ans + q.area, "One unshaded piece wasn’t subtracted."]);
    misc.push([
      framed.ans - q.area,
      q.kind === "rect"
        ? "One piece was subtracted twice."
        : "A triangle wasn’t halved, or a piece was subtracted twice.",
    ]);
  });
  return {
    kind: "num",
    unit: SQ,
    fig: framed.f,
    answer: framed.ans,
    hint,
    misc: misc.filter(([v]) => v > 0 && Math.abs(v - framed.ans) > 0.01),
    prompt: `Find the area of the shaded ${s.name}.`,
    explain: work.join("<br>") + " square units." + (s.extra ? "<br>" + s.extra : ""),
    build: { R: R0, pieces: s.pieces },
  };
}
/* dented shapes join the frame zone at 2 stars */
const dentsOpen = () => Game.stars("frame") >= 2;
function genFrame() {
  const pool = [
    "corner",
    "corner",
    "edge",
    "quad",
    "quad",
    "para",
    "psym",
    "spot",
    "spot",
    "reverse",
    "trihole",
    "trihole",
    "recthole",
  ];
  if (dentsOpen()) pool.push("dent", "dent", "dent", "dent");
  const kind = pick(pool);
  for (let i = 0; i < 60; i++) {
    const problem = makeFrame(kind);
    if (problem) return problem;
  }
  return makeFrame("reverse");
}

/* ---------- zones ---------- */
const ICON = {
  para: '<polygon points="6,50 44,50 58,14 20,14" fill="rgba(255,201,60,.18)" stroke="#ffc93c" stroke-width="3"/><line x1="20" y1="14" x2="20" y2="50" stroke="#7fe3ff" stroke-width="2.5" stroke-dasharray="5 4"/>',
  tri: '<polygon points="6,52 40,52 54,10" fill="rgba(255,201,60,.18)" stroke="#ffc93c" stroke-width="3"/><line x1="40" y1="52" x2="54" y2="52" stroke="#a9c4e4" stroke-width="2" stroke-dasharray="2 4"/><line x1="54" y1="10" x2="54" y2="52" stroke="#7fe3ff" stroke-width="2.5" stroke-dasharray="5 4"/>',
  poly: '<polygon points="4,50 60,50 44,16 18,16" fill="rgba(255,201,60,.18)" stroke="#ffc93c" stroke-width="3"/><line x1="18" y1="16" x2="18" y2="50" stroke="#7fe3ff" stroke-width="2.5" stroke-dasharray="5 4"/>',
  net: '<g fill="rgba(255,201,60,.18)" stroke="#ffc93c" stroke-width="2.5"><rect x="22" y="4" width="14" height="14"/><rect x="8" y="18" width="14" height="14"/><rect x="22" y="18" width="14" height="14"/><rect x="36" y="18" width="14" height="14"/><rect x="22" y="32" width="14" height="14"/><rect x="22" y="46" width="14" height="14"/></g>',
  solid:
    '<g stroke="#ffc93c" stroke-width="2.5" stroke-linejoin="round"><polygon points="8,24 22,12 44,12 30,24" fill="rgba(255,201,60,.4)"/><polygon points="8,24 30,24 30,54 8,54" fill="rgba(255,201,60,.18)"/><polygon points="30,24 44,12 44,42 30,54" fill="rgba(255,201,60,.08)"/></g><path d="M50,28L60,56H40Z" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5" stroke-linejoin="round"/>',
  cube: '<g stroke="#ffc93c" stroke-width="3" stroke-linejoin="round"><polygon points="10,22 38,22 52,10 24,10" fill="rgba(255,201,60,.35)"/><polygon points="38,22 52,10 52,40 38,52" fill="rgba(255,201,60,.08)"/><rect x="10" y="22" width="28" height="30" fill="rgba(255,201,60,.18)"/></g>',
  frame:
    '<rect x="5" y="12" width="54" height="40" fill="none" stroke="#f3f6fb" stroke-width="2.5"/><polygon points="5,52 30,12 59,26" fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="3" stroke-linejoin="round"/>',
  boss: '<rect x="6" y="6" width="52" height="52" rx="4" fill="none" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="5 4"/><polygon points="32,12 38,26 53,27 41,37 45,52 32,43 19,52 23,37 11,27 26,26" fill="#ffc93c"/>',
};
const ZONES = [
  {
    id: "para",
    name: "Parallelogram Plaza",
    lessons: "Lessons 4–6",
    blurb: "Base, height, and why the slanted side doesn’t count.",
    gen: genPara,
  },
  {
    id: "tri",
    name: "Triangle Tower",
    lessons: "Lessons 7–10",
    blurb: "Half of a parallelogram, including heights that land outside.",
    gen: genTri,
  },
  {
    id: "poly",
    name: "Polygon Park",
    lessons: "Lessons 2–3, 11",
    blurb: "Trapezoids, L-shapes, and pentagons. Decompose and rearrange.",
    gen: genPoly,
  },
  {
    id: "solid",
    name: "Polyhedron Yard",
    lessons: "Lesson 13",
    blurb:
      "Count faces, edges, and vertices, name prisms and pyramids, compare two figures, and spot shapes that aren’t polyhedra.",
    gen: genSolid,
  },
  {
    id: "net",
    name: "Net Factory",
    lessons: "Lessons 12–16",
    blurb: "Fold nets, spot cube nets, decide if two nets make the same prism, and add up every face.",
    gen: genNet,
  },
  {
    id: "cube",
    name: "Squares & Cubes Lab",
    lessons: "Lessons 16–18",
    blurb: "Exponents, cube surface area, and area vs. volume units.",
    gen: genCube,
  },
  {
    id: "frame",
    name: "Frame & Subtract",
    lessons: "Lessons 3, 10–12",
    blurb: "Shapes inside a rectangle, and shapes with holes. Find the whole, subtract what isn’t shaded.",
    gen: genFrame,
  },
  {
    id: "boss",
    name: "Final Blueprint",
    lessons: "Whole unit · 10 problems",
    blurb: "A mixed review from every zone. Aim for 3 stars.",
    gen: () => pick([genPara, genTri, genPoly, genSolid, genNet, genCube, genFrame])(),
  },
];
