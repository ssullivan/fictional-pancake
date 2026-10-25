/* Learn Linear Equations, Inequalities, and Systems (Algebra 1 Unit 2), chapter 4: Equations and their solutions (Lesson 4).
   Its widgets and steps; loaded by solutions.html, after common.js (fmt, money). */
/* the granola bite: 4 calories in a gram of carbohydrate, 5 calories from the rest, and 27 calories in all */
const CARB_CALORIES = 4,
  OTHER_CALORIES = 5,
  BITE_CALORIES = 27;
/* Try values of c, in halves, in 4c + 5 = 27: too few calories, too many, or exactly 27 (the solution, 5.5). */
function wGranola(el) {
  const q = Q(el),
    /* the stepper counts half grams, so c is halves / 2 */
    values = { halves: 6 },
    limits = { halves: [0, 16] };
  el.innerHTML =
    `<div class="wrow">${stepper("halves", "Grams of carbs (c)")}</div>` +
    `<p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const grams = values.halves / 2,
      calories = CARB_CALORIES * grams + OTHER_CALORIES,
      sign = calories === BITE_CALORIES ? "=" : calories < BITE_CALORIES ? "<" : ">";
    q("halves").textContent = fmt(grams);
    q("e").innerHTML = typeset(math(`4(${grams}) + 5 = ${calories} ${sign === "=" ? "" : `${sign} 27`}`));
    q("r").innerHTML =
      sign === "="
        ? `<span class="ok">${fmt(grams)} is the solution</span>: it makes ${typeset(math("4c + 5 = 27"))} true. ` +
          `The bite has ${fmt(grams)} grams of carbohydrate.`
        : `${fmt(grams)} isn’t a solution: it makes ${calories} calories, ` +
          `<span class="no">${sign === "<" ? "fewer" : "more"} than 27</span>. Try ${sign === "<" ? "more" : "fewer"} grams.`;
  };
  steppers(el, values, limits, draw);
  draw();
}

/* the shopping trip: a shirt's price, a pair of socks' price, and the money spent */
const SHIRT = 10,
  SOCKS = 2.5,
  SPENT = 45;
/* Change how many shirts and pairs of socks were bought: the pairs that cost exactly $45 are solutions, and each one found
   is listed. */
function wShopping(el) {
  const q = Q(el),
    values = { shirts: 2, socks: 4 },
    limits = { shirts: [0, 5], socks: [0, 18] },
    found = new Set();
  el.innerHTML =
    `<div class="wrow">${stepper("shirts", "Shirts (t)")}${stepper("socks", "Pairs of socks (p)")}</div>` +
    `<p class="eq sm" data-e></p><p class="readout" data-r></p><div class="chips" data-c></div>`;
  const draw = () => {
    const { shirts, socks } = values,
      cost = SHIRT * shirts + SOCKS * socks,
      isSolution = cost === SPENT;
    if (isSolution) found.add(`(${shirts}, ${socks})`);
    q("shirts").textContent = shirts;
    q("socks").textContent = socks;
    q("e").innerHTML = typeset(math(`10(${shirts}) + 2.5(${socks}) = ${cost}`));
    q("r").innerHTML = isSolution
      ? `<span class="ok">Exactly ${money(SPENT)}</span>: t = ${shirts} and p = ${socks} is a solution.`
      : `That’s ${money(cost)}, <span class="no">${cost < SPENT ? "less" : "more"} than ${money(SPENT)}</span>: ` +
        "not a solution.";
    q("c").innerHTML = found.size
      ? `<span class="chip">Solutions found: ${found.size} of 5</span>` +
        [...found].map((pair) => `<span class="chip done">${pair}</span>`).join("")
      : "";
  };
  steppers(el, values, limits, draw);
  draw();
}

const STEPS = [
  {
    title: "A solution makes it true",
    widget: wGranola,
    body:
      `<p>A granola bite has 27 calories: 4 calories for each gram of carbohydrate, and 5 calories from everything else. With ${math("c")} grams of carbohydrate, ${math("4c + 5 = 27")}.</p>` +
      `<p>A <b>solution</b> to an equation is a value that makes it true. An <b>equation in one variable</b>, like this one, usually has one solution. Try values of ${math("c")}, half a gram at a time.</p>`,
    check: {
      kind: "num",
      q: `Jada earns $12 an hour and pays $7 bus fare each day. One day Jada took home $77: ${math("12h - 7 = 77")}. How many hours did Jada work?`,
      answer: 7,
      unit: "hours",
      misc: [
        [84, "That’s what Jada earned before the bus fare. Divide it by $12 an hour."],
        [70, "Add the $7 fare back, don’t take it away again: Jada earned 77 + 7 = 84 dollars."],
      ],
      explain: `${math("12h = 77 + 7 = 84")}, so ${math("h = 84 \\div 12 = 7")}. Check: ${math("12(7) - 7 = 77")}.`,
    },
  },
  {
    title: "Solutions in two variables",
    widget: wShopping,
    body:
      `<p>Tyler spent ${money(SPENT)} on shirts at ${money(SHIRT)} each and socks at ${money(SOCKS)} a pair: ${math("10t + 2.5p = 45")}.</p>` +
      `<p>An <b>equation in two variables</b> needs a value for each to be true, so a solution is a <b>pair</b> of values. There can be many. Find all five ways Tyler could have spent exactly ${money(SPENT)}.</p>`,
    check: {
      kind: "mc",
      stack: true,
      q: `A snack has 60 calories from ${math("p")} grams of protein and ${math("f")} grams of fat: ${math("4p + 9f = 60")}. Which pair is a solution?`,
      choices: [
        { id: "b", label: math("p = 5,\\ f = 2") },
        { id: "a", label: math("p = 10.5,\\ f = 2") },
        { id: "c", label: math("p = 8,\\ f = 4") },
        { id: "d", label: math("p = 6,\\ f = 3") },
      ],
      answer: "a",
      why: {
        b: "4 × 5 + 9 × 2 = 38 calories, not 60.",
        c: "4 × 8 + 9 × 4 = 68 calories, not 60.",
        d: "4 × 6 + 9 × 3 = 51 calories, not 60.",
      },
      explain: `${math("4(10.5) + 9(2) = 42 + 18 = 60")}. A solution doesn’t have to be a whole number.`,
    },
  },
];
