/* Learn Linear Equations, Inequalities, and Systems (Algebra 1 Unit 2), chapter 6: Equivalent equations (Lesson 6). Its
   widgets and steps; loaded by equivalent-equations.html, after common.js. */
/* Noah's jeans: the price Noah's equation is solved by */
const JEANS_PRICE = 60;
/* Noah's equation and IM's six equations made from it: the button, the equation (TeX, with x the price), its two sides as
   functions of x, its solution, and what was done to get it */
const JEANS_EQUATIONS = [
  {
    id: "noah",
    label: "Noah’s",
    tex: "x - 0.1x + 2.70 = 56.70",
    left: (x) => x - 0.1 * x + 2.7,
    right: 56.7,
    solution: 60,
    what: "Noah’s equation: the price, minus the 10% coupon, plus $2.70 tax, is $56.70.",
  },
  {
    id: "A",
    label: "A",
    tex: "100x - 10x + 270 = 5670",
    left: (x) => 100 * x - 10 * x + 270,
    right: 5670,
    solution: 60,
    what: "Both sides times 100: the same amounts, in cents instead of dollars.",
  },
  {
    id: "B",
    label: "B",
    tex: "x - 0.1x = 54",
    left: (x) => x - 0.1 * x,
    right: 54,
    solution: 60,
    what: "2.70 taken off both sides: the price after the coupon, before tax, is $54.",
  },
  {
    id: "C",
    label: "C",
    tex: "0.9x + 2.70 = 56.70",
    left: (x) => 0.9 * x + 2.7,
    right: 56.7,
    solution: 60,
    what: "x − 0.1x combined into 0.9x: 10% off means paying 90% of the price.",
  },
  {
    id: "D",
    label: "D",
    tex: "x - 0.1x = 56.70",
    left: (x) => x - 0.1 * x,
    right: 56.7,
    solution: 63,
    what: "2.70 taken off the left side only: it says the price after the coupon, before tax, is $56.70.",
  },
  {
    id: "E",
    label: "E",
    tex: "x - 0.1x = 59.40",
    left: (x) => x - 0.1 * x,
    right: 59.4,
    solution: 66,
    what: "2.70 taken off the left side, but added to the right side.",
  },
  {
    id: "F",
    label: "F",
    tex: "2(x - 0.1x + 2.70) = 56.70",
    left: (x) => 2 * (x - 0.1 * x + 2.7),
    right: 56.7,
    solution: 28.5,
    what: "The left side doubled, but not the right: two pairs of jeans, with the coupon and tax, cost $56.70.",
  },
];
/* an amount as the equations write it: whole numbers plain, others to the cent (56.70) */
const amount = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2));
/* Pick one of the equations made from Noah's: try x = 60 in it. When 60 still makes it true, it's equivalent to Noah's. */
function wJeans(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Equation",
      JEANS_EQUATIONS.map((equation) => [equation.id, equation.label]),
    ) + `<p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = (id) => {
    const equation = JEANS_EQUATIONS.find((e) => e.id === id),
      /* the left side at x = 60, to the cent, so 0.1 × 60 doesn't leave a floating-point crumb */
      leftAtPrice = Math.round(equation.left(JEANS_PRICE) * 100) / 100,
      stillTrue = leftAtPrice === equation.right,
      substituted = equation.tex
        .split("=")[0]
        .replace(/(\d[\d.]*)?x/g, (_, coefficient) =>
          coefficient ? `${coefficient}(${JEANS_PRICE})` : String(JEANS_PRICE),
        );
    press(el, id);
    q("e").innerHTML = typeset(math(equation.tex));
    q("r").innerHTML =
      `${equation.what} With ${typeset(math(`x = ${JEANS_PRICE}`))}: ` +
      `${typeset(math(`${substituted}= ${amount(leftAtPrice)}`))}` +
      (stillTrue
        ? `. <span class="ok">60 is still the solution</span>` +
          (id === "noah" ? ": the jeans cost $60 before the coupon." : ", so it’s equivalent to Noah’s equation.")
        : `, not ${amount(equation.right)}. <span class="no">60 isn’t a solution</span>: this one is solved by ` +
          `${typeset(math(`x = ${amount(equation.solution)}`))}, so it isn’t equivalent to Noah’s.`);
  };
  onPick(el, draw);
  draw("noah");
}

/* the equation the moves start from, 3a + 6 = 15, as a's coefficient, the number added to it on the left, and the right
   side, each an exact fraction; its solution; and how many moves the chain holds */
const START = { coefficient: frac(3), added: frac(6), right: frac(15) },
  START_SOLUTION = frac(3),
  MAX_MOVES = 5;
/* the moves: the button, whether it does the same to both sides, and the equation it makes from one */
const MOVES = [
  {
    id: "minus6",
    label: "− 6 both sides",
    both: true,
    apply: (e) => ({ ...e, added: fSub(e.added, frac(6)), right: fSub(e.right, frac(6)) }),
  },
  {
    id: "plus4",
    label: "+ 4 both sides",
    both: true,
    apply: (e) => ({ ...e, added: fAdd(e.added, frac(4)), right: fAdd(e.right, frac(4)) }),
  },
  {
    id: "times2",
    label: "× 2 both sides",
    both: true,
    apply: (e) => ({
      coefficient: fMul(e.coefficient, frac(2)),
      added: fMul(e.added, frac(2)),
      right: fMul(e.right, frac(2)),
    }),
  },
  {
    id: "divide3",
    label: "÷ 3 both sides",
    both: true,
    apply: (e) => ({
      coefficient: fDiv(e.coefficient, frac(3)),
      added: fDiv(e.added, frac(3)),
      right: fDiv(e.right, frac(3)),
    }),
  },
  {
    id: "leftOnly",
    label: "− 6 left only",
    both: false,
    apply: (e) => ({ ...e, added: fSub(e.added, frac(6)) }),
  },
  {
    id: "rightOnly",
    label: "× 2 right only",
    both: false,
    apply: (e) => ({ ...e, right: fMul(e.right, frac(2)) }),
  },
];
/* an exact fraction in TeX: −2, \frac{5}{3}, or -\frac{1}{3} */
const texFrac = ([n, d]) => (d === 1 ? String(n) : `${n < 0 ? "-" : ""}\\frac{${Math.abs(n)}}{${d}}`);
/* an equation coefficient·a + added = right in TeX: 3a + 6 = 15, a = 3, \frac{1}{3}a - 2 = 1 */
function texEquation({ coefficient, added, right }) {
  const term = isWhole(coefficient) && coefficient[0] === 1 ? "a" : `${texFrac(coefficient)}a`,
    constant = added[0] === 0 ? "" : `${added[0] < 0 ? " - " : " + "}${texFrac([Math.abs(added[0]), added[1]])}`;
  return `${term}${constant} = ${texFrac(right)}`;
}
/* Make moves on 3a + 6 = 15, one at a time: each line is the equation after a move. Moves that do the same to both sides
   keep a = 3 the solution; a move on one side only changes it. */
function wMoves(el) {
  const q = Q(el);
  /* the equations so far, each with the move that made it (none for the first) */
  let chain;
  el.innerHTML =
    `<div class="wrow moves">${MOVES.map((move) => `<button type="button" class="ghost-btn" data-mv="${move.id}">${move.label}</button>`).join("")}</div>` +
    `<div class="wrow"><button type="button" class="ghost-btn" data-reset>Start over</button></div>` +
    `<ol class="chain" data-c></ol><p class="readout" data-r></p>`;
  const draw = () => {
    const current = chain[chain.length - 1].equation,
      solution = fDiv(fSub(current.right, current.added), current.coefficient),
      stillThree = solution[0] === START_SOLUTION[0] && solution[1] === START_SOLUTION[1],
      firstOneSided = chain.find((line) => line.move && !line.move.both),
      full = chain.length > MAX_MOVES;
    el.querySelectorAll("[data-mv]").forEach((button) => (button.disabled = full));
    q("c").innerHTML = chain
      .map(
        ({ equation, move }) =>
          `<li>${typeset(math(texEquation(equation)))}` +
          `${move ? `<span class="mv ${move.both ? "ok" : "no"}">${move.label}</span>` : ""}</li>`,
      )
      .join("");
    q("r").innerHTML =
      `Solution: ${typeset(math(`a = ${texFrac(solution)}`))}. ` +
      (stillThree
        ? `<span class="ok">Still 3</span>: ` +
          (chain.length === 1
            ? "pick a move."
            : `every equation here is equivalent to ${typeset(math("3a + 6 = 15"))}.`)
        : `<span class="no">Not 3 any more</span>: “${firstOneSided.move.label}” did something different to each side, ` +
          `so the equations after it aren’t equivalent to ${typeset(math("3a + 6 = 15"))}.`) +
      (full ? " Start over to try more moves." : "");
  };
  el.addEventListener("click", (e) => {
    const moveButton = e.target.closest("[data-mv]");
    if (moveButton && chain.length <= MAX_MOVES) {
      const move = MOVES.find((m) => m.id === moveButton.dataset.mv);
      chain.push({ equation: move.apply(chain[chain.length - 1].equation), move });
      draw();
    }
    if (e.target.closest("[data-reset]")) {
      chain = [{ equation: START, move: null }];
      draw();
    }
  });
  chain = [{ equation: START, move: null }];
  draw();
}

const STEPS = [
  {
    title: "The same solution",
    widget: wJeans,
    body:
      `<p>Two equations are <b>equivalent</b> when they have exactly the same solutions.</p>` +
      `<p>Noah bought jeans with a 10% off coupon and paid $56.70, including $2.70 in sales tax: ${math("x - 0.1x + 2.70 = 56.70")}, where ${math("x")} is the price before the coupon. Its solution is 60. Each of equations A to F was made from Noah’s. Pick one, and see whether 60 still makes it true.</p>`,
    check: {
      kind: "mc",
      q: `Five tubs of yogurt cost $6: ${math("5y = 6")}. Which equation is equivalent to it?`,
      choices: [
        { id: "a", label: math("5y = 12") },
        { id: "b", label: math("15y = 18") },
        { id: "c", label: math("5y + 4 = 6") },
        { id: "d", label: math("5y - 1 = 3") },
      ],
      answer: "b",
      why: {
        a: "That doubles the right side but not the left. Its solution is 2.40, not 1.20.",
        c: "That adds 4 to the left side but not the right. Its solution is 0.40, not 1.20.",
        d: "Taking 1 off the left means taking 1 off the right too: 5y − 1 = 5.",
      },
      explain: `Both sides times 3: ${math("15y = 18")}. Both equations are solved by ${math("y = 1.20")}, the price of a tub.`,
    },
  },
  {
    title: "Acceptable moves",
    widget: wMoves,
    body:
      `<p>“The middle child is 5 years older than the youngest” can be ${math("m = y + 5")}, ${math("m - y = 5")}, or ${math("2m - 2y = 10")}: different equations, the same pairs of ages.</p>` +
      `<p>Moves that keep an equation’s solutions: add or subtract the same number on both sides, multiply or divide both sides by the same number (not 0), and rewrite a side with the distributive property or by combining like terms. Solving an equation is making equivalent equations until the letter is by itself. Make moves on ${math("3a + 6 = 15")}.</p>`,
    check: {
      kind: "mc",
      q: `Each equation was made from ${math("2x + 4 = 10")} in one move. Which one is <b>not</b> equivalent to it?`,
      choices: [
        { id: "a", label: math("x + 2 = 5") },
        { id: "b", label: math("2x = 6") },
        { id: "c", label: math("4x + 8 = 20") },
        { id: "d", label: math("2x = 14") },
      ],
      answer: "d",
      why: {
        a: "Both sides divided by 2: that’s acceptable, and x = 3 still makes it true.",
        b: "4 taken off both sides: that’s acceptable, and x = 3 still makes it true.",
        c: "Both sides times 2: that’s acceptable, and x = 3 still makes it true.",
      },
      explain: `${math("2x = 14")} takes 4 off the left side but adds 4 to the right. Its solution is ${math("x = 7")}; the others are solved by ${math("x = 3")}.`,
    },
  },
];
