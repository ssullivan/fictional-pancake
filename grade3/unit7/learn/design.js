/* Learn Two-dimensional Shapes and Perimeter (Grade 3 Unit 7), chapter 7: Design with perimeter and area. Its widgets and steps;
   loaded by design.html. */
/* L-shaped figures (in meters): a rectangle wide × tall with a corner cutWide × cutTall cut away, which corner, and the two
   sides marked ? (numbered as lFig numbers them: 0 top, 1 the cut's up-down side, 2 the cut's across side, 3 right, 4 bottom,
   5 left) */
const FIGURES = [
  { button: "Figure 1", wide: 8, tall: 6, cutWide: 3, cutTall: 2, corner: "tr", hidden: [0, 3] },
  { button: "Figure 2", wide: 9, tall: 7, cutWide: 4, cutTall: 3, corner: "tl", hidden: [2, 5] },
];
/* a figure's sides in lFig's order: [top, the cut's up-down side, the cut's across side, right, bottom, left] */
const sidesOf = ({ wide, tall, cutWide, cutTall }) => [wide - cutWide, cutTall, cutWide, tall - cutTall, wide, tall];
/* how a side is found from two others: the whole side across from it and the other part on that side (sides 4 and 5 are
   the two parts put together) */
const PARTS = { 0: [4, 2], 2: [4, 0], 4: [0, 2], 1: [5, 3], 3: [5, 1], 5: [1, 3] };
/* "8 − 3 = 5", or "3 + 4 = 7" for a whole side */
function findSide(sides, i) {
  const [a, b] = PARTS[i];
  return i >= 4 ? `${sides[a]} + ${sides[b]} = ${sides[i]}` : `${sides[a]} − ${sides[b]} = ${sides[i]}`;
}
/* Find the perimeter of an L-shaped figure a step at a time: find each side marked ?, then add all 6 sides. */
function wFigure(el) {
  /* made: how many steps are done (1 and 2 find the sides marked ?, 3 adds them all) */
  const q = Q(el);
  let figureIndex = 0,
    made = 0;
  el.innerHTML =
    seg(
      "Figure",
      FIGURES.map((figure, i) => [i, figure.button]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Next step</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const figure = FIGURES[figureIndex],
      sides = sidesOf(figure),
      perimeter = 2 * (figure.wide + figure.tall),
      found = figure.hidden.slice(0, Math.min(made, 2)),
      texts = sides.map((side, i) => (figure.hidden.includes(i) && !found.includes(i) ? "?" : `${side}`)),
      lines = [
        ...found.map(
          (i) =>
            `${i % 2 === 0 ? "Across" : "Up and down"}: ${findSide(sides, i)}. The side marked ? is ${sides[i]} meters.`,
        ),
        ...(made === 3
          ? [
              `<span class="ok">${sides.join(" + ")} = ${perimeter}. The perimeter is <b>${perimeter} meters</b>.</span>`,
            ]
          : []),
      ];
    press(el, figureIndex);
    q("go").disabled = made === 3;
    q("f").innerHTML = lFig(figure.wide, figure.tall, figure.cutWide, figure.cutTall, {
      corner: figure.corner,
      sides: texts,
    });
    q("r").innerHTML = made
      ? lines.join("<br>")
      : "The sides are in meters. Two sides are marked ?. Find them first, then add all 6 sides.";
  };
  q("go").onclick = () => {
    made++;
    draw();
  };
  q("clr").onclick = () => {
    made = 0;
    draw();
  };
  onPick(el, (id) => {
    figureIndex = +id;
    made = 0;
    draw();
  });
  draw();
}
/* robot parts to build: [button, the area and the perimeter it needs] */
const ROBOT = [
  ["Body", 12, 14],
  ["Head", 9, 12],
  ["Arm", 6, 14],
];
/* Build a robot part (steppers for the length and width): it fits when both its area and its perimeter are right. */
function wRobot(el) {
  /* values.len, values.wid: the rectangle's sides in units */
  const q = Q(el),
    values = { len: 4, wid: 2 };
  let partIndex = 0;
  el.innerHTML =
    seg(
      "Part",
      ROBOT.map(([button], i) => [i, button]),
    ) +
    `<div class="wrow">${stepper("len", "Length")}${stepper("wid", "Width")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [part, needArea, needPerimeter] = ROBOT[partIndex],
      { len, wid } = values,
      area = len * wid,
      perimeter = 2 * (len + wid),
      areaFits = area === needArea,
      perimeterFits = perimeter === needPerimeter;
    press(el, partIndex);
    q("len").textContent = len;
    q("wid").textContent = wid;
    q("f").innerHTML = rectFig(len, wid);
    q("r").innerHTML =
      `The ${part.toLowerCase()} needs an area of ${needArea} square units and a perimeter of ${needPerimeter} units.<br>` +
      `Area: ${len} × ${wid} = <b>${area}</b> ${areaFits ? "✓" : "✗"}. Perimeter: ${len} + ${wid} + ${len} + ${wid} = <b>${perimeter}</b> ${perimeterFits ? "✓" : "✗"}.<br>` +
      (areaFits && perimeterFits
        ? `<span class="ok">It fits! That’s the robot’s ${part.toLowerCase()}.</span>`
        : areaFits
          ? `<span class="dimline">The area is right. Try another rectangle with the same area.</span>`
          : perimeterFits
            ? `<span class="dimline">The perimeter is right. Try another rectangle with the same perimeter.</span>`
            : `<span class="dimline">Change the length and the width.</span>`);
  };
  steppers(el, values, { len: [1, 12], wid: [1, 8] }, draw);
  onPick(el, (id) => {
    partIndex = +id;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  figure: lFig(7, 5, 3, 2, { sides: ["4", "2", "3", "?", "7", "5"] }),
};
const STEPS = [
  {
    title: "Figures made of rectangles",
    widget: wFigure,
    body: "<p>A figure made of rectangles can have sides that aren’t written. Find them from the sides across from them: the long side is the two short sides put together. Then add all the sides for the perimeter.</p><p>Pick a figure and work it out a step at a time.</p>",
    check: {
      kind: "num",
      q: "The sides are in feet. What is the perimeter of this figure?",
      fig: F.figure,
      answer: 24,
      unit: "feet",
      misc: [
        [21, "That leaves out the side marked ?. It’s 5 − 2 = 3 feet."],
        [29, "That’s the area. The perimeter is the distance around."],
      ],
      explain: "The side marked ? is 5 − 2 = 3 feet. 4 + 2 + 3 + 3 + 7 + 5 = 24 feet.",
    },
  },
  {
    title: "Design a robot",
    widget: wRobot,
    body: "<p>Designers often need a shape with a certain area and a certain perimeter. Rectangles with the same area can have different perimeters, so check both.</p><p>Pick a robot part, then change the length and the width until it fits.</p>",
    check: {
      kind: "mc",
      q: "A robot’s screen is a rectangle with an area of 8 square units and a perimeter of 12 units. Which rectangle is it?",
      choices: [
        { id: "a", label: "2 by 4" },
        { id: "b", label: "1 by 8" },
        { id: "c", label: "3 by 3" },
      ],
      answer: "a",
      why: {
        b: "1 by 8 has an area of 8, but its perimeter is 18 units.",
        c: "3 by 3 has a perimeter of 12, but its area is 9 square units.",
      },
      explain: "2 × 4 = 8 square units, and 2 + 4 + 2 + 4 = 12 units.",
    },
  },
];
