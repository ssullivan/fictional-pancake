/* Learn Introducing Proportional Relationships (Grade 7 Unit 2), chapter 1: Proportional relationships in tables. Its
   widgets and steps; loaded by tables.html. */
/* constants for lemonade: cups of water per scoop of mix, as [n, d] */
const LEMONADE_KS = [
  [2, 1],
  [3, 1],
  [3, 2],
];
/* Pick cups of water per scoop and add rows: every row is the scoops times the same number. */
function wTable(el) {
  const q = Q(el),
    values = { rows: 3 };
  let kIndex = 1;
  el.innerHTML =
    seg(
      "Cups of water per scoop",
      LEMONADE_KS.map((k, i) => [i, `${ftx(k)} cups per scoop`]),
    ) +
    `<div class="wrow">${stepper("rows", "Rows")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const k = LEMONADE_KS[kIndex],
      kv = k[0] / k[1],
      rows = range(values.rows).map((i) => ({ x: i + 1, y: (i + 1) * kv, note: `× ${ftx(k)}` }));
    press(el, kIndex);
    q("rows").textContent = values.rows;
    q("f").innerHTML = tableFig({ hx: "mix (scoops)", hy: "water (cups)" }, rows)(true);
    q("r").innerHTML =
      `Every row: water = scoops × <b>${ftx(k)}</b>. ${ftx(k)} is the <b>constant of proportionality</b>: the cups of water for 1 scoop. ` +
      `The last row, ${values.rows} × ${ftx(k)} = ${fmt(values.rows * kv)}.`;
  };
  steppers(el, values, { rows: [2, 6] }, draw);
  onPick(el, (id) => {
    kIndex = +id;
    draw();
  });
  draw();
}

/* a table of tacos and their cost, $2.50 each */
const TACO_ROWS = [
  { x: 2, y: 5 },
  { x: 4, y: 10 },
  { x: 6, y: 15 },
];
/* Pick a row: dividing its cost by its tacos always gives the same 2.5. */
function wFind(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Row",
      TACO_ROWS.map((r, i) => [i, `${r.x} tacos`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const row = TACO_ROWS[index];
    press(el, index);
    q("f").innerHTML = tableFig(
      { hx: "tacos", hy: "cost ($)" },
      TACO_ROWS.map((r, i) => ({ ...r, note: i === index ? `${fmt(r.y)} ÷ ${r.x} = 2.5` : "" })),
    )(true);
    q("r").innerHTML =
      `${fmt(row.y)} ÷ ${row.x} = <b>2.5</b>. Any row gives the same number: each taco costs $2.50. ` +
      `To fill in a new row, multiply its tacos by 2.5.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* Pick a direction for the printer's table: pages per minute, or minutes per page. */
function wBack(el) {
  const q = Q(el),
    perMinute = 6;
  el.innerHTML =
    seg("Direction", [
      ["forward", "minutes → pages"],
      ["back", "pages → minutes"],
    ]) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (direction) => {
    const forward = direction === "forward",
      rows = [1, 2, 5].map((m) =>
        forward ? { x: m, y: m * perMinute, note: "× 6" } : { x: m * perMinute, y: m, note: "× 1/6" },
      );
    press(el, direction);
    q("f").innerHTML = tableFig(
      forward ? { hx: "time (minutes)", hy: "pages" } : { hx: "pages", hy: "time (minutes)" },
      rows,
    )(true);
    q("r").innerHTML = forward
      ? `Minutes to pages: × <b>6</b>, 6 pages per minute.`
      : `Pages to minutes: × <b>1/6</b>, since each page takes 1/6 of a minute. 6 and 1/6 are <b>reciprocals</b>: 6 × 1/6 = 1.`;
  };
  onPick(el, draw);
  draw("forward");
}

const STEPS = [
  {
    title: "Multiply by the same number",
    widget: wTable,
    body: "<p>In a <b>proportional relationship</b>, every value in one column is the matching value in the other column times the same number. That number is the <b>constant of proportionality</b>: how much goes with 1.</p><p>Pick a recipe and add rows.</p>",
    check: {
      kind: "num",
      q: "A table shows a proportional relationship: 4 batches of muffins take 10 cups of flour, and 6 batches take 15 cups. What is the constant of proportionality?",
      answer: 2.5,
      misc: [
        [0.4, "That’s batches per cup of flour. Divide the cups by the batches: 10 ÷ 4."],
        [5, "That’s how much the flour goes up from row to row. Divide each y by its x."],
        [6, "That subtracts 4 from 10. A proportional relationship multiplies."],
      ],
      explain: "10 ÷ 4 = 2.5 and 15 ÷ 6 = 2.5: 2.5 cups of flour per batch.",
    },
  },
  {
    title: "Finding the constant",
    widget: wFind,
    body: "<p>To find the constant of proportionality, divide a value in the second column by its match in the first. Every row gives the same answer. Then multiply by it to fill in any new row.</p><p>Pick a row.</p>",
    check: {
      kind: "num",
      q: "In a proportional relationship, 3 hours of work pays $36. How much do 5 hours pay?",
      answer: 60,
      unit: "dollars",
      misc: [
        [38, "That adds 2, like 3 hours to 5 hours. Find the pay for 1 hour first: 36 ÷ 3."],
        [12, "That’s the pay for 1 hour, the constant. Multiply it by 5."],
      ],
      explain: "36 ÷ 3 = 12 dollars per hour, and 5 × 12 = 60 dollars.",
    },
  },
  {
    title: "Going the other way",
    widget: wBack,
    body: "<p>A proportional relationship works both ways. Going back, multiply by the <b>reciprocal</b> of the constant: 6 pages per minute is 1/6 of a minute per page.</p><p>Switch the direction.</p>",
    check: {
      kind: "num",
      q: "A food truck drives 50 miles per hour. What is the constant of proportionality going the other way, in hours per mile?",
      answer: 0.02,
      frac: true,
      misc: [[50, "That’s miles per hour. The other way is the reciprocal: 1 ÷ 50."]],
      explain: "Each mile takes 1/50 of an hour: 1 ÷ 50 = 1/50, or 0.02.",
    },
  },
];
