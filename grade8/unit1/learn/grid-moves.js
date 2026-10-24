/* Learn Rigid Transformations and Congruence (Grade 8 Unit 1), chapter 2: Moves on a grid. Its widgets and steps; loaded by
   grid-moves.html. */
/* a right triangle with legs 3 across and 2 up, corner A at (4, 3) on a grid 12 squares across and 9 up */
const SLIDE_TRI = [
    [4, 3],
    [7, 3],
    [4, 5],
  ],
  SLIDE_VIEW = [0, 12, 0, 9];
/* a slide as written: "3 right", "2 down", or "0" */
const stepText = (n, plus, minus) => (n === 0 ? "0" : `${Math.abs(n)} ${n > 0 ? plus : minus}`);
/* Steppers move the triangle across and up or down: every corner gets the same arrow. */
function wSlide(el) {
  const q = Q(el),
    values = { across: 3, up: -2 };
  el.innerHTML =
    `<div class="wrow">${stepper("across", "Across")}${stepper("up", "Up or down")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { across, up } = values,
      move = { kind: "translate", dx: across, dy: up },
      image = movePts(SLIDE_TRI, move),
      moved = across !== 0 || up !== 0;
    q("across").textContent = stepText(across, "right", "left");
    q("up").textContent = stepText(up, "up", "down");
    q("f").innerHTML = planeFig({
      view: SLIDE_VIEW,
      shapes: [
        { pts: SLIDE_TRI, cls: "a", verts: ["A", "B", "C"] },
        { pts: image, cls: "b", verts: ["A′", "B′", "C′"] },
      ],
      arrows: moved ? SLIDE_TRI.map((from, i) => ({ from, to: image[i] })) : [],
      label: `A triangle translated ${stepText(across, "right", "left")} and ${stepText(up, "up", "down")}`,
    });
    q("r").innerHTML = moved
      ? `Every corner moves ${[across ? stepText(across, "right", "left") : "", up ? stepText(up, "up", "down") : ""].filter(Boolean).join(" and ")}: count the squares from A to A′, B to B′, or C to C′, and they all match. <b>${moveText(move)}</b>.`
      : "No move yet: the image sits right on the triangle. Use the buttons to slide it.";
  };
  steppers(el, values, { across: [-4, 5], up: [-3, 4] }, draw);
  draw();
}

/* the trapezoid ABCD with A at (5, 4), and two centers to turn it around: its corner A, or the point (3, 2) off it */
const TURN_TRAP = [
    [5, 4],
    [8, 4],
    [7, 6],
    [5, 6],
  ],
  TURN_VIEW = [0, 12, 0, 10],
  CENTERS = { corner: [5, 4], off: [4, 5] };
/* Pick a turn and a center: the segment from the center to B turns with the trapezoid and keeps its length. */
function wTurn(el) {
  const q = Q(el);
  let turn = -90,
    centerId = "corner";
  el.innerHTML =
    `<div data-top>${seg("Turn", [
      [-90, "90° clockwise"],
      [90, "90° counterclockwise"],
      [180, "180°"],
    ])}</div>` +
    `<div data-bot>${seg("Center", [
      ["corner", "P at corner A"],
      ["off", "P off the shape"],
    ])}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const center = CENTERS[centerId],
      move = { kind: "rotate", center, turn },
      image = movePts(TURN_TRAP, move);
    press(q("top"), turn);
    press(q("bot"), centerId);
    q("f").innerHTML = planeFig({
      view: TURN_VIEW,
      shapes: [
        { pts: TURN_TRAP, cls: "a", verts: ["A", "B", "C", "D"] },
        { pts: image, cls: "b", verts: centerId === "corner" ? ["", "B′", "C′", "D′"] : ["A′", "B′", "C′", "D′"] },
      ],
      segs: [
        { from: center, to: TURN_TRAP[1] },
        { from: center, to: image[1], cls: "b" },
      ],
      turns: [{ center, from: TURN_TRAP[1], turn }],
      points: [{ at: center, text: "P", dir: centerId === "corner" ? 135 : 90 }],
      label: `A trapezoid turned ${turnText(turn)} around P`,
    });
    q("r").innerHTML =
      `Every corner turns ${turnText(turn)} around P. The dashed segment from P to B turns to P to B′: the same length, ${turn === 180 ? "pointing the opposite way" : "at a right angle to where it was"}. ` +
      (centerId === "corner"
        ? "A is the center, so it doesn’t move: A′ is A."
        : "Turn one segment, then build the rest of the shape around it.");
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (row === "top") turn = +id;
    if (row === "bot") centerId = id;
    if (row) draw();
  });
  draw();
}

/* a right triangle with corner A at (1, 2), legs 3 across and 2 up, and the grids for a line standing up or lying flat */
const FLIP_TRI = [
    [1, 2],
    [4, 2],
    [1, 4],
  ],
  FLIP_VIEWS = { up: [0, 12, 0, 6], flat: [0, 6, 0, 11] };
/* Pick a line standing up or lying flat and move it away from the triangle: each corner lands just as far on the other side. */
function wFlip(el) {
  const q = Q(el),
    values = { gap: 1 };
  let direction = "up";
  el.innerHTML =
    seg("Line ℓ", [
      ["up", "Standing up"],
      ["flat", "Lying flat"],
    ]) +
    `<div class="wrow">${stepper("gap", "Squares from B to ℓ")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { gap } = values,
      upright = direction === "up",
      /* the line is gap squares past B (to the right) or past C (above) */
      line = upright ? { x: 4 + gap } : { y: 4 + gap },
      image = movePts(FLIP_TRI, { kind: "reflect", line }),
      /* how far A is from the line, and A′ on the other side */
      fromA = upright ? line.x - 1 : line.y - 2;
    press(el, direction);
    q("gap").textContent = `${gap}`;
    q("f").innerHTML = planeFig({
      view: FLIP_VIEWS[direction],
      shapes: [
        { pts: FLIP_TRI, cls: "a", verts: ["A", "B", "C"] },
        { pts: image, cls: "b", verts: ["A′", "B′", "C′"] },
      ],
      lines: [{ line, text: "ℓ" }],
      segs: [{ from: FLIP_TRI[0], to: image[0], cls: "b" }],
      label: `A triangle reflected over a line ${upright ? "standing up" : "lying flat"}`,
    });
    const nearCorner = upright ? "B" : "C";
    q("r").innerHTML =
      `A is ${fromA} squares ${upright ? "left of" : "below"} ℓ, so A′ is ${fromA} squares ${upright ? "right of" : "above"} it. The segment from A to A′ crosses ℓ at a right angle, and ℓ cuts it in half. ` +
      (gap === 0
        ? `${nearCorner} is on ℓ, so it stays put: ${nearCorner}′ is ${nearCorner}.`
        : `${nearCorner} is ${gap} ${gap === 1 ? "square" : "squares"} from ℓ, and so is ${nearCorner}′.`);
  };
  steppers(el, values, { gap: [0, 2] }, draw);
  onPick(el, (id) => {
    direction = id;
    draw();
  });
  draw();
}

const STEPS = [
  {
    title: "Translate on a grid",
    widget: wSlide,
    body: "<p>On a grid, a translation is easy to check: count the squares from a corner to its image, across and then up or down. In a translation, <b>every</b> point moves the same number of squares the same way.</p><p>Slide the triangle.</p>",
    check: {
      kind: "num",
      q: "A translation moves corner A of a sprite 4 squares right and 3 squares up. How many squares up does corner B move?",
      answer: 3,
      unit: "squares",
      misc: [
        [4, "That’s how far it moves right. The question asks how far up."],
        [7, "Across and up are separate: B moves 4 right and 3 up, like A."],
      ],
      explain: "Every point moves the same way in a translation: 4 right and 3 up. So B moves 3 squares up.",
    },
  },
  {
    title: "Rotate around a point",
    widget: wTurn,
    body: "<p>To rotate a shape around a point P, turn the segment from P to one corner by the angle, keeping its length the same. That corner’s image lands at the end of the turned segment. A point at the center doesn’t move.</p><p>Pick a turn and a center.</p>",
    check: {
      kind: "mc",
      q: "A sprite is rotated 90° clockwise around P, then 90° clockwise around P again. What single move does the same thing?",
      choices: [
        { id: "b", label: "A 90° counterclockwise rotation around P" },
        { id: "c", label: "No move at all" },
        { id: "a", label: "A 180° rotation around P" },
      ],
      answer: "a",
      why: {
        b: "Both turns go clockwise, so they add up. A counterclockwise turn would undo one of them.",
        c: "The second turn goes the same way as the first, so it doesn’t undo it. They add up.",
      },
      explain: "Two quarter turns the same way make a half turn: 90° + 90° = 180°.",
      stack: true,
    },
  },
  {
    title: "Reflect across a line",
    widget: wFlip,
    body: "<p>To reflect a shape over a line ℓ, take each corner straight across ℓ (at a right angle to it) and just as far on the other side. A point on ℓ stays where it is. The image is a mirror image.</p><p>Stand the line up or lay it flat, and move it.</p>",
    check: {
      kind: "num",
      q: "Point A is 3 squares to the left of a line ℓ that stands straight up. It’s reflected over ℓ. How far apart are A and A′?",
      answer: 6,
      unit: "squares",
      misc: [
        [3, "That’s how far A′ is from ℓ. A is 3 squares on the other side."],
        [0, "A isn’t on ℓ, so it moves: across ℓ to the other side."],
      ],
      explain: "A′ is 3 squares to the right of ℓ, and A is 3 to the left: 3 + 3 = 6 squares apart.",
    },
  },
];
