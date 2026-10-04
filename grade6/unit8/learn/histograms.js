/* Learn Data Sets and Distributions (Grade 6 Unit 8), chapter 3: Histograms. Its widgets and steps; loaded by
   histograms.html. */
/* 30 students' heights in centimeters */
const HEIGHTS = [
  124, 128, 131, 134, 136, 137, 139, 141, 142, 143, 145, 145, 146, 147, 148, 149, 150, 151, 152, 152, 153, 155, 156,
  157, 158, 159, 161, 162, 165, 168,
];
/* how many values are in each interval width wide from lo up to hi (each interval includes its left end) */
const binCounts = (values, lo, hi, width) =>
  range(Math.round((hi - lo) / width)).map(
    (i) => values.filter((v) => v >= lo + i * width && v < lo + (i + 1) * width).length,
  );
/* Pick how wide the intervals are: the dot plot's dots are counted into bars. */
function wBins(el) {
  const q = Q(el);
  let width = 10;
  el.innerHTML =
    seg("Intervals", [
      ["5", "5 cm wide"],
      ["10", "10 cm wide"],
      ["25", "25 cm wide"],
    ]) + `<div class="fig" data-d></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const counts = binCounts(HEIGHTS, 120, 170, width);
    press(el, width);
    q("d").innerHTML = dotPlot(HEIGHTS, {
      lo: 120,
      hi: 170,
      every: 10,
      xLabel: "height (cm)",
      label: "Dot plot of 30 heights",
    });
    q("f").innerHTML = histogram(counts, { lo: 120, width, xLabel: "height (cm)", yLabel: "number of students" });
    q("r").innerHTML =
      `With intervals ${width} cm wide there are <b>${counts.length} bars</b>: ${counts.join(", ")}. Each bar counts the dots in its interval, including its left end.` +
      `<br><span class="dimline">${width === 5 ? "Narrow intervals show lots of detail, with some bumps." : width === 25 ? "Wide intervals hide the shape: only 2 bars." : "These intervals show the shape clearly: most students are from 140 to 160 cm."}</span>`;
  };
  onPick(el, (id) => {
    width = +id;
    draw();
  });
  draw();
}

/* how many students jumped in each interval of 10 inches, from 30 to 80 */
const JUMPS = [2, 6, 11, 8, 3];
/* Pick a bar: what it says about the data, and what it can't say. */
function wReadBar(el) {
  const q = Q(el),
    values = { bar: 3 };
  el.innerHTML =
    `<div class="wrow">${stepper("bar", "Bar")}</div>` + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const i = values.bar - 1,
      from = 30 + 10 * i;
    q("bar").textContent = values.bar;
    q("f").innerHTML = histogram(JUMPS, {
      lo: 30,
      width: 10,
      xLabel: "standing long jump (inches)",
      yLabel: "number of students",
      hi: i,
    });
    q("r").innerHTML =
      `Bar ${values.bar} goes from ${from} to ${from + 10} on the bottom and is ${JUMPS[i]} tall: <b>${JUMPS[i]} students jumped at least ${from} but less than ${from + 10} inches</b>. ` +
      `The histogram doesn’t say exactly how far each of them jumped.` +
      `<br><span class="dimline">The bottom shows the measurement (inches); the height shows how many. In a histogram the bars touch, because the intervals meet.</span>`;
  };
  steppers(el, values, { bar: [1, JUMPS.length] }, draw);
  draw();
}

/* histogram shapes, each with 7 bars of minutes of reading, and what the shape says */
const SHAPE_SETS = [
  {
    id: "sym",
    label: "Symmetric",
    counts: [1, 3, 6, 8, 6, 3, 1],
    says: "is <b>symmetric</b>: about the same on both sides of the middle. A typical value is near the middle, 30 to 40 minutes.",
  },
  {
    id: "right",
    label: "Skewed right",
    counts: [8, 9, 6, 3, 2, 1, 1],
    says: "is <b>skewed right</b>: most values are low, with a long tail of a few high values to the right.",
  },
  {
    id: "left",
    label: "Skewed left",
    counts: [1, 1, 2, 3, 6, 9, 8],
    says: "is <b>skewed left</b>: most values are high, with a long tail of a few low values to the left.",
  },
  {
    id: "two",
    label: "Two peaks",
    counts: [2, 6, 3, 1, 3, 7, 2],
    says: "has <b>two peaks</b>: two groups, one reading about 10 to 20 minutes and one about 50 to 60. A single typical value describes neither group well.",
  },
  {
    id: "flat",
    label: "Flat",
    counts: [4, 4, 4, 4, 4, 4, 4],
    says: "is <b>flat</b>: the values are spread evenly across every interval. That’s a lot of variability, even though the bars are all the same height.",
  },
];
/* Pick a shape: what it looks like and what it says about the data. */
function wShapes(el) {
  const q = Q(el);
  let shapeId = "sym";
  el.innerHTML =
    seg(
      "Shape",
      SHAPE_SETS.map((s) => [s.id, s.label]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const shape = SHAPE_SETS.find((s) => s.id === shapeId);
    press(el, shapeId);
    q("f").innerHTML = histogram(shape.counts, {
      lo: 0,
      width: 10,
      xLabel: "minutes of reading",
      yLabel: "number of students",
    });
    q("r").innerHTML = `This distribution ${shape.says}`;
  };
  onPick(el, (id) => {
    shapeId = id;
    draw();
  });
  draw();
}

const STEPS = [
  {
    title: "From dots to bars",
    widget: wBins,
    body: "<p>When there are many different values, a <b>histogram</b> groups them into intervals of the same width. Each bar’s height is <b>how many</b> values are in its interval. The bars touch, because the intervals meet.</p><p>Pick how wide the intervals are.</p>",
    check: {
      kind: "num",
      q: "Using the histogram of heights with intervals 10 cm wide, how many students are <b>150 cm or taller</b>?",
      fig: histogram(binCounts(HEIGHTS, 120, 170, 10), {
        lo: 120,
        width: 10,
        xLabel: "height (cm)",
        yLabel: "number of students",
      }),
      answer: 14,
      unit: "students",
      misc: [
        [10, "That’s only the bar from 150 to 160. Add the bar from 160 to 170 too."],
        [23, "The bar from 140 to 150 is for heights less than 150. Leave it out."],
      ],
      explain: "The bars from 150 to 160 and from 160 to 170 are 10 and 4 tall: 10 + 4 = 14 students.",
    },
  },
  {
    title: "Reading a histogram",
    widget: wReadBar,
    body: "<p>On a histogram, the bottom axis shows the measurement, in intervals, and the height of each bar shows how many values are in that interval. A histogram tells how many are in each interval, but not the exact values.</p><p>Pick a bar.</p>",
    check: {
      kind: "mc",
      q: "What does the bar from 40 to 50 tell you?",
      fig: histogram(JUMPS, { lo: 30, width: 10, xLabel: "standing long jump (inches)", yLabel: "number of students" }),
      stack: true,
      choices: [
        { id: "a", label: "6 students jumped at least 40 but less than 50 inches." },
        { id: "b", label: "40 students jumped 6 inches." },
        { id: "c", label: "6 students each jumped exactly 45 inches." },
      ],
      answer: "a",
      why: {
        b: "That swaps the axes. The bottom is the distance jumped; the height is how many students.",
        c: "A histogram doesn’t show exact values. The 6 jumps could be anywhere from 40 up to 50 inches.",
      },
      explain: "The bar covers 40 to 50 inches and is 6 tall: 6 students jumped at least 40 but less than 50 inches.",
    },
  },
  {
    title: "The shape of a distribution",
    widget: wShapes,
    body: "<p>A histogram shows a distribution’s <b>shape</b>: symmetric, skewed to one side with a long tail, or with two peaks. The shape helps decide what’s typical.</p><p>Pick a shape.</p>",
    check: {
      kind: "mc",
      q: "Both groups have 21 students. Which group’s reading times have <b>more variability</b>?",
      fig:
        `<p class="figcap">Group A</p>${histogram([3, 3, 3, 3, 3, 3, 3], { lo: 0, width: 10, xLabel: "minutes of reading", label: "Histogram for group A: 3 in every interval" })}` +
        `<p class="figcap">Group B</p>${histogram([0, 1, 3, 13, 3, 1, 0], { lo: 0, width: 10, xLabel: "minutes of reading", label: "Histogram for group B: 13 in the middle interval" })}`,
      choices: [
        { id: "a", label: "Group A" },
        { id: "b", label: "Group B" },
        { id: "c", label: "They have the same variability" },
      ],
      answer: "a",
      why: {
        b: "Group B’s bars are bumpier, but most of its values are bunched in one interval. That’s less variability.",
        c: "They have the same number of students, but group A’s values are spread across every interval and group B’s are bunched in the middle.",
      },
      explain:
        "Group A’s times are spread evenly from 0 to 70 minutes; group B’s are mostly from 30 to 40. Group A’s vary more, even though its histogram is flat.",
    },
  },
];
