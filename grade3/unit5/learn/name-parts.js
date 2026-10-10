/* Learn Fractions as Numbers (Grade 3 Unit 5), chapter 1: Name the parts. Its widgets and steps; loaded by name-parts.html. */
/* the shapes to cut, picked with a row of buttons */
const SHAPE_CHOICES = [
  ["circle", "Circle"],
  ["rect", "Rectangle"],
  ["square", "Square"],
];
/* Cut a shape into 2 to 8 parts, equal or not, and name one part. Parts that aren't the same size only come in 2 to 4. */
function wEqualParts(el) {
  /* how: 'v' for equal parts, 'uneq' for parts not the same size */
  const q = Q(el);
  let shape = "circle",
    parts = 4,
    how = "v";
  el.innerHTML =
    `<div data-shape>${seg("Shape", SHAPE_CHOICES)}</div>` +
    `<div data-parts>${seg(
      "Parts",
      DENS.map((d) => [d, `${d} parts`]),
    )}</div>` +
    `<div data-how>${seg("How", [
      ["v", "Equal parts"],
      ["uneq", "Not the same size"],
    ])}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    press(q("shape"), shape);
    press(q("parts"), parts);
    press(q("how"), how);
    q("how").querySelector('[data-m="uneq"]').disabled = parts > 4;
    q("f").innerHTML = shareFig(shape, parts, how, { shade: [0] });
    q("r").innerHTML =
      how === "v"
        ? `${parts} equal parts: <b>${partsOf(parts)}</b>. Each part is ${aPart(parts)}, written ${fr(1, parts)}.`
        : `<span class="no">${parts} parts, but they aren’t the same size, so they aren’t ${partsOf(parts)}.</span>`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["shape", "parts", "how"]) || [];
    if (!row) return;
    if (row === "shape") shape = id;
    else if (row === "parts") {
      parts = +id;
      /* parts not the same size only come in 2 to 4 */
      if (parts > 4) how = "v";
    } else how = id;
    draw();
  });
  draw();
}
/* See every unit fraction from halves to eighths, one strip each, with the picked one in blue. */
function wUnitFractions(el) {
  const q = Q(el);
  let picked = 4;
  el.innerHTML =
    seg(
      "Part",
      DENS.map((d) => [d, cap(PART[d][0])]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const smaller = DENS[DENS.indexOf(picked) - 1];
    press(el, picked);
    q("f").innerHTML = strips(
      DENS.map((d) => ({ d, k: 1, lab: [1, d], cls: d === picked ? "b" : "" })),
      {
        label: `Fraction strips with one part shaded: halves, thirds, fourths, sixths, and eighths, with ${partsOf(picked)} in blue`,
      },
    );
    q("r").innerHTML =
      `${fr(1, picked)} is 1 of ${picked} equal parts: ${aPart(picked)}.` +
      (smaller
        ? `<br>It’s smaller than ${fr(1, smaller)}: cutting the whole into more parts makes each part smaller.`
        : "<br>It’s the biggest unit fraction here: the whole is cut into the fewest parts.");
  };
  onPick(el, (id) => {
    picked = +id;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  equal: shareFig("rect", 4, "v", { s: 80 }),
  notEqual: shareFig("rect", 4, "uneq", { s: 80 }),
  three: shareFig("rect", 3, "v", { s: 80 }),
  pizza: shareFig("circle", 8, "v", { shade: [0] }),
};
const STEPS = [
  {
    title: "Equal parts",
    widget: wEqualParts,
    body: "<p>A <b>fraction</b> names equal parts of a whole. A whole cut into 2 equal parts is cut into halves; 3 equal parts are thirds, 4 are fourths, 6 are sixths, and 8 are eighths. The parts must be the same size.</p><p>Pick a shape and how many parts to cut it into.</p>",
    check: {
      kind: "mc",
      q: "Which rectangle is cut into fourths?",
      choices: [
        { id: "a", label: F.equal },
        { id: "b", label: F.notEqual },
        { id: "c", label: F.three },
      ],
      answer: "a",
      why: {
        b: "Those 4 parts aren’t the same size, so they aren’t fourths.",
        c: "That’s 3 equal parts: thirds.",
      },
      explain: "Fourths are 4 equal parts. The first rectangle has 4 parts, all the same size.",
    },
  },
  {
    title: "Unit fractions",
    widget: wUnitFractions,
    body: "<p>One part of a whole cut into 4 equal parts is 1 fourth, written 1/4. The bottom number, the <b>denominator</b>, is how many equal parts make the whole. A fraction with 1 on top is a <b>unit fraction</b>.</p><p>Pick a part and compare it with the others.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "A pizza is cut into 8 equal slices. What fraction of the pizza is 1 slice?",
      fig: F.pizza,
      answer: 1 / 8,
      unit: "of the pizza",
      misc: [
        [8, "8 is how many slices. 1 slice is 1 of 8 equal parts: write it as a fraction."],
        [7 / 8, "That’s the slices that aren’t shaded. Name the 1 shaded slice."],
      ],
      explain: "1 of 8 equal parts is 1 eighth: 1/8 of the pizza.",
    },
  },
];
