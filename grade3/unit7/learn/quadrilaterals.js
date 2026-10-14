/* Learn Two-dimensional Shapes and Perimeter (Grade 3 Unit 7), chapter 2: What makes a quadrilateral. Its widgets and steps;
   loaded by quadrilaterals.html. */
/* A shape with `sides` sides in a 220 × 220 picture: closed or open (its last side stops short), with straight sides or with
   its first side bent into a curve. The corners are a shape from shared/shapes.js (SHAPES), so it's made of straight lines. */
function builtShape(sides, closed, straight) {
  const s = 180,
    margin = 20,
    corners = SHAPES[sides][sides === 4 ? 3 : 0].map(([x, y]) => [margin + (x * s) / 100, margin + (y * s) / 100]),
    [first, second] = corners,
    /* the curve bulges out from the middle of the first side, away from the shape's middle (its control point is 0.6 of the
       way from the side's middle to the shape's middle, the other way) */
    middle = [corners.reduce((sum, [x]) => sum + x, 0) / sides, corners.reduce((sum, [, y]) => sum + y, 0) / sides],
    sideMid = [(first[0] + second[0]) / 2, (first[1] + second[1]) / 2],
    bulge = [sideMid[0] + 0.6 * (sideMid[0] - middle[0]), sideMid[1] + 0.6 * (sideMid[1] - middle[1])],
    at = ([x, y]) => `${+x.toFixed(1)},${+y.toFixed(1)}`,
    /* an open shape's last side stops 60% of the way back to the first corner */
    last = corners[sides - 1],
    stop = [last[0] + (first[0] - last[0]) * 0.6, last[1] + (first[1] - last[1]) * 0.6];
  let d = `M${at(first)}` + (straight ? `L${at(second)}` : `Q${at(bulge)} ${at(second)}`);
  corners.slice(2).forEach((corner) => (d += `L${at(corner)}`));
  d += closed ? "Z" : `L${at(stop)}`;
  return svgWrap(
    2 * margin + s,
    2 * margin + s,
    `<path class="shp${closed ? "" : " oddshp"}" d="${d}"/>`,
    `A shape with ${pl(sides, "side")}${closed ? "" : ", not closed"}${straight ? "" : ", one of them curved"}`,
  );
}
/* Build a shape: how many sides, closed or open, straight or with a curved side. Only 4 straight sides, closed, make a
   quadrilateral. */
function wBuild(el) {
  /* values.sides: how many sides; closed and straight: the two choices */
  const q = Q(el),
    values = { sides: 4 };
  let closed = true,
    straight = true;
  el.innerHTML =
    `<div class="wrow">${stepper("sides", "Sides")}</div>` +
    `<div data-top>${seg("Ends", [
      [1, "Closed"],
      [0, "Open"],
    ])}</div><div data-bot>${seg("Sides", [
      [1, "Straight sides"],
      [0, "A curved side"],
    ])}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { sides } = values,
      /* what keeps it from being a quadrilateral */
      reasons = [
        ...(sides !== 4 ? [`it has ${sides} sides, not 4`] : []),
        ...(closed ? [] : ["it isn’t closed: its sides don’t all meet"]),
        ...(straight ? [] : ["one side is curved"]),
      ];
    q("sides").textContent = sides;
    press(q("top"), closed ? 1 : 0);
    press(q("bot"), straight ? 1 : 0);
    q("f").innerHTML = builtShape(sides, closed, straight);
    q("r").innerHTML = reasons.length
      ? `Not a quadrilateral: ${listWords(reasons)}.` +
        (closed && straight ? `<br><span class="dimline">It’s a <b>${SHAPE_NAME[sides]}</b>.</span>` : "")
      : `<span class="ok">4 straight sides, and it’s closed: it’s a <b>quadrilateral</b>.</span>`;
  };
  steppers(el, values, { sides: [3, 6] }, draw);
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") closed = id === "1";
    else straight = id === "1";
    draw();
  });
  draw();
}
/* the shapes to sort: names from ODD, or POLYS ids */
const SORT_ITEMS = ["open", "trapezoid", "pentagon", "dart", "curved", "tiltedSquare"];
/* why each shape is or isn't a quadrilateral */
const SORT_WHY = {
  open: "isn’t a quadrilateral: it isn’t closed.",
  trapezoid: "is a quadrilateral: 4 straight sides, closed.",
  pentagon: "isn’t a quadrilateral: it has 5 sides.",
  dart: "is a quadrilateral: 4 straight sides, closed. One corner bends in, and that’s fine.",
  curved: "isn’t a quadrilateral: one side is curved.",
  tiltedSquare: "is a quadrilateral: 4 straight sides, closed. Turning a shape doesn’t change that.",
};
/* is this one of the quadrilaterals? */
const isQuadItem = (item) => !(item in ODD) && POLYS[item].length === 4;
/* Tap shapes to sort them: each one tapped turns green if it's a quadrilateral and red if it isn't. */
function wFind(el) {
  /* tapped: the shapes tapped so far, by their place in the row */
  const q = Q(el);
  let tapped = [];
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const quads = SORT_ITEMS.filter(isQuadItem).length,
      found = tapped.filter((i) => isQuadItem(SORT_ITEMS[i])).length,
      latest = tapped[tapped.length - 1];
    q("f").innerHTML = polyRow(
      SORT_ITEMS.map((item) => (item in ODD ? item : [POLYS[item]])),
      { tap: "Shape", letters: true },
    );
    el.querySelectorAll(".cand").forEach((target) => {
      const i = +target.dataset.id;
      if (tapped.includes(i)) target.classList.add(isQuadItem(SORT_ITEMS[i]) ? "right" : "wrong");
    });
    q("r").innerHTML =
      (latest === undefined
        ? "Tap each shape you think is a quadrilateral."
        : `Shape ${letter(latest)} ${SORT_WHY[SORT_ITEMS[latest]]}`) +
      `<br>${found === quads ? `<span class="ok">You found all ${quads} quadrilaterals!</span>` : `Quadrilaterals found: ${found} of ${quads}.`}`;
  };
  el.addEventListener("click", (e) => {
    const target = e.target.closest(".cand");
    if (!target) return;
    const i = +target.dataset.id;
    tapped = [...tapped.filter((j) => j !== i), i];
    draw();
  });
  q("clr").onclick = () => {
    tapped = [];
    draw();
  };
  draw();
}
/* the quick checks' figures */
const F = {
  which: polyRow(["open", [POLYS.dart], "curved"], { letters: true }),
  count: polyRow([[POLYS.rectangle], "open", [POLYS.oddQuad], [POLYS.pentagon]], { letters: true }),
};
const STEPS = [
  {
    title: "Closed, with 4 straight sides",
    widget: wBuild,
    body: "<p>A <b>quadrilateral</b> is a shape with exactly 4 straight sides. It must be closed: its sides meet end to end, with no gaps. Squares, rectangles, and lots of other shapes are quadrilaterals.</p><p>Change the shape. When is it a quadrilateral?</p>",
    check: {
      kind: "mc",
      q: "Which shape is a quadrilateral?",
      fig: F.which,
      choices: [
        { id: "a", label: "Shape A" },
        { id: "b", label: "Shape B" },
        { id: "c", label: "Shape C" },
      ],
      answer: "b",
      why: {
        a: "Shape A isn’t closed: there’s a gap between two of its sides.",
        c: "Shape C has a curved side. A quadrilateral’s sides are straight.",
      },
      explain: "Shape B is closed and has 4 straight sides. One corner bends in, but it’s still a quadrilateral.",
    },
  },
  {
    title: "Find the quadrilaterals",
    widget: wFind,
    body: "<p>Quadrilaterals come in many shapes. They can be turned, stretched, or have a corner that bends in. Check two things: 4 straight sides, and closed.</p><p>Tap the shapes that are quadrilaterals.</p>",
    check: {
      kind: "num",
      q: "How many of these shapes are quadrilaterals?",
      fig: F.count,
      answer: 2,
      unit: "shapes",
      misc: [
        [3, "Shape B isn’t closed, so it isn’t a quadrilateral."],
        [4, "Shape B isn’t closed, and shape D has 5 sides."],
      ],
      explain: "Shapes A and C are closed with 4 straight sides. Shape B isn’t closed, and shape D has 5 sides.",
    },
  },
];
