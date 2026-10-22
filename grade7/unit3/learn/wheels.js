/* Learn Measuring Circles (Grade 7 Unit 3), chapter 3: Circumference and wheels. Its widgets and steps; loaded by
   wheels.html. */
/* Change the turns of a wheel 50 cm across: each turn rolls it one circumference, 50π cm. */
function wRoll(el) {
  const q = Q(el),
    d = 50,
    values = { turns: 2 };
  el.innerHTML = `<div class="wrow">${stepper("turns", "Turns")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { turns } = values;
    q("turns").textContent = turns;
    q("f").innerHTML = rollFig(turns, { d, show: true });
    q("r").innerHTML =
      `Each turn rolls the wheel one circumference, ${piText(d, "cm")}. ` +
      `${turns} turn${turns === 1 ? "" : "s"}: ${turns} × ${d}π = <b>${piText(turns * d, "cm")}</b>, about ${fmt(3.14 * turns * d)} cm.`;
  };
  steppers(el, values, { turns: [1, 3] }, draw);
  draw();
}

/* trips for a wheel whose circumference is 2 m: how far, in m */
const TRIPS = [10, 50, 100];
/* Pick a trip: the turns are the distance divided by the circumference. */
function wTurns(el) {
  const q = Q(el),
    circ = 2;
  el.innerHTML =
    seg(
      "Trip",
      TRIPS.map((m, i) => [i, `${m} m`]),
    ) + `<p class="readout" data-r></p>`;
  const draw = (index) => {
    const far = TRIPS[index];
    press(el, index);
    q("r").innerHTML =
      `The wheel’s circumference is ${circ} m, so each turn moves it ${circ} m. ` +
      `For ${far} m: ${far} ÷ ${circ} = <b>${far / circ} turns</b>.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "One turn, one circumference",
    widget: wRoll,
    body: "<p>When a wheel turns once without slipping, every point of its edge touches the ground once. So it rolls forward one <b>circumference</b>. Two turns roll it two circumferences, and so on.</p><p>Change the turns.</p>",
    check: {
      kind: "num",
      q: "A bike wheel has a diameter of 70 cm. How far does the bike go when the wheel turns 10 times, in terms of π?",
      answer: 700,
      unit: "π cm",
      misc: [
        [70, "That’s one turn. The wheel turns 10 times."],
        [350, "That uses the radius. Each turn rolls π times the diameter."],
      ],
      explain: "One turn rolls 70π cm, so 10 turns roll 10 × 70π = 700π cm, about 2,198 cm.",
    },
  },
  {
    title: "How many turns?",
    widget: wTurns,
    body: "<p>To find how many times a wheel turns, divide the distance by the circumference: how many circumferences fit in the trip.</p><p>Pick a trip.</p>",
    check: {
      kind: "num",
      q: "A wheel’s circumference is 1.5 m. How many times does it turn in 30 m?",
      answer: 20,
      unit: "turns",
      misc: [
        [45, "That multiplies. Divide the distance by the circumference."],
        [30, "That’s the distance. Each turn covers 1.5 m."],
      ],
      explain: "30 ÷ 1.5 = 20 turns.",
    },
  },
];
