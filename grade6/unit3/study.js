/* The Unit 3 study guide (study.html): its diagrams. Each <figure data-fig="name"> in the page gets the picture FIGURES[name]
   draws, with shared/study.js's Diagram, doubleLine, and partsTape: laid out in units with y going up, and drawn as inline
   SVG with the classes styled in shared/study.css (sh a shaded tenth, bx an empty one, lb a label, …). Nothing else uses
   this file. */

/* a tape of 10 tenths of a whole (shared/study.js's partsTape), the first `shaded` of them shaded, with the percent under the
   tape's start, the shading's end, and its end; options as partsTape's */
const tenthsBar = (shaded, label, options) =>
  partsTape(10, shaded, label, {
    marks: [0, shaded, 10].map((tenths) => [tenths, `${tenths * 10}%`]),
    ...options,
  });

/* the ticks of a double number line from 0% to `top` percent, one every `step` percent: [percent, amount, "percent%"], with
   amounts from amountOf(percent) (null for none, "_" for a box to fill in). labelled: the percents written under their ticks
   (all of them when it's left out). */
const percentTicks = (top, step, amountOf, labelled = null) =>
  Array.from({ length: top / step + 1 }, (_, i) => {
    const percent = i * step;
    return [percent, amountOf(percent), !labelled || labelled.includes(percent) ? `${percent}%` : null];
  });

const FIGURES = {
  /* Part A: converting units */
  yards: () =>
    doubleLine(
      ["yards", "feet"],
      [
        [0, "0", "0"],
        [1, "1", "3"],
        [2, "2", "6"],
        [3, "3", "9"],
        [4, "4", "12"],
      ],
      "A double number line: 1, 2, 3, and 4 yards on top line up with 3, 6, 9, and 12 feet below",
      { hl: [4] },
    ),

  /* Part C: speed and pace */
  bike: () =>
    doubleLine(
      ["miles", "minutes"],
      [
        [0, "0", "0"],
        [1, "1", "4"],
        [12, "12", "48"],
        [20, "20", "80"],
      ],
      "A double number line: 12 miles in 48 minutes, so 1 mile in 4 minutes and 20 miles in 80 minutes",
      { hl: [1, 20] },
    ),

  /* Part D: percentages */
  tank: () =>
    doubleLine(
      ["liters", "percent"],
      percentTicks(100, 10, (percent) => ({ 0: "0", 10: "8", 30: "24", 100: "80" })[percent] ?? null, [0, 10, 30, 100]),
      "A double number line: 80 liters is 100%, so 8 liters is 10% and 24 liters is 30%",
      { hl: [10, 30] },
    ),
  trail: () =>
    doubleLine(
      ["kilometers", "percent"],
      percentTicks(150, 25, (percent) => ({ 0: "0", 75: null, 100: "12", 125: null })[percent] ?? "_"),
      "A double number line: 12 kilometers is 100%; boxes to fill in at 25%, 50%, and 150%",
      { length: 7.5, scale: 38 },
    ),
  tank70: () =>
    tenthsBar(7, "A tape of 10 tenths, 7 of them shaded, for 70% of a 40-liter tank", {
      part: "? liters",
      whole: "40 liters",
    }),

  /* Part F: part, whole, or percent */
  wholeExample: () =>
    tenthsBar(
      6,
      "A tape of 10 tenths, 6 of them shaded, holding 15 liters: 2.5 liters in each tenth, 25 liters in all",
      {
        each: "2.5",
        part: "15 liters",
        whole: "25 liters",
        hl: true,
      },
    ),

  /* the practice test */
  test8: () =>
    doubleLine(
      ["dollars", "percent"],
      percentTicks(100, 25, (percent) => ({ 0: "0", 100: "40" })[percent] ?? "_"),
      "A double number line: 40 dollars is 100%; boxes to fill in at 25%, 50%, and 75%",
      { length: 7, scale: 38 },
    ),
  test15: () =>
    tenthsBar(4, "A tape of 10 tenths, 4 of them shaded, holding 18", {
      part: "18",
      whole: "?",
    }),
};

/* draw each diagram into its placeholder */
document.querySelectorAll("[data-fig]").forEach((el) => {
  el.insertAdjacentHTML("afterbegin", FIGURES[el.dataset.fig]());
});
