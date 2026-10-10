/* Learn Relating Multiplication to Division (Grade 3 Unit 4), chapter 4: Use products you know. Its widgets and steps; loaded
   by products-and-patterns.html. */
/* Divide by counting by the divisor on a number line, one hop at a time: the number of hops is the answer. */
const wHops = stepsWidget(
  [
    { label: "42 ÷ 6", n: 42, divisor: 6, steps: 7 },
    { label: "56 ÷ 7", n: 56, divisor: 7, steps: 8 },
    { label: "36 ÷ 4", n: 36, divisor: 4, steps: 9 },
  ],
  ({ n, divisor, steps }, made) => ({
    fig: hopLine(divisor, n, made, { mark: n }),
    text:
      (made
        ? `${range(made)
            .map((i) => divisor * (i + 1))
            .join(", ")}: ${pl(made, "hop")} of ${divisor}.`
        : `Count by ${divisor}s to ${n}. How many hops?`) +
      (made === steps
        ? `<br><span class="ok">${steps} hops of ${divisor} land on ${n}: ${steps} × ${divisor} = ${n}. So ${n} ÷ ${divisor} = <b>${steps}</b>.</span>`
        : ""),
  }),
  "Hop",
);
/* the patterns to look for in the table, picked with a row of buttons */
const PATTERNS = [
  ["turn", "Turnarounds"],
  ["odd", "Odd and even"],
  ["double", "Doubles"],
];
/* Tap squares in the multiplication table to see its patterns: a product's turnaround, which products are odd, and rows that
   are double other rows. */
function wTable(el) {
  /* tapped: [row, col] of the square tapped last (null before any tap) */
  const q = Q(el);
  let pattern = "turn",
    tapped = null;
  el.innerHTML = seg("Pattern", PATTERNS) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [row, col] = tapped || [0, 0],
      /* in Doubles, a square in the rows of 1 to 5 has a row twice as big */
      doubled = pattern === "double" && tapped && row <= 5;
    press(el, pattern);
    q("f").innerHTML = timesTable({
      tap: "cell",
      cls: (r, c) =>
        pattern === "odd"
          ? (r * c) % 2
            ? "b"
            : ""
          : r === row && c === col
            ? "a"
            : (pattern === "turn" && r === col && c === row) || (doubled && r === 2 * row && c === col)
              ? "b"
              : "",
    });
    q("r").innerHTML =
      pattern === "odd"
        ? "The odd products are blue. An even number times any number is even, so only an odd number times an odd number is odd." +
          (tapped ? `<br>${row} × ${col} = ${row * col}, ${(row * col) % 2 ? "odd" : "even"}.` : "")
        : !tapped
          ? "Tap a square in the table."
          : pattern === "turn"
            ? row === col
              ? `${row} × ${col} = ${row * col}. It’s on the diagonal, so it’s its own turnaround.`
              : `${row} × ${col} = ${row * col}, and its turnaround ${col} × ${row} = ${row * col} too. They’re mirror images across the diagonal.`
            : doubled
              ? `${row} × ${col} = ${row * col}. Double it: ${2 * row} × ${col} = ${2 * row * col}, since ${row * col} + ${row * col} = ${2 * row * col}.`
              : `Tap a square in the rows of 1 to 5. The row twice as big is double it.`;
  };
  el.addEventListener("click", (e) => {
    const square = e.target.closest("[data-v]");
    if (!square) return;
    tapped = square.dataset.v.split("-").map(Number);
    draw();
  });
  onPick(el, (id) => {
    pattern = id;
    tapped = null;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  array: arrayFig(8, 7, { band: "r" }),
};
const STEPS = [
  {
    title: "Divide with a product you know",
    widget: wHops,
    body: "<p>To find 42 ÷ 6, think: 6 times what is 42? Count by 6s until you reach 42. If you know 7 × 6 = 42, you know 42 ÷ 6 = 7.</p><p>Pick a division and hop until you land on the number.</p>",
    check: {
      kind: "num",
      q: "8 × 7 = 56. Use it to find 56 ÷ 8.",
      fig: F.array,
      answer: 7,
      misc: [
        [8, "56 ÷ 8 asks: 8 times what is 56?"],
        [48, "That’s 56 − 8. Division asks: 8 times what is 56?"],
      ],
      explain: "8 × 7 = 56, so 56 split into 8 equal rows has 7 in each: 56 ÷ 8 = 7.",
    },
  },
  {
    title: "Patterns in the multiplication table",
    widget: wTable,
    body: "<p>The multiplication table has a product for each pair of factors. Its patterns help you remember facts: 3 × 8 and 8 × 3 match, the 4s are double the 2s, and only odd times odd is odd.</p><p>Pick a pattern and tap squares in the table.</p>",
    check: {
      kind: "mc",
      q: "Which product is odd?",
      choices: [
        { id: "a", label: "5 × 7" },
        { id: "b", label: "4 × 7" },
        { id: "c", label: "5 × 6" },
      ],
      answer: "a",
      why: {
        b: "4 × 7 = 28. 4 is even, so the product is even.",
        c: "5 × 6 = 30. 6 is even, so the product is even.",
      },
      explain: "5 × 7 = 35. Both factors are odd, so the product is odd.",
    },
  },
];
