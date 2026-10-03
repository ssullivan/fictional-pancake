/* Learn Introducing Multiplication (Grade 3 Unit 1), chapter 8: Turn it around. Its widgets and steps; loaded by commutative.html. */
/* the arrays to turn: [rows, in each row] */
const TA = [
  [3, 5],
  [2, 7],
  [4, 6],
];
/* Turn an array a quarter turn: the rows become the columns, and the product stays the same. */
function wTurn(el) {
  const q = Q(el);
  let arrayIndex = 0,
    turned = false;
  el.innerHTML =
    seg(
      "Array",
      TA.map(([rows, cols], i) => [i, `${rows} × ${cols}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-o></p>`;
  const draw = () => {
    /* shownRows and shownCols: the array as drawn, swapped when it's turned */
    const [rows, cols] = TA[arrayIndex],
      shownRows = turned ? cols : rows,
      shownCols = turned ? rows : cols;
    press(el, arrayIndex);
    q("go").textContent = turned ? "Turn it back" : "Turn it";
    q("f").innerHTML = arrayFig(shownRows, shownCols, { band: "r" });
    q("o").innerHTML =
      `${pl(shownRows, "row")} of ${shownCols}: <b>${shownRows} × ${shownCols} = ${rows * cols}</b>.` +
      (turned
        ? `<br><span class="ok">Same counters, just turned. So ${rows} × ${cols} = ${cols} × ${rows}.</span>`
        : '<br><span class="dimline">Turn the array and see what changes.</span>');
  };
  q("go").onclick = () => {
    turned = !turned;
    draw();
  };
  el.addEventListener("click", (e) => {
    const arrayBtn = e.target.closest("[data-m]");
    if (arrayBtn) {
      arrayIndex = +arrayBtn.dataset.m;
      turned = false;
      draw();
    }
  });
  draw();
}
/* the pairs of factors to hop both ways */
const TF = [
  [2, 9],
  [5, 8],
  [3, 7],
];
/* Hop a × b both ways on a number line: both land on the same number. */
function wFact(el) {
  /* way: 0 for b hops of a, 1 for a hops of b */
  const q = Q(el);
  let pairIndex = 0,
    way = 0;
  el.innerHTML = `<div data-top>${seg(
    "Factors",
    TF.map(([a, b], i) => [i, `${a} and ${b}`]),
  )}</div><div data-bot></div><div class="fig" data-f></div><p class="readout" data-o></p>`;
  const draw = () => {
    const [a, b] = TF[pairIndex],
      [hops, hopSize] = way ? [a, b] : [b, a];
    q("bot").innerHTML = seg("Which hops", [
      [0, `${b} hops of ${a}`],
      [1, `${a} hops of ${b}`],
    ]);
    press(q("top"), pairIndex);
    press(q("bot"), way);
    q("f").innerHTML = hopLine(hopSize, a * b + Math.max(a, b), hops);
    q("o").innerHTML =
      `${hops} hops of ${hopSize}: <b>${hops} × ${hopSize} = ${a * b}</b>.<br><span class="dimline">${b} × ${a} and ${a} × ${b} land on the same number, so if you know one, you know the other.</span>`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") pairIndex = +id;
    else way = +id;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Turn the array",
    widget: wTurn,
    body: "<p>Turn an array a quarter turn, and its rows become columns. It has the same number of counters, so the product stays the same: <b>3 × 5 = 5 × 3</b>. You can multiply factors in any order. This is the <b>commutative property</b>.</p><p>Pick an array, then turn it.</p>",
    check: {
      kind: "mc",
      q: "Andre knows 6 × 4 = 24. Which equation is also true?",
      choices: [
        { id: "a", label: "4 × 6 = 24" },
        { id: "b", label: "4 × 6 = 10" },
        { id: "c", label: "4 × 6 = 46" },
      ],
      answer: "a",
      why: {
        b: "4 + 6 = 10, but 4 × 6 is 4 groups of 6.",
        c: "Turning the factors around doesn’t turn the product around. It’s still 24.",
      },
      explain: "The factors can go in any order, so 4 × 6 = 6 × 4 = 24.",
    },
  },
  {
    title: "Use a fact you know",
    widget: wFact,
    body: "<p>If you know one fact, you know its turnaround too. 9 hops of 2 and 2 hops of 9 both land on 18.</p><p>Pick two factors, then try the hops both ways.</p>",
    check: {
      kind: "num",
      q: "Priya knows 5 × 8 = 40. What is 8 × 5?",
      answer: 40,
      misc: [
        [13, "That’s 8 + 5. Multiply: 8 groups of 5."],
        [35, "That’s 7 × 5. 8 × 5 is one more 5."],
        [85, "Turning the factors around doesn’t change the product."],
      ],
      explain: "8 × 5 is the turnaround of 5 × 8, so it’s 40 too.",
    },
  },
];
