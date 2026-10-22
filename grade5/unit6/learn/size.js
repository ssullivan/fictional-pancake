/* Learn More Decimal and Fraction Operations (Grade 5 Unit 6), chapter 6: The size of products. Its widgets and steps; loaded
   by size.html. */
/* fractions to multiply 12 by: [n, d] */
const FACTORS = [
  [1, 2],
  [3, 4],
  [4, 4],
  [5, 4],
  [3, 2],
];
/* Pick a fraction and compare it × 12 with 12, on two tapes. */
function wScale(el) {
  const q = Q(el);
  let factorIndex = 1;
  el.innerHTML =
    seg(
      "Times",
      FACTORS.map(([n, d], i) => [i, `${n}/${d} × 12`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [n, d] = FACTORS[factorIndex],
      product = (n * 12) / d,
      size = n < d ? "less than 1" : n === d ? "equal to 1" : "more than 1",
      compared = n < d ? "less than" : n === d ? "equal to" : "more than";
    press(el, factorIndex);
    q("f").innerHTML = tapes(
      [
        { label: "12", n: 12, show: 12 },
        { label: `${n}/${d} × 12`, n: product, show: product },
      ],
      { label: `12 and ${n}/${d} × 12` },
    );
    q("r").innerHTML = `${fr(n, d)} is ${size}, so <b>${fr(n, d)} × 12 is ${compared} 12</b>: it’s ${product}.`;
  };
  onPick(el, (m) => {
    factorIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "More, less, or the same?",
    widget: wScale,
    body: "<p>You can tell the size of a product without multiplying. Multiplying by a fraction <b>less than 1</b> gives less than you started with. Multiplying by <b>1</b> (like 4/4) gives the same. Multiplying by more than 1 gives more.</p><p>Pick a fraction to multiply 12 by.</p>",
    check: {
      kind: "mc",
      q: "Without multiplying: is 7/8 × 20 more than, less than, or equal to 20?",
      answer: "a",
      choices: [
        { id: "a", label: "Less than 20" },
        { id: "b", label: "Equal to 20" },
        { id: "c", label: "More than 20" },
      ],
      why: {
        b: "It would be equal only if you multiplied by 1. 7/8 is less than 1.",
        c: "Multiplying makes a number bigger only when you multiply by more than 1. 7/8 is less than 1.",
      },
      explain: "7/8 is less than 1, so 7/8 × 20 is less than 20 (it’s 17 1/2).",
    },
  },
];
