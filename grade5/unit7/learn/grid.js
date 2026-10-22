/* Learn Shapes on the Coordinate Plane (Grade 5 Unit 7), chapter 1: The coordinate grid. Its widgets and steps; loaded by
   grid.html. */
/* Move a point with two steppers, across and up: its coordinates are (across, up). */
function wPlot(el) {
  const q = Q(el),
    values = { across: 3, up: 5 },
    limits = { across: [0, 10], up: [0, 8] };
  el.innerHTML = `<div class="wrow">${stepper("across", "Across")}${stepper("up", "Up")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { across, up } = values;
    q("across").textContent = across;
    q("up").textContent = up;
    q("f").innerHTML = gridFig([{ x: across, y: up, t: ptText([across, up]) }], {
      shapes: [
        {
          pts: [
            [0, 0],
            [across, 0],
            [across, up],
          ],
          cls: "walk",
        },
      ],
      label: `A grid with a point at ${ptText([across, up])}`,
    });
    q("r").innerHTML =
      across === 0 && up === 0
        ? "<b>(0, 0)</b> is the <b>origin</b>, where the two axes meet."
        : `Start at (0, 0). Go <b>${across} across</b>, then <b>${up} up</b>: the point is <b>${ptText([across, up])}</b>.`;
  };
  steppers(el, values, limits, draw);
  draw();
}
/* places on a camp map: [name, letter, x, y] */
const PLACES = [
  ["Tent", "T", 3, 4],
  ["Lake", "L", 7, 2],
  ["Lookout", "O", 1, 7],
  ["Cave", "C", 8, 6],
];
/* Pick a place on a camp map and read its coordinates. */
function wPlaces(el) {
  const q = Q(el);
  let placeIndex = 0;
  el.innerHTML =
    seg(
      "Place",
      PLACES.map(([name], i) => [i, name]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [name, , x, y] = PLACES[placeIndex];
    press(el, placeIndex);
    q("f").innerHTML = gridFig(
      PLACES.map(([, letter, px, py], i) => ({ x: px, y: py, t: letter, cls: i === placeIndex ? "hi" : "b" })),
      { label: `A camp map with the ${name.toLowerCase()} at ${ptText([x, y])}` },
    );
    q("r").innerHTML =
      `The ${name.toLowerCase()} is ${x} across and ${y} up: <b>${ptText([x, y])}</b>. The first number is always how far across.`;
  };
  onPick(el, (m) => {
    placeIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Across, then up",
    widget: wPlot,
    body: "<p>A <b>coordinate grid</b> has two number lines, the <b>axes</b>, that meet at (0, 0). A point’s <b>coordinates</b> say where it is: the first number is how far across, and the second is how far up. So (3, 5) is 3 across and 5 up.</p><p>Move the point.</p>",
    check: {
      kind: "mc",
      q: "Which point is at (2, 5)?",
      fig: gridFig(
        [
          { x: 5, y: 2, t: "A" },
          { x: 2, y: 5, t: "B" },
          { x: 2, y: 6, t: "C" },
        ],
        { label: "A grid with points A (5, 2), B (2, 5), and C (2, 6)" },
      ),
      answer: "b",
      choices: [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
        { id: "c", label: "C" },
      ],
      why: {
        a: "A is at (5, 2): 5 across and 2 up. Go across 2 first.",
        c: "C is at (2, 6), one too high. Count the lines up from 0.",
      },
      explain: "(2, 5) is 2 across and 5 up: point B.",
    },
  },
  {
    title: "Read coordinates",
    widget: wPlaces,
    body: "<p>To read a point’s coordinates, look straight down to the across axis for the first number, then across to the up axis for the second. Write them in parentheses, across first: (across, up).</p><p>Pick a place on the camp map.</p>",
    check: {
      kind: "mc",
      q: "What are the coordinates of point L?",
      fig: gridFig([{ x: 6, y: 3, t: "L" }], { label: "A grid with point L at (6, 3)" }),
      answer: "a",
      choices: [
        { id: "a", label: "(6, 3)" },
        { id: "b", label: "(3, 6)" },
        { id: "c", label: "(6, 4)" },
      ],
      why: {
        b: "That’s 3 across and 6 up. L is 6 across: the first number is how far across.",
        c: "Count the lines up from 0 again: L is 3 up.",
      },
      explain: "L is 6 across and 3 up: (6, 3).",
    },
  },
];
