/* Learn Adding and Subtracting within 100 (Grade 2 Unit 2), chapter 1: Add and subtract to compare. Its widgets and steps; loaded by compare.html. */
const BEADS = [
  [47, 25],
  [38, 16],
  [56, 34],
];
/* How many more? Tapes for both, and a button that takes the smaller number away from the bigger one's blocks. */
function wCompare(el) {
  const q = Q(el);
  let pairIndex = 0,
    shown = false;
  el.innerHTML =
    seg(
      "Numbers",
      BEADS.map(([a, b], i) => [i, `Jada ${a}, Han ${b}`]),
    ) +
    `<div class="fig" data-t></div><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b] = BEADS[pairIndex],
      diff = a - b;
    press(el, pairIndex);
    q("t").innerHTML = tapes(
      [
        { label: "Jada", n: a, show: a },
        { label: "Han", n: b, show: b },
      ],
      { diff: shown ? diff : "?" },
    );
    q("f").innerHTML = bpic(
      [{ n: a, opt: shown ? { outT: tensOf(b), outO: b % 10 } : {} }],
      shown ? `Jada’s ${a} beads with ${b} crossed out` : `Jada’s ${a} beads`,
    );
    q("go").textContent = shown ? "Start over" : `Take away Han’s ${b}`;
    q("r").innerHTML = shown
      ? `Tens: <b>${tensOf(a)} − ${tensOf(b)} = ${tensOf(diff)}</b> tens. Ones: <b>${a % 10} − ${b % 10} = ${diff % 10}</b>.<br><span class="ok"><b>${a} − ${b} = ${diff}</b>. Jada has ${diff} more beads than Han.</span>`
      : `Jada has ${a} beads. Han has ${b}. How many more beads does Jada have?<br><span class="dimline">Take Han’s amount away from Jada’s. What’s left is the difference.</span>`;
  };
  el.addEventListener("click", (e) => {
    const pairBtn = e.target.closest("[data-m]");
    if (pairBtn) {
      pairIndex = +pairBtn.dataset.m;
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
/* [start, total] for start + ? = total */
const ONS = [
  [34, 58],
  [27, 49],
  [45, 78],
];
/* Count on to find the missing number: buttons add tens and ones in blue until the total is reached. */
function wCountOn(el) {
  /* tensAdded and onesAdded: the blue blocks added so far */
  const q = Q(el);
  let problemIndex = 0,
    tensAdded = 0,
    onesAdded = 0;
  el.innerHTML =
    seg(
      "Numbers",
      ONS.map(([a, c], i) => [i, `${a} + ? = ${c}`]),
    ) +
    `<p class="eq" data-e></p><div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-bt>+ 1 ten</button><button type="button" class="ghost-btn" data-bu>+ 1 one</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [start, total] = ONS[problemIndex],
      added = 10 * tensAdded + onesAdded,
      now = start + added;
    press(el, problemIndex);
    q("e").innerHTML = `${start} + <b class="q">?</b> = ${total}`;
    q("f").innerHTML = bpic(
      [start, "+", { t: tensAdded, u: onesAdded, cls: "b" }],
      `${start} in yellow blocks and ${added} added in blue`,
    );
    q("r").innerHTML =
      now === total
        ? `<span class="ok"><b>${start} + ${added} = ${total}</b>. You added ${tensAdded} tens and ${onesAdded} ones: the missing number is ${added}.</span>`
        : now > total
          ? `<b>${start} + ${added} = ${now}</b><br><span class="dimline">That’s more than ${total}. Start over and add fewer.</span>`
          : `<b>${start} + ${added} = ${now}</b><br><span class="dimline">${total - now >= 10 ? `Add tens first. You need to get to ${total}.` : `Close! Now add ones to get to ${total}.`}</span>`;
  };
  q("bt").onclick = () => {
    tensAdded++;
    draw();
  };
  q("bu").onclick = () => {
    onesAdded++;
    draw();
  };
  q("clr").onclick = () => {
    tensAdded = onesAdded = 0;
    draw();
  };
  el.addEventListener("click", (e) => {
    const problemBtn = e.target.closest("[data-m]");
    if (problemBtn) {
      problemIndex = +problemBtn.dataset.m;
      tensAdded = onesAdded = 0;
      draw();
    }
  });
  draw();
}
/* stories with a tape each: its parts [length, what to write], the total to write, the equation, and the answer */
const STORIES = [
  {
    label: "Get more",
    story: "Diego has 35 cards. Diego gets 21 more cards. How many cards does Diego have now?",
    parts: [
      [35, "35"],
      [21, "21"],
    ],
    total: "?",
    eq: "35 + 21 = ?",
    ans: "Diego gets more, so add: 35 + 21 = 56 cards.",
  },
  {
    label: "Take away",
    story: "Priya has 58 beads. Priya uses 25 beads on a necklace. How many beads are left?",
    parts: [
      [25, "25"],
      [33, "?"],
    ],
    total: "58",
    eq: "58 − 25 = ?",
    ans: "Priya uses some up, so subtract: 58 − 25 = 33 beads.",
  },
  {
    label: "How many were added?",
    story: "Kiran has 24 stamps. Kiran gets some more. Now Kiran has 45 stamps. How many stamps did Kiran get?",
    parts: [
      [24, "24"],
      [21, "?"],
    ],
    total: "45",
    eq: "24 + ? = 45, or 45 − 24 = ?",
    ans: "Count on from 24 to 45, or subtract: 45 − 24 = 21 stamps.",
  },
];
/* Pick a kind of story to see its tape; a button shows the equation and answer. */
function wStory(el) {
  const q = Q(el);
  let storyIndex = 0,
    shown = false;
  el.innerHTML =
    seg(
      "Kind of story",
      STORIES.map((story, i) => [i, story.label]),
    ) +
    `<p class="story" data-s></p><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Show the equation</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const story = STORIES[storyIndex];
    press(el, storyIndex);
    q("s").textContent = story.story;
    q("f").innerHTML = partWhole(
      story.parts.map(([n, show]) => ({ n, show })),
      story.total,
    );
    q("go").hidden = shown;
    q("r").innerHTML = shown
      ? `<b>${story.eq}</b><br><span class="ok">${story.ans}</span>`
      : "Where is the <b>?</b> in the tape? Is it the whole or a part?";
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
    shown = true;
    draw();
  };
  draw();
}
/* the quick checks' figures */
const F = {
  lin: tapes(
    [
      { label: "Lin", n: 68, show: 68 },
      { label: "Noah", n: 35, show: 35 },
    ],
    { diff: "?" },
  ),
  on26: bpic([26, "+", "?"], "26 in blocks, plus how many?"),
  elena: partWhole(
    [
      { n: 30, show: "30" },
      { n: 32, show: "?" },
    ],
    "62",
    "62 blocks: 30 put away and some left out",
  ),
};
const STEPS = [
  {
    title: "How many more?",
    widget: wCompare,
    body: "<p>To find how many more, you can <b>subtract</b>. Take the smaller amount away from the bigger one. What’s left is the difference.</p><p>Pick numbers, then take Han’s beads away from Jada’s.</p>",
    check: {
      kind: "num",
      unit: "stickers",
      answer: 33,
      fig: F.lin,
      q: "Lin has 68 stickers. Noah has 35 stickers. How many more stickers does Lin have than Noah?",
      misc: [
        [103, "You added. “How many more” asks for the difference, so subtract."],
        [68, "That’s how many Lin has. How many more than Noah?"],
        [35, "That’s how many Noah has. How many more does Lin have?"],
      ],
      explain: "68 − 35 = 33. Tens: 6 − 3 = 3 tens. Ones: 8 − 5 = 3. Lin has 33 more stickers.",
    },
  },
  {
    title: "Find the missing number",
    widget: wCountOn,
    body: "<p><b>34 + ? = 58</b> asks: what do you add to 34 to make 58? Count on by tens, then by ones.</p><p>Add tens and ones until you reach the total.</p>",
    check: {
      kind: "num",
      answer: 23,
      fig: F.on26,
      q: "What number makes this true? <b>26 + ? = 49</b>",
      misc: [
        [75, "That’s 26 + 49. Find the number you add to 26 to make 49."],
        [49, "49 is the total. What do you add to 26 to get to 49?"],
      ],
      explain: "Count on from 26: 2 tens gets to 46, and 3 ones gets to 49. 20 + 3 = 23, so 26 + 23 = 49.",
    },
  },
  {
    title: "Add or subtract?",
    widget: wStory,
    body: "<p>A tape diagram shows a story. The whole tape is the <b>total</b>. The pieces are the <b>parts</b>. If the total is missing, add. If a part is missing, subtract or count on.</p><p>Tap each kind of story.</p>",
    check: {
      kind: "mc",
      stack: true,
      q: "Elena has 62 blocks. Elena puts 30 blocks away. How many blocks are still out?",
      fig: F.elena,
      choices: [
        { id: "a", label: "62 − 30 = ?" },
        { id: "b", label: "62 + 30 = ?" },
        { id: "c", label: "? − 62 = 30" },
      ],
      answer: "a",
      why: {
        b: "Elena puts blocks away, so there are fewer out. Subtract.",
        c: "62 is how many blocks Elena starts with, so the equation starts with 62.",
      },
      explain: "62 − 30 = 32. 32 blocks are still out.",
    },
  },
];
