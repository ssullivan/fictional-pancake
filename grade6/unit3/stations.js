/* Rate Racers (Grade 6 Unit 3): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Diagrams (dnl, tableFig, coinsFig, pctTape, pctLine) and COIN_SET come from shared/figures.js. Each generator deals one of
   a few kinds of problem (type), each with a comment saying what it asks. */
/* a number to 2 decimal places, with commas */
const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US");
/* dollars and cents: $4.50 */
const money = (n) => "$" + n.toFixed(2);
/* n and the word for it: word is [one, many] */
const pl = (word, n) => `${fmt(n)} ${word[n === 1 ? 0 : 1]}`;

/* whether v has at most 2 decimal places */
const nice2 = (v) => Math.abs(v * 100 - Math.round(v * 100)) < 1e-9;
/* a percent as written: 25% */
const pctF = (v) => fmt(v) + "%";

/* ---------- Station 1: unit conversion ---------- */
/* conversions: 1 big unit is `f` small ones, and what they measure */
const CONV = [
  { big: ["foot", "feet"], small: ["inch", "inches"], f: 12, kind: "length" },
  { big: ["yard", "yards"], small: ["foot", "feet"], f: 3, kind: "length" },
  { big: ["yard", "yards"], small: ["inch", "inches"], f: 36, kind: "length" },
  { big: ["meter", "meters"], small: ["centimeter", "centimeters"], f: 100, kind: "length" },
  { big: ["kilometer", "kilometers"], small: ["meter", "meters"], f: 1000, kind: "length" },
  { big: ["kilogram", "kilograms"], small: ["gram", "grams"], f: 1000, kind: "mass" },
  { big: ["pound", "pounds"], small: ["ounce", "ounces"], f: 16, kind: "weight" },
  { big: ["quart", "quarts"], small: ["cup", "cups"], f: 4, kind: "volume" },
  { big: ["gallon", "gallons"], small: ["quart", "quarts"], f: 4, kind: "volume" },
  { big: ["liter", "liters"], small: ["milliliter", "milliliters"], f: 1000, kind: "volume" },
];
/* unit → [what it measures, size rank within that kind] */
const UNIT = {
  centimeters: ["length", 1],
  meters: ["length", 2],
  kilometers: ["length", 3],
  inches: ["length", 1],
  yards: ["length", 2],
  miles: ["length", 3],
  grams: ["mass", 1],
  kilograms: ["mass", 2],
  ounces: ["weight", 1],
  pounds: ["weight", 2],
  cups: ["volume", 1],
  gallons: ["volume", 2],
  liters: ["volume", 2],
  quarts: ["volume", 2],
};
/* things to measure, the unit that fits (ok), and the choices */
const PICKS = [
  { what: "the length of a pencil", ok: "centimeters", opts: ["centimeters", "meters", "kilometers"] },
  { what: "the distance between two cities", ok: "kilometers", opts: ["centimeters", "meters", "kilometers"] },
  { what: "the height of a classroom door", ok: "meters", opts: ["centimeters", "meters", "kilometers"] },
  { what: "the mass of a paper clip", ok: "grams", opts: ["grams", "kilograms", "liters"] },
  { what: "the mass of a bicycle", ok: "kilograms", opts: ["grams", "kilograms", "liters"] },
  { what: "the water in a bathtub", ok: "gallons", opts: ["cups", "gallons", "inches"] },
  { what: "the water in a drinking glass", ok: "cups", opts: ["cups", "gallons", "pounds"] },
  { what: "the length of a football field", ok: "yards", opts: ["inches", "yards", "miles"] },
  { what: "the width of a phone screen", ok: "inches", opts: ["inches", "yards", "miles"] },
  { what: "the weight of a large dog", ok: "pounds", opts: ["ounces", "pounds", "quarts"] },
];
function genConv() {
  const conversion = pick(CONV),
    type = pick(["down", "down", "up", "up", "more", "cmp", "pick"]);
  /* factor: how many small units make 1 big one */
  const { big, small, f: factor } = conversion;
  if (type === "down" || type === "up") {
    /* convert big units to small (down) or small to big (up), on a double number line */
    /* not 1.5 yards, where adding the 3 feet gives the same as multiplying */
    let bigCount;
    do bigCount = pick(factor >= 100 ? [2, 3, 4, 5, 1.5, 2.5] : [2, 3, 4, 5, 6, 7, 1.5, 2.5]);
    while (bigCount + factor === bigCount * factor);
    const smallCount = bigCount * factor,
      down = type === "down",
      step = Number.isInteger(bigCount) ? 1 : 0.5;
    /* ticks every whole (or half) big unit; 0 and 1 are labeled, and the others only with the hint */
    const ticks = [];
    for (let t = 0; t <= bigCount + 1e-9; t += step) {
      const last = Math.abs(t - bigCount) < 1e-9,
        base = t === 0 || t === 1;
      ticks.push(
        down
          ? { t, b: t * factor, st: 1, sb: base ? 1 : last ? 0 : 2, q: last ? "b" : null }
          : { t, b: t * factor, st: base ? 1 : last ? 0 : 2, sb: base || last ? 1 : 2, q: last ? "t" : null },
      );
    }
    const fig = dnl(big[1], small[1], ticks);
    if (down)
      return {
        kind: "num",
        unit: small[1],
        answer: smallCount,
        fig,
        prompt: `${fmt(bigCount)} ${big[bigCount === 1 ? 0 : 1]} is how many <b>${small[1]}</b>?`,
        hint: `1 ${big[0]} = ${fmt(factor)} ${small[1]}. ${small[1][0].toUpperCase() + small[1].slice(1)} are smaller, so there will be more of them. Multiply.`,
        misc: [
          [
            bigCount / factor,
            `You divided. ${small[1]} are smaller than ${big[1]}, so it takes <b>more</b> of them. Multiply by ${fmt(factor)}.`,
          ],
          [bigCount + factor, `Each ${big[0]} is ${fmt(factor)} ${small[1]}. Multiply, don’t add.`],
        ],
        explain: `1 ${big[0]} = ${fmt(factor)} ${small[1]}, so ${fmt(bigCount)} × ${fmt(factor)} = ${fmt(smallCount)} ${small[1]}.`,
      };
    return {
      kind: "num",
      unit: big[1],
      answer: bigCount,
      fig,
      prompt: `${fmt(smallCount)} ${small[1]} is how many <b>${big[1]}</b>?`,
      hint: `1 ${big[0]} = ${fmt(factor)} ${small[1]}. ${big[1][0].toUpperCase() + big[1].slice(1)} are bigger, so there will be fewer of them. Divide.`,
      misc: [
        [
          smallCount * factor,
          `You multiplied. ${big[1]} are bigger, so it takes <b>fewer</b> of them. Divide by ${fmt(factor)}.`,
        ],
      ],
      explain: `Every ${fmt(factor)} ${small[1]} make 1 ${big[0]}: ${fmt(smallCount)} ÷ ${fmt(factor)} = ${fmt(bigCount)} ${big[1]}.`,
    };
  }
  if (type === "more") {
    /* measuring again in the other unit: more of them or fewer? */
    const thing = pick(["a hallway", "a rug", "a garden hose", "a desk"]),
      bigFirst = Math.random() < 0.5;
    const [unit1, unit2] = bigFirst ? [big[1], small[1]] : [small[1], big[1]];
    const story =
      conversion.kind === "length"
        ? `Andre measures ${thing} in ${unit1}, then measures it again in ${unit2}.`
        : conversion.kind === "volume"
          ? `Mai measures the water in a fish tank in ${unit1}, then measures it again in ${unit2}.`
          : `Kiran weighs a bag of rice in ${unit1}, then weighs it again in ${unit2}.`;
    const answer = bigFirst ? "more" : "fewer";
    return {
      kind: "mc",
      choices: [
        { id: "more", label: `More ${unit2}` },
        { id: "fewer", label: `Fewer ${unit2}` },
        { id: "same", label: "The same number" },
      ],
      answer,
      why: {
        more: `${unit2} are bigger than ${unit1}, so it takes fewer of them.`,
        fewer: `${unit2} are smaller than ${unit1}, so it takes more of them.`,
        same: "The amount is the same, but the units are different sizes, so the numbers are different.",
      },
      prompt: `${story} Compared with the number of ${unit1}, will there be more or fewer ${unit2}?`,
      hint: `Which unit is smaller? It takes more small units than big units to measure the same thing.`,
      explain: `1 ${big[0]} = ${fmt(factor)} ${small[1]}. ${bigFirst ? `${unit2} are smaller, so there are more of them.` : `${unit2} are bigger, so there are fewer of them.`}`,
    };
  }
  if (type === "cmp") {
    /* which is more: a number of big units, or a number of small units near it (sometimes equal) */
    const bigCount = R(2, 6),
      same = Math.random() < 0.2,
      off = factor >= 100 ? (pick([-1, 1]) * R(1, 9) * factor) / 10 : pick([-1, 1]) * R(1, Math.max(1, factor - 1));
    const smallCount = same ? bigCount * factor : bigCount * factor + off,
      word = conversion.kind === "length" ? "longer" : conversion.kind === "volume" ? "more liquid" : "heavier";
    const win = smallCount === bigCount * factor ? "S" : bigCount * factor > smallCount ? "A" : "B";
    return {
      kind: "mc",
      choices: [
        { id: "A", label: `${bigCount} ${big[1]}` },
        { id: "B", label: `${fmt(smallCount)} ${small[1]}` },
        { id: "S", label: "They are equal" },
      ],
      answer: win,
      why: {
        A: `Change ${bigCount} ${big[1]} into ${small[1]} first, then compare.`,
        B: `Change ${bigCount} ${big[1]} into ${small[1]} first, then compare.`,
        S: `Change ${bigCount} ${big[1]} into ${small[1]}: they don’t match.`,
      },
      prompt: `Which is <b>${word}</b>?`,
      hint: `Use the same unit for both. 1 ${big[0]} = ${fmt(factor)} ${small[1]}.`,
      explain: `${bigCount} ${big[1]} = ${bigCount} × ${fmt(factor)} = ${fmt(bigCount * factor)} ${small[1]}. Compare ${fmt(bigCount * factor)} with ${fmt(smallCount)}.`,
    };
  }
  /* pick: the unit that makes sense; a wrong one measures something else, or is too small or too big */
  const thing = pick(PICKS),
    okUnit = UNIT[thing.ok];
  const why = {};
  thing.opts.forEach((option) => {
    if (option === thing.ok) return;
    const unit = UNIT[option];
    why[option] =
      unit[0] !== okUnit[0]
        ? `${option} measure ${unit[0]}, not ${okUnit[0]}.`
        : unit[1] < okUnit[1]
          ? `${option} are very small for this. You’d get a huge number.`
          : `${option} are very big for this. You’d get a tiny fraction.`;
  });
  return {
    kind: "mc",
    choices: thing.opts.map((option) => ({ id: option, label: option })),
    answer: thing.ok,
    why,
    prompt: `Which unit makes the most sense for measuring <b>${thing.what}</b>?`,
    hint: "Think of a unit you know: a centimeter is about the width of a fingernail, a meter is about one big step, a kilometer is a long walk.",
    explain: `${thing.ok[0].toUpperCase() + thing.ok.slice(1)} give a sensible number for ${thing.what}.`,
  };
}

/* ---------- Station 2: rates ---------- */
/* rate stories: x of one thing for y of another. xn/xs and yn/ys: the plural and singular units; mx: x is money;
   xbig or ybig: that one is always the bigger number */
const RCTX = [
  {
    s: (x, y) => `${money(x)} buys ${fmt(y)} pounds of apples.`,
    xn: "dollars",
    xs: "dollar",
    yn: "pounds",
    ys: "pound",
    mx: 1,
  },
  {
    s: (x, y) => `${fmt(x)} cups of flour make ${fmt(y)} batches of cookies.`,
    xn: "cups",
    xs: "cup",
    yn: "batches",
    ys: "batch",
    xbig: 1,
  },
  {
    s: (x, y) => `${fmt(x)} gallons of paint cover ${fmt(y)} walls.`,
    xn: "gallons",
    xs: "gallon",
    yn: "walls",
    ys: "wall",
  },
  {
    s: (x, y) => `${fmt(x)} liters of water fill ${fmt(y)} bottles.`,
    xn: "liters",
    xs: "liter",
    yn: "bottles",
    ys: "bottle",
    ybig: 1,
  },
  {
    s: (x, y) => `${money(x)} buys ${fmt(y)} ounces of tea.`,
    xn: "dollars",
    xs: "dollar",
    yn: "ounces",
    ys: "ounce",
    mx: 1,
  },
];
/* numbers that make friendly rates */
const NICE = [2, 4, 5, 8, 10, 16, 20, 25, 40];
/* x and y for a story: different, with both unit rates to 2 decimal places, and the bigger one where the story wants it */
function ratePair(context) {
  let x, y;
  do {
    x = pick(NICE);
    y = pick(NICE);
  } while (x === y || !nice2(x / y) || !nice2(y / x) || (context.xbig && x < y) || (context.ybig && y < x));
  return [x, y];
}
function genRate() {
  /* the two unit rates: x per y and y per x */
  const context = pick(RCTX),
    [x, y] = ratePair(context),
    xPerY = x / y,
    yPerX = y / x;
  const type = pick(["rx", "ry", "meaning", "same", "use", "use"]);
  const unitX = context.mx ? "dollars" : context.xn;
  if (type === "rx" || type === "ry") {
    /* one of the unit rates; the other is the mistake */
    const wantX = type === "rx",
      [answer, other, top, per] = wantX
        ? [xPerY, yPerX, context.xn, context.ys]
        : [yPerX, xPerY, context.yn, context.xs];
    return {
      kind: "num",
      unit: `${top} per ${per}`,
      answer,
      prompt: `${context.s(x, y)} How many <b>${top} per ${per}</b>?`,
      hint: `“${top} per ${per}” means ${top} for 1 ${per}. Divide the ${top} by the ${wantX ? context.yn : context.xn}.`,
      misc: [
        [
          other,
          `That is ${wantX ? context.yn : context.xn} per ${wantX ? context.xs : context.ys}, the other unit rate. Put the ${top} on top: ${fmt(wantX ? x : y)} ÷ ${fmt(wantX ? y : x)}.`,
        ],
      ],
      explain: `${fmt(wantX ? x : y)} ÷ ${fmt(wantX ? y : x)} = ${fmt(answer)} ${top} per ${per}.`,
    };
  }
  if (type === "meaning") {
    /* what x ÷ y means */
    const sentences = shuffle([
      { t: `It costs or takes ${fmt(xPerY)} ${context.xn} for each ${context.ys}.`, ok: 1 },
      {
        t: `You get ${fmt(xPerY)} ${context.yn} for each ${context.xs}.`,
        why: `That would be ${context.yn} per ${context.xs}, which is ${fmt(y)} ÷ ${fmt(x)} = ${fmt(yPerX)}.`,
      },
      {
        t: `There are ${fmt(xPerY)} ${context.yn} in all.`,
        why: `There are ${fmt(y)} ${context.yn} in all. ${fmt(xPerY)} is a rate: an amount for 1.`,
      },
    ]);
    const why = {};
    let answer;
    const choices = sentences.map((sentence, i) => {
      const id = "abc"[i];
      if (sentence.ok) answer = id;
      else why[id] = sentence.why;
      return { id, label: sentence.t.replace("costs or takes", context.mx ? "costs" : "takes") };
    });
    return {
      kind: "mc",
      stack: true,
      choices,
      answer,
      why,
      prompt: `${context.s(x, y)} ${fmt(x)} ÷ ${fmt(y)} = ${fmt(xPerY)}. What does <b>${fmt(xPerY)}</b> mean?`,
      hint: `The number on top of the division (${fmt(x)} ${context.xn}) tells you the unit. The number you divided by (${context.yn}) is the “per”.`,
      explain: `${fmt(x)} ${context.xn} ÷ ${fmt(y)} ${context.yn} = ${fmt(xPerY)} ${context.xn} per ${context.ys}.`,
    };
  }
  if (type === "same") {
    /* which of four scaled rows doesn't belong: its y is a little off */
    const scales = shuffle([1, 2, 3, 4, 5])
        .slice(0, 4)
        .sort((a, b) => a - b),
      odd = R(0, 3);
    const rows = scales.map((scale, i) => (i === odd ? [scale * x, scale * y + pick([1, 2])] : [scale * x, scale * y]));
    const why = {};
    const choices = rows.map((row, i) => {
      if (i !== odd)
        why["r" + i] = `${fmt(row[0])} ÷ ${fmt(row[1])} = ${fmt(xPerY)}, the same unit rate as the others.`;
      return {
        id: "r" + i,
        label: `${context.mx ? money(row[0]) : fmt(row[0])} ${context.mx ? "" : context.xn + " "}for ${fmt(row[1])} ${context.yn}`,
      };
    });
    const oddRow = rows[odd];
    return {
      kind: "mc",
      stack: true,
      choices,
      answer: "r" + odd,
      why,
      prompt: `Three of these match the same rate. Which one <b>doesn’t belong</b>?`,
      hint: `Find the ${context.xn} per ${context.ys} for each row. Equivalent ratios have the same unit rate.`,
      explain: `The others all have ${fmt(xPerY)} ${context.xn} per ${context.ys}. This one: ${fmt(oddRow[0])} ÷ ${fmt(oddRow[1])} = ${fmt(oddRow[0] / oddRow[1])}.`,
    };
  }
  /* use: the x for `count` of y, going through the unit rate */
  let count = R(3, 12);
  while (count === y) count = R(3, 12);
  const answer = count * xPerY;
  return {
    kind: "num",
    unit: unitX,
    answer,
    fig: tableFig(
      {
        hx: context.mx ? "Dollars" : context.xn[0].toUpperCase() + context.xn.slice(1),
        hy: context.yn[0].toUpperCase() + context.yn.slice(1),
      },
      [
        { x, y },
        { x: xPerY, y: 1, h: 1, note: `÷ ${fmt(y)}` },
        { x: answer, y: count, q: "x", note: `× ${count}` },
      ],
    ),
    prompt: `${context.s(x, y)} At this rate, how many ${unitX} for <b>${count} ${context.yn}</b>?`,
    hint: `Find the ${context.xn} for 1 ${context.ys} first: ${fmt(x)} ÷ ${fmt(y)}. Then multiply by ${count}.`,
    misc: [
      [
        count * yPerX,
        `You used ${context.yn} per ${context.xs}. You need ${context.xn} per ${context.ys}: ${fmt(x)} ÷ ${fmt(y)} = ${fmt(xPerY)}.`,
      ],
      [x + (count - y), "You added. Find the amount for 1 first, then multiply."],
    ],
    explain: `${fmt(x)} ÷ ${fmt(y)} = ${fmt(xPerY)} ${context.xn} per ${context.ys}. ${fmt(xPerY)} × ${count} = ${fmt(answer)}.`,
  };
}

/* ---------- Station 3: speed & pace ---------- */
const WHO = ["Lin", "Andre", "Priya", "Diego", "Jada", "Noah", "Mai", "Kiran"];
function genSpeed() {
  const type = pick(["speed", "pace", "faster", "faster", "time"]);
  const [person1, person2] = shuffle(WHO);
  if (type === "speed") {
    /* meters per second from a distance in a time */
    const seconds = R(2, 8),
      speed = R(3, 12),
      meters = speed * seconds;
    const ticks = [];
    for (let i = 0; i <= seconds; i++)
      ticks.push({ t: i, b: i * speed, st: 1, sb: i === 0 || i === seconds ? 1 : 0, q: i === 1 ? "b" : null });
    return {
      kind: "num",
      unit: "meters per second",
      answer: speed,
      fig: dnl("time (seconds)", "distance (meters)", ticks),
      prompt: `${person1} runs ${meters} meters in ${seconds} seconds at a constant speed. What is ${person1}’s <b>speed</b> in meters per second?`,
      hint: `Speed is meters for 1 second. Split ${meters} meters into ${seconds} equal parts.`,
      misc: [[seconds / meters, "That is seconds per meter: the pace. Speed is meters ÷ seconds."]],
      explain: `${meters} ÷ ${seconds} = ${speed} meters per second.`,
    };
  }
  if (type === "pace") {
    /* minutes per mile from a time over a distance */
    const pace = pick([3, 4, 5, 6, 8, 10, 12, 15]),
      miles = R(2, 6),
      minutes = pace * miles;
    const ticks = [];
    for (let i = 0; i <= miles; i++)
      ticks.push({ t: i, b: i * pace, st: 1, sb: i === 0 || i === miles ? 1 : 0, q: i === 1 ? "b" : null });
    return {
      kind: "num",
      unit: "minutes per mile",
      answer: pace,
      fig: dnl("distance (miles)", "time (minutes)", ticks),
      prompt: `${person1} bikes ${miles} miles in ${minutes} minutes at a constant speed. What is ${person1}’s <b>pace</b> in minutes per mile?`,
      hint: `Pace is minutes for 1 mile. Split ${minutes} minutes into ${miles} equal parts.`,
      misc: [[miles / minutes, "That is miles per minute: the speed. Pace is minutes ÷ miles."]],
      explain: `${minutes} ÷ ${miles} = ${pace} minutes per mile.`,
    };
  }
  if (type === "faster") {
    /* who is faster, by speed (bigger wins) or by pace (smaller wins) */
    const usePace = Math.random() < 0.6;
    let a = R(6, 14),
      b = R(6, 14);
    while (b === a) b = R(6, 14);
    const win = usePace ? (a < b ? "A" : "B") : a > b ? "A" : "B";
    const unit = usePace ? "minutes per mile" : "meters per second";
    return {
      kind: "mc",
      choices: [
        { id: "A", label: person1 },
        { id: "B", label: person2 },
      ],
      answer: win,
      why: {
        A: usePace
          ? `${person1}’s pace is ${a} minutes for each mile. More minutes per mile means slower.`
          : `${person1} goes fewer meters each second, so ${person1} is slower.`,
        B: usePace
          ? `${person2}’s pace is ${b} minutes for each mile. More minutes per mile means slower.`
          : `${person2} goes fewer meters each second, so ${person2} is slower.`,
      },
      prompt: `${person1}’s ${usePace ? "pace" : "speed"} is ${a} ${unit}. ${person2}’s ${usePace ? "pace" : "speed"} is ${b} ${unit}. <b>Who is faster?</b>`,
      explain: usePace
        ? `Pace is time for 1 mile, so a <b>smaller</b> pace is faster. ${win === "A" ? person1 : person2} takes only ${Math.min(a, b)} minutes per mile.`
        : `Speed is distance in 1 second, so a <b>bigger</b> speed is faster.`,
    };
  }
  /* time: how long a distance takes, at a speed or at a pace */
  if (Math.random() < 0.5) {
    const speed = R(3, 12),
      seconds = R(3, 12),
      meters = speed * seconds;
    return {
      kind: "num",
      unit: "seconds",
      answer: seconds,
      prompt: `A drone flies at a constant speed of ${speed} meters per second. How many seconds does it take to fly <b>${meters} meters</b>?`,
      hint: `Each second covers ${speed} meters. How many groups of ${speed} fit in ${meters}?`,
      misc: [[meters * speed, `That multiplies meters by meters per second. Divide instead: ${meters} ÷ ${speed}.`]],
      explain: `${meters} ÷ ${speed} = ${seconds} seconds.`,
    };
  }
  const pace = pick([4, 5, 6, 8, 10, 12]),
    miles = R(3, 9);
  return {
    kind: "num",
    unit: "minutes",
    answer: pace * miles,
    prompt: `${person1} walks at a pace of ${pace} minutes per mile. How many minutes does it take to walk <b>${miles} miles</b>?`,
    hint: `Each mile takes ${pace} minutes. Add ${pace} minutes for every mile.`,
    misc: [
      [pace / miles, `${pace} minutes is for one mile, so ${miles} miles take longer. Multiply.`],
      [pace + miles, "Multiply the minutes for 1 mile by the number of miles."],
    ],
    explain: `${pace} × ${miles} = ${pace * miles} minutes.`,
  };
}

/* ---------- Station 4: percent strips, double number lines, tapes ---------- */
/* percent stories: the whole, a percent of it, an amount it has, and the unit (over: more than 100% makes sense) */
const PCTX = [
  {
    whole: (W) => `A water tank holds ${W} liters.`,
    part: (p) => `How many liters is ${p}% of the tank?`,
    have: (a) => `It has ${a} liters in it.`,
    u: "liters",
  },
  {
    whole: (W) => `A hiking trail is ${W} kilometers long.`,
    part: (p) => `How far is ${p}% of the trail?`,
    have: (a) => `Priya has hiked ${a} kilometers.`,
    u: "kilometers",
  },
  {
    whole: (W) => `A phone battery holds ${W} units of charge.`,
    part: (p) => `How many units is ${p}% of a full charge?`,
    have: (a) => `It has ${a} units right now.`,
    u: "units",
  },
  {
    whole: (W) => `Noah’s savings goal is $${W}.`,
    part: (p) => `How many dollars is ${p}% of the goal?`,
    have: (a) => `Noah has saved $${a}.`,
    u: "dollars",
    over: 1,
  },
  {
    whole: (W) => `A bread recipe calls for ${W} grams of flour.`,
    part: (p) => `Diego makes a batch with ${p}% of that flour. How many grams is that?`,
    have: (a) => `Diego used ${a} grams of flour.`,
    u: "grams",
    over: 1,
  },
];
function genStrip() {
  const type = pick(["coins", "coins", "dnlA", "dnlA", "dnlP", "tape", "tape"]);
  if (type === "coins") {
    /* what percent of a dollar some coins are */
    /* not all pennies, where counting the coins gives the cents */
    let coins, cents;
    do {
      coins = [];
      const count = R(2, 6);
      for (let i = 0; i < count; i++) coins.push(pick(COIN_SET));
      cents = coins.reduce((sum, coin) => sum + coin.v, 0);
    } while (cents > 100 || cents < 5 || cents === coins.length);
    coins.sort((a, b) => b.v - a.v);
    return {
      kind: "num",
      unit: "%",
      answer: cents,
      fig: coinsFig(coins),
      prompt: `What <b>percent of a dollar</b> is this?`,
      hint: "A dollar is 100 cents, so each cent is 1% of a dollar. Add up the cents.",
      misc: [
        [coins.length, "That is the number of coins. Add up how many cents they are worth."],
        [cents / 100, `${fmt(cents / 100)} is the amount in dollars. As a percent of a dollar, that is ${cents}%.`],
      ],
      explain: `${coins.map((coin) => coin.v).join(" + ")} = ${cents} cents. ${cents} out of 100 cents is ${cents}%.`,
    };
  }
  if (type === "dnlA" || type === "dnlP") {
    /* a double number line of amounts and percents in steps of `step`%, sometimes past 100%: find the amount (dnlA) or the percent (dnlP) */
    const context = pick(PCTX),
      step = pick([20, 25, 50, 25]),
      over = context.over && step !== 20 && Math.random() < 0.5,
      top = over ? 150 : 100;
    const perStep = pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25]),
      whole = (perStep * 100) / step;
    /* a percent on a tick that isn't 100%, and its amount */
    const percents = [];
    for (let p = step; p <= top; p += step) if (p !== 100) percents.push(p);
    const percent = pick(percents),
      amount = (whole * percent) / 100;
    const ticks = [];
    for (let p = 0; p <= top; p += step) {
      const hit = p === percent;
      ticks.push({
        t: (whole * p) / 100,
        b: p,
        st: p === 0 || p === 100 ? 1 : hit ? (type === "dnlP" ? 1 : 0) : 2,
        sb: type === "dnlA" || !hit ? 1 : 0,
        q: hit ? (type === "dnlA" ? "t" : "b") : null,
      });
    }
    const fig = dnl(context.u === "dollars" ? "dollars" : context.u, "percent", ticks, { fb: pctF });
    if (type === "dnlA")
      return {
        kind: "num",
        unit: context.u,
        answer: amount,
        fig,
        prompt: `${context.whole(whole)} ${context.part(percent)}`,
        hint: `100% is ${whole}. Each step of ${step}% is the same amount: ${whole} ÷ ${100 / step}.`,
        /* when the whole is 100, the amount is the percent */
        misc:
          whole === 100
            ? []
            : [
                [percent, `That is the percent. The question asks for ${context.u}.`],
                [
                  whole + percent - 100,
                  "Percents are parts of the whole. Find the amount for one step, then count steps.",
                ],
              ],
        explain: `${step}% of ${whole} is ${fmt((whole * step) / 100)}. ${percent}% is ${percent / step} steps: ${percent / step} × ${fmt((whole * step) / 100)} = ${fmt(amount)} ${context.u}.${percent > 100 ? " More than 100% means more than the whole." : ""}`,
      };
    return {
      kind: "num",
      unit: "%",
      answer: percent,
      fig,
      prompt: `${context.whole(whole)} ${context.have(fmt(amount))} What <b>percent</b> of ${context.u === "dollars" ? "the goal" : "the whole"} is that?`,
      hint: `Line up the amounts with the percents. Each ${fmt((whole * step) / 100)} ${context.u} is another ${step}%.`,
      misc: [
        ...(whole !== 100 ? [[amount, "That is the amount. The question asks what percent it is."]] : []),
        [amount / whole, `${fmt(amount / whole)} is the fraction of the whole. As a percent, multiply by 100.`],
      ],
      explain: `${fmt(amount)} is ${fmt(amount)} ÷ ${fmt((whole * step) / 100)} = ${percent / step} steps of ${step}%, so ${percent}%.`,
    };
  }
  /* tape: a whole in `boxes` equal boxes, `filled` of them the part: find the part, or the whole */
  const boxes = pick([4, 5, 10]),
    filled = R(1, boxes - 1),
    each = pick([2, 3, 4, 5, 6, 8, 12, 15]),
    whole = boxes * each,
    part = filled * each,
    percent = (100 * filled) / boxes,
    context = pick(PCTX);
  if (Math.random() < 0.5)
    return {
      kind: "num",
      unit: context.u,
      answer: part,
      fig: pctTape(boxes, filled, { W: whole, part, qP: 1, each }),
      prompt: `${context.whole(whole)} ${context.part(percent)}`,
      hint: `The whole tape is ${boxes} equal boxes, so each box is ${100 / boxes}% and worth ${whole} ÷ ${boxes}.`,
      misc: [
        [percent, "That is the percent. Find the amount."],
        ...(filled > 1 ? [[each, `That is one box. ${percent}% is ${filled} boxes.`]] : []),
      ],
      explain: `${whole} ÷ ${boxes} = ${each} per box. ${filled} boxes × ${each} = ${part} ${context.u}.`,
    };
  return {
    kind: "num",
    unit: context.u,
    answer: whole,
    fig: pctTape(boxes, filled, { W: whole, part, qW: 1, each }),
    prompt: `${fmt(part)} ${context.u} is ${percent}% of the whole. How many ${context.u} is the <b>whole</b> (100%)?`,
    hint: `${percent}% fills ${filled} boxes. Find one box (${part} ÷ ${filled}), then fill all ${boxes}.`,
    misc: [
      [
        (part * percent) / 100,
        `That is ${percent}% of ${part}. Here ${part} <i>is</i> the ${percent}%: the whole is bigger.`,
      ],
      [each, `That is one box. The whole is ${boxes} boxes.`],
    ],
    explain: `${part} ÷ ${filled} = ${each} per box. ${boxes} boxes × ${each} = ${whole} ${context.u}.`,
  };
}

/* ---------- Station 5: benchmark percentages ---------- */
/* benchmark percents: the fraction, and how to find it */
const BENCH = {
  10: ["1/10", "÷ 10"],
  20: ["1/5", "÷ 5"],
  25: ["1/4", "÷ 4"],
  50: ["1/2", "÷ 2"],
  75: ["3/4", "÷ 4, then × 3"],
  1: ["1/100", "÷ 100"],
};
/* the fraction for each percent, then two that look like it but aren't */
const BMC = {
  10: ["1/10", "1/100", "0.01"],
  20: ["1/5", "1/20", "0.02"],
  25: ["1/4", "1/25", "0.025"],
  50: ["1/2", "1/50", "0.05"],
  75: ["3/4", "1/75", "0.075"],
  1: ["1/100", "1/10", "0.1"],
};
function genBench() {
  const type = pick(["of", "of", "of", "sale", "back", "frac"]);
  const percent = pick(type === "of" ? [10, 25, 50, 75, 20, 1] : [10, 25, 50, 75, 20]);
  if (type === "frac") {
    /* the fraction that is the same as the percent */
    const [right, ...wrong] = BMC[percent];
    const choices = shuffle([right, ...wrong]);
    return {
      kind: "mc",
      choices: choices.map((x) => ({ id: x, label: x })),
      answer: right,
      why: Object.fromEntries(
        wrong.map((w) => [
          w,
          `${percent}% means ${percent} out of 100, which is ${percent}/100. ${w} is not the same.`,
        ]),
      ),
      prompt: `Which is the same as <b>${percent}%</b>?`,
      hint: `${percent}% means ${percent} out of 100. Simplify ${percent}/100.`,
      explain: `${percent}% = ${percent}/100 = ${right}.`,
    };
  }
  if (type === "back") {
    /* the number, from a benchmark percent of it */
    const number = pick([20, 40, 60, 80, 100, 120, 200, 240, 400]),
      part = (number * percent) / 100;
    return {
      kind: "num",
      unit: "",
      answer: number,
      prompt: `${percent}% of a number is ${fmt(part)}. What is the number?`,
      hint: `${percent}% is ${BENCH[percent][0]} of the number. How many copies of ${percent}% make 100%?`,
      misc: [
        [
          (part * percent) / 100,
          `That is ${percent}% of ${fmt(part)}. Here ${fmt(part)} <i>is</i> ${percent}%: the whole number is bigger.`,
        ],
        [part / percent, `That would be 1% of the number. Multiply by 100 to get 100%.`],
      ],
      explain: `${percent}% is ${BENCH[percent][0]}, so the number is ${fmt(part)} × ${fmt(100 / percent)} = ${number}.`,
    };
  }
  /* a whole whose benchmark percent is a friendly number */
  const whole = pick(
      percent === 75 || percent === 25
        ? [8, 12, 16, 20, 24, 36, 40, 48, 60, 80, 120]
        : [10, 20, 30, 40, 50, 60, 70, 80, 90, 120, 150, 200, 250, 300, 340, 500],
    ),
    part = (whole * percent) / 100;
  if (type === "sale") {
    /* a sale: the sale price, or the savings */
    const item = pick(["jacket", "skateboard", "video game", "pair of shoes", "backpack"]),
      askSale = Math.random() < 0.5;
    return {
      kind: "num",
      unit: "dollars",
      answer: askSale ? whole - part : part,
      prompt: `A ${item} costs ${money(whole)}. It is on sale for <b>${percent}% off</b>. ${askSale ? "What is the <b>sale price</b>?" : "How much money do you <b>save</b>?"}`,
      hint: `${percent}% is ${BENCH[percent][0]}. Find ${percent}% of ${money(whole)} (${BENCH[percent][1]}).${askSale ? " Then subtract it." : ""}`,
      /* at 50% off, the savings and the sale price are the same; for 10%, ÷ 10 is right */
      misc: askSale
        ? [
            ...(percent !== 50 ? [[part, `That is how much you save. Subtract it from ${money(whole)}.`]] : []),
            [
              whole - percent,
              `You subtracted ${percent} dollars, not ${percent}%. Find ${percent}% of ${money(whole)} first.`,
            ],
          ]
        : [
            ...(percent !== 50 ? [[whole - part, `That is the sale price. The question asks how much you save.`]] : []),
            ...(percent !== 10
              ? [[whole / percent, `${percent}% is ${BENCH[percent][0]}, so ${BENCH[percent][1]}.`]]
              : []),
          ],
      explain: `${percent}% of ${money(whole)} is ${money(part)}.${askSale ? ` ${money(whole)} − ${money(part)} = ${money(whole - part)}.` : ""}`,
    };
  }
  /* of: a benchmark percent of a number */
  return {
    kind: "num",
    unit: "",
    answer: part,
    prompt: `What is <b>${percent}% of ${whole}</b>?`,
    hint: `${percent}% is ${BENCH[percent][0]}, so ${BENCH[percent][1]}.`,
    misc: [
      ...(percent !== 10
        ? [
            [
              whole / percent,
              `${percent}% means ${percent} out of 100, which is ${BENCH[percent][0]}. Use ${BENCH[percent][1]}, not ÷ ${percent}.`,
            ],
          ]
        : []),
      [whole * percent, "Multiplying by " + percent + " makes it bigger. " + percent + "% is only part of the number."],
    ],
    explain: `${percent}% = ${BENCH[percent][0]}. ${whole} ${BENCH[percent][1]} = ${fmt(part)}.`,
  };
}

/* ---------- Station 6: percentage problems ---------- */
/* what's counted, where, and what some of them do */
const DCTX = [
  { all: "students", where: "in the class", verb: "play an instrument" },
  { all: "seats", where: "in the theater", verb: "are filled" },
  { all: "pages", where: "in the book", verb: "have pictures" },
  { all: "cars", where: "in the parking lot", verb: "are red" },
  { all: "plants", where: "in the garden", verb: "are tomatoes" },
];
function genDetect() {
  const context = pick(DCTX),
    type = pick(["part", "whole", "pct"]);
  /* not 75% of 300, where subtracting the percent (300 − 75) gives the answer */
  let percent, whole;
  do {
    percent = pick([10, 15, 20, 25, 30, 35, 40, 45, 60, 65, 70, 75, 80, 90]);
    whole = 20 * R(1, 15);
  } while (whole - percent === (whole * percent) / 100);
  const part = (whole * percent) / 100;
  const hint = `Find 10% first (the whole ÷ 10) or 1% (the whole ÷ 100), then scale up.`;
  /* part: the part, from the whole and the percent */
  if (type === "part")
    return {
      kind: "num",
      unit: context.all,
      answer: part,
      fig: pctLine(whole, percent, part, { askA: 1 }),
      prompt: `There are ${whole} ${context.all} ${context.where}. ${percent}% of them ${context.verb}. How many ${context.all} ${context.verb}?`,
      hint,
      /* for 10%, ÷ 10 is right, and the whole ÷ the part is 10 */
      misc: [
        ...(percent !== 10
          ? [[whole / percent, `${percent}% is not “divide by ${percent}”. It means ${percent} out of every 100.`]]
          : []),
        [whole * percent, `Multiply by ${percent}/100, not by ${percent}.`],
        [whole - percent, "Percents are parts of the whole, not an amount to subtract."],
      ],
      explain: `1% of ${whole} is ${fmt(whole / 100)}. ${percent} × ${fmt(whole / 100)} = ${fmt(part)} ${context.all}.`,
    };
  if (type === "whole") {
    /* whole: the whole, from a part and its percent (dealt again, so the part is a whole number) */
    const whole2 = pick([20, 40, 60, 80, 100, 120, 160, 200]),
      percent2 = pick(
        [5, 10, 20, 25, 30, 40, 50, 60, 75, 80].filter(
          (p) => nice2((whole2 * p) / 100) && Number.isInteger((whole2 * p) / 100),
        ),
      ),
      part2 = (whole2 * percent2) / 100;
    return {
      kind: "num",
      unit: context.all,
      answer: whole2,
      fig: pctLine(whole2, percent2, part2, { askW: 1 }),
      prompt: `${fmt(part2)} ${context.all} ${context.where} ${context.verb}. That is ${percent2}% of all the ${context.all}. How many ${context.all} are ${context.where}?`,
      hint: `${fmt(part2)} is ${percent2}%. Divide to find 1% (${fmt(part2)} ÷ ${percent2}), then multiply by 100.`,
      misc: [
        [
          (part2 * percent2) / 100,
          `That is ${percent2}% of ${fmt(part2)}. Here ${fmt(part2)} <i>is</i> the ${percent2}%, so the whole is bigger.`,
        ],
        [part2 / percent2, "That is 1%. Multiply by 100 to get the whole."],
      ],
      explain: `${fmt(part2)} ÷ ${percent2} = ${fmt(part2 / percent2)} for 1%. × 100 = ${whole2} ${context.all}.`,
    };
  }
  /* pct: the percent, from the part and the whole */
  return {
    kind: "num",
    unit: "%",
    answer: percent,
    fig: pctLine(whole, percent, part, { askP: 1 }),
    prompt: `There are ${whole} ${context.all} ${context.where}. ${fmt(part)} of them ${context.verb}. What <b>percent</b> of the ${context.all} ${context.verb}?`,
    hint: `Divide the part by the whole (${fmt(part)} ÷ ${whole}), then multiply by 100.`,
    misc: [
      [part / whole, `${fmt(part / whole)} is the part out of 1. Multiply by 100 to get the percent.`],
      ...(percent !== 10 ? [[whole / part, "Divide the part by the whole, not the whole by the part."]] : []),
    ],
    explain: `${fmt(part)} ÷ ${whole} = ${fmt(part / whole)}, and ${fmt(part / whole)} × 100 = ${percent}%.`,
  };
}

/* ---------- stations ---------- */
const ICON = {
  conv: '<g stroke="#ffc93c" stroke-width="2.5" fill="rgba(255,201,60,.15)"><rect x="4" y="12" width="56" height="14" rx="2"/></g><g stroke="#ffc93c" stroke-width="2"><line x1="18" y1="12" x2="18" y2="20"/><line x1="32" y1="12" x2="32" y2="20"/><line x1="46" y1="12" x2="46" y2="20"/></g><g stroke="#7fe3ff" stroke-width="2.5" fill="rgba(127,227,255,.15)"><rect x="4" y="38" width="56" height="14" rx="2"/></g><g stroke="#7fe3ff" stroke-width="1.5"><line x1="8.7" y1="38" x2="8.7" y2="44"/><line x1="13.3" y1="38" x2="13.3" y2="44"/><line x1="18" y1="38" x2="18" y2="46"/><line x1="22.7" y1="38" x2="22.7" y2="44"/><line x1="27.3" y1="38" x2="27.3" y2="44"/><line x1="32" y1="38" x2="32" y2="46"/></g>',
  rate: '<text x="32" y="28" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="17" fill="#ffc93c">$12</text><line x1="12" y1="34" x2="52" y2="34" stroke="#f3f6fb" stroke-width="2.5"/><text x="32" y="54" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="15" fill="#7fe3ff">4 lb</text>',
  speed:
    '<g fill="none" stroke-width="3" stroke-linecap="round"><path d="M10,50 A26,26 0 1 1 54,50" stroke="#f3f6fb"/><line x1="32" y1="36" x2="48" y2="20" stroke="#ffc93c"/></g><circle cx="32" cy="36" r="4" fill="#ffc93c"/><g stroke="#7fe3ff" stroke-width="2"><line x1="15" y1="22" x2="19" y2="25"/><line x1="32" y1="12" x2="32" y2="16"/><line x1="49" y1="22" x2="45" y2="25"/></g>',
  strip:
    '<rect x="4" y="20" width="56" height="18" fill="rgba(127,227,255,.15)" stroke="#7fe3ff" stroke-width="2.5"/><rect x="4" y="20" width="33.6" height="18" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2.5"/><text x="20" y="54" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="12" fill="#ffc93c">60%</text>',
  bench:
    '<circle cx="32" cy="32" r="24" fill="rgba(127,227,255,.15)" stroke="#7fe3ff" stroke-width="2.5"/><path d="M32,32 L32,8 A24,24 0 0 1 56,32 Z" fill="rgba(255,201,60,.55)" stroke="#ffc93c" stroke-width="2.5"/>',
  detect:
    '<circle cx="26" cy="26" r="16" fill="rgba(127,227,255,.12)" stroke="#7fe3ff" stroke-width="3"/><line x1="38" y1="38" x2="56" y2="56" stroke="#7fe3ff" stroke-width="5" stroke-linecap="round"/><text x="26" y="32" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="16" fill="#ffc93c">%</text>',
  boss: '<rect x="6" y="6" width="52" height="52" rx="4" fill="none" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="5 4"/><polygon points="32,12 38,26 53,27 41,37 45,52 32,43 19,52 23,37 11,27 26,26" fill="#ffc93c"/>',
};
const ZONES = [
  {
    id: "conv",
    name: "Unit Converter",
    lessons: "Lessons 2–4",
    blurb: "Pick sensible units and convert between them. Smaller units mean more of them.",
    gen: genConv,
  },
  {
    id: "rate",
    name: "Rate Lab",
    lessons: "Lessons 6–7",
    blurb: "Every ratio has two unit rates. Find them, read them, and use the right one.",
    gen: genRate,
  },
  {
    id: "speed",
    name: "Speed & Pace Track",
    lessons: "Lessons 5, 8–9",
    blurb: "Meters per second or minutes per mile? Find who is faster and how long a trip takes.",
    gen: genSpeed,
  },
  {
    id: "strip",
    name: "Percent Strip",
    lessons: "Lessons 10–12",
    blurb: "Percent of a dollar, percents on double number lines, and tape diagrams.",
    gen: genStrip,
  },
  {
    id: "bench",
    name: "Benchmark Shop",
    lessons: "Lesson 13",
    blurb: "10%, 25%, 50%, 75% in your head. Sales, discounts, and working backward.",
    gen: genBench,
  },
  {
    id: "detect",
    name: "Percent Detective",
    lessons: "Lessons 14–16",
    blurb: "Find the part, the whole, or the percent.",
    gen: genDetect,
  },
  {
    id: "boss",
    name: "Final Lap",
    lessons: "Whole unit · 10 problems",
    blurb: "A mixed review from every station. Aim for 3 stars.",
    gen: () => pick([genConv, genRate, genSpeed, genStrip, genBench, genDetect])(),
  },
];
