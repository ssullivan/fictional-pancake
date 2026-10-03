/* Learn Addition and Subtraction on the Number Line (Grade 2 Unit 4), chapter 4: Jump by tens and ones. Its widgets and steps; loaded by tens-and-ones.html. */
/* A widget that makes one jump at a time. problems: [{a, steps, label}]; steps are signed (+10, +10, +3, …).
   say(problem): what to say before the first jump. */
const jumper = (problems, say) => (el) => {
  /* jumpsMade: how many of the problem's jumps are drawn */
  const q = Q(el);
  let problemIndex = 0,
    jumpsMade = 0;
  el.innerHTML =
    seg(
      "Problem",
      problems.map((problem, i) => [i, problem.label]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* at: where the last jump landed */
    const problem = problems[problemIndex],
      hops = hopsFrom(problem.a, problem.steps),
      end = problem.a + problem.steps.reduce((sum, n) => sum + n, 0),
      at = jumpsMade ? hops[jumpsMade - 1].b : problem.a,
      [lo, hi] = around(problem.a, end);
    press(el, problemIndex);
    q("f").innerHTML = line(lo, hi, {
      lab: (v) => v % 10 === 0,
      hops: hops.slice(0, jumpsMade),
      pts: [{ v: problem.a, t: problem.a }, ...(jumpsMade ? [{ v: at, cls: "b", t: at }] : [])],
      label:
        `${problem.label} on a number line` +
        (jumpsMade
          ? `: jumps ${hops
              .slice(0, jumpsMade)
              .map((hop) => hop.t)
              .join(", ")} to ${at}`
          : ""),
    });
    q("go").textContent = jumpsMade < hops.length ? (jumpsMade ? "Next jump" : "Jump!") : "Start over";
    /* each jump as an equation: its label's sign, then its size */
    q("r").innerHTML = !jumpsMade
      ? say(problem)
      : `${hops
          .slice(0, jumpsMade)
          .map((hop) => `<b>${hop.a} ${hop.t[0]} ${hop.t.slice(1)} = ${hop.b}</b>`)
          .join("<br>")}` + (jumpsMade === hops.length ? `<br><span class="ok">${problem.label} = ${end}</span>` : "");
  };
  el.addEventListener("click", (e) => {
    const problemBtn = e.target.closest("[data-m]");
    if (problemBtn) {
      problemIndex = +problemBtn.dataset.m;
      jumpsMade = 0;
      draw();
    }
  });
  q("go").onclick = () => {
    jumpsMade = jumpsMade < problems[problemIndex].steps.length ? jumpsMade + 1 : 0;
    draw();
  };
  draw();
};
/* jumping by tens, then ones */
const TENS = [
  { a: 34, steps: [10, 10, 3], label: "34 + 23" },
  { a: 56, steps: [10, 10, 10, 1], label: "56 + 31" },
  { a: 78, steps: [-10, -10, -5], label: "78 − 25" },
];
/* jumping to the next ten first */
const TOTEN = [
  { a: 28, steps: [2, 5], label: "28 + 7" },
  { a: 57, steps: [3, 5], label: "57 + 8" },
  { a: 43, steps: [-3, -3], label: "43 − 6" },
  { a: 62, steps: [-2, -3], label: "62 − 5" },
];
/* the quick checks' figures */
const F = {
  tens45: line(40, 80, {
    lab: (v) => v % 10 === 0,
    hops: hopsFrom(45, [10, 10, 10, 2]),
    pts: [
      { v: 45, t: 45 },
      { v: 77, cls: "b", t: "?" },
    ],
    label: "Jumps from 45: plus 10, plus 10, plus 10, plus 2",
  }),
  toTen36: line(30, 50, {
    lab: (v) => v % 10 === 0,
    hops: hopsFrom(36, [4, 4]),
    pts: [
      { v: 36, t: 36 },
      { v: 44, cls: "b", t: "?" },
    ],
    label: "36 plus 8: jumps of 4 and 4 from 36",
  }),
};
const STEPS = [
  {
    title: "Tens, then ones",
    widget: jumper(
      TENS,
      (P) => `${P.label}: start at <b>${P.a}</b>. <span class="dimline">Jump by tens first, then the ones.</span>`,
    ),
    body: "<p>To add or subtract a number like 23, jump by <b>tens</b> first: 10, 10. Then jump the <b>ones</b>: 3.</p><p>Pick a problem, then tap to jump.</p>",
    check: {
      kind: "num",
      answer: 77,
      fig: F.tens45,
      q: "What is 45 + 32? Where do the jumps land?",
      misc: [
        [75, "Don’t forget the last jump of 2."],
        [65, "32 has 3 tens. Count the jumps of 10: 3 of them."],
        [50, "Each big jump is 10, not 1."],
      ],
      explain: "45 + 10 = 55, + 10 = 65, + 10 = 75, + 2 = 77. So 45 + 32 = 77.",
    },
  },
  {
    title: "Jump to a ten",
    widget: jumper(TOTEN, (P) => {
      const up = P.steps[0] > 0;
      return `${P.label}: start at <b>${P.a}</b>.<br><span class="dimline">First jump ${up ? "up" : "back"} to ${P.a + P.steps[0]}. Then jump the rest.</span>`;
    }),
    body: "<p>A <b>ten</b> is an easy place to stop. 28 + 7: jump 2 to get to 30, then 5 more. 7 is 2 and 5.</p><p>Pick a problem, then tap to jump.</p>",
    check: {
      kind: "num",
      answer: 44,
      fig: F.toTen36,
      q: "What is 36 + 8?",
      misc: [
        [48, "You jumped 4 to 40, then 8 more. Only 4 are left to jump: 8 is 4 and 4."],
        [28, "Adding means jumping right."],
        [43, "Count the spaces: from 40, 4 more is 44."],
      ],
      explain: "36 + 4 = 40. 8 is 4 and 4, so 4 more: 40 + 4 = 44.",
    },
  },
];
