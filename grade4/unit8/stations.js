/* Shape Gallery (Grade 4 Unit 8): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Shapes, their marks, L-shaped figures, folds, and symmetry tests come from figs.js; mcOf and miscOf from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Every problem also
   carries facts for checks.js: its kind (t) and what it was made from, so the answer can be worked out again. */
/* the text with its first letter capitalized */
const cap = (text) => text[0].toUpperCase() + text.slice(1);
const TRIANGLE_IDS = SHAPE_IDS.filter((id) => SHAPES[id].pts.length === 3);
const QUAD_IDS = SHAPE_IDS.filter((id) => SHAPES[id].pts.length === 4);

/* ---------- Triangle Lab: triangles by sides and angles (Lessons 1–2) ---------- */
const SIDE_KINDS = ["equilateral", "isosceles", "scalene"];
const ANGLE_KINDS = ["acute", "right", "obtuse"];
/* why a triangle isn't a kind (by its sides or angles) */
/* what each kind of triangle has */
const RULE = {
  equilateral: "all 3 sides equal",
  isosceles: "at least 2 equal sides",
  scalene: "no equal sides",
  acute: "only angles less than 90°",
  right: "a right angle",
  obtuse: "an angle more than 90°",
};
const NOT_KIND = {
  equilateral: "Equilateral needs all 3 sides equal: 3 matching ticks.",
  isosceles: "Isosceles needs at least 2 equal sides: 2 matching ticks.",
  scalene: "Scalene has no equal sides, but this one has tick marks.",
  acute: "Acute triangles have only angles less than 90°.",
  right: "A right triangle has a right angle, marked with a box.",
  obtuse: "An obtuse triangle has an angle more than 90°.",
};
function genTriangles() {
  const variant = R(0, 2);
  if (variant < 2) {
    /* name a triangle by its sides, or by its angles */
    const id = pick(TRIANGLE_IDS),
      bySides = variant === 0,
      /* an equilateral triangle is isosceles too (it has at least 2 equal sides), so isosceles isn't offered for it */
      kinds = bySides ? SIDE_KINDS.filter((k) => !(id === "equilateral" && k === "isosceles")) : ANGLE_KINDS,
      kind = bySides ? SHAPES[id].sides : SHAPES[id].angles;
    return {
      ...mcOf(kinds.map((k) => [cap(k), k === kind ? null : NOT_KIND[k]])),
      facts: { t: bySides ? "sides" : "angles", id },
      prompt: `What kind of triangle is this, by its ${bySides ? "sides" : "angles"}?`,
      fig: () => shapeFig(id, { label: "A triangle with its marks" }),
      hint: bySides
        ? "Look at the tick marks: sides with the same marks are equal."
        : "Look for a right-angle box, or an angle that opens wider than one.",
      explain: `It’s ${kind}: ${bySides ? { equilateral: "all 3 sides are equal", isosceles: "2 sides are equal", scalene: "no sides are equal" }[kind] : { acute: "every angle is less than 90°", right: "it has a right angle", obtuse: "one angle is more than 90°" }[kind]}.`,
    };
  }
  /* pick the triangle of a kind: one that is, two that aren't */
  const property = pick([...SIDE_KINDS, ...ANGLE_KINDS]),
    /* equilateral triangles count as isosceles: they have at least 2 equal sides */
    has = (id) =>
      SHAPES[id].sides === property ||
      SHAPES[id].angles === property ||
      (property === "isosceles" && SHAPES[id].sides === "equilateral"),
    right = pick(TRIANGLE_IDS.filter(has)),
    wrongs = shuffle(TRIANGLE_IDS.filter((id) => !has(id))).slice(0, 2);
  return {
    ...mcOf([
      [shapeFig(right), null],
      ...wrongs.map((id) => [
        shapeFig(id),
        `That one is ${SIDE_KINDS.includes(property) ? SHAPES[id].sides : SHAPES[id].angles}. ${NOT_KIND[property]}`,
      ]),
    ]),
    facts: { t: "pickTriangle", property },
    prompt: `Which is ${/^[aeiou]/.test(property) ? "an" : "a"} ${property} triangle?`,
    hint: `A ${property} triangle has ${RULE[property]}.`,
    explain: `${cap(aName(right))}. ${NOT_KIND[property]}`,
  };
}

/* ---------- Quad Corner: quadrilaterals (Lesson 3) ---------- */
/* what a quadrilateral can have: [id, the words for it, which shapes have it] */
const QUAD_FACTS = [
  ["parallel2", "2 pairs of parallel sides", (s) => s.parallel === 2],
  ["parallel1", "exactly 1 pair of parallel sides", (s) => s.parallel === 1],
  ["parallel0", "no parallel sides", (s) => s.parallel === 0],
  ["rights4", "4 right angles", (s) => s.rights.length === 4],
  ["equal4", "4 equal sides", (s) => s.ticks.every((t) => t && t === s.ticks[0])],
];
function genQuads() {
  const variant = R(0, 2);
  if (variant === 0 || variant === 1) {
    /* count parallel pairs, or right angles, on a shape that has some (shapes with none come up in the picture choices) */
    const parallel = variant === 0,
      id = pick(QUAD_IDS.filter((q) => (parallel ? SHAPES[q].parallel : SHAPES[q].rights.length) > 0)),
      answer = parallel ? SHAPES[id].parallel : SHAPES[id].rights.length;
    return {
      kind: "num",
      unit: parallel ? "pairs" : "right angles",
      answer,
      facts: { t: parallel ? "parallel" : "rights", id },
      prompt: parallel
        ? `How many pairs of parallel sides does this ${SHAPES[id].name} have?`
        : `How many right angles does this ${SHAPES[id].name} have?`,
      fig: () => shapeFig(id),
      misc: miscOf(
        answer,
        parallel
          ? [
              [4, "That counts sides, not pairs. Parallel sides come in pairs: each pair is 2 sides that never meet."],
              [
                answer === 2 ? 1 : 2,
                answer === 2
                  ? "Both pairs of opposite sides are parallel."
                  : "Not every pair of opposite sides is parallel here. Check each pair: do they go the same way?",
              ],
            ]
          : [
              [
                answer === 4 ? 0 : 4,
                answer === 4 ? "Every corner has a right-angle box." : "Count the right-angle boxes only.",
              ],
            ],
      ).filter(([wrong]) => wrong !== answer && wrong >= 0),
      hint: parallel
        ? "Look at each pair of opposite sides. Do they go the same way, so they’d never meet?"
        : "Count the corners with a right-angle box.",
      explain: parallel
        ? `A ${SHAPES[id].name} has ${answer} pair${answer === 1 ? "" : "s"} of parallel sides.`
        : `A ${SHAPES[id].name} has ${answer} right angle${answer === 1 ? "" : "s"}.`,
    };
  }
  /* pick the shape that has something: one that does, two that don't */
  let fact, right, wrongs;
  do {
    fact = pick(QUAD_FACTS);
    const [, , has] = fact,
      yes = QUAD_IDS.filter((id) => has(SHAPES[id])),
      no = QUAD_IDS.filter((id) => !has(SHAPES[id]));
    right = pick(yes);
    wrongs = shuffle(no).slice(0, 2);
  } while (wrongs.length < 2);
  const [factId, words] = fact;
  return {
    ...mcOf([
      [shapeFig(right), null],
      ...wrongs.map((id) => [shapeFig(id), `That’s ${aName(id)}. It doesn’t have ${words}.`]),
    ]),
    facts: { t: "pickQuad", fact: factId },
    prompt: `Which shape has ${words}?`,
    hint: `Look at the marks: right-angle boxes, tick marks for equal sides, and opposite sides that go the same way.`,
    explain: `${cap(aName(right))} has ${words}.`,
  };
}

/* ---------- Mirror Hall: lines of symmetry (Lessons 4–5) ---------- */
const FOLD_WAYS = ["up", "across", "corner"];
function genSymmetry() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* count the lines of symmetry of a shape that has some (shapes with none come up in the fold questions) */
    const id = pick(SHAPE_IDS.filter((s) => SHAPES[s].sym.length > 0)),
      answer = SHAPES[id].sym.length;
    return {
      kind: "num",
      unit: "lines",
      answer,
      facts: { t: "count", id },
      prompt: `How many lines of symmetry does this ${SHAPES[id].name} have?`,
      fig: (show) => shapeFig(id, { sym: show }),
      misc: miscOf(answer, [
        ...(id === "square" ? [[2, "Up and down and across work. The two corner-to-corner lines work too."]] : []),
        ...(["rectangle", "rhombus"].includes(id)
          ? [[4, `Only 2 folds make the halves of ${aName(id)} match. Try the other 2 and see.`]]
          : []),
        ...(id === "parallelogram"
          ? [[2, "Fold a parallelogram up and down or corner to corner: the halves don’t line up."]]
          : []),
      ]).filter(([wrong]) => wrong !== answer),
      hint: "Picture folding it up and down, across, and corner to corner. Which folds make the halves match?",
      explain: answer
        ? `${cap(aName(id))} has ${answer} line${answer > 1 ? "s" : ""} of symmetry.`
        : `${cap(aName(id))} has no lines of symmetry.`,
    };
  }
  if (variant === 1) {
    /* is this fold a line of symmetry? */
    const id = pick(SHAPE_IDS),
      way = pick(FOLD_WAYS),
      [a, b] = foldLine(SHAPES[id].pts, way),
      yes = isSymmetryLine(SHAPES[id].pts, a, b);
    return {
      ...mcOf([
        ["Yes", yes ? null : "Fold on that line and the halves don’t land on each other."],
        ["No", yes ? "Fold on that line: the halves match exactly." : null],
      ]),
      facts: { t: "isLine", id, way },
      prompt: `Is the dashed line a line of symmetry of this ${SHAPES[id].name}?`,
      fig: (show) =>
        shapeFig(id, {
          ticks: false,
          rights: false,
          lines: [[...a, ...b].map((v) => +v.toFixed(1))],
          ghost: show ? SHAPES[id].pts.map((p) => reflect(p, a, b)) : null,
          label: `${cap(aName(id))} with a dashed line`,
        }),
      hint: "Picture folding on the dashed line. Does each corner land on another corner?",
      explain: yes
        ? "Folded on the line, the shape lands right on itself: it’s a line of symmetry."
        : "Folded on the line, the halves don’t match, so it isn’t a line of symmetry.",
    };
  }
  /* which dashed line is a line of symmetry: one is, the other two aren't */
  let id, folds;
  do {
    id = pick(SHAPE_IDS);
    const lines = [
        ...FOLD_WAYS.map((way) => foldLine(SHAPES[id].pts, way)),
        ...(SHAPES[id].pts.length === 4 ? [[SHAPES[id].pts[1], SHAPES[id].pts[3]]] : []),
      ],
      yes = lines.filter(([a, b]) => isSymmetryLine(SHAPES[id].pts, a, b)),
      no = lines.filter(([a, b]) => !isSymmetryLine(SHAPES[id].pts, a, b));
    folds = yes.length && no.length >= 2 ? [pick(yes), ...shuffle(no).slice(0, 2)] : null;
  } while (!folds);
  const draw = ([a, b]) =>
    shapeFig(id, {
      ticks: false,
      rights: false,
      lines: [[...a, ...b].map((v) => +v.toFixed(1))],
      label: `${cap(aName(id))} with a dashed line`,
    });
  return {
    ...mcOf(folds.map((fold, i) => [draw(fold), i === 0 ? null : "Fold on that line and the halves don’t match."])),
    facts: { t: "pickLine", id },
    prompt: `Which dashed line is a line of symmetry of the ${SHAPES[id].name}?`,
    hint: "Picture folding on each line. On a line of symmetry, the halves land on each other.",
    explain: `Only one of the folds makes the two halves of the ${SHAPES[id].name} match.`,
  };
}

/* ---------- Measure Up: unknown lengths (Lessons 7–8) ---------- */
const EQUAL_SIDED = [
  ["square", 4],
  ["rhombus", 4],
  ["equilateral", 3],
];
function genLengths() {
  const variant = R(0, 3);
  if (variant === 0 || variant === 1) {
    /* a shape with equal sides: the perimeter from a side, or a side from the perimeter */
    const [id, count] = pick(EQUAL_SIDED),
      side = R(3, 15),
      perimeter = count * side,
      forward = variant === 0;
    return {
      kind: "num",
      unit: "cm",
      answer: forward ? perimeter : side,
      facts: forward ? { t: "perimeter", count, side } : { t: "side", count, perimeter },
      prompt: forward
        ? `One side of this ${SHAPES[id].name} is ${side} cm. What is its perimeter?`
        : `This ${SHAPES[id].name} has a perimeter of ${perimeter} cm. How long is each side?`,
      fig: () =>
        shapeFig(id, {
          sideText: [forward ? `${side} cm` : "?"],
          label: `${cap(aName(id))} with its equal sides marked`,
        }),
      misc: miscOf(
        forward ? perimeter : side,
        forward
          ? [
              [side * (count === 4 ? 3 : 4), `The ticks say there are ${count} equal sides: ${count} × ${side}.`],
              [side + count, `That adds ${count}. Multiply: ${count} sides of ${side} cm.`],
            ]
          : [
              [perimeter / 2, `That splits the perimeter into 2. There are ${count} equal sides: divide by ${count}.`],
              [perimeter - count, `That subtracts ${count}. Divide the perimeter into ${count} equal sides.`],
            ],
      ).filter(([wrong]) => wrong !== (forward ? perimeter : side) && Number.isInteger(wrong)),
      hint: `The tick marks say all ${count} sides are equal.`,
      explain: forward ? `${count} × ${side} = ${perimeter} cm.` : `${perimeter} ÷ ${count} = ${side} cm.`,
    };
  }
  if (variant === 2) {
    /* a rectangle's missing side from its perimeter */
    let len, wid;
    do {
      len = R(5, 15);
      wid = R(2, 12);
    } while (wid >= len);
    const perimeter = 2 * (len + wid);
    return {
      kind: "num",
      unit: "cm",
      answer: wid,
      facts: { t: "rectangle", perimeter, len },
      prompt: `This rectangle has a perimeter of ${perimeter} cm. It is ${len} cm long. How wide is it?`,
      fig: () =>
        shapeFig("rectangle", {
          sideText: [`${len} cm`, "?", null, null],
          label: "A rectangle with one side marked and one side ?",
        }),
      misc: miscOf(wid, [
        [
          perimeter - len,
          `That takes ${len} from all ${perimeter}. Opposite sides are equal: there are 2 lengths and 2 widths.`,
        ],
        [perimeter - 2 * len, `That’s both widths together. Each width is half of it.`],
      ]).filter(([wrong]) => wrong !== wid),
      hint: `Opposite sides of a rectangle are equal. Half the perimeter is one length and one width.`,
      explain: `${perimeter} ÷ 2 = ${perimeter / 2}, and ${perimeter / 2} − ${len} = ${wid} cm.`,
    };
  }
  /* an L-shaped figure with one side missing */
  let wide, tall, cutWide, cutTall;
  do {
    wide = R(7, 12);
    tall = R(6, 10);
    cutWide = R(3, wide - 2);
    cutTall = R(2, tall - 2);
  } while (wide - cutWide === cutWide || tall - cutTall === cutTall);
  /* the sides from the top left, clockwise: top, inner up-down, inner across, right, bottom, left */
  const sides = [wide - cutWide, cutTall, cutWide, tall - cutTall, wide, tall],
    ask = pick([1, 2, 4, 5]),
    /* what to show: the sides that find the asked one, and the others left blank */
    shown = { 1: [3, 5], 2: [0, 4], 4: [0, 2], 5: [1, 3] }[ask],
    sideText = sides.map((v, i) => (i === ask ? "?" : shown.includes(i) ? `${v} cm` : null)),
    [first, second] = shown.map((i) => sides[i]),
    adds = ask === 4 || ask === 5;
  return {
    kind: "num",
    unit: "cm",
    answer: sides[ask],
    facts: { t: "lShape", sides, ask, shown },
    prompt: `What is the length of the side marked ?`,
    fig: () => lShape(wide, tall, cutWide, cutTall, sideText, "An L-shaped figure with one side marked ?"),
    misc: miscOf(sides[ask], [
      adds
        ? [Math.abs(first - second), `That subtracts. The ? side goes as far as the other two together: add.`]
        : [
            first + second,
            `That adds. The ? side and the ${Math.min(first, second)} cm side together go as far as the ${Math.max(first, second)} cm side: subtract.`,
          ],
    ]).filter(([wrong]) => wrong !== sides[ask] && wrong > 0),
    hint:
      ask === 2 || ask === 4
        ? "Compare the sides that go across: top and bottom."
        : "Compare the sides that go up and down: left and right.",
    explain: adds
      ? `${first} + ${second} = ${sides[ask]} cm.`
      : `${Math.max(first, second)} − ${Math.min(first, second)} = ${sides[ask]} cm.`,
  };
}

/* ---------- Grand Gallery: the final round ---------- */
const genBoss = () => pick([genTriangles, genQuads, genSymmetry, genLengths])();

const ZONES = [
  {
    id: "triangles",
    name: "Triangle Lab",
    lessons: "Lessons 1–2",
    blurb: "Name triangles by their sides and by their angles.",
    gen: genTriangles,
  },
  {
    id: "quads",
    name: "Quad Corner",
    lessons: "Lesson 3",
    blurb: "Count parallel sides and right angles, and find the shape that has what’s asked.",
    gen: genQuads,
  },
  {
    id: "symmetry",
    name: "Mirror Hall",
    lessons: "Lessons 4–5",
    blurb: "Count lines of symmetry, and test folds.",
    gen: genSymmetry,
  },
  {
    id: "lengths",
    name: "Measure Up",
    lessons: "Lessons 7–8",
    blurb: "Use equal sides and right angles to find perimeters and missing sides.",
    gen: genLengths,
  },
  {
    id: "boss",
    name: "Grand Gallery",
    lessons: "All lessons",
    blurb: "Open the gallery! Every right answer hangs one of 10 pictures.",
    gen: genBoss,
  },
];

/* the gallery wall: 10 frames, `lit` of them with pictures hung (the boss icon fills all of them) */
const gallery = (lit) =>
  range(10)
    .map((i) => {
      const x = 4 + (i % 5) * 12,
        y = i < 5 ? 14 : 36,
        shapes = [
          '<polygon points="5,2 9,9 1,9" fill="#7fe3ff"/>',
          '<rect x="2" y="3" width="6" height="6" fill="#ffc93c"/>',
          '<circle cx="5" cy="6" r="3" fill="#ff8ac4"/>',
        ];
      return (
        `<rect x="${x}" y="${y}" width="10" height="12" fill="${i < lit ? "#0a2340" : "rgba(255,255,255,.08)"}" stroke="#c98a4b" stroke-width="1.5"/>` +
        (i < lit ? `<g transform="translate(${x},${y + 1})">${shapes[i % 3]}</g>` : "")
      );
    })
    .join("") + '<path d="M2,56H62" stroke="#f3f6fb" stroke-width="2"/>';
const ICON = {
  triangles:
    '<polygon points="32,8 58,54 6,54" fill="rgba(127,227,255,.25)" stroke="#7fe3ff" stroke-width="2.5"/><path d="M16,28L22,32M42,32L48,28" stroke="#ffc93c" stroke-width="2.5"/>',
  quads:
    '<polygon points="18,14 58,14 46,50 6,50" fill="rgba(127,227,255,.25)" stroke="#7fe3ff" stroke-width="2.5"/><path d="M36,10V18M26,46V54" stroke="#ffc93c" stroke-width="2.5"/>',
  symmetry:
    '<polygon points="32,6 54,30 32,58 10,30" fill="rgba(127,227,255,.25)" stroke="#7fe3ff" stroke-width="2.5"/><path d="M32,2V62" stroke="#ff8ac4" stroke-width="2.5" stroke-dasharray="5 4"/>',
  lengths:
    '<polygon points="8,10 30,10 30,32 56,32 56,54 8,54" fill="rgba(127,227,255,.25)" stroke="#7fe3ff" stroke-width="2.5"/><text x="43" y="27" fill="#ffc93c" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">?</text>',
  boss: gallery(10),
};
