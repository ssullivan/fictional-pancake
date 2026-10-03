/* Learn Adding, Subtracting, and Working with Data (Grade 2 Unit 1), chapter 2: Add your way. Its widgets and steps; loaded by add-your-way.html. */
/* Make a ten: a button moves blue counters into the first ten-frame until it's full. */
function wMakeTen(el) {
  /* moved: the blue counters have moved over */
  const q = Q(el),
    PAIRS = [
      [9, 5],
      [8, 6],
      [7, 5],
      [8, 7],
    ];
  let pairIndex = 0,
    moved = false;
  el.innerHTML =
    seg(
      "Numbers",
      PAIRS.map(([a, b], i) => [i, `${a} + ${b}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* need: how many the first frame needs to make 10 */
    const [a, b] = PAIRS[pairIndex],
      need = 10 - a;
    press(el, pairIndex);
    const cells = moved
      ? [...cellsOf([a, "a"], [need, "b moved"]), ...cellsOf([b - need, "b"])]
      : [...cellsOf([a, "a"], [need, null]), ...cellsOf([b, "b"])];
    q("f").innerHTML = tenFrames(cells, {
      label: moved
        ? `10 in the first frame and ${b - need} in the second`
        : `${a} yellow in the first frame and ${b} blue in the second`,
    });
    q("go").textContent = moved ? "Move them back" : `Move ${need} to make a ten`;
    q("r").innerHTML = moved
      ? `<span class="ok"><b>${a} + ${b} = 10 + ${b - need} = ${a + b}</b></span><br><span class="dimline">${need} blue moved over to fill the first frame. ${b - need} are left.</span>`
      : `<b>${a} + ${b}</b><br><span class="dimline">The first frame needs ${need} more to make a ten.</span>`;
  };
  el.addEventListener("click", (e) => {
    const pairBtn = e.target.closest("[data-m]");
    if (pairBtn) {
      pairIndex = +pairBtn.dataset.m;
      moved = false;
      draw();
    }
  });
  q("go").onclick = () => {
    moved = !moved;
    draw();
  };
  draw();
}
/* Doubles and one more: two rows of cubes, the same length or one longer (a stepper sets the length). */
function wDoubles(el) {
  /* the stepper's value: n cubes in the top row; plusOne: the bottom row has one more */
  const q = Q(el),
    values = { n: 6 };
  let plusOne = false;
  el.innerHTML =
    `<div class="wrow">${stepper("n", "Cubes")}</div>` +
    seg("Kind", [
      ["d", "Double"],
      ["m", "One more"],
    ]) +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { n } = values,
      bottom = plusOne ? n + 1 : n;
    q("n").textContent = n;
    press(el, plusOne ? "m" : "d");
    q("f").innerHTML = svgWrap(
      10 * CUBE + 8,
      2 * CUBE + 12,
      cubes(4, 4, n, "a") +
        cubes(4, CUBE + 8, bottom, "b") +
        (plusOne
          ? `<rect class="extra" x="${4 + n * CUBE - 2}" y="${CUBE + 6}" width="${CUBE + 2}" height="${CUBE + 2}" rx="5"/>`
          : ""),
      `${n} yellow cubes above ${bottom} blue cubes`,
    );
    q("r").innerHTML = plusOne
      ? `<b>${n} + ${bottom} = ${n + bottom}</b><br><span class="dimline">${n} + ${n} = ${2 * n}, and 1 more makes ${n + bottom}.</span>`
      : `<b>${n} + ${n} = ${2 * n}</b><br><span class="dimline">A double: two rows the same length.</span>`;
  };
  steppers(el, values, { n: [1, 9] }, draw);
  el.addEventListener("click", (e) => {
    const kindBtn = e.target.closest("[data-m]");
    if (kindBtn) {
      plusOne = kindBtn.dataset.m === "m";
      draw();
    }
  });
  draw();
}
/* this chapter's quick-check figures (common.js has the shared ones) */
Object.assign(F, {
  make86: tenFrames([...cellsOf([8, "a"], [2, null]), ...cellsOf([6, "b"])], {
    label: "8 yellow in the first frame and 6 blue in the second",
  }),
});
const STEPS = [
  {
    title: "Make a ten",
    widget: wMakeTen,
    body: "<p>10 is easy to add to. To add 9 + 5, move 1 of the 5 over to make 10. Then 10 + 4 = 14.</p><p>Pick numbers, then move counters to fill the first frame.</p>",
    check: {
      kind: "mc",
      q: "Which is the same as <b>8 + 6</b>?",
      fig: F.make86,
      choices: [
        { id: "a", label: "10 + 4" },
        { id: "b", label: "10 + 6" },
        { id: "c", label: "8 + 10" },
        { id: "d", label: "10 + 2" },
      ],
      answer: "a",
      why: {
        b: "To make 10, 2 of the 6 move over to the 8. That leaves 4, not 6.",
        c: "The 6 doesn’t turn into 10. Move 2 of the 6 over to make the 8 a ten.",
        d: "8 needs 2 more to make a ten. That leaves 4 of the 6, not 2.",
      },
      explain: "8 + 2 = 10, and 4 of the 6 are left: 8 + 6 = 10 + 4 = 14.",
    },
  },
  {
    title: "Doubles and one more",
    widget: wDoubles,
    body: "<p>A <b>double</b> adds a number to itself, like 6 + 6 = 12. If you know a double, you know the one next to it: 6 + 7 is 1 more.</p><p>Change the cubes, then tap One more.</p>",
    check: {
      kind: "num",
      answer: 13,
      q: "You know 6 + 6 = 12. What is <b>6 + 7</b>?",
      misc: [
        [12, "That’s 6 + 6. 7 is 1 more than 6, so the answer is 1 more."],
        [14, "That’s 7 + 7. 6 + 7 is 1 less than that."],
      ],
      explain: "6 + 7 is 6 + 6 and 1 more: 12 + 1 = 13.",
    },
  },
  {
    title: "Tens and ones",
    widget: tensOnesAdd([
      [24, 13],
      [31, 15],
      [26, 17],
    ]),
    body: "<p>To add bigger numbers, add the <b>tens</b> together and the <b>ones</b> together. If there are 10 or more ones, they make a new ten.</p><p>Pick numbers, then put the tens and ones together.</p>",
    check: {
      kind: "num",
      unit: "marbles",
      answer: 37,
      q: "Lin has 23 marbles. Noah gives Lin 14 more marbles. How many marbles does Lin have now?",
      misc: [
        [9, "You subtracted. Lin got more marbles, so add."],
        [27, "You added the ones. Add the tens too: 20 + 10 = 30."],
        [33, "You added the tens. Add the ones too: 3 + 4 = 7."],
      ],
      explain: "Tens: 20 + 10 = 30. Ones: 3 + 4 = 7. 30 + 7 = 37 marbles.",
    },
  },
];
