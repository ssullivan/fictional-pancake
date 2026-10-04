/* Learn Rational Numbers (Grade 6 Unit 7), chapter 8: Shapes on the coordinate plane. Its widgets and steps; loaded by
   shapes.html. */
/* A rectangle with one corner fixed at (−3, 3): move the opposite corner to see its vertices, sides, perimeter, and area. */
function wRectangle(el) {
  const q = Q(el),
    fixed = [-3, 3],
    values = { x: 4, y: -2 };
  el.innerHTML =
    `<div class="wrow">${stepper("x", "Corner x")}${stepper("y", "Corner y")}</div>` +
    `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { x, y } = values,
      corners = [fixed, [x, fixed[1]], [x, y], [fixed[0], y]],
      across = lineGap(fixed[0], x),
      tall = lineGap(fixed[1], y);
    q("x").textContent = fmt(x);
    q("y").textContent = fmt(y);
    q("f").innerHTML = plane(
      corners.map(([cx, cy]) => ({ x: cx, y: cy })),
      {
        shapes: [{ pts: corners, closed: true, cls: "fill" }],
        label: `Rectangle with vertices ${corners.map((c) => pt(...c)).join(", ")}`,
      },
    );
    q("e").textContent = `perimeter ${2 * (across.gap + tall.gap)} units · area ${across.gap * tall.gap} square units`;
    q("r").innerHTML =
      `Vertices: ${corners.map((c) => pt(...c)).join(", ")}.<br>` +
      `Across, from x = ${fmt(fixed[0])} to x = ${fmt(x)}: ${across.work}. Up and down, from y = ${fmt(y)} to y = ${fmt(fixed[1])}: ${tall.work}.<br>` +
      `Perimeter: 2 · (${across.gap} + ${tall.gap}) = <b>${2 * (across.gap + tall.gap)}</b>. Area: ${across.gap} · ${tall.gap} = <b>${across.gap * tall.gap}</b>.`;
  };
  steppers(el, values, { x: [-2, 6], y: [-5, 2] }, draw);
  draw();
}

/* pictures to draw by connecting points in order, back to the first */
const PICTURES = [
  {
    id: "house",
    label: "House",
    pts: [
      [-4, -4],
      [4, -4],
      [4, 1],
      [0, 5],
      [-4, 1],
    ],
  },
  {
    id: "arrow",
    label: "Arrow",
    pts: [
      [-5, 1],
      [1, 1],
      [1, 3],
      [5, 0],
      [1, -3],
      [1, -1],
      [-5, -1],
    ],
  },
  {
    id: "star",
    label: "Star",
    pts: [
      [0, 5],
      [1, 2],
      [5, 2],
      [2, 0],
      [3, -4],
      [0, -2],
      [-3, -4],
      [-2, 0],
      [-5, 2],
      [-1, 2],
    ],
  },
];
/* Pick a picture and plot its points one at a time, connected in order; the last one closes the shape. */
function wDraw(el) {
  const q = Q(el);
  let pictureId = "house",
    drawn = 1;
  el.innerHTML =
    seg(
      "Picture",
      PICTURES.map((p) => [p.id, p.label]),
    ) +
    `<div class="wrow"><button type="button" class="ghost-btn" data-next>Next point</button><button type="button" class="ghost-btn" data-reset>Start over</button></div>` +
    `<div class="fig" data-f></div><div class="chips" data-c></div><p class="readout" data-r></p>`;
  const draw = () => {
    const picture = PICTURES.find((p) => p.id === pictureId),
      shown = picture.pts.slice(0, drawn),
      done = drawn === picture.pts.length;
    press(el, pictureId);
    q("next").disabled = done;
    q("f").innerHTML = plane(
      shown.map(([x, y], i) => ({ x, y, cls: i === drawn - 1 ? "b" : "" })),
      {
        shapes: [{ pts: shown, closed: done, cls: done ? "fill" : "" }],
        label: `Coordinate plane with ${drawn} of ${picture.pts.length} points of a ${picture.label.toLowerCase()}`,
      },
    );
    q("c").innerHTML = shown.map((c) => `<span class="chip">${pt(...c)}</span>`).join("");
    const [x, y] = picture.pts[drawn - 1];
    q("r").innerHTML = done
      ? `All ${drawn} points are plotted. Connect the last one back to the first, and the ${picture.label.toLowerCase()} is done.`
      : `Point ${drawn} of ${picture.pts.length}: ${pt(x, y)}, ${Math.abs(x)} ${x < 0 ? "left" : "right"} and ${Math.abs(y)} ${y < 0 ? "down" : "up"}. Plot the next one.`;
  };
  onPick(el, (id) => {
    pictureId = id;
    drawn = 1;
    draw();
  });
  q("next").addEventListener("click", () => {
    drawn = Math.min(drawn + 1, PICTURES.find((p) => p.id === pictureId).pts.length);
    draw();
  });
  q("reset").addEventListener("click", () => {
    drawn = 1;
    draw();
  });
  draw();
}

const STEPS = [
  {
    title: "Rectangles from their vertices",
    widget: wRectangle,
    body: "<p>A rectangle drawn along the grid has two sides across and two up and down. Each side length is a distance between two coordinates, so the same rule works: add across an axis, subtract on one side of it. Then the perimeter and area follow.</p><p>Move the corner.</p>",
    check: {
      kind: "num",
      neg: true,
      q: "A rectangle has vertices at (−3, 2), (4, 2), (4, −1), and (−3, −1). What is its perimeter?",
      answer: 20,
      unit: "units",
      misc: [
        [21, "That’s the area, 7 · 3. The perimeter is the distance around: 7 + 3 + 7 + 3."],
        [10, "That’s one length and one width. The perimeter goes all the way around: 2 · (7 + 3)."],
        [
          4,
          "Those sides subtract across an axis: 4 − 3 and 2 − 1. Each side crosses an axis, so add: 3 + 4 = 7 across and 2 + 1 = 3 up and down.",
        ],
      ],
      explain: "Across: 3 + 4 = 7. Up and down: 2 + 1 = 3. Perimeter: 2 · (7 + 3) = 20 units.",
    },
  },
  {
    title: "Drawing with points",
    widget: wDraw,
    body: "<p>Points connected in order can draw a picture. Plot each one with its path from the origin, across and then up or down, and join it to the one before.</p><p>Pick a picture and plot its points.</p>",
    check: {
      kind: "mc",
      q: "Three vertices of a square are (−2, 1), (2, 1), and (2, −3). Where is the fourth vertex?",
      choices: [
        { id: "a", label: "(−2, −3)" },
        { id: "b", label: "(−3, −2)" },
        { id: "c", label: "(2, 3)" },
      ],
      answer: "a",
      why: {
        b: "The numbers are swapped. The fourth vertex has the same x as (−2, 1) and the same y as (2, −3): (−2, −3).",
        c: "(2, 3) is above the other points. The square goes down to y = −3, so the missing corner is at the bottom left.",
      },
      explain:
        "The square runs from x = −2 to 2 and from y = −3 to 1, so the missing corner is (−2, −3). Each side is 4.",
    },
  },
];
