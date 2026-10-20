/* Robot Factory (Grade 2 Unit 7): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   The place-value mat and the stages of adding on it come from this unit's figs.js; open number lines and number lines from
   shared/numlines.js; base-ten blocks and digits from shared/blocks.js; and mcOf and miscOf from shared/util.js. Each
   generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Every problem carries
   `facts`, the numbers it was made from, so checks.js can work the answer out again. Numbers stay within 1,000, and a problem
   that asks for a number needs at most one new or broken ten or hundred (199 + 346 is done by jumping 200 and back 1). */
/* named mistakes, leaving out any that land on the answer for these numbers (the mistake doesn't show up then) */
const named = (answer, list) =>
  miscOf(
    answer,
    list.filter(([value]) => value !== answer && value > 0),
  );
/* a three-digit number from lo to hi that passes the test fits(n) */
function num3(lo, hi, fits = () => true) {
  for (;;) {
    const n = R(lo, hi);
    if (fits(n)) return n;
  }
}
/* two numbers a and b (a three-digit, b from bLo to bHi with no 0 in its tens or ones) that pass the test fits(a, b) */
function dealPair(bLo, bHi, fits) {
  for (;;) {
    const a = R(101, 989),
      b = R(bLo, bHi);
    if (digits(b)[1] && digits(b)[2] && fits(digits(a), digits(b), a, b)) return [a, b];
  }
}
/* what a + b makes: a new ten (the ones make 10 or more) and a new hundred (the tens, with any new ten, make 10 or more) */
const makes = (a, b) => {
  const [, tensA, onesA] = digits(a),
    [, tensB, onesB] = digits(b),
    ten = onesA + onesB >= 10;
  return { ten, hundred: tensA + tensB + (ten ? 1 : 0) >= 10 };
};
/* what a − b breaks: a ten (not enough ones) and a hundred (not enough tens, after any broken ten) */
const breaks = (a, b) => {
  const [, tensA, onesA] = digits(a),
    [, tensB, onesB] = digits(b),
    ten = onesA < onesB;
  return { ten, hundred: tensA - (ten ? 1 : 0) < tensB };
};
/* a sum within 1,000 that makes a new ten (ten), a new hundred (hundred), both, or neither */
const addPair = (ten, hundred) =>
  dealPair(101, 899, (da, db, a, b) => a + b <= 999 && makes(a, b).ten === ten && makes(a, b).hundred === hundred);
/* a difference (more than 100) that breaks a ten (ten), a hundred (hundred), both, or neither */
const subPair = (ten, hundred) =>
  dealPair(101, 899, (da, db, a, b) => a - b >= 100 && breaks(a, b).ten === ten && breaks(a, b).hundred === hundred);
/* a − b on the mat: a's blocks after breaking what's needed (the broken blocks green), with b's crossed out when show */
function takeMat(a, b, show) {
  const [hundredsA, tensA, onesA] = digits(a),
    [hundredsB, tensB, onesB] = digits(b),
    broke = breaks(a, b),
    /* the blocks after the breaks, gold and green, with the last few of each place crossed out */
    tens = cellsOf([tensA - (broke.ten ? 1 : 0), "a"], [broke.hundred ? 10 : 0, "tr"]),
    ones = cellsOf([onesA, "a"], [broke.ten ? 10 : 0, "tr"]),
    hundreds = cellsOf([hundredsA - (broke.hundred ? 1 : 0), "a"]),
    out = (cells, n) => cells.map((cls, i) => (i >= cells.length - n ? cls + " gone" : cls));
  return show
    ? mat(
        [{ lab: "", h: out(hundreds, hundredsB), t: out(tens, tensB), o: out(ones, onesB) }],
        `${a} with ${b} taken away`,
      )
    : mat([bl(a, "a")], `${a} in base-ten blocks`);
}

/* ---------- Conveyor Count: count on and count back (Lessons 1–3) ---------- */
function genCount() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* jump on by hundreds, then tens, then ones, with no new ten or hundred */
    const [start, jump] = dealPair(
        111,
        499,
        ([hs, ts, os], [hj, tj, oj]) => hs + hj <= 9 && ts + tj <= 9 && os + oj <= 9 && tj && oj,
      ),
      [hundreds, tens, ones] = digits(jump),
      moves = [hundreds * 100, tens * 10, ones].filter((move) => move),
      land = start + jump;
    return {
      kind: "num",
      unit: "",
      answer: land,
      facts: { t: "jumpOn", start, moves },
      prompt: `Start at ${start}. Jump on ${moves.slice(0, -1).join(", then ")}, then ${moves[moves.length - 1]}. Where do you land?`,
      fig: (show) => jumps(start, moves, moves.length, !show),
      misc: named(land, [
        [land - tens * 10, `You skipped the jump of ${tens * 10}.`],
        [land - ones, `Don’t forget the last jump of ${ones}.`],
        [start - jump, "These jumps go on, so add. Each jump takes you to a bigger number."],
      ]),
      hint: `${start} + ${moves[0]} = ${start + moves[0]}. Keep jumping from there.`,
      explain: `${start} + ${moves.join(" + ")} = ${land}.`,
    };
  }
  if (variant === 1) {
    /* 10 or 100 more or less: only one digit changes */
    const hundred = Math.random() < 0.5,
      more = Math.random() < 0.5,
      step = hundred ? 100 : 10,
      at = hundred ? 0 : 1,
      n = num3(101, 989, (v) => (more ? digits(v)[at] <= 8 : digits(v)[at] >= (hundred ? 2 : 1)) && v % 10),
      answer = more ? n + step : n - step,
      other = hundred ? 10 : 100;
    return {
      kind: "num",
      unit: "",
      answer,
      facts: { t: "tenMore", n, change: more ? step : -step },
      prompt: `What is ${step} ${more ? "more" : "less"} than ${n}?`,
      fig: () => numBlocks(n),
      misc: named(answer, [
        [
          more ? n + other : n - other,
          `That’s ${other} ${more ? "more" : "less"}. ${step} ${more ? "more" : "less"} changes the ${hundred ? "hundreds" : "tens"} digit.`,
        ],
        [
          more ? n - step : n + step,
          `That’s ${step} ${more ? "less" : "more"}. ${more ? "More means go up" : "Less means go down"}.`,
        ],
        [
          more ? n + 1 : n - 1,
          `That’s 1 ${more ? "more" : "less"}. ${more ? "Add" : "Take away"} a whole ${hundred ? "hundred" : "ten"}.`,
        ],
      ]),
      hint: `${step} ${more ? "more" : "less"} changes only the ${hundred ? "hundreds" : "tens"} digit, by 1.`,
      explain: `${n} ${more ? "+" : "−"} ${step} = ${answer}. Only the ${hundred ? "hundreds" : "tens"} digit changes.`,
    };
  }
  /* count on across a hundred to find a close difference */
  const hundred = R(2, 9) * 100,
    small = hundred - R(1, 8),
    big = hundred + R(1, 8),
    toHundred = hundred - small,
    rest = big - hundred;
  return {
    kind: "num",
    unit: "",
    answer: big - small,
    facts: { t: "countOn", small, big },
    prompt: `What is <b>${big} − ${small}</b>? Count on from ${small}.`,
    fig: (show) =>
      numLine(hundred - 10, hundred + 10, {
        u: 26,
        ls: "",
        end: true,
        lab: (v) => v % 5 === 0,
        hops: show
          ? [
              { a: small, b: hundred, t: toHundred },
              { a: hundred, b: big, t: rest },
            ]
          : [],
        pts: [
          { v: small, t: small },
          { v: big, cls: "b", t: big },
        ],
        label: `A number line with dots at ${small} and ${big}`,
      }),
    misc: named(big - small, [
      [big + small, "You added. The difference is how far apart the numbers are."],
      [toHundred, `${small} to ${hundred} is ${toHundred}. Keep going to ${big}.`],
      [rest, `${hundred} to ${big} is ${rest}. Don’t forget ${small} to ${hundred}.`],
    ]),
    hint: `Count on from ${small} to ${hundred}, then on to ${big}.`,
    explain: `${small} to ${hundred} is ${toHundred}. ${hundred} to ${big} is ${rest}. ${toHundred} + ${rest} = ${big - small}.`,
  };
}

/* ---------- stories within 1,000 ---------- */
/* putting two amounts together: the story with a and b, and what the total counts */
const JOIN = [
  (a, b) => `A library has ${a} picture books and ${b} chapter books. How many books is that?`,
  (a, b) => `A food drive got ${a} cans on Monday and ${b} cans on Tuesday. How many cans is that?`,
  (a, b) => `A zoo had ${a} visitors in the morning and ${b} visitors in the afternoon. How many visitors is that?`,
  (a, b) => `The factory built ${a} robots on Monday and ${b} robots on Tuesday. How many robots is that?`,
  (a, b) => `A bakery made ${a} muffins and ${b} cookies. How many treats is that?`,
];
/* taking some away: the story with a and b */
const TAKE = [
  (a, b) => `A theater has ${a} seats. People sit in ${b} of them. How many seats are empty?`,
  (a, b) => `A school has ${a} students. ${b} students ride the bus. How many students don’t ride the bus?`,
  (a, b) => `A party store had ${a} balloons. It sold ${b} balloons. How many balloons are left?`,
  (a, b) => `The factory made ${a} bolts. It used ${b} bolts. How many bolts are left?`,
];
/* the unit word for a story's answer: the last plural noun in "How many ___" */
const unitOf = (story) => story.match(/How many (\w+)/)[1];

/* ---------- Parts by Place: add and subtract by place (Lesson 4) ---------- */
function genPlace() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* add by place, with no new ten or hundred */
    const [a, b] = addPair(false, false),
      story = pick(JOIN)(a, b),
      sum = a + b,
      [hundredsA, tensA, onesA] = digits(a),
      [hundredsB, tensB, onesB] = digits(b);
    return {
      kind: "num",
      unit: unitOf(story),
      answer: sum,
      facts: { t: "story", op: "+", a, b },
      prompt: story,
      fig: () => apart(a, b),
      misc: named(sum, [
        [a - b, "Both amounts go together, so add."],
        [hundredsA * 100 + hundredsB * 100 + tensA * 10 + onesA, `You left out the ${tensB} tens and ${onesB} ones.`],
      ]),
      hint: "Put hundreds with hundreds, tens with tens, and ones with ones.",
      explain: `${hundredsA * 100} + ${hundredsB * 100} = ${(hundredsA + hundredsB) * 100}. ${tensA * 10} + ${tensB * 10} = ${(tensA + tensB) * 10}. ${onesA} + ${onesB} = ${onesA + onesB}. ${a} + ${b} = ${sum}.`,
    };
  }
  if (variant === 1) {
    /* take away by place, with nothing to break */
    const [a, b] = subPair(false, false),
      story = pick(TAKE)(a, b),
      left = a - b,
      [hundredsA, tensA, onesA] = digits(a),
      [hundredsB, tensB, onesB] = digits(b);
    return {
      kind: "num",
      unit: unitOf(story),
      answer: left,
      facts: { t: "story", op: "−", a, b },
      prompt: story,
      fig: (show) => takeMat(a, b, show),
      misc: named(left, [
        [a + b, "Some are taken away, so subtract."],
        [left + onesB, `Take away the ${onesB} ones too.`],
      ]),
      hint: "Take away hundreds from hundreds, tens from tens, and ones from ones.",
      explain: `${hundredsA * 100} − ${hundredsB * 100} = ${(hundredsA - hundredsB) * 100}. ${tensA * 10} − ${tensB * 10} = ${(tensA - tensB) * 10}. ${onesA} − ${onesB} = ${onesA - onesB}. ${a} − ${b} = ${left}.`,
    };
  }
  /* which is a right way to find a − b? The wrong ones take 4 for 40, or add the ones */
  const [a, b] = subPair(false, false),
    [, tensB, onesB] = digits(b),
    hundredsPart = Math.floor(b / 100) * 100,
    afterHundreds = a - hundredsPart,
    afterTens = afterHundreds - tensB * 10;
  const [hundredsA, tensA, onesA] = digits(a);
  return {
    ...mcOf([
      [
        `${a} − ${hundredsPart} = ${afterHundreds}, ${afterHundreds} − ${tensB * 10} = ${afterTens}, ${afterTens} − ${onesB} = ${afterTens - onesB}`,
        null,
      ],
      [
        `${a} − ${hundredsPart} = ${afterHundreds}, ${afterHundreds} − ${tensB} = ${afterHundreds - tensB}, ${afterHundreds - tensB} − ${onesB} = ${afterHundreds - tensB - onesB}`,
        `The ${tensB} in ${b} is ${tensB} tens: take away ${tensB * 10}, not ${tensB}.`,
      ],
      [
        `${hundredsA * 100} − ${hundredsPart} = ${hundredsA * 100 - hundredsPart}, ${tensA * 10} − ${tensB * 10} = ${(tensA - tensB) * 10}, ${onesA} + ${onesB} = ${onesA + onesB}`,
        "That adds the ones. Take away in every place.",
      ],
    ]),
    stack: true,
    facts: { t: "rightWay", a, b },
    prompt: `Which one is a right way to find <b>${a} − ${b}</b>?`,
    fig: () => mat([bl(a, "a")], `${a} in base-ten blocks`),
    hint: `${b} is ${partsOf(b)}. Take away each part.`,
    explain: `Take away ${hundredsPart}, then ${tensB * 10}, then ${onesB}: ${a} − ${b} = ${a - b}.`,
  };
}

/* ---------- Gear Trades: make a new ten or hundred (Lessons 6–8) ---------- */
function genNewTen() {
  const variant = R(0, 2);
  if (variant === 0 || variant === 1) {
    /* add with a new ten (variant 0) or a new hundred (variant 1) */
    const ten = variant === 0,
      [a, b] = addPair(ten, !ten),
      story = pick(JOIN)(a, b),
      sum = a + b,
      stages = addStages(a, b),
      [hundredsA, tensA, onesA] = digits(a),
      [hundredsB, tensB, onesB] = digits(b);
    return {
      kind: "num",
      unit: unitOf(story),
      answer: sum,
      facts: { t: "story", op: "+", a, b },
      prompt: story,
      fig: (show) => stageFig(a, b, stages, stages[show ? stages.length - 1 : 0]),
      misc: named(sum, [
        ten
          ? [sum - 10, `${onesA} + ${onesB} = ${onesA + onesB} ones. That’s a new ten. Count it with the tens.`]
          : [
              sum - 100,
              `${tensA} + ${tensB} = ${tensA + tensB} tens. That’s a new hundred. Count it with the hundreds.`,
            ],
        ten
          ? [
              Number(`${hundredsA + hundredsB}${tensA + tensB}${onesA + onesB}`),
              `${onesA + onesB} ones is 1 ten and ${onesA + onesB - 10} ones. Put the new ten with the tens.`,
            ]
          : [
              Number(`${hundredsA + hundredsB}${tensA + tensB}${onesA + onesB}`),
              `${tensA + tensB} tens is 1 hundred and ${tensA + tensB - 10} tens. Put the new hundred with the hundreds.`,
            ],
        [Math.abs(a - b), "Both amounts go together, so add."],
      ]),
      hint: ten
        ? `Add the ones: ${onesA} + ${onesB}. Trade 10 ones for a new ten.`
        : `Add the tens: ${tensA} + ${tensB}. Trade 10 tens for a new hundred.`,
      explain: ten
        ? `${onesA} + ${onesB} = ${onesA + onesB} ones: a new ten and ${onesA + onesB - 10} ones. ${a} + ${b} = ${sum}.`
        : `${tensA} + ${tensB} = ${tensA + tensB} tens: a new hundred and ${tensA + tensB - 10} tens. ${a} + ${b} = ${sum}.`,
    };
  }
  /* trade up: blocks with 10 or more tens or ones; what number do they show? */
  const tooMany = Math.random() < 0.5 ? "t" : "o",
    hundreds = R(1, 7),
    tens = tooMany === "t" ? R(10, 15) : R(1, 8),
    ones = tooMany === "o" ? R(10, 15) : R(1, 9),
    n = hundreds * 100 + tens * 10 + ones;
  return {
    kind: "num",
    unit: "",
    answer: n,
    facts: { t: "tradeUp", hundreds, tens, ones },
    prompt: `What number do these blocks show? <span class="sub">${cnt(hundreds, 0)}, ${cnt(tens, 1)}, ${cnt(ones, 2)}</span>`,
    fig: () =>
      mat(
        [{ lab: "", h: cellsOf([hundreds, "a"]), t: cellsOf([tens, "a"]), o: cellsOf([ones, "a"]) }],
        `${cnt(hundreds, 0)}, ${cnt(tens, 1)}, and ${cnt(ones, 2)}`,
      ),
    misc: named(n, [
      [
        Number(`${hundreds}${tens}${ones}`),
        `${tooMany === "t" ? `${tens} tens` : `${ones} ones`} is more than 9. Trade 10 of them up first.`,
      ],
      [
        tooMany === "t" ? hundreds * 100 + (tens - 10) * 10 + ones : hundreds * 100 + tens * 10 + ones - 10,
        tooMany === "t" ? "You traded 10 tens but lost the new hundred." : "You traded 10 ones but lost the new ten.",
      ],
    ]),
    hint:
      tooMany === "t"
        ? `Trade 10 tens for a hundred: ${cnt(hundreds + 1, 0)} and ${cnt(tens - 10, 1)}.`
        : `Trade 10 ones for a ten: ${cnt(tens + 1, 1)} and ${cnt(ones - 10, 2)}.`,
    explain: `${hundreds * 100} + ${tens * 10} + ${ones} = ${n}.`,
  };
}

/* ---------- Bolt Builders: add three-digit numbers (Lessons 9–10) ---------- */
/* what an addition or subtraction needs, in words */
const NEEDS = {
  both: "a new ten and a new hundred",
  ten: "only a new ten",
  hundred: "only a new hundred",
  none: "nothing new",
};
const needOf = (m) => (m.ten && m.hundred ? "both" : m.ten ? "ten" : m.hundred ? "hundred" : "none");
function genAdd() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* which one makes a new ten and a new hundred? */
    const sums = [addPair(true, true), addPair(true, false), addPair(false, true)];
    return {
      ...mcOf(
        sums.map(([a, b], i) => [
          `${a} + ${b}`,
          i === 0
            ? null
            : i === 1
              ? `The ones make a new ten, but the tens don’t make a hundred.`
              : `The tens make a new hundred, but the ones don’t make a ten.`,
        ]),
      ),
      facts: { t: "makesBoth" },
      prompt: "Which one makes a new ten <b>and</b> a new hundred?",
      fig: () => numBlocks(sums[0][0]),
      hint: "Add the ones: 10 or more? Then add the tens, with any new ten: 10 or more?",
      explain: `${sums[0][0]} + ${sums[0][1]}: the ones make a new ten, and then the tens make a new hundred.`,
    };
  }
  if (variant === 1) {
    /* add your way: a number close to a hundred (like 199) is easy to jump to; jump the hundred, then back */
    const near = R(1, 6) * 100 - pick([1, 2]),
      /* b + the round hundred stays within 1,000 too, since the hint jumps there first */
      b = num3(101, 899 - near, (v) => v % 10 >= 3 && v + near <= 997),
      round = near + (100 - (near % 100)),
      back = round - near,
      sum = near + b;
    return {
      kind: "num",
      unit: "",
      answer: sum,
      facts: { t: "addWay", near, b },
      prompt: `What is <b>${near} + ${b}</b>? <span class="sub">${near} is ${back} away from ${round}.</span>`,
      fig: (show) => (show ? jumps(b, [round, -back]) : apart(near, b)),
      misc: named(sum, [
        [b + round, `That adds ${round}. ${near} is ${back} less, so jump back ${back}.`],
        [b + round + back, `${near} is ${back} less than ${round}, so take ${back} away, don’t add it.`],
        [sum - 100, "Count the new hundred."],
      ]),
      hint: `${b} + ${round} = ${b + round}. Then take away ${back}.`,
      explain: `${b} + ${round} = ${b + round}, and ${b + round} − ${back} = ${sum}. So ${near} + ${b} = ${sum}.`,
    };
  }
  /* what do you need to make to add a + b? */
  const need = pick(["both", "ten", "hundred", "none"]),
    [a, b] = addPair(need === "both" || need === "ten", need === "both" || need === "hundred");
  return {
    ...mcOf(
      Object.keys(NEEDS).map((k) => [
        NEEDS[k],
        k === need
          ? null
          : `Add the ones (${digits(a)[2]} + ${digits(b)[2]}), then the tens with any new ten. Do they make 10?`,
      ]),
    ),
    stack: true,
    facts: { t: "whatNeeds", a, b, op: "+" },
    prompt: `What do you need to make to add <b>${a} + ${b}</b>?`,
    fig: () => apart(a, b),
    hint: "10 ones make a new ten. 10 tens make a new hundred.",
    explain: `Ones: ${digits(a)[2]} + ${digits(b)[2]} = ${digits(a)[2] + digits(b)[2]}. Tens: ${digits(a)[1]} + ${digits(b)[1]}${makes(a, b).ten ? " + 1" : ""} = ${digits(a)[1] + digits(b)[1] + (makes(a, b).ten ? 1 : 0)}. So ${a} + ${b} needs ${NEEDS[need]}. ${a} + ${b} = ${a + b}.`,
  };
}

/* ---------- Scrap Yard: subtract three-digit numbers (Lessons 12–16) ---------- */
const BREAKS = {
  both: "a ten and a hundred",
  ten: "only a ten",
  hundred: "only a hundred",
  none: "nothing",
};
function genSubtract() {
  const variant = R(0, 3);
  if (variant === 0 || variant === 1) {
    /* take away, breaking a ten (variant 0) or a hundred (variant 1) */
    const ten = variant === 0,
      [a, b] = subPair(ten, !ten),
      story = pick(TAKE)(a, b),
      left = a - b,
      [hundredsA, tensA, onesA] = digits(a),
      [hundredsB, tensB, onesB] = digits(b);
    return {
      kind: "num",
      unit: unitOf(story),
      answer: left,
      facts: { t: "story", op: "−", a, b },
      prompt: story,
      fig: (show) => takeMat(a, b, show),
      misc: named(left, [
        ten
          ? [
              (hundredsA - hundredsB) * 100 + (tensA - tensB) * 10 + (onesB - onesA),
              `${a} has only ${onesA} ones, so you can’t flip them to do ${onesB} − ${onesA}. Break a ten.`,
            ]
          : [
              (hundredsA - hundredsB) * 100 + (tensB - tensA) * 10 + (onesA - onesB),
              `${a} has only ${tensA} tens, so you can’t flip them to do ${tensB} − ${tensA}. Break a hundred.`,
            ],
        ten
          ? [left + 10, "You broke a ten, so there’s one ten fewer."]
          : [left + 100, "You broke a hundred, so there’s one hundred fewer."],
        [a + b, "Some are taken away, so there are fewer now. Subtract."],
      ]),
      hint: ten
        ? `${a} has only ${onesA} ones. Break a ten into 10 ones: ${tensA - 1} tens and ${onesA + 10} ones.`
        : `${a} has only ${tensA} tens. Break a hundred into 10 tens: ${hundredsA - 1} hundreds and ${tensA + 10} tens.`,
      explain: ten
        ? `Break a ten: ${onesA + 10} − ${onesB} = ${onesA + 10 - onesB} ones, ${tensA - 1} − ${tensB} = ${tensA - 1 - tensB} tens, ${hundredsA} − ${hundredsB} = ${hundredsA - hundredsB} hundreds. ${a} − ${b} = ${left}.`
        : `Break a hundred: ${onesA} − ${onesB} = ${onesA - onesB} ones, ${tensA + 10} − ${tensB} = ${tensA + 10 - tensB} tens, ${hundredsA - 1} − ${hundredsB} = ${hundredsA - 1 - hundredsB} hundreds. ${a} − ${b} = ${left}.`,
    };
  }
  if (variant === 2) {
    /* which one needs a hundred broken (or a ten)? One that does, and two that don't */
    const hundred = Math.random() < 0.5,
      list = hundred
        ? [subPair(false, true), subPair(true, false), subPair(false, false)]
        : [subPair(true, false), subPair(false, true), subPair(false, false)];
    return {
      ...mcOf(
        list.map(([a, b], i) => [
          `${a} − ${b}`,
          i === 0
            ? null
            : i === 1
              ? hundred
                ? `${a} has only ${digits(a)[2]} ones, so that breaks a ten, not a hundred.`
                : `${a} has only ${digits(a)[1]} tens, so that breaks a hundred, not a ten.`
              : `${a} has enough ${hundred ? "tens" : "ones"} to take away ${hundred ? digits(b)[1] : digits(b)[2]}. Nothing to break.`,
        ]),
      ),
      facts: { t: "whichBreaks", hundred },
      prompt: `Which one needs you to <b>break a ${hundred ? "hundred" : "ten"}</b>?`,
      fig: () => numBlocks(list[0][0]),
      hint: hundred
        ? "Look at the tens. Are there enough tens to take away?"
        : "Look at the ones. Are there enough ones to take away?",
      explain: `${list[0][0]} has only ${digits(list[0][0])[hundred ? 1 : 2]} ${hundred ? "tens" : "ones"}, but ${list[0][1]} has ${digits(list[0][1])[hundred ? 1 : 2]}. Break a ${hundred ? "hundred" : "ten"}.`,
    };
  }
  /* what do you need to break to find a − b? */
  const need = pick(["both", "ten", "hundred", "none"]),
    [a, b] = subPair(need === "both" || need === "ten", need === "both" || need === "hundred"),
    broke = breaks(a, b);
  return {
    ...mcOf(
      Object.keys(BREAKS).map((k) => [
        BREAKS[k],
        k === need
          ? null
          : `Look at the ones (${digits(a)[2]} and ${digits(b)[2]}), then the tens, after any broken ten.`,
      ]),
    ),
    stack: true,
    facts: { t: "whatNeeds", a, b, op: "−" },
    prompt: `What do you need to break to find <b>${a} − ${b}</b>?`,
    fig: () => mat([bl(a, "a")], `${a} in base-ten blocks`),
    hint: "Not enough ones? Break a ten. Then, not enough tens? Break a hundred.",
    explain: `Ones: ${digits(a)[2]} ${broke.ten ? "<" : "≥"} ${digits(b)[2]}${broke.ten ? ", so break a ten" : ""}. Tens: ${digits(a)[1] - (broke.ten ? 1 : 0)} ${broke.hundred ? "<" : "≥"} ${digits(b)[1]}${broke.hundred ? ", so break a hundred" : ""}. ${a} − ${b} = ${a - b}.`,
  };
}

/* ---------- Robot Rollout: everything ---------- */
const genBoss = () => pick([genCount, genPlace, genNewTen, genAdd, genSubtract])();

const ZONES = [
  {
    id: "count",
    name: "Conveyor Count",
    lessons: "Lessons 1–3",
    blurb: "Jump by hundreds, tens, and ones, find 10 or 100 more or less, and count on to subtract.",
    gen: genCount,
  },
  {
    id: "place",
    name: "Parts by Place",
    lessons: "Lesson 4",
    blurb: "Add and take away hundreds, tens, and ones, and spot a right way to subtract.",
    gen: genPlace,
  },
  {
    id: "newten",
    name: "Gear Trades",
    lessons: "Lessons 6–8",
    blurb: "Trade 10 ones for a ten and 10 tens for a hundred when you add.",
    gen: genNewTen,
  },
  {
    id: "add",
    name: "Bolt Builders",
    lessons: "Lessons 9–10",
    blurb: "Know when you make a new ten and a new hundred, and add your way.",
    gen: genAdd,
  },
  {
    id: "subtract",
    name: "Scrap Yard",
    lessons: "Lessons 12–16",
    blurb: "Break a ten or a hundred to take away, and think before you subtract.",
    gen: genSubtract,
  },
  {
    id: "boss",
    name: "Robot Rollout",
    lessons: "All lessons",
    blurb: "Power up the robot! Every right answer lights one of the 10 lights on its chest.",
    gen: genBoss,
  },
];

/* a robot with 10 lights on its chest in two rows of 5, the first `lit` of them on (also the boss icon, with 6 lit) */
const robot = (lit) =>
  '<path d="M32,2V9" stroke="#a9c4e4" stroke-width="2"/><circle cx="32" cy="3" r="2.5" fill="#ff7b7b"/>' +
  '<rect x="18" y="9" width="28" height="16" rx="4" fill="#a9c4e4" stroke="#0a2340" stroke-width="1.5"/><circle cx="26" cy="17" r="3" fill="#7fe3ff" stroke="#0a2340"/><circle cx="38" cy="17" r="3" fill="#7fe3ff" stroke="#0a2340"/>' +
  '<rect x="12" y="27" width="40" height="26" rx="4" fill="#cfd8e3" stroke="#0a2340" stroke-width="1.5"/><path d="M12,32H5V46M52,32H59V46" fill="none" stroke="#a9c4e4" stroke-width="3" stroke-linecap="round"/>' +
  '<path d="M22,53V62M42,53V62" stroke="#a9c4e4" stroke-width="4" stroke-linecap="round"/>' +
  range(10)
    .map(
      (i) =>
        `<circle cx="${18 + (i % 5) * 7}" cy="${34 + Math.floor(i / 5) * 9}" r="2.6" fill="${i < lit ? "#ffc93c" : "rgba(10,35,64,.5)"}"/>`,
    )
    .join("");
const ICON = {
  count:
    '<rect x="4" y="38" width="56" height="10" rx="5" fill="#a9c4e4" stroke="#0a2340" stroke-width="1.5"/><circle cx="12" cy="43" r="3" fill="#0a2340"/><circle cx="32" cy="43" r="3" fill="#0a2340"/><circle cx="52" cy="43" r="3" fill="#0a2340"/><rect x="10" y="22" width="14" height="14" fill="#ffc93c" stroke="#0a2340"/><rect x="30" y="20" width="5" height="16" fill="#7fe3ff" stroke="#0a2340"/><rect x="42" y="30" width="6" height="6" fill="#5fe0a8" stroke="#0a2340"/>',
  place:
    '<path d="M22,8V56M42,8V56" stroke="#a9c4e4" stroke-width="1.5" stroke-dasharray="3 3"/><rect x="4" y="20" width="14" height="14" fill="#ffc93c" stroke="#0a2340"/><rect x="26" y="14" width="4" height="22" fill="#7fe3ff" stroke="#0a2340"/><rect x="33" y="14" width="4" height="22" fill="#7fe3ff" stroke="#0a2340"/><rect x="47" y="30" width="5" height="5" fill="#5fe0a8" stroke="#0a2340"/><rect x="54" y="30" width="5" height="5" fill="#5fe0a8" stroke="#0a2340"/>',
  newten:
    '<circle cx="24" cy="30" r="14" fill="#cfd8e3" stroke="#0a2340" stroke-width="1.5"/><circle cx="24" cy="30" r="5" fill="#0a2340"/>' +
    range(8)
      .map(
        (i) =>
          `<rect x="21" y="12" width="6" height="6" fill="#cfd8e3" stroke="#0a2340" transform="rotate(${i * 45} 24 30)"/>`,
      )
      .join("") +
    '<circle cx="46" cy="44" r="10" fill="#ffc93c" stroke="#0a2340" stroke-width="1.5"/><circle cx="46" cy="44" r="3.5" fill="#0a2340"/>',
  add: '<path d="M14,10H50V18H36V54H28V18H14Z" fill="#a9c4e4" stroke="#0a2340" stroke-width="1.5"/><path d="M28,26H36M28,34H36M28,42H36" stroke="#0a2340"/><path d="M44,40h14M51,33v14" stroke="#ffc93c" stroke-width="4" stroke-linecap="round"/>',
  subtract:
    '<path d="M6,56L16,40L24,48L34,30L44,44L58,56Z" fill="#a9c4e4" stroke="#0a2340" stroke-width="1.5"/><rect x="30" y="10" width="14" height="14" fill="#ffc93c" stroke="#0a2340" transform="rotate(15 37 17)"/><path d="M10,22h14" stroke="#ff7b7b" stroke-width="4" stroke-linecap="round"/>',
  boss: robot(6),
};
