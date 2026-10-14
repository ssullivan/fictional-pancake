/* Learn Two-dimensional Shapes and Perimeter (Grade 3 Unit 7), chapter 5: Find the perimeter. Its widgets and steps; loaded by
   find-perimeter.html. */
/* shapes to add up: [button, POLYS id, how many times bigger its side lengths are, the unit] */
const ADD_SHAPES = [
  ["Pentagon", "house", 1, "centimeters"],
  ["Trapezoid", "trapezoid", 2, "meters"],
  ["Hexagon", "lHexagon", 3, "inches"],
];
/* Add a shape's side lengths one at a time: the side added lights up, and the sum grows to the perimeter. */
function wAddSides(el) {
  /* added: how many sides, from the first, have been added */
  const q = Q(el);
  let shapeIndex = 0,
    added = 0;
  el.innerHTML =
    seg(
      "Shape",
      ADD_SHAPES.map(([button], i) => [i, button]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Add the next side</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const [, id, times, unit] = ADD_SHAPES[shapeIndex],
      pts = POLYS[id],
      lengths = sideLengths(pts).map((len) => len * times),
      sum = lengths.slice(0, added).reduce((total, len) => total + len, 0),
      done = added === lengths.length;
    press(el, shapeIndex);
    q("go").disabled = done;
    q("f").innerHTML = polySvg(pts, { lens: lengths.map(String), lit: added });
    q("e").textContent = added ? `${lengths.slice(0, added).join(" + ")}${added > 1 ? ` = ${sum}` : ""}` : "";
    q("r").innerHTML = done
      ? `<span class="ok">All ${lengths.length} sides: the perimeter is <b>${sum} ${unit}</b>.</span>`
      : added
        ? `${pl(added, "side")} of ${lengths.length} added. Keep going around.`
        : `The sides are in ${unit}. Add them one at a time, going around the shape.`;
  };
  q("go").onclick = () => {
    added++;
    draw();
  };
  q("clr").onclick = () => {
    added = 0;
    draw();
  };
  onPick(el, (id) => {
    shapeIndex = +id;
    added = 0;
    draw();
  });
  draw();
}
/* Change a rectangle's length and width (steppers): only two sides are written, but the sides across from them are the same. */
function wRectangle(el) {
  /* values.len, values.wid: the rectangle's sides in centimeters */
  const q = Q(el),
    values = { len: 6, wid: 3 };
  el.innerHTML =
    `<div class="wrow">${stepper("len", "Length")}${stepper("wid", "Width")}</div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { len, wid } = values,
      perimeter = 2 * (len + wid);
    q("len").textContent = len;
    q("wid").textContent = wid;
    q("f").innerHTML = rectFig(len, wid, { unit: "cm", grid: false });
    q("e").textContent = `${len} + ${wid} + ${len} + ${wid} = ${perimeter}`;
    q("r").innerHTML =
      len === wid
        ? `All 4 sides are ${len} cm: it’s a square, so 4 × ${len} = ${perimeter} works too. The perimeter is <b>${perimeter} centimeters</b>.`
        : `The side across from the ${len} cm side is ${len} cm too, and across from ${wid} cm is ${wid} cm. The perimeter is <b>${perimeter} centimeters</b>.`;
  };
  steppers(el, values, { len: [2, 12], wid: [1, 8] }, draw);
  draw();
}
/* shapes with a side to find: [button, POLYS id, the side marked ?] */
const MISSING = [
  ["Shape 1", "rightTrapezoid", 2],
  ["Shape 2", "house", 2],
  ["Shape 3", "scaleneTri", 1],
];
/* Guess the side marked ? (a stepper): add it to the sides you know, and compare the total with the perimeter. */
function wMissing(el) {
  /* values.guess: the length tried for the side marked ? */
  const q = Q(el),
    values = { guess: 1 };
  let shapeIndex = 0;
  el.innerHTML =
    seg(
      "Shape",
      MISSING.map(([button], i) => [i, button]),
    ) +
    `<div class="wrow">${stepper("guess", "Side marked ?")}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const [, id, ask] = MISSING[shapeIndex],
      pts = POLYS[id],
      lengths = sideLengths(pts),
      perimeter = lengths.reduce((total, len) => total + len, 0),
      known = lengths.filter((len, i) => i !== ask),
      knownSum = perimeter - lengths[ask],
      { guess } = values;
    press(el, shapeIndex);
    q("guess").textContent = guess;
    q("f").innerHTML = polySvg(pts, { lens: lengths.map((len, i) => (i === ask ? "?" : `${len}`)) });
    q("e").textContent = `${known.join(" + ")} + ${guess} = ${knownSum + guess}`;
    q("r").innerHTML =
      `The perimeter is <b>${perimeter} cm</b>. ` +
      (knownSum + guess < perimeter
        ? "That’s too short. Try a longer side."
        : knownSum + guess > perimeter
          ? "That’s too long. Try a shorter side."
          : `<span class="ok">That’s it: the side is <b>${guess} cm</b>.</span><br><span class="dimline">You can subtract too: the sides you know add to ${knownSum}, and ${perimeter} − ${knownSum} = ${guess}.</span>`);
  };
  steppers(el, values, { guess: [1, 20] }, draw);
  onPick(el, (id) => {
    shapeIndex = +id;
    values.guess = 1;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  pentagon: polySvg(POLYS.pentagon, { lens: lensOf(POLYS.pentagon), label: "A shape with sides 6, 4, 5, 5, and 4" }),
  rectangle: rectFig(9, 4, { unit: "m", grid: false }),
  triangle: polySvg(POLYS.isoTri2, { lens: ["12", "10", "?"], label: "A triangle with sides 12, 10, and ?" }),
};
const STEPS = [
  {
    title: "Add the sides",
    widget: wAddSides,
    body: "<p>To find the perimeter of a shape, add the lengths of all its sides. Go around the shape so you add each side once.</p><p>Pick a shape and add its sides.</p>",
    check: {
      kind: "num",
      q: "The sides are in meters. What is the perimeter of this shape?",
      fig: F.pentagon,
      answer: 24,
      unit: "meters",
      misc: [
        [20, "That leaves out a side. Add all 5 sides."],
        [5, "That counts the sides. Add their lengths."],
      ],
      explain: "6 + 4 + 5 + 5 + 4 = 24 meters.",
    },
  },
  {
    title: "Rectangles and squares",
    widget: wRectangle,
    body: "<p>A rectangle’s sides across from each other are the same length. So when only the length and the width are written, you still know all 4 sides: length + width + length + width. All 4 sides of a square are the same.</p><p>Change the length and the width.</p>",
    check: {
      kind: "num",
      q: "What is the perimeter of this rectangle?",
      fig: F.rectangle,
      answer: 26,
      unit: "meters",
      misc: [
        [13, "That’s one length and one width. A rectangle has 4 sides."],
        [36, "That’s 9 × 4, the area. The perimeter adds the sides."],
      ],
      explain: "9 + 4 + 9 + 4 = 26 meters.",
    },
  },
  {
    title: "Find a missing side",
    widget: wMissing,
    body: "<p>When you know the perimeter and all the sides but one, the missing side is what’s left. Add the sides you know, then see how much more makes the perimeter.</p><p>Pick a shape and try lengths for the side marked ?.</p>",
    check: {
      kind: "num",
      q: "This triangle’s perimeter is 32 centimeters. How long is the side marked ?",
      fig: F.triangle,
      answer: 10,
      unit: "centimeters",
      misc: [
        [22, "That adds the two sides you know. Take them away from 32."],
        [54, "That adds 32 too. Take the sides you know away from 32."],
      ],
      explain: "12 + 10 = 22, and 32 − 22 = 10 centimeters.",
    },
  },
];
