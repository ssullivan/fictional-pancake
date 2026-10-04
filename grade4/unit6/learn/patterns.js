/* Learn Multiplying and Dividing Multi-digit Numbers (Grade 4 Unit 6), chapter 1: Patterns. Its widgets and steps; loaded by patterns.html. */
/* "odd" or "even" */
const parity = (n) => (n % 2 ? "odd" : "even");
/* Pick a start and a number to add (steppers): the pattern's first 8 numbers, and what's true of all of them. */
function wGrow(el) {
  /* the steppers' values: start, the first number, and add, what each step adds */
  const q = Q(el),
    values = { start: 3, add: 4 },
    limits = { start: [1, 9], add: [2, 9] };
  el.innerHTML =
    `<div class="wrow">${stepper("start", "Start at")}${stepper("add", "Add")}</div>` +
    `<p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { start, add } = values,
      terms = range(8).map((k) => start + k * add);
    q("start").textContent = start;
    q("add").textContent = add;
    q("e").innerHTML = terms.join(", ") + ", …";
    /* adding an even number keeps the parity; adding an odd one switches it every step */
    const sameParity = add % 2 === 0;
    q("r").innerHTML =
      (sameParity
        ? `Adding ${add}, an even number, never changes odd or even, so <b>every number is ${parity(start)}</b>.`
        : `Adding ${add}, an odd number, switches between odd and even, so <b>the numbers go ${parity(start)}, ${parity(start + add)}, ${parity(start)}, ${parity(start + add)}, …</b>`) +
      `<br><span class="dimline">The 10th number is ${start} + 9 × ${add} = ${start + 9 * add}: the start, then 9 more steps.</span>`;
  };
  steppers(el, values, limits, draw);
  draw();
}
/* repeating patterns: [button, the shapes that repeat ({kind, cls})] */
const REPEATS = [
  ["Circle, square", ["circle", "square"]],
  ["Circle, square, triangle", ["circle", "square", "triangle"]],
  ["Circle, square, square, triangle", ["circle", "square", "square", "triangle"]],
];
/* the name of each shape for the readout */
const SHAPE_WORD = { circle: "circle", square: "square", triangle: "triangle" };
/* one shape in a 30 × 30 box from x, y (marked: outlined in white) */
const patternShape = (kind, x, y, marked) => {
  const cls = `ps ${kind}${marked ? " mk" : ""}`;
  if (kind === "circle") return `<circle class="${cls}" cx="${x + 15}" cy="${y + 15}" r="12"/>`;
  if (kind === "square") return `<rect class="${cls}" x="${x + 3}" y="${y + 3}" width="24" height="24"/>`;
  return `<polygon class="${cls}" points="${x + 15},${y + 2} ${x + 28},${y + 27} ${x + 2},${y + 27}"/>`;
};
/* Pick a repeating pattern and a position (a stepper): which shape is there, found by dividing by the pattern's length. */
function wRepeat(el) {
  /* the stepper's value: at, the position to find */
  const q = Q(el),
    values = { at: 14 },
    limits = { at: [1, 40] };
  let patternIndex = 1;
  el.innerHTML =
    seg(
      "Pattern",
      REPEATS.map(([name], i) => [i, name]),
    ) +
    `<div class="wrow">${stepper("at", "Position")}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const unit = REPEATS[patternIndex][1],
      size = unit.length,
      at = values.at,
      /* the shape at a position is the one at its place in the repeating unit: what's left after whole repeats */
      repeats = Math.floor((at - 1) / size),
      place = ((at - 1) % size) + 1,
      shown = 12,
      cellW = 32;
    press(el, patternIndex);
    q("at").textContent = at;
    q("f").innerHTML = svgWrap(
      shown * cellW + 40,
      48,
      range(shown)
        .map((i) => patternShape(unit[i % size], 4 + i * cellW, 4, i + 1 === at))
        .join("") + `<text class="lbl" x="${4 + shown * cellW + 16}" y="20">…</text>`,
      `The first ${shown} shapes of a pattern that repeats every ${size}`,
    );
    q("e").innerHTML = `${at} = ${repeats} × ${size} + ${place}`;
    q("r").innerHTML =
      `The pattern repeats every ${size} shapes. ${repeats ? `${repeats} whole repeat${repeats > 1 ? "s" : ""} use${repeats > 1 ? "" : "s"} ${repeats * size} shapes, then` : "Then"} position ${at} is shape ${place} of the repeat: <b>a ${SHAPE_WORD[unit[place - 1]]}</b>.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    patternIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Patterns that grow",
    widget: wGrow,
    body: "<p>A rule like “start at 3 and add 4” makes a pattern: 3, 7, 11, 15, … Look for what’s true of every number, like whether they’re all odd, and explain why the rule makes it so.</p><p>Change the start and the number to add.</p>",
    check: {
      kind: "mc",
      q: "The rule is “start at 3 and add 4.” Which number is in the pattern?",
      choices: [
        { id: "a", label: "27" },
        { id: "b", label: "25" },
        { id: "c", label: "30" },
      ],
      answer: "a",
      why: {
        b: "The pattern goes 3, 7, 11, 15, 19, 23, 27. It skips 25.",
        c: "Every number in the pattern is odd: 3 is odd, and adding 4 keeps it odd. 30 is even.",
      },
      explain: "3, 7, 11, 15, 19, 23, 27: 27 is 3 + 6 × 4.",
    },
  },
  {
    title: "Patterns that repeat",
    widget: wRepeat,
    body: "<p>A pattern that repeats has a part that comes again and again. To find the shape at any position, divide by the length of that part. What’s left over tells you which shape it is.</p><p>Pick a pattern, then change the position.</p>",
    check: {
      kind: "mc",
      q: "A string of beads goes red, blue, yellow, red, blue, yellow, … What color is the 14th bead?",
      choices: [
        { id: "a", label: "Red" },
        { id: "b", label: "Blue" },
        { id: "c", label: "Yellow" },
      ],
      answer: "b",
      why: {
        a: "The 13th bead is red: 4 repeats of 3 is 12, and the 13th starts a new repeat. The 14th is next.",
        c: "Yellow ends each repeat, at 3, 6, 9, 12, and 15. The 14th comes before that.",
      },
      explain: "14 = 4 × 3 + 2. After 4 repeats, the 14th bead is the 2nd of the repeat: blue.",
    },
  },
];
