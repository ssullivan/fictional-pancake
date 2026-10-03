/* Learn From Hundredths to Hundred-thousands (Grade 4 Unit 4), chapter 6: Round. Its widgets and steps; loaded by round.html. */
/* the places to round to */
const TO = [1000, 10000, 100000];
/* n rounded to the nearest multiple of unit (halfway rounds up) */
const roundTo = (n, unit) => Math.floor(n / unit + 0.5) * unit;
/* "the nearest thousand" */
const nearest = (unit) =>
  `the nearest ${unit === 1000 ? "thousand" : unit === 10000 ? "ten thousand" : "hundred thousand"}`;
/* n on a number line from the multiple of unit below it to the one above, in 10 ticks, with the halfway point */
function roundLine(n, unit, label) {
  const below = Math.floor(n / unit) * unit,
    tick = unit / 10;
  return numLine(0, 10, {
    u: 36,
    step: 1,
    big: 5,
    pad: 36,
    fmt: (v) => commas(below + v * tick),
    pts: [{ v: (n - below) / tick, t: commas(n) }],
    label:
      label ||
      `Number line from ${commas(below)} to ${commas(below + unit)}, with ${commas(below + unit / 2)} halfway and a point at ${commas(n)}`,
  });
}
/* how n rounds to the nearest unit (html) */
function roundWhy(n, unit) {
  const below = Math.floor(n / unit) * unit,
    halfway = below + unit / 2,
    rounded = roundTo(n, unit);
  if (n === below)
    return `${commas(n)} is already a multiple of ${commas(unit)}. Rounded to ${nearest(unit)}, it stays <b>${commas(n)}</b>.`;
  return (
    `${commas(n)} is between ${commas(below)} and ${commas(below + unit)}. Halfway is ${commas(halfway)}. ` +
    (n === halfway
      ? `${commas(n)} is exactly halfway, and then we round up`
      : `${commas(n)} is ${n < halfway ? "less" : "more"} than ${commas(halfway)}, so it’s closer to ${commas(rounded)}`) +
    `.<br><span class="ok">Rounded to ${nearest(unit)}: <b>${commas(rounded)}</b>.</span>`
  );
}
/* the numbers to round */
const RN = [7380, 46500, 182900, 725300];
/* Pick a number and a place to round to; places bigger than the number are turned off. */
function wRound(el) {
  const q = Q(el);
  let numberIndex = 1,
    unit = 1000;
  el.innerHTML = `<div data-top>${seg(
    "Number",
    RN.map((v, i) => [i, commas(v)]),
  )}</div><div data-bot>${seg(
    "Round to",
    TO.map((v) => [v, `Nearest ${commas(v)}`]),
  )}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const n = RN[numberIndex];
    press(q("top"), numberIndex);
    press(q("bot"), unit);
    q("bot")
      .querySelectorAll("[data-m]")
      .forEach((b) => {
        b.disabled = +b.dataset.m > n;
      });
    q("f").innerHTML = roundLine(n, unit);
    q("r").innerHTML = roundWhy(n, unit);
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") {
      numberIndex = +id;
      if (unit > RN[numberIndex]) unit = 1000;
    } else unit = +id;
    draw();
  });
  draw();
}
/* sums and differences to estimate: [a, op, b] */
const EST = [
  [38950, "+", 21200],
  [62100, "−", 29800],
  [405000, "+", 289000],
];
/* Estimate a sum or difference by rounding first; a button shows the exact answer. */
function wEstimate(el) {
  const q = Q(el);
  let problemIndex = 0,
    unit = 1000,
    exact = false;
  el.innerHTML = `<div data-top>${seg(
    "Problem",
    EST.map(([a, op, b], i) => [i, `${commas(a)} ${op} ${commas(b)}`]),
  )}</div><div data-bot>${seg(
    "Round to",
    TO.slice(0, 2).map((v) => [v, `Nearest ${commas(v)}`]),
  )}</div><p class="eq" data-e></p><div class="wrow"><button type="button" class="btn" data-go>Find the exact answer</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, op, b] = EST[problemIndex],
      roundA = roundTo(a, unit),
      roundB = roundTo(b, unit),
      estimate = op === "+" ? roundA + roundB : roundA - roundB,
      answer = op === "+" ? a + b : a - b;
    press(q("top"), problemIndex);
    press(q("bot"), unit);
    q("go").disabled = exact;
    q("e").innerHTML = `${commas(roundA)} ${op} ${commas(roundB)} = ${commas(estimate)}`;
    q("r").innerHTML =
      `${commas(a)} is about ${commas(roundA)}, and ${commas(b)} is about ${commas(roundB)}. So ${commas(a)} ${op} ${commas(b)} is about <b>${commas(estimate)}</b>.` +
      (exact
        ? `<br><span class="ok">Exact: ${commas(a)} ${op} ${commas(b)} = ${commas(answer)}. The estimate is ${estimate === answer ? "exactly right" : `off by ${commas(Math.abs(answer - estimate))}`}.</span>`
        : '<br><span class="dimline">Rounded numbers are easy to add or subtract in your head.</span>');
  };
  q("go").onclick = () => {
    exact = true;
    draw();
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") problemIndex = +id;
    else unit = +id;
    exact = false;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  game: roundLine(46700, 1000, "Number line from 46,000 to 47,000, with 46,500 halfway and a point at 46,700"),
};
const STEPS = [
  {
    title: "The nearest thousand, ten thousand, or hundred thousand",
    widget: wRound,
    body: "<p>To <b>round</b> a number, find the two multiples it’s between, and pick the closer one. 7,380 is between 7,000 and 8,000. It’s less than halfway, 7,500, so it rounds to 7,000. A number exactly halfway rounds up.</p><p>Pick a number and a place to round to.</p>",
    check: {
      kind: "mc",
      q: "46,700 people went to a baseball game. What is 46,700 rounded to the nearest thousand?",
      fig: F.game,
      choices: [
        { id: "a", label: "46,000" },
        { id: "b", label: "50,000" },
        { id: "c", label: "47,000" },
      ],
      answer: "c",
      why: {
        a: "46,700 is past the halfway point, 46,500, so it’s closer to 47,000.",
        b: "50,000 is 46,700 rounded to the nearest ten thousand. The nearest thousand is 46,000 or 47,000.",
      },
      explain: "46,700 is between 46,000 and 47,000. It’s more than halfway, 46,500, so it rounds to 47,000.",
    },
  },
  {
    title: "Estimate with rounded numbers",
    widget: wEstimate,
    body: "<p>To <b>estimate</b>, round the numbers first, then add or subtract the rounded ones in your head. 38,950 + 21,200 is about 39,000 + 21,000, which is 60,000. An estimate also helps you check an exact answer.</p><p>Pick a problem and a place to round to.</p>",
    check: {
      kind: "mc",
      q: "A zoo had 24,800 visitors in May and 31,100 in June. Round each to the nearest thousand. About how many visitors came in the two months?",
      choices: [
        { id: "a", label: "About 56,000" },
        { id: "b", label: "About 55,000" },
        { id: "c", label: "About 55,900" },
      ],
      answer: "a",
      why: {
        b: "24,800 is closer to 25,000 than to 24,000: it’s past 24,500.",
        c: "That’s the exact total. Round first: 25,000 + 31,000.",
      },
      explain: "24,800 rounds to 25,000 and 31,100 rounds to 31,000. 25,000 + 31,000 = 56,000.",
    },
  },
];
