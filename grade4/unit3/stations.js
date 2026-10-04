/* Camp Fraction (Grade 4 Unit 3): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Fraction strips, number lines, and hundred grids come from shared/fractions.js; line plots from shared/graphs.js; fr, mixed,
   PART, partName, and cellsOf from shared/pictures.js; frMix from figs.js; mcOf and miscOf from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. A line plot problem
   also carries facts for checks.js: the plot's counts (how many Xs at each value, in 1/d) and d. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* the text with its first letter capitalized */
const cap = (text) => text[0].toUpperCase() + text.slice(1);
/* two different students */
const twoKids = () => shuffle(KIDS).slice(0, 2);
/* the plural name of 1/d's parts: "eighths" */
const parts = (d) => PART[d][1];
/* k/d with its unit: "3/4 cup", "5/4 cups" (one: the unit for 1 or less, many: for more) */
const amount = (k, d, one, many = one + "s") => `${fr(k, d)} ${k <= d ? one : many}`;
/* Named mistakes for a typed fraction, leaving out any that aren't positive or are so close to the answer that the engine
   would count them right (it accepts answers within 0.011) */
const apart = (answer, list) =>
  miscOf(
    answer,
    list.filter(([value]) => value > 0 && Math.abs(value - answer) > 0.02),
  );
/* k/d in strips, the shaded parts in groups of grp, with room for every whole they reach */
const groupStrips = (d, k, grp, label) => strips([{ d, k, grp }], { wholes: Math.ceil(k / d), label });

/* ---------- Snack Shack: equal groups of unit fractions (Lessons 1–3) ---------- */
/* foods scooped in unit fractions of a cup: [what, the scoop's denominators] */
const SCOOPS = [
  ["oats", [2, 3, 4]],
  ["raisins", [3, 4, 8]],
  ["flour", [2, 3, 4]],
  ["sugar", [3, 4, 8]],
  ["rice", [2, 3, 4]],
];
function genUnit() {
  const variant = R(0, 2),
    name = pick(KIDS),
    [food, dens] = pick(SCOOPS),
    d = pick(dens);
  if (variant === 0) {
    /* n scoops of 1/d cup */
    const n = R(2, Math.min(12, 3 * d));
    return {
      kind: "num",
      frac: true,
      unit: n <= d ? "cup" : "cups",
      answer: n / d,
      prompt: `${name} uses a ${fr(1, d)}-cup scoop for the ${food}. ${name} fills it ${n} times. How many cups of ${food} is that?`,
      fig: (show) => groupStrips(d, show ? n : 0, 1, `${n} groups of 1/${d}`),
      misc: apart(n / d, [
        [
          1 / (n * d),
          `That multiplies the denominator by ${n}. Each scoop is still ${fr(1, d)} cup: ${n} of them is ${fr(n, d)}.`,
        ],
        [n + 1 / d, `That adds ${n} and ${fr(1, d)}. It’s ${n} groups of ${fr(1, d)}: ${n} × ${fr(1, d)}.`],
      ]),
      hint: `Each scoop is ${fr(1, d)} cup. ${n} scoops is ${n} × ${fr(1, d)}: count ${n} ${parts(d)}.`,
      explain: `${n} × ${fr(1, d)} = ${frMix(n, d)} ${n <= d ? "cup" : "cups"}.`,
    };
  }
  if (variant === 1) {
    /* which expression shows n scoops */
    const n = R(2, 9),
      flipped = [2, 3, 4, 5, 6, 8].includes(n) && n !== d;
    return {
      ...mcOf([
        [`${n} × ${fr(1, d)}`, null],
        [`${n} + ${fr(1, d)}`, `That’s ${n} cups and ${fr(1, d)} more. ${name} has ${n} groups of ${fr(1, d)}.`],
        flipped
          ? [
              `${d} × ${fr(1, n)}`,
              `That’s ${d} groups of ${fr(1, n)}. Each scoop is ${fr(1, d)}, and there are ${n} of them.`,
            ]
          : [`${n} × ${d}`, `That’s ${n} groups of ${d} whole cups. Each scoop is only ${fr(1, d)} cup.`],
      ]),
      prompt: `${name} fills a ${fr(1, d)}-cup scoop with ${food} ${n} times. Which expression shows how many cups of ${food} that is?`,
      fig: () => groupStrips(d, n, 1, `${n} groups of 1/${d}`),
      hint: `Each scoop is one group of ${fr(1, d)}. How many groups are there?`,
      explain: `${n} groups of ${fr(1, d)} is ${n} × ${fr(1, d)} = ${frMix(n, d)}.`,
    };
  }
  /* how many scoops fill a recipe; never 2 cups of 1/2-cup scoops, where adding 2 + 2 gives the right answer */
  const cups = R(d === 2 ? 3 : 2, 4),
    n = cups * d;
  return {
    kind: "num",
    unit: "scoops",
    answer: n,
    prompt: `A recipe needs ${cups} cups of ${food}. ${name} has only a ${fr(1, d)}-cup scoop. How many scoops is that?`,
    fig: (show) => strips([{ d, k: show ? n : 0 }], { wholes: cups, label: `${cups} wholes cut into ${parts(d)}` }),
    misc: miscOf(n, [
      [cups + d, `That adds ${cups} and ${d}. Each cup takes ${d} scoops, so ${cups} cups take ${cups} × ${d}.`],
      [d, `That fills 1 cup. The recipe needs ${cups}.`],
    ]),
    hint: `How many ${fr(1, d)}-cup scoops make 1 cup? Then ${cups} cups take ${cups} times as many.`,
    explain: `${d} scoops make 1 cup, so ${cups} cups take ${cups} × ${d} = ${n} scoops. ${n} × ${fr(1, d)} = ${fr(n, d)} = ${cups}.`,
  };
}

/* ---------- Trail Mix: equal groups of any fraction (Lessons 4–6) ---------- */
/* things packed in equal amounts: [the story for n bags of a/d each, the unit for 1 or less, the unit for more] */
const BAGS = [
  [
    (n, a, d) => `Each bag of trail mix has ${fr(a, d)} cup of peanuts. How many cups of peanuts are in ${n} bags?`,
    "cup",
    "cups",
  ],
  [(n, a, d) => `Each water bottle holds ${fr(a, d)} liter. How many liters do ${n} bottles hold?`, "liter", "liters"],
  [
    (n, a, d) => `The camp trail is ${fr(a, d)} mile long. A hiker walks it ${n} times. How many miles is that?`,
    "mile",
    "miles",
  ],
  [(n, a, d) => `Each tent needs ${fr(a, d)} meter of rope. How many meters do ${n} tents need?`, "meter", "meters"],
];
/* a non-unit fraction a/d and a number of groups n, with the product at most 4 wholes */
function groupsOf() {
  let n, a, d;
  do {
    d = pick([3, 4, 5, 6, 8, 10]);
    a = R(2, d - 1);
    n = R(2, 6);
  } while ((n * a) / d > 4);
  return [n, a, d];
}
function genAny() {
  const variant = R(0, 2),
    [n, a, d] = groupsOf(),
    total = n * a;
  if (variant === 0) {
    /* n groups of a/d in a story */
    const [story, one, many] = pick(BAGS);
    return {
      kind: "num",
      frac: true,
      unit: total <= d ? one : many,
      answer: total / d,
      prompt: story(n, a, d),
      fig: (show) => groupStrips(d, show ? total : a, a, `${show ? n : 1} group${show ? "s" : ""} of ${a}/${d}`),
      misc: apart(total / d, [
        [
          total / (n * d),
          `That multiplies the denominator too. The parts are still ${parts(d)}: ${n} groups of ${partName(d, a)} is ${total} ${parts(d)}.`,
        ],
        [(n + a) / d, `That adds ${n} and ${a}. It’s ${n} groups of ${fr(a, d)}, so multiply: ${n} × ${a}.`],
      ]),
      hint: `${n} groups of ${fr(a, d)} is ${n} × ${fr(a, d)}. How many ${parts(d)} is that?`,
      explain: `${n} × ${fr(a, d)} = ${fr(`${n} × ${a}`, d)} = ${frMix(total, d)} ${total <= d ? one : many}.`,
    };
  }
  if (variant === 1) {
    /* an expression worth the same: (n × a) × 1/d, not (n + a) × 1/d or a fraction of a bigger whole */
    const wrongs = [
      [
        `${n + a} × ${fr(1, d)}`,
        n + a,
        `That adds ${n} and ${a}. ${n} groups of ${a} ${parts(d)} is ${n} × ${a} ${parts(d)}.`,
      ],
      [
        `${n} × ${fr(1, d)}`,
        n,
        `That’s ${n} groups of ${fr(1, d)}. Each group is ${fr(a, d)}, which is ${a} times as much.`,
      ],
      [`${a} × ${fr(1, d)}`, a, `That’s just one group of ${fr(a, d)}. There are ${n} groups.`],
    ].filter(([, count], i, all) => count !== total && all.findIndex(([, c]) => c === count) === i);
    return {
      ...mcOf([
        [`${total} × ${fr(1, d)}`, null],
        ...shuffle(wrongs)
          .slice(0, 2)
          .map(([label, , msg]) => [label, msg]),
      ]),
      prompt: `Which expression has the same value as ${n} × ${fr(a, d)}?`,
      fig: (show) => groupStrips(d, total, show ? 1 : a, `${n} groups of ${a}/${d}`),
      hint: `${fr(a, d)} is ${a} × ${fr(1, d)}. How many ${parts(d)} are in ${n} groups of ${a}?`,
      explain: `${n} × ${fr(a, d)} = ${n} × ${a} × ${fr(1, d)} = ${total} × ${fr(1, d)} = ${fr(total, d)}.`,
    };
  }
  /* a missing number of groups */
  return {
    kind: "num",
    unit: "",
    answer: n,
    prompt: `? × ${fr(a, d)} = ${fr(total, d)}. What number goes in the box?`,
    fig: (show) => groupStrips(d, total, show ? a : 0, `${total} ${parts(d)}`),
    misc: miscOf(n, [
      [total - a, `That subtracts ${total} − ${a}. How many groups of ${a} make ${total}?`],
      [total, `${total} is the numerator of the product. How many groups of ${fr(a, d)} make it?`],
    ]).filter(([wrong]) => wrong !== n),
    hint: `Put the ${total} ${parts(d)} in groups of ${a}. How many groups?`,
    explain: `${n} × ${a} = ${total}, so ${n} × ${fr(a, d)} = ${fr(total, d)}.`,
  };
}

/* ---------- Hiking Trail: add fractions (Lessons 7–8, 12) ---------- */
/* parts of a hike: [first place, second place] */
const LEGS = [
  ["the lake", "the waterfall"],
  ["the bridge", "the lookout"],
  ["the creek", "the campsite"],
  ["the meadow", "the ranger station"],
];
/* n split into `count` positive whole numbers, in random order */
function splitInto(n, count) {
  const cuts = shuffle(range(n - 1).map((i) => i + 1))
    .slice(0, count - 1)
    .sort((x, y) => x - y);
  return [0, ...cuts, n].slice(1).map((v, i, all) => v - (i ? all[i - 1] : 0));
}
/* a sum of fractions in d-ths: "2/8 + 3/8" */
const sumOf = (nums, d) => nums.map((k) => fr(k, d)).join(" + ");
function genAdd() {
  const variant = R(0, 2),
    name = pick(KIDS);
  if (variant === 0) {
    /* a/d + b/d: two legs of a hike */
    const d = pick([3, 4, 5, 6, 8, 10, 12]),
      a = R(1, d - 1),
      b = R(1, d - 1),
      [place1, place2] = pick(LEGS),
      sum = a + b;
    return {
      kind: "num",
      frac: true,
      unit: sum <= d ? "mile" : "miles",
      answer: sum / d,
      prompt: `${name} hikes ${amount(a, d, "mile")} to ${place1}, then ${amount(b, d, "mile")} more to ${place2}. How far does ${name} hike in all?`,
      fig: (show) =>
        fracLine(
          [
            {
              d,
              hops: [
                [0, a, ""],
                [a, sum, "q"],
              ],
              pts: show ? [{ k: sum }] : [],
            },
          ],
          { wholes: Math.ceil(sum / d), label: `Number line in ${parts(d)} with a jump of ${a}/${d}, then ${b}/${d}` },
        ),
      misc: apart(sum / d, [
        [
          sum / (2 * d),
          `That adds the denominators too. ${cap(parts(d))} plus ${parts(d)} are still ${parts(d)}: add the numerators.`,
        ],
      ]),
      hint: `Both are ${parts(d)}. Count ${a} ${parts(d)} and then ${b} more.`,
      explain: `${fr(a, d)} + ${fr(b, d)} = ${frMix(sum, d)} ${sum <= d ? "mile" : "miles"}.`,
    };
  }
  if (variant === 1) {
    /* a fraction broken into a sum: the right one, and sums that are one part over or under */
    const d = pick([5, 6, 8, 10, 12]),
      k = R(4, d - 1),
      right = splitInto(k, R(2, 3)),
      over = splitInto(k + 1, 2),
      under = splitInto(k - 1, 2);
    return {
      ...mcOf([
        [sumOf(right, d), null],
        [sumOf(over, d), `That adds up to ${fr(k + 1, d)}, one ${PART[d][0]} too many.`],
        [sumOf(under, d), `That adds up to ${fr(k - 1, d)}, one ${PART[d][0]} short.`],
      ]),
      prompt: `Which sum is equal to ${fr(k, d)}?`,
      fig: (show) => strips([{ d, k, grp: show ? right : 0 }], { label: `${k}/${d} in a fraction strip` }),
      hint: `Add the numerators of each sum. Which one makes ${k}?`,
      explain: `${sumOf(right, d)} = ${fr(right.join(" + "), d)} = ${fr(k, d)}.`,
    };
  }
  /* two mixed numbers */
  const d = pick([2, 3, 4, 5, 6, 8]),
    [whole1, whole2] = [R(1, 2), R(1, 2)],
    [r1, r2] = [R(1, d - 1), R(1, d - 1)],
    total = (whole1 + whole2) * d + r1 + r2,
    [place1, place2] = pick(LEGS);
  return {
    kind: "num",
    frac: true,
    unit: "miles",
    answer: total / d,
    prompt: `The trail to ${place1} is ${whole1} ${fr(r1, d)} miles. The trail from there to ${place2} is ${whole2} ${fr(r2, d)} miles. How long are the two trails together?`,
    fig: (show) =>
      strips(
        [
          { d, k: whole1 * d + r1, lab: show ? [whole1 * d + r1, d] : null },
          { d, k: whole2 * d + r2, cls: "b", lab: show ? [whole2 * d + r2, d] : null },
        ],
        { wholes: 3, label: `${whole1} ${r1}/${d} and ${whole2} ${r2}/${d} in fraction strips` },
      ),
    misc: apart(total / d, [
      [whole1 + whole2, `That adds the whole numbers but leaves out ${fr(r1, d)} and ${fr(r2, d)}.`],
      [
        whole1 + whole2 + (r1 + r2) / (2 * d),
        `That adds the denominators too. ${cap(parts(d))} plus ${parts(d)} are still ${parts(d)}.`,
      ],
    ]),
    hint: `Add the whole numbers, then the ${parts(d)}: ${fr(r1, d)} + ${fr(r2, d)}. Is that more than 1?`,
    explain: `${whole1} + ${whole2} = ${whole1 + whole2}, and ${fr(r1, d)} + ${fr(r2, d)} = ${frMix(r1 + r2, d)}. In all: ${mixed(total, d)} miles.`,
  };
}

/* ---------- Canoe Dock: subtract fractions (Lessons 9–12) ---------- */
function genSubtract() {
  const variant = R(0, 3),
    name = pick(KIDS);
  if (variant === 0) {
    /* take away: a water bottle */
    const d = pick([4, 5, 6, 8, 10]),
      a = R(3, d),
      b = R(1, a - 1),
      left = a - b;
    return {
      kind: "num",
      frac: true,
      unit: "liter",
      answer: left / d,
      prompt: `${name}’s water bottle has ${amount(a, d, "liter")} in it. ${name} drinks ${amount(b, d, "liter")} on the canoe trip. How much water is left?`,
      fig: (show) => strips([{ d, k: a, out: show ? b : 0 }], { label: `${a}/${d} in a fraction strip` }),
      misc: apart(left / d, [
        [(a + b) / d, `That adds. ${name} drinks some, so take it away: ${fr(a, d)} − ${fr(b, d)}.`],
        [b / d, `That’s how much ${name} drinks. How much is left in the bottle?`],
      ]),
      hint: `Cross out ${b} of the ${a} shaded ${parts(d)}. How many are left?`,
      explain: `${fr(a, d)} − ${fr(b, d)} = ${fr(left, d)} liter.`,
    };
  }
  if (variant === 1) {
    /* from a whole or mixed number, trading a whole for parts */
    const d = pick([3, 4, 5, 6, 8]),
      whole = R(1, 3),
      r = R(0, d - 2),
      b = R(r + 1, d - 1),
      start = whole * d + r,
      left = start - b,
      startText = r ? `${whole} ${fr(r, d)}` : `${whole}`,
      miles = (k) => (k <= d ? "mile" : "miles");
    return {
      kind: "num",
      frac: true,
      unit: miles(left),
      answer: left / d,
      prompt: `The canoe trip is ${startText} ${miles(start)}. The canoes have gone ${amount(b, d, "mile")}. How far is left to go?`,
      fig: (show) =>
        strips([{ d, k: start, out: show ? b : 0 }], { wholes: whole + 1, label: `${startText} in fraction strips` }),
      misc: apart(
        left / d,
        r
          ? [
              [
                whole + (b - r) / d,
                `That takes ${fr(r, d)} from ${fr(b, d)}. Trade 1 whole for ${fr(d, d)} first: ${startText} = ${whole - 1 ? whole - 1 + " " : ""}${fr(d + r, d)}.`,
              ],
              [
                whole - 1 + (d - b) / d,
                `That trades 1 whole for ${fr(d, d)} but leaves out the ${fr(r, d)} that was already there.`,
              ],
            ]
          : [],
      ),
      hint: `There aren’t enough ${parts(d)} to take away ${b}. Trade 1 whole for ${d} ${parts(d)}.`,
      explain: `${startText} = ${fr(start, d)}. ${fr(start, d)} − ${fr(b, d)} = ${frMix(left, d)} ${miles(left)}.`,
    };
  }
  if (variant === 2) {
    /* a missing addend */
    const d = pick([4, 5, 6, 8, 10, 12]),
      a = R(1, d - 2),
      c = R(a + 1, d);
    return {
      kind: "num",
      frac: true,
      unit: "",
      answer: (c - a) / d,
      prompt: `${fr(a, d)} + ? = ${c === d ? 1 : fr(c, d)}. What fraction goes in the box?`,
      fig: (show) =>
        fracLine(
          [
            {
              d,
              hops: [[0, a, ""], ...(show ? [[a, c, "q"]] : [])],
              pts: [{ k: c, cls: "b" }],
            },
          ],
          { label: `Number line in ${parts(d)} from 0 to 1` },
        ),
      misc: apart((c - a) / d, [
        [(c + a) / d, `That adds. What do you add to ${fr(a, d)} to get ${c === d ? 1 : fr(c, d)}?`],
      ]),
      hint: `Count the jumps of ${fr(1, d)} from ${fr(a, d)} to ${c === d ? 1 : fr(c, d)}.`,
      explain: `${fr(a, d)} + ${fr(c - a, d)} = ${fr(c, d)}${c === d ? " = 1" : ""}, so the missing fraction is ${fr(c - a, d)}.`,
    };
  }
  /* how much more: two seedlings at camp */
  const d = pick([4, 8, 10]),
    [a, b] = shuffle(range(d - 1).map((i) => i + 1))
      .slice(0, 2)
      .sort((x, y) => y - x),
    [first, second] = twoKids();
  return {
    kind: "num",
    frac: true,
    unit: "inch",
    answer: (a - b) / d,
    prompt: `${first}’s bean plant is ${fr(a, d)} inch tall. ${second}’s is ${fr(b, d)} inch tall. How much taller is ${first}’s plant?`,
    fig: () =>
      strips(
        [
          { d, k: a, lab: [a, d] },
          { d, k: b, cls: "b", lab: [b, d] },
        ],
        { label: `${a}/${d} and ${b}/${d} in fraction strips` },
      ),
    misc: apart((a - b) / d, [
      [(a + b) / d, `That adds. How much taller means find the difference: ${fr(a, d)} − ${fr(b, d)}.`],
    ]),
    hint: `How much taller means subtract: ${fr(a, d)} − ${fr(b, d)}.`,
    explain: `${fr(a, d)} − ${fr(b, d)} = ${fr(a - b, d)} inch.`,
  };
}

/* ---------- Bug Lab: line plots with fractions (Lessons 13–14) ---------- */
/* what was measured: [the things, one of them, the unit, the denominator, the smallest and largest in 1/d] */
const PLOTS = [
  ["beetles", "beetle", "inch", 8, 2, 8],
  ["ladybugs", "ladybug", "inch", 8, 1, 6],
  ["leaves", "leaf", "inch", 4, 4, 10],
  ["snowfalls", "day", "inch", 4, 1, 8],
];
/* counts at each value from lo to hi (in 1/d), 6 to 11 things, with one most common value */
function plotData(lo, hi) {
  let counts;
  do {
    counts = {};
    range(R(6, 11)).forEach(() => {
      const v = R(lo, hi);
      counts[v] = (counts[v] || 0) + 1;
    });
  } while (
    Object.keys(counts).length < 3 ||
    Object.values(counts).filter((c) => c === Math.max(...Object.values(counts))).length > 1
  );
  return counts;
}
/* a length in 1/d as words for the plot's unit: "5/8 inch", "1 1/4 inches" */
const lengthOf = (v, d, unit) => `${v % d ? mixed(v, d) : v / d} ${v <= d ? unit : unit + "es"}`;
function genPlot() {
  const variant = R(0, 3),
    [things, one, unit, d, lo, hi] = pick(PLOTS),
    counts = plotData(lo, hi),
    values = Object.keys(counts)
      .map(Number)
      .sort((x, y) => x - y),
    howMany = Object.values(counts).reduce((x, y) => x + y),
    snow = things === "snowfalls",
    title = snow ? `snowfall on ${howMany} days` : `the lengths of ${howMany} ${things}`,
    plot = (mark = null) =>
      lineplot(counts, lo, hi, { d, mark, unit: `${unit}es`, u: 52, label: `Line plot of ${title}` }),
    intro = snow
      ? `The line plot shows how much snow fell on ${howMany} days.`
      : `The class measured ${howMany} ${things}. The line plot shows their lengths.`;
  const longest = values[values.length - 1],
    shortest = values[0];
  if (variant === 0) {
    /* how much longer the longest is than the shortest */
    const what = snow
      ? "How much more snow fell on the snowiest day than on the least snowy day?"
      : `How much longer is the longest ${one} than the shortest?`;
    return {
      kind: "num",
      frac: true,
      unit: longest - shortest <= d ? unit : unit + "es",
      answer: (longest - shortest) / d,
      prompt: `${intro} ${what}`,
      facts: { counts, d },
      fig: () => plot(),
      misc: apart((longest - shortest) / d, [
        [
          (longest + shortest) / d,
          `That adds. How much more means subtract: ${lengthOf(longest, d, unit)} − ${lengthOf(shortest, d, unit)}.`,
        ],
        [
          longest / d,
          `That’s the ${snow ? "snowiest day" : `longest ${one}`}. How much more is it than the ${snow ? "least" : "shortest"}?`,
        ],
      ]),
      hint: `Find the Xs farthest to the right and farthest to the left. Subtract.`,
      explain: `${fr(longest, d)} − ${fr(shortest, d)} = ${frMix(longest - shortest, d)} ${longest - shortest <= d ? unit : unit + "es"}.`,
    };
  }
  if (variant === 1) {
    /* the total of the Xs at one value with more than one X */
    const stacked = values.filter((v) => counts[v] > 1),
      v = pick(stacked),
      count = counts[v],
      total = count * v;
    const what = snow
      ? `On ${count} days, ${lengthOf(v, d, unit)} of snow fell. How much snow fell on those ${count} days in all?`
      : `What is the total length of the ${things} that are ${lengthOf(v, d, unit)} long?`;
    return {
      kind: "num",
      frac: true,
      unit: total <= d ? unit : unit + "es",
      answer: total / d,
      prompt: `${intro} ${what}`,
      facts: { counts, d },
      fig: (show) => plot(show ? v : null),
      misc: apart(total / d, [
        [v / d, `That’s just one. There are ${count} Xs at ${fr(v, d)}.`],
        [(count + v) / d, `That adds ${count} and ${v}. ${count} Xs at ${fr(v, d)} is ${count} × ${fr(v, d)}.`],
      ]),
      hint: `Count the Xs at ${fr(v, d)}. Then multiply, or add ${fr(v, d)} that many times.`,
      explain: `${count} × ${fr(v, d)} = ${frMix(total, d)} ${total <= d ? unit : unit + "es"}.`,
    };
  }
  if (variant === 2) {
    /* how many are longer than a value */
    const cut = pick(values.slice(0, -1)),
      longer = values.filter((v) => v > cut).reduce((n, v) => n + counts[v], 0),
      atLeast = longer + counts[cut];
    const what = snow
      ? `On how many days did more than ${lengthOf(cut, d, unit)} of snow fall?`
      : `How many ${things} are longer than ${lengthOf(cut, d, unit)}?`;
    return {
      kind: "num",
      unit: snow ? "days" : things,
      answer: longer,
      prompt: `${intro} ${what}`,
      facts: { counts, d },
      fig: (show) => plot(show ? cut : null),
      misc: miscOf(longer, [
        [atLeast, `That counts the Xs at ${fr(cut, d)} too. They are exactly ${lengthOf(cut, d, unit)}, not more.`],
        [howMany - longer, `That counts the ones that are ${lengthOf(cut, d, unit)} or less.`],
      ]).filter(([wrong]) => wrong !== longer),
      hint: `Count the Xs to the right of ${fr(cut, d)}, not the ones at ${fr(cut, d)}.`,
      explain: `${values
        .filter((v) => v > cut)
        .map((v) => `${counts[v]} at ${fr(v, d)}`)
        .join(", ")}: ${longer} in all.`,
    };
  }
  /* the most common length */
  const most = values.find((v) => counts[v] === Math.max(...Object.values(counts))),
    others = shuffle(values.filter((v) => v !== most)).slice(0, 2);
  return {
    ...mcOf([
      [lengthOf(most, d, unit), null],
      ...others.map((v) => [
        lengthOf(v, d, unit),
        `Only ${counts[v]} X${counts[v] > 1 ? "s are" : " is"} at ${fr(v, d)}. Which value has the tallest stack?`,
      ]),
    ]),
    prompt: `${intro} Which ${snow ? "amount of snow" : "length"} is the most common?`,
    facts: { counts, d },
    fig: (show) => plot(show ? most : null),
    hint: `Find the tallest stack of Xs.`,
    explain: `${counts[most]} Xs are at ${fr(most, d)}, more than at any other value.`,
  };
}

/* ---------- Ranger Station: tenths and hundredths (Lessons 15–18) ---------- */
function genTenths() {
  const variant = R(0, 3),
    name = pick(KIDS);
  if (variant === 0) {
    /* tenths as hundredths */
    const a = R(1, 9);
    return {
      kind: "num",
      unit: "",
      answer: 10 * a,
      prompt: `${fr(a, 10)} = ${fr("?", 100)}. What is the missing numerator?`,
      fig: () => hundredGrid(cellsOf([10 * a, "a"]), { label: `A hundred grid with ${a} columns shaded` }),
      misc: miscOf(10 * a, [
        [a, `That keeps ${a}, but hundredths are smaller than tenths. Each tenth is 10 hundredths.`],
        [a + 90, `That adds 90 because 90 was added to the denominator. Multiply instead: ${a} × 10.`],
      ]),
      hint: `Each tenth is a column of 10 hundredths. How many hundredths are in ${a} columns?`,
      explain: `${a} × 10 = ${10 * a}, so ${fr(a, 10)} = ${fr(10 * a, 100)}.`,
    };
  }
  if (variant === 1) {
    /* tenths + hundredths, written in hundredths */
    const a = R(1, 8),
      b = R(1, 9) + 10 * R(0, 9 - a - 1),
      total = 10 * a + b;
    return {
      kind: "num",
      unit: "",
      answer: total,
      prompt: `${fr(a, 10)} + ${fr(b, 100)} = ${fr("?", 100)}. What is the missing numerator?`,
      fig: (show) =>
        hundredGrid(cellsOf([10 * a, "a"], [show ? b : 0, "b"]), {
          label: `A hundred grid with ${a} columns shaded` + (show ? ` and ${b} more squares` : ""),
        }),
      misc: miscOf(total, [
        [
          a + b,
          `That adds ${a} + ${b}, but tenths and hundredths are different sizes. Write ${fr(a, 10)} as ${fr(10 * a, 100)} first.`,
        ],
      ]),
      hint: `Write ${fr(a, 10)} in hundredths first. Then add the hundredths.`,
      explain: `${fr(a, 10)} = ${fr(10 * a, 100)}, and ${fr(10 * a, 100)} + ${fr(b, 100)} = ${fr(total, 100)}.`,
    };
  }
  if (variant === 2) {
    /* money: dimes are tenths of a dollar, pennies are hundredths */
    const dimes = R(1, 9),
      pennies = R(1, 9),
      total = 10 * dimes + pennies;
    return {
      kind: "num",
      frac: true,
      unit: "of a dollar",
      answer: total / 100,
      prompt: `${name} buys a trail map with ${dimes} dime${dimes > 1 ? "s" : ""} and ${pennies} penn${pennies > 1 ? "ies" : "y"}. A dime is ${fr(1, 10)} of a dollar and a penny is ${fr(1, 100)}. What fraction of a dollar does the map cost?`,
      fig: () =>
        hundredGrid(cellsOf([10 * dimes, "a"], [pennies, "b"]), {
          label: `A hundred grid: ${dimes} columns and ${pennies} squares shaded`,
        }),
      misc: apart(total / 100, [
        [(dimes + pennies) / 100, `That counts every coin as a penny. A dime is ${fr(10, 100)} of a dollar.`],
        [(dimes + pennies) / 10, `That counts every coin as a dime. A penny is only ${fr(1, 100)} of a dollar.`],
      ]),
      hint: `${dimes} dimes is ${fr(dimes, 10)} = ${fr(10 * dimes, 100)} of a dollar. Add the pennies.`,
      explain: `${fr(dimes, 10)} + ${fr(pennies, 100)} = ${fr(10 * dimes, 100)} + ${fr(pennies, 100)} = ${fr(total, 100)} of a dollar.`,
    };
  }
  /* which fraction equals a/10 */
  const a = R(2, 9);
  return {
    ...mcOf([
      [fr(10 * a, 100), null],
      [fr(a, 100), `A hundredth is smaller than a tenth, so ${a} hundredths is less than ${a} tenths.`],
      [fr(10 * a, 10), `That multiplies only the numerator by 10. That’s 10 times as much.`],
    ]),
    prompt: `Which fraction is equal to ${fr(a, 10)}?`,
    fig: () => hundredGrid(cellsOf([10 * a, "a"]), { label: `A hundred grid with ${a} columns shaded` }),
    hint: `Each tenth of the grid is a column of 10 hundredths.`,
    explain: `${fr(a, 10)} = ${fr(`${a} × 10`, `10 × 10`)} = ${fr(10 * a, 100)}.`,
  };
}

/* ---------- Stargazing: the final round ---------- */
const genBoss = () => pick([genUnit, genAny, genAdd, genSubtract, genPlot, genTenths])();

const ZONES = [
  {
    id: "unit",
    name: "Snack Shack",
    lessons: "Lessons 1–3",
    blurb: "Scoop equal groups of 1/4 or 1/3 cup, and write them as multiplication.",
    gen: genUnit,
  },
  {
    id: "any",
    name: "Trail Mix",
    lessons: "Lessons 4–6",
    blurb: "Find equal groups of 2/3 or 3/4, and expressions that have the same value.",
    gen: genAny,
  },
  {
    id: "add",
    name: "Hiking Trail",
    lessons: "Lessons 7–8, 12",
    blurb: "Add fractions and mixed numbers with jumps on a number line.",
    gen: genAdd,
  },
  {
    id: "subtract",
    name: "Canoe Dock",
    lessons: "Lessons 9–12",
    blurb: "Take parts away, trade a whole for parts, and find how much more.",
    gen: genSubtract,
  },
  {
    id: "plot",
    name: "Bug Lab",
    lessons: "Lessons 13–14",
    blurb: "Read line plots in fourths and eighths of an inch, and add or subtract to answer questions.",
    gen: genPlot,
  },
  {
    id: "tenths",
    name: "Ranger Station",
    lessons: "Lessons 15–18",
    blurb: "Write tenths as hundredths, and add tenths and hundredths.",
    gen: genTenths,
  },
  {
    id: "boss",
    name: "Stargazing",
    lessons: "All lessons",
    blurb: "Light up the night sky! Every right answer lights one of 10 stars.",
    gen: genBoss,
  },
];

/* the night sky over the camp: 10 stars, `lit` of them shining (the boss icon lights all of them) */
const sky = (lit) =>
  [
    [8, 10],
    [20, 6],
    [33, 12],
    [46, 5],
    [57, 14],
    [12, 24],
    [27, 22],
    [40, 26],
    [53, 28],
    [32, 34],
  ]
    .map(
      ([x, y], i) =>
        `<circle cx="${x}" cy="${y}" r="${i < lit ? 3 : 2}" fill="${i < lit ? "#ffc93c" : "rgba(255,255,255,.18)"}"/>`,
    )
    .join("") +
  '<path d="M14,58L30,36L46,58Z" fill="#5fe0a8" stroke="#0a2340" stroke-width="1.5"/><path d="M30,36V58M26,58L30,48L34,58" stroke="#0a2340" stroke-width="1.5" fill="#0a2340"/><path d="M2,58H62" stroke="#f3f6fb" stroke-width="2"/>';
const ICON = {
  unit: '<path d="M10,30H40V52H10Z" fill="#c98a4b" stroke="#0a2340" stroke-width="1.5"/><path d="M40,34H52V40H40" fill="none" stroke="#c98a4b" stroke-width="4"/><path d="M12,30Q25,18 38,30Z" fill="#ffc93c"/><text x="25" y="47" fill="#0a2340" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">¼</text>',
  any: '<g stroke="#0a2340" stroke-width="1.5"><rect x="4" y="24" width="9.3" height="18" fill="#ffc93c"/><rect x="13.3" y="24" width="9.3" height="18" fill="#ffc93c"/><rect x="22.6" y="24" width="9.3" height="18" fill="#7fe3ff"/><rect x="31.9" y="24" width="9.3" height="18" fill="#7fe3ff"/><rect x="41.2" y="24" width="9.3" height="18" fill="#ffc93c"/><rect x="50.5" y="24" width="9.5" height="18" fill="#ffc93c"/></g>',
  add: '<path d="M4,56L22,22L34,38L46,14L60,56Z" fill="#5fe0a8" stroke="#0a2340" stroke-width="1.5"/><path d="M8,52Q20,40 28,46T50,30" fill="none" stroke="#ffc93c" stroke-width="2.5" stroke-dasharray="4 3"/>',
  subtract:
    '<path d="M4,40Q32,58 60,40Z" fill="#c98a4b" stroke="#0a2340" stroke-width="1.5"/><path d="M16,34L44,22" stroke="#f3f6fb" stroke-width="3"/><path d="M42,20l6,-2l-1,7Z" fill="#f3f6fb"/><path d="M4,50Q16,46 28,50T52,50T64,50" fill="none" stroke="#7fe3ff" stroke-width="2"/>',
  plot: '<path d="M4,48H60" stroke="#f3f6fb" stroke-width="2.5"/><g fill="#ffc93c" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace"><text x="16" y="42">X</text><text x="30" y="42">X</text><text x="30" y="31">X</text><text x="44" y="42">X</text></g><ellipse cx="44" cy="22" rx="7" ry="5" fill="#ff7b7b" stroke="#0a2340" stroke-width="1.5"/><path d="M37,22H51M44,17V27" stroke="#0a2340" stroke-width="1"/>',
  tenths:
    '<g stroke="#0a2340" stroke-width="1"><rect x="10" y="10" width="44" height="44" fill="rgba(243,246,251,.25)"/><rect x="10" y="10" width="13.2" height="44" fill="#ffc93c"/><rect x="23.2" y="10" width="4.4" height="22" fill="#7fe3ff"/></g><path d="M14.4,10V54M18.8,10V54M23.2,10V54M27.6,10V54M32,10V54M36.4,10V54M40.8,10V54M45.2,10V54M49.6,10V54" stroke="#0a2340" stroke-width="1"/>',
  boss: sky(10),
};
