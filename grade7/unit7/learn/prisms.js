/* Learn Angles, Triangles, and Prisms (Grade 7 Unit 7), chapter 5: Volume and surface area. Its widgets and steps; loaded by
   prisms.html. */
/* an L-shaped base: a 6 by 5 rectangle with a 3 by 2 corner cut out (area 24) */
const L_BASE = [
  [0, 0],
  [6, 0],
  [6, 3],
  [3, 3],
  [3, 5],
  [0, 5],
];
/* Change the height: the volume is one layer of the base for each unit of height. */
function wVolume(el) {
  const q = Q(el),
    area = 6 * 5 - 3 * 2,
    values = { h: 4 };
  el.innerHTML = `<div class="wrow">${stepper("h", "Height")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { h } = values;
    q("h").textContent = h;
    q("f").innerHTML = prismFig(L_BASE, h, {
      labels: [
        { at: [3, -0.6], text: "6" },
        { at: [-0.7, 2.5], text: "5" },
      ],
      depthText: `${h}`,
      label: `An L-shaped prism ${h} deep`,
    });
    q("r").innerHTML =
      `Base: 6 × 5 − 3 × 2 = ${area} square units (the rectangle minus the missing corner). ` +
      `Volume: ${area} × ${h} = <b>${area * h} cubic units</b>.`;
  };
  steppers(el, values, { h: [1, 8] }, draw);
  draw();
}

/* Change a box's length, width, and height: its surface area adds three pairs of rectangles. */
function wSurface(el) {
  const q = Q(el),
    values = { l: 5, w: 3, h: 2 };
  el.innerHTML =
    `<div class="wrow">${stepper("l", "Length")}${stepper("w", "Width")}${stepper("h", "Height")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { l, w, h } = values,
      total = 2 * (l * w + l * h + w * h);
    ["l", "w", "h"].forEach((k) => (q(k).textContent = values[k]));
    q("f").innerHTML = prismFig(
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
        unitPx: 16,
      },
    );
    q("r").innerHTML =
      `Top and bottom: 2 × ${l} × ${w} = ${2 * l * w}. Front and back: 2 × ${l} × ${h} = ${2 * l * h}. Ends: 2 × ${w} × ${h} = ${2 * w * h}. ` +
      `Surface area: <b>${total} square units</b>. (Volume: ${l * w * h} cubic units.)`;
  };
  steppers(el, values, { l: [1, 8], w: [1, 6], h: [1, 6] }, draw);
  draw();
}

/* jobs: [label, surface area or volume, why] */
const JOBS = [
  ["Paint a toy box", "Surface area", "paint covers the outside faces"],
  ["Fill a sandbox", "Volume", "sand fills the space inside"],
  ["Wrap a present", "Surface area", "paper covers the outside"],
  ["Pour a concrete step", "Volume", "concrete fills the whole shape"],
];
/* Pick a job: covering the outside needs surface area, and filling the inside needs volume. */
function wJob(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Job",
      JOBS.map(([label], i) => [i, label]),
    ) + `<p class="readout" data-r></p>`;
  const draw = (index) => {
    const [label, need, why] = JOBS[index];
    press(el, index);
    q("r").innerHTML =
      `${label}: <b>${need}</b>, since ${why}. ${need === "Volume" ? "Measured in cubic units." : "Measured in square units."}`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "Volume: base times height",
    widget: wVolume,
    body: "<p>The volume of any right prism is the <b>area of its base times its height</b>: one layer of the base for each unit up. When the base is an odd shape, break it into rectangles and triangles (or take a missing piece away) to find its area.</p><p>Change the height.</p>",
    check: {
      kind: "num",
      q: "A prism’s base is a triangle with a base of 6 cm and a height of 4 cm. The prism is 10 cm long. What is its volume?",
      answer: 120,
      unit: "cubic cm",
      misc: [
        [240, "A triangle’s area is half of base × height: ½ × 6 × 4 = 12."],
        [20, "Multiply by the length, don’t add it: 12 × 10."],
      ],
      explain: "The base is ½ × 6 × 4 = 12 square cm, and 12 × 10 = 120 cubic cm.",
    },
  },
  {
    title: "Surface area: every face",
    widget: wSurface,
    body: "<p>The <b>surface area</b> of a prism is the total area of all its faces. A box has three pairs of matching rectangles. Find one of each pair, then double.</p><p>Change the box.</p>",
    check: {
      kind: "num",
      q: "What is the surface area of a box 4 in by 3 in by 2 in?",
      answer: 52,
      unit: "square inches",
      misc: [
        [24, "That’s the volume. Surface area adds the faces."],
        [26, "That’s three faces. Each has a matching face across from it: double it."],
      ],
      explain: "2 × (4 × 3 + 4 × 2 + 3 × 2) = 2 × 26 = 52 square inches.",
    },
  },
  {
    title: "Surface area or volume?",
    widget: wJob,
    body: "<p>Ask what the job does: covering the outside needs surface area (square units); filling the inside needs volume (cubic units).</p><p>Pick a job.</p>",
    check: {
      kind: "mc",
      q: "Lin is buying soil to fill a planter box. What should Lin find?",
      choices: [
        { id: "a", label: "The surface area" },
        { id: "b", label: "The volume" },
        { id: "c", label: "The perimeter of the base" },
      ],
      answer: "b",
      why: {
        a: "Surface area would cover the outside. Soil fills the inside.",
        c: "The perimeter goes around the base’s edge. Soil fills the space inside.",
      },
      explain: "Soil fills the space inside the box: volume.",
    },
  },
];
