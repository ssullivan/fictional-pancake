/* Learn Finding Volume (Grade 5 Unit 1), chapter 2: Layers of cubes. Its widgets and steps; loaded by layers.html. */
/* boxes to fill by layers: [length, height, width] */
const LAYER_BOXES = [
  [4, 3, 3],
  [5, 4, 2],
  [3, 3, 3],
];
/* Pick a box and fill it one layer at a time, bottom to top (a stepper). */
function wLayers(el) {
  const q = Q(el),
    values = { layers: 1 },
    limits = { layers: [1, 3] };
  let boxIndex = 0;
  el.innerHTML =
    seg(
      "Box",
      LAYER_BOXES.map(([l, h, w], i) => [i, `${l} by ${w} by ${h}`]),
    ) +
    `<div class="wrow">${stepper("layers", "Layers")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [l, h, w] = LAYER_BOXES[boxIndex],
      layer = l * w,
      layers = values.layers;
    press(el, boxIndex);
    q("layers").textContent = layers;
    q("f").innerHTML = prismFig(layersOf(l, h, w, layers), {
      label: `A box ${h} layers tall with ${layers} layers of ${layer} cubes in it`,
    });
    const each = `Each layer is ${l} rows of ${w}: ${l} × ${w} = ${layer} cubes.`;
    q("r").innerHTML =
      layers === h
        ? `${each} The box is full: ${layer} × ${h} = <b>${layer * h} cubes</b>, so its volume is ${layer * h} cubic units.`
        : `${each} ${layers} ${layers === 1 ? "layer" : "layers"}: ${layer} × ${layers} = ${layer * layers} cubes so far. The box holds ${h} layers.`;
  };
  /* a new box: the stepper goes up to its height */
  const chooseBox = (i) => {
    boxIndex = i;
    limits.layers[1] = LAYER_BOXES[i][1];
    values.layers = 1;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    chooseBox(+m);
    draw();
  });
  chooseBox(boxIndex);
  draw();
}
/* the box cut into layers three ways: [id, button, words, the edges across and by a layer, the edge that counts layers] */
const WAYS = [
  ["up", "Bottom to top", "from bottom to top", "l", "w", "h"],
  ["back", "Front to back", "from front to back", "l", "h", "w"],
  ["side", "Left to right", "from left to right", "w", "h", "l"],
];
/* the box the layers are cut from */
const WAY_BOX = { l: 4, h: 3, w: 2 };
/* Cut one box into layers three ways: each way, the layers have a different number of cubes, but the box holds the same. */
function wWays(el) {
  const q = Q(el),
    values = { layers: 1 },
    limits = { layers: [1, 3] };
  let wayIndex = 0;
  el.innerHTML =
    seg(
      "Layers",
      WAYS.map(([id, button], i) => [i, button]),
    ) +
    `<div class="wrow">${stepper("layers", "Layers")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [id, , words, across, by, count] = WAYS[wayIndex],
      { l, h, w } = WAY_BOX,
      perLayer = WAY_BOX[across] * WAY_BOX[by],
      total = WAY_BOX[count],
      layers = values.layers;
    press(el, wayIndex);
    q("layers").textContent = layers;
    q("f").innerHTML = prismFig(layersOf(l, h, w, layers, { dir: id }), {
      label: `A box 4 long, 2 wide, and 3 tall, with ${layers} layers ${words}`,
    });
    const each = `Layers ${words} are ${WAY_BOX[across]} × ${WAY_BOX[by]} = ${perLayer} cubes each.`;
    q("r").innerHTML =
      layers === total
        ? `${each} ${total} layers: ${perLayer} × ${total} = <b>24 cubes</b>. Every way you cut it, the box holds 24.`
        : `${each} ${layers} ${layers === 1 ? "layer" : "layers"} so far: ${perLayer * layers} cubes. It takes ${total} layers.`;
  };
  /* a new way: the stepper goes up to the number of layers that way */
  const chooseWay = (i) => {
    wayIndex = i;
    limits.layers[1] = WAY_BOX[WAYS[i][5]];
    values.layers = 1;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    chooseWay(+m);
    draw();
  });
  chooseWay(wayIndex);
  draw();
}
const STEPS = [
  {
    title: "Count by layers",
    widget: wLayers,
    body: "<p>A box packs cubes in <b>layers</b>. Count the cubes in one layer, then count the layers: multiply instead of counting every cube.</p><p>Pick a box and fill it one layer at a time.</p>",
    check: {
      kind: "num",
      q: "One layer of unit cubes covers the bottom of this box. The box holds 4 layers. How many cubes fill the box?",
      fig: prismFig(layersOf(5, 4, 2, 1), { label: "A box 4 cubes tall with its bottom layer of 10 cubes" }),
      answer: 40,
      unit: "cubes",
      misc: [
        [10, "That’s one layer. The box holds 4 of them."],
        [14, "That adds the layers. 4 layers of 10 is 4 × 10."],
      ],
      explain: "One layer is 5 × 2 = 10 cubes. 4 layers: 10 × 4 = 40 cubes.",
    },
  },
  {
    title: "Layers any way you like",
    widget: wWays,
    body: "<p>Layers don’t have to go bottom to top. A box can be cut into layers front to back, or left to right. The layers change, but the box holds the same number of cubes.</p><p>Pick a way to cut the box, then fill it layer by layer.</p>",
    check: {
      kind: "mc",
      q: "A box of unit cubes is 5 cubes long, 2 wide, and 3 tall. Think of it in layers from left to right. Which expression gives its volume?",
      answer: "a",
      choices: [
        { id: "a", label: "6 × 5" },
        { id: "b", label: "6 + 5" },
        { id: "c", label: "10 × 5" },
      ],
      why: {
        b: "That adds. There are 5 layers of 6 cubes: multiply.",
        c: "Layers of 10 go bottom to top (5 × 2), and there are only 3 of those. Left to right, each layer is 2 × 3 = 6.",
      },
      explain:
        "From left to right, each layer is 2 wide and 3 tall: 2 × 3 = 6 cubes. The box is 5 layers long: 6 × 5 = 30.",
    },
  },
];
