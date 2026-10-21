/* Record Breakers (Grade 5 Unit 4): the problem generators, station list, and icons. Loaded by index.html and by
   tools/fuzz.mjs. Area diagrams and partial products come from shared/multiply.js; the standard algorithm for a one-digit
   factor, partial quotients, and commas from shared/blocks.js; the standard algorithm for a two-digit factor from figs.js;
   rectangles from shared/shapes.js; mcOf, miscOf, and roundTo from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Every problem also
   carries facts for checks.js: its kind (t) and the numbers it was made from, so the answer can be worked out again. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
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
/* how many columns of a × b (b one digit) carry */
const carriesOf = (a, b) => mulSteps(a, b).filter((step) => step.carry).length;
/* a × b with the carries left out: each column writes the ones digit of its digit × b (the last column writes all of it) */
const withoutCarries = (a, b) => {
  const digits = [...String(a)].reverse().map(Number);
  return digits.reduce((total, d, i) => total + (i === digits.length - 1 ? d * b : (d * b) % 10) * 10 ** i, 0);
};

/* ---------- Guess-o-Meter: estimate products (Lesson 1) ---------- */
/* a 3-digit number and a 2-digit number that round cleanly (not halfway) to a hundred and a ten */
function toEstimate() {
  let a, b;
  do {
    a = R(12, 98) * 10 + R(0, 9);
    b = R(11, 89);
  } while (a % 100 === 50 || b % 10 === 5 || b % 10 === 0 || Math.abs(a - roundTo(a, 100)) < 10);
  return [a, b];
}
function genEstimate() {
  const variant = R(0, 2),
    [a, b] = toEstimate(),
    roundA = roundTo(a, 100),
    roundB = roundTo(b, 10),
    estimate = roundA * roundB,
    product = a * b,
    name = pick(KIDS);
  if (variant === 0) {
    /* the best estimate */
    return {
      ...mcOf([
        [commas(estimate), null],
        [
          commas(estimate * 10),
          `That has one zero too many. ${roundA} × ${roundB}: ${roundA / 100} × ${roundB / 10} = ${(roundA / 100) * (roundB / 10)}, then 3 zeros.`,
        ],
        [
          commas(estimate / 10),
          `That’s missing a zero. ${roundA} × ${roundB}: ${roundA / 100} × ${roundB / 10} = ${(roundA / 100) * (roundB / 10)}, then 3 zeros.`,
        ],
      ]),
      facts: { t: "estimate", a, b },
      prompt: `Which is the best estimate for ${a} × ${b}?`,
      hint: `Round ${a} to the nearest hundred and ${b} to the nearest ten, then multiply.`,
      explain: `${a} is about ${roundA} and ${b} is about ${roundB}. ${roundA} × ${roundB} = ${commas(estimate)}. (The exact product is ${commas(product)}.)`,
    };
  }
  if (variant === 1) {
    /* is a claimed product reasonable: right, or off by a factor of 10 */
    const right = R(0, 1) === 1,
      claim = right ? product : product * 10;
    return {
      ...mcOf([
        [
          `Yes: it’s close to ${commas(estimate)}`,
          right ? null : `${commas(claim)} is about 10 times ${commas(estimate)}.`,
        ],
        [
          `No: it should be about ${commas(estimate)}`,
          right ? `${commas(claim)} is close to ${commas(estimate)}, so it’s reasonable.` : null,
        ],
        [
          `Yes: it ends in ${product % 10}`,
          `The last digit can be right while the size is wrong. Estimate: ${roundA} × ${roundB}.`,
        ],
      ]),
      facts: { t: "reasonable", a, b, claim },
      prompt: `${name} says ${a} × ${b} = ${commas(claim)}. Is that reasonable?`,
      hint: `Round both numbers and multiply: ${roundA} × ${roundB}.`,
      explain: `${roundA} × ${roundB} = ${commas(estimate)}, and ${a} × ${b} = ${commas(product)}${right ? ", so it’s reasonable." : `, not ${commas(claim)}.`}`,
    };
  }
  /* work out the estimate */
  return {
    kind: "num",
    unit: "",
    answer: estimate,
    facts: { t: "estimateNum", a, b },
    prompt: `Estimate ${a} × ${b}: round ${a} to the nearest hundred and ${b} to the nearest ten, then multiply.`,
    misc: miscOf(estimate, [
      [
        estimate / 10,
        `That’s missing a zero. ${roundA / 100} × ${roundB / 10} = ${(roundA / 100) * (roundB / 10)}, and there are 3 zeros.`,
      ],
      [estimate * 10, `That has a zero too many. ${roundA} has 2 zeros and ${roundB} has 1: 3 in all.`],
      [roundA + roundB, `That adds. Multiply ${roundA} × ${roundB}.`],
    ]).filter(([wrong]) => wrong !== estimate),
    hint: `${roundA} × ${roundB}: multiply ${roundA / 100} × ${roundB / 10}, then write the zeros.`,
    explain: `${a} is about ${roundA} and ${b} is about ${roundB}. ${roundA} × ${roundB} = ${commas(estimate)}.`,
  };
}

/* ---------- Big Build: partial products (Lessons 2–3) ---------- */
/* a 3-digit number with 2 or 3 nonzero digits and a 2-digit number with 2, whose product has at most 4 nonzero digits */
function partialPair() {
  let a, b;
  do {
    a = friendly(3, R(2, 3));
    b = friendly(2, 2);
  } while (b % 10 === 0 || nonzero(a * b) > 4 || a * b > 60000);
  return [a, b];
}
function genPartial() {
  const variant = R(0, 2),
    [a, b] = partialPair(),
    product = a * b,
    tens = Math.floor(b / 10) * 10,
    ones = b % 10,
    parts = partialsOf(a, b).map(([col, row]) => col * row);
  if (variant === 0) {
    /* the product, from the area diagram */
    return {
      kind: "num",
      unit: "",
      answer: product,
      facts: { t: "product", a, b },
      prompt: `Use partial products to find ${a} × ${b}.`,
      fig: (show) => areaModel(a, b, { filled: show ? Infinity : 0 }),
      misc: miscOf(product, [
        [a * tens, `That’s only ${a} × ${tens}. Add ${a} × ${ones} too.`],
        [a * ones + tens, `That multiplies only by ${ones}. ${b} is ${tens} + ${ones}: multiply ${a} by both.`],
        [a * tens + ones, `That adds ${ones}. Multiply ${a} by ${ones} too: ${a} × ${ones} = ${commas(a * ones)}.`],
      ]).filter(([wrong]) => wrong !== product),
      hint: `Split ${a} into ${placeParts(a).join(" + ")} and ${b} into ${tens} + ${ones}. Multiply every part by every part.`,
      explain: `${parts.map(commas).join(" + ")} = ${commas(product)}.`,
    };
  }
  if (variant === 1) {
    /* which list of partial products is right */
    const missing = placeParts(a).map((col, i) => col * (i === 0 ? tens : ones)),
      noZero = parts.map((p, i) => (i === 0 ? p / 10 : p));
    return {
      ...mcOf([
        [parts.map(commas).join(" + "), null],
        [
          missing.map(commas).join(" + "),
          `That multiplies each place by only one place. Every part of ${a} gets multiplied by ${tens} and by ${ones}.`,
        ],
        [
          noZero.map(commas).join(" + "),
          `The first one is ${placeParts(a)[0]} × ${tens} = ${commas(parts[0])}. Count the zeros.`,
        ],
      ]),
      facts: { t: "partials", a, b },
      prompt: `Which partial products add up to ${a} × ${b}?`,
      fig: () => areaModel(a, b, { filled: 0 }),
      hint: `Each piece of the area diagram is one part of ${a} times one part of ${b}: ${parts.length} pieces in all.`,
      explain: `${parts.map(commas).join(" + ")} = ${commas(product)}.`,
    };
  }
  /* one piece of the area diagram */
  const pieces = partialsOf(a, b),
    [col, row] = pick(pieces),
    piece = col * row;
  return {
    kind: "num",
    unit: "",
    answer: piece,
    facts: { t: "piece", col, row },
    prompt: `In the area diagram for ${a} × ${b}, what goes in the piece for ${col} × ${row}?`,
    fig: () => areaModel(a, b, { filled: 0 }),
    misc: miscOf(piece, [
      [piece / 10, `That’s missing a zero. ${col} × ${row}: multiply the digits, then write all the zeros.`],
      [col + row, `That adds. The piece’s area is ${col} × ${row}.`],
    ]).filter(([wrong]) => wrong !== piece && Number.isInteger(wrong)),
    hint: `Multiply the digits, then count the zeros in ${col} and ${row}.`,
    explain: `${col} × ${row} = ${commas(piece)}.`,
  };
}

/* ---------- Stack Attack: the standard algorithm (Lessons 4–9) ---------- */
function genStandard() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* a multi-digit number × a one-digit number, with one or two carries */
    let a, b;
    do {
      a = friendly(R(3, 4), R(2, 3));
      b = R(3, 9);
    } while (carriesOf(a, b) < 1 || carriesOf(a, b) > 2 || nonzero(a * b) > 4 || a * b > 40000);
    const product = a * b,
      noCarry = withoutCarries(a, b);
    return {
      kind: "num",
      unit: "",
      answer: product,
      facts: { t: "product", a, b },
      prompt: `Use the standard algorithm: what is ${commas(a)} × ${b}?`,
      fig: (show) => mulFig(a, b, show ? String(a).length : 0),
      misc: miscOf(product, [
        [noCarry, "That leaves out the carries. When a column makes 10 or more, carry the tens to the next column."],
        [a + b, `That adds. Multiply each digit of ${commas(a)} by ${b}.`],
      ]).filter(([wrong]) => wrong !== product),
      hint: `Start with the ones: ${String(a).slice(-1)} × ${b}. Carry the tens to the next column.`,
      explain: `${commas(a)} × ${b} = ${commas(product)}.`,
    };
  }
  /* a 2- or 3-digit number × a 2-digit number */
  let a, b;
  do {
    a = friendly(R(2, 3), 2);
    b = friendly(2, 2);
  } while (b % 10 === 0 || a % 10 === 0 || nonzero(a * b) > 4 || a * b > 40000);
  const [onesRow, tensRow, product] = mul2Steps(a, b),
    tensDigit = Math.floor(b / 10);
  if (variant === 1)
    return {
      kind: "num",
      unit: "",
      answer: product,
      facts: { t: "product", a, b },
      prompt: `Use the standard algorithm: what is ${a} × ${b}?`,
      fig: (show) => mul2Fig(a, b, show ? 3 : 0),
      misc: miscOf(product, [
        [
          onesRow + tensRow / 10,
          `That leaves out the 0 in the second row. It’s ${a} × ${tensDigit} tens: ${commas(tensRow)}.`,
        ],
        [onesRow, `That’s only ${a} × ${b % 10}. Add ${a} × ${tensDigit * 10} = ${commas(tensRow)}.`],
      ]).filter(([wrong]) => wrong !== product),
      hint: `First row: ${a} × ${b % 10}. Second row: ${a} × ${tensDigit * 10}. Then add.`,
      explain: `${a} × ${b % 10} = ${commas(onesRow)}, and ${a} × ${tensDigit * 10} = ${commas(tensRow)}. ${commas(onesRow)} + ${commas(tensRow)} = ${commas(product)}.`,
    };
  /* the second row of the standard algorithm */
  return {
    kind: "num",
    unit: "",
    answer: tensRow,
    facts: { t: "tensRow", a, b },
    prompt: `In the standard algorithm for ${a} × ${b}, the first row is ${commas(onesRow)}. What is the second row?`,
    fig: (show) => mul2Fig(a, b, show ? 2 : 1),
    misc: miscOf(tensRow, [
      [
        tensRow / 10,
        `The ${tensDigit} in ${b} means ${tensDigit} tens, so the second row is ${a} × ${tensDigit * 10}: it ends in 0.`,
      ],
      [product, "That’s the whole product. The second row is just the tens digit’s part."],
    ]).filter(([wrong]) => wrong !== tensRow),
    hint: `The second row multiplies ${a} by the ${tensDigit} in the tens place: ${a} × ${tensDigit * 10}.`,
    explain: `${a} × ${tensDigit * 10} = ${commas(tensRow)}.`,
  };
}

/* ---------- Dance Floor: partial quotients (Lessons 10–14) ---------- */
/* divisors that are friendly to divide by */
const DIVISORS = [11, 12, 15, 20, 25, 30, 40, 50];
/* n ÷ d with no remainder, a 2-digit quotient, and n at most 2,500 */
function division() {
  let d, q;
  do {
    d = pick(DIVISORS);
    q = R(12, 99);
  } while (d * q > 2500 || q % 10 === 0);
  return [d * q, d, q];
}
/* the partial quotients of a 2-digit quotient: its tens, then its ones */
const chunksOf = (q) => [Math.floor(q / 10) * 10, q % 10];
function genQuotients() {
  const variant = R(0, 2),
    [n, d, q] = division(),
    [tensChunk, onesChunk] = chunksOf(q),
    name = pick(KIDS);
  if (variant === 0) {
    /* a story: rows of dancers */
    return {
      kind: "num",
      unit: "rows",
      answer: q,
      facts: { t: "quotient", n, d },
      prompt: `For a world-record folk dance, ${commas(n)} dancers stand in rows of ${d}. How many rows are there?`,
      fig: (show) => quotientFig(n, d, chunksOf(q), show ? Infinity : 0),
      misc: miscOf(q, [
        [
          tensChunk,
          `That’s only the first partial quotient. After taking away ${tensChunk} × ${d}, ${commas(n - tensChunk * d)} dancers are left.`,
        ],
        [n - d, `That subtracts ${d} once. Find how many groups of ${d} make ${commas(n)}: divide.`],
      ]).filter(([wrong]) => wrong !== q),
      hint: `How many groups of ${d} can you take away at once? Try ${tensChunk} × ${d} = ${commas(tensChunk * d)}.`,
      explain: `${tensChunk} × ${d} = ${commas(tensChunk * d)}, leaving ${commas(n - tensChunk * d)}. ${onesChunk} × ${d} = ${onesChunk * d}. ${tensChunk} + ${onesChunk} = ${q} rows.`,
    };
  }
  if (variant === 1) {
    /* what's left after the first partial quotient */
    const left = n - tensChunk * d;
    return {
      kind: "num",
      unit: "",
      answer: left,
      facts: { t: "left", n, d, chunk: tensChunk },
      prompt: `${name} divides ${commas(n)} ÷ ${d} with partial quotients and starts with ${tensChunk}. What is left after taking away ${tensChunk} groups of ${d}?`,
      fig: (show) => quotientFig(n, d, [tensChunk], show ? 1 : 0),
      misc: miscOf(left, [
        [tensChunk * d, `That’s what’s taken away: ${tensChunk} × ${d}. Subtract it from ${commas(n)}.`],
        [
          n - tensChunk,
          `That subtracts ${tensChunk}. Take away ${tensChunk} groups of ${d}: ${tensChunk} × ${d} = ${commas(tensChunk * d)}.`,
        ],
      ]).filter(([wrong]) => wrong !== left),
      hint: `${tensChunk} groups of ${d} is ${tensChunk} × ${d}. Subtract that from ${commas(n)}.`,
      explain: `${tensChunk} × ${d} = ${commas(tensChunk * d)}. ${commas(n)} − ${commas(tensChunk * d)} = ${commas(left)}.`,
    };
  }
  /* which partial quotients work: they must add up to the quotient */
  const right =
      q >= 20 && R(0, 1) ? [tensChunk - 10, 10, onesChunk].filter((c) => c > 0) : chunksOf(q).filter((c) => c > 0),
    short = [tensChunk],
    over = [tensChunk, onesChunk + 1];
  return {
    ...mcOf([
      [right.join(" + "), null],
      [
        short.join(" + "),
        `${tensChunk} × ${d} = ${commas(tensChunk * d)} leaves ${commas(n - tensChunk * d)}, so you’re not done.`,
      ],
      [over.join(" + "), `${tensChunk + onesChunk + 1} × ${d} = ${commas((q + 1) * d)}, more than ${commas(n)}.`],
    ]),
    facts: { t: "chunks", n, d },
    prompt: `Which partial quotients work for ${commas(n)} ÷ ${d}?`,
    fig: (show) => quotientFig(n, d, right, show ? Infinity : 0),
    hint: `The partial quotients must add up to the number of ${d}s in ${commas(n)}: no more, no fewer.`,
    explain: `${right.join(" + ")} = ${q}, and ${q} × ${d} = ${commas(n)}.`,
  };
}

/* ---------- Noodle Soup: missing side lengths and equal shares (Lessons 15–16) ---------- */
function genSides() {
  const variant = R(0, 2),
    [n, d, q] = division();
  if (variant === 0) {
    /* a missing side of a rectangle */
    const side = Math.max(d, q),
      other = Math.min(d, q);
    return {
      kind: "num",
      unit: "feet",
      answer: side,
      facts: { t: "side", area: n, known: other },
      prompt: `A rectangular dance floor has an area of ${commas(n)} square feet. One side is ${other} feet long. How long is the other side?`,
      fig: (show) => rectFig(side, other, { unit: "ft", ask: show ? null : "length", grid: false }),
      misc: miscOf(side, [
        [n - other, `That subtracts. Area = length × width, so divide: ${commas(n)} ÷ ${other}.`],
        [n * other, `That multiplies. The area is already the product: divide by ${other}.`],
      ]).filter(([wrong]) => wrong !== side),
      hint: `${other} × ? = ${commas(n)}. Divide ${commas(n)} by ${other}.`,
      explain: `${commas(n)} ÷ ${other} = ${side}, since ${other} × ${side} = ${commas(n)}. The other side is ${side} feet.`,
    };
  }
  /* noodle soup in bowls, or noodles in bundles */
  const story =
    variant === 1
      ? `A world-record pot holds ${commas(n)} ounces of noodle soup. Each bowl holds ${d} ounces. How many bowls can be filled?`
      : `A noodle shop makes ${commas(n)} noodles and ties them in bundles of ${d}. How many bundles is that?`;
  return {
    kind: "num",
    unit: variant === 1 ? "bowls" : "bundles",
    answer: q,
    facts: { t: "quotient", n, d },
    prompt: story,
    fig: (show) => quotientFig(n, d, chunksOf(q), show ? Infinity : 0),
    misc: miscOf(q, [
      [n * d, `That multiplies. Find how many groups of ${d} fit in ${commas(n)}: divide.`],
      [Math.floor(q / 10) * 10, "That’s only the first partial quotient. Keep going until nothing is left."],
    ]).filter(([wrong]) => wrong !== q),
    hint: `How many ${d}s are in ${commas(n)}? Start with ${Math.floor(q / 10) * 10} × ${d}.`,
    explain: `${commas(n)} ÷ ${d} = ${q}, since ${q} × ${d} = ${commas(n)}.`,
  };
}

/* ---------- Recycling Center: problems with many steps (Lessons 18–20) ---------- */
function genWork() {
  const variant = R(0, 2),
    name = pick(KIDS);
  if (variant === 0) {
    /* cartons of milk a day for many days, packed in cases */
    let perDay, days, perCase;
    do {
      perDay = pick([120, 150, 180, 240, 250, 300]);
      days = R(2, 5) * 5;
      perCase = pick([20, 25, 30, 50]);
    } while ((perDay * days) % perCase !== 0);
    const cartons = perDay * days,
      cases = cartons / perCase;
    return {
      kind: "num",
      unit: "cases",
      answer: cases,
      facts: { t: "milk", perDay, days, perCase },
      prompt: `A school serves ${perDay} cartons of milk a day. Milk comes in cases of ${perCase} cartons. How many cases does the school need for ${days} school days?`,
      misc: miscOf(cases, [
        [
          cartons,
          `That’s the cartons: ${perDay} × ${days} = ${commas(cartons)}. Now divide by ${perCase} to find the cases.`,
        ],
        [perDay / perCase, `That’s the cases for 1 day. The school needs milk for ${days} days.`],
      ]).filter(([wrong]) => wrong !== cases && Number.isInteger(wrong)),
      hint: `First find all the cartons: ${perDay} × ${days}. Then how many cases of ${perCase}?`,
      explain: `${perDay} × ${days} = ${commas(cartons)} cartons. ${commas(cartons)} ÷ ${perCase} = ${cases} cases.`,
    };
  }
  if (variant === 1) {
    /* pounds of trash from many homes over weeks */
    const perHome = pick([25, 30, 35, 40, 45]),
      homes = pick([12, 15, 20, 24]),
      weeks = R(2, 4),
      total = perHome * homes * weeks;
    return {
      kind: "num",
      unit: "pounds",
      answer: total,
      facts: { t: "trash", perHome, homes, weeks },
      prompt: `Each home on ${name}’s street throws away about ${perHome} pounds of trash a week. There are ${homes} homes. About how many pounds of trash does the street throw away in ${weeks} weeks?`,
      misc: miscOf(total, [
        [perHome * homes, `That’s 1 week. Multiply by ${weeks} weeks too.`],
        [perHome * weeks, `That’s 1 home. Multiply by ${homes} homes too.`],
      ]).filter(([wrong]) => wrong !== total),
      hint: `Find the street’s trash for 1 week, ${perHome} × ${homes}, then multiply by ${weeks}.`,
      explain: `${perHome} × ${homes} = ${commas(perHome * homes)} pounds a week. ${commas(perHome * homes)} × ${weeks} = ${commas(total)} pounds.`,
    };
  }
  /* trips for a truck, rounding up so everything goes */
  let load, trips, pounds;
  do {
    load = pick([200, 250, 300, 400, 500]);
    pounds = R(11, 39) * 100;
    trips = Math.ceil(pounds / load);
  } while (pounds % load === 0 || trips > 19);
  return {
    kind: "num",
    unit: "trips",
    answer: trips,
    facts: { t: "trips", load, pounds },
    prompt: `A recycling truck carries ${load} pounds of paper on each trip. The center has ${commas(pounds)} pounds of paper, and all of it must go. How many trips does the truck make?`,
    misc: miscOf(trips, [
      [trips - 1, `That leaves ${commas(pounds - (trips - 1) * load)} pounds behind. One more trip takes the rest.`],
      [pounds - load, `That subtracts one load. Find how many loads of ${load} it takes: divide.`],
    ]).filter(([wrong]) => wrong !== trips),
    hint: `${commas(pounds)} ÷ ${load}: if there’s a remainder, the leftover paper needs one more trip.`,
    explain: `${trips - 1} × ${load} = ${commas((trips - 1) * load)}, which leaves ${commas(pounds - (trips - 1) * load)} pounds. That needs 1 more trip: ${trips} trips.`,
  };
}

/* ---------- World Record: the final round ---------- */
const genBoss = () => pick([genEstimate, genPartial, genStandard, genQuotients, genSides, genWork])();

const ZONES = [
  {
    id: "estimate",
    name: "Guess-o-Meter",
    lessons: "Lesson 1",
    blurb: "Estimate products with friendly numbers, and check whether an answer makes sense.",
    gen: genEstimate,
  },
  {
    id: "partial",
    name: "Big Build",
    lessons: "Lessons 2–3",
    blurb: "Multiply 3-digit by 2-digit numbers with area diagrams and partial products.",
    gen: genPartial,
  },
  {
    id: "standard",
    name: "Stack Attack",
    lessons: "Lessons 4–9",
    blurb: "Multiply with the standard algorithm, by one-digit and two-digit numbers.",
    gen: genStandard,
  },
  {
    id: "quotients",
    name: "Dance Floor",
    lessons: "Lessons 10–14",
    blurb: "Divide by two-digit numbers with partial quotients.",
    gen: genQuotients,
  },
  {
    id: "sides",
    name: "Noodle Soup",
    lessons: "Lessons 15–16",
    blurb: "Find missing side lengths, and fill bowls of noodle soup.",
    gen: genSides,
  },
  {
    id: "work",
    name: "Recycling Center",
    lessons: "Lessons 18–20",
    blurb: "Solve problems with many steps about milk, trash, and recycling trucks.",
    gen: genWork,
  },
  {
    id: "boss",
    name: "World Record",
    lessons: "All lessons",
    blurb: "Go for the record! Every right answer earns another medal.",
    gen: genBoss,
  },
];

/* the medal board with `won` of its 10 medals, in two rows of 5 (the boss icon has all of them) */
const medals = (won) =>
  range(10)
    .map((i) => {
      const x = 10 + (i % 5) * 11,
        y = i < 5 ? 22 : 46;
      return i < won
        ? `<path d="M${x - 3},${y - 14}L${x},${y - 6}L${x + 3},${y - 14}" fill="none" stroke="#c9584b" stroke-width="2.5"/><circle cx="${x}" cy="${y}" r="5" fill="#ffc93c" stroke="#0a2340" stroke-width="1"/>`
        : `<circle cx="${x}" cy="${y}" r="5" fill="none" stroke="rgba(243,246,251,.3)" stroke-width="1.5"/>`;
    })
    .join("");
const ICON = {
  estimate:
    '<path d="M8,46A24,24 0 0 1 56,46" fill="none" stroke="#f3f6fb" stroke-width="3"/><path d="M32,46L46,26" stroke="#ffc93c" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="46" r="4" fill="#ffc93c"/><text x="32" y="60" fill="#7fe3ff" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">≈ 8,000</text>',
  partial:
    '<g stroke-width="2"><rect x="6" y="12" width="30" height="26" fill="rgba(255,201,60,.3)" stroke="#ffc93c"/><rect x="36" y="12" width="14" height="26" fill="rgba(127,227,255,.3)" stroke="#7fe3ff"/><rect x="50" y="12" width="8" height="26" fill="rgba(255,201,60,.3)" stroke="#ffc93c"/><rect x="6" y="38" width="30" height="14" fill="rgba(127,227,255,.3)" stroke="#7fe3ff"/><rect x="36" y="38" width="14" height="14" fill="rgba(255,201,60,.3)" stroke="#ffc93c"/><rect x="50" y="38" width="8" height="14" fill="rgba(127,227,255,.3)" stroke="#7fe3ff"/></g>',
  standard:
    '<g fill="#f3f6fb" font-size="11" font-weight="700" text-anchor="end" font-family="monospace"><text x="54" y="16">347</text><text x="54" y="28">× 26</text></g><path d="M14,32H56M14,50H56" stroke="#f3f6fb" stroke-width="1.5"/><g fill="#ffc93c" font-size="10" font-weight="700" text-anchor="end" font-family="monospace"><text x="54" y="42">2082</text><text x="54" y="61">9022</text></g>',
  quotients:
    '<g fill="#7fe3ff"><circle cx="14" cy="18" r="5"/><circle cx="32" cy="18" r="5"/><circle cx="50" cy="18" r="5"/><circle cx="14" cy="40" r="5"/><circle cx="32" cy="40" r="5"/><circle cx="50" cy="40" r="5"/></g><g stroke="#ffc93c" stroke-width="3" stroke-linecap="round"><path d="M14,23V34M32,23V34M50,23V34M14,45V56M32,45V56M50,45V56"/></g>',
  sides:
    '<path d="M10,30H54L48,52H16Z" fill="#f3f6fb" stroke="#0a2340" stroke-width="1.5"/><path d="M14,30Q22,22 30,30T46,30" fill="none" stroke="#ffc93c" stroke-width="2.5"/><path d="M40,8L28,30M48,8L34,30" stroke="#c9584b" stroke-width="2.5" stroke-linecap="round"/>',
  work: '<path d="M20,10L28,24H12Z" fill="#5fe0a8"/><path d="M48,24L56,38H40Z" fill="#5fe0a8" transform="rotate(120 48 31)"/><path d="M18,42L26,56H10Z" fill="#5fe0a8" transform="rotate(240 18 49)"/><circle cx="32" cy="34" r="16" fill="none" stroke="#5fe0a8" stroke-width="3" stroke-dasharray="20 8"/>',
  boss: medals(10),
};
