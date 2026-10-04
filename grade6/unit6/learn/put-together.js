/* Learn Expressions and Equations (Grade 6 Unit 6), chapter 9: Tables, equations, and graphs. Its widgets and steps; loaded by
   put-together.html. */
/* situations to see four ways: the story, the letters, the equation and its rule, the story for one value, and the graph's size */
const SITUATIONS = [
  {
    id: "earn",
    label: "Babysitting",
    story:
      "Jada earns $8 for each hour of babysitting. h is the number of hours, and e is what Jada earns, in dollars.",
    x: "h",
    y: "e",
    equation: "e = 8h",
    rule: (x) => 8 * x,
    work: (x) => `e = 8 · ${x}`,
    tell: (x, y) => `${x} hour${x === 1 ? "" : "s"} of babysitting earns $${y}`,
    yMax: 48,
    yStep: 8,
  },
  {
    id: "bus",
    label: "Bus riders",
    story: "A bus has 12 riders. Then r more riders get on. t is the total number of riders.",
    x: "r",
    y: "t",
    equation: "t = r + 12",
    rule: (x) => x + 12,
    work: (x) => `t = ${x} + 12`,
    tell: (x, y) => `${x} more rider${x === 1 ? "" : "s"} make${x === 1 ? "s" : ""} ${y} in all`,
    yMax: 24,
    yStep: 4,
  },
];
/* Pick a situation and a value: the story, the table row, the point, and the equation all show the same pair. */
function wFourViews(el) {
  const q = Q(el),
    values = { x: 3 };
  let situationId = "earn";
  el.innerHTML =
    seg(
      "Situation",
      SITUATIONS.map((s) => [s.id, s.label]),
    ) +
    `<p class="readout" data-s></p><div class="wrow">${stepper("x", "Value")}</div>` +
    `<div class="figrow"><div class="tables" data-t></div><div class="fig" data-f></div></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const sit = SITUATIONS.find((s) => s.id === situationId),
      x = values.x,
      y = sit.rule(x),
      rows = range(7).map((v) => [v, sit.rule(v)]);
    press(el, situationId);
    q("x").textContent = `${sit.x} = ${x}`;
    q("s").innerHTML = withVars(sit.story);
    q("t").innerHTML = valueTable([mathVar(sit.x), mathVar(sit.y)], rows, {
      hi: x,
      label: `Table for ${sit.equation}`,
    });
    q("f").innerHTML = coordPlane(
      rows.map(([v, w]) => ({ x: v, y: w, cls: v === x ? "hi" : "" })),
      { xMax: 6, yMax: sit.yMax, yStep: sit.yStep, xLabel: sit.x, yLabel: sit.y },
    );
    q("e").innerHTML = withVars(`${sit.work(x)} = ${y}`);
    q("r").innerHTML = withVars(
      `One pair, four ways. The story: ${sit.tell(x, y)}. The table: the row ${x}, ${y}. The graph: the point (${x}, ${y}). The equation: ${sit.equation} with ${sit.x} = ${x} gives ${y}.` +
        `<br><span class="dimline">Each view is handy for something: the equation finds any value, the table lists several, and the graph shows the pattern at a glance.</span>`,
    );
  };
  onPick(el, (id) => {
    situationId = id;
    draw();
  });
  steppers(el, values, { x: [0, 6] }, draw);
  draw();
}

/* solved problems, each with one wrong line: the problem, who solved it, and each line with what to say when it's tapped */
const SOLVED = [
  {
    id: "mai",
    label: "Mai’s work",
    problem: "The class needs $180 for a trip. Each car wash ticket raises $4. How many tickets must they sell?",
    lines: [
      { text: "Let t be the number of tickets.", fine: "This line is fine: t is a number, how many tickets." },
      { text: "4t = 180", fine: "This line is fine: t tickets at $4 each make $180." },
      {
        text: "t = 180 − 4 = 176",
        wrong:
          "Here’s the mistake. 4t means 4 times t, so divide each side by 4 instead of subtracting: t = 180 ÷ 4 = 45 tickets. Check: 4 · 45 = 180 ✓",
      },
    ],
  },
  {
    id: "kiran",
    label: "Kiran’s work",
    problem: "A store sold 12 bikes, which was 25% of the bikes it had. How many bikes did the store have?",
    lines: [
      {
        text: "Let b be the number of bikes the store had.",
        fine: "This line is fine: b is a number, how many bikes.",
      },
      { text: "0.25b = 12", fine: "This line is fine: 25% of b is 0.25b, and that’s 12." },
      {
        text: "b = 12 · 0.25 = 3",
        wrong:
          "Here’s the mistake. To undo times 0.25, divide: b = 12 ÷ 0.25 = 48 bikes. Check: 25% of 48 is 12 ✓. (3 bikes can’t be the whole store when 12 were sold.)",
      },
    ],
  },
];
/* Pick a solved problem and tap the line with the mistake; each line says whether it's fine or what went wrong. */
function wFindMistake(el) {
  const q = Q(el);
  let solvedId = "mai",
    tapped = null;
  el.innerHTML =
    seg(
      "Solved problem",
      SOLVED.map((s) => [s.id, s.label]),
    ) + `<div class="solved" data-w></div><p class="readout" data-r></p>`;
  const draw = () => {
    const solved = SOLVED.find((s) => s.id === solvedId);
    press(el, solvedId);
    q("w").innerHTML =
      `<p class="who">${solved.problem}</p>` +
      solved.lines
        .map(
          (line, i) =>
            `<button type="button" data-line="${i}" class="${line.wrong ? "bad" : "fine"}" aria-pressed="${tapped === i}">${withVars(line.text)}</button>`,
        )
        .join("");
    const line = tapped === null ? null : solved.lines[tapped];
    q("r").innerHTML = withVars(
      line === null
        ? "One line has a mistake. Tap the line you think is wrong."
        : line.wrong
          ? `<span class="no">${line.wrong}</span>`
          : `<span class="ok">${line.fine}</span> Keep looking.`,
    );
  };
  onPick(el, (id) => {
    solvedId = id;
    tapped = null;
    draw();
  });
  q("w").addEventListener("click", (e) => {
    const button = e.target.closest("[data-line]");
    if (!button) return;
    tapped = +button.dataset.line;
    draw();
  });
  draw();
}

const STEPS = [
  {
    title: "One situation, four ways",
    widget: wFourViews,
    body: "<p>A story, a table, a graph, and an equation can all describe the same relationship. Each pair of values shows up in all four.</p><p>Pick a situation and change the value.</p>",
    check: {
      kind: "mc",
      stack: true,
      q: `Pencils cost $3 each. Which table fits ${mathVar("c")} = 3${mathVar("n")}, where ${mathVar("n")} is the number of pencils and ${mathVar("c")} is the cost in dollars?`,
      choices: [
        { id: "a", label: withVars("n: 1, 2, 3 → c: 3, 6, 9") },
        { id: "b", label: withVars("n: 1, 2, 3 → c: 4, 5, 6") },
        { id: "c", label: withVars("n: 3, 6, 9 → c: 1, 2, 3") },
      ],
      answer: "a",
      why: {
        b: "That adds 3 each time: c = n + 3. At $3 each, the cost is 3 times the number of pencils.",
        c: "That swaps n and c. 1 pencil costs $3; 3 pencils don’t cost $1.",
      },
      explain: "c = 3n: 3 · 1 = 3, 3 · 2 = 6, 3 · 3 = 9.",
    },
  },
  {
    title: "Choose, solve, and check",
    widget: wFindMistake,
    body: "<p>To solve a story problem: say what the letter stands for, write an equation, solve it, and check that the answer makes sense in the story. Checking catches mistakes like the one in each solved problem here.</p><p>Find the mistake.</p>",
    check: {
      kind: "num",
      q: "Tickets to a school play cost $6 each. Andre’s class collected $138. How many tickets did the class sell?",
      unit: "tickets",
      answer: 23,
      misc: [
        [828, "That multiplies. 6t = 138: divide each side by 6."],
        [132, "That subtracts 6. Each ticket is $6, so 6 times the tickets is 138: divide each side by 6."],
      ],
      explain: "6t = 138, so t = 138 ÷ 6 = 23 tickets. Check: 6 · 23 = 138 ✓",
    },
  },
];
