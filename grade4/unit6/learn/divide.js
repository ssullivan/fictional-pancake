/* Learn Multiplying and Dividing Multi-digit Numbers (Grade 4 Unit 6), chapter 6: Divide with base-ten blocks and partial quotients. Its widgets and steps; loaded by divide.html. */
/* divisions to share in blocks: [n, groups] */
const SHARES = [
  [69, 3],
  [72, 3],
  [146, 2],
  [96, 4],
];
/* the places, for 1 and for more */
const PLACES = [
  ["hundred", "hundreds"],
  ["ten", "tens"],
  ["one", "ones"],
];
/* "1 ten", "7 tens" */
const ofPlace = (count, i) => `${count} ${PLACES[i][count === 1 ? 0 : 1]}`;
/* how sharing n into `groups` goes, place by place from the hundreds: each place's blocks are shared, and any left over are
   traded for 10 of the next place (html) */
function shareWords(n, groups) {
  let carried = 0;
  return digits(n)
    .map((digit, i) => {
      const have = digit + 10 * carried,
        each = Math.floor(have / groups),
        left = have % groups;
      carried = left;
      if (!have) return "";
      return (
        `${ofPlace(have, i)}${have > digit ? ` (${have - digit} of them traded in)` : ""}: ${each} in each group` +
        (left && i < 2 ? `, ${left} left to trade for ${10 * left} ${PLACES[i + 1][1]}.` : ".")
      );
    })
    .filter(Boolean)
    .join(" ");
}
/* Pick a division and look before and after sharing the blocks. */
function wShare(el) {
  const q = Q(el);
  let shareIndex = 1,
    shared = false;
  el.innerHTML =
    `<div data-top>${seg(
      "Division",
      SHARES.map(([n, g], i) => [i, `${n} ÷ ${g}`]),
    )}</div><div data-bot>${seg("Blocks", [
      ["0", "Before sharing"],
      ["1", "Shared"],
    ])}</div>` + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [n, groups] = SHARES[shareIndex];
    press(q("top"), shareIndex);
    press(q("bot"), shared ? 1 : 0);
    q("f").innerHTML = divideFig(n, groups, { split: shared });
    q("r").innerHTML = shared
      ? `${shareWords(n, groups)}<br><b>${n} ÷ ${groups} = ${n / groups}</b>: each group gets ${n / groups}.`
      : `${n} is ${digits(n)
          .map((d, i) => (d ? ofPlace(d, i) : ""))
          .filter(Boolean)
          .join(", ")}. Share them into ${groups} equal groups, starting with the biggest blocks.`;
  };
  el.addEventListener("click", (e) => {
    const hit = segHit(e, ["top", "bot"]);
    if (!hit) return;
    if (hit[0] === "top") shareIndex = +hit[1];
    else shared = hit[1] === "1";
    draw();
  });
  draw();
}
/* divisions by partial quotients: [n, divisor, the chunks taken away] */
const CHUNKS = [
  [568, 4, [100, 40, 2]],
  [345, 5, [60, 9]],
  [928, 8, [100, 10, 6]],
];
/* Pick a division and take away one chunk at a time (a stepper). */
function wChunks(el) {
  /* the stepper's value: shown, how many chunks are taken away */
  const q = Q(el),
    values = { shown: 0 },
    limits = { shown: [0, 3] };
  let divisionIndex = 0;
  el.innerHTML =
    seg(
      "Division",
      CHUNKS.map(([n, d], i) => [i, `${n} ÷ ${d}`]),
    ) +
    `<div class="wrow">${stepper("shown", "Chunks")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [n, divisor, chunks] = CHUNKS[divisionIndex],
      shown = values.shown,
      left = n - divisor * chunks.slice(0, shown).reduce((x, y) => x + y, 0);
    press(el, divisionIndex);
    q("shown").textContent = shown;
    q("f").innerHTML = quotientFig(n, divisor, chunks, shown);
    if (shown === 0)
      q("r").innerHTML =
        `How many groups of ${divisor} are in ${n}? Take away big, easy chunks first, like ${chunks[0]} groups of ${divisor}.`;
    else {
      const chunk = chunks[shown - 1];
      q("r").innerHTML =
        `${chunk} groups of ${divisor} is ${chunk} × ${divisor} = ${chunk * divisor}. ${left} left.` +
        (shown === chunks.length
          ? ` Nothing left to share, so add the chunks: <b>${chunks.join(" + ")} = ${n / divisor}</b>. ${n} ÷ ${divisor} = ${n / divisor}.`
          : "");
    }
  };
  /* a new division: the stepper goes up to its number of chunks */
  const chooseDivision = (i) => {
    divisionIndex = i;
    limits.shown[1] = CHUNKS[i][2].length;
    values.shown = 0;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    chooseDivision(+m);
    draw();
  });
  chooseDivision(divisionIndex);
  draw();
}
const STEPS = [
  {
    title: "Share base-ten blocks",
    widget: wShare,
    body: "<p>To divide with base-ten blocks, share the biggest blocks first. When a block can’t be shared evenly, trade it for 10 of the next smaller block and keep sharing.</p><p>Pick a division, then share the blocks.</p>",
    check: {
      kind: "num",
      q: "Share 72 stickers equally among 3 friends. How many stickers does each friend get?",
      answer: 24,
      unit: "stickers",
      misc: [
        [
          21,
          "That shares only 6 of the 7 tens and leaves out the rest. Trade the last ten for 10 ones: 12 ones, 4 each.",
        ],
        [69, "That subtracts 3. Share: 72 ÷ 3."],
      ],
      explain:
        "7 tens: 2 each, 1 ten left. Trade it for 10 ones: 12 ones, 4 each. Each friend gets 2 tens and 4 ones: 24.",
    },
  },
  {
    title: "Partial quotients",
    widget: wChunks,
    body: "<p>You can divide in chunks: take away an easy number of groups, like 100 groups or 10 groups, and see what’s left. Keep going until nothing is left. The quotient is all the groups you took away.</p><p>Pick a division, then take away one chunk at a time.</p>",
    check: {
      kind: "num",
      q: "A farmer packs 252 eggs into cartons of 6. How many cartons is that?",
      answer: 42,
      unit: "cartons",
      misc: [
        [1512, "That multiplies. How many groups of 6 are in 252? Divide."],
        [246, "That takes away 6 once. Take away many groups of 6 at a time, like 40 groups."],
      ],
      explain: "40 × 6 = 240, and 252 − 240 = 12. 2 × 6 = 12. 40 + 2 = 42 cartons.",
    },
  },
];
