/* Learn Data Sets and Distributions (Grade 6 Unit 8), chapter 5: Variability and MAD. Its widgets and steps; loaded by
   mad.html. */
/* three data sets with the same mean, 6, and more and more spread */
const SPREADS = [
  { id: "a", label: "Close together", values: [5, 6, 6, 6, 7] },
  { id: "b", label: "Spread out", values: [3, 5, 6, 7, 9] },
  { id: "c", label: "Very spread out", values: [1, 2, 6, 10, 11] },
];
/* Pick a data set: each value's distance to the mean, and their average, the MAD. */
function wDistances(el) {
  const q = Q(el);
  let setId = "a",
    shown = true;
  el.innerHTML =
    seg(
      "Data",
      SPREADS.map((s) => [s.id, s.label]),
    ) +
    `<div class="wrow"><button type="button" class="ghost-btn" data-show></button></div>` +
    `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { values } = SPREADS.find((s) => s.id === setId),
      center = meanOf(values),
      distances = values.map((v) => Math.abs(v - center)),
      total = distances.reduce((s, d) => s + d, 0);
    press(el, setId);
    q("show").textContent = shown ? "Hide the distances" : "Show the distances";
    q("f").innerHTML = dotPlot(values, {
      lo: 0,
      hi: 12,
      mean: center,
      dists: shown,
      label: `Dot plot of ${values.join(", ")}`,
    });
    q("e").textContent = shown
      ? `MAD = (${distances.join(" + ")}) ÷ ${values.length} = ${total} ÷ ${values.length} = ${fmt(total / values.length)}`
      : `mean = ${center}`;
    q("r").innerHTML = shown
      ? `Each value’s distance to the mean, ${center}: ${distances.join(", ")}. On average the values are <b>${fmt(total / values.length)}</b> away from the mean: that’s the <b>mean absolute deviation</b> (MAD).`
      : `The mean is ${center}. How far is each value from it, on average? Show the distances.`;
  };
  onPick(el, (id) => {
    setId = id;
    draw();
  });
  q("show").addEventListener("click", () => {
    shown = !shown;
    draw();
  });
  draw();
}

/* two players' points in 5 games; B's last game can change */
const PLAYER_A = [8, 10, 9, 11, 12],
  PLAYER_B = [4, 15, 10, 6];
/* Change one of player B's games: compare the two players' means and MADs. */
function wPlayers(el) {
  const q = Q(el),
    values = { last: 15 };
  el.innerHTML =
    `<div class="wrow">${stepper("last", "B’s last game")}</div>` +
    `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const b = [...PLAYER_B, values.last],
      [meanA, madA, meanB, madB] = [meanOf(PLAYER_A), madOf(PLAYER_A), meanOf(b), madOf(b)];
    q("last").textContent = values.last;
    q("f").innerHTML =
      `<p class="figcap">Player A</p>${dotPlot(PLAYER_A, { lo: 0, hi: 20, step: 2, every: 4, mean: meanA, dists: true, xLabel: "points", label: "Player A’s points" })}` +
      `<p class="figcap">Player B</p>${dotPlot(b, { lo: 0, hi: 20, step: 2, every: 4, mean: meanB, dists: true, xLabel: "points", label: "Player B’s points" })}`;
    q("e").textContent = `A: mean ${fmt(meanA)}, MAD ${fmt(madA)}   B: mean ${fmt(meanB)}, MAD ${fmt(madB)}`;
    q("r").innerHTML =
      (Math.abs(meanA - meanB) < 0.01
        ? "They score the same on average. "
        : `On average, ${meanA > meanB ? "A" : "B"} scores more. `) +
      (madA < madB
        ? `A’s MAD is smaller, so A’s points stay closer to A’s mean: <b>A is more consistent</b>.`
        : madA > madB
          ? `B’s MAD is smaller, so <b>B is more consistent</b>.`
          : "Their MADs are the same: equally consistent.");
  };
  steppers(el, values, { last: [0, 20] }, draw);
  draw();
}

const STEPS = [
  {
    title: "Distances from the mean",
    widget: wDistances,
    body: "<p>Two data sets can have the same mean but different <b>variability</b>. To measure it, find each value’s distance from the mean, then the mean of those distances: the <b>mean absolute deviation</b>, or MAD. A bigger MAD means more spread out.</p><p>Pick a data set.</p>",
    check: {
      kind: "num",
      q: "The mean of 2, 4, 6, and 8 is 5. What is the MAD?",
      answer: 2,
      misc: [
        [8, "8 is the total of the distances (3 + 1 + 1 + 3). The MAD is their mean: divide by 4."],
        [0, "Signed differences (−3, −1, 1, 3) always add up to 0. Use distances, which are never negative."],
        [6, "That’s the range. The MAD is the average distance from the mean."],
      ],
      explain: "The distances from 5 are 3, 1, 1, and 3. They add up to 8, and 8 ÷ 4 = 2.",
    },
  },
  {
    title: "Comparing with mean and MAD",
    widget: wPlayers,
    body: "<p>To compare two groups, use both a center and a spread. The mean says what’s typical; the MAD says how much the values vary around it. A smaller MAD means more <b>consistent</b>.</p><p>Change player B’s last game.</p>",
    check: {
      kind: "mc",
      q: "Team A’s scores have a mean of 20 points and a MAD of 2. Team B’s have a mean of 20 points and a MAD of 6. Which is true?",
      stack: true,
      choices: [
        { id: "a", label: "Team A’s scores are more consistent." },
        { id: "b", label: "Team B’s scores are more consistent." },
        { id: "c", label: "Team B scores more on average." },
      ],
      answer: "a",
      why: {
        b: "A bigger MAD means the scores vary more. Team B’s MAD is 6, so its scores are less consistent.",
        c: "Both means are 20, so on average they score the same.",
      },
      explain:
        "The means are the same, 20. Team A’s smaller MAD, 2, means its scores stay closer to 20: more consistent.",
    },
  },
];
