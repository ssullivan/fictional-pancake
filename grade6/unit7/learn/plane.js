/* Learn Rational Numbers (Grade 6 Unit 7), chapter 6: The coordinate plane. Its widgets and steps; loaded by plane.html. */
/* the quadrant (I to IV) a point is in, or null on an axis */
const quadrantOf = (x, y) => (!x || !y ? null : x > 0 ? (y > 0 ? "I" : "IV") : y > 0 ? "II" : "III");
/* the path from the origin to (x, y), across and then up or down, in words */
const pathWords = (x, y) =>
  `${x ? `${Math.abs(x)} ${x < 0 ? "left" : "right"}` : "no steps across"}, then ${y ? `${Math.abs(y)} ${y < 0 ? "down" : "up"}` : "no steps up or down"}`;

/* Move a point with x and y: its quadrant, from the signs of its coordinates. */
function wQuadrants(el) {
  const q = Q(el),
    values = { x: -3, y: 2 };
  el.innerHTML =
    `<div class="wrow">${stepper("x", "x")}${stepper("y", "y")}</div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { x, y } = values,
      quadrant = quadrantOf(x, y);
    q("x").textContent = fmt(x);
    q("y").textContent = fmt(y);
    q("f").innerHTML = plane([{ x, y, cls: "b", t: pt(x, y) }], {
      quads: true,
      shade: quadrant,
      shapes: [
        {
          pts: [
            [0, 0],
            [x, 0],
            [x, y],
          ],
          cls: "walk",
        },
      ],
      label: `Coordinate plane with the point ${pt(x, y)}`,
    });
    q("e").textContent = pt(x, y);
    q("r").innerHTML = quadrant
      ? `${pt(x, y)} is in <b>Quadrant ${quadrant}</b>: x is ${x < 0 ? "negative (left of the y-axis)" : "positive (right of the y-axis)"} and y is ${y < 0 ? "negative (below the x-axis)" : "positive (above the x-axis)"}.`
      : x || y
        ? `${pt(x, y)} is on the ${y ? "y" : "x"}-axis, so it isn’t in any quadrant.`
        : "(0, 0) is the origin, where the axes cross.";
  };
  steppers(el, values, { x: [-6, 6], y: [-6, 6] }, draw);
  draw();
}

/* points to read on a plane */
const POINTS = [
  { id: "A", x: -4, y: 3 },
  { id: "B", x: 5, y: -2 },
  { id: "C", x: -2, y: -5 },
  { id: "D", x: 3, y: 4 },
];
/* Pick a point: the path to it from the origin, across first and then up or down, gives its coordinates. */
function wReadPoint(el) {
  const q = Q(el);
  let pointId = "A";
  el.innerHTML =
    seg(
      "Point",
      POINTS.map((p) => [p.id, `Point ${p.id}`]),
    ) + `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { x, y } = POINTS.find((p) => p.id === pointId);
    press(el, pointId);
    q("f").innerHTML = plane(
      POINTS.map((p) => ({ x: p.x, y: p.y, t: p.id, cls: p.id === pointId ? "b" : "" })),
      {
        shapes: [
          {
            pts: [
              [0, 0],
              [x, 0],
              [x, y],
            ],
            cls: "walk",
          },
        ],
        label: `Coordinate plane with points A to D; the path to point ${pointId} is drawn`,
      },
    );
    q("e").textContent = `${pointId} ${pt(x, y)}`;
    q("r").innerHTML =
      `From the origin: <b>${pathWords(x, y)}</b>. Across gives x = ${fmt(x)}, then up or down gives y = ${fmt(y)}, so ${pointId} is at ${pt(x, y)}. The x-coordinate always comes first.`;
  };
  onPick(el, (id) => {
    pointId = id;
    draw();
  });
  draw();
}

/* points that need a bigger scale than 1 a grid line */
const SPREAD = [
  { id: "P", x: -8, y: 4 },
  { id: "Q", x: 10, y: -6 },
  { id: "R", x: 4, y: 12 },
  { id: "S", x: -3, y: 5 },
];
/* Pick how far apart the grid lines are: with 6 lines each way from 0, a bigger scale fits more points. */
function wScale(el) {
  const q = Q(el);
  let scale = 1;
  el.innerHTML =
    seg("Each grid line is", [
      ["1", "1 apart"],
      ["2", "2 apart"],
      ["5", "5 apart"],
    ]) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const size = 6 * scale,
      fits = SPREAD.filter((p) => Math.abs(p.x) <= size && Math.abs(p.y) <= size),
      left = SPREAD.filter((p) => !fits.includes(p));
    press(el, scale);
    q("f").innerHTML = plane(
      fits.map((p) => ({ x: p.x, y: p.y, t: p.id })),
      {
        size,
        xStep: scale,
        yStep: scale,
        label: `Coordinate plane from −${size} to ${size}, grid lines ${scale} apart`,
      },
    );
    q("r").innerHTML =
      `With grid lines ${scale} apart, the axes go from ${fmt(-size)} to ${size}. ` +
      (left.length
        ? `${left.map((p) => `${p.id} ${pt(p.x, p.y)}`).join(", ")} ${left.length === 1 ? "doesn’t" : "don’t"} fit.`
        : "All four points fit.") +
      (scale === 5 ? ` They fit, but they’re crowded near the middle.` : "") +
      `<br><span class="dimline">Pick a scale so the greatest distance from 0 fits: here that’s 12 (point R).</span>`;
  };
  onPick(el, (id) => {
    scale = +id;
    draw();
  });
  draw();
}

const STEPS = [
  {
    title: "Four quadrants",
    widget: wQuadrants,
    body: "<p>With negative numbers, the coordinate plane has four parts, called <b>quadrants</b>, numbered I to IV counterclockwise from the top right. A point’s signs tell its quadrant: (+, +) is I, (−, +) is II, (−, −) is III, and (+, −) is IV.</p><p>Move the point.</p>",
    check: {
      kind: "mc",
      q: "In which quadrant is the point (4, −7)?",
      choices: [
        { id: "a", label: "Quadrant I" },
        { id: "b", label: "Quadrant II" },
        { id: "c", label: "Quadrant III" },
        { id: "d", label: "Quadrant IV" },
      ],
      answer: "d",
      why: {
        a: "Quadrant I has a positive x and a positive y. Here y is −7, below the x-axis.",
        b: "Quadrant II has a negative x. Here x is 4, right of the y-axis.",
        c: "Quadrant III has a negative x and a negative y. Here x is 4, positive.",
      },
      explain: "x = 4 is positive (right) and y = −7 is negative (down): Quadrant IV, the bottom right.",
    },
  },
  {
    title: "Reading a point",
    widget: wReadPoint,
    body: "<p>A point’s coordinates are a path from the origin, (0, 0). The first number, x, says how far to go across: right if positive, left if negative. The second, y, says how far up (positive) or down (negative).</p><p>Pick a point.</p>",
    check: {
      kind: "mc",
      q: "Which point is at (−2, 5)?",
      fig: plane(
        [
          { x: -2, y: 5, t: "A" },
          { x: 5, y: -2, t: "B" },
          { x: 2, y: 5, t: "C" },
          { x: -2, y: -5, t: "D" },
        ],
        { label: "Coordinate plane with points A, B, C, and D" },
      ),
      choices: [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
        { id: "c", label: "C" },
        { id: "d", label: "D" },
      ],
      answer: "a",
      why: {
        b: "B is at (5, −2): the numbers are swapped. Go across first: x = −2 is 2 to the left.",
        c: "C is at (2, 5), right of the y-axis. x = −2 is to the left.",
        d: "D is at (−2, −5), below the x-axis. y = 5 is up.",
      },
      explain: "(−2, 5): from the origin, 2 to the left, then 5 up. That’s point A.",
    },
  },
  {
    title: "Choosing a scale",
    widget: wScale,
    body: "<p>The grid lines on an axis don’t have to be 1 apart. When the numbers are big, count by 2s, 5s, or 10s, the same way on both sides of 0.</p><p>Pick how far apart the grid lines are.</p>",
    check: {
      kind: "num",
      neg: true,
      q: "The grid lines on the x-axis are 5 apart. A point is 3 grid lines to the left of the y-axis. What is its x-coordinate?",
      answer: -15,
      misc: [
        [-3, "That counts grid lines. Each one is 5, so 3 grid lines is 15."],
        [15, "The point is to the left of the y-axis, so its x-coordinate is negative."],
      ],
      explain: "3 grid lines of 5 is 15, and left of the y-axis is negative: x = −15.",
    },
  },
];
