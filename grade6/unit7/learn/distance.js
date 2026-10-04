/* Learn Rational Numbers (Grade 6 Unit 7), chapter 7: Reflections and distances. Its widgets and steps; loaded by
   distance.html. */
/* Move a point and reflect it across either axis: across the x-axis y changes sign, across the y-axis x does. */
function wReflect(el) {
  const q = Q(el),
    values = { x: 3, y: -4 },
    across = { x: true, y: false };
  el.innerHTML =
    `<div class="wrow">${stepper("x", "x")}${stepper("y", "y")}</div>` +
    `<div class="wrow"><button type="button" class="ghost-btn" data-ax>Across the x-axis</button><button type="button" class="ghost-btn" data-ay>Across the y-axis</button></div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { x, y } = values,
      images = [...(across.x ? [["x", x, -y]] : []), ...(across.y ? [["y", -x, y]] : [])];
    q("x").textContent = fmt(x);
    q("y").textContent = fmt(y);
    q("ax").setAttribute("aria-pressed", across.x);
    q("ay").setAttribute("aria-pressed", across.y);
    q("f").innerHTML = plane(
      [{ x, y, t: pt(x, y) }, ...images.map(([, ix, iy]) => ({ x: ix, y: iy, cls: "b", t: pt(ix, iy) }))],
      {
        shapes: images.map(([, ix, iy]) => ({
          pts: [
            [x, y],
            [ix, iy],
          ],
          cls: "walk",
        })),
        label: `Coordinate plane with ${pt(x, y)} and its reflections`,
      },
    );
    q("r").innerHTML = images.length
      ? images
          .map(([axis, ix, iy]) =>
            (axis === "x" ? !y : !x)
              ? `${pt(x, y)} is on the ${axis}-axis, so reflecting across it leaves it where it is.`
              : `Across the ${axis}-axis, ${pt(x, y)} lands on <b>${pt(ix, iy)}</b>: ${axis === "x" ? "y" : "x"} changes sign and ${axis} stays.`,
          )
          .join("<br>")
      : "Pick an axis to reflect across.";
  };
  q("ax").addEventListener("click", () => {
    across.x = !across.x;
    draw();
  });
  q("ay").addEventListener("click", () => {
    across.y = !across.y;
    draw();
  });
  steppers(el, values, { x: [-6, 6], y: [-6, 6] }, draw);
  draw();
}

/* Two points on a horizontal or vertical line: their distance, from each one's distance to the axis between them. */
function wLineDistance(el) {
  const q = Q(el),
    values = { a: -4, b: 6 },
    shared = 2;
  let flat = true;
  el.innerHTML =
    seg("Line", [
      ["flat", "Across"],
      ["tall", "Up and down"],
    ]) +
    `<div class="wrow">${stepper("a", "First point")}${stepper("b", "Second point")}</div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { a, b } = values,
      first = flat ? [a, shared] : [shared, a],
      second = flat ? [b, shared] : [shared, b],
      { gap, work } = lineGap(a, b),
      axis = flat ? "y" : "x";
    press(el, flat ? "flat" : "tall");
    q("a").textContent = pt(...first);
    q("b").textContent = pt(...second);
    q("f").innerHTML = plane(
      [
        { x: first[0], y: first[1] },
        { x: second[0], y: second[1], cls: "b" },
      ],
      {
        size: 8,
        shapes: [{ pts: [first, second], cls: "walk" }],
        label: `Coordinate plane with ${pt(...first)} and ${pt(...second)}`,
      },
    );
    q("e").textContent = `distance = ${gap}`;
    q("r").innerHTML = !gap
      ? "The two points are in the same place: 0 apart."
      : !a || !b
        ? `One point is on the ${axis}-axis, so the distance is the other one’s distance from it: <b>${work}</b>.`
        : a < 0 !== b < 0
          ? `The points are on opposite sides of the ${axis}-axis. Add their distances to it: <b>${work}</b>.`
          : `The points are on the same side of the ${axis}-axis. Subtract their distances to it: <b>${work}</b>.`;
  };
  onPick(el, (id) => {
    flat = id === "flat";
    draw();
  });
  steppers(el, values, { a: [-8, 8], b: [-8, 8] }, draw);
  draw();
}

/* places on a town map, and the routes between them along a street (the same x, or the same y) */
const TOWN = {
  library: [-4, 2],
  pool: [-4, -5],
  school: [-5, -2],
  park: [3, -2],
  museum: [3, 4],
};
const ROUTES = [
  ["library", "pool"],
  ["school", "park"],
  ["park", "museum"],
];
/* Pick a route on the town map: how many blocks apart two places are. */
function wMap(el) {
  const q = Q(el);
  let routeIndex = 0;
  el.innerHTML =
    seg(
      "Route",
      ROUTES.map(([from, to], i) => [i, `${from} to ${to}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [from, to] = ROUTES[routeIndex],
      [x1, y1] = TOWN[from],
      [x2, y2] = TOWN[to],
      sameX = x1 === x2,
      { gap, work } = sameX ? lineGap(y1, y2) : lineGap(x1, x2);
    press(el, routeIndex);
    q("f").innerHTML = plane(
      Object.entries(TOWN).map(([name, [x, y]]) => ({
        x,
        y,
        cls: name === from || name === to ? "b" : "",
        t: name === from || name === to ? name : "",
      })),
      {
        size: 7,
        xLabel: "blocks east",
        yLabel: "blocks north",
        shapes: [
          {
            pts: [
              [x1, y1],
              [x2, y2],
            ],
            cls: "walk",
          },
        ],
        label: `Town map: the ${from} at ${pt(x1, y1)} and the ${to} at ${pt(x2, y2)}`,
      },
    );
    q("r").innerHTML =
      `The ${from} is at ${pt(x1, y1)} and the ${to} is at ${pt(x2, y2)}. They have the same ${sameX ? "x" : "y"}, so the route goes straight ${sameX ? "up and down" : "across"}: ` +
      `<b>${work}</b>, so they’re ${gap} blocks apart.`;
  };
  onPick(el, (id) => {
    routeIndex = +id;
    draw();
  });
  draw();
}

const STEPS = [
  {
    title: "Reflecting across an axis",
    widget: wReflect,
    body: "<p>Reflecting a point across an axis flips it to the other side, the same distance away, like a mirror. Across the x-axis, the point flips up or down, so y changes sign. Across the y-axis, it flips left or right, so x changes sign.</p><p>Move the point and reflect it.</p>",
    check: {
      kind: "mc",
      q: "The point (−3, 5) is reflected across the x-axis. Where does it land?",
      choices: [
        { id: "a", label: "(−3, −5)" },
        { id: "b", label: "(3, 5)" },
        { id: "c", label: "(5, −3)" },
      ],
      answer: "a",
      why: {
        b: "That’s the reflection across the y-axis. Across the x-axis, the point flips down, so y changes sign.",
        c: "That swaps the numbers. A reflection keeps them and changes one sign.",
      },
      explain: "Across the x-axis, y changes sign and x stays: (−3, 5) lands on (−3, −5).",
    },
  },
  {
    title: "Distance along a grid line",
    widget: wLineDistance,
    body: "<p>When two points share an x or a y, the distance between them is along one grid line. Find each point’s distance to the axis between them. If the points are on opposite sides, add; if they’re on the same side, subtract.</p><p>Move the two points.</p>",
    check: {
      kind: "num",
      neg: true,
      q: "What is the distance between (−4, 3) and (6, 3)?",
      answer: 10,
      unit: "units",
      misc: [
        [2, "That subtracts 4 from 6. The points are on opposite sides of the y-axis, so add: 4 + 6."],
        [-10, "A distance is never negative."],
      ],
      explain: "The points are on opposite sides of the y-axis: |−4| + |6| = 4 + 6 = 10 units.",
    },
  },
  {
    title: "Getting around town",
    widget: wMap,
    body: "<p>On a map, the coordinates can mean something: here the origin is the town square, and each unit is one block. Places that share an x or a y are on the same street.</p><p>Pick a route.</p>",
    check: {
      kind: "num",
      neg: true,
      q: "On the town map, the bakery is at (−5, −2) and the fire station is at (3, −2). How many blocks apart are they?",
      answer: 8,
      unit: "blocks",
      misc: [[2, "That subtracts 3 from 5. The places are on opposite sides of the y-axis, so add: 5 + 3."]],
      explain: "The same y, on opposite sides of the y-axis: 5 + 3 = 8 blocks.",
    },
  },
];
