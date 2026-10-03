/* Learn Area & Surface Area (Grade 6 Unit 1), chapter 5: Nets & surface area. Its widgets and steps; loaded by nets.html. */
/* the net of an l by w by h box: the bottom, with the front, back, left, and right around it, and the top off the front */
function rectNet(l, w, h) {
  const x0 = h,
    y0 = h;
  return {
    faces: [
      { id: "bottom", name: "Bottom", poly: Rect(x0, y0, x0 + l, y0 + w), col: 0, dims: `${l} × ${w}`, area: l * w },
      {
        id: "front",
        name: "Front",
        poly: Rect(x0, y0 + w, x0 + l, y0 + w + h),
        parent: "bottom",
        hinge: [
          [x0, y0 + w],
          [x0 + l, y0 + w],
        ],
        col: 1,
        dims: `${l} × ${h}`,
        area: l * h,
      },
      {
        id: "back",
        name: "Back",
        poly: Rect(x0, 0, x0 + l, y0),
        parent: "bottom",
        hinge: [
          [x0, y0],
          [x0 + l, y0],
        ],
        col: 1,
        dims: `${l} × ${h}`,
        area: l * h,
      },
      {
        id: "left",
        name: "Left",
        poly: Rect(0, y0, x0, y0 + w),
        parent: "bottom",
        hinge: [
          [x0, y0],
          [x0, y0 + w],
        ],
        col: 2,
        dims: `${w} × ${h}`,
        area: w * h,
      },
      {
        id: "right",
        name: "Right",
        poly: Rect(x0 + l, y0, x0 + l + h, y0 + w),
        parent: "bottom",
        hinge: [
          [x0 + l, y0],
          [x0 + l, y0 + w],
        ],
        col: 2,
        dims: `${w} × ${h}`,
        area: w * h,
      },
      {
        id: "top",
        name: "Top",
        poly: Rect(x0, y0 + w + h, x0 + l, y0 + 2 * w + h),
        parent: "front",
        hinge: [
          [x0, y0 + w + h],
          [x0 + l, y0 + w + h],
        ],
        col: 0,
        dims: `${l} × ${w}`,
        area: l * w,
      },
    ],
  };
}
/* right-triangle prism: legs 3 and 4, long side 5, length 6 */
function triPrismNet() {
  /* the 5 rectangle folds past 90° to meet the 3 rectangle: angle a is the triangle's corner opposite the 3 side */
  const L = 6,
    a = Math.atan2(3, 4);
  return {
    faces: [
      { id: "r4", name: "Rectangle", poly: Rect(3, 3, 7, 3 + L), col: 2, dims: "4 × 6", area: 24 },
      {
        id: "r3",
        name: "Rectangle",
        poly: Rect(0, 3, 3, 3 + L),
        parent: "r4",
        hinge: [
          [3, 3],
          [3, 3 + L],
        ],
        col: 1,
        dims: "3 × 6",
        area: 18,
      },
      {
        id: "r5",
        name: "Rectangle",
        poly: Rect(7, 3, 12, 3 + L),
        parent: "r4",
        hinge: [
          [7, 3],
          [7, 3 + L],
        ],
        angle: Math.PI - a,
        col: 3,
        dims: "5 × 6",
        area: 30,
      },
      {
        id: "t1",
        name: "Triangle",
        poly: [
          [3, 3 + L],
          [7, 3 + L],
          [3, 6 + L],
        ],
        parent: "r4",
        hinge: [
          [3, 3 + L],
          [7, 3 + L],
        ],
        col: 0,
        dims: "½ × 4 × 3",
        area: 6,
      },
      {
        id: "t2",
        name: "Triangle",
        poly: [
          [3, 3],
          [7, 3],
          [3, 0],
        ],
        parent: "r4",
        hinge: [
          [3, 3],
          [7, 3],
        ],
        col: 0,
        dims: "½ × 4 × 3",
        area: 6,
      },
    ],
  };
}
/* square pyramid: base b, triangle faces with height s */
function pyramidNet(b, s) {
  /* each triangle folds up until its apex meets the others over the middle: the angle comes from half the base over the slant height s */
  const x0 = s,
    y0 = s,
    m = b / 2,
    angle = Math.PI - Math.acos(m / s),
    T = (poly, hinge, id) => ({
      id,
      name: "Triangle",
      poly,
      parent: "base",
      hinge,
      angle,
      col: 1,
      dims: `½ × ${b} × ${s}`,
      area: (b * s) / 2,
    });
  return {
    faces: [
      { id: "base", name: "Base", poly: Rect(x0, y0, x0 + b, y0 + b), col: 0, dims: `${b} × ${b}`, area: b * b },
      T(
        [
          [x0, y0],
          [x0 + b, y0],
          [x0 + m, y0 - s],
        ],
        [
          [x0, y0],
          [x0 + b, y0],
        ],
        "t1",
      ),
      T(
        [
          [x0, y0 + b],
          [x0 + b, y0 + b],
          [x0 + m, y0 + b + s],
        ],
        [
          [x0, y0 + b],
          [x0 + b, y0 + b],
        ],
        "t2",
      ),
      T(
        [
          [x0, y0],
          [x0, y0 + b],
          [x0 - s, y0 + m],
        ],
        [
          [x0, y0],
          [x0, y0 + b],
        ],
        "t3",
      ),
      T(
        [
          [x0 + b, y0],
          [x0 + b, y0 + b],
          [x0 + b + s, y0 + m],
        ],
        [
          [x0 + b, y0],
          [x0 + b, y0 + b],
        ],
        "t4",
      ),
    ],
  };
}
/* six unit squares; each folds 90° up from its neighbor, starting at the square with the most neighbors */
function cubeNet(cells, valid) {
  const key = (c, r) => c + "," + r,
    has = new Set(cells.map((c) => key(...c)));
  const neighbors = ([c, r]) =>
    [
      [c + 1, r],
      [c - 1, r],
      [c, r + 1],
      [c, r - 1],
    ].filter((p) => has.has(key(...p)));
  const root = cells.reduce((a, b) => (neighbors(b).length > neighbors(a).length ? b : a)),
    sq = (c, r) => Rect(c, r, c + 1, r + 1);
  const faces = [{ id: key(...root), name: "Square", poly: sq(...root), col: 0, dims: "1 × 1", area: 1 }],
    seen = new Set([key(...root)]),
    todo = [root];
  /* breadth first from the root: each new square hinges on the side it shares with the square it was reached from */
  while (todo.length) {
    const cell = todo.shift(),
      [c, r] = cell;
    for (const next of neighbors(cell)) {
      const k = key(...next);
      if (seen.has(k)) continue;
      seen.add(k);
      todo.push(next);
      const [c2, r2] = next,
        hinge =
          c2 > c
            ? [
                [c + 1, r],
                [c + 1, r + 1],
              ]
            : c2 < c
              ? [
                  [c, r],
                  [c, r + 1],
                ]
              : r2 > r
                ? [
                    [c, r + 1],
                    [c + 1, r + 1],
                  ]
                : [
                    [c, r],
                    [c + 1, r],
                  ];
      faces.push({
        id: k,
        name: "Square",
        poly: sq(...next),
        parent: key(...cell),
        hinge,
        col: faces.length,
        dims: "1 × 1",
        area: 1,
      });
    }
  }
  return { faces, valid };
}
/* the nets to try, and whether each folds into a cube */
const CUBE_NETS = [
  {
    cells: [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
    ],
    valid: true,
  },
  {
    cells: [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    valid: false,
  },
  {
    cells: [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
      [2, 2],
      [3, 2],
    ],
    valid: true,
  },
  {
    cells: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [1, 1],
    ],
    valid: false,
  },
  {
    cells: [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
    ],
    valid: true,
  },
  {
    cells: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [3, 1],
      [4, 1],
    ],
    valid: true,
  },
];
/* a small picture of a cube net, 10 pixels a square */
const thumbSvg = (cells) => {
  const size = 10,
    xs = cells.map((c) => c[0]),
    ys = cells.map((c) => c[1]),
    w = (Math.max(...xs) + 1) * size,
    h = (Math.max(...ys) + 1) * size;
  return `<svg viewBox="-2 -2 ${w + 4} ${h + 4}" aria-hidden="true">${cells.map(([c, r]) => `<rect x="${c * size}" y="${r * size}" width="${size}" height="${size}" fill="rgba(127,227,255,.35)" stroke="#7fe3ff" stroke-width="1.2"/>`).join("")}</svg>`;
};
/* fold a triangular prism's or a square pyramid's net and tap its faces to add up the surface area */
function wPick(el) {
  const q = Q(el),
    SOL = {
      tri: { label: "Triangular prism", net: triPrismNet },
      pyr: { label: "Square pyramid", net: () => pyramidNet(4, 3) },
    };
  let solid = "tri",
    api = null;
  el.innerHTML = `<div class="seg" role="group" aria-label="Shape">${Object.entries(SOL)
    .map(([id, choice]) => `<button type="button" data-m="${id}">${choice.label}</button>`)
    .join("")}</div><div data-st></div>`;
  const go = () => {
    if (api) api.dispose();
    api = solid3D(q("st"), SOL[solid].net(), { fold: 0, slider: true, count: true });
    el.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.m === solid));
  };
  el.querySelectorAll("[data-m]").forEach(
    (b) =>
      (b.onclick = () => {
        if (solid !== b.dataset.m) {
          solid = b.dataset.m;
          go();
        }
      }),
  );
  go();
  return () => api && api.dispose();
}
/* Predict whether a net folds into a cube, then fold it. tried: each net's result ('yes' or 'no'); current: the net shown;
   prediction: 'yes', 'no', or null before one is made (folding is locked until then) */
function wCubeNets(el) {
  const q = Q(el),
    tried = {};
  let current = -1,
    api = null,
    prediction = null;
  el.innerHTML = `<div class="thumbs" data-th role="group" aria-label="Pick a net"></div><div data-st></div><div class="wrow" data-pr></div><p class="readout" data-res></p>`;
  const thumbs = () => {
    q("th").innerHTML = CUBE_NETS.map(
      (net, i) =>
        `<button type="button" class="thumb${i === current ? " cur" : ""}" data-i="${i}" aria-label="Net ${i + 1}${tried[i] ? (tried[i] === "yes" ? ", folds into a cube" : ", does not fold into a cube") : ""}">${thumbSvg(net.cells)}<span class="${tried[i] || ""}">${tried[i] === "yes" ? "✓ cube" : tried[i] === "no" ? "✗ not" : "Net " + (i + 1)}</span></button>`,
    ).join("");
  };
  /* once it's folded: was the prediction right? A net that won't fold shows its overlapping faces in red */
  const reveal = () => {
    if (!prediction || !api) return;
    const result = api.check(),
      ok = result.closed,
      right = (prediction === "yes") === ok;
    tried[current] = ok ? "yes" : "no";
    thumbs();
    if (!ok && api.markBad) api.markBad(result.overlaps.flat());
    q("res").innerHTML =
      `${right ? '<span class="ok">You predicted it!</span>' : '<span class="no">Surprise!</span>'} ${ok ? "It folds into a cube: all 6 faces land in different places and close it up." : "It doesn’t fold into a cube. Two faces land on the same spot (shown in red), so one side of the cube is left open."}${Object.keys(tried).length < CUBE_NETS.length ? " Try another net." : " You tried them all!"}`;
  };
  /* show net i, unfolded and locked, and ask for a prediction */
  const choose = (i) => {
    if (api) api.dispose();
    current = i;
    prediction = null;
    thumbs();
    api = solid3D(q("st"), cubeNet(CUBE_NETS[i].cells, CUBE_NETS[i].valid), {
      fold: 0,
      slider: true,
      labels: false,
      locked: true,
      onFolded: reveal,
    });
    q("pr").innerHTML =
      `<span class="note" style="margin:0">Will it fold into a cube?</span><button type="button" class="ghost-btn" data-p="yes">Yes, a cube</button><button type="button" class="ghost-btn" data-p="no">No</button>`;
    q("pr")
      .querySelectorAll("[data-p]")
      .forEach(
        (b) =>
          (b.onclick = () => {
            prediction = b.dataset.p;
            q("pr")
              .querySelectorAll("[data-p]")
              .forEach((other) => {
                other.disabled = true;
                other.style.borderColor = other === b ? "var(--gold)" : "";
              });
            api.setLocked(false);
            q("res").innerHTML = "Now fold it: tap <b>Fold it</b> or use the slider.";
          }),
      );
    q("res").innerHTML = "Make a prediction first.";
  };
  q("th").addEventListener("click", (e) => {
    const b = e.target.closest("[data-i]");
    if (b) choose(+b.dataset.i);
  });
  choose(0);
  return () => api && api.dispose();
}
/* the quick checks' figures */
const F = {};
F.net421 = netSvg(rectNet(4, 2, 1));
F.pyr65 = netSvg(pyramidNet(6, 5), { u: 26 });
F.cubeNetCheck = netSvg(
  cubeNet(
    [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
      [2, 2],
    ],
    true,
  ),
  { labels: false, u: 44 },
);
const STEPS = [
  {
    title: "What is surface area?",
    widget: (el) => {
      const a = solid3D(el, rectNet(4, 3, 2), { fold: 1, count: true });
      return a.dispose;
    },
    body: "<p>A <b>polyhedron</b> is a 3D shape whose faces are all polygons. Its <b>surface area</b> is the total area of all its faces: how much paper it would take to cover it with no gaps or overlaps.</p><p>Drag to turn this box. Tap each face to add its area, including the ones on the back and the bottom.</p>",
    check: {
      kind: "mc",
      q: "How many faces does a rectangular prism (a box) have?",
      choices: [
        { id: "3", label: "3" },
        { id: "4", label: "4" },
        { id: "6", label: "6" },
        { id: "8", label: "8" },
      ],
      answer: "6",
      why: {
        3: "You can only see 3 faces at a time, but there are more on the back, side, and bottom.",
        4: "Count again: top and bottom, front and back, left and right.",
        8: "A box has 8 corners (vertices), but its faces are the flat sides.",
      },
      explain: "Top and bottom, front and back, left and right: 6 faces. Opposite faces match.",
    },
  },
  {
    title: "Unfold it into a net",
    widget: (el) => {
      const a = solid3D(el, rectNet(4, 3, 2), { fold: 0, slider: true, count: true });
      return a.dispose;
    },
    body: "<p>A <b>net</b> is a flat pattern that folds up into a 3D shape. Each face appears in the net exactly once, so adding up the net gives the surface area.</p><p>Fold and unfold the box. Matching colors show matching faces.</p>",
    check: {
      kind: "num",
      unit: "square units",
      answer: 28,
      fig: F.net421,
      q: "This net folds into a 4 × 2 × 1 box. What is the box’s surface area?",
      misc: [
        [14, "That’s only 3 faces. The net has 6: each pair of matching faces counts twice."],
        [8, "4 × 2 × 1 = 8 is the volume. Surface area adds the areas of all 6 faces."],
      ],
      explain: "8 + 8 + 4 + 4 + 2 + 2 = 28 square units.",
    },
  },
  {
    title: "Prisms and pyramids",
    widget: wPick,
    body: "<p>A <b>prism</b> has two matching bases joined by rectangles. A <b>pyramid</b> has one base and triangles that meet at a point.</p><p>Pick a shape, fold it up, and tap faces to add up its surface area.</p>",
    check: {
      kind: "num",
      unit: "square units",
      answer: 96,
      fig: F.pyr65,
      q: "This net folds into a square pyramid. What is its surface area?",
      misc: [
        [156, "Each triangle is ½ × 6 × 5 = 15, not 6 × 5 = 30."],
        [60, "Don’t forget the square base: 6 × 6 = 36."],
        [51, "There are 4 triangles, one on each side of the base."],
      ],
      explain: "Base 6 × 6 = 36. Each triangle ½ × 6 × 5 = 15, and there are 4: 60. 36 + 60 = 96 square units.",
    },
  },
  {
    title: "Will it fold into a cube?",
    widget: wCubeNets,
    body: "<p>Every cube net has 6 squares, but not every set of 6 squares folds into a cube.</p><p>Pick a net, predict, then fold it to find out.</p>",
    check: {
      kind: "mc",
      fig: F.cubeNetCheck,
      q: "Will this net fold into a cube?",
      choices: [
        { id: "yes", label: "Yes" },
        { id: "no", label: "No" },
      ],
      answer: "yes",
      why: {
        no: "It does fold: the row of 4 wraps around the sides, and the two squares on the ends become the top and bottom.",
      },
      explain:
        "The row of 4 wraps around to make the sides. The square above and the square below close the top and bottom.",
    },
  },
];
