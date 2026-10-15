/* Learn Putting It All Together (Grade 3 Unit 8), chapter 5: Multiplication and division. Its widgets and steps; loaded by
   multiply-divide.html. */
/* the pictures one multiplication can be: [id, button] */
const PICTURES = [
  ["groups", "Equal groups"],
  ["array", "Array"],
  ["area", "Area diagram"],
  ["tape", "Tape diagram"],
];
/* Change the number of groups and the number in each (steppers), and switch pictures: the same numbers make the same
   multiplication and division equations in every picture. */
function wPictures(el) {
  /* values.groups and values.each: the factors */
  const q = Q(el),
    values = { groups: 4, each: 6 };
  let picture = "groups";
  el.innerHTML =
    seg("Picture", PICTURES) +
    `<div class="wrow">${stepper("groups", "Groups")}${stepper("each", "In each")}</div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { groups, each } = values,
      product = groups * each;
    press(el, picture);
    q("groups").textContent = groups;
    q("each").textContent = each;
    q("f").innerHTML = {
      groups: () => groupsFig(groups, each),
      array: () => arrayFig(groups, each),
      area: () => rectFig(each, groups),
      tape: () =>
        partWhole(
          range(groups).map(() => ({ n: 1, show: each })),
          product,
          `A tape of ${product} in ${groups} equal parts of ${each}`,
        ),
    }[picture]();
    q("e").textContent =
      `${groups} × ${each} = ${product}   ${product} ÷ ${groups} = ${each}   ${product} ÷ ${each} = ${groups}`;
    q("r").innerHTML = {
      groups: `${groups} groups of ${each}: ${product} in all. Split ${product} into ${groups} equal groups and each has ${each}.`,
      array: `${groups} rows of ${each}: ${product} in all. ${product} in ${groups} equal rows is ${each} in each row.`,
      area: `A rectangle ${groups} by ${each} has an area of ${product} square units. Its sides are factors of ${product}.`,
      tape: `${groups} equal parts of ${each} make ${product}. Cut ${product} into ${groups} equal parts and each is ${each}.`,
    }[picture];
  };
  steppers(el, values, { groups: [2, 6], each: [2, 8] }, draw);
  onPick(el, (id) => {
    picture = id;
    draw();
  });
  draw();
}
/* divisions to work out from a multiplication fact: [product, divisor] */
const DIVISIONS = [
  [56, 8],
  [42, 6],
  [72, 9],
  [36, 4],
];
/* Find a quotient as a missing factor: try a number of hops of the divisor (a stepper) until they land on the product. */
function wDivide(el) {
  /* values.hops: how many hops of the divisor to try */
  const q = Q(el),
    values = { hops: 5 };
  let divisionIndex = 0;
  el.innerHTML =
    seg(
      "Divide",
      DIVISIONS.map(([product, divisor], i) => [i, `${product} ÷ ${divisor}`]),
    ) +
    `<div class="wrow">${stepper("hops", "Try")}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const [product, divisor] = DIVISIONS[divisionIndex],
      { hops } = values,
      reached = hops * divisor;
    press(el, divisionIndex);
    q("hops").textContent = hops;
    q("f").innerHTML = hopLine(divisor, divisor * 10, hops, { mark: product });
    q("e").textContent = `${divisor} × ${hops} = ${reached}`;
    q("r").innerHTML =
      reached < product
        ? `${reached} is less than ${product}. Try more hops.`
        : reached > product
          ? `${reached} is more than ${product}. Try fewer hops.`
          : `<span class="ok">${divisor} × ${hops} = ${product}, so ${product} ÷ ${divisor} = ${hops}.</span>`;
  };
  steppers(el, values, { hops: [1, 10] }, draw);
  onPick(el, (id) => {
    divisionIndex = +id;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  tape: partWhole(
    range(5).map(() => ({ n: 1, show: "?" })),
    30,
    "A tape of 30 cut into 5 equal parts, each marked ?",
  ),
};
const STEPS = [
  {
    title: "One multiplication, many pictures",
    widget: wPictures,
    body: "<p>Equal groups, arrays, area diagrams, and tape diagrams can all show the same numbers. 4 × 6 is 4 groups of 6, 4 rows of 6, or a rectangle 4 by 6. The same picture shows division too: 24 split into 4 equal groups is 6 in each.</p><p>Change the numbers and switch pictures.</p>",
    check: {
      kind: "mc",
      q: "Which equation matches this tape diagram?",
      fig: F.tape,
      answer: "a",
      choices: [
        { id: "a", label: "30 ÷ 5 = ?" },
        { id: "b", label: "30 − 5 = ?" },
        { id: "c", label: "5 × 30 = ?" },
      ],
      why: {
        b: "That takes 5 away. The tape cuts 30 into 5 equal parts: divide.",
        c: "That’s 5 groups of 30. The tape shows 30 in all, cut into equal parts.",
      },
      explain: "The tape is 30 in all, cut into 5 equal parts: 30 ÷ 5 = ?. Each part is 6.",
    },
  },
  {
    title: "Divide with a fact you know",
    widget: wDivide,
    body: "<p>Every division goes with a multiplication. To find 56 ÷ 8, ask: 8 times what is 56? Count by 8s, or start from a fact you know, until you land on 56.</p><p>Pick a division and try hops.</p>",
    check: {
      kind: "num",
      q: "63 ÷ 7 = ?",
      answer: 9,
      unit: "",
      misc: [
        [56, "That subtracts 7. Think: 7 times what is 63?"],
        [70, "That adds 7. Think: 7 times what is 63?"],
        [8, "7 × 8 = 56, not 63. Try one more 7."],
      ],
      explain: "7 × 9 = 63, so 63 ÷ 7 = 9.",
    },
  },
];
