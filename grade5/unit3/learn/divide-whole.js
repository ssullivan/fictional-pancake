/* Learn Multiplying and Dividing Fractions (Grade 5 Unit 3), chapter 4: How many fit? Its widgets and steps; loaded by
   divide-whole.html. */
/* the unit fractions to fit: denominators */
const FIT_DEN = [2, 3, 4, 5];
/* Pick a unit fraction and step the wholes: count how many of the unit fraction fit in them. */
function wFit(el) {
  const q = Q(el),
    values = { wholes: 3 },
    limits = { wholes: [1, 4] };
  let unit = 4;
  el.innerHTML =
    seg(
      "Pieces of",
      FIT_DEN.map((d) => [d, `1/${d}`]),
    ) +
    `<div class="wrow">${stepper("wholes", "Wholes")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const wholes = values.wholes;
    press(el, unit);
    q("wholes").textContent = wholes;
    q("f").innerHTML = divWholeFig(wholes, unit);
    q("r").innerHTML =
      `Each whole holds ${unit} pieces of ${fr(1, unit)}, so ${wholes} ${wholes === 1 ? "whole holds" : "wholes hold"} ${wholes} × ${unit} = ${wholes * unit}: ` +
      `<b>${wholes} ÷ ${fr(1, unit)} = ${wholes * unit}</b>.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    unit = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Count how many fit",
    widget: wFit,
    body: "<p>3 ÷ 1/4 asks: how many fourths fit in 3? Each whole holds 4 fourths, so 3 wholes hold 3 × 4 = 12. <b>3 ÷ 1/4 = 12</b>. Dividing by a unit fraction gives more than you started with.</p><p>Pick a unit fraction and change the wholes.</p>",
    check: {
      kind: "num",
      q: "A watering can holds 5 liters. How many 1/3-liter scoops fill it?",
      fig: divWholeFig(5, 3),
      answer: 15,
      unit: "scoops",
      misc: [
        [5 / 3, "That’s 5 × 1/3. Count how many thirds fit in 5: each liter holds 3."],
        [8, "That adds. Each of the 5 liters holds 3 scoops: multiply."],
      ],
      explain: "Each liter holds 3 scoops of 1/3 liter, so 5 liters hold 5 × 3 = 15. 5 ÷ 1/3 = 15 scoops.",
    },
  },
];
