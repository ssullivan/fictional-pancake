/* Learn Expressions and Equations (Grade 6 Unit 6), chapter 7: Evaluating expressions with exponents. Its widgets and steps;
   loaded by evaluate.html. */
/* expressions to work out one step at a time: each step is the expression so far (the part done next is marked) and why */
const ORDERS = [
  {
    id: "a",
    expr: `3 · ${power(4, 2)}`,
    steps: [
      [
        `3 · <mark>${power(4, 2)}</mark>`,
        `The exponent belongs to the 4 only, and it comes first: ${power(4, 2)} = 4 · 4 = 16.`,
      ],
      [`<mark>3 · 16</mark>`, "Then multiply: 3 · 16 = 48."],
      ["48", ""],
    ],
  },
  {
    id: "b",
    expr: `(3 · 4)<sup>2</sup>`,
    steps: [
      [`(<mark>3 · 4</mark>)<sup>2</sup>`, "Parentheses come first: 3 · 4 = 12."],
      [`<mark>${power(12, 2)}</mark>`, `Then the exponent: ${power(12, 2)} = 12 · 12 = 144.`],
      ["144", ""],
    ],
  },
  {
    id: "c",
    expr: `2 + ${power(3, 2)}`,
    steps: [
      [`2 + <mark>${power(3, 2)}</mark>`, `The exponent comes before adding: ${power(3, 2)} = 3 · 3 = 9.`],
      [`<mark>2 + 9</mark>`, "Then add: 2 + 9 = 11."],
      ["11", ""],
    ],
  },
  {
    id: "d",
    expr: `(2 + 3)<sup>2</sup>`,
    steps: [
      [`(<mark>2 + 3</mark>)<sup>2</sup>`, "Parentheses come first: 2 + 3 = 5."],
      [`<mark>${power(5, 2)}</mark>`, `Then the exponent: ${power(5, 2)} = 5 · 5 = 25.`],
      ["25", ""],
    ],
  },
  {
    id: "e",
    expr: `18 ÷ ${power(3, 2)}`,
    steps: [
      [`18 ÷ <mark>${power(3, 2)}</mark>`, `The exponent comes before dividing: ${power(3, 2)} = 9.`],
      [`<mark>18 ÷ 9</mark>`, "Then divide: 18 ÷ 9 = 2."],
      ["2", ""],
    ],
  },
];
/* Pick an expression and press Next step to work it out one step at a time, with the reason for each. */
function wOrder(el) {
  const q = Q(el);
  let orderId = "a",
    shownSteps = 1;
  el.innerHTML =
    seg(
      "Expression",
      ORDERS.map((o) => [o.id, o.expr]),
    ) +
    `<ul class="work-lines" data-e></ul>` +
    `<div class="wrow"><button type="button" class="ghost-btn" data-next>Next step</button><button type="button" class="ghost-btn" data-again>Start over</button></div>` +
    `<p class="readout" data-r></p>`;
  const draw = () => {
    const order = ORDERS.find((o) => o.id === orderId),
      done = shownSteps === order.steps.length;
    press(el, orderId);
    q("e").innerHTML = order.steps
      .slice(0, shownSteps)
      .map(([line, why], i) => {
        const isLast = i === shownSteps - 1;
        return `<li>${i ? "= " : ""}${isLast && !done ? line : line.replace(/<\/?mark>/g, "")}${isLast && why && !done ? `<span class="why">${why}</span>` : ""}</li>`;
      })
      .join("");
    q("next").disabled = done;
    q("r").innerHTML = done
      ? `<b>${order.expr} = ${order.steps[order.steps.length - 1][0]}</b>.<br><span class="dimline">Parentheses first, then exponents, then multiplying and dividing, then adding and subtracting. Why exponents so early? ${power(4, 2)} is a short way to write 4 · 4, a single number, 16. So 3 · ${power(4, 2)} is 3 · 4 · 4, but (3 · 4)<sup>2</sup> is 12 · 12.</span>`
      : `The marked part is done next. Press Next step.`;
  };
  onPick(el, (id) => {
    orderId = id;
    shownSteps = 1;
    draw();
  });
  q("next").addEventListener("click", () => {
    shownSteps = Math.min(shownSteps + 1, ORDERS.find((o) => o.id === orderId).steps.length);
    draw();
  });
  q("again").addEventListener("click", () => {
    shownSteps = 1;
    draw();
  });
  draw();
}

/* expressions with exponents and letters, each as written, worked with x put in, and its value */
const EXP_EXPRS = [
  { expr: `${mathVar("x")}<sup>2</sup>`, work: (x) => `${x} · ${x}`, value: (x) => x * x },
  { expr: `2${mathVar("x")}`, work: (x) => `2 · ${x}`, value: (x) => 2 * x },
  { expr: `${mathVar("x")}<sup>3</sup>`, work: (x) => `${x} · ${x} · ${x}`, value: (x) => x ** 3 },
  { expr: `3${mathVar("x")}`, work: (x) => `3 · ${x}`, value: (x) => 3 * x },
  { expr: `4${mathVar("x")}<sup>2</sup>`, work: (x) => `4 · ${x} · ${x}`, value: (x) => 4 * x * x },
  { expr: `(4${mathVar("x")})<sup>2</sup>`, work: (x) => `${4 * x} · ${4 * x}`, value: (x) => (4 * x) ** 2 },
];
/* A stepper for x: a table of expressions with exponents, worked out. */
function wLetters(el) {
  const q = Q(el),
    values = { x: 2 };
  el.innerHTML = `<div class="wrow">${stepper("x", "x")}</div><div class="tables" data-t></div><p class="readout" data-r></p>`;
  const draw = () => {
    const x = values.x;
    q("x").textContent = x;
    q("t").innerHTML = valueTable(
      ["expression", `with ${mathVar("x")} = ${x}`, "value"],
      EXP_EXPRS.map((e) => [e.expr, e.work(x), e.value(x)]),
      { label: `Expressions with exponents, with x = ${x}` },
    );
    q("r").innerHTML = withVars(
      `${x === 2 ? `At x = 2, x<sup>2</sup> and 2x are both 4, and that’s the only value where they match. Try another x.` : `x<sup>2</sup> is ${x} · ${x} = ${x * x}, but 2x is 2 · ${x} = ${2 * x}: different.`}` +
        `<br><span class="dimline">In 4x<sup>2</sup>, the exponent belongs to x only: 4 · x · x. With parentheses, (4x)<sup>2</sup> squares all of 4x. A cube with edge x has surface area 6x<sup>2</sup>: 6 faces, each x · x.</span>`,
    );
  };
  steppers(el, values, { x: [1, 6] }, draw);
  draw();
}

/* equations with an exponent: the side with x for a value of x, the number it must make, and how to work backward */
const EXP_EQS = [
  {
    id: "sq",
    label: `${mathVar("x")}<sup>2</sup> = 49`,
    side: (x) => x * x,
    sideWork: (x) => `${power(x, 2)} = ${x} · ${x}`,
    target: 49,
    back: "49 is 7 · 7, so x = 7.",
  },
  {
    id: "two",
    label: `${power(2, mathVar("x"))} = 32`,
    side: (x) => 2 ** x,
    sideWork: (x) => `${power(2, x)}`,
    target: 32,
    back: "32 ÷ 2 = 16, ÷ 2 = 8, ÷ 2 = 4, ÷ 2 = 2, ÷ 2 = 1: five 2s multiply to 32, so x = 5.",
  },
  {
    id: "cube",
    label: `${mathVar("x")}<sup>3</sup> = 64`,
    side: (x) => x ** 3,
    sideWork: (x) => `${power(x, 3)} = ${x} · ${x} · ${x}`,
    target: 64,
    back: "64 = 4 · 16 = 4 · 4 · 4, so x = 4.",
  },
];
/* Pick an equation and try values of x (guess and check), or work backward from the number. */
function wSolveExp(el) {
  const q = Q(el),
    values = { x: 3 };
  let eqId = "sq",
    backward = false;
  el.innerHTML =
    seg(
      "Equation",
      EXP_EQS.map((e) => [e.id, e.label]),
    ) +
    `<div class="wrow">${stepper("x", "Try x =")}<button type="button" class="ghost-btn" data-back></button></div>` +
    `<p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const eq = EXP_EQS.find((e) => e.id === eqId),
      x = values.x,
      value = eq.side(x);
    press(el, eqId);
    q("x").textContent = x;
    q("back").textContent = backward ? "Hide working backward" : "Work backward";
    q("e").innerHTML = `${eq.sideWork(x)} = ${value}${value === eq.target ? ' <span class="ok">✓</span>' : ""}`;
    const guess =
      value === eq.target
        ? `<span class="ok">x = ${x} works: ${value} is ${eq.target}.</span> That’s the solution.`
        : `x = ${x} gives ${value}, ${value < eq.target ? "too small. Try a bigger x." : "too big. Try a smaller x."}`;
    q("r").innerHTML = withVars(
      `Guess and check: ${guess}` +
        (backward ? `<br>Work backward: <b>${eq.back}</b>` : "") +
        `<br><span class="dimline">Two ways to solve: try values and use “too big” or “too small” to get closer, or start from the number and undo the multiplying.</span>`,
    );
  };
  onPick(el, (id) => {
    eqId = id;
    backward = false;
    draw();
  });
  q("back").addEventListener("click", () => {
    backward = !backward;
    draw();
  });
  steppers(el, values, { x: [1, 8] }, draw);
  draw();
}

const STEPS = [
  {
    title: "Exponents first",
    widget: wOrder,
    body: `<p>When an expression has several operations, everyone agrees on an order so it has only one value. Parentheses come first, then exponents, then multiplying and dividing, then adding and subtracting.</p><p>Pick an expression and work it out one step at a time.</p>`,
    check: {
      kind: "num",
      q: `What is 5 + ${power(2, 3)}?`,
      answer: 13,
      misc: [
        [
          343,
          `That adds first: (5 + 2)<sup>3</sup> = ${power(7, 3)}. The exponent belongs to the 2 only: ${power(2, 3)} = 8, then 5 + 8.`,
        ],
        [11, `${power(2, 3)} isn’t 2 · 3. It’s 2 · 2 · 2 = 8, so 5 + 8 = 13.`],
      ],
      explain: `The exponent first: ${power(2, 3)} = 2 · 2 · 2 = 8. Then 5 + 8 = 13.`,
    },
  },
  {
    title: "Letters with exponents",
    widget: wLetters,
    body: withVars(
      `<p>An exponent can go on a letter: x<sup>2</sup> means x · x. To find its value, put the number in for x, then do the exponent before multiplying.</p><p>Change x and compare.</p>`,
    ),
    check: {
      kind: "num",
      q: `What is 6${mathVar("x")}<sup>2</sup> when ${mathVar("x")} = 3?`,
      answer: 54,
      misc: [
        [324, `That squares 6 · 3 = 18. The exponent belongs to x only: 6 · ${power(3, 2)} = 6 · 9.`],
        [36, `${power(3, 2)} is 3 · 3 = 9, not 3 · 2 = 6. So 6 · 9 = 54.`],
      ],
      explain: `x<sup>2</sup> = ${power(3, 2)} = 9, so 6x<sup>2</sup> = 6 · 9 = 54.`,
    },
  },
  {
    title: "Solving with exponents",
    widget: wSolveExp,
    body: withVars(
      `<p>In an equation like 2<sup>x</sup> = 32, the unknown is the exponent: how many 2s multiply to make 32? You can guess and check, or work backward.</p><p>Pick an equation and try values.</p>`,
    ),
    check: {
      kind: "num",
      q: `What value of ${mathVar("x")} makes ${power(3, mathVar("x"))} = 81 true?`,
      answer: 4,
      misc: [
        [27, `That’s 81 ÷ 3. x is the exponent: how many 3s multiply to make 81?`],
        [78, `That subtracts 3. ${power(3, mathVar("x"))} means 3 multiplied by itself x times.`],
      ],
      explain: `3 · 3 · 3 · 3 = 81, so ${power(3, 4)} = 81 and x = 4.`,
    },
  },
];
