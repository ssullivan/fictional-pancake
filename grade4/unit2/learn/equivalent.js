/* Learn Fraction Equivalence and Comparison (Grade 4 Unit 2), chapter 4: Equivalent fractions. Its widgets and steps; loaded by equivalent.html. */
/* the fractions to match */
const TOP = [
  [1, 2],
  [2, 3],
  [3, 4],
];
/* Shade a second strip, in parts you choose, to match the first. */
function wMatch(el) {
  /* the stepper's value: sh shaded parts, at most d; topIndex: the fraction to match; d: the second strip's parts */
  const q = Q(el),
    values = { sh: 0 },
    limits = { sh: [0, 8] };
  let topIndex = 2,
    d = 8;
  el.innerHTML = `<div data-top>${seg(
    "Match",
    TOP.map((f, i) => [i, frA(f)]),
  )}</div><div class="fig" data-f></div><div data-bot>${seg(
    "Equal parts",
    DEN.map((v) => [v, PART[v][1]]),
  )}</div><div class="wrow">${stepper("sh", "Shaded parts")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    /* below: the most parts of d that stay under a/b */
    const [a, b] = TOP[topIndex],
      shaded = values.sh,
      vsTop = sign([shaded, d], [a, b]),
      below = Math.floor((a * d) / b);
    press(q("top"), topIndex);
    press(q("bot"), d);
    q("sh").textContent = shaded;
    q("f").innerHTML = strips([
      { d: b, k: a, lab: [a, b] },
      { d, k: shaded, cls: "b", lab: [shaded, d] },
    ]);
    q("r").innerHTML =
      vsTop === "="
        ? `<span class="ok">Same amount! <b>${fr(shaded, d)} = ${fr(a, b)}</b>. They are <b>equivalent</b> fractions.</span>`
        : `${fr(shaded, d)} is ${vsTop === "<" ? "less" : "more"} than ${fr(a, b)}. Shade ${vsTop === "<" ? "more" : "fewer"} ${PART[d][1]}.` +
          ((a * d) % b
            ? `<br><span class="dimline">${cap(PART[d][1])} can’t make exactly ${fr(a, b)}: ${partName(d, below)} ${below === 1 ? "is" : "are"} too little and ${partName(d, below + 1)} too much.</span>`
            : "");
  };
  steppers(el, values, limits, draw);
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") topIndex = +id;
    else {
      d = +id;
      limits.sh[1] = d;
      values.sh = Math.min(values.sh, d);
    }
    draw();
  });
  draw();
}
/* pairs of denominators for the two number lines */
const LINES = [
  [4, 8],
  [3, 6],
  [3, 12],
  [5, 10],
];
/* Two number lines: tap a tick on either one to see what lines up with it on the other. */
function wLines(el) {
  /* picked: the tick tapped, {r: which line (0 or 1), k: how many parts from 0} */
  const q = Q(el);
  let pairIndex = 0,
    picked = null;
  el.innerHTML =
    seg(
      "Number lines",
      LINES.map(([a, b], i) => [i, `${PART[a][1]} and ${PART[b][1]}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [d1, d2] = LINES[pairIndex],
      dens = [d1, d2];
    press(el, pairIndex);
    /* the picked point in line r's parts, when a tick is there (null when it isn't) */
    const at = (r) =>
        picked && (picked.k * dens[r]) % dens[picked.r] === 0 ? (picked.k * dens[r]) / dens[picked.r] : null,
      dotOn = (r) => (at(r) === null ? [] : [{ k: at(r), cls: r ? "b" : "" }]);
    q("f").innerHTML = fracLine(
      [
        { d: d1, tap: true, labs: true, pts: dotOn(0) },
        { d: d2, tap: true, labs: true, pts: dotOn(1) },
      ],
      {
        marks: picked ? [{ v: picked.k / dens[picked.r], t: "" }] : [],
        label: `Number lines from 0 to 1 in ${PART[d1][1]} and in ${PART[d2][1]}`,
      },
    );
    if (!picked) {
      q("r").innerHTML = "Tap a tick mark on either line.";
      return;
    }
    /* other: the line not tapped; kOther: the point in its parts; below: its tick just under the point */
    const other = 1 - picked.r,
      kOther = at(other),
      tapped = [picked.k, dens[picked.r]],
      below = Math.floor((picked.k * dens[other]) / dens[picked.r]);
    q("r").innerHTML =
      kOther === null
        ? `${frA(tapped)} is between ${fr(below, dens[other])} and ${fr(below + 1, dens[other])}. No tick for ${PART[dens[other]][1]} lands on it.`
        : `<span class="ok"><b>${frA(tapped)} = ${fr(kOther, dens[other])}</b>: they are at the same point, so they are equivalent.</span><br><span class="dimline">Each ${PART[d1][0]} is ${partName(d2, d2 / d1)}.</span>`;
  };
  el.addEventListener("click", (e) => {
    const pairBtn = e.target.closest("[data-m]");
    if (pairBtn) {
      pairIndex = +pairBtn.dataset.m;
      picked = null;
      draw();
      return;
    }
    const tick = e.target.closest("[data-v]");
    if (tick) {
      picked = { r: +tick.dataset.r, k: +tick.dataset.v };
      draw();
    }
  });
  draw();
}
/* the quick checks' figures */
const F = {
  trail: strips(
    [
      { d: 4, k: 3 },
      { d: 8, k: 0, cls: "b" },
    ],
    { label: "A strip in fourths with 3 shaded, above a strip in eighths" },
  ),
  lines: fracLine([{ d: 3, pts: [{ k: 2 }] }, { d: 6 }], {
    label: "A number line in thirds with a point at 2 thirds, above a number line in sixths",
  }),
};
const STEPS = [
  {
    title: "Same amount, different parts",
    widget: wMatch,
    body:
      "<p>Fractions that are the same amount are <b>equivalent</b>, even though their numbers are different. " +
      fr(1, 2) +
      " of a strip is the same as " +
      fr(2, 4) +
      " of it.</p><p>Pick a fraction to match. Then cut the blue strip into parts and shade the same amount.</p>",
    check: {
      kind: "num",
      unit: "eighths",
      answer: 6,
      fig: F.trail,
      q:
        "Jada has hiked " +
        fr(3, 4) +
        " of a trail. The trail map is marked in eighths. How many eighths of the trail has Jada hiked?",
      misc: [
        [7, "You added 4 to the top and the bottom. Adding changes the amount. Each fourth is 2 eighths."],
        [3, fr(3, 8) + " is less than " + fr(3, 4) + ": an eighth is half of a fourth."],
        [4, fr(4, 8) + " is " + fr(1, 2) + ". " + fr(3, 4) + " is more than half."],
      ],
      explain: "Each fourth is 2 eighths, so 3 fourths is 6 eighths: " + fr(3, 4) + " = " + fr(6, 8) + ".",
    },
  },
  {
    title: "Same point on the number line",
    widget: wLines,
    body:
      "<p>Equivalent fractions sit at the same point on a number line. On a line in fourths and a line in eighths, " +
      fr(1, 4) +
      " and " +
      fr(2, 8) +
      " line up.</p><p>Pick two number lines and tap tick marks. Which ones line up?</p>",
    check: {
      kind: "mc",
      q: "Which fraction is at the same point as " + fr(2, 3) + "?",
      fig: F.lines,
      choices: [
        { id: "a", label: fr(3, 4) },
        { id: "b", label: fr(2, 6) },
        { id: "c", label: fr(4, 6) },
      ],
      answer: "c",
      why: {
        a: "Adding 1 to the top and the bottom changes the amount. Look at the line in sixths under the dot.",
        b: "Sixths are smaller than thirds, so 2 sixths is less than 2 thirds. Each third is 2 sixths.",
      },
      explain:
        "Each third is 2 sixths, so 2 thirds is 4 sixths. " + fr(2, 3) + " and " + fr(4, 6) + " are at the same point.",
    },
  },
];
