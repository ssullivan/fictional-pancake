/* Learn Proportional Relationships and Percentages (Grade 7 Unit 4), chapter 1: Rates with fractions. Its widgets and
   steps; loaded by fraction-rates.html. */
/* walks: [miles, hours] as fractions */
const WALKS = [
  [
    [3, 4],
    [1, 4],
  ],
  [
    [1, 2],
    [1, 3],
  ],
  [
    [2, 3],
    [1, 2],
  ],
];
/* Pick a walk: miles per hour is the miles divided by the hours, and dividing by a fraction multiplies by its reciprocal. */
function wRate(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Walk",
      WALKS.map(([miles, hours], i) => [i, `${ftx(miles)} mile in ${ftx(hours)} hour`]),
    ) + `<p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [miles, hours] = WALKS[index],
      rate = fDiv(miles, hours);
    press(el, index);
    q("e").innerHTML = `${fim(miles)} ÷ ${fim(hours)} = ${fim(miles)} × ${fim(fInv(hours))} = ${fim(rate)}`;
    q("r").innerHTML =
      `In ${fim(hours)} of an hour, ${fim(miles)} mile. A whole hour is ${fim(fInv(hours))} times as long, ` +
      `so the walker goes <b>${ftx(rate)} miles per hour</b>.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* Pick the pounds of grapes at $2.40 a pound: the cost is the price times the pounds. */
function wDecimal(el) {
  const q = Q(el),
    price = 2.4,
    weights = [1.5, 2.5, 4];
  el.innerHTML =
    seg(
      "Pounds",
      weights.map((w, i) => [i, `${w} pounds`]),
    ) + `<p class="readout" data-r></p>`;
  const draw = (index) => {
    const pounds = weights[index];
    press(el, index);
    q("r").innerHTML =
      `${money(price)} for each pound, so ${fmt(pounds)} pounds cost ${fmt(price)} × ${fmt(pounds)} = <b>${money(price * pounds)}</b>. ` +
      `The constant of proportionality is 2.40 dollars per pound, a decimal.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "Rates with fractions",
    widget: wRate,
    body: "<p>A rate per hour is the amount divided by the hours, even when the hours are a fraction. Dividing by a fraction is multiplying by its reciprocal: 3/4 mile in 1/4 hour is 3/4 × 4 = 3 miles per hour.</p><p>Pick a walk.</p>",
    check: {
      kind: "num",
      q: "Noah rows 1/2 mile in 1/4 of an hour, at a steady rate. How many miles per hour is that?",
      answer: 2,
      frac: true,
      unit: "miles per hour",
      misc: [
        [0.5, "That’s hours per mile. Divide the miles by the hours: 1/2 ÷ 1/4."],
        [0.125, "That multiplies. Divide the miles by the hours."],
      ],
      explain: "1/2 ÷ 1/4 = 1/2 × 4 = 2 miles per hour.",
    },
  },
  {
    title: "Say it with decimals",
    widget: wDecimal,
    body: "<p>A constant of proportionality can be a decimal too, like a price of $2.40 per pound. Multiply it by any amount to find the cost.</p><p>Pick the pounds.</p>",
    check: {
      kind: "num",
      q: "Cherries cost $3.20 per pound. How much do 2.5 pounds cost?",
      answer: 8,
      unit: "dollars",
      misc: [
        [5.7, "That adds. Each pound costs the same: multiply."],
        [1.28, "That divides. More pounds cost more: multiply."],
      ],
      explain: "3.20 × 2.5 = 8, so they cost $8.",
    },
  },
];
