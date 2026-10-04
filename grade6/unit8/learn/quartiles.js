/* Learn Data Sets and Distributions (Grade 6 Unit 8), chapter 7: Quartiles and IQR. Its widgets and steps; loaded by
   quartiles.html. */
/* sorted data sets, an odd and an even number of values */
const QUARTER_SETS = [
  { id: "odd", label: "11 values", values: [3, 5, 6, 8, 9, 10, 12, 13, 15, 16, 19] },
  { id: "even", label: "10 values", values: [2, 4, 5, 7, 8, 10, 12, 13, 15, 18] },
];
/* what each split shows */
const SPLIT_WORDS = [
  "The values are in order. Split them in half first.",
  "The median splits the data into a lower half and an upper half.",
  "The median of each half is a <b>quartile</b>: Q1 for the lower half, Q3 for the upper half.",
];
/* Split sorted data in steps: the median, then the medians of each half (Q1 and Q3), making four groups of about the same size. */
function wQuarters(el) {
  const q = Q(el);
  let setId = "odd",
    stage = 0;
  el.innerHTML =
    seg(
      "Data",
      QUARTER_SETS.map((s) => [s.id, s.label]),
    ) +
    `<div class="wrow"><button type="button" class="ghost-btn" data-next>Next split</button><button type="button" class="ghost-btn" data-reset>Start over</button></div>` +
    `<div class="chips" data-c></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { values } = QUARTER_SETS.find((s) => s.id === setId),
      n = values.length,
      half = Math.floor(n / 2),
      [q1, median, q3] = quartilesOf(values),
      /* which group each value is in: 0 to 3 for the quarters, or 'mid' for the middle value of an odd count */
      groupOf = (i) =>
        n % 2 && i === half ? "mid" : i < n / 2 ? (i < half / 2 ? 0 : 1) : i - Math.ceil(n / 2) < half / 2 ? 2 : 3;
    press(el, setId);
    q("next").disabled = stage === 2;
    q("c").innerHTML = values
      .map((v, i) => {
        const group = groupOf(i),
          cls = stage === 0 ? "" : group === "mid" ? " cur" : stage === 1 ? (group < 2 ? " lo" : " hi") : ` q${group}`;
        return `<span class="chip${cls}">${v}</span>`;
      })
      .join("");
    q("e").textContent =
      stage === 0
        ? `${n} values`
        : stage === 1
          ? `median = ${fmt(median)}`
          : `Q1 = ${fmt(q1)}   median = ${fmt(median)}   Q3 = ${fmt(q3)}`;
    q("r").innerHTML =
      SPLIT_WORDS[stage] +
      (stage === 1 && n % 2 ? ` With ${n} values, the middle one, ${median}, isn’t in either half.` : "") +
      (stage === 1 && !(n % 2) ? ` With ${n} values, the median, ${fmt(median)}, falls between two of them.` : "") +
      (stage === 2
        ? " Q1, the median, and Q3 split the data into four groups with about the same number of values."
        : "");
  };
  onPick(el, (id) => {
    setId = id;
    stage = 0;
    draw();
  });
  q("next").addEventListener("click", () => {
    stage = Math.min(2, stage + 1);
    draw();
  });
  q("reset").addEventListener("click", () => {
    stage = 0;
    draw();
  });
  draw();
}

/* eight values; the greatest can be moved farther away */
const SPREAD_BASE = [4, 6, 7, 8, 9, 10, 11],
  GREATEST = valuesFrom(12, 40, 4);
/* Move the greatest value: the range grows with it, but the IQR (the middle half) stays the same. */
function wIqr(el) {
  const q = Q(el),
    values = { top: 0 };
  el.innerHTML =
    `<div class="wrow">${stepper("top", "Greatest value")}</div>` +
    `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const data = [...SPREAD_BASE, GREATEST[values.top]],
      five = fiveOf(data),
      [, q1, , q3] = five;
    q("top").textContent = GREATEST[values.top];
    q("f").innerHTML = dotPlot(data, {
      lo: 0,
      hi: 40,
      step: 2,
      every: 10,
      box: five,
      label: `Dot plot and box plot of ${data.join(", ")}`,
    });
    q("e").textContent =
      `range = ${five[4]} − ${five[0]} = ${rangeOf(data)}   IQR = ${fmt(q3)} − ${fmt(q1)} = ${fmt(q3 - q1)}`;
    q("r").innerHTML =
      `The <b>range</b> uses only the two ends, so moving the greatest value changes it. The <b>interquartile range</b> (IQR) is Q3 − Q1, the spread of the middle half of the data, so it stays ${fmt(q3 - q1)}.`;
  };
  steppers(el, values, { top: [0, GREATEST.length - 1] }, draw);
  draw();
}

const STEPS = [
  {
    title: "Splitting into quarters",
    widget: wQuarters,
    body: "<p>The <b>quartiles</b> split sorted data into four groups of about the same size. The median splits it in half; then Q1 is the median of the lower half and Q3 the median of the upper half. With an odd number of values, the middle one is left out of both halves.</p><p>Split the data.</p>",
    check: {
      kind: "num",
      q: "What is Q1 for 2, 4, 5, 7, 8, 10, 12, 13, 15?",
      answer: 4.5,
      misc: [
        [5, "That keeps the median, 8, in the lower half. With 9 values, the lower half is just 2, 4, 5, 7."],
        [8, "8 is the median of all the values. Q1 is the median of the lower half."],
      ],
      explain: "The median is 8. The lower half is 2, 4, 5, 7, and its median is halfway between 4 and 5: Q1 = 4.5.",
    },
  },
  {
    title: "IQR and range",
    widget: wIqr,
    body: "<p>The <b>interquartile range</b>, IQR = Q3 − Q1, measures the spread of the middle half of the data. Unlike the range (greatest − least), it isn’t thrown off by one far-off value.</p><p>Move the greatest value.</p>",
    check: {
      kind: "num",
      q: "A data set’s five-number summary is 3, 6, 9, 13, 20 (minimum, Q1, median, Q3, maximum). What is the IQR?",
      answer: 7,
      misc: [
        [17, "That’s the range, 20 − 3. The IQR is Q3 − Q1."],
        [9, "That’s the median. The IQR is Q3 − Q1."],
      ],
      explain: "Q3 − Q1 = 13 − 6 = 7.",
    },
  },
];
