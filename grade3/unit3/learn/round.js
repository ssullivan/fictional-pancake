/* Learn Wrapping Up Addition and Subtraction within 1,000 (Grade 3 Unit 3), chapter 7: Round. Its widgets and steps; loaded by
   round.html. */
/* numbers to start from, picked with a row of buttons */
const ROUND_NUMBERS = [342, 365, 450, 718];
/* Pick a number (and nudge it up or down by up to 10) and round it to the nearest ten or hundred on a number line. */
function wRound(el) {
  /* values.n: the number, which the stepper keeps within 10 of the number picked (limits.n); unit: 10 or 100 */
  const q = Q(el),
    values = { n: ROUND_NUMBERS[0] },
    nudgeRange = (n) => [n - 10, n + 10],
    limits = { n: nudgeRange(ROUND_NUMBERS[0]) };
  let unit = 10;
  el.innerHTML =
    `<div data-top>${seg(
      "Number",
      ROUND_NUMBERS.map((n) => [n, String(n)]),
    )}</div><div data-bot>${seg("Round to", [
      [10, "Nearest ten"],
      [100, "Nearest hundred"],
    ])}</div>` +
    `<div class="wrow">${stepper("n", "Number")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const n = values.n;
    press(q("top"), n);
    press(q("bot"), unit);
    q("n").textContent = n;
    q("f").innerHTML = roundLine(n, unit);
    q("r").innerHTML =
      roundWhy(n, unit) +
      `<br><span class="ok">${n} rounded to ${nearestWord(unit)} is <b>${roundTo(n, unit)}</b>.</span>`;
  };
  steppers(el, values, limits, draw);
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") {
      values.n = +id;
      limits.n = nudgeRange(+id);
    } else unit = +id;
    draw();
  });
  draw();
}
/* targets to find the numbers that round to: [target, unit] */
const TARGETS = [
  [350, 10],
  [400, 100],
];
/* Tap ticks on a number line around a target to find every number that rounds to it. */
function wSameRound(el) {
  /* tapped: the ticks marked so far; lastTap: the tick tapped last (undefined before any tap) */
  const q = Q(el);
  let targetIndex = 0,
    tapped = new Set(),
    lastTap;
  el.innerHTML =
    seg(
      "Round to",
      TARGETS.map(([target, unit], i) => [i, `${target}, ${nearestWord(unit)}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-all>Show them all</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [target, unit] = TARGETS[targetIndex],
      lo = target - unit,
      hi = target + unit,
      tick = unit / 10,
      fits = (v) => roundTo(v, unit) === target,
      found = [...tapped].filter(fits).length;
    press(el, targetIndex);
    q("all").disabled = found === 10;
    q("f").innerHTML = numLine(lo, hi, {
      u: 380 / (2 * unit),
      step: tick,
      big: unit / 2,
      lab: (v) => v % (unit / 2) === 0,
      pad: 24,
      tap: true,
      pts: [...tapped].map((v) => ({ v, cls: fits(v) ? "b" : "" })),
      label: `Number line from ${lo} to ${hi}, a tick every ${tick}`,
    });
    q("r").innerHTML =
      (lastTap === undefined
        ? `Tap a tick. Does it round to ${target}?`
        : `${lastTap} rounded to ${nearestWord(unit)} is ${roundTo(lastTap, unit)}${fits(lastTap) ? " ✓" : `, not ${target}`}.`) +
      `<br>Found ${found} of the 10 ticks that round to ${target}.` +
      (found === 10
        ? `<br><span class="ok">Every number from ${target - unit / 2} to ${target + unit / 2 - 1} rounds to ${target}. Halfway, ${target - unit / 2}, rounds up to it, and ${target + unit / 2} rounds up past it.</span>`
        : "");
  };
  el.addEventListener("click", (e) => {
    const hit = e.target.closest("[data-v]");
    if (!hit) return;
    const v = +hit.dataset.v;
    lastTap = v;
    /* a second tap takes the mark off */
    if (tapped.has(v)) tapped.delete(v);
    else tapped.add(v);
    draw();
  });
  q("all").onclick = () => {
    const [target, unit] = TARGETS[targetIndex];
    range(10).forEach((i) => tapped.add(target - unit / 2 + (i * unit) / 10));
    draw();
  };
  q("clr").onclick = () => {
    tapped = new Set();
    lastTap = undefined;
    draw();
  };
  onPick(el, (id) => {
    targetIndex = +id;
    tapped = new Set();
    lastTap = undefined;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  line649: roundLine(649, 100),
};
const STEPS = [
  {
    title: "The nearest ten or hundred",
    widget: wRound,
    body: "<p>To <b>round</b> a number, find the two tens (or hundreds) it’s between, and pick the closer one. 342 is between 340 and 350. It’s less than halfway, 345, so it rounds to 340. A number exactly halfway, like 345, rounds up.</p><p>Pick a number, change it, and round it.</p>",
    check: {
      kind: "mc",
      q: "A ship carries 649 barrels. What is 649 rounded to the nearest hundred?",
      fig: F.line649,
      choices: [
        { id: "a", label: "700" },
        { id: "b", label: "600" },
        { id: "c", label: "650" },
      ],
      answer: "b",
      why: {
        a: "649 is less than halfway, 650, so it’s closer to 600.",
        c: "650 is 649 rounded to the nearest ten. The nearest hundred is 600 or 700.",
      },
      explain: "649 is between 600 and 700. Halfway is 650, and 649 is less than that, so it rounds to 600.",
    },
  },
  {
    title: "Numbers that round the same",
    widget: wSameRound,
    body: "<p>Many numbers round to the same ten or hundred. 345, 346, and on up to 354 all round to 350. 344 is closer to 340, and 355 is halfway, so it rounds up to 360.</p><p>Tap the ticks to find every number that rounds to the target. Tap a tick again to take it off.</p>",
    check: {
      kind: "num",
      q: "What is the largest whole number that rounds to 300 when you round to the nearest hundred?",
      answer: 349,
      misc: [
        [350, "350 is exactly halfway between 300 and 400, and halfway rounds up to 400."],
        [399, "399 is much closer to 400."],
      ],
      explain: "349 is less than halfway, so it rounds to 300. The next number, 350, is halfway and rounds up to 400.",
    },
  },
];
