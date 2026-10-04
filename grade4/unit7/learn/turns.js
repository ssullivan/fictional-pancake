/* Learn Angles and Angle Measurement (Grade 4 Unit 7), chapter 3: Angles as turns. Its widgets and steps; loaded by turns.html. */
/* Open an angle (a slider): how big a turn it is, compared to a right angle. */
function wTurn(el) {
  const q = Q(el);
  let deg = 60;
  el.innerHTML =
    degSlider("Open the angle", 0, 360, deg) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    q("f").innerHTML = deg
      ? angleFig(deg)
      : angleFig(0, { mark: false, label: "Two rays on top of each other: no turn" });
    const kind = angleKind(deg);
    q("r").innerHTML =
      deg === 0
        ? "The rays are on top of each other: no turn at all."
        : deg === 360
          ? "A full turn, all the way around: 360°."
          : deg === 90
            ? "A quarter turn: a <b>right angle</b>, like the corner of a book."
            : deg === 180
              ? "A half turn: the rays point opposite ways, a <b>straight angle</b>. That’s two right angles."
              : `${deg < 90 ? "Less" : "More"} than a right angle: <b>${kind}</b>.${deg > 180 ? " It turns past a half turn." : ""}`;
  };
  onSlide(el, (value) => {
    deg = value;
    draw();
  });
  draw();
}
/* Turn the minute hand (a stepper, 5 minutes at a time): each minute turns it 6°, a sixtieth of a full turn. */
function wClock(el) {
  /* the stepper's value: fives, how many 5 minutes the hand has turned (it shows the minutes) */
  const q = Q(el),
    values = { fives: 3 },
    limits = { fives: [0, 12] };
  el.innerHTML = `<div class="wrow">${stepper("fives", "Minutes")}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const minutes = 5 * values.fives,
      deg = 6 * minutes;
    q("fives").textContent = minutes;
    q("f").innerHTML = clockFig(12, minutes % 60, {
      r: 90,
      shade: minutes && minutes < 60 ? [0, minutes] : null,
      label: `A clock with the minute hand turned ${minutes} minutes from 12`,
    });
    q("e").innerHTML = `${minutes} × 6° = ${deg}°`;
    q("r").innerHTML =
      minutes === 60
        ? "60 minutes is a full turn: 360°."
        : `A full turn is 60 minutes and 360°, so each minute turns the hand 6°. In ${minutes} minutes it turns <b>${deg}°</b>${minutes === 15 ? ", a quarter turn" : minutes === 30 ? ", a half turn" : minutes === 45 ? ", three quarters of a turn" : ""}.`;
  };
  steppers(el, values, limits, draw);
  draw();
}
const STEPS = [
  {
    title: "An angle is a turn",
    widget: wTurn,
    body: "<p>An angle is made by two rays from the same endpoint. Its size is how far one ray turns from the other. A quarter turn is a <b>right angle</b>. Less than that is <b>acute</b>, and more (up to a half turn) is <b>obtuse</b>.</p><p>Open the angle.</p>",
    check: {
      kind: "mc",
      q: "Which angle is greater than a right angle?",
      choices: [
        { id: "a", label: angleFig(60, { label: "An angle of 60 degrees" }) },
        { id: "b", label: angleFig(120, { label: "An angle of 120 degrees" }) },
        { id: "c", label: angleFig(90, { label: "An angle of 90 degrees" }) },
      ],
      answer: "b",
      why: {
        a: "That angle is less than a right angle: it’s acute.",
        c: "That’s a right angle, shown by the square mark. It isn’t greater than one.",
      },
      explain: "The second angle opens wider than a right angle: it’s obtuse.",
    },
  },
  {
    title: "Turns on a clock",
    widget: wClock,
    body: "<p>The minute hand makes a full turn, 360°, every 60 minutes. So in 15 minutes it makes a quarter turn: 90°. Each minute is 360 ÷ 60 = 6°.</p><p>Turn the minute hand 5 minutes at a time.</p>",
    check: {
      kind: "num",
      q: "How many degrees does the minute hand turn in 20 minutes?",
      answer: 120,
      unit: "degrees",
      misc: [
        [20, "That’s the minutes. Each minute turns the hand 6°."],
        [200, "That uses 10° for each minute. A full turn is 360° in 60 minutes: 6° a minute."],
      ],
      explain: "Each minute is 6°, so 20 minutes is 20 × 6 = 120°, a third of a full turn.",
    },
  },
];
