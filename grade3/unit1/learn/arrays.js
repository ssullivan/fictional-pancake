/* Learn Introducing Multiplication (Grade 3 Unit 1), chapter 7: Arrays. Its widgets and steps; loaded by arrays.html. */
/* Steppers for the rows and how many in each row, with the array and its expression. */
function wArr(el) {
  /* the steppers' values: r rows, c in each row */
  const q = Q(el),
    values = { r: 3, c: 5 };
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow">${stepper("r", "Rows")}${stepper("c", "In each row")}</div><p class="readout" data-o></p>`;
  const draw = () => {
    const { r: rows, c: cols } = values;
    q("r").textContent = rows;
    q("c").textContent = cols;
    q("f").innerHTML = arrayFig(rows, cols, { band: "r" });
    q("o").innerHTML =
      `<b>${pl(rows, "row")} of ${cols}</b>: ${rows} × ${cols} = ${rows * cols}.<br><span class="dimline">Each row is a group of ${cols}. Count by ${cols}s: ${countBy(cols, rows)}.</span>`;
  };
  steppers(el, values, { r: [1, 5], c: [1, 10] }, draw);
  draw();
}
/* array stories: t its button, r rows of c, u the unit, s the story */
const AS = [
  { t: "Chairs", r: 5, c: 6, u: "chairs", s: "5 rows of chairs, with 6 chairs in each row" },
  { t: "Eggs", r: 2, c: 6, u: "eggs", s: "An egg carton with 2 rows of 6 eggs" },
  { t: "Garden", r: 4, c: 7, u: "plants", s: "A garden with 4 rows of 7 plants" },
  { t: "Stamps", r: 3, c: 8, u: "stamps", s: "A sheet of stamps, 3 rows of 8" },
];
/* Pick an array story and count it one row at a time. */
function wStory(el) {
  /* rowsCounted: how many rows have been counted so far */
  const q = Q(el);
  let storyIndex = 0,
    rowsCounted = 0;
  el.innerHTML =
    seg(
      "Story",
      AS.map((story, i) => [i, story.t]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Count a row</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-o></p>`;
  const draw = () => {
    const { r: rows, c: cols, u: unit, s: say } = AS[storyIndex];
    press(el, storyIndex);
    q("go").disabled = rowsCounted === rows;
    q("f").innerHTML = arrayFig(rows, cols, {
      band: "r",
      k: rowsCounted,
      sum: true,
      label: `${say}: ${rows} rows of ${cols}`,
    });
    q("o").innerHTML =
      `${say}.<br>` +
      (!rowsCounted
        ? "How many in all? Tap Count a row."
        : `Count by ${cols}s: ${countBy(cols, rowsCounted)}` +
          (rowsCounted === rows ? `.<br><span class="ok">${rows} × ${cols} = ${rows * cols} ${unit}.</span>` : "…"));
  };
  q("go").onclick = () => {
    rowsCounted++;
    draw();
  };
  q("clr").onclick = () => {
    rowsCounted = 0;
    draw();
  };
  el.addEventListener("click", (e) => {
    const storyBtn = e.target.closest("[data-m]");
    if (storyBtn) {
      storyIndex = +storyBtn.dataset.m;
      rowsCounted = 0;
      draw();
    }
  });
  draw();
}
/* the quick checks' figures */
const F = {
  a46: arrayFig(4, 6),
};
const STEPS = [
  {
    title: "Arrays",
    widget: wArr,
    body: "<p>An <b>array</b> puts things in equal <b>rows</b> (across) and <b>columns</b> (up and down). Each row is a group, so 3 rows of 5 is 3 × 5.</p><p>Change the rows and how many are in each row.</p>",
    check: {
      kind: "mc",
      q: "Which expression matches this array?",
      fig: F.a46,
      choices: [
        { id: "a", label: "4 + 6" },
        { id: "b", label: "6 + 6 + 6" },
        { id: "c", label: "4 × 6" },
      ],
      answer: "c",
      why: {
        a: "That adds a row and a column. There are 4 rows of 6.",
        b: "That’s only 3 rows of 6. Count the rows again.",
      },
      explain: "4 rows with 6 in each row: 4 × 6. That’s 6 + 6 + 6 + 6 = 24.",
    },
  },
  {
    title: "Solve array problems",
    widget: wStory,
    body: "<p>Lots of things come in arrays: chairs in rows, eggs in a carton, plants in a garden. Multiply the rows by how many are in each row.</p><p>Pick a story, then count it one row at a time.</p>",
    check: {
      kind: "num",
      q: "A muffin pan has 3 rows with 4 muffins in each row. How many muffins does it hold?",
      answer: 12,
      unit: "muffins",
      misc: [
        [7, "You added 3 + 4. Multiply: 3 rows of 4."],
        [3, "That’s the number of rows. Each row has 4."],
        [4, "That’s one row. There are 3 rows."],
      ],
      explain: "3 rows of 4: 3 × 4 = 12. Count by 4s: 4, 8, 12.",
    },
  },
];
