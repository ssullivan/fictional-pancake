/* Mix Masters (Grade 6 Unit 2): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Diagrams (rowsDiagram, batchDiagram, dnl, tableFig, tapeFig) and MARKS come from shared/figures.js. Each generator deals
   one of a few kinds of problem (type), each with a comment saying what it asks. A ratio a : b keeps a and b. */
/* a number to 2 decimal places, with commas */
const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US");
/* dollars and cents: $4.50 */
const money = (n) => "$" + n.toFixed(2);
/* n and the word for it: word is [one, many] */
const pl = (word, n) => `${fmt(n)} ${word[n === 1 ? 0 : 1]}`;

/* shape names: nm(MARKS[0], 3) is 'circles' (MARKS and the diagrams are in shared/figures.js) */
const nm = (mark, n) => (n === 1 ? mark.one : mark.many);

/* ---------- Station 1: ratio language ---------- */
function genLang() {
  /* two kinds of shape, markA and markB */
  const [markA, markB] = shuffle(MARKS).slice(0, 2);
  const type = pick(["write", "write", "sentence", "sentence", "pick", "total"]);
  if (type === "write") {
    /* write the ratio of one shape to the other, named in either order */
    let nA = R(2, 9),
      nB = R(2, 9);
    while (nB === nA) nB = R(2, 9);
    const [first, second, nFirst, nSecond] = Math.random() < 0.5 ? [markA, markB, nA, nB] : [markB, markA, nB, nA],
      g = gcd(nFirst, nSecond);
    return {
      kind: "pair",
      labels: [first.many, second.many],
      answer: [nFirst, nSecond],
      equiv: true,
      fig: () =>
        rowsDiagram([
          { sh: markA, n: nA },
          { sh: markB, n: nB },
        ]),
      prompt: `Write the ratio of <b>${first.many}</b> to <b>${second.many}</b>.`,
      hint: `Count each kind of shape. The first number goes with the first thing named: ${first.many}.`,
      pmisc: [
        [
          [nSecond, nFirst],
          `Order matters. “${first.many} to ${second.many}” means the number of ${first.many} comes first.`,
        ],
        [
          [nFirst, nFirst + nSecond],
          `That compares ${first.many} to all the shapes. This asks for ${first.many} to ${second.many}.`,
        ],
      ],
      explain: `There are ${nFirst} ${first.many} and ${nSecond} ${second.many}, so the ratio is ${nFirst} : ${nSecond}.${g > 1 ? ` The equivalent ratio ${nFirst / g} : ${nSecond / g} is also correct.` : ""}`,
    };
  }
  if (type === "total") {
    /* the ratio of one shape to all of them */
    let nA = R(2, 7),
      nB = R(2, 7);
    while (nB === nA) nB = R(2, 7);
    return {
      kind: "pair",
      labels: [markA.many, "all shapes"],
      answer: [nA, nA + nB],
      equiv: true,
      fig: () =>
        rowsDiagram([
          { sh: markA, n: nA },
          { sh: markB, n: nB },
        ]),
      prompt: `Write the ratio of <b>${markA.many}</b> to <b>all the shapes</b>.`,
      hint: `“All the shapes” means the total. Add the ${markA.many} and the ${markB.many}.`,
      pmisc: [
        [
          [nA, nB],
          `That is ${markA.many} to ${markB.many}. This one asks for ${markA.many} to <i>all</i> the shapes, including the ${markA.many}.`,
        ],
        [[nA + nB, nA], "Order matters. The number of " + markA.many + " comes first."],
      ],
      explain: `${nA} ${markA.many} out of ${nA} + ${nB} = ${nA + nB} shapes. The ratio is ${nA} : ${nA + nB}.`,
    };
  }
  let a = R(1, 4),
    b = R(1, 5);
  while (b === a) b = R(1, 5);
  if (type === "sentence") {
    /* which sentence describes groups of a and b (groups of them) */
    const groups = R(2, 3),
      are = (n) => (n === 1 ? "is" : "are");
    const right = pick([
      `For every ${a} ${nm(markA, a)}, there ${are(b)} ${b} ${nm(markB, b)}.`,
      `The ratio of ${markA.many} to ${markB.many} is ${a * groups} : ${b * groups}.`,
    ]);
    const wrong = [
      {
        t: `For every ${b} ${nm(markA, b)}, there ${are(a)} ${a} ${nm(markB, a)}.`,
        why: "The numbers are switched. Count each shape inside one dashed group.",
      },
      {
        t: `The ratio of ${markB.many} to ${markA.many} is ${a * groups} : ${b * groups}.`,
        why: `This names ${markB.many} first, so the number of ${markB.many} has to come first.`,
      },
      {
        t: `The ratio of ${markA.many} to ${markB.many} is ${a} : ${a + b}.`,
        why: `${a + b} is how many shapes are in one whole group, not how many ${markB.many}.`,
      },
    ];
    const sentences = shuffle([{ t: right, ok: 1 }, ...wrong]),
      why = {};
    let answer;
    const choices = sentences.map((sentence, i) => {
      const id = "abcd"[i];
      if (sentence.ok) answer = id;
      else why[id] = sentence.why;
      return { id, label: sentence.t };
    });
    return {
      kind: "mc",
      stack: true,
      choices,
      answer,
      why,
      fig: () =>
        rowsDiagram(
          [
            { sh: markA, n: a * groups },
            { sh: markB, n: b * groups },
          ],
          { groups },
        ),
      prompt: "Which sentence describes this diagram correctly?",
      hint: "Each dashed box is one group. Count the shapes of each kind inside one box.",
      explain: `Each group has ${a} ${nm(markA, a)} and ${b} ${nm(markB, b)}. With ${groups} groups there are ${a * groups} ${markA.many} and ${b * groups} ${markB.many}. ${a * groups} : ${b * groups} is equivalent to ${a} : ${b}.`,
    };
  }
  /* pick: which diagram shows a : b; the wrong ones switch the numbers, use the total, or have one more */
  const options = shuffle([
    { p: [a, b], ok: 1 },
    { p: [b, a], why: `That diagram has ${b} ${nm(markA, b)} and ${a} ${nm(markB, a)}: the numbers are switched.` },
    { p: [a, a + b], why: `That diagram has ${a + b} ${markB.many}. The ratio asks for ${b}.` },
    { p: [a + 1, b], why: `That diagram has ${a + 1} ${markA.many}. Count again.` },
  ]);
  const why = {};
  let answer;
  const choices = options.map((option, i) => {
    const id = "abcd"[i];
    if (option.ok) answer = id;
    else why[id] = option.why;
    return {
      id,
      label: rowsDiagram(
        [
          { sh: markA, n: option.p[0] },
          { sh: markB, n: option.p[1] },
        ],
        { s: 22, label: `${option.p[0]} ${nm(markA, option.p[0])} and ${option.p[1]} ${nm(markB, option.p[1])}` },
      ),
    };
  });
  return {
    kind: "mc",
    choices,
    answer,
    why,
    prompt: `Which diagram shows a ratio of <b>${a} ${nm(markA, a)} to ${b} ${nm(markB, b)}</b>?`,
    hint: `Find the diagrams with exactly ${a} ${nm(markA, a)} first. Then check the ${markB.many}.`,
    explain: `The right diagram has ${a} ${nm(markA, a)} and ${b} ${nm(markB, b)}. The first number in a ratio goes with the first thing named.`,
  };
}

/* ---------- Station 2: recipes & color mixtures ---------- */
/* recipes: the dish, and its two ingredients x and y as [one, many] */
const RECIPES = [
  { dish: "lemonade", x: ["cup of lemon juice", "cups of lemon juice"], y: ["cup of water", "cups of water"] },
  { dish: "pancakes", x: ["cup of flour", "cups of flour"], y: ["egg", "eggs"] },
  { dish: "trail mix", x: ["cup of peanuts", "cups of peanuts"], y: ["cup of raisins", "cups of raisins"] },
  {
    dish: "fruit punch",
    x: ["cup of mango juice", "cups of mango juice"],
    y: ["cup of orange juice", "cups of orange juice"],
  },
  { dish: "granola", x: ["cup of oats", "cups of oats"], y: ["spoonful of honey", "spoonfuls of honey"] },
];
function genEquiv() {
  const type = pick(["batch", "scale", "scale", "color", "color", "yesno", "missing"]);
  if (type === "batch" || type === "scale") {
    /* a recipe a : b made in `batches` batches: how much of y in that many batches, or for that much of x */
    /* not 2 batches of 2, where adding (2 + 2) gives the same as multiplying */
    const recipe = pick(RECIPES);
    let a = R(1, 4),
      b = R(2, 6),
      batches = R(2, 5);
    while (b === a || (type === "batch" && batches === 2 && b === 2)) {
      b = R(2, 6);
      batches = R(2, 5);
    }
    const fig = (show) => batchDiagram(a, b, show ? batches : 1, recipe);
    if (type === "batch")
      return {
        kind: "num",
        unit: recipe.y[1],
        answer: batches * b,
        fig,
        prompt: `One batch of ${recipe.dish} uses ${pl(recipe.x, a)} and ${pl(recipe.y, b)}. How many ${recipe.y[1]} are in <b>${batches} batches</b>?`,
        hint: `Picture ${batches} copies of the batch. Each one has ${pl(recipe.y, b)}.`,
        misc: [
          [b + batches, `Each batch has ${b}, so ${batches} batches is ${batches} groups of ${b}. Multiply.`],
          [batches * a, `That is the ${recipe.x[1]}. The question asks for ${recipe.y[1]}.`],
        ],
        explain: `${batches} batches × ${b} = ${batches * b} ${recipe.y[1]}. The ratio ${a} : ${b} becomes ${batches * a} : ${batches * b}.`,
      };
    return {
      kind: "num",
      unit: recipe.y[1],
      answer: batches * b,
      fig,
      prompt: `A recipe for ${recipe.dish} uses ${pl(recipe.x, a)} for every ${pl(recipe.y, b)}. Jada uses <b>${pl(recipe.x, batches * a)}</b>. How many ${recipe.y[1]} does she need so it tastes the same?`,
      hint: `${batches * a} is ${batches} × ${a}, so Jada is making ${batches} batches. Multiply the ${recipe.y[1]} by ${batches} too.`,
      misc: [
        [
          b + (batches * a - a),
          `You added ${batches * a - a} to both amounts. To keep the same taste, <b>multiply</b> both amounts by the same number.`,
        ],
        ...(a > 1
          ? [
              [
                batches * a * b,
                `${batches * a} ${recipe.x[1]} is ${batches} batches, not ${batches * a}. Divide ${batches * a} by ${a} first.`,
              ],
            ]
          : []),
      ],
      explain: `${batches * a} ÷ ${a} = ${batches} batches. ${b} × ${batches} = ${batches * b} ${recipe.y[1]}. ${a} : ${b} and ${batches * a} : ${batches * b} are equivalent.`,
    };
  }
  /* a : b scaled by `scale` */
  let a = R(1, 5),
    b = R(1, 5);
  while (b === a) b = R(1, 5);
  const scale = R(2, 4);
  if (type === "color") {
    /* which paint mix makes the same shade: the wrong ones add instead, switch the colors, or scale only one */
    const options = shuffle([
      { p: [scale * a, scale * b], ok: 1 },
      {
        p: [scale * a, b + (scale - 1) * a],
        why: `${(scale - 1) * a} cups were added to both colors. Adding the same amount changes the shade. Multiply both amounts by ${scale} instead.`,
      },
      { p: [scale * b, scale * a], why: "Blue and yellow are switched, so this shade has more of the other color." },
      {
        p: [scale * a, b],
        why: `Only the blue was multiplied by ${scale}. The yellow has to be multiplied by ${scale} too.`,
      },
    ]);
    const why = {};
    let answer;
    const choices = options.map((option, i) => {
      const id = "ABCD"[i];
      if (option.ok) answer = id;
      else why[id] = option.why;
      return { id, label: `${id}. ${option.p[0]} blue : ${option.p[1]} yellow`, p: option.p };
    });
    /* the target mix as cups of blue and yellow; the hint adds a swatch of the target and of each choice */
    const fig = (show) => {
      let markup = `<text class="ftxt" x="10" y="22">Target mix</text>`;
      for (let cup = 0; cup < a; cup++) markup += `<circle class="ic-blue" cx="${24 + cup * 30}" cy="48" r="12"/>`;
      for (let cup = 0; cup < b; cup++)
        markup += `<circle class="ic-yel" cx="${24 + (a + cup) * 30 + 12}" cy="48" r="12"/>`;
      markup += `<text class="ftxt" x="10" y="88">${a} cup${a > 1 ? "s" : ""} blue : ${b} cup${b > 1 ? "s" : ""} yellow</text>`;
      let width = Math.max(360, (a + b) * 30 + 60);
      if (show) {
        markup += `<rect class="swatch" x="10" y="104" width="64" height="44" rx="8" fill="${mixColor(a, b)}"/><text class="ftxt mid" x="42" y="168">target</text>`;
        choices.forEach((choice, i) => {
          const x = 94 + i * 76;
          markup += `<rect class="swatch" x="${x}" y="104" width="64" height="44" rx="8" fill="${mixColor(...choice.p)}"/><text class="ftxt mid" x="${x + 32}" y="168">${choice.id}</text>`;
        });
        width = Math.max(width, 94 + 4 * 76);
      }
      return svgWrap(width, show ? 180 : 100, markup, "Paint mixture");
    };
    return {
      kind: "mc",
      choices,
      answer,
      why,
      fig,
      prompt: "Which mixture makes <b>the same shade</b> as the target mix?",
      hint: "Same shade means an equivalent ratio: both colors multiplied by the same number. The swatches show each mix.",
      explain: `${a} × ${scale} = ${scale * a} and ${b} × ${scale} = ${scale * b}. ${scale * a} : ${scale * b} is ${scale} batches of the target mix, so it is the same shade.`,
    };
  }
  if (type === "yesno") {
    /* is c : d equivalent to a : b? When it isn't, something was added, or the parts were scaled differently */
    const equivalent = Math.random() < 0.5;
    const [c, d, why] = equivalent
      ? [scale * a, scale * b]
      : pick([
          [a + scale, b + scale, `Adding ${scale} to both numbers does not keep the ratio the same.`],
          [scale * a, scale * b + pick([1, -1]), `${a} was multiplied by ${scale}, but ${b} was not.`],
          [scale * a, (scale + 1) * b, `${a} was multiplied by ${scale}, but ${b} was multiplied by ${scale + 1}.`],
        ]);
    return {
      kind: "mc",
      choices: [
        { id: "y", label: "Yes, equivalent" },
        { id: "n", label: "No, not equivalent" },
      ],
      answer: equivalent ? "y" : "n",
      why: { y: why || "", n: `Both numbers were multiplied by ${scale}, so they are equivalent.` },
      prompt: `Are <b>${a} : ${b}</b> and <b>${c} : ${d}</b> equivalent ratios?`,
      explain: equivalent
        ? `${a} × ${scale} = ${c} and ${b} × ${scale} = ${d}. Both parts are multiplied by the same number.`
        : `To get from ${a} to ${c} you multiply by ${fmt(c / a)}. But ${b} × ${fmt(c / a)} = ${fmt((b * c) / a)}, not ${d}.`,
    };
  }
  /* missing: the missing number in an equivalent ratio, on the left or the right */
  const left = Math.random() < 0.5;
  return {
    kind: "num",
    unit: "",
    answer: left ? scale * a : scale * b,
    prompt: left
      ? `<b>? : ${scale * b}</b> is equivalent to <b>${a} : ${b}</b>. What is the missing number?`
      : `<b>${a} : ${b}</b> is equivalent to <b>${scale * a} : ?</b>. What is the missing number?`,
    hint: left
      ? `What do you multiply ${b} by to get ${scale * b}? Do the same to ${a}.`
      : `What do you multiply ${a} by to get ${scale * a}? Do the same to ${b}.`,
    misc: left
      ? [
          [
            a + (scale * b - b),
            "You added the same amount. For equivalent ratios, multiply both numbers by the same number.",
          ],
        ]
      : [
          [
            b + (scale * a - a),
            "You added the same amount. For equivalent ratios, multiply both numbers by the same number.",
          ],
        ],
    explain: `Both numbers are multiplied by ${scale}: ${a} : ${b} = ${scale * a} : ${scale * b}.`,
  };
}

/* ---------- Station 3: double number lines ---------- */
function genDnl() {
  const type = pick(["mult", "mult", "unit", "speed", "speed"]);
  if (type === "mult") {
    /* a recipe's double number line with `ticks` batches: the amount for `batches` of them, of y or (reversed) of x.
       Each tick says what's written on top (st) and bottom (sb): 0 nothing, 1 the number, 2 only with the hint; q marks the unknown */
    const recipe = pick(RECIPES);
    let a = R(2, 5),
      b = R(2, 9);
    while (b === a) b = R(2, 9);
    const lastTick = R(4, 6),
      batches = R(3, lastTick),
      reversed = Math.random() < 0.3;
    const ticks = [];
    for (let i = 0; i <= lastTick; i++)
      ticks.push({
        t: i * a,
        b: i * b,
        st: reversed && i === batches ? 0 : reversed ? (i <= 1 ? 1 : 2) : 1,
        sb: !reversed && i === batches ? 0 : reversed ? 1 : i <= 1 ? 1 : 2,
        q: i === batches ? (reversed ? "t" : "b") : null,
      });
    const [answer, units, other] = reversed
      ? [batches * a, recipe.x[1], recipe.y[1]]
      : [batches * b, recipe.y[1], recipe.x[1]];
    const given = reversed ? batches * b : batches * a;
    return {
      kind: "num",
      unit: units,
      answer,
      fig: dnl(recipe.x[1], recipe.y[1], ticks),
      prompt: `A ${recipe.dish} recipe uses ${pl(recipe.x, a)} for every ${pl(recipe.y, b)}. How many ${units} go with <b>${given} ${other}</b>?`,
      hint: `Each tick adds one more batch: ${a} more on top and ${b} more on the bottom. The hint fills in the ticks.`,
      misc: [
        [
          reversed ? a + (batches * b - b) : b + (batches * a - a),
          "You added the same amount to both lines. Every step adds a full batch: " +
            a +
            " on top and " +
            b +
            " on the bottom.",
        ],
      ],
      explain: `${given} is ${batches} batches (${batches} × ${reversed ? b : a}). ${batches} × ${reversed ? a : b} = ${answer} ${units}.`,
    };
  }
  if (type === "unit") {
    /* the price for one, from the price for `count` */
    const item = pick([
      ["pound of apples", "pounds of apples"],
      ["bag of rice", "bags of rice"],
      ["notebook", "notebooks"],
      ["bottle of water", "bottles of water"],
    ]);
    const count = R(2, 6),
      unitPrice = pick([0.5, 0.75, 1.25, 1.5, 2, 2.5, 3, 3.5, 4.5]),
      cost = count * unitPrice;
    const ticks = [];
    for (let i = 0; i <= count; i++)
      ticks.push({ t: i, b: i * unitPrice, st: 1, sb: i === 0 || i === count ? 1 : 0, q: i === 1 ? "b" : null });
    return {
      kind: "num",
      unit: "dollars",
      answer: unitPrice,
      fig: dnl(item[1], "cost (dollars)", ticks, { fb: money }),
      prompt: `${pl(item, count)} cost ${money(cost)}. <b>How much for one?</b>`,
      hint: `The cost is split equally among ${count} ${item[1]}. Divide ${money(cost)} by ${count}.`,
      misc: [
        [
          count / cost,
          `That is how many ${item[1]} you get for one dollar. Divide the cost by the number of ${item[1]}.`,
        ],
        [cost * count, `Multiplying makes it bigger. One ${item[0]} should cost less than ${count} of them.`],
      ],
      explain: `${money(cost)} ÷ ${count} = ${money(unitPrice)} for one ${item[0]}. This is called the unit price.`,
    };
  }
  /* speed: how far in `seconds`, from the distance in `given` seconds (seconds isn't a multiple of given, so it goes through 1) */
  const who = pick(["A scooter", "A turtle robot", "A train", "A skateboarder", "A toy car"]);
  const given = R(2, 5),
    speed = R(2, 9),
    seconds = pick([...Array(11).keys()].filter((x) => x > given && x % given && x <= 10)),
    distance = given * speed;
  const ticks = [];
  for (let i = 0; i <= seconds; i++)
    ticks.push({
      t: i,
      b: i * speed,
      st: 1,
      sb: i === 0 || i === given ? 1 : i === seconds ? 0 : i === 1 ? 2 : 0,
      q: i === seconds ? "b" : null,
    });
  return {
    kind: "num",
    unit: "meters",
    answer: speed * seconds,
    fig: dnl("time (seconds)", "distance (meters)", ticks),
    prompt: `${who} moves at a constant speed. It goes ${distance} meters in ${given} seconds. How far does it go in <b>${seconds} seconds</b>?`,
    hint: `Find how far it goes in 1 second first: ${distance} ÷ ${given}. Then multiply by ${seconds}.`,
    misc: [
      [
        distance + (seconds - given),
        `Each extra second adds ${speed} meters, not 1. Find the distance for 1 second first.`,
      ],
      [distance * seconds, `${distance} meters is for ${given} seconds, not 1. Divide by ${given} first.`],
    ],
    explain: `${distance} ÷ ${given} = ${speed} meters per second. ${speed} × ${seconds} = ${speed * seconds} meters.`,
  };
}

/* ---------- Station 4: tables ---------- */
/* table stories: the headers (hx, hy), the story (s), the units (ux, uy), the first x values (ra), and the rates (rr) */
const TCTX = [
  {
    hx: "Minutes",
    hy: "Pages read",
    s: "Priya reads at a constant rate.",
    ux: "minutes",
    uy: "pages",
    ra: [2, 3, 4, 5],
    rr: [2, 3, 4],
  },
  {
    hx: "Hours worked",
    hy: "Dollars earned",
    s: "Andre earns the same amount each hour.",
    ux: "hours",
    uy: "dollars",
    ra: [2, 3, 4, 5],
    rr: [8, 9, 12, 15, 10.5],
  },
  {
    hx: "Gallons of gas",
    hy: "Miles driven",
    s: "A car uses gas at a constant rate.",
    ux: "gallons",
    uy: "miles",
    ra: [2, 3, 4],
    rr: [25, 30, 32, 35],
  },
  {
    hx: "Cups of flour",
    hy: "Muffins",
    s: "A muffin recipe always uses flour at the same rate.",
    ux: "cups of flour",
    uy: "muffins",
    ra: [2, 3, 4],
    rr: [6, 8, 12],
  },
  {
    hx: "Bags of soil",
    hy: "Plants potted",
    s: "Kiran pots plants using the same amount of soil for each group.",
    ux: "bags",
    uy: "plants",
    ra: [2, 3, 4, 5],
    rr: [4, 5, 6],
  },
];
function genTable() {
  /* the first row is a : b, at `rate` y for each x */
  const context = pick(TCTX),
    a = pick(context.ra),
    rate = pick(context.rr),
    b = a * rate;
  const type = pick(["scale", "unit", "unit", "rev"]);
  if (type === "scale") {
    /* scale the first row up; another row (× 2 or × 10) is there to see */
    const scale = R(3, 9),
      otherScale = pick([2, 10].filter((z) => z !== scale));
    const rows = [
      { x: a, y: b },
      { x: otherScale * a, y: otherScale * b },
      { x: scale * a, y: scale * b, q: "y", note: `× ${scale} from the first row` },
    ];
    return {
      kind: "num",
      unit: context.uy,
      answer: scale * b,
      fig: tableFig(context, rows),
      prompt: `${context.s} How many ${context.uy} for <b>${scale * a} ${context.ux}</b>?`,
      hint: `${scale * a} is ${scale} × ${a}. Multiply the other column by ${scale} too.`,
      misc: [
        [
          b + (scale * a - a),
          "You added. In a table of equivalent ratios, both columns are multiplied by the same number.",
        ],
      ],
      explain: `${scale * a} ÷ ${a} = ${scale}. ${b} × ${scale} = ${fmt(scale * b)} ${context.uy}.`,
    };
  }
  /* x: a number of x that isn't a multiple of a, so the table goes through 1 */
  const x = pick([...Array(12).keys()].filter((v) => v > 1 && v % a && v !== a));
  if (type === "unit") {
    const rows = [
      { x: a, y: b, note: "" },
      { x: 1, y: rate, h: 1, note: `÷ ${a}` },
      { x, y: x * rate, q: "y", note: `× ${x}` },
    ];
    return {
      kind: "num",
      unit: context.uy,
      answer: x * rate,
      fig: tableFig(context, rows),
      prompt: `${context.s} How many ${context.uy} for <b>${x} ${context.ux}</b>?`,
      hint: `${x} is not a multiple of ${a}. Go through 1 first: divide both columns by ${a}, then multiply by ${x}.`,
      misc: [
        [b + (x - a), "You added the same amount to both columns. Find the row for 1 first."],
        [x * b, `${fmt(b)} is for ${a} ${context.ux}, not 1. Divide by ${a} first.`],
      ],
      explain: `${fmt(b)} ÷ ${a} = ${fmt(rate)} ${context.uy} for 1. ${fmt(rate)} × ${x} = ${fmt(x * rate)} ${context.uy}.`,
    };
  }
  /* rev: the x for a scaled-up y */
  const scale = R(2, 8),
    rows = [
      { x: a, y: b },
      { x: 1, y: rate, h: 1, note: `÷ ${a}` },
      { x: scale * a, y: scale * b, q: "x", note: `× ${scale} from the first row` },
    ];
  return {
    kind: "num",
    unit: context.ux,
    answer: scale * a,
    fig: tableFig(context, rows),
    prompt: `${context.s} How many ${context.ux} for <b>${fmt(scale * b)} ${context.uy}</b>?`,
    hint: `What do you multiply ${fmt(b)} by to get ${fmt(scale * b)}? Multiply ${a} by the same number.`,
    misc: [
      [a + (scale * b - b), "You added. Multiply both columns by the same number."],
      [scale * b, `That is the number of ${context.uy}. The question asks for ${context.ux}.`],
    ],
    explain: `${fmt(scale * b)} ÷ ${fmt(b)} = ${scale}. ${a} × ${scale} = ${scale * a} ${context.ux}.`,
  };
}

/* ---------- Station 5: part-part-whole (tape diagrams) ---------- */
/* two parts (A, B) and what they make together */
const PCTX = [
  { A: "red beads", B: "blue beads", all: "beads" },
  { A: "students who walk", B: "students who ride the bus", all: "students" },
  { A: "cups of juice", B: "cups of sparkling water", all: "cups of punch" },
  { A: "dogs", B: "cats", all: "animals at the shelter" },
  { A: "chocolate chip cookies", B: "oatmeal cookies", all: "cookies" },
];
function genPpw() {
  /* a : b with `perBox` in each box of the tape, making total */
  const context = pick(PCTX);
  let a = R(1, 5),
    b = R(1, 5);
  while (b === a) b = R(1, 5);
  const perBox = R(2, 12),
    total = perBox * (a + b);
  const type = pick(["part", "part", "total", "other", "diff"]);
  const ratio = `The ratio of ${context.A} to ${context.B} is <b>${a} : ${b}</b>.`;
  const hint = `The tape diagram has ${a + b} equal boxes in all. Find what one box is worth, then use it.`;
  if (type === "part") {
    /* one part, from the total */
    const wantA = Math.random() < 0.5,
      [boxes, name, other] = wantA ? [a, context.A, context.B] : [b, context.B, context.A];
    return {
      kind: "num",
      unit: name,
      answer: perBox * boxes,
      fig: tapeFig(context, a, b, perBox, { qa: wantA, qb: !wantA, showT: 1 }),
      prompt: `${ratio} There are ${total} ${context.all} in all. How many are <b>${name}</b>?`,
      hint,
      misc: [
        ...(boxes > 1 ? [[perBox, `That is one box. The ${name} take up ${boxes} boxes.`]] : []),
        [total / 2, `The two parts are not equal. Split ${total} into ${a + b} equal boxes.`],
        [perBox * (a + b - boxes), `That is the number of ${other}.`],
        [total / boxes, `Divide the total by the number of boxes in all (${a + b}), not by ${boxes}.`],
      ],
      explain: `${a} + ${b} = ${a + b} boxes. ${total} ÷ ${a + b} = ${perBox} in each box. ${boxes} × ${perBox} = ${perBox * boxes} ${name}.`,
    };
  }
  /* the total, from one part */
  if (type === "total")
    return {
      kind: "num",
      unit: context.all,
      answer: total,
      fig: tapeFig(context, a, b, perBox, { showA: 1, qt: 1 }),
      prompt: `${ratio} There are ${perBox * a} ${context.A}. How many ${context.all} are there <b>in all</b>?`,
      hint,
      misc: [
        [perBox * b, `That is only the ${context.B}. Add the ${context.A} too.`],
        [
          perBox * a + b,
          `${b} is the number of boxes, not the number of ${context.B}. Find what one box is worth first.`,
        ],
        ...(a > 1 ? [[perBox * a * (a + b), `${perBox * a} is ${a} boxes. Divide by ${a} to get one box.`]] : []),
      ],
      explain: `${perBox * a} ÷ ${a} = ${perBox} in each box. ${a + b} boxes × ${perBox} = ${total} ${context.all}.`,
    };
  /* the other part, from one part */
  if (type === "other")
    return {
      kind: "num",
      unit: context.B,
      answer: perBox * b,
      fig: tapeFig(context, a, b, perBox, { showA: 1, qb: 1 }),
      prompt: `${ratio} There are ${perBox * a} ${context.A}. How many <b>${context.B}</b> are there?`,
      hint: `${perBox * a} fills ${a} boxes. Find one box, then fill ${b} boxes.`,
      misc: [
        [perBox * a + (b - a), "You added the difference in the ratio. Find what one box is worth instead."],
        [total, "That is the total. The question asks only for the " + context.B + "."],
      ],
      explain: `${perBox * a} ÷ ${a} = ${perBox} in each box. ${b} × ${perBox} = ${perBox * b} ${context.B}.`,
    };
  /* diff: how many more of the bigger part (b is made the bigger one) */
  if (a > b) [a, b] = [b, a];
  return {
    kind: "num",
    unit: "more",
    answer: perBox * (b - a),
    fig: tapeFig(context, a, b, perBox, { showT: 1 }),
    prompt: `The ratio of ${context.A} to ${context.B} is <b>${a} : ${b}</b>. There are ${total} ${context.all} in all. How many <b>more</b> ${context.B} than ${context.A} are there?`,
    hint,
    misc: [
      [b - a, `The ${context.B} have ${b - a} more <i>boxes</i>. Each box is worth ${perBox}.`],
      [perBox * b, `That is how many ${context.B} there are. Subtract the ${context.A}.`],
    ],
    explain: `${total} ÷ ${a + b} = ${perBox} in each box. ${context.B}: ${perBox * b}, ${context.A}: ${perBox * a}. ${perBox * b} − ${perBox * a} = ${perBox * (b - a)} more.`,
  };
}

/* ---------- Station 6: comparing ---------- */
const NAMES = [
  ["Noah", "Priya"],
  ["Lin", "Andre"],
  ["Kiran", "Jada"],
  ["Mai", "Diego"],
  ["Elena", "Tyler"],
];
/* A, B, or the same: the problem comparing two amounts for one (va, vb). labels: the three choices; bigger: the larger value
   wins; trapWhy: why the wrong one is wrong. */
function cmpMc(prompt, labels, va, vb, bigger, explain, trapWhy, hint) {
  const win = va === vb ? "S" : va > vb === bigger ? "A" : "B";
  const choices = [
    { id: "A", label: labels[0] },
    { id: "B", label: labels[1] },
    { id: "S", label: labels[2] },
  ];
  const why = { A: trapWhy, B: trapWhy, S: "They are not the same. Compare the amount for one." };
  if (win === "S") why.A = why.B = "Find the amount for one in each. They come out the same.";
  return { kind: "mc", choices, answer: win, why, prompt, explain, hint };
}
function genCompare() {
  const type = pick(["price", "price", "speed", "mix", "unitp"]);
  if (type === "price" || type === "unitp") {
    /* price: which store is the better deal (sometimes the same); unitp: the price for one */
    const item = pick([
      ["can of soup", "cans of soup"],
      ["granola bar", "granola bars"],
      ["notebook", "notebooks"],
      ["bottle of water", "bottles of water"],
    ]);
    let n1 = R(2, 8),
      n2 = R(2, 8);
    while (n2 === n1) n2 = R(2, 8);
    const PRICES = [0.4, 0.5, 0.6, 0.75, 0.8, 1.2, 1.25, 1.5];
    const u1 = pick(PRICES),
      u2 = Math.random() < 0.2 ? u1 : pick(PRICES.filter((x) => x !== u1));
    if (type === "unitp")
      return {
        kind: "num",
        unit: "dollars",
        answer: u1,
        prompt: `A store sells ${pl(item, n1)} for ${money(n1 * u1)}. What is the <b>price for one</b> ${item[0]}?`,
        hint: `Share the cost equally: ${money(n1 * u1)} ÷ ${n1}.`,
        misc: [[n1 / (n1 * u1), `That is ${item[1]} per dollar. Divide the cost by the number of ${item[1]}.`]],
        explain: `${money(n1 * u1)} ÷ ${n1} = ${money(u1)} for each ${item[0]}.`,
      };
    return cmpMc(
      `<b>Store A:</b> ${pl(item, n1)} for ${money(n1 * u1)}<br><b>Store B:</b> ${pl(item, n2)} for ${money(n2 * u2)}<br>Which is the better deal?`,
      ["Store A", "Store B", "Same deal"],
      u1,
      u2,
      false,
      `Price for one: Store A ${money(n1 * u1)} ÷ ${n1} = ${money(u1)}. Store B ${money(n2 * u2)} ÷ ${n2} = ${money(u2)}. ${u1 === u2 ? "Same price for one." : `The lower price for one wins: Store ${u1 < u2 ? "A" : "B"}.`}`,
      "The store with the lower total isn’t always the better deal. Compare the price for one.",
      "Find the price for one at each store. The lower one is the better deal.",
    );
  }
  if (type === "speed") {
    /* who is faster, from distances in different times (sometimes the same speed) */
    const [runner1, runner2] = shuffle(pick(NAMES));
    let v1 = R(2, 8),
      v2 = R(2, 8);
    if (Math.random() < 0.8) while (v2 === v1) v2 = R(2, 8);
    let t1 = R(3, 12),
      t2 = R(3, 12);
    while (t2 === t1) t2 = R(3, 12);
    return cmpMc(
      `${runner1} runs ${v1 * t1} meters in ${t1} seconds. ${runner2} runs ${v2 * t2} meters in ${t2} seconds. Both run at a constant speed. <b>Who is faster?</b>`,
      [runner1, runner2, "Same speed"],
      v1,
      v2,
      true,
      `${runner1}: ${v1 * t1} ÷ ${t1} = ${v1} meters per second. ${runner2}: ${v2 * t2} ÷ ${t2} = ${v2} meters per second.`,
      "Running farther doesn’t mean running faster. Compare the meters in 1 second.",
      "Find the meters per second for each runner.",
    );
  }
  /* mix: which drink is more lemony, a1 : b1 or a2 : b2 (sometimes equivalent) */
  let a1 = R(1, 4),
    b1 = R(2, 6),
    a2,
    b2;
  if (Math.random() < 0.2) {
    const scale = R(2, 3);
    a2 = a1 * scale;
    b2 = b1 * scale;
  } else {
    do {
      a2 = R(1, 5);
      b2 = R(2, 7);
    } while (a1 * b2 === a2 * b1 || (a1 === a2 && b1 === b2));
  }
  /* water: the same amount of water for both */
  const water = lcm(b1, b2);
  return cmpMc(
    `<b>Drink A:</b> ${a1} cup${a1 > 1 ? "s" : ""} of lemon juice for every ${b1} cups of water<br><b>Drink B:</b> ${a2} cup${a2 > 1 ? "s" : ""} of lemon juice for every ${b2} cups of water<br>Which drink tastes <b>more lemony</b>?`,
    ["Drink A", "Drink B", "Same taste"],
    a1 / b1,
    a2 / b2,
    true,
    `Make the water the same: A is ${(a1 * water) / b1} : ${water} and B is ${(a2 * water) / b2} : ${water}. ${a1 * b2 === a2 * b1 ? "Same lemon juice for the same water." : `More lemon juice for the same water: Drink ${a1 / b1 > a2 / b2 ? "A" : "B"}.`}`,
    "More lemon juice isn’t enough on its own: check how much water goes with it.",
    `Scale both recipes so they use the same amount of water (try ${water} cups). Then compare the lemon juice.`,
  );
}

/* ---------- stations ---------- */
const ICON = {
  lang: '<circle cx="16" cy="18" r="9" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="2.5"/><circle cx="38" cy="18" r="9" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="2.5"/><rect x="8" y="36" width="17" height="17" rx="3" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/><rect x="30" y="36" width="17" height="17" rx="3" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/><rect x="52" y="36" width="10" height="17" rx="3" fill="none" stroke="#7fe3ff" stroke-width="2.5" stroke-dasharray="3 3"/>',
  equiv:
    '<circle cx="18" cy="32" r="12" fill="#3d7bff" stroke="#9dbcff" stroke-width="2"/><circle cx="46" cy="32" r="12" fill="#ffd23c" stroke="#fff1b8" stroke-width="2"/><circle cx="32" cy="32" r="9" fill="hsl(130 72% 48%)" stroke="#f3f6fb" stroke-width="2"/>',
  dnl: '<g stroke="#f3f6fb" stroke-width="2.5"><line x1="4" y1="20" x2="60" y2="20"/><line x1="4" y1="44" x2="60" y2="44"/><line x1="10" y1="14" x2="10" y2="26"/><line x1="26" y1="14" x2="26" y2="26"/><line x1="42" y1="14" x2="42" y2="26"/><line x1="10" y1="38" x2="10" y2="50"/><line x1="26" y1="38" x2="26" y2="50"/><line x1="42" y1="38" x2="42" y2="50"/></g><rect x="50" y="50" width="12" height="12" rx="3" fill="#ffc93c"/>',
  table:
    '<rect x="8" y="8" width="48" height="48" rx="4" fill="rgba(127,227,255,.12)" stroke="#7fe3ff" stroke-width="2.5"/><line x1="32" y1="8" x2="32" y2="56" stroke="#7fe3ff" stroke-width="2.5"/><line x1="8" y1="20" x2="56" y2="20" stroke="#7fe3ff" stroke-width="2.5"/><line x1="8" y1="32" x2="56" y2="32" stroke="#7fe3ff" stroke-width="1.5"/><line x1="8" y1="44" x2="56" y2="44" stroke="#7fe3ff" stroke-width="1.5"/><rect x="37" y="46" width="14" height="8" rx="2" fill="#ffc93c"/>',
  ppw: '<g stroke-width="2.5"><rect x="6" y="14" width="14" height="14" fill="rgba(255,201,60,.25)" stroke="#ffc93c"/><rect x="20" y="14" width="14" height="14" fill="rgba(255,201,60,.25)" stroke="#ffc93c"/><rect x="6" y="36" width="14" height="14" fill="rgba(127,227,255,.2)" stroke="#7fe3ff"/><rect x="20" y="36" width="14" height="14" fill="rgba(127,227,255,.2)" stroke="#7fe3ff"/><rect x="34" y="36" width="14" height="14" fill="rgba(127,227,255,.2)" stroke="#7fe3ff"/><path d="M52,14 q6,0 6,6 v8 q0,4 4,4 q-4,0 -4,4 v8 q0,6 -6,6" fill="none" stroke="#f3f6fb"/></g>',
  compare:
    '<g stroke="#f3f6fb" stroke-width="2.5" fill="none"><line x1="32" y1="8" x2="32" y2="54"/><line x1="10" y1="16" x2="54" y2="12"/><path d="M4,34 L10,16 L18,34 Z" fill="rgba(255,201,60,.35)" stroke="#ffc93c"/><path d="M46,30 L54,12 L62,30 Z" fill="rgba(127,227,255,.3)" stroke="#7fe3ff"/><line x1="22" y1="56" x2="42" y2="56"/></g>',
  boss: '<rect x="6" y="6" width="52" height="52" rx="4" fill="none" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="5 4"/><polygon points="32,12 38,26 53,27 41,37 45,52 32,43 19,52 23,37 11,27 26,26" fill="#ffc93c"/>',
};
const ZONES = [
  {
    id: "lang",
    name: "Ratio Language Lab",
    lessons: "Lessons 1–2",
    blurb: "Read diagrams and write ratios in the right order.",
    gen: genLang,
  },
  {
    id: "equiv",
    name: "Recipe & Paint Shop",
    lessons: "Lessons 3–5",
    blurb: "Same taste, same shade: multiply both amounts by the same number.",
    gen: genEquiv,
  },
  {
    id: "dnl",
    name: "Double Number Line Track",
    lessons: "Lessons 6–9",
    blurb: "Fill in ticks, find how much for one, and work with constant speed.",
    gen: genDnl,
  },
  {
    id: "table",
    name: "Table Town",
    lessons: "Lessons 11–14",
    blurb: "Complete tables of equivalent ratios, going through 1 when you need to.",
    gen: genTable,
  },
  {
    id: "ppw",
    name: "Tape Diagram Workshop",
    lessons: "Lessons 15–16",
    blurb: "Part-part-whole problems: split the total into equal boxes.",
    gen: genPpw,
  },
  {
    id: "compare",
    name: "Better Deal Market",
    lessons: "Lessons 8–10, 14",
    blurb: "Cheaper, faster, or more lemony? Compare by finding the amount for one.",
    gen: genCompare,
  },
  {
    id: "boss",
    name: "Final Mix",
    lessons: "Whole unit · 10 problems",
    blurb: "A mixed review from every station. Aim for 3 stars.",
    gen: () => pick([genLang, genEquiv, genDnl, genTable, genPpw, genCompare])(),
  },
];
