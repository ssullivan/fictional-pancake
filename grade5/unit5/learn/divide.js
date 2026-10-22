/* Learn Place Value Patterns and Decimal Operations (Grade 5 Unit 5), chapter 6: Divide decimals. Its widgets and steps;
   loaded by divide.html. */
/* the sizes to count, in tenths */
const SIZES = [1, 2, 5];
/* Pick a size (0.1, 0.2, or 0.5) and step the wholes: count how many of that size fit. */
function wHowMany(el) {
  const q = Q(el),
    values = { wholes: 3 },
    limits = { wholes: [1, 4] };
  let size = 1;
  el.innerHTML =
    seg(
      "Size",
      SIZES.map((t) => [t, `0.${t}`]),
    ) +
    `<div class="wrow">${stepper("wholes", "Wholes")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const n = values.wholes,
      count = (n * 10) / size;
    press(el, size);
    q("wholes").textContent = n;
    q("f").innerHTML = tenthsFig(n * 10, size, `${n} wholes in groups of 0.${size}`);
    q("r").innerHTML =
      `Each whole holds ${10 / size} groups of 0.${size}, so ${n} ${n === 1 ? "whole holds" : "wholes hold"} ${n} × ${10 / size} = ${count}: <b>${n} ÷ 0.${size} = ${count}</b>.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    size = +m;
    draw();
  });
  draw();
}
/* divisions with tenths: [button, tenths to divide, divisor, divisor in tenths (or 0 for a whole number), what it means] */
const SHARES = [
  ["1.2 ÷ 4", 12, "4", 0],
  ["0.8 ÷ 2", 8, "2", 0],
  ["2.4 ÷ 0.3", 24, "0.3", 3],
  ["1.5 ÷ 0.5", 15, "0.5", 5],
];
/* Pick a division: share tenths among a whole number, or count groups of tenths. */
function wShare(el) {
  const q = Q(el);
  let shareIndex = 0;
  el.innerHTML =
    seg(
      "Division",
      SHARES.map(([button], i) => [i, button]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [button, tenths, divisor, groupTenths] = SHARES[shareIndex];
    press(el, shareIndex);
    if (groupTenths) {
      q("f").innerHTML = tenthsFig(tenths, groupTenths);
      q("r").innerHTML =
        `${dec(tenths * 100)} is ${tenths} tenths, and ${divisor} is ${groupTenths} tenths. How many groups of ${groupTenths} tenths? ${tenths} ÷ ${groupTenths} = ${tenths / groupTenths}: <b>${button} = ${tenths / groupTenths}</b>.`;
    } else {
      const each = tenths / +divisor;
      q("f").innerHTML = tenthsFig(tenths, each);
      q("r").innerHTML =
        `${dec(tenths * 100)} is ${tenths} tenths. Share them among ${divisor}: ${tenths} ÷ ${divisor} = ${each} tenths each. <b>${button} = ${dec(each * 100)}</b>.`;
    }
  };
  onPick(el, (m) => {
    shareIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "How many tenths fit?",
    widget: wHowMany,
    body: "<p>3 ÷ 0.1 asks how many tenths fit in 3. Each whole holds 10 tenths, so 3 wholes hold 30: <b>3 ÷ 0.1 = 30</b>. Dividing by a number less than 1 gives more than you started with.</p><p>Pick a size and change the wholes.</p>",
    check: {
      kind: "num",
      q: "The water station has 4 liters of water. How many 0.1-liter cups can it fill?",
      answer: 40,
      unit: "cups",
      misc: [
        [0.4, "That’s 4 × 0.1. Count how many tenths fit in 4: divide."],
        [4, "Each liter fills 10 cups of 0.1 liter, so 4 liters fill 4 × 10."],
      ],
      explain: "There are 10 tenths in 1, so 4 ÷ 0.1 = 4 × 10 = 40 cups.",
    },
  },
  {
    title: "Share or group tenths",
    widget: wShare,
    body: "<p>Think of decimals as tenths. To divide 1.2 by 4, share 12 tenths into 4 groups: 3 tenths each, 0.3. To divide 2.4 by 0.3, count groups of 3 tenths in 24 tenths: 8.</p><p>Pick a division.</p>",
    check: {
      kind: "num",
      q: "A 1.8-kilometer relay is split equally among 3 runners. How far does each run?",
      answer: 0.6,
      unit: "kilometers",
      tol: 0.0005,
      misc: [
        [6, "That’s 6 whole kilometers. 1.8 is 18 tenths, so each runs 6 tenths."],
        [0.06, "That’s 6 hundredths. 18 tenths ÷ 3 is 6 tenths."],
      ],
      explain: "1.8 is 18 tenths. 18 ÷ 3 = 6 tenths, so 1.8 ÷ 3 = 0.6 kilometers.",
    },
  },
];
