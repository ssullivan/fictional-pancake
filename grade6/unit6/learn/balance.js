/* Learn Expressions and Equations (Grade 6 Unit 6), chapter 2: Staying in balance. Its widgets and steps; loaded by balance.html. */
/* A balanced hanger for x + 3 = 7 (x weighs 4): take unit squares off one side or both, and see whether it stays balanced. */
function wTakeOff(el) {
  /* leftOnes and rightOnes: the unit squares on each side; xWeight: what the circle really weighs */
  const q = Q(el),
    xWeight = 4;
  let leftOnes = 3,
    rightOnes = 7;
  el.innerHTML =
    `<div class="fig" data-f></div><p class="eq" data-e></p>` +
    `<div class="wrow">` +
    `<button type="button" class="ghost-btn" data-move="left">Take 1 off the left</button>` +
    `<button type="button" class="ghost-btn" data-move="right">Take 1 off the right</button>` +
    `<button type="button" class="ghost-btn" data-move="both">Take 1 off each side</button>` +
    `<button type="button" class="ghost-btn" data-move="reset">Start over</button>` +
    `</div><p class="readout" data-r></p>`;
  const draw = () => {
    const leftWeight = xWeight + leftOnes,
      balanced = leftWeight === rightOnes,
      leftText = leftOnes ? `x + ${leftOnes}` : "x";
    q("f").innerHTML = hanger(
      ["x", ...range(leftOnes).map(() => 1)],
      range(rightOnes).map(() => 1),
      {
        tip: Math.sign(rightOnes - leftWeight),
      },
    );
    q("e").innerHTML = withVars(`${leftText} ${balanced ? "=" : "≠"} ${rightOnes}`);
    el.querySelector('[data-move="left"]').disabled = !leftOnes;
    el.querySelector('[data-move="right"]').disabled = !rightOnes;
    el.querySelector('[data-move="both"]').disabled = !leftOnes || !rightOnes;
    q("r").innerHTML = withVars(
      !balanced
        ? `<span class="no">The hanger tipped.</span> Only one side changed, so the two sides aren’t equal anymore: ${leftText} and ${rightOnes} are different amounts. Start over, and change both sides the same way.`
        : leftOnes
          ? `Still balanced: ${leftText} = ${rightOnes}. Taking the same amount off each side keeps the two sides equal.`
          : `<span class="ok">The circle is alone, and it balances ${rightOnes} squares: <b>x = ${rightOnes}</b>.</span> Check in the first equation: ${rightOnes} + 3 = 7 ✓`,
    );
  };
  el.addEventListener("click", (e) => {
    const button = e.target.closest("[data-move]");
    if (!button) return;
    const move = button.dataset.move;
    if (move === "reset") {
      leftOnes = 3;
      rightOnes = 7;
    }
    if (move === "left" || move === "both") leftOnes = Math.max(0, leftOnes - 1);
    if (move === "right" || move === "both") rightOnes = Math.max(0, rightOnes - 1);
    draw();
  });
  draw();
}

/* equations n·x = total: a hanger with n circles on the left and total unit squares on the right */
const GROUP_EQS = [
  { n: 3, total: 12 },
  { n: 2, total: 10 },
  { n: 4, total: 20 },
];
/* Pick an equation, then split each side into equal groups and keep one group of each. */
function wGroups(el) {
  const q = Q(el);
  let pickIndex = 0,
    split = false;
  el.innerHTML =
    seg(
      "Equation",
      GROUP_EQS.map((eq, i) => [i, withVars(`${eq.n}x = ${eq.total}`)]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-split></button></div>` +
    `<ul class="work-lines" data-e></ul><p class="readout" data-r></p>`;
  const draw = () => {
    const { n, total } = GROUP_EQS[pickIndex],
      each = total / n;
    press(el, pickIndex);
    q("split").textContent = split ? "Put the groups back" : `Divide each side by ${n}`;
    q("f").innerHTML = split
      ? hanger(
          ["x"],
          range(each).map(() => 1),
        )
      : hanger(
          range(n).map(() => "x"),
          range(total).map(() => 1),
        );
    q("e").innerHTML = [
      `<li>${withVars(`${n}x = ${total}`)}</li>`,
      ...(split
        ? [
            `<li>${withVars(`${n}x ÷ ${n} = ${total} ÷ ${n}`)}<span class="why">divide each side by ${n}</span></li>`,
            `<li>${withVars(`x = ${each}`)}<span class="why">check: ${n} · ${each} = ${total} ✓</span></li>`,
          ]
        : []),
    ].join("");
    q("r").innerHTML = withVars(
      split
        ? `Split each side into ${n} equal groups: each group of the left is one x, and each group of the right is ${each} squares. Keep one group of each, and the hanger still balances: <b>x = ${each}</b>.`
        : `${n} circles balance ${total} squares. Each circle weighs the same, so the squares can be shared out equally among them.`,
    );
  };
  onPick(el, (id) => {
    pickIndex = +id;
    split = false;
    draw();
  });
  q("split").addEventListener("click", () => {
    split = !split;
    draw();
  });
  draw();
}

/* equations to solve with one move: x + p = q or p·x = q, as exact fractions; decimal: write the numbers as decimals */
const MOVE_EQS = [
  { id: "a", kind: "plus", p: frac(3, 2), total: frac(4), decimal: true },
  { id: "b", kind: "plus", p: frac(3, 4), total: frac(5, 2) },
  { id: "c", kind: "times", p: frac(4), total: frac(36, 5), decimal: true },
  { id: "d", kind: "times", p: frac(6), total: frac(15) },
];
/* a number from one of these equations, as html (stacked fraction) or as plain text (in a picture) */
const moveNum = (eq, f) => (eq.decimal ? fmt(fVal(f)) : fx(f));
const moveText = (eq, f) => (eq.decimal ? fmt(fVal(f)) : ftx(f));
/* an equation as written: x + p = q, or p·x written px */
const moveEq = (eq) =>
  eq.kind === "plus"
    ? `${mathVar("x")} + ${moveNum(eq, eq.p)} = ${moveNum(eq, eq.total)}`
    : `${moveNum(eq, eq.p)}${mathVar("x")} = ${moveNum(eq, eq.total)}`;
/* Pick an equation, then a move that does the same thing to each side: the right one gets x alone, the others keep the
   equation true but don't. A tape shows the same reasoning another way. */
function wMoves(el) {
  const q = Q(el);
  let eqId = "a",
    move = null;
  el.innerHTML =
    `<div data-top>${seg(
      "Equation",
      MOVE_EQS.map((eq) => [eq.id, moveEq(eq)]),
    )}</div>` +
    `<div class="fig" data-f></div><div data-bot></div><ul class="work-lines" data-e></ul><p class="readout" data-r></p>`;
  const draw = () => {
    const eq = MOVE_EQS.find((e) => e.id === eqId),
      x = eq.kind === "plus" ? fSub(eq.total, eq.p) : fDiv(eq.total, eq.p),
      pText = moveNum(eq, eq.p),
      totalText = moveNum(eq, eq.total),
      xVar = mathVar("x");
    q("top")
      .querySelectorAll("[data-m]")
      .forEach((b) => b.setAttribute("aria-pressed", b.dataset.m === eqId));
    /* the moves this kind of equation offers; the first one is the move that gets x alone */
    const moves =
      eq.kind === "plus"
        ? [
            ["sub", `Subtract ${pText} from each side`],
            ["add", `Add ${pText} to each side`],
            ["div", `Divide each side by ${pText}`],
          ]
        : [
            ["div", `Divide each side by ${pText}`],
            ["sub", `Subtract ${pText} from each side`],
            ["mul", `Multiply each side by ${pText}`],
          ];
    q("bot").innerHTML = seg("Move", moves);
    q("bot")
      .querySelectorAll("[data-m]")
      .forEach((b) => b.setAttribute("aria-pressed", b.dataset.m === move));
    /* the tape: x and p make the total, or p equal pieces of x make it */
    q("f").innerHTML =
      eq.kind === "plus"
        ? partWhole(
            [
              { n: fVal(x), show: "x" },
              { n: fVal(eq.p), show: moveText(eq, eq.p) },
            ],
            moveText(eq, eq.total),
            `Tape diagram: x and ${moveText(eq, eq.p)} make ${moveText(eq, eq.total)}`,
          )
        : partWhole(
            range(fVal(eq.p)).map(() => ({ n: 1, show: "x" })),
            moveText(eq, eq.total),
            `Tape diagram: ${fVal(eq.p)} equal pieces, each x, make ${moveText(eq, eq.total)}`,
          );
    const tapeWay =
      eq.kind === "plus"
        ? `On the tape, x and ${pText} make ${totalText}, so x is ${totalText} − ${pText}.`
        : `On the tape, ${pText} equal pieces make ${totalText}, so each piece is ${totalText} ÷ ${pText}.`;
    const lines = [`<li>${moveEq(eq)}</li>`];
    let say;
    if (move === null) say = `Pick a move. Whatever you do, do it to each side.`;
    else if (move === moves[0][0]) {
      lines.push(
        eq.kind === "plus"
          ? `<li>${xVar} + ${pText} − ${pText} = ${totalText} − ${pText}<span class="why">subtract ${pText} from each side</span></li>`
          : `<li>${pText}${xVar} ÷ ${pText} = ${totalText} ÷ ${pText}<span class="why">divide each side by ${pText}</span></li>`,
        `<li>${xVar} = ${moveNum(eq, x)}</li>`,
        `<li><span class="why">check: ${eq.kind === "plus" ? `${moveNum(eq, x)} + ${pText}` : `${pText} · ${moveNum(eq, x)}`} = ${totalText} ✓</span></li>`,
      );
      say = `<span class="ok">x is alone: <b>x = ${moveNum(eq, x)}</b>.</span> ${eq.kind === "plus" ? "Subtracting undoes adding." : "Dividing undoes multiplying."}`;
    } else {
      const wrong = {
        add: [`${xVar} + ${pText} + ${pText} = ${totalText} + ${pText}`, `Now there’s even more added to x.`],
        div: [
          `(${xVar} + ${pText}) ÷ ${pText} = ${totalText} ÷ ${pText}`,
          `x is still tied up with ${pText}, and now divided too.`,
        ],
        sub: [
          `${pText}${xVar} − ${pText} = ${totalText} − ${pText}`,
          `Subtracting doesn’t undo multiplying: x is still multiplied by ${pText}.`,
        ],
        mul: [
          `${pText} · ${pText}${xVar} = ${pText} · ${totalText}`,
          `Now x is multiplied by ${pText} twice, further from alone.`,
        ],
      }[move];
      lines.push(`<li class="bad">${wrong[0]}</li>`);
      say = `Still true, because each side changed the same way. But x isn’t alone. ${wrong[1]} Try another move.`;
    }
    q("e").innerHTML = lines.join("");
    q("r").innerHTML = withVars(`${say}<br><span class="dimline">Another way: ${tapeWay}</span>`);
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") {
      eqId = id;
      move = null;
    } else move = id;
    draw();
  });
  draw();
}

/* Steppers for a and b in b·x = a: a tape of a cut into b equal parts, so x = a/b, which is a ÷ b. */
function wFractionBar(el) {
  const q = Q(el),
    values = { a: 7, b: 3 };
  el.innerHTML =
    `<div class="wrow">${stepper("b", "Pieces (b)")}${stepper("a", "Total (a)")}</div>` +
    `<div class="fig" data-f></div><ul class="work-lines" data-e></ul><p class="readout" data-r></p>`;
  const draw = () => {
    const { a, b } = values,
      x = frac(a, b),
      xVar = mathVar("x");
    q("a").textContent = a;
    q("b").textContent = b;
    q("f").innerHTML = partWhole(
      range(b).map(() => ({ n: 1, show: ftx(x) })),
      String(a),
      `Tape diagram: ${a} cut into ${b} equal parts of ${ftx(x)}`,
    );
    q("e").innerHTML = [
      `<li>${b}${xVar} = ${a}</li>`,
      `<li>${xVar} = ${a} ÷ ${b}<span class="why">divide each side by ${b}</span></li>`,
      `<li>${xVar} = ${fr(a, b)}${isWhole(x) ? ` = ${x[0]}` : x[0] > x[1] ? ` = ${fx(x)}` : ""}</li>`,
      `<li><span class="why">check: ${b} · ${fr(a, b)} = ${fr(a * b, b)} = ${a} ✓</span></li>`,
    ].join("");
    q("r").innerHTML = withVars(
      `Cut ${a} into ${b} equal parts, and each part is ${fr(a, b)}. So ${b}x = ${a} means <b>x = ${fr(a, b)}</b>.` +
        `<br><span class="dimline">The fraction bar means divide: ${fr(a, b)} is the same as ${a} ÷ ${b}. Dividing doesn’t have to come out even.</span>`,
    );
  };
  steppers(el, values, { a: [1, 12], b: [2, 6] }, draw);
  draw();
}

/* stories: what happens, what the letter stands for (always a number), the equation, and its solution and check */
const STORIES = [
  {
    id: "markers",
    label: "Markers",
    story: "4 packs of markers hold 36 markers in all. Every pack holds the same number.",
    letter: "n is the number of markers in one pack.",
    equation: "4n = 36",
    solve: "n = 36 ÷ 4 = 9",
    check: "4 · 9 = 36 ✓",
    answer: "9 markers in each pack",
  },
  {
    id: "bus",
    label: "Bus",
    story: "12 more people got on a bus. Then there were 31 people on it.",
    letter: "p is the number of people on the bus before.",
    equation: "p + 12 = 31",
    solve: "p = 31 − 12 = 19",
    check: "19 + 12 = 31 ✓",
    answer: "19 people on the bus before",
  },
  {
    id: "tickets",
    label: "Tickets",
    story: "Priya paid $13.50 for 3 movie tickets that each cost the same.",
    letter: "t is the cost of one ticket, in dollars.",
    equation: "3t = 13.50",
    solve: "t = 13.50 ÷ 3 = 4.50",
    check: "3 · 4.50 = 13.50 ✓",
    answer: "$4.50 for each ticket",
  },
];
/* Pick a story: what its letter stands for, then the equation, its solution, and the check. */
function wStories(el) {
  const q = Q(el);
  let storyId = "markers",
    shown = false;
  el.innerHTML =
    seg(
      "Story",
      STORIES.map((s) => [s.id, s.label]),
    ) +
    `<p class="readout" data-s></p><div class="wrow"><button type="button" class="ghost-btn" data-go></button></div>` +
    `<ul class="work-lines" data-e></ul><p class="readout" data-r></p>`;
  const draw = () => {
    const story = STORIES.find((s) => s.id === storyId);
    press(el, storyId);
    q("s").innerHTML = withVars(`${story.story}<br>Let <b>${story.letter}</b>`);
    q("go").textContent = shown ? "Hide the equation" : "Write and solve";
    q("e").innerHTML = shown
      ? [
          `<li>${withVars(story.equation)}<span class="why">the equation</span></li>`,
          `<li>${withVars(story.solve)}</li>`,
          `<li><span class="why">check: ${story.check}</span></li>`,
        ].join("")
      : "";
    q("r").innerHTML = shown
      ? `<b>${story.answer}</b>.<br><span class="dimline">The letter is a number, so the equation is about amounts that are equal.</span>`
      : `<span class="dimline">The letter stands for a number (how many, or how much), not for a thing: not “n is markers,” but “n is the number of markers in one pack.”</span>`;
  };
  onPick(el, (id) => {
    storyId = id;
    shown = false;
    draw();
  });
  q("go").addEventListener("click", () => {
    shown = !shown;
    draw();
  });
  draw();
}

const STEPS = [
  {
    title: "Hangers",
    widget: wTakeOff,
    body: withVars(
      "<p>A <b>hanger diagram</b> balances when both sides weigh the same, just like the two sides of an equation are equal. This hanger shows x + 3 = 7: a circle that weighs x and 3 unit squares balance 7 unit squares.</p><p>Take squares off. What keeps it balanced?</p>",
    ),
    check: {
      kind: "mc",
      q: `This hanger is balanced. Which move keeps it balanced and leaves ${mathVar("x")} alone?`,
      fig: hanger(
        ["x", 1, 1, 1, 1, 1],
        range(9).map(() => 1),
      ),
      choices: [
        { id: "a", label: "Take 5 off each side" },
        { id: "b", label: "Take 5 off the left side" },
        { id: "c", label: "Take 9 off each side" },
      ],
      answer: "a",
      why: {
        b: "Taking weight off only one side makes it lighter, so the hanger tips: x and 9 aren’t equal.",
        c: "The left side has only 5 squares next to x, so 9 can’t come off it. Take off what’s next to x: 5 from each side.",
      },
      explain: "Take 5 off each side: x = 9 − 5 = 4. Check: 4 + 5 = 9 ✓",
    },
  },
  {
    title: "Equal groups on each side",
    widget: wGroups,
    body: withVars(
      "<p>When a side has several circles that each weigh x, you can’t take one off without knowing what it weighs. But you can split each side into the same number of equal groups. One group of each side still balances.</p><p>Divide each side.</p>",
    ),
    check: {
      kind: "num",
      q: "A balanced hanger has 5 circles on one side and 30 unit squares on the other. How much does one circle weigh?",
      answer: 6,
      misc: [
        [150, "That multiplies 5 by 30. The 30 squares are shared equally among 5 circles: divide each side by 5."],
        [25, "That takes 5 away. But the left side is 5 groups of x, not x + 5. Divide each side by 5."],
      ],
      explain: "5x = 30. Divide each side by 5: x = 6. Check: 5 · 6 = 30 ✓",
    },
  },
  {
    title: "Same move, any numbers",
    widget: wMoves,
    body: withVars(
      "<p>Equations like these can be solved with one move, done to each side: <b>subtract</b> to undo adding, and <b>divide</b> to undo multiplying. It works for fractions and decimals the same way.</p><p>Pick an equation, then pick a move.</p>",
    ),
    check: {
      kind: "num",
      q: `Solve: 5${mathVar("x")} = 8.5`,
      answer: 1.7,
      misc: [
        [3.5, "That subtracts 5. 5x means 5 times x, so divide each side by 5."],
        [42.5, "That multiplies by 5. To undo times 5, divide each side by 5."],
      ],
      explain: "Divide each side by 5: x = 8.5 ÷ 5 = 1.7. Check: 5 · 1.7 = 8.5 ✓",
    },
  },
  {
    title: "a/b means a ÷ b",
    widget: wFractionBar,
    body: withVars(
      `<p>Some equations don’t come out to a whole number. 3x = 7 means 3 equal pieces make 7, so each piece is 7 ÷ 3, which we can write as the fraction ${fr(7, 3)}.</p><p>Change the number of pieces and the total.</p>`,
    ),
    check: {
      kind: "num",
      frac: true,
      q: `Solve: 8${mathVar("x")} = 3`,
      answer: 0.375,
      misc: [
        [2.67, "That’s 8 ÷ 3, the other way around. 8x = 3 means 8 equal parts make 3, so x = 3 ÷ 8."],
        [24, "That multiplies 3 by 8. To undo times 8, divide: x = 3 ÷ 8."],
        [5, "That subtracts. 8x means 8 times x, so divide each side by 8."],
      ],
      explain: "x = 3 ÷ 8 = 3/8. Check: 8 · 3/8 = 24/8 = 3 ✓",
    },
  },
  {
    title: "Stories to equations",
    widget: wStories,
    body: withVars(
      "<p>To write an equation for a story, first say what the letter stands for, as a number: how many, or how much. Then write what the story says is equal.</p><p>Pick a story.</p>",
    ),
    check: {
      kind: "mc",
      q: `6 packs of pens hold 42 pens in all, the same number in each. Let ${mathVar("m")} be the number of pens in one pack. Which equation fits?`,
      choices: [
        { id: "a", label: withVars("6m = 42") },
        { id: "b", label: withVars("m + 6 = 42") },
        { id: "c", label: withVars("42 · 6 = m") },
        { id: "d", label: withVars("6p = 42m") },
      ],
      answer: "a",
      why: {
        b: "That says one pack and 6 more pens make 42. There are 6 packs, each with m pens: 6 groups of m.",
        c: "42 is all the pens: it’s the total, not something to multiply. 6 groups of m make 42.",
        d: "That uses letters as labels (p for packs, m for pens). A letter stands for a number: m is how many pens are in one pack.",
      },
      explain: "6 packs with m pens each make 42 pens: 6m = 42, so m = 7. Check: 6 · 7 = 42 ✓",
    },
  },
];
