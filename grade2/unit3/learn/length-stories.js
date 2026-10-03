/* Learn Measuring Length (Grade 2 Unit 3), chapter 4: Length stories. Its widgets and steps; loaded by length-stories.html. */
/* A number line from 0 to max with arrows above it (see numLine in shared/numlines.js) */
const lenLine = (max, arrows, shown, label) => numLine(0, max, { arrows, shown, label });
/* A widget for one kind of silk story at a time: pick a story, then show the ? on the number line.
   stories: [{label, story, max, arrows, eq, ans}]; prompt: what to say before the ? is shown. */
const silkStories = (stories, prompt) => (el) => {
  const q = Q(el);
  let storyIndex = 0,
    shown = false;
  el.innerHTML =
    seg(
      "Story",
      stories.map((story, i) => [i, story.label]),
    ) +
    `<p class="story" data-s></p><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const story = stories[storyIndex];
    press(el, storyIndex);
    q("s").textContent = story.story;
    q("f").innerHTML = lenLine(story.max, story.arrows, shown, story.label + ": a number line in inches");
    q("go").textContent = shown ? "Start over" : "Find the ?";
    q("r").innerHTML = shown ? `<b>${story.eq}</b><br><span class="ok">${story.ans}</span>` : prompt;
  };
  el.addEventListener("click", (e) => {
    const storyBtn = e.target.closest("[data-m]");
    if (storyBtn) {
      storyIndex = +storyBtn.dataset.m;
      shown = false;
      draw();
    }
  });
  q("go").onclick = () => {
    shown = !shown;
    draw();
  };
  draw();
};
/* stories that put lengths together */
const JOIN = [
  {
    label: "Necklace",
    story:
      "Mai has a piece of silk 18 inches long and a piece 7 inches long. Mai ties them together to make a necklace. How long is the necklace?",
    max: 30,
    arrows: [
      { a: 0, b: 18 },
      { a: 18, b: 25 },
      { a: 0, b: 25, lv: 1, q: true },
    ],
    eq: "18 + 7 = 25",
    ans: "The necklace is 25 inches long.",
  },
  {
    label: "Bracelet",
    story: "Han ties a 4-inch piece of silk to a 3-inch piece to make a bracelet. How long is the bracelet?",
    max: 10,
    arrows: [
      { a: 0, b: 4 },
      { a: 4, b: 7 },
      { a: 0, b: 7, lv: 1, q: true },
    ],
    eq: "4 + 3 = 7",
    ans: "The bracelet is 7 inches long.",
  },
  {
    label: "Headband",
    story: "Jada ties a 12-inch piece of silk to a 9-inch piece to make a headband. How long is the headband?",
    max: 25,
    arrows: [
      { a: 0, b: 12 },
      { a: 12, b: 21 },
      { a: 0, b: 21, lv: 1, q: true },
    ],
    eq: "12 + 9 = 21",
    ans: "The headband is 21 inches long.",
  },
];
/* stories that take away or compare lengths */
const LEFT = [
  {
    label: "Cut some off",
    story: "Elena has 30 inches of silk. Elena cuts off 7 inches for a bracelet. How much silk is left?",
    max: 30,
    arrows: [
      { a: 0, b: 30, lv: 2 },
      { a: 30, b: 23, lv: 1 },
      { a: 0, b: 23, q: true },
    ],
    eq: "30 − 7 = 23",
    ans: "23 inches of silk are left.",
  },
  {
    label: "How much longer?",
    story: "Jada’s necklace is 24 inches long. Han’s necklace is 18 inches long. How much longer is Jada’s necklace?",
    max: 25,
    arrows: [
      { a: 0, b: 24, lv: 1 },
      { a: 0, b: 18 },
      { a: 18, b: 24, q: true },
    ],
    eq: "18 + ? = 24, or 24 − 18 = 6",
    ans: "Jada’s necklace is 6 inches longer.",
  },
  {
    label: "How much more?",
    story: "Kiran needs 20 inches of silk for a necklace. Kiran has 13 inches. How much more silk does Kiran need?",
    max: 20,
    arrows: [
      { a: 0, b: 20, lv: 1 },
      { a: 0, b: 13 },
      { a: 13, b: 20, q: true },
    ],
    eq: "13 + ? = 20, or 20 − 13 = 7",
    ans: "Kiran needs 7 more inches.",
  },
];
/* the quick checks' figures */
const F = {
  diego: lenLine(
    30,
    [
      { a: 0, b: 16 },
      { a: 16, b: 25 },
      { a: 0, b: 25, lv: 1, q: true },
    ],
    false,
    "Number line: 16 inches, then 9 more inches",
  ),
  priya: lenLine(
    35,
    [
      { a: 0, b: 32, lv: 2 },
      { a: 32, b: 24, lv: 1 },
      { a: 0, b: 24, q: true },
    ],
    false,
    "Number line: 32 inches, then 8 inches cut off",
  ),
};
const STEPS = [
  {
    title: "Put pieces together",
    widget: silkStories(JOIN, "Each arrow is one piece of silk. Where does the long arrow end?"),
    body: "<p>Saree silk is ribbon made from old saris. Tie two pieces together and the lengths <b>add</b>.</p><p>A number line shows it: each arrow is a piece. Pick a story, then find the <b>?</b>.</p>",
    check: {
      kind: "num",
      unit: "inches",
      answer: 25,
      fig: F.diego,
      q: "Diego ties a 16-inch piece of silk to a 9-inch piece. How long is the silk now?",
      misc: [
        [7, "You subtracted. Diego ties the pieces together, so add."],
        [15, "6 + 9 = 15 ones. That’s a new ten, so there are 2 tens now, not 1."],
      ],
      explain: "16 + 9 = 25. 16 + 4 = 20, and 5 more is 25 inches.",
    },
  },
  {
    title: "Cut off and compare",
    widget: silkStories(LEFT, "Which arrow has the ? Is it a part or the whole?"),
    body: "<p>If you <b>cut some off</b>, subtract. To find <b>how much longer</b> or <b>how much more</b>, count on or subtract.</p><p>Pick a story, then find the <b>?</b>.</p>",
    check: {
      kind: "num",
      unit: "inches",
      answer: 24,
      fig: F.priya,
      q: "Priya has 32 inches of silk. Priya cuts off 8 inches for a bracelet. How many inches are left?",
      misc: [
        [40, "You added. Priya cuts some off, so there is less left."],
        [36, "32 has only 2 ones. Break a ten: 12 − 8 = 4 ones, and 2 tens are left."],
        [8, "That’s how much Priya cut off. How much is left?"],
      ],
      explain: "32 − 8 = 24. 32 − 2 = 30, and 6 more is 24 inches.",
    },
  },
];
