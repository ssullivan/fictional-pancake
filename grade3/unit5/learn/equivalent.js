/* Learn Fractions as Numbers (Grade 3 Unit 5), chapter 5: Equivalent fractions. Its widgets and steps; loaded by
   equivalent.html. */
/* fractions to match: [numerator, denominator] */
const TO_MATCH = [
  [1, 2],
  [1, 3],
  [3, 4],
];
/* Shade parts of a second strip, cut another way, until they're as long as the first fraction. */
function wMatch(el) {
  /* values.k: parts shaded on the second strip; otherD: how it's cut */
  const q = Q(el),
    values = { k: 0 },
    limits = { k: [0, 4] };
  let matchIndex = 0,
    otherD = 4;
  el.innerHTML =
    `<div data-top>${seg(
      "Fraction",
      TO_MATCH.map(([n, d], i) => [i, `${n}/${d}`]),
    )}</div>` +
    `<div data-bot>${seg(
      "Cut into",
      DENS.map((d) => [d, cap(partsOf(d))]),
    )}</div>` +
    `<div class="wrow">${stepper("k", "Parts shaded")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [n, d] = TO_MATCH[matchIndex],
      k = values.k,
      s = compareFr([k, otherD], [n, d]),
      /* some cuts have no number of parts exactly as long as n/d: 1/3 in fourths */
      fits = (n * otherD) % d === 0;
    press(q("top"), matchIndex);
    press(q("bot"), otherD);
    q("k").textContent = k;
    q("f").innerHTML = strips([
      { d, k: n, lab: [n, d] },
      { d: otherD, k, cls: "b", lab: [k, otherD] },
    ]);
    q("r").innerHTML =
      s === "="
        ? `<span class="ok">Same length! ${fr(n, d)} = ${fr(k, otherD)}: they’re <b>equivalent</b>.</span>`
        : `${fr(k, otherD)} is ${s === "<" ? "shorter" : "longer"} than ${fr(n, d)}.` +
          (fits ? "" : `<br>No number of ${partsOf(otherD)} is exactly as long as ${fr(n, d)}. Try another cut.`);
  };
  steppers(el, values, limits, draw);
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") matchIndex = +id;
    else otherD = +id;
    limits.k = [0, otherD];
    values.k = 0;
    draw();
  });
  draw();
}
/* fractions to cut again: [numerator, denominator] */
const TO_SPLIT = [
  [1, 2],
  [2, 3],
  [1, 4],
];
/* Cut every part of a fraction strip in two: twice as many parts, each half as big, and the same amount shaded. */
function wSplit(el) {
  /* cuts: how many times every part has been cut in two */
  const q = Q(el);
  let splitIndex = 0,
    cuts = 0;
  el.innerHTML =
    seg(
      "Fraction",
      TO_SPLIT.map(([n, d], i) => [i, `${n}/${d}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Cut each part in two</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [n, d] = TO_SPLIT[splitIndex],
      times = 2 ** cuts,
      [newN, newD] = [n * times, d * times];
    press(el, splitIndex);
    /* stop at eighths, the smallest parts in Grade 3 */
    q("go").disabled = newD * 2 > 8;
    q("f").innerHTML = strips([
      { d, k: n, lab: [n, d] },
      { d: newD, k: newN, cls: "b", lab: [newN, newD] },
    ]);
    q("r").innerHTML = !cuts
      ? `Cut each part of ${fr(n, d)} in two. What happens?`
      : `Each part is cut in two: ${newD} parts instead of ${d}, and ${newN} shaded instead of ${n}.<br><span class="ok">${fr(n, d)} = <b>${fr(newN, newD)}</b>. The shaded length didn’t change.</span>`;
  };
  q("go").onclick = () => {
    cuts++;
    draw();
  };
  q("clr").onclick = () => {
    cuts = 0;
    draw();
  };
  onPick(el, (id) => {
    splitIndex = +id;
    cuts = 0;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  half: strips([
    { d: 2, k: 1, lab: [1, 2] },
    { d: 8, k: 0, cls: "b", lab: ["?", 8] },
  ]),
  twoThirds: strips([{ d: 3, k: 2, lab: [2, 3] }]),
};
const STEPS = [
  {
    title: "Same size, different names",
    widget: wMatch,
    body: "<p>1/2 and 2/4 cover the same length of a strip. Fractions that are the same size are <b>equivalent</b>: 1/2 = 2/4.</p><p>Pick a fraction and a way to cut the second strip, then shade parts until they match.</p>",
    check: {
      kind: "num",
      q: "1/2 = ?/8. What number goes in the box?",
      fig: F.half,
      answer: 4,
      misc: [
        [7, "That adds 6 to the top and the bottom. Make the shaded parts the same length."],
        [8, "8 is how many parts make the whole. How many of them match 1/2?"],
      ],
      explain: "4 eighths cover the same length as 1/2: 1/2 = 4/8.",
    },
  },
  {
    title: "Cut the parts again",
    widget: wSplit,
    body: "<p>To find a fraction equivalent to 2/3, cut each third in two. Now there are 6 parts, and the 2 shaded thirds are 4 sixths: 2/3 = 4/6.</p><p>Pick a fraction and cut its parts.</p>",
    check: {
      kind: "mc",
      q: "Which fraction is equivalent to 2/3?",
      fig: F.twoThirds,
      choices: [
        { id: "a", label: fr(4, 6) },
        { id: "b", label: fr(2, 6) },
        { id: "c", label: fr(3, 4) },
      ],
      answer: "a",
      why: {
        b: "That keeps the top number. 2 sixths are less than 2 thirds.",
        c: "That adds 1 to the top and the bottom. Compare the lengths.",
      },
      explain: "Cut each third in two: 2 thirds become 4 sixths. 2/3 = 4/6.",
    },
  },
];
