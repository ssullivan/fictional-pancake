/* Tile Town (Grade 3 Unit 2): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Shapes of unit squares, tiled rectangles, rectangles cut in two, L-shaped figures, and rulers come from figs.js; rectangles
   with their side lengths (rectFig) from shared/shapes.js; mcOf and miscOf from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* n and the word for it: "1 tile", "3 tiles" (plural: the word for more than one) */
const pl = (n, word, plural = word + "s") => `${n} ${n === 1 ? word : plural}`;
/* the text with its first letter capitalized */
const cap = (text) => text[0].toUpperCase() + text.slice(1);
/* the distance around a rectangle: its perimeter, which students often find instead of the area */
const around = (rows, cols) => 2 * (rows + cols);
/* units of length: the word for one, for more than one, and for the area unit ("square feet") */
const UNITS = {
  cm: { one: "centimeter", many: "centimeters", square: "square centimeters" },
  in: { one: "inch", many: "inches", square: "square inches" },
  ft: { one: "foot", many: "feet", square: "square feet" },
  m: { one: "meter", many: "meters", square: "square meters" },
};
/* the squares of a rectangle `rows` tall and `cols` long, as [col, row] */
const rectCells = (rows, cols) => range(rows).flatMap((r) => range(cols).map((c) => [c, r]));

/* ---------- Tile Shop: what area is, and tiling rectangles (Lessons 1–4) ---------- */
/* A shape of n unit squares that fits in a box maxW × maxH, grown one square at a time from a random square, each new one
   next to a square already in it. Returned as [col, row] squares with the top left of the shape at 0, 0, row by row. */
function growShape(n, maxW, maxH) {
  const cells = [[R(0, maxW - 1), R(0, maxH - 1)]],
    has = (col, row) => cells.some(([c, r]) => c === col && r === row);
  while (cells.length < n) {
    const [c, r] = pick(cells),
      [dc, dr] = pick([
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]),
      col = c + dc,
      row = r + dr;
    if (col >= 0 && col < maxW && row >= 0 && row < maxH && !has(col, row)) cells.push([col, row]);
  }
  const minCol = Math.min(...cells.map(([c]) => c)),
    minRow = Math.min(...cells.map(([, r]) => r));
  return cells.map(([c, r]) => [c - minCol, r - minRow]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}
/* how many squares a shape has in each row, top to bottom */
function rowCounts(cells) {
  const rows = Math.max(...cells.map(([, r]) => r)) + 1;
  return range(rows).map((row) => cells.filter(([, r]) => r === row).length);
}
/* the number of side-by-side pairs, counted once each (a square's right and lower neighbors) */
const pairsIn = (cells) =>
  cells.reduce(
    (sum, [c, r]) => sum + cells.filter(([x, y]) => (x === c + 1 && y === r) || (x === c && y === r + 1)).length,
    0,
  );
/* the distance around a shape of squares, in unit edges: 4 for each square, less the 2 edges each side-by-side pair shares */
const shapeAround = (cells) => 4 * cells.length - 2 * pairsIn(cells);

function genCover() {
  const variant = R(0, 3),
    name = pick(KIDS);
  if (variant === 0) {
    /* the area of a shape of squares: count them. Not a rectangle (Mosaic Wall has those), and never a shape whose
       distance around is the same number as its area */
    let cells;
    do cells = growShape(R(6, 14), 5, 4);
    while (
      (Math.max(...cells.map(([c]) => c)) + 1) * (Math.max(...cells.map(([, r]) => r)) + 1) === cells.length ||
      shapeAround(cells) === cells.length
    );
    const area = cells.length,
      counts = rowCounts(cells);
    return {
      kind: "num",
      unit: "square units",
      answer: area,
      facts: { t: "cells", cells },
      prompt: "Each square is 1 square unit. What is the area of this shape?",
      fig: () => cellsFig([cells]),
      misc: miscOf(area, [
        [shapeAround(cells), "That’s the number of square sides around the outside. Area counts the squares inside."],
      ]),
      hint: "Count the squares in each row, then add the rows.",
      explain: `Count each row: ${counts.join(" + ")} = ${area} squares. The area is ${area} square units.`,
    };
  }
  if (variant === 1) {
    /* tap the shape with the biggest area: 2 or 3 shapes with different numbers of squares */
    const count = pick([2, 3]),
      sizes = shuffle(range(7).map((i) => i + 6)).slice(0, count),
      shapes = sizes.map((n) => growShape(n, 4, 4)),
      letters = "ABC".slice(0, count).split(""),
      most = sizes.indexOf(Math.max(...sizes)),
      /* "bigger" of two shapes, "biggest" of three */
      bigger = count === 2 ? "bigger" : "biggest",
      why = {};
    letters.forEach((letter, i) => {
      if (i !== most)
        why[letter] =
          `Shape ${letter} covers ${sizes[i]} squares, and shape ${letters[most]} covers ${sizes[most]}. Count the squares.`;
    });
    return {
      kind: "tap",
      answer: letters[most],
      why,
      facts: { t: "most", sizes },
      prompt: `Which shape has the ${bigger} area? Tap it.`,
      fig: () => cellsFig(shapes, { tap: "cand" }),
      hint: "Count the squares in each shape. The one with the most squares covers the most space.",
      explain: `${letters.map((letter, i) => `Shape ${letter}: ${sizes[i]} squares`).join(". ")}. Shape ${letters[most]} has the ${bigger} area.`,
    };
  }
  if (variant === 2) {
    /* which way of tiling a rectangle measures its area: no gaps, no overlaps, all the same size */
    const rows = R(2, 4),
      cols = R(3, 6);
    return {
      ...mcOf([
        [tilingFig(rows, cols), null],
        [tilingFig(rows, cols, { how: "gaps" }), "There are gaps between the tiles, so some of it isn’t covered."],
        [tilingFig(rows, cols, { how: "overlap" }), "The tiles overlap, so some space gets counted twice."],
        [
          tilingFig(rows, cols, { how: "mixed" }),
          "The tiles aren’t all the same size, so counting them doesn’t give the area.",
        ],
      ]),
      prompt: `${name} covers a rectangle with square tiles to find its area. Which way works?`,
      hint: "The tiles must all be the same size, with no gaps and no overlaps.",
      explain: `The tiles are all the same size, with no gaps or overlaps: ${rows} rows of ${cols} is ${rows * cols} squares.`,
    };
  }
  /* a rectangle only partly tiled: how many tiles cover all of it. Never one whose distance around is its area (4 × 4, 3 × 6) */
  let rows, cols;
  do {
    rows = R(3, 6);
    cols = R(3, 8);
  } while (around(rows, cols) === rows * cols);
  const how = pick(["edges", "row"]),
    area = rows * cols,
    drawn = how === "edges" ? rows + cols - 1 : cols;
  return {
    kind: "num",
    unit: "tiles",
    answer: area,
    facts: { t: "rect", rows, cols },
    prompt: `${name} started covering this rectangle with square tiles. How many tiles will cover all of it?`,
    fig: (show) => tilingFig(rows, cols, { how: show ? "fair" : how }),
    misc: miscOf(area, [
      [drawn, "That’s only the tiles drawn so far. Picture the rest."],
      [rows + cols, `You added ${rows} + ${cols}. Multiply: ${rows} rows of ${cols}.`],
      [around(rows, cols), "That’s the distance around the rectangle. Count the squares that cover it."],
    ]),
    hint:
      how === "edges"
        ? "The top row shows how many tiles fit in a row. The left side shows how many rows."
        : "The top row shows how many tiles fit in a row. Count the marks on the left side for the rows.",
    explain: `There are ${rows} rows of ${cols} tiles: ${rows} × ${cols} = ${area} tiles.`,
  };
}

/* ---------- Mosaic Wall: products as areas (Lesson 5) ---------- */
function genBuild() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* tap the rectangle for rows × cols; the others have one more row or one more in each row (never turned, which also works).
       Small enough that three side by side still have squares big enough to count on a phone */
    let rows, cols;
    do {
      rows = R(2, 5);
      cols = R(3, 6);
    } while (rows === cols);
    const sizes = shuffle([
        [rows, cols],
        [rows + 1, cols],
        [rows, cols + 1],
      ]),
      right = sizes.findIndex(([r, c]) => r === rows && c === cols),
      letters = ["A", "B", "C"],
      why = {};
    sizes.forEach(([r, c], i) => {
      if (i !== right) why[letters[i]] = `That one is ${r} rows of ${c}: ${r} × ${c} = ${r * c} square units.`;
    });
    return {
      kind: "tap",
      answer: letters[right],
      why,
      prompt: `Tap the rectangle with an area of ${rows} × ${cols} square units.`,
      fig: () =>
        cellsFig(
          sizes.map(([r, c]) => rectCells(r, c)),
          {
            tap: "cand",
            label: sizes.map(([r, c], i) => `Shape ${letters[i]}: ${r} rows of ${c} squares`).join(". "),
          },
        ),
      hint: `Look for ${rows} rows with ${cols} squares in each row.`,
      explain: `Shape ${letters[right]} has ${rows} rows of ${cols} squares: ${rows} × ${cols} = ${rows * cols} square units.`,
    };
  }
  if (variant === 1) {
    /* which expression gives the area of a tiled rectangle (rows × cols, or turned around) */
    let rows, cols;
    do {
      rows = R(3, 6);
      cols = R(3, 9);
    } while (rows === cols);
    const right = Math.random() < 0.5 ? `${rows} × ${cols}` : `${cols} × ${rows}`;
    return {
      ...mcOf([
        [right, null],
        [`${rows} + ${cols}`, "That adds. Area is the number of rows times the squares in each row."],
        [`${rows - 1} × ${cols}`, "Count the rows again."],
      ]),
      prompt: "Which expression gives the area of this rectangle in square units?",
      fig: () => tilingFig(rows, cols),
      hint: "Count the rows. Then count the squares in one row.",
      explain: `${rows} rows of ${cols} squares: ${rows} × ${cols} = ${rows * cols} square units. ${cols} × ${rows} works too.`,
    };
  }
  if (variant === 2) {
    /* a missing side: an area and the number of rows give the squares in each row (never a square, where the rows are the answer) */
    let rows, cols;
    do {
      rows = R(2, 6);
      cols = R(2, 9);
    } while (rows === cols || rows * cols - rows === cols);
    const area = rows * cols;
    return {
      kind: "num",
      unit: "squares",
      answer: cols,
      facts: { t: "side", rows, cols },
      prompt: `A rectangle has an area of ${area} square units. It has ${rows} rows of squares. How many squares are in each row?`,
      fig: (show) => tilingFig(rows, cols, { how: show ? "fair" : "col" }),
      misc: miscOf(cols, [
        [area - rows, `You subtracted. Think: ${rows} × ? = ${area}.`],
        [rows, "That’s the number of rows. How many squares are in each one?"],
      ]),
      hint: `Count by ${rows}s until you reach ${area}, or think: ${rows} × ? = ${area}.`,
      explain: `${rows} × ${cols} = ${area}, so each row has ${cols} squares.`,
    };
  }
  /* which rectangle has a given area: the right one, and ones with a row or a column too many or too few */
  let rows, cols;
  do {
    rows = R(2, 5);
    cols = R(3, 8);
  } while (rows === cols);
  const area = rows * cols,
    others = shuffle([
      [rows + 1, cols],
      [rows, cols + 1],
      [rows, cols - 1],
    ])
      .filter(([r, c]) => r * c !== area)
      .slice(0, 2);
  return {
    ...mcOf([
      [tilingFig(rows, cols), null],
      ...others.map(([r, c]) => [
        tilingFig(r, c),
        `That one is ${r} rows of ${c}: ${r} × ${c} = ${r * c} square units.`,
      ]),
    ]),
    prompt: `Which rectangle has an area of ${area} square units?`,
    hint: "Multiply the rows by the squares in each row for each one.",
    explain: `${rows} rows of ${cols}: ${rows} × ${cols} = ${area} square units.`,
  };
}

/* ---------- Unit Store: square units (Lessons 6–7) ---------- */
/* what 1 square unit is about the size of */
const BENCH = { cm: "the tip of your finger", in: "a postage stamp", ft: "a floor tile", m: "a small table top" };
/* Things to measure. small: measured in square cm or square inches; big: in square feet or square meters.
   sizes: [rows, cols] of unit squares that are about right in each unit (none when it's too big for a grid). */
const THINGS = [
  {
    a: "a postage stamp",
    the: "the postage stamp",
    small: true,
    sizes: {
      cm: [
        [2, 3],
        [3, 3],
        [3, 4],
      ],
    },
  },
  {
    a: "a sticky note",
    the: "the sticky note",
    small: true,
    sizes: {
      cm: [
        [7, 7],
        [8, 8],
      ],
      in: [[3, 3]],
    },
  },
  {
    a: "an index card",
    the: "the index card",
    small: true,
    sizes: {
      in: [
        [3, 5],
        [4, 6],
      ],
    },
  },
  {
    a: "a photo",
    the: "the photo",
    small: true,
    sizes: {
      in: [
        [4, 6],
        [5, 7],
      ],
    },
  },
  { a: "a playing card", the: "the playing card", small: true, sizes: { cm: [[6, 9]], in: [[2, 3]] } },
  {
    a: "a coaster",
    the: "the coaster",
    small: true,
    sizes: {
      cm: [
        [9, 9],
        [10, 10],
      ],
      in: [[4, 4]],
    },
  },
  {
    a: "a book cover",
    the: "the book cover",
    small: true,
    sizes: {
      in: [
        [6, 9],
        [5, 8],
        [8, 10],
      ],
    },
  },
  {
    a: "a rug",
    the: "the rug",
    small: false,
    sizes: {
      ft: [
        [3, 5],
        [4, 6],
        [5, 8],
        [6, 9],
      ],
      m: [[2, 3]],
    },
  },
  {
    a: "a bedroom floor",
    the: "the bedroom floor",
    small: false,
    sizes: {
      ft: [
        [8, 10],
        [9, 10],
      ],
      m: [
        [3, 4],
        [4, 4],
      ],
    },
  },
  {
    a: "a garden",
    the: "the garden",
    small: false,
    sizes: {
      ft: [
        [4, 8],
        [6, 9],
      ],
      m: [
        [2, 4],
        [3, 5],
      ],
    },
  },
  {
    a: "a classroom floor",
    the: "the classroom floor",
    small: false,
    sizes: {
      m: [
        [7, 9],
        [8, 10],
        [9, 9],
      ],
    },
  },
  {
    a: "a bulletin board",
    the: "the bulletin board",
    small: false,
    sizes: {
      ft: [
        [3, 4],
        [4, 6],
      ],
    },
  },
  { a: "a basketball court", the: "the basketball court", small: false, sizes: {} },
  { a: "a playground", the: "the playground", small: false, sizes: {} },
];
/* the units for small things and for big ones */
const unitsFor = (small) => (small ? ["cm", "in"] : ["ft", "m"]);

function genUnits() {
  const variant = R(0, 3),
    [nameA, nameB] = shuffle(KIDS);
  if (variant === 0) {
    /* which unit makes sense for something: one of the right size, and the two of the other size */
    const thing = pick(THINGS),
      right = pick(unitsFor(thing.small)),
      wrong = unitsFor(!thing.small);
    return {
      ...mcOf([
        [UNITS[right].square, null],
        ...wrong.map((u) => [
          UNITS[u].square,
          `A square ${UNITS[u].one} is about the size of ${BENCH[u]}. ${thing.small ? `That’s much too big for ${thing.a}.` : `It would take far too many to cover ${thing.the}.`}`,
        ]),
      ]),
      prompt: `Which unit makes the most sense for the area of ${thing.a}?`,
      hint: "Small things are measured in small squares. Big things are measured in big squares.",
      explain: `${cap(thing.a)} is ${thing.small ? "small" : "big"}, so use ${thing.small ? "small" : "big"} squares: ${UNITS[right].square}.`,
    };
  }
  if (variant === 1) {
    /* two children cover the same thing with different square units: the smaller unit takes more tiles */
    const thing = pick(THINGS),
      /* the smaller unit first: cm is smaller than in, and ft smaller than m */
      [small, big] = unitsFor(thing.small),
      /* does the first child use the smaller unit? */
      aSmall = Math.random() < 0.5,
      unitA = aSmall ? small : big,
      unitB = aSmall ? big : small,
      more = aSmall ? nameA : nameB,
      fewer = aSmall ? nameB : nameA;
    return {
      ...mcOf([
        [more, null],
        [fewer, `${fewer} uses bigger squares. Bigger squares cover more, so it takes fewer of them.`],
        ["They need the same number", "The squares are different sizes, so they need different numbers."],
      ]),
      prompt: `${nameA} covers ${thing.a} with square ${UNITS[unitA].many}. ${nameB} covers ${thing.the.replace("the ", "the same ")} with square ${UNITS[unitB].many}. Who needs more squares?`,
      hint: `Which is smaller: a square ${UNITS.cm.one} or a square ${UNITS.in.one}? A square ${UNITS.ft.one} or a square ${UNITS.m.one}?`,
      explain: `A square ${UNITS[small].one} is smaller than a square ${UNITS[big].one}. Smaller squares cover less, so ${more} needs more of them.`,
    };
  }
  if (variant === 2) {
    /* the area of something drawn on a grid of 1 square unit each */
    const thing = pick(THINGS.filter((t) => Object.keys(t.sizes).length)),
      unit = pick(Object.keys(thing.sizes)),
      [rows, cols] = pick(thing.sizes[unit]),
      area = rows * cols,
      mistakes = [[rows + cols, `You added ${rows} + ${cols}. Multiply the rows by the squares in each row.`]];
    if (around(rows, cols) !== area)
      mistakes.push([around(rows, cols), "That’s the distance around. Area counts the squares inside."]);
    return {
      kind: "num",
      unit: UNITS[unit].square,
      answer: area,
      facts: { t: "rect", rows, cols, thing: thing.a, unit },
      prompt: `Each square in this picture of ${thing.a} is 1 square ${UNITS[unit].one}. What is the area of ${thing.the}?`,
      fig: () => tilingFig(rows, cols),
      misc: miscOf(area, mistakes),
      hint: "Count the rows and the squares in one row, then multiply.",
      explain: `${rows} rows of ${cols}: ${rows} × ${cols} = ${area} ${UNITS[unit].square}.`,
    };
  }
  /* what 1 square unit is about the size of */
  const unit = pick(Object.keys(UNITS));
  return {
    ...mcOf(
      Object.keys(UNITS).map((u) => [
        cap(BENCH[u]),
        u === unit ? null : `${cap(BENCH[u])} is about 1 square ${UNITS[u].one}.`,
      ]),
    ),
    prompt: `Which is about the size of 1 square ${UNITS[unit].one}?`,
    hint: "From smallest to biggest: square centimeter, square inch, square foot, square meter.",
    explain: `1 square ${UNITS[unit].one} is about the size of ${BENCH[unit]}.`,
  };
}

/* ---------- Garden Plots: area from side lengths (Lessons 8–10) ---------- */
/* things with an area to find: the unit their sides are in, and the shortest and longest side that make sense */
const PLOTS = [
  { a: "a rug", the: "rug", unit: "ft", sides: [2, 9] },
  { a: "a garden bed", the: "garden bed", unit: "ft", sides: [2, 8] },
  { a: "a garden bed", the: "garden bed", unit: "m", sides: [2, 5] },
  { a: "a patio", the: "patio", unit: "m", sides: [3, 8] },
  { a: "a bulletin board", the: "bulletin board", unit: "ft", sides: [2, 6] },
  { a: "a classroom floor", the: "classroom floor", unit: "m", sides: [6, 10] },
  { a: "a bedroom floor", the: "bedroom floor", unit: "ft", sides: [7, 10] },
  { a: "a quilt", the: "quilt", unit: "ft", sides: [4, 8] },
  { a: "a pool", the: "pool", unit: "m", sides: [4, 10] },
];
/* a length and width for a plot: different, and never a rectangle whose distance around is its area */
function plotSides(plot) {
  const [shortest, longest] = plot.sides;
  let length, width;
  do {
    length = R(shortest, longest);
    width = R(shortest, longest);
  } while (length === width || around(length, width) === length * width);
  return [length, width];
}
/* the mistakes for the area of a rectangle with these sides: adding them, and the distance around */
const areaMistakes = (length, width) => [
  [length + width, `You added the sides. Area is ${length} × ${width}.`],
  [around(length, width), "That’s the distance around the outside. Area is the squares inside."],
];

function genPlots() {
  const variant = R(0, 3),
    name = pick(KIDS);
  if (variant === 0) {
    /* the area of a rectangle with its side lengths and no grid */
    const plot = pick(PLOTS),
      [length, width] = plotSides(plot),
      unit = UNITS[plot.unit],
      area = length * width;
    return {
      kind: "num",
      unit: unit.square,
      answer: area,
      facts: { t: "plot", length, width, thing: plot.a, unit: plot.unit },
      prompt: `What is the area of ${name}’s ${plot.the}?`,
      fig: (show) => rectFig(length, width, { unit: plot.unit, grid: show }),
      misc: miscOf(area, areaMistakes(length, width)),
      hint: `Picture the squares: ${width} rows with ${length} in each row.`,
      explain: `${width} rows of ${length} squares: ${width} × ${length} = ${area} ${unit.square}.`,
    };
  }
  if (variant === 1) {
    /* measure the sides with rulers, then multiply */
    const unit = pick(["cm", "in"]),
      width = R(2, 6);
    let length;
    do length = R(2, unit === "cm" ? 9 : 7);
    while (length === width || around(length, width) === length * width);
    const area = length * width;
    return {
      kind: "num",
      unit: UNITS[unit].square,
      answer: area,
      facts: { t: "ruler", length, width },
      prompt: "Measure the sides with the rulers. What is the area of the rectangle?",
      fig: () => rulerRect(length, width, unit),
      misc: miscOf(area, areaMistakes(length, width)),
      hint: "Read the ruler where each side ends. Then multiply the two sides.",
      explain: `The rectangle is ${length} ${UNITS[unit].many} long and ${width} ${UNITS[unit].many} wide. ${width} × ${length} = ${area} ${UNITS[unit].square}.`,
    };
  }
  if (variant === 2) {
    /* which of two plots has the bigger area, or are they the same; same-area pairs have different shapes */
    const plot = pick(PLOTS),
      [shortest, longest] = plot.sides,
      fits = (side) => side >= shortest && side <= longest;
    let sizeA, sizeB;
    do {
      sizeA = plotSides(plot);
      if (Math.random() < 0.35) {
        /* another rectangle with the same area, when one fits */
        const area = sizeA[0] * sizeA[1],
          sameArea = range(longest + 1)
            .filter((side) => fits(side) && area % side === 0 && fits(area / side))
            .map((side) => [side, area / side])
            .filter(([a, b]) => a !== b && a !== sizeA[0] && a !== sizeA[1]);
        sizeB = sameArea.length ? pick(sameArea) : plotSides(plot);
      } else sizeB = plotSides(plot);
    } while (sizeB[0] === sizeA[0] && sizeB[1] === sizeA[1]);
    /* both: each plot's area worked out, for the explanation and the mistakes */
    const nameB = pick(KIDS.filter((kid) => kid !== name)),
      [areaA, areaB] = [sizeA, sizeB].map(([l, w]) => l * w),
      unit = UNITS[plot.unit],
      say = ([l, w], who) => `${who}’s ${plot.the}: ${l} × ${w} = ${l * w} ${unit.square}`,
      both = `${say(sizeA, name)}. ${say(sizeB, nameB)}`;
    const answer = areaA === areaB ? "same" : areaA > areaB ? name : nameB;
    const choice = (who) => [
      who === "same" ? "They’re the same" : `${who}’s ${plot.the}`,
      who === answer ? null : `Multiply each one’s sides. ${both}.`,
    ];
    return {
      ...mcOf([choice(name), choice(nameB), choice("same")]),
      prompt: `${name}’s ${plot.the} is ${sizeA[0]} ${unit.many} by ${sizeA[1]} ${unit.many}. ${nameB}’s is ${sizeB[0]} ${unit.many} by ${sizeB[1]} ${unit.many}. Which has the bigger area?`,
      fig: () =>
        `<div class="pair"><figure><figcaption>${name}’s</figcaption>${rectFig(sizeA[0], sizeA[1], { unit: plot.unit, grid: false })}</figure><figure><figcaption>${nameB}’s</figcaption>${rectFig(sizeB[0], sizeB[1], { unit: plot.unit, grid: false })}</figure></div>`,
      hint: "Find each area: multiply its two sides. Then compare.",
      explain: `${both}. ${answer === "same" ? "The areas are the same." : `${answer}’s is bigger.`}`,
    };
  }
  /* a missing side from the area and the other side (never a square, where the side you know is the answer) */
  const plot = pick(PLOTS),
    [length, width] = plotSides(plot),
    unit = UNITS[plot.unit],
    area = length * width,
    mistakes = [
      [area - width, `You subtracted. Think: ${width} × ? = ${area}.`],
      [width, "That’s the side you know. How long is the other side?"],
    ];
  return {
    kind: "num",
    unit: unit.many,
    answer: length,
    facts: { t: "missing", length, width, thing: plot.a, unit: plot.unit },
    prompt: `${name}’s ${plot.the} has an area of ${area} ${unit.square}. It is ${width} ${unit.many} wide. How long is it?`,
    fig: (show) => rectFig(length, width, { unit: plot.unit, ask: "length", grid: show }),
    misc: miscOf(length, mistakes),
    hint: `Think: ${width} rows of how many make ${area}? ${width} × ? = ${area}.`,
    explain: `${width} × ${length} = ${area}, so it is ${length} ${unit.many} long.`,
  };
}

/* ---------- Split Street: area and addition (Lesson 12) ---------- */
/* a rectangle to cut: rows, cols, and where to cut (5 when it fits, so one part is a fact with 5), never in half, and both
   parts at least 2 wide */
function splitSize() {
  let rows, cols, cut;
  do {
    rows = R(3, 9);
    cols = R(6, 10);
    cut = Math.random() < 0.6 ? 5 : R(2, cols - 2);
  } while (cols - cut < 2 || cut === cols - cut);
  return [rows, cols, cut, cols - cut];
}

function genSplit() {
  const variant = R(0, 3),
    [rows, cols, cut, rest] = splitSize(),
    area = rows * cols;
  /* "6 × 5 = 30 and 6 × 2 = 12. 30 + 12 = 42" */
  const parts = `${rows} × ${cut} = ${rows * cut} and ${rows} × ${rest} = ${rows * rest}. ${rows * cut} + ${rows * rest} = ${area}`;
  if (variant === 0) {
    /* the missing number in rows × cols = rows × cut + rows × ? */
    return {
      kind: "num",
      unit: "",
      answer: rest,
      facts: { t: "split", rows, cols, cut },
      prompt: `The rectangle is cut into two parts. ${rows} × ${cols} = ${rows} × ${cut} + ${rows} × ?`,
      fig: () => splitFig(rows, cols, cut, { ask: "right" }),
      misc: miscOf(rest, [
        [cols, `${cols} is the whole side. The blue part is only part of it.`],
        [cut, "That’s the gold part. What’s left for the blue part?"],
        [rows * rest, "That’s the blue part’s area. The ? is how many squares wide it is."],
      ]),
      hint: `The whole side is ${cols}. The gold part is ${cut} wide. ${cut} + ? = ${cols}.`,
      explain: `${cut} + ${rest} = ${cols}, so ${rows} × ${cols} = ${rows} × ${cut} + ${rows} × ${rest}.`,
    };
  }
  if (variant === 1) {
    /* the area of the whole rectangle, from its two parts */
    return {
      kind: "num",
      unit: "square units",
      answer: area,
      facts: { t: "split", rows, cols, cut },
      prompt: "The rectangle is cut into two parts. What is the area of the whole rectangle?",
      fig: (show) => splitFig(rows, cols, cut, { grid: false, products: show }),
      misc: miscOf(area, [
        [rows * cut, "That’s only the gold part. Add the blue part."],
        [rows * rest, "That’s only the blue part. Add the gold part."],
        [rows + cut + rest, "You added the sides. Multiply to find each part’s area."],
      ]),
      hint: `Find each part: ${rows} × ${cut} and ${rows} × ${rest}. Then add them.`,
      explain: `${parts} square units.`,
    };
  }
  if (variant === 2) {
    /* which expression gives the area of the whole rectangle */
    return {
      ...mcOf([
        [`${rows} × ${cut} + ${rows} × ${rest}`, null],
        [`${rows} × ${cut} + ${rest}`, `The blue part is ${rows} rows of ${rest}, not just ${rest}.`],
        [`${rows} × ${cut}`, "That’s only the gold part."],
        [`${rows} + ${cut} + ${rest}`, "That adds the sides. Each part’s area is a multiplication."],
      ]),
      prompt: "Which expression gives the area of the whole rectangle?",
      fig: () => splitFig(rows, cols, cut, { grid: false }),
      hint: "Find the area of each part, then add them.",
      explain: `The gold part is ${rows} × ${cut} and the blue part is ${rows} × ${rest}. ${parts}.`,
    };
  }
  /* the product, from the two parts */
  return {
    kind: "num",
    unit: "",
    answer: area,
    facts: { t: "split", rows, cols, cut },
    prompt: `${rows} × ${cols} = ${rows} × ${cut} + ${rows} × ${rest}. What is ${rows} × ${cols}?`,
    fig: (show) => splitFig(rows, cols, cut, { products: show }),
    misc: miscOf(area, [
      [rows * cut + rest, `${rows} × ${rest} is ${rows * rest}, not ${rest}.`],
      [rows * cut, `That’s ${rows} × ${cut}. Add ${rows} × ${rest} too.`],
    ]),
    hint: `Find ${rows} × ${cut} and ${rows} × ${rest}, then add them.`,
    explain: `${parts}, so ${rows} × ${cols} = ${area}.`,
  };
}

/* ---------- Floor Plans: figures made of rectangles (Lessons 13–14) ---------- */
/* what an L-shaped floor plan is of, and the unit its sides are in */
const PLACES = [
  { what: "room", unit: "ft" },
  { what: "deck", unit: "ft" },
  { what: "garden", unit: "m" },
  { what: "patio", unit: "m" },
];
/* An L-shaped figure: a rectangle wide × tall with a corner cutWide × cutTall cut away, and which corner. Its sides, numbered
   as lFig numbers them, and the two rectangles an up-down cut makes (left: inner × tall; right: cutWide × lower).
   Never one whose distance around (the same as the big rectangle's) is the same number as its area. */
function lShape() {
  let wide, tall, cutWide, cutTall;
  do {
    wide = R(5, 10);
    tall = R(4, 9);
    cutWide = R(2, wide - 2);
    cutTall = R(1, tall - 2);
  } while (wide * tall > 90 || around(wide, tall) === wide * tall - cutWide * cutTall);
  const inner = wide - cutWide,
    lower = tall - cutTall;
  return {
    wide,
    tall,
    cutWide,
    cutTall,
    inner,
    lower,
    corner: pick(["tr", "tl", "br", "bl"]),
    sides: [inner, cutTall, cutWide, lower, wide, tall],
    area: inner * tall + cutWide * lower,
  };
}
/* how to find a side from the others: for each side, the whole side across from it and the other part on that side
   (side 0 + side 2 = side 4; side 1 + side 3 = side 5) */
const SIDE_PARTS = { 0: [4, 2], 2: [4, 0], 1: [5, 3], 3: [5, 1], 4: [0, 2], 5: [1, 3] };
/* the words for a side's direction, for hints: sides 0, 2, 4 go across; 1, 3, 5 go up and down */
const across = (side) => side % 2 === 0;

function genFloors() {
  const variant = R(0, 3),
    name = pick(KIDS),
    place = pick(PLACES),
    unit = UNITS[place.unit],
    shape = lShape(),
    { wide, tall, cutWide, cutTall, inner, lower, corner, sides, area } = shape;
  const draw = (texts, show) =>
    lFig(wide, tall, cutWide, cutTall, { corner, sides: texts, cut: show ? "down" : null, grid: show });
  /* "Cut it into two rectangles: 5 × 6 = 30 and 3 × 4 = 12. 30 + 12 = 42" */
  const cutInTwo = `Cut it into two rectangles: ${inner} × ${tall} = ${inner * tall} and ${cutWide} × ${lower} = ${cutWide * lower}. ${inner * tall} + ${cutWide * lower} = ${area}`;
  const plan = `Here is the plan of ${name}’s ${place.what}. The sides are in ${unit.many}.`;
  if (variant === 0) {
    /* the area of an L-shaped figure with all its sides marked */
    const mistakes = [
      [wide * tall, "That’s the whole big rectangle, but a corner is cut away."],
      [inner * tall, "That’s only one part. Add the other rectangle too."],
      [sides.reduce((sum, side) => sum + side, 0), "That’s the distance around. Area is the squares inside."],
    ];
    return {
      kind: "num",
      unit: unit.square,
      answer: area,
      facts: { t: "L", ...shape },
      prompt: `${plan} What is its area?`,
      fig: (show) => draw(sides, show),
      misc: miscOf(area, mistakes),
      hint: "Cut the figure into two rectangles. Find each area, then add.",
      explain: `${cutInTwo} ${unit.square}.`,
    };
  }
  /* a side to leave unmarked: its length, from the whole side across from it and the other part */
  const ask = R(0, 5),
    [wholeSide, partSide] = SIDE_PARTS[ask],
    texts = sides.map((side, i) => (i === ask ? "?" : side)),
    /* sides 4 and 5 are sums of two parts; the others are a whole side less a part */
    isSum = ask >= 4,
    findSide = isSum
      ? `${sides[wholeSide]} + ${sides[partSide]} = ${sides[ask]}`
      : `${sides[wholeSide]} − ${sides[partSide]} = ${sides[ask]}`;
  if (variant === 1) {
    /* the length of the side marked ? */
    const mistakes = isSum
      ? [
          [
            Math.abs(sides[wholeSide] - sides[partSide]),
            "That subtracts. The ? side is as long as the two parts across from it together.",
          ],
          [sides[wholeSide], "That’s only one part. Add the other part across from it."],
        ]
      : [
          [sides[wholeSide], `That’s the whole side across from it. Take away the ${sides[partSide]}.`],
          [
            sides[wholeSide] + sides[partSide],
            `That adds. The ? side and the ${sides[partSide]} side make ${sides[wholeSide]} together.`,
          ],
        ];
    return {
      kind: "num",
      unit: unit.many,
      answer: sides[ask],
      facts: { t: "Lside", ...shape, ask },
      prompt: `${plan} How long is the side marked ?`,
      fig: () => draw(texts, false),
      misc: miscOf(
        sides[ask],
        mistakes.filter(([v]) => v !== sides[ask] && v > 0),
      ),
      hint: `Look at the sides that go ${across(ask) ? "across" : "up and down"}. ${isSum ? "The ? side is as long as the two across from it together." : "The ? side and the other part make the whole side across from them."}`,
      explain: `${findSide}. The side is ${sides[ask]} ${unit.many} long.`,
    };
  }
  if (variant === 2) {
    /* the area, when one side has to be found first */
    const mistakes = [
      [wide * tall, "That’s the whole big rectangle, but a corner is cut away."],
      [inner * tall, "That’s only one part. Add the other rectangle too."],
    ];
    return {
      kind: "num",
      unit: unit.square,
      answer: area,
      facts: { t: "L", ...shape, ask },
      prompt: `${plan} What is its area?`,
      fig: (show) => draw(show ? sides : texts, show),
      misc: miscOf(area, mistakes),
      hint: `Find the side marked ? first. Then cut the figure into two rectangles.`,
      explain: `The ? side is ${findSide}. ${cutInTwo} ${unit.square}.`,
    };
  }
  /* which expression gives the area: one right way to cut it, and ways that count too much or too little */
  const cutDown = Math.random() < 0.5,
    right = cutDown ? `${inner} × ${tall} + ${cutWide} × ${lower}` : `${inner} × ${cutTall} + ${wide} × ${lower}`,
    wrongs = [
      [
        `${wide} × ${tall} + ${cutWide} × ${lower}`,
        wide * tall + cutWide * lower,
        "That counts part of the figure twice.",
      ],
      [
        `${inner} × ${tall} + ${cutWide} × ${tall}`,
        inner * tall + cutWide * tall,
        "The second rectangle isn’t that tall. A corner is cut away.",
      ],
      [`${wide} × ${tall}`, wide * tall, "That’s the whole big rectangle, but a corner is cut away."],
      [`${inner} × ${tall}`, inner * tall, "That’s only one part. Add the other rectangle too."],
    ].filter(([, value]) => value !== area);
  return {
    ...mcOf([
      [right, null],
      ...shuffle(wrongs)
        .slice(0, 2)
        .map(([label, , why]) => [label, why]),
    ]),
    facts: { t: "L", ...shape },
    prompt: `${plan} Which expression gives its area in ${unit.square}?`,
    fig: () => draw(sides, false),
    hint: "Cut the figure into two rectangles that don’t overlap. Add their areas.",
    explain: cutDown
      ? `${cutInTwo}.`
      : `Cut it across: ${inner} × ${cutTall} = ${inner * cutTall} and ${wide} × ${lower} = ${wide * lower}. ${inner * cutTall} + ${wide * lower} = ${area}.`,
  };
}

/* Town Square deals from every station */
const genBoss = () => pick([genCover, genBuild, genUnits, genPlots, genSplit, genFloors])();

const ZONES = [
  {
    id: "cover",
    name: "Tile Shop",
    lessons: "Lessons 1–4",
    blurb: "Count the squares that cover a shape, spot fair tiling, and finish tiling a rectangle in your head.",
    gen: genCover,
  },
  {
    id: "build",
    name: "Mosaic Wall",
    lessons: "Lesson 5",
    blurb: "Match rectangles to multiplication: 4 rows of 6 squares is 4 × 6 square units.",
    gen: genBuild,
  },
  {
    id: "units",
    name: "Unit Store",
    lessons: "Lessons 6–7",
    blurb: "Pick square centimeters, inches, feet, or meters, and see why smaller squares take more.",
    gen: genUnits,
  },
  {
    id: "plots",
    name: "Garden Plots",
    lessons: "Lessons 8–10",
    blurb: "Find areas from side lengths and rulers, compare plots, and find a missing side.",
    gen: genPlots,
  },
  {
    id: "split",
    name: "Split Street",
    lessons: "Lesson 12",
    blurb: "Cut a rectangle in two to use facts you know: 6 × 7 = 6 × 5 + 6 × 2.",
    gen: genSplit,
  },
  {
    id: "floors",
    name: "Floor Plans",
    lessons: "Lessons 13–14",
    blurb: "Find the area of L-shaped rooms and gardens, and the length of a missing side.",
    gen: genFloors,
  },
  {
    id: "boss",
    name: "Town Square",
    lessons: "All lessons",
    blurb: "Finish the town mosaic! Every right answer lays one of its 10 tiles.",
    gen: genBoss,
  },
];

/* the town mosaic: 10 tiles in 2 rows of 5, `lit` of them laid (the boss icon draws all of them) */
const MOSAIC_COLORS = ["#ffc93c", "#7fe3ff", "#ff8ac4", "#5fe0a8", "#ff9a86"];
const mosaic = (lit) =>
  '<rect x="4" y="14" width="56" height="36" rx="3" fill="#0a2340" stroke="#a9c4e4" stroke-width="1.5"/>' +
  range(10)
    .map((i) => {
      const x = 7 + (i % 5) * 10.6,
        y = 17 + Math.floor(i / 5) * 15.5;
      return `<rect x="${x}" y="${y}" width="9.4" height="14" rx="1.5" fill="${i < lit ? MOSAIC_COLORS[(i * 3) % 5] : "rgba(255,255,255,.1)"}"/>`;
    })
    .join("");
const ICON = {
  cover:
    '<path d="M6,26L32,8L58,26V58H6Z" fill="#7fb0e6" stroke="#0a2340" stroke-width="1.5"/><g stroke="#0a2340" stroke-width="1.2" fill="#ffc93c">' +
    [
      [16, 30],
      [26, 30],
      [36, 30],
      [16, 40],
      [26, 40],
      [16, 48],
    ]
      .map(([x, y]) => `<rect x="${x}" y="${y}" width="10" height="${y === 48 ? 8 : 10}"/>`)
      .join("") +
    "</g>",
  build:
    '<rect x="6" y="10" width="52" height="44" rx="3" fill="#0a2340" stroke="#a9c4e4" stroke-width="1.5"/><g stroke="#0a2340" stroke-width="1">' +
    range(12)
      .map(
        (i) =>
          `<rect x="${10 + (i % 4) * 11}" y="${14 + Math.floor(i / 4) * 12}" width="11" height="12" fill="${MOSAIC_COLORS[i % 5]}"/>`,
      )
      .join("") +
    "</g>",
  units:
    '<rect x="6" y="40" width="10" height="10" fill="#5fe0a8"/><rect x="20" y="30" width="20" height="20" fill="#7fe3ff"/><rect x="44" y="18" width="16" height="32" fill="none" stroke="#ffc93c" stroke-width="2.5"/><line x1="4" y1="54" x2="60" y2="54" stroke="#f3f6fb" stroke-width="2"/><text x="32" y="14" fill="#f3f6fb" font-size="9" font-weight="700" text-anchor="middle" font-family="monospace">cm in ft m</text>',
  plots:
    '<rect x="8" y="12" width="48" height="36" fill="#3f8f4f" stroke="#a9e6b0" stroke-width="2"/><g stroke="#2a6a38" stroke-width="2"><line x1="8" y1="24" x2="56" y2="24"/><line x1="8" y1="36" x2="56" y2="36"/></g><text x="32" y="60" fill="#f3f6fb" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">6 × 4</text>',
  split:
    '<rect x="8" y="12" width="30" height="40" fill="rgba(255,201,60,.5)"/><rect x="38" y="12" width="18" height="40" fill="rgba(127,227,255,.45)"/><rect x="8" y="12" width="48" height="40" fill="none" stroke="#f3f6fb" stroke-width="2"/><line x1="38" y1="8" x2="38" y2="56" stroke="#ff8ac4" stroke-width="2.5" stroke-dasharray="4 3"/>',
  floors:
    '<path d="M8,10H34V30H56V54H8Z" fill="rgba(95,224,168,.3)" stroke="#5fe0a8" stroke-width="2.5"/><line x1="34" y1="30" x2="34" y2="54" stroke="#ff8ac4" stroke-width="2" stroke-dasharray="4 3"/>',
  boss: mosaic(10),
};
