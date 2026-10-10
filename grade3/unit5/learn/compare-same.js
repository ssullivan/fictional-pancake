/* Learn Fractions as Numbers (Grade 3 Unit 5), chapter 7: Same denominator or same numerator. Its widgets and steps; loaded
   by compare-same.html. */
/* "a/d < b/d" in words and signs, for the readouts */
const statement = (a, b) => `<b>${fr(...a)} ${SIGN_HTML[compareFr(a, b)]} ${fr(...b)}</b>`;
/* Two fractions with the same denominator: change how many parts each has. */
function wSameDenominator(el) {
  const q = Q(el),
    values = { a: 3, b: 5 },
    limits = { a: [1, 8], b: [1, 8] };
  let d = 8;
  el.innerHTML =
    seg(
      "Parts",
      [4, 6, 8].map((x) => [x, cap(partsOf(x))]),
    ) +
    `<div class="wrow">${stepper("a", "Gold")}${stepper("b", "Blue")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { a, b } = values;
    press(el, d);
    q("a").textContent = a;
    q("b").textContent = b;
    q("f").innerHTML = strips([
      { d, k: a, lab: [a, d] },
      { d, k: b, cls: "b", lab: [b, d] },
    ]);
    q("r").innerHTML =
      `Both are ${partsOf(d)}, so the parts are the same size. ` +
      (a === b ? `They have the same number of parts.` : `${a > b ? a : b} parts are more than ${a > b ? b : a}.`) +
      `<br>${statement([a, d], [b, d])}`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (id) => {
    d = +id;
    limits.a = limits.b = [1, d];
    values.a = Math.min(values.a, d);
    values.b = Math.min(values.b, d);
    draw();
  });
  draw();
}
/* Two fractions with the same numerator: pick how each whole is cut, and the same number of parts of each. */
function wSameNumerator(el) {
  const q = Q(el),
    values = { n: 1 },
    limits = { n: [1, 2] };
  let topD = 2,
    bottomD = 4;
  el.innerHTML =
    `<div data-top>${seg(
      "Gold",
      DENS.map((d) => [d, `Gold: ${partsOf(d)}`]),
    )}</div>` +
    `<div data-bot>${seg(
      "Blue",
      DENS.map((d) => [d, `Blue: ${partsOf(d)}`]),
    )}</div>` +
    `<div class="wrow">${stepper("n", "Parts of each")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const n = values.n,
      [fewer, more] = [Math.min(topD, bottomD), Math.max(topD, bottomD)];
    press(q("top"), topD);
    press(q("bot"), bottomD);
    q("n").textContent = n;
    q("f").innerHTML = strips([
      { d: topD, k: n, lab: [n, topD] },
      { d: bottomD, k: n, cls: "b", lab: [n, bottomD] },
    ]);
    q("r").innerHTML =
      (topD === bottomD
        ? `Both are ${partsOf(topD)}: the same fraction.`
        : `Both have ${pl(n, "part")}. ${cap(partsOf(fewer))} are bigger than ${partsOf(more)}: the whole is cut into fewer parts.`) +
      `<br>${statement([n, topD], [n, bottomD])}`;
  };
  steppers(el, values, limits, draw);
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") topD = +id;
    else bottomD = +id;
    /* each fraction is at most 1 whole */
    limits.n = [1, Math.min(topD, bottomD)];
    values.n = Math.min(values.n, limits.n[1]);
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "The same denominator",
    widget: wSameDenominator,
    body: "<p>3/8 and 5/8 are both eighths, so their parts are the same size. 5 eighths are more than 3 eighths: 3/8 &lt; 5/8. The sign &lt; means less than, and &gt; means greater than.</p><p>Pick the parts, then change how many of each.</p>",
    check: {
      kind: "mc",
      q: "Mai eats 4/6 of a granola bar. Han eats 2/6 of a bar the same size. Which is true?",
      choices: [
        { id: "a", label: `${fr(4, 6)} &gt; ${fr(2, 6)}` },
        { id: "b", label: `${fr(4, 6)} &lt; ${fr(2, 6)}` },
        { id: "c", label: `${fr(4, 6)} = ${fr(2, 6)}` },
      ],
      answer: "a",
      why: {
        b: "Both are sixths, the same size of part. 4 sixths are more than 2 sixths.",
        c: "4 sixths and 2 sixths are different amounts.",
      },
      explain: "Both are sixths, so the parts are the same size. 4 is more than 2, so 4/6 > 2/6.",
    },
  },
  {
    title: "The same numerator",
    widget: wSameNumerator,
    body: "<p>2/3 and 2/8 both have 2 parts. But thirds are bigger than eighths, since the whole is cut into fewer parts. So 2/3 &gt; 2/8.</p><p>Pick how each strip is cut, then how many parts of each.</p>",
    check: {
      kind: "mc",
      q: "Diego paints 3/4 of a fence. Clare paints 3/8 of a fence the same size. Which is true?",
      choices: [
        { id: "a", label: `${fr(3, 4)} &gt; ${fr(3, 8)}` },
        { id: "b", label: `${fr(3, 4)} &lt; ${fr(3, 8)}` },
        { id: "c", label: `${fr(3, 4)} = ${fr(3, 8)}` },
      ],
      answer: "a",
      why: {
        b: "8 is more than 4, but eighths are smaller parts than fourths.",
        c: "Both are 3 parts, but the parts aren’t the same size.",
      },
      explain: "Fourths are bigger than eighths, so 3 fourths are more than 3 eighths: 3/4 > 3/8.",
    },
  },
];
