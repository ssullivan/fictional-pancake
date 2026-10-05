/* The Unit 1 study guide (study.html): its diagrams. Each <figure data-fig="name"> in the page gets the picture FIGURES[name]
   draws. Diagrams are laid out in units with y going up, `scale` pixels per unit, and come out as inline SVG with the
   classes styled in study.html (sh a shape, ht a height, ra a right-angle mark, lb a label, …). Nothing else uses this file. */

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

/* the average of some points: a point inside a convex shape, for side() */
const middleOf = (points) => [0, 1].map((k) => points.reduce((sum, p) => sum + p[k], 0) / points.length);

/* a dashed height from `top` straight down to `foot`, its right-angle mark (toward markDir), and its label on the left
   (onLeft) or the right of it */
function drawHeight(d, top, foot, words, { onLeft = false, markDir = [1, 0] } = {}) {
  d.line(top, foot, "ht").right(foot, [0, 1], markDir);
  return d.text([(top[0] + foot[0]) / 2, (top[1] + foot[1]) / 2], words, {
    dx: onLeft ? -12 : 12,
    dy: 5,
    cls: "lb hl",
    anchor: onLeft ? "end" : "start",
  });
}

/* A parallelogram with its base along the bottom, its top shifted right by `shift`, and height h; words: [base, slanted
   side (or null), height]. outside: the height is drawn past the end of the base, which is extended to meet it. */
function parallelogram(base, shift, h, scale, [baseWords, slantWords, heightWords], label, outside = false) {
  const d = new Diagram(0, Math.max(base, shift + base), 0, h, scale, { pad: 30, label, left: 24, right: 24 }),
    corners = [
      [0, 0],
      [base, 0],
      [base + shift, h],
      [shift, h],
    ],
    inside = middleOf(corners);
  d.poly(corners).side([0, 0], [base, 0], baseWords, inside);
  if (slantWords) d.side([0, 0], [shift, h], slantWords, inside);
  if (outside) d.line([base, 0], [shift, 0], "ext");
  return drawHeight(d, [shift, h], [shift, 0], heightWords, {
    onLeft: outside,
    markDir: outside ? [-1, 0] : [1, 0],
  }).svg();
}

/* A triangle with corners `corners` (its base along y = 0). sides: [[p, q, words]] to label; height: [top, foot, words];
   extend: [from, to], a dashed extension of the base out to a height that falls outside. */
function triangle(corners, scale, sides, label, { height = null, extend = null } = {}) {
  const xs = [...corners.map((p) => p[0]), ...(extend ? [extend[1][0]] : [])],
    d = new Diagram(Math.min(...xs), Math.max(...xs), 0, Math.max(...corners.map((p) => p[1])), scale, {
      pad: 30,
      label,
      left: 24,
      right: 44,
    }),
    inside = middleOf(corners);
  d.poly(corners);
  sides.forEach(([p, q, words]) => d.side(p, q, words, inside));
  if (extend) d.line(extend[0], extend[1], "ext");
  if (height) drawHeight(d, height[0], height[1], height[2]);
  return d.svg();
}

/* a rectangle with corner (x, y), w wide and h tall, as polygon points */
const rect = (x, y, w, h) => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];

/* (x, y, z) drawn at an angle: depth (z) goes up and to the right */
const oblique = ([x, y, z]) => [x + z * 0.5, y + z * 0.35];
/* A solid drawn at an angle: visible edges solid, hidden ones dashed, and its front faces shaded. notes: [[point, words,
   dx, dy]] labels. Edges are [[x, y, z], [x, y, z]] pairs. */
function solid(visible, hidden, faces, scale, label, notes = []) {
  const points = [...visible, ...hidden].flat().map(oblique),
    d = new Diagram(
      Math.min(...points.map((p) => p[0])),
      Math.max(...points.map((p) => p[0])),
      Math.min(...points.map((p) => p[1])),
      Math.max(...points.map((p) => p[1])),
      scale,
      { label },
    );
  faces.forEach((face) => d.poly(face.map(oblique)));
  hidden.forEach(([a, b]) => d.line(oblique(a), oblique(b), "hid"));
  visible.forEach(([a, b]) => d.line(oblique(a), oblique(b)));
  notes.forEach(([p, words, dx, dy]) => d.text(oblique(p), words, { dx, dy, cls: "lb sm" }));
  return d.svg();
}

/* a cube with edges e, its edges labelled in cm when `labelled` */
function cube(e, scale, label, labelled) {
  const [A, B, C, D] = [
      [0, 0, 0],
      [e, 0, 0],
      [e, e, 0],
      [0, e, 0],
    ],
    [A2, B2, C2, D2] = [
      [0, 0, e],
      [e, 0, e],
      [e, e, e],
      [0, e, e],
    ];
  return solid(
    [
      [A, B],
      [B, C],
      [C, D],
      [D, A],
      [B, B2],
      [C, C2],
      [D, D2],
      [B2, C2],
      [C2, D2],
    ],
    [
      [A, A2],
      [A2, B2],
      [A2, D2],
    ],
    [
      [A, B, C, D],
      [B, B2, C2, C],
      [D, C, C2, D2],
    ],
    scale,
    label,
    labelled
      ? [
          [[e / 2, 0, 0], `${e} cm`, 0, 18],
          [[e, e / 2, 0], `${e} cm`, 22, 5],
        ]
      : [],
  );
}

const FIGURES = {
  /* Part A: an L shape broken into two rectangles */
  L: () =>
    new Diagram(0, 6, 0, 5, 26, {
      label: "An L-shaped figure on a grid: a 6 by 2 bar along the bottom and a 2 by 3 bar up the left side",
    })
      .grid(0, 6, 0, 5)
      .poly([
        [0, 0],
        [6, 0],
        [6, 2],
        [2, 2],
        [2, 5],
        [0, 5],
      ])
      .line([0, 2], [2, 2], "cut")
      .text([3, 1], "6 × 2 = 12", { dy: 5 })
      .text([1, 3.5], "2×3", { cls: "lb sm" })
      .text([1, 3.5], "= 6", { dy: 14, cls: "lb sm" })
      .svg(),
  T: () =>
    new Diagram(0, 7, 0, 5, 24, {
      label: "A T-shaped figure on a grid: a 7 by 2 bar across the top and a 3 by 3 stem below its middle",
    })
      .grid(0, 7, 0, 5)
      .poly([
        [2, 0],
        [5, 0],
        [5, 3],
        [7, 3],
        [7, 5],
        [0, 5],
        [0, 3],
        [2, 3],
      ])
      .svg(),
  pond: () =>
    new Diagram(0, 8, 0, 6, 24, {
      label: "A garden 8 meters by 6 meters with a pond 3 meters by 2 meters in the middle",
    })
      .poly(rect(0, 0, 8, 6))
      .poly(rect(2.5, 2, 3, 2), "hole")
      .side([0, 0], [8, 0], "8 m", [4, 3])
      .side([8, 0], [8, 6], "6 m", [4, 3])
      .text([4, 3], "pond", { dy: -4, cls: "lb sm" })
      .text([4, 3], "3 m × 2 m", { dy: 12, cls: "lb sm" })
      .svg(),

  /* Part B: parallelograms (the slanted sides are their real lengths: 3, 4, 5 and so on) */
  paraExample: () =>
    parallelogram(
      6,
      3,
      4,
      30,
      ["6 cm", "5 cm", "4 cm"],
      "A parallelogram with base 6 cm, slanted side 5 cm, and height 4 cm",
    ),
  para1: () =>
    parallelogram(
      9,
      3.3,
      5,
      22,
      ["9 cm", "6 cm", "5 cm"],
      "A parallelogram with base 9 cm, slanted side 6 cm, and height 5 cm",
    ),
  para2: () =>
    parallelogram(
      4,
      6,
      7,
      18,
      ["4 in", null, "7 in"],
      "A leaning parallelogram with base 4 inches and a height of 7 inches drawn outside it",
      true,
    ),

  /* Part C: triangles */
  triExample: () =>
    triangle(
      [
        [0, 0],
        [10, 0],
        [3, 6],
      ],
      20,
      [[[0, 0], [10, 0], "10 m"]],
      "A triangle with base 10 m and height 6 m",
      { height: [[3, 6], [3, 0], "6 m"] },
    ),
  tri1: () =>
    triangle(
      [
        [0, 0],
        [8, 0],
        [0, 5],
      ],
      22,
      [
        [[0, 0], [8, 0], "8 ft"],
        [[0, 0], [0, 5], "5 ft"],
        [[8, 0], [0, 5], "9.4 ft"],
      ],
      "A right triangle with legs 8 feet and 5 feet and a long side of 9.4 feet",
    ),
  tri2: () =>
    triangle(
      [
        [0, 0],
        [6, 0],
        [9, 4],
      ],
      22,
      [[[0, 0], [6, 0], "6 cm"]],
      "A triangle with base 6 cm whose 4 cm height falls outside it",
      {
        height: [[9, 4], [9, 0], "4 cm"],
        extend: [
          [6, 0],
          [9, 0],
        ],
      },
    ),

  /* Part D: polygons */
  trapExample: () =>
    new Diagram(0, 10, 0, 4, 22, {
      pad: 30,
      label: "A trapezoid with bottom 10, top 6, and height 4, cut into a rectangle and two triangles",
    })
      .poly([
        [0, 0],
        [10, 0],
        [8, 4],
        [2, 4],
      ])
      .line([2, 4], [2, 0], "cut")
      .line([8, 4], [8, 0], "cut")
      .right([2, 0], [0, 1], [1, 0])
      .side([0, 0], [10, 0], "10", [5, 2])
      .side([2, 4], [8, 4], "6", [5, 2])
      .text([2, 2], "4", { dx: -14, dy: 5, cls: "lb hl", anchor: "end" })
      .text([5, 2], "6 × 4", { dy: 5 })
      .text([0.9, 0.8], "2", { dy: 5, cls: "lb sm" })
      .text([9.1, 0.8], "2", { dy: 5, cls: "lb sm" })
      .svg(),
  house: () =>
    drawHeight(
      new Diagram(0, 6, 0, 7, 20, {
        pad: 30,
        label: "A pentagon shaped like a house: a rectangle 6 wide and 4 tall with a triangle roof 3 tall",
      })
        .poly([
          [0, 0],
          [6, 0],
          [6, 4],
          [3, 7],
          [0, 4],
        ])
        .line([0, 4], [6, 4], "cut")
        .side([0, 0], [6, 0], "6 cm", [3, 3])
        .side([6, 0], [6, 4], "4 cm", [3, 3]),
      [3, 7],
      [3, 4],
      "3 cm",
    ).svg(),
  diamond: () =>
    new Diagram(0, 6, 0, 4, 26, {
      label: "A diamond inside a 6 by 4 rectangle on a grid, touching the middle of each side",
    })
      .grid(0, 6, 0, 4)
      .poly(rect(0, 0, 6, 4), "frame")
      .poly([
        [3, 0],
        [6, 2],
        [3, 4],
        [0, 2],
      ])
      .svg(),
  rightTrap: () => {
    const corners = [
        [0, 0],
        [9, 0],
        [5, 4],
        [0, 4],
      ],
      inside = middleOf(corners);
    return new Diagram(0, 9, 0, 4, 22, {
      pad: 30,
      label: "A trapezoid with a right angle on the left: bottom 9, top 5, height 4",
    })
      .poly(corners)
      .right([0, 0], [0, 1], [1, 0])
      .right([0, 4], [0, -1], [1, 0])
      .side([0, 0], [9, 0], "9 in", inside)
      .side([0, 4], [5, 4], "5 in", inside)
      .side([0, 0], [0, 4], "4 in", inside)
      .svg();
  },
  lawn: () =>
    new Diagram(0, 10, 0, 8, 18, {
      pad: 30,
      label: "A lawn 10 meters by 8 meters with a triangular flower bed, base 4 meters and height 3 meters",
    })
      .poly(rect(0, 0, 10, 8))
      .poly(
        [
          [3, 2.5],
          [7, 2.5],
          [3.4, 5.5],
        ],
        "hole",
      )
      .side([0, 0], [10, 0], "10 m", [5, 4])
      .side([10, 0], [10, 8], "8 m", [5, 4])
      .text([5, 2.5], "4 m", { dy: 16, cls: "lb sm" })
      .line([3.4, 5.5], [3.4, 2.5], "ht")
      .text([3.4, 3.6], "3 m", { dx: 5, dy: 4, cls: "lb sm hl", anchor: "start" })
      .svg(),

  /* Part E: nets and solids */
  boxNet: () => {
    const d = new Diagram(0, 9, 0, 10, 15, {
      pad: 22,
      label: "Net of a box 5 by 3 by 2 centimeters: two 5 by 3 faces, two 5 by 2 faces, two 3 by 2 faces",
    });
    /* each face: its corner, width, height, and area; front, bottom, back, and top in a column, the sides beside the bottom */
    [
      [2, 8, 5, 2, 10],
      [2, 5, 5, 3, 15],
      [2, 3, 5, 2, 10],
      [2, 0, 5, 3, 15],
      [0, 5, 2, 3, 6],
      [7, 5, 2, 3, 6],
    ].forEach(([x, y, w, h, area]) =>
      d.poly(rect(x, y, w, h)).text([x + w / 2, y + h / 2], area, { dy: 5, cls: "lb sm" }),
    );
    return d
      .text([4.5, 10], "5", { dy: -6, cls: "lb sm" })
      .text([7, 9], "2", { dx: 6, dy: 5, cls: "lb sm", anchor: "start" })
      .text([9, 6.5], "3", { dx: 6, dy: 5, cls: "lb sm", anchor: "start" })
      .svg();
  },
  /* a triangular prism, its back-left edges hidden */
  triPrism: () => {
    const depth = 5,
      [A, B, C] = [
        [0, 0, 0],
        [4, 0, 0],
        [2, 3, 0],
      ],
      [A2, B2, C2] = [
        [0, 0, depth],
        [4, 0, depth],
        [2, 3, depth],
      ];
    return solid(
      [
        [A, B],
        [B, C],
        [C, A],
        [B, B2],
        [C, C2],
        [B2, C2],
      ],
      [
        [A, A2],
        [A2, B2],
        [A2, C2],
      ],
      [
        [A, B, C],
        [B, B2, C2, C],
      ],
      18,
      "A triangular prism",
    );
  },
  /* a square pyramid, its back corner's edges hidden */
  sqPyramid: () => {
    const [A, B, C, D] = [
        [0, 0, 0],
        [4, 0, 0],
        [4, 0, 4],
        [0, 0, 4],
      ],
      top = [2, 4.5, 2];
    return solid(
      [
        [A, B],
        [B, C],
        [top, A],
        [top, B],
        [top, C],
      ],
      [
        [D, A],
        [D, C],
        [D, top],
      ],
      [
        [A, B, top],
        [B, C, top],
      ],
      18,
      "A square pyramid",
    );
  },
  pyramidNet: () => {
    const d = new Diagram(-5, 9, -5, 9, 10, {
      pad: 20,
      label: "Net of a square pyramid: a 4 by 4 square with a triangle on each side, each triangle 5 tall",
    }).poly(rect(0, 0, 4, 4));
    [
      [
        [0, 0],
        [4, 0],
        [2, -5],
      ],
      [
        [4, 0],
        [4, 4],
        [9, 2],
      ],
      [
        [4, 4],
        [0, 4],
        [2, 9],
      ],
      [
        [0, 4],
        [0, 0],
        [-5, 2],
      ],
    ].forEach((corners) => d.poly(corners));
    return d
      .side([0, 0], [4, 0], "4", [2, 2], { gap: -12 })
      .line([2, 4], [2, 9], "ht")
      .text([2, 6.2], "5", { dx: 7, dy: 4, cls: "lb sm hl", anchor: "start" })
      .svg();
  },
  /* four arrangements of six squares, as [col, row] cells: A and C fold into a cube, B and D don't */
  cubeNets: () =>
    '<div class="nets">' +
    Object.entries({
      A: [
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1],
        [1, 2],
      ],
      B: [
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      C: [
        [0, 2],
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1],
        [3, 0],
      ],
      D: [
        [1, 1],
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
      ],
    })
      .map(([name, cells]) => {
        const d = new Diagram(0, 5, 0, 3, 18, { pad: 12, label: `Net ${name}` });
        cells.forEach(([x, y]) => d.poly(rect(x, y, 1, 1)));
        return `<figure class="mini"><figcaption>${name}</figcaption>${d.svg()}</figure>`;
      })
      .join("") +
    "</div>",
  /* a triangular prism's net: rectangles 3, 4, and 5 by 10 in a strip, and the two 3-4-5 triangles on the 4 by 10 one, their
     right angles next to the 3 by 10 face so it folds closed */
  prismNet: () => {
    const d = new Diagram(0, 16, 0, 12, 13, {
      pad: 22,
      label:
        "Net of a triangular prism: rectangles 3 by 10, 4 by 10, and 5 by 10, and two right triangles with legs 3 and 4",
    });
    [
      [9, 3],
      [5, 4],
      [0, 5],
    ].forEach(([y, h]) => d.poly(rect(3, y, 10, h)).text([8, y + h / 2], `${h} × 10`, { dy: 5, cls: "lb sm" }));
    return d
      .poly([
        [3, 9],
        [3, 5],
        [0, 9],
      ])
      .poly([
        [13, 9],
        [13, 5],
        [16, 9],
      ])
      .right([3, 9], [0, -1], [-1, 0], 7)
      .right([13, 9], [0, -1], [1, 0], 7)
      .text([1.5, 9], "3", { dy: -4, cls: "lb sm" })
      .text([14.5, 9], "3", { dy: -4, cls: "lb sm" })
      .text([8, 0], "10", { dy: 16, cls: "lb sm" })
      .svg();
  },

  /* Part F */
  cube4: () => cube(4, 20, "A cube with edges of 4 centimeters", true),

  /* the practice test */
  test1: () =>
    parallelogram(
      12,
      4.9,
      5,
      18,
      ["12 cm", "7 cm", "5 cm"],
      "A parallelogram with base 12 cm, slanted side 7 cm, and height 5 cm",
    ),
  test3: () =>
    triangle(
      [
        [0, 0],
        [5, 0],
        [8, 8],
      ],
      16,
      [[[0, 0], [5, 0], "5 in"]],
      "A triangle with base 5 inches whose 8 inch height falls outside it",
      {
        height: [[8, 8], [8, 0], "8 in"],
        extend: [
          [5, 0],
          [8, 0],
        ],
      },
    ),
  /* which segment is a height: a is a slanted side, b a true height, c a slanted segment inside */
  test4: () =>
    new Diagram(0, 9, 0, 4, 24, {
      pad: 30,
      label: "A parallelogram with the bottom side labeled base, and three segments a, b, and c",
    })
      .poly([
        [0, 0],
        [6, 0],
        [9, 4],
        [3, 4],
      ])
      .side([0, 0], [6, 0], "base", [4.5, 2])
      .text([1.5, 2], "a", { dx: -12, dy: 5, cls: "lb hl" })
      .line([5, 4], [5, 0], "ht")
      .right([5, 0], [0, 1], [1, 0])
      .text([5, 2], "b", { dx: 10, dy: 5, cls: "lb hl", anchor: "start" })
      .line([3, 4], [6, 0], "ht2")
      .text([4.5, 2], "c", { dx: -12, dy: 5, cls: "lb hl" })
      .svg(),
  test5: () =>
    drawHeight(
      new Diagram(0, 14, 0, 5, 18, {
        pad: 30,
        label: "A trapezoid with bottom 14 feet, top 8 feet, and height 5 feet",
      })
        .poly([
          [0, 0],
          [14, 0],
          [11, 5],
          [3, 5],
        ])
        .side([0, 0], [14, 0], "14 ft", [7, 2.5])
        .side([3, 5], [11, 5], "8 ft", [7, 2.5]),
      [3, 5],
      [3, 0],
      "5 ft",
    ).svg(),
  test6: () =>
    new Diagram(0, 6, 0, 5, 26, { label: "A triangle on a grid with corners at (0, 0), (6, 2), and (2, 5)" })
      .grid(0, 6, 0, 5)
      .poly([
        [0, 0],
        [6, 2],
        [2, 5],
      ])
      .svg(),
  /* a triangular pyramid's net: a big triangle split into four */
  test10: () => {
    const r3 = Math.sqrt(3),
      d = new Diagram(0, 6, 0, 3 * r3, 24, {
        pad: 18,
        label: "A net of four triangles: one big triangle split into four",
      }),
      [A, B, C] = [
        [0, 0],
        [6, 0],
        [3, 3 * r3],
      ],
      [ab, bc, ca] = [
        [3, 0],
        [4.5, 1.5 * r3],
        [1.5, 1.5 * r3],
      ];
    [
      [A, ab, ca],
      [ab, B, bc],
      [ca, bc, C],
      [ab, bc, ca],
    ].forEach((corners) => d.poly(corners));
    return d.svg();
  },
  test14: () => cube(3, 22, "A cube with edges of 3 centimeters", false),
};

/* draw each diagram into its placeholder (cubeNets is four small figures, so its placeholder is a div) */
document.querySelectorAll("[data-fig]").forEach((el) => {
  el.insertAdjacentHTML("afterbegin", FIGURES[el.dataset.fig]());
});
