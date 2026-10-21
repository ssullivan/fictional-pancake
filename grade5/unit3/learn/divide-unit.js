/* Learn Multiplying and Dividing Fractions (Grade 5 Unit 3), chapter 3: Share a unit fraction. Its widgets and steps; loaded
   by divide-unit.html. */
/* the unit fractions to share: denominators */
const SHARE_DEN = [2, 3, 4, 5];
/* Pick a unit fraction and share it among more and more people (a stepper): each share is 1/(b × n) of the whole. */
function wShareUnit(el) {
  const q = Q(el),
    values = { people: 2 },
    limits = { people: [2, 5] };
  let unit = 3;
  el.innerHTML =
    seg(
      "Share",
      SHARE_DEN.map((d) => [d, `1/${d}`]),
    ) +
    `<div class="wrow">${stepper("people", "People")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const people = values.people;
    press(el, unit);
    q("people").textContent = people;
    q("f").innerHTML = divUnitFig(unit, people);
    q("r").innerHTML =
      `Cut the ${fr(1, unit)} into ${people} equal pieces. If every ${fr(1, unit)} were cut that way, the whole would have ${unit} × ${people} = ${unit * people} pieces, ` +
      `so each share is <b>${fr(1, unit)} ÷ ${people} = ${fr(1, unit * people)}</b>.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    unit = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Cut a unit fraction into equal pieces",
    widget: wShareUnit,
    body: "<p>Sharing 1/3 of a pan of cornbread among 2 people cuts the 1/3 into 2 equal pieces. Each piece is 1/6 of the whole pan, so <b>1/3 ÷ 2 = 1/6</b>. Sharing makes each piece smaller.</p><p>Pick a fraction and share it.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "Elena has 1/4 pound of seeds to share equally among 2 pots. How much does each pot get?",
      fig: divUnitFig(4, 2, { cut: false }),
      answer: 1 / 8,
      unit: "pound",
      misc: [
        [1 / 2, "That multiplies: 2 × 1/4. Sharing 1/4 makes smaller pieces."],
        [8, "That’s 2 ÷ 1/4, how many fourths fit in 2. Here 1/4 is cut into 2 pieces."],
      ],
      explain: "Cutting each 1/4 into 2 pieces cuts the whole into 4 × 2 = 8 pieces. 1/4 ÷ 2 = 1/8 pound.",
    },
  },
];
