/* Learn Angles, Triangles, and Prisms (Grade 7 Unit 7), chapter 3: Building triangles. Its widgets and steps; loaded by
   triangles.html. */
/* Change three side lengths: they make a triangle only when the two shortest add up to more than the longest. */
function wSides(el) {
  const q = Q(el),
    values = { a: 5, b: 6, c: 9 };
  el.innerHTML =
    `<div class="wrow">${stepper("a", "Side 1")}${stepper("b", "Side 2")}${stepper("c", "Side 3")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { a, b, c } = values,
      [short1, short2, long] = [a, b, c].sort((u, v) => u - v),
      makes = short1 + short2 > long;
    ["a", "b", "c"].forEach((k) => (q(k).textContent = values[k]));
    q("f").innerHTML = triFig(a, b, c);
    q("r").innerHTML =
      `The two shortest: ${short1} + ${short2} = ${short1 + short2}. ` +
      (makes
        ? `<span class="ok">That’s more than ${long}, so they make a triangle.</span>`
        : short1 + short2 === long
          ? `<span class="no">That’s exactly ${long}: they lie flat on it and can’t make a corner.</span>`
          : `<span class="no">That’s less than ${long}: they can’t reach each other.</span>`);
  };
  steppers(el, values, { a: [2, 12], b: [2, 12], c: [2, 12] }, draw);
  draw();
}

/* conditions for a triangle, and how many triangles they make */
const CONDITIONS = [
  [
    "Three angles",
    "40°, 60°, 80°",
    "Many: the angles fix the shape but not the size. Any scaled copy has the same angles.",
  ],
  ["Three sides", "5, 6, 7", "Exactly one: three sides that can meet fix the triangle completely."],
  [
    "Two sides and the angle between",
    "4, 6, and 50° between them",
    "Exactly one: the angle fixes where the sides end, and the third side joins them.",
  ],
  ["Sides that can’t meet", "2, 3, 8", "None: 2 + 3 isn’t more than 8."],
];
/* Pick some conditions: they make one triangle, many, or none. */
function wHowMany(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Conditions",
      CONDITIONS.map(([label], i) => [i, label]),
    ) + `<p class="readout" data-r></p>`;
  const draw = (index) => {
    const [label, measures, verdict] = CONDITIONS[index];
    press(el, index);
    q("r").innerHTML =
      `${label}: ${measures}. <b>${verdict.split(":")[0]}</b>:${verdict.split(":").slice(1).join(":")}`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "Can these sides make a triangle?",
    widget: wSides,
    body: "<p>Not every three lengths make a triangle. The two shorter sides have to reach each other over the longest one, so together they must be <b>longer</b> than it.</p><p>Change the sides.</p>",
    check: {
      kind: "mc",
      q: "Which three lengths (in cm) can’t make a triangle?",
      choices: [
        { id: "a", label: "4, 5, 8" },
        { id: "b", label: "3, 4, 7" },
        { id: "c", label: "6, 6, 6" },
      ],
      answer: "b",
      why: {
        a: "4 + 5 = 9 is more than 8: they make a triangle.",
        c: "6 + 6 = 12 is more than 6: they make a triangle.",
      },
      explain: "3 + 4 = 7 is exactly the longest side, not more, so they lie flat.",
    },
  },
  {
    title: "One triangle, many, or none?",
    widget: wHowMany,
    body: "<p>Some measures fix a triangle completely: every triangle drawn with them is the same. Others, like three angles, allow many triangles of different sizes. And some can’t make a triangle at all.</p><p>Pick some conditions.</p>",
    check: {
      kind: "mc",
      q: "How many different triangles have angles of 30°, 60°, and 90°?",
      choices: [
        { id: "a", label: "Exactly one" },
        { id: "b", label: "Many, all different sizes" },
        { id: "c", label: "None" },
      ],
      answer: "b",
      why: {
        a: "The angles fix the shape, but you can draw it bigger or smaller.",
        c: "30 + 60 + 90 = 180, so these angles do make triangles.",
      },
      explain: "Three angles fix the shape, not the size: there are many, all scaled copies of each other.",
    },
  },
];
