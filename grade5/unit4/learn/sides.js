/* Learn Wrapping Up Multiplication and Division with Multi-digit Numbers (Grade 5 Unit 4), chapter 5: Missing side lengths.
   Its widgets and steps; loaded by sides.html. */
/* rectangles with a missing side: [area, the side we know, the partial quotients for area ÷ side] */
const FLOORS = [
  [864, 24, [30, 6]],
  [1250, 25, [50]],
  [1092, 12, [90, 1]],
];
/* Pick a rectangle: divide its area by the side you know to find the other side. */
function wSide(el) {
  const q = Q(el);
  let floorIndex = 0;
  el.innerHTML =
    seg(
      "Area",
      FLOORS.map(([area, side], i) => [i, `${commas(area)} sq ft`]),
    ) + `<div class="fig" data-f></div><div class="fig" data-g></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [area, side, chunks] = FLOORS[floorIndex],
      other = area / side;
    press(el, floorIndex);
    q("f").innerHTML = rectFig(other, side, { unit: "ft", ask: "length", grid: false });
    q("g").innerHTML = quotientFig(area, side, chunks);
    q("r").innerHTML =
      `${side} × ? = ${commas(area)}, so divide: ${commas(area)} ÷ ${side} = ${other}. <b>The other side is ${other} feet.</b>`;
  };
  onPick(el, (m) => {
    floorIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Divide the area by a side",
    widget: wSide,
    body: "<p>A rectangle’s area is length × width. When you know the area and one side, the other side is a missing factor: <b>divide the area by the side you know</b>.</p><p>Pick a rectangle.</p>",
    check: {
      kind: "num",
      q: "A rectangular dance floor has an area of 1,350 square feet. One side is 25 feet long. How long is the other side?",
      answer: 54,
      unit: "feet",
      misc: [
        [1325, "That subtracts. Area = length × width, so divide: 1,350 ÷ 25."],
        [33750, "That multiplies. The area is already the product: divide by 25."],
      ],
      explain: "1,350 ÷ 25 = 54, since 25 × 54 = 1,350. The other side is 54 feet.",
    },
  },
];
