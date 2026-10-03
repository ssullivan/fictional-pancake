/* Learn Introducing Ratios (Grade 6 Unit 2), chapter 4: Better deals. Its widgets and steps; loaded by better-deals.html. */
/* two offers, [count, price], of one thing */
const DEALS = [
  { what: ["pen", "pens"], a: [3, 6], b: [5, 9] },
  { what: ["muffin", "muffins"], a: [4, 6], b: [6, 9] },
  { what: ["kilogram of rice", "kilograms of rice"], a: [2, 5], b: [5, 11] },
];
/* "3 pens for $6" */
const offer = (what, [count, price]) => `${count} ${what[count === 1 ? 0 : 1]} for ${money(price)}`;
/* Two offers on double number lines, each down to the price for one: the lower one is the better deal. */
function wDeal(el) {
  const q = Q(el);
  let dealIndex = 0;
  el.innerHTML =
    seg(
      "Compare",
      DEALS.map((deal, i) => [i, deal.what[1]]),
    ) + `<div class="fig dnl2" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* unitA and unitB: the price for one in each offer */
    const { what, a, b } = DEALS[dealIndex],
      unitA = a[1] / a[0],
      unitB = b[1] / b[0];
    press(el, dealIndex);
    const line = ([count, price]) =>
      dnl(
        what[1],
        "dollars",
        [
          { t: 0, b: 0, st: 1, sb: 1 },
          { t: 1, b: price / count, st: 2, sb: 2 },
          { t: count, b: price, st: 1, sb: 1 },
        ],
        { fb: money },
      )(true);
    q("f").innerHTML = line(a) + line(b);
    const best = Math.abs(unitA - unitB) < 1e-9 ? null : unitA < unitB ? a : b;
    q("r").innerHTML =
      `${offer(what, a)}: <b>${money(unitA)}</b> for each ${what[0]}.<br>${offer(what, b)}: <b>${money(unitB)}</b> for each ${what[0]}.<br>` +
      (best
        ? `<span class="ok">${offer(what, best)} is the better deal: each ${what[0]} costs less.</span>`
        : `<span class="ok">They’re the same deal: the same price for each ${what[0]}.</span>`);
  };
  el.addEventListener("click", (e) => {
    const dealBtn = e.target.closest("[data-m]");
    if (dealBtn) {
      dealIndex = +dealBtn.dataset.m;
      draw();
    }
  });
  draw();
}

/* two runners, [meters, seconds] */
const RACES = [
  { a: ["Noah", [100, 20]], b: ["Priya", [150, 25]] },
  { a: ["Lin", [200, 40]], b: ["Andre", [120, 24]] },
  { a: ["Kiran", [90, 15]], b: ["Jada", [60, 12]] },
];
/* Two runners: compare their meters per second. */
function wRace(el) {
  const q = Q(el);
  let raceIndex = 0;
  el.innerHTML =
    seg(
      "Race",
      RACES.map(({ a, b }, i) => [i, `${a[0]} and ${b[0]}`]),
    ) + `<p class="readout" data-r></p>`;
  const draw = () => {
    const { a, b } = RACES[raceIndex],
      speedA = a[1][0] / a[1][1],
      speedB = b[1][0] / b[1][1];
    press(el, raceIndex);
    const say = ([name, [meters, seconds]], speed) =>
      `${name} runs ${meters} meters in ${seconds} seconds: ${meters} ÷ ${seconds} = <b>${fmt(speed)} meters per second</b>.`;
    q("r").innerHTML =
      `${say(a, speedA)}<br>${say(b, speedB)}<br>` +
      (speedA === speedB
        ? `<span class="ok">They run at the same speed.</span>`
        : `<span class="ok">${(speedA > speedB ? a : b)[0]} is faster: more meters every second.</span>`);
  };
  el.addEventListener("click", (e) => {
    const raceBtn = e.target.closest("[data-m]");
    if (raceBtn) {
      raceIndex = +raceBtn.dataset.m;
      draw();
    }
  });
  draw();
}

const STEPS = [
  {
    title: "Which is the better deal?",
    widget: wDeal,
    body: "<p>To compare two offers, find the price of <b>one</b> in each. The one that costs less for each is the better deal, even if its total is higher.</p><p>Pick two offers to compare.</p>",
    check: {
      kind: "mc",
      q: "Which is the better deal?",
      choices: [
        { id: "a", label: "4 bags of chips for $6" },
        { id: "b", label: "6 bags of chips for $8" },
        { id: "c", label: "They cost the same for each bag" },
      ],
      answer: "b",
      why: {
        a: "It costs less in all, but you get fewer bags: $6 ÷ 4 = $1.50 a bag. 6 bags for $8 is about $1.33 a bag.",
        c: "Find the price of 1 bag in each: $6 ÷ 4 = $1.50 and $8 ÷ 6 ≈ $1.33.",
      },
      explain: "$6 ÷ 4 = $1.50 for each bag, and $8 ÷ 6 ≈ $1.33. 6 bags for $8 is the better deal.",
    },
  },
  {
    title: "Who is faster?",
    widget: wRace,
    body: "<p>To compare speeds, find the distance each goes in <b>one</b> second. More meters every second means faster.</p><p>Pick a race.</p>",
    check: {
      kind: "mc",
      q: "Lin runs 200 meters in 40 seconds. Andre runs 150 meters in 25 seconds. Who is faster?",
      choices: [
        { id: "l", label: "Lin" },
        { id: "a", label: "Andre" },
        { id: "s", label: "They run at the same speed" },
      ],
      answer: "a",
      why: {
        l: "Lin runs farther, but takes longer: 200 ÷ 40 = 5 meters every second. Andre runs 6.",
        s: "Find the meters in 1 second for each: 200 ÷ 40 = 5 and 150 ÷ 25 = 6.",
      },
      explain: "Lin: 200 ÷ 40 = 5 meters per second. Andre: 150 ÷ 25 = 6 meters per second. Andre is faster.",
    },
  },
];
