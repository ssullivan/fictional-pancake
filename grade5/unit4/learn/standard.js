/* Learn Wrapping Up Multiplication and Division with Multi-digit Numbers (Grade 5 Unit 4), chapter 3: The standard
   algorithm. Its widgets and steps; loaded by standard.html. */
/* products to work a column at a time: [a, b], b one digit */
const ONE_DIGIT = [
  [1236, 4],
  [2047, 3],
  [3415, 6],
];
/* the place a column's carry goes to, by column: "tens" for column 0 */
const NEXT_PLACE = ["tens", "hundreds", "thousands", "ten-thousands"];
/* Pick a product and work it one column at a time (a stepper). */
function wColumns(el) {
  const q = Q(el),
    values = { done: 0 },
    limits = { done: [0, 4] };
  let productIndex = 0;
  el.innerHTML =
    seg(
      "Product",
      ONE_DIGIT.map(([a, b], i) => [i, `${commas(a)} × ${b}`]),
    ) +
    `<div class="wrow">${stepper("done", "Columns")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b] = ONE_DIGIT[productIndex],
      steps = mulSteps(a, b),
      done = values.done;
    press(el, productIndex);
    q("done").textContent = done;
    q("f").innerHTML = mulFig(a, b, done);
    if (done === 0) {
      q("r").innerHTML = `Start with the ones: ${steps[0].top} × ${b}. Tap + to work each column.`;
      return;
    }
    const step = steps[done - 1],
      last = done === steps.length,
      work = `${step.top} × ${b}${step.cin ? ` + ${step.cin} carried = ${step.top * b} + ${step.cin}` : ""} = ${step.val}`;
    q("r").innerHTML = last
      ? `${work}. It’s the last column, so write all of ${step.val}. <b>${commas(a)} × ${b} = ${commas(a * b)}</b>.`
      : step.carry
        ? `${work}. Write ${step.digit} and carry ${step.carry} to the ${NEXT_PLACE[step.i]} column.`
        : `${work}. Write ${step.digit}. Nothing to carry.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    productIndex = +m;
    values.done = 0;
    draw();
  });
  draw();
}
/* products with a two-digit factor: [a, b] */
const TWO_DIGIT = [
  [347, 26],
  [128, 34],
  [205, 43],
];
/* Pick a product and write its rows one at a time (a stepper): a × the ones, a × the tens, and the sum. */
function wRows(el) {
  const q = Q(el),
    values = { rows: 0 },
    limits = { rows: [0, 3] };
  let productIndex = 0;
  el.innerHTML =
    seg(
      "Product",
      TWO_DIGIT.map(([a, b], i) => [i, `${a} × ${b}`]),
    ) +
    `<div class="wrow">${stepper("rows", "Rows")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b] = TWO_DIGIT[productIndex],
      [onesRow, tensRow, product] = mul2Steps(a, b),
      tens = Math.floor(b / 10) * 10,
      ones = b % 10,
      rows = values.rows;
    press(el, productIndex);
    q("rows").textContent = rows;
    q("f").innerHTML = mul2Fig(a, b, rows);
    q("r").innerHTML = [
      `First multiply ${a} by the ${ones} ones, then by the ${tens / 10} tens. Tap + to write each row.`,
      `${a} × ${ones} = ${commas(onesRow)}.`,
      `${a} × ${tens} = ${commas(tensRow)}. It ends in 0, since the ${tens / 10} is ${tens / 10} tens.`,
      `Add the rows: ${commas(onesRow)} + ${commas(tensRow)} = <b>${commas(product)}</b>.`,
    ][rows];
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    productIndex = +m;
    values.rows = 0;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Multiply by a one-digit number",
    widget: wColumns,
    body: "<p>The <b>standard algorithm</b> multiplies one place at a time, starting with the ones. When a column makes 10 or more, write its ones digit and carry the rest to the next column, where it’s added after multiplying.</p><p>Pick a product, then work it one column at a time.</p>",
    check: {
      kind: "num",
      q: "Use the standard algorithm: what is 1,342 × 4?",
      answer: 5368,
      unit: "",
      misc: [
        [4268, "That leaves out the carries. 4 × 4 = 16: write 6 and carry 1 to the hundreds."],
        [1346, "That adds 4. Multiply each digit of 1,342 by 4."],
      ],
      explain:
        "2 × 4 = 8. 4 × 4 = 16: write 6, carry 1. 3 × 4 + 1 = 13: write 3, carry 1. 1 × 4 + 1 = 5. So 1,342 × 4 = 5,368.",
    },
  },
  {
    title: "Multiply by a two-digit number",
    widget: wRows,
    body: "<p>To multiply by a two-digit number, multiply by its ones digit for the first row, then by its tens digit for the second row. The second row ends in 0, because it’s tens. Then add the two rows.</p><p>Pick a product, then write the rows.</p>",
    check: {
      kind: "num",
      q: "Use the standard algorithm: what is 214 × 23?",
      fig: mul2Fig(214, 23, 0),
      answer: 4922,
      unit: "",
      misc: [
        [1070, "That leaves out the 0 in the second row. It’s 214 × 20 = 4,280."],
        [642, "That’s only 214 × 3. Add 214 × 20 = 4,280."],
      ],
      explain: "214 × 3 = 642, and 214 × 20 = 4,280. 642 + 4,280 = 4,922.",
    },
  },
];
