/* Learn Rational Numbers (Grade 6 Unit 7), chapter 3: Negative numbers in the world. Its widgets and steps; loaded by
   contexts.html. */
/* Deposit and withdraw $10 at a time: the balance goes below 0 when more is taken out than was put in. */
function wBank(el) {
  const q = Q(el),
    start = 20,
    lowest = -50,
    highest = 50;
  let balance = start,
    changes = [];
  el.innerHTML =
    `<div class="wrow"><button type="button" class="ghost-btn" data-in>Deposit $10</button><button type="button" class="ghost-btn" data-out>Withdraw $10</button><button type="button" class="ghost-btn" data-reset>Start over</button></div>` +
    `<div class="chips" data-c></div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    q("in").disabled = balance >= highest;
    q("out").disabled = balance <= lowest;
    q("c").innerHTML = changes.map((d) => `<span class="chip">${d > 0 ? "+" : ""}${money(d)}</span>`).join("");
    q("f").innerHTML = vLine(-60, 60, {
      every: 20,
      step: 10,
      kind: "money",
      pts: [{ v: balance, t: money(balance), cls: balance < 0 ? "r" : "" }],
      label: `Bank balance of ${money(balance)}`,
    });
    q("e").textContent = `Balance: ${money(balance)}`;
    q("r").innerHTML =
      (balance < 0
        ? `A balance of ${money(balance)} means the account is ${money(-balance)} <b>below zero</b>: you owe the bank ${money(-balance)}.`
        : balance > 0
          ? `A balance of ${money(balance)} means you have ${money(balance)} in the account.`
          : "A balance of $0: nothing in the account, and nothing owed.") +
      `<br><span class="dimline">A deposit (money in) is positive, +$10. A withdrawal (money out) is negative, −$10.</span>`;
  };
  q("in").addEventListener("click", () => {
    balance += 10;
    changes.push(10);
    draw();
  });
  q("out").addEventListener("click", () => {
    balance -= 10;
    changes.push(-10);
    draw();
  });
  q("reset").addEventListener("click", () => {
    balance = start;
    changes = [];
    draw();
  });
  draw();
}

/* two scenes to compare: one thing that moves (a stepper through its values) and one that stays, on an up-and-down line */
const SCENES = {
  deep: {
    label: "Depths",
    mover: "Submarine",
    values: valuesFrom(-200, 0, 20),
    start: -120,
    still: { name: "the whale", v: -80 },
    name: "the submarine",
    show: (v) => `${fmt(v)} m`,
    line: (pts) => vLine(-200, 40, { every: 40, step: 20, kind: "sea", pts, label: "Depths below sea level" }),
    less: "deeper",
    more: "higher",
  },
  cold: {
    label: "Temperatures",
    mover: "Tonight",
    values: valuesFrom(-15, 5),
    start: -8,
    still: { name: "last night", v: -3 },
    name: "tonight",
    show: (v) => `${fmt(v)} °F`,
    line: (pts) => vLine(-15, 10, { every: 5, unit: "°", pts, label: "Temperatures in °F" }),
    less: "colder",
    more: "warmer",
  },
};
/* Pick depths or temperatures and move one of the two: the lesser number is deeper or colder. */
function wInContext(el) {
  const q = Q(el),
    values = { v: 0 },
    limits = { v: [0, 0] };
  let sceneId = "deep";
  el.innerHTML =
    seg("Compare", [
      ["deep", "Depths"],
      ["cold", "Temperatures"],
    ]) +
    `<div class="wrow" data-c></div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const choose = (id) => {
    sceneId = id;
    const scene = SCENES[id];
    values.v = scene.values.indexOf(scene.start);
    limits.v = [0, scene.values.length - 1];
    q("c").innerHTML = stepper("v", scene.mover);
    draw();
  };
  const draw = () => {
    const scene = SCENES[sceneId],
      v = scene.values[values.v],
      still = scene.still,
      /* the thing with the lesser number, then the other */
      [low, high] =
        v < still.v
          ? [
              [scene.name, v],
              [still.name, still.v],
            ]
          : [
              [still.name, still.v],
              [scene.name, v],
            ];
    press(el, sceneId);
    q("v").textContent = scene.show(v);
    q("f").innerHTML = scene.line([
      { v, t: `${scene.name} ${scene.show(v)}` },
      { v: still.v, cls: "b", t: `${still.name} ${scene.show(still.v)}` },
    ]);
    q("e").textContent = compareText(v, still.v);
    q("r").innerHTML =
      v === still.v
        ? `${capitalFirst(scene.name)} and ${still.name} are both at ${scene.show(v)}.`
        : `${capitalFirst(low[0])} (${scene.show(low[1])}) is <b>${scene.less}</b> than ${high[0]} (${scene.show(high[1])}): ${fmt(low[1])} &lt; ${fmt(high[1])}.` +
          `<br><span class="dimline">${capitalFirst(scene.less)} means a lesser number, farther down the line. ${capitalFirst(scene.more)} means a greater one.</span>`;
  };
  onPick(el, choose);
  steppers(el, values, limits, draw);
  choose("deep");
}
/* text with its first letter a capital */
const capitalFirst = (text) => text[0].toUpperCase() + text.slice(1);

const STEPS = [
  {
    title: "What the sign means",
    widget: wBank,
    body: "<p>A sign can say which way an amount goes. In a bank account, money put in is positive and money taken out is negative. When more comes out than went in, the balance goes <b>below zero</b>: the account owes money.</p><p>Make deposits and withdrawals.</p>",
    check: {
      kind: "mc",
      q: "Which bank balance means owing the most money?",
      choices: [
        { id: "a", label: "−$45" },
        { id: "b", label: "−$15" },
        { id: "c", label: "$30" },
      ],
      answer: "a",
      why: {
        b: "A balance of −$15 owes $15. −$45 is farther below zero: it owes $45.",
        c: "A balance of $30 is money in the account, not money owed.",
      },
      explain: "−$45 is the farthest below zero, so it owes the most: $45.",
    },
  },
  {
    title: "Deeper and colder",
    widget: wInContext,
    body: "<p>Comparing signed numbers works the same in any situation. A lesser number is farther down: deeper below sea level, or colder.</p><p>Move the submarine, then compare temperatures.</p>",
    check: {
      kind: "mc",
      q: "A submarine is at −150 m and a whale is at −80 m. Which statement is true?",
      stack: true,
      choices: [
        { id: "a", label: "−150 < −80, so the submarine is deeper" },
        { id: "b", label: "−150 > −80, so the submarine is higher" },
        { id: "c", label: "−80 < −150, so the whale is deeper" },
      ],
      answer: "a",
      why: {
        b: "150 is more than 80, but −150 is farther below sea level than −80. −150 is less, so the submarine is deeper.",
        c: "−80 is greater than −150: the whale is 80 m down and the submarine 150 m down. The submarine is deeper.",
      },
      explain: "−150 is less than −80 (farther below 0), so the submarine is deeper: −150 < −80.",
    },
  },
];
