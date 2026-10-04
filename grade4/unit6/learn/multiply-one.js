/* Learn Multiplying and Dividing Multi-digit Numbers (Grade 4 Unit 6), chapter 2: Multiply by a one-digit number. Its widgets and steps; loaded by multiply-one.html. */
/* the numbers to multiply */
const NUMBERS = [23, 47, 236, 1205];
/* Pick a number and what to multiply it by (a stepper): the area diagram splits it by place, and the parts add up. */
function wArea(el) {
  /* the stepper's value: by, the one-digit number to multiply by */
  const q = Q(el),
    values = { by: 6 },
    limits = { by: [2, 9] };
  let numberIndex = 0;
  el.innerHTML =
    seg(
      "Number",
      NUMBERS.map((n, i) => [i, commas(n)]),
    ) +
    `<div class="wrow">${stepper("by", "Times")}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const n = NUMBERS[numberIndex],
      by = values.by,
      parts = placeParts(n);
    press(el, numberIndex);
    q("by").textContent = by;
    q("f").innerHTML = areaModel(n, by);
    q("e").innerHTML =
      `${by} × ${commas(n)} = ${parts.map((part) => commas(by * part)).join(" + ")} = ${commas(by * n)}`;
    q("r").innerHTML =
      `${commas(n)} is ${parts.map(commas).join(" + ")}. Multiply each part by ${by}, then add the <b>partial products</b>: <b>${commas(by * n)}</b>.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    numberIndex = +m;
    draw();
  });
  draw();
}
/* products to record as partial products: [a, b] */
const RECORD = [
  [2145, 3],
  [316, 4],
  [87, 6],
];
/* Pick a product and write its partial products one at a time (a stepper), then add them. */
function wPartial(el) {
  /* the stepper's value: shown, how many partial products are written */
  const q = Q(el),
    values = { shown: 0 },
    limits = { shown: [0, 4] };
  let recordIndex = 0;
  el.innerHTML =
    seg(
      "Product",
      RECORD.map(([a, b], i) => [i, `${commas(a)} × ${b}`]),
    ) +
    `<div class="wrow">${stepper("shown", "Partial products")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b] = RECORD[recordIndex],
      parts = placeParts(a),
      shown = values.shown;
    press(el, recordIndex);
    q("shown").textContent = shown;
    q("f").innerHTML = partialFig(a, b, shown);
    q("r").innerHTML =
      shown === 0
        ? `${commas(a)} has ${parts.length} nonzero places: ${parts.map(commas).join(", ")}. Tap + to write ${b} × each one.`
        : shown < parts.length
          ? `${b} × ${commas(parts[shown - 1])} = ${commas(b * parts[shown - 1])}. ${parts.length - shown} more to go.`
          : `All ${parts.length} partial products are written. Their sum is <b>${commas(a * b)}</b>, so ${commas(a)} × ${b} = ${commas(a * b)}.`;
  };
  /* a new product: the stepper goes up to its number of partial products */
  const chooseRecord = (i) => {
    recordIndex = i;
    limits.shown[1] = placeParts(RECORD[i][0]).length;
    values.shown = Math.min(values.shown, limits.shown[1]);
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    chooseRecord(+m);
    draw();
  });
  chooseRecord(recordIndex);
  draw();
}
const STEPS = [
  {
    title: "Multiply on an area diagram",
    widget: wArea,
    body: "<p>To multiply a big number by a one-digit number, split the big number into its places: 236 is 200 + 30 + 6. On an area diagram, each place is a piece of the rectangle. Multiply each piece, then add the <b>partial products</b>.</p><p>Pick a number and change what you multiply it by.</p>",
    check: {
      kind: "num",
      q: "What is 6 × 34?",
      answer: 204,
      misc: [
        [184, "That multiplies only the 30: 6 × 30 = 180. Multiply the 4 too: 6 × 4 = 24."],
        [1824, "That writes 18 and 24 side by side. 6 × 30 = 180 and 6 × 4 = 24: add them."],
      ],
      explain: "34 is 30 + 4. 6 × 30 = 180 and 6 × 4 = 24. 180 + 24 = 204.",
    },
  },
  {
    title: "Record the partial products",
    widget: wPartial,
    body: "<p>You can write the partial products one under another without drawing the rectangle: multiply the one-digit number by each place, then add. Line up the places so the ones, tens, hundreds, and thousands add up right.</p><p>Pick a product, then write its partial products one at a time.</p>",
    check: {
      kind: "num",
      q: "What is 3 × 2,145?",
      answer: 6435,
      misc: [
        [6420, "That leaves out 3 × 5 = 15. There are 4 partial products: 6,000, 300, 120, and 15."],
        [2148, "That adds 3. Multiply each place of 2,145 by 3."],
      ],
      explain: "3 × 2,000 = 6,000, 3 × 100 = 300, 3 × 40 = 120, and 3 × 5 = 15. 6,000 + 300 + 120 + 15 = 6,435.",
    },
  },
];
