/* Map Makers (Grade 5 Unit 7): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   The grid and what's true of a shape on it (gridFig, quadFacts, triFacts, ptText) come from figs.js, and the grid itself
   from shared/algebra.js; mcOf and miscOf from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Every problem also
   carries facts for checks.js: its kind (t) and the points or numbers it was made from, so the answer can be worked out again. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* the grid is 10 across and 8 up */
const X_MAX = 10,
  Y_MAX = 8;
/* the shape's corners moved so its lowest-left corner is at a random spot that keeps the whole shape on the grid */
function placed(pts) {
  const xs = pts.map(([x]) => x),
    ys = pts.map(([, y]) => y),
    dx = R(1, X_MAX - 1 - (Math.max(...xs) - Math.min(...xs))) - Math.min(...xs),
    dy = R(1, Y_MAX - 1 - (Math.max(...ys) - Math.min(...ys))) - Math.min(...ys);
  return pts.map(([x, y]) => [x + dx, y + dy]);
}
/* whether a shape is small enough to place on the grid, with a square of room all around */
const fits = (pts) => {
  const xs = pts.map(([x]) => x),
    ys = pts.map(([, y]) => y);
  return Math.max(...xs) - Math.min(...xs) <= X_MAX - 2 && Math.max(...ys) - Math.min(...ys) <= Y_MAX - 2;
};
/* a shape in a story: its corners on the grid, shaded */
const shapeOn = (pts, label) => gridFig([], { shapes: [{ pts, closed: true, cls: "fill" }], label });

/* ---------- Base Camp: the coordinate grid (Lessons 1–3) ---------- */
/* four lettered points at different spots on the grid, one of them swapped when it can be: [{x, y, id}] */
function landmarks() {
  let pts;
  do {
    const x = R(1, 9),
      y = R(1, 7);
    pts = [[x, y], ...(y !== x && y <= 9 && x <= 7 ? [[y, x]] : [])];
    while (pts.length < 4) pts.push([R(1, 9), R(1, 7)]);
  } while (new Set(pts.map(ptText)).size < 4);
  return pts.map(([x, y], i) => ({ x, y, id: "ABCD"[i] }));
}
function genPlot() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* tap the point at (x, y) */
    const marks = landmarks(),
      [target] = marks,
      letters = shuffle(["A", "B", "C", "D"]),
      points = marks.map((p, i) => ({ ...p, id: letters[i], t: letters[i] })),
      swapped = points.find((p) => p.x === target.y && p.y === target.x && p !== points[0]);
    return {
      kind: "tap",
      answer: points[0].id,
      facts: { t: "tapPoint", x: target.x, y: target.y, points },
      prompt: `Tap the point at ${ptText([target.x, target.y])}.`,
      fig: () =>
        gridFig(points, {
          tap: true,
          label: `A grid with points ${points.map((p) => `${p.id} ${ptText([p.x, p.y])}`).join(", ")}`,
        }),
      why: swapped
        ? {
            [swapped.id]: `That’s ${ptText([swapped.x, swapped.y])}. Go across ${target.x} first, then up ${target.y}.`,
          }
        : {},
      hint: `Start at (0, 0). Go ${target.x} across, then ${target.y} up.`,
      explain: `${ptText([target.x, target.y])} is ${target.x} across and ${target.y} up: point ${points[0].id}.`,
    };
  }
  if (variant === 1) {
    /* the coordinates of a lettered point */
    let x, y;
    do {
      x = R(1, 9);
      y = R(1, 7);
    } while (x === y || y > 9 || x > 7);
    const near = R(0, 1) ? [x + 1, y] : [x, y + 1];
    return {
      ...mcOf([
        [ptText([x, y]), null],
        [ptText([y, x]), `That’s across ${y} and up ${x}. The first number is how far across: ${x}.`],
        [ptText(near), "Count the grid lines again, starting from 0."],
      ]),
      facts: { t: "coords", x, y },
      prompt: "What are the coordinates of the campsite, point C?",
      fig: () => gridFig([{ x, y, t: "C" }], { label: `A grid with point C at ${ptText([x, y])}` }),
      hint: "The first number is how far across from 0; the second is how far up.",
      explain: `Point C is ${x} across and ${y} up: ${ptText([x, y])}.`,
    };
  }
  /* how far apart two points on the same grid line are */
  const across = R(0, 1) === 1,
    fixed = across ? R(1, 7) : R(1, 9),
    [a, b] = shuffle(range(across ? 9 : 7).map((i) => i + 1)).slice(0, 2),
    first = across ? [a, fixed] : [fixed, a],
    second = across ? [b, fixed] : [fixed, b],
    answer = Math.abs(a - b);
  return {
    kind: "num",
    unit: "units",
    answer,
    facts: { t: "distance", first, second },
    prompt: `The tent is at ${ptText(first)} and the lake is at ${ptText(second)}. How many units apart are they?`,
    fig: () =>
      gridFig(
        [
          { x: first[0], y: first[1], t: "Tent" },
          { x: second[0], y: second[1], t: "Lake", cls: "b" },
        ],
        { label: `A grid with the tent at ${ptText(first)} and the lake at ${ptText(second)}` },
      ),
    misc: miscOf(answer, [
      [
        a + b,
        `That adds. The ${across ? "first" : "second"} numbers are ${a} and ${b}: subtract to find the distance.`,
      ],
    ]).filter(([wrong]) => wrong !== answer),
    hint: `The ${across ? "second" : "first"} numbers match, so they’re on the same grid line. Subtract the other numbers.`,
    explain: `${Math.max(a, b)} − ${Math.min(a, b)} = ${answer} units.`,
  };
}

/* ---------- Shape Survey: sort quadrilaterals (Lessons 4–7) ---------- */
/* the most specific names, each with a shape maker, in order from least to most specific */
const QUAD_KINDS = ["quadrilateral", "trapezoid", "parallelogram", "rectangle", "rhombus", "square"];
/* a quadrilateral of the given kind (its best name), sized and placed at random on the grid */
function makeQuad(kind) {
  let pts;
  do {
    if (kind === "square") {
      const s = R(2, 5),
        tilt = R(0, 2) === 0 ? [R(1, 2), R(1, 2)] : null;
      pts = tilt
        ? [
            [0, tilt[0]],
            [tilt[1], 0],
            [tilt[0] + tilt[1], tilt[1]],
            [tilt[0], tilt[0] + tilt[1]],
          ]
        : [
            [0, 0],
            [s, 0],
            [s, s],
            [0, s],
          ];
    } else if (kind === "rectangle") {
      const w = R(2, 8),
        h = R(1, 6);
      pts = [
        [0, 0],
        [w, 0],
        [w, h],
        [0, h],
      ];
    } else if (kind === "rhombus") {
      const p = R(1, 4),
        q = R(1, 3);
      pts = [
        [0, q],
        [p, 0],
        [2 * p, q],
        [p, 2 * q],
      ];
    } else if (kind === "parallelogram") {
      const b = R(3, 6),
        h = R(2, 4),
        s = R(1, 3) * pick([1, -1]);
      pts = [
        [Math.max(0, -s), 0],
        [Math.max(0, -s) + b, 0],
        [Math.max(0, -s) + b + s, h],
        [Math.max(0, -s) + s, h],
      ];
    } else if (kind === "trapezoid") {
      const b = R(4, 8),
        t = R(1, b - 2),
        h = R(2, 5),
        o = R(0, b - t);
      pts = [
        [0, 0],
        [b, 0],
        [o + t, h],
        [o, h],
      ];
    } else {
      /* a kite with no parallel sides, or any four corners with none */
      const w = R(1, 3),
        up = R(1, 3),
        down = R(2, 4);
      pts = R(0, 1)
        ? [
            [w, 0],
            [2 * w, down],
            [w, down + up],
            [0, down],
          ]
        : [
            [0, R(0, 2)],
            [R(4, 6), 0],
            [R(5, 8), R(4, 6)],
            [R(1, 3), R(3, 6)],
          ];
    }
  } while (quadFacts(pts).best !== kind || !fits(pts));
  return placed(pts);
}
/* why a name doesn't fit a shape, from what the shape has */
function whyNot(name, facts) {
  return {
    trapezoid: "It has no pair of parallel sides, so it isn’t a trapezoid.",
    parallelogram: `A parallelogram has 2 pairs of parallel sides. This has ${facts.parallel}.`,
    rectangle: `A rectangle has 4 right angles. This has ${facts.rights}.`,
    rhombus: "A rhombus has 4 sides all the same length. These sides aren’t all equal.",
    square: "A square has 4 right angles and 4 equal sides. This doesn’t have both.",
  }[name];
}
/* statements about the hierarchy: [the statement, whether it's true] */
const STATEMENTS = [
  ["Every square is a rectangle.", true],
  ["Every square is a rhombus.", true],
  ["Every rectangle is a parallelogram.", true],
  ["Every rhombus is a parallelogram.", true],
  ["Every parallelogram is a trapezoid.", true],
  ["Every rectangle is a square.", false],
  ["Every rhombus is a square.", false],
  ["Every parallelogram is a rectangle.", false],
  ["Every trapezoid is a parallelogram.", false],
  ["Every parallelogram is a rhombus.", false],
];
function genQuads() {
  const variant = R(0, 3);
  if (variant === 2) {
    /* which statement about the hierarchy is true */
    const right = pick(STATEMENTS.filter(([, ok]) => ok)),
      wrongs = shuffle(STATEMENTS.filter(([, ok]) => !ok)).slice(0, 2);
    return {
      ...mcOf([
        [right[0], null],
        ...wrongs.map(([text]) => {
          const [, small, big] = text.match(/Every (\w+) is an? (\w+)/);
          return [text, `Not every ${small} is a ${big}: a ${big} needs more than a ${small} has to have.`];
        }),
      ]),
      facts: { t: "statement", right: right[0] },
      prompt: "Which statement is always true?",
      hint: "A more specific shape has everything a less specific one has. A square is the most specific: it’s also a rectangle, a rhombus, a parallelogram, and a trapezoid.",
      explain: `${right[0]} It has everything that name needs.`,
    };
  }
  const kind = pick(QUAD_KINDS),
    pts = makeQuad(kind),
    facts = quadFacts(pts),
    fig = () => shapeOn(pts, `A ${facts.best} with corners ${pts.map(ptText).join(", ")}`);
  if (variant === 0) {
    /* the most specific name, with a true but less specific name and a name that doesn't fit (a square, which has every
       name, gets two less specific ones) */
    const truer = shuffle(facts.names.filter((name) => name !== facts.best)),
      wrongs = shuffle(QUAD_KINDS.filter((name) => !facts.names.includes(name))),
      others = [
        ...truer
          .slice(0, 1)
          .map((name) => [
            name,
            name === "quadrilateral"
              ? "Every 4-sided shape is a quadrilateral. Is there a more specific name?"
              : "That’s true, but there’s a more specific name. Check the right angles and the side lengths.",
          ]),
        ...wrongs.map((name) => [name, whyNot(name, facts)]),
        ...truer.slice(1).map((name) => [name, "That’s true, but there’s a more specific name."]),
      ],
      options = [[facts.best, null], ...others.slice(0, 2)];
    return {
      ...mcOf(options),
      facts: { t: "best", pts },
      prompt: "What is the most specific name for this shape?",
      fig,
      hint: "Count the pairs of parallel sides and the right angles, and check whether all 4 sides are equal.",
      explain: `It has ${facts.parallel} ${facts.parallel === 1 ? "pair" : "pairs"} of parallel sides, ${facts.rights} right ${facts.rights === 1 ? "angle" : "angles"}${facts.equal ? ", and 4 equal sides" : ""}: ${facts.names.length > 1 ? `it’s a ${facts.names.slice(1).join(", a ")}, and most specifically a ${facts.best}` : "just a quadrilateral"}.`,
    };
  }
  if (variant === 1) {
    /* which name fits: one that does and two that don't */
    const fits = pick(
        facts.names
          .filter((name) => name !== "quadrilateral")
          .concat(facts.best === "quadrilateral" ? ["quadrilateral"] : []),
      ),
      wrongs = shuffle(QUAD_KINDS.filter((name) => !facts.names.includes(name))).slice(0, 2);
    if (wrongs.length < 2) return genQuads();
    return {
      ...mcOf([[fits, null], ...wrongs.map((name) => [name, whyNot(name, facts)])]),
      facts: { t: "fits", pts },
      prompt: "Which name fits this shape?",
      fig,
      hint: "Count the pairs of parallel sides and the right angles, and check the side lengths.",
      explain: `It’s ${facts.names.length > 1 ? `a ${facts.names.slice(1).join(", a ")}` : "a quadrilateral, with no parallel sides"}, so “${fits}” fits.`,
    };
  }
  /* count parallel pairs or right angles (a shape with none of them is dealt again: answers are never 0) */
  const askRights = R(0, 1) === 1,
    answer = askRights ? facts.rights : facts.parallel;
  if (!answer) return genQuads();
  return {
    kind: "num",
    unit: askRights ? "right angles" : "pairs",
    answer,
    facts: { t: askRights ? "rights" : "parallel", pts },
    prompt: askRights
      ? "How many right angles does this shape have?"
      : "How many pairs of parallel sides does this shape have?",
    fig,
    misc: miscOf(answer, [
      [
        askRights ? 4 : 2,
        askRights
          ? "Not every corner is a square corner. Check each one against the grid."
          : "Check each pair of opposite sides: do they run the same way on the grid?",
      ],
    ]).filter(([wrong]) => wrong !== answer),
    hint: askRights
      ? "A right angle makes a square corner. Check each corner."
      : "Opposite sides are parallel when they run the same way: the same steps across and up.",
    explain: askRights
      ? `It has ${answer} right ${answer === 1 ? "angle" : "angles"}.`
      : `It has ${answer} ${answer === 1 ? "pair" : "pairs"} of parallel sides.`,
  };
}

/* ---------- Triangle Peaks: sort triangles (Lesson 8) ---------- */
/* a triangle with these angles and sides, placed at random on the grid */
function makeTriangle(angles, sides) {
  let pts;
  do {
    if (angles === "right") {
      const a = R(2, 6),
        b = sides === "isosceles" ? a : R(2, 6);
      pts = [
        [0, 0],
        [a, 0],
        [0, b],
      ];
    } else {
      const base = R(3, 8),
        h = R(2, 6),
        apex =
          sides === "isosceles" ? base / 2 : angles === "obtuse" ? pick([R(-3, -1), base + R(1, 3)]) : R(1, base - 1);
      pts = [
        [0, 0],
        [base, 0],
        [apex, h],
      ];
    }
  } while (
    !fits(pts) ||
    pts.some(([x]) => !Number.isInteger(x)) ||
    triFacts(pts).angles !== angles ||
    triFacts(pts).sides !== sides
  );
  return placed(pts);
}
const ANGLE_KINDS = ["acute", "right", "obtuse"],
  SIDE_KINDS = ["isosceles", "scalene"];
function genTriangles() {
  const variant = R(0, 2);
  if (variant === 2) {
    /* from side lengths and an angle, in words */
    const [sides, angles, lengths, why] = pick([
      ["equilateral", "acute", [7, 7, 7], "All 3 sides are equal, and every angle is less than a right angle."],
      ["isosceles", "right", [5, 5, null], "Two sides are equal, and one angle is a right angle."],
      ["scalene", "right", [6, 8, 10], "No sides are equal, and one angle is a right angle."],
      ["isosceles", "obtuse", [4, 4, 7], "Two sides are equal, and one angle is wider than a right angle."],
      ["scalene", "obtuse", [3, 5, 7], "No sides are equal, and one angle is wider than a right angle."],
    ]);
    const described =
      lengths[2] === null
        ? `Two of its sides are ${lengths[0]} cm long, and it has a right angle.`
        : `Its sides are ${lengths.join(" cm, ")} cm${angles === "right" ? ", and it has a right angle" : angles === "obtuse" ? ", and one angle is wider than a right angle" : ""}.`;
    const name = sides === "equilateral" ? "equilateral triangle" : `${angles} ${sides} triangle`,
      others =
        sides === "equilateral"
          ? [
              ["scalene triangle", "A scalene triangle has no equal sides. These are all equal."],
              [
                "right isosceles triangle",
                "An equilateral triangle can’t have a right angle: all its angles are the same, less than a right angle.",
              ],
            ]
          : [
              [
                `${angles} ${sides === "isosceles" ? "scalene" : "isosceles"} triangle`,
                sides === "isosceles"
                  ? "Two sides are equal, so it isn’t scalene."
                  : "No sides are equal, so it isn’t isosceles.",
              ],
              [
                `${angles === "acute" ? "right" : "acute"} ${sides} triangle`,
                angles === "right"
                  ? "It has a right angle, so it isn’t acute."
                  : "One angle is wider than a right angle: obtuse.",
              ],
            ];
    return {
      ...mcOf([[name, null], ...others]),
      facts: { t: "triWords", sides, angles, lengths },
      prompt: `A triangle on a park map has these measures. ${described} What kind of triangle is it?`,
      hint: "Count the equal sides, then look at the biggest angle.",
      explain: `${why} It’s ${/^[aeiou]/.test(name) ? "an" : "a"} ${name}.`,
    };
  }
  const angles = pick(ANGLE_KINDS),
    sides = pick(SIDE_KINDS),
    pts = makeTriangle(angles, sides),
    fig = () => shapeOn(pts, `A triangle with corners ${pts.map(ptText).join(", ")}`);
  if (variant === 0) {
    /* by its angles, from the picture */
    return {
      ...mcOf(
        ANGLE_KINDS.map((kind) => [
          kind,
          kind === angles
            ? null
            : {
                acute: "Check the biggest angle against a square corner of the grid.",
                right: "None of the corners is a square corner.",
                obtuse: "None of the angles is wider than a square corner.",
              }[kind],
        ]),
      ),
      facts: { t: "triAngles", pts },
      prompt: "Is this triangle acute, right, or obtuse?",
      fig,
      hint: "Compare its biggest angle with a square corner of the grid.",
      explain: {
        acute: "All three angles are less than a right angle: acute.",
        right: "One angle is a square corner: right.",
        obtuse: "One angle is wider than a square corner: obtuse.",
      }[angles],
    };
  }
  /* by its sides and angles, from the picture */
  const name = `${angles} ${sides} triangle`,
    otherSides = sides === "isosceles" ? "scalene" : "isosceles",
    otherAngles = pick(ANGLE_KINDS.filter((kind) => kind !== angles));
  return {
    ...mcOf([
      [name, null],
      [
        `${angles} ${otherSides} triangle`,
        sides === "isosceles"
          ? "Two of its sides are the same length, so it isn’t scalene."
          : "None of its sides are the same length, so it isn’t isosceles.",
      ],
      [
        `${otherAngles} ${sides} triangle`,
        {
          acute: "Its biggest angle isn’t less than a square corner.",
          right: "None of the corners is a square corner.",
          obtuse: "None of the angles is wider than a square corner.",
        }[otherAngles],
      ],
    ]),
    facts: { t: "triName", pts },
    prompt: "Which name fits this triangle?",
    fig,
    hint: "Are any two sides the same length? Then compare the biggest angle with a square corner.",
    explain: `${sides === "isosceles" ? "Two sides are the same length" : "No two sides are the same length"}, and ${{ acute: "every angle is less than a right angle", right: "one angle is a right angle", obtuse: "one angle is wider than a right angle" }[angles]}: ${/^[aeiou]/.test(name) ? "an" : "a"} ${name}.`,
  };
}

/* ---------- Trail Patterns: two rules and ordered pairs (Lessons 9–12) ---------- */
function genPatterns() {
  const variant = R(0, 2),
    a = R(1, 4),
    times = R(2, a > 3 ? 3 : 4),
    b = a * times,
    /* the nth number of each pattern (the 1st is 0) */
    nthA = (n) => (n - 1) * a,
    nthB = (n) => (n - 1) * b;
  if (variant === 0) {
    /* a later number in Rule B */
    const n = R(5, 8),
      answer = nthB(n);
    return {
      kind: "num",
      unit: "",
      answer,
      facts: { t: "nth", b, n },
      prompt: `Rule B: start at 0 and add ${b}. The pattern goes 0, ${b}, ${2 * b}, … What is the ${n}th number?`,
      misc: miscOf(answer, [
        [n * b, `That counts the start as one ${b}. The 1st number is 0, so the ${n}th adds ${b} only ${n - 1} times.`],
        [b + n, `That adds ${n}. Keep adding ${b}: ${n - 1} times.`],
      ]).filter(([wrong]) => wrong !== answer),
      hint: `From the 1st number to the ${n}th, the rule adds ${b} ${n - 1} times.`,
      explain: `0 + ${n - 1} × ${b} = ${answer}.`,
    };
  }
  if (variant === 1) {
    /* how the two patterns are related */
    const words = (k) => `Each Rule B number is ${k} times the Rule A number`;
    return {
      ...mcOf([
        [words(times), null],
        [
          `Each Rule B number is ${b - a} more than the Rule A number`,
          `That works only for the 2nd numbers. Try the 3rd: ${2 * b} is not ${2 * a} + ${b - a}.`,
        ],
        [words(times + 1), `Check one: ${b} is ${times} times ${a}, not ${times + 1} times.`],
      ]),
      facts: { t: "relation", a, b },
      prompt: `Rule A: start at 0 and add ${a}. Rule B: start at 0 and add ${b}. How are the patterns related?`,
      hint: `Write a few numbers of each: 0, ${a}, ${2 * a}, ${3 * a} and 0, ${b}, ${2 * b}, ${3 * b}. Compare them in pairs.`,
      explain: `${a} × ${times} = ${b}, ${2 * a} × ${times} = ${2 * b}, ${3 * a} × ${times} = ${3 * b}: each Rule B number is ${times} times the Rule A number.`,
    };
  }
  /* the next ordered pair */
  const shown = range(4).map((i) => ptText([i * a, i * b])),
    next = [4 * a, 4 * b];
  return {
    ...mcOf([
      [ptText(next), null],
      [ptText([4 * a, 4 * b - a]), `Rule B adds ${b} each time: ${3 * b} + ${b} = ${4 * b}.`],
      [ptText([4 * b, 4 * a]), "That swaps the numbers. Rule A’s number comes first."],
    ]),
    facts: { t: "nextPair", a, b },
    prompt: `Rule A adds ${a} and Rule B adds ${b}, both starting at 0. The ordered pairs are ${shown.join(", ")}, … What pair comes next?`,
    hint: `Add ${a} to the first number and ${b} to the second.`,
    explain: `${3 * a} + ${a} = ${4 * a} and ${3 * b} + ${b} = ${4 * b}: ${ptText(next)}.`,
  };
}

/* ---------- Land Plots: rectangles on the grid (Lesson 13) ---------- */
function genRect() {
  const variant = R(0, 2),
    name = pick(KIDS);
  let w, h;
  do {
    w = R(2, 8);
    h = R(2, 6);
  } while (2 * (w + h) === w * h || w === h);
  const [[x0, y0]] = placed([
      [0, 0],
      [w, h],
    ]),
    corners = [
      [x0, y0],
      [x0 + w, y0],
      [x0 + w, y0 + h],
      [x0, y0 + h],
    ];
  if (variant === 2) {
    /* the fourth corner of a rectangle */
    const missing = R(0, 3),
      given = corners.filter((c, i) => i !== missing),
      right = corners[missing],
      wrongs = [
        [right[0] + 1, right[1]],
        [right[1], right[0]],
        [right[0], right[1] + 1],
      ].filter(([x, y]) => x !== right[0] || y !== right[1]);
    return {
      ...mcOf([
        [ptText(right), null],
        ...shuffle(wrongs)
          .filter((p, i, all) => all.findIndex((q) => ptText(q) === ptText(p)) === i)
          .slice(0, 2)
          .map((p) => [
            ptText(p),
            "A rectangle’s opposite sides line up with the grid lines. Match the corner to the others across and up.",
          ]),
      ]),
      facts: { t: "corner", given, right },
      prompt: `Three corners of a rectangular garden are ${given.map(ptText).join(", ")}. Where is the fourth corner?`,
      fig: () =>
        gridFig(
          given.map(([x, y]) => ({ x, y })),
          { label: `A grid with the points ${given.map(ptText).join(", ")}` },
        ),
      hint: "The fourth corner lines up with one corner across and with another corner up.",
      explain: `The fourth corner is ${ptText(right)}: it lines up with the other corners across and up.`,
    };
  }
  const perimeter = 2 * (w + h),
    area = w * h,
    askArea = variant === 1,
    answer = askArea ? area : perimeter;
  return {
    kind: "num",
    unit: askArea ? "square meters" : "meters",
    answer,
    facts: { t: askArea ? "area" : "perimeter", corners },
    prompt: `${name}’s garden plot has corners at ${corners.map(ptText).join(", ")}. Each grid unit is 1 meter. What is its ${askArea ? "area" : "perimeter"}?`,
    fig: () => shapeOn(corners, `A rectangle with corners ${corners.map(ptText).join(", ")}`),
    misc: miscOf(answer, [
      [
        askArea ? perimeter : area,
        askArea
          ? "That’s the perimeter, the distance around. Area is length × width."
          : "That’s the area. Perimeter is the distance all the way around.",
      ],
      [
        w + h,
        askArea
          ? "That adds the sides. Area is length × width."
          : `That’s two sides. Go all the way around: ${w} + ${h} + ${w} + ${h}.`,
      ],
    ]).filter(([wrong]) => wrong !== answer),
    hint: `It’s ${w} units across (${x0 + w} − ${x0}) and ${h} units up (${y0 + h} − ${y0}).`,
    explain: askArea ? `${w} × ${h} = ${area} square meters.` : `${w} + ${h} + ${w} + ${h} = ${perimeter} meters.`,
  };
}

/* ---------- Treasure Hunt: the final round ---------- */
const genBoss = () => pick([genPlot, genQuads, genTriangles, genPatterns, genRect])();

const ZONES = [
  {
    id: "plot",
    name: "Base Camp",
    lessons: "Lessons 1, 3",
    blurb: "Find points on the coordinate grid, and read their coordinates.",
    gen: genPlot,
  },
  {
    id: "quads",
    name: "Shape Survey",
    lessons: "Lessons 4, 6–7",
    blurb: "Sort quadrilaterals by their sides and angles, and give them their best names.",
    gen: genQuads,
  },
  {
    id: "triangles",
    name: "Triangle Peaks",
    lessons: "Lesson 8",
    blurb: "Sort triangles by their sides and by their angles.",
    gen: genTriangles,
  },
  {
    id: "patterns",
    name: "Trail Patterns",
    lessons: "Lessons 9–10, 12",
    blurb: "Follow two rules at once, and see how their numbers are related.",
    gen: genPatterns,
  },
  {
    id: "rect",
    name: "Land Plots",
    lessons: "Lesson 13",
    blurb: "Find perimeters, areas, and missing corners of rectangles on the grid.",
    gen: genRect,
  },
  {
    id: "boss",
    name: "Treasure Hunt",
    lessons: "All lessons",
    blurb: "Find the treasure! Every right answer digs up another gold coin.",
    gen: genBoss,
  },
];

/* the treasure chest with `found` of its 10 coins, piled in two rows (the boss icon has all of them) */
const chest = (found) =>
  '<path d="M8,34H56V58H8Z" fill="#a9822a" stroke="#0a2340" stroke-width="1.5"/><path d="M8,34Q32,14 56,34" fill="#c9a03f" stroke="#0a2340" stroke-width="1.5"/><rect x="28" y="38" width="8" height="8" fill="#ffc93c" stroke="#0a2340" stroke-width="1"/>' +
  range(10)
    .map((i) => {
      const x = 12 + (i % 5) * 10,
        y = i < 5 ? 18 : 9;
      return i < found ? `<circle cx="${x}" cy="${y}" r="4.5" fill="#ffc93c" stroke="#0a2340" stroke-width="1"/>` : "";
    })
    .join("");
const ICON = {
  plot: '<path d="M10,54H58M10,54V6" stroke="#f3f6fb" stroke-width="2"/><path d="M10,30H34V54" fill="none" stroke="#7fe3ff" stroke-width="1.5" stroke-dasharray="3 3"/><circle cx="34" cy="30" r="5" fill="#ffc93c"/><text x="44" y="24" fill="#f3f6fb" font-size="9" font-weight="700" font-family="monospace">(4,4)</text>',
  quads:
    '<path d="M8,48L20,16H56L44,48Z" fill="rgba(255,201,60,.25)" stroke="#ffc93c" stroke-width="2.5"/><path d="M14,32L18,28M48,32L52,28" stroke="#7fe3ff" stroke-width="2"/>',
  triangles:
    '<path d="M6,56L26,14L36,34L44,22L58,56Z" fill="#3d5a80" stroke="#0a2340" stroke-width="1.5"/><path d="M20,28L26,14L32,26" fill="#f3f6fb"/>',
  patterns:
    '<g fill="#ffc93c"><circle cx="10" cy="52" r="4"/><circle cx="24" cy="40" r="4"/><circle cx="38" cy="28" r="4"/><circle cx="52" cy="16" r="4"/></g><path d="M10,52L52,16" stroke="#7fe3ff" stroke-width="1.5" stroke-dasharray="3 3"/>',
  rect: '<rect x="10" y="16" width="44" height="30" fill="rgba(95,224,168,.3)" stroke="#5fe0a8" stroke-width="2.5"/><path d="M10,24H54M10,32H54M10,40H54M18,16V46M26,16V46M34,16V46M42,16V46" stroke="#5fe0a8" stroke-width=".8"/>',
  boss: chest(10),
};
