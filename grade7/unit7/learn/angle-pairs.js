/* Learn Angles, Triangles, and Prisms (Grade 7 Unit 7), chapter 1: Angle pairs. Its widgets and steps; loaded by
   angle-pairs.html. */
/* Pick a right angle or a straight line and slide one angle: the other is what's left of 90° or 180°. */
function wPair(el) {
  const q = Q(el);
  let total = 90;
  el.innerHTML =
    seg("Together they make", [
      [90, "A right angle (90°)"],
      [180, "A straight line (180°)"],
    ]) +
    `<div class="wrow"><label class="slider">Angle <input type="range" min="1" max="17" value="7" data-s><b data-sv></b></label></div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* the slider goes in fives, up to 5 short of the total */
    const steps = +q("s").value,
      a = Math.min(steps * 5, total - 5),
      other = total - a;
    press(el, total);
    q("sv").textContent = `${a}°`;
    q("f").innerHTML =
      total === 90
        ? raysFig([[0], [a, "b"], [90]], {
            marks: [
              { from: 0, to: 90 },
              { from: 0, to: a, text: `${a}°`, r: 46 },
              { from: a, to: 90, text: `${other}°`, r: 64 },
            ],
          })
        : raysFig([[a, "b"]], {
            line: true,
            marks: [
              { from: 0, to: a, text: `${a}°`, r: 40 },
              { from: a, to: 180, text: `${other}°`, r: 58 },
            ],
          });
    q("r").innerHTML =
      `${a}° + ${other}° = ${total}°. The two angles are <b>${total === 90 ? "complementary" : "supplementary"}</b>: ` +
      `the other angle is always ${total} − ${a} = <b>${other}°</b>.`;
  };
  q("s").addEventListener("input", draw);
  onPick(el, (id) => {
    total = +id;
    draw();
  });
  draw();
}

/* Slide the angle where two lines cross: the angles across from each other are equal, and the ones side by side make
   180°. */
function wCross(el) {
  const q = Q(el);
  el.innerHTML =
    `<div class="wrow"><label class="slider">Angle <input type="range" min="4" max="32" value="12" data-s><b data-sv></b></label></div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const a = 5 * +q("s").value,
      b = 180 - a;
    q("sv").textContent = `${a}°`;
    q("f").innerHTML = crossFig(a, { texts: [`${a}°`, `${b}°`, `${a}°`, `${b}°`] });
    q("r").innerHTML =
      `Across from each other: ${a}° and ${a}°, and ${b}° and ${b}°. <b>Vertical angles are equal.</b> ` +
      `Side by side on a line: ${a}° + ${b}° = 180°.`;
  };
  q("s").addEventListener("input", draw);
  draw();
}

const STEPS = [
  {
    title: "Complementary and supplementary",
    widget: wPair,
    body: "<p>Two angles that make a right angle together are <b>complementary</b>: they add up to 90°. Two that make a straight line are <b>supplementary</b>: they add up to 180°. Angles side by side that share a ray are <b>adjacent</b>.</p><p>Pick a total and slide the angle.</p>",
    check: {
      kind: "num",
      q: "Two angles are complementary. One is 35°. What is the other?",
      answer: 55,
      unit: "°",
      misc: [
        [145, "That uses 180°. Complementary angles add up to 90°."],
        [35, "They don’t have to be equal. They add up to 90°."],
      ],
      explain: "90 − 35 = 55°.",
    },
  },
  {
    title: "Vertical angles",
    widget: wCross,
    body: "<p>When two lines cross, they make four angles. The angles across from each other are <b>vertical angles</b>, and they’re always equal. Angles next to each other are on a straight line, so they’re supplementary.</p><p>Slide the angle.</p>",
    check: {
      kind: "num",
      q: "Two lines cross, making an angle of 65°. What is the angle right next to it?",
      answer: 115,
      unit: "°",
      misc: [
        [65, "That’s the angle across from it. The one next to it is on a straight line: 180 − 65."],
        [25, "These aren’t complementary. Side by side on a line, they make 180°."],
      ],
      explain: "Angles side by side on a line make 180°: 180 − 65 = 115°.",
    },
  },
];
