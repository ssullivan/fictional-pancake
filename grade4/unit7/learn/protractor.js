/* Learn Angles and Angle Measurement (Grade 4 Unit 7), chapter 4: Measure with a protractor. Its widgets and steps; loaded by protractor.html. */
/* angles to measure */
const MEASURE = [40, 75, 130, 155];
/* Pick an angle and which way its first ray points: read the scale that starts at 0 on that ray. */
function wMeasure(el) {
  const q = Q(el);
  let deg = 40,
    base = "right";
  el.innerHTML =
    `<div data-top>${seg(
      "Angle",
      MEASURE.map((d, i) => [d, `Angle ${i + 1}`]),
    )}</div><div data-bot>${seg("First ray points", [
      ["right", "Right"],
      ["left", "Left"],
    ])}</div>` + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    press(q("top"), deg);
    press(q("bot"), base);
    q("f").innerHTML = protractor(deg, { base });
    const [right, wrong] = base === "right" ? ["inner (white)", "outer (pink)"] : ["outer (pink)", "inner (white)"];
    q("r").innerHTML =
      `The first ray points ${base}, along the 0 of the ${right} scale. Read that scale where the blue ray crosses it: <b>${deg}°</b>. The ${wrong} scale says ${180 - deg}°, but it starts at 0 on the other side.`;
  };
  el.addEventListener("click", (e) => {
    const hit = segHit(e, ["top", "bot"]);
    if (!hit) return;
    if (hit[0] === "top") deg = +hit[1];
    else base = hit[1];
    draw();
  });
  draw();
}
/* Turn the blue ray on a protractor (a slider) and read its measure. */
function wTurnRay(el) {
  const q = Q(el);
  let deg = 50;
  el.innerHTML =
    degSlider("Turn the blue ray", 0, 180, deg) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    q("f").innerHTML = protractor(deg);
    q("r").innerHTML =
      `The first ray is on 0 of the inner scale, so the angle is <b>${deg}°</b>.` +
      (deg === 90
        ? " The rays are perpendicular: a right angle."
        : deg === 180
          ? " The rays point opposite ways: a straight angle."
          : deg === 0
            ? " The rays are on top of each other."
            : "");
  };
  onSlide(el, (value) => {
    deg = value;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Read the right scale",
    widget: wMeasure,
    body: "<p>A protractor measures angles in degrees. Put its center on the angle’s vertex and its base line along one ray. A protractor has two scales: read the one that starts at 0 on that ray.</p><p>Pick an angle and which way its first ray points.</p>",
    check: {
      kind: "mc",
      q: "What does the angle measure?",
      fig: protractor(65, { base: "left", label: "A protractor with an angle whose first ray points left" }),
      choices: [
        { id: "a", label: "65°" },
        { id: "b", label: "115°" },
        { id: "c", label: "60°" },
      ],
      answer: "a",
      why: {
        b: "That’s the scale that starts at 0 on the right. The first ray points left: read the scale that starts at 0 there.",
        c: "Look again between 60 and 70: the ray is halfway, at 65.",
      },
      explain: "The first ray points left, along the 0 of the outer scale. The blue ray crosses that scale at 65°.",
    },
  },
  {
    title: "Turn a ray",
    widget: wTurnRay,
    body: "<p>The bigger the turn, the bigger the measure. A right angle is 90°, a straight angle is 180°. Two lines that make a 90° angle are perpendicular.</p><p>Turn the blue ray and read its measure.</p>",
    check: {
      kind: "num",
      q: "What does the angle measure?",
      fig: protractor(110, { label: "A protractor with an angle whose first ray points right" }),
      answer: 110,
      unit: "degrees",
      misc: [
        [
          70,
          "That’s the scale that starts at 0 on the left. The first ray points right: read the scale that starts at 0 there.",
        ],
      ],
      explain:
        "The first ray points right, along the 0 of the inner scale. The blue ray crosses it at 110°: more than a right angle.",
    },
  },
];
