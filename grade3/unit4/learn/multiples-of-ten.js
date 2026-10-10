/* Learn Relating Multiplication to Division (Grade 3 Unit 4), chapter 6: Multiply multiples of ten. Its widgets and steps;
   loaded by multiples-of-ten.html. */
/* Pick how many groups and how many tens in each: the groups of tens show that 4 × 30 is 12 tens, the same digits as 4 × 3. */
function wTens(el) {
  const q = Q(el),
    values = { groups: 4, tens: 3 };
  el.innerHTML =
    `<div class="wrow">${stepper("groups", "Groups")}${stepper("tens", "Tens in each")}</div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { groups, tens } = values,
      allTens = groups * tens;
    q("groups").textContent = groups;
    q("tens").textContent = tens;
    q("f").innerHTML = divideFig(allTens * 10, groups, { label: `${groups} groups of ${tens} tens` });
    q("e").textContent = `${groups} × ${tens * 10} = ${allTens * 10}`;
    q("r").innerHTML =
      `${groups} groups of ${pl(tens, "ten")} is ${groups} × ${tens} tens = ${pl(allTens, "ten")}.` +
      `<br><span class="ok">${pl(allTens, "ten")} is <b>${allTens * 10}</b>.</span> It’s like ${groups} × ${tens} = ${allTens}, but tens instead of ones.`;
  };
  steppers(el, values, { groups: [2, 9], tens: [1, 9] }, draw);
  draw();
}
/* Solve a story with equal groups of a multiple of ten: draw a tape, count the tens, then find the total. */
const wPacks = stepsWidget(
  [
    { label: "Marbles", story: "5 bags with 20 marbles in each", packs: 5, size: 20, thing: "marbles", steps: 2 },
    { label: "Beads", story: "3 jars with 60 beads in each", packs: 3, size: 60, thing: "beads", steps: 2 },
    { label: "Crayons", story: "8 boxes with 30 crayons in each", packs: 8, size: 30, thing: "crayons", steps: 2 },
  ],
  ({ story, packs, size, thing, steps }, made) => ({
    fig: timesTape([{ label: thing, times: packs, each: size, total: made === steps ? packs * size : "?" }], {
      label: `Tape diagram: ${packs} parts of ${size}${made === steps ? `, ${packs * size} in all` : ""}`,
    }),
    text:
      `There are ${story}. How many ${thing} are there?` +
      (made >= 1
        ? `<br>${size} is ${size / 10} tens. ${packs} × ${size / 10} tens = ${packs * (size / 10)} tens.`
        : "") +
      (made === steps
        ? `<br><span class="ok">${packs * (size / 10)} tens is ${packs * size}. ${packs} × ${size} = <b>${packs * size}</b> ${thing}.</span>`
        : ""),
  }),
);
/* the quick checks' figures */
const F = {
  tens: divideFig(240, 6, { label: "6 groups of 4 tens" }),
  crayons: timesTape([{ label: "crayons", times: 7, each: 30, total: "?" }], { label: "Tape diagram: 7 parts of 30" }),
};
const STEPS = [
  {
    title: "Groups of tens",
    widget: wTens,
    body: "<p>30 is 3 tens. So 4 × 30 is 4 groups of 3 tens: 12 tens, which is 120. A multiple of ten times a number is a fact you know, in tens.</p><p>Change the groups and the tens in each.</p>",
    check: {
      kind: "num",
      q: "What is 6 × 40?",
      fig: F.tens,
      answer: 240,
      misc: [
        [24, "That’s 24 ones. 6 × 4 tens is 24 tens."],
        [46, "That’s 6 + 40. Multiply."],
      ],
      explain: "6 × 4 tens = 24 tens, and 24 tens is 240. So 6 × 40 = 240.",
    },
  },
  {
    title: "Equal groups problems",
    widget: wPacks,
    body: "<p>A story with equal groups of 20, 30, or 60 is a multiplication with a multiple of ten. Draw a tape with a part for each group, then count the tens.</p><p>Pick a story and take it one step at a time.</p>",
    check: {
      kind: "num",
      q: "There are 7 boxes with 30 crayons in each box. How many crayons are there?",
      fig: F.crayons,
      answer: 210,
      unit: "crayons",
      misc: [
        [21, "That’s 21 ones. 7 × 3 tens is 21 tens."],
        [37, "That’s 7 + 30. There are 7 groups of 30: multiply."],
      ],
      explain: "7 × 3 tens = 21 tens, which is 210. So 7 × 30 = 210 crayons.",
    },
  },
];
