/* Clockwork Carnival (Grade 2 Unit 6): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Flat and solid shapes, equal parts, and pattern blocks come from shared/shapes.js; clocks, the day bar, and money from
   shared/measure.js; mcOf and miscOf from shared/util.js. Each generator deals one of a few kinds of problem (variant), each
   with a comment saying what it asks. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* the text with its first letter capitalized */
const cap = (text) => text[0].toUpperCase() + text.slice(1);
/* the plural of a shape's name */
const plural = (word) => (word === "rhombus" ? "rhombuses" : word + "s");
/* mc choices that are pictures: build the choices from values ([[value, why], …]), then draw each as "Picture A", "Picture B", … */
function picChoices(list, draw, extra) {
  const problem = mcOf(
    list.map(([v, why]) => [JSON.stringify(v), why]),
    extra,
  );
  problem.choices.forEach((choice, i) => {
    choice.label = draw(JSON.parse(choice.label), `Picture ${"ABCD"[i]}`);
  });
  return problem;
}

/* ---------- Shape Tent: shapes (Lessons 1–4) ---------- */
function genShapes() {
  const variant = R(0, 4);
  if (variant === 0) {
    /* tap the shape with this many sides, among two with other numbers of sides */
    const sides = R(3, 6),
      others = shuffle([3, 4, 5, 6].filter((m) => m !== sides)).slice(0, 2),
      shapes = shuffle([sides, ...others]).map((m) => pick(SHAPES[m])),
      at = shapes.findIndex((shape) => shape.length === sides),
      name = SHAPE_NAME[sides];
    return {
      kind: "tap",
      answer: String(at),
      prompt: `Tap the <b>${name}</b>.`,
      why: Object.fromEntries(
        shapes
          .map((shape, i) => [String(i), `That shape has ${shape.length} sides. A ${name} has ${sides}.`])
          .filter(([i]) => i !== String(at)),
      ),
      fig: (show) =>
        shapeRow(
          shapes.map((shape) => [shape, { nums: show }]),
          { tap: "Shape", label: "Shape" },
        ),
      hint: `A ${name} has ${sides} sides. Count the sides of each shape.`,
      explain: `A ${name} has ${sides} sides and ${sides} corners. Shape ${at + 1} has ${sides} sides.`,
    };
  }
  if (variant === 1) {
    /* name the shape (not the first, most regular, one of its kind); wrong names have one side more or fewer, then any */
    const sides = R(3, 6),
      shape = pick(SHAPES[sides].slice(1)),
      wrongSides = shuffle(
        [sides - 1, sides + 1]
          .filter((m) => m >= 3 && m <= 6)
          .concat([3, 4, 5, 6].filter((m) => Math.abs(m - sides) > 1)),
      ).slice(0, 2);
    return {
      ...mcOf([
        [cap(SHAPE_NAME[sides]), null],
        ...wrongSides.map((m) => [cap(SHAPE_NAME[m]), `A ${SHAPE_NAME[m]} has ${m} sides. Count the sides again.`]),
      ]),
      prompt: "What is this shape called?",
      fig: (show) => shapeFig(shape, { s: 200, nums: show }),
      hint: "Count the sides: 3 is a triangle, 4 is a quadrilateral, 5 is a pentagon, and 6 is a hexagon.",
      explain: `It has ${sides} sides and ${sides} corners, so it’s a ${SHAPE_NAME[sides]}.`,
    };
  }
  if (variant === 2) {
    /* count the sides or corners */
    const sides = R(4, 6),
      shape = pick(SHAPES[sides]),
      what = pick(["sides", "corners"]);
    return {
      kind: "num",
      unit: what,
      answer: sides,
      prompt: `How many ${what} does this shape have?`,
      fig: (show) => shapeFig(shape, { s: 200, nums: show }),
      misc: [
        [sides - 1, "Count again. Start at one corner and go all the way around."],
        [sides + 1, "Count again. Don’t count your first one twice."],
      ],
      hint: "Put your finger on one corner. Count each side as you go all the way around.",
      explain: `It has ${sides} sides and ${sides} corners: it’s a ${SHAPE_NAME[sides]}.`,
    };
  }
  if (variant === 3) {
    /* side lengths: all the same, or a square (the same lengths and square corners) */
    const side = R(2, 5),
      rectW = side + R(1, 3),
      rectH = R(2, side),
      trapTop = R(2, 3),
      square = Math.random() < 0.5,
      same = square ? "rhombus" : pick(["square", "rhombus"]);
    /* each shape's side lengths, in cm */
    const lengths = {
      square: [side, side, side, side],
      rhombus: [side, side, side, side],
      rectangle: [rectW, rectH, rectW, rectH],
      trapezoid: [trapTop, trapTop + 1, trapTop + 3, trapTop + 1],
    };
    const kinds = square ? ["square", "rectangle", "rhombus"] : [same, "rectangle", "trapezoid"],
      order = shuffle(kinds),
      answer = square ? "square" : same;
    /* why each wrong shape is wrong; {} is its letter */
    const why = {
      rectangle: square
        ? "Shape {} has square corners, but its sides are not all the same length."
        : "Shape {} has sides of two lengths.",
      rhombus: "Shape {} has sides that are all the same length, but its corners are not square corners.",
      trapezoid: "Shape {} has sides of different lengths.",
    };
    const letter = (i) => "ABC"[i];
    return {
      kind: "mc",
      choices: order.map((kind, i) => ({ id: "abc"[i], label: letter(i) })),
      answer: "abc"[order.indexOf(answer)],
      why: Object.fromEntries(
        order.map((kind, i) => ["abc"[i], (why[kind] || "").replace("{}", letter(i))]).filter(([, message]) => message),
      ),
      prompt: square
        ? "Which shape is a <b>square</b>?"
        : "Which shape has <b>4 sides that are all the same length</b>?",
      fig: () =>
        shapeRow(
          order.map((kind) => [QUADS[kind], { lens: lengths[kind].map((v) => `${v} cm`), sq: true }]),
          { letters: true, label: "Shape" },
        ),
      hint: square
        ? "A square has 4 sides that are all the same length and 4 square corners."
        : "Read the side lengths of each shape. Are all 4 the same?",
      explain: square
        ? `Shape ${letter(order.indexOf("square"))} has 4 sides of ${side} cm and 4 square corners, so it’s a square.`
        : `Every side of shape ${letter(order.indexOf(same))} is ${side} cm.`,
    };
  }
  /* solid shapes: count the faces (seen: how many the drawing shows from the front) */
  const kind = pick(["cube", "cube", "box", "pyramid", "prism"]),
    solid = SOLIDS[kind],
    seen = (solidFig(kind).match(/class="sf /g) || []).length,
    faces = solid.faces.reduce((total, [n]) => total + n, 0);
  /* solids with faces of two kinds: the kind to count, how many, and the mistakes */
  const TYPE = {
    pyramid: [
      "triangle",
      4,
      [
        [2, "You can see 2 triangles. There are 2 more on the back."],
        [5, "That’s all the faces. How many are triangles?"],
      ],
    ],
    prism: [
      "rectangle",
      3,
      [
        [1, "You can see 1 rectangle. There are more on the bottom and the left."],
        [5, "That’s all the faces. How many are rectangles?"],
      ],
    ],
  };
  const faceList = solid.faces.map(([n, shape]) => `${n} ${n > 1 ? plural(shape) : shape}`).join(" and ");
  if (TYPE[kind] && Math.random() < 0.5) {
    /* count the faces of one kind */
    const [shape, count, misc] = TYPE[kind];
    return {
      kind: "num",
      unit: `${plural(shape)}`,
      answer: count,
      prompt: `How many faces of this ${solid.name} are <b>${plural(shape)}</b>?`,
      fig: (show) => solidFig(kind, { back: show, s: 120 }),
      misc,
      hint: "The dashed lines show the edges on the back. Count the faces on the back too.",
      explain: `A ${solid.name} has ${faces} faces: ${faceList}.`,
    };
  }
  return {
    kind: "num",
    unit: "faces",
    answer: faces,
    prompt: `How many faces does this ${solid.name} have?`,
    fig: (show) => solidFig(kind, { back: show, s: 120 }),
    misc: miscOf(faces, [
      [seen, "That’s how many faces you can see. Some faces are on the back and the bottom."],
      ...(kind === "cube" || kind === "box"
        ? [
            [8, "8 is the number of corners. Count the flat faces."],
            [12, "12 is the number of edges. Count the flat faces."],
          ]
        : []),
    ]),
    hint: "Count the faces you can see. The dashed lines show edges on the back, so count the faces there too.",
    explain: `A ${solid.name} has ${faces} faces: ${faceList}.`,
  };
}

/* ---------- Pie Stand: halves, thirds, and fourths (Lessons 6–9) ---------- */
const FOOD = {
  circle: ["pizza", "pie", "pancake", "tortilla"],
  square: ["sandwich", "waffle", "slice of bread", "cracker"],
  rect: ["granola bar", "brownie", "sheet of paper", "cake"],
};
/* an equal way to cut this shape into n parts */
const cutOf = (shape, n) =>
  shape === "circle"
    ? "v"
    : pick(
        shape === "square"
          ? n === 2
            ? ["v", "h", "diag"]
            : n === 4
              ? ["v", "h", "grid", "diag"]
              : ["v", "h"]
          : ["v", "h"].concat(n === 4 ? ["grid"] : []),
      );
function genParts() {
  const variant = R(0, 4),
    shape = pick(["circle", "circle", "square", "rect"]),
    food = pick(FOOD[shape]),
    parts = R(2, 4),
    how = cutOf(shape, parts),
    name = pick(KIDS);
  if (variant === 0) {
    /* tap the one cut into these parts: the others are cut into unequal pieces, or into a different number */
    const otherParts = pick([2, 3, 4].filter((v) => v !== parts)),
      pictures = shuffle([
        { n: parts, how, ok: 1 },
        { n: parts, how: "uneq" },
        { n: otherParts, how: cutOf(shape, otherParts) },
      ]),
      at = pictures.findIndex((picture) => picture.ok);
    return {
      kind: "tap",
      answer: String(at),
      prompt: `Tap the ${food} cut into <b>${PART[parts][1]}</b>.`,
      why: Object.fromEntries(
        pictures
          .map((picture, i) => [
            String(i),
            picture.how === "uneq"
              ? `That one has ${parts} pieces, but they are not the same size.`
              : `That one has ${picture.n} equal pieces: ${PART[picture.n][1]}.`,
          ])
          .filter(([i]) => i !== String(at)),
      ),
      fig: () => shareRow(shape, pictures, { tap: "Picture", label: "Picture" }),
      hint: `${cap(PART[parts][1])} means ${parts} pieces that are all the same size.`,
      explain: `Picture ${at + 1} has ${parts} equal pieces, so each piece is 1 ${PART[parts][0]}.`,
    };
  }
  if (variant === 1) {
    /* what part is shaded. Mistakes: naming the part that isn't shaded, or miscounting the pieces (never "3 halves") */
    const shaded = R(1, parts - 1),
      wrong = [
        ...(shaded !== parts - shaded
          ? [[partName(parts, parts - shaded), "That’s the part that is not shaded."]]
          : []),
        ...[2, 3, 4]
          .filter((v) => v !== parts && v >= shaded)
          .map((v) => [partName(v, shaded), `Count all the pieces. There are ${parts}, not ${v}.`]),
      ].slice(0, 2);
    return {
      ...mcOf([[partName(parts, shaded), null], ...wrong]),
      prompt: `What part of the ${food} is shaded?`,
      fig: () =>
        shareFig(shape, parts, how, {
          shade: range(shaded),
          s: 150,
          label: `A ${food} cut into ${parts} equal pieces, ${shaded} shaded`,
        }),
      hint: `Count all the equal pieces: that tells if they are halves, thirds, or fourths. Then count the shaded ones.`,
      explain: `There are ${parts} equal pieces, so each is 1 ${PART[parts][0]}. ${shaded} ${shaded > 1 ? "are" : "is"} shaded: ${partName(parts, shaded)}.`,
    };
  }
  if (variant === 2) {
    /* how many pieces, or how many of them make the whole */
    const whole = Math.random() < 0.5;
    return {
      kind: "num",
      unit: whole ? PART[parts][1] : "pieces",
      answer: parts,
      prompt: whole
        ? `${name} cuts a ${food} into ${PART[parts][1]}. How many ${PART[parts][1]} make the whole ${food}?`
        : `${name} cuts a ${food} into ${PART[parts][1]}. How many equal pieces are there?`,
      fig: (show) =>
        shareFig(shape, show ? parts : 1, show ? how : "v", {
          s: 150,
          label: show ? `A ${food} cut into ${parts} equal pieces` : `A whole ${food}`,
        }),
      misc: [2, 3, 4]
        .filter((v) => v !== parts)
        .map((v) => [v, `${cap(PART[v][1])} would be ${v} pieces. ${cap(PART[parts][1])} are ${parts}.`]),
      hint: "Halves are 2 equal pieces, thirds are 3, and fourths are 4.",
      explain: `${cap(PART[parts][1])} are ${parts} equal pieces. ${partName(parts, parts)} make the whole ${food}.`,
    };
  }
  if (variant === 3) {
    /* whose pieces are bigger: fewer pieces of the same whole */
    const [nameParts, otherParts] = shuffle([2, 3, 4]).slice(0, 2),
      other = pick(KIDS.filter((kid) => kid !== name)),
      bigger = nameParts < otherParts ? name : other,
      smaller = nameParts < otherParts ? other : name;
    return {
      ...mcOf([
        [`${bigger}’s`, null],
        [`${smaller}’s`, `${smaller} cut more pieces, so each piece is smaller.`],
        [
          "They’re the same size",
          "Both start the same size, but one is cut into more pieces. Look at 1 piece of each.",
        ],
      ]),
      prompt: `${name} and ${other} each have a ${food}, the same size. ${name} cuts it into <b>${PART[nameParts][1]}</b>. ${other} cuts it into <b>${PART[otherParts][1]}</b>. Whose pieces are bigger?`,
      fig: (show) =>
        shareRow(
          shape,
          [
            { n: nameParts, how: "v", shade: show ? [0] : [] },
            { n: otherParts, how: "v", shade: show ? [0] : [] },
          ],
          { label: cap(food) },
        ),
      hint: "More pieces means smaller pieces. Look at 1 piece of each.",
      explain: `${cap(PART[Math.min(nameParts, otherParts)][1])} are bigger than ${PART[Math.max(nameParts, otherParts)][1]}: fewer pieces means bigger pieces. ${bigger}’s pieces are bigger.`,
    };
  }
  /* pattern blocks: how many small blocks fill a big one */
  const [big, small] = pick([
      ["hexagon", "triangle"],
      ["hexagon", "triangle"],
      ["hexagon", "rhombus"],
      ["hexagon", "trapezoid"],
      ["trapezoid", "triangle"],
      ["rhombus", "triangle"],
    ]),
    fill = PB[big][small];
  return {
    kind: "num",
    unit: plural(small),
    answer: fill,
    prompt: `How many ${plural(small)} fill this ${big}?`,
    fig: (show) => pbFig(big, small, { show: show ? true : 0, s: 80 }),
    misc: miscOf(
      fill,
      [1, 2, 3, 4, 6]
        .filter((v) => v !== fill)
        .map((v) => [
          v,
          v < fill
            ? `That’s not enough to fill the ${big}. Picture more ${plural(small)} inside it.`
            : `That’s too many. They won’t all fit inside the ${big}.`,
        ]),
    ),
    hint: `One ${small} is drawn inside the dashed ${big}. How many would fill it with no gaps?`,
    explain:
      `${fill} ${plural(small)} fill the ${big}.` +
      (big === "hexagon" ? " A hexagon is 6 triangles, 3 rhombuses, or 2 trapezoids." : ""),
  };
}

/* ---------- Clock Tower: time (Lessons 11–13) ---------- */
/* the hour after and the hour before, on a 12-hour clock */
const next = (hour) => (hour % 12) + 1,
  prev = (hour) => ((hour + 10) % 12) + 1;
/* times of day: what, when (hours and minutes), and whether it's a.m. */
const DAY = [
  [
    "eat breakfast",
    [
      [7, 0],
      [7, 30],
      [8, 0],
    ],
    1,
  ],
  [
    "get to school",
    [
      [8, 0],
      [8, 15],
      [8, 30],
    ],
    1,
  ],
  [
    "play at recess",
    [
      [10, 0],
      [10, 30],
    ],
    1,
  ],
  [
    "watch the sun come up",
    [
      [6, 0],
      [6, 30],
    ],
    1,
  ],
  [
    "be sound asleep",
    [
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    1,
  ],
  [
    "go home from school",
    [
      [3, 0],
      [3, 15],
      [3, 30],
    ],
    0,
  ],
  [
    "go to soccer practice",
    [
      [4, 0],
      [4, 30],
      [5, 0],
    ],
    0,
  ],
  [
    "eat dinner",
    [
      [5, 30],
      [6, 0],
      [6, 30],
    ],
    0,
  ],
  [
    "go to bed",
    [
      [7, 30],
      [8, 0],
      [8, 30],
    ],
    0,
  ],
];
/* what part of the day an hour is, a.m. or p.m. */
const when = (hour, am) =>
  am
    ? hour < 5
      ? "in the middle of the night"
      : "in the morning"
    : hour < 5
      ? "in the afternoon"
      : hour < 8
        ? "in the evening"
        : "at night";
function genTime() {
  /* the time on the clock: hour:minute, to 5 minutes */
  const variant = R(0, 4),
    hour = R(1, 12),
    minute = 5 * R(0, 11),
    name = pick(KIDS);
  /* common mistakes: the hands switched, the next hour once the hour hand is past halfway, the number the long hand points to */
  const mistakes = [
    [[minute / 5 || 12, (hour * 5) % 60], "The short hand shows the hour. The long hand shows the minutes."],
    minute >= 30
      ? [
          [next(hour), minute],
          `The hour hand is between ${hour} and ${next(hour)}. It hasn’t gotten to ${next(hour)} yet, so the hour is still ${hour}.`,
        ]
      : [
          [prev(hour), minute],
          minute
            ? `The hour hand is a little past ${hour}, so the hour is ${hour}.`
            : `The short hand points to ${hour}.`,
        ],
    minute
      ? [
          [hour, minute / 5],
          `The long hand points to the ${minute / 5}. Count by 5s: ${minute / 5} fives is ${minute} minutes.`,
        ]
      : [[hour, 30], "The long hand points straight up to 12: that’s 0 minutes."],
  ];
  /* two of them that aren't the right time, and aren't the same as each other */
  const wrongs = mistakes
    .filter(
      ([[h, m]], i) => !(h === hour && m === minute) && mistakes.findIndex(([[h2, m2]]) => h2 === h && m2 === m) === i,
    )
    .slice(0, 2);
  const count = minute
    ? `The long hand points to the ${minute / 5}: count by 5s to ${minute}.`
    : "The long hand points to 12: o’clock.";
  const hourSay = minute
    ? `The short hand is between ${hour} and ${next(hour)}, so the hour is ${hour}.`
    : `The short hand points to ${hour}.`;
  /* read the clock */
  if (variant === 0)
    return {
      ...mcOf([[hm(hour, minute), null], ...wrongs.map(([[h, m], why]) => [hm(h, m), why])]),
      prompt: "What time does the clock show?",
      fig: (show) => clockFig(hour, minute, { fives: show }),
      hint: "The short hand shows the hour. Count by 5s to the long hand for the minutes.",
      explain: `${hourSay} ${count} It’s ${hm(hour, minute)}.`,
    };
  /* pick the clock that shows the time */
  if (variant === 1)
    return {
      ...picChoices([[[hour, minute], null], ...wrongs.map(([time, why]) => [time, why])], ([h, m], label) =>
        clockFig(h, m, { r: 64, label }),
      ),
      prompt: `Which clock shows <b>${hm(hour, minute)}</b>?`,
      hint: `The short hour hand should be at ${hour}${minute ? ` or a bit past it` : ""}. The long minute hand should point to ${minute / 5 || 12}.`,
      explain: `${hourSay} ${count}`,
    };
  if (variant === 2) {
    /* quarter past, half past, and quarter till: another way to say the time, or the time for the words */
    const quarter = pick([15, 30, 45]),
      spoken =
        quarter === 15 ? `quarter past ${hour}` : quarter === 30 ? `half past ${hour}` : `quarter till ${next(hour)}`,
      shade = quarter === 45 ? [45, 60] : [0, quarter];
    const wrong =
      quarter === 15
        ? [
            [
              `quarter till ${hour}`,
              `Quarter till is 15 minutes <b>before</b> the hour. ${hm(hour, 15)} is 15 minutes after ${hour}.`,
            ],
            [`half past ${hour}`, "Half past is 30 minutes. 15 minutes is a quarter of the way around."],
          ]
        : quarter === 30
          ? [
              [
                `half past ${next(hour)}`,
                `The hour hand is between ${hour} and ${next(hour)}. It’s still ${hour}-something.`,
              ],
              [`quarter past ${hour}`, "Quarter past is 15 minutes. 30 minutes is halfway around."],
            ]
          : [
              [
                `quarter till ${hour}`,
                `Quarter till ${hour} is 15 minutes before ${hour} o’clock. ${hm(hour, 45)} is 15 minutes before ${next(hour)} o’clock.`,
              ],
              [`quarter past ${hour}`, "Quarter past is 15 minutes. 45 minutes is three quarters of the way around."],
            ];
    if (Math.random() < 0.5)
      return {
        ...mcOf([[cap(spoken), null], ...wrong.map(([words, why]) => [cap(words), why])]),
        prompt: `What is another way to say <b>${hm(hour, quarter)}</b>?`,
        fig: (show) => clockFig(hour, quarter, { shade: show ? shade : null }),
        hint: "15 minutes is a quarter of the way around the clock. 30 minutes is halfway.",
        explain: `${hm(hour, quarter)} is ${spoken}.`,
      };
    /* the right time first, then two mix-ups, with why each is wrong */
    const times = {
      15: [
        [hour, 15],
        [prev(hour), 45],
        [hour, 45],
      ],
      30: [
        [hour, 30],
        [next(hour), 30],
        [hour, 15],
      ],
      45: [
        [hour, 45],
        [next(hour), 45],
        [next(hour), 15],
      ],
    }[quarter];
    const whyNot = [
      null,
      quarter === 30
        ? `Half past ${hour} is 30 minutes after ${hour} o’clock.`
        : quarter === 15
          ? `${hm(prev(hour), 45)} is quarter till ${hour}. Quarter past is after ${hour} o’clock.`
          : `Quarter till ${next(hour)} is before ${next(hour)} o’clock, so the hour is still ${hour}.`,
      quarter === 30
        ? "Half past means 30 minutes, halfway around."
        : quarter === 15
          ? "Quarter past means 15 minutes after the hour."
          : `${hm(next(hour), 15)} is quarter <b>past</b> ${next(hour)}.`,
    ];
    return {
      ...mcOf(times.map(([h, m], i) => [hm(h, m), whyNot[i]])),
      prompt: `It’s <b>${spoken}</b>. What time is it?`,
      fig: (show) => clockFig(hour, quarter, { shade: show ? shade : null }),
      hint: "A quarter of an hour is 15 minutes. Half an hour is 30 minutes.",
      explain: `${cap(spoken)} is ${hm(hour, quarter)}.`,
    };
  }
  if (variant === 3) {
    /* minutes after the hour, from the number the long hand points to */
    const number = R(1, 11);
    return {
      kind: "num",
      unit: "minutes",
      answer: 5 * number,
      prompt: `The long hand points to the <b>${number}</b>. How many minutes after ${hour} o’clock is it?`,
      fig: (show) => clockFig(hour, 5 * number, { fives: show }),
      misc: miscOf(5 * number, [
        [number, "Each number on the clock is 5 minutes. Count by 5s."],
        [5 * number - 5, `Count by 5s all the way to the ${number}.`],
        [5 * number + 5, `Count by 5s, and stop at the ${number}.`],
        [10 * number, "Count by 5s, not 10s."],
      ]),
      hint: `Count by 5s from the 12 to the ${number}: 5, 10, 15, …`,
      explain: `${range(number)
        .map((i) => 5 * (i + 1))
        .join(", ")}. The long hand at ${number} means ${5 * number} minutes: ${hm(hour, 5 * number)}.`,
    };
  }
  /* a.m. or p.m.: which time makes sense? The wrong ones are the same time the other half of the day, and another
     activity's time that's different */
  const [what, times, am] = pick(DAY),
    [actHour, actMinute] = pick(times),
    suffix = (isAm) => (isAm ? "a.m." : "p.m.");
  let otherHour, otherMinute;
  do [otherHour, otherMinute] = pick(pick(DAY.filter((d) => d[2] !== am))[1]);
  while (otherHour === actHour && otherMinute === actMinute);
  return {
    ...mcOf([
      [`${hm(actHour, actMinute)} ${suffix(am)}`, null],
      [
        `${hm(actHour, actMinute)} ${suffix(!am)}`,
        `${hm(actHour, actMinute)} ${suffix(!am)} is ${when(actHour, !am)}.`,
      ],
      [
        `${hm(otherHour, otherMinute)} ${suffix(!am)}`,
        `${hm(otherHour, otherMinute)} ${suffix(!am)} is ${when(otherHour, !am)}.`,
      ],
    ]),
    prompt: `Which time makes sense for ${name} to <b>${what}</b>?`,
    fig: (show) => dayBar(show ? (am ? actHour % 12 : (actHour % 12) + 12) + actMinute / 60 : null),
    hint: "a.m. is from midnight to noon: night and morning. p.m. is from noon to midnight: afternoon, evening, and night.",
    explain: `People ${what.replace(/^be /, "are ")} ${when(actHour, am)}. ${hm(actHour, actMinute)} ${suffix(am)} is ${when(actHour, am)}.`,
  };
}

/* ---------- Coin Toss: coins (Lessons 15–17) ---------- */
/* coins from counts {B, q, d, n, p}, most valuable first */
const coinList = (counts) => ["B", "q", "d", "n", "p"].flatMap((coin) => Array(counts[coin] || 0).fill(coin));
/* counting the coins up: "25, 35, 40" */
const countUp = (coins) => {
  let total = 0;
  return coins.map((coin) => (total += COINS[coin].v)).join(", ");
};
/* "1 dime", "3 nickels" */
const coinSay = (n, coin) => `${n} ${n === 1 ? COINS[coin].name : COINS[coin].pl}`;
/* "2 quarters, 1 dime" from counts */
const coinsSay = (counts) =>
  ["q", "d", "n", "p"]
    .filter((coin) => counts[coin])
    .map((coin) => coinSay(counts[coin], coin))
    .join(", ");
/* coins that make `cents` (a multiple of 5 from 5 to 95): quarters, then dimes, then a nickel */
const makeCents = (cents) => {
  const q = R(0, Math.floor(cents / 25));
  let rest = cents - 25 * q;
  const d = R(Math.max(0, Math.floor(rest / 10) - 1), Math.floor(rest / 10));
  rest -= 10 * d;
  return { q, d, n: rest / 5 };
};
function genCoins() {
  const variant = R(0, 4);
  if (variant < 2) {
    /* count the coins: dimes, nickels, and pennies (variant 0), or with quarters too (variant 1); up to a dollar, two kinds or more */
    let counts;
    do counts = variant ? { q: R(1, 3), d: R(0, 2), n: R(0, 1), p: R(0, 4) } : { d: R(1, 5), n: R(0, 3), p: R(0, 5) };
    while (centsOf(coinList(counts)) > 100 || Object.values(counts).filter((v) => v).length < 2);
    /* ifWorth(coin, v): the total if that kind of coin were counted as v¢ each */
    const coins = coinList(counts),
      cents = centsOf(coins),
      ifWorth = (coin, v) => cents - (counts[coin] || 0) * (COINS[coin].v - v);
    return {
      kind: "num",
      unit: "cents",
      answer: cents,
      prompt: "How much money is this?",
      fig: (show) => moneyFig(coins, { vals: show }),
      misc: miscOf(cents, [
        [coins.length, "That’s the number of coins. Each kind of coin is worth a different amount."],
        ...(counts.q ? [[ifWorth("q", 10), "A quarter is 25¢, not 10¢."]] : []),
        ...(counts.d ? [[ifWorth("d", 5), "A dime is 10¢. The nickel is the one worth 5¢."]] : []),
        ...(counts.n
          ? [
              [ifWorth("n", 1), "A nickel is 5¢, not 1¢."],
              [ifWorth("n", 10), "A nickel is 5¢. The dime is the one worth 10¢."],
            ]
          : []),
      ]),
      hint:
        (counts.q ? "Count the quarters by 25s. " : "") + "Count dimes by 10s, then nickels by 5s, then pennies by 1s.",
      explain: `Start with the coins worth the most: ${countUp(coins)}. That’s ${cents}¢.`,
    };
  }
  if (variant === 2) {
    if (Math.random() < 0.35) {
      /* which coin is worth this much */
      const answer = pick(["p", "n", "d", "q"]),
        wrong = shuffle(["p", "n", "d", "q"])
          .filter((coin) => coin !== answer)
          .slice(0, 2);
      return {
        ...picChoices(
          [
            [answer, null],
            ...wrong.map((coin) => [coin, `That’s a ${COINS[coin].name}. It’s worth ${COINS[coin].v}¢.`]),
          ],
          (coin, label) => moneyFig([coin], { label }),
        ),
        prompt: `Which coin is worth <b>${COINS[answer].v} ${COINS[answer].v > 1 ? "cents" : "cent"}</b>?`,
        hint: "A penny is 1¢, a nickel is 5¢, a dime is 10¢, and a quarter is 25¢.",
        explain: `A ${COINS[answer].name} is worth ${COINS[answer].v}¢.`,
      };
    }
    /* how many of a small coin make a bigger coin or a dollar */
    const [small, big] = pick([
        ["p", "n"],
        ["p", "d"],
        ["n", "d"],
        ["n", "q"],
        ["d", "B"],
        ["q", "B"],
        ["n", "B"],
      ]),
      count = COINS[big].v / COINS[small].v,
      smallCoin = COINS[small],
      bigCoin = COINS[big];
    return {
      kind: "num",
      unit: smallCoin.pl,
      answer: count,
      prompt: `How many <b>${smallCoin.pl}</b> make ${big === "B" ? "<b>1 dollar</b>" : `a <b>${bigCoin.name}</b>`}?`,
      fig: (show) => moneyFig(show ? [big, ...Array(count).fill(small)] : [big, small], { vals: true }),
      /* a penny's count is its cents, and 5 nickels make a quarter, so those mistakes give the answer there */
      misc: miscOf(count, [
        ...(small !== "p"
          ? [
              [
                bigCoin.v,
                `${big === "B" ? "A dollar" : `A ${bigCoin.name}`} is ${bigCoin.v}¢. How many ${smallCoin.pl} is that?`,
              ],
            ]
          : []),
        ...(smallCoin.v !== count
          ? [[smallCoin.v, `A ${smallCoin.name} is ${smallCoin.v}¢. How many make ${bigCoin.v}¢?`]]
          : []),
      ]),
      hint: `${big === "B" ? "A dollar" : `A ${bigCoin.name}`} is ${bigCoin.v}¢. Count by ${smallCoin.v}s to ${bigCoin.v}.`,
      explain: `Count by ${smallCoin.v}s: ${range(Math.min(count, 5))
        .map((i) => smallCoin.v * (i + 1))
        .join(", ")}${count > 5 ? ", …" : ""} ${bigCoin.v}. That’s ${count} ${smallCoin.pl}.`,
    };
  }
  if (variant === 3) {
    /* how much more makes a dollar; not 50¢, where what's here is also what's needed */
    let cents;
    do cents = 5 * R(6, 19);
    while (cents === 50);
    const coins = coinList(makeCents(cents));
    return {
      kind: "num",
      unit: "cents",
      answer: 100 - cents,
      prompt: "How much more money do you need to make <b>1 dollar</b>?",
      fig: (show) => moneyFig(coins, { vals: show }),
      misc: miscOf(100 - cents, [
        [cents, "That’s how much is here. How much more to get to 100¢?"],
        [100, "A dollar is 100¢, but some of it is here already."],
        [100 - cents + 10, `Count the coins again: ${countUp(coins)}.`],
        [100 - cents - 10, `Count the coins again: ${countUp(coins)}.`],
      ]),
      hint: "A dollar is 100¢. Count the coins, then count on to 100.",
      explain: `The coins make ${cents}¢ (${countUp(coins)}). ${cents} + ${100 - cents} = 100, so you need ${100 - cents}¢ more.`,
    };
  }
  /* which coins make exactly a dollar? The wrong ones change a coin or two, to a little short or a little over */
  const q = R(1, 3),
    rest = 100 - 25 * q,
    d = R(Math.max(0, Math.ceil((rest - 20) / 10)), Math.floor(rest / 10)),
    right = { q, d, n: (rest - 10 * d) / 5 };
  const tweak = [
    [{ ...right, d: right.d - 1 }, "short"],
    [{ ...right, n: right.n + 1 }, "over"],
    [{ ...right, q: right.q - 1, d: right.d + 2 }, "short"],
    [{ ...right, d: right.d + 1 }, "over"],
  ].filter(([counts]) => counts.d >= 0 && counts.q >= 0 && counts.n <= 5 && Object.values(counts).some((v) => v));
  const wrong = shuffle(tweak)
    .slice(0, 2)
    .map(([counts]) => {
      const cents = centsOf(coinList(counts));
      return [
        coinsSay(counts),
        `That’s ${cents}¢: ${cents < 100 ? `${100 - cents}¢ less than` : `${cents - 100}¢ more than`} a dollar.`,
      ];
    });
  return {
    ...mcOf([[coinsSay(right), null], ...wrong]),
    stack: true,
    prompt: "Which coins make exactly <b>1 dollar</b>?",
    fig: (show) => moneyFig(show ? coinList(right) : ["B"], { vals: true }),
    hint: "A dollar is 100¢. Count each group of coins: quarters by 25s, dimes by 10s, nickels by 5s.",
    explain: `${coinsSay(right)}: ${countUp(coinList(right))}. That’s 100¢, 1 dollar.`,
  };
}

/* ---------- Prize Shop: money problems (Lessons 18–19) ---------- */
/* prizes and their prices in cents: [name, lowest, highest] */
const PRIZE = [
  ["sticker", 10, 25],
  ["pencil", 25, 40],
  ["eraser", 15, 30],
  ["bouncy ball", 40, 60],
  ["whistle", 30, 50],
  ["bookmark", 20, 35],
  ["yo-yo", 50, 75],
  ["toy car", 60, 85],
];
/* bigger things in whole dollars */
const BIG = [
  ["book", 4, 9],
  ["kite", 5, 10],
  ["puzzle", 3, 8],
  ["T-shirt", 8, 12],
  ["stuffed animal", 6, 12],
];
/* a prize's price: a multiple of 5 from its lowest to its highest */
const priceOf = ([, lowest, highest]) => 5 * R(lowest / 5, highest / 5);
/* "a" or "an" for a word */
const an = (word) => (/^[aeiou]/.test(word) ? "an" : "a");
/* price tags: list [[name, price text], …] */
const tags = (list) =>
  svgWrap(
    list.length * 170,
    90,
    list
      .map(([name, price], i) => {
        const x = i * 170 + 8;
        return `<path class="tag" d="M${x + 22},6H${x + 156}V78H${x + 22}L${x},42Z"/><circle class="tagh" cx="${x + 18}" cy="42" r="5"/><text class="lbl s" x="${x + 90}" y="28">${name}</text><text class="lbl gd" x="${x + 90}" y="56">${price}</text>`;
      })
      .join(""),
    "Price tags: " + list.map(([name, price]) => `${name}, ${price}`).join("; "),
  );
function genShop() {
  const variant = R(0, 4),
    name = pick(KIDS);
  if (variant === 0) {
    /* count dollar bills and coins; the mistakes count a bill as 1¢, or every coin as a dollar */
    const bills = R(1, 4),
      coinCounts = makeCents(5 * R(1, 19)),
      money = coinList({ B: bills, ...coinCounts }),
      total = centsOf(money),
      cents = total % 100,
      coins = money.length - bills;
    return {
      ...mcOf([
        [amt(total), null],
        [`${bills + cents}¢`, "A dollar bill is 100¢, not 1¢."],
        [`$${bills + coins}`, "The coins are cents, not dollars. Only the bills are dollars."],
      ]),
      prompt: "How much money is this?",
      fig: (show) => moneyFig(money, { vals: show }),
      hint: "Count the dollar bills first. Then count the cents.",
      explain: `Dollars: ${bills}. Cents: ${countUp(money.slice(bills))}. That’s ${bills} dollar${bills > 1 ? "s" : ""} and ${cents} cents: ${amt(total)}.`,
    };
  }
  const prize = pick(PRIZE),
    price = priceOf(prize);
  if (variant === 1) {
    /* how much is left after buying a prize; not twice the price, where what's left is the price */
    let has;
    do has = 5 * R(price / 5 + 1, 20);
    while (has === 2 * price);
    const coinCounts = makeCents(has);
    return {
      kind: "num",
      unit: "cents",
      answer: has - price,
      prompt: `${name} has ${has}¢. ${name} buys ${an(prize[0])} ${prize[0]} for ${price}¢. How much money does ${name} have left?`,
      fig: (show) =>
        tags([[prize[0], `${price}¢`]]) +
        (show ? moneyFig(coinList(coinCounts), { vals: true, label: `${name}’s ${has}¢` }) : ""),
      misc: miscOf(has - price, [
        [has + price, `That’s adding. ${name} spends money, so there is less left.`],
        [price, `That’s the price of the ${prize[0]}.`],
        [has, `That’s what ${name} had before buying the ${prize[0]}.`],
      ]),
      hint: `Take away the price: ${has} − ${price}. Or count up from ${price} to ${has}.`,
      explain: `${has} − ${price} = ${has - price}. ${name} has ${has - price}¢ left.`,
    };
  }
  if (variant === 2) {
    /* what two prizes cost together, up to a dollar */
    let prize2, price2;
    do {
      prize2 = pick(PRIZE);
      price2 = priceOf(prize2);
    } while (prize2 === prize || price + price2 > 100);
    return {
      kind: "num",
      unit: "cents",
      answer: price + price2,
      prompt: `${name} buys ${an(prize[0])} ${prize[0]} for ${price}¢ and ${an(prize2[0])} ${prize2[0]} for ${price2}¢. How much does ${name} spend in all?`,
      fig: () =>
        tags([
          [prize[0], `${price}¢`],
          [prize2[0], `${price2}¢`],
        ]),
      misc: miscOf(price + price2, [
        [Math.abs(price - price2), "That’s the difference. Add to find what both cost together."],
        [price + price2 + 10, "Add the tens, then the ones."],
        [price + price2 - 10, "Add the tens, then the ones. Did you make a new ten?"],
      ]),
      hint: `Add the two prices: ${price} + ${price2}. Add the tens, then the ones.`,
      explain: `${price} + ${price2} = ${price + price2}. ${name} spends ${price + price2}¢.`,
    };
  }
  /* how much more a prize needs; not half the price, where what's needed is what's there (a 10¢ prize has only 5¢ below half, so it gets a big prize) */
  if (variant === 3 && price > 10) {
    let has;
    do has = 5 * R(1, price / 5 - 1);
    while (2 * has === price);
    const coinCounts = makeCents(has);
    return {
      kind: "num",
      unit: "cents",
      answer: price - has,
      prompt: `${name} has ${has}¢. ${name} wants ${an(prize[0])} ${prize[0]} that costs ${price}¢. How much more money does ${name} need?`,
      fig: () => tags([[prize[0], `${price}¢`]]) + moneyFig(coinList(coinCounts), { label: `${name}’s ${has}¢` }),
      misc: miscOf(price - has, [
        [price + has, `That’s adding. ${name} needs the difference between ${has}¢ and ${price}¢.`],
        [price, `That’s the whole price. ${name} already has ${has}¢.`],
        [has, `That’s what ${name} has now.`],
      ]),
      hint: `Count up from ${has} to ${price}.`,
      explain: `${has} + ${price - has} = ${price}, so ${name} needs ${price - has}¢ more.`,
    };
  }
  /* how many more dollars a big thing needs; not half its price */
  const bigThing = pick(BIG),
    bigPrice = R(bigThing[1], bigThing[2]);
  let has;
  do has = R(1, bigPrice - 1);
  while (2 * has === bigPrice);
  return {
    kind: "num",
    unit: "dollars",
    answer: bigPrice - has,
    prompt: `${cap(an(bigThing[0]))} ${bigThing[0]} costs $${bigPrice}. ${name} has $${has}. How many more dollars does ${name} need?`,
    fig: () => tags([[bigThing[0], `$${bigPrice}`]]) + moneyFig(coinList({ B: has }), { label: `${name}’s $${has}` }),
    misc: miscOf(bigPrice - has, [
      [bigPrice + has, `That’s adding. ${name} needs the difference.`],
      [bigPrice, `That’s the whole price. ${name} already has $${has}.`],
      [has, `That’s what ${name} has now.`],
    ]),
    hint: `Count up from $${has} to $${bigPrice}.`,
    explain: `$${has} + $${bigPrice - has} = $${bigPrice}, so ${name} needs $${bigPrice - has} more.`,
  };
}

/* ---------- The Big Wheel: everything ---------- */
const genBoss = () => pick([genShapes, genParts, genTime, genCoins, genShop])();

const ZONES = [
  {
    id: "shapes",
    name: "Shape Tent",
    lessons: "Lessons 1–4",
    blurb: "Name shapes by their sides, find squares, and count the faces of solid shapes.",
    gen: genShapes,
  },
  {
    id: "parts",
    name: "Pie Stand",
    lessons: "Lessons 6–9",
    blurb: "Cut pies and sandwiches into halves, thirds, and fourths, and fill shapes with pattern blocks.",
    gen: genParts,
  },
  {
    id: "time",
    name: "Clock Tower",
    lessons: "Lessons 11–13",
    blurb: "Tell time by 5s, say half past and quarter till, and pick a.m. or p.m.",
    gen: genTime,
  },
  {
    id: "coins",
    name: "Coin Toss",
    lessons: "Lessons 15–17",
    blurb: "Count pennies, nickels, dimes, and quarters, and make a dollar.",
    gen: genCoins,
  },
  {
    id: "shop",
    name: "Prize Shop",
    lessons: "Lessons 18–19",
    blurb: "Count dollars and cents, and buy prizes: how much in all, and how much is left?",
    gen: genShop,
  },
  {
    id: "boss",
    name: "The Big Wheel",
    lessons: "All lessons",
    blurb: "Ride the Ferris wheel! Every right answer lights up one of its 10 cars.",
    gen: genBoss,
  },
];

/* the Ferris wheel: a rim with spokes and 10 cars on a stand. lit: how many cars are lit (the boss icon draws all of them lit). */
const wheel = (lit) =>
  `<path d="M32,32L18,62M32,32L46,62M12,62H52" stroke="#a9c4e4" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="30" r="22" fill="none" stroke="#f3f6fb" stroke-width="2.5"/>` +
  range(10)
    .map((i) => {
      const a = (i * Math.PI) / 5 - Math.PI / 2,
        x = +(32 + 22 * Math.cos(a)).toFixed(1),
        y = +(30 + 22 * Math.sin(a)).toFixed(1);
      return `<path d="M32,30L${x},${y}" stroke="rgba(243,246,251,.45)" stroke-width="1.2"/><rect x="${x - 4}" y="${y - 2}" width="8" height="7" rx="2" fill="${i < lit ? "#ffc93c" : "#1b467a"}" stroke="#0a2340" stroke-width="1"/>`;
    })
    .join("") +
  '<circle cx="32" cy="30" r="3.5" fill="#ff8ac4"/>';
const ICON = {
  shapes:
    '<path d="M8,52L32,8L56,52Z" fill="#ff8ac4" stroke="#0a2340" stroke-width="2" stroke-linejoin="round"/><path d="M32,8V52" stroke="#0a2340" stroke-width="1.5"/><path d="M20,52L32,30L44,52Z" fill="#0a2340"/><path d="M32,8L32,2L40,5L32,7" fill="#ffc93c"/><polygon points="44,44 50,40 56,44 54,51 46,51" fill="#7fe3ff" stroke="#0a2340" stroke-width="1.2"/>',
  parts:
    '<circle cx="32" cy="34" r="24" fill="#f2d0a0" stroke="#d9a066" stroke-width="3"/><circle cx="32" cy="34" r="18" fill="#ff7b7b"/><path d="M32,34V10M32,34L52.8,46M32,34L11.2,46" stroke="#0a2340" stroke-width="2.5"/>',
  time: '<path d="M14,60V26L32,8L50,26V60Z" fill="#d9a066" stroke="#0a2340" stroke-width="2" stroke-linejoin="round"/><circle cx="32" cy="32" r="12" fill="#f3f6fb" stroke="#ffc93c" stroke-width="3"/><path d="M32,32V24M32,32L37,35" stroke="#0a2340" stroke-width="2.5" stroke-linecap="round"/><rect x="26" y="48" width="12" height="12" fill="#0a2340"/>',
  coins:
    '<circle cx="22" cy="40" r="16" fill="#cdd6e1" stroke="#f3f6fb" stroke-width="2"/><circle cx="42" cy="26" r="13" fill="#d9895a" stroke="#f5c6a5" stroke-width="2"/><circle cx="46" cy="50" r="10" fill="#cdd6e1" stroke="#f3f6fb" stroke-width="2"/><path d="M8,14l4,4M14,6l1,6M4,24l6,0" stroke="#ffc93c" stroke-width="2.5" stroke-linecap="round"/>',
  shop: '<path d="M8,22H56V58H8Z" fill="#12365f" stroke="#f3f6fb" stroke-width="2"/><path d="M4,22L10,8H54L60,22Z" fill="#ff7b7b" stroke="#f3f6fb" stroke-width="2" stroke-linejoin="round"/><path d="M18,8L16,22M28,8L27,22M36,8L37,22M46,8L48,22" stroke="#f3f6fb" stroke-width="2"/><circle cx="22" cy="42" r="8" fill="#5fe0a8"/><rect x="34" y="34" width="14" height="16" rx="2" fill="#ffc93c"/>',
  boss: wheel(10),
};
