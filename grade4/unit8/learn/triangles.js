/* Learn Properties of Two-dimensional Shapes (Grade 4 Unit 8), chapter 1: Triangles. Its widgets and steps; loaded by triangles.html. */
/* the triangles, in SHAPES */
const TRIANGLES = [
  "equilateral",
  "isoscelesAcute",
  "rightIsosceles",
  "rightScalene",
  "obtuseIsosceles",
  "obtuseScalene",
  "acuteScalene",
];
/* what each kind of triangle is */
const BY_SIDES = {
  equilateral: "all 3 sides are equal (one tick on each)",
  isosceles: "at least 2 sides are equal (the ticked ones)",
  scalene: "no sides are equal (no ticks)",
};
const BY_ANGLES = {
  acute: "all 3 angles are acute, less than 90°",
  right: "one angle is a right angle (the box)",
  obtuse: "one angle is obtuse, more than 90°",
};
/* Pick a triangle: name it by its sides. */
function wSides(el) {
  const q = Q(el);
  let id = "isoscelesAcute";
  el.innerHTML =
    seg(
      "Triangle",
      TRIANGLES.map((t, i) => [t, `Triangle ${i + 1}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { sides } = SHAPES[id];
    press(el, id);
    q("f").innerHTML = shapeFig(id, { rights: false, label: "A triangle with its equal sides marked" });
    q("r").innerHTML = `<b>${sides[0].toUpperCase() + sides.slice(1)}</b>: ${BY_SIDES[sides]}.`;
  };
  onPick(el, (m) => {
    id = m;
    draw();
  });
  draw();
}
/* Pick a kind of angle: the triangles of that kind. */
function wAngles(el) {
  const q = Q(el);
  let kind = "right";
  el.innerHTML =
    seg("Angles", [
      ["acute", "Acute"],
      ["right", "Right"],
      ["obtuse", "Obtuse"],
    ]) + `<div class="picrow" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const matches = TRIANGLES.filter((t) => SHAPES[t].angles === kind);
    press(el, kind);
    q("f").innerHTML = matches.map((t) => shapeFig(t)).join("");
    q("r").innerHTML =
      `In a <b>${kind} triangle</b>, ${BY_ANGLES[kind]}. These ${matches.length} are ${kind}. ${kind === "acute" ? "" : "A triangle can have only one angle that big. "}By their sides, they’re ${[...new Set(matches.map((t) => SHAPES[t].sides))].join(" and ")}.`;
  };
  onPick(el, (m) => {
    kind = m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Triangles by their sides",
    widget: wSides,
    body: "<p>Tick marks show sides that are the same length. A triangle with 3 equal sides is <b>equilateral</b>, with at least 2 equal sides <b>isosceles</b>, and with no equal sides <b>scalene</b>.</p><p>Pick a triangle.</p>",
    check: {
      kind: "mc",
      q: "What kind of triangle is this, by its sides?",
      fig: shapeFig("obtuseIsosceles", { rights: false, label: "A triangle with two sides marked equal" }),
      choices: [
        { id: "a", label: "Equilateral" },
        { id: "b", label: "Isosceles" },
        { id: "c", label: "Scalene" },
      ],
      answer: "b",
      why: {
        a: "Only 2 sides have tick marks. Equilateral needs all 3 equal.",
        c: "2 sides are marked equal. Scalene has no equal sides.",
      },
      explain: "The two ticked sides are equal, so it’s isosceles.",
    },
  },
  {
    title: "Triangles by their angles",
    widget: wAngles,
    body: "<p>Triangles are also named by their biggest angle. A <b>right triangle</b> has a right angle, an <b>obtuse triangle</b> has an obtuse angle, and an <b>acute triangle</b> has only acute angles.</p><p>Pick a kind of angle.</p>",
    check: {
      kind: "mc",
      q: "What kind of triangle is this, by its angles?",
      fig: shapeFig("obtuseScalene", { label: "A triangle" }),
      choices: [
        { id: "a", label: "Acute" },
        { id: "b", label: "Right" },
        { id: "c", label: "Obtuse" },
      ],
      answer: "c",
      why: {
        a: "Look at the top corner. It opens wider than a right angle.",
        b: "There’s no right-angle box. The top corner opens wider than a right angle.",
      },
      explain: "The top angle is more than 90°, so it’s an obtuse triangle.",
    },
  },
];
