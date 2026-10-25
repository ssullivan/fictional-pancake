/* Learn Linear Equations, Inequalities, and Systems (Algebra 1 Unit 2), chapter 3: Finding the relationship (Lesson 3). Its
   widgets and steps; loaded by finding-relationships.html, after common.js (fmt, money, dataTable). */
/* IM's four tables about 400: what x and y are, the rows, and what the relationship means once it's found */
const TABLES_400 = [
  {
    id: "A",
    x: "laps",
    y: "meters run",
    rows: [
      [0, 0],
      [1, 400],
      [2.5, 1000],
      [6, 2400],
      [9, 3600],
    ],
    means: "a lap is 400 meters, so the meters are 400 times the laps",
  },
  {
    id: "B",
    x: "meters from home",
    y: "meters from school",
    rows: [
      [0, 400],
      [75, 325],
      [128, 272],
      [319, 81],
      [396, 4],
    ],
    means: "home and school are 400 meters apart, so the two distances add to 400",
  },
  {
    id: "C",
    x: "electric bill ($)",
    y: "total expenses ($)",
    rows: [
      [85, 485],
      [124, 524],
      [309, 709],
      [816, 1216],
    ],
    means: "the other expenses are $400, so the total is the electric bill plus 400",
  },
  {
    id: "D",
    x: "monthly pay ($)",
    y: "amount saved ($)",
    rows: [
      [872, 472],
      [998, 598],
      [1015, 615],
      [2110, 1710],
    ],
    means: "$400 of the pay is spent, so the savings are the pay minus 400",
  },
];
/* the four equations to try, each written for y: the button's text and the y it gives for an x */
const EQUATIONS_400 = [
  { id: "plus", label: "y = 400 + x", yOf: (x) => 400 + x },
  { id: "minus", label: "y = x − 400", yOf: (x) => x - 400 },
  { id: "sum", label: "x + y = 400", yOf: (x) => 400 - x },
  { id: "times", label: "y = 400x", yOf: (x) => 400 * x },
];
/* Pick a table and an equation: each row is checked, and the equation fits when it's true in every row. */
function wFour(el) {
  const q = Q(el);
  let tableId = "A",
    equationId = "plus";
  el.innerHTML =
    `<div data-top>${seg(
      "Table",
      TABLES_400.map((t) => [t.id, `Table ${t.id}`]),
    )}</div>` +
    `<div data-bot>${seg(
      "Equation",
      EQUATIONS_400.map((e) => [e.id, e.label]),
    )}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const table = TABLES_400.find((t) => t.id === tableId),
      equation = EQUATIONS_400.find((e) => e.id === equationId),
      fitsRow = ([x, y]) => equation.yOf(x) === y,
      misfit = table.rows.find((row) => !fitsRow(row));
    press(q("top"), tableId);
    press(q("bot"), equationId);
    q("f").innerHTML = dataTable(
      [`x: ${table.x}`, `y: ${table.y}`, equation.label],
      table.rows.map((row) => [fmt(row[0]), fmt(row[1]), fitsRow(row) ? "✓" : "✗"]),
    );
    q("r").innerHTML = misfit
      ? `<span class="no">${equation.label} doesn’t fit Table ${table.id}</span>. When x is ${fmt(misfit[0])}, ` +
        `it makes y ${fmt(equation.yOf(misfit[0]))}, but the table says ${fmt(misfit[1])}.`
      : `<span class="ok">${equation.label} fits every row of Table ${table.id}</span>: ${table.means}.`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (row === "top") tableId = id;
    if (row === "bot") equationId = id;
    if (row) draw();
  });
  draw();
}

/* the carnival prize, split equally among the winners, and the numbers of winners to try */
const PRIZE = 300,
  WINNER_COUNTS = [1, 2, 3, 4, 5, 6, 10];
/* Pick how many people win: the prize is split into that many equal shares, so more winners means smaller shares. */
function wPrize(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Winners",
      WINNER_COUNTS.map((n) => [n, `${n} winner${n === 1 ? "" : "s"}`]),
    ) + `<div class="shares" data-s></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = (id) => {
    const winners = +id,
      share = PRIZE / winners;
    press(el, winners);
    q("s").innerHTML = range(winners)
      .map(() => `<span>${money(share)}</span>`)
      .join("");
    q("e").innerHTML = typeset(math(`w = \\frac{${PRIZE}}{${winners}} = ${share}`));
    q("r").innerHTML =
      `${winners} winner${winners === 1 ? " gets" : "s get"} ${money(share)} each, and ${winners} × ${money(share)} = ` +
      `${money(PRIZE)}. The product of the two quantities stays ${PRIZE}: ${typeset(math("nw = 300"))}, or ` +
      `${typeset(math("w = \\frac{300}{n}"))}.`;
  };
  onPick(el, draw);
  draw(4);
}

/* the quick check's table: x and y add to 15 in every row */
const SUM_ROWS = [
  [2, 13],
  [5, 10],
  [8, 7],
  [11, 4],
];

const STEPS = [
  {
    title: "Test it on every row",
    widget: wFour,
    body:
      `<p>When a relationship isn’t given, look for a pattern in the numbers. Does ${math("y")} go up as ${math("x")} goes up, or down? By the same amount, or by a multiple? Then write an equation and test it on every row: one row that doesn’t fit rules it out.</p>` +
      `<p>Each table is about 400 in a different way. Pick a table and an equation.</p>`,
    check: {
      kind: "expr",
      q: "Write an equation for the relationship between x and y in this table.",
      fig: dataTable(
        ["x", "y"],
        SUM_ROWS.map((row) => row.map(String)),
      ),
      answer: "x+y=15",
      vars: ["x", "y"],
      keys: ["x", "y", "=", "(", ")"],
      placeholder: "like x + y = 10",
      misc: [
        ["y=x+11", "That fits the first row only: 2 + 11 is 13, but 5 + 11 isn’t 10."],
        ["x+y=13", "Add a row: 5 + 10 is 15."],
      ],
      explain: `As ${math("x")} goes up 3, ${math("y")} goes down 3, and every row adds to 15: ${math("x + y = 15")}.`,
    },
  },
  {
    title: "A product that stays the same",
    widget: wPrize,
    body:
      `<p>Some relationships multiply. A parallelogram with an area of 48 square inches can have a base of 6 and a height of 8, or a base of 4 and a height of 12: the base times the height is always 48, so ${math("bh = 48")}.</p>` +
      `<p>A carnival prize of ${money(PRIZE)} is split equally among everyone who guesses right. Pick how many win.</p>`,
    check: {
      kind: "expr",
      q: `A parallelogram has an area of 48 square inches. Write an equation for its height ${math("h")} when its base is ${math("b")}.`,
      answer: "h=48/b",
      vars: ["h", "b"],
      form: Expr.form.solvedFor("h"),
      keys: ["h", "b", "=", "/", "(", ")"],
      placeholder: "like h = 10/b",
      misc: [
        ["h=48b", "The base times the height is 48, so the height is 48 divided by the base."],
        ["h=48-b", "That’s a base and height that add to 48. Here they multiply to 48."],
        ["bh=48", "That’s true, but the question asks for h by itself: divide both sides by b."],
      ],
      explain: `${math("bh = 48")}, so ${math("h = \\frac{48}{b}")}: a base of 6 gives a height of 8.`,
    },
  },
];
