/* Learn Linear Equations, Inequalities, and Systems (Algebra 1 Unit 2), chapter 2: Writing equations (Lesson 2). Its widgets
   and steps; loaded by writing-equations.html, after common.js (money). */
/* the museum trip: admission for each person, and the bus, paid once */
const TICKET = 7,
  BUS = 180;
/* Change how many students and teachers go on the trip: every person pays admission, and the bus costs the same either way. */
function wTrip(el) {
  const q = Q(el),
    values = { students: 28, teachers: 3 },
    limits = { students: [20, 40], teachers: [1, 4] };
  el.innerHTML =
    `<div class="wrow">${stepper("students", "Students")}${stepper("teachers", "Teachers")}</div>` +
    `<p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { students, teachers } = values,
      people = students + teachers,
      tickets = TICKET * people,
      cost = tickets + BUS;
    q("students").textContent = students;
    q("teachers").textContent = teachers;
    q("e").innerHTML = typeset(math(`c = ${TICKET}(${students} + ${teachers}) + ${BUS} = ${cost}`));
    q("r").innerHTML =
      `${students} students and ${teachers} teacher${teachers === 1 ? "" : "s"} are ${people} people. ` +
      `${people} × ${money(TICKET)} = ` +
      `${money(tickets)} in admission, plus ${money(BUS)} for the bus: <b>${money(cost)}</b>. ` +
      `Another person adds ${money(TICKET)}; the bus stays ${money(BUS)}.`;
  };
  steppers(el, values, limits, draw);
  draw();
}

/* the car purchase: the sales tax rate and the dealer's fees */
const TAX_RATE = 0.06,
  FEES = 120,
  CAR_PRICES = [8000, 10000, 15000, 20000];
/* Pick a car's price: the tax is 6% of it, the fees are the same for every car, and the total is all three. */
function wCar(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Price",
      CAR_PRICES.map((price) => [price, money(price)]),
    ) + `<p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = (id) => {
    const price = +id,
      tax = TAX_RATE * price,
      total = price + tax + FEES;
    press(el, price);
    q("e").innerHTML = typeset(math(`t = ${price} + 0.06(${price}) + ${FEES} = ${total}`));
    q("r").innerHTML =
      `Tax: 6% of ${money(price)} is 0.06 × ${fmt(price)} = ${money(tax)}. Add the price, the tax, and ` +
      `${money(FEES)} in fees: <b>${money(total)}</b>. For any price ${typeset(math("p"))}, that’s ` +
      `${typeset(math("t = p + 0.06p + 120"))}, or ${typeset(math("t = 1.06p + 120"))}.`;
  };
  onPick(el, draw);
  draw(CAR_PRICES[1]);
}

const STEPS = [
  {
    title: "A cost for each, plus a cost once",
    widget: wTrip,
    body:
      `<p>To write an equation for a situation, find the quantities that change and how they’re related. Try a few numbers first, then use letters for the ones that change.</p>` +
      `<p>A class trip to a museum costs ${money(TICKET)} a person, plus ${money(BUS)} for the bus. With ${math("s")} students and ${math("t")} teachers, the cost is ${math("c = 7(s + t) + 180")}. Change the numbers.</p>`,
    check: {
      kind: "expr",
      q: `A bowling party costs $5 a person, plus $40 for the lane. Write an equation for the total cost ${math("c")} for ${math("p")} people.`,
      answer: "c=5p+40",
      vars: ["c", "p"],
      form: Expr.form.solvedFor("c"),
      keys: ["c", "p", "=", "(", ")"],
      placeholder: "like c = 2p + 10",
      misc: [
        ["c=40p+5", "The $5 is paid for each person, so it multiplies p. The $40 is paid once."],
        ["c=5(p+40)", "That pays $5 for 40 more people. The $40 is added once."],
        ["c=45p", "The $40 for the lane is paid once, not by every person."],
      ],
      explain: `${math("5p")} for the people, plus ${math("40")} for the lane: ${math("c = 5p + 40")}.`,
    },
  },
  {
    title: "Price, tax, and fees",
    widget: wCar,
    body:
      `<p>A percent of a number is a decimal times it: 6% of ${math("p")} is ${math("0.06p")}. A price plus 6% tax is ${math("p + 0.06p")}, which is ${math("1.06p")}.</p>` +
      `<p>A car costs its price, plus 6% sales tax, plus ${money(FEES)} in dealer fees. Pick a price.</p>`,
    check: {
      kind: "expr",
      q: `Sales tax is 8%, and there’s a $50 fee. Write an equation for the total cost ${math("c")} of a bike whose price is ${math("p")}.`,
      answer: "c=1.08p+50",
      vars: ["c", "p"],
      form: Expr.form.solvedFor("c"),
      keys: ["c", "p", "=", "(", ")"],
      placeholder: "like c = 2p + 10",
      misc: [
        ["c=0.08p+50", "That’s the tax and the fee, but not the price itself. Add p too."],
        ["c=1.8p+50", "8% is 0.08, not 0.8."],
        ["c=p+58", "8% of p is 0.08p, not 8 dollars."],
      ],
      explain: `The price, the tax, and the fee: ${math("c = p + 0.08p + 50")}, or ${math("c = 1.08p + 50")}.`,
    },
  },
];
