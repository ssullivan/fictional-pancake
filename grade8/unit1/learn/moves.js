/* Learn Rigid Transformations and Congruence (Grade 8 Unit 1), chapter 1: Slides, turns, and flips. Its widgets and steps;
   loaded by moves.html. */
/* the flag from the game's shapes, with corner A at (1, 1) on a grid 12 squares across and 7 up */
const FLAG = movePts(SPRITES.find((s) => s.name === "flag").pts, { kind: "translate", dx: 1, dy: 1 }),
  FLAG_VIEW = [0, 12, 0, 7];
/* one of each move, each keeping the flag on the grid: a slide, a quarter turn clockwise around P, and a flip over ℓ */
const SHOWN = {
  translate: { kind: "translate", dx: 6, dy: 1 },
  rotate: { kind: "rotate", center: [6, 1], turn: -90 },
  reflect: { kind: "reflect", line: { x: 6 } },
};
/* the choice buttons for the three moves */
const MOVE_BUTTONS = [
  ["translate", "Translate (slide)"],
  ["rotate", "Rotate (turn)"],
  ["reflect", "Reflect (flip)"],
];
/* The flag and its image after a move, with what shows the move: a translation's arrow, a rotation's center and curved
   arrow, or a reflection's line. corner: the corner to follow (its arrow, its segments to the center, or its segment across
   the line); the whole move's marks otherwise. */
function flagFig(kind, corner = null) {
  const move = SHOWN[kind],
    image = movePts(FLAG, move),
    from = FLAG[corner ?? 0],
    to = image[corner ?? 0],
    marks =
      kind === "translate"
        ? { arrows: [{ from, to }] }
        : kind === "rotate"
          ? {
              points: [{ at: move.center, text: "P" }],
              turns: [{ center: move.center, from, turn: move.turn }],
              segs:
                corner === null
                  ? []
                  : [
                      { from: move.center, to: from },
                      { from: move.center, to, cls: "b" },
                    ],
            }
          : { lines: [{ line: move.line, text: "ℓ" }], segs: corner === null ? [] : [{ from, to, cls: "b" }] };
  return planeFig({
    view: FLAG_VIEW,
    cell: 30,
    shapes: [
      { pts: FLAG, cls: "a", verts: LETTERS.slice(0, 5) },
      { pts: image, cls: "b", verts: LETTERS.slice(0, 5).map((letter) => prime(letter)) },
    ],
    ...marks,
    label: `A flag and its image after a ${KIND_NAME[kind]}`,
  });
}
/* what each kind of move is called */
const KIND_NAME = { translate: "translation", rotate: "rotation", reflect: "reflection" };

/* Pick a move: the flag slides, turns around P, or flips over ℓ, and its image is drawn beside it. */
function wThree(el) {
  const q = Q(el);
  el.innerHTML = seg("Move", MOVE_BUTTONS) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (kind) => {
    press(el, kind);
    q("f").innerHTML = flagFig(kind);
    q("r").innerHTML = {
      translate:
        "A <b>translation</b> slides the flag: every point moves 6 units right and 1 unit up, the same distance in the same direction. It doesn’t turn or flip.",
      rotate:
        "A <b>rotation</b> turns the flag around the point P, here a quarter turn (90°) clockwise. Every point stays the same distance from P.",
      reflect:
        "A <b>reflection</b> flips the flag over the line ℓ. Every point lands just as far from ℓ on the other side, so the image is a mirror image.",
    }[kind];
  };
  onPick(el, draw);
  draw("translate");
}

/* Pick a move and a corner to follow: the corner's arrow, its segments to the center, or its segment across the line, and
   what a description of the move has to say. */
function wFollow(el) {
  const q = Q(el);
  let kind = "translate",
    corner = 0;
  el.innerHTML =
    `<div data-top>${seg("Move", MOVE_BUTTONS)}</div>` +
    `<div data-bot>${seg(
      "Corner to follow",
      LETTERS.slice(0, 5).map((letter, i) => [i, `Follow ${letter}`]),
    )}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const move = SHOWN[kind],
      letter = LETTERS[corner],
      [x] = FLAG[corner],
      [u] = movePt(FLAG[corner], move);
    press(q("top"), kind);
    press(q("bot"), corner);
    q("f").innerHTML = flagFig(kind, corner);
    q("r").innerHTML = {
      translate: `${letter} slides to ${prime(letter)}: 6 units right and 1 unit up, like every other corner. To describe a translation, give <b>a distance and a direction</b>.`,
      rotate: `${letter} turns 90° clockwise around P to ${prime(letter)}. P to ${letter} and P to ${prime(letter)} are the same length and make a right angle. To describe a rotation, give <b>a center, an angle, and a direction</b> (clockwise or counterclockwise).`,
      reflect: `${letter} is ${6 - x} ${6 - x === 1 ? "unit" : "units"} left of ℓ, and ${prime(letter)} is ${u - 6} right of it. The segment from ${letter} to ${prime(letter)} crosses ℓ at a right angle. To describe a reflection, give <b>the line</b>.`,
    }[kind];
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (row === "top") kind = id;
    if (row === "bot") corner = +id;
    if (row) draw();
  });
  draw();
}

const STEPS = [
  {
    title: "Three ways to move",
    widget: wThree,
    body: "<p>A move that slides, turns, or flips a shape without stretching it is a <b>rigid transformation</b>. There are three kinds: a <b>translation</b> slides, a <b>rotation</b> turns around a point, and a <b>reflection</b> flips over a line. The shape after the move is its <b>image</b>.</p><p>Try each move.</p>",
    check: {
      kind: "mc",
      q: "A sprite’s image is its mirror image across a line. Which move made it?",
      choices: [
        { id: "b", label: "A rotation" },
        { id: "a", label: "A reflection" },
        { id: "c", label: "A translation" },
      ],
      answer: "a",
      why: {
        b: "A rotation turns a shape, but the image still goes around the same way. A mirror image comes from a flip.",
        c: "A translation slides a shape without turning or flipping it. A mirror image comes from a flip.",
      },
      explain: "A mirror image across a line is a flip over that line: a reflection.",
    },
  },
  {
    title: "Naming the moves",
    widget: wFollow,
    body: "<p>The image of corner A is named A′ (say “A prime”). Following one corner shows the whole move, since every point moves the same way: a translation slides it a distance in a direction, a rotation turns it around a center, and a reflection takes it straight across a line.</p><p>Pick a move and a corner to follow.</p>",
    check: {
      kind: "mc",
      q: "To describe a rotation, what do you need to give?",
      choices: [
        { id: "b", label: "A distance and a direction" },
        { id: "a", label: "A center, an angle, and a direction" },
        { id: "c", label: "A line" },
      ],
      answer: "a",
      why: {
        b: "That describes a translation, a slide. A rotation turns around a point.",
        c: "That describes a reflection, a flip. A rotation turns around a point.",
      },
      explain: "A rotation turns around a center point, by an angle, clockwise or counterclockwise.",
      stack: true,
    },
  },
];
