/* Learn Putting It All Together (Grade 4 Unit 9), chapter 3: Multiplication and division problems. Its widgets and steps; loaded by problems.html. */
/* the questions a comparison can ask: [id, button] */
const ASKS = [
  ["bigger", "The bigger amount"],
  ["times", "How many times"],
  ["smaller", "The smaller amount"],
  ["more", "How many more"],
];
/* Pick a question about a comparison and change its numbers (steppers): the tape diagram and the work. */
function wCompare(el) {
  /* the steppers' values: small, the smaller amount, and times, how many times as much the bigger is */
  const q = Q(el),
    values = { small: 6, times: 4 },
    limits = { small: [2, 9], times: [2, 9] };
  let ask = "bigger";
  el.innerHTML =
    seg("Question", ASKS) +
    `<div class="wrow">${stepper("small", "Seeds in a cup")}${stepper("times", "Times as many")}</div>` +
    `<p class="readout" data-s></p><div class="fig" data-f></div><p class="eq" data-e></p>`;
  const draw = () => {
    const { small, times } = values,
      big = small * times;
    press(el, ask);
    q("small").textContent = small;
    q("times").textContent = times;
    q("s").innerHTML = {
      bigger: `Mai plants ${small} seeds. Noah plants ${times} times as many. How many seeds does Noah plant?`,
      times: `Mai plants ${small} seeds. Noah plants ${big}. How many times as many does Noah plant?`,
      smaller: `Noah plants ${big} seeds. That’s ${times} times as many as Mai. How many does Mai plant?`,
      more: `Mai plants ${small} seeds. Noah plants ${times} times as many. How many more does Noah plant?`,
    }[ask];
    q("f").innerHTML = timesTape(
      [
        { label: "Mai", times: 1, each: ask === "smaller" ? "?" : small, total: ask === "smaller" ? "?" : small },
        ask === "times"
          ? { label: "Noah", times: 1, span: times, each: big, total: `? × ${small}` }
          : { label: "Noah", times, each: ask === "smaller" ? "?" : small, total: ask === "bigger" ? "?" : big },
      ],
      { label: `Tape diagram comparing ${small} and ${big}` },
    );
    q("e").innerHTML = {
      bigger: `${times} × ${small} = ${big}`,
      times: `${big} ÷ ${small} = ${times}`,
      smaller: `${big} ÷ ${times} = ${small}`,
      more: `${times} × ${small} = ${big}, and ${big} − ${small} = ${big - small}`,
    }[ask];
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    ask = m;
    draw();
  });
  draw();
}
/* stories that multiply or divide: [button, story, op, work, what to do with a remainder] */
const STORIES = [
  ["Seats", "A train has 9 cars with 64 seats in each car. How many seats are there?", "×", "9 × 64 = 576 seats"],
  ["Boxes", "A store packs 156 eggs in cartons of 12. How many cartons does it fill?", "÷", "156 ÷ 12 = 13 cartons"],
  [
    "Teams",
    "The school has 87 students for a field day. Teams have 6 students. How many full teams can they make?",
    "÷",
    "87 ÷ 6 = 14 R 3: 14 full teams, with 3 students left to help",
  ],
];
/* Pick a story and whether to multiply or divide: it says whether that fits, and works it out. */
function wMultiDiv(el) {
  /* choice: the operation picked (null before one is) */
  const q = Q(el);
  let storyIndex = 0,
    choice = null;
  el.innerHTML =
    `<div data-top>${seg(
      "Story",
      STORIES.map(([name], i) => [i, name]),
    )}</div><div data-bot>${seg("Operation", [
      ["×", "Multiply"],
      ["÷", "Divide"],
    ])}</div>` + `<p class="readout" data-s></p><p class="readout" data-r></p>`;
  const draw = () => {
    const [, story, op, work] = STORIES[storyIndex];
    press(q("top"), storyIndex);
    press(q("bot"), choice);
    q("s").innerHTML = story;
    q("r").innerHTML =
      choice === null
        ? "Multiply or divide? Tap one."
        : (choice === op ? `<span class="ok">Yes!</span> ` : `<span class="no">Not quite.</span> `) +
          (op === "×"
            ? "The number of groups and the size of each are known: multiply to find the total."
            : "The total is known: divide to find how many groups or how many in each.") +
          ` ${work}.`;
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
    title: "Comparison problems",
    widget: wCompare,
    body: "<p>A tape diagram shows a comparison: the bigger amount is copies of the smaller one. Multiply to find the bigger amount. Divide to find how many times, or the smaller amount. Subtract to find how many more.</p><p>Pick a question and change the numbers.</p>",
    check: {
      kind: "num",
      q: "A giraffe is 18 feet tall. A kangaroo is 6 feet tall. How many times as tall as the kangaroo is the giraffe?",
      answer: 3,
      unit: "times",
      misc: [
        [12, "That’s how much taller. How many 6s make 18?"],
        [108, "That multiplies. Divide: 18 ÷ 6."],
      ],
      explain: "18 = ? × 6. 18 ÷ 6 = 3, so the giraffe is 3 times as tall.",
    },
  },
  {
    title: "Multiply or divide?",
    widget: wMultiDiv,
    body: "<p>When you know how many groups and how many in each, multiply to find the total. When you know the total, divide to find the groups or the size of each. A remainder means deciding what the story needs.</p><p>Pick a story, then multiply or divide.</p>",
    check: {
      kind: "num",
      q: "A theater has 8 rows with 45 seats in each row. How many seats are there?",
      answer: 360,
      unit: "seats",
      misc: [
        [53, "That adds 8 + 45. There are 8 equal rows: multiply."],
        [320, "That’s 8 × 40. Multiply the 5 too: 8 × 5 = 40, and 320 + 40 = 360."],
      ],
      explain: "8 × 40 = 320 and 8 × 5 = 40. 320 + 40 = 360 seats.",
    },
  },
];
