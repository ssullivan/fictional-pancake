/* Learn Expressions and Equations (Grade 6 Unit 6), chapter 4: Equal and equivalent. Its widgets and steps; loaded by
   equivalent.html. */
/* pairs of expressions to test: each as written, its value for x, and its work with x put in */
const PAIRS = [
  {
    id: "a",
    left: "2x",
    right: "x + 2",
    leftValue: (x) => 2 * x,
    rightValue: (x) => x + 2,
    leftWork: (x) => `2 · ${x}`,
    rightWork: (x) => `${x} + 2`,
  },
  {
    id: "b",
    left: "x + x + x",
    right: "3x",
    leftValue: (x) => 3 * x,
    rightValue: (x) => 3 * x,
    leftWork: (x) => `${x} + ${x} + ${x}`,
    rightWork: (x) => `3 · ${x}`,
  },
  {
    id: "c",
    left: "4x",
    right: "x + 12",
    leftValue: (x) => 4 * x,
    rightValue: (x) => x + 12,
    leftWork: (x) => `4 · ${x}`,
    rightWork: (x) => `${x} + 12`,
  },
];
/* Pick a pair of expressions and try values of x: every value tried goes in a table, and the verdict says what it shows. */
function wTestValues(el) {
  /* tried: the values of x tried with this pair, in the order tried */
  const q = Q(el),
    values = { x: 2 };
  let pairId = "a",
    tried = [];
  el.innerHTML =
    seg(
      "Pair",
      PAIRS.map((p) => [p.id, withVars(`${p.left} and ${p.right}`)]),
    ) +
    `<div class="wrow">${stepper("x", "x")}</div>` +
    `<p class="eq sm" data-e></p><div class="tables" data-t></div><p class="readout" data-r></p>`;
  const draw = () => {
    const pair = PAIRS.find((p) => p.id === pairId),
      x = values.x;
    if (!tried.includes(x)) tried.push(x);
    press(el, pairId);
    q("x").textContent = x;
    const leftNow = pair.leftValue(x),
      rightNow = pair.rightValue(x);
    q("e").innerHTML = withVars(
      `${pair.left} = ${pair.leftWork(x)} = ${leftNow}<br>${pair.right} = ${pair.rightWork(x)} = ${rightNow}`,
    );
    const sorted = [...tried].sort((a, b) => a - b);
    q("t").innerHTML = valueTable(
      [mathVar("x"), withVars(pair.left), withVars(pair.right), "equal?"],
      sorted.map((v) => [
        v,
        pair.leftValue(v),
        pair.rightValue(v),
        pair.leftValue(v) === pair.rightValue(v) ? '<span class="ok">yes</span>' : '<span class="no">no</span>',
      ]),
      { hi: sorted.indexOf(x), label: `Values of ${pair.left} and ${pair.right} for each x tried` },
    );
    /* the first value tried where they differ, if any */
    const differs = sorted.find((v) => pair.leftValue(v) !== pair.rightValue(v));
    let say;
    if (differs !== undefined)
      say = `<span class="no">Not equivalent.</span> At x = ${differs}, ${pair.left} is ${pair.leftValue(differs)} but ${pair.right} is ${pair.rightValue(differs)}. One value where they differ is enough to show they aren’t equivalent${sorted.some((v) => pair.leftValue(v) === pair.rightValue(v)) ? ", even though they’re equal for another value" : ""}.`;
    else if (tried.length < 3)
      say = `Equal at ${sorted.map((v) => `x = ${v}`).join(" and ")}. Being equal at one or two values doesn’t make them equivalent. Try more values.`;
    else
      say = `<span class="ok">Equal for every value you tried.</span> That’s a good sign, but no one can try every number. A picture can show why ${pair.left} is always ${pair.right}: three x’s together are 3x.`;
    q("r").innerHTML = withVars(
      `${say}<br><span class="dimline"><b>Equivalent</b> expressions are equal for <b>every</b> value of the letter.</span>`,
    );
  };
  onPick(el, (id) => {
    pairId = id;
    tried = [];
    draw();
  });
  steppers(el, values, { x: [0, 10] }, draw);
  draw();
}

/* A row of pieces, each x long (x * pixelsPerUnit pixels plus a margin). colors: the class for each piece ('t0' or 't1'),
   cut: how many pieces at the end are taken away (dashed and crossed), sum: written under the pieces that are left. */
function xRow(colors, x, { cut = 0, sum = "" } = {}) {
  const pieceW = 16 + x * 7,
    left = 10,
    top = 10,
    pieceH = 40,
    kept = colors.length - cut;
  let markup = "";
  colors.forEach((cls, i) => {
    const px = left + i * pieceW,
      isCut = i >= kept;
    markup +=
      `<rect class="tape ${isCut ? "gap" : cls}" x="${px}" y="${top}" width="${pieceW}" height="${pieceH}" rx="4"/>` +
      `<text class="lbl${isCut ? " dm" : ""}" x="${px + pieceW / 2}" y="${top + pieceH / 2}">x</text>`;
    if (isCut)
      markup += `<path class="xr-cut" d="M${px + 6},${top + 6} L${px + pieceW - 6},${top + pieceH - 6} M${px + pieceW - 6},${top + 6} L${px + 6},${top + pieceH - 6}"/>`;
  });
  /* a bracket under the pieces that are left, with their sum */
  const bracketY = top + pieceH + 8;
  markup +=
    `<path class="brace" d="M${left + 2},${bracketY} v8 H${left + kept * pieceW - 2} v-8"/>` +
    `<text class="lbl" x="${left + (kept * pieceW) / 2}" y="${bracketY + 28}">${sum}</text>`;
  return svgWrap(left * 2 + colors.length * pieceW, bracketY + 44, markup, `${colors.length} pieces, each x long`);
}
/* expressions that simplify: the pieces each one is made of, how many are taken away, and what's left */
const COMBINE = [
  {
    id: "three",
    expr: "x + x + x",
    colors: ["t0", "t1", "t0"],
    cut: 0,
    result: "3x",
    count: 3,
    work: (x) => `${x} + ${x} + ${x}`,
  },
  {
    id: "add",
    expr: "2x + 3x",
    colors: ["t0", "t0", "t1", "t1", "t1"],
    cut: 0,
    result: "5x",
    count: 5,
    work: (x) => `2 · ${x} + 3 · ${x}`,
  },
  {
    id: "sub",
    expr: "7x − 2x",
    colors: range(7).map(() => "t0"),
    cut: 2,
    result: "5x",
    count: 5,
    work: (x) => `7 · ${x} − 2 · ${x}`,
  },
];
/* Pick an expression and slide x: its pieces grow or shrink, but what's left is always the same number of x's. */
function wPictures(el) {
  const q = Q(el);
  let combineId = "three",
    x = 3;
  el.innerHTML =
    seg(
      "Expression",
      COMBINE.map((c) => [c.id, withVars(c.expr)]),
    ) +
    `<div class="wrow"><label class="slider">${mathVar("x")} <input type="range" min="1" max="8" value="3" data-s><b data-v></b></label></div>` +
    `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const combine = COMBINE.find((c) => c.id === combineId),
      value = combine.count * x;
    press(el, combineId);
    q("v").textContent = x;
    q("f").innerHTML = xRow(combine.colors, x, { cut: combine.cut, sum: combine.result });
    q("e").innerHTML = withVars(
      `${combine.expr} = ${combine.work(x)} = ${value}<br>${combine.result} = ${combine.count} · ${x} = ${value}`,
    );
    q("r").innerHTML = withVars(
      `${combine.cut ? `7 pieces of x, take away 2 of them: 5 pieces are left.` : `Put the pieces together: there are ${combine.count} of them, each x long.`} So <b>${combine.expr} = ${combine.result}</b> for any x.` +
        `<br><span class="dimline">Slide x. The pieces change size, but the count stays the same, so the two expressions stay equal: they’re equivalent.</span>`,
    );
  };
  onPick(el, (id) => {
    combineId = id;
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
    title: "Test values",
    widget: wTestValues,
    body: withVars(
      "<p>Two expressions can be equal for one value of x and not for another. When they’re equal for <b>every</b> value, they’re <b>equivalent</b>. One value where they differ shows they aren’t.</p><p>Pick a pair and try several values of x.</p>",
    ),
    check: {
      kind: "mc",
      stack: true,
      q: `Lin says 2${mathVar("x")} and ${mathVar("x")} + 2 are equivalent, because when ${mathVar("x")} = 2, both are 4. Is Lin right?`,
      choices: [
        { id: "a", label: withVars("No: at x = 3 they’re 6 and 5") },
        { id: "b", label: withVars("Yes: they’re equal at x = 2") },
        { id: "c", label: "Yes: they use the same numbers" },
      ],
      answer: "a",
      why: {
        b: "Being equal at one value isn’t enough. Equivalent means equal for every value of x, and at x = 3 they’re 6 and 5.",
        c: "Using the same digits doesn’t make expressions equivalent: 2x doubles x, but x + 2 adds 2.",
      },
      explain:
        "Equivalent expressions are equal for every value. At x = 3, 2x is 6 and x + 2 is 5, so they aren’t equivalent.",
    },
  },
  {
    title: "Pictures that prove it",
    widget: wPictures,
    body: withVars(
      "<p>Trying values can show two expressions aren’t equivalent, but it can’t try every number. A picture can show why two expressions are always equal: x + x + x is three pieces of x, which is 3x.</p><p>Pick an expression and slide x.</p>",
    ),
    check: {
      kind: "mc",
      q: `Which expression is equivalent to 8${mathVar("x")} − 3${mathVar("x")}?`,
      choices: [
        { id: "a", label: withVars("5x") },
        { id: "b", label: "5" },
        { id: "c", label: withVars("11x") },
      ],
      answer: "a",
      why: {
        b: "8x − 3x takes 3 x’s away from 8 x’s, so 5 x’s are left, not just 5. Try x = 2: 16 − 6 = 10, and 10 isn’t 5.",
        c: "That adds. 8x − 3x takes 3 x’s away.",
      },
      explain: "8 x’s take away 3 x’s leaves 5 x’s: 8x − 3x = 5x. Check with x = 3: 24 − 9 = 15, and 5 · 3 = 15 ✓",
    },
  },
];
