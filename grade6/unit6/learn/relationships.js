/* Learn Expressions and Equations (Grade 6 Unit 6), chapter 8: Two related quantities. Its widgets and steps; loaded by
   relationships.html. */
/* situations where one amount is a number times the other: the story, the two letters and what they count, and the rate */
const RATES = [
  {
    id: "pool",
    label: "Filling a pool",
    story: "A pool fills with 6 gallons of water each minute.",
    x: "m",
    y: "g",
    xName: "minutes",
    yName: "gallons",
    rate: 6,
  },
  {
    id: "walk",
    label: "Walking",
    story: "Elena walks 4 miles each hour.",
    x: "t",
    y: "d",
    xName: "hours",
    yName: "miles",
    rate: 4,
  },
];
/* Pick a situation and add rows to its table: every row follows the same rule, which is the equation. */
function wTable(el) {
  const q = Q(el),
    values = { n: 3 };
  let rateId = "pool";
  el.innerHTML =
    seg(
      "Situation",
      RATES.map((r) => [r.id, r.label]),
    ) +
    `<p class="readout" data-s></p><div class="wrow">${stepper("n", "Rows")}</div>` +
    `<div class="tables" data-t></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const r = RATES.find((rate) => rate.id === rateId),
      n = values.n;
    press(el, rateId);
    q("n").textContent = n;
    q("s").innerHTML = withVars(
      `${r.story} Let ${r.x} be the number of ${r.xName} and ${r.y} the number of ${r.yName}.`,
    );
    q("t").innerHTML = valueTable(
      [`${r.xName} (${mathVar(r.x)})`, `${r.yName} (${mathVar(r.y)})`],
      range(n).map((i) => [i + 1, r.rate * (i + 1)]),
      { hi: n - 1, label: `Table of ${r.yName} for each number of ${r.xName}` },
    );
    q("e").innerHTML = withVars(`${r.y} = ${r.rate}${r.x}`);
    q("r").innerHTML = withVars(
      `Every row follows the same rule: ${r.yName} = ${r.rate} · ${r.xName}. Last row: ${r.rate} · ${n} = ${r.rate * n}. So <b>${r.y} = ${r.rate}${r.x}</b>.` +
        `<br><span class="dimline">${r.x} is the <b>independent variable</b>: we can pick any number of ${r.xName}. ${r.y} is the <b>dependent variable</b>: it depends on ${r.x}.</span>`,
    );
  };
  onPick(el, (id) => {
    rateId = id;
    draw();
  });
  steppers(el, values, { n: [1, 8] }, draw);
  draw();
}

/* Pick a situation and add points to its graph, one for each row of its table; the line through them can be drawn too. */
function wGraph(el) {
  const q = Q(el),
    values = { n: 3 };
  let rateId = "pool",
    lineShown = false;
  el.innerHTML =
    seg(
      "Situation",
      RATES.map((r) => [r.id, r.label]),
    ) +
    `<div class="wrow">${stepper("n", "Points")}<button type="button" class="ghost-btn" data-line></button></div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const r = RATES.find((rate) => rate.id === rateId),
      n = values.n;
    press(el, rateId);
    q("n").textContent = n;
    q("line").textContent = lineShown ? "Hide the line" : "Draw the line";
    q("f").innerHTML = graphQ1(
      range(n).map((i) => ({ x: i + 1, y: r.rate * (i + 1), cls: i === n - 1 ? "hi" : "" })),
      {
        xMax: 8,
        yMax: r.rate * 8,
        yStep: r.rate,
        xLabel: `${r.xName} (${r.x})`,
        yLabel: `${r.yName} (${r.y})`,
        line: lineShown ? [r.rate, 0] : null,
      },
    );
    q("r").innerHTML = withVars(
      `The point (${n}, ${r.rate * n}) means ${n} ${r.xName} and ${r.rate * n} ${r.yName}: ${n} across, ${r.rate * n} up.` +
        (lineShown
          ? ` Every point is on one straight line through (0, 0): each ${r.xName.slice(0, -1)} adds the same ${r.rate} ${r.yName}, and in-between times are on the line too.`
          : "") +
        `<br><span class="dimline">The independent variable (${r.x}) goes across, and the dependent variable (${r.y}) goes up.</span>`,
    );
  };
  onPick(el, (id) => {
    rateId = id;
    draw();
  });
  q("line").addEventListener("click", () => {
    lineShown = !lineShown;
    draw();
  });
  steppers(el, values, { n: [1, 8] }, draw);
  draw();
}

/* two relationships to compare: one adds 5, one multiplies by 5 */
const KINDS = [
  {
    id: "add",
    label: "Add 5",
    story: "Diego is 5 years older than Mai. m is Mai’s age and d is Diego’s age, in years.",
    x: "m",
    y: "d",
    equation: "d = m + 5",
    value: (x) => x + 5,
    say: "Each year, both get 1 year older, so the difference stays 5. The line starts at 5: when Mai is born (m = 0), Diego is already 5.",
  },
  {
    id: "times",
    label: "Times 5",
    story: "Each pack holds 5 pens. n is the number of packs and p is the number of pens.",
    x: "n",
    y: "p",
    equation: "p = 5n",
    value: (x) => 5 * x,
    say: "Each pack adds 5 pens, so every row is 5 times as many. The line starts at 0: 0 packs hold 0 pens.",
  },
];
/* Pick adding or multiplying, and a stepper for x: the table and the graph side by side. */
function wCompare(el) {
  const q = Q(el),
    values = { x: 4 };
  let kindId = "add";
  el.innerHTML =
    seg(
      "Relationship",
      KINDS.map((k) => [k.id, k.label]),
    ) +
    `<p class="readout" data-s></p><div class="wrow">${stepper("x", "Up to")}</div>` +
    `<div class="figrow"><div class="tables" data-t></div><div class="fig" data-f></div></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const kind = KINDS.find((k) => k.id === kindId),
      upTo = values.x,
      rows = range(upTo + 1).map((x) => [x, kind.value(x)]);
    press(el, kindId);
    q("x").textContent = upTo;
    q("s").innerHTML = withVars(kind.story);
    q("t").innerHTML = valueTable([mathVar(kind.x), mathVar(kind.y)], rows, {
      hi: upTo,
      label: `Table for ${kind.equation}`,
    });
    q("f").innerHTML = graphQ1(
      rows.map(([x, y]) => ({ x, y })),
      { xMax: 6, yMax: 30, yStep: 5, xLabel: kind.x, yLabel: kind.y, line: kind.id === "add" ? [1, 5] : [5, 0] },
    );
    q("e").innerHTML = withVars(kind.equation);
    q("r").innerHTML = withVars(
      `${kind.say}<br><span class="dimline">Adding keeps the <b>difference</b> the same; multiplying keeps the <b>ratio</b> the same. Compare the two: switch between them.</span>`,
    );
  };
  onPick(el, (id) => {
    kindId = id;
    draw();
  });
  steppers(el, values, { x: [1, 6] }, draw);
  draw();
}

const STEPS = [
  {
    title: "Table to equation",
    widget: wTable,
    body: "<p>Some amounts change together: the longer a pool fills, the more water is in it. A table lists pairs of values, and an equation gives the rule that every pair follows.</p><p>Pick a situation and add rows.</p>",
    check: {
      kind: "mc",
      q: "Which equation fits this table?",
      fig: valueTable(
        [mathVar("x"), mathVar("y")],
        [
          [2, 10],
          [3, 15],
          [5, 25],
        ],
      ),
      choices: [
        { id: "a", label: withVars("y = 5x") },
        { id: "b", label: withVars("y = x + 8") },
        { id: "c", label: withVars("x = 5y") },
      ],
      answer: "a",
      why: {
        b: "y = x + 8 fits the first row (2 + 8 = 10), but not the next: 3 + 8 = 11, not 15. An equation has to fit every row.",
        c: "That swaps them: x = 5y would make x the bigger number. Each y is 5 times its x.",
      },
      explain: "Every y is 5 times its x: 5 · 2 = 10, 5 · 3 = 15, 5 · 5 = 25. So y = 5x.",
    },
  },
  {
    title: "Graph it",
    widget: wGraph,
    body: "<p>Each row of a table is a point on a graph: the first number tells how far across, and the second tells how far up.</p><p>Add points, then draw the line through them.</p>",
    check: {
      kind: "mc",
      stack: true,
      q: `Noah rides a bike: ${mathVar("d")} = 9${mathVar("t")}, where ${mathVar("t")} is hours and ${mathVar("d")} is miles. What does the point (2, 18) on its graph mean?`,
      choices: [
        { id: "a", label: "In 2 hours, Noah rides 18 miles" },
        { id: "b", label: "In 18 hours, Noah rides 2 miles" },
        { id: "c", label: "Noah rides 2 miles each hour" },
      ],
      answer: "a",
      why: {
        b: "The first number goes across (t, the hours), and the second goes up (d, the miles). (2, 18) is 2 hours and 18 miles.",
        c: "Noah’s speed is 9 miles each hour (d = 9t). The point (2, 18) is one moment: 2 hours in, 18 miles.",
      },
      explain: "(2, 18) means t = 2 hours and d = 18 miles. Check: 9 · 2 = 18 ✓",
    },
  },
  {
    title: "More relationships",
    widget: wCompare,
    body: "<p>Not every relationship multiplies. When one amount is always a fixed number more than the other, the equation adds. Its graph is still a line, but it doesn’t start at 0.</p><p>Compare adding 5 with multiplying by 5.</p>",
    check: {
      kind: "mc",
      q: `Andre is 3 years older than Jada. Let ${mathVar("j")} be Jada’s age and ${mathVar("a")} be Andre’s age, in years. Which equation fits?`,
      choices: [
        { id: "a", label: `${mathVar("a")} = ${mathVar("j")} + 3` },
        { id: "b", label: `${mathVar("a")} = 3${mathVar("j")}` },
        { id: "c", label: `${mathVar("j")} = ${mathVar("a")} + 3` },
      ],
      answer: "a",
      why: {
        b: "That makes Andre 3 times as old. When Jada is 10, Andre is 13, not 30.",
        c: "That makes Jada the older one. Andre is older, so add 3 to Jada’s age.",
      },
      explain: "Andre’s age is always 3 more than Jada’s: a = j + 3. When j = 10, a = 13 ✓",
    },
  },
];
