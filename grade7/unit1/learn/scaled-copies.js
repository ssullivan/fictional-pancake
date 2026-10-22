/* Learn Scale Drawings (Grade 7 Unit 1), chapter 1: Scaled copies. Its widgets and steps; loaded by scaled-copies.html. */
/* the L-shape from IM's first lesson, as an original */
const L_SHAPE = SHAPE_LIB[0].pts;
/* copies of it: [label, how much the widths are multiplied, how much the heights are] */
const COPIES = [
  ["× 2", TWO, TWO],
  ["× 1/2", HALF, HALF],
  ["Wider only", TWO, ONE],
  ["Taller only", ONE, TWO],
];
/* Pick a copy of the L-shape and compare each side with the original's: a scaled copy multiplies them all by the same
   number. */
function wCopies(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Copy",
      COPIES.map(([label], i) => [i, label]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [label, fx, fy] = COPIES[index],
      copy = scalePts(L_SHAPE, fx, fy),
      before = gridSides(L_SHAPE),
      after = gridSides(copy),
      /* each side of the copy divided by the matching side of the original */
      ratios = after.map((v, i) => v / before[i]),
      scaled = ratios.every((r) => r === ratios[0]);
    press(el, index);
    q("f").innerHTML = pairFig(L_SHAPE, copy, { label: `The L-shape and a copy, ${label}` });
    q("r").innerHTML =
      `Copy ÷ original, side by side: ${after.map((v, i) => `${fmt(v)} ÷ ${fmt(before[i])} = ${fmt(ratios[i])}`).join(", ")}.<br>` +
      (scaled
        ? `<span class="ok">Every side was multiplied by ${fmt(ratios[0])}. It’s a <b>scaled copy</b>: the same shape, ${ratios[0] > 1 ? "bigger" : "smaller"}.</span>`
        : `<span class="no">Some sides were multiplied by 2 and some by 1. It’s stretched, <b>not</b> a scaled copy.</span>`);
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* the trapezoid ABCD and a copy of it twice as big, turned a quarter turn: PQRS */
const TRAP = SHAPE_LIB.find((s) => s.name === "trapezoid").pts,
  TRAP_COPY = turnPts(scalePts(TRAP, TWO), 1);
/* Pick a side of the original: the matching side of the turned copy lights up, with both lengths. */
function wMatch(el) {
  const q = Q(el),
    orig = "ABCD",
    copy = "PQRS";
  el.innerHTML =
    seg(
      "Side of the original",
      range(4).map((i) => [i, `Side ${orig[i]}${orig[(i + 1) % 4]}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (side) => {
    const next = (side + 1) % 4,
      lens = sideLens(TRAP),
      copyLens = sideLens(TRAP_COPY);
    press(el, side);
    q("f").innerHTML = pairFig(TRAP, TRAP_COPY, {
      origOpts: { verts: [...orig], hi: [side] },
      copyOpts: { verts: [...copy], hi: [side] },
      label: `Trapezoid ABCD and its turned copy PQRS, side ${orig[side]}${orig[next]} and side ${copy[side]}${copy[next]} marked`,
    });
    q("r").innerHTML =
      `Corner ${orig[side]} matches ${copy[side]} and ${orig[next]} matches ${copy[next]}, so side <b>${orig[side]}${orig[next]}</b> corresponds to side <b>${copy[side]}${copy[next]}</b>. ` +
      (lens[side] === null ? "It’s the slanted side in both." : `${fmt(lens[side])} × 2 = ${fmt(copyLens[side])}.`);
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* the right triangle, legs 2 across and 4 down */
const TRI = SHAPE_LIB.find((s) => s.name === "right triangle").pts;
/* Pick a scale factor: every side of the copy is the original's times it. */
function wFactor(el) {
  const q = Q(el),
    factors = [HALF, THREE_HALVES, TWO, THREE];
  el.innerHTML =
    seg(
      "Scale factor",
      factors.map((f, i) => [i, facText(f)]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const f = factors[index],
      copy = scalePts(TRI, f),
      [down, across] = gridSides(TRI),
      [copyDown, copyAcross] = gridSides(copy);
    press(el, index);
    q("f").innerHTML = pairFig(TRI, copy, { label: `A right triangle and its copy with scale factor ${ftx(f)}` });
    q("r").innerHTML =
      `Scale factor <b>${fim(f)}</b>: ${fmt(down)} × ${fim(f)} = ${fmt(copyDown)} and ${fmt(across)} × ${fim(f)} = ${fmt(copyAcross)}. ` +
      `The slanted side is ${fim(f)} times as long too.`;
  };
  onPick(el, (id) => draw(+id));
  draw(2);
}

const STEPS = [
  {
    title: "Same shape, every length multiplied",
    widget: wCopies,
    body: "<p>A <b>scaled copy</b> has the same shape as the original, bigger or smaller. Every length in it is the original’s times the same number. A copy that’s stretched more one way than the other isn’t a scaled copy, even though its corners are still square.</p><p>Try each copy.</p>",
    check: {
      kind: "mc",
      q: "A rectangle is 4 cm by 6 cm. Which rectangle could be a scaled copy of it?",
      choices: [
        { id: "a", label: "8 cm by 12 cm" },
        { id: "b", label: "6 cm by 8 cm" },
        { id: "c", label: "4 cm by 12 cm" },
      ],
      answer: "a",
      why: {
        b: "That adds 2 to each side. A scaled copy multiplies: 4 × 1.5 = 6, but 6 × 1.5 = 9, not 8.",
        c: "Only one side changed. That’s stretched: a scaled copy multiplies both sides by the same number.",
      },
      explain: "4 × 2 = 8 and 6 × 2 = 12: both sides are multiplied by 2, so 8 cm by 12 cm is a scaled copy.",
    },
  },
  {
    title: "Corresponding parts",
    widget: wMatch,
    body: "<p>Each part of the original has a <b>corresponding</b> part in the copy: the side or corner in the same place. When the copy is turned, turn it back in your head to match them up. Corresponding sides are all the same multiple of each other.</p><p>Pick a side of the original.</p>",
    check: {
      kind: "num",
      q: "Quadrilateral PQRS is a scaled copy of ABCD. Side AB is 6 cm and its corresponding side PQ is 9 cm. Side BC is 4 cm. How long is side QR?",
      answer: 6,
      unit: "cm",
      misc: [
        [7, "That adds 3, like 6 to 9. A scaled copy multiplies: 9 ÷ 6 = 1.5, so multiply 4 by 1.5."],
        [4, "That’s side BC. Side QR is the corresponding side in the copy, so it’s 1.5 times as long."],
        [2.67, "That divides by 1.5. The copy is bigger: multiply by 1.5."],
      ],
      explain: "9 ÷ 6 = 1.5, so every side of PQRS is 1.5 times its corresponding side: 4 × 1.5 = 6 cm.",
    },
  },
  {
    title: "The scale factor",
    widget: wFactor,
    body: "<p>The number every length is multiplied by is the <b>scale factor</b>. To find it, divide a side of the copy by its corresponding side in the original.</p><p>Change the scale factor.</p>",
    check: {
      kind: "num",
      q: "A side of the original is 5 units long. Its corresponding side in a scaled copy is 15 units. What is the scale factor?",
      answer: 3,
      misc: [
        [10, "That’s how much longer the side got. The scale factor multiplies: 5 × ? = 15."],
        [0.33, "That goes from the copy back to the original. Divide the copy’s side by the original’s: 15 ÷ 5."],
      ],
      explain: "5 × 3 = 15, so the scale factor is 3.",
    },
  },
];
