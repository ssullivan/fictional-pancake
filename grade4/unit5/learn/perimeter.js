/* Learn Multiplicative Comparison and Measurement (Grade 4 Unit 5), chapter 5: Perimeter. Its widgets and steps; loaded by perimeter.html. */
/* Change a rectangle's length and width (steppers): its perimeter, worked out two ways, and its area to compare. */
function wPerimeter(el) {
  /* the steppers' values: len and wid, the rectangle's sides in meters */
  const q = Q(el),
    values = { len: 6, wid: 4 },
    limits = { len: [1, 12], wid: [1, 8] };
  el.innerHTML =
    `<div class="wrow">${stepper("len", "Length")}${stepper("wid", "Width")}</div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { len, wid } = values,
      perimeter = 2 * (len + wid);
    q("len").textContent = len;
    q("wid").textContent = wid;
    q("f").innerHTML = rectFig(len, wid, { unit: "m" });
    q("e").innerHTML = `${len} + ${wid} + ${len} + ${wid} = ${perimeter}, or 2 × ${len} + 2 × ${wid} = ${perimeter}`;
    q("r").innerHTML =
      `The perimeter is the distance all the way around: <b>${perimeter} meters</b>.` +
      (len === wid ? ` All 4 sides are ${len} meters: it’s a square, so 4 × ${len} works too.` : "") +
      `<br><span class="dimline">The area is the squares inside: ${len} × ${wid} = ${len * wid} square meters. That’s a different measurement.</span>`;
  };
  steppers(el, values, limits, draw);
  draw();
}
/* perimeters to keep while the shape changes */
const PERIMETERS = [20, 24, 30];
/* Pick a perimeter and change the length (a stepper): the width is what's left of half the perimeter. */
function wMissing(el) {
  /* the stepper's value: len, the rectangle's length in meters */
  const q = Q(el),
    values = { len: 7 },
    limits = { len: [1, 9] };
  let perimeterIndex = 0;
  el.innerHTML =
    seg(
      "Perimeter",
      PERIMETERS.map((p, i) => [i, `${p} m`]),
    ) +
    `<div class="wrow">${stepper("len", "Length")}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const perimeter = PERIMETERS[perimeterIndex],
      half = perimeter / 2,
      len = values.len,
      wid = half - len;
    press(el, perimeterIndex);
    q("len").textContent = len;
    q("f").innerHTML = rectFig(len, wid, {
      unit: "m",
      label: `A rectangle ${len} by ${wid} m, perimeter ${perimeter} m`,
    });
    q("e").innerHTML = `${perimeter} ÷ 2 = ${half}, and ${half} − ${len} = ${wid}`;
    q("r").innerHTML =
      `One length and one width make half the perimeter: ${half} meters. So the width is ${half} − ${len} = <b>${wid} meters</b>.` +
      `<br><span class="dimline">Every rectangle with this perimeter has length + width = ${half}. The area changes: this one is ${len} × ${wid} = ${len * wid} square meters.</span>`;
  };
  /* a new perimeter: the length goes up to one less than half of it, so the width is at least 1 */
  const choosePerimeter = (i) => {
    perimeterIndex = i;
    limits.len[1] = PERIMETERS[i] / 2 - 1;
    values.len = Math.min(values.len, limits.len[1]);
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    choosePerimeter(+m);
    draw();
  });
  choosePerimeter(perimeterIndex);
  draw();
}
const STEPS = [
  {
    title: "Perimeter of a rectangle",
    widget: wPerimeter,
    body: "<p>The <b>perimeter</b> is the distance around a shape. A rectangle has two lengths and two widths, so its perimeter is length + width + length + width, or 2 × length + 2 × width.</p><p>Change the length and the width.</p>",
    check: {
      kind: "num",
      q: "A garden is 8 meters long and 3 meters wide. How many meters of fence go all the way around it?",
      answer: 22,
      unit: "meters",
      misc: [
        [24, "That’s 8 × 3, the area: the squares inside. The fence goes around the outside."],
        [11, "That’s only one length and one width. The fence goes around all 4 sides."],
      ],
      explain: "8 + 3 + 8 + 3 = 22 meters of fence.",
    },
  },
  {
    title: "Find a missing side",
    widget: wMissing,
    body: "<p>When you know the perimeter and one side, work backward. Half the perimeter is one length plus one width. Take away the side you know.</p><p>Pick a perimeter, then change the length.</p>",
    check: {
      kind: "num",
      q: "A rectangle has a perimeter of 30 centimeters. It is 9 centimeters long. How wide is it?",
      answer: 6,
      unit: "centimeters",
      misc: [
        [21, "That takes 9 from all 30. The perimeter has two lengths and two widths."],
        [12, "30 − 9 − 9 = 12 is both widths together. Each width is half of that."],
      ],
      explain: "Half the perimeter is 30 ÷ 2 = 15 centimeters, one length and one width. 15 − 9 = 6 centimeters wide.",
    },
  },
];
