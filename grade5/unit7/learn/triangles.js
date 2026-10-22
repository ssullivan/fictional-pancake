/* Learn Shapes on the Coordinate Plane (Grade 5 Unit 7), chapter 3: Sort triangles. Its widgets and steps; loaded by
   triangles.html. */
/* triangles on the grid, by their angles and sides */
const TRIANGLES = {
  acute: {
    isosceles: [
      [2, 1],
      [8, 1],
      [5, 6],
    ],
    scalene: [
      [1, 1],
      [8, 1],
      [3, 6],
    ],
  },
  right: {
    isosceles: [
      [2, 1],
      [7, 1],
      [2, 6],
    ],
    scalene: [
      [2, 1],
      [8, 1],
      [2, 5],
    ],
  },
  obtuse: {
    isosceles: [
      [1, 2],
      [9, 2],
      [5, 4],
    ],
    scalene: [
      [1, 1],
      [5, 1],
      [9, 5],
    ],
  },
};
/* Pick a triangle by its angles and its sides (two rows of buttons). */
function wTriangle(el) {
  const q = Q(el);
  let angles = "acute",
    sides = "isosceles";
  el.innerHTML =
    `<div data-top>${seg("Angles", [
      ["acute", "Acute"],
      ["right", "Right"],
      ["obtuse", "Obtuse"],
    ])}</div><div data-bot>${seg("Sides", [
      ["isosceles", "Isosceles"],
      ["scalene", "Scalene"],
    ])}</div>` + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const pts = TRIANGLES[angles][sides];
    press(q("top"), angles);
    press(q("bot"), sides);
    q("f").innerHTML = gridFig([], {
      shapes: [{ pts, closed: true, cls: "fill" }],
      label: `An ${angles} ${sides} triangle`,
    });
    q("r").innerHTML =
      `${sides === "isosceles" ? "Two sides are the same length" : "No two sides are the same length"}, and ` +
      `${{ acute: "every angle is less than a square corner", right: "one angle is a square corner", obtuse: "one angle is wider than a square corner" }[angles]}: ` +
      `<b>${angles === "acute" || angles === "obtuse" ? "an" : "a"} ${angles} ${sides} triangle</b>.`;
  };
  el.addEventListener("click", (e) => {
    const hit = segHit(e, ["top", "bot"]);
    if (!hit) return;
    if (hit[0] === "top") angles = hit[1];
    else sides = hit[1];
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "By sides and by angles",
    widget: wTriangle,
    body: "<p>Name a triangle two ways. By its sides: <b>equilateral</b> (all 3 equal), <b>isosceles</b> (at least 2 equal), or <b>scalene</b> (none equal). By its biggest angle: <b>acute</b> (all less than a right angle), <b>right</b>, or <b>obtuse</b> (wider than a right angle).</p><p>Pick the angles and the sides.</p>",
    check: {
      kind: "mc",
      q: "Which name fits this triangle?",
      fig: gridFig([], {
        shapes: [
          {
            pts: [
              [2, 1],
              [6, 1],
              [2, 4],
            ],
            closed: true,
            cls: "fill",
          },
        ],
        label: "A triangle with corners (2, 1), (6, 1), and (2, 4)",
      }),
      answer: "c",
      choices: [
        { id: "a", label: "right isosceles triangle" },
        { id: "b", label: "acute scalene triangle" },
        { id: "c", label: "right scalene triangle" },
      ],
      why: {
        a: "Its sides are 4, 3, and 5 units: none are the same length.",
        b: "The corner at (2, 1) is a square corner: it’s a right triangle.",
      },
      explain: "It has a square corner at (2, 1), and its sides are 4, 3, and 5 units: a right scalene triangle.",
    },
  },
];
