/* Learn Expressions and Equations (Grade 6 Unit 6), chapter 5: The distributive property. Its widgets and steps; loaded by
   distributive.html. */
/* ways to cut the 45 in 6 · 45: none (one block), or into two parts */
const SPLITS = [
  { id: "whole", label: "45 in one piece", parts: [45] },
  { id: "tens", label: "40 + 5", parts: [40, 5] },
  { id: "thirty", label: "30 + 15", parts: [30, 15] },
  { id: "twenty", label: "20 + 25", parts: [20, 25] },
];
/* A rectangle 6 by 45: pick how to split the 45, and see the two smaller products that make 6 · 45. */
function wSplit(el) {
  const q = Q(el),
    side = 6;
  let splitId = "whole";
  el.innerHTML =
    seg(
      "Split",
      SPLITS.map((s) => [s.id, s.label]),
    ) + `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const split = SPLITS.find((s) => s.id === splitId),
      [a, b] = split.parts;
    press(el, splitId);
    if (b === undefined) {
      q("f").innerHTML = areaSplit(String(side), [{ w: a, top: String(a), area: "?" }]);
      q("e").innerHTML = `${side} · ${a} = ?`;
      q("r").innerHTML =
        `The area of the rectangle is ${side} · 45. That’s hard to do in your head in one piece.<br><span class="dimline">Split the 45 into two parts.</span>`;
      return;
    }
    q("f").innerHTML = areaSplit(
      String(side),
      [
        { w: a, top: String(a), area: String(side * a) },
        { w: b, top: String(b), area: String(side * b) },
      ],
      { whole: "45" },
    );
    q("e").innerHTML =
      `${side} · 45 = ${side} · ${a} + ${side} · ${b} = ${side * a} + ${side * b} = <b>${side * 45}</b>`;
    q("r").innerHTML =
      `The two parts together are the whole rectangle, so their areas add up to ${side} · 45. Each part of the 45 gets multiplied by ${side}.` +
      `<br><span class="dimline">Every split gives ${side * 45}. Tens and ones (40 + 5) usually make the friendliest products.</span>`;
  };
  onPick(el, (id) => {
    splitId = id;
    draw();
  });
  draw();
}

/* expressions a(x + b) to draw */
const TIMES_SUMS = [
  { a: 3, b: 4 },
  { a: 5, b: 2 },
  { a: 2, b: 7 },
];
/* Pick a(x + b) and slide x: the rectangle a by x + b is ax and ab, so a(x + b) = ax + ab for every x. */
function wLetter(el) {
  const q = Q(el);
  let pickIndex = 0,
    x = 6;
  el.innerHTML =
    seg(
      "Expression",
      TIMES_SUMS.map((e, i) => [i, withVars(`${e.a}(x + ${e.b})`)]),
    ) +
    `<div class="wrow"><label class="slider">${mathVar("x")} <input type="range" min="1" max="10" value="6" data-s><b data-v></b></label></div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { a, b } = TIMES_SUMS[pickIndex];
    press(el, pickIndex);
    q("v").textContent = x;
    q("f").innerHTML = areaSplit(
      String(a),
      [
        { w: x, top: "x", area: `${a}x` },
        { w: b, top: String(b), area: String(a * b) },
      ],
      { whole: `x + ${b}` },
    );
    q("e").innerHTML = withVars(`${a}(x + ${b}) = ${a}x + ${a * b}`);
    q("r").innerHTML = withVars(
      `The rectangle is ${a} by x + ${b}. Its two parts are ${a} · x = ${a}x and ${a} · ${b} = ${a * b}, so <b>${a}(x + ${b}) = ${a}x + ${a * b}</b>.` +
        `<br>With x = ${x}: ${a}(${x} + ${b}) = ${a} · ${x + b} = ${a * (x + b)}, and ${a} · ${x} + ${a * b} = ${a * x} + ${a * b} = ${a * x + a * b} ✓` +
        `<br><span class="dimline">The ${a} multiplies both parts inside the parentheses. Slide x: the two sides stay equal, so they’re equivalent.</span>`,
    );
  };
  onPick(el, (id) => {
    pickIndex = +id;
    draw();
  });
  q("s").addEventListener("input", () => {
    x = +q("s").value;
    draw();
  });
  draw();
}

/* expressions cx + k to factor, and the factors to try (some don't go into both numbers) */
const TO_FACTOR = [
  { c: 12, k: 18, factorChoices: [2, 3, 4, 6] },
  { c: 6, k: 15, factorChoices: [2, 3, 5] },
  { c: 8, k: 20, factorChoices: [2, 4, 5] },
];
/* Pick cx + k and a factor: when it goes into both, the rectangle is that tall and the expression is factor(… + …). */
function wFactor(el) {
  const q = Q(el);
  let pickIndex = 0,
    factor = 2;
  el.innerHTML =
    `<div data-top>${seg(
      "Expression",
      TO_FACTOR.map((e, i) => [i, withVars(`${e.c}x + ${e.k}`)]),
    )}</div><div data-bot></div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { c, k, factorChoices } = TO_FACTOR[pickIndex],
      greatest = gcd(c, k),
      fits = c % factor === 0 && k % factor === 0;
    q("top")
      .querySelectorAll("[data-m]")
      .forEach((b) => b.setAttribute("aria-pressed", b.dataset.m === String(pickIndex)));
    q("bot").innerHTML = seg(
      "Factor",
      factorChoices.map((f) => [f, `Take out ${f}`]),
    );
    q("bot")
      .querySelectorAll("[data-m]")
      .forEach((b) => b.setAttribute("aria-pressed", b.dataset.m === String(factor)));
    q("f").innerHTML = areaSplit(String(factor), [
      { w: 3, top: fits ? `${c / factor}x` : "?", area: `${c}x` },
      { w: 2, top: fits ? String(k / factor) : "?", area: String(k) },
    ]);
    q("e").innerHTML = withVars(
      fits ? `${c}x + ${k} = ${factor}(${c / factor}x + ${k / factor})` : `${c}x + ${k} = ${factor}(? + ?)`,
    );
    q("r").innerHTML = withVars(
      !fits
        ? `<span class="no">${factor} doesn’t go evenly into ${c % factor ? c : k}</span> (${c % factor ? c : k} ÷ ${factor} = ${fmt((c % factor ? c : k) / factor)}), so it can’t be a whole-number side of both parts. Try another factor.`
        : factor === greatest
          ? `<span class="ok">${factor} is the greatest common factor of ${c} and ${k}.</span> The parts are ${c / factor}x and ${k / factor}, which have no common factor left, so <b>${c}x + ${k} = ${factor}(${c / factor}x + ${k / factor})</b>. Check: ${factor} · ${c / factor}x + ${factor} · ${k / factor} = ${c}x + ${k} ✓`
          : `${factor}(${c / factor}x + ${k / factor}) is equivalent to ${c}x + ${k}, but ${c / factor} and ${k / factor} still have a common factor, ${gcd(c / factor, k / factor)}. The greatest common factor is ${greatest}.`,
    );
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") {
      pickIndex = +id;
      factor = TO_FACTOR[pickIndex].factorChoices[0];
    } else factor = +id;
    draw();
  });
  draw();
}

/* expressions a(x − b) to draw */
const TIMES_DIFFS = [
  { a: 5, b: 2 },
  { a: 4, b: 3 },
];
/* Pick a(x − b) and slide x: a rectangle a by x with a strip a by b taken away, so a(x − b) = ax − ab. */
function wSubtract(el) {
  const q = Q(el);
  let pickIndex = 0,
    x = 7;
  el.innerHTML =
    seg(
      "Expression",
      TIMES_DIFFS.map((e, i) => [i, withVars(`${e.a}(x − ${e.b})`)]),
    ) +
    `<div class="wrow"><label class="slider">${mathVar("x")} <input type="range" min="4" max="10" value="7" data-s><b data-v></b></label></div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { a, b } = TIMES_DIFFS[pickIndex];
    press(el, pickIndex);
    q("v").textContent = x;
    q("f").innerHTML = areaSplit(
      String(a),
      [
        { w: x - b, top: `x − ${b}`, area: `${a}(x − ${b})` },
        { w: b, top: String(b), area: String(a * b), cut: true },
      ],
      { whole: "x" },
    );
    q("e").innerHTML = withVars(`${a}(x − ${b}) = ${a}x − ${a * b}`);
    q("r").innerHTML = withVars(
      `The whole rectangle is ${a} by x: its area is ${a}x. Take away the dashed strip, ${a} by ${b} = ${a * b}, and what’s left is ${a} by x − ${b}. So <b>${a}(x − ${b}) = ${a}x − ${a * b}</b>.` +
        `<br>With x = ${x}: ${a} · ${x - b} = ${a * (x - b)}, and ${a * x} − ${a * b} = ${a * x - a * b} ✓` +
        `<br><span class="dimline">A common slip is ${a}x − ${b}. The ${a} multiplies the ${b} too: the strip taken away is ${a} · ${b}.</span>`,
    );
  };
  onPick(el, (id) => {
    pickIndex = +id;
    x = Math.max(x, TIMES_DIFFS[pickIndex].b + 1);
    draw();
  });
  q("s").addEventListener("input", () => {
    x = +q("s").value;
    draw();
  });
  draw();
}

const STEPS = [
  {
    title: "Split a rectangle",
    widget: wSplit,
    body: "<p>The area of a rectangle can be found in one piece, or in parts that add up to the whole. Splitting a side into parts is how the <b>distributive property</b> works: 6 · 45 = 6 · 40 + 6 · 5.</p><p>Try one piece, then pick a way to split the 45.</p>",
    check: {
      kind: "mc",
      q: "Which is equal to 8 · 26?",
      choices: [
        { id: "a", label: "8 · 20 + 8 · 6" },
        { id: "b", label: "8 · 20 + 6" },
        { id: "c", label: "8 · 2 + 8 · 6" },
      ],
      answer: "a",
      why: {
        b: "The 6 is part of the side too, so it gets multiplied by 8 as well: 8 · 20 + 8 · 6.",
        c: "The 2 in 26 is 2 tens, which is 20, not 2.",
      },
      explain: "26 = 20 + 6, so 8 · 26 = 8 · 20 + 8 · 6 = 160 + 48 = 208.",
    },
  },
  {
    title: "With a letter",
    widget: wLetter,
    body: withVars(
      "<p>The same thing works when a side is x + 4: a rectangle 3 by x + 4 has parts 3 · x and 3 · 4. So 3(x + 4) and 3x + 12 are equivalent. Writing it the long way is called <b>expanding</b>.</p><p>Pick an expression and slide x.</p>",
    ),
    check: {
      kind: "mc",
      q: `Which is equivalent to 4(${mathVar("x")} + 5)?`,
      choices: [
        { id: "a", label: withVars("4x + 20") },
        { id: "b", label: withVars("4x + 5") },
        { id: "c", label: withVars("x + 20") },
      ],
      answer: "a",
      why: {
        b: "The 4 multiplies both parts of x + 5: 4 · x and 4 · 5. The second part is 4 · 5 = 20.",
        c: "The 4 multiplies x too: 4 groups of x is 4x.",
      },
      explain: "4(x + 5) = 4 · x + 4 · 5 = 4x + 20. Check with x = 1: 4 · 6 = 24, and 4 + 20 = 24 ✓",
    },
  },
  {
    title: "Backwards: take out a factor",
    widget: wFactor,
    body: withVars(
      "<p>Going the other way, 12x + 18 can be written as a product: find a number that goes into both parts, and make it the side of the rectangle. This is called <b>factoring</b>. Taking out the <b>greatest common factor</b> leaves nothing more to take out.</p><p>Pick an expression and a factor.</p>",
    ),
    check: {
      kind: "mc",
      q: `Which is equivalent to 10${mathVar("x")} + 15, written with the greatest common factor?`,
      choices: [
        { id: "a", label: withVars("5(2x + 3)") },
        { id: "b", label: withVars("5(2x + 15)") },
        { id: "c", label: withVars("10(x + 5)") },
      ],
      answer: "a",
      why: {
        b: "The 5 has to come out of both parts: 15 ÷ 5 = 3. Check: 5(2x + 15) = 10x + 75, not 10x + 15.",
        c: "10 doesn’t go evenly into 15. Check: 10(x + 5) = 10x + 50, not 10x + 15.",
      },
      explain:
        "5 goes into 10x (2x times) and into 15 (3 times): 10x + 15 = 5(2x + 3). Check: 5 · 2x + 5 · 3 = 10x + 15 ✓",
    },
  },
  {
    title: "Subtraction, and finding a mistake",
    widget: wSubtract,
    body: withVars(
      "<p>The distributive property works with subtraction too. 5(x − 2) is a rectangle 5 by x with a strip 5 by 2 taken away: 5x − 10.</p><p>Pick an expression and slide x. Then check someone’s work.</p>",
    ),
    check: {
      kind: "mc",
      stack: true,
      q: `Noah wrote 3(${mathVar("x")} − 4) = 3${mathVar("x")} − 4. What went wrong?`,
      choices: [
        { id: "a", label: withVars("The 3 should multiply the 4 too: 3x − 12") },
        { id: "b", label: "Nothing: it’s right" },
        { id: "c", label: withVars("It should be 3x + 12") },
      ],
      answer: "a",
      why: {
        b: "Test it with x = 10: 3(10 − 4) = 18, but 3 · 10 − 4 = 26. They aren’t equal, so something’s wrong.",
        c: "The 4 is taken away, so 3 · 4 is taken away too: 3x − 12, not + 12.",
      },
      explain: "3(x − 4) = 3 · x − 3 · 4 = 3x − 12. Check with x = 10: 3 · 6 = 18, and 30 − 12 = 18 ✓",
    },
  },
];
