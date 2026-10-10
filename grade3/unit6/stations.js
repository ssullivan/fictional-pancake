/* Science Fair (Grade 3 Unit 6): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Rulers (inchRuler), scales (dialFig), liter containers (beakerFig), time number lines (timeLine), and lengths in fourths
   of an inch (inches, inchesText) come from figs.js; line plots (lineplot) from shared/graphs.js; clocks (clockFig, hm) from
   shared/measure.js; tape diagrams (timesTape, partWhole) from shared/numlines.js; mcOf and miscOf from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Every problem also
   carries facts for checks.js: its kind (t) and the numbers it was made from, so the answer can be worked out again. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* n and the word for it: "1 liter", "3 liters" (plural: the word for more than one) */
const pl = (n, word, plural = word + "s") => `${n} ${n === 1 ? word : plural}`;
/* the text with its first letter capitalized */
const cap = (text) => text[0].toUpperCase() + text.slice(1);
/* k/d of an inch written with the whole inches first, keeping d as it is: lenHtml(18, 4) is 4 2/4 (html, stacked) */
const lenHtml = (k, d) => {
  const whole = Math.floor(k / d),
    rest = k % d;
  return !rest ? `${whole}` : whole ? `${whole} ${fr(rest, d)}` : fr(rest, d);
};
/* the named mistakes that apply to these numbers: a wrong value equal to the answer, or not above 0, is left out */
const namedMisc = (answer, list) =>
  miscOf(
    answer,
    list.filter(([value]) => value > 0 && Math.abs(value - answer) > 0.01),
  );

/* ---------- Measuring Lab: measure to the nearest half or fourth of an inch (Lessons 1–3) ---------- */
/* things to measure and how long they can be, in fourths of an inch: [what it is, shortest, longest] */
const THINGS = [
  ["crayon", 12, 16],
  ["pencil", 16, 30],
  ["eraser", 5, 10],
  ["paper clip", 4, 8],
  ["marker", 18, 24],
  ["glue stick", 12, 16],
  ["ribbon", 8, 30],
  ["leaf", 6, 20],
];
function genRuler() {
  const variant = R(0, 2),
    [thing, shortest, longest] = pick(THINGS);
  if (variant < 2) {
    /* measure a bar: to the nearest fourth (any mark), or the nearest half (it ends on a half or whole mark) */
    const byHalves = variant === 1;
    let len;
    do len = R(shortest, longest);
    while ((byHalves && len % 2) || len % 4 === 0);
    const length = Math.ceil(len / 4) + 1,
      whole = Math.floor(len / 4);
    return {
      kind: "num",
      frac: true,
      unit: "inches",
      answer: len / 4,
      facts: { t: "measure", len, byHalves },
      prompt: `How long is the ${thing}? Measure to the nearest ${byHalves ? "half inch" : "fourth of an inch"}.`,
      fig: () => inchRuler(length, { obj: { len } }),
      misc: namedMisc(len / 4, [
        [whole, `The ${thing} goes past ${whole}. Count the part of an inch after it too.`],
        [whole + 1, `The ${thing} doesn’t reach ${whole + 1}. Read the mark where it ends.`],
        [len, "That counts every little mark as an inch. There are 4 fourths in each inch."],
        ...(len % 2 === 0 ? [[whole + 0.25, "The middle mark between two inches is a half, not a fourth."]] : []),
      ]),
      hint: `The ${thing} starts at 0 and ends past ${whole}. Each inch is cut into ${byHalves ? "halves by the middle mark" : "4 fourths"}.`,
      explain: `The ${thing} ends ${len % 4 === 2 ? "halfway" : `${len % 4} fourth${len % 4 > 1 ? "s" : ""} of the way`} from ${whole} to ${whole + 1}: ${inches(len)} inches.`,
    };
  }
  /* tap a length on the ruler */
  const length = R(3, 6),
    target = (() => {
      let k;
      do k = R(1, 4 * length - 1);
      while (k % 4 === 0);
      return k;
    })(),
    why = {};
  range(4 * length + 1).forEach((k) => {
    if (k !== target) why[k] = `That mark is ${inches(k)} inch${k === 4 ? "" : "es"}.`;
  });
  return {
    kind: "tap",
    answer: String(target),
    why,
    facts: { t: "tapLength", target },
    prompt: `Tap the mark for ${inches(target)} inches.`,
    fig: (show) => inchRuler(length, { tap: "cand", obj: show ? { len: target, cls: "b" } : null }),
    hint: `Find ${Math.floor(target / 4)} on the ruler, then count ${target % 4 === 2 ? "to the middle mark, a half" : `${target % 4} fourth${target % 4 > 1 ? "s" : ""}`} past it.`,
    explain: `${inches(target)} inches is ${target % 4 === 2 ? "halfway" : `${target % 4} fourth${target % 4 > 1 ? "s" : ""} of the way`} from ${Math.floor(target / 4)} to ${Math.floor(target / 4) + 1}.`,
  };
}

/* ---------- Data Corner: line plots of measurements (Lessons 4–5) ---------- */
/* things the class measured, and their shortest length in fourths of an inch (the plot runs 2 inches from there) */
const MEASURED = [
  ["pencils", 16],
  ["leaves", 8],
  ["ribbons", 12],
  ["shells", 4],
  ["worms", 8],
];
function genPlots() {
  const variant = R(0, 4),
    [things, lo] = pick(MEASURED),
    /* halves (d 2) or fourths (d 4) */
    d = pick([2, 4]),
    step = 4 / d,
    loK = lo / step,
    hiK = loK + 2 * d,
    counts = {};
  /* 4 to 6 lengths with Xs; the most common one stands out (one more than any other) */
  const lengths = shuffle(range(hiK - loK + 1).map((i) => loK + i)).slice(0, R(4, 6)),
    top = lengths[0];
  lengths.forEach((k, i) => (counts[k] = i === 0 ? R(4, 5) : R(1, 3)));
  const total = Object.values(counts).reduce((a, b) => a + b, 0),
    say = (k) => `${lenHtml(k, d)} inches`,
    fig = (show, mark) => lineplot(counts, loK, hiK, { d, mixed: true, mark: show ? mark : null, unit: "inches" }),
    facts = { t: "plot", counts, d, loK, hiK };
  if (variant === 0) {
    /* how many are a length? */
    const k = pick(lengths.slice(1));
    return {
      kind: "num",
      unit: things,
      answer: counts[k],
      facts: { ...facts, ask: "at", k },
      prompt: `The class measured ${things}. How many ${things} are ${say(k)} long?`,
      fig: (show) => fig(show, k),
      misc: namedMisc(counts[k], [[total, "That’s all of them. Count only the Xs above that length."]]),
      hint: `Find ${say(k)} under the line. Count the Xs above it.`,
      explain: `There ${counts[k] === 1 ? "is 1 X" : `are ${counts[k]} Xs`} above ${say(k)}.`,
    };
  }
  if (variant === 1) {
    /* how many are longer than a length? */
    /* a length with Xs to its right */
    const k = pick(
        range(hiK - loK)
          .map((i) => loK + i)
          .filter((x) => lengths.some((y) => y > x)),
      ),
      answer = lengths.filter((x) => x > k).reduce((sum, x) => sum + counts[x], 0),
      withIt = answer + (counts[k] || 0);
    return {
      kind: "num",
      unit: things,
      answer,
      facts: { ...facts, ask: "longer", k },
      prompt: `How many ${things} are longer than ${say(k)}?`,
      fig: (show) => fig(show, k),
      misc: namedMisc(answer, [
        ...(counts[k]
          ? [[withIt, `That counts the ${things} that are exactly ${say(k)}. Longer means to the right of it.`]]
          : []),
        [total - withIt, "That counts the shorter ones. Longer means to the right on the line."],
      ]),
      hint: `Count the Xs to the right of ${say(k)}.`,
      explain: `To the right of ${say(k)} there are ${answer} Xs.`,
    };
  }
  if (variant === 2) {
    /* which length is the most common? */
    const others = shuffle(lengths.slice(1)).slice(0, 2);
    return {
      ...mcOf([
        [say(top), null],
        ...others.map((k) => [
          say(k),
          `Only ${counts[k]} ${counts[k] === 1 ? "is" : "are"} ${say(k)}. Find the tallest stack of Xs.`,
        ]),
      ]),
      facts: { ...facts, ask: "most" },
      prompt: `Which length did the most ${things} have?`,
      fig: (show) => fig(show, top),
      hint: "Find the tallest stack of Xs.",
      explain: `The tallest stack, ${counts[top]} Xs, is above ${say(top)}.`,
    };
  }
  if (variant === 3) {
    /* how many were measured in all? */
    return {
      kind: "num",
      unit: things,
      answer: total,
      facts: { ...facts, ask: "total" },
      prompt: `Each X is one of the ${things} the class measured. How many ${things} did they measure?`,
      fig: () => fig(false),
      misc: namedMisc(total, [[lengths.length, "That’s how many lengths have Xs. Count every X."]]),
      hint: "Count every X on the line plot.",
      explain: `${lengths.map((k) => counts[k]).join(" + ")} = ${total} ${things}.`,
    };
  }
  /* how many more are one length than another? */
  const [k1, k2] = [top, pick(lengths.slice(1))];
  return {
    kind: "num",
    unit: things,
    answer: counts[k1] - counts[k2],
    facts: { ...facts, ask: "more", k: k1, k2 },
    prompt: `How many more ${things} are ${say(k1)} than ${say(k2)}?`,
    fig: (show) => fig(show, k1),
    misc: namedMisc(counts[k1] - counts[k2], [
      [counts[k1] + counts[k2], "That adds them. How many more means subtract."],
    ]),
    hint: `Count the Xs above each length, then subtract.`,
    explain: `${counts[k1]} − ${counts[k2]} = ${counts[k1] - counts[k2]}.`,
  };
}

/* ---------- Weigh Station: grams and kilograms (Lesson 6) ---------- */
/* things to weigh, and about how much each one weighs (the right choice from WEIGHTS) */
const WEIGHED = [
  ["a paper clip", "1 gram"],
  ["a grape", "5 grams"],
  ["an apple", "200 grams"],
  ["a baseball", "150 grams"],
  ["a bag of flour", "2 kilograms"],
  ["a big watermelon", "8 kilograms"],
  ["a bike", "15 kilograms"],
  ["a big dog", "30 kilograms"],
];
/* every weight a choice can be, lightest first */
const WEIGHTS = [
  "1 gram",
  "5 grams",
  "150 grams",
  "200 grams",
  "2 kilograms",
  "8 kilograms",
  "15 kilograms",
  "30 kilograms",
  "300 kilograms",
];
/* stories with one step, in grams or kilograms: each returns {story, unit, answer, nums, op} */
const WEIGHT_STORIES = [
  /* equal bags: multiply */
  () => {
    const each = pick([2, 3, 4, 5]),
      bags = R(2, 6);
    return {
      story: `A bag of rice weighs ${each} kilograms. How many kilograms do ${bags} bags weigh?`,
      unit: "kilograms",
      answer: each * bags,
      nums: [each, bags],
      op: "×",
    };
  },
  /* two things together: add */
  ([name]) => {
    const bag = R(3, 7),
      books = R(2, 6);
    return {
      story: `${name}’s backpack weighs ${bag} kilograms. ${name} puts in books that weigh ${books} kilograms. How many kilograms does it weigh now?`,
      unit: "kilograms",
      answer: bag + books,
      nums: [bag, books],
      op: "+",
    };
  },
  /* how much heavier: subtract */
  () => {
    const pumpkin = R(6, 9) * 100,
      melon = R(2, 5) * 100;
    return {
      story: `A pumpkin weighs ${pumpkin} grams. A melon weighs ${melon} grams. How many more grams does the pumpkin weigh?`,
      unit: "grams",
      answer: pumpkin - melon,
      nums: [pumpkin, melon],
      op: "−",
    };
  },
  /* shared equally: divide */
  () => {
    const bags = R(2, 5),
      each = pick([50, 100, 200]),
      total = bags * each;
    return {
      story: `${total} grams of nuts are shared equally into ${bags} bags. How many grams go in each bag?`,
      unit: "grams",
      answer: each,
      nums: [total, bags],
      op: "÷",
    };
  },
];
function genWeight() {
  const variant = R(0, 3),
    names = shuffle(KIDS);
  if (variant === 0) {
    /* read a scale in grams (to 1,000, a mark every 50) or kilograms (to 20, a mark every 1) */
    const grams = R(0, 1),
      [max, step] = grams ? [1000, 100] : [20, 2],
      value = grams ? R(1, 19) * 50 : R(1, 19),
      unit = grams ? "grams" : "kilograms",
      below = Math.floor(value / step) * step;
    return {
      kind: "num",
      unit,
      answer: value,
      facts: { t: "dial", max, step, value },
      prompt: `What does the scale show?`,
      fig: () => dialFig(max, step, value, unit),
      misc: namedMisc(value, [
        ...(value % step
          ? [
              [
                below + step,
                `The small mark is halfway between ${below} and ${below + step}: ${step / 2} more than ${below}.`,
              ],
              [below, `The needle is past ${below}. The small mark is halfway to ${below + step}.`],
            ]
          : []),
        ...(value % step === 0
          ? [[value / step, `The numbers count by ${step}s. Read the number the needle points to.`]]
          : []),
      ]),
      hint: `The numbers go up by ${step}. The small marks are halfway between: ${step / 2} more.`,
      explain: `The needle points to ${value} ${unit}.`,
    };
  }
  if (variant === 1) {
    /* about how much does it weigh? */
    const [thing, right] = pick(WEIGHED),
      at = WEIGHTS.indexOf(right),
      /* two choices that are far off: much lighter and much heavier when there are, otherwise both on one side */
      wrongs = shuffle(WEIGHTS.filter((w, i) => Math.abs(i - at) >= 2)).slice(0, 2);
    return {
      ...mcOf([
        [right, null],
        ...wrongs.map((w) => [
          w,
          WEIGHTS.indexOf(w) < at ? `That’s too light for ${thing}.` : `That’s too heavy for ${thing}.`,
        ]),
      ]),
      facts: { t: "estimateWeight", thing, right },
      prompt: `About how much does ${thing} weigh?`,
      hint: "A paper clip weighs about 1 gram. A big bag of flour weighs about 2 kilograms. 1 kilogram is 1,000 grams.",
      explain: `${cap(thing)} weighs about ${right}.`,
    };
  }
  if (variant === 2) {
    /* grams or kilograms? */
    const [thing, right] = pick(WEIGHED),
      kg = right.includes("kilo");
    return {
      ...mcOf([
        [kg ? "Kilograms" : "Grams", null],
        [
          kg ? "Grams" : "Kilograms",
          kg
            ? `${thing[0].toUpperCase() + thing.slice(1)} is heavy: it would take thousands of grams.`
            : `A kilogram is much more than ${thing} weighs.`,
        ],
      ]),
      facts: { t: "unit", thing, right },
      prompt: `Would you weigh ${thing} in grams or kilograms?`,
      hint: "Grams are for light things, like a paper clip. Kilograms are for heavy things, like a bag of flour.",
      explain: `${thing[0].toUpperCase() + thing.slice(1)} weighs about ${right}, so use ${kg ? "kilograms" : "grams"}.`,
    };
  }
  /* a story with one step */
  const problem = pick(WEIGHT_STORIES)(names),
    [a, b] = problem.nums;
  return {
    kind: "num",
    unit: problem.unit,
    answer: problem.answer,
    facts: { t: "story", nums: problem.nums, op: problem.op },
    prompt: problem.story,
    fig: (show) =>
      problem.op === "×"
        ? timesTape([{ label: "bags", times: b, each: a, total: show ? problem.answer : "?" }], {
            label: `Tape diagram: ${b} bags of ${a}`,
          })
        : problem.op === "÷"
          ? timesTape([{ label: "bags", times: b, each: show ? problem.answer : "?", total: a }], {
              label: `Tape diagram: ${a} in ${b} equal parts`,
            })
          : partWhole(
              problem.op === "+"
                ? [
                    { n: a, show: a },
                    { n: b, show: b },
                  ]
                : [
                    { n: b, show: b },
                    { n: a - b, show: show ? a - b : "?" },
                  ],
              problem.op === "+" ? (show ? a + b : "?") : a,
              problem.op === "+" ? `Tape diagram: ${a} and ${b}` : `Tape diagram: ${a} split into ${b} and the rest`,
            ),
    misc: namedMisc(problem.answer, [
      problem.op === "+"
        ? [a - b, "That subtracts. Both weigh together: add."]
        : problem.op === "×"
          ? [a + b, `There are ${b} bags of ${a}: multiply.`]
          : [a + b, "That adds. Read the story again: which operation is it?"],
    ]),
    hint: {
      "+": "Put the two weights together: add.",
      "−": "How many more: subtract.",
      "×": "Equal bags: multiply.",
      "÷": "Shared equally: divide.",
    }[problem.op],
    explain: `${a} ${problem.op} ${b} = ${problem.answer} ${problem.unit}.`,
  };
}

/* ---------- Water Works: liters (Lessons 7–8) ---------- */
/* containers, and about how much water each one holds (the right choice from VOLUMES) */
const HELD = [
  ["a mug", "less than 1 liter"],
  ["a big water bottle", "about 1 liter"],
  ["a bucket", "about 10 liters"],
  ["a kitchen sink", "about 20 liters"],
  ["a fish tank", "about 40 liters"],
  ["a bathtub", "about 200 liters"],
];
const VOLUMES = [
  "less than 1 liter",
  "about 1 liter",
  "about 10 liters",
  "about 20 liters",
  "about 40 liters",
  "about 200 liters",
];
/* stories with one step, in liters: each returns {story, answer, nums, op} */
const LITER_STORIES = [
  ([name]) => {
    const each = R(2, 5),
      buckets = R(2, 6);
    return {
      story: `${name} fills ${buckets} buckets with ${each} liters of water each. How many liters is that?`,
      answer: each * buckets,
      nums: [each, buckets],
      op: "×",
    };
  },
  () => {
    const tank = R(30, 60),
      added = R(12, 25);
    return {
      story: `A fish tank has ${tank} liters of water. Then ${added} liters are added. How many liters are in the tank now?`,
      answer: tank + added,
      nums: [tank, added],
      op: "+",
    };
  },
  () => {
    const pool = R(5, 9) * 10,
      leaked = R(11, 29);
    return {
      story: `A kiddie pool holds ${pool} liters of water. ${leaked} liters leak out. How many liters are left?`,
      answer: pool - leaked,
      nums: [pool, leaked],
      op: "−",
    };
  },
  () => {
    const jugs = R(2, 6),
      each = R(2, 5),
      total = jugs * each;
    return {
      story: `${total} liters of lemonade are poured equally into ${jugs} jugs. How many liters are in each jug?`,
      answer: each,
      nums: [total, jugs],
      op: "÷",
    };
  },
];
function genVolume() {
  const variant = R(0, 2),
    names = shuffle(KIDS);
  if (variant === 0) {
    /* read the water level */
    const max = R(5, 10),
      level = R(1, max - 1);
    return {
      kind: "num",
      unit: "liters",
      answer: level,
      facts: { t: "beaker", max, level },
      prompt: "How many liters of water are in the container?",
      fig: () => beakerFig(max, level),
      misc: namedMisc(level, [
        [max, `${max} liters is the top mark. Read the mark at the top of the water.`],
        [max - level, "That’s the empty part. Read the mark at the top of the water."],
      ]),
      hint: "Find the top of the water. Read the number on the mark beside it.",
      explain: `The water comes up to the ${level} mark: ${pl(level, "liter")}.`,
    };
  }
  if (variant === 1) {
    /* about how much does it hold? */
    const [thing, right] = pick(HELD),
      at = VOLUMES.indexOf(right),
      wrongs = shuffle(VOLUMES.filter((v, i) => Math.abs(i - at) >= 2)).slice(0, 2);
    return {
      ...mcOf([
        [cap(right), null],
        ...wrongs.map((v) => [
          cap(v),
          VOLUMES.indexOf(v) < at ? `That’s too little for ${thing}.` : `That’s too much for ${thing}.`,
        ]),
      ]),
      facts: { t: "estimateVolume", thing, right },
      prompt: `About how much water does ${thing} hold?`,
      hint: "A big water bottle holds about 1 liter. A bucket holds about 10 liters.",
      explain: `${cap(thing)} holds ${right}.`,
    };
  }
  /* a story with one step */
  const problem = pick(LITER_STORIES)(names),
    [a, b] = problem.nums;
  return {
    kind: "num",
    unit: "liters",
    answer: problem.answer,
    facts: { t: "story", nums: problem.nums, op: problem.op },
    prompt: problem.story,
    fig: (show) =>
      problem.op === "×"
        ? timesTape([{ label: "buckets", times: b, each: a, total: show ? problem.answer : "?" }], {
            label: `Tape diagram: ${b} buckets of ${a}`,
          })
        : problem.op === "÷"
          ? timesTape([{ label: "jugs", times: b, each: show ? problem.answer : "?", total: a }], {
              label: `Tape diagram: ${a} in ${b} equal parts`,
            })
          : partWhole(
              problem.op === "+"
                ? [
                    { n: a, show: a },
                    { n: b, show: b },
                  ]
                : [
                    { n: b, show: b },
                    { n: a - b, show: show ? a - b : "?" },
                  ],
              problem.op === "+" ? (show ? a + b : "?") : a,
              problem.op === "+" ? `Tape diagram: ${a} and ${b}` : `Tape diagram: ${a} split into ${b} and the rest`,
            ),
    misc: namedMisc(problem.answer, [
      problem.op === "+"
        ? [a - b, "That subtracts. More water is added: add."]
        : [a + b, "That adds. Read the story again: which operation is it?"],
    ]),
    hint: {
      "+": "Water is added: add.",
      "−": "Water leaks out: subtract.",
      "×": "Equal buckets: multiply.",
      "÷": "Poured equally: divide.",
    }[problem.op],
    explain: `${a} ${problem.op} ${b} = ${problem.answer} liters.`,
  };
}

/* ---------- Clock Tower: time to the minute and elapsed time (Lessons 9–11) ---------- */
/* a time between 7:00 and 11:00 or 1:00 and 5:00, in minutes after midnight, so nothing crosses 12 */
const someTime = (earliest = 0, latest = 0) => {
  const hour = pick([7, 8, 9, 10, 1, 2, 3, 4]);
  return hour * 60 + R(earliest, 59 - latest);
};
/* the first two wrong choices (times, [label, why]) that differ from the right one and from each other */
const twoDifferent = (right, list) =>
  list.filter(([label], i) => label !== right && list.findIndex(([other]) => other === label) === i).slice(0, 2);
/* things that happen, for elapsed-time stories: [what, how long it can be in minutes] */
const EVENTS = [
  ["The science show", 20, 55],
  ["Recess", 15, 30],
  ["The bus ride", 12, 40],
  ["Art class", 30, 55],
  ["The movie", 35, 55],
];
function genTime() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* read a clock to the minute */
    const t = someTime(),
      h = Math.floor(t / 60),
      m = t % 60,
      next = (h % 12) + 1,
      wrongs = [
        m % 5
          ? [hm(h, m - (m % 5)), `Count by 5s to ${m - (m % 5)}, then by 1s: ${m}.`]
          : [hm(h, m === 55 ? 50 : m + 5), "Count by 5s carefully from the 12."],
        m >= 30
          ? [hm(next, m), `The hour hand hasn’t reached ${next} yet. It’s still after ${h}.`]
          : [hm(h, m + 10 > 59 ? m - 10 : m + 10), "Count the minute marks from the 12 again."],
      ];
    return {
      ...mcOf([[hm(h, m), null], ...wrongs]),
      facts: { t: "clock", h, m },
      prompt: "What time does the clock show?",
      fig: (show) => clockFig(h, m, { fives: show }),
      hint: "The short hand shows the hour. Count by 5s to the long hand, then by 1s for the little marks.",
      explain: `The hour hand is after ${h}, and the minute hand is ${m} minutes past the 12: ${hm(h, m)}.`,
    };
  }
  const [event, shortest, longest] = pick(EVENTS),
    length = R(shortest, longest),
    start = someTime(0, 0),
    end = start + length,
    /* the number line runs from the quarter hour before start to the quarter hour after end */
    lineFrom = Math.floor(start / 15) * 15,
    lineTo = Math.ceil(end / 15) * 15,
    /* jumps to the next hour first when it's crossed, then the rest */
    nextHour = Math.ceil(start / 60) * 60,
    hops =
      nextHour > start && nextHour < end
        ? [
            { a: start, b: nextHour, t: `${nextHour - start} min` },
            { a: nextHour, b: end, t: `${end - nextHour} min` },
          ]
        : [{ a: start, b: end, t: `${length} min` }],
    line = (show, ask) =>
      timeLine(lineFrom, lineTo, {
        hops: show ? hops : [],
        pts: [
          { v: start, t: ask === "start" && !show ? "?" : clockTime(start) },
          { v: end, t: ask === "end" && !show ? "?" : clockTime(end), cls: "b" },
        ],
      }),
    /* reading the times as numbers: 9:52 − 9:15 as 952 − 915 */
    asNumbers = +clockTime(end).replace(":", "") - +clockTime(start).replace(":", ""),
    crosses = Math.floor(start / 60) !== Math.floor(end / 60);
  if (variant === 1)
    /* how long? */
    return {
      kind: "num",
      unit: "minutes",
      answer: length,
      facts: { t: "elapsed", start, end },
      prompt: `${event} starts at ${clockTime(start)} and ends at ${clockTime(end)}. How many minutes long is it?`,
      fig: (show) => line(show),
      misc: namedMisc(length, [
        ...(crosses && asNumbers !== length
          ? [
              [
                asNumbers,
                "That subtracts the times like numbers. An hour is 60 minutes, not 100: jump to the hour first.",
              ],
            ]
          : []),
        ...(crosses
          ? [[end - nextHour, `That’s only the part after ${clockTime(nextHour)}. Add the minutes before it too.`]]
          : []),
      ]),
      hint: crosses
        ? `Jump from ${clockTime(start)} to ${clockTime(nextHour)}, then on to ${clockTime(end)}.`
        : `Count the minutes from ${clockTime(start)} to ${clockTime(end)}.`,
      explain: crosses
        ? `${clockTime(start)} to ${clockTime(nextHour)} is ${nextHour - start} minutes, and ${clockTime(nextHour)} to ${clockTime(end)} is ${end - nextHour} minutes. ${nextHour - start} + ${end - nextHour} = ${length} minutes.`
        : `From ${clockTime(start)} to ${clockTime(end)} is ${length} minutes.`,
    };
  if (variant === 2) {
    /* when does it end? */
    const wrongs = twoDifferent(clockTime(end), [
      ...(crosses
        ? [[hm(((Math.floor(start / 60) + 11) % 12) + 1, end % 60), "The minutes went past 60, so it’s the next hour."]]
        : []),
      [clockTime(start - length), "That’s before it starts. Count forward."],
      [clockTime(end + 10), `Count the ${length} minutes again from ${clockTime(start)}.`],
      [clockTime(end - 10), `Count the ${length} minutes again from ${clockTime(start)}.`],
    ]);
    return {
      ...mcOf([[clockTime(end), null], ...wrongs]),
      facts: { t: "endTime", start, length },
      prompt: `${event} starts at ${clockTime(start)}. It lasts ${length} minutes. When does it end?`,
      fig: (show) => line(show, "end"),
      hint: crosses
        ? `Jump ${nextHour - start} minutes to ${clockTime(nextHour)}, then the rest.`
        : `Count ${length} minutes forward from ${clockTime(start)}.`,
      explain: `${length} minutes after ${clockTime(start)} is ${clockTime(end)}.`,
    };
  }
  /* when did it start? */
  const wrongs = twoDifferent(clockTime(start), [
    ...(crosses
      ? [
          [
            hm(((Math.floor(end / 60) + 11) % 12) + 1, start % 60),
            "Counting back past the hour goes to the hour before.",
          ],
        ]
      : []),
    [clockTime(end + length), "That’s after it ends. Count back."],
    [clockTime(start + 10), `Count the ${length} minutes back again from ${clockTime(end)}.`],
    [clockTime(start - 10), `Count the ${length} minutes back again from ${clockTime(end)}.`],
  ]);
  return {
    ...mcOf([[clockTime(start), null], ...wrongs]),
    facts: { t: "startTime", end, length },
    prompt: `${event} ends at ${clockTime(end)}. It lasted ${length} minutes. When did it start?`,
    fig: (show) => line(show, "start"),
    hint: crosses
      ? `Count back ${end - nextHour} minutes to ${clockTime(nextHour)}, then the rest.`
      : `Count back ${length} minutes from ${clockTime(end)}.`,
    explain: `${length} minutes before ${clockTime(end)} is ${clockTime(start)}.`,
  };
}

/* ---------- Problem Lab: measurement stories (Lessons 12–15) ---------- */
/* two-step stories in liters, grams, or minutes: each returns {story, unit, answer, steps} */
const TWO_STEPS = [
  ([name]) => {
    const each = R(2, 5),
      pitchers = R(2, 4),
      poured = R(2, each * pitchers - 2);
    return {
      id: "pitchers",
      story: `${name} fills ${pitchers} pitchers with ${each} liters of water each, then pours ${poured} liters into a fish tank. How many liters are left in the pitchers?`,
      unit: "liters",
      answer: each * pitchers - poured,
      nums: [pitchers, each, poured],
      steps: [
        `${pitchers} × ${each} = ${pitchers * each}`,
        `${pitchers * each} − ${poured} = ${each * pitchers - poured}`,
      ],
    };
  },
  () => {
    const each = pick([100, 200]),
      /* the beans and the box stay within 1,000 grams */
      bags = R(2, each === 200 ? 3 : 4),
      box = pick([150, 250, 300]);
    return {
      id: "beans",
      story: `Each bag of beans weighs ${each} grams. A box of rice weighs ${box} grams. How many grams do ${bags} bags of beans and the box weigh together?`,
      unit: "grams",
      answer: each * bags + box,
      nums: [each, box, bags],
      steps: [`${bags} × ${each} = ${bags * each}`, `${bags * each} + ${box} = ${each * bags + box}`],
    };
  },
  ([name]) => {
    const practice = pick([15, 20, 25]),
      days = R(2, 4),
      warm = R(5, 15);
    return {
      id: "practice",
      story: `${name} practices piano for ${practice} minutes a day for ${days} days, then plays a ${warm}-minute song. How many minutes is that in all?`,
      unit: "minutes",
      answer: practice * days + warm,
      nums: [practice, days, warm],
      steps: [`${days} × ${practice} = ${days * practice}`, `${days * practice} + ${warm} = ${practice * days + warm}`],
    };
  },
  () => {
    const dog = R(20, 35),
      cat = R(4, 7),
      bag = R(5, 12);
    return {
      id: "vet",
      story: `At the vet, a dog weighs ${dog} kilograms and a cat weighs ${cat} kilograms. A bag of dog food weighs ${bag} kilograms. How many kilograms more is the dog than the cat and the bag together?`,
      unit: "kilograms",
      answer: dog - cat - bag,
      nums: [dog, cat, bag],
      steps: [`${cat} + ${bag} = ${cat + bag}`, `${dog} − ${cat + bag} = ${dog - cat - bag}`],
    };
  },
];
/* stories missing a number, with what they need and two things that don't help */
const MISSING = [
  {
    story: "Han’s dog weighs 18 kilograms. How many kilograms heavier is Han’s dog than Han’s cat?",
    need: "How much the cat weighs",
    not: ["How old the dog is", "What color the cat is"],
  },
  {
    story: "A bucket holds 9 liters. How many buckets of water does it take to fill the fish tank?",
    need: "How many liters the fish tank holds",
    not: ["How tall the bucket is", "How many fish there are"],
  },
  {
    story: "The play started at 2:15. How long was the play?",
    need: "When the play ended",
    not: ["How many people watched", "What day it was"],
  },
  {
    story: "Lin has 3 bags of flour. How many kilograms of flour does Lin have?",
    need: "How much each bag weighs",
    not: ["What the flour is for", "Where Lin bought it"],
  },
  {
    story: "The class pours 4 liters of water into each plant tub. How many liters do they use?",
    need: "How many plant tubs there are",
    not: ["How tall the plants are", "What time they water them"],
  },
];
/* things measured, and the unit that makes sense for each */
const UNIT_SENSE = [
  ["The fish tank holds 40", "liters"],
  ["The big dog weighs 30", "kilograms"],
  ["The apple weighs 200", "grams"],
  ["Recess lasts 20", "minutes"],
  ["The bathtub holds 200", "liters"],
  ["The pencil is 6", "inches"],
];
function genStories() {
  const variant = R(0, 2),
    names = shuffle(KIDS);
  if (variant === 0) {
    /* a story with two steps */
    const problem = pick(TWO_STEPS)(names);
    return {
      kind: "num",
      unit: problem.unit,
      answer: problem.answer,
      facts: { t: "two", id: problem.id, nums: problem.nums },
      prompt: problem.story,
      misc: namedMisc(problem.answer, [
        [+problem.steps[0].split(" = ")[1], "That’s only the first step. Finish the second one."],
      ]),
      hint: `It takes two steps. First: ${problem.steps[0].split(" = ")[0]}.`,
      explain: `First, ${problem.steps[0]}. Then ${problem.steps[1]}. That’s ${problem.answer} ${problem.unit}.`,
    };
  }
  if (variant === 1) {
    /* what do you need to know? */
    const item = pick(MISSING);
    return {
      ...mcOf([[item.need, null], ...item.not.map((n) => [n, "That doesn’t help answer the question."])]),
      stack: true,
      facts: { t: "missing", need: item.need },
      prompt: `${item.story} What do you need to know to answer?`,
      hint: "Find the question. Which number would you need to work it out?",
      explain: `You need to know ${item.need[0].toLowerCase() + item.need.slice(1)}.`,
    };
  }
  /* which unit makes sense? */
  const [text, right] = pick(UNIT_SENSE),
    others = shuffle(
      ["liters", "kilograms", "grams", "minutes", "inches"].filter(
        (u) => u !== right && !(right === "kilograms" && u === "grams") && !(right === "grams" && u === "kilograms"),
      ),
    ).slice(0, 2);
  return {
    ...mcOf([
      [right, null],
      ...others.map((u) => [
        u,
        `${u[0].toUpperCase() + u.slice(1)} measure${u === "minutes" ? " time" : u === "inches" ? " length" : u === "liters" ? " how much a container holds" : " weight"}.`,
      ]),
    ]),
    facts: { t: "unitSense", right },
    prompt: `${text} ___. Which unit makes sense?`,
    hint: "Inches measure length, grams and kilograms weight, liters how much a container holds, and minutes time.",
    explain: `${text} ${right}.`,
  };
}

/* The Grand Prize deals from every station */
const genBoss = () => pick([genRuler, genPlots, genWeight, genVolume, genTime, genStories])();

const ZONES = [
  {
    id: "ruler",
    name: "Measuring Lab",
    lessons: "Lessons 1–3",
    blurb: "Measure to the nearest half and fourth of an inch, and find lengths on a ruler.",
    gen: genRuler,
  },
  {
    id: "plots",
    name: "Data Corner",
    lessons: "Lessons 4–5",
    blurb: "Read line plots of measurements in halves and fourths of an inch.",
    gen: genPlots,
  },
  {
    id: "weight",
    name: "Weigh Station",
    lessons: "Lesson 6",
    blurb: "Read scales in grams and kilograms, estimate weights, and solve weight stories.",
    gen: genWeight,
  },
  {
    id: "volume",
    name: "Water Works",
    lessons: "Lessons 7–8",
    blurb: "Read liters in a container, estimate how much things hold, and solve liquid stories.",
    gen: genVolume,
  },
  {
    id: "time",
    name: "Clock Tower",
    lessons: "Lessons 9–11",
    blurb: "Tell time to the minute, and find how long things last, when they end, and when they start.",
    gen: genTime,
  },
  {
    id: "stories",
    name: "Problem Lab",
    lessons: "Lessons 12–15",
    blurb: "Solve two-step measurement stories, find missing information, and pick units that make sense.",
    gen: genStories,
  },
  {
    id: "boss",
    name: "Grand Prize",
    lessons: "All lessons",
    blurb: "Win the Science Fair! Every right answer adds a star to your trophy.",
    gen: genBoss,
  },
];

/* the trophy with `won` of its 10 stars lit (the boss icon lights all of them) */
const trophy = (won) =>
  '<path d="M20,8H44V24Q44,38 32,40Q20,38 20,24Z" fill="#ffc93c" stroke="#f3f6fb" stroke-width="1.5"/><path d="M20,12H12Q12,26 22,28M44,12H52Q52,26 42,28" fill="none" stroke="#ffc93c" stroke-width="3"/>' +
  '<rect x="28" y="40" width="8" height="8" fill="#ffc93c"/><rect x="20" y="48" width="24" height="8" rx="2" fill="#c97b4b"/>' +
  range(10)
    .map((i) => {
      const x = 6 + i * 5.8;
      return `<circle cx="${x}" cy="61" r="2.4" fill="${i < won ? "#ffc93c" : "rgba(255,255,255,.15)"}"/>`;
    })
    .join("");
/* an icon's line of text, centered at x, y: `size` pixels, in `fill` */
const iconText = (x, y, text, size, fill) =>
  `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="700" text-anchor="middle" font-family="monospace">${text}</text>`;
const ICON = {
  ruler:
    '<rect x="4" y="30" width="56" height="20" rx="2" fill="#f0d9a8" stroke="#c9a86a"/><path d="M8,30V42M22,30V36M36,30V42M50,30V36M15,30V33M29,30V33M43,30V33" stroke="#0a2340" stroke-width="1.5"/>' +
    '<rect x="8" y="14" width="35" height="10" rx="4" fill="#ffc93c"/>',
  plots:
    '<path d="M4,48H60" stroke="#f3f6fb" stroke-width="2"/>' +
    iconText(14, 44, "X", 11, "#ffc93c") +
    iconText(28, 44, "X", 11, "#ffc93c") +
    iconText(28, 33, "X", 11, "#ffc93c") +
    iconText(42, 44, "X", 11, "#ffc93c") +
    iconText(42, 33, "X", 11, "#ffc93c") +
    iconText(42, 22, "X", 11, "#ffc93c") +
    iconText(32, 60, "inches", 8, "#7fe3ff"),
  weight:
    '<path d="M10,40A22,22 0 0 1 54,40Z" fill="#f3f6fb" stroke="#ffc93c" stroke-width="3"/><path d="M32,40L44,24" stroke="#e0445e" stroke-width="3"/><circle cx="32" cy="40" r="3" fill="#0a2340"/>' +
    iconText(32, 56, "500 g", 10, "#7fe3ff"),
  volume:
    '<path d="M18,10V54H46V10" fill="none" stroke="#f3f6fb" stroke-width="3"/><rect x="19" y="30" width="26" height="23" fill="#7fe3ff" opacity=".7"/>' +
    '<path d="M18,20H26M18,30H26M18,40H26" stroke="#f3f6fb" stroke-width="2"/>',
  time: '<circle cx="32" cy="32" r="24" fill="#f3f6fb" stroke="#ffc93c" stroke-width="3"/><path d="M32,32V16M32,32L42,38" stroke="#0a2340" stroke-width="3" stroke-linecap="round"/>',
  stories:
    '<path d="M24,8H40V22L52,52H12L24,22Z" fill="none" stroke="#f3f6fb" stroke-width="2.5"/><path d="M17,40H47L52,52H12Z" fill="#5fe0a8"/>' +
    iconText(32, 20, "?", 10, "#ffc93c"),
  boss: trophy(10),
};
