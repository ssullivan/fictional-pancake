/* Learn Wrapping Up Multiplication and Division with Multi-digit Numbers (Grade 5 Unit 4), chapter 4: Partial quotients.
   Its widgets and steps; loaded by quotients.html. */
/* ways to divide 1,728 by 24 in chunks: [button, the partial quotients] */
const WAYS = [
  ["50 + 20 + 2", [50, 20, 2]],
  ["70 + 2", [70, 2]],
  ["10s first", [10, 10, 10, 10, 10, 10, 10, 2]],
];
/* Pick a way to divide 1,728 by 24: different chunks, the same quotient. */
function wWays(el) {
  const q = Q(el);
  let wayIndex = 0;
  el.innerHTML =
    seg(
      "Way",
      WAYS.map(([button], i) => [i, button]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [, chunks] = WAYS[wayIndex];
    press(el, wayIndex);
    q("f").innerHTML = quotientFig(1728, 24, chunks);
    q("r").innerHTML =
      `${chunks.length} chunks this way. However you chunk it, they add up to the same quotient: <b>1,728 ÷ 24 = 72</b>. Bigger chunks take fewer steps.`;
  };
  onPick(el, (m) => {
    wayIndex = +m;
    draw();
  });
  draw();
}
/* divisions to work a chunk at a time: [n, divisor, the partial quotients] */
const DIVISIONS = [
  [1728, 24, [50, 20, 2]],
  [1560, 12, [100, 30]],
  [2275, 25, [90, 1]],
];
/* Pick a division and take away one chunk at a time (a stepper). */
function wChunks(el) {
  const q = Q(el),
    values = { chunks: 0 },
    limits = { chunks: [0, 3] };
  let divisionIndex = 0;
  el.innerHTML =
    seg(
      "Division",
      DIVISIONS.map(([n, d], i) => [i, `${commas(n)} ÷ ${d}`]),
    ) +
    `<div class="wrow">${stepper("chunks", "Chunks")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [n, d, chunks] = DIVISIONS[divisionIndex],
      shown = values.chunks,
      left = n - chunks.slice(0, shown).reduce((x, y) => x + y, 0) * d;
    press(el, divisionIndex);
    q("chunks").textContent = shown;
    q("f").innerHTML = quotientFig(n, d, chunks, shown);
    q("r").innerHTML =
      shown === chunks.length
        ? `Nothing is left. Add the chunks: <b>${chunks.join(" + ")} = ${chunks.reduce((x, y) => x + y, 0)}</b>.`
        : shown
          ? `${chunks[shown - 1]} × ${d} = ${commas(chunks[shown - 1] * d)}. ${commas(left)} is left: take away more ${d}s.`
          : `How many ${d}s can you take away from ${commas(n)} at once? Tap + to take a chunk.`;
  };
  /* a new division: the stepper goes up to its number of chunks */
  const chooseDivision = (i) => {
    divisionIndex = i;
    limits.chunks[1] = DIVISIONS[i][2].length;
    values.chunks = 0;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    chooseDivision(+m);
    draw();
  });
  chooseDivision(divisionIndex);
  draw();
}
const STEPS = [
  {
    title: "Different chunks, same quotient",
    widget: wWays,
    body: "<p>To divide by partial quotients, take away friendly chunks of the divisor, like 10 or 50 groups at a time, until nothing is left. Then add the chunks. There’s more than one right way to chunk.</p><p>Pick a way to divide 1,728 by 24.</p>",
    check: {
      kind: "mc",
      q: "Which partial quotients work for 1,350 ÷ 25?",
      answer: "b",
      choices: [
        { id: "a", label: "50" },
        { id: "b", label: "50 + 4" },
        { id: "c", label: "50 + 5" },
      ],
      why: {
        a: "50 × 25 = 1,250 leaves 100, so you’re not done.",
        c: "55 × 25 = 1,375, more than 1,350.",
      },
      explain: "50 × 25 = 1,250 and 4 × 25 = 100. 50 + 4 = 54, and 54 × 25 = 1,350.",
    },
  },
  {
    title: "Take away one chunk at a time",
    widget: wChunks,
    body: "<p>Write each chunk at the right as you take it away, and subtract to see what’s left. When nothing is left, add the chunks: that’s the quotient.</p><p>Pick a division and take away the chunks.</p>",
    check: {
      kind: "num",
      q: "What is 1,104 ÷ 12?",
      fig: quotientFig(1104, 12, [90, 2], 0),
      answer: 92,
      unit: "",
      misc: [
        [90, "That’s only the first chunk. 90 × 12 = 1,080 leaves 24, which is 2 more 12s."],
        [1092, "That subtracts 12 once. Find how many 12s make 1,104."],
      ],
      explain: "90 × 12 = 1,080, leaving 24. 2 × 12 = 24. 90 + 2 = 92.",
    },
  },
];
