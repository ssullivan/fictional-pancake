/* Learn Relating Multiplication to Division (Grade 3 Unit 4), chapter 2: Division expressions. Its widgets and steps; loaded
   by division-expressions.html. */
/* expressions to read two ways: [total, n] for total ÷ n */
const READINGS = [
  [12, 3],
  [20, 4],
  [18, 6],
];
/* See total ÷ n both ways: n equal groups (how many in each?), or groups of n (how many groups?). */
function wMeanings(el) {
  /* way: 'groups' for n equal groups, 'size' for groups of n */
  const q = Q(el);
  let readingIndex = 0,
    way = "groups";
  el.innerHTML = `<div data-top></div><div data-bot></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [total, n] = READINGS[readingIndex],
      quotient = total / n;
    q("top").innerHTML = seg(
      "Expression",
      READINGS.map(([t, d], i) => [i, `${t} ÷ ${d}`]),
    );
    q("bot").innerHTML = seg("Read it as", [
      ["groups", `${n} equal groups`],
      ["size", `Groups of ${n}`],
    ]);
    press(q("top"), readingIndex);
    press(q("bot"), way);
    q("f").innerHTML = way === "groups" ? dealFig(n, quotient, 0) : dealFig(quotient, n, 0);
    q("r").innerHTML =
      (way === "groups"
        ? `${total} shared into ${n} equal groups: each group has ${quotient}.`
        : `${total} in groups of ${n}: there are ${quotient} groups.`) +
      `<br><span class="ok">Either way, ${total} ÷ ${n} = <b>${quotient}</b>.</span>`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") readingIndex = +id;
    else way = id;
    draw();
  });
  draw();
}
/* stories to write a division expression for: the story, its two numbers (total first), and what the answer is */
const STORIES = [
  {
    story: "Lin has 24 stickers and puts 6 on each page. How many pages does Lin fill?",
    total: 24,
    n: 6,
    thing: "stickers",
    answer: "pages",
  },
  {
    story: "35 crayons are shared equally into 5 boxes. How many crayons go in each box?",
    total: 35,
    n: 5,
    thing: "crayons",
    answer: "crayons in each box",
  },
  {
    story: "A toy maker has 32 wheels. Each toy truck needs 8 wheels. How many trucks can the toy maker build?",
    total: 32,
    n: 8,
    thing: "wheels",
    answer: "trucks",
  },
];
/* Build the expression for a story: pick the number to start with, then the number to divide by. */
function wWrite(el) {
  /* first, second: the numbers picked so far (null until one is) */
  const q = Q(el);
  let storyIndex = 0,
    first = null,
    second = null;
  /* the story buttons are drawn once; the number buttons are drawn again for each story, so all three rows are told apart
     with segHit (a redrawn button is no longer inside its row) */
  el.innerHTML =
    `<div data-story>${seg(
      "Story",
      STORIES.map((s, i) => [i, `Story ${i + 1}`]),
    )}</div>` +
    `<p data-s></p><div data-top></div><div data-bot></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { story, total, n, thing, answer } = STORIES[storyIndex];
    press(q("story"), storyIndex);
    q("s").textContent = story;
    q("top").innerHTML = seg("Start with", [
      [total, `Start with ${total}`],
      [n, `Start with ${n}`],
    ]);
    q("bot").innerHTML = seg("Divide by", [
      [total, `÷ ${total}`],
      [n, `÷ ${n}`],
    ]);
    press(q("top"), first);
    press(q("bot"), second);
    q("e").textContent = `${first ?? "?"} ÷ ${second ?? "?"}`;
    q("r").innerHTML =
      first === null || second === null
        ? "Pick the number to start with and the number to divide by."
        : first === total && second === n
          ? `<span class="ok">${total} ÷ ${n} = <b>${total / n}</b> ${answer}. Start with all the ${thing}, then split them up.</span>`
          : first === second
            ? `<span class="no">${first} ÷ ${first} splits ${first} into groups of ${first}. Use both numbers from the story.</span>`
            : `<span class="no">Start with all the ${thing}: ${total}. Then divide by ${n}.</span>`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["story", "top", "bot"]) || [];
    if (!row) return;
    if (row === "story") {
      storyIndex = +id;
      first = second = null;
    } else if (row === "top") first = +id;
    else second = +id;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  towers: dealFig(4, 6, 0, { label: "4 towers with 6 blocks in each" }),
};
const STEPS = [
  {
    title: "Two ways to read ÷",
    widget: wMeanings,
    body: "<p>12 ÷ 3 can mean 12 shared into 3 equal groups: how many in each? Or it can mean 12 in groups of 3: how many groups? Both give the same answer, 4.</p><p>Pick an expression and a way to read it, and see the drawing.</p>",
    check: {
      kind: "mc",
      q: "Diego puts 24 blocks into towers of 6. Diego writes 24 ÷ 6 = 4. What does the 4 stand for?",
      fig: F.towers,
      choices: [
        { id: "a", label: "The number of towers" },
        { id: "b", label: "The blocks in each tower" },
        { id: "c", label: "All the blocks" },
      ],
      answer: "a",
      why: {
        b: "Each tower has 6 blocks. The 4 is how many towers they make.",
        c: "All the blocks is 24, the number you start with.",
      },
      explain: "24 blocks in towers of 6 make 4 towers: 4 × 6 = 24.",
    },
  },
  {
    title: "Write a division expression",
    widget: wWrite,
    body: "<p>A division expression starts with the total, all the things there are. Then it divides by the number in each group, or by the number of groups.</p><p>Pick a story. Then pick the number to start with and the number to divide by.</p>",
    check: {
      kind: "mc",
      q: "Jada has 30 stickers. Jada puts 5 stickers on each page. Which expression shows how many pages Jada fills?",
      choices: [
        { id: "a", label: "30 ÷ 5" },
        { id: "b", label: "5 ÷ 30" },
        { id: "c", label: "30 − 5" },
      ],
      answer: "a",
      why: {
        b: "Start with all the stickers, 30, and split them into groups of 5.",
        c: "That takes away 5 once. Split all 30 into groups of 5: divide.",
      },
      explain: "30 stickers in groups of 5: 30 ÷ 5 = 6 pages.",
    },
  },
];
