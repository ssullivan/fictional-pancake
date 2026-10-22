/* Learn Rational Number Arithmetic (Grade 7 Unit 5), chapter 4: Dividing and negative rates. Its widgets and steps; loaded
   by dividing.html. */
/* multiplication facts to divide back: [a, b], with a × b */
const FACTS = [
  [3, -4],
  [-5, 6],
  [-2, -9],
];
/* Pick a multiplication fact: each one gives two divisions, and the signs follow the same rules. */
function wDivide(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Fact",
      FACTS.map(([a, b], i) => [i, `${par(a)} × ${par(b)}`]),
    ) + `<p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [a, b] = FACTS[index],
      product = a * b;
    press(el, index);
    q("e").innerHTML = `${par(a)} × ${par(b)} = ${fmt(product)}`;
    q("r").innerHTML =
      `So <b>${fmt(product)} ÷ ${par(a)} = ${fmt(b)}</b> and <b>${fmt(product)} ÷ ${par(b)} = ${fmt(a)}</b>. ` +
      `Dividing undoes multiplying: same signs give a positive quotient, different signs a negative one.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* Change the hours from now: a temperature of 6°F falling 3° an hour is 6 + (−3) × hours, in the past too. */
function wRate(el) {
  const q = Q(el),
    now = 6,
    rate = -3,
    values = { hours: 2 };
  el.innerHTML = `<div class="wrow">${stepper("hours", "Hours from now")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { hours } = values,
      temp = now + rate * hours;
    q("hours").textContent = withSign(hours);
    q("f").innerHTML = vLine(-10, 20, {
      kind: "temp",
      unit: "°",
      value: temp,
      pts: [
        { v: now, t: "now", cls: "b" },
        ...(hours ? [{ v: temp, t: hours > 0 ? `in ${hours} h` : `${-hours} h ago` }] : []),
      ],
    });
    q("r").innerHTML =
      `The temperature changes ${fmt(rate)}° each hour. ${now} + (${fmt(rate)}) × ${par(hours)} = <b>${fmt(temp)}°F</b>` +
      (hours < 0 ? ": warmer in the past, since it has been falling." : hours > 0 ? ": colder later." : ", right now.");
  };
  steppers(el, values, { hours: [-4, 6] }, draw);
  draw();
}

const STEPS = [
  {
    title: "Dividing undoes multiplying",
    widget: wDivide,
    body: "<p>Every multiplication fact gives two division facts. Since 3 × (−4) = −12, −12 ÷ 3 = −4 and −12 ÷ (−4) = 3. The sign rules are the same as for multiplying.</p><p>Pick a fact.</p>",
    check: {
      kind: "num",
      q: "What is −45 ÷ 9?",
      answer: -5,
      neg: true,
      misc: [
        [5, "Different signs give a negative quotient."],
        [-36, "That adds. What times 9 makes −45?"],
      ],
      explain: "9 × (−5) = −45, so −45 ÷ 9 = −5.",
    },
  },
  {
    title: "Negative rates",
    widget: wRate,
    body: "<p>A rate can be negative: a temperature falling 3° an hour changes −3° each hour. Multiply the rate by the hours to find the change, with negative hours for the past.</p><p>Change the hours.</p>",
    check: {
      kind: "num",
      q: "A pool’s water level drops 2 cm every hour. What is the change in the water level after 5 hours?",
      answer: -10,
      neg: true,
      unit: "cm",
      misc: [
        [10, "The level drops, so the change is negative."],
        [-7, "That adds. Multiply the rate by the hours: (−2) × 5."],
      ],
      explain: "(−2) × 5 = −10: the level is 10 cm lower.",
    },
  },
];
