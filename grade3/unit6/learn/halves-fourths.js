/* Learn Measuring Length, Time, Liquid Volume, and Weight (Grade 3 Unit 6), chapter 1: Halves and fourths of an inch. Its
   widgets and steps; loaded by halves-fourths.html. */
/* A bar on a ruler that grows by `stepFourths` fourths of an inch at a time (2 for halves, 1 for fourths), up to 6 inches. */
const rulerWidget = (stepFourths, start) => (el) => {
  /* values.len: the bar's length in steps */
  const q = Q(el),
    values = { len: start };
  el.innerHTML = `<div class="wrow">${stepper("len", "Bar length")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const fourths = values.len * stepFourths;
    q("len").textContent = inchesText(fourths);
    q("f").innerHTML = inchRuler(7, { obj: { len: fourths } });
    q("r").innerHTML =
      `The bar ends ${whereItEnds(fourths)}: <b>${inches(fourths)} inch${fourths <= 4 ? "" : "es"}</b>.` +
      (stepFourths === 1 && fourths % 4 === 2
        ? `<br>${Math.floor(fourths / 4) ? Math.floor(fourths / 4) + " " : ""}2/4 is the same as ${inches(fourths)}: the middle mark is a half.`
        : "");
  };
  steppers(el, values, { len: [1, 24 / stepFourths] }, draw);
  draw();
};
/* the quick checks' figures */
const F = {
  half: inchRuler(5, { obj: { len: 14 } }),
  fourth: inchRuler(4, { obj: { len: 11 } }),
};
const STEPS = [
  {
    title: "Halves of an inch",
    widget: rulerWidget(2, 7),
    body: "<p>On a ruler, the long marks are inches. The middle mark between two inches is a half inch. A bar that ends at the middle mark between 3 and 4 is 3 1/2 inches long.</p><p>Make the bar longer or shorter, a half inch at a time.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "How long is the bar? Measure to the nearest half inch.",
      fig: F.half,
      answer: 3.5,
      unit: "inches",
      misc: [
        [3, "The bar goes past 3. Count the half inch after it too."],
        [3.25, "The middle mark between two inches is a half, not a fourth."],
      ],
      explain: "The bar ends halfway from 3 to 4: 3 1/2 inches.",
    },
  },
  {
    title: "Fourths of an inch",
    widget: rulerWidget(1, 9),
    body: "<p>The short marks cut each inch into 4 fourths. A bar that ends 3 fourths of the way from 2 to 3 is 2 3/4 inches long. 2 fourths is the half-inch mark.</p><p>Make the bar longer or shorter, a fourth of an inch at a time.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "How long is the bar? Measure to the nearest fourth of an inch.",
      fig: F.fourth,
      answer: 2.75,
      unit: "inches",
      misc: [
        [2, "The bar goes past 2. Count the fourths after it too."],
        [11, "That counts every little mark as an inch. There are 4 fourths in each inch."],
      ],
      explain: "The bar ends 3 fourths of the way from 2 to 3: 2 3/4 inches.",
    },
  },
];
