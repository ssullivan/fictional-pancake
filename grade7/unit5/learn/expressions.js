/* Learn Rational Number Arithmetic (Grade 7 Unit 5), chapter 5: Expressions and equations. Its widgets and steps; loaded
   by expressions.html. */
/* Change x: the value of 3x − 4, multiplying first. */
function wEvaluate(el) {
  const q = Q(el),
    values = { xv: -2 },
    x = mathVar("x");
  el.innerHTML = `<p class="eq">3${x} − 4</p><div class="wrow">${stepper("xv", "x")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const { xv } = values;
    q("xv").textContent = fmt(xv);
    q("r").innerHTML = `When ${x} = ${fmt(xv)}: 3 × ${par(xv)} − 4 = ${fmt(3 * xv)} − 4 = <b>${fmt(3 * xv - 4)}</b>.`;
  };
  steppers(el, values, { xv: [-5, 5] }, draw);
  draw();
}

/* equations to solve: [label, how to undo, the answer, the check] */
const EQUATIONS = [
  ["x + 6 = −2", "Subtract 6 from both sides: x = −2 − 6.", -8, "−8 + 6 = −2"],
  ["−3x = 12", "Divide both sides by −3: x = 12 ÷ (−3).", -4, "−3 × (−4) = 12"],
  ["x − (−4) = 1", "Subtracting −4 is adding 4. Subtract 4 from both sides: x = 1 − 4.", -3, "−3 − (−4) = 1"],
  ["−2x = −10", "Divide both sides by −2: x = −10 ÷ (−2).", 5, "−2 × 5 = −10"],
];
/* Pick an equation: undo what's done to x, the same on both sides, and check by putting the answer back in. */
function wSolve(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Equation",
      EQUATIONS.map(([label], i) => [i, label]),
    ) + `<p class="readout" data-r></p>`;
  const draw = (index) => {
    const [label, how, answer, check] = EQUATIONS[index];
    press(el, index);
    q("r").innerHTML =
      `${withVars(label)}: ${withVars(how)} So <b>${withVars(`x = ${fmt(answer)}`)}</b>. Check: ${check} ✓`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "Expressions with negative numbers",
    widget: wEvaluate,
    body: `<p>To find the value of an expression, put the number in for the letter and follow the order of operations: multiply before you add or subtract. Keep track of the signs.</p><p>Change ${mathVar("x")}.</p>`,
    check: {
      kind: "num",
      q: `What is the value of −2${mathVar("x")} + 5 when ${mathVar("x")} = −3?`,
      answer: 11,
      neg: true,
      misc: [
        [-1, "Check the sign of −2 × (−3): two negatives make a positive."],
        [4, "Multiply first: −2 × (−3) = 6, then add 5."],
      ],
      explain: "−2 × (−3) = 6, and 6 + 5 = 11.",
    },
  },
  {
    title: "Solving equations",
    widget: wSolve,
    body: "<p>Solve an equation with negative numbers the same way as before: do the same thing to both sides to undo what’s done to the letter. Then check by putting the answer back in.</p><p>Pick an equation.</p>",
    check: {
      kind: "num",
      q: `Solve: −5${mathVar("x")} = 35`,
      answer: -7,
      neg: true,
      misc: [
        [7, "Check: −5 × 7 = −35, not 35."],
        [40, "Undo multiplying by dividing, not subtracting."],
      ],
      explain: "x = 35 ÷ (−5) = −7. Check: −5 × (−7) = 35.",
    },
  },
];
