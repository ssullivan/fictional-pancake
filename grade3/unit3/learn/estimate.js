/* Learn Wrapping Up Addition and Subtraction within 1,000 (Grade 3 Unit 3), chapter 8: Estimate. Its widgets and steps; loaded
   by estimate.html. */
/* a op b, for op '+' or '−' */
const calc = (a, op, b) => (op === "+" ? a + b : a - b);
/* sums and differences to estimate: [a, op, b] */
const ESTIMATES = [
  [487, "+", 316],
  [612, "−", 289],
  [238, "+", 455],
];
/* Estimate a sum or difference by rounding each number first; a button shows the exact answer. */
function wEstimate(el) {
  /* exact: the exact answer is showing */
  const q = Q(el);
  let problemIndex = 0,
    unit = 100,
    exact = false;
  el.innerHTML =
    `<div data-top>${seg(
      "Problem",
      ESTIMATES.map(([a, op, b], i) => [i, `${a} ${op} ${b}`]),
    )}</div><div data-bot>${seg("Round to", [
      [10, "Nearest ten"],
      [100, "Nearest hundred"],
    ])}</div>` +
    `<p class="eq" data-e></p><div class="wrow"><button type="button" class="btn" data-go>Find the exact answer</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, op, b] = ESTIMATES[problemIndex],
      roundA = roundTo(a, unit),
      roundB = roundTo(b, unit),
      estimate = calc(roundA, op, roundB),
      answer = calc(a, op, b);
    press(q("top"), problemIndex);
    press(q("bot"), unit);
    q("go").disabled = exact;
    q("e").innerHTML = `${roundA} ${op} ${roundB} = ${estimate}`;
    q("r").innerHTML =
      `${a} rounded to ${nearestWord(unit)} is ${roundA}, and ${b} rounded to ${nearestWord(unit)} is ${roundB}. So ${a} ${op} ${b} is about <b>${estimate}</b>.` +
      (exact
        ? `<br><span class="ok">Exact: ${a} ${op} ${b} = ${answer}. The estimate is ${estimate === answer ? "exactly right" : `off by ${Math.abs(answer - estimate)}`}.</span>`
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
/* answers to check: [name, a, op, b, their answer] */
const CLAIMS = [
  ["Lin", 487, "+", 316, 603],
  ["Diego", 612, "−", 289, 323],
  ["Mai", 238, "+", 455, 893],
];
/* Check whether an answer makes sense: estimate by rounding to the nearest hundred, and compare. */
function wSense(el) {
  /* checked: the estimate is showing */
  const q = Q(el);
  let claimIndex = 0,
    checked = false;
  el.innerHTML =
    seg(
      "Student",
      CLAIMS.map(([name], i) => [i, name]),
    ) +
    `<p class="eq" data-e></p><div class="wrow"><button type="button" class="btn" data-go>Estimate to check</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [name, a, op, b, claim] = CLAIMS[claimIndex],
      roundA = roundTo(a, 100),
      roundB = roundTo(b, 100),
      estimate = calc(roundA, op, roundB),
      answer = calc(a, op, b),
      close = Math.abs(claim - estimate) < 100;
    press(el, claimIndex);
    q("go").disabled = checked;
    q("e").innerHTML = `${name} says ${a} ${op} ${b} is ${claim}.`;
    q("r").innerHTML = checked
      ? `${a} ${op} ${b} is about ${roundA} ${op} ${roundB} = ${estimate}. ` +
        (close
          ? `<span class="ok">${claim} is close to ${estimate}, so it makes sense.</span>`
          : `${claim} is far from ${estimate}, so it doesn’t make sense. The exact answer is ${answer}.`)
      : `Does ${claim} make sense? Round to the nearest hundred and see.`;
  };
  q("go").onclick = () => {
    checked = true;
    draw();
  };
  onPick(el, (id) => {
    claimIndex = +id;
    checked = false;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Round to estimate",
    widget: wEstimate,
    body: "<p>To <b>estimate</b>, round the numbers first, then add or subtract the rounded numbers in your head. 487 + 316 is about 500 + 300, which is 800. Rounding to the nearest ten gives a closer estimate, and rounding to the nearest hundred an easier one.</p><p>Pick a problem and a place to round to.</p>",
    check: {
      kind: "num",
      q: "The ferry carried 386 people on Saturday and 412 people on Sunday. Round each to the nearest hundred, then add. About how many people did it carry?",
      answer: 800,
      unit: "people",
      misc: [
        [798, "That’s the exact answer. Round first: 400 + 400."],
        [700, "386 is closer to 400 than to 300: it’s past halfway, 350."],
      ],
      explain: "386 rounds to 400, and 412 rounds to 400. 400 + 400 = 800, so about 800 people.",
    },
  },
  {
    title: "Does it make sense?",
    widget: wSense,
    body: "<p>An estimate tells you about what an answer should be. If an answer is far from the estimate, check the work: maybe a step was missed, or a regroup was forgotten.</p><p>Pick a student and estimate to check the answer.</p>",
    check: {
      kind: "mc",
      q: "Han says 594 − 207 is 187. Round each number to the nearest hundred to check. Does 187 make sense?",
      choices: [
        { id: "a", label: "Yes, it makes sense" },
        { id: "b", label: "No, it should be about 400" },
        { id: "c", label: "No, it should be about 300" },
      ],
      answer: "b",
      why: {
        a: "594 − 207 is about 600 − 200 = 400. 187 is far from 400.",
        c: "594 is closer to 600 than to 500. Round to the nearest hundred: 600 − 200.",
      },
      explain:
        "594 − 207 is about 600 − 200 = 400. 187 is far from 400, so it doesn’t make sense. The exact answer is 387.",
    },
  },
];
