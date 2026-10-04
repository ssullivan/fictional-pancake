/* Shapes for K–5 pages: flat shapes, pictures in a row, solid shapes, shapes cut into equal parts, and pattern blocks.
   Styles are in shapes.css. Needs util.js and figures.js (svgWrap).

   SHAPES[sides], SHAPE_NAME[sides], QUADS    flat shapes in a 100 × 100 box; shapeAt(pts, x, y, s, {…}) (markup), shapeFig(pts, {…}, label)
   picRow(n, w, h, draw, {letters, tap}), shapeRow(list, {…}), shareRow(shape, list, {…})   pictures side by side, lettered or to tap
   SOLIDS, solidFig(kind, {back})    cubes, boxes, pyramids, and prisms drawn at an angle, with the back edges dashed
   shareFig(shape, n, how, {shade})  a circle or rectangle cut into halves, thirds, or fourths
   PB, pbFig(big, small, {show})     pattern blocks: a hexagon, trapezoid, or rhombus filled with smaller blocks
   rectFig(length, width, {…})       a rectangle with its side lengths, in unit squares when it's small enough (svg) */
/* Flat shapes in a 100 × 100 box, by number of sides. Some are tilted, stretched, or bent in, so the name comes from counting sides. */
/* Flat shapes in a 100 × 100 box, by number of sides. Some are tilted, stretched, or bent in, so the name comes from counting sides. */
/* the corners of a regular n-gon in the box, the first at angle a0 (degrees; −90 is straight up) */
const regular = (n, a0 = -90) =>
  range(n).map((i) => {
    const a = ((a0 + (360 * i) / n) * Math.PI) / 180;
    return [50 + 46 * Math.cos(a), 50 + 46 * Math.sin(a)];
  });
const SHAPES = {
  3: [
    [
      [50, 6],
      [96, 88],
      [4, 88],
    ],
    [
      [10, 8],
      [10, 92],
      [84, 92],
    ],
    [
      [4, 78],
      [96, 92],
      [66, 12],
    ],
    [
      [8, 14],
      [92, 14],
      [38, 92],
    ],
  ],
  4: [
    [
      [12, 12],
      [88, 12],
      [88, 88],
      [12, 88],
    ],
    [
      [4, 26],
      [96, 26],
      [96, 74],
      [4, 74],
    ],
    [
      [50, 4],
      [88, 50],
      [50, 96],
      [12, 50],
    ],
    [
      [26, 18],
      [74, 18],
      [96, 82],
      [4, 82],
    ],
    [
      [20, 8],
      [92, 30],
      [70, 92],
      [6, 58],
    ],
    [
      [50, 6],
      [92, 92],
      [50, 64],
      [8, 92],
    ],
  ],
  5: [
    regular(5),
    [
      [50, 6],
      [92, 40],
      [92, 92],
      [8, 92],
      [8, 40],
    ],
    [
      [8, 22],
      [58, 6],
      [96, 50],
      [62, 92],
      [6, 78],
    ],
  ],
  6: [
    regular(6, 0),
    [
      [8, 6],
      [46, 6],
      [46, 58],
      [92, 58],
      [92, 94],
      [8, 94],
    ],
    [
      [4, 42],
      [30, 6],
      [76, 14],
      [96, 56],
      [66, 94],
      [20, 86],
    ],
  ],
};
const SHAPE_NAME = { 3: "triangle", 4: "quadrilateral", 5: "pentagon", 6: "hexagon" };
/* quadrilaterals by name, for side lengths and square corners */
const QUADS = { square: SHAPES[4][0], rectangle: SHAPES[4][1], rhombus: SHAPES[4][2], trapezoid: SHAPES[4][3] };
/* Shape pts drawn from x, y, s pixels across. cls: its class. nums: number each side. lens: a label for each side.
   sq: mark the square corners. Returns markup. */
function shapeAt(pts, x, y, s, { cls = "shp", nums = false, lens = null, sq = false } = {}) {
  /* the corners in pixels; round1 keeps the markup short */
  const corners = pts.map(([a, b]) => [x + (a * s) / 100, y + (b * s) / 100]),
    n = corners.length,
    round1 = (v) => +v.toFixed(1);
  /* winding is +1 or −1 by which way the corners go round (the sign of the shoelace sum), which says which side of each side is outside */
  const winding = Math.sign(
    corners.reduce((t, [a, b], i) => {
      const [c, d] = corners[(i + 1) % n];
      return t + a * d - c * b;
    }, 0),
  );
  let markup = `<polygon class="${cls}" points="${corners.map((p) => p.map(round1).join(",")).join(" ")}"/>`;
  corners.forEach(([ax, ay], i) => {
    /* this corner (ax, ay), the next one (nx, ny), and the one before (px, py) */
    const [nx, ny] = corners[(i + 1) % n],
      [px, py] = corners[(i + n - 1) % n],
      sideLen = Math.hypot(nx - ax, ny - ay),
      text = nums ? i + 1 : lens ? lens[i] : null;
    /* a side's label sits just outside its middle, along the outward normal */
    if (text != null) {
      const offset = lens ? 21 : 17;
      markup += `<text class="lbl${lens ? "" : " s"} cy" x="${round1((ax + nx) / 2 + ((winding * (ny - ay)) / sideLen) * offset)}" y="${round1((ay + ny) / 2 - ((winding * (nx - ax)) / sideLen) * offset)}">${text}</text>`;
    }
    if (sq) {
      /* toPrev and toNext are unit vectors along the two sides at this corner. It's a square corner when they're perpendicular
         (dot near 0) and the shape turns outward there (turn against the winding), not at a corner that bends in */
      const prevLen = Math.hypot(px - ax, py - ay),
        toPrev = [(px - ax) / prevLen, (py - ay) / prevLen],
        toNext = [(nx - ax) / sideLen, (ny - ay) / sideLen],
        size = 11;
      const dot = toPrev[0] * toNext[0] + toPrev[1] * toNext[1],
        turn = toPrev[0] * toNext[1] - toPrev[1] * toNext[0];
      if (Math.abs(dot) < 0.03 && turn * winding < 0) {
        markup += `<path class="sqc" d="M${round1(ax + toPrev[0] * size)},${round1(ay + toPrev[1] * size)}L${round1(ax + (toPrev[0] + toNext[0]) * size)},${round1(ay + (toPrev[1] + toNext[1]) * size)}L${round1(ax + toNext[0] * size)},${round1(ay + toNext[1] * size)}"/>`;
      }
    }
  });
  return markup;
}
/* one shape in its own svg, with room around it for side labels */
const shapeFig = (pts, { s = 180, ...o } = {}, label) => {
  const margin = o.lens ? 48 : 30;
  return svgWrap(
    s + 2 * margin,
    s + 2 * margin,
    shapeAt(pts, margin, margin, s, o),
    label || `A ${SHAPE_NAME[pts.length]}`,
  );
};

/* n pictures w wide and h tall, side by side (they wrap onto two rows on a phone); draw(i) returns picture i's markup.
   letters: write A, B, C, … under them. tap: each picture is a tap answer for engine.js (.cand, data-id = its place,
   read as "<tap> 1", "<tap> 2", …). label: what each picture is (numbered, or lettered). */
function picRow(n, w, h, draw, { letters = false, tap = null, label = "Picture" } = {}) {
  const picture = (i) => {
    const letter = letters ? `<text class="lbl" x="${w / 2}" y="${h + 14}">${"ABCD"[i]}</text>` : "",
      target = tap
        ? `<rect class="cand hit" data-id="${i}" tabindex="0" role="button" aria-label="${tap} ${i + 1}" x="4" y="4" width="${w - 8}" height="${h - 8}" rx="10"/>`
        : "";
    return svgWrap(w, h + (letters ? 30 : 0), draw(i) + letter + target, `${label} ${letters ? "ABCD"[i] : i + 1}`);
  };
  return `<div class="picrow">${range(n).map(picture).join("")}</div>`;
}
/* flat shapes side by side: list [[pts, shapeAt options], …] */
const shapeRow = (list, o = {}) => {
  const margin = list.some(([, q]) => q && q.lens) ? 45 : 24;
  return picRow(list.length, 200, 200, (i) => shapeAt(list[i][0], margin, margin, 200 - 2 * margin, list[i][1]), o);
};

/* Solid shapes as corners (x, y, z: z goes back) and faces. Drawn at an angle, so the front, top, and right faces show. */
/* a box's faces (as corner numbers) and a unit cube's corners: 0–3 the front, 4–7 the back */
const BOXF = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 3, 7, 4],
    [1, 2, 6, 5],
    [0, 1, 5, 4],
    [3, 2, 6, 7],
  ],
  CUBEV = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 1, 1],
  ];
const SOLIDS = {
  cube: { name: "cube", v: CUBEV, f: BOXF, faces: [[6, "square"]] },
  box: { name: "box", v: CUBEV.map(([x, y, z]) => [x * 1.7, y, z * 0.7]), f: BOXF, faces: [[6, "rectangle"]] },
  pyramid: {
    name: "pyramid",
    v: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 0, 1],
      [0, 0, 1],
      [0.5, 1.1, 0.5],
    ],
    f: [
      [0, 1, 2, 3],
      [0, 1, 4],
      [1, 2, 4],
      [2, 3, 4],
      [3, 0, 4],
    ],
    faces: [
      [1, "square"],
      [4, "triangle"],
    ],
  },
  prism: {
    name: "triangle prism",
    v: [
      [0, 0, 0],
      [1.2, 0, 0],
      [0.6, 1, 0],
      [0, 0, 1.4],
      [1.2, 0, 1.4],
      [0.6, 1, 1.4],
    ],
    f: [
      [0, 1, 2],
      [3, 4, 5],
      [0, 1, 4, 3],
      [1, 2, 5, 4],
      [2, 0, 3, 5],
    ],
    faces: [
      [2, "triangle"],
      [3, "rectangle"],
    ],
  },
};
/* A solid shape, s pixels to a unit. back: show the edges at the back as dashed lines. */
function solidFig(kind, { back = false, s = 110, label } = {}) {
  const solid = SOLIDS[kind],
    corners = solid.v,
    /* drawn at an angle: going back (z) moves a point .45 right and .35 up; y on screen points down */
    screen = corners.map(([x, y, z]) => [(x + 0.45 * z) * s, (-y - 0.35 * z) * s]),
    centerOf = (list) => [0, 1, 2].map((i) => list.reduce((t, j) => t + corners[j][i], 0) / list.length),
    center = centerOf(range(corners.length));
  /* a face shows when its outside faces the viewer, who looks along (−.45, −.35, 1) */
  const faces = solid.f.map((f) => {
    /* the face's normal (cross product of two of its sides), turned to point away from the solid's center, length 1 */
    const [a, b, c] = f.map((i) => corners[i]),
      u = [0, 1, 2].map((i) => b[i] - a[i]),
      w = [0, 1, 2].map((i) => c[i] - a[i]),
      normal = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]],
      faceCenter = centerOf(f),
      outward = Math.sign(normal.reduce((t, v, i) => t + v * (faceCenter[i] - center[i]), 0)),
      N = normal.map((v) => (v * outward) / Math.hypot(...normal));
    return { f, N, vis: -0.45 * N[0] - 0.35 * N[1] + N[2] < 0 };
  });
  /* screen points shifted so the drawing starts 8 pixels from the top left */
  const xs = screen.map((p) => p[0]),
    ys = screen.map((p) => p[1]),
    toX = (v) => +(v - Math.min(...xs) + 8).toFixed(1),
    toY = (v) => +(v - Math.min(...ys) + 8).toFixed(1),
    pt = (i) => `${toX(screen[i][0])},${toY(screen[i][1])}`;
  /* the edges of the faces that show (vis true) or don't, as "a-b" keys */
  const edges = (vis) =>
    new Set(
      faces
        .filter((q) => q.vis === vis)
        .flatMap(({ f }) => f.map((a, i) => [a, f[(i + 1) % f.length]].sort().join("-"))),
    );
  const seen = edges(true);
  /* each face that shows is shaded by which way it points: t top, r right side, f front */
  let markup = faces
    .filter((q) => q.vis)
    .map(
      ({ f, N }) =>
        `<polygon class="sf ${N[1] > 0.5 ? "t" : N[0] > 0.5 ? "r" : "f"}" points="${f.map(pt).join(" ")}"/>`,
    )
    .join("");
  /* back edges: those of hidden faces that no face that shows has */
  if (back)
    [...edges(false)]
      .filter((e) => !seen.has(e))
      .forEach((e) => {
        const [a, b] = e.split("-");
        markup += `<path class="hid" d="M${pt(a)}L${pt(b)}"/>`;
      });
  return svgWrap(
    Math.max(...xs) - Math.min(...xs) + 16,
    Math.max(...ys) - Math.min(...ys) + 16,
    markup,
    label || `A ${solid.name}`,
  );
}
/* The parts of a shape cut n ways, as path data, in a box s tall from x, y. shape: 'circle', 'square', or 'rect' (twice as wide as tall).
   how: 'v' strips side by side, 'h' strips on top of each other, 'grid' 2 × 2, 'diag' corner to corner (2 or 4 parts),
   or 'uneq' parts that are not the same size (a circle cut by a line off the middle, or strips of different widths). */
function shareParts(shape, n, how, x, y, s) {
  const round1 = (v) => +v.toFixed(1);
  if (shape === "circle") {
    /* onCircle(a): the point on the circle a degrees clockwise from the top */
    const r = s / 2,
      cx = x + r,
      cy = y + r,
      onCircle = (a) => {
        const t = ((a - 90) * Math.PI) / 180;
        return `${round1(cx + r * Math.cos(t))},${round1(cy + r * Math.sin(t))}`;
      };
    if (n === 1) return [`M${cx - r},${cy}a${r},${r} 0 1 0 ${2 * r},0a${r},${r} 0 1 0 ${-2 * r},0Z`];
    if (how === "uneq" && n === 2) {
      /* a straight cut 0.4 of the radius right of the middle; the cut is 2 × halfCut long (√(1 − 0.4²) = √.84) */
      const cutX = round1(cx + 0.4 * r),
        halfCut = round1(Math.sqrt(0.84) * r);
      return [
        `M${cutX},${cy - halfCut}A${r},${r} 0 0 1 ${cutX},${cy + halfCut}Z`,
        `M${cutX},${cy + halfCut}A${r},${r} 0 1 1 ${cutX},${cy - halfCut}Z`,
      ];
    }
    /* pie slices, each `sweep` degrees, going round from the top */
    const sweeps = how === "uneq" ? { 3: [160, 120, 80], 4: [130, 50, 130, 50] }[n] : range(n).map(() => 360 / n);
    let start = 0;
    return sweeps.map((sweep) => {
      const d = `M${cx},${cy}L${onCircle(start)}A${r},${r} 0 ${sweep > 180 ? 1 : 0} 1 ${onCircle(start + sweep)}Z`;
      start += sweep;
      return d;
    });
  }
  /* box(a, b, c, d): the rectangle from (a, b) to (c, d), measured from x, y */
  const W = shape === "rect" ? 2 * s : s,
    box = (a, b, c, d) => `M${round1(x + a)},${round1(y + b)}H${round1(x + c)}V${round1(y + d)}H${round1(x + a)}Z`;
  if (how === "grid")
    return [box(0, 0, W / 2, s / 2), box(W / 2, 0, W, s / 2), box(W / 2, s / 2, W, s), box(0, s / 2, W / 2, s)];
  if (how === "diag") {
    const P = [
        [x, y],
        [x + W, y],
        [x + W, y + s],
        [x, y + s],
      ],
      c = [x + W / 2, y + s / 2];
    /* 2 parts: two triangles split by one diagonal; 4: a triangle from the center to each side */
    return n === 2
      ? [`M${P[0]}L${P[1]}L${P[2]}Z`, `M${P[0]}L${P[2]}L${P[3]}Z`]
      : range(4).map((i) => `M${c}L${P[i]}L${P[(i + 1) % 4]}Z`);
  }
  /* strips: each part's share of the width ('v') or height ('h') */
  const shares =
    how === "uneq"
      ? { 2: [0.62, 0.38], 3: [0.46, 0.32, 0.22], 4: [0.34, 0.28, 0.22, 0.16] }[n]
      : range(n).map(() => 1 / n);
  let t = 0;
  return shares.map((share) => {
    const d = how === "h" ? box(0, t * s, W, (t + share) * s) : box(t * W, 0, (t + share) * W, s);
    t += share;
    return d;
  });
}
/* A shape cut into parts (see shareParts). shade: the parts to color in. tap: parts can be tapped (data-i). */
function shareFig(shape, n, how, { shade = [], s = 150, tap = false, label } = {}) {
  const W = shape === "rect" ? 2 * s : s;
  return svgWrap(
    W + 12,
    s + 12,
    shareParts(shape, n, how, 6, 6, s)
      .map((d, i) => `<path class="pc${shade.includes(i) ? " on" : ""}"${tap ? ` data-i="${i}"` : ""} d="${d}"/>`)
      .join(""),
    label ||
      `A ${shape === "rect" ? "rectangle" : shape} cut into ${n} ${how === "uneq" ? "parts that are not the same size" : "equal parts"}, ${shade.length} shaded`,
  );
}

/* same-size shapes side by side, cut into parts: list [{n, how, shade}, …] (see shareParts) */
const shareRow = (shape, list, o = {}) => {
  const W = shape === "rect" ? 260 : 140;
  return picRow(
    list.length,
    W + 30,
    170,
    (i) => {
      const { n, how = "v", shade = [] } = list[i];
      return shareParts(shape, n, how, 15, 15, 140)
        .map((d, j) => `<path class="pc${shade.includes(j) ? " on" : ""}" d="${d}"/>`)
        .join("");
    },
    o,
  );
};

/* Pattern blocks. PB[big][small]: how many small blocks fill a big one. */
const PB = { hexagon: { triangle: 6, rhombus: 3, trapezoid: 2 }, trapezoid: { triangle: 3 }, rhombus: { triangle: 2 } };
/* A big block filled with small ones (show: true for all of them, or how many to draw; 0 or false for just the outline
   and one small block to count with). s: the side of a triangle in pixels. */
function pbFig(big, small, { show = true, s = 70, label } = {}) {
  /* Every block is cut from one hexagon centered at (0, 0): its corners hex[0…5] (hex(i) wraps around), going clockwise from the right.
     A trapezoid is its top half, a rhombus two of its triangles, and a triangle the center and two corners next to each other. */
  const hex = range(6).map((k) => [s * Math.cos((k * Math.PI) / 3), s * Math.sin((k * Math.PI) / 3)]),
    center = [0, 0],
    corner = (i) => hex[i % 6];
  const outline = {
    hexagon: hex,
    trapezoid: [hex[3], hex[4], hex[5], hex[0]],
    rhombus: [center, hex[4], hex[5], hex[0]],
  }[big];
  /* the small blocks that fill the big one, each a list of corners */
  const pieces = {
    hexagon: {
      triangle: range(6).map((k) => [center, corner(k), corner(k + 1)]),
      rhombus: [0, 2, 4].map((k) => [center, corner(k), corner(k + 1), corner(k + 2)]),
      trapezoid: [
        [hex[0], hex[1], hex[2], hex[3]],
        [hex[3], hex[4], hex[5], hex[0]],
      ],
    },
    trapezoid: { triangle: [3, 4, 5].map((k) => [center, corner(k), corner(k + 1)]) },
    rhombus: { triangle: [4, 5].map((k) => [center, corner(k), corner(k + 1)]) },
  }[big][small];
  /* shown: how many small blocks to draw; points are shifted so the outline starts 8 pixels from the top left */
  const shown = show === true ? pieces.length : show || 0,
    xs = outline.map((p) => p[0]),
    ys = outline.map((p) => p[1]),
    x0 = Math.min(...xs) - 8,
    y0 = Math.min(...ys) - 8,
    pointsOf = (list) => list.map(([a, b]) => `${+(a - x0).toFixed(1)},${+(b - y0).toFixed(1)}`).join(" ");
  /* with none to show, draw one small block to count with; unless it's full, draw the big block's outline too */
  const markup =
    (shown ? pieces.slice(0, shown) : pieces.slice(0, 1))
      .map((l) => `<polygon class="pb ${small}" points="${pointsOf(l)}"/>`)
      .join("") + (shown === pieces.length ? "" : `<polygon class="pb out" points="${pointsOf(outline)}"/>`);
  return svgWrap(
    Math.max(...xs) - x0 + 8,
    Math.max(...ys) - y0 + 8,
    markup,
    label ||
      `A ${big} with ${shown === pieces.length ? pieces.length : shown || 1} ${small}${(shown || 1) > 1 ? "s" : ""} in it`,
  );
}
/* A rectangle length by width, with the length written along the top and the width down the left side (unit: "m", "cm").
   ask: 'length' or 'width' writes ? for that side instead. grid: draw the unit squares inside (only when it has 15 or
   fewer along each side). Scaled so the longer side fits 300 pixels. */
function rectFig(length, width, { unit = "", ask = null, grid = true, label } = {}) {
  const scale = Math.min(32, 300 / length, 200 / width),
    left = 58,
    top = 34,
    w = length * scale,
    h = width * scale,
    sideText = (v, which) => (ask === which ? "?" : `${v.toLocaleString("en-US")}${unit ? " " + unit : ""}`);
  let markup = "";
  if (grid && length <= 15 && width <= 15) {
    range(length - 1).forEach((i) => {
      const x = left + (i + 1) * scale;
      markup += `<line class="rgrid" x1="${x}" y1="${top}" x2="${x}" y2="${top + h}"/>`;
    });
    range(width - 1).forEach((i) => {
      const y = top + (i + 1) * scale;
      markup += `<line class="rgrid" x1="${left}" y1="${y}" x2="${left + w}" y2="${y}"/>`;
    });
  }
  markup +=
    `<rect class="rside" x="${left}" y="${top}" width="${w}" height="${h}"/>` +
    `<text class="lbl${ask === "length" ? " cy" : ""}" x="${left + w / 2}" y="${top - 16}">${sideText(length, "length")}</text>` +
    `<text class="lbl en${ask === "width" ? " cy" : ""}" x="${left - 8}" y="${top + h / 2}">${sideText(width, "width")}</text>`;
  return svgWrap(
    left + w + 16,
    top + h + 10,
    markup,
    label ||
      `A rectangle ${ask === "length" ? "?" : length} by ${ask === "width" ? "?" : width}${unit ? " " + unit : ""}`,
  );
}
