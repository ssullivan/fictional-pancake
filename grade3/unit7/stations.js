/* Playground Planners (Grade 3 Unit 7): the problem generators, station list, and icons. Loaded by index.html and by
   tools/fuzz.mjs. Polygons with whole-number sides (POLYS), their facts (sideLengths, rightCorners, quadKind), polygons drawn
   alone or side by side (polyFig, polyRow), and shapes of unit squares on a grid (gridFig, gridRow, boundary, perimeterOf)
   come from figs.js; rectangles with their side lengths (rectFig), L-shaped figures (lFig), and shape names (SHAPE_NAME) from
   shared/shapes.js; mcOf and miscOf from shared/util.js. Each generator deals one of a few kinds of problem (variant), each
   with a comment saying what it asks. Every problem also carries facts for checks.js: its kind (t) and the shapes and numbers
   it was made from, so the answer can be worked out again. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* n and the word for it: "1 right angle", "3 right angles" (plural: the word for more than one) */
const pl = (n, word, plural = word + "s") => `${n} ${n === 1 ? word : plural}`;
/* the units side lengths are in: the short form written on a picture, and the word */
const UNITS = { cm: "centimeters", m: "meters", in: "inches", ft: "feet" };
/* the named mistakes that apply to these numbers: a wrong value equal to the answer, or not above 0, is left out */
const namedMisc = (answer, list) =>
  miscOf(
    answer,
    list.filter(([value]) => value > 0 && value !== answer),
  );
/* a polygon's side lengths to write on it: ["10", "8", …] (the question says the unit) */
const lensOf = (pts) => sideLengths(pts).map(String);
/* a tap problem's messages for the wrong shapes: why(i) says why shape i isn't the answer */
const tapWhy = (count, answer, why) =>
  Object.fromEntries(
    range(count)
      .filter((i) => i !== answer)
      .map((i) => [String(i), why(i)]),
  );
/* the letter a shape gets in a row of them, and where a shape to tap is in its row */
const letter = (i) => "ABCD"[i];
const place = (i) => ["The first shape", "The second shape", "The third shape"][i];
/* is this item the name of a shape that isn't a polygon (in ODD)? */
const isOddName = (item) => typeof item === "string" && item in ODD;
/* do all of a polygon's sides have the same length? */
const allSidesSame = (pts) => new Set(sideLengths(pts)).size === 1;

/* ---------- Shape Sorter: sides, right angles, and what makes a quadrilateral (Lessons 1–3) ---------- */
/* triangles with and without a right angle */
const RIGHT_TRIANGLES = ["rightTri", "rightTri2"];
const OTHER_TRIANGLES = ["isoTri", "isoTri2", "equiTri", "scaleneTri"];
/* quadrilaterals by kind (POLYS ids) */
const QUAD_IDS = {
  square: ["square", "tiltedSquare"],
  rectangle: ["rectangle", "tallRectangle", "tiltedRectangle"],
  rhombus: ["rhombus", "wideRhombus", "leanRhombus"],
  other: ["parallelogram", "trapezoid", "rightTrapezoid", "kite", "oddQuad"],
};
const ALL_QUADS = Object.values(QUAD_IDS).flat();
/* the kite is drawn alone: it's so much bigger than the rest that they'd look tiny beside it */
const ROW_QUADS = ALL_QUADS.filter((id) => id !== "kite"),
  ROW_OTHER = QUAD_IDS.other.filter((id) => id !== "kite");
/* shapes whose right angles are easy to see (their sides go across and up and down), for counting right angles */
const RIGHT_ANGLED = [
  "rightTri",
  "rightTri2",
  "square",
  "rectangle",
  "tallRectangle",
  "rightTrapezoid",
  "house",
  "pentagon",
];
/* shapes with every side the same length, and shapes without */
const EQUAL_SIDED = ["equiTri", "rhombus", "wideRhombus", "leanRhombus", "square", "tiltedSquare"];
const UNEQUAL_SIDED = [
  "isoTri",
  "rightTri2",
  "parallelogram",
  "rectangle",
  "tallRectangle",
  "trapezoid",
  "oddQuad",
  "house",
];
/* why each shape that isn't a quadrilateral isn't one: an open shape, a curved one, or POLYS with 3, 5, or 6 sides */
const NOT_QUADS = ["open", "curved", "isoTri", "rightTri", "house", "pentagon", "lHexagon"];
const notQuadWhy = (item) =>
  item === "open"
    ? "Its sides don’t all meet: it isn’t closed. A quadrilateral is a closed shape."
    : item === "curved"
      ? "One side is curved. A quadrilateral has 4 straight sides."
      : `That’s a ${SHAPE_NAME[POLYS[item].length]}: it has ${POLYS[item].length} sides.`;
/* what each statement in "what do they have in common?" says, and whether it's true of a shape */
const COMMON = {
  right: { says: "They all have a right angle.", fits: (pts) => rightCorners(pts).length > 0 },
  four: { says: "They all have 4 sides.", fits: (pts) => pts.length === 4 },
  equal: { says: "All their sides are the same length.", fits: allSidesSame },
};
/* why statement `prop` isn't true of shape i (its letter) */
const COMMON_WHY = {
  right: (i) => `Shape ${letter(i)} has no right angle.`,
  four: (i, pts) => `Shape ${letter(i)} has ${pts.length} sides.`,
  equal: (i) => `Shape ${letter(i)}’s sides aren’t all the same length.`,
};
function genShapes() {
  const variant = R(0, 4);
  if (variant === 0) {
    /* how many right angles? */
    const pts = POLYS[pick(RIGHT_ANGLED)],
      rights = rightCorners(pts).length,
      corners = pts.length;
    return {
      kind: "num",
      unit: "right angles",
      answer: rights,
      facts: { t: "rights", pts },
      prompt: "How many right angles does this shape have?",
      fig: (show) => polyFig(pts, { sq: show }),
      misc: namedMisc(rights, [
        [corners, "That counts every corner. A right angle is a square corner, like the corner of a page."],
        [corners - rights, "That counts the corners that aren’t square. Count the square corners."],
      ]),
      hint: "A right angle is a square corner, like the corner of a sheet of paper. Check each corner.",
      explain: `The little squares mark the right angles: ${rights} of its ${corners} corners are square corners.`,
    };
  }
  if (variant === 1) {
    /* tap the shape with a right angle, with none, or with exactly 2 */
    const ask = pick(["triangle", "none", "two"]),
      [answerId, otherIds] =
        ask === "triangle"
          ? [pick(RIGHT_TRIANGLES), shuffle(OTHER_TRIANGLES).slice(0, 2)]
          : ask === "none"
            ? [
                pick([...QUAD_IDS.rhombus, "parallelogram", "trapezoid", "oddQuad"]),
                shuffle(["square", "rectangle", "tallRectangle", "rightTrapezoid"]).slice(0, 2),
              ]
            : [
                "rightTrapezoid",
                [pick(["square", "rectangle", "tallRectangle"]), pick(["parallelogram", "trapezoid", "oddQuad"])],
              ],
      ids = shuffle([answerId, ...otherIds]),
      at = ids.indexOf(answerId),
      rights = ids.map((id) => rightCorners(POLYS[id]).length);
    return {
      kind: "tap",
      answer: String(at),
      why: tapWhy(3, at, (i) => `That shape has ${rights[i] ? pl(rights[i], "right angle") : "no right angles"}.`),
      facts: { t: "tapRights", shapes: ids.map((id) => POLYS[id]), ask },
      prompt: {
        triangle: "Tap the <b>triangle with a right angle</b>.",
        none: "Tap the <b>quadrilateral with no right angles</b>.",
        two: "Tap the <b>quadrilateral with exactly 2 right angles</b>.",
      }[ask],
      fig: (show) =>
        polyRow(
          ids.map((id) => [POLYS[id], { sq: show }]),
          { tap: "Shape" },
        ),
      hint: "A right angle is a square corner. Check each corner of each shape.",
      explain: `${place(at)} has ${rights[at] ? pl(rights[at], "right angle") : "no right angles"}.`,
    };
  }
  if (variant === 2) {
    /* tap the quadrilateral, or the one shape that isn't a quadrilateral */
    const findQuad = Math.random() < 0.5,
      quads = shuffle([...ROW_QUADS, "dart"]).slice(0, findQuad ? 1 : 2),
      others = shuffle(NOT_QUADS).slice(0, findQuad ? 2 : 1),
      items = shuffle([...quads, ...others]),
      at = items.indexOf(findQuad ? quads[0] : others[0]),
      isQuad = (item) => quads.includes(item);
    return {
      kind: "tap",
      answer: String(at),
      why: tapWhy(3, at, (i) =>
        isQuad(items[i]) ? "That one is a quadrilateral: it’s closed, with 4 straight sides." : notQuadWhy(items[i]),
      ),
      facts: { t: "tapQuad", items: items.map((item) => (isOddName(item) ? item : POLYS[item])), findQuad },
      prompt: findQuad ? "Tap the <b>quadrilateral</b>." : "Tap the shape that is <b>not</b> a quadrilateral.",
      fig: () =>
        polyRow(
          items.map((item) => (isOddName(item) ? item : [POLYS[item]])),
          { tap: "Shape" },
        ),
      hint: "A quadrilateral is a closed shape with exactly 4 straight sides.",
      explain: findQuad
        ? `${place(at)} is closed and has 4 straight sides, so it’s a quadrilateral.`
        : `${place(at)} isn’t a quadrilateral. ${notQuadWhy(items[at])}`,
    };
  }
  if (variant === 3) {
    /* tap the shape whose sides are all the same length */
    const answerId = pick(EQUAL_SIDED),
      ids = shuffle([answerId, ...shuffle(UNEQUAL_SIDED).slice(0, 2)]),
      at = ids.indexOf(answerId),
      lens = ids.map((id) => lensOf(POLYS[id]));
    return {
      kind: "tap",
      answer: String(at),
      why: tapWhy(3, at, (i) => `Its sides are ${lens[i].join(", ")}: not all the same.`),
      facts: { t: "tapEqual", shapes: ids.map((id) => POLYS[id]) },
      prompt: "Tap the shape whose <b>sides are all the same length</b>.",
      fig: () =>
        polyRow(
          ids.map((id, i) => [POLYS[id], { lens: lens[i] }]),
          { tap: "Shape" },
        ),
      hint: "Read the side lengths of each shape. Are they all the same?",
      explain: `Every side of ${place(at).toLowerCase()} is ${lens[at][0]}.`,
    };
  }
  /* what do these three shapes have in common? */
  const prop = pick(["right", "four", "equal"]),
    pool = { right: RIGHT_ANGLED, four: ROW_QUADS, equal: EQUAL_SIDED }[prop];
  let ids;
  /* the other two statements must each be false for at least one of the shapes */
  do ids = shuffle(pool).slice(0, 3);
  while (Object.keys(COMMON).some((other) => other !== prop && ids.every((id) => COMMON[other].fits(POLYS[id]))));
  const wrongs = Object.keys(COMMON).filter((other) => other !== prop);
  return {
    ...mcOf([
      [COMMON[prop].says, null],
      ...wrongs.map((other) => {
        const i = ids.findIndex((id) => !COMMON[other].fits(POLYS[id]));
        return [COMMON[other].says, COMMON_WHY[other](i, POLYS[ids[i]])];
      }),
    ]),
    stack: true,
    facts: { t: "common", shapes: ids.map((id) => POLYS[id]), says: COMMON[prop].says },
    prompt: "What is true about all three shapes?",
    fig: () =>
      polyRow(
        ids.map((id) => [POLYS[id], { sq: true, lens: lensOf(POLYS[id]) }]),
        { letters: true },
      ),
    hint: "Check each statement against every shape: its sides, its side lengths, and its right angles (the little squares).",
    explain: `${COMMON[prop].says} Each of the other statements leaves out a shape.`,
  };
}

/* ---------- Kite Corner: rhombuses, rectangles, squares, and other quadrilaterals (Lessons 4–5) ---------- */
/* a quadrilateral of one kind: its POLYS id */
const quadOf = (kind) => pick(QUAD_IDS[kind]);
/* how a quadrilateral of each kind is described, for the wrong shapes in a tap problem */
const KIND_WHY = {
  square: "That’s a square: 4 sides the same length and 4 right angles.",
  rhombus: "That’s a rhombus: its sides are all the same length, but it has no right angles.",
  rectangle: "That’s a rectangle: it has 4 right angles, but its sides aren’t all the same length.",
  other: "Its sides aren’t all the same length, and it doesn’t have 4 right angles.",
};
/* what makes a shape of each kind that kind, for the worked answer */
const KIND_HAS = {
  square: "It has 4 sides the same length and 4 right angles.",
  rhombus: "Its 4 sides are all the same length.",
  rectangle: "It has 4 right angles.",
};
/* the choices for "a rhombus, a rectangle, both, or neither?" */
const KIND_CHOICE = {
  rhombus: "A rhombus, not a rectangle",
  rectangle: "A rectangle, not a rhombus",
  square: "Both: it’s a square",
  other: "Neither",
};
/* statements about quadrilaterals: [statement, true or false, why] */
const TRUE_FALSE = [
  ["Every square is a rectangle.", true, "A square has 4 right angles, so it’s a rectangle too."],
  ["Every square is a rhombus.", true, "A square has 4 sides the same length, so it’s a rhombus too."],
  ["Every rectangle is a square.", false, "A rectangle can have two long sides and two short sides."],
  ["Every rhombus is a square.", false, "A rhombus doesn’t need right angles."],
  ["Every rhombus is a quadrilateral.", true, "A rhombus is closed and has 4 straight sides."],
  ["Every quadrilateral is a rectangle.", false, "A quadrilateral doesn’t need right angles."],
  ["A rectangle always has 4 right angles.", true, "That’s what makes it a rectangle."],
  ["A rhombus always has 4 right angles.", false, "A rhombus can lean over, with no right angles."],
  ["All 4 sides of a rhombus are the same length.", true, "That’s what makes it a rhombus."],
  [
    "All 4 sides of a rectangle are always the same length.",
    false,
    "Only a square’s are. Most rectangles have two lengths.",
  ],
];
/* reasons a quadrilateral isn't a rectangle or a square */
const REASONS = {
  rights: "It doesn’t have 4 right angles.",
  sides: "Its sides aren’t all the same length.",
  four: "It doesn’t have 4 sides.",
};
function genQuads() {
  const variant = R(0, 4);
  if (variant === 0) {
    /* a rhombus, a rectangle, both, or neither? */
    const kind = pick(["square", "rhombus", "rectangle", "other"]),
      pts = POLYS[quadOf(kind)],
      lens = lensOf(pts),
      rights = rightCorners(pts).length,
      equal = allSidesSame(pts),
      /* why each wrong choice is wrong */
      why = {
        rhombus: equal
          ? "It is a rhombus, and it has 4 right angles too: it’s a square."
          : "Its sides aren’t all the same length, so it isn’t a rhombus.",
        rectangle:
          rights === 4
            ? "It is a rectangle, and its sides are all the same length too: it’s a square."
            : `It has ${rights ? pl(rights, "right angle") : "no right angles"}, not 4, so it isn’t a rectangle.`,
        square: !equal
          ? "A square’s sides are all the same length. These aren’t."
          : `A square has 4 right angles. This shape has ${rights ? rights : "none"}.`,
        other: equal
          ? "Its 4 sides are all the same length: it’s a rhombus."
          : "It has 4 right angles: it’s a rectangle.",
      };
    return {
      ...mcOf(["rhombus", "rectangle", "square", "other"].map((k) => [KIND_CHOICE[k], k === kind ? null : why[k]])),
      stack: true,
      facts: { t: "quadKind", pts },
      prompt: "Is this shape a rhombus, a rectangle, both, or neither?",
      fig: () => polyFig(pts, { sq: true, lens }),
      hint: "A rhombus has 4 sides the same length. A rectangle has 4 right angles. A square has both.",
      explain: {
        square: "Its 4 sides are the same length and it has 4 right angles: it’s a rhombus and a rectangle, a square.",
        rhombus: "Its 4 sides are the same length, but it has no right angles: it’s a rhombus.",
        rectangle: "It has 4 right angles, but its sides aren’t all the same length: it’s a rectangle.",
        other: "Its sides aren’t all the same length, and it doesn’t have 4 right angles: it’s neither.",
      }[kind],
    };
  }
  if (variant === 1 || variant === 3) {
    /* tap the square, rhombus, or rectangle (variant 1), or the quadrilateral that's none of them (variant 3) */
    const target = variant === 3 ? "other" : pick(["square", "rhombus", "rectangle"]),
      others = {
        square: ["rhombus", "rectangle"],
        rhombus: ["rectangle", "other"],
        rectangle: ["rhombus", "other"],
        other: shuffle(["square", "rhombus", "rectangle"]).slice(0, 2),
      }[target],
      kinds = shuffle([target, ...others]),
      ids = kinds.map((kind) => (kind === "other" ? pick(ROW_OTHER) : quadOf(kind))),
      at = kinds.indexOf(target);
    return {
      kind: "tap",
      answer: String(at),
      why: tapWhy(3, at, (i) => KIND_WHY[kinds[i]]),
      facts: { t: "tapKind", shapes: ids.map((id) => POLYS[id]), target },
      prompt:
        target === "other"
          ? "Tap the quadrilateral that is <b>not</b> a rhombus, a rectangle, or a square."
          : `Tap the <b>${target}</b>.`,
      fig: () =>
        polyRow(
          ids.map((id) => [POLYS[id], { sq: true, lens: lensOf(POLYS[id]) }]),
          { tap: "Shape" },
        ),
      hint: "A rhombus has 4 sides the same length. A rectangle has 4 right angles. A square has both.",
      explain:
        target === "other"
          ? `${place(at)}’s sides aren’t all the same length, and it doesn’t have 4 right angles.`
          : `${place(at)} is the ${target}. ${KIND_HAS[target]}`,
    };
  }
  if (variant === 2) {
    /* true or false? */
    const [statement, truth, because] = pick(TRUE_FALSE);
    return {
      ...mcOf([
        ["True", truth ? null : `It’s false. ${because}`],
        ["False", truth ? `It’s true. ${because}` : null],
      ]),
      facts: { t: "trueFalse", statement },
      prompt: `True or false? ${statement}`,
      hint: "A rhombus has 4 sides the same length. A rectangle has 4 right angles. A square has both.",
      explain: `${truth ? "True" : "False"}. ${because}`,
    };
  }
  /* why isn't it a square (a rhombus or a rectangle) or a rectangle (another quadrilateral)? */
  const kind = pick(["rhombus", "rectangle", "other"]),
    pts = POLYS[quadOf(kind)],
    notA = kind === "other" ? "rectangle" : "square",
    reason = kind === "rectangle" ? "sides" : "rights",
    rights = rightCorners(pts).length;
  /* each wrong reason's message: "four" is never true; "sides" is false for a rhombus and beside the point for a rectangle;
     "rights" is false for a rectangle */
  return {
    ...mcOf(
      Object.keys(REASONS).map((key) => [
        REASONS[key],
        key === reason
          ? null
          : key === "four"
            ? "It does have 4 sides. Count them."
            : key === "sides"
              ? allSidesSame(pts)
                ? "Its sides are all the same length. Read them."
                : "That’s true, but a rectangle’s sides don’t need to be the same length."
              : "It does have 4 right angles: look for the little squares.",
      ]),
    ),
    stack: true,
    facts: { t: "whyNot", pts, notA },
    prompt: `Why is this shape <b>not</b> a ${notA}?`,
    fig: () => polyFig(pts, { sq: true, lens: lensOf(pts) }),
    hint:
      notA === "square"
        ? "A square has 4 sides the same length and 4 right angles. Which one is missing?"
        : "A rectangle has 4 right angles. Look for the little squares.",
    explain: `${REASONS[reason]} ${notA === "square" ? "A square needs 4 sides the same length and 4 right angles." : `It has ${rights ? pl(rights, "right angle") : "no right angles"}, and a rectangle needs 4.`}`,
  };
}

/* ---------- Chalk Trail: perimeter on a grid (Lessons 6–7) ---------- */
/* A shape made of unit squares ([col, row]): a rectangle `wide` × `tall`, sometimes with a corner cut away (an L), both top
   corners cut away (a T), or a notch cut from the middle of the top (a U). */
function gridShape() {
  const wide = R(3, 6),
    tall = R(2, 4),
    cut = R(0, 3),
    cutTall = R(1, tall - 1);
  let cells = range(tall).flatMap((r) => range(wide).map((c) => [c, r]));
  if (cut === 1) {
    const cutWide = R(1, wide - 2),
      onRight = Math.random() < 0.5;
    cells = cells.filter(([c, r]) => !(r < cutTall && (onRight ? c >= wide - cutWide : c < cutWide)));
  }
  if (cut === 2) {
    const cutWide = R(1, Math.floor((wide - 1) / 2));
    cells = cells.filter(([c, r]) => !(r < cutTall && (c < cutWide || c >= wide - cutWide)));
  }
  if (cut === 3) {
    const from = R(1, wide - 2),
      to = R(from, wide - 2);
    cells = cells.filter(([c, r]) => !(r < cutTall && c >= from && c <= to));
  }
  return cells;
}
/* the same shape as a key, to tell shapes apart */
const cellsKey = (cells) =>
  cells
    .map(([c, r]) => `${c},${r}`)
    .sort()
    .join(" ");
/* how many straight sides a shape of unit squares has: the places its outline turns */
const turnsOf = (cells) => {
  const outline = boundary(cells),
    way = ([x1, y1, x2, y2]) => `${x2 - x1},${y2 - y1}`;
  return outline.filter((edge, i) => way(edge) !== way(outline[(i + outline.length - 1) % outline.length])).length;
};
/* two different shapes with the same area (same: 'area') or the same perimeter (same: 'perimeter') */
function twoShapes(same) {
  const measure = same === "area" ? (cells) => cells.length : perimeterOf;
  /* both are dealt again until they match, since some shapes (the biggest rectangle) have no partner */
  let first, second;
  do {
    first = gridShape();
    second = gridShape();
  } while (measure(second) !== measure(first) || cellsKey(second) === cellsKey(first));
  return [first, second];
}
function genGrid() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* the perimeter of a shape on a grid */
    const cells = gridShape(),
      perimeter = perimeterOf(cells);
    return {
      kind: "num",
      unit: "units",
      answer: perimeter,
      facts: { t: "gridPerimeter", cells },
      prompt: "Each side of a square on the grid is 1 unit long. What is the perimeter of the shape?",
      fig: (show) => gridFig(cells, { walk: show ? perimeter : 0 }),
      misc: namedMisc(perimeter, [
        [
          cells.length,
          "That counts the squares inside: that’s the area. The perimeter is the length around the outside.",
        ],
        [turnsOf(cells), "That counts the shape’s sides. Count every unit length: a long side has several."],
      ]),
      hint: "Start at a corner. Count each unit length as you go all the way around the outside.",
      explain: `Going all the way around, there are ${perimeter} unit lengths. The perimeter is ${perimeter} units.`,
    };
  }
  if (variant === 1) {
    /* tap the shape with this perimeter, among three with different perimeters */
    let shapes, perimeters;
    do {
      shapes = [gridShape(), gridShape(), gridShape()];
      perimeters = shapes.map(perimeterOf);
    } while (new Set(perimeters).size < 3);
    const at = R(0, 2);
    return {
      kind: "tap",
      answer: String(at),
      why: tapWhy(3, at, (i) => `That shape’s perimeter is ${perimeters[i]} units.`),
      facts: { t: "tapPerimeter", shapes, perimeter: perimeters[at] },
      prompt: `Each side of a square is 1 unit. Tap the shape with a perimeter of <b>${perimeters[at]} units</b>.`,
      fig: () => gridRow(shapes, { tap: "Shape" }),
      hint: "Count the unit lengths all the way around each shape.",
      explain: `Going around ${place(at).toLowerCase()}, there are ${perimeters[at]} unit lengths.`,
    };
  }
  /* two shapes with the same area: which has the longer perimeter? Or the same perimeter: which has the bigger area? */
  const same = variant === 2 ? "area" : "perimeter",
    shapes = twoShapes(same),
    [areaA, areaB] = shapes.map((cells) => cells.length),
    [perimeterA, perimeterB] = shapes.map(perimeterOf),
    [a, b] = same === "area" ? [perimeterA, perimeterB] : [areaA, areaB],
    answer = a > b ? "A" : a < b ? "B" : "same",
    says = (x, y) =>
      same === "area"
        ? `Shape A’s perimeter is ${x} units, and shape B’s is ${y} units.`
        : `Shape A’s area is ${x} square units, and shape B’s is ${y} square units.`;
  return {
    ...mcOf([
      ["Shape A", answer === "A" ? null : says(a, b)],
      ["Shape B", answer === "B" ? null : says(a, b)],
      [
        same === "area" ? "Their perimeters are the same" : "Their areas are the same",
        answer === "same" ? null : says(a, b),
      ],
    ]),
    facts: { t: "compareGrid", shapes, same },
    prompt:
      same === "area"
        ? `Shapes A and B both have an area of ${areaA} square units. Which one has the <b>longer perimeter</b>?`
        : `Shapes A and B both have a perimeter of ${perimeterA} units. Which one has the <b>bigger area</b>?`,
    fig: () => gridRow(shapes, { letters: true }),
    hint:
      same === "area"
        ? "Count the unit lengths all the way around each shape."
        : "Count the squares inside each shape.",
    explain: `${says(a, b)} ${answer === "same" ? "They’re the same." : `Shape ${answer}’s is ${same === "area" ? "longer" : "bigger"}.`}`,
  };
}

/* ---------- Fence Line: find the perimeter, and a missing side (Lessons 8–9) ---------- */
/* polygons for adding up side lengths */
const FENCE_POLYS = [
  "rightTri",
  "isoTri",
  "equiTri",
  "scaleneTri",
  "parallelogram",
  "trapezoid",
  "rightTrapezoid",
  "kite",
  "oddQuad",
  "house",
  "pentagon",
  "lHexagon",
];
/* a polygon from FENCE_POLYS and how many times bigger to make its side lengths, so the perimeter is at most 60 and no side
   is over 24 */
function fencePoly() {
  const pts = POLYS[pick(FENCE_POLYS)],
    lengths = sideLengths(pts),
    total = lengths.reduce((sum, len) => sum + len, 0),
    times = pick([1, 2, 3].filter((k) => k === 1 || (total * k <= 60 && Math.max(...lengths) * k <= 24)));
  return { pts, times, lengths: lengths.map((len) => len * times) };
}
/* stories for a rectangle's perimeter: what goes around it, and the units; each returns its story's sentence */
const AROUND = [
  {
    unit: "m",
    tell: (name, l, w) =>
      `${name}’s garden is a rectangle ${l} meters long and ${w} meters wide. How many meters of fence go all the way around it?`,
  },
  {
    unit: "in",
    tell: (name, l, w) =>
      `A picture is ${l} inches long and ${w} inches wide. ${name} glues ribbon all the way around its edge. How many inches of ribbon is that?`,
  },
  {
    unit: "ft",
    tell: (name, l, w) =>
      `A bulletin board is ${l} feet long and ${w} feet wide. How many feet of border go all the way around it?`,
  },
  {
    unit: "m",
    tell: (name, l, w) =>
      `${name} walks all the way around a field ${l} meters long and ${w} meters wide. How many meters is that?`,
  },
];
function genFence() {
  const variant = R(0, 4),
    name = pick(KIDS),
    unit = pick(Object.keys(UNITS));
  if (variant === 0) {
    /* the perimeter of a polygon with every side's length written on it */
    const { pts, lengths } = fencePoly(),
      perimeter = lengths.reduce((sum, len) => sum + len, 0);
    return {
      kind: "num",
      unit: UNITS[unit],
      answer: perimeter,
      facts: { t: "addSides", lengths, pts },
      prompt: `What is the perimeter of this shape? The sides are in ${UNITS[unit]}.`,
      fig: () => polyFig(pts, { lens: lengths.map(String) }),
      misc: namedMisc(perimeter, [
        [perimeter - lengths[lengths.length - 1], "That leaves out a side. Add every side once."],
        [lengths.length, "That counts the sides. Add their lengths."],
      ]),
      hint: "The perimeter is the length all the way around. Add the lengths of all the sides.",
      explain: `${lengths.join(" + ")} = ${perimeter} ${UNITS[unit]}.`,
    };
  }
  if (variant === 1) {
    /* a rectangle with only its length and width written, or a square with one side written */
    const square = Math.random() < 0.35;
    let length, width;
    do {
      length = R(3, 12);
      width = square ? length : R(2, length - 1);
    } while (length * width === 2 * (length + width));
    const perimeter = 2 * (length + width);
    return {
      kind: "num",
      unit: UNITS[unit],
      answer: perimeter,
      facts: { t: "rectPerimeter", length, width, square },
      prompt: square
        ? `This square has a side of ${length} ${UNITS[unit]}. What is its perimeter?`
        : `What is the perimeter of this rectangle? The sides are in ${UNITS[unit]}.`,
      fig: () =>
        square
          ? polyFig(
              POLYS.square,
              { sq: true, lens: [`${length}`, null, null, null] },
              `A square with a side of ${length} ${unit}`,
            )
          : rectFig(length, width, { unit, grid: false }),
      misc: namedMisc(perimeter, [
        [
          length + width,
          square
            ? "That’s only two sides. A square has 4 sides, all the same length."
            : "That’s only one length and one width. A rectangle has 4 sides: two lengths and two widths.",
        ],
        [length * width, "That multiplies the sides: that’s the area. The perimeter adds all 4 sides."],
      ]),
      hint: square
        ? "All 4 sides of a square are the same length."
        : "The sides across from each other in a rectangle are the same length. Add all 4 sides.",
      explain: square
        ? `${length} + ${length} + ${length} + ${length} = ${perimeter} ${UNITS[unit]}, or 4 × ${length} = ${perimeter}.`
        : `${length} + ${width} + ${length} + ${width} = ${perimeter} ${UNITS[unit]}.`,
    };
  }
  if (variant === 2) {
    /* a polygon with one side marked ?, and its perimeter */
    const { pts, lengths } = fencePoly(),
      ask = R(0, lengths.length - 1),
      perimeter = lengths.reduce((sum, len) => sum + len, 0),
      known = lengths.filter((len, i) => i !== ask),
      knownSum = perimeter - lengths[ask];
    return {
      kind: "num",
      unit: UNITS[unit],
      answer: lengths[ask],
      facts: { t: "missingSide", lengths, ask, perimeter },
      prompt: `The perimeter of this shape is ${perimeter} ${UNITS[unit]}. How long is the side marked ?`,
      fig: () => polyFig(pts, { lens: lengths.map((len, i) => (i === ask ? "?" : `${len}`)) }),
      misc: namedMisc(lengths[ask], [
        [knownSum, "That adds the sides you know. Take that away from the perimeter."],
        [perimeter + knownSum, "That adds the perimeter too. Take the sides you know away from it."],
      ]),
      hint: "Add the sides you know. The side marked ? is the rest of the perimeter.",
      explain: `${known.join(" + ")} = ${knownSum}, and ${perimeter} − ${knownSum} = ${lengths[ask]} ${UNITS[unit]}.`,
    };
  }
  if (variant === 3) {
    /* a story: the perimeter of a rectangle */
    const story = pick(AROUND),
      length = R(4, 12),
      width = R(2, length - 1),
      perimeter = 2 * (length + width);
    return {
      kind: "num",
      unit: UNITS[story.unit],
      answer: perimeter,
      facts: { t: "rectPerimeter", length, width, square: false },
      prompt: story.tell(name, length, width),
      fig: () => rectFig(length, width, { unit: story.unit, grid: false }),
      misc: namedMisc(perimeter, [
        [length + width, "That’s only one length and one width. Go all the way around: 4 sides."],
        [length * width, "That’s the area, the space inside. This is the length around the edge."],
      ]),
      hint: "Picture the rectangle. Add all 4 sides: two lengths and two widths.",
      explain: `${length} + ${width} + ${length} + ${width} = ${perimeter} ${UNITS[story.unit]}.`,
    };
  }
  /* a story: a square's side, or a rectangle's width, from its perimeter */
  if (Math.random() < 0.5) {
    const side = R(2, 12),
      perimeter = 4 * side;
    return {
      kind: "num",
      unit: UNITS[unit],
      answer: side,
      facts: { t: "squareSide", perimeter },
      prompt: `${name} makes a square frame with a perimeter of ${perimeter} ${UNITS[unit]}. How long is each side?`,
      fig: (show) =>
        polyFig(
          POLYS.square,
          { sq: true, lens: [show ? `${side}` : "?", null, null, null] },
          "A square with a side marked ?",
        ),
      misc: namedMisc(side, [
        [perimeter / 2, "That’s two sides. A square has 4 sides the same length: divide by 4."],
        [perimeter - 4, "That takes away 4. Split the perimeter into 4 equal sides."],
      ]),
      hint: "A square has 4 sides, all the same length. What number times 4 is the perimeter?",
      explain: `${perimeter} ÷ 4 = ${side} ${UNITS[unit]}.`,
    };
  }
  const length = R(4, 10),
    width = R(2, length - 1),
    perimeter = 2 * (length + width);
  return {
    kind: "num",
    unit: UNITS[unit],
    answer: width,
    facts: { t: "rectWidth", length, perimeter },
    prompt: `A rectangle has a perimeter of ${perimeter} ${UNITS[unit]}. It is ${length} ${UNITS[unit]} long. How wide is it?`,
    fig: (show) => rectFig(length, width, { unit, grid: false, ask: show ? null : "width" }),
    misc: namedMisc(width, [
      [perimeter - length, "That takes away only one length. A rectangle has two."],
      [perimeter - 2 * length, "That’s both widths together. Each width is half of that."],
    ]),
    hint: "Take away the two lengths. What’s left is the two widths.",
    explain: `${perimeter} − ${length} − ${length} = ${2 * width}, and ${2 * width} ÷ 2 = ${width} ${UNITS[unit]}.`,
  };
}

/* ---------- Sandbox Plans: area or perimeter, and rectangles with the same perimeter or area (Lessons 10–12) ---------- */
/* situations, and whether they need the area or the perimeter */
const AREA_OR_PERIMETER = [
  ["NAME puts a fence around a garden. How much fence is needed?", "Perimeter"],
  ["NAME covers a floor with carpet. How much carpet is needed?", "Area"],
  ["NAME glues ribbon around the edge of a picture frame. How much ribbon is needed?", "Perimeter"],
  ["NAME paints a wall. How much of the wall gets painted?", "Area"],
  ["NAME puts a border around a bulletin board. How long is the border?", "Perimeter"],
  ["NAME plants grass on a patch of dirt. How much ground gets grass?", "Area"],
  ["NAME walks all the way around the edge of the playground. How far is that?", "Perimeter"],
  ["NAME covers a table with paper. How much paper is needed?", "Area"],
  ["NAME tiles a kitchen floor with square tiles. How many tiles are needed?", "Area"],
  ["NAME hangs lights along all the edges of a window. How long is the string of lights?", "Perimeter"],
];
/* areas whose rectangles (with sides up to 12) come in two or three shapes */
const SAME_AREAS = [12, 16, 18, 20, 24, 36];
/* a rectangle `rows` tall and `cols` long, as unit squares */
const rectCells = (rows, cols) => range(rows).flatMap((r) => range(cols).map((c) => [c, r]));
function genSandbox() {
  const variant = R(0, 3),
    name = pick(KIDS);
  if (variant === 0) {
    /* area or perimeter? */
    const [story, right] = pick(AREA_OR_PERIMETER);
    return {
      ...mcOf([
        ["Area", right === "Area" ? null : "Area is the space inside. This is about the length around the edge."],
        [
          "Perimeter",
          right === "Perimeter" ? null : "Perimeter is the length around the edge. This is about covering the inside.",
        ],
      ]),
      facts: { t: "areaOrPerimeter", story, right },
      prompt: `${story.replace("NAME", name)} Do you need the area or the perimeter?`,
      hint: "Area covers the inside. Perimeter goes around the outside.",
      explain:
        right === "Area"
          ? "It’s about covering the inside, so it’s the area."
          : "It’s about the length around the outside, so it’s the perimeter.",
    };
  }
  if (variant === 1) {
    /* a rectangle on a grid: its area or its perimeter */
    const ask = pick(["area", "perimeter"]);
    let length, width;
    do {
      length = R(3, 9);
      width = R(2, 7);
    } while (length * width === 2 * (length + width) || length * width > 50);
    const area = length * width,
      perimeter = 2 * (length + width),
      answer = ask === "area" ? area : perimeter;
    return {
      kind: "num",
      unit: ask === "area" ? "square units" : "units",
      answer,
      facts: { t: "rectMeasure", ask, length, width },
      prompt: `What is the <b>${ask}</b> of this rectangle? Each square is 1 square unit, and each side of a square is 1 unit.`,
      fig: () => rectFig(length, width),
      misc: namedMisc(
        answer,
        ask === "area"
          ? [[perimeter, "That’s the perimeter, the length around. The area is the squares inside."]]
          : [
              [area, "That’s the area, the squares inside. The perimeter is the length around."],
              [length + width, "That’s only two sides. Go all the way around."],
            ],
      ),
      hint: ask === "area" ? "Multiply the length by the width." : "Add all 4 sides: two lengths and two widths.",
      explain:
        ask === "area"
          ? `${length} × ${width} = ${area} square units.`
          : `${length} + ${width} + ${length} + ${width} = ${perimeter} units.`,
    };
  }
  /* rectangles with the same perimeter (which has the biggest or smallest area?) or the same area (which has the longest or
     shortest perimeter?) */
  const samePerimeter = variant === 2,
    most = Math.random() < 0.5;
  let rects;
  if (samePerimeter) {
    /* length + width is half the perimeter; three different widths, each no more than the length */
    const half = R(6, 10);
    rects = shuffle(range(Math.floor(half / 2)).map((i) => i + 1))
      .slice(0, 3)
      .map((width) => [width, half - width]);
  } else {
    const area = pick(SAME_AREAS);
    rects = shuffle(
      range(12)
        .map((i) => i + 1)
        .filter((width) => area % width === 0 && width <= area / width && area / width <= 12)
        .map((width) => [width, area / width]),
    );
  }
  const values = rects.map(([w, l]) => (samePerimeter ? w * l : 2 * (w + l))),
    best = values.indexOf(most ? Math.max(...values) : Math.min(...values)),
    what = samePerimeter
      ? most
        ? "biggest area"
        : "smallest area"
      : most
        ? "longest perimeter"
        : "shortest perimeter",
    describe = (i) =>
      `Rectangle ${letter(i)} is ${rects[i][0]} by ${rects[i][1]}: its ${samePerimeter ? `area is ${values[i]} square units` : `perimeter is ${values[i]} units`}.`;
  return {
    ...mcOf(rects.map((rect, i) => [`Rectangle ${letter(i)}`, i === best ? null : describe(i)])),
    facts: { t: samePerimeter ? "samePerimeter" : "sameArea", rects, most },
    prompt: samePerimeter
      ? `These rectangles all have a perimeter of ${2 * (rects[0][0] + rects[0][1])} units. Which one has the <b>${what}</b>?`
      : `These rectangles all have an area of ${rects[0][0] * rects[0][1]} square units. Which one has the <b>${what}</b>?`,
    fig: () =>
      gridRow(
        rects.map(([w, l]) => rectCells(w, l)),
        { letters: true, label: "Rectangle" },
      ),
    hint: samePerimeter
      ? "Find each rectangle’s area: length × width."
      : "Find each rectangle’s perimeter: add all 4 sides.",
    explain: `${describe(best)} That’s the ${what}.`,
  };
}

/* ---------- Design Studio: perimeter and area of designs (Lessons 13–15) ---------- */
/* what an L-shaped design is, and the units its sides are in */
const DESIGNS = [
  { what: "mural", unit: "ft", trim: "trim" },
  { what: "garden", unit: "m", trim: "fence" },
  { what: "rug", unit: "ft", trim: "fringe" },
  { what: "stage", unit: "m", trim: "rope" },
];
/* An L-shaped figure: a rectangle wide × tall with a corner cutWide × cutTall cut away, and which corner. Its sides, numbered
   as lFig numbers them: [inner, cutTall, cutWide, lower, wide, tall]. Never one whose perimeter is the same number as its area. */
function lDesign() {
  let wide, tall, cutWide, cutTall;
  do {
    wide = R(4, 10);
    tall = R(3, 8);
    cutWide = R(1, wide - 2);
    cutTall = R(1, tall - 2);
  } while (wide * tall > 80 || 2 * (wide + tall) === wide * tall - cutWide * cutTall);
  const inner = wide - cutWide,
    lower = tall - cutTall;
  return {
    wide,
    tall,
    cutWide,
    cutTall,
    corner: pick(["tr", "tl", "br", "bl"]),
    sides: [inner, cutTall, cutWide, lower, wide, tall],
    area: inner * tall + cutWide * lower,
    perimeter: 2 * (wide + tall),
  };
}
/* robot parts, for rectangles with a given area and perimeter */
const ROBOT_PARTS = ["body", "head", "arm", "leg", "screen", "door"];
function genDesign() {
  const variant = R(0, 3),
    name = pick(KIDS);
  if (variant === 0 || variant === 3) {
    /* an L-shaped design: its perimeter with two sides to find (variant 0), or its area with every side marked (variant 3) */
    const design = pick(DESIGNS),
      shape = lDesign(),
      { wide, tall, cutWide, cutTall, corner, sides, area, perimeter } = shape,
      word = UNITS[design.unit],
      /* one side across (0, 2, or 4) and one up and down (1, 3, or 5) are left for the student to find */
      hideAcross = pick([0, 2, 4]),
      hideUp = pick([1, 3, 5]),
      hidden = variant === 0 ? [hideAcross, hideUp] : [],
      texts = (show) => sides.map((side, i) => (hidden.includes(i) && !show ? "?" : `${side}`)),
      draw = (show) =>
        lFig(wide, tall, cutWide, cutTall, { corner, sides: texts(show), cut: variant === 3 && show ? "down" : null }),
      /* how a hidden side is found: the whole side across from it, less the other part (or the two parts added) */
      PARTS = { 0: [4, 2], 2: [4, 0], 4: [0, 2], 1: [5, 3], 3: [5, 1], 5: [1, 3] },
      findSide = (i) => {
        const [x, y] = PARTS[i];
        return i >= 4 ? `${sides[x]} + ${sides[y]} = ${sides[i]}` : `${sides[x]} − ${sides[y]} = ${sides[i]}`;
      };
    if (variant === 0)
      return {
        kind: "num",
        unit: word,
        answer: perimeter,
        facts: { t: "lPerimeter", ...shape, hidden },
        prompt: `${name} puts ${design.trim} all the way around this ${design.what}. How many ${word} of ${design.trim} are needed?`,
        fig: draw,
        misc: namedMisc(perimeter, [
          [
            perimeter - sides[hideAcross] - sides[hideUp],
            "That leaves out the sides marked ?. Find them, then add all 6 sides.",
          ],
          [area, "That’s the area, the space inside. The trim goes around the outside."],
        ]),
        hint: "Find each side marked ?: a long side is the two shorter sides across from it put together. Then add all 6 sides.",
        explain: `The sides marked ? are ${findSide(hideAcross)} and ${findSide(hideUp)}. Then ${sides.join(" + ")} = ${perimeter} ${word}.`,
      };
    const inner = wide - cutWide,
      lower = tall - cutTall;
    return {
      kind: "num",
      unit: `square ${word}`,
      answer: area,
      facts: { t: "lArea", ...shape },
      prompt: `${name} paints this ${design.what}. The sides are in ${word}. What is its area?`,
      fig: draw,
      misc: namedMisc(area, [
        [perimeter, "That’s the perimeter, the length around. The area is the space inside."],
        [wide * tall, "That’s the whole big rectangle, but a corner is cut away."],
        [inner * tall, "That’s only one part. Add the other rectangle too."],
      ]),
      hint: "Cut it into two rectangles. Find each area, then add.",
      explain: `Cut it into two rectangles: ${inner} × ${tall} = ${inner * tall} and ${cutWide} × ${lower} = ${cutWide * lower}. ${inner * tall} + ${cutWide * lower} = ${area} square ${word}.`,
    };
  }
  if (variant === 1) {
    /* which rectangle has this area and this perimeter? The choices: it, one with the same area, one with the same perimeter */
    let width, length, sameArea, samePerimeter;
    do {
      width = R(1, 6);
      length = R(width + 1, 9);
      const area = width * length,
        half = width + length;
      sameArea = shuffle(
        range(12)
          .map((i) => i + 1)
          .filter((w) => area % w === 0 && w < area / w && w !== width && area / w <= 12)
          .map((w) => [w, area / w]),
      )[0];
      samePerimeter = shuffle(
        range(half - 1)
          .map((i) => i + 1)
          .filter((w) => w <= half - w && w !== width)
          .map((w) => [w, half - w]),
      )[0];
    } while (!sameArea || !samePerimeter);
    const area = width * length,
      perimeter = 2 * (width + length),
      part = pick(ROBOT_PARTS),
      by = ([w, l]) => `${w} by ${l}`;
    return {
      ...mcOf([
        [by([width, length]), null],
        [
          by(sameArea),
          `${by(sameArea)} has an area of ${area}, but its perimeter is ${2 * (sameArea[0] + sameArea[1])} units.`,
        ],
        [
          by(samePerimeter),
          `${by(samePerimeter)} has a perimeter of ${perimeter}, but its area is ${samePerimeter[0] * samePerimeter[1]} square units.`,
        ],
      ]),
      facts: { t: "robot", area, perimeter },
      prompt: `${name} designs a robot. Its ${part} is a rectangle with an area of ${area} square units and a perimeter of ${perimeter} units. Which rectangle is it?`,
      hint: "Check both for each rectangle: its area (length × width) and its perimeter (all 4 sides).",
      explain: `${width} × ${length} = ${area} square units, and ${width} + ${length} + ${width} + ${length} = ${perimeter} units.`,
    };
  }
  /* two steps: a rectangle's width from its perimeter, then its area */
  const length = R(3, 9),
    width = R(2, length),
    perimeter = 2 * (length + width),
    area = length * width;
  return {
    kind: "num",
    unit: "square feet",
    answer: area,
    facts: { t: "sandbox", length, perimeter },
    prompt: `${name} plans a rectangular sandbox with a perimeter of ${perimeter} feet. It is ${length} feet long. What is its area?`,
    fig: (show) => rectFig(length, width, { unit: "ft", ask: show ? null : "width", grid: false }),
    misc: namedMisc(area, [
      [width, "That’s the width. Use it to find the area."],
      [length * (perimeter - 2 * length), "That uses both widths together. Each width is half of that."],
      [perimeter, "That’s the perimeter. The area is the space inside."],
    ]),
    hint: "First find the width: take the two lengths away from the perimeter and split what’s left in half. Then multiply.",
    explain: `${perimeter} − ${length} − ${length} = ${2 * width}, so the width is ${2 * width} ÷ 2 = ${width} feet. The area is ${length} × ${width} = ${area} square feet.`,
  };
}

/* The Grand Opening deals from every station */
const genBoss = () => pick([genShapes, genQuads, genGrid, genFence, genSandbox, genDesign])();

const ZONES = [
  {
    id: "shapes",
    name: "Shape Sorter",
    lessons: "Lessons 1–3",
    blurb: "Count right angles, spot equal sides, and find the quadrilaterals.",
    gen: genShapes,
  },
  {
    id: "quads",
    name: "Kite Corner",
    lessons: "Lessons 4–5",
    blurb: "Tell rhombuses, rectangles, and squares apart, and find quadrilaterals that are none of them.",
    gen: genQuads,
  },
  {
    id: "grid",
    name: "Chalk Trail",
    lessons: "Lessons 6–7",
    blurb: "Walk around shapes on a grid to find their perimeter, and compare shapes.",
    gen: genGrid,
  },
  {
    id: "fence",
    name: "Fence Line",
    lessons: "Lessons 8–9",
    blurb: "Add side lengths for the perimeter, and find a missing side.",
    gen: genFence,
  },
  {
    id: "sandbox",
    name: "Sandbox Plans",
    lessons: "Lessons 10–12",
    blurb: "Pick area or perimeter, and compare rectangles with the same perimeter or the same area.",
    gen: genSandbox,
  },
  {
    id: "design",
    name: "Design Studio",
    lessons: "Lessons 13–15",
    blurb: "Find the perimeter and area of designs, and build a robot out of rectangles.",
    gen: genDesign,
  },
  {
    id: "boss",
    name: "Grand Opening",
    lessons: "All lessons",
    blurb: "Open the playground! Every right answer raises a flag.",
    gen: genBoss,
  },
];

/* the playground's flag pole with `raised` of its 10 flags up (the boss icon raises all of them) */
const flags = (raised) =>
  '<path d="M8,58H56" stroke="#f3f6fb" stroke-width="3"/><path d="M14,58V24L32,8L50,24V58" fill="none" stroke="#ffc93c" stroke-width="3"/>' +
  '<rect x="24" y="36" width="16" height="22" fill="#7fe3ff" opacity=".6"/>' +
  range(10)
    .map((i) => {
      const x = 4 + i * 6.2;
      return `<path d="M${x},${i % 2 ? 4 : 2}l5,2.5l-5,2.5Z" fill="${i < raised ? "#ff8ac4" : "rgba(255,255,255,.15)"}"/>`;
    })
    .join("");
/* an icon's line of text, centered at x, y: `size` pixels, in `fill` */
const iconText = (x, y, text, size, fill) =>
  `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="700" text-anchor="middle" font-family="monospace">${text}</text>`;
const ICON = {
  shapes:
    '<polygon points="6,52 22,20 34,52" fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="2.5"/>' +
    '<rect x="36" y="26" width="22" height="26" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/>' +
    '<path d="M36,46H42V52" fill="none" stroke="#f3f6fb" stroke-width="1.5"/>',
  quads:
    '<polygon points="32,6 52,32 32,58 12,32" fill="rgba(255,138,196,.35)" stroke="#ff8ac4" stroke-width="2.5"/>' +
    '<path d="M32,58Q28,62 34,63" fill="none" stroke="#f3f6fb" stroke-width="1.5"/>',
  grid:
    '<path d="M8,12V52M18,12V52M28,12V52M38,12V52M48,12V52M58,12V52M8,12H58M8,22H58M8,32H58M8,42H58M8,52H58" stroke="rgba(170,205,255,.3)" stroke-width="1"/>' +
    '<path d="M18,22H48V42H28V52H18Z" fill="rgba(255,201,60,.3)" stroke="#ffc93c" stroke-width="3"/>' +
    '<path d="M18,22H38" stroke="#7fe3ff" stroke-width="4"/>',
  fence:
    '<path d="M6,24V54M18,24V54M30,24V54M42,24V54M54,24V54" stroke="#c97b4b" stroke-width="5"/><path d="M4,32H58M4,46H58" stroke="#f0d9a8" stroke-width="3"/>' +
    iconText(32, 16, "P = ?", 11, "#ffc93c"),
  sandbox:
    '<rect x="8" y="20" width="48" height="30" fill="#f0d9a8" stroke="#c97b4b" stroke-width="3"/>' +
    '<path d="M44,34L52,14" stroke="#e0445e" stroke-width="3"/><path d="M14,40Q20,32 26,40" fill="none" stroke="#c97b4b" stroke-width="2"/>',
  design:
    '<rect x="20" y="8" width="24" height="16" rx="2" fill="#7fe3ff"/><rect x="16" y="26" width="32" height="22" rx="2" fill="#ffc93c"/>' +
    '<rect x="8" y="28" width="6" height="16" fill="#f3f6fb"/><rect x="50" y="28" width="6" height="16" fill="#f3f6fb"/>' +
    '<rect x="20" y="50" width="8" height="10" fill="#f3f6fb"/><rect x="36" y="50" width="8" height="10" fill="#f3f6fb"/>' +
    '<circle cx="27" cy="16" r="2.5" fill="#0a2340"/><circle cx="37" cy="16" r="2.5" fill="#0a2340"/>',
  boss: flags(10),
};
