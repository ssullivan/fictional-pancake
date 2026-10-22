/* Learn Expressions, Equations, and Inequalities (Grade 7 Unit 6), chapter 4: Equivalent expressions. Its widgets and steps;
   loaded by equivalent.html. */
const x = mathVar("x");
/* pairs to expand and factor: [a, b, c] for a(bx + c) */
const PAIRS = [
  [3, 2, 5],
  [-2, 1, 4],
  [4, 3, -2],
];
/* Pick a pair and change x: a(bx + c) and abx + ac give the same value for every x. */
function wDistribute(el) {
  const q = Q(el),
    values = { xv: 2 };
  let pairIndex = 0;
  el.innerHTML =
    seg(
      "Expression",
      PAIRS.map(([a, b, c], i) => [i, `${fmt(a)}(${b === 1 ? "x" : b + "x"} ${c < 0 ? "−" : "+"} ${Math.abs(c)})`]),
    ) + `<div class="wrow">${stepper("xv", "x")}</div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b, c] = PAIRS[pairIndex],
      { xv } = values,
      grouped = `${fmt(a)}(${lin(b, c)})`,
      expanded = lin(a * b, a * c);
    press(el, pairIndex);
    q("xv").textContent = fmt(xv);
    q("e").innerHTML = `${grouped} = ${expanded}`;
    q("r").innerHTML =
      `Multiply ${par(a)} by each term: ${par(a)} × ${lin(b, 0)} = ${lin(a * b, 0)} and ${par(a)} × ${par(c)} = ${fmt(a * c)}. ` +
      `When ${x} = ${fmt(xv)}, both are <b>${fmt(a * (b * xv + c))}</b>. Going back, from ${expanded} to ${grouped}, is factoring.`;
  };
  steppers(el, values, { xv: [-3, 5] }, draw);
  onPick(el, (id) => {
    pairIndex = +id;
    draw();
  });
  draw();
}

/* subtractions of a group: [n, a, c] for n − (ax + c) */
const GROUP_SUBS = [
  [10, 3, 4],
  [8, 2, -5],
  [6, 1, 6],
];
/* Pick a subtraction: subtracting a group subtracts every part of it. */
function wSubtract(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Expression",
      GROUP_SUBS.map(([n, a, c], i) => [i, `${n} − (${a === 1 ? "x" : a + "x"} ${c < 0 ? "−" : "+"} ${Math.abs(c)})`]),
    ) + `<p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [n, a, c] = GROUP_SUBS[index];
    press(el, index);
    q("e").innerHTML = `${n} − (${lin(a, c)}) = ${n} − ${lin(a, 0)} − ${par(c)} = ${lin(-a, n - c)}`;
    q("r").innerHTML =
      `Subtract both parts: ${lin(a, 0)} and ${par(c)}. ` +
      (c < 0 ? `Subtracting ${par(c)} adds ${Math.abs(c)}.` : `Both are taken away.`);
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* Change x: 5x + 3 − 2x + 4 and 3x + 7 have the same value every time. */
function wCombine(el) {
  const q = Q(el),
    values = { xv: 1 };
  el.innerHTML = `<p class="eq">${lin(5, 3)} − ${lin(2, 0)} + 4 = ${lin(3, 7)}</p><div class="wrow">${stepper("xv", "x")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const { xv } = values;
    q("xv").textContent = fmt(xv);
    q("r").innerHTML =
      `When ${x} = ${fmt(xv)}: 5 × ${par(xv)} + 3 − 2 × ${par(xv)} + 4 = <b>${fmt(3 * xv + 7)}</b>, and 3 × ${par(xv)} + 7 = <b>${fmt(3 * xv + 7)}</b>. ` +
      `The ${x} terms combine (5 − 2 = 3) and the numbers combine (3 + 4 = 7).`;
  };
  steppers(el, values, { xv: [-4, 6] }, draw);
  draw();
}

const STEPS = [
  {
    title: "Distributing and factoring",
    widget: wDistribute,
    body: "<p>Two expressions are <b>equivalent</b> when they’re equal for every value of the letter. The distributive property makes equivalent expressions: multiply the number outside the parentheses by every term inside. Going the other way is <b>factoring</b>.</p><p>Pick an expression and change x.</p>",
    check: {
      kind: "mc",
      q: `Which expression is equivalent to −3(${x} − 4)?`,
      choices: [
        { id: "a", label: `−3${x} − 12` },
        { id: "b", label: `−3${x} + 12` },
        { id: "c", label: `−3${x} − 4` },
      ],
      answer: "b",
      why: {
        a: "−3 × (−4) is +12: a negative times a negative.",
        c: "Multiply the −4 by −3 too.",
      },
      explain: "−3 × x = −3x and −3 × (−4) = 12: −3x + 12.",
    },
  },
  {
    title: "Subtracting a group",
    widget: wSubtract,
    body: "<p>Subtracting a group in parentheses subtracts every part of it, as if the − were −1 times the group. So 10 − (3x + 4) = 10 − 3x − 4 = 6 − 3x.</p><p>Pick an expression.</p>",
    check: {
      kind: "mc",
      q: `Which expression is equivalent to 12 − (2${x} − 5)?`,
      choices: [
        { id: "a", label: `7 − 2${x}` },
        { id: "b", label: `17 − 2${x}` },
        { id: "c", label: `17 + 2${x}` },
      ],
      answer: "b",
      why: {
        a: "Subtracting −5 adds 5: 12 + 5.",
        c: "The 2x is subtracted too.",
      },
      explain: "12 − 2x − (−5) = 12 − 2x + 5 = 17 − 2x.",
    },
  },
  {
    title: "Combining like terms",
    widget: wCombine,
    body: "<p><b>Like terms</b> have the same letter part. Combine the x terms with each other and the numbers with each other, keeping each one’s sign. The shorter expression is equivalent.</p><p>Change x.</p>",
    check: {
      kind: "mc",
      q: `Which expression is equivalent to 7${x} − 2 − 3${x} + 9?`,
      choices: [
        { id: "a", label: `4${x} + 7` },
        { id: "b", label: `10${x} + 7` },
        { id: "c", label: `11${x}` },
      ],
      answer: "a",
      why: {
        b: "The 3x is subtracted: 7 − 3 = 4.",
        c: "x terms and numbers aren’t like terms: keep them apart.",
      },
      explain: "7x − 3x = 4x and −2 + 9 = 7: 4x + 7.",
    },
  },
];
