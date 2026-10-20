/* Bug Hunt (Grade 2 Unit 1): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Ten-frames, cubes, and base-ten blocks come from shared/blocks.js, picture and bar graphs from shared/graphs.js, tape
   diagrams from shared/numlines.js, and mcOf and miscOf from shared/util.js. Each generator deals one of a few kinds of
   problem (variant), each with a comment saying what it asks. Every problem carries `facts`, the numbers it was made from,
   so checks.js can work the answer out again. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* two different students */
const twoKids = () => shuffle(KIDS).slice(0, 2);
/* the text with its first letter capitalized */
const cap = (text) => text[0].toUpperCase() + text.slice(1);
/* named mistakes, leaving out any that land on the answer for these numbers (the mistake doesn't show up then) */
const named = (answer, list) =>
  miscOf(
    answer,
    list.filter(([value]) => value !== answer),
  );
/* an equation with a gold box for the missing number, like 7 + ? = 15 */
const eqn = (text) => `<span class="eqn">${text.replace("?", '<span class="q">?</span>')}</span>`;

/* bugs in the garden: where they are, and how they come and go */
const BUGS = [
  { name: "ladybugs", at: "on the leaf", come: "fly to the leaf", go: "fly away" },
  { name: "ants", at: "on the rock", come: "crawl onto the rock", go: "crawl away" },
  { name: "bees", at: "in the flowers", come: "buzz over to the flowers", go: "buzz away" },
  { name: "butterflies", at: "in the garden", come: "flutter into the garden", go: "flutter away" },
  { name: "crickets", at: "in the grass", come: "hop into the grass", go: "hop away" },
];
/* a row of a yellow cubes, then b blue ones */
const cubeRow = (a, b, label) =>
  svgWrap((a + b) * CUBE + 8, CUBE + 8, cubes(4, 4, a, "a") + cubes(4 + a * CUBE, 4, b, "b"), label);

/* ---------- Ladybug Leaves: add and subtract within 20 (Lessons 1–3) ---------- */
function genFacts() {
  const variant = R(0, 3),
    bug = pick(BUGS);
  if (variant === 0) {
    /* put together: some bugs, then more come; the ten-frames show both groups */
    const a = R(3, 9),
      b = R(2, 9),
      total = a + b;
    return {
      kind: "num",
      unit: bug.name,
      answer: total,
      facts: { t: "add", a, b },
      prompt: `${a} ${bug.name} are ${bug.at}. ${b} more ${bug.name} ${bug.come}. How many ${bug.name} are ${bug.at} now?`,
      fig: () => tenFrames(cellsOf([a, "a"], [b, "b"]), { label: `${a} yellow counters and ${b} blue counters` }),
      misc: named(total, [
        [a, "That’s only the yellow counters. Count the blue ones too."],
        [b, "That’s only the blue counters. Count the yellow ones too."],
        ...(a > b ? [[a - b, "More bugs came, so there are more now. Add."]] : []),
      ]),
      hint: total > 10 ? "The first frame holds 10. Count on from 10." : "Count all the counters, yellow and blue.",
      explain: `${a} + ${b} = ${total}. There are ${total} ${bug.name} ${bug.at} now.`,
    };
  }
  if (variant === 1) {
    /* take away: some bugs, then some leave; the hint crosses out the ones that left */
    const start = R(11, 18),
      gone = R(3, 9),
      left = start - gone;
    return {
      kind: "num",
      unit: bug.name,
      answer: left,
      facts: { t: "take", start, gone },
      prompt: `${start} ${bug.name} are ${bug.at}. ${gone} ${bug.name} ${bug.go}. How many ${bug.name} are still ${bug.at}?`,
      fig: (show) =>
        tenFrames(cellsOf([start, "a"]), {
          out: new Set(show ? range(gone).map((i) => start - 1 - i) : []),
          label: `${start} counters`,
        }),
      misc: named(left, [
        [start + gone, "Some bugs left, so there are fewer now. Subtract."],
        [gone, `${gone} is how many left. How many are still there?`],
        [start, `${start} is how many there were at first.`],
      ]),
      hint: `Cross out ${gone} counters. Count the ones still there.`,
      explain: `${start} − ${gone} = ${left}. ${left} ${bug.name} are still ${bug.at}.`,
    };
  }
  if (variant === 2) {
    /* which fact goes with a + b = total; the wrong ones are true facts that use a different number */
    const a = R(3, 9);
    let b = R(2, 9);
    if (b === a) b = a === 9 ? 8 : a + 1;
    /* shifted: the numbers of a true fact one off from total − b = a (from total − a = b when b − 1 is a, which is a right one) */
    const total = a + b,
      right = pick([`${b} + ${a} = ${total}`, `${total} − ${a} = ${b}`, `${total} − ${b} = ${a}`]),
      shifted = b - 1 === a ? [a - 1, b + 1] : [b - 1, a + 1];
    return {
      ...mcOf([
        [right, null],
        [
          `${total + 1} − ${b} = ${a + 1}`,
          `That fact starts with ${total + 1}. The facts that go together all use ${a}, ${b}, and ${total}.`,
        ],
        [
          `${total} − ${shifted[0]} = ${shifted[1]}`,
          `That fact uses ${shifted[0]} and ${shifted[1]}. The facts that go together all use ${a}, ${b}, and ${total}.`,
        ],
      ]),
      facts: { t: "family", a, b },
      prompt: `Which fact goes with <b>${a} + ${b} = ${total}</b>?`,
      fig: () => cubeRow(a, b, `${a} yellow cubes and ${b} blue cubes`),
      hint: `Look for a fact with the same three numbers: ${a}, ${b}, and ${total}.`,
      explain: `${right} uses ${a}, ${b}, and ${total}, the same numbers as ${a} + ${b} = ${total}.`,
    };
  }
  /* the missing number: a + ? = total, ? + a = total, or total − ? = a */
  const a = R(3, 9),
    total = R(Math.max(11, a + 2), Math.min(18, a + 9)),
    missing = total - a,
    form = R(0, 2);
  const equation = [`${a} + ? = ${total}`, `? + ${a} = ${total}`, `${total} − ? = ${a}`][form],
    taking = form === 2;
  return {
    kind: "num",
    unit: "",
    answer: missing,
    facts: { t: "missing", equation, answer: missing },
    prompt: `What number makes this true? ${eqn(equation)}`,
    fig: (show) =>
      taking
        ? tenFrames(cellsOf([total, "a"]), {
            out: new Set(show ? range(missing).map((i) => total - 1 - i) : []),
            label: `${total} counters`,
          })
        : tenFrames(cellsOf([a, "a"], [show ? missing : 0, "b"]), { label: `${a} counters` }),
    misc: named(missing, [
      [total, taking ? `${total} is the number you start with.` : `${total} is the total. What goes with ${a}?`],
      [
        a + total,
        taking
          ? `Taking away makes less. What do you take from ${total} to leave ${a}?`
          : "Adding both numbers gives too much.",
      ],
      [a, `${a} is already in the equation. Find the other number.`],
    ]),
    hint: taking
      ? `Count back from ${total} until you get to ${a}. Or think: ${a} + ? = ${total}.`
      : `Count on from ${a} until you get to ${total}.`,
    explain: taking
      ? `${total} − ${missing} = ${a}, because ${a} + ${missing} = ${total}.`
      : `${a} + ${missing} = ${total}. Count on from ${a}: ${missing} more makes ${total}.`,
  };
}

/* ---------- Anthill Tens: make a ten, doubles, and tens and ones (Lessons 4–5) ---------- */
/* things students collect, in tens and ones */
const THINGS = ["marbles", "stickers", "shells", "acorns", "beads", "rocks"];
function genTen() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* make a ten: which is the same as a + b? The hint moves some blue counters up to fill the first frame */
    const a = R(7, 9),
      b = R(11 - a, 9),
      need = 10 - a,
      rest = b - need;
    /* the blue counters: in the second frame, or (show) the first `need` moved up to fill the first */
    const cells = (show) =>
      show
        ? cellsOf([a, "a"], [need, "b moved"], [rest, "b"])
        : [...cellsOf([a, "a"], [10 - a, ""]), ...cellsOf([b, "b"])];
    return {
      ...mcOf([
        [`10 + ${rest}`, null],
        [`10 + ${b}`, `${a} is not 10 yet. It needs ${need} of the ${b} to make 10.`],
        need === rest
          ? [`${a} + 10`, `${b} is not 10. Move ${need} from the ${b} to the ${a} to make a ten.`]
          : [`10 + ${need}`, `${need} goes with ${a} to make 10. How many of the ${b} are left?`],
      ]),
      facts: { t: "makeTen", a, b },
      prompt: `Which is the same as <b>${a} + ${b}</b>?`,
      fig: (show) => tenFrames(cells(show), { label: `${a} yellow counters and ${b} blue counters` }),
      hint: `${a} needs ${need} more to make 10. Move ${need} blue counters up to fill the first frame.`,
      explain: `Move ${need} from the ${b} to make 10: ${a} + ${b} = 10 + ${rest} = ${a + b}.`,
    };
  }
  if (variant === 1) {
    /* doubles and one more (or one less): d + d is known, so d + (d ± 1) is one more or one less */
    const d = R(3, 9),
      oneMore = Math.random() < 0.65,
      other = oneMore ? d + 1 : d - 1,
      sum = d + other,
      [first, second] = Math.random() < 0.5 ? [d, other] : [other, d];
    return {
      kind: "num",
      unit: "",
      answer: sum,
      facts: { t: "double", first, second },
      prompt: `You know <b>${d} + ${d} = ${2 * d}</b>. What is <b>${first} + ${second}</b>?`,
      fig: () =>
        svgWrap(
          other * CUBE + 8 + (oneMore ? 0 : CUBE),
          2 * CUBE + 12,
          cubes(4, 4, d, "a") + cubes(4, CUBE + 8, other, "b"),
          `${d} yellow cubes over ${other} blue cubes`,
        ),
      misc: named(sum, [
        [2 * d, `${2 * d} is ${d} + ${d}. ${other} is one ${oneMore ? "more" : "less"} than ${d}.`],
        [2 * other, `${2 * other} is ${other} + ${other}. Only one of the numbers is ${other}.`],
      ]),
      hint: `${other} is one ${oneMore ? "more" : "less"} than ${d}. So the answer is one ${oneMore ? "more" : "less"} than ${2 * d}.`,
      explain: `${d} + ${d} = ${2 * d}, so ${first} + ${second} is one ${oneMore ? "more" : "less"}: ${sum}.`,
    };
  }
  /* add tens and ones within 50: two two-digit numbers with no new ten, or a two-digit and a one-digit number that make one */
  const [kid, friend] = twoKids(),
    thing = pick(THINGS),
    twoDigit = Math.random() < 0.55;
  let a, b;
  if (twoDigit) {
    a = R(1, 3) * 10 + R(1, 7);
    b = R(1, 4 - Math.floor(a / 10)) * 10 + R(0, 9 - (a % 10));
  } else {
    a = R(1, 4) * 10 + R(3, 8);
    b = R(10 - (a % 10), 9);
    if (a + b > 50) a -= 10;
  }
  const sum = a + b,
    tensB = Math.floor(b / 10),
    onesSum = (a % 10) + (b % 10),
    makesTen = onesSum >= 10;
  return {
    kind: "num",
    unit: thing,
    answer: sum,
    facts: { t: "tensOnes", a, b },
    prompt: `${kid} has ${a} ${thing}. ${friend} gives ${kid} ${b} more ${thing}. How many ${thing} does ${kid} have now?`,
    fig: (show) => addBlocks(a, b, show),
    misc: named(sum, [
      ...(tensB
        ? [[a + tensB + (b % 10), `The ${tensB} in ${b} is ${tensB} ten${tensB > 1 ? "s" : ""}: ${tensB * 10}.`]]
        : []),
      ...(makesTen ? [[sum - 10, `${a % 10} + ${b % 10} is ${onesSum} ones. That makes a new ten. Count it.`]] : []),
      [a, `${a} is how many ${kid} had at first. Add the ${b} more.`],
    ]),
    hint: makesTen
      ? `Add the ones: ${a % 10} + ${b % 10}. Ten ones make a new ten.`
      : "Add the tens, then add the ones.",
    explain: makesTen
      ? `${a % 10} + ${b % 10} = ${onesSum} ones: a new ten and ${onesSum - 10} more. ${a} + ${b} = ${sum}.`
      : `Tens: ${Math.floor(a / 10) * 10} + ${tensB * 10} = ${Math.floor(sum / 10) * 10}. Ones: ${a % 10} + ${b % 10} = ${sum % 10}. ${a} + ${b} = ${sum}.`,
  };
}

/* ---------- graphs: what a class counted or chose ---------- */
/* Each topic has its categories ([label, picture, color]), the key's word for one ("bug"), and how to ask about it: how many
   are in a category (count), which category has the most or fewest (which), how many in all (all), and how many more in one
   than another (more). The counts on a graph are all different, so there is one most and one fewest. */
const PIC_TOPICS = [
  {
    title: "Bugs we saw in the garden",
    one: "bug",
    rows: [
      ["Ladybugs", "dot", "red"],
      ["Bees", "dot", "yellow"],
      ["Beetles", "dot", "blue"],
      ["Crickets", "dot", "green"],
    ],
    count: (label) => `How many ${label.toLowerCase()} did the class see?`,
    which: (most) => `Which bug did the class see the ${most ? "most" : "fewest"} of?`,
    all: "How many bugs did the class see in all?",
    more: (big, small) => `How many more ${big.toLowerCase()} than ${small.toLowerCase()} did the class see?`,
  },
  {
    title: "Weather this month",
    one: "day",
    rows: [
      ["Sunny", "sun", ""],
      ["Cloudy", "cloud", ""],
      ["Rainy", "rain", ""],
    ],
    count: (label) => `How many days were ${label.toLowerCase()}?`,
    which: (most) => `Which kind of weather had the ${most ? "most" : "fewest"} days?`,
    all: "How many days does the graph show in all?",
    more: (big, small) => `How many more days were ${big.toLowerCase()} than ${small.toLowerCase()}?`,
  },
  {
    title: "Fruit our class likes best",
    one: "student",
    rows: [
      ["Apples", "note", "red"],
      ["Bananas", "note", "yellow"],
      ["Blueberries", "note", "blue"],
      ["Pears", "note", "green"],
    ],
    count: (label) => `How many students chose ${label.toLowerCase()}?`,
    which: (most) => `Which fruit did the ${most ? "most" : "fewest"} students choose?`,
    all: "How many students chose a fruit in all?",
    more: (big, small) => `How many more students chose ${big.toLowerCase()} than ${small.toLowerCase()}?`,
  },
];
const BAR_TOPICS = [
  {
    title: "Snacks our class chose",
    rows: [
      ["Apples", "red"],
      ["Crackers", "yellow"],
      ["Yogurt", "blue"],
      ["Carrots", "green"],
    ],
    count: (label) => `How many students chose ${label.toLowerCase()}?`,
    which: (most) => `Which snack did the ${most ? "most" : "fewest"} students choose?`,
    two: (x, y) => `How many students chose ${x.toLowerCase()} or ${y.toLowerCase()}?`,
    more: (big, small) => `How many more students chose ${big.toLowerCase()} than ${small.toLowerCase()}?`,
    cannot: ["Which snack tastes the best?", "How many apples are in the store?", "What time is snack time?"],
  },
  {
    title: "Pets our class has",
    rows: [
      ["Dogs", "red"],
      ["Cats", "yellow"],
      ["Fish", "blue"],
      ["Birds", "green"],
    ],
    count: (label) => `How many ${label.toLowerCase()} does the class have?`,
    which: (most) => `Which pet does the class have the ${most ? "most" : "fewest"} of?`,
    two: (x, y) => `How many ${x.toLowerCase()} and ${y.toLowerCase()} does the class have?`,
    more: (big, small) => `How many more ${big.toLowerCase()} than ${small.toLowerCase()} does the class have?`,
    cannot: ["What are the dogs’ names?", "Which pet is the cutest?", "How old is the oldest cat?"],
  },
  {
    title: "Books read this week",
    rows: [
      ["Mai", "red"],
      ["Diego", "yellow"],
      ["Elena", "blue"],
      ["Han", "green"],
    ],
    count: (label) => `How many books did ${label} read?`,
    which: (most) => `Who read the ${most ? "most" : "fewest"} books?`,
    two: (x, y) => `How many books did ${x} and ${y} read in all?`,
    more: (big, small) => `How many more books did ${big} read than ${small}?`,
    cannot: ["Which book was the longest?", "What is Mai’s favorite book?", "How many pages did Diego read?"],
  },
];
/* n different counts from 1 to `most` */
const counts = (n, most = 10) => shuffle(range(most).map((i) => i + 1)).slice(0, n);
/* a topic's rows with fresh counts: [{label, n, pic, c}]; three or four of them */
function picRows(topic) {
  const rows = topic.rows.slice(0, R(3, topic.rows.length)),
    ns = counts(rows.length);
  return rows.map(([label, pic, c], i) => ({ label, n: ns[i], pic, c }));
}
function barRows(topic) {
  const rows = topic.rows.slice(0, R(3, topic.rows.length)),
    ns = counts(rows.length);
  return rows.map(([label, c], i) => ({ label, n: ns[i], c }));
}
/* the index of the row with the most (or the fewest) */
const extremeAt = (rows, most) => {
  const ns = rows.map((r) => r.n);
  return ns.indexOf(most ? Math.max(...ns) : Math.min(...ns));
};
/* two different rows, the bigger one first */
const bigSmall = (rows) => {
  const [x, y] = shuffle(range(rows.length)).slice(0, 2);
  return rows[x].n > rows[y].n ? [x, y] : [y, x];
};
/* the facts checks.js reads a graph problem from: the counts and labels in order */
const graphFacts = (t, rows, more = {}) => ({ t, labels: rows.map((r) => r.label), ns: rows.map((r) => r.n), ...more });
/* named mistakes for reading one row: another row's count */
const otherRows = (rows, at) =>
  rows.filter((r, i) => i !== at).map((r) => [r.n, `That’s the ${r.label} row. Find the row for ${rows[at].label}.`]);

/* ---------- Picture Garden: picture graphs (Lessons 7–8) ---------- */
function genPics() {
  const variant = R(0, 3),
    topic = pick(PIC_TOPICS),
    rows = picRows(topic),
    total = rows.reduce((sum, r) => sum + r.n, 0);
  /* the graph, with row `hi` highlighted and rows tappable when asked */
  const graph = (options = {}) => picGraph(rows, { title: topic.title, unit: `1 ${topic.one}`, ...options });
  if (variant === 0) {
    /* how many in one row */
    const at = R(0, rows.length - 1),
      row = rows[at];
    return {
      kind: "num",
      unit: "",
      answer: row.n,
      facts: graphFacts("count", rows, { at }),
      prompt: topic.count(row.label),
      fig: (show) => graph({ hi: show ? at : -1 }),
      misc: named(row.n, [...otherRows(rows, at), [total, "That’s every picture on the graph. Count only one row."]]),
      hint: `Find the row for ${row.label}. Count its pictures. Each one shows 1.`,
      explain: `The ${row.label} row has ${row.n} pictures, and each shows 1 ${topic.one}: ${row.n}.`,
    };
  }
  if (variant === 1) {
    /* tap the row with the most or the fewest */
    const most = Math.random() < 0.5,
      at = extremeAt(rows, most),
      row = rows[at];
    return {
      kind: "tap",
      answer: String(at),
      why: Object.fromEntries(
        rows.map((r, i) => [
          String(i),
          `${r.label} has ${r.n}. ${row.label} has ${most ? "more" : "fewer"}: ${row.n}.`,
        ]),
      ),
      facts: graphFacts("which", rows, { most }),
      prompt: `${topic.which(most)} Tap its row.`,
      fig: (show, done) => graph({ tap: "cand", hi: done ? at : -1 }),
      hint: most ? "Look for the longest row of pictures." : "Look for the shortest row of pictures.",
      explain:
        `${row.label} has the ${most ? "most" : "fewest"}: ${row.n}. ` +
        rows.map((r) => `${r.label} ${r.n}`).join(", ") +
        ".",
    };
  }
  if (variant === 2 && total <= 20) {
    /* how many in all (when the total is within 20) */
    const parts = rows.map((r) => r.n);
    return {
      kind: "num",
      unit: "",
      answer: total,
      facts: graphFacts("all", rows),
      prompt: topic.all,
      fig: () => graph(),
      misc: named(total, [
        [total - rows[rows.length - 1].n, `That leaves out the ${rows[rows.length - 1].label} row.`],
        [Math.max(...parts), "That’s only the longest row. Add every row."],
      ]),
      hint: `Count each row, then add: ${parts.map(() => "?").join(" + ")}.`,
      explain: `${parts.join(" + ")} = ${total}.`,
    };
  }
  /* how many more in one row than another */
  const [big, small] = bigSmall(rows),
    diff = rows[big].n - rows[small].n;
  return {
    kind: "num",
    unit: "more",
    answer: diff,
    facts: graphFacts("more", rows, { big, small }),
    prompt: topic.more(rows[big].label, rows[small].label),
    fig: (show) => graph({ hi: show ? big : -1 }),
    misc: named(diff, [
      [rows[big].n + rows[small].n, "That’s both rows together. How many more is the difference."],
      [rows[big].n, `That’s the whole ${rows[big].label} row. Take away the ${rows[small].label} row.`],
      [rows[small].n, `That’s the ${rows[small].label} row. How many more does ${rows[big].label} have?`],
    ]),
    hint: `Line up the two rows. Count the pictures in the ${rows[big].label} row that have no partner.`,
    explain: `${rows[big].n} − ${rows[small].n} = ${diff}. ${rows[big].label} has ${diff} more.`,
  };
}

/* ---------- Beehive Bars: bar graphs (Lessons 9–11) ---------- */
function genBars() {
  const variant = R(0, 3),
    topic = pick(BAR_TOPICS),
    rows = barRows(topic),
    total = rows.reduce((sum, r) => sum + r.n, 0);
  const graph = (options = {}) => barGraph(rows, { title: topic.title, ...options });
  if (variant === 0) {
    /* read one bar */
    const at = R(0, rows.length - 1),
      row = rows[at];
    return {
      kind: "num",
      unit: "",
      answer: row.n,
      facts: graphFacts("count", rows, { at }),
      prompt: topic.count(row.label),
      fig: (show) => graph({ hi: show ? at : -1 }),
      misc: named(row.n, [
        ...otherRows(rows, at).map(([n]) => [n, `That’s another bar. Find the bar labeled ${row.label}.`]),
        [row.n + 1, "Look at the line the top of the bar touches."],
        [total, "That’s all the bars together. Read only one bar."],
      ]),
      hint: `Find the bar for ${row.label}. Follow its top across to the numbers.`,
      explain: `The top of the ${row.label} bar lines up with ${row.n}.`,
    };
  }
  if (variant === 1) {
    /* tap the tallest or shortest bar */
    const most = Math.random() < 0.5,
      at = extremeAt(rows, most),
      row = rows[at];
    return {
      kind: "tap",
      answer: String(at),
      why: Object.fromEntries(
        rows.map((r, i) => [String(i), `${r.label} has ${r.n}. Look for the ${most ? "tallest" : "shortest"} bar.`]),
      ),
      facts: graphFacts("which", rows, { most }),
      prompt: `${topic.which(most)} Tap its bar.`,
      fig: (show, done) => graph({ tap: "cand", hi: done ? at : -1 }),
      hint: most ? "The most has the tallest bar." : "The fewest has the shortest bar.",
      explain: `${row.label} has the ${most ? "tallest" : "shortest"} bar: ${row.n}.`,
    };
  }
  if (variant === 2) {
    /* which question can the graph answer? One that reads it, and two it can't */
    const [x, y] = bigSmall(rows),
      can = pick([
        topic.count(rows[x].label),
        topic.which(Math.random() < 0.5),
        topic.more(rows[x].label, rows[y].label),
      ]),
      cannot = shuffle(topic.cannot).slice(0, 2);
    return {
      ...mcOf([
        [can, null],
        ...cannot.map((question) => [question, "The graph only shows how many. It can’t answer that."]),
      ]),
      stack: true,
      facts: graphFacts("ask", rows, { can, cannot }),
      prompt: "Which question can this graph answer?",
      fig: () => graph(),
      hint: "The bars only show how many. Which question asks how many, or which has more?",
      explain: `The graph shows how many for each bar, so it can answer “${can}”`,
    };
  }
  /* two bars together */
  const [x, y] = shuffle(range(rows.length)).slice(0, 2),
    both = rows[x].n + rows[y].n;
  return {
    kind: "num",
    unit: "",
    answer: both,
    facts: graphFacts("two", rows, { x, y }),
    prompt: topic.two(rows[x].label, rows[y].label),
    fig: (show) => graph({ hi: show ? [x, y] : -1 }),
    misc: named(both, [
      [rows[x].n, `That’s only ${rows[x].label}. Add ${rows[y].label} too.`],
      [rows[y].n, `That’s only ${rows[y].label}. Add ${rows[x].label} too.`],
      [Math.abs(rows[x].n - rows[y].n), "That’s the difference. The question asks for both together."],
      ...(rows.length > 2 ? [[total, "That’s every bar. Add only the two in the question."]] : []),
    ]),
    hint: `Read the ${rows[x].label} bar and the ${rows[y].label} bar. Then add.`,
    explain: `${rows[x].n} + ${rows[y].n} = ${both}.`,
  };
}

/* ---------- Caterpillar Compare: how many more or fewer (Lessons 13–16) ---------- */
/* a smaller and bigger amount within 100, and the difference, with no new ten or broken ten in the math */
function comparePair() {
  for (;;) {
    const small = R(11, 79),
      diff = R(2, 45),
      big = small + diff;
    if (big <= 99 && (small % 10) + (diff % 10) <= 9 && diff !== small) return { small, big, diff };
  }
}
/* the three kinds of compare stories: the difference unknown, the bigger amount unknown, or the smaller amount unknown.
   `more`: say it with "more" (else "fewer"), which can point the wrong way ("B has 6 fewer than A" when A is unknown). */
function compareStory(kind, kid, other, thing, { small, big, diff }, more) {
  if (kind === "diff")
    return more
      ? `${kid} has ${big} ${thing}. ${other} has ${small} ${thing}. How many more ${thing} does ${kid} have than ${other}?`
      : `${kid} has ${big} ${thing}. ${other} has ${small} ${thing}. How many fewer ${thing} does ${other} have than ${kid}?`;
  if (kind === "big")
    return more
      ? `${other} has ${small} ${thing}. ${kid} has ${diff} more ${thing} than ${other}. How many ${thing} does ${kid} have?`
      : `${other} has ${small} ${thing}. ${other} has ${diff} fewer ${thing} than ${kid}. How many ${thing} does ${kid} have?`;
  return more
    ? `${kid} has ${big} ${thing}. ${kid} has ${diff} more ${thing} than ${other}. How many ${thing} does ${other} have?`
    : `${kid} has ${big} ${thing}. ${other} has ${diff} fewer ${thing} than ${kid}. How many ${thing} does ${other} have?`;
}
/* the tapes for a compare story of this kind (kid has the bigger amount); label: for picture choices */
const compareTapes = (kind, kid, other, { small, big, diff }, label = "Tape diagram") =>
  tapes(
    [
      { label: kid, n: big, show: kind === "big" ? "?" : big },
      { label: other, n: small, show: kind === "small" ? "?" : small },
    ],
    { diff: kind === "diff" ? "?" : diff, label },
  );
function genCompare() {
  const variant = R(0, 4);
  if (variant === 0) {
    /* how many more on a bar graph; the hint draws the difference beside the taller bar */
    const topic = pick(BAR_TOPICS),
      rows = barRows(topic),
      [big, small] = bigSmall(rows),
      diff = rows[big].n - rows[small].n;
    return {
      kind: "num",
      unit: "more",
      answer: diff,
      facts: graphFacts("more", rows, { big, small }),
      prompt: topic.more(rows[big].label, rows[small].label),
      fig: (show) => barGraph(rows, { title: topic.title, diff: show ? [small, big] : null, showDiff: show }),
      misc: named(diff, [
        [rows[big].n + rows[small].n, "That’s both bars together. How many more is the difference."],
        [rows[big].n, `That’s the whole ${rows[big].label} bar. How much taller is it?`],
        [rows[small].n, `That’s the ${rows[small].label} bar. How much taller is the ${rows[big].label} bar?`],
      ]),
      hint: `Look across from the top of the ${rows[small].label} bar. How much taller is the ${rows[big].label} bar?`,
      explain: `${rows[big].n} − ${rows[small].n} = ${diff}. The ${rows[big].label} bar is ${diff} taller.`,
    };
  }
  const [kid, other] = twoKids(),
    thing = pick(THINGS),
    amounts = comparePair(),
    { small, big, diff } = amounts,
    more = Math.random() < 0.6;
  if (variant === 4) {
    /* which tape diagram matches the story */
    const kind = pick(["diff", "big", "small"]),
      problem = mcOf(
        ["diff", "big", "small"].map((k) => [
          k,
          k === kind
            ? null
            : `In that picture the ? is ${k === "diff" ? "the difference" : k === "big" ? `${kid}’s amount` : `${other}’s amount`}. What does the story ask for?`,
        ]),
      );
    problem.choices.forEach((choice, i) => {
      choice.label = compareTapes(choice.label, kid, other, amounts, `Picture ${"ABC"[i]}`);
    });
    return {
      ...problem,
      facts: { t: "tapeMatch", kind, kid, other, ...amounts, more },
      prompt: `${compareStory(kind, kid, other, thing, amounts, more)} Which tape diagram matches the story?`,
      hint: "Find the numbers the story tells you. The ? goes where the story asks a question.",
      explain:
        kind === "diff"
          ? `The story gives both amounts and asks for the difference, so the ? is the dashed piece.`
          : `The story gives ${kind === "big" ? other : kid}’s amount and the difference, and asks for ${kind === "big" ? kid : other}’s.`,
    };
  }
  /* solve a compare story: the difference (variant 1), the bigger amount (2), or the smaller amount (3) */
  const kind = ["diff", "big", "small"][variant - 1],
    answer = { diff, big, small }[kind];
  const wrongWay = {
    diff: [big + small, "That adds the two amounts. Compare them: subtract."],
    big: [small - diff, `${kid} has more than ${other}, so add.`],
    small: [big + diff, `${other} has less than ${kid}, so subtract.`],
  }[kind];
  return {
    kind: "num",
    unit: thing,
    answer,
    facts: { t: "compare", kind, ...amounts, more },
    prompt: compareStory(kind, kid, other, thing, amounts, more),
    fig: () => compareTapes(kind, kid, other, amounts),
    misc: named(answer, [
      ...(wrongWay[0] > 0 ? [wrongWay] : []),
      ...(kind === "diff" ? [[big, `${big} is how many ${kid} has. How many more is that than ${small}?`]] : []),
      ...(kind !== "diff"
        ? [[diff, `${diff} is the difference. Find how many ${kind === "big" ? kid : other} has.`]]
        : []),
    ]),
    hint:
      kind === "diff"
        ? `Count on from ${small} to ${big}, or subtract.`
        : kind === "big"
          ? `${kid} has more than ${other}. Add the difference to ${small}.`
          : `${other} has less than ${kid}. Take the difference away from ${big}.`,
    explain:
      kind === "diff"
        ? `${big} − ${small} = ${diff}, or ${small} + ${diff} = ${big}. The difference is ${diff}.`
        : kind === "big"
          ? `${kid} has more, so add: ${small} + ${diff} = ${big}.`
          : `${other} has fewer, so subtract: ${big} − ${diff} = ${small}.`,
  };
}

/* ---------- Firefly Night: everything ---------- */
const genBoss = () => pick([genFacts, genTen, genPics, genBars, genCompare])();

const ZONES = [
  {
    id: "facts",
    name: "Ladybug Leaves",
    lessons: "Lessons 1–3",
    blurb: "Add and subtract within 20, find the facts that go together, and find a missing number.",
    gen: genFacts,
  },
  {
    id: "ten",
    name: "Anthill Tens",
    lessons: "Lessons 4–5",
    blurb: "Make a ten, use doubles, and add tens and ones within 50.",
    gen: genTen,
  },
  {
    id: "pics",
    name: "Picture Garden",
    lessons: "Lessons 7–8",
    blurb: "Read picture graphs: how many, the most and the fewest, and how many more.",
    gen: genPics,
  },
  {
    id: "bars",
    name: "Beehive Bars",
    lessons: "Lessons 9–11",
    blurb: "Read bar graphs, add two bars, and pick a question a graph can answer.",
    gen: genBars,
  },
  {
    id: "compare",
    name: "Caterpillar Compare",
    lessons: "Lessons 13–16",
    blurb: "Find how many more or fewer with bar graphs and tape diagrams.",
    gen: genCompare,
  },
  {
    id: "boss",
    name: "Firefly Night",
    lessons: "All lessons",
    blurb: "Catch fireflies! Every right answer lights up one of 10 in your jar.",
    gen: genBoss,
  },
];

/* a firefly at x, y: a dark body, wings, and a glowing tail (lit) or a dim one */
const firefly = (x, y, lit) =>
  `<g><ellipse cx="${x}" cy="${y}" rx="2.6" ry="4" fill="#0a2340" stroke="#f3f6fb" stroke-width=".6"/><ellipse cx="${x - 2.6}" cy="${y - 2}" rx="2.4" ry="1.4" fill="rgba(243,246,251,.55)"/><ellipse cx="${x + 2.6}" cy="${y - 2}" rx="2.4" ry="1.4" fill="rgba(243,246,251,.55)"/><circle cx="${x}" cy="${y + 3.6}" r="${lit ? 2.8 : 2}" fill="${lit ? "#fff27a" : "rgba(170,205,255,.35)"}"/>${lit ? `<circle cx="${x}" cy="${y + 3.6}" r="6" fill="rgba(255,242,122,.3)"/>` : ""}</g>`;
/* where the 10 fireflies sit inside the jar */
const JAR_SPOTS = [
  [22, 50],
  [32, 52],
  [42, 50],
  [27, 42],
  [37, 43],
  [22, 33],
  [32, 34],
  [42, 32],
  [27, 25],
  [38, 24],
];
/* a jar with a lid and 10 fireflies, the first `lit` of them glowing (also the boss icon, with 4 lit) */
const jar = (lit) =>
  '<rect x="18" y="6" width="28" height="7" rx="2" fill="#d9a066" stroke="#0a2340" stroke-width="1.5"/>' +
  '<path d="M20,13H44Q50,16 50,24V56Q50,61 45,61H19Q14,61 14,56V24Q14,16 20,13Z" fill="rgba(127,227,255,.14)" stroke="#a9c4e4" stroke-width="2"/>' +
  JAR_SPOTS.map(([x, y], i) => firefly(x, y, i < lit)).join("") +
  '<path d="M19,22V52" stroke="rgba(255,255,255,.35)" stroke-width="2.5" stroke-linecap="round"/>';
const ICON = {
  facts:
    '<path d="M8,52Q10,14 52,10Q50,46 8,52Z" fill="#5fe0a8" stroke="#0a2340" stroke-width="1.5"/><path d="M10,50Q30,32 50,12" stroke="#2f9e70" stroke-width="1.5" fill="none"/><circle cx="32" cy="30" r="11" fill="#ff7b7b" stroke="#0a2340" stroke-width="1.5"/><path d="M32,19V41" stroke="#0a2340" stroke-width="1.5"/><circle cx="32" cy="18" r="4.5" fill="#0a2340"/><circle cx="27" cy="27" r="2" fill="#0a2340"/><circle cx="37" cy="27" r="2" fill="#0a2340"/><circle cx="27" cy="35" r="2" fill="#0a2340"/><circle cx="37" cy="35" r="2" fill="#0a2340"/>',
  ten:
    '<path d="M6,58Q32,20 58,58Z" fill="#d9a066" stroke="#0a2340" stroke-width="1.5"/><circle cx="32" cy="50" r="4" fill="#0a2340"/>' +
    range(10)
      .map(
        (i) =>
          `<circle cx="${10 + (i % 5) * 11}" cy="${8 + Math.floor(i / 5) * 11}" r="4" fill="${i < 7 ? "#ffc93c" : "#7fe3ff"}"/>`,
      )
      .join(""),
  pics:
    '<path d="M6,8V58" stroke="#f3f6fb" stroke-width="2"/>' +
    [
      [4, "#ff7b7b"],
      [2, "#ffc93c"],
      [3, "#6fa8ff"],
    ]
      .map(([n, c], row) =>
        range(n)
          .map((i) => `<circle cx="${17 + i * 12}" cy="${16 + row * 16}" r="5" fill="${c}"/>`)
          .join(""),
      )
      .join(""),
  bars: '<line x1="6" y1="56" x2="60" y2="56" stroke="#f3f6fb" stroke-width="2"/><rect x="10" y="28" width="12" height="28" fill="#ffc93c"/><rect x="26" y="12" width="12" height="44" fill="#ffc93c"/><rect x="42" y="36" width="12" height="20" fill="#ffc93c"/><path d="M10,36h12M10,44h12M26,20h12M26,28h12M26,36h12M26,44h12M42,44h12" stroke="#0a2340" stroke-width="3"/>',
  compare:
    '<rect x="4" y="14" width="56" height="14" rx="7" fill="#5fe0a8" stroke="#0a2340" stroke-width="1.5"/><path d="M15,14v14M26,14v14M37,14v14M48,14v14" stroke="#0a2340" stroke-width="1.2"/><circle cx="56" cy="21" r="2" fill="#0a2340"/><rect x="4" y="36" width="34" height="14" rx="7" fill="#7fe3ff" stroke="#0a2340" stroke-width="1.5"/><path d="M15,36v14M26,36v14" stroke="#0a2340" stroke-width="1.2"/><rect x="38" y="36" width="22" height="14" rx="3" fill="none" stroke="#ffc93c" stroke-width="2" stroke-dasharray="3 3"/>',
  boss: jar(4),
};
