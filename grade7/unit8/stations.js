/* Carnival of Chance (Grade 7 Unit 8): the problem generators, station list, and icons. Loaded by index.html and by
   tools/fuzz.mjs, after figs.js (spinners, bags, outcome tables, and trees), shared/fracmath.js (probabilities as fractions
   [n, d]), and shared/stats.js (means, MADs, and dot plots). Probabilities are typed as fractions or decimals. Every problem
   carries facts for checks.js: its type (t) and the numbers its checks need. Each generator deals one of a few kinds of
   problem (type), each with a comment saying what it asks. */
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
/* an mc problem whose choices keep their order (Impossible … Certain), from [[label, why it's wrong, or null], …] */
function mcInOrder(list, p) {
  const ids = ["a", "b", "c", "d", "e"],
    why = {};
  list.forEach(([, msg], i) => {
    if (msg !== null) why[ids[i]] = msg;
  });
  return {
    kind: "mc",
    choices: list.map(([label], i) => ({ id: ids[i], label })),
    answer: ids[list.findIndex(([, msg]) => msg === null)],
    why,
    ...p,
  };
}
/* a probability as a fraction in lowest terms, written stacked */
const pText = (n, d) => fim(frac(n, d));
const COLOR_NAMES = Object.keys(COLORS);

/* ---------- Station 1: how likely is it? (Lessons 1 and 2) ---------- */
/* the five words for how likely something is, by its probability */
const LIKELY = ["Impossible", "Unlikely", "Equally likely as not", "Likely", "Certain"];
const likelyWord = (p) => LIKELY[p === 0 ? 0 : p < 0.5 ? 1 : p === 0.5 ? 2 : p < 1 ? 3 : 4];
function genChance() {
  /* a spinner of n equal sections, k of them the color asked about */
  const n = pick([2, 4, 5, 6, 8]),
    k = R(0, n),
    asked = pick(COLOR_NAMES.slice(0, 3)),
    others = COLOR_NAMES.filter((c) => c !== asked),
    parts = shuffle([...Array(k).fill(asked), ...range(n - k).map(() => pick(others.slice(0, 3)))]),
    p = k / n,
    answer = likelyWord(p);
  /* the spinner keeps its sections in a fixed order so the same spinner is the same problem */
  const sorted = parts.slice().sort();
  return mcInOrder(
    LIKELY.map((word) => [
      word,
      word === answer
        ? null
        : `${k} of the ${n} equal sections ${k === 1 ? "is" : "are"} ${asked}: ${k === 0 ? "it can’t happen" : k === n ? "it must happen" : `a probability of ${k}/${n}`}, so it’s ${answer.toLowerCase()}.`,
    ]),
    {
      prompt: `How likely is the spinner to land on <b>${asked}</b>?`,
      fig: () => spinnerFig(sorted),
      stack: true,
      hint: "Count the sections of that color out of all of them. Less than half is unlikely; more than half is likely.",
      explain: `${k} of ${n} sections: ${answer.toLowerCase()}.`,
      facts: { t: "chance", k, n, answer },
    },
  );
}

/* ---------- Station 2: probabilities from equally likely outcomes (Lesson 3) ---------- */
function genProb() {
  const type = pick(["bag", "bag", "cube", "spinner"]);
  if (type === "bag") {
    /* a marble drawn from a bag */
    const colors = shuffle(COLOR_NAMES.slice(0, 4)).slice(0, R(2, 3)),
      counts = Object.fromEntries(colors.map((c) => [c, R(1, 6)])),
      asked = pick(colors),
      k = counts[asked],
      n = Object.values(counts).reduce((s, v) => s + v, 0);
    return numP({
      prompt: `You pick one marble from the bag without looking. What is the probability it’s <b>${asked}</b>?`,
      answer: k / n,
      frac: true,
      fig: () => bagFig(counts),
      hint: `Every marble is equally likely. How many are ${asked}, out of how many in all?`,
      misc: [
        [k, `That’s how many are ${asked}. A probability compares them to all ${n} marbles: ${k} out of ${n}.`],
        ...(n - k ? [[k / (n - k), `That compares ${asked} to the others. Compare to all ${n} marbles.`]] : []),
        [(n - k) / n, `That’s the probability it’s <i>not</i> ${asked}.`],
      ],
      explain: `${k} of the ${n} marbles are ${asked}: ${pText(k, n)}.`,
      facts: { t: type, k, n },
    });
  }
  if (type === "cube") {
    /* a number cube rolled once */
    const events = [
      ["an even number", [2, 4, 6]],
      ["a number greater than 4", [5, 6]],
      ["a 3", [3]],
      ["a number less than 3", [1, 2]],
      ["a multiple of 3", [3, 6]],
      ["a number greater than 1", [2, 3, 4, 5, 6]],
    ];
    const [words, ways] = pick(events),
      k = ways.length;
    return numP({
      prompt: `You roll a number cube (1 to 6). What is the probability of rolling <b>${words}</b>?`,
      answer: k / 6,
      frac: true,
      hint: `List the numbers that count: there are 6 equally likely numbers in all.`,
      misc: [
        [k, `That’s how many numbers count. Out of 6: ${k}/6.`],
        [(6 - k) / 6, "That’s the probability it doesn’t happen."],
      ],
      explain: `${ways.join(", ")}: ${k} of 6 numbers, so ${pText(k, 6)}.`,
      facts: { t: type, k, n: 6, ways },
    });
  }
  /* a spinner with equal sections */
  const n = pick([4, 5, 6, 8, 10]),
    asked = pick(COLOR_NAMES.slice(0, 3)),
    k = R(1, n - 1),
    other = pick(COLOR_NAMES.filter((c) => c !== asked).slice(0, 2)),
    parts = [...Array(k).fill(asked), ...Array(n - k).fill(other)];
  return numP({
    prompt: `What is the probability the spinner lands on <b>${asked}</b>?`,
    answer: k / n,
    frac: true,
    fig: () => spinnerFig(parts),
    hint: `The ${n} sections are equal, so each is equally likely. How many are ${asked}?`,
    misc: [
      [k, `That’s how many sections. Out of all ${n}: ${k}/${n}.`],
      [(n - k) / n, `That’s the probability of ${other}.`],
    ],
    explain: `${k} of ${n} equal sections: ${pText(k, n)}.`,
    facts: { t: type, k, n },
  });
}

/* ---------- Station 3: estimating from experiments (Lessons 4 to 6) ---------- */
/* simulations: chances and a way to act each one out */
const SIMULATIONS = [
  [
    "a 1 in 6 chance",
    "Roll a number cube and count a 6",
    ["Flip a coin and count heads", "Spin a spinner with 4 equal parts and count one part"],
  ],
  [
    "a 1 in 2 chance",
    "Flip a coin and count heads",
    ["Roll a number cube and count a 6", "Spin a spinner with 4 equal parts and count one part"],
  ],
  [
    "a 1 in 4 chance",
    "Spin a spinner with 4 equal parts and count one part",
    ["Flip a coin and count heads", "Roll a number cube and count a 6"],
  ],
  [
    "a 1 in 10 chance",
    "Pick a card from 10 numbered cards and count a 1",
    ["Flip a coin and count heads", "Roll a number cube and count a 6"],
  ],
];
function genEstimate() {
  const type = pick(["relFreq", "expected", "expected", "simulate"]);
  if (type === "relFreq") {
    /* the fraction of trials something happened estimates its probability */
    const trials = pick([20, 40, 50, 100]),
      hits = R(2, trials / 2),
      color = pick(COLOR_NAMES.slice(0, 3));
    return numP({
      prompt: `A spinner with unknown sections is spun ${trials} times. It lands on ${color} ${hits} times. Estimate the probability of ${color}.`,
      answer: hits / trials,
      frac: true,
      hint: `The probability is about the fraction of spins that landed on ${color}: ${hits} out of ${trials}.`,
      misc: [
        [hits, `That’s how many times. Divide by the ${trials} spins.`],
        [hits / (trials - hits), `That compares ${color} to the other spins. Compare to all ${trials}.`],
      ],
      explain: `${hits} out of ${trials} is ${pText(hits, trials)}, or ${fmt(hits / trials)}.`,
      facts: { t: type, hits, trials },
    });
  }
  if (type === "expected") {
    /* how many times to expect something in many tries */
    const [k, n] = pick([
        [1, 4],
        [1, 2],
        [3, 4],
        [1, 3],
        [2, 5],
        [1, 6],
      ]),
      tries = n * pick([5, 10, 20]),
      color = pick(COLOR_NAMES.slice(0, 3)),
      other = pick(COLOR_NAMES.filter((c) => c !== color).slice(0, 2)),
      parts = [...Array(k).fill(color), ...Array(n - k).fill(other)],
      answer = (tries * k) / n;
    return numP({
      prompt: `About how many times would you expect this spinner to land on <b>${color}</b> in ${tries} spins?`,
      answer,
      unit: "times",
      fig: () => spinnerFig(parts),
      hint: `${color[0].toUpperCase() + color.slice(1)} is ${k} of the ${n} equal sections, so about ${pText(k, n)} of the spins.`,
      misc: [
        [tries / n, `That’s 1 of the ${n} sections. ${color[0].toUpperCase() + color.slice(1)} is ${k} of them.`],
        [tries - answer, `That’s how many times it lands on ${other}.`],
        [k, "That’s the number of sections. Scale it up to the number of spins."],
      ],
      explain: `${pText(k, n)} of ${tries} is ${answer}: about ${answer} times.`,
      facts: { t: type, k, n, tries },
    });
  }
  /* which simulation acts out a chance */
  const [chance, right, wrong] = pick(SIMULATIONS);
  return mcP(
    [
      [right, null],
      ...wrong.map((w) => [
        w,
        `That has a different chance. Find one where the outcome happens ${chance.replace("a ", "")} times.`,
      ]),
    ],
    {
      prompt: `A player makes a free throw with ${chance}. Which is a good simulation of one try?`,
      stack: true,
      hint: "A simulation needs the same chance: an outcome that happens just as often as the real thing.",
      explain: `${right}: that happens with ${chance}.`,
      facts: { t: type, chance, right },
    },
  );
}

/* ---------- Station 4: experiments with more than one step (Lessons 7 to 9) ---------- */
/* two-step experiments and how many outcomes each step has */
const STEPS2 = [
  ["flip a coin and roll a number cube", 2, 6],
  ["roll two number cubes", 6, 6],
  ["spin a 3-color spinner and flip a coin", 3, 2],
  ["pick a shirt (4 colors) and pants (3 colors)", 4, 3],
  ["flip a coin three times", 2, 4],
];
function genMulti() {
  const type = pick(["count", "dice", "dice", "tree"]);
  if (type === "count") {
    /* the number of outcomes: multiply the outcomes of each step */
    const [what, a, b] = pick(STEPS2),
      answer = what.includes("three times") ? 8 : a * b;
    return numP({
      prompt: `How many different outcomes are there when you ${what}?`,
      answer,
      unit: "outcomes",
      hint: "Each outcome of the first step goes with each outcome of the next. A tree or a table shows them all.",
      misc: [
        [
          what.includes("three times") ? 6 : a + b,
          "That adds. Each first outcome pairs with every second one: multiply.",
        ],
        ...(what.includes("three times") ? [[4, "Each flip doubles the outcomes: 2 × 2 × 2."]] : []),
      ],
      explain: what.includes("three times") ? "2 × 2 × 2 = 8 outcomes." : `${a} × ${b} = ${answer} outcomes.`,
      facts: { t: type, what, answer },
    });
  }
  if (type === "dice") {
    /* a sum with two number cubes, from the table of 36 outcomes */
    const sum = pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
      ways = 6 - Math.abs(7 - sum);
    return numP({
      prompt: `You roll two number cubes and add. What is the probability the sum is <b>${sum}</b>?`,
      answer: ways / 36,
      frac: true,
      fig: (show) => outcomeGrid((a, b) => show && a + b === sum, { label: `The 36 sums of two number cubes` }),
      hint: `Count the cells in the table that add up to ${sum}, out of all 36.`,
      misc: [
        [ways, "That’s how many ways. Out of 36 outcomes."],
        [1 / 11, "The sums 2 to 12 aren’t equally likely. Count the outcomes in the table."],
      ],
      explain: `${ways} of the 36 outcomes add to ${sum}: ${pText(ways, 36)}.`,
      facts: { t: type, sum },
    });
  }
  /* one path through a tree: a coin and a spinner */
  const colors = COLOR_NAMES.slice(0, pick([3, 4])),
    side = pick(["heads", "tails"]),
    color = pick(colors),
    total = 2 * colors.length;
  return numP({
    prompt: `You flip a coin and spin a spinner with ${colors.length} equal sections (${colors.join(", ")}). What is the probability of <b>${side} and ${color}</b>?`,
    answer: 1 / total,
    frac: true,
    fig: (show) => treeFig(["heads", "tails"], colors, { hi: (f, s) => show && f === side && s === color }),
    hint: `Count all the paths through the tree: each equally likely. One of them is ${side}, ${color}.`,
    misc: [
      [1 / 2 + 1 / colors.length, "Probabilities of two steps don’t add. Count the paths: one out of all of them."],
      [1 / colors.length, `That’s just ${color}. It also has to be ${side}.`],
    ],
    explain: `There are 2 × ${colors.length} = ${total} equally likely paths, and 1 is ${side}, ${color}: ${pText(1, total)}.`,
    facts: { t: type, total },
  });
}

/* ---------- Station 5: samples (Lessons 11 to 14) ---------- */
/* questions about a population, the fair sample, and samples that aren't fair (and why) */
const SAMPLING = [
  {
    question: "how students at the school get there each morning",
    fair: "30 names drawn at random from a list of every student",
    unfair: [
      ["the 30 students in the bike club", "Bike club members are more likely to bike."],
      ["the first 30 students to arrive", "Early arrivals may come a different way (like the early bus)."],
      ["30 friends of the person asking", "Friends tend to be alike, and they aren’t picked by chance."],
    ],
  },
  {
    question: "what share of the town likes a plan for a new park",
    fair: "200 homes picked at random from the town’s list of addresses",
    unfair: [
      ["people at the old park on Saturday", "Park visitors probably like parks more than most."],
      ["people who answer an online poll", "Only people who care enough to answer are counted."],
      ["the town’s gardening club", "Gardeners may feel differently from everyone else."],
    ],
  },
  {
    question: "the average weight of the cereal boxes a factory makes in a day",
    fair: "20 boxes picked at random from the whole day’s boxes",
    unfair: [
      ["the first 20 boxes made in the morning", "If the machine drifts during the day, these won’t show it."],
      ["20 boxes from the top of one pallet", "One pallet comes from one short stretch of time."],
      ["the 20 heaviest-looking boxes", "Picking by look isn’t by chance."],
    ],
  },
];
function genSample() {
  const type = pick(["fair", "fair", "population"]);
  const scene = pick(SAMPLING);
  if (type === "fair") {
    /* which sample is most likely to be representative */
    const unfair = shuffle(scene.unfair).slice(0, 2);
    const cap = (text) => text[0].toUpperCase() + text.slice(1);
    return mcP([[cap(scene.fair), null], ...unfair.map(([text, why]) => [cap(text), why])], {
      prompt: `To find out ${scene.question}, which sample is best?`,
      stack: true,
      hint: "A good sample is picked at random from the whole population, so every member has the same chance to be in it.",
      explain: `${scene.fair[0].toUpperCase() + scene.fair.slice(1)}: picked at random from everyone, so it’s likely to be representative.`,
      facts: { t: type, fair: scene.fair },
    });
  }
  /* the population or the sample */
  const total = pick([400, 600, 800, 1200]),
    asked = pick([30, 40, 50, 60]),
    askPop = Math.random() < 0.6;
  const choices = [
    [`All ${total} students at the school`, askPop ? null : "That’s the population: everyone the question is about."],
    [`The ${asked} students who were asked`, askPop ? "That’s the sample: the part that was asked." : null],
    [`The students who answered yes`, "That’s part of the answers, not the group that was asked or studied."],
  ];
  return mcP(choices, {
    prompt: `A survey asks ${asked} of the ${total} students at a school whether they want a later start time. What is the <b>${askPop ? "population" : "sample"}</b>?`,
    stack: true,
    hint: "The population is the whole group the question is about. The sample is the part you actually ask.",
    explain: askPop
      ? `The population is all ${total} students; the sample is the ${asked} asked.`
      : `The sample is the ${asked} students asked.`,
    facts: { t: type, askPop, total, asked },
  });
}

/* ---------- Station 6: estimating a population from a sample (Lessons 15 to 17) ---------- */
/* eight values around a mean: four pairs the same distance above and below it, so the mean comes out whole */
function aroundMean(mean, most = 4) {
  return range(4)
    .flatMap(() => {
      const d = R(0, most);
      return [mean - d, mean + d];
    })
    .sort((a, b) => a - b);
}
function genEstimatePop() {
  const type = pick(["share", "share", "mean"]);
  if (type === "share") {
    /* the share of a random sample, scaled up to the population */
    const n = pick([20, 25, 40, 50]),
      yes = R(2, (3 * n) / 4),
      total = pick([400, 500, 800, 1000, 2000]),
      answer = (yes * total) / n;
    if (!Number.isInteger(answer)) return genEstimatePop();
    const what = pick([
      ["walk to school", "students", "school"],
      ["have a pet", "students", "school"],
      ["want a skate park", "residents", "town"],
    ]);
    return numP({
      prompt: `In a random sample of ${n} ${what[1]}, ${yes} ${what[0]}. About how many of the ${total} ${what[1]} in the ${what[2]} ${what[0]}?`,
      answer,
      unit: what[1],
      hint: `${yes} out of ${n} is the share in the sample. The whole ${what[2]} should have about the same share: ${yes}/${n} of ${total}.`,
      misc: [
        [yes, `That’s the sample. Scale it up to all ${total}.`],
        [total - answer, `That’s about how many don’t.`],
        [(yes / n) * 100, `That’s the percent. Find that share of ${total}.`],
      ],
      explain: `${yes}/${n} of ${total} = ${answer}.`,
      facts: { t: type, n, yes, total },
    });
  }
  /* the sample's mean estimates the population's mean */
  const mean = R(6, 14),
    values = aroundMean(mean),
    sum = values.reduce((s, v) => s + v, 0);
  return numP({
    prompt: `A random sample of 8 students reports how many books they read last year. Estimate the <b>mean</b> for all the students.`,
    answer: mean,
    unit: "books",
    fig: (show) =>
      dotPlot(values, { lo: 0, hi: 20, step: 1, every: 2, xLabel: "books read", mean: show ? mean : null }),
    hint: `The sample’s mean is a good estimate. Add the 8 values and divide by 8.`,
    misc: [
      [
        medianOf(values) === mean ? NaN : medianOf(values),
        "That’s the median. The mean adds them all and shares equally.",
      ],
      [sum, "That’s the total. Divide by the 8 students."],
    ],
    explain: `The values add up to ${sum}, and ${sum} ÷ 8 = ${mean} books.`,
    facts: { t: type, values },
  });
}

/* ---------- Station 7: comparing populations with samples (Lessons 18 and 19) ---------- */
function genCompare() {
  const type = pick(["howMany", "meaningful"]);
  /* two samples with the same spread (MAD 2·s), their means apart by k MADs */
  const s = pick([1, 2]),
    mad = 2 * s,
    k = type === "meaningful" ? pick([1, 3, 4]) : pick([1, 2, 3, 4]),
    meanA = R(4, 8) * 2,
    meanB = meanA + k * mad,
    shape = [-3, -3, -1, -1, 1, 1, 3, 3].map((d) => d * s),
    groupA = shape.map((d) => meanA + d),
    groupB = shape.map((d) => meanB + d),
    hi = Math.ceil((meanB + 3 * s + 2) / 5) * 5,
    lo = Math.max(0, Math.floor((meanA - 3 * s - 2) / 5) * 5),
    what = pick([
      ["minutes of homework", "Class A", "Class B"],
      ["plant heights (cm)", "Garden A", "Garden B"],
      ["jump lengths (dm)", "Team A", "Team B"],
    ]);
  const fig = () =>
    `<p class="figcap">${what[1]} (mean ${meanA}, MAD ${mad})</p>${dotPlot(groupA, { lo, hi, xLabel: what[0], mean: meanA })}` +
    `<p class="figcap">${what[2]} (mean ${meanB}, MAD ${mad})</p>${dotPlot(groupB, { lo, hi, xLabel: what[0], mean: meanB })}`;
  if (type === "howMany") {
    /* the difference in means, measured in MADs */
    return numP({
      prompt: `Two random samples: ${what[1]} has a mean of ${meanA} and ${what[2]} a mean of ${meanB}, and both have a MAD of ${mad}. The difference in means is how many MADs?`,
      answer: k,
      unit: "MADs",
      fig,
      hint: `Find the difference in means, ${meanB} − ${meanA}, then divide by the MAD, ${mad}.`,
      misc: [
        [meanB - meanA, `That’s the difference. Divide it by the MAD, ${mad}.`],
        [mad, "That’s the MAD. How many of them fit in the difference?"],
      ],
      explain: `${meanB} − ${meanA} = ${meanB - meanA}, and ${meanB - meanA} ÷ ${mad} = ${k} MADs.`,
      facts: { t: type, meanA, meanB, mad },
    });
  }
  /* is the difference big enough to say the populations really differ? (more than 2 MADs) */
  const meaningful = k > 2;
  return mcP(
    [
      [
        "Yes, the populations are likely different",
        meaningful ? null : `The means are only ${k} MAD apart. That could just be the luck of the samples.`,
      ],
      [
        "No, the difference could be chance",
        meaningful ? `The means are ${k} MADs apart, more than 2: that’s unlikely to be just chance.` : null,
      ],
    ],
    {
      prompt: `${what[1]} has a mean of ${meanA} and ${what[2]} a mean of ${meanB}, both with a MAD of ${mad}. Is there a meaningful difference between the two populations?`,
      fig,
      hint: "Find how many MADs apart the means are. More than 2 MADs usually means a real difference.",
      explain: `${meanB} − ${meanA} = ${meanB - meanA}, which is ${k} MAD${k === 1 ? "" : "s"}: ${meaningful ? "more than 2, so likely a real difference" : "not more than 2, so it could be chance"}.`,
      facts: { t: type, meanA, meanB, mad },
    },
  );
}

const ZONES = [
  {
    id: "chance",
    name: "Likely or Not",
    lessons: "Lessons 1–2",
    blurb: "Place a spin from impossible to certain.",
    gen: genChance,
  },
  {
    id: "prob",
    name: "Spin to Win",
    lessons: "Lesson 3",
    blurb: "Find probabilities from bags of marbles, number cubes, and spinners.",
    gen: genProb,
  },
  {
    id: "estimate",
    name: "Repeat and Count",
    lessons: "Lessons 4–6",
    blurb: "Estimate a probability from what happened, expect results in many tries, and pick a simulation.",
    gen: genEstimate,
  },
  {
    id: "multi",
    name: "Two-Step Games",
    lessons: "Lessons 7–9",
    blurb: "Count outcomes with tables and trees, and find the probability of a two-step result.",
    gen: genMulti,
  },
  {
    id: "sample",
    name: "Fair Samples",
    lessons: "Lessons 11–14",
    blurb: "Tell the population from the sample, and pick the sample most likely to be representative.",
    gen: genSample,
  },
  {
    id: "estimatePop",
    name: "Guess the Crowd",
    lessons: "Lessons 15–17",
    blurb: "Scale a sample up to the whole population, and estimate a mean.",
    gen: genEstimatePop,
  },
  {
    id: "compare",
    name: "Compare Crowds",
    lessons: "Lessons 18–19",
    blurb: "Measure the gap between two samples’ means in MADs, and decide whether it’s meaningful.",
    gen: genCompare,
  },
  {
    id: "boss",
    name: "Grand Prize",
    lessons: "Whole unit · 10 problems",
    blurb: "A mixed review from every station. Aim for 3 stars.",
    gen: () => pick([genChance, genProb, genEstimate, genMulti, genSample, genEstimatePop, genCompare])(),
  },
];

const ICON = {
  chance:
    '<path d="M6,40 H58" stroke="#f3f6fb" stroke-width="2.5"/><path d="M6,34 v12 M32,34 v12 M58,34 v12" stroke="#f3f6fb" stroke-width="2.5"/><circle cx="44" cy="40" r="6" fill="#ffc93c"/>',
  prob: '<circle cx="32" cy="32" r="24" fill="#6fb8ff" stroke="#0a2340" stroke-width="2"/><path d="M32,32 L32,8 A24,24 0 0 1 56,32 Z" fill="#ff7b7b" stroke="#0a2340" stroke-width="2"/><path d="M32,32 L46,16" stroke="#f3f6fb" stroke-width="3.5" stroke-linecap="round"/><circle cx="32" cy="32" r="4" fill="#f3f6fb"/>',
  estimate:
    '<rect x="8" y="34" width="10" height="22" fill="#ffc93c"/><rect x="22" y="22" width="10" height="34" fill="#6fb8ff"/><rect x="36" y="28" width="10" height="28" fill="#ffc93c"/><rect x="50" y="14" width="10" height="42" fill="#6fb8ff"/>',
  multi:
    '<circle cx="8" cy="32" r="4" fill="#f3f6fb"/><path d="M8,32 L28,16 M8,32 L28,48 M28,16 L54,8 M28,16 L54,24 M28,48 L54,40 M28,48 L54,56" stroke="#7fe3ff" stroke-width="2.5"/><path d="M8,32 L28,16 L54,24" fill="none" stroke="#ffc93c" stroke-width="3.5"/>',
  sample:
    '<g fill="#7fe3ff"><circle cx="12" cy="14" r="4"/><circle cx="26" cy="12" r="4"/><circle cx="40" cy="16" r="4"/><circle cx="54" cy="12" r="4"/><circle cx="16" cy="30" r="4"/><circle cx="32" cy="32" r="4"/><circle cx="48" cy="30" r="4"/><circle cx="12" cy="48" r="4"/><circle cx="28" cy="50" r="4"/><circle cx="44" cy="48" r="4"/><circle cx="56" cy="52" r="4"/></g><g fill="#ffc93c"><circle cx="26" cy="12" r="4"/><circle cx="48" cy="30" r="4"/><circle cx="12" cy="48" r="4"/></g>',
  estimatePop:
    '<rect x="6" y="26" width="18" height="18" rx="3" fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="2"/><path d="M28,35 H36" stroke="#f3f6fb" stroke-width="3"/><polygon points="40,35 33,30 33,40" fill="#f3f6fb"/><rect x="42" y="16" width="18" height="38" rx="3" fill="rgba(127,227,255,.35)" stroke="#7fe3ff" stroke-width="2"/>',
  compare:
    '<path d="M4,26 H60 M4,52 H60" stroke="#f3f6fb" stroke-width="2"/><g fill="#ffc93c"><circle cx="14" cy="20" r="4"/><circle cx="22" cy="20" r="4"/><circle cx="22" cy="12" r="4"/><circle cx="30" cy="20" r="4"/></g><g fill="#7fe3ff"><circle cx="34" cy="46" r="4"/><circle cx="42" cy="46" r="4"/><circle cx="42" cy="38" r="4"/><circle cx="50" cy="46" r="4"/></g>',
  boss: '<path d="M32,6 L40,24 L60,26 L45,39 L50,58 L32,48 L14,58 L19,39 L4,26 L24,24 Z" fill="rgba(255,138,196,.5)" stroke="#ff8ac4" stroke-width="2.5" stroke-linejoin="round"/>',
};
