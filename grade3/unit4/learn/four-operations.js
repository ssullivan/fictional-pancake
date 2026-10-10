/* Learn Relating Multiplication to Division (Grade 3 Unit 4), chapter 9: Solve problems with the four operations. Its widgets
   and steps; loaded by four-operations.html. */
/* two-step stories: the story, its tape diagram's row before and after it's solved, and the two steps as equations */
const TWO_STEP = [
  {
    label: "Cars",
    story:
      "The workshop makes 3 boxes of 12 toy cars. It shares the cars equally among 4 shops. How many cars does each shop get?",
    row: (solved) => ({ label: "boxes", times: 3, each: 12, total: solved ? 36 : "?" }),
    lines: ["3 × 12 = 36 cars in all.", "36 ÷ 4 = 9."],
    answer: "Each shop gets 9 cars.",
  },
  {
    label: "Stickers",
    story: "Mai has 5 sheets of 20 stickers. Mai gives 35 stickers away. How many stickers are left?",
    row: (solved) => ({ label: "sheets", times: 5, each: 20, total: solved ? 100 : "?" }),
    lines: ["5 × 20 = 100 stickers.", "100 − 35 = 65."],
    answer: "Mai has 65 stickers left.",
  },
  {
    label: "Crayons",
    story: "48 crayons are shared equally into 6 boxes. Then 2 boxes are given away. How many crayons are left?",
    row: (solved) => ({ label: "boxes", times: 6, each: solved ? 8 : "?", total: 48 }),
    lines: ["48 ÷ 6 = 8 crayons in each box.", "4 boxes are left: 4 × 8 = 32."],
    answer: "32 crayons are left.",
  },
];
/* Solve a two-step story with a tape diagram, one step at a time. */
const wTwoStep = stepsWidget(
  TWO_STEP.map((story) => ({ ...story, steps: 2 })),
  ({ story, row, lines, answer }, made) => ({
    fig: timesTape([row(made >= 1)]),
    text:
      [story, ...lines.slice(0, made).map((line, i) => `Step ${i + 1}: ${line}`)].join("<br>") +
      (made === 2 ? `<br><span class="ok">${answer}</span>` : ""),
  }),
);
/* stories to match to an equation, with three equations to pick from: [equation, null for the right one or why it's wrong] */
const EQUATIONS = [
  {
    story: "Lin has 6 bags of 8 marbles. Lin gives 10 marbles away. The letter m stands for the marbles Lin has left.",
    choices: [
      ["6 × 8 − 10 = m", null],
      ["6 + 8 − 10 = m", "There are 6 bags of 8: that’s 6 × 8, not 6 + 8."],
      ["6 × 8 + 10 = m", "Lin gives 10 away: subtract them."],
    ],
    solve: "6 × 8 = 48, and 48 − 10 = 38. So m = 38.",
  },
  {
    story:
      "There are 40 toy blocks in 4 equal stacks. Diego adds 3 blocks to one stack. The letter b stands for the blocks in that stack now.",
    choices: [
      ["40 ÷ 4 + 3 = b", null],
      ["40 × 4 + 3 = b", "40 blocks in 4 equal stacks: divide to find one stack."],
      ["40 + 3 = b", "That’s all the blocks. Find one stack first: 40 ÷ 4."],
    ],
    solve: "40 ÷ 4 = 10, and 10 + 3 = 13. So b = 13.",
  },
  {
    story: "A shop has 7 shelves with 5 teddy bears on each. It sells 9 bears. The letter t stands for the bears left.",
    choices: [
      ["7 × 5 − 9 = t", null],
      ["7 × 5 × 9 = t", "The shop sells 9 bears: subtract them."],
      ["7 + 5 − 9 = t", "There are 7 shelves of 5: that’s 7 × 5."],
    ],
    solve: "7 × 5 = 35, and 35 − 9 = 26. So t = 26.",
  },
];
/* Pick the equation that matches a story, with a letter for the unknown; a wrong pick says why. */
function wEquation(el) {
  /* picked: which equation is picked (null until one is) */
  const q = Q(el);
  let storyIndex = 0,
    picked = null;
  el.innerHTML = `<div data-top></div><p data-s></p><div data-bot></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { story, choices, solve } = EQUATIONS[storyIndex];
    q("top").innerHTML = seg(
      "Story",
      EQUATIONS.map((s, i) => [i, `Story ${i + 1}`]),
    );
    q("bot").innerHTML = seg(
      "Equation",
      choices.map(([equation], i) => [i, equation]),
    );
    press(q("top"), storyIndex);
    press(q("bot"), picked);
    q("s").textContent = story;
    q("r").innerHTML =
      picked === null
        ? "Which equation matches the story?"
        : choices[picked][1] === null
          ? `<span class="ok">That’s the one. ${solve}</span>`
          : `<span class="no">${choices[picked][1]}</span>`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") {
      storyIndex = +id;
      picked = null;
    } else picked = +id;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  cars: timesTape([{ label: "boxes", times: 4, each: 15, total: "?" }]),
};
const STEPS = [
  {
    title: "Two steps with × and ÷",
    widget: wTwoStep,
    body: "<p>Some stories take two steps, and a step can multiply or divide. Find all the toys first, then share them, or share them first, then count what’s left. A tape diagram shows which.</p><p>Pick a story and solve it one step at a time.</p>",
    check: {
      kind: "num",
      q: "The workshop makes 4 boxes of 15 toy cars. It shares the cars equally among 3 shops. How many cars does each shop get?",
      fig: F.cars,
      answer: 20,
      unit: "cars",
      misc: [
        [60, "That’s all the cars, 4 × 15. Now share them among the 3 shops."],
        [5, "First find all the cars: 4 × 15."],
      ],
      explain: "4 × 15 = 60 cars. 60 ÷ 3 = 20 cars for each shop.",
    },
  },
  {
    title: "Equations with a letter",
    widget: wEquation,
    body: "<p>An equation can show both steps of a story at once, with a letter for the number you don’t know. For 3 bags of 10 marbles and 4 more, write 3 × 10 + 4 = m. Multiply first, then add: m = 34.</p><p>Pick a story, then the equation that matches it.</p>",
    check: {
      kind: "mc",
      q: "Kiran has 4 packs of 9 markers. Kiran gives 6 markers away. Which equation matches? The letter k stands for the markers Kiran has left.",
      choices: [
        { id: "a", label: "4 × 9 − 6 = k" },
        { id: "b", label: "4 + 9 − 6 = k" },
        { id: "c", label: "4 × 9 + 6 = k" },
      ],
      answer: "a",
      why: {
        b: "There are 4 packs of 9: that’s 4 × 9, not 4 + 9.",
        c: "Kiran gives 6 away: subtract them.",
      },
      explain: "4 × 9 = 36, and 36 − 6 = 30. So k = 30.",
    },
  },
];
