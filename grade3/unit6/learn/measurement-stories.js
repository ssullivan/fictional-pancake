/* Learn Measuring Length, Time, Liquid Volume, and Weight (Grade 3 Unit 6), chapter 7: Measurement stories. Its widgets and
   steps; loaded by measurement-stories.html. */
/* two-step stories: the story, a tape diagram before and after, and the two steps */
const STORIES = [
  {
    label: "Pitchers",
    story:
      "Mai fills 3 pitchers with 4 liters of water each, then pours 5 liters into a fish tank. How many liters are left?",
    row: (solved) => ({ label: "pitchers", times: 3, each: 4, total: solved ? 12 : "?" }),
    lines: ["3 × 4 = 12 liters in the pitchers.", "12 − 5 = 7."],
    answer: "7 liters are left.",
  },
  {
    label: "Beans",
    story: "Each bag of beans weighs 200 grams. How many grams do 3 bags and a 250-gram box of rice weigh together?",
    row: (solved) => ({ label: "bags", times: 3, each: 200, total: solved ? 600 : "?", plus: 250 }),
    lines: ["3 × 200 = 600 grams of beans.", "600 + 250 = 850."],
    answer: "They weigh 850 grams.",
  },
  {
    label: "Piano",
    story:
      "Diego practices piano for 20 minutes a day for 4 days, then plays a 15-minute song. How many minutes is that in all?",
    row: (solved) => ({ label: "days", times: 4, each: 20, total: solved ? 80 : "?", plus: 15 }),
    lines: ["4 × 20 = 80 minutes of practice.", "80 + 15 = 95."],
    answer: "That’s 95 minutes in all.",
  },
];
/* Solve a two-step story with a tape diagram, one step at a time. */
function wTwoStep(el) {
  const q = Q(el);
  let storyIndex = 0,
    made = 0;
  el.innerHTML =
    seg(
      "Story",
      STORIES.map((s, i) => [i, s.label]),
    ) +
    `<p data-s></p><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Next step</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { story, row, lines, answer } = STORIES[storyIndex];
    press(el, storyIndex);
    q("go").disabled = made === 2;
    q("s").textContent = story;
    q("f").innerHTML = timesTape([row(made >= 1)]);
    q("r").innerHTML = made
      ? lines
          .slice(0, made)
          .map((line, i) => `Step ${i + 1}: ${line}`)
          .join("<br>") + (made === 2 ? `<br><span class="ok">${answer}</span>` : "")
      : "It takes two steps. What do you find first?";
  };
  q("go").onclick = () => {
    made++;
    draw();
  };
  q("clr").onclick = () => {
    made = 0;
    draw();
  };
  onPick(el, (id) => {
    storyIndex = +id;
    made = 0;
    draw();
  });
  draw();
}
/* stories missing a number: what each one needs, and two things that don't help */
const MISSING = [
  {
    story: "A bucket holds 9 liters. How many buckets of water does it take to fill the fish tank?",
    choices: [
      ["How many liters the fish tank holds", null],
      ["How tall the bucket is", "The height doesn’t tell how much water to pour."],
      ["How many fish there are", "The fish don’t change how much water the tank holds."],
    ],
  },
  {
    story: "The play started at 2:15. How long was the play?",
    choices: [
      ["When the play ended", null],
      ["How many people watched", "The people don’t change how long it lasted."],
      ["What day it was", "The day doesn’t tell how long it lasted."],
    ],
  },
  {
    story: "Lin has 3 bags of flour. How many kilograms of flour does Lin have?",
    choices: [
      ["How much each bag weighs", null],
      ["What the flour is for", "That doesn’t tell how heavy it is."],
      ["Where Lin bought it", "That doesn’t tell how heavy it is."],
    ],
  },
];
/* Pick what a story is missing; a wrong pick says why it doesn't help. */
function wMissing(el) {
  const q = Q(el);
  let storyIndex = 0,
    picked = null;
  el.innerHTML = `<div data-top></div><p data-s></p><div data-bot></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { story, choices } = MISSING[storyIndex];
    q("top").innerHTML = seg(
      "Story",
      MISSING.map((s, i) => [i, `Story ${i + 1}`]),
    );
    q("bot").innerHTML = seg(
      "Missing",
      choices.map(([text], i) => [i, text]),
    );
    press(q("top"), storyIndex);
    press(q("bot"), picked);
    q("s").textContent = story;
    q("r").innerHTML =
      picked === null
        ? "What do you need to know to answer the question?"
        : choices[picked][1] === null
          ? `<span class="ok">Yes: with that, you can answer it.</span>`
          : `<span class="no">${choices[picked][1]}</span>`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") {
      storyIndex = +id;
      picked = null;
    } else picked = +id;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Two-step stories",
    widget: wTwoStep,
    body: "<p>Measurement stories can take two steps, in liters, grams, kilograms, or minutes. Keep one unit through the whole story. A tape diagram shows what to find first.</p><p>Pick a story and solve it one step at a time.</p>",
    check: {
      kind: "num",
      q: "A jug holds 5 liters. Han fills 4 jugs, then uses 6 liters to water plants. How many liters are left?",
      answer: 14,
      unit: "liters",
      misc: [
        [20, "That’s only the first step, 4 × 5. Take away the 6 liters too."],
        [3, "There are 4 jugs of 5 liters: multiply first."],
      ],
      explain: "4 × 5 = 20 liters. 20 − 6 = 14 liters are left.",
    },
  },
  {
    title: "What’s missing?",
    widget: wMissing,
    body: "<p>Some stories don’t give every number you need. Read the question, then ask: which number would I need to work it out?</p><p>Pick a story, then what it’s missing.</p>",
    check: {
      kind: "mc",
      q: "Han’s dog weighs 18 kilograms. How many kilograms heavier is the dog than Han’s cat? What do you need to know?",
      choices: [
        { id: "a", label: "How much the cat weighs" },
        { id: "b", label: "How old the dog is" },
        { id: "c", label: "What color the cat is" },
      ],
      answer: "a",
      why: {
        b: "The dog’s age doesn’t tell how heavy the cat is.",
        c: "The cat’s color doesn’t tell how heavy it is.",
      },
      explain: "To find how much heavier the dog is, you need the cat’s weight.",
      stack: true,
    },
  },
];
