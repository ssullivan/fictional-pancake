/* Learn Unit Rates and Percentages (Grade 6 Unit 3), chapter 2: Unit rates. Its widgets and steps; loaded by unit-rates.html. */
/* a ratio of a of one thing to b of another, and both of its unit rates */
const PAIRS = [
  { a: 3, au: ["cup of flour", "cups of flour"], b: 12, bu: ["muffin", "muffins"] },
  { a: 4, au: ["dollar", "dollars"], b: 10, bu: ["apple", "apples"] },
  { a: 5, au: ["minute", "minutes"], b: 20, bu: ["window washed", "windows washed"] },
];
/* A ratio's two unit rates, on a double number line. */
function wTwoRates(el) {
  const q = Q(el);
  let pairIndex = 0;
  el.innerHTML =
    seg(
      "Ratio",
      PAIRS.map((pair, i) => [i, `${pair.a} ${pair.au[1].split(" ")[0]} : ${pair.b} ${pair.bu[1].split(" ")[0]}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { a, au, b, bu } = PAIRS[pairIndex];
    press(el, pairIndex);
    q("f").innerHTML = dnl(au[1], bu[1], [
      { t: 0, b: 0, st: 1, sb: 1 },
      { t: 1, b: b / a, st: 2, sb: 2 },
      { t: a, b, st: 1, sb: 1 },
    ])(true);
    q("r").innerHTML =
      `${nOf(a, au)} for ${nOf(b, bu)}.<br><b>${fmt(b / a)} ${bu[b / a === 1 ? 0 : 1]} for each ${au[0]}</b> (${b} ÷ ${a}), and <b>${fmt(a / b)} ${au[a / b === 1 ? 0 : 1]} for each ${bu[0]}</b> (${a} ÷ ${b}).<br><span class="dimline">Both are unit rates: each tells how much of one goes with 1 of the other.</span>`;
  };
  el.addEventListener("click", (e) => {
    const pairBtn = e.target.closest("[data-m]");
    if (pairBtn) {
      pairIndex = +pairBtn.dataset.m;
      draw();
    }
  });
  draw();
}

/* trip lengths in miles */
const TRIPS = [90, 150, 240];
/* The rate that fits the question: 30 miles per gallon, so gallons = miles ÷ 30. */
function wUseRate(el) {
  const q = Q(el);
  let tripIndex = 0;
  el.innerHTML =
    `<p class="note">A car goes 30 miles on each gallon of gas: 30 miles per gallon, or 1/30 of a gallon per mile.</p>` +
    seg(
      "Trip",
      TRIPS.map((miles, i) => [i, `${miles} miles`]),
    ) +
    `<p class="readout" data-r></p>`;
  const draw = () => {
    const miles = TRIPS[tripIndex];
    press(el, tripIndex);
    q("r").innerHTML =
      `${miles} miles at 30 miles for each gallon: ${miles} ÷ 30 = <b>${miles / 30} gallons</b>.<br><span class="dimline">The question asks for gallons, and each gallon covers 30 miles, so divide the miles by 30.</span>`;
  };
  el.addEventListener("click", (e) => {
    const tripBtn = e.target.closest("[data-m]");
    if (tripBtn) {
      tripIndex = +tripBtn.dataset.m;
      draw();
    }
  });
  draw();
}
const STEPS = [
  {
    title: "Two unit rates",
    widget: wTwoRates,
    body: "<p>A <b>unit rate</b> tells how much of one thing goes with <b>1</b> of the other. Every ratio has two: 3 cups of flour for 12 muffins is 4 muffins for each cup, and 1/4 cup for each muffin.</p><p>Pick a ratio and read both unit rates.</p>",
    check: {
      kind: "num",
      unit: "muffins",
      answer: 4,
      q: "It takes 3 cups of flour to make 12 muffins. How many muffins can you make with 1 cup of flour?",
      misc: [
        [0.25, "That’s the flour for 1 muffin: 3 ÷ 12. This asks for muffins for 1 cup: 12 ÷ 3."],
        [36, "That’s 3 × 12. One cup makes fewer muffins than 3 cups: divide."],
        [9, "That’s 12 − 3. Share the 12 muffins among the 3 cups: 12 ÷ 3."],
      ],
      explain: "12 muffins ÷ 3 cups = 4 muffins for each cup of flour.",
    },
  },
  {
    title: "Use the rate that fits",
    widget: wUseRate,
    body: "<p>Pick the unit rate that answers the question. To find gallons for a trip, use miles for each gallon and divide the miles by it.</p><p>Pick a trip.</p>",
    check: {
      kind: "num",
      unit: "gallons",
      answer: 5,
      q: "A car goes 30 miles on each gallon of gas. How many gallons does it need for 150 miles?",
      misc: [
        [4500, "That’s 150 × 30. Each gallon covers 30 miles, so it takes fewer gallons than miles: divide."],
        [120, "That’s 150 − 30. Each gallon covers 30 miles: 150 ÷ 30."],
        [0.2, "That’s 30 ÷ 150. Divide the miles by the miles for each gallon: 150 ÷ 30."],
      ],
      explain: "150 miles ÷ 30 miles for each gallon = 5 gallons.",
    },
  },
];
