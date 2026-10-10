/* Learn Fractions as Numbers (Grade 3 Unit 5), chapter 2: Build fractions. Its widgets and steps; loaded by
   build-fractions.html. */
/* Tap the parts of a shape to shade them, and name the fraction shaded. */
function wShade(el) {
  /* shaded: the parts tapped so far */
  const q = Q(el);
  let shape = "rect",
    parts = 4,
    shaded = new Set();
  el.innerHTML =
    `<div data-top>${seg("Shape", [
      ["rect", "Rectangle"],
      ["circle", "Circle"],
    ])}</div>` +
    `<div data-bot>${seg(
      "Parts",
      [3, 4, 6, 8].map((d) => [d, cap(partsOf(d))]),
    )}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const k = shaded.size;
    press(q("top"), shape);
    press(q("bot"), parts);
    q("f").innerHTML = shareFig(shape, parts, "v", { shade: [...shaded], tap: true });
    q("r").innerHTML = !k
      ? "Tap parts to shade them. Tap one again to take it off."
      : k === parts
        ? `All ${parts} parts: ${fr(parts, parts)}, <b>1 whole</b>.`
        : `${partName(parts, k)} shaded: <b>${fr(k, parts)}</b>. That’s ${k} parts of ${fr(1, parts)}.`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (row) {
      if (row === "top") shape = id;
      else parts = +id;
      shaded = new Set();
      return draw();
    }
    const part = e.target.closest("[data-i]");
    if (!part) return;
    const i = +part.dataset.i;
    if (shaded.has(i)) shaded.delete(i);
    else shaded.add(i);
    draw();
  });
  draw();
}
/* Count parts of 1/d: each one more shades another part, up to the whole. */
function wCount(el) {
  /* values.k: how many parts of 1/d */
  const q = Q(el),
    values = { k: 1 },
    limits = { k: [0, 4] };
  let d = 4;
  el.innerHTML =
    seg(
      "Parts",
      [3, 4, 6, 8].map((x) => [x, cap(partsOf(x))]),
    ) + `<div class="wrow">${stepper("k", "Parts")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const k = values.k;
    press(el, d);
    q("k").textContent = k;
    q("f").innerHTML = strips([{ d, k }]);
    q("r").innerHTML = !k
      ? `No parts of ${fr(1, d)} yet.`
      : k === d
        ? `${d} parts of ${fr(1, d)} make ${fr(d, d)}: <b>1 whole</b>.`
        : `${pl(k, "part")} of ${fr(1, d)} make${k === 1 ? "s" : ""} <b>${fr(k, d)}</b>.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (id) => {
    d = +id;
    limits.k = [0, d];
    values.k = 1;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  pie: shareFig("circle", 6, "v", { shade: [0, 1, 2, 3, 4] }),
};
const STEPS = [
  {
    title: "Shade parts",
    widget: wShade,
    body: "<p>3 of 4 equal parts is 3 fourths, written 3/4. The top number, the <b>numerator</b>, counts the parts you’re talking about. The bottom number counts the equal parts in the whole.</p><p>Pick a shape and how it’s cut, then tap parts to shade them.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "What fraction of the pie is shaded?",
      fig: F.pie,
      answer: 5 / 6,
      unit: "of the pie",
      misc: [
        [1 / 6, "That’s the part that isn’t shaded. Count the shaded parts."],
        [6 / 5, "The top and bottom are switched. The bottom number is how many equal parts make the whole: 6."],
      ],
      explain: "The pie has 6 equal parts, and 5 are shaded: 5/6.",
    },
  },
  {
    title: "Count unit fractions",
    widget: wCount,
    body: "<p>Every fraction is made of unit fractions. 3/4 is 3 parts of 1/4, and 4 parts of 1/4 make the whole: 4/4 = 1.</p><p>Pick the parts, then add one at a time.</p>",
    check: {
      kind: "num",
      q: "How many 1/8s make 5/8?",
      answer: 5,
      misc: [[8, "8 is how many parts make the whole. How many of them make 5/8?"]],
      explain: "5/8 is 5 parts of 1/8.",
    },
  },
];
