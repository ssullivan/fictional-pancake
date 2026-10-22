/* Learn Probability and Sampling (Grade 7 Unit 8), chapter 1: Chance and probability. Its widgets and steps; loaded by
   chance.html. */
/* events and their probabilities */
const EVENTS = [
  ["Roll a 7 on a number cube", 0],
  ["Roll a 6 on a number cube", 1 / 6],
  ["Flip heads on a coin", 1 / 2],
  ["Roll more than 1", 5 / 6],
  ["Roll less than 7", 1],
];
/* Pick an event: its probability sits on the line from impossible (0) to certain (1). */
function wLikely(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Event",
      EVENTS.map(([label], i) => [i, label]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const words = (p) =>
    p === 0 ? "impossible" : p < 0.5 ? "unlikely" : p === 0.5 ? "equally likely as not" : p < 1 ? "likely" : "certain";
  const draw = (index) => {
    const [label, p] = EVENTS[index];
    press(el, index);
    q("f").innerHTML = likelyLine(p);
    q("r").innerHTML =
      `${label}: probability <b>${p === 0 || p === 1 ? p : ftx(frac(Math.round(p * 6), 6))}</b>, so it’s <b>${words(p)}</b>.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* Change the red and blue marbles in a bag: the probability of red is the red marbles out of all of them. */
function wBag(el) {
  const q = Q(el),
    values = { red: 3, blue: 5 };
  el.innerHTML =
    `<div class="wrow">${stepper("red", "Red")}${stepper("blue", "Blue")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { red, blue } = values,
      total = red + blue;
    q("red").textContent = red;
    q("blue").textContent = blue;
    q("f").innerHTML = bagFig({ red, blue });
    q("r").innerHTML =
      `${red} of the ${total} marbles are red, and each marble is equally likely to be picked. ` +
      `The probability of red is <b>${red}/${total}</b>${pFrac(red, total) !== `${red}/${total}` ? ` = ${pFrac(red, total)}` : ""}.` +
      (red === 0 ? " Impossible: there’s no red." : blue === 0 ? " Certain: it’s all red." : "");
  };
  steppers(el, values, { red: [0, 8], blue: [0, 8] }, draw);
  draw();
}

const STEPS = [
  {
    title: "From impossible to certain",
    widget: wLikely,
    body: "<p>A <b>probability</b> is a number from 0 to 1 that says how likely something is. 0 means impossible, 1 means certain, and 1/2 means it’s as likely to happen as not.</p><p>Pick an event.</p>",
    check: {
      kind: "mc",
      q: "A spinner has 5 equal sections, and 4 of them are green. How likely is it to land on green?",
      choices: [
        { id: "a", label: "Unlikely" },
        { id: "b", label: "Equally likely as not" },
        { id: "c", label: "Likely" },
      ],
      answer: "c",
      why: {
        a: "4 of 5 sections is more than half.",
        b: "4 of 5 is more than half, not exactly half.",
      },
      explain: "4/5 is more than 1/2, so landing on green is likely.",
    },
  },
  {
    title: "Counting outcomes",
    widget: wBag,
    body: "<p>When every outcome is equally likely, the probability of an event is the number of outcomes in it divided by the number of outcomes in all, the <b>sample space</b>.</p><p>Change the marbles.</p>",
    check: {
      kind: "num",
      q: "A bag has 2 red, 3 blue, and 5 green marbles. You pick one without looking. What is the probability it’s blue?",
      answer: 0.3,
      frac: true,
      misc: [
        [3, "That’s how many are blue. Divide by all 10 marbles."],
        [0.43, "That compares blue to the other marbles. Compare to all 10."],
        [0.7, "That’s the probability it’s not blue."],
      ],
      explain: "3 of the 10 marbles are blue: 3/10.",
    },
  },
];
