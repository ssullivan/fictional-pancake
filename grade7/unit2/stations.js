/* Food Truck Rally (Grade 7 Unit 2): the problem generators, station list, and icons. Loaded by index.html and by
   tools/fuzz.mjs. Tables are tableFig (shared/figures.js) and graphs coordPlane (shared/algebra.js). Every problem carries
   facts for checks.js: its type (t) and the numbers its checks need. Each generator deals one of a few kinds of problem
   (type), each with a comment saying what it asks. */
/* a num problem: its named mistakes leave out any that land on the answer, and any repeats */
function numP(p) {
  const misc = (p.misc || []).filter(([v]) => Number.isFinite(v) && v > 0 && Math.abs(v - p.answer) >= 0.02);
  return { kind: "num", unit: "", ...p, misc: miscOf(p.answer, misc) };
}
/* an mc problem from [[label, why it's wrong, or null for the answer], …], leaving out wrong choices that repeat a label */
function mcP(list, p) {
  const kept = list.filter(([label], i) => list.findIndex(([other]) => other === label) === i);
  return { ...mcOf(kept, { stack: p.stack }), ...p };
}
/* a number as written: commas and up to 2 decimal places */
const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });
/* dollars as written: $3 or $2.50 */
const money = (n) => "$" + (Number.isInteger(n) ? fmt(n) : n.toFixed(2));
/* a constant of proportionality [n, d] as a number */
const val = (k) => k[0] / k[1];

/* Proportional stories: x and y as [one, many], their table headings, the letters their equations use ([x, y]), the
   constants of proportionality k ([n, d]) and x values that suit them, and words for k (rate: "dollars per taco"; one(k):
   what 1 of x goes with). frac: k is written as a fraction (otherwise as a decimal); money: y is in dollars. */
const STORIES = [
  {
    id: "tacos",
    x: ["taco", "tacos"],
    y: ["dollar", "dollars"],
    money: true,
    heads: ["tacos", "cost ($)"],
    vars: ["t", "c"],
    ks: [
      [2, 1],
      [5, 2],
      [3, 1],
      [7, 2],
      [4, 1],
    ],
    xs: [1, 2, 3, 4, 5, 6, 8, 10],
    rate: "dollars per taco",
    one: (k) => `1 taco costs ${money(val(k))}`,
  },
  {
    id: "drive",
    x: ["hour", "hours"],
    y: ["mile", "miles"],
    heads: ["time (hours)", "distance (miles)"],
    vars: ["h", "d"],
    ks: [
      [30, 1],
      [40, 1],
      [50, 1],
      [60, 1],
    ],
    xs: [1, 2, 3, 4, 5, 6],
    rate: "miles per hour",
    one: (k) => `the truck drives ${fmt(val(k))} miles in 1 hour`,
  },
  {
    id: "lemonade",
    x: ["scoop of mix", "scoops of mix"],
    y: ["cup of water", "cups of water"],
    heads: ["mix (scoops)", "water (cups)"],
    vars: ["s", "w"],
    ks: [
      [2, 1],
      [3, 1],
      [3, 2],
      [5, 2],
    ],
    xs: [2, 4, 6, 8, 10],
    rate: "cups of water per scoop",
    one: (k) => `1 scoop of mix takes ${fmt(val(k))} cups of water`,
  },
  {
    id: "pay",
    x: ["hour", "hours"],
    y: ["dollar", "dollars"],
    money: true,
    heads: ["time worked (hours)", "pay ($)"],
    vars: ["h", "p"],
    ks: [
      [9, 1],
      [10, 1],
      [12, 1],
      [15, 1],
    ],
    xs: [1, 2, 3, 4, 5, 6, 8],
    rate: "dollars per hour",
    one: (k) => `a cook earns ${money(val(k))} for 1 hour of work`,
  },
  {
    id: "flour",
    x: ["batch of muffins", "batches of muffins"],
    y: ["cup of flour", "cups of flour"],
    heads: ["batches", "flour (cups)"],
    vars: ["b", "f"],
    ks: [
      [3, 2],
      [5, 2],
      [2, 1],
      [3, 1],
    ],
    xs: [2, 3, 4, 5, 6, 8],
    rate: "cups of flour per batch",
    one: (k) => `1 batch of muffins takes ${fmt(val(k))} cups of flour`,
  },
  {
    id: "sugar",
    frac: true,
    x: ["cup of flour", "cups of flour"],
    y: ["cup of sugar", "cups of sugar"],
    heads: ["flour (cups)", "sugar (cups)"],
    vars: ["f", "s"],
    ks: [
      [1, 2],
      [1, 3],
      [2, 3],
      [3, 4],
    ],
    xs: [2, 3, 4, 6, 8, 9, 12],
    rate: "cups of sugar per cup of flour",
    one: (k) => `1 cup of flour goes with ${ftx(k)} cup of sugar`,
  },
  {
    id: "printer",
    x: ["minute", "minutes"],
    y: ["page", "pages"],
    heads: ["time (minutes)", "pages printed"],
    vars: ["m", "p"],
    ks: [
      [6, 1],
      [8, 1],
      [12, 1],
      [15, 1],
    ],
    xs: [1, 2, 3, 4, 5, 6],
    rate: "pages per minute",
    one: (k) => `the menu printer prints ${fmt(val(k))} pages in 1 minute`,
  },
];
/* k as written for its story: a fraction (stacked) for a recipe, or a decimal */
const kText = (story, k) => (story.frac ? fim(k) : fmt(val(k)));
/* a y value as written for its story */
const yText = (story, y) => (story.money ? money(y) : fmt(y));
/* n of x or y, with the right word: "3 tacos", "1 hour" */
const count = (word, n) => `${fmt(n)} ${n === 1 ? word[0] : word[1]}`;
/* a letter for a number, in italics */
const mv = (letter) => mathVar(letter);
/* the equation y = kx in a story's letters; flip: x = (1/k) y */
const eqText = (story, k, flip = false) => {
  const [xl, yl] = story.vars;
  return flip ? `${mv(xl)} = ${fim(fInv(k))}${mv(yl)}` : `${mv(yl)} = ${kText(story, k)}${mv(xl)}`;
};
/* a story with one of its constants, and the x values whose y has at most 2 decimal places */
function storyK(only = () => true) {
  const story = pick(STORIES.filter(only)),
    k = pick(story.ks),
    xs = story.xs.filter((x) => Number.isInteger(Math.round(x * val(k) * 100 * 1e6) / 1e6));
  return { story, k, xs };
}
/* n different x values from xs, least first */
const someXs = (xs, n) =>
  shuffle(xs)
    .slice(0, n)
    .sort((a, b) => a - b);

/* ---------- Station 1: tables (Lessons 1 to 3) ---------- */
function genTable() {
  const type = pick(["k", "k", "fill", "fill", "flip"]);
  const { story, k, xs } = storyK(),
    chosen = someXs(xs, 3),
    rows = chosen.map((x) => ({ x, y: x * val(k) })),
    note = `× ${story.frac ? ftx(k) : fmt(val(k))}`;
  if (type === "k") {
    /* the constant of proportionality from a table */
    const [first] = rows;
    return numP({
      prompt: `The table shows a proportional relationship between ${story.x[1]} and ${story.y[1]}. What is the <b>constant of proportionality</b>: the number of ${story.rate}?`,
      answer: val(k),
      frac: !!story.frac,
      fig: tableFig(
        { hx: story.heads[0], hy: story.heads[1] },
        rows.map((r) => ({ ...r, note })),
      ),
      hint: `Each ${story.heads[1].split(" (")[0]} is the ${story.heads[0].split(" (")[0]} times the same number. Divide: ${yText(story, first.y)} ÷ ${fmt(first.x)}.`,
      misc: [
        [
          first.x / first.y,
          `That divides the wrong way: it’s ${story.x[1]} per ${story.y[0]}. Divide ${story.y[1]} by ${story.x[1]}.`,
        ],
        [
          rows[1].y - first.y,
          `That’s how much the ${story.y[1]} go up from one row to the next. Divide each y by its x.`,
        ],
        [first.y - first.x, `In a proportional relationship you multiply by the same number, not add.`],
      ],
      explain: `${yText(story, first.y)} ÷ ${fmt(first.x)} = ${kText(story, k)}, and every row is the same: ${story.rate.split(" per ")[0]} = ${kText(story, k)} × ${story.x[1]}.`,
      facts: { t: type, k, rows },
    });
  }
  if (type === "fill") {
    /* a missing y (or x) in the table */
    const askY = Math.random() < 0.6,
      asked = rows[2],
      given = rows[0];
    return numP({
      prompt: `The table shows a proportional relationship. What number goes in place of the <b>?</b>`,
      answer: askY ? asked.y : asked.x,
      fig: tableFig({ hx: story.heads[0], hy: story.heads[1] }, [
        { ...given, note },
        { ...rows[1], note },
        { ...asked, q: askY ? "y" : "x", note },
      ]),
      hint: `Find the constant of proportionality first: ${yText(story, given.y)} ÷ ${fmt(given.x)}. Then ${askY ? "multiply" : "divide"} by it.`,
      misc: askY
        ? [
            [
              asked.x + (given.y - given.x),
              `That adds ${fmt(given.y - given.x)}, like the first row. Multiply by the constant, ${kText(story, k)}.`,
            ],
            [
              asked.x / val(k),
              `That divides. To go from ${story.x[1]} to ${story.y[1]}, multiply by ${kText(story, k)}.`,
            ],
          ]
        : [
            [
              asked.y * val(k),
              `That multiplies. To go back from ${story.y[1]} to ${story.x[1]}, divide by ${kText(story, k)}.`,
            ],
            [
              asked.y - (given.y - given.x),
              `That subtracts like an adding table. Divide by the constant, ${kText(story, k)}.`,
            ],
          ],
      explain: askY
        ? `The constant is ${yText(story, given.y)} ÷ ${fmt(given.x)} = ${kText(story, k)}, so ${fmt(asked.x)} × ${kText(story, k)} = ${fmt(asked.y)}.`
        : `The constant is ${kText(story, k)}, so ${fmt(asked.y)} ÷ ${kText(story, k)} = ${fmt(asked.x)}.`,
      facts: { t: type, k, rows, askY },
    });
  }
  /* the constant going the other way: x per y */
  const back = fInv(k),
    [first] = rows;
  return numP({
    prompt: `The table shows ${story.x[1]} and ${story.y[1]}, with ${kText(story, k)} ${story.rate}. What is the constant of proportionality going the <b>other way</b>: ${story.x[1]} per ${story.y[0]}?`,
    answer: val(back),
    frac: true,
    fig: tableFig({ hx: story.heads[0], hy: story.heads[1] }, rows),
    hint: `Going from ${story.y[1]} back to ${story.x[1]}, divide: ${fmt(first.x)} ÷ ${fmt(first.y)}.`,
    misc: [[val(k), `That’s ${story.rate}. The other way is ${story.x[1]} per ${story.y[0]}: the reciprocal.`]],
    explain: `${fmt(first.x)} ÷ ${fmt(first.y)} = ${fim(back)}. The two constants are reciprocals: ${kText(story, k)} × ${fim(back)} = 1.`,
    facts: { t: type, k, rows },
  });
}

/* ---------- Station 2: equations (Lessons 4 to 6) ---------- */
function genEquation() {
  const type = pick(["write", "write", "use", "use", "other"]);
  const { story, k, xs } = storyK(),
    [xl, yl] = story.vars;
  if (type === "write") {
    /* the equation for a story */
    const kt = kText(story, k);
    return mcP(
      [
        [eqText(story, k), null],
        [
          `${mv(xl)} = ${kt}${mv(yl)}`,
          `That multiplies the ${story.y[1]} by ${kt}. It’s the ${story.y[1]} that are ${kt} times the ${story.x[1]}.`,
        ],
        [
          `${mv(yl)} = ${mv(xl)} + ${kt}`,
          `That adds ${kt}. In a proportional relationship you multiply by the constant.`,
        ],
      ],
      {
        prompt: `${story.one(k)[0].toUpperCase() + story.one(k).slice(1)}. Which equation gives the ${story.y[1]} ${mv(yl)} for ${mv(xl)} ${story.x[1]}?`,
        hint: `Try a number: ${count(story.x, 2)} goes with ${yText(story, 2 * val(k))}.`,
        explain: `The ${story.y[1]} are always ${kt} times the ${story.x[1]}: ${eqText(story, k)}.`,
        facts: { t: type, k, vars: story.vars },
      },
    );
  }
  if (type === "use") {
    /* use the equation, forward or back */
    const x = pick(xs.filter((v) => v > 1)),
      y = x * val(k),
      forward = Math.random() < 0.55;
    return numP({
      prompt: forward
        ? `The equation ${eqText(story, k)} gives the ${story.y[1]} ${mv(yl)} for ${mv(xl)} ${story.x[1]}. What is ${mv(yl)} when ${mv(xl)} is ${fmt(x)}?`
        : `The equation ${eqText(story, k)} gives the ${story.y[1]} ${mv(yl)} for ${mv(xl)} ${story.x[1]}. What is ${mv(xl)} when ${mv(yl)} is ${fmt(y)}?`,
      answer: forward ? y : x,
      unit: forward ? (story.money ? "dollars" : story.y[1]) : story.x[1],
      hint: forward
        ? `Put ${fmt(x)} in place of ${mv(xl)}: ${kText(story, k)} × ${fmt(x)}.`
        : `${kText(story, k)} × ${mv(xl)} = ${fmt(y)}. Divide ${fmt(y)} by ${kText(story, k)}.`,
      misc: forward
        ? [
            [x + val(k), `That adds. ${kText(story, k)}${mv(xl)} means ${kText(story, k)} times ${mv(xl)}.`],
            [x / val(k), `That divides. Multiply ${fmt(x)} by ${kText(story, k)}.`],
          ]
        : [
            [
              y * val(k),
              `That multiplies again. ${mv(yl)} is already ${kText(story, k)} times ${mv(xl)}: divide to undo it.`,
            ],
            [y - val(k), `That subtracts. Undo multiplying by dividing.`],
          ],
      explain: forward
        ? `${mv(yl)} = ${kText(story, k)} × ${fmt(x)} = ${fmt(y)}.`
        : `${kText(story, k)} × ${mv(xl)} = ${fmt(y)}, so ${mv(xl)} = ${fmt(y)} ÷ ${kText(story, k)} = ${fmt(x)}.`,
      facts: { t: type, k, x, y, forward },
    });
  }
  /* the other equation: x from y */
  const back = fInv(k);
  return mcP(
    [
      [eqText(story, k, true), null],
      [
        `${mv(xl)} = ${kText(story, k)}${mv(yl)}`,
        `Check with a number: if ${mv(xl)} is 1, ${mv(yl)} is ${kText(story, k)}, but this gives ${mv(xl)} = ${kText(story, k)} × ${kText(story, k)}.`,
      ],
      [
        `${mv(xl)} = ${mv(yl)} − ${kText(story, k)}`,
        `To undo multiplying by ${kText(story, k)}, multiply by its reciprocal. Subtracting doesn’t undo it.`,
      ],
    ],
    {
      prompt: `The equation ${eqText(story, k)} gives the ${story.y[1]} for ${mv(xl)} ${story.x[1]}. Which equation gives the ${story.x[1]} ${mv(xl)} for ${mv(yl)} ${story.y[1]}?`,
      hint: `Going back, each ${story.y[0]} goes with ${fim(back)} of a ${story.x[0]}: the reciprocal of ${kText(story, k)}.`,
      explain: `Multiplying by ${fim(back)} undoes multiplying by ${kText(story, k)}, so ${eqText(story, k, true)}.`,
      facts: { t: type, k, vars: story.vars },
    },
  );
}

/* ---------- Station 3: proportional or not (Lessons 7 to 9) ---------- */
/* stories that aren't proportional, each with its rule y(x) and why */
const NOT_PROP = [
  {
    text: (a, b) =>
      `A food truck charges a ${money(b)} delivery fee plus ${money(a)} for each taco. The cost depends on the number of tacos.`,
    rule: (a, b) => (x) => a * x + b,
    why: (a, b) => `The ${money(b)} fee is there even for 0 tacos, so the cost isn’t the same multiple of the tacos.`,
    a: [2, 3],
    b: [3, 5],
    heads: ["tacos", "cost ($)"],
  },
  {
    text: (a, b) =>
      `A gym charges ${money(b)} to join and ${money(a)} for each month. The total cost depends on the number of months.`,
    rule: (a, b) => (x) => a * x + b,
    why: (a, b) => `The ${money(b)} to join is added on, so the cost isn’t the same multiple of the months.`,
    a: [10, 15],
    b: [20, 25],
    heads: ["months", "cost ($)"],
  },
  {
    text: (a, b) => `Lin is ${b} years older than Jada. Lin’s age depends on Jada’s age.`,
    rule: (a, b) => (x) => x + b,
    why: (a, b) => `Lin’s age is always ${b} more, not a multiple: at 1 and 2, the ages are ${1 + b} and ${2 + b}.`,
    a: [1],
    b: [3, 4, 5],
    heads: ["Jada’s age", "Lin’s age"],
  },
  {
    text: () => `A square’s area depends on its side length.`,
    rule: () => (x) => x * x,
    why: () => `Area is side × side, so doubling the side makes 4 times the area, not 2 times.`,
    a: [1],
    b: [0],
    heads: ["side (cm)", "area (sq cm)"],
  },
];
function genWhich() {
  const type = pick(["table", "table", "equation", "story"]);
  if (type === "table") {
    /* is the table proportional? */
    const proportional = Math.random() < 0.5;
    let rows, heads, why;
    if (proportional) {
      const { story, k, xs } = storyK();
      rows = someXs(xs, 3).map((x) => ({ x, y: x * val(k) }));
      heads = story.heads;
      why = `Every row is the same multiple: ${rows.map((r) => `${fmt(r.y)} ÷ ${fmt(r.x)} = ${kText(story, k)}`).join(", ")}.`;
    } else {
      const kind = pick(NOT_PROP),
        a = pick(kind.a),
        b = pick(kind.b),
        y = kind.rule(a, b);
      rows = someXs([1, 2, 3, 4, 5, 6], 3).map((x) => ({ x, y: y(x) }));
      heads = kind.heads;
      why = `The rows aren’t the same multiple: ${rows.map((r) => `${fmt(r.y)} ÷ ${fmt(r.x)} = ${fmt(r.y / r.x)}`).join(", ")}.`;
    }
    return mcP(
      [
        ["Proportional", proportional ? null : why],
        ["Not proportional", proportional ? why : null],
      ],
      {
        prompt: "Is the relationship in the table <b>proportional</b>?",
        fig: tableFig({ hx: heads[0], hy: heads[1] }, rows),
        hint: "Divide each y by its x. In a proportional relationship you always get the same number.",
        explain: why,
        facts: { t: type, rows, proportional },
      },
    );
  }
  if (type === "equation") {
    /* which equation is proportional? */
    const k = pick([2, 3, 4, 5, 6, 8]),
      x = mv("x"),
      y = mv("y");
    return mcP(
      [
        [`${y} = ${k}${x}`, null],
        [
          `${y} = ${x} + ${k}`,
          `Adding ${k} isn’t multiplying: when ${x} is 1, ${y} is ${1 + k}, and when ${x} is 2, ${y} is ${2 + k}, not twice as much.`,
        ],
        [`${y} = ${k}${x} + 1`, `The + 1 makes ${y} more than a multiple of ${x}: when ${x} is 0, ${y} is 1, not 0.`],
        [`${y} = ${x} × ${x}`, `${y} grows faster and faster: when ${x} doubles, ${y} is 4 times as big.`],
      ],
      {
        prompt: "Which equation shows a <b>proportional</b> relationship?",
        stack: true,
        hint: `A proportional relationship can always be written ${y} = ${mv("k")}${x}: ${y} is a number times ${x}, and nothing else.`,
        explain: `${y} = ${k}${x} has the form ${y} = ${mv("k")}${x}, with ${k} as the constant of proportionality.`,
        facts: { t: type, constant: k },
      },
    );
  }
  /* a story: proportional or not? */
  const proportional = Math.random() < 0.5;
  if (proportional) {
    const { story, k } = storyK();
    const text = `${story.one(k)[0].toUpperCase() + story.one(k).slice(1)}. The ${story.y[1]} depend on the number of ${story.x[1]}.`;
    return mcP(
      [
        ["Proportional", null],
        [
          "Not proportional",
          `Each ${story.x[0]} goes with the same ${kText(story, k)} ${story.y[1]}, so the ${story.y[1]} are always ${kText(story, k)} times the ${story.x[1]}.`,
        ],
      ],
      {
        prompt: `Is this relationship proportional? ${text}`,
        hint: "Is the second amount always the first times the same number, with nothing added?",
        explain: `The ${story.y[1]} are ${kText(story, k)} times the ${story.x[1]}, every time: ${eqText(story, k)}.`,
        facts: { t: "story", proportional, k },
      },
    );
  }
  const kind = pick(NOT_PROP),
    a = pick(kind.a),
    b = pick(kind.b);
  return mcP(
    [
      ["Proportional", kind.why(a, b)],
      ["Not proportional", null],
    ],
    {
      prompt: `Is this relationship proportional? ${kind.text(a, b)}`,
      hint: "Is the second amount always the first times the same number, with nothing added?",
      explain: kind.why(a, b),
      facts: { t: "story", proportional, rule: [1, 2].map(kind.rule(a, b)) },
    },
  );
}

/* ---------- Station 4: graphs (Lessons 10 and 11) ---------- */
/* a graph of a story's relationship up to x = xMax, with gridlines that fit y */
function storyGraph(story, k, points, { line = true, xMax = 8 } = {}) {
  const yTop = Math.max(...points.map((p) => p.y), val(k) * xMax),
    yStep = [0.5, 1, 2, 5, 10, 20, 50, 100].find((s) => yTop / s <= 10),
    yMax = Math.ceil(yTop / yStep) * yStep;
  return coordPlane(points, {
    xMax,
    yMax,
    yStep,
    xLabel: story.heads[0],
    yLabel: story.heads[1],
    line: line ? [val(k), 0] : null,
    label: `A graph of ${story.heads[1]} against ${story.heads[0]}`,
  });
}
function genGraph() {
  const type = pick(["k", "k", "meaning", "read", "isProp"]);
  const { story, k, xs } = storyK((s) => !s.frac);
  if (type === "k") {
    /* the constant from a point on the graph */
    const x = pick(xs.filter((v) => v > 1 && v <= 8)),
      y = x * val(k);
    return numP({
      prompt: `The graph shows a proportional relationship between ${story.x[1]} and ${story.y[1]}. What is the <b>constant of proportionality</b>?`,
      answer: val(k),
      fig: (show) =>
        storyGraph(story, k, [
          { x, y, t: `(${fmt(x)}, ${fmt(y)})` },
          ...(show ? [{ x: 1, y: val(k), t: `(1, ${fmt(val(k))})`, cls: "b" }] : []),
        ]),
      hint: `The point (${fmt(x)}, ${fmt(y)}) is on the line. Divide: ${fmt(y)} ÷ ${fmt(x)}. That’s the y at x = 1.`,
      misc: [
        [y, `That’s the y of the point. Divide it by its x, ${fmt(x)}.`],
        [x / y, `That divides the wrong way. The constant is y ÷ x.`],
      ],
      explain: `${fmt(y)} ÷ ${fmt(x)} = ${fmt(val(k))}, so the line goes through (1, ${fmt(val(k))}): the constant is ${fmt(val(k))}.`,
      facts: { t: type, k, x, y },
    });
  }
  if (type === "meaning") {
    /* what a point on the graph means */
    const x = pick(xs.filter((v) => v > 1 && v <= 8)),
      y = x * val(k),
      useOne = Math.random() < 0.5,
      [px, py] = useOne ? [1, val(k)] : [x, y];
    return mcP(
      [
        [`${count(story.x, px)} go${px === 1 ? "es" : ""} with ${story.money ? money(py) : count(story.y, py)}`, null],
        [
          `${count(story.x, py)} go${py === 1 ? "es" : ""} with ${story.money ? money(px) : count(story.y, px)}`,
          `That swaps the numbers. The first number, ${fmt(px)}, is across the bottom: ${story.x[1]}.`,
        ],
        [
          `${story.money ? money(px + py) : count(story.y, px + py)} in all`,
          `A point is a pair of numbers that go together, not a sum.`,
        ],
      ],
      {
        prompt: `The graph shows ${story.y[1]} for ${story.x[1]}. What does the point (${fmt(px)}, ${fmt(py)}) mean?`,
        fig: () => storyGraph(story, k, [{ x: px, y: py, t: `(${fmt(px)}, ${fmt(py)})` }]),
        hint: `The first number goes across (${story.heads[0]}), and the second goes up (${story.heads[1]}).`,
        explain: `(${fmt(px)}, ${fmt(py)}) is ${fmt(px)} across and ${fmt(py)} up: ${count(story.x, px)} and ${story.money ? money(py) : count(story.y, py)}.${px === 1 ? ` That’s the constant of proportionality: ${story.one(k)}.` : ""}`,
        facts: { t: type, k, px, py },
      },
    );
  }
  if (type === "read") {
    /* read a value off the graph */
    const [x1, x2] = someXs(
        xs.filter((v) => v <= 8),
        2,
      ),
      y1 = x1 * val(k),
      answer = x2 * val(k);
    return numP({
      prompt: `The graph shows a proportional relationship through (${fmt(x1)}, ${fmt(y1)}). How many ${story.money ? "dollars" : story.y[1]} go with <b>${count(story.x, x2)}</b>?`,
      answer,
      unit: story.money ? "dollars" : story.y[1],
      fig: (show) =>
        storyGraph(story, k, [
          { x: x1, y: y1, t: `(${fmt(x1)}, ${fmt(y1)})` },
          ...(show ? [{ x: x2, y: answer, cls: "b" }] : []),
        ]),
      hint: `The constant is ${fmt(y1)} ÷ ${fmt(x1)} = ${fmt(val(k))}. Multiply ${fmt(x2)} by it, or follow the line up from ${fmt(x2)}.`,
      misc: [
        [y1 + (x2 - x1), `That adds 1 for each step across. Each step across goes up ${fmt(val(k))}.`],
        [x2, `That’s the number across. Go up to the line from ${fmt(x2)}.`],
      ],
      explain: `${fmt(x2)} × ${fmt(val(k))} = ${fmt(answer)}, so the point (${fmt(x2)}, ${fmt(answer)}) is on the line.`,
      facts: { t: type, k, x: x2, y: answer },
    });
  }
  /* is the graph proportional? A line through (0, 0), a line that misses it, or points that curve */
  const shape = pick(["through", "through", "misses", "curve"]),
    proportional = shape === "through",
    b = pick([2, 3, 4, 5]) * (val(k) >= 10 ? 5 : 1),
    gx = someXs([1, 2, 3, 4, 5, 6], 4),
    yOf = (x) => (shape === "through" ? x * val(k) : shape === "misses" ? x * val(k) + b : x * x),
    points = gx.map((x) => ({ x, y: yOf(x) })),
    why = {
      through: "The points are on a straight line through (0, 0): proportional.",
      misses: `The points are on a straight line, but it crosses the y-axis at ${fmt(b)}, not at (0, 0).`,
      curve: "The points curve upward instead of lying on a straight line.",
    }[shape];
  return mcP(
    [
      ["Proportional", proportional ? null : why],
      ["Not proportional", proportional ? why : null],
    ],
    {
      prompt: `Is the relationship in the graph <b>proportional</b>?`,
      fig: () =>
        coordPlane(points, {
          xMax: 7,
          yMax: Math.ceil(Math.max(...points.map((p) => p.y)) / 10) * 10 + 10,
          yStep: 5 * Math.ceil(Math.max(...points.map((p) => p.y)) / 50),
          xLabel: "x",
          yLabel: "y",
          line: shape === "curve" ? null : [val(k), shape === "misses" ? b : 0],
          label: "A graph of points",
        }),
      hint: "The graph of a proportional relationship is a straight line through (0, 0).",
      explain: why,
      facts: { t: "isProp", proportional, points },
    },
  );
}

/* ---------- Station 5: comparing relationships (Lessons 12 and 13) ---------- */
/* two food trucks' prices per taco */
const TRUCKS = ["Taco Loco", "El Fuego", "Salsa Wagon", "Tortilla Time"];
function genCompare() {
  const type = pick(["graphs", "graphs", "mixed", "flip"]);
  if (type === "graphs" || type === "mixed") {
    /* which truck charges more per taco: two lines, or a table and an equation */
    const [nameA, nameB] = shuffle(TRUCKS).slice(0, 2),
      [kA, kB] = shuffle([2, 2.5, 3, 3.5, 4]).slice(0, 2),
      more = kA > kB ? nameA : nameB,
      less = kA > kB ? nameB : nameA,
      askMore = Math.random() < 0.5,
      best = askMore ? more : less;
    const fig =
      type === "graphs"
        ? () =>
            coordPlane(
              [
                { x: 2, y: 2 * kA, t: nameA },
                { x: 7, y: 7 * kB, t: nameB, cls: "b" },
              ],
              {
                xMax: 8,
                yMax: 30,
                yStep: 5,
                xLabel: "tacos",
                yLabel: "cost ($)",
                shapes: [
                  {
                    pts: [
                      [0, 0],
                      [30 / Math.max(kA, 3.75), (30 / Math.max(kA, 3.75)) * kA],
                    ],
                  },
                  {
                    pts: [
                      [0, 0],
                      [30 / Math.max(kB, 3.75), (30 / Math.max(kB, 3.75)) * kB],
                    ],
                    cls: "walk",
                  },
                ],
                label: `Two lines from (0, 0): ${nameA} and ${nameB}`,
              },
            )
        : () =>
            tableFig(
              { hx: "tacos", hy: `${nameA} cost ($)` },
              [2, 4, 6].map((x) => ({ x, y: x * kA })),
            )(false) + `<p class="eq">${nameB}: ${mv("c")} = ${fmt(kB)}${mv("t")}</p>`;
    return mcP(
      [
        [nameA, best === nameA ? null : `${nameA} charges ${money(kA)} per taco and ${nameB} ${money(kB)}.`],
        [nameB, best === nameB ? null : `${nameA} charges ${money(kA)} per taco and ${nameB} ${money(kB)}.`],
      ],
      {
        prompt: `Which truck charges <b>${askMore ? "more" : "less"}</b> per taco?`,
        fig,
        hint:
          type === "graphs"
            ? "The steeper line goes up more for each taco."
            : `Find the price of 1 taco at each: divide the table’s cost by its tacos, and read the equation’s constant.`,
        explain: `${more} charges ${money(Math.max(kA, kB))} per taco, more than ${less}’s ${money(Math.min(kA, kB))}${type === "graphs" ? `, so ${more}’s line is steeper` : ""}.`,
        facts: { t: type, kA, kB, nameA, nameB, best, askMore },
      },
    );
  }
  /* the same relationship graphed the other way round: the constant is the reciprocal */
  const { story, k } = storyK((s) => val(s.ks[0]) <= 5),
    back = fInv(k);
  return numP({
    prompt: `A graph of ${story.y[1]} (up) against ${story.x[1]} (across) has a constant of proportionality of ${kText(story, k)}. Han graphs the same relationship the other way round: ${story.x[1]} up, ${story.y[1]} across. What is its constant of proportionality?`,
    answer: val(back),
    frac: true,
    hint: `Now it’s ${story.x[1]} per ${story.y[0]}. Each ${story.y[0]} goes with 1 ÷ ${kText(story, k)} ${story.x[1]}.`,
    misc: [[val(k), `That’s the first graph’s constant. Swapping the axes gives the reciprocal.`]],
    explain: `The new graph shows ${story.x[1]} per ${story.y[0]}: 1 ÷ ${kText(story, k)} = ${fim(back)}.`,
    facts: { t: type, k },
  });
}

/* ---------- Station 6: four representations (Lesson 14) ---------- */
function genFour() {
  const type = pick(["graphEq", "tableEq", "point", "point"]);
  const { story, k, xs } = storyK((s) => !s.frac && val(s.ks[0]) <= 15),
    kt = kText(story, k),
    [xl, yl] = story.vars,
    x = pick(xs.filter((v) => v > 1 && v <= 8)),
    y = x * val(k);
  if (type === "graphEq" || type === "tableEq") {
    /* the equation that matches a graph or a table */
    const rows = someXs(
      xs.filter((v) => v <= 8),
      3,
    ).map((v) => ({ x: v, y: v * val(k) }));
    return mcP(
      [
        [eqText(story, k), null],
        [
          `${mv(yl)} = ${fim(fInv(k))}${mv(xl)}`,
          `That’s the constant going the other way. Divide ${story.y[1]} by ${story.x[1]}: ${fmt(y)} ÷ ${fmt(x)}.`,
        ],
        [
          `${mv(yl)} = ${mv(xl)} + ${fmt(y - x)}`,
          `That works for ${fmt(x)} only. In a proportional relationship you multiply by the constant.`,
        ],
      ],
      {
        prompt: `Which equation matches the ${type === "graphEq" ? "graph" : "table"}? (${mv(xl)} is ${story.x[1]} and ${mv(yl)} is ${story.y[1]}.)`,
        fig:
          type === "graphEq"
            ? () => storyGraph(story, k, [{ x, y, t: `(${fmt(x)}, ${fmt(y)})` }])
            : tableFig({ hx: story.heads[0], hy: story.heads[1] }, rows),
        hint: "Find the constant of proportionality: divide a y by its x.",
        explain: `${fmt(y)} ÷ ${fmt(x)} = ${kt}, so ${eqText(story, k)}.`,
        facts: { t: type, k, vars: story.vars, x, y },
      },
    );
  }
  /* which point is on the graph of an equation */
  return mcP(
    [
      [`(${fmt(x)}, ${fmt(y)})`, null],
      [
        `(${fmt(y)}, ${fmt(x)})`,
        `That swaps the numbers. The first number is ${mv(xl)}: when ${mv(xl)} is ${fmt(y)}, ${mv(yl)} is ${fmt(y * val(k))}.`,
      ],
      [
        `(${fmt(x)}, ${fmt(x + val(k))})`,
        `That adds ${kt} to ${fmt(x)}. ${eqText(story, k)} multiplies: ${kt} × ${fmt(x)}.`,
      ],
    ],
    {
      prompt: `Which point is on the graph of ${eqText(story, k)}, where ${mv(xl)} is ${story.x[1]} and ${mv(yl)} is ${story.y[1]}?`,
      hint: `Put each point’s first number in for ${mv(xl)}. Does the equation give its second number?`,
      explain: `When ${mv(xl)} = ${fmt(x)}, ${mv(yl)} = ${kt} × ${fmt(x)} = ${fmt(y)}, so (${fmt(x)}, ${fmt(y)}) is on the graph.`,
      facts: { t: type, k, x, y },
    },
  );
}

const ZONES = [
  {
    id: "table",
    name: "Table Talk",
    lessons: "Lessons 1–3",
    blurb: "Find the constant of proportionality in a table, fill in missing values, and go the other way.",
    gen: genTable,
  },
  {
    id: "equation",
    name: "Equation Station",
    lessons: "Lessons 4–6",
    blurb: "Write y = kx for a story, use it both ways, and find the equation that goes back.",
    gen: genEquation,
  },
  {
    id: "which",
    name: "Proportional or Not?",
    lessons: "Lessons 7–9",
    blurb: "Decide whether a table, an equation, or a story is proportional.",
    gen: genWhich,
  },
  {
    id: "graph",
    name: "Graph Grill",
    lessons: "Lessons 10–11",
    blurb: "Read the constant from a graph, say what a point means, and spot graphs that aren’t proportional.",
    gen: genGraph,
  },
  {
    id: "compare",
    name: "Best Deal",
    lessons: "Lessons 12–13",
    blurb: "Compare two trucks’ prices by their graphs, tables, and equations, and swap a graph’s axes.",
    gen: genCompare,
  },
  {
    id: "four",
    name: "Four Ways",
    lessons: "Lesson 14",
    blurb: "Match a story, a table, a graph, and an equation that show the same relationship.",
    gen: genFour,
  },
  {
    id: "boss",
    name: "Rally Finals",
    lessons: "Whole unit · 10 problems",
    blurb: "A mixed review from every station. Aim for 3 stars.",
    gen: () => pick([genTable, genEquation, genWhich, genGraph, genCompare, genFour])(),
  },
];

const ICON = {
  table:
    '<rect x="10" y="8" width="44" height="48" rx="4" fill="rgba(9,32,61,.6)" stroke="#f3f6fb" stroke-width="2"/><path d="M32,8 V56 M10,22 H54" stroke="#f3f6fb" stroke-width="2"/><g fill="#ffc93c" font-size="10" font-weight="700" font-family="monospace" text-anchor="middle"><text x="21" y="36">2</text><text x="43" y="36">6</text><text x="21" y="50">4</text><text x="43" y="50">12</text></g>',
  equation:
    '<text x="32" y="40" fill="#ffc93c" font-size="18" font-weight="800" text-anchor="middle" font-family="monospace">y=kx</text>',
  which:
    '<path d="M8,52 L56,12" stroke="#5fe0a8" stroke-width="3.5"/><path d="M8,40 L56,16" stroke="#ff9a86" stroke-width="3.5" stroke-dasharray="5 4"/><path d="M8,8 V56 H58" fill="none" stroke="#f3f6fb" stroke-width="2.5"/>',
  graph:
    '<path d="M8,8 V56 H58" fill="none" stroke="#f3f6fb" stroke-width="2.5"/><path d="M8,56 L52,14" stroke="#7fe3ff" stroke-width="3"/><circle cx="30" cy="35" r="5" fill="#ffc93c"/>',
  compare:
    '<path d="M8,8 V56 H58" fill="none" stroke="#f3f6fb" stroke-width="2.5"/><path d="M8,56 L40,10" stroke="#ffc93c" stroke-width="3"/><path d="M8,56 L58,30" stroke="#7fe3ff" stroke-width="3" stroke-dasharray="5 4"/>',
  four: '<rect x="6" y="6" width="24" height="24" rx="3" fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="2"/><rect x="34" y="6" width="24" height="24" rx="3" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2"/><rect x="6" y="34" width="24" height="24" rx="3" fill="rgba(255,138,196,.3)" stroke="#ff8ac4" stroke-width="2"/><rect x="34" y="34" width="24" height="24" rx="3" fill="rgba(95,224,168,.3)" stroke="#5fe0a8" stroke-width="2"/>',
  boss: '<path d="M8,40 h40 l8,-10 v-10 h-14 l-6,-8 h-20 z" fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="2.5" stroke-linejoin="round"/><circle cx="18" cy="44" r="6" fill="#0a2340" stroke="#f3f6fb" stroke-width="2.5"/><circle cx="44" cy="44" r="6" fill="#0a2340" stroke="#f3f6fb" stroke-width="2.5"/>',
};
