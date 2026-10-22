/* Learn Scale Drawings (Grade 7 Unit 1), chapter 5: Scale drawings and maps. Its widgets and steps; loaded by
   scale-drawings.html. */
/* a bedroom on a floor plan, 5 cm by 4 cm, with a 2-by-1 cm bed in the corner */
const ROOM = [
  [0, 0],
  [5, 0],
  [5, 4],
  [0, 4],
];
const BED = [
  [0, 0],
  [2, 0],
  [2, 1],
  [0, 1],
];
/* scales for the floor plan: [label, how many m 1 cm stands for] */
const PLAN_SCALES = [
  ["1 cm to 1 m", 1],
  ["1 cm to 2 m", 2],
  ["1 cm to 0.5 m", 0.5],
];
/* Pick a scale for the same floor plan: each centimeter on it stands for that many meters, so the real room changes. */
function wPlan(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Scale",
      PLAN_SCALES.map(([label], i) => [i, label]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [label, each] = PLAN_SCALES[index];
    press(el, index);
    q("f").innerHTML = gridFig(
      [
        { pts: ROOM, cls: "a", sides: [`5 cm`, `4 cm`, null, null] },
        { pts: BED, at: [3, 3], cls: "b", sides: [null, null, "2 cm", "1 cm"] },
      ],
      { cell: 44, label: `A floor plan 5 cm by 4 cm with a bed 2 cm by 1 cm; scale ${label}` },
    );
    q("r").innerHTML =
      `With the scale <b>${label}</b>, each centimeter on the plan stands for ${fmt(each)} m. ` +
      `The room is really 5 × ${fmt(each)} = <b>${fmt(5 * each)} m</b> by 4 × ${fmt(each)} = <b>${fmt(4 * each)} m</b>, ` +
      `and the bed is ${fmt(2 * each)} m long. ${each < 1 ? "That’s a tiny room: a 1 m bed is too short!" : each > 1 ? "That’s a huge bedroom with a 4 m bed!" : "That size makes sense for a bedroom."}`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* Change a real length: on a drawing at 1 cm to 5 m, it's that length divided by 5. */
function wToDrawing(el) {
  const q = Q(el),
    each = 5,
    values = { real: 20 };
  el.innerHTML =
    `<div class="wrow">${stepper("real", "Real length (m)")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { real } = values,
      drawn = real / each,
      cmPx = 26,
      width = 12 * cmPx + 64;
    q("real").textContent = `${real}`;
    /* a ruler in centimeters, with the drawn length on it */
    let markup = `<line class="road" x1="20" y1="24" x2="${20 + drawn * cmPx}" y2="24"/>`;
    for (let i = 0; i <= 12; i++)
      markup += `<line class="tick" x1="${20 + i * cmPx}" y1="40" x2="${20 + i * cmPx}" y2="52"/><text class="lbl s dm" x="${20 + i * cmPx}" y="66">${i}</text>`;
    markup += `<text class="lbl gd${drawn > 8 ? " en" : " st"}" x="${drawn > 8 ? 16 + drawn * cmPx : 24 + drawn * cmPx}" y="10">${fmt(drawn)} cm</text>`;
    markup += `<text class="lbl s dm en" x="${width - 4}" y="66">cm</text>`;
    q("f").innerHTML = svgWrap(width, 76, markup, `${real} m drawn as ${fmt(drawn)} cm`);
    q("r").innerHTML =
      `At <b>1 cm to 5 m</b>, every 5 m is 1 cm on the drawing: ${real} ÷ 5 = <b>${fmt(drawn)} cm</b>. ` +
      `The drawing is smaller than the real thing, so divide.`;
  };
  steppers(el, values, { real: [5, 60] }, draw);
  draw();
}

/* a route on a map from IM's lesson, with a scale of 1 cm to 20 km: legs in cm */
const TRIP = [
  { len: 3, dir: 0 },
  { len: 2.5, dir: 30 },
  { len: 2, dir: -30 },
];
const TRIP_TOWNS = ["Pine Lake", "Elm Falls", "Fort Ridge", "Bay Town"];
/* Pick part of the trip: add its lengths on the map, multiply by 20 for the real distance, and divide by the hours. */
function wTrip(el) {
  const q = Q(el),
    each = 20,
    parts = [
      [0, 1],
      [1, 3],
      [0, 3],
    ];
  el.innerHTML =
    seg(
      "Trip",
      parts.map(([from, to], i) => [i, `${TRIP_TOWNS[from]} to ${TRIP_TOWNS[to]}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [from, to] = parts[index],
      legs = TRIP.slice(from, to),
      mapLen = legs.reduce((s, l) => s + l.len, 0),
      real = mapLen * each;
    press(el, index);
    q("f").innerHTML = routeFig(legs, { names: TRIP_TOWNS.slice(from, to + 1), each, unit: "km", show: true });
    q("r").innerHTML =
      `On the map: ${legs.length > 1 ? `${legs.map((l) => fmt(l.len)).join(" + ")} = ` : ""}${fmt(mapLen)} cm. Really: ${fmt(mapLen)} × ${each} = <b>${fmt(real)} km</b>. ` +
      `<br><span class="dimline">If the drive takes 2 hours, the average speed is ${fmt(real)} ÷ 2 = ${fmt(real / 2)} km per hour.</span>`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "What a scale tells you",
    widget: wPlan,
    body: "<p>A <b>scale drawing</b> is a picture of something real with every length scaled down (or up) by the same amount. Its <b>scale</b> says what a length on the drawing stands for, like <b>1 cm to 2 m</b>. To find a real length, multiply.</p><p>Try each scale on the same floor plan.</p>",
    check: {
      kind: "num",
      q: "A floor plan has the scale 1 cm to 2 m. A wall is 6 cm long on the plan. How long is the real wall?",
      answer: 12,
      unit: "m",
      misc: [
        [3, "That divides. Each centimeter stands for 2 m, so the real wall is longer: multiply."],
        [8, "That adds 2. Each of the 6 centimeters stands for 2 m: 6 × 2."],
      ],
      explain: "Each of the 6 centimeters stands for 2 m: 6 × 2 = 12 m.",
    },
  },
  {
    title: "From the real thing to the drawing",
    widget: wToDrawing,
    body: "<p>To draw something real, go the other way: find how many centimeters it needs on the drawing. With a scale of 1 cm to 5 m, every 5 m of the real thing is 1 cm, so <b>divide</b> by 5.</p><p>Change the real length.</p>",
    check: {
      kind: "num",
      q: "A scale drawing uses the scale 1 cm to 5 m. A building is 35 m tall. How tall is it on the drawing?",
      answer: 7,
      unit: "cm",
      misc: [
        [175, "That multiplies. The drawing is smaller than the building: divide by 5."],
        [30, "That subtracts 5. Each 5 m is 1 cm: 35 ÷ 5."],
      ],
      explain: "Every 5 m is 1 cm on the drawing: 35 ÷ 5 = 7 cm.",
    },
  },
  {
    title: "Maps, distances, and speed",
    widget: wTrip,
    body: "<p>A map is a scale drawing too. Its scale bar shows what each centimeter stands for. Add up the lengths of the roads on the map, then multiply to find how far the trip really is. Divide the distance by the time to find the average speed.</p><p>Pick part of the trip.</p>",
    check: {
      kind: "num",
      q: "On a map with the scale 1 cm to 30 km, a road is 4 cm long. A family drives it in 2 hours. What is their average speed?",
      answer: 60,
      unit: "km per hour",
      misc: [
        [120, "That’s the distance. Speed is the distance for each hour: divide by 2."],
        [2, "That uses the map’s centimeters. Find the real distance first: 4 × 30 km."],
        [240, "Divide the distance by the time, not multiply."],
      ],
      explain: "The road is 4 × 30 = 120 km, and 120 ÷ 2 = 60 km per hour.",
    },
  },
];
