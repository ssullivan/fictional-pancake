/* Learn Putting It All Together (Grade 7 Unit 9), chapter 4: Measuring the course. Its widgets and steps; loaded by
   measuring.html. */
/* Change the clicks of a trundle wheel 1 m around: each click is one turn, one meter. */
function wTrundle(el) {
  const q = Q(el),
    values = { hundreds: 2 };
  el.innerHTML = `<div class="wrow">${stepper("hundreds", "Clicks (hundreds)")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const clicks = values.hundreds * 100;
    q("hundreds").textContent = clicks;
    q("f").innerHTML = wheelFig("1 m", clicks);
    q("r").innerHTML =
      `Each click is one turn of the wheel, which rolls it its circumference, 1 m. ${clicks} clicks: <b>${clicks} m</b>` +
      (clicks >= 1000 ? `, or ${fmt(clicks / 1000)} km.` : ".");
  };
  steppers(el, values, { hundreds: [1, 20] }, draw);
  draw();
}

/* measurements of a 5 km course, in km */
const MEASURED = [4.8, 5.1, 5.25, 4.5];
/* Pick a measurement of the 5 km course: the percent error is how far off it is, out of the real 5 km. */
function wError(el) {
  const q = Q(el),
    actual = 5;
  el.innerHTML =
    seg(
      "Measured",
      MEASURED.map((m, i) => [i, `${m} km`]),
    ) + `<p class="readout" data-r></p>`;
  const draw = (index) => {
    const measured = MEASURED[index],
      off = Math.abs(measured - actual);
    press(el, index);
    q("r").innerHTML =
      `${fmt(measured)} km is ${fmt(off)} km ${measured > actual ? "too long" : "too short"}. ` +
      `${fmt(off)} ÷ 5 = ${fmt(off / actual)}: a <b>${fmt((100 * off) / actual)}% error</b>.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "A trundle wheel",
    widget: wTrundle,
    body: "<p>A trundle wheel measures long distances by rolling. It clicks once each turn, and each turn rolls it one circumference, so the distance is the clicks times the circumference.</p><p>Change the clicks.</p>",
    check: {
      kind: "num",
      q: "A trundle wheel is 1.5 m around. It clicks 200 times along a path. How long is the path?",
      answer: 300,
      unit: "m",
      misc: [
        [200, "That’s the clicks. Each one is 1.5 m."],
        [133.33, "Multiply the clicks by the circumference, don’t divide."],
      ],
      explain: "200 × 1.5 = 300 m.",
    },
  },
  {
    title: "How close is the measurement?",
    widget: wError,
    body: "<p>No measurement is perfect. The <b>percent error</b> says how far off it is as a percent of the real length, so errors on long and short courses can be compared.</p><p>Pick a measurement.</p>",
    check: {
      kind: "num",
      q: "A 2 km route is measured as 2.1 km. What is the percent error?",
      answer: 5,
      unit: "%",
      misc: [
        [0.1, "That’s the error in km. Write it as a percent of 2 km."],
        [4.76, "Compare the error to the real length, 2 km, not the measurement."],
      ],
      explain: "The error is 0.1 km, and 0.1 ÷ 2 = 0.05: a 5% error.",
    },
  },
];
