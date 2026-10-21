/* Learn Wrapping Up Multiplication and Division with Multi-digit Numbers (Grade 5 Unit 4), chapter 1: Estimate products.
   Its widgets and steps; loaded by estimate.html. */
/* products to estimate: [a, b] */
const TO_ESTIMATE = [
  [389, 21],
  [612, 39],
  [745, 52],
];
/* Pick a product: round each number, multiply the friendly numbers, and compare with the exact product. */
function wEstimate(el) {
  const q = Q(el);
  let productIndex = 0;
  el.innerHTML =
    seg(
      "Product",
      TO_ESTIMATE.map(([a, b], i) => [i, `${a} × ${b}`]),
    ) + `<p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b] = TO_ESTIMATE[productIndex],
      roundA = roundTo(a, 100),
      roundB = roundTo(b, 10),
      estimate = roundA * roundB;
    press(el, productIndex);
    q("e").innerHTML = `${a} × ${b} ≈ ${roundA} × ${roundB} = ${commas(estimate)}`;
    q("r").innerHTML =
      `${a} rounds to ${roundA} and ${b} to ${roundB}. ${roundA / 100} × ${roundB / 10} = ${(roundA / 100) * (roundB / 10)}, and the zeros make it <b>${commas(estimate)}</b>. ` +
      `The exact product is ${commas(a * b)}: close to the estimate, so an answer near ${commas(estimate)} is reasonable.`;
  };
  onPick(el, (m) => {
    productIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Round, then multiply",
    widget: wEstimate,
    body: "<p>To estimate a product, round each number to a friendly number, like the nearest hundred or ten, and multiply those. Multiply the digits that aren’t zero, then write all the zeros. An estimate tells you about how big the answer should be.</p><p>Pick a product.</p>",
    check: {
      kind: "mc",
      q: "Which is the best estimate for 412 × 28?",
      answer: "b",
      choices: [
        { id: "a", label: "1,200" },
        { id: "b", label: "12,000" },
        { id: "c", label: "120,000" },
      ],
      why: {
        a: "That’s missing a zero. 400 × 30: 4 × 3 = 12, then 3 zeros.",
        c: "That has a zero too many. 400 has 2 zeros and 30 has 1: 3 in all.",
      },
      explain: "412 is about 400 and 28 is about 30. 400 × 30 = 12,000.",
    },
  },
];
