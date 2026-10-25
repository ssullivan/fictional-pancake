/* Learn Linear Equations, Inequalities, and Systems (Algebra 1 Unit 2), chapter 5: Equations and their graphs (Lesson 5).
   Its widgets and steps; loaded by graphs.html, after common.js (fmt, money). */
/* the bulk snacks: almonds and figs by the pound, and the money spent */
const ALMONDS = 6,
  FIGS = 9,
  SNACK_BUDGET = 75;
/* points to test, [pounds of almonds, pounds of figs]: three on the line and two off it */
const SNACK_POINTS = [
  [2, 7],
  [8, 3],
  [10, 4],
  [4, 2],
  [11, 1],
];
/* the line 6a + 9f = 75 across the plot, from where it meets the figs axis to where it meets the almonds axis */
const SNACK_LINE = {
  pts: [
    [0, SNACK_BUDGET / FIGS],
    [SNACK_BUDGET / ALMONDS, 0],
  ],
};
/* Pick a point on the graph of 6a + 9f = 75: on the line it costs exactly $75; above it, more; below it, less. */
function wSnacks(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Point",
      SNACK_POINTS.map(([a, f]) => [`${a},${f}`, `(${a}, ${f})`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (id) => {
    const [almonds, figs] = id.split(",").map(Number),
      cost = ALMONDS * almonds + FIGS * figs;
    press(el, id);
    q("f").innerHTML = coordPlane(
      SNACK_POINTS.map(([a, f]) => ({ x: a, y: f, cls: a === almonds && f === figs ? "hi" : "b" })),
      {
        xMax: 14,
        yMax: 10,
        xLabel: "pounds of almonds (a)",
        yLabel: "pounds of figs (f)",
        shapes: [SNACK_LINE],
        label: `The graph of 6a + 9f = 75, with the point (${almonds}, ${figs})`,
      },
    );
    q("r").innerHTML =
      `${almonds} pounds of almonds and ${figs} of figs cost 6 × ${almonds} + 9 × ${figs} = ${money(cost)}: ` +
      (cost === SNACK_BUDGET
        ? `<span class="ok">on the line</span>, a solution.`
        : `<span class="no">${cost > SNACK_BUDGET ? "more" : "less"} than ${money(SNACK_BUDGET)}</span>, so the point is ` +
          `${cost > SNACK_BUDGET ? "above" : "below"} the line: not a solution.`);
  };
  onPick(el, draw);
  draw("2,7");
}

/* the draining tank: gallons at the start, and gallons out each minute */
const TANK_START = 450,
  DRAIN_RATE = 20,
  EMPTY_AT = TANK_START / DRAIN_RATE;
/* Change the minutes: the point (t, v) slides down the graph of v = 450 − 20t, which meets the t-axis when the tank is
   empty. */
function wTank(el) {
  const q = Q(el),
    values = { minutes: 5 },
    limits = { minutes: [0, 22] };
  el.innerHTML =
    `<div class="wrow">${stepper("minutes", "Minutes (t)")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const minutes = values.minutes,
      gallons = TANK_START - DRAIN_RATE * minutes;
    q("minutes").textContent = minutes;
    q("f").innerHTML = coordPlane([{ x: minutes, y: gallons, t: `(${minutes}, ${gallons})` }], {
      xMax: 25,
      xStep: 5,
      yMax: 500,
      yStep: 50,
      xLabel: "minutes (t)",
      yLabel: "gallons left (v)",
      shapes: [
        {
          pts: [
            [0, TANK_START],
            [EMPTY_AT, 0],
          ],
        },
      ],
      label: `The graph of v = 450 − 20t, with the point (${minutes}, ${gallons})`,
    });
    q("r").innerHTML =
      `After ${minutes} minute${minutes === 1 ? "" : "s"}: 450 − 20 × ${minutes} = <b>${gallons} gallons</b>. ` +
      `Every point on the line is a time and the water left then. The line meets the t-axis at ${fmt(EMPTY_AT)}: ` +
      "the tank is empty after 22.5 minutes.";
  };
  steppers(el, values, limits, draw);
  draw();
}

const STEPS = [
  {
    title: "Points on the line",
    widget: wSnacks,
    body:
      `<p>Clare spent ${money(SNACK_BUDGET)} on almonds at ${money(ALMONDS)} a pound and dried figs at ${money(FIGS)} a pound: ${math("6a + 9f = 75")}.</p>` +
      `<p>The <b>graph</b> of an equation in two variables is every solution, drawn as a point. Here the solutions make a line. A point <b>on the line</b> meets the constraint, spending exactly ${money(SNACK_BUDGET)}; a point <b>off the line</b> doesn’t. Pick a point.</p>`,
    check: {
      kind: "mc",
      q: `Which point is on the graph of ${math("6a + 9f = 75")}?`,
      choices: [
        { id: "b", label: "(1, 11)" },
        { id: "c", label: "(5, 4)" },
        { id: "a", label: "(11, 1)" },
        { id: "d", label: "(12, 0)" },
      ],
      answer: "a",
      why: {
        b: "6 × 1 + 9 × 11 = 105, not 75. The first number is the almonds, a.",
        c: "6 × 5 + 9 × 4 = 66, not 75: that point is below the line.",
        d: "6 × 12 + 9 × 0 = 72, not 75. The line meets the a-axis at 12.5.",
      },
      explain: `${math("6(11) + 9(1) = 66 + 9 = 75")}, so ${math("(11, 1)")} is a solution: it’s on the line.`,
    },
  },
  {
    title: "Graph a situation",
    widget: wTank,
    body:
      `<p>A tank holds ${TANK_START} gallons and drains ${DRAIN_RATE} gallons a minute. After ${math("t")} minutes, it has ${math("v = 450 - 20t")} gallons left.</p>` +
      `<p>The graph shows every solution at once: read the water left at any time, or the time for any amount. Where the line meets an axis says when one quantity is 0. Change the minutes.</p>`,
    check: {
      kind: "num",
      q: `A savings account starts with $475, and $125 goes in each week: ${math("b = 475 + 125w")}. After how many weeks does it have $1,350?`,
      answer: 7,
      unit: "weeks",
      misc: [
        [10.8, "1,350 ÷ 125 leaves out the $475 the account started with. Subtract it first."],
        [14.6, "Subtract the $475 the account starts with; don’t add it."],
      ],
      explain: `${math("125w = 1350 - 475 = 875")}, so ${math("w = 875 \\div 125 = 7")}.`,
    },
  },
];
