/* Learn Linear Equations, Inequalities, and Systems (Algebra 1 Unit 2), chapter 1: Planning a pizza party (Lesson 1). Its
   widgets and steps; loaded by pizza-party.html, after common.js (money). */
/* the letters in the meal equations, and what each stands for */
const MEAL_LETTERS = [
  ["m", "the cost of the main dish, in dollars"],
  ["n", "the number of side dishes"],
  ["s", "the cost of one side dish, in dollars"],
  ["t", "the total cost of the meal, in dollars"],
];
/* the four meal equations: the button's text, the TeX, what it says, and numbers that make it true */
const MEAL_EQUATIONS = [
  {
    id: "main",
    label: "m = 7.50",
    tex: "m = 7.50",
    says: "The main dish costs $7.50. Here m is one fixed number.",
    example: "Only m = 7.50 makes it true.",
  },
  {
    id: "more",
    label: "m = s + 4.50",
    tex: "m = s + 4.50",
    says: "The main dish costs $4.50 more than a side dish.",
    example: "A side dish at $3 means a main dish at $7.50. A side at $2 means a main at $6.50.",
  },
  {
    id: "sides",
    label: "ns = 6",
    tex: "ns = 6",
    says: "All the side dishes together cost $6: n of them at s dollars each.",
    example: "2 sides at $3, 3 sides at $2, or 4 sides at $1.50 all make it true.",
  },
  {
    id: "total",
    label: "m + ns = t",
    tex: "m + ns = t",
    says: "The total is the main dish plus all the side dishes.",
    example: "A $7.50 main dish and 2 sides at $3: 7.50 + 2 × 3 = 13.50, so t = 13.50.",
  },
];
/* Pick an equation about a meal: what it says in words, and numbers that make it true. */
function wMeal(el) {
  const q = Q(el);
  el.innerHTML =
    `<ul class="legend">${MEAL_LETTERS.map(([letter, meaning]) => `<li>${typeset(math(letter))} is ${meaning}</li>`).join("")}</ul>` +
    seg(
      "Equation",
      MEAL_EQUATIONS.map((e) => [e.id, e.label]),
    ) +
    `<p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = (id) => {
    const equation = MEAL_EQUATIONS.find((e) => e.id === id);
    press(el, id);
    q("e").innerHTML = typeset(math(equation.tex));
    q("r").innerHTML = `<b>${equation.says}</b> ${equation.example}`;
  };
  onPick(el, draw);
  draw("main");
}

/* the party's fixed numbers: slices in a pizza, the price of one pizza, and the budget */
const SLICES_PER_PIZZA = 8,
  PIZZA_PRICE = 12,
  BUDGET = 120;
/* Change how many people come and how many slices each eats: the pizzas to order (whole ones), their cost, and whether it
   fits the budget. */
function wParty(el) {
  const q = Q(el),
    values = { people: 20, slices: 3 },
    limits = { people: [8, 30], slices: [1, 4] };
  el.innerHTML =
    `<div class="wrow">${stepper("people", "People")}${stepper("slices", "Slices each")}</div>` +
    `<p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { people, slices } = values,
      slicesNeeded = people * slices,
      exact = slicesNeeded / SLICES_PER_PIZZA,
      pizzas = Math.ceil(exact),
      cost = pizzas * PIZZA_PRICE,
      leftOver = pizzas * SLICES_PER_PIZZA - slicesNeeded,
      pizzaWord = `${pizzas} pizza${pizzas === 1 ? "" : "s"}`,
      fits = cost <= BUDGET;
    q("people").textContent = people;
    q("slices").textContent = slices;
    q("e").innerHTML = typeset(
      math(`${PIZZA_PRICE} \\cdot ${pizzas} = ${cost}`) + (fits ? "" : ` ${math(`> ${BUDGET}`)}`),
    );
    /* the slices to pizzas line: a whole number of pizzas, or rounded up with slices left over */
    const pizzaLine = Number.isInteger(exact)
      ? `${slicesNeeded} ÷ ${SLICES_PER_PIZZA} = <b>${pizzaWord}</b>, with no slices left over.`
      : `${slicesNeeded} ÷ ${SLICES_PER_PIZZA} = ${fmt(exact)}, but pizzas come whole: <b>${pizzaWord}</b> ` +
        `(${leftOver} slice${leftOver === 1 ? "" : "s"} left over).`;
    q("r").innerHTML =
      `${people} people × ${slices} slice${slices === 1 ? "" : "s"} = ${slicesNeeded} slices. ${pizzaLine} ` +
      `At ${money(PIZZA_PRICE)} each, that’s ${money(cost)}: ` +
      (fits
        ? `<span class="ok">within the ${money(BUDGET)} budget</span>.`
        : `<span class="no">over the ${money(BUDGET)} budget</span>. Fewer slices each, or a smaller party.`);
  };
  steppers(el, values, limits, draw);
  draw();
}

const STEPS = [
  {
    title: "What the letters say",
    widget: wMeal,
    body:
      `<p>A <b>model</b> describes a situation with math. In a model, letters stand for quantities, like the cost of a main dish or the number of side dishes, and an equation says how the quantities are related.</p>` +
      `<p>Here are four equations about a meal. Pick one to read it in words.</p>`,
    check: {
      kind: "mc",
      stack: true,
      q: "Which equation says “a meal with 3 side dishes costs $15 in all”?",
      choices: [
        { id: "b", label: math("3(m + s) = 15") },
        { id: "a", label: math("m + 3s = 15") },
        { id: "c", label: math("m + s + 3 = 15") },
        { id: "d", label: math("3s = 15") },
      ],
      answer: "a",
      why: {
        b: "That buys 3 main dishes too. The meal has one main dish and 3 sides.",
        c: "That adds 3 dollars, not 3 side dishes. Three sides cost 3 times s.",
        d: "That leaves out the main dish: 3s is only the side dishes.",
      },
      explain: `One main dish (${math("m")}) plus 3 side dishes (${math("3s")}) is the total, 15.`,
    },
  },
  {
    title: "Plans and constraints",
    widget: wParty,
    body:
      `<p>Plan a party: 8 slices in a pizza, ${money(PIZZA_PRICE)} a pizza, and a ${money(BUDGET)} budget. If ${math("p")} people each eat ${math("s")} slices, you need ${math("ps")} slices, or ${math("\\tfrac{ps}{8}")} pizzas, so the cost is ${math("12 \\cdot \\tfrac{ps}{8}")} dollars.</p>` +
      `<p>A <b>constraint</b> limits what’s possible or reasonable. Here, pizzas come whole, and the cost can’t go over the budget: ${math("c \\le 120")}.</p>` +
      `<p>Change the number of people and slices.</p>`,
    check: {
      kind: "num",
      q: "24 people each eat 3 slices. A pizza has 8 slices and costs $12. How much do the pizzas cost?",
      answer: 108,
      unit: "dollars",
      misc: [
        [9, "That’s how many pizzas. Each one costs $12."],
        [864, "72 is the number of slices, not pizzas: 72 ÷ 8 = 9 pizzas."],
        [36, "That’s $12 for each slice a person eats. Find the slices for everyone first: 24 × 3."],
      ],
      explain: "24 × 3 = 72 slices, and 72 ÷ 8 = 9 pizzas. 9 × $12 = $108.",
    },
  },
];
