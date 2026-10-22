/* Learn Place Value Patterns and Decimal Operations (Grade 5 Unit 5), chapter 5: Multiply decimals. Its widgets and steps;
   loaded by multiply.html. */
/* the tenths to multiply by a whole number */
const GROUP_TENTHS = [2, 3, 4, 5];
/* Pick a number of tenths and step how many groups of it: n × 0.t is n × t tenths. */
function wGroups(el) {
  const q = Q(el),
    values = { groups: 3 },
    limits = { groups: [1, 9] };
  let tenths = 4;
  el.innerHTML =
    seg(
      "Each group",
      GROUP_TENTHS.map((t) => [t, `0.${t}`]),
    ) +
    `<div class="wrow">${stepper("groups", "Groups")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const n = values.groups,
      total = n * tenths;
    press(el, tenths);
    q("groups").textContent = n;
    q("f").innerHTML = tenthsFig(total, tenths);
    q("r").innerHTML =
      `${n} ${n === 1 ? "group" : "groups"} of ${tenths} tenths is ${n} × ${tenths} = ${total} tenths: <b>${n} × 0.${tenths} = ${dec(total * 100)}</b>.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    tenths = +m;
    draw();
  });
  draw();
}
/* Tenths × tenths on a square cut into hundredths (steppers for each): a tenth of a tenth is a hundredth. */
function wTenths(el) {
  const q = Q(el),
    values = { first: 3, second: 4 },
    limits = { first: [1, 9], second: [1, 9] };
  el.innerHTML =
    `<div class="wrow">${stepper("first", "First tenths")}${stepper("second", "Second tenths")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { first, second } = values;
    q("first").textContent = first;
    q("second").textContent = second;
    q("f").innerHTML = areaFig([first, 10], [second, 10], {
      under: true,
      dec: true,
      label: `0.${first} of 0.${second} of a square cut into hundredths`,
    });
    q("r").innerHTML =
      `The square is cut into 10 × 10 = 100 hundredths, and ${first} × ${second} = ${first * second} of them are gold: <b>0.${first} × 0.${second} = ${dec(first * second * 10)}</b>.`;
  };
  steppers(el, values, limits, draw);
  draw();
}
const STEPS = [
  {
    title: "Groups of tenths",
    widget: wGroups,
    body: "<p>3 × 0.4 is 3 groups of 4 tenths: 12 tenths, which is 1.2. Use the whole-number fact (3 × 4 = 12), then think about what the units are.</p><p>Pick the tenths in each group, then change the groups.</p>",
    check: {
      kind: "num",
      q: "Each lap of a loop is 0.4 kilometer. Han runs 6 laps. How far is that?",
      answer: 2.4,
      unit: "kilometers",
      tol: 0.0005,
      misc: [
        [0.24, "That’s 24 hundredths. 6 × 4 tenths is 24 tenths."],
        [24, "That’s 24 whole kilometers. It’s 24 tenths."],
      ],
      explain: "6 × 4 tenths = 24 tenths: 6 × 0.4 = 2.4 kilometers.",
    },
  },
  {
    title: "Tenths times tenths",
    widget: wTenths,
    body: "<p>0.3 × 0.4 is 0.3 of 0.4. On a square cut into 100 hundredths, it’s 3 × 4 = 12 of them: 0.12. A tenth of a tenth is a hundredth, so <b>tenths × tenths make hundredths</b>.</p><p>Change the two numbers of tenths.</p>",
    check: {
      kind: "num",
      q: "What is 0.7 × 0.6?",
      answer: 0.42,
      unit: "",
      tol: 0.0005,
      misc: [
        [4.2, "That’s 42 tenths. Tenths × tenths make hundredths: 42 hundredths."],
        [0.042, "That’s 42 thousandths. Tenths × tenths make hundredths."],
      ],
      explain: "7 × 6 = 42, and tenths × tenths are hundredths: 0.7 × 0.6 = 0.42.",
    },
  },
];
