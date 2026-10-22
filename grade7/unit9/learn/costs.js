/* Learn Putting It All Together (Grade 7 Unit 9), chapter 2: Costs and profit. Its widgets and steps; loaded by costs.html. */
/* Pick a markup on a dish whose food costs $4: the menu price is the cost plus that percent of it. */
function wMarkup(el) {
  const q = Q(el),
    cost = 4,
    markups = [50, 100, 150, 200];
  el.innerHTML =
    seg(
      "Markup",
      markups.map((m, i) => [i, `${m}%`]),
    ) + `<p class="readout" data-r></p>`;
  const draw = (index) => {
    const up = markups[index],
      extra = (cost * up) / 100;
    press(el, index);
    q("r").innerHTML =
      `${up}% of ${money(cost)} is ${money(extra)}, so the menu price is ${money(cost)} + ${money(extra)} = <b>${money(cost + extra)}</b>: ` +
      `${100 + up}% of the cost.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* Change the meals sold at $12 each on a night that costs $350: profit is the money in minus the costs. */
function wProfit(el) {
  const q = Q(el),
    price = 12,
    costs = 350,
    values = { meals: 40 };
  el.innerHTML = `<div class="wrow">${stepper("meals", "Meals sold")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const { meals } = values,
      moneyIn = meals * price,
      profit = moneyIn - costs;
    q("meals").textContent = meals;
    q("r").innerHTML =
      `Money in: ${meals} × ${money(price)} = ${money(moneyIn)}. Costs: ${money(costs)}. ` +
      (profit >= 0
        ? `Profit: ${money(moneyIn)} − ${money(costs)} = <b>${money(profit)}</b>.`
        : `That’s <b>${money(-profit)} short</b> of the costs: a loss.`);
  };
  steppers(el, values, { meals: [20, 60] }, draw);
  draw();
}

const STEPS = [
  {
    title: "Menu prices",
    widget: wMarkup,
    body: "<p>A restaurant pays for the food in a dish, then <b>marks up</b> the price to cover its other costs: the menu price is the food cost plus a percent of it.</p><p>Pick a markup.</p>",
    check: {
      kind: "num",
      q: "The food in a sandwich costs $3. The restaurant marks it up 150%. What is the menu price?",
      answer: 7.5,
      unit: "dollars",
      misc: [
        [4.5, "That’s the markup. Add it to the $3 cost."],
        [153, "That adds 150 dollars. 150% of $3 is $4.50."],
      ],
      explain: "150% of $3 is $4.50, and $3 + $4.50 = $7.50.",
    },
  },
  {
    title: "Profit",
    widget: wProfit,
    body: "<p>The <b>profit</b> is the money that comes in minus everything it costs to run the restaurant. Selling too few meals means a loss.</p><p>Change the meals sold.</p>",
    check: {
      kind: "num",
      q: "A food truck sells 60 meals at $9 each. Its costs for the day are $320. What is its profit?",
      answer: 220,
      unit: "dollars",
      misc: [
        [540, "That’s the money in. Take away the costs."],
        [860, "Costs are paid out: subtract them."],
      ],
      explain: "60 × $9 = $540, and $540 − $320 = $220.",
    },
  },
];
