/* Learn Putting It All Together (Grade 4 Unit 9), chapter 1: Reason with fractions. Its widgets and steps; loaded by fractions.html. */
/* the operations: [id, button, the denominator used] */
const OPS = [
  ["+", "Add", 8],
  ["−", "Subtract", 8],
  ["×", "Multiply", 5],
];
/* k/d as a fraction, then as a mixed number when it's more than 1 (html) */
const asMixed = (k, d) =>
  fr(k, d) + (k > d && k % d ? ` = ${mixed(k, d)}` : k >= d && k % d === 0 ? ` = ${k / d}` : "");
/* Pick an operation and change its numbers (steppers): strips show it, and the equation works it out. */
function wOps(el) {
  /* the steppers' values: a and b, the two numbers (for ×, a is how many groups and b the numerator of each) */
  const q = Q(el),
    values = { a: 5, b: 3 },
    limits = { a: [1, 7], b: [1, 4] };
  let op = "+";
  el.innerHTML =
    seg(
      "Operation",
      OPS.map(([id, name]) => [id, name]),
    ) +
    `<div class="wrow">${stepper("a", "First")}${stepper("b", "Second")}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const d = OPS.find(([id]) => id === op)[2],
      { a, b } = values;
    press(el, op);
    q("a").textContent = a;
    q("b").textContent = b;
    if (op === "+") {
      q("f").innerHTML = strips([{ d, k: a + b, grp: [a, b] }], { wholes: 2 });
      q("e").innerHTML = `${fr(a, d)} + ${fr(b, d)} = ${asMixed(a + b, d)}`;
      q("r").innerHTML = `Eighths plus eighths are still eighths: add the numerators, ${a} + ${b} = ${a + b}.`;
    } else if (op === "−") {
      const left = Math.max(a - b, 0);
      q("f").innerHTML = strips([{ d, k: a, out: Math.min(a, b) }], { wholes: 1 });
      q("e").innerHTML =
        b > a ? `${fr(a, d)} − ${fr(b, d)}: not enough to take away` : `${fr(a, d)} − ${fr(b, d)} = ${fr(left, d)}`;
      q("r").innerHTML =
        b > a
          ? `You can’t take ${b} eighths from ${a}. Make the first number bigger.`
          : `Take ${b} of the ${a} eighths away: ${left} ${left === 1 ? "eighth" : "eighths"} left.`;
    } else {
      q("f").innerHTML = strips([{ d, k: a * b, grp: b }], { wholes: Math.max(1, Math.ceil((a * b) / d)) });
      q("e").innerHTML = `${a} × ${fr(b, d)} = ${fr(`${a} × ${b}`, d)} = ${asMixed(a * b, d)}`;
      q("r").innerHTML =
        `${a} group${a > 1 ? "s" : ""} of ${fr(b, d)}: multiply the numerator by ${a}. The parts stay fifths.`;
    }
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    op = m;
    draw();
  });
  draw();
}
/* stories and the operation each needs: [button, story, op, the work] */
const STORIES = [
  [
    "Ribbon",
    "Each bow takes 3/4 yard of ribbon. How much ribbon do 5 bows take?",
    "×",
    `5 × ${fr(3, 4)} = ${fr(15, 4)} = 3 ${fr(3, 4)} yards`,
  ],
  [
    "Juice",
    "A pitcher has 7/8 liter of juice. Lin pours out 3/8 liter. How much is left?",
    "−",
    `${fr(7, 8)} − ${fr(3, 8)} = ${fr(4, 8)} liter`,
  ],
  [
    "Hike",
    "Han hikes 2 1/4 miles in the morning and 1 2/4 miles after lunch. How far in all?",
    "+",
    `2 ${fr(1, 4)} + 1 ${fr(2, 4)} = 3 ${fr(3, 4)} miles`,
  ],
];
/* why an operation fits a story */
const OP_WHY = {
  "+": "two amounts are put together",
  "−": "some is taken away",
  "×": "there are equal groups of the same amount",
};
/* Pick a story and the operation it needs: it says whether that fits, and works it out. */
function wStory(el) {
  /* choice: the operation picked (null before one is) */
  const q = Q(el);
  let storyIndex = 0,
    choice = null;
  el.innerHTML =
    `<div data-top>${seg(
      "Story",
      STORIES.map(([name], i) => [i, name]),
    )}</div><div data-bot>${seg("Operation", [
      ["+", "Add"],
      ["−", "Subtract"],
      ["×", "Multiply"],
    ])}</div>` + `<p class="readout" data-s></p><p class="readout" data-r></p>`;
  const draw = () => {
    const [, story, op, work] = STORIES[storyIndex];
    press(q("top"), storyIndex);
    press(q("bot"), choice);
    q("s").innerHTML = story.replace(/(\d+) (\d)\/(\d)|(\d)\/(\d)/g, (m, whole, n, d, n2, d2) =>
      whole ? `${whole} ${fr(n, d)}` : fr(n2, d2),
    );
    q("r").innerHTML =
      choice === null
        ? "Which operation does the story need? Tap one."
        : (choice === op ? `<span class="ok">Yes!</span> ` : `<span class="no">Not quite.</span> `) +
          `Here ${OP_WHY[op]}. ${work}.`;
  };
  el.addEventListener("click", (e) => {
    const hit = segHit(e, ["top", "bot"]);
    if (!hit) return;
    if (hit[0] === "top") {
      storyIndex = +hit[1];
      choice = null;
    } else choice = hit[1];
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Add, subtract, and multiply fractions",
    widget: wOps,
    body: "<p>With the same denominator, add or subtract the numerators: the size of the parts doesn’t change. To multiply a fraction by a whole number, multiply the numerator: that many groups of the same parts.</p><p>Pick an operation and change the numbers.</p>",
    check: {
      kind: "num",
      q: "What is " + fr(3, 8) + " + " + fr(6, 8) + "?",
      answer: 9 / 8,
      frac: true,
      misc: [[9 / 16, "That adds the denominators too. Eighths plus eighths are still eighths."]],
      explain: fr(3, 8) + " + " + fr(6, 8) + " = " + fr(9, 8) + " = 1 " + fr(1, 8) + ".",
    },
  },
  {
    title: "Which operation?",
    widget: wStory,
    body: "<p>Read a story and decide what’s happening. Putting amounts together is adding, taking some away is subtracting, and equal groups of an amount is multiplying.</p><p>Pick a story, then the operation it needs.</p>",
    check: {
      kind: "mc",
      q: "Each muffin takes " + fr(2, 3) + " cup of flour. Which expression shows the flour for 6 muffins?",
      choices: [
        { id: "a", label: "6 × " + fr(2, 3) },
        { id: "b", label: "6 + " + fr(2, 3) },
        { id: "c", label: fr(2, 3) + " − 6" },
      ],
      answer: "a",
      why: {
        b: "That’s 6 cups and 2/3 more. There are 6 equal groups of 2/3 cup.",
        c: "Nothing is taken away. There are 6 equal groups of 2/3 cup.",
      },
      explain: "6 equal groups of " + fr(2, 3) + " cup: 6 × " + fr(2, 3) + " = " + fr(12, 3) + " = 4 cups.",
    },
  },
];
