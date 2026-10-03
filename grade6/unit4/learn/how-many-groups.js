/* Learn Dividing Fractions (Grade 6 Unit 4), chapter 2: How many groups? Its widgets and steps; loaded by how-many-groups.html. */
/* pattern blocks, and how many of each fill a hexagon (1 whole) */
const BLOCKS = [
  ["triangle", "triangles", 6],
  ["rhombus", "rhombuses", 3],
  ["trapezoid", "trapezoids", 2],
];
/* n hexagons filled with a block */
const hexRow = (n, block) =>
  `<div class="pbrow">${range(n)
    .map(() => pbFig("hexagon", block, { s: 44 }))
    .join("")}</div>`;
/* Pattern blocks: a hexagon is 1 whole; fill some hexagons (a stepper) with smaller blocks and count them. */
function wBlocks(el) {
  const q = Q(el),
    values = { n: 2 };
  let blockIndex = 0;
  el.innerHTML =
    seg(
      "Fill with",
      BLOCKS.map(([, plural, fill], i) => [i, `${plural} (${fr(1, fill)})`]),
    ) +
    `<div class="wrow">${stepper("n", "Hexagons")}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    /* fill: how many blocks fill a hexagon, so each block is 1/fill */
    const [block, plural, fill] = BLOCKS[blockIndex],
      { n } = values;
    press(el, blockIndex);
    q("n").textContent = n;
    q("f").innerHTML = hexRow(n, block);
    q("e").innerHTML = `${n * fill} × ${fr(1, fill)} = ${n}, so ${n} ÷ ${fr(1, fill)} = ${n * fill}`;
    q("r").innerHTML =
      `A hexagon is 1 whole, and ${fill} ${plural} fill it, so a ${block} is ${fr(1, fill)}. ${n} hexagon${n > 1 ? "s hold" : " holds"} <b>${n * fill} ${plural}</b>: there are ${n * fill} groups of ${fr(1, fill)} in ${n}.` +
      `<br><span class="dimline">“How many ${fr(1, fill)}s are in ${n}?” is the division ${n} ÷ ${fr(1, fill)}.</span>`;
  };
  steppers(el, values, { n: [1, 4] }, draw);
  onPick(el, (id) => {
    blockIndex = +id;
    draw();
  });
  draw();
}

/* divisions t ÷ g that come out even */
const EVEN = [
  [frac(4), frac(2, 3)],
  [frac(2), frac(2, 5)],
  [frac(3), frac(3, 4)],
  [frac(6), frac(3, 2)],
  [frac(5, 2), frac(5, 6)],
];
/* Groups of a fraction that isn't a unit fraction, landing exactly: a stepper adds them one group at a time. */
function wEven(el) {
  /* the stepper's value: k groups, up to the quotient */
  const q = Q(el),
    values = { k: 0 },
    limits = { k: [0, 6] };
  let problemIndex = 0;
  el.innerHTML =
    seg(
      "Divide",
      EVEN.map(([t, g], i) => [i, `${fx(t)} ÷ ${fx(g)}`]),
    ) + `<div class="wrow">${stepper("k", "Groups")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* in parts of 1/d, a group is groupParts */
    const [t, g] = EVEN[problemIndex],
      quotient = fVal(fDiv(t, g)),
      d = lcm(t[1], g[1]),
      groupParts = (g[0] * d) / g[1],
      { k } = values;
    press(el, problemIndex);
    q("k").textContent = k;
    q("f").innerHTML = groupTape(t, g, { upto: k });
    q("r").innerHTML = !k
      ? `Cut ${fx(t)} into ${PART[d][1]}. A group of ${fx(g)} is ${partName(d, groupParts)}. Add groups until the tape is full.`
      : k < quotient
        ? `${k} group${k > 1 ? "s" : ""} of ${fx(g)} so far: ${k} × ${fx(g)} = ${fx(fMul(frac(k), g))}.`
        : `<span class="ok">The tape is full: <b>${quotient} groups</b> of ${fx(g)} make ${fx(t)}. ${quotient} × ${fx(g)} = ${fx(t)}, so ${fx(t)} ÷ ${fx(g)} = ${quotient}.</span>`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (id) => {
    problemIndex = +id;
    limits.k[1] = fVal(fDiv(...EVEN[problemIndex]));
    values.k = 0;
    draw();
  });
  limits.k[1] = fVal(fDiv(...EVEN[problemIndex]));
  draw();
}

/* divisions t ÷ g with part of a group left over */
const LEFT = [
  [frac(7, 2), frac(3, 4)],
  [frac(2), frac(3, 4)],
  [frac(3), frac(2, 5)],
  [frac(10, 3), frac(1, 2)],
  [frac(5, 2), frac(2, 3)],
];
/* A part of a group left over (a button makes the groups): the leftover is a fraction of a group, not of a whole. */
function wLeft(el) {
  const q = Q(el);
  let problemIndex = 0,
    shown = false;
  el.innerHTML =
    seg(
      "Divide",
      LEFT.map(([t, g], i) => [i, `${fx(t)} ÷ ${fx(g)}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Make the groups</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* in parts of 1/d: the total is totalParts, a group is groupParts, and `full` groups fit with `left` parts over */
    const [t, g] = LEFT[problemIndex],
      quotient = fDiv(t, g),
      d = lcm(t[1], g[1]),
      totalParts = (t[0] * d) / t[1],
      groupParts = (g[0] * d) / g[1],
      full = Math.floor(totalParts / groupParts),
      left = totalParts - full * groupParts;
    press(el, problemIndex);
    q("f").innerHTML = groupTape(t, g, { upto: shown ? Infinity : 0 });
    q("go").disabled = shown;
    q("r").innerHTML = !shown
      ? `How many groups of ${fx(g)} are in ${fx(t)}? Each whole is ${d} ${PART[d][1]}, and a group is ${partName(d, groupParts)}.`
      : `${full} full group${full > 1 ? "s" : ""}, and ${partName(d, left)} left over. A whole group is ${partName(d, groupParts)}, so the leftover is <b>${fx(frac(left, groupParts))} of a group</b>.<br><span class="ok">${fx(t)} ÷ ${fx(g)} = <b>${fx(quotient)}</b>. Check: ${fx(quotient)} × ${fx(g)} = ${fx(t)}.</span>` +
        `<br><span class="dimline">Not ${full} ${fr(left, d)}: the leftover is measured in groups of ${fx(g)}, not in wholes.</span>`;
  };
  q("go").onclick = () => {
    shown = true;
    draw();
  };
  onPick(el, (id) => {
    problemIndex = +id;
    shown = false;
    draw();
  });
  draw();
}

/* hop lengths, in eighths of an inch */
const HOPS = [3, 4, 6, 12];
/* Hops along a ruler marked in eighths of an inch, 0 to 6 inches (a stepper adds hops). */
function wRuler(el) {
  const q = Q(el),
    values = { k: 0 },
    limits = { k: [0, 16] };
  let hopIndex = 0;
  el.innerHTML =
    seg(
      "Hop",
      HOPS.map((eighths, i) => [i, `${fx(frac(eighths, 8))} inch`]),
    ) + `<div class="wrow">${stepper("k", "Hops")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* hop: eighths in a hop, hopFrac as a fraction; most: hops in 6 inches; at: where k hops land */
    const hop = HOPS[hopIndex],
      hopFrac = frac(hop, 8),
      most = 48 / hop,
      { k } = values,
      at = frac(k * hop, 8);
    press(el, hopIndex);
    q("k").textContent = k;
    q("f").innerHTML = numLine(0, 48, {
      step: 1,
      big: 8,
      lab: (v) => v % 8 === 0,
      fmt: (v) => v / 8,
      hops: range(k).map((i) => ({ a: i * hop, b: (i + 1) * hop, t: "" })),
      label: `A ruler from 0 to 6 inches in eighths, with ${k} hops of ${ftx(hopFrac)} inch`,
    });
    q("r").innerHTML = !k
      ? `Hop ${fx(hopFrac)} inch at a time from 0. How many hops land on 6 inches?`
      : k < most
        ? `${k} hop${k > 1 ? "s" : ""} of ${fx(hopFrac)} inch reach${k > 1 ? "" : "es"} <b>${fx(at)} inch${fVal(at) > 1 ? "es" : ""}</b>: ${k} × ${fx(hopFrac)} = ${fx(at)}.`
        : `<span class="ok"><b>${most} hops</b> land exactly on 6: there are ${most} groups of ${fx(hopFrac)} in 6, so 6 ÷ ${fx(hopFrac)} = ${most}.</span>`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (id) => {
    hopIndex = +id;
    limits.k[1] = 48 / HOPS[hopIndex];
    values.k = 0;
    draw();
  });
  draw();
}

/* the quick checks' figures */
const F = {
  blocks: `<div class="pbrow">${pbFig("hexagon", "rhombus", { s: 44 })}${pbFig("hexagon", "rhombus", { show: 2, s: 44 })}</div>`,
};
const STEPS = [
  {
    title: "Pattern blocks",
    widget: wBlocks,
    body:
      "<p>“How many " +
      fr(1, 6) +
      "s are in 2?” is a division question: 2 ÷ " +
      fr(1, 6) +
      " = ?. It goes with the multiplication ? × " +
      fr(1, 6) +
      " = 2. With pattern blocks, a hexagon is 1 whole, so count the small blocks that fill 2 hexagons.</p><p>Pick a block and change how many hexagons to fill.</p>",
    check: {
      kind: "num",
      unit: "rhombuses",
      answer: 5,
      fig: F.blocks,
      q:
        "A hexagon is 1 whole, so a rhombus is " + fr(1, 3) + ". How many " + fr(1, 3) + "s are in 1 " + fr(2, 3) + "?",
      misc: [
        [
          1.67,
          "That’s 1 " +
            fr(2, 3) +
            " itself. Count the rhombuses: 3 fill a whole hexagon, and 2 more fill " +
            fr(2, 3) +
            " of one.",
        ],
        [3, "That’s just the whole hexagon. Add the 2 rhombuses in the part of a hexagon."],
        [0.56, "That multiplies 1 " + fr(2, 3) + " × " + fr(1, 3) + ". Count how many " + fr(1, 3) + "s fit instead."],
      ],
      explain:
        "3 rhombuses fill 1 whole and 2 more fill " +
        fr(2, 3) +
        ": 5 groups of " +
        fr(1, 3) +
        ". 5 × " +
        fr(1, 3) +
        " = 1 " +
        fr(2, 3) +
        ", so 1 " +
        fr(2, 3) +
        " ÷ " +
        fr(1, 3) +
        " = 5.",
    },
  },
  {
    title: "Groups of a non-unit fraction",
    widget: wEven,
    body:
      "<p>A group can be more than one part. To find 4 ÷ " +
      fr(2, 3) +
      ", cut each whole into thirds, then bracket them 2 at a time: each bracket is one group of " +
      fr(2, 3) +
      ".</p><p>Pick a division and add groups until the tape is full.</p>",
    check: {
      kind: "num",
      unit: "weeks",
      answer: 4,
      frac: true,
      q:
        "A bag holds 3 pounds of cat food. A cat eats " +
        fr(3, 4) +
        " pound each week. How many weeks does the bag last?",
      misc: [
        [2.25, "That’s 3 × " + fr(3, 4) + ". Ask how many groups of " + fr(3, 4) + " are in 3: divide."],
        [0.25, "That’s " + fr(3, 4) + " ÷ 3. The bag (3 pounds) is what gets split into weeks of " + fr(3, 4) + "."],
        [12, "That’s how many fourths are in 3. A week is 3 fourths, so group them by 3."],
      ],
      explain:
        "3 pounds is 12 fourths, and each week uses 3 fourths: 12 ÷ 3 = 4 weeks. Check: 4 × " + fr(3, 4) + " = 3.",
    },
  },
  {
    title: "A part of a group left over",
    widget: wLeft,
    body:
      "<p>Groups don’t always fill the tape exactly. If one serving of rice is " +
      fr(3, 4) +
      " cup, then 3 " +
      fr(1, 2) +
      " cups make 4 full servings with " +
      fr(2, 4) +
      " cup left. That leftover is 2 of the 3 parts of a serving: " +
      fr(2, 3) +
      " of a serving. So 3 " +
      fr(1, 2) +
      " ÷ " +
      fr(3, 4) +
      " = 4 " +
      fr(2, 3) +
      ".</p><p>Pick a division and make the groups.</p>",
    check: {
      kind: "num",
      unit: "batches",
      answer: 4.5,
      frac: true,
      q: "A batch of granola uses " + fr(2, 3) + " cup of oats. How many batches can be made with 3 cups of oats?",
      misc: [
        [
          4.33,
          "The 1 third left over is part of a batch, not part of a cup: a batch is 2 thirds, so 1 third is " +
            fr(1, 2) +
            " of a batch.",
        ],
        [4, "That counts only the full batches. 1 third of a cup is left, and that’s " + fr(1, 2) + " of a batch."],
        [2, "That’s 3 × " + fr(2, 3) + ". Ask how many groups of " + fr(2, 3) + " are in 3: divide."],
        [0.22, "That’s " + fr(2, 3) + " ÷ 3. Divide the 3 cups into groups of " + fr(2, 3) + "."],
      ],
      explain:
        "3 cups is 9 thirds. 4 batches use 8 thirds, and the last third is " +
        fr(1, 2) +
        " of a batch: 3 ÷ " +
        fr(2, 3) +
        " = 4 " +
        fr(1, 2) +
        ". Check: 4 " +
        fr(1, 2) +
        " × " +
        fr(2, 3) +
        " = 3.",
    },
  },
  {
    title: "Hops on a ruler",
    widget: wRuler,
    body:
      "<p>A ruler is a number line already cut into equal parts. “How many " +
      fr(3, 8) +
      "s are in 6?” is the same as “how many hops of " +
      fr(3, 8) +
      " inch go from 0 to 6 inches?”</p><p>Pick a hop size and add hops.</p>",
    check: {
      kind: "num",
      unit: "hops",
      answer: 10,
      frac: true,
      q: "How many hops of " + fr(3, 8) + " inch go from 0 to 3 " + fr(3, 4) + " inches?",
      misc: [
        [1.41, "That’s 3 " + fr(3, 4) + " × " + fr(3, 8) + ". Count how many hops of " + fr(3, 8) + " fit: divide."],
        [0.1, "That’s " + fr(3, 8) + " ÷ 3 " + fr(3, 4) + ". Divide the distance by the hop."],
        [30, "That’s how many eighths are in 3 " + fr(3, 4) + ". Each hop is 3 eighths."],
      ],
      explain:
        "3 " +
        fr(3, 4) +
        " inches is 30 eighths, and each hop is 3 eighths: 30 ÷ 3 = 10 hops. Check: 10 × " +
        fr(3, 8) +
        " = 3 " +
        fr(3, 4) +
        ".",
    },
  },
];
