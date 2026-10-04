/* Learn Properties of Two-dimensional Shapes (Grade 4 Unit 8), chapter 4: Find unknown lengths. Its widgets and steps; loaded by lengths.html. */
/* shapes with all sides equal: [id in SHAPES, how many sides] */
const EQUAL_SIDED = [
  ["square", 4],
  ["rhombus", 4],
  ["equilateral", 3],
];
/* Pick a shape with equal sides and a side length (a stepper): its perimeter, and back again. */
function wPerimeter(el) {
  /* the stepper's value: side, each side's length in cm */
  const q = Q(el),
    values = { side: 6 },
    limits = { side: [2, 12] };
  let shapeIndex = 0;
  el.innerHTML =
    seg(
      "Shape",
      EQUAL_SIDED.map(([id], i) => [i, SHAPES[id].name[0].toUpperCase() + SHAPES[id].name.slice(1)]),
    ) +
    `<div class="wrow">${stepper("side", "Side (cm)")}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const [id, count] = EQUAL_SIDED[shapeIndex],
      side = values.side,
      perimeter = count * side;
    press(el, shapeIndex);
    q("side").textContent = side;
    q("f").innerHTML = shapeFig(id, {
      sideText: [`${side} cm`],
      label: `${cap(aName(id))} with one side ${side} cm`,
    });
    q("e").innerHTML = `${count} × ${side} = ${perimeter} cm, and ${perimeter} ÷ ${count} = ${side} cm`;
    q("r").innerHTML =
      `The tick marks say all ${count} sides are equal, so one side tells you all of them. The perimeter is ${count} × ${side} = <b>${perimeter} cm</b>. Backward: ${aName(id)} with a perimeter of ${perimeter} cm has sides of ${perimeter} ÷ ${count} = ${side} cm.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    shapeIndex = +m;
    draw();
  });
  draw();
}
/* L-shaped figures with one side missing: [wide, tall, cut wide, cut tall, side texts, the missing side, how to find it] */
const L_PUZZLES = [
  [
    10,
    8,
    6,
    5,
    ["4 cm", null, "?", "3 cm", "10 cm", "8 cm"],
    6,
    "The bottom is 10 cm. Across the top, 4 cm and the ? side make the same distance: 10 − 4 = 6 cm.",
  ],
  [
    10,
    8,
    6,
    5,
    ["4 cm", "?", "6 cm", "3 cm", null, "8 cm"],
    5,
    "The left side is 8 cm. On the right, the ? side and 3 cm make the same distance: 8 − 3 = 5 cm.",
  ],
  [
    9,
    7,
    4,
    3,
    [null, "3 cm", "4 cm", "4 cm", "9 cm", "?"],
    7,
    "The left side goes all the way down, the same distance as 3 cm and 4 cm on the right: 3 + 4 = 7 cm.",
  ],
];
/* Pick a figure and guess its missing side (a stepper). */
function wMissing(el) {
  /* the stepper's value: guess, in cm */
  const q = Q(el),
    values = { guess: 4 },
    limits = { guess: [1, 12] };
  let puzzleIndex = 0;
  el.innerHTML =
    seg(
      "Figure",
      L_PUZZLES.map((p, i) => [i, `Figure ${i + 1}`]),
    ) +
    `<div class="wrow">${stepper("guess", "Your guess (cm)")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [wide, tall, cutWide, cutTall, sideText, missing, how] = L_PUZZLES[puzzleIndex],
      guess = values.guess;
    press(el, puzzleIndex);
    q("guess").textContent = guess;
    q("f").innerHTML = lShape(wide, tall, cutWide, cutTall, sideText, "An L-shaped figure with one side marked ?");
    q("r").innerHTML =
      guess === missing
        ? `<span class="ok">Yes! ${missing} cm.</span> ${how}`
        : `Not ${guess} cm: that’s too ${guess < missing ? "short" : "long"}. Opposite sides of the figure go the same total distance.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    puzzleIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Equal sides and the perimeter",
    widget: wPerimeter,
    body: "<p>What a shape has tells you lengths you can’t see. If all its sides are equal, one side tells you the perimeter. And if you know the perimeter, divide to find a side.</p><p>Pick a shape and change its side length.</p>",
    check: {
      kind: "num",
      q: "A square has a perimeter of 36 cm. How long is each side?",
      answer: 9,
      unit: "cm",
      misc: [
        [18, "That splits the perimeter into 2. A square has 4 equal sides: 36 ÷ 4."],
        [32, "That subtracts 4. A square has 4 equal sides: divide 36 by 4."],
      ],
      explain: "A square has 4 equal sides, so each one is 36 ÷ 4 = 9 cm.",
    },
  },
  {
    title: "Missing sides of a figure",
    widget: wMissing,
    body: "<p>In a figure made of right angles, the sides that go across on top add up to the side across the bottom, and the sides that go up and down on one side add up to the other side.</p><p>Pick a figure and find its missing side.</p>",
    check: {
      kind: "num",
      q: "What is the length of the side marked ?",
      fig: lShape(
        12,
        8,
        7,
        4,
        ["5 cm", null, "?", "4 cm", "12 cm", "8 cm"],
        "An L-shaped figure: top 5 cm, bottom 12 cm, one side across marked ?",
      ),
      answer: 7,
      unit: "cm",
      misc: [
        [17, "That adds 12 + 5. The top 5 cm and the ? side together make 12 cm: subtract."],
        [4, "That’s the side next to it. Compare the sides that go across: 12 − 5."],
      ],
      explain: "Across the bottom is 12 cm. Across the top, 5 cm and the ? side make 12 cm too: 12 − 5 = 7 cm.",
    },
  },
];
