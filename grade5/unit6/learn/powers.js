/* Learn More Decimal and Fraction Operations (Grade 5 Unit 6), chapter 1: Powers of 10. Its widgets and steps; loaded by
   powers.html. */
/* numbers to move, and what to do to them: [button, × (1) or ÷ (−1), the power of 10] */
const START = [3.5, 42, 0.7];
const MOVES = [
  ["× 10", 1, 1],
  ["× 100", 1, 2],
  ["× 1,000", 1, 3],
  ["÷ 10", -1, 1],
  ["÷ 100", -1, 2],
];
/* a number as written: commas in whole numbers, decimals as short as they go */
const written = (v) => (Number.isInteger(v) ? commas(v) : String(+v.toFixed(4)));
/* Pick a number and a power of 10 to multiply or divide by (two rows of buttons): every digit moves. */
function wShift(el) {
  const q = Q(el);
  let startIndex = 0,
    moveIndex = 1;
  el.innerHTML = `<div data-top>${seg(
    "Number",
    START.map((v, i) => [i, written(v)]),
  )}</div><div data-bot>${seg(
    "Move",
    MOVES.map(([button], i) => [i, button]),
  )}</div><div data-c></div><p class="readout" data-r></p>`;
  const draw = () => {
    const start = START[startIndex],
      [button, sign, p] = MOVES[moveIndex],
      result = sign > 0 ? Math.round(start * 10 ** p * 1000) / 1000 : Math.round((start / 10 ** p) * 10000) / 10000;
    press(q("top"), startIndex);
    press(q("bot"), moveIndex);
    q("c").innerHTML = pvChart(
      [
        ["", start],
        [button, result],
      ],
      -1,
      { places: [4, 3, 2, 1, 0, -1, -2, -3] },
    );
    q("r").innerHTML =
      `Each digit moves ${p} ${p === 1 ? "place" : "places"} ${sign > 0 ? "left" : "right"}: <b>${written(start)} ${button} = ${written(result)}</b>.`;
  };
  el.addEventListener("click", (e) => {
    const hit = segHit(e, ["top", "bot"]);
    if (!hit) return;
    if (hit[0] === "top") startIndex = +hit[1];
    else moveIndex = +hit[1];
    draw();
  });
  draw();
}
/* Step a digit and an exponent: a × 10 to that power. */
function wExponent(el) {
  const q = Q(el),
    values = { digit: 4, exponent: 3 },
    limits = { digit: [1, 9], exponent: [1, 6] };
  el.innerHTML =
    `<div class="wrow">${stepper("digit", "Number")}${stepper("exponent", "Exponent")}</div>` +
    `<p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { digit, exponent } = values,
      power = 10 ** exponent;
    q("digit").textContent = digit;
    q("exponent").textContent = exponent;
    q("e").innerHTML = `${digit} × 10<sup>${exponent}</sup> = ${commas(digit * power)}`;
    q("r").innerHTML = `10<sup>${exponent}</sup> = ${range(exponent)
      .map(() => "10")
      .join(
        " × ",
      )} = ${commas(power)}: 1 followed by ${exponent} ${exponent === 1 ? "zero" : "zeros"}. Times ${digit} is <b>${commas(digit * power)}</b>.`;
  };
  steppers(el, values, limits, draw);
  draw();
}
const STEPS = [
  {
    title: "The digits move",
    widget: wShift,
    body: "<p>Each place is 10 times the place to its right. So multiplying by 10 moves every digit one place left, and dividing by 10 moves every digit one place right. × 100 moves them two places, × 1,000 three.</p><p>Pick a number and a move.</p>",
    check: {
      kind: "num",
      q: "What is 0.45 × 100?",
      answer: 45,
      unit: "",
      misc: [
        [4.5, "That’s × 10. 100 has 2 zeros: move each digit 2 places left."],
        [0.0045, "That divides. Multiplying by 100 makes it bigger: the digits move left."],
      ],
      explain: "Each digit moves 2 places left: 0.45 × 100 = 45.",
    },
  },
  {
    title: "Exponents",
    widget: wExponent,
    body: "<p>A <b>power of 10</b> is 10 multiplied by itself: 10 × 10 × 10 = 1,000. We write it with an <b>exponent</b>: 10<sup>3</sup>. The exponent says how many tens are multiplied, and how many zeros follow the 1.</p><p>Change the number and the exponent.</p>",
    check: {
      kind: "num",
      q: "What is 7 × 10<sup>3</sup>?",
      answer: 7000,
      unit: "",
      misc: [
        [21, "10³ isn’t 10 × 3. It’s 10 × 10 × 10 = 1,000."],
        [700, "That has one zero too few. 10³ is 1 followed by 3 zeros."],
      ],
      explain: "10³ = 1,000, so 7 × 10³ = 7,000.",
    },
  },
];
