/* Zoo Crew (Grade 4 Unit 5): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Tape diagrams, conversion tables, and rectangles come from figs.js; clock faces from shared/measure.js; commas from
   shared/blocks.js; fr from shared/pictures.js; mcOf and miscOf from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Every problem also
   carries facts for checks.js: its kind (t) and the numbers it was made from, so the answer can be worked out again. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* n and a word for it: "1 meter", "3 meters" (many: the word for more than 1) */
const pl = (n, one, many = one + "s") => `${commas(n)} ${n === 1 ? one : many}`;
/* the text with its first letter capitalized */
const cap = (text) => text[0].toUpperCase() + text.slice(1);

/* ---------- Feeding Line: times as many (Lessons 1–3) ---------- */
/* zoo comparisons with small numbers: [the smaller animal, the bigger one, what's counted (one, many)] */
const PAIRS = [
  ["the penguin", "the seal", ["fish", "fish"]],
  ["the rabbit", "the goat", ["carrot", "carrots"]],
  ["the monkey", "the gorilla", ["banana", "bananas"]],
  ["the parrot", "the toucan", ["grape", "grapes"]],
  ["the turtle", "the tortoise", ["leaf", "leaves"]],
];
/* the tape diagram for "big is times × small", with ? for the unknown (ask: 'big', 'times', or 'small') */
function compareTape(small, times, ask, show, [smallName, bigName]) {
  const big = small * times;
  const name = (animal) => cap(animal.replace(/^the /, ""));
  if (ask === "times" && !show)
    return timesTape(
      [
        { label: name(smallName), times: 1, each: small, total: small },
        { label: name(bigName), times: 1, span: Math.min(times, 6), each: big, total: `? × ${small}` },
      ],
      { label: `Tape diagram: ${big} compared with ${small}` },
    );
  return timesTape(
    [
      {
        label: name(smallName),
        times: 1,
        each: ask === "small" && !show ? "?" : small,
        total: ask === "small" && !show ? "?" : small,
      },
      {
        label: name(bigName),
        times,
        each: ask === "small" && !show ? "?" : small,
        total: ask === "big" && !show ? "?" : big,
      },
    ],
    { label: `Tape diagram: ${times} times ${ask === "small" && !show ? "?" : small}` },
  );
}
function genTimes() {
  const variant = R(0, 3),
    [smallName, bigName, [one, many]] = pick(PAIRS),
    small = R(2, 9),
    times = R(2, 9),
    big = small * times,
    names = [smallName, bigName];
  if (variant === 0) {
    /* the bigger amount */
    return {
      kind: "num",
      unit: many,
      answer: big,
      facts: { t: "times", small, times, ask: "big" },
      prompt: `${cap(smallName)} eats ${pl(small, one, many)}. ${cap(bigName)} eats ${times} times as many. How many ${many} does ${bigName} eat?`,
      fig: (show) => compareTape(small, times, "big", show, names),
      misc: miscOf(big, [
        [small + times, `That adds ${small} + ${times}. ${times} times as many is ${times} groups of ${small}.`],
        [times, `${cap(bigName)} eats ${times} times as many, not ${times} ${many}.`],
      ]).filter(([wrong]) => wrong !== big),
      hint: `Draw ${times} tapes as long as ${smallName}’s ${small}.`,
      explain: `${times} × ${small} = ${big} ${many}.`,
    };
  }
  if (variant === 1) {
    /* how many times as many */
    return {
      kind: "num",
      unit: "times as many",
      answer: times,
      facts: { t: "times", small, big, ask: "times" },
      prompt: `${cap(smallName)} eats ${pl(small, one, many)}. ${cap(bigName)} eats ${pl(big, one, many)}. How many times as many ${many} does ${bigName} eat?`,
      fig: (show) => compareTape(small, times, "times", show, names),
      misc: miscOf(times, [
        [big - small, `That’s how many more. How many groups of ${small} make ${big}?`],
        [big * small, `That multiplies. How many ${small}s make ${big}? Divide.`],
      ]).filter(([wrong]) => wrong !== times),
      hint: `${big} = ? × ${small}. How many ${small}s make ${big}?`,
      explain: `${big} ÷ ${small} = ${times}, so ${bigName} eats ${times} times as many.`,
    };
  }
  if (variant === 2) {
    /* the smaller amount */
    return {
      kind: "num",
      unit: many,
      answer: small,
      facts: { t: "times", big, times, ask: "small" },
      prompt: `${cap(bigName)} eats ${pl(big, one, many)}. That’s ${times} times as many as ${smallName} eats. How many ${many} does ${smallName} eat?`,
      fig: (show) => compareTape(small, times, "small", show, names),
      misc: miscOf(small, [
        [big - times, `That subtracts ${times}. ${big} is ${times} equal groups: divide ${big} ÷ ${times}.`],
        [big * times, `That makes ${smallName}’s amount bigger. ${smallName} eats less: divide.`],
      ]).filter(([wrong]) => wrong !== small),
      hint: `${big} = ${times} × ?. Split ${big} into ${times} equal parts.`,
      explain: `${big} ÷ ${times} = ${small} ${many}.`,
    };
  }
  /* which equation matches the comparison */
  return {
    ...mcOf([
      [`${times} × ${small} = ${big}`, null],
      [`${small} + ${times} = ${small + times}`, `That’s ${times} more, not ${times} times as many.`],
      [
        `${big} × ${times} = ${big * times}`,
        `That starts from ${big}. ${cap(smallName)} eats ${small}, and ${bigName} eats ${times} times that.`,
      ],
    ]),
    facts: { t: "times", small, times, ask: "equation" },
    prompt: `${cap(smallName)} eats ${pl(small, one, many)}. ${cap(bigName)} eats ${times} times as many. Which equation shows how many ${bigName} eats?`,
    fig: (show) => compareTape(small, times, "big", show, names),
    hint: `${times} times as many is ${times} groups of ${small}.`,
    explain: `${times} groups of ${small}: ${times} × ${small} = ${big}.`,
  };
}

/* ---------- Big Animals: comparisons with bigger numbers, and two steps (Lessons 4–6) ---------- */
/* zoo amounts in bigger numbers: {story(small, times) for the comparison, labels for the tapes, unit (one, many), the amounts
   the smaller one can be, and the question for how many more} */
const BIGS = [
  {
    story: (small, times) =>
      `On Monday, the zoo had ${commas(small)} visitors. On Saturday, it had ${times} times as many.`,
    have: (small, big) => `On Monday, the zoo had ${commas(small)} visitors. On Saturday, it had ${commas(big)}.`,
    labels: ["Monday", "Saturday"],
    unit: ["visitor", "visitors"],
    amounts: [200, 300, 400, 500, 600],
    more: "How many more visitors came on Saturday than on Monday?",
  },
  {
    story: (small, times) =>
      `In May, the gift shop sold ${commas(small)} posters. In July, it sold ${times} times as many.`,
    have: (small, big) => `In May, the gift shop sold ${commas(small)} posters. In July, it sold ${commas(big)}.`,
    labels: ["May", "July"],
    unit: ["poster", "posters"],
    amounts: [30, 40, 50, 60, 80],
    more: "How many more posters did it sell in July than in May?",
  },
  {
    story: (small, times) =>
      `The small fish tank holds ${commas(small)} liters. The big tank holds ${times} times as much.`,
    have: (small, big) =>
      `The small fish tank holds ${commas(small)} liters. The big tank holds ${commas(big)} liters.`,
    labels: ["Small", "Big"],
    unit: ["liter", "liters"],
    amounts: [200, 300, 400, 500],
    more: "How many more liters does the big tank hold?",
  },
];
/* an amount with zeros as a digit and a place: "300 is 3 hundreds" */
function asPlace(n) {
  const zeros = String(n).length - String(n).replace(/0+$/, "").length;
  return `${commas(n)} is ${n / 10 ** zeros} ${["ones", "tens", "hundreds", "thousands"][zeros]}`;
}
function genBigger() {
  const variant = R(0, 3),
    { story, have, labels, unit, amounts, more: moreQuestion } = pick(BIGS),
    many = unit[1],
    small = pick(amounts),
    times = variant === 2 ? 10 : R(3, 9),
    big = small * times;
  /* the tapes: the small amount, then times copies of it; bigTotal: what's written after them */
  const tape = (bigTotal) =>
    timesTape(
      [
        { label: labels[0], times: 1, each: commas(small), total: commas(small) },
        { label: labels[1], times, each: commas(small), total: bigTotal },
      ],
      { label: `Tape diagram: ${times} boxes of ${commas(small)}` },
    );
  if (variant === 0 || variant === 2) {
    /* times as many, or ten times as many, with big numbers */
    return {
      kind: "num",
      unit: many,
      answer: big,
      facts: { t: "times", small, times, ask: "big" },
      prompt: `${story(small, times)} How many ${many} is that?`,
      fig: (show) => tape(show ? commas(big) : "?"),
      misc: miscOf(big, [
        [small + times, `That adds ${times}. ${times} times as many means ${times} × ${commas(small)}.`],
        times === 10
          ? [100 * small, `That’s 100 times as many: the digits moved two places.`]
          : [
              big / 10,
              `That’s a place too small. ${asPlace(small)}, so ${times} times as many is ${times} × that many.`,
            ],
      ]),
      hint:
        times === 10
          ? `Ten times as many moves every digit one place to the left.`
          : `${asPlace(small)}. What is ${times} times that many?`,
      explain: `${times} × ${commas(small)} = ${commas(big)} ${many}.`,
    };
  }
  if (variant === 1) {
    /* two steps: how many more */
    const more = big - small;
    return {
      kind: "num",
      unit: `more ${many}`,
      answer: more,
      facts: { t: "times", small, times, ask: "more" },
      prompt: `${story(small, times)} ${moreQuestion}`,
      fig: (show) => tape(show ? `${commas(small)} + ${commas(more)}` : "?"),
      misc: miscOf(more, [
        [big, `That’s the bigger amount. How many more is it than ${commas(small)}? Subtract.`],
        [big - times, `That takes away ${times}. Take away the smaller amount, ${commas(small)}.`],
      ]),
      hint: `First find ${times} × ${commas(small)}. Then subtract ${commas(small)}, or count the ${times - 1} extra boxes.`,
      explain: `${times} × ${commas(small)} = ${commas(big)}, and ${commas(big)} − ${commas(small)} = ${commas(more)} more ${many}.`,
    };
  }
  /* how many times as many, with big numbers */
  return {
    kind: "num",
    unit: "times as many",
    answer: times,
    facts: { t: "times", small, big, ask: "times" },
    prompt: `${have(small, big)} How many times as many is that?`,
    fig: (show) =>
      show
        ? tape(commas(big))
        : timesTape(
            [
              { label: labels[0], times: 1, each: commas(small), total: commas(small) },
              {
                label: labels[1],
                times: 1,
                span: Math.min(times, 6),
                each: commas(big),
                total: `? × ${commas(small)}`,
              },
            ],
            { label: `Tape diagram: ${commas(big)} compared with ${commas(small)}` },
          ),
    misc: miscOf(times, [[big - small, `That’s how many more. How many ${commas(small)}s make ${commas(big)}?`]]),
    hint: `How many ${commas(small)}s make ${commas(big)}? Count by ${commas(small)}s, or divide.`,
    explain: `${times} × ${commas(small)} = ${commas(big)}, so it’s ${times} times as many.`,
  };
}

/* ---------- Food Prep: metric units (Lessons 7–10) ---------- */
/* metric unit pairs: {big and small units (one, many), how many small make 1 big, the most of the big unit that makes sense,
   is(amount): a sentence with the amount, used(amount, used): a story where some is used, and its question} */
const METRIC = [
  {
    big: ["kilometer", "kilometers"],
    small: ["meter", "meters"],
    per: 1000,
    most: 5,
    is: (amount) => `The zoo train track is ${amount} long.`,
    used: (amount, used) =>
      `The zoo train track is ${amount} long. The train has gone ${used}. How many meters are left to go?`,
  },
  {
    big: ["meter", "meters"],
    small: ["centimeter", "centimeters"],
    per: 100,
    most: 5,
    is: (amount) => `The giraffe is ${amount} tall.`,
    used: (amount, used) =>
      `A rope is ${amount} long. The zookeeper cuts off ${used}. How many centimeters of rope are left?`,
  },
  {
    big: ["kilogram", "kilograms"],
    small: ["gram", "grams"],
    per: 1000,
    most: 9,
    is: (amount) => `The bag of bird seed holds ${amount}.`,
    used: (amount, used) =>
      `A bag holds ${amount} of bird seed. The zookeeper feeds the birds ${used}. How many grams are left?`,
  },
  {
    big: ["liter", "liters"],
    small: ["milliliter", "milliliters"],
    per: 1000,
    most: 9,
    is: (amount) => `The water bucket holds ${amount}.`,
    used: (amount, used) =>
      `A bucket holds ${amount} of water. The zookeeper pours out ${used}. How many milliliters are left?`,
  },
];
function genMetric() {
  const variant = R(0, 3),
    { big, small, per, most, is, used: usedStory } = pick(METRIC),
    n = R(1, most),
    bigText = pl(n, ...big),
    /* the conversion table: 1 big unit, and n of them with ? until the hint */
    table = (show, extraRows = []) =>
      convTable([big[1], small[1]], [...(n > 1 ? [[1, per]] : []), [n, show ? n * per : "?"], ...extraRows], {
        hi: n > 1 ? 1 : 0,
      });
  if (variant === 0) {
    /* one amount in the smaller unit */
    const answer = n * per,
      other = per === 100 ? 1000 : 100;
    return {
      kind: "num",
      unit: small[1],
      answer,
      facts: { t: "convert", amounts: [[n, per]] },
      prompt: `${is(bigText)} How many ${small[1]} is that?`,
      fig: (show) => table(show),
      misc: miscOf(answer, [
        [n * other, `1 ${big[0]} is ${commas(per)} ${small[1]}, not ${commas(other)}.`],
        [n + per, `That adds. Each ${big[0]} is ${commas(per)} ${small[1]}: ${n} × ${commas(per)}.`],
      ]).filter(([wrong]) => wrong !== answer),
      hint: `1 ${big[0]} is ${commas(per)} ${small[1]}. Multiply by ${n}.`,
      explain: `${n} × ${commas(per)} = ${commas(answer)} ${small[1]}.`,
    };
  }
  if (variant === 1) {
    /* a mixed amount: 2 kilograms 350 grams in grams */
    const extra = per === 100 ? R(1, 99) : R(1, 9) * 100 + pick([0, 50]),
      answer = n * per + extra;
    return {
      kind: "num",
      unit: small[1],
      answer,
      facts: { t: "convert", amounts: [[n, per]], extra },
      prompt: `${is(`${bigText} ${pl(extra, ...small)}`)} How many ${small[1]} is that in all?`,
      fig: (show) => table(show),
      misc: miscOf(answer, [
        [n + extra, `That adds ${n} and ${extra}. Change the ${big[1]} to ${small[1]} first: ${n} × ${commas(per)}.`],
        [+`${n}${extra}`, `That writes ${n} and ${extra} side by side. ${bigText} is ${commas(n * per)} ${small[1]}.`],
      ]).filter(([wrong]) => wrong !== answer),
      hint: `Change the ${big[1]} to ${small[1]}, then add the ${commas(extra)}.`,
      explain: `${n} × ${commas(per)} = ${commas(n * per)}, and ${commas(n * per)} + ${commas(extra)} = ${commas(answer)} ${small[1]}.`,
    };
  }
  if (variant === 2) {
    /* two steps: some used, how much is left in the smaller unit */
    const used = per === 100 ? R(1, 9) * 10 : R(1, 9) * 100 + pick([0, 50]),
      start = n * per,
      left = start - used;
    return {
      kind: "num",
      unit: small[1],
      answer: left,
      facts: { t: "convert", amounts: [[n, per]], minus: used },
      prompt: usedStory(bigText, pl(used, ...small)),
      fig: (show) => table(show),
      misc: miscOf(left, [
        [
          Math.abs(used - n),
          `That takes ${n} and ${commas(used)} as the same unit. ${bigText} is ${commas(start)} ${small[1]}.`,
        ],
        [start + used, `That adds. Some was used, so subtract.`],
      ]).filter(([wrong]) => wrong !== left),
      hint: `Change ${bigText} to ${small[1]} first. Then subtract ${commas(used)}.`,
      explain: `${bigText} is ${commas(start)} ${small[1]}. ${commas(start)} − ${commas(used)} = ${commas(left)} ${small[1]}.`,
    };
  }
  /* which is more: n of the big unit, or an amount of the small unit near it */
  const smallAmount = n * per + pick([-1, 1]) * R(1, 4) * (per / 10),
    bigWins = n * per > smallAmount,
    smallText = pl(smallAmount, ...small);
  return {
    ...mcOf([
      [bigText, bigWins ? null : `${bigText} is ${commas(n * per)} ${small[1]}, less than ${smallText}.`],
      [smallText, bigWins ? `${bigText} is ${commas(n * per)} ${small[1]}, more than ${smallText}.` : null],
      ["They are the same", `${bigText} is ${commas(n * per)} ${small[1]}, not ${smallText}.`],
    ]),
    facts: { t: "compare", big: n * per, small: smallAmount },
    prompt: `Which is more: ${bigText} or ${smallText}?`,
    fig: (show) => table(show),
    hint: `Change ${bigText} to ${small[1]}. Then compare.`,
    explain: `${bigText} is ${n} × ${commas(per)} = ${commas(n * per)} ${small[1]}, which is ${bigWins ? "more" : "less"} than ${commas(smallAmount)}. ${bigWins ? bigText : smallText} is more.`,
  };
}

/* ---------- Clock & Scale: pounds, ounces, and time (Lessons 11–13) ---------- */
/* parts of a pound or an hour: [n, d], how many ounces of a pound, and how many minutes of an hour */
const PIECES = [
  [null, 0, 0],
  [[1, 4], 4, 15],
  [[1, 2], 8, 30],
  [[3, 4], 12, 45],
];
/* "3 1/2" (html), or just "3" */
const withPart = (whole, part) => (part ? `${whole ? whole + " " : ""}${fr(...part)}` : `${whole}`);
function genCustomary() {
  const variant = R(0, 3),
    name = pick(KIDS),
    [part, partOz, partMin] = pick(PIECES);
  if (variant === 0) {
    /* pounds (and part of a pound) to ounces */
    const pounds = R(part ? 1 : 2, 8),
      answer = 16 * pounds + partOz,
      animal = pick(["A baby otter", "A rabbit", "A puppy", "A sloth"]);
    return {
      kind: "num",
      unit: "ounces",
      answer,
      facts: { t: "convert", amounts: [[pounds, 16]], extra: partOz },
      prompt: `${animal} at the zoo weighs ${withPart(pounds, part)} pounds. How many ounces is that?`,
      fig: (show) =>
        convTable(
          ["pounds", "ounces"],
          [
            ...(pounds > 1 ? [[1, 16]] : []),
            [pounds, show ? 16 * pounds : "?"],
            ...(part ? [[fr(...part), show ? partOz : "?"]] : []),
          ],
        ),
      misc: miscOf(answer, [
        [10 * pounds + (part ? (10 * part[0]) / part[1] : 0), `A pound is 16 ounces, not 10.`],
        [pounds + 16, `That adds. Each pound is 16 ounces: ${pounds} × 16.`],
        ...(part
          ? [[16 * pounds, `Don’t forget the ${fr(...part)} pound: ${fr(...part)} of 16 ounces is ${partOz}.`]]
          : []),
      ]).filter(([wrong]) => wrong !== answer),
      hint: `1 pound is 16 ounces.${part ? ` ${fr(...part)} pound is ${fr(...part)} of 16 ounces.` : ""}`,
      explain: `${pounds} × 16 = ${16 * pounds}${part ? `, and ${fr(...part)} of 16 is ${partOz}: ${16 * pounds} + ${partOz} = ${answer}` : ""} ounces.`,
    };
  }
  if (variant === 1) {
    /* hours (and part of an hour) to minutes */
    const hours = R(part ? 0 : 2, 4),
      answer = 60 * hours + partMin,
      activity = pick(["The lions sleep for", "The zoo tour takes", "The sea lion show lasts", "The pandas nap for"]),
      /* the work: each piece in minutes, then their sum when there are two */
      pieces = [hours ? `${hours} × 60 = ${60 * hours}` : "", part ? `${fr(...part)} of 60 is ${partMin}` : ""].filter(
        Boolean,
      );
    return {
      kind: "num",
      unit: "minutes",
      answer,
      facts: { t: "convert", amounts: [[hours, 60]], extra: partMin },
      prompt: `${activity} ${withPart(hours, part)} hour${hours > 1 || (hours && part) ? "s" : ""}. How many minutes is that?`,
      fig: (show) =>
        clockFig(12, show ? partMin : 0, {
          r: 70,
          fives: true,
          shade: part && show ? [0, partMin] : null,
          label: part && show ? `A clock face with ${partMin} minutes shaded` : "A clock face",
        }),
      misc: miscOf(answer, [
        [100 * hours + partMin, `An hour is 60 minutes, not 100.`],
        ...(part
          ? [
              [
                60 * hours + (100 * part[0]) / part[1],
                `${fr(...part)} hour is ${fr(...part)} of 60 minutes, not of 100.`,
              ],
            ]
          : []),
        ...(hours && part ? [[60 * hours, `Don’t forget the ${fr(...part)} hour: ${partMin} more minutes.`]] : []),
      ]).filter(([wrong]) => wrong !== answer),
      hint: `1 hour is 60 minutes.${part ? ` ${fr(...part)} hour is ${fr(...part)} of 60.` : ""}`,
      explain: `${pieces.join(", and ")}${pieces.length > 1 ? `: ${60 * hours} + ${partMin} = ${answer}` : ""} minutes.`,
    };
  }
  if (variant === 2) {
    /* minutes to seconds */
    const minutes = R(2, 9),
      answer = 60 * minutes;
    return {
      kind: "num",
      unit: "seconds",
      answer,
      facts: { t: "convert", amounts: [[minutes, 60]] },
      prompt: `${name} watches the penguins dive for ${minutes} minutes. How many seconds is that?`,
      fig: (show) =>
        convTable(
          ["minutes", "seconds"],
          [
            [1, 60],
            [minutes, show ? answer : "?"],
          ],
          { ask: show ? -1 : 1 },
        ),
      misc: miscOf(answer, [
        [100 * minutes, `A minute is 60 seconds, not 100.`],
        [minutes + 60, `That adds. Each minute is 60 seconds: ${minutes} × 60.`],
      ]),
      hint: `1 minute is 60 seconds. Multiply by ${minutes}.`,
      explain: `${minutes} × 60 = ${answer} seconds.`,
    };
  }
  /* two steps: an hour-and-a-part job and some minutes more */
  const hours = R(1, 2),
    more = R(1, 5) * 10,
    jobPart = part || [1, 4],
    jobMin = (60 * jobPart[0]) / jobPart[1],
    answer = 60 * hours + jobMin + more;
  return {
    kind: "num",
    unit: "minutes",
    answer,
    facts: { t: "convert", amounts: [[hours, 60]], extra: jobMin + more },
    prompt: `${name} cleans the hippo pool for ${withPart(hours, jobPart)} hours, then feeds the hippos for ${more} minutes. How many minutes is that in all?`,
    fig: (show) =>
      clockFig(12, show ? jobMin : 0, { r: 70, fives: true, shade: show ? [0, jobMin] : null, label: `A clock face` }),
    misc: miscOf(answer, [
      [hours * 60 + more, `Don’t forget the ${fr(...jobPart)} hour: ${jobMin} minutes.`],
      [100 * hours + jobMin + more, `An hour is 60 minutes, not 100.`],
    ]).filter(([wrong]) => wrong !== answer),
    hint: `Change ${withPart(hours, jobPart)} hours to minutes first. ${fr(...jobPart)} hour is ${fr(...jobPart)} of 60.`,
    explain: `${hours} × 60 + ${jobMin} = ${60 * hours + jobMin} minutes, and ${60 * hours + jobMin} + ${more} = ${answer} minutes.`,
  };
}

/* ---------- Fence Builder: perimeter (Lessons 14–17) ---------- */
const PENS = ["goat pen", "rabbit yard", "flamingo pond", "tortoise yard", "duck pen"];
function genPerimeter() {
  const variant = R(0, 3),
    pen = pick(PENS);
  if (variant === 0) {
    /* the perimeter of a rectangle */
    let len, wid;
    do {
      len = R(3, 15);
      wid = R(2, 10);
    } while (wid >= len || len * wid === 2 * (len + wid));
    const perimeter = 2 * (len + wid);
    return {
      kind: "num",
      unit: "meters",
      answer: perimeter,
      facts: { t: "perimeter", len, wid },
      prompt: `The ${pen} is a rectangle ${len} meters long and ${wid} meters wide. How many meters of fence go all the way around it?`,
      fig: () => rectFig(len, wid, { unit: "m" }),
      misc: miscOf(perimeter, [
        [len * wid, `That’s ${len} × ${wid}, the area. The fence goes around the outside.`],
        [len + wid, `That’s one length and one width. The fence goes around all 4 sides.`],
      ]),
      hint: `Add all 4 sides: ${len} + ${wid} + ${len} + ${wid}.`,
      explain: `${len} + ${wid} + ${len} + ${wid} = ${perimeter} meters, or 2 × ${len} + 2 × ${wid} = ${perimeter}.`,
    };
  }
  if (variant === 1) {
    /* a missing side from the perimeter */
    let len, wid;
    do {
      len = R(4, 15);
      wid = R(2, 12);
    } while (wid >= len);
    const perimeter = 2 * (len + wid);
    return {
      kind: "num",
      unit: "meters",
      answer: wid,
      facts: { t: "missing", perimeter, len },
      prompt: `The ${pen} is a rectangle with ${perimeter} meters of fence around it. It is ${len} meters long. How wide is it?`,
      fig: (show) => rectFig(len, wid, { unit: "m", ask: show ? null : "width" }),
      misc: miscOf(wid, [
        [perimeter - len, `That takes ${len} from all ${perimeter}. The fence has two lengths and two widths.`],
        [perimeter - 2 * len, `That’s both widths together. Each width is half of ${perimeter - 2 * len}.`],
      ]).filter(([wrong]) => wrong !== wid),
      hint: `Half the fence is one length and one width: ${perimeter} ÷ 2 = ${perimeter / 2}.`,
      explain: `${perimeter} ÷ 2 = ${perimeter / 2}, and ${perimeter / 2} − ${len} = ${wid} meters wide.`,
    };
  }
  if (variant === 2) {
    /* a square: its perimeter, or its side from the perimeter; never 4 by 4, where the area is the same number */
    const side = pick(
        range(13)
          .map((i) => i + 3)
          .filter((v) => v !== 4),
      ),
      fromSide = Math.random() < 0.5;
    return fromSide
      ? {
          kind: "num",
          unit: "meters",
          answer: 4 * side,
          facts: { t: "square", side },
          prompt: `The ${pen} is a square with sides ${side} meters long. How many meters of fence go around it?`,
          fig: () => rectFig(side, side, { unit: "m" }),
          misc: miscOf(4 * side, [
            [side * side, `That’s ${side} × ${side}, the area. The fence goes around the 4 sides.`],
            [2 * side, `That’s only 2 sides. A square has 4.`],
          ]),
          hint: `A square has 4 sides, all the same length.`,
          explain: `4 × ${side} = ${4 * side} meters.`,
        }
      : {
          kind: "num",
          unit: "meters",
          answer: side,
          facts: { t: "squareSide", perimeter: 4 * side },
          prompt: `The ${pen} is a square with ${4 * side} meters of fence around it. How long is each side?`,
          fig: (show) => rectFig(side, side, { unit: "m", ask: show ? null : "length" }),
          misc: miscOf(side, [[2 * side, `That splits the fence into 2 sides. A square has 4 equal sides.`]]),
          hint: `A square has 4 equal sides. ${4 * side} ÷ 4 = ?`,
          explain: `${4 * side} ÷ 4 = ${side} meters.`,
        };
  }
  /* which pen needs the most fence; the one with the most area is a different pen when it can be */
  let pens;
  do pens = range(3).map(() => [R(2, 12), R(2, 9)]);
  while (new Set(pens.map(([l, w]) => 2 * (l + w))).size < 3 || new Set(pens.map(([l, w]) => `${l}×${w}`)).size < 3);
  const perimeters = pens.map(([l, w]) => 2 * (l + w)),
    best = perimeters.indexOf(Math.max(...perimeters)),
    label = ([l, w]) => `${l} m by ${w} m`;
  return {
    ...mcOf(
      pens.map((p, i) => [
        label(p),
        i === best
          ? null
          : `${label(p)} needs ${p[0]} + ${p[1]} + ${p[0]} + ${p[1]} = ${perimeters[i]} meters of fence.`,
      ]),
    ),
    facts: { t: "most", pens },
    prompt: `Three rectangle pens are ${pens.map(label).join(", ")}. Which one needs the most fence?`,
    fig: () => pens.map(([l, w]) => rectFig(l, w, { unit: "m", grid: false })).join(""),
    hint: `Find the perimeter of each: add its 4 sides.`,
    explain: `${pens.map((p, i) => `${label(p)}: ${perimeters[i]} m`).join(". ")}. ${label(pens[best])} needs the most fence.`,
  };
}

/* ---------- Feeding Time: the final round ---------- */
const genBoss = () => pick([genTimes, genBigger, genMetric, genCustomary, genPerimeter])();

const ZONES = [
  {
    id: "times",
    name: "Feeding Line",
    lessons: "Lessons 1–3",
    blurb: "Find how many times as many, and the bigger or smaller amount, with tape diagrams.",
    gen: genTimes,
  },
  {
    id: "bigger",
    name: "Big Animals",
    lessons: "Lessons 4–6",
    blurb: "Compare big amounts, ten times as many, and how many more.",
    gen: genBigger,
  },
  {
    id: "metric",
    name: "Food Prep",
    lessons: "Lessons 7–10",
    blurb: "Change kilometers, meters, kilograms, and liters into smaller units, then add or subtract.",
    gen: genMetric,
  },
  {
    id: "customary",
    name: "Clock & Scale",
    lessons: "Lessons 11–13",
    blurb: "Change pounds to ounces, and hours and minutes into smaller units, with halves and fourths.",
    gen: genCustomary,
  },
  {
    id: "perimeter",
    name: "Fence Builder",
    lessons: "Lessons 14–17",
    blurb: "Find the fence around a pen, and a missing side from the perimeter.",
    gen: genPerimeter,
  },
  {
    id: "boss",
    name: "Feeding Time",
    lessons: "All lessons",
    blurb: "Feed the whole zoo! Every right answer fills one of 10 food bowls.",
    gen: genBoss,
  },
];

/* the food bowls: 10 bowls in two rows, `lit` of them full (the boss icon fills all of them) */
const bowls = (lit) =>
  range(10)
    .map((i) => {
      const x = 4 + (i % 5) * 12,
        y = i < 5 ? 24 : 46;
      return (
        (i < lit ? `<ellipse cx="${x + 5}" cy="${y - 1}" rx="4.5" ry="3" fill="#ffc93c"/>` : "") +
        `<path d="M${x},${y}h10l-2,7h-6Z" fill="#7fe3ff" stroke="#0a2340" stroke-width="1"/>`
      );
    })
    .join("") + '<path d="M2,10Q32,-2 62,10" fill="none" stroke="#5fe0a8" stroke-width="2.5"/>';
const ICON = {
  times:
    '<g stroke-width="1.5"><rect x="6" y="14" width="13" height="14" fill="rgba(255,201,60,.55)" stroke="#ffc93c"/><rect x="6" y="36" width="13" height="14" fill="rgba(127,227,255,.45)" stroke="#7fe3ff"/><rect x="19" y="36" width="13" height="14" fill="rgba(127,227,255,.45)" stroke="#7fe3ff"/><rect x="32" y="36" width="13" height="14" fill="rgba(127,227,255,.45)" stroke="#7fe3ff"/></g><text x="54" y="47" fill="#f3f6fb" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">×3</text>',
  bigger:
    '<ellipse cx="34" cy="36" rx="20" ry="14" fill="#a9b4c6" stroke="#0a2340" stroke-width="1.5"/><circle cx="14" cy="30" r="9" fill="#a9b4c6" stroke="#0a2340" stroke-width="1.5"/><path d="M8,34Q4,46 10,52" fill="none" stroke="#a9b4c6" stroke-width="4"/><path d="M22,48V58M44,48V58" stroke="#a9b4c6" stroke-width="6"/><circle cx="12" cy="28" r="1.5" fill="#0a2340"/>',
  metric:
    '<path d="M12,26H52L48,56H16Z" fill="rgba(127,227,255,.35)" stroke="#7fe3ff" stroke-width="2"/><path d="M14,36H50" stroke="#7fe3ff" stroke-width="1.5"/><text x="32" y="20" fill="#ffc93c" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">1 L</text><text x="32" y="50" fill="#f3f6fb" font-size="9" font-weight="700" text-anchor="middle" font-family="monospace">1,000 mL</text>',
  customary:
    '<circle cx="32" cy="32" r="24" fill="rgba(243,246,251,.12)" stroke="#f3f6fb" stroke-width="2.5"/><path d="M32,32V14M32,32L44,38" stroke="#ffc93c" stroke-width="3" stroke-linecap="round"/><path d="M32,8A24,24 0 0,1 56,32L32,32Z" fill="rgba(127,227,255,.35)"/>',
  perimeter:
    '<rect x="10" y="16" width="44" height="32" fill="rgba(95,224,168,.2)" stroke="#5fe0a8" stroke-width="3"/><path d="M10,16V8M24,16V8M38,16V8M54,16V8M10,10H54" stroke="#c98a4b" stroke-width="2"/><text x="32" y="38" fill="#f3f6fb" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">P = ?</text>',
  boss: bowls(10),
};
