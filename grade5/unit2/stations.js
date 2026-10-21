/* Picnic Park (Grade 5 Unit 2): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Sandwiches and rectangles on a grid of unit squares come from figs.js; fraction strips and number lines from
   shared/fractions.js; tapes from shared/numlines.js; fr and mixed from shared/pictures.js; mcOf, miscOf, and gcd from
   shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Every problem also
   carries facts for checks.js: its kind (t) and the numbers it was made from, so the answer can be worked out again. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* the denominators Grade 5 uses for sharing (people at a picnic blanket, parts of a whole) */
const SHARE_DEN = [2, 3, 4, 5, 6, 8];
/* n/d as a fraction, then as a mixed number when it's more than 1 and not whole: "7/4 = 1 3/4" (html) */
const fracAndMixed = (n, d) =>
  n > d && n % d ? `${fr(n, d)} = ${mixed(n, d)}` : n % d ? fr(n, d) : `${fr(n, d)} = ${n / d}`;
/* the word for n things: one (1 or less) or many */
const howMany = (n, one, many) => (n <= 1 ? one : many);
/* Named mistakes for a typed fraction, leaving out any that aren't positive or are so close to the answer that the engine
   would count them right (it accepts answers within 0.011) */
const apart = (answer, list) =>
  miscOf(
    answer,
    list.filter(([value]) => value > 0 && Math.abs(value - answer) > 0.02),
  );
/* a whole number a and a denominator b with nothing in common, a ≠ b: a things shared by b people */
function shareOf(most = 8) {
  let a, b;
  do {
    a = R(1, most);
    b = pick(SHARE_DEN);
  } while (a === b || gcd(a, b) !== 1);
  return [a, b];
}

/* ---------- Sandwich Table: sharing is dividing (Lessons 1–3) ---------- */
/* foods shared at the picnic: [one, many] */
const FOODS = [
  ["sandwich", "sandwiches"],
  ["granola bar", "granola bars"],
  ["sub", "subs"],
];
function genShare() {
  const variant = R(0, 3),
    [a, b] = shareOf(),
    [one, many] = pick(FOODS),
    things = `${a} ${howMany(a, one, many)}`,
    story = `${things} ${a === 1 ? "is" : "are"} shared equally by ${b} friends`;
  if (variant === 0) {
    /* how much each person gets */
    return {
      kind: "num",
      frac: true,
      unit: howMany(a / b, one, many),
      answer: a / b,
      facts: { t: "share", a, b },
      prompt: `${story[0].toUpperCase() + story.slice(1)}. How much does each friend get?`,
      fig: (show) =>
        sandwichFig(a, b, { cut: show, label: `${things}${show ? `, each cut into ${b} equal pieces` : ""}` }),
      misc: apart(a / b, [
        [b / a, `That’s ${b} ÷ ${a}: ${b} ${howMany(b, one, many)} shared by ${a}. Here ${things} are shared by ${b}.`],
        ...(a > 1
          ? [[1 / b, `That’s one piece of one ${one}. Each friend gets a piece of every ${one}: ${a} pieces.`]]
          : []),
      ]),
      hint: `Cut each ${one} into ${b} equal pieces, one for each friend. How many pieces does each friend get?`,
      explain: `Each friend gets ${fr(1, b)} of each of the ${things}: ${a} pieces of ${fr(1, b)}. ${a} ÷ ${b} = ${fracAndMixed(a, b)} ${howMany(a / b, one, many)}.`,
    };
  }
  if (variant === 1) {
    /* which expression shows each person's share */
    return {
      ...mcOf([
        [`${a} ÷ ${b}`, null],
        [
          `${b} ÷ ${a}`,
          `That shares ${b} ${howMany(b, one, many)} among ${a}. Here ${things} are shared by ${b} friends.`,
        ],
        [
          `${a} × ${b}`,
          `That would give each friend ${a} whole ${howMany(a, one, many)} ${b} times over. Sharing is dividing.`,
        ],
      ]),
      facts: { t: "shareExpr", a, b },
      prompt: `${story[0].toUpperCase() + story.slice(1)}. Which expression shows how much each friend gets?`,
      fig: () => sandwichFig(a, b, { cut: false, label: things }),
      hint: `Sharing equally is dividing. What is being shared, and by how many?`,
      explain: `${things} shared by ${b} friends is ${a} ÷ ${b} = ${fracAndMixed(a, b)} ${howMany(a / b, one, many)} each.`,
    };
  }
  if (variant === 2) {
    /* which story matches a division equation; a is at least 2 so the flipped story has more than 1 friend */
    const [c, d] = a === 1 ? [b - 1, b] : [a, b];
    return {
      ...mcOf([
        [`${c} ${many} shared equally by ${d} friends`, null],
        [`${d} ${many} shared equally by ${c} friends`, `That’s ${d} ÷ ${c}: the first number is what’s shared.`],
        [`${c} friends each get ${d} ${many}`, `That’s ${c} × ${d}. The equation divides.`],
      ]),
      facts: { t: "shareStory", a: c, b: d },
      prompt: `Which story matches ${c} ÷ ${d} = ${fr(c, d)}?`,
      hint: "In a ÷ b, a is what’s shared and b is how many share it.",
      explain: `${c} ÷ ${d}: ${c} ${many} shared by ${d} friends, ${fr(c, d)} ${howMany(c / d, one, many)} each.`,
    };
  }
  /* how many were shared, from each person's share */
  return {
    kind: "num",
    unit: many,
    answer: a,
    facts: { t: "shared", a, b },
    prompt: `Some ${many} are shared equally by ${b} friends. Each friend gets ${fr(a, b)} ${howMany(a / b, one, many)}. How many ${many} were shared?`,
    misc: miscOf(a, [
      [b, `That’s how many friends there are. ? ÷ ${b} = ${fr(a, b)}: what’s shared goes on top.`],
      ...(a * b !== a
        ? [[a * b, `That multiplies ${a} by ${b}. ? ÷ ${b} = ${fr(a, b)}: the top number is what’s shared.`]]
        : []),
    ]).filter(([wrong]) => wrong !== a),
    hint: `? ÷ ${b} = ${fr(a, b)}. Each friend gets ${a} pieces of ${fr(1, b)}, one from each ${one}.`,
    explain: `${a} ÷ ${b} = ${fr(a, b)}, so ${a} ${howMany(a, one, many)} ${a === 1 ? "was" : "were"} shared.`,
  };
}

/* ---------- Lemonade Stand: division situations and fractions (Lessons 4–5) ---------- */
/* amounts split equally: [the story for a split into b, the unit for 1 or less, for more, the most for each part] */
const SPLITS = [
  [
    (a, b) => `${a} liters of lemonade are poured equally into ${b} pitchers. How much is in each pitcher?`,
    "liter",
    "liters",
    3,
  ],
  [
    (a, b) => `A ${a}-meter rope is cut into ${b} equal pieces for a tug-of-war game. How long is each piece?`,
    "meter",
    "meters",
    4,
  ],
  [(a, b) => `${a} cups of trail mix are split equally into ${b} bags. How much is in each bag?`, "cup", "cups", 2],
  [
    (a, b) => `The ${a}-mile picnic trail has ${b} equal parts, with a bench after each. How long is each part?`,
    "mile",
    "miles",
    2,
  ],
];
function genStories() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* a story: a split into b equal parts */
    const [story, one, many, most] = pick(SPLITS);
    let a, b;
    do [a, b] = shareOf(12);
    while (a / b > most || a < 2);
    const whole = Math.floor(a / b),
      left = a % b;
    return {
      kind: "num",
      frac: true,
      unit: howMany(a / b, one, many),
      answer: a / b,
      facts: { t: "split", a, b },
      prompt: story(a, b),
      fig: (show) =>
        show
          ? strips([{ d: b, k: a }], {
              wholes: Math.max(1, Math.ceil(a / b)),
              label: `${a}/${b} in strips of ${b} parts`,
            })
          : strips([{ d: 1, k: a, parts: false }], { wholes: a, label: `${a} wholes` }),
      misc: apart(a / b, [
        [b / a, `That’s ${b} ÷ ${a}. The amount, ${a}, is split into ${b} parts: ${a} ÷ ${b}.`],
        ...(whole && left
          ? [[whole, `That’s only the whole ${many}. Split the ${left} left over too: ${fr(left, b)} more.`]]
          : []),
      ]),
      hint: `Split ${a} into ${b} equal parts: ${a} ÷ ${b}.`,
      explain: `${a} ÷ ${b} = ${fracAndMixed(a, b)} ${howMany(a / b, one, many)}.`,
    };
  }
  if (variant === 1) {
    /* a ÷ b as a mixed number, not a remainder */
    let a, b;
    do [a, b] = shareOf(12);
    while (a < b || a % b === 0 || b === 2 * (a % b));
    const whole = Math.floor(a / b),
      left = a % b;
    return {
      ...mcOf([
        [mixed(a, b), null],
        [
          fr(left, b),
          `That’s only the part left over. First, ${b} goes into ${a} ${whole} ${whole === 1 ? "time" : "times"}.`,
        ],
        [
          `${whole} R ${left}`,
          `That stops with a remainder. Share the ${left} left over too: ${left} ÷ ${b} = ${fr(left, b)}.`,
        ],
      ]),
      facts: { t: "mixed", a, b },
      prompt: `Which number is equal to ${a} ÷ ${b}?`,
      fig: () => fracLine([{ d: b }], { wholes: whole + 1, label: `A number line from 0 to ${whole + 1} in ${b}ths` }),
      hint: `${b} goes into ${a} ${whole} times with ${left} left over. Share the leftover too.`,
      explain: `${a} ÷ ${b} = ${fr(a, b)} = ${whole} + ${fr(left, b)} = ${mixed(a, b)}.`,
    };
  }
  if (variant === 2) {
    /* a missing number: a/b = a ÷ ? or ? ÷ b */
    const [a, b] = shareOf(),
      askTop = a > 1 && R(0, 1) === 1,
      answer = askTop ? a : b;
    return {
      kind: "num",
      unit: "",
      answer,
      facts: { t: "missing", a, b, askTop },
      prompt: `What is the missing number? ${fr(a, b)} = ${askTop ? `? ÷ ${b}` : `${a} ÷ ?`}`,
      misc: miscOf(answer, [
        [
          askTop ? b : a,
          askTop
            ? "That’s the bottom number. The top of a fraction is what’s divided."
            : "That’s the top number. Divide by the bottom number.",
        ],
      ]).filter(([wrong]) => wrong !== answer),
      hint: `A fraction is a division: the top number divided by the bottom number.`,
      explain: `${fr(a, b)} = ${a} ÷ ${b}, so the missing number is ${answer}.`,
    };
  }
  /* find a ÷ b on a number line, by tapping its tick */
  let a, b;
  do [a, b] = shareOf(10);
  while (b > 6 || a < 2);
  const wholes = Math.floor(a / b) + 1;
  return {
    kind: "tap",
    answer: String(a),
    facts: { t: "line", a, b },
    prompt: `Tap ${a} ÷ ${b} on the number line.`,
    fig: () =>
      fracLine([{ d: b, tap: "cand" }], {
        wholes,
        label: `A number line from 0 to ${wholes} with a tick every 1/${b}`,
      }),
    hint: `${a} ÷ ${b} = ${fr(a, b)}: count ${a} jumps of ${fr(1, b)} from 0.`,
    explain: `${a} ÷ ${b} = ${fracAndMixed(a, b)}: ${a} jumps of ${fr(1, b)} from 0.`,
  };
}

/* ---------- Berry Patch: a fraction of a whole number (Lessons 6–8) ---------- */
function genFractionOf() {
  const variant = R(0, 3),
    name = pick(KIDS);
  if (variant <= 2) {
    /* a/b of n berries, with n a multiple of b */
    let a, b, n;
    do {
      b = pick([2, 3, 4, 5, 6, 8]);
      n = b * R(2, 6);
      a = variant === 0 ? 1 : R(2, b - 1);
    } while (variant > 0 && (b === 2 || gcd(a, b) !== 1));
    const part = n / b,
      answer = a * part;
    if (variant === 2)
      /* which expression has the same value as a/b × n */
      return {
        ...mcOf([
          [`${a} × (${n} ÷ ${b})`, null],
          [
            `${a} × ${n} × ${b}`,
            `That multiplies by ${b}. Taking ${fr(a, b)} of ${n} means dividing ${n} into ${b} parts.`,
          ],
          [`(${n} ÷ ${a}) × ${b}`, `That splits ${n} into ${a} parts. Split it into ${b} parts and take ${a} of them.`],
        ]),
        facts: { t: "ofExpr", a, b, n },
        prompt: `Which expression has the same value as ${fr(a, b)} × ${n}?`,
        fig: (show) => ofTape(n, b, a, show),
        hint: `${fr(a, b)} of ${n}: split ${n} into ${b} equal parts, then take ${a} of them.`,
        explain: `${n} ÷ ${b} = ${part} in each part, and ${a} parts: ${a} × (${n} ÷ ${b}) = ${a} × ${part} = ${answer}.`,
      };
    return {
      kind: "num",
      unit: "berries",
      answer,
      facts: { t: "of", a, b, n },
      prompt: `${name} picks ${n} berries. ${fr(a, b)} of them are strawberries. How many strawberries does ${name} pick?`,
      fig: (show) => ofTape(n, b, a, show),
      misc: miscOf(answer, [
        [n * b, `That multiplies ${n} by ${b}. ${fr(1, b)} of ${n} is ${n} split into ${b} equal parts: ${n} ÷ ${b}.`],
        ...(a > 1 ? [[part, `That’s ${fr(1, b)} of them. ${fr(a, b)} is ${a} of those parts.`]] : []),
        ...(a > 1 ? [[a * n, `That multiplies by ${a} but doesn’t divide by ${b}.`]] : []),
      ]).filter(([wrong]) => wrong !== answer),
      hint: `Split the ${n} berries into ${b} equal parts${a > 1 ? `, then take ${a} parts` : ""}.`,
      explain:
        a === 1
          ? `${fr(1, b)} × ${n} = ${n} ÷ ${b} = ${answer} strawberries.`
          : `${n} ÷ ${b} = ${part}, so ${fr(1, b)} of ${n} is ${part}. ${fr(a, b)} × ${n} = ${a} × ${part} = ${answer} strawberries.`,
    };
  }
  /* a/b of n pounds, where b doesn't go into n: the answer is a fraction */
  let a, b, n;
  do {
    b = pick([3, 4, 5, 6]);
    a = R(1, b - 1);
    n = R(2, 5);
  } while (n % b === 0 || gcd(a * n, b) !== 1);
  const answer = (a * n) / b;
  return {
    kind: "num",
    frac: true,
    unit: howMany(answer, "pound", "pounds"),
    answer,
    facts: { t: "ofFrac", a, b, n },
    prompt: `${name} has ${n} pounds of blueberries and uses ${fr(a, b)} of them in muffins. How many pounds is that?`,
    fig: (show) => poundsFig(n, show ? b : 1, show ? a : 0),
    misc: apart(answer, [
      [a * n, `That multiplies by ${a} but doesn’t divide by ${b}: ${a} × ${n} = ${a * n}, then ÷ ${b}.`],
      [
        a / (b * n),
        `That divides by ${n}. Take ${fr(a, b)} of each of the ${n} pounds: ${a} × ${n} pieces of ${fr(1, b)}.`,
      ],
    ]),
    hint: `${fr(a, b)} of each pound is ${a} pieces of ${fr(1, b)}. How many pieces in ${n} pounds?`,
    explain: `${fr(a, b)} × ${n} = ${fr(`${a} × ${n}`, b)} = ${fracAndMixed(a * n, b)} ${howMany(answer, "pound", "pounds")}.`,
  };
}

/* ---------- Picnic Blankets: area with a fraction side (Lessons 9–11) ---------- */
function genArea() {
  const variant = R(0, 2),
    name = pick(KIDS);
  if (variant <= 1) {
    /* a rectangle n by a/b, in a story or as a picture */
    let n, a, b;
    do {
      n = R(2, 5);
      b = pick([2, 3, 4, 5, 6]);
      a = R(1, b - 1);
    } while (gcd(a, b) !== 1);
    const answer = (n * a) / b;
    return {
      kind: "num",
      frac: true,
      unit:
        variant === 0
          ? howMany(answer, "square meter", "square meters")
          : howMany(answer, "square unit", "square units"),
      answer,
      facts: { t: "area", w: [n, 1], h: [a, b] },
      prompt:
        variant === 0
          ? `${name}’s picnic blanket is ${n} meters long and ${fr(a, b)} meter wide. What is its area?`
          : `Each square is 1 unit by 1 unit. What is the area of the shaded rectangle?`,
      fig: () => areaFig([n, 1], [a, b], { label: `A rectangle ${n} by ${a}/${b} on a grid of unit squares` }),
      misc: apart(answer, [
        [n + a / b, `That adds the sides. Area is length × width: ${n} × ${fr(a, b)}.`],
        [a / b, `That’s the part in one square. The rectangle covers ${fr(a, b)} of ${n} squares.`],
      ]),
      hint: `Each unit square is cut into ${b} parts. How many parts are shaded? Each is ${fr(1, b)} square unit.`,
      explain: `${n} × ${fr(a, b)} = ${fr(`${n} × ${a}`, b)} = ${fracAndMixed(n * a, b)}: ${n * a} parts of ${fr(1, b)}.`,
    };
  }
  /* a rectangle n by w a/b: the whole part and the fraction part */
  let n, whole, a, b;
  do {
    n = R(2, 4);
    whole = R(1, 2);
    b = pick([2, 3, 4, 5]);
    a = R(1, b - 1);
  } while (gcd(a, b) !== 1);
  const top = whole * b + a,
    answer = (n * top) / b;
  return {
    kind: "num",
    frac: true,
    unit: "square meters",
    answer,
    facts: { t: "area", w: [n, 1], h: [top, b] },
    prompt: `A picnic blanket is ${n} meters long and ${mixed(top, b)} meters wide. What is its area?`,
    fig: (show) =>
      areaFig([n, 1], [top, b], {
        split: show ? "h" : null,
        label: `A rectangle ${n} by ${whole} ${a}/${b} on a grid of unit squares`,
      }),
    misc: apart(answer, [
      [n * whole, `That’s only the ${n} × ${whole} part. Add the ${n} × ${fr(a, b)} strip on top.`],
      [
        n * whole + a / b,
        `That adds ${fr(a, b)} once. The ${fr(a, b)} strip runs along all ${n} meters: ${n} × ${fr(a, b)}.`,
      ],
    ]),
    hint: `Split the width: ${mixed(top, b)} = ${whole} + ${fr(a, b)}. Find ${n} × ${whole} and ${n} × ${fr(a, b)}, then add.`,
    explain: `${n} × ${whole} = ${n * whole}, and ${n} × ${fr(a, b)} = ${fracAndMixed(n * a, b)}. ${n * whole} + ${fr(n * a, b)} = ${mixed(n * top, b)} square meters.`,
  };
}

/* ---------- Garden Beds: split areas, and area stories (Lessons 12–15) ---------- */
function genDecompose() {
  const variant = R(0, 2),
    name = pick(KIDS);
  let n, whole, a, b;
  do {
    n = R(2, 5);
    whole = R(1, 3);
    b = pick([2, 3, 4, 5, 6]);
    a = R(1, b - 1);
  } while (gcd(a, b) !== 1 || n * whole > 12);
  const top = whole * b + a,
    answer = (n * top) / b;
  if (variant === 0) {
    /* which expression splits n × w a/b by place */
    return {
      ...mcOf([
        [`(${n} × ${whole}) + (${n} × ${fr(a, b)})`, null],
        [
          `(${n} × ${whole}) + ${fr(a, b)}`,
          `That multiplies only the ${whole} by ${n}. The ${fr(a, b)} gets multiplied by ${n} too.`,
        ],
        [
          `${n} × ${whole} × ${fr(a, b)}`,
          `That multiplies by ${fr(a, b)}. ${mixed(top, b)} is ${whole} + ${fr(a, b)}: multiply each part, then add.`,
        ],
      ]),
      facts: { t: "splitExpr", n, whole, a, b },
      prompt: `Which expression has the same value as ${n} × ${mixed(top, b)}?`,
      fig: (show) =>
        areaFig([top, b], [n, 1], { split: show ? "w" : null, label: `A rectangle ${whole} ${a}/${b} by ${n}` }),
      hint: `${mixed(top, b)} = ${whole} + ${fr(a, b)}. Multiply each part by ${n}.`,
      explain: `${n} × ${mixed(top, b)} = (${n} × ${whole}) + (${n} × ${fr(a, b)}) = ${n * whole} + ${fr(n * a, b)} = ${mixed(n * top, b)}.`,
    };
  }
  if (variant === 1) {
    /* a garden bed n by w a/b meters */
    return {
      kind: "num",
      frac: true,
      unit: "square meters",
      answer,
      facts: { t: "area", w: [top, b], h: [n, 1] },
      prompt: `${name}’s garden bed is ${mixed(top, b)} meters long and ${n} meters wide. What is its area?`,
      fig: (show) =>
        areaFig([top, b], [n, 1], { split: show ? "w" : null, label: `A rectangle ${whole} ${a}/${b} by ${n}` }),
      misc: apart(answer, [
        [n * whole, `That leaves out the ${fr(a, b)}. Add ${n} × ${fr(a, b)} too.`],
        [
          n * whole + a / b,
          `That adds ${fr(a, b)} once. Multiply it by ${n} too: ${n} × ${fr(a, b)} = ${fr(n * a, b)}.`,
        ],
        [n + whole + a / b, "That adds the sides. Area is length × width."],
      ]),
      hint: `Split ${mixed(top, b)} into ${whole} + ${fr(a, b)}. Multiply each part by ${n}, then add.`,
      explain: `(${n} × ${whole}) + (${n} × ${fr(a, b)}) = ${n * whole} + ${fr(n * a, b)} = ${mixed(n * top, b)} square meters.`,
    };
  }
  /* a long, thin path: n × a/b with an answer more than 1 */
  let length, part, den;
  do {
    length = R(3, 8);
    den = pick([2, 3, 4, 5, 6]);
    part = R(1, den - 1);
  } while (gcd(part, den) !== 1 || (length * part) % den === 0 || length * part < den);
  const area = (length * part) / den;
  return {
    kind: "num",
    frac: true,
    unit: "square meters",
    answer: area,
    facts: { t: "area", w: [length, 1], h: [part, den] },
    prompt: `A garden path is ${length} meters long and ${fr(part, den)} meter wide. What is its area?`,
    fig: () => areaFig([length, 1], [part, den], { label: `A rectangle ${length} by ${part}/${den}` }),
    misc: apart(area, [
      [length + part / den, `That adds the sides. Area is length × width: ${length} × ${fr(part, den)}.`],
      [
        part / (length * den),
        `That divides by ${length}. Each meter of path has ${fr(part, den)} square meter: multiply.`,
      ],
    ]),
    hint: `Each meter of the path is ${fr(part, den)} square meter. There are ${length} meters.`,
    explain: `${length} × ${fr(part, den)} = ${fr(length * part, den)} = ${mixed(length * part, den)} square meters.`,
  };
}

/* ---------- Kite Festival: the final round ---------- */
const genBoss = () => pick([genShare, genStories, genFractionOf, genArea, genDecompose])();

const ZONES = [
  {
    id: "share",
    name: "Sandwich Table",
    lessons: "Lessons 1–3",
    blurb: "Share sandwiches equally, and see that a ÷ b is the fraction a/b.",
    gen: genShare,
  },
  {
    id: "stories",
    name: "Lemonade Stand",
    lessons: "Lessons 4–5",
    blurb: "Split lemonade, rope, and trails into equal parts, with fractions and mixed numbers.",
    gen: genStories,
  },
  {
    id: "of",
    name: "Berry Patch",
    lessons: "Lessons 6–8",
    blurb: "Find a fraction of a whole number: divide into equal parts, then take some.",
    gen: genFractionOf,
  },
  {
    id: "area",
    name: "Picnic Blankets",
    lessons: "Lessons 9–11",
    blurb: "Find areas of rectangles with a side that’s a fraction or a mixed number.",
    gen: genArea,
  },
  {
    id: "decompose",
    name: "Garden Beds",
    lessons: "Lessons 12–15",
    blurb: "Split a mixed number to multiply, and solve area stories.",
    gen: genDecompose,
  },
  {
    id: "boss",
    name: "Kite Festival",
    lessons: "All lessons",
    blurb: "Fly the kites! Every right answer sends another kite up into the sky.",
    gen: genBoss,
  },
];

/* the sky with `flying` of its 10 kites up, in two rows of 5 (the boss icon flies all of them) */
const kites = (flying) =>
  range(10)
    .map((i) => {
      const x = 8 + (i % 5) * 12,
        y = i < 5 ? 14 : 34,
        color = ["#ffc93c", "#7fe3ff", "#ff8ac4", "#5fe0a8"][i % 4];
      return i < flying
        ? `<path d="M${x},${y - 6}L${x + 5},${y}L${x},${y + 6}L${x - 5},${y}Z" fill="${color}" stroke="#0a2340" stroke-width="1"/><path d="M${x},${y + 6}Q${x + 3},${y + 12} ${x},${y + 16}" fill="none" stroke="#f3f6fb" stroke-width="1"/>`
        : `<circle cx="${x}" cy="${y}" r="2" fill="rgba(243,246,251,.3)"/>`;
    })
    .join("") + '<path d="M2,60H62" stroke="#5fe0a8" stroke-width="3"/>';
const ICON = {
  share:
    '<g stroke="#8a6a2c" stroke-width="2"><rect x="6" y="14" width="52" height="18" rx="5" fill="#e9d2a0"/><rect x="6" y="38" width="52" height="18" rx="5" fill="#e9d2a0"/><rect x="6" y="14" width="17" height="18" rx="4" fill="#ffc93c"/><rect x="6" y="38" width="17" height="18" rx="4" fill="#ffc93c"/></g><path d="M23,16V30M40,16V30M23,40V54M40,40V54" stroke="#5b4520" stroke-width="2" stroke-dasharray="3 2"/>',
  stories:
    '<path d="M18,14H46L42,58H22Z" fill="rgba(127,227,255,.25)" stroke="#7fe3ff" stroke-width="2"/><path d="M20,30H44L42,58H22Z" fill="#ffe08a"/><circle cx="30" cy="40" r="3" fill="#fff"/><circle cx="36" cy="48" r="2" fill="#fff"/><path d="M46,20h8v14h-8" fill="none" stroke="#7fe3ff" stroke-width="2"/>',
  of: '<g fill="#c9584b" stroke="#0a2340" stroke-width="1"><circle cx="16" cy="24" r="7"/><circle cx="32" cy="24" r="7"/><circle cx="48" cy="24" r="7"/></g><g fill="#5a6fd6" stroke="#0a2340" stroke-width="1"><circle cx="16" cy="44" r="7"/><circle cx="32" cy="44" r="7"/><circle cx="48" cy="44" r="7"/></g><path d="M8,34H56" stroke="#f3f6fb" stroke-width="1.5" stroke-dasharray="3 2"/>',
  area: '<rect x="8" y="12" width="48" height="40" fill="none" stroke="#f3f6fb" stroke-width="2"/><rect x="8" y="32" width="48" height="20" fill="#ffc93c"/><path d="M24,12V52M40,12V52M8,32H56" stroke="#0a2340" stroke-width="1.5"/><path d="M8,42H56" stroke="#0a2340" stroke-width="1" stroke-dasharray="2 2"/>',
  decompose:
    '<rect x="6" y="14" width="36" height="36" fill="#ffc93c" stroke="#0a2340" stroke-width="1.5"/><rect x="42" y="14" width="16" height="36" fill="#7fe3ff" stroke="#0a2340" stroke-width="1.5"/><path d="M14,58l4,-6l4,6M30,58l4,-6l4,6" fill="none" stroke="#5fe0a8" stroke-width="2"/>',
  boss: kites(10),
};
