/* Learn Multiplying and Dividing Fractions (Grade 5 Unit 3), chapter 2: Multiply any fractions. Its widgets and steps;
   loaded by multiply.html. */
/* n/d, then its lowest terms when it simplifies (html) */
const simplest = (n, d) => {
  const g = gcd(n, d);
  return g === 1 ? fr(n, d) : d === g ? `${fr(n, d)} = ${n / g}` : `${fr(n, d)} = ${fr(n / g, d / g)}`;
};
/* the denominators to pick from */
const BOTTOMS = [2, 3, 4, 5, 6];
/* Build a/b × c/d: pick the two bottoms (two rows of buttons), then step the two tops. */
function wMultiply(el) {
  const q = Q(el),
    values = { first: 2, second: 3 },
    limits = { first: [1, 2], second: [1, 3] };
  let firstBottom = 3,
    secondBottom = 4;
  el.innerHTML =
    `<div data-top>${seg(
      "First bottom",
      BOTTOMS.map((d) => [d, `?/${d}`]),
    )}</div><div data-bot>${seg(
      "Second bottom",
      BOTTOMS.map((d) => [d, `× ?/${d}`]),
    )}</div>` +
    `<div class="wrow">${stepper("first", "First top")}${stepper("second", "Second top")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const a = values.first,
      c = values.second;
    press(q("top"), firstBottom);
    press(q("bot"), secondBottom);
    q("first").textContent = a;
    q("second").textContent = c;
    q("f").innerHTML = areaFig([a, firstBottom], [c, secondBottom], {
      under: true,
      label: `${a}/${firstBottom} of ${c}/${secondBottom} of a square`,
    });
    q("r").innerHTML =
      `The square is cut into ${firstBottom} × ${secondBottom} = ${firstBottom * secondBottom} pieces. The dark part is ${a} × ${c} = ${a * c} of them: ` +
      `<b>${fr(a, firstBottom)} × ${fr(c, secondBottom)} = ${simplest(a * c, firstBottom * secondBottom)}</b>.`;
  };
  /* a new bottom: its top goes up to one less, so the fraction stays less than 1 */
  const keepTops = () => {
    limits.first[1] = firstBottom - 1;
    limits.second[1] = secondBottom - 1;
    values.first = Math.min(values.first, firstBottom - 1);
    values.second = Math.min(values.second, secondBottom - 1);
  };
  steppers(el, values, limits, draw);
  el.addEventListener("click", (e) => {
    const hit = segHit(e, ["top", "bot"]);
    if (!hit) return;
    if (hit[0] === "top") firstBottom = +hit[1];
    else secondBottom = +hit[1];
    keepTops();
    draw();
  });
  keepTops();
  draw();
}
/* stories that multiply two fractions: [button, the story, a, b, c, d (a/b of c/d), what the answer is] */
const PRODUCT_STORIES = [
  ["Tulips", "3/4 of a garden bed is planted. 2/3 of the planted part is tulips.", 2, 3, 3, 4, "of the bed is tulips"],
  ["Path", "A garden path is 4/5 mile long. 1/2 of it is paved.", 1, 2, 4, 5, "mile is paved"],
  [
    "Cornbread",
    "2/3 of a pan of cornbread is left. Mai eats 1/4 of what’s left.",
    1,
    4,
    2,
    3,
    "of the pan is what Mai eats",
  ],
];
/* Pick a story that takes a fraction of a fraction, and see it on a square. */
function wStories(el) {
  const q = Q(el);
  let storyIndex = 0;
  el.innerHTML =
    seg(
      "Story",
      PRODUCT_STORIES.map(([button], i) => [i, button]),
    ) + `<p class="story" data-s></p><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [, story, a, b, c, d, what] = PRODUCT_STORIES[storyIndex],
      /* the answer in lowest terms */
      common = gcd(a * c, b * d);
    press(el, storyIndex);
    q("s").innerHTML = story;
    q("f").innerHTML = areaFig([a, b], [c, d], { under: true, label: `${a}/${b} of ${c}/${d}` });
    q("r").innerHTML =
      `${fr(a, b)} of ${fr(c, d)} is ${fr(a, b)} × ${fr(c, d)} = ${simplest(a * c, b * d)}: <b>${fr((a * c) / common, (b * d) / common)} ${what}</b>.`;
  };
  onPick(el, (m) => {
    storyIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Tops times tops, bottoms times bottoms",
    widget: wMultiply,
    body: "<p>To find 2/3 of 3/4, shade 3/4 of a square as a strip, then take 2/3 of it. The square is cut into 3 × 4 = 12 pieces, and the dark part is 2 × 3 = 6 of them. So <b>a/b × c/d = (a × c)/(b × d)</b>.</p><p>Pick the bottoms, then change the tops.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "What is 3/5 × 1/2?",
      fig: areaFig([3, 5], [1, 2], { under: true, label: "3/5 of 1/2 of a square" }),
      answer: 3 / 10,
      unit: "",
      misc: [
        [4 / 7, "That adds the tops and the bottoms. Multiply them: (3 × 1)/(5 × 2)."],
        [1 / 2, "That’s all of 1/2. Take 3/5 of it."],
      ],
      explain: "3/5 × 1/2 = (3 × 1)/(5 × 2) = 3/10.",
    },
  },
  {
    title: "Fraction of a fraction stories",
    widget: wStories,
    body: "<p>When a story takes a fraction <b>of</b> an amount that’s already a fraction, multiply. The answer is less than the amount you started with, since you take only part of it.</p><p>Pick a story.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "A watering can holds 3/4 gallon. A plant gets 1/3 of the can. How many gallons does the plant get?",
      answer: 1 / 4,
      unit: "gallon",
      misc: [
        [3 / 4, "That’s the whole can. The plant gets 1/3 of it."],
        [4 / 7, "That adds the tops and the bottoms. Multiply: 1/3 × 3/4."],
      ],
      explain: "1/3 × 3/4 = (1 × 3)/(3 × 4) = 3/12 = 1/4 gallon.",
    },
  },
];
