/* Learn Adding and Subtracting within 1,000 (Grade 2 Unit 7), chapter 5: Subtract three-digit numbers. Its widgets and steps; loaded by subtract.html. */
/* Subtract with blocks, breaking a ten. */
const wBreakTen = subW(
  [
    [352, 128],
    [574, 249],
    [690, 315],
  ],
  "t",
);
/* Subtract with blocks, breaking a hundred. */
const wBreakHundred = subW(
  [
    [527, 253],
    [416, 182],
    [635, 271],
  ],
  "h",
);
/* problems to think about before subtracting: a − b, the place to light up (hi, −1 for none), and what to notice */
const THINK = [
  {
    a: 645,
    b: 328,
    hi: 2,
    say: "Ones: 5 is less than 8, so <b>break a ten</b>. After that there are 3 tens, and that’s enough to take away 2 tens.",
  },
  {
    a: 645,
    b: 382,
    hi: 1,
    say: "Ones: 5 is enough to take away 2. Tens: 4 is less than 8, so <b>break a hundred</b>.",
  },
  {
    a: 645,
    b: 321,
    hi: -1,
    say: "5 ones is enough for 1 one. 4 tens is enough for 2 tens. 6 hundreds is enough for 3 hundreds. <b>Nothing to break!</b>",
  },
  {
    a: 503,
    b: 498,
    hi: -1,
    say: "503 and 498 are very close. <b>Count on</b> instead: 498 + 2 = 500, and 3 more is 503. 2 + 3 = 5.",
  },
];
/* Look before subtracting: will it need a broken ten or hundred, or are the numbers close? A button shows what to notice. */
function wThink(el) {
  const q = Q(el);
  let problemIndex = 0,
    shown = false;
  el.innerHTML =
    seg(
      "Problem",
      THINK.map(({ a, b }, i) => [i, `${a} − ${b}`]),
    ) +
    `<div data-c></div><div class="wrow"><button type="button" class="btn" data-go>Show me</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { a, b, hi, say } = THINK[problemIndex];
    press(el, problemIndex);
    q("c").innerHTML = pvChart(
      [
        ["", a],
        ["−", b],
      ],
      shown ? hi : -1,
    );
    q("go").hidden = shown;
    q("r").innerHTML = shown
      ? `${say}<br><span class="ok"><b>${a} − ${b} = ${a - b}</b></span>`
      : "Look at each place. Will you need to break a ten? A hundred? Or are the numbers close?";
  };
  el.addEventListener("click", (e) => {
    const problemBtn = e.target.closest("[data-m]");
    if (problemBtn) {
      problemIndex = +problemBtn.dataset.m;
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
/* Subtract with blocks, breaking a ten and a hundred. */
const wBreakBoth = subW(
  [
    [432, 158],
    [523, 268],
    [400, 125],
  ],
  "th",
);
/* the quick checks' figures */
const F = {
  kids: mat([bl(463)], "463 in base-ten blocks"),
  balloons: mat([bl(436)], "436 in base-ten blocks"),
  pv423: pvChart([
    ["", 423],
    ["−", 167],
  ]),
};
const STEPS = [
  {
    title: "Break a ten",
    widget: wBreakTen,
    body: "<p>If there aren’t enough ones to take away, <b>break a ten</b> into 10 ones.</p><p>Pick a problem. Break a ten when you need to, then take away.</p>",
    check: {
      kind: "num",
      unit: "students",
      answer: 225,
      fig: F.kids,
      q: "A school has 463 students. 238 students ride the bus. How many students don’t ride the bus?",
      misc: [
        [
          235,
          "463 has only 3 ones, so you can’t flip them to do 8 − 3. Break a ten: 13 − 8 = 5 ones, and 5 − 3 = 2 tens.",
        ],
        [701, "You added. Some students ride the bus, so the rest are fewer than 463."],
      ],
      explain:
        "Break a ten: 463 is 4 hundreds, 5 tens, and 13 ones. Ones: 13 − 8 = 5. Tens: 5 − 3 = 2. Hundreds: 4 − 2 = 2. 463 − 238 = 225 students.",
    },
  },
  {
    title: "Break a hundred",
    widget: wBreakHundred,
    body: "<p>If there aren’t enough tens to take away, <b>break a hundred</b> into 10 tens.</p><p>Pick a problem. Break a hundred when you need to, then take away.</p>",
    check: {
      kind: "num",
      unit: "balloons",
      answer: 264,
      fig: F.balloons,
      q: "A party store had 436 balloons. It sold 172 balloons. How many balloons are left?",
      misc: [
        [344, "436 has only 3 tens, so you can’t flip them to do 7 − 3. Break a hundred: 13 − 7 = 6 tens."],
        [364, "You broke a hundred, so there are only 3 hundreds left. 3 − 1 = 2 hundreds."],
        [608, "You added. The store sold balloons, so there are fewer now."],
      ],
      explain:
        "Break a hundred: 436 is 3 hundreds, 13 tens, and 6 ones. Ones: 6 − 2 = 4. Tens: 13 − 7 = 6. Hundreds: 3 − 1 = 2. 436 − 172 = 264 balloons.",
    },
  },
  {
    title: "Think before you subtract",
    widget: wThink,
    body: "<p>Before you subtract, look at each place. Are there enough ones? Enough tens? If the numbers are close, you can count on.</p><p>Pick a problem. Think, then tap Show me.</p>",
    check: {
      kind: "mc",
      q: "Which one needs you to <b>break a hundred</b>?",
      choices: [
        { id: "a", label: "734 − 291" },
        { id: "b", label: "734 − 218" },
        { id: "c", label: "734 − 212" },
      ],
      answer: "a",
      why: {
        b: "734 has 4 ones, and 218 has 8 ones. That needs a ten broken, not a hundred.",
        c: "734 has enough ones, tens, and hundreds to take away 212. Nothing to break.",
      },
      explain: "734 has 3 tens, and 291 has 9 tens. Break a hundred into 10 tens: 13 tens. 734 − 291 = 443.",
    },
  },
  {
    title: "Break a ten and a hundred",
    widget: wBreakBoth,
    body: "<p>Some problems need you to break a <b>ten</b> and a <b>hundred</b>. Check the ones first, then the tens.</p><p>Pick a problem. In 400 − 125 there are no tens to break, so break a hundred first!</p>",
    check: {
      kind: "mc",
      q: "What do you need to break to find <b>423 − 167</b>?",
      fig: F.pv423,
      choices: [
        { id: "a", label: "A ten and a hundred" },
        { id: "b", label: "Just a ten" },
        { id: "c", label: "Nothing" },
      ],
      answer: "a",
      why: {
        b: "After you break a ten, 423 has only 1 ten left. 167 has 6 tens, so break a hundred too.",
        c: "423 has 3 ones, and 167 has 7 ones. There aren’t enough ones.",
      },
      explain:
        "3 ones is less than 7, so break a ten: 1 ten and 13 ones. 1 ten is less than 6, so break a hundred: 11 tens. 423 − 167 = 256.",
    },
  },
];
