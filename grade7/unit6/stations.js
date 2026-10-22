/* Code Breakers (Grade 7 Unit 6): the problem generators, station list, and icons. Loaded by index.html and by
   tools/fuzz.mjs, after figs.js (tape diagrams and number formats), shared/signed.js (number lines), and shared/hanger.js
   (hangers). Answers can be negative, so every typed problem sets neg. Every problem carries facts for checks.js: its type
   (t) and the numbers its checks need. Each generator deals one of a few kinds of problem (type), each with a comment saying
   what it asks. */
/* a num problem that may be negative: its named mistakes leave out any that land on the answer, and any repeats */
function numP(p) {
  const misc = (p.misc || []).filter(([v]) => Number.isFinite(v) && Math.abs(v - p.answer) >= 0.02);
  return { kind: "num", unit: "", neg: true, ...p, misc: miscOf(p.answer, misc) };
}
/* an mc problem from [[label, why it's wrong, or null for the answer], …], leaving out wrong choices that repeat a label */
function mcP(list, p) {
  const kept = list.filter(([label], i) => list.findIndex(([other]) => other === label) === i);
  return { ...mcOf(kept, { stack: p.stack }), ...p };
}
/* a whole number from a to b that isn't 0 */
const nonzero = (a, b) => {
  const n = R(a, b);
  return n === 0 ? nonzero(a, b) : n;
};
const x = mathVar("x");
/* p(x + q) as written */
const groupsText = (p, q) => `${fmt(p)}(${lin(1, q)})`;

/* ---------- Station 1: tape diagrams and equations (Lessons 1 to 6) ---------- */
/* stories of each kind: px + q = r (some of one thing, plus one more thing) and p(x + q) = r (groups of two things) */
const SUM_STORIES = [
  (p, q, r) => `Elena buys ${p} notebooks that cost the same and a $${q} pen. Elena pays $${r} in all.`,
  (p, q, r) => `A plant is ${q} cm tall and grows the same amount each week for ${p} weeks. Now it’s ${r} cm tall.`,
  (p, q, r) =>
    `Noah reads the same number of pages each day for ${p} days, plus ${q} pages on Sunday: ${r} pages in all.`,
];
const GROUP_STORIES = [
  (p, q, r) =>
    `${p} friends each buy a sandwich and a $${q} drink. Every sandwich costs the same, and they pay $${r} in all.`,
  (p, q, r) =>
    `Each of ${p} bags holds some apples and ${q} pears, the same in every bag: ${r} pieces of fruit in all.`,
  (p, q, r) =>
    `Kiran does ${p} sets of exercises, each some push-ups and ${q} sit-ups, the same every set: ${r} exercises in all.`,
];
function genTape() {
  const type = pick(["match", "story", "story", "find"]);
  const groups = Math.random() < 0.5,
    p = R(2, groups ? 5 : 6),
    q = R(2, 9),
    value = R(2, 12),
    r = groups ? p * (value + q) : p * value + q,
    sumEq = `${lin(p, q)} = ${fmt(r)}`,
    groupEq = `${groupsText(p, q)} = ${fmt(r)}`;
  /* the equation that matches, and two that don't */
  const choices = groups
    ? [
        [groupEq, null],
        [sumEq, `That’s ${p} ${x}s and one ${q}. Each of the ${p} groups has its own ${q}.`],
        [`${lin(1, q)} = ${fmt(r)}`, `That’s just one group. There are ${p} of them.`],
      ]
    : [
        [sumEq, null],
        [groupEq, `That gives each ${x} its own ${q}. The ${q} is there only once.`],
        [
          `${lin(p + q, 0)} = ${fmt(r)}`,
          `${p} ${x}s and ${q} more isn’t ${p + q} ${x}s: the ${q} is a number, not more ${x}s.`,
        ],
      ];
  if (type === "match" || type === "story") {
    /* the equation for a tape diagram, or for a story */
    const story = type === "story" ? pick(groups ? GROUP_STORIES : SUM_STORIES)(p, q, r) : "";
    return mcP(choices, {
      prompt:
        type === "story"
          ? `${story} Which equation fits, with ${x} for the unknown?`
          : `Which equation matches the tape diagram?`,
      fig: type === "match" ? () => tapeFor(p, q, r, { groups }) : undefined,
      stack: true,
      hint: groups
        ? `There are ${p} equal groups, and each has an unknown and ${q}.`
        : `There are ${p} equal unknown parts and one part of ${q}.`,
      explain: groups
        ? `${p} groups of (${lin(1, q)}) make ${fmt(r)}: ${groupEq}.`
        : `${p} unknowns and ${q} more make ${fmt(r)}: ${sumEq}.`,
      facts: { t: type, p, q, r, groups },
    });
  }
  /* the unknown, from the tape */
  return numP({
    prompt: `What is the value of ${x} in the tape diagram?`,
    answer: value,
    neg: false,
    fig: (show) => tapeFor(p, q, r, { groups, show, value }),
    hint: groups
      ? `Each group is ${fmt(r)} ÷ ${p} = ${fmt(r / p)}. Take away the ${q}.`
      : `Take away the ${q}: ${fmt(r)} − ${q} = ${fmt(r - q)}. That’s ${p} ${x}s.`,
    misc: groups
      ? [
          [(r - q) / p, `That takes the ${q} away once. Every group has a ${q}: divide by ${p} first.`],
          [r / p, `That’s one whole group, ${x} and ${q} together. Take the ${q} away.`],
        ]
      : [
          [(r - q * p) / p, `The ${q} is there only once. Take it away once, then divide.`],
          [r / p - q, `Take the ${q} away before dividing: (${fmt(r)} − ${q}) ÷ ${p}.`],
        ],
    explain: groups
      ? `${fmt(r)} ÷ ${p} = ${fmt(r / p)} in each group, and ${fmt(r / p)} − ${q} = ${value}.`
      : `${fmt(r)} − ${q} = ${fmt(r - q)}, and ${fmt(r - q)} ÷ ${p} = ${value}.`,
    facts: { t: type, p, q, r, groups, value },
  });
}

/* ---------- Station 2: solving px + q = r and p(x + q) = r (Lessons 7 to 10) ---------- */
function genSolve() {
  const type = pick(["sum", "sum", "groups", "groups"]);
  const value = nonzero(-10, 10),
    p = nonzero(-6, 9),
    q = nonzero(-10, 10);
  if (Math.abs(p) === 1) return genSolve();
  if (type === "sum") {
    /* px + q = r: undo adding q, then undo multiplying by p */
    const r = p * value + q;
    const allPositive = p > 0 && q > 0 && value > 0 && r <= 60;
    return numP({
      prompt: `Solve: ${lin(p, q)} = ${fmt(r)}`,
      answer: value,
      fig: allPositive ? () => hanger([...Array(p).fill("x"), q], [r]) : undefined,
      hint: allPositive
        ? `Take ${q} off both sides of the hanger, then split each side into ${p} equal parts.`
        : `Undo the ${q < 0 ? "subtracting" : "adding"} first: ${q < 0 ? "add" : "subtract"} ${Math.abs(q)} on both sides. Then divide both sides by ${par(p)}.`,
      misc: [
        [
          (r + q) / p,
          `To undo ${q < 0 ? "− " + Math.abs(q) : "+ " + q}, ${q < 0 ? "add" : "subtract"} ${Math.abs(q)}, the opposite.`,
        ],
        [r / p - q, "Undo the adding or subtracting before you divide."],
        [
          -value,
          `Check: ${par(p)} × ${par(-value)} ${q < 0 ? "−" : "+"} ${Math.abs(q)} = ${fmt(-p * value + q)}, not ${fmt(r)}.`,
        ],
      ],
      explain: `${lin(p, 0)} = ${fmt(r)} − ${par(q)} = ${fmt(r - q)}, so ${x} = ${fmt(r - q)} ÷ ${par(p)} = ${fmt(value)}. Check: ${par(p)} × ${par(value)} + ${par(q)} = ${fmt(r)}.`,
      facts: { t: type, p, q, r },
    });
  }
  /* p(x + q) = r: divide by p first, then undo adding q */
  const r = p * (value + q);
  if (value + q === 0) return genSolve();
  return numP({
    prompt: `Solve: ${groupsText(p, q)} = ${fmt(r)}`,
    answer: value,
    hint: `Divide both sides by ${par(p)} first: ${lin(1, q)} = ${fmt(r)} ÷ ${par(p)}. Then undo the ${q < 0 ? "subtracting" : "adding"}.`,
    misc: [
      [
        r / p + q,
        `${x} ${q < 0 ? "−" : "+"} ${Math.abs(q)} = ${fmt(r / p)}, so ${q < 0 ? "add" : "subtract"} ${Math.abs(q)}, the opposite.`,
      ],
      [
        (r - q) / p,
        `The ${par(q)} is inside the parentheses, so it’s multiplied by ${par(p)} too. Divide by ${par(p)} first.`,
      ],
      [-value, `Check: ${par(p)} × (${fmt(-value)} + ${par(q)}) = ${fmt(p * (-value + q))}, not ${fmt(r)}.`],
    ],
    explain: `${lin(1, q)} = ${fmt(r)} ÷ ${par(p)} = ${fmt(r / p)}, so ${x} = ${fmt(r / p)} − ${par(q)} = ${fmt(value)}.`,
    facts: { t: type, p, q, r },
  });
}

/* ---------- Station 3: story problems (Lessons 11 and 12) ---------- */
function genStory() {
  const type = pick(["sum", "groups", "percent"]);
  if (type === "percent") {
    /* a discount and a fee: (1 − d)·price + fee = paid */
    const price = pick([20, 40, 50, 60, 80, 100]),
      off = pick([10, 20, 25, 50]),
      fee = pick([3, 5, 8, 10]),
      paid = (price * (100 - off)) / 100 + fee,
      factor = (100 - off) / 100;
    return numP({
      prompt: `A jacket is ${off}% off, and shipping costs $${fee}. Lin pays $${fmt(paid)} in all. What was the jacket’s price before the discount?`,
      answer: price,
      neg: false,
      unit: "dollars",
      hint: `The sale price is ${100 - off}% of the price: ${fmt(factor)}${x} + ${fee} = ${fmt(paid)}. Take off the shipping, then divide by ${fmt(factor)}.`,
      misc: [
        [paid - fee, "That’s the sale price. The discount took some off: divide by the percent that’s left."],
        [(paid - fee) * (1 + off / 100), `Adding ${off}% back isn’t the same: the ${off}% was of the original price.`],
        [paid / factor - fee, "Take off the shipping before you divide."],
      ],
      explain: `${fmt(factor)}${x} + ${fee} = ${fmt(paid)}, so ${fmt(factor)}${x} = ${fmt(paid - fee)} and ${x} = ${fmt(paid - fee)} ÷ ${fmt(factor)} = ${price}.`,
      facts: { t: "percent", price, off, fee, paid },
    });
  }
  /* a tape story, solved */
  const groups = type === "groups",
    p = R(2, groups ? 5 : 6),
    q = R(2, 9),
    value = R(2, 12),
    r = groups ? p * (value + q) : p * value + q,
    story = pick(groups ? GROUP_STORIES : SUM_STORIES)(p, q, r),
    asks = groups
      ? story.includes("sandwich")
        ? ["How much does each sandwich cost?", "dollars"]
        : story.includes("apples")
          ? ["How many apples are in each bag?", "apples"]
          : ["How many push-ups are in each set?", "push-ups"]
      : story.includes("notebooks")
        ? ["How much does each notebook cost?", "dollars"]
        : story.includes("grows")
          ? ["How much does it grow each week?", "cm"]
          : ["How many pages a day?", "pages"];
  return numP({
    prompt: `${story} ${asks[0]}`,
    answer: value,
    neg: false,
    unit: asks[1],
    fig: () => tapeFor(p, q, r, { groups }),
    hint: groups ? `The equation is ${groupsText(p, q)} = ${r}.` : `The equation is ${lin(p, q)} = ${r}.`,
    misc: groups
      ? [
          [(r - q) / p, `Each of the ${p} has its own ${q}. Divide by ${p} first.`],
          [r / p, `That’s one whole group. Take the ${q} away.`],
        ]
      : [
          [(r + q) / p, `Take the ${q} away, not add it.`],
          [r / p - q, `Take the ${q} away before dividing.`],
        ],
    explain: groups
      ? `${groupsText(p, q)} = ${r}: ${r} ÷ ${p} = ${r / p}, and ${r / p} − ${q} = ${value}.`
      : `${lin(p, q)} = ${r}: ${r} − ${q} = ${r - q}, and ${r - q} ÷ ${p} = ${value}.`,
    facts: { t: groups ? "storyGroups" : "storySum", p, q, r },
  });
}

/* ---------- Station 4: inequalities (Lessons 13 to 15) ---------- */
/* an inequality sign, its words, and the sign facing the other way */
const SIGNS = { ">": "greater than", "<": "less than", "≥": "at least", "≤": "at most" };
const FLIP = { ">": "<", "<": ">", "≥": "≤", "≤": "≥" };
/* does v make "x sign b" true? */
const holds = (v, sign, b) => (sign === ">" ? v > b : sign === "<" ? v < b : sign === "≥" ? v >= b : v <= b);
function genIneq() {
  const type = pick(["graph", "test", "solve", "solve"]);
  const sign = pick(Object.keys(SIGNS)),
    b = R(-8, 8);
  if (type === "graph") {
    /* the inequality a graph shows: open or closed circle, and which way the ray goes */
    const open = sign === ">" || sign === "<",
      dir = sign === ">" || sign === "≥" ? 1 : -1;
    const options = [sign, FLIP[sign], open ? (sign === ">" ? "≥" : "≤") : sign === "≥" ? ">" : "<"];
    return mcP(
      options.map((s) => [
        `${x} ${s} ${fmt(b)}`,
        s === sign
          ? null
          : holds(b, s, b) !== holds(b, sign, b)
            ? `Look at the circle: ${open ? "hollow, so " + fmt(b) + " itself isn’t a solution" : "filled in, so " + fmt(b) + " is a solution"}.`
            : `Look at the ray: it points to the ${dir > 0 ? "greater" : "lesser"} numbers.`,
      ]),
      {
        prompt: "Which inequality does the number line show?",
        fig: () => signedLine(Math.min(-10, b - 4), Math.max(10, b + 4), { ray: { v: b, dir, open } }),
        hint: "A hollow circle leaves its number out (< or >); a filled one includes it (≤ or ≥). The ray points to the solutions.",
        explain: `The circle at ${fmt(b)} is ${open ? "hollow" : "filled in"} and the ray points ${dir > 0 ? "right" : "left"}: ${x} ${sign} ${fmt(b)}.`,
        facts: { t: type, sign, b },
      },
    );
  }
  if (type === "test") {
    /* is a value a solution? */
    const p = R(2, 5),
      q = R(-6, 6),
      v = R(-6, 6),
      left = p * v + q,
      edge = R(-10, 10),
      yes = holds(left, sign, edge);
    return mcP(
      [
        [
          "Yes, it’s a solution",
          yes
            ? null
            : `${par(p)} × ${par(v)} + ${par(q)} = ${fmt(left)}, and ${fmt(left)} ${sign} ${fmt(edge)} is false.`,
        ],
        [
          "No, it isn’t",
          yes
            ? `${par(p)} × ${par(v)} + ${par(q)} = ${fmt(left)}, and ${fmt(left)} ${sign} ${fmt(edge)} is true.`
            : null,
        ],
      ],
      {
        prompt: `Is ${x} = ${fmt(v)} a solution of <b>${lin(p, q)} ${sign} ${fmt(edge)}</b>?`,
        hint: `Put ${fmt(v)} in for ${x} and see whether the inequality is true.`,
        explain: `${par(p)} × ${par(v)} + ${par(q)} = ${fmt(left)}. ${fmt(left)} ${sign} ${fmt(edge)} is ${yes ? "true, so it is" : "false, so it isn’t"} a solution.`,
        facts: { t: type, p, q, v, sign, edge, yes },
      },
    );
  }
  /* solve px + q (sign) r: like an equation, but dividing by a negative turns the sign around */
  const p = nonzero(-5, 5),
    q = R(-9, 9),
    edge = nonzero(-8, 8),
    r = p * edge + q,
    answerSign = p < 0 ? FLIP[sign] : sign;
  if (Math.abs(p) === 1) return genIneq();
  return mcP(
    [
      [`${x} ${answerSign} ${fmt(edge)}`, null],
      [
        `${x} ${FLIP[answerSign]} ${fmt(edge)}`,
        p < 0
          ? `Dividing both sides by ${par(p)}, a negative, turns the sign around. Test a number to check.`
          : "Test a number: does it make the first inequality true?",
      ],
      [
        `${x} ${answerSign} ${fmt(-edge)}`,
        `Solve the equation ${lin(p, q)} = ${fmt(r)} carefully: the boundary is ${fmt(edge)}.`,
      ],
    ],
    {
      prompt: `Solve: <b>${lin(p, q)} ${sign} ${fmt(r)}</b>`,
      hint: `Solve ${lin(p, q)} = ${fmt(r)} for the boundary. Then test a number on one side to see which side works.`,
      explain: `${lin(p, q)} = ${fmt(r)} gives ${x} = ${fmt(edge)}. Testing a number shows the solutions are ${x} ${answerSign} ${fmt(edge)}${p < 0 ? ": dividing by a negative turned the sign around" : ""}.`,
      facts: { t: type, p, q, sign, r, edge },
    },
  );
}

/* ---------- Station 5: modeling with inequalities (Lessons 16 and 17) ---------- */
function genModel() {
  const type = pick(["most", "least"]);
  if (type === "most") {
    /* the most of something a budget allows: a fixed cost plus a price each, at most the budget */
    const fee = pick([5, 8, 10, 12, 15]),
      each = pick([3, 4, 5, 6]),
      budget = pick([40, 45, 50, 60]),
      answer = Math.floor((budget - fee) / each),
      what = pick([
        ["The fair charges", "to get in and", "for each ride", "rides"],
        ["A gym charges", "to sign up and", "for each class", "classes"],
        ["A zoo charges", "to park and", "for each ticket", "tickets"],
      ]);
    if ((budget - fee) % each === 0) return genModel();
    return numP({
      prompt: `${what[0]} $${fee} ${what[1]} $${each} ${what[2]}. Jada has $${budget}. What is the <b>most</b> ${what[3]} Jada can pay for?`,
      answer,
      neg: false,
      unit: what[3],
      hint: `${fee} + ${each}${x} ≤ ${budget}. Solve ${fee} + ${each}${x} = ${budget}, then take the largest whole number that fits.`,
      misc: [
        [
          answer + 1,
          `${answer + 1} ${what[3]} cost ${fee} + ${each} × ${answer + 1} = ${fee + each * (answer + 1)}, more than $${budget}.`,
        ],
        [Math.floor(budget / each), `Don’t forget the $${fee} first.`],
        [
          Math.round(((budget - fee) / each) * 100) / 100,
          "You can’t buy part of one. Round down to a whole number that fits the budget.",
        ],
      ],
      explain: `${fee} + ${each}${x} ≤ ${budget} means ${x} ≤ ${fmt((budget - fee) / each)}, so the most is ${answer}.`,
      facts: { t: type, fee, each, budget },
    });
  }
  /* the fewest of something to reach a goal: a start plus some each time, at least the goal */
  const start = pick([10, 20, 25, 30, 40]),
    each = pick([6, 7, 8, 9, 12]),
    goal = pick([100, 120, 150]),
    answer = Math.ceil((goal - start) / each),
    what = pick([
      ["Diego has saved $", "and saves $", "each week toward a $", "bike", "weeks"],
      ["Priya has read", "pages and reads", "pages a day of a", "book", "days"],
    ]);
  if ((goal - start) % each === 0) return genModel();
  return numP({
    prompt:
      what[4] === "weeks"
        ? `Diego has saved $${start} and saves $${each} each week toward a $${goal} bike. What is the <b>fewest</b> weeks until Diego has enough?`
        : `Priya has read ${start} pages and reads ${each} pages a day of a ${goal}-page book. What is the <b>fewest</b> days until Priya finishes?`,
    answer,
    neg: false,
    unit: what[4],
    hint: `${start} + ${each}${x} ≥ ${goal}. Solve ${start} + ${each}${x} = ${goal}, then take the smallest whole number that’s enough.`,
    misc: [
      [
        answer - 1,
        `After ${answer - 1} ${what[4]}: ${start} + ${each} × ${answer - 1} = ${start + each * (answer - 1)}, not enough yet.`,
      ],
      [Math.ceil(goal / each), `Count the ${start} already done.`],
      [
        Math.round(((goal - start) / each) * 100) / 100,
        "There’s no part of a day or week here. Round up to a whole number.",
      ],
    ],
    explain: `${start} + ${each}${x} ≥ ${goal} means ${x} ≥ ${fmt((goal - start) / each)}, so the fewest is ${answer}.`,
    facts: { t: type, start, each, goal },
  });
}

/* ---------- Station 6: equivalent expressions (Lessons 18 to 22) ---------- */
function genEquiv() {
  const type = pick(["expand", "factor", "combine", "subtract"]);
  if (type === "expand") {
    /* a(bx + c), multiplied out */
    const a = nonzero(-6, 6),
      bx = R(1, 5),
      c = nonzero(-8, 8);
    if (Math.abs(a) === 1) return genEquiv();
    return mcP(
      [
        [lin(a * bx, a * c), null],
        [lin(a * bx, c), `Multiply both terms in the parentheses by ${par(a)}, not just the first.`],
        [lin(a * bx, -a * c), `Check the sign of ${par(a)} × ${par(c)}.`],
      ],
      {
        prompt: `Which expression is equivalent to <b>${fmt(a)}(${lin(bx, c)})</b>?`,
        hint: `Distribute: multiply ${par(a)} by ${lin(bx, 0)} and by ${par(c)}.`,
        explain: `${par(a)} × ${lin(bx, 0)} = ${lin(a * bx, 0)} and ${par(a)} × ${par(c)} = ${fmt(a * c)}: ${lin(a * bx, a * c)}.`,
        facts: { t: type, expr: [a * bx, a * c] },
      },
    );
  }
  if (type === "factor") {
    /* g·m·x + g·n, with the greatest common factor taken out */
    const g = R(2, 6),
      m = R(1, 5),
      n = pick([1, 2, 3, 5, 7].filter((v) => gcd(m, v) === 1));
    return mcP(
      [
        [`${g}(${lin(m, n)})`, null],
        [`${g}(${lin(m, g * n)})`, `${g} × ${g * n} is ${g * g * n}, not ${g * n}. Divide both terms by ${g}.`],
        [`${g}(${lin(m, -n)})`, `Check the sign: ${g} × ${fmt(-n)} is ${fmt(-g * n)}, not ${g * n}.`],
      ],
      {
        prompt: `Which expression is equivalent to <b>${lin(g * m, g * n)}</b>?`,
        hint: `What number goes into both ${g * m} and ${g * n}? Divide each term by it.`,
        explain: `${g} goes into both: ${lin(g * m, 0)} = ${g} × ${lin(m, 0)} and ${g * n} = ${g} × ${n}, so ${g}(${lin(m, n)}).`,
        facts: { t: type, expr: [g * m, g * n] },
      },
    );
  }
  if (type === "combine") {
    /* ax + b + cx + d, with like terms combined */
    const a = R(2, 9),
      b = nonzero(-9, 9),
      c = nonzero(-6, 6),
      d = nonzero(-9, 9);
    if (a + c === 0 || b + d === 0) return genEquiv();
    const shown = `${lin(a, b)} ${c < 0 ? "−" : "+"} ${lin(Math.abs(c), 0)} ${d < 0 ? "−" : "+"} ${Math.abs(d)}`;
    return mcP(
      [
        [lin(a + c, b + d), null],
        [
          lin(a + Math.abs(c), b + d),
          `The ${lin(Math.abs(c), 0)} is ${c < 0 ? "subtracted" : "added"}: ${a} ${c < 0 ? "−" : "+"} ${Math.abs(c)}.`,
        ],
        [lin(a + c + b + d, 0), "Numbers and x terms aren’t like terms: keep them apart."],
      ],
      {
        prompt: `Which expression is equivalent to <b>${shown}</b>?`,
        hint: "Combine the x terms with each other and the numbers with each other, keeping each one’s sign.",
        explain: `x terms: ${a} ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${a + c}. Numbers: ${fmt(b)} ${d < 0 ? "−" : "+"} ${Math.abs(d)} = ${fmt(b + d)}. So ${lin(a + c, b + d)}.`,
        facts: { t: type, expr: [a + c, b + d] },
      },
    );
  }
  /* n − (ax + c): subtracting the whole group */
  const n = R(5, 12),
    a = R(2, 6),
    c = nonzero(-6, 6);
  return mcP(
    [
      [lin(-a, n - c), null],
      [lin(-a, n + c), `Subtract all of (${lin(a, c)}): the ${par(c)} is subtracted too.`],
      [lin(a, n - c), `The ${lin(a, 0)} is subtracted, so it becomes ${lin(-a, 0)}.`],
    ],
    {
      prompt: `Which expression is equivalent to <b>${n} − (${lin(a, c)})</b>?`,
      hint: `Subtracting a group subtracts each part: ${n} − ${lin(a, 0)} − ${par(c)}.`,
      explain: `${n} − (${lin(a, c)}) = ${n} − ${lin(a, 0)} − ${par(c)} = ${lin(-a, n - c)}.`,
      facts: { t: type, expr: [-a, n - c] },
    },
  );
}

const ZONES = [
  {
    id: "tape",
    name: "Tape Codes",
    lessons: "Lessons 1–6",
    blurb: "Match tape diagrams and stories to px + q = r or p(x + q) = r, and read x off the tape.",
    gen: genTape,
  },
  {
    id: "solve",
    name: "Crack the Code",
    lessons: "Lessons 7–10",
    blurb: "Solve px + q = r and p(x + q) = r, with negative numbers too.",
    gen: genSolve,
  },
  {
    id: "story",
    name: "Story Problems",
    lessons: "Lessons 11–12",
    blurb: "Write and solve an equation for a story, including a discount with shipping.",
    gen: genStory,
  },
  {
    id: "ineq",
    name: "Inequality Lock",
    lessons: "Lessons 13–15",
    blurb:
      "Read inequalities from number lines, test solutions, and solve them, turning the sign around when you divide by a negative.",
    gen: genIneq,
  },
  {
    id: "model",
    name: "Most and Fewest",
    lessons: "Lessons 16–17",
    blurb: "Use inequalities to find the most a budget buys or the fewest it takes to reach a goal.",
    gen: genModel,
  },
  {
    id: "equiv",
    name: "Equivalent Codes",
    lessons: "Lessons 18–22",
    blurb: "Expand, factor, subtract a group, and combine like terms.",
    gen: genEquiv,
  },
  {
    id: "boss",
    name: "Master Key",
    lessons: "Whole unit · 10 problems",
    blurb: "A mixed review from every station. Aim for 3 stars.",
    gen: () => pick([genTape, genSolve, genStory, genIneq, genModel, genEquiv])(),
  },
];

const ICON = {
  tape: '<rect x="4" y="20" width="16" height="18" fill="rgba(127,227,255,.3)" stroke="#f3f6fb" stroke-width="2"/><rect x="20" y="20" width="16" height="18" fill="rgba(127,227,255,.3)" stroke="#f3f6fb" stroke-width="2"/><rect x="36" y="20" width="24" height="18" fill="rgba(255,201,60,.45)" stroke="#f3f6fb" stroke-width="2"/><path d="M4,44 q0,6 6,6 H26 q6,0 6,6 q0,-6 6,-6 H54 q6,0 6,-6" fill="none" stroke="#7fe3ff" stroke-width="2.5"/>',
  solve:
    '<rect x="14" y="26" width="36" height="28" rx="4" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2.5"/><path d="M22,26 V18 a10,10 0 0 1 20,0 V26" fill="none" stroke="#f3f6fb" stroke-width="3"/><circle cx="32" cy="38" r="3.5" fill="#0a2340"/><path d="M32,40 v7" stroke="#0a2340" stroke-width="3"/>',
  story:
    '<rect x="10" y="8" width="44" height="48" rx="3" fill="rgba(243,246,251,.12)" stroke="#f3f6fb" stroke-width="2.5"/><path d="M18,20 H46 M18,30 H46 M18,40 H36" stroke="#7fe3ff" stroke-width="2.5"/><text x="46" y="52" fill="#ffc93c" font-size="12" font-weight="800" text-anchor="middle" font-family="monospace">x</text>',
  ineq: '<path d="M4,40 H60" stroke="#f3f6fb" stroke-width="2.5"/><circle cx="24" cy="40" r="6" fill="#0a2340" stroke="#7fe3ff" stroke-width="3"/><path d="M30,40 H54" stroke="#7fe3ff" stroke-width="5"/><polygon points="60,40 52,34 52,46" fill="#7fe3ff"/><text x="24" y="22" fill="#ffc93c" font-size="14" font-weight="800" text-anchor="middle" font-family="monospace">&gt;</text>',
  model:
    '<path d="M10,52 V12" stroke="#f3f6fb" stroke-width="2.5"/><path d="M10,22 H54" stroke="#ff9a86" stroke-width="3" stroke-dasharray="5 4"/><rect x="16" y="36" width="8" height="16" fill="#ffc93c"/><rect x="28" y="30" width="8" height="22" fill="#ffc93c"/><rect x="40" y="24" width="8" height="28" fill="#ffc93c"/>',
  equiv:
    '<text x="32" y="28" fill="#ffc93c" font-size="12" font-weight="800" text-anchor="middle" font-family="monospace">3(x+2)</text><text x="32" y="40" fill="#f3f6fb" font-size="12" font-weight="800" text-anchor="middle" font-family="monospace">=</text><text x="32" y="54" fill="#7fe3ff" font-size="12" font-weight="800" text-anchor="middle" font-family="monospace">3x+6</text>',
  boss: '<circle cx="22" cy="32" r="12" fill="none" stroke="#ffc93c" stroke-width="4"/><path d="M34,32 H58 M48,32 v10 M56,32 v8" stroke="#ffc93c" stroke-width="4"/>',
};
