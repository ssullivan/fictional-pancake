/* Learn Fractions as Quotients and Fraction Multiplication (Grade 5 Unit 2), chapter 4: Area with a fraction side. Its
   widgets and steps; loaded by area.html. */
/* n/d as a fraction, then as a mixed number or whole number when it's more than 1 (html) */
const asMixed = (n, d) => (n % d === 0 ? `${fr(n, d)} = ${n / d}` : n > d ? `${fr(n, d)} = ${mixed(n, d)}` : fr(n, d));
/* the denominators to cut a unit square into */
const AREA_PARTS = [2, 3, 4, 5, 6];
/* A rectangle n by a/b on a grid of unit squares: pick b, then step the length n and the parts a. */
function wArea(el) {
  const q = Q(el),
    values = { length: 3, parts: 2 },
    limits = { length: [1, 5], parts: [1, 4] };
  let parts = 5;
  el.innerHTML =
    seg(
      "Cut each square into",
      AREA_PARTS.map((d) => [d, `${d} parts`]),
    ) +
    `<div class="wrow">${stepper("length", "Length")}${stepper("parts", "Width parts")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { length } = values,
      a = values.parts,
      pieces = length * a;
    press(el, parts);
    q("length").textContent = length;
    q("parts").textContent = a;
    q("f").innerHTML = areaFig([length, 1], [a, parts], { label: `A rectangle ${length} by ${a}/${parts}` });
    q("r").innerHTML =
      `Each unit square is cut into ${parts} parts of ${fr(1, parts)} square unit. The rectangle covers ${a} in each of ${length} ${length === 1 ? "square" : "squares"}: ${pieces} parts. ` +
      `<b>${length} × ${fr(a, parts)} = ${asMixed(pieces, parts)}</b> square ${pieces <= parts ? "unit" : "units"}.`;
  };
  /* new parts: the width goes up to one less than all of them, so it stays less than 1 */
  const chooseParts = (d) => {
    parts = d;
    limits.parts[1] = d - 1;
    values.parts = Math.min(values.parts, d - 1);
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    chooseParts(+m);
    draw();
  });
  chooseParts(parts);
  draw();
}
/* the fraction parts of a mixed width: [a, b] */
const WIDTH_PARTS = [
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 3],
  [3, 4],
];
/* A rectangle n by w a/b: the whole part gold, the fraction part cyan (step n and w, pick a/b). */
function wMixedArea(el) {
  const q = Q(el),
    values = { length: 3, whole: 2 },
    limits = { length: [1, 4], whole: [1, 2] };
  let fractionIndex = 2;
  el.innerHTML =
    seg(
      "Fraction part",
      WIDTH_PARTS.map(([a, b], i) => [i, `${a}/${b}`]),
    ) +
    `<div class="wrow">${stepper("length", "Length")}${stepper("whole", "Whole part")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b] = WIDTH_PARTS[fractionIndex],
      { length, whole } = values,
      top = whole * b + a;
    press(el, fractionIndex);
    q("length").textContent = length;
    q("whole").textContent = whole;
    q("f").innerHTML = areaFig([length, 1], [top, b], {
      split: "h",
      label: `A rectangle ${length} by ${whole} ${a}/${b}, split into its whole part and fraction part`,
    });
    q("r").innerHTML =
      `Gold: ${length} × ${whole} = ${length * whole}. Blue: ${length} × ${fr(a, b)} = ${asMixed(length * a, b)}. ` +
      `<b>${length} × ${mixed(top, b)} = ${length * whole} + ${fr(length * a, b)} = ${mixed(length * top, b)}</b> square units.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    fractionIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "A side less than 1",
    widget: wArea,
    body: "<p>A rectangle 3 units long and 2/5 unit wide covers 2/5 of each of 3 unit squares: 3 × 2 = 6 parts, each 1/5 of a square. Its area is <b>3 × 2/5 = 6/5</b> square units, the same as length × width with whole numbers.</p><p>Cut the squares into parts, then change the rectangle.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "Each square is 1 unit by 1 unit. What is the area of the shaded rectangle?",
      fig: areaFig([4, 1], [2, 3], { label: "A rectangle 4 by 2/3 on a grid of unit squares" }),
      answer: 8 / 3,
      unit: "square units",
      misc: [
        [4 + 2 / 3, "That adds the sides. Area is length × width: 4 × 2/3."],
        [2 / 3, "That’s the part in one square. The rectangle covers 2/3 of 4 squares."],
      ],
      explain: "4 × 2/3 = 8/3 = 2 2/3 square units: 8 parts of 1/3.",
    },
  },
  {
    title: "A side more than 1",
    widget: wMixedArea,
    body: "<p>When a side is a mixed number like 2 1/4, split the rectangle in two: a whole-number part and a fraction part. Find each area, then add: <b>3 × 2 1/4 = (3 × 2) + (3 × 1/4) = 6 + 3/4</b>.</p><p>Change the rectangle and watch both parts.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "A picnic blanket is 3 meters long and 2 1/4 meters wide. What is its area?",
      fig: areaFig([3, 1], [9, 4], { label: "A rectangle 3 by 2 1/4 on a grid of unit squares" }),
      answer: 27 / 4,
      unit: "square meters",
      misc: [
        [6, "That’s only the 3 × 2 part. Add the 3 × 1/4 strip on top."],
        [6 + 1 / 4, "That adds 1/4 once. The 1/4 strip runs along all 3 meters: 3 × 1/4 = 3/4."],
      ],
      explain: "3 × 2 = 6, and 3 × 1/4 = 3/4. 6 + 3/4 = 6 3/4 square meters.",
    },
  },
];
