/* Learn Angles and Angle Measurement (Grade 4 Unit 7), chapter 6: Find unknown angles. Its widgets and steps; loaded by unknown.html. */
/* the wholes to split: [degrees, name] */
const WHOLES = [
  [90, "Right angle"],
  [180, "Straight angle"],
  [360, "Full turn"],
];
/* Pick a whole and turn the middle ray (a slider): the two parts always add up to the whole. */
function wSplit(el) {
  const q = Q(el);
  let total = 180,
    part = 50;
  el.innerHTML =
    seg(
      "Whole",
      WHOLES.map(([deg, name]) => [deg, name]),
    ) +
    degSlider("Turn the middle ray", 5, 175, part) +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const input = el.querySelector("[data-s]");
  const draw = () => {
    const rest = total - part;
    press(el, total);
    q("f").innerHTML = splitFig([part, rest], [`${part}°`, `${rest}°`]);
    q("e").innerHTML = `${part}° + ${rest}° = ${total}°`;
    q("r").innerHTML =
      `The two angles make a ${WHOLES.find(([deg]) => deg === total)[1].toLowerCase()}, so together they’re ${total}°. To find one, subtract the other from ${total}: ${total} − ${part} = <b>${rest}°</b>.`;
  };
  onSlide(el, (value) => {
    part = value;
    draw();
  });
  /* a new whole: the slider goes up to 5° short of it */
  onPick(el, (m) => {
    total = +m;
    input.max = total - 5;
    part = Math.min(part, total - 5);
    input.value = part;
    el.querySelector("[data-sv]").textContent = `${part}°`;
    draw();
  });
  draw();
}
/* puzzles: a whole split into three angles, two of them known */
const PUZZLES = [
  { total: 180, known: [40, 65] },
  { total: 360, known: [90, 150] },
  { total: 90, known: [25, 30] },
];
/* Pick a puzzle and guess the missing angle (a stepper, 5° at a time). */
function wGuess(el) {
  /* the stepper's value: fives, the guess in 5s of degrees, up to 180° (every puzzle's missing angle is less) */
  const q = Q(el),
    values = { fives: 10 },
    limits = { fives: [0, 36] };
  let puzzleIndex = 0;
  el.innerHTML =
    seg(
      "Puzzle",
      PUZZLES.map((p, i) => [i, `Puzzle ${i + 1}`]),
    ) +
    `<div class="wrow">${stepper("fives", "Your guess")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { total, known } = PUZZLES[puzzleIndex],
      missing = total - known[0] - known[1],
      guess = 5 * values.fives;
    press(el, puzzleIndex);
    q("fives").textContent = `${guess}°`;
    q("f").innerHTML = splitFig([...known, missing], [...known.map((k) => `${k}°`), "?"]);
    q("r").innerHTML =
      guess === missing
        ? `<span class="ok">Yes!</span> ${known[0]}° + ${known[1]}° + ${missing}° = ${total}°.`
        : `The three angles make ${total}°. Your guess makes ${known[0] + known[1] + guess}°: ${guess < missing ? "too small" : "too big"}.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    puzzleIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Angles that add up",
    widget: wSplit,
    body: "<p>When angles sit side by side, their measures add. Two angles that make a right angle add up to 90°, a straight angle 180°, and a full turn 360°. So if you know one, subtract to find the other.</p><p>Pick a whole, then turn the middle ray.</p>",
    check: {
      kind: "num",
      q: "Two angles make a straight angle. One is 125°. How big is the other?",
      answer: 55,
      unit: "degrees",
      misc: [
        [235, "That subtracts from 360. A straight angle is 180°."],
        [305, "That adds. Together they make 180°: subtract 180 − 125."],
      ],
      explain: "A straight angle is 180°. 180 − 125 = 55°.",
    },
  },
  {
    title: "More than two angles",
    widget: wGuess,
    body: "<p>With more than two angles, add the ones you know, then subtract from the whole: a right angle (90°), a straight angle (180°), or a full turn (360°).</p><p>Pick a puzzle and find the missing angle.</p>",
    check: {
      kind: "num",
      q: "Three angles make a full turn. Two of them are 90° and 150°. How big is the third?",
      answer: 120,
      unit: "degrees",
      misc: [
        [240, "That adds 90 + 150. Subtract that from 360."],
        [60, "That subtracts 90 + 150 from 300. A full turn is 360°."],
      ],
      explain: "90 + 150 = 240, and a full turn is 360°. 360 − 240 = 120°.",
    },
  },
];
