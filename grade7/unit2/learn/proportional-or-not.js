/* Learn Introducing Proportional Relationships (Grade 7 Unit 2), chapter 3: Proportional or not? Its widgets and steps;
   loaded by proportional-or-not.html. */
/* tables to test: [label, rows {x, y}] */
const TEST_TABLES = [
  [
    "Table A",
    [
      { x: 2, y: 6 },
      { x: 3, y: 9 },
      { x: 5, y: 15 },
    ],
  ],
  [
    "Table B",
    [
      { x: 2, y: 6 },
      { x: 3, y: 7 },
      { x: 5, y: 9 },
    ],
  ],
  [
    "Table C",
    [
      { x: 1, y: 4 },
      { x: 2, y: 6 },
      { x: 4, y: 10 },
    ],
  ],
];
/* Pick a table: divide each y by its x. The same number every time means proportional. */
function wTables(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Table",
      TEST_TABLES.map(([label], i) => [i, label]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [, rows] = TEST_TABLES[index],
      ratios = rows.map((r) => r.y / r.x),
      same = ratios.every((v) => v === ratios[0]);
    press(el, index);
    q("f").innerHTML = tableFig(
      { hx: "x", hy: "y" },
      rows.map((r) => ({ ...r, note: `${r.y} ÷ ${r.x} = ${fmt(r.y / r.x)}` })),
    )(true);
    q("r").innerHTML = same
      ? `<span class="ok">Every row gives ${fmt(ratios[0])}: proportional</span>, with ${mv("y")} = ${fmt(ratios[0])}${mv("x")}.`
      : `<span class="no">The rows give different numbers: not proportional.</span> ` +
        (index === 1
          ? "Here y is always x + 4: adding, not multiplying."
          : "Here y is 2x + 2: there’s an extra 2 on top of a multiple.");
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* equations to test: [label, y as a function of x, proportional?, why] */
const TEST_EQS = [
  ["y = 4x", (x) => 4 * x, true, "y is 4 times x: k = 4."],
  ["y = x/4", (x) => x / 4, true, "y is x times 1/4: k = 1/4."],
  ["y = x + 4", (x) => x + 4, false, "Adding 4 isn’t multiplying."],
  ["y = 4x + 1", (x) => 4 * x + 1, false, "The + 1 is extra: when x is 0, y is 1, not 0."],
];
/* Pick an equation: its table shows whether y ÷ x stays the same. */
function wEqs(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Equation",
      TEST_EQS.map(([label], i) => [i, label]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [label, yOf, proportional, why] = TEST_EQS[index],
      rows = [1, 2, 4].map((x) => ({ x, y: yOf(x), note: `÷ ${x} = ${fmt(yOf(x) / x)}` }));
    press(el, index);
    q("f").innerHTML = tableFig({ hx: "x", hy: "y" }, rows)(true);
    q("r").innerHTML =
      `${withVars(label)}: ` +
      (proportional
        ? `<span class="ok">proportional.</span> ${withVars(why)} It has the form ${mv("y")} = ${mv("k")}${mv("x")}.`
        : `<span class="no">not proportional.</span> ${withVars(why)}`);
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "Testing a table",
    widget: wTables,
    body: "<p>Not every relationship is proportional. To test a table, divide each y by its x. If every row gives the same number, the relationship is proportional. If not, it isn’t.</p><p>Test each table.</p>",
    check: {
      kind: "mc",
      q: "Which set of rows (x, y) could be a proportional relationship?",
      choices: [
        { id: "a", label: "(1, 5), (2, 6), (3, 7)" },
        { id: "b", label: "(2, 5), (4, 10), (6, 15)" },
        { id: "c", label: "(1, 3), (2, 6), (3, 10)" },
      ],
      answer: "b",
      why: {
        a: "5 ÷ 1 = 5 but 6 ÷ 2 = 3. Each y is 4 more than x: adding, not multiplying.",
        c: "3 ÷ 1 = 3 and 6 ÷ 2 = 3, but 10 ÷ 3 isn’t 3. One row is off.",
      },
      explain: "5 ÷ 2 = 10 ÷ 4 = 15 ÷ 6 = 2.5: every row gives the same number.",
    },
  },
  {
    title: "Equations and stories",
    widget: wEqs,
    body: `<p>An equation is proportional when it has the form ${mv("y")} = ${mv("k")}${mv("x")}: ${mv("y")} is a number times ${mv("x")}, and nothing else. In a story, look for a starting fee or anything added on: those make it not proportional.</p><p>Test each equation.</p>`,
    check: {
      kind: "mc",
      q: "Which of these is <b>not</b> a proportional relationship?",
      choices: [
        { id: "a", label: "Pay of $12 for each hour worked" },
        { id: "b", label: "A $5 fee plus $2 for each ride" },
        { id: "c", label: "A printer that prints 6 pages each minute" },
      ],
      answer: "b",
      stack: true,
      why: {
        a: "Pay is 12 times the hours: proportional.",
        c: "Pages are 6 times the minutes: proportional.",
      },
      explain: "The $5 fee is there before any rides, so the cost isn’t a number times the rides.",
    },
  },
];
