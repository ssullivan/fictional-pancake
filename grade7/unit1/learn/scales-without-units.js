/* Learn Scale Drawings (Grade 7 Unit 1), chapter 7: Scales without units. Its widgets and steps; loaded by
   scales-without-units.html. */
/* units to measure a 1 to 50 model in: [name, how many make a bigger unit, the bigger unit] */
const MODEL_UNITS = [
  ["cm", 100, "m"],
  ["in", 12, "ft"],
];
/* Pick a unit and change the model's length: at 1 to 50, the real thing is 50 times as long, in the same unit. */
function wModel(el) {
  const q = Q(el),
    ratio = 50,
    values = { len: 6 };
  let unitIndex = 0;
  el.innerHTML =
    seg(
      "Unit",
      MODEL_UNITS.map(([unit], i) => [i, `Measure in ${unit}`]),
    ) +
    `<div class="wrow">${stepper("len", "Model length")}</div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const [unit, per, big] = MODEL_UNITS[unitIndex],
      real = values.len * ratio;
    press(el, unitIndex);
    q("len").textContent = `${values.len} ${unit}`;
    q("e").textContent = `${values.len} ${unit} × ${ratio} = ${fmt(real)} ${unit}`;
    q("r").innerHTML =
      `At <b>1 to ${ratio}</b>, every length on the real boat is ${ratio} times the model’s, in the <b>same unit</b>. ` +
      `${fmt(real)} ${unit} is ${fmt(real / per)} ${big}.`;
  };
  steppers(el, values, { len: [1, 12] }, draw);
  onPick(el, (id) => {
    unitIndex = +id;
    draw();
  });
  draw();
}

/* scales with units, and the same length in the drawing's unit: [drawn, real, the real length in the drawing's unit] */
const WITH_UNITS = [
  ["1 cm", "1 m", "100 cm"],
  ["1 cm", "5 m", "500 cm"],
  ["1 in", "1 ft", "12 in"],
  ["1 in", "1 yd", "36 in"],
  ["1 mm", "1 m", "1,000 mm"],
];
/* Pick a scale with units: write both lengths in the same unit, and the units can go. */
function wWrite(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Scale",
      WITH_UNITS.map(([drawn, real], i) => [i, `${drawn} to ${real}`]),
    ) + `<p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [drawn, real, converted] = WITH_UNITS[index],
      ratio = converted.split(" ")[0];
    press(el, index);
    q("e").textContent = `1 to ${ratio}`;
    q("r").innerHTML =
      `${real} = ${converted}, so <b>${drawn} to ${real}</b> is the same as ${drawn} to ${converted}: ` +
      `1 to ${ratio}. Every length on the drawing is <b>1/${ratio}</b> of the real length.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* scales that are all 1 to 1,000, and one that isn't */
const SAME_SCALES = [
  ["1 mm to 1 m", "1 m = 1,000 mm", true],
  ["1 cm to 10 m", "10 m = 1,000 cm", true],
  ["1 in to 1,000 in", "the same unit already", true],
  ["1 cm to 1 km", "1 km = 100,000 cm", false],
];
/* Pick a scale: is it the same as 1 to 1,000? */
function wSame(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Scale",
      SAME_SCALES.map(([label], i) => [i, label]),
    ) + `<p class="readout" data-r></p>`;
  const draw = (index) => {
    const [label, why, same] = SAME_SCALES[index];
    press(el, index);
    q("r").innerHTML = same
      ? `<b>${label}</b>: ${why}, so it’s <span class="ok">1 to 1,000</span>.`
      : `<b>${label}</b>: ${why}, so it’s 1 to 100,000, <span class="no">not 1 to 1,000</span>. Each length on that drawing is far smaller.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "A scale with no units",
    widget: wModel,
    body: "<p>A scale like <b>1 to 50</b> has no units. It means 1 of any unit on the model stands for 50 of the <b>same</b> unit on the real thing: 1 cm to 50 cm, or 1 inch to 50 inches.</p><p>Pick a unit and change the model’s length.</p>",
    check: {
      kind: "num",
      q: "A model boat is built at a scale of 1 to 20. The model is 15 cm long. How long is the real boat, in cm?",
      answer: 300,
      unit: "cm",
      misc: [
        [0.75, "That divides. The real boat is bigger: multiply by 20."],
        [35, "That adds 20. Every length on the real boat is 20 times the model’s."],
        [3, "That’s in meters. The question asks for cm."],
      ],
      explain: "15 × 20 = 300 cm, which is 3 m.",
    },
  },
  {
    title: "Writing a scale without units",
    widget: wWrite,
    body: "<p>To write a scale like 1 cm to 1 m without units, change both lengths to the same unit: 1 m is 100 cm, so the scale is <b>1 to 100</b>.</p><p>Pick a scale.</p>",
    check: {
      kind: "num",
      q: "Write the scale 1 cm to 4 m without units, as “1 to ?”.",
      answer: 400,
      misc: [
        [4, "Centimeters and meters aren’t the same size. Change 4 m to centimeters first."],
        [40, "Check the conversion: 1 m is 100 cm, so 4 m is 400 cm."],
      ],
      explain: "4 m = 400 cm, so 1 cm to 4 m is 1 to 400.",
    },
  },
  {
    title: "Same scale, different units",
    widget: wSame,
    body: "<p>Scales that look different can be the same. Change each to a scale without units to compare them.</p><p>Pick a scale.</p>",
    check: {
      kind: "mc",
      q: "Which scale is <b>not</b> the same as 1 to 1,000?",
      choices: [
        { id: "a", label: "1 mm to 1 m" },
        { id: "b", label: "1 cm to 10 m" },
        { id: "c", label: "1 cm to 1 km" },
      ],
      answer: "c",
      why: {
        a: "1 m is 1,000 mm, so 1 mm to 1 m is 1 to 1,000.",
        b: "10 m is 1,000 cm, so 1 cm to 10 m is 1 to 1,000.",
      },
      explain: "1 km is 100,000 cm, so 1 cm to 1 km is 1 to 100,000, not 1 to 1,000.",
    },
  },
];
