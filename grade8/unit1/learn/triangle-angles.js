/* Learn Rigid Transformations and Congruence (Grade 8 Unit 1), chapter 8: Angles in a triangle. Its widgets and steps; loaded
   by triangle-angles.html. */
/* Steppers change angles A and B in fives: angle C is whatever is left of 180°. */
function wSum(el) {
  const q = Q(el),
    /* the angles in fives: 10 is 50° */
    values = { a: 10, b: 12 };
  let last = { ...values };
  el.innerHTML =
    `<div class="wrow">${stepper("a", "Angle A")}${stepper("b", "Angle B")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* A and B together stay at most 170°, so C is at least 10°: a press past that is undone */
    if (5 * (values.a + values.b) > 170) Object.assign(values, last);
    last = { ...values };
    const a = 5 * values.a,
      b = 5 * values.b,
      c = 180 - a - b;
    q("a").textContent = `${a}°`;
    q("b").textContent = `${b}°`;
    q("f").innerHTML = triangleFig(a, b, { texts: [`${a}°`, `${b}°`, `${c}°`] });
    q("r").innerHTML =
      `${a}° + ${b}° + ${c}° = <b>180°</b>. ` +
      (c === 10
        ? "C can’t shrink any more here: A and B already use 170°."
        : a + b < 90
          ? "A and B are small, so C is big: it gets whatever is left."
          : "Make A or B bigger and C gets smaller, so the total stays 180°.");
  };
  steppers(el, values, { a: [3, 30], b: [3, 30] }, draw);
  draw();
}

/* Pick what to show: the angle at C matching A, the one matching B, or all three along the line through C. */
function wWhy(el) {
  const q = Q(el),
    a = 50,
    b = 60,
    c = 180 - a - b;
  el.innerHTML =
    seg("Show", [
      ["A", "Angle A’s match"],
      ["B", "Angle B’s match"],
      ["all", "All three at C"],
    ]) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (id) => {
    press(el, id);
    q("f").innerHTML = triangleFig(a, b, {
      parallel: true,
      texts: [id === "B" ? "" : `${a}°`, id === "A" ? "" : `${b}°`, id === "all" ? `${c}°` : ""],
      outside: [id === "B" ? "" : `${a}°`, id === "A" ? "" : `${b}°`],
      label: "Triangle ABC with a line through C parallel to AB",
    });
    q("r").innerHTML = {
      A: `The blue line through C is parallel to AB, and CA crosses them both. Angle A and the angle at C on the left are <b>alternate interior angles</b>, so they’re equal: ${a}°.`,
      B: `CB crosses the same two parallel lines. Angle B and the angle at C on the right are alternate interior angles too: ${b}°.`,
      all: `The three angles at C, ${a}° + ${c}° + ${b}°, make a straight line along the blue line: 180°. They’re the same sizes as angles A, C, and B, so <b>a triangle’s angles add up to 180°</b>.`,
    }[id];
  };
  onPick(el, draw);
  draw("A");
}

const STEPS = [
  {
    title: "Always 180°",
    widget: wSum,
    body: "<p>The three angles of any triangle add up to <b>180°</b>, a straight angle. Tear the corners off a paper triangle and line them up, and they make a straight line. So when you know two angles, the third is what’s left of 180°.</p><p>Change angles A and B.</p>",
    check: {
      kind: "num",
      q: "Two angles of a triangle are 35° and 85°. What is the third angle?",
      answer: 60,
      unit: "°",
      misc: [
        [120, "That adds the two angles you know. The third is what’s left of 180°."],
        [240, "A triangle’s angles add to 180°, not 360°."],
      ],
      explain: "180 − 35 − 85 = 60°.",
    },
  },
  {
    title: "Why: a parallel line",
    widget: wWhy,
    body: "<p>Here’s why it always works. Draw the line through C parallel to AB. Each side from C crosses two parallel lines, so it makes alternate interior angles: one matches A and one matches B. Those two and angle C sit along a straight line, so they add to 180°.</p><p>Show each step.</p>",
    check: {
      kind: "num",
      q: "A line through corner C of triangle ABC is parallel to side AB. The angles it makes with sides CA and CB are 50° and 60°. What is angle C?",
      answer: 70,
      unit: "°",
      misc: [
        [110, "That’s the two outside angles together. All three angles at C make a straight line: 180°."],
        [130, "There are three angles along the line at C: take both outside ones away from 180°."],
      ],
      explain: "The three angles at C make a straight line: 180 − 50 − 60 = 70°.",
    },
  },
];
