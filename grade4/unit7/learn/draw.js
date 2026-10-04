/* Learn Angles and Angle Measurement (Grade 4 Unit 7), chapter 5: Draw and name angles. Its widgets and steps; loaded by draw.html. */
/* angles to draw */
const TARGETS = [35, 90, 145];
/* Pick an angle to draw, then turn the blue ray (a slider) until it matches. */
function wDraw(el) {
  const q = Q(el);
  let target = 35,
    deg = 0;
  el.innerHTML =
    seg(
      "Draw",
      TARGETS.map((d) => [d, `${d}°`]),
    ) +
    degSlider("Turn the blue ray", 0, 180, deg) +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    press(el, target);
    q("f").innerHTML = protractor(deg);
    q("r").innerHTML =
      deg === target
        ? `<span class="ok">Exactly ${target}°!</span> That’s ${angleKind(target) === "right" ? "a right angle" : `an ${angleKind(target)} angle`}.`
        : `Draw ${target}°. The ray is at ${deg}°: turn it ${deg < target ? `${target - deg}° more` : `back ${deg - target}°`}.`;
  };
  onSlide(el, (value) => {
    deg = value;
    draw();
  });
  onPick(el, (m) => {
    target = +m;
    draw();
  });
  draw();
}
/* Open an angle (a slider) and name its kind. */
function wKinds(el) {
  const q = Q(el);
  let deg = 45;
  el.innerHTML =
    degSlider("Open the angle", 5, 180, deg) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    q("f").innerHTML = angleFig(deg, { text: `${deg}°` });
    const kind = angleKind(deg);
    q("r").innerHTML = `<b>${kind[0].toUpperCase() + kind.slice(1)}</b>: ${
      kind === "acute"
        ? "less than 90°"
        : kind === "right"
          ? "exactly 90°"
          : kind === "obtuse"
            ? "more than 90° and less than 180°"
            : "exactly 180°, a half turn"
    }.`;
  };
  onSlide(el, (value) => {
    deg = value;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Draw an angle",
    widget: wDraw,
    body: "<p>To draw an angle, draw one ray and put the protractor’s center at its endpoint, with the base line along the ray. Find the measure on the scale that starts at 0 on that ray, make a mark, and draw the second ray through it.</p><p>Pick an angle, then turn the blue ray to draw it.</p>",
    check: {
      kind: "mc",
      q: "Clare draws a ray pointing left and wants a 70° angle. On the protractor, where does the second ray go?",
      choices: [
        { id: "a", label: "Through 70 on the scale that starts at 0 on the left" },
        { id: "b", label: "Through 70 on the scale that starts at 0 on the right" },
        { id: "c", label: "Through 110 on the scale that starts at 0 on the left" },
      ],
      answer: "a",
      why: {
        b: "That scale counts from the right, but Clare’s ray points left. That would make a 110° angle.",
        c: "On the scale that starts at 0 on the left, 110 makes a 110° angle.",
      },
      explain:
        "Count from 0 on the ray you drew: it points left, so use the scale that starts at 0 on the left, and go to 70.",
    },
  },
  {
    title: "Kinds of angles",
    widget: wKinds,
    body: "<p>Angles are named by size. An <b>acute</b> angle is less than 90°. A <b>right</b> angle is exactly 90°. An <b>obtuse</b> angle is between 90° and 180°. A <b>straight</b> angle is exactly 180°.</p><p>Open the angle.</p>",
    check: {
      kind: "mc",
      q: "An angle measures 95°. What kind of angle is it?",
      choices: [
        { id: "a", label: "Acute" },
        { id: "b", label: "Right" },
        { id: "c", label: "Obtuse" },
      ],
      answer: "c",
      why: {
        a: "Acute angles are less than 90°. 95° is more.",
        b: "A right angle is exactly 90°. 95° is a little more.",
      },
      explain: "95° is more than 90° and less than 180°, so it’s obtuse.",
    },
  },
];
