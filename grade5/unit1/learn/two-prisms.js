/* Learn Finding Volume (Grade 5 Unit 1), chapter 5: Figures made of prisms. Its widgets and steps; loaded by two-prisms.html. */
/* the L-shaped figure's edges labels: the left part 2 ft long and 4 ft tall, the right part 3 ft long and 2 ft tall, all 3 ft
   deep; the labels stay put whichever way it's cut */
const L_NOTES = [
  ["2 ft", [1, 0, 0], "below"],
  ["3 ft", [3.5, 0, 0], "below"],
  ["4 ft", [0, 2, 0], "left"],
  ["2 ft", [5, 1, 3], "right"],
  ["3 ft", [5, 0, 1.5], "edge"],
];
/* the ways to find its volume: [id, button, the boxes, what the readout says] */
const CUTS = [
  [
    "upright",
    "Cut up and down",
    [prismBox(2, 4, 3), prismBox(3, 2, 3, { at: [2, 0, 0], cls: "b" })],
    "Gold: 2 × 3 × 4 = 24. Blue: 3 × 3 × 2 = 18. Add: 24 + 18 = <b>42 cubic feet</b>.",
  ],
  [
    "across",
    "Cut across",
    [prismBox(5, 2, 3), prismBox(2, 2, 3, { at: [0, 2, 0], cls: "b" })],
    "Gold: 5 × 3 × 2 = 30 (the bottom is 2 + 3 = 5 ft long). Blue: 2 × 3 × 2 = 12 (the top is 4 − 2 = 2 ft tall). Add: 30 + 12 = <b>42 cubic feet</b>.",
  ],
  [
    "subtract",
    "Fill in and subtract",
    [prismBox(3, 2, 3, { at: [2, 2, 0], ghost: true }), prismBox(2, 4, 3), prismBox(3, 2, 3, { at: [2, 0, 0] })],
    "Fill in the corner to make a box: 5 × 3 × 4 = 60. Take away the empty corner: 3 × 3 × 2 = 18. 60 − 18 = <b>42 cubic feet</b>.",
  ],
];
/* Pick a way to split the L-shaped figure into boxes: every way gives the same volume. */
function wSplit(el) {
  const q = Q(el);
  let cutIndex = 0;
  el.innerHTML =
    seg(
      "Way",
      CUTS.map(([id, button], i) => [i, button]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [id, button, boxes, says] = CUTS[cutIndex];
    press(el, cutIndex);
    q("f").innerHTML = prismFig(boxes, { notes: L_NOTES, label: `An L-shaped figure: ${button.toLowerCase()}` });
    q("r").innerHTML = says;
  };
  onPick(el, (m) => {
    cutIndex = +m;
    draw();
  });
  draw();
}
/* Change the blue box's length and height (steppers) and watch the expression for the whole figure change. */
function wExpr(el) {
  const q = Q(el),
    values = { length: 3, height: 2 },
    limits = { length: [1, 4], height: [1, 3] };
  el.innerHTML =
    `<div class="wrow">${stepper("length", "Blue length")}${stepper("height", "Blue height")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { length, height } = values,
      gold = 2 * 3 * 4,
      blue = length * 3 * height;
    q("length").textContent = length;
    q("height").textContent = height;
    q("f").innerHTML = prismFig(
      [
        prismBox(2, 4, 3, { lab: { l: "2", h: "4" } }),
        prismBox(length, height, 3, { at: [2, 0, 0], cls: "b", lab: { l: `${length}`, w: "3", hr: `${height}` } }),
      ],
      { label: `A gold box 2 by 3 by 4 and a blue box ${length} by 3 by ${height}` },
    );
    q("r").innerHTML =
      `(2 × 3 × 4) + (${length} × 3 × ${height}) = ${gold} + ${blue} = <b>${gold + blue} cubic units</b>`;
  };
  steppers(el, values, limits, draw);
  draw();
}
const STEPS = [
  {
    title: "Split a figure into boxes",
    widget: wSplit,
    body: "<p>Some figures aren’t one box, but they’re made of boxes. Split the figure into two boxes, find each volume, and <b>add</b>. Or fill in the missing corner to make one big box, and <b>subtract</b> the corner.</p><p>Pick a way to find the volume of this figure.</p>",
    check: {
      kind: "num",
      q: "This figure is made of two boxes, gold and blue. What is its volume?",
      fig: prismFig(
        [
          prismBox(6, 2, 2, { lab: { l: "6 cm", w: "2 cm", hr: "2 cm" } }),
          prismBox(2, 3, 2, { at: [0, 2, 0], cls: "b", lab: { lt: "2 cm", h: "3 cm" } }),
        ],
        { label: "A gold box 6 by 2 by 2 cm with a blue box 2 by 2 by 3 cm on its left end" },
      ),
      answer: 36,
      unit: "cubic cm",
      misc: [
        [60, "That fills in the empty corner too. Find each box’s volume, then add."],
        [24, "That’s only the gold box. Add the blue box’s volume."],
      ],
      explain: "Gold: 6 × 2 × 2 = 24. Blue: 2 × 2 × 3 = 12. 24 + 12 = 36 cubic cm.",
    },
  },
  {
    title: "Write it as one expression",
    widget: wExpr,
    body: "<p>An expression can show all the work at once: each box’s length × width × height in parentheses, with a + between them.</p><p>Change the blue box and watch the expression.</p>",
    check: {
      kind: "mc",
      q: "This figure is made of two boxes, gold and blue. Which expression gives its volume?",
      fig: prismFig(
        [
          prismBox(4, 2, 2, { lab: { l: "4 in", w: "2 in", hr: "2 in" } }),
          prismBox(2, 3, 2, { at: [0, 2, 0], cls: "b", lab: { lt: "2 in", h: "3 in" } }),
        ],
        { label: "A gold box 4 by 2 by 2 in with a blue box 2 by 2 by 3 in on its left end" },
      ),
      answer: "a",
      choices: [
        { id: "a", label: "(4 × 2 × 2) + (2 × 2 × 3)" },
        { id: "b", label: "4 × 2 × 5" },
        { id: "c", label: "(4 × 2 × 2) × (2 × 2 × 3)" },
      ],
      why: {
        b: "That’s a box around the whole figure, 5 in tall. It counts the empty corner too.",
        c: "That multiplies the two volumes. Put the two boxes together: add.",
      },
      explain: "Gold: 4 × 2 × 2 = 16. Blue: 2 × 2 × 3 = 12. 16 + 12 = 28 cubic inches.",
    },
  },
];
