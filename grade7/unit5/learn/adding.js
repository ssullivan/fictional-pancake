/* Learn Rational Number Arithmetic (Grade 7 Unit 5), chapter 1: Adding signed numbers. Its widgets and steps; loaded by
   adding.html. */
/* Change the noon temperature and the change by evening: the evening temperature is their sum, on a thermometer. */
function wTemp(el) {
  const q = Q(el),
    values = { start: -3, change: 8 };
  el.innerHTML =
    `<div class="wrow">${stepper("start", "Noon (°F)")}${stepper("change", "Change")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { start, change } = values,
      end = start + change;
    q("start").textContent = fmt(start);
    q("change").textContent = withSign(change);
    q("f").innerHTML = vLine(-20, 20, {
      kind: "temp",
      unit: "°",
      value: end,
      pts: [
        { v: start, t: "noon", cls: "b" },
        { v: end, t: "evening" },
      ],
    });
    q("r").innerHTML =
      `${fmt(start)} + ${par(change)} = <b>${fmt(end)}°F</b>. ` +
      (change > 0
        ? `The temperature rose ${change}°.`
        : change < 0
          ? `The temperature dropped ${-change}°.`
          : "No change.") +
      (start < 0 !== end < 0 && start !== 0 && end !== 0 ? " It crossed zero." : "");
  };
  steppers(el, values, { start: [-10, 10], change: [-10, 10] }, draw);
  draw();
}

/* Change two numbers: their sum is a jump from 0 to the first, then a jump the length of the second. */
function wJumps(el) {
  const q = Q(el),
    values = { a: 5, b: -8 };
  el.innerHTML =
    `<div class="wrow">${stepper("a", "First")}${stepper("b", "Second")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { a, b } = values,
      sum = a + b,
      sameSign = a * b > 0;
    q("a").textContent = fmt(a);
    q("b").textContent = fmt(b);
    q("f").innerHTML = signedLine(-16, 16, {
      every: 4,
      moves: [
        { a: 0, b: a, t: fmt(a) },
        { a, b: sum, t: withSign(b), lv: 1, cls: "b" },
      ],
      pts: [{ v: sum, t: fmt(sum) }],
    });
    q("r").innerHTML =
      `${fmt(a)} + ${par(b)} = <b>${fmt(sum)}</b>. ` +
      (a === 0 || b === 0
        ? "Adding 0 changes nothing."
        : sameSign
          ? `Same signs: add the distances from 0, ${Math.abs(a)} + ${Math.abs(b)} = ${Math.abs(sum)}, and keep the sign.`
          : sum === 0
            ? "Opposites: they cancel out to 0."
            : `Different signs: they cancel partway. ${Math.max(Math.abs(a), Math.abs(b))} − ${Math.min(Math.abs(a), Math.abs(b))} = ${Math.abs(sum)}, with the sign of the one farther from 0.`);
  };
  steppers(el, values, { a: [-8, 8], b: [-8, 8] }, draw);
  draw();
}

const STEPS = [
  {
    title: "Rising and falling temperatures",
    widget: wTemp,
    body: "<p>Negative numbers describe things below zero, like temperatures. A rise is a positive change and a drop is a negative one. Add the change to the starting temperature to find the new one.</p><p>Change the noon temperature and the change.</p>",
    check: {
      kind: "num",
      q: "It was −4°F in the morning. By noon the temperature had risen 9°. What was the temperature at noon?",
      answer: 5,
      neg: true,
      unit: "°F",
      misc: [
        [-13, "That goes down 9. The temperature rose: move up."],
        [13, "Count from −4 up through 0: 4 degrees to 0, then 5 more."],
        [-5, "Check the sign: rising 9 from −4 passes 0."],
      ],
      explain: "−4 + 9 = 5°F: 4 degrees up to 0, and 5 more.",
    },
  },
  {
    title: "Adding on the number line",
    widget: wJumps,
    body: "<p>Adding a positive number moves right on the number line, and adding a negative number moves left. When the signs are the same, the distances add. When they’re different, they cancel out partway: subtract the distances and use the sign of the one farther from 0.</p><p>Change the two numbers.</p>",
    check: {
      kind: "num",
      q: "What is −7 + 3?",
      answer: -4,
      neg: true,
      misc: [
        [4, "Check the sign: −7 is farther from 0 than 3."],
        [-10, "That adds the distances. The signs are different, so they cancel partway: 7 − 3."],
        [10, "The signs are different: they cancel partway."],
      ],
      explain: "Start at −7 and move 3 right: −4.",
    },
  },
];
