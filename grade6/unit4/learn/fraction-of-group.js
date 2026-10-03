/* Learn Dividing Fractions (Grade 6 Unit 4), chapter 3: What fraction of a group? Its widgets and steps; loaded by fraction-of-group.html. */
/* recipes: a batch is d parts of `step` each */
const BATCHES = [
  { name: "ice cream", of: "milk", d: 9, step: frac(1), u: ["cup", "cups"] },
  { name: "bread", of: "flour", d: 6, step: frac(1), u: ["cup", "cups"] },
  { name: "cookies", of: "butter", d: 4, step: frac(1, 8), u: ["pound", "pounds"] },
];
/* Less than one batch: k of the batch's d equal parts (a stepper sets k, up to a whole batch). */
function wLess(el) {
  const q = Q(el),
    values = { k: 6 },
    limits = { k: [1, 9] };
  let batchIndex = 0;
  el.innerHTML =
    seg(
      "Recipe",
      BATCHES.map((batch, i) => [i, batch.name]),
    ) + `<div class="wrow">${stepper("k", "Amount")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* A: the amount, B: a batch, a: the fraction of a batch */
    const batch = BATCHES[batchIndex],
      { k } = values,
      A = fMul(frac(k), batch.step),
      B = fMul(frac(batch.d), batch.step),
      a = frac(k, batch.d);
    press(el, batchIndex);
    q("k").innerHTML = `${fx(A)} ${unitOf(A, batch.u)}`;
    q("f").innerHTML = oneGroup(batch.d, k, {
      top: [A, unitOf(A, batch.u)],
      whole: [B, unitOf(B, batch.u) + " = 1 batch"],
      label: `Tape diagram: one batch of ${batch.name}, ${ftx(B)} ${batch.u[1]} of ${batch.of}, with ${ftx(A)} shaded`,
    });
    q("r").innerHTML =
      k === batch.d
        ? `<span class="ok">${fx(A)} ${unitOf(A, batch.u)} is exactly <b>1 batch</b>: ${fx(A)} ÷ ${fx(B)} = 1.</span>`
        : `One batch of ${batch.name} uses ${fx(B)} ${unitOf(B, batch.u)} of ${batch.of}. ${fx(A)} ${unitOf(A, batch.u)} is ${k} of its ${batch.d} equal parts: <b>${fx(a)} of a batch</b>.` +
          `<br>${fx(A)} ÷ ${fx(B)} = ${fx(a)}. Check: ${fx(a)} × ${fx(B)} = ${fx(A)}.<br><span class="dimline">“What fraction of ${fx(B)} is ${fx(A)}?” is the division ${fx(A)} ÷ ${fx(B)}, with an answer less than 1.</span>`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (id) => {
    batchIndex = +id;
    limits.k[1] = BATCHES[batchIndex].d;
    values.k = Math.min(values.k, limits.k[1]);
    draw();
  });
  draw();
}

/* pairs to compare: a weighs or measures x, b measures y */
const PAIRS = [
  { a: "Whiskers", x: frac(8, 3), b: "Piglio", y: frac(4), u: "kg", adj: "heavy" },
  { a: "the short song", x: frac(3, 2), b: "the long song", y: frac(15, 4), u: "minutes", adj: "long" },
  { a: "Clare’s rope", x: frac(5, 2), b: "Andre’s rope", y: frac(15, 2), u: "meters", adj: "long" },
];
/* How many times as much: measure one amount in groups of the other, either way round (one row of choices for each). */
function wTimes(el) {
  /* way: 'ab' first to second, or 'ba' second to first */
  const q = Q(el);
  let pairIndex = 0,
    way = "ab";
  el.innerHTML = `<div data-top>${seg(
    "Compare",
    PAIRS.map((pair, i) => [i, `${pair.a} and ${pair.b}`]),
  )}</div><div data-bot>${seg("Way", [
    ["ab", "First to second"],
    ["ba", "Second to first"],
  ])}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    /* A measures X, measured in groups of B's Y */
    const pair = PAIRS[pairIndex],
      [A, X, B, Y] = way === "ab" ? [pair.a, pair.x, pair.b, pair.y] : [pair.b, pair.y, pair.a, pair.x],
      quotient = fDiv(X, Y),
      cap = (text) => text[0].toUpperCase() + text.slice(1);
    q("top")
      .querySelectorAll("[data-m]")
      .forEach((b) => b.setAttribute("aria-pressed", b.dataset.m === String(pairIndex)));
    q("bot")
      .querySelectorAll("[data-m]")
      .forEach((b) => b.setAttribute("aria-pressed", b.dataset.m === way));
    q("f").innerHTML = groupTape(X, Y, {
      label: `Tape diagram: ${ftx(X)} ${pair.u} measured in groups of ${ftx(Y)} ${pair.u}`,
    });
    q("e").innerHTML = `<span class="q">?</span> × ${fx(Y)} = ${fx(X)}, so ${fx(X)} ÷ ${fx(Y)} = ${fx(quotient)}`;
    q("r").innerHTML =
      `${cap(A)}: ${fx(X)} ${pair.u}. ${cap(B)}: ${fx(Y)} ${pair.u}. Make ${B} 1 group.<br>` +
      (fVal(quotient) > 1
        ? `${cap(A)} is <b>${fx(quotient)} times as ${pair.adj}</b> as ${B}.`
        : `${cap(A)} is <b>${fx(quotient)} as ${pair.adj}</b> as ${B}.`) +
      `<br><span class="dimline">Switch the way round: the two answers are reciprocals, ${fx(quotient)} and ${fx(fInv(quotient))}.</span>`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") pairIndex = +id;
    else way = id;
    draw();
  });
  draw();
}

const STEPS = [
  {
    title: "Less than one group",
    widget: wLess,
    body:
      "<p>Sometimes there isn’t enough for even one group. If a batch needs 9 cups of milk and you have 6, you can make part of a batch. “What fraction of 9 is 6?” is the division 6 ÷ 9 = " +
      fr(6, 9) +
      " = " +
      fr(2, 3) +
      ".</p><p>Pick a recipe and change the amount.</p>",
    check: {
      kind: "num",
      unit: "of a batch",
      answer: 5 / 6,
      frac: true,
      q:
        "One batch of ice cream uses 9 cups of milk. On Friday, Noah used 7 " +
        fr(1, 2) +
        " cups. What fraction of a batch did Noah make?",
      misc: [
        [
          1.2,
          "That’s 9 ÷ 7 " +
            fr(1, 2) +
            ". Noah made less than one batch, so the answer is less than 1: 7 " +
            fr(1, 2) +
            " ÷ 9.",
        ],
        [1.5, "That’s how many cups short of a batch Noah was. Find what fraction of 9 is 7 " + fr(1, 2) + "."],
        [67.5, "That’s 7 " + fr(1, 2) + " × 9. Divide to find what fraction of 9 cups 7 " + fr(1, 2) + " cups is."],
      ],
      explain:
        "7 " +
        fr(1, 2) +
        " ÷ 9 = " +
        fr(15, 2) +
        " × " +
        fr(1, 9) +
        " = " +
        fr(15, 18) +
        " = " +
        fr(5, 6) +
        " of a batch. Check: " +
        fr(5, 6) +
        " × 9 = 7 " +
        fr(1, 2) +
        ".",
    },
  },
  {
    title: "How many times as much?",
    widget: wTimes,
    body:
      "<p>To compare two amounts, make one of them 1 group and ask how many groups the other is. Whiskers weighs 2 " +
      fr(2, 3) +
      " kg and Piglio 4 kg: 2 " +
      fr(2, 3) +
      " ÷ 4 = " +
      fr(2, 3) +
      ", so Whiskers is " +
      fr(2, 3) +
      " as heavy as Piglio.</p><p>Pick two things and compare them both ways.</p>",
    check: {
      kind: "mc",
      stack: true,
      q:
        "Andre is walking to a festival 1 " +
        fr(5, 8) +
        " km away and has walked " +
        fr(1, 3) +
        " km so far. Which question does ? × 1 " +
        fr(5, 8) +
        " = " +
        fr(1, 3) +
        " answer?",
      choices: [
        { id: "a", label: "What fraction of the way has Andre walked?" },
        { id: "b", label: "What fraction of the way is left?" },
        { id: "c", label: "How many more kilometers does Andre have to walk?" },
        { id: "d", label: "How long is the trip there and back?" },
      ],
      answer: "a",
      why: {
        b: "The " + fr(1, 3) + " km in the equation is the part Andre has walked, not the part that’s left.",
        c:
          "That’s 1 " +
          fr(5, 8) +
          " − " +
          fr(1, 3) +
          ", a subtraction. The equation asks what fraction of 1 " +
          fr(5, 8) +
          " is " +
          fr(1, 3) +
          ".",
        d: "That’s 2 × 1 " + fr(5, 8) + ". The equation asks what fraction of the trip " + fr(1, 3) + " km is.",
      },
      explain:
        "? × 1 " +
        fr(5, 8) +
        " = " +
        fr(1, 3) +
        " asks what fraction of the whole trip (1 " +
        fr(5, 8) +
        " km) is the " +
        fr(1, 3) +
        " km Andre has walked.",
    },
  },
];
