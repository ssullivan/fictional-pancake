/* Learn Measuring Circles (Grade 7 Unit 3), chapter 5: Circumference or area? Its widgets and steps; loaded by
   circumference-or-area.html. */
/* Pick half or a quarter of a circle and change its radius: its area and its curved edge are shares of the whole circle's. */
function wPiece(el) {
  const q = Q(el),
    values = { radius: 4 };
  let kind = "half";
  el.innerHTML =
    seg("Piece", [
      ["half", "Half circle"],
      ["quarter", "Quarter circle"],
    ]) +
    `<div class="wrow">${stepper("radius", "Radius (m)")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { radius: r } = values,
      parts = kind === "half" ? 2 : 4,
      share = kind === "half" ? "half" : "a quarter";
    press(el, kind);
    q("radius").textContent = r;
    q("f").innerHTML = pieceFig(kind, r, { unit: "m", show: true });
    q("r").innerHTML =
      `Area: ${share} of π × ${r} × ${r} = <b>${piText((r * r) / parts, "square m")}</b>. ` +
      `Curved edge: ${share} of 2π × ${r} = <b>${piText((2 * r) / parts, "m")}</b>. ` +
      `All the way around, add the straight ${kind === "half" ? "side" : "sides"}: ${2 * r} m.`;
  };
  steppers(el, values, { radius: [2, 10] }, draw);
  onPick(el, (id) => {
    kind = id;
    draw();
  });
  draw();
}

/* jobs around a circular garden: [label, circumference or area, why] */
const GARDEN_JOBS = [
  ["Fence", "C", "A fence goes around the edge."],
  ["Grass seed", "A", "Seed covers the ground inside."],
  ["Edging stones", "C", "Edging lines the outside edge."],
  ["Mulch", "A", "Mulch spreads over the whole inside."],
];
/* Pick a job for a circular garden 10 m across: does it need the circumference or the area? */
function wJob(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Job",
      GARDEN_JOBS.map(([label], i) => [i, label]),
    ) + `<p class="readout" data-r></p>`;
  const draw = (index) => {
    const [label, kind, why] = GARDEN_JOBS[index];
    press(el, index);
    q("r").innerHTML =
      `${label}: ${why} ` +
      (kind === "C"
        ? `<b>Circumference</b>: π × 10 = 10π m, about 31.4 m.`
        : `<b>Area</b>: π × 5 × 5 = 25π square m, about 78.5 square m.`);
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "Half and quarter circles",
    widget: wPiece,
    body: "<p>Half of a circle has half the circle’s area and half its circumference. A quarter has a quarter of each. The distance all the way around a piece adds its straight sides too.</p><p>Pick a piece and change the radius.</p>",
    check: {
      kind: "num",
      q: "A rug is a half circle with a radius of 6 feet. What is its area, in terms of π?",
      answer: 18,
      unit: "π square feet",
      misc: [
        [36, "That’s the whole circle. The rug is half of it."],
        [6, "That’s half the circumference. Area uses the radius times itself."],
      ],
      explain: "The whole circle is π × 6 × 6 = 36π square feet, and half of it is 18π square feet.",
    },
  },
  {
    title: "Circumference or area?",
    widget: wJob,
    body: "<p>Before you calculate, ask what the job needs. Something that goes <b>around the edge</b> needs the circumference. Something that <b>covers the inside</b> needs the area, in square units.</p><p>Pick a job.</p>",
    check: {
      kind: "mc",
      q: "A circular pond is 10 m across. How much rope does it take to go once around it?",
      choices: [
        { id: "a", label: "About 31.4 m" },
        { id: "b", label: "About 78.5 square m" },
        { id: "c", label: "10 m" },
      ],
      answer: "a",
      why: {
        b: "That’s the area, the water’s surface. Rope goes around the edge: the circumference.",
        c: "That’s the diameter, straight across. Around the edge is π times as long.",
      },
      explain: "Around the edge is the circumference: π × 10 ≈ 31.4 m.",
    },
  },
];
