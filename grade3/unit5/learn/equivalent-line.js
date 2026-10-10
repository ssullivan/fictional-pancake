/* Learn Fractions as Numbers (Grade 3 Unit 5), chapter 6: Equivalent fractions on the number line. Its widgets and steps;
   loaded by equivalent-line.html. */
/* Two number lines cut different ways: tap a tick on the top line, and see which tick on the bottom line is the same point. */
function wTwoLines(el) {
  /* tapped: the top tick tapped last (null before any tap) */
  const q = Q(el);
  let topD = 2,
    bottomD = 4,
    tapped = null;
  el.innerHTML =
    `<div data-top>${seg(
      "Top line",
      [2, 3, 4].map((d) => [d, `Top: ${partsOf(d)}`]),
    )}</div>` +
    `<div data-bot>${seg(
      "Bottom line",
      [4, 6, 8].map((d) => [d, `Bottom: ${partsOf(d)}`]),
    )}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* the bottom tick at the same point, when there is one */
    const below = tapped === null ? null : (tapped * bottomD) / topD,
      lines = Number.isInteger(below);
    press(q("top"), topD);
    press(q("bot"), bottomD);
    q("f").innerHTML = fracLine(
      [
        { d: topD, tap: true, labs: true, pts: tapped === null ? [] : [{ k: tapped }] },
        { d: bottomD, labs: true, pts: lines ? [{ k: below, cls: "b" }] : [] },
      ],
      { marks: tapped === null ? [] : [{ v: tapped / topD, t: "same point" }] },
    );
    q("r").innerHTML =
      tapped === null
        ? "Tap a tick on the top line."
        : tapped === 0
          ? "Both lines start at 0."
          : lines
            ? `<span class="ok">${fr(tapped, topD)} is right above ${fr(below, bottomD)}: ${fr(tapped, topD)} = <b>${fr(below, bottomD)}</b>.</span>`
            : `No tick on the bottom line is right under ${fr(tapped, topD)}: no number of ${partsOf(bottomD)} is equal to it.`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (row) {
      if (row === "top") topD = +id;
      else bottomD = +id;
      tapped = null;
      return draw();
    }
    const tick = e.target.closest("[data-v]");
    if (!tick) return;
    tapped = +tick.dataset.v;
    draw();
  });
  draw();
}
/* Write a whole number as a fraction: pick the whole number and the parts, and count the parts up to it. */
function wWholeFraction(el) {
  const q = Q(el);
  let whole = 2,
    d = 2;
  el.innerHTML =
    `<div data-top>${seg(
      "Whole number",
      [1, 2, 3].map((w) => [w, String(w)]),
    )}</div>` +
    `<div data-bot>${seg(
      "Parts",
      [2, 3, 4, 6].map((x) => [x, cap(partsOf(x))]),
    )}</div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const n = whole * d;
    press(q("top"), whole);
    press(q("bot"), d);
    q("f").innerHTML = fracLine([{ d, labs: true, hops: n, pts: [{ k: n }] }], { wholes: 3 });
    q("e").textContent = `${whole} = ${n}/${d}`;
    q("r").innerHTML =
      `Each whole is ${d} ${partsOf(d)}, so ${whole} whole${whole > 1 ? "s are" : " is"} ${n} ${partsOf(d)}: ${whole} = <b>${fr(n, d)}</b>.`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") whole = +id;
    else d = +id;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  lines: fracLine([
    { d: 4, labs: true, pts: [{ k: 3 }] },
    { d: 8, labs: true },
  ]),
  fourths: fracLine([{ d: 4 }], { wholes: 3 }),
};
const STEPS = [
  {
    title: "The same point, different names",
    widget: wTwoLines,
    body: "<p>Equivalent fractions are at the same point on the number line. On a line cut into halves and one cut into fourths, 1/2 and 2/4 are at the same place.</p><p>Pick how each line is cut, then tap a tick on the top line.</p>",
    check: {
      kind: "mc",
      q: "Which fraction is at the same point as 3/4?",
      fig: F.lines,
      choices: [
        { id: "a", label: fr(6, 8) },
        { id: "b", label: fr(3, 8) },
        { id: "c", label: fr(4, 8) },
      ],
      answer: "a",
      why: {
        b: "That keeps the top number. 3/8 is less than halfway to 1.",
        c: "4/8 is at the same point as 1/2, not 3/4.",
      },
      explain: "6/8 is right under 3/4, so 3/4 = 6/8.",
    },
  },
  {
    title: "Whole numbers as fractions",
    widget: wWholeFraction,
    body: "<p>A whole number can be written as a fraction. 1 whole is 4 fourths, so 1 = 4/4, and 2 = 8/4. Count the parts from 0.</p><p>Pick a whole number and the parts.</p>",
    check: {
      kind: "num",
      q: "3 = ?/4. What number goes in the box?",
      fig: F.fourths,
      answer: 12,
      misc: [
        [3, "3/4 is 3 fourths, less than 1. Each whole is 4 fourths."],
        [7, "That adds. Each whole is 4 fourths: count them for 3 wholes."],
      ],
      explain: "Each whole is 4 fourths, so 3 = 12/4.",
    },
  },
];
