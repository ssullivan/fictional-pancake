/* Learn Addition and Subtraction on the Number Line (Grade 2 Unit 4), chapter 5: Unknowns and stories. Its widgets and steps; loaded by stories.html. */
/* equations with an unknown: the start (a), the jumps that find it, and the answer */
const MISS = [
  { a: 27, steps: [3, 20], label: "27 + ? = 50", eq: "3 + 20 = 23", ans: "? = 23, because 27 + 23 = 50." },
  { a: 36, steps: [4, 10, 5], label: "36 + ? = 55", eq: "4 + 10 + 5 = 19", ans: "? = 19, because 36 + 19 = 55." },
  { a: 64, steps: [-4, -20], label: "64 − ? = 40", eq: "4 + 20 = 24", ans: "? = 24, because 64 − 24 = 40." },
];
/* Find the unknown by jumping from the start to the end: a button shows the jumps. */
function wMissing(el) {
  const q = Q(el);
  let eqIndex = 0,
    shown = false;
  el.innerHTML =
    seg(
      "Equation",
      MISS.map((missing, i) => [i, missing.label]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* the jumps are labelled by their size, without a sign */
    const missing = MISS[eqIndex],
      end = missing.a + missing.steps.reduce((sum, n) => sum + n, 0),
      [lo, hi] = around(missing.a, end),
      hops = hopsFrom(missing.a, missing.steps).map((hop) => ({ ...hop, t: Math.abs(hop.b - hop.a) }));
    press(el, eqIndex);
    q("f").innerHTML = line(lo, hi, {
      lab: (v) => v % 10 === 0,
      pts: [
        { v: missing.a, t: missing.a },
        { v: end, cls: "b", t: end },
      ],
      hops: shown ? hops : [{ a: missing.a, b: end, t: "?", q: true }],
      label: `${missing.label} on a number line`,
    });
    q("go").textContent = shown ? "Start over" : "Jump to find ?";
    q("r").innerHTML = shown
      ? `Add up the jumps: <b>${missing.eq}</b><br><span class="ok">${missing.ans}</span>`
      : `Start at <b>${missing.a}</b>. How far is it to <b>${end}</b>? That’s the <b>?</b>.<br><span class="dimline">Jump to the next ten first, then by tens.</span>`;
  };
  el.addEventListener("click", (e) => {
    const eqBtn = e.target.closest("[data-m]");
    if (eqBtn) {
      eqIndex = +eqBtn.dataset.m;
      shown = false;
      draw();
    }
  });
  q("go").onclick = () => {
    shown = !shown;
    draw();
  };
  draw();
}
/* stories: the start (a), the jumps, the equation, and the answer */
const STORIES = [
  {
    label: "More stickers",
    story: "Lin has 35 stickers. Lin gets 20 more. How many stickers does Lin have now?",
    a: 35,
    steps: [10, 10],
    eq: "35 + 20 = 55",
    ans: "Lin has 55 stickers now.",
  },
  {
    label: "Kids go inside",
    story: "There are 52 kids on the playground. 8 kids go inside. How many kids are still on the playground?",
    a: 52,
    steps: [-2, -6],
    eq: "52 − 8 = 44",
    ans: "44 kids are still on the playground.",
  },
  {
    label: "Pages to read",
    story: "Clare has read 26 pages. Clare wants to read 40 pages. How many more pages does Clare need to read?",
    a: 26,
    steps: [4, 10],
    eq: "26 + 14 = 40",
    ans: "Clare needs to read 14 more pages.",
  },
];
/* Pick a story to see where it starts; a button shows its jumps. */
function wStories(el) {
  const q = Q(el);
  let storyIndex = 0,
    shown = false;
  el.innerHTML =
    seg(
      "Story",
      STORIES.map((story, i) => [i, story.label]),
    ) +
    `<p class="story" data-s></p><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const story = STORIES[storyIndex],
      end = story.a + story.steps.reduce((sum, n) => sum + n, 0),
      [lo, hi] = around(story.a, end);
    press(el, storyIndex);
    q("s").textContent = story.story;
    q("f").innerHTML = line(lo, hi, {
      lab: (v) => v % 10 === 0,
      pts: [{ v: story.a, t: story.a }, ...(shown ? [{ v: end, cls: "b", t: end }] : [])],
      hops: shown ? hopsFrom(story.a, story.steps) : [],
      label: `${story.label}: a number line starting at ${story.a}`,
    });
    q("go").textContent = shown ? "Start over" : "Show the jumps";
    q("r").innerHTML = shown
      ? `<b>${story.eq}</b><br><span class="ok">${story.ans}</span>`
      : "Where do you start? Do you jump right (more) or left (fewer)?";
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
}
/* the quick checks' figures */
const F = {
  miss38: line(30, 60, {
    lab: (v) => v % 10 === 0,
    hops: [{ a: 38, b: 60, t: "?", q: true }],
    pts: [
      { v: 38, t: 38 },
      { v: 60, cls: "b", t: 60 },
    ],
    label: "A number line: from 38 to 60 is ?",
  }),
  books: line(30, 50, {
    lab: (v) => v % 10 === 0,
    pts: [{ v: 43, t: 43 }],
    label: "A number line from 30 to 50 with a dot at 43",
  }),
};
const STEPS = [
  {
    title: "Find the missing jump",
    widget: wMissing,
    body: "<p>In <b>27 + ? = 50</b>, you know where to start and where to land. The <b>?</b> is how far you jump.</p><p>Pick an equation. Jump to find the <b>?</b>.</p>",
    check: {
      kind: "num",
      answer: 22,
      fig: F.miss38,
      q: "38 + ? = 60. What is the missing number?",
      misc: [
        [98, "You added 38 and 60. The ? is the jump from 38 to 60."],
        [2, "38 to 40 is 2. Keep jumping to 60."],
        [20, "40 to 60 is 20. Don’t forget 38 to 40."],
        [32, "Jump to 40 first: that’s 2. Then 20 more to 60."],
      ],
      explain: "38 to 40 is 2. 40 to 60 is 20. 2 + 20 = 22, so 38 + 22 = 60.",
    },
  },
  {
    title: "Story problems",
    widget: wStories,
    body: "<p>A number line can show a story. Find the <b>start</b>. Jump <b>right</b> if there are more. Jump <b>left</b> if there are fewer.</p><p>Pick a story, then show the jumps.</p>",
    check: {
      kind: "num",
      answer: 34,
      fig: F.books,
      q: "The class library has 43 books. The class gives away 9 books. How many books are left?",
      misc: [
        [52, "Gave away means fewer books. Jump left."],
        [33, "If you jumped back 10, that’s 1 too many. Jump forward 1: 34."],
        [36, "43 − 3 = 40. 9 is 3 and 6, so jump 6 more: 40 − 6 = 34."],
      ],
      explain: "43 − 3 = 40. 9 is 3 and 6, so 40 − 6 = 34. There are 34 books left.",
    },
  },
];
