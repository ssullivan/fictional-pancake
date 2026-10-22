/* Learn Expressions, Equations, and Inequalities (Grade 7 Unit 6), chapter 3: Inequalities. Its widgets and steps; loaded
   by inequalities.html. */
const x = mathVar("x");
/* the inequality signs, and what each says */
const SIGNS = [
  [">", "greater than"],
  ["≥", "greater than or equal to"],
  ["<", "less than"],
  ["≤", "less than or equal to"],
];
/* Pick a sign and change the boundary: the graph is a circle at the boundary (hollow if it's left out) and a ray to the
   solutions. */
function wGraph(el) {
  const q = Q(el),
    values = { edge: -2 };
  let signIndex = 0;
  el.innerHTML =
    seg(
      "Sign",
      SIGNS.map(([sign], i) => [i, sign]),
    ) +
    `<div class="wrow">${stepper("edge", "Boundary")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [sign, words] = SIGNS[signIndex],
      { edge } = values,
      open = sign === ">" || sign === "<",
      dir = sign === ">" || sign === "≥" ? 1 : -1;
    press(el, signIndex);
    q("edge").textContent = fmt(edge);
    q("f").innerHTML = signedLine(-8, 8, { ray: { v: edge, dir, open } });
    q("r").innerHTML =
      `${x} ${sign} ${fmt(edge)}: every number ${words} ${fmt(edge)}. The circle at ${fmt(edge)} is <b>${open ? "hollow" : "filled in"}</b>, ` +
      `since ${fmt(edge)} ${open ? "isn’t" : "is"} a solution, and the ray points ${dir > 0 ? "right" : "left"}.`;
  };
  steppers(el, values, { edge: [-6, 6] }, draw);
  onPick(el, (id) => {
    signIndex = +id;
    draw();
  });
  draw();
}

/* inequalities to solve: [label, boundary work, a test, the solution] */
const TO_SOLVE = [
  ["3x + 2 > 14", "3x + 2 = 14 when x = 4.", "Test 5: 3 × 5 + 2 = 17 > 14 ✓", "x > 4"],
  [
    "−2x + 1 ≥ 9",
    "−2x + 1 = 9 when x = −4.",
    "Test 0: −2 × 0 + 1 = 1, not ≥ 9 ✗, so the solutions are on the other side",
    "x ≤ −4",
  ],
  ["5 − x < 2", "5 − x = 2 when x = 3.", "Test 4: 5 − 4 = 1 < 2 ✓", "x > 3"],
];
/* Pick an inequality: solve the equation for the boundary, then test a number to find which side the solutions are on. */
function wSolve(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Inequality",
      TO_SOLVE.map(([label], i) => [i, label]),
    ) + `<p class="readout" data-r></p>`;
  const draw = (index) => {
    const [label, boundary, test, answer] = TO_SOLVE[index];
    press(el, index);
    q("r").innerHTML = `${withVars(label)}: ${withVars(boundary)} ${withVars(test)}. So <b>${withVars(answer)}</b>.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* Change the rides: $10 to get in and $4 a ride must be at most $50. */
function wBudget(el) {
  const q = Q(el),
    values = { rides: 8 };
  el.innerHTML = `<p class="eq">10 + 4${x} ≤ 50</p><div class="wrow">${stepper("rides", "Rides")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const { rides } = values,
      cost = 10 + 4 * rides,
      fits = cost <= 50;
    q("rides").textContent = rides;
    q("r").innerHTML =
      `${rides} rides cost 10 + 4 × ${rides} = $${cost}. ` +
      (fits
        ? `<span class="ok">That fits the $50.</span>${rides === 10 ? " It’s the most: 11 rides would cost $54." : ""}`
        : `<span class="no">Over the $50.</span>`);
  };
  steppers(el, values, { rides: [0, 12] }, draw);
  draw();
}

const STEPS = [
  {
    title: "Graphing solutions",
    widget: wGraph,
    body: `<p>An inequality like ${x} > −2 has many solutions: every number greater than −2. Its graph is a circle at −2 and a ray toward the solutions. A hollow circle means −2 itself isn’t a solution (&gt; or &lt;); a filled one means it is (≥ or ≤).</p><p>Pick a sign and change the boundary.</p>`,
    check: {
      kind: "mc",
      q: `Which number is a solution of ${x} ≤ −3?`,
      choices: [
        { id: "a", label: "−2" },
        { id: "b", label: "−3" },
        { id: "c", label: "0" },
      ],
      answer: "b",
      why: {
        a: "−2 is greater than −3: it’s to the right on the number line.",
        c: "0 is greater than −3.",
      },
      explain: "≤ includes the boundary, so −3 itself is a solution.",
    },
  },
  {
    title: "Solving inequalities",
    widget: wSolve,
    body: "<p>To solve an inequality, solve the matching equation to find the boundary, then test a number on one side. If it works, the solutions are on that side. Dividing by a negative turns the sign around, and testing catches it.</p><p>Pick an inequality.</p>",
    check: {
      kind: "mc",
      q: `Solve: −3${x} > 12`,
      choices: [
        { id: "a", label: `${x} > −4` },
        { id: "b", label: `${x} < −4` },
        { id: "c", label: `${x} > 4` },
      ],
      answer: "b",
      why: {
        a: "Test 0: −3 × 0 = 0, not > 12. Dividing by −3 turns the sign around.",
        c: "The boundary is 12 ÷ (−3) = −4.",
      },
      explain: "−3x = 12 when x = −4. Testing −5: −3 × (−5) = 15 > 12 ✓, so x < −4.",
    },
  },
  {
    title: "The most a budget allows",
    widget: wBudget,
    body: "<p>Inequalities model limits like “at most $50.” Solve the inequality, then think about the story: you can’t take part of a ride, so the answer is a whole number.</p><p>Change the rides.</p>",
    check: {
      kind: "num",
      q: "A gym charges $15 to join and $6 a class. Jada can spend at most $60. What is the most classes Jada can take?",
      answer: 7,
      unit: "classes",
      misc: [
        [7.5, "There’s no half a class. Round down to a whole number that fits."],
        [8, "8 classes cost 15 + 48 = $63, more than $60."],
        [10, "Don’t forget the $15 to join."],
      ],
      explain: "15 + 6x ≤ 60 means x ≤ 7.5, so the most is 7 classes.",
    },
  },
];
