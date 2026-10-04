/* Learn Expressions and Equations (Grade 6 Unit 6), chapter 1: Tape diagrams and equations. Its widgets and steps; loaded by
   equations.html. */
/* three tapes: the parts and total of each (the unknown shown once found), the equations that all say what it shows, and why */
const TAPES = [
  {
    id: "plus",
    label: "A piece and 4",
    parts: (found) => [
      { n: 8, show: found ? "x = 8" : "x" },
      { n: 4, show: "4" },
    ],
    total: () => "12",
    equations: ["x + 4 = 12", "4 + x = 12", "12 = x + 4", "12 − 4 = x"],
    says: "A piece x and a piece 4 together make 12.",
    solve: "12 − 4 = 8, so x = 8. Check: 8 + 4 = 12 ✓",
  },
  {
    id: "times",
    label: "4 equal pieces",
    parts: (found) => range(4).map(() => ({ n: 3, show: found ? "3" : "x" })),
    total: () => "12",
    equations: ["4x = 12", "x + x + x + x = 12", "12 = 4 · x", "12 ÷ 4 = x"],
    says: "4 equal pieces, each x, make 12. 4x means 4 times x.",
    solve: "12 ÷ 4 = 3, so x = 3. Check: 4 · 3 = 12 ✓",
  },
  {
    id: "whole",
    label: "The whole is unknown",
    parts: () => range(3).map(() => ({ n: 5, show: "5" })),
    total: (found) => (found ? "x = 15" : "x"),
    equations: ["x = 3 · 5", "5 + 5 + 5 = x", "x ÷ 3 = 5", "3 · 5 = x"],
    says: "3 pieces of 5 make the whole tape, x.",
    solve: "3 · 5 = 15, so x = 15. Check: 15 ÷ 3 = 5 ✓",
  },
];
/* Pick a tape to see every equation that matches it; Find x writes in the unknown. */
function wTapes(el) {
  const q = Q(el);
  let tapeId = "plus",
    found = false;
  el.innerHTML =
    seg(
      "Tape",
      TAPES.map((tape) => [tape.id, tape.label]),
    ) +
    `<div class="fig" data-f></div>` +
    `<div class="wrow"><button type="button" class="ghost-btn" data-find>Find x</button></div>` +
    `<ul class="work-lines" data-e></ul><p class="readout" data-r></p>`;
  const draw = () => {
    const tape = TAPES.find((t) => t.id === tapeId);
    press(el, tapeId);
    q("f").innerHTML = partWhole(tape.parts(found), tape.total(found), `Tape diagram: ${tape.says}`);
    q("find").textContent = found ? "Hide x" : "Find x";
    q("e").innerHTML = tape.equations.map((text) => `<li>${withVars(text)}</li>`).join("");
    q("r").innerHTML = withVars(
      `${tape.says} Every equation above says the same thing about this tape.` +
        (found ? `<br><b>${tape.solve}</b>` : "") +
        `<br><span class="dimline">The equal sign means both sides are the same amount, so it can go either way: 12 = x + 4 says the same as x + 4 = 12.</span>`,
    );
  };
  onPick(el, (id) => {
    tapeId = id;
    found = false;
    draw();
  });
  q("find").addEventListener("click", () => {
    found = !found;
    draw();
  });
  draw();
}

/* equations to test: each side's value for a value of x, how each side reads with that value in, and the hanger's weights */
const TRUTHS = [
  {
    id: "a",
    text: "8 + 4 = x + 5",
    left: () => 12,
    right: (x) => x + 5,
    leftText: () => "8 + 4",
    rightText: (x) => `${x} + 5`,
    weights: (x) => [
      [8, 4],
      [x, 5],
    ],
  },
  {
    id: "b",
    text: "2x = 3 + 7",
    left: (x) => 2 * x,
    right: () => 10,
    leftText: (x) => `2 · ${x}`,
    rightText: () => "3 + 7",
    weights: (x) => [
      [x, x],
      [3, 7],
    ],
  },
  {
    id: "c",
    text: "18 = 3x",
    left: () => 18,
    right: (x) => 3 * x,
    leftText: () => "18",
    rightText: (x) => `3 · ${x}`,
    weights: (x) => [[18], [x, x, x]],
  },
];
/* Pick an equation and a value of x: each side's value, true or false, and a hanger with the values as weights. */
function wTruth(el) {
  const q = Q(el),
    values = { x: 6 };
  let truthId = "a";
  el.innerHTML =
    seg(
      "Equation",
      TRUTHS.map((t) => [t.id, withVars(t.text)]),
    ) +
    `<div class="wrow">${stepper("x", "x")}</div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const truth = TRUTHS.find((t) => t.id === truthId),
      x = values.x,
      left = truth.left(x),
      right = truth.right(x),
      isTrue = left === right,
      [leftWeights, rightWeights] = truth.weights(x);
    press(el, truthId);
    q("x").textContent = x;
    q("f").innerHTML = hanger(
      leftWeights.map((w) => (w === 1 ? "1" : w)),
      rightWeights.map((w) => (w === 1 ? "1" : w)),
      { tip: Math.sign(right - left) },
    );
    q("e").innerHTML = `${truth.leftText(x)} ${isTrue ? "=" : "≠"} ${truth.rightText(x)} is ${verdict(isTrue)}`;
    q("r").innerHTML = withVars(
      (isTrue
        ? `With x = ${x}, both sides are <b>${left}</b>, so ${truth.text} is <span class="ok">true</span>. The hanger balances.`
        : `With x = ${x}, the left side is ${left} and the right side is ${right}. They aren’t the same amount, so ${truth.text} is <span class="no">false</span> for x = ${x}. The hanger tips toward the heavier side.`) +
        `<br><span class="dimline">The equal sign doesn’t mean “the answer comes next.” It says the two sides are the same amount.</span>`,
    );
  };
  onPick(el, (id) => {
    truthId = id;
    draw();
  });
  steppers(el, values, { x: [0, 12] }, draw);
  draw();
}

/* equations and the values to try in each (in order) */
const SOLVE_TRIES = [
  { id: "times", text: "5x = 35", tries: range(11), value: (x) => [5 * x, 35], show: (x) => `5 · ${x}` },
  {
    id: "plus",
    text: "x + 2.5 = 9",
    tries: [5, 5.5, 6, 6.5, 7, 7.5, 8],
    value: (x) => [x + 2.5, 9],
    show: (x) => `${fmt(x)} + 2.5`,
  },
  { id: "right", text: "18 = 2x", tries: range(13), value: (x) => [18, 2 * x], show: (x) => `2 · ${x}` },
];
/* Try values of x in an equation, one at a time; the ones tried so far are listed, the solution in green. */
function wSolutions(el) {
  /* values.t: which value in the list is being tried; limits.t: the first and last, which depend on the equation */
  const q = Q(el),
    values = { t: 0 },
    limits = { t: [0, SOLVE_TRIES[0].tries.length - 1] };
  let equationId = "times",
    tried = new Set();
  el.innerHTML =
    seg(
      "Equation",
      SOLVE_TRIES.map((s) => [s.id, withVars(s.text)]),
    ) +
    `<div class="wrow">${stepper("t", "Try x =")}</div>` +
    `<p class="eq" data-e></p><div class="chips" data-c></div><p class="readout" data-r></p>`;
  const draw = () => {
    const equation = SOLVE_TRIES.find((s) => s.id === equationId),
      x = equation.tries[values.t],
      [left, right] = equation.value(x),
      isSolution = Math.abs(left - right) < 1e-9;
    tried.add(x);
    press(el, equationId);
    q("t").textContent = fmt(x);
    /* the side with x, written with the value in, then the other side */
    const withValue = equation.id === "right" ? `18 = ${equation.show(x)}` : `${equation.show(x)} = ${fmt(right)}`;
    q("e").innerHTML = `${withValue} is ${verdict(isSolution)}`;
    q("c").innerHTML = equation.tries
      .filter((v) => tried.has(v))
      .map((v) => {
        const [a, b] = equation.value(v);
        return `<span class="chip ${Math.abs(a - b) < 1e-9 ? "found" : ""}">${mathVar("x")} = ${fmt(v)}</span>`;
      })
      .join("");
    q("r").innerHTML = withVars(
      isSolution
        ? `<span class="ok">x = ${fmt(x)} makes ${equation.text} true, so <b>${fmt(x)} is the solution</b>.</span> Putting it back in is how you check any answer.`
        : `x = ${fmt(x)} makes ${equation.text} false: ${fmt(equation.id === "right" ? right : left)} isn’t ${fmt(equation.id === "right" ? left : right)}. ${fmt(x)} is not a solution. Try another value.`,
    );
  };
  onPick(el, (id) => {
    equationId = id;
    values.t = 0;
    limits.t = [0, SOLVE_TRIES.find((s) => s.id === id).tries.length - 1];
    tried = new Set();
    draw();
  });
  steppers(el, values, limits, draw);
  draw();
}

const STEPS = [
  {
    title: "Tapes and equations",
    widget: wTapes,
    body: withVars(
      "<p>A tape diagram shows how amounts fit together. A letter like <i>x</i> stands for a number we don’t know yet. An <b>equation</b> says two amounts are equal.</p><p>Pick a tape. Many different equations can describe the same tape.</p>",
    ),
    check: {
      kind: "mc",
      q: "Which equation matches this tape?",
      fig: partWhole(
        range(3).map(() => ({ n: 1, show: "x" })),
        "18",
        "Tape diagram: 3 equal pieces, each x, make 18",
      ),
      choices: [
        { id: "a", label: withVars("3x = 18") },
        { id: "b", label: withVars("x + 3 = 18") },
        { id: "c", label: withVars("18 · 3 = x") },
      ],
      answer: "a",
      why: {
        b: "x + 3 would be a piece x and a piece 3. This tape has 3 pieces that are each x.",
        c: "The whole tape is 18, not x. The 3 pieces of x make 18.",
      },
      explain: "Three equal pieces, each x, make 18: 3x = 18 (or x + x + x = 18). So x = 6. Check: 3 · 6 = 18 ✓",
    },
  },
  {
    title: "True or false?",
    widget: wTruth,
    body: withVars(
      "<p>An equation can be true or false. It’s <b>true</b> when both sides are the same amount, like a balanced hanger. An equation with a letter can be true for one value of the letter and false for another.</p><p>Pick an equation and change <i>x</i>.</p>",
    ),
    check: {
      kind: "num",
      q: "What number goes in the box to make this true? 9 + 6 = □ + 10",
      answer: 5,
      misc: [
        [
          15,
          "9 + 6 is 15, but the right side is □ + 10, not just □. Both sides must be the same amount: what plus 10 makes 15?",
        ],
        [
          25,
          "That adds all the numbers. The equal sign isn’t “the answer comes next.” It says 9 + 6 and □ + 10 are the same amount.",
        ],
      ],
      explain: "9 + 6 = 15, and 5 + 10 = 15 too, so the box is 5. Both sides are 15.",
    },
  },
  {
    title: "Solutions",
    widget: wSolutions,
    body: withVars(
      "<p>A <b>solution</b> to an equation is a value for the letter that makes the equation true. You can test a value by putting it in for the letter.</p><p>Try values until you find the one that works.</p>",
    ),
    check: {
      kind: "mc",
      q: `Which value of ${mathVar("x")} is a solution to 12 = 4 + ${mathVar("x")}?`,
      choices: [
        { id: "a", label: "8" },
        { id: "b", label: "16" },
        { id: "c", label: "3" },
      ],
      answer: "a",
      why: {
        b: "Put 16 in for x: 4 + 16 = 20, not 12. So 16 makes the equation false.",
        c: "Put 3 in for x: 4 + 3 = 7, not 12. (3 is 12 ÷ 4, but the equation adds 4. It doesn’t multiply.)",
      },
      explain: "Put 8 in for x: 4 + 8 = 12, so 12 = 12 is true. 8 is the solution.",
    },
  },
];
