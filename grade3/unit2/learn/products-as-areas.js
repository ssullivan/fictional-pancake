/* Learn Area and Multiplication (Grade 3 Unit 2), chapter 3: Products as areas. Its widgets and steps; loaded by products-as-areas.html. */
/* Steppers for the rows and the squares in each row, with the rectangle and its area. */
function wBuild(el) {
  /* the steppers' values: r rows, c squares in each row */
  const q = Q(el),
    values = { r: 4, c: 6 };
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow">${stepper("r", "Rows")}${stepper("c", "In each row")}</div><p class="readout" data-o></p>`;
  const draw = () => {
    const { r: rows, c: cols } = values;
    q("r").textContent = rows;
    q("c").textContent = cols;
    q("f").innerHTML = tilingFig(rows, cols);
    q("o").innerHTML =
      `<b>${pl(rows, "row")} of ${cols}</b>: ${rows} × ${cols} = ${pl(rows * cols, "square unit")}.` +
      (rows !== cols
        ? `<br><span class="dimline">Turned on its side, it’s ${pl(cols, "row")} of ${rows}: ${cols} × ${rows} = ${rows * cols} too.</span>`
        : '<br><span class="dimline">The rows and columns match: it’s a square.</span>');
  };
  steppers(el, values, { r: [1, 10], c: [1, 10] }, draw);
  draw();
}
/* areas to make, and the rectangles that make each one, as [rows, squares in each row] (each with its turned partner) */
const SAME_AREA = {
  12: [
    [2, 6],
    [3, 4],
    [4, 3],
    [6, 2],
  ],
  18: [
    [2, 9],
    [3, 6],
    [6, 3],
    [9, 2],
  ],
  24: [
    [3, 8],
    [4, 6],
    [6, 4],
    [8, 3],
  ],
};
/* Pick an area and step through the rectangles that have it. */
function wSame(el) {
  /* rectIndex: which of the area's rectangles is showing */
  const q = Q(el);
  let area = 12,
    rectIndex = 0;
  el.innerHTML =
    seg(
      "Area",
      Object.keys(SAME_AREA).map((a) => [a, `${a} square units`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-next>Next rectangle</button></div><p class="readout" data-o></p>`;
  const draw = () => {
    const rects = SAME_AREA[area],
      [rows, cols] = rects[rectIndex],
      others = rects.filter((rect, i) => i !== rectIndex).map(([r, c]) => `${r} × ${c}`);
    press(el, area);
    q("f").innerHTML = tilingFig(rows, cols);
    q("o").innerHTML =
      `Rectangle ${rectIndex + 1} of ${rects.length}: <b>${rows} rows of ${cols}</b>. ${rows} × ${cols} = ${area} square units.` +
      `<br><span class="dimline">These have an area of ${area} too: ${others.join(", ")}.</span>`;
  };
  onPick(el, (id) => {
    area = +id;
    rectIndex = 0;
    draw();
  });
  q("next").onclick = () => {
    rectIndex = (rectIndex + 1) % SAME_AREA[area].length;
    draw();
  };
  draw();
}
/* the quick checks' figures */
const F = {
  r37: tilingFig(3, 7),
  r45: tilingFig(4, 5),
  r46: tilingFig(4, 6),
  r35: tilingFig(3, 5),
};
const STEPS = [
  {
    title: "A rectangle is a multiplication",
    widget: wBuild,
    body: "<p>A rectangle of squares is like an array: it has equal rows. A rectangle with 4 rows of 6 squares has an area of <b>4 × 6</b> square units.</p><p>Change the rows and the squares in each row.</p>",
    check: {
      kind: "mc",
      q: "Which expression gives the area of this rectangle in square units?",
      fig: F.r37,
      choices: [
        { id: "a", label: "3 + 7" },
        { id: "b", label: "3 × 7" },
        { id: "c", label: "2 × 7" },
      ],
      answer: "b",
      why: {
        a: "That adds. Area is the rows times the squares in each row.",
        c: "Count the rows again: there are 3.",
      },
      explain: "3 rows of 7 squares: 3 × 7 = 21 square units.",
    },
  },
  {
    title: "Same area, different rectangles",
    widget: wSame,
    body: "<p>Different rectangles can have the same area. 12 squares make 2 rows of 6, or 3 rows of 4. Turn a rectangle on its side and its area stays the same: 3 × 4 = 4 × 3.</p><p>Pick an area, then step through its rectangles.</p>",
    check: {
      kind: "mc",
      q: "Which rectangle has an area of 20 square units?",
      choices: [
        { id: "a", label: F.r46 },
        { id: "b", label: F.r35 },
        { id: "c", label: F.r45 },
      ],
      answer: "c",
      why: {
        a: "That’s 4 rows of 6: 4 × 6 = 24 square units.",
        b: "That’s 3 rows of 5: 3 × 5 = 15 square units.",
      },
      explain: "4 rows of 5 squares: 4 × 5 = 20 square units.",
    },
  },
];
