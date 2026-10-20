/* Learn Putting It All Together (Grade 2 Unit 9), chapter 5: Story problems. Its widgets and steps; loaded by stories.html. */
/* the kinds of story problems */
const KINDS = ["Add to", "Take from", "Put together", "Compare"];
/* stories to sort: the story, its kind (an index into KINDS), and why */
const SORT = [
  {
    story: "Mai had 25 shells. Mai found 13 more shells.",
    kind: 0,
    why: "Mai gets more shells, so it’s <b>add to</b>.",
  },
  {
    story: "Lin had 42 stickers. Lin gave 15 stickers to Han.",
    kind: 1,
    why: "Lin gives some away, so it’s <b>take from</b>.",
  },
  {
    story: "There are 18 red fish and 24 blue fish in the tank.",
    kind: 2,
    why: "Two kinds of fish are in the tank together, so it’s <b>put together</b>.",
  },
  {
    story: "Diego has 31 cards. Jada has 12 more cards than Diego.",
    kind: 3,
    why: "It tells how much more one has than the other, so it’s <b>compare</b>.",
  },
];
/* Pick a story (top row), then tap what kind of story it is (bottom row). */
function wSort(el) {
  /* guess: the kind tapped (-1 for none yet) */
  const q = Q(el);
  let storyIndex = 0,
    guess = -1;
  el.innerHTML =
    `<div data-top>${seg(
      "Story",
      SORT.map((item, i) => [i, `Story ${i + 1}`]),
    )}</div>` +
    `<p class="story" data-s></p><div data-bot>${seg(
      "Kind of story",
      KINDS.map((kind, i) => [i, kind]),
    )}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const item = SORT[storyIndex];
    el.querySelectorAll("[data-top] [data-m]").forEach((b) =>
      b.setAttribute("aria-pressed", +b.dataset.m === storyIndex),
    );
    el.querySelectorAll("[data-bot] [data-m]").forEach((b) => b.setAttribute("aria-pressed", +b.dataset.m === guess));
    q("s").textContent = item.story;
    q("r").innerHTML =
      guess < 0
        ? "What kind of story is it? Tap one."
        : guess === item.kind
          ? `<span class="ok">Yes!</span> ${item.why}`
          : `<span class="no">Not ${KINDS[guess].toLowerCase()}.</span> <span class="dimline">Does something get added, taken away, put together, or compared?</span>`;
  };
  el.addEventListener("click", (e) => {
    const hit = segHit(e, ["top", "bot"]);
    if (!hit) return;
    const [row, id] = hit;
    if (row === "top") {
      storyIndex = +id;
      guess = -1;
    } else guess = +id;
    draw();
  });
  draw();
}
/* a story with no question yet, and questions to ask about it: the question, and what answers it */
const STEM = "There are 45 red apples and 28 green apples in a basket.";
const ASK = [
  { q: "How many apples are in the basket?", a: "Put them together: <b>45 + 28 = 73</b> apples." },
  {
    q: "How many more red apples are there than green apples?",
    a: "Compare them: <b>45 − 28 = 17</b> more red apples.",
  },
  {
    q: "How many apples are on the tree?",
    a: "The story doesn’t tell us about a tree, so it <b>can’t answer</b> that.",
  },
];
/* Tap a question to see whether the story can answer it, and how. */
function wQuestion(el) {
  /* asked: the question tapped (-1 for none) */
  const q = Q(el);
  let asked = -1;
  el.innerHTML = `<p class="story">${STEM}</p><div class="chips">${ASK.map((item, i) => `<button type="button" class="chip" data-a="${i}">${item.q}</button>`).join("")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    el.querySelectorAll("[data-a]").forEach((b) => b.setAttribute("aria-pressed", +b.dataset.a === asked));
    q("f").innerHTML = tapes(
      [
        { label: "Red", n: 45, show: 45 },
        { label: "Green", n: 28, show: 28 },
      ],
      { diff: asked === 1 ? "?" : null, label: "Tape diagram: 45 red apples and 28 green apples" },
    );
    q("r").innerHTML = asked < 0 ? "A story needs a question. Tap one. Can the story answer it?" : ASK[asked].a;
  };
  el.addEventListener("click", (e) => {
    const question = e.target.closest("[data-a]");
    if (question) {
      asked = +question.dataset.a;
      draw();
    }
  });
  draw();
}
/* stories with a tape diagram: the story, the tapes (a part-whole tape, or two tapes to compare), and the answer */
const TAPES = [
  {
    label: "Berries",
    story: "Kiran picked 64 berries. 28 were red and the rest were blue. How many were blue?",
    fig: () =>
      partWhole(
        [
          { n: 28, show: "28" },
          { n: 36, show: "?", hi: true },
        ],
        "64",
        "64 berries: 28 red and the rest blue",
      ),
    ans: "64 − 28 = 36, or 28 + 36 = 64. <b>36 berries</b> were blue.",
  },
  {
    label: "Ropes",
    story: "The red rope is 52 cm long. The blue rope is 18 cm shorter. How long is the blue rope?",
    fig: () =>
      tapes(
        [
          { label: "Red", n: 52, show: 52 },
          { label: "Blue", n: 34, show: "?" },
        ],
        { diff: "18", label: "Tape diagram: the blue rope is 18 cm shorter than the red rope" },
      ),
    ans: "The blue rope is shorter, so subtract: 52 − 18 = 34. It’s <b>34 cm</b> long.",
  },
  {
    label: "Bus",
    story: "Some kids were on the bus. 17 more kids got on. Now there are 45 kids. How many were on the bus at first?",
    fig: () =>
      partWhole(
        [
          { n: 28, show: "?", hi: true },
          { n: 17, show: "17" },
        ],
        "45",
        "Some kids and 17 more make 45",
      ),
    ans: "? + 17 = 45. 45 − 17 = 28, so <b>28 kids</b> were on the bus at first.",
  },
];
/* Pick a story to see its tape diagram; a button shows the answer. */
function wTape(el) {
  /* shown: the answer is showing */
  const q = Q(el);
  let storyIndex = 0,
    shown = false;
  el.innerHTML =
    seg(
      "Story",
      TAPES.map((item, i) => [i, item.label]),
    ) +
    `<p class="story" data-s></p><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const item = TAPES[storyIndex];
    press(el, storyIndex);
    q("s").textContent = item.story;
    q("f").innerHTML = item.fig();
    q("go").textContent = shown ? "Hide the answer" : "Show the answer";
    q("r").innerHTML = shown
      ? `<span class="ok">${item.ans}</span>`
      : "Where is the <b>?</b> in the tape? That’s what the story asks.";
  };
  onPick(el, (m) => {
    storyIndex = +m;
    shown = false;
    draw();
  });
  q("go").onclick = () => {
    shown = !shown;
    draw();
  };
  draw();
}
/* the quick checks' figures */
const F = {
  marbles: partWhole(
    [
      { n: 45, show: "45" },
      { n: 28, show: "?", hi: true },
    ],
    "73",
    "73 marbles: 45 blue and the rest green",
  ),
};
const STEPS = [
  {
    title: "Sort the stories",
    widget: wSort,
    body: "<p>Story problems come in kinds. Something is <b>added to</b> or <b>taken from</b> a group, two groups are <b>put together</b>, or two amounts are <b>compared</b>.</p><p>Pick a story, then tap its kind.</p>",
    check: {
      kind: "mc",
      q: "What kind of story is this? <b>Elena has 40 beads. Elena uses 16 beads to make a bracelet.</b>",
      choices: [
        { id: "a", label: "Take from" },
        { id: "b", label: "Add to" },
        { id: "c", label: "Compare" },
      ],
      answer: "a",
      why: {
        b: "Elena uses some beads, so there are fewer. That’s taking from.",
        c: "Only Elena’s beads are in the story. Nothing is compared.",
      },
      explain: "Elena starts with 40 and uses some, so it’s take from: 40 − 16 = 24 beads left.",
    },
  },
  {
    title: "What’s the question?",
    widget: wQuestion,
    body: "<p>The same story can ask different questions. The question tells you whether to put the numbers together or compare them, and some questions a story can’t answer.</p><p>Tap each question.</p>",
    check: {
      kind: "mc",
      q: "Jada has 52 stickers. Han has 38 stickers. Which question asks you to <b>subtract</b>?",
      stack: true,
      choices: [
        { id: "a", label: "How many more stickers does Jada have than Han?" },
        { id: "b", label: "How many stickers do they have in all?" },
        { id: "c", label: "How many stickers does Jada want?" },
      ],
      answer: "a",
      why: {
        b: "In all means put them together: add.",
        c: "The story doesn’t say what Jada wants, so it can’t answer that.",
      },
      explain: "How many more compares them: 52 − 38 = 14 more stickers.",
    },
  },
  {
    title: "Tape diagrams",
    widget: wTape,
    body: "<p>A <b>tape diagram</b> shows what a story knows and what it asks. The <b>?</b> is the number to find.</p><p>Pick a story. Find the ?, then show the answer.</p>",
    check: {
      kind: "num",
      unit: "marbles",
      answer: 28,
      fig: F.marbles,
      q: "Tyler has 73 marbles. 45 are blue and the rest are green. How many are green?",
      misc: [
        [118, "You added. 73 is all the marbles: take away the blue ones."],
        [45, "That’s the blue marbles. How many are the rest?"],
        [32, "73 has only 3 ones, so break a ten: 13 − 5 = 8 ones, and 6 − 4 = 2 tens."],
      ],
      explain: "45 + ? = 73. 73 − 45 = 28, so 28 marbles are green.",
    },
  },
];
