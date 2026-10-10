/* Fraction Farm (Grade 3 Unit 5): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Fraction strips (strips) and fraction number lines (fracLine) come from shared/fractions.js; shapes cut into parts (shareFig)
   from shared/shapes.js; fr, PART, and partName from shared/pictures.js; DENS, partsOf, aPart, cap, compareFr, and SIGN_HTML
   from figs.js; mcOf and miscOf from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Every problem also
   carries facts for checks.js: its kind (t) and the fractions it was made from, as [numerator, denominator]. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* two different students */
const twoKids = () => shuffle(KIDS).slice(0, 2);
/* Named mistakes for a typed fraction, leaving out any whose value is the answer's or so close the engine would count it
   right (it accepts answers within 0.011) */
const apart = (answer, list) =>
  miscOf(
    answer,
    list.filter(([value]) => value > 0 && Math.abs(value - answer) > 0.012),
  );
/* the three ways to finish "a ? b" as an mc problem; wrong(s) is the message for a wrong sign s */
function signChoices(a, b, wrong) {
  const right = compareFr(a, b);
  return mcOf(["<", "=", ">"].map((s) => [`${fr(...a)} ${SIGN_HTML[s]} ${fr(...b)}`, s === right ? null : wrong(s)]));
}
/* round things to cut (circles), and long things (rectangles cut side by side): [what it is, a short name] */
const ROUND = [
  ["apple pie", "pie"],
  ["pumpkin pie", "pie"],
  ["pizza", "pizza"],
  ["wheel of cheese", "cheese"],
];
const LONG = [
  ["garden bed", "bed"],
  ["pan of cornbread", "pan"],
  ["row of corn", "row"],
  ["fence", "fence"],
];

/* ---------- Pie Stand: equal parts and unit fractions (Lessons 1–2) ---------- */
function genParts() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* one slice of a round thing cut into d equal slices */
    const d = pick(DENS),
      [thing, short] = pick(ROUND);
    return {
      kind: "num",
      frac: true,
      unit: `of the ${short}`,
      answer: 1 / d,
      facts: { t: "slice", d },
      prompt: `The ${thing} is cut into ${d} equal slices. What fraction of the ${short} is 1 slice?`,
      fig: () => shareFig("circle", d, "v", { shade: [0] }),
      misc: apart(1 / d, [
        [d, `${d} is how many slices. 1 slice is 1 of ${d} equal parts: write it as a fraction.`],
        [(d - 1) / d, `That’s the slices that aren’t shaded. Name the 1 shaded slice.`],
      ]),
      hint: `The whole is cut into ${d} equal parts. Each part is ${aPart(d)}.`,
      explain: `1 of ${d} equal parts is ${aPart(d)}: ${fr(1, d)} of the ${short}.`,
    };
  }
  if (variant === 1) {
    /* which shape is cut into d equal parts? The wrong ones are cut into parts not the same size, or a different number */
    const d = pick([2, 3, 4]),
      shape = pick(["circle", "rect", "square"]),
      other = d === 4 ? 3 : d + 1,
      /* a square or circle cut into fourths can be cut into a grid too */
      how = d === 4 && shape !== "circle" && R(0, 1) ? "grid" : "v";
    return {
      ...mcOf([
        [shareFig(shape, d, how, { s: 110 }), null],
        [
          shareFig(shape, d, "uneq", { s: 110 }),
          `Those ${d} parts aren’t the same size, so they aren’t ${partsOf(d)}.`,
        ],
        [shareFig(shape, other, "v", { s: 110 }), `That’s ${other} equal parts: ${partsOf(other)}.`],
      ]),
      facts: { t: "equal", d },
      prompt: `Which shape is cut into ${partsOf(d)}?`,
      hint: `${cap(partsOf(d))} are ${d} parts, all the same size.`,
      explain: `${cap(partsOf(d))} are ${d} equal parts of a whole. Count the parts, and check they’re all the same size.`,
    };
  }
  if (variant === 2) {
    /* what is each part called? */
    const d = pick(DENS),
      shape = pick(["circle", "rect"]),
      names = shuffle(DENS.filter((x) => x !== d)).slice(0, 2);
    return {
      ...mcOf([
        [cap(partsOf(d)), null],
        ...names.map((x) => [cap(partsOf(x)), `${cap(partsOf(x))} would be ${x} equal parts. Count the parts.`]),
      ]),
      facts: { t: "name", d },
      prompt: `The ${shape === "circle" ? "pie" : "garden bed"} is cut into equal parts. What are the parts called?`,
      fig: () => shareFig(shape, d, "v"),
      hint: "Count the equal parts. 2 parts are halves, 3 are thirds, 4 are fourths, 6 are sixths, and 8 are eighths.",
      explain: `There are ${d} equal parts, so each one is ${aPart(d)}: ${fr(1, d)}.`,
    };
  }
  /* the same thing cut into more parts has smaller parts: which piece is bigger? */
  const [d1, d2] = shuffle(DENS).slice(0, 2),
    [first, second] = twoKids(),
    [thing, short] = pick(ROUND),
    bigger = d1 < d2 ? first : second;
  return {
    ...mcOf([
      [bigger, null],
      [
        bigger === first ? second : first,
        `More slices means each slice is smaller. ${fr(1, Math.min(d1, d2))} is the bigger slice.`,
      ],
      [
        "They’re the same size",
        `The ${short}s are cut into different numbers of slices, so the slices aren’t the same size.`,
      ],
    ]),
    facts: { t: "unitCompare", d1, d2, first, second, bigger },
    prompt: `${first} gets ${fr(1, d1)} of ${/^[aeiou]/.test(thing) ? "an" : "a"} ${thing}. ${second} gets ${fr(1, d2)} of another one the same size. Whose slice is bigger?`,
    fig: (show) =>
      strips([
        { d: d1, k: show ? 1 : 0, lab: [1, d1] },
        { d: d2, k: show ? 1 : 0, cls: "b", lab: [1, d2] },
      ]),
    hint: `Cutting a whole into more equal parts makes each part smaller. Which ${short} is cut into fewer slices?`,
    explain: `${fr(1, Math.min(d1, d2))} is 1 of ${Math.min(d1, d2)} parts, and ${fr(1, Math.max(d1, d2))} is 1 of ${Math.max(d1, d2)} smaller parts. ${bigger}’s slice is bigger.`,
  };
}

/* ---------- Garden Rows: fractions from unit fractions (Lessons 3–4) ---------- */
function genBuild() {
  const variant = R(0, 3),
    [name] = shuffle(KIDS),
    d = pick(DENS.slice(1)),
    k = R(2, d - 1);
  if (variant === 0) {
    /* name the shaded fraction of a long thing */
    const [thing, short] = pick(LONG);
    return {
      kind: "num",
      frac: true,
      unit: `of the ${short}`,
      answer: k / d,
      facts: { t: "shaded", k, d },
      prompt: `The ${thing} is split into ${d} equal parts. ${name} plants the shaded parts. What fraction of the ${short} is planted?`,
      fig: () => strips([{ d, k, parts: false }], { label: `A strip cut into ${d} equal parts, ${k} shaded` }),
      misc: apart(k / d, [
        [(d - k) / d, "That’s the part that isn’t planted. Count the shaded parts."],
        [d / k, `The top and bottom are switched. The bottom number is how many equal parts make the whole: ${d}.`],
        [k / (d - k), `The bottom number counts all ${d} parts, not only the ones that aren’t shaded.`],
      ]),
      hint: "The bottom number is how many equal parts the whole has. The top number is how many are shaded.",
      explain: `Each part is ${fr(1, d)}. ${partName(d, k)} are shaded: ${fr(k, d)}.`,
    };
  }
  if (variant === 1) {
    /* how many unit fractions make k/d? */
    return {
      kind: "num",
      unit: "",
      answer: k,
      facts: { t: "count", k, d },
      prompt: `How many ${fr(1, d)}s make ${fr(k, d)}?`,
      fig: (show) =>
        strips([{ d, k: show ? k : 0 }], { label: `A strip cut into ${d} equal parts, ${show ? k : 0} shaded` }),
      misc: apart(k, [[d, `${d} is how many parts make the whole. How many of them make ${fr(k, d)}?`]]),
      hint: `${fr(k, d)} is ${partName(d, k)}. Each one is ${fr(1, d)}.`,
      explain: `${fr(k, d)} is ${k} parts of ${fr(1, d)}, so it takes ${k} of them.`,
    };
  }
  if (variant === 2) {
    /* which picture shows k/d? The wrong ones shade the rest, or cut the whole into a different number of parts */
    const shaded = Math.min(k, 5),
      otherD = pick(DENS.filter((x) => x !== d && x > shaded)),
      shape = pick(["rect", "circle"]),
      /* shading the rest only differs when it isn't half; otherwise shade one part too many */
      wrongs = [
        d - shaded === shaded
          ? [
              shareFig(shape, d, "v", { shade: range(shaded + 1), s: 110 }),
              `That shades ${partName(d, shaded + 1)}. Shade ${shaded}.`,
            ]
          : [
              shareFig(shape, d, "v", { shade: range(d - shaded), s: 110 }),
              `That shades ${partName(d, d - shaded)}. Shade ${shaded} of the ${d} parts.`,
            ],
        [
          shareFig(shape, otherD, "v", { shade: range(shaded), s: 110 }),
          `That’s ${shaded} of ${otherD} parts: ${fr(shaded, otherD)}.`,
        ],
      ];
    return {
      ...mcOf([[shareFig(shape, d, "v", { shade: range(shaded), s: 110 }), null], ...wrongs]),
      facts: { t: "picture", k: shaded, d },
      prompt: `Which picture shows ${fr(shaded, d)} shaded?`,
      hint: `${fr(shaded, d)} is ${shaded} of ${d} equal parts.`,
      explain: `Cut the whole into ${d} equal parts, ${partsOf(d)}, and shade ${shaded} of them: ${fr(shaded, d)}.`,
    };
  }
  /* a story: the same unit fraction each day, k days */
  const [thing, short] = pick(LONG.slice(0, 3));
  return {
    kind: "num",
    frac: true,
    unit: `of the ${short}`,
    answer: k / d,
    facts: { t: "days", k, d },
    prompt: `${name} plants ${fr(1, d)} of a ${thing} each day. How much of the ${short} is planted after ${k} days?`,
    fig: (show) =>
      strips([{ d, k: show ? k : 0, parts: show }], {
        label: `A strip cut into ${d} equal parts, ${show ? k : 0} shaded`,
      }),
    misc: apart(k / d, [
      [k, `${k} is how many parts. Each one is ${fr(1, d)}: write a fraction.`],
      [1 / (d * k), `Each day adds another ${fr(1, d)}, so there are ${k} parts of ${fr(1, d)}.`],
    ]),
    hint: `Each day is ${fr(1, d)}. ${k} days is ${k} parts of ${fr(1, d)}.`,
    explain: `${k} parts of ${fr(1, d)} make ${fr(k, d)} of the ${short}.`,
  };
}

/* ---------- Fence Line: fractions on the number line (Lessons 5–7) ---------- */
function genLine() {
  const variant = R(0, 3),
    [name] = shuffle(KIDS),
    d = pick(DENS),
    k = R(1, d - 1);
  if (variant === 0) {
    /* tap k/d on a number line from 0 to 1 */
    const why = {};
    range(d + 1).forEach((j) => {
      if (j !== k)
        why[j] =
          j === 0
            ? "That’s 0, where the line starts."
            : j === d
              ? `That’s 1 whole: ${fr(d, d)}.`
              : `That tick is ${fr(j, d)}. Count the jumps of ${fr(1, d)} from 0.`;
    });
    return {
      kind: "tap",
      answer: String(k),
      why,
      facts: { t: "tap", k, d },
      prompt: `Tap ${fr(k, d)} on the number line.`,
      fig: (show) => fracLine([{ d, tap: "cand", hops: show ? k : 0 }]),
      hint: `The line from 0 to 1 is cut into ${d} equal parts, ${partsOf(d)}. Count ${k} jump${k > 1 ? "s" : ""} of ${fr(1, d)} from 0.`,
      explain: `${fr(k, d)} is ${k} jump${k > 1 ? "s" : ""} of ${fr(1, d)} from 0.`,
    };
  }
  if (variant === 1) {
    /* what fraction is the point at? Counting ticks instead of jumps, or every tick as the whole, are the mistakes */
    return {
      kind: "num",
      frac: true,
      unit: "",
      answer: k / d,
      facts: { t: "point", k, d },
      prompt: "What fraction is the point at?",
      fig: (show) => fracLine([{ d, pts: [{ k }], hops: show ? k : 0, labs: show }]),
      misc: apart(k / d, [
        [(k + 1) / d, "That counts the tick at 0. Count the jumps from 0, not the tick marks."],
        [k / (d + 1), `There are ${d + 1} tick marks but ${d} equal parts. The bottom number is the parts: ${d}.`],
      ]),
      hint: `Count the equal parts from 0 to 1: that’s the bottom number. Then count the jumps from 0 to the point.`,
      explain: `The line from 0 to 1 has ${d} equal parts, so each jump is ${fr(1, d)}. The point is ${k} jump${k > 1 ? "s" : ""} from 0: ${fr(k, d)}.`,
    };
  }
  if (variant === 2) {
    /* how many jumps of 1/d from 0 to k/d? */
    return {
      kind: "num",
      unit: "jumps",
      answer: k,
      facts: { t: "jumps", k, d },
      prompt: `How many jumps of ${fr(1, d)} does it take to go from 0 to ${fr(k, d)}?`,
      fig: (show) => fracLine([{ d, hops: show ? k : 0, labs: true }]),
      misc: apart(k, [
        [d, `${d} jumps go all the way to 1. Stop at ${fr(k, d)}.`],
        [k + 1, "Count the jumps, not the tick marks."],
      ]),
      hint: `Each jump is ${fr(1, d)}. ${fr(k, d)} is ${partName(d, k)}.`,
      explain: `${fr(k, d)} is ${k} jump${k > 1 ? "s" : ""} of ${fr(1, d)}.`,
    };
  }
  /* a story: signs every 1/d of a mile along a trail */
  const sign = k;
  return {
    kind: "num",
    frac: true,
    unit: "mile",
    answer: k / d,
    facts: { t: "trail", k, d },
    prompt: `The trail from the barn to the pond is 1 mile long. There’s a sign every ${fr(1, d)} mile. ${name} walks from the barn to sign ${sign}. How far has ${name} walked?`,
    fig: (show) =>
      fracLine([{ d, pts: [{ k }], hops: show ? k : 0 }], {
        label: `A trail from 0 to 1 mile, a sign every 1/${d} mile, a point at sign ${sign}`,
      }),
    misc: apart(k / d, [
      [k, `${name} walked to sign ${k}. Each sign is ${fr(1, d)} mile further: write a fraction.`],
      [(d - k) / d, `That’s how far is left to the pond.`],
    ]),
    hint: `Each sign is ${fr(1, d)} mile further than the one before.`,
    explain: `${k} jump${k > 1 ? "s" : ""} of ${fr(1, d)} mile is ${fr(k, d)} mile.`,
  };
}

/* ---------- Big Barn: fractions and whole numbers (Lessons 8–9) ---------- */
function genWholes() {
  const variant = R(0, 3),
    d = pick([2, 3, 4, 6]),
    whole = R(1, 3);
  if (variant === 0) {
    /* which whole number is a fraction like 8/4? */
    const n = whole * d;
    return {
      kind: "num",
      unit: "",
      answer: whole,
      facts: { t: "toWhole", n, d },
      prompt: `${fr(n, d)} is a whole number. Which one?`,
      fig: (show) => fracLine([{ d, pts: [{ k: n }], hops: show ? n : 0 }], { wholes: 3 }),
      misc: apart(whole, [
        [n, `${n} is how many ${partsOf(d)}. ${d} of them make 1 whole.`],
        [d, `${d} is how many parts make 1 whole. How many wholes do ${n} parts make?`],
      ]),
      hint: `${d} ${partsOf(d)} make 1 whole. How many wholes do ${n} ${partsOf(d)} make?`,
      explain: `${fr(d, d)} = 1, so ${n} ${partsOf(d)} make ${whole} whole${whole > 1 ? "s" : ""}: ${fr(n, d)} = ${whole}.`,
    };
  }
  if (variant === 1) {
    /* a point past 1 on a line from 0 to 2: what fraction is it? */
    const k = R(d + 1, 2 * d - 1);
    return {
      kind: "num",
      frac: true,
      unit: "",
      answer: k / d,
      facts: { t: "past", k, d },
      prompt: `What fraction is the point at? Use ${partsOf(d)}.`,
      fig: (show) => fracLine([{ d, pts: [{ k }], hops: show ? k : 0, labs: show }], { wholes: 2 }),
      misc: apart(k / d, [
        [(k - d) / d, `That counts from 1. Count every jump from 0: ${d} to get to 1, then more.`],
        [k / (2 * d), `The bottom number is how many parts make 1 whole: ${d}, not ${2 * d}.`],
      ]),
      hint: `Each whole has ${d} jumps of ${fr(1, d)}. Count every jump from 0 to the point.`,
      explain: `It’s ${k} jumps of ${fr(1, d)} from 0: ${fr(k, d)}.`,
    };
  }
  if (variant === 2) {
    /* which fraction equals a whole number? The wrong ones switch the numbers, or take the whole number as the parts */
    const n = whole * d;
    return {
      ...mcOf([
        [fr(n, d), null],
        /* one part short; and the whole number as the top number (just a few parts), or one part too many */
        [fr(n - 1, d), `That’s 1 ${PART[d][0]} short of ${whole}.`],
        whole < d && whole !== n - 1
          ? [fr(whole, d), `That’s ${partName(d, whole)}, less than 1 whole.`]
          : [fr(n + 1, d), `That’s 1 ${PART[d][0]} more than ${whole}.`],
      ]),
      facts: { t: "isWhole", whole },
      prompt: `Which fraction is equal to ${whole}?`,
      fig: (show) => fracLine([{ d, labs: show }], { wholes: 3 }),
      hint: `${d} ${partsOf(d)} make 1 whole. How many ${partsOf(d)} make ${whole}?`,
      explain: `${whole} whole${whole > 1 ? "s" : ""} of ${d} ${partsOf(d)} each is ${n} ${partsOf(d)}: ${fr(n, d)} = ${whole}.`,
    };
  }
  /* tap a fraction past 1 on a line from 0 to 2 */
  const k = R(d + 1, 2 * d - 1),
    why = {};
  range(2 * d + 1).forEach((j) => {
    if (j !== k)
      why[j] =
        j % d === 0
          ? `That’s ${j / d}: ${fr(j, d)}.`
          : `That tick is ${fr(j, d)}. Count every jump of ${fr(1, d)} from 0.`;
  });
  return {
    kind: "tap",
    answer: String(k),
    why,
    facts: { t: "tapPast", k, d },
    prompt: `Tap ${fr(k, d)} on the number line.`,
    fig: (show) => fracLine([{ d, tap: "cand", hops: show ? k : 0 }], { wholes: 2 }),
    hint: `${fr(d, d)} is 1. ${fr(k, d)} is ${k - d} more jump${k - d > 1 ? "s" : ""} of ${fr(1, d)} past 1.`,
    explain: `${fr(k, d)} is ${k} jumps of ${fr(1, d)} from 0, past 1.`,
  };
}

/* ---------- Garden Plots: equivalent fractions (Lessons 10–13) ---------- */
/* equivalent pairs within the unit's denominators: [a, b, c] for a/b = ?/c, where b goes into c */
const EQUIV = [
  [1, 2, 4],
  [1, 2, 6],
  [1, 2, 8],
  [1, 3, 6],
  [2, 3, 6],
  [1, 4, 8],
  [3, 4, 8],
  [2, 4, 8],
];
function genEquivalent() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* a/b = ?/c, with strips */
    const [a, b, c] = pick(EQUIV),
      answer = (a * c) / b;
    return {
      kind: "num",
      unit: "",
      answer,
      facts: { t: "missingTop", a, b, c },
      prompt: `${fr(a, b)} = ${fr("?", c)}. What number goes in the box?`,
      fig: (show) =>
        strips([
          { d: b, k: a, lab: [a, b] },
          { d: c, k: show ? answer : 0, cls: "b", lab: ["?", c] },
        ]),
      misc: apart(answer, [
        [a + c - b, `That adds the same number to the top and the bottom. Make the shaded parts the same length.`],
        [c, `${c} is how many parts make the whole. How many of them match ${fr(a, b)}?`],
      ]),
      hint: `Shade ${partsOf(c)} until they’re as long as ${fr(a, b)}.`,
      explain: `${partName(c, answer)} cover the same length as ${fr(a, b)}: ${fr(a, b)} = ${fr(answer, c)}.`,
    };
  }
  if (variant === 1) {
    /* which fraction is equivalent? The wrong ones keep the top number, or add to both */
    const [a, b, c] = pick(EQUIV),
      answer = (a * c) / b,
      /* keeping the top number, adding to the top and bottom, or one part more; a repeat of another choice is left out */
      wrongs = [
        [
          fr(a, c),
          `That keeps the top number. ${cap(partName(c, a))} ${a === 1 ? "is" : "are"} less than ${fr(a, b)}.`,
        ],
        [fr(a + c - b, c), `That adds ${c - b} to the top and bottom. Compare the lengths.`],
        [fr(answer + 1, c), `That’s 1 ${PART[c][0]} more than ${fr(a, b)}.`],
      ].filter(([label], i, all) => all.findIndex(([other]) => other === label) === i);
    return {
      ...mcOf([[fr(answer, c), null], ...shuffle(wrongs).slice(0, 2)]),
      facts: { t: "whichEquiv", a, b },
      prompt: `Which fraction is equivalent to ${fr(a, b)}?`,
      fig: (show) =>
        strips([{ d: b, k: a, lab: [a, b] }, ...(show ? [{ d: c, k: answer, cls: "b", lab: [answer, c] }] : [])]),
      hint: `Equivalent fractions are the same size: they cover the same length of the strip.`,
      explain: `${fr(a, b)} and ${fr(answer, c)} cover the same length, so they’re equivalent.`,
    };
  }
  if (variant === 2) {
    /* a whole number as a fraction: whole = ?/d */
    const d = pick([2, 3, 4, 6]),
      whole = R(1, 3),
      answer = whole * d;
    return {
      kind: "num",
      unit: "",
      answer,
      facts: { t: "wholeAs", whole, d },
      prompt: `${whole} = ${fr("?", d)}. What number goes in the box?`,
      fig: (show) => fracLine([{ d, pts: [{ k: answer }], labs: show }], { wholes: 3 }),
      misc: apart(answer, [
        [
          whole,
          `${fr(whole, d)} is ${partName(d, whole)}, less than ${whole === 1 ? "1" : whole}. Each whole is ${d} ${partsOf(d)}.`,
        ],
        [
          whole + d,
          `That adds. Each whole is ${d} ${partsOf(d)}: count them for ${whole} whole${whole > 1 ? "s" : ""}.`,
        ],
      ]),
      hint: `1 whole is ${fr(d, d)}. Count ${partsOf(d)} to ${whole}.`,
      explain: `Each whole is ${d} ${partsOf(d)}, so ${whole} = ${fr(answer, d)}.`,
    };
  }
  /* the same point on two number lines: tap the tick on the lower line that matches the point on the upper one */
  const [a, b, c] = pick(EQUIV),
    answer = (a * c) / b,
    why = {};
  range(c + 1).forEach((j) => {
    if (j !== answer) why[j] = `That tick is ${fr(j, c)}. Find the tick right under ${fr(a, b)}.`;
  });
  return {
    kind: "tap",
    answer: String(answer),
    why,
    facts: { t: "tapEquiv", a, b, c },
    prompt: `The point is at ${fr(a, b)}. Tap the tick on the lower line that is the same number.`,
    fig: (show) =>
      fracLine(
        [
          { d: b, pts: [{ k: a }], labs: true },
          { d: c, tap: "cand", labs: show },
        ],
        {
          marks: show ? [{ v: a / b, t: [a, b] }] : [],
        },
      ),
    hint: `Equivalent fractions are at the same point on the number line. Look straight down from ${fr(a, b)}.`,
    explain: `${fr(answer, c)} is right under ${fr(a, b)}, so ${fr(a, b)} = ${fr(answer, c)}.`,
  };
}

/* ---------- Harvest Contest: compare fractions (Lessons 14–17) ---------- */
function genCompare() {
  const variant = R(0, 3),
    [first, second] = twoKids();
  if (variant === 0) {
    /* the same denominator: more parts of the same size is more */
    const d = pick(DENS.slice(1)),
      [a, b] = shuffle(range(d - 1).map((i) => i + 1)).slice(0, 2);
    return {
      ...signChoices([a, d], [b, d], (s) =>
        s === "="
          ? `${partName(d, a)} and ${partName(d, b)} are different amounts.`
          : `Both are ${partsOf(d)}, the same size of part. Which one has more of them?`,
      ),
      facts: { t: "sign", a: [a, d], b: [b, d] },
      prompt: `${first} picks ${fr(a, d)} of a basket of apples. ${second} picks ${fr(b, d)} of a basket the same size. Which is true?`,
      fig: (show) =>
        strips([
          { d, k: show ? a : 0, lab: [a, d] },
          { d, k: show ? b : 0, cls: "b", lab: [b, d] },
        ]),
      hint: `Both are ${partsOf(d)}. Which has more of them?`,
      explain: `The parts are the same size, ${partsOf(d)}. ${a > b ? `${a} is more than ${b}` : `${a} is less than ${b}`}, so ${fr(a, d)} ${SIGN_HTML[compareFr([a, d], [b, d])]} ${fr(b, d)}.`,
    };
  }
  if (variant === 1) {
    /* the same numerator: the bigger denominator makes smaller parts */
    const [d1, d2] = shuffle(DENS).slice(0, 2),
      a = R(1, Math.min(d1, d2) - 1);
    return {
      ...signChoices([a, d1], [a, d2], (s) =>
        s === "="
          ? `Both are ${a} part${a > 1 ? "s" : ""}, but the parts aren’t the same size.`
          : `More parts in the whole makes each part smaller. Which are bigger: ${partsOf(d1)} or ${partsOf(d2)}?`,
      ),
      facts: { t: "sign", a: [a, d1], b: [a, d2] },
      prompt: `${first} fills ${fr(a, d1)} of a jar with honey. ${second} fills ${fr(a, d2)} of a jar the same size. Which is true?`,
      fig: (show) =>
        strips([
          { d: d1, k: show ? a : 0, lab: [a, d1] },
          { d: d2, k: show ? a : 0, cls: "b", lab: [a, d2] },
        ]),
      hint: `Both have ${a} part${a > 1 ? "s" : ""}. Which parts are bigger: ${partsOf(d1)} or ${partsOf(d2)}?`,
      explain: `${cap(partsOf(Math.min(d1, d2)))} are bigger than ${partsOf(Math.max(d1, d2))}, so ${fr(a, d1)} ${SIGN_HTML[compareFr([a, d1], [a, d2])]} ${fr(a, d2)}.`,
    };
  }
  if (variant === 2) {
    /* who ran farther? Two points on number lines, the same numerator or the same denominator */
    const sameTop = R(0, 1);
    let firstRun, secondRun;
    if (sameTop) {
      const [d1, d2] = shuffle(DENS).slice(0, 2),
        a = R(1, Math.min(d1, d2) - 1);
      firstRun = [a, d1];
      secondRun = [a, d2];
    } else {
      const d = pick(DENS.slice(1)),
        [a, b] = shuffle(range(d - 1).map((i) => i + 1)).slice(0, 2);
      firstRun = [a, d];
      secondRun = [b, d];
    }
    const winner = compareFr(firstRun, secondRun) === ">" ? first : second;
    return {
      ...mcOf([
        [winner, null],
        [winner === first ? second : first, "The point farther from 0 is the longer run."],
        ["They ran the same distance", "The points aren’t at the same place."],
      ]),
      facts: { t: "farther", one: firstRun, two: secondRun, first, second, winner },
      prompt: `${first} runs ${fr(...firstRun)} mile. ${second} runs ${fr(...secondRun)} mile. Who runs farther?`,
      fig: (show) =>
        fracLine([
          { d: firstRun[1], pts: [{ k: firstRun[0] }], labs: show },
          { d: secondRun[1], pts: [{ k: secondRun[0], cls: "b" }], labs: show },
        ]),
      hint: "On a number line, the number farther right is greater.",
      explain: `${fr(...firstRun)} ${SIGN_HTML[compareFr(firstRun, secondRun)]} ${fr(...secondRun)}, so ${winner} runs farther.`,
    };
  }
  /* equivalent or not: which is true, with fractions that can be equal */
  const [a, b, c] = pick(EQUIV),
    equal = R(0, 1),
    match = (a * c) / b,
    /* not equal: one part more or fewer, staying within 1 part and the whole */
    other = equal ? match : match + 1 < c && (match === 1 || R(0, 1)) ? match + 1 : match - 1,
    right = [a, b],
    left = [other, c];
  return {
    ...signChoices(right, left, (s) =>
      s === "="
        ? "They aren’t the same length on the strips."
        : compareFr(right, left) === "="
          ? "They cover the same length: they’re equivalent."
          : "Compare the shaded lengths.",
    ),
    facts: { t: "sign", a: right, b: left },
    prompt: `${first} waters ${fr(...right)} of the garden. ${second} waters ${fr(...left)} of a garden the same size. Which is true?`,
    fig: (show) =>
      strips([
        { d: right[1], k: show ? right[0] : 0, lab: right },
        { d: left[1], k: show ? left[0] : 0, cls: "b", lab: left },
      ]),
    hint: "Shade both strips and compare the lengths.",
    explain: `${fr(...right)} ${SIGN_HTML[compareFr(right, left)]} ${fr(...left)}${compareFr(right, left) === "=" ? ": they’re equivalent." : "."}`,
  };
}

/* The County Fair deals from every station */
const genBoss = () => pick([genParts, genBuild, genLine, genWholes, genEquivalent, genCompare])();

const ZONES = [
  {
    id: "parts",
    name: "Pie Stand",
    lessons: "Lessons 1–2",
    blurb: "Cut pies into equal parts, name the parts, and see which slice is bigger.",
    gen: genParts,
  },
  {
    id: "build",
    name: "Garden Rows",
    lessons: "Lessons 3–4",
    blurb: "Name fractions like 3/4, and build them from parts like 1/4.",
    gen: genBuild,
  },
  {
    id: "line",
    name: "Fence Line",
    lessons: "Lessons 5–7",
    blurb: "Find fractions on the number line, jump by parts from 0, and walk the trail.",
    gen: genLine,
  },
  {
    id: "wholes",
    name: "Big Barn",
    lessons: "Lessons 8–9",
    blurb: "Find fractions equal to whole numbers, and fractions past 1 on the number line.",
    gen: genWholes,
  },
  {
    id: "equivalent",
    name: "Garden Plots",
    lessons: "Lessons 10–13",
    blurb: "Find equivalent fractions with strips and number lines, and write whole numbers as fractions.",
    gen: genEquivalent,
  },
  {
    id: "compare",
    name: "Harvest Contest",
    lessons: "Lessons 14–17",
    blurb: "Compare fractions with the same denominator or the same numerator, and spot equivalent ones.",
    gen: genCompare,
  },
  {
    id: "boss",
    name: "County Fair",
    lessons: "All lessons",
    blurb: "Win a blue ribbon! Every right answer puts an apple in the prize basket.",
    gen: genBoss,
  },
];

/* the prize basket with `filled` of its 10 apples in it (the boss icon draws all of them) */
const basket = (filled) =>
  '<path d="M8,30H56L50,56H14Z" fill="#c97b4b" stroke="#f3f6fb" stroke-width="1.5"/><path d="M14,30Q32,4 50,30" fill="none" stroke="#c97b4b" stroke-width="3"/>' +
  '<path d="M11,40H53M13,48H51" stroke="rgba(10,35,64,.4)" stroke-width="1.5"/>' +
  range(10)
    .map((i) => {
      const x = 14 + (i % 5) * 9,
        y = 26 - Math.floor(i / 5) * 8;
      return `<circle cx="${x}" cy="${y}" r="4.2" fill="${i < filled ? "#ff7b7b" : "rgba(255,255,255,.12)"}" stroke="${i < filled ? "#b03030" : "none"}"/>`;
    })
    .join("");
/* an icon's line of text, centered at x, y: `size` pixels, in `fill` */
const iconText = (x, y, text, size, fill) =>
  `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="700" text-anchor="middle" font-family="monospace">${text}</text>`;
const ICON = {
  parts:
    '<circle cx="32" cy="32" r="24" fill="#e0a34a" stroke="#f3f6fb" stroke-width="2"/><path d="M32,32V8M32,32L52.8,44M32,32L11.2,44" stroke="#7a4a1f" stroke-width="2.5"/>' +
    '<path d="M32,32V8A24,24 0 0 1 52.8,44Z" fill="#ffc93c"/>',
  build:
    '<rect x="6" y="20" width="52" height="22" fill="none" stroke="#f3f6fb" stroke-width="2"/><rect x="6" y="20" width="39" height="22" fill="#5fe0a8"/>' +
    '<path d="M19,20V42M32,20V42M45,20V42" stroke="#0a2340" stroke-width="2"/>' +
    iconText(32, 58, "3/4", 12, "#ffc93c"),
  line:
    '<path d="M4,40H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M8,32V48M22,34V46M36,34V46M50,34V46M56,32V48" stroke="#f3f6fb" stroke-width="2"/>' +
    '<path d="M8,30Q15,16 22,30M22,30Q29,16 36,30" fill="none" stroke="#ffc93c" stroke-width="2.5"/><circle cx="36" cy="40" r="4" fill="#7fe3ff"/>',
  wholes:
    '<path d="M8,30L32,10L56,30V56H8Z" fill="#ff7b7b" stroke="#f3f6fb" stroke-width="1.5"/><rect x="24" y="38" width="16" height="18" fill="#0a2340"/>' +
    iconText(32, 30, "4/4=1", 9, "#f3f6fb"),
  equivalent:
    '<rect x="6" y="12" width="52" height="16" fill="none" stroke="#f3f6fb" stroke-width="2"/><rect x="6" y="12" width="26" height="16" fill="#ffc93c"/>' +
    '<rect x="6" y="36" width="52" height="16" fill="none" stroke="#f3f6fb" stroke-width="2"/><rect x="6" y="36" width="26" height="16" fill="#7fe3ff"/>' +
    '<path d="M19,36V52M32,36V52M45,36V52M32,12V28" stroke="#0a2340" stroke-width="2"/>',
  compare:
    '<rect x="8" y="18" width="18" height="38" fill="#ffc93c"/><rect x="38" y="30" width="18" height="26" fill="#7fe3ff"/>' +
    iconText(32, 14, "&gt;", 14, "#f3f6fb"),
  boss: basket(10),
};
