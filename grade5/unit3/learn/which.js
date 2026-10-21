/* Learn Multiplying and Dividing Fractions (Grade 5 Unit 3), chapter 5: Multiply or divide? Its widgets and steps; loaded by
   which.html. */
/* expressions that start from 6 or from 1/2: [button, the start, its label, the value, what the readout says] */
const SIZES = [
  [
    "6 × 1/2",
    6,
    "6",
    3,
    "6 × 1/2 is 1/2 of 6: <b>3, less than 6</b>. Multiplying by a fraction less than 1 takes only part.",
  ],
  [
    "6 ÷ 1/2",
    6,
    "6",
    12,
    "6 ÷ 1/2 counts the halves in 6: <b>12, more than 6</b>. Dividing by a fraction less than 1 gives more.",
  ],
  [
    "1/2 ÷ 6",
    1 / 2,
    "1/2",
    1 / 12,
    "1/2 ÷ 6 cuts 1/2 into 6 pieces: <b>1/12, less than 1/2</b>. Sharing makes each part smaller.",
  ],
  [
    "1/3 × 1/2",
    1 / 2,
    "1/2",
    1 / 6,
    "1/3 × 1/2 is 1/3 of 1/2: <b>1/6, less than 1/2</b>. A part of a part is smaller.",
  ],
];
/* Pick an expression and compare its value with the number it starts from, on two tapes. */
function wSize(el) {
  const q = Q(el);
  let sizeIndex = 0;
  el.innerHTML =
    seg(
      "Expression",
      SIZES.map(([button], i) => [i, button]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [button, start, startLabel, value, says] = SIZES[sizeIndex];
    press(el, sizeIndex);
    /* write a number on its tape only when the tape is wide enough for it */
    const shown = (n, text) => (n * 16 >= 28 || n / Math.max(start, value) >= 0.2 ? text : "");
    q("f").innerHTML = tapes(
      [
        { label: "Start", n: start, show: shown(start, startLabel) },
        { label: "Answer", n: value, show: shown(value, value < 1 ? "" : `${value}`) },
      ],
      { label: `${startLabel} and ${button}` },
    );
    q("r").innerHTML = says;
  };
  onPick(el, (m) => {
    sizeIndex = +m;
    draw();
  });
  draw();
}
/* stories to sort: [button, the story, the expression, why] */
const KINDS = [
  [
    "Share",
    "Lin shares 1/2 pound of soil equally among 3 flower pots. How much does each pot get?",
    "1/2 ÷ 3 = 1/6 pound",
    "A fraction is shared among a whole number of things: divide the fraction by the whole number.",
  ],
  [
    "How many fit",
    "How many 1/4-cup scoops of compost are in 3 cups?",
    "3 ÷ 1/4 = 12 scoops",
    "You count how many unit fractions fit in a whole number: divide the whole number by the fraction.",
  ],
  [
    "Part of a part",
    "1/2 of the garden is herbs. 1/3 of the herbs are basil. What fraction of the garden is basil?",
    "1/3 × 1/2 = 1/6 of the garden",
    "You take a fraction of an amount: multiply.",
  ],
];
/* Pick a kind of story and see which operation it needs. */
function wKinds(el) {
  const q = Q(el);
  let kindIndex = 0;
  el.innerHTML =
    seg(
      "Story",
      KINDS.map(([button], i) => [i, button]),
    ) + `<p class="story" data-s></p><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const [, story, expression, why] = KINDS[kindIndex];
    press(el, kindIndex);
    q("s").innerHTML = story;
    q("e").innerHTML = expression;
    q("r").innerHTML = why;
  };
  onPick(el, (m) => {
    kindIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Bigger or smaller?",
    widget: wSize,
    body: "<p>You can tell how big an answer will be before you work it out. Multiplying by a fraction less than 1, or sharing a fraction, gives <b>less</b>. Dividing by a fraction less than 1 counts how many fit, so it gives <b>more</b>.</p><p>Pick an expression and compare.</p>",
    check: {
      kind: "mc",
      q: "Without working it out: which is greater than 4?",
      answer: "c",
      choices: [
        { id: "a", label: "4 × 1/3" },
        { id: "b", label: "1/3 ÷ 4" },
        { id: "c", label: "4 ÷ 1/3" },
      ],
      why: {
        a: "That’s 1/3 of 4: less than 4.",
        b: "That shares 1/3, which is already less than 1: tiny.",
      },
      explain: "4 ÷ 1/3 counts the thirds in 4: 12, more than 4.",
    },
  },
  {
    title: "Pick the operation",
    widget: wKinds,
    body: "<p>Read what a story does. Sharing a fraction divides it by a whole number. Counting how many fractions fit in a whole number divides the whole number by the fraction. Taking a fraction of a fraction multiplies.</p><p>Pick a kind of story.</p>",
    check: {
      kind: "mc",
      q: "A garden row is 4 meters long. A seed goes in every 1/2 meter. Which expression gives how many 1/2-meter spaces there are?",
      answer: "b",
      choices: [
        { id: "a", label: "1/2 ÷ 4" },
        { id: "b", label: "4 ÷ 1/2" },
        { id: "c", label: "1/2 × 4" },
      ],
      why: {
        a: "That shares 1/2 among 4. Here you count how many halves fit in 4.",
        c: "That’s 1/2 of 4. Here you count how many halves fit in 4.",
      },
      explain: "How many halves fit in 4: 4 ÷ 1/2 = 8 spaces.",
    },
  },
];
