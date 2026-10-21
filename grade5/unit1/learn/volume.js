/* Learn Finding Volume (Grade 5 Unit 1), chapter 1: What is volume? Its widgets and steps; loaded by volume.html. */
/* figures that each take 12 unit cubes: [name, heights[z][x] (row 0 in front)] */
const FIGURES = [
  [
    "Tower",
    [
      [3, 3],
      [3, 3],
    ],
  ],
  [
    "Stairs",
    [
      [1, 2, 3],
      [1, 2, 3],
    ],
  ],
  ["Wall", [[2, 2, 2, 2, 2, 2]]],
  [
    "Bench",
    [
      [3, 1, 1, 1],
      [3, 1, 1, 1],
    ],
  ],
];
/* the cells of a figure in the order you'd build it: bottom layer first, back row before front, left to right */
const buildOrder = (heights) =>
  heights
    .flatMap((row, z) => row.flatMap((tall, x) => range(tall).map((y) => [x, y, z])))
    .sort((a, b) => a[1] - b[1] || b[2] - a[2] || a[0] - b[0]);
/* Pick a figure and build it one cube at a time (a stepper). */
function wBuild(el) {
  /* the stepper's value: placed, how many cubes are down so far */
  const q = Q(el),
    values = { placed: 12 },
    limits = { placed: [0, 12] };
  let figureIndex = 0;
  el.innerHTML =
    seg(
      "Figure",
      FIGURES.map(([name], i) => [i, name]),
    ) +
    `<div class="wrow">${stepper("placed", "Cubes")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [name, heights] = FIGURES[figureIndex],
      cells = buildOrder(heights).slice(0, values.placed);
    press(el, figureIndex);
    q("placed").textContent = values.placed;
    /* an empty table still needs something to draw: a dashed outline where the figure goes */
    q("f").innerHTML = prismFig(
      [box(heights[0].length, Math.max(...heights.flat()), heights.length, { ghost: true }), ...cubesOf(cells)],
      { label: `${name}: ${values.placed} unit cubes` },
    );
    q("r").innerHTML =
      values.placed === 12
        ? `It’s made of 12 unit cubes, so its <b>volume is 12 cubic units</b>. Every figure here takes 12 cubes: different shapes, the same volume.`
        : `${values.placed} of 12 cubes. Tap + to add the next cube.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    figureIndex = +m;
    values.placed = 12;
    draw();
  });
  draw();
}
/* boxes to fill: [length, height, width] */
const FILL_BOXES = [
  [3, 2, 2],
  [4, 2, 3],
  [4, 3, 2],
];
/* Pick a box and fill it with cubes, one at a time: some of the cubes inside can't be seen once it's full. */
function wFill(el) {
  const q = Q(el),
    values = { packed: 0 },
    limits = { packed: [0, 12] };
  let boxIndex = 0;
  el.innerHTML =
    seg(
      "Box",
      FILL_BOXES.map(([l, h, w], i) => [i, `${l} by ${w} by ${h}`]),
    ) +
    `<div class="wrow">${stepper("packed", "Cubes")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [l, h, w] = FILL_BOXES[boxIndex],
      all = l * h * w,
      /* the cubes on the front, top, or right show; the rest are hidden inside or at the back */
      seen = all - (l - 1) * (h - 1) * (w - 1),
      cells = buildOrder(range(w).map(() => range(l).map(() => h))).slice(0, values.packed);
    press(el, boxIndex);
    q("packed").textContent = values.packed;
    q("f").innerHTML = prismFig([box(l, h, w, { ghost: true }), ...cubesOf(cells)], {
      label: `A box ${l} cubes long, ${w} wide, and ${h} tall with ${values.packed} cubes in it`,
    });
    q("r").innerHTML =
      values.packed === all
        ? `The box is full. It holds <b>${all} cubes</b>, so its volume is ${all} cubic units. You can see only ${seen} of them: ${all - seen} are hidden inside or at the back.`
        : `${values.packed} ${values.packed === 1 ? "cube" : "cubes"} in. ${all - values.packed} more will fill the box.`;
  };
  /* a new box: the stepper goes up to the number of cubes it holds */
  const chooseBox = (i) => {
    const [l, h, w] = FILL_BOXES[i];
    boxIndex = i;
    limits.packed[1] = l * h * w;
    values.packed = 0;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    chooseBox(+m);
    draw();
  });
  chooseBox(boxIndex);
  draw();
}
const STEPS = [
  {
    title: "Volume is how many cubes fill a space",
    widget: wBuild,
    body: "<p>A <b>unit cube</b> is a cube 1 unit long on every edge. The <b>volume</b> of a figure is how many unit cubes it takes to build it, with no gaps and no overlaps. We say it in <b>cubic units</b>.</p><p>Pick a figure, then take it apart and build it again one cube at a time.</p>",
    check: {
      kind: "num",
      q: "These stairs are built from unit cubes. Every cube sits on the table or on another cube. What is their volume?",
      fig: prismFig(
        columnsOf([
          [3, 2, 1],
          [3, 2, 1],
        ]),
        { label: "Stairs 3, 2, and 1 cubes tall, two rows deep" },
      ),
      answer: 12,
      unit: "cubic units",
      misc: [
        [6, "That counts only the front row. The same stairs are behind it: 6 more cubes."],
        [9, "That counts only the cubes you can see. Each top cube in the back row has cubes under it."],
      ],
      explain: "Front row: 3 + 2 + 1 = 6. Back row: 3 + 2 + 1 = 6. 6 + 6 = 12 cubic units.",
    },
  },
  {
    title: "Count the cubes you can’t see",
    widget: wFill,
    body: "<p>When a box is full of cubes, you can’t see them all. Some are hidden inside or at the back, but they still count toward the volume.</p><p>Pick a box and fill it one cube at a time. Watch how many you can still see.</p>",
    check: {
      kind: "num",
      q: "This box is packed full of unit cubes. What is its volume?",
      fig: prismFig([box(3, 2, 2, { grid: true })], { label: "A box of unit cubes, 3 long, 2 wide, and 2 tall" }),
      answer: 12,
      unit: "cubic units",
      misc: [
        [10, "That counts only the cubes you can see. 2 more are hidden at the back."],
        [7, "That adds the edges. Count the cubes: 6 in the bottom layer and 6 on top."],
      ],
      explain: "The bottom layer has 3 rows of 2 = 6 cubes, and the top layer has 6 more. 6 + 6 = 12 cubic units.",
    },
  },
];
