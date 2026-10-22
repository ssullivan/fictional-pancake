/* Track Meet (Grade 5 Unit 5): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Decimals are kept as whole numbers of thousandths (k) and written with dec(k) or in words with decWords(k); thousandths grids, number lines, rounding
   lines, and tenths strips come from figs.js; place-value charts and number words from shared/blocks.js; area diagrams from
   shared/fractions.js; mcOf and miscOf from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Every problem also
   carries facts for checks.js: its kind (t) and the numbers it was made from, in thousandths, so the answer can be worked out
   again. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* the place names after the decimal point, and how many thousandths one of each is */
const DEC_PLACES = [
  ["tenths", 100],
  ["hundredths", 10],
  ["thousandths", 1],
];
/* the answer as a number of thousandths k, for a typed answer */
const value = (k) => k / 1000;
/* named mistakes, leaving out any that aren't positive or are within the game's tolerance of the answer */
const apart = (answer, list) =>
  miscOf(
    answer,
    list.filter(([wrong]) => wrong > 0 && Math.abs(wrong - answer) > 0.0004),
  );

/* ---------- Starting Blocks: thousandths (Lessons 1–4) ---------- */
/* a decimal with three different nonzero digits after the point, and maybe a whole number (k thousandths) */
function threePlaces() {
  let digits;
  do digits = [R(1, 9), R(1, 9), R(1, 9)];
  while (new Set(digits).size < 3);
  return R(0, 9) * 1000 + digits[0] * 100 + digits[1] * 10 + digits[2];
}
function genRead() {
  const variant = R(0, 4);
  if (variant === 0) {
    /* words to a decimal; when the part after the point has fewer digits than its place needs, it takes a 0 */
    let k;
    do k = R(0, 3) * 1000 + pick([R(1, 9) * 100 + R(1, 9), R(1, 9) * 10 + R(1, 9), R(1, 9), R(11, 99) * 10]);
    while (placesOf(k) < 2);
    const whole = Math.floor(k / 1000),
      part = (k % 1000) / 10 ** (3 - placesOf(k)),
      /* writing the part's digits right after the point, without the 0 its place needs */
      noZero = whole * 1000 + part * 10 ** (3 - String(part).length);
    return {
      kind: "num",
      unit: "",
      answer: value(k),
      facts: { t: "words", k },
      prompt: `Write ${decWords(k)} as a decimal.`,
      misc: apart(value(k), [
        ...(noZero !== k
          ? [
              [
                value(noZero),
                `${part} ${["", "tenths", "hundredths", "thousandths"][placesOf(k)]} needs ${placesOf(k)} digits after the point. Write a 0 in the empty place.`,
              ],
            ]
          : []),
        [part, "That’s a whole number. The digits go after the decimal point."],
      ]),
      hint: "Thousandths take 3 digits after the decimal point; hundredths take 2. Fill any empty place with 0.",
      explain: `${decWords(k)[0].toUpperCase() + decWords(k).slice(1)} is ${dec(k)}.`,
    };
  }
  if (variant === 1) {
    /* the value of one digit */
    const k = threePlaces(),
      [placeName, size] = pick(DEC_PLACES),
      digit = Math.floor((k % 1000) / size) % 10,
      answer = digit * size;
    return {
      kind: "num",
      unit: "",
      answer: value(answer),
      facts: { t: "digit", k, size },
      prompt: `What is the value of the digit ${digit} in ${dec(k)}?`,
      misc: apart(value(answer), [
        [digit, `${digit} is the digit. It’s in the ${placeName} place, so it’s worth ${digit} ${placeName}.`],
        ...DEC_PLACES.filter(([name]) => name !== placeName).map(([name, other]) => [
          value(digit * other),
          `That’s ${digit} ${name}. Count the places after the point: the ${digit} is in the ${placeName} place.`,
        ]),
      ]),
      hint: `The places after the decimal point are tenths, hundredths, then thousandths.`,
      explain: `The ${digit} is in the ${placeName} place, so it’s worth ${digit} ${placeName}: ${dec(answer)}.`,
    };
  }
  if (variant === 2) {
    /* expanded form to a decimal, with a 0 in the hundredths or tenths */
    const whole = R(1, 9),
      skip = R(0, 1),
      parts = skip ? [R(1, 9) * 100, R(1, 9)] : [R(1, 9) * 10, R(1, 9)],
      k = whole * 1000 + parts[0] + parts[1];
    return {
      kind: "num",
      unit: "",
      answer: value(k),
      facts: { t: "expanded", whole, parts },
      prompt: `What number is ${whole} + ${dec(parts[0])} + ${dec(parts[1])}?`,
      misc: apart(value(k), [
        [
          value(whole * 1000 + (skip ? parts[0] + parts[1] * 10 : parts[0] * 10 + parts[1] * 10)),
          `The ${parts[1]} is ${parts[1]} thousandths: it goes 3 places after the point. Write 0 in the empty place.`,
        ],
      ]),
      hint: `Line up the places: ones, tenths, hundredths, thousandths. Write 0 in any place that’s empty.`,
      explain: `${whole} + ${dec(parts[0])} + ${dec(parts[1])} = ${dec(k)}.`,
    };
  }
  if (variant === 3) {
    /* a fraction over 1,000 to a decimal */
    const n = pick([R(1, 9), R(11, 99), R(101, 999)].filter((x) => x % 10)),
      answer = value(n);
    return {
      kind: "num",
      unit: "",
      answer,
      facts: { t: "fraction", n },
      prompt: `Write ${fr(n, 1000)} as a decimal.`,
      fig: () => thousandthsFig(n),
      misc: apart(answer, [
        ...(n < 100
          ? [[n / 100, `That’s ${n} hundredths. ${fr(n, 1000)} is thousandths: 3 digits after the point.`]]
          : []),
        [n, "That’s a whole number. Thousandths go after the decimal point."],
      ]),
      hint: `${fr(1, 1000)} is 0.001. Thousandths take 3 places after the point.`,
      explain: `${fr(n, 1000)} = ${dec(n)}: ${n} thousandths.`,
    };
  }
  /* which decimal is the same as a tenth: zeros at the end don't change it */
  const tenths = R(1, 9);
  return {
    ...mcOf([
      [`0.${tenths}00`, null],
      [`0.00${tenths}`, `That’s ${tenths} thousandths, much less than ${tenths} tenths.`],
      [`0.0${tenths}`, `That’s ${tenths} hundredths, less than ${tenths} tenths.`],
    ]),
    facts: { t: "same", k: tenths * 100 },
    prompt: `Which decimal is the same as 0.${tenths}?`,
    fig: () => thousandthsFig(tenths * 100),
    hint: `${tenths} tenths is ${tenths * 10} hundredths, and ${tenths * 100} thousandths.`,
    explain: `0.${tenths} = 0.${tenths}0 = 0.${tenths}00: zeros at the end don’t change the value.`,
  };
}

/* ---------- Photo Finish: compare and order (Lessons 5–6, 9–10) ---------- */
/* two race times in thousandths of a second, 11 to 19 seconds, that look tricky: different numbers of places */
function twoTimes() {
  const whole = R(11, 19) * 1000,
    kind = R(0, 2);
  if (kind === 0) {
    /* a tenth against hundredths: 12.4 and 12.38 */
    const tenth = R(2, 8) * 100;
    return [whole + tenth, whole + tenth + pick([-1, 1]) * R(1, 9) * 10];
  }
  if (kind === 1) {
    /* same digits in different places: 12.307 and 12.37 */
    const a = R(1, 9),
      b = R(1, 9);
    return [whole + a * 100 + b, whole + a * 100 + b * 10];
  }
  /* hundredths against thousandths */
  const base = R(10, 98) * 10;
  return [whole + base, whole + base + pick([-1, 1]) * R(1, 9)];
}
function genCompare() {
  const variant = R(0, 2),
    [first, second] = shuffle(KIDS).slice(0, 2);
  if (variant === 0) {
    /* who was faster: the smaller time */
    const [a, b] = twoTimes(),
      faster = a < b ? first : second;
    return {
      ...mcOf([
        [first, faster === first ? null : `${first}’s time, ${dec(a)}, is more than ${dec(b)}. Less time is faster.`],
        [
          second,
          faster === second ? null : `${second}’s time, ${dec(b)}, is more than ${dec(a)}. Less time is faster.`,
        ],
        ["They tied", `${dec(a)} and ${dec(b)} aren’t equal. Compare place by place, from the left.`],
      ]),
      facts: { t: "faster", a, b, first, second },
      prompt: `${first} ran the 100-meter dash in ${dec(a)} seconds. ${second} ran it in ${dec(b)} seconds. Who was faster?`,
      hint: "Line up the places and compare from the left. The faster runner has the smaller time.",
      explain: `${dec(Math.min(a, b))} < ${dec(Math.max(a, b))}, so ${faster} was faster.`,
    };
  }
  if (variant === 1) {
    /* order three numbers from least to greatest */
    let list;
    do {
      const tenth = R(2, 7) * 100;
      list = shuffle([tenth, tenth + R(1, 9) * 10 + R(0, 1) * R(1, 9), tenth + R(1, 9)]);
    } while (new Set(list).size < 3);
    const sorted = [...list].sort((x, y) => x - y),
      byLength = [...list].sort((x, y) => placesOf(x) - placesOf(y) || x - y),
      backwards = [...sorted].reverse();
    const show = (order) => order.map(dec).join(", ");
    return {
      ...mcOf(
        [
          [show(sorted), null],
          [show(byLength), "That orders them by how many digits they have. Compare place by place instead."],
          [show(backwards), "That’s greatest to least. Start with the least."],
        ].filter(([label], i, all) => all.findIndex(([other]) => other === label) === i),
      ),
      facts: { t: "order", list },
      prompt: `Order from least to greatest: ${list.map(dec).join(", ")}.`,
      hint: "Compare the tenths first, then the hundredths, then the thousandths.",
      explain: `${show(sorted)}.`,
    };
  }
  /* tap a thousandth on a number line between two hundredths */
  const lo = R(10, 98) * 10,
    k = lo + R(1, 9);
  return {
    kind: "tap",
    answer: String(k),
    facts: { t: "line", k, lo },
    prompt: `Tap ${dec(k)} on the number line.`,
    fig: () =>
      thouLine(lo, lo + 10, 1, {
        tap: "cand",
        label: `A number line from ${dec(lo)} to ${dec(lo + 10)} in thousandths`,
      }),
    hint: `${dec(lo)} is ${lo} thousandths. Each tick is 1 thousandth more.`,
    explain: `${dec(k)} is ${k - lo} thousandths past ${dec(lo)}.`,
  };
}

/* ---------- Scoreboard: round decimals (Lessons 7–8) ---------- */
/* rounding to a whole number, a tenth, or a hundredth: [name, the place's size in thousandths] */
const ROUND_TO = [
  ["the nearest whole number", 1000],
  ["the nearest tenth", 100],
  ["the nearest hundredth", 10],
];
/* k rounded to the nearest unit (in thousandths; halfway rounds up) */
const roundK = (k, unit) => Math.floor(k / unit + 0.5) * unit;
/* k thousandths written to the place of unit, keeping a 0 at the end: fixed(3500, 10) is "3.50" */
const fixed = (k, unit) => (k / 1000).toFixed({ 1000: 0, 100: 1, 10: 2 }[unit]);
function genRound() {
  const variant = R(0, 2),
    [placeName, unit] = pick(ROUND_TO),
    name = pick(KIDS);
  let k;
  /* three places, never exactly halfway, and not already round */
  do k = R(1, 19) * 1000 + R(100, 999);
  while (k % 10 === 0 || (k % unit) * 2 === unit || (unit < 1000 && roundK(k, unit) % 1000 === 0));
  const answer = roundK(k, unit),
    down = Math.floor(k / unit) * unit,
    up = down + unit,
    other = answer === down ? up : down;
  if (variant === 1) {
    /* which number rounds to a given one */
    const target = answer,
      inside = k,
      outsideLow = target - unit / 2 - pick([1, unit / 10]),
      outsideHigh = target + unit / 2 + pick([0, unit / 10]);
    return {
      ...mcOf([
        [dec(inside), null],
        [dec(outsideLow), `${dec(outsideLow)} is closer to ${dec(target - unit)}.`],
        [dec(outsideHigh), `${dec(outsideHigh)} is halfway or more to ${dec(target + unit)}, so it rounds up to it.`],
      ]),
      facts: { t: "roundsTo", target, unit },
      prompt: `Which number rounds to ${fixed(target, unit)} when rounded to ${placeName}?`,
      hint: `A number rounds to ${fixed(target, unit)} if it’s less than halfway to the next ${placeName.replace("the nearest ", "")} on either side.`,
      explain: `${dec(inside)} is between ${fixed(Math.floor(inside / unit) * unit, unit)} and ${fixed(Math.floor(inside / unit) * unit + unit, unit)}, closer to ${fixed(target, unit)}.`,
    };
  }
  return {
    kind: "num",
    unit: variant === 2 ? "seconds" : "",
    answer: value(answer),
    facts: { t: "round", k, unit },
    prompt:
      variant === 0
        ? `Round ${dec(k)} to ${placeName}.`
        : `The scoreboard shows times rounded to ${placeName}. ${name} ran the 100-meter dash in ${dec(k)} seconds. What does the scoreboard show?`,
    fig: () => roundFig(k, unit),
    misc: apart(value(answer), [
      [
        value(other),
        `${dec(k)} is closer to ${fixed(answer, unit)} than to ${fixed(other, unit)}. Look at the next place to the right.`,
      ],
      ...ROUND_TO.filter(([, size]) => size !== unit).map(([otherName, size]) => [
        value(roundK(k, size)),
        `That rounds to ${otherName}. This asks for ${placeName}.`,
      ]),
    ]),
    hint: `${dec(k)} is between ${fixed(down, unit)} and ${fixed(up, unit)}. Which is it closer to? Halfway is ${dec(down + unit / 2)}.`,
    explain: `${dec(k)} is between ${fixed(down, unit)} and ${fixed(up, unit)}, and ${answer === up ? "past" : "before"} the halfway point, ${dec(down + unit / 2)}. It rounds to ${fixed(answer, unit)}.`,
  };
}

/* ---------- Relay Race: add and subtract decimals (Lessons 11–16) ---------- */
/* two decimals, one in hundredths and one in tenths, that add with at most one regroup */
function addPair() {
  let a, b;
  do {
    a = R(1, 9) * 1000 + R(1, 9) * 100 + R(1, 9) * 10;
    b = R(1, 9) * 1000 + R(1, 9) * 100;
  } while (((a % 1000) + (b % 1000) >= 1000) + ((a % 100) / 10 >= 10) > 1 || a + b > 19000);
  return [a, b];
}
function genAddSub() {
  const variant = R(0, 2),
    name = pick(KIDS),
    [a, b] = addPair();
  if (variant === 0) {
    /* add: two legs of a relay */
    const answer = a + b,
      /* lining up the last digits instead of the places: b's tenths added to a's hundredths */
      misaligned = a + b / 10;
    return {
      kind: "num",
      unit: "seconds",
      answer: value(answer),
      facts: { t: "add", a, b },
      prompt: `In a relay, ${name} runs the first leg in ${dec(a)} seconds and a teammate runs the second in ${dec(b)} seconds. What is their total time?`,
      fig: (show) =>
        pvChart([["", value(a)], ["+", value(b)], ...(show ? [["=", value(answer)]] : [])], -1, {
          places: [1, 0, -1, -2],
        }),
      misc: apart(value(answer), [
        [value(misaligned), `That lines up the last digits. Line up the decimal points: tenths with tenths.`],
        [
          value(Math.floor(a / 1000) * 1000 + Math.floor(b / 1000) * 1000),
          "That adds only the whole seconds. Add the tenths and hundredths too.",
        ],
      ]),
      hint: `Line up the decimal points. ${dec(b)} is ${dec(b)}0: add hundredths, then tenths, then ones.`,
      explain: `${dec(a)} + ${dec(b)} = ${dec(answer)} seconds.`,
    };
  }
  if (variant === 1) {
    /* subtract: how much faster */
    const [big, small] = a > b ? [a, b] : [b, a],
      answer = big - small;
    if (answer === 0) return genAddSub();
    const misaligned = Math.abs(big - small / 10);
    return {
      kind: "num",
      unit: "seconds",
      answer: value(answer),
      facts: { t: "subtract", big, small },
      prompt: `One lap of the track took ${dec(big)} seconds. The next lap took ${dec(small)} seconds. How much faster was the second lap?`,
      fig: (show) =>
        pvChart([["", value(big)], ["−", value(small)], ...(show ? [["=", value(answer)]] : [])], -1, {
          places: [1, 0, -1, -2],
        }),
      misc: apart(value(answer), [
        [value(misaligned), "That lines up the last digits. Line up the decimal points: tenths under tenths."],
        [value(big + small), "That adds. How much faster: subtract."],
      ]),
      hint: `Line up the decimal points, then subtract place by place. Write ${dec(small)} as ${(small / 1000).toFixed(2)} if that helps.`,
      explain: `${dec(big)} − ${dec(small)} = ${dec(answer)} seconds.`,
    };
  }
  /* a reasonable estimate of a sum */
  const estimate = Math.round(a / 1000) + Math.round(b / 1000);
  return {
    ...mcOf([
      [String(estimate), null],
      [
        String(estimate * 10),
        `${dec(a)} is about ${Math.round(a / 1000)}, not ${Math.round(a / 1000) * 10}. Round each to a whole number.`,
      ],
      [
        dec(Math.round(a / 1000) * 1000 + Math.round(b / 1000) * 100),
        "That adds the second number as tenths. Round each to a whole number, then add.",
      ],
    ]),
    facts: { t: "estimate", a, b },
    prompt: `Which is the best estimate of ${dec(a)} + ${dec(b)}?`,
    hint: "Round each number to the nearest whole number, then add.",
    explain: `${dec(a)} is about ${Math.round(a / 1000)} and ${dec(b)} is about ${Math.round(b / 1000)}: about ${estimate}. (Exactly ${dec(a + b)}.)`,
  };
}

/* ---------- Long Jump: multiply decimals (Lessons 17–21) ---------- */
function genMultiply() {
  const variant = R(0, 3),
    name = pick(KIDS);
  if (variant === 0) {
    /* a whole number × tenths, as equal groups */
    const n = R(2, 9),
      tenths = R(2, 9),
      product = n * tenths * 100;
    return {
      kind: "num",
      unit: "kilometers",
      answer: value(product),
      facts: { t: "times", n, k: tenths * 100 },
      prompt: `Each lap of the cross-country loop is ${dec(tenths * 100)} kilometer. ${name} runs ${n} laps. How far is that?`,
      fig: (show) => (show ? tenthsFig(n * tenths, tenths) : tenthsFig(tenths, tenths, `${tenths} tenths: one lap`)),
      misc: apart(value(product), [
        [value(product / 10), `That’s ${n * tenths} hundredths. ${n} × ${tenths} tenths is ${n * tenths} tenths.`],
        [n * tenths, `That’s ${n * tenths} whole kilometers. It’s ${n * tenths} tenths.`],
      ]),
      hint: `${n} × ${tenths} tenths = ${n * tenths} tenths. How many wholes and tenths is that?`,
      explain: `${n} × ${tenths} tenths is ${n * tenths} tenths: ${n} × ${dec(tenths * 100)} = ${dec(product)} kilometers.`,
    };
  }
  if (variant === 1) {
    /* a whole number × hundredths, from a whole-number fact */
    const n = R(2, 9),
      hundredths = R(2, 9),
      product = n * hundredths * 10;
    return {
      kind: "num",
      unit: "",
      answer: value(product),
      facts: { t: "times", n, k: hundredths * 10 },
      prompt: `What is ${n} × ${dec(hundredths * 10)}? (Use ${n} × ${hundredths} = ${n * hundredths}.)`,
      misc: apart(value(product), [
        [
          value(product * 10),
          `That’s ${n * hundredths} tenths. ${dec(hundredths * 10)} is hundredths, so the product is ${n * hundredths} hundredths.`,
        ],
        [value(product / 10), `That’s ${n * hundredths} thousandths. ${dec(hundredths * 10)} is hundredths.`],
      ]),
      hint: `${n} × ${hundredths} hundredths = ${n * hundredths} hundredths.`,
      explain: `${n} × ${hundredths} = ${n * hundredths}, so ${n} × ${dec(hundredths * 10)} is ${n * hundredths} hundredths: ${dec(product)}.`,
    };
  }
  /* tenths × tenths on a square, or a tenth × a number with a whole part */
  const a = variant === 2 ? R(1, 9) : R(11, 19),
    b = R(2, 9),
    product = a * b * 10;
  return {
    kind: "num",
    unit: variant === 2 ? "" : "meters",
    answer: value(product),
    facts: { t: "tenthsTimes", a, b },
    prompt:
      variant === 2
        ? `What is ${dec(a * 100)} × ${dec(b * 100)}?`
        : `${name}’s long jump was ${dec(a * 100)} meters. A frog’s jump was ${dec(b * 100)} as long. How long was the frog’s jump?`,
    fig: () =>
      areaFig([a, 10], [b, 10], {
        under: true,
        dec: true,
        split: a > 10 ? "w" : null,
        label: `${dec(a * 100)} × ${dec(b * 100)} on unit squares cut into hundredths`,
      }),
    misc: apart(value(product), [
      [value(product * 10), `That’s ${a * b} tenths. Tenths × tenths make hundredths: ${a * b} hundredths.`],
      [value(product / 10), `That’s ${a * b} thousandths. Tenths × tenths make hundredths.`],
    ]),
    hint: `${a} tenths × ${b} tenths = ${a * b} hundredths, since a tenth of a tenth is a hundredth.`,
    explain: `${a} × ${b} = ${a * b}, and tenths × tenths are hundredths: ${dec(a * 100)} × ${dec(b * 100)} = ${dec(product)}.`,
  };
}

/* ---------- Water Station: divide decimals (Lessons 22–25) ---------- */
function genDivide() {
  const variant = R(0, 3),
    name = pick(KIDS);
  if (variant === 0) {
    /* a whole number ÷ 0.1 or 0.01: how many fit */
    const n = R(2, 9),
      size = pick([100, 10]),
      answer = (n * 1000) / size;
    return {
      kind: "num",
      unit: "cups",
      answer,
      facts: { t: "divide", n: n * 1000, d: size },
      prompt: `The water station has ${n} liters of water. How many ${dec(size)}-liter cups can it fill?`,
      ...(size === 100 ? { fig: (show) => tenthsFig(n * 10, show ? 1 : 10, `${n} wholes cut into tenths`) } : {}),
      misc: apart(answer, [
        [value(n * size), `That’s ${n} × ${dec(size)}. Count how many ${dec(size)}s fit in ${n}: divide.`],
        [
          size === 100 ? n * 100 : n * 10,
          `There are ${size === 100 ? 10 : 100} cups of ${dec(size)} liter in each liter, so ${n} liters fill ${n} × ${size === 100 ? 10 : 100}.`,
        ],
      ]),
      hint: `How many ${dec(size)}s are in 1? Then in ${n}?`,
      explain: `There are ${1000 / size} ${dec(size)}s in 1, so ${n} ÷ ${dec(size)} = ${n} × ${1000 / size} = ${answer} cups.`,
    };
  }
  if (variant === 1) {
    /* tenths ÷ a whole number: equal shares */
    const n = R(2, 6),
      each = R(2, 9),
      k = n * each * 100;
    return {
      kind: "num",
      unit: "kilometers",
      answer: value(each * 100),
      facts: { t: "divide", n: k, d: n * 1000 },
      prompt: `A relay course is ${dec(k)} kilometers. ${n} runners each run an equal part. How far does each run?`,
      fig: (show) => tenthsFig(n * each, show ? each : n * each),
      misc: apart(value(each * 100), [
        [each, `That’s ${each} whole kilometers. ${dec(k)} is ${n * each} tenths, so each runs ${each} tenths.`],
        [value(each * 10), `That’s ${each} hundredths. ${n * each} tenths ÷ ${n} is ${each} tenths.`],
      ]),
      hint: `${dec(k)} is ${n * each} tenths. Share them among ${n}.`,
      explain: `${n * each} tenths ÷ ${n} = ${each} tenths, so ${dec(k)} ÷ ${n} = ${dec(each * 100)} kilometers.`,
    };
  }
  /* a decimal ÷ a decimal: how many fit (tenths by tenths, or hundredths by hundredths) */
  const size = variant === 2 ? 100 : 10,
    d = R(2, 9) * size,
    times = R(2, 9),
    k = d * times;
  return {
    kind: "num",
    unit: variant === 2 ? "bottles" : "",
    answer: times,
    facts: { t: "divide", n: k, d },
    prompt:
      variant === 2
        ? `${name} pours ${dec(k)} liters of sports drink into bottles that hold ${dec(d)} liter each. How many bottles fill up?`
        : `What is ${dec(k)} ÷ ${dec(d)}?`,
    ...(size === 100 ? { fig: (show) => tenthsFig(k / 100, show ? d / 100 : 10, `${k / 100} tenths`) } : {}),
    misc: apart(times, [
      [
        value((times * 1000) / 10),
        `That’s ${dec(times * 100)}. ${dec(k)} and ${dec(d)} are both ${size === 100 ? "tenths" : "hundredths"}: ${k / size} ÷ ${d / size} = ${times}.`,
      ],
      [
        times * 10,
        `That has a zero too many. ${k / size} ${size === 100 ? "tenths" : "hundredths"} ÷ ${d / size} ${size === 100 ? "tenths" : "hundredths"} = ${times}.`,
      ],
    ]),
    hint: `${dec(k)} is ${k / size} ${size === 100 ? "tenths" : "hundredths"} and ${dec(d)} is ${d / size}. How many groups of ${d / size} are in ${k / size}?`,
    explain: `${k / size} ÷ ${d / size} = ${times}, so ${dec(k)} ÷ ${dec(d)} = ${times}.`,
  };
}

/* ---------- Victory Lap: the final round ---------- */
const genBoss = () => pick([genRead, genCompare, genRound, genAddSub, genMultiply, genDivide])();

const ZONES = [
  {
    id: "read",
    name: "Starting Blocks",
    lessons: "Lessons 1–3",
    blurb: "Read and write thousandths on grids, in words, and in expanded form.",
    gen: genRead,
  },
  {
    id: "compare",
    name: "Photo Finish",
    lessons: "Lessons 5–6, 9–10",
    blurb: "Compare and order race times to the thousandth of a second.",
    gen: genCompare,
  },
  {
    id: "round",
    name: "Scoreboard",
    lessons: "Lessons 7–8",
    blurb: "Round decimals to the nearest whole number, tenth, or hundredth.",
    gen: genRound,
  },
  {
    id: "addsub",
    name: "Relay Race",
    lessons: "Lessons 11–16",
    blurb: "Add and subtract decimals, lining up the places.",
    gen: genAddSub,
  },
  {
    id: "multiply",
    name: "Long Jump",
    lessons: "Lessons 17–21",
    blurb: "Multiply decimals using whole-number facts and place value.",
    gen: genMultiply,
  },
  {
    id: "divide",
    name: "Water Station",
    lessons: "Lessons 22–25",
    blurb: "Divide whole numbers and decimals by decimals, and decimals by whole numbers.",
    gen: genDivide,
  },
  {
    id: "boss",
    name: "Victory Lap",
    lessons: "All lessons",
    blurb: "Run the victory lap! Every right answer lights another flag around the track.",
    gen: genBoss,
  },
];

/* the track with `lit` of its 10 flags lit around it (the boss icon lights all of them) */
const track = (lit) =>
  '<ellipse cx="32" cy="36" rx="26" ry="16" fill="none" stroke="#c9584b" stroke-width="6"/><ellipse cx="32" cy="36" rx="26" ry="16" fill="none" stroke="#f3f6fb" stroke-width="1" stroke-dasharray="3 3"/>' +
  range(10)
    .map((i) => {
      const angle = (i / 10) * 2 * Math.PI - Math.PI / 2,
        x = (32 + 30 * Math.cos(angle)).toFixed(1),
        y = (36 + 20 * Math.sin(angle)).toFixed(1);
      return `<circle cx="${x}" cy="${y}" r="3.2" fill="${i < lit ? "#ffc93c" : "rgba(243,246,251,.25)"}" stroke="#0a2340" stroke-width="1"/>`;
    })
    .join("");
const ICON = {
  read: '<rect x="8" y="10" width="30" height="30" fill="rgba(169,196,228,.1)" stroke="#f3f6fb" stroke-width="2"/><rect x="8" y="10" width="9" height="30" fill="#ffc93c"/><rect x="17" y="10" width="3" height="3" fill="#7fe3ff"/><path d="M20,13L44,22M20,10L44,10" stroke="#7fe3ff" stroke-width="1" stroke-dasharray="2 2"/><rect x="44" y="10" width="14" height="14" fill="none" stroke="#7fe3ff" stroke-width="2"/><text x="32" y="56" fill="#f3f6fb" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">0.325</text>',
  compare:
    '<path d="M8,52H56" stroke="#f3f6fb" stroke-width="2"/><path d="M40,12V52" stroke="#f3f6fb" stroke-width="2" stroke-dasharray="4 3"/><circle cx="36" cy="28" r="5" fill="#ffc93c"/><path d="M36,33V44M30,38H42M36,44L31,52M36,44L41,52" stroke="#ffc93c" stroke-width="2.5"/><circle cx="22" cy="28" r="5" fill="#7fe3ff"/><path d="M22,33V44M16,38H28M22,44L17,52M22,44L27,52" stroke="#7fe3ff" stroke-width="2.5"/>',
  round:
    '<rect x="6" y="14" width="52" height="30" rx="4" fill="#0a2340" stroke="#f3f6fb" stroke-width="2"/><text x="32" y="35" fill="#ff8a5c" font-size="15" font-weight="700" text-anchor="middle" font-family="monospace">12.4</text><path d="M20,44V56M44,44V56" stroke="#f3f6fb" stroke-width="2"/>',
  addsub:
    '<rect x="8" y="26" width="22" height="8" rx="4" fill="#ffc93c" stroke="#0a2340" stroke-width="1.5" transform="rotate(-20 19 30)"/><path d="M34,30H56" stroke="#7fe3ff" stroke-width="3" stroke-dasharray="5 4"/><text x="32" y="56" fill="#f3f6fb" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">+ 12.4</text>',
  multiply:
    '<path d="M6,52H58" stroke="#e9d2a0" stroke-width="4"/><path d="M12,46Q30,6 50,46" fill="none" stroke="#ffc93c" stroke-width="2.5" stroke-dasharray="5 4"/><circle cx="50" cy="46" r="4" fill="#7fe3ff"/><text x="30" y="40" fill="#f3f6fb" font-size="9" font-weight="700" text-anchor="middle" font-family="monospace">× 0.3</text>',
  divide:
    '<path d="M18,10H46L42,54H22Z" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2"/><path d="M20,24H44M21,34H43M22,44H42" stroke="#7fe3ff" stroke-width="1.5"/>',
  boss: track(10),
};
