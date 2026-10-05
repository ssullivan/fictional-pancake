/* Learn Area and Multiplication (Grade 3 Unit 2), chapter 2: Tile rectangles. Its widgets and steps; loaded by tile-rectangles.html. */
/* rectangles to tile, as [rows, squares in each row] */
const TILE_RECTS = [
  [3, 5],
  [4, 6],
  [5, 4],
];
/* Lay tiles on a rectangle one row at a time, counting by rows. */
function wRows(el) {
  /* rowsLaid: how many rows of tiles are down so far */
  const q = Q(el);
  let rectIndex = 0,
    rowsLaid = 0;
  el.innerHTML =
    seg(
      "Rectangle",
      TILE_RECTS.map(([rows, cols], i) => [i, `${rows} rows of ${cols}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-add>Add a row</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-o></p>`;
  const draw = () => {
    const [rows, cols] = TILE_RECTS[rectIndex],
      area = rows * cols;
    press(el, rectIndex);
    q("add").disabled = rowsLaid === rows;
    q("f").innerHTML = tilingFig(rows, cols, { k: rowsLaid });
    q("o").innerHTML = !rowsLaid
      ? `Each row holds ${cols} tiles. Tap Add a row.`
      : rowsLaid < rows
        ? `${pl(rowsLaid, "row")} of ${cols}. Count by ${cols}s: ${countBy(cols, rowsLaid)}. That’s ${rowsLaid * cols} tiles so far.`
        : `${rows} rows of ${cols}. Count by ${cols}s: ${countBy(cols, rows)}.<br><span class="ok">${rows} × ${cols} = ${area} tiles. The area is ${area} square units.</span>`;
  };
  onPick(el, (id) => {
    rectIndex = +id;
    rowsLaid = 0;
    draw();
  });
  q("add").onclick = () => {
    rowsLaid++;
    draw();
  };
  q("clr").onclick = () => {
    rowsLaid = 0;
    draw();
  };
  draw();
}
/* rectangles that are only partly tiled, as [rows, squares in each row] */
const PART_RECTS = [
  [4, 6],
  [5, 3],
  [3, 8],
];
/* A rectangle with only its top row (and maybe its left side) tiled: picture the rest, then show it. */
function wPicture(el) {
  /* how: which tiles are down ('edges' the top row and left side, 'row' just the top row); shown: every tile is showing */
  const q = Q(el);
  let rectIndex = 0,
    how = "edges",
    shown = false;
  el.innerHTML =
    `<div data-top>${seg(
      "Rectangle",
      PART_RECTS.map((rect, i) => [i, `Rectangle ${i + 1}`]),
    )}</div><div data-bot>${seg("Tiles drawn", [
      ["edges", "Top row and side"],
      ["row", "Top row only"],
    ])}</div>` +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-show></button></div><p class="readout" data-o></p>`;
  const draw = () => {
    const [rows, cols] = PART_RECTS[rectIndex],
      area = rows * cols;
    press(q("top"), rectIndex);
    press(q("bot"), how);
    q("show").textContent = toggleLabel(shown, "rest of the tiles");
    q("f").innerHTML = tilingFig(rows, cols, { how: shown ? "fair" : how });
    q("o").innerHTML =
      `The top row has ${cols} tiles, so every row has ${cols}. ` +
      (how === "edges"
        ? `The left side has ${rows} tiles, so there are ${rows} rows.`
        : `The marks on the left side show ${rows} rows.`) +
      `<br><span class="ok">${rows} × ${cols} = ${area} tiles cover it.</span>` +
      (shown ? ` All ${area} are showing now.` : "");
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (row === "top") rectIndex = +id;
    if (row === "bot") how = id;
    if (row) {
      shown = false;
      draw();
    }
  });
  q("show").onclick = () => {
    shown = !shown;
    draw();
  };
  draw();
}
/* the quick checks' figures */
const F = {
  r47: tilingFig(4, 7),
  part: tilingFig(5, 6, { how: "edges" }),
};
const STEPS = [
  {
    title: "Rows of tiles",
    widget: wRows,
    body: "<p>Tiles on a rectangle line up in equal <b>rows</b>. So you don’t have to count them one by one: count by rows, or multiply the number of rows by the tiles in each row.</p><p>Pick a rectangle and lay the tiles one row at a time.</p>",
    check: {
      kind: "num",
      q: "What is the area of this rectangle?",
      fig: F.r47,
      answer: 28,
      unit: "square units",
      misc: [
        [11, "You added 4 + 7. Multiply: 4 rows of 7."],
        [22, "That’s the distance around. Count the squares inside."],
        [7, "That’s one row. There are 4 rows."],
      ],
      explain: "4 rows of 7 squares: 4 × 7 = 28 square units. Count by 7s: 7, 14, 21, 28.",
    },
  },
  {
    title: "Picture the missing tiles",
    widget: wPicture,
    body: "<p>You don’t need every tile to find the area. The top row shows how many fit in each row, and the side shows how many rows there are.</p><p>Pick a rectangle, picture the tiles that aren’t there, then show them.</p>",
    check: {
      kind: "num",
      q: "How many tiles will cover the whole rectangle?",
      fig: F.part,
      answer: 30,
      unit: "tiles",
      misc: [
        [10, "That’s only the tiles drawn so far. Picture the rest."],
        [11, "You added 5 + 6. Multiply: 5 rows of 6."],
        [22, "That’s the distance around. Count the tiles that cover it."],
      ],
      explain: "The top row has 6 tiles and the side has 5 rows: 5 × 6 = 30 tiles.",
    },
  },
];
