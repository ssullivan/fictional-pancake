/* Learn Finding Volume (Grade 5 Unit 1), chapter 6: Solve volume problems. Its widgets and steps; loaded by solve.html. */
/* volumes to reach on a base 4 ft by 3 ft */
const TARGETS = [24, 36, 48];
/* Pick a volume, then stack layers on the base (a stepper) until the box holds exactly that much. */
function wMissing(el) {
  const q = Q(el),
    values = { height: 1 },
    limits = { height: [1, 6] };
  let targetIndex = 0;
  el.innerHTML =
    seg(
      "Volume",
      TARGETS.map((v, i) => [i, `${v} cubic ft`]),
    ) +
    `<div class="wrow">${stepper("height", "Height")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const target = TARGETS[targetIndex],
      height = values.height,
      volume = 12 * height;
    press(el, targetIndex);
    q("height").textContent = height;
    q("f").innerHTML = prismFig(
      [
        box(4, height, 3, {
          grid: true,
          cls: volume === target ? "g" : "",
          lab: { l: "4 ft", w: "3 ft", h: `${height} ft` },
        }),
      ],
      { label: `A box 4 ft by 3 ft, ${height} ft tall` },
    );
    q("r").innerHTML =
      `4 × 3 × ${height} = ${volume} cubic feet. ` +
      (volume === target
        ? `<span class="ok">That’s it: <b>${target} ÷ 12 = ${height} ft</b> tall.</span>`
        : volume < target
          ? `Too small for ${target}. Add a layer.`
          : `Too big for ${target}. Take a layer off.`);
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    targetIndex = +m;
    values.height = 1;
    draw();
  });
  draw();
}
/* pairs of boxes to compare: each [length, width, height] in inches */
const PAIRS = [
  [
    [4, 3, 2],
    [6, 2, 2],
  ],
  [
    [5, 2, 3],
    [4, 4, 2],
  ],
  [
    [6, 3, 2],
    [3, 3, 3],
  ],
];
/* Pick two boxes: which holds more, how much more, and how much both hold together. */
function wCompare(el) {
  const q = Q(el);
  let pairIndex = 0;
  el.innerHTML =
    seg(
      "Boxes",
      PAIRS.map((pair, i) => [i, `Pair ${i + 1}`]),
    ) + `<div class="fig pair" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const pair = PAIRS[pairIndex],
      volumes = pair.map(([l, w, h]) => l * w * h),
      [a, b] = volumes;
    press(el, pairIndex);
    q("f").innerHTML = pair
      .map(([l, w, h], i) =>
        prismFig([box(l, h, w, { cls: i ? "b" : "", lab: { l: `${l} in`, h: `${h} in`, w: `${w} in` } })], {
          max: 26,
          label: `Box ${i ? "B" : "A"}: ${l} by ${w} by ${h} inches`,
        }),
      )
      .join("");
    const work = pair
      .map(([l, w, h], i) => `${i ? "Blue" : "Gold"}: ${l} × ${w} × ${h} = ${volumes[i]} cubic in.`)
      .join(" ");
    q("r").innerHTML =
      `${work} ` +
      (a === b
        ? "They hold the same: different shapes, the same volume."
        : `The ${a > b ? "gold" : "blue"} box holds ${Math.max(a, b)} − ${Math.min(a, b)} = <b>${Math.abs(a - b)} cubic in</b> more.`) +
      ` Together they hold ${a} + ${b} = ${a + b} cubic in.`;
  };
  onPick(el, (m) => {
    pairIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Find a missing edge",
    widget: wMissing,
    body: "<p>When you know the volume and the base, the height is how many layers of the base make the volume: <b>divide the volume by the base</b>.</p><p>Pick a volume, then change the height until the box holds just that much.</p>",
    check: {
      kind: "num",
      q: "A crate has a volume of 60 cubic feet. Its base is 5 ft by 4 ft. How tall is it?",
      answer: 3,
      unit: "feet",
      misc: [
        [40, "That subtracts the base. The base is one layer of 20 cubes: how many layers make 60?"],
        [12, "That divides by the length only. Divide by the whole base, 5 × 4 = 20."],
      ],
      explain: "The base is 5 × 4 = 20 square feet. 20 × ? = 60, and 60 ÷ 20 = 3, so the crate is 3 ft tall.",
    },
  },
  {
    title: "Compare and combine boxes",
    widget: wCompare,
    body: "<p>To compare two boxes, find each volume and <b>subtract</b>. To find how much several boxes hold together, <b>add</b> their volumes, or multiply when they’re all the same size.</p><p>Pick a pair of boxes.</p>",
    check: {
      kind: "num",
      q: "Han packs 3 shoeboxes, each 10 in long, 5 in wide, and 4 in tall. What is their total volume?",
      answer: 600,
      unit: "cubic inches",
      misc: [
        [200, "That’s one shoebox. There are 3."],
        [203, "That adds 3. 3 boxes of 200 cubic inches each: multiply."],
      ],
      explain: "One shoebox: 10 × 5 × 4 = 200 cubic inches. 3 of them: 200 × 3 = 600 cubic inches.",
    },
  },
];
