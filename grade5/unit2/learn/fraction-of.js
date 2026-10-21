/* Learn Fractions as Quotients and Fraction Multiplication (Grade 5 Unit 2), chapter 3: A fraction of a number. Its widgets
   and steps; loaded by fraction-of.html. */
/* the denominators that split 12 evenly */
const TWELVE_PARTS = [2, 3, 4, 6];
/* Take a unit fraction of 12: split a tape of 12 into equal parts (pick how many). */
function wUnitOf(el) {
  const q = Q(el);
  let parts = 4;
  el.innerHTML =
    seg(
      "Fraction",
      TWELVE_PARTS.map((d) => [d, `1/${d}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    press(el, parts);
    q("f").innerHTML = ofTape(12, parts, 1, true);
    q("r").innerHTML =
      `Split 12 into ${parts} equal parts: each part is 12 ÷ ${parts} = ${12 / parts}. <b>${fr(1, parts)} × 12 = 12 ÷ ${parts} = ${12 / parts}</b>.`;
  };
  onPick(el, (m) => {
    parts = +m;
    draw();
  });
  draw();
}
/* Take any fraction of 12: pick the parts, then how many of them to take (a stepper). */
function wSomeOf(el) {
  const q = Q(el),
    values = { take: 3 },
    limits = { take: [1, 3] };
  let parts = 4;
  el.innerHTML =
    seg(
      "Parts",
      TWELVE_PARTS.map((d) => [d, `${d} parts`]),
    ) +
    `<div class="wrow">${stepper("take", "Take")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const take = values.take,
      each = 12 / parts;
    press(el, parts);
    q("take").textContent = take;
    q("f").innerHTML = ofTape(12, parts, take, true);
    q("r").innerHTML =
      `Each of the ${parts} parts is 12 ÷ ${parts} = ${each}. Take ${take}: ` +
      `<b>${fr(take, parts)} × 12 = ${take} × (12 ÷ ${parts}) = ${take} × ${each} = ${take * each}</b>.`;
  };
  /* new parts: take goes up to all of them */
  const chooseParts = (d) => {
    parts = d;
    limits.take[1] = d;
    values.take = Math.min(values.take, d);
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    chooseParts(+m);
    draw();
  });
  chooseParts(parts);
  draw();
}
/* fractions of a pound to take: [a, b] */
const POUND_FRACTIONS = [
  [1, 3],
  [2, 3],
  [3, 4],
  [2, 5],
];
/* Take a fraction of a few pounds when it doesn't split evenly: a/b of each pound, then count the pieces (pick a/b, step n). */
function wNotEven(el) {
  const q = Q(el),
    values = { pounds: 5 },
    limits = { pounds: [1, 5] };
  let fractionIndex = 1;
  el.innerHTML =
    seg(
      "Fraction",
      POUND_FRACTIONS.map(([a, b], i) => [i, `${a}/${b}`]),
    ) +
    `<div class="wrow">${stepper("pounds", "Pounds")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b] = POUND_FRACTIONS[fractionIndex],
      n = values.pounds,
      pieces = a * n;
    press(el, fractionIndex);
    q("pounds").textContent = n;
    q("f").innerHTML = poundsFig(n, b, a);
    const value =
      pieces % b ? (pieces > b ? `${fr(pieces, b)} = ${mixed(pieces, b)}` : fr(pieces, b)) : `${pieces / b}`;
    q("r").innerHTML =
      `${fr(a, b)} of each pound is ${a} ${a === 1 ? "piece" : "pieces"} of ${fr(1, b)}. ${n} ${n === 1 ? "pound gives" : "pounds give"} ${n} × ${a} = ${pieces} pieces: ` +
      `<b>${fr(a, b)} × ${n} = ${value}</b> ${pieces <= b ? "pound" : "pounds"}.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    fractionIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "One part of a number",
    widget: wUnitOf,
    body: "<p>To find 1/4 of 12, split 12 into 4 equal parts. One part is 12 ÷ 4 = 3. So taking <b>1/b of a number</b> is the same as dividing it by b: 1/4 × 12 = 12 ÷ 4.</p><p>Pick a fraction of 12.</p>",
    check: {
      kind: "num",
      q: "Lin picks 15 berries. 1/5 of them are strawberries. How many strawberries does Lin pick?",
      answer: 3,
      unit: "strawberries",
      misc: [
        [75, "That multiplies 15 by 5. 1/5 of 15 is 15 split into 5 equal parts: 15 ÷ 5."],
        [5, "That’s how many parts. Each part has 15 ÷ 5 berries."],
      ],
      explain: "1/5 × 15 = 15 ÷ 5 = 3 strawberries.",
    },
  },
  {
    title: "Some parts of a number",
    widget: wSomeOf,
    body: "<p>To find 3/4 of 12, split 12 into 4 equal parts of 3, then take 3 of those parts: 3 × 3 = 9. So <b>a/b × n = a × (n ÷ b)</b>.</p><p>Pick how many parts, then how many to take.</p>",
    check: {
      kind: "num",
      q: "There are 12 apples in a basket. 2/3 of them are red. How many red apples are there?",
      answer: 8,
      unit: "apples",
      misc: [
        [4, "That’s 1/3 of them. 2/3 is 2 of those parts."],
        [24, "That multiplies by 2 but doesn’t divide by 3."],
      ],
      explain: "12 ÷ 3 = 4 in each part. 2 parts: 2 × 4 = 8 red apples.",
    },
  },
  {
    title: "When it doesn’t split evenly",
    widget: wNotEven,
    body: "<p>3 doesn’t go into 5 evenly, but you can still take 2/3 of 5 pounds: take 2/3 of each pound. That’s 2 pieces of 1/3 from each of 5 pounds, or 10 thirds: <b>2/3 × 5 = (2 × 5)/3 = 10/3</b>.</p><p>Pick a fraction and a number of pounds.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "Jada has 5 pounds of blueberries and uses 3/4 of them in muffins. How many pounds is that?",
      answer: 15 / 4,
      unit: "pounds",
      misc: [
        [15, "That multiplies by 3 but doesn’t divide by 4: 3 × 5 = 15 fourths."],
        [3 / 20, "That divides by 5. Take 3/4 of each of the 5 pounds: 15 pieces of 1/4."],
      ],
      explain: "3/4 of each pound is 3 fourths, and 5 pounds give 3 × 5 = 15 fourths: 3/4 × 5 = 15/4 = 3 3/4 pounds.",
    },
  },
];
