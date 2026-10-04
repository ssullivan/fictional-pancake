/* Learn Putting It All Together (Grade 4 Unit 9), chapter 2: Whole-number operations. Its widgets and steps; loaded by operations.html. */
/* problems to work in columns: [op, a, b] */
const COLUMN_PROBLEMS = [
  ["+", 4625, 2318],
  ["−", 7005, 2348],
  ["×", 1305, 4],
];
/* Pick a problem and work it one column at a time (a stepper). */
function wColumns(el) {
  /* the stepper's value: done, how many columns are worked */
  const q = Q(el),
    values = { done: 0 },
    limits = { done: [0, 4] };
  let problemIndex = 0;
  el.innerHTML =
    seg(
      "Problem",
      COLUMN_PROBLEMS.map(([op, a, b], i) => [i, `${commas(a)} ${op} ${commas(b)}`]),
    ) +
    `<div class="wrow">${stepper("done", "Columns")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [op, a, b] = COLUMN_PROBLEMS[problemIndex],
      done = values.done,
      answer = op === "+" ? a + b : op === "−" ? a - b : a * b;
    press(el, problemIndex);
    q("done").textContent = done;
    q("f").innerHTML = op === "×" ? mulFig(a, b, done) : algFig(a, b, op === "+" ? "+" : "-", done);
    q("r").innerHTML =
      done === 0
        ? `Start with the ones column. Tap + to work one column at a time.`
        : done < 4
          ? `${done} column${done > 1 ? "s" : ""} worked. ${op === "+" ? "Carry a 1 when a column makes 10 or more." : op === "−" ? "Trade from the next place when the top digit is too small, even across zeros." : "Carry the tens of each product to the next column."}`
          : `All 4 columns worked: <b>${commas(a)} ${op} ${commas(b)} = ${commas(answer)}</b>.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    problemIndex = +m;
    values.done = 0;
    draw();
  });
  draw();
}
/* divisions by partial quotients: [n, divisor, chunks] */
const DIVISIONS = [
  [896, 7, [100, 20, 8]],
  [1236, 4, [300, 9]],
  [2565, 5, [500, 13]],
];
/* Pick a division and take away one chunk at a time (a stepper). */
function wDivide(el) {
  /* the stepper's value: shown, how many chunks are taken away */
  const q = Q(el),
    values = { shown: 0 },
    limits = { shown: [0, 3] };
  let divisionIndex = 0;
  el.innerHTML =
    seg(
      "Division",
      DIVISIONS.map(([n, d], i) => [i, `${commas(n)} ÷ ${d}`]),
    ) +
    `<div class="wrow">${stepper("shown", "Chunks")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [n, divisor, chunks] = DIVISIONS[divisionIndex],
      shown = values.shown;
    press(el, divisionIndex);
    q("shown").textContent = shown;
    q("f").innerHTML = quotientFig(n, divisor, chunks, shown);
    q("r").innerHTML =
      shown === 0
        ? `How many groups of ${divisor} are in ${commas(n)}? Take away big chunks first.`
        : shown < chunks.length
          ? `${chunks[shown - 1]} groups of ${divisor} is ${commas(chunks[shown - 1] * divisor)}. Keep going with what’s left.`
          : `Add the chunks: ${chunks.join(" + ")} = <b>${n / divisor}</b>. So ${commas(n)} ÷ ${divisor} = ${n / divisor}.`;
  };
  /* a new division: the stepper goes up to its number of chunks */
  const chooseDivision = (i) => {
    divisionIndex = i;
    limits.shown[1] = DIVISIONS[i][2].length;
    values.shown = 0;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    chooseDivision(+m);
    draw();
  });
  chooseDivision(divisionIndex);
  draw();
}
const STEPS = [
  {
    title: "The standard algorithms",
    widget: wColumns,
    body: "<p>The standard algorithms work one place at a time, starting with the ones. Adding carries a ten to the next place, subtracting trades from the next place (even across zeros), and multiplying by one digit carries the tens of each product.</p><p>Pick a problem and work it one column at a time.</p>",
    check: {
      kind: "num",
      q: "What is 7,005 − 2,348?",
      answer: 4657,
      misc: [
        [
          5343,
          "That takes the smaller digit from the bigger one in each column. Trade across the zeros: 7,005 is 6 thousands, 9 hundreds, 9 tens, and 15 ones.",
        ],
        [9353, "That adds. Subtract: 7,005 − 2,348."],
      ],
      explain:
        "Trade 1 thousand across the zeros: 6 thousands, 9 hundreds, 9 tens, 15 ones. 15 − 8 = 7, 9 − 4 = 5, 9 − 3 = 6, 6 − 2 = 4: 4,657.",
    },
  },
  {
    title: "Divide with partial quotients",
    widget: wDivide,
    body: "<p>To divide a big number, take away easy chunks of groups (100 groups, 10 groups, …) until nothing is left. The quotient is all the groups added up. A 0 in the quotient means a place with no chunk.</p><p>Pick a division, then take away one chunk at a time.</p>",
    check: {
      kind: "num",
      q: "What is 1,236 ÷ 4?",
      answer: 309,
      misc: [
        [39, "That leaves out the 0 in the tens place. The chunks are 300 and 9: 300 + 9 = 309."],
        [4944, "That multiplies. Divide: how many groups of 4 are in 1,236?"],
      ],
      explain: "300 × 4 = 1,200, and 1,236 − 1,200 = 36. 9 × 4 = 36. 300 + 9 = 309.",
    },
  },
];
