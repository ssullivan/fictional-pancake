/* Community Garden (Grade 5 Unit 3): the problem generators, station list, and icons. Loaded by index.html and by
   tools/fuzz.mjs. Rectangles on a grid of unit squares (areaFig) come from shared/fractions.js; dividing with strips from
   figs.js; fr and mixed from shared/pictures.js; mcOf, miscOf, and gcd from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Every problem also
   carries facts for checks.js: its kind (t) and the numbers it was made from, so the answer can be worked out again. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* the denominators of the fractions multiplied or divided: products have denominators up to 36 */
const FACTOR_DEN = [2, 3, 4, 5, 6];
/* n/d in lowest terms, as html: written n/d when it simplifies, then "= " its lowest terms */
const simplest = (n, d) => {
  const g = gcd(n, d);
  return g === 1 ? fr(n, d) : d === g ? `${fr(n, d)} = ${n / g}` : `${fr(n, d)} = ${fr(n / g, d / g)}`;
};
/* Named mistakes for a typed fraction, leaving out any that aren't positive or are so close to the answer that the engine
   would count them right (it accepts answers within 0.011) */
const apart = (answer, list) =>
  miscOf(
    answer,
    list.filter(([value]) => value > 0 && Math.abs(value - answer) > 0.02),
  );
/* two different denominators for unit fractions */
const twoDen = () => shuffle(FACTOR_DEN).slice(0, 2);
/* a/b × c/d of a unit square: the square cut into b columns and d rows, c/d of it lightly shaded and a/b of that dark */
const productFig = (a, b, c, d) =>
  areaFig([a, b], [c, d], { under: true, label: `${a}/${b} of ${c}/${d} of a unit square` });

/* ---------- Seed Trays: a unit fraction of a unit fraction (Lessons 1–4) ---------- */
function genPiece() {
  const variant = R(0, 2),
    [a, b] = twoDen(),
    answer = 1 / (a * b);
  if (variant === 2) {
    /* which expression matches the picture */
    return {
      ...mcOf([
        [`${fr(1, a)} × ${fr(1, b)}`, null],
        [
          `${fr(1, a)} + ${fr(1, b)}`,
          `That joins two pieces. The dark piece is ${fr(1, a)} of the ${fr(1, b)} strip: multiply.`,
        ],
        [`${fr(1, a)} × ${b}`, `That’s ${b} groups of ${fr(1, a)}. The dark piece is ${fr(1, a)} of ${fr(1, b)}.`],
      ]),
      facts: { t: "pieceExpr", a, b },
      prompt: `The light strip is ${fr(1, b)} of the square. The dark piece is ${fr(1, a)} of the strip. Which expression shows the dark piece?`,
      fig: () => productFig(1, a, 1, b),
      hint: `“${fr(1, a)} of” something means ${fr(1, a)} × it.`,
      explain: `The dark piece is ${fr(1, a)} of ${fr(1, b)}: ${fr(1, a)} × ${fr(1, b)} = ${fr(1, a * b)} of the square.`,
    };
  }
  const name = pick(KIDS);
  return {
    kind: "num",
    frac: true,
    unit: variant === 0 ? "" : "of the garden",
    answer,
    facts: { t: "piece", a, b },
    prompt:
      variant === 0
        ? `What is ${fr(1, a)} × ${fr(1, b)}?`
        : `${fr(1, b)} of ${name}’s garden is for vegetables. ${fr(1, a)} of the vegetable part is carrots. What fraction of the whole garden is carrots?`,
    fig: (show) =>
      variant === 0 || show ? productFig(1, a, 1, b) : areaFig([1, 1], [1, b], { label: `${1}/${b} of a square` }),
    misc: apart(answer, [
      [1 / (a + b), `That adds the denominators. The square is cut into ${a} × ${b} = ${a * b} pieces.`],
      [
        1 / a + 1 / b,
        `That adds ${fr(1, a)} and ${fr(1, b)}. Taking ${fr(1, a)} of ${fr(1, b)} makes a smaller piece: multiply.`,
      ],
    ]),
    hint: `Cut the ${fr(1, b)} strip into ${a} equal pieces. How many pieces that size make the whole square?`,
    explain: `${fr(1, a)} of ${fr(1, b)} is 1 of ${a} × ${b} = ${a * b} equal pieces: ${fr(1, a)} × ${fr(1, b)} = ${fr(1, a * b)}.`,
  };
}

/* ---------- Flower Beds: multiply any fractions (Lessons 5–8) ---------- */
/* a/b and c/d, both less than 1, not both unit fractions */
function twoFractions() {
  let a, b, c, d;
  do {
    [b, d] = [pick(FACTOR_DEN), pick(FACTOR_DEN)];
    a = R(1, b - 1);
    c = R(1, d - 1);
  } while ((a === 1 && c === 1) || gcd(a, b) !== 1 || gcd(c, d) !== 1);
  return [a, b, c, d];
}
/* stories for a/b of c/d: [the story, the unit of the answer] */
const OF_STORIES = [
  [
    (a, b, c, d) =>
      `${fr(c, d)} of a garden bed is planted. ${fr(a, b)} of the planted part is tulips. What fraction of the bed is tulips?`,
    "of the bed",
  ],
  [
    (a, b, c, d) =>
      `The garden path is ${fr(c, d)} mile long. ${fr(a, b)} of it is paved. How many miles of the path are paved?`,
    "mile",
  ],
  [
    (a, b, c, d) =>
      `A watering can holds ${fr(c, d)} gallon. A plant gets ${fr(a, b)} of the can. How many gallons does the plant get?`,
    "gallon",
  ],
];
function genMultiply() {
  const variant = R(0, 3),
    [a, b, c, d] = twoFractions(),
    answer = (a * c) / (b * d);
  if (variant === 2) {
    /* which fraction is equal to the product: the wrong ones add the tops, take all of one fraction, or keep one bottom */
    const wrongs = [
      [a + c, b * d, `That adds the tops. Multiply them: ${a} × ${c}.`],
      [c, d, `That’s all of ${fr(c, d)}. Take ${fr(a, b)} of it.`],
      [a, b, `That’s all of ${fr(a, b)}. Take ${fr(c, d)} of it.`],
      [a * c, b, `That multiplies only the tops. Multiply the bottoms too: ${b} × ${d}.`],
    ].filter(([n, m], i, all) => n * b * d !== a * c * m && all.findIndex(([n2, m2]) => n2 * m === n * m2) === i);
    return {
      ...mcOf([[fr(a * c, b * d), null], ...wrongs.slice(0, 2).map(([n, m, why]) => [fr(n, m), why])]),
      facts: { t: "productExpr", a, b, c, d },
      prompt: `Which fraction is equal to ${fr(a, b)} × ${fr(c, d)}?`,
      fig: (show) =>
        show
          ? productFig(a, b, c, d)
          : areaFig([b, b], [d, d], { labels: false, label: `A unit square cut into ${b} columns and ${d} rows` }),
      hint: `Cut a square into ${b} columns and ${d} rows. How many pieces is that, and how many are in ${a} columns of ${c} rows?`,
      explain: `${fr(a, b)} × ${fr(c, d)} = ${fr(`${a} × ${c}`, `${b} × ${d}`)} = ${simplest(a * c, b * d)}.`,
    };
  }
  if (variant === 3) {
    /* is the product more or less than one factor */
    return {
      ...mcOf([
        [`Less than ${fr(c, d)}`, null],
        [
          `More than ${fr(c, d)}`,
          `Multiplying makes a number bigger only when you multiply by more than 1. ${fr(a, b)} is less than 1.`,
        ],
        [`Equal to ${fr(c, d)}`, `It would be equal only if you multiplied by 1. ${fr(a, b)} is less than 1.`],
      ]),
      facts: { t: "size", a, b, c, d },
      prompt: `Without working it out: is ${fr(a, b)} × ${fr(c, d)} more than, less than, or equal to ${fr(c, d)}?`,
      hint: `${fr(a, b)} × ${fr(c, d)} means ${fr(a, b)} of ${fr(c, d)}. Is ${fr(a, b)} of something more or less than all of it?`,
      explain: `${fr(a, b)} of ${fr(c, d)} is only part of ${fr(c, d)}, so it’s less: ${simplest(a * c, b * d)}.`,
    };
  }
  const [story, unit] = variant === 1 ? pick(OF_STORIES) : [null, ""];
  return {
    kind: "num",
    frac: true,
    unit,
    answer,
    facts: { t: "product", a, b, c, d },
    prompt: variant === 0 ? `What is ${fr(a, b)} × ${fr(c, d)}?` : story(a, b, c, d),
    fig: () => productFig(a, b, c, d),
    misc: apart(answer, [
      [(a + c) / (b + d), "That adds the tops and the bottoms. Multiply them instead."],
      [(a * c) / (b + d), `That adds the bottoms. The square is cut into ${b} × ${d} = ${b * d} pieces.`],
      [c / d, `That’s all of ${fr(c, d)}. Take ${fr(a, b)} of it.`],
    ]),
    hint: `The square is cut into ${b} × ${d} = ${b * d} pieces. The dark part is ${a} × ${c} of them.`,
    explain: `${fr(a, b)} × ${fr(c, d)} = ${fr(`${a} × ${c}`, `${b} × ${d}`)} = ${simplest(a * c, b * d)}${unit && unit !== "of the bed" ? ` ${unit}` : ""}.`,
  };
}

/* ---------- Seed Packets: a unit fraction ÷ a whole number (Lessons 11–12) ---------- */
/* things shared: [the story for 1/b shared by n, the unit] */
const SHARE_STORIES = [
  [
    (b, n, name) =>
      `${name} has ${fr(1, b)} pound of seeds to share equally among ${n} pots. How much does each pot get?`,
    "pound",
  ],
  [
    (b, n, name) =>
      `${name} pours ${fr(1, b)} liter of water equally into ${n} seed trays. How much does each tray get?`,
    "liter",
  ],
  [
    (b, n, name) =>
      `${n} friends share ${fr(1, b)} of a pan of garden pizza equally. What fraction of the pan does each get?`,
    "of the pan",
  ],
];
function genDivUnit() {
  const variant = R(0, 2),
    name = pick(KIDS);
  let b, n;
  do {
    b = pick(FACTOR_DEN);
    n = R(2, 5);
  } while (b * n > 30);
  const answer = 1 / (b * n);
  if (variant === 2) {
    /* which expression fits a story */
    const [story] = pick(SHARE_STORIES);
    return {
      ...mcOf([
        [`${fr(1, b)} ÷ ${n}`, null],
        [
          `${n} ÷ ${fr(1, b)}`,
          `That asks how many ${fr(1, b)}s fit in ${n}. Here ${fr(1, b)} is being shared by ${n}.`,
        ],
        [
          `${fr(1, b)} × ${n}`,
          `That’s ${n} groups of ${fr(1, b)}, more than you started with. Sharing makes each part smaller.`,
        ],
      ]),
      facts: { t: "divUnitExpr", b, n },
      prompt: `${story(b, n, name)} Which expression fits?`,
      hint: `What is being shared, and by how many?`,
      explain: `${fr(1, b)} shared equally by ${n} is ${fr(1, b)} ÷ ${n} = ${fr(1, b * n)}.`,
    };
  }
  const [story, unit] = pick(SHARE_STORIES);
  return {
    kind: "num",
    frac: true,
    unit: variant === 0 ? "" : unit,
    answer,
    facts: { t: "divUnit", b, n },
    prompt: variant === 0 ? `What is ${fr(1, b)} ÷ ${n}?` : story(b, n, name),
    fig: (show) => divUnitFig(b, n, { cut: show }),
    misc: apart(answer, [
      [n / b, `That multiplies: ${n} × ${fr(1, b)}. Sharing ${fr(1, b)} makes smaller pieces.`],
      [b * n, `That’s ${n} ÷ ${fr(1, b)}, how many ${fr(1, b)}s fit in ${n}. Here ${fr(1, b)} is cut into ${n} parts.`],
    ]),
    hint: `Cut the ${fr(1, b)} into ${n} equal pieces. If every ${fr(1, b)} of the whole were cut that way, how many pieces would the whole have?`,
    explain: `Cutting each ${fr(1, b)} into ${n} pieces cuts the whole into ${b} × ${n} = ${b * n} pieces. ${fr(1, b)} ÷ ${n} = ${fr(1, b * n)}.`,
  };
}

/* ---------- Watering Cans: a whole number ÷ a unit fraction (Lessons 13–14) ---------- */
/* stories for how many 1/b in n: [the story, the unit] */
const HOW_MANY_STORIES = [
  [(n, b) => `A watering can holds ${n} liters. How many ${fr(1, b)}-liter scoops fill it?`, "scoops"],
  [
    (n, b) =>
      `A garden row is ${n} meters long. A seed goes in every ${fr(1, b)} meter. How many ${fr(1, b)}-meter spaces is that?`,
    "spaces",
  ],
  [(n, b) => `${n} pounds of potatoes are packed in bags of ${fr(1, b)} pound each. How many bags is that?`, "bags"],
];
function genDivWhole() {
  const variant = R(0, 2),
    n = R(2, 6),
    b = pick(FACTOR_DEN),
    answer = n * b;
  if (variant === 2) {
    /* which expression fits a story */
    const [story] = pick(HOW_MANY_STORIES);
    return {
      ...mcOf([
        [`${n} ÷ ${fr(1, b)}`, null],
        [`${fr(1, b)} ÷ ${n}`, `That shares ${fr(1, b)} among ${n}. Here you count how many ${fr(1, b)}s fit in ${n}.`],
        [`${n} × ${fr(1, b)}`, `That’s ${fr(1, b)} of ${n}. Here you count how many ${fr(1, b)}s fit in ${n}.`],
      ]),
      facts: { t: "divWholeExpr", n, b },
      prompt: `${story(n, b)} Which expression fits?`,
      hint: `“How many ${fr(1, b)}s are in ${n}?” is a division.`,
      explain: `How many ${fr(1, b)}s fit in ${n}: ${n} ÷ ${fr(1, b)} = ${answer}.`,
    };
  }
  const [story, unit] = pick(HOW_MANY_STORIES);
  return {
    kind: "num",
    unit: variant === 0 ? "" : unit,
    answer,
    facts: { t: "divWhole", n, b },
    prompt: variant === 0 ? `What is ${n} ÷ ${fr(1, b)}?` : story(n, b),
    fig: (show) =>
      show ? divWholeFig(n, b) : strips([{ d: 1, k: n, parts: false }], { wholes: n, label: `${n} wholes` }),
    misc: apart(answer, [
      [n / b, `That’s ${n} × ${fr(1, b)}. Count how many ${fr(1, b)}s fit in ${n}: each whole holds ${b}.`],
      [n + b, `That adds. Each of the ${n} wholes holds ${b}: multiply.`],
      [1 / (n * b), `That’s ${fr(1, b)} ÷ ${n}. Here ${n} is cut into pieces of ${fr(1, b)}.`],
    ]),
    hint: `How many ${fr(1, b)}s fit in 1 whole? Then in ${n} wholes?`,
    explain: `Each whole holds ${b} ${fr(1, b)}s, so ${n} wholes hold ${n} × ${b} = ${answer}. ${n} ÷ ${fr(1, b)} = ${answer}.`,
  };
}

/* ---------- Garden Shed: multiply or divide? (Lessons 15–19) ---------- */
function genWhich() {
  const variant = R(0, 2),
    n = R(2, 6),
    b = pick(FACTOR_DEN);
  if (variant === 0) {
    /* which is greater than n, without working it out */
    return {
      ...mcOf([
        [`${n} ÷ ${fr(1, b)}`, null],
        [`${n} × ${fr(1, b)}`, `That’s ${fr(1, b)} of ${n}: less than ${n}.`],
        [`${fr(1, b)} ÷ ${n}`, `That shares ${fr(1, b)}, which is already less than 1: tiny.`],
      ]),
      facts: { t: "greater", n, b },
      prompt: `Without working it out: which is greater than ${n}?`,
      hint: `Dividing by ${fr(1, b)} asks how many ${fr(1, b)}s fit. Are there more or fewer than ${n}?`,
      explain: `${n} ÷ ${fr(1, b)} counts the ${fr(1, b)}s in ${n}: ${n * b}, more than ${n}. ${n} × ${fr(1, b)} = ${fr(n, b)} and ${fr(1, b)} ÷ ${n} = ${fr(1, b * n)} are less.`,
    };
  }
  /* a story: which kind it is decides the operation */
  const kind = pick(["share", "howMany", "of"]),
    name = pick(KIDS),
    [a, d] = twoDen(),
    stories = {
      share: [
        `${name} shares ${fr(1, b)} pound of soil equally among ${n} flower pots. How much soil does each pot get?`,
        `${fr(1, b)} ÷ ${n}`,
        1 / (b * n),
        "pound",
      ],
      howMany: [`How many ${fr(1, b)}-cup scoops of compost are in ${n} cups?`, `${n} ÷ ${fr(1, b)}`, n * b, "scoops"],
      of: [
        `${fr(1, d)} of the garden is herbs. ${fr(1, a)} of the herbs are basil. What fraction of the garden is basil?`,
        `${fr(1, a)} × ${fr(1, d)}`,
        1 / (a * d),
        "of the garden",
      ],
    },
    [story, expr, answer, unit] = stories[kind];
  if (variant === 1) {
    /* which expression fits the story */
    const others = Object.entries(stories).filter(([k]) => k !== kind);
    return {
      ...mcOf([
        [expr, null],
        ...others.map(([k, [, other]]) => [
          other,
          {
            share: "That shares a fraction among some people or things.",
            howMany: "That counts how many fractions fit in a whole number.",
            of: "That takes a fraction of a fraction.",
          }[k] + " Read the question again: what does it ask for?",
        ]),
      ]),
      facts: { t: "which", kind, n, b, a, d },
      prompt: `${story} Which expression fits?`,
      hint: "Is something shared, are you counting how many fit, or are you taking part of a part?",
      explain: `${expr} = ${kind === "howMany" ? answer : kind === "share" ? fr(1, b * n) : fr(1, a * d)}.`,
    };
  }
  /* solve the story */
  return {
    kind: "num",
    frac: kind !== "howMany",
    unit,
    answer,
    facts: { t: "solve", kind, n, b, a, d },
    prompt: story,
    misc: apart(answer, [
      ...(kind === "share"
        ? [[n / b, `That multiplies. Sharing ${fr(1, b)} among ${n} makes smaller parts: ${fr(1, b)} ÷ ${n}.`]]
        : []),
      ...(kind === "howMany"
        ? [[n / b, `That’s ${fr(1, b)} of ${n}. Count how many ${fr(1, b)}s fit in ${n}: ${n} ÷ ${fr(1, b)}.`]]
        : []),
      ...(kind === "of"
        ? [[1 / (a + d), `That adds the denominators. ${fr(1, a)} × ${fr(1, d)}: multiply them.`]]
        : []),
    ]),
    hint: "Is something shared, are you counting how many fit, or are you taking part of a part?",
    explain: `${expr} = ${kind === "howMany" ? answer : kind === "share" ? fr(1, b * n) : fr(1, a * d)}${kind === "howMany" ? ` ${unit}` : ""}.`,
  };
}

/* ---------- Harvest Fair: the final round ---------- */
const genBoss = () => pick([genPiece, genMultiply, genDivUnit, genDivWhole, genWhich])();

const ZONES = [
  {
    id: "piece",
    name: "Seed Trays",
    lessons: "Lessons 1–4",
    blurb: "Take a unit fraction of a unit fraction: a piece of one part.",
    gen: genPiece,
  },
  {
    id: "multiply",
    name: "Flower Beds",
    lessons: "Lessons 5–8",
    blurb: "Multiply any two fractions on an area diagram, and in stories.",
    gen: genMultiply,
  },
  {
    id: "divunit",
    name: "Seed Packets",
    lessons: "Lessons 11–12",
    blurb: "Share a unit fraction equally: divide it by a whole number.",
    gen: genDivUnit,
  },
  {
    id: "divwhole",
    name: "Watering Cans",
    lessons: "Lessons 13–14",
    blurb: "Count how many unit fractions fit in a whole number.",
    gen: genDivWhole,
  },
  {
    id: "which",
    name: "Garden Shed",
    lessons: "Lessons 15–19",
    blurb: "Decide whether a story multiplies or divides, and how big the answer is.",
    gen: genWhich,
  },
  {
    id: "boss",
    name: "Harvest Fair",
    lessons: "All lessons",
    blurb: "Fill the prize basket! Every right answer adds another vegetable.",
    gen: genBoss,
  },
];

/* the prize basket with `picked` of its 10 vegetables in it (the boss icon fills it) */
const basket = (picked) =>
  range(10)
    .map((i) => {
      const x = 12 + (i % 5) * 10,
        y = i < 5 ? 36 : 26,
        color = ["#ff7a59", "#5fe0a8", "#ffc93c", "#c9584b", "#a77bff"][i % 5];
      return i < picked
        ? `<circle cx="${x}" cy="${y}" r="5.5" fill="${color}" stroke="#0a2340" stroke-width="1"/>`
        : "";
    })
    .join("") +
  '<path d="M4,38H60L54,58H10Z" fill="#b5803e" stroke="#0a2340" stroke-width="1.5"/><path d="M10,44H54M12,50H52" stroke="#8a5a26" stroke-width="2"/><path d="M14,38Q32,8 50,38" fill="none" stroke="#b5803e" stroke-width="3"/>';
const ICON = {
  piece:
    '<rect x="10" y="10" width="44" height="44" fill="rgba(169,196,228,.1)" stroke="#f3f6fb" stroke-width="2"/><rect x="10" y="40" width="44" height="14" fill="rgba(127,227,255,.35)"/><rect x="10" y="40" width="22" height="14" fill="#ffc93c"/><path d="M32,10V54M10,40H54" stroke="#f3f6fb" stroke-width="1.5"/>',
  multiply:
    '<rect x="10" y="10" width="44" height="44" fill="rgba(169,196,228,.1)" stroke="#f3f6fb" stroke-width="2"/><rect x="10" y="21" width="44" height="33" fill="rgba(127,227,255,.35)"/><rect x="10" y="21" width="29" height="33" fill="#ffc93c"/><path d="M25,10V54M39,10V54M10,21H54M10,32H54M10,43H54" stroke="#0a2340" stroke-width="1"/>',
  divunit:
    '<rect x="6" y="14" width="52" height="14" fill="none" stroke="#f3f6fb" stroke-width="2"/><rect x="6" y="14" width="17" height="14" fill="#ffc93c" stroke="#f3f6fb" stroke-width="2"/><path d="M40,14V28" stroke="#f3f6fb" stroke-width="2"/><rect x="6" y="36" width="52" height="14" fill="none" stroke="#f3f6fb" stroke-width="2"/><rect x="6" y="36" width="8.5" height="14" fill="#7fe3ff" stroke="#f3f6fb" stroke-width="2"/>',
  divwhole:
    '<path d="M16,26H44L40,56H20Z" fill="#7fe3ff" stroke="#0a2340" stroke-width="1.5"/><path d="M44,32L56,22" stroke="#7fe3ff" stroke-width="4" stroke-linecap="round"/><path d="M14,26Q30,6 46,26" fill="none" stroke="#7fe3ff" stroke-width="3"/>',
  which:
    '<path d="M8,28L32,10L56,28V56H8Z" fill="#c9584b" stroke="#0a2340" stroke-width="1.5"/><rect x="24" y="36" width="16" height="20" fill="#0a2340"/><text x="32" y="30" fill="#f3f6fb" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">× ÷</text>',
  boss: basket(10),
};
