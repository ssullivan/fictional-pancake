/* Learn Shapes on the Coordinate Plane (Grade 5 Unit 7), chapter 2: Sort quadrilaterals. Its widgets and steps; loaded by
   quadrilaterals.html. */
/* quadrilaterals on the grid: [button, corners] */
const QUADS = [
  [
    "Square",
    [
      [2, 1],
      [6, 1],
      [6, 5],
      [2, 5],
    ],
  ],
  [
    "Rectangle",
    [
      [1, 2],
      [8, 2],
      [8, 5],
      [1, 5],
    ],
  ],
  [
    "Rhombus",
    [
      [2, 4],
      [5, 2],
      [8, 4],
      [5, 6],
    ],
  ],
  [
    "Parallelogram",
    [
      [1, 1],
      [6, 1],
      [8, 4],
      [3, 4],
    ],
  ],
  [
    "Trapezoid",
    [
      [1, 1],
      [8, 1],
      [6, 4],
      [3, 4],
    ],
  ],
  [
    "Kite",
    [
      [4, 1],
      [7, 3],
      [4, 7],
      [1, 3],
    ],
  ],
];
/* Pick a quadrilateral: see its parallel sides, right angles, and side lengths, and every name that fits it. */
function wQuad(el) {
  const q = Q(el);
  let quadIndex = 0;
  el.innerHTML =
    seg(
      "Shape",
      QUADS.map(([button], i) => [i, button]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [button, pts] = QUADS[quadIndex],
      facts = quadFacts(pts);
    press(el, quadIndex);
    q("f").innerHTML = gridFig([], {
      shapes: [{ pts, closed: true, cls: "fill" }],
      label: `A ${button.toLowerCase()}`,
    });
    q("r").innerHTML =
      `${facts.parallel} ${facts.parallel === 1 ? "pair" : "pairs"} of parallel sides, ${facts.rights} right ${facts.rights === 1 ? "angle" : "angles"}, ` +
      `${facts.equal ? "all 4 sides equal" : "sides not all equal"}. ` +
      (facts.names.length > 1
        ? `It’s a ${facts.names.slice(1).join(", a ")}. Most specifically: <b>a ${facts.best}</b>.`
        : "No parallel sides, so it’s <b>just a quadrilateral</b>.");
  };
  onPick(el, (m) => {
    quadIndex = +m;
    draw();
  });
  draw();
}
/* names in a list: "a quadrilateral, a trapezoid, and a parallelogram" */
const aList = (names) =>
  names.length < 3
    ? names.map((name) => `a ${name}`).join(" and ")
    : `${names
        .slice(0, -1)
        .map((name) => `a ${name}`)
        .join(", ")}, and a ${names[names.length - 1]}`;
/* the names from least to most specific, each with what it needs and what it includes */
const FAMILY = [
  ["Quadrilateral", "has 4 sides", "every shape below"],
  ["Trapezoid", "has at least 1 pair of parallel sides", "parallelograms, rectangles, rhombuses, and squares"],
  ["Parallelogram", "has 2 pairs of parallel sides", "rectangles, rhombuses, and squares"],
  ["Rectangle", "is a parallelogram with 4 right angles", "squares"],
  ["Rhombus", "is a parallelogram with 4 equal sides", "squares"],
  ["Square", "has 4 right angles and 4 equal sides", "nothing else: it’s the most specific"],
];
/* Pick a name: see what it needs, the names above it that it also has, and the names it includes. */
function wFamily(el) {
  const q = Q(el);
  let nameIndex = 3;
  el.innerHTML =
    seg(
      "Name",
      FAMILY.map(([name], i) => [i, name]),
    ) + `<ol class="family" data-l></ol><p class="readout" data-r></p>`;
  const draw = () => {
    const [name, needs, includes] = FAMILY[nameIndex],
      /* the names a shape with this name always has too: everything above it, except a rectangle isn't a rhombus or the
         other way round */
      also = FAMILY.slice(0, nameIndex)
        .map(([other]) => other)
        .filter((other) => !(name === "Rhombus" && other === "Rectangle"));
    press(el, nameIndex);
    q("l").innerHTML = FAMILY.map(
      ([other], i) => `<li class="${i === nameIndex ? "on" : also.includes(other) ? "up" : ""}">${other}</li>`,
    ).join("");
    q("r").innerHTML =
      `A ${name.toLowerCase()} ${needs}. ` +
      (also.length
        ? `So every ${name.toLowerCase()} is also ${aList(also.map((other) => other.toLowerCase()))}. `
        : "") +
      `It includes ${includes}.`;
  };
  onPick(el, (m) => {
    nameIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Parallel sides, right angles, equal sides",
    widget: wQuad,
    body: "<p>Sort quadrilaterals by what they have. On a grid, two sides are <b>parallel</b> when they run the same way, a <b>right angle</b> is a square corner, and you can compare side lengths. A shape can have more than one name: a square is also a rectangle.</p><p>Pick a shape.</p>",
    check: {
      kind: "mc",
      q: "A quadrilateral has 4 right angles, and 2 pairs of parallel sides, but its sides aren’t all equal. What is its most specific name?",
      answer: "b",
      choices: [
        { id: "a", label: "parallelogram" },
        { id: "b", label: "rectangle" },
        { id: "c", label: "square" },
      ],
      why: {
        a: "That’s true, but there’s a more specific name: it has 4 right angles.",
        c: "A square needs 4 equal sides too.",
      },
      explain: "4 right angles make it a rectangle; it isn’t a square, since its sides aren’t all equal.",
    },
  },
  {
    title: "Names inside names",
    widget: wFamily,
    body: "<p>The names fit inside each other. A <b>trapezoid</b> has at least one pair of parallel sides, so every parallelogram is a trapezoid. Rectangles and rhombuses are special parallelograms, and a <b>square</b> is both a rectangle and a rhombus.</p><p>Pick a name.</p>",
    check: {
      kind: "mc",
      q: "Which statement is always true?",
      answer: "a",
      choices: [
        { id: "a", label: "Every square is a rhombus." },
        { id: "b", label: "Every rhombus is a square." },
        { id: "c", label: "Every trapezoid is a parallelogram." },
      ],
      why: {
        b: "A rhombus needs only 4 equal sides. A square needs right angles too.",
        c: "A trapezoid can have just 1 pair of parallel sides. A parallelogram needs 2.",
      },
      explain: "A square has 4 equal sides, so it’s always a rhombus.",
    },
  },
];
