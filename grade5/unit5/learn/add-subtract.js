/* Learn Place Value Patterns and Decimal Operations (Grade 5 Unit 5), chapter 4: Add and subtract decimals. Its widgets and
   steps; loaded by add-subtract.html. */
/* problems: [a, b] in thousandths */
const SUMS = [
  [2450, 1300],
  [12600, 850],
  [3070, 4500],
];
const DIFFERENCES = [
  [5300, 2150],
  [4000, 1250],
  [12500, 3750],
];
/* A widget for adding or subtracting (op '+' or '−'): pick a problem and see it lined up by place in a chart, with a 0 written
   in any empty place, and the answer under it. */
const lineUp = (problems, op) =>
  function (el) {
    const q = Q(el);
    let problemIndex = 0;
    el.innerHTML =
      seg(
        "Problem",
        problems.map(([a, b], i) => [i, `${dec(a)} ${op} ${dec(b)}`]),
      ) + `<div data-c></div><p class="readout" data-r></p>`;
    const draw = () => {
      const [a, b] = problems[problemIndex],
        answer = op === "+" ? a + b : a - b,
        /* adding regroups when the hundredths or the tenths (and what's past them) make 10 or more */
        regroups = (a % 100) + (b % 100) >= 100 || (a % 1000) + (b % 1000) >= 1000,
        /* the number with fewer places after the point, which gets a 0 written on the end */
        shorter = placesOf(a) < placesOf(b) ? a : placesOf(b) < placesOf(a) ? b : null;
      press(el, problemIndex);
      q("c").innerHTML = pvChart(
        [
          ["", a / 1000],
          [op, b / 1000],
          ["=", answer / 1000],
        ],
        -1,
        { places: [1, 0, -1, -2] },
      );
      q("r").innerHTML =
        (shorter === null
          ? "Line up the decimal points. "
          : `Line up the decimal points: write ${dec(shorter)} as ${(shorter / 1000).toFixed(2)}, so every place has a digit. `) +
        (op === "+"
          ? `Add place by place from the right${regroups ? ", trading 10 of a place for 1 of the next" : ""}: `
          : `Subtract place by place from the right, trading 1 of a place for 10 of the next when the top digit is too small: `) +
        `<b>${dec(a)} ${op} ${dec(b)} = ${dec(answer)}</b>.`;
    };
    onPick(el, (m) => {
      problemIndex = +m;
      draw();
    });
    draw();
  };
const wAdd = lineUp(SUMS, "+"),
  wSubtract = lineUp(DIFFERENCES, "−");
const STEPS = [
  {
    title: "Line up the decimal points",
    widget: wAdd,
    body: "<p>To add decimals, line up the decimal points so tenths add to tenths and hundredths to hundredths. Write a 0 in an empty place if it helps: 1.3 is 1.30. Then add as with whole numbers, trading 10 of a place for 1 of the next.</p><p>Pick a sum.</p>",
    check: {
      kind: "num",
      q: "What is 4.25 + 3.6?",
      fig: pvChart(
        [
          ["", 4.25],
          ["+", 3.6],
        ],
        -1,
        { places: [0, -1, -2] },
      ),
      answer: 7.85,
      unit: "",
      tol: 0.0005,
      misc: [
        [4.61, "That lines up the last digits. Line up the decimal points: 3.6 is 3.60."],
        [7.31, "That adds 6 to the hundredths. The 6 in 3.6 is 6 tenths."],
      ],
      explain: "4.25 + 3.60: 5 + 0 = 5 hundredths, 2 + 6 = 8 tenths, 4 + 3 = 7 ones. 4.25 + 3.6 = 7.85.",
    },
  },
  {
    title: "Subtract decimals",
    widget: wSubtract,
    body: "<p>To subtract decimals, line up the decimal points and subtract place by place from the right. When the top digit is too small, trade 1 from the next place: 1 tenth for 10 hundredths. Write zeros in empty places: 4 is 4.00.</p><p>Pick a difference.</p>",
    check: {
      kind: "num",
      q: "What is 6.4 − 2.35?",
      answer: 4.05,
      unit: "",
      tol: 0.0005,
      misc: [
        [4.15, "That takes 0 from 5 in the hundredths. 6.4 is 6.40: trade a tenth for 10 hundredths, then 10 − 5 = 5."],
        [4.11, "That lines up the last digits. Line up the decimal points: 6.4 is 6.40."],
      ],
      explain:
        "6.40 − 2.35: trade 1 tenth for 10 hundredths. 10 − 5 = 5 hundredths, 3 − 3 = 0 tenths, 6 − 2 = 4 ones: 4.05.",
    },
  },
];
