/* Field Trip (Grade 2 Unit 9): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Paths on a map come from this unit's figs.js; ten-frames, base-ten blocks, and digits from shared/blocks.js; open number
   lines and tape diagrams from shared/numlines.js; line plots from shared/graphs.js; and mcOf and miscOf from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Every problem
   carries `facts`, the numbers it was made from, so checks.js can work the answer out again. Facts stay within 20, paths are
   whole centimeters, and numbers stay within 1,000 with at most one new or broken ten or hundred. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* two different students */
const twoKids = () => shuffle(KIDS).slice(0, 2);
/* named mistakes, leaving out any that land on the answer for these numbers (the mistake doesn't show up then) */
const named = (answer, list) =>
  miscOf(
    answer,
    list.filter(([value]) => value !== answer && value > 0),
  );
/* an equation with a gold box for the missing number, like 8 + ? = 15 */
const eqn = (text) => `<span class="eqn">${text.replace("?", '<span class="q">?</span>')}</span>`;
/* "1 hundred", "3 tens": n of a place (its name plural) */
const placeCount = (n, word) => `${n} ${n === 1 ? word.slice(0, -1) : word}`;

/* ---------- Bus Ride: sums and differences within 20 (Lessons 1–2) ---------- */
function genFacts() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* add, making a ten: the hint moves counters up to fill the first frame */
    const a = R(6, 9),
      b = R(11 - a, 9),
      need = 10 - a,
      sum = a + b;
    return {
      kind: "num",
      unit: "",
      answer: sum,
      facts: { t: "add", a, b },
      prompt: `What is <b>${a} + ${b}</b>?`,
      fig: (show) =>
        tenFrames(
          show
            ? cellsOf([a, "a"], [need, "b moved"], [b - need, "b"])
            : [...cellsOf([a, "a"], [10 - a, ""]), ...cellsOf([b, "b"])],
          {
            label: `${a} yellow and ${b} blue counters`,
          },
        ),
      misc: named(sum, [
        [a > b ? a - b : b - a, `You subtracted. ${a} + ${b} puts them together.`],
        [sum - 1, `Count again: ${a} + ${need} = 10, and ${b - need} more.`],
        [10 + b, `${a} isn’t 10 yet. Move ${need} of the ${b} to make 10 first.`],
      ]),
      hint: `${a} needs ${need} more to make 10. Move ${need} blue counters up.`,
      explain: `${a} + ${b} = 10 + ${b - need} = ${sum}.`,
    };
  }
  if (variant === 1) {
    /* subtract by thinking addition: total − part = ? is part + ? = total */
    const part = R(5, 9),
      total = R(Math.max(11, part + 3), part + 9),
      missing = total - part,
      kid = pick(KIDS);
    return {
      kind: "num",
      unit: "",
      answer: missing,
      facts: { t: "missing", equation: `${total} − ${part} = ?` },
      prompt: `What is <b>${total} − ${part}</b>? Think: ${part} + ? = ${total}.`,
      fig: (show) => tenFrames(cellsOf([part, "a"], [show ? missing : 0, "b"]), { label: `${part} counters` }),
      misc: named(missing, [
        [total + part, `You added. Think: what do you add to ${part} to make ${total}?`],
        [part, `${part} is the number you take away. What goes with ${part} to make ${total}?`],
        [missing - 1, `${part} + ${missing - 1} = ${total - 1}. Count on 1 more.`],
      ]),
      hint: `Count on from ${part}: ${10 - part} gets to 10, then ${total - 10} more to ${total}.`,
      explain: `${part} + ${missing} = ${total}, so ${total} − ${part} = ${missing}.`,
    };
  }
  /* which fact is in the same family? One wrong choice is false, and the other is true but uses other numbers */
  const a = R(4, 9);
  let second = R(4, 9);
  if (second === a) second = a === 9 ? 8 : a + 1;
  const total = a + second;
  return {
    ...mcOf([
      [`${total} − ${second} = ${a}`, null],
      [`${total} − ${a} = ${second + 1}`, `${total} − ${a} is ${second}, not ${second + 1}.`],
      [
        `${second} + ${a + 1} = ${total + 1}`,
        `That’s true, but it uses ${total + 1}. The family of ${a} + ${second} uses only ${a}, ${second}, and ${total}.`,
      ],
    ]),
    facts: { t: "family", a, b: second },
    prompt: `You know <b>${a} + ${second} = ${total}</b>. Which fact do you know too?`,
    fig: () =>
      svgWrap(
        Math.max(a, second) * CUBE + 8,
        2 * CUBE + 12,
        cubes(4, 4, a, "a") + cubes(4, CUBE + 8, second, "b"),
        `${a} yellow cubes over ${second} blue cubes`,
      ),
    hint: `The facts in the family use ${a}, ${second}, and ${total}. Start with ${total} and take away a part.`,
    explain: `${a} + ${second} = ${total} goes with ${total} − ${second} = ${a} and ${total} − ${a} = ${second}.`,
  };
}

/* ---------- Trail Map: measure on a map (Lessons 3–4) ---------- */
/* places on the field trip map */
const PLACES = ["Bus", "Pond", "Barn", "Garden", "Museum", "Park", "Cafe", "Tower"];
/* a path's legs, turning each time: across, down, across (or down, across, down) */
function zigzag(count) {
  const acrossFirst = Math.random() < 0.5;
  return range(count).map((i) => [(i % 2 === 0) === acrossFirst ? "r" : "d", R(3, 12)]);
}
function genMap() {
  const variant = R(0, 2),
    [from, to] = shuffle(PLACES).slice(0, 2);
  if (variant === 0) {
    /* how long is a path? Add its parts */
    const legs = zigzag(R(2, 3)),
      total = legTotal(legs),
      longest = Math.max(...legs.map(([, n]) => n));
    return {
      kind: "num",
      unit: "cm",
      answer: total,
      facts: { t: "path", legs },
      prompt: `How long is the path from the ${from} to the ${to}?`,
      fig: () =>
        pathFig([{ from: `the ${from}`, to: `the ${to}`, legs }], { label: `A path from the ${from} to the ${to}` }),
      misc: named(total, [
        [
          total - legs[legs.length - 1][1],
          `That leaves out the last part, ${legs[legs.length - 1][1]} cm. Add every part.`,
        ],
        [longest, "That’s the longest part. Add all the parts."],
        [legs.length, "That’s how many parts. Add their lengths."],
      ]),
      hint: `Add the parts: ${legSum(legs)}.`,
      explain: `${legSum(legs)} = ${total}. The path is ${total} cm long.`,
    };
  }
  if (variant === 1) {
    /* two paths to the same place: gold goes across and down; blue goes down past it, across, and back up (gold goes down at
       least 5, so its label stays clear of the end's name) */
    const across = R(4, 12),
      down = R(5, 9),
      extra = R(2, 5),
      gold = [
        ["r", across],
        ["d", down],
      ],
      blue = [
        ["d", down + extra],
        ["r", across],
        ["u", extra],
      ],
      diff = legTotal(blue) - legTotal(gold);
    return {
      kind: "num",
      unit: "cm",
      answer: diff,
      facts: { t: "shorter", gold, blue },
      prompt: `How much shorter is the gold path than the blue path?`,
      fig: () =>
        pathFig(
          [
            { from: `the ${from}`, to: `the ${to}`, legs: gold, cls: "a" },
            { from: `the ${from}`, to: `the ${to}`, legs: blue, cls: "b" },
          ],
          { label: `Two paths from the ${from} to the ${to}, gold and blue` },
        ),
      misc: named(diff, [
        [legTotal(gold) + legTotal(blue), "You added the paths. How much shorter is the difference: subtract."],
        [legTotal(blue), `That’s the blue path: ${legSum(blue)}. Subtract the gold path.`],
        [legTotal(gold), `That’s the gold path: ${legSum(gold)}. Find the difference.`],
        [extra, `The blue path goes ${extra} cm farther down, and then ${extra} cm back up.`],
      ]),
      hint: `Gold: ${legSum(gold)}. Blue: ${legSum(blue)}. Then subtract.`,
      explain: `Gold: ${legSum(gold)} = ${legTotal(gold)} cm. Blue: ${legSum(blue)} = ${legTotal(blue)} cm. ${legTotal(blue)} − ${legTotal(gold)} = ${diff}.`,
    };
  }
  /* a line plot of path lengths: how many are one length, or which length is most common */
  const lo = R(10, 15),
    counts = {};
  for (;;) {
    Object.keys(counts).forEach((k) => delete counts[k]);
    range(R(8, 11)).forEach(() => {
      const v = lo + R(0, 5);
      counts[v] = (counts[v] || 0) + 1;
    });
    const values = Object.values(counts),
      most = Math.max(...values);
    if (most <= 5 && values.filter((n) => n === most).length === 1 && values.length >= 3) break;
  }
  const lengths = Object.keys(counts).map(Number),
    total = Object.values(counts).reduce((sum, n) => sum + n, 0),
    plot = (mark) => lineplot(counts, lo, lo + 5, { unit: "cm", u: 52, mark });
  if (Math.random() < 0.5) {
    const v = pick(lengths),
      n = counts[v];
    return {
      kind: "num",
      unit: "paths",
      answer: n,
      facts: { t: "plotCount", counts, v },
      prompt: `The class measured paths on the map. How many paths are ${v} cm long?`,
      fig: (show) => plot(show ? v : null),
      misc: named(n, [
        [v, `${v} is the length. Count the Xs above ${v}.`],
        [total, "That’s every path. Count only the Xs above one number."],
      ]),
      hint: `Find ${v} on the line. Each X above it is one path.`,
      explain: `There ${n === 1 ? "is 1 X" : `are ${n} Xs`} above ${v}, so ${n} ${n === 1 ? "path is" : "paths are"} ${v} cm long.`,
    };
  }
  const most = Math.max(...Object.values(counts)),
    common = lengths.find((v) => counts[v] === most),
    others = shuffle(lengths.filter((v) => v !== common)).slice(0, 2);
  return {
    ...mcOf([
      [`${common} cm`, null],
      ...others.map((v) => [
        `${v} cm`,
        `${v} cm has ${counts[v]} X${counts[v] === 1 ? "" : "s"}. Find the tallest stack.`,
      ]),
    ]),
    facts: { t: "plotMost", counts },
    prompt: "The class measured paths on the map. Which length do the most paths have?",
    fig: (show) => plot(show ? common : null),
    hint: "Look for the tallest stack of Xs.",
    explain: `${common} cm has the most Xs: ${most}.`,
  };
}

/* ---------- Number Museum: numbers to 1,000 (Lessons 5–6) ---------- */
function genNumbers() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* blocks with more than 9 tens or ones: what number? */
    const many = Math.random() < 0.5 ? "t" : "o",
      hundreds = R(1, 7),
      tens = many === "t" ? R(11, 18) : R(1, 8),
      ones = many === "o" ? R(11, 18) : R(1, 9),
      n = 100 * hundreds + 10 * tens + ones;
    return {
      kind: "num",
      unit: "",
      answer: n,
      facts: { t: "blocks", hundreds, tens, ones },
      prompt: `What number do the blocks show? <span class="sub">${placeCount(hundreds, "hundreds")}, ${placeCount(tens, "tens")}, ${placeCount(ones, "ones")}</span>`,
      fig: () =>
        htoFig(
          hundreds,
          tens,
          ones,
          { cls: { t: "b", o: "c" } },
          `${placeCount(hundreds, "hundreds")}, ${placeCount(tens, "tens")}, ${placeCount(ones, "ones")}`,
        ),
      misc: named(n, [
        [
          Number(`${hundreds}${tens}${ones}`),
          `${many === "t" ? `${tens} tens` : `${ones} ones`} is more than 9. Make a ${many === "t" ? "hundred" : "ten"} from 10 of them first.`,
        ],
        [
          many === "t" ? n - 100 : n - 10,
          many === "t" ? "10 tens make a new hundred. Count it." : "10 ones make a new ten. Count it.",
        ],
      ]),
      hint:
        many === "t"
          ? `${tens} tens is 1 hundred and ${tens - 10} tens.`
          : `${ones} ones is 1 ten and ${ones - 10} ones.`,
      explain: `${100 * hundreds} + ${10 * tens} + ${ones} = ${n}.`,
    };
  }
  if (variant === 1) {
    /* which one also makes n? The right one trades a hundred for 10 tens; the wrong ones forget part of the trade */
    const n = R(2, 9) * 100 + R(1, 8) * 10 + R(1, 9),
      [hundreds, tens, ones] = digits(n);
    return {
      ...mcOf([
        [`${placeCount(hundreds - 1, "hundreds")}, ${tens + 10} tens, ${placeCount(ones, "ones")}`, null],
        [
          `${placeCount(hundreds, "hundreds")}, ${tens + 10} tens, ${placeCount(ones, "ones")}`,
          `That’s ${hundreds * 100} + ${(tens + 10) * 10} + ${ones} = ${n + 100}. The new tens come from a hundred, so there’s 1 hundred fewer.`,
        ],
        [
          `${placeCount(hundreds - 1, "hundreds")}, ${placeCount(tens, "tens")}, ${ones + 10} ones`,
          `That’s ${(hundreds - 1) * 100} + ${tens * 10} + ${ones + 10} = ${n - 90}. A hundred is 10 tens, not 10 ones.`,
        ],
      ]),
      stack: true,
      facts: { t: "alsoMakes", n },
      prompt: `Which one also makes <b>${n}</b>?`,
      fig: () => numBlocks(n),
      hint: "Trade 1 hundred for 10 tens. The number stays the same.",
      explain: `${(hundreds - 1) * 100} + ${(tens + 10) * 10} + ${ones} = ${n}.`,
    };
  }
  /* which expression equals n? It adds a part to n − part, or takes it from n + part; the wrong ones use a tenth of the part,
     or twice it */
  const n = R(3, 7) * 100 + pick([0, 50, R(1, 9) * 10]),
    part = pick([10, 20, 50, 100, 200]),
    plus = Math.random() < 0.5;
  const right = plus ? `${n - part} + ${part}` : `${n + part} − ${part}`,
    wrongs = plus
      ? [
          [
            `${n - part} + ${part / 10}`,
            `${n - part} + ${part / 10} = ${n - part + part / 10}. Add ${part}, not ${part / 10}.`,
          ],
          [`${n - part} + ${2 * part}`, `${n - part} + ${2 * part} = ${n + part}. That adds too much.`],
        ]
      : [
          [
            `${n + part} − ${part / 10}`,
            `${n + part} − ${part / 10} = ${n + part - part / 10}. Take away ${part}, not ${part / 10}.`,
          ],
          [`${n + part} − ${2 * part}`, `${n + part} − ${2 * part} = ${n - part}. That takes away too much.`],
        ];
  return {
    ...mcOf([[right, null], ...wrongs]),
    facts: { t: "expression", n },
    prompt: `Which expression equals <b>${n}</b>?`,
    fig: () => numBlocks(n),
    hint: "Work out each expression. Which one lands on the number?",
    explain: `${right} = ${n}.`,
  };
}

/* ---------- Ticket Booth: add and subtract within 1,000 (Lessons 7–8) ---------- */
/* a and b that add within 1,000 with one new ten or hundred at most; small: two-digit numbers */
function sumPair(small) {
  for (;;) {
    const a = small ? R(12, 79) : R(101, 799),
      b = small ? R(11, 79) : R(101, 799),
      [, tensA, onesA] = digits(a),
      [, tensB, onesB] = digits(b),
      newTen = onesA + onesB >= 10,
      newHundred = tensA + tensB + (newTen ? 1 : 0) >= 10;
    if (a + b <= (small ? 99 : 999) && !(newTen && newHundred) && onesA && onesB) return [a, b];
  }
}
/* a and b to subtract (a − b ≥ 10) with one broken ten or hundred at most */
function diffPair(small) {
  for (;;) {
    const a = small ? R(31, 98) : R(301, 989),
      b = small ? R(11, 79) : R(101, 799),
      [, tensA, onesA] = digits(a),
      [, tensB, onesB] = digits(b),
      breakTen = onesA < onesB,
      breakHundred = tensA - (breakTen ? 1 : 0) < tensB;
    if (a - b >= 10 && !(breakTen && breakHundred) && onesA && onesB) return [a, b];
  }
}
/* who buys tickets, and what for */
const TICKETS = ["the museum", "the zoo", "the science show", "the boat ride", "the planetarium"];
function genAddSub() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* add near a hundred: jump to the hundred, then back */
    const near = R(1, 6) * 100 - pick([1, 2]),
      b = R(101, 897 - near),
      round = Math.ceil(near / 100) * 100,
      back = round - near,
      sum = near + b;
    return {
      kind: "num",
      unit: "",
      answer: sum,
      facts: { t: "op", a: near, op: "+", b },
      prompt: `What is <b>${near} + ${b}</b>? <span class="sub">${near} is ${back} less than ${round}.</span>`,
      fig: (show) => jumps(b, [round, -back], 2, !show),
      misc: named(sum, [
        [b + round, `That adds ${round}. ${near} is ${back} less, so take ${back} away.`],
        [b + round + back, `${near} is ${back} less than ${round}: take ${back} away, don’t add it.`],
      ]),
      hint: `${b} + ${round} = ${b + round}. Then take away ${back}.`,
      explain: `${b} + ${round} = ${b + round}, and ${b + round} − ${back} = ${sum}.`,
    };
  }
  if (variant === 1) {
    /* tickets sold: add, within 1,000 or within 100 */
    const small = Math.random() < 0.35,
      [a, b] = sumPair(small),
      place = pick(TICKETS),
      sum = a + b;
    return {
      kind: "num",
      unit: "tickets",
      answer: sum,
      facts: { t: "op", a, op: "+", b },
      prompt: `${place[0].toUpperCase() + place.slice(1)} sold ${a} tickets in the morning and ${b} tickets in the afternoon. How many tickets is that?`,
      fig: (show) =>
        show
          ? jumps(
              a,
              [Math.floor(b / 100) * 100, Math.floor((b % 100) / 10) * 10, b % 10].filter((move) => move),
            )
          : jumps(a, [b], 1, true),
      misc: named(sum, [
        [Math.abs(a - b), "Both amounts go together, so add."],
        [sum - 10, "Count the new ten."],
        [sum - 100, "Count the new hundred."],
      ]),
      hint: "Add the hundreds, then the tens, then the ones.",
      explain: `${a} + ${b} = ${sum}.`,
    };
  }
  if (variant === 2) {
    /* tickets left: subtract, within 1,000 or within 100 */
    const small = Math.random() < 0.35,
      [a, b] = diffPair(small),
      place = pick(TICKETS),
      left = a - b,
      [hundredsA, tensA, onesA] = digits(a),
      [hundredsB, tensB, onesB] = digits(b);
    return {
      kind: "num",
      unit: "tickets",
      answer: left,
      facts: { t: "op", a, op: "−", b },
      prompt: `${place[0].toUpperCase() + place.slice(1)} had ${a} tickets. It sold ${b} of them. How many tickets are left?`,
      fig: (show) =>
        show
          ? jumps(
              a,
              [-Math.floor(b / 100) * 100, -Math.floor((b % 100) / 10) * 10, -(b % 10)].filter((move) => move),
            )
          : numBlocks(a),
      misc: named(left, [
        [a + b, "Some tickets were sold, so there are fewer now. Subtract."],
        [
          (hundredsA - hundredsB) * 100 + Math.abs(tensA - tensB) * 10 + Math.abs(onesA - onesB),
          "You took the smaller digit from the bigger one in a place. Break a ten or a hundred instead.",
        ],
      ]),
      hint: `Take away ${b} by place: the hundreds, then the tens, then the ones.`,
      explain: `${a} − ${b} = ${left}.`,
    };
  }
  /* close numbers: count on from the smaller one across a hundred */
  const hundred = R(2, 9) * 100,
    small = hundred - R(1, 8),
    big = hundred + R(1, 8);
  return {
    kind: "num",
    unit: "",
    answer: big - small,
    facts: { t: "op", a: big, op: "−", b: small },
    prompt: `What is <b>${big} − ${small}</b>? Count on from ${small}.`,
    fig: (show) => jumps(small, [hundred - small, big - hundred], show ? 2 : 0),
    misc: named(big - small, [
      [big + small, "You added. The difference is how far apart the numbers are."],
      [hundred - small, `${small} to ${hundred} is ${hundred - small}. Keep going to ${big}.`],
      [big - hundred, `${hundred} to ${big} is ${big - hundred}. Don’t forget ${small} to ${hundred}.`],
    ]),
    hint: `Count on from ${small} to ${hundred}, then on to ${big}.`,
    explain: `${small} to ${hundred} is ${hundred - small}, and ${hundred} to ${big} is ${big - hundred}. ${hundred - small} + ${big - hundred} = ${big - small}.`,
  };
}

/* ---------- Story Stage: story problems (Lessons 9–13) ---------- */
/* things a story counts */
const STUFF = ["shells", "stickers", "marbles", "beads", "cards", "rocks"];
/* the kinds of story problems, and a story of each kind with numbers a and b (b less than a) */
const KINDS = {
  "Add to": (kid, other, thing, a, b) => `${kid} had ${a} ${thing}. ${kid} found ${b} more ${thing}.`,
  "Take from": (kid, other, thing, a, b) => `${kid} had ${a} ${thing}. ${kid} gave ${b} ${thing} to ${other}.`,
  "Put together": (kid, other, thing, a, b) =>
    `${kid} has ${a} ${thing}. ${other} has ${b} ${thing}. They put them all in one box.`,
  Compare: (kid, other, thing, a, b) => `${kid} has ${a} ${thing}. ${other} has ${a - b} fewer ${thing} than ${kid}.`,
};
function genStories() {
  const variant = R(0, 2),
    [kid, other] = twoKids(),
    thing = pick(STUFF),
    a = R(25, 90),
    b = R(11, a - 11);
  if (variant === 0) {
    /* what kind of story is it? */
    const kinds = Object.keys(KINDS),
      kind = pick(kinds),
      wrongs = shuffle(kinds.filter((k) => k !== kind)).slice(0, 2),
      story = KINDS[kind](kid, other, thing, a, b);
    const why = {
      "Add to": `Something is added to a group in “Add to.” Look at what happens to ${kid}’s ${thing}.`,
      "Take from": `Some are taken from a group in “Take from.” Look at what happens to ${kid}’s ${thing}.`,
      "Put together": "Two groups are put together in “Put together.” Does that happen here?",
      Compare: "Two amounts are compared in “Compare.” Does the story say more or fewer than?",
    };
    return {
      ...mcOf([[kind, null], ...wrongs.map((k) => [k, why[k]])]),
      facts: { t: "kind", kind },
      prompt: `What kind of story is this? <b>${story}</b>`,
      fig: () => numBlocks(a, `${a} ${thing} in base-ten blocks`),
      hint: "Is something added, taken away, put together, or compared?",
      explain: `${story} That’s a “${kind}” story.`,
    };
  }
  if (variant === 1) {
    /* which question asks you to add (or subtract)? */
    const subtract = Math.random() < 0.5,
      story = `${kid} has ${a} ${thing}. ${other} has ${b} ${thing}.`,
      inAll = `How many ${thing} do they have in all?`,
      more = `How many more ${thing} does ${kid} have than ${other}?`,
      cant = pick([
        `How many ${thing} does ${kid} want?`,
        `Where did ${other} get the ${thing}?`,
        `How big are the ${thing}?`,
      ]);
    return {
      ...mcOf([
        [subtract ? more : inAll, null],
        [
          subtract ? inAll : more,
          subtract ? "In all means put them together: add." : "How many more compares them: subtract.",
        ],
        [cant, "The story can’t answer that."],
      ]),
      stack: true,
      facts: { t: "question", subtract, a, b },
      prompt: `${story} Which question asks you to <b>${subtract ? "subtract" : "add"}</b>?`,
      fig: () =>
        tapes(
          [
            { label: kid, n: a, show: a },
            { label: other, n: b, show: b },
          ],
          { label: `Tape diagram: ${kid} ${a}, ${other} ${b}` },
        ),
      hint: "In all puts amounts together. How many more compares them.",
      explain: subtract ? `${more} ${a} − ${b} = ${a - b}.` : `${inAll} ${a} + ${b} = ${a + b}.`,
    };
  }
  /* solve a story with a tape diagram: a part unknown, the smaller amount unknown, or the start unknown */
  const kind = pick(["part", "smaller", "start"]),
    whole = a,
    known = b,
    answer = whole - known;
  const text = {
    part: `${kid} has ${whole} ${thing}. ${known} are big and the rest are small. How many ${thing} are small?`,
    smaller: `${kid} has ${whole} ${thing}. ${other} has ${known} fewer ${thing} than ${kid}. How many ${thing} does ${other} have?`,
    start: `${kid} had some ${thing}. ${kid} got ${known} more ${thing}. Now ${kid} has ${whole} ${thing}. How many did ${kid} have at first?`,
  }[kind];
  return {
    kind: "num",
    unit: thing,
    answer,
    facts: { t: "tape", kind, whole, known },
    prompt: text,
    fig: () =>
      kind === "smaller"
        ? tapes(
            [
              { label: kid, n: whole, show: whole },
              { label: other, n: answer, show: "?" },
            ],
            { diff: String(known), label: `Tape diagram: ${other} has ${known} fewer than ${kid}` },
          )
        : partWhole(
            kind === "part"
              ? [
                  { n: known, show: String(known) },
                  { n: answer, show: "?", hi: true },
                ]
              : [
                  { n: answer, show: "?", hi: true },
                  { n: known, show: String(known) },
                ],
            String(whole),
            `Tape diagram: ${known} and a part make ${whole}`,
          ),
    misc: named(answer, [
      [whole + known, `${whole} is the whole. Take away ${known} to find the other part.`],
      [known, `${known} is the part you know. Find the other part.`],
    ]),
    hint: `${known} + ? = ${whole}. Find ${whole} − ${known}.`,
    explain: `${whole} − ${known} = ${answer}, because ${known} + ${answer} = ${whole}.`,
  };
}

/* ---------- Ride Home: everything ---------- */
const genBoss = () => pick([genFacts, genMap, genNumbers, genAddSub, genStories])();

const ZONES = [
  {
    id: "facts",
    name: "Bus Ride",
    lessons: "Lessons 1–2",
    blurb: "Make a ten, think addition to subtract, and find facts that go together.",
    gen: genFacts,
  },
  {
    id: "map",
    name: "Trail Map",
    lessons: "Lessons 3–4",
    blurb: "Add up the parts of a path, find the shorter way, and read a line plot of paths.",
    gen: genMap,
  },
  {
    id: "numbers",
    name: "Number Museum",
    lessons: "Lessons 5–6",
    blurb: "Read numbers with lots of tens or ones, trade a hundred for tens, and find expressions for a number.",
    gen: genNumbers,
  },
  {
    id: "addsub",
    name: "Ticket Booth",
    lessons: "Lessons 7–8",
    blurb: "Add and subtract tickets within 1,000, jump to a hundred, and count on.",
    gen: genAddSub,
  },
  {
    id: "stories",
    name: "Story Stage",
    lessons: "Lessons 9–13",
    blurb: "Tell what kind a story is, pick the question that adds or subtracts, and solve with tape diagrams.",
    gen: genStories,
  },
  {
    id: "boss",
    name: "Ride Home",
    lessons: "All lessons",
    blurb: "Drive the bus back to school! Every right answer takes it one of 10 stops closer.",
    gen: genBoss,
  },
];

/* the bus on a road with 10 stops, `stops` of them passed (also the boss icon, at 4) */
const busRoad = (stops) => {
  /* the stops are 5 pixels apart from x = 6; the bus sits at the stop it reached */
  const x = 6 + stops * 5;
  return (
    '<path d="M2,48H62" stroke="#a9c4e4" stroke-width="3"/>' +
    range(11)
      .map(
        (i) => `<circle cx="${6 + i * 5}" cy="48" r="1.6" fill="${i <= stops ? "#ffc93c" : "rgba(170,205,255,.4)"}"/>`,
      )
      .join("") +
    '<path d="M54,48V30L60,26L60,48" fill="#ff7b7b" stroke="#0a2340"/><rect x="55" y="38" width="4" height="10" fill="#0a2340"/>' +
    `<g transform="translate(${Math.min(x, 40) - 6},0)"><rect x="0" y="28" width="22" height="14" rx="3" fill="#ffc93c" stroke="#0a2340" stroke-width="1.2"/><rect x="3" y="31" width="5" height="5" fill="#7fe3ff"/><rect x="10" y="31" width="5" height="5" fill="#7fe3ff"/><circle cx="5" cy="43" r="2.5" fill="#0a2340"/><circle cx="17" cy="43" r="2.5" fill="#0a2340"/></g>`
  );
};
const ICON = {
  facts:
    '<rect x="6" y="18" width="46" height="24" rx="5" fill="#ffc93c" stroke="#0a2340" stroke-width="1.5"/><rect x="10" y="22" width="9" height="8" fill="#7fe3ff"/><rect x="22" y="22" width="9" height="8" fill="#7fe3ff"/><rect x="34" y="22" width="9" height="8" fill="#7fe3ff"/><circle cx="16" cy="44" r="5" fill="#0a2340"/><circle cx="42" cy="44" r="5" fill="#0a2340"/><text x="30" y="40" fill="#0a2340" font-size="9" font-weight="700" text-anchor="middle" font-family="monospace">8+7</text>',
  map: '<rect x="4" y="8" width="56" height="48" rx="5" fill="rgba(95,224,168,.2)" stroke="#5fe0a8" stroke-width="1.5"/><polyline points="12,18 36,18 36,46 52,46" fill="none" stroke="#ffc93c" stroke-width="4" stroke-linejoin="round"/><circle cx="12" cy="18" r="5" fill="#ff7b7b" stroke="#fff" stroke-width="1.5"/><circle cx="52" cy="46" r="5" fill="#ff7b7b" stroke="#fff" stroke-width="1.5"/>',
  numbers:
    '<path d="M8,26L32,10L56,26Z" fill="#cfd8e3" stroke="#0a2340" stroke-width="1.5"/><rect x="10" y="26" width="44" height="28" fill="#a9c4e4" stroke="#0a2340" stroke-width="1.5"/><path d="M18,30v20M28,30v20M36,30v20M46,30v20" stroke="#0a2340" stroke-width="2"/><text x="32" y="22" fill="#0a2340" font-size="8" font-weight="700" text-anchor="middle" font-family="monospace">352</text>',
  addsub:
    '<rect x="8" y="16" width="48" height="30" rx="4" fill="#ff9fb2" stroke="#0a2340" stroke-width="1.5"/><path d="M40,16v30" stroke="#0a2340" stroke-dasharray="3 2"/><text x="24" y="35" fill="#0a2340" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">+/−</text><circle cx="48" cy="31" r="4" fill="#0a2340"/>',
  stories:
    '<rect x="4" y="8" width="56" height="40" rx="3" fill="#7a2a3c" stroke="#0a2340" stroke-width="1.5"/><path d="M4,8Q14,30 4,48M60,8Q50,30 60,48" fill="#ff7b7b"/><rect x="18" y="22" width="28" height="8" rx="1" fill="rgba(255,201,60,.4)" stroke="#ffc93c"/><rect x="18" y="32" width="18" height="8" rx="1" fill="rgba(127,227,255,.3)" stroke="#7fe3ff"/><rect x="4" y="50" width="56" height="6" fill="#d9a066"/>',
  boss: busRoad(4),
};
