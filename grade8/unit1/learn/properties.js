/* Learn Rigid Transformations and Congruence (Grade 8 Unit 1), chapter 5: What rigid moves keep. Its widgets and steps; loaded
   by properties.html. */
/* a right triangle with sides 3, 4, and 5, the right angle at A (1, 1), on a grid 14 squares across and 8 up */
const RIGHT_TRI = [
    [1, 1],
    [5, 1],
    [1, 4],
  ],
  KEEP_VIEW = [0, 14, 0, 8];
/* a move of each kind that puts the triangle's image on the right of the grid */
const KEEP_MOVES = {
  translate: { kind: "translate", dx: 8, dy: 3 },
  rotate: { kind: "rotate", center: [7, 4], turn: 180 },
  reflect: { kind: "reflect", line: { x: 7 } },
};
/* Pick a move: the image's sides and its right angle are the same as the triangle's. */
function wKeep(el) {
  const q = Q(el);
  el.innerHTML =
    seg("Move", [
      ["translate", "Translate"],
      ["rotate", "Rotate 180°"],
      ["reflect", "Reflect"],
    ]) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (kind) => {
    const move = KEEP_MOVES[kind],
      image = movePts(RIGHT_TRI, move),
      /* the sides AB, BC, CA and the right angle at A, written on both triangles */
      labels = { sides: ["4", "5", "3"], angles: { 0: "90°" } };
    press(el, kind);
    q("f").innerHTML = planeFig({
      view: KEEP_VIEW,
      shapes: [
        { pts: RIGHT_TRI, cls: "a", verts: ["A", "B", "C"], ...labels },
        { pts: image, cls: "b", verts: ["A′", "B′", "C′"], ...labels },
      ],
      ...(kind === "rotate" ? { points: [{ at: move.center, text: "P" }] } : {}),
      ...(kind === "reflect" ? { lines: [{ line: move.line, text: "ℓ" }] } : {}),
      label: `A 3-4-5 right triangle and its image after a ${kind === "translate" ? "translation" : kind === "rotate" ? "rotation" : "reflection"}`,
    });
    q("r").innerHTML =
      "The image’s sides are 3, 4, and 5, and A′ is a right angle, just like ABC. Its area is ½ × 4 × 3 = 6 square units both times. " +
      (kind === "translate"
        ? "Only its <b>place</b> changed."
        : `Only its <b>place</b> and <b>which way it faces</b> changed${kind === "reflect" ? ": it’s a mirror image" : ": it’s upside down"}.`);
  };
  onPick(el, draw);
  draw("translate");
}

/* line ℓ through X (2, 2) and Y (6, 4), and the moves that take it to itself, to a parallel line, or across itself */
const LINE_X = [2, 2],
  LINE_Y = [6, 4],
  LINE_VIEW = [0, 10, 0, 9],
  LINE_MOVES = {
    halfOn: { move: { kind: "rotate", center: [4, 3], turn: 180 }, says: "a half turn around P, a point on ℓ" },
    halfOff: { move: { kind: "rotate", center: [5, 5], turn: 180 }, says: "a half turn around P, a point off ℓ" },
    quarter: { move: { kind: "rotate", center: [4, 3], turn: 90 }, says: "a quarter turn around P, a point on ℓ" },
    slide: { move: { kind: "translate", dx: 0, dy: 3 }, says: "a translation 3 units up" },
  };
/* Pick a move: the image of line ℓ goes through the images of X and Y, and lands on ℓ, parallel to it, or across it. */
function wLines(el) {
  const q = Q(el);
  el.innerHTML =
    seg("Move", [
      ["halfOn", "180° around a point on ℓ"],
      ["halfOff", "180° around a point off ℓ"],
      ["quarter", "90° around a point on ℓ"],
      ["slide", "Translate up 3"],
    ]) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (id) => {
    const { move, says } = LINE_MOVES[id],
      [movedX, movedY] = movePts([LINE_X, LINE_Y], move);
    press(el, id);
    q("f").innerHTML = planeFig({
      view: LINE_VIEW,
      lines: [
        { line: { through: [LINE_X, LINE_Y] }, text: "ℓ", cls: "solid" },
        { line: { through: [movedX, movedY] }, text: "ℓ′", cls: "c" },
      ],
      points: [
        { at: LINE_X, text: "X", dir: 300 },
        { at: LINE_Y, text: "Y", dir: 300 },
        { at: movedX, text: "X′", cls: "b", dir: 120 },
        { at: movedY, text: "Y′", cls: "b", dir: 120 },
        ...(move.kind === "rotate" ? [{ at: move.center, text: "P", dir: 210 }] : []),
      ],
      label: `Line ℓ and its image after ${says}`,
    });
    q("r").innerHTML =
      `After ${says}, X lands at X′ and Y at Y′, and the image ℓ′ is the line through them. ` +
      {
        halfOn: "X and Y swap places, so ℓ′ is <b>ℓ itself</b>, facing the other way.",
        halfOff:
          "ℓ′ is <b>parallel</b> to ℓ, on the other side of P. A half turn always makes a line parallel to itself, or puts it right back.",
        quarter:
          "ℓ′ crosses ℓ at P <b>at a right angle</b>. A rigid move takes a line to a line, but only a half turn or a slide keeps it parallel.",
        slide: "Every point moved the same way, so ℓ′ is <b>parallel</b> to ℓ: a translation never turns a line.",
      }[id];
  };
  onPick(el, draw);
  draw("halfOff");
}

/* a right triangle with legs 4 across and 3 up, and the middles of its sides to turn it around */
const LEGS_TRI = [
    [2, 2],
    [6, 2],
    [2, 5],
  ],
  MIDDLES = { long: [4, 3.5], across: [4, 2], up: [2, 3.5] },
  /* the view holds all three images, so the picture keeps its size */
  COMPOSE_VIEW = viewFor({
    shapes: [
      { pts: LEGS_TRI },
      ...Object.values(MIDDLES).map((center) => ({ pts: movePts(LEGS_TRI, { kind: "rotate", center, turn: 180 }) })),
    ],
  });
/* Pick the side to turn around: the triangle and its half-turned copy make a rectangle or a parallelogram, twice its area. */
function wCompose(el) {
  const q = Q(el);
  el.innerHTML =
    seg("Turn 180° around the middle of", [
      ["long", "The long side"],
      ["across", "The side of 4"],
      ["up", "The side of 3"],
    ]) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (id) => {
    const center = MIDDLES[id],
      image = movePts(LEGS_TRI, { kind: "rotate", center, turn: 180 });
    press(el, id);
    q("f").innerHTML = planeFig({
      view: COMPOSE_VIEW,
      cell: 26,
      shapes: [
        { pts: LEGS_TRI, cls: "a", sides: ["4", null, "3"] },
        { pts: image, cls: "b" },
      ],
      points: [{ at: center, text: "M", dir: { long: 45, across: 270, up: 180 }[id] }],
      label: "A right triangle and its copy turned 180° around the middle of a side",
    });
    q("r").innerHTML =
      (id === "long"
        ? "The two right angles end up in opposite corners, and the turned copy fills out <b>a rectangle</b>, 4 by 3."
        : `The copy shares the side of ${id === "across" ? 4 : 3} and the slanted sides end up parallel: <b>a parallelogram</b> that isn’t a rectangle.`) +
      " Either way it’s two copies of the triangle: 2 × (½ × 4 × 3) = <b>12 square units</b>.";
  };
  onPick(el, draw);
  draw("long");
}

const STEPS = [
  {
    title: "No bending or stretching",
    widget: wKeep,
    body: "<p>Translations, rotations, and reflections are <b>rigid</b>: they move a shape without bending or stretching it. Every side of the image is as long as the side it came from, and every angle is the same size. So the area and the perimeter stay the same too.</p><p>Try each move.</p>",
    check: {
      kind: "num",
      q: "Quadrilateral ABCD is reflected to A′B′C′D′. Side CD is 7 cm and angle D is 110°. What is angle D′?",
      answer: 110,
      unit: "°",
      misc: [
        [70, "A reflection doesn’t change angles into their supplements: D′ is the same size as D."],
        [7, "That’s the length of CD. The question asks for angle D′."],
      ],
      explain: "Rigid moves keep angles: angle D′ = angle D = 110°.",
    },
  },
  {
    title: "Lines go to lines",
    widget: wLines,
    body: "<p>A rigid move takes a line to a line: move two of its points and draw the line through their images. A half turn around a point on the line puts the line back on itself. A half turn around a point off it, or any translation, makes a <b>parallel</b> line.</p><p>Try each move.</p>",
    check: {
      kind: "mc",
      q: "A segment is rotated 180° around a point that isn’t on its line. What is its image?",
      choices: [
        { id: "b", label: "The same segment, right on top of it" },
        { id: "a", label: "A segment parallel to it, the same length" },
        { id: "c", label: "A segment at a right angle to it" },
        { id: "d", label: "A segment parallel to it, but longer" },
      ],
      answer: "a",
      why: {
        b: "That happens when the center is on the segment’s line. Here it’s off the line, so the image moves across.",
        c: "That’s what a quarter turn (90°) does. A half turn makes it face the opposite way: parallel.",
        d: "Rigid moves don’t stretch: the image is just as long.",
      },
      explain: "A half turn around a point off the line makes a parallel line, and rigid moves keep lengths.",
      stack: true,
    },
  },
  {
    title: "Building with copies",
    widget: wCompose,
    body: "<p>Copies of a shape made by rigid moves fit together into new shapes. A triangle turned 180° around the middle of one of its sides fits against that side: together they make a parallelogram (a rectangle, when the side is across from a right angle). Its area is twice the triangle’s.</p><p>Pick a side to turn around.</p>",
    check: {
      kind: "num",
      q: "A right triangle with legs 5 and 6 is rotated 180° around the middle of its longest side. What is the area of the shape the triangle and its image make together?",
      answer: 30,
      unit: "square units",
      misc: [
        [15, "That’s one triangle. Its image is a second one, just as big."],
        [11, "Area multiplies: the shape is a 5 by 6 rectangle."],
        [60, "Each triangle is half of 5 × 6, so the two together make 5 × 6."],
      ],
      explain: "The two triangles make a 5 by 6 rectangle: 5 × 6 = 30 square units.",
    },
  },
];
