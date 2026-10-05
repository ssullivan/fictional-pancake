/* Learn Area and Multiplication (Grade 3 Unit 2), chapter 6: Area problems. Its widgets and steps; loaded by area-problems.html. */
/* area stories: the button, the story, the question, and the rectangle's length, width, and units (one and many) */
const STORIES = [
  {
    t: "Rug",
    s: "Elena’s rug is 8 feet long and 5 feet wide.",
    q: "How much floor does it cover?",
    l: 8,
    w: 5,
    u: ["ft", "feet"],
  },
  {
    t: "Garden",
    s: "Han’s garden bed is 6 meters long and 3 meters wide.",
    q: "What is its area?",
    l: 6,
    w: 3,
    u: ["m", "meters"],
  },
  {
    t: "Board",
    s: "The bulletin board is 6 feet long and 4 feet wide.",
    q: "How much paper covers it?",
    l: 6,
    w: 4,
    u: ["ft", "feet"],
  },
  {
    t: "Patio",
    s: "The patio is 7 meters long and 6 meters wide.",
    q: "What is its area?",
    l: 7,
    w: 6,
    u: ["m", "meters"],
  },
];
/* Pick an area story and solve it, with the squares to show. */
function wStory(el) {
  /* squares: the unit squares are showing */
  const q = Q(el);
  let storyIndex = 0,
    squares = false;
  el.innerHTML =
    seg(
      "Story",
      STORIES.map((story, i) => [i, story.t]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-sq></button></div><p class="readout" data-o></p>`;
  const draw = () => {
    const {
      s: story,
      q: question,
      l: length,
      w: width,
      u: [unit, many],
    } = STORIES[storyIndex];
    press(el, storyIndex);
    q("sq").textContent = toggleLabel(squares, "squares");
    q("f").innerHTML = rectFig(length, width, { unit, grid: squares });
    q("o").innerHTML =
      `${story} ${question}<br>Picture ${width} rows of ${length} square ${many}.` +
      `<br><span class="ok">${width} × ${length} = ${length * width} square ${many}.</span>`;
  };
  onPick(el, (id) => {
    storyIndex = +id;
    squares = false;
    draw();
  });
  q("sq").onclick = () => {
    squares = !squares;
    draw();
  };
  draw();
}
/* Pick an area, then try lengths for one side: the ones that make full rows give the other side. */
function wMissing(el) {
  /* the stepper's value: s, the side tried (in feet) */
  const q = Q(el),
    values = { s: 4 };
  let area = 24;
  el.innerHTML =
    seg(
      "Area",
      [12, 18, 24].map((a) => [a, `${a} square feet`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow">${stepper("s", "One side (feet)")}</div><p class="readout" data-o></p>`;
  const draw = () => {
    const side = values.s,
      fullRows = area % side === 0,
      other = Math.floor(area / side);
    press(el, area);
    q("s").textContent = side;
    /* full rows: the rectangle with its sides; otherwise the squares in rows of `side`, the leftovers in red */
    q("f").innerHTML = fullRows ? rectFig(other, side, { unit: "ft" }) : tiles(side, area);
    q("o").innerHTML =
      `A garden bed has an area of ${area} square feet. One side is ${side} feet.<br>` +
      (fullRows
        ? `<span class="ok">${side} × ${other} = ${area}, so the other side is ${other} feet.</span>`
        : `<span class="no">${area} squares don’t make ${side} full rows:</span> ${side} × ${other} = ${side * other}, with ${area - side * other} left over.`);
  };
  steppers(el, values, { s: [1, 8] }, draw);
  onPick(el, (id) => {
    area = +id;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Area stories",
    widget: wStory,
    body: "<p>Rugs, gardens, and floors are rectangles. To find how much space one covers, multiply its length by its width. The answer is in square units: square feet or square meters.</p><p>Pick a story and solve it.</p>",
    check: {
      kind: "num",
      q: "A patio is 6 meters long and 8 meters wide. What is its area?",
      answer: 48,
      unit: "square meters",
      misc: [
        [14, "You added 6 + 8. Multiply the length by the width."],
        [28, "That’s the distance around the patio. Area is the space inside."],
      ],
      explain: "8 rows of 6 square meters: 8 × 6 = 48 square meters.",
    },
  },
  {
    title: "Find a missing side",
    widget: wMissing,
    body: "<p>If you know the area and one side, find the other side: think of a multiplication with a missing factor. An area of 24 with a side of 4 is <b>4 × ? = 24</b>.</p><p>Pick an area, then try different sides.</p>",
    check: {
      kind: "num",
      q: "A rug has an area of 32 square feet. It is 4 feet wide. How long is it?",
      answer: 8,
      unit: "feet",
      misc: [
        [28, "You subtracted. Think: 4 × ? = 32."],
        [4, "That’s the side you know. How long is the other side?"],
        [36, "You added. Think: 4 × ? = 32."],
      ],
      explain: "4 × 8 = 32, so the rug is 8 feet long.",
    },
  },
];
