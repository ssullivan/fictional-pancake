/* Learn More Decimal and Fraction Operations (Grade 5 Unit 6), chapter 5: Line plots. Its widgets and steps; loaded by
   line-plots.html. */
/* rainfall for 10 days, in eighths of an inch: {eighths: days} */
const RAIN = { 1: 2, 2: 1, 3: 3, 5: 2, 6: 1, 7: 1 };
/* questions about the plot: [button, what's marked, what the readout says] */
const QUESTIONS = [
  [
    "Wettest − driest",
    { diff: [1, 7] },
    "The wettest day had 7/8 inch and the driest 1/8 inch: <b>7/8 − 1/8 = 6/8 = 3/4 inch</b> more.",
  ],
  ["Rain on 3/8 days", { mark: 3 }, "3 days had 3/8 inch each: <b>3 × 3/8 = 9/8 = 1 1/8 inches</b> in all."],
  [
    "Days over 1/2 inch",
    { mark: 5 },
    "1/2 inch is 4/8. The Xs to the right of it are at 5/8, 6/8, and 7/8: <b>2 + 1 + 1 = 4 days</b>.",
  ],
  ["All the rain", {}, "Add every X: 2 × 1/8 + 2/8 + 3 × 3/8 + 2 × 5/8 + 6/8 + 7/8 = <b>36/8 = 4 1/2 inches</b>."],
];
/* Pick a question about a line plot of rainfall in eighths of an inch. */
function wPlot(el) {
  const q = Q(el);
  let questionIndex = 0;
  el.innerHTML =
    seg(
      "Question",
      QUESTIONS.map(([button], i) => [i, button]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [, marks, says] = QUESTIONS[questionIndex];
    press(el, questionIndex);
    q("f").innerHTML = lineplot(RAIN, 0, 8, {
      d: 8,
      unit: "inches of rain",
      u: 44,
      ...marks,
      label: "Rainfall for 10 days",
    });
    q("r").innerHTML = says;
  };
  onPick(el, (m) => {
    questionIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Read a line plot of fractions",
    widget: wPlot,
    body: "<p>A line plot shows each measurement as an X above its value. To answer questions, count the Xs, and add, subtract, or multiply the fractions they stand for.</p><p>Pick a question about 10 days of rain.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "Use the line plot. How much rain fell in all on the days with 5/8 inch?",
      fig: lineplot(RAIN, 0, 8, { d: 8, unit: "inches of rain", u: 44, label: "Rainfall for 10 days" }),
      answer: 10 / 8,
      unit: "inches",
      misc: [
        [5 / 8, "That’s one day. There are 2 Xs at 5/8."],
        [2, "That’s how many days. Each one had 5/8 inch: 2 × 5/8."],
      ],
      explain: "2 × 5/8 = 10/8 = 1 2/8 = 1 1/4 inches.",
    },
  },
];
