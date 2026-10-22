/* Trail Rangers (Grade 5 Unit 6): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Place-value charts and commas come from shared/blocks.js; tapes from shared/numlines.js; fraction strips from
   shared/fractions.js; line plots from shared/graphs.js; fr, mixed, and PART from shared/pictures.js; mcOf, miscOf, gcd, and
   lcm from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Every problem also
   carries facts for checks.js: its kind (t) and the numbers it was made from, so the answer can be worked out again. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* a number as the game writes it: commas in whole numbers, and decimals as short as they go */
const num = (v) => (Number.isInteger(v) ? commas(v) : String(+v.toFixed(3)));
/* 10 to the power p, written with an exponent (html) */
const pow = (p) => `10<sup>${p}</sup>`;
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

/* ---------- Ranger Station: powers of 10 (Lessons 1–2) ---------- */
function genPowers() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* a decimal × 10, 100, or 1,000: each digit moves left */
    const p = R(1, 3),
      tenths = R(11, 99),
      start = tenths / 10,
      answer = (tenths * 10 ** p) / 10;
    return {
      kind: "num",
      unit: "",
      answer,
      facts: { t: "times", start, p },
      prompt: `What is ${num(start)} × ${commas(10 ** p)}?`,
      fig: (show) =>
        pvChart([["", start], ...(show ? [[`× ${commas(10 ** p)}`, answer]] : [])], -1, {
          places: [4, 3, 2, 1, 0, -1],
        }),
      misc: apart(answer, [
        [
          start,
          `Writing zeros after the decimal point doesn’t change ${num(start)}. Move each digit ${p} ${p === 1 ? "place" : "places"} left.`,
        ],
        ...(p > 1
          ? [
              [
                (tenths * 10 ** (p - 1)) / 10,
                `That’s × ${commas(10 ** (p - 1))}. ${commas(10 ** p)} has ${p} zeros: move each digit ${p} places.`,
              ],
            ]
          : []),
        [answer / 100, `That divides. Multiplying by ${commas(10 ** p)} makes it bigger: each digit moves left.`],
      ]),
      hint: `× ${commas(10 ** p)} moves each digit ${p} ${p === 1 ? "place" : "places"} to the left.`,
      explain: `Each digit moves ${p} ${p === 1 ? "place" : "places"} left: ${num(start)} × ${commas(10 ** p)} = ${num(answer)}.`,
    };
  }
  if (variant === 1) {
    /* a whole number ÷ 10, 100, or 1,000: each digit moves right */
    const p = R(1, 3),
      n = R(11, 99) * 10 ** R(1, 2),
      answer = n / 10 ** p;
    return {
      kind: "num",
      unit: "",
      answer,
      facts: { t: "divide", n, p },
      prompt: `What is ${commas(n)} ÷ ${commas(10 ** p)}?`,
      fig: (show) =>
        pvChart([["", n], ...(show ? [[`÷ ${commas(10 ** p)}`, answer]] : [])], -1, {
          places: [3, 2, 1, 0, -1, -2, -3],
        }),
      misc: apart(answer, [
        [n * 10 ** p, `That multiplies. Dividing by ${commas(10 ** p)} makes it smaller: each digit moves right.`],
        ...(p > 1
          ? [
              [
                n / 10 ** (p - 1),
                `That’s ÷ ${commas(10 ** (p - 1))}. ${commas(10 ** p)} has ${p} zeros: move each digit ${p} places.`,
              ],
            ]
          : []),
      ]),
      hint: `÷ ${commas(10 ** p)} moves each digit ${p} ${p === 1 ? "place" : "places"} to the right.`,
      explain: `Each digit moves ${p} ${p === 1 ? "place" : "places"} right: ${commas(n)} ÷ ${commas(10 ** p)} = ${num(answer)}.`,
    };
  }
  if (variant === 2) {
    /* a digit × a power of 10 written with an exponent */
    const a = R(2, 9),
      p = R(2, 5),
      answer = a * 10 ** p;
    return {
      kind: "num",
      unit: "",
      answer,
      facts: { t: "exponent", a, p },
      prompt: `What is ${a} × ${pow(p)}?`,
      misc: apart(answer, [
        [
          a * p,
          `${pow(p)} isn’t 10 × ${p}. It’s ${p} tens multiplied: ${range(p)
            .map(() => 10)
            .join(" × ")} = ${commas(10 ** p)}.`,
        ],
        [a * 10 ** (p - 1), `That has one zero too few. ${pow(p)} is 1 followed by ${p} zeros.`],
      ]),
      hint: `${pow(p)} is ${range(p)
        .map(() => 10)
        .join(" × ")}: 1 followed by ${p} zeros.`,
      explain: `${pow(p)} = ${commas(10 ** p)}, so ${a} × ${pow(p)} = ${commas(answer)}.`,
    };
  }
  /* which exponent form matches a product of tens */
  const p = R(2, 6);
  return {
    ...mcOf([
      [pow(p), null],
      [
        `10 × ${p}`,
        `That’s ${10 * p}. ${range(p)
          .map(() => 10)
          .join(" × ")} multiplies ${p} tens together.`,
      ],
      [`${p}<sup>10</sup>`, `That multiplies ${p} by itself 10 times. Here 10 is multiplied ${p} times.`],
    ]),
    facts: { t: "power", p },
    prompt: `Which is the same as ${range(p)
      .map(() => 10)
      .join(" × ")}?`,
    hint: "Count the tens being multiplied. That number goes up high: the exponent.",
    explain: `${p} tens are multiplied, so it’s ${pow(p)} = ${commas(10 ** p)}.`,
  };
}

/* ---------- Trail Markers: metric conversions (Lessons 3–6) ---------- */
/* metric units, big to small: [big, small, how many small in one big, what's measured] */
const METRIC = [
  ["kilometers", "meters", 1000, "trail"],
  ["meters", "centimeters", 100, "rope"],
  ["centimeters", "millimeters", 10, "beetle"],
  ["liters", "milliliters", 1000, "water jug"],
  ["kilograms", "grams", 1000, "backpack"],
];
function genMetric() {
  const variant = R(0, 3),
    name = pick(KIDS),
    [big, small, per, thing] = pick(METRIC);
  if (variant === 0) {
    /* big units to small: multiply */
    const amount = R(11, 49) / 10,
      answer = Math.round(amount * per);
    return {
      kind: "num",
      unit: small,
      answer,
      facts: { t: "toSmall", amount, per },
      prompt: `The ${thing} is ${num(amount)} ${big}. How many ${small} is that?`,
      misc: apart(answer, [
        [
          amount / per,
          `That divides. Small units are many more: 1 ${big.slice(0, -1)} is ${commas(per)} ${small}, so multiply.`,
        ],
        [
          Math.round((amount * per) / 10),
          `That multiplies by ${commas(per / 10)}. There are ${commas(per)} ${small} in 1 ${big.slice(0, -1)}.`,
        ],
      ]),
      hint: `1 ${big.slice(0, -1)} = ${commas(per)} ${small}. Multiply by ${commas(per)}.`,
      explain: `${num(amount)} × ${commas(per)} = ${commas(answer)} ${small}.`,
    };
  }
  if (variant === 1) {
    /* small units to big: divide */
    const answer = R(11, 49) / 10,
      amount = Math.round(answer * per);
    return {
      kind: "num",
      unit: big,
      answer,
      facts: { t: "toBig", amount, per },
      prompt: `The ${thing} is ${commas(amount)} ${small}. How many ${big} is that?`,
      misc: apart(answer, [
        [amount * per, `That multiplies. Big units are fewer: divide by ${commas(per)}.`],
        ...(per > 10
          ? [
              [
                amount / (per / 10),
                `That divides by ${commas(per / 10)}. There are ${commas(per)} ${small} in 1 ${big.slice(0, -1)}.`,
              ],
            ]
          : []),
      ]),
      hint: `${commas(per)} ${small} make 1 ${big.slice(0, -1)}. Divide by ${commas(per)}.`,
      explain: `${commas(amount)} ÷ ${commas(per)} = ${num(answer)} ${big}.`,
    };
  }
  if (variant === 2) {
    /* several bottles in milliliters, in liters */
    const each = pick([250, 500, 750]),
      count = each === 750 ? 4 : R(2, 8),
      total = each * count,
      answer = total / 1000;
    return {
      kind: "num",
      unit: "liters",
      answer,
      facts: { t: "bottles", each, count },
      prompt: `Each canteen holds ${each} milliliters. ${name} fills ${count} canteens. How many liters of water is that?`,
      misc: apart(answer, [
        [total, `That’s the milliliters: ${each} × ${count} = ${commas(total)}. Divide by 1,000 for liters.`],
        [each / 1000, "That’s one canteen in liters. There are " + count + " canteens."],
      ]),
      hint: `Find the milliliters in all, then divide by 1,000 to get liters.`,
      explain: `${each} × ${count} = ${commas(total)} milliliters. ${commas(total)} ÷ 1,000 = ${num(answer)} liters.`,
    };
  }
  /* a trail in parts, some in kilometers and some in meters: the total in kilometers */
  const km = R(11, 29) / 10,
    parts = [R(2, 9) * 100, R(1, 9) * 100],
    totalMeters = Math.round(km * 1000) + parts[0] + parts[1],
    answer = totalMeters / 1000;
  return {
    kind: "num",
    unit: "kilometers",
    answer,
    facts: { t: "trail", km, parts },
    prompt: `A loop trail has three parts: ${num(km)} kilometers, ${parts[0]} meters, and ${parts[1]} meters. How long is it in kilometers?`,
    misc: apart(answer, [
      [totalMeters, `That’s the length in meters. Divide by 1,000 for kilometers.`],
      [km + parts[0] + parts[1], "That adds kilometers to meters. Change them to the same unit first."],
    ]),
    hint: `Change ${num(km)} kilometers to meters (× 1,000), add, then change back to kilometers (÷ 1,000).`,
    explain: `${num(km)} km = ${commas(Math.round(km * 1000))} m. ${commas(Math.round(km * 1000))} + ${parts[0]} + ${parts[1]} = ${commas(totalMeters)} m = ${num(answer)} km.`,
  };
}

/* ---------- Rope Bridge: customary length (Lesson 7) ---------- */
/* customary conversions: [big, small, how many small in one big] */
const CUSTOMARY = [
  ["yards", "feet", 3],
  ["feet", "inches", 12],
  ["yards", "inches", 36],
];
function genCustomary() {
  const variant = R(0, 2),
    name = pick(KIDS);
  if (variant === 0) {
    /* big units to small */
    const [big, small, per] = pick(CUSTOMARY),
      amount = per === 36 ? R(2, 4) : R(2, 9),
      answer = amount * per;
    return {
      kind: "num",
      unit: small,
      answer,
      facts: { t: "toSmall", amount, per },
      prompt: `The rope bridge is ${amount} ${big} long. How many ${small} is that?`,
      misc: apart(answer, [
        [amount + per, `That adds. Each ${big.slice(0, -1)} is ${per} ${small}: multiply.`],
        ...(amount % per === 0
          ? []
          : [[amount / per, `That divides. There are more ${small} than ${big}: multiply by ${per}.`]]),
      ]),
      hint: `1 ${big === "feet" ? "foot" : big.slice(0, -1)} = ${per} ${small}.`,
      explain: `${amount} × ${per} = ${answer} ${small}.`,
    };
  }
  if (variant === 1) {
    /* feet and inches together, in inches */
    const feet = R(2, 6),
      inches = R(1, 11),
      answer = feet * 12 + inches;
    return {
      kind: "num",
      unit: "inches",
      answer,
      facts: { t: "feetInches", feet, inches },
      prompt: `A tent pole is ${feet} feet ${inches} inches long. How many inches is that?`,
      misc: apart(answer, [
        [
          Number(`${feet}${inches}`),
          `That writes the feet and inches side by side. Each foot is 12 inches: ${feet} × 12 first.`,
        ],
        [feet + inches, "That adds the feet as inches. Each foot is 12 inches."],
      ]),
      hint: `${feet} feet is ${feet} × 12 inches. Then add the ${inches} inches.`,
      explain: `${feet} × 12 = ${feet * 12}, and ${feet * 12} + ${inches} = ${answer} inches.`,
    };
  }
  /* cut a rope in feet into pieces measured in inches */
  let feet, piece;
  do {
    feet = R(2, 8);
    piece = pick([4, 6, 8, 9, 12, 16, 18]);
  } while ((feet * 12) % piece !== 0 || piece === 12);
  const answer = (feet * 12) / piece;
  return {
    kind: "num",
    unit: "pieces",
    answer,
    facts: { t: "pieces", feet, piece },
    prompt: `${name} cuts a ${feet}-foot rope into pieces ${piece} inches long. How many pieces is that?`,
    misc: apart(answer, [
      [feet * piece, `That multiplies feet by inches. Change ${feet} feet to inches first: ${feet} × 12.`],
      [feet / piece, `That divides feet by inches. Change ${feet} feet to inches first: ${feet} × 12 = ${feet * 12}.`],
    ]),
    hint: `Change the rope to inches: ${feet} × 12. Then how many ${piece}-inch pieces fit?`,
    explain: `${feet} × 12 = ${feet * 12} inches. ${feet * 12} ÷ ${piece} = ${answer} pieces.`,
  };
}

/* ---------- Trail Mix: add and subtract with unlike denominators (Lessons 8–13) ---------- */
/* two different denominators whose common denominator is at most 24 */
function twoDenominators() {
  let b, d;
  do {
    b = pick([2, 3, 4, 5, 6, 8, 10, 12]);
    d = pick([2, 3, 4, 5, 6, 8, 10, 12]);
  } while (b === d || lcm(b, d) > 24);
  return [b, d];
}
/* a fraction a/b less than 1 in lowest terms */
const properOf = (b) => {
  let a;
  do a = R(1, b - 1);
  while (gcd(a, b) !== 1);
  return a;
};
/* amounts in a story: [the unit for 1 or less, the unit for more, a story for a/b + c/d, a story for a/b − c/d] */
const MIX = {
  add: [
    (x, y) => `A trail mix recipe uses ${x} cup of nuts and ${y} cup of raisins. How many cups is that in all?`,
    (x, y) => `${pick(KIDS)} hikes ${x} mile to the creek, then ${y} mile to the lookout. How far is that?`,
  ],
  subtract: [
    (x, y) => `A bag holds ${x} pound of trail mix. The rangers eat ${y} pound. How much is left?`,
    (x, y) => `The red trail is ${x} mile long and the blue trail is ${y} mile long. How much longer is the red trail?`,
  ],
};
function genUnlike() {
  const variant = R(0, 3),
    [b, d] = twoDenominators(),
    common = lcm(b, d);
  if (variant <= 1) {
    /* add or subtract two fractions less than 1, in a story */
    const adding = variant === 0;
    let a, c;
    do {
      a = properOf(b);
      c = properOf(d);
    } while (!adding && a * d <= c * b);
    const top = adding ? a * (common / b) + c * (common / d) : a * (common / b) - c * (common / d),
      answer = top / common,
      story = pick(MIX[adding ? "add" : "subtract"]);
    return {
      kind: "num",
      frac: true,
      unit: "",
      answer,
      facts: { t: adding ? "add" : "subtract", a, b, c, d },
      prompt: story(fr(a, b), fr(c, d)),
      fig: (show) =>
        strips(
          [
            { d: show ? common : b, k: show ? a * (common / b) : a, lab: [a, b] },
            { d: show ? common : d, k: show ? c * (common / d) : c, lab: [c, d], cls: "b" },
          ],
          { wholes: 1, label: `${a}/${b} and ${c}/${d}${show ? ` in ${common}ths` : ""}` },
        ),
      misc: apart(answer, [
        [
          adding ? (a + c) / (b + d) : (a - c) / (b - d),
          `That ${adding ? "adds" : "subtracts"} the tops and the bottoms. Write both with the same denominator first.`,
        ],
        ...(adding
          ? [
              [
                (a + c) / common,
                `That changes the bottoms to ${common} but not the tops. ${fr(a, b)} = ${fr(a * (common / b), common)}.`,
              ],
            ]
          : []),
      ]),
      hint: `Write both with the denominator ${common}: ${fr(a, b)} = ${fr(a * (common / b), common)} and ${fr(c, d)} = ${fr(c * (common / d), common)}.`,
      explain: `${fr(a * (common / b), common)} ${adding ? "+" : "−"} ${fr(c * (common / d), common)} = ${fr(top, common)}${gcd(top, common) > 1 || top > common ? ` = ${nice(top, common)}` : ""}.`,
    };
  }
  if (variant === 2) {
    /* which sum has a common denominator; the wrong ones change no top, only one top, or subtract */
    const a = properOf(b),
      c = properOf(d),
      [up, over] = [a * (common / b), c * (common / d)],
      wrongs = [
        [a, c, "+", "That changes the bottoms but not the tops. Multiply the top by the same number as the bottom."],
        [up, c, "+", `That changes ${fr(a, b)} but not ${fr(c, d)}. ${fr(c, d)} = ${fr(over, common)}.`],
        [a, over, "+", `That changes ${fr(c, d)} but not ${fr(a, b)}. ${fr(a, b)} = ${fr(up, common)}.`],
        [up, over, "−", "That subtracts. The question adds."],
      ].filter(
        ([x, y, op], i, all) =>
          (op === "+" ? x + y : x - y) !== up + over &&
          all.findIndex(([x2, y2, op2]) => (op2 === "+" ? x2 + y2 : x2 - y2) === (op === "+" ? x + y : x - y)) === i,
      );
    return {
      ...mcOf([
        [`${fr(up, common)} + ${fr(over, common)}`, null],
        ...wrongs.slice(0, 2).map(([x, y, op, why]) => [`${fr(x, common)} ${op} ${fr(y, common)}`, why]),
      ]),
      facts: { t: "same", a, b, c, d },
      prompt: `Which has the same value as ${fr(a, b)} + ${fr(c, d)}?`,
      hint: `Write both fractions with the denominator ${common}. Multiply the top and the bottom by the same number.`,
      explain: `${fr(a, b)} = ${fr(a * (common / b), common)} and ${fr(c, d)} = ${fr(c * (common / d), common)}.`,
    };
  }
  /* mixed numbers: subtract, trading a whole when the first fraction is too small */
  let a, c;
  do {
    a = properOf(b);
    c = properOf(d);
  } while (a * d >= c * b);
  const first = R(3, 5),
    second = R(1, first - 1),
    topA = (first * b + a) * (common / b),
    topC = (second * d + c) * (common / d),
    answer = (topA - topC) / common;
  return {
    kind: "num",
    frac: true,
    unit: "miles",
    answer,
    facts: { t: "mixed", first, a, b, second, c, d },
    prompt: `The trail to the summit is ${mixed(first * b + a, b)} miles. The hikers have gone ${mixed(second * d + c, d)} miles. How far is left?`,
    misc: apart(answer, [
      [
        first - second + (c * (common / d) - a * (common / b)) / common,
        `That subtracts the smaller fraction from the bigger one. ${fr(a, b)} is less than ${fr(c, d)}: trade 1 whole for ${common}/${common} first.`,
      ],
      [first - second - 1, "That subtracts the whole numbers and stops. Subtract the fractions too."],
    ]),
    hint: `Write both fractions in ${common}ths. ${fr(a * (common / b), common)} is less than ${fr(c * (common / d), common)}, so trade 1 whole for ${fr(common, common)}.`,
    explain: `${mixed(first * b + a, b)} = ${first - 1} ${fr(a * (common / b) + common, common)}, and ${mixed(second * d + c, d)} = ${second} ${fr(c * (common / d), common)}. ${first - 1} − ${second} = ${first - 1 - second}, and ${fr(a * (common / b) + common, common)} − ${fr(c * (common / d), common)} = ${fr(a * (common / b) + common - c * (common / d), common)}: ${nice(topA - topC, common)} miles.`,
  };
}

/* ---------- Rain Gauge: line plots with fractions (Lessons 14–15) ---------- */
/* rainfall for 8 to 12 days in eighths of an inch, from 1/8 to 7/8, with one amount the most common */
function rainData() {
  let counts;
  do {
    counts = {};
    range(R(8, 12)).forEach(() => {
      const k = R(1, 7);
      counts[k] = (counts[k] || 0) + 1;
    });
  } while (Object.keys(counts).length < 3 || Math.max(...Object.values(counts)) > 5);
  return counts;
}
function genPlots() {
  const variant = R(0, 2),
    counts = rainData(),
    values = Object.keys(counts).map(Number),
    lo = Math.min(...values),
    hi = Math.max(...values),
    plot = (opts = {}) => lineplot(counts, 0, 8, { d: 8, unit: "inches of rain", u: 44, ...opts });
  if (variant === 0) {
    /* the most minus the least */
    return {
      kind: "num",
      frac: true,
      unit: "inch",
      answer: (hi - lo) / 8,
      facts: { t: "spread", counts },
      prompt:
        "The line plot shows how much rain fell each day. How much more rain fell on the wettest day than on the driest?",
      fig: (show) => plot(show ? { diff: [lo, hi] } : {}),
      misc: apart((hi - lo) / 8, [
        [(hi + lo) / 8, "That adds. How much more: subtract the least from the most."],
        [hi / 8, "That’s the wettest day. Subtract the driest day’s rain."],
      ]),
      hint: "Find the X farthest right and the X farthest left. Subtract.",
      explain: `${fr(hi, 8)} − ${fr(lo, 8)} = ${fr(hi - lo, 8)}${gcd(hi - lo, 8) > 1 ? ` = ${nice(hi - lo, 8)}` : ""} inch.`,
    };
  }
  if (variant === 1) {
    /* all the rain on the days with one amount */
    const k = pick(values.filter((v) => counts[v] > 1).concat(values)),
      total = counts[k] * k;
    return {
      kind: "num",
      frac: true,
      unit: total <= 8 ? "inch" : "inches",
      answer: total / 8,
      facts: { t: "total", counts, k },
      prompt: `The line plot shows how much rain fell each day. On the days with ${fr(k, 8)} inch, how much rain fell in all?`,
      fig: (show) => plot(show ? { mark: k } : {}),
      misc: apart(total / 8, [
        ...(counts[k] > 1 ? [[k / 8, `That’s one day. There are ${counts[k]} Xs at ${fr(k, 8)}.`]] : []),
        [counts[k], `That’s how many days. Each one had ${fr(k, 8)} inch: ${counts[k]} × ${fr(k, 8)}.`],
      ]),
      hint: `Count the Xs at ${fr(k, 8)}. Each X is a day with ${fr(k, 8)} inch.`,
      explain: `${counts[k]} × ${fr(k, 8)} = ${fr(total, 8)}${gcd(total, 8) > 1 || total > 8 ? ` = ${nice(total, 8)}` : ""} ${total <= 8 ? "inch" : "inches"}.`,
    };
  }
  /* how many days had more than an amount */
  const cut = R(2, 6),
    more = values.filter((v) => v > cut).reduce((n, v) => n + counts[v], 0);
  if (!more || more === Object.values(counts).reduce((x, y) => x + y, 0)) return genPlots();
  return {
    kind: "num",
    unit: "days",
    answer: more,
    facts: { t: "more", counts, cut },
    prompt: `The line plot shows how much rain fell each day. On how many days did more than ${nice(cut, 8)} inch fall?`,
    fig: () => plot(),
    misc: apart(more, [
      ...(counts[cut]
        ? [
            [
              more + counts[cut],
              `That counts the days with exactly ${nice(cut, 8)} inch too. “More than” leaves them out.`,
            ],
          ]
        : []),
      [values.filter((v) => v > cut).length, "That counts the amounts, not the days. Count every X."],
    ]),
    hint: `${nice(cut, 8)} inch is ${fr(cut, 8)}. Count the Xs to the right of it.`,
    explain: `${more} Xs are to the right of ${fr(cut, 8)}: ${more} days.`,
  };
}

/* ---------- Lookout Point: the size of products (Lessons 16–19) ---------- */
function genSize() {
  const variant = R(0, 1),
    n = pick([8, 12, 15, 20, 24]);
  if (variant === 0) {
    /* is a fraction × n more than, less than, or equal to n */
    const kind = pick(["less", "equal", "more"]),
      b = pick([3, 4, 5]),
      a = kind === "less" ? R(1, b - 1) : kind === "equal" ? b : R(b + 1, 2 * b - 1),
      answers = { less: `Less than ${n}`, equal: `Equal to ${n}`, more: `More than ${n}` };
    return {
      ...mcOf(
        ["less", "equal", "more"].map((k) => [
          answers[k],
          k === kind
            ? null
            : `${fr(a, b)} is ${a < b ? "less than 1" : a === b ? "equal to 1" : "more than 1"}, so ${fr(a, b)} × ${n} is ${a < b ? "less than" : a === b ? "equal to" : "more than"} ${n}.`,
        ]),
      ),
      facts: { t: "compare", a, b, n },
      prompt: `Without multiplying: is ${fr(a, b)} × ${n} more than, less than, or equal to ${n}?`,
      fig: (show) =>
        tapes(
          [{ label: `${n}`, n, show: n }, ...(show ? [{ label: `${fr(a, b)} × ${n}`, n: (a * n) / b, show: "" }] : [])],
          { label: `${n}${show ? ` and ${a}/${b} of it` : ""}` },
        ),
      hint: `Is ${fr(a, b)} less than 1, equal to 1, or more than 1?`,
      explain: `${fr(a, b)} is ${a < b ? "less than 1" : a === b ? "equal to 1" : "more than 1"}, so ${fr(a, b)} × ${n} is ${answers[kind].toLowerCase()}.`,
    };
  }
  /* which product is greater than n */
  const b = pick([3, 4, 5]),
    small = R(1, b - 1),
    big = R(b + 1, 2 * b - 1);
  return {
    ...mcOf([
      [`${fr(big, b)} × ${n}`, null],
      [`${fr(small, b)} × ${n}`, `${fr(small, b)} is less than 1, so the product is less than ${n}.`],
      [`${fr(b, b)} × ${n}`, `${fr(b, b)} is 1, so the product is equal to ${n}, not greater.`],
    ]),
    facts: { t: "greater", big, b, n },
    prompt: `Without multiplying: which product is greater than ${n}?`,
    hint: "Multiplying by more than 1 makes a number bigger. Which fraction is more than 1?",
    explain: `${fr(big, b)} is more than 1, so ${fr(big, b)} × ${n} is greater than ${n}.`,
  };
}

/* ---------- Summit: the final round ---------- */
const genBoss = () => pick([genPowers, genMetric, genCustomary, genUnlike, genPlots, genSize])();

const ZONES = [
  {
    id: "powers",
    name: "Ranger Station",
    lessons: "Lessons 1–2",
    blurb: "Multiply and divide by 10, 100, and 1,000, and write powers of 10 with exponents.",
    gen: genPowers,
  },
  {
    id: "metric",
    name: "Trail Markers",
    lessons: "Lessons 3–6",
    blurb: "Convert kilometers, meters, liters, and grams, big to small and small to big.",
    gen: genMetric,
  },
  {
    id: "customary",
    name: "Rope Bridge",
    lessons: "Lesson 7",
    blurb: "Convert yards, feet, and inches, and cut ropes into pieces.",
    gen: genCustomary,
  },
  {
    id: "unlike",
    name: "Trail Mix",
    lessons: "Lessons 8–13",
    blurb: "Add and subtract fractions and mixed numbers with different denominators.",
    gen: genUnlike,
  },
  {
    id: "plots",
    name: "Rain Gauge",
    lessons: "Lessons 14–15",
    blurb: "Read line plots of rainfall in eighths of an inch.",
    gen: genPlots,
  },
  {
    id: "size",
    name: "Lookout Point",
    lessons: "Lessons 16–19",
    blurb: "Tell whether a product is more or less than a number, without multiplying.",
    gen: genSize,
  },
  {
    id: "boss",
    name: "Summit",
    lessons: "All lessons",
    blurb: "Climb to the summit! Every right answer takes you up another switchback.",
    gen: genBoss,
  },
];

/* the mountain with `climbed` of its 10 switchbacks lit, from the bottom (the boss icon lights all of them) */
const mountain = (climbed) =>
  '<path d="M2,60L32,6L62,60Z" fill="#3d5a80" stroke="#0a2340" stroke-width="1.5"/><path d="M24,20L32,6L40,20L36,18L32,22L28,18Z" fill="#f3f6fb"/>' +
  range(10)
    .map((i) => {
      const y = 56 - i * 4.6,
        half = (60 - y) * 0.42;
      return `<line x1="${32 - half + 3}" y1="${y.toFixed(1)}" x2="${32 + half - 3}" y2="${(y - 2).toFixed(1)}" stroke="${i < climbed ? "#ffc93c" : "rgba(243,246,251,.2)"}" stroke-width="2"/>`;
    })
    .join("");
const ICON = {
  powers:
    '<text x="32" y="32" fill="#f3f6fb" font-size="18" font-weight="700" text-anchor="middle" font-family="monospace">10</text><text x="48" y="20" fill="#ffc93c" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">3</text><text x="32" y="54" fill="#7fe3ff" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">1,000</text>',
  metric:
    '<path d="M30,58V10" stroke="#a9822a" stroke-width="4"/><path d="M32,12H56L50,20L56,28H32Z" fill="#5fe0a8" stroke="#0a2340" stroke-width="1.5"/><text x="43" y="23" fill="#0a2340" font-size="8" font-weight="700" text-anchor="middle" font-family="monospace">km</text>',
  customary:
    '<path d="M4,22Q32,40 60,22" fill="none" stroke="#a9822a" stroke-width="3"/><path d="M4,30Q32,48 60,30" fill="none" stroke="#a9822a" stroke-width="3"/><g stroke="#e9d2a0" stroke-width="3"><path d="M14,26V34M24,30V38M34,31V39M44,30V38M54,26V34"/></g>',
  unlike:
    '<g stroke="#f3f6fb" stroke-width="1.5"><rect x="6" y="14" width="52" height="12" fill="none"/><rect x="6" y="14" width="26" height="12" fill="#ffc93c"/><rect x="6" y="34" width="52" height="12" fill="none"/><rect x="6" y="34" width="17.3" height="12" fill="#7fe3ff"/></g><path d="M23.3,34V46M40.6,34V46" stroke="#f3f6fb" stroke-width="1.5"/>',
  plots:
    '<path d="M6,48H58" stroke="#f3f6fb" stroke-width="2"/><g fill="#ffc93c" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace"><text x="16" y="42">X</text><text x="28" y="42">X</text><text x="28" y="32">X</text><text x="40" y="42">X</text><text x="40" y="32">X</text><text x="40" y="22">X</text><text x="52" y="42">X</text></g><path d="M48,8V16" stroke="#7fe3ff" stroke-width="2"/><path d="M44,12Q48,4 52,12Z" fill="#7fe3ff"/>',
  size: '<rect x="6" y="18" width="40" height="12" rx="3" fill="#ffc93c"/><rect x="6" y="36" width="52" height="12" rx="3" fill="#7fe3ff"/><text x="32" y="14" fill="#f3f6fb" font-size="9" font-weight="700" text-anchor="middle" font-family="monospace">&lt; or &gt;?</text>',
  boss: mountain(10),
};
