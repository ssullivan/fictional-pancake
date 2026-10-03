/* Learn Introducing Ratios (Grade 6 Unit 2), chapter 3: Double number lines. Its widgets and steps; loaded by double-number-lines.html. */
/* ticks 0, 1, …, last times (a, b); the ones up to k are labeled, and tick k stands out */
const ladder = (a, b, last, k) =>
  Array.from({ length: last + 1 }, (_, i) => ({
    t: i * a,
    b: i * b,
    st: i === k ? 2 : i <= k ? 1 : 0,
    sb: i === k ? 2 : i <= k ? 1 : 0,
  }));

/* ratios a : b, and what the top and bottom lines count */
const MIXES = [
  { name: "blue paint", top: "cups of blue", bot: "cups of yellow", a: 2, b: 5 },
  { name: "running laps", top: "laps", bot: "minutes", a: 3, b: 4 },
  { name: "granola", top: "cups of oats", bot: "spoonfuls of honey", a: 4, b: 1 },
];
/* A double number line for a ratio: a stepper sets how many batches, and that tick lines up with its partner. */
function wLadder(el) {
  /* the stepper's value: k batches */
  const q = Q(el),
    values = { k: 1 };
  let mixIndex = 0;
  el.innerHTML =
    seg(
      "Ratio",
      MIXES.map((mix, i) => [i, mix.name]),
    ) +
    `<div class="wrow">${stepper("k", "Batches")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const mix = MIXES[mixIndex],
      { k } = values;
    press(el, mixIndex);
    q("k").textContent = k;
    q("f").innerHTML = dnl(mix.top, mix.bot, ladder(mix.a, mix.b, 6, k))(true);
    q("r").innerHTML =
      `${k} ${k === 1 ? "batch" : "batches"}: <b>${mix.a * k} ${mix.top}</b> lines up with <b>${mix.b * k} ${mix.bot}</b>.<br><span class="dimline">Each tick on top lines up with its partner below: every pair is ${mix.a} : ${mix.b} times the same number.</span>`;
  };
  steppers(el, values, { k: [0, 6] }, draw);
  el.addEventListener("click", (e) => {
    const mixBtn = e.target.closest("[data-m]");
    if (mixBtn) {
      mixIndex = +mixBtn.dataset.m;
      values.k = 1;
      draw();
    }
  });
  draw();
}

/* buys of n things for a cost */
const BUYS = [
  { n: 4, what: ["taco", "tacos"], cost: 10 },
  { n: 6, what: ["ticket", "tickets"], cost: 18 },
  { n: 8, what: ["pencil", "pencils"], cost: 2 },
  { n: 5, what: ["pound of grapes", "pounds of grapes"], cost: 7.5 },
];
/* How much for one: split both lines into n equal parts. */
function wUnit(el) {
  const q = Q(el);
  let buyIndex = 0;
  el.innerHTML =
    seg(
      "Buy",
      BUYS.map((buy, i) => [i, `${buy.n} for ${money(buy.cost)}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { n, what, cost } = BUYS[buyIndex],
      one = cost / n;
    press(el, buyIndex);
    q("f").innerHTML = dnl(
      what[1],
      "dollars",
      [
        { t: 0, b: 0, st: 1, sb: 1 },
        { t: 1, b: one, st: 2, sb: 2 },
        { t: n, b: cost, st: 1, sb: 1 },
      ],
      { fb: money },
    )(true);
    q("r").innerHTML =
      `${n} ${what[1]} cost ${money(cost)}. Split both lines into ${n} equal parts: 1 ${what[0]} costs <b>${money(cost)} ÷ ${n} = ${money(one)}</b>.<br><span class="dimline">The price for one is the <b>unit price</b>.</span>`;
  };
  el.addEventListener("click", (e) => {
    const buyBtn = e.target.closest("[data-m]");
    if (buyBtn) {
      buyIndex = +buyBtn.dataset.m;
      draw();
    }
  });
  draw();
}

/* the speeds to choose from, in meters per second */
const SPEEDS = [2, 3, 5];
/* Constant speed: the same distance every second (a stepper sets the seconds). */
function wSpeed(el) {
  /* the stepper's value: s seconds */
  const q = Q(el),
    values = { s: 4 };
  let speedIndex = 0;
  el.innerHTML =
    seg(
      "Speed",
      SPEEDS.map((speed, i) => [i, `${speed} meters per second`]),
    ) +
    `<div class="wrow">${stepper("s", "Seconds")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const speed = SPEEDS[speedIndex],
      { s: seconds } = values;
    press(el, speedIndex);
    q("s").textContent = seconds;
    q("f").innerHTML = dnl("meters", "seconds", ladder(speed, 1, 10, seconds))(true);
    q("r").innerHTML =
      `In <b>${seconds} ${seconds === 1 ? "second" : "seconds"}</b> at ${speed} meters per second, it goes <b>${speed * seconds} meters</b>.<br><span class="dimline">A constant speed covers the same distance every second: ${speed} × ${seconds} = ${speed * seconds}.</span>`;
  };
  steppers(el, values, { s: [0, 10] }, draw);
  el.addEventListener("click", (e) => {
    const speedBtn = e.target.closest("[data-m]");
    if (speedBtn) {
      speedIndex = +speedBtn.dataset.m;
      draw();
    }
  });
  draw();
}

/* the quick checks' figures */
const F = {
  apples: dnl(
    "pounds",
    "dollars",
    [
      { t: 0, b: 0, st: 1, sb: 1 },
      { t: 2, b: 6, st: 1, q: "b" },
      { t: 5, b: 15, st: 1, sb: 1 },
    ],
    { fb: money },
  )(false),
};
const STEPS = [
  {
    title: "Double number lines",
    widget: wLadder,
    body: "<p>A <b>double number line</b> shows equivalent ratios. The top line counts one thing and the bottom line the other, and each tick pairs amounts in the same ratio.</p><p>Pick a ratio and step along the lines.</p>",
    check: {
      kind: "num",
      unit: "dollars",
      answer: 6,
      fig: F.apples,
      q: "5 pounds of apples cost $15. How much do 2 pounds cost?",
      misc: [
        [12, "You took off $3 because there are 3 fewer pounds. Find the cost of 1 pound first: $15 ÷ 5 = $3."],
        [30, "That’s $15 × 2. 2 pounds is less than 5 pounds, so it costs less."],
        [7.5, "That’s half of $15, but 2 pounds isn’t half of 5 pounds. Find 1 pound first."],
      ],
      explain: "1 pound costs $15 ÷ 5 = $3, so 2 pounds cost 2 × $3 = $6.",
    },
  },
  {
    title: "How much for one?",
    widget: wUnit,
    body: "<p>To find the price of one, split both lines into the same number of equal parts. The price for one is called the <b>unit price</b>.</p><p>Pick something to buy.</p>",
    check: {
      kind: "num",
      unit: "dollars",
      answer: 3,
      q: "6 tickets cost $18. How much does 1 ticket cost?",
      misc: [
        [108, "That’s $18 × 6. One ticket costs less than 6 tickets: divide."],
        [12, "That’s $18 − 6. Split the cost into 6 equal parts: $18 ÷ 6."],
        [0.33, "That’s 6 ÷ 18, tickets for each dollar. The cost of 1 ticket is $18 ÷ 6."],
      ],
      explain: "$18 ÷ 6 = $3 for each ticket.",
    },
  },
  {
    title: "Constant speed",
    widget: wSpeed,
    body: "<p>Something moving at a <b>constant speed</b> goes the same distance every second (or minute, or hour). Distance and time are in the same ratio all the way along.</p><p>Pick a speed and change the time.</p>",
    check: {
      kind: "num",
      unit: "cm",
      answer: 30,
      q: "A snail crawls 12 cm in 4 minutes at a constant speed. How far does it crawl in 10 minutes?",
      misc: [
        [18, "You added 6 because 10 minutes is 6 more than 4. Find 1 minute first: 12 ÷ 4 = 3 cm."],
        [48, "That’s 12 × 4. Find how far it goes in 1 minute: 12 ÷ 4."],
        [120, "That’s 12 × 10: 12 cm every minute. The snail goes 12 cm every 4 minutes."],
      ],
      explain: "In 1 minute it crawls 12 ÷ 4 = 3 cm, so in 10 minutes it crawls 10 × 3 = 30 cm.",
    },
  },
];
