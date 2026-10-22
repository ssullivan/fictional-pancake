/* Learn Probability and Sampling (Grade 7 Unit 8), chapter 3: Two-step experiments. Its widgets and steps; loaded by
   compound.html. */
/* events with two number cubes, and which outcomes are in each */
const DICE_EVENTS = [
  ["A sum of 7", (a, b) => a + b === 7],
  ["Doubles", (a, b) => a === b],
  ["A sum of 10 or more", (a, b) => a + b >= 10],
  ["Both even", (a, b) => a % 2 === 0 && b % 2 === 0],
];
/* Pick an event: the table of 36 outcomes lights up the ones in it. */
function wTable(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Event",
      DICE_EVENTS.map(([label], i) => [i, label]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [label, inIt] = DICE_EVENTS[index];
    let ways = 0;
    range(6).forEach((i) => range(6).forEach((j) => (ways += inIt(i + 1, j + 1) ? 1 : 0)));
    press(el, index);
    q("f").innerHTML = outcomeGrid(inIt);
    q("r").innerHTML =
      `${label}: <b>${ways}</b> of the 36 outcomes, so the probability is ${ways}/36${pFrac(ways, 36) !== `${ways}/36` ? ` = <b>${pFrac(ways, 36)}</b>` : ""}.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* events for a coin and a 3-color spinner, and the paths in each */
const TREE_EVENTS = [
  ["Heads and red", (f, s) => f === "heads" && s === "red"],
  ["Any red", (f, s) => s === "red"],
  ["Tails, not green", (f, s) => f === "tails" && s !== "green"],
];
/* Pick an event: the tree lights up the paths in it, out of all 6. */
function wTree(el) {
  const q = Q(el),
    colors = ["red", "blue", "green"];
  el.innerHTML =
    seg(
      "Event",
      TREE_EVENTS.map(([label], i) => [i, label]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [label, inIt] = TREE_EVENTS[index],
      ways = ["heads", "tails"].flatMap((f) => colors.map((s) => inIt(f, s))).filter(Boolean).length;
    press(el, index);
    q("f").innerHTML = treeFig(["heads", "tails"], colors, { hi: inIt });
    q("r").innerHTML =
      `2 × 3 = 6 equally likely paths. ${label}: <b>${ways}</b> of them, so the probability is <b>${pFrac(ways, 6)}</b>.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "A table of outcomes",
    widget: wTable,
    body: "<p>When an experiment has two steps, like rolling two number cubes, list every outcome. A table shows all 6 × 6 = 36 of them. Then count the ones in the event.</p><p>Pick an event.</p>",
    check: {
      kind: "num",
      q: "You roll two number cubes. What is the probability that the sum is 4?",
      answer: 3 / 36,
      frac: true,
      misc: [
        [3, "That’s how many outcomes. Divide by 36."],
        [2 / 36, "1 + 3 and 3 + 1 are different outcomes: the first cube and the second are different cubes. Count 3."],
      ],
      explain: "1 + 3, 2 + 2, and 3 + 1: 3 of the 36 outcomes, or 1/12.",
    },
  },
  {
    title: "A tree diagram",
    widget: wTree,
    body: "<p>A <b>tree diagram</b> shows a two-step experiment as branches: each outcome of the first step branches into every outcome of the second. Every path is one outcome.</p><p>Pick an event.</p>",
    check: {
      kind: "num",
      q: "You flip a coin twice. What is the probability of getting heads both times?",
      answer: 0.25,
      frac: true,
      misc: [
        [0.5, "That’s the probability of heads on one flip. There are 4 paths: HH, HT, TH, TT."],
        [1, "Probabilities don’t add across steps. Count the paths: 1 of 4."],
      ],
      explain: "The tree has 4 equally likely paths, and only HH counts: 1/4.",
    },
  },
];
