/* Toy Workshop (Grade 3 Unit 4): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Counters in equal groups (dealFig) and the multiplication table (timesTable, tableRow) come from figs.js; arrays (arrayFig),
   hops on a number line (hopLine), and area diagrams (areaModel) from shared/multiply.js; equal groups of base-ten blocks
   (divideFig) from shared/blocks.js; rectangles cut in two (splitFig) from shared/shapes.js; tape diagrams (timesTape) from
   shared/numlines.js; mcOf and miscOf from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Every problem also
   carries facts for checks.js: its kind (t) and the numbers it was made from, so the answer can be worked out again. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* n and the word for it: "1 box", "3 boxes" (plural: the word for more than one) */
const pl = (n, word, plural = word + "s") => `${n} ${n === 1 ? word : plural}`;
/* the named mistakes that apply to these numbers: a wrong value that's the answer, or not a whole number above 0, is left out */
const namedMisc = (answer, list) =>
  miscOf(
    answer,
    list.filter(([value]) => value !== answer && value > 0 && Number.isInteger(value)),
  );
/* the value of an expression with +, −, ×, and ÷, where × and ÷ go first, left to right: "40 ÷ 4 + 16 ÷ 4" is 14 */
function evaluate(expression) {
  const terms = expression.split(/ ([+−]) /),
    /* a term's ×s and ÷s, left to right */
    product = (term) => {
      const parts = term.split(/ ([×÷]) /);
      let value = +parts[0];
      for (let i = 1; i < parts.length; i += 2)
        value = parts[i] === "×" ? value * +parts[i + 1] : value / +parts[i + 1];
      return value;
    };
  let value = product(terms[0]);
  for (let i = 1; i < terms.length; i += 2) value += (terms[i] === "+" ? 1 : -1) * product(terms[i + 1]);
  return value;
}

/* ---------- stories that put things in equal groups (Packing Line) ---------- */
/* Each story makes sense with `each` in its range (checks.js has the same ranges) and 2 to 10 groups. thing: what's grouped;
   box and boxes: one group and more than one. byGroups(total, each, name) asks how many groups; byEach(total, groups, name)
   asks how many in each. fixed: every group always has this many (a wagon's 4 wheels). */
const STORIES = [
  {
    id: "cars",
    thing: "toy cars",
    box: "box",
    boxes: "boxes",
    each: [2, 10],
    byGroups: (total, each) =>
      `The workshop has ${total} toy cars. It packs ${each} cars in each box. How many boxes does it fill?`,
    byEach: (total, groups) =>
      `The workshop packs ${total} toy cars into ${groups} boxes, the same number in each. How many cars go in each box?`,
  },
  {
    id: "marbles",
    thing: "marbles",
    box: "bag",
    boxes: "bags",
    each: [5, 10],
    byGroups: (total, each) =>
      `There are ${total} marbles. Each bag holds ${each} marbles. How many bags can be filled?`,
    byEach: (total, groups) =>
      `${total} marbles are shared equally into ${groups} bags. How many marbles are in each bag?`,
  },
  {
    id: "wheels",
    thing: "wheels",
    box: "wagon",
    boxes: "wagons",
    each: [4, 4],
    fixed: 4,
    byGroups: (total) =>
      `There are ${total} wheels. Each toy wagon needs 4 wheels. How many wagons can the workers build?`,
    byEach: (total, groups) =>
      `The workers put ${total} wheels on ${groups} toy wagons, the same number on each. How many wheels does each wagon get?`,
  },
  {
    id: "stickers",
    thing: "stickers",
    box: "friend",
    boxes: "friends",
    each: [2, 10],
    byGroups: (total, each, name) =>
      `${name} has ${total} stickers and gives ${each} to each friend. How many friends get stickers?`,
    byEach: (total, groups, name) =>
      `${name} shares ${total} stickers equally among ${groups} friends. How many stickers does each friend get?`,
  },
  {
    id: "bears",
    thing: "teddy bears",
    box: "shelf",
    boxes: "shelves",
    each: [2, 8],
    byGroups: (total, each) =>
      `There are ${total} teddy bears. The workers put ${each} on each shelf. How many shelves do they fill?`,
    byEach: (total, groups) =>
      `The workers put ${total} teddy bears on ${groups} shelves, the same number on each. How many bears are on each shelf?`,
  },
  {
    id: "blocks",
    thing: "blocks",
    box: "tower",
    boxes: "towers",
    each: [3, 10],
    byGroups: (total, each, name) =>
      `${name} has ${total} blocks and builds towers of ${each} blocks. How many towers does ${name} build?`,
    byEach: (total, groups, name) =>
      `${name} builds ${groups} towers, all the same height, with ${total} blocks. How many blocks are in each tower?`,
  },
  {
    id: "crayons",
    thing: "crayons",
    box: "pack",
    boxes: "packs",
    each: [4, 10],
    byGroups: (total, each) =>
      `There are ${total} crayons. Each pack holds ${each} crayons. How many packs can be filled?`,
    byEach: (total, groups) =>
      `${total} crayons are put into ${groups} packs, the same number in each. How many crayons are in each pack?`,
  },
];
/* a story, how many groups, and how many in each: 2 to 10 groups, with `each` in the story's range (at most maxEach) */
function storyNumbers(stories = STORIES, maxGroups = 10, maxEach = 10) {
  const story = pick(stories),
    groups = R(2, maxGroups),
    each = R(story.each[0], Math.min(story.each[1], maxEach));
  return { story, groups, each, total: groups * each };
}

/* ---------- Packing Line: what division means (Lessons 1–5) ---------- */
function genGroups() {
  const variant = R(0, 4),
    [name] = shuffle(KIDS);
  if (variant === 0) {
    /* how many groups: the size of each group is known */
    const { story, groups, each, total } = storyNumbers();
    return {
      kind: "num",
      unit: story.boxes,
      answer: groups,
      facts: { t: "byGroups", id: story.id, total, each, groups },
      prompt: story.byGroups(total, each, name),
      fig: (show) => (show ? dealFig(groups, each, 0) : dealFig(0, 0, total)),
      misc: namedMisc(groups, [
        [
          total - each,
          `That takes away one ${story.box}. Keep making ${story.boxes} of ${each} until they’re all used.`,
        ],
        [total + each, `That adds ${each}. Split the ${total} ${story.thing} into ${story.boxes} of ${each}.`],
        [each, `${each} is how many in each ${story.box}. How many ${story.boxes} are there?`],
      ]),
      hint: `Make ${story.boxes} of ${each} until all ${total} are used. Count the ${story.boxes}. What times ${each} is ${total}?`,
      explain: `${groups} ${story.boxes} of ${each} make ${total}: ${groups} × ${each} = ${total}. So ${total} ÷ ${each} = ${groups}.`,
    };
  }
  if (variant === 1) {
    /* how many in each group: the number of groups is known; share them out one at a time */
    const { story, groups, each, total } = storyNumbers();
    return {
      kind: "num",
      unit: story.thing,
      answer: each,
      facts: { t: "byEach", id: story.id, total, each, groups },
      prompt: story.byEach(total, groups, name),
      fig: (show) => (show ? dealFig(groups, each, 0) : dealFig(groups, 0, total)),
      misc: namedMisc(each, [
        [
          total - groups,
          `That takes away ${groups}. Share the ${total} ${story.thing} equally into ${groups} ${story.boxes}.`,
        ],
        [groups, `${groups} is how many ${story.boxes}. How many go in each one?`],
      ]),
      hint: `Share them out one at a time: one in each of the ${groups} ${story.boxes}, again and again. ${groups} times what is ${total}?`,
      explain: `${groups} ${story.boxes} with ${each} in each make ${total}: ${groups} × ${each} = ${total}. So ${total} ÷ ${groups} = ${each}.`,
    };
  }
  if (variant === 2) {
    /* what a division expression could mean: total ÷ n is n equal groups, or groups of n. The wrong ones multiply, add, or
       take away */
    const { story, groups, each, total } = storyNumbers(STORIES.filter((s) => !s.fixed)),
      n = R(0, 1) ? groups : each,
      meaning = R(0, 1)
        ? `${total} ${story.thing} shared equally into ${n} ${story.boxes}`
        : `${total} ${story.thing} put into ${story.boxes} of ${n}`;
    return {
      ...mcOf([
        [meaning, null],
        ...shuffle([
          [
            `${n} ${story.boxes} with ${total} ${story.thing} in each`,
            `That’s ${n} groups of ${total}. Dividing splits ${total} up.`,
          ],
          [`${total} ${story.thing}, and then ${n} more`, `That’s ${total} + ${n}. Dividing makes equal groups.`],
          [`${total} ${story.thing}, and ${n} are taken away`, `That’s ${total} − ${n}. Dividing makes equal groups.`],
        ]).slice(0, 2),
      ]),
      stack: true,
      facts: { t: "meaning", id: story.id, total, n },
      prompt: `Which could ${total} ÷ ${n} mean?`,
      fig: (show) => (show ? dealFig(total / n, n, 0) : dealFig(0, 0, total)),
      hint: `${total} ÷ ${n} starts with ${total} and makes equal groups: ${n} groups, or groups of ${n}.`,
      explain: `${total} ÷ ${n} = ${total / n}: ${total} ${story.thing} make ${n} equal groups of ${total / n}, or ${total / n} groups of ${n}.`,
    };
  }
  if (variant === 3) {
    /* which expression matches a story: total ÷ the number the story gives. The wrong ones turn it around, multiply, or
       take away */
    const { story, groups, each, total } = storyNumbers(),
      byGroups = R(0, 1),
      known = byGroups ? each : groups;
    return {
      ...mcOf([
        [`${total} ÷ ${known}`, null],
        ...shuffle([
          [`${known} ÷ ${total}`, `Start with all the ${story.thing}, ${total}, and split them up.`],
          [`${total} × ${known}`, `There are ${total} ${story.thing} in all. Split them into equal groups: divide.`],
          [`${total} − ${known}`, `That takes away ${known} once. Make equal groups: divide.`],
        ]).slice(0, 2),
      ]),
      facts: { t: "expression", id: story.id, total, known, byGroups },
      prompt: `${byGroups ? story.byGroups(total, each, name) : story.byEach(total, groups, name)} Which expression matches?`,
      fig: (show) => (show ? dealFig(groups, each, 0) : byGroups ? dealFig(0, 0, total) : dealFig(groups, 0, total)),
      hint: `Start with all the ${story.thing}. How are they split up?`,
      explain: `${total} ${story.thing} split ${byGroups ? `into ${story.boxes} of ${each}` : `equally into ${groups} ${story.boxes}`}: ${total} ÷ ${known} = ${byGroups ? groups : each}.`,
    };
  }
  /* which drawing shows a story: groups of a size. The wrong ones have the number of groups and the size switched, or one
     more in each */
  let groups, each;
  do {
    groups = R(2, 5);
    each = R(2, 6);
  } while (groups === each || (each + 1) * groups > 30);
  const total = groups * each,
    story = pick(STORIES.filter((s) => !s.fixed && s.each[0] <= each && s.each[1] >= each));
  return {
    ...mcOf([
      [dealFig(groups, each, 0), null],
      [dealFig(each, groups, 0), `That’s ${each} ${story.boxes} of ${groups}. Each ${story.box} has ${each}.`],
      [
        dealFig(groups, each + 1, 0),
        `That’s ${groups} ${story.boxes} of ${each + 1}: ${groups * (each + 1)} ${story.thing}, not ${total}.`,
      ],
    ]),
    stack: true,
    facts: { t: "drawing", id: story.id, total, each },
    prompt: `${story.byGroups(total, each, name).replace(/ How many.*$/, "")} Which drawing shows it?`,
    hint: `Each ${story.box} has ${each}. Make ${story.boxes} of ${each} until all ${total} are used.`,
    explain: `${total} ${story.thing} in ${story.boxes} of ${each} make ${groups} ${story.boxes}: ${total} ÷ ${each} = ${groups}.`,
  };
}

/* ---------- Missing Pieces: division as an unknown factor (Lessons 6–8) ---------- */
function genUnknown() {
  const variant = R(0, 3),
    a = R(2, 10),
    b = R(2, 10),
    product = a * b;
  if (variant === 0) {
    /* a × ? = product, or ? × b = product: count by the factor you know on a number line */
    const unknownFirst = R(0, 1),
      equation = unknownFirst ? `? × ${b} = ${product}` : `${a} × ? = ${product}`,
      [known, answer] = unknownFirst ? [b, a] : [a, b];
    return {
      kind: "num",
      unit: "",
      answer,
      facts: { t: "unknown", equation, product },
      prompt: `What number makes this true? ${equation}`,
      fig: (show) => hopLine(known, product, show ? answer : 0, { mark: product }),
      misc: namedMisc(answer, [
        [product - known, `That’s ${product} − ${known}. What number times ${known} is ${product}?`],
        ...(answer < 10 ? [[answer + 1, `${answer + 1} × ${known} = ${(answer + 1) * known}, not ${product}.`]] : []),
        [answer - 1, `${answer - 1} × ${known} = ${(answer - 1) * known}, not ${product}.`],
      ]),
      hint: `Count by ${known}s to ${product}. How many ${known}s is that?`,
      explain: `${answer} × ${known} = ${product}, so the missing number is ${answer}. That’s the same as ${product} ÷ ${known} = ${answer}.`,
    };
  }
  if (variant === 1) {
    /* divide with a product you know: a × b = product, so product ÷ a = b */
    return {
      kind: "num",
      unit: "",
      answer: b,
      facts: { t: "known", a, b },
      prompt: `${a} × ${b} = ${product}. Use it to find ${product} ÷ ${a}.`,
      fig: (show) => arrayFig(a, b, { band: show ? "r" : null }),
      misc: namedMisc(b, [
        [a, `${product} ÷ ${a} asks: ${a} times what is ${product}?`],
        [product - a, `That’s ${product} − ${a}. Division asks: ${a} times what is ${product}?`],
      ]),
      hint: `${product} ÷ ${a} asks: ${a} times what is ${product}? Look at the multiplication.`,
      explain: `${a} × ${b} = ${product}, so ${product} split into ${a} equal rows has ${b} in each: ${product} ÷ ${a} = ${b}.`,
    };
  }
  if (variant === 2) {
    /* a fact family: which division equation goes with a × b = product? The wrong ones start with a factor, or divide by
       a and get a again */
    let x, y;
    do {
      x = R(2, 9);
      y = R(2, 9);
    } while (x === y);
    const total = x * y;
    return {
      ...mcOf([
        [`${total} ÷ ${y} = ${x}`, null],
        [`${x} ÷ ${y} = ${total}`, `Division starts with the total, ${total}.`],
        [`${total} ÷ ${x} = ${x}`, `${x} × ${x} = ${x * x}, not ${total}. ${total} ÷ ${x} = ${y}.`],
      ]),
      facts: { t: "family", x, y },
      prompt: `${x} × ${y} = ${total}. Which division equation is also true?`,
      fig: (show) => arrayFig(x, y, { band: show ? "c" : null }),
      hint: `The array has ${x} rows of ${y}, and ${y} columns of ${x}. Split the ${total} into ${y} equal columns.`,
      explain: `${x} × ${y} = ${total}, so ${total} ÷ ${y} = ${x} and ${total} ÷ ${x} = ${y}. They’re a family of facts.`,
    };
  }
  /* ? ÷ a = b: what was split up? a groups of b */
  return {
    kind: "num",
    unit: "",
    answer: product,
    facts: { t: "dividend", a, b },
    prompt: `What number makes this true? ? ÷ ${a} = ${b}`,
    fig: (show) => dealFig(a, show ? b : 0, 0, { label: show ? null : `${a} equal groups` }),
    misc: namedMisc(product, [
      [a + b, `That’s ${a} + ${b}. ? split into ${a} groups has ${b} in each: ${a} × ${b}.`],
      [b, `${b} is how many in each group. ? is all of them: ${a} groups of ${b}.`],
    ]),
    hint: `? split into ${a} equal groups gives ${b} in each. How many is ${a} groups of ${b}?`,
    explain: `${a} groups of ${b}: ${a} × ${b} = ${product}. So ${product} ÷ ${a} = ${b}.`,
  };
}

/* ---------- Puzzle Wall: patterns in the multiplication table (Lesson 9) ---------- */
function genTable() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* tap the turnaround of a product in the table: the gold square is row × col; tap col × row */
    let row, col;
    do {
      row = R(2, 9);
      col = R(2, 9);
    } while (row === col);
    const answer = `${col}-${row}`,
      why = {};
    range(10).forEach((i) =>
      range(10).forEach((j) => {
        const r = i + 1,
          c = j + 1,
          id = `${r}-${c}`;
        if (id === answer) return;
        why[id] =
          id === `${row}-${col}`
            ? `That’s the gold square, ${row} × ${col}. Find row ${col}, column ${row}.`
            : r * c === row * col
              ? `That square is ${r} × ${c} = ${r * c}. It has the same product, but it’s not ${col} × ${row}.`
              : `That square is ${r} × ${c} = ${r * c}. Find row ${col}, column ${row}.`;
      }),
    );
    return {
      kind: "tap",
      answer,
      why,
      facts: { t: "turn", row, col },
      prompt: `The gold square is ${row} × ${col}: row ${row}, column ${col}. Tap the square for ${col} × ${row}.`,
      fig: (show) =>
        timesTable({
          cls: (r, c) => (r === row && c === col ? "a" : show && (r === col || c === row) ? "b" : ""),
          tap: "cand",
        }),
      hint: `${col} × ${row} is in row ${col} and column ${row}. Go down the left side to ${col}, then across to column ${row}.`,
      explain: `${col} × ${row} = ${row * col}, the same as ${row} × ${col}. Turned around, the factors trade places across the table.`,
    };
  }
  if (variant === 1) {
    /* the missing product in a row of the table: count on by n */
    const n = R(2, 10),
      missing = R(3, 10),
      answer = n * missing;
    return {
      kind: "num",
      unit: "",
      answer,
      facts: { t: "row", n, missing },
      prompt: `This is the row of ${n}s in the multiplication table. What product is missing?`,
      fig: () => tableRow(n, 10, missing),
      misc: namedMisc(answer, [
        [n * (missing - 1) + 1, `The products go up by ${n} each time, not by 1.`],
        ...(missing < 10
          ? [[n * missing + n, `That’s the next one, ${n} × ${missing + 1}. The missing one is under ${missing}.`]]
          : []),
      ]),
      hint: `The products go up by ${n} each time. The missing one is ${n} × ${missing}.`,
      explain: `${n} × ${missing - 1} = ${n * (missing - 1)}, and ${n} more is ${answer}: ${n} × ${missing} = ${answer}.`,
    };
  }
  if (variant === 2) {
    /* odd and even products: an even factor makes an even product; only odd × odd is odd */
    const odd = () => pick([3, 5, 7, 9]),
      even = () => pick([2, 4, 6, 8]),
      askOdd = R(0, 1),
      say = ([x, y]) => `${x} × ${y}`;
    let oddPair, evenPairs;
    do {
      oddPair = [odd(), odd()];
      evenPairs = shuffle([
        [even(), odd()],
        [odd(), even()],
        [even(), even()],
      ]).slice(0, 2);
    } while (new Set([oddPair, ...evenPairs].map(say)).size < 3);
    const choices = askOdd
      ? [
          [say(oddPair), null],
          ...evenPairs.map((pair) => [say(pair), `${say(pair)} = ${pair[0] * pair[1]}, an even number.`]),
        ]
      : [
          [say(evenPairs[0]), null],
          [say(oddPair), `${say(oddPair)} = ${oddPair[0] * oddPair[1]}, an odd number.`],
          ...(() => {
            /* another odd × odd for the third choice */
            let other;
            do other = [odd(), odd()];
            while (say(other) === say(oddPair));
            return [[say(other), `${say(other)} = ${other[0] * other[1]}, an odd number.`]];
          })(),
        ];
    return {
      ...mcOf(choices),
      facts: { t: "parity", odd: !!askOdd },
      prompt: `Which product is ${askOdd ? "odd" : "even"}?`,
      fig: (show) =>
        timesTable({
          cls: (r, c) => (show && (r * c) % 2 ? "b" : ""),
          label: show ? "The multiplication table, odd products in blue" : undefined,
        }),
      hint: "Any number times an even number is even. Only an odd number times an odd number is odd.",
      explain: `${choices[0][0]} = ${evaluate(choices[0][0])}, ${askOdd ? "odd: both factors are odd" : "even: a factor is even"}.`,
    };
  }
  /* double a row: the 4s are double the 2s, the 6s double the 3s, the 8s double the 4s, the 10s double the 5s */
  const small = pick([2, 3, 4, 5]),
    big = 2 * small,
    factor = R(2, 9),
    known = small * factor,
    answer = big * factor;
  return {
    kind: "num",
    unit: "",
    answer,
    facts: { t: "double", small, factor },
    prompt: `${small} × ${factor} = ${known}. The ${big}s are double the ${small}s. What is ${big} × ${factor}?`,
    fig: (show) =>
      timesTable({
        cls: (r, c) => (c === factor && r === small ? "a" : c === factor && r === big ? "b" : ""),
        show: (r, c) => !(c === factor && r === big) || show,
        label: `The multiplication table with ${small} × ${factor} and ${big} × ${factor} lit up`,
      }),
    misc: namedMisc(answer, [
      [known + 2, `Double the product, ${known}, not the ${small}.`],
      [known + small, `That’s ${small + 1} × ${factor}. ${big} × ${factor} is two ${small} × ${factor}s.`],
      [known, `That’s ${small} × ${factor}. ${big} × ${factor} is double it.`],
    ]),
    hint: `${big} × ${factor} is ${small} × ${factor} two times: ${known} + ${known}.`,
    explain: `${known} + ${known} = ${answer}, so ${big} × ${factor} = ${answer}.`,
  };
}

/* ---------- Block Room: break apart a rectangle to multiply (Lessons 10–11) ---------- */
/* a rectangle to break apart: 3 to 9 rows, 6 to 10 columns, cut after 5 (or 2, 3, or 4) columns, a fact you know */
function cutRect() {
  const rows = R(3, 9),
    cols = R(6, 10),
    cut = pick([5, 5, 2, 3, 4].filter((c) => c < cols));
  return { rows, cols, cut, rest: cols - cut, area: rows * cols };
}
function genRectangles() {
  const variant = R(0, 3),
    { rows, cols, cut, rest, area } = cutRect();
  if (variant === 0) {
    /* the area of a gridded rectangle cut in two: add the areas of the parts */
    return {
      kind: "num",
      unit: "square units",
      answer: area,
      facts: { t: "area", rows, cut, rest },
      prompt: `The rectangle is cut into two parts. What is the area of the whole rectangle?`,
      fig: (show) => splitFig(rows, cols, cut, { products: show }),
      misc: namedMisc(area, [
        [rows * cut, `That’s only the gold part. Add the blue part, ${rows} × ${rest}.`],
        [rows * cut + rest, `The blue part is ${rows} × ${rest}, not ${rest}.`],
        [rows + cols, `That adds the sides. Area is how many squares cover it.`],
      ]),
      hint: `Find each part: ${rows} × ${cut} and ${rows} × ${rest}. Then add them.`,
      explain: `${rows} × ${cut} = ${rows * cut} and ${rows} × ${rest} = ${rows * rest}. ${rows * cut} + ${rows * rest} = ${area} square units.`,
    };
  }
  if (variant === 1) {
    /* the missing side in a broken-apart multiplication */
    return {
      kind: "num",
      unit: "",
      answer: rest,
      facts: { t: "missing", rows, cols, cut },
      prompt: `What number is missing? ${rows} × ${cols} = ${rows} × ${cut} + ${rows} × ?`,
      fig: (show) => splitFig(rows, cols, cut, { ask: show ? null : "right" }),
      misc: namedMisc(rest, [
        [cols, `${cols} is the whole side. The blue part is what’s left after ${cut}.`],
        [rows * rest, `That’s the blue part’s area. What is its side?`],
      ]),
      hint: `The whole side is ${cols}. The gold part takes ${cut}. What’s left?`,
      explain: `${cols} = ${cut} + ${rest}, so ${rows} × ${cols} = ${rows} × ${cut} + ${rows} × ${rest}.`,
    };
  }
  if (variant === 2) {
    /* which expression gives the area of a rectangle cut in two (no grid)? The wrong ones forget to multiply a part, or add
       the sides */
    return {
      ...mcOf([
        [`${rows} × ${cut} + ${rows} × ${rest}`, null],
        [`${rows} × ${cut} + ${rest}`, `The blue part is ${rows} × ${rest}. Multiply it too.`],
        [`${rows} + ${cut} + ${rows} + ${rest}`, `That adds the sides. Each part’s area is a multiplication.`],
      ]),
      facts: { t: "which", rows, cut, rest },
      prompt: `Which expression shows the area of the whole rectangle?`,
      fig: (show) => splitFig(rows, cols, cut, { grid: false, products: show }),
      hint: `Each part is a rectangle ${rows} tall. Multiply its sides, then add the two parts.`,
      explain: `The parts are ${rows} × ${cut} and ${rows} × ${rest}: ${rows * cut} + ${rows * rest} = ${area}.`,
    };
  }
  /* a hard fact, broken into two easier ones on a rectangle with no grid */
  return {
    kind: "num",
    unit: "",
    answer: area,
    facts: { t: "fact", rows, cut, rest },
    prompt: `Break ${rows} × ${cols} into ${rows} × ${cut} and ${rows} × ${rest}. What is ${rows} × ${cols}?`,
    fig: (show) => splitFig(rows, cols, cut, { grid: false, products: show }),
    misc: namedMisc(area, [
      [rows * cut, `That’s only ${rows} × ${cut}. Add ${rows} × ${rest} too.`],
      [rows * cut + rest, `The second part is ${rows} × ${rest}, not ${rest}.`],
    ]),
    hint: `${rows} × ${cut} = ${rows * cut}. Find ${rows} × ${rest}, then add.`,
    explain: `${rows} × ${cut} + ${rows} × ${rest} = ${rows * cut} + ${rows * rest} = ${area}. So ${rows} × ${cols} = ${area}.`,
  };
}

/* ---------- Crate Stacker: multiply multiples of ten and larger numbers (Lessons 12–17) ---------- */
/* things that come in packs of a multiple of ten: the pack, and the sizes it comes in */
const TEN_PACKS = [
  { thing: "crayons", pack: "box", packs: "boxes", sizes: [10, 20, 30] },
  { thing: "stickers", pack: "sheet", packs: "sheets", sizes: [10, 20, 30, 40] },
  { thing: "marbles", pack: "bag", packs: "bags", sizes: [20, 30, 40, 50] },
  { thing: "beads", pack: "jar", packs: "jars", sizes: [50, 60, 70, 80, 90] },
  { thing: "blocks", pack: "bucket", packs: "buckets", sizes: [20, 30, 40, 50, 60] },
];
/* things that come in packs of 11 to 25 */
const TEEN_PACKS = [
  { thing: "yo-yos", pack: "box", packs: "boxes", sizes: [12, 15, 16] },
  { thing: "markers", pack: "pack", packs: "packs", sizes: [12, 18, 24] },
  { thing: "toy cars", pack: "case", packs: "cases", sizes: [12, 15, 20, 25] },
  { thing: "balls", pack: "bin", packs: "bins", sizes: [11, 13, 14, 15] },
];
function genMultiply() {
  const variant = R(0, 4),
    [name] = shuffle(KIDS);
  if (variant === 0) {
    /* a one-digit number times a multiple of ten: groups of tens */
    const groups = R(2, 9),
      tens = R(2, 9),
      answer = groups * tens * 10;
    return {
      kind: "num",
      unit: "",
      answer,
      facts: { t: "tens", groups, tens },
      prompt: `What is ${groups} × ${tens * 10}?`,
      fig: () => divideFig(answer, groups, { label: `${groups} groups of ${tens} tens` }),
      misc: namedMisc(answer, [
        [groups * tens, `That’s ${groups * tens} ones. ${groups} × ${tens} tens is ${groups * tens} tens.`],
        [groups + tens * 10, `That’s ${groups} + ${tens * 10}. Multiply.`],
        [groups * tens * 100, `${groups * tens} tens is ${answer}, not ${groups * tens * 100}.`],
      ]),
      hint: `${tens * 10} is ${tens} tens. ${groups} groups of ${tens} tens is ${groups} × ${tens} tens.`,
      explain: `${groups} × ${tens} tens = ${groups * tens} tens, and ${groups * tens} tens is ${answer}. So ${groups} × ${tens * 10} = ${answer}.`,
    };
  }
  if (variant === 1) {
    /* a story: packs of a multiple of ten */
    const kind = pick(TEN_PACKS),
      size = pick(kind.sizes),
      packs = R(2, 9),
      answer = packs * size;
    return {
      kind: "num",
      unit: kind.thing,
      answer,
      facts: { t: "tenPacks", thing: kind.thing, packs, size },
      prompt: `The workshop has ${packs} ${kind.packs} of ${kind.thing}. There are ${size} ${kind.thing} in each ${kind.pack}. How many ${kind.thing} is that?`,
      fig: () => divideFig(answer, packs, { label: `${packs} groups of ${size / 10} tens` }),
      misc: namedMisc(answer, [
        [packs * (size / 10), `That’s ${packs * (size / 10)} ones. It’s ${packs * (size / 10)} tens.`],
        [packs + size, `That’s ${packs} + ${size}. There are ${packs} groups of ${size}: multiply.`],
      ]),
      hint: `${size} is ${size / 10} tens. ${packs} × ${size / 10} tens is how many tens?`,
      explain: `${packs} × ${size / 10} tens = ${packs * (size / 10)} tens. So ${packs} × ${size} = ${answer} ${kind.thing}.`,
    };
  }
  if (variant === 2) {
    /* a one-digit number times a teen or two-digit number, with an area diagram: tens times it, then ones times it */
    let big, small;
    do {
      big = R(11, 49);
      small = R(2, 9);
    } while (big % 10 === 0 || big * small > 100);
    const tensPart = big - (big % 10),
      onesPart = big % 10,
      answer = big * small;
    return {
      kind: "num",
      unit: "",
      answer,
      facts: { t: "teen", big, small },
      prompt: `What is ${small} × ${big}?`,
      fig: (show) => areaModel(big, small, { filled: show ? Infinity : 0 }),
      misc: namedMisc(answer, [
        [small * tensPart + onesPart, `Multiply the ${onesPart} ones too: ${small} × ${onesPart}.`],
        [tensPart + small * onesPart, `Multiply the ${tensPart} too: ${small} × ${tensPart}.`],
        [small + big, `That’s ${small} + ${big}. Multiply.`],
      ]),
      hint: `Break ${big} into ${tensPart} and ${onesPart}. Find ${small} × ${tensPart} and ${small} × ${onesPart}, then add.`,
      explain: `${small} × ${tensPart} = ${small * tensPart} and ${small} × ${onesPart} = ${small * onesPart}. ${small * tensPart} + ${small * onesPart} = ${answer}.`,
    };
  }
  if (variant === 3) {
    /* a story: packs of 11 to 25, with base-ten blocks in groups */
    let kind, size, packs;
    do {
      kind = pick(TEEN_PACKS);
      size = pick(kind.sizes);
      packs = R(2, 8);
    } while (packs * size > 100);
    const answer = packs * size,
      tensPart = size - (size % 10),
      onesPart = size % 10;
    return {
      kind: "num",
      unit: kind.thing,
      answer,
      facts: { t: "teenPacks", thing: kind.thing, packs, size },
      prompt: `${name} stacks ${packs} ${kind.packs} of ${kind.thing}. Each ${kind.pack} has ${size} ${kind.thing}. How many ${kind.thing} is that?`,
      fig: () => divideFig(answer, packs, { label: `${packs} groups of ${size}` }),
      misc: namedMisc(answer, [
        ...(onesPart
          ? [[packs * tensPart + onesPart, `Every ${kind.pack} has ${onesPart} ones. Count them all.`]]
          : []),
        [packs + size, `That’s ${packs} + ${size}. There are ${packs} groups of ${size}: multiply.`],
      ]),
      hint: onesPart
        ? `Count the tens in all the groups, then the ones: ${packs} × ${tensPart} and ${packs} × ${onesPart}.`
        : `${size} is ${size / 10} tens. ${packs} × ${size / 10} tens is how many tens?`,
      explain: onesPart
        ? `${packs} × ${tensPart} = ${packs * tensPart} and ${packs} × ${onesPart} = ${packs * onesPart}. ${packs * tensPart} + ${packs * onesPart} = ${answer} ${kind.thing}.`
        : `${packs} × ${size / 10} tens = ${packs * (size / 10)} tens. So ${packs} × ${size} = ${answer} ${kind.thing}.`,
    };
  }
  /* two steps: packs of a multiple of ten, then some given away or more added */
  const kind = pick(TEN_PACKS.filter((k) => k.sizes[0] <= 40)),
    size = pick(kind.sizes.filter((s) => s <= 40)),
    packs = R(2, 5),
    made = packs * size,
    gave = R(0, 1),
    /* given away: a multiple of 5 that leaves at least 10; or a few more */
    change = gave ? R(1, made / 5 - 2) * 5 : R(2, 19),
    answer = gave ? made - change : made + change;
  return {
    kind: "num",
    unit: kind.thing,
    answer,
    facts: { t: "twoTimes", packs, size, change, gave },
    prompt: gave
      ? `${name} has ${packs} ${kind.packs} of ${size} ${kind.thing} and gives ${change} ${kind.thing} away. How many ${kind.thing} does ${name} have left?`
      : `${name} has ${packs} ${kind.packs} of ${size} ${kind.thing} and gets ${change} more. How many ${kind.thing} does ${name} have now?`,
    fig: (show) =>
      timesTape([{ label: kind.packs, times: packs, each: size, total: show ? made : "?" }], {
        label: `Tape diagram: ${packs} ${kind.packs} of ${size}`,
      }),
    misc: namedMisc(answer, [
      [made, `That’s ${packs} × ${size}. Now ${gave ? `take away the ${change}` : `add the ${change}`}.`],
      [gave ? made + change : made - change, gave ? `${name} gives them away: subtract.` : `${name} gets more: add.`],
      [gave ? packs + size - change : packs + size + change, `There are ${packs} groups of ${size}: multiply first.`],
    ]),
    hint: `First find ${packs} × ${size}. Then ${gave ? "subtract" : "add"} ${change}.`,
    explain: `${packs} × ${size} = ${made}. ${made} ${gave ? "−" : "+"} ${change} = ${answer} ${kind.thing}.`,
  };
}

/* ---------- Shipping Dock: divide larger numbers (Lessons 18–21) ---------- */
/* a division with a two-digit answer: n ÷ divisor = quotient, 11 to 25, n under 100, and the divisor from minDivisor to
   maxDivisor */
function bigDivision(maxDivisor = 6, minDivisor = 2) {
  let divisor, quotient;
  do {
    divisor = R(minDivisor, maxDivisor);
    quotient = R(11, 25);
  } while (divisor * quotient > 99 || quotient % 10 === 0);
  return { divisor, quotient, n: divisor * quotient };
}
function genDivide() {
  const variant = R(0, 4),
    [name] = shuffle(KIDS);
  if (variant === 0) {
    /* share base-ten blocks into equal groups; the tens don't always share evenly, so a ten is traded for 10 ones */
    const { divisor, quotient, n } = bigDivision(5),
      tens = Math.floor(n / 10);
    return {
      kind: "num",
      unit: "blocks",
      answer: quotient,
      facts: { t: "share", n, divisor },
      prompt: `${name} shares ${n} blocks equally into ${divisor} boxes. How many blocks go in each box?`,
      fig: (show) => divideFig(n, divisor, { split: show }),
      misc: namedMisc(quotient, [
        [divisor, `${divisor} is how many boxes. How many blocks are in each one?`],
        [n - divisor, `That’s ${n} − ${divisor}. Share the blocks into ${divisor} equal groups.`],
        ...(tens % divisor
          ? [
              [
                Math.floor(tens / divisor) * 10 + Math.floor((n % 10) / divisor),
                `${tens % divisor} ten${tens % divisor === 1 ? " is" : "s are"} left after sharing the tens. Trade for ones and share those too.`,
              ],
            ]
          : []),
      ]),
      hint:
        tens % divisor
          ? `Share the tens first. Trade the ten${tens % divisor === 1 ? "" : "s"} left over for ones, then share the ones.`
          : `Share the ${tens} tens, then the ${n % 10} ones.`,
      explain: `${divisor} groups of ${quotient} make ${n}: ${divisor} × ${quotient} = ${n}. So ${n} ÷ ${divisor} = ${quotient}.`,
    };
  }
  if (variant === 1) {
    /* break the number apart into ten groups and the rest */
    const { divisor, quotient, n } = bigDivision(),
      tensPart = divisor * 10,
      restPart = n - tensPart;
    return {
      kind: "num",
      unit: "",
      answer: quotient,
      facts: { t: "split", n, divisor, parts: [tensPart, restPart] },
      prompt: `Break ${n} into ${tensPart} and ${restPart} to find ${n} ÷ ${divisor}. What is ${n} ÷ ${divisor}?`,
      fig: (show) =>
        show
          ? splitFig(divisor, quotient, 10, {
              grid: false,
              products: true,
              label: `A rectangle ${divisor} tall, cut into ${divisor} × 10 = ${tensPart} and ${divisor} × ${quotient - 10} = ${restPart}`,
            })
          : divideFig(n, divisor, { split: false }),
      misc: namedMisc(quotient, [
        [10 + restPart, `${restPart} ÷ ${divisor} is ${restPart / divisor}, not ${restPart}. Divide both parts.`],
        [divisor + restPart / divisor, `${tensPart} ÷ ${divisor} is 10, since ${divisor} × 10 = ${tensPart}.`],
      ]),
      hint: `${tensPart} ÷ ${divisor} = 10. What is ${restPart} ÷ ${divisor}? Add the two.`,
      explain: `${tensPart} ÷ ${divisor} = 10 and ${restPart} ÷ ${divisor} = ${restPart / divisor}. 10 + ${restPart / divisor} = ${quotient}, so ${n} ÷ ${divisor} = ${quotient}.`,
    };
  }
  if (variant === 2) {
    /* a story: groups of a size (how many groups) or shared into a number of groups (how many in each) */
    const byGroups = R(0, 1),
      { divisor, quotient, n } = bigDivision(byGroups ? 5 : 4, byGroups ? 3 : 2),
      kind = byGroups
        ? pick([
            {
              thing: "marbles",
              say: (size) => `It puts ${size} marbles in each bag. How many bags does it fill?`,
              unit: "bags",
            },
            {
              thing: "balls",
              say: (size) => `It puts ${size} balls in each bin. How many bins does it fill?`,
              unit: "bins",
            },
          ])
        : pick([
            {
              thing: "crayons",
              say: (groups) => `It shares them equally into ${groups} boxes. How many crayons go in each box?`,
              unit: "crayons",
            },
            {
              thing: "beads",
              say: (groups) => `It shares them equally into ${groups} jars. How many beads go in each jar?`,
              unit: "beads",
            },
          ]);
    return {
      kind: "num",
      unit: kind.unit,
      answer: quotient,
      facts: { t: "bigStory", n, divisor, byGroups: !!byGroups },
      prompt: `The workshop has ${n} ${kind.thing}. ${kind.say(divisor)}`,
      fig: (show) =>
        splitFig(divisor, quotient, 10, {
          grid: false,
          products: show,
          ask: show ? null : "right",
          label: `A rectangle ${divisor} tall with an area of ${n}, cut into ${divisor} × 10 and ${divisor} × ${show ? quotient - 10 : "?"}`,
        }),
      misc: namedMisc(quotient, [
        [n - divisor, `That’s ${n} − ${divisor}. Divide: ${divisor} times what is ${n}?`],
        [quotient - 10, `That’s only the second part. Add the 10 from ${divisor} × 10.`],
      ]),
      hint: `${divisor} × 10 = ${divisor * 10}. ${divisor} times what is the other ${n - divisor * 10}?`,
      explain: `${divisor} × 10 = ${divisor * 10} and ${divisor} × ${quotient - 10} = ${n - divisor * 10}. So ${n} ÷ ${divisor} = ${quotient} ${kind.unit}.`,
    };
  }
  if (variant === 3) {
    /* which way to break apart a division works? Both parts must be divided by the same number */
    const { divisor, quotient, n } = bigDivision(),
      tensPart = divisor * 10,
      restPart = n - tensPart,
      half = divisor % 2 === 0 ? divisor / 2 : 0;
    const wrongs = [
      [`${tensPart} ÷ ${divisor} + ${restPart}`, `Divide the ${restPart} by ${divisor} too.`],
      [`${tensPart} ÷ 10 + ${restPart} ÷ ${divisor}`, `Divide each part by the same number, ${divisor}.`],
      ...(n % 2 === 0
        ? [[`${n} ÷ 2 + ${n} ÷ 2`, `Half of ${n} plus half of ${n} is all of ${n}. Divide by ${divisor}.`]]
        : []),
      ...(half && half !== 1
        ? [
            [
              `${tensPart} ÷ ${half} + ${restPart} ÷ ${half}`,
              `That divides by ${half}. Divide each part by ${divisor}.`,
            ],
          ]
        : []),
    ];
    return {
      ...mcOf([[`${tensPart} ÷ ${divisor} + ${restPart} ÷ ${divisor}`, null], ...shuffle(wrongs).slice(0, 2)]),
      facts: { t: "whichSplit", n, divisor },
      prompt: `Which is a way to find ${n} ÷ ${divisor}?`,
      fig: (show) => divideFig(n, divisor, { split: show }),
      hint: `Break ${n} into parts you can divide by ${divisor}, like ${tensPart} and ${restPart}. Divide each part by ${divisor}.`,
      explain: `${tensPart} ÷ ${divisor} = 10 and ${restPart} ÷ ${divisor} = ${restPart / divisor}, so ${n} ÷ ${divisor} = ${quotient}.`,
    };
  }
  /* two steps: multiply to find how many in all, then share them equally */
  let packs, size, shops;
  do {
    packs = R(2, 6);
    size = pick([6, 8, 10, 12, 15, 20]);
    shops = R(2, 5);
  } while (packs * size > 100 || (packs * size) % shops || packs * size < 20 || shops === packs);
  const made = packs * size,
    answer = made / shops;
  return {
    kind: "num",
    unit: "toy cars",
    answer,
    facts: { t: "twoDivide", packs, size, shops },
    prompt: `The workshop makes ${packs} boxes of ${size} toy cars. It shares the cars equally among ${shops} toy shops. How many cars does each shop get?`,
    fig: (show) =>
      timesTape([{ label: "boxes", times: packs, each: size, total: show ? made : "?" }], {
        label: `Tape diagram: ${packs} boxes of ${size}`,
      }),
    misc: namedMisc(answer, [
      [made, `That’s all the cars, ${packs} × ${size}. Now share them among ${shops} shops.`],
      [size / shops, `First find all the cars: ${packs} × ${size}.`],
      [made - shops, `That’s ${made} − ${shops}. Share the ${made} cars equally: divide.`],
    ]),
    hint: `First find all the cars: ${packs} × ${size}. Then divide by ${shops}.`,
    explain: `${packs} × ${size} = ${made} cars. ${made} ÷ ${shops} = ${answer} cars for each shop.`,
  };
}

/* The Big Order deals from every station */
const genBoss = () => pick([genGroups, genUnknown, genTable, genRectangles, genMultiply, genDivide])();

const ZONES = [
  {
    id: "groups",
    name: "Packing Line",
    lessons: "Lessons 1–5",
    blurb: "Pack toys in equal groups: find how many groups or how many in each, and match stories to ÷ expressions.",
    gen: genGroups,
  },
  {
    id: "unknown",
    name: "Missing Pieces",
    lessons: "Lessons 6–8",
    blurb: "Find the missing factor, use a product you know to divide, and match multiplication and division facts.",
    gen: genUnknown,
  },
  {
    id: "table",
    name: "Puzzle Wall",
    lessons: "Lesson 9",
    blurb: "Find patterns in the multiplication table: turnarounds, counting on, doubles, and odd and even products.",
    gen: genTable,
  },
  {
    id: "rectangles",
    name: "Block Room",
    lessons: "Lessons 10–11",
    blurb: "Break a rectangle into two parts to multiply, with a grid and without one.",
    gen: genRectangles,
  },
  {
    id: "multiply",
    name: "Crate Stacker",
    lessons: "Lessons 12–17",
    blurb: "Multiply by multiples of ten, multiply teen and larger numbers, and solve stories with two steps.",
    gen: genMultiply,
  },
  {
    id: "divide",
    name: "Shipping Dock",
    lessons: "Lessons 18–21",
    blurb: "Share base-ten blocks, break a number apart to divide, and solve stories with the four operations.",
    gen: genDivide,
  },
  {
    id: "boss",
    name: "The Big Order",
    lessons: "All lessons",
    blurb: "Fill the big order! Every right answer loads a box onto the truck.",
    gen: genBoss,
  },
];

/* the delivery truck with `loaded` of its 10 boxes on it (the boss icon draws all of them) */
const truck = (loaded) =>
  '<rect x="4" y="36" width="40" height="14" rx="2" fill="#6f9bff" stroke="#f3f6fb" stroke-width="1.5"/>' +
  '<path d="M44,50V36H52L60,44V50Z" fill="#ff7b7b" stroke="#f3f6fb" stroke-width="1.5"/>' +
  '<circle cx="14" cy="52" r="5" fill="#0a2340" stroke="#f3f6fb" stroke-width="1.5"/><circle cx="50" cy="52" r="5" fill="#0a2340" stroke="#f3f6fb" stroke-width="1.5"/>' +
  range(10)
    .map((i) => {
      const x = 5 + (i % 5) * 7.6,
        y = 28 - Math.floor(i / 5) * 8;
      return `<rect x="${x}" y="${y}" width="7" height="7.5" fill="${i < loaded ? "#ffc93c" : "rgba(255,255,255,.12)"}" stroke="${i < loaded ? "#b8860b" : "none"}"/>`;
    })
    .join("");
/* an icon's line of text, centered at x, y: `size` pixels, in `fill` */
const iconText = (x, y, text, size, fill) =>
  `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="700" text-anchor="middle" font-family="monospace">${text}</text>`;
const ICON = {
  groups:
    '<circle cx="16" cy="22" r="11" fill="none" stroke="#f3f6fb" stroke-width="2"/><circle cx="48" cy="22" r="11" fill="none" stroke="#f3f6fb" stroke-width="2"/>' +
    '<circle cx="12" cy="22" r="3" fill="#ffc93c"/><circle cx="20" cy="22" r="3" fill="#ffc93c"/><circle cx="44" cy="22" r="3" fill="#ffc93c"/><circle cx="52" cy="22" r="3" fill="#ffc93c"/>' +
    iconText(32, 54, "4 ÷ 2", 13, "#7fe3ff"),
  unknown:
    iconText(32, 30, "6 × ?", 15, "#f3f6fb") +
    iconText(32, 52, "= 42", 15, "#ffc93c") +
    '<path d="M42,8l6,4-6,4" fill="none" stroke="#7fe3ff" stroke-width="2"/>',
  table:
    '<rect x="8" y="8" width="48" height="48" fill="rgba(9,32,61,.6)" stroke="#f3f6fb" stroke-width="1.5"/>' +
    '<path d="M24,8V56M40,8V56M8,24H56M8,40H56" stroke="rgba(243,246,251,.45)"/>' +
    '<rect x="24" y="40" width="16" height="16" fill="#ffc93c"/><rect x="40" y="24" width="16" height="16" fill="#7fe3ff"/>',
  rectangles:
    '<rect x="6" y="14" width="30" height="36" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2"/><rect x="36" y="14" width="22" height="36" fill="rgba(127,227,255,.4)" stroke="#7fe3ff" stroke-width="2"/>' +
    '<path d="M36,10V54" stroke="#ff8ac4" stroke-width="2.5" stroke-dasharray="4 3"/>' +
    iconText(21, 36, "5", 12, "#0a2340") +
    iconText(47, 36, "2", 12, "#0a2340"),
  multiply:
    '<rect x="8" y="34" width="22" height="20" fill="#c97b4b" stroke="#f3f6fb" stroke-width="1.5"/><rect x="34" y="34" width="22" height="20" fill="#c97b4b" stroke="#f3f6fb" stroke-width="1.5"/>' +
    '<rect x="20" y="12" width="22" height="20" fill="#c97b4b" stroke="#f3f6fb" stroke-width="1.5"/>' +
    iconText(31, 26, "30", 10, "#ffc93c"),
  divide:
    '<path d="M4,46H60" stroke="#7fe3ff" stroke-width="2.5"/><rect x="10" y="22" width="16" height="22" fill="#c97b4b" stroke="#f3f6fb" stroke-width="1.5"/>' +
    '<rect x="38" y="22" width="16" height="22" fill="#c97b4b" stroke="#f3f6fb" stroke-width="1.5"/>' +
    iconText(32, 16, "84 ÷ 4", 11, "#f3f6fb") +
    iconText(32, 60, "21 each", 10, "#ffc93c"),
  boss: truck(10),
};
