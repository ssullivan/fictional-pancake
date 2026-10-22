/* Learn Shapes on the Coordinate Plane (Grade 5 Unit 7), chapter 5: Rectangles on the grid. Its widgets and steps; loaded by
   rectangles.html. */
/* Step a rectangle's width and height from (1, 1): see its corners, perimeter, and area. */
function wRect(el) {
  const q = Q(el),
    values = { wide: 5, tall: 3 },
    limits = { wide: [1, 8], tall: [1, 6] };
  el.innerHTML = `<div class="wrow">${stepper("wide", "Across")}${stepper("tall", "Up")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { wide, tall } = values,
      corners = [
        [1, 1],
        [1 + wide, 1],
        [1 + wide, 1 + tall],
        [1, 1 + tall],
      ];
    q("wide").textContent = wide;
    q("tall").textContent = tall;
    q("f").innerHTML = gridFig(
      corners.map(([x, y]) => ({ x, y, t: ptText([x, y]) })),
      {
        shapes: [{ pts: corners, closed: true, cls: "fill" }],
        label: `A rectangle with corners ${corners.map(ptText).join(", ")}`,
      },
    );
    q("r").innerHTML =
      `It’s ${1 + wide} − 1 = ${wide} across and ${1 + tall} − 1 = ${tall} up. ` +
      `Perimeter: ${wide} + ${tall} + ${wide} + ${tall} = <b>${2 * (wide + tall)} units</b>. Area: ${wide} × ${tall} = <b>${wide * tall} ${wide * tall === 1 ? "square unit" : "square units"}</b>.`;
  };
  steppers(el, values, limits, draw);
  draw();
}
const STEPS = [
  {
    title: "Perimeter and area from corners",
    widget: wRect,
    body: "<p>A rectangle’s corners give its side lengths: subtract the first numbers to find how far across, and the second numbers to find how far up. Then the perimeter is the distance around, and the area is across × up.</p><p>Change the rectangle.</p>",
    check: {
      kind: "num",
      q: "A garden plot has corners at (1, 1), (6, 1), (6, 4), and (1, 4). Each grid unit is 1 meter. What is its perimeter?",
      answer: 16,
      unit: "meters",
      misc: [
        [15, "That’s the area, 5 × 3. Perimeter is the distance all the way around."],
        [8, "That’s two sides. Go all the way around: 5 + 3 + 5 + 3."],
      ],
      explain: "It’s 6 − 1 = 5 across and 4 − 1 = 3 up. 5 + 3 + 5 + 3 = 16 meters.",
    },
  },
];
