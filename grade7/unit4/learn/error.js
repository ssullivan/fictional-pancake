/* Learn Proportional Relationships and Percentages (Grade 7 Unit 4), chapter 5: Measurement error. Its widgets and steps;
   loaded by error.html. */
/* Change a guess at a 50 cm desk: the error is how far off it is, and the percent error compares that to the real 50 cm. */
function wError(el) {
  const q = Q(el),
    actual = 50,
    values = { guess: 45 };
  el.innerHTML = `<div class="wrow">${stepper("guess", "Measured (cm)")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const { guess } = values,
      off = Math.abs(guess - actual);
    q("guess").textContent = guess;
    q("r").innerHTML = off
      ? `The desk is really ${actual} cm. The measurement is off by <b>${off} cm</b>, the measurement error. ` +
        `As a percent of the real ${actual} cm: ${off} ÷ ${actual} = ${fmt(off / actual)}, a <b>${fmt((100 * off) / actual)}% error</b>.`
      : `Exactly right: no error.`;
  };
  steppers(el, values, { guess: [40, 60] }, draw);
  draw();
}

/* Pick give-or-take percents for a 500 g bag: it could be anywhere from 500 − p% to 500 + p%. */
function wInterval(el) {
  const q = Q(el),
    size = 500,
    percents = [1, 2, 5, 10];
  el.innerHTML =
    seg(
      "Give or take",
      percents.map((p, i) => [i, `± ${p}%`]),
    ) + `<p class="readout" data-r></p>`;
  const draw = (index) => {
    const p = percents[index],
      spread = (size * p) / 100;
    press(el, index);
    q("r").innerHTML =
      `${p}% of ${size} g is ${fmt(spread)} g, so the bag could hold anywhere from ` +
      `<b>${fmt(size - spread)} g</b> to <b>${fmt(size + spread)} g</b>.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "Percent error",
    widget: wError,
    body: "<p>The <b>measurement error</b> is how far a measurement is from the real value. The <b>percent error</b> writes that as a percent of the real value, so it shows how big the error is compared to what’s measured.</p><p>Change the measurement.</p>",
    check: {
      kind: "num",
      q: "A plant is really 20 cm tall, but Kiran measures it as 18 cm. What is the percent error?",
      answer: 10,
      unit: "%",
      misc: [
        [11.11, "That compares the error to the measurement. Compare it to the real 20 cm."],
        [2, "That’s the error in cm. Write it as a percent of 20."],
      ],
      explain: "The error is 2 cm, and 2 ÷ 20 = 0.10: a 10% error.",
    },
  },
  {
    title: "Give or take",
    widget: wInterval,
    body: "<p>Products often say how far off they can be, like 500 g ± 2%. The real amount is somewhere in a range: the size minus that percent up to the size plus it.</p><p>Pick a percent.</p>",
    check: {
      kind: "num",
      q: "A bottle should hold 1,000 mL, give or take 3%. What is the least it could hold?",
      answer: 970,
      unit: "mL",
      misc: [
        [997, "That takes away 3 mL. 3% of 1,000 is 30 mL."],
        [30, "That’s how far off it can be. Take it from 1,000."],
        [1030, "That’s the most. The least takes the 3% away."],
      ],
      explain: "3% of 1,000 mL is 30 mL, so it holds from 970 mL to 1,030 mL.",
    },
  },
];
