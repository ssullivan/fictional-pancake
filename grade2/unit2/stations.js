/* Market Day (Grade 2 Unit 2): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Base-ten blocks come from shared/blocks.js and this unit's figs.js (bpic, tensOf), tape diagrams and open number lines from
   shared/numlines.js, and mcOf and miscOf from shared/util.js. Each generator deals one of a few kinds of problem (variant),
   each with a comment saying what it asks. Every problem carries `facts`, the numbers it was made from, so checks.js can work
   the answer out again. Numbers stay within 100, and each problem needs at most one new ten or one broken ten. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* two different students */
const twoKids = () => shuffle(KIDS).slice(0, 2);
/* named mistakes, leaving out any that land on the answer for these numbers (the mistake doesn't show up then) */
const named = (answer, list) =>
  miscOf(
    answer,
    list.filter(([value]) => value !== answer && value > 0),
  );
/* an equation with a gold box for the missing number, like 26 + ? = 49 */
const eqn = (text) => `<span class="eqn">${text.replace("?", '<span class="q">?</span>')}</span>`;
/* "1 ten" or "3 tens", and the same for ones */
const tensWord = (n) => `${n} ten${n === 1 ? "" : "s"}`;
const onesWord = (n) => `${n} one${n === 1 ? "" : "s"}`;
/* does a + b make a new ten? Does a − b need a ten broken? (ones digits only: numbers stay within 100) */
const newTen = (a, b) => (a % 10) + (b % 10) >= 10;
const breaksTen = (a, b) => a % 10 < b % 10;
/* two two-digit numbers a and b (a from aLo to aHi, b from bLo to bHi) that pass the test fits(a, b) */
function dealPair(aLo, aHi, bLo, bHi, fits) {
  for (;;) {
    const a = R(aLo, aHi),
      b = R(bLo, bHi);
    if (fits(a, b)) return [a, b];
  }
}
/* a and b to add within 100: with a new ten (makeTen) or without one */
const addPair = (makeTen) =>
  dealPair(12, 79, 11, 79, (a, b) => a + b <= 99 && newTen(a, b) === makeTen && a % 10 && b % 10);
/* a and b to subtract (a − b > 0): breaking a ten (breakTen) or not; the answer is at least 10, and neither ends in 0 */
const subPair = (breakTen) =>
  dealPair(
    31,
    98,
    11,
    79,
    (a, b) => a - b >= 10 && breaksTen(a, b) === breakTen && a % 10 && b % 10 && a % 10 !== b % 10,
  );
/* a in blocks with b taken away: when a ten must be broken, one ten becomes 10 green ones first */
const takeFig = (a, b, label) => {
  const broke = breaksTen(a, b);
  return bpic(
    [
      {
        t: tensOf(a) - (broke ? 1 : 0),
        u: (a % 10) + (broke ? 10 : 0),
        opt: { traded: broke ? 10 : 0, outT: tensOf(b), outO: b % 10 },
      },
    ],
    label,
  );
};

/* market things, sold one at a time */
const GOODS = ["apples", "carrots", "peaches", "lemons", "potatoes", "onions", "pears", "plums"];
/* how a stand loses some of its goods (a shopper buys them) */
const BUYERS = ["A chef buys", "A family buys", "Shoppers buy", "A cook buys", "A school buys"];

/* ---------- Apple Stand: add and subtract to compare (Lessons 1–3) ---------- */
function genCompare() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* how many more: two amounts on a tape diagram, the difference with no broken ten */
    const [kid, other] = twoKids(),
      thing = pick(GOODS),
      [big, small] = subPair(false),
      diff = big - small;
    return {
      kind: "num",
      unit: thing,
      answer: diff,
      facts: { t: "more", big, small, kid, other },
      prompt: `${kid} picks ${big} ${thing}. ${other} picks ${small} ${thing}. How many more ${thing} does ${kid} pick than ${other}?`,
      fig: (show) =>
        tapes(
          [
            { label: kid, n: big, show: big },
            { label: other, n: small, show: small },
          ],
          { diff: show ? diff : "?" },
        ),
      misc: named(diff, [
        [big + small, "You added. “How many more” asks for the difference, so subtract."],
        [big, `That’s how many ${kid} picks. How many more than ${other}?`],
        [small, `That’s how many ${other} picks. How many more does ${kid} pick?`],
      ]),
      hint: `Subtract ${big} − ${small}: tens from tens, ones from ones. Or count up from ${small} to ${big}.`,
      explain: `${big} − ${small} = ${diff}. ${kid} picks ${diff} more ${thing}.`,
    };
  }
  if (variant === 1) {
    /* the missing number: a + ? = total, with no new ten */
    const [a, missing] = addPair(false),
      total = a + missing;
    return {
      kind: "num",
      unit: "",
      answer: missing,
      facts: { t: "missing", equation: `${a} + ? = ${total}` },
      prompt: `What number makes this true? ${eqn(`${a} + ? = ${total}`)}`,
      fig: (show) =>
        bpic(
          [a, "+", show ? { n: missing, cls: "b" } : "?"],
          show ? `${a} and ${missing} in blocks` : `${a} in blocks, plus how many?`,
        ),
      misc: named(missing, [
        [a + total, `That’s ${a} + ${total}. Find the number you add to ${a} to make ${total}.`],
        [total, `${total} is the total. What do you add to ${a} to get there?`],
        [a, `${a} is already in the equation. Find the other number.`],
      ]),
      hint: `Count up from ${a} to ${total}: first by tens, then by ones. Or think ${total} − ${a}.`,
      explain: `${a} + ${missing} = ${total}, so the missing number is ${missing}. (${total} − ${a} = ${missing} too.)`,
    };
  }
  /* add or subtract? A story where goods come in (add) or go out (subtract), with no new or broken ten */
  const adding = Math.random() < 0.5,
    thing = pick(GOODS);
  const [a, b] = adding ? addPair(false) : subPair(false),
    answer = adding ? a + b : a - b;
  const prompt = adding
    ? `The stand has ${a} ${thing}. The farmer brings ${b} more ${thing}. How many ${thing} does the stand have now?`
    : `The stand has ${a} ${thing}. ${pick(BUYERS)} ${b} ${thing}. How many ${thing} are left?`;
  return {
    kind: "num",
    unit: thing,
    answer,
    facts: { t: "story", op: adding ? "+" : "−", a, b },
    prompt,
    fig: (show) =>
      adding
        ? bpic([a, "+", { n: b, cls: "b" }], `${a} and ${b} in blocks`)
        : show
          ? takeFig(a, b, `${a} in blocks with ${b} crossed out`)
          : bpic([a], `${a} in blocks`),
    misc: named(answer, [
      adding
        ? [a - b, "The farmer brings more, so there are more now. Add."]
        : [a + b, "Some are bought, so there are fewer now. Subtract."],
      [a, `${a} is how many there were at first.`],
    ]),
    hint: adding
      ? "More are coming, so add. Add the tens, then the ones."
      : "Some go away, so subtract. Take away the tens, then the ones.",
    explain: adding ? `${a} + ${b} = ${answer}.` : `${a} − ${b} = ${answer}.`,
  };
}

/* ---------- Berry Patch: subtract your way (Lessons 5–6) ---------- */
function genTakeAway() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* take away tens, then ones (no broken ten); the hint crosses them out */
    const [a, b] = subPair(false),
      berry = pick(["blueberries", "strawberries", "raspberries"]),
      kid = pick(KIDS),
      left = a - b;
    return {
      kind: "num",
      unit: berry,
      answer: left,
      facts: { t: "story", op: "−", a, b },
      prompt: `A basket has ${a} ${berry}. ${kid} puts ${b} ${berry} in a bowl. How many ${berry} are still in the basket?`,
      fig: (show) => (show ? takeFig(a, b, `${a} in blocks with ${b} crossed out`) : bpic([a], `${a} in blocks`)),
      misc: named(left, [
        [a + b, "Some berries left the basket, so subtract."],
        [a - tensOf(b) * 10, `You took away the tens. Take away the ${onesWord(b % 10)} too.`],
        [a - (b % 10), `You took away the ones. Take away the ${tensWord(tensOf(b))} too.`],
      ]),
      hint: `${b} is ${tensWord(tensOf(b))} and ${onesWord(b % 10)}. Take away the tens, then the ones.`,
      explain: `Take away ${tensWord(tensOf(b))}: ${a - tensOf(b) * 10}. Take away ${onesWord(b % 10)}: ${left}. ${a} − ${b} = ${left}.`,
    };
  }
  if (variant === 1) {
    /* which jumps find a − b when there aren't enough ones: take away the ones to get to a ten, then the rest (and any ten) */
    const [a, b] = subPair(true),
      ones = a % 10,
      rest = (b % 10) - ones,
      tenJumps = tensOf(b) ? [-10 * tensOf(b)] : [];
    const right = [...tenJumps, -ones, -rest],
      tooMany = [...tenJumps, -ones, -(b % 10)],
      wrongTen = tensOf(b) ? [-tensOf(b), -ones, -rest] : [-ones, -rest, -10];
    const jumpsOf = (moves) => jumps(a, moves);
    const problem = mcOf([
      [JSON.stringify(right), null],
      [
        JSON.stringify(tooMany),
        `Those jumps take away ${ones} and then all ${b % 10} ones: that’s ${ones + (b % 10)} ones, too many.`,
      ],
      [
        JSON.stringify(wrongTen),
        tensOf(b)
          ? `The ${tensOf(b)} in ${b} is ${tensWord(tensOf(b))}: jump back ${tensOf(b) * 10}, not ${tensOf(b)}.`
          : `${b} has no tens. That takes away 10 more than ${b}.`,
      ],
    ]);
    problem.choices.forEach((choice, i) => {
      choice.label = jumpsOf(JSON.parse(choice.label)).replace(
        /aria-label="[^"]*"/,
        `aria-label="Picture ${"ABC"[i]}"`,
      );
    });
    return {
      ...problem,
      stack: true,
      facts: { t: "jumpsFor", a, b },
      prompt: `${a} has only ${onesWord(ones)}. Which jumps find <b>${a} − ${b}</b>?`,
      fig: () => bpic([a], `${a} in blocks`),
      hint: `Jump back ${ones} to get to ${a - ones}. Then take away the rest of the ${b}.`,
      explain:
        (tensOf(b) ? `Take away ${tensOf(b) * 10}: ${a - tensOf(b) * 10}. ` : "") +
        `Take away ${ones} to get to a ten, then ${rest} more: ${a - b}. ${ones} + ${rest} = ${b % 10}.`,
    };
  }
  /* count up from the smaller number: to the next ten, then tens, then ones; how far is it? */
  const [a, b] = subPair(true),
    toTen = 10 - (b % 10),
    tens = Math.floor(a / 10) * 10 - (b + toTen),
    ones = a % 10,
    moves = [toTen, tens, ones].filter((move) => move > 0),
    diff = a - b;
  return {
    kind: "num",
    unit: "",
    answer: diff,
    facts: { t: "countUp", a, b, moves },
    prompt: `Count up from ${b} to ${a}. What is <b>${a} − ${b}</b>?`,
    fig: () => jumps(b, moves),
    misc: named(diff, [
      [moves.length, "That’s how many jumps. Add up how far each jump goes."],
      [a + b, `That’s ${a} + ${b}. How far is it from ${b} to ${a}?`],
      [tens, `That’s only the tens jump. Add the other jumps too.`],
    ]),
    hint: `Add the jumps: ${moves.join(" + ")}.`,
    explain: `${moves.join(" + ")} = ${diff}, so ${a} − ${b} = ${diff}.`,
  };
}

/* ---------- Carrot Bunches: break a ten (Lessons 7–8) ---------- */
function genBreak() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* subtract when there aren't enough ones: carrots come in bunches of 10, and a bunch is broken into loose carrots */
    const [a, b] = subPair(true),
      left = a - b,
      buyer = pick(BUYERS);
    return {
      kind: "num",
      unit: "carrots",
      answer: left,
      facts: { t: "story", op: "−", a, b },
      prompt: `The stand has ${a} carrots: ${tensOf(a)} bunches of 10 and ${a % 10} loose carrots. ${buyer} ${b} carrots. How many carrots are left?`,
      fig: (show) =>
        show
          ? takeFig(a, b, `${a} carrots with a bunch broken and ${b} crossed out`)
          : bpic([a], `${a} in blocks: ${tensWord(tensOf(a))} and ${onesWord(a % 10)}`),
      misc: named(left, [
        [
          (tensOf(a) - tensOf(b)) * 10 + (b % 10) - (a % 10),
          `You did ${b % 10} − ${a % 10} in the ones. There are only ${a % 10} ones, so break a ten: ${(a % 10) + 10} − ${b % 10}.`,
        ],
        [a + b, "Carrots were bought, so subtract."],
        [
          left + 10,
          `You broke a ten but didn’t take it from the tens: ${tensWord(tensOf(a))} is now ${tensWord(tensOf(a) - 1)}.`,
        ],
      ]),
      hint: `${a} has only ${onesWord(a % 10)}. Break a ten: ${tensWord(tensOf(a) - 1)} and ${(a % 10) + 10} ones. Then take away.`,
      explain: `Break a ten: ${tensWord(tensOf(a) - 1)} and ${(a % 10) + 10} ones. ${(a % 10) + 10} − ${b % 10} = ${(a % 10) + 10 - (b % 10)} ones, and ${tensOf(a) - 1} − ${tensOf(b)} = ${tensOf(a) - 1 - tensOf(b)} tens. ${a} − ${b} = ${left}.`,
    };
  }
  /* a number with a ten broken: t − 1 tens and u + 10 ones */
  const n = R(3, 9) * 10 + R(1, 8),
    tens = tensOf(n),
    ones = n % 10;
  if (variant === 1) {
    /* which blocks show n? The right one has a ten broken; the wrong ones forget to take the ten, or forget the 10 ones */
    const right = [tens - 1, ones + 10],
      wrongs = [
        [
          [tens, ones + 10],
          `That’s ${tensWord(tens)} and ${ones + 10} ones: ${n + 10}. Breaking a ten takes 1 from the tens.`,
        ],
        [
          [tens - 1, ones],
          `That’s ${tensWord(tens - 1)} and ${onesWord(ones)}: ${n - 10}. The broken ten makes 10 more ones.`,
        ],
      ];
    const problem = mcOf([[JSON.stringify(right), null], ...wrongs.map(([pair, why]) => [JSON.stringify(pair), why])]);
    problem.choices.forEach((choice, i) => {
      const [t, u] = JSON.parse(choice.label);
      choice.label = bpic([{ t, u }], `Picture ${"ABC"[i]}`);
    });
    return {
      ...problem,
      stack: true,
      facts: { t: "showsN", n },
      prompt: `Which blocks show <b>${n}</b>?`,
      fig: () => bpic([n], `${n} in blocks: ${tensWord(tens)} and ${onesWord(ones)}`),
      hint: `Count each picture: tens by 10s, then the ones.`,
      explain: `${tensWord(tens - 1)} and ${ones + 10} ones: ${(tens - 1) * 10} + ${ones + 10} = ${n}.`,
    };
  }
  /* n is t − 1 tens and how many ones? */
  return {
    kind: "num",
    unit: "ones",
    answer: ones + 10,
    facts: { t: "breakOnes", n },
    prompt: `Break a ten in ${n}. ${n} is ${tensWord(tens - 1)} and how many ones?`,
    fig: (show) =>
      show
        ? bpic([{ t: tens - 1, u: ones + 10, opt: { traded: 10 } }], `${n} with a ten broken into ones`)
        : bpic([n], `${n} in blocks: ${tensWord(tens)} and ${onesWord(ones)}`),
    misc: named(ones + 10, [
      [ones, `That’s the ones before breaking a ten. The broken ten adds 10 ones.`],
      [10, `The broken ten makes 10 ones. Add the ${onesWord(ones)} already there.`],
      [ones + 1, "The ten breaks into 10 ones, not 1."],
    ]),
    hint: `A ten is 10 ones. ${ones} + 10 = ?`,
    explain: `${n} = ${(tens - 1) * 10} + ${ones + 10}: ${tensWord(tens - 1)} and ${ones + 10} ones.`,
  };
}

/* ---------- Flower Buckets: add and subtract within 100 (Lesson 9) ---------- */
function genWithin() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* add with a new ten: flowers in buckets */
    const [a, b] = addPair(true),
      sum = a + b,
      onesSum = (a % 10) + (b % 10),
      [kid] = twoKids();
    return {
      kind: "num",
      unit: "flowers",
      answer: sum,
      facts: { t: "story", op: "+", a, b },
      prompt: `${kid} has ${a} flowers in one bucket and ${b} flowers in another. How many flowers does ${kid} have in all?`,
      fig: (show) => addBlocks(a, b, show),
      misc: named(sum, [
        [
          sum - 10,
          `You didn’t count the new ten. ${a % 10} + ${b % 10} = ${onesSum} ones is 1 ten and ${onesWord(onesSum - 10)}.`,
        ],
        [
          Number(`${tensOf(a) + tensOf(b)}${onesSum}`),
          `${onesSum} ones is 1 ten and ${onesWord(onesSum - 10)}. Put the new ten with the other tens.`,
        ],
        [Math.abs(a - b), "You subtracted. Both buckets together, so add."],
      ]),
      hint: `Add the ones: ${a % 10} + ${b % 10} = ${onesSum}. That makes a new ten.`,
      explain: `Tens: ${tensOf(a) * 10} + ${tensOf(b) * 10} = ${(tensOf(a) + tensOf(b)) * 10}. Ones: ${a % 10} + ${b % 10} = ${onesSum}. ${(tensOf(a) + tensOf(b)) * 10} + ${onesSum} = ${sum}.`,
    };
  }
  if (variant === 1) {
    /* subtract with a broken ten */
    const [a, b] = subPair(true),
      diff = a - b;
    return {
      kind: "num",
      unit: "",
      answer: diff,
      facts: { t: "missing", equation: `${a} − ${b} = ?` },
      prompt: `What is <b>${a} − ${b}</b>?`,
      fig: (show) =>
        show ? takeFig(a, b, `${a} with a ten broken and ${b} crossed out`) : bpic([a], `${a} in blocks`),
      misc: named(diff, [
        [
          (tensOf(a) - tensOf(b)) * 10 + (b % 10) - (a % 10),
          `You did ${b % 10} − ${a % 10} in the ones. Break a ten instead: ${(a % 10) + 10} − ${b % 10}.`,
        ],
        [diff + 10, "You broke a ten but forgot to take it from the tens."],
        [a + b, "That’s adding. Take away."],
      ]),
      hint: `${a} has only ${onesWord(a % 10)}. Break a ten to get ${(a % 10) + 10} ones.`,
      explain: `Break a ten: ${tensWord(tensOf(a) - 1)} and ${(a % 10) + 10} ones. Take away ${b}: ${a} − ${b} = ${diff}.`,
    };
  }
  /* which one needs a new ten (or a broken ten)? One that does, one that doesn't, and one with the other sign */
  const breakIt = Math.random() < 0.5,
    sign = breakIt ? "−" : "+";
  const [a, b] = breakIt ? subPair(true) : addPair(true);
  /* the same kind of problem that doesn't need it: change b's ones so they fit */
  const fits = breakIt ? tensOf(b) * 10 + R(0, a % 10) : tensOf(b) * 10 + R(0, 9 - (a % 10));
  const right = `${a} ${sign} ${b}`,
    easy = `${a} ${sign} ${fits}`,
    other = breakIt ? `${a - b} + ${b}` : `${a + b} − ${b}`;
  const otherWhy = breakIt
    ? "That’s adding. Adding never breaks a ten."
    : "That’s subtracting. Subtracting never makes a new ten.";
  return {
    ...mcOf([
      [right, null],
      [
        easy,
        breakIt
          ? `${a} has ${onesWord(a % 10)}, enough to take away ${onesWord(fits % 10)}. No ten to break.`
          : `${a % 10} + ${fits % 10} = ${(a % 10) + (fits % 10)} ones. That’s not enough for a new ten.`,
      ],
      [other, otherWhy],
    ]),
    facts: { t: "needs", breakIt, a, b },
    prompt: `Which one needs you to <b>${breakIt ? "break a ten" : "make a new ten"}</b>?`,
    fig: () => bpic([a], `${a} in blocks`),
    hint: breakIt
      ? `Look at the ones. Are there enough ones in ${a} to take away?`
      : "Add the ones. Do they make 10 or more?",
    explain: breakIt
      ? `${a} has only ${onesWord(a % 10)}, and ${b} has ${onesWord(b % 10)}. To find ${right}, break a ten.`
      : `${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)} ones: 10 of them make a new ten. ${right} = ${a + b}.`,
  };
}

/* ---------- Market Stories: story problems with diagrams and equations (Lessons 11–14) ---------- */
function genStories() {
  const variant = R(0, 3),
    [kid, friend] = twoKids(),
    thing = pick(GOODS);
  if (variant === 0) {
    /* which tape matches a put-together story with a part unknown */
    const [part, other] = addPair(Math.random() < 0.5),
      total = part + other;
    const problem = mcOf([
      [JSON.stringify([[part, "?"], total]), null],
      [JSON.stringify([[part, total], "?"]), `${total} is how many they pick together. That’s the whole, on top.`],
      [
        JSON.stringify([["?", total], part]),
        `${part} is only ${kid}’s part. The whole is how many they pick together.`,
      ],
    ]);
    problem.choices.forEach((choice, i) => {
      const [parts, top] = JSON.parse(choice.label);
      choice.label = partWhole(
        parts.map((show, j) => ({ n: show === "?" ? (j ? other : part) : show, show: String(show) })),
        String(top),
        `Picture ${"ABC"[i]}`,
      );
    });
    return {
      ...problem,
      stack: true,
      facts: { t: "diagram", part, total },
      prompt: `${kid} picks ${part} ${thing}. ${friend} picks some ${thing} too. Together they pick ${total} ${thing}. Which diagram matches the story?`,
      hint: "The whole goes on top. Which numbers are parts, and which is the whole?",
      explain: `The whole is ${total}, on top. ${kid}’s part is ${part}, and ${friend}’s part is the ?: ${total} − ${part} = ${other}.`,
    };
  }
  if (variant === 1) {
    /* the start unknown: some, then more come, and now there are this many */
    const [start, more] = addPair(Math.random() < 0.5),
      now = start + more;
    return {
      kind: "num",
      unit: thing,
      answer: start,
      facts: { t: "startUnknown", more, now },
      prompt: `${kid} had some ${thing}. ${kid} picked ${more} more ${thing}. Now ${kid} has ${now} ${thing}. How many ${thing} did ${kid} have at first?`,
      fig: (show) =>
        partWhole(
          [
            { n: start, show: show ? String(start) : "?", hi: true },
            { n: more, show: String(more) },
          ],
          String(now),
          `Some and ${more} more make ${now}`,
        ),
      misc: named(start, [
        [now + more, `${now} is how many ${kid} has now, after picking more. Take the ${more} away.`],
        [now, `${now} is how many ${kid} has now. How many before picking ${more}?`],
        [more, `${more} is how many ${kid} picked.`],
      ]),
      hint: `? + ${more} = ${now}. Count up from ${more} to ${now}, or find ${now} − ${more}.`,
      explain: `${start} + ${more} = ${now}, so ${kid} had ${start} ${thing} at first. (${now} − ${more} = ${start}.)`,
    };
  }
  if (variant === 2) {
    /* which equation matches the story: some, then more come (how many came?), or some go (how many went?) */
    const adding = Math.random() < 0.5;
    const [a, b] = adding ? addPair(false) : subPair(false),
      after = adding ? a + b : a - b;
    const story = adding
      ? `${kid} had ${a} ${thing}. ${friend} gave ${kid} some more. Now ${kid} has ${after} ${thing}. How many ${thing} did ${friend} give ${kid}?`
      : `${kid} had ${a} ${thing}. ${kid} gave some to ${friend}. Now ${kid} has ${after} ${thing}. How many ${thing} did ${kid} give away?`;
    const right = adding ? `${a} + ? = ${after}` : `${a} − ? = ${after}`;
    return {
      ...mcOf([
        [right, null],
        [
          adding ? `${a} + ${after} = ?` : `${a} + ${after} = ?`,
          `${after} is how many ${kid} has now, not more to add. The ? is how many ${adding ? "came" : "went"}.`,
        ],
        [
          adding ? `${after} + ? = ${a}` : `? − ${a} = ${after}`,
          adding ? `${kid} starts with ${a}, not ${after}.` : `${kid} starts with ${a}, then some go away.`,
        ],
      ]),
      facts: { t: "equation", adding, a, after },
      prompt: `${story} Which equation matches the story?`,
      fig: () =>
        adding
          ? partWhole(
              [
                { n: a, show: String(a) },
                { n: b, show: "?", hi: true },
              ],
              String(after),
              `${a} and some more make ${after}`,
            )
          : partWhole(
              [
                { n: after, show: String(after) },
                { n: b, show: "?", hi: true },
              ],
              String(a),
              `${a} is ${after} and the part given away`,
            ),
      hint: adding
        ? `${kid} starts with ${a} and gets some more (the ?). Then ${kid} has ${after}.`
        : `${kid} starts with ${a} and gives some away (the ?). Then ${kid} has ${after}.`,
      explain: `${right}. The missing number is ${b}: ${adding ? `${a} + ${b} = ${after}` : `${a} − ${b} = ${after}`}.`,
    };
  }
  /* two steps: some, more come, then some go */
  let start, more, gone;
  do {
    [start, more] = addPair(false);
    gone = R(1, Math.floor((start + more) / 10) - 1) * 10;
  } while (start + more - gone < 10);
  const middle = start + more,
    end = middle - gone;
  return {
    kind: "num",
    unit: thing,
    answer: end,
    facts: { t: "twoStep", start, more, gone },
    prompt: `${kid} has ${start} ${thing}. ${kid} picks ${more} more. Then ${kid} gives ${gone} ${thing} to ${friend}. How many ${thing} does ${kid} have now?`,
    fig: (show) =>
      partWhole(
        [
          { n: start, show: String(start) },
          { n: more, show: String(more) },
        ],
        show ? String(middle) : "?",
        show ? `${start} and ${more} make ${middle}` : `${start} and ${more} make the whole`,
      ),
    misc: named(end, [
      [middle, `That’s after picking more. Then ${kid} gives ${gone} away.`],
      [middle + gone, `${kid} gives ${gone} away, so take them away.`],
      [start - gone, `Don’t forget the ${more} ${kid} picked.`],
    ]),
    hint: `Step 1: ${start} + ${more}. Step 2: take away ${gone}.`,
    explain: `${start} + ${more} = ${middle}. ${middle} − ${gone} = ${end}.`,
  };
}

/* ---------- Pumpkin Wagon: everything ---------- */
const genBoss = () => pick([genCompare, genTakeAway, genBreak, genWithin, genStories])();

const ZONES = [
  {
    id: "compare",
    name: "Apple Stand",
    lessons: "Lessons 1–3",
    blurb: "Find how many more, find a missing number, and decide whether a story adds or subtracts.",
    gen: genCompare,
  },
  {
    id: "takeaway",
    name: "Berry Patch",
    lessons: "Lessons 5–6",
    blurb: "Take away tens, then ones, and jump on a number line when there aren’t enough ones.",
    gen: genTakeAway,
  },
  {
    id: "break",
    name: "Carrot Bunches",
    lessons: "Lessons 7–8",
    blurb: "Break a bunch of 10 into ones to take away, and show a number a new way.",
    gen: genBreak,
  },
  {
    id: "within",
    name: "Flower Buckets",
    lessons: "Lesson 9",
    blurb: "Make a new ten when you add, break a ten when you subtract, and know which one you need.",
    gen: genWithin,
  },
  {
    id: "stories",
    name: "Market Stories",
    lessons: "Lessons 11–14",
    blurb: "Match stories to diagrams and equations, find the start, and solve two-step stories.",
    gen: genStories,
  },
  {
    id: "boss",
    name: "Pumpkin Wagon",
    lessons: "All lessons",
    blurb: "Load the wagon! Every right answer puts one of 10 pumpkins on it.",
    gen: genBoss,
  },
];

/* where the 10 pumpkins sit on the wagon: 4 on the bottom row, then 3, 2, and 1 */
const WAGON_SPOTS = [
  [14, 38],
  [26, 38],
  [38, 38],
  [50, 38],
  [20, 29],
  [32, 29],
  [44, 29],
  [26, 20],
  [38, 20],
  [32, 11],
];
/* a pumpkin at x, y (dashed outline when it isn't loaded yet) */
const pumpkin = (x, y, on) =>
  on
    ? `<g><ellipse cx="${x}" cy="${y}" rx="6" ry="5" fill="#ff9a3c" stroke="#0a2340" stroke-width="1"/><path d="M${x},${y - 5}V${y + 5}M${x - 3},${y - 4.5}Q${x - 4},${y} ${x - 3},${y + 4.5}M${x + 3},${y - 4.5}Q${x + 4},${y} ${x + 3},${y + 4.5}" stroke="#c4621c" stroke-width=".8" fill="none"/><path d="M${x},${y - 5}l1,-3" stroke="#3fbf88" stroke-width="1.6"/></g>`
    : `<ellipse cx="${x}" cy="${y}" rx="6" ry="5" fill="none" stroke="rgba(170,205,255,.35)" stroke-width="1" stroke-dasharray="2 2"/>`;
/* a wagon with 10 pumpkins, the first `loaded` of them on it (also the boss icon, with 6 loaded) */
const wagon = (loaded) =>
  WAGON_SPOTS.map(([x, y], i) => pumpkin(x, y, i < loaded)).join("") +
  '<path d="M6,43H58V52H6Z" fill="#d9a066" stroke="#0a2340" stroke-width="1.5"/><path d="M58,46L63,40" stroke="#a9c4e4" stroke-width="2" stroke-linecap="round"/>' +
  '<circle cx="16" cy="56" r="5" fill="#0a2340" stroke="#a9c4e4" stroke-width="2"/><circle cx="48" cy="56" r="5" fill="#0a2340" stroke="#a9c4e4" stroke-width="2"/>';
const ICON = {
  compare:
    '<path d="M32,16C22,8 8,14 10,30C12,46 24,56 32,52C40,56 52,46 54,30C56,14 42,8 32,16Z" fill="#ff7b7b" stroke="#0a2340" stroke-width="1.5"/><path d="M32,16Q32,8 36,4" stroke="#7a4a1c" stroke-width="2.5" fill="none"/><path d="M34,10Q44,4 48,10Q42,14 34,10Z" fill="#5fe0a8" stroke="#0a2340"/>',
  takeaway:
    '<path d="M8,30H56L50,56H14Z" fill="#d9a066" stroke="#0a2340" stroke-width="1.5"/><path d="M12,30Q32,4 52,30" fill="none" stroke="#d9a066" stroke-width="3"/>' +
    [
      [20, 26],
      [28, 24],
      [36, 24],
      [44, 26],
      [24, 19],
      [32, 18],
      [40, 19],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="#6fa8ff" stroke="#0a2340"/>`)
      .join(""),
  break:
    range(5)
      .map(
        (i) =>
          `<path d="M${14 + i * 5},20L${18 + i * 5},58" stroke="#ff9a3c" stroke-width="5" stroke-linecap="round"/><path d="M${14 + i * 5},20l-3,-12M${14 + i * 5},20l2,-12" stroke="#5fe0a8" stroke-width="2"/>`,
      )
      .join("") +
    '<path d="M10,30H40" stroke="#ffc93c" stroke-width="3"/><path d="M48,22L56,52" stroke="#ff9a3c" stroke-width="5" stroke-linecap="round"/><path d="M48,22l-2,-10M48,22l3,-10" stroke="#5fe0a8" stroke-width="2"/>',
  within:
    '<path d="M14,34H50L46,58H18Z" fill="#6fa8ff" stroke="#0a2340" stroke-width="1.5"/>' +
    [
      [20, 16, "#ff7b7b"],
      [32, 10, "#ffc93c"],
      [44, 16, "#ff6b8a"],
      [26, 24, "#c58bff"],
      [38, 24, "#ff7b7b"],
    ]
      .map(
        ([x, y, c]) =>
          `<path d="M${x},${y + 6}L32,34" stroke="#3fbf88" stroke-width="2"/><circle cx="${x}" cy="${y}" r="6" fill="${c}" stroke="#0a2340"/><circle cx="${x}" cy="${y}" r="2" fill="#ffc93c"/>`,
      )
      .join(""),
  stories:
    '<path d="M6,26H58L54,58H10Z" fill="#a9c4e4" stroke="#0a2340" stroke-width="1.5"/><path d="M4,26L12,8H52L60,26Z" fill="#ff7b7b" stroke="#0a2340" stroke-width="1.5"/><path d="M17,8L13,26M27,8L25,26M37,8L39,26M47,8L51,26" stroke="#f3f6fb" stroke-width="3"/><rect x="18" y="34" width="28" height="14" rx="2" fill="#ffc93c" stroke="#0a2340"/>',
  boss: wagon(6),
};
