/* City Builders (Grade 4 Unit 6): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Area diagrams and partial products come from shared/multiply.js; the standard algorithm, base-ten blocks, and partial
   quotients from shared/blocks.js; rectangles from shared/shapes.js; mcOf and miscOf from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Every problem also
   carries facts for checks.js: its kind (t) and the numbers it was made from, so the answer can be worked out again. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* 1st, 2nd, 3rd, 4th, … */
const nth = (k) =>
  k + (k % 10 === 1 && k !== 11 ? "st" : k % 10 === 2 && k !== 12 ? "nd" : k % 10 === 3 && k !== 13 ? "rd" : "th");
/* how many nonzero digits n has */
const nonzero = (n) => String(n).replace(/[^1-9]/g, "").length;
/* a random whole number with `places` digits and at most `most` nonzero digits (the first is never 0) */
function friendly(places, most) {
  let n;
  do {
    const digits = [...String(R(10 ** (places - 1), 10 ** places - 1))];
    while (digits.filter((c) => c !== "0").length > most) digits[R(1, places - 1)] = "0";
    n = +digits.join("");
  } while (nonzero(n) > most);
  return n;
}
/* how many columns of a × b (b one digit) carry: the standard algorithm's regroups */
const carriesOf = (a, b) => mulSteps(a, b).filter((step) => step.carry).length;

/* ---------- Pattern Park: number and shape patterns (Lessons 1–4) ---------- */
const COLORS = ["red", "blue", "green", "yellow"];
function genPatterns() {
  const variant = R(0, 3),
    start = R(1, 12),
    add = R(2, 9);
  /* the pattern's kth number (the first is k = 1) */
  const term = (k) => start + (k - 1) * add;
  if (variant === 0) {
    /* the nth number of a growing pattern */
    const n = R(6, 12),
      answer = term(n);
    return {
      kind: "num",
      unit: "",
      answer,
      facts: { t: "nth", start, add, n },
      prompt: `The city plants trees by a rule: start with ${start}, then add ${add} each year. ${start}, ${term(2)}, ${term(3)}, … How many trees are there in the ${nth(n)} year?`,
      misc: miscOf(answer, [
        [
          start + n * add,
          `That adds ${add} ${n} times. The 1st year is the start, so the ${nth(n)} year adds ${add} only ${n - 1} times.`,
        ],
        [n * add, `That leaves out the start. Begin with ${start}, then add ${add} ${n - 1} times.`],
      ]).filter(([wrong]) => wrong !== answer),
      hint: `From the 1st year to the ${nth(n)}, the rule adds ${add} ${n - 1} times.`,
      explain: `${start} + ${n - 1} × ${add} = ${start} + ${(n - 1) * add} = ${answer} trees.`,
    };
  }
  if (variant === 1) {
    /* which number is in the pattern: one is, one is off by 1, one has the wrong parity or is off by 2 */
    const k = R(5, 12),
      right = term(k),
      /* the misses fall between numbers in the pattern: 1 off, and 2 off (3 off when it adds 2, where 2 off is in it) */
      nearMiss = right + pick([-1, 1]),
      farMiss = right + pick([-1, 1]) * (add === 2 ? 3 : 2);
    return {
      ...mcOf([
        [String(right), null],
        [String(nearMiss), `The pattern goes ${term(k - 1)}, ${right}, ${term(k + 1)}. It skips ${nearMiss}.`],
        [String(farMiss), `The pattern goes ${term(k - 1)}, ${right}, ${term(k + 1)}. It skips ${farMiss}.`],
      ]),
      facts: { t: "inPattern", start, add },
      prompt: `The rule is “start at ${start} and add ${add}.” Which number is in the pattern?`,
      hint: `Keep adding ${add}: ${start}, ${term(2)}, ${term(3)}, ${term(4)}, …`,
      explain: `${right} = ${start} + ${k - 1} × ${add}, so it’s the ${nth(k)} number in the pattern.`,
    };
  }
  if (variant === 2) {
    /* which color is at a position in a repeating row of flags */
    const unit = shuffle(COLORS).slice(0, R(2, 3)),
      pattern = R(0, 1) ? unit : [...unit, unit[0]],
      size = pattern.length,
      n = R(10, 40),
      place = ((n - 1) % size) + 1,
      color = pattern[place - 1],
      others = [...new Set(pattern)].filter((c) => c !== color);
    const wrongs = (others.length > 1 ? others : [...others, COLORS.find((c) => !pattern.includes(c))]).slice(0, 2);
    return {
      ...mcOf([
        [color, null],
        ...wrongs.map((c) => [
          c,
          pattern.includes(c)
            ? `${c[0].toUpperCase() + c.slice(1)} is at place ${pattern.indexOf(c) + 1} of the repeat. ${n} is ${Math.floor((n - 1) / size)} × ${size} + ${place}: place ${place}.`
            : `There’s no ${c} flag in this pattern.`,
        ]),
      ]),
      facts: { t: "repeat", pattern, n },
      prompt: `A row of flags goes ${pattern.join(", ")}, ${pattern.join(", ")}, … What color is the ${nth(n)} flag?`,
      hint: `The colors repeat every ${size}. Divide ${n} by ${size}: what’s left over?`,
      explain: `${n} = ${Math.floor((n - 1) / size)} × ${size} + ${place}. After ${Math.floor((n - 1) / size)} whole repeats, the ${nth(n)} flag is place ${place} of the repeat: ${color}.`,
    };
  }
  /* odd, even, or both: why the rule makes it so */
  const same = add % 2 === 0,
    right = same ? (start % 2 ? "All odd" : "All even") : "Odd and even, taking turns";
  return {
    ...mcOf(
      ["All odd", "All even", "Odd and even, taking turns"].map((label) => [
        label,
        label === right
          ? null
          : same
            ? `Adding ${add}, an even number, never changes odd or even. The start, ${start}, is ${start % 2 ? "odd" : "even"}.`
            : `Adding ${add}, an odd number, switches between odd and even every time.`,
      ]),
    ),
    facts: { t: "parity", start, add },
    prompt: `The rule is “start at ${start} and add ${add}.” What is true of the numbers in the pattern?`,
    hint: `Is ${add} odd or even? What does adding it do to an odd number, or to an even one?`,
    explain: `${start}, ${term(2)}, ${term(3)}, ${term(4)}, … ${same ? `Adding an even number keeps ${start % 2 ? "odd numbers odd" : "even numbers even"}.` : "Adding an odd number switches odd to even and even to odd."}`,
  };
}

/* ---------- Brick Yard: multiply by a one-digit number (Lessons 5–7, 9) ---------- */
/* things the city builds with, counted in boxes: [what's in a box, the box] */
const SUPPLIES = [
  ["bricks", "pallet"],
  ["tiles", "box"],
  ["nails", "bucket"],
  ["light bulbs", "crate"],
];
/* a one-digit number and a 2- to 4-digit number with few nonzero digits, multiplied with at most two carries */
function oneDigitProduct() {
  let a, b;
  do {
    a = friendly(R(2, 4), R(2, 3));
    b = R(2, 9);
  } while (carriesOf(a, b) > 2 || nonzero(a * b) > 4);
  return [a, b];
}
function genMultiply() {
  const variant = R(0, 2),
    [a, b] = oneDigitProduct(),
    parts = placeParts(a),
    product = a * b;
  if (variant === 0 || variant === 2) {
    /* the product, bare or in a story */
    const [things, box] = pick(SUPPLIES),
      story = variant === 2;
    return {
      kind: "num",
      unit: story ? things : "",
      answer: product,
      facts: { t: "product", a, b },
      prompt: story
        ? `Each ${box} holds ${commas(a)} ${things}. The builders use ${b} ${box === "box" ? "boxes" : box + "s"}. How many ${things} is that?`
        : `What is ${b} × ${commas(a)}?`,
      fig: (show) => areaModel(a, b, { filled: show ? 1 : 0 }),
      misc: miscOf(product, [
        [b * parts[0] + (a - parts[0]), `That multiplies only the ${commas(parts[0])}. Multiply every place by ${b}.`],
        ...(a < 100
          ? [
              [
                +`${(b * parts[0]) / 10}${b * (a % 10)}`,
                `That writes ${b} × ${parts[0] / 10} and ${b} × ${a % 10} side by side. ${b} × ${parts[0]} = ${b * parts[0]}: add the partial products.`,
              ],
            ]
          : []),
        [a + b, `That adds ${b}. Multiply: ${b} × ${commas(a)}.`],
      ]).filter(([wrong]) => wrong !== product),
      hint: `Split ${commas(a)} into ${parts.map(commas).join(" + ")}. Multiply each part by ${b}, then add.`,
      explain: `${parts.map((p) => `${b} × ${commas(p)} = ${commas(b * p)}`).join(", ")}. ${parts.map((p) => commas(b * p)).join(" + ")} = ${commas(product)}.`,
    };
  }
  /* which expression splits the product by place */
  const byPlace = parts.map((p) => `${b} × ${commas(p)}`).join(" + "),
    byDigit = [...String(a)]
      .filter((d) => d !== "0")
      .map((d) => `${b} × ${d}`)
      .join(" + "),
    firstOnly = `${b} × ${commas(parts[0])} + ${parts.slice(1).map(commas).join(" + ")}`;
  return {
    ...mcOf(
      [
        [byPlace, null],
        [
          byDigit,
          `Those are the digits, not their values. In ${commas(a)}, the ${String(parts[0])[0]} stands for ${commas(parts[0])}.`,
        ],
        [firstOnly, `That multiplies only the ${commas(parts[0])}. Every place gets multiplied by ${b}.`],
      ],
      { stack: true },
    ),
    facts: { t: "split", a, b },
    prompt: `Which shows ${b} × ${commas(a)} split by place value?`,
    fig: (show) => areaModel(a, b, { filled: show ? Infinity : 0 }),
    hint: `${commas(a)} = ${parts.map(commas).join(" + ")}. Each part is multiplied by ${b}.`,
    explain: `${commas(a)} = ${parts.map(commas).join(" + ")}, so ${b} × ${commas(a)} = ${byPlace} = ${commas(product)}.`,
  };
}

/* ---------- Tile Plaza: multiply two two-digit numbers (Lessons 8, 10) ---------- */
/* two two-digit numbers (neither a multiple of 10) whose product is friendly: [a, b] */
function twoDigitPair() {
  let a, b;
  do {
    a = R(12, 49);
    b = R(11, 29);
  } while (a % 10 === 0 || b % 10 === 0 || a * b > 1500);
  return [a, b];
}
/* the four partial products of a × b, as numbers in reading order */
const fourPartials = (a, b) => placeParts(b).flatMap((rowPart) => placeParts(a).map((colPart) => rowPart * colPart));
function genTwoDigit() {
  const variant = R(0, 2),
    [a, b] = twoDigitPair(),
    product = a * b,
    partials = fourPartials(a, b),
    [aTens, aOnes] = placeParts(a),
    [bTens, bOnes] = placeParts(b);
  if (variant === 0 || variant === 2) {
    /* the product, bare or as rows of tiles */
    const story = variant === 2;
    return {
      kind: "num",
      unit: story ? "tiles" : "",
      answer: product,
      facts: { t: "product", a, b },
      prompt: story
        ? `The plaza floor has ${b} rows of tiles with ${a} tiles in each row. How many tiles is that?`
        : `What is ${a} × ${b}?`,
      fig: (show) => areaModel(a, b, { filled: show ? 1 : 0 }),
      misc: miscOf(product, [
        [
          aTens * bTens + aOnes * bOnes,
          `That’s only tens × tens and ones × ones. There are 4 partial products: ${partials.join(", ")}.`,
        ],
        [a + b, `That adds. Multiply: ${a} × ${b}.`],
      ]).filter(([wrong]) => wrong !== product),
      hint: `Split both: ${a} = ${aTens} + ${aOnes} and ${b} = ${bTens} + ${bOnes}. Find all 4 partial products.`,
      explain: `${bTens} × ${aTens} = ${partials[0]}, ${bTens} × ${aOnes} = ${partials[1]}, ${bOnes} × ${aTens} = ${partials[2]}, ${bOnes} × ${aOnes} = ${partials[3]}. ${partials.join(" + ")} = ${commas(product)}.`,
    };
  }
  /* which partial products add up to the product */
  const right = partials.map(commas).join(" + "),
    onlyTwo = `${commas(aTens * bTens)} + ${aOnes * bOnes}`,
    asDigits = [aTens / 10, aOnes].flatMap((x) => [bTens / 10, bOnes].map((y) => x * y)).join(" + ");
  return {
    ...mcOf(
      [
        [right, null],
        [
          onlyTwo,
          `That’s only tens × tens and ones × ones. ${bTens} × ${aOnes} and ${bOnes} × ${aTens} are partial products too.`,
        ],
        [asDigits, `That uses the tens digits as ones. In ${a}, the ${aTens / 10} stands for ${aTens}.`],
      ],
      { stack: true },
    ),
    facts: { t: "partials", a, b },
    prompt: `Which partial products add up to ${a} × ${b}?`,
    fig: (show) => areaModel(a, b, { filled: show ? Infinity : 0 }),
    hint: `Split both numbers into tens and ones. The area diagram has 4 pieces.`,
    explain: `${right} = ${commas(product)}.`,
  };
}

/* ---------- Crane Works: the standard algorithm to multiply (Lessons 11–12) ---------- */
function genStandard() {
  const variant = R(0, 1);
  let a, b;
  do {
    a = friendly(R(3, 4), 3);
    b = R(3, 9);
  } while (carriesOf(a, b) < 1 || carriesOf(a, b) > 2 || nonzero(a * b) > 4);
  const product = a * b,
    steps = mulSteps(a, b);
  if (variant === 0) {
    /* the product in columns */
    const noCarry = +steps
      .slice()
      .reverse()
      .map((step, i) => (i === 0 ? step.top * b : (step.top * b) % 10))
      .join("");
    return {
      kind: "num",
      unit: "",
      answer: product,
      facts: { t: "product", a, b },
      prompt: `Use the standard algorithm: ${commas(a)} × ${b} = ?`,
      fig: (show) => mulFig(a, b, show ? 1 : 0),
      misc: miscOf(product, [
        [noCarry, `That leaves out the carries. Add what you carry after multiplying the next column.`],
      ]).filter(([wrong]) => wrong !== product),
      hint: `Start with the ones: ${steps[0].top} × ${b} = ${steps[0].val}. Write ${steps[0].digit} and carry ${steps[0].carry || "nothing"}.`,
      explain:
        steps
          .map((step, i) =>
            i === steps.length - 1
              ? `${step.top} × ${b}${step.cin ? ` + ${step.cin}` : ""} = ${step.val}: write ${step.val}`
              : `${step.top} × ${b}${step.cin ? ` + ${step.cin}` : ""} = ${step.val}: write ${step.digit}${step.carry ? `, carry ${step.carry}` : ""}`,
          )
          .join(". ") + `. So ${commas(a)} × ${b} = ${commas(product)}.`,
    };
  }
  /* what's carried to the tens */
  const first = steps[0];
  if (!first.carry) return genStandard();
  return {
    kind: "num",
    unit: "",
    answer: first.carry,
    facts: { t: "carry", a, b },
    prompt: `In the standard algorithm for ${commas(a)} × ${b}, what number do you carry to the tens column?`,
    fig: () => mulFig(a, b, 0),
    misc: miscOf(first.carry, [
      [
        first.digit,
        `${first.top} × ${b} = ${first.val}. The ${first.digit} is written in the ones. The tens are carried.`,
      ],
      [first.val, `${first.val} is the whole product of the ones. Write its ones digit and carry its tens.`],
    ]).filter(([wrong]) => wrong !== first.carry),
    hint: `Multiply the ones: ${first.top} × ${b}. How many tens is that?`,
    explain: `${first.top} × ${b} = ${first.val}: write ${first.digit} in the ones and carry ${first.carry} ten${first.carry > 1 ? "s" : ""}.`,
  };
}

/* ---------- Bus Depot: divide (Lessons 13–18) ---------- */
/* a quotient's places as chunks for partial quotients: 142 → [100, 40, 2] */
const chunksOf = (quotient) => placeParts(quotient);
function genDivide() {
  const variant = R(0, 2),
    name = pick(KIDS);
  if (variant === 0) {
    /* equal groups: how many groups, or how many in each */
    let divisor, quotient;
    do {
      divisor = R(2, 9);
      quotient = R(1, 3) === 1 ? R(101, 250) : R(12, 99);
    } while (nonzero(quotient * divisor) > 3 || quotient % 10 === 0);
    const total = quotient * divisor,
      groups = Math.random() < 0.5;
    const story = groups
      ? `The depot has ${commas(total)} bus tickets. They come in packs of ${divisor}. How many packs is that?`
      : `${commas(total)} bus tickets are shared equally among ${divisor} ticket booths. How many tickets does each booth get?`;
    return {
      kind: "num",
      unit: groups ? "packs" : "tickets",
      answer: quotient,
      facts: { t: "quotient", n: total, d: divisor },
      prompt: story,
      fig: (show) => quotientFig(total, divisor, chunksOf(quotient), show ? 1 : 0),
      misc: miscOf(quotient, [
        [total - divisor, `That takes away ${divisor} once. How many ${divisor}s are in ${commas(total)}? Divide.`],
        [total * divisor, `That multiplies. Divide: ${commas(total)} ÷ ${divisor}.`],
      ]),
      hint: `Take away easy chunks of ${divisor}, like ${chunksOf(quotient)[0]} × ${divisor} = ${commas(chunksOf(quotient)[0] * divisor)}.`,
      explain: `${chunksOf(quotient)
        .map((c) => `${c} × ${divisor} = ${commas(c * divisor)}`)
        .join(", ")}. ${chunksOf(quotient).join(" + ")} = ${quotient}, so ${commas(total)} ÷ ${divisor} = ${quotient}.`,
    };
  }
  if (variant === 1) {
    /* a missing side of a rectangle from its area */
    let width, length;
    do {
      width = R(3, 9);
      length = R(11, 30);
    } while (length % 10 === 0);
    const area = width * length;
    return {
      kind: "num",
      unit: "meters",
      answer: length,
      facts: { t: "side", area, width },
      prompt: `A new parking lot is a rectangle with an area of ${area} square meters. It is ${width} meters wide. How long is it?`,
      fig: (show) => rectFig(length, width, { unit: "m", ask: show ? null : "length", grid: false }),
      misc: miscOf(length, [
        [area - width, `That subtracts. The area is length × width: ${width} × ? = ${area}.`],
        [area * width, `That multiplies the area by the width. Divide: ${area} ÷ ${width}.`],
      ]),
      hint: `${width} × ? = ${area}. Divide the area by the width.`,
      explain: `${area} ÷ ${width} = ${length}, because ${width} × ${length} = ${area}. The lot is ${length} meters long.`,
    };
  }
  /* sharing base-ten blocks, with a trade */
  let groups, each;
  do {
    groups = R(2, 6);
    each = R(12, 49);
  } while (groups * each > 99 || Math.floor((groups * each) / 10) % groups === 0);
  const total = groups * each;
  return {
    kind: "num",
    unit: "",
    answer: each,
    facts: { t: "quotient", n: total, d: groups },
    prompt: `${name} shares ${total} base-ten cubes equally into ${groups} groups. How many cubes are in each group?`,
    fig: (show) => divideFig(total, groups, { split: show }),
    misc: miscOf(each, [
      [
        Math.floor(Math.floor(total / 10) / groups) * 10 + Math.floor((total % 10) / groups),
        `That leaves out the tens that couldn’t be shared. Trade them for ones and keep sharing.`,
      ],
      [total - groups, `That takes away ${groups}. Share: ${total} ÷ ${groups}.`],
    ]).filter(([wrong]) => wrong !== each),
    hint: `Share the tens first. Trade any tens left over for 10 ones each, then share the ones.`,
    explain: `${Math.floor(total / 10)} tens: ${Math.floor(Math.floor(total / 10) / groups)} in each group, ${Math.floor(total / 10) % groups} left to trade for ${10 * (Math.floor(total / 10) % groups)} ones. Then ${10 * (Math.floor(total / 10) % groups) + (total % 10)} ones: ${each % 10} in each. Each group gets ${each}.`,
  };
}

/* ---------- Delivery Trucks: remainders (Lessons 19–20) ---------- */
/* stories that divide with a remainder, by what to do with it: [use, story(n, d), unit, question] */
const LEFTOVERS = {
  up: [
    (n, d) => [
      `${n} boxes go on delivery trucks. Each truck carries ${d} boxes. How many trucks are needed?`,
      "trucks",
    ],
    (n, d) => [
      `${n} workers ride to the site in vans. Each van holds ${d} workers. How many vans do they need?`,
      "vans",
    ],
  ],
  down: [
    (n, d) => [`The city has ${n} new trees. It plants them in rows of ${d}. How many full rows can it plant?`, "rows"],
    (n, d) => [
      `A builder has ${n} bricks. Each window frame takes ${d} bricks. How many frames can the builder make?`,
      "frames",
    ],
  ],
  left: [
    (n, d) => [`${n} paint cans are shared equally among ${d} painters. How many cans are left over?`, "cans"],
    (n, d) => [`${n} street signs are packed in boxes of ${d}. How many signs are left over?`, "signs"],
  ],
};
function genRemainder() {
  const variant = R(0, 3);
  let n, d;
  do {
    d = R(3, 9);
    n = R(20, 99);
  } while (n % d === 0);
  const quotient = Math.floor(n / d),
    left = n % d;
  if (variant < 3) {
    const use = ["up", "down", "left"][variant],
      [story, unit] = pick(LEFTOVERS[use])(n, d),
      answer = use === "up" ? quotient + 1 : use === "down" ? quotient : left;
    const wrongs = {
      up: [
        [quotient, `${quotient} ${unit} hold only ${quotient * d}. The ${left} left over need one more.`],
        [left, `${left} is the remainder. The question asks how many ${unit}.`],
      ],
      down: [
        [
          quotient + 1,
          `${quotient + 1} ${unit} would need ${(quotient + 1) * d}. There are only ${n}: the ${left} left over ${left === 1 ? "isn’t" : "aren’t"} enough for another.`,
        ],
        [left, `${left} is the remainder. The question asks how many ${unit}.`],
      ],
      left: [
        [quotient, `${quotient} is how many in each group. The question asks what’s left over.`],
        [quotient + 1, `The question asks what’s left over: ${n} − ${quotient} × ${d}.`],
      ],
    }[use];
    return {
      kind: "num",
      unit,
      answer,
      facts: { t: "remainder", n, d, use },
      prompt: story,
      fig: (show) => (show ? divideFig(n, d) : divideFig(n, d, { split: false })),
      misc: miscOf(answer, wrongs).filter(([wrong]) => wrong !== answer),
      hint: `${n} ÷ ${d} = ? R ?. Then decide what the remainder means in the story.`,
      explain: `${n} ÷ ${d} = ${quotient} R ${left}. ${use === "up" ? `The ${left} left over need one more, so ${quotient + 1} ${unit}.` : use === "down" ? `Only full ones count, so ${quotient} ${unit}.` : `The remainder is what’s left over: ${left} ${unit}.`}`,
    };
  }
  /* the quotient and remainder */
  const choices = [
    [`${quotient} R ${left}`, null],
    [`${quotient - 1} R ${left + d}`, `The remainder ${left + d} is more than ${d}: there’s enough for another group.`],
    [`${quotient + 1} R ${left}`, `${quotient + 1} × ${d} = ${(quotient + 1) * d}, more than ${n}.`],
  ];
  return {
    ...mcOf(choices),
    facts: { t: "divmod", n, d },
    prompt: `What is ${n} ÷ ${d}?`,
    fig: (show) => divideFig(n, d, { split: show }),
    hint: `What times ${d} is close to ${n} without going over?`,
    explain: `${quotient} × ${d} = ${quotient * d}, and ${n} − ${quotient * d} = ${left}. So ${n} ÷ ${d} = ${quotient} R ${left}.`,
  };
}

/* ---------- City Hall: solve and check (Lessons 21–24) ---------- */
function genSolve() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* two steps: multiply, then take some away */
    const boxes = R(3, 8),
      each = pick([120, 125, 144, 150, 200, 240, 250]),
      used = R(1, 9) * 50,
      total = boxes * each,
      answer = total - used;
    if (answer <= 0) return genSolve();
    return {
      kind: "num",
      unit: "flowers",
      answer,
      facts: { t: "twoStep", a: boxes, b: each, minus: used },
      prompt: `The city buys ${boxes} trays of ${each} flowers. Gardeners plant ${used} of them in the park. How many flowers are left to plant?`,
      misc: miscOf(answer, [
        [total, `That’s how many the city bought. ${used} were planted: subtract.`],
        [total + used, `That adds. The planted flowers aren’t left: subtract.`],
      ]),
      hint: `First find how many flowers in all: ${boxes} × ${each}. Then take away ${used}.`,
      explain: `${boxes} × ${each} = ${commas(total)}. ${commas(total)} − ${used} = ${commas(answer)} flowers.`,
    };
  }
  if (variant === 1) {
    /* two steps: multiply, then share equally */
    let trucks, each, stops;
    do {
      trucks = R(2, 6);
      each = R(2, 9) * 12;
      stops = pick([2, 3, 4, 6]);
    } while ((trucks * each) % stops !== 0 || trucks * each > 600);
    const total = trucks * each,
      answer = total / stops;
    return {
      kind: "num",
      unit: "benches",
      answer,
      facts: { t: "twoStepDivide", a: trucks, b: each, d: stops },
      prompt: `${trucks} trucks each bring ${each} park benches. The benches are shared equally among ${stops} parks. How many benches does each park get?`,
      misc: miscOf(answer, [
        [total, `That’s all the benches. Share them among ${stops} parks: divide.`],
        [each / stops, `That shares one truck’s benches. All ${trucks} trucks’ benches are shared.`],
      ]).filter(([wrong]) => wrong !== answer && Number.isInteger(wrong)),
      hint: `First find all the benches: ${trucks} × ${each}. Then divide by ${stops}.`,
      explain: `${trucks} × ${each} = ${total}. ${total} ÷ ${stops} = ${answer} benches.`,
    };
  }
  /* is an answer reasonable: an estimate with friendly numbers */
  let a, b;
  do {
    a = R(21, 89);
    b = R(11, 39);
  } while (
    a % 10 === 0 ||
    b % 10 === 0 ||
    Math.abs(a - Math.round(a / 10) * 10) > 3 ||
    Math.abs(b - Math.round(b / 10) * 10) > 3
  );
  const product = a * b,
    right = Math.random() < 0.5,
    claim = right ? product : product + pick([-1, 1]) * pick([1000, 2000]),
    estimate = Math.round(a / 10) * 10 * Math.round(b / 10) * 10,
    name = pick(KIDS);
  if (claim <= 0) return genSolve();
  return {
    ...mcOf([
      [
        `Yes: it’s close to ${commas(estimate)}`,
        right ? null : `${commas(claim)} is too far from ${commas(estimate)}.`,
      ],
      [
        `No: it should be about ${commas(estimate)}`,
        right ? `${commas(claim)} is close to ${commas(estimate)}, so it’s reasonable.` : null,
      ],
      [
        `Yes: it has 4 digits`,
        `Having 4 digits isn’t enough. Estimate with friendly numbers: ${Math.round(a / 10) * 10} × ${Math.round(b / 10) * 10}.`,
      ],
    ]),
    facts: { t: "reasonable", a, b, claim },
    prompt: `${name} says ${a} × ${b} = ${commas(claim)}. Is that reasonable?`,
    hint: `Round both numbers to the nearest ten and multiply.`,
    explain: `${Math.round(a / 10) * 10} × ${Math.round(b / 10) * 10} = ${commas(estimate)}. ${a} × ${b} = ${commas(product)}${right ? ", so the answer is right." : `, not ${commas(claim)}.`}`,
  };
}

/* ---------- Grand Opening: the final round ---------- */
const genBoss = () => pick([genPatterns, genMultiply, genTwoDigit, genStandard, genDivide, genRemainder, genSolve])();

const ZONES = [
  {
    id: "patterns",
    name: "Pattern Park",
    lessons: "Lessons 1–4",
    blurb: "Follow rules for patterns that grow, and find any flag in a pattern that repeats.",
    gen: genPatterns,
  },
  {
    id: "multiply",
    name: "Brick Yard",
    lessons: "Lessons 5–7, 9",
    blurb: "Multiply by a one-digit number with area diagrams and partial products.",
    gen: genMultiply,
  },
  {
    id: "twodigit",
    name: "Tile Plaza",
    lessons: "Lessons 8, 10",
    blurb: "Multiply two two-digit numbers with four partial products.",
    gen: genTwoDigit,
  },
  {
    id: "standard",
    name: "Crane Works",
    lessons: "Lessons 11–12",
    blurb: "Multiply column by column with the standard algorithm, carrying as you go.",
    gen: genStandard,
  },
  {
    id: "divide",
    name: "Bus Depot",
    lessons: "Lessons 13–18",
    blurb: "Divide with equal groups, areas, base-ten blocks, and partial quotients.",
    gen: genDivide,
  },
  {
    id: "remainder",
    name: "Delivery Trucks",
    lessons: "Lessons 19–20",
    blurb: "Divide with remainders, and decide what the remainder means.",
    gen: genRemainder,
  },
  {
    id: "solve",
    name: "City Hall",
    lessons: "Lessons 21–24",
    blurb: "Solve problems with two steps, and check answers with an estimate.",
    gen: genSolve,
  },
  {
    id: "boss",
    name: "Grand Opening",
    lessons: "All lessons",
    blurb: "Open the new city! Every right answer lights a window in the tower.",
    gen: genBoss,
  },
];

/* the tower: 10 windows in two columns, `lit` of them glowing (the boss icon lights all of them) */
const tower = (lit) =>
  '<path d="M18,60V8H46V60Z" fill="#3d5a80" stroke="#0a2340" stroke-width="1.5"/><path d="M32,8V2" stroke="#f3f6fb" stroke-width="2"/>' +
  range(10)
    .map(
      (i) =>
        `<rect x="${22 + (i % 2) * 12}" y="${50 - Math.floor(i / 2) * 9}" width="8" height="6" fill="${i < lit ? "#ffc93c" : "rgba(10,35,64,.8)"}"/>`,
    )
    .join("") +
  '<path d="M4,60H60" stroke="#f3f6fb" stroke-width="2"/>';
const ICON = {
  patterns:
    '<g stroke="#0a2340" stroke-width="1.5"><circle cx="10" cy="32" r="6" fill="#ffc93c"/><rect x="20" y="26" width="12" height="12" fill="#7fe3ff"/><circle cx="42" cy="32" r="6" fill="#ffc93c"/><rect x="52" y="26" width="12" height="12" fill="#7fe3ff"/></g><text x="32" y="56" fill="#f3f6fb" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">3, 7, 11, …</text>',
  multiply:
    '<g fill="#c9584b" stroke="#0a2340" stroke-width="1.5"><rect x="6" y="40" width="16" height="9"/><rect x="24" y="40" width="16" height="9"/><rect x="42" y="40" width="16" height="9"/><rect x="15" y="30" width="16" height="9"/><rect x="33" y="30" width="16" height="9"/><rect x="24" y="20" width="16" height="9"/></g><text x="32" y="60" fill="#ffc93c" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">6 × 234</text>',
  twodigit:
    '<g stroke-width="2"><rect x="8" y="10" width="34" height="28" fill="rgba(255,201,60,.3)" stroke="#ffc93c"/><rect x="42" y="10" width="14" height="28" fill="rgba(127,227,255,.3)" stroke="#7fe3ff"/><rect x="8" y="38" width="34" height="14" fill="rgba(127,227,255,.3)" stroke="#7fe3ff"/><rect x="42" y="38" width="14" height="14" fill="rgba(255,201,60,.3)" stroke="#ffc93c"/></g>',
  standard:
    '<path d="M14,58V10H48" fill="none" stroke="#ffc93c" stroke-width="3"/><path d="M14,18L26,10" stroke="#ffc93c" stroke-width="2"/><path d="M42,10V30" stroke="#f3f6fb" stroke-width="1.5"/><rect x="36" y="30" width="12" height="9" fill="#c9584b" stroke="#0a2340" stroke-width="1.5"/><path d="M6,58H30" stroke="#f3f6fb" stroke-width="2"/>',
  divide:
    '<rect x="6" y="22" width="52" height="24" rx="5" fill="#ffc93c" stroke="#0a2340" stroke-width="1.5"/><g fill="#7fe3ff"><rect x="11" y="26" width="9" height="8"/><rect x="23" y="26" width="9" height="8"/><rect x="35" y="26" width="9" height="8"/><rect x="47" y="26" width="7" height="8"/></g><circle cx="17" cy="48" r="5" fill="#0a2340" stroke="#f3f6fb" stroke-width="2"/><circle cx="47" cy="48" r="5" fill="#0a2340" stroke="#f3f6fb" stroke-width="2"/>',
  remainder:
    '<rect x="4" y="22" width="36" height="22" fill="#7fe3ff" stroke="#0a2340" stroke-width="1.5"/><path d="M40,28H52L58,36V44H40Z" fill="#7fe3ff" stroke="#0a2340" stroke-width="1.5"/><circle cx="14" cy="47" r="5" fill="#0a2340" stroke="#f3f6fb" stroke-width="2"/><circle cx="48" cy="47" r="5" fill="#0a2340" stroke="#f3f6fb" stroke-width="2"/><text x="22" y="37" fill="#0a2340" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">R 2</text>',
  solve:
    '<path d="M8,26L32,10L56,26Z" fill="#a9c4e4" stroke="#0a2340" stroke-width="1.5"/><rect x="10" y="26" width="44" height="30" fill="#e8eef6" stroke="#0a2340" stroke-width="1.5"/><g fill="#a9c4e4"><rect x="15" y="30" width="5" height="22"/><rect x="26" y="30" width="5" height="22"/><rect x="37" y="30" width="5" height="22"/><rect x="48" y="30" width="3" height="22"/></g>',
  boss: tower(10),
};
