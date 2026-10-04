/* Learn Multiplying and Dividing Multi-digit Numbers (Grade 4 Unit 6), chapter 3: Multiply two two-digit numbers. Its widgets and steps; loaded by two-digit.html. */
/* products of two two-digit numbers: [a, b] */
const PAIRS = [
  [36, 27],
  [45, 32],
  [18, 16],
];
/* each of a × b's partial products as words: "20 × 30 = 600" */
const partialWords = (a, b) =>
  placeParts(b).flatMap((rowPart) =>
    placeParts(a).map((colPart) => `${rowPart} × ${colPart} = ${commas(rowPart * colPart)}`),
  );
/* Pick a product and fill in its area diagram one piece at a time (a stepper). show: 'area' draws the area diagram, and
   'record' the partial products written one under another. */
const wFour = (show) => (el) => {
  /* the stepper's value: filled, how many partial products are found */
  const q = Q(el),
    values = { filled: 0 },
    limits = { filled: [0, 4] };
  let pairIndex = 0;
  el.innerHTML =
    seg(
      "Product",
      PAIRS.map(([a, b], i) => [i, `${a} × ${b}`]),
    ) +
    `<div class="wrow">${stepper("filled", "Partial products")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b] = PAIRS[pairIndex],
      filled = values.filled,
      words = partialWords(a, b);
    press(el, pairIndex);
    q("filled").textContent = filled;
    q("f").innerHTML = show === "area" ? areaModel(a, b, { filled }) : partialFig(a, b, filled);
    q("r").innerHTML =
      filled === 0
        ? `${a} is ${placeParts(a).join(" + ")} and ${b} is ${placeParts(b).join(" + ")}, so there are 4 partial products. Tap + to find them.`
        : filled < 4
          ? `${words[filled - 1]}.`
          : `${words.join(", ")}. Add them: ${partialsSum(a, b)} = <b>${commas(a * b)}</b>.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    pairIndex = +m;
    values.filled = 0;
    draw();
  });
  draw();
};
/* the partial products of a × b added: "600 + 120 + 210 + 42" */
const partialsSum = (a, b) =>
  placeParts(b)
    .flatMap((rowPart) => placeParts(a).map((colPart) => commas(rowPart * colPart)))
    .join(" + ");
const STEPS = [
  {
    title: "Four partial products",
    widget: wFour("area"),
    body: "<p>When both numbers have two digits, split both: 36 × 27 is (30 + 6) × (20 + 7). The area diagram has 4 pieces, so there are 4 partial products: tens × tens, tens × ones, ones × tens, and ones × ones.</p><p>Pick a product, then fill in its pieces.</p>",
    check: {
      kind: "num",
      q: "What is 24 × 13?",
      answer: 312,
      misc: [
        [212, "That’s only 20 × 10 and 4 × 3. There are 4 partial products: 200, 40, 60, and 12."],
        [37, "That adds 24 + 13. Multiply: split both numbers into tens and ones."],
      ],
      explain: "10 × 20 = 200, 10 × 4 = 40, 3 × 20 = 60, and 3 × 4 = 12. 200 + 40 + 60 + 12 = 312.",
    },
  },
  {
    title: "Record the four partial products",
    widget: wFour("record"),
    body: "<p>Write the 4 partial products one under another, each with the places it multiplies, then add them. It’s the area diagram without the drawing.</p><p>Pick a product, then write its partial products one at a time.</p>",
    check: {
      kind: "mc",
      q: "Which partial products add up to 46 × 23?",
      choices: [
        { id: "a", label: "800 + 120 + 120 + 18" },
        { id: "b", label: "800 + 18" },
        { id: "c", label: "80 + 12 + 12 + 18" },
      ],
      answer: "a",
      why: {
        b: "That’s only tens × tens and ones × ones. 20 × 6 and 3 × 40 are partial products too.",
        c: "That uses 4 and 2 instead of 40 and 20. The tens digits stand for tens.",
      },
      explain: "20 × 40 = 800, 20 × 6 = 120, 3 × 40 = 120, and 3 × 6 = 18. Together they make 1,058.",
    },
  },
];
