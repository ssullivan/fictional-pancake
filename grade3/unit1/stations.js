/* Orchard Market (Grade 3 Unit 1): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Picture graphs and bar graphs come from shared/graphs.js; tape diagrams from shared/numlines.js; equal groups, arrays, and
   hop lines from shared/multiply.js; mcOf and miscOf from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* items joined with commas: "2, 4, 6" */
const list = (items) => items.join(", ");
/* 1 to n */
const upTo = (n) => range(n).map((i) => i + 1);
/* n and the word for it: "1 pie", "3 pies" (plural: the word for more than one) */
const pl = (n, word, plural = word + "s") => `${n} ${n === 1 ? word : plural}`;
/* "4 + 4 + 4": n equal addends of a */
const addends = (n, a) => Array(n).fill(a).join(" + ");
/* counting by n, k times: "3, 6, 9, 12" */
const countBy = (n, k) => list(upTo(k).map((i) => i * n));
const COLORS = ["red", "blue", "green", "yellow"];

/* ---------- Picture Barn and Bar Silo: scaled graphs (Lessons 1–8) ---------- */
/* what the market counted: a title, what each count is (one, many), and the rows */
const DATA = [
  { title: "Pies sold at the market", one: "pie", many: "pies", rows: ["Monday", "Tuesday", "Wednesday", "Thursday"] },
  { title: "Jars of honey sold", one: "jar", many: "jars", rows: ["Monday", "Tuesday", "Wednesday", "Thursday"] },
  { title: "Apples picked by each team", one: "apple", many: "apples", rows: ["Team A", "Team B", "Team C", "Team D"] },
  {
    title: "Eggs collected at the farm",
    one: "egg",
    many: "eggs",
    rows: ["Monday", "Tuesday", "Wednesday", "Thursday"],
  },
  { title: "Favorite fruit at our school", one: "vote", many: "votes", rows: ["Apples", "Pears", "Plums", "Peaches"] },
];
const SHORT = { Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu" };
/* a row's label as the graph writes it: days are shortened */
const short = (label) => SHORT[label] || label;
/* n counts on a scale of `scale`, up to `most` scale steps; half a step (scale 2 or 10) when halves. The counts all differ. */
function values(n, scale, most, halves) {
  const step = halves ? scale / 2 : scale,
    top = (most * scale) / step;
  let counts;
  do {
    counts = range(n).map(() => R(1, top) * step);
  } while (new Set(counts).size < n);
  return counts;
}
/* a data set: [data, rows as {label, n, c, pic}], n rows in DATA's order */
function dataSet(n, scale, most, halves) {
  const data = pick(DATA),
    counts = values(n, scale, most, halves),
    labels = shuffle(data.rows)
      .slice(0, n)
      .sort((a, b) => data.rows.indexOf(a) - data.rows.indexOf(b));
  return [data, labels.map((label, i) => ({ label, n: counts[i], c: COLORS[i], pic: "note" }))];
}
/* the rows with their labels as the graph writes them */
const figRows = (rows) => rows.map((row) => ({ ...row, label: short(row.label) }));
/* the top of a bar graph's scale: room for the tallest bar and one more line, and at least 4 lines */
const topOf = (rows, scale) =>
  Math.max(scale * 4, Math.ceil(Math.max(...rows.map((row) => row.n)) / scale) * scale + scale);
/* "halfway between 20 and 30", or "on the 40 line" */
const onScale = (value, scale) =>
  value % scale
    ? `halfway between ${value - (value % scale)} and ${value - (value % scale) + scale}`
    : `on the ${value} line`;

function genPics() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* how many a row shows, with half pictures on scales of 2 and 10 */
    /* not a row whose count is its number of pictures (half a picture of 2 is 1) */
    const scale = pick([2, 5, 10]),
      halves = scale !== 5 && Math.random() < 0.6;
    let data, rows, i;
    do {
      [data, rows] = dataSet(R(3, 4), scale, scale === 10 ? 8 : 10, halves);
      /* the rows a student can't read by counting pictures, and those of them that end in half a picture */
      const notPictures = range(rows.length).filter((j) => Math.ceil(rows[j].n / scale) !== rows[j].n),
        withHalf = notPictures.filter((j) => rows[j].n % scale);
      i = halves && withHalf.length ? pick(withHalf) : notPictures.length ? pick(notPictures) : -1;
    } while (i < 0);
    const row = rows[i],
      whole = Math.floor(row.n / scale),
      half = row.n % scale;
    const mistakes = [[whole + (half ? 1 : 0), `That’s the number of pictures. Each picture shows ${scale}.`]];
    if (half)
      mistakes.push(
        [whole * scale, `Don’t forget the half picture. It shows ${half} more.`],
        [(whole + 1) * scale, `The last picture is only half, so it shows ${half}, not ${scale}.`],
      );
    return {
      kind: "num",
      unit: data.many,
      answer: row.n,
      prompt: `Each picture shows ${pl(scale, data.one, data.many)}. How many ${data.many} does the graph show for ${row.label}?`,
      fig: (show) =>
        picGraph(figRows(rows), { scale, unit: pl(scale, data.one, data.many), title: data.title, hi: show ? i : -1 }),
      misc: miscOf(row.n, mistakes),
      hint: `Count by ${scale}s for the whole pictures${half ? `. Half a picture is ${half}.` : "."}`,
      explain: `${row.label} has ${half ? `${whole} and a half pictures` : pl(whole, "picture")}. Count by ${scale}s: ${countBy(scale, whole)}${half ? `, and ${half} more` : ""}. That’s ${row.n}.`,
    };
  }
  if (variant === 1) {
    /* tap the row that shows n */
    const scale = pick([2, 5, 10]),
      halves = scale !== 5 && Math.random() < 0.5,
      [data, rows] = dataSet(4, scale, scale === 10 ? 8 : 10, halves),
      i = R(0, 3),
      row = rows[i],
      why = {};
    rows.forEach((other, j) => {
      if (j !== i) why[j] = `${other.label} shows ${other.n}. Count by ${scale}s for each picture.`;
    });
    return {
      kind: "tap",
      answer: String(i),
      why,
      prompt: `Each picture shows ${pl(scale, data.one, data.many)}. Tap the row that shows ${row.n} ${data.many}.`,
      fig: (show) =>
        picGraph(figRows(rows), { scale, unit: pl(scale, data.one, data.many), title: data.title, tap: "cand" }),
      hint: `${row.n} is ${row.n % scale ? `${Math.floor(row.n / scale)} and a half` : row.n / scale} ${row.n / scale === 1 ? "picture" : "pictures"}: count by ${scale}s until you reach ${row.n}.`,
      explain: `${row.label} has ${row.n % scale ? `${Math.floor(row.n / scale)} and a half pictures` : pl(row.n / scale, "picture")}, and each shows ${scale}. That’s ${row.n}.`,
    };
  }
  if (variant === 2) {
    /* how many pictures to draw */
    /* never as many pictures as each one shows (5 pictures of 5), where the scale is the answer */
    const scale = pick([2, 5, 10]),
      data = pick(DATA),
      label = pick(data.rows);
    let pictures;
    do pictures = R(2, 8);
    while (pictures === scale);
    const n = pictures * scale;
    return {
      kind: "num",
      unit: "pictures",
      answer: pictures,
      prompt: `${data.title}: ${n} ${data.many} on ${label}. In a picture graph where each picture shows ${scale}, how many pictures go in the ${label} row?`,
      fig: (show) =>
        picGraph([{ label: short(label), n: show ? n : 0, pic: "note", c: "green" }], {
          scale,
          max: n,
          unit: pl(scale, data.one, data.many),
          title: data.title,
        }),
      misc: miscOf(pictures, [
        [n, `That’s the number of ${data.many}. Each picture shows ${scale}.`],
        [scale, `That’s what one picture shows. How many ${scale}s make ${n}?`],
        [n - scale, `You subtracted. Count by ${scale}s to ${n}.`],
      ]),
      hint: `Count by ${scale}s to ${n}. Each number you say is one picture.`,
      explain: `Count by ${scale}s: ${countBy(scale, pictures)}. That’s ${pictures} pictures.`,
    };
  }
  /* how many more, from a picture graph: two of the three rows, the bigger one first */
  const scale = pick([2, 5, 10]),
    [data, rows] = dataSet(3, scale, scale === 10 ? 8 : 10, false),
    [a, b] = shuffle([0, 1, 2])
      .slice(0, 2)
      .sort((x, y) => rows[y].n - rows[x].n),
    more = rows[a],
    fewer = rows[b],
    diff = more.n - fewer.n;
  return {
    kind: "num",
    unit: data.many,
    answer: diff,
    prompt: `Each picture shows ${pl(scale, data.one, data.many)}. How many more ${data.many} for ${more.label} than for ${fewer.label}?`,
    fig: (show) => picGraph(figRows(rows), { scale, unit: pl(scale, data.one, data.many), title: data.title }),
    misc: miscOf(diff, [
      [more.n + fewer.n, `That’s both rows together. How many more means subtract: ${more.n} − ${fewer.n}.`],
      [diff / scale, `That’s how many more pictures. Each picture shows ${scale}.`],
    ]),
    hint: `Find each row’s number first: count by ${scale}s. Then subtract.`,
    explain: `${more.label}: ${more.n}. ${fewer.label}: ${fewer.n}. ${more.n} − ${fewer.n} = ${diff}.`,
  };
}

function genBars() {
  const variant = R(0, 4);
  if (variant === 0) {
    /* read a bar, maybe halfway between two lines */
    const scale = pick([2, 5, 10]),
      halves = scale !== 5 && Math.random() < 0.6,
      [data, rows] = dataSet(R(3, 4), scale, 8, halves),
      i =
        halves && rows.some((row) => row.n % scale)
          ? pick(rows.map((row, j) => j).filter((j) => rows[j].n % scale))
          : R(0, rows.length - 1),
      row = rows[i],
      top = topOf(rows, scale);
    /* below: the line under the top of the bar */
    const below = row.n - (row.n % scale),
      mistakes =
        row.n % scale
          ? [
              [below, `The bar goes past ${below}. It ends ${onScale(row.n, scale)}.`],
              [below + scale, `The bar doesn’t reach ${below + scale}. It ends ${onScale(row.n, scale)}.`],
            ]
          : [
              [row.n / scale, `That’s the number of spaces. Each space is ${scale}.`],
              [row.n + scale, "Read the number on the line where the bar ends."],
            ];
    return {
      kind: "num",
      unit: data.many,
      answer: row.n,
      prompt: `How many ${data.many} does the bar for ${row.label} show?`,
      fig: (show) => barGraph(figRows(rows), { max: top, scale, uh: 32, title: data.title, hi: show ? i : -1 }),
      misc: miscOf(row.n, mistakes),
      hint: `The lines go up by ${scale}s. Find where the top of the ${short(row.label)} bar is.`,
      explain: `The lines go up by ${scale}s. The ${short(row.label)} bar ends ${onScale(row.n, scale)}, so it shows ${row.n}.`,
    };
  }
  if (variant === 1 || variant === 2) {
    /* how many more or fewer (variant 1), or how many in all (variant 2): two of the three bars, the bigger one first */
    const scale = pick([5, 10]),
      [data, rows] = dataSet(3, scale, variant === 2 ? 5 : 8, false),
      top = topOf(rows, scale),
      [a, b] = shuffle([0, 1, 2])
        .slice(0, 2)
        .sort((x, y) => rows[y].n - rows[x].n),
      more = rows[a],
      fewer = rows[b],
      diff = more.n - fewer.n,
      sum = more.n + fewer.n;
    if (variant === 1) {
      const askFewer = Math.random() < 0.5;
      return {
        kind: "num",
        unit: data.many,
        answer: diff,
        prompt: askFewer
          ? `How many fewer ${data.many} for ${fewer.label} than for ${more.label}?`
          : `How many more ${data.many} for ${more.label} than for ${fewer.label}?`,
        fig: (show) => barGraph(figRows(rows), { max: top, scale, uh: 32, title: data.title, hi: show ? [a, b] : -1 }),
        misc: miscOf(diff, [
          [
            sum,
            `That’s both bars together. How many ${askFewer ? "fewer" : "more"} means subtract: ${more.n} − ${fewer.n}.`,
          ],
          [diff / scale, `That’s how many spaces taller. Each space is ${scale}.`],
        ]),
        hint: `Read both bars, then subtract the smaller number from the bigger one.`,
        explain: `${more.label}: ${more.n}. ${fewer.label}: ${fewer.n}. ${more.n} − ${fewer.n} = ${diff}.`,
      };
    }
    return {
      kind: "num",
      unit: data.many,
      answer: sum,
      prompt: `How many ${data.many} for ${fewer.label} and ${more.label} in all?`,
      fig: (show) => barGraph(figRows(rows), { max: top, scale, uh: 32, title: data.title, hi: show ? [a, b] : -1 }),
      misc: miscOf(sum, [
        [diff, `That’s how many more for ${more.label}. In all means add.`],
        [
          rows.reduce((total, row) => total + row.n, 0),
          `That’s all three bars. Add just ${fewer.label} and ${more.label}.`,
        ],
      ]),
      hint: "Read both bars, then add.",
      explain: `${fewer.label}: ${fewer.n}. ${more.label}: ${more.n}. ${fewer.n} + ${more.n} = ${sum}.`,
    };
  }
  if (variant === 3) {
    /* tap the bar that shows n */
    const scale = pick([2, 5, 10]),
      [data, rows] = dataSet(4, scale, 8, scale !== 5 && Math.random() < 0.5),
      top = topOf(rows, scale),
      i = R(0, 3),
      row = rows[i],
      why = {};
    rows.forEach((other, j) => {
      if (j !== i) why[j] = `That bar shows ${other.n}. The lines go up by ${scale}s.`;
    });
    return {
      kind: "tap",
      answer: String(i),
      why,
      prompt: `Tap the bar that shows ${row.n} ${data.many}.`,
      fig: (show) => barGraph(figRows(rows), { max: top, scale, uh: 32, title: data.title, tap: "cand" }),
      hint: `The lines go up by ${scale}s. Find ${row.n} on the side, then look across.`,
      explain: `The ${short(row.label)} bar ends ${onScale(row.n, scale)}. That’s ${row.n}.`,
    };
  }
  /* choose the best scale: the biggest of 2, 5, 10 that every number fits */
  /* three different counts, big enough that a smaller scale is too tall, and not all fitting a bigger scale */
  const best = pick([2, 5, 10]);
  let counts;
  do {
    counts =
      best === 10
        ? range(3).map(() => R(1, 9) * 10)
        : best === 5
          ? range(3).map(() => R(1, 10) * 5)
          : range(3).map(() => R(1, 10) * 2);
  } while (
    new Set(counts).size < 3 ||
    Math.max(...counts) < (best === 10 ? 60 : best === 5 ? 25 : 10) ||
    (best === 5 && counts.every((x) => x % 10 === 0)) ||
    (best === 2 && counts.every((x) => x % 5 === 0))
  );
  /* offBetween(scale): the counts that would end between lines on that scale */
  const data = pick(DATA),
    most = Math.max(...counts),
    offBetween = (scale) => counts.filter((x) => x % scale),
    wrong = best === 10 ? [1, 2] : best === 5 ? [1, 10] : [5, 10];
  const why = (scale) =>
    offBetween(scale).length
      ? `${list(offBetween(scale))} would end between lines, so ${offBetween(scale).length > 1 ? "they’re" : "it’s"} harder to read.`
      : `That needs ${most / scale} spaces. The graph would be much too tall.`;
  return {
    ...mcOf([[`A line every ${best}`, null], ...wrong.map((scale) => [`A line every ${scale}`, why(scale)])]),
    prompt: `${data.title}: ${list(counts.map((x, i) => `${data.rows[i]} ${x}`))}. Which scale is best for a bar graph?`,
    hint: "A good scale makes every bar end on a line, without too many lines to count.",
    explain: `${list(counts)} are all ${best === 10 ? "tens" : `multiples of ${best}`}. With a line every ${best}, every bar ends on a line, and there are ${most / best} spaces.`,
  };
}

/* ---------- Basket Row: equal groups, expressions (Lessons 9–12) ---------- */
/* equal-group stories: groups (one, many), the things in them, the numbers in each that make sense, and how to say it */
const GROUPS = [
  { one: "basket", many: "baskets", things: "apples", n: upTo(10).slice(1), each: "in each basket" },
  { one: "bag", many: "bags", things: "oranges", n: [3, 4, 5, 6, 8, 10], each: "in each bag" },
  { one: "box", many: "boxes", things: "peaches", n: [4, 6, 8, 10], each: "in each box" },
  { one: "vase", many: "vases", things: "flowers", n: upTo(10).slice(1), each: "in each vase" },
  { one: "plate", many: "plates", things: "strawberries", n: upTo(10).slice(1), each: "on each plate" },
  { one: "pack", many: "packs", things: "juice boxes", n: [3, 4, 6, 8], each: "in each pack" },
  { one: "spider", many: "spiders", things: "legs", n: [8], each: "on each spider" },
  { one: "car", many: "cars", things: "wheels", n: [4], each: "on each car" },
  { one: "tricycle", many: "tricycles", things: "wheels", n: [3], each: "on each tricycle" },
  { one: "hand", many: "hands", things: "fingers", n: [5], each: "on each hand" },
  { one: "cow", many: "cows", things: "legs", n: [4], each: "on each cow" },
  { one: "ant", many: "ants", things: "legs", n: [6], each: "on each ant" },
];
/* A story and its numbers: groups of perGroup (never as many groups as in each), making total. setting is its GROUPS entry,
   and say the story ("4 bags with 6 oranges in each bag"). containers: only groups things go in (bags, not spiders). */
function story(containers) {
  const setting = pick(containers ? GROUPS.filter((entry) => entry.each.startsWith("in")) : GROUPS),
    perGroup = pick(setting.n);
  let groups;
  /* hands come in pairs */
  do {
    groups = R(2, setting.many === "hands" ? 10 : 9);
  } while (groups === perGroup || (setting.many === "hands" && groups % 2));
  return {
    setting,
    groups,
    perGroup,
    total: groups * perGroup,
    say: `${groups} ${setting.many} with ${perGroup} ${setting.things} ${setting.each}`,
  };
}
/* a tape diagram: `groups` equal parts of perGroup, with total written above it */
const tape = (groups, perGroup, total, label) =>
  partWhole(
    range(groups).map(() => ({ n: 1, show: perGroup })),
    total,
    label || `Tape diagram: ${groups} equal parts of ${perGroup}`,
  );
function genGroups() {
  const variant = R(0, 3),
    { setting, groups, perGroup, total, say } = story(),
    { many, things, each } = setting;
  if (variant === 0) {
    /* count equal groups in a picture */
    return {
      kind: "num",
      unit: things,
      answer: total,
      prompt: `There are ${say}. How many ${things} are there in all?`,
      fig: (show) => groupsFig(groups, perGroup, { label: `${groups} circles with ${perGroup} dots in each` }),
      misc: miscOf(total, [
        [groups + perGroup, `You added ${groups} + ${perGroup}. There are ${groups} groups of ${perGroup}.`],
        [groups, `That’s the number of ${many}. Count the ${things}.`],
        [perGroup, `That’s the ${things} ${each}. There are ${groups} ${many}.`],
        [(groups - 1) * perGroup, `That’s ${pl(groups - 1, "group")}. Count the ${many} again.`],
      ]),
      hint: `Count by ${perGroup}s, once for each of the ${groups} ${many}.`,
      explain: `${groups} groups of ${perGroup}: ${countBy(perGroup, groups)}. ${groups} × ${perGroup} = ${total}.`,
    };
  }
  if (variant === 1) {
    /* which expression matches the story */
    return {
      ...mcOf([
        [`${groups} × ${perGroup}`, null],
        [
          `${perGroup} × ${groups}`,
          `That’s ${perGroup} groups of ${groups}. There are ${groups} ${many}, with ${perGroup} ${each}.`,
        ],
        [`${groups} + ${perGroup}`, `That adds. For equal groups, multiply: ${groups} groups of ${perGroup}.`],
      ]),
      prompt: `There are ${say}. Which expression matches?`,
      fig: (show) => groupsFig(groups, perGroup, { label: `${groups} circles with ${perGroup} dots in each` }),
      hint: `The first number is how many groups. The second is how many in each group.`,
      explain: `${groups} ${many} are ${groups} groups, with ${perGroup} ${each}: ${groups} × ${perGroup}.`,
    };
  }
  if (variant === 2) {
    /* which diagram matches the story */
    return {
      ...mcOf(
        [
          [tape(groups, perGroup, "?"), null],
          [
            tape(perGroup, groups, "?"),
            `That’s ${perGroup} groups of ${groups}. There are ${groups} ${many}, so the diagram needs ${groups} parts.`,
          ],
          [
            partWhole(
              [
                { n: groups, show: groups },
                { n: perGroup, show: perGroup },
              ],
              "?",
              "Tape diagram with 2 parts",
            ),
            `That’s just ${groups} and ${perGroup}. Each of the ${groups} ${many} has ${perGroup}.`,
          ],
        ],
        { stack: true },
      ),
      prompt: `There are ${say}. Which diagram matches?`,
      hint: `Look for one part for each of the ${many}, with ${perGroup} in each part.`,
      explain: `The diagram has ${groups} equal parts, one for each of the ${many}, and each part is ${perGroup}.`,
    };
  }
  /* solve the story; the drawing comes with the hint */
  return {
    kind: "num",
    unit: things,
    answer: total,
    prompt: `There are ${say}. How many ${things} are there?`,
    fig: (show) =>
      show
        ? groupsFig(groups, perGroup, { label: `${groups} circles with ${perGroup} dots in each` })
        : tape(groups, perGroup, "?"),
    misc: miscOf(total, [
      [groups + perGroup, `You added. ${groups} groups of ${perGroup} is ${groups} × ${perGroup}.`],
      [(groups + 1) * perGroup, `That’s ${groups + 1} groups. There are ${groups} ${many}.`],
      [(groups - 1) * perGroup, `That’s ${pl(groups - 1, "group")}. There are ${groups} ${many}.`],
    ]),
    hint: `${groups} × ${perGroup}: count by ${perGroup}s ${groups} times.`,
    explain: `${groups} × ${perGroup} = ${total}. Count by ${perGroup}s: ${countBy(perGroup, groups)}.`,
  };
}

/* ---------- Equation Shed: equations with unknowns (Lessons 13–15) ---------- */
function genEquations() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* find the unknown in a × b = c: a × ? = c, ? × b = c, or a × b = ? */
    /* not 2 × 2, where adding or subtracting gives the same numbers as multiplying */
    let a, b;
    do {
      a = R(2, 10);
      b = R(2, 10);
    } while (a === 2 && b === 2);
    const c = a * b,
      unknown = pick(["a", "b", "c"]),
      answer = unknown === "a" ? a : unknown === "b" ? b : c,
      eq = `${unknown === "a" ? "?" : a} × ${unknown === "b" ? "?" : b} = ${unknown === "c" ? "?" : c}`;
    const misc =
      unknown === "c"
        ? [
            [a + b, `That’s ${a} + ${b}. Multiply: ${a} groups of ${b}.`],
            [c - b, `That’s ${a - 1} × ${b}. Count by ${b}s ${a} times.`],
            ...(a < 10 ? [[c + b, `That’s ${a + 1} × ${b}. Count by ${b}s ${a} times.`]] : []),
          ]
        : unknown === "a"
          ? [
              [c - b, `That’s ${c} − ${b}. How many ${b}s make ${c}?`],
              [c + b, `That’s ${c} + ${b}. How many ${b}s make ${c}?`],
              ...(a !== b ? [[b, `${b} is the other factor. How many ${b}s make ${c}?`]] : []),
            ]
          : [
              [c - a, `That’s ${c} − ${a}. ${a} groups of how many make ${c}?`],
              [c + a, `That’s ${c} + ${a}. ${a} groups of how many make ${c}?`],
              ...(a !== b ? [[a, `${a} is the number of groups. How many are in each?`]] : []),
            ];
    /* an unknown group size gets a tape diagram; the others count hops of b on a number line */
    return {
      kind: "num",
      unit: "",
      answer,
      prompt: `What number makes this equation true? <span class="eqn">${eq}</span>`,
      fig:
        unknown === "b"
          ? (show) => tape(a, show ? b : "?", c, `Tape diagram: ${a} equal parts making ${c}`)
          : (show) =>
              hopLine(b, c + b, show ? a : 0, {
                mark: unknown === "a" ? c : null,
                nums: show ? Infinity : 1,
                label:
                  unknown === "a" ? `Number line counting by ${b}s, pointing at ${c}` : `Number line counting by ${b}s`,
              }),
      misc: miscOf(answer, misc),
      hint:
        unknown === "b"
          ? `${a} equal parts make ${c}. What goes in each part?`
          : unknown === "a"
            ? `Count by ${b}s to ${c}. How many hops?`
            : `Count by ${b}s, ${a} times.`,
      explain: `${a} × ${b} = ${c}, so the unknown is ${answer}.`,
    };
  }
  /* a story with one number unknown: the total ('p'), how many in each ('n'), or how many groups ('g') */
  const unknown = pick(["p", "n", "g"]),
    { setting, groups, perGroup, total } = story(variant === 2 || unknown !== "p"),
    { many, things, each } = setting,
    name = pick(KIDS);
  if (variant === 1) {
    /* which equation matches a story with an unknown */
    if (unknown === "p")
      return {
        ...mcOf([
          [`${groups} × ${perGroup} = ?`, null],
          [`${groups} + ${perGroup} = ?`, `That adds. ${groups} ${many} are ${groups} groups of ${perGroup}.`],
          [`${groups} × ? = ${perGroup}`, `${perGroup} is how many ${each}. The unknown is the total.`],
        ]),
        prompt: `There are ${groups} ${many} with ${perGroup} ${things} ${each}. How many ${things} are there? Which equation matches?`,
        fig: (show) => groupsFig(groups, perGroup, { label: `${groups} circles with ${perGroup} dots in each` }),
        hint: "Which number is the groups, which is how many in each, and which one is unknown?",
        explain: `${groups} groups of ${perGroup}, and the total is unknown: ${groups} × ${perGroup} = ?. The unknown is ${total}.`,
      };
    if (unknown === "n")
      return {
        ...mcOf([
          [`${groups} × ? = ${total}`, null],
          [`${total} × ${groups} = ?`, `${total} is the total. It goes by itself on one side.`],
          [`${groups} + ? = ${total}`, `That adds. ${groups} equal groups make ${total}.`],
        ]),
        prompt: `${name} puts ${total} ${things} into ${groups} ${many}, the same number ${each}. How many go ${each}? Which equation matches?`,
        fig: (show) =>
          tape(groups, show ? perGroup : "?", total, `Tape diagram: ${groups} equal parts making ${total}`),
        hint: "Which number is the groups, which is the total, and which one is unknown?",
        explain: `${groups} groups of an unknown number make ${total}: ${groups} × ? = ${total}. The unknown is ${perGroup}.`,
      };
    return {
      ...mcOf([
        [`? × ${perGroup} = ${total}`, null],
        [`${total} × ${perGroup} = ?`, `${total} is the total. The unknown is how many ${many}.`],
        [`${perGroup} + ? = ${total}`, `That adds. Equal groups of ${perGroup} make ${total}.`],
      ]),
      prompt: `${name} puts ${total} ${things} into ${many}, with ${perGroup} ${each}. How many ${many} does ${name} fill? Which equation matches?`,
      fig: (show) =>
        hopLine(perGroup, total + perGroup, show ? groups : 0, {
          mark: total,
          nums: show ? Infinity : 1,
          label: `Number line counting by ${perGroup}s, pointing at ${total}`,
        }),
      hint: "Which number is how many in each, which is the total, and which one is unknown?",
      explain: `An unknown number of groups of ${perGroup} make ${total}: ? × ${perGroup} = ${total}. The unknown is ${groups}.`,
    };
  }
  /* a story with an unknown number of groups or an unknown group size */
  const askGroups = Math.random() < 0.5;
  if (askGroups)
    return {
      kind: "num",
      unit: many,
      answer: groups,
      prompt: `${name} has ${total} ${things} and puts ${perGroup} ${each}. How many ${many} does ${name} fill?`,
      fig: (show) =>
        hopLine(perGroup, total + perGroup, show ? groups : 0, {
          mark: total,
          nums: show ? Infinity : 1,
          label: `Number line counting by ${perGroup}s, pointing at ${total}`,
        }),
      misc: miscOf(groups, [
        [total - perGroup, `That’s ${total} − ${perGroup}. How many ${perGroup}s make ${total}?`],
        [total + perGroup, `That’s ${total} + ${perGroup}. How many ${perGroup}s make ${total}?`],
        [perGroup, `That’s the ${things} ${each}.`],
      ]),
      hint: `? × ${perGroup} = ${total}. Count by ${perGroup}s to ${total}, and count how many times.`,
      explain: `Count by ${perGroup}s: ${countBy(perGroup, groups)}. That’s ${groups} ${many}, because ${groups} × ${perGroup} = ${total}.`,
    };
  return {
    kind: "num",
    unit: things,
    answer: perGroup,
    prompt: `${name} puts ${total} ${things} into ${groups} ${many}, the same number ${each}. How many ${things} go ${each}?`,
    fig: (show) => tape(groups, show ? perGroup : "?", total, `Tape diagram: ${groups} equal parts making ${total}`),
    misc: miscOf(perGroup, [
      [total - groups, `That’s ${total} − ${groups}. ${groups} groups of how many make ${total}?`],
      [total + groups, `That’s ${total} + ${groups}. ${groups} groups of how many make ${total}?`],
      [groups, `That’s the number of ${many}.`],
    ]),
    hint: `${groups} × ? = ${total}. Try numbers until ${groups} groups make ${total}.`,
    explain: `${groups} × ${perGroup} = ${total}, so ${perGroup} ${things} go ${each}.`,
  };
}

/* ---------- Tree Rows: arrays (Lessons 16–19) ---------- */
/* array stories: what's in rows, the rows (r) and columns (c) that make sense as [least, most] or fixed sizes (fix), and the unit */
const ARRAYS = [
  {
    say: (rows, cols) => `An orchard has ${rows} rows of apple trees, with ${cols} trees in each row.`,
    r: [3, 8],
    c: [4, 10],
    u: "trees",
  },
  {
    say: (rows, cols) => `The market has ${rows} rows of chairs, with ${cols} chairs in each row.`,
    r: [2, 8],
    c: [4, 10],
    u: "chairs",
  },
  {
    say: (rows, cols) => `A garden has ${rows} rows of plants, with ${cols} plants in each row.`,
    r: [2, 6],
    c: [3, 10],
    u: "plants",
  },
  {
    say: (rows, cols) => `A sheet of stamps has ${rows} rows, with ${cols} stamps in each row.`,
    r: [2, 5],
    c: [4, 10],
    u: "stamps",
  },
  {
    say: (rows, cols) => `A muffin pan has ${rows} rows, with ${cols} muffins in each row.`,
    fix: [
      [2, 6],
      [3, 4],
      [4, 6],
    ],
    u: "muffins",
  },
  { say: (rows, cols) => `An egg carton has ${rows} rows, with ${cols} eggs in each row.`, fix: [[2, 6]], u: "eggs" },
  {
    say: (rows, cols) => `A window has ${rows} rows of glass panes, with ${cols} panes in each row.`,
    r: [2, 4],
    c: [2, 4],
    u: "panes",
  },
];
/* an array story: its ARRAYS entry (setting), rows of cols, and the total */
function arrayStory() {
  const setting = pick(ARRAYS);
  let rows, cols;
  /* not 2 rows of 2, where adding gives the product */
  do {
    if (setting.fix) [rows, cols] = pick(setting.fix);
    else {
      rows = R(...setting.r);
      cols = R(...setting.c);
    }
  } while (rows === 2 && cols === 2);
  return { setting, rows, cols, total: rows * cols };
}
function genArrays() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* count an array */
    const rows = R(2, 5),
      cols = R(3, 10),
      total = rows * cols;
    return {
      kind: "num",
      unit: "trees",
      answer: total,
      prompt: `The apple trees are planted in an array. How many trees are there?`,
      fig: (show) =>
        arrayFig(rows, cols, { band: show ? "r" : null, label: `An array: ${rows} rows with ${cols} in each row` }),
      misc: miscOf(total, [
        [rows + cols, `You added the rows and the columns. ${rows} rows of ${cols} is ${rows} × ${cols}.`],
        [rows, "That’s the number of rows."],
        [cols, "That’s how many are in one row."],
        [(rows - 1) * cols, `That’s ${pl(rows - 1, "row")}. Count the rows again.`],
      ]),
      hint: `Count the rows, and how many are in each row. Then count by ${cols}s.`,
      explain: `${pl(rows, "row")} of ${cols}: ${countBy(cols, rows)}. ${rows} × ${cols} = ${total}.`,
    };
  }
  if (variant === 1) {
    /* which expression matches the array; a wrong one adds a row too many or too few */
    const rows = R(2, 5),
      wrongRows = rows > 2 ? rows - 1 : rows + 1;
    let cols;
    do {
      cols = R(3, 10);
    } while (cols === rows);
    return {
      ...mcOf([
        [`${rows} × ${cols}`, null],
        [`${rows} + ${cols}`, `That adds a row and a column. There are ${rows} rows of ${cols}.`],
        [addends(wrongRows, cols), `That’s ${pl(wrongRows, "row")} of ${cols}. Count the rows again.`],
      ]),
      prompt: "Which expression matches this array?",
      fig: (show) =>
        arrayFig(rows, cols, { band: show ? "r" : null, label: `An array: ${rows} rows with ${cols} in each row` }),
      hint: "Count the rows first, then how many are in each row.",
      explain: `${pl(rows, "row")} with ${cols} in each row: ${rows} × ${cols}. That’s ${addends(rows, cols)} = ${rows * cols}.`,
    };
  }
  if (variant === 2) {
    /* an array story; the array comes with the hint */
    const { setting, rows, cols, total } = arrayStory();
    return {
      kind: "num",
      unit: setting.u,
      answer: total,
      prompt: `${setting.say(rows, cols)} How many ${setting.u} are there?`,
      fig: (show) => arrayFig(rows, cols, show ? { band: "r", k: rows, sum: true } : {}),
      misc: miscOf(total, [
        [rows + cols, `You added ${rows} + ${cols}. Multiply: ${rows} rows of ${cols}.`],
        [(rows - 1) * cols, `That’s only ${pl(rows - 1, "row")}.`],
        [(rows + 1) * cols, `That’s ${rows + 1} rows.`],
      ]),
      hint: `${rows} rows of ${cols}: count by ${cols}s ${rows} times.`,
      explain: `${rows} × ${cols} = ${total}. Count by ${cols}s: ${countBy(cols, rows)}.`,
    };
  }
  /* which array shows rows × cols: the right one, one with a column too many, and one with a row too many */
  const rows = R(2, 4),
    cols = R(3, 6),
    options = [
      [rows, cols, null],
      [rows, cols + 1, `That’s ${rows} rows of ${cols + 1}.`],
      [rows + 1, cols, `That’s ${rows + 1} rows of ${cols}.`],
    ];
  return {
    ...mcOf(
      options.map(([optionRows, optionCols, why]) => [arrayFig(optionRows, optionCols), why]),
      { stack: true },
    ),
    prompt: `Which array shows ${rows} × ${cols}: ${rows} rows with ${cols} in each row?`,
    hint: "Count the rows first, then how many are in each row.",
    explain: `${rows} rows with ${cols} in each row is ${rows} × ${cols} = ${rows * cols}.`,
  };
}

/* ---------- Flip Field: the commutative property (Lesson 20) ---------- */
function genFlip() {
  /* two different factors a and b */
  const variant = R(0, 3);
  let a = R(2, 10),
    b;
  do {
    b = R(2, 10);
  } while (b === a);
  const product = a * b,
    name = pick(KIDS);
  if (variant === 0) {
    /* a × b = b × ? */
    return {
      kind: "num",
      unit: "",
      answer: a,
      prompt: `What number makes this equation true? <span class="eqn">${a} × ${b} = ${b} × ?</span>`,
      fig: (show) => arrayFig(show ? b : a, show ? a : b),
      misc: miscOf(a, [
        [b, `${b} is already there. Turn the factors around: ${a} × ${b} = ${b} × ${a}.`],
        [product, `${product} is the product. The ? is a factor.`],
      ]),
      hint: "Turning an array doesn’t change how many are in it. The same two factors are on both sides.",
      explain: `You can multiply in any order: ${a} × ${b} = ${b} × ${a}. Both are ${product}.`,
    };
  }
  if (variant === 1) {
    /* which equation is also true; the wrong ones give the sum, or the product with a factor one off */
    const wrongSum = [`${b} × ${a} = ${a + b}`, `${b} + ${a} = ${a + b}, but ${b} × ${a} is ${b} groups of ${a}.`],
      wrongProduct =
        a < 10
          ? [
              `${b} × ${a} = ${b * (a + 1)}`,
              `That’s ${b} × ${a + 1}. Turning the factors around doesn’t change the product.`,
            ]
          : [
              `${b} × ${a} = ${b * (a - 1)}`,
              `That’s ${b} × ${a - 1}. Turning the factors around doesn’t change the product.`,
            ];
    return {
      ...mcOf([[`${b} × ${a} = ${product}`, null], wrongSum, wrongProduct]),
      prompt: `${name} knows ${a} × ${b} = ${product}. Which equation is also true?`,
      hint: "Turn the factors around. Does the product change?",
      explain: `You can multiply in any order, so ${b} × ${a} = ${a} × ${b} = ${product}.`,
    };
  }
  if (variant === 2) {
    /* a fact you know: the turnaround */
    return {
      kind: "num",
      unit: "",
      answer: product,
      prompt: `${name} knows ${a} × ${b} = ${product}. What is ${b} × ${a}?`,
      fig: (show) => hopLine(b, product + Math.max(a, b), show ? a : 0, { nums: show ? Infinity : 1 }),
      misc: miscOf(product, [
        [a + b, `That’s ${b} + ${a}. Multiply: ${b} groups of ${a}.`],
        [product - a, `That’s ${b - 1} × ${a}. Turning the factors around doesn’t change the product.`],
      ]),
      hint: `${b} × ${a} is the turnaround of ${a} × ${b}.`,
      explain: `${b} × ${a} = ${a} × ${b}, so it’s ${product} too.`,
    };
  }
  /* which array has the same number of counters: the one turned */
  const rows = R(2, 4),
    cols = R(rows + 1, 6);
  return {
    ...mcOf(
      [
        [arrayFig(cols, rows), null],
        [arrayFig(cols, rows + 1), `That’s ${cols} rows of ${rows + 1}: ${cols} × ${rows + 1} = ${cols * (rows + 1)}.`],
        [
          arrayFig(cols - 1, rows),
          `That’s ${pl(cols - 1, "row")} of ${rows}: ${cols - 1} × ${rows} = ${(cols - 1) * rows}.`,
        ],
      ],
      { stack: true },
    ),
    prompt: `This array has ${rows} rows of ${cols}. Which array is the same one turned, with the same number of counters?`,
    fig: (show) => arrayFig(rows, cols),
    hint: "Turn the array a quarter turn: the rows become the columns.",
    explain: `Turned, ${rows} rows of ${cols} become ${cols} rows of ${rows}. ${rows} × ${cols} = ${cols} × ${rows} = ${rows * cols}.`,
  };
}

/* the Harvest Festival deals from every station */
const genBoss = () => pick([genPics, genBars, genGroups, genEquations, genArrays, genFlip])();

const ZONES = [
  {
    id: "pics",
    name: "Picture Barn",
    lessons: "Lessons 1–4",
    blurb: "Read picture graphs where each picture shows 2, 5, or 10, and find how many pictures to draw.",
    gen: genPics,
  },
  {
    id: "bars",
    name: "Bar Silo",
    lessons: "Lessons 5–8",
    blurb: "Read bars that end between the lines, find how many more or in all, and pick a good scale.",
    gen: genBars,
  },
  {
    id: "groups",
    name: "Basket Row",
    lessons: "Lessons 9–12",
    blurb: "Count equal groups, and match stories to expressions and diagrams.",
    gen: genGroups,
  },
  {
    id: "equations",
    name: "Equation Shed",
    lessons: "Lessons 13–15",
    blurb: "Find the unknown number in an equation, and pick the equation for a story.",
    gen: genEquations,
  },
  {
    id: "arrays",
    name: "Tree Rows",
    lessons: "Lessons 16–19",
    blurb: "Count trees planted in arrays, and match arrays to expressions and stories.",
    gen: genArrays,
  },
  {
    id: "flip",
    name: "Flip Field",
    lessons: "Lesson 20",
    blurb: "Turn arrays and factors around: 3 × 5 = 5 × 3.",
    gen: genFlip,
  },
  {
    id: "boss",
    name: "Harvest Festival",
    lessons: "All lessons",
    blurb: "Fill the harvest basket! Every right answer adds one of its 10 apples.",
    gen: genBoss,
  },
];

/* the harvest basket: 10 apples, `lit` of them picked (the boss icon draws all of them) */
const basket = (lit) =>
  '<path d="M14,30Q32,2 50,30" fill="none" stroke="#c98a4b" stroke-width="3"/>' +
  [
    [20, 24],
    [29, 22],
    [38, 22],
    [46, 25],
    [16, 32],
    [25, 31],
    [34, 30],
    [43, 31],
    [21, 38],
    [40, 38],
  ]
    .map(
      ([x, y], i) =>
        `<circle cx="${x}" cy="${y}" r="5" fill="${i < lit ? "#ff7b7b" : "rgba(255,255,255,.12)"}" stroke="#0a2340" stroke-width="1"/>`,
    )
    .join("") +
  '<path d="M6,32H58L52,60H12Z" fill="#c98a4b" stroke="#0a2340" stroke-width="1.5"/><path d="M9,41H55M11,50H53" stroke="#8a5a2b" stroke-width="2"/>';
const ICON = {
  pics: '<path d="M6,26L32,8L58,26V58H6Z" fill="#b5483f" stroke="#0a2340" stroke-width="1.5"/><rect x="14" y="30" width="36" height="24" fill="#0a2340"/><g stroke="#0a2340" stroke-width="1"><rect x="17" y="33" width="8" height="8" rx="1.5" fill="#ff7b7b"/><rect x="27" y="33" width="8" height="8" rx="1.5" fill="#ff7b7b"/><rect x="37" y="33" width="4" height="8" fill="#ff7b7b"/><rect x="17" y="44" width="8" height="8" rx="1.5" fill="#5fe0a8"/></g>',
  bars: '<rect x="12" y="10" width="40" height="48" rx="20" fill="#a9c4e4" stroke="#0a2340" stroke-width="1.5"/><rect x="18" y="26" width="28" height="28" fill="#0a2340"/><rect x="21" y="40" width="6" height="14" fill="#ff7b7b"/><rect x="29" y="30" width="6" height="24" fill="#6fa8ff"/><rect x="37" y="36" width="6" height="18" fill="#5fe0a8"/>',
  groups:
    '<g fill="#c98a4b" stroke="#0a2340" stroke-width="1.5"><path d="M4,40H28L25,56H7Z"/><path d="M36,40H60L57,56H39Z"/></g><g fill="#ff7b7b" stroke="#0a2340" stroke-width="1"><circle cx="11" cy="35" r="5"/><circle cx="21" cy="35" r="5"/><circle cx="16" cy="27" r="5"/><circle cx="43" cy="35" r="5"/><circle cx="53" cy="35" r="5"/><circle cx="48" cy="27" r="5"/></g>',
  equations:
    '<path d="M8,24L32,8L56,24V58H8Z" fill="#7fb0e6" stroke="#0a2340" stroke-width="1.5"/><rect x="14" y="30" width="36" height="20" rx="3" fill="#0a2340"/><text x="32" y="45" fill="#ffc93c" font-size="13" font-weight="700" text-anchor="middle" font-family="monospace">4×?</text>',
  arrays:
    "<g>" +
    range(9)
      .map((i) => {
        const x = 12 + (i % 3) * 20,
          y = 14 + Math.floor(i / 3) * 18;
        return `<rect x="${x - 1.5}" y="${y + 4}" width="3" height="7" fill="#8a5a2b"/><circle cx="${x}" cy="${y}" r="7" fill="#5fe0a8" stroke="#0a2340" stroke-width="1"/>`;
      })
      .join("") +
    "</g>",
  flip:
    '<g fill="#ffc93c">' +
    range(6)
      .map((i) => `<circle cx="${8 + (i % 3) * 9}" cy="${26 + Math.floor(i / 3) * 9}" r="3.5"/>`)
      .join("") +
    '</g><g fill="#7fe3ff">' +
    range(6)
      .map((i) => `<circle cx="${46 + (i % 2) * 9}" cy="${20 + Math.floor(i / 2) * 9}" r="3.5"/>`)
      .join("") +
    '</g><path d="M28,14Q34,4 42,12" fill="none" stroke="#f3f6fb" stroke-width="2.5"/><path d="M42,12l-6,0M42,12l-1,-6" stroke="#f3f6fb" stroke-width="2.5"/><text x="32" y="58" fill="#f3f6fb" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">2×3=3×2</text>',
  boss: basket(10),
};
