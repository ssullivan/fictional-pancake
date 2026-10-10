/* Learn Relating Multiplication to Division (Grade 3 Unit 4), chapter 3: Division and unknown factors. Its widgets and steps;
   loaded by unknown-factor.html. */
/* equations with a missing factor: [rows, total] for rows × ? = total */
const MISSING = [
  [4, 28],
  [3, 24],
  [6, 30],
];
/* Find the missing factor: add to each row of an array until it has the total. */
function wMissing(el) {
  /* values.cols: how many in each row so far */
  const q = Q(el),
    values = { cols: 1 };
  let problemIndex = 0;
  el.innerHTML =
    seg(
      "Equation",
      MISSING.map(([rows, total], i) => [i, `${rows} × ? = ${total}`]),
    ) +
    `<div class="wrow">${stepper("cols", "In each row")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [rows, total] = MISSING[problemIndex],
      cols = values.cols,
      made = rows * cols;
    press(el, problemIndex);
    q("cols").textContent = cols;
    q("f").innerHTML = arrayFig(rows, cols, { band: "r" });
    q("r").innerHTML =
      `${rows} rows of ${cols}: ${rows} × ${cols} = ${made}. ` +
      (made < total
        ? `Not ${total} yet. Put more in each row.`
        : made > total
          ? `<span class="no">That’s more than ${total}. Put fewer in each row.</span>`
          : `<br><span class="ok">${rows} × <b>${cols}</b> = ${total}, so the missing factor is ${cols}. That’s ${total} ÷ ${rows} = ${cols}.</span>`);
  };
  steppers(el, values, { cols: [1, 10] }, draw);
  onPick(el, (id) => {
    problemIndex = +id;
    values.cols = 1;
    draw();
  });
  draw();
}
/* Pick two factors and see the family of facts their array shows: two multiplications and two divisions. */
function wFamily(el) {
  const q = Q(el),
    values = { a: 3, b: 5 };
  el.innerHTML =
    `<div class="wrow">${stepper("a", "Rows")}${stepper("b", "In each row")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { a, b } = values,
      product = a * b;
    q("a").textContent = a;
    q("b").textContent = b;
    q("f").innerHTML = arrayFig(a, b);
    q("r").innerHTML =
      a === b
        ? `${a} × ${a} = ${product} and ${product} ÷ ${a} = ${a}.<br>The factors are the same, so the family has only these two facts.`
        : `${a} × ${b} = ${product} and ${b} × ${a} = ${product}.<br>${product} ÷ ${a} = ${b} and ${product} ÷ ${b} = ${a}.<br><span class="ok">One array, four facts: a family.</span>`;
  };
  steppers(el, values, { a: [2, 9], b: [2, 9] }, draw);
  draw();
}
/* the quick checks' figures */
const F = {
  hops: hopLine(5, 35, 0, { mark: 35 }),
  array: arrayFig(6, 8),
};
const STEPS = [
  {
    title: "Find the missing factor",
    widget: wMissing,
    body: "<p>28 ÷ 4 asks: 4 times what is 28? So 4 × ? = 28 and 28 ÷ 4 = ? ask the same thing. The missing number is a <b>factor</b>.</p><p>Pick an equation. Put more in each row until the array has the total.</p>",
    check: {
      kind: "num",
      q: "What number makes this true? 5 × ? = 35",
      fig: F.hops,
      answer: 7,
      misc: [
        [30, "That’s 35 − 5. What number times 5 is 35?"],
        [8, "5 × 8 = 40, not 35."],
      ],
      explain: "Count by 5s to 35: 5, 10, 15, 20, 25, 30, 35. That’s 7 fives, so 5 × 7 = 35 and 35 ÷ 5 = 7.",
    },
  },
  {
    title: "Fact families",
    widget: wFamily,
    body: "<p>An array of 3 rows of 5 shows 3 × 5 = 15. Turned, it’s 5 × 3 = 15. Split into 3 rows, 15 ÷ 3 = 5; split into 5 columns, 15 ÷ 5 = 3. These four facts are a <b>family</b>.</p><p>Change the rows and how many are in each row.</p>",
    check: {
      kind: "mc",
      q: "6 × 8 = 48. Which division equation is also true?",
      fig: F.array,
      choices: [
        { id: "a", label: "48 ÷ 8 = 6" },
        { id: "b", label: "8 ÷ 6 = 48" },
        { id: "c", label: "48 ÷ 6 = 6" },
      ],
      answer: "a",
      why: {
        b: "Division starts with the total, 48.",
        c: "6 × 6 = 36, not 48. 48 ÷ 6 = 8.",
      },
      explain: "6 × 8 = 48, so 48 ÷ 8 = 6 and 48 ÷ 6 = 8.",
    },
  },
];
