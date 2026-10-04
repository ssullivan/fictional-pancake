/* Learn Multiplicative Comparison and Measurement (Grade 4 Unit 5), chapter 3: Metric units. Its widgets and steps; loaded by metric.html. */
/* pairs of units: [id, button, the big unit (one, many), the small unit (one, many), how many small make 1 big] */
const LENGTHS = [
  ["m", "Meters to centimeters", ["meter", "meters"], ["centimeter", "centimeters"], 100],
  ["km", "Kilometers to meters", ["kilometer", "kilometers"], ["meter", "meters"], 1000],
];
const MASSES = [
  ["kg", "Kilograms to grams", ["kilogram", "kilograms"], ["gram", "grams"], 1000],
  ["L", "Liters to milliliters", ["liter", "liters"], ["milliliter", "milliliters"], 1000],
];
/* n and the unit's word for it: "1 meter", "4 meters" */
const unitOf = (n, [one, many]) => `${commas(n)} ${n === 1 ? one : many}`;
/* Pick a pair of units and how many of the big unit (a stepper): a table shows the same amounts in the small unit.
   pairs: the unit pairs to pick from; compare: an amount in the small unit to compare the result with (or null). */
const wConvert = (pairs, compare) => (el) => {
  /* the stepper's value: n, how many of the big unit */
  const q = Q(el),
    values = { n: 3 },
    limits = { n: [1, 9] };
  let pairIndex = 0;
  el.innerHTML =
    seg(
      "Units",
      pairs.map(([, name], i) => [i, name]),
    ) +
    `<div class="wrow">${stepper("n", "How many")}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const [, , big, small, per] = pairs[pairIndex],
      n = values.n,
      total = n * per;
    press(el, pairIndex);
    q("n").textContent = n;
    q("f").innerHTML = convTable(
      [big[1], small[1]],
      range(n).map((i) => [i + 1, (i + 1) * per]),
      { hi: n - 1 },
    );
    q("e").innerHTML = `${n} × ${commas(per)} = ${commas(total)}`;
    q("r").innerHTML =
      `1 ${big[0]} is ${unitOf(per, small)}, so ${unitOf(n, big)} ${n === 1 ? "is" : "are"} ${n} × ${commas(per)} = <b>${unitOf(total, small)}</b>.` +
      (compare
        ? ` That’s ${total > compare ? "more" : "less"} than ${unitOf(compare, small)}${total > compare ? `, by ${unitOf(total - compare, small)}` : `, by ${unitOf(compare - total, small)}`}.`
        : "");
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    pairIndex = +m;
    draw();
  });
  draw();
};
const STEPS = [
  {
    title: "Meters, centimeters, and kilometers",
    widget: wConvert(LENGTHS, null),
    body: "<p>1 meter is 100 centimeters, and 1 kilometer is 1,000 meters. To change a big unit into a smaller one, multiply: there are more of the small units.</p><p>Pick the units, then change how many.</p>",
    check: {
      kind: "num",
      q: "Elena’s school is 2 kilometers from home. How many meters is that?",
      answer: 2000,
      unit: "meters",
      misc: [
        [200, "That’s 2 × 100. A kilometer is 1,000 meters, not 100."],
        [1002, "That adds. Each of the 2 kilometers is 1,000 meters: 2 × 1,000."],
      ],
      explain: "1 kilometer is 1,000 meters, so 2 kilometers is 2 × 1,000 = 2,000 meters.",
    },
  },
  {
    title: "Grams and kilograms, liters and milliliters",
    widget: wConvert(MASSES, 2500),
    body: "<p>1 kilogram is 1,000 grams, and 1 liter is 1,000 milliliters. To compare or subtract amounts in two units, change them to the same unit first.</p><p>Pick the units, then change how many. Each amount is compared with 2,500 of the small unit.</p>",
    check: {
      kind: "num",
      q: "A bag holds 3 kilograms of rice. The cook uses 1,200 grams. How many grams of rice are left?",
      answer: 1800,
      unit: "grams",
      misc: [
        [1197, "That takes 1,200 from 3. Change 3 kilograms to grams first: 3,000 grams."],
        [4200, "That adds. The cook used some rice, so subtract: 3,000 − 1,200."],
      ],
      explain: "3 kilograms is 3 × 1,000 = 3,000 grams. 3,000 − 1,200 = 1,800 grams are left.",
    },
  },
];
