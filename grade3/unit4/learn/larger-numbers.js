/* Learn Relating Multiplication to Division (Grade 3 Unit 4), chapter 7: Multiply teen and larger numbers. Its widgets and
   steps; loaded by larger-numbers.html. */
/* the tens and ones of a two-digit number: 13 → [10, 3] */
const tensAndOnes = (n) => [n - (n % 10), n % 10];
/* Groups of a teen number in base-ten blocks: put the tens together, then the ones, then add. */
const wTeen = stepsWidget(
  [
    { label: "4 × 13", groups: 4, big: 13, steps: 3 },
    { label: "3 × 15", groups: 3, big: 15, steps: 3 },
    { label: "6 × 12", groups: 6, big: 12, steps: 3 },
  ],
  ({ groups, big }, made) => {
    const [tensPart, onesPart] = tensAndOnes(big),
      lines = [
        `The tens: ${groups} × ${tensPart} = ${groups * tensPart}.`,
        `The ones: ${groups} × ${onesPart} = ${groups * onesPart}.`,
        `<span class="ok">${groups * tensPart} + ${groups * onesPart} = <b>${groups * big}</b>, so ${groups} × ${big} = ${groups * big}.</span>`,
      ];
    return {
      fig: divideFig(groups * big, groups, { label: `${groups} groups of ${big}` }),
      text: [`${groups} groups of ${big}: each has 1 ten and ${pl(onesPart, "one")}.`, ...lines.slice(0, made)].join(
        "<br>",
      ),
    };
  },
);
/* An area diagram for a one-digit number times a two-digit one: fill in each part, then add. */
const wArea = stepsWidget(
  [
    { label: "3 × 24", small: 3, big: 24, steps: 3 },
    { label: "4 × 18", small: 4, big: 18, steps: 3 },
    { label: "2 × 37", small: 2, big: 37, steps: 3 },
  ],
  ({ small, big }, made) => {
    const [tensPart, onesPart] = tensAndOnes(big),
      lines = [
        `${small} × ${tensPart} = ${small * tensPart}.`,
        `${small} × ${onesPart} = ${small * onesPart}.`,
        `<span class="ok">${small * tensPart} + ${small * onesPart} = <b>${small * big}</b>, so ${small} × ${big} = ${small * big}.</span>`,
      ];
    return {
      fig: areaModel(big, small, { filled: made }),
      text: [`Break ${big} into ${tensPart} and ${onesPart}.`, ...lines.slice(0, made)].join("<br>"),
    };
  },
);
/* the quick checks' figures */
const F = {
  blocks: divideFig(70, 5, { label: "5 groups of 14" }),
  area: areaModel(23, 4, { filled: 0 }),
};
const STEPS = [
  {
    title: "Groups of a teen number",
    widget: wTeen,
    body: "<p>13 is 1 ten and 3 ones. So 4 × 13 is 4 tens and 4 groups of 3 ones: 40 + 12 = 52.</p><p>Pick a problem. Put the tens together, then the ones, then add.</p>",
    check: {
      kind: "num",
      q: "What is 5 × 14?",
      fig: F.blocks,
      answer: 70,
      misc: [
        [54, "Multiply the 4 ones too: 5 × 4 = 20."],
        [30, "Multiply the ten too: 5 × 10 = 50."],
      ],
      explain: "5 × 10 = 50 and 5 × 4 = 20. 50 + 20 = 70.",
    },
  },
  {
    title: "Area diagrams for larger numbers",
    widget: wArea,
    body: "<p>An area diagram doesn’t need every square. For 3 × 24, draw a rectangle 3 tall, and split the 24 into 20 and 4. The parts are 3 × 20 and 3 × 4.</p><p>Pick a problem and fill in each part.</p>",
    check: {
      kind: "num",
      q: "What is 4 × 23?",
      fig: F.area,
      answer: 92,
      misc: [
        [83, "Multiply the 3 ones too: 4 × 3 = 12."],
        [32, "Multiply the 20 too: 4 × 20 = 80."],
      ],
      explain: "4 × 20 = 80 and 4 × 3 = 12. 80 + 12 = 92.",
    },
  },
];
