/* Treasure Cove (Grade 3 Unit 3): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Base-ten blocks (htoFig), digits, and the standard algorithm (algSteps, algFig) come from shared/blocks.js; number lines,
   open number lines (jumps), rounding lines (roundLine), and tape diagrams (partWhole, tapes) from shared/numlines.js;
   placeValues, expanded, regrouped, expandedFig, nearestWord, and roundWhy from figs.js; roundTo, mcOf, and miscOf from
   shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Every problem also
   carries facts for checks.js: its kind (t) and the numbers it was made from, so the answer can be worked out again. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* n and the word for it: "1 hundred", "3 hundreds" (plural: the word for more than one) */
const pl = (n, word, plural = word + "s") => `${n} ${n === 1 ? word : plural}`;
/* two different names */
const twoNames = () => shuffle(KIDS).slice(0, 2);
/* the number made of these digits, hundreds first: [4, 1, 5] → 415 */
const fromDigits = (list) => list.reduce((n, digit) => n * 10 + digit, 0);
/* a + b by place, keeping only the ones digit of each place's sum (358 + 167 → 415): a new ten or hundred forgotten */
const forgotRegroup = (a, b) => fromDigits(digits(a).map((digit, i) => (digit + digits(b)[i]) % 10));
/* a − b taking the smaller digit from the bigger one in each place (452 − 268 → 216): never regrouping */
const smallFromBig = (a, b) => fromDigits(digits(a).map((digit, i) => Math.abs(digit - digits(b)[i])));
/* does a − b need a regroup in some place (a digit of a smaller than b's)? */
const needsRegroup = (a, b) => digits(a).some((digit, i) => digit < digits(b)[i]);
/* a 3-digit number whose tens or ones is 0 about one time in three, so zeros come up often */
const withZeros = (lo, hi) => {
  const n = R(lo, hi);
  return R(0, 2) ? n : R(0, 1) ? n - (n % 10) : n - (Math.floor(n / 10) % 10) * 10;
};
/* the + and − written out in words, for screen readers and the worked answers */
const OP_WORD = { "+": "add", "−": "subtract" };

/* ---------- Counting House: numbers in different ways (Lesson 1) ---------- */
function genPlace() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* the number in base-ten blocks; a place is often empty, so a 0 has to be written */
    const hundreds = R(1, 9),
      tens = pick([0, R(1, 9), R(1, 9)]),
      ones = pick([0, R(1, 9), R(1, 9)]),
      n = hundreds * 100 + tens * 10 + ones;
    return {
      kind: "num",
      unit: "",
      answer: n,
      facts: { t: "blocks", hundreds, tens, ones },
      prompt:
        "Each big square is a hundred, each stick is a ten, and each small square is a one. What number do the blocks show?",
      fig: () => htoFig(hundreds, tens, ones, { cls: { t: "b", o: "c" } }),
      misc: miscOf(n, [
        ...(tens === 0
          ? [[hundreds * 10 + ones, `There are no tens, so write 0 in the tens place: ${hundreds}0${ones}.`]]
          : []),
        ...(ones === 0 && tens > 0
          ? [[hundreds * 10 + tens, `There are no ones, so write 0 in the ones place: ${hundreds}${tens}0.`]]
          : []),
        ...(tens > 0
          ? [
              [
                hundreds * 100 + tens + ones,
                `Each stick is a ten, so ${pl(tens, "stick")} ${tens === 1 ? "is" : "are"} ${tens * 10}.`,
              ],
            ]
          : []),
      ]),
      hint: "Count the hundreds, then the tens, then the ones. Write a 0 for a place with none.",
      explain:
        `${pl(hundreds, "hundred")}, ${pl(tens, "ten")}, and ${pl(ones, "one")} make ${n}` +
        (expanded(n).includes("+") ? `: ${expanded(n)} = ${n}.` : "."),
    };
  }
  if (variant === 1) {
    /* a number in expanded form, its parts sometimes out of order: what number is it? At least two places aren't 0 */
    let n;
    do n = withZeros(101, 999);
    while (placeValues(n).filter((value) => value).length < 2);
    const parts = placeValues(n).filter((value) => value),
      shown = R(0, 1) ? parts : shuffle(parts),
      /* the mistake of writing each part's first digit in the order they're shown: 7 + 400 + 30 → 743 */
      inOrder = +shown.map((value) => String(value)[0]).join(""),
      [hundreds, tens, ones] = digits(n);
    return {
      kind: "num",
      unit: "",
      answer: n,
      facts: { t: "expanded", parts: shown },
      prompt: `What number is ${shown.join(" + ")}?`,
      fig: (show) =>
        htoFig(show ? hundreds : 0, show ? tens : 0, show ? ones : 0, {
          cls: { t: "b", o: "c" },
        }),
      misc: miscOf(n, [
        ...(tens === 0 ? [[hundreds * 10 + ones, "There are no tens. Write 0 in the tens place."]] : []),
        ...(ones === 0 ? [[hundreds * 10 + tens, "There are no ones. Write 0 in the ones place."]] : []),
        ...(inOrder !== n && String(inOrder).length === 3
          ? [[inOrder, "Put each part in its place: the hundreds first, then the tens, then the ones."]]
          : []),
      ]),
      hint: "Find the hundreds, the tens, and the ones. Write a 0 for a place with none.",
      explain: `${parts.join(" + ")} is ${pl(hundreds, "hundred")}, ${pl(tens, "ten")}, and ${pl(ones, "one")}: ${n}.`,
    };
  }
  if (variant === 2) {
    /* another way to make n: trade 1 hundred for 10 tens, or 1 ten for 10 ones. The wrong ways trade without taking the
       1 away, or take it away without adding the 10 */
    const hundreds = R(2, 9),
      tens = R(0, 8),
      ones = R(0, 9),
      n = hundreds * 100 + tens * 10 + ones,
      tradeHundred = tens === 0 || R(0, 1),
      say = (h, t, o) => `${pl(h, "hundred")}, ${pl(t, "ten")}, ${pl(o, "one")}`;
    const [right, kept, lost] = tradeHundred
      ? [say(hundreds - 1, tens + 10, ones), say(hundreds, tens + 10, ones), say(hundreds - 1, tens, ones)]
      : [say(hundreds, tens - 1, ones + 10), say(hundreds, tens, ones + 10), say(hundreds, tens - 1, ones)];
    const big = tradeHundred ? "hundred" : "ten",
      small = tradeHundred ? "tens" : "ones",
      worth = tradeHundred ? 100 : 10;
    return {
      ...mcOf([
        [right, null],
        [kept, `That’s 10 more ${small} but the same ${big}s. It’s ${n + worth}.`],
        [lost, `That’s 1 ${big} fewer, but where are its 10 ${small}? It’s ${n - worth}.`],
      ]),
      stack: true,
      facts: { t: "trade", n },
      prompt: `Which is another way to make ${n}?`,
      fig: () => htoFig(hundreds, tens, ones, { cls: { t: "b", o: "c" } }),
      hint: `1 ${big} is the same as 10 ${small}. Take 1 ${big} away and add 10 ${small}.`,
      explain: `${n} is ${say(hundreds, tens, ones)}. Trade 1 ${big} for 10 ${small}: ${right}.`,
    };
  }
  /* tap where a number goes on a number line from one hundred to the next, a tick every 10 */
  const lo = R(1, 8) * 100,
    target = lo + 10 * pick([1, 2, 3, 4, 6, 7, 8, 9]),
    why = {};
  range(11).forEach((i) => {
    const value = lo + i * 10;
    if (value !== target) why[value] = `That tick is ${value}. Count by tens from ${lo}.`;
  });
  return {
    kind: "tap",
    answer: String(target),
    why,
    facts: { t: "tapline", lo, target },
    prompt: `Tap where ${target} goes on the number line.`,
    fig: (show) =>
      numLine(lo, lo + 100, {
        step: 10,
        big: 50,
        lab: (v) => show || v === lo || v === lo + 100,
        tap: "cand",
        label: `Number line from ${lo} to ${lo + 100}, a tick every 10`,
      }),
    hint: `The ticks count by tens: ${lo}, ${lo + 10}, ${lo + 20}, and on to ${lo + 100}.`,
    explain: `Count by tens from ${lo}: ${range((target - lo) / 10 + 1)
      .map((i) => lo + i * 10)
      .join(", ")}. ${target} is ${(target - lo) / 10} ticks past ${lo}.`,
  };
}

/* ---------- one-step stories (Cargo Dock and the Supply Shop) ---------- */
/* Each story makes sense for numbers in its range (checks.js has the same ranges): a is [lowest, highest] for the first
   number, and b for the second. say(a, b, names) writes it, ending with the question. */
const ADD_STORIES = [
  {
    id: "ferry",
    unit: "people",
    a: [100, 500],
    b: [100, 450],
    say: (a, b) =>
      `The ferry carried ${a} people in the morning and ${b} people in the afternoon. How many people did it carry in all?`,
  },
  {
    id: "shells",
    unit: "shells",
    a: [100, 600],
    b: [20, 300],
    say: (a, b, [name]) =>
      `${name} has ${a} shells and finds ${b} more on the beach. How many shells does ${name} have now?`,
  },
  {
    id: "postcards",
    unit: "postcards",
    a: [100, 500],
    b: [100, 400],
    say: (a, b) =>
      `The harbor shop sold ${a} postcards in June and ${b} in July. How many postcards did it sell in the two months?`,
  },
  {
    id: "miles",
    unit: "miles",
    a: [100, 400],
    b: [100, 400],
    say: (a, b) =>
      `A ship sailed ${a} miles on Monday and ${b} miles on Tuesday. How many miles did it sail in the two days?`,
  },
  {
    id: "coins",
    unit: "coins",
    a: [100, 700],
    b: [50, 250],
    say: (a, b) =>
      `A treasure chest holds ${a} gold coins. The captain puts in ${b} more. How many coins are in the chest now?`,
  },
];
const SUB_STORIES = [
  {
    id: "sold",
    unit: "postcards",
    a: [200, 900],
    b: [100, 800],
    say: (a, b) => `The harbor shop had ${a} postcards. It sold ${b} of them. How many postcards are left?`,
  },
  {
    id: "room",
    unit: "people",
    a: [300, 900],
    b: [100, 800],
    say: (a, b) => `The ferry can carry ${a} people. ${b} people are on board. How many more people can get on?`,
  },
  {
    id: "trail",
    unit: "meters",
    a: [300, 900],
    b: [100, 800],
    say: (a, b, [name]) =>
      `The trail around the cove is ${a} meters long. ${name} has walked ${b} meters. How many meters are left to walk?`,
  },
  {
    id: "compare",
    unit: "shells",
    a: [200, 900],
    b: [100, 800],
    say: (a, b, [name, other]) =>
      `${name} collected ${a} shells. ${other} collected ${b} shells. How many more shells did ${name} collect than ${other}?`,
  },
  {
    id: "got-on",
    unit: "people",
    a: [200, 900],
    b: [100, 800],
    say: (a, b) =>
      `The ferry had ${b} people on board. At the dock, more people got on. Now there are ${a} people on board. How many people got on?`,
  },
  {
    id: "spent",
    unit: "coins",
    a: [200, 900],
    b: [100, 800],
    say: (a, b) => `The captain had ${a} gold coins and spent ${b} of them on a new sail. How many coins are left?`,
  },
];
/* a and b for a story, each in its range: for + the sum stays within 999; for − b is smaller, leaving at least 20 */
function storyNumbers(story, op) {
  let a, b;
  do {
    a = withZeros(...story.a);
    b = R(...story.b);
  } while (op === "+" ? a + b > 999 : a - b < 20);
  return [a, b];
}

/* ---------- Cargo Dock: add within 1,000 (Lessons 2–6) ---------- */
function genAdd() {
  const variant = R(0, 3),
    names = twoNames();
  if (variant === 0) {
    /* a story to add; the picture lines up the places, and the hint works the standard algorithm */
    const story = pick(ADD_STORIES),
      [a, b] = storyNumbers(story, "+"),
      sum = a + b;
    return {
      kind: "num",
      unit: story.unit,
      answer: sum,
      facts: { t: "story", id: story.id, op: "+", a, b },
      prompt: story.say(a, b, names),
      fig: (show) => algFig(a, b, "+", show ? algSteps(a, b, "+").length : 0),
      misc: miscOf(sum, [
        ...(a > b ? [[a - b, "You subtracted. Both amounts together means add."]] : []),
        ...(forgotRegroup(a, b) !== sum
          ? [
              [
                forgotRegroup(a, b),
                "When a place adds up to 10 or more, it makes a new ten or hundred. Write the 1 above the next place.",
              ],
            ]
          : []),
      ]),
      hint: "Add the ones, then the tens, then the hundreds. 10 ones make a new ten, and 10 tens make a new hundred.",
      explain: `${a} + ${b} = ${sum} ${story.unit}.`,
    };
  }
  if (variant === 1) {
    /* an open number line: the first jump (the hundreds) is drawn, and the student finishes the jumps */
    let a, b;
    do {
      a = withZeros(100, 800);
      b = withZeros(110, 599);
    } while (a + b > 999 || b % 100 === 0);
    const moves = placeValues(b).filter((value) => value),
      sum = a + b,
      [name] = names;
    return {
      kind: "num",
      unit: "",
      answer: sum,
      facts: { t: "jumps", a, b },
      prompt: `${name} finds ${a} + ${b} on a number line. ${name} jumps +${moves[0]} from ${a}. Finish the jumps. What is ${a} + ${b}?`,
      fig: (show) => (show ? jumps(a, moves, moves.length, true) : jumps(a, moves, 1)),
      misc: miscOf(sum, [
        [a + moves[0], `That’s where the first jump lands. Jump the rest of ${b}: ${moves.slice(1).join(" and ")}.`],
        ...(forgotRegroup(a, b) !== sum
          ? [[forgotRegroup(a, b), "A jump can pass a new ten or hundred. Count on carefully."]]
          : []),
      ]),
      hint: `Break ${b} into ${moves.join(" + ")}. Jump each part.`,
      explain:
        `${a} + ${moves[0]} = ${a + moves[0]}` + jumpWords(a + moves[0], moves.slice(1)) + `. So ${a} + ${b} = ${sum}.`,
    };
  }
  if (variant === 2) {
    /* add by place in expanded form: the hint adds each place */
    let a, b;
    do {
      a = withZeros(110, 799);
      b = withZeros(110, 599);
    } while (a + b > 999 || forgotRegroup(a, b) === a + b);
    const sum = a + b,
      parts = placeValues(a).map((value, i) => value + placeValues(b)[i]);
    return {
      kind: "num",
      unit: "",
      answer: sum,
      facts: { t: "expandedSum", a, b },
      prompt: `Add by place: hundreds, tens, then ones. What is ${a} + ${b}?`,
      fig: (show) => expandedFig(a, b, "+", { shown: show ? 3 : 0 }),
      misc: miscOf(sum, [
        [forgotRegroup(a, b), `A place can add up to more than 9. Keep all of each part: ${parts.join(" + ")}.`],
      ]),
      hint: `${placeValues(a)[0]} + ${placeValues(b)[0]}, then ${placeValues(a)[1]} + ${placeValues(b)[1]}, then ${placeValues(a)[2]} + ${placeValues(b)[2]}. Then add the three parts.`,
      explain: `${expanded(a)} plus ${expanded(b)}: ${parts.join(" + ")} = ${sum}.`,
    };
  }
  /* make a friendly number: move a little from one addend to the other, close to a hundred. The wrong ways only add to
     one of them, or add to both */
  const short = R(1, 3),
    a = R(2, 7) * 100 - short;
  let b;
  do b = R(110, 599);
  while (a + b > 999 || b % 100 === 0);
  const sum = a + b,
    friendly = a + short;
  return {
    ...mcOf([
      [`${friendly} + ${b - short}`, null],
      [
        `${friendly} + ${b}`,
        `You added ${short} to ${a} but didn’t take ${short} from ${b}, so that sum is ${short} too big.`,
      ],
      [`${friendly} + ${b + short}`, `Both numbers grew by ${short}, so that sum is ${2 * short} too big.`],
    ]),
    facts: { t: "friendly", a, b },
    prompt: `${a} is close to ${friendly}. Which has the same sum as ${a} + ${b}?`,
    fig: (show) => jumps(a, show ? [short, b - short] : [short], show ? 2 : 1),
    hint: `Move ${short} from ${b} to ${a}. ${a} + ${short} = ${friendly}, and ${b} − ${short} = ${b - short}.`,
    explain: `Give ${short} from ${b} to ${a}: ${friendly} + ${b - short} = ${sum}, the same as ${a} + ${b}.`,
  };
}
/* the rest of an open number line's jumps in words: ", then + 30 is 405, then + 7 is 412" */
function jumpWords(start, moves) {
  let at = start;
  return moves
    .map((move) => {
      const from = at;
      at += move;
      return `, then ${from} ${move > 0 ? "+" : "−"} ${Math.abs(move)} = ${at}`;
    })
    .join("");
}

/* ---------- Supply Shop: subtract within 1,000 (Lessons 7–12) ---------- */
function genSubtract() {
  const variant = R(0, 4),
    names = twoNames();
  if (variant === 0) {
    /* a story to subtract; the picture lines up the places, and the hint works the standard algorithm. Most need a regroup */
    const story = pick(SUB_STORIES);
    let a, b;
    do [a, b] = storyNumbers(story, "−");
    while (!needsRegroup(a, b) && R(0, 3));
    const difference = a - b;
    return {
      kind: "num",
      unit: story.unit,
      answer: difference,
      facts: { t: "story", id: story.id, op: "−", a, b },
      prompt: story.say(a, b, names),
      fig: (show) => algFig(a, b, "−", show ? algSteps(a, b, "−").length : 0),
      misc: miscOf(difference, [
        ...(a + b <= 1000 ? [[a + b, "You added. Find the difference: subtract."]] : []),
        ...(smallFromBig(a, b) !== difference
          ? [
              [
                smallFromBig(a, b),
                "In each place you took the smaller digit from the bigger one. When the top digit is smaller, regroup first.",
              ],
            ]
          : []),
      ]),
      hint: "Start with the ones. When the top digit is too small, regroup 1 from the next place to the left.",
      explain: `${a} − ${b} = ${difference}.`,
    };
  }
  if (variant === 1) {
    /* count up on an open number line from b to a: to the next hundred, then hundreds, then the rest */
    const target = R(2, 8) * 100,
      b = target - R(1, 15);
    let a;
    do a = b + R(105, 399);
    while (a > 999 || a % 100 === 0);
    const moves = [target - b, Math.floor(a / 100) * 100 - target, a % 100].filter((move) => move),
      difference = a - b,
      [name] = names;
    return {
      kind: "num",
      unit: "",
      answer: difference,
      facts: { t: "countUp", a, b, moves },
      prompt: `${name} counts up from ${b} to ${a} to find ${a} − ${b}. How far is it from ${b} to ${a}?`,
      fig: () => jumps(b, moves),
      misc: miscOf(difference, [
        [difference - moves[0], `Add every jump, the first one of ${moves[0]} too.`],
        ...(smallFromBig(a, b) !== difference
          ? [
              [
                smallFromBig(a, b),
                "That’s the smaller digit taken from the bigger one in each place. Add the jumps instead.",
              ],
            ]
          : []),
      ]),
      hint: `Add the jumps: ${moves.join(" + ")}.`,
      explain: `The jumps are ${moves.join(" + ")} = ${difference}. So ${a} − ${b} = ${difference}.`,
    };
  }
  if (variant === 2) {
    /* subtract from a number with no tens: the hundreds have to be regrouped to tens, then a ten to ones */
    const a = R(3, 9) * 100 + R(0, 6);
    let b;
    do b = R(1, Math.floor(a / 100) - 1) * 100 + R(1, 9) * 10 + R((a % 10) + 1, 9);
    while (a - b < 20);
    const difference = a - b;
    return {
      kind: "num",
      unit: "",
      answer: difference,
      facts: { t: "zeros", a, b },
      prompt: `What is ${a} − ${b}?`,
      fig: (show) => algFig(a, b, "−", show ? algSteps(a, b, "−").length : 0),
      misc: miscOf(difference, [
        [smallFromBig(a, b), "In each place you took the smaller digit from the bigger one. Regroup first."],
        [
          difference + 100,
          `To get tens, 1 hundred was regrouped. There’s 1 hundred fewer: ${Math.floor(a / 100) - 1} hundreds.`,
        ],
      ]),
      hint: `There are no tens in ${a}. Regroup 1 hundred as 10 tens, then 1 ten as 10 ones.`,
      explain: `${a} is ${Math.floor(a / 100) - 1} hundreds, 9 tens, and ${(a % 10) + 10} ones. ${a} − ${b} = ${difference}.`,
    };
  }
  if (variant === 3) {
    /* how to write a so each place can take away b's: the ones need a regroup, and the tens have enough after it */
    let a, b;
    do {
      a = R(210, 989);
      b = R(101, a - 20);
    } while (!(digits(a)[2] < digits(b)[2] && digits(a)[1] - 1 >= digits(b)[1] && digits(a)[1] > 0));
    const values = placeValues(a),
      right = regrouped(a, b).join(" + "),
      [, , bOnes] = placeValues(b);
    return {
      ...mcOf([
        [right, null],
        [values.join(" + "), `That’s ${a}, but ${values[2]} ones can’t give ${bOnes} ones. Regroup a ten first.`],
        [
          `${values[0] - 100} + ${values[1] + 100} + ${values[2]}`,
          `That’s ${a}, but the ones still can’t give ${bOnes}. Regroup a ten as 10 ones.`,
        ],
      ]),
      facts: { t: "rewrite", a, b },
      prompt: `To find ${a} − ${b} by place, how can you write ${a} so you can take away each place of ${b}?`,
      fig: (show) => expandedFig(a, b, "−", { rewrite: show }),
      hint: `Can ${values[2]} ones give ${bOnes}? If not, take 1 ten from the tens: it becomes 10 more ones.`,
      explain: `Take 1 ten from ${values[1]}: ${values[1]} becomes ${values[1] - 10}, and ${values[2]} becomes ${values[2] + 10}. So ${a} is ${right}, and ${a} − ${b} = ${a - b}.`,
    };
  }
  /* take away by place on an open number line: jump back the hundreds, tens, and ones */
  let a, b;
  do {
    a = R(300, 999);
    b = withZeros(110, a - 50);
  } while (b % 100 === 0);
  const moves = placeValues(b)
      .filter((value) => value)
      .map((value) => -value),
    difference = a - b,
    [name] = names;
  return {
    kind: "num",
    unit: "",
    answer: difference,
    facts: { t: "takeAway", a, b },
    prompt: `${name} finds ${a} − ${b} by jumping back on a number line. Where does ${name} land?`,
    fig: (show) => jumps(a, moves, show ? moves.length : 1, show),
    misc: miscOf(difference, [
      ...(a + b <= 1000 ? [[a + b, "The jumps go back. Take them away."]] : []),
      [a + moves[0], `That’s only the first jump. Jump back the rest of ${b} too.`],
    ]),
    hint: `Break ${b} into ${moves.map((move) => -move).join(" + ")}. Jump back each part.`,
    explain:
      `${a} − ${-moves[0]} = ${a + moves[0]}` +
      jumpWords(a + moves[0], moves.slice(1)) +
      `. So ${a} − ${b} = ${difference}.`,
  };
}

/* ---------- Lighthouse Point: round to the nearest ten and hundred (Lessons 13–15) ---------- */
function genRound() {
  const variant = R(0, 2),
    unit = pick([10, 100]);
  if (variant === 0) {
    /* round n on a number line; about one in five is exactly halfway */
    let n;
    do n = pick([0, 1, 2, 3]) ? R(101, 989) : Math.floor(R(101, 989) / unit) * unit + unit / 2;
    while (n % unit === 0 || roundTo(n, unit) >= 1000);
    const rounded = roundTo(n, unit),
      below = Math.floor(n / unit) * unit,
      /* the other multiple n is between */
      farther = rounded === below ? below + unit : below,
      other = unit === 10 ? 100 : 10;
    return {
      kind: "num",
      unit: "",
      answer: rounded,
      facts: { t: "round", n, unit },
      prompt: `Round ${n} to ${nearestWord(unit)}.`,
      fig: () => roundLine(n, unit),
      misc: miscOf(rounded, [
        [
          farther,
          n === below + unit / 2
            ? `${n} is exactly halfway between ${below} and ${below + unit}, and halfway rounds up.`
            : `${n} is closer to ${rounded} than to ${farther}.`,
        ],
        ...(roundTo(n, other) !== rounded && roundTo(n, other) !== farther
          ? [[roundTo(n, other), `That’s ${n} rounded to ${nearestWord(other)}. Round to ${nearestWord(unit)}.`]]
          : []),
      ]),
      hint: `${n} is between ${below} and ${below + unit}. Halfway is ${below + unit / 2}.`,
      explain: `${roundWhy(n, unit)} ${n} rounded to ${nearestWord(unit)} is ${rounded}.`,
    };
  }
  if (variant === 1) {
    /* which number rounds to a target: one that does, one just too small, one just too big */
    const target = unit === 10 ? R(11, 98) * 10 : R(2, 8) * 100,
      half = unit / 2,
      fits = target - half + R(0, unit - 1),
      tooSmall = target - half - R(1, unit === 10 ? 4 : 30),
      tooBig = target + half + R(0, unit === 10 ? 4 : 30);
    return {
      ...mcOf([
        [String(fits), null],
        [
          String(tooSmall),
          `${tooSmall} is closer to ${target - unit}. ${tooSmall} rounded to ${nearestWord(unit)} is ${target - unit}.`,
        ],
        [
          String(tooBig),
          `${tooBig} rounded to ${nearestWord(unit)} is ${target + unit}` +
            (tooBig === target + half ? ": halfway rounds up." : "."),
        ],
      ]),
      facts: { t: "roundsTo", target, unit },
      prompt: `Which number rounds to ${target} when you round to ${nearestWord(unit)}?`,
      fig: () =>
        numLine(target - unit, target + unit, {
          u: 380 / (2 * unit),
          step: unit / 10,
          big: unit / 2,
          lab: (v) => v % (unit / 2) === 0,
          pad: 24,
          label: `Number line from ${target - unit} to ${target + unit}, a tick every ${unit / 10}`,
        }),
      hint: `The numbers that round to ${target} go from ${target - half} up to ${target + half - 1}.`,
      explain: `${fits} rounded to ${nearestWord(unit)} is ${target}. Numbers from ${target - half} to ${target + half - 1} round to ${target}.`,
    };
  }
  /* the smallest or largest whole number that rounds to a target */
  const target = unit === 10 ? R(11, 98) * 10 : R(2, 8) * 100,
    half = unit / 2,
    smallest = R(0, 1),
    answer = smallest ? target - half : target + half - 1;
  return {
    kind: "num",
    unit: "",
    answer,
    facts: { t: "edge", target, unit, smallest: !!smallest },
    prompt: `What is the ${smallest ? "smallest" : "largest"} whole number that rounds to ${target} when you round to ${nearestWord(unit)}?`,
    fig: () =>
      numLine(target - unit, target + unit, {
        u: 380 / (2 * unit),
        step: unit / 10,
        big: unit / 2,
        lab: (v) => v % (unit / 2) === 0,
        pad: 24,
        pts: [{ v: target, t: target }],
        label: `Number line from ${target - unit} to ${target + unit}, a tick every ${unit / 10}, with ${target} marked`,
      }),
    misc: miscOf(
      answer,
      smallest
        ? [
            [target - half - 1, `${target - half - 1} is less than halfway, so it rounds down to ${target - unit}.`],
            [target - unit, `${target - unit} rounded to ${nearestWord(unit)} is ${target - unit}.`],
          ]
        : [
            [target + half, `${target + half} is exactly halfway, and halfway rounds up to ${target + unit}.`],
            [target + unit - 1, `${target + unit - 1} is closer to ${target + unit}.`],
          ],
    ),
    hint: smallest
      ? `Halfway between ${target - unit} and ${target} is ${target - half}. Halfway rounds up.`
      : `Halfway between ${target} and ${target + unit} is ${target + half}. Halfway rounds up, to ${target + unit}.`,
    explain: smallest
      ? `${target - half} is halfway between ${target - unit} and ${target}, and halfway rounds up: ${target - half} rounded to ${nearestWord(unit)} is ${target}. Anything smaller rounds down.`
      : `${target + half - 1} rounded to ${nearestWord(unit)} is ${target}. The next number, ${target + half}, is halfway and rounds up to ${target + unit}.`,
  };
}

/* ---------- Crow’s Nest: estimate, and check that answers make sense (Lessons 16–17) ---------- */
function genEstimate() {
  const variant = R(0, 2),
    [name] = twoNames();
  if (variant < 2) {
    /* estimate a sum (variant 0) or a difference (variant 1) by rounding each number first. Never a number exactly halfway,
       and never one where the estimate is the exact answer */
    const op = variant === 0 ? "+" : "−",
      unit = pick([10, 100]);
    let a, b;
    do {
      a = R(101, 899);
      b = op === "+" ? R(101, 899) : R(101, a - 60);
    } while (
      [a, b].some((n) => n % unit === 0 || n % unit === unit / 2) ||
      (op === "+" ? roundTo(a, unit) + roundTo(b, unit) >= 1000 || a + b > 999 : roundTo(a, unit) <= roundTo(b, unit))
    );
    const ra = roundTo(a, unit),
      rb = roundTo(b, unit),
      estimate = op === "+" ? ra + rb : ra - rb,
      exact = op === "+" ? a + b : a - b,
      /* rounding both down: the multiples below */
      down = Math.floor(a / unit) * unit,
      downB = Math.floor(b / unit) * unit,
      bothDown = op === "+" ? down + downB : down - downB;
    if (estimate === exact) return genEstimate();
    return {
      kind: "num",
      unit: "",
      answer: estimate,
      facts: { t: "estimate", a, b, op, unit },
      prompt: `Estimate ${a} ${op} ${b}: round each number to ${nearestWord(unit)}, then ${OP_WORD[op]}.`,
      fig: (show) => (show ? roundLine(a, unit) + roundLine(b, unit) : algFig(a, b, op, 0)),
      misc: miscOf(estimate, [
        [exact, `That’s the exact answer. Round first: ${ra} ${op} ${rb}.`],
        ...(bothDown !== estimate && bothDown > 0
          ? [
              [
                bothDown,
                `Round to the closer ${unit === 10 ? "ten" : "hundred"}, not always down: ${a} rounded to ${nearestWord(unit)} is ${ra}, and ${b} rounded to ${nearestWord(unit)} is ${rb}.`,
              ],
            ]
          : []),
      ]),
      hint: `${a} rounded to ${nearestWord(unit)} is ${ra}. ${b} rounded to ${nearestWord(unit)} is ${rb}.`,
      explain: `${a} rounded to ${nearestWord(unit)} is ${ra}, and ${b} rounded to ${nearestWord(unit)} is ${rb}. ${ra} ${op} ${rb} = ${estimate}, so ${a} ${op} ${b} is about ${estimate}.`,
    };
  }
  /* does a student's answer make sense? Round to the nearest hundred to check. The answer is right, or 200 off on the far
     side from the estimate, so a wrong one is always far from it and a right one always close (within 60) */
  const op = pick(["+", "−"]),
    right = R(0, 1);
  let a, b, exact, estimate, claim;
  do {
    a = R(201, 799);
    b = op === "+" ? R(101, 699) : R(101, a - 100);
    exact = op === "+" ? a + b : a - b;
    estimate = op === "+" ? roundTo(a, 100) + roundTo(b, 100) : roundTo(a, 100) - roundTo(b, 100);
    claim = right ? exact : exact + (exact >= estimate ? 200 : -200);
  } while (exact > 999 || Math.abs(exact - estimate) > 60 || claim <= 0 || claim > 999);
  const ra = roundTo(a, 100),
    rb = roundTo(b, 100);
  const sense = `${a} ${op} ${b} is about ${ra} ${op} ${rb} = ${estimate}.`;
  return {
    ...mcOf([
      ["Yes, it makes sense", right ? null : `${sense} ${claim} is far from ${estimate}.`],
      ["No, it doesn’t make sense", right ? `${sense} ${claim} is close to ${estimate}.` : null],
    ]),
    facts: { t: "sense", a, b, op, claim },
    prompt: `${name} says ${a} ${op} ${b} is ${claim}. Round each number to the nearest hundred to check. Does ${claim} make sense?`,
    fig: () => algFig(a, b, op, 0),
    hint: `${a} rounded to the nearest hundred is ${ra}. ${b} rounded to the nearest hundred is ${rb}. What is ${ra} ${op} ${rb}?`,
    explain: right
      ? `${sense} ${claim} is close to ${estimate}, so it makes sense. (It’s right: ${a} ${op} ${b} = ${exact}.)`
      : `${sense} ${claim} is far from ${estimate}, so it doesn’t make sense. The right answer is ${exact}.`,
  };
}

/* ---------- Voyage Planner: two-step problems (Lessons 18–20) ---------- */
/* A tape split into parts, each drawn at least a fifth of the whole so its number fits (not to scale). values: the parts'
   sizes; shows: what each says (a number or '?'); total: what the brace says. */
function tapeOf(values, shows, total, label) {
  const whole = values.reduce((sum, value) => sum + value, 0);
  return partWhole(
    values.map((value, i) => ({
      n: Math.max(value, whole / 5),
      show: shows[i],
    })),
    total,
    label,
  );
}
/* Two-step stories: each deals its numbers and returns the story and its question, its answer and unit, the two steps, an
   equation with a letter for the unknown (stands: what the letter stands for), wrong equations with what's wrong with each,
   and a tape diagram (show: with the first step's answer filled in, where the diagram has it). */
const TWO_STEPS = [
  /* sold on two days: start − b − c */
  () => {
    let a, b, c;
    do {
      a = R(300, 900);
      b = R(50, 300);
      c = R(50, 300);
    } while (a - b - c < 30);
    const left = a - b - c;
    return {
      id: "sold",
      unit: "kites",
      nums: [a, b, c],
      answer: left,
      story: `The harbor shop had ${a} kites. It sold ${b} kites on Saturday and ${c} kites on Sunday.`,
      question: "How many kites are left?",
      stands: "the kites left",
      steps: [`${a} − ${b} = ${a - b}`, `${a - b} − ${c} = ${left}`],
      equation: `${a} − ${b} − ${c} = k`,
      wrongs: [
        [`${a} + ${b} − ${c} = k`, "The kites sold on Saturday are gone too: take them away."],
        [`${a} − ${b} + ${c} = k`, "The kites sold on Sunday are gone too: take them away."],
        [`${b} + ${c} = k`, `That’s how many kites were sold. Take them from ${a}.`],
      ],
      fig: () => tapeOf([b, c, left], [b, c, "?"], a, `A tape of ${a} kites: ${b} sold, ${c} sold, and ? left`),
    };
  },
  /* collecting toward a goal: goal − a − b */
  ([name]) => {
    let goal, a, b;
    do {
      goal = R(4, 9) * 100;
      a = R(100, 400);
      b = R(60, 300);
    } while (goal - a - b < 30);
    const more = goal - a - b;
    return {
      id: "goal",
      unit: "shells",
      nums: [goal, a, b],
      answer: more,
      story: `${name}’s class wants to collect ${goal} shells. They collected ${a} on Monday and ${b} on Tuesday.`,
      question: "How many more shells do they need?",
      stands: "the shells they still need",
      steps: [`${a} + ${b} = ${a + b}`, `${goal} − ${a + b} = ${more}`],
      equation: `${goal} − ${a} − ${b} = s`,
      wrongs: [
        [`${a} + ${b} = s`, "That’s how many they have. Find how many more they need to reach the goal."],
        [`${goal} − ${a} + ${b} = s`, `They have Tuesday’s ${b} shells too: take them away from the goal.`],
        [`${goal} + ${a} + ${b} = s`, "The shells they have count toward the goal: take them away."],
      ],
      fig: () => tapeOf([a, b, more], [a, b, "?"], goal, `A tape of ${goal} shells: ${a}, ${b}, and ? more`),
    };
  },
  /* equal groups and some more: groups × each + extra */
  () => {
    const groups = R(3, 9),
      each = pick([10, R(4, 10)]),
      extra = R(100, 600),
      total = groups * each + extra;
    return {
      id: "crates",
      unit: "coconuts",
      nums: [groups, each, extra],
      answer: total,
      story: `A boat brings ${groups} crates with ${each} coconuts in each crate. There are already ${extra} coconuts at the market.`,
      question: "How many coconuts are there now?",
      stands: "all the coconuts",
      steps: [`${groups} × ${each} = ${groups * each}`, `${groups * each} + ${extra} = ${total}`],
      equation: `${groups} × ${each} + ${extra} = c`,
      wrongs: [
        [`${groups} + ${each} + ${extra} = c`, `There are ${groups} groups of ${each}: multiply them.`],
        ...(groups * each < extra
          ? [[`${extra} − ${groups} × ${each} = c`, "The coconuts from the boat are more coconuts: add them."]]
          : []),
        [`${groups} × ${each} = c`, `That’s only the coconuts in the crates. Add the ${extra} at the market.`],
      ],
      fig: (show) =>
        tapeOf(
          [groups * each, extra],
          [show ? groups * each : `${groups} × ${each}`, extra],
          "?",
          `A tape of ${groups} × ${each} and ${extra}, ? in all`,
        ),
    };
  },
  /* one has more than the other; how many together: a + (a + more) */
  ([name, other]) => {
    const a = R(100, 400),
      more = R(20, 150),
      total = a + a + more;
    return {
      id: "more",
      unit: "pages",
      nums: [a, more],
      answer: total,
      story: `${name} read ${a} pages this month. ${other} read ${more} more pages than ${name}.`,
      question: "How many pages did they read in all?",
      stands: "all the pages they read",
      steps: [`${a} + ${more} = ${a + more}`, `${a} + ${a + more} = ${total}`],
      equation: `${a} + ${a} + ${more} = p`,
      wrongs: [
        [`${a} + ${more} = p`, `That’s only how many ${other} read. Add ${name}’s pages too.`],
        [`${a} + ${a} − ${more} = p`, `${other} read more pages than ${name}, not fewer.`],
      ],
      fig: (show) =>
        tapes(
          [
            { label: name, n: a, show: a },
            { label: other, n: a + more, show: show ? a + more : "?" },
          ],
          { diff: more },
        ),
    };
  },
  /* one has fewer than the other; how many together: a + (a − fewer) */
  ([name, other]) => {
    const a = R(150, 450),
      fewer = R(20, 120),
      total = a + a - fewer;
    return {
      id: "fewer",
      unit: "pages",
      nums: [a, fewer],
      answer: total,
      story: `${name} read ${a} pages this month. ${other} read ${fewer} fewer pages than ${name}.`,
      question: "How many pages did they read in all?",
      stands: "all the pages they read",
      steps: [`${a} − ${fewer} = ${a - fewer}`, `${a} + ${a - fewer} = ${total}`],
      equation: `${a} + ${a} − ${fewer} = p`,
      wrongs: [
        [`${a} − ${fewer} = p`, `That’s only how many ${other} read. Add ${name}’s pages too.`],
        [`${a} + ${a} + ${fewer} = p`, `${other} read fewer pages than ${name}, not more.`],
      ],
      fig: (show) =>
        tapes(
          [
            { label: name, n: a, show: a },
            { label: other, n: a - fewer, show: show ? a - fewer : "?" },
          ],
          { diff: fewer },
        ),
    };
  },
];
function genTwoStep() {
  const variant = R(0, 1),
    names = twoNames(),
    problem = pick(TWO_STEPS)(names),
    facts = { t: "two", id: problem.id, nums: problem.nums };
  if (variant === 0)
    /* solve it */
    return {
      kind: "num",
      unit: problem.unit,
      answer: problem.answer,
      facts,
      prompt: `${problem.story} ${problem.question}`,
      fig: problem.fig,
      misc: miscOf(
        problem.answer,
        problem.wrongs
          .map(([equation, why]) => [evaluate(equation.split(" = ")[0]), why])
          .filter(([value]) => value > 0 && value !== problem.answer),
      ),
      hint: `It takes two steps. First: ${problem.steps[0].split(" = ")[0]}.`,
      explain: `First, ${problem.steps[0]}. Then ${problem.steps[1]}. That’s ${problem.answer} ${problem.unit}.`,
    };
  /* which equation matches the story? The letter stands for the unknown */
  const letter = problem.equation.slice(-1),
    wrongs = shuffle(
      problem.wrongs.filter(([equation]) => evaluate(equation.split(" = ")[0]) !== problem.answer),
    ).slice(0, 2);
  return {
    ...mcOf([[problem.equation, null], ...wrongs]),
    facts,
    prompt: `${problem.story} Which equation matches the story? The letter ${letter} stands for ${problem.stands}.`,
    fig: problem.fig,
    hint: `Find the two steps: ${problem.steps.map((step) => step.split(" = ")[0]).join(", then ")}.`,
    explain: `${problem.equation.replace(/ = \w$/, "")} = ${problem.answer}, so ${letter} = ${problem.answer}.`,
  };
}
/* the value of an expression with +, −, and ×, where × goes first: "4 × 10 + 245" is 285 */
function evaluate(expression) {
  const terms = expression.split(/ ([+−]) /),
    product = (term) => term.split(" × ").reduce((value, factor) => value * +factor, 1);
  let value = product(terms[0]);
  for (let i = 1; i < terms.length; i += 2) value += (terms[i] === "+" ? 1 : -1) * product(terms[i + 1]);
  return value;
}

/* Treasure Island deals from every station */
const genBoss = () => pick([genPlace, genAdd, genSubtract, genRound, genEstimate, genTwoStep])();

const ZONES = [
  {
    id: "place",
    name: "Counting House",
    lessons: "Lesson 1",
    blurb:
      "Read numbers in base-ten blocks and expanded form, trade a hundred for 10 tens, and find numbers on a number line.",
    gen: genPlace,
  },
  {
    id: "add",
    name: "Cargo Dock",
    lessons: "Lessons 2–6",
    blurb:
      "Add within 1,000: jump on a number line, add by place, make a friendly number, and use the standard algorithm.",
    gen: genAdd,
  },
  {
    id: "subtract",
    name: "Supply Shop",
    lessons: "Lessons 7–12",
    blurb: "Subtract within 1,000: count up or jump back, regroup to take away by place, and subtract across zeros.",
    gen: genSubtract,
  },
  {
    id: "round",
    name: "Lighthouse Point",
    lessons: "Lessons 13–15",
    blurb: "Round to the nearest ten and hundred on a number line. Halfway rounds up.",
    gen: genRound,
  },
  {
    id: "estimate",
    name: "Crow’s Nest",
    lessons: "Lessons 16–17",
    blurb: "Round to estimate sums and differences, and check whether an answer makes sense.",
    gen: genEstimate,
  },
  {
    id: "twostep",
    name: "Voyage Planner",
    lessons: "Lessons 18–20",
    blurb: "Solve two-step stories with tape diagrams, and match them to equations with a letter for the unknown.",
    gen: genTwoStep,
  },
  {
    id: "boss",
    name: "Treasure Island",
    lessons: "All lessons",
    blurb: "Dig up the treasure! Every right answer drops a gold coin in the chest.",
    gen: genBoss,
  },
];

/* the treasure chest with `lit` of its 10 coins in it (the boss icon draws all of them) */
const chest = (lit) =>
  '<rect x="8" y="30" width="48" height="26" rx="3" fill="#8a4a2b" stroke="#f3f6fb" stroke-width="1.5"/>' +
  '<path d="M8,30Q32,12 56,30" fill="#a65f38" stroke="#f3f6fb" stroke-width="1.5"/>' +
  '<rect x="28" y="34" width="8" height="9" rx="1.5" fill="#ffc93c"/>' +
  range(10)
    .map((i) => {
      const x = 13 + (i % 5) * 9.5,
        y = 50 - Math.floor(i / 5) * 8 - 22;
      return `<circle cx="${x}" cy="${y}" r="4" fill="${i < lit ? "#ffc93c" : "rgba(255,255,255,.12)"}" stroke="${i < lit ? "#b8860b" : "none"}"/>`;
    })
    .join("");
const ICON = {
  place:
    '<rect x="6" y="14" width="24" height="24" fill="#ffc93c" stroke="#0a2340"/><path d="M6,26h24M18,14v24" stroke="rgba(10,35,64,.4)"/>' +
    '<rect x="34" y="14" width="6" height="24" fill="#7fe3ff" stroke="#0a2340"/><rect x="43" y="14" width="6" height="24" fill="#7fe3ff" stroke="#0a2340"/>' +
    '<rect x="52" y="32" width="6" height="6" fill="#5fe0a8" stroke="#0a2340"/>' +
    '<text x="32" y="56" fill="#f3f6fb" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">221</text>',
  add:
    '<rect x="6" y="30" width="22" height="18" fill="#c97b4b" stroke="#f3f6fb" stroke-width="1.5"/><rect x="34" y="30" width="22" height="18" fill="#c97b4b" stroke="#f3f6fb" stroke-width="1.5"/>' +
    '<text x="31" y="44" fill="#ffc93c" font-size="14" font-weight="700" text-anchor="middle" font-family="monospace">+</text>' +
    '<path d="M2,54H62" stroke="#7fe3ff" stroke-width="2.5"/><text x="32" y="20" fill="#f3f6fb" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">358+167</text>',
  subtract:
    '<path d="M14,18H50L46,50H18Z" fill="#7fb0e6" stroke="#f3f6fb" stroke-width="1.5"/><path d="M22,18Q32,6 42,18" fill="none" stroke="#f3f6fb" stroke-width="2"/>' +
    '<text x="32" y="40" fill="#0a2340" font-size="16" font-weight="700" text-anchor="middle" font-family="monospace">−</text>',
  round:
    '<path d="M24,56L28,18H36L40,56Z" fill="#f3f6fb" stroke="#0a2340" stroke-width="1.5"/><path d="M26,32H38M25,44H39" stroke="#ff7b7b" stroke-width="4"/>' +
    '<rect x="26" y="10" width="12" height="8" fill="#ffc93c"/><path d="M38,12L58,6M38,16L58,22" stroke="#ffc93c" stroke-width="2"/>',
  estimate:
    '<path d="M32,6V58" stroke="#c97b4b" stroke-width="3"/><path d="M18,22H46L42,32H22Z" fill="#c97b4b" stroke="#f3f6fb" stroke-width="1.5"/>' +
    '<text x="32" y="50" fill="#7fe3ff" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">≈ 800</text>',
  twostep:
    '<path d="M6,46Q20,30 32,40T58,30" fill="none" stroke="#7fe3ff" stroke-width="2.5" stroke-dasharray="4 3"/>' +
    '<circle cx="6" cy="46" r="4" fill="#ffc93c"/><circle cx="32" cy="40" r="4" fill="#ffc93c"/><path d="M52,24L60,32M60,24L52,32" stroke="#ff7b7b" stroke-width="3"/>' +
    '<text x="32" y="20" fill="#f3f6fb" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">2 steps</text>',
  boss: chest(10),
};
