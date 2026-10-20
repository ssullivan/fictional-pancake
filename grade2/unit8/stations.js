/* Sweet Shop (Grade 2 Unit 8): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Pairs, plates, tiles, and cut rectangles come from this unit's figs.js; arrays, counters, hops of 2, and number charts from
   shared/multiply.js; and mcOf and miscOf from shared/util.js. Each generator deals one of a few kinds of problem (variant),
   each with a comment saying what it asks. Every problem carries `facts`, the numbers it was made from, so checks.js can work
   the answer out again. Odd and even numbers are within 20, and arrays have up to 5 rows and 5 columns. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* two different students */
const twoKids = () => shuffle(KIDS).slice(0, 2);
/* named mistakes, leaving out any that land on the answer for these numbers (the mistake doesn't show up then) */
const named = (answer, list) =>
  miscOf(
    answer,
    list.filter(([value]) => value !== answer && value > 0),
  );
/* treats in the shop, plural */
const TREATS = ["cookies", "crackers", "grapes", "pretzels", "gumdrops", "strawberries"];
/* mc choices that are pictures: build the choices from values ([[value, why], …]), then draw each as "Picture A", "Picture B", … */
function picChoices(list, draw) {
  const problem = mcOf(list.map(([v, why]) => [JSON.stringify(v), why]));
  problem.choices.forEach((choice, i) => {
    choice.label = draw(JSON.parse(choice.label), `Picture ${"ABCD"[i]}`);
  });
  return problem;
}

/* ---------- Fair Shares: share fairly and make pairs (Lessons 1–2) ---------- */
function genShare() {
  const variant = R(0, 2),
    [kid, friend] = twoKids(),
    treat = pick(TREATS);
  if (variant === 0) {
    /* share an even number fairly between 2 friends; the hint deals them out */
    const n = 2 * R(3, 10),
      each = n / 2;
    return {
      kind: "num",
      unit: treat,
      answer: each,
      facts: { t: "share", n },
      prompt: `${kid} and ${friend} share ${n} ${treat} fairly. How many ${treat} does each one get?`,
      fig: (show) => (show ? plateFig(n, n, [kid, friend]) : pile(n, `${n} counters`)),
      misc: named(each, [
        [n, `${n} is all of them. Share them between 2 friends.`],
        [2, "There are 2 friends. How many does each one get?"],
        [each + 1, `Then the other friend gets only ${each - 1}. That’s not fair.`],
      ]),
      hint: `Give 1 to ${kid}, then 1 to ${friend}, until they’re all shared. Or think: what double makes ${n}?`,
      explain: `${each} + ${each} = ${n}, so each one gets ${each}.`,
    };
  }
  if (variant === 1) {
    /* line up with a partner: does everyone have one? */
    const n = R(5, 20),
      odd = n % 2 === 1;
    return {
      ...mcOf([
        ["Yes, every student has a partner.", odd ? `${n} is odd. When they pair up, 1 is left.` : null],
        ["No, 1 student has no partner.", odd ? null : `${n} is even. Every student has a partner.`],
        ["No, 2 students have no partner.", "2 students left over can be partners with each other."],
      ]),
      stack: true,
      facts: { t: "partners", n },
      prompt: `${n} students line up with a partner. Does every student have a partner?`,
      fig: (show) => (show ? pairsFig(n) : pile(n, `${n} counters`)),
      hint: "Put the counters in pairs, one on top and one on the bottom. Is one left over?",
      explain: odd
        ? `${n} makes ${pl((n - 1) / 2, "pair")} and 1 left over, so 1 student has no partner. ${n} is odd.`
        : `${n} makes ${pl(n / 2, "pair")} with none left over, so every student has a partner. ${n} is even.`,
    };
  }
  /* can 2 friends share n fairly with none left? */
  const n = R(7, 20),
    odd = n % 2 === 1,
    half = Math.floor(n / 2);
  return {
    ...mcOf([
      [
        `Yes, they each get ${odd ? half + 1 : half}.`,
        odd ? `${half + 1} + ${half + 1} is ${2 * half + 2}, not ${n}.` : null,
      ],
      ["No, 1 is left over.", odd ? null : `${half} + ${half} = ${n}. None are left over.`],
      [
        `Yes, they each get ${odd ? half : half + 1}.`,
        odd ? `${half} + ${half} is ${2 * half}. 1 is left over.` : `${half + 1} + ${half + 1} is ${n + 2}, not ${n}.`,
      ],
    ]),
    stack: true,
    facts: { t: "fair", n },
    prompt: `Can ${kid} and ${friend} share ${n} ${treat} fairly, with none left over?`,
    fig: (show) => (show ? plateFig(n, odd ? n - 1 : n, [kid, friend]) : pile(n, `${n} counters`)),
    hint: `Deal them out 1 at a time to ${kid} and ${friend}. Is one left at the end?`,
    explain: odd
      ? `${half} + ${half} = ${n - 1}, and 1 is left over. ${n} is odd, so it can’t be shared fairly by 2.`
      : `${half} + ${half} = ${n}. ${n} is even, so they each get ${half}.`,
  };
}

/* ---------- Odd or Even: odd and even numbers (Lessons 3–4) ---------- */
function genOddEven() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* which number is even (or odd)? */
    const even = Math.random() < 0.5,
      numbers = shuffle(range(20).map((i) => i + 1)),
      right = numbers.find((v) => v % 2 === (even ? 0 : 1) && v > 2),
      wrongs = numbers.filter((v) => v % 2 === (even ? 1 : 0) && v > 2).slice(0, 2);
    return {
      ...mcOf([
        [String(right), null],
        ...wrongs.map((v) => [
          String(v),
          `${v} makes ${pl(Math.floor(v / 2), "pair")}${v % 2 ? " and 1 left over, so it’s odd" : " with none left over, so it’s even"}.`,
        ]),
      ]),
      facts: { t: "whichEven", even },
      prompt: `Which number is <b>${even ? "even" : "odd"}</b>?`,
      fig: (show) => (show ? pairsFig(right) : chart(20, () => "", { label: "The numbers 1 to 20" })),
      hint: "Even numbers make pairs with none left over. Odd numbers have 1 left over.",
      explain: `${right} ${right % 2 ? `makes ${pl(Math.floor(right / 2), "pair")} and 1 left over: odd` : `makes ${pl(right / 2, "pair")} with none left over: even`}.`,
    };
  }
  if (variant === 1) {
    /* counting by 2s from 0: which number will you say? */
    const kid = pick(KIDS),
      right = 2 * R(3, 10),
      wrongs = shuffle(range(8).map((i) => 5 + 2 * i)).slice(0, 2);
    return {
      ...mcOf([
        [String(right), null],
        ...wrongs.map((v) => [String(v), `Counting by 2s from 0 says 0, 2, 4, 6, … ${v} is odd, so it gets skipped.`]),
      ]),
      facts: { t: "byTwos", right },
      prompt: `${kid} counts by 2s, starting at 0. Which number will ${kid} say?`,
      fig: (show) => hopLine(2, 20, show ? 10 : 3, { label: "Hops of 2 from 0" }),
      hint: "Count by 2s: 0, 2, 4, 6, 8, 10, … Every number you say is even.",
      explain: `0, 2, 4, 6, … ${right} is even, so ${kid} says it.`,
    };
  }
  if (variant === 2) {
    /* 2 equal rows: how many in each? */
    const kid = pick(KIDS),
      n = 2 * R(4, 10),
      each = n / 2;
    return {
      kind: "num",
      unit: "counters",
      answer: each,
      facts: { t: "twoRows", n },
      prompt: `${kid} puts ${n} counters in 2 equal rows. How many counters are in each row?`,
      fig: (show) => (show ? pairsFig(n) : pile(n, `${n} counters`)),
      misc: named(each, [
        [n, `${n} is all the counters. Split them into 2 equal rows.`],
        [2, "There are 2 rows. How many counters go in each one?"],
      ]),
      hint: `What double makes ${n}? ? + ? = ${n}`,
      explain: `${each} + ${each} = ${n}, so each row has ${each}. ${n} is even.`,
    };
  }
  /* an odd number as a double and 1 more */
  const n = 2 * R(3, 9) + 1,
    half = (n - 1) / 2;
  return {
    ...mcOf([
      [`${half} + ${half} + 1`, null],
      [`${half + 1} + ${half + 1} + 1`, `That makes ${n + 2}, not ${n}.`],
      [`${half - 1} + ${half - 1} + 1`, `That makes ${n - 2}, not ${n}.`],
    ]),
    facts: { t: "doublePlus", n },
    prompt: `Which one shows <b>${n}</b> as a double and 1 more?`,
    fig: () => pairsFig(n),
    hint: `Count the pairs: each pair is 1 on top and 1 on the bottom. Then add the 1 left over.`,
    explain: `${n} is ${pl(half, "pair")} and 1 more: ${half} + ${half} + 1 = ${n}.`,
  };
}

/* ---------- Cookie Trays: arrays (Lessons 7–8) ---------- */
/* an array of r rows and c columns that isn't a square */
const rowsCols = (rLo = 2, rHi = 5, cLo = 2, cHi = 5) => {
  for (;;) {
    const r = R(rLo, rHi),
      c = R(cLo, cHi);
    if (r !== c) return [r, c];
  }
};
function genArrays() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* which picture is an array? The others have a short row, or counters out of line */
    const [r, c] = rowsCols(3, 4, 3, 5),
      cells = range(r * c).map((n) => [n % c, Math.floor(n / c)]),
      shortRow = cells.filter(([x, y]) => !(y === 1 && x === c - 1)),
      jumbled = cells.map(([x, y], i) => [x + [0.2, 0.4, 0, 0.3][i % 4], y + [0.1, 0.3, 0, 0.2][(i * 3) % 4]]);
    return {
      ...picChoices(
        [
          ["array", null],
          ["short", "One row is shorter. In an array, every row has the same number."],
          ["jumbled", "The counters aren’t in straight rows and columns."],
        ],
        (kind, letter) =>
          kind === "array" ? arrayFig(r, c, { label: letter }) : spots(kind === "short" ? shortRow : jumbled, letter),
      ),
      stack: true,
      facts: { t: "isArray", r, c },
      prompt: "Which picture is an array?",
      hint: "In an array, things are in straight rows and columns, and every row has the same number.",
      explain: `The array has ${pl(r, "row")} with ${c} in each row, all lined up in columns.`,
    };
  }
  if (variant === 1) {
    /* how many rows, columns, in each row, or in each column? */
    const [r, c] = rowsCols(),
      ask = pick(["rows", "columns", "row", "column"]),
      answer = { rows: r, columns: c, row: c, column: r }[ask];
    const question = {
      rows: "How many rows are in this array?",
      columns: "How many columns are in this array?",
      row: "How many counters are in each row?",
      column: "How many counters are in each column?",
    }[ask];
    return {
      kind: "num",
      unit: "",
      answer,
      facts: { t: "rowsCols", r, c, ask },
      prompt: question,
      fig: (show) => arrayFig(r, c, { band: show ? (ask === "rows" || ask === "row" ? "r" : "c") : null }),
      misc: named(answer, [
        [
          answer === r ? c : r,
          ask === "rows" || ask === "column"
            ? "Rows go across. Count down the side."
            : "Columns go up and down. Count across the top.",
        ],
        [r * c, "That’s every counter. Count just one row or column."],
      ]),
      hint: ask === "rows" || ask === "row" ? "Rows go across, left to right." : "Columns go up and down.",
      explain: `The array has ${pl(r, "row")} and ${pl(c, "column")}. Each row has ${c}, and each column has ${r}.`,
    };
  }
  /* which tray has r rows with c in each row? */
  const [r, c] = rowsCols(2, 4, 2, 5),
    treat = pick(["cookies", "cupcakes", "muffins"]);
  return {
    ...picChoices(
      [
        [[r, c], null],
        [[c, r], `That tray has ${pl(c, "row")} with ${r} in each row. Rows go across.`],
        [[r, c + 1], `That tray has ${c + 1} in each row.`],
      ],
      ([rows, cols], letter) => arrayFig(rows, cols, { label: letter }),
    ),
    stack: true,
    facts: { t: "whichTray", r, c },
    prompt: `A tray has ${pl(r, "row")} of ${treat}, with ${c} ${treat} in each row. Which tray is it?`,
    hint: `Count the rows going across. Then count how many are in one row.`,
    explain: `${pl(r, "row")} with ${c} in each row: ${r * c} ${treat}.`,
  };
}

/* ---------- Cupcake Sums: equal addends (Lessons 9–10) ---------- */
/* stories of things in rows: [what, where] */
const ROWS = [
  ["cupcakes", "on a tray"],
  ["cookies", "on a baking sheet"],
  ["chocolates", "in a box"],
  ["muffins", "in a pan"],
  ["chairs", "at the bake sale"],
];
function genAddends() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* each row has c: how many in all? Add the rows */
    const [r, c] = rowsCols(2, 5, 2, 5),
      total = r * c;
    return {
      kind: "num",
      unit: "counters",
      answer: total,
      facts: { t: "total", r, c },
      prompt: `Each row has ${c} counters. How many counters are there in all?`,
      fig: (show) => arrayFig(r, c, { band: show ? "r" : null, sum: true }),
      misc: named(total, [
        [r + c, `That adds the ${pl(r, "row")} and the ${c} in a row. Add ${c} once for each row.`],
        [total - c, "Count every row."],
      ]),
      hint: `Add ${c} for each row: ${addends(r, c)}.`,
      explain: `${addends(r, c)} = ${total}.`,
    };
  }
  if (variant === 1) {
    /* which equation does not match the array? Two that do (by rows and by columns), and one with a row too many */
    const [r, c] = rowsCols(2, 4, 2, 5),
      total = r * c;
    return {
      ...mcOf([
        [`${addends(r + 1, c)} = ${(r + 1) * c}`, null],
        [`${addends(r, c)} = ${total}`, `That adds the ${pl(r, "row")} of ${c}. It matches.`],
        [`${addends(c, r)} = ${total}`, `That adds the ${pl(c, "column")} of ${r}. It matches.`],
      ]),
      stack: true,
      facts: { t: "notMatch", r, c },
      prompt: "Which equation does <b>not</b> match this array?",
      fig: () => arrayFig(r, c),
      hint: `Count the rows and how many are in each. Then count the columns and how many are in each.`,
      explain: `The array has ${pl(r, "row")} of ${c}, not ${r + 1}. ${addends(r, c)} = ${total} and ${addends(c, r)} = ${total} both match.`,
    };
  }
  /* things set out in rows: how many? */
  const [r, c] = rowsCols(2, 5, 2, 5),
    [what, where] = pick(ROWS),
    kid = pick(KIDS),
    total = r * c;
  return {
    kind: "num",
    unit: what,
    answer: total,
    facts: { t: "total", r, c },
    prompt: `${kid} puts ${what} ${where} in ${pl(r, "row")}, with ${c} ${what} in each row. How many ${what} is that?`,
    fig: (show) => arrayFig(r, c, { band: show ? "r" : null, sum: true }),
    misc: named(total, [
      [r + c, `That adds ${r} and ${c}. Add ${c} once for each of the ${pl(r, "row")}.`],
      [c, `${c} is just one row.`],
    ]),
    hint: `${pl(r, "row")} of ${c}: ${addends(r, c)}.`,
    explain: `${addends(r, c)} = ${total} ${what}.`,
  };
}

/* ---------- Brownie Pans: rectangles and squares (Lessons 11–12) ---------- */
function genRects() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* how many squares make the rectangle? */
    const [r, c] = rowsCols(2, 4, 2, 5),
      total = r * c;
    return {
      kind: "num",
      unit: "squares",
      answer: total,
      facts: { t: "tiles", r, c },
      prompt: "How many squares make this rectangle?",
      fig: (show) => (show ? arrayFig(r, c, { band: "r", sum: true }) : tileFig(r, c)),
      misc: named(total, [
        [r + c, `Count every square, not just one row and one column.`],
        [2 * (r + c) - 4, "That counts only the squares around the edge. Count the middle too."],
      ]),
      hint: `${pl(r, "row")} of ${c}: ${addends(r, c)}.`,
      explain: `${pl(r, "row")} of ${c}: ${addends(r, c)} = ${total} squares.`,
    };
  }
  if (variant === 1) {
    /* which rectangle is cut into same-size squares? The others are cut into rectangles, or squares of 2 sizes */
    const w = R(3, 5),
      h = R(2, 3),
      squares = cutGrid(w, h, h, w),
      strips = cutGrid(w, h, 1, w),
      twoSizes = [[0, 0, 2, 2], ...squares.filter(([x, y]) => x >= 2 || y >= 2)];
    return {
      ...picChoices(
        [
          ["squares", null],
          ["strips", "Those pieces are taller than they are wide. They’re rectangles, not squares."],
          ["twoSizes", "Those are squares, but they aren’t all the same size."],
        ],
        (kind, letter) => pieces(w, h, { squares, strips, twoSizes }[kind], { U: 40, label: letter }),
      ),
      stack: true,
      facts: { t: "sameSquares", w, h },
      prompt: "Which rectangle is cut into same-size squares?",
      hint: "A square has 4 sides the same length. Are all the pieces squares, and the same size?",
      explain: `It’s cut into ${pl(h, "row")} of ${w} same-size squares: ${w * h} squares.`,
    };
  }
  /* a pan cut into rows: how many pieces? */
  const [r, c] = rowsCols(2, 5, 2, 5),
    treat = pick(["brownies", "cornbread", "fudge", "lemon bars"]),
    total = r * c;
  return {
    kind: "num",
    unit: "pieces",
    answer: total,
    facts: { t: "pan", r, c },
    prompt: `A pan of ${treat} is cut into ${pl(r, "row")}, with ${c} pieces in each row. How many pieces are there?`,
    fig: (show) =>
      pieces(c, r, cutGrid(c, r, r, c), {
        U: 44,
        num: (i) => (show ? i + 1 : null),
        label: `A pan cut into ${pl(r, "row")} of ${c} pieces`,
      }),
    misc: named(total, [
      [r + c, `Count every piece: ${c} in each of the ${pl(r, "row")}.`],
      [c, `${c} is just one row.`],
    ]),
    hint: `${addends(r, c)} = ?`,
    explain: `${addends(r, c)} = ${total} pieces.`,
  };
}

/* ---------- Bake Sale: everything ---------- */
const genBoss = () => pick([genShare, genOddEven, genArrays, genAddends, genRects])();

const ZONES = [
  {
    id: "share",
    name: "Fair Shares",
    lessons: "Lessons 1–2",
    blurb: "Share treats fairly between 2 friends, and see if everyone gets a partner.",
    gen: genShare,
  },
  {
    id: "oddeven",
    name: "Odd or Even",
    lessons: "Lessons 3–4",
    blurb: "Tell odd from even with pairs, count by 2s, and make doubles.",
    gen: genOddEven,
  },
  {
    id: "arrays",
    name: "Cookie Trays",
    lessons: "Lessons 7–8",
    blurb: "Spot an array, count its rows and columns, and find the right tray.",
    gen: genArrays,
  },
  {
    id: "addends",
    name: "Cupcake Sums",
    lessons: "Lessons 9–10",
    blurb: "Add the rows of an array, and match arrays to equations.",
    gen: genAddends,
  },
  {
    id: "rects",
    name: "Brownie Pans",
    lessons: "Lessons 11–12",
    blurb: "Count the squares in a rectangle, and cut pans into same-size squares.",
    gen: genRects,
  },
  {
    id: "boss",
    name: "Bake Sale",
    lessons: "All lessons",
    blurb: "Fill the bake sale tray! Every right answer puts one of 10 cupcakes on it.",
    gen: genBoss,
  },
];

/* a cupcake at x, y: a wrapper and frosting with a cherry (dashed outline when it isn't on the tray yet) */
const cupcake = (x, y, on) =>
  on
    ? `<g><path d="M${x - 5},${y}L${x - 4},${y + 7}H${x + 4}L${x + 5},${y}Z" fill="#6fa8ff" stroke="#0a2340" stroke-width=".8"/><path d="M${x - 6},${y}Q${x - 6},${y - 7} ${x},${y - 8}Q${x + 6},${y - 7} ${x + 6},${y}Z" fill="#ff9fb2" stroke="#0a2340" stroke-width=".8"/><circle cx="${x}" cy="${y - 9}" r="1.6" fill="#ff6b6b"/></g>`
    : `<rect x="${x - 6}" y="${y - 8}" width="12" height="15" rx="3" fill="none" stroke="rgba(170,205,255,.35)" stroke-dasharray="2 2"/>`;
/* a tray with 10 cupcakes in 2 rows of 5, the first `placed` of them on it (also the boss icon, with 7 placed) */
const tray = (placed) =>
  '<rect x="2" y="12" width="60" height="46" rx="6" fill="#d9a066" stroke="#0a2340" stroke-width="1.5"/><rect x="6" y="16" width="52" height="38" rx="4" fill="#c4874d"/>' +
  range(10)
    .map((i) => cupcake(12 + (i % 5) * 10, 28 + Math.floor(i / 5) * 18, i < placed))
    .join("");
const ICON = {
  share:
    '<ellipse cx="18" cy="44" rx="15" ry="7" fill="#cfd8e3" stroke="#0a2340" stroke-width="1.5"/><ellipse cx="46" cy="44" rx="15" ry="7" fill="#cfd8e3" stroke="#0a2340" stroke-width="1.5"/>' +
    [12, 18, 24, 40, 46, 52].map((x) => `<circle cx="${x}" cy="40" r="4" fill="#d9a066" stroke="#0a2340"/>`).join("") +
    '<circle cx="32" cy="16" r="5" fill="#d9a066" stroke="#0a2340"/>',
  oddeven:
    '<rect x="6" y="10" width="14" height="44" rx="7" fill="none" stroke="#a9c4e4" stroke-width="2"/><rect x="24" y="10" width="14" height="44" rx="7" fill="none" stroke="#a9c4e4" stroke-width="2"/>' +
    [13, 31]
      .map((x) => `<circle cx="${x}" cy="20" r="5" fill="#ffc93c"/><circle cx="${x}" cy="44" r="5" fill="#ffc93c"/>`)
      .join("") +
    '<circle cx="49" cy="20" r="5" fill="#7fe3ff"/><circle cx="49" cy="20" r="9" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 2"/>',
  arrays:
    '<rect x="4" y="10" width="56" height="44" rx="5" fill="#a9c4e4" stroke="#0a2340" stroke-width="1.5"/>' +
    range(12)
      .map(
        (i) =>
          `<circle cx="${13 + (i % 4) * 13}" cy="${20 + Math.floor(i / 4) * 12}" r="5" fill="#d9a066" stroke="#0a2340"/>`,
      )
      .join(""),
  addends:
    range(6)
      .map((i) => cupcake(14 + (i % 3) * 14, 22 + Math.floor(i / 3) * 22, true))
      .join("") +
    '<text x="56" y="40" fill="#ffc93c" font-size="16" font-weight="700" text-anchor="middle" font-family="monospace">+</text>',
  rects:
    '<rect x="6" y="12" width="52" height="40" rx="3" fill="#7a4a1c" stroke="#0a2340" stroke-width="1.5"/><path d="M19,12V52M32,12V52M45,12V52M6,25H58M6,39H58" stroke="#c4874d" stroke-width="2"/>',
  boss: tray(7),
};
