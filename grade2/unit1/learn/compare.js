/* Learn Adding, Subtracting, and Working with Data (Grade 2 Unit 1), chapter 5: Compare. Its widgets and steps; loaded by compare.html. */
/* How many more? Steppers set the dogs and cats; a button shows the difference on the bar graph. */
function wMore(el) {
  /* the steppers' values: a dogs, b cats; show: the difference is shown */
  const q = Q(el),
    values = { a: 9, b: 5 };
  let show = false;
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow">${stepper("a", "Dogs")}${stepper("b", "Cats")}</div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { a, b } = values,
      rows = [
        { label: "Dogs", n: a, c: "yellow" },
        { label: "Cats", n: b, c: "blue" },
      ];
    q("a").textContent = a;
    q("b").textContent = b;
    /* diffBars: [taller, shorter] bar, or null when they're the same */
    const diffBars = a === b ? null : a > b ? [1, 0] : [0, 1],
      more = Math.max(a, b),
      fewer = Math.min(a, b),
      moreName = a > b ? "dogs" : "cats",
      fewerName = a > b ? "cats" : "dogs";
    q("f").innerHTML = barGraph(rows, { diff: diffBars, showDiff: show, title: "Dogs and cats at the pet shelter" });
    q("go").textContent = show ? "Hide the difference" : "Show how many more";
    q("go").hidden = !diffBars;
    q("r").innerHTML = !diffBars
      ? `<b>${a} dogs and ${b} cats</b>: the same number, so neither has more.`
      : show
        ? `<span class="ok"><b>${more} − ${fewer} = ${more - fewer}</b>, or <b>${fewer} + ${more - fewer} = ${more}</b>.</span><br>There ${more - fewer === 1 ? "is" : "are"} ${more - fewer} more ${more - fewer === 1 ? moreName.slice(0, -1) : moreName} than ${fewerName}.`
        : `How many more ${moreName} than ${fewerName}? Look at how much taller the ${moreName} bar is.`;
  };
  steppers(el, values, { a: [1, 10], b: [1, 10] }, draw);
  q("go").onclick = () => {
    show = !show;
    draw();
  };
  draw();
}
/* Two tapes of stickers (a stepper for each), with the difference dashed. */
function wTape(el) {
  const q = Q(el),
    values = { a: 12, b: 7 };
  el.innerHTML = `<div class="wrow">${stepper("a", "Priya")}${stepper("b", "Kiran")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { a, b } = values;
    q("a").textContent = a;
    q("b").textContent = b;
    q("f").innerHTML = tapes(
      [
        { label: "Priya", n: a, show: a },
        { label: "Kiran", n: b, show: b },
      ],
      { diff: a === b ? null : Math.abs(a - b) },
    );
    q("r").innerHTML =
      a === b
        ? `Priya and Kiran each have <b>${a}</b> stickers. The tapes are the same length.`
        : `The dashed piece is the difference: <b>${Math.max(a, b)} − ${Math.min(a, b)} = ${Math.abs(a - b)}</b>.<br>${a > b ? "Priya" : "Kiran"} has ${Math.abs(a - b)} more sticker${Math.abs(a - b) === 1 ? "" : "s"} than ${a > b ? "Kiran" : "Priya"}.`;
  };
  steppers(el, values, { a: [1, 20], b: [1, 20] }, draw);
  draw();
}
/* compare stories, one for each unknown: the story, its tapes [label, length, what to write], the difference to write, and the answer */
const KINDS = [
  {
    id: "diff",
    label: "How many more?",
    story: "Jada has 34 books. Han has 22 books. How many more books does Jada have than Han?",
    rows: [
      ["Jada", 34, "34"],
      ["Han", 22, "22"],
    ],
    diff: "?",
    ans: "34 − 22 = 12, or 22 + 12 = 34. Jada has 12 more books.",
  },
  {
    id: "big",
    label: "Bigger one unknown",
    story: "Han has 22 books. Jada has 12 more books than Han. How many books does Jada have?",
    rows: [
      ["Jada", 34, "?"],
      ["Han", 22, "22"],
    ],
    diff: "12",
    ans: "Jada has more, so add: 22 + 12 = 34 books.",
  },
  {
    id: "small",
    label: "Smaller one unknown",
    story: "Jada has 34 books. Han has 12 fewer books than Jada. How many books does Han have?",
    rows: [
      ["Jada", 34, "34"],
      ["Han", 22, "?"],
    ],
    diff: "12",
    ans: "Han has fewer, so subtract: 34 − 12 = 22 books.",
  },
];
/* Pick a kind of compare story to see its tapes; a button shows the answer. */
function wKinds(el) {
  const q = Q(el);
  let kindIndex = 0,
    shown = false;
  el.innerHTML =
    seg(
      "Kind of problem",
      KINDS.map((kind, i) => [i, kind.label]),
    ) +
    `<p class="story" data-s></p><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Show the answer</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const kind = KINDS[kindIndex];
    press(el, kindIndex);
    q("s").textContent = kind.story;
    q("f").innerHTML = tapes(
      kind.rows.map(([label, n, show]) => ({ label, n, show })),
      { diff: kind.diff },
    );
    q("go").hidden = shown;
    q("r").innerHTML = shown
      ? `<span class="ok">${kind.ans}</span>`
      : "Where is the <b>?</b> in the tapes? That’s what the problem asks.";
  };
  el.addEventListener("click", (e) => {
    const kindBtn = e.target.closest("[data-m]");
    if (kindBtn) {
      kindIndex = +kindBtn.dataset.m;
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
/* this chapter's quick-check figures (common.js has the shared ones) */
Object.assign(F, {
  stickers: tapes(
    [
      { label: "Elena", n: 15, show: 15 },
      { label: "Noah", n: 9, show: "?" },
    ],
    { diff: "6" },
  ),
});
const STEPS = [
  {
    title: "How many more?",
    widget: wMore,
    body: "<p>To find how many more, compare two amounts. The difference is how much taller one bar is.</p><p>Change the numbers, then show how many more.</p>",
    check: {
      kind: "num",
      unit: "students",
      answer: 3,
      fig: F.snacks,
      q: "How many more students chose apples than crackers?",
      misc: [
        [9, "That’s apples and crackers together. “How many more” asks for the difference."],
        [6, "That’s how many chose apples. How much taller is the apple bar than the cracker bar?"],
      ],
      explain: "6 − 3 = 3, or 3 + 3 = 6. 3 more students chose apples.",
    },
  },
  {
    title: "Tape diagrams",
    widget: wTape,
    body: "<p>A <b>tape diagram</b> shows each amount as a tape. The longer tape is the bigger amount. The extra piece is the difference.</p><p>Change how many stickers each friend has.</p>",
    check: {
      kind: "num",
      unit: "stickers",
      answer: 9,
      fig: F.stickers,
      q: "Noah has 6 fewer stickers than Elena. Elena has 15 stickers. How many stickers does Noah have?",
      misc: [
        [21, "“Fewer” means Noah has less than Elena. Take 6 away from 15."],
        [6, "6 is how many fewer. How many does Noah have?"],
      ],
      explain: "15 − 6 = 9. Noah’s tape is 6 shorter than Elena’s.",
    },
  },
  {
    title: "Three kinds of compare problems",
    widget: wKinds,
    body: "<p>A compare problem can ask for the difference, the bigger amount, or the smaller amount. Draw the tapes, then find the <b>?</b></p><p>Tap each kind of problem.</p>",
    check: {
      kind: "num",
      unit: "pages",
      answer: 38,
      q: "Andre read 25 pages. Han read 13 more pages than Andre. How many pages did Han read?",
      misc: [[12, "Han read <b>more</b> than Andre, so Han’s number is bigger than 25. Add 13."]],
      explain: "Han read more, so add: 25 + 13 = 38. Tens: 20 + 10 = 30. Ones: 5 + 3 = 8.",
    },
  },
];
