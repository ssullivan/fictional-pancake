/* Learn Scale Drawings (Grade 7 Unit 1), chapter 4: Scaling and area. Its widgets and steps; loaded by area.html. */
/* shapes to scale: a 3-by-2 rectangle and a right triangle with legs 2 and 4 */
const AREA_SHAPES = [
  {
    name: "Rectangle",
    pts: [
      [0, 0],
      [3, 0],
      [3, 2],
      [0, 2],
    ],
  },
  {
    name: "Triangle",
    pts: [
      [0, 0],
      [0, 4],
      [2, 4],
    ],
  },
];
/* Pick a shape and change the scale factor: the copy is cut into factor × factor copies of the original. */
function wGrow(el) {
  const q = Q(el),
    values = { k: 2 };
  let shapeIndex = 0;
  el.innerHTML =
    seg(
      "Shape",
      AREA_SHAPES.map((s, i) => [i, s.name]),
    ) +
    `<div class="wrow">${stepper("k", "Scale factor")}</div><div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { k } = values,
      shape = AREA_SHAPES[shapeIndex],
      area = areaOf(shape.pts),
      copy = scalePts(shape.pts, [k, 1]);
    press(el, shapeIndex);
    q("k").textContent = k;
    q("f").innerHTML = pairFig(shape.pts, copy, {
      copyOpts: { tiles: k },
      cell: 16,
      label: `A ${shape.name.toLowerCase()} and its copy with scale factor ${k}, cut into ${k * k} copies of the original`,
    });
    q("e").textContent = `${area} × ${k} × ${k} = ${area * k * k} square units`;
    q("r").innerHTML =
      `The copy is ${k} times as long <i>and</i> ${k} times as wide, so <b>${k * k}</b> copies of the original fit inside it. ` +
      `Its area is ${k} × ${k} = ${k * k} times as large, not ${k} times.`;
  };
  steppers(el, values, { k: [1, 4] }, draw);
  onPick(el, (id) => {
    shapeIndex = +id;
    draw();
  });
  draw();
}

/* a 6-by-4 rectangle to scale down */
const BIG_RECT = [
  [0, 0],
  [6, 0],
  [6, 4],
  [0, 4],
];
/* Pick a scale factor (1/2, 1/4, or 2): the area changes by the factor times itself. */
function wShrink(el) {
  const q = Q(el),
    factors = [HALF, [1, 4], TWO];
  el.innerHTML =
    seg(
      "Scale factor",
      factors.map((f, i) => [i, facText(f)]),
    ) + `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = (index) => {
    const f = factors[index],
      k = val(f),
      copy = scalePts(BIG_RECT, f),
      area = areaOf(BIG_RECT),
      shrink = k < 1;
    press(el, index);
    q("f").innerHTML = pairFig(BIG_RECT, copy, {
      origOpts: { tiles: shrink ? f[1] : 0 },
      copyOpts: { tiles: shrink ? 0 : f[0] },
      cell: 14,
      label: `A 6 by 4 rectangle and its copy with scale factor ${ftx(f)}`,
    });
    q("e").innerHTML = `${area} × ${fim(f)} × ${fim(f)} = ${fmt(area * k * k)} square units`;
    q("r").innerHTML = shrink
      ? `The original is cut into ${f[1] * f[1]} copies, so the copy’s area is <b>${fim(fMul(f, f))}</b> of the original’s.`
      : `${f[0] * f[0]} copies of the original fit in the copy.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "Area grows by the factor times itself",
    widget: wGrow,
    body: "<p>When every length is multiplied by a scale factor, the area is multiplied by the scale factor <b>times itself</b>. A copy with scale factor 3 is 3 times as long and 3 times as wide, so 3 × 3 = 9 copies of the original fit inside.</p><p>Change the scale factor.</p>",
    check: {
      kind: "num",
      q: "A rectangle has an area of 10 square units. What is the area of a scaled copy with a scale factor of 3?",
      answer: 90,
      unit: "square units",
      misc: [
        [30, "That multiplies by 3 once. The copy is 3 times as long and 3 times as wide: multiply by 3 × 3."],
        [13, "Area isn’t scaled by adding. Multiply by 3 × 3."],
        [60, "That multiplies by 3 × 2. Use the scale factor twice: 3 × 3."],
      ],
      explain: "3 × 3 = 9, so the copy’s area is 10 × 9 = 90 square units.",
    },
  },
  {
    title: "Scaling down",
    widget: wShrink,
    body: "<p>A scale factor less than 1 works the same way. With scale factor 1/2, the copy is half as long and half as wide, so its area is 1/2 × 1/2 = 1/4 of the original’s.</p><p>Pick a scale factor.</p>",
    check: {
      kind: "num",
      q: "A triangle has an area of 48 square cm. What is the area of a scaled copy with a scale factor of 1/2?",
      answer: 12,
      unit: "square cm",
      misc: [
        [24, "That halves the area once. The copy is half as long and half as wide: 1/2 × 1/2 = 1/4."],
        [96, "A scale factor less than 1 makes the copy smaller, so its area is smaller too."],
      ],
      explain: "1/2 × 1/2 = 1/4, so the area is 48 × 1/4 = 12 square cm.",
    },
  },
];
