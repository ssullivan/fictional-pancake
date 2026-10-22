/* Learn Scale Drawings (Grade 7 Unit 1), chapter 2: Making scaled copies. Its widgets and steps; loaded by
   making-copies.html. */
/* shapes to copy, by name: the L-shape, the T-shape, and the step shape */
const MAKE_SHAPES = ["L-shape", "T-shape", "step shape"].map((name) => SHAPE_LIB.find((s) => s.name === name));
/* Pick a shape and a scale factor: every side of the copy is the original's side times the factor. */
function wMake(el) {
  const q = Q(el),
    factors = [HALF, THREE_HALVES, TWO];
  let shapeIndex = 0,
    factorIndex = 1;
  el.innerHTML =
    `<div data-top>${seg(
      "Shape",
      MAKE_SHAPES.map((s, i) => [i, s.name]),
    )}</div>` +
    `<div data-bot>${seg(
      "Scale factor",
      factors.map((f, i) => [i, facText(f)]),
    )}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const shape = MAKE_SHAPES[shapeIndex],
      f = factors[factorIndex],
      copy = scalePts(shape.pts, f),
      /* the different side lengths, each with what it becomes */
      lengths = [...new Set(gridSides(shape.pts))].sort((a, b) => a - b);
    press(q("top"), shapeIndex);
    press(q("bot"), factorIndex);
    q("f").innerHTML = pairFig(shape.pts, copy, {
      cell: 20,
      label: `A ${shape.name} and its copy with scale factor ${ftx(f)}`,
    });
    q("r").innerHTML =
      `Each side × ${fim(f)}: ${lengths.map((v) => `${fmt(v)} → <b>${fmt(v * val(f))}</b>`).join(", ")}. ` +
      `Every corner of the copy is ${fim(f)} times as far from the top left corner, too.`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (row === "top") shapeIndex = +id;
    if (row === "bot") factorIndex = +id;
    if (row) draw();
  });
  draw();
}

/* shapes with slanted sides, so their corners aren't all square */
const ANGLE_SHAPES = ["trapezoid", "parallelogram", "house shape"].map((name) =>
  SHAPE_LIB.find((s) => s.name === name),
);
/* copies to compare: [label, how much the widths are multiplied, how much the heights are] */
const ANGLE_COPIES = [
  ["× 2", TWO, TWO],
  ["× 1/2", HALF, HALF],
  ["Stretched wider", TWO, ONE],
];
/* an angle as written: whole degrees, or "about" when it isn't a whole number */
const degrees = (a) => (Math.abs(a - Math.round(a)) < 1e-6 ? `${Math.round(a)}°` : `≈${Math.round(a)}°`);
/* Pick a shape and a copy: the angles of a scaled copy stay the same, and a stretched copy's change. */
function wAngles(el) {
  const q = Q(el);
  let shapeIndex = 0,
    copyIndex = 0;
  el.innerHTML =
    `<div data-top>${seg(
      "Shape",
      ANGLE_SHAPES.map((s, i) => [i, s.name]),
    )}</div>` +
    `<div data-bot>${seg(
      "Copy",
      ANGLE_COPIES.map(([label], i) => [i, label]),
    )}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const shape = ANGLE_SHAPES[shapeIndex],
      [label, fx, fy] = ANGLE_COPIES[copyIndex],
      copy = scalePts(shape.pts, fx, fy),
      /* the corners that aren't square, where a stretch shows; the picture marks the first of them (two marks side by side
         would crowd a small shape), and the readout lists them all */
      corners = range(shape.pts.length).filter((i) => Math.round(angleAt(shape.pts, i)) !== 90),
      marked = (pts) => ({ [corners[0]]: degrees(angleAt(pts, corners[0])) }),
      listed = (pts) => corners.map((i) => degrees(angleAt(pts, i))).join(", "),
      same = corners.every((i) => Math.abs(angleAt(copy, i) - angleAt(shape.pts, i)) < 1e-6);
    press(q("top"), shapeIndex);
    press(q("bot"), copyIndex);
    q("f").innerHTML = pairFig(shape.pts, copy, {
      origOpts: { sides: false, angles: marked(shape.pts) },
      copyOpts: { sides: false, angles: marked(copy) },
      cell: 24,
      label: `A ${shape.name} and a copy, ${label}, with their angles`,
    });
    q("r").innerHTML =
      `Angles that aren’t square: original ${listed(shape.pts)}. Copy ${listed(copy)}.<br>` +
      (same
        ? `<span class="ok">Every angle is the same as the original’s.</span> A scaled copy multiplies the lengths, but its corners open just as wide.`
        : `<span class="no">The angles changed.</span> Stretching one way only makes the slanted sides lean differently, so it isn’t a scaled copy.`);
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (row === "top") shapeIndex = +id;
    if (row === "bot") copyIndex = +id;
    if (row) draw();
  });
  draw();
}

/* Pick a scale factor from A to B: the factor from B back to A is its reciprocal. */
function wBack(el) {
  const q = Q(el),
    factors = [TWO, THREE, HALF, THREE_HALVES, [4, 1]],
    shape = SHAPE_LIB.find((s) => s.name === "trapezoid").pts.map(([x, y]) => [x / 2, y / 2]);
  el.innerHTML =
    seg(
      "Scale factor from A to B",
      factors.map((f, i) => [i, facText(f)]),
    ) + `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = (index) => {
    const f = factors[index],
      back = fInv(f),
      b = scalePts(shape, f),
      side = 2,
      bSide = 2 * val(f);
    press(el, index);
    q("f").innerHTML = gridFig(
      arrange([
        [
          { pts: shape, cls: "a", name: "A", sides: true },
          { pts: b, cls: "b", name: "B", sides: true },
        ],
      ]),
      { cell: 22, label: `Trapezoid A and its scaled copy B, scale factor ${ftx(f)}` },
    );
    q("e").innerHTML = `A → B: × ${fim(f)}&nbsp;&nbsp;&nbsp;B → A: × ${fim(back)}`;
    q("r").innerHTML =
      `The bottom of A is ${side}, and ${side} × ${fim(f)} = ${fmt(bSide)}. Going back, ${fmt(bSide)} × ${fim(back)} = ${side}. ` +
      `${fim(f)} × ${fim(back)} = 1: the factors are <b>reciprocals</b>.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "Multiply every side",
    widget: wMake,
    body: "<p>To make a scaled copy, multiply every length in the original by the scale factor, then draw the copy with those lengths. On a grid, you can also multiply how far each corner is across and down.</p><p>Pick a shape and a scale factor.</p>",
    check: {
      kind: "num",
      q: "Kiran makes a scaled copy of a polygon with a scale factor of 3/2. One side of the polygon is 6 units long. How long is that side in the copy?",
      answer: 9,
      unit: "units",
      misc: [
        [7.5, "That adds 3/2. A scaled copy multiplies: 6 × 3/2."],
        [4, "That divides by 3/2. A scale factor greater than 1 makes the side longer."],
        [18, "That multiplies by 3 only. 3/2 is 3 halves: 6 × 3 ÷ 2."],
      ],
      explain: "6 × 3/2 = 18/2 = 9 units.",
    },
  },
  {
    title: "Angles stay the same",
    widget: wAngles,
    body: "<p>In a scaled copy, <b>corresponding angles are equal</b>. The sides get longer or shorter, but every corner opens just as wide. Stretching a shape one way only changes the angles of its slanted sides.</p><p>Compare the angles.</p>",
    check: {
      kind: "num",
      q: "A triangle has an angle of 40°. Lin makes a scaled copy of it with a scale factor of 3. What is the corresponding angle in the copy?",
      answer: 40,
      unit: "°",
      misc: [
        [120, "Only lengths are multiplied by the scale factor. Angles stay the same."],
        [43, "Nothing is added to an angle either. Corresponding angles are equal."],
      ],
      explain: "Corresponding angles in a scaled copy are equal, so the angle is still 40°.",
    },
  },
  {
    title: "Going back",
    widget: wBack,
    body: "<p>If B is a scaled copy of A with scale factor 2, then A is a scaled copy of B too, with scale factor 1/2. Going back undoes the multiplying, so the two scale factors are <b>reciprocals</b>: they multiply to 1.</p><p>Change the scale factor from A to B.</p>",
    check: {
      kind: "num",
      q: "Rectangle B is a scaled copy of rectangle A with a scale factor of 4. What scale factor takes B back to A?",
      answer: 0.25,
      frac: true,
      misc: [
        [4, "That takes A to B. Going back undoes it, so use the reciprocal."],
        [0.4, "Close: 1/4 is 0.25, not 0.4. The reciprocal of 4 is 1 ÷ 4."],
      ],
      explain: "4 × 1/4 = 1, so a scale factor of 1/4 takes B back to A.",
    },
  },
];
