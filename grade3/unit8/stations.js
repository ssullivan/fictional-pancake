/* Field Day (Grade 3 Unit 8): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Strips and number lines to estimate from (guessStrip, stripStack, guessLine), tiny houses (HOUSES), and floor plans
   (floorPlan) come from figs.js; fraction number lines (fracLine) and comparing fractions (compareFr, SIGN_HTML) from
   shared/fractions.js; fr and PART from shared/pictures.js; tape diagrams (partWhole) from shared/numlines.js; bar graphs
   (barGraph) from shared/graphs.js; rectangles with their sides (rectFig) from shared/shapes.js; arrays (arrayFig) and equal
   groups (groupsFig) from shared/multiply.js; mcOf and miscOf from shared/util.js. Each generator deals one of a few kinds of
   problem (variant), each with a comment saying what it asks. Every problem also carries facts for checks.js: its kind (t)
   and the numbers it was made from, so the answer can be worked out again. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* n and the word for it: "1 room", "3 rooms" (plural: the word for more than one) */
const pl = (n, word, plural = word + "s") => `${n} ${n === 1 ? word : plural}`;
/* the named mistakes that apply to these numbers: a wrong value equal to the answer, or not above 0, is left out */
const namedMisc = (answer, list) =>
  miscOf(
    answer,
    list.filter(([value]) => value > 0 && Math.abs(value - answer) > 1e-9),
  );
/* items joined in a sentence: "a, b, and c" */
const andList = (items) =>
  items.length < 3 ? items.join(" and ") : `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
/* the text with its first letter capitalized */
const cap = (text) => text[0].toUpperCase() + text.slice(1);
/* dollars with a comma: $1,000 */
const dollars = (n) => "$" + n.toLocaleString("en-US");
/* a sum of numbers, written out: "80 + 64" */
const plus = (nums) => nums.join(" + ");
const total = (nums) => nums.reduce((sum, n) => sum + n, 0);

/* ---------- Guessing Booth: estimate fractions (Lesson 1) ---------- */
/* the denominators Grade 3 uses */
const DENS = [2, 3, 4, 6, 8];
/* every fraction less than 1 with those denominators, in simplest form (1/2 once, not 2/4 and 4/8 too), as [k, d] */
const UNDER_ONE = DENS.flatMap((d) => range(d - 1).map((i) => [i + 1, d])).filter(([k, d]) => gcd(k, d) === 1);
const value = ([k, d]) => k / d;
/* `count` fractions from `pool`, each at least `apart` from `answer` and from each other (an estimate has to tell them apart) */
function farFrom(answer, pool, count, apart) {
  const chosen = [];
  for (const f of shuffle(pool))
    if ([answer, ...chosen].every((g) => Math.abs(value(f) - value(g)) >= apart)) {
      chosen.push(f);
      if (chosen.length === count) break;
    }
  return chosen;
}
/* why a guess for the shaded part is off: too little or too much, and which side of half it's on */
const stripWhy = (guess, answer) =>
  value(guess) < value(answer)
    ? `That’s too little: the shading goes farther.${value(guess) < 0.5 && value(answer) > 0.5 ? " More than half the strip is shaded." : ""}`
    : `That’s too much: the shading stops sooner.${value(guess) > 0.5 && value(answer) < 0.5 ? " Less than half the strip is shaded." : ""}`;
/* why a guess for a point is off, with 1 as the landmark */
const pointWhy = (guess, answer) =>
  value(guess) < 1 && value(answer) > 1
    ? "That’s less than 1, but the point is past 1."
    : value(guess) > 1 && value(answer) < 1
      ? "That’s more than 1, but the point is before 1."
      : value(guess) < value(answer)
        ? "That’s too small: the point is farther from 0."
        : "That’s too big: the point is closer to 0.";
function genEstimate() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* about what fraction of the strip is shaded? */
    const answer = pick(UNDER_ONE),
      others = farFrom(answer, UNDER_ONE, 2, 0.2);
    if (others.length < 2) return genEstimate();
    return {
      ...mcOf([[fr(...answer), null], ...others.map((f) => [fr(...f), stripWhy(f, answer)])]),
      facts: { t: "stripGuess", k: answer[0], d: answer[1] },
      prompt: "About what fraction of the strip is shaded?",
      fig: (show) => guessStrip(...answer, { cut: show ? answer[1] : 0 }),
      hint: "Is it more or less than half? Picture the strip cut into equal parts the size of the shading.",
      explain: `Cut into ${PART[answer[1]][1]}, the shading covers ${answer[0]} of the ${answer[1]} parts: ${fr(...answer)}.`,
    };
  }
  if (variant === 1) {
    /* is a friend's guess too low, about right, or too high? An about-right guess may be an equal fraction (2/4 for 1/2). */
    const answer = pick(UNDER_ONE),
      kid = pick(KIDS),
      call = pick(["low", "right", "high"]),
      /* every fraction under 1, equal ones too, then the ones that fit the call */
      all = DENS.flatMap((d) => range(d - 1).map((i) => [i + 1, d])),
      fits = all.filter(([k, d]) =>
        call === "right"
          ? k * answer[1] === answer[0] * d
          : call === "low"
            ? value([k, d]) <= value(answer) - 0.25
            : value([k, d]) >= value(answer) + 0.25,
      );
    if (!fits.length) return genEstimate();
    const guess = pick(fits),
      CALLS = { low: "Too low", right: "About right", high: "Too high" };
    const WHY = {
      low: "That would mean the shading is more than the guess.",
      right: "That would mean the guess matches the shading.",
      high: "That would mean the shading is less than the guess.",
    };
    return {
      ...mcOf(
        ["low", "right", "high"].map((c) => [
          CALLS[c],
          c === call ? null : WHY[c] + " Compare the guess with the strip.",
        ]),
      ),
      facts: { t: "guessCall", k: answer[0], d: answer[1], g: guess[0], h: guess[1], call },
      prompt: `${kid} guesses that ${fr(...guess)} of the strip is shaded. Is that guess too low, about right, or too high?`,
      fig: (show) => guessStrip(...answer, { cut: show ? answer[1] : 0 }),
      hint: `Picture ${fr(...guess)} of the strip. Does the shading stop before it, at it, or after it?`,
      explain: `The shading is ${fr(...answer)} of the strip, so ${fr(...guess)} is ${CALLS[call].toLowerCase()}.`,
    };
  }
  if (variant === 2) {
    /* about what number is at the point? A fraction between 0 and 2 that isn't a whole number */
    const pool = [2, 3, 4].flatMap((d) => range(2 * d - 1).map((i) => [i + 1, d])).filter(([k, d]) => gcd(k, d) === 1),
      answer = pick(pool),
      others = farFrom(answer, pool, 2, 0.4);
    if (others.length < 2) return genEstimate();
    return {
      ...mcOf([[fr(...answer), null], ...others.map((f) => [fr(...f), pointWhy(f, answer)])]),
      facts: { t: "lineGuess", k: answer[0], d: answer[1] },
      prompt: "About what number is at the point?",
      fig: (show) => guessLine(...answer, 2, { cut: show ? answer[1] : 0 }),
      hint: "Is the point before 1 or after 1? Then picture the space between the whole numbers cut into equal parts.",
      explain: `With each whole cut into ${PART[answer[1]][1]}, the point is ${answer[0]} jumps of ${fr(1, answer[1])} from 0: ${fr(...answer)}.`,
    };
  }
  /* tap the strip that's about k/d shaded */
  const target = pick(UNDER_ONE),
    others = farFrom(target, UNDER_ONE, 2, 0.2);
  if (others.length < 2) return genEstimate();
  const list = shuffle([target, ...others]),
    answer = list.indexOf(target),
    why = {};
  list.forEach((f, i) => {
    if (i !== answer)
      why[i] =
        `That strip is about ${fr(...f)} shaded: ${value(f) < value(target) ? "less" : "more"} than ${fr(...target)}.`;
  });
  return {
    kind: "tap",
    answer: String(answer),
    why,
    facts: { t: "tapStrip", list, target },
    prompt: `Tap the strip that’s about ${fr(...target)} shaded.`,
    fig: (show) => stripStack(list, { tap: true, cut: show }),
    hint: `Is ${fr(...target)} more or less than half? Look for a strip whose shading stops near there.`,
    explain: `Strip ${"ABC"[answer]} is cut into ${PART[target[1]][1]}, with ${target[0]} shaded: ${fr(...target)}.`,
  };
}

/* ---------- Fraction Relay: fractions on the number line, whole numbers, and comparing (Lessons 2–3) ---------- */
/* a denominator and how many wholes a number line can have with it, so its ticks aren't too close: 16 parts at most */
const LINES = DENS.flatMap((d) => [2, 3].filter((wholes) => d * wholes <= 16).map((wholes) => [d, wholes]));
/* a tick's fraction, and the whole number it is too when it is one */
const tickName = (k, d) => `${fr(k, d)}${k % d === 0 ? `, which is ${k / d}` : ""}`;
/* a comparison and why it holds: [a, b, words] for a pair of fractions [n, d] of the kind asked */
function comparePair(kind) {
  if (kind === "sameDen") {
    const d = pick(DENS),
      [a, b] = shuffle(range(2 * d).map((i) => i + 1)).slice(0, 2);
    return [[a, d], [b, d], `The parts are the same size, ${PART[d][1]}, so the one with more parts is greater.`];
  }
  if (kind === "sameNum") {
    const [d1, d2] = shuffle(DENS).slice(0, 2),
      n = R(1, Math.min(d1, d2) + 2);
    return [
      [n, d1],
      [n, d2],
      `Both are ${n} parts. ${cap(PART[Math.min(d1, d2)][1])} are bigger parts than ${PART[Math.max(d1, d2)][1]}, so ${n} ${PART[Math.min(d1, d2)][n === 1 ? 0 : 1]} is more.`,
    ];
  }
  if (kind === "acrossOne") {
    /* one fraction more than 1 and one less, with different denominators */
    const [d1, d2] = shuffle(DENS).slice(0, 2),
      over = [R(d1 + 1, 2 * d1 - 1), d1],
      under = [R(1, d2 - 1), d2],
      [a, b] = shuffle([over, under]);
    return [a, b, `${fr(...over)} is more than 1, and ${fr(...under)} is less than 1.`];
  }
  /* two names for the same whole number: 6/3 and 4/2 */
  const whole = R(1, 3),
    [d1, d2] = shuffle(DENS.filter((d) => d * whole <= 16)).slice(0, 2);
  return [
    [whole * d1, d1],
    [whole * d2, d2],
    `Both are ${whole} whole${whole === 1 ? "" : "s"}: ${fr(whole * d1, d1)} = ${whole} and ${fr(whole * d2, d2)} = ${whole}.`,
  ];
}
function genRelay() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* tap where a fraction more than 1 goes */
    const [d, wholes] = pick(LINES),
      k = R(d + 1, d * wholes),
      why = {};
    range(d * wholes + 1).forEach((j) => {
      if (j !== k) why[j] = `That tick is ${tickName(j, d)}. Count ${k} jumps of ${fr(1, d)} from 0.`;
    });
    return {
      kind: "tap",
      answer: String(k),
      why,
      facts: { t: "tapFrac", k, d, wholes },
      prompt: `Tap where ${fr(k, d)} goes on the number line.`,
      fig: (show) => fracLine([{ d, tap: "cand", hops: show ? k : 0 }], { wholes }),
      hint: `Each whole is cut into ${PART[d][1]}. ${fr(d, d)} is 1, so ${fr(k, d)} is past 1.`,
      explain: `${k} jumps of ${fr(1, d)} from 0 land on ${tickName(k, d)}.`,
    };
  }
  if (variant === 1) {
    /* what fraction is at the point? (a fraction more than 1 that isn't a whole number) */
    const [d, wholes] = pick(LINES),
      k = pick(
        range(d * wholes - d)
          .map((i) => i + d + 1)
          .filter((j) => j % d),
      ),
      answer = k / d;
    return {
      kind: "num",
      frac: true,
      unit: "",
      answer,
      facts: { t: "readPoint", k, d, wholes },
      prompt: "What fraction is at the point? Type it like 5/4.",
      fig: (show) => fracLine([{ d, pts: [{ k }], hops: show ? k : 0, labs: show }], { wholes }),
      misc: namedMisc(answer, [
        [(k + 1) / d, "That counts the tick at 0. Count the jumps from 0, not the ticks."],
        [
          k / (d * wholes),
          `That uses ${d * wholes}, the parts in the whole line. The bottom number is the parts in 1 whole: ${d}.`,
        ],
      ]),
      hint: `How many equal parts is 1 whole cut into? Count the jumps from 0 to the point.`,
      explain: `Each whole is cut into ${PART[d][1]}. The point is ${k} jumps of ${fr(1, d)} from 0, so it’s ${fr(k, d)}.`,
    };
  }
  if (variant === 2) {
    /* a whole number written as a fraction: n/d = ?, or w = ?/d */
    const [d, wholes] = pick(LINES),
      whole = R(1, wholes),
      n = whole * d;
    if (Math.random() < 0.5)
      return {
        kind: "num",
        unit: "",
        answer: whole,
        facts: { t: "wholeFrac", n, d, ask: "whole" },
        prompt: `${fr(n, d)} = ? What whole number is it?`,
        fig: (show) => fracLine([{ d, pts: [{ k: n }], hops: show ? n : 0 }], { wholes }),
        misc: namedMisc(whole, [
          [n - d, `That takes ${d} away from ${n}. ${fr(n, d)} is ${n} ${PART[d][1]}: how many wholes do they make?`],
          [n, `That’s how many ${PART[d][1]}. Every ${d} of them make 1 whole.`],
        ]),
        hint: `${d} ${PART[d][1]} make 1 whole. How many wholes do ${n} ${PART[d][1]} make?`,
        explain: `${d} ${PART[d][1]} make 1 whole, so ${n} ${PART[d][1]} make ${whole}: ${fr(n, d)} = ${whole}.`,
      };
    return {
      kind: "num",
      unit: "",
      answer: n,
      facts: { t: "wholeFrac", n, d, ask: "top" },
      prompt: `${whole} = ${fr("?", d)} What number goes on top?`,
      fig: (show) => fracLine([{ d, pts: [{ k: n }], hops: show ? n : 0, labs: show }], { wholes }),
      misc: namedMisc(n, [
        [whole + d, `That adds ${whole} and ${d}. Each whole is ${d} ${PART[d][1]}.`],
        [whole, `That’s the whole number. How many ${PART[d][1]} are in ${pl(whole, "whole")}?`],
      ]),
      hint: `Each whole is ${d} ${PART[d][1]}. Count by ${d}s, once for each whole.`,
      explain: `Each whole is ${d} ${PART[d][1]}, so ${pl(whole, "whole")} ${whole === 1 ? "is" : "are"} ${n} ${PART[d][1]}: ${whole} = ${fr(n, d)}.`,
    };
  }
  /* which sign makes it true? */
  const kind = pick(["sameDen", "sameNum", "acrossOne", "equal"]),
    [a, b, because] = comparePair(kind),
    right = compareFr(a, b),
    WRONG = {
      "<": `That says ${fr(...a)} is less.`,
      ">": `That says ${fr(...a)} is greater.`,
      "=": "That says they’re the same size.",
    };
  return {
    ...mcOf(
      ["<", "=", ">"].map((s) => [
        `${fr(...a)} ${SIGN_HTML[s]} ${fr(...b)}`,
        s === right ? null : `${WRONG[s]} ${because}`,
      ]),
    ),
    facts: { t: "compare", a, b, kind },
    prompt: "Which is true?",
    fig: () =>
      fracLine(
        [
          { d: a[1], pts: [{ k: a[0] }] },
          { d: b[1], pts: [{ k: b[0], cls: "b" }] },
        ],
        { wholes: Math.max(2, Math.ceil(Math.max(value(a), value(b)))) },
      ),
    hint: "Both fractions are on number lines that line up. The one farther from 0 is greater.",
    explain: `${because} So ${fr(...a)} ${SIGN_HTML[right]} ${fr(...b)}.`,
  };
}

/* ---------- Tiny House Lot: area and perimeter of floor plans (Lesson 4) ---------- */
/* room names that fit a room 4 feet long */
const ROOMS = ["Kitchen", "Bedroom", "Bath", "Office", "Den"];
/* a house split into `count` rooms, each at least 4 feet long, whose floors are friendly to multiply: each room's area is
   within 100, or its length is a multiple of 10. Returns the rooms' lengths, left to right, or null. */
function splitRooms(house, count) {
  for (let tries = 0; tries < 50; tries++) {
    const cuts = range(count - 1)
        .map(() => R(4, house.long - 4))
        .sort((a, b) => a - b),
      edges = [0, ...cuts, house.long],
      rooms = range(count).map((i) => edges[i + 1] - edges[i]);
    if (rooms.every((len) => len >= 4 && (len * house.wide <= 100 || len % 10 === 0))) return rooms;
  }
  return null;
}
/* a house to split into rooms, the rooms, their names, and which room is asked about */
function planOf(minRooms = 2) {
  const house = pick(Object.values(HOUSES)),
    count = R(minRooms, house.long >= 14 ? 3 : 2),
    rooms = splitRooms(house, count);
  if (!rooms) return planOf(minRooms);
  return { house, rooms, names: shuffle(ROOMS).slice(0, count), i: R(0, count - 1) };
}
function genHouse() {
  const variant = R(0, 5);
  if (variant === 0 || variant === 1) {
    /* the whole floor's area (variant 0) or perimeter (variant 1) */
    const house = pick(Object.values(HOUSES)),
      { wide, long } = house,
      area = wide * long,
      perimeter = 2 * (wide + long),
      askArea = variant === 0,
      fig = () => floorPlan(wide, [long], { label: `A floor plan ${wide} feet by ${long} feet` }),
      sideText = `${wide} feet by ${long} feet`;
    if (askArea)
      return {
        kind: "num",
        unit: "square feet",
        answer: area,
        facts: { t: "houseArea", wide, long },
        prompt: `A tiny house made from a ${house.name} has a floor ${sideText}. What is the area of the floor?`,
        fig,
        misc: namedMisc(area, [
          [
            perimeter,
            `That’s the perimeter, the length around. Area is the square feet that cover the floor: ${wide} × ${long}.`,
          ],
          [wide + long, `That adds the sides. Area multiplies them: ${wide} × ${long}.`],
        ]),
        hint:
          "Area of a rectangle: multiply the side lengths." +
          (long % 10 === 0 ? ` ${wide} × ${long} is ${wide} × ${long / 10} tens.` : ""),
        explain: `${wide} × ${long} = ${area}, so the floor is ${area} square feet.`,
      };
    return {
      kind: "num",
      unit: "feet",
      answer: perimeter,
      facts: { t: "housePerimeter", wide, long },
      prompt: `A tiny house made from a ${house.name} has a floor ${sideText}. What is the perimeter of the floor?`,
      fig,
      misc: namedMisc(perimeter, [
        [area, `That’s the area. The perimeter is the length all the way around.`],
        [wide + long, `That’s one width and one length. Go all the way around: 4 sides.`],
      ]),
      hint: "Add all 4 sides. The sides across from each other are the same length.",
      explain: `${wide} + ${long} + ${wide} + ${long} = ${perimeter} feet.`,
    };
  }
  if (variant === 2) {
    /* one room's area */
    const { house, rooms, names, i } = planOf(),
      { wide } = house,
      len = rooms[i],
      area = wide * len;
    return {
      kind: "num",
      unit: "square feet",
      answer: area,
      facts: { t: "roomArea", wide, rooms, i },
      prompt: `This tiny house is ${wide} feet wide. What is the area of the ${names[i].toLowerCase()} floor?`,
      fig: (show) =>
        floorPlan(wide, rooms, { names, inside: show ? rooms.map((r, j) => (j === i ? `${wide} × ${r}` : null)) : [] }),
      misc: namedMisc(area, [
        [wide * house.long, "That’s the whole house. Find just the one room."],
        [2 * (wide + len), `That’s the length around the room. Area multiplies: ${wide} × ${len}.`],
        [wide + len, `That adds the sides. Area multiplies them: ${wide} × ${len}.`],
      ]),
      hint: `The room is ${wide} feet by ${len} feet. Multiply.`,
      explain: `The ${names[i].toLowerCase()} is ${wide} feet by ${len} feet: ${wide} × ${len} = ${area} square feet.`,
    };
  }
  if (variant === 3) {
    /* a room's missing length, from its area or from the house's length */
    const { house, rooms, names, i } = planOf(),
      { wide, long } = house,
      len = rooms[i],
      room = names[i].toLowerCase(),
      fromArea = Math.random() < 0.5,
      others = rooms.filter((r, j) => j !== i);
    if (fromArea)
      return {
        kind: "num",
        unit: "feet",
        answer: len,
        facts: { t: "roomLength", wide, rooms, i, from: "area" },
        prompt: `The ${room} has an area of ${wide * len} square feet. How long is it?`,
        fig: () =>
          floorPlan(wide, rooms, {
            names,
            ask: i,
            label: `A floor plan ${wide} feet wide, with the ${room}’s length marked ?`,
          }),
        misc: namedMisc(len, [
          [wide * len - wide, `That subtracts ${wide}. Think: ${wide} × ? = ${wide * len}.`],
          [wide * len, "That’s the area. The question asks for a length."],
        ]),
        hint: `${wide} × ? = ${wide * len}. What times ${wide} is ${wide * len}?`,
        explain: `${wide} × ${len} = ${wide * len}, so the ${room} is ${len} feet long.`,
      };
    return {
      kind: "num",
      unit: "feet",
      answer: len,
      facts: { t: "roomLength", wide, rooms, i, from: "long" },
      prompt: `The tiny house is ${long} feet long. How long is the ${room}?`,
      fig: () =>
        floorPlan(wide, rooms, {
          names,
          ask: i,
          label: `A floor plan ${wide} feet wide, with the ${room}’s length marked ?`,
        }),
      misc: namedMisc(len, [
        [
          total(others),
          `That’s the other ${others.length === 1 ? "room" : "rooms"}. Take ${others.length === 1 ? "it" : "them"} away from ${long}.`,
        ],
        [long + total(others), `That adds. The rooms together make ${long} feet, so subtract.`],
      ]),
      hint: `The rooms together are ${long} feet long. Take away the lengths you know.`,
      explain: `${long} − ${others.join(" − ")} = ${len}, so the ${room} is ${len} feet long.`,
    };
  }
  if (variant === 4) {
    /* a cabin with a loft: the floor area of both floors */
    const { wide, long } = HOUSES.cabin,
      loft = R(4, 8),
      down = wide * long,
      up = wide * loft,
      area = down + up;
    return {
      kind: "num",
      unit: "square feet",
      answer: area,
      facts: { t: "cabin", wide, long, loft },
      prompt: `A tiny cabin has a downstairs floor ${wide} feet by ${long} feet, and a loft upstairs ${wide} feet by ${loft} feet. How many square feet of floor does it have in all?`,
      fig: (show) =>
        floorPlan(wide, [long], { names: ["Down"], inside: [show ? `${down}` : null] }) +
        floorPlan(wide, [loft], { names: ["Loft"], inside: [show ? `${up}` : null] }),
      misc: namedMisc(area, [
        [down, "That’s only the downstairs. Add the loft’s floor too."],
        [up, "That’s only the loft. Add the downstairs floor too."],
      ]),
      hint: "Find the area of each floor, then add them.",
      explain: `Downstairs: ${wide} × ${long} = ${down}. Loft: ${wide} × ${loft} = ${up}. ${down} + ${up} = ${area} square feet.`,
    };
  }
  /* trim around one room's floor: its perimeter */
  const { house, rooms, names, i } = planOf(),
    { wide } = house,
    len = rooms[i],
    room = names[i].toLowerCase(),
    perimeter = 2 * (wide + len);
  return {
    kind: "num",
    unit: "feet",
    answer: perimeter,
    facts: { t: "trim", wide, rooms, i },
    prompt: `Trim goes all the way around the edge of the ${room} floor. How many feet of trim does it need?`,
    fig: () => floorPlan(wide, rooms, { names }),
    misc: namedMisc(perimeter, [
      [wide * len, "That’s the area of the floor. Trim goes around the edge: the perimeter."],
      [wide + len, "That’s one width and one length. Go all the way around."],
      [2 * (wide + house.long), "That’s around the whole house. Go around just the one room."],
    ]),
    hint: `The ${room} is ${wide} feet by ${len} feet. Add all 4 sides.`,
    explain: `${wide} + ${len} + ${wide} + ${len} = ${perimeter} feet of trim.`,
  };
}

/* ---------- Tiny House Shop: what it costs (Lesson 5) ---------- */
/* things to buy and their prices, in dollars */
const ITEMS = {
  stove: 280,
  sink: 150,
  fridge: 350,
  bed: 240,
  sofa: 320,
  table: 90,
  toilet: 120,
  shower: 380,
  desk: 140,
};
/* small things that come more than one at a time, and their prices */
const SMALL = { lamp: 25, chair: 35, shelf: 45, rug: 60, "towel set": 15 };
/* more than one of a small thing: "shelves", "lamps" */
const plural = (name) => (name === "shelf" ? "shelves" : name + "s");
/* can Grade 3 multiply n × price? Within 100, or a one-digit number times a multiple of 10 */
const gradeThreeProduct = (n, price) => n * price <= 100 || price % 10 === 0;
/* floors: what it's made of, and its cost for each square foot */
const FLOORS = { carpet: 2, "vinyl flooring": 3, "wood flooring": 4, tile: 5 };
/* a room's floor, in feet, whose area is a whole number of tens (so the cost is a one-digit number times tens) */
const FLOOR_SIZES = [
  [5, 6],
  [4, 10],
  [5, 8],
  [6, 10],
  [8, 10],
  [7, 10],
  [4, 5],
  [5, 10],
  [6, 5],
];
/* what each place of a sum carries to the next, ones first (the standard algorithm's regroups) */
function carriesOf(nums) {
  let carry = 0;
  return [1, 10, 100].map((place) => {
    carry = Math.floor((total(nums.map((n) => Math.floor(n / place) % 10)) + carry) / 10);
    return carry;
  });
}
/* a sum is friendly when no place regroups more than once, and three numbers regroup in one place at most */
const friendlySum = (nums) =>
  carriesOf(nums).every((carry) => carry <= 1) &&
  carriesOf(nums).filter((carry) => carry).length <= (nums.length === 2 ? 2 : 1);
/* a sum added without regrouping: each place's digits added, keeping only the ones digit (the mistake) */
const noRegroup = (nums) =>
  [1, 10, 100].reduce((sum, place) => sum + (total(nums.map((n) => Math.floor(n / place) % 10)) % 10) * place, 0);
/* `count` different items whose prices add to `most` or less, with a friendly sum */
function itemsUnder(count, most) {
  for (let tries = 0; tries < 100; tries++) {
    const names = shuffle(Object.keys(ITEMS)).slice(0, count),
      prices = names.map((name) => ITEMS[name]);
    if (total(prices) <= most && friendlySum(prices)) return names;
  }
  return null;
}
function genShop() {
  const variant = R(0, 4);
  if (variant === 0) {
    /* flooring for a room: its area times the cost of a square foot */
    const [wide, long] = pick(FLOOR_SIZES),
      floor = pick(Object.keys(FLOORS)),
      price = FLOORS[floor],
      area = wide * long,
      cost = area * price,
      roomName = pick(ROOMS),
      room = roomName.toLowerCase();
    return {
      kind: "num",
      unit: "dollars",
      answer: cost,
      facts: { t: "flooring", wide, long, price },
      prompt: `The ${room} is ${wide} feet by ${long} feet. ${cap(floor)} costs $${price} a square foot. How much does it cost to cover the floor?`,
      fig: (show) => floorPlan(wide, [long], { names: [roomName], inside: [show ? `${area} sq ft` : null] }),
      misc: namedMisc(cost, [
        [area, `That’s the area: ${area} square feet. Each square foot costs $${price}.`],
        [2 * (wide + long) * price, "That uses the perimeter. Flooring covers the area."],
        [area + price, `That adds $${price}. Each of the ${area} square feet costs $${price}: multiply.`],
      ]),
      hint: `First find the area: ${wide} × ${long}. Then each square foot costs $${price}.`,
      explain: `${wide} × ${long} = ${area} square feet. ${area} × ${price} = ${cost}, so it costs $${cost}.`,
    };
  }
  if (variant === 1) {
    /* the cost of two or three things */
    const count = R(2, 3),
      names = itemsUnder(count, 1000);
    if (!names) return genShop();
    const prices = names.map((name) => ITEMS[name]),
      sum = total(prices),
      wrongSum = noRegroup(prices),
      kid = pick(KIDS);
    return {
      kind: "num",
      unit: "dollars",
      answer: sum,
      facts: { t: "sum", prices },
      prompt: `${kid} buys ${andList(names.map((name, i) => `a ${name} for $${prices[i]}`))}. How much is that in all?`,
      misc: namedMisc(sum, [
        [wrongSum, "Check your regrouping: 10 tens make a hundred, and 10 ones make a ten."],
        ...(count === 2 ? [[Math.abs(prices[0] - prices[1]), "That subtracts. In all means add."]] : []),
      ]),
      hint: "Add the prices. Add the hundreds, the tens, and the ones.",
      explain: `${plus(prices)} = ${sum}, so it’s $${sum} in all.`,
    };
  }
  if (variant === 2) {
    /* what's left of $1,000 after two things */
    const names = itemsUnder(2, 900);
    if (!names) return genShop();
    const budget = 1000,
      prices = names.map((name) => ITEMS[name]),
      spent = total(prices),
      left = budget - spent;
    return {
      kind: "num",
      unit: "dollars",
      answer: left,
      facts: { t: "left", prices, budget },
      prompt: `There’s ${dollars(budget)} to spend on a room. A ${names[0]} costs $${prices[0]} and a ${names[1]} costs $${prices[1]}. How much is left after buying both?`,
      misc: namedMisc(left, [
        [spent, `That’s what they cost. Take it away from ${dollars(budget)}.`],
        [budget - prices[0], `That only takes away the ${names[0]}. Take away the ${names[1]} too.`],
        [budget - prices[1], `That only takes away the ${names[1]}. Take away the ${names[0]} too.`],
      ]),
      hint: `Add the two prices, then subtract from ${dollars(budget)}.`,
      explain: `${prices[0]} + ${prices[1]} = ${spent}, and 1000 − ${spent} = ${left}. $${left} is left.`,
    };
  }
  if (variant === 3) {
    /* some of one thing, or paint by the gallon, or cabinets by the foot */
    const [what, price, count] = pick([
        ...Object.entries(SMALL).map(([name, cost]) => [name, cost, R(2, 3)]),
        ["paint", 25, R(2, 3)],
        ["cabinet", 90, R(2, 6)],
      ]),
      cost = price * count;
    if (!gradeThreeProduct(count, price)) return genShop();
    const prompt =
      what === "paint"
        ? `Paint costs $${price} a gallon. The room needs ${count} gallons. How much does the paint cost?`
        : what === "cabinet"
          ? `Cabinets cost $${price} for each foot. The kitchen needs ${count} feet of cabinets. How much do they cost?`
          : `A ${what} costs $${price}. How much do ${count} ${plural(what)} cost?`;
    return {
      kind: "num",
      unit: "dollars",
      answer: cost,
      facts: { t: "times", price, count },
      prompt,
      misc: namedMisc(cost, [
        [price + count, `That adds ${count}. It’s ${count} groups of $${price}: multiply.`],
        [price, `That’s the cost of 1. Find the cost of ${count}.`],
      ]),
      hint: `${count} × ${price}. ${price === 90 ? `That’s ${count} groups of 9 tens.` : `Add $${price} ${count} times.`}`,
      explain: `${count} × ${price} = ${cost}, so it costs $${cost}.`,
    };
  }
  /* two steps: some small things, then one more item */
  const [small, price] = pick(Object.entries(SMALL)),
    count = R(2, 4),
    item = pick(Object.keys(ITEMS)),
    first = count * price,
    cost = first + ITEMS[item];
  if (!friendlySum([first, ITEMS[item]]) || !gradeThreeProduct(count, price)) return genShop();
  return {
    kind: "num",
    unit: "dollars",
    answer: cost,
    facts: { t: "twoStep", price, count, other: ITEMS[item] },
    prompt: `${pick(KIDS)} buys ${count} ${plural(small)} for $${price} each and a ${item} for $${ITEMS[item]}. How much is that in all?`,
    misc: namedMisc(cost, [
      [price + ITEMS[item], `That counts only 1 ${small}. There are ${count}.`],
      [first, `That’s the ${plural(small)}. Add the ${item} too.`],
    ]),
    hint: `First find the cost of ${count} ${plural(small)}: ${count} × ${price}. Then add the ${item}.`,
    explain: `${count} × ${price} = ${first}, and ${first} + ${ITEMS[item]} = ${cost}. It’s $${cost} in all.`,
  };
}

/* ---------- Survey Tent: scaled bar graphs of a survey (Lessons 6–7) ---------- */
/* survey questions: the graph's title and the answers students could pick */
const SURVEYS = [
  { title: "Favorite recess game", rows: ["Tag", "Soccer", "Jump rope", "Swings"] },
  { title: "How we get to school", rows: ["Walk", "Bus", "Car", "Bike"] },
  { title: "Favorite season", rows: ["Winter", "Spring", "Summer", "Fall"] },
  { title: "Favorite lunch", rows: ["Pizza", "Tacos", "Pasta", "Soup"] },
  { title: "Favorite pet", rows: ["Dog", "Cat", "Fish", "Bird"] },
];
const COLORS = ["red", "blue", "green", "yellow"];
/* a survey and its counts: 4 different counts on lines of `scale`, up to `most` lines each */
function surveyOf(scale, most) {
  const survey = pick(SURVEYS);
  let counts;
  do counts = range(4).map(() => R(1, most) * scale);
  while (new Set(counts).size < 4);
  return { survey, rows: survey.rows.map((label, i) => ({ label, n: counts[i], c: COLORS[i] })) };
}
/* the top of a bar graph's scale: room for the tallest bar and one more line, and at least 4 lines */
const topOf = (rows, scale) =>
  Math.max(scale * 4, Math.ceil(Math.max(...rows.map((row) => row.n)) / scale) * scale + scale);
/* the bar graph of a survey; hi: the bars to outline */
const surveyGraph = (survey, rows, scale, opts = {}) =>
  barGraph(rows, { max: topOf(rows, scale), scale, uh: 30, title: survey.title, ...opts });
function genSurvey() {
  const variant = R(0, 4);
  if (variant === 0) {
    /* how many more or fewer chose one answer than another */
    const scale = pick([2, 5, 10]),
      { survey, rows } = surveyOf(scale, 8),
      [a, b] = shuffle([0, 1, 2, 3])
        .slice(0, 2)
        .sort((x, y) => rows[y].n - rows[x].n),
      diff = rows[a].n - rows[b].n,
      askFewer = Math.random() < 0.5;
    return {
      kind: "num",
      unit: "students",
      answer: diff,
      facts: { t: "moreFewer", rows, scale, a, b },
      prompt: askFewer
        ? `How many fewer students chose ${rows[b].label} than ${rows[a].label}?`
        : `How many more students chose ${rows[a].label} than ${rows[b].label}?`,
      fig: (show) => surveyGraph(survey, rows, scale, { hi: show ? [a, b] : -1 }),
      misc: namedMisc(diff, [
        [rows[a].n + rows[b].n, `That adds the two bars. How many ${askFewer ? "fewer" : "more"} means subtract.`],
        [diff / scale, `That counts the spaces between the bars’ tops. Each space is ${scale}.`],
      ]),
      hint: `The lines go up by ${scale}s. Read both bars, then subtract.`,
      explain: `${rows[a].label}: ${rows[a].n}. ${rows[b].label}: ${rows[b].n}. ${rows[a].n} − ${rows[b].n} = ${diff}.`,
    };
  }
  if (variant === 1) {
    /* two steps: how many more chose one answer than two others together */
    const scale = pick([5, 10]),
      { survey, rows } = surveyOf(scale, 8),
      order = [0, 1, 2, 3].sort((x, y) => rows[y].n - rows[x].n),
      [a] = order,
      [b, c] = shuffle(order.slice(1))
        .slice(0, 2)
        .sort((x, y) => x - y),
      both = rows[b].n + rows[c].n,
      diff = rows[a].n - both;
    if (diff <= 0) return genSurvey();
    return {
      kind: "num",
      unit: "students",
      answer: diff,
      facts: { t: "twoStepBar", rows, scale, a, b, c },
      prompt: `How many more students chose ${rows[a].label} than ${rows[b].label} and ${rows[c].label} together?`,
      fig: (show) => surveyGraph(survey, rows, scale, { hi: show ? [a, b, c] : -1 }),
      misc: namedMisc(diff, [
        [
          rows[a].n - rows[b].n,
          `That compares with ${rows[b].label} only. Put ${rows[b].label} and ${rows[c].label} together first.`,
        ],
        [
          rows[a].n - rows[c].n,
          `That compares with ${rows[c].label} only. Put ${rows[b].label} and ${rows[c].label} together first.`,
        ],
        [both, `That’s ${rows[b].label} and ${rows[c].label} together. Now compare it with ${rows[a].label}.`],
      ]),
      hint: `First add ${rows[b].label} and ${rows[c].label}. Then find how many more chose ${rows[a].label}.`,
      explain: `${rows[b].n} + ${rows[c].n} = ${both}, and ${rows[a].n} − ${both} = ${diff}.`,
    };
  }
  if (variant === 2) {
    /* how many students answered: every bar added */
    const scale = pick([2, 5]),
      { survey, rows } = surveyOf(scale, scale === 2 ? 8 : 6),
      counts = rows.map((row) => row.n),
      sum = total(counts);
    return {
      kind: "num",
      unit: "students",
      answer: sum,
      facts: { t: "total", rows, scale },
      prompt: `Each student picked one answer. How many students answered the survey?`,
      fig: () => surveyGraph(survey, rows, scale),
      misc: namedMisc(sum, [
        [sum - counts[3], `That leaves out ${rows[3].label}. Add all 4 bars.`],
        [sum / scale, `That counts spaces. Each space is ${scale} students.`],
      ]),
      hint: `The lines go up by ${scale}s. Read every bar, then add.`,
      explain: `${plus(counts)} = ${sum} students.`,
    };
  }
  if (variant === 3) {
    /* tap the answer that got so many more than another */
    const scale = pick([2, 5, 10]),
      { survey, rows } = surveyOf(scale, 8),
      [a, b] = shuffle([0, 1, 2, 3])
        .slice(0, 2)
        .sort((x, y) => rows[y].n - rows[x].n),
      diff = rows[a].n - rows[b].n,
      why = {};
    /* the answer must be the only bar that many more than b */
    if (rows.filter((row) => row.n === rows[b].n + diff).length !== 1) return genSurvey();
    rows.forEach((row, i) => {
      if (i !== a)
        why[i] =
          i === b
            ? `That’s ${rows[b].label} itself. Find the bar ${diff} more than it.`
            : `${row.label} has ${row.n}. That’s ${row.n > rows[b].n ? `${row.n - rows[b].n} more` : `${rows[b].n - row.n} fewer`} than ${rows[b].label}.`;
    });
    return {
      kind: "tap",
      answer: String(a),
      why,
      facts: { t: "tapMore", rows, scale, base: b, diff },
      prompt: `Tap the bar that shows ${diff} more students than ${rows[b].label}.`,
      fig: () => surveyGraph(survey, rows, scale, { tap: "cand" }),
      hint: `Read the ${rows[b].label} bar, then add ${diff}. Which bar shows that?`,
      explain: `${rows[b].label} has ${rows[b].n}, and ${rows[b].n} + ${diff} = ${rows[a].n}: that’s ${rows[a].label}.`,
    };
  }
  /* choose the scale: the one where every bar ends on a line, without too many lines */
  const best = pick([2, 5, 10]),
    survey = pick(SURVEYS);
  let counts;
  do
    counts =
      best === 10
        ? range(4).map(() => R(1, 9) * 10)
        : best === 5
          ? range(4).map(() => R(1, 10) * 5)
          : range(4).map(() => R(1, 10) * 2);
  while (
    new Set(counts).size < 4 ||
    Math.max(...counts) < (best === 10 ? 60 : best === 5 ? 25 : 10) ||
    (best === 5 && counts.every((n) => n % 10 === 0)) ||
    (best === 2 && counts.every((n) => n % 10 === 0))
  );
  /* offLine(scale): the counts that would end between lines on that scale */
  const most = Math.max(...counts),
    offLine = (scale) => counts.filter((n) => n % scale),
    others = [1, 2, 5, 10].filter((scale) => scale !== best && (scale < best || offLine(scale).length)).slice(-2);
  const why = (scale) =>
    offLine(scale).length
      ? `${andList(offLine(scale))} would end between lines, so ${offLine(scale).length > 1 ? "they’re" : "it’s"} hard to read.`
      : `That needs ${most / scale} lines. The graph would be much too tall.`;
  return {
    ...mcOf([[`A line every ${best}`, null], ...others.map((scale) => [`A line every ${scale}`, why(scale)])]),
    facts: { t: "scale", counts, best },
    prompt: `${survey.title}: ${andList(counts.map((n, i) => `${survey.rows[i]} ${n}`))}. Which scale is best for a bar graph of this survey?`,
    hint: "A good scale makes every bar end on a line, without too many lines to count.",
    explain: `${andList(counts)} are all ${best === 10 ? "tens" : `multiples of ${best}`}. With a line every ${best}, every bar ends on a line, and the tallest needs ${most / best} lines.`,
  };
}

/* ---------- Game Day: multiplication and division (Lessons 8–11) ---------- */
/* a fact's two factors (2 to 10), with the product within 100 */
const factPair = () => [R(2, 10), R(2, 10)];
/* stories for the four operations: what is grouped (one, many), what holds them, and how it's said */
const GROUPINGS = [
  { thing: "stickers", box: "page", boxes: "pages" },
  { thing: "eggs", box: "carton", boxes: "cartons" },
  { thing: "markers", box: "box", boxes: "boxes" },
  { thing: "chairs", box: "row", boxes: "rows" },
  { thing: "apples", box: "bag", boxes: "bags" },
];
function genGameDay() {
  const variant = R(0, 4);
  if (variant === 0) {
    /* which equation matches the picture? equal groups, an array, an area diagram, or a tape diagram */
    const pic = pick(["groups", "array", "area", "tape"]),
      [a, b] = pic === "groups" ? [R(2, 5), R(2, 6)] : pic === "array" ? [R(2, 5), R(2, 7)] : factPair(),
      product = a * b;
    if (product > 100) return genGameDay();
    const choices =
      pic === "tape"
        ? [
            [`${product} ÷ ${a} = ?`, null],
            [`${product} − ${a} = ?`, `That takes ${a} away. The tape cuts ${product} into ${a} equal parts: divide.`],
            [`${product} × ${a} = ?`, `That’s ${a} groups of ${product}. The tape cuts ${product} into equal parts.`],
          ]
        : pic === "area"
          ? [
              [`${a} × ${b} = ?`, null],
              [`${a} + ${b} = ?`, "That adds the side lengths. The area multiplies them."],
              [
                `${a} + ${b} + ${a} + ${b} = ?`,
                "That’s the perimeter, the length around. The area multiplies the sides.",
              ],
            ]
          : [
              [`${a} × ${b} = ?`, null],
              [
                `${a} + ${b} = ?`,
                pic === "groups"
                  ? "That adds the groups and the number in each. Equal groups means multiply."
                  : "That adds the rows and the number in each row. An array means multiply.",
              ],
              [
                `${a} × ${b + 1} = ?`,
                pic === "groups" ? `Count again: each group has ${b}.` : `Count again: each row has ${b}.`,
              ],
            ];
    const fig = {
      groups: () => groupsFig(a, b),
      array: () => arrayFig(a, b),
      area: () => rectFig(b, a, { grid: b <= 10 }),
      tape: (show) =>
        partWhole(
          range(a).map(() => ({ n: 1, show: show ? b : "?" })),
          product,
          `A tape of ${product} cut into ${a} equal parts`,
        ),
    }[pic];
    return {
      ...mcOf(choices),
      facts: { t: "match", pic, a, b },
      prompt: "Which equation matches the picture?",
      fig,
      hint: {
        groups: "How many groups? How many in each group?",
        array: "How many rows? How many in each row?",
        area: "The area of a rectangle: multiply its side lengths.",
        tape: `The tape is ${product} in all, cut into ${a} equal parts. What’s in each part?`,
      }[pic],
      explain: {
        groups: `${a} groups of ${b}: ${a} × ${b} = ${product}.`,
        array: `${a} rows of ${b}: ${a} × ${b} = ${product}.`,
        area: `A rectangle ${a} by ${b}: ${a} × ${b} = ${product} square units.`,
        tape: `${product} cut into ${a} equal parts: ${product} ÷ ${a} = ${b}.`,
      }[pic],
    };
  }
  if (variant === 1) {
    /* a multiplication fact, with a fact you know to start from */
    const [a, b] = factPair(),
      product = a * b;
    if (product > 100 || b < 3) return genGameDay();
    return {
      kind: "num",
      unit: "",
      answer: product,
      facts: { t: "fact", a, b },
      prompt: `${a} × ${b} = ?`,
      misc: namedMisc(product, [
        [a + b, "That adds. × means equal groups: multiply."],
        [a * (b - 1), `That’s ${a} × ${b - 1}. Add one more ${a}.`],
        [a * (b + 1), `That’s ${a} × ${b + 1}. Take one ${a} away.`],
      ]),
      hint: `Start from a fact you know: ${a} × ${b - 1} = ${a * (b - 1)}. Then add one more ${a}.`,
      explain: `${a} × ${b - 1} = ${a * (b - 1)}, and ${a * (b - 1)} + ${a} = ${product}. So ${a} × ${b} = ${product}.`,
    };
  }
  if (variant === 2) {
    /* division as an unknown factor: n × ? = T or T ÷ n = ? */
    const [quotient, divisor] = factPair(),
      product = quotient * divisor;
    if (product > 100) return genGameDay();
    const asDivision = Math.random() < 0.5;
    return {
      kind: "num",
      unit: "",
      answer: quotient,
      facts: { t: "unknown", product, divisor },
      prompt: asDivision ? `${product} ÷ ${divisor} = ?` : `${divisor} × ? = ${product}`,
      misc: namedMisc(quotient, [
        [product - divisor, `That subtracts ${divisor}. Think: ${divisor} times what is ${product}?`],
        [product + divisor, `That adds ${divisor}. Think: ${divisor} times what is ${product}?`],
      ]),
      hint: `Count by ${divisor}s until you reach ${product}. How many ${divisor}s did you count?`,
      explain: `${divisor} × ${quotient} = ${product}, so ${asDivision ? `${product} ÷ ${divisor} = ${quotient}` : `the missing factor is ${quotient}`}.`,
    };
  }
  if (variant === 3) {
    /* a story: the total, how many in each, or how many groups */
    const story = pick(GROUPINGS),
      [groups, each] = [R(2, 9), R(2, 10)],
      product = groups * each,
      ask = pick(["total", "each", "groups"]);
    if (product > 100) return genGameDay();
    const { thing, box, boxes } = story;
    if (ask === "total")
      return {
        kind: "num",
        unit: thing,
        answer: product,
        facts: { t: "story", ask, groups, each },
        prompt: `There are ${groups} ${boxes} with ${each} ${thing} in each ${box}. How many ${thing} are there?`,
        misc: namedMisc(product, [[groups + each, `That adds. ${groups} ${boxes} of ${each}: multiply.`]]),
        hint: `${groups} groups of ${each}. Multiply.`,
        explain: `${groups} × ${each} = ${product} ${thing}.`,
      };
    if (ask === "each")
      return {
        kind: "num",
        unit: thing,
        answer: each,
        facts: { t: "story", ask, groups, each },
        prompt: `${product} ${thing} are put into ${groups} ${boxes}, the same number in each ${box}. How many ${thing} go in each ${box}?`,
        misc: namedMisc(each, [
          [product - groups, `That subtracts ${groups}. Split ${product} into ${groups} equal groups: divide.`],
          [product * groups, `That multiplies. Split ${product} into ${groups} equal groups: divide.`],
        ]),
        hint: `${product} ÷ ${groups} = ?. Think: ${groups} × ? = ${product}.`,
        explain: `${product} ÷ ${groups} = ${each}, because ${groups} × ${each} = ${product}.`,
      };
    return {
      kind: "num",
      unit: boxes,
      answer: groups,
      facts: { t: "story", ask, groups, each },
      prompt: `${product} ${thing} are put into ${boxes} of ${each}. How many ${boxes} are there?`,
      misc: namedMisc(groups, [
        [product - each, `That subtracts ${each}. How many groups of ${each} make ${product}? Divide.`],
        [product * each, `That multiplies. How many groups of ${each} make ${product}? Divide.`],
      ]),
      hint: `${product} ÷ ${each} = ?. Think: ? × ${each} = ${product}.`,
      explain: `${product} ÷ ${each} = ${groups}, because ${groups} × ${each} = ${product}.`,
    };
  }
  /* which multiplication fact helps with a division? */
  const [quotient, divisor] = factPair(),
    product = quotient * divisor;
  if (product > 100 || quotient < 3) return genGameDay();
  return {
    ...mcOf([
      [`${divisor} × ${quotient} = ${product}`, null],
      [
        `${divisor} × ${quotient - 1} = ${divisor * (quotient - 1)}`,
        `That makes ${divisor * (quotient - 1)}, not ${product}. Find the fact with ${divisor} that makes ${product}.`,
      ],
      [`${product} − ${divisor} = ${product - divisor}`, "That’s subtraction. Division goes with multiplication."],
    ]),
    facts: { t: "helper", product, divisor },
    prompt: `Which fact helps you find ${product} ÷ ${divisor}?`,
    hint: `${product} ÷ ${divisor} asks: ${divisor} times what is ${product}?`,
    explain: `${divisor} × ${quotient} = ${product}, so ${product} ÷ ${divisor} = ${quotient}.`,
  };
}

/* ---------- Victory Lap: everything ---------- */
const genBoss = () => pick([genEstimate, genRelay, genHouse, genShop, genSurvey, genGameDay])();

const ZONES = [
  {
    id: "estimate",
    name: "Guessing Booth",
    lessons: "Lesson 1",
    blurb: "Estimate how much of a strip is shaded, and where a point is on a number line.",
    gen: genEstimate,
  },
  {
    id: "relay",
    name: "Fraction Relay",
    lessons: "Lessons 2–3",
    blurb: "Put fractions greater than 1 on the number line, write whole numbers as fractions, and compare.",
    gen: genRelay,
  },
  {
    id: "house",
    name: "Tiny House Lot",
    lessons: "Lesson 4",
    blurb: "Find the area and perimeter of tiny house floors and the rooms inside them.",
    gen: genHouse,
  },
  {
    id: "shop",
    name: "Tiny House Shop",
    lessons: "Lesson 5",
    blurb: "Buy flooring, paint, and furniture, and find what’s left of the budget.",
    gen: genShop,
  },
  {
    id: "survey",
    name: "Survey Tent",
    lessons: "Lessons 6–7",
    blurb: "Read scaled bar graphs of surveys, compare the answers, and choose a scale.",
    gen: genSurvey,
  },
  {
    id: "gameday",
    name: "Game Day",
    lessons: "Lessons 8–11",
    blurb: "Match pictures to equations, and use multiplication facts to multiply and divide.",
    gen: genGameDay,
  },
  {
    id: "boss",
    name: "Victory Lap",
    lessons: "All lessons",
    blurb: "Run the last lap! Every right answer wins a ribbon.",
    gen: genBoss,
  },
];

/* `won` of 10 ribbons on a line (the boss icon shows all of them) */
const ribbons = (won) =>
  '<path d="M4,10H60" stroke="#f3f6fb" stroke-width="2"/>' +
  range(10)
    .map((i) => {
      const x = 6 + (i % 5) * 12,
        y = i < 5 ? 14 : 38,
        fill = i < won ? ["#ffc93c", "#7fe3ff", "#ff8ac4", "#5fe0a8", "#ff9a86"][i % 5] : "rgba(255,255,255,.15)";
      return `<circle cx="${x + 4}" cy="${y + 5}" r="5" fill="${fill}"/><path d="M${x + 1},${y + 9}l-1,9l4,-3l4,3l-1,-9" fill="${fill}"/>`;
    })
    .join("");
/* an icon's line of text, centered at x, y: `size` pixels, in `fill` */
const iconText = (x, y, text, size, fill) =>
  `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="700" text-anchor="middle" font-family="monospace">${text}</text>`;
const ICON = {
  estimate:
    '<rect x="6" y="22" width="52" height="18" fill="rgba(170,205,255,.15)" stroke="#f3f6fb" stroke-width="2"/><rect x="6" y="22" width="34" height="18" fill="#ffc93c"/>' +
    iconText(32, 56, "≈ ?", 13, "#7fe3ff"),
  relay:
    '<path d="M4,40H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M8,32V48M32,32V48M56,32V48M20,36V44M44,36V44" stroke="#f3f6fb" stroke-width="2"/>' +
    '<circle cx="44" cy="40" r="5" fill="#ffc93c"/><path d="M32,30Q38,18 44,30" fill="none" stroke="#7fe3ff" stroke-width="2.5"/>' +
    iconText(44, 16, "3/2", 11, "#ffc93c"),
  house:
    '<path d="M8,30L32,10L56,30" fill="none" stroke="#ffc93c" stroke-width="3"/><rect x="12" y="30" width="40" height="26" fill="rgba(255,201,60,.25)" stroke="#ffc93c" stroke-width="2.5"/>' +
    '<path d="M32,30V56" stroke="#f3f6fb" stroke-width="2"/><rect x="17" y="36" width="10" height="9" fill="#7fe3ff"/>',
  shop:
    '<rect x="10" y="20" width="44" height="34" rx="4" fill="rgba(95,224,168,.25)" stroke="#5fe0a8" stroke-width="2.5"/><path d="M22,20V14H42V20" fill="none" stroke="#5fe0a8" stroke-width="2.5"/>' +
    iconText(32, 43, "$", 18, "#f3f6fb"),
  survey:
    '<path d="M8,8V56H58" fill="none" stroke="#f3f6fb" stroke-width="2"/><rect x="14" y="30" width="9" height="26" fill="#ff7b7b"/><rect x="27" y="16" width="9" height="40" fill="#6fa8ff"/>' +
    '<rect x="40" y="38" width="9" height="18" fill="#5fe0a8"/>',
  gameday:
    '<rect x="8" y="12" width="22" height="22" rx="4" fill="#f3f6fb"/><circle cx="14" cy="18" r="2.5" fill="#0a2340"/><circle cx="24" cy="28" r="2.5" fill="#0a2340"/><circle cx="19" cy="23" r="2.5" fill="#0a2340"/>' +
    iconText(46, 30, "×", 20, "#ffc93c") +
    iconText(32, 54, "÷", 20, "#7fe3ff"),
  boss: ribbons(10),
};
