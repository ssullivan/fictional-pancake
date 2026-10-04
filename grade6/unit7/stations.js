/* Expedition Zero (Grade 6 Unit 7): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs,
   after figs.js (number lines, planes, fmt, money), shared/algebra.js (coordinate planes, letters for numbers), and
   shared/multiply.js (factors). Every problem carries
   facts for checks.js: its type (t) and the numbers its real-world checks need. Each generator deals one of a few kinds of
   problem (type), each with a comment saying what it asks. Numbers are written with fmt, so negatives get a true minus sign. */
const WHO = ["Lin", "Andre", "Priya", "Diego", "Jada", "Noah", "Mai", "Kiran", "Elena", "Han", "Clare", "Tyler"];
/* text with its first letter a capital */
const capital = (text) => text[0].toUpperCase() + text.slice(1);
/* a num problem: typed answers may be negative (the full keyboard), and its named mistakes leave out any that land on the
   answer, and any repeats */
function numP(p) {
  const misc = (p.misc || []).filter(([v]) => Number.isFinite(v) && Math.abs(v - p.answer) >= 0.02);
  return { kind: "num", unit: "", neg: true, ...p, misc: miscOf(p.answer, misc) };
}
/* an mc problem from [[label, why it's wrong, or null for the answer], …], leaving out wrong choices that repeat a label */
function mcP(list, p) {
  const kept = list.filter(([label], i) => list.findIndex(([other]) => other === label) === i);
  return { ...mcOf(kept, { stack: p.stack }), ...p };
}
/* a point problem: the answer is [x, y], typed as ( x , y ); its named mistakes leave out any that are the answer, or repeat */
function pointP(p) {
  const [x, y] = p.answer,
    pmisc = (p.pmisc || []).filter(
      ([[u, v]], i, list) => !(u === x && v === y) && list.findIndex(([[a, b]]) => a === u && b === v) === i,
    );
  return { kind: "pair", point: true, labels: ["x", "y"], ...p, pmisc };
}
/* a random whole number from a to b that isn't 0 */
const R0 = (a, b) => {
  let v;
  do v = R(a, b);
  while (v === 0);
  return v;
};

/* ---------- Station 1: positive and negative numbers on the number line (Lessons 1–2) ---------- */
/* three number lines: whole numbers (only 0 and the ends numbered), halves, and quarters (whole numbers numbered) */
const LINES = [
  { lo: -8, hi: 8, step: 1, lab: (v) => v === 0 || Math.abs(v) === 8 },
  { lo: -4, hi: 4, step: 0.5, lab: () => true },
  { lo: -2, hi: 2, step: 0.25, lab: () => true },
];
/* a tick on one of the number lines that isn't 0 or an end, and not a whole number on the halves and quarters lines */
function tickOn(line) {
  const ticks = range(Math.round((line.hi - line.lo) / line.step) + 1)
    .map((i) => Math.round((line.lo + i * line.step) * 1e6) / 1e6)
    .filter((v) => v !== 0 && Math.abs(v) !== line.hi && (line.step === 1 || !Number.isInteger(v)));
  return pick(ticks);
}
/* places and things for signed numbers in the world: how a number reads, and what its sign means */
const SIGNED = [
  {
    id: "temp",
    say: (v) => `The temperature at dawn was ${fmt(Math.abs(v))} °C ${v < 0 ? "below" : "above"} zero.`,
    ask: "What number is that temperature, in °C?",
    values: () => R0(-15, 12),
    unit: "°C",
    fig: (v) =>
      v === null
        ? vLine(-20, 20, { every: 5, unit: "°", kind: "temp", label: "Thermometer from −20 °C to 20 °C" })
        : vLine(-20, 20, { every: 5, unit: "°", kind: "temp", value: v, label: `Thermometer at ${fmt(v)} °C` }),
    sign: "Below zero is negative and above zero is positive.",
  },
  {
    id: "elev",
    say: (v) =>
      v < 0
        ? `A submarine is ${fmt(-v)} meters below sea level.`
        : `A lighthouse lamp is ${fmt(v)} meters above sea level.`,
    ask: "What number is its elevation, in meters?",
    values: () => (Math.random() < 0.7 ? -10 * R(2, 40) : 10 * R(2, 9)),
    unit: "m",
    fig: (v) =>
      vLine(-400, 100, {
        every: 100,
        step: 50,
        unit: "",
        kind: "sea",
        pts: v === null ? [] : [{ v, t: `${fmt(v)} m` }],
        label: v === null ? "Elevations from −400 to 100 meters, with sea level at 0" : `Elevation at ${fmt(v)} meters`,
      }),
    sign: "Sea level is 0. Below sea level is negative and above it is positive.",
  },
  {
    id: "bank",
    say: (v) =>
      v < 0
        ? `Jada takes ${money(-v)} out of a bank account (a withdrawal).`
        : `Jada puts ${money(v)} into a bank account (a deposit).`,
    ask: "What number shows that change to the account, in dollars?",
    values: () => (Math.random() < 0.65 ? -5 * R(2, 16) : 5 * R(2, 16)),
    unit: "dollars",
    fig: (v) =>
      vLine(-80, 80, {
        every: 20,
        step: 10,
        kind: "money",
        pts: v === null ? [] : [{ v, t: money(v) }],
        label: v === null ? "Money from −$80 to $80" : `A change of ${money(v)}`,
      }),
    sign: "Money put in (a deposit) is positive and money taken out (a withdrawal) is negative.",
  },
];
function genLine() {
  const type = pick(["tap", "tap", "read", "read", "opp", "signed", "signed"]);
  if (type === "tap") {
    /* tap the tick for a number; the opposite tick is a named mistake */
    const line = pick(LINES),
      v = tickOn(line),
      whole = Math.floor(Math.abs(v)),
      asked = line.step === 0.5 && Math.random() < 0.5 ? `${v < 0 ? "−" : ""}${whole ? whole + " " : ""}1/2` : fmt(v);
    return {
      kind: "tap",
      prompt: `Tap the tick for <b>${asked}</b> on the number line.`,
      answer: String(v),
      why: {
        [String(-v)]:
          `That’s ${fmt(-v)}, the opposite of ${fmt(v)}: the same distance from 0, on the other side. ${v < 0 ? "Negative numbers are to the left of 0." : "Positive numbers are to the right of 0."}`,
      },
      fig: (show) =>
        signedLine(line.lo, line.hi, {
          step: line.step,
          lab: line.lab,
          tap: "cand",
          pts: show ? [{ v, cls: "b", t: fmt(v) }] : [],
          label: `Number line from ${fmt(line.lo)} to ${fmt(line.hi)} with ticks every ${fmt(line.step)}`,
        }),
      hint: `${v < 0 ? "Negative numbers are to the left of 0." : "Positive numbers are to the right of 0."} Each tick is ${fmt(line.step)}, so count ${Math.round(Math.abs(v) / line.step)} ticks from 0.`,
      explain: `${fmt(v)} is ${fmt(Math.abs(v))} ${v < 0 ? "to the left" : "to the right"} of 0: ${Math.round(Math.abs(v) / line.step)} ticks of ${fmt(line.step)}.`,
      facts: { t: type, line: [line.lo, line.hi], v },
    };
  }
  if (type === "read") {
    /* what number a point is at, with its number left off the line */
    const line = pick(LINES),
      v = tickOn(line),
      ticksFrom0 = Math.round(Math.abs(v) / line.step);
    return numP({
      prompt: "What number is the point at?",
      answer: v,
      fig: (show) =>
        signedLine(line.lo, line.hi, {
          step: line.step,
          lab: (w) => (show ? line.lab(w) : line.lab(w) && w !== v),
          pts: [{ v, t: show ? fmt(v) : "?" }],
          label: `Number line from ${fmt(line.lo)} to ${fmt(line.hi)} with a point ${ticksFrom0} ticks ${v < 0 ? "left" : "right"} of 0`,
        }),
      hint: `Each tick is ${fmt(line.step)}. The point is ${ticksFrom0} ticks ${v < 0 ? "to the left" : "to the right"} of 0${v < 0 ? ", so it’s negative" : ""}.`,
      misc: [
        [
          -v,
          v < 0
            ? `The point is to the left of 0, so its number is negative: ${fmt(v)}.`
            : `The point is to the right of 0, so its number is positive.`,
        ],
        ...(line.step === 1
          ? []
          : [
              [
                Math.sign(v) * ticksFrom0,
                `That counts each tick as 1. Each tick here is ${fmt(line.step)}, so ${ticksFrom0} ticks is ${fmt(Math.abs(v))}.`,
              ],
            ]),
      ],
      explain: `The point is ${ticksFrom0} ticks of ${fmt(line.step)} ${v < 0 ? "to the left" : "to the right"} of 0, so it’s at ${fmt(v)}.`,
      facts: { t: type, line: [line.lo, line.hi], v },
    });
  }
  if (type === "opp") {
    /* the opposite of a number, or the opposite of its opposite */
    const v = pick([R0(-12, 12), R0(-9, 9) + pick([0.5, -0.5]), pick([-1, 1]) * pick([0.25, 0.75, 1.5, 2.5, 3.25])]),
      twice = Math.random() < 0.3;
    const answer = twice ? v : -v;
    return numP({
      prompt: twice
        ? `What is the opposite of the opposite of ${fmt(v)}?`
        : `What is the opposite of <b>${fmt(v)}</b>?`,
      answer,
      fig: (show) =>
        signedLine(-Math.ceil(Math.abs(v)) - 1, Math.ceil(Math.abs(v)) + 1, {
          step: Math.abs(v) < 4 ? 0.25 : Math.abs(v) < 8 ? 0.5 : 1,
          every: Math.abs(v) < 8 ? 1 : 2,
          pts: [{ v, t: fmt(v) }, ...(show ? [{ v: -v, cls: "b", t: fmt(-v) }] : [])],
          spans: show
            ? [
                { a: Math.min(0, v), b: Math.max(0, v), t: fmt(Math.abs(v)) },
                { a: Math.min(0, -v), b: Math.max(0, -v), t: fmt(Math.abs(v)) },
              ]
            : [],
          label: `Number line with a point at ${fmt(v)}`,
        }),
      hint: "Opposites are the same distance from 0, on opposite sides of it.",
      misc: twice
        ? [[-v, `The opposite of ${fmt(v)} is ${fmt(-v)}, and the opposite of that goes back to ${fmt(v)}.`]]
        : [[v, `That’s the same number. Its opposite is the same distance from 0 on the other side of 0.`]],
      explain: twice
        ? `The opposite of ${fmt(v)} is ${fmt(-v)}. The opposite of ${fmt(-v)} is ${fmt(v)}: back where it started.`
        : `${fmt(v)} is ${fmt(Math.abs(v))} from 0. Its opposite, ${fmt(-v)}, is ${fmt(Math.abs(v))} from 0 on the other side.`,
      facts: { t: type, v },
    });
  }
  /* a temperature, an elevation, or a bank deposit or withdrawal as a signed number */
  const story = pick(SIGNED),
    v = story.values();
  return numP({
    prompt: `${story.say(v)} ${story.ask}`,
    answer: v,
    unit: story.unit,
    fig: (show) => story.fig(show ? v : null),
    hint: story.sign,
    misc: [[-v, `${story.sign} So this one is ${v < 0 ? "negative" : "positive"}: ${fmt(v)}.`]],
    explain: `${story.sign} ${story.say(v)} That’s ${fmt(v)} ${story.unit}.`,
    facts: {
      t: type,
      ...(story.id === "temp" ? { temp: [[v, "C"]] } : story.id === "elev" ? { elev: [v] } : { money: [v] }),
    },
  });
}

/* ---------- Station 2: comparing and ordering (Lessons 3–5) ---------- */
/* two different numbers, at least one negative: whole numbers, halves, or quarters */
function twoSigned() {
  let a, b;
  do {
    const kind = pick(["whole", "whole", "half", "quarter"]);
    if (kind === "whole") {
      a = R(-12, 9);
      b = R(-12, 9);
    } else if (kind === "half") {
      a = R(-16, 10) / 2;
      b = R(-16, 10) / 2;
    } else {
      a = R(-12, 8) / 4;
      b = R(-12, 8) / 4;
    }
  } while (a === b || (a >= 0 && b >= 0));
  return [a, b];
}
/* a line from a little below the least of the numbers (or 0) to a little above the greatest, with dots at them, named by
   names (bare: no dots, just the line to think with). Wide ranges count by 5s, 10s, or 50s; a dot's name is raised a level
   when it would run into the one before. */
function lineFor(nums, { names = nums.map(fmt), bare = false, label } = {}) {
  const least = Math.min(...nums, 0),
    greatest = Math.max(...nums, 0),
    spread = greatest - least,
    scale = spread <= 16 ? 1 : spread <= 40 ? 5 : spread <= 100 ? 10 : 50,
    lo = Math.floor(least / scale) * scale - scale,
    hi = Math.ceil(greatest / scale) * scale + scale,
    fine = nums.every(Number.isInteger) ? 1 : nums.every((v) => Number.isInteger(v * 2)) ? 0.5 : 0.25,
    step = scale > 1 ? scale : hi - lo > 12 && fine < 1 ? 0.5 : fine,
    every = scale > 1 ? scale * ((hi - lo) / scale > 12 ? 2 : 1) : hi - lo > 16 ? 2 : 1,
    /* about 9 pixels a character, on a line 392 pixels long */
    pixelsApart = (a, b) => (Math.abs(a - b) * 392) / (hi - lo),
    order = nums.map((v, i) => i).sort((i, j) => nums[i] - nums[j]),
    level = {};
  order.forEach((i, k) => {
    const before = order[k - 1];
    level[i] =
      k && !level[before] && pixelsApart(nums[i], nums[before]) < 5 * (names[i].length + names[before].length) ? 1 : 0;
  });
  return signedLine(lo, hi, {
    step,
    every,
    pts: bare ? [] : nums.map((v, i) => ({ v, cls: i % 2 ? "b" : "", t: names[i], lv: level[i] })),
    label: bare
      ? `Number line from ${fmt(lo)} to ${fmt(hi)}`
      : label || `Number line with points at ${nums.map(fmt).join(", ")}`,
  });
}
/* places to compare: which is colder or warmer, deeper or higher, owes more or has more. least and most are the words for the
   least and the greatest, and why(name, v) says what a value means */
const COMPARE = [
  {
    id: "cold",
    things: ["Fairbanks", "Nome", "Duluth", "Fargo", "Bismarck", "Minot"],
    values: () => [-R(2, 9) * 2, -R(1, 7), R(1, 9)],
    show: (v) => `${fmt(v)} °F`,
    least: "coldest",
    most: "warmest",
    intro: "At 6 a.m. on a winter morning, the temperatures were:",
    why: (name, v) => `${name} was ${v < 0 ? `${fmt(-v)} degrees below zero` : `${fmt(v)} degrees above zero`}`,
  },
  {
    id: "deep",
    things: ["a submarine", "a whale", "a sea turtle", "a diver", "a shark", "a pelican"],
    values: () => [-R(8, 25) * 10, -R(2, 7) * 10, R(1, 5) * 5],
    show: (v) => `${fmt(v)} m`,
    least: "deepest (lowest)",
    most: "highest",
    intro: "Elevations, in meters, compared with sea level:",
    why: (name, v) => `${name} is ${v < 0 ? `${fmt(-v)} m below` : `${fmt(v)} m above`} sea level`,
  },
  {
    id: "bank",
    things: WHO,
    values: () => [-R(4, 12) * 5, -R(1, 3) * 5, R(2, 8) * 5],
    show: (v) => money(v),
    least: "most in debt",
    most: "richest",
    intro: "Bank account balances (a negative balance means owing the bank money):",
    why: (name, v) => (v < 0 ? `${name} owes ${money(-v)}` : `${name} has ${money(v)}`),
  },
];
/* three different numbers from values(), least first */
function distinctSorted(values) {
  let nums;
  do nums = values().sort((x, y) => x - y);
  while (new Set(nums).size < nums.length);
  return nums;
}
function genCompare() {
  const type = pick(["symbol", "symbol", "order", "statement", "context", "context"]);
  if (type === "symbol") {
    /* < > or = between two signed numbers */
    const [a, b] = twoSigned(),
      right = a < b ? "<" : ">",
      wrong = right === "<" ? ">" : "<",
      bothNeg = a < 0 && b < 0;
    const signWhy =
      bothNeg && Math.abs(a) !== Math.abs(b)
        ? `${fmt(Math.abs(Math.min(a, b)))} is more than ${fmt(Math.abs(Math.max(a, b)))}, but ${fmt(Math.min(a, b))} is farther left on the number line, so it’s less.`
        : `${fmt(Math.min(a, b))} is to the left of ${fmt(Math.max(a, b))} on the number line, so it’s less.`;
    return mcP(
      [
        [right, null],
        [wrong, signWhy],
        ["=", `${fmt(a)} and ${fmt(b)} are different numbers, at different places on the number line.`],
      ],
      {
        prompt: `Which symbol makes this true?<br><b>${fmt(a)} ☐ ${fmt(b)}</b>`,
        fig: (show) => lineFor([a, b], { bare: !show }),
        hint: "On a number line, the number farther right is greater. Picture both numbers on the line.",
        explain: `${fmt(Math.min(a, b))} is to the left of ${fmt(Math.max(a, b))}, so ${fmt(a)} ${right} ${fmt(b)}.`,
        facts: { t: type, nums: [a, b] },
      },
    );
  }
  if (type === "order") {
    /* four numbers, least to greatest; ordering by distance from 0 (ignoring signs) and greatest to least are the mistakes */
    let nums;
    do {
      nums = [R(-9, -1) - pick([0, 0.5]), R(-9, -1) - pick([0, 0.5, 0.25]), R(-2, 6) + pick([0, 0.5]), R(0, 8)];
    } while (new Set(nums.map((v) => Math.abs(v))).size < 4);
    const sorted = nums.slice().sort((x, y) => x - y),
      byDistance = nums.slice().sort((x, y) => Math.abs(x) - Math.abs(y)),
      list = (arr) => arr.map(fmt).join(", ");
    return mcP(
      [
        [list(sorted), null],
        [
          list(byDistance),
          "That’s in order of distance from 0, ignoring the signs. A negative number is less the farther it is from 0.",
        ],
        [list(sorted.slice().reverse()), "That’s greatest to least. Least comes first: the one farthest left."],
      ],
      {
        prompt: `Which list puts these numbers in order from least to greatest?<br><b>${list(shuffle(nums))}</b>`,
        stack: true,
        fig: (show) => lineFor(sorted, { bare: !show }),
        hint: "Put the numbers on a number line. Least to greatest is left to right.",
        explain: `Left to right on the number line: ${list(sorted)}.`,
        facts: { t: type, nums },
      },
    );
  }
  if (type === "statement") {
    /* which statement is true: the same comparison written both ways is true, its reverse is false */
    const [a, b] = twoSigned(),
      least = Math.min(a, b),
      most = Math.max(a, b),
      trueOne = Math.random() < 0.5 ? `${fmt(least)} < ${fmt(most)}` : `${fmt(most)} > ${fmt(least)}`;
    return mcP(
      [
        [trueOne, null],
        [
          `${fmt(least)} > ${fmt(most)}`,
          `${fmt(least)} is to the left of ${fmt(most)}, so it’s less, not greater.${least < 0 && most < 0 ? ` (${fmt(-least)} > ${fmt(-most)}, but the negatives go the other way.)` : ""}`,
        ],
        [
          `${fmt(most)} < ${fmt(least)}`,
          `That says ${fmt(most)} is less than ${fmt(least)}. It’s greater: it’s farther right.`,
        ],
      ],
      {
        prompt: "Which statement is true?",
        fig: (show) => lineFor([a, b], { bare: !show }),
        hint: "The symbol opens toward the greater number. Which of the two is farther right on a number line?",
        explain: `${fmt(least)} is to the left of ${fmt(most)}: ${fmt(least)} < ${fmt(most)}, which says the same as ${fmt(most)} > ${fmt(least)}.`,
        facts: { t: type, nums: [a, b] },
      },
    );
  }
  /* coldest, deepest, or most in debt (the least), or warmest, highest, or richest (the greatest), of three */
  const place = pick(COMPARE),
    names = shuffle(place.things).slice(0, 3),
    values = distinctSorted(place.values),
    askLeast = Math.random() < 0.7,
    order = shuffle([0, 1, 2]),
    target = askLeast ? 0 : 2;
  const lines = order.map((i) => `${names[i]}: ${place.show(values[i])}`).join("<br>");
  return mcP(
    [0, 1, 2].map((i) => [
      names[i],
      i === target
        ? null
        : askLeast
          ? `${capital(place.why(names[i], values[i]))}, but ${place.why(names[0], values[0])}: farther below 0, so ${place.show(values[0])} is the least.`
          : `${capital(place.why(names[i], values[i]))}, but ${place.why(names[2], values[2])}: farther right on the number line, so ${place.show(values[2])} is the greatest.`,
    ]),
    {
      prompt: `${place.intro}<br>${lines}<br>Which is <b>${askLeast ? place.least : place.most}</b>?`,
      fig: (show) =>
        lineFor(
          order.map((i) => values[i]),
          { names: order.map((i) => names[i]), bare: !show },
        ),
      hint: askLeast
        ? "The least number is the farthest left on a number line: the farthest below zero."
        : "The greatest number is the farthest right on a number line.",
      explain: `${place.show(values[target])} is the ${askLeast ? "least" : "greatest"} of the three numbers, the farthest ${askLeast ? "left" : "right"} on a number line: ${names[target]}.`,
      facts: {
        t: type,
        ...(place.id === "cold"
          ? { temp: values.map((v) => [v, "F"]) }
          : place.id === "deep"
            ? { elev: values }
            : { money: values }),
      },
    },
  );
}

/* ---------- Station 3: absolute value (Lessons 6–7) ---------- */
function genAbs() {
  const type = pick(["value", "value", "farthest", "both", "owe", "owe", "compare"]);
  if (type === "value") {
    /* the absolute value of a number (mostly negative) */
    const v = pick([-R(1, 20), -R(1, 9) - 0.5, -pick([0.25, 0.75, 1.25, 2.75]), R(2, 15) + pick([0, 0.5])]);
    return numP({
      prompt: `What is <b>${abs(v)}</b>?`,
      answer: Math.abs(v),
      fig: (show) =>
        signedLine(-Math.ceil(Math.abs(v)) - 1, Math.ceil(Math.abs(v)) + 1, {
          step: Math.abs(v) < 4 ? 0.25 : Math.abs(v) < 8 ? 0.5 : 1,
          every: Math.abs(v) < 8 ? 1 : 5,
          pts: [{ v, t: fmt(v) }],
          spans: show ? [{ a: Math.min(0, v), b: Math.max(0, v), t: `${fmt(Math.abs(v))} from 0` }] : [],
          label: `Number line with a point at ${fmt(v)}`,
        }),
      hint: "The absolute value of a number is its distance from 0. A distance is never negative.",
      misc:
        v < 0
          ? [[v, `Absolute value is a distance from 0, so it’s never negative. ${fmt(v)} is ${fmt(-v)} from 0.`]]
          : [[-v, `${fmt(v)} is ${fmt(v)} from 0, so ${abs(v)} = ${fmt(v)}. Absolute value is never negative.`]],
      explain: `${fmt(v)} is ${fmt(Math.abs(v))} units from 0, so ${abs(v)} = ${fmt(Math.abs(v))}.`,
      facts: { t: type, v },
    });
  }
  if (type === "farthest") {
    /* which of three numbers is farthest from (or closest to) 0: a greater number isn't always farther */
    let nums;
    do nums = [-R(3, 12), R(2, 11), pick([-1, 1]) * (R(1, 6) + 0.5)];
    while (new Set(nums.map((v) => Math.abs(v))).size < 3);
    const far = Math.random() < 0.7,
      byDistance = nums.slice().sort((x, y) => Math.abs(x) - Math.abs(y)),
      target = far ? byDistance[2] : byDistance[0];
    return mcP(
      nums.map((v) => [
        fmt(v),
        v === target
          ? null
          : `${fmt(v)} is ${fmt(Math.abs(v))} from 0, and ${fmt(target)} is ${fmt(Math.abs(target))} from 0.${far && v > target ? ` ${fmt(v)} is greater, but greater isn’t the same as farther from 0.` : ""}`,
      ]),
      {
        prompt: `Which number is <b>${far ? "farthest from" : "closest to"} 0</b>?`,
        fig: (show) => lineFor(nums, { bare: !show }),
        hint: "Distance from 0 is the absolute value. Ignore the sign and compare the distances.",
        explain: `Distances from 0: ${nums.map((v) => `${abs(v)} = ${fmt(Math.abs(v))}`).join(", ")}. ${fmt(target)} is ${far ? "farthest" : "closest"}.`,
        facts: { t: type, nums },
      },
    );
  }
  if (type === "both") {
    /* which numbers have a given absolute value: a number and its opposite */
    const d = pick([R(2, 15), R(1, 9) + 0.5]);
    return mcP(
      [
        [`${fmt(d)} and ${fmt(-d)}`, null],
        [`only ${fmt(d)}`, `${fmt(-d)} is ${fmt(d)} from 0 too, on the other side. So ${abs(-d)} = ${fmt(d)} as well.`],
        [`only ${fmt(-d)}`, `${fmt(d)} is also ${fmt(d)} from 0, so ${abs(d)} = ${fmt(d)} too.`],
      ],
      {
        prompt: `Which numbers have an absolute value of <b>${fmt(d)}</b>?`,
        fig: (show) =>
          signedLine(-Math.ceil(d) - 1, Math.ceil(d) + 1, {
            step: Number.isInteger(d) ? 1 : 0.5,
            every: d > 8 ? 5 : 1,
            pts: show
              ? [
                  { v: -d, t: fmt(-d), cls: "b" },
                  { v: d, t: fmt(d) },
                ]
              : [],
            spans: show
              ? [
                  { a: -d, b: 0, t: fmt(d) },
                  { a: 0, b: d, t: fmt(d) },
                ]
              : [],
            label: show
              ? `Number line: ${fmt(-d)} and ${fmt(d)} are both ${fmt(d)} from 0`
              : `Number line from ${fmt(-Math.ceil(d) - 1)} to ${fmt(Math.ceil(d) + 1)}`,
          }),
        hint: `Look for every number that is ${fmt(d)} away from 0. There’s one on each side.`,
        explain: `${fmt(d)} and ${fmt(-d)} are both ${fmt(d)} from 0: ${abs(d)} = ${fmt(d)} and ${abs(-d)} = ${fmt(d)}.`,
        facts: { t: type, v: d },
      },
    );
  }
  if (type === "owe") {
    /* a debt or a depth: the amount is the absolute value of the signed number */
    const name = pick(WHO);
    if (Math.random() < 0.55) {
      const balance = -5 * R(2, 30);
      return numP({
        prompt: `${name}’s bank account has a balance of ${money(balance)}. How many dollars does ${name} owe the bank?`,
        answer: -balance,
        unit: "dollars",
        hint: "A negative balance is a debt. The amount owed is how far the balance is below 0.",
        misc: [
          [
            balance,
            `A debt is an amount of money, so it’s positive. A balance of ${money(balance)} means owing ${money(-balance)}.`,
          ],
        ],
        explain: `${money(balance)} is ${fmt(-balance)} dollars below 0: ${abs(balance)} = ${fmt(-balance)}. ${name} owes ${money(-balance)}.`,
        facts: { t: type, money: [balance] },
      });
    }
    const elev = -R(3, 40),
      who = pick(["A diver", "A snorkeler", "A fish"]);
    return numP({
      prompt: `${who} is at an elevation of ${fmt(elev)} meters. How many meters below the surface of the water is that?`,
      answer: -elev,
      unit: "meters",
      fig: (show) =>
        vLine(-40, 10, {
          every: 10,
          step: 5,
          kind: "sea",
          pts: show ? [{ v: elev, t: `${fmt(elev)} m` }] : [],
          label: show ? `Elevation ${fmt(elev)} meters` : "Elevations from −40 to 10 meters, with sea level at 0",
        }),
      hint: "The surface (sea level) is 0. A distance below it is the absolute value of the elevation.",
      misc: [[elev, `A distance is never negative. ${fmt(elev)} m is ${fmt(-elev)} m below the surface.`]],
      explain: `${fmt(elev)} is ${fmt(-elev)} from 0: ${abs(elev)} = ${fmt(-elev)}, so ${fmt(-elev)} meters below the surface.`,
      facts: { t: type, elev: [elev] },
    });
  }
  /* less, but farther from 0: a comparison of two negatives and of their absolute values */
  let a, b;
  do {
    a = -R(2, 15);
    b = -R(1, 12);
  } while (a >= b);
  return mcP(
    [
      [`${abs(a)} > ${abs(b)}`, null],
      [
        `${abs(a)} < ${abs(b)}`,
        `${fmt(a)} is less than ${fmt(b)}, but it’s farther from 0: ${abs(a)} = ${fmt(-a)} and ${abs(b)} = ${fmt(-b)}.`,
      ],
      [`${abs(a)} = ${abs(b)}`, `${fmt(a)} and ${fmt(b)} are different distances from 0: ${fmt(-a)} and ${fmt(-b)}.`],
    ],
    {
      prompt: `${fmt(a)} < ${fmt(b)}. Which of these is also true?`,
      fig: (show) => lineFor([a, b], { bare: !show }),
      hint: "Absolute value is distance from 0. Which number is farther from 0?",
      explain: `${fmt(a)} is less (farther left), and it’s also farther from 0: ${abs(a)} = ${fmt(-a)}, ${abs(b)} = ${fmt(-b)}, so ${abs(a)} > ${abs(b)}.`,
      facts: { t: type, nums: [a, b] },
    },
  );
}

/* ---------- Station 4: inequalities (Lessons 8–10) ---------- */
/* whether v is a solution of x (sign) b */
const solves = (v, sign, b) => ({ "<": v < b, ">": v > b, "≤": v <= b, "≥": v >= b })[sign];
/* the symbol with the other kind of circle (< and ≤), and the one pointing the other way (< and >) */
const OTHER_CIRCLE = { "<": "≤", "≤": "<", ">": "≥", "≥": ">" },
  OTHER_WAY = { "<": ">", ">": "<", "≤": "≥", "≥": "≤" };
/* what each symbol says in words */
const SAYS = { "<": "less than", ">": "greater than", "≤": "less than or equal to", "≥": "greater than or equal to" };
/* the graph of x (sign) b on a line from −7 to 7 */
const ineqLine = (sign, b, label) =>
  signedLine(-7, 7, {
    ray: { v: b, dir: sign === ">" || sign === "≥" ? 1 : -1, open: sign === "<" || sign === ">" },
    label,
  });
/* stories with an inequality: the letter, what it stands for, the boundary, the symbol, and the step between ticks on its
   number line */
const LIMITS = [
  {
    letter: "h",
    story: (n) => `To ride the roller coaster, riders must be at least ${n} inches tall.`,
    stands: "a rider’s height in inches",
    values: () => pick([42, 44, 46, 48, 52, 54]),
    sign: "≥",
    step: 1,
    words: "“At least” includes the number itself",
    facts: (n) => ({ height: [n] }),
  },
  {
    letter: "p",
    story: (n) => `The elevator holds no more than ${n} people.`,
    stands: "the number of people in the elevator",
    values: () => pick([8, 10, 12, 15, 16, 20]),
    sign: "≤",
    step: 1,
    words: "“No more than” includes the number itself",
    facts: (n) => ({ count: [n] }),
  },
  {
    letter: "s",
    story: (n) => `Each class must have fewer than ${n} students.`,
    stands: "the number of students in a class",
    values: () => pick([25, 28, 30, 32]),
    sign: "<",
    step: 1,
    words: "“Fewer than” leaves the number itself out",
    facts: (n) => ({ count: [n] }),
  },
  {
    letter: "t",
    story: (n) => `A freezer has to stay at ${fmt(n)} °C or colder.`,
    stands: "the freezer’s temperature in °C",
    values: () => pick([-15, -18, -20]),
    sign: "≤",
    step: 1,
    words: "“Or colder” includes the number itself, and colder is less",
    facts: (n) => ({ temp: [[n, "C"]] }),
  },
  {
    letter: "t",
    story: (n) => `A sleeping bag keeps you warm at temperatures above ${fmt(n)} °C.`,
    stands: "the temperature outside in °C",
    values: () => pick([-5, -10, -12, -15]),
    sign: ">",
    step: 1,
    words: "“Above” leaves the number itself out, and warmer is greater",
    facts: (n) => ({ temp: [[n, "C"]] }),
  },
  {
    letter: "b",
    story: (n) => `The bank lets ${pick(WHO)}’s balance go down to ${money(n)} but no lower.`,
    stands: "the balance in dollars",
    values: () => pick([-20, -25, -50, -100]),
    sign: "≥",
    step: 5,
    words: "“Down to, but no lower” includes the number itself",
    facts: (n) => ({ money: [n] }),
  },
];
function genIneq() {
  const type = pick(["graph", "graph", "solution", "solution", "story", "story", "integer"]);
  if (type === "graph") {
    /* which inequality a graph shows: an open or closed circle, and which way the ray goes */
    const sign = pick(["<", ">", "≤", "≥"]),
      b = R(-5, 5);
    return mcP(
      [
        [ineqText("x", sign, b), null],
        [
          ineqText("x", OTHER_CIRCLE[sign], b),
          sign === "<" || sign === ">"
            ? `The circle at ${fmt(b)} is open, so ${fmt(b)} itself isn’t a solution. ${OTHER_CIRCLE[sign]} would include it (a closed circle).`
            : `The circle at ${fmt(b)} is filled in, so ${fmt(b)} itself is a solution. ${OTHER_CIRCLE[sign]} would leave it out (an open circle).`,
        ],
        [
          ineqText("x", OTHER_WAY[sign], b),
          `The ray points ${sign === "<" || sign === "≤" ? "left, toward the numbers less than" : "right, toward the numbers greater than"} ${fmt(b)}.`,
        ],
      ],
      {
        prompt: "Which inequality matches the graph?",
        fig: () =>
          ineqLine(
            sign,
            b,
            `Graph of an inequality: a${sign === "<" || sign === ">" ? "n open" : " closed"} circle at ${fmt(b)} and a ray to the ${sign === "<" || sign === "≤" ? "left" : "right"}`,
          ),
        hint: "An open circle leaves the number out (< or >); a filled circle includes it (≤ or ≥). The ray points to the solutions.",
        explain: `The ray goes ${sign === "<" || sign === "≤" ? "left" : "right"} from ${fmt(b)}, and the circle is ${sign === "<" || sign === ">" ? "open" : "filled in"}: ${ineqText("x", sign, b)}, x is ${SAYS[sign]} ${fmt(b)}.`,
        facts: { t: type, nums: [b] },
      },
    );
  }
  if (type === "solution") {
    /* which value is a solution: the boundary point, and a number on the wrong side, are the mistakes */
    const sign = pick(["<", ">", "≤", "≥"]),
      b = R(-6, 4),
      up = sign === ">" || sign === "≥",
      inclusive = sign === "≤" || sign === "≥",
      toward = (k) => b + (up ? k : -k),
      away = (k) => b - (up ? k : -k);
    const right = inclusive && Math.random() < 0.5 ? b : toward(pick([1, 2, 0.5, 3])),
      wrong = [inclusive ? away(pick([0.5, 1])) : b, away(pick([2, 3]))];
    const whyNot = (v) =>
      v === b
        ? `${fmt(b)} ${sign} ${fmt(b)} is false: ${sign} leaves out ${fmt(b)} itself (an open circle).`
        : `${fmt(v)} is ${up ? "less" : "greater"} than ${fmt(b)}: ${fmt(v)} ${sign} ${fmt(b)} is false.${b < 0 && v < 0 && Math.abs(v) !== Math.abs(b) ? " Watch the negatives: the one farther left is less." : ""}`;
    return mcP([[fmt(right), null], ...wrong.map((v) => [fmt(v), whyNot(v)])], {
      prompt: `Which value of ${mathVar("x")} is a solution to <b>${ineqText("x", sign, b)}</b>?`,
      fig: (show) =>
        show
          ? ineqLine(sign, b, `Graph of x ${sign} ${fmt(b)}`)
          : signedLine(-7, 7, { label: "Number line from −7 to 7" }),
      hint: `Put each value in for x and see whether it’s ${SAYS[sign]} ${fmt(b)}. Or graph the inequality: solutions are on the ray.`,
      explain: `${fmt(right)} ${sign} ${fmt(b)} is true, so ${fmt(right)} is a solution.`,
      facts: { t: type, nums: [b, right, ...wrong] },
    });
  }
  if (type === "story") {
    /* which inequality says a rule from the world */
    const story = pick(LIMITS),
      n = story.values(),
      letter = story.letter;
    return mcP(
      [
        [ineqText(letter, story.sign, n), null],
        [
          ineqText(letter, OTHER_CIRCLE[story.sign], n),
          `${story.words}, so ${story.sign === "<" || story.sign === ">" ? `${fmt(n)} isn’t allowed` : `${fmt(n)} is allowed`}.`,
        ],
        [
          ineqText(letter, OTHER_WAY[story.sign], n),
          `That points the wrong way: it says ${mathVar(letter)} is ${SAYS[OTHER_WAY[story.sign]]} ${fmt(n)}.`,
        ],
      ],
      {
        prompt: `${story.story(n)} Let ${mathVar(letter)} be ${story.stands}. Which inequality says what’s allowed?`,
        fig: (show) =>
          signedLine(n - 5 * story.step, n + 5 * story.step, {
            step: story.step,
            every: story.step,
            ray: show
              ? {
                  v: n,
                  dir: story.sign === ">" || story.sign === "≥" ? 1 : -1,
                  open: story.sign === "<" || story.sign === ">",
                }
              : null,
            label: show
              ? `Graph of ${letter} ${story.sign} ${fmt(n)}`
              : `Number line from ${fmt(n - 5 * story.step)} to ${fmt(n + 5 * story.step)}`,
          }),
        hint: `${story.words}. Decide if ${fmt(n)} itself is allowed, then which way the allowed values go.`,
        explain: `${story.words}: ${ineqText(letter, story.sign, n)}.`,
        facts: { t: type, ...story.facts(n) },
      },
    );
  }
  /* the greatest or least integer solution of an inequality with a boundary between two integers, or on one */
  const sign = pick(["<", ">", "≤", "≥"]),
    up = sign === ">" || sign === "≥",
    onInteger = Math.random() < 0.4,
    b = onInteger ? R(-8, 6) : R(-8, 6) + 0.5,
    answer = up
      ? onInteger
        ? sign === "≥"
          ? b
          : b + 1
        : Math.ceil(b)
      : onInteger
        ? sign === "≤"
          ? b
          : b - 1
        : Math.floor(b);
  const wrongNext = up ? answer - 1 : answer + 1;
  return numP({
    prompt: `What is the <b>${up ? "least" : "greatest"}</b> integer that is a solution to ${ineqText("x", sign, b)}?`,
    answer,
    fig: (show) =>
      show
        ? ineqLine(sign, b, `Graph of x ${sign} ${fmt(b)}`)
        : signedLine(-9, 7, { label: "Number line from −9 to 7" }),
    hint: `Integers are the whole numbers and their opposites: …, −2, −1, 0, 1, 2, … Find the ${up ? "first" : "last"} one on the ray.`,
    misc: [
      [
        b,
        onInteger
          ? `${fmt(b)} ${sign} ${fmt(b)} is false: ${sign} leaves out ${fmt(b)} itself.`
          : `${fmt(b)} isn’t an integer: it’s halfway between two.`,
      ],
      [
        wrongNext,
        `${fmt(wrongNext)} ${sign} ${fmt(b)} is false: ${fmt(wrongNext)} is ${up ? "less" : "greater"} than ${fmt(b)}.${b < 0 ? " Watch the negatives: farther left is less." : ""}`,
      ],
    ],
    explain: `${fmt(answer)} ${sign} ${fmt(b)} is true, and ${fmt(wrongNext)} ${sign} ${fmt(b)} is false, so ${fmt(answer)} is the ${up ? "least" : "greatest"} integer solution.`,
    facts: { t: type, nums: [b] },
  });
}

/* ---------- Station 5: the coordinate plane (Lessons 11–13) ---------- */
/* the quadrant (I to IV) a point is in, off the axes */
const quadrantOf = (x, y) => (x > 0 ? (y > 0 ? "I" : "IV") : y > 0 ? "II" : "III");
/* a point off the axes, inside −size to size */
const offAxes = (size = 6) => [R0(-size, size), R0(-size, size)];
/* a town map: the origin is the town square; x is blocks east (negative is west) and y blocks north (negative is south) */
const PLACES = ["library", "pool", "school", "bakery", "park", "museum", "fire station", "post office"];
const MAP_WORDS =
  "The origin (0, 0) is the town square. x is blocks east (west is negative), and y is blocks north (south is negative).";
/* how far and which way along each axis, in words */
const walkWords = (x, y) =>
  `${Math.abs(x)} block${Math.abs(x) === 1 ? "" : "s"} ${x < 0 ? "west" : "east"} and ${Math.abs(y)} block${Math.abs(y) === 1 ? "" : "s"} ${y < 0 ? "south" : "north"}`;
function genPlane() {
  const type = pick(["tap", "tap", "read", "read", "quadrant", "map"]);
  if (type === "tap") {
    /* tap the point (x, y): the swapped point and the points with one sign flipped are the mistakes */
    let x, y;
    do [x, y] = offAxes();
    while (Math.abs(x) === Math.abs(y));
    const others = [
        [y, x, `That’s ${pt(y, x)}: x and y are swapped. The first number, ${fmt(x)}, goes across.`],
        [-x, y, `That’s ${pt(-x, y)}. x is ${fmt(x)}, so go ${x < 0 ? "left" : "right"} from the origin.`],
        [x, -y, `That’s ${pt(x, -y)}. y is ${fmt(y)}, so go ${y < 0 ? "down" : "up"}.`],
      ],
      letters = shuffle(["A", "B", "C", "D"]),
      points = [{ x, y, id: letters[0] }, ...others.map(([px, py], i) => ({ x: px, y: py, id: letters[i + 1] }))];
    return {
      kind: "tap",
      prompt: `Tap the point <b>${pt(x, y)}</b>.`,
      answer: letters[0],
      why: Object.fromEntries(others.map(([, , msg], i) => [letters[i + 1], msg])),
      fig: (show) =>
        plane(
          points.map((p) => ({ ...p, cls: show && p.id === letters[0] ? "b" : "" })),
          {
            tap: true,
            shapes: show
              ? [
                  {
                    pts: [
                      [0, 0],
                      [x, 0],
                      [x, y],
                    ],
                    cls: "walk",
                  },
                ]
              : [],
            label: "Coordinate plane with four points",
          },
        ),
      hint: `Start at the origin. Go ${Math.abs(x)} ${x < 0 ? "left" : "right"} (x = ${fmt(x)}), then ${Math.abs(y)} ${y < 0 ? "down" : "up"} (y = ${fmt(y)}).`,
      explain: `${pt(x, y)}: ${Math.abs(x)} ${x < 0 ? "left" : "right"} of the origin, then ${Math.abs(y)} ${y < 0 ? "down" : "up"}.`,
      facts: { t: type, grid: 6, pts: points.map((p) => [p.x, p.y]) },
    };
  }
  if (type === "read") {
    /* the coordinates of a point, typed as ( x , y ) */
    let x, y;
    do [x, y] = offAxes();
    while (Math.abs(x) === Math.abs(y));
    return pointP({
      prompt: "What are the coordinates of point P?",
      answer: [x, y],
      fig: (show) =>
        plane([{ x, y, t: "P", cls: "b" }], {
          shapes: show
            ? [
                {
                  pts: [
                    [0, 0],
                    [x, 0],
                    [x, y],
                  ],
                  cls: "walk",
                },
              ]
            : [],
          label: "Coordinate plane with point P",
        }),
      hint: "From the origin, how far across is P (left is negative)? Then how far up or down (down is negative)?",
      pmisc: [
        [[y, x], "Those are swapped. The x-coordinate (across) comes first, then y (up or down)."],
        [
          [-x, y],
          `Check the sign of x: P is ${x < 0 ? "left" : "right"} of the y-axis, so x is ${x < 0 ? "negative" : "positive"}.`,
        ],
        [
          [x, -y],
          `Check the sign of y: P is ${y < 0 ? "below" : "above"} the x-axis, so y is ${y < 0 ? "negative" : "positive"}.`,
        ],
        [[-x, -y], "Both signs are flipped. Left of the y-axis is negative x, and below the x-axis is negative y."],
      ],
      explain: `P is ${Math.abs(x)} ${x < 0 ? "left" : "right"} of the origin and ${Math.abs(y)} ${y < 0 ? "down" : "up"}: ${pt(x, y)}.`,
      facts: { t: type, grid: 6, pts: [[x, y]] },
    });
  }
  if (type === "quadrant") {
    /* which quadrant a point is in, from the signs of its coordinates */
    const [x, y] = offAxes(12),
      answer = quadrantOf(x, y),
      signs = (q) => ({ I: "(+, +)", II: "(−, +)", III: "(−, −)", IV: "(+, −)" })[q];
    return mcP(
      ["I", "II", "III", "IV"].map((q) => [
        `Quadrant ${q}`,
        q === answer
          ? null
          : `Quadrant ${q} has points with signs ${signs(q)}. ${pt(x, y)} has signs ${signs(answer)}.`,
      ]),
      {
        prompt: `In which quadrant is the point <b>${pt(x, y)}</b>?`,
        fig: (show) =>
          plane(show ? [{ x, y, t: pt(x, y) }] : [], {
            size: 12,
            xStep: 2,
            yStep: 2,
            quads: true,
            shade: show ? answer : null,
            label: show
              ? `Coordinate plane with ${pt(x, y)} in Quadrant ${answer}`
              : "Coordinate plane with its quadrants named",
          }),
        hint: "Quadrant I is top right, then II, III, and IV go around counterclockwise. A negative x is left; a negative y is down.",
        explain: `x = ${fmt(x)} is ${x < 0 ? "negative (left)" : "positive (right)"} and y = ${fmt(y)} is ${y < 0 ? "negative (down)" : "positive (up)"}: Quadrant ${answer}.`,
        facts: { t: type, grid: 12, pts: [[x, y]] },
      },
    );
  }
  /* a place on a town map, from directions in blocks */
  let x, y;
  do [x, y] = offAxes(8);
  while (Math.abs(x) === Math.abs(y));
  const place = pick(PLACES);
  return pointP({
    prompt: `${MAP_WORDS} The ${place} is ${walkWords(x, y)} of the square. What are its coordinates?`,
    answer: [x, y],
    fig: (show) =>
      plane(show ? [{ x, y, t: place, cls: "b" }] : [{ x: 0, y: 0, t: "square" }], {
        size: 8,
        xLabel: "blocks east",
        yLabel: "blocks north",
        shapes: show
          ? [
              {
                pts: [
                  [0, 0],
                  [x, 0],
                  [x, y],
                ],
                cls: "walk",
              },
            ]
          : [],
        label: show ? `Town map with the ${place} at ${pt(x, y)}` : "Town map with the town square at the origin",
      }),
    hint: "East is positive x and west is negative x. North is positive y and south is negative y.",
    pmisc: [
      [[y, x], "Those are swapped: east or west (x) comes first."],
      [[Math.abs(x), Math.abs(y)], "West and south are the negative directions. Put a minus sign on those."],
      [[-x, y], `${x < 0 ? "West" : "East"} is ${x < 0 ? "negative" : "positive"} x.`],
      [[x, -y], `${y < 0 ? "South" : "North"} is ${y < 0 ? "negative" : "positive"} y.`],
    ],
    explain: `${walkWords(x, y)}: x = ${fmt(x)} and y = ${fmt(y)}, so the ${place} is at ${pt(x, y)}.`,
    facts: { t: type, grid: 8, pts: [[x, y]] },
  });
}

/* ---------- Station 6: distances, reflections, and rectangles (Lessons 13–15) ---------- */
function genDist() {
  const type = pick(["distance", "distance", "reflect", "reflect", "vertex", "perimeter"]);
  if (type === "distance") {
    /* the distance between two points on a horizontal or vertical line; across an axis, the distances from it add */
    const across = Math.random() < 0.65,
      shared = R0(-6, 6),
      flat = Math.random() < 0.5,
      inMap = Math.random() < 0.4;
    let a, b;
    do {
      a = across ? -R(1, 7) : R0(-8, 8);
      b = across ? R(1, 7) : Math.sign(a) * R(1, 8);
    } while (Math.abs(a - b) < 2);
    const answer = Math.abs(a - b),
      p1 = flat ? [a, shared] : [shared, a],
      p2 = flat ? [b, shared] : [shared, b],
      [first, second] = shuffle([p1, p2]),
      names = inMap ? shuffle(PLACES).slice(0, 2) : ["A", "B"];
    return numP({
      prompt: inMap
        ? `On a town map, the ${names[0]} is at ${pt(...first)} and the ${names[1]} is at ${pt(...second)}. Each unit is one block. How many blocks apart are they?`
        : `What is the distance between ${pt(...first)} and ${pt(...second)}?`,
      answer,
      unit: inMap ? "blocks" : "units",
      fig: (show) =>
        plane(
          [
            { x: first[0], y: first[1] },
            { x: second[0], y: second[1], cls: "b" },
          ],
          {
            size: 8,
            xStep: 1,
            yStep: 1,
            shapes: show ? [{ pts: [first, second], cls: "walk" }] : [],
            label: `Coordinate plane with points at ${pt(...first)} and ${pt(...second)}`,
          },
        ),
      hint: across
        ? `The points are on opposite sides of the ${flat ? "y" : "x"}-axis. Find each one’s distance to the axis, then add.`
        : `Both points are on the same side of the ${flat ? "y" : "x"}-axis. Count the units between them.`,
      misc: across
        ? [
            [
              Math.abs(Math.abs(a) - Math.abs(b)),
              `That subtracts the distances from the axis, but the points are on opposite sides of it: add them. ${Math.abs(a)} + ${Math.abs(b)} = ${answer}.`,
            ],
          ]
        : [
            [
              Math.abs(a) + Math.abs(b),
              `Both points are on the same side of the axis, so don’t add their distances to it: subtract. ${Math.max(Math.abs(a), Math.abs(b))} − ${Math.min(Math.abs(a), Math.abs(b))} = ${answer}.`,
            ],
          ],
      explain: across
        ? `The ${flat ? "x" : "y"}-coordinates are ${fmt(a)} and ${fmt(b)}: ${abs(a)} + ${abs(b)} = ${Math.abs(a)} + ${Math.abs(b)} = ${answer}.`
        : `The ${flat ? "x" : "y"}-coordinates are ${fmt(a)} and ${fmt(b)}, on the same side of 0: ${Math.max(Math.abs(a), Math.abs(b))} − ${Math.min(Math.abs(a), Math.abs(b))} = ${answer}.`,
      facts: { t: type, grid: 8, pts: [first, second], count: [answer] },
    });
  }
  if (type === "reflect") {
    /* a point reflected across the x-axis (y changes sign) or the y-axis (x changes sign) */
    const [x, y] = offAxes(),
      overX = Math.random() < 0.5,
      answer = overX ? [x, -y] : [-x, y];
    return pointP({
      prompt: `The point ${pt(x, y)} is reflected across the <b>${overX ? "x" : "y"}-axis</b>. Where does it land?`,
      answer,
      fig: (show) =>
        plane([{ x, y, t: pt(x, y) }, ...(show ? [{ x: answer[0], y: answer[1], cls: "b", t: pt(...answer) }] : [])], {
          shapes: show ? [{ pts: [[x, y], answer], cls: "walk" }] : [],
          label: `Coordinate plane with the point ${pt(x, y)}`,
        }),
      hint: `A reflection across the ${overX ? "x-axis flips the point up or down" : "y-axis flips the point left or right"}: it lands the same distance from the axis on the other side.`,
      pmisc: [
        [
          overX ? [-x, y] : [x, -y],
          `That’s the reflection across the ${overX ? "y" : "x"}-axis. Across the ${overX ? "x-axis (left to right), the point flips up or down, so y changes sign" : "y-axis (up and down), the point flips left or right, so x changes sign"}.`,
        ],
        [[-x, -y], "That changes both signs. A reflection across one axis changes only one coordinate’s sign."],
        [[y, x], "That swaps x and y. A reflection keeps the same numbers, with one sign changed."],
      ],
      explain: `Across the ${overX ? "x" : "y"}-axis, ${overX ? "y" : "x"} changes sign and ${overX ? "x" : "y"} stays: ${pt(x, y)} lands on ${pt(...answer)}.`,
      facts: { t: type, grid: 6, pts: [[x, y], answer] },
    });
  }
  /* a rectangle with sides along the grid: x from left to right, y from bottom to top, crossing an axis */
  const left = -R(1, 5),
    right = R(1, 6),
    bottom = Math.random() < 0.5 ? -R(1, 5) : R(1, 3),
    top = bottom < 0 ? R(1, 5) : bottom + R(2, 3),
    corners = [
      [left, top],
      [right, top],
      [right, bottom],
      [left, bottom],
    ],
    width = right - left,
    height = top - bottom;
  if (type === "vertex") {
    /* the fourth vertex of a rectangle from three of them */
    const missing = R(0, 3),
      given = corners.filter((_, i) => i !== missing),
      answer = corners[missing];
    return pointP({
      prompt: `A rectangle has vertices at ${given.map((c) => pt(...c)).join(", ")}. What is the fourth vertex?`,
      answer,
      fig: (show) =>
        plane(
          [
            ...given.map(([x, y]) => ({ x, y })),
            ...(show ? [{ x: answer[0], y: answer[1], cls: "b", t: pt(...answer) }] : []),
          ],
          {
            shapes: show ? [{ pts: corners, closed: true, cls: "fill" }] : [],
            label: "Coordinate plane with three vertices of a rectangle",
          },
        ),
      hint: "A rectangle’s sides here are horizontal and vertical, so the fourth vertex shares its x with one vertex and its y with another.",
      pmisc: [
        [[answer[1], answer[0]], "Those are swapped: x first, then y."],
        [
          [-answer[0], answer[1]],
          `Check the sign of x: the missing corner is ${answer[0] < 0 ? "left" : "right"} of the y-axis.`,
        ],
        [
          [answer[0], -answer[1]],
          `Check the sign of y: the missing corner is ${answer[1] < 0 ? "below" : "above"} the x-axis.`,
        ],
      ],
      explain: `The rectangle runs from x = ${fmt(left)} to ${fmt(right)} and from y = ${fmt(bottom)} to ${fmt(top)}, so the missing vertex is ${pt(...answer)}.`,
      facts: { t: type, grid: 6, pts: corners },
    });
  }
  /* the perimeter or the area of a rectangle from its vertices */
  const askArea = Math.random() < 0.4,
    perimeter = 2 * (width + height),
    area = width * height,
    shortWidth = Math.abs(Math.abs(right) - Math.abs(left)),
    shortHeight = Math.abs(Math.abs(top) - Math.abs(bottom));
  return numP({
    prompt: `A rectangle has vertices at ${corners.map((c) => pt(...c)).join(", ")}. What is its ${askArea ? "area" : "perimeter"}?`,
    answer: askArea ? area : perimeter,
    unit: askArea ? "square units" : "units",
    fig: (show) =>
      plane(
        corners.map(([x, y]) => ({ x, y })),
        {
          shapes: [{ pts: corners, closed: true, cls: show ? "fill" : "" }],
          label: "Coordinate plane with a rectangle",
        },
      ),
    hint: `Find the side lengths first. Across: from ${fmt(left)} to ${fmt(right)}. Up and down: from ${fmt(bottom)} to ${fmt(top)}.`,
    misc: [
      askArea
        ? [perimeter, `That’s the perimeter (the distance around). Area is length times width: ${width} · ${height}.`]
        : [area, `That’s the area. The perimeter is the distance around: ${width} + ${height} + ${width} + ${height}.`],
      ...(!askArea
        ? [[width + height, `That’s two sides. The perimeter goes all the way around: 2 · (${width} + ${height}).`]]
        : []),
      [
        askArea ? shortWidth * Math.max(1, shortHeight) : 2 * (shortWidth + shortHeight),
        "That subtracts the distances from an axis for a side that crosses it. When a side crosses an axis, add the distances on each side.",
      ],
    ],
    explain: `From x = ${fmt(left)} to x = ${fmt(right)} is ${Math.abs(left)} + ${right} = ${width} units across, and from y = ${fmt(bottom)} to y = ${fmt(top)} is ${bottom < 0 ? `${Math.abs(bottom)} + ${top}` : `${top} − ${bottom}`} = ${height} units up, so its ${askArea ? `area is ${width} · ${height} = ${area} square units` : `perimeter is 2 · (${width} + ${height}) = ${perimeter} units`}.`,
    facts: { t: type, grid: 6, pts: corners },
  });
}

/* ---------- Station 7: common factors and common multiples (Lessons 16–18) ---------- */
/* two numbers up to 60 with a greatest common factor g of 2 or more, neither one a factor of the other */
function gcfPair() {
  let g, m, n;
  do {
    g = R(2, 9);
    m = R(2, 7);
    n = R(2, 7);
  } while (m === n || gcd(m, n) !== 1 || g * Math.max(m, n) > 60);
  return [g * m, g * n, g];
}
/* two numbers whose least common multiple is at most 60 and isn't their product (they share a factor), neither one a
   multiple of the other: from 2 to 15, or from the lists [first choices, second choices] */
function lcmPair(sizes = [range(14).map((i) => i + 2), range(14).map((i) => i + 2)]) {
  let a, b;
  do {
    a = pick(sizes[0]);
    b = pick(sizes[1]);
  } while (a === b || a % b === 0 || b % a === 0 || gcd(a, b) === 1 || lcm(a, b) > 60);
  return [a, b, lcm(a, b)];
}
/* stories that ask for a greatest common factor: two kinds of things split into identical kits, nothing left over */
const KITS = [
  ["pencils", "erasers", "school-supply kits"],
  ["granola bars", "water bottles", "hiking packs"],
  ["red beads", "blue beads", "bracelets"],
  ["apples", "oranges", "fruit baskets"],
  ["markers", "glue sticks", "art kits"],
];
/* stories that ask for a least common multiple: things that come in packs, or that happen on a schedule, with the sizes
   they really come in */
const PACKS = [
  {
    story: (a, b) =>
      `Hot dogs come in packs of ${a} and buns come in packs of ${b}. What is the least number of hot dogs you can buy to have exactly one bun for each?`,
    sizes: [
      [8, 10, 12],
      [6, 8, 12],
    ],
    unit: "hot dogs",
  },
  {
    story: (a, b) =>
      `Paper plates come in packs of ${a} and cups come in packs of ${b}. What is the least number of plates you can buy to have exactly as many cups?`,
    sizes: [
      [8, 10, 12, 20],
      [6, 12, 16, 18],
    ],
    unit: "plates",
  },
  {
    story: (a, b) =>
      `At the trailhead, the red shuttle leaves every ${a} minutes and the blue shuttle every ${b} minutes. They just left together. In how many minutes will they next leave together?`,
    sizes: [
      [6, 8, 9, 10, 12, 15, 20],
      [6, 8, 9, 10, 12, 15, 20],
    ],
    unit: "minutes",
  },
  {
    story: (a, b) =>
      `${pick(WHO)} waters the ferns every ${a} days and the cactus every ${b} days, and watered both today. In how many days will both be watered on the same day again?`,
    sizes: [
      [2, 3, 4, 6, 8, 9, 10],
      [2, 3, 4, 6, 8, 9, 10],
    ],
    unit: "days",
  },
];
function genFactor() {
  const type = pick(["gcf", "lcm", "kits", "packs", "which", "list"]);
  if (type === "gcf") {
    /* the greatest common factor of two numbers */
    const [a, b, g] = gcfPair(),
      smaller = factors(g)
        .filter((d) => d > 1 && d < g)
        .pop();
    return numP({
      prompt: `What is the greatest common factor of <b>${a}</b> and <b>${b}</b>?`,
      answer: g,
      hint: `List the factors of ${a} and of ${b}. Which numbers are in both lists? Pick the greatest.`,
      misc: [
        ...(smaller
          ? [[smaller, `${smaller} is a common factor, but not the greatest. ${g} goes into both ${a} and ${b} too.`]]
          : []),
        [
          lcm(a, b),
          `${lcm(a, b)} is the least common multiple. A factor of ${a} and ${b} can’t be more than ${Math.min(a, b)}.`,
        ],
        [
          a * b,
          `That multiplies them. A common factor goes into both numbers, so it can’t be more than ${Math.min(a, b)}.`,
        ],
        [1, `1 is a common factor of every pair. Look for a greater one.`],
      ],
      explain: `Factors of ${a}: ${factors(a).join(", ")}. Factors of ${b}: ${factors(b).join(", ")}. The greatest in both lists is ${g}.`,
      facts: { t: type, gcf: [a, b, g] },
    });
  }
  if (type === "lcm") {
    /* the least common multiple of two numbers that share a factor */
    const [a, b, l] = lcmPair(),
      multiplesUpTo = (n) => range(Math.floor(l / n)).map((i) => (i + 1) * n);
    return numP({
      prompt: `What is the least common multiple of <b>${a}</b> and <b>${b}</b>?`,
      answer: l,
      hint: `Count by ${a}s and by ${b}s. What’s the first number in both lists?`,
      misc: [
        [a * b, `${a * b} is a common multiple, but not the least. ${l} is in both lists sooner.`],
        [
          gcd(a, b),
          `${gcd(a, b)} is the greatest common factor. A multiple of ${a} and ${b} is at least ${Math.max(a, b)}.`,
        ],
        [Math.max(a, b), `${Math.max(a, b)} is a multiple of ${Math.max(a, b)}, but not of ${Math.min(a, b)}.`],
      ],
      explain: `Multiples of ${a}: ${multiplesUpTo(a).join(", ")}. Multiples of ${b}: ${multiplesUpTo(b).join(", ")}. The first one in both lists is ${l}.`,
      facts: { t: type, lcm: [a, b, l] },
    });
  }
  if (type === "kits") {
    /* identical kits with nothing left over: the greatest common factor */
    const [a, b, g] = gcfPair(),
      [firstKind, secondKind, kits] = pick(KITS);
    return numP({
      prompt: `${pick(WHO)} has ${a} ${firstKind} and ${b} ${secondKind} to put into identical ${kits}, with nothing left over. What is the greatest number of ${kits} that can be made?`,
      answer: g,
      unit: kits.split(" ").pop(),
      hint: `The number of ${kits} has to go into ${a} and into ${b} evenly: it’s a common factor. Find the greatest one.`,
      misc: [
        [
          lcm(a, b),
          `${lcm(a, b)} is a common multiple. There are only ${a} ${firstKind}, so there can’t be more ${kits} than that.`,
        ],
        [
          a * b,
          `That multiplies them. Each kit needs some of each, so the number of kits goes into both ${a} and ${b}.`,
        ],
        ...(factors(g).filter((d) => d > 1 && d < g).length
          ? [
              [
                factors(g)
                  .filter((d) => d > 1 && d < g)
                  .pop(),
                `That works, but more ${kits} can be made: try a greater common factor.`,
              ],
            ]
          : []),
      ],
      explain: `The greatest common factor of ${a} and ${b} is ${g}: ${g} ${kits}, each with ${a / g} ${firstKind} and ${b / g} ${secondKind}.`,
      facts: { t: type, gcf: [a, b, g], count: [a, b] },
    });
  }
  if (type === "packs") {
    /* packs that have to come out even, or schedules that line up: the least common multiple */
    const story = pick(PACKS),
      [a, b, l] = lcmPair(story.sizes);
    return numP({
      prompt: story.story(a, b),
      answer: l,
      unit: story.unit,
      hint: `Count by ${a}s and by ${b}s. The first number on both lists is the answer: the least common multiple.`,
      misc: [
        [a * b, `${a * b} works, but it isn’t the least. ${l} comes up in both lists first.`],
        [
          gcd(a, b),
          `${gcd(a, b)} is the greatest common factor. The answer has to be a multiple of both ${a} and ${b}.`,
        ],
        [a + b, `That adds them. The answer has to be a multiple of both ${a} and ${b}.`],
      ],
      explain: `Counting by ${a}s and by ${b}s, the first number in both lists is ${l}: the least common multiple.`,
      facts: { t: type, lcm: [a, b, l] },
    });
  }
  if (type === "which") {
    /* does a story need the greatest common factor or the least common multiple? */
    const kitsStory = Math.random() < 0.5;
    const story = pick(PACKS),
      [a, b] = kitsStory ? gcfPair() : lcmPair(story.sizes),
      [firstKind, secondKind, kits] = pick(KITS);
    const prompt = kitsStory
      ? `${a} ${firstKind} and ${b} ${secondKind} are split into identical ${kits}, with nothing left over. To find the greatest number of ${kits}, what do you need?`
      : `${story.story(a, b)} To answer, what do you need?`;
    return mcP(
      [
        [
          `the greatest common factor of ${a} and ${b}`,
          kitsStory ? null : `This story needs a number that both ${a} and ${b} go into: a common multiple.`,
        ],
        [
          `the least common multiple of ${a} and ${b}`,
          kitsStory
            ? `This story splits ${a} and ${b} into equal groups: the number of groups goes into both, a common factor.`
            : null,
        ],
        [
          `${a} × ${b}`,
          kitsStory
            ? `${a * b} is far more than ${a}. The number of ${kits} goes into both numbers.`
            : `${a * b} works, but isn’t the least. The least common multiple is.`,
        ],
      ],
      {
        prompt,
        stack: true,
        hint: "Splitting into equal groups uses a common factor. Lining up, or making amounts come out even by buying more, uses a common multiple.",
        explain: kitsStory
          ? `The number of ${kits} has to go into both ${a} and ${b}, and be as great as possible: the greatest common factor, ${gcd(a, b)}.`
          : `The answer is a number that both ${a} and ${b} go into, as small as possible: the least common multiple, ${lcm(a, b)}.`,
        facts: { t: type, ...(kitsStory ? { gcf: [a, b, gcd(a, b)] } : { lcm: [a, b, lcm(a, b)] }) },
      },
    );
  }
  /* the list of all common factors: one missing, or every factor of either number, are the mistakes */
  const [a, b, g] = gcfPair(),
    common = factors(g),
    either = [...new Set([...factors(a), ...factors(b)])].sort((x, y) => x - y);
  return mcP(
    [
      [common.join(", "), null],
      [
        common.slice(0, -1).join(", "),
        `${g} is missing: ${g} goes into ${a} (${a} ÷ ${g} = ${a / g}) and ${b} (${b} ÷ ${g} = ${b / g}).`,
      ],
      [
        either.join(", "),
        `That lists every factor of either number. A common factor goes into both: ${either.find((d) => !common.includes(d))} doesn’t.`,
      ],
    ],
    {
      prompt: `Which list shows all the common factors of <b>${a}</b> and <b>${b}</b>?`,
      stack: true,
      hint: `List the factors of ${a} and of ${b}, then keep only the numbers on both lists.`,
      explain: `Factors of ${a}: ${factors(a).join(", ")}. Factors of ${b}: ${factors(b).join(", ")}. On both: ${common.join(", ")}.`,
      facts: { t: type, gcf: [a, b, g] },
    },
  );
}

const ICON = {
  line: '<path d="M4,34 H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M10,28v12M22,28v12M32,24v20M42,28v12M54,28v12" stroke="#f3f6fb" stroke-width="2"/><circle cx="16" cy="34" r="5" fill="#7fe3ff"/><circle cx="48" cy="34" r="5" fill="#ffc93c"/><text x="16" y="56" fill="#7fe3ff" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">−4</text><text x="48" y="56" fill="#ffc93c" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">4</text>',
  compare:
    '<rect x="14" y="8" width="10" height="36" rx="5" fill="none" stroke="#f3f6fb" stroke-width="2"/><rect x="17" y="24" width="4" height="22" fill="#6fb8ff"/><circle cx="19" cy="50" r="7" fill="#6fb8ff"/><text x="44" y="40" fill="#ffc93c" font-size="26" font-weight="700" text-anchor="middle" font-family="monospace">&lt;</text>',
  abs: '<rect x="4" y="34" width="56" height="26" fill="rgba(64,140,255,.35)"/><path d="M4,34 H60" stroke="#7fe3ff" stroke-width="2"/><text x="32" y="26" fill="#f3f6fb" font-size="17" font-weight="700" text-anchor="middle" font-family="monospace">|−8|</text><circle cx="40" cy="50" r="4" fill="#ffc93c"/>',
  ineq: '<path d="M4,36 H60" stroke="#f3f6fb" stroke-width="2"/><path d="M24,36 H56" stroke="#7fe3ff" stroke-width="6" stroke-linecap="round"/><polygon points="62,36 52,29 52,43" fill="#7fe3ff"/><circle cx="22" cy="36" r="6" fill="#0a2340" stroke="#7fe3ff" stroke-width="3"/><text x="22" y="20" fill="#ffc93c" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">x&gt;−2</text>',
  plane:
    '<path d="M32,4 V60 M4,32 H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M18,4V60M46,4V60M4,18H60M4,46H60" stroke="rgba(170,205,255,.3)" stroke-width="1"/><circle cx="18" cy="18" r="5" fill="#ffc93c"/><circle cx="46" cy="46" r="5" fill="#7fe3ff"/>',
  dist: '<path d="M32,4 V60 M4,32 H60" stroke="#f3f6fb" stroke-width="2"/><circle cx="12" cy="18" r="5" fill="#ffc93c"/><circle cx="54" cy="18" r="5" fill="#7fe3ff"/><path d="M12,18 H54" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="4 3"/><path d="M10,44 L22,52 L36,42 L54,50" fill="none" stroke="#ffc93c" stroke-width="2"/>',
  factor:
    '<rect x="6" y="20" width="22" height="30" rx="3" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="2"/><rect x="36" y="20" width="22" height="30" rx="3" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="2"/><path d="M12,20 v-6 h10 v6 M42,20 v-6 h10 v6" fill="none" stroke="#f3f6fb" stroke-width="2"/><circle cx="13" cy="32" r="3" fill="#7fe3ff"/><circle cx="21" cy="40" r="3" fill="#7fe3ff"/><circle cx="43" cy="32" r="3" fill="#7fe3ff"/><circle cx="51" cy="40" r="3" fill="#7fe3ff"/>',
  boss: '<polygon points="4,58 24,22 34,36 42,26 60,58" fill="rgba(127,227,255,.2)" stroke="#f3f6fb" stroke-width="2.5" stroke-linejoin="round"/><polygon points="24,22 19,31 29,31" fill="#f3f6fb"/><path d="M42,26 V6" stroke="#ffc93c" stroke-width="2"/><polygon points="42,6 54,10 42,14" fill="#ffc93c"/>',
};

const ZONES = [
  {
    id: "line",
    name: "Number Line",
    lessons: "Lessons 1–2",
    blurb: "Find numbers below zero on the number line, read temperatures and elevations, and flip to the opposite.",
    gen: genLine,
  },
  {
    id: "compare",
    name: "Colder or Warmer",
    lessons: "Lessons 3–5",
    blurb: "Compare and order signed numbers with < and >, and find the coldest, the deepest, and the most in debt.",
    gen: genCompare,
  },
  {
    id: "abs",
    name: "Sea Level",
    lessons: "Lessons 6–7",
    blurb: "Absolute value as distance from zero: debts, depths, and numbers that are less but farther away.",
    gen: genAbs,
  },
  {
    id: "ineq",
    name: "Safe Limits",
    lessons: "Lessons 8–10",
    blurb: "Read and write inequalities, test solutions, and turn rules like “at least 48 inches” into symbols.",
    gen: genIneq,
  },
  {
    id: "plane",
    name: "Map Grid",
    lessons: "Lessons 11–13",
    blurb: "Plot and read points in all four quadrants, and find places on a town map.",
    gen: genPlane,
  },
  {
    id: "dist",
    name: "Trail Map",
    lessons: "Lessons 13–15",
    blurb: "Find distances across the axes, reflect points, and finish rectangles on the coordinate plane.",
    gen: genDist,
  },
  {
    id: "factor",
    name: "Supply Packs",
    lessons: "Lessons 16–18",
    blurb: "Greatest common factors for identical kits, and least common multiples for packs and schedules.",
    gen: genFactor,
  },
  {
    id: "boss",
    name: "Summit Push",
    lessons: "Whole unit · 10 problems",
    blurb: "A mixed review from every station. Aim for 3 stars.",
    gen: () => pick([genLine, genCompare, genAbs, genIneq, genPlane, genDist, genFactor])(),
  },
];
