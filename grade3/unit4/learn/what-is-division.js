/* Learn Relating Multiplication to Division (Grade 3 Unit 4), chapter 1: What is division? Its widgets and steps; loaded by
   what-is-division.html. */
/* how many counters to start with, picked with a row of buttons */
const PILES = [12, 15, 20];
/* Make groups of one size from a pile of counters, one group at a time, until there aren't enough left for another. */
function wMakeGroups(el) {
  /* values.size: how many in each group; made: how many groups are made so far */
  const q = Q(el),
    values = { size: 4 };
  let pileIndex = 0,
    made = 0;
  el.innerHTML =
    seg(
      "Counters",
      PILES.map((total, i) => [i, `${total} counters`]),
    ) +
    `<div class="wrow">${stepper("size", "In each group")}</div><div class="fig" data-f></div>` +
    `<div class="wrow"><button type="button" class="btn" data-go>Make a group</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const total = PILES[pileIndex],
      size = values.size,
      left = total - made * size,
      /* not enough left for another group: either none are left (equal groups), or a few are */
      stuck = left < size;
    press(el, pileIndex);
    q("size").textContent = size;
    q("go").disabled = stuck;
    q("f").innerHTML = dealFig(made, size, left);
    q("r").innerHTML =
      (made ? `${pl(made, "group")} of ${size}. ${left} left.` : `Make groups of ${size} from ${total} counters.`) +
      (stuck && left === 0
        ? `<br><span class="ok">${total} in groups of ${size} make <b>${made}</b> groups. ${total} ÷ ${size} = ${made}.</span>`
        : stuck
          ? `<br><span class="no">Only ${left} left: not enough for another group of ${size}. Groups of ${size} don’t use all ${total}. Try another size.</span>`
          : "");
  };
  steppers(el, values, { size: [2, 6] }, () => {
    made = 0;
    draw();
  });
  q("go").onclick = () => {
    made++;
    draw();
  };
  q("clr").onclick = () => {
    made = 0;
    draw();
  };
  onPick(el, (id) => {
    pileIndex = +id;
    made = 0;
    draw();
  });
  draw();
}
/* Share a pile out into a number of groups, one to each group at a time. */
const wDeal = stepsWidget(
  [
    { label: "12 into 3 groups", total: 12, groups: 3, steps: 4 },
    { label: "15 into 5 groups", total: 15, groups: 5, steps: 3 },
    { label: "20 into 4 groups", total: 20, groups: 4, steps: 5 },
  ],
  ({ total, groups, steps }, made) => ({
    fig: dealFig(groups, made, total - made * groups),
    text:
      (made
        ? `Each group has ${made}. ${total - made * groups} left.`
        : `Share ${total} counters into ${groups} groups. Give one to each group, again and again.`) +
      (made === steps
        ? `<br><span class="ok">Each group gets <b>${steps}</b>. ${total} ÷ ${groups} = ${steps}.</span>`
        : ""),
  }),
  "Deal one to each",
);
/* the quick checks' figures */
const F = {
  cars: dealFig(0, 0, 18),
  stickers: dealFig(4, 0, 20),
};
const STEPS = [
  {
    title: "How many groups?",
    widget: wMakeGroups,
    body: "<p>To <b>divide</b> is to split a number into equal groups. Sometimes you know how many go in each group, and you find how many groups.</p><p>Pick how many go in each group, then make groups until the counters run out. The sign ÷ means divide: 12 ÷ 4 = 3 says 12 in groups of 4 make 3 groups.</p>",
    check: {
      kind: "num",
      q: "There are 18 toy cars. Each box holds 6 cars. How many boxes do the cars fill?",
      fig: F.cars,
      answer: 3,
      unit: "boxes",
      misc: [
        [12, "That takes away one box of 6. Keep making boxes of 6 until all 18 cars are packed."],
        [6, "6 is how many cars go in each box. How many boxes are there?"],
      ],
      explain: "3 boxes of 6 make 18: 3 × 6 = 18. So 18 ÷ 6 = 3 boxes.",
    },
  },
  {
    title: "How many in each group?",
    widget: wDeal,
    body: "<p>Sometimes you know how many groups there are, and you find how many go in each. Share them out one at a time, like dealing cards, until they’re all gone.</p><p>15 ÷ 5 = 3 says 15 shared into 5 equal groups gives 3 in each.</p>",
    check: {
      kind: "num",
      q: "Han shares 20 stickers equally among 4 friends. How many stickers does each friend get?",
      fig: F.stickers,
      answer: 5,
      unit: "stickers",
      misc: [
        [16, "That takes away 4. Share all 20 stickers equally among the 4 friends."],
        [4, "4 is how many friends. How many stickers does each one get?"],
      ],
      explain: "4 friends with 5 stickers each have 20: 4 × 5 = 20. So 20 ÷ 4 = 5 stickers each.",
    },
  },
];
