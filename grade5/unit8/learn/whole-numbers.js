/* Learn Putting It All Together (Grade 5 Unit 8), chapter 1: Multiply and divide. Its widgets and steps; loaded by
   whole-numbers.html. */
/* the digit cards and every way to make two 2-digit numbers from them, largest product first */
const CARDS = [9, 6, 8, 7];
const PAIRS = [
  [96, 87],
  [97, 86],
  [98, 76],
  [89, 76],
  [86, 79],
  [69, 78],
];
/* Pick a way to place the digit cards: see its product, and how it compares with the largest. */
function wLargest(el) {
  const q = Q(el);
  let pairIndex = 2;
  el.innerHTML =
    seg(
      "Numbers",
      PAIRS.map(([a, b], i) => [i, `${a} × ${b}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b] = PAIRS[pairIndex],
      best = Math.max(...PAIRS.map(([x, y]) => x * y));
    press(el, pairIndex);
    q("f").innerHTML = mul2Fig(a, b, 3);
    q("r").innerHTML =
      a * b === best
        ? `<b>${a} × ${b} = ${commas(a * b)}</b>, the largest product: the 9 and 8 are both tens, and the 6 goes with the bigger tens digit.`
        : `${a} × ${b} = ${commas(a * b)}. The largest is ${commas(best)}: ${commas(best - a * b)} more.`;
  };
  onPick(el, (m) => {
    pairIndex = +m;
    draw();
  });
  draw();
}
/* divisions to take apart in chunks: [n, divisor, partial quotients] */
const DIVISIONS = [
  [1575, 25, [60, 3]],
  [1248, 12, [100, 4]],
  [2340, 45, [50, 2]],
];
/* Pick a division and see it worked with partial quotients. */
function wDivide(el) {
  const q = Q(el);
  let divisionIndex = 0;
  el.innerHTML =
    seg(
      "Division",
      DIVISIONS.map(([n, d], i) => [i, `${commas(n)} ÷ ${d}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [n, d, chunks] = DIVISIONS[divisionIndex],
      quotient = chunks.reduce((x, y) => x + y, 0);
    press(el, divisionIndex);
    q("f").innerHTML = quotientFig(n, d, chunks);
    q("r").innerHTML =
      `Take away friendly chunks of ${d}: ${chunks.map((c) => `${c} × ${d} = ${commas(c * d)}`).join(", then ")}. <b>${commas(n)} ÷ ${d} = ${quotient}</b>. Check: ${quotient} × ${d} = ${commas(quotient * d)}.`;
  };
  onPick(el, (m) => {
    divisionIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "The largest product",
    widget: wLargest,
    body: "<p>With the digit cards 9, 8, 7, and 6, which two 2-digit numbers make the largest product? Put the biggest digits in the tens places, then try both ways to place the rest. Multiply with the standard algorithm to check.</p><p>Pick a way to place the cards.</p>",
    check: {
      kind: "num",
      q: "What is 305 × 24?",
      fig: mul2Fig(305, 24, 0),
      answer: 7320,
      unit: "",
      misc: [
        [1830, "That leaves out the 0 in the second row: 305 × 20 = 6,100."],
        [1220, "That’s only 305 × 4. Add 305 × 20 = 6,100."],
      ],
      explain: "305 × 4 = 1,220, and 305 × 20 = 6,100. 1,220 + 6,100 = 7,320.",
    },
  },
  {
    title: "Divide in chunks",
    widget: wDivide,
    body: "<p>To divide by a two-digit number, take away friendly chunks of it, like 10, 50, or 100 at a time, until nothing is left. Add the chunks for the quotient, and multiply back to check.</p><p>Pick a division.</p>",
    check: {
      kind: "num",
      q: "What is 1,575 ÷ 25?",
      answer: 63,
      unit: "",
      misc: [
        [60, "That’s only the first chunk. 60 × 25 = 1,500 leaves 75: 3 more 25s."],
        [1550, "That subtracts 25 once. Find how many 25s are in 1,575."],
      ],
      explain: "60 × 25 = 1,500, leaving 75, and 3 × 25 = 75. 60 + 3 = 63.",
    },
  },
];
