/* The Unit 6 study guide (study.html): its diagrams. Each <figure data-fig="name"> in the page gets the picture FIGURES[name]
   draws, with shared/study.js's Diagram and splitArea: laid out in units with y going up, and drawn as inline SVG with the
   classes styled in shared/study.css (sh and sh2 the two kinds of thing, g grid lines, out an outline, lb a label, …).
   Labels in pictures are plain text. Nothing else uses this file. */

/* A tape diagram of an equation: a box for each [width, words] in parts (widths in units, words inside), side by side, with a
   bracket under all of them and the total under it. */
function tapeEq(parts, total, label, { scale = 34 } = {}) {
  const length = parts.reduce((sum, [width]) => sum + width, 0),
    bracketY = -0.3,
    nub = 0.15,
    d = new Diagram(0, length, -1, 1, scale, { pad: 14, label });
  let left = 0;
  parts.forEach(([width, words]) => {
    /* a letter's boxes are shaded; a number's are blue */
    d.box(left, 0, width, 1, /^[a-z]$/.test(words) ? "sh" : "sh2").text([left + width / 2, 0.5], words, { dy: 5 });
    left += width;
  });
  return d
    .line([0, bracketY], [length, bracketY])
    .line([0, bracketY], [0, bracketY + nub])
    .line([length, bracketY], [length, bracketY + nub])
    .text([length / 2, bracketY], total, { dy: 18 })
    .svg();
}

/* A balanced hanger: a hook, a level beam, and a string down from each end to what hangs there. left and right count the
   circles (each an unknown, written `letter`) and the unit squares on each side: {circles, squares}. Things hang in rows of
   up to 4 under their string. */
function hangerFig(left, right, label, { letter = "x", scale = 26 } = {}) {
  /* the beam runs from −arm to arm at y = 0; each side's rows start rowTop under it, 1 unit apart */
  const perRow = 4,
    arm = 3,
    rowTop = -1.2,
    itemsOf = ({ circles = 0, squares = 0 }) => [...Array(circles).fill("x"), ...Array(squares).fill(1)],
    rowsOf = (side) => Math.ceil(itemsOf(side).length / perRow),
    bottom = rowTop - Math.max(rowsOf(left), rowsOf(right)) + 0.5,
    d = new Diagram(-arm - 2, arm + 2, bottom, 1, scale, { pad: 12, label });
  /* the hook: a small triangle on top of the beam's middle */
  d.poly(
    [
      [0, 0],
      [-0.35, 0.7],
      [0.35, 0.7],
    ],
    "out",
  ).line([-arm, 0], [arm, 0]);
  [
    [-arm, left],
    [arm, right],
  ].forEach(([x, side]) => {
    d.line([x, 0], [x, rowTop + 0.45], "frame");
    itemsOf(side).forEach((item, i) => {
      /* the i-th thing: its column across its row (rows centered under the string) and its row down */
      const row = Math.floor(i / perRow),
        inRow = Math.min(perRow, itemsOf(side).length - row * perRow),
        cx = x + (i % perRow) - (inRow - 1) / 2,
        cy = rowTop - row;
      if (item === "x") d.circle([cx, cy], 0.4).text([cx, cy], letter, { dy: 5, cls: "lb sm" });
      else d.box(cx - 0.35, cy - 0.35, 0.7, 0.7, "sh2");
    });
  });
  return d.svg();
}

/* A graph in the first quadrant: a grid `cols` wide and `rows` tall, a step of yStep for each row, the points [x, y] as dots,
   and the axes named xName (under) and yName (over the y-axis). */
function graphFig(points, cols, rows, yStep, [xName, yName], label, { scale = 30 } = {}) {
  const d = new Diagram(0, cols, 0, rows, scale, { pad: 38, label, left: 8 });
  d.grid(0, cols, 0, rows).line([0, 0], [cols, 0]).line([0, 0], [0, rows]);
  for (let x = 0; x <= cols; x++) d.text([x, 0], String(x), { dy: 16, cls: "lb sm" });
  for (let row = 1; row <= rows; row++)
    d.text([0, row], String(row * yStep), { dx: -6, dy: 4, cls: "lb sm", anchor: "end" });
  points.forEach(([x, y]) => d.circle([x, y / yStep], 0.15, "dot"));
  return d
    .text([cols / 2, 0], xName, { dy: 33, cls: "lb sm" })
    .text([0, rows], yName, { dy: -10, cls: "lb sm", anchor: "start" })
    .svg();
}

const FIGURES = {
  /* Part A: tape diagrams and equations */
  tape3x: () =>
    tapeEq(
      [
        [2, "x"],
        [2, "x"],
        [2, "x"],
      ],
      "18",
      "A tape of 3 equal parts, each x, making 18 in all",
    ),
  tapeA1: () =>
    tapeEq(
      [
        [4, "x"],
        [2.5, "5"],
      ],
      "12",
      "A tape with a part x and a part 5, making 12 in all",
    ),

  /* Part B: staying in balance */
  hanger4: () =>
    hangerFig(
      { circles: 4 },
      { squares: 12 },
      "A balanced hanger: 4 circles, each x, on the left and 12 unit squares on the right",
    ),

  /* Part E: the distributive property */
  distribute: () =>
    splitArea(
      [
        [3, "x", "4x"],
        [2, "5", "20"],
      ],
      1.5,
      "4",
      "An area diagram: a rectangle 4 tall, split into a part x wide (area 4x) and a part 5 wide (area 20)",
    ),

  /* Part H: two related quantities */
  bike: () =>
    graphFig(
      [
        [1, 9],
        [2, 18],
        [3, 27],
        [4, 36],
      ],
      5,
      4,
      9,
      ["hours, t", "miles, d"],
      "A graph of d = 9t: the points (1, 9), (2, 18), (3, 27), and (4, 36)",
    ),
  pay: () =>
    graphFig(
      [
        [1, 3],
        [2, 6],
        [3, 9],
      ],
      4,
      4,
      3,
      ["hours", "dollars"],
      "A graph with the points (1, 3), (2, 6), and (3, 9)",
      { scale: 28 },
    ),

  /* the practice test */
  test1: () =>
    tapeEq(
      [
        [2, "x"],
        [2, "x"],
        [2, "x"],
        [2, "x"],
      ],
      "32",
      "A tape of 4 equal parts, each x, making 32 in all",
    ),
  test5: () =>
    hangerFig(
      { circles: 3 },
      { squares: 15 },
      "A balanced hanger: 3 circles, each x, on the left and 15 unit squares on the right",
    ),
};

/* draw each diagram into its placeholder */
document.querySelectorAll("[data-fig]").forEach((el) => {
  el.insertAdjacentHTML("afterbegin", FIGURES[el.dataset.fig]());
});
