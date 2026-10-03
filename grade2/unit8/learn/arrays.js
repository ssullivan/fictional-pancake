/* Learn Equal Groups (Grade 2 Unit 8), chapter 3: Arrays. Its widgets and steps; loaded by arrays.html. */
/* counters at [column, row] spots (fractions allowed), for pictures that aren't arrays; spaced like arrayFig's */
function spots(points, label) {
  const cols = Math.max(...points.map((point) => point[0])) + 1,
    rows = Math.max(...points.map((point) => point[1])) + 1;
  const gap = ARRAY.g,
    pad = ARRAY.pad;
  return svgWrap(
    2 * pad + cols * gap,
    2 * pad + rows * gap,
    points.map(([x, y]) => ctr(pad + gap / 2 + x * gap, pad + gap / 2 + y * gap, "a", 16)).join(""),
    label,
  );
}
/* An array (a stepper for the rows and one for the columns), said both ways. */
function wArray(el) {
  const q = Q(el),
    values = { rows: 3, cols: 4 };
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow">${stepper("rows", "Rows")}${stepper("cols", "Columns")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const { rows, cols } = values;
    q("rows").textContent = rows;
    q("cols").textContent = cols;
    q("f").innerHTML = arrayFig(rows, cols);
    q("r").innerHTML =
      `<b>${pl(rows, "row")} of ${cols}</b>: ${cols} in each row.<br><span class="dimline">${pl(cols, "column")} of ${rows}: ${rows} in each column. ${rows * cols} in all.</span>`;
  };
  steppers(el, values, { rows: [1, 5], cols: [1, 5] }, draw);
  draw();
}
/* arrays as [rows, columns] */
const RC = [
  [3, 4],
  [2, 5],
  [4, 3],
  [5, 5],
];
/* Tap a counter in an array to see its row and column. */
function wRowsCols(el) {
  /* picked: the counter tapped as [row, column] (null before one is) */
  const q = Q(el);
  let arrayIndex = 0,
    picked = null;
  el.innerHTML =
    seg(
      "Array",
      RC.map(([rows, cols], i) => [i, `${rows} rows of ${cols}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [rows, cols] = RC[arrayIndex];
    press(el, arrayIndex);
    q("f").innerHTML = arrayFig(rows, cols, {
      hi: picked,
      tap: true,
      label: `An array: ${rows} rows with ${cols} in each row. Tap a counter.`,
    });
    q("r").innerHTML = !picked
      ? `${rows} rows of ${cols}. Tap any counter.`
      : `This counter is in <b>row ${picked[0] + 1}</b> and <b>column ${picked[1] + 1}</b>.<br><span class="dimline">Its row goes across and has ${cols}. Its column goes up and down and has ${rows}.</span>`;
  };
  el.addEventListener("click", (e) => {
    const arrayBtn = e.target.closest("[data-m]"),
      counter = e.target.closest("[data-i]");
    if (arrayBtn) {
      arrayIndex = +arrayBtn.dataset.m;
      picked = null;
      draw();
    }
    /* counters are numbered across each row */
    else if (counter) {
      const cols = RC[arrayIndex][1];
      picked = [Math.floor(counter.dataset.i / cols), counter.dataset.i % cols];
      draw();
    }
  });
  draw();
}
/* arrays to count, as [rows, columns] */
const CNT = [
  [3, 5],
  [4, 2],
  [2, 4],
  [5, 3],
];
/* Count an array one row or one column at a time, with a running total. */
function wCount(el) {
  /* mode: 'r' counting rows, 'c' columns (null before either); counted: how many so far */
  const q = Q(el);
  let arrayIndex = 0,
    mode = null,
    counted = 0;
  el.innerHTML =
    seg(
      "Array",
      CNT.map(([rows, cols], i) => [i, `${rows} rows of ${cols}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-br>Count a row</button><button type="button" class="btn" data-bc>Count a column</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* lines: how many rows or columns there are to count; each: how many are in one; word: 'row' or 'column' */
    const [rows, cols] = CNT[arrayIndex],
      lines = mode === "r" ? rows : cols,
      each = mode === "r" ? cols : rows,
      word = mode === "r" ? "row" : "column";
    press(el, arrayIndex);
    q("f").innerHTML = arrayFig(rows, cols, mode ? { band: mode, k: counted, sum: true } : {});
    q("r").innerHTML = !mode
      ? `${rows} rows of ${cols}. Count them by rows or by columns.`
      : `Count by ${word}s: <b>${range(counted)
          .map((i) => each * (i + 1))
          .join(", ")}</b>` +
        (counted === lines
          ? `<br><span class="ok">${rows * cols} in all: ${pl(lines, word)} of ${each}.</span>`
          : `<br><span class="dimline">Each ${word} has ${each}. Tap Count a ${word} again.</span>`);
  };
  /* a button counts one more of its kind, or starts over when switching kinds or after the last */
  const countBy = (kind) => () => {
    if (mode !== kind || counted === (kind === "r" ? CNT[arrayIndex][0] : CNT[arrayIndex][1])) {
      mode = kind;
      counted = 1;
    } else counted++;
    draw();
  };
  q("br").onclick = countBy("r");
  q("bc").onclick = countBy("c");
  el.addEventListener("click", (e) => {
    const arrayBtn = e.target.closest("[data-m]");
    if (arrayBtn) {
      arrayIndex = +arrayBtn.dataset.m;
      mode = null;
      counted = 0;
      draw();
    }
  });
  draw();
}
/* the quick checks' figures */
const F = {
  notRows: spots(
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
      [3, 2],
    ],
    "Picture A",
  ),
  rows34: arrayFig(3, 4, { label: "Picture B" }),
  mixed: spots(
    [
      [0.2, 0.1],
      [1.4, 0.3],
      [2.1, 0],
      [3.2, 0.4],
      [0.6, 1.1],
      [1.9, 1.2],
      [2.7, 1.1],
      [0.1, 2],
      [1.2, 1.9],
      [2.3, 2.2],
      [3.4, 1.6],
      [3, 2.6],
    ],
    "Picture C",
  ),
  a43: arrayFig(4, 3),
  a25: arrayFig(2, 5),
};
const STEPS = [
  {
    title: "What is an array?",
    widget: wArray,
    body: "<p>An <b>array</b> is things in <b>rows</b> and <b>columns</b>. Rows go across. Columns go up and down.</p><p>In an array, every row has the same number. Change the rows and columns.</p>",
    check: {
      kind: "mc",
      q: "Which picture is an array?",
      choices: [
        { id: "a", label: F.notRows },
        { id: "b", label: F.rows34 },
        { id: "c", label: F.mixed },
      ],
      answer: "b",
      why: {
        a: "The rows aren’t the same. The middle row has only 3.",
        c: "These counters aren’t in rows and columns.",
      },
      explain: "Picture B has 3 rows with 4 in each row. Every row is the same, so it’s an array.",
    },
  },
  {
    title: "Rows and columns",
    widget: wRowsCols,
    body: "<p>A <b>row</b> goes across, like friends sitting side by side. A <b>column</b> goes up and down, like a stack of blocks.</p><p>Tap any counter to see its row and its column.</p>",
    check: {
      kind: "num",
      answer: 4,
      fig: F.a43,
      q: "How many rows are in this array?",
      misc: [
        [3, "That’s how many columns. Rows go across."],
        [12, "That’s all the counters. Count the rows that go across."],
        [7, "That’s the rows and columns together. Just count the rows."],
      ],
      explain: "There are 4 rows going across, with 3 counters in each row.",
    },
  },
  {
    title: "Count by rows or columns",
    widget: wCount,
    body: "<p>You can count an array <b>by rows</b> or <b>by columns</b>. Add on the number in each row, like 5, 10, 15.</p><p>Tap Count a row or Count a column.</p>",
    check: {
      kind: "num",
      answer: 2,
      fig: F.a25,
      q: "How many counters are in each column?",
      misc: [
        [5, "That’s how many are in each row. Columns go up and down."],
        [10, "That’s all the counters. Look at just one column."],
      ],
      explain: "Each column has 2 counters, one on top of the other. 5 columns of 2 is 10 in all.",
    },
  },
];
