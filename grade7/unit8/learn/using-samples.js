/* Learn Probability and Sampling (Grade 7 Unit 8), chapter 5: Using samples. Its widgets and steps; loaded by
   using-samples.html. */
/* Change how many of a random sample of 20 students say yes: the same share of all 600 students is the estimate. */
function wShare(el) {
  const q = Q(el),
    n = 20,
    total = 600,
    values = { yes: 6 };
  el.innerHTML = `<div class="wrow">${stepper("yes", "Said yes")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const { yes } = values;
    q("yes").textContent = yes;
    q("r").innerHTML =
      `${yes} of the ${n} in the sample said yes: ${pFrac(yes, n)} of them. ` +
      `About the same share of all ${total} students: ${pFrac(yes, n)} × ${total} = <b>${fmt((yes / n) * total)}</b>.`;
  };
  steppers(el, values, { yes: [0, 20] }, draw);
  draw();
}

/* a population of 40 students' minutes of reading (mean 20) */
const READING = [
  8, 10, 12, 12, 14, 14, 15, 16, 16, 17, 18, 18, 18, 19, 19, 20, 20, 20, 20, 20, 20, 20, 21, 21, 22, 22, 22, 23, 24, 24,
  24, 25, 26, 26, 28, 28, 30, 30, 32, 6,
];
/* Take samples of 8 from the population: each sample's mean is near the population's, but they vary. Seeded, so the same
   samples come every time. */
function wSamples(el) {
  const q = Q(el);
  let random = seeded(11),
    means = [];
  el.innerHTML =
    `<div class="wrow"><button type="button" class="ghost-btn" data-take>Take a sample</button><button type="button" class="ghost-btn" data-reset>Start over</button></div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  let sample = [];
  const take = () => {
    /* 8 different students, picked at random */
    const left = READING.slice();
    sample = range(8).map(() => left.splice(Math.floor(random() * left.length), 1)[0]);
    means.push(meanOf(sample));
    draw();
  };
  const draw = () => {
    q("f").innerHTML = sample.length
      ? dotPlot(sample, { lo: 0, hi: 35, step: 1, every: 5, xLabel: "minutes of reading", mean: meanOf(sample) })
      : "";
    q("r").innerHTML = means.length
      ? `This sample’s mean: <b>${fmt(means[means.length - 1])}</b> minutes. Means so far: ${means.map(fmt).join(", ")}. ` +
        `The population’s mean is ${fmt(meanOf(READING))}: the samples land near it, but each one is a little different.`
      : "No samples yet. The population is 40 students.";
  };
  q("take").addEventListener("click", take);
  q("reset").addEventListener("click", () => {
    random = seeded(11);
    means = [];
    sample = [];
    draw();
  });
  draw();
}

/* pairs of samples: their means, the shared MAD, and the shape both share */
const PAIRS = [
  ["1 MAD apart", 14, 16],
  ["3 MADs apart", 12, 18],
];
/* Pick a pair of samples: the gap between their means, counted in MADs, says whether the populations really differ. */
function wCompare(el) {
  const q = Q(el),
    shape = [-3, -3, -1, -1, 1, 1, 3, 3],
    mad = 2;
  el.innerHTML =
    seg(
      "Samples",
      PAIRS.map(([label], i) => [i, label]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [, meanA, meanB] = PAIRS[index],
      gap = (meanB - meanA) / mad;
    press(el, index);
    q("f").innerHTML =
      `<p class="figcap">Sample A (mean ${meanA}, MAD ${mad})</p>${dotPlot(
        shape.map((d) => meanA + d),
        { lo: 5, hi: 25, mean: meanA },
      )}` +
      `<p class="figcap">Sample B (mean ${meanB}, MAD ${mad})</p>${dotPlot(
        shape.map((d) => meanB + d),
        { lo: 5, hi: 25, mean: meanB },
      )}`;
    q("r").innerHTML =
      `The means are ${meanB} − ${meanA} = ${meanB - meanA} apart, which is ${fmt(gap)} MAD${gap === 1 ? "" : "s"}. ` +
      (gap > 2
        ? `<span class="ok">More than 2 MADs: the populations are likely different.</span>`
        : `<span class="no">Not more than 2 MADs: the gap could be the luck of the samples.</span>`);
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "Estimating a share",
    widget: wShare,
    body: "<p>A random sample’s share is a good estimate for the whole population. If 6 of 20 students in the sample say yes, expect about 6/20 of the whole school to say yes.</p><p>Change the yes answers.</p>",
    check: {
      kind: "num",
      q: "In a random sample of 25 residents, 10 want a dog park. About how many of the town’s 2,000 residents want one?",
      answer: 800,
      unit: "residents",
      misc: [
        [10, "That’s the sample. Scale it up to 2,000."],
        [1200, "That’s about how many don’t."],
        [40, "That’s the percent. Find 40% of 2,000."],
      ],
      explain: "10/25 = 2/5, and 2/5 of 2,000 is 800.",
    },
  },
  {
    title: "Samples vary",
    widget: wSamples,
    body: "<p>Different random samples give different results. That’s <b>sampling variability</b>. Each sample’s mean is an estimate of the population’s mean, and most land close to it.</p><p>Take some samples.</p>",
    check: {
      kind: "mc",
      q: "Three random samples of the same population have means of 12, 15, and 13. What’s a good estimate of the population’s mean?",
      choices: [
        { id: "a", label: "About 13 or 14" },
        { id: "b", label: "Exactly 12" },
        { id: "c", label: "About 40" },
      ],
      answer: "a",
      why: {
        b: "One sample can be a little off. The samples together suggest about 13 or 14.",
        c: "That’s the sum of the means. Each one already estimates the mean.",
      },
      explain: "The samples’ means cluster around 13 to 14, so that’s a good estimate.",
    },
  },
  {
    title: "Comparing populations",
    widget: wCompare,
    body: "<p>To decide whether two populations really differ, compare samples from each. Find how far apart the means are, measured in MADs. More than about 2 MADs usually means a real difference; less could be chance.</p><p>Pick a pair of samples.</p>",
    check: {
      kind: "mc",
      q: "Sample A has a mean of 30 and sample B a mean of 34, and both have a MAD of 4. Are the populations likely different?",
      choices: [
        { id: "a", label: "Yes: 4 is a big difference" },
        { id: "b", label: "Not clearly: the means are only 1 MAD apart" },
      ],
      answer: "b",
      why: { a: "Compare the gap to the spread: 4 ÷ 4 = 1 MAD, not more than 2." },
      explain: "The gap is 4, which is 1 MAD. That could be chance.",
    },
  },
];
