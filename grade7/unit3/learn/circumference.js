/* Learn Measuring Circles (Grade 7 Unit 3), chapter 2: Circumference and π. Its widgets and steps; loaded by
   circumference.html. */
/* round things measured with a tape: [what, diameter, circumference], in cm */
const MEASURED = [
  ["A coin", 2.4, 7.5],
  ["A plate", 26, 81.7],
  ["A bike wheel", 66, 207.3],
  ["A hula hoop", 90, 282.7],
];
/* Pick a round thing: its circumference divided by its diameter is always about 3.14, π. */
function wRatio(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Round thing",
      MEASURED.map(([what], i) => [i, what]),
    ) + `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [what, d, c] = MEASURED[index];
    press(el, index);
    q("f").innerHTML = circleFig({
      segs: ["diameter", "arc"],
      labels: { diameter: `${fmt(d)} cm`, arc: `around: ${fmt(c)} cm` },
      label: `${what}: ${d} cm across and ${c} cm around`,
    });
    q("e").textContent = `${fmt(c)} ÷ ${fmt(d)} ≈ ${(c / d).toFixed(2)}`;
    q("r").innerHTML =
      `${what}: around ÷ across ≈ <b>${(c / d).toFixed(2)}</b>. Big or small, every circle gives the same number, a bit more than 3. ` +
      `It’s called <b>π</b> (pi), about 3.14.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* Change the radius: the circumference is π times the diameter, which is 2π times the radius. */
function wCircum(el) {
  const q = Q(el),
    values = { radius: 5 };
  el.innerHTML = `<div class="wrow">${stepper("radius", "Radius (cm)")}</div><div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { radius: r } = values,
      d = 2 * r;
    q("radius").textContent = r;
    q("f").innerHTML = circleFig({
      segs: ["radius", "arc"],
      labels: { radius: `${r} cm`, arc: `C = ${piText(d, "cm")}` },
      label: `A circle with radius ${r} cm`,
    });
    q("e").textContent = `C = πd = π × ${d} = ${piText(d, "cm")}`;
    q("r").innerHTML =
      `The diameter is 2 × ${r} = ${d} cm, so the circumference is <b>${piText(d, "cm")}</b>, about 3.14 × ${d} = ${fmt(3.14 * d)} cm. ` +
      `Written with the radius, C = 2πr.`;
  };
  steppers(el, values, { radius: [1, 10] }, draw);
  draw();
}

/* circumferences to go back from, in m, as the number in front of π */
const BACK = [12, 30, 7];
/* Pick a circumference: the diameter is the number in front of π, and the radius is half of it. */
function wBackC(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Circumference",
      BACK.map((c, i) => [i, `C = ${c}π m`]),
    ) + `<p class="readout" data-r></p>`;
  const draw = (index) => {
    const c = BACK[index];
    press(el, index);
    q("r").innerHTML =
      `C = πd, and here C = π × ${c}. So the <b>diameter is ${c} m</b>, and the <b>radius is ${fmt(c / 2)} m</b>, half of it.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "Around ÷ across is always π",
    widget: wRatio,
    body: "<p>The distance around a circle is its <b>circumference</b>. Divide any circle’s circumference by its diameter and you get the same number, a bit more than 3. That number is <b>π</b>, about 3.14.</p><p>Pick a round thing.</p>",
    check: {
      kind: "mc",
      q: "About how many diameters fit around the edge of any circle?",
      choices: [
        { id: "a", label: "Exactly 2" },
        { id: "b", label: "A bit more than 3" },
        { id: "c", label: "About 6" },
      ],
      answer: "b",
      why: {
        a: "2 is how many radii make a diameter. Around the edge is longer: about 3.14 diameters.",
        c: "That’s about how many radii fit around. In diameters, it’s about 3.14.",
      },
      explain: "Circumference ÷ diameter = π, about 3.14, for every circle.",
    },
  },
  {
    title: "C = πd",
    widget: wCircum,
    body: "<p>So the circumference is π times the diameter: <b>C = πd</b>. The diameter is two radii, so it’s also C = 2πr. Leaving the answer as a number times π is exact; 3.14 gives an estimate.</p><p>Change the radius.</p>",
    check: {
      kind: "num",
      q: "A plate has a diameter of 10 cm. What is its circumference, in terms of π?",
      answer: 10,
      unit: "π cm",
      misc: [
        [5, "That’s π times the radius. C = πd uses the whole diameter."],
        [20, "That’s 2π times the diameter. C = πd, or 2π times the radius."],
        [25, "That’s πr², the area. The circumference is π times the diameter."],
      ],
      explain: "C = πd = π × 10 = 10π cm, about 31.4 cm.",
    },
  },
  {
    title: "Back to the diameter",
    widget: wBackC,
    body: "<p>When you know the circumference in terms of π, the diameter is the number in front of π. Halve it for the radius.</p><p>Pick a circumference.</p>",
    check: {
      kind: "num",
      q: "A circular track has a circumference of 18π m. What is its radius?",
      answer: 9,
      unit: "m",
      misc: [
        [18, "That’s the diameter. The radius is half of it."],
        [36, "C = πd, so 18 is the diameter. The radius is half of 18."],
      ],
      explain: "C = π × 18, so the diameter is 18 m and the radius is 9 m.",
    },
  },
];
