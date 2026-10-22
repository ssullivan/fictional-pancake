/* Learn Angles, Triangles, and Prisms (Grade 7 Unit 7), chapter 4: Slicing solids. Its widgets and steps; loaded by
   slicing.html. */
/* solids, a way to slice each, and the cut face: [label, the solid drawn, the slice, the shape] */
const CUTS = [
  ["Cube", () => solidSvg(solidOf("prism", 4, { a: 2, h: 2 }), { W: 150 }), "parallel to a face", "square"],
  [
    "Pyramid, flat",
    () => solidSvg(solidOf("pyramid", 4, { a: 2.4, h: 2.4 }), { W: 150 }),
    "parallel to its base",
    "square",
  ],
  [
    "Pyramid, down",
    () => solidSvg(solidOf("pyramid", 4, { a: 2.4, h: 2.4 }), { W: 150 }),
    "straight down through the top",
    "triangle",
  ],
  ["Cylinder, flat", () => curvedSvg("cylinder", { W: 150 }), "parallel to its base", "circle"],
  ["Cylinder, down", () => curvedSvg("cylinder", { W: 150 }), "straight down through the middle", "rectangle"],
  [
    "Hexagonal prism",
    () => solidSvg(solidOf("prism", 6, { a: 1.2, h: 2.4 }), { W: 150 }),
    "parallel to its bases",
    "hexagon",
  ],
];
/* Pick a solid and a slice: the cut face is drawn beside it. */
function wSlice(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Slice",
      CUTS.map(([label], i) => [i, label]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [label, solid, how, shape] = CUTS[index];
    press(el, index);
    q("f").innerHTML = solid() + sectionFig(shape);
    q("r").innerHTML = `${label.split(",")[0]} sliced ${how}: the cut face is a <b>${shape}</b>.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "Cross sections",
    widget: wSlice,
    body: "<p>Slicing a solid makes a flat cut face, its <b>cross section</b>. The same solid can give different shapes depending on how you slice it: a pyramid sliced flat gives its base shape, but sliced straight down through the top gives a triangle.</p><p>Pick a slice.</p>",
    check: {
      kind: "mc",
      q: "A cone is sliced parallel to its base. What shape is the cut face?",
      choices: [
        { id: "a", label: "Triangle" },
        { id: "b", label: "Circle" },
        { id: "c", label: "Rectangle" },
      ],
      answer: "b",
      why: {
        a: "That’s a slice straight down through the tip. Parallel to the base gives the base’s shape.",
        c: "A cone has no flat sides to make a rectangle.",
      },
      explain: "Parallel to the base, the cut face is a smaller copy of the base: a circle.",
    },
  },
];
