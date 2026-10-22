/* Learn Putting It All Together (Grade 7 Unit 9), chapter 3: The floor plan and the neighborhood. Its widgets and steps;
   loaded by floor-plan.html. */
/* scales for the 8 cm by 5 cm plan: meters each centimeter stands for */
const PLAN_SCALES = [1, 2, 3];
/* Pick a scale: the real room is the plan's sides times the scale, and its area is those real sides multiplied. */
function wPlan(el) {
  const q = Q(el),
    w = 8,
    h = 5;
  el.innerHTML =
    seg(
      "Scale",
      PLAN_SCALES.map((each, i) => [i, `1 cm to ${each} m`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const each = PLAN_SCALES[index];
    press(el, index);
    q("f").innerHTML = roomFig(w, h, { tables: 6 });
    q("r").innerHTML =
      `At 1 cm to ${each} m, the room is ${w} × ${each} = ${w * each} m by ${h} × ${each} = ${h * each} m. ` +
      `Real area: ${w * each} × ${h * each} = <b>${w * each * h * each} square meters</b>` +
      (each > 1 ? `, ${each * each} times the plan’s ${w * h}.` : ".");
  };
  onPick(el, (id) => draw(+id));
  draw(1);
}

/* neighborhoods: [name, people, square km] */
const PLACES = [
  ["Maple Hill", 12000, 4],
  ["River Park", 9000, 2],
  ["Oak Flats", 15000, 6],
];
/* Pick a neighborhood: how crowded it is is the people per square kilometer, not the number of people. */
function wCrowded(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Neighborhood",
      PLACES.map(([name], i) => [i, name]),
    ) + `<p class="readout" data-r></p>`;
  const draw = (index) => {
    const [name, people, area] = PLACES[index];
    press(el, index);
    q("r").innerHTML =
      `${name}: ${people.toLocaleString("en-US")} people on ${area} square km. ` +
      `${people.toLocaleString("en-US")} ÷ ${area} = <b>${(people / area).toLocaleString("en-US")} people per square km</b>.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "From the plan to the room",
    widget: wPlan,
    body: "<p>A floor plan is a scale drawing. Multiply each length by the scale to get the real one. For the real area, multiply the real sides: the area grows by the scale times itself.</p><p>Pick a scale.</p>",
    check: {
      kind: "num",
      q: "A kitchen is 4 cm by 3 cm on a plan with the scale 1 cm to 2 m. What is its real area?",
      answer: 48,
      unit: "square meters",
      misc: [
        [12, "That’s the area on the plan. Scale each side to meters first."],
        [24, "Both sides are scaled by 2, so the area is scaled by 2 × 2."],
      ],
      explain: "The kitchen is 8 m by 6 m, so 8 × 6 = 48 square meters.",
    },
  },
  {
    title: "How crowded is it?",
    widget: wCrowded,
    body: "<p>To compare how crowded places are, find the number of people for each square kilometer. A place with more people can still be less crowded, if it’s bigger.</p><p>Pick a neighborhood.</p>",
    check: {
      kind: "mc",
      q: "Which neighborhood is more crowded: 12,000 people on 4 square km, or 9,000 people on 2 square km?",
      choices: [
        { id: "a", label: "12,000 people on 4 square km" },
        { id: "b", label: "9,000 people on 2 square km" },
      ],
      answer: "b",
      why: { a: "It has more people, but 12,000 ÷ 4 = 3,000 per square km, less than 9,000 ÷ 2 = 4,500." },
      explain: "9,000 ÷ 2 = 4,500 people per square km, more than 12,000 ÷ 4 = 3,000.",
    },
  },
];
