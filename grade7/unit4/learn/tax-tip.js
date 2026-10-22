/* Learn Proportional Relationships and Percentages (Grade 7 Unit 4), chapter 4: Tax, tips, and deals. Its widgets and
   steps; loaded by tax-tip.html. */
/* Change the tax rate on a $40 sweater, and the tip on a $40 dinner: each is that percent of $40. */
function wTax(el) {
  const q = Q(el),
    price = 40,
    values = { rate: 6 };
  el.innerHTML = `<div class="wrow">${stepper("rate", "Rate (%)")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const { rate } = values,
      amount = (price * rate) / 100;
    q("rate").textContent = rate;
    q("r").innerHTML =
      `${rate}% of ${money(price)}: 1% is $0.40, so ${rate}% is ${rate} × $0.40 = <b>${money(amount)}</b>. ` +
      `As sales tax on a ${money(price)} sweater, you pay ${money(price + amount)} in all. As a tip on a ${money(price)} dinner, you leave ${money(amount)}.`;
  };
  steppers(el, values, { rate: [1, 25] }, draw);
  draw();
}

/* deals and earnings: [label, words, the amount, the percent, add the percent on (true) or take it off (false), or just
   find it (null)] */
const DEALS = [
  ["Discount", "30% off an $80 coat", 80, 30, false],
  ["Markup", "a store marks up a $20 hat 50%", 20, 50, true],
  ["Commission", "a 5% commission on $400 of sales", 400, 5, null],
  ["Interest", "3% interest for a year on $500", 500, 3, true],
];
/* Pick a deal: each is a percent of an amount, added on, taken off, or kept by itself. */
function wDeals(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Deal",
      DEALS.map(([label], i) => [i, label]),
    ) + `<p class="readout" data-r></p>`;
  const draw = (index) => {
    const [label, words, amount, p, addOn] = DEALS[index],
      part = (amount * p) / 100;
    press(el, index);
    q("r").innerHTML =
      `${label}: ${words}. ${p}% of ${money(amount)} is ${money(part)}. ` +
      (addOn === null
        ? `The commission is <b>${money(part)}</b>.`
        : `${addOn ? "Add it on" : "Take it off"}: ${money(amount)} ${addOn ? "+" : "−"} ${money(part)} = <b>${money(amount + (addOn ? part : -part))}</b>.`);
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* price changes: [old, new] */
const MOVES = [
  [40, 50],
  [50, 40],
  [80, 100],
];
/* Pick a price change: the percent change is the change divided by the old price. */
function wPercent(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Price",
      MOVES.map(([from, to], i) => [i, `${money(from)} → ${money(to)}`]),
    ) + `<p class="readout" data-r></p>`;
  const draw = (index) => {
    const [from, to] = MOVES[index],
      change = Math.abs(to - from);
    press(el, index);
    q("r").innerHTML =
      `It ${to > from ? "went up" : "went down"} ${money(change)}. Compare that to the <b>old</b> price: ${money(change)} ÷ ${money(from)} = ${fmt(change / from)}, ` +
      `a <b>${fmt((100 * change) / from)}% ${to > from ? "increase" : "decrease"}</b>.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "Tax and tip",
    widget: wTax,
    body: "<p>Sales tax and a tip are both a percent of the price, added on. Find 1% (or 10%) first, then scale up.</p><p>Change the rate.</p>",
    check: {
      kind: "num",
      q: "A family’s dinner costs $45. They leave a 20% tip. How much is the tip?",
      answer: 9,
      unit: "dollars",
      misc: [
        [54, "That’s the dinner with the tip. The question asks for the tip only."],
        [4.5, "That’s 10%. A 20% tip is twice that."],
        [20, "That’s $20. 20% of $45 is 20 cents on every dollar."],
      ],
      explain: "10% of $45 is $4.50, so 20% is $9.",
    },
  },
  {
    title: "Discounts, markups, and more",
    widget: wDeals,
    body: "<p>Many everyday percents work the same way: a <b>discount</b> takes a percent off, a <b>markup</b> adds a percent on, <b>interest</b> adds a percent to savings, and a <b>commission</b> is a percent of sales that a salesperson earns.</p><p>Pick a deal.</p>",
    check: {
      kind: "num",
      q: "A $120 bike is 25% off. What is the sale price?",
      answer: 90,
      unit: "dollars",
      misc: [
        [30, "That’s the discount. Take it off $120."],
        [150, "A discount lowers the price."],
        [95, "That takes off $25. 25% of $120 is $30."],
      ],
      explain: "25% of $120 is $30, and $120 − $30 = $90.",
    },
  },
  {
    title: "Finding the percent change",
    widget: wPercent,
    body: "<p>To find a percent increase or decrease, divide the change by the <b>old</b> amount, the one you started from.</p><p>Pick a price change.</p>",
    check: {
      kind: "num",
      q: "The price of a ticket went from $20 to $25. By what percent did it go up?",
      answer: 25,
      unit: "%",
      misc: [
        [20, "That compares the change to the new price. Compare it to the old price, $20."],
        [5, "That’s the change in dollars. Write it as a percent of $20."],
      ],
      explain: "It went up $5, and $5 ÷ $20 = 0.25: a 25% increase.",
    },
  },
];
