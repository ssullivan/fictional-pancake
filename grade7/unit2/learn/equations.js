/* Learn Introducing Proportional Relationships (Grade 7 Unit 2), chapter 2: Equations like y = kx. Its widgets and steps;
   loaded by equations.html. */
/* Change the number of tacos: the cost is always 2.5 times it, c = 2.5t. */
function wEq(el) {
  const q = Q(el),
    price = 2.5,
    values = { t: 4 };
  el.innerHTML =
    `<p class="eq">${mv("c")} = 2.5${mv("t")}</p>` +
    `<div class="wrow">${stepper("t", "Tacos")}</div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { t } = values;
    q("t").textContent = t;
    q("e").innerHTML = `${mv("c")} = 2.5 × ${t} = ${fmt(price * t)}`;
    q("r").innerHTML =
      `${t} ${t === 1 ? "taco costs" : "tacos cost"} <b>${money(price * t)}</b>. ` +
      `The equation says the same thing as every row of the table: cost = 2.5 × tacos. ${mv("k")} = 2.5 is the constant of proportionality.`;
  };
  steppers(el, values, { t: [0, 10] }, draw);
  draw();
}

/* relationships with both of their equations: [label, y letter, x letter, k as text, 1/k as text, an x to try] */
const PAIRS = [
  ["Printer", "p", "m", "6", "1/6", 5],
  ["Truck", "d", "h", "50", "1/50", 3],
  ["Lemonade", "w", "s", "3", "1/3", 4],
];
/* Pick a relationship: one equation gives y from x, and the other gives x back from y. */
function wTwo(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Relationship",
      PAIRS.map(([label], i) => [i, label]),
    ) + `<p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [, yl, xl, k, back, x] = PAIRS[index],
      y = x * +k;
    press(el, index);
    q("e").innerHTML = `${mv(yl)} = ${k}${mv(xl)}&nbsp;&nbsp;&nbsp;${mv(xl)} = ${back}${mv(yl)}`;
    q("r").innerHTML =
      `Forward: when ${mv(xl)} = ${x}, ${mv(yl)} = ${k} × ${x} = <b>${y}</b>. ` +
      `Back: when ${mv(yl)} = ${y}, ${mv(xl)} = ${back} × ${y} = <b>${x}</b>. Multiplying by ${back} undoes multiplying by ${k}.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* questions about w = 3s (cups of water w for s scoops of mix): [label, what's known, its value] */
const QUESTIONS = [
  ["Water for 7 scoops", "s", 7],
  ["Scoops for 21 cups", "w", 21],
  ["Water for 10 scoops", "s", 10],
  ["Scoops for 12 cups", "w", 12],
];
/* Pick a question: put the number you know into w = 3s and solve for the other. */
function wSolve(el) {
  const q = Q(el);
  el.innerHTML =
    `<p class="eq">${mv("w")} = 3${mv("s")}</p>` +
    seg(
      "Question",
      QUESTIONS.map(([label], i) => [i, label]),
    ) +
    `<p class="readout" data-r></p>`;
  const draw = (index) => {
    const [, known, v] = QUESTIONS[index];
    press(el, index);
    q("r").innerHTML =
      known === "s"
        ? `Put ${v} in for ${mv("s")}: ${mv("w")} = 3 × ${v} = <b>${3 * v}</b> cups of water.`
        : `Put ${v} in for ${mv("w")}: ${v} = 3${mv("s")}. Divide by 3: ${mv("s")} = ${v} ÷ 3 = <b>${v / 3}</b> scoops.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "y = kx",
    widget: wEq,
    body: `<p>A proportional relationship can be written as an equation: ${mv("y")} = ${mv("k")}${mv("x")}, where ${mv("k")} is the constant of proportionality. For tacos at $2.50 each, the cost ${mv("c")} of ${mv("t")} tacos is ${mv("c")} = 2.5${mv("t")}.</p><p>Change the number of tacos.</p>`,
    check: {
      kind: "mc",
      q: `Each scoop of lemonade mix takes 3 cups of water. Which equation gives the cups of water ${mv("w")} for ${mv("s")} scoops?`,
      choices: [
        { id: "a", label: `${mv("w")} = 3${mv("s")}` },
        { id: "b", label: `${mv("s")} = 3${mv("w")}` },
        { id: "c", label: `${mv("w")} = ${mv("s")} + 3` },
      ],
      answer: "a",
      why: {
        b: `That says the scoops are 3 times the water. Check: 1 scoop takes 3 cups, so ${mv("w")} is 3 times ${mv("s")}.`,
        c: "That adds 3 cups, no matter how many scoops. Each scoop takes 3 cups: multiply.",
      },
      explain: `The water is 3 times the scoops: ${mv("w")} = 3${mv("s")}.`,
    },
  },
  {
    title: "Two equations for each relationship",
    widget: wTwo,
    body: `<p>Every proportional relationship has two equations: one gives ${mv("y")} from ${mv("x")}, and the other gives ${mv("x")} from ${mv("y")}. The second uses the reciprocal of the constant.</p><p>Pick a relationship.</p>`,
    check: {
      kind: "mc",
      q: `A truck goes ${mv("d")} miles in ${mv("h")} hours: ${mv("d")} = 40${mv("h")}. Which equation gives the hours ${mv("h")} for ${mv("d")} miles?`,
      choices: [
        { id: "a", label: `${mv("h")} = 40${mv("d")}` },
        { id: "b", label: `${mv("h")} = 1/40${mv("d")}` },
        { id: "c", label: `${mv("h")} = ${mv("d")} − 40` },
      ],
      answer: "b",
      why: {
        a: "Check: 40 miles take 1 hour, but this gives 40 × 40 hours. Use the reciprocal of 40.",
        c: "Subtracting doesn’t undo multiplying. Multiply by 1/40.",
      },
      explain: `Each mile takes 1/40 of an hour: ${mv("h")} = 1/40${mv("d")}.`,
    },
  },
  {
    title: "Using an equation",
    widget: wSolve,
    body: "<p>An equation answers questions both ways. Put in the number you know. If it’s the second letter, divide by the constant to undo the multiplying.</p><p>Pick a question.</p>",
    check: {
      kind: "num",
      q: `Water and lemonade mix follow ${mv("w")} = 3${mv("s")}. How many scoops of mix go with 27 cups of water?`,
      answer: 9,
      unit: "scoops",
      misc: [
        [81, "That multiplies 27 by 3, but 27 is the water already. Divide to undo it."],
        [24, "Subtracting doesn’t undo multiplying. Divide 27 by 3."],
      ],
      explain: "27 = 3s, so s = 27 ÷ 3 = 9 scoops.",
    },
  },
];
