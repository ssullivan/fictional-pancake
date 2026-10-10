/* Learn Fractions as Numbers (Grade 3 Unit 5), chapter 8: Compare fractions. Its widgets and steps; loaded by compare.html. */
/* pairs of fractions to compare: the same denominator, the same numerator, or equivalent */
const PAIRS = [
  [
    [3, 8],
    [5, 8],
  ],
  [
    [2, 3],
    [2, 6],
  ],
  [
    [2, 4],
    [1, 2],
  ],
  [
    [3, 4],
    [3, 8],
  ],
];
/* how two fractions can be compared, and why, in words */
function howToCompare(a, b) {
  const s = compareFr(a, b);
  if (s === "=") return "They cover the same length, so they’re equivalent.";
  if (a[1] === b[1]) return `Both are ${partsOf(a[1])}, the same size of part. Compare how many parts.`;
  const [bigger, smaller] = a[1] < b[1] ? [a[1], b[1]] : [b[1], a[1]];
  return `Both have ${pl(a[0], "part")}, but ${partsOf(bigger)} are bigger than ${partsOf(smaller)}.`;
}
/* Pick the sign for a pair of fractions; the strips are shaded once a sign is picked, to check it. */
function wPickSign(el) {
  /* picked: the sign picked (null until one is) */
  const q = Q(el);
  let pairIndex = 0,
    picked = null;
  el.innerHTML =
    `<div data-top>${seg(
      "Pair",
      PAIRS.map(([a, b], i) => [i, `${a.join("/")} and ${b.join("/")}`]),
    )}</div>` +
    `<div data-bot>${seg("Sign", [
      ["<", "&lt;"],
      ["=", "="],
      [">", "&gt;"],
    ])}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b] = PAIRS[pairIndex],
      right = compareFr(a, b);
    press(q("top"), pairIndex);
    press(q("bot"), picked);
    q("f").innerHTML = strips([
      { d: a[1], k: picked ? a[0] : 0, lab: a },
      { d: b[1], k: picked ? b[0] : 0, cls: "b", lab: b },
    ]);
    q("r").innerHTML =
      picked === null
        ? `Is ${fr(...a)} less than, equal to, or greater than ${fr(...b)}? Pick a sign.`
        : (picked === right
            ? `<span class="ok">Yes: <b>${fr(...a)} ${SIGN_HTML[right]} ${fr(...b)}</b>.</span>`
            : `<span class="no">Not ${fr(...a)} ${SIGN_HTML[picked]} ${fr(...b)}. Look at the strips.</span>`) +
          `<br>${howToCompare(a, b)}`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") {
      pairIndex = +id;
      picked = null;
    } else picked = id;
    draw();
  });
  draw();
}
/* Two fractions as points on number lines: the one farther right is greater. */
function wOnLines(el) {
  const q = Q(el);
  let pairIndex = 0;
  el.innerHTML =
    seg(
      "Pair",
      PAIRS.map(([a, b], i) => [i, `${a.join("/")} and ${b.join("/")}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b] = PAIRS[pairIndex],
      s = compareFr(a, b);
    press(el, pairIndex);
    q("f").innerHTML = fracLine([
      { d: a[1], labs: true, pts: [{ k: a[0] }] },
      { d: b[1], labs: true, pts: [{ k: b[0], cls: "b" }] },
    ]);
    q("r").innerHTML =
      (s === "="
        ? `The points are at the same place: they’re equivalent.`
        : `${fr(...(s === ">" ? a : b))} is farther right, so it’s greater.`) +
      `<br><b>${fr(...a)} ${SIGN_HTML[s]} ${fr(...b)}</b>`;
  };
  onPick(el, (id) => {
    pairIndex = +id;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  runs: fracLine([
    { d: 3, labs: true, pts: [{ k: 2 }] },
    { d: 6, labs: true, pts: [{ k: 2, cls: "b" }] },
  ]),
};
const STEPS = [
  {
    title: "Pick a way to compare",
    widget: wPickSign,
    body: "<p>To compare two fractions, look first: the same denominator? Compare the number of parts. The same numerator? Compare the size of the parts. They might also be equivalent.</p><p>Pick a pair and a sign, then check with the strips.</p>",
    check: {
      kind: "mc",
      q: "Which is true?",
      choices: [
        { id: "a", label: `${fr(2, 4)} = ${fr(1, 2)}` },
        { id: "b", label: `${fr(2, 4)} &gt; ${fr(1, 2)}` },
        { id: "c", label: `${fr(2, 4)} &lt; ${fr(1, 2)}` },
      ],
      answer: "a",
      why: {
        b: "2 is more than 1, but fourths are smaller than halves. Compare the lengths.",
        c: "Compare the lengths: 2 fourths are as long as 1 half.",
      },
      explain: "2 fourths cover the same length as 1 half, so 2/4 = 1/2.",
    },
  },
  {
    title: "Compare on the number line",
    widget: wOnLines,
    body: "<p>On a number line, the number farther right is greater. Put both fractions on lines from 0 to 1, and see which point is farther from 0.</p><p>Pick a pair.</p>",
    check: {
      kind: "mc",
      q: "Kiran runs 2/3 mile. Elena runs 2/6 mile. Who runs farther?",
      fig: F.runs,
      choices: [
        { id: "a", label: "Kiran" },
        { id: "b", label: "Elena" },
        { id: "c", label: "They run the same distance" },
      ],
      answer: "a",
      why: {
        b: "6 is more than 3, but sixths are smaller than thirds. 2/6 is closer to 0.",
        c: "The points aren’t at the same place.",
      },
      explain: "2/3 is farther right than 2/6, so 2/3 > 2/6. Kiran runs farther.",
    },
  },
];
