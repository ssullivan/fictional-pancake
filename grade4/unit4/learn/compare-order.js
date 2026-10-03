/* Learn From Hundredths to Hundred-thousands (Grade 4 Unit 4), chapter 5: Compare and order. Its widgets and steps; loaded by compare-order.html. */
/* the first place, from the left, where a and b have different digits (null if they're the same number) */
const firstDiff = (a, b) => WIDE.find((e) => digitAt(a, e) !== digitAt(b, e)) ?? null;
/* how a and b compare, place by place (html) */
function placeWhy(a, b) {
  const e = firstDiff(a, b),
    lengthA = String(a).length,
    lengthB = String(b).length;
  if (e === null) return "Every digit is the same.";
  /* more digits means bigger */
  if (lengthA !== lengthB) {
    const [smaller, bigger] = a < b ? [a, b] : [b, a];
    return `${commas(bigger)} has ${Math.max(lengthA, lengthB)} digits and ${commas(smaller)} has only ${Math.min(lengthA, lengthB)}: ${commas(bigger)} has ${PL[e][1]}, and ${commas(smaller)} has none.`;
  }
  const digitA = digitAt(a, e),
    digitB = digitAt(b, e);
  return `${e === lengthA - 1 ? "Start with the biggest place, the " + PLACE[e].toLowerCase() : "The digits are the same until the " + PLACE[e].toLowerCase()}: ${digitA} ${PL[e][digitA === 1 ? 0 : 1]} is ${digitA < digitB ? "less" : "more"} than ${digitB}.`;
}
/* a number for wSign: its value and how it's written */
const nn = (v) => ({ v, t: commas(v) });
/* Pick <, =, or > for two big numbers, then see them in a place-value chart. */
const wCmp = wSign(
  [
    [nn(45302), nn(45230)],
    [nn(99000), nn(100000)],
    [nn(607000), nn(670000)],
    [nn(38500), nn(38050)],
  ],
  {
    show: (a, b) =>
      pvChart(
        [
          ["", a.v],
          ["", b.v],
        ],
        WIDE.indexOf(firstDiff(a.v, b.v)),
        { places: WIDE },
      ),
    why: (a, b) => placeWhy(a.v, b.v),
  },
);
/* sets of numbers to put in order */
const SETS = [
  [70500, 7050, 75000, 70050],
  [120100, 99000, 201000, 102000],
  [36000, 306000, 63000, 30600],
];
/* Tap numbers from least to greatest; each goes into a place-value chart, and a wrong tap says why. */
function wOrder(el) {
  /* placed: the numbers in order so far; miss: the last wrong tap */
  const q = Q(el);
  let setIndex = 0,
    placed = [],
    miss = null;
  el.innerHTML =
    seg(
      "Set",
      SETS.map((_, i) => [i, `Set ${i + 1}`]),
    ) +
    `<div class="chips" data-c></div><div data-t></div><div class="wrow"><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const set = SETS[setIndex],
      left = set.filter((v) => !placed.includes(v)),
      least = Math.min(...left);
    press(el, setIndex);
    q("c").innerHTML = set
      .map(
        (v, i) =>
          `<button type="button" class="chip${placed.includes(v) ? " found" : ""}" data-i="${i}"${placed.includes(v) ? " disabled" : ""}>${commas(v)}</button>`,
      )
      .join("");
    q("t").innerHTML = placed.length
      ? pvChart(
          placed.map((v, i) => [i + 1, v]),
          -1,
          { places: WIDE },
        )
      : "";
    q("r").innerHTML =
      (miss !== null
        ? `<span class="no">${commas(miss)} isn’t the least one left.</span> ${commas(least)} &lt; ${commas(miss)}. ${placeWhy(least, miss)}<br>`
        : "") +
      (!left.length
        ? `<span class="ok">In order: <b>${placed.map(commas).join(", ")}</b>.</span>`
        : placed.length
          ? "Next: which is the least of the rest?"
          : "Tap the numbers from least to greatest.");
  };
  el.addEventListener("click", (e) => {
    const setBtn = e.target.closest("[data-m]");
    if (setBtn) {
      setIndex = +setBtn.dataset.m;
      placed = [];
      miss = null;
      draw();
      return;
    }
    const chip = e.target.closest("[data-i]");
    if (!chip || chip.disabled) return;
    const v = SETS[setIndex][+chip.dataset.i],
      left = SETS[setIndex].filter((x) => !placed.includes(x));
    if (v === Math.min(...left)) {
      placed.push(v);
      miss = null;
    } else miss = v;
    draw();
  });
  q("clr").onclick = () => {
    placed = [];
    miss = null;
    draw();
  };
  draw();
}
const STEPS = [
  {
    title: "Compare place by place",
    widget: wCmp,
    body: "<p>To compare two numbers, line them up by place. A number with more digits is greater. With the same number of digits, start at the left and find the first place where the digits are different. That place decides.</p><p>Pick two numbers. Which sign makes it true?</p>",
    check: {
      kind: "mc",
      q: "Oak Hill has 84,120 people and Pine Lake has 84,210. Which is true?",
      choices: [
        { id: "a", label: "84,120 &gt; 84,210" },
        { id: "b", label: "84,120 &lt; 84,210" },
        { id: "c", label: "84,120 = 84,210" },
      ],
      answer: "b",
      why: {
        a: "The ten-thousands and thousands are the same. Look at the hundreds next: 1 hundred is less than 2 hundreds.",
        c: "They have the same digits, but not in the same places. Compare the hundreds.",
      },
      explain:
        "The ten-thousands and thousands match. In the hundreds, 1 is less than 2, so 84,120 &lt; 84,210. Pine Lake has more people.",
    },
  },
  {
    title: "Put them in order",
    widget: wOrder,
    body: "<p>To put numbers in order, find the least one, then the least of the rest, and so on. Compare them place by place, starting with the number of digits.</p><p>Pick a set. Tap the numbers from least to greatest.</p>",
    check: {
      kind: "mc",
      stack: true,
      q: "Four towns have 45,600, 45,060, 46,500, and 40,560 people. Which list goes from least to greatest?",
      choices: [
        { id: "a", label: "40,560, 45,060, 45,600, 46,500" },
        { id: "b", label: "46,500, 45,600, 45,060, 40,560" },
        { id: "c", label: "40,560, 45,600, 45,060, 46,500" },
      ],
      answer: "a",
      why: {
        b: "That goes from greatest to least. Turn it around.",
        c: "45,060 and 45,600 have the same thousands. In the hundreds, 0 is less than 6, so 45,060 comes first.",
      },
      explain:
        "40,560 has the fewest thousands. 45,060 &lt; 45,600 because 0 hundreds is less than 6. 46,500 has the most thousands.",
    },
  },
];
