/* Learn Finding Volume (Grade 5 Unit 1), chapter 4: Cubic units. Its widgets and steps; loaded by cubic-units.html. */
/* units of volume: [the unit of length, button, the plural word, about how big one is, things you'd measure with it] */
const CUBIC_UNITS = [
  ["cm", "Cubic centimeter", "cubic centimeters", "about the size of a sugar cube", "a juice box or a pencil case"],
  ["in", "Cubic inch", "cubic inches", "about the size of a big game die", "a shoebox or a lunch box"],
  ["ft", "Cubic foot", "cubic feet", "a box a basketball just fits in", "a closet or a refrigerator"],
  ["m", "Cubic meter", "cubic meters", "a box a few kids could squeeze into", "a classroom or a moving truck"],
];
/* Pick a unit: one cube of it, and a box 4 by 2 by 3 of them. */
function wUnits(el) {
  const q = Q(el);
  let unitIndex = 0;
  el.innerHTML =
    seg(
      "Unit",
      CUBIC_UNITS.map(([u, button], i) => [i, button]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [u, button, plural, size, things] = CUBIC_UNITS[unitIndex];
    press(el, unitIndex);
    q("f").innerHTML = prismFig([prismBox(4, 3, 2, { grid: true, lab: { l: `4 ${u}`, h: `3 ${u}`, w: `2 ${u}` } })], {
      label: `A box 4 ${u} long, 2 ${u} wide, and 3 ${u} tall`,
    });
    q("r").innerHTML =
      `One ${button.toLowerCase()} is a cube 1 ${u} on every edge, ${size}. ` +
      `This box is 4 × 2 × 3 = <b>24 ${plural}</b>. Use ${plural} for things like ${things}.`;
  };
  onPick(el, (m) => {
    unitIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Cubic centimeters, inches, feet, and meters",
    widget: wUnits,
    body: "<p>To measure volume in the real world, use unit cubes of a real size: a <b>cubic centimeter</b> is a cube 1 cm on every edge, a <b>cubic foot</b> is 1 ft on every edge, and so on. Small things get small cubes; big things get big ones.</p><p>Pick a unit to see how big it is and what it’s good for.</p>",
    check: {
      kind: "mc",
      q: "Which unit would you use to measure the volume of a classroom?",
      answer: "b",
      choices: [
        { id: "a", label: "cubic centimeters" },
        { id: "b", label: "cubic meters" },
        { id: "c", label: "square meters" },
      ],
      why: {
        a: "A cubic centimeter is about as big as a sugar cube. You’d need millions to fill a classroom.",
        c: "Square units measure area, the space on a flat surface. Volume needs cubic units.",
      },
      explain: "A classroom is big, so measure it in cubic meters: cubes a few kids could squeeze into.",
    },
  },
];
