/* Learn Data Sets and Distributions (Grade 6 Unit 8), chapter 8: Box plots. Its widgets and steps; loaded by boxplots.html. */
/* 11 students' scores on a 20-point quiz, and their five-number summary: 3, 6, 10, 15, 19 */
const SCORES = [3, 5, 6, 8, 9, 10, 12, 13, 15, 16, 19];
/* what each stage of building a box plot adds */
const BUILD_WORDS = [
  "Start with the dot plot of the 11 scores.",
  "Mark the <b>median</b>, 10: the middle score.",
  "Mark the quartiles, Q1 = 6 and Q3 = 15, and draw a <b>box</b> from Q1 to Q3, with a line at the median. The box holds the middle half of the data.",
  "Draw <b>whiskers</b> out to the minimum, 3, and the maximum, 19. Each whisker holds the lowest or highest quarter of the data.",
];
/* Build a box plot over its dot plot, one stage at a time. */
function wBuildBox(el) {
  const q = Q(el),
    [least, q1, median, q3, most] = fiveOf(SCORES);
  let stage = 0;
  el.innerHTML =
    `<div class="wrow"><button type="button" class="ghost-btn" data-next>Next step</button><button type="button" class="ghost-btn" data-reset>Start over</button></div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* a box with no whiskers is a five-number summary whose ends are the quartiles */
    const box = stage === 2 ? [q1, q1, median, q3, q3] : stage === 3 ? [least, q1, median, q3, most] : null;
    q("next").disabled = stage === 3;
    q("f").innerHTML = dotPlot(SCORES, {
      lo: 0,
      hi: 20,
      xLabel: "quiz score (out of 20)",
      median: stage === 1 ? median : null,
      box,
      label: `Dot plot of 11 quiz scores${box ? ", with a box plot" : ""}`,
    });
    q("r").innerHTML = BUILD_WORDS[stage];
  };
  q("next").addEventListener("click", () => {
    stage = Math.min(3, stage + 1);
    draw();
  });
  q("reset").addEventListener("click", () => {
    stage = 0;
    draw();
  });
  draw();
}

/* the four parts of the box plot, and the scores from one end to the other */
const BOX_PARTS = [
  { id: "w1", label: "Left whisker", from: 3, to: 6 },
  { id: "b1", label: "Left of the median", from: 6, to: 10 },
  { id: "b2", label: "Right of the median", from: 10, to: 15 },
  { id: "w2", label: "Right whisker", from: 15, to: 19 },
];
/* Pick a part of the box plot: its scores light up. Each part holds about a quarter of them, whatever its length. */
function wParts(el) {
  const q = Q(el);
  let partId = "w1";
  el.innerHTML =
    seg(
      "Part",
      BOX_PARTS.map((p) => [p.id, p.label]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const part = BOX_PARTS.find((p) => p.id === partId),
      inside = SCORES.filter((v) => v >= part.from && v <= part.to);
    press(el, partId);
    q("f").innerHTML = dotPlot(SCORES, {
      lo: 0,
      hi: 20,
      xLabel: "quiz score (out of 20)",
      box: fiveOf(SCORES),
      blue: (v) => v >= part.from && v <= part.to,
      label: `Dot plot and box plot of 11 scores, the ones from ${part.from} to ${part.to} in blue`,
    });
    q("r").innerHTML =
      `The ${part.label.toLowerCase()} goes from ${part.from} to ${part.to}, ${part.to - part.from} points long. The scores in it: ${inside.join(", ")}.` +
      `<br><span class="dimline">Every part holds about a quarter of the scores (the five numbers themselves sit on the edges). A longer part means its scores are more spread out, not that there are more of them.</span>`;
  };
  onPick(el, (id) => {
    partId = id;
    draw();
  });
  draw();
}

/* two classes' five-number summaries for the same 20-point quiz */
const CLASSES = { A: [4, 8, 11, 15, 19], B: [7, 10, 12, 13, 16] };
/* what to compare: the median (center), the IQR (spread of the middle half), or the range */
const COMPARISONS = [
  { id: "median", label: "Medians", of: (f) => f[2], word: "median", says: "a typical score" },
  { id: "iqr", label: "IQRs", of: (f) => f[3] - f[1], word: "IQR", says: "how spread out the middle half is" },
  {
    id: "range",
    label: "Ranges",
    of: (f) => f[4] - f[0],
    word: "range",
    says: "how far apart the lowest and highest scores are",
  },
];
/* Compare two classes' box plots by their medians, IQRs, or ranges. */
function wCompareBoxes(el) {
  const q = Q(el);
  let compareId = "median";
  el.innerHTML =
    seg(
      "Compare",
      COMPARISONS.map((c) => [c.id, c.label]),
    ) + `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const c = COMPARISONS.find((x) => x.id === compareId),
      a = c.of(CLASSES.A),
      b = c.of(CLASSES.B);
    press(el, compareId);
    q("f").innerHTML = dotPlot([], {
      lo: 0,
      hi: 20,
      xLabel: "quiz score (out of 20)",
      boxes: [
        { five: CLASSES.A, name: "Class A" },
        { five: CLASSES.B, name: "Class B" },
      ],
      label: `Box plots: class A ${CLASSES.A.join(", ")}; class B ${CLASSES.B.join(", ")}`,
    });
    q("e").textContent = `${c.word}: A ${a}, B ${b}`;
    q("r").innerHTML =
      `The ${c.word} shows ${c.says}. ` +
      (a === b
        ? `Both classes’ ${c.word}s are ${a}.`
        : `Class ${a > b ? "A" : "B"}’s ${c.word} is greater: ${Math.max(a, b)} compared with ${Math.min(a, b)}.`) +
      (c.id === "median"
        ? " Class B’s typical score is a little higher."
        : " Class A’s scores vary more; class B’s are more alike.");
  };
  onPick(el, (id) => {
    compareId = id;
    draw();
  });
  draw();
}

const STEPS = [
  {
    title: "Building a box plot",
    widget: wBuildBox,
    body: "<p>A <b>box plot</b> shows five numbers: the minimum, Q1, the median, Q3, and the maximum. Drawing it over the dot plot shows where those numbers come from.</p><p>Build the box plot one step at a time.</p>",
    check: {
      kind: "mc",
      q: "In a box plot, what does the line inside the box show?",
      choices: [
        { id: "a", label: "the median" },
        { id: "b", label: "the mean" },
        { id: "c", label: "the most common value" },
      ],
      answer: "a",
      why: {
        b: "A box plot is built from the five-number summary, which doesn’t include the mean. The line is the median.",
        c: "A box plot doesn’t show which value is most common. The line is the median, the middle value.",
      },
      explain: "The line inside the box is the median: half the data are below it and half above.",
    },
  },
  {
    title: "Each part is a quarter",
    widget: wParts,
    body: "<p>The five numbers split the data into four parts: the two whiskers and the two halves of the box. Each part holds <b>about a quarter</b> of the data, no matter how long it is. A long part means its values are spread out.</p><p>Pick a part of the box plot.</p>",
    check: {
      kind: "mc",
      q: "A box plot’s right whisker is much longer than its left whisker. Which is true?",
      stack: true,
      choices: [
        {
          id: "a",
          label: "Each whisker holds about a quarter of the data; the values in the right one are more spread out.",
        },
        { id: "b", label: "The right whisker holds more of the data than the left one." },
        { id: "c", label: "The whiskers aren’t data; only the box is." },
      ],
      answer: "a",
      why: {
        b: "Each whisker holds about a quarter of the data. A longer whisker means those values are more spread out, not that there are more of them.",
        c: "The whiskers are real data: the lowest quarter and the highest quarter of the values.",
      },
      explain:
        "Each whisker holds about a quarter of the values. The longer right whisker means the highest quarter of the values is spread out more.",
    },
  },
  {
    title: "Comparing box plots",
    widget: wCompareBoxes,
    body: "<p>Box plots drawn on the same number line make it easy to compare groups: the medians show which group is typically higher, and the IQRs show which is more spread out.</p><p>Compare the two classes.</p>",
    check: {
      kind: "mc",
      q: "Which class has the greater IQR?",
      fig: dotPlot([], {
        lo: 0,
        hi: 30,
        step: 2,
        every: 4,
        xLabel: "minutes",
        boxes: [
          { five: [10, 14, 17, 20, 26], name: "Class A" },
          { five: [12, 15, 16, 18, 22], name: "Class B" },
        ],
        label: "Box plots: class A 10, 14, 17, 20, 26; class B 12, 15, 16, 18, 22",
      }),
      choices: [
        { id: "a", label: "Class A" },
        { id: "b", label: "Class B" },
        { id: "c", label: "They’re the same" },
      ],
      answer: "a",
      why: {
        b: "Class B’s box goes from 15 to 18: an IQR of 3. Class A’s goes from 14 to 20: 6.",
        c: "The boxes are different widths: 6 for class A and 3 for class B.",
      },
      explain: "Class A’s IQR is 20 − 14 = 6, and class B’s is 18 − 15 = 3. Class A’s box is wider.",
    },
  },
];
