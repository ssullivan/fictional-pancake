/* Learn Wrapping Up Multiplication and Division with Multi-digit Numbers (Grade 5 Unit 4), chapter 6: Put it to work. Its
   widgets and steps; loaded by work.html. */
/* problems with two steps: [button, the story, step 1, step 2, the answer] */
const PROBLEMS = [
  [
    "Milk",
    "A school serves 240 cartons of milk a day. Milk comes in cases of 30. How many cases are needed for 20 days?",
    "All the cartons: 240 × 20 = 4,800.",
    "Cases of 30: 4,800 ÷ 30 = 160.",
    "160 cases",
  ],
  [
    "Trash",
    "Each of 15 homes throws away about 40 pounds of trash a week. How much is that in 3 weeks?",
    "One week: 40 × 15 = 600 pounds.",
    "Three weeks: 600 × 3 = 1,800.",
    "1,800 pounds",
  ],
  [
    "Trips",
    "A truck carries 400 pounds of paper a trip. All 2,600 pounds must go. How many trips?",
    "Full loads: 2,600 ÷ 400 = 6 R 200, so 6 trips leave 200 pounds behind.",
    "The last 200 pounds need one more trip: 6 + 1 = 7.",
    "7 trips",
  ],
];
/* Pick a problem and show its steps one at a time (a stepper). */
function wSteps(el) {
  const q = Q(el),
    values = { steps: 0 },
    limits = { steps: [0, 2] };
  let problemIndex = 0;
  el.innerHTML =
    seg(
      "Problem",
      PROBLEMS.map(([button], i) => [i, button]),
    ) +
    `<p class="story" data-s></p><div class="wrow">${stepper("steps", "Steps")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const [, story, first, second, answer] = PROBLEMS[problemIndex],
      shown = values.steps;
    press(el, problemIndex);
    q("steps").textContent = shown;
    q("s").innerHTML = story;
    q("r").innerHTML = [
      "What do you need to find first? Tap + for each step.",
      `1. ${first}`,
      `1. ${first}<br>2. ${second} <b>${answer}</b>.`,
    ][shown];
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    problemIndex = +m;
    values.steps = 0;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Problems with two steps",
    widget: wSteps,
    body: "<p>Big real-world problems often take more than one step. Find what you need first, like the total for one day or one week, then use it to answer the question. Check that the answer makes sense: you can’t leave paper behind.</p><p>Pick a problem and work it step by step.</p>",
    check: {
      kind: "num",
      q: "A school serves 150 cartons of milk a day. Milk comes in cases of 25. How many cases does the school need for 20 days?",
      answer: 120,
      unit: "cases",
      misc: [
        [3000, "That’s the cartons: 150 × 20 = 3,000. Now divide by 25 to find the cases."],
        [6, "That’s the cases for 1 day. The school needs milk for 20 days."],
      ],
      explain: "150 × 20 = 3,000 cartons. 3,000 ÷ 25 = 120 cases.",
    },
  },
];
