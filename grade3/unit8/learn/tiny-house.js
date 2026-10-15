/* Learn Putting It All Together (Grade 3 Unit 8), chapter 3: Tiny houses. Its widgets and steps; loaded by tiny-house.html. */
/* the houses to plan (HOUSES in ../figs.js): [button, house, the bedroom's shortest and longest length] — kept so both rooms'
   areas are within 100 square feet */
const PLANS = [
  ["Shipping container", HOUSES.container, [8, 12]],
  ["School bus", HOUSES.bus, [4, 10]],
  ["Cabin", HOUSES.cabin, [4, 6]],
];
/* Split a tiny house into a bedroom and a kitchen with a wall (a stepper): each room's area, and how they add up to the whole. */
function wPlan(el) {
  /* values.bed: how long the bedroom is, in feet; the kitchen is the rest */
  const q = Q(el),
    values = { bed: 10 },
    limits = { bed: PLANS[0][2] };
  let planIndex = 0;
  el.innerHTML =
    seg(
      "House",
      PLANS.map(([button], i) => [i, button]),
    ) +
    `<div class="wrow">${stepper("bed", "Bedroom length")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { wide, long } = PLANS[planIndex][1],
      bed = values.bed,
      kitchen = long - bed,
      [bedArea, kitchenArea] = [wide * bed, wide * kitchen];
    press(el, planIndex);
    q("bed").textContent = bed;
    q("f").innerHTML = floorPlan(wide, [bed, kitchen], {
      names: ["Bedroom", "Kitchen"],
      inside: [`${wide} × ${bed}`, `${wide} × ${kitchen}`],
      label: `A floor plan ${wide} feet by ${long} feet: a bedroom ${bed} feet long and a kitchen ${kitchen} feet long`,
    });
    q("r").innerHTML =
      `Bedroom: ${wide} × ${bed} = ${bedArea} square feet. Kitchen: ${wide} × ${kitchen} = ${kitchenArea} square feet.<br>` +
      `<span class="ok">Together: ${bedArea} + ${kitchenArea} = ${bedArea + kitchenArea} square feet, the same as ${wide} × ${long}.</span><br>` +
      `<span class="dimline">Around the whole house: ${wide} + ${long} + ${wide} + ${long} = ${2 * (wide + long)} feet.</span>`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (id) => {
    planIndex = +id;
    limits.bed = PLANS[planIndex][2];
    values.bed = Math.min(Math.max(values.bed, limits.bed[0]), limits.bed[1]);
    draw();
  });
  draw();
}
/* dollars with a comma: $1,030 */
const dollars = (n) => "$" + n.toLocaleString("en-US");
/* the kitchen to shop for: 8 feet by 10 feet */
const KITCHEN = { wide: 8, long: 10 };
/* floors for it, and their cost for each square foot: [id, button, name, price] */
const FLOORS = [
  ["none", "No floor", "", 0],
  ["carpet", "Carpet $2", "Carpet", 2],
  ["wood", "Wood $4", "Wood", 4],
  ["tile", "Tile $5", "Tile", 5],
];
/* things to buy: [id, name, price] */
const BUYS = [
  ["stove", "Stove", 280],
  ["sink", "Sink", 150],
  ["fridge", "Fridge", 350],
  ["table", "Table", 90],
];
/* Shop for a kitchen on a $1,000 budget: pick a floor (cost per square foot times the area) and things to buy (each button
   toggles), and see the total and what's left. */
function wShop(el) {
  /* bought: the ids of the things in the cart */
  const q = Q(el),
    bought = new Set(),
    budget = 1000,
    area = KITCHEN.wide * KITCHEN.long;
  let floor = "none";
  el.innerHTML =
    `<div data-top>${seg(
      "Floor",
      FLOORS.map(([id, button]) => [id, button]),
    )}</div>` +
    `<div class="wrow">${BUYS.map(([id, name, price]) => `<button type="button" class="ghost-btn" data-buy="${id}" aria-pressed="false">${name} $${price}</button>`).join("")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [, , floorName, perFoot] = FLOORS.find(([id]) => id === floor),
      /* the costs in the cart: [what, cost, how it's worked out] */
      costs = [
        ...(perFoot ? [[floorName, area * perFoot, `${area} × ${perFoot} = ${area * perFoot}`]] : []),
        ...BUYS.filter(([id]) => bought.has(id)).map(([, name, price]) => [name, price, `${price}`]),
      ],
      spent = costs.reduce((sum, [, cost]) => sum + cost, 0);
    press(q("top"), floor);
    el.querySelectorAll("[data-buy]").forEach((b) => b.setAttribute("aria-pressed", bought.has(b.dataset.buy)));
    q("f").innerHTML = floorPlan(KITCHEN.wide, [KITCHEN.long], {
      names: ["Kitchen"],
      inside: [`${area} sq ft`],
      label: "A kitchen 8 feet by 10 feet: 80 square feet",
    });
    q("r").innerHTML = !costs.length
      ? `The kitchen is 8 × 10 = 80 square feet. Pick a floor and things to buy. The budget is $1,000.`
      : costs.map(([name, , work]) => `${name}: ${work}`).join("<br>") +
        `<br>Total: ${costs.length > 1 ? `${costs.map(([, cost]) => cost).join(" + ")} = ` : ""}<b>${dollars(spent)}</b>. ` +
        (spent <= budget
          ? `<span class="ok">That fits the budget, with 1000 − ${spent} = $${budget - spent} left.</span>`
          : `That’s $${spent - budget} over the $1,000 budget. Take something out.`);
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top"]) || [],
      buy = e.target.closest("[data-buy]");
    if (row) floor = id;
    if (buy) bought.has(buy.dataset.buy) ? bought.delete(buy.dataset.buy) : bought.add(buy.dataset.buy);
    if (row || buy) draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  bus: floorPlan(7, [6, 8], {
    names: ["Bedroom", "Kitchen"],
    label: "A floor plan 7 feet wide: a bedroom 6 feet long and a kitchen 8 feet long",
  }),
  room: floorPlan(8, [10], { names: ["Room"], label: "A room 8 feet by 10 feet" }),
};
const STEPS = [
  {
    title: "Plan the rooms",
    widget: wPlan,
    body: "<p>Tiny houses are made from shipping containers, school buses, and small cabins. A floor is a rectangle, so its <b>area</b> is its width times its length, in square feet. A wall splits it into rooms: each room is a rectangle too, and the rooms’ areas add up to the whole floor. The <b>perimeter</b> is the distance around.</p><p>Pick a house and move the wall.</p>",
    check: {
      kind: "num",
      q: "This tiny house is 7 feet wide. What is the area of the kitchen floor?",
      fig: F.bus,
      answer: 56,
      unit: "square feet",
      misc: [
        [98, "That’s the whole house. Find just the kitchen."],
        [42, "That’s the bedroom. Find the kitchen."],
        [30, "That’s the length around the kitchen. Area multiplies: 7 × 8."],
        [15, "That adds the sides. Area multiplies them: 7 × 8."],
      ],
      explain: "The kitchen is 7 feet by 8 feet: 7 × 8 = 56 square feet.",
    },
  },
  {
    title: "What does it cost?",
    widget: wShop,
    body: "<p>Flooring is priced by the square foot, so multiply: square feet × the cost of 1 square foot. Then add up everything you buy, and subtract from the budget to see what’s left.</p><p>Pick a floor and things to buy.</p>",
    check: {
      kind: "num",
      q: "Wood flooring costs $4 a square foot. The room is 8 feet by 10 feet. How much does the flooring cost?",
      fig: F.room,
      answer: 320,
      unit: "dollars",
      misc: [
        [80, "That’s the area: 80 square feet. Each square foot costs $4."],
        [144, "That uses the perimeter. Flooring covers the area."],
        [84, "That adds $4. Each of the 80 square feet costs $4: multiply."],
      ],
      explain: "8 × 10 = 80 square feet, and 80 × 4 = 320. The flooring costs $320.",
    },
  },
];
