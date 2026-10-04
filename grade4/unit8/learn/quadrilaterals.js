/* Learn Properties of Two-dimensional Shapes (Grade 4 Unit 8), chapter 2: Quadrilaterals. Its widgets and steps; loaded by quadrilaterals.html. */
/* the quadrilaterals, in SHAPES */
const QUADS = ["square", "rectangle", "rhombus", "parallelogram", "trapezoid", "kite"];
/* a shape's equal sides in words: all 4, 2 pairs, 2, or none. Sides with the same number of ticks are equal. */
function equalWords(id) {
  const ticks = SHAPES[id].ticks,
    groups = [...new Set(ticks.filter((t) => t))];
  if (groups.length === 1 && ticks.every((t) => t === groups[0])) return "all 4 sides equal";
  return groups.length === 2 ? "2 pairs of equal sides" : groups.length === 1 ? "2 equal sides" : "no equal sides";
}
/* Pick a quadrilateral: its parallel sides, right angles, and equal sides. */
function wQuad(el) {
  const q = Q(el);
  let id = "rectangle";
  el.innerHTML =
    seg(
      "Shape",
      QUADS.map((s) => [s, SHAPES[s].name[0].toUpperCase() + SHAPES[s].name.slice(1)]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { parallel, rights, name } = SHAPES[id];
    press(el, id);
    q("f").innerHTML = shapeFig(id);
    q("r").innerHTML =
      `A <b>${name}</b> has ${parallel ? `${parallel} pair${parallel > 1 ? "s" : ""} of parallel sides` : "no parallel sides"}, ${rights.length ? `${rights.length} right angle${rights.length > 1 ? "s" : ""}` : "no right angles"}, and ${equalWords(id)}.`;
  };
  onPick(el, (m) => {
    id = m;
    draw();
  });
  draw();
}
/* what to look for: [id, button, which shapes have it] */
const ATTRIBUTES = [
  ["parallel2", "2 pairs of parallel sides", (s) => s.parallel === 2],
  ["parallel1", "Exactly 1 pair of parallel sides", (s) => s.parallel === 1],
  ["rights4", "4 right angles", (s) => s.rights.length === 4],
  ["equal4", "4 equal sides", (s) => s.ticks.every((t) => t && t === s.ticks[0])],
];
/* Pick something to look for: the quadrilaterals that have it. */
function wSort(el) {
  const q = Q(el);
  let attribute = "parallel2";
  el.innerHTML =
    seg(
      "Look for",
      ATTRIBUTES.map(([id, name]) => [id, name]),
    ) + `<div class="picrow" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [, name, has] = ATTRIBUTES.find(([id]) => id === attribute),
      matches = QUADS.filter((s) => has(SHAPES[s]));
    press(el, attribute);
    q("f").innerHTML = matches.map((s) => shapeFig(s)).join("");
    q("r").innerHTML =
      `${matches.length} of the ${QUADS.length} shapes ${matches.length === 1 ? "has" : "have"} ${name.toLowerCase()}: ${matches.map((s) => SHAPES[s].name).join(", ")}.`;
  };
  onPick(el, (m) => {
    attribute = m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "What a quadrilateral has",
    widget: wQuad,
    body: "<p>A <b>quadrilateral</b> has 4 sides. Describe one by its sides and angles: how many pairs of sides are parallel, how many right angles it has, and which sides are equal (the tick marks).</p><p>Pick a shape.</p>",
    check: {
      kind: "mc",
      q: "Which shape has 4 equal sides but no right angles?",
      choices: [
        { id: "a", label: "Rhombus" },
        { id: "b", label: "Square" },
        { id: "c", label: "Rectangle" },
      ],
      answer: "a",
      why: {
        b: "A square has 4 equal sides, but also 4 right angles.",
        c: "A rectangle has 4 right angles, and its sides aren’t all equal unless it’s a square.",
      },
      explain: "A rhombus has 4 equal sides, and its angles don’t have to be right angles.",
    },
  },
  {
    title: "Sort by what they have",
    widget: wSort,
    body: "<p>Different shapes can share an attribute. A square, a rectangle, a rhombus, and a parallelogram all have 2 pairs of parallel sides. A square is a rectangle and a rhombus at the same time.</p><p>Pick something to look for.</p>",
    check: {
      kind: "num",
      q: "Of a square, a rectangle, a rhombus, and a trapezoid, how many have 4 right angles?",
      answer: 2,
      unit: "shapes",
      misc: [
        [1, "A square has 4 right angles, and so does a rectangle."],
        [4, "A rhombus and a trapezoid don’t have to have right angles."],
      ],
      explain: "The square and the rectangle each have 4 right angles: 2 shapes.",
    },
  },
];
