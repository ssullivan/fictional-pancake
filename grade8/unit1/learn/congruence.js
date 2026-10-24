/* Learn Rigid Transformations and Congruence (Grade 8 Unit 1), chapter 6: Congruence. Its widgets and steps; loaded by
   congruence.html. */
/* the L-shape from the game's shapes, with its corner at (1, 1), and the grid it sits on with a candidate beside it */
const L_SHAPE = movePts(SPRITES.find((s) => s.name === "L-shape").pts, { kind: "translate", dx: 1, dy: 1 }),
  CANDIDATE_VIEW = [0, 12, 0, 8];
/* candidates to compare with the L-shape: [id, button, its corners, congruent?, why] */
const CANDIDATES = [
  [
    "turned",
    "Turned",
    movePts(L_SHAPE, { kind: "rotate", center: [5, 1], turn: -90 }),
    true,
    "A quarter turn clockwise around a point (and nothing else) fits the L-shape exactly onto it.",
  ],
  [
    "flipped",
    "Flipped",
    movePts(L_SHAPE, { kind: "reflect", line: { x: 5 } }),
    true,
    "A reflection fits the L-shape exactly onto it. A mirror image is still congruent.",
  ],
  [
    "bigger",
    "Bigger",
    L_SHAPE.map(([x, y]) => [2 * x + 4, 2 * y - 1]),
    false,
    "Every side is twice as long. It’s a scaled copy, but rigid moves can’t stretch, so it isn’t congruent.",
  ],
  [
    "stretched",
    "Stretched",
    L_SHAPE.map(([x, y]) => [2 * x + 5, y]),
    false,
    "It’s twice as wide but just as tall: the across sides grew and the others didn’t. No rigid move does that.",
  ],
];
/* Pick a candidate: is it congruent to the gold L-shape? */
function wCongruent(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Blue shape",
      CANDIDATES.map(([id, button]) => [id, button]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (id) => {
    const [, button, pts, congruent, why] = CANDIDATES.find((c) => c[0] === id);
    press(el, id);
    q("f").innerHTML = planeFig({
      view: CANDIDATE_VIEW,
      shapes: [
        { pts: L_SHAPE, cls: "a" },
        { pts, cls: "b" },
      ],
      label: `The L-shape and a ${button.toLowerCase()} blue shape`,
    });
    q("r").innerHTML = `${congruent ? "<b>Congruent.</b>" : "<b>Not congruent.</b>"} ${why}`;
  };
  onPick(el, draw);
  draw("turned");
}

/* trapezoid ABCD with A at (1, 1), and the congruent PQRS: ABCD turned a quarter turn clockwise, off to the right */
const TRAP = movePts(SPRITES.find((s) => s.name === "trapezoid").pts, { kind: "translate", dx: 1, dy: 1 }),
  TRAP_COPY = movePts(TRAP, { kind: "rotate", center: [6, 3], turn: -90 });
/* Pick a side of ABCD: the side of PQRS it matches lights up, and they're the same length. */
function wMatch(el) {
  const q = Q(el),
    first = "ABCD",
    second = "PQRS";
  el.innerHTML =
    seg(
      "Side of ABCD",
      range(4).map((i) => [i, `Side ${first[i]}${first[(i + 1) % 4]}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (side) => {
    const next = (side + 1) % 4,
      [[x1, y1], [x2, y2]] = [TRAP[side], TRAP[next]],
      length = Math.hypot(x2 - x1, y2 - y1),
      lengthText = Number.isInteger(length) ? `${length} units` : "the same slanted length";
    press(el, side);
    q("f").innerHTML = planeFig({
      shapes: [
        { pts: TRAP, cls: "a", verts: [...first], hi: [side] },
        { pts: TRAP_COPY, cls: "b", verts: [...second], hi: [side] },
      ],
      label: `Trapezoid ABCD and the congruent PQRS, side ${first[side]}${first[next]} and side ${second[side]}${second[next]} marked`,
    });
    q("r").innerHTML =
      `${first[side]} matches ${second[side]} and ${first[next]} matches ${second[next]}, so side <b>${first[side]}${first[next]}</b> matches side <b>${second[side]}${second[next]}</b>. ` +
      `They’re both ${lengthText}, and angle ${first[side]} is the same size as angle ${second[side]}.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* A slider leans a rhombus with sides 3: at 90° it's the blue square, and at any other angle it isn't congruent to it. */
function wLean(el) {
  const q = Q(el),
    side = 3;
  el.innerHTML =
    `<div class="wrow"><label class="slider">Angle <input type="range" min="6" max="18" value="12" data-s><b data-sv></b></label></div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const angle = 5 * +q("s").value,
      rad = (angle * Math.PI) / 180,
      /* the top side starts above the bottom left corner, pushed over by the lean */
      [leanX, leanY] = [side * Math.cos(rad), side * Math.sin(rad)],
      rhombus = [
        [0, 0],
        [side, 0],
        [side + leanX, leanY],
        [leanX, leanY],
      ],
      square = [
        [8, 0],
        [8 + side, 0],
        [8 + side, side],
        [8, side],
      ];
    q("sv").textContent = `${angle}°`;
    q("f").innerHTML = planeFig({
      view: [-1, 12, -1, 4],
      grid: false,
      cell: 26,
      shapes: [
        { pts: rhombus, cls: "a", sides: ["3", "3", "3", "3"], angles: { 0: `${angle}°` } },
        { pts: square, cls: "b", sides: ["3", "3", "3", "3"], angles: { 0: "90°" } },
      ],
      label: `A rhombus with sides 3 and a ${angle}° angle, beside a square with sides 3`,
    });
    q("r").innerHTML =
      angle === 90
        ? "At 90°, the gold shape is a square: it’s <b>congruent</b> to the blue one."
        : `All four sides are still 3, but its angles are ${angle}° and ${180 - angle}°, not 90°. Same sides, <b>not congruent</b>: four sides can lean. Three sides can’t, so triangles with the same three sides are congruent.`;
  };
  q("s").addEventListener("input", draw);
  draw();
}

const STEPS = [
  {
    title: "Congruent shapes",
    widget: wCongruent,
    body: "<p>Two shapes are <b>congruent</b> when a sequence of rigid moves (translations, rotations, and reflections) fits one exactly onto the other. Congruent shapes can face different ways, and one can be a mirror image of the other, but they’re the same size and shape. We write \\(ABC \\cong DEF\\).</p><p>Try each blue shape.</p>",
    check: {
      kind: "mc",
      q: "Which rectangle is congruent to a rectangle 2 cm by 5 cm?",
      choices: [
        { id: "b", label: "4 cm by 10 cm" },
        { id: "c", label: "3 cm by 4 cm" },
        { id: "a", label: "5 cm by 2 cm" },
        { id: "d", label: "1 cm by 10 cm" },
      ],
      answer: "a",
      why: {
        b: "That’s a scaled copy, twice as big. Congruent shapes are the same size.",
        c: "Its perimeter is the same, 14 cm, but its sides aren’t. A rigid move can’t change side lengths.",
        d: "Its area is the same, 10 square cm, but its sides aren’t. A rigid move can’t change side lengths.",
      },
      explain: "A quarter turn takes a 2 by 5 rectangle to a 5 by 2 one: they’re congruent.",
    },
  },
  {
    title: "Matching parts",
    widget: wMatch,
    body: "<p>When we write \\(ABCD \\cong PQRS\\), the corners match in order: A with P, B with Q, and so on. Matching sides are the same length and matching angles are the same size, since rigid moves keep both.</p><p>Pick a side of ABCD.</p>",
    check: {
      kind: "num",
      q: "Triangle ABC is congruent to triangle DEF, with the corners in that order. AB is 4 cm, BC is 6 cm, and CA is 7 cm. How long is EF?",
      answer: 6,
      unit: "cm",
      misc: [
        [4, "That’s DE, which matches AB. EF matches BC: E with B and F with C."],
        [7, "That’s FD, which matches CA. EF matches BC: E with B and F with C."],
      ],
      explain: "E matches B and F matches C, so EF matches BC: 6 cm.",
    },
  },
  {
    title: "Same sides aren’t always enough",
    widget: wLean,
    body: "<p>Shapes with different side lengths can’t be congruent. But the same side lengths don’t always make shapes congruent: a four-sided shape can lean, changing its angles. Check the angles too, or find the rigid moves that fit one onto the other.</p><p>Lean the gold shape.</p>",
    check: {
      kind: "mc",
      q: "Two quadrilaterals each have four sides 4 cm long. Must they be congruent?",
      choices: [
        { id: "b", label: "Yes, always" },
        { id: "a", label: "Not necessarily: their angles can be different" },
        { id: "c", label: "No, never" },
      ],
      answer: "a",
      why: {
        b: "A square and a leaning rhombus both have four 4 cm sides, but they don’t fit onto each other.",
        c: "Two squares with 4 cm sides are congruent. It depends on the angles.",
      },
      explain: "A square and a leaning rhombus both have four 4 cm sides, but they aren’t congruent. Two squares are.",
      stack: true,
    },
  },
];
