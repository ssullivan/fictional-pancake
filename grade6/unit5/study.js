/* The Unit 5 study guide (study.html): its diagrams. Each <figure data-fig="name"> in the page gets the picture FIGURES[name]
   draws, with shared/study.js's Diagram: laid out in units with y going up, and drawn as inline SVG with the classes styled
   in shared/study.css (sh a shaded part, g grid lines, out an outline, lb a label, …). Column work (adding, dividing) is
   HTML in the page. Nothing else uses this file. */

/* A 1-by-1 square cut into 100 hundredths, with a rectangle `tenthsWide` tenths by `tenthsTall` tenths shaded in its lower
   left corner and its sides labelled (widthWords under it, heightWords to its left); the square's side is `unit` long. */
function hundredthsGrid(tenthsWide, tenthsTall, label, [widthWords, heightWords], { unit = "1 m", scale = 170 } = {}) {
  const width = tenthsWide / 10,
    height = tenthsTall / 10,
    d = new Diagram(0, 1, 0, 1, scale, { pad: 30, label, left: 34, right: 34 });
  d.box(0, 0, width, height);
  for (let i = 1; i < 10; i++) d.line([i / 10, 0], [i / 10, 1], "g").line([0, i / 10], [1, i / 10], "g");
  d.box(0, 0, 1, 1, "out").box(0, 0, width, height, "out");
  return d
    .text([width / 2, 0], widthWords, { dy: 18, cls: "lb hl" })
    .text([0, height / 2], heightWords, { dx: -8, dy: 5, cls: "lb hl", anchor: "end" })
    .text([0.5, 1], unit, { dy: -8, cls: "lb sm" })
    .text([1, 0.5], unit, { dx: 8, dy: 5, cls: "lb sm", anchor: "start" })
    .svg();
}

/* An area diagram of a product split into parts side by side: one rectangle for each [width, topWords, insideWords] in parts
   (widths in units, topWords over it, insideWords in it), all `height` units tall with heightWords on the left. */
function splitArea(parts, height, heightWords, label, { scale = 60 } = {}) {
  const total = parts.reduce((sum, [width]) => sum + width, 0),
    d = new Diagram(0, total, 0, height, scale, { pad: 28, label, left: 44 });
  let left = 0;
  parts.forEach(([width, topWords, insideWords], i) => {
    d.box(left, 0, width, height, i % 2 ? "sh2" : "sh")
      .text([left + width / 2, height], topWords, { dy: -8, cls: "lb sm" })
      .text([left + width / 2, height / 2], insideWords, { dy: 5 });
    left += width;
  });
  return d.text([0, height / 2], heightWords, { dx: -8, dy: 5, cls: "lb sm", anchor: "end" }).svg();
}

const FIGURES = {
  /* Part B: where the decimal point goes */
  grid32: () =>
    hundredthsGrid(
      3,
      2,
      "A square cut into 100 hundredths, with a rectangle 0.3 wide and 0.2 tall shaded: 6 hundredths",
      ["0.3", "0.2"],
      { unit: "1" },
    ),

  /* Part C: area diagrams and grids */
  grapes: () =>
    splitArea(
      [
        [2, "1 lb", "$2.40"],
        [1, "0.5 lb", "$1.20"],
      ],
      1.5,
      "$2.40",
      "An area diagram: $2.40 a pound times 1.5 pounds, split into 1 pound ($2.40) and 0.5 pound ($1.20)",
      { scale: 64 },
    ),
  grid47: () =>
    hundredthsGrid(4, 7, "A meter square cut into 100 hundredths, with a rectangle 0.4 m wide and 0.7 m tall shaded", [
      "0.4 m",
      "0.7 m",
    ]),

  /* the practice test */
  test6: () =>
    hundredthsGrid(5, 8, "A meter square cut into 100 hundredths, with a rectangle 0.5 m wide and 0.8 m tall shaded", [
      "0.5 m",
      "0.8 m",
    ]),
};

/* draw each diagram into its placeholder */
document.querySelectorAll("[data-fig]").forEach((el) => {
  el.insertAdjacentHTML("afterbegin", FIGURES[el.dataset.fig]());
});
