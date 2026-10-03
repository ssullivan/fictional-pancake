/* Learn Arithmetic in Base Ten (Grade 6 Unit 5), chapter 1: Adding and subtracting decimals. Its widgets and steps; loaded by add-subtract.html. */
/* n and the word for it: "1 tenth", "3 tenths" */
const pl = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
/* a number drawn as `tenths` strips and `hundredths` small squares (in columns of 5), from x; returns [markup, width] */
function pieces(tenths, hundredths, x) {
  let markup = "";
  for (let i = 0; i < tenths; i++) markup += `<rect class="bt-t" x="${x + i * 14}" y="10" width="10" height="100"/>`;
  const squaresX = x + tenths * 14 + (tenths ? 8 : 0);
  for (let i = 0; i < hundredths; i++)
    markup += `<rect class="bt-h" x="${squaresX + Math.floor(i / 5) * 14}" y="${100 - (i % 5) * 14}" width="10" height="10"/>`;
  return [markup, squaresX + Math.ceil(hundredths / 5) * 14 - x];
}
/* Add two numbers in tenths and hundredths (a stepper for each), bundling 10 hundredths into a tenth and 10 tenths into a one. */
function wBundle(el) {
  /* the steppers' values: at and ah, the first number's tenths and hundredths; bt and bh, the second's */
  const q = Q(el),
    values = { at: 4, ah: 7, bt: 3, bh: 8 };
  el.innerHTML = `<div class="wrow">${stepper("at", "First: tenths")}${stepper("ah", "First: hundredths")}</div><div class="wrow">${stepper("bt", "Second: tenths")}${stepper("bh", "Second: hundredths")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { at, ah, bt, bh } = values,
      A = (10 * at + ah) / 100,
      B = (10 * bt + bh) / 100,
      tenths = at + bt,
      hundredths = ah + bh;
    ["at", "ah", "bt", "bh"].forEach((key) => (q(key).textContent = values[key]));
    const [markupA, widthA] = pieces(at, ah, 10),
      [markupB, widthB] = pieces(bt, bh, 10 + widthA + 40);
    q("f").innerHTML = svgWrap(
      Math.max(60 + widthA + widthB, 120),
      120,
      markupA + `<text class="ftxt big mid" x="${10 + widthA + 20}" y="66">+</text>` + markupB,
      `${fmt(A)} and ${fmt(B)} in strips (tenths) and small squares (hundredths)`,
    );
    /* bundled: 1 when the hundredths make a new tenth */
    const bundled = hundredths >= 10 ? 1 : 0,
      tenthsAfter = tenths + bundled;
    q("r").innerHTML =
      `${fmt(A)} + ${fmt(B)} is ${pl(tenths, "tenth")} and ${pl(hundredths, "hundredth")}.` +
      (bundled
        ? `<br>Bundle 10 hundredths into 1 tenth: ${pl(tenthsAfter, "tenth")} and ${pl(hundredths - 10, "hundredth")}.`
        : "") +
      (tenthsAfter >= 10
        ? `<br>Bundle 10 tenths into 1 one: 1 one, ${pl(tenthsAfter - 10, "tenth")}, and ${pl(hundredths - 10 * bundled, "hundredth")}.`
        : "") +
      `<br><b>${fmt(A)} + ${fmt(B)} = ${fmt(A + B)}</b>`;
  };
  steppers(el, values, { at: [0, 9], ah: [0, 9], bt: [0, 9], bh: [0, 9] }, draw);
  draw();
}

/* sums and differences: [a, b, op] */
const SUMS = [
  [2.5, 0.75, "+"],
  [3, 1.25, "−"],
  [10, 0.4, "−"],
  [1.23, 4.5, "+"],
];
/* Decimal points lined up in columns, with zeros filled in. */
function wColumns(el) {
  const q = Q(el);
  let problemIndex = 0;
  el.innerHTML =
    seg(
      "Problem",
      SUMS.map(([a, b, op], i) => [i, `${fmt(a)} ${op} ${fmt(b)}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b, op] = SUMS[problemIndex],
      result = op === "+" ? a + b : a - b,
      mostPlaces = Math.max(places(a), places(b));
    press(el, problemIndex);
    q("f").innerHTML = columns([a, b], op, result);
    /* the numbers that get zeros filled in */
    const fill = [a, b].filter((n) => places(n) < mostPlaces).map((n) => `${fmt(n)} as ${n.toFixed(mostPlaces)}`);
    q("r").innerHTML =
      `Line up the decimal points, so ones are over ones and tenths over tenths.${fill.length ? ` Write ${fill.join(" and ")}.` : ""}<br><b>${fmt(a)} ${op} ${fmt(b)} = ${fmt(result)}</b>`;
  };
  el.addEventListener("click", (e) => {
    const problemBtn = e.target.closest("[data-m]");
    if (problemBtn) {
      problemIndex = +problemBtn.dataset.m;
      draw();
    }
  });
  draw();
}

const STEPS = [
  {
    title: "Bundle ten hundredths",
    widget: wBundle,
    body: "<p>A strip is 1 tenth (0.1) and a small square is 1 hundredth (0.01). To add, put tenths with tenths and hundredths with hundredths. Ten hundredths make 1 tenth, and ten tenths make 1 one.</p><p>Change the two numbers.</p>",
    check: {
      kind: "num",
      unit: "",
      answer: 0.85,
      q: "What is 0.47 + 0.38?",
      misc: [
        [
          0.715,
          "You wrote 7 tenths, then 15 hundredths after it. 15 hundredths is 1 tenth and 5 hundredths: bundle them.",
        ],
        [0.75, "You left out the bundled tenth: 7 + 8 = 15 hundredths, which is 1 tenth and 5 hundredths."],
        [8.5, "That’s 85 tenths. 0.47 + 0.38 is less than 1."],
      ],
      explain:
        "4 + 3 = 7 tenths and 7 + 8 = 15 hundredths. Bundle 10 hundredths into a tenth: 8 tenths and 5 hundredths = 0.85.",
    },
  },
  {
    title: "Line up the decimal points",
    widget: wColumns,
    body: "<p>To add or subtract in columns, line up the decimal points so each digit sits over the same place. Fill in zeros so every number has the same number of places: 3 is 3.00.</p><p>Pick a problem.</p>",
    check: {
      kind: "num",
      unit: "liters",
      answer: 1.25,
      q: "A bottle has 2 liters of juice. Jada pours out 0.75 liters. How many liters are left?",
      misc: [
        [2.75, "You subtracted the smaller digit from the bigger one in each column. Write 2 as 2.00 and regroup."],
        [0.55, "You lined the 2 up with the tenths. 2 is 2 ones: 2.00 − 0.75."],
      ],
      explain: "2.00 − 0.75 = 1.25 liters.",
    },
  },
];
