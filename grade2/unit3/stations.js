/* Inchworm Trail (Grade 2 Unit 3): the problem generators, station list, and icons. Loaded by index.html and by
   tools/fuzz.mjs. Things to measure, rulers, units laid end to end, and foot rulers come from this unit's figs.js; line plots
   from shared/graphs.js; tape diagrams and number lines from shared/numlines.js; and mcOf and miscOf from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Every problem
   carries `facts`, the numbers it was made from, so checks.js can work the answer out again. Things have real-life lengths,
   in whole centimeters, inches, feet, and meters within 100. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* two different students */
const twoKids = () => shuffle(KIDS).slice(0, 2);
/* named mistakes, leaving out any that land on the answer for these numbers (the mistake doesn't show up then) */
const named = (answer, list) =>
  miscOf(
    answer,
    list.filter(([value]) => value !== answer && value > 0),
  );
/* "a pencil", "an eraser" */
const aName = (kind) => (/^[aeiou]/.test(NAME[kind]) ? "an " : "a ") + NAME[kind];
/* desk things and how long they really are, in whole centimeters and inches: [shortest, longest] */
const DESK = {
  eraser: { cm: [4, 6], in: [2, 2] },
  crayon: { cm: [8, 10], in: [3, 4] },
  glue: { cm: [8, 11], in: [3, 4] },
  marker: { cm: [12, 15], in: [5, 6] },
  pencil: { cm: [14, 19], in: [6, 7] },
};
/* a desk thing and a real length for it in the unit */
const deskThing = (unit, kinds = Object.keys(DESK)) => {
  const kind = pick(kinds);
  return { kind, len: R(...DESK[kind][unit]) };
};
/* a ruler with the thing on it from `at`; the ruler is long enough for the thing and a little more */
const rulerFig = (unit, kind, at, len, options = {}) =>
  ruler(unit === "cm" ? Math.max(12, at + len + 2) : Math.max(6, at + len + 1), {
    unit,
    obj: { kind, at, len },
    ...options,
  });

/* ---------- Cube Creek: units of length (Lessons 1–3) ---------- */
function genUnits() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* centimeter cubes lined up under a thing; the hint numbers them */
    const { kind, len } = deskThing("cm"),
      u = 24;
    return {
      kind: "num",
      unit: "cm",
      answer: len,
      facts: { t: "cubes", kind, len },
      prompt: `Each cube is 1 centimeter long. How long is the ${NAME[kind]}?`,
      fig: (show) =>
        svgWrap(
          20 + len * u,
          show ? 90 : 76,
          thing(kind, 10, 8, len * u) +
            unitRow("cube", len, 10, 46, u) +
            (show
              ? range(len)
                  .map((i) => `<text class="lbl s cy" x="${10 + i * u + u / 2}" y="${82}">${i + 1}</text>`)
                  .join("")
              : ""),
          `${aName(kind)} with centimeter cubes under it`,
        ),
      misc: named(len, [
        [len + 1, "Count the cubes, not the lines between them."],
        [len - 1, "Count every cube, all the way to the end."],
      ]),
      hint: "Count the cubes from one end of it to the other.",
      explain: `${len} cubes reach from one end to the other. Each is 1 cm, so it’s ${len} cm long.`,
    };
  }
  if (variant === 1 || variant === 2) {
    /* read a ruler: the thing starts at 0 (variant 1) or somewhere else (variant 2) */
    const unit = Math.random() < 0.6 ? "cm" : "in",
      { kind, len } = deskThing(unit),
      at = variant === 1 ? 0 : R(1, unit === "cm" ? 5 : 3),
      end = at + len,
      word = unit === "cm" ? "centimeters" : "inches";
    return {
      kind: "num",
      unit,
      answer: len,
      facts: { t: "ruler", unit, kind, at, len },
      prompt: `How long is the ${NAME[kind]}, in ${word}?`,
      fig: (show) => rulerFig(unit, kind, at, len, { span: show, count: show }),
      misc: named(len, [
        ...(at ? [[end, `${end} is where it ends. It starts at ${at}, not 0.`]] : []),
        [len + 1, "Count the spaces between the marks, not the marks."],
        ...(at ? [[at, `${at} is where it starts. How many ${word} long is it?`]] : []),
      ]),
      hint: at
        ? `It starts at ${at}. Count the spaces from ${at} to the end.`
        : "It starts at 0. Read the number at its end.",
      explain: at
        ? `It goes from ${at} to ${end}: ${end} − ${at} = ${len} ${word}.`
        : `It starts at 0 and ends at ${len}: ${len} ${word}.`,
    };
  }
  /* same thing, different units: which unit takes the fewest (or most) to measure it? Cubes are 1 cm, clips 3, erasers 5 */
  const kind = pick(["pencil", "marker"]),
    len = 15,
    fewest = Math.random() < 0.5,
    kid = pick(KIDS),
    counts = { cube: 15, clip: 5, eraser: 3 },
    answer = fewest ? "eraser" : "cube";
  return {
    ...mcOf(
      ["cube", "clip", "eraser"].map((unit) => [
        UNITK[unit].name,
        unit === answer
          ? null
          : fewest
            ? `It takes ${counts[unit]} ${UNITK[unit].name}. Longer units take fewer.`
            : `It takes ${counts[unit]} ${UNITK[unit].name}. Shorter units take more.`,
      ]),
    ),
    facts: { t: "units", fewest, counts },
    prompt: `${kid} measures ${aName(kind)} with cubes, paper clips, and erasers. Which one takes the <b>${fewest ? "fewest" : "most"}</b>?`,
    fig: (show) =>
      show
        ? unitsFig(
            kind,
            len,
            [
              ["cube", 15],
              ["clip", 5],
              ["eraser", 3],
            ],
            20,
          )
        : svgWrap(20 + len * 20, 40, thing(kind, 10, 8, len * 20), `${aName(kind)}`) + unitKey(),
    hint: fewest ? "The longest unit takes the fewest to cover it." : "The shortest unit takes the most to cover it.",
    explain: `It takes 15 cubes, 5 paper clips, or 3 erasers. The ${fewest ? "longest unit, the eraser, takes the fewest" : "shortest unit, the cube, takes the most"}.`,
  };
}
/* one cube, one paper clip, and one eraser side by side with their names, 20 pixels per cm */
const unitKey = () =>
  svgWrap(
    300,
    56,
    unitRow("cube", 1, 10, 8, 20) +
      `<text class="lbl s" x="20" y="46">cube</text>` +
      unitRow("clip", 1, 80, 10, 20) +
      `<text class="lbl s" x="110" y="46">clip</text>` +
      unitRow("eraser", 1, 180, 9, 20) +
      `<text class="lbl s" x="230" y="46">eraser</text>`,
    "A cube, a paper clip, and an eraser",
  );

/* ---------- Gecko Rocks: centimeters and meters (Lessons 4–6) ---------- */
/* reptiles and their real lengths in centimeters: [name, shortest, longest] */
const REPTILES = [
  ["leopard gecko", 18, 25],
  ["green anole", 12, 20],
  ["box turtle", 11, 18],
  ["bearded dragon", 40, 55],
  ["blue-tongued skink", 40, 55],
  ["garter snake", 50, 70],
  ["corn snake", 70, 99],
];
/* things to measure in meters, and in centimeters */
const LONG = ["the hallway", "a school bus", "the playground", "a swimming pool", "the classroom", "a soccer field"];
const SHORT = ["a crayon", "an eraser", "a spoon", "a pencil", "a book", "a shoe", "a paper clip"];
function genCm() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* estimate against a 10 cm strip: about 5, 15, or 30 cm */
    const [kind, len, guess] = pick([
      ...range(3).map((i) => ["eraser", 4 + i, 5]),
      ...range(3).map((i) => ["marker", 13 + i, 15]),
      ...range(3).map((i) => ["pencil", 14 + i, 15]),
      ...range(4).map((i) => ["book", 27 + i, 30]),
    ]);
    return {
      ...mcOf(
        [5, 15, 30].map((g) => [
          `about ${g} cm`,
          g === guess
            ? null
            : g < len
              ? `The ${NAME[kind]} is longer than that. Compare it with the 10 cm strip.`
              : `The ${NAME[kind]} is shorter than that. Compare it with the 10 cm strip.`,
        ]),
      ),
      facts: { t: "estimate", kind, len },
      prompt: `About how long is the ${NAME[kind]}?`,
      fig: (show) => (show ? ruler(len + 3, { u: 24, obj: { kind, at: 0, len } }) : estFig(kind, len)),
      hint: "The strip is 10 cm. Is the thing shorter than the strip, a bit longer, or about 3 strips long?",
      explain: `It’s ${len} cm long, so about ${guess} cm is the best estimate.`,
    };
  }
  if (variant === 1) {
    /* which would you measure in meters (one long thing), or in centimeters (one short thing)? */
    const meters = Math.random() < 0.6,
      [right] = shuffle(meters ? LONG : SHORT),
      wrongs = shuffle(meters ? SHORT : LONG).slice(0, 2);
    return {
      ...mcOf([
        [right, null],
        ...wrongs.map((thing) => [
          thing,
          meters
            ? `${thing[0].toUpperCase() + thing.slice(1)} is short. Centimeters fit it better.`
            : `${thing[0].toUpperCase() + thing.slice(1)} is long. Meters fit it better.`,
        ]),
      ]),
      facts: { t: "meters", meters, right },
      prompt: `Which would you measure in <b>${meters ? "meters" : "centimeters"}</b>?`,
      fig: () =>
        svgWrap(
          260,
          40,
          `<rect class="mst a" x="10" y="8" width="240" height="26"/><text class="lbl s dk" x="130" y="21">1 meter = 100 centimeters</text>`,
          "A meter stick: 1 meter is 100 centimeters",
        ),
      hint: "A meter is about as long as a big step. Use meters for long things and centimeters for short things.",
      explain: `${right[0].toUpperCase() + right.slice(1)} is ${meters ? "long, so meters fit" : "short, so centimeters fit"} it.`,
    };
  }
  /* how much longer is one reptile than another? At most one broken ten */
  let longer, shorter, big, small;
  do {
    [longer, shorter] = shuffle(REPTILES).slice(0, 2);
    big = R(longer[1], longer[2]);
    small = R(shorter[1], shorter[2]);
  } while (big - small < 3 || longer[0].split(" ").pop() === shorter[0].split(" ").pop());
  const diff = big - small,
    cap = (text) => text[0].toUpperCase() + text.slice(1);
  return {
    kind: "num",
    unit: "cm",
    answer: diff,
    facts: { t: "reptiles", big, small, longer: longer[0], shorter: shorter[0] },
    prompt: `A ${longer[0]} is ${big} cm long. A ${shorter[0]} is ${small} cm long. How much longer is the ${longer[0]}?`,
    fig: (show) =>
      tapes(
        [
          { label: cap(longer[0].split(" ").pop()), n: big, show: big },
          { label: cap(shorter[0].split(" ").pop()), n: small, show: small },
        ],
        { diff: show ? diff : "?" },
      ),
    misc: named(diff, [
      [big + small, "That’s both lengths together. How much longer is the difference."],
      [big, `${big} cm is how long the ${longer[0]} is. How much longer than the ${shorter[0]}?`],
    ]),
    hint: `Find ${big} − ${small}, or count up from ${small} to ${big}.`,
    explain: `${big} − ${small} = ${diff}. The ${longer[0]} is ${diff} cm longer.`,
  };
}

/* ---------- Inch Hill: inches and feet (Lessons 8–10) ---------- */
/* things measured in feet: [kind, shortest, longest] */
const FEET = [
  ["poster", 2, 3],
  ["rug", 3, 5],
  ["bench", 4, 5],
];
function genInches() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* feet to inches: a foot is 12 inches */
    const [kind, lo, hi] = pick(FEET),
      ft = R(lo, hi),
      inches = 12 * ft;
    return {
      kind: "num",
      unit: "inches",
      answer: inches,
      facts: { t: "feet", kind, ft },
      prompt: `${aName(kind)[0].toUpperCase() + aName(kind).slice(1)} is ${ft} feet long. How many inches long is it?`,
      fig: (show) => feetFig(kind, ft, ft, ft, !show),
      misc: named(inches, [
        [ft, `${ft} is how many feet. Each foot is 12 inches.`],
        [10 * ft, "A foot is 12 inches, not 10."],
        [12, "12 inches is just 1 foot."],
      ]),
      hint: `Each foot ruler is 12 inches. Count by 12s: ${range(ft)
        .map((i) => 12 * (i + 1))
        .slice(0, 2)
        .join(", ")}, …`,
      explain: `${range(ft)
        .map(() => 12)
        .join(" + ")} = ${inches}. ${ft} feet is ${inches} inches.`,
    };
  }
  if (variant === 1) {
    /* a torn tape: the ruler starts past 0, and so does the thing */
    const { kind, len } = deskThing("in"),
      start = R(3, 8),
      at = start + R(0, 1),
      end = at + len;
    return {
      kind: "num",
      unit: "inches",
      answer: len,
      facts: { t: "torn", kind, start, at, len },
      prompt: `The tape is torn. How long is the ${NAME[kind]}?`,
      fig: (show) => ruler(len + 3, { unit: "in", start, torn: true, obj: { kind, at, len }, span: show, count: show }),
      misc: named(len, [
        [end, `${end} is where it ends on the tape. It starts at ${at}, not 0.`],
        [len + 1, "Count the spaces between the marks, not the marks."],
      ]),
      hint: `It starts at ${at}. Count the inches from ${at} to ${end}.`,
      explain: `It goes from ${at} to ${end}: ${end} − ${at} = ${len} inches.`,
    };
  }
  /* inches or centimeters: the same thing is more centimeters than inches (about 2 or 3 for each inch) */
  const { kind, len } = deskThing("in", ["crayon", "marker", "pencil"]),
    cm = Math.round(len * 2.54);
  return {
    ...mcOf([
      [`about ${cm} cm`, null],
      [`about ${len} cm`, "A centimeter is shorter than an inch, so it takes more centimeters."],
      [`about ${len * 12} cm`, "That’s too many. One inch is only about 2 or 3 centimeters."],
    ]),
    facts: { t: "inchToCm", kind, len, cm },
    prompt: `${aName(kind)[0].toUpperCase() + aName(kind).slice(1)} is ${len} inches long. About how many centimeters long is it?`,
    fig: () => rulerFig("in", kind, 0, len),
    hint: "A centimeter is shorter than an inch. One inch is about 2 or 3 centimeters.",
    explain: `Each inch is about 2 or 3 centimeters, so ${len} inches is about ${cm} cm.`,
  };
}

/* ---------- Silk Bridge: length stories (Lessons 11–12) ---------- */
/* a number line from 0 to max (counting by ones, numbered every 5 or 10) with arrows above it */
const silkLine = (max, arrows, shown, label) =>
  numLine(0, max, { big: max > 50 ? 10 : 5, arrows, shown, label, pad: 18 });
function genSilk() {
  const variant = R(0, 3),
    [kid, friend] = twoKids();
  if (variant === 0) {
    /* tie two pieces together */
    /* half the time the ones make a new ten */
    const makeTen = Math.random() < 0.5;
    let a, b;
    do {
      a = R(8, 35);
      b = R(5, 25);
    } while (a + b > 50 || (a % 10) + (b % 10) >= 10 !== makeTen);
    const total = a + b;
    return {
      kind: "num",
      unit: "inches",
      answer: total,
      facts: { t: "silk", op: "+", a, b },
      prompt: `${kid} ties a ${a}-inch piece of silk to a ${b}-inch piece. How long is the silk now?`,
      fig: (show) =>
        silkLine(
          Math.ceil((total + 3) / 5) * 5,
          [
            { a: 0, b: a },
            { a, b: total },
            { a: 0, b: total, lv: 1, q: true },
          ],
          show,
          `Number line: ${a} inches and ${b} more`,
        ),
      misc: named(total, [
        [Math.abs(a - b), "Tying pieces together makes the silk longer. Add."],
        [a, `That’s only the first piece. Add the ${b}-inch piece.`],
      ]),
      hint: `${a} + ${b}: add the tens, then the ones.`,
      explain: `${a} + ${b} = ${total}. The silk is ${total} inches long.`,
    };
  }
  if (variant === 1) {
    /* cut a piece off: bracelets take 6 to 9 inches */
    const long = R(20, 45),
      cut = R(6, 9),
      left = long - cut;
    return {
      kind: "num",
      unit: "inches",
      answer: left,
      facts: { t: "silk", op: "−", a: long, b: cut },
      prompt: `${kid} has ${long} inches of silk. ${kid} cuts off ${cut} inches for a bracelet. How many inches are left?`,
      fig: (show) =>
        silkLine(
          Math.ceil((long + 3) / 5) * 5,
          [
            { a: 0, b: long, lv: 1 },
            { a: long, b: left },
            { a: 0, b: left, q: true },
          ],
          show,
          `Number line: ${long} inches, and ${cut} cut off`,
        ),
      misc: named(left, [
        [long + cut, "Cutting some off makes it shorter. Subtract."],
        [cut, `${cut} inches is the part cut off. How much is left?`],
      ]),
      hint: `${long} − ${cut}: count back ${cut} from ${long}, or take away ${long % 10} to get to ${long - (long % 10)} first.`,
      explain: `${long} − ${cut} = ${left}. ${left} inches are left.`,
    };
  }
  if (variant === 2) {
    /* compare two pieces: how much longer is one? */
    const a = R(10, 30),
      b = a + R(3, 15),
      diff = b - a;
    return {
      kind: "num",
      unit: "inches",
      answer: diff,
      facts: { t: "silkCompare", short: a, long: b, kid, friend },
      prompt: `${kid}’s piece of silk is ${a} inches long. ${friend}’s piece is ${b} inches long. How much longer is ${friend}’s piece?`,
      fig: (show) =>
        silkLine(
          Math.ceil((b + 3) / 5) * 5,
          [
            { a: 0, b, lv: 1 },
            { a: 0, b: a },
            { a, b, q: true },
          ],
          show,
          `Number line: ${a} inches and ${b} inches`,
        ),
      misc: named(diff, [
        [a + b, "That’s both pieces together. How much longer is the difference."],
        [b, `${b} inches is how long ${friend}’s piece is. How much longer than ${kid}’s?`],
      ]),
      hint: `Count up from ${a} to ${b}.`,
      explain: `${b} − ${a} = ${diff}, or ${a} + ${diff} = ${b}. ${friend}’s piece is ${diff} inches longer.`,
    };
  }
  /* how much more silk for a necklace (16 to 24 inches)? */
  const necklace = R(16, 24),
    have = R(6, necklace - 4),
    need = necklace - have;
  return {
    kind: "num",
    unit: "inches",
    answer: need,
    facts: { t: "silkNeed", have, necklace },
    prompt: `${kid} has a piece of silk ${have} inches long. ${kid} needs ${necklace} inches for a necklace. How many more inches does ${kid} need?`,
    fig: (show) =>
      silkLine(
        Math.ceil((necklace + 3) / 5) * 5,
        [
          { a: 0, b: necklace, lv: 1 },
          { a: 0, b: have },
          { a: have, b: necklace, q: true },
        ],
        show,
        `Number line: ${have} inches, and how many more to ${necklace}`,
      ),
    misc: named(need, [
      [have + necklace, `${kid} needs ${necklace} in all, not ${necklace} more.`],
      [necklace, `${necklace} inches is the whole necklace. ${kid} already has ${have}.`],
    ]),
    hint: `${have} + ? = ${necklace}. Count up from ${have}.`,
    explain: `${have} + ${need} = ${necklace}. ${kid} needs ${need} more inches.`,
  };
}

/* ---------- Plot Pond: line plots (Lessons 14–16) ---------- */
/* what a class measured, in which unit, and the lengths they come in */
const PLOTS = [
  { things: "crayons", unit: "cm", lo: 5, hi: 10 },
  { things: "pencils", unit: "inches", lo: 3, hi: 8 },
  { things: "leaves", unit: "inches", lo: 2, hi: 7 },
  { things: "shells", unit: "cm", lo: 3, hi: 8 },
  { things: "feathers", unit: "inches", lo: 4, hi: 9 },
];
/* random measurements for a plot: how many at each length, with one length having the most */
function plotData(plot) {
  for (;;) {
    const counts = {};
    range(R(8, 12)).forEach(() => {
      const v = R(plot.lo, plot.hi);
      counts[v] = (counts[v] || 0) + 1;
    });
    const values = Object.values(counts),
      most = Math.max(...values);
    if (most <= 5 && values.filter((n) => n === most).length === 1 && Object.keys(counts).length >= 3) return counts;
  }
}
function genPlots() {
  const variant = R(0, 3),
    plot = pick(PLOTS),
    counts = plotData(plot),
    lengths = Object.keys(counts).map(Number),
    total = Object.values(counts).reduce((s, n) => s + n, 0);
  const plotFig = (options = {}) => lineplot(counts, plot.lo, plot.hi, { unit: plot.unit, u: 52, ...options });
  if (variant === 0) {
    /* how many are this long? */
    const v = pick(lengths),
      n = counts[v];
    return {
      kind: "num",
      unit: plot.things,
      answer: n,
      facts: { t: "plotCount", counts, v },
      prompt: `The class measured ${plot.things}. How many ${plot.things} are ${v} ${plot.unit} long?`,
      fig: (show) => plotFig({ mark: show ? v : null }),
      misc: named(n, [
        [v, `${v} is the length. Count the Xs above ${v}.`],
        [total, "That’s every X. Count only the Xs above one number."],
        ...(counts[v + 1] ? [[counts[v + 1], `Those are the Xs above ${v + 1}. Find ${v}.`]] : []),
      ]),
      hint: `Find ${v} on the line. Each X above it is one of the ${plot.things}.`,
      explain: `There ${n === 1 ? "is 1 X" : `are ${n} Xs`} above ${v}, so ${n} of the ${plot.things} ${n === 1 ? "is" : "are"} ${v} ${plot.unit} long.`,
    };
  }
  if (variant === 1) {
    /* the difference between the longest and the shortest */
    const longest = Math.max(...lengths),
      shortest = Math.min(...lengths),
      diff = longest - shortest;
    return {
      kind: "num",
      unit: plot.unit,
      answer: diff,
      facts: { t: "plotRange", counts },
      prompt: `How much longer is the longest of the ${plot.things} than the shortest?`,
      fig: (show) => plotFig({ diff: show ? [shortest, longest] : null }),
      misc: named(diff, [
        [longest, `${longest} ${plot.unit} is the longest. Take away the shortest.`],
        [longest + shortest, "That adds them. How much longer is the difference."],
        [counts[longest], "That’s how many Xs are above it. Use the numbers on the line."],
      ]),
      hint: "The shortest is the X farthest left, and the longest is farthest right.",
      explain: `The longest is ${longest} ${plot.unit} and the shortest is ${shortest} ${plot.unit}. ${longest} − ${shortest} = ${diff}.`,
    };
  }
  if (variant === 2) {
    /* which length has the most? */
    const most = Math.max(...Object.values(counts)),
      common = lengths.find((v) => counts[v] === most),
      others = shuffle(lengths.filter((v) => v !== common)).slice(0, 2);
    return {
      ...mcOf([
        [`${common} ${plot.unit}`, null],
        ...others.map((v) => [
          `${v} ${plot.unit}`,
          `${v} has ${counts[v]} X${counts[v] === 1 ? "" : "s"}. Find the tallest stack.`,
        ]),
      ]),
      facts: { t: "plotMost", counts },
      prompt: `Which length do the most ${plot.things} have?`,
      fig: (show) => plotFig({ mark: show ? common : null }),
      hint: "Look for the tallest stack of Xs.",
      explain: `${common} ${plot.unit} has the most Xs: ${most}.`,
    };
  }
  /* which line plot shows these measurements? The wrong ones move one X, or leave one out */
  const list = shuffle(lengths.flatMap((v) => Array(counts[v]).fill(v))).slice(0, R(5, 7)),
    small = {};
  list.forEach((v) => (small[v] = (small[v] || 0) + 1));
  const moveFrom = pick(Object.keys(small).map(Number)),
    moveTo = moveFrom < plot.hi ? moveFrom + 1 : moveFrom - 1,
    moved = { ...small, [moveFrom]: small[moveFrom] - 1, [moveTo]: (small[moveTo] || 0) + 1 },
    dropAt = pick(Object.keys(small).map(Number)),
    dropped = { ...small, [dropAt]: small[dropAt] - 1 };
  const problem = mcOf([
    [JSON.stringify(small), null],
    [
      JSON.stringify(moved),
      `One X is above ${moveTo}, but nothing measured ${moveTo} that many times. Check each length.`,
    ],
    [JSON.stringify(dropped), `That plot has only ${list.length - 1} Xs. There are ${list.length} measurements.`],
  ]);
  problem.choices.forEach((choice, i) => {
    choice.label = lineplot(JSON.parse(choice.label), plot.lo, plot.hi, {
      unit: plot.unit,
      u: 44,
      label: `Picture ${"ABC"[i]}`,
    });
  });
  return {
    ...problem,
    stack: true,
    facts: { t: "plotMatch", list, small },
    prompt: `${plot.things[0].toUpperCase() + plot.things.slice(1)} are ${list.join(", ")} ${plot.unit} long. Which line plot shows them?`,
    hint: "Each measurement is one X. Count how many times each length shows up.",
    explain: `One X for each: ${Object.entries(small)
      .filter(([, n]) => n)
      .map(([v, n]) => `${n} at ${v}`)
      .join(", ")}.`,
  };
}

/* ---------- The Big Crawl: everything ---------- */
const genBoss = () => pick([genUnits, genCm, genInches, genSilk, genPlots])();

const ZONES = [
  {
    id: "units",
    name: "Cube Creek",
    lessons: "Lessons 1–3",
    blurb: "Measure with centimeter cubes and rulers, and see why units must be the same size.",
    gen: genUnits,
  },
  {
    id: "cm",
    name: "Gecko Rocks",
    lessons: "Lessons 4–6",
    blurb: "Estimate in centimeters, pick meters for long things, and compare reptile lengths.",
    gen: genCm,
  },
  {
    id: "inches",
    name: "Inch Hill",
    lessons: "Lessons 8–10",
    blurb: "Turn feet into inches, measure with a torn tape, and compare inches with centimeters.",
    gen: genInches,
  },
  {
    id: "silk",
    name: "Silk Bridge",
    lessons: "Lessons 11–12",
    blurb: "Tie silk pieces together, cut some off, and find how much longer or how much more.",
    gen: genSilk,
  },
  {
    id: "plots",
    name: "Plot Pond",
    lessons: "Lessons 14–16",
    blurb: "Read line plots, find the most common length, and match measurements to a plot.",
    gen: genPlots,
  },
  {
    id: "boss",
    name: "The Big Crawl",
    lessons: "All lessons",
    blurb: "Help the inchworm reach the leaf! Every right answer moves it 1 inch along the ruler.",
    gen: genBoss,
  },
];

/* the inchworm on a 10-inch ruler, `crawled` inches from the start, with a leaf at the end (also the boss icon, at 4) */
const crawl = (crawled) => {
  /* each inch is `inch` pixels from x = 4; the worm is a hump of 4 green segments and a head, starting at x */
  const inch = 4.2,
    x = 4 + crawled * inch;
  return (
    '<rect x="1" y="44" width="49" height="12" rx="2" fill="rgba(255,201,60,.25)" stroke="#ffc93c" stroke-width="1.5"/>' +
    range(11)
      .map((i) => `<path d="M${4 + i * inch},44v${i % 5 ? 4 : 7}" stroke="#ffc93c" stroke-width="1"/>`)
      .join("") +
    '<path d="M54,40Q62,24 52,14Q44,26 54,40Z" fill="#5fe0a8" stroke="#0a2340" stroke-width="1.2"/><path d="M54,40Q53,27 52,16" stroke="#2f9e70" stroke-width="1" fill="none"/>' +
    [
      [x, 39],
      [x + 3, 34],
      [x + 7, 33],
      [x + 10, 38],
    ]
      .map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="3.4" fill="#7fe37a" stroke="#0a2340" stroke-width=".8"/>`)
      .join("") +
    `<circle cx="${x + 12}" cy="${35}" r="3.6" fill="#7fe37a" stroke="#0a2340" stroke-width=".8"/><circle cx="${x + 13}" cy="${34}" r=".9" fill="#0a2340"/>`
  );
};
const ICON = {
  units:
    range(5)
      .map((i) => `<rect x="${6 + i * 11}" y="36" width="10" height="10" rx="1.5" fill="#ffc93c" stroke="#0a2340"/>`)
      .join("") +
    '<rect x="6" y="18" width="40" height="10" fill="#ff7b7b" stroke="#0a2340" stroke-width="1.2"/><polygon points="46,18 56,23 46,28" fill="#ff7b7b" stroke="#0a2340" stroke-width="1.2"/>',
  cm: '<path d="M4,50Q14,40 26,46T48,44Q56,42 60,36Q56,48 46,50Q34,54 22,52Q12,52 4,50Z" fill="#5fe0a8" stroke="#0a2340" stroke-width="1.5"/><circle cx="54" cy="40" r="1.4" fill="#0a2340"/><path d="M18,51l-4,6M28,52l-2,6M40,50l2,6M46,49l4,6" stroke="#5fe0a8" stroke-width="2.5" stroke-linecap="round"/><rect x="4" y="12" width="56" height="12" rx="2" fill="rgba(255,201,60,.25)" stroke="#ffc93c" stroke-width="1.5"/><path d="M10,12v5M16,12v5M22,12v5M28,12v7M34,12v5M40,12v5M46,12v5M52,12v5" stroke="#ffc93c"/>',
  inches:
    '<path d="M4,56L30,16L60,56Z" fill="#3fbf88" stroke="#0a2340" stroke-width="1.5"/><rect x="10" y="44" width="44" height="10" rx="2" fill="#ffc93c" stroke="#0a2340"/><path d="M21,44v5M32,44v5M43,44v5" stroke="#0a2340"/>',
  silk: '<path d="M4,24Q20,14 32,26T60,26" fill="none" stroke="#ff7bc8" stroke-width="6" stroke-linecap="round"/><path d="M4,42Q20,32 32,44T60,44" fill="none" stroke="#c58bff" stroke-width="6" stroke-linecap="round"/><circle cx="32" cy="35" r="5" fill="#ffc93c" stroke="#0a2340"/>',
  plots:
    '<path d="M4,52H60" stroke="#f3f6fb" stroke-width="2"/><g font-family="monospace" font-weight="700" font-size="11" fill="#7fe3ff" text-anchor="middle"><text x="14" y="46">X</text><text x="26" y="46">X</text><text x="26" y="34">X</text><text x="38" y="46">X</text><text x="38" y="34">X</text><text x="38" y="22">X</text><text x="50" y="46">X</text></g>',
  boss: crawl(4),
};
