/* Learn Geometry, Time, and Money (Grade 2 Unit 6), chapter 5: Money problems. Its widgets and steps; loaded by money.html. */
/* Dollar bills and coins (a stepper for each): count the dollars, then the cents. */
function wDollarsCents(el) {
  const q = Q(el),
    values = { bills: 2, qs: 1, ds: 1, ps: 3 };
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow">${stepper("bills", "Dollar bills")}${stepper("qs", "Quarters")}${stepper("ds", "Dimes")}${stepper("ps", "Pennies")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const money = coinList(fromSteps(values)),
      total = centsOf(money),
      cents = total % 100,
      dollars = values.bills;
    Object.keys(values).forEach((key) => {
      q(key).textContent = values[key];
    });
    q("f").innerHTML = money.length ? moneyFig(money, { vals: true }) : empty("No money yet");
    q("r").innerHTML =
      `Dollars: <b>${dollars}</b>. Cents: ${cents ? `${countUp(money.filter((coin) => coin !== "B"))}, so <b>${cents}</b>` : "<b>0</b>"}.<br><span class="ok"><b>${dollars} dollar${dollars === 1 ? "" : "s"} and ${cents} cent${cents === 1 ? "" : "s"}</b>${total ? `: ${amt(total)}` : ""}</span><br><span class="dimline">Count the dollars. Then count the cents.</span>`;
  };
  steppers(el, values, { bills: [0, 5], qs: [0, 3], ds: [0, 2], ps: [0, 4] }, draw);
  draw();
}
/* things to buy and their prices in cents */
const SHOP = [
  ["sticker", 15],
  ["pencil", 30],
  ["eraser", 20],
  ["bouncy ball", 45],
  ["whistle", 35],
];
/* Spend a dollar: tap things to buy them (or put them back); what costs too much is turned off. */
function wShop(el) {
  /* bought: the things tapped */
  const q = Q(el);
  let bought = [];
  el.innerHTML = `<p class="story">You have <b>$1</b>. That’s 100¢. Tap things to buy them. Tap again to put them back.</p><div class="chips" data-c></div><p class="readout" data-r></p>`;
  const draw = () => {
    const spent = bought.reduce((sum, i) => sum + SHOP[i][1], 0);
    q("c").innerHTML = SHOP.map(
      ([name, cents], i) =>
        `<button type="button" class="chip" data-e="${i}" aria-pressed="${bought.includes(i)}"${!bought.includes(i) && spent + cents > 100 ? " disabled" : ""}>${name}: ${cents}¢</button>`,
    ).join("");
    q("r").innerHTML = bought.length
      ? `You spent ${bought.map((i) => SHOP[i][1]).join(" + ")} = <b>${spent}¢</b>.<br><span class="ok">100 − ${spent} = <b>${100 - spent}¢</b> left.</span>` +
        (spent === 100 ? '<br><span class="dimline">You spent the whole dollar!</span>' : "")
      : "What can you buy with 100¢?";
  };
  el.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-e]");
    if (!chip || chip.disabled) return;
    const i = +chip.dataset.e;
    bought = bought.includes(i) ? bought.filter((j) => j !== i) : [...bought, i];
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Dollars and cents",
    widget: wDollarsCents,
    body: "<p>We count <b>dollars</b> and <b>cents</b> separately. 2 dollar bills and 35¢ is 2 dollars and 35 cents. We write it <b>$2 and 35¢</b>.</p><p>Change the money and count.</p>",
    check: {
      kind: "mc",
      q: "How much money is this?",
      fig: moneyFig(coinList({ B: 2, q: 1, d: 1 })),
      choices: [
        { id: "a", label: "37¢" },
        { id: "b", label: "$2 and 35¢" },
        { id: "c", label: "$4" },
      ],
      answer: "b",
      why: {
        a: "A dollar bill is worth 100¢, not 1¢.",
        c: "There are 2 dollar bills. The coins are cents, not dollars.",
      },
      explain: "Dollars: 2. Cents: 25, 35. That’s 2 dollars and 35 cents: $2 and 35¢.",
    },
  },
  {
    title: "Story problems",
    widget: wShop,
    body: "<p>When you buy something, you spend money, so you have <b>less</b> left. To find what’s left, subtract. To find what two things cost together, add.</p>",
    check: {
      kind: "num",
      unit: "cents",
      answer: 35,
      q: "Mai has 80¢. Mai buys a bouncy ball for 45¢. How much money does Mai have left?",
      misc: [
        [125, "That’s adding. Mai spends money, so there is less left."],
        [45, "That’s the price of the ball. How much is left after paying?"],
        [80, "That’s what Mai had before buying the ball."],
      ],
      explain: "80 − 45 = 35. Or count up from 45: 55, 65, 75 is 30 more, and 5 more is 80. Mai has 35¢ left.",
    },
  },
];
