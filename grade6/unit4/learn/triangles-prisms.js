/* Learn Dividing Fractions (Grade 6 Unit 4), chapter 7: Triangles and prisms. Its widgets and steps; loaded by triangles-prisms.html. */
/* a triangle with base b and height h (in cm), drawn to scale (44 pixels a cm) with the height dashed */
function triFig(b, h) {
  /* apexX: the top corner, 35% of the way along the base */
  const scale = 44,
    left = 60,
    top = 14,
    baseW = fVal(b) * scale,
    height = fVal(h) * scale,
    apexX = left + baseW * 0.35;
  return svgWrap(
    left + 5 * scale + 30,
    top + 4 * scale + 44,
    `<polygon points="${left},${top + height} ${left + baseW},${top + height} ${apexX},${top}" class="rg-out" style="fill:rgba(255,201,60,.35)"/><line class="tri-h" x1="${apexX}" y1="${top}" x2="${apexX}" y2="${top + height}"/><rect class="tri-sq" x="${apexX}" y="${top + height - 10}" width="10" height="10"/>` +
      fT(left + baseW / 2, top + height + 24, b, { unit: "cm" }) +
      fT(apexX - 36, top + height / 2, h, { unit: "cm" }),
    `A triangle with base ${ftx(b)} cm and height ${ftx(h)} cm`,
  );
}
/* A triangle's area (a stepper for the base and the height, in half centimeters). */
function wTri(el) {
  /* the steppers' values: b and h, in half centimeters */
  const q = Q(el),
    values = { b: 9, h: 6 };
  el.innerHTML = `<div class="wrow">${stepper("b", "Base")}${stepper("h", "Height")}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const b = frac(values.b, 2),
      h = frac(values.h, 2),
      A = fMul(frac(1, 2), fMul(b, h));
    q("b").innerHTML = `${fx(b)} cm`;
    q("h").innerHTML = `${fx(h)} cm`;
    q("f").innerHTML = triFig(b, h);
    q("e").innerHTML = `${fr(1, 2)} × ${fx(b)} × ${fx(h)} = ${fx(A)}`;
    q("r").innerHTML =
      `Area = ${fr(1, 2)} × base × height = ${fr(1, 2)} × ${fim(b)} × ${fim(h)} = <b>${fx(A)} square cm</b>.` +
      `<br><span class="dimline">Going the other way: if you know the area and the base, double the area and divide by the base to get the height. ${fx(fMul(frac(2), A))} ÷ ${fx(b)} = ${fx(h)}.</span>`;
  };
  steppers(el, values, { b: [1, 10], h: [1, 8] }, draw);
  draw();
}

/* small cube edges: 1/2, 1/3, or 1/4 inch */
const SMALL = [2, 3, 4];
/* Small cubes with a fractional edge filling a bigger cube (a stepper sets the big cube's edge). */
function wCubes(el) {
  /* the stepper's value: e, the big cube's edge in inches; perInch: small cubes along an inch */
  const q = Q(el),
    values = { e: 1 };
  let perInch = 2;
  el.innerHTML =
    seg(
      "Small cube edge",
      SMALL.map((v) => [v, `${fr(1, v)} inch`]),
    ) +
    `<div class="wrow">${stepper("e", "Big cube edge")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { e: edge } = values,
      alongEdge = edge * perInch,
      count = alongEdge ** 3;
    press(el, perInch);
    q("e").textContent = `${edge} in`;
    q("f").innerHTML = cubeBox(frac(edge), frac(edge), frac(edge), perInch, {
      label: `A cube ${edge} inch${edge > 1 ? "es" : ""} on an edge filled with cubes ${fr(1, perInch).replace(/<[^>]*>/g, "")} inch on an edge`,
    });
    q("r").innerHTML =
      `${perInch} small cubes fit along each inch, so ${edge} × ${perInch} = ${alongEdge} fit along each edge, and ${alongEdge} × ${alongEdge} × ${alongEdge} = <b>${count} small cubes</b> fill the big cube.` +
      `<br>Each small cube is ${fr(1, perInch)} × ${fr(1, perInch)} × ${fr(1, perInch)} = ${fr(1, perInch ** 3)} cubic inch, so the volume is ${count} × ${fr(1, perInch ** 3)} = <b>${edge ** 3} cubic inch${edge > 1 ? "es" : ""}</b>, the same as ${edge} × ${edge} × ${edge}.`;
  };
  steppers(el, values, { e: [1, 3] }, draw);
  onPick(el, (id) => {
    perInch = +id;
    draw();
  });
  draw();
}

/* A box measured in half inches (a stepper for each edge): count the 1/2-inch cubes, then find the volume. */
function wPrism(el) {
  /* the steppers' values: l, w, and h in half inches */
  const q = Q(el),
    values = { l: 3, w: 2, h: 5 };
  el.innerHTML = `<div class="wrow">${stepper("l", "Length")}${stepper("w", "Width")}${stepper("h", "Height")}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const l = frac(values.l, 2),
      w = frac(values.w, 2),
      h = frac(values.h, 2),
      cubes = values.l * values.w * values.h,
      V = frac(cubes, 8);
    q("l").innerHTML = fx(l);
    q("w").innerHTML = fx(w);
    q("h").innerHTML = fx(h);
    q("f").innerHTML = cubeBox(l, w, h, 2);
    q("e").innerHTML = `${fx(l)} × ${fx(w)} × ${fx(h)} = ${fx(V)}`;
    q("r").innerHTML =
      `${values.l} × ${values.w} × ${values.h} = ${cubes} cube${cubes > 1 ? "s" : ""}, each ${fr(1, 2)} inch on an edge and ${fr(1, 8)} cubic inch: ${cubes} × ${fr(1, 8)} = <b>${fx(V)} cubic inch${fVal(V) > 1 ? "es" : ""}</b>.` +
      `<br><span class="dimline">Length × width × height gives the same volume, with fractional edges too. If you know the volume and two edges, divide to find the third.</span>`;
  };
  steppers(el, values, { l: [1, 8], w: [1, 6], h: [1, 6] }, draw);
  draw();
}

const STEPS = [
  {
    title: "Triangles with fractional sides",
    widget: wTri,
    body:
      "<p>The area of a triangle is " +
      fr(1, 2) +
      " × base × height, whether the lengths are whole numbers or fractions. A triangle with base 4 " +
      fr(1, 2) +
      " cm and height 3 cm has area " +
      fr(1, 2) +
      " × " +
      fr(9, 2) +
      " × 3 = " +
      fr(27, 4) +
      " = 6 " +
      fr(3, 4) +
      " square cm.</p><p>Change the base and the height.</p>",
    check: {
      kind: "num",
      unit: "cm",
      answer: 3,
      frac: true,
      q:
        "A triangle has an area of 7 " +
        fr(7, 8) +
        " square cm and a base of 5 " +
        fr(1, 4) +
        " cm. What is its height?",
      misc: [
        [
          1.5,
          "That forgets the " +
            fr(1, 2) +
            ": base × height is twice the area. Double the area first: 15 " +
            fr(3, 4) +
            " ÷ 5 " +
            fr(1, 4) +
            ".",
        ],
        [20.67, "That multiplies. You know the area and the base: divide."],
        [0.33, "That’s 5 " + fr(1, 4) + " ÷ 15 " + fr(3, 4) + ". Divide twice the area by the base."],
      ],
      explain:
        "Base × height = 2 × 7 " +
        fr(7, 8) +
        " = 15 " +
        fr(3, 4) +
        ", and 15 " +
        fr(3, 4) +
        " ÷ 5 " +
        fr(1, 4) +
        " = " +
        fr(63, 4) +
        " × " +
        fr(4, 21) +
        " = 3 cm. Check: " +
        fr(1, 2) +
        " × 5 " +
        fr(1, 4) +
        " × 3 = 7 " +
        fr(7, 8) +
        ".",
    },
  },
  {
    title: "Cubes with fractional edges",
    widget: wCubes,
    body:
      "<p>8 cubes with " +
      fr(1, 2) +
      "-inch edges fill a 1-inch cube (2 × 2 × 2), so each is " +
      fr(1, 8) +
      " cubic inch. Smaller cubes fill it with more pieces: 27 of " +
      fr(1, 3) +
      " inch, 64 of " +
      fr(1, 4) +
      " inch.</p><p>Pick a small cube and change the size of the big cube.</p>",
    check: {
      kind: "num",
      unit: "cubes",
      answer: 512,
      q:
        "Clare builds a cube with 4-inch edges out of little cubes with " +
        fr(1, 2) +
        "-inch edges. How many little cubes does Clare need?",
      misc: [
        [8, "That’s how many fit along one edge. Fill the whole cube: 8 × 8 × 8."],
        [
          64,
          "That’s the volume, 4 × 4 × 4 cubic inches. Each little cube is only " +
            fr(1, 8) +
            " cubic inch, so it takes 8 of them per cubic inch.",
        ],
        [128, "That uses 2 cubes per inch on only one edge. Every edge holds 8 little cubes."],
      ],
      explain:
        "8 little cubes fit along each 4-inch edge, so 8 × 8 × 8 = 512. (64 cubic inches × 8 per cubic inch = 512.)",
    },
  },
  {
    title: "Volume of a box",
    widget: wPrism,
    body:
      "<p>The volume of a rectangular prism is length × width × height, even with fractional edges. A box 1 " +
      fr(1, 2) +
      " by 1 by 2 " +
      fr(1, 2) +
      " inches holds 3 × 2 × 5 = 30 cubes of " +
      fr(1, 2) +
      " inch, which is 30 × " +
      fr(1, 8) +
      " = 3 " +
      fr(3, 4) +
      " cubic inches.</p><p>Change the length, width, and height.</p>",
    check: {
      kind: "num",
      unit: "cubic feet",
      answer: 480,
      q:
        "A pool shaped like a rectangular prism is 24 feet long and 15 feet wide. The water is 1 " +
        fr(1, 3) +
        " feet deep. What is the volume of the water?",
      misc: [
        [360, "That uses a depth of 1 foot. The water is 1 " + fr(1, 3) + " feet deep: 360 × " + fr(4, 3) + "."],
        [40.33, "That adds the edges. Volume is length × width × height."],
        [270, "That’s 360 × " + fr(3, 4) + ". Multiply by 1 " + fr(1, 3) + " = " + fr(4, 3) + "."],
      ],
      explain: "24 × 15 = 360 square feet of floor, and 360 × " + fr(4, 3) + " = 480 cubic feet.",
    },
  },
];
