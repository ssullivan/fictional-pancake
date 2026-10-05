/* Learn Area and Multiplication (Grade 3 Unit 2), chapter 1: What is area? Its widgets and steps; loaded by what-is-area.html. */
/* pairs of shapes to compare, as [col, row] squares: a long thin one and a square (the square covers more), and two different
   shapes that cover the same */
const PAIRS = [
  {
    t: "Pair 1",
    shapes: [range(8).map((c) => [c, 1]), range(9).map((i) => [i % 3, Math.floor(i / 3)])],
  },
  {
    t: "Pair 2",
    shapes: [
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [1, 2],
        [2, 2],
      ],
    ],
  },
];
/* Tap squares to cover two shapes with tiles, then compare how many each one takes. */
function wCover(el) {
  /* covered: for each shape, the indexes of its squares tiled so far */
  const q = Q(el);
  let pairIndex = 0,
    covered = [[], []];
  el.innerHTML =
    seg(
      "Shapes",
      PAIRS.map((pair, i) => [i, pair.t]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-all>Cover them all</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-o></p>`;
  const draw = () => {
    const shapes = PAIRS[pairIndex].shapes,
      done = shapes.map((cells, s) => covered[s].length === cells.length);
    press(el, pairIndex);
    q("f").innerHTML = cellsFig(shapes, { on: covered, tap: "cell" });
    const line = (s) =>
      done[s]
        ? `Shape ${"AB"[s]}: covered with <b>${shapes[s].length} squares</b> ✓`
        : `Shape ${"AB"[s]}: ${pl(covered[s].length, "square")} covered so far.`;
    const [sizeA, sizeB] = shapes.map((cells) => cells.length),
      compare =
        sizeA === sizeB
          ? `They look different, but they cover the same space: both areas are ${sizeA} square units.`
          : `Shape ${sizeA > sizeB ? "A" : "B"} covers more space: its area is bigger.`;
    q("o").innerHTML =
      `${line(0)}<br>${line(1)}` +
      (done[0] && done[1]
        ? `<br><span class="ok">${compare}</span>`
        : '<br><span class="dimline">Tap each square to cover it with a tile.</span>');
  };
  el.addEventListener("click", (e) => {
    const square = e.target.closest("[data-i]");
    if (square) {
      /* a tap tiles a square, or takes its tile off again */
      const [s, i] = square.dataset.i.split(".").map(Number);
      covered[s] = covered[s].includes(i) ? covered[s].filter((j) => j !== i) : [...covered[s], i];
      draw();
    }
  });
  onPick(el, (id) => {
    pairIndex = +id;
    covered = [[], []];
    draw();
  });
  q("all").onclick = () => {
    covered = PAIRS[pairIndex].shapes.map((cells) => range(cells.length));
    draw();
  };
  q("clr").onclick = () => {
    covered = [[], []];
    draw();
  };
  draw();
}
/* ways to lay tiles on a rectangle 3 rows of 4, and what each count says */
const WAYS = [
  ["fair", "No gaps or overlaps"],
  ["gaps", "Gaps"],
  ["overlap", "Overlaps"],
  ["mixed", "Different sizes"],
];
/* Lay tiles on a rectangle four ways, and see which count is its area. */
function wFair(el) {
  const q = Q(el),
    rows = 3,
    cols = 4;
  let how = "fair";
  el.innerHTML = seg("Tiles", WAYS) + `<div class="fig" data-f></div><p class="readout" data-o></p>`;
  const draw = () => {
    const count = tilesLaid(rows, cols, how).length;
    press(el, how);
    q("f").innerHTML = tilingFig(rows, cols, { how });
    q("o").innerHTML = {
      fair: `<span class="ok">${count} tiles, all the same size, with no gaps or overlaps. The area is ${count} square units.</span>`,
      gaps: `Only ${count} tiles, with gaps between them. Some of the rectangle isn’t covered, so <span class="no">${count} is too small</span>.`,
      overlap: `${count} tiles, but they overlap, so some space is counted twice. <span class="no">${count} is too big</span>.`,
      mixed: `${count} tiles, but the pink one is as big as 4 small ones. Tiles of different sizes <span class="no">don’t give the area</span>.`,
    }[how];
  };
  onPick(el, (id) => {
    how = id;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  compare: cellsFig([
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [4, 1],
      [5, 1],
    ],
  ]),
  mixed: tilingFig(3, 5, { how: "mixed" }),
};
const STEPS = [
  {
    title: "Area is the space a shape covers",
    widget: wCover,
    body: "<p>The <b>area</b> of a flat shape is how much space it covers. One way to measure it: cover the shape with squares that are all the same size, and count them. Each square is 1 <b>square unit</b>.</p><p>Tap the squares to cover both shapes. Which one covers more?</p>",
    check: {
      kind: "mc",
      q: "Which shape has the bigger area?",
      fig: F.compare,
      choices: [
        { id: "a", label: "Shape A" },
        { id: "b", label: "Shape B" },
        { id: "c", label: "They’re the same" },
      ],
      answer: "b",
      why: {
        a: "Shape A looks bigger, but count the squares: A has 7 and B has 8.",
        c: "Count the squares in each: A has 7 and B has 8.",
      },
      explain: "Shape A covers 7 squares and shape B covers 8, so B has the bigger area.",
    },
  },
  {
    title: "No gaps, no overlaps",
    widget: wFair,
    body: "<p>Counting tiles only gives the area when the tiles are all the same size, with <b>no gaps</b> (spaces left uncovered) and <b>no overlaps</b> (tiles on top of each other).</p><p>Try each way of laying tiles on the same rectangle.</p>",
    check: {
      kind: "num",
      q: "Tyler covered this rectangle with tiles. The pink tile is as big as 4 small ones. What is the area in small squares?",
      fig: F.mixed,
      answer: 15,
      unit: "square units",
      misc: [
        [12, "That counts the pink tile as 1. It covers 4 small squares."],
        [16, "That’s the distance around. Count the squares that cover it."],
      ],
      explain: "The pink tile covers 4 small squares, and there are 11 small tiles: 4 + 11 = 15. That’s 3 rows of 5.",
    },
  },
];
