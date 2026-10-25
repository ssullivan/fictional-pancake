/* The Unit 2 study guide (study.html): its diagrams. Each <figure data-fig="name"> in the page gets the picture FIGURES[name]
   draws, with shared/study.js's Diagram and doubleLine: laid out in units with y going up, and drawn as inline SVG with the
   classes styled in shared/study.css (sh and sh2 the two kinds of thing in a ratio, frame a dashed outline, lb a label, …).
   Nothing else uses this file. */

/* A diagram of a ratio as shapes: `groups` equal groups, each with `circles` circles over `squares` squares, in dashed
   frames when `framed`. names: the two rows' names, written to their left. */
function groupsFig(
  groups,
  circles,
  squares,
  label,
  { names = ["circles", "squares"], framed = true, scale = 22 } = {},
) {
  /* each shape takes 1 unit; groups are groupGap apart; circles sit on y = circleY, and squares fill 0.2…0.96 */
  const across = Math.max(circles, squares),
    groupGap = 0.6,
    groupWidth = across + groupGap,
    width = groups * groupWidth - groupGap,
    circleY = 1.7,
    squareY = 0.58,
    d = new Diagram(-0.2, width + 0.2, -0.2, 2.4, scale, { pad: 14, label, left: namesWidth(names) });
  for (let g = 0; g < groups; g++) {
    const left = g * groupWidth;
    if (framed) d.box(left - 0.15, -0.15, across + 0.3, 2.4, "frame");
    for (let i = 0; i < circles; i++) d.circle([left + i + 0.5, circleY], 0.38);
    for (let i = 0; i < squares; i++) d.box(left + i + 0.12, 0.2, 0.76, 0.76, "sh2");
  }
  return d
    .text([-0.2, circleY], names[0], { dx: -8, dy: 5, cls: "lb sm", anchor: "end" })
    .text([-0.2, squareY], names[1], { dx: -8, dy: 5, cls: "lb sm", anchor: "end" })
    .svg();
}

/* A tape diagram: one row of equal boxes for each [name, count, words] in rows (the name on its left, words in every box,
   blue when `hl`), and a bracket on the right around all of them with the total beside it. */
function tapeFig(rows, total, label, { scale = 34, hl = false } = {}) {
  /* rows go down from the top, each rowHeight tall and rowGap apart; the bracket stands bracketGap past the longest row */
  const rowHeight = 0.8,
    rowGap = 0.4,
    height = rows.length * rowHeight + (rows.length - 1) * rowGap,
    longest = Math.max(...rows.map(([, count]) => count)),
    bracketX = longest + 0.3,
    nub = 0.15,
    d = new Diagram(0, bracketX + nub, 0, height, scale, {
      pad: 14,
      label,
      left: namesWidth(rows.map(([name]) => name)),
      /* room for the total, in full-size labels (about 8.6 pixels a letter) */
      right: 12 + 8.6 * total.length,
    });
  rows.forEach(([name, count, words], row) => {
    const bottom = height - rowHeight - row * (rowHeight + rowGap),
      middle = bottom + rowHeight / 2;
    for (let i = 0; i < count; i++) {
      d.box(i, bottom, 1, rowHeight, row ? "sh2" : "sh");
      if (words) d.text([i + 0.5, middle], words, { dy: 5, cls: hl ? "lb sm hl" : "lb sm" });
    }
    d.text([0, middle], name, { dx: -8, dy: 5, cls: "lb sm", anchor: "end" });
  });
  /* the bracket: a line down the right with short ends turned in toward the boxes and a nub out toward the total */
  return d
    .line([bracketX, 0], [bracketX, height])
    .line([bracketX - nub, height], [bracketX, height])
    .line([bracketX - nub, 0], [bracketX, 0])
    .line([bracketX, height / 2], [bracketX + nub, height / 2])
    .text([bracketX + nub, height / 2], total, { dx: 6, dy: 5, anchor: "start" })
    .svg();
}

const FIGURES = {
  /* Part A: ratios */
  groupsExample: () =>
    groupsFig(3, 2, 3, "6 circles and 9 squares in 3 equal groups, each with 2 circles and 3 squares"),
  shapesA1: () => groupsFig(1, 4, 6, "A row of 4 circles over a row of 6 squares", { framed: false }),

  /* Part B: equivalent ratios */
  batches: () =>
    groupsFig(3, 2, 5, "3 batches of lemonade, each with 2 scoops of mix and 5 cups of water", {
      names: ["scoops of mix", "cups of water"],
      scale: 18,
    }),

  /* Part C: double number lines */
  apples: () =>
    doubleLine(
      ["pounds", "cost ($)"],
      [
        [0, "0", "0"],
        [1, "1", "3"],
        [2, "2", "6"],
        [3, null, null],
        [4, null, null],
        [5, "5", "15"],
      ],
      "A double number line: 5 pounds of apples cost 15 dollars, so 1 pound costs 3 dollars and 2 pounds cost 6",
      { hl: [1, 2] },
    ),
  flourC1: () =>
    doubleLine(
      ["cups of flour", "cups of sugar"],
      [
        [0, "0", "0"],
        [3, "3", "2"],
        [6, "6", "_"],
        [9, "9", "_"],
        [12, "12", "_"],
      ],
      "A double number line: 0, 3, 6, 9, and 12 cups of flour on top; 0 and 2 cups of sugar below, then three boxes to fill in",
      { length: 7, scale: 38 },
    ),

  /* Part F: part-part-whole */
  tapeExample: () =>
    tapeFig(
      [
        ["dogs", 2, "5"],
        ["cats", 3, "5"],
      ],
      "25 animals",
      "A tape diagram: 2 boxes for dogs and 3 boxes for cats, 25 animals in all, with 5 in each box",
      { hl: true },
    ),
  trailMix: () =>
    tapeFig(
      [
        ["raisins", 3, ""],
        ["peanuts", 4, ""],
      ],
      "28 cups",
      "A tape diagram: 3 boxes for raisins and 4 boxes for peanuts, 28 cups in all",
      { scale: 30 },
    ),

  /* the practice test */
  test2: () => groupsFig(1, 8, 12, "A row of 8 circles over a row of 12 squares", { framed: false, scale: 17 }),
  test6: () =>
    doubleLine(
      ["minutes", "laps"],
      [
        [0, "0", "0"],
        [4, "4", "3"],
        [8, "8", "_"],
        [12, "12", "_"],
        [16, "16", "_"],
        [20, "20", "_"],
      ],
      "A double number line: 0, 4, 8, 12, 16, and 20 minutes on top; 0 and 3 laps below, then four boxes to fill in",
      { length: 7.5, scale: 38 },
    ),
  test13: () =>
    tapeFig(
      [
        ["fiction", 4, ""],
        ["nonfiction", 1, ""],
      ],
      "30 books",
      "A tape diagram: 4 boxes for fiction books and 1 box for nonfiction books, 30 books in all",
    ),
};

/* draw each diagram into its placeholder */
document.querySelectorAll("[data-fig]").forEach((el) => {
  el.insertAdjacentHTML("afterbegin", FIGURES[el.dataset.fig]());
});
