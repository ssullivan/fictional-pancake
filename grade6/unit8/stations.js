/* Data Detectives (Grade 6 Unit 8): the problem generators, station list, and icons. Loaded by index.html and by
   tools/fuzz.mjs, after figs.js (the statistics, dot plots, box plots, and histograms). Every problem carries facts for
   checks.js: its type (t), the data set's context (ctx) and values, and the numbers its checks need. Each generator deals one
   of a few kinds of problem (type), each with a comment saying what it asks. */
const WHO = ["Lin", "Andre", "Priya", "Diego", "Jada", "Noah", "Mai", "Kiran", "Elena", "Han", "Clare", "Tyler"];
/* a num problem: its named mistakes leave out any that land on the answer, and any repeats */
function numP(p) {
  const misc = (p.misc || []).filter(([v]) => Number.isFinite(v) && v >= 0 && Math.abs(v - p.answer) >= 0.02);
  return { kind: "num", unit: "", ...p, misc: miscOf(p.answer, misc) };
}
/* an mc problem from [[label, why it's wrong, or null for the answer], …], leaving out wrong choices that repeat a label */
function mcP(list, p) {
  const kept = list.filter(([label], i) => list.findIndex(([other]) => other === label) === i);
  return { ...mcOf(kept, { stack: p.stack }), ...p };
}
/* a list of numbers as written */
const listOf = (values) => values.map(fmt).join(", ");

/* ---------- data sets ---------- */
/* n whole numbers from lo to hi (in steps of step), bunched around center: a sum of three random numbers, so values near the
   center are the most common */
function sample(n, { lo, hi, center, spread, step = 1 }) {
  return range(n).map(() => {
    const bump = (Math.random() + Math.random() + Math.random() - 1.5) * spread,
      v = Math.round((center + bump) / step) * step;
    return Math.max(lo, Math.min(hi, v));
  });
}
/* the data sets a dot plot can show: who was asked, what was counted or measured (and its unit), the axis, and where the
   values bunch up (one: the unit for just 1). They’re realistic: pets per home, hours of sleep, and so on */
const DATA = [
  {
    id: "pets",
    who: "families",
    what: "the number of pets in each family’s home",
    axis: "number of pets",
    unit: "pets",
    one: "pet",
    lo: 0,
    hi: 6,
    center: 2,
    spread: 3,
  },
  {
    id: "sleep",
    who: "students",
    what: "how many hours each student slept last night",
    axis: "hours of sleep",
    unit: "hours",
    one: "hour",
    lo: 6,
    hi: 11,
    center: 8.5,
    spread: 3,
  },
  {
    id: "quiz",
    who: "students",
    what: "each student’s score on a quiz out of 10",
    axis: "quiz score (out of 10)",
    unit: "points",
    one: "point",
    lo: 3,
    hi: 10,
    center: 7.5,
    spread: 4,
  },
  {
    id: "siblings",
    who: "students",
    what: "how many brothers and sisters each student has",
    axis: "number of siblings",
    unit: "siblings",
    one: "sibling",
    lo: 0,
    hi: 5,
    center: 1.5,
    spread: 3,
  },
  {
    id: "goals",
    who: "games",
    what: "how many goals a soccer team scored in each game",
    axis: "goals scored",
    unit: "goals",
    one: "goal",
    lo: 0,
    hi: 6,
    center: 2,
    spread: 3.5,
  },
  {
    id: "books",
    who: "students",
    what: "how many books each student read this month",
    axis: "books read",
    unit: "books",
    one: "book",
    lo: 0,
    hi: 8,
    center: 3,
    spread: 4,
  },
];
/* data sets for histograms: the measurement, its unit, where the intervals start, and how wide they are */
const BINNED = [
  {
    id: "height",
    who: "students",
    what: "students’ heights",
    axis: "height (cm)",
    unit: "cm",
    lo: 120,
    width: 10,
    bins: 5,
  },
  {
    id: "reading",
    who: "students",
    what: "minutes each student read last night",
    axis: "minutes of reading",
    unit: "minutes",
    lo: 0,
    width: 10,
    bins: 6,
  },
  {
    id: "jump",
    who: "students",
    what: "students’ standing long jumps",
    axis: "long jump (inches)",
    unit: "inches",
    lo: 30,
    width: 10,
    bins: 5,
  },
  {
    id: "age",
    who: "people",
    what: "the ages of people at a library event",
    axis: "age (years)",
    unit: "years",
    lo: 0,
    width: 10,
    bins: 8,
  },
];
/* a dot plot of one of the DATA sets, on its own axis */
const plotOf = (data, values, opts = {}) =>
  dotPlot(values, { lo: data.lo, hi: data.hi, xLabel: data.axis, label: `Dot plot of ${data.what}`, ...opts });
/* the facts a data set gives checks.js */
const dataFacts = (data, values) => ({ ctx: data.id, values });

/* ---------- Station 1: statistical questions and kinds of data (Lessons 1–3) ---------- */
/* questions about a group (statistical: the answers vary), the same about one person, and a fact with one answer */
const QUESTIONS = [
  [
    "How many hours do students in our class sleep on a school night?",
    "How many hours did Lin sleep last night?",
    "How many hours are in a day?",
  ],
  [
    "How tall are the players on the soccer team?",
    "How tall is the tallest player on the team?",
    "How tall is the school’s front door?",
  ],
  [
    "How many pets do families in our school have?",
    "How many pets does Andre’s family have?",
    "How many legs does a dog have?",
  ],
  ["How long does it take students to get to school?", "What time does school start?", "How long is a school day?"],
  [
    "How many books did sixth graders read this summer?",
    "How many books did Priya read this summer?",
    "How many pages are in this book?",
  ],
  [
    "What are the favorite sports of students in our grade?",
    "What is Diego’s favorite sport?",
    "How many players are on a basketball team at once?",
  ],
];
/* data that's categorical (words or groups) or numerical (numbers you could put on a number line) */
const KINDS = {
  categorical: [
    "the favorite fruit of each student",
    "the color of each car in a parking lot",
    "the kind of pet each family has",
    "the month each student was born in",
    "each player’s team",
    "how each student gets to school (walk, bus, car, or bike)",
  ],
  numerical: [
    "the height of each student, in centimeters",
    "the number of pets each family has",
    "how many minutes each student read last night",
    "the weight of each backpack, in pounds",
    "the number of siblings each student has",
    "each player’s points in the last game",
  ],
};
function genQuestion() {
  const type = pick(["stat", "stat", "kind", "kind", "display"]);
  if (type === "stat") {
    /* which question is statistical: the answers to it would vary */
    const [group, aboutOne, fact] = pick(QUESTIONS);
    return mcP(
      [
        [group, null],
        [
          aboutOne,
          "That asks about one person or one thing, so there’s just one answer. A statistical question expects answers that vary.",
        ],
        [fact, "That has one answer that doesn’t vary. A statistical question expects data that vary."],
      ],
      {
        prompt: "Which is a <b>statistical question</b>?",
        stack: true,
        hint: "A statistical question is answered with data that vary: you’d expect different answers from different people or things.",
        explain: `“${group}” would get many different answers. That variability makes it a statistical question.`,
        facts: { t: type },
      },
    );
  }
  if (type === "kind") {
    /* which data set is numerical (or categorical), from three */
    const wantNumbers = Math.random() < 0.5,
      [right, other] = wantNumbers ? ["numerical", "categorical"] : ["categorical", "numerical"],
      answer = pick(KINDS[right]),
      wrong = shuffle(KINDS[other]).slice(0, 2);
    return mcP(
      [
        [answer, null],
        ...wrong.map((w) => [
          w,
          right === "numerical"
            ? "That data is words or groups, not numbers: it’s categorical."
            : "That data is numbers you could put on a number line: it’s numerical.",
        ]),
      ],
      {
        prompt: `Which data is <b>${right}</b>?`,
        stack: true,
        hint: "Numerical data are numbers you could put on a number line, like heights or counts. Categorical data are groups or words, like colors or favorite foods.",
        explain: `“${answer[0].toUpperCase() + answer.slice(1)}” is ${right} data${right === "numerical" ? ": numbers that go on a number line" : ": groups, not numbers"}.`,
        facts: { t: type },
      },
    );
  }
  /* which display fits a data set: a bar graph for categories, a dot plot or histogram for numbers */
  const categorical = Math.random() < 0.5,
    data = pick(KINDS[categorical ? "categorical" : "numerical"]),
    count = pick([20, 24, 25, 30]);
  return mcP(
    [
      [
        "a bar graph",
        categorical
          ? null
          : "A bar graph shows categories. These are numbers, so they go on a number line: a dot plot.",
      ],
      [
        "a dot plot",
        categorical
          ? "A dot plot needs a number line, and this data is categories, not numbers. Use a bar graph."
          : null,
      ],
    ],
    {
      prompt: `A class collects ${data} for ${count} students. Which display fits the data?`,
      hint: "Is the data numbers you could put on a number line, or categories?",
      explain: categorical
        ? "The data are categories, so a bar graph fits: one bar for each category."
        : "The data are numbers, so they go on a number line: a dot plot (or a histogram).",
      facts: { t: type, count: [count] },
    },
  );
}

/* ---------- Station 2: dot plots (Lessons 4–5) ---------- */
function genDot() {
  const type = pick(["atLeast", "atLeast", "total", "mode", "mode", "fraction", "range"]),
    data = pick(DATA),
    n = pick(type === "fraction" ? [10, 20] : [10, 12, 14, 15, 16, 18, 20]),
    values = sample(n, data);
  const facts = { t: type, ...dataFacts(data, values) },
    intro = `The dot plot shows ${data.what}.`;
  if (type === "atLeast") {
    /* how many have at least (or more than) a value: counting dots, not columns */
    const cut = pick(range(data.hi - data.lo - 1).map((i) => data.lo + 1 + i)),
      strict = Math.random() < 0.4,
      answer = values.filter((v) => (strict ? v > cut : v >= cut)).length,
      columns = new Set(values.filter((v) => (strict ? v > cut : v >= cut))).size,
      other = values.filter((v) => (strict ? v >= cut : v > cut)).length;
    if (!answer || answer === n) return genDot();
    return numP({
      prompt: `${intro} How many ${data.who} had <b>${strict ? "more than" : "at least"} ${cut}</b> ${cut === 1 ? data.one : data.unit}?`,
      answer,
      unit: data.who,
      fig: (show) => plotOf(data, values, { blue: show ? (v) => (strict ? v > cut : v >= cut) : null }),
      hint: `Each dot is one of the ${data.who}. Count the dots ${strict ? `to the right of ${cut}` : `at ${cut} and to the right`}.`,
      misc: [
        [columns, "That counts the columns. Each dot is one of the " + data.who + ": count the dots."],
        [
          other,
          strict
            ? `“More than ${cut}” leaves out the dots at ${cut}.`
            : `“At least ${cut}” includes the dots at ${cut}.`,
        ],
      ],
      explain: `${answer} dots are ${strict ? `to the right of ${cut}` : `at ${cut} or to the right`}.`,
      facts,
    });
  }
  if (type === "total") {
    /* how many were asked: one dot each */
    return numP({
      prompt: `${intro} How many ${data.who} are in the data set?`,
      answer: n,
      unit: data.who,
      fig: () => plotOf(data, values),
      hint: `Each dot stands for one of the ${data.who}. Count every dot.`,
      misc: [
        [new Set(values).size, "That counts the columns. Count the dots: each one is one of the " + data.who + "."],
        [
          Math.max(...values),
          "That’s the greatest value. Count the dots instead: one for each of the " + data.who + ".",
        ],
      ],
      explain: `There are ${n} dots, so ${n} ${data.who} are in the data set.`,
      facts,
    });
  }
  if (type === "mode") {
    /* tap the column for the most common value (one that's clearly the most common) */
    const counts = {};
    values.forEach((v) => (counts[v] = (counts[v] || 0) + 1));
    const sortedCounts = Object.values(counts).sort((a, b) => b - a);
    if (sortedCounts[0] === sortedCounts[1]) return genDot();
    const mode = +Object.keys(counts).find((k) => counts[k] === sortedCounts[0]);
    return {
      kind: "tap",
      prompt: `${intro} Tap the column for the <b>most common</b> value.`,
      answer: String(mode),
      why: Object.fromEntries(
        range(data.hi - data.lo + 1)
          .map((i) => data.lo + i)
          .filter((v) => v !== mode)
          .map((v) => [
            String(v),
            `${counts[v] || 0} of the ${data.who} had ${v}. The tallest stack of dots is at ${mode}: ${counts[mode]} dots.`,
          ]),
      ),
      fig: (show) => plotOf(data, values, { tap: "cand", blue: show ? mode : null }),
      hint: "The most common value has the tallest stack of dots.",
      explain: `The tallest stack is at ${mode}, with ${counts[mode]} dots.`,
      facts,
    };
  }
  if (type === "fraction") {
    /* what fraction of the group had a value */
    const counts = {};
    values.forEach((v) => (counts[v] = (counts[v] || 0) + 1));
    const target = pick(Object.keys(counts).map(Number)),
      k = counts[target];
    if (k === n) return genDot();
    return numP({
      prompt: `${intro} What fraction of the ${data.who} had exactly ${target} ${target === 1 ? data.one : data.unit}?`,
      answer: k / n,
      frac: true,
      fig: (show) => plotOf(data, values, { blue: show ? target : null }),
      hint: `Count the dots at ${target}, then compare with all ${n} dots.`,
      misc: [
        [k, `${k} is how many had ${target}. As a fraction of all ${n}: ${k}/${n}.`],
        [n / k, "That’s upside down: the part goes on top, the whole on the bottom."],
      ],
      explain: `${k} of the ${n} dots are at ${target}: ${k}/${n}${gcd(k, n) > 1 ? ` = ${k / gcd(k, n)}/${n / gcd(k, n)}` : ""}.`,
      facts: { ...facts, frac: [k, n] },
    });
  }
  /* the range: greatest minus least */
  const most = Math.max(...values),
    least = Math.min(...values);
  if (most === least) return genDot();
  return numP({
    prompt: `${intro} What is the <b>range</b> of the data: the difference between the greatest and least values?`,
    answer: most - least,
    unit: data.unit,
    fig: (show) => plotOf(data, values, { blue: show ? (v) => v === most || v === least : null }),
    hint: "Find the dot farthest left and the dot farthest right. How far apart are they?",
    misc: [
      [most, `${most} is the greatest value. Subtract the least value, ${least}.`],
      [data.hi - data.lo, `That’s the length of the whole number line. The data go from ${least} to ${most}.`],
    ],
    explain: `The greatest value is ${most} and the least is ${least}: ${most} − ${least} = ${most - least}.`,
    facts,
  });
}

/* ---------- Station 3: histograms (Lessons 6–8) ---------- */
/* histogram shapes: counts for each bar, and the name of the shape */
const SHAPES = {
  symmetric: [
    [1, 3, 6, 3, 1],
    [2, 4, 8, 4, 2],
    [1, 4, 7, 7, 4, 1],
    [2, 5, 6, 5, 2],
  ],
  right: [
    [7, 9, 4, 2, 1],
    [5, 8, 5, 2, 1, 1],
    [9, 6, 3, 2, 1],
  ],
  left: [
    [1, 2, 4, 9, 7],
    [1, 1, 2, 5, 8, 5],
    [1, 2, 3, 6, 9],
  ],
  two: [
    [6, 3, 1, 3, 7],
    [2, 7, 2, 1, 6, 2],
    [5, 2, 1, 2, 6],
  ],
};
const SHAPE_NAMES = {
  symmetric: "roughly symmetric",
  right: "skewed, with a long tail to the right",
  left: "skewed, with a long tail to the left",
  two: "two peaks",
};
/* a histogram of one of the BINNED data sets */
const histOf = (data, counts, opts = {}) =>
  histogram(counts, { lo: data.lo, width: data.width, xLabel: data.axis, yLabel: `number of ${data.who}`, ...opts });
function genHist() {
  const type = pick(["bin", "bin", "atLeast", "total", "shape", "shape", "spread"]),
    data = pick(BINNED),
    bins = data.bins,
    /* counts for each bar: a shape when the question is about shape, otherwise bunched in the middle */
    counts =
      type === "shape"
        ? null
        : range(bins).map((i) =>
            Math.max(type === "spread" ? 0 : 1, Math.round(8 - Math.abs(i - (bins - 1) / 2) * 2.5 + R(-2, 2))),
          ),
    edge = (i) => data.lo + i * data.width;
  if (type === "bin") {
    /* how many in one interval: the bar's height, not where it starts */
    const i = R(0, bins - 1);
    return numP({
      prompt: `The histogram shows ${data.what}. How many ${data.who} are in the interval from ${edge(i)} up to ${edge(i + 1)} ${data.unit}?`,
      answer: counts[i],
      unit: data.who,
      fig: (show) => histOf(data, counts, { hi: show ? i : -1 }),
      hint: "Find the bar for that interval. Its height, read on the side, is how many are in it.",
      misc: [
        [
          edge(i),
          `${edge(i)} is where the interval starts, on the bottom. The bar’s height says how many: read it on the side.`,
        ],
        [counts[i + 1], `That’s the next bar, from ${edge(i + 1)} up to ${edge(i + 2)}.`],
      ],
      explain: `The bar from ${edge(i)} to ${edge(i + 1)} reaches ${counts[i]} on the side, so ${counts[i]} ${data.who}.`,
      facts: { t: type, ctx: data.id, counts },
    });
  }
  if (type === "atLeast") {
    /* how many are at least some value: the bars from there on */
    const i = R(1, bins - 1),
      answer = counts.slice(i).reduce((s, c) => s + c, 0);
    return numP({
      prompt: `The histogram shows ${data.what}. Each interval includes its left end. How many ${data.who} are <b>at least ${edge(i)} ${data.unit}</b>?`,
      answer,
      unit: data.who,
      fig: (show) => histOf(data, counts, { hi: show ? i : -1 }),
      hint: `Add the heights of every bar from ${edge(i)} on.`,
      misc: [
        [counts[i], `That’s only the bar from ${edge(i)} to ${edge(i + 1)}. Add the bars after it too.`],
        [answer + counts[i - 1], `The bar before ${edge(i)} is for values less than ${edge(i)}, so leave it out.`],
      ],
      explain: `${counts.slice(i).join(" + ")} = ${answer}.`,
      facts: { t: type, ctx: data.id, counts },
    });
  }
  if (type === "total") {
    /* how many in all: every bar's height added up */
    const total = counts.reduce((s, c) => s + c, 0);
    return numP({
      prompt: `The histogram shows ${data.what}. How many ${data.who} are in the data set?`,
      answer: total,
      unit: data.who,
      fig: () => histOf(data, counts),
      hint: "Each bar’s height is how many are in that interval. Add them all.",
      misc: [
        [bins, "That counts the bars. Add up how tall they are instead."],
        [Math.max(...counts), "That’s the tallest bar. Add up all the bars."],
      ],
      explain: `${counts.join(" + ")} = ${total}.`,
      facts: { t: type, ctx: data.id, counts },
    });
  }
  if (type === "shape") {
    /* the shape of a distribution */
    const shape = pick(Object.keys(SHAPES)),
      shapeCounts = pick(SHAPES[shape]),
      shapeData = { ...data, bins: shapeCounts.length };
    const whyNot = {
      symmetric: "A symmetric histogram is about the same on both sides of the middle.",
      right: "Skewed right has a long tail of a few bars stretching off to the right.",
      left: "Skewed left has a long tail of a few bars stretching off to the left.",
      two: "Two peaks means two separate high places, with lower bars between them.",
    };
    return mcP(
      Object.keys(SHAPE_NAMES).map((s) => [SHAPE_NAMES[s], s === shape ? null : whyNot[s]]),
      {
        prompt: `The histogram shows ${data.what}. Which describes its shape?`,
        stack: true,
        fig: () => histOf(shapeData, shapeCounts),
        hint: "Look at where the tall bars are. Is it balanced, does it trail off to one side, or does it have two high places?",
        explain: `It’s ${SHAPE_NAMES[shape]}. ${whyNot[shape]}`,
        facts: { t: type, ctx: data.id, counts: shapeCounts },
      },
    );
  }
  /* which of two histograms has more variability: values spread out (flat), or bunched in the middle (one tall bar) */
  const n = 20,
    spreadOut = [4, 4, 4, 4, 4],
    bunched = pick([
      [1, 2, 14, 2, 1],
      [0, 3, 14, 3, 0],
      [1, 3, 12, 3, 1],
    ]),
    flatFirst = Math.random() < 0.5,
    [first, second] = flatFirst ? [spreadOut, bunched] : [bunched, spreadOut],
    five = { ...data, bins: 5 };
  return mcP(
    [
      [`Group ${flatFirst ? "A" : "B"}`, null],
      [
        `Group ${flatFirst ? "B" : "A"}`,
        "Its bars are bumpier, but most of its values are bunched in the middle interval. That’s less variability, not more.",
      ],
      [
        "They have the same variability",
        "They have the same number of values, but one group’s are spread across every interval and the other’s are bunched together.",
      ],
    ],
    {
      prompt: `Two groups of ${n} ${data.who} were measured. Which group’s ${data.unit === "years" ? "ages" : "values"} have more <b>variability</b>?`,
      fig: () =>
        `<p class="figcap">Group A</p>${histOf(five, first, { label: "Histogram for group A" })}<p class="figcap">Group B</p>${histOf(five, second, { label: "Histogram for group B" })}`,
      hint: "More variability means the values are more spread out. Where are most of each group’s values?",
      explain: `Group ${flatFirst ? "A" : "B"}’s values are spread evenly across every interval; group ${flatFirst ? "B" : "A"}’s are bunched in the middle. A flat histogram can have a lot of variability.`,
      facts: { t: type, ctx: data.id, counts: [...first, ...second] },
    },
  );
}

/* ---------- Station 4: the mean (Lessons 9–10) ---------- */
/* n values from a DATA set whose mean is a whole number (or a half, when halves is true): deal until the sum divides evenly */
function friendlyValues(data, n, halves = false) {
  let values;
  do values = sample(n, data);
  while ((values.reduce((s, v) => s + v, 0) * (halves ? 2 : 1)) % n || new Set(values).size < 2);
  return values;
}
/* things friends share equally: what they have, and the unit */
const SHARES = [
  ["picked", "apples"],
  ["collected", "shells"],
  ["baked", "cookies"],
  ["found", "pinecones"],
];
function genMean() {
  const type = pick(["mean", "mean", "share", "missing", "missing", "balance"]);
  if (type === "mean" || type === "share") {
    /* the mean of a few values, or the same thing as a fair share */
    const data = pick(DATA),
      n = R(4, 6),
      values = type === "share" ? range(n).map(() => R(2, 12)) : friendlyValues(data, n, Math.random() < 0.3);
    const sum = values.reduce((s, v) => s + v, 0);
    if (type === "share" && sum % n) return genMean();
    const mean = sum / n,
      median = medianOf(values),
      [verb, things] = pick(SHARES),
      names = shuffle(WHO).slice(0, n);
    return numP({
      prompt:
        type === "share"
          ? `${n} friends ${verb} ${things}: ${names.map((name, i) => `${name} ${values[i]}`).join(", ")}. If they share the ${things} equally, how many does each friend get?`
          : `Here is ${data.what}, for ${n} ${data.who}: <b>${listOf(values)}</b>. What is the <b>mean</b>?`,
      answer: mean,
      unit: type === "share" ? things : data.unit,
      ...(type === "share" ? {} : { fig: (show) => plotOf(data, values, { mean: show ? mean : null }) }),
      hint: `Add all ${n} values, then share the total equally among ${n}.`,
      misc: [
        [sum, `That’s the total. Share it among the ${n} ${type === "share" ? "friends" : data.who}: ${sum} ÷ ${n}.`],
        [sum / (n - 1), `Divide by how many values there are: ${n}, not ${n - 1}.`],
        [median, `${fmt(median)} is the median (the middle value). The mean is the total shared equally.`],
      ],
      explain: `${values.join(" + ")} = ${sum}, and ${sum} ÷ ${n} = ${fmt(mean)}.`,
      facts: type === "share" ? { t: type, count: values } : { t: type, ...dataFacts(data, values), mean },
    });
  }
  if (type === "missing") {
    /* the value that gives a set of scores a given mean: the total the mean needs, minus the others */
    const n = R(4, 5),
      mean = R(6, 8),
      known = range(n - 1).map(() => R(5, 10)),
      missing = mean * n - known.reduce((s, v) => s + v, 0);
    if (missing < 3 || missing > 10) return genMean();
    const name = pick(WHO);
    return numP({
      prompt: `${name} has taken ${n} quizzes, each out of 10. The mean score is <b>${mean}</b>. ${n - 1} of the scores are ${listOf(known)}. What is the other score?`,
      answer: missing,
      unit: "points",
      hint: `A mean of ${mean} over ${n} quizzes means the scores add up to ${mean} · ${n}. What’s left for the last one?`,
      misc: [
        [
          mean,
          `If the last score were ${mean}, the mean would be different: the other scores don’t average ${mean}. Find the total first: ${mean} · ${n}.`,
        ],
        [mean * n, `${mean * n} is the total of all ${n} scores. Subtract the ${n - 1} you know.`],
      ],
      explain: `The ${n} scores add up to ${mean} · ${n} = ${mean * n}. The others add up to ${known.reduce((s, v) => s + v, 0)}, so the last is ${mean * n} − ${known.reduce((s, v) => s + v, 0)} = ${missing}.`,
      facts: { t: type, ctx: "quiz", values: [...known, missing], mean },
    });
  }
  /* where a dot plot balances: the mean */
  const data = pick(DATA),
    values = friendlyValues(data, R(6, 9)),
    mean = meanOf(values),
    median = medianOf(values);
  return numP({
    prompt: `The dot plot shows ${data.what}. At what number would the dot plot <b>balance</b>, like a seesaw?`,
    answer: mean,
    unit: data.unit,
    fig: (show) => plotOf(data, values, { mean: show ? mean : null, dists: show, fulcrum: show ? mean : null }),
    hint: "The balance point is the mean: the distances of the dots on the left add up to the distances on the right. Or add the values and divide.",
    misc: [
      [
        median,
        `${fmt(median)} is the median: as many dots on each side. The balance point is where the distances on each side are equal: the mean.`,
      ],
      [(data.lo + data.hi) / 2, "That’s the middle of the number line, not of the data."],
    ],
    explain: `The values add up to ${values.reduce((s, v) => s + v, 0)}, and ${values.reduce((s, v) => s + v, 0)} ÷ ${values.length} = ${fmt(mean)}. The distances to ${fmt(mean)} on each side balance.`,
    facts: { t: type, ...dataFacts(data, values), mean },
  });
}

/* ---------- Station 5: variability and MAD (Lessons 11–12) ---------- */
/* n values (4 or 5) around a whole-number mean, spread out by up to `spread` */
function aroundMean(n, center, spread) {
  let values;
  do values = range(n).map(() => center + R(-spread, spread));
  while (values.reduce((s, v) => s + v, 0) !== center * n || new Set(values).size < 3);
  return values;
}
/* things counted on several days: what was counted, and the axis for its dot plot */
const TALLIES = [
  { did: "counted the birds at a bird feeder each morning", axis: "birds at the feeder" },
  { did: "counted push-ups", axis: "push-ups" },
  { did: "counted pages read", axis: "pages read" },
  { did: "counted the cars that passed the school in one minute", axis: "cars in one minute" },
];
/* two players and what they scored */
const PLAYERS = [
  ["points", "basketball games"],
  ["laps", "swim practices"],
  ["baskets", "basketball games"],
];
function genMad() {
  const type = pick(["mad", "mad", "mad", "consistent", "consistent"]);
  if (type === "mad") {
    /* the MAD of 4 or 5 values: the average distance from the mean */
    const story = pick(TALLIES),
      n = pick([4, 5]),
      center = R(5, 10),
      values = aroundMean(n, center, pick([2, 3, 4])),
      distances = values.map((v) => Math.abs(v - center)),
      total = distances.reduce((s, d) => s + d, 0),
      mad = total / n;
    return numP({
      prompt: `${pick(WHO)} ${story.did} on ${n} days: <b>${listOf(values)}</b>. The mean is ${center}. What is the <b>mean absolute deviation</b> (MAD)?`,
      answer: mad,
      fig: (show) => dotPlot(values, { lo: center - 5, hi: center + 5, xLabel: story.axis, mean: center, dists: show }),
      hint: `Find each value’s distance from ${center}: ${values.map((v) => Math.abs(v - center)).join(", ")}. Then find the mean of those distances.`,
      misc: [
        [total, `${total} is the total of the distances. The MAD is their mean: divide by ${n}.`],
        [0, "Signed differences (some negative) always add up to 0. Use distances, which are never negative."],
        [rangeOf(values), "That’s the range. The MAD is the average distance from the mean."],
      ],
      explain: `Distances from ${center}: ${distances.join(", ")}. They add up to ${total}, and ${total} ÷ ${n} = ${fmt(mad)}.`,
      facts: { t: type, values, mean: center, mad, count: values },
    });
  }
  /* which of two players is more consistent: the one with the smaller MAD */
  const [what, games] = pick(PLAYERS),
    center = R(4, 8),
    names = shuffle(WHO).slice(0, 2),
    steady = aroundMean(5, center, 1),
    wild = aroundMean(5, center, 4),
    steadyFirst = Math.random() < 0.5,
    [firstValues, secondValues] = steadyFirst ? [steady, wild] : [wild, steady],
    rows = [
      [names[0], firstValues],
      [names[1], secondValues],
    ],
    steadyName = names[steadyFirst ? 0 : 1],
    wildName = names[steadyFirst ? 1 : 0];
  if (madOf(steady) >= madOf(wild)) return genMad();
  return mcP(
    [
      [steadyName, null],
      [
        wildName,
        `${wildName}’s MAD is greater (${fmt(madOf(wild))}): ${wildName}’s ${what} vary more from game to game. A smaller MAD is more consistent.`,
      ],
      [
        "They’re the same",
        `Their means are both ${center}, but their MADs are different: ${fmt(madOf(steady))} and ${fmt(madOf(wild))}.`,
      ],
    ],
    {
      prompt: `${names[0]} and ${names[1]} each played 5 ${games}. Their ${what}:<br>${rows.map(([name, v]) => `${name}: ${listOf(v)} (mean ${center}, MAD ${fmt(madOf(v))})`).join("<br>")}<br>Whose ${what} are <b>more consistent</b>?`,
      fig: (show) =>
        rows
          .map(
            ([name, v]) =>
              `<p class="figcap">${name}</p>${dotPlot(v, { lo: center - 5, hi: center + 5, xLabel: what, mean: center, dists: show, label: `Dot plot of ${name}’s ${what}` })}`,
          )
          .join(""),
      hint: "More consistent means the values stay closer to the mean: a smaller MAD.",
      explain: `Both means are ${center}. ${steadyName}’s MAD is ${fmt(madOf(steady))} and ${wildName}’s is ${fmt(madOf(wild))}, so ${steadyName}’s ${what} stay closer to the mean.`,
      facts: { t: type, values: [...steady, ...wild] },
    },
  );
}

/* ---------- Station 6: the median, quartiles, and IQR (Lessons 13–15) ---------- */
function genMedian() {
  const type = pick(["odd", "odd", "even", "outlier", "quartile", "quartile"]);
  if (type === "odd" || type === "even") {
    /* the median of an unsorted list: the middle as written, and one middle value of an even count, are the mistakes */
    const data = pick(DATA),
      n = type === "odd" ? pick([5, 7, 9]) : pick([4, 6, 8]),
      values = sample(n, data),
      median = medianOf(values),
      sorted = sortUp(values),
      written = n % 2 ? values[(n - 1) / 2] : (values[n / 2 - 1] + values[n / 2]) / 2;
    /* an answer of 0 is dealt again (every answer in this game is positive), and so are most even counts with a whole-number
       median, so halves come up */
    if (!median || (type === "even" && Number.isInteger(median) && Math.random() < 0.6)) return genMedian();
    return numP({
      prompt: `Here is ${data.what}, for ${n} ${data.who}: <b>${listOf(values)}</b>. What is the <b>median</b>?`,
      answer: median,
      unit: data.unit,
      fig: (show) => plotOf(data, values, { median: show ? median : null }),
      hint:
        n % 2
          ? "Put the values in order first. The median is the one in the middle."
          : "Put the values in order. With an even number of values, the median is halfway between the two in the middle.",
      misc: [
        [written, "That’s the middle of the list as written. Put the values in order first."],
        ...(n % 2
          ? []
          : [
              [
                sorted[n / 2 - 1],
                `That’s one of the two middle values. The median is halfway between ${sorted[n / 2 - 1]} and ${sorted[n / 2]}.`,
              ],
            ]),
        ...(n % 2
          ? []
          : [
              [
                sorted[n / 2],
                `That’s one of the two middle values. The median is halfway between ${sorted[n / 2 - 1]} and ${sorted[n / 2]}.`,
              ],
            ]),
        /* the mean, when it's a number someone might type (one decimal place at most) */
        ...(Number.isInteger(meanOf(values) * 10)
          ? [[meanOf(values), "That’s the mean. The median is the middle value of the sorted list."]]
          : []),
      ],
      explain: `In order: ${listOf(sorted)}. ${n % 2 ? `The middle value is ${fmt(median)}.` : `The two middle values are ${sorted[n / 2 - 1]} and ${sorted[n / 2]}, and halfway between them is ${fmt(median)}.`}`,
      facts: { t: type, ...dataFacts(data, values), median },
    });
  }
  if (type === "outlier") {
    /* with one value far from the rest, the median describes a typical value better than the mean */
    const base = sortUp(range(5).map(() => R(10, 20))),
      far = R(55, 80),
      values = shuffle([...base, far]),
      mean = meanOf(values),
      median = medianOf(values);
    if (!Number.isInteger(mean * 2) || mean - median < 5) return genMedian();
    return mcP(
      [
        [`the median, ${fmt(median)} minutes`, null],
        [
          `the mean, ${fmt(mean)} minutes`,
          `The one long time, ${far} minutes, pulls the mean up past most of the values. The median isn’t pulled.`,
        ],
        [`the range, ${far - base[0]} minutes`, "The range is a measure of spread, not a typical value."],
      ],
      {
        prompt: `Six students timed their trips to school, in minutes: <b>${listOf(values)}</b>. Which describes a <b>typical</b> trip better?`,
        stack: true,
        fig: (show) =>
          dotPlot(values, {
            lo: 0,
            hi: 80,
            step: 5,
            every: 10,
            xLabel: "minutes to get to school",
            mean: show ? mean : null,
            median: show ? median : null,
          }),
        hint: "One trip is much longer than the rest. Which measure does one far-off value pull away from the others?",
        explain: `The mean, ${fmt(mean)}, is pulled up by the ${far}-minute trip. The median, ${fmt(median)}, sits among the other trips, so it’s more typical.`,
        facts: { t: type, ctx: "trip", values },
      },
    );
  }
  /* Q1, Q3, or the IQR of an unsorted list; the range, and halves that wrongly include the median, are the mistakes */
  const data = pick(DATA),
    n = pick([7, 8, 9, 10, 11]),
    values = sample(n, data),
    [q1, median, q3] = quartilesOf(values),
    sorted = sortUp(values),
    ask = pick(["Q1", "Q3", "IQR"]),
    answer = ask === "Q1" ? q1 : ask === "Q3" ? q3 : q3 - q1,
    /* the mistake of keeping the middle value in each half, for an odd count */
    keptQ1 = medianOf(sorted.slice(0, Math.ceil(n / 2))),
    keptQ3 = medianOf(sorted.slice(Math.floor(n / 2)));
  if (q3 === q1 || !answer) return genMedian();
  return numP({
    prompt: `Here is ${data.what}, for ${n} ${data.who}: <b>${listOf(values)}</b>. What is ${ask === "IQR" ? "the <b>interquartile range</b> (IQR)" : `the ${ask === "Q1" ? "first" : "third"} quartile, <b>${ask}</b>`}?`,
    answer,
    unit: data.unit,
    fig: (show) => plotOf(data, values, { box: show ? fiveOf(values) : null }),
    hint: `Put the values in order and find the median. ${ask === "Q3" ? "Q3 is the median of the upper half." : "Q1 is the median of the lower half"}${ask === "IQR" ? ", and Q3 of the upper half. The IQR is Q3 − Q1." : ask === "Q1" ? "." : ""}${n % 2 ? ` With ${n} values, leave the middle one out of both halves.` : ""}`,
    misc: [
      ...(ask === "IQR"
        ? [
            [
              rangeOf(values),
              "That’s the range (greatest − least). The IQR is the spread of the middle half: Q3 − Q1.",
            ],
            [median, "That’s the median. The IQR is Q3 − Q1."],
          ]
        : ask === "Q1"
          ? [
              [median, "That’s the median of all the values. Q1 is the median of the lower half."],
              ...(n % 2
                ? [
                    [
                      keptQ1,
                      `That keeps the middle value, ${median}, in the lower half. With an odd count, leave it out.`,
                    ],
                  ]
                : []),
            ]
          : [
              [median, "That’s the median of all the values. Q3 is the median of the upper half."],
              ...(n % 2
                ? [
                    [
                      keptQ3,
                      `That keeps the middle value, ${median}, in the upper half. With an odd count, leave it out.`,
                    ],
                  ]
                : []),
            ]),
    ],
    explain: `In order: ${listOf(sorted)}. The median is ${fmt(median)}; Q1 = ${fmt(q1)} and Q3 = ${fmt(q3)}${ask === "IQR" ? `, so the IQR is ${fmt(q3)} − ${fmt(q1)} = ${fmt(q3 - q1)}` : ""}.`,
    facts: { t: type, ...dataFacts(data, values) },
  });
}

/* ---------- Station 7: box plots (Lessons 16–17) ---------- */
/* the words for each part of a box plot, and its five numbers */
const FIVE_NAMES = ["the minimum", "Q1", "the median", "Q3", "the maximum"];
const PARTS = {
  w1: "from the minimum to Q1",
  b1: "from Q1 to the median",
  b2: "from the median to Q3",
  w2: "from Q3 to the maximum",
};
/* a data set of 9 to 12 values for a box plot, whose five numbers are all different */
function boxValues(data) {
  let values;
  do values = sample(R(9, 12), data);
  while (new Set(fiveOf(values)).size < 5);
  return values;
}
function genBox() {
  const type = pick(["read", "read", "iqr", "part", "quarter", "compare"]),
    data = pick(DATA.filter((d) => d.hi - d.lo >= 6)),
    values = boxValues(data),
    five = fiveOf(values),
    [least, q1, median, q3, most] = five,
    box = (opts = {}) => boxPlot(five, { lo: data.lo, hi: data.hi, xLabel: data.axis, ...opts });
  if (type === "read") {
    /* one of the five numbers from a box plot (dealt again when it's 0: every answer in this game is positive) */
    const k = R(0, 4);
    if (!five[k]) return genBox();
    return numP({
      prompt: `The box plot shows ${data.what}. What is <b>${FIVE_NAMES[k]}</b>?`,
      answer: five[k],
      unit: data.unit,
      fig: (show) => (show ? dotPlot(values, { lo: data.lo, hi: data.hi, xLabel: data.axis, box: five }) : box()),
      hint: "From left to right, a box plot marks the minimum, Q1 (the box’s left side), the median (the line in the box), Q3 (the box’s right side), and the maximum.",
      misc: five
        .map((v, j) => [
          v,
          `That’s ${FIVE_NAMES[j]}. ${FIVE_NAMES[k][0].toUpperCase() + FIVE_NAMES[k].slice(1)} is ${["the left end of the left whisker", "the left side of the box", "the line inside the box", "the right side of the box", "the right end of the right whisker"][k]}.`,
        ])
        .filter((_, j) => j !== k),
      explain: `${FIVE_NAMES[k][0].toUpperCase() + FIVE_NAMES[k].slice(1)} is ${fmt(five[k])}. The five numbers are ${listOf(five)}.`,
      facts: { t: type, ...dataFacts(data, values) },
    });
  }
  if (type === "iqr") {
    /* the IQR from a box plot: the width of the box, not the whole plot */
    return numP({
      prompt: `The box plot shows ${data.what}. What is the <b>interquartile range</b> (IQR)?`,
      answer: q3 - q1,
      unit: data.unit,
      fig: () => box(),
      hint: "The IQR is how wide the box is: Q3 − Q1.",
      misc: [
        [most - least, "That’s the range, the whole width from whisker to whisker. The IQR is just the box: Q3 − Q1."],
        [median, "That’s the median. The IQR is Q3 − Q1, the width of the box."],
      ],
      explain: `Q3 is ${fmt(q3)} and Q1 is ${fmt(q1)}, so the IQR is ${fmt(q3)} − ${fmt(q1)} = ${fmt(q3 - q1)}.`,
      facts: { t: type, ...dataFacts(data, values) },
    });
  }
  if (type === "part") {
    /* tap the part of the box plot that shows a quarter of the data */
    const id = pick(Object.keys(PARTS));
    return {
      kind: "tap",
      prompt: `The box plot shows ${data.what}. Tap the part that shows the values <b>${PARTS[id]}</b>.`,
      answer: id,
      why: Object.fromEntries(
        Object.keys(PARTS)
          .filter((other) => other !== id)
          .map((other) => [other, `That part shows the values ${PARTS[other]}.`]),
      ),
      fig: () => box({ tap: "parts" }),
      hint: "Left to right: the left whisker, the box split by the median line, then the right whisker.",
      explain: `The values ${PARTS[id]} are in the ${id[0] === "w" ? "whisker" : "box"} ${id.endsWith("1") ? "on the left" : "on the right"}${id[0] === "b" ? " of the median line" : ""}.`,
      facts: { t: type, ...dataFacts(data, values) },
    };
  }
  if (type === "quarter") {
    /* a longer part of a box plot doesn't hold more of the data: each part holds about a quarter */
    const parts = [
        ["the left whisker", q1 - least],
        ["the left part of the box", median - q1],
        ["the right part of the box", q3 - median],
        ["the right whisker", most - q3],
      ],
      sortedParts = parts.slice().sort((a, b) => b[1] - a[1]);
    if (sortedParts[0][1] === sortedParts[1][1]) return genBox();
    const longest = sortedParts[0][0];
    return mcP(
      [
        ["about the same: each part holds about a quarter of the values", null],
        [
          `${longest}, because it’s the longest`,
          "A longer part means its values are more spread out, not that there are more of them. Each part holds about a quarter.",
        ],
        [
          "the box, because it’s a box",
          "The box holds the middle half of the values, but each half of it holds about a quarter, the same as each whisker.",
        ],
      ],
      {
        prompt: `The box plot shows ${data.what}. Which of its four parts holds the <b>most values</b>?`,
        stack: true,
        fig: (show) => (show ? dotPlot(values, { lo: data.lo, hi: data.hi, xLabel: data.axis, box: five }) : box()),
        hint: "The five numbers split the sorted data into four groups. How many values does each group have?",
        explain: `The minimum, Q1, the median, Q3, and the maximum split the data into four parts with about the same number of values. ${longest[0].toUpperCase() + longest.slice(1)} is longest because its values are spread out.`,
        facts: { t: type, ...dataFacts(data, values) },
      },
    );
  }
  /* which of two groups has the greater median, or the greater IQR, from their box plots */
  const other = boxValues(data),
    otherFive = fiveOf(other),
    byMedian = Math.random() < 0.5,
    measure = (f) => (byMedian ? f[2] : f[3] - f[1]),
    [a, b] = [measure(five), measure(otherFive)];
  if (a === b) return genBox();
  const winner = a > b ? "A" : "B",
    loser = winner === "A" ? "B" : "A",
    word = byMedian ? "median" : "IQR";
  return mcP(
    [
      [`Class ${winner}`, null],
      [
        `Class ${loser}`,
        `Class ${loser}’s ${word} is ${fmt(Math.min(a, b))}, less than class ${winner}’s ${fmt(Math.max(a, b))}.${byMedian ? " Compare the lines inside the boxes." : " Compare how wide the boxes are."}`,
      ],
      ["They’re the same", `The ${word}s are ${fmt(a)} and ${fmt(b)}: different.`],
    ],
    {
      prompt: `The box plots show ${data.what}, for two classes. Which class has the greater <b>${byMedian ? "median" : "interquartile range (IQR)"}</b>?`,
      fig: () =>
        dotPlot([], {
          lo: data.lo,
          hi: data.hi,
          xLabel: data.axis,
          boxes: [
            { five, name: "Class A" },
            { five: otherFive, name: "Class B" },
          ],
          label: `Box plots for class A (${listOf(five)}) and class B (${listOf(otherFive)})`,
        }),
      hint: byMedian ? "The median is the line inside each box." : "The IQR is how wide each box is: Q3 − Q1.",
      explain: `Class A’s ${word} is ${fmt(a)} and class B’s is ${fmt(b)}, so class ${winner}’s is greater.`,
      facts: { t: type, ...dataFacts(data, [...values, ...other]) },
    },
  );
}

const ICON = {
  question:
    '<rect x="12" y="6" width="40" height="52" rx="4" fill="rgba(9,32,61,.6)" stroke="#f3f6fb" stroke-width="2.5"/><text x="32" y="42" fill="#ffc93c" font-size="28" font-weight="700" text-anchor="middle" font-family="monospace">?</text>',
  dot: '<path d="M6,52 H58" stroke="#f3f6fb" stroke-width="2.5"/><g fill="#ffc93c"><circle cx="14" cy="45" r="4"/><circle cx="26" cy="45" r="4"/><circle cx="26" cy="35" r="4"/><circle cx="38" cy="45" r="4"/><circle cx="38" cy="35" r="4"/><circle cx="38" cy="25" r="4"/><circle cx="50" cy="45" r="4"/></g>',
  hist: '<path d="M6,56 H58 M6,56 V8" stroke="#f3f6fb" stroke-width="2.5"/><g fill="rgba(255,201,60,.6)" stroke="#f3f6fb" stroke-width="1.5"><rect x="8" y="40" width="10" height="16"/><rect x="18" y="24" width="10" height="32"/><rect x="28" y="14" width="10" height="42"/><rect x="38" y="30" width="10" height="26"/><rect x="48" y="46" width="10" height="10"/></g>',
  mean: '<path d="M6,40 H58" stroke="#f3f6fb" stroke-width="2.5"/><polygon points="32,40 24,54 40,54" fill="#7fe3ff"/><g fill="#ffc93c"><circle cx="12" cy="33" r="4"/><circle cx="24" cy="33" r="4"/><circle cx="44" cy="33" r="4"/><circle cx="48" cy="23" r="4"/></g>',
  mad: '<path d="M6,52 H58" stroke="#f3f6fb" stroke-width="2.5"/><path d="M32,10 V52" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="4 3"/><path d="M12,40 H32 M50,28 H32" stroke="#ff8ac4" stroke-width="2.5"/><circle cx="12" cy="40" r="4" fill="#ffc93c"/><circle cx="50" cy="28" r="4" fill="#ffc93c"/>',
  median:
    '<g fill="rgba(9,32,61,.6)" stroke="#f3f6fb" stroke-width="2"><rect x="4" y="24" width="10" height="16" rx="2"/><rect x="16" y="24" width="10" height="16" rx="2"/><rect x="40" y="24" width="10" height="16" rx="2"/><rect x="52" y="24" width="8" height="16" rx="2"/></g><rect x="27" y="20" width="12" height="24" rx="2" fill="rgba(255,201,60,.6)" stroke="#ffc93c" stroke-width="2"/>',
  box: '<path d="M6,32 H18 M46,32 H58 M6,24 V40 M58,24 V40" stroke="#f3f6fb" stroke-width="2.5"/><rect x="18" y="20" width="28" height="24" fill="rgba(127,227,255,.25)" stroke="#f3f6fb" stroke-width="2.5"/><path d="M30,20 V44" stroke="#ffc93c" stroke-width="3.5"/>',
  boss: '<circle cx="26" cy="26" r="15" fill="rgba(127,227,255,.15)" stroke="#f3f6fb" stroke-width="3"/><path d="M37,37 L56,56" stroke="#ffc93c" stroke-width="6" stroke-linecap="round"/><g fill="#ffc93c"><circle cx="20" cy="30" r="3"/><circle cx="26" cy="24" r="3"/><circle cx="32" cy="30" r="3"/></g>',
};

const ZONES = [
  {
    id: "question",
    name: "Case Files",
    lessons: "Lessons 1–3",
    blurb: "Spot statistical questions, sort numerical from categorical data, and pick the display that fits.",
    gen: genQuestion,
  },
  {
    id: "dot",
    name: "Dot Plot Clues",
    lessons: "Lessons 4–5",
    blurb: "Read dot plots: how many, what fraction, the most common value, and the range.",
    gen: genDot,
  },
  {
    id: "hist",
    name: "Histogram Hunt",
    lessons: "Lessons 6–8",
    blurb: "Read the bars of a histogram, name its shape, and decide which data vary more.",
    gen: genHist,
  },
  {
    id: "mean",
    name: "Mean Machine",
    lessons: "Lessons 9–10",
    blurb: "Find the mean as a fair share and a balance point, and find a missing value.",
    gen: genMean,
  },
  {
    id: "mad",
    name: "Spread Scanner",
    lessons: "Lessons 11–12",
    blurb: "Find the mean absolute deviation, and decide whose results are more consistent.",
    gen: genMad,
  },
  {
    id: "median",
    name: "Middle Finder",
    lessons: "Lessons 13–15",
    blurb: "Find medians and quartiles, and pick the better typical value when one value is far off.",
    gen: genMedian,
  },
  {
    id: "box",
    name: "Box Plot Lab",
    lessons: "Lessons 16–17",
    blurb: "Read box plots, find the IQR, and compare two groups.",
    gen: genBox,
  },
  {
    id: "boss",
    name: "Case Closed",
    lessons: "Whole unit · 10 problems",
    blurb: "A mixed review from every station. Aim for 3 stars.",
    gen: () => pick([genQuestion, genDot, genHist, genMean, genMad, genMedian, genBox])(),
  },
];
