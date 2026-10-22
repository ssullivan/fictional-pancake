/* Learn Shapes on the Coordinate Plane (Grade 5 Unit 7), chapter 4: Two patterns at once. Its widgets and steps; loaded by
   patterns.html. */
/* Step what each rule adds, starting both at 0: see the two patterns side by side and how they're related. */
function wRules(el) {
  const q = Q(el),
    values = { first: 3, second: 6 },
    limits = { first: [1, 5], second: [1, 9] };
  el.innerHTML =
    `<div class="wrow">${stepper("first", "Rule A adds")}${stepper("second", "Rule B adds")}</div>` +
    `<table class="pattern" data-t></table><p class="readout" data-r></p>`;
  const draw = () => {
    const { first, second } = values,
      terms = range(6);
    q("first").textContent = first;
    q("second").textContent = second;
    q("t").innerHTML =
      `<tr><th>Rule A</th>${terms.map((i) => `<td>${i * first}</td>`).join("")}</tr>` +
      `<tr><th>Rule B</th>${terms.map((i) => `<td>${i * second}</td>`).join("")}</tr>`;
    q("r").innerHTML =
      second % first === 0
        ? `Rule B adds ${second / first} times as much, so <b>each Rule B number is ${second / first} times the Rule A number</b>: ${2 * first} × ${second / first} = ${2 * second}.`
        : `Rule B adds ${second}, and ${second} isn’t a whole number times ${first}: each Rule B number is ${fr(second, first)} of the Rule A number.`;
  };
  steppers(el, values, limits, draw);
  draw();
}
/* Graph the pairs (Rule A, Rule B) for Rule A adding 2 and Rule B adding a step (a stepper): they line up from (0, 0). */
function wGraph(el) {
  const q = Q(el),
    values = { second: 3 },
    limits = { second: [1, 3] };
  el.innerHTML = `<div class="wrow">${stepper("second", "Rule B adds")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const second = values.second,
      pairs = range(5).map((i) => [2 * i, second * i]);
    q("second").textContent = second;
    q("f").innerHTML = coordPlane(
      pairs.map(([x, y]) => ({ x, y })),
      {
        xMax: 10,
        yMax: 12,
        yStep: 2,
        width: 300,
        height: 240,
        xLabel: "Rule A",
        yLabel: "Rule B",
        label: `The pairs ${pairs.map(ptText).join(", ")}`,
      },
    );
    q("r").innerHTML =
      `Rule A adds 2 and Rule B adds ${second}. The pairs are ${pairs.map(ptText).join(", ")}. They line up from (0, 0): every 2 across, ${second} up.`;
  };
  steppers(el, values, limits, draw);
  draw();
}
const STEPS = [
  {
    title: "Compare two rules",
    widget: wRules,
    body: "<p>Two patterns can follow two rules side by side. When both start at 0 and Rule B adds 2 times as much as Rule A, every Rule B number is 2 times the matching Rule A number.</p><p>Change what each rule adds.</p>",
    check: {
      kind: "num",
      q: "Rule A starts at 0 and adds 3. Rule B starts at 0 and adds 6. When Rule A’s number is 12, what is Rule B’s?",
      answer: 24,
      unit: "",
      misc: [
        [15, "That adds 3. Rule B adds twice as much, so its numbers are 2 times Rule A’s."],
        [36, "That’s 3 times. 6 is 2 times 3, so Rule B’s numbers are 2 times Rule A’s."],
      ],
      explain: "Rule B adds 2 times as much as Rule A, so 12 × 2 = 24.",
    },
  },
  {
    title: "Graph the pairs",
    widget: wGraph,
    body: "<p>Write each Rule A number with its matching Rule B number as an <b>ordered pair</b>: (Rule A, Rule B). Plotted on a grid, the pairs line up, starting at (0, 0).</p><p>Change what Rule B adds.</p>",
    check: {
      kind: "mc",
      q: "Rule A starts at 0 and adds 2. Rule B starts at 0 and adds 6. Which ordered pair belongs to the patterns?",
      answer: "b",
      choices: [
        { id: "a", label: "(4, 10)" },
        { id: "b", label: "(4, 12)" },
        { id: "c", label: "(12, 4)" },
      ],
      why: {
        a: "When Rule A is 4, Rule B has added 6 twice: 12.",
        c: "That swaps the numbers. Rule A’s number comes first.",
      },
      explain: "After two steps, Rule A is 4 and Rule B is 12: (4, 12).",
    },
  },
];
