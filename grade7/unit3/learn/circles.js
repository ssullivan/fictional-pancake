/* Learn Measuring Circles (Grade 7 Unit 3), chapter 1: Radius and diameter. Its widgets and steps; loaded by circles.html. */
/* Change the radius: the diameter is always two radii. */
function wRadius(el) {
  const q = Q(el),
    values = { radius: 4 };
  el.innerHTML = `<div class="wrow">${stepper("radius", "Radius (cm)")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { radius: r } = values;
    q("radius").textContent = r;
    q("f").innerHTML = circleFig({
      size: 60 + r * 16,
      segs: ["radius", "diameter"],
      labels: { radius: `${r} cm`, diameter: `${2 * r} cm` },
      hi: "diameter",
      label: `A circle with radius ${r} cm and diameter ${2 * r} cm`,
    });
    q("r").innerHTML =
      `The <b>radius</b> goes from the center to the edge: ${r} cm. Every point on the circle is ${r} cm from the center. ` +
      `The <b>diameter</b> goes all the way across, through the center: 2 × ${r} = <b>${2 * r} cm</b>.`;
  };
  steppers(el, values, { radius: [1, 8] }, draw);
  draw();
}

const STEPS = [
  {
    title: "Radius and diameter",
    widget: wRadius,
    body: "<p>A <b>circle</b> is all the points the same distance from its <b>center</b>. That distance is the <b>radius</b>. A <b>diameter</b> goes from one side to the other through the center, so it’s two radii long.</p><p>Change the radius.</p>",
    check: {
      kind: "num",
      q: "A round clock has a radius of 9 cm. What is its diameter?",
      answer: 18,
      unit: "cm",
      misc: [
        [4.5, "That halves the radius. The diameter is two radii: double it."],
        [9, "That’s the radius. The diameter goes all the way across."],
      ],
      explain: "The diameter is two radii: 2 × 9 = 18 cm.",
    },
  },
];
