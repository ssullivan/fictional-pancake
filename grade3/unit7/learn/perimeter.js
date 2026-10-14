/* Learn Two-dimensional Shapes and Perimeter (Grade 3 Unit 7), chapter 4: Distance around. Its widgets and steps; loaded by
   perimeter.html. */
/* shapes to walk around: [button, unit squares as [col, row]] */
const WALKS = [
  ["Rectangle", rectCells(2, 3)],
  [
    "L shape",
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ],
  ],
  [
    "U shape",
    [
      [0, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
  ],
];
/* Walk around a shape on a grid one unit length at a time, counting them: the count is the perimeter. */
function wWalk(el) {
  /* walked: how many unit lengths of the outline have been counted */
  const q = Q(el);
  let shapeIndex = 0,
    walked = 0;
  el.innerHTML =
    seg(
      "Shape",
      WALKS.map(([button], i) => [i, button]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Next unit length</button><button type="button" class="ghost-btn" data-all>All the way around</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const cells = WALKS[shapeIndex][1],
      perimeter = perimeterOf(cells),
      done = walked === perimeter;
    press(el, shapeIndex);
    q("go").disabled = done;
    q("all").disabled = done;
    q("f").innerHTML = gridFig(cells, { walk: walked });
    q("r").innerHTML = done
      ? `<span class="ok">All the way around: <b>${perimeter} unit lengths</b>. The perimeter is ${perimeter} units.</span>` +
        `<br><span class="dimline">The shape covers ${pl(cells.length, "square")}: its area is ${cells.length} square units. That’s a different measure.</span>`
      : walked
        ? `${pl(walked, "unit length")} so far. Keep going around.`
        : "Start at the top left corner. Count each unit length as you walk around the outside.";
  };
  q("go").onclick = () => {
    walked++;
    draw();
  };
  q("all").onclick = () => {
    walked = perimeterOf(WALKS[shapeIndex][1]);
    draw();
  };
  q("clr").onclick = () => {
    walked = 0;
    draw();
  };
  onPick(el, (id) => {
    shapeIndex = +id;
    walked = 0;
    draw();
  });
  draw();
}
/* the builder's grid: columns and rows, the squares it starts with (a 2 by 3 rectangle), and the perimeter to make */
const BUILD_COLS = 6,
  BUILD_ROWS = 4,
  START = rectCells(2, 3),
  GOAL = 12;
/* the number of unit lengths around the squares: every side of a square that no other square shares */
const edgesAround = (cells) => {
  const has = (c, r) => cells.some(([x, y]) => x === c && y === r);
  return cells.reduce(
    (sum, [c, r]) => sum + [has(c, r - 1), has(c + 1, r), has(c, r + 1), has(c - 1, r)].filter((x) => !x).length,
    0,
  );
};
/* are the squares all joined side to side? (a search from the first square reaches every one) */
function joinedUp(cells) {
  if (!cells.length) return false;
  const reached = [cells[0]];
  for (let i = 0; i < reached.length; i++) {
    const [c, r] = reached[i];
    cells.forEach((cell) => {
      if (!reached.includes(cell) && Math.abs(cell[0] - c) + Math.abs(cell[1] - r) === 1) reached.push(cell);
    });
  }
  return reached.length === cells.length;
}
/* Tap squares on a grid to add them to a shape or take them away: its area and perimeter change as it does. */
function wBuild(el) {
  /* cells: the squares in the shape, as [col, row] */
  const q = Q(el),
    size = 36,
    pad = 6;
  let cells = START.slice();
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const has = (c, r) => cells.some(([x, y]) => x === c && y === r),
      colX = (c) => pad + c * size,
      rowY = (r) => pad + r * size;
    let squares = "",
      outline = "";
    range(BUILD_ROWS).forEach((r) =>
      range(BUILD_COLS).forEach((c) => {
        squares += `<rect class="${has(c, r) ? "gcell tap" : "gempty"}" data-c="${c}.${r}" x="${colX(c)}" y="${rowY(r)}" width="${size}" height="${size}"/>`;
      }),
    );
    /* the outline: each side of a square in the shape that no other square in it shares */
    cells.forEach(([c, r]) => {
      if (!has(c, r - 1)) outline += `M${colX(c)},${rowY(r)}H${colX(c + 1)}`;
      if (!has(c, r + 1)) outline += `M${colX(c)},${rowY(r + 1)}H${colX(c + 1)}`;
      if (!has(c - 1, r)) outline += `M${colX(c)},${rowY(r)}V${rowY(r + 1)}`;
      if (!has(c + 1, r)) outline += `M${colX(c + 1)},${rowY(r)}V${rowY(r + 1)}`;
    });
    q("f").innerHTML = svgWrap(
      2 * pad + BUILD_COLS * size,
      2 * pad + BUILD_ROWS * size,
      squares + (outline ? `<path class="gline" d="${outline}"/>` : ""),
      `A grid with a shape of ${pl(cells.length, "square")} on it`,
    );
    const perimeter = edgesAround(cells);
    q("r").innerHTML = !cells.length
      ? "Tap squares to make a shape."
      : !joinedUp(cells)
        ? "Keep the squares joined side to side, so the shape is all in one piece."
        : `Area: <b>${cells.length} square units</b>. Perimeter: <b>${perimeter} units</b>.<br>` +
          (perimeter === GOAL
            ? `<span class="ok">A perimeter of ${GOAL} units! Can you find another shape with the same perimeter?</span>`
            : `<span class="dimline">Make a shape with a perimeter of ${GOAL} units.</span>`);
  };
  el.addEventListener("click", (e) => {
    const square = e.target.closest("[data-c]");
    if (!square) return;
    /* a tap adds the square, or takes it away if it's already in the shape */
    const [c, r] = square.dataset.c.split(".").map(Number);
    cells = cells.some(([x, y]) => x === c && y === r)
      ? cells.filter(([x, y]) => !(x === c && y === r))
      : [...cells, [c, r]];
    draw();
  });
  q("clr").onclick = () => {
    cells = START.slice();
    draw();
  };
  draw();
}
/* the quick checks' figures: an L shape to walk around, and three shapes to compare */
const L_SHAPE = [
  [0, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [0, 2],
  [1, 2],
  [2, 2],
];
const F = {
  walk: gridFig(L_SHAPE),
  compare: gridRow([rectCells(2, 3), rectCells(2, 4), rectCells(1, 6)], { letters: true }),
};
const STEPS = [
  {
    title: "Walk around the shape",
    widget: wWalk,
    body: "<p>The <b>perimeter</b> of a shape is the distance all the way around it. On a grid, each side of a square is 1 unit long. Count the unit lengths as you go around the outside.</p><p>Pick a shape and walk around it.</p>",
    check: {
      kind: "num",
      q: "Each side of a square is 1 unit. What is the perimeter of this shape?",
      fig: F.walk,
      answer: 12,
      unit: "units",
      misc: [
        [7, "That counts the squares inside: the area. Count the unit lengths around the outside."],
        [6, "That counts the shape’s sides. Count each unit length: some sides are 2 or 3 units long."],
      ],
      explain: "Going all the way around, there are 12 unit lengths. The perimeter is 12 units.",
    },
  },
  {
    title: "Same perimeter, different shapes",
    widget: wBuild,
    body: "<p>Different shapes can have the same perimeter. Shapes with the same area can have different perimeters, too. Area counts the squares inside. Perimeter counts the unit lengths around.</p><p>Tap squares to change the shape.</p>",
    check: {
      kind: "mc",
      q: "Which shape has a perimeter of 12 units?",
      fig: F.compare,
      choices: [
        { id: "a", label: "Shape A" },
        { id: "b", label: "Shape B" },
        { id: "c", label: "Shape C" },
      ],
      answer: "b",
      why: {
        a: "Shape A’s perimeter is 3 + 2 + 3 + 2 = 10 units.",
        c: "Shape C’s perimeter is 6 + 1 + 6 + 1 = 14 units.",
      },
      explain: "Shape B is 4 units long and 2 units wide: 4 + 2 + 4 + 2 = 12 units.",
    },
  },
];
