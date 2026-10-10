/* Learn Measuring Length, Time, Liquid Volume, and Weight (Grade 3 Unit 6), chapter 2: Line plots. Its widgets and steps;
   loaded by line-plots.html. */
/* pencil lengths in fourths of an inch: {length: how many} */
const PENCILS = { 17: 2, 18: 4, 19: 1, 20: 3, 22: 1 };
/* Tap a length on a line plot of pencils to see how many are that long. */
function wReadPlot(el) {
  /* picked: the length tapped last, in fourths (null before any tap) */
  const q = Q(el);
  let picked = null;
  el.innerHTML = `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const count = PENCILS[picked] || 0;
    q("f").innerHTML = lineplot(PENCILS, 16, 24, { d: 4, mixed: true, tap: true, mark: picked });
    q("r").innerHTML =
      picked === null
        ? "Each X is one pencil. Tap a length to count its Xs."
        : `${count ? pl(count, "pencil") : "No pencils"} ${count === 1 ? "is" : "are"} <b>${lenSay(picked)} inches</b> long.`;
  };
  el.addEventListener("click", (e) => {
    const tick = e.target.closest("[data-v]");
    if (!tick) return;
    picked = +tick.dataset.v;
    draw();
  });
  draw();
}
/* a length in fourths as the line plot writes it: 18 → "4 2/4" */
const lenSay = (k) => (k % 4 ? `${Math.floor(k / 4)} ${fr(k % 4, 4)}` : `${k / 4}`);
/* ribbon lengths to put on a line plot, in halves of an inch */
const RIBBONS = [7, 8, 7, 9, 6, 7, 8, 10];
/* Put the ribbons on a line plot one at a time: each one gets an X above its length. */
function wMakePlot(el) {
  /* placed: how many ribbons are on the plot */
  const q = Q(el);
  let placed = 0;
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Next ribbon</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const counts = {};
    RIBBONS.slice(0, placed).forEach((k) => (counts[k] = (counts[k] || 0) + 1));
    q("go").disabled = placed === RIBBONS.length;
    q("f").innerHTML = lineplot(counts, 5, 11, { d: 2, mixed: true, mark: placed ? RIBBONS[placed - 1] : null });
    const last = RIBBONS[placed - 1],
      say = (k) => (k % 2 ? `${Math.floor(k / 2)} ${fr(1, 2)}` : `${k / 2}`);
    q("r").innerHTML =
      `The ribbons measure ${RIBBONS.map((k) => (k % 2 ? `${Math.floor(k / 2)} 1/2` : k / 2)).join(", ")} inches.<br>` +
      (!placed
        ? "Press Next ribbon to put the first one on the plot."
        : placed === RIBBONS.length
          ? `<span class="ok">All ${RIBBONS.length} ribbons are on the plot. The most common length is 3 ${fr(1, 2)} inches.</span>`
          : `Ribbon ${placed} is ${say(last)} inches: an X above ${say(last)}.`);
  };
  q("go").onclick = () => {
    placed++;
    draw();
  };
  q("clr").onclick = () => {
    placed = 0;
    draw();
  };
  draw();
}
/* the quick checks' figures */
const F = {
  pencils: lineplot(PENCILS, 16, 24, { d: 4, mixed: true }),
  ribbons: lineplot({ 6: 1, 7: 3, 8: 2, 9: 1, 10: 1 }, 5, 11, { d: 2, mixed: true }),
};
const STEPS = [
  {
    title: "Read a line plot",
    widget: wReadPlot,
    body: "<p>A <b>line plot</b> shows measurements on a number line. Each X is one thing that was measured, above its length. Taller stacks mean more things are that long.</p><p>Tap a length to count the pencils.</p>",
    check: {
      kind: "num",
      q: "How many pencils are 5 inches long?",
      fig: F.pencils,
      answer: 3,
      unit: "pencils",
      misc: [[11, "That’s all the pencils. Count only the Xs above 5."]],
      explain: "There are 3 Xs above 5, so 3 pencils are 5 inches long.",
    },
  },
  {
    title: "Make a line plot",
    widget: wMakePlot,
    body: "<p>To make a line plot, draw a number line with the lengths you measured, in halves or fourths of an inch. Then put an X above the length of each thing.</p><p>Put the ribbons on the plot one at a time.</p>",
    check: {
      kind: "num",
      q: "How many ribbons are longer than 3 1/2 inches?",
      fig: F.ribbons,
      answer: 4,
      unit: "ribbons",
      misc: [[7, "That counts the ribbons that are exactly 3 1/2 inches. Longer means to the right of it."]],
      explain: "To the right of 3 1/2 there are 2 + 1 + 1 = 4 Xs.",
    },
  },
];
