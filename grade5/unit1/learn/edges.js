/* Learn Finding Volume (Grade 5 Unit 1), chapter 3: Length × width × height. Its widgets and steps; loaded by edges.html. */
/* Set a box's length, width, and height (steppers) and multiply them. */
function wEdges(el) {
  const q = Q(el),
    values = { length: 4, width: 3, height: 2 },
    limits = { length: [1, 6], width: [1, 4], height: [1, 5] };
  el.innerHTML =
    `<div class="wrow">${stepper("length", "Length")}${stepper("width", "Width")}${stepper("height", "Height")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { length, width, height } = values,
      base = length * width;
    ["length", "width", "height"].forEach((k) => (q(k).textContent = values[k]));
    q("f").innerHTML = prismFig(
      [box(length, height, width, { grid: true, lab: { l: `${length}`, h: `${height}`, w: `${width}` } })],
      { label: `A box ${length} long, ${width} wide, and ${height} tall` },
    );
    q("r").innerHTML =
      `length × width × height = ${length} × ${width} × ${height}. ` +
      `${length} × ${width} = ${base} ${base === 1 ? "cube" : "cubes"} in a layer, and ${height} ${height === 1 ? "layer" : "layers"}: ` +
      `<b>${base * height} ${base * height === 1 ? "cubic unit" : "cubic units"}</b>.`;
  };
  steppers(el, values, limits, draw);
  draw();
}
/* the box whose base can be any face */
const BASE_BOX = { l: 5, h: 3, w: 2 };
/* the faces that can be the base: [id, button, the base's two edges, the height edge, the base's place in the box] */
const BASES = [
  ["bottom", "Bottom", "l", "w", "h"],
  ["front", "Front", "l", "h", "w"],
  ["side", "Side", "w", "h", "l"],
];
/* Pick a face of the box to be its base: the base layer turns cyan, and base × height gives the same volume every time. */
function wBase(el) {
  const q = Q(el);
  let baseIndex = 0;
  el.innerHTML =
    seg(
      "Base",
      BASES.map(([id, button], i) => [i, button]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [id, button, across, by, tall] = BASES[baseIndex],
      { l, h, w } = BASE_BOX,
      base = BASE_BOX[across] * BASE_BOX[by],
      height = BASE_BOX[tall],
      labels = { l: `${l}`, h: `${h}`, w: `${w}` };
    press(el, baseIndex);
    /* the layer against the base in cyan, the rest of the box gold */
    const baseLayer = {
        bottom: box(l, 1, w, { cls: "b", grid: true }),
        front: box(l, h, 1, { cls: "b", grid: true }),
        side: box(1, h, w, { cls: "b", grid: true }),
      }[id],
      rest = {
        bottom: box(l, h - 1, w, { at: [0, 1, 0], grid: true }),
        front: box(l, h, w - 1, { at: [0, 0, 1], grid: true }),
        side: box(l - 1, h, w, { at: [1, 0, 0], grid: true }),
      }[id];
    q("f").innerHTML = prismFig([rest, baseLayer, box(l, h, w, { ghost: true, lab: labels })], {
      label: `A box 5 long, 2 wide, and 3 tall, with its ${button.toLowerCase()} face as the base`,
    });
    q("r").innerHTML =
      `Base: ${BASE_BOX[across]} × ${BASE_BOX[by]} = ${base} square units, one layer of ${base} cubes. ` +
      `Height: ${height}. Volume = base × height = ${base} × ${height} = <b>30 cubic units</b>.`;
  };
  onPick(el, (m) => {
    baseIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Multiply the edges",
    widget: wEdges,
    body: "<p>A box’s length and width tell how many cubes are in a layer, and its height tells how many layers there are. So its volume is <b>length × width × height</b>.</p><p>Change the edges and watch the volume.</p>",
    check: {
      kind: "num",
      q: "What is the volume of this box?",
      fig: prismFig([box(6, 3, 2, { lab: { l: "6 cm", h: "3 cm", w: "2 cm" } })], {
        label: "A box 6 cm long, 2 cm wide, and 3 cm tall",
      }),
      answer: 36,
      unit: "cubic cm",
      misc: [
        [11, "That adds the edges. Volume is length × width × height: 6 × 2 × 3."],
        [12, "That’s the base, 6 × 2. Multiply by the height, 3, too."],
      ],
      explain: "6 × 2 = 12 cubes in a layer, and 3 layers: 12 × 3 = 36 cubic cm.",
    },
  },
  {
    title: "Base × height",
    widget: wBase,
    body: "<p>The <b>base</b> of a box is a face it stands on. Its area is how many cubes fit in one layer against it, and the <b>height</b> is how many layers there are: volume = <b>base × height</b>.</p><p>Any face can be the base. Pick one and see that the volume comes out the same.</p>",
    check: {
      kind: "num",
      q: "The base of a box has an area of 20 square cm. The box is 3 cm tall. What is its volume?",
      answer: 60,
      unit: "cubic cm",
      misc: [
        [23, "That adds. The base is one layer of 20 cubes, and there are 3 layers: multiply."],
        [20, "That’s the base. It’s one layer; the box is 3 layers tall."],
      ],
      explain: "Volume = base × height: 20 × 3 = 60 cubic cm.",
    },
  },
];
