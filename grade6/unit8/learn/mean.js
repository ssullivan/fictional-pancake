/* Learn Data Sets and Distributions (Grade 6 Unit 8), chapter 4: The mean. Its widgets and steps; loaded by mean.html. */
/* Stacks of squares, one stack for each friend, named under it; level: a dashed line at that height (the fair share). */
function shareBars(counts, names, { level = null } = {}) {
  const square = 22,
    gap = 2,
    colW = 64,
    left = 20,
    top = 10,
    tallest = 10,
    bottom = top + tallest * (square + gap),
    width = left * 2 + counts.length * colW;
  let markup = "";
  counts.forEach((n, i) => {
    const x = left + i * colW + (colW - square) / 2;
    range(n).forEach((k) => {
      markup += `<rect class="sq" x="${x}" y="${bottom - (k + 1) * (square + gap)}" width="${square}" height="${square}" rx="3"/>`;
    });
    markup += `<text class="lbl s" x="${x + square / 2}" y="${bottom + 14}">${names[i]}</text><text class="lbl s gd" x="${x + square / 2}" y="${bottom - n * (square + gap) - 10}">${n}</text>`;
  });
  if (level !== null)
    markup += `<line class="dp-mean" x1="${left}" y1="${bottom - level * (square + gap) + gap / 2}" x2="${width - left}" y2="${bottom - level * (square + gap) + gap / 2}"/>`;
  return svgWrap(width, bottom + 26, markup, `Stacks of ${counts.join(", ")} squares`);
}
/* five friends' shells, before sharing */
const SHELLS = [2, 7, 4, 8, 4],
  SHELL_NAMES = ["Lin", "Noah", "Mai", "Diego", "Jada"];
/* Move shells from the biggest pile to the smallest until everyone has the same: that's the mean. */
function wShare(el) {
  const q = Q(el),
    total = SHELLS.reduce((s, v) => s + v, 0),
    fair = total / SHELLS.length;
  let piles = SHELLS.slice(),
    moves = 0;
  el.innerHTML =
    `<div class="wrow"><button type="button" class="ghost-btn" data-move>Move one shell</button><button type="button" class="ghost-btn" data-all>Share them all</button><button type="button" class="ghost-btn" data-reset>Start over</button></div>` +
    `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const level = piles.every((n) => n === piles[0]);
    q("move").disabled = level;
    q("all").disabled = level;
    q("f").innerHTML = shareBars(piles, SHELL_NAMES, { level: level ? fair : null });
    q("e").textContent = `${piles.join(" + ")} = ${total}`;
    q("r").innerHTML = level
      ? `Everyone has <b>${fair}</b>. Shared equally, ${total} shells among ${SHELLS.length} friends is ${total} ÷ ${SHELLS.length} = ${fair}: the <b>mean</b>.`
      : `${moves ? `${moves} shell${moves === 1 ? "" : "s"} moved. ` : ""}The total stays ${total} however the shells move. Keep moving from the biggest pile to the smallest.`;
  };
  q("move").addEventListener("click", () => {
    const most = piles.indexOf(Math.max(...piles)),
      least = piles.indexOf(Math.min(...piles));
    piles[most]--;
    piles[least]++;
    moves++;
    draw();
  });
  q("all").addEventListener("click", () => {
    moves += piles.reduce((s, n) => s + Math.max(0, n - fair), 0);
    piles = piles.map(() => fair);
    draw();
  });
  q("reset").addEventListener("click", () => {
    piles = SHELLS.slice();
    moves = 0;
    draw();
  });
  draw();
}

/* data sets to balance, with the axis to show them on */
const BALANCE_SETS = [
  { id: "a", label: "1, 2, 2, 3, 7", values: [1, 2, 2, 3, 7], lo: 0, hi: 8 },
  { id: "b", label: "2, 4, 4, 5, 9, 12", values: [2, 4, 4, 5, 9, 12], lo: 0, hi: 12 },
];
/* Slide the fulcrum: the dot plot balances where the distances on the left add up to the distances on the right. */
function wBalance(el) {
  const q = Q(el),
    values = { at: 2 };
  let setId = "a";
  el.innerHTML =
    seg(
      "Data",
      BALANCE_SETS.map((b) => [b.id, b.label]),
    ) +
    `<div class="wrow">${stepper("at", "Fulcrum at")}</div>` +
    `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  let limits = { at: [0, 8] };
  const draw = () => {
    const set = BALANCE_SETS.find((b) => b.id === setId),
      at = values.at,
      leftSide = set.values.filter((v) => v < at).map((v) => at - v),
      rightSide = set.values.filter((v) => v > at).map((v) => v - at),
      leftTotal = leftSide.reduce((s, d) => s + d, 0),
      rightTotal = rightSide.reduce((s, d) => s + d, 0);
    press(el, setId);
    q("at").textContent = at;
    q("f").innerHTML = dotPlot(set.values, {
      lo: set.lo,
      hi: set.hi,
      fulcrum: at,
      dists: true,
      label: `Dot plot of ${set.label} on a fulcrum at ${at}`,
    });
    q("e").innerHTML =
      `left: ${leftSide.join(" + ") || "0"} = ${leftTotal}<br>right: ${rightSide.join(" + ") || "0"} = ${rightTotal}`;
    q("r").innerHTML =
      leftTotal === rightTotal
        ? `<span class="ok">Balanced!</span> The distances on each side both add up to ${leftTotal}. The balance point, <b>${at}</b>, is the mean: ${set.values.join(" + ")} = ${set.values.reduce((s, v) => s + v, 0)}, and ÷ ${set.values.length} is ${at}.`
        : `The distances add up to ${leftTotal} on the left and ${rightTotal} on the right, so it tips to the ${leftTotal > rightTotal ? "left" : "right"}. Move the fulcrum ${leftTotal > rightTotal ? "left" : "right"}.`;
  };
  onPick(el, (id) => {
    setId = id;
    const set = BALANCE_SETS.find((b) => b.id === id);
    limits.at = [set.lo, set.hi];
    values.at = set.lo + 2;
    draw();
  });
  steppers(el, values, limits, draw);
  draw();
}

/* Change one of four quiz scores: the total, the mean, and the score that would make the mean a whole number. */
function wFindMean(el) {
  const q = Q(el),
    known = [6, 8, 9],
    values = { last: 5 };
  el.innerHTML =
    `<div class="wrow">${stepper("last", "Fourth score")}</div>` +
    `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const scores = [...known, values.last],
      total = scores.reduce((s, v) => s + v, 0),
      mean = total / scores.length;
    q("last").textContent = values.last;
    q("f").innerHTML = dotPlot(scores, {
      lo: 0,
      hi: 10,
      mean,
      xLabel: "quiz score (out of 10)",
      label: `Dot plot of ${scores.join(", ")}`,
    });
    q("e").textContent = `(${scores.join(" + ")}) ÷ 4 = ${total} ÷ 4 = ${fmt(mean)}`;
    q("r").innerHTML =
      `Add the scores, then share the total among 4: the mean is <b>${fmt(mean)}</b>.` +
      `<br><span class="dimline">Working backward: a mean of 7 needs a total of 7 · 4 = 28, so the fourth score would be 28 − 23 = 5.</span>`;
  };
  steppers(el, values, { last: [0, 10] }, draw);
  draw();
}

const STEPS = [
  {
    title: "A fair share",
    widget: wShare,
    body: "<p>The <b>mean</b> is what each would get if everything were shared equally. Moving from big piles to small ones never changes the total, so the level they end at is the total divided by how many.</p><p>Share the shells.</p>",
    check: {
      kind: "num",
      q: "Four friends have 6, 9, 3, and 6 stickers. If they share them equally, how many stickers does each friend get?",
      answer: 6,
      unit: "stickers",
      misc: [
        [24, "24 is the total. Share it among the 4 friends: 24 ÷ 4."],
        [8, "Divide by how many friends there are: 4, not 3."],
      ],
      explain: "6 + 9 + 3 + 6 = 24 stickers, and 24 ÷ 4 = 6 each.",
    },
  },
  {
    title: "The balance point",
    widget: wBalance,
    body: "<p>The mean is also where a dot plot would <b>balance</b>, like a seesaw. At the mean, the dots’ distances to the left add up to the same as their distances to the right.</p><p>Slide the fulcrum until it balances.</p>",
    check: {
      kind: "num",
      q: "At what number does this dot plot balance?",
      fig: dotPlot([2, 3, 3, 4, 8], { lo: 0, hi: 10, xLabel: "goals scored" }),
      answer: 4,
      unit: "goals",
      misc: [
        [
          3,
          "3 is the median, the middle value. The balance point is where the distances on each side are equal: the mean.",
        ],
        [5, "That’s halfway between the least and greatest values. The far-off 8 needs more than that: find the mean."],
      ],
      explain:
        "2 + 3 + 3 + 4 + 8 = 20, and 20 ÷ 5 = 4. The distances to 4 are 2 + 1 + 1 = 4 on the left and 4 on the right.",
    },
  },
  {
    title: "Finding the mean",
    widget: wFindMean,
    body: "<p>To find the mean, add all the values and divide by how many there are. To find a missing value, work backward: the mean times the count is the total.</p><p>Change the fourth score.</p>",
    check: {
      kind: "num",
      q: "The mean of 4 quiz scores is 8. Three of the scores are 6, 9, and 10. What is the fourth score?",
      answer: 7,
      unit: "points",
      misc: [
        [8, "The other three scores don’t average 8, so the fourth can’t be 8. Find the total first: 8 · 4 = 32."],
        [32, "32 is the total of all 4 scores. Subtract the 3 you know."],
      ],
      explain:
        "A mean of 8 for 4 scores means a total of 8 · 4 = 32. The three known scores add up to 25, so the fourth is 32 − 25 = 7.",
    },
  },
];
