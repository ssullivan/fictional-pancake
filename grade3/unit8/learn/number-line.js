/* Learn Putting It All Together (Grade 3 Unit 8), chapter 2: Fractions on the number line. Its widgets and steps; loaded by
   number-line.html. */
/* the denominators to pick from, and how many wholes each one's line shows (eighths get 2, so ticks aren't too close) */
const LINE_DENS = [2, 3, 4, 6, 8];
const wholesFor = (d) => (d >= 6 ? 2 : 3);
/* "1 whole", "2 wholes" */
const wholesText = (n) => `${n} whole${n === 1 ? "" : "s"}`;
/* Jump along a number line by 1/d (a stepper), past 1 and on: the fraction landed on, and the whole numbers it's between. */
function wPast(el) {
  /* values.k: how many jumps of 1/d from 0 */
  const q = Q(el),
    values = { k: 5 },
    limits = { k: [0, 12] };
  let d = 4;
  el.innerHTML =
    seg(
      "Parts in 1 whole",
      LINE_DENS.map((x) => [x, PART[x][1]]),
    ) + `<div class="wrow">${stepper("k", "Jumps")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { k } = values,
      wholes = wholesFor(d),
      parts = PART[d][k === 1 ? 0 : 1];
    press(el, d);
    q("k").textContent = k;
    q("f").innerHTML = fracLine([{ d, pts: [{ k }], hops: k }], { wholes });
    q("r").innerHTML =
      k === 0
        ? `Press + to jump by ${fr(1, d)} from 0.`
        : k < d
          ? `${k} ${parts}: ${fr(k, d)}. That’s less than 1.`
          : k % d === 0
            ? `<span class="ok">${k} ${parts} make ${wholesText(k / d)}: ${fr(k, d)} = ${k / d}.</span>`
            : `${k} ${parts}: ${fr(k, d)}. That’s more than ${Math.floor(k / d)} and less than ${Math.ceil(k / d)}.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (id) => {
    d = +id;
    limits.k = [0, d * wholesFor(d)];
    values.k = Math.min(values.k, d * wholesFor(d));
    draw();
  });
  draw();
}
/* pairs of fractions to compare, as [n, d]: across 1, the same numerator, the same denominator, and the same whole number */
const PAIRS = [
  [[5, 4], [7, 8], "5/4 is more than 1, and 7/8 is less than 1."],
  [[3, 4], [3, 8], "Both are 3 parts. Fourths are bigger parts than eighths, so 3 fourths is more."],
  [[5, 6], [7, 6], "The parts are the same size, sixths. 5 of them is less than 7 of them."],
  [[6, 3], [4, 2], "6/3 = 2 and 4/2 = 2: the same whole number."],
];
/* the signs to pick from: [id, sign] */
const SIGNS = [
  ["lt", "<"],
  ["eq", "="],
  ["gt", ">"],
];
/* Compare two fractions on number lines that line up: pick a pair, then pick the sign that makes it true. */
function wCompare(el) {
  /* sign: the id of the sign picked, or null before one is */
  const q = Q(el);
  let pairIndex = 0,
    sign = null;
  el.innerHTML =
    `<div data-top>${seg(
      "Pair",
      PAIRS.map(([a, b], i) => [i, `${fr(...a)} and ${fr(...b)}`]),
    )}</div>` +
    `<div data-bot>${seg(
      "Sign",
      SIGNS.map(([id, s]) => [id, SIGN_HTML[s]]),
    )}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b, because] = PAIRS[pairIndex],
      right = compareFr(a, b),
      picked = sign && SIGNS.find(([id]) => id === sign)[1];
    press(q("top"), pairIndex);
    press(q("bot"), sign);
    q("f").innerHTML = fracLine(
      [
        { d: a[1], pts: [{ k: a[0] }] },
        { d: b[1], pts: [{ k: b[0], cls: "b" }] },
      ],
      {
        wholes: 2,
        label: `Number lines from 0 to 2 with ${a.join("/")} on the first and ${b.join("/")} on the second`,
      },
    );
    q("r").innerHTML = !sign
      ? `Which sign makes ${fr(...a)} ? ${fr(...b)} true? The one farther from 0 is greater.`
      : picked === right
        ? `<span class="ok">Yes: ${fr(...a)} ${SIGN_HTML[right]} ${fr(...b)}.</span> ${because}`
        : `Not ${fr(...a)} ${SIGN_HTML[picked]} ${fr(...b)}. ${because}`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (row === "top") {
      pairIndex = +id;
      sign = null;
    }
    if (row === "bot") sign = id;
    if (row) draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  point: fracLine([{ d: 3, pts: [{ k: 5 }] }], {
    wholes: 2,
    label: "A number line from 0 to 2 cut into thirds, with a point",
  }),
  compare: fracLine(
    [
      { d: 6, pts: [{ k: 7 }] },
      { d: 8, pts: [{ k: 5, cls: "b" }] },
    ],
    { wholes: 2, label: "Number lines from 0 to 2 with 7/6 on the first and 5/8 on the second" },
  ),
};
const STEPS = [
  {
    title: "Fractions greater than 1",
    widget: wPast,
    body: "<p>Fractions keep going past 1. Each jump is the same unit fraction, so 5 jumps of 1/4 land on 5/4, a little past 1. When the jumps fill whole numbers exactly, the fraction <b>is</b> a whole number: 8/4 = 2.</p><p>Pick the parts in 1 whole, and jump.</p>",
    check: {
      kind: "mc",
      q: "What fraction is at the point?",
      fig: F.point,
      answer: "a",
      choices: [
        { id: "a", label: fr(5, 3) },
        { id: "b", label: fr(6, 3) },
        { id: "c", label: fr(5, 6) },
      ],
      why: {
        b: "That counts the tick at 0. Count the jumps from 0, not the ticks.",
        c: "That uses 6, the parts in the whole line. The bottom number is the parts in 1 whole: 3.",
      },
      explain: "Each whole is cut into thirds. The point is 5 jumps of 1/3 from 0: 5/3.",
    },
  },
  {
    title: "Compare with >, =, and <",
    widget: wCompare,
    body: "<p>On number lines that line up, the fraction farther from 0 is greater. You can also reason: with the same size parts, more parts is more; with the same number of parts, bigger parts are more; and a fraction past 1 is more than one before it.</p><p>Pick a pair and the sign that makes it true.</p>",
    check: {
      kind: "mc",
      q: "Which is true?",
      fig: F.compare,
      answer: "c",
      choices: [
        { id: "a", label: `${fr(7, 6)} &lt; ${fr(5, 8)}` },
        { id: "b", label: `${fr(7, 6)} = ${fr(5, 8)}` },
        { id: "c", label: `${fr(7, 6)} &gt; ${fr(5, 8)}` },
      ],
      why: {
        a: "That says 7/6 is less. But 7/6 is more than 1, and 5/8 is less than 1.",
        b: "That says they’re the same size. But 7/6 is more than 1, and 5/8 is less than 1.",
      },
      explain: "7/6 is past 1, and 5/8 is before 1, so 7/6 > 5/8.",
    },
  },
];
