/* Rocket Lab (Grade 4 Unit 4): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Place-value charts, number words, commas, and the standard algorithm come from shared/blocks.js; number lines from
   shared/numlines.js; hundred grids from shared/fractions.js; fr and cellsOf from shared/pictures.js; dS, WIDE, PL, SYM, signOf,
   decLine, and nearest from figs.js; roundLine from shared/numlines.js; roundTo, mcOf, and miscOf from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Decimals are
   generated as whole numbers of hundredths (k) and shown with dS(k), so 0.1 + 0.2 never comes out 0.30000000000000004. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* the text with its first letter capitalized */
const cap = (text) => text[0].toUpperCase() + text.slice(1);
/* one of place e in words: placeName(4) is "ten thousand" */
const placeName = (e) => PL[e][0].replace("-", " ");
/* the three signs as an mc problem: "a ? b" with each sign, a and b written as aText and bText; wrong(s) is the message for s */
function signChoices(a, b, aText, bText, wrong) {
  const right = signOf(a, b);
  return mcOf(["<", "=", ">"].map((s) => [`${aText} ${SYM[s]} ${bText}`, s === right ? null : wrong(s)]));
}
/* how many nonzero digits n has */
const nonzero = (n) => String(n).replace(/[^1-9]/g, "").length;
/* a random whole number with `places` digits and at most `most` nonzero digits (the first is never 0) */
function friendly(places, most) {
  let n;
  do {
    n = R(10 ** (places - 1), 10 ** places - 1);
    /* zero out random digits until few enough are left */
    const digits = [...String(n)];
    while (digits.filter((c) => c !== "0").length > most) digits[R(1, places - 1)] = "0";
    n = +digits.join("");
  } while (nonzero(n) > most);
  return n;
}

/* ---------- Fuel Gauge: tenths and hundredths as decimals (Lessons 1–2) ---------- */
function genDecimals() {
  const variant = R(0, 3),
    name = pick(KIDS);
  if (variant === 0) {
    /* the shaded part of a hundred grid as a decimal */
    const k = Math.random() < 0.25 ? 10 * R(1, 9) : R(1, 99);
    return {
      kind: "num",
      unit: "",
      answer: k / 100,
      prompt: `The fuel gauge is a hundred grid. The shaded squares show how full the tank is. Write the shaded part as a decimal.`,
      facts: { hundredths: k },
      fig: () => hundredGrid(cellsOf([k, "a"]), { label: `A hundred grid with ${k} of 100 squares shaded` }),
      misc: miscOf(k / 100, [
        ...(k < 10 ? [[k / 10, `That’s ${k} tenths. ${k} small squares is ${k} hundredths: ${dS(k)}.`]] : []),
        [k, `That’s ${k} whole tanks. The grid is 1 whole, so ${k} of its 100 squares is ${k} hundredths.`],
      ]),
      hint: `Each column is a tenth and each small square is a hundredth. Count the shaded squares.`,
      explain: `${k} of 100 squares is ${fr(k, 100)}${k % 10 === 0 ? ` = ${fr(k / 10, 10)}` : ""} = ${dS(k)}.`,
    };
  }
  if (variant === 1) {
    /* a fraction in tenths or hundredths as a decimal */
    const tenths = Math.random() < 0.4,
      k = tenths ? 10 * R(1, 9) : R(1, 99),
      written = tenths ? fr(k / 10, 10) : fr(k, 100);
    return {
      kind: "num",
      unit: "",
      answer: k / 100,
      prompt: `Write ${written} as a decimal.`,
      fig: (show) => pvChart([["", show ? k / 100 : 0]], show ? 2 : -1, { places: [0, -1, -2] }),
      misc: miscOf(
        k / 100,
        tenths
          ? [[k / 1000, `That’s ${k / 10} hundredths. Tenths go in the first place after the decimal point.`]]
          : [
              [
                k / 10,
                `That’s ${k} tenths. Hundredths take two places after the decimal point${k < 10 ? `: 0.0${k}` : ""}.`,
              ],
              ...(k % 10 ? [] : [[k / 1000, `That puts ${k} in the thousandths. ${fr(k, 100)} is ${dS(k)}.`]]),
            ],
      ),
      hint: tenths
        ? `Tenths go in the first place after the decimal point.`
        : `Hundredths fill the second place after the decimal point.`,
      explain: `${written} = ${dS(k)}.${tenths ? ` That’s also ${fr(k, 100)} = ${(k / 100).toFixed(2)}.` : ""}`,
    };
  }
  if (variant === 2) {
    /* an equivalent decimal: 0.6 = 0.60 */
    const tenths = R(1, 9),
      asTenths = Math.random() < 0.5,
      shown = asTenths ? `0.${tenths}` : `0.${tenths}0`;
    return {
      ...mcOf([
        [asTenths ? `0.${tenths}0` : `0.${tenths}`, null],
        [`0.0${tenths}`, `0.0${tenths} is ${tenths} hundredth${tenths > 1 ? "s" : ""}. ${shown} is ${tenths} tenths.`],
        [`${tenths}.0`, `${tenths}.0 is ${tenths} wholes. ${shown} is less than 1.`],
      ]),
      prompt: `Which decimal is equal to ${shown}?`,
      fig: () => hundredGrid(cellsOf([10 * tenths, "a"]), { label: `A hundred grid with ${tenths} columns shaded` }),
      hint: `${tenths} tenths fill ${tenths} columns of the grid. How many hundredths is that?`,
      explain: `${tenths} tenths is ${10 * tenths} hundredths: ${fr(tenths, 10)} = ${fr(10 * tenths, 100)}, so 0.${tenths} = 0.${tenths}0.`,
    };
  }
  /* centimeters as part of a meter, or coins as part of a dollar */
  const k = R(5, 95),
    coins = Math.random() < 0.5;
  if (coins) {
    const dimes = Math.floor(k / 10),
      pennies = k % 10;
    if (dimes && pennies)
      return {
        kind: "num",
        unit: "dollars",
        answer: k / 100,
        prompt: `${name} buys a rocket sticker with ${dimes} dime${dimes > 1 ? "s" : ""} and ${pennies} penn${pennies > 1 ? "ies" : "y"}. How many dollars is that? Write a decimal.`,
        fig: () =>
          hundredGrid(cellsOf([10 * dimes, "a"], [pennies, "b"]), {
            label: `${dimes} columns and ${pennies} squares shaded`,
          }),
        misc: miscOf(k / 100, [
          [(dimes + pennies) / 100, `That counts every coin as a penny. A dime is 10 cents, 0.10 of a dollar.`],
          [(dimes + pennies) / 10, `That counts every coin as a dime. A penny is 0.01 of a dollar.`],
        ]),
        hint: `A dime is a tenth of a dollar and a penny is a hundredth.`,
        explain: `${dimes} dime${dimes > 1 ? "s" : ""} is ${fr(dimes, 10)} and ${pennies} penn${pennies > 1 ? "ies" : "y"} is ${fr(pennies, 100)}: ${fr(10 * dimes + pennies, 100)} of a dollar = $${dS(k)}.`,
      };
  }
  return {
    kind: "num",
    unit: "meter",
    answer: k / 100,
    prompt: `A model rocket is ${k} centimeters tall. 100 centimeters make 1 meter. How tall is the rocket in meters? Write a decimal.`,
    fig: () => hundredGrid(cellsOf([k, "a"]), { label: `A hundred grid with ${k} squares shaded` }),
    misc: miscOf(k / 100, [
      ...(k < 10 ? [[k / 10, `That’s ${k} tenths of a meter. ${k} centimeters is ${k} hundredths.`]] : []),
      [k, `That’s ${k} meters, taller than a building. ${k} centimeters is ${k} hundredths of a meter.`],
    ]),
    hint: `Each centimeter is a hundredth of a meter.`,
    explain: `${k} centimeters is ${fr(k, 100)} of a meter = ${dS(k)} meter.`,
  };
}

/* ---------- Number Line Launch: decimals on number lines, compared and ordered (Lessons 3–5) ---------- */
/* a decimal number line: 0 to 1 in tenths, or between two tenths in hundredths. Returns {lo, hi, step} in hundredths. */
const lineView = () =>
  Math.random() < 0.5 ? { lo: 0, hi: 100, step: 10 } : ((lo) => ({ lo, hi: lo + 10, step: 1 }))(10 * R(0, 9));
/* fractions with easy decimals: [n, d] and how many hundredths it is */
const EASY = [
  [[1, 2], 50],
  [[1, 4], 25],
  [[3, 4], 75],
  [[1, 5], 20],
  [[2, 5], 40],
  [[3, 5], 60],
  [[4, 5], 80],
];
function genLines() {
  const variant = R(0, 4);
  if (variant === 0 || variant === 1) {
    /* tap a decimal, or name the point */
    const { lo, hi, step } = lineView();
    const k = lo + step * R(1, (hi - lo) / step - 1);
    if (variant === 0) {
      const why = {};
      for (let v = lo; v <= hi; v += step)
        if (v !== k)
          why[v] =
            `That’s ${dS(v)}.` +
            (Math.abs(v - k) === step ? ` Each jump is ${dS(step)}: count ${(k - lo) / step} from ${dS(lo)}.` : "");
      return {
        kind: "tap",
        answer: String(k),
        why,
        prompt: `Tap ${dS(k)} on the number line.`,
        fig: () => decLine(lo, hi, step, { tap: "cand", label: `Number line from ${dS(lo)} to ${dS(hi)}` }),
        hint: `The ticks go up by ${dS(step)}. Count from ${dS(lo)}.`,
        explain: `${dS(k)} is ${(k - lo) / step} jumps of ${dS(step)} past ${dS(lo)}.`,
      };
    }
    return {
      kind: "num",
      unit: "",
      answer: k / 100,
      prompt: `What decimal is at the point?`,
      facts: { at: k },
      fig: (show) =>
        decLine(lo, hi, step, {
          pts: [{ v: k, t: show ? dS(k) : null }],
          label: `Number line from ${dS(lo)} to ${dS(hi)} with a point`,
        }),
      misc: miscOf(
        k / 100,
        (step === 10
          ? [[(k + step) / 100, `That counts one tick too many. Count the jumps from ${dS(lo)}.`]]
          : [[(lo + (k - lo) * 10) / 100, `The ticks between ${dS(lo)} and ${dS(hi)} are hundredths, not tenths.`]]
        ).filter(([v]) => v < 1),
      ),
      hint: `The ticks go up by ${dS(step)}. Count the jumps from ${dS(lo)} to the point.`,
      explain: `The point is ${(k - lo) / step} jumps of ${dS(step)} past ${dS(lo)}: ${dS(k)}.`,
    };
  }
  if (variant === 2) {
    /* compare a decimal in tenths with one in hundredths: more digits doesn't mean more */
    let a, b;
    do {
      a = 10 * R(1, 9);
      b = R(1, 99);
    } while (b % 10 === 0 || Math.abs(a - b) > 30);
    const [x, y] = Math.random() < 0.5 ? [a, b] : [b, a];
    return {
      ...signChoices(x, y, dS(x), dS(y), (s) =>
        s === "="
          ? `${dS(x)} is ${x} hundredths and ${dS(y)} is ${y} hundredths. They aren’t equal.`
          : `Compare the same places: ${dS(x)} = ${(x / 100).toFixed(2)} and ${dS(y)} = ${(y / 100).toFixed(2)}. More digits doesn’t mean more.`,
      ),
      prompt: `Which is true?`,
      fig: (show) =>
        show
          ? `<div class="picrow">${hundredGrid(cellsOf([x, "a"]), { label: `${x} hundredths` })}${hundredGrid(cellsOf([y, "b"]), { label: `${y} hundredths` })}</div>`
          : pvChart(
              [
                ["", x / 100],
                ["", y / 100],
              ],
              -1,
              { places: [0, -1, -2] },
            ),
      hint: `Write both in hundredths: ${dS(a)} = ${(a / 100).toFixed(2)}.`,
      explain: `${dS(x)} is ${x} hundredths and ${dS(y)} is ${y} hundredths, so ${dS(x)} ${SYM[signOf(x, y)]} ${dS(y)}.`,
    };
  }
  if (variant === 3) {
    /* a decimal against a fraction with an easy decimal */
    const [[n, d], v] = pick(EASY),
      k = v + pick([-15, -10, -5, 5, 10, 15]),
      [x, y, xText, yText] = Math.random() < 0.5 ? [k, v, dS(k), fr(n, d)] : [v, k, fr(n, d), dS(k)];
    return {
      ...signChoices(
        x,
        y,
        xText,
        yText,
        () => `${fr(n, d)} = ${fr(v, 100)} = ${dS(v)}, and ${dS(k)} is ${k} hundredths.`,
      ),
      prompt: `Which is true?`,
      fig: (show) =>
        decLine(0, 100, 10, {
          pts: show
            ? [
                { v: k, t: dS(k) },
                { v, cls: "b" },
              ]
            : [],
          label: `Number line from 0 to 1 in tenths`,
        }),
      hint: `Write ${fr(n, d)} in hundredths: ${fr(n, d)} = ${fr("?", 100)}.`,
      explain: `${fr(n, d)} = ${fr(v, 100)} = ${dS(v)}. ${dS(k)} is ${k} hundredths, so ${xText} ${SYM[signOf(x, y)]} ${yText}.`,
    };
  }
  /* order three decimals from least to greatest */
  let values;
  do values = [10 * R(1, 9), R(11, 99), R(1, 9)];
  while (new Set(values).size < 3 || values[1] % 10 === 0);
  const label = (list) => list.map(dS).join(", "),
    least = values.slice().sort((x, y) => x - y),
    /* the mistake: the decimal with the most digits after the point is the biggest */
    byDigits = values.slice().sort((x, y) => +dS(x).slice(2) - +dS(y).slice(2)),
    most = least.slice().reverse();
  const wrongs = [
    [byDigits, `That orders the digits after the point as whole numbers. Write each one in hundredths first.`],
    [most, `That’s from greatest to least. Start with the least.`],
  ].filter(([list]) => label(list) !== label(least));
  return {
    ...mcOf([[label(least), null], ...wrongs.map(([list, msg]) => [label(list), msg])], { stack: true }),
    prompt: `Put ${label(shuffle(values))} in order from least to greatest.`,
    fig: (show) =>
      decLine(0, 100, 10, {
        pts: show ? values.map((v, i) => ({ v, cls: i % 2 ? "b" : "" })) : [],
        label: `Number line from 0 to 1 in tenths`,
      }),
    hint: `Write each one in hundredths: ${values.map((v) => `${dS(v)} = ${(v / 100).toFixed(2)}`).join(", ")}.`,
    explain: `In hundredths: ${least.map((v) => `${v}`).join(", ")}. From least to greatest: ${label(least)}.`,
  };
}

/* ---------- Place Value Pad: numbers to 1,000,000 (Lessons 6–9) ---------- */
/* n written as a sum of its places: "300,000 + 40,000 + 600 + 5" */
const expanded = (n) =>
  [...String(n)]
    .map((c, i, all) => +c * 10 ** (all.length - 1 - i))
    .filter(Boolean)
    .map(commas)
    .join(" + ");
function genPlace() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* the value of one digit */
    let n, e;
    do {
      n = friendly(R(5, 6), 4);
      e = R(1, String(n).length - 1);
    } while (digitAt(n, e) === 0 || [...String(n)].filter((c) => +c === digitAt(n, e)).length > 1);
    const digit = digitAt(n, e),
      value = digit * 10 ** e;
    return {
      kind: "num",
      unit: "",
      answer: value,
      prompt: `What is the value of the ${digit} in ${commas(n)}?`,
      fig: (show) => pvChart([["", n]], show ? WIDE.indexOf(e) : -1, { places: WIDE }),
      misc: miscOf(value, [
        [digit, `That’s the digit. Its value depends on its place: the ${PL[e][1]} place.`],
        [value * 10, `That’s one place too far left. The ${digit} is in the ${PL[e][1]} place.`],
        ...(e > 0 ? [[value / 10, `That’s one place too far right. The ${digit} is in the ${PL[e][1]} place.`]] : []),
      ]),
      hint: `Find the ${digit} in the chart. Which place is it in?`,
      explain: `The ${digit} is in the ${PL[e][1]} place, so it’s worth ${digit} × ${commas(10 ** e)} = ${commas(value)}.`,
    };
  }
  if (variant === 1) {
    /* from expanded form to one number: the zeros hold the empty places */
    let n;
    do n = friendly(R(5, 6), R(3, 4));
    while (!String(n).slice(1).includes("0"));
    const squeezed = +String(n).replace(/0/g, "");
    return {
      kind: "num",
      unit: "",
      answer: n,
      prompt: `Write ${expanded(n)} as one number.`,
      fig: (show) => pvChart([["", show ? n : 0]], -1, { places: WIDE }),
      misc: miscOf(n, [[squeezed, `That leaves out the zeros. Each place with nothing in it still needs a 0.`]]),
      hint: `Put each part in its place in the chart. Write 0 in the empty places.`,
      explain: `${expanded(n)} = ${commas(n)}.`,
    };
  }
  if (variant === 2) {
    /* from words to a number */
    let n;
    do n = friendly(R(5, 6), R(2, 4));
    while (n % 1000 === 0 || n < 1000);
    const thousands = Math.floor(n / 1000),
      rest = n % 1000;
    return {
      kind: "num",
      unit: "",
      answer: n,
      prompt: `The mission control screen reads “${numWords(n)}.” Write it as a number.`,
      fig: (show) => pvChart([["", show ? n : 0]], -1, { places: WIDE }),
      misc: miscOf(n, [
        ...(rest < 100
          ? [
              [
                thousands * 1000 + rest * 10,
                `${cap(numWords(rest))} is ${rest}, which fills the tens and ones. The hundreds place gets a 0.`,
              ],
            ]
          : []),
        [
          +`${thousands}000${rest}`,
          `That writes ${commas(thousands * 1000)} and then ${rest}. The ${rest} goes in the zeros’ places.`,
        ],
      ]).filter(([wrong]) => wrong !== n),
      hint: `Write the thousands first: ${numWords(thousands * 1000)} is ${commas(thousands * 1000)}. Then fill in the last three places.`,
      explain: `${numWords(thousands * 1000)} is ${commas(thousands * 1000)}, and ${numWords(rest)} is ${rest}: ${commas(n)}.`,
    };
  }
  /* a number of thousands or ten-thousands, written out */
  const e = pick([3, 4]),
    many = R(11, 99),
    value = many * 10 ** e;
  return {
    kind: "num",
    unit: "",
    answer: value,
    prompt: `What number is ${many} ${PL[e][1]}?`,
    fig: (show) => pvChart([["", show ? value : 0]], -1, { places: WIDE }),
    misc: miscOf(value, [
      [many * 10 ** (e - 1), `That’s ${many} ${PL[e - 1][1]}. Each ${placeName(e)} is ${commas(10 ** e)}.`],
      [many * 10 ** (e + 1), `That’s ${many} ${PL[e + 1][1]}. Each ${placeName(e)} is ${commas(10 ** e)}.`],
    ]),
    hint: `Each ${placeName(e)} is ${commas(10 ** e)}. Multiply ${many} × ${commas(10 ** e)}.`,
    explain: `${many} × ${commas(10 ** e)} = ${commas(value)}.`,
  };
}

/* ---------- Ten-Times Thruster: ten times as much, and large numbers on number lines (Lessons 10–11) ---------- */
function genTimes() {
  const variant = R(0, 3);
  if (variant === 0 || variant === 3) {
    /* 10 times a number, typed or picked */
    let n;
    do n = friendly(R(2, 5), 2);
    while (n % 10 === 0 && Math.random() < 0.5);
    const tenTimes = 10 * n;
    if (variant === 0)
      return {
        kind: "num",
        unit: "kilometers",
        answer: tenTimes,
        prompt: `A rocket flies ${commas(n)} kilometers on its first test. On the big launch it flies 10 times as far. How far is that?`,
        fig: (show) =>
          pvChart(
            [
              ["Test", n],
              ["Launch", show ? tenTimes : 0],
            ],
            -1,
            { places: WIDE },
          ),
        misc: miscOf(tenTimes, [
          [n + 10, `That adds 10. Ten times as far is 10 × ${commas(n)}.`],
          [100 * n, `That’s 100 times as far: every digit moved two places.`],
        ]),
        hint: `Ten times as much moves every digit one place to the left.`,
        explain: `10 × ${commas(n)} = ${commas(tenTimes)}. Each digit moves one place left.`,
      };
    return {
      ...mcOf([
        [commas(tenTimes), null],
        [commas(n + 10), `That adds 10. Ten times as much is 10 × ${commas(n)}.`],
        [commas(100 * n), `That’s 100 times as much: every digit moved two places.`],
      ]),
      prompt: `Which number is 10 times as much as ${commas(n)}?`,
      fig: (show) =>
        pvChart(
          [
            ["", n],
            ["× 10", show ? tenTimes : 0],
          ],
          -1,
          { places: WIDE },
        ),
      hint: `Ten times as much moves every digit one place to the left.`,
      explain: `10 × ${commas(n)} = ${commas(tenTimes)}.`,
    };
  }
  if (variant === 1) {
    /* how many times as much one digit's value is as another's */
    const digit = R(1, 9),
      low = R(1, 3),
      gap = R(1, 2),
      high = low + gap,
      times = 10 ** gap;
    return {
      kind: "num",
      unit: "times",
      answer: times,
      prompt: `How many times as much is ${commas(digit * 10 ** high)} as ${commas(digit * 10 ** low)}?`,
      fig: (show) =>
        pvChart(
          [
            ["", digit * 10 ** high],
            ["", digit * 10 ** low],
          ],
          -1,
          { places: WIDE },
        ),
      misc: miscOf(times, [
        [digit * 10 ** high - digit * 10 ** low, `That’s how much more, not how many times as much.`],
        ...(gap === 2
          ? [[10, `Each place to the left is 10 times as much, and the ${digit} moved 2 places: 10 × 10.`]]
          : []),
        ...(gap === 1 ? [[100, `The ${digit} moved only 1 place, so it’s 10 times as much.`]] : []),
      ]),
      hint: `How many places did the ${digit} move? Each place to the left is 10 times as much.`,
      explain: `The ${digit} moved ${gap} place${gap > 1 ? "s" : ""} left, so it’s ${gap > 1 ? "10 × 10 = 100" : "10"} times as much.`,
    };
  }
  /* a large number on a number line marked in tenths of its span */
  const span = pick([10000, 100000]),
    tick = span / 10,
    start = span * R(0, span === 10000 ? 9 : 4),
    at = R(1, 9),
    value = start + at * tick;
  return {
    kind: "num",
    unit: "",
    answer: value,
    prompt: `The number line goes from ${commas(start)} to ${commas(start + span)}. What number is at the point?`,
    facts: { at: value },
    fig: (show) =>
      numLine(0, 10, {
        u: 36,
        big: 10,
        pad: 40,
        lab: (v) => v === 0 || v === 10,
        ls: "s",
        fmt: (v) => commas(start + v * tick),
        pts: [{ v: at, t: show ? commas(value) : null }],
        label: `Number line from ${commas(start)} to ${commas(start + span)} in 10 equal jumps, with a point`,
      }),
    misc: miscOf(value, [
      [
        start + at * (tick / 10),
        `The jumps aren’t ${commas(tick / 10)}. 10 jumps go from ${commas(start)} to ${commas(start + span)}, so each is ${commas(tick)}.`,
      ],
      [start + (at + 1) * tick, `That counts one tick too many. Count the jumps from ${commas(start)}.`],
    ]).filter(([wrong]) => wrong !== value),
    hint: `10 equal jumps go from ${commas(start)} to ${commas(start + span)}, so each jump is ${commas(tick)}.`,
    explain: `Each jump is ${commas(tick)}. The point is ${at} jumps past ${commas(start)}: ${commas(value)}.`,
  };
}

/* ---------- Orbit Rounding: compare, order, and round (Lessons 12–17) ---------- */
/* places to round to, with what comes in that many: [unit, the most it can be] */
const ROUNDS = [
  [1000, 99999],
  [10000, 999999],
  [100000, 999999],
];
function genRound() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* compare two numbers that differ in one place, or that have different lengths */
    const places = R(4, 6);
    let a, b;
    do {
      a = friendly(places, 4);
      const e = R(0, places - 1),
        change = pick([-2, -1, 1, 2]) * 10 ** e;
      b = Math.random() < 0.2 ? +String(a).slice(0, -1) : a + change;
    } while (b < 1000 || nonzero(b) > 4 || b === a);
    const firstDiff = [...String(Math.max(a, b))].findIndex(
        (c, i) => c !== String(Math.min(a, b)).padStart(String(Math.max(a, b)).length, "0")[i],
      ),
      longer = String(a).length !== String(b).length;
    return {
      ...signChoices(a, b, commas(a), commas(b), (s) =>
        s === "="
          ? `${commas(a)} and ${commas(b)} are different numbers.`
          : longer
            ? `${commas(Math.max(a, b))} has more digits, so it has a bigger place. Compare places, not the first digits.`
            : `Compare from the left. The first place where they differ is the ${PL[String(a).length - 1 - firstDiff][1]} place.`,
      ),
      prompt: `Which is true?`,
      fig: (show) =>
        pvChart(
          [
            ["", a],
            ["", b],
          ],
          show && !longer ? WIDE.indexOf(String(a).length - 1 - firstDiff) : -1,
          { places: WIDE },
        ),
      hint: `Line the numbers up by place. Compare from the biggest place.`,
      explain: longer
        ? `${commas(Math.max(a, b))} has ${String(Math.max(a, b)).length} digits and ${commas(Math.min(a, b))} has ${String(Math.min(a, b)).length}, so ${commas(a)} ${SYM[signOf(a, b)]} ${commas(b)}.`
        : `They match until the ${PL[String(a).length - 1 - firstDiff][1]} place: ${digitAt(a, String(a).length - 1 - firstDiff)} and ${digitAt(b, String(a).length - 1 - firstDiff)}. So ${commas(a)} ${SYM[signOf(a, b)]} ${commas(b)}.`,
    };
  }
  if (variant === 1) {
    /* round to a place, typed */
    const [unit, most] = pick(ROUNDS);
    let n;
    do n = friendly(String(unit).length + R(0, 1), 3);
    while (n > most || n % unit === 0 || n < unit);
    const rounded = roundTo(n, unit),
      below = Math.floor(n / unit) * unit,
      other = rounded === below ? below + unit : below;
    return {
      kind: "num",
      unit: "",
      answer: rounded,
      prompt: `The rocket climbs to ${commas(n)} meters. Round that to ${nearest(unit)}.`,
      fig: () => roundLine(n, unit),
      misc: miscOf(rounded, [
        [other, `${commas(n)} is closer to ${commas(rounded)}. Halfway is ${commas(below + unit / 2)}.`],
        ...ROUNDS.filter(([u]) => u !== unit && roundTo(n, u) !== rounded).map(([u]) => [
          roundTo(n, u),
          `That’s rounded to ${nearest(u)}. Round to ${nearest(unit)}.`,
        ]),
      ]),
      hint: `${commas(n)} is between ${commas(below)} and ${commas(below + unit)}. Is it more or less than halfway, ${commas(below + unit / 2)}?`,
      explain: `${commas(n)} is between ${commas(below)} and ${commas(below + unit)}, and ${n >= below + unit / 2 ? "at or past" : "before"} halfway (${commas(below + unit / 2)}). It rounds to ${commas(rounded)}.`,
    };
  }
  if (variant === 2) {
    /* which number rounds to a given multiple; the others are just past halfway on either side */
    const unit = pick([1000, 10000]),
      step = unit / 100,
      target = unit * R(2, 9),
      n = target + pick([-1, 1]) * R(1, 49) * step,
      below = target - unit / 2 - R(1, 30) * step,
      above = target + unit / 2 + R(0, 30) * step;
    return {
      ...mcOf([
        [commas(n), null],
        [
          commas(below),
          `${commas(below)} is less than ${commas(target - unit / 2)}, so it rounds to ${commas(roundTo(below, unit))}.`,
        ],
        [
          commas(above),
          `${commas(above)} is at or past ${commas(target + unit / 2)}, so it rounds to ${commas(roundTo(above, unit))}.`,
        ],
      ]),
      prompt: `Which number rounds to ${commas(target)} when you round to ${nearest(unit)}?`,
      fig: (show) =>
        numLine(0, 10, {
          u: 36,
          big: 5,
          pad: 40,
          ls: "s",
          lab: (v) => v % 5 === 0,
          fmt: (v) => commas(target - unit / 2 + (v * unit) / 10),
          pts: show ? [{ v: 5 }] : [],
          label: `Number line from ${commas(target - unit / 2)} to ${commas(target + unit / 2)}`,
        }),
      hint: `Numbers that round to ${commas(target)} are from ${commas(target - unit / 2)} up to ${commas(target + unit / 2)}, not including ${commas(target + unit / 2)}.`,
      explain: `${commas(n)} is between ${commas(target - unit / 2)} and ${commas(target + unit / 2)}, so it rounds to ${commas(target)}.`,
    };
  }
  /* order three numbers from least to greatest */
  /* a 4-digit number with a big first digit, a 5-digit one with a small first digit, and one more, so comparing first digits
     alone gets it wrong */
  let values;
  do values = [friendly(4, 2), friendly(5, 2), friendly(R(4, 5), 3)];
  while (new Set(values).size < 3 || +String(values[0])[0] <= +String(values[1])[0]);
  /* numbers with commas are listed with semicolons, so 6,100; 55,000 can't be misread */
  const label = (list) => list.map(commas).join("; "),
    least = values.slice().sort((x, y) => x - y),
    /* the mistake: ordering by the first digits, as if the numbers were the same length */
    byFirst = values.slice().sort((x, y) => (String(x) < String(y) ? -1 : 1)),
    most = least.slice().reverse();
  const wrongs = [
    [byFirst, `That compares the first digits only. A number with more digits is bigger.`],
    [most, `That’s from greatest to least. Start with the least.`],
  ].filter(([list], i, all) => label(list) !== label(least) && all.findIndex(([l]) => label(l) === label(list)) === i);
  return {
    ...mcOf([[label(least), null], ...wrongs.map(([list, msg]) => [label(list), msg])], { stack: true }),
    prompt: `Put the launch distances ${label(shuffle(values))} in order from least to greatest.`,
    fig: (show) =>
      pvChart(
        values.map((v) => ["", v]),
        show ? 0 : -1,
        { places: WIDE },
      ),
    hint: `Line them up by place, then compare from the biggest place.`,
    explain: `From least to greatest: ${label(least)}.`,
  };
}

/* ---------- Launch Pad: add and subtract with the standard algorithm (Lessons 18–22) ---------- */
/* how many columns trade: a sum's columns that make 10 or more (the last one too), or a difference's trades (a trade across
   zeros counts once) */
const trades = (a, b, op) => algSteps(a, b, op).filter((s) => (op === "+" ? s.val >= 10 : s.from !== null)).length;
/* the sum without carrying: each column's digits added, keeping only the ones digit */
const noCarry = (a, b) =>
  +[...String(Math.max(a, b))]
    .reverse()
    .map((c, i) => (digitAt(a, i) + digitAt(b, i)) % 10)
    .reverse()
    .join("");
/* the difference taking the smaller digit from the bigger in every column */
const smallFromBig = (a, b) =>
  +[...String(a)]
    .reverse()
    .map((c, i) => Math.abs(digitAt(a, i) - digitAt(b, i)))
    .reverse()
    .join("");
/* stories: [story for a and b, unit], adding (+) or taking away (−) */
const STORIES = {
  "+": [
    [
      (a, b) =>
        `A rocket flies ${commas(a)} kilometers on the first day and ${commas(b)} kilometers on the second day. How far does it fly in all?`,
      "kilometers",
    ],
    [
      (a, b) =>
        `The launch tower holds ${commas(a)} liters of fuel in one tank and ${commas(b)} liters in another. How many liters is that in all?`,
      "liters",
    ],
    [
      (a, b) =>
        `The space museum had ${commas(a)} visitors last year and ${commas(b)} visitors this year. How many visitors is that in all?`,
      "visitors",
    ],
  ],
  "−": [
    [
      (a, b) =>
        `A rocket has to fly ${commas(a)} kilometers. It has flown ${commas(b)} kilometers so far. How far does it still have to go?`,
      "kilometers",
    ],
    [
      (a, b) =>
        `A fuel tank holds ${commas(a)} liters. The rocket burns ${commas(b)} liters at liftoff. How many liters are left?`,
      "liters",
    ],
    [
      (a, b) =>
        `The space museum had ${commas(a)} visitors this year. ${commas(b)} of them came in the summer. How many came the rest of the year?`,
      "visitors",
    ],
  ],
};
function genAlgorithm() {
  const variant = R(0, 2),
    op = variant === 0 ? "+" : "−",
    algOp = op === "+" ? "+" : "-";
  let a, b;
  do {
    const places = R(4, 6);
    if (variant === 2) {
      /* across zeros: a round number like 40,000 or 305,000 */
      a = friendly(places, 2);
      a -= a % 1000;
    } else a = friendly(places, R(2, 4));
    b = friendly(places - R(0, 1), R(2, 3));
    if (op === "−" && b > a) [a, b] = [b, a];
  } while (
    a === b ||
    trades(a, b, algOp) > 1 ||
    (variant === 2 && trades(a, b, algOp) !== 1) ||
    nonzero(op === "+" ? a + b : a - b) > 5 ||
    a + b > 999999 ||
    (variant === 2 && !algSteps(a, b, "-").some((s) => s.marks.some((m) => m.v === 9)))
  );
  const answer = op === "+" ? a + b : a - b,
    [story, unit] = pick(STORIES[op]);
  const wrong =
    op === "+"
      ? [[noCarry(a, b), `That leaves out the 1 you carry when a column makes 10 or more.`]]
      : [
          [
            smallFromBig(a, b),
            `That takes the smaller digit from the bigger one in each column. When the top digit is too small, trade from the next place.`,
          ],
          [a + b, `That adds. Taking away means subtract.`],
        ];
  return {
    kind: "num",
    unit,
    answer,
    prompt: story(a, b),
    /* the hint works the ones column only: the rest is the student's to do */
    fig: (show) => algFig(a, b, algOp, show ? 1 : 0),
    misc: miscOf(answer, wrong).filter(([v]) => v !== answer),
    hint:
      op === "+"
        ? `Line up the places and add from the ones. Carry a 1 when a column makes 10 or more.`
        : `Line up the places and subtract from the ones. When the top digit is too small, trade 1 from the next place${variant === 2 ? " (across the zeros)" : ""}.`,
    explain: `${commas(a)} ${op} ${commas(b)} = ${commas(answer)} ${unit}.`,
  };
}

/* ---------- Countdown: the final round ---------- */
const genBoss = () => pick([genDecimals, genLines, genPlace, genTimes, genRound, genAlgorithm])();

const ZONES = [
  {
    id: "decimals",
    name: "Fuel Gauge",
    lessons: "Lessons 1–2",
    blurb: "Write tenths and hundredths as decimals, and see why 0.6 and 0.60 are the same.",
    gen: genDecimals,
  },
  {
    id: "lines",
    name: "Number Line Launch",
    lessons: "Lessons 3–5",
    blurb: "Find decimals on number lines, and compare and order decimals and fractions.",
    gen: genLines,
  },
  {
    id: "place",
    name: "Place Value Pad",
    lessons: "Lessons 6–9",
    blurb: "Read and write numbers to 1,000,000, and find what each digit is worth.",
    gen: genPlace,
  },
  {
    id: "times",
    name: "Ten-Times Thruster",
    lessons: "Lessons 10–11",
    blurb: "Move digits a place for ten times as much, and read large numbers on number lines.",
    gen: genTimes,
  },
  {
    id: "round",
    name: "Orbit Rounding",
    lessons: "Lessons 12–17",
    blurb: "Compare and order big numbers, and round to the nearest thousand, ten thousand, or hundred thousand.",
    gen: genRound,
  },
  {
    id: "algorithm",
    name: "Launch Pad",
    lessons: "Lessons 18–22",
    blurb: "Add and subtract with the standard algorithm, including across zeros.",
    gen: genAlgorithm,
  },
  {
    id: "boss",
    name: "Countdown",
    lessons: "All lessons",
    blurb: "Fuel the rocket! Every right answer fills one of its 10 fuel cells.",
    gen: genBoss,
  },
];

/* the rocket: 10 fuel cells up its side, `lit` of them full (the boss icon fills all of them) */
const rocket = (lit) =>
  '<path d="M32,4Q44,16 42,44H22Q20,16 32,4Z" fill="#f3f6fb" stroke="#0a2340" stroke-width="1.5"/><circle cx="32" cy="22" r="4" fill="#7fe3ff" stroke="#0a2340" stroke-width="1.5"/><path d="M22,36L14,50L22,46ZM42,36L50,50L42,46Z" fill="#ff7b7b" stroke="#0a2340" stroke-width="1.5"/>' +
  (lit === 10 ? '<path d="M25,46Q32,64 39,46Z" fill="#ffc93c"/>' : "") +
  range(10)
    .map(
      (i) =>
        `<rect x="54" y="${49 - i * 5}" width="7" height="4" rx="1" fill="${i < lit ? "#5fe0a8" : "rgba(255,255,255,.15)"}"/>`,
    )
    .join("");
const ICON = {
  decimals:
    '<path d="M8,44A24,24 0 0,1 56,44" fill="none" stroke="#f3f6fb" stroke-width="3"/><path d="M8,44A24,24 0 0,1 40,22" fill="none" stroke="#5fe0a8" stroke-width="5"/><path d="M32,44L44,26" stroke="#ffc93c" stroke-width="3"/><circle cx="32" cy="44" r="3.5" fill="#ffc93c"/><text x="32" y="60" fill="#7fe3ff" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">0.75</text>',
  lines:
    '<path d="M4,40H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M8,32V48M56,32V48" stroke="#f3f6fb" stroke-width="2"/><path d="M12.8,36V44M17.6,36V44M22.4,36V44M27.2,36V44M32,34V46M36.8,36V44M41.6,36V44M46.4,36V44M51.2,36V44" stroke="#f3f6fb" stroke-width="1.5"/><circle cx="41.6" cy="40" r="5" fill="#ffc93c"/><text x="41.6" y="24" fill="#7fe3ff" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">0.7</text>',
  place:
    '<text x="32" y="30" fill="#ffc93c" font-size="15" font-weight="700" text-anchor="middle" font-family="monospace">100,000</text><text x="32" y="50" fill="#7fe3ff" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">10 × 10,000</text>',
  times:
    '<text x="32" y="30" fill="#f3f6fb" font-size="15" font-weight="700" text-anchor="middle" font-family="monospace">450</text><text x="32" y="52" fill="#ffc93c" font-size="15" font-weight="700" text-anchor="middle" font-family="monospace">4,500</text><path d="M50,24Q58,36 50,44" fill="none" stroke="#7fe3ff" stroke-width="2"/>',
  round:
    '<circle cx="32" cy="34" r="10" fill="#7fe3ff" stroke="#0a2340" stroke-width="1.5"/><ellipse cx="32" cy="34" rx="26" ry="9" fill="none" stroke="#ffc93c" stroke-width="2.5"/><circle cx="56" cy="31" r="3.5" fill="#f3f6fb"/>',
  algorithm:
    '<g fill="#f3f6fb" font-size="13" font-weight="700" text-anchor="end" font-family="monospace"><text x="52" y="26">4625</text><text x="52" y="40">+2318</text></g><path d="M14,45H54" stroke="#f3f6fb" stroke-width="2"/><text x="52" y="58" fill="#ffc93c" font-size="13" font-weight="700" text-anchor="end" font-family="monospace">6943</text><text x="36" y="13" fill="#7fe3ff" font-size="9" font-weight="700" font-family="monospace">1</text>',
  boss: rocket(10),
};
