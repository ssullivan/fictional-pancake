/* Learn Putting It All Together (Grade 4 Unit 9), chapter 4: Estimate. Its widgets and steps; loaded by estimate.html. */
/* problems to estimate: [op, a, b] */
const ESTIMATES = [
  ["×", 48, 21],
  ["+", 3489, 2516],
  ["−", 8120, 2975],
];
/* Pick a problem and what to round to: the estimate with friendly numbers, and how close it is. */
function wRound(el) {
  const q = Q(el);
  let problemIndex = 0,
    unit = 10;
  el.innerHTML =
    `<div data-top>${seg(
      "Problem",
      ESTIMATES.map(([op, a, b], i) => [i, `${commas(a)} ${op} ${commas(b)}`]),
    )}</div><div data-bot>${seg("Round to the nearest", [
      [10, "Ten"],
      [100, "Hundred"],
      [1000, "Thousand"],
    ])}</div>` + `<p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const [op, a, b] = ESTIMATES[problemIndex],
      calc = (x, y) => (op === "×" ? x * y : op === "+" ? x + y : x - y),
      ra = roundTo(a, unit),
      rb = roundTo(b, unit),
      exact = calc(a, b),
      estimate = calc(ra, rb);
    press(q("top"), problemIndex);
    press(q("bot"), unit);
    q("e").innerHTML = `${commas(ra)} ${op} ${commas(rb)} = ${commas(estimate)}`;
    q("r").innerHTML =
      ra === 0 || rb === 0
        ? `Rounding to the nearest ${unit === 10 ? "ten" : unit === 100 ? "hundred" : "thousand"} turns a number into 0: too rough to be useful here.`
        : `The exact answer is ${commas(exact)}. The estimate is off by ${commas(Math.abs(exact - estimate))}. Rounding to a bigger place is easier but less close.`;
  };
  el.addEventListener("click", (e) => {
    const hit = segHit(e, ["top", "bot"]);
    if (!hit) return;
    if (hit[0] === "top") problemIndex = +hit[1];
    else unit = +hit[1];
    draw();
  });
  draw();
}
/* estimation stories: [button, question, the estimate's work, the estimate, the exact answer] */
const GUESSES = [
  ["Seats", "About how many seats are in 18 rows of 23 seats?", "20 × 20 = 400", 400, 414],
  ["Pages", "About how many pages are in 6 books of 198 pages each?", "6 × 200 = 1,200", 1200, 1188],
  [
    "Steps",
    "Lin walks 1,980 steps in the morning and 2,115 after school. About how many steps is that?",
    "2,000 + 2,000 = 4,000",
    4000,
    4095,
  ],
];
/* Pick a story and make a guess (a stepper, by hundreds): how it compares with the estimate and the exact answer. */
function wGuess(el) {
  /* the stepper's value: hundreds, the guess in hundreds */
  const q = Q(el),
    values = { hundreds: 5 },
    limits = { hundreds: [1, 50] };
  let guessIndex = 0;
  el.innerHTML =
    seg(
      "Story",
      GUESSES.map(([name], i) => [i, name]),
    ) +
    `<p class="readout" data-s></p><div class="wrow">${stepper("hundreds", "Your guess")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const [, question, work, estimate, exact] = GUESSES[guessIndex],
      guess = 100 * values.hundreds,
      /* a guess counts as close when it's within a tenth of the exact answer */
      close = Math.abs(guess - exact) <= exact / 10;
    press(el, guessIndex);
    q("hundreds").textContent = commas(guess);
    q("s").innerHTML = question;
    q("r").innerHTML =
      (close ? `<span class="ok">Close!</span> ` : `${commas(guess)} is ${guess < exact ? "too low" : "too high"}. `) +
      `With friendly numbers: ${work}. The exact answer is ${commas(exact)}, so ${commas(estimate)} is a good estimate.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    guessIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Round to estimate",
    widget: wRound,
    body: "<p>To estimate, round each number to a friendly number and work it out in your head. An estimate tells you about how big the answer should be, so you can tell if an exact answer makes sense.</p><p>Pick a problem and what to round to.</p>",
    check: {
      kind: "mc",
      q: "Which is the best estimate of 39 × 52?",
      choices: [
        { id: "a", label: "2,000" },
        { id: "b", label: "200" },
        { id: "c", label: "20,000" },
      ],
      answer: "a",
      why: {
        b: "40 × 50 is 4 tens times 5 tens: 20 hundreds, which is 2,000.",
        c: "40 × 50 = 2,000. That’s 10 times too big.",
      },
      explain: "39 is about 40 and 52 is about 50. 40 × 50 = 2,000.",
    },
  },
  {
    title: "About how many?",
    widget: wGuess,
    body: "<p>Many questions only need an answer that’s about right. Round to friendly numbers, work it out, and you have a good estimate.</p><p>Pick a story and make a guess.</p>",
    check: {
      kind: "num",
      q: "Estimate 612 + 389 by rounding each number to the nearest hundred.",
      answer: 1000,
      misc: [
        [900, "389 rounds to 400, not 300: it’s closer to 400."],
        [1001, "That’s the exact sum. Round first: 600 + 400."],
      ],
      explain: "612 rounds to 600 and 389 rounds to 400. 600 + 400 = 1,000.",
    },
  },
];
