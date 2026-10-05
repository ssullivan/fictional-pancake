/* Learn Area and Multiplication (Grade 3 Unit 2), chapter 4: Square units. Its widgets and steps; loaded by square-units.html. */
/* pairs of square units to compare: each unit's name and its side in pixels, so the two are drawn to scale with each other
   (an inch is about 2½ centimeters, and a meter about 3¼ feet), what it's about the size of, and how many small ones fit in a big one */
const UNIT_PAIRS = {
  small: {
    units: [
      ["centimeter", 38],
      ["inch", 96],
    ],
    bench: ["the tip of your finger", "a postage stamp"],
    fit: "About 6 square centimeters fit in 1 square inch.",
  },
  big: {
    units: [
      ["foot", 30],
      ["meter", 98],
    ],
    bench: ["a floor tile", "a small table top"],
    fit: "About 11 square feet fit in 1 square meter.",
  },
};
/* Two square units side by side, drawn to scale with each other, with the small unit's lines dashed across the big one. */
function unitSquaresFig(kind) {
  const [[smallName, smallSide], [bigName, bigSide]] = UNIT_PAIRS[kind].units,
    base = 120,
    smallX = 40,
    bigX = 170;
  let markup =
    `<rect class="atile" x="${smallX}" y="${base - smallSide}" width="${smallSide}" height="${smallSide}"/>` +
    `<rect class="arect" x="${bigX}" y="${base - bigSide}" width="${bigSide}" height="${bigSide}"/>`;
  /* the small unit's lines inside the big square: how many small squares fit across it */
  for (let x = smallSide; x < bigSide; x += smallSide)
    markup +=
      `<line class="agrid" x1="${bigX + x}" y1="${base - bigSide}" x2="${bigX + x}" y2="${base}"/>` +
      `<line class="agrid" x1="${bigX}" y1="${base - x}" x2="${bigX + bigSide}" y2="${base - x}"/>`;
  [
    [smallX + smallSide / 2, smallName],
    [bigX + bigSide / 2, bigName],
  ].forEach(([x, name]) => {
    markup += `<text class="lbl s" x="${x}" y="${base + 18}">1 square</text><text class="lbl s" x="${x}" y="${base + 36}">${name}</text>`;
  });
  return svgWrap(300, base + 46, markup, `1 square ${smallName} next to 1 square ${bigName}, drawn to scale`);
}
/* Compare the small square units, or the big ones. */
function wSizes(el) {
  const q = Q(el);
  let kind = "small";
  el.innerHTML =
    seg("Units", [
      ["small", "Small squares"],
      ["big", "Big squares"],
    ]) + `<div class="fig" data-f></div><p class="readout" data-o></p>`;
  const draw = () => {
    const pair = UNIT_PAIRS[kind],
      [[smallName], [bigName]] = pair.units;
    press(el, kind);
    q("f").innerHTML = unitSquaresFig(kind);
    q("o").innerHTML =
      `A square ${smallName} is about the size of ${pair.bench[0]}. A square ${bigName} is about the size of ${pair.bench[1]}.` +
      `<br><span class="ok">${pair.fit}</span>` +
      (kind === "big" ? '<br><span class="dimline">These are drawn much smaller than they really are.</span>' : "");
  };
  onPick(el, (id) => {
    kind = id;
    draw();
  });
  draw();
}
/* things to measure, and whether they're small (square cm or inches) or big (square feet or meters) */
const THINGS = [
  { t: "Stamp", a: "a postage stamp", small: true },
  { t: "Book", a: "a book cover", small: true },
  { t: "Rug", a: "a rug", small: false },
  { t: "Classroom", a: "a classroom floor", small: false },
];
/* the square units to pick from: their id, name, and whether they're for small things */
const PICK_UNITS = [
  ["cm", "square centimeters", true],
  ["in", "square inches", true],
  ["ft", "square feet", false],
  ["m", "square meters", false],
];
/* the text with its first letter capitalized */
const cap = (text) => text[0].toUpperCase() + text.slice(1);
/* Pick a thing, then a square unit to measure its area with. */
function wPick(el) {
  /* unitId: the unit picked, or null before one is */
  const q = Q(el);
  let thingIndex = 0,
    unitId = null;
  el.innerHTML =
    `<div data-top>${seg(
      "Thing",
      THINGS.map((thing, i) => [i, thing.t]),
    )}</div><div data-bot>${seg(
      "Unit",
      PICK_UNITS.map(([id, name]) => [id, name]),
    )}</div>` + `<p class="readout" data-o></p>`;
  const draw = () => {
    const thing = THINGS[thingIndex],
      unit = PICK_UNITS.find(([id]) => id === unitId);
    press(q("top"), thingIndex);
    press(q("bot"), unitId);
    q("o").innerHTML = !unit
      ? `Which square unit makes sense for the area of ${thing.a}?`
      : unit[2] === thing.small
        ? `<span class="ok">Yes: ${thing.a} is ${thing.small ? "small" : "big"}, so ${unit[1]} make sense ✓</span>`
        : `<span class="no">${cap(unit[1])} ${thing.small ? `are much too big for ${thing.a}` : `are much too small: it would take far too many to cover ${thing.a}`}.</span>`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (row === "top") {
      thingIndex = +id;
      unitId = null;
    }
    if (row === "bot") unitId = id;
    if (row) draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Squares of different sizes",
    widget: wSizes,
    body: "<p>Area can be measured in different square units. A <b>square centimeter</b> is 1 centimeter on each side, and a <b>square inch</b> is 1 inch on each side. Big areas use <b>square feet</b> and <b>square meters</b>.</p><p>Compare the small squares, then the big ones.</p>",
    check: {
      kind: "mc",
      q: "Lin covers a notebook with square inches. Han covers the same notebook with square centimeters. Who needs more squares?",
      choices: [
        { id: "a", label: "Lin" },
        { id: "b", label: "Han" },
        { id: "c", label: "They need the same number" },
      ],
      answer: "b",
      why: {
        a: "Lin uses bigger squares. Bigger squares cover more, so it takes fewer of them.",
        c: "The squares are different sizes, so they need different numbers.",
      },
      explain: "A square centimeter is smaller than a square inch, so Han needs more of them to cover the notebook.",
    },
  },
  {
    title: "Pick a unit that fits",
    widget: wPick,
    body: "<p>Use small square units for small things, and big ones for big things. A stamp in square meters, or a classroom in square centimeters, would be silly.</p><p>Pick a thing, then pick a unit for its area.</p>",
    check: {
      kind: "mc",
      q: "Which unit makes the most sense for the area of a basketball court?",
      choices: [
        { id: "a", label: "square centimeters" },
        { id: "b", label: "square meters" },
        { id: "c", label: "square inches" },
      ],
      answer: "b",
      why: {
        a: "A square centimeter is about the size of the tip of your finger. It would take far too many to cover a court.",
        c: "A square inch is about the size of a postage stamp. It would take far too many to cover a court.",
      },
      explain: "A basketball court is big, so use big squares: square meters.",
    },
  },
];
