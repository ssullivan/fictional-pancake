/* Learn Rational Numbers (Grade 6 Unit 7), chapter 1: Positive and negative numbers. Its widgets and steps; loaded by
   signed.html. */
/* the two up-and-down number lines: their values (a stepper moves through them), where they start, and how to draw and say one */
const UPDOWN = {
  temp: {
    label: "Temperature",
    values: valuesFrom(-15, 15),
    start: -4,
    fig: (v) => vLine(-20, 20, { every: 5, unit: "°", kind: "temp", value: v, label: `Thermometer at ${fmt(v)} °C` }),
    show: (v) => `${fmt(v)} °C`,
    say: (v) =>
      v < 0
        ? `${fmt(v)} °C is ${fmt(-v)} degrees <b>below</b> zero. Temperatures below zero are negative.`
        : v > 0
          ? `${fmt(v)} °C is ${fmt(v)} degrees <b>above</b> zero. Temperatures above zero are positive.`
          : "0 °C is zero, where water freezes. Zero is neither positive nor negative.",
  },
  elev: {
    label: "Elevation",
    values: valuesFrom(-300, 300, 50),
    start: -100,
    fig: (v) =>
      vLine(-300, 300, {
        every: 100,
        step: 50,
        kind: "sea",
        pts: [{ v, t: `${fmt(v)} m` }],
        label: `Elevation of ${fmt(v)} meters`,
      }),
    show: (v) => `${fmt(v)} m`,
    say: (v) =>
      v < 0
        ? `${fmt(v)} m is ${fmt(-v)} meters <b>below</b> sea level, like a submarine. Below sea level is negative.`
        : v > 0
          ? `${fmt(v)} m is ${fmt(v)} meters <b>above</b> sea level, like a hilltop. Above sea level is positive.`
          : "0 m is sea level. Zero is neither positive nor negative.",
  },
};
/* Pick a thermometer or sea level and move up and down: the number, and what its sign means. */
function wAboveBelow(el) {
  const q = Q(el),
    values = { v: 0 },
    limits = { v: [0, 0] };
  let mode = "temp";
  el.innerHTML =
    seg("Line", [
      ["temp", "Temperature"],
      ["elev", "Elevation"],
    ]) +
    `<div class="wrow" data-c></div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  /* a new line: its stepper, starting at its starting value */
  const choose = (id) => {
    mode = id;
    const line = UPDOWN[id];
    values.v = line.values.indexOf(line.start);
    limits.v = [0, line.values.length - 1];
    q("c").innerHTML = stepper("v", line.label);
    draw();
  };
  const draw = () => {
    const line = UPDOWN[mode],
      v = line.values[values.v];
    press(el, mode);
    q("v").textContent = line.show(v);
    q("f").innerHTML = line.fig(v);
    q("e").textContent = fmt(v);
    q("r").innerHTML =
      line.say(v) +
      `<br><span class="dimline">A negative number has a minus sign: ${fmt(-Math.abs(v) || -5)} is read “negative ${fmt(Math.abs(v) || 5)}.”</span>`;
  };
  onPick(el, choose);
  steppers(el, values, limits, draw);
  choose("temp");
}

/* Move a number along the line and show its opposite: the same distance from 0, on the other side. */
function wOpposites(el) {
  const q = Q(el),
    list = valuesFrom(-6, 6, 0.5),
    values = { v: list.indexOf(-3.5) };
  let shown = false;
  el.innerHTML =
    `<div class="wrow">${stepper("v", "Number")}<button type="button" class="ghost-btn" data-o></button></div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const v = list[values.v],
      far = Math.abs(v);
    q("v").textContent = fmt(v);
    q("o").textContent = shown ? "Hide the opposite" : "Show the opposite";
    q("f").innerHTML = signedLine(-7, 7, {
      step: 0.5,
      pts: [{ v, t: fmt(v) }, ...(shown && v ? [{ v: -v, cls: "b", t: fmt(-v) }] : [])],
      spans:
        shown && v
          ? [
              { a: Math.min(0, v), b: Math.max(0, v), t: fmt(far) },
              { a: Math.min(0, -v), b: Math.max(0, -v), t: fmt(far) },
            ]
          : [],
      label: `Number line with ${fmt(v)}${shown ? ` and its opposite, ${fmt(-v)}` : ""}`,
    });
    q("r").innerHTML = !v
      ? "0 is its own opposite: it’s 0 away from 0, so there’s nowhere else to go."
      : shown
        ? `The opposite of ${fmt(v)} is <b>${fmt(-v)}</b>. Both are ${fmt(far)} from 0, on opposite sides of it.`
        : `${fmt(v)} is ${fmt(far)} ${sideOf(v)}. Where is its opposite?`;
  };
  q("o").addEventListener("click", () => {
    shown = !shown;
    draw();
  });
  steppers(el, values, { v: [0, list.length - 1] }, draw);
  draw();
}

/* a number with d equal parts in each whole, written as a fraction or mixed number: −1 1/4, −3/4 */
function fracText(v, d) {
  const parts = Math.round(Math.abs(v) * d),
    whole = Math.floor(parts / d),
    rest = parts % d,
    common = gcd(rest, d) || 1,
    sign = v < 0 ? "−" : "";
  if (!rest) return `${sign}${whole}`;
  return `${sign}${whole ? whole + " " : ""}${rest / common}/${d / common}`;
}
/* number lines cut into halves, quarters, and tenths: their ends, the step between ticks, and where the point starts */
const SPLITS = [
  { id: "2", label: "Halves", lo: -3, hi: 3, step: 0.5, start: -1.5 },
  { id: "4", label: "Quarters", lo: -2, hi: 2, step: 0.25, start: -0.75 },
  { id: "10", label: "Tenths", lo: -1, hi: 1, step: 0.1, start: -0.3 },
];
/* Pick halves, quarters, or tenths and move a point by ticks: the number as a fraction and as a decimal. */
function wBetween(el) {
  const q = Q(el),
    values = { v: 0 },
    limits = { v: [0, 0] };
  let split = SPLITS[0],
    list = [];
  el.innerHTML =
    seg(
      "Ticks",
      SPLITS.map((s) => [s.id, s.label]),
    ) +
    `<div class="wrow">${stepper("v", "Move the point")}</div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const choose = (id) => {
    split = SPLITS.find((s) => s.id === id);
    list = valuesFrom(split.lo, split.hi, split.step);
    values.v = list.indexOf(split.start);
    limits.v = [0, list.length - 1];
    draw();
  };
  const draw = () => {
    const v = list[values.v],
      d = +split.id,
      ticks = Math.round(Math.abs(v) / split.step),
      asFraction = fracText(v, d);
    press(el, split.id);
    q("v").textContent = fmt(v);
    q("f").innerHTML = signedLine(split.lo, split.hi, {
      step: split.step,
      pts: [{ v, t: "?" }],
      label: `Number line from ${fmt(split.lo)} to ${fmt(split.hi)} in ${split.label.toLowerCase()}, with a point ${ticks} ticks ${sideOf(v)}`,
    });
    q("e").textContent = asFraction === fmt(v) ? fmt(v) : `${asFraction} = ${fmt(v)}`;
    q("r").innerHTML = !v
      ? "The point is at 0."
      : `The point is ${ticks} tick${ticks === 1 ? "" : "s"} of 1/${d} ${sideOf(v)}: <b>${asFraction}</b>${asFraction === fmt(v) ? "" : `, or ${fmt(v)} as a decimal`}.` +
        (v < 0 && !Number.isInteger(v)
          ? `<br><span class="dimline">It’s between ${fmt(Math.ceil(v))} and ${fmt(Math.floor(v))}. Negative fractions count left from 0, just like negative whole numbers.</span>`
          : "");
  };
  onPick(el, choose);
  steppers(el, values, limits, draw);
  choose("2");
}

const STEPS = [
  {
    title: "Above and below zero",
    widget: wAboveBelow,
    body: "<p>Some amounts can go below zero. A temperature of 4 degrees below zero is <b>−4 °C</b>, and a place 100 meters below sea level has an elevation of <b>−100 m</b>. Numbers below zero are <b>negative</b>; numbers above zero are <b>positive</b>.</p><p>Move the thermometer, then try elevation.</p>",
    check: {
      kind: "num",
      neg: true,
      q: "A diver is 12 meters below sea level. What number is the diver’s elevation?",
      answer: -12,
      unit: "m",
      misc: [[12, "12 would be 12 meters above sea level. Below sea level is negative: put a minus sign in front."]],
      explain: "Below sea level is negative, so 12 meters below sea level is −12 m.",
    },
  },
  {
    title: "Opposites",
    widget: wOpposites,
    body: "<p>On a number line, negative numbers are to the left of 0 and positive numbers are to the right. Two numbers the same distance from 0, on opposite sides, are <b>opposites</b>: 3.5 and −3.5.</p><p>Move the number, then show its opposite.</p>",
    check: {
      kind: "num",
      neg: true,
      q: "What is the opposite of −6.5?",
      answer: 6.5,
      misc: [[-6.5, "That’s the same number. Its opposite is 6.5 from 0 on the other side of 0."]],
      explain: "−6.5 is 6.5 to the left of 0. Its opposite is 6.5 to the right of 0: 6.5.",
    },
  },
  {
    title: "Between the whole numbers",
    widget: wBetween,
    body: "<p>Fractions and decimals can be negative too. The number line between −1 and 0 is split the same way as between 0 and 1, just on the left side.</p><p>Pick how the line is split, then move the point.</p>",
    check: {
      kind: "num",
      neg: true,
      q: "A point is halfway between −3 and −2. What number is it?",
      answer: -2.5,
      misc: [
        [2.5, "2.5 is halfway between 2 and 3, to the right of 0. The point is between −3 and −2, to the left."],
        [-3.5, "−3.5 is halfway between −4 and −3. Halfway between −3 and −2 is −2.5."],
        [-1.5, "−1.5 is halfway between −2 and −1. Halfway between −3 and −2 is −2.5."],
      ],
      explain: "Halfway between −3 and −2 is −2.5 (or −2 1/2): 2.5 to the left of 0.",
    },
  },
];
