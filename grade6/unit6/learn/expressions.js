/* Learn Expressions and Equations (Grade 6 Unit 6), chapter 3: Letters stand for numbers. Its widgets and steps; loaded by
   expressions.html. */
/* phrases in words, the expression each one means, how it's worked out for a value of n, and how to read it */
const PHRASES = [
  { id: "more", words: "5 more than n", expr: "n + 5", work: (n) => `${n} + 5`, how: "start at n and go up 5" },
  { id: "less", words: "5 less than n", expr: "n − 5", work: (n) => `${n} − 5`, how: "start at n and go down 5" },
  {
    id: "from",
    words: "n subtracted from 40",
    expr: "40 − n",
    work: (n) => `40 − ${n}`,
    how: "start at 40 and take n away",
  },
  { id: "times", words: "5 times n", expr: "5n", work: (n) => `5 · ${n}`, how: "5 groups of n" },
  { id: "div", words: "n divided by 5", expr: "n ÷ 5", work: (n) => `${n} ÷ 5`, how: "split n into 5 equal parts" },
];
/* a phrase's value for n: its work, worked out */
const phraseValue = (phrase, n) => ({ more: n + 5, less: n - 5, from: 40 - n, times: 5 * n, div: n / 5 })[phrase.id];
/* Pick a phrase and slide n: its expression, its value, and tapes comparing n with it. */
function wPhrases(el) {
  const q = Q(el);
  let phraseId = "more",
    n = 20;
  el.innerHTML =
    seg(
      "Phrase",
      PHRASES.map((p) => [p.id, withVars(p.words)]),
    ) +
    `<div class="wrow"><label class="slider">${mathVar("n")} <input type="range" min="5" max="30" step="5" value="20" data-s><b data-v></b></label></div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const phrase = PHRASES.find((p) => p.id === phraseId),
      value = phraseValue(phrase, n);
    press(el, phraseId);
    q("v").textContent = n;
    q("f").innerHTML = tapes([
      { label: "n", n: n, show: n },
      { label: phrase.expr, n: value, show: fmt(value) },
    ]);
    q("e").innerHTML = withVars(`${phrase.expr} = ${phrase.work(n)} = ${fmt(value)}`);
    q("r").innerHTML = withVars(
      `“${phrase.words}” means ${phrase.how}: <b>${phrase.expr}</b>. With n = ${n}, that’s ${fmt(value)}.` +
        `<br><span class="dimline">n is a number that can change. Slide it: the expression always does the same thing to it. In subtraction the order matters: n − 5 and 5 − n are different.</span>`,
    );
  };
  onPick(el, (id) => {
    phraseId = id;
    draw();
  });
  q("s").addEventListener("input", () => {
    n = +q("s").value;
    draw();
  });
  draw();
}

/* expressions to evaluate, each as written and as a function of x */
const COEF_EXPRS = [
  { expr: "3x", value: (x) => 3 * x, work: (x) => `3 · ${x}` },
  { expr: "x + 3", value: (x) => x + 3, work: (x) => `${x} + 3` },
  { expr: "6 + 3x", value: (x) => 6 + 3 * x, work: (x) => `6 + 3 · ${x}` },
  { expr: "x ÷ 2", value: (x) => x / 2, work: (x) => `${x} ÷ 2` },
];
/* A stepper for x: a table of expressions with x put in, and their values. */
function wCoefficient(el) {
  const q = Q(el),
    values = { x: 4 };
  el.innerHTML =
    `<div class="wrow">${stepper("x", "x")}</div>` + `<div class="tables" data-t></div><p class="readout" data-r></p>`;
  const draw = () => {
    const x = values.x;
    q("x").textContent = x;
    q("t").innerHTML = valueTable(
      ["expression", `with ${mathVar("x")} = ${x}`, "value"],
      COEF_EXPRS.map((e) => [withVars(e.expr), e.work(x), fmt(e.value(x))]),
      { label: `Expressions with x = ${x}` },
    );
    q("r").innerHTML = withVars(
      `3x means 3 · x, 3 times x. With x = ${x}, 3x is 3 · ${x} = <b>${3 * x}</b>${x < 10 ? `, not 3${x}` : ""}. The number in front of the letter is its <b>coefficient</b>.` +
        `<br><span class="dimline">3x, 3 · x, 3 × x, and (3)(x) all mean the same thing. A number written right next to a letter means multiply. In 6 + 3x, multiply first, then add.</span>`,
    );
  };
  steppers(el, values, { x: [0, 10] }, draw);
  draw();
}

/* percents of the tank that 30 liters can be: the tape has `boxes` boxes, `part` of them full */
const TANK_PCTS = [
  { pct: 10, boxes: 10, part: 1 },
  { pct: 20, boxes: 5, part: 1 },
  { pct: 25, boxes: 4, part: 1 },
  { pct: 40, boxes: 5, part: 2 },
  { pct: 50, boxes: 2, part: 1 },
  { pct: 60, boxes: 5, part: 3 },
  { pct: 75, boxes: 4, part: 3 },
];
/* 30 liters is some percent of a full tank of x liters: pick the percent to see the tape, the equation, and x. */
function wPercent(el) {
  const q = Q(el),
    amount = 30;
  let pct = 40,
    shown = false;
  el.innerHTML =
    seg(
      "Percent",
      TANK_PCTS.map((t) => [t.pct, `${t.pct}%`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-show></button></div>` +
    `<ul class="work-lines" data-e></ul><p class="readout" data-r></p>`;
  const draw = () => {
    const t = TANK_PCTS.find((row) => row.pct === pct),
      whole = (amount * t.boxes) / t.part,
      decimal = pct / 100;
    press(el, pct);
    q("show").textContent = shown ? "Hide the answer" : "Solve it";
    q("f").innerHTML = pctTape(t.boxes, t.part, { W: whole, part: amount, qW: !shown, each: whole / t.boxes })(shown);
    q("e").innerHTML = [
      `<li>${pct}% of ${mathVar("x")} is ${amount}</li>`,
      `<li>${fmt(decimal)}${mathVar("x")} = ${amount}<span class="why">${pct}% is ${fmt(decimal)}</span></li>`,
      ...(shown
        ? [
            `<li>${mathVar("x")} = ${amount} ÷ ${fmt(decimal)} = ${fmt(whole)}<span class="why">divide each side by ${fmt(decimal)}</span></li>`,
            `<li><span class="why">check: ${pct}% of ${fmt(whole)} is ${fmt(decimal)} · ${fmt(whole)} = ${amount} ✓</span></li>`,
          ]
        : []),
    ].join("");
    q("r").innerHTML = withVars(
      `A tank has ${amount} liters in it, and that’s ${pct}% of a full tank. If x is how many liters a full tank holds, then ${pct}% of x is ${fmt(decimal)}x, so <b>${fmt(decimal)}x = ${amount}</b>.` +
        (shown ? ` A full tank holds <b>${fmt(whole)} liters</b>.` : "") +
        `<br><span class="dimline">The ${amount} liters is the part. The whole is unknown, so it gets the letter.</span>`,
    );
  };
  onPick(el, (id) => {
    pct = +id;
    draw();
  });
  q("show").addEventListener("click", () => {
    shown = !shown;
    draw();
  });
  draw();
}

const STEPS = [
  {
    title: "Writing expressions",
    widget: wPhrases,
    body: withVars(
      "<p>An <b>expression</b> is a calculation written with numbers, letters, and operations, like n + 5 or 5n. A letter in it is a <b>variable</b>: it stands for a number that can change.</p><p>Pick a phrase and slide n.</p>",
    ),
    check: {
      kind: "mc",
      q: `Which expression means “7 less than ${mathVar("t")}”?`,
      choices: [
        { id: "a", label: withVars("t − 7") },
        { id: "b", label: withVars("7 − t") },
        { id: "c", label: withVars("7t") },
      ],
      answer: "a",
      why: {
        b: "7 − t starts at 7 and takes t away. “7 less than t” starts at t and takes 7 away.",
        c: "7t means 7 times t. “Less than” means subtract.",
      },
      explain: "Start at t and take away 7: t − 7. If t is 10, 7 less than 10 is 3, and 10 − 7 = 3 ✓",
    },
  },
  {
    title: "Coefficients",
    widget: wCoefficient,
    body: withVars(
      "<p>We write 3x for 3 · x, without a times sign. To find the value of an expression, put the number in for the letter.</p><p>Change x and watch every expression.</p>",
    ),
    check: {
      kind: "num",
      q: `What is 10 + 2${mathVar("x")} when ${mathVar("x")} = 3?`,
      answer: 16,
      misc: [
        [33, "2x means 2 times x, not the digits 2 and 3 side by side (23). 2 · 3 = 6, then 10 + 6."],
        [36, "That adds 10 + 2 first. Multiply first: 2x is 2 · 3 = 6, then 10 + 6 = 16."],
        [15, "That adds 10 + 2 + 3. 2x means 2 times x."],
      ],
      explain: "2x = 2 · 3 = 6, so 10 + 2x = 10 + 6 = 16.",
    },
  },
  {
    title: "Percentages with letters",
    widget: wPercent,
    body: withVars(
      "<p>Percent problems can be equations too. 40% of a number x is 0.4 · x, written 0.4x. When the whole is unknown, call it x, then solve.</p><p>Pick a percent.</p>",
    ),
    check: {
      kind: "num",
      q: "18 seats in a theater are filled. That’s 30% of the seats. How many seats are there?",
      unit: "seats",
      answer: 60,
      misc: [
        [5.4, "That’s 30% of 18. But 18 is the part, and the whole is unknown: 0.3x = 18, so x = 18 ÷ 0.3."],
        [0.6, "That divides by 30. 30% is 0.3, so x = 18 ÷ 0.3 = 60."],
        [48, "That adds 30 to 18, but 30% isn’t 30 seats. 30% of the seats is 18: 0.3x = 18."],
      ],
      explain: "0.3x = 18, so x = 18 ÷ 0.3 = 60 seats. Check: 30% of 60 is 18 ✓",
    },
  },
];
