/* Learn Fractions as Numbers (Grade 3 Unit 5), chapter 3: Fractions on the number line. Its widgets and steps; loaded by
   number-line.html. */
/* A fraction strip cut into d parts with k shaded, right above a number line from 0 to 1 cut the same way, so each part of the
   strip lines up with one jump on the line; a dot marks k/d once k is more than 0. */
function stripOnLine(d, k) {
  /* the whole is wholeW wide, from left; the strip is stripH tall, and the line lineY down */
  const left = 30,
    wholeW = 420,
    stripTop = 8,
    stripH = 44,
    lineY = 100,
    partW = wholeW / d,
    xOf = (j) => left + j * partW;
  let markup = "";
  range(d).forEach((i) => {
    markup += `<rect class="fs${i < k ? " on" : ""}" x="${xOf(i)}" y="${stripTop}" width="${partW}" height="${stripH}"/>`;
  });
  markup += `<line class="axis" x1="${left - 8}" y1="${lineY}" x2="${left + wholeW + 8}" y2="${lineY}"/>`;
  range(d + 1).forEach((j) => {
    const whole = j === 0 || j === d;
    /* a dashed guide from each cut in the strip down to its tick */
    markup +=
      `<line class="guide" x1="${xOf(j)}" y1="${stripTop + stripH}" x2="${xOf(j)}" y2="${lineY - 12}"/>` +
      `<line class="tick" x1="${xOf(j)}" y1="${lineY - (whole ? 11 : 7)}" x2="${xOf(j)}" y2="${lineY + (whole ? 11 : 7)}"/>` +
      (whole ? `<text class="lbl" x="${xOf(j)}" y="${lineY + 28}">${j / d}</text>` : frT(xOf(j), lineY + 34, j, d));
  });
  if (k) markup += `<circle class="pt" cx="${xOf(k)}" cy="${lineY}" r="8"/>`;
  return svgWrap(
    left * 2 + wholeW,
    lineY + 54,
    markup,
    `A strip cut into ${d} equal parts, ${k} shaded, above a number line from 0 to 1 cut the same way` +
      (k ? `, with a point at ${k}/${d}` : ""),
  );
}
/* Shade parts of a strip and see the same fraction on the number line below it. */
function wStripLine(el) {
  const q = Q(el),
    values = { k: 1 },
    limits = { k: [0, 4] };
  let d = 4;
  el.innerHTML =
    seg(
      "Parts",
      DENS.map((x) => [x, cap(partsOf(x))]),
    ) +
    `<div class="wrow">${stepper("k", "Parts shaded")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const k = values.k;
    press(el, d);
    q("k").textContent = k;
    q("f").innerHTML = stripOnLine(d, k);
    q("r").innerHTML =
      `Each part of the strip is one jump of ${fr(1, d)} on the line.` +
      (k ? `<br>${pl(k, "part")} reach${k === 1 ? "es" : ""} <b>${fr(k, d)}</b>.` : "");
  };
  steppers(el, values, limits, draw);
  onPick(el, (id) => {
    d = +id;
    limits.k = [0, d];
    values.k = 1;
    draw();
  });
  draw();
}
/* fractions to find on the number line: [numerator, denominator] */
const TARGETS = [
  [2, 3],
  [3, 4],
  [5, 8],
];
/* Tap ticks on a number line to find a fraction; a wrong tick says which fraction it is. */
function wLocate(el) {
  /* tapped: the tick tapped last (null before any tap) */
  const q = Q(el);
  let targetIndex = 0,
    tapped = null;
  el.innerHTML =
    seg(
      "Find",
      TARGETS.map(([n, d], i) => [i, `${n}/${d}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [n, d] = TARGETS[targetIndex];
    press(el, targetIndex);
    q("f").innerHTML = fracLine([
      {
        d,
        tap: true,
        pts: tapped === null ? [] : [{ k: tapped, cls: tapped === n ? "g" : "" }],
        hops: tapped === n ? n : 0,
      },
    ]);
    q("r").innerHTML =
      tapped === null
        ? `Tap where ${fr(n, d)} goes. The line from 0 to 1 is cut into ${partsOf(d)}.`
        : tapped === n
          ? `<span class="ok">Yes! ${fr(n, d)} is ${pl(n, "jump")} of ${fr(1, d)} from 0.</span>`
          : `<span class="no">That tick is ${tapped === 0 ? "0" : tapped === d ? `${fr(d, d)}, 1 whole` : fr(tapped, d)}. Count jumps of ${fr(1, d)} from 0 to ${fr(n, d)}.</span>`;
  };
  el.addEventListener("click", (e) => {
    const tick = e.target.closest("[data-v]");
    if (!tick) return;
    tapped = +tick.dataset.v;
    draw();
  });
  onPick(el, (id) => {
    targetIndex = +id;
    tapped = null;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  point: fracLine([{ d: 4, pts: [{ k: 3 }] }]),
  trail: fracLine([{ d: 6, pts: [{ k: 4 }] }], {
    label: "A trail from 0 to 1 mile, a sign every 1/6 mile, a point at sign 4",
  }),
};
const STEPS = [
  {
    title: "From a strip to a number line",
    widget: wStripLine,
    body: "<p>A number line from 0 to 1 is like a fraction strip: cut it into equal parts, and each jump is a unit fraction. The point after 3 jumps of 1/4 is 3/4.</p><p>Pick the parts, then shade some.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "What fraction is the point at?",
      fig: F.point,
      answer: 3 / 4,
      misc: [
        [1, "That counts the tick mark at 0. Count the jumps from 0, not the tick marks."],
        [3 / 5, "There are 5 tick marks but 4 equal parts. The bottom number is the parts: 4."],
      ],
      explain: "The line from 0 to 1 has 4 equal parts, so each jump is 1/4. The point is 3 jumps from 0: 3/4.",
    },
  },
  {
    title: "Find a fraction on the line",
    widget: wLocate,
    body: "<p>To find 5/8, cut the line from 0 to 1 into eighths. Then count 5 jumps of 1/8 from 0.</p><p>Pick a fraction and tap where it goes.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "A trail is 1 mile long, with a sign every 1/6 mile. Lin walks from the start to sign 4. How far does Lin walk?",
      fig: F.trail,
      answer: 4 / 6,
      unit: "mile",
      misc: [
        [4, "Lin walked to sign 4. Each sign is 1/6 mile further: write a fraction."],
        [2 / 6, "That’s how far is left to the end."],
      ],
      explain: "4 jumps of 1/6 mile is 4/6 mile.",
    },
  },
];
