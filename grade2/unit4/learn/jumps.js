/* Learn Addition and Subtraction on the Number Line (Grade 2 Unit 4), chapter 3: Jumps on the number line. Its widgets and steps; loaded by jumps.html. */
/* Jump right to add or left to subtract: steppers set the start and the size of the jump. */
function wJump(el) {
  /* the steppers' values: s, the start; n, the jump; direction: 1 right, −1 left */
  const q = Q(el),
    values = { s: 26, n: 5 };
  let direction = 1;
  el.innerHTML =
    seg("Way", [
      [1, "Add: jump right"],
      [-1, "Subtract: jump left"],
    ]) +
    `<div class="fig" data-f></div><div class="wrow">${stepper("s", "Start")}${stepper("n", "Jump")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const { s: start, n: jump } = values,
      end = start + direction * jump;
    press(el, direction);
    q("s").textContent = start;
    q("n").textContent = jump;
    q("f").innerHTML = line(15, 40, {
      u: 22,
      lab: (v) => v % 10 === 0,
      hops: [{ a: start, b: end, t: sgn(direction * jump) }],
      pts: [
        { v: start, t: start },
        { v: end, cls: "b", t: end },
      ],
      label: `A number line: start at ${start} and jump ${direction > 0 ? "right" : "left"} ${jump} to ${end}`,
    });
    q("r").innerHTML =
      `Start at <b>${start}</b>. Jump <b>${jump}</b> to the ${direction > 0 ? "right" : "left"}. You land on <b>${end}</b>.<br><span class="ok"><b>${start} ${direction > 0 ? "+" : "−"} ${jump} = ${end}</b></span>`;
  };
  steppers(el, values, { s: [25, 30], n: [1, 9] }, draw);
  el.addEventListener("click", (e) => {
    const wayBtn = e.target.closest("[data-m]");
    if (wayBtn) {
      direction = +wayBtn.dataset.m;
      draw();
    }
  });
  draw();
}
/* the equations, and the pictures to match to them: a jump of n from a, the right equation (ok), and why each other one is wrong */
const EQS = ["18 + 7 = 25", "25 − 7 = 18", "18 + 5 = 23"],
  EQPICS = [
    {
      a: 18,
      n: 7,
      ok: 0,
      why: {
        1: "The jump goes right, so it’s adding, not subtracting.",
        2: "Count the jump: from 18 to 25 is 7, not 5.",
      },
    },
    {
      a: 25,
      n: -7,
      ok: 1,
      why: {
        0: "The jump goes left, so it’s subtracting. It starts at 25.",
        2: "The jump starts at 25 and goes left.",
      },
    },
    {
      a: 18,
      n: 5,
      ok: 2,
      why: { 0: "The jump ends at 23, not 25. Count the jump: it’s 5.", 1: "The jump goes right, so it’s adding." },
    },
  ];
/* Match each jump picture to its equation. */
function wEquation(el) {
  /* eqIndex: the equation tapped (null before one is) */
  const q = Q(el);
  let picIndex = 0,
    eqIndex = null;
  el.innerHTML =
    seg(
      "Picture",
      EQPICS.map((_, i) => [i, `Picture ${i + 1}`]),
    ) + `<div class="fig" data-f></div><div class="chips" data-c></div><p class="readout" data-r></p>`;
  const draw = () => {
    const pic = EQPICS[picIndex],
      end = pic.a + pic.n;
    press(el, picIndex);
    q("f").innerHTML = line(15, 30, {
      u: 28,
      lab: (v) => v % 5 === 0 || v === pic.a || v === end,
      hops: [{ a: pic.a, b: end, t: Math.abs(pic.n) }],
      pts: [{ v: pic.a }, { v: end, cls: "b" }],
      label: `A jump from ${pic.a} to ${end}`,
    });
    q("c").innerHTML = EQS.map(
      (eq, i) => `<button type="button" class="chip" data-e="${i}" aria-pressed="${i === eqIndex}">${eq}</button>`,
    ).join("");
    q("r").innerHTML =
      eqIndex === null
        ? "Which equation matches the jump? Where does it start? Which way does it go?"
        : eqIndex === pic.ok
          ? `<span class="ok">Yes! Start at ${pic.a}, jump ${Math.abs(pic.n)} ${pic.n > 0 ? "right" : "left"}, land on ${end}: <b>${EQS[pic.ok]}</b>.</span>`
          : `<span class="no">Not that one.</span> ${pic.why[eqIndex]}`;
  };
  el.addEventListener("click", (e) => {
    const picBtn = e.target.closest("[data-m]");
    if (picBtn) {
      picIndex = +picBtn.dataset.m;
      eqIndex = null;
      draw();
      return;
    }
    const eqBtn = e.target.closest("[data-e]");
    if (eqBtn) {
      eqIndex = +eqBtn.dataset.e;
      draw();
    }
  });
  draw();
}
const DIFFS = [
  [27, 33],
  [45, 52],
  [38, 61],
];
/* The difference between two numbers: jump from the smaller to the next ten, then to the bigger one. */
function wDiff(el) {
  const q = Q(el);
  let pairIndex = 0,
    shown = false;
  el.innerHTML =
    seg(
      "Numbers",
      DIFFS.map(([a, b], i) => [i, `${a} and ${b}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* nextTen: the ten after a; steps: a to the ten, and the ten to b */
    const [a, b] = DIFFS[pairIndex],
      nextTen = Math.ceil(a / 10) * 10,
      [lo, hi] = around(a, b),
      steps = [nextTen - a, b - nextTen];
    press(el, pairIndex);
    q("f").innerHTML = line(lo, hi, {
      pts: [
        { v: a, t: a },
        { v: b, cls: "b", t: b },
      ],
      hops: shown ? hopsFrom(a, steps).map((hop, i) => ({ ...hop, t: steps[i] })) : [],
      lab: (v) => v % 10 === 0,
      label:
        `A number line with dots at ${a} and ${b}` +
        (shown ? `, jumps of ${steps[0]} and ${steps[1]} from ${a} to ${b}` : ""),
    });
    q("go").textContent = shown ? "Start over" : `Jump from ${a} to ${b}`;
    q("r").innerHTML = shown
      ? `${a} to ${nextTen} is <b>${steps[0]}</b>. ${nextTen} to ${b} is <b>${steps[1]}</b>. ${steps[0]} + ${steps[1]} = ${b - a}.<br><span class="ok">The difference is <b>${b - a}</b>: ${a} + ${b - a} = ${b}, and ${b} − ${a} = ${b - a}.</span>`
      : `The <b>difference</b> between ${a} and ${b} is how far apart they are.<br><span class="dimline">Jump from the smaller number to the bigger one. Stop at a ten on the way.</span>`;
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
/* the quick checks' figures */
const F = {
  back6: line(40, 50, {
    u: 34,
    hops: [{ a: 47, b: 41, t: "−6" }],
    pts: [
      { v: 47, t: 47 },
      { v: 41, cls: "b", t: "?" },
    ],
    label: "A number line: start at 47 and jump 6 to the left",
  }),
  eq52: line(40, 55, {
    u: 28,
    lab: (v) => v % 5 === 0 || v === 44 || v === 52,
    hops: [{ a: 52, b: 44, t: 8 }],
    pts: [{ v: 52 }, { v: 44, cls: "b" }],
    label: "A jump of 8 from 52 to 44",
  }),
  diff: line(40, 60, {
    lab: (v) => v % 10 === 0,
    pts: [
      { v: 46, t: 46 },
      { v: 53, cls: "b", t: 53 },
    ],
    label: "A number line with dots at 46 and 53",
  }),
};
const STEPS = [
  {
    title: "Jump to add and subtract",
    widget: wJump,
    body: "<p>To <b>add</b>, start at the first number and jump <b>right</b>. To <b>subtract</b>, jump <b>left</b>.</p><p>Change the start and the jump. Try both ways.</p>",
    check: {
      kind: "num",
      answer: 41,
      fig: F.back6,
      q: "Start at 47. Jump 6 to the left. Where do you land?",
      misc: [
        [53, "Left means subtract. You jumped right."],
        [42, "Count the spaces, not the start: 46, 45, 44, 43, 42, 41."],
      ],
      explain: "Jumping left subtracts. 47 − 6 = 41.",
    },
  },
  {
    title: "Equations and jumps",
    widget: wEquation,
    body: "<p>An <b>equation</b> tells the story of a jump: where it starts, how far it goes, and where it lands.</p><p>Pick a picture. Tap the equation that matches.</p>",
    check: {
      kind: "mc",
      q: "Which equation matches the jump?",
      fig: F.eq52,
      choices: [
        { id: "a", label: "52 − 8 = 44" },
        { id: "b", label: "52 + 8 = 60" },
        { id: "c", label: "44 − 8 = 36" },
      ],
      answer: "a",
      why: { b: "The jump goes left, so it’s subtracting.", c: "The jump starts at 52, not 44." },
      explain: "The jump starts at 52, goes 8 to the left, and lands on 44: 52 − 8 = 44.",
    },
  },
  {
    title: "The difference",
    widget: wDiff,
    body: "<p>The <b>difference</b> between two numbers is the length between them. Jump from one to the other and add up the jumps.</p><p>Pick two numbers, then jump.</p>",
    check: {
      kind: "num",
      answer: 7,
      fig: F.diff,
      q: "What is the difference between 46 and 53?",
      misc: [
        [99, "You added. The difference is the space between them."],
        [4, "46 to 50 is 4. Keep going to 53."],
        [3, "50 to 53 is 3. Don’t forget 46 to 50."],
        [13, "53 has only 3 ones. Jump 46 to 50 (4), then 50 to 53 (3)."],
      ],
      explain: "46 to 50 is 4. 50 to 53 is 3. 4 + 3 = 7, so the difference is 7.",
    },
  },
];
