/* Learn Multiplicative Comparison and Measurement (Grade 4 Unit 5), chapter 2: More than or times as many. Its widgets and steps; loaded by comparisons.html. */
/* the two ways to compare: n more, or n times as many */
const WAYS = [
  ["more", "More than"],
  ["times", "Times as many"],
];
/* Compare Han's amount with Lin's, as n more or n times as many (steppers and a switch). */
function wMore(el) {
  /* the steppers' values: han, how many Han has, and n, the number in "n more" or "n times as many" */
  const q = Q(el),
    values = { han: 4, n: 3 },
    limits = { han: [1, 8], n: [2, 5] };
  let way = "more";
  el.innerHTML =
    seg("Compare", WAYS) +
    `<div class="wrow">${stepper("han", "Han has")}${stepper("n", "Number")}</div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { han, n } = values,
      lin = way === "more" ? han + n : han * n;
    press(el, way);
    q("han").textContent = han;
    q("n").textContent = n;
    q("f").innerHTML = timesTape(
      [
        { label: "Han", times: 1, each: han, total: han },
        way === "more"
          ? { label: "Lin", times: 1, each: han, total: lin, plus: `+${n}`, plusBoxes: n / han }
          : { label: "Lin", times: n, each: han, total: lin },
      ],
      { label: `Tape diagram: Han has ${han}, and Lin has ${way === "more" ? `${n} more` : `${n} times as many`}` },
    );
    q("e").innerHTML = way === "more" ? `${han} + ${n} = ${lin}` : `${n} × ${han} = ${lin}`;
    q("r").innerHTML =
      way === "more"
        ? `<b>${n} more</b> than ${han} adds ${n}: Lin has ${lin}.`
        : `<b>${n} times as many</b> as ${han} is ${n} groups of ${han}: Lin has ${lin}. That’s ${lin - han} more than Han, because the ${n} groups are Han’s 1 group and ${n - 1} more.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    way = m;
    draw();
  });
  draw();
}
/* amounts to compare with big numbers, and how they're written */
const BASES = [6, 40, 300, 2000];
/* Pick an amount and how many times as many (stepper): bigger numbers work the same way. */
function wBig(el) {
  /* the stepper's value: times, how many times as much */
  const q = Q(el),
    values = { times: 4 },
    limits = { times: [2, 10] };
  let baseIndex = 2;
  el.innerHTML =
    seg(
      "Amount",
      BASES.map((v, i) => [i, commas(v)]),
    ) +
    `<div class="wrow">${stepper("times", "Times as much")}</div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const base = BASES[baseIndex],
      times = values.times,
      product = base * times,
      /* the base as a digit and a place: 300 is 3 hundreds */
      zeros = String(base).length - String(base).replace(/0+$/, "").length,
      lead = base / 10 ** zeros,
      place = ["", "tens", "hundreds", "thousands"][zeros];
    press(el, baseIndex);
    q("times").textContent = times;
    q("f").innerHTML = timesTape(
      [
        { label: "Amount", times: 1, each: commas(base) },
        { label: `${times} times`, times, each: commas(base), total: commas(product) },
      ],
      {
        label: `Tape diagram: ${times} boxes of ${commas(base)}`,
      },
    );
    q("e").innerHTML = `${times} × ${commas(base)} = ${commas(product)}`;
    q("r").innerHTML =
      (zeros
        ? `${commas(base)} is ${lead} ${place}, so ${times} times as much is ${times} × ${lead} = ${times * lead} ${place}: <b>${commas(product)}</b>.`
        : `${times} groups of ${base}: <b>${commas(product)}</b>.`) +
      (times === 10 ? ` Ten times as much moves every digit one place to the left.` : "");
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    baseIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "More than or times as many",
    widget: wMore,
    body: "<p>“3 more than 4” adds: 4 + 3 = 7. “3 times as many as 4” multiplies: 3 × 4 = 12. To find how many more one has than the other, subtract.</p><p>Switch between the two kinds of comparison and change the numbers.</p>",
    check: {
      kind: "mc",
      q: "Mai picked 5 apples. Noah picked 4 times as many. How many more apples did Noah pick than Mai?",
      choices: [
        { id: "a", label: "15 apples" },
        { id: "b", label: "20 apples" },
        { id: "c", label: "9 apples" },
      ],
      answer: "a",
      why: {
        b: "That’s how many Noah picked: 4 × 5. How many more is that than Mai’s 5?",
        c: "That’s 4 more than 5. Noah picked 4 times as many: 4 × 5 = 20.",
      },
      explain: "Noah picked 4 × 5 = 20 apples. 20 − 5 = 15 more than Mai.",
    },
  },
  {
    title: "Bigger amounts",
    widget: wBig,
    body: "<p>Times as many works the same way with big numbers. 5 times as much as 300 is 5 × 3 hundreds = 15 hundreds, or 1,500.</p><p>Pick an amount, then change how many times as much.</p>",
    check: {
      kind: "num",
      q: "A small dog weighs 6 kilograms. A lion weighs 30 times as much. How much does the lion weigh?",
      answer: 180,
      unit: "kilograms",
      misc: [
        [36, "That adds 6 + 30. 30 times as much means 30 × 6."],
        [18, "That’s 3 × 6. It’s 30 times as much: 30 × 6 is 3 × 6 tens."],
      ],
      explain: "30 × 6 = 3 × 6 tens = 18 tens = 180 kilograms.",
    },
  },
];
