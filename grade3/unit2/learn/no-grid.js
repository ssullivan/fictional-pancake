/* Learn Area and Multiplication (Grade 3 Unit 2), chapter 5: Area without a grid. Its widgets and steps; loaded by no-grid.html. */
/* Steppers for a rectangle's length and width, and a button to show the squares inside it. */
function wSides(el) {
  /* the steppers' values: l the length, w the width (in cm); squares: the unit squares are showing */
  const q = Q(el),
    values = { l: 6, w: 4 };
  let squares = false;
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow">${stepper("l", "Length")}${stepper("w", "Width")}<button type="button" class="ghost-btn" data-sq></button></div><p class="readout" data-o></p>`;
  const draw = () => {
    const { l: length, w: width } = values;
    q("l").textContent = length;
    q("w").textContent = width;
    q("sq").textContent = toggleLabel(squares, "squares");
    q("f").innerHTML = rectFig(length, width, { unit: "cm", grid: squares });
    q("o").innerHTML =
      `${length} cm long and ${width} cm wide. Picture ${pl(width, "row")} of ${pl(length, "square centimeter")}.` +
      `<br><span class="ok">${width} × ${length} = ${pl(length * width, "square centimeter")}.</span>`;
  };
  steppers(el, values, { l: [1, 10], w: [1, 10] }, draw);
  q("sq").onclick = () => {
    squares = !squares;
    draw();
  };
  draw();
}
/* rectangles to measure: length, width, and the unit on the rulers */
const RULER_RECTS = [
  [6, 3, "cm"],
  [5, 2, "in"],
  [8, 4, "cm"],
];
/* Measure a rectangle's sides with rulers, then multiply. */
function wRuler(el) {
  /* read: [top, side], which sides have been measured */
  const q = Q(el);
  let rectIndex = 0,
    read = [false, false];
  el.innerHTML =
    seg(
      "Rectangle",
      RULER_RECTS.map((rect, i) => [i, `Rectangle ${i + 1}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-rtop>Measure the top</button><button type="button" class="btn" data-rside>Measure the side</button></div><p class="readout" data-o></p>`;
  const draw = () => {
    const [length, width, unit] = RULER_RECTS[rectIndex],
      word = unit === "cm" ? "centimeters" : "inches";
    press(el, rectIndex);
    q("rtop").disabled = read[0];
    q("rside").disabled = read[1];
    q("f").innerHTML = rulerRect(length, width, unit, { read });
    q("o").innerHTML =
      `Top: ${read[0] ? `<b>${length} ${unit}</b>` : "not measured yet"}. Side: ${read[1] ? `<b>${width} ${unit}</b>` : "not measured yet"}.` +
      (read[0] && read[1]
        ? `<br><span class="ok">${width} × ${length} = ${length * width} square ${word}.</span>`
        : '<br><span class="dimline">Each ruler starts at 0 at the corner. Read where the side ends.</span>');
  };
  onPick(el, (id) => {
    rectIndex = +id;
    read = [false, false];
    draw();
  });
  q("rtop").onclick = () => {
    read = [true, read[1]];
    draw();
  };
  q("rside").onclick = () => {
    read = [read[0], true];
    draw();
  };
  draw();
}
/* the quick checks' figures */
const F = {
  r75: rectFig(7, 5, { unit: "m", grid: false }),
  ruler: rulerRect(5, 3, "cm"),
};
const STEPS = [
  {
    title: "Multiply the side lengths",
    widget: wSides,
    body: "<p>You don’t need to see the squares. A rectangle 6 cm long has 6 square centimeters in each row, and if it’s 4 cm wide, it has 4 rows. So its area is <b>4 × 6</b> square centimeters.</p><p>Change the sides, and show the squares to check.</p>",
    check: {
      kind: "num",
      q: "What is the area of this rectangle?",
      fig: F.r75,
      answer: 35,
      unit: "square meters",
      misc: [
        [12, "You added 7 + 5. Multiply the sides: 5 rows of 7."],
        [24, "That’s the distance around the outside. Area is the squares inside."],
      ],
      explain: "5 rows of 7 square meters: 5 × 7 = 35 square meters.",
    },
  },
  {
    title: "Measure, then multiply",
    widget: wRuler,
    body: "<p>When the sides aren’t marked, measure them with a ruler. Start at 0 at a corner and read where the side ends. Then multiply the two sides.</p><p>Pick a rectangle and measure both sides.</p>",
    check: {
      kind: "num",
      q: "Measure the sides with the rulers. What is the area of the rectangle?",
      fig: F.ruler,
      answer: 15,
      unit: "square centimeters",
      misc: [
        [8, "You added the sides. Multiply them: 3 × 5."],
        [16, "That’s the distance around the outside. Area is the squares inside."],
      ],
      explain: "The rectangle is 5 cm long and 3 cm wide. 3 × 5 = 15 square centimeters.",
    },
  },
];
