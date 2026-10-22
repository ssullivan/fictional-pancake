/* Learn More Decimal and Fraction Operations (Grade 5 Unit 6), chapter 3: Yards, feet, and inches. Its widgets and steps;
   loaded by customary.html. */
/* customary conversions: [button, big, the big unit for 1, small, how many small in one big] */
const CUSTOMARY = [
  ["Yards to feet", "yards", "yard", "feet", 3],
  ["Feet to inches", "feet", "foot", "inches", 12],
  ["Yards to inches", "yards", "yard", "inches", 36],
];
/* Pick a conversion and step the amount: multiply by how many small units are in one big one. */
function wCustomary(el) {
  const q = Q(el),
    values = { amount: 4 },
    limits = { amount: [1, 9] };
  let conversionIndex = 0;
  el.innerHTML =
    seg(
      "Change",
      CUSTOMARY.map(([button], i) => [i, button]),
    ) + `<div class="wrow">${stepper("amount", "Amount")}</div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const [, big, oneBig, small, per] = CUSTOMARY[conversionIndex],
      amount = values.amount;
    press(el, conversionIndex);
    q("amount").textContent = amount;
    q("e").innerHTML = `${amount} ${amount === 1 ? oneBig : big} = ${amount * per} ${small}`;
    q("r").innerHTML = `1 ${oneBig} = ${per} ${small}, so <b>${amount} × ${per} = ${amount * per}</b>.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    conversionIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Change to a smaller unit",
    widget: wCustomary,
    body: "<p>1 yard = 3 feet, and 1 foot = 12 inches, so 1 yard = 36 inches. These aren’t powers of 10, but the idea is the same: to change to a smaller unit, multiply. A length like 5 feet 4 inches is 5 × 12 + 4 inches.</p><p>Pick a conversion and change the amount.</p>",
    check: {
      kind: "num",
      q: "A tent pole is 5 feet 4 inches long. How many inches is that?",
      answer: 64,
      unit: "inches",
      misc: [
        [54, "That writes the feet and inches side by side. Each foot is 12 inches: 5 × 12 first."],
        [9, "That adds the feet as inches. Each foot is 12 inches."],
      ],
      explain: "5 × 12 = 60, and 60 + 4 = 64 inches.",
    },
  },
];
