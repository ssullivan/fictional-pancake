/* Learn Rigid Transformations and Congruence (Grade 8 Unit 1), chapter 3: Coordinate moves. Its widgets and steps; loaded by
   coordinates.html, after common.js (ABC and cornerTable). */
/* the coordinate plane every step draws on */
const PLANE_VIEW = [-6, 6, -6, 6];
/* the triangle the translation step slides, with A at (−1, 1), so it can go 5 squares either way */
const SLIDE_ABC = movePts(ABC, { kind: "translate", dx: -2, dy: 0 });
/* the plane with a triangle and its image, and whatever else shows the move (options for planeFig) */
const movedFig = (before, after, extra = {}, label = "A triangle and its image on a coordinate plane") =>
  planeFig({
    view: PLANE_VIEW,
    axes: true,
    cell: 22,
    shapes: [
      { pts: before, cls: "a", verts: ["A", "B", "C"] },
      { pts: after, cls: "b", verts: ["A′", "B′", "C′"] },
    ],
    ...extra,
    label,
  });

/* Steppers slide the triangle: the rule adds the slide to x and y, and the table shows each corner's new coordinates. */
function wTranslate(el) {
  const q = Q(el),
    values = { across: 3, up: -2 };
  el.innerHTML =
    `<div class="wrow">${stepper("across", "Across")}${stepper("up", "Up or down")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { across, up } = values,
      move = { kind: "translate", dx: across, dy: up },
      image = movePts(SLIDE_ABC, move);
    q("across").textContent = across === 0 ? "0" : `${Math.abs(across)} ${across > 0 ? "right" : "left"}`;
    q("up").textContent = up === 0 ? "0" : `${Math.abs(up)} ${up > 0 ? "up" : "down"}`;
    q("f").innerHTML = movedFig(
      SLIDE_ABC,
      image,
      { arrows: across || up ? [{ from: SLIDE_ABC[0], to: image[0] }] : [] },
      "Triangle ABC translated on a coordinate plane",
    );
    q("r").innerHTML = typeset(
      `${across ? `${across > 0 ? "Right adds to" : "Left subtracts from"} ${math("x")}` : `${math("x")} stays the same`}, and ` +
        `${up ? `${up > 0 ? "up adds to" : "down subtracts from"} ${math("y")}` : `${math("y")} stays the same`}. ` +
        `The rule: <b>${math(ruleTex(move))}</b>.${cornerTable(SLIDE_ABC, image)}`,
    );
  };
  steppers(el, values, { across: [-5, 4], up: [-6, 3] }, draw);
  draw();
}

/* Pick an axis to reflect over: one coordinate keeps its value and the other changes sign. */
function wAxes(el) {
  const q = Q(el);
  el.innerHTML =
    seg("Reflect over", [
      ["x", "The x-axis"],
      ["y", "The y-axis"],
    ]) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (axis) => {
    /* the x-axis is the line y = 0; the y-axis is x = 0 */
    const move = { kind: "reflect", line: axis === "x" ? { y: 0 } : { x: 0 } },
      image = movePts(ABC, move);
    press(el, axis);
    q("f").innerHTML = movedFig(
      ABC,
      image,
      { segs: [{ from: ABC[1], to: image[1], cls: "b" }] },
      `Triangle ABC reflected over the ${axis}-axis`,
    );
    q("r").innerHTML = typeset(
      (axis === "x"
        ? `Over the ${math("x")}-axis, each corner flips up or down: ${math("x")} stays the same and ${math("y")} changes sign.`
        : `Over the ${math("y")}-axis, each corner flips left or right: ${math("y")} stays the same and ${math("x")} changes sign.`) +
        ` The rule: <b>${math(ruleTex(move))}</b>.${cornerTable(ABC, image)}`,
    );
  };
  onPick(el, draw);
  draw("x");
}

/* Pick a turn around the origin: the coordinates swap places, and the signs show which way it turned. */
function wOrigin(el) {
  const q = Q(el);
  el.innerHTML =
    seg("Rotate around the origin", [
      [90, "90° counterclockwise"],
      [180, "180°"],
      [-90, "90° clockwise"],
    ]) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (turn) => {
    const move = { kind: "rotate", center: [0, 0], turn },
      image = movePts(ABC, move);
    press(el, turn);
    q("f").innerHTML = movedFig(
      ABC,
      image,
      {
        segs: [
          { from: [0, 0], to: ABC[1] },
          { from: [0, 0], to: image[1], cls: "b" },
        ],
        turns: [{ center: [0, 0], from: ABC[1], turn }],
      },
      `Triangle ABC rotated ${turnText(turn)} around the origin`,
    );
    q("r").innerHTML = typeset(
      {
        90: `A quarter turn counterclockwise swaps the coordinates, and the new first one changes sign: B ${ptText(ABC[1])} lands at ${ptText(image[1])}.`,
        180: `A half turn changes both signs: every corner ends up straight across the origin. B ${ptText(ABC[1])} lands at ${ptText(image[1])}.`,
        [-90]: `A quarter turn clockwise swaps the coordinates, and the new second one changes sign: B ${ptText(ABC[1])} lands at ${ptText(image[1])}.`,
      }[turn] + ` The rule: <b>${math(ruleTex(move))}</b>.${cornerTable(ABC, image)}`,
    );
  };
  onPick(el, (id) => draw(+id));
  draw(90);
}

const STEPS = [
  {
    title: "Translations change x and y",
    widget: wTranslate,
    body: "<p>On a coordinate plane, a translation adds the same amounts to every point: the slide across to \\(x\\) and the slide up or down to \\(y\\). That’s a <b>rule</b> for the move, written like \\((x, y) \\to (x + 3, y - 2)\\).</p><p>Slide the triangle.</p>",
    check: {
      kind: "mc",
      q: "The point (4, −1) is translated 2 units left and 5 units up. Where does it land?",
      choices: [
        { id: "b", label: "(6, 4)" },
        { id: "c", label: "(2, −6)" },
        { id: "a", label: "(2, 4)" },
        { id: "d", label: "(9, −3)" },
      ],
      answer: "a",
      why: {
        b: "Left subtracts from x: 4 − 2 = 2.",
        c: "Up adds to y: −1 + 5 = 4.",
        d: "The across move changes x and the up-and-down move changes y, not the other way round.",
      },
      explain: "x: 4 − 2 = 2. y: −1 + 5 = 4. It lands at (2, 4).",
    },
  },
  {
    title: "Reflecting over an axis",
    widget: wAxes,
    body: "<p>A reflection over an axis keeps one coordinate and changes the sign of the other. Over the \\(x\\)-axis, points flip up and down, so \\(y\\) changes sign: \\((x, y) \\to (x, -y)\\). Over the \\(y\\)-axis, \\(x\\) changes sign: \\((x, y) \\to (-x, y)\\).</p><p>Pick an axis.</p>",
    check: {
      kind: "mc",
      q: "The point (3, −5) is reflected over the y-axis. Where does it land?",
      choices: [
        { id: "b", label: "(3, 5)" },
        { id: "a", label: "(−3, −5)" },
        { id: "c", label: "(−3, 5)" },
      ],
      answer: "a",
      why: {
        b: "That’s over the x-axis. Over the y-axis, x changes sign.",
        c: "Only one coordinate changes sign. Over the y-axis, it’s x.",
      },
      explain: "Over the y-axis, x changes sign and y stays: (3, −5) → (−3, −5).",
    },
  },
  {
    title: "Rotating around the origin",
    widget: wOrigin,
    body: "<p>A rotation around the origin, \\((0, 0)\\), turns every point the same angle. A half turn changes both signs: \\((x, y) \\to (-x, -y)\\). A quarter turn swaps the coordinates and changes one sign: \\((x, y) \\to (-y, x)\\) counterclockwise, and \\((x, y) \\to (y, -x)\\) clockwise.</p><p>Pick a turn.</p>",
    check: {
      kind: "mc",
      q: "The point (4, 1) is rotated 90° counterclockwise around the origin. Where does it land?",
      choices: [
        { id: "b", label: "(1, −4)" },
        { id: "c", label: "(−4, −1)" },
        { id: "d", label: "(1, 4)" },
        { id: "a", label: "(−1, 4)" },
      ],
      answer: "a",
      why: {
        b: "That’s clockwise. Counterclockwise takes (x, y) to (−y, x).",
        c: "That’s a half turn, 180°. A quarter turn swaps the coordinates.",
        d: "Swapping isn’t enough: one sign changes too. Counterclockwise takes (x, y) to (−y, x).",
      },
      explain: "Counterclockwise, (x, y) → (−y, x): (4, 1) → (−1, 4).",
    },
  },
];
