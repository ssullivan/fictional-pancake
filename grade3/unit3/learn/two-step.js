/* Learn Wrapping Up Addition and Subtraction within 1,000 (Grade 3 Unit 3), chapter 9: Two-step problems. Its widgets and steps;
   loaded by two-step.html. */
/* Two-step stories: the story, its two steps ([expression, value]), the answer's unit, an equation with a letter for the unknown
   (letter: what it stands for), and its tape diagram after `done` steps. */
const STORIES = [
  {
    name: "Kites",
    story: "The harbor shop had 600 kites. It sold 245 on Saturday and 178 on Sunday. How many kites are left?",
    steps: [
      ["600 − 245", 355],
      ["355 − 178", 177],
    ],
    unit: "kites",
    equation: "600 − 245 − 178 = k",
    letter: "k is the kites left",
    fig: (done) =>
      partWhole(
        [
          { n: 245, show: 245 },
          { n: 178, show: 178 },
          { n: 177, show: done === 2 ? 177 : "?", hi: done === 2 },
        ],
        600,
        "A tape of 600 kites: 245 sold, 178 sold, and the rest left",
      ),
  },
  {
    name: "Shells",
    story:
      "Clare’s class wants to collect 500 shells. They collected 186 on Monday and 207 on Tuesday. How many more shells do they need?",
    steps: [
      ["186 + 207", 393],
      ["500 − 393", 107],
    ],
    unit: "shells",
    equation: "500 − 186 − 207 = s",
    letter: "s is the shells they still need",
    fig: (done) =>
      partWhole(
        [
          { n: 186, show: 186 },
          { n: 207, show: 207 },
          { n: 107, show: done === 2 ? 107 : "?", hi: done === 2 },
        ],
        500,
        "A tape of 500 shells: 186, 207, and the rest still needed",
      ),
  },
  {
    name: "Pages",
    story: "Andre read 214 pages. Priya read 85 more pages than Andre. How many pages did they read in all?",
    steps: [
      ["214 + 85", 299],
      ["214 + 299", 513],
    ],
    unit: "pages",
    equation: "214 + 214 + 85 = p",
    letter: "p is all the pages they read",
    fig: (done) =>
      tapes(
        [
          { label: "Andre", n: 214, show: 214 },
          { label: "Priya", n: 299, show: done ? 299 : "?" },
        ],
        { diff: 85 },
      ),
  },
];
/* Pick a story and solve it one step at a time with its tape diagram. */
function wTwoStep(el) {
  /* done: how many steps are solved */
  const q = Q(el);
  let storyIndex = 0,
    done = 0;
  el.innerHTML =
    seg(
      "Story",
      STORIES.map((story, i) => [i, story.name]),
    ) +
    `<p class="readout" data-s></p><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Next step</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const story = STORIES[storyIndex],
      answer = story.steps[1][1];
    press(el, storyIndex);
    q("go").disabled = done === 2;
    q("s").textContent = story.story;
    q("f").innerHTML = story.fig(done);
    q("r").innerHTML =
      (done
        ? story.steps
            .slice(0, done)
            .map(([expression, value], i) => `<b>Step ${i + 1}:</b> ${expression} = ${value}`)
            .join("<br>")
        : "Find the part you need first. What’s the first step?") +
      (done === 2 ? `<br><span class="ok">That’s <b>${answer}</b> ${story.unit}.</span>` : "");
  };
  q("go").onclick = () => {
    if (done < 2) done++;
    draw();
  };
  q("clr").onclick = () => {
    done = 0;
    draw();
  };
  onPick(el, (id) => {
    storyIndex = +id;
    done = 0;
    draw();
  });
  draw();
}
/* Pick a story: one equation with a letter for the unknown, or two equations, one per step; and a button to find the letter. */
function wEquation(el) {
  /* asOne: one equation is showing (else two); solved: the letter's value is showing */
  const q = Q(el);
  let storyIndex = 0,
    asOne = true,
    solved = false;
  el.innerHTML =
    `<div data-top>${seg(
      "Story",
      STORIES.map((story, i) => [i, story.name]),
    )}</div><div data-bot>${seg("Write it as", [
      ["one", "One equation"],
      ["two", "Two equations"],
    ])}</div>` +
    `<p class="readout" data-s></p><p class="eq" data-e></p><div class="wrow"><button type="button" class="btn" data-go>Find the letter</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const story = STORIES[storyIndex],
      letter = story.equation.slice(-1),
      [first, second] = story.steps;
    press(q("top"), storyIndex);
    press(q("bot"), asOne ? "one" : "two");
    q("go").disabled = solved;
    q("s").textContent = story.story;
    q("e").innerHTML = asOne ? story.equation : `${first[0]} = ${first[1]}<br>${second[0]} = ${letter}`;
    q("r").innerHTML =
      `The letter ${story.letter}.` +
      (solved
        ? `<br><span class="ok">${letter} = <b>${second[1]}</b>: ${second[1]} ${story.unit}.</span>`
        : '<br><span class="dimline">A letter stands for the number you don’t know yet.</span>');
  };
  q("go").onclick = () => {
    solved = true;
    draw();
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") {
      storyIndex = +id;
      solved = false;
    } else asOne = id === "one";
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Two steps with a tape diagram",
    widget: wTwoStep,
    body: "<p>Some stories take <b>two steps</b>. A <b>tape diagram</b> shows the parts and the whole, so you can see what to find first. For the kites: take away Saturday’s, then Sunday’s.</p><p>Pick a story and solve it one step at a time.</p>",
    check: {
      kind: "num",
      q: "The ferry had 412 people on board. At the first stop, 135 people got off. At the second stop, 160 people got on. How many people are on the ferry now?",
      answer: 437,
      unit: "people",
      misc: [
        [277, "That’s after the first stop. Then 160 people got on: add them."],
        [117, "160 people got on at the second stop, so add them, don’t take them away."],
      ],
      explain: "First, 412 − 135 = 277. Then 277 + 160 = 437. That’s 437 people.",
    },
  },
  {
    title: "Equations with a letter",
    widget: wEquation,
    body: "<p>An <b>equation</b> can tell the whole story, with a <b>letter</b> for the number you don’t know: 600 − 245 − 178 = k. You can also write one equation for each step.</p><p>Pick a story. Show it as one equation or two, then find the letter.</p>",
    check: {
      kind: "mc",
      q: "Mai read 214 pages. Han read 85 more pages than Mai. Which equation shows how many pages they read in all? The letter p stands for all the pages.",
      choices: [
        { id: "a", label: "214 + 85 = p" },
        { id: "b", label: "214 + 214 − 85 = p" },
        { id: "c", label: "214 + 214 + 85 = p" },
      ],
      answer: "c",
      why: {
        a: "That’s only how many Han read. Add Mai’s 214 pages too.",
        b: "Han read more pages than Mai, not fewer.",
      },
      explain: "Han read 214 + 85 = 299 pages. Together: 214 + 299 = 513, so 214 + 214 + 85 = p, and p = 513.",
    },
  },
];
