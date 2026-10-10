/* Learn Relating Multiplication to Division (Grade 3 Unit 4), chapter 8: Divide larger numbers. Its widgets and steps; loaded
   by divide-larger.html. */
/* Base-ten blocks part way through sharing: `groups` dashed boxes, each with `tens` tens and `ones` ones, and a pile still to
   share with pileTens tens and pileOnes ones (left out when it's empty). Tens blue and ones green, as in divideFig. */
function shareBlocksFig(groups, tens, ones, pileTens, pileOnes) {
  /* every box is at least 60 wide, room for the most blocks a group gets in this chapter, so boxes keep their size as
     blocks arrive */
  const cls = { t: "b", o: "c" },
    pad = 10,
    gap = 12,
    [groupMarkup, groupW, blockH] = hto(0, 0, 0, tens, ones, { cls }),
    [pileMarkup, pileW] = hto(0, 0, 0, pileTens, pileOnes, { cls }),
    cellW = Math.max(groupW, 60) + 2 * pad,
    cellH = blockH + 2 * pad,
    perRow = Math.min(groups, 3),
    cellX = (k) => 4 + (k % perRow) * (cellW + gap),
    cellY = (k) => 4 + Math.floor(k / perRow) * (cellH + gap),
    pileY = cellY(groups - 1) + cellH + 28,
    hasPile = pileTens + pileOnes > 0;
  let markup = "";
  range(groups).forEach((k) => {
    markup +=
      `<rect class="dgrp" x="${cellX(k)}" y="${cellY(k)}" width="${cellW}" height="${cellH}" rx="10"/>` +
      `<g transform="translate(${cellX(k) + pad},${cellY(k) + pad})">${groupMarkup}</g>`;
  });
  if (hasPile)
    markup +=
      `<text class="lbl s st dm" x="4" y="${pileY - 12}">Still to share</text>` +
      `<g transform="translate(${4 + pad},${pileY})">${pileMarkup}</g>`;
  return svgWrap(
    Math.max(8 + perRow * (cellW + gap) - gap, pileW + 2 * pad + 8, 140),
    hasPile ? pileY + blockH + 6 : cellY(groups - 1) + cellH + 6,
    markup,
    `${groups} groups, each with ${pl(tens, "ten")} and ${pl(ones, "one")}` +
      (hasPile ? `; still to share: ${pl(pileTens, "ten")} and ${pl(pileOnes, "one")}` : ""),
  );
}
/* the steps to share n into `groups` groups with blocks: share the tens, trade any tens left for ones, then share the ones.
   Each step is [what it says, tens in each group, ones in each group, tens left, ones left] after it. */
function shareSteps(n, groups) {
  const tens = Math.floor(n / 10),
    eachTens = Math.floor(tens / groups),
    tensLeft = tens % groups,
    onesLeft = (n % 10) + 10 * tensLeft,
    eachOnes = onesLeft / groups,
    steps = [
      [
        `Share the ${pl(tens, "ten")}: ${pl(eachTens, "ten")} in each group` +
          (tensLeft ? `, and ${pl(tensLeft, "ten")} left over.` : "."),
        eachTens,
        0,
        tensLeft,
        n % 10,
      ],
    ];
  if (tensLeft)
    steps.push([
      `Trade the ${pl(tensLeft, "ten")} left for ${10 * tensLeft} ones. Now there are ${onesLeft} ones to share.`,
      eachTens,
      0,
      0,
      onesLeft,
    ]);
  steps.push([`Share the ${onesLeft} ones: ${eachOnes} in each group.`, eachTens, eachOnes, 0, 0]);
  return steps;
}
/* Share a two-digit number into equal groups with base-ten blocks, trading a ten for ones when the tens don't share evenly. */
const wShareBlocks = stepsWidget(
  [
    { label: "48 ÷ 4", n: 48, groups: 4, steps: shareSteps(48, 4).length },
    { label: "52 ÷ 4", n: 52, groups: 4, steps: shareSteps(52, 4).length },
    { label: "75 ÷ 5", n: 75, groups: 5, steps: shareSteps(75, 5).length },
  ],
  ({ n, groups, steps }, made) => {
    const done = shareSteps(n, groups).slice(0, made),
      [, tens, ones, pileTens, pileOnes] = made ? done[made - 1] : [0, 0, 0, Math.floor(n / 10), n % 10],
      quotient = n / groups;
    return {
      fig: shareBlocksFig(groups, tens, ones, pileTens, pileOnes),
      text:
        [`Share ${n} into ${groups} equal groups.`, ...done.map(([say]) => say)].join("<br>") +
        (made === steps
          ? `<br><span class="ok">Each group has ${pl(tens, "ten")} and ${pl(ones, "one")}: ${n} ÷ ${groups} = <b>${quotient}</b>.</span>`
          : ""),
    };
  },
  "Next step",
);
/* divisions to break apart, each with three ways to split the number: [first part, second part] */
const SPLITS = [
  {
    n: 72,
    divisor: 6,
    ways: [
      [60, 12],
      [70, 2],
      [36, 36],
    ],
  },
  {
    n: 84,
    divisor: 4,
    ways: [
      [80, 4],
      [40, 44],
      [50, 34],
    ],
  },
  {
    n: 65,
    divisor: 5,
    ways: [
      [50, 15],
      [60, 5],
      [62, 3],
    ],
  },
];
/* Break a number into two parts to divide each by the divisor: parts that divide evenly add up to the answer. */
function wSplitDivide(el) {
  /* wayIndex: which split is picked (null until one is) */
  const q = Q(el);
  let problemIndex = 0,
    wayIndex = null;
  el.innerHTML = `<div data-top></div><div data-bot></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { n, divisor, ways } = SPLITS[problemIndex],
      quotient = n / divisor,
      [first, second] = wayIndex === null ? [] : ways[wayIndex],
      /* both parts must split into equal groups with nothing left over */
      works = wayIndex !== null && first % divisor === 0 && second % divisor === 0;
    q("top").innerHTML = seg(
      "Division",
      SPLITS.map((split, i) => [i, `${split.n} ÷ ${split.divisor}`]),
    );
    q("bot").innerHTML = seg(
      "Break it into",
      ways.map(([x, y], i) => [i, `${x} + ${y}`]),
    );
    press(q("top"), problemIndex);
    press(q("bot"), wayIndex);
    q("f").innerHTML = works
      ? splitFig(divisor, quotient, first / divisor, {
          grid: false,
          products: true,
          label: `A rectangle ${divisor} tall, cut into ${divisor} × ${first / divisor} = ${first} and ${divisor} × ${second / divisor} = ${second}`,
        })
      : divideFig(n, divisor, { split: false });
    q("r").innerHTML =
      wayIndex === null
        ? `Pick a way to break ${n} apart.`
        : works
          ? `${first} ÷ ${divisor} = ${first / divisor} and ${second} ÷ ${divisor} = ${second / divisor}.<br><span class="ok">${first / divisor} + ${second / divisor} = <b>${quotient}</b>, so ${n} ÷ ${divisor} = ${quotient}.</span>`
          : `<span class="no">${first % divisor ? first : second} doesn’t split into ${divisor} equal groups. Pick parts that ${divisor} goes into evenly.</span>`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") {
      problemIndex = +id;
      wayIndex = null;
    } else wayIndex = +id;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  blocks: divideFig(72, 4, { split: false }),
};
const STEPS = [
  {
    title: "Share base-ten blocks",
    widget: wShareBlocks,
    body: "<p>To share 52 into 4 groups, share the tens first: 1 ten in each group, and 1 ten left. Trade it for 10 ones, so there are 12 ones. Share them: 3 in each group. Each group has 13.</p><p>Pick a division and share the blocks one step at a time.</p>",
    check: {
      kind: "num",
      q: "Share 72 blocks equally into 4 boxes. How many blocks go in each box?",
      fig: F.blocks,
      answer: 18,
      unit: "blocks",
      misc: [
        [10, "3 tens are left after sharing the tens. Trade them for ones and share those too."],
        [4, "4 is how many boxes. How many blocks go in each one?"],
      ],
      explain:
        "Each box gets 1 ten, with 3 tens left. Trade them: 32 ones, 8 in each box. 10 + 8 = 18, so 72 ÷ 4 = 18.",
    },
  },
  {
    title: "Break the number apart",
    widget: wSplitDivide,
    body: "<p>To find 72 ÷ 6, break 72 into parts you can divide by 6: 60 and 12. 60 ÷ 6 = 10 and 12 ÷ 6 = 2, so 72 ÷ 6 = 12. On a rectangle, it’s a missing side: 6 × 10 and 6 × 2.</p><p>Pick a division and a way to break it apart.</p>",
    check: {
      kind: "mc",
      q: "Which is a way to find 56 ÷ 4?",
      choices: [
        { id: "a", label: "40 ÷ 4 + 16 ÷ 4" },
        { id: "b", label: "40 ÷ 4 + 16" },
        { id: "c", label: "40 ÷ 2 + 16 ÷ 2" },
      ],
      answer: "a",
      why: {
        b: "Divide the 16 by 4 too.",
        c: "That divides by 2. Divide each part by 4.",
      },
      explain: "40 ÷ 4 = 10 and 16 ÷ 4 = 4. 10 + 4 = 14, so 56 ÷ 4 = 14.",
    },
  },
];
