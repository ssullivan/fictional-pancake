/* Learn Two-dimensional Shapes and Perimeter (Grade 3 Unit 7), chapter 3: Rhombuses, rectangles, and squares. Its widgets and
   steps; loaded by rhombus-rectangle-square.html. */
/* the quadrilateral for each pair of choices: [sides all the same?][right angles?] (POLYS ids) */
const MADE = {
  same: { right: "square", lean: "leanRhombus" },
  two: { right: "rectangle", lean: "parallelogram" },
};
/* what the shape is, for each pair of choices */
const MADE_SAYS = {
  square:
    "4 sides the same length and 4 right angles: a <b>square</b>. It’s a rhombus and a rectangle too, because it has what both need.",
  leanRhombus: "4 sides the same length, but no right angles: a <b>rhombus</b>.",
  rectangle: "4 right angles, but two lengths of side: a <b>rectangle</b>.",
  parallelogram:
    "Two lengths of side and no right angles: a quadrilateral, but <b>not a rhombus, a rectangle, or a square</b>.",
};
/* Make a quadrilateral from two choices: are its sides all the same length, and are its corners right angles? */
function wMake(el) {
  const q = Q(el);
  let sides = "same",
    corners = "lean";
  el.innerHTML =
    `<div data-top>${seg("Sides", [
      ["same", "All the same length"],
      ["two", "Two lengths"],
    ])}</div><div data-bot>${seg("Corners", [
      ["right", "Right angles"],
      ["lean", "Leaning"],
    ])}</div>` + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const id = MADE[sides][corners],
      pts = POLYS[id];
    press(q("top"), sides);
    press(q("bot"), corners);
    q("f").innerHTML = polyFig(pts, { sq: true, lens: lensOf(pts) }, "A quadrilateral");
    q("r").innerHTML = MADE_SAYS[id];
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") sides = id;
    else corners = id;
    draw();
  });
  draw();
}
/* the shapes to place, lettered A to F (POLYS ids) */
const PLACE = ["tiltedSquare", "wideRhombus", "tallRectangle", "trapezoid", "square", "tiltedRectangle"];
/* The diagram: the quadrilaterals in a dashed box, a circle of rhombuses and a circle of rectangles that overlap where the
   squares are, and the shape drawn small in its place (svg). inRhombus, inRectangle: which circles it's in. */
function placeDiagram(pts, inRhombus, inRectangle) {
  const iconSize = 40,
    /* where the shape goes: in one circle, both (the overlap), or neither (a corner of the box) */
    [cx, cy] = inRhombus && inRectangle ? [180, 146] : inRhombus ? [95, 140] : inRectangle ? [265, 140] : [326, 206],
    markup =
      `<rect class="vbox" x="6" y="6" width="348" height="228" rx="10"/>` +
      `<text class="lbl s dm vlbl" x="72" y="24">Quadrilaterals</text>` +
      `<circle class="vring${inRhombus ? " on" : ""}" cx="140" cy="128" r="88"/>` +
      `<circle class="vring${inRectangle ? " on" : ""}" cx="220" cy="128" r="88"/>` +
      `<text class="lbl s vlbl" x="95" y="72">Rhombuses</text>` +
      `<text class="lbl s vlbl" x="265" y="72">Rectangles</text>` +
      `<text class="lbl s gd vlbl" x="180" y="104">Squares</text>` +
      shapeAt(toBox(pts), cx - iconSize / 2, cy - iconSize / 2, iconSize, { cls: "shp b" });
  return svgWrap(
    360,
    240,
    markup,
    `A diagram of quadrilaterals: the shape is ${inRhombus && inRectangle ? "where the circles of rhombuses and rectangles overlap" : inRhombus ? "in the circle of rhombuses" : inRectangle ? "in the circle of rectangles" : "outside both circles"}`,
  );
}
/* Pick a shape: check its sides and its corners, and see where it goes in the diagram of rhombuses and rectangles. */
function wPlace(el) {
  const q = Q(el);
  let shapeIndex = 0;
  el.innerHTML =
    seg(
      "Shape",
      PLACE.map((id, i) => [i, `Shape ${letter(i)}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const pts = POLYS[PLACE[shapeIndex]],
      kind = quadKind(pts),
      inRhombus = kind === "square" || kind === "rhombus",
      inRectangle = kind === "square" || kind === "rectangle",
      rights = rightCorners(pts).length;
    press(el, shapeIndex);
    q("f").innerHTML =
      polyFig(pts, { sq: true, lens: lensOf(pts), s: 140 }, `Shape ${letter(shapeIndex)}`) +
      placeDiagram(pts, inRhombus, inRectangle);
    q("r").innerHTML =
      `All 4 sides the same length? <b>${inRhombus ? "Yes" : "No"}</b>. Right angles: <b>${rights}</b>.<br>` +
      {
        square: `<span class="ok">It’s in both circles: a rhombus <i>and</i> a rectangle. That’s a <b>square</b>.</span>`,
        rhombus: "It goes in the rhombus circle only: a <b>rhombus</b>.",
        rectangle: "It goes in the rectangle circle only: a <b>rectangle</b>.",
        other: "It’s a quadrilateral, but it goes outside both circles.",
      }[kind];
  };
  onPick(el, (id) => {
    shapeIndex = +id;
    draw();
  });
  draw();
}
/* the fixed corners A, B, and C on the grid, and the grid's size and spacing */
const FIXED = [
    [2, 2],
    [6, 2],
    [6, 6],
  ],
  GRID = 8,
  DOT = 26;
/* Move corner D around a dot grid (steppers): the shape changes, and so does what it is. */
function wMove(el) {
  /* values.across, values.up: where corner D is, from the left and from the bottom of the grid */
  const q = Q(el),
    values = { across: 2, up: 2 },
    margin = 24,
    px = (v) => margin + v * DOT;
  el.innerHTML =
    `<div class="wrow">${stepper("across", "D across")}${stepper("up", "D up")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const corner = [values.across, GRID - values.up],
      pts = [...FIXED, corner],
      /* D is in line with A and C when it's on their diagonal: then the shape flattens into a triangle */
      flat = corner[0] === corner[1],
      corners = pts.map(([x, y]) => [px(x), px(y)]),
      rights = flat ? [] : rightCorners(pts),
      kind = flat ? null : quadKind(pts);
    q("across").textContent = values.across;
    q("up").textContent = values.up;
    let markup = "";
    range(GRID + 1).forEach((x) =>
      range(GRID + 1).forEach((y) => (markup += `<circle class="gdotgrid" cx="${px(x)}" cy="${px(y)}" r="2"/>`)),
    );
    markup += `<polygon class="shp" points="${corners.map(([x, y]) => `${x},${y}`).join(" ")}"/>`;
    rights.forEach((i) => (markup += rightMark(corners, i)));
    /* each corner's letter, just outside it: away from the middle of the grid's square A, B, C sit on */
    "ABCD".split("").forEach((name, i) => {
      const [x, y] = corners[i],
        [dx, dy] = [Math.sign(x - px(4)) || -1, Math.sign(y - px(4)) || 1];
      markup += `<text class="lbl s gd" x="${x + dx * 14}" y="${y + dy * 12}">${name}</text>`;
    });
    q("f").innerHTML = svgWrap(
      2 * margin + GRID * DOT,
      2 * margin + GRID * DOT,
      markup,
      `A quadrilateral on a dot grid, with corner D at ${values.across} across and ${values.up} up`,
    );
    q("r").innerHTML = flat
      ? "D is in line with A and C, so the shape flattens into a triangle. Move D off that line."
      : `Sides all the same length? <b>${new Set(sideLengths(pts)).size === 1 ? "Yes" : "No"}</b>. Right angles: <b>${rights.length}</b>.<br>` +
        (kind === "square"
          ? `<span class="ok">It’s a <b>square</b>, so it’s a rhombus and a rectangle too.</span>`
          : (isConvex(pts) ? "" : "One corner bends in. ") +
            "It’s a <b>quadrilateral</b>, but not a rhombus, a rectangle, or a square.");
  };
  steppers(el, values, { across: [0, 5], up: [0, 4] }, draw);
  draw();
}
/* the quick checks' figures */
const F = {
  others: polyRow(
    ["square", "trapezoid", "wideRhombus"].map((id) => [POLYS[id], { sq: true, lens: lensOf(POLYS[id]) }]),
    { letters: true },
  ),
};
const STEPS = [
  {
    title: "Rhombuses and rectangles",
    widget: wMake,
    body: "<p>A <b>rhombus</b> is a quadrilateral with 4 sides that are all the same length. A <b>rectangle</b> is a quadrilateral with 4 right angles. A <b>square</b> has both: 4 sides the same length and 4 right angles.</p><p>Pick the sides and the corners.</p>",
    check: {
      kind: "mc",
      q: "A quadrilateral has 4 sides that are all the same length, and no right angles. What is it?",
      choices: [
        { id: "a", label: "A rhombus" },
        { id: "b", label: "A rectangle" },
        { id: "c", label: "A square" },
      ],
      answer: "a",
      why: {
        b: "A rectangle has 4 right angles. This shape has none.",
        c: "A square has 4 right angles too. This shape has none.",
      },
      explain: "4 sides the same length make a rhombus. With no right angles, it isn’t a square.",
    },
  },
  {
    title: "A square is both",
    widget: wPlace,
    body: "<p>A shape can have more than one name. A square has 4 sides the same length, so it’s a rhombus. It also has 4 right angles, so it’s a rectangle. Squares go where the two groups overlap.</p><p>Pick each shape and see where it goes.</p>",
    check: {
      kind: "mc",
      q: "Han says a square is not a rectangle. Is Han right?",
      stack: true,
      choices: [
        { id: "a", label: "No. A square has 4 right angles, so it is a rectangle." },
        { id: "b", label: "Yes. A rectangle has two long sides and two short sides." },
        { id: "c", label: "Yes. A square is a rhombus, so it can’t be a rectangle." },
      ],
      answer: "a",
      why: {
        b: "A rectangle only needs 4 right angles. Its sides can all be the same length: then it’s a square.",
        c: "A square can be both. It’s a rhombus and a rectangle.",
      },
      explain:
        "A rectangle is any quadrilateral with 4 right angles. A square has 4 right angles, so it is a rectangle.",
    },
  },
  {
    title: "Other quadrilaterals",
    widget: wMove,
    body: "<p>Most quadrilaterals aren’t rhombuses, rectangles, or squares. Their sides aren’t all the same length, and they don’t have 4 right angles. They’re still quadrilaterals: closed, with 4 straight sides.</p><p>Move corner D and watch the shape change.</p>",
    check: {
      kind: "mc",
      q: "Which shape is a quadrilateral, but not a rhombus, a rectangle, or a square?",
      fig: F.others,
      choices: [
        { id: "a", label: "Shape A" },
        { id: "b", label: "Shape B" },
        { id: "c", label: "Shape C" },
      ],
      answer: "b",
      why: {
        a: "Shape A has 4 sides the same length and 4 right angles: it’s a square.",
        c: "Shape C’s sides are all the same length: it’s a rhombus.",
      },
      explain: "Shape B’s sides aren’t all the same length, and it has no right angles.",
    },
  },
];
