/* Learn Two-dimensional Shapes and Perimeter (Grade 3 Unit 7), chapter 1: Sides and right angles. Its widgets and steps;
   loaded by attributes.html. */
/* the shapes to sort, lettered A to F (POLYS ids) */
const GALLERY = ["equiTri", "rightTri", "square", "leanRhombus", "rectangle", "house"];
/* ways to sort them: [the button, what the shapes in the group have, does a shape have it?] */
const SORTS = [
  ["3 sides", "3 sides", (pts) => pts.length === 3],
  ["4 sides", "4 sides", (pts) => pts.length === 4],
  ["A right angle", "at least one right angle", (pts) => rightCorners(pts).length > 0],
  ["Sides all the same", "sides that are all the same length", (pts) => new Set(sideLengths(pts)).size === 1],
];
/* Sort a gallery of shapes by one attribute: the shapes that have it stay lit, and the rest fade. */
function wSort(el) {
  const q = Q(el);
  let sortIndex = 0;
  el.innerHTML =
    seg(
      "Sort by",
      SORTS.map(([button], i) => [i, button]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [, has, fits] = SORTS[sortIndex],
      inGroup = GALLERY.map((id) => fits(POLYS[id])),
      letters = GALLERY.map((id, i) => letter(i)).filter((x, i) => inGroup[i]);
    press(el, sortIndex);
    q("f").innerHTML = polyRow(
      GALLERY.map((id, i) => [
        POLYS[id],
        { sq: true, lens: lensOf(POLYS[id]), cls: inGroup[i] ? "shp" : "shp dimshp" },
      ]),
      { letters: true },
    );
    q("r").innerHTML =
      `Shapes ${listWords(letters)} have <b>${has}</b>.` +
      `<br><span class="dimline">The little squares mark the right angles: square corners, like the corner of a page.</span>`;
  };
  onPick(el, (id) => {
    sortIndex = +id;
    draw();
  });
  draw();
}
/* shapes to check corner by corner: [button, POLYS id] */
const CHECK_SHAPES = [
  ["Shape 1", "rightTrapezoid"],
  ["Shape 2", "house"],
  ["Shape 3", "parallelogram"],
];
/* Hold a square corner up to each corner of a shape in turn: the ones it fits are right angles. */
function wCorners(el) {
  /* checked: how many corners, from the first, have been checked */
  const q = Q(el);
  let shapeIndex = 0,
    checked = 0;
  el.innerHTML =
    seg(
      "Shape",
      CHECK_SHAPES.map(([button], i) => [i, button]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Check the next corner</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const pts = POLYS[CHECK_SHAPES[shapeIndex][1]],
      rights = rightCorners(pts),
      corners = pts.length,
      done = checked === corners,
      lines = range(checked).map(
        (i) => `Corner ${i + 1}: ${rights.includes(i) ? "a right angle ✓" : "not a right angle"}`,
      );
    press(el, shapeIndex);
    q("go").disabled = done;
    q("f").innerHTML = polySvg(pts, { marks: rights.filter((i) => i < checked), ring: done ? null : checked });
    q("r").innerHTML =
      (checked ? lines.join("<br>") : "Is corner 1 (circled) a square corner? Check each corner in turn.") +
      (done
        ? `<br><span class="ok">It has ${pl(corners, "corner")} and <b>${rights.length ? pl(rights.length, "right angle") : "no right angles"}</b>.</span>`
        : "");
  };
  q("go").onclick = () => {
    checked++;
    draw();
  };
  q("clr").onclick = () => {
    checked = 0;
    draw();
  };
  onPick(el, (id) => {
    shapeIndex = +id;
    checked = 0;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  triangles: polyRow(
    ["isoTri", "rightTri2", "equiTri"].map((id) => [POLYS[id]]),
    { letters: true },
  ),
  pentagon: polySvg(POLYS.pentagon, { label: "A shape with 5 sides" }),
};
const STEPS = [
  {
    title: "Sort by sides and corners",
    widget: wSort,
    body: "<p>Shapes have <b>attributes</b>: things that are true about them. How many sides does it have? Are its sides the same length? Does it have square corners? A square corner is called a <b>right angle</b>.</p><p>Sort the shapes different ways.</p>",
    check: {
      kind: "mc",
      q: "Which triangle has a right angle?",
      fig: F.triangles,
      choices: [
        { id: "a", label: "Triangle A" },
        { id: "b", label: "Triangle B" },
        { id: "c", label: "Triangle C" },
      ],
      answer: "b",
      why: {
        a: "Triangle A has no square corner. Its corners are all pointier or wider than a page’s corner.",
        c: "Triangle C’s sides are all the same length, but none of its corners is a square corner.",
      },
      explain: "Triangle B has a square corner at the top left: a right angle.",
    },
  },
  {
    title: "Find the right angles",
    widget: wCorners,
    body: "<p>To find right angles, hold the corner of a sheet of paper up to each corner of the shape. If it fits exactly, that corner is a right angle. We mark a right angle with a little square.</p><p>Pick a shape and check its corners one at a time.</p>",
    check: {
      kind: "num",
      q: "How many right angles does this shape have?",
      fig: F.pentagon,
      answer: 2,
      unit: "right angles",
      misc: [
        [5, "That counts every corner. Count only the square corners."],
        [3, "That counts the corners that aren’t square. Count the square ones."],
      ],
      explain: "The two corners at the top are square corners. The other 3 aren’t. It has 2 right angles.",
    },
  },
];
