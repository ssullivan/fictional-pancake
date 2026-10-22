/* Moving Up Day (Grade 5 Unit 8): the problem generators, station list, and icons. Loaded by index.html and by
   tools/fuzz.mjs. The standard algorithm, partial quotients, place-value charts, and commas come from shared/blocks.js; boxes of
   cubes from shared/shapes.js; fraction strips and squares cut into parts from shared/fractions.js; fr and mixed from
   shared/pictures.js; mcOf, miscOf, gcd, and lcm from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Every problem also
   carries facts for checks.js: its kind (t) and the numbers it was made from, so the answer can be worked out again. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* how many nonzero digits n has */
const nonzero = (n) => String(n).replace(/[^1-9]/g, "").length;
/* a number as written: commas in whole numbers, decimals as short as they go */
const num = (v) => (Number.isInteger(v) ? commas(v) : String(+v.toFixed(3)));
/* named mistakes, leaving out any that aren't positive or that the game would count as right */
const apart = (answer, list) =>
  miscOf(
    answer,
    list.filter(([wrong]) => wrong > 0 && Math.abs(wrong - answer) > 0.006),
  );
/* n/d in lowest terms as html, as a mixed number when it's more than 1 */
const nice = (n, d) => {
  const g = gcd(n, d);
  return mixed(n / g, d / g);
};

/* ---------- Number Booth: multiply whole numbers (Lessons 1–3) ---------- */
/* every way to make two 2-digit numbers from four digits: [first, second] */
const arrangements = (digits) =>
  [
    [0, 1, 2, 3],
    [0, 2, 1, 3],
    [0, 3, 1, 2],
    [1, 0, 2, 3],
    [2, 0, 1, 3],
    [3, 0, 1, 2],
  ].map(([a, b, c, d]) => [digits[a] * 10 + digits[b], digits[c] * 10 + digits[d]]);
function genProducts() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* the largest product from four digit cards */
    let digits;
    do digits = shuffle(range(8).map((i) => i + 2)).slice(0, 4);
    while (new Set(arrangements(digits).map(([a, b]) => a * b)).size < 6);
    const ways = arrangements(digits).sort((p, q) => q[0] * q[1] - p[0] * p[1]),
      [best, ...rest] = ways,
      picked = [rest[0], rest[rest.length - 1]];
    return {
      ...mcOf([
        [`${best[0]} × ${best[1]}`, null],
        ...picked.map(([a, b]) => [
          `${a} × ${b}`,
          `${a} × ${b} = ${commas(a * b)}, less than ${best[0]} × ${best[1]} = ${commas(best[0] * best[1])}.`,
        ]),
      ]),
      facts: { t: "largest", digits },
      prompt: `Use the digit cards ${[...digits].sort().join(", ")} once each to make two 2-digit numbers. Which product is the largest?`,
      hint: "Put the biggest digits in the tens places. Then try both ways to place the other two digits.",
      explain: `${best[0]} × ${best[1]} = ${commas(best[0] * best[1])}, the largest you can make.`,
    };
  }
  if (variant === 1) {
    /* a 3-digit × 2-digit product with the standard algorithm */
    let a, b;
    do {
      a = R(101, 999);
      b = R(11, 99);
    } while (nonzero(a) > 2 || b % 10 === 0 || nonzero(a * b) > 4 || a * b > 60000);
    const [onesRow, tensRow, product] = mul2Steps(a, b);
    return {
      kind: "num",
      unit: "",
      answer: product,
      facts: { t: "product", a, b },
      prompt: `What is ${a} × ${b}?`,
      fig: (show) => mul2Fig(a, b, show ? 3 : 0),
      misc: apart(product, [
        [
          onesRow + tensRow / 10,
          `That leaves out the 0 in the second row: ${a} × ${Math.floor(b / 10) * 10} = ${commas(tensRow)}.`,
        ],
        [onesRow, `That’s only ${a} × ${b % 10}. Add ${a} × ${Math.floor(b / 10) * 10} too.`],
      ]),
      hint: `First row: ${a} × ${b % 10}. Second row: ${a} × ${Math.floor(b / 10) * 10}. Add them.`,
      explain: `${commas(onesRow)} + ${commas(tensRow)} = ${commas(product)}.`,
    };
  }
  /* a friendly factor first: 25 × 36 = 25 × 4 × 9 */
  const [friendlyFactor, partner] = pick([
      [25, 4],
      [50, 2],
      [125, 8],
    ]),
    other = partner * R(2, 9),
    rest = other / partner,
    answer = friendlyFactor * other;
  return {
    kind: "num",
    unit: "",
    answer,
    facts: { t: "product", a: friendlyFactor, b: other },
    prompt: `Find ${friendlyFactor} × ${other}. Hint from the booth: ${other} = ${partner} × ${rest}.`,
    misc: apart(answer, [
      [friendlyFactor * partner, `That’s ${friendlyFactor} × ${partner}. Multiply by ${rest} too.`],
      [friendlyFactor + other, "That adds. Multiply."],
    ]),
    hint: `${friendlyFactor} × ${partner} = ${commas(friendlyFactor * partner)}. Then multiply by ${rest}.`,
    explain: `${friendlyFactor} × ${other} = ${friendlyFactor} × ${partner} × ${rest} = ${commas(friendlyFactor * partner)} × ${rest} = ${commas(answer)}.`,
  };
}

/* ---------- Division Dash: divide whole numbers (Lessons 4–5) ---------- */
const DIVISORS = [12, 15, 20, 25, 30, 40, 50];
function genQuotients() {
  const variant = R(0, 1),
    name = pick(KIDS);
  let d, q;
  do {
    d = pick(DIVISORS);
    q = R(12, 99);
  } while (d * q > 2500 || q % 10 === 0);
  const n = d * q,
    chunks = [Math.floor(q / 10) * 10, q % 10];
  return {
    kind: "num",
    unit: variant ? "boxes" : "",
    answer: q,
    facts: { t: "quotient", n, d },
    prompt: variant
      ? `${name} packs ${commas(n)} moving-up-day cupcakes in boxes of ${d}. How many boxes does that fill?`
      : `What is ${commas(n)} ÷ ${d}?`,
    fig: (show) => quotientFig(n, d, chunks, show ? Infinity : 0),
    misc: apart(q, [
      [chunks[0], `That’s only the first chunk, ${chunks[0]} × ${d}. ${commas(n - chunks[0] * d)} is still left.`],
      [n - d, `That subtracts ${d} once. Find how many ${d}s are in ${commas(n)}.`],
    ]),
    hint: `Take away ${chunks[0]} groups of ${d} first: ${chunks[0]} × ${d} = ${commas(chunks[0] * d)}.`,
    explain: `${chunks[0]} × ${d} = ${commas(chunks[0] * d)}, and ${chunks[1]} × ${d} = ${chunks[1] * d}. ${chunks[0]} + ${chunks[1]} = ${q}.`,
  };
}

/* ---------- Big Wagon: volume (Lessons 6–8) ---------- */
function genVolume() {
  const variant = R(0, 2),
    name = pick(KIDS);
  if (variant === 0) {
    /* a wagon bed: length × width × height */
    let l, w, h;
    do {
      l = R(3, 9);
      w = R(2, 5);
      h = R(1, 3);
    } while (l === w || l * w * h > 120);
    const volume = l * w * h;
    return {
      kind: "num",
      unit: "cubic feet",
      answer: volume,
      facts: { t: "box", l, w, h },
      prompt: `The class decorates a wagon bed shaped like a box, ${l} feet long, ${w} feet wide, and ${h} ${h === 1 ? "foot" : "feet"} deep. How many cubic feet of balloons fill it?`,
      fig: () =>
        prismFig([prismBox(l, h, w, { lab: { l: `${l} ft`, h: `${h} ft`, w: `${w} ft` } })], {
          label: `A box ${l} by ${w} by ${h} feet`,
        }),
      misc: apart(volume, [
        [l + w + h, "That adds the edges. Multiply length × width × height."],
        [l * w, `That’s the base, ${l} × ${w}. Multiply by the depth, ${h}, too.`],
      ]),
      hint: `${l} × ${w} cubes cover the bottom, and there are ${h} ${h === 1 ? "layer" : "layers"}.`,
      explain: `${l} × ${w} × ${h} = ${volume} cubic feet.`,
    };
  }
  if (variant === 1) {
    /* about how big: round each edge to a friendly number */
    const l = R(21, 39),
      w = R(11, 19),
      h = R(2, 4),
      roundL = Math.round(l / 10) * 10,
      roundW = Math.round(w / 10) * 10,
      estimate = roundL * roundW * h;
    if (l % 10 === 5 || w % 10 === 5) return genVolume();
    return {
      ...mcOf([
        [`about ${commas(estimate)} cubic feet`, null],
        [
          `about ${commas(estimate * 10)} cubic feet`,
          `That’s 10 times too much. ${roundL} × ${roundW} × ${h} = ${commas(estimate)}.`,
        ],
        [`about ${roundL + roundW + h} cubic feet`, "That adds the edges. Volume multiplies them."],
      ]),
      facts: { t: "estimate", l, w, h },
      prompt: `The world’s largest wagon has a bed about ${l} feet long, ${w} feet wide, and ${h} feet deep. About how much does it hold?`,
      hint: `Round the length to ${roundL} and the width to ${roundW}, then multiply by ${h}.`,
      explain: `${roundL} × ${roundW} × ${h} = ${commas(estimate)}, so it holds about ${commas(estimate)} cubic feet.`,
    };
  }
  /* a stage made of two boxes */
  const leftL = R(2, 4),
    leftH = R(3, 5),
    rightL = R(2, 5),
    rightH = R(1, leftH - 1),
    w = R(2, 4),
    first = leftL * leftH * w,
    second = rightL * rightH * w,
    answer = first + second;
  return {
    kind: "num",
    unit: "cubic feet",
    answer,
    facts: {
      t: "combo",
      parts: [
        [leftL, leftH, w],
        [rightL, rightH, w],
      ],
    },
    prompt: "The moving-up stage is built from two boxes, gold and blue. What is its volume?",
    fig: () =>
      prismFig(
        [
          prismBox(leftL, leftH, w, { lab: { l: `${leftL} ft`, h: `${leftH} ft` } }),
          prismBox(rightL, rightH, w, {
            at: [leftL, 0, 0],
            cls: "b",
            lab: { l: `${rightL} ft`, w: `${w} ft`, hr: `${rightH} ft` },
          }),
        ],
        { label: `A stage of two boxes, ${leftL} by ${w} by ${leftH} and ${rightL} by ${w} by ${rightH} feet` },
      ),
    misc: apart(answer, [
      [(leftL + rightL) * leftH * w, "That fills in the empty corner too. Find each box’s volume, then add."],
      [first, "That’s only the gold box. Add the blue box."],
    ]),
    hint: "Find the volume of each box, then add.",
    explain: `Gold: ${leftL} × ${w} × ${leftH} = ${first}. Blue: ${rightL} × ${w} × ${rightH} = ${second}. ${first} + ${second} = ${answer} cubic feet.`,
  };
}

/* ---------- Fraction Fair: sums and differences (Lessons 10–11) ---------- */
/* a fraction a/b less than 1 in lowest terms */
const properOf = (b) => {
  let a;
  do a = R(1, b - 1);
  while (gcd(a, b) !== 1);
  return a;
};
function genFractions() {
  const adding = R(0, 1) === 1;
  let b, d, a, c;
  do {
    b = pick([2, 3, 4, 5, 6, 8, 10, 12]);
    d = pick([2, 3, 4, 5, 6, 8, 10, 12]);
    a = properOf(b);
    c = properOf(d);
  } while (b === d || lcm(b, d) > 24 || (!adding && a * d <= c * b));
  const common = lcm(b, d),
    up = a * (common / b),
    over = c * (common / d),
    top = adding ? up + over : up - over,
    answer = top / common,
    name = pick(KIDS);
  return {
    kind: "num",
    frac: true,
    unit: adding ? (answer > 1 ? "hours" : "hour") : "pound",
    answer,
    facts: { t: adding ? "add" : "subtract", a, b, c, d },
    prompt: adding
      ? `${name} helps at the fair for ${fr(a, b)} hour in the morning and ${fr(c, d)} hour after lunch. How long is that in all?`
      : `The fair had ${fr(a, b)} pound of fudge. ${fr(c, d)} pound was sold. How much is left?`,
    fig: (show) =>
      strips(
        [
          { d: show ? common : b, k: show ? up : a, lab: [a, b] },
          { d: show ? common : d, k: show ? over : c, lab: [c, d], cls: "b" },
        ],
        { wholes: 1, label: `${a}/${b} and ${c}/${d}${show ? ` in ${common}ths` : ""}` },
      ),
    misc: apart(answer, [
      [
        adding ? (a + c) / (b + d) : (a - c) / (b - d),
        `That ${adding ? "adds" : "subtracts"} the tops and the bottoms. Write both in ${common}ths first.`,
      ],
      ...(adding
        ? [
            [
              (a + c) / common,
              `That changes the bottoms to ${common} but not the tops. ${fr(a, b)} = ${fr(up, common)}.`,
            ],
          ]
        : []),
    ]),
    hint: `${fr(a, b)} = ${fr(up, common)} and ${fr(c, d)} = ${fr(over, common)}.`,
    explain: `${fr(up, common)} ${adding ? "+" : "−"} ${fr(over, common)} = ${fr(top, common)}${gcd(top, common) > 1 || top > common ? ` = ${nice(top, common)}` : ""}.`,
  };
}

/* ---------- Decimal Derby: decimal operations (Lesson 12) ---------- */
function genDecimals() {
  const variant = R(0, 2),
    name = pick(KIDS);
  if (variant === 0) {
    /* add a time in tenths to one in hundredths */
    let a, b;
    do {
      a = R(101, 999);
      b = R(11, 99) * 10;
    } while (a % 10 === 0 || (a % 100) / 10 + (b % 100) / 10 >= 10);
    const answer = (a + b) / 100;
    return {
      kind: "num",
      unit: "seconds",
      answer,
      facts: { t: "add", a: a / 100, b: b / 100 },
      prompt: `In the sack race, ${name} hopped the first half in ${num(a / 100)} seconds and the second half in ${num(b / 100)} seconds. What was the total time?`,
      misc: apart(answer, [
        [(a + b / 10) / 100, "That lines up the last digits. Line up the decimal points: tenths with tenths."],
      ]),
      hint: `Line up the decimal points: ${num(b / 100)} is ${(b / 100).toFixed(2)}.`,
      explain: `${num(a / 100)} + ${num(b / 100)} = ${num(answer)} seconds.`,
    };
  }
  if (variant === 1) {
    /* tenths × tenths */
    const x = R(2, 9),
      y = R(2, 9),
      answer = (x * y) / 100;
    return {
      kind: "num",
      unit: "",
      answer,
      facts: { t: "times", a: x / 10, b: y / 10 },
      prompt: `What is ${num(x / 10)} × ${num(y / 10)}?`,
      fig: () =>
        areaFig([x, 10], [y, 10], {
          under: true,
          dec: true,
          label: `${x / 10} × ${y / 10} on a square cut into hundredths`,
        }),
      misc: apart(answer, [
        [(x * y) / 10, `That’s ${x * y} tenths. Tenths × tenths make hundredths.`],
        [(x * y) / 1000, `That’s ${x * y} thousandths. Tenths × tenths make hundredths.`],
      ]),
      hint: `${x} × ${y} = ${x * y}, and a tenth of a tenth is a hundredth.`,
      explain: `${x} × ${y} = ${x * y}, so ${num(x / 10)} × ${num(y / 10)} = ${num(answer)}.`,
    };
  }
  /* tenths ÷ tenths: how many fit */
  const size = R(2, 9),
    times = R(2, 9),
    total = size * times;
  return {
    kind: "num",
    unit: "cups",
    answer: times,
    facts: { t: "divide", a: total / 10, b: size / 10 },
    prompt: `The lemonade stand has ${num(total / 10)} liters. Each cup holds ${num(size / 10)} liter. How many cups can it fill?`,
    misc: apart(times, [
      [times / 10, `That’s ${num(times / 10)}. ${total} tenths ÷ ${size} tenths = ${times}.`],
      [times * 10, `That has a zero too many. ${total} tenths ÷ ${size} tenths = ${times}.`],
    ]),
    hint: `${num(total / 10)} is ${total} tenths and ${num(size / 10)} is ${size} tenths. How many ${size}s are in ${total}?`,
    explain: `${total} ÷ ${size} = ${times}, so ${num(total / 10)} ÷ ${num(size / 10)} = ${times} cups.`,
  };
}

/* ---------- Fraction Frenzy: multiply fractions (Lesson 13) ---------- */
function genFractionProducts() {
  const variant = R(0, 1);
  let a, b, c, d;
  do {
    b = pick([2, 3, 4, 5, 6]);
    d = pick([2, 3, 4, 5, 6]);
    a = properOf(b);
    c = properOf(d);
  } while (a === 1 && c === 1);
  if (variant === 0) {
    /* a fraction of a fraction */
    const answer = (a * c) / (b * d);
    return {
      kind: "num",
      frac: true,
      unit: "",
      answer,
      facts: { t: "fractionTimes", a, b, c, d },
      prompt: `What is ${fr(a, b)} × ${fr(c, d)}?`,
      fig: () => areaFig([a, b], [c, d], { under: true, label: `${a}/${b} of ${c}/${d} of a square` }),
      misc: apart(answer, [
        [(a + c) / (b + d), "That adds the tops and the bottoms. Multiply them."],
        [c / d, `That’s all of ${fr(c, d)}. Take ${fr(a, b)} of it.`],
      ]),
      hint: `The square is cut into ${b} × ${d} = ${b * d} pieces; the dark part is ${a} × ${c} of them.`,
      explain: `${fr(a, b)} × ${fr(c, d)} = ${fr(a * c, b * d)}${gcd(a * c, b * d) > 1 ? ` = ${nice(a * c, b * d)}` : ""}.`,
    };
  }
  /* a fraction of a whole number of things */
  const n = b * R(2, 6),
    answer = (a * n) / b;
  return {
    kind: "num",
    unit: "ribbons",
    answer,
    facts: { t: "fractionOf", a, b, n },
    prompt: `There are ${n} ribbons for the moving-up ceremony. ${fr(a, b)} of them are blue. How many blue ribbons are there?`,
    misc: apart(answer, [
      [n / b, `That’s ${fr(1, b)} of them. ${fr(a, b)} is ${a} of those parts.`],
      [a * n, `That multiplies by ${a} but doesn’t divide by ${b}.`],
    ]),
    hint: `Split ${n} into ${b} equal parts, then take ${a}.`,
    explain: `${n} ÷ ${b} = ${n / b}, and ${a} × ${n / b} = ${answer} blue ribbons.`,
  };
}

/* ---------- Graduation: the final round ---------- */
const genBoss = () => pick([genProducts, genQuotients, genVolume, genFractions, genDecimals, genFractionProducts])();

const ZONES = [
  {
    id: "products",
    name: "Number Booth",
    lessons: "Lessons 1–3",
    blurb: "Make the largest product, and multiply with the standard algorithm and friendly factors.",
    gen: genProducts,
  },
  {
    id: "quotients",
    name: "Division Dash",
    lessons: "Lessons 4–5",
    blurb: "Divide by two-digit numbers with partial quotients.",
    gen: genQuotients,
  },
  {
    id: "volume",
    name: "Big Wagon",
    lessons: "Lessons 6–8",
    blurb: "Find and estimate volumes of wagons and stages.",
    gen: genVolume,
  },
  {
    id: "fractions",
    name: "Fraction Fair",
    lessons: "Lessons 10–11",
    blurb: "Add and subtract fractions with unlike denominators.",
    gen: genFractions,
  },
  {
    id: "decimals",
    name: "Decimal Derby",
    lessons: "Lesson 12",
    blurb: "Add, multiply, and divide decimals.",
    gen: genDecimals,
  },
  {
    id: "fproducts",
    name: "Fraction Frenzy",
    lessons: "Lesson 13",
    blurb: "Multiply fractions, and find a fraction of a number.",
    gen: genFractionProducts,
  },
  {
    id: "boss",
    name: "Graduation",
    lessons: "All lessons",
    blurb: "Move up to Grade 6! Every right answer sends another cap into the air.",
    gen: genBoss,
  },
];

/* the sky with `tossed` of its 10 caps in the air, in two rows of 5 (the boss icon tosses all of them) */
const caps = (tossed) =>
  range(10)
    .map((i) => {
      const x = 10 + (i % 5) * 11,
        y = i < 5 ? 14 : 32;
      return i < tossed
        ? `<path d="M${x - 6},${y}L${x},${y - 3}L${x + 6},${y}L${x},${y + 3}Z" fill="#0a2340" stroke="#f3f6fb" stroke-width="1"/><path d="M${x + 4},${y + 1}V${y + 6}" stroke="#ffc93c" stroke-width="1.5"/>`
        : `<circle cx="${x}" cy="${y}" r="2" fill="rgba(243,246,251,.3)"/>`;
    })
    .join("") + '<path d="M4,58H60" stroke="#5fe0a8" stroke-width="3"/>';
const ICON = {
  products:
    '<g fill="#f3f6fb" stroke="#0a2340" stroke-width="1.5"><rect x="6" y="18" width="12" height="18" rx="2"/><rect x="20" y="18" width="12" height="18" rx="2"/><rect x="34" y="18" width="12" height="18" rx="2"/><rect x="48" y="18" width="12" height="18" rx="2"/></g><g fill="#0a2340" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace"><text x="12" y="31">9</text><text x="26" y="31">6</text><text x="40" y="31">8</text><text x="54" y="31">7</text></g><text x="32" y="54" fill="#ffc93c" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">96 × 87</text>',
  quotients:
    '<rect x="8" y="28" width="48" height="26" fill="#e9d2a0" stroke="#8a6a2c" stroke-width="2"/><g fill="#ff8ac4"><circle cx="18" cy="24" r="6"/><circle cx="32" cy="24" r="6"/><circle cx="46" cy="24" r="6"/></g><path d="M8,40H56" stroke="#8a6a2c" stroke-width="1.5"/>',
  volume:
    iconCube(8, 44, 20) +
    '<circle cx="14" cy="52" r="5" fill="#0a2340" stroke="#f3f6fb" stroke-width="2"/><circle cx="40" cy="52" r="5" fill="#0a2340" stroke="#f3f6fb" stroke-width="2"/>',
  fractions:
    '<g stroke="#f3f6fb" stroke-width="1.5"><rect x="6" y="14" width="52" height="12" fill="none"/><rect x="6" y="14" width="26" height="12" fill="#ffc93c"/><rect x="6" y="34" width="52" height="12" fill="none"/><rect x="6" y="34" width="17.3" height="12" fill="#7fe3ff"/></g>',
  decimals:
    '<path d="M8,48H56" stroke="#f3f6fb" stroke-width="2"/><path d="M20,48V36L28,30L36,36V48" fill="#c9584b" stroke="#0a2340" stroke-width="1.5"/><text x="44" y="24" fill="#ffc93c" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">0.45</text>',
  fproducts:
    '<rect x="10" y="10" width="44" height="44" fill="rgba(169,196,228,.1)" stroke="#f3f6fb" stroke-width="2"/><rect x="10" y="21" width="44" height="33" fill="rgba(127,227,255,.35)"/><rect x="10" y="21" width="29" height="33" fill="#ffc93c"/>',
  boss: caps(10),
};
