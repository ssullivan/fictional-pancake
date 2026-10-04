/* Learn Angles and Angle Measurement (Grade 4 Unit 7), chapter 2: Parallel and perpendicular. Its widgets and steps; loaded by parallel.html. */
/* Turn the blue line (a slider): at 0° the lines are parallel, at 90° perpendicular, and otherwise they just cross. */
function wCross(el) {
  const q = Q(el);
  let cross = 30;
  el.innerHTML =
    degSlider("Turn the blue line", 0, 90, cross) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    q("f").innerHTML = cross === 0 ? linesFig(0) : linesFig(cross);
    q("r").innerHTML =
      cross === 0
        ? "<b>Parallel</b>: the lines go the same way and never meet, however far they go."
        : cross === 90
          ? "<b>Perpendicular</b>: the lines cross at a right angle, 90°. The square mark shows it."
          : `The lines cross at ${cross}°. They <b>intersect</b>, but they aren’t perpendicular: that takes exactly 90°.`;
  };
  onSlide(el, (value) => {
    cross = value;
    draw();
  });
  draw();
}
/* capital letters drawn with segments, in a 100 × 120 box: [segments as [x1, y1, x2, y2], parallel pairs, perpendicular pairs] */
const LETTERS = {
  L: [
    [
      [20, 10, 20, 110],
      [20, 110, 80, 110],
    ],
    "none",
    "the two segments meet at a right angle",
  ],
  T: [
    [
      [10, 10, 90, 10],
      [50, 10, 50, 110],
    ],
    "none",
    "the top and the stem",
  ],
  H: [
    [
      [20, 10, 20, 110],
      [80, 10, 80, 110],
      [20, 60, 80, 60],
    ],
    "the two up-and-down segments",
    "the middle segment with each up-and-down one",
  ],
  Z: [
    [
      [15, 10, 85, 10],
      [85, 10, 15, 110],
      [15, 110, 85, 110],
    ],
    "the top and the bottom",
    "none: the slanted segment doesn’t meet them at a right angle",
  ],
  N: [
    [
      [20, 110, 20, 10],
      [20, 10, 80, 110],
      [80, 110, 80, 10],
    ],
    "the two up-and-down segments",
    "none: the slanted segment doesn’t meet them at a right angle",
  ],
  E: [
    [
      [20, 10, 20, 110],
      [20, 10, 80, 10],
      [20, 60, 70, 60],
      [20, 110, 80, 110],
    ],
    "the three across segments",
    "each across segment with the up-and-down one",
  ],
};
/* Pick a letter: which of its segments are parallel, and which are perpendicular. */
function wLetters(el) {
  const q = Q(el);
  let letter = "H";
  el.innerHTML =
    seg(
      "Letter",
      Object.keys(LETTERS).map((name) => [name, name]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [segments, parallel, perpendicular] = LETTERS[letter];
    press(el, letter);
    q("f").innerHTML = svgWrap(
      120,
      130,
      `<g transform="translate(10,5)">${segments.map(([x1, y1, x2, y2]) => `<line class="gline" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`).join("")}</g>`,
      `The letter ${letter} drawn with ${segments.length} segments`,
    );
    q("r").innerHTML = `<b>Parallel:</b> ${parallel}.<br><b>Perpendicular:</b> ${perpendicular}.`;
  };
  onPick(el, (m) => {
    letter = m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Parallel, perpendicular, or crossing",
    widget: wCross,
    body: "<p>Two lines that never meet are <b>parallel</b>. Two lines that meet at a right angle are <b>perpendicular</b>. Lines that meet at any other angle just intersect.</p><p>Turn the blue line.</p>",
    check: {
      kind: "mc",
      q: "Which pair of lines is perpendicular?",
      choices: [
        { id: "a", label: linesFig(60) },
        { id: "b", label: linesFig(0) },
        { id: "c", label: linesFig(90) },
      ],
      answer: "c",
      why: {
        a: "These lines cross, but not at a right angle.",
        b: "These lines never meet: they’re parallel.",
      },
      explain: "Perpendicular lines cross at a right angle, 90°, like the corner of a page.",
    },
  },
  {
    title: "Parallel and perpendicular all around",
    widget: wLetters,
    body: "<p>Look for parallel and perpendicular segments in letters, windows, and roads. A square corner means perpendicular. Two segments that go the same way, like train tracks, are parallel.</p><p>Pick a letter.</p>",
    check: {
      kind: "mc",
      q: "Which letter has parallel segments but no perpendicular segments?",
      choices: [
        { id: "a", label: "N" },
        { id: "b", label: "L" },
        { id: "c", label: "T" },
      ],
      answer: "a",
      why: {
        b: "L’s two segments are perpendicular, and it has no parallel ones.",
        c: "T’s segments are perpendicular, and it has no parallel ones.",
      },
      explain: "N’s two up-and-down segments are parallel, and the slanted one doesn’t meet them at a right angle.",
    },
  },
];
