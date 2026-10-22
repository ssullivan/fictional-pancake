/* Learn Expressions, Equations, and Inequalities (Grade 7 Unit 6), chapter 2: Solving equations. Its widgets and steps;
   loaded by solving.html. */
const x = mathVar("x");
/* the steps for 3x + 4 = 19 on a hanger: [label, left side, right side, what was done] */
const HANGER_STEPS = [
  ["Start", ["x", "x", "x", 4], [19], "3 unknowns and 4 balance 19."],
  ["Take 4 off", ["x", "x", "x"], [15], "Take 4 off each side: 3 unknowns balance 15."],
  ["Split in 3", ["x"], [5], "Split each side into 3 equal parts: one unknown balances 5."],
];
/* Step through 3x + 4 = 19 on a hanger: whatever comes off one side comes off the other, so it stays balanced. */
function wHanger(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Step",
      HANGER_STEPS.map(([label], i) => [i, label]),
    ) + `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const equations = [`${lin(3, 4)} = 19`, `${lin(3, 0)} = 15`, `${x} = 5`];
  const draw = (index) => {
    const [, left, right, what] = HANGER_STEPS[index];
    press(el, index);
    q("f").innerHTML = hanger(left, right);
    q("e").innerHTML = equations[index];
    q("r").innerHTML = what + (index === 2 ? ` Check: 3 × 5 + 4 = 19 ✓` : "");
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* Pick a way to solve 3(x + 2) = 21: divide by 3 first, or multiply out first. Both give the same answer. */
function wTwoWays(el) {
  const q = Q(el);
  el.innerHTML =
    seg("Method", [
      ["divide", "Divide first"],
      ["distribute", "Distribute first"],
    ]) + `<p class="readout" data-r></p>`;
  const draw = (method) => {
    press(el, method);
    q("r").innerHTML =
      method === "divide"
        ? `3(${lin(1, 2)}) = 21. Divide both sides by 3: ${lin(1, 2)} = 7. Subtract 2: <b>${x} = 5</b>.`
        : `3(${lin(1, 2)}) = 21. Multiply out: ${lin(3, 6)} = 21. Subtract 6: ${lin(3, 0)} = 15. Divide by 3: <b>${x} = 5</b>.`;
  };
  onPick(el, draw);
  draw("divide");
}

/* equations with negative numbers: [label, the steps] */
const NEG_EQUATIONS = [
  ["−3x + 4 = 19", "Subtract 4: −3x = 15. Divide by −3: x = −5. Check: −3 × (−5) + 4 = 19 ✓"],
  ["2x − 7 = −13", "Add 7: 2x = −6. Divide by 2: x = −3. Check: 2 × (−3) − 7 = −13 ✓"],
  ["−4(x − 1) = 20", "Divide by −4: x − 1 = −5. Add 1: x = −4. Check: −4 × (−4 − 1) = 20 ✓"],
];
/* Pick an equation with negative numbers: the same moves work, keeping track of the signs. */
function wNegative(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Equation",
      NEG_EQUATIONS.map(([label], i) => [i, label]),
    ) + `<p class="readout" data-r></p>`;
  const draw = (index) => {
    const [label, steps] = NEG_EQUATIONS[index];
    press(el, index);
    q("r").innerHTML = `${withVars(label)}: ${withVars(steps)}`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* Pick a discount on a jacket with $5 shipping, paid $45 in all: the price that's left times x, plus 5, is 45. */
function wPercent(el) {
  const q = Q(el),
    discounts = [20, 50, 60];
  el.innerHTML =
    seg(
      "Discount",
      discounts.map((d, i) => [i, `${d}% off`]),
    ) + `<p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = (index) => {
    const off = discounts[index],
      factor = (100 - off) / 100,
      price = 40 / factor;
    press(el, index);
    q("e").innerHTML = `${fmt(factor)}${x} + 5 = 45`;
    q("r").innerHTML =
      `${off}% off leaves ${100 - off}% of the price, ${fmt(factor)}${x}. Take off the $5 shipping: ${fmt(factor)}${x} = 40. ` +
      `Divide: ${x} = 40 ÷ ${fmt(factor)} = <b>$${fmt(price)}</b>.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "Keeping the hanger balanced",
    widget: wHanger,
    body: `<p>A balanced hanger is an equation. To find ${x}, do the same thing to both sides so it stays balanced: first take off the extra amount, then split into equal parts. That undoes the equation’s steps in reverse order.</p><p>Step through the hanger.</p>`,
    check: {
      kind: "num",
      q: `Solve: 4${x} + 3 = 23`,
      answer: 5,
      misc: [
        [6.5, "Take the 3 away before you divide: 23 − 3 = 20."],
        [5.75, "Undo the + 3 by subtracting 3 first."],
      ],
      explain: "4x = 23 − 3 = 20, so x = 20 ÷ 4 = 5.",
    },
  },
  {
    title: "p(x + q) = r: two ways",
    widget: wTwoWays,
    body: "<p>An equation with groups can be solved two ways: divide both sides by the number of groups first, or multiply out (distribute) and then solve. Both give the same answer.</p><p>Pick a method.</p>",
    check: {
      kind: "num",
      q: `Solve: 5(${x} − 1) = 30`,
      answer: 7,
      misc: [
        [5, "After dividing, x − 1 = 6, so add 1: x = 7."],
        [6.2, "The − 1 is inside the parentheses: it’s multiplied by 5 too. Divide by 5 first."],
      ],
      explain: "Divide by 5: x − 1 = 6. Add 1: x = 7.",
    },
  },
  {
    title: "Negative numbers",
    widget: wNegative,
    body: "<p>Equations with negative numbers are solved the same way. Undo adding with subtracting, and undo multiplying with dividing, minding the signs. Check by putting the answer back in.</p><p>Pick an equation.</p>",
    check: {
      kind: "num",
      q: `Solve: −2${x} + 5 = 17`,
      answer: -6,
      neg: true,
      misc: [
        [6, "Check: −2 × 6 + 5 = −7, not 17. Dividing by −2 changes the sign."],
        [-11, "Subtract 5 first: −2x = 12. Then divide by −2."],
      ],
      explain: "−2x = 17 − 5 = 12, so x = 12 ÷ (−2) = −6.",
    },
  },
  {
    title: "Percent problems",
    widget: wPercent,
    body: "<p>A discount and a fee make an equation like px + q = r, where p is the percent that’s left, as a decimal. Solve it the same way.</p><p>Pick a discount.</p>",
    check: {
      kind: "num",
      q: "A game is 25% off, and tax adds $3. Diego pays $33 in all. What was the price before the discount?",
      answer: 40,
      unit: "dollars",
      misc: [
        [30, "That’s the sale price. 30 is 75% of the price: divide by 0.75."],
        [37.5, "Adding 25% of 30 back isn’t the same: the 25% was of the original price."],
      ],
      explain: "0.75x + 3 = 33, so 0.75x = 30 and x = 30 ÷ 0.75 = 40.",
    },
  },
];
