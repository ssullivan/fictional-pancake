/* Learn Wrapping Up Multiplication and Division with Multi-digit Numbers (Grade 5 Unit 4), chapter 2: Partial products. Its
   widgets and steps; loaded by partial.html. */
/* products to split: [a, b] */
const SPLIT_PRODUCTS = [
  [234, 56],
  [305, 42],
  [128, 31],
];
/* Pick a product and fill in its area diagram one piece at a time (a stepper). */
function wArea(el) {
  const q = Q(el),
    values = { pieces: 0 },
    limits = { pieces: [0, 6] };
  let productIndex = 0;
  el.innerHTML =
    seg(
      "Product",
      SPLIT_PRODUCTS.map(([a, b], i) => [i, `${a} × ${b}`]),
    ) +
    `<div class="wrow">${stepper("pieces", "Pieces")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b] = SPLIT_PRODUCTS[productIndex],
      pairs = partialsOf(a, b),
      shown = values.pieces;
    press(el, productIndex);
    q("pieces").textContent = shown;
    q("f").innerHTML = areaModel(a, b, { filled: shown });
    if (shown === 0)
      q("r").innerHTML =
        `${a} is ${placeParts(a).join(" + ")} and ${b} is ${placeParts(b).join(" + ")}, so there are ${pairs.length} pieces. Tap + to fill them in.`;
    else if (shown < pairs.length) {
      const [col, row] = pairs[shown - 1];
      q("r").innerHTML = `${row} × ${col} = ${commas(col * row)}. ${pairs.length - shown} more to go.`;
    } else
      q("r").innerHTML =
        `All ${pairs.length} pieces: ${pairs.map(([col, row]) => commas(col * row)).join(" + ")} = <b>${commas(a * b)}</b>.`;
  };
  /* a new product: the stepper goes up to its number of pieces */
  const chooseProduct = (i) => {
    productIndex = i;
    limits.pieces[1] = partialsOf(...SPLIT_PRODUCTS[i]).length;
    values.pieces = 0;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    chooseProduct(+m);
    draw();
  });
  chooseProduct(productIndex);
  draw();
}
/* Write the partial products of 234 × 56 one under another (a stepper), then add them. */
function wRecord(el) {
  const q = Q(el),
    values = { rows: 0 },
    limits = { rows: [0, 6] };
  el.innerHTML = `<div class="wrow">${stepper("rows", "Partial products")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const shown = values.rows,
      pairs = partialsOf(234, 56);
    q("rows").textContent = shown;
    q("f").innerHTML = partialFig(234, 56, shown);
    q("r").innerHTML =
      shown === pairs.length
        ? `Add all 6: <b>234 × 56 = 13,104</b>. Each row says which places it multiplies.`
        : shown
          ? `${pairs[shown - 1][1]} × ${pairs[shown - 1][0]} = ${commas(pairs[shown - 1][0] * pairs[shown - 1][1])}. ${pairs.length - shown} more to go.`
          : "Each part of 56 times each part of 234: 6 partial products. Tap + to write them.";
  };
  steppers(el, values, limits, draw);
  draw();
}
const STEPS = [
  {
    title: "Split both numbers by place",
    widget: wArea,
    body: "<p>To multiply a 3-digit number by a 2-digit number, split each one by place value. An area diagram has a piece for every part of one number times every part of the other: 3 × 2 = 6 pieces. Add the <b>partial products</b> to get the product.</p><p>Pick a product, then fill in the pieces.</p>",
    check: {
      kind: "num",
      q: "Use partial products to find 213 × 32.",
      fig: areaModel(213, 32, { filled: 0 }),
      answer: 6816,
      unit: "",
      misc: [
        [6390, "That’s only 213 × 30. Add 213 × 2 too."],
        [245, "That adds. Multiply every part of 213 by every part of 32."],
      ],
      explain: "6,000 + 300 + 90 + 400 + 20 + 6 = 6,816.",
    },
  },
  {
    title: "Record the partial products",
    widget: wRecord,
    body: "<p>You can write partial products without the diagram: one under another, each with the places it multiplies, then add them. It’s the same work as the area diagram.</p><p>Write them one at a time.</p>",
    check: {
      kind: "mc",
      q: "Which partial products add up to 124 × 23?",
      answer: "a",
      choices: [
        { id: "a", label: "2,000 + 400 + 80 + 300 + 60 + 12" },
        { id: "b", label: "2,000 + 60 + 12" },
        { id: "c", label: "200 + 40 + 8 + 300 + 60 + 12" },
      ],
      why: {
        b: "That multiplies each place by only one place. Every part of 124 gets multiplied by 20 and by 3.",
        c: "The first one is 100 × 20 = 2,000. Count the zeros: 20 is 2 tens.",
      },
      explain: "2,000 + 400 + 80 + 300 + 60 + 12 = 2,852, and 124 × 23 = 2,852.",
    },
  },
];
