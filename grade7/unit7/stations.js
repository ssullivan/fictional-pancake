/* Skate Park Builders (Grade 7 Unit 7): the problem generators, station list, and icons. Loaded by index.html and by
   tools/fuzz.mjs, after figs.js (rays, crossing lines, triangles, prisms, and slices), shared/angles.js, and shared/solids.js
   (drawings of the solids that get sliced). Every problem carries facts for checks.js: its type (t) and the numbers its
   checks need. Each generator deals one of a few kinds of problem (type), each with a comment saying what it asks. */
/* a num problem: its named mistakes leave out any that land on the answer, and any repeats */
function numP(p) {
  const misc = (p.misc || []).filter(([v]) => Number.isFinite(v) && v > 0 && Math.abs(v - p.answer) >= 0.02);
  return { kind: "num", unit: "", ...p, misc: miscOf(p.answer, misc) };
}
/* an mc problem from [[label, why it's wrong, or null for the answer], …], leaving out wrong choices that repeat a label */
function mcP(list, p) {
  const kept = list.filter(([label], i) => list.findIndex(([other]) => other === label) === i);
  return { ...mcOf(kept, { stack: p.stack }), ...p };
}
const x = mathVar("x");
/* an angle as written, with its degree sign */
const deg = (n) => `${fmt(n)}°`;
/* a·x + b as written: 2x + 30, x, 3x − 10, with the letter in italics, in text (html) or in a picture (svg: inSvg) */
const angleExpr = (a, b, inSvg = false) =>
  `${a === 1 ? "" : a}${inSvg ? `<tspan class="mvt">x</tspan>` : x}${b ? ` ${b < 0 ? "−" : "+"} ${Math.abs(b)}` : ""}`;

/* ---------- Station 1: complementary, supplementary, and vertical angles (Lessons 1 to 3) ---------- */
function genAngles() {
  const type = pick(["comp", "supp", "supp", "vertical"]);
  if (type === "comp") {
    /* two angles that make a right angle: the other one is 90 minus this one */
    const a = R(3, 15) * 5;
    return numP({
      prompt: `The two angles make a <b>right angle</b>. One is ${deg(a)}. What is the other?`,
      answer: 90 - a,
      unit: "°",
      fig: () =>
        raysFig([[0], [a, "b"], [90]], {
          marks: [
            { from: 0, to: 90 },
            { from: 0, to: a, text: deg(a), r: 46 },
            { from: a, to: 90, text: "?", r: 62 },
          ],
          label: `A right angle split into ${a}° and an unknown angle`,
        }),
      hint: "Complementary angles add up to 90°.",
      misc: [
        [180 - a, "That uses 180°. These two make a right angle, 90°."],
        [a, "The two angles aren’t equal. Together they make 90°."],
      ],
      explain: `90 − ${a} = ${90 - a}°: the angles are complementary.`,
      facts: { t: type, a },
    });
  }
  if (type === "supp") {
    /* two angles on a straight line: the other is 180 minus this one */
    const a = R(4, 32) * 5;
    return numP({
      prompt: `The two angles together make a <b>straight line</b>. One is ${deg(a)}. What is the other?`,
      answer: 180 - a,
      unit: "°",
      fig: () =>
        raysFig([[a, "b"]], {
          line: true,
          marks: [
            { from: 0, to: a, text: deg(a), r: 40 },
            { from: a, to: 180, text: "?", r: 56 },
          ],
          label: `A straight angle split into ${a}° and an unknown angle`,
        }),
      hint: "Supplementary angles add up to 180°, a straight line.",
      misc: [
        [90 - a, "That uses 90°. A straight line is 180°."],
        [a, "The angles aren’t equal. Together they make 180°."],
      ],
      explain: `180 − ${a} = ${180 - a}°: the angles are supplementary.`,
      facts: { t: type, a },
    });
  }
  /* two crossing lines: the angle across is equal (vertical angles), the one beside makes 180 */
  const a = R(5, 30) * 5,
    across = Math.random() < 0.5;
  if (a === 90) return genAngles();
  return numP({
    prompt: `Two lines cross. One angle is ${deg(a)}. What is the angle marked <b>?</b>`,
    answer: across ? a : 180 - a,
    unit: "°",
    fig: () =>
      crossFig(a, {
        texts: across ? [deg(a), "", "?", ""] : [deg(a), "?", "", ""],
        label: `Two lines crossing, one angle ${a}°`,
      }),
    hint: across
      ? "The ? is across from the known angle. Angles across from each other (vertical angles) are equal."
      : "The ? is beside the known angle, on the same straight line: together they make 180°.",
    misc: across
      ? [
          [180 - a, "That’s the angle beside it. The ? is across from it: vertical angles are equal."],
          [90 - a, "These aren’t complementary. Vertical angles are equal."],
        ]
      : [
          [a, "That’s the angle across. The ? is beside it, on a straight line: 180 − " + a + "."],
          [90 - a, "These aren’t complementary. Angles on a straight line make 180°."],
        ],
    explain: across ? `Vertical angles are equal: ${a}°.` : `They’re supplementary: 180 − ${a} = ${180 - a}°.`,
    facts: { t: type, a, across },
  });
}

/* ---------- Station 2: equations for unknown angles (Lessons 4 and 5) ---------- */
function genEquations() {
  const type = pick(["pair", "pair", "three"]);
  if (type === "pair") {
    /* two angles with expressions that are supplementary or complementary: solve for x, or find an angle */
    const total = pick([90, 180, 180]),
      a = R(1, 4),
      b = R(-3, 6) * 5,
      c = R(1, 3),
      d = R(0, 6) * 5,
      sum = a + c,
      rest = total - b - d;
    if (rest % sum !== 0) return genEquations();
    const xv = rest / sum,
      first = a * xv + b,
      second = c * xv + d;
    if (first < 15 || second < 15 || first === second) return genEquations();
    const askAngle = Math.random() < 0.4;
    const marks =
      total === 90
        ? [
            { from: 0, to: 90 },
            { from: 0, to: first, text: angleExpr(a, b, true), r: 46 },
            { from: first, to: 90, text: angleExpr(c, d, true), r: 64 },
          ]
        : [
            { from: 0, to: first, text: angleExpr(a, b, true), r: 40 },
            { from: first, to: 180, text: angleExpr(c, d, true), r: 60 },
          ];
    return numP({
      prompt: `The angles make a ${total === 90 ? "right angle" : "straight line"}. ${askAngle ? `What is the angle marked ${angleExpr(a, b)}?` : `What is ${x}?`}`,
      answer: askAngle ? first : xv,
      unit: askAngle ? "°" : "",
      fig: () =>
        raysFig(total === 90 ? [[0], [first, "b"], [90]] : [[first, "b"]], {
          line: total === 180,
          marks,
          label: `Two angles, ${angleExpr(a, b).replace(/<[^>]*>/g, "")} and ${angleExpr(c, d).replace(/<[^>]*>/g, "")}, making ${total}°`,
        }),
      hint: `They add up to ${total}°: ${angleExpr(a, b)} + ${angleExpr(c, d)} = ${total}. Combine like terms and solve.${askAngle ? ` Then put ${x} back in.` : ""}`,
      misc: askAngle
        ? [
            [xv, `That’s ${x}. Put it into ${angleExpr(a, b)} to find the angle.`],
            [second, "That’s the other angle."],
          ]
        : [
            [(total - b - d) / Math.max(a, c), `There are ${sum} ${x}s in all: ${a} + ${c}.`],
            [(total === 90 ? 180 : 90) / sum - (b + d) / sum, `These make ${total}°, not ${total === 90 ? 180 : 90}°.`],
            [first, `That’s the angle ${angleExpr(a, b)}. The question asks for ${x}.`],
          ],
      explain: `${angleExpr(sum, b + d)} = ${total}, so ${x} = ${xv}${askAngle ? `, and ${angleExpr(a, b)} = ${a} × ${xv}${b ? ` ${b < 0 ? "−" : "+"} ${Math.abs(b)}` : ""} = ${first}°` : ""}.`,
      facts: { t: type, total, a, b, c, d, askAngle },
    });
  }
  /* three angles along a straight line, one known */
  const known = R(4, 14) * 5,
    a = R(1, 3),
    c = R(1, 3),
    rest = 180 - known;
  if (rest % (a + c) !== 0) return genEquations();
  const xv = rest / (a + c);
  if (a * xv < 15 || c * xv < 15) return genEquations();
  return numP({
    prompt: `Three angles make a straight line: ${angleExpr(a, 0)}, ${deg(known)}, and ${angleExpr(c, 0)}. What is ${x}?`,
    answer: xv,
    fig: () =>
      raysFig(
        [
          [a * xv, "b"],
          [a * xv + known, "b"],
        ],
        {
          line: true,
          marks: [
            { from: 0, to: a * xv, text: angleExpr(a, 0, true), r: 40 },
            { from: a * xv, to: a * xv + known, text: deg(known), r: 56 },
            { from: a * xv + known, to: 180, text: angleExpr(c, 0, true), r: 40 },
          ],
          label: `Three angles on a straight line`,
        },
      ),
    hint: `${angleExpr(a, 0)} + ${known} + ${angleExpr(c, 0)} = 180. Combine the ${x}s, then take ${known} off both sides.`,
    misc: [
      [rest / Math.max(a, c), `There are ${a + c} ${x}s in all.`],
      [(180 + known) / (a + c), `Take the ${known} away from 180, not add it.`],
    ],
    explain: `${angleExpr(a + c, 0)} + ${known} = 180, so ${angleExpr(a + c, 0)} = ${rest} and ${x} = ${xv}.`,
    facts: { t: type, known, a, c },
  });
}

/* ---------- Station 3: triangles from three measures (Lessons 8 to 10) ---------- */
/* can a, b, c make a triangle? Every two sides must add up to more than the third */
const makesTriangle = (a, b, c) => a + b > c && a + c > b && b + c > a;
/* three side lengths from 2 to 15 that make (yes) or don't make a triangle */
function sideSet(yes) {
  for (;;) {
    const sides = [R(2, 15), R(2, 15), R(2, 15)];
    if (makesTriangle(...sides) === yes && new Set(sides).size === 3) return sides;
  }
}
function genTriangles() {
  const type = pick(["which", "which", "unique"]);
  if (type === "which") {
    /* which set of sides makes a triangle, or which one can't */
    const findYes = Math.random() < 0.5,
      sets = [sideSet(findYes), sideSet(!findYes), sideSet(!findYes)],
      text = (s) => s.join(", ");
    if (text(sets[1]) === text(sets[2])) return genTriangles();
    const why = (s) => {
      const [p, q, r] = s.slice().sort((u, v) => u - v);
      return p + q > r
        ? `${p} + ${q} = ${p + q} is more than ${r}: they make a triangle.`
        : `${p} + ${q} = ${p + q} isn’t more than ${r}: the two short sides can’t reach.`;
    };
    return mcP(
      sets.map((s, i) => [`${text(s)}`, i === 0 ? null : why(s)]),
      {
        prompt: findYes
          ? "Which three side lengths (in cm) can make a triangle?"
          : "Which three side lengths (in cm) <b>can’t</b> make a triangle?",
        hint: "Add the two shortest sides. To make a triangle, they must be longer than the longest side together.",
        explain: why(sets[0]),
        facts: { t: type, sets, findYes },
      },
    );
  }
  /* how many different triangles a set of measures makes */
  const kind = pick(["angles", "sides", "none"]);
  const angles = (() => {
      const first = R(4, 10) * 5,
        second = R(4, 10) * 5;
      return [first, second, 180 - first - second];
    })(),
    sides = sideSet(true),
    bad = sideSet(false);
  if (angles[2] < 20) return genTriangles();
  const given =
    kind === "angles"
      ? `angles of ${angles.map(deg).join(", ")}`
      : `sides of ${(kind === "sides" ? sides : bad).join(" cm, ")} cm`;
  const answers = {
    angles: "Many, all different sizes",
    sides: "Exactly one",
    none: "None",
  };
  const why = {
    angles: "Three angles fix the shape but not the size: you can draw it bigger or smaller.",
    sides: "Three sides that can make a triangle make exactly one: every copy is the same.",
    none: "The two shorter sides together aren’t longer than the longest one, so they can’t meet.",
  };
  return mcP(
    Object.keys(answers).map((k) => [answers[k], k === kind ? null : why[kind]]),
    {
      prompt: `How many different triangles have ${given}?`,
      hint: "Can the measures make a triangle at all? If they can, do they fix its size, or only its shape?",
      explain: why[kind],
      facts: { t: type, kind, angles, sides: kind === "sides" ? sides : bad },
    },
  );
}

/* ---------- Station 4: slicing solids (Lesson 11) ---------- */
/* solids, how they're sliced, and the shape the slice makes; each solid draws with solids.js */
const SLICES = [
  ["a cube", () => solidSvg(solidOf("prism", 4, { a: 2, h: 2 }), { W: 160 }), "parallel to one face", "square"],
  [
    "a box (rectangular prism)",
    () => solidSvg(solidOf("prism", 4, { rect: [3, 1.6], h: 1.4 }), { W: 160 }),
    "parallel to its base",
    "rectangle",
  ],
  [
    "a triangular prism",
    () => solidSvg(solidOf("prism", 3, { a: 2, h: 3 }), { W: 160 }),
    "parallel to its triangle bases",
    "triangle",
  ],
  [
    "a triangular prism",
    () => solidSvg(solidOf("prism", 3, { a: 2, h: 3 }), { W: 160 }),
    "straight down, parallel to a side face",
    "rectangle",
  ],
  [
    "a square pyramid",
    () => solidSvg(solidOf("pyramid", 4, { a: 2.4, h: 2.4 }), { W: 160 }),
    "parallel to its base",
    "square",
  ],
  [
    "a square pyramid",
    () => solidSvg(solidOf("pyramid", 4, { a: 2.4, h: 2.4 }), { W: 160 }),
    "straight down through its top",
    "triangle",
  ],
  [
    "a hexagonal prism",
    () => solidSvg(solidOf("prism", 6, { a: 1.2, h: 2.4 }), { W: 160 }),
    "parallel to its bases",
    "hexagon",
  ],
  [
    "a pentagonal pyramid",
    () => solidSvg(solidOf("pyramid", 5, { a: 1.6, h: 2.6 }), { W: 160 }),
    "parallel to its base",
    "pentagon",
  ],
  ["a cylinder", () => curvedSvg("cylinder", { W: 160 }), "parallel to its base", "circle"],
  ["a cylinder", () => curvedSvg("cylinder", { W: 160 }), "straight down through its middle", "rectangle"],
  ["a cone", () => curvedSvg("cone", { W: 160 }), "straight down through its tip", "triangle"],
  ["a sphere", () => curvedSvg("sphere", { W: 160 }), "anywhere through it", "circle"],
];
function genSlices() {
  const [solid, draw, how, shape] = pick(SLICES),
    others = shuffle(Object.keys(SECTION_SHAPES).filter((s) => s !== shape)).slice(0, 2);
  return mcP(
    [shape, ...others].map((s) => [
      s[0].toUpperCase() + s.slice(1),
      s === shape ? null : `Picture the cut face. Slicing ${solid} ${how} makes a ${shape}.`,
    ]),
    {
      prompt: `${solid[0].toUpperCase() + solid.slice(1)} is sliced <b>${how}</b>. What shape is the cut face?`,
      fig: (show) => (show ? draw() + sectionFig(shape) : draw()),
      hint: "Imagine cutting it like a loaf of bread and looking at the cut face. The hint draws it beside the solid.",
      explain: `Slicing ${solid} ${how} makes a ${shape}.`,
      facts: { t: "slice", solid, how, shape },
    },
  );
}

/* ---------- Station 5: volume of prisms (Lessons 12 and 13) ---------- */
function genVolume() {
  const type = pick(["base", "ramp", "ramp", "lshape", "trapezoid"]);
  if (type === "base") {
    /* volume = area of the base × height */
    const area = pick([6, 8, 12, 15, 20, 24, 30]),
      h = R(3, 10);
    return numP({
      prompt: `A prism’s base has an area of ${area} square inches, and the prism is ${h} inches tall. What is its <b>volume</b>?`,
      answer: area * h,
      unit: "cubic inches",
      hint: "The volume of any prism is the area of its base times its height: one layer of the base for each inch up.",
      misc: [
        [area + h, "Multiply the base’s area by the height."],
        [area * h * 2, "The base counts once for each inch of height: area × height."],
      ],
      explain: `${area} × ${h} = ${area * h} cubic inches.`,
      facts: { t: type, area, h },
    });
  }
  if (type === "ramp") {
    /* a skate ramp: a right-triangle base pushed back its length */
    const rise = R(2, 6),
      run = R(4, 10),
      length = R(3, 8),
      area = (rise * run) / 2;
    if (!Number.isInteger(area)) return genVolume();
    return numP({
      prompt: `A wooden skate ramp is a prism. Its side is a right triangle ${rise} ft tall and ${run} ft long, and the ramp is ${length} ft wide. How much space does it take up (its <b>volume</b>)?`,
      answer: area * length,
      unit: "cubic feet",
      fig: () =>
        prismFig(
          [
            [0, 0],
            [run, 0],
            [0, rise],
          ],
          length,
          {
            labels: [
              { at: [run / 2, -0.6], text: `${run} ft` },
              { at: [-0.8, rise / 2], text: `${rise} ft` },
            ],
            depthText: `${length} ft`,
            label: `A ramp: a right triangle ${rise} by ${run}, ${length} wide`,
          },
        ),
      hint: `The base is the triangle: ½ × ${run} × ${rise} = ${area} square ft. Multiply by the ${length} ft it goes back.`,
      misc: [
        [rise * run * length, "The triangle is half of a rectangle: ½ × base × height."],
        [area + length, "Multiply the triangle’s area by the width."],
      ],
      explain: `The triangle’s area is ½ × ${run} × ${rise} = ${area}, and ${area} × ${length} = ${area * length} cubic feet.`,
      facts: { t: type, base: [rise, run], length },
    });
  }
  if (type === "lshape") {
    /* an L-shaped base: a big rectangle with a corner cut out */
    const w = R(5, 9),
      tall = R(4, 8),
      cutW = R(2, w - 2),
      cutH = R(2, tall - 2),
      h = R(2, 6),
      area = w * tall - cutW * cutH;
    const base = [
      [0, 0],
      [w, 0],
      [w, tall - cutH],
      [w - cutW, tall - cutH],
      [w - cutW, tall],
      [0, tall],
    ];
    return numP({
      prompt: `A concrete step is a prism with this L-shaped base, ${h} ft deep. What is its <b>volume</b>?`,
      answer: area * h,
      unit: "cubic feet",
      fig: () =>
        prismFig(base, h, {
          labels: [
            { at: [w / 2, -0.6], text: `${w}` },
            { at: [-0.7, tall / 2], text: `${tall}` },
            { at: [w + 0.7, (tall - cutH) / 2], text: `${tall - cutH}` },
            { at: [(w - cutW) / 2, tall + 0.6], text: `${w - cutW}` },
          ],
          depthText: `${h} ft`,
          label: `An L-shaped base, ${w} by ${tall} with a ${cutW} by ${cutH} corner cut out, ${h} deep`,
        }),
      hint: `Find the base’s area first: the ${w} by ${tall} rectangle minus the ${cutW} by ${cutH} corner that’s missing. Then multiply by ${h}.`,
      misc: [
        [w * tall * h, "The corner is cut out: take its area off the base first."],
        [area, "That’s the base’s area. Multiply by the depth for the volume."],
      ],
      explain: `The base is ${w} × ${tall} − ${cutW} × ${cutH} = ${area} square ft, and ${area} × ${h} = ${area * h} cubic feet.`,
      facts: { t: type, w, tall, cutW, cutH, h },
    });
  }
  /* a trapezoid base, split into a rectangle and a triangle */
  const top = R(2, 6),
    extra = R(2, 6),
    bottom = top + extra,
    tall = R(2, 6),
    h = R(2, 8),
    area = ((top + bottom) * tall) / 2;
  if (!Number.isInteger(area)) return genVolume();
  return numP({
    prompt: `A ramp has a trapezoid for its side: ${top} ft along the top, ${bottom} ft along the bottom, and ${tall} ft tall. It is ${h} ft wide. What is its <b>volume</b>?`,
    answer: area * h,
    unit: "cubic feet",
    fig: () =>
      prismFig(
        [
          [0, 0],
          [bottom, 0],
          [top, tall],
          [0, tall],
        ],
        h,
        {
          labels: [
            { at: [bottom / 2, -0.6], text: `${bottom}` },
            { at: [top / 2, tall + 0.6], text: `${top}` },
            { at: [-0.7, tall / 2], text: `${tall}` },
          ],
          depthText: `${h} ft`,
          label: `A trapezoid base ${top} and ${bottom} wide, ${tall} tall, ${h} deep`,
        },
      ),
    hint: `Split the trapezoid into a ${top} by ${tall} rectangle and a triangle ${extra} by ${tall}. Add their areas, then multiply by ${h}.`,
    misc: [
      [bottom * tall * h, "That treats the side as a rectangle. The slanted part is a triangle: half of it."],
      [top * tall * h, "Add the triangle part too: ½ × " + extra + " × " + tall + "."],
      [area, "That’s the base’s area. Multiply by the width."],
    ],
    explain: `The base is ${top} × ${tall} + ½ × ${extra} × ${tall} = ${area} square ft, and ${area} × ${h} = ${area * h} cubic feet.`,
    facts: { t: type, top, bottom, tall, h },
  });
}

/* ---------- Station 6: surface area, or volume? (Lessons 14 to 16) ---------- */
/* right triangles with whole sides: [leg, leg, slanted side] */
const RIGHT_TRIANGLES = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
];
/* jobs on a prism, and whether they need its surface area or its volume */
const JOBS = [
  ["paint every side of a toy box", "SA"],
  ["wrap a present in paper", "SA"],
  ["cover a skate ramp with plywood", "SA"],
  ["fill a planter with soil", "V"],
  ["pour concrete for a step", "V"],
  ["fill a fish tank with water", "V"],
];
function genSurface() {
  const type = pick(["box", "box", "ramp", "which"]);
  if (type === "box") {
    /* the surface area of a box: three pairs of rectangles */
    const l = R(3, 10),
      w = R(2, 8),
      h = R(2, 8),
      answer = 2 * (l * w + l * h + w * h);
    return numP({
      prompt: `How much cardboard does it take to make a closed box ${l} in long, ${w} in wide, and ${h} in tall? (Find its <b>surface area</b>.)`,
      answer,
      unit: "square inches",
      fig: () =>
        prismFig(
          [
            [0, 0],
            [l, 0],
            [l, h],
            [0, h],
          ],
          w,
          {
            labels: [
              { at: [l / 2, -0.6], text: `${l}` },
              { at: [-0.7, h / 2], text: `${h}` },
            ],
            depthText: `${w}`,
            unitPx: 14,
            label: `A box ${l} by ${w} by ${h}`,
          },
        ),
      hint: `Six rectangles in three pairs: top and bottom ${l} × ${w}, front and back ${l} × ${h}, and the ends ${w} × ${h}.`,
      misc: [
        [l * w * h, "That’s the volume, the space inside. Cardboard covers the outside: add the faces."],
        [l * w + l * h + w * h, "That’s three faces. Each one has a matching face on the other side."],
      ],
      explain: `2 × (${l * w} + ${l * h} + ${w * h}) = ${answer} square inches.`,
      facts: { t: type, l, w, h },
    });
  }
  if (type === "ramp") {
    /* the surface area of a triangular prism: two triangles and three rectangles */
    const [a, b, c] = pick(RIGHT_TRIANGLES),
      length = R(2, 8),
      answer = a * b + (a + b + c) * length;
    return numP({
      prompt: `A ramp is a prism whose ends are right triangles with sides ${a}, ${b}, and ${c} ft. It is ${length} ft wide. What is its total <b>surface area</b>?`,
      answer,
      unit: "square feet",
      fig: () =>
        prismFig(
          [
            [0, 0],
            [b, 0],
            [0, a],
          ],
          length,
          {
            labels: [
              { at: [b / 2, -0.6], text: `${b}` },
              { at: [-0.7, a / 2], text: `${a}` },
              { at: [b / 2 + 0.8, a / 2 + 0.6], text: `${c}` },
            ],
            depthText: `${length}`,
            unitPx: c > 10 ? 12 : 18,
            label: `A triangular prism, ends ${a}, ${b}, ${c}, ${length} wide`,
          },
        ),
      hint: `Two triangles (½ × ${a} × ${b} each) and three rectangles, each ${length} wide: ${a} × ${length}, ${b} × ${length}, and ${c} × ${length}.`,
      misc: [
        [(a * b * length) / 2, "That’s the volume. Surface area adds up the faces."],
        [(a * b) / 2 + (a + b + c) * length, "There are two triangle ends."],
        [a * b + (a + b) * length, `Count the slanted face too: ${c} × ${length}.`],
      ],
      explain: `Triangles: 2 × ½ × ${a} × ${b} = ${a * b}. Rectangles: (${a} + ${b} + ${c}) × ${length} = ${(a + b + c) * length}. Total ${answer} square feet.`,
      facts: { t: "rampSA", sides: [a, b, c], length },
    });
  }
  /* which measurement a job needs */
  const [job, need] = pick(JOBS);
  return mcP(
    [
      ["Surface area", need === "SA" ? null : "That fills the inside: volume."],
      ["Volume", need === "V" ? null : "That covers the outside: surface area."],
    ],
    {
      prompt: `To ${job}, do you need the prism’s surface area or its volume?`,
      hint: "Surface area covers the outside faces. Volume fills the space inside.",
      explain: need === "SA" ? "It covers the outside: surface area." : "It fills the inside: volume.",
      facts: { t: "job", need },
    },
  );
}

const ZONES = [
  {
    id: "angles",
    name: "Ramp Angles",
    lessons: "Lessons 1–3",
    blurb: "Find complementary, supplementary, and vertical angles.",
    gen: genAngles,
  },
  {
    id: "equations",
    name: "Angle Equations",
    lessons: "Lessons 4–5",
    blurb: "Write and solve equations for angles that make a right angle or a straight line.",
    gen: genEquations,
  },
  {
    id: "triangles",
    name: "Triangle Test",
    lessons: "Lessons 8–10",
    blurb: "Decide which side lengths make a triangle, and how many triangles some measures make.",
    gen: genTriangles,
  },
  {
    id: "slices",
    name: "Cross Sections",
    lessons: "Lesson 11",
    blurb: "Slice prisms, pyramids, cylinders, cones, and spheres, and name the cut face.",
    gen: genSlices,
  },
  {
    id: "volume",
    name: "Ramp Volume",
    lessons: "Lessons 12–13",
    blurb: "Find the volume of prisms: base area times height, with triangle, L-shaped, and trapezoid bases.",
    gen: genVolume,
  },
  {
    id: "surface",
    name: "Paint Job",
    lessons: "Lessons 14–16",
    blurb: "Find the surface area of boxes and ramps, and decide when a job needs surface area or volume.",
    gen: genSurface,
  },
  {
    id: "boss",
    name: "Skate Jam",
    lessons: "Whole unit · 10 problems",
    blurb: "A mixed review from every station. Aim for 3 stars.",
    gen: () => pick([genAngles, genEquations, genTriangles, genSlices, genVolume, genSurface])(),
  },
];

const ICON = {
  angles:
    '<path d="M6,52 H58" stroke="#f3f6fb" stroke-width="3"/><path d="M32,52 L50,14" stroke="#7fe3ff" stroke-width="3"/><path d="M44,52 A12,12 0 0 0 37,41" fill="none" stroke="#ffc93c" stroke-width="2.5"/><path d="M24,52 A8,8 0 0 1 36,44" fill="none" stroke="#ff8ac4" stroke-width="2.5"/>',
  equations:
    '<path d="M6,48 H58" stroke="#f3f6fb" stroke-width="3"/><path d="M32,48 L18,14" stroke="#7fe3ff" stroke-width="3"/><text x="46" y="38" fill="#ffc93c" font-size="12" font-weight="800" text-anchor="middle" font-family="monospace">2x</text><text x="14" y="42" fill="#ffc93c" font-size="12" font-weight="800" text-anchor="middle" font-family="monospace">x</text>',
  triangles:
    '<polygon points="8,52 56,52 26,14" fill="rgba(255,201,60,.3)" stroke="#ffc93c" stroke-width="3" stroke-linejoin="round"/>',
  slices:
    '<path d="M14,20 L32,10 L50,20 V46 L32,56 L14,46 Z" fill="rgba(127,227,255,.15)" stroke="#f3f6fb" stroke-width="2"/><path d="M14,33 L32,23 L50,33 L32,43 Z" fill="rgba(255,201,60,.55)" stroke="#ffc93c" stroke-width="2.5"/>',
  volume:
    '<polygon points="8,52 50,52 8,24" fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="2.5" stroke-linejoin="round"/><path d="M8,24 L18,16 L60,44 L50,52 M60,44 V44" fill="none" stroke="#f3f6fb" stroke-width="2"/><path d="M18,16 V16" stroke="#f3f6fb"/>',
  surface:
    '<rect x="10" y="22" width="32" height="30" fill="rgba(127,227,255,.3)" stroke="#f3f6fb" stroke-width="2.5"/><path d="M10,22 L20,12 H52 L42,22 M52,12 V42 L42,52" fill="rgba(127,227,255,.15)" stroke="#f3f6fb" stroke-width="2.5"/><path d="M48,8 l8,8" stroke="#ff8ac4" stroke-width="4" stroke-linecap="round"/>',
  boss: '<path d="M4,48 Q18,48 24,30 L40,30 Q46,48 60,48" fill="none" stroke="#ffc93c" stroke-width="4"/><circle cx="24" cy="22" r="4" fill="#7fe3ff"/><circle cx="40" cy="22" r="4" fill="#7fe3ff"/><path d="M20,18 H44" stroke="#f3f6fb" stroke-width="3"/>',
};
