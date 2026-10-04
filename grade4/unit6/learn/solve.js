/* Learn Multiplying and Dividing Multi-digit Numbers (Grade 4 Unit 6), chapter 8: Solve and check. Its widgets and steps; loaded by solve.html. */
/* answers to check with an estimate: [the claim, the estimate worked out, whether the claim is right, the true answer] */
const CLAIMS = [
  ["48 × 21 = 1,808", "50 × 20 = 1,000", false, "1,008"],
  ["396 ÷ 4 = 99", "400 ÷ 4 = 100", true, "99"],
  ["2,109 + 3,896 = 5,005", "2,000 + 4,000 = 6,000", false, "6,005"],
  ["6 × 512 = 3,072", "6 × 500 = 3,000", true, "3,072"],
];
/* Pick a claim and say whether it's reasonable: an estimate with friendly numbers shows whether it's close. */
function wEstimate(el) {
  /* verdict: what was picked, "yes" or "no" (null before a pick) */
  const q = Q(el);
  let claimIndex = 0,
    verdict = null;
  el.innerHTML =
    `<div data-top>${seg(
      "Claim",
      CLAIMS.map(([claim], i) => [i, claim]),
    )}</div><div data-bot>${seg("Is it reasonable?", [
      ["yes", "Reasonable"],
      ["no", "Not reasonable"],
    ])}</div>` + `<p class="readout" data-r></p>`;
  const draw = () => {
    const [claim, estimate, right, actual] = CLAIMS[claimIndex];
    press(q("top"), claimIndex);
    press(q("bot"), verdict);
    q("r").innerHTML =
      verdict === null
        ? `Someone says <b>${claim}</b>. Round to friendly numbers and estimate. Is it reasonable?`
        : (verdict === (right ? "yes" : "no")
            ? `<span class="ok">Yes!</span> `
            : `<span class="no">Not quite.</span> `) +
          `Estimate: ${estimate}. ${right ? `The answer is close to that, so it’s reasonable. It’s right: ${actual}.` : `The answer is too far from that, so it isn’t reasonable. The right answer is ${actual}.`}`;
  };
  el.addEventListener("click", (e) => {
    const hit = segHit(e, ["top", "bot"]);
    if (!hit) return;
    if (hit[0] === "top") {
      claimIndex = +hit[1];
      verdict = null;
    } else verdict = hit[1];
    draw();
  });
  draw();
}
/* stories with two steps: [button, story, the steps as [work, what it finds]] */
const TWO_STEPS = [
  [
    "Pencils",
    "A school buys 6 boxes of 144 pencils and gives 250 pencils to another school. How many pencils are left?",
    [
      ["6 × 144 = 864", "pencils bought"],
      ["864 − 250 = 614", "pencils left"],
    ],
  ],
  [
    "Tickets",
    "Museum tickets cost $8 each. 27 students and 3 teachers go. How much do the tickets cost in all?",
    [
      ["27 + 3 = 30", "people going"],
      ["30 × 8 = 240", "dollars in all"],
    ],
  ],
  [
    "Muffins",
    "A baker makes 4 batches of 36 muffins and packs them in boxes of 6. How many boxes is that?",
    [
      ["4 × 36 = 144", "muffins"],
      ["144 ÷ 6 = 24", "boxes"],
    ],
  ],
];
/* Pick a story and work it one step at a time (a stepper). */
function wSteps(el) {
  /* the stepper's value: done, how many steps are worked */
  const q = Q(el),
    values = { done: 0 },
    limits = { done: [0, 2] };
  let storyIndex = 0;
  el.innerHTML =
    seg(
      "Story",
      TWO_STEPS.map(([name], i) => [i, name]),
    ) +
    `<p class="readout" data-s></p><div class="wrow">${stepper("done", "Steps")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const [, story, steps] = TWO_STEPS[storyIndex],
      done = values.done;
    press(el, storyIndex);
    q("done").textContent = done;
    q("s").innerHTML = story;
    q("r").innerHTML = !done
      ? "What do you need to find first? Tap + to work the first step."
      : steps
          .slice(0, done)
          .map(([work, finds], i) => `Step ${i + 1}: ${work} ${finds}.`)
          .join("<br>") +
        (done === steps.length
          ? `<br><b>Answer: ${steps[steps.length - 1][0].split(" = ")[1]} ${steps[steps.length - 1][1]}.</b>`
          : "");
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    storyIndex = +m;
    values.done = 0;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Is the answer reasonable?",
    widget: wEstimate,
    body: "<p>Before trusting an answer, estimate. Round the numbers to friendly ones and work it out in your head. If the answer is far from the estimate, check the work.</p><p>Pick a claim, then decide whether it’s reasonable.</p>",
    check: {
      kind: "mc",
      q: "Jada says 52 × 19 = 2,988. Is that reasonable?",
      choices: [
        { id: "a", label: "No: 50 × 20 is about 1,000" },
        { id: "b", label: "Yes: it has 4 digits" },
        { id: "c", label: "Yes: 52 + 19 is about 70" },
      ],
      answer: "a",
      why: {
        b: "Having 4 digits isn’t enough. 50 × 20 = 1,000, and 2,988 is much more than that.",
        c: "That estimates a sum. 52 × 19 is a product: about 50 × 20 = 1,000.",
      },
      explain: "50 × 20 = 1,000, so 52 × 19 should be about 1,000. 2,988 is too far. (It’s 988.)",
    },
  },
  {
    title: "Problems with more than one step",
    widget: wSteps,
    body: "<p>Some problems take two steps. Find what you need first, then use it to answer the question. Write each step with what it finds.</p><p>Pick a story, then work it one step at a time.</p>",
    check: {
      kind: "num",
      q: "A store has 5 boxes of 120 pencils. It sells 275 pencils. How many pencils are left?",
      answer: 325,
      unit: "pencils",
      misc: [
        [600, "That’s how many the store had. It sold 275 of them: subtract."],
        [875, "That adds. The store sold 275, so subtract: 600 − 275."],
      ],
      explain: "5 × 120 = 600 pencils. 600 − 275 = 325 pencils left.",
    },
  },
];
