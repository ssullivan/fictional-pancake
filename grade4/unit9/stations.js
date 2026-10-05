/* Year-End Fair (Grade 4 Unit 9): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Fraction strips come from shared/fractions.js; the standard algorithms and partial quotients from shared/blocks.js; tape
   diagrams from shared/numlines.js; area diagrams from shared/multiply.js; fr and mixed from shared/pictures.js; roundTo, mcOf,
   and miscOf from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Every problem also
   carries facts for checks.js: its kind (t) and the numbers it was made from, so the answer can be worked out again. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* how many nonzero digits n has */
const nonzero = (n) => String(n).replace(/[^1-9]/g, "").length;
/* a random whole number with `places` digits and at most `most` nonzero digits (the first is never 0) */
function friendly(places, most) {
  let n;
  do {
    const digits = [...String(R(10 ** (places - 1), 10 ** places - 1))];
    while (digits.filter((c) => c !== "0").length > most) digits[R(1, places - 1)] = "0";
    n = +digits.join("");
  } while (nonzero(n) > most);
  return n;
}
/* Named mistakes for a typed fraction, leaving out any that aren't positive or are so close to the answer the engine would count
   them right */
const apart = (answer, list) =>
  miscOf(
    answer,
    list.filter(([value]) => value > 0 && Math.abs(value - answer) > 0.02),
  );
/* k/d with a mixed number when it's more than 1 (html) */
const asMixed = (k, d) =>
  fr(k, d) + (k > d && k % d ? ` = ${mixed(k, d)}` : k >= d && k % d === 0 ? ` = ${k / d}` : "");

/* ---------- Pie Booth: fractions (Lessons 1–3) ---------- */
function genFractions() {
  const variant = R(0, 3),
    name = pick(KIDS),
    d = pick([3, 4, 5, 6, 8, 10, 12]);
  if (variant === 0) {
    /* add two fractions: pie eaten at two tables */
    const a = R(1, d - 1),
      b = R(1, d - 1),
      sum = a + b;
    return {
      kind: "num",
      frac: true,
      unit: sum <= d ? "pie" : "pies",
      answer: sum / d,
      facts: { t: "add", d, nums: [a, b] },
      prompt: `At the pie booth, one table eats ${fr(a, d)} of a pie and another eats ${fr(b, d)} of a pie. How many pies is that in all?`,
      fig: (show) => strips([{ d, k: show ? sum : a, grp: show ? [a, b] : 0 }], { wholes: Math.ceil(sum / d) }),
      misc: apart(sum / d, [
        [sum / (2 * d), `That adds the denominators too. The parts are the same size: add the numerators.`],
      ]),
      hint: `Both are ${PART[d][1]}. Add the numerators.`,
      explain: `${fr(a, d)} + ${fr(b, d)} = ${asMixed(sum, d)} ${sum <= d ? "pie" : "pies"}.`,
    };
  }
  if (variant === 1) {
    /* subtract from a mixed number, trading a whole */
    const whole = R(1, 3),
      r = R(0, d - 2),
      b = R(r + 1, d - 1),
      start = whole * d + r,
      left = start - b,
      startText = r ? `${whole} ${fr(r, d)}` : `${whole}`;
    return {
      kind: "num",
      frac: true,
      unit: left <= d ? "pie" : "pies",
      answer: left / d,
      facts: { t: "subtract", d, start, minus: b },
      prompt: `The booth has ${startText} pies. It sells ${fr(b, d)} of a pie. How many pies are left?`,
      fig: (show) => strips([{ d, k: start, out: show ? b : 0 }], { wholes: whole + 1 }),
      misc: apart(left / d, [
        ...(r
          ? [[whole + (b - r) / d, `That takes ${fr(r, d)} from ${fr(b, d)}. Trade 1 whole for ${fr(d, d)} first.`]]
          : []),
        [(start + b) / d, `That adds. The booth sold some, so subtract.`],
      ]),
      hint: `Write ${startText} in ${PART[d][1]}: ${fr(start, d)}. Then take away ${b}.`,
      explain: `${startText} = ${fr(start, d)}, and ${fr(start, d)} − ${fr(b, d)} = ${asMixed(left, d)} ${left <= d ? "pie" : "pies"}.`,
    };
  }
  if (variant === 2) {
    /* equal groups of a fraction */
    const n = R(2, 6),
      a = R(1, Math.min(d - 1, 5)),
      total = n * a;
    return {
      kind: "num",
      frac: true,
      unit: "cups",
      answer: total / d,
      facts: { t: "times", d, n, a },
      prompt: `Each pie takes ${fr(a, d)} cup of sugar. How many cups of sugar do ${n} pies take?`,
      fig: (show) => strips([{ d, k: show ? total : a, grp: a }], { wholes: Math.max(1, Math.ceil(total / d)) }),
      misc: apart(total / d, [
        [total / (n * d), `That multiplies the denominator too. The parts stay ${PART[d][1]}.`],
        [(n + a) / d, `That adds ${n} and ${a}. ${n} groups of ${fr(a, d)}: multiply.`],
      ]),
      hint: `${n} groups of ${fr(a, d)}: ${n} × ${a} ${PART[d][1]}.`,
      explain: `${n} × ${fr(a, d)} = ${fr(total, d)}${total >= d ? ` = ${mixed(total, d)}` : ""} cups.`,
    };
  }
  /* which operation a story needs */
  const op = pick(["+", "−", "×"]),
    a = R(1, d - 1),
    n = R(2, 6),
    story = {
      "+": `${name} eats ${fr(a, d)} of a pie, then ${fr(1, d)} more. Which expression shows how much ${name} eats?`,
      "−": `A pie has ${fr(d - 1, d)} left. ${name} eats ${fr(a, d)} of a pie from it. Which expression shows how much is left?`,
      "×": `${n} friends each eat ${fr(a, d)} of a pie. Which expression shows how much they eat in all?`,
    }[op];
  const expressions = {
    "+": [`${fr(a, d)} + ${fr(1, d)}`, `${fr(a, d)} × ${fr(1, d)}`, `${fr(a, d)} − ${fr(1, d)}`],
    "−": [`${fr(d - 1, d)} − ${fr(a, d)}`, `${fr(d - 1, d)} + ${fr(a, d)}`, `${fr(a, d)} − ${fr(d - 1, d)}`],
    "×": [`${n} × ${fr(a, d)}`, `${n} + ${fr(a, d)}`, `${fr(a, d)} − ${n}`],
  }[op];
  if (op === "−" && a >= d - 1) return genFractions();
  return {
    ...mcOf(
      expressions.map((e, i) => [
        e,
        i === 0
          ? null
          : {
              "+": "The amounts are put together: add.",
              "−": "Some is eaten from what’s there, so start with what’s there and subtract.",
              "×": `There are ${n} equal groups of ${fr(a, d)}: multiply.`,
            }[op],
      ]),
    ),
    facts: { t: "choose", op, a, d, n },
    prompt: story,
    hint: "Is the story putting amounts together, taking some away, or making equal groups?",
    explain: `The story ${op === "+" ? "puts two amounts together" : op === "−" ? "takes some away" : "has equal groups"}: ${expressions[0]}.`,
  };
}

/* ---------- Ring Toss: the standard algorithms and division (Lessons 4–6) ---------- */
/* how many columns trade: a sum's columns making 10 or more, or a difference's trades (across zeros counts once) */
const trades = (a, b, op) => algSteps(a, b, op).filter((s) => (op === "+" ? s.val >= 10 : s.from !== null)).length;
function genAlgorithms() {
  const variant = R(0, 3),
    name = pick(KIDS);
  if (variant === 0 || variant === 1) {
    /* add or subtract with at most one trade */
    const op = variant === 0 ? "+" : "-";
    let a, b;
    do {
      a = friendly(R(4, 5), 3);
      b = friendly(R(3, 4), 3);
      if (op === "-" && b > a) [a, b] = [b, a];
    } while (a === b || trades(a, b, op) > 1 || nonzero(op === "+" ? a + b : a - b) > 4);
    const answer = op === "+" ? a + b : a - b;
    return {
      kind: "num",
      unit: "tickets",
      answer,
      facts: { t: op === "+" ? "add" : "subtract", a, b },
      prompt:
        op === "+"
          ? `The fair sold ${commas(a)} ride tickets on Friday and ${commas(b)} on Saturday. How many tickets is that in all?`
          : `The fair printed ${commas(a)} ride tickets. ${commas(b)} were sold. How many tickets are left?`,
      fig: (show) => algFig(a, b, op, show ? 1 : 0),
      misc: miscOf(answer, [
        [
          op === "+" ? Math.abs(a - b) : a + b,
          op === "+" ? "That subtracts. In all means add." : "That adds. Some were sold: subtract.",
        ],
      ]),
      hint:
        op === "+"
          ? "Line up the places and add from the ones, carrying a 1 when a column makes 10."
          : "Line up the places and subtract from the ones, trading when the top digit is too small.",
      explain: `${commas(a)} ${op === "+" ? "+" : "−"} ${commas(b)} = ${commas(answer)} tickets.`,
    };
  }
  if (variant === 2) {
    /* multiply: 1 digit by up to 4 digits */
    let a, b;
    do {
      a = friendly(R(3, 4), 3);
      b = R(3, 9);
    } while (mulSteps(a, b).filter((s) => s.carry).length > 2 || nonzero(a * b) > 4);
    return {
      kind: "num",
      unit: "prizes",
      answer: a * b,
      facts: { t: "multiply", a, b },
      prompt: `Each of ${b} prize stands has ${commas(a)} prizes. How many prizes is that in all?`,
      fig: (show) => mulFig(a, b, show ? 1 : 0),
      misc: miscOf(a * b, [[a + b, `That adds ${b}. ${b} equal groups of ${commas(a)}: multiply.`]]),
      hint: `Multiply each place by ${b}, starting with the ones, and carry.`,
      explain: `${b} × ${commas(a)} = ${commas(a * b)} prizes.`,
    };
  }
  /* divide: up to 4 digits by 1 digit, no remainder */
  let divisor, quotient;
  do {
    divisor = R(3, 9);
    quotient = friendly(3, 2);
  } while (quotient * divisor > 4000 || nonzero(quotient * divisor) > 3);
  const total = quotient * divisor,
    chunks = placeParts(quotient);
  return {
    kind: "num",
    unit: "bags",
    answer: quotient,
    facts: { t: "divide", n: total, d: divisor },
    prompt: `The fair has ${commas(total)} marbles for the marble game. They go in bags of ${divisor}. How many bags is that?`,
    fig: (show) => quotientFig(total, divisor, chunks, show ? 1 : 0),
    misc: miscOf(quotient, [
      ...(quotient % 100 < 10 && quotient >= 100
        ? [
            [
              Math.floor(quotient / 100) * 10 + (quotient % 10),
              "That leaves out the 0 in the tens place. Add the chunks with their places.",
            ],
          ]
        : []),
      [total * divisor, `That multiplies. Divide: ${commas(total)} ÷ ${divisor}.`],
    ]).filter(([wrong]) => wrong !== quotient),
    hint: `Take away easy chunks, like ${chunks[0]} × ${divisor} = ${commas(chunks[0] * divisor)}.`,
    explain: `${chunks.map((c) => `${c} × ${divisor} = ${commas(c * divisor)}`).join(", ")}. ${chunks.join(" + ")} = ${quotient} bags.`,
  };
}

/* ---------- Ferris Wheel: comparison problems (Lesson 7) ---------- */
function genCompare() {
  const variant = R(0, 3),
    [first, second] = shuffle(KIDS).slice(0, 2),
    small = R(3, 9) * pick([1, 1, 10]),
    times = R(2, 9),
    big = small * times;
  const tape = (ask) =>
    timesTape(
      [
        {
          label: first,
          times: 1,
          each: ask === "small" ? "?" : commas(small),
          total: ask === "small" ? "?" : commas(small),
        },
        ask === "times"
          ? { label: second, times: 1, span: Math.min(times, 6), each: commas(big), total: `? × ${commas(small)}` }
          : {
              label: second,
              times,
              each: ask === "small" ? "?" : commas(small),
              total: ask === "big" || ask === "more" ? "?" : commas(big),
            },
      ],
      { label: `Tape diagram comparing ${first}’s and ${second}’s rides` },
    );
  const ask = ["big", "times", "small", "more"][variant],
    answer = { big, times, small, more: big - small }[ask],
    prompt = {
      big: `${first} rides the Ferris wheel ${small} times this summer. ${second} rides ${times} times as many. How many rides is that for ${second}?`,
      times: `${first} rides the Ferris wheel ${small} times. ${second} rides it ${big} times. How many times as many rides does ${second} take?`,
      small: `${second} rides the Ferris wheel ${big} times. That’s ${times} times as many as ${first}. How many times does ${first} ride?`,
      more: `${first} rides the Ferris wheel ${small} times. ${second} rides ${times} times as many. How many more rides does ${second} take?`,
    }[ask];
  return {
    kind: "num",
    unit: ask === "times" ? "times as many" : "rides",
    answer,
    facts: { t: "compare", ask, small, times, big },
    prompt,
    fig: () => tape(ask),
    misc: miscOf(
      answer,
      {
        big: [[small + times, `That’s ${times} more. ${times} times as many: multiply.`]],
        times: [[big - small, "That’s how many more. How many groups make it? Divide."]],
        small: [[big - times, `That subtracts ${times}. ${commas(big)} is ${times} equal groups: divide.`]],
        more: [
          [big, `That’s how many ${second} takes. How many more than ${first}? Subtract ${small}.`],
          [times, `That’s how many times as many. Find ${times} × ${small}, then subtract.`],
        ],
      }[ask],
    ).filter(([wrong]) => wrong !== answer),
    hint: {
      big: "Multiply.",
      times: "How many groups of the smaller amount make the bigger? Divide.",
      small: "Split the bigger amount into equal groups: divide.",
      more: "Find the bigger amount first, then subtract.",
    }[ask],
    explain: {
      big: `${times} × ${commas(small)} = ${commas(big)} rides.`,
      times: `${commas(big)} ÷ ${commas(small)} = ${times} times as many.`,
      small: `${commas(big)} ÷ ${times} = ${commas(small)} rides.`,
      more: `${times} × ${commas(small)} = ${commas(big)}, and ${commas(big)} − ${commas(small)} = ${commas(big - small)} more rides.`,
    }[ask],
  };
}

/* ---------- Prize Tent: problems with more than one step, and remainders (Lesson 8) ---------- */
function genProblems() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* two steps: buy some, give some away */
    const packs = R(3, 9),
      each = pick([12, 24, 25, 36, 48, 50]),
      total = packs * each,
      given = R(1, Math.floor(total / 10)) * 5,
      left = total - given;
    return {
      kind: "num",
      unit: "stickers",
      answer: left,
      facts: { t: "twoStep", a: packs, b: each, minus: given },
      prompt: `The prize tent buys ${packs} packs of ${each} stickers and gives away ${given} stickers. How many stickers are left?`,
      misc: miscOf(left, [
        [total, `That’s how many it bought. ${given} were given away: subtract.`],
        [total + given, "That adds. The ones given away aren’t left."],
      ]),
      hint: `First find the stickers in all: ${packs} × ${each}.`,
      explain: `${packs} × ${each} = ${total}, and ${total} − ${given} = ${left} stickers.`,
    };
  }
  /* a remainder: round up for enough, or keep only full groups */
  let n, d;
  do {
    d = R(3, 9);
    n = R(20, 99);
  } while (n % d === 0);
  const quotient = Math.floor(n / d),
    left = n % d,
    up = variant === 1,
    answer = up ? quotient + 1 : quotient;
  return {
    kind: "num",
    unit: up ? "tables" : "bags",
    answer,
    facts: { t: "remainder", n, d, up },
    prompt: up
      ? `${n} families come to the prize tent. Each table seats ${d} families. How many tables are needed so every family has a seat?`
      : `The tent has ${n} prizes. Each prize bag gets ${d} prizes. How many full bags can it make?`,
    misc: miscOf(answer, [
      [
        up ? quotient : quotient + 1,
        up
          ? `${quotient} tables seat only ${quotient * d}. The other ${left} ${left === 1 ? "family needs" : "families need"} a table too.`
          : `${quotient + 1} bags would need ${(quotient + 1) * d} prizes. Only full bags count.`,
      ],
      [left, `${left} is the remainder. The question asks how many ${up ? "tables" : "bags"}.`],
    ]).filter(([wrong]) => wrong !== answer),
    hint: `${n} ÷ ${d} = ? R ?. Then decide what the remainder means.`,
    explain: `${n} ÷ ${d} = ${quotient} R ${left}. ${up ? `The ${left} left over ${left === 1 ? "needs" : "need"} one more table: ${answer}.` : `Only full bags count: ${answer}.`}`,
  };
}

/* ---------- Guessing Jar: estimate (Lesson 10) ---------- */
function genEstimate() {
  const variant = R(0, 1);
  if (variant === 0) {
    /* the best estimate of a product */
    let a, b;
    do {
      a = R(21, 89);
      b = R(21, 89);
    } while (a % 10 === 0 || b % 10 === 0 || Math.abs(a - roundTo(a, 10)) > 2 || Math.abs(b - roundTo(b, 10)) > 2);
    const estimate = roundTo(a, 10) * roundTo(b, 10);
    return {
      ...mcOf([
        [commas(estimate), null],
        [
          commas(estimate / 10),
          `${roundTo(a, 10)} × ${roundTo(b, 10)} is tens times tens: hundreds. That’s 10 times too small.`,
        ],
        [
          commas(estimate * 10),
          `${roundTo(a, 10)} × ${roundTo(b, 10)} = ${commas(estimate)}. That’s 10 times too big.`,
        ],
      ]),
      facts: { t: "bestEstimate", a, b },
      prompt: `About how many jelly beans fill ${a} jars of ${b} beans? Which is the best estimate?`,
      hint: `Round both numbers to the nearest ten, then multiply.`,
      explain: `${a} is about ${roundTo(a, 10)} and ${b} is about ${roundTo(b, 10)}. ${roundTo(a, 10)} × ${roundTo(b, 10)} = ${commas(estimate)}.`,
    };
  }
  /* round each number to a place, then add */
  const unit = pick([100, 1000]);
  let a, b;
  do {
    a = R(11, 89) * (unit / 10) + R(0, 9);
    b = R(11, 89) * (unit / 10) + R(0, 9);
  } while (roundTo(a, unit) === a || roundTo(b, unit) === b || a % (unit / 10) === 0);
  const estimate = roundTo(a, unit) + roundTo(b, unit);
  return {
    kind: "num",
    unit: "",
    answer: estimate,
    facts: { t: "roundAdd", a, b, unit },
    prompt: `Estimate ${commas(a)} + ${commas(b)} by rounding each number to the nearest ${unit === 100 ? "hundred" : "thousand"}.`,
    misc: miscOf(estimate, [
      [a + b, `That’s the exact sum. Round first: ${commas(roundTo(a, unit))} + ${commas(roundTo(b, unit))}.`],
    ]).filter(([wrong]) => wrong !== estimate),
    hint: `Round ${commas(a)} and ${commas(b)} to the nearest ${unit === 100 ? "hundred" : "thousand"} first.`,
    explain: `${commas(a)} rounds to ${commas(roundTo(a, unit))} and ${commas(b)} rounds to ${commas(roundTo(b, unit))}. ${commas(roundTo(a, unit))} + ${commas(roundTo(b, unit))} = ${commas(estimate)}.`,
  };
}

/* ---------- Grand Finale: the final round ---------- */
const genBoss = () => pick([genFractions, genAlgorithms, genCompare, genProblems, genEstimate])();

const ZONES = [
  {
    id: "fractions",
    name: "Pie Booth",
    lessons: "Lessons 1–3",
    blurb: "Add, subtract, and multiply fractions, and pick the operation a story needs.",
    gen: genFractions,
  },
  {
    id: "algorithms",
    name: "Ring Toss",
    lessons: "Lessons 4–6",
    blurb: "Add, subtract, multiply, and divide big numbers.",
    gen: genAlgorithms,
  },
  {
    id: "compare",
    name: "Ferris Wheel",
    lessons: "Lesson 7",
    blurb: "Solve “times as many” problems with tape diagrams.",
    gen: genCompare,
  },
  {
    id: "problems",
    name: "Prize Tent",
    lessons: "Lesson 8",
    blurb: "Solve problems with two steps, and decide what a remainder means.",
    gen: genProblems,
  },
  {
    id: "estimate",
    name: "Guessing Jar",
    lessons: "Lesson 10",
    blurb: "Round to friendly numbers to estimate.",
    gen: genEstimate,
  },
  {
    id: "boss",
    name: "Grand Finale",
    lessons: "All lessons",
    blurb: "End the year with a bang! Every right answer sets off one of 10 fireworks.",
    gen: genBoss,
  },
];

/* the fireworks: 10 bursts, `lit` of them going off (the boss icon sets off all of them) */
const fireworks = (lit) =>
  [
    [12, 14],
    [30, 10],
    [50, 16],
    [20, 28],
    [42, 30],
    [10, 42],
    [32, 40],
    [54, 42],
    [22, 52],
    [44, 54],
  ]
    .map(([x, y], i) =>
      i < lit
        ? `<g stroke="${["#ffc93c", "#7fe3ff", "#ff8ac4", "#5fe0a8"][i % 4]}" stroke-width="2" stroke-linecap="round">${range(
            6,
          )
            .map((k) => {
              const angle = (k * Math.PI) / 3;
              return `<line x1="${x + 2 * Math.cos(angle)}" y1="${y + 2 * Math.sin(angle)}" x2="${(x + 6 * Math.cos(angle)).toFixed(1)}" y2="${(y + 6 * Math.sin(angle)).toFixed(1)}"/>`;
            })
            .join("")}</g>`
        : `<circle cx="${x}" cy="${y}" r="2" fill="rgba(255,255,255,.18)"/>`,
    )
    .join("");
const ICON = {
  fractions:
    '<circle cx="32" cy="34" r="22" fill="#c98a4b" stroke="#0a2340" stroke-width="1.5"/><path d="M32,34L32,12A22,22 0 0,1 54,34Z" fill="#ffc93c" stroke="#0a2340" stroke-width="1.5"/><path d="M32,34L54,34A22,22 0 0,1 32,56Z" fill="#ff9ec7" stroke="#0a2340" stroke-width="1.5"/>',
  algorithms:
    '<path d="M32,56V24" stroke="#c98a4b" stroke-width="3"/><ellipse cx="32" cy="48" rx="16" ry="5" fill="none" stroke="#ffc93c" stroke-width="3"/><ellipse cx="32" cy="38" rx="14" ry="4.5" fill="none" stroke="#7fe3ff" stroke-width="3"/><ellipse cx="32" cy="18" rx="12" ry="4" fill="none" stroke="#ff8ac4" stroke-width="3"/>',
  compare:
    '<circle cx="32" cy="28" r="20" fill="none" stroke="#f3f6fb" stroke-width="2"/><g fill="#ffc93c"><circle cx="32" cy="8" r="4"/><circle cx="52" cy="28" r="4"/><circle cx="32" cy="48" r="4"/><circle cx="12" cy="28" r="4"/></g><path d="M32,28L22,58M32,28L42,58" stroke="#f3f6fb" stroke-width="2"/>',
  problems:
    '<path d="M6,54L32,12L58,54Z" fill="#ff7b7b" stroke="#0a2340" stroke-width="1.5"/><path d="M19,54L32,32L45,54" fill="#f3f6fb" stroke="#0a2340" stroke-width="1.5"/><path d="M32,12V4" stroke="#f3f6fb" stroke-width="2"/><path d="M32,4L40,7L32,10" fill="#ffc93c"/>',
  estimate:
    '<path d="M18,14H46V20Q54,24 54,34V54Q54,58 50,58H14Q10,58 10,54V34Q10,24 18,20Z" fill="rgba(127,227,255,.25)" stroke="#7fe3ff" stroke-width="2"/><g fill="#ff8ac4"><circle cx="20" cy="50" r="3"/><circle cx="28" cy="52" r="3"/><circle cx="36" cy="50" r="3"/><circle cx="44" cy="52" r="3"/><circle cx="24" cy="44" r="3"/><circle cx="32" cy="44" r="3"/><circle cx="40" cy="44" r="3"/></g><text x="32" y="36" fill="#ffc93c" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">?</text>',
  boss: fireworks(10),
};
