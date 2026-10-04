/* Learn Rational Numbers (Grade 6 Unit 7), chapter 2: Comparing and ordering. Its widgets and steps; loaded by compare.html. */
/* Move two numbers along the line: the one farther right is greater. */
function wFartherRight(el) {
  const q = Q(el),
    list = valuesFrom(-8, 8),
    values = { a: list.indexOf(-5), b: list.indexOf(-2) };
  el.innerHTML =
    `<div class="wrow">${stepper("a", "First number")}${stepper("b", "Second number")}</div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const a = list[values.a],
      b = list[values.b],
      least = Math.min(a, b),
      most = Math.max(a, b),
      bothNegative = a < 0 && b < 0;
    q("a").textContent = fmt(a);
    q("b").textContent = fmt(b);
    q("f").innerHTML = signedLine(-9, 9, {
      pts:
        a === b
          ? [{ v: a, t: fmt(a) }]
          : [
              { v: a, t: fmt(a) },
              { v: b, cls: "b", t: fmt(b) },
            ],
      label: `Number line with ${fmt(a)} and ${fmt(b)}`,
    });
    q("e").textContent = compareText(a, b);
    q("r").innerHTML =
      a === b
        ? `Both numbers are ${fmt(a)}, at the same place on the line: ${fmt(a)} = ${fmt(b)}.`
        : `${fmt(least)} is to the left of ${fmt(most)}, so <b>${fmt(least)} is less</b>: ${fmt(least)} &lt; ${fmt(most)}.` +
          (bothNegative
            ? `<br><span class="dimline">${fmt(-least)} is more than ${fmt(-most)}, but ${fmt(least)} is less than ${fmt(most)}. The farther left, the less, even when the digits are bigger.</span>`
            : "");
  };
  steppers(el, values, { a: [0, list.length - 1], b: [0, list.length - 1] }, draw);
  draw();
}

/* pairs of numbers to compare, the less one first, and the same pair as temperatures */
const PAIRS = [
  { id: "a", less: -6, more: 1 },
  { id: "b", less: -7, more: -2.5 },
  { id: "c", less: -0.5, more: 3 },
];
/* Pick a pair and flip between reading it with < and with >. */
function wBothWays(el) {
  const q = Q(el);
  let pairId = "a",
    flipped = false;
  el.innerHTML =
    seg(
      "Pair",
      PAIRS.map((p) => [p.id, `${fmt(p.less)} and ${fmt(p.more)}`]),
    ) +
    `<div class="wrow"><button type="button" class="ghost-btn" data-flip>Flip it</button></div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { less, more } = PAIRS.find((p) => p.id === pairId);
    press(el, pairId);
    q("f").innerHTML = signedLine(-8, 8, {
      step: 0.5,
      pts: [
        { v: less, t: fmt(less) },
        { v: more, cls: "b", t: fmt(more) },
      ],
      label: `Number line with ${fmt(less)} and ${fmt(more)}`,
    });
    q("e").textContent = flipped ? `${fmt(more)} > ${fmt(less)}` : `${fmt(less)} < ${fmt(more)}`;
    q("r").innerHTML =
      (flipped
        ? `${fmt(more)} &gt; ${fmt(less)} reads “${fmt(more)} is greater than ${fmt(less)}.”`
        : `${fmt(less)} &lt; ${fmt(more)} reads “${fmt(less)} is less than ${fmt(more)}.”`) +
      ` Both ways say the same thing about the same two numbers. The open side of the symbol faces the greater number.` +
      `<br><span class="dimline">As temperatures: ${fmt(less)} °C is colder than ${fmt(more)} °C, and ${fmt(more)} °C is warmer than ${fmt(less)} °C.</span>`;
  };
  onPick(el, (id) => {
    pairId = id;
    flipped = false;
    draw();
  });
  q("flip").addEventListener("click", () => {
    flipped = !flipped;
    draw();
  });
  draw();
}

/* sets of numbers to put in order, in the order they're first shown */
const SETS = [
  { id: "a", label: "Whole and half", nums: [2.5, -3, 0, -1.5, 4] },
  { id: "b", label: "Decimals", nums: [-0.75, 0.5, -2, 1.25, -1.5] },
  { id: "c", label: "Temperatures", nums: [-8, 3, -12, 0, -1], unit: " °F" },
];
/* Pick a set of numbers and put them on the line: left to right is least to greatest. */
function wOrder(el) {
  const q = Q(el);
  let setId = "a",
    placed = false;
  el.innerHTML =
    seg(
      "Numbers",
      SETS.map((s) => [s.id, s.label]),
    ) +
    `<div class="wrow"><button type="button" class="ghost-btn" data-place></button></div>` +
    `<div class="chips" data-c></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const set = SETS.find((s) => s.id === setId),
      sorted = set.nums.slice().sort((x, y) => x - y),
      shown = placed ? sorted : set.nums,
      unit = set.unit || "",
      lo = Math.floor(sorted[0]) - 1,
      hi = Math.ceil(sorted[sorted.length - 1]) + 1;
    press(el, setId);
    q("place").textContent = placed ? "Take them off the line" : "Put them on the line";
    q("c").innerHTML = shown.map((v) => `<span class="chip${placed ? " found" : ""}">${fmt(v)}${unit}</span>`).join("");
    /* in order, every other name is raised a level so close numbers don't run together */
    q("f").innerHTML = signedLine(lo, hi, {
      step: sorted.every(Number.isInteger) ? 1 : 0.25,
      pts: placed ? sorted.map((v, i) => ({ v, cls: i % 2 ? "b" : "", t: fmt(v), lv: i % 2 })) : [],
      label: placed ? `Number line with ${sorted.map(fmt).join(", ")}` : `Number line from ${fmt(lo)} to ${fmt(hi)}`,
    });
    q("r").innerHTML = placed
      ? `Least to greatest is left to right: <b>${sorted.map((v) => fmt(v) + unit).join(", ")}</b>.` +
        (set.unit ? ` The coldest is ${fmt(sorted[0])}${unit}.` : "")
      : "Where does each number go on the line? Put them on to see the order.";
  };
  onPick(el, (id) => {
    setId = id;
    placed = false;
    draw();
  });
  q("place").addEventListener("click", () => {
    placed = !placed;
    draw();
  });
  draw();
}

const STEPS = [
  {
    title: "Farther right is greater",
    widget: wFartherRight,
    body: "<p>On a number line, numbers grow from left to right. So the number <b>farther right is greater</b>, and the one farther left is less, for negative numbers too.</p><p>Move the two numbers. Try two negative numbers.</p>",
    check: {
      kind: "mc",
      q: "Which is true?",
      choices: [
        { id: "a", label: "−7 < −4" },
        { id: "b", label: "−7 > −4" },
        { id: "c", label: "−7 = −4" },
      ],
      answer: "a",
      why: {
        b: "7 is more than 4, but −7 is farther left on the number line than −4, so −7 is less.",
        c: "−7 and −4 are at different places on the number line.",
      },
      explain: "−7 is to the left of −4, so −7 < −4.",
    },
  },
  {
    title: "Two ways to say it",
    widget: wBothWays,
    body: "<p>The symbol &lt; means “is less than” and &gt; means “is greater than.” Every comparison can be written both ways: −6 &lt; 1 and 1 &gt; −6 say the same thing.</p><p>Pick a pair and flip it.</p>",
    check: {
      kind: "mc",
      q: "Which says the same thing as −4 < 1?",
      choices: [
        { id: "a", label: "1 > −4" },
        { id: "b", label: "−4 > 1" },
        { id: "c", label: "1 < −4" },
      ],
      answer: "a",
      why: {
        b: "That says −4 is greater than 1. Flipping the symbol without swapping the numbers changes what it says.",
        c: "That says 1 is less than −4. Swapping the numbers without flipping the symbol changes what it says.",
      },
      explain: "−4 < 1 says −4 is less than 1. The same fact the other way: 1 is greater than −4, or 1 > −4.",
    },
  },
  {
    title: "Putting numbers in order",
    widget: wOrder,
    body: "<p>To put numbers in order, picture them on a number line. Least to greatest is left to right. Fractions and decimals go between the whole numbers.</p><p>Pick a set of numbers and put them on the line.</p>",
    check: {
      kind: "mc",
      q: "Which list is in order from least to greatest?",
      stack: true,
      choices: [
        { id: "a", label: "−5.5, −2, 0.5, 3" },
        { id: "b", label: "0.5, −2, 3, −5.5" },
        { id: "c", label: "3, 0.5, −2, −5.5" },
      ],
      answer: "a",
      why: {
        b: "That’s in order of distance from 0, ignoring the signs. A negative number is less the farther it is from 0.",
        c: "That’s greatest to least. Least to greatest starts with the number farthest left.",
      },
      explain: "On a number line, left to right: −5.5, −2, 0.5, 3.",
    },
  },
];
