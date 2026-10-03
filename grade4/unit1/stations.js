/* Factor Factory (Grade 4 Unit 1): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Factors, number lines with hops, tiles, and number charts come from shared/multiply.js; lockers from figs.js; mcOf and
   miscOf from shared/util.js. Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* the text with its first letter capitalized */
const cap = (text) => text[0].toUpperCase() + text.slice(1);
/* items joined with commas: "2, 4, 6" */
const list = (items) => items.join(", ");
/* 1st, 2nd, 3rd, 4th, … */
const nth = (k) => k + (k === 1 ? "st" : k === 2 ? "nd" : k === 3 ? "rd" : "th");
/* 1 to n */
const upTo = (n) => range(n).map((i) => i + 1);
const PRIMES = upTo(100).filter(isPrime);
/* n as its smallest factor pair other than 1 × n: split(21) is "3 × 7" */
const split = (n) => {
  const a = factors(n)[1];
  return `${a} × ${n / a}`;
};
/* "7 packs is 56 and 8 packs are 64. 60 is in between." for a number between two multiples of n; one and many name a group of n */
const between = (number, n, one, many) => {
  const k = Math.floor(number / n);
  return `${k} ${k === 1 ? one : many} ${k === 1 ? "is" : "are"} ${k * n} and ${k + 1} ${many} are ${(k + 1) * n}. ${number} is in between.`;
};
/* the plural of a container word: boxes, packs */
const plural = (word) => (word === "box" ? "boxes" : word + "s");

/* ---------- Hop Belt: multiples (Lesson 1) ---------- */
/* things sold in packs, for "which number can you buy with whole packs?": [things, container, how many in one] */
const PACKS = [
  ["tennis balls", "can", 3],
  ["batteries", "pack", 4],
  ["cupcakes", "box", 4],
  ["granola bars", "box", 5],
  ["juice boxes", "pack", 6],
  ["eggs", "carton", 6],
  ["yogurt cups", "pack", 6],
  ["crayons", "box", 8],
  ["hot dogs", "pack", 8],
  ["stickers", "sheet", 9],
];
function genHops() {
  const variant = R(0, 3),
    name = pick(KIDS);
  if (variant === 0) {
    /* where the hops land: a hop-bot, or counting by n */
    const n = R(2, 9),
      hops = R(4, Math.min(10, Math.floor(90 / n))),
      multiple = n * hops,
      counting = Math.random() < 0.5;
    return {
      kind: "num",
      unit: "",
      answer: multiple,
      prompt: counting
        ? `${name} counts by ${n}s: ${n}, ${2 * n}, ${3 * n}, … What is the ${nth(hops)} number ${name} says?`
        : `The hop-bot starts at 0 and hops by ${n}s. Where does it land after ${hops} hops?`,
      fig: (show) =>
        hopLine(n, n * (hops + 2), hops, {
          nums: show ? Infinity : counting ? 3 : 1,
          label: `Number line with ${hops} hops of ${n} from 0`,
        }),
      misc: miscOf(multiple, [
        [multiple + n, `That’s ${hops + 1} hops. Count the hops again.`],
        [multiple - n, `That’s only ${hops - 1} hops. Count them again.`],
        [n + hops, `You added ${n} + ${hops}. ${hops} hops of ${n} is ${hops} × ${n}.`],
      ]),
      hint: `Each hop is ${n}. Keep counting by ${n}s until you have ${hops} numbers, or multiply ${hops} × ${n}.`,
      explain: `${upTo(hops)
        .map((i) => i * n)
        .join(", ")}. The ${nth(hops)} multiple of ${n} is ${hops} × ${n} = ${multiple}.`,
    };
  }
  if (variant === 1) {
    /* which amount is a whole number of packs, up to 10 packs? One wrong choice ends in the pack size's digit, like 16 for packs of 6. */
    const [things, unit, n] = pick(PACKS),
      top = 10 * n,
      packs = R(3, 10),
      multiple = n * packs,
      notWhole = (v) => v > n && v < top && v % n !== 0;
    /* lookAlike: a wrong amount ending in n's digit, when there is one */
    const endsLikeN = range(9)
        .map((tens) => 10 * tens + n)
        .filter((v) => notWhole(v) && v !== multiple),
      lookAlike = endsLikeN.length ? pick(endsLikeN) : 0;
    /* another amount that isn't whole packs, and isn't any of `taken` */
    const other = (...taken) => {
        let v;
        do {
          v = n * R(2, 9) + R(1, n - 1);
        } while (!notWhole(v) || taken.includes(v));
        return v;
      },
      secondWrong = other(lookAlike, multiple);
    const wrongs = lookAlike ? [lookAlike, secondWrong] : [secondWrong, other(secondWrong, multiple)];
    return {
      ...mcOf([
        [String(multiple), null],
        ...wrongs.map((v) => [
          String(v),
          (v === lookAlike ? `It ends in ${n}, but that doesn’t matter. ` : "") + between(v, n, unit, plural(unit)),
        ]),
      ]),
      prompt: `${cap(things)} come in ${plural(unit)} of ${n}. Which number of ${things} can ${name} buy with whole ${plural(unit)}?`,
      hint: `Count by ${n}s: ${n}, ${2 * n}, ${3 * n}, … Which number do you land on?`,
      explain: `${packs} × ${n} = ${multiple}, so ${packs} ${plural(unit)} is ${multiple} ${things}. ${multiple} is a multiple of ${n}.`,
    };
  }
  if (variant === 2) {
    /* only multiples of n: one list has a number that is off by a little, one is multiples of a nearby number */
    const n = R(3, 9),
      start = R(1, Math.floor(90 / n) - 4),
      right = range(4).map((i) => (start + i) * n);
    const offList = right.slice();
    let at = R(1, 3);
    offList[at] += pick([-2, -1, 1, 2]);
    if (offList[at] % n === 0) offList[at] += 1;
    /* nearby: n − 1 or n + 1, its multiples starting near the right list's */
    const nearby = pick([n - 1, n + 1].filter((v) => v >= 2)),
      nearbyStart = Math.max(1, Math.round(right[0] / nearby)),
      nearbyList = range(4).map((i) => (nearbyStart + i) * nearby);
    const stray = nearbyList.filter((v) => v % n);
    return {
      ...mcOf(
        [
          [list(right), null],
          [
            list(offList),
            `${offList[at]} is not a multiple of ${n}. ` + between(offList[at], n, `hop of ${n}`, `hops of ${n}`),
          ],
          [
            list(nearbyList),
            `${list(stray)} ${stray.length > 1 ? "aren’t multiples" : "isn’t a multiple"} of ${n}. Those are multiples of ${nearby}.`,
          ],
        ],
        { stack: true },
      ),
      prompt: `Which list has only multiples of ${n}?`,
      hint: `A multiple of ${n} is ${n} times a whole number. Check each number: does counting by ${n}s land on it?`,
      explain: right.map((v) => `${v / n} × ${n} = ${v}`).join(", ") + ".",
    };
  }
  /* how many hops to land on a multiple of n */
  const n = R(3, 9),
    hops = R(4, Math.min(10, Math.floor(90 / n))),
    multiple = n * hops;
  return {
    kind: "num",
    unit: "hops",
    answer: hops,
    prompt: `The hop-bot starts at 0 and hops by ${n}s. How many hops does it take to land on ${multiple}?`,
    fig: (show) =>
      hopLine(n, n * (hops + 1), show ? hops : 1, {
        mark: multiple,
        nums: show ? Infinity : 1,
        label: `Number line counting by ${n}s, pointing at ${multiple}`,
      }),
    misc: miscOf(hops, [
      [hops + 1, `${hops + 1} hops of ${n} is ${(hops + 1) * n}. That goes past ${multiple}.`],
      [hops - 1, `${hops - 1} hops of ${n} is only ${(hops - 1) * n}.`],
      [multiple - n, `That’s where the hop before ${multiple} lands. How many hops is it?`],
    ]),
    hint: `Count by ${n}s to ${multiple} and count the hops. Or think: what times ${n} is ${multiple}?`,
    explain: `${hops} × ${n} = ${multiple}, so it takes ${hops} hops. ${multiple} is a multiple of ${n}.`,
  };
}

/* ---------- Tile Press: factor pairs (Lesson 2) ---------- */
/* rows of cols tiles. Before the hint (show false): one column and a box for the rest of each row. */
function pressFig(rows, cols, show, label) {
  if (show) return tiles(rows, rows * cols, label);
  /* tiles are tileSize square, shrinking to fit 280 pixels; the box is 5 tiles wide */
  const tileSize = Math.min(28, 280 / rows),
    boxW = 5 * tileSize;
  const markup =
    range(rows)
      .map((i) => `<rect class="ftile" x="4" y="${4 + i * tileSize}" width="${tileSize}" height="${tileSize}"/>`)
      .join("") +
    `<rect class="guide" x="${4 + tileSize + 4}" y="4" width="${boxW}" height="${rows * tileSize}" rx="4"/><text class="lbl big gd" x="${8 + tileSize + boxW / 2}" y="${4 + (rows * tileSize) / 2}">?</text>`;
  return svgWrap(12 + tileSize + boxW, 8 + rows * tileSize, markup, label);
}
/* things set out in equal rows: [the story (n things, rows, who), the unit, the most there would be] */
const ROWS = [
  [
    (n, rows, who) => `${who} sets up ${n} chairs in ${rows} equal rows for a show. How many chairs are in each row?`,
    "chairs",
    60,
  ],
  [
    (n, rows) => `A gardener plants ${n} tomato plants in ${rows} equal rows. How many plants are in each row?`,
    "plants",
    48,
  ],
  [
    (n, rows, who) => `${who} hangs ${n} photos on a wall in ${rows} equal rows. How many photos are in each row?`,
    "photos",
    40,
  ],
  [
    (n, rows) => `The Tile Press makes a rectangle from ${n} tiles in ${rows} rows. How many tiles are in each row?`,
    "tiles",
    100,
  ],
];
/* composite numbers with at least two factor pairs besides 1 × n */
const RICH = upTo(100).filter((n) => n >= 12 && pairsOf(n).length >= 3);
function genTiles() {
  const variant = R(0, 4),
    name = pick(KIDS);
  if (variant === 0) {
    /* how many in each of the equal rows */
    const [say, unit, most] = pick(ROWS);
    let rows, perRow;
    do {
      rows = R(2, 9);
      perRow = R(2, 10);
    } while (rows * perRow > most || rows * perRow < 12);
    const n = rows * perRow;
    return {
      kind: "num",
      unit,
      answer: perRow,
      prompt: say(n, rows, name),
      fig: (show) => pressFig(rows, perRow, show, `${n} ${unit} in ${rows} equal rows`),
      misc: miscOf(perRow, [
        [n - rows, `You subtracted. Equal rows means ${rows} × ? = ${n}.`],
        [n + rows, `You added. Equal rows means ${rows} × ? = ${n}.`],
        [n * rows, `That’s ${n} × ${rows}. Find the number that goes with ${rows} to make ${n}.`],
      ]),
      hint: `Think: ${rows} × ? = ${n}.`,
      explain: `${rows} × ${perRow} = ${n}, so there are ${perRow} in each row. ${rows} and ${perRow} are a factor pair of ${n}.`,
    };
  }
  if (variant === 1) {
    /* a factor pair of n; the wrong pairs multiply to a number close to n (and to different numbers) */
    const n = pick(RICH),
      pairs = pairsOf(n).filter(([a]) => a > 1),
      [a, b] = pick(pairs);
    const close = shuffle(range(11).flatMap((i) => range(11).map((j) => [i + 2, j + 2]))).filter(
      ([x, y]) => x <= y && x * y !== n && Math.abs(x * y - n) <= Math.max(4, n / 8),
    );
    const wrong = [];
    close.forEach((pair) => {
      if (wrong.length < 2 && !wrong.some((w) => w[0] * w[1] === pair[0] * pair[1])) wrong.push(pair);
    });
    return {
      ...mcOf([[`${a} × ${b}`, null], ...wrong.map(([x, y]) => [`${x} × ${y}`, `${x} × ${y} = ${x * y}, not ${n}.`])]),
      prompt: `Which is a factor pair of ${n}?`,
      hint: "Multiply each pair. Which one makes " + n + "?",
      explain: `${a} × ${b} = ${n}, so ${a} and ${b} are a factor pair of ${n}.`,
    };
  }
  if (variant === 2) {
    /* all the factor pairs: one list misses a pair (the last), one has a pair that doesn't work */
    const n = pick(RICH.filter((v) => v <= 48)),
      pairs = pairsOf(n),
      written = pairs.map(([a, b]) => `${a} × ${b}`);
    const missing = pairs.length - 1,
      short = written.filter((pair, i) => i !== missing),
      [missA, missB] = pairs[missing];
    /* a pair that multiplies to a number close to n, put in order among the others */
    const [x, y] = pick(
        upTo(missA + 1)
          .filter((v) => v > 1)
          .flatMap((v) =>
            upTo(12)
              .filter((w) => w >= v && w * v !== n && Math.abs(w * v - n) <= 3)
              .map((w) => [v, w]),
          ),
      ),
      at = pairs.findIndex(([a]) => a > x),
      extra = written.slice();
    extra.splice(at < 0 ? extra.length : at, 0, `${x} × ${y}`);
    return {
      ...mcOf(
        [
          [list(written), null],
          [
            list(short),
            `${missA} × ${missB} = ${n} too.` + (missA === missB ? " A square is a rectangle, so it counts." : ""),
          ],
          [list(extra), `${x} × ${y} = ${x * y}, not ${n}.`],
        ],
        { stack: true },
      ),
      prompt: `Which list shows all the factor pairs of ${n}?`,
      fig: (show) => (show ? allRects(n) : tiles(1, n, `${n} tiles in 1 row`)),
      hint: `Try 1 row, 2 rows, 3 rows, … of ${n} tiles. Stop when the pairs start to turn around.`,
      explain: `Try 1, 2, 3, … rows: ${list(written)} work. After ${pairs[missing][0]}, the pairs turn around.`,
    };
  }
  if (variant === 3) {
    /* how many rectangles: turnarounds count once */
    const n = pick(upTo(60).filter((v) => v >= 6 && pairsOf(v).length >= 2)),
      pairs = pairsOf(n),
      factorCount = factors(n).length;
    return {
      kind: "num",
      unit: "rectangles",
      answer: pairs.length,
      prompt: `How many different rectangles can the Tile Press make with ${n} tiles? (A 2 × 3 and a 3 × 2 rectangle count as the same.)`,
      fig: (show) => (show ? allRects(n) : tiles(1, n, `${n} tiles in 1 row`)),
      misc: miscOf(pairs.length, [
        [factorCount, "That’s the number of factors. Each rectangle uses a factor pair, and turnarounds count once."],
        [pairs.length - 1, `Don’t forget 1 row of ${n}. That’s a rectangle too.`],
        [pairs.length + 1, "Check each pair. Did you count a turnaround twice?"],
      ]),
      hint: "Each factor pair makes one rectangle. Try 1 row, 2 rows, 3 rows, … and stop when the pairs turn around.",
      explain: `The factor pairs of ${n} are ${list(pairs.map(([a, b]) => `${a} × ${b}`))}. That’s ${pairs.length} rectangles.`,
    };
  }
  /* the other factor in a pair: up to 10 rows of up to 12 */
  const [a, b] = pick(
      RICH.flatMap((n) =>
        pairsOf(n)
          .filter(([a]) => a > 1)
          .flatMap(([a, b]) =>
            a === b
              ? [[a, b]]
              : [
                  [a, b],
                  [b, a],
                ],
          ),
      ).filter(([a, b]) => a <= 10 && b <= 12),
    ),
    n = a * b;
  return {
    kind: "num",
    unit: "",
    answer: b,
    prompt: `${a} and what number make a factor pair of ${n}?`,
    fig: (show) => pressFig(a, b, show, `${n} tiles in ${a} rows`),
    misc: miscOf(b, [
      [n - a, `You subtracted. A factor pair multiplies: ${a} × ? = ${n}.`],
      [n + a, `You added. A factor pair multiplies: ${a} × ? = ${n}.`],
      [n * a, `That’s ${n} × ${a}. Find ${a} × ? = ${n}.`],
    ]),
    hint: `Put ${n} tiles in ${a} equal rows. How many are in each row? ${a} × ? = ${n}`,
    explain: `${a} × ${b} = ${n}, so ${a} and ${b} are a factor pair of ${n}.`,
  };
}

/* ---------- Prime Sorter: prime and composite (Lesson 3) ---------- */
/* composite numbers that look prime: odd, and not multiples of 5 */
const TRICKY = upTo(99).filter((n) => n > 8 && n % 2 && n % 5 && !isPrime(n));
function genPrime() {
  const variant = R(0, 4),
    name = pick(KIDS);
  if (variant === 0) {
    /* which number is prime: the others are tricky composites near it */
    const prime = pick(PRIMES.filter((v) => v > 10)),
      composites = shuffle(TRICKY.filter((v) => Math.abs(v - prime) <= 24)).slice(0, 2);
    return {
      ...mcOf([
        [String(prime), null],
        ...composites.map((c) => [
          String(c),
          `${split(c)} = ${c}, so ${c} has more than one factor pair. It’s composite.`,
        ]),
      ]),
      prompt: "Which number is prime?",
      hint: "Try to split each number into a factor pair besides 1 × itself. Does 3 go into it? 7?",
      explain:
        `${prime}’s only factor pair is 1 × ${prime}, so ${prime} is prime.` +
        (composites.length ? ` ${composites.map((c) => `${c} = ${split(c)}`).join(" and ")}.` : ""),
    };
  }
  if (variant === 1) {
    /* which number is composite (most often an odd one): the others are primes near it */
    const composite = Math.random() < 0.7 ? pick(TRICKY) : pick(upTo(98).filter((v) => v > 10 && v % 2 === 0)),
      primes = shuffle(PRIMES.filter((v) => v > 2 && Math.abs(v - composite) <= 20)).slice(0, 2);
    return {
      ...mcOf([
        [String(composite), null],
        ...primes.map((prime) => [String(prime), `${prime}’s only factor pair is 1 × ${prime}. It’s prime.`]),
      ]),
      prompt: "Which number is composite?",
      hint: "A composite number has a factor pair besides 1 × itself. Try 2, 3, 5, and 7.",
      explain: `${split(composite)} = ${composite}, so ${composite} has more than one factor pair. It’s composite.`,
    };
  }
  if (variant === 2) {
    /* prime ('p'), composite ('c'), or neither ('n', the number 1) */
    const n = Math.random() < 0.1 ? 1 : Math.random() < 0.1 ? 2 : R(3, 40),
      pairs = pairsOf(n),
      answer = n === 1 ? "n" : pairs.length === 1 ? "p" : "c";
    /* why each choice is wrong, when it is */
    const whyNot = {
      p:
        n === 1
          ? "A prime number has exactly two factors: 1 and itself. 1 has only one factor."
          : `${split(n)} = ${n} too, so ${n} has more than one factor pair.`,
      c:
        n === 1
          ? "1 has only one factor, 1. A composite number has more than two."
          : `The only factor pair of ${n} is 1 × ${n}. There is no other, so it’s not composite.`,
      n: `Only the number 1 is neither. ${n} is bigger than 1, so it’s prime or composite.`,
    };
    return {
      kind: "mc",
      choices: [
        { id: "p", label: "Prime" },
        { id: "c", label: "Composite" },
        { id: "n", label: "Neither" },
      ],
      answer,
      why: Object.fromEntries(["p", "c", "n"].filter((id) => id !== answer).map((id) => [id, whyNot[id]])),
      prompt: `Is ${n} prime, composite, or neither?`,
      fig: (show) => (show ? allRects(n) : tiles(1, n, `${n} tile${n > 1 ? "s" : ""} in 1 row`)),
      hint:
        n === 1
          ? "How many factors does 1 have?"
          : `${n} tiles make a rectangle 1 row long. Can they make any other rectangle?`,
      explain:
        n === 1
          ? "1’s only factor is 1, so it is neither prime nor composite."
          : answer === "p"
            ? `${n}’s only factor pair is 1 × ${n}, so ${n} is prime.` + (n === 2 ? " 2 is the only even prime." : "")
            : `${n} has the factor pairs ${list(pairs.map(([a, b]) => `${a} × ${b}`))}. More than one pair means ${n} is composite.`,
    };
  }
  if (variant === 3) {
    /* how many primes in a row of ten; oddComposite is one to show that odd isn't enough */
    const lo = 10 * R(0, 9) + 1,
      hi = lo + 9,
      row = range(10).map((i) => lo + i),
      primes = row.filter(isPrime),
      count = primes.length,
      oddComposite = row.find((v) => v > 1 && v % 2 && !isPrime(v));
    return {
      kind: "num",
      unit: "primes",
      answer: count,
      prompt: `How many prime numbers are there from ${lo} to ${hi}?`,
      fig: (show) =>
        chart(hi, (v) => (show && isPrime(v) ? "a" : ""), {
          lo,
          label: `Numbers ${lo} to ${hi}` + (show ? `. Prime: ${list(primes)}` : ""),
        }),
      misc: miscOf(count, [
        [5, `There are 5 odd numbers, but not all odd numbers are prime: ${oddComposite} = ${split(oddComposite)}.`],
        ...(lo === 1
          ? [
              [count + 1, "1 is not prime. Its only factor is 1."],
              [count - 1, "2 is prime too. It’s the only even prime."],
            ]
          : []),
      ]),
      hint:
        lo === 1
          ? "1 is not prime, and 2 is the only even prime. Check the odd numbers."
          : "Even numbers here are composite: 2 is a factor. Check each odd number for a factor pair.",
      explain: `The primes from ${lo} to ${hi} are ${list(primes)}. That’s ${count}.`,
    };
  }
  /* "it's odd, so it's prime" */
  const composite = pick(TRICKY),
    smallest = factors(composite)[1];
  return {
    ...mcOf(
      [
        [`No. ${split(composite)} = ${composite}, so ${composite} is composite.`, null],
        [
          "Yes. Odd numbers are always prime.",
          `9 is odd, and 3 × 3 = 9. Odd numbers can be composite. Try ${smallest} for ${composite}.`,
        ],
        [
          `No. ${composite} is odd, so it’s neither prime nor composite.`,
          "Only the number 1 is neither. Every other whole number is prime or composite.",
        ],
      ],
      { stack: true },
    ),
    prompt: `${name} says ${composite} is prime because it is odd. Is ${name} right?`,
    fig: (show) => (show ? allRects(composite) : tiles(1, composite, `${composite} tiles in 1 row`)),
    hint: `Try to split ${composite} into a factor pair besides 1 × ${composite}. Does ${smallest} go into it?`,
    explain: `${split(composite)} = ${composite}. ${composite} has more than one factor pair, so it is composite, even though it is odd.`,
  };
}

/* ---------- Locker Room: common multiples and the Locker Problem (Lessons 5–6) ---------- */
/* when two things happen every a and every b: the story, its unit, the times allowed (t), and the largest answer
   (box: counted in boxes; hot: fixed pairs of pack sizes instead of t) */
const TOGETHER = [
  {
    say: (a, b) =>
      `The red bus leaves every ${a} minutes. The blue bus leaves every ${b} minutes. Both buses leave at 8:00. In how many minutes do they leave together again?`,
    unit: "minutes",
    t: [4, 5, 6, 8, 10, 12, 15, 20],
    max: 60,
  },
  {
    say: (a, b) =>
      `A green light on the factory wall blinks every ${a} seconds. A red light blinks every ${b} seconds. They just blinked together. In how many seconds do they blink together again?`,
    unit: "seconds",
    t: [2, 3, 4, 5, 6, 8, 9, 10, 12],
    max: 60,
  },
  {
    say: (a, b) =>
      `On the belt, one robot stamps every ${a}th box. Another paints every ${b}th box. Which box is the first to be stamped and painted?`,
    unit: "",
    t: [4, 5, 6, 7, 8, 9, 10, 12],
    max: 60,
    box: true,
  },
  {
    say: (a, b, who) =>
      `Hot dogs come in packs of ${a}. Buns come in packs of ${b}. ${who} wants the same number of hot dogs and buns. What is the smallest number of each ${who} can buy?`,
    unit: "of each",
    t: [],
    hot: [
      [8, 6],
      [8, 12],
      [10, 6],
      [10, 8],
      [10, 12],
    ],
    max: 60,
  },
];
/* two numbers from `choices` with a first common multiple that isn't just the bigger one, up to max */
function twoOf(choices, max) {
  let a, b;
  do {
    [a, b] = shuffle(choices).slice(0, 2);
  } while (b % a === 0 || a % b === 0 || lcm(a, b) > max);
  return [a, b];
}
/* hops of a and hops of b on two number lines to one hop past their first common multiple (all the hops when show, two each before) */
const bothLines = (a, b, show) => {
  const first = lcm(a, b),
    lineEnd = first + Math.max(a, b);
  return (
    hopLine(a, lineEnd, show ? (lineEnd / a) | 0 : 2, { cls: "r", nums: show ? Infinity : 2, label: `Hops of ${a}` }) +
    hopLine(b, lineEnd, show ? (lineEnd / b) | 0 : 2, { cls: "b", nums: show ? Infinity : 2, label: `Hops of ${b}` })
  );
};
/* the lockers open at the end of the Locker Problem: the square numbers */
const open20 = () =>
  Object.fromEntries(
    upTo(20)
      .filter((v) => Math.sqrt(v) % 1 === 0)
      .map((v) => [v, true]),
  );
function genLockers() {
  const variant = R(0, 5),
    name = pick(KIDS);
  if (variant === 0) {
    /* when two things that repeat happen together again: the first common multiple */
    const story = pick(TOGETHER),
      [a, b] = story.hot ? pick(story.hot) : twoOf(story.t, story.max),
      first = lcm(a, b);
    return {
      kind: "num",
      unit: story.unit,
      answer: first,
      prompt: story.say(a, b, name),
      fig: (show) => bothLines(a, b, show),
      misc: miscOf(first, [
        ...(a * b !== first
          ? [[a * b, `${a} × ${b} = ${a * b} is a common multiple, but not the first one. Look for a smaller one.`]]
          : []),
        [a + b, `You added ${a} + ${b}. Find a number that is a multiple of ${a} and of ${b}.`],
        [Math.max(a, b), `${Math.max(a, b)} is not a multiple of ${Math.min(a, b)}.`],
      ]),
      hint: `List the multiples of ${a} and of ${b}. What is the first number on both lists?`,
      explain: `${a}: ${upTo(first / a)
        .map((i) => i * a)
        .join(", ")}. ${b}: ${upTo(first / b)
        .map((i) => i * b)
        .join(", ")}. ${first} is the first common multiple of ${a} and ${b}.`,
    };
  }
  if (variant === 1) {
    /* a common multiple, a multiple of a only, and a multiple of b only */
    /* within the times tables: each number is at most 12 times a or b */
    const [a, b] = twoOf([2, 3, 4, 5, 6, 8, 9, 10], 50),
      first = lcm(a, b),
      common = first * R(1, Math.max(1, Math.floor((12 * Math.min(a, b)) / first)));
    /* a multiple of x that isn't a multiple of y */
    const onlyOf = (x, y) => {
      let v;
      do {
        v = x * R(2, Math.min(12, Math.floor(100 / x)));
      } while (v % y === 0);
      return v;
    };
    const onlyA = onlyOf(a, b);
    let onlyB;
    do {
      onlyB = onlyOf(b, a);
    } while (onlyB === onlyA);
    return {
      ...mcOf([
        [String(common), null],
        [String(onlyA), `${onlyA} is a multiple of ${a}, but not of ${b}.`],
        [String(onlyB), `${onlyB} is a multiple of ${b}, but not of ${a}.`],
      ]),
      prompt: `Which number is a common multiple of ${a} and ${b}?`,
      hint: `A common multiple is on both lists: counting by ${a}s and counting by ${b}s.`,
      explain: `${common / a} × ${a} = ${common} and ${common / b} × ${b} = ${common}, so ${common} is a multiple of both.`,
    };
  }
  if (variant === 2) {
    /* tap the first common multiple on a number chart, which runs a row or more past it */
    const [a, b] = twoOf([2, 3, 4, 5, 6, 8, 9, 10], 60),
      first = lcm(a, b),
      chartEnd = Math.max(20, 10 * Math.ceil((first + 1) / 10));
    const why = Object.fromEntries(
      upTo(chartEnd)
        .filter((v) => v !== first)
        .map((v) => [
          String(v),
          v % a === 0 && v % b === 0
            ? `${v} is a common multiple, but not the first one.`
            : v % a === 0
              ? `${v} is a multiple of ${a}, but not of ${b}.`
              : v % b === 0
                ? `${v} is a multiple of ${b}, but not of ${a}.`
                : `${v} is not a multiple of ${a} or ${b}.`,
        ]),
    );
    return {
      kind: "tap",
      answer: String(first),
      why,
      prompt: `Tap the first number that is a multiple of both ${a} and ${b}.`,
      fig: (show) =>
        chart(
          chartEnd,
          (v) => (show ? (v % a === 0 && v % b === 0 ? "ab" : v % a === 0 ? "a" : v % b === 0 ? "b" : "") : ""),
          { tap: "cand", label: `Numbers 1 to ${chartEnd}` },
        ),
      hint: `Gold squares are multiples of ${a}. Blue squares are multiples of ${b}. Green squares are both.`,
      explain: `${a}: ${upTo(first / a)
        .map((i) => i * a)
        .join(", ")}. ${b}: ${upTo(first / b)
        .map((i) => i * b)
        .join(", ")}. ${first} is the first common multiple.`,
    };
  }
  const intro =
    "20 lockers start closed. Student 1 opens every locker, student 2 changes every 2nd locker, and so on up to student 20.";
  if (variant === 3) {
    /* which students change locker n: its factors. Wrong lists leave out 1 or n, or add a number that isn't a factor. */
    const n = pick(upTo(20).filter((v) => v > 5 && !isPrime(v))),
      its = factors(n);
    const notFactor = pick(upTo(9).filter((v) => v > 1 && n % v)),
      plus = [...its, notFactor].sort((p, q) => p - q),
      minus = Math.random() < 0.5 ? its.slice(1) : its.slice(0, -1);
    return {
      ...mcOf(
        [
          [`Students ${list(its)}`, null],
          [
            `Students ${list(minus)}`,
            minus[0] === 1
              ? `Student ${n} changes every ${nth(n)} locker, starting with locker ${n}.`
              : `Student 1 changes every locker, so locker ${n} too.`,
          ],
          [
            `Students ${list(plus)}`,
            `Student ${notFactor} changes lockers ${notFactor}, ${2 * notFactor}, ${3 * notFactor}, … and skips ${n}. ${notFactor} is not a factor of ${n}.`,
          ],
        ],
        { stack: true },
      ),
      prompt: `${intro} Which students change locker ${n}?`,
      fig: () => lockers({}, { sel: n }),
      hint: `Student k changes the lockers that are multiples of k. Which numbers is ${n} a multiple of?`,
      explain: `Locker ${n} is changed by the students whose numbers are factors of ${n}: ${list(its)}.`,
    };
  }
  if (variant === 4) {
    /* how many changes, or open or closed at the end: a square number has an odd number of factors */
    const n = R(2, 20),
      its = factors(n),
      changes = its.length,
      isSquare = Math.sqrt(n) % 1 === 0;
    if (Math.random() < 0.5)
      return {
        kind: "num",
        unit: "students",
        answer: changes,
        prompt: `${intro} How many students change locker ${n}?`,
        fig: () => lockers({}, { sel: n }),
        misc: miscOf(changes, [
          [changes - 1, `Don’t forget student 1 and student ${n}.`],
          ...(isSquare
            ? [
                [
                  changes + 1,
                  `${Math.sqrt(n)} × ${Math.sqrt(n)} = ${n}, but student ${Math.sqrt(n)} is only one student.`,
                ],
              ]
            : []),
          [pairsOf(n).length, "That’s the number of factor pairs. Each pair has two factors."],
        ]),
        hint: `The students who change locker ${n} are the factors of ${n}. Find its factor pairs.`,
        explain: `The factors of ${n} are ${list(its)}. That’s ${changes} students.`,
      };
    const end = changes % 2 ? "Open" : "Closed";
    return {
      kind: "mc",
      choices: [
        { id: "o", label: "Open" },
        { id: "c", label: "Closed" },
      ],
      answer: end[0].toLowerCase(),
      why: {
        [changes % 2 ? "c" : "o"]:
          `Locker ${n} is changed ${changes} times (by students ${list(its)}). ${changes % 2 ? "An odd" : "An even"} number of changes leaves it ${end.toLowerCase()}.`,
      },
      prompt: `${intro} When they are done, is locker ${n} open or closed?`,
      fig: (show, done) => lockers(done ? open20() : {}, { sel: n }),
      hint: `Count the students who change locker ${n}: the factors of ${n}. Open, closed, open, …`,
      explain:
        `The factors of ${n} are ${list(its)}: ${changes} changes, so it ends ${end.toLowerCase()}.` +
        (isSquare ? ` ${Math.sqrt(n)} × ${Math.sqrt(n)} = ${n}, so ${n} has an odd number of factors.` : ""),
    };
  }
  /* how many lockers a student changes: the multiples of the student's number up to 20 */
  const student = R(2, 9),
    count = Math.floor(20 / student),
    changed = upTo(count).map((i) => i * student);
  return {
    kind: "num",
    unit: "lockers",
    answer: count,
    prompt: `${intro} How many lockers does student ${student} change?`,
    fig: (show) => lockers({}, { hi: show ? changed : [] }),
    misc: miscOf(count, [
      [student, `${student} is the student’s number. Count the multiples of ${student} up to 20.`],
      [count + 1, `${(count + 1) * student} is more than 20, and there are only 20 lockers.`],
      [
        20 - student,
        "Student " + student + " changes every " + nth(student) + " locker, not every locker after " + student + ".",
      ],
    ]),
    hint: `Student ${student} changes lockers ${student}, ${2 * student}, … Count the multiples of ${student} up to 20.`,
    explain: `Student ${student} changes lockers ${list(changed)}: ${count} lockers.`,
  };
}

/* ---------- Gear Works: factors and multiples together (Lesson 7) ---------- */
/* equal groups with none left over: [the story (n things, who), groups, one group, the things, the most there would be] */
const GROUPS = [
  [
    (n, who) =>
      `${who} packs ${n} cookies into bags, the same number in each bag, with none left over. How many cookies could go in each bag?`,
    "bags",
    "bag",
    "cookies",
    72,
  ],
  [
    (n) =>
      `${n} students split into teams of the same size, with no one left over. How many students could be on each team?`,
    "teams",
    "team",
    "students",
    36,
  ],
  [
    (n, who) =>
      `${who} puts ${n} books on shelves, the same number on each shelf, with none left over. How many books could go on each shelf?`,
    "shelves",
    "shelf",
    "books",
    60,
  ],
];
function genGears() {
  const variant = R(0, 4),
    name = pick(KIDS);
  if (variant === 0) {
    /* factor and multiple statements, when a is a factor of b (b = a × times) and when it isn't */
    const a = R(3, 9);
    if (Math.random() < 0.6) {
      const times = R(3, Math.min(12, Math.floor(100 / a))),
        b = a * times;
      return {
        ...mcOf(
          [
            [`${a} is a factor of ${b}, and ${b} is a multiple of ${a}.`, null],
            [
              `${b} is a factor of ${a}.`,
              `${b} is bigger than ${a}, so it can’t be a factor of ${a}. Try it the other way around.`,
            ],
            [
              `${a} is a multiple of ${b}.`,
              `A multiple is the number you land on counting by ${a}s. ${times} × ${a} = ${b}, so ${b} is the multiple.`,
            ],
          ],
          { stack: true },
        ),
        prompt: `Which is true about ${a} and ${b}?`,
        fig: (show) =>
          hopLine(a, b + a, show ? times : 1, {
            mark: b,
            nums: show ? Infinity : 1,
            label: `Number line counting by ${a}s, pointing at ${b}`,
          }),
        hint: `Count by ${a}s. Do you land on ${b}?`,
        explain: `${times} × ${a} = ${b}. So ${a} and ${times} are factors of ${b}, and ${b} is a multiple of ${a} and of ${times}.`,
      };
    }
    /* b falls between times × a and the next multiple */
    const times = R(3, Math.min(11, Math.floor(100 / a) - 1)),
      b = a * times + R(1, a - 1);
    return {
      ...mcOf(
        [
          [`${a} is not a factor of ${b}.`, null],
          [
            `${a} is a factor of ${b}.`,
            `${times} × ${a} = ${times * a} and ${times + 1} × ${a} = ${(times + 1) * a}. Counting by ${a}s skips ${b}.`,
          ],
          [
            `${b} is a multiple of ${a}.`,
            `Counting by ${a}s goes ${times * a}, ${(times + 1) * a}, and skips ${b}. So ${b} is not a multiple of ${a}.`,
          ],
        ],
        { stack: true },
      ),
      prompt: `Which is true about ${a} and ${b}?`,
      fig: (show) =>
        hopLine(a, (times + 1) * a, show ? times + 1 : 1, {
          mark: b,
          nums: show ? Infinity : 1,
          label: `Number line counting by ${a}s, pointing at ${b}`,
        }),
      hint: `Count by ${a}s. Do you land on ${b}, or jump over it?`,
      explain: `${times} × ${a} = ${times * a} and ${times + 1} × ${a} = ${(times + 1) * a}. ${b} is in between, so ${a} is not a factor of ${b}.`,
    };
  }
  if (variant === 1 || variant === 2) {
    /* variant 1: which could be the size of each group (a factor); variant 2: which is NOT a factor */
    const [say, groupsWord, groupWord, things, most] = pick(GROUPS),
      n = pick(RICH.filter((v) => v <= most && factors(v).filter((f) => f > 1 && f < v && f <= 12).length >= 2));
    /* its factors up to 12 (besides 1 and n), and the numbers from 3 to 12 that aren't factors */
    const its = factors(n).filter((f) => f > 1 && f < n && f <= 12),
      notFactors = upTo(12).filter((v) => v > 2 && n % v);
    const leftOver = (size) => {
      const groups = Math.floor(n / size);
      return `${groups} ${groups === 1 ? groupWord : groupsWord} of ${size} is ${groups * size}, with ${n - groups * size} left over.`;
    };
    const works = (f) => `${n / f} ${groupsWord} of ${f} is ${n}, so ${f} is a factor of ${n}.`;
    if (variant === 1) {
      const factor = pick(its),
        wrong = shuffle(notFactors).slice(0, 2);
      return {
        ...mcOf([
          [String(factor), null],
          ...wrong.map((size) => [String(size), `${size} doesn’t work: ${leftOver(size)}`]),
        ]),
        prompt: say(n, name),
        hint: `The number in each ${groupWord} has to be a factor of ${n}. Which one goes into ${n} with none left over?`,
        explain: `${n / factor} × ${factor} = ${n}. ${cap(works(factor))}`,
      };
    }
    const [f1, f2] = shuffle(its).slice(0, 2),
      notFactor = pick(notFactors);
    return {
      ...mcOf([
        [String(notFactor), null],
        [String(f1), `${f1} × ${n / f1} = ${n}, so ${f1} is a factor of ${n}.`],
        [String(f2), `${f2} × ${n / f2} = ${n}, so ${f2} is a factor of ${n}.`],
      ]),
      prompt: `Which number is <b>not</b> a factor of ${n}?`,
      hint: `Check each number: is there a whole number that times it makes ${n}?`,
      explain: `Counting by ${notFactor}s goes ${Math.floor(n / notFactor) * notFactor}, ${(Math.floor(n / notFactor) + 1) * notFactor}, and skips ${n}. So ${notFactor} is not a factor of ${n}.`,
    };
  }
  if (variant === 3) {
    /* how many factors: each pair gives two, but a square's middle pair gives one */
    const n = pick(RICH.filter((v) => v <= 64)),
      pairs = pairsOf(n),
      its = factors(n),
      isSquare = Math.sqrt(n) % 1 === 0;
    return {
      kind: "num",
      unit: "factors",
      answer: its.length,
      prompt: `How many factors does ${n} have?`,
      fig: (show) => (show ? allRects(n) : tiles(1, n, `${n} tiles in 1 row`)),
      misc: miscOf(its.length, [
        [pairs.length, "That’s the number of factor pairs. Each pair has two factors."],
        ...(isSquare
          ? [[its.length + 1, `${Math.sqrt(n)} × ${Math.sqrt(n)} uses the same factor twice. Count it once.`]]
          : []),
        [its.length - 2, `Don’t forget 1 and ${n}. 1 × ${n} is a factor pair too.`],
      ]),
      hint: `Find every factor pair: try 1, 2, 3, … and stop when the pairs turn around. Each pair gives two factors.`,
      explain: `The factor pairs are ${list(pairs.map(([a, b]) => `${a} × ${b}`))}. The factors are ${list(its)}: ${its.length} factors.`,
    };
  }
  /* the one multiple of a in a decade: [a, the decade's start, its multiple], from decades with exactly one */
  const options = [];
  [6, 7, 8, 9].forEach((a) =>
    range(8).forEach((i) => {
      const decade = 10 * (i + 2),
        inside = upTo(9)
          .map((j) => decade + j)
          .filter((v) => v % a === 0);
      if (inside.length === 1 && decade % a && (decade + 10) % a) options.push([a, decade, inside[0]]);
    }),
  );
  const [a, decade, multiple] = pick(options),
    times = multiple / a;
  return {
    kind: "num",
    unit: "",
    answer: multiple,
    prompt: `Which multiple of ${a} is between ${decade} and ${decade + 10}?`,
    fig: (show) =>
      hopLine(a, decade + 10, show ? times : 1, {
        nums: show ? Infinity : 1,
        label: `Number line counting by ${a}s to ${decade + 10}`,
      }),
    misc: miscOf(multiple, [
      [multiple - a, `${multiple - a} is a multiple of ${a}, but it’s less than ${decade}.`],
      [multiple + a, `${multiple + a} is a multiple of ${a}, but it’s more than ${decade + 10}.`],
    ]),
    hint: `Count by ${a}s until you get past ${decade}.`,
    explain: `${times} × ${a} = ${multiple}. The multiples of ${a} near there are ${multiple - a}, ${multiple}, and ${multiple + a}, and only ${multiple} is between ${decade} and ${decade + 10}.`,
  };
}

/* ---------- The Mega-Bot: everything ---------- */
const genBoss = () => pick([genHops, genTiles, genPrime, genLockers, genGears])();

const ZONES = [
  {
    id: "hops",
    name: "Hop Belt",
    lessons: "Lesson 1",
    blurb: "Skip-count along the belt to find multiples, and pick amounts you can buy in whole packs.",
    gen: genHops,
  },
  {
    id: "tiles",
    name: "Tile Press",
    lessons: "Lesson 2",
    blurb: "Press tiles into rectangles to find factor pairs, and find every pair for a number.",
    gen: genTiles,
  },
  {
    id: "prime",
    name: "Prime Sorter",
    lessons: "Lesson 3",
    blurb: "Sort numbers into prime and composite, and catch the odd numbers that aren’t prime.",
    gen: genPrime,
  },
  {
    id: "lockers",
    name: "Locker Room",
    lessons: "Lessons 5–6",
    blurb: "Find when buses and lights line up again, and solve the Locker Problem.",
    gen: genLockers,
  },
  {
    id: "gears",
    name: "Gear Works",
    lessons: "Lesson 7",
    blurb: "Say which number is a factor and which is a multiple, and count all the factors.",
    gen: genGears,
  },
  {
    id: "boss",
    name: "The Mega-Bot",
    lessons: "All lessons",
    blurb: "Power up the Mega-Bot! Every right answer charges one of its 10 battery cells.",
    gen: genBoss,
  },
];

/* the Mega-Bot: a robot with a 10-cell battery on its chest. lit: how many cells are charged (the boss icon draws all of them). */
const bot = (lit) =>
  '<path d="M32,4V11" stroke="#a9c4e4" stroke-width="2.5"/><circle cx="32" cy="4" r="3" fill="#ff8ac4"/><rect x="16" y="11" width="32" height="17" rx="4" fill="#7fb0e6" stroke="#0a2340" stroke-width="1.5"/>' +
  '<circle cx="25" cy="19.5" r="3.5" fill="#0a2340"/><circle cx="39" cy="19.5" r="3.5" fill="#0a2340"/><circle cx="25" cy="19.5" r="1.5" fill="#7fe3ff"/><circle cx="39" cy="19.5" r="1.5" fill="#7fe3ff"/>' +
  '<rect x="10" y="30" width="44" height="30" rx="5" fill="#5f8fca" stroke="#0a2340" stroke-width="1.5"/><path d="M10,36H4V50M54,36H60V50" fill="none" stroke="#a9c4e4" stroke-width="3" stroke-linecap="round"/>' +
  '<rect x="14" y="37" width="36" height="16" rx="2" fill="#0a2340"/>' +
  range(10)
    .map((i) => `<rect x="${16 + i * 3.4}" y="39" width="2.6" height="12" fill="${i < lit ? "#5fe0a8" : "#1b467a"}"/>`)
    .join("");
const ICON = {
  hops: '<rect x="4" y="44" width="56" height="10" rx="5" fill="#1b467a" stroke="#a9c4e4" stroke-width="2"/><circle cx="10" cy="49" r="2.5" fill="#a9c4e4"/><circle cx="54" cy="49" r="2.5" fill="#a9c4e4"/><path d="M8,42Q20,14 32,42M32,42Q44,14 56,42" fill="none" stroke="#ffc93c" stroke-width="3"/><circle cx="32" cy="42" r="3.5" fill="#ffc93c"/><circle cx="56" cy="42" r="3.5" fill="#ffc93c"/>',
  tiles:
    '<rect x="6" y="4" width="52" height="12" rx="2" fill="#a9c4e4" stroke="#0a2340" stroke-width="1.5"/><path d="M26,16V22M38,16V22" stroke="#a9c4e4" stroke-width="3"/><g fill="rgba(255,201,60,.55)" stroke="#0a2340" stroke-width="1.5">' +
    range(12)
      .map((i) => `<rect x="${8 + (i % 4) * 12}" y="${24 + Math.floor(i / 4) * 12}" width="12" height="12"/>`)
      .join("") +
    "</g>",
  prime:
    '<path d="M8,6H56L40,28V40H24V28Z" fill="#1b467a" stroke="#a9c4e4" stroke-width="2" stroke-linejoin="round"/><text x="32" y="22" fill="#ffc93c" font-size="13" font-weight="700" text-anchor="middle" font-family="monospace">7 9</text><rect x="6" y="46" width="22" height="14" rx="3" fill="#ffc93c"/><rect x="36" y="46" width="22" height="14" rx="3" fill="#7fe3ff"/><path d="M28,40L17,46M36,40L47,46" stroke="#a9c4e4" stroke-width="2"/>',
  lockers:
    '<g stroke="#7fe3ff" stroke-width="2"><rect x="6" y="10" width="15" height="44" fill="rgba(127,227,255,.35)"/><rect x="24.5" y="10" width="15" height="44" fill="#061528"/><rect x="43" y="10" width="15" height="44" fill="rgba(127,227,255,.35)"/></g><polygon points="24.5,10 30,15 30,49 24.5,54" fill="rgba(127,227,255,.6)" stroke="#7fe3ff" stroke-width="1.5"/>',
  gears:
    '<g fill="#ffc93c" stroke="#0a2340" stroke-width="1.5">' +
    range(8)
      .map((i) => `<rect x="20" y="8" width="8" height="8" transform="rotate(${i * 45} 24 24)"/>`)
      .join("") +
    '<circle cx="24" cy="24" r="13"/></g><circle cx="24" cy="24" r="4" fill="#0a2340"/>' +
    '<g fill="#7fe3ff" stroke="#0a2340" stroke-width="1.5">' +
    range(6)
      .map((i) => `<rect x="39" y="30" width="8" height="8" transform="rotate(${i * 60 + 30} 43 44)"/>`)
      .join("") +
    '<circle cx="43" cy="44" r="11"/></g><circle cx="43" cy="44" r="3.5" fill="#0a2340"/>',
  boss: bot(10),
};
