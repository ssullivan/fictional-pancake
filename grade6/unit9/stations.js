/* Town Hall (Grade 6 Unit 9): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs,
   after figs.js (squares in rectangles, vote counting, and the pictures). Every problem carries facts for checks.js: its type
   (t) and the numbers its checks need. Each generator deals one of a few kinds of problem (type), each with a comment saying
   what it asks. */
/* a num problem: its named mistakes leave out any that land on the answer, and any repeats */
function numP(p) {
  const misc = (p.misc || []).filter(([v]) => Number.isFinite(v) && v > 0 && Math.abs(v - p.answer) >= 0.02);
  return { kind: "num", unit: "", ...p, misc: miscOf(p.answer, misc) };
}
/* an mc problem from [[label, why it's wrong, or null for the answer], …], leaving out wrong choices that repeat a label */
function mcP(list, p) {
  const kept = list.filter(([label], i) => list.findIndex(([other]) => other === label) === i);
  return { ...mcOf(kept, { stack: p.stack }), ...p };
}
const pct = (n) => `${fmt(n)}%`;
/* ---------- Station 1: if our class were the world (Lesson 2) ---------- */
/* Facts about the world's 8 billion people, rounded to a friendly "about num in den": under 15 (25%, UN 2024), 65 and older
   (10%), Asia (59%), Africa (19%), internet users (68%, ITU 2024), left-handed (about 10%), rice as the main food (about half),
   under 20 (32%). are: the fact as it's true now; be: after "would". */
const WORLD = [
  { are: "are under 15 years old", be: "be under 15", frac: [1, 4] },
  { are: "are 65 or older", be: "be 65 or older", frac: [1, 10] },
  { are: "live in Asia", be: "live in Asia", frac: [3, 5] },
  { are: "live in Africa", be: "live in Africa", frac: [1, 5] },
  { are: "use the internet", be: "use the internet", frac: [2, 3] },
  { are: "are left-handed", be: "be left-handed", frac: [1, 10] },
  { are: "eat rice as their main food", be: "eat rice as their main food", frac: [1, 2] },
  { are: "are under 20 years old", be: "be under 20", frac: [1, 3] },
];
/* class sizes from 20 to 36 that this fact's share of comes out whole */
const classSizes = ([, den]) =>
  range(17)
    .map((i) => 20 + i)
    .filter((n) => n % den === 0);
function genWorld() {
  const type = pick(["scale", "scale", "percent", "up"]);
  if (type === "scale") {
    /* the world's share, scaled down to a class: n × num/den */
    const fact = pick(WORLD),
      [num, den] = fact.frac,
      n = pick(classSizes(fact.frac)),
      answer = (n / den) * num;
    return numP({
      prompt: `About <b>${num} in ${den}</b> people in the world ${fact.are}. If the world were a class of <b>${n}</b> students, about how many would ${fact.be}?`,
      answer,
      unit: "students",
      /* the hint sets the class in groups of den with num gold in the first; once it's done, num in every group */
      fig: (show, done) =>
        show
          ? classFig(n, num, { group: den, eachGroup: done, label: `A class of ${n} in groups of ${den}` })
          : classFig(n, 0, { label: `A class of ${n}` }),
      hint: `${num} in ${den} means ${num} of every ${den}. Split the class into groups of ${den}: how many groups, and ${num} from each.`,
      misc: [
        ...(num > 1
          ? [[n / den, `That’s 1 in ${den}. ${num} in ${den} is ${num} of every ${den}: ${n} ÷ ${den} × ${num}.`]]
          : []),
        [n - answer, `That’s how many would <i>not</i>. Find the ${num} in ${den} who would.`],
        [den * num, `${num} in ${den} is a rate, not a count. Scale it to a class of ${n}.`],
      ],
      explain: `${n} ÷ ${den} = ${n / den} groups of ${den}, and ${num} from each group is ${n / den} × ${num} = ${answer} students.`,
      facts: { t: type, n, k: answer },
    });
  }
  if (type === "percent") {
    /* the share of the class as a percent: k out of n is how many out of 100 */
    const fact = pick(WORLD.filter((f) => 100 % f.frac[1] === 0)),
      [num, den] = fact.frac,
      n = pick(classSizes(fact.frac)),
      k = (n / den) * num,
      answer = (100 * num) / den;
    return numP({
      prompt: `If the world were a class of ${n} students, <b>${k}</b> of them would ${fact.be}. What <b>percent</b> of the class is that?`,
      answer,
      unit: "%",
      fig: () => classFig(n, k, { label: `${k} of a class of ${n}` }),
      hint: `Percent means out of 100. ${k} out of ${n} is the same as how many out of 100?`,
      misc: [
        [k, `${k} is how many students. Write it out of 100: ${k} out of ${n} = ? out of 100.`],
        [100 - answer, `That’s the percent who would <i>not</i>. ${k} of ${n} would.`],
        [n - k, `That’s how many students would not. Find ${k} out of ${n} as a percent.`],
      ],
      explain: `${k} out of ${n} = ${num} out of ${den} = ${answer} out of 100, so ${answer}%.`,
      facts: { t: type, n, k },
    });
  }
  /* back up from the class to the world: each student stands for 8 billion ÷ n people */
  const fact = pick(WORLD.filter((f) => [20, 32, 40].some((n) => (n * f.frac[0]) % f.frac[1] === 0))),
    [num, den] = fact.frac,
    n = pick([20, 32, 40].filter((size) => (size * num) % den === 0)),
    k = (n * num) / den,
    each = 8 / n,
    answer = k * each;
  return numP({
    prompt: `There are about <b>8 billion</b> people in the world. If the world were a class of ${n}, <b>${k}</b> students would ${fact.be}. About how many <b>billion</b> people in the world ${fact.are}?`,
    answer,
    unit: "billion people",
    fig: () => classFig(n, k, { label: `${k} of a class of ${n}` }),
    hint: `Each of the ${n} students stands for 8 ÷ ${n} = ${fmt(each)} billion people.`,
    misc: [
      [k, `${k} is the number of students. Each one stands for 8 ÷ ${n} = ${fmt(each)} billion people.`],
      [each, `That’s how many billion each student stands for. ${k} students stand for ${k} times as many.`],
      [8 * k, `Each student stands for 8 ÷ ${n} billion, not 8 billion: ${k} × ${fmt(each)}.`],
    ],
    explain: `Each student stands for 8 ÷ ${n} = ${fmt(each)} billion people, so ${k} students stand for ${k} × ${fmt(each)} = ${fmt(answer)} billion.`,
    facts: { t: type, n, k },
  });
}

/* ---------- Station 2: squares in rectangles (Lesson 3) ---------- */
/* a rectangle w by h (w longer, up to 30 by 15) that isn't a whole number of squares, with at most `most` squares in all */
function rectangle(most = 12) {
  for (;;) {
    const w = R(7, 30),
      h = R(3, Math.min(w - 1, 15)),
      count = squaresOf(w, h).length;
    if (w % h && count <= most) return [w, h];
  }
}
function genSquares() {
  const type = pick(["count", "left", "gcf", "gcf", "total"]),
    [w, h] = rectangle(),
    cuts = squareCuts(w, h),
    first = cuts[0].count,
    left = w - first * h,
    smallest = cuts[cuts.length - 1].side,
    total = cuts.reduce((s, c) => s + c.count, 0),
    cutText = cuts.map((c) => `${c.count} square${c.count === 1 ? "" : "s"} of side ${c.side}`).join(", then "),
    /* the hint cuts the first `shown` squares; once it's done, all of them */
    fig = (shown) => (show, done) => cutFig(w, h, { shown: done ? Infinity : show ? shown : 0 });
  if (type === "count" || type === "left") {
    /* the first cuts: how many h-by-h squares fit, or how long the strip left over is */
    const asksCount = type === "count";
    return numP({
      prompt: asksCount
        ? `Cut as many <b>${h}-by-${h}</b> squares as you can from a ${w}-by-${h} rectangle. How many squares is that?`
        : `Cut as many ${h}-by-${h} squares as you can from a ${w}-by-${h} rectangle. The rest is a rectangle ${h} units wide. How <b>long</b> is it?`,
      answer: asksCount ? first : left,
      unit: asksCount ? "squares" : left === 1 ? "unit" : "units",
      fig: fig(1),
      hint: `Each square uses ${h} units of the ${w}-unit side. How many ${h}s fit in ${w}, and what’s left?`,
      misc: asksCount
        ? [
            [
              first + 1,
              `${first + 1} squares would need ${(first + 1) * h} units, but the rectangle is only ${w} long.`,
            ],
            [w - h, `That’s the length left after one square. Count how many ${h}s fit in ${w}.`],
          ]
        : [
            [w - h, `That’s after just one square. Keep cutting ${h}-by-${h} squares while they fit.`],
            [h, `${h} is the short side, which doesn’t change. The long side is what gets cut.`],
            [first, `${first} is how many squares fit. How much of the ${w} is left after them?`],
          ],
      explain: `${first} squares of side ${h} use ${first} × ${h} = ${first * h} units of the ${w}, leaving a ${h}-by-${left} rectangle.`,
      facts: { t: type, w, h },
    });
  }
  if (type === "gcf") {
    /* cut the largest square again and again: the last, smallest square's side is the greatest common factor */
    return numP({
      prompt: `Cut the largest square you can from a <b>${w}-by-${h}</b> rectangle, then the largest you can from the rectangle that’s left, and so on, until it’s all squares. What is the side length of the <b>smallest</b> square?`,
      answer: smallest,
      unit: smallest === 1 ? "unit" : "units",
      fig: fig(first),
      hint: "Each time, the square’s side is the short side of the rectangle that’s left. The last square fits exactly.",
      misc: [
        [left, `That’s the rectangle left after the first squares. Keep cutting it into squares.`],
        [h, `${h} is the first, largest square. Keep going until the squares fit exactly.`],
        [1, `1-by-1 squares would fit, but each cut takes the largest square that fits.`],
      ],
      explain: `The squares are ${cutText}. The smallest has side ${smallest}, the greatest common factor of ${w} and ${h}.`,
      facts: { t: type, w, h },
    });
  }
  /* how many squares the whole rectangle cuts into */
  return numP({
    prompt: `Cut the largest square you can from a <b>${w}-by-${h}</b> rectangle, then the largest you can from the rectangle that’s left, and so on, until it’s all squares. How many squares are there in all?`,
    answer: total,
    unit: "squares",
    fig: fig(first),
    hint: `Start with ${h}-by-${h} squares. When they stop fitting, the rectangle left has a new short side: cut squares that size.`,
    misc: [
      [first, `That’s just the largest squares. Keep cutting the rectangle that’s left.`],
      [
        (w * h) / (smallest * smallest),
        `That’s how many ${smallest}-by-${smallest} squares would cover it. Each cut takes the largest square that fits.`,
      ],
      [cuts.length, `That’s how many sizes of square there are. Count every square.`],
    ],
    explain: `The squares are ${cutText}: ${cuts.map((c) => c.count).join(" + ")} = ${total} squares.`,
    facts: { t: type, w, h },
  });
}

/* ---------- Station 3: which class was "yessier"? (Lesson 4) ---------- */
const TOPICS = [
  "answering math problems in poetry",
  "painting the gym purple",
  "getting a class pet",
  "a field trip to the science museum",
  "starting school later",
];
/* class sizes, and for each, yes votes that make a whole percent from 40% to 90% */
const CLASS_SIZES = [20, 24, 25, 28, 30, 32, 36];
const yesFor = (size) => range(size + 1).filter((y) => (100 * y) % size === 0 && y >= 0.4 * size && y <= 0.9 * size);
/* the yes and no votes of two classes: equal shares, or two different shares at least 5 points apart */
function twoClasses() {
  const [sizeA, sizeB] = shuffle(CLASS_SIZES).slice(0, 2),
    same = Math.random() < 0.2;
  for (;;) {
    const yesA = pick(yesFor(sizeA)),
      yesB = pick(yesFor(sizeB)),
      shareA = (100 * yesA) / sizeA,
      shareB = (100 * yesB) / sizeB;
    if (same ? shareA === shareB : Math.abs(shareA - shareB) >= 5)
      return [
        { name: "A", size: sizeA, yes: yesA, no: sizeA - yesA, share: shareA },
        { name: "B", size: sizeB, yes: yesB, no: sizeB - yesB, share: shareB },
      ];
    if (same && !yesFor(sizeA).some((y) => yesFor(sizeB).some((z) => y * sizeB === z * sizeA))) return twoClasses();
  }
}
const voteFig = (classes) => () =>
  infoTable(
    ["", "yes", "no"],
    classes.map((c) => [`class ${c.name}`, c.yes, c.no]),
    "Votes",
  );
function genYessier() {
  if (Math.random() < 0.7) {
    /* which class was more in favor: compare each class's yes votes to its total */
    let classes = twoClasses();
    /* most of the time, deal again until the class with more yes votes is the less yessy one (the mistake to catch) */
    for (let tries = 0; Math.random() < 0.6 && tries < 30; tries++) {
      const [a, b] = classes;
      if (a.share !== b.share && a.yes > b.yes !== a.share > b.share) break;
      classes = twoClasses();
    }
    const [a, b] = classes,
      topic = pick(TOPICS),
      shares = `${a.yes} of ${a.size} is ${pct(a.share)}, and ${b.yes} of ${b.size} is ${pct(b.share)}`,
      equal = a.share === b.share,
      winner = a.share > b.share ? a : b;
    /* why a class that wasn't more in favor might look like it was */
    const whyClass = (c) => {
      const other = c === a ? b : a;
      if (equal) return `Compare each class’s yes votes to its total: ${shares}. That’s the same share.`;
      if (c.yes > other.yes)
        return `Class ${c.name} had more yes votes, but it’s also a different size. Compare yes votes to the total: ${shares}.`;
      if (c.yes - c.no > other.yes - other.no)
        return `Class ${c.name} won by more votes, but compare shares of the whole class: ${shares}.`;
      return `Compare yes votes to the total: ${shares}. Class ${other.name}’s share is bigger.`;
    };
    return mcP(
      [
        ["class A", equal || winner !== a ? whyClass(a) : null],
        ["class B", equal || winner !== b ? whyClass(b) : null],
        ["They were equally in favor", equal ? null : `Compare yes votes to each class’s total: ${shares}.`],
      ],
      {
        prompt: `Two classes voted on ${topic}. Which class was <b>more in favor</b>?`,
        fig: voteFig(classes),
        hint: "The classes are different sizes, so compare each class’s yes votes to its total: as a fraction or a percent.",
        explain: equal
          ? `${shares}: the same share, so they were equally in favor.`
          : `${shares}, so class ${winner.name} was more in favor.`,
        facts: { t: "which", classes },
      },
    );
  }
  /* the percent of one class that voted yes */
  const [voters] = twoClasses(),
    share = voters.share;
  return numP({
    prompt: `A class voted on ${pick(TOPICS)}: <b>${voters.yes}</b> students voted yes and <b>${voters.no}</b> voted no. What percent of the class voted yes?`,
    answer: share,
    unit: "%",
    hint: `The whole class is ${voters.yes} + ${voters.no} = ${voters.size}. What is ${voters.yes} out of ${voters.size} as a percent?`,
    misc: [
      [voters.yes, `${voters.yes} is how many voted yes. Write it out of 100.`],
      [100 - share, `That’s the percent that voted no.`],
      [
        (100 * voters.yes) / voters.no,
        `That compares yes to no. A percent of the class compares yes to the whole class: ${voters.size}.`,
      ],
    ],
    explain: `${voters.yes} out of ${voters.size} = ${share} out of 100, so ${pct(share)}.`,
    facts: { t: "percent", classes: [voters] },
  });
}

/* ---------- Station 4: majorities and supermajorities (Lesson 4) ---------- */
/* text: the rule as written; frac: at least this fraction of the votes, or none for more than half; sizes: how many vote */
const RULES = [
  { text: "more than half", sizes: range(41).map((i) => 20 + i) },
  { text: "at least 2/3", frac: [2, 3], sizes: [21, 24, 27, 30, 36, 40, 45, 50, 60, 90, 120, 240] },
  { text: "at least 3/4", frac: [3, 4], sizes: [20, 24, 28, 30, 32, 36, 40, 50, 60, 80, 100, 120] },
  { text: "at least 60%", frac: [3, 5], sizes: [20, 25, 30, 32, 40, 45, 50, 60, 80, 120, 200] },
  { text: "at least 55%", frac: [11, 20], sizes: [40, 60, 80, 100, 120, 200, 240] },
];
/* the exact share of n the rule asks for, and the fewest whole votes that meet it */
const ruleExact = (rule, n) => (rule.frac ? (n * rule.frac[0]) / rule.frac[1] : n / 2);
const ruleNeed = (rule, n) => (rule.frac ? Math.ceil((n * rule.frac[0]) / rule.frac[1] - 1e-9) : majorityOf(n));
const DECISIONS = [
  ["change the school mascot", "students"],
  ["paint the school purple", "students"],
  ["change the club’s rules", "club members"],
  ["build a new skate park", "town council votes"],
];
function genSuper() {
  const rule = pick(RULES),
    n = pick(rule.sizes),
    exact = ruleExact(rule, n),
    need = ruleNeed(rule, n),
    [action, who] = pick(DECISIONS),
    asWhole = rule.frac && Number.isInteger(exact) ? "" : `, and votes come in wholes`;
  if (Math.random() < 0.6) {
    /* the fewest yes votes that pass */
    return numP({
      prompt: `To ${action}, the rules need <b>${rule.text}</b> of the votes to be yes. ${n} ${who} vote. What is the fewest yes votes that will pass it?`,
      answer: need,
      unit: "votes",
      hint: rule.frac
        ? `Find ${rule.text.replace("at least ", "")} of ${n}. If it isn’t a whole number, round up: one vote short doesn’t pass.`
        : `Half of ${n} is ${fmt(n / 2)}. The fewest whole votes <i>more</i> than that?`,
      misc: [
        ...(Number.isInteger(exact) && !rule.frac
          ? [[exact, `${exact} is exactly half. A majority is <i>more</i> than half: one more.`]]
          : []),
        ...(!Number.isInteger(exact)
          ? [
              [
                Math.floor(exact),
                `${Math.floor(exact)} is less than ${fmt(exact)}${asWhole}. Round up to pass the rule.`,
              ],
            ]
          : []),
        [n - need, `That’s how many could vote no. The question asks for yes votes.`],
        ...(rule.frac
          ? [[majorityOf(n), `${majorityOf(n)} is just more than half. This rule needs ${rule.text}.`]]
          : []),
      ],
      explain: rule.frac
        ? `${rule.text.replace("at least ", "")} of ${n} is ${fmt(exact)}${Number.isInteger(exact) ? "" : `, so it takes ${need} whole votes`}.`
        : `Half of ${n} is ${fmt(exact)}, so more than half is ${need}.`,
      facts: { t: "need", n, need, rule: rule.text },
    });
  }
  /* does this many yes votes pass? Close to the line, on either side */
  const yes = Math.min(n, need + pick([-3, -2, -1, 0, 1, 2])),
    passes = yes >= need;
  return mcP(
    [
      [
        "Yes, it passes",
        passes ? null : `${yes} is less than ${need}, the fewest that meets ${rule.text} of ${n}${asWhole}.`,
      ],
      ["No, it falls short", passes ? `${yes} meets ${rule.text} of ${n}: the fewest that pass is ${need}.` : null],
    ],
    {
      prompt: `To ${action}, the rules need <b>${rule.text}</b> of the votes to be yes. Of ${n} ${who}, <b>${yes}</b> vote yes. Does it pass?`,
      hint: rule.frac
        ? `Find ${rule.text.replace("at least ", "")} of ${n}, and compare.`
        : `Half of ${n} is ${fmt(n / 2)}. Is ${yes} more than that?`,
      explain: `${rule.frac ? `${rule.text.replace("at least ", "")} of ${n} is ${fmt(exact)}` : `Half of ${n} is ${fmt(exact)}`}, so it takes ${need} yes votes. ${yes} ${passes ? "is enough" : "isn’t enough"}.`,
      facts: { t: "pass", n, need, rule: rule.text },
    },
  );
}

/* ---------- Station 5: who really decided (Lesson 4) ---------- */
const PARTS = [10, 20, 25, 40, 50, 60, 75, 80];
const PLACES = ["Rosa’s Tacos", "Pho Corner", "Big Slice Pizza", "Noodle Hut", "Sunny Side Diner"];
const MASCOTS = ["owls", "sea lions", "banana slugs", "comets", "foxes"];
function genTurnout() {
  /* three levels (a newspaper's contest) or two (a school election), with a whole-number percent of everyone at the end */
  const three = Math.random() < 0.5,
    /* at most half a town subscribes to its newspaper */
    parts = range(three ? 3 : 2).map((i) => pick(three && i === 0 ? PARTS.filter((part) => part <= 50) : PARTS)),
    answer = parts.reduce((s, p) => (s * p) / 100, 100);
  if (!Number.isInteger(answer) || answer < 2) return genTurnout();
  const place = pick(PLACES),
    mascot = pick(MASCOTS),
    last = parts[parts.length - 1],
    asksPeople = Math.random() < 0.35,
    /* a town of 2,000 to 10,000 people, or a school of 200 to 1,000 students */
    town = three ? pick([2000, 4000, 5000, 10000]) : pick([200, 400, 500, 600, 800, 1000]),
    people = (town * answer) / 100,
    levels = three
      ? [
          { name: "the town", part: 1 },
          { name: "subscribers", part: parts[0] / 100 },
          { name: "voters", part: parts[1] / 100 },
          { name: `chose ${place}`, part: parts[2] / 100 },
        ]
      : [
          { name: "all students", part: 1 },
          { name: "voters", part: parts[0] / 100 },
          { name: `chose the ${mascot}`, part: parts[1] / 100 },
        ];
  /* the people who chose: a whole number with at most 2 nonzero digits */
  if (asksPeople && !(Number.isInteger(people) && String(people).replace(/0/g, "").length <= 2)) return genTurnout();
  const story = three
    ? `Only newspaper subscribers could vote for the best restaurant. <b>${parts[0]}%</b> of the people in town subscribe, <b>${parts[1]}%</b> of the subscribers voted, and <b>${parts[2]}%</b> of the voters chose ${place}.`
    : `<b>${parts[0]}%</b> of the students voted for a new mascot, and <b>${parts[1]}%</b> of the voters chose the ${mascot}.`;
  const everyone = three ? "people in town" : "students",
    steps = three
      ? `${parts[0]}% of the town is ${parts[0]}. ${parts[1]}% of those is ${fmt((parts[0] * parts[1]) / 100)}. ${parts[2]}% of those is ${fmt(answer)}.`
      : `${parts[0]}% of the students is ${parts[0]}. ${parts[1]}% of those is ${fmt(answer)}.`;
  return numP({
    prompt: asksPeople
      ? `${story} The ${three ? "town" : "school"} has <b>${fmt(town)}</b> ${three ? "people" : "students"}. How many of them chose ${three ? place : `the ${mascot}`}?`
      : `${story} What percent of <b>all the ${everyone}</b> chose ${three ? place : `the ${mascot}`}?`,
    answer: asksPeople ? people : answer,
    unit: asksPeople ? "people" : "%",
    fig: (show, done) =>
      nestBars(
        levels.map((level, i) => ({
          ...level,
          note: i === levels.length - 1 && !done ? "?" : show || i === 0 ? undefined : "",
        })),
        { label: "Bars inside bars" },
      ),
    hint: `Think of 100 ${everyone}. Take each percent of the group before it, one step at a time.`,
    misc: asksPeople
      ? [
          [(town * last) / 100, `That’s ${last}% of everyone. It’s ${last}% of the voters, a much smaller group.`],
          [
            (town * parts[0]) / 100,
            `That’s the ${three ? "subscribers" : "voters"}. Keep going to the ones who chose.`,
          ],
          [answer, `${fmt(answer)}% is the percent. Find ${fmt(answer)}% of ${fmt(town)}.`],
        ]
      : [
          [last, `${last}% of the <i>voters</i>, not of all the ${everyone}. Most of them didn’t vote.`],
          ...(three
            ? [[(parts[0] * parts[1]) / 100, `That’s the percent who voted. Take ${last}% of them.`]]
            : [[parts[0], `That’s the percent who voted. Take ${last}% of them.`]]),
          [
            parts.reduce((s, p) => s + p, 0),
            `Percents of different groups don’t add. Take each one of the group before.`,
          ],
        ],
    explain: `Out of 100 ${everyone}: ${steps} So ${fmt(answer)}% of all the ${everyone}${asksPeople ? `, and ${fmt(answer)}% of ${fmt(town)} is ${fmt(people)}` : ""}.`,
    facts: { t: asksPeople ? "people" : "percent", parts, town: asksPeople ? town : null, school: !three },
  });
}

/* ---------- Station 6: more than two choices (Lesson 5) ---------- */
/* three choices for each election (a, b, c), what it's for, and whether a sentence says "the" before a choice */
const ELECTIONS = [
  { what: "the class trip", names: { a: "zoo", b: "museum", c: "beach" }, the: true },
  { what: "the class pet", names: { a: "fish", b: "hamster", c: "lizard" }, the: true },
  { what: "the school color", names: { a: "purple", b: "green", c: "orange" }, the: false },
  { what: "field day", names: { a: "relay", b: "kickball", c: "tag" }, the: false },
  { what: "the weekend", names: { a: "hiking", b: "bowling", c: "cooking" }, the: false },
];
/* a choice as a sentence says it ("the zoo", "hiking"), and with a capital to start one */
const calledIn = (vote, c) => (vote.the ? "the " : "") + vote.names[c];
const capital = (text) => text[0].toUpperCase() + text.slice(1);
const CHOICES = ["a", "b", "c"];
const ORDERS = [
  ["a", "b", "c"],
  ["a", "c", "b"],
  ["b", "a", "c"],
  ["b", "c", "a"],
  ["c", "a", "b"],
  ["c", "b", "a"],
];
const METHOD_NAMES = { plurality: "plurality", runoff: "a runoff", points: "instant runoff" };
const METHOD_RULES = {
  plurality: "Plurality: the most first choices wins.",
  runoff:
    "Runoff: if no choice has more than half the votes, leave out the one with the fewest, and each group votes for its highest choice still in.",
  points:
    "Instant runoff: each voter gives 2 points to a 1st choice, 1 to a 2nd, and 0 to a 3rd. The most points wins.",
};
/* 3 or 4 groups with different rankings, 15 to 36 voters, and a single winner by every method */
function election() {
  for (;;) {
    const groups = shuffle(ORDERS)
        .slice(0, R(3, 4))
        .map((rank) => ({ n: R(2, 12), rank })),
      total = votersIn(groups);
    if (total < 15 || total > 36) continue;
    /* every choice is some group's first choice, so each one is in the running */
    if (!CHOICES.every((c) => groups.some((g) => g.rank[0] === c))) continue;
    if (Object.keys(METHODS).every((m) => winnerBy(groups, CHOICES, m))) return groups;
  }
}
/* the counting each method does, in words */
function methodSteps(groups, names, method) {
  const list = (counts) =>
    Object.entries(counts)
      .map(([c, v]) => `${names[c]} ${v}`)
      .join(", ");
  if (method === "plurality") return `First choices: ${list(pluralityOf(groups, CHOICES).counts)}.`;
  if (method === "points") {
    const { counts } = pointsOf(groups, CHOICES);
    return `Points: ${list(counts)}.`;
  }
  const { rounds } = runoffOf(groups, CHOICES),
    need = majorityOf(votersIn(groups));
  return rounds
    .map((round, i) => {
      const said = `${i ? "Again" : "First choices"}: ${list(round.counts)}.`;
      return round.out ? `${said} No one has ${need}, so leave out ${names[round.out]}.` : said;
    })
    .join(" ");
}
function genBallot() {
  const type = pick(["winner", "winner", "winner", "majority", "points"]),
    vote = pick(ELECTIONS),
    { what, names } = vote,
    called = (c) => calledIn(vote, c);
  let groups = election();
  const total = votersIn(groups);
  if (type === "winner") {
    /* who wins by one method; most of the time, deal again until another method picks someone else (the mistake to catch) */
    const method = pick(Object.keys(METHODS));
    for (let tries = 0; Math.random() < 0.7 && tries < 40; tries++) {
      const winner = winnerBy(groups, CHOICES, method);
      if (Object.keys(METHODS).some((m) => winnerBy(groups, CHOICES, m) !== winner)) break;
      groups = election();
    }
    const winner = winnerBy(groups, CHOICES, method),
      others = Object.keys(METHODS).filter((m) => m !== method);
    /* why a choice that didn't win might look like it did */
    const whyChoice = (c) => {
      const by = others.find((m) => winnerBy(groups, CHOICES, m) === c);
      return by
        ? `${capital(called(c))} wins by ${METHOD_NAMES[by]}, but not by ${METHOD_NAMES[method]}. ${methodSteps(groups, names, method)}`
        : methodSteps(groups, names, method);
    };
    return mcP(
      CHOICES.map((c) => [names[c], c === winner ? null : whyChoice(c)]),
      {
        prompt: `A class ranked its choices for ${what}. Who wins by <b>${METHOD_NAMES[method]}</b>?${method === "points" ? " (2 points for a 1st choice, 1 for a 2nd, 0 for a 3rd)" : ""}`,
        fig: () => ballotTable(groups, names),
        hint: METHOD_RULES[method],
        explain: `${methodSteps(groups, names, method)} ${capital(called(winner))} wins.`,
        facts: { t: "winner", groups, method },
      },
    );
  }
  if (type === "majority") {
    /* how many votes is more than half */
    const answer = majorityOf(total);
    return numP({
      prompt: `A class of ${total} ranked its choices for ${what}. How many first-choice votes does a choice need to have a <b>majority</b>?`,
      answer,
      unit: "votes",
      fig: () => ballotTable(groups, names),
      hint: `A majority is more than half. Half of ${total} is ${fmt(total / 2)}.`,
      misc: [
        [total / 2, `${fmt(total / 2)} is exactly half. A majority is <i>more</i> than half.`],
        [Math.floor(total / 2), `${Math.floor(total / 2)} is less than half of ${total}.`],
        [
          Math.max(...Object.values(pluralityOf(groups, CHOICES).counts)),
          `That’s the most first choices anyone has. A majority is more than half of ${total}, whoever has it.`,
        ],
      ],
      explain: `Half of ${total} is ${fmt(total / 2)}, so a majority is ${answer} votes or more.`,
      facts: { t: "majority", groups },
    });
  }
  /* one choice's points in an instant runoff */
  const choice = pick(CHOICES),
    points = pointsOf(groups, CHOICES).counts[choice],
    firsts = pluralityOf(groups, CHOICES).counts[choice],
    seconds = groups.filter((g) => g.rank[1] === choice).reduce((s, g) => s + g.n, 0);
  if (!points) return genBallot();
  return numP({
    prompt: `A class voted on ${what} by <b>instant runoff</b>: each voter gives 2 points to a 1st choice, 1 to a 2nd, and 0 to a 3rd. How many points does <b>${called(choice)}</b> get?`,
    answer: points,
    unit: "points",
    fig: () => ballotTable(groups, names),
    hint: `Find the groups with ${called(choice)} 1st (2 points per voter) and 2nd (1 point per voter).`,
    misc: [
      [firsts, `${firsts} voters put it 1st, and each of them gives it 2 points. 2nd choices count too.`],
      [firsts * 2, `That’s the points from 1st choices. Add 1 point for each voter who put it 2nd.`],
      [firsts + seconds, `Each 1st choice is worth 2 points, not 1.`],
    ],
    explain: `${firsts} voters put it 1st (${firsts} × 2 = ${firsts * 2}) and ${seconds} put it 2nd (${seconds} × 1 = ${seconds}): ${points} points.`,
    facts: { t: "points", groups },
  });
}

/* ---------- Station 7: picking representatives (Lesson 6) ---------- */
/* places that share representatives: what each is called, the people in them, the representatives, names, and the people per
   representative that make friendly numbers (realistic sizes: schools of 10 to 500, families of 1 to 8 children, and so on) */
const SHARERS = [
  {
    place: "school",
    places: "schools",
    people: "students",
    rep: "advisor",
    reps: "advisors",
    names: ["Oak", "Pine", "Elm", "Cedar", "Maple"],
    per: [10, 12, 15, 20, 25, 30, 40, 50],
  },
  {
    place: "family",
    places: "families",
    people: "children",
    rep: "computer",
    reps: "computers",
    names: ["Baum", "Chu", "Davila", "Eno", "Farouz"],
    per: [2],
  },
  {
    place: "neighborhood",
    places: "neighborhoods",
    people: "people",
    rep: "council seat",
    reps: "council seats",
    names: ["Northside", "Riverside", "Hilltop", "Downtown", "Westgate"],
    per: [1000, 2000, 2500, 5000],
  },
];
function genSeats() {
  const type = pick(["per", "seats", "seats", "mascot"]);
  if (type === "mascot") return genMascot();
  /* 3 to 5 places, each with a whole number of representatives (1 to 4) times the people per representative */
  const sharer = pick(SHARERS),
    per = pick(sharer.per),
    count = R(3, sharer.place === "family" ? 5 : 4),
    seats = range(count).map(() => R(1, sharer.place === "family" ? 3 : 4)),
    sizes = seats.map((s) => s * per),
    total = sizes.reduce((s, v) => s + v, 0),
    seatTotal = seats.reduce((s, v) => s + v, 0),
    names = sharer.names.slice(0, count),
    table = () =>
      infoTable(
        [sharer.place, sharer.people],
        names.map((name, i) => [name, fmt(sizes[i])]),
        `${sharer.people} in each ${sharer.place}`,
      );
  if (new Set(seats).size === 1) return genSeats();
  const intro = `${seatTotal} ${sharer.reps} are shared fairly among ${count} ${sharer.places}, by how many ${sharer.people} each has.`;
  if (type === "per") {
    /* the people per representative: everyone, shared among all the representatives */
    return numP({
      prompt: `${intro} How many <b>${sharer.people} per ${sharer.rep}</b> is that?`,
      answer: per,
      unit: sharer.people,
      fig: table,
      hint: `Add up all the ${sharer.people}, then share them among all ${seatTotal} ${sharer.reps}.`,
      misc: [
        [
          total / count,
          `That’s the ${sharer.people} per ${sharer.place}. Share the ${fmt(total)} among the ${seatTotal} ${sharer.reps}.`,
        ],
        [total, `That’s all the ${sharer.people}. Divide by the ${seatTotal} ${sharer.reps}.`],
        [
          seatTotal / count,
          `That’s ${sharer.reps} per ${sharer.place}. The question asks for ${sharer.people} per ${sharer.rep}.`,
        ],
      ],
      explain: `${sizes.map(fmt).join(" + ")} = ${fmt(total)} ${sharer.people}, and ${fmt(total)} ÷ ${seatTotal} = ${fmt(per)} ${sharer.people} per ${sharer.rep}.`,
      facts: { t: "per", place: sharer.place, sizes, seats },
    });
  }
  /* one place's representatives: its people ÷ the people per representative */
  const which = R(0, count - 1),
    answer = seats[which];
  return numP({
    prompt: `${intro} That’s ${fmt(per)} ${sharer.people} per ${sharer.rep}. How many ${sharer.reps} should <b>${names[which]}</b> get?`,
    answer,
    unit: sharer.reps,
    fig: table,
    hint: `Each ${sharer.rep} is for ${fmt(per)} ${sharer.people}. How many groups of ${fmt(per)} are in ${fmt(sizes[which])}?`,
    misc: [
      [
        1,
        `One for each ${sharer.place} isn’t fair when they’re different sizes. Use ${fmt(per)} ${sharer.people} per ${sharer.rep}.`,
      ],
      [seatTotal / count, `That’s an equal share for every ${sharer.place}. Bigger ${sharer.places} get more.`],
      [
        sizes[which] / seatTotal,
        `Divide by the ${sharer.people} per ${sharer.rep}, ${fmt(per)}, not by the number of ${sharer.reps}.`,
      ],
    ],
    explain: `${fmt(sizes[which])} ÷ ${fmt(per)} = ${answer}, so ${names[which]} gets ${answer} ${answer === 1 ? sharer.rep : sharer.reps}.`,
    facts: { t: "seats", place: sharer.place, sizes, seats },
  });
}
/* Three classes pick a mascot. With one vote per class the winner can differ from the winner counting every student. */
function genMascot() {
  const [x, y] = shuffle(MASCOTS).slice(0, 2);
  /* two classes narrowly for x, one class strongly for y, so y has more students overall */
  const close = range(2).map(() => {
      const size = R(20, 30),
        forX = Math.floor(size / 2) + R(1, 3);
      return [forX, size - forX];
    }),
    big = R(24, 32),
    bigX = R(2, 7),
    classes = shuffle([...close, [bigX, big - bigX]]),
    totalX = classes.reduce((s, c) => s + c[0], 0),
    totalY = classes.reduce((s, c) => s + c[1], 0);
  if (totalY <= totalX) return genMascot();
  const asksClasses = Math.random() < 0.5,
    winner = asksClasses ? x : y,
    loser = asksClasses ? y : x,
    classesFor = (m) => classes.filter((c) => (m === x ? c[0] > c[1] : c[1] > c[0])).length;
  return mcP(
    [
      [`the ${winner}`, null],
      [
        `the ${loser}`,
        asksClasses
          ? `The ${loser} have more students in all (${totalY} to ${totalX}), but each class gets one vote, and ${classesFor(x)} classes chose the ${x}.`
          : `${classesFor(x)} classes chose the ${x}, but counting every student, the ${y} have ${totalY} votes to ${totalX}.`,
      ],
    ],
    {
      prompt: asksClasses
        ? `Three classes voted for a school mascot. If <b>each class gets one vote</b> (for the choice that won in that class), which mascot wins?`
        : `Three classes voted for a school mascot. Counting <b>every student’s vote</b>, which mascot wins?`,
      fig: () =>
        infoTable(
          ["", x, y],
          classes.map((c, i) => [`class ${"ABC"[i]}`, c[0], c[1]]),
          "Votes in each class",
        ),
      hint: asksClasses
        ? "Find the winner in each class, then count classes."
        : "Add each mascot’s votes from all three classes.",
      explain: `One vote per class: the ${x} win ${classesFor(x)} classes to ${classesFor(y)}. Every student: the ${y} have ${totalY} votes to ${totalX}. So the ${winner} win.`,
      facts: { t: "mascot", classes: classes.map(([a, b]) => ({ size: a + b })) },
    },
  );
}

/* ---------- stations ---------- */
const ICON = {
  world:
    '<circle cx="32" cy="32" r="24" fill="rgba(127,227,255,.2)" stroke="#f3f6fb" stroke-width="2.5"/><path d="M14,24 Q24,18 28,26 T42,22 M12,38 Q22,34 30,42 T50,40" fill="none" stroke="#5fe0a8" stroke-width="3"/><g fill="#ffc93c"><circle cx="24" cy="32" r="3"/><circle cx="34" cy="32" r="3"/><circle cx="44" cy="32" r="3"/></g>',
  squares:
    '<rect x="6" y="14" width="52" height="36" fill="none" stroke="#f3f6fb" stroke-width="2.5"/><rect x="6" y="14" width="36" height="36" fill="rgba(255,201,60,.45)" stroke="#f3f6fb" stroke-width="2"/><rect x="42" y="14" width="16" height="16" fill="rgba(127,227,255,.4)" stroke="#f3f6fb" stroke-width="2"/><rect x="42" y="30" width="16" height="16" fill="rgba(127,227,255,.4)" stroke="#f3f6fb" stroke-width="2"/>',
  yessier:
    '<rect x="8" y="22" width="20" height="34" fill="rgba(255,201,60,.6)" stroke="#f3f6fb" stroke-width="2"/><rect x="36" y="12" width="20" height="44" fill="rgba(127,227,255,.45)" stroke="#f3f6fb" stroke-width="2"/><path d="M12,40 l5,5 9,-12" fill="none" stroke="#5fe0a8" stroke-width="3.5"/>',
  super:
    '<rect x="6" y="26" width="52" height="14" fill="rgba(170,205,255,.15)" stroke="#f3f6fb" stroke-width="2"/><rect x="6" y="26" width="38" height="14" fill="rgba(255,201,60,.6)"/><path d="M40,16 V50" stroke="#ff8ac4" stroke-width="3"/><text x="40" y="12" fill="#ff8ac4" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">2/3</text>',
  turnout:
    '<rect x="6" y="10" width="52" height="12" fill="rgba(170,205,255,.25)" stroke="#f3f6fb" stroke-width="1.5"/><rect x="6" y="28" width="26" height="12" fill="rgba(127,227,255,.45)" stroke="#f3f6fb" stroke-width="1.5"/><rect x="6" y="46" width="10" height="12" fill="rgba(255,201,60,.6)" stroke="#f3f6fb" stroke-width="1.5"/>',
  ballot:
    '<rect x="14" y="8" width="36" height="48" rx="4" fill="rgba(9,32,61,.6)" stroke="#f3f6fb" stroke-width="2.5"/><g fill="#ffc93c" font-size="11" font-weight="700" font-family="monospace"><text x="20" y="24">1</text><text x="20" y="38">2</text><text x="20" y="52">3</text></g><path d="M30,20 H44 M30,34 H44 M30,48 H44" stroke="#7fe3ff" stroke-width="3"/>',
  seats:
    '<g fill="rgba(255,201,60,.6)" stroke="#f3f6fb" stroke-width="2"><rect x="6" y="34" width="12" height="22"/><rect x="24" y="22" width="12" height="34"/><rect x="42" y="10" width="16" height="46"/></g><g fill="#7fe3ff"><circle cx="12" cy="28" r="3"/><circle cx="30" cy="16" r="3"/><circle cx="46" cy="5" r="3"/><circle cx="54" cy="5" r="3"/></g>',
  boss: '<path d="M10,26 L32,10 L54,26 Z" fill="rgba(255,201,60,.6)" stroke="#f3f6fb" stroke-width="2.5"/><path d="M14,30 V50 M24,30 V50 M40,30 V50 M50,30 V50" stroke="#f3f6fb" stroke-width="3.5"/><path d="M8,54 H56" stroke="#f3f6fb" stroke-width="3"/>',
};
const ZONES = [
  {
    id: "world",
    name: "World in a Class",
    lessons: "Lesson 2",
    blurb: "Shrink the world to a class: scale a share to a class, write it as a percent, and scale back up.",
    gen: genWorld,
  },
  {
    id: "squares",
    name: "Square Cutter",
    lessons: "Lesson 3",
    blurb: "Cut the largest squares from a rectangle, again and again, and find the smallest square.",
    gen: genSquares,
  },
  {
    id: "yessier",
    name: "Which Was Yessier?",
    lessons: "Lesson 4",
    blurb: "Decide which class was more in favor by comparing each class’s yes votes to its total.",
    gen: genYessier,
  },
  {
    id: "super",
    name: "Supermajority",
    lessons: "Lesson 4",
    blurb: "Find the fewest votes for a majority or a supermajority, and decide whether a vote passes.",
    gen: genSuper,
  },
  {
    id: "turnout",
    name: "Who Really Decided?",
    lessons: "Lesson 4",
    blurb: "Take a percent of a percent to find how few people really made the choice.",
    gen: genTurnout,
  },
  {
    id: "ballot",
    name: "Ballot Count",
    lessons: "Lesson 5",
    blurb: "Count ranked ballots by plurality, by a runoff, and by instant runoff points.",
    gen: genBallot,
  },
  {
    id: "seats",
    name: "Fair Seats",
    lessons: "Lesson 6",
    blurb: "Share representatives fairly: people per representative, and seats for each group.",
    gen: genSeats,
  },
  {
    id: "boss",
    name: "Town Meeting",
    lessons: "Whole unit · 10 problems",
    blurb: "A mixed review from every station. Aim for 3 stars.",
    gen: () => pick([genWorld, genSquares, genYessier, genSuper, genTurnout, genBallot, genSeats])(),
  },
];
