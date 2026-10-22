/* Learn Measuring Circles (Grade 7 Unit 3), chapter 4: The area of a circle. Its widgets and steps; loaded by area.html. */
/* Slide the number of wedges: the more there are, the more the laid-out wedges look like a parallelogram πr by r. */
function wWedges(el) {
  const q = Q(el);
  el.innerHTML =
    `<div class="wrow"><label class="slider">Wedges <input type="range" min="1" max="8" value="2" data-s><b data-sv></b></label></div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const n = 4 * +q("s").value;
    q("sv").textContent = n;
    q("f").innerHTML = wedgeFig(n);
    q("r").innerHTML =
      `${n} wedges. ${n < 16 ? "The edges are still bumpy." : "The edges are nearly straight."} ` +
      `The shape is half the circumference long (πr) and a radius tall (r), so its area is πr × r = <b>πr²</b>.`;
  };
  q("s").addEventListener("input", draw);
  draw();
}

/* Change the radius: the area is π times the radius times itself. */
function wArea(el) {
  const q = Q(el),
    values = { radius: 3 };
  el.innerHTML = `<div class="wrow">${stepper("radius", "Radius (cm)")}</div><div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { radius: r } = values;
    q("radius").textContent = r;
    q("f").innerHTML = circleFig({
      size: 60 + r * 16,
      segs: ["radius"],
      labels: { radius: `${r} cm` },
      label: `A circle with radius ${r} cm`,
    });
    q("e").textContent = `A = π × ${r} × ${r} = ${piText(r * r, "square cm")}`;
    q("r").innerHTML =
      `The area is <b>${piText(r * r, "square cm")}</b>, about 3.14 × ${r * r} = ${fmt(3.14 * r * r)} square cm. ` +
      `Doubling the radius makes the area 4 times as big.`;
  };
  steppers(el, values, { radius: [1, 8] }, draw);
  draw();
}

/* circumferences to find the area from, as the number in front of π */
const FROM_C = [8, 20, 6];
/* Pick a circumference: find the diameter, halve it for the radius, then square the radius. */
function wFromC(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Circumference",
      FROM_C.map((c, i) => [i, `C = ${c}π`]),
    ) + `<p class="readout" data-r></p>`;
  const draw = (index) => {
    const d = FROM_C[index],
      r = d / 2;
    press(el, index);
    q("r").innerHTML =
      `C = ${d}π, so the diameter is ${d} and the radius is ${fmt(r)}. ` +
      `A = π × ${fmt(r)} × ${fmt(r)} = <b>${piText(r * r)}</b>.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "Cut into wedges",
    widget: wWedges,
    body: "<p>Cut a circle into wedges like a pizza and lay them out, points up and down. Half the edge is on top and half on the bottom, so the shape is about <b>half the circumference long</b>, πr, and <b>one radius tall</b>, r. The thinner the wedges, the closer it is to a parallelogram.</p><p>Slide the number of wedges.</p>",
    check: {
      kind: "num",
      q: "A circle with a radius of 5 cm is cut into wedges and laid out like a parallelogram about 5π cm long and 5 cm tall. What is its area, in terms of π?",
      answer: 25,
      unit: "π square cm",
      misc: [
        [10, "That’s the circumference, 2πr. The area is the long side times the height: 5π × 5."],
        [50, "The shape is 5π long, half the circumference, not 10π."],
      ],
      explain: "5π × 5 = 25π square cm: π times the radius times itself.",
    },
  },
  {
    title: "A = πr²",
    widget: wArea,
    body: "<p>So the area of a circle is <b>A = πr²</b>: π times the radius times the radius. Use the radius, not the diameter.</p><p>Change the radius.</p>",
    check: {
      kind: "num",
      q: "A pizza is 12 inches across. What is its area, in terms of π?",
      answer: 36,
      unit: "π square inches",
      misc: [
        [144, "That squares the diameter. Use the radius, 6 inches."],
        [12, "That’s the circumference, πd. The area is πr²."],
        [72, "That’s π × 12 × 6. Use the radius twice: π × 6 × 6."],
      ],
      explain: "The radius is 6 inches, so A = π × 6 × 6 = 36π square inches.",
    },
  },
  {
    title: "Area from the circumference",
    widget: wFromC,
    body: "<p>When you know the circumference, go back to the diameter first, then halve it for the radius. Then square the radius.</p><p>Pick a circumference.</p>",
    check: {
      kind: "num",
      q: "A circle’s circumference is 8π cm. What is its area, in terms of π?",
      answer: 16,
      unit: "π square cm",
      misc: [
        [64, "8 is the diameter. Square the radius, 4."],
        [8, "That’s the circumference again. Find the radius, 4, and square it."],
      ],
      explain: "C = 8π, so the diameter is 8 cm and the radius 4 cm: A = π × 4 × 4 = 16π square cm.",
    },
  },
];
