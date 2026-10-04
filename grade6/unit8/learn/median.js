/* Learn Data Sets and Distributions (Grade 6 Unit 8), chapter 6: The median. Its widgets and steps; loaded by median.html. */
/* data sets with an odd number of values, as collected */
const MIDDLES = [
  { id: "a", label: "7 values", values: [9, 3, 12, 7, 5, 10, 6] },
  { id: "b", label: "9 values", values: [14, 8, 11, 20, 9, 13, 8, 16, 10] },
];
/* Put the values in order, then cross off the least and greatest, a pair at a time, until the middle one is left. */
function wMiddle(el) {
  const q = Q(el);
  let setId = "a",
    sorted = false,
    crossed = 0;
  el.innerHTML =
    seg(
      "Data",
      MIDDLES.map((m) => [m.id, m.label]),
    ) +
    `<div class="wrow"><button type="button" class="ghost-btn" data-sort>Put them in order</button><button type="button" class="ghost-btn" data-cross>Cross off the ends</button><button type="button" class="ghost-btn" data-reset>Start over</button></div>` +
    `<div class="chips" data-c></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { values } = MIDDLES.find((m) => m.id === setId),
      list = sorted ? sortUp(values) : values,
      pairs = (values.length - 1) / 2,
      done = crossed === pairs;
    press(el, setId);
    q("sort").disabled = sorted;
    q("cross").disabled = !sorted || done;
    q("c").innerHTML = list
      .map((v, i) => {
        const gone = i < crossed || i >= list.length - crossed;
        return `<span class="chip${gone ? " gone" : ""}${done && !gone ? " found" : ""}">${v}</span>`;
      })
      .join("");
    q("r").innerHTML = !sorted
      ? "First, put the values in order from least to greatest."
      : done
        ? `One value is left in the middle: the <b>median is ${list[pairs]}</b>. Half the values are below it and half above.`
        : `${crossed ? `${crossed} pair${crossed === 1 ? "" : "s"} crossed off. ` : ""}Cross off the least and the greatest until one value is left.`;
  };
  onPick(el, (id) => {
    setId = id;
    sorted = false;
    crossed = 0;
    draw();
  });
  q("sort").addEventListener("click", () => {
    sorted = true;
    draw();
  });
  q("cross").addEventListener("click", () => {
    crossed++;
    draw();
  });
  q("reset").addEventListener("click", () => {
    sorted = false;
    crossed = 0;
    draw();
  });
  draw();
}

/* 1st, 2nd, 3rd, 4th, …, as written */
const ordinal = (k) => `${k}${k === 1 ? "st" : k === 2 ? "nd" : k === 3 ? "rd" : "th"}`;
/* values collected in order; the widget uses the first few */
const COLLECTED = [12, 5, 9, 15, 7, 10, 3, 8];
/* Change how many values there are: with an odd count the median is the middle one, with an even count it's halfway between
   the two middle ones. */
function wEvenOdd(el) {
  const q = Q(el),
    values = { n: 6 };
  el.innerHTML =
    `<div class="wrow">${stepper("n", "How many values")}</div>` +
    `<div class="chips" data-c></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const n = values.n,
      sorted = sortUp(COLLECTED.slice(0, n)),
      half = Math.floor(n / 2),
      middles = n % 2 ? [half] : [half - 1, half];
    q("n").textContent = n;
    q("c").innerHTML = sorted
      .map((v, i) => `<span class="chip${middles.includes(i) ? " found" : ""}">${v}</span>`)
      .join("");
    q("e").textContent = `median = ${fmt(medianOf(sorted))}`;
    q("r").innerHTML =
      n % 2
        ? `${n} values, in order: the middle one is the ${ordinal(half + 1)}, so the <b>median is ${sorted[half]}</b>.`
        : `${n} values, in order: there are two middle values, ${sorted[half - 1]} and ${sorted[half]}. The <b>median is halfway between them</b>: (${sorted[half - 1]} + ${sorted[half]}) ÷ 2 = ${fmt(medianOf(sorted))}.`;
  };
  steppers(el, values, { n: [3, COLLECTED.length] }, draw);
  draw();
}

/* six commute times, in minutes; a seventh can be moved far away */
const COMMUTES = [8, 9, 10, 10, 11, 12],
  FAR = valuesFrom(12, 60, 4);
/* Move one value far from the rest: the mean is pulled along, but the median stays put. */
function wOutlier(el) {
  const q = Q(el),
    values = { far: 0 };
  el.innerHTML =
    `<div class="wrow">${stepper("far", "Seventh value")}</div>` +
    `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const far = FAR[values.far],
      data = [...COMMUTES, far],
      mean = meanOf(data),
      median = medianOf(data);
    q("far").textContent = far;
    q("f").innerHTML = dotPlot(data, {
      lo: 0,
      hi: 60,
      step: 2,
      every: 10,
      mean,
      median,
      xLabel: "minutes",
      label: `Dot plot of ${data.join(", ")}`,
    });
    q("e").textContent = `mean ${fmt(mean)}   median ${fmt(median)}`;
    q("r").innerHTML =
      far <= 16
        ? `With every value close together, the mean (${fmt(mean)}) and median (${fmt(median)}) are close too. Either describes a typical time.`
        : `The one far-off value pulls the mean up to ${fmt(mean)}, past almost every other value. The median stays at ${fmt(median)}. With a far-off value, <b>the median describes a typical time better</b>.`;
  };
  steppers(el, values, { far: [0, FAR.length - 1] }, draw);
  draw();
}

const STEPS = [
  {
    title: "The middle value",
    widget: wMiddle,
    body: "<p>The <b>median</b> is the middle value when the data are in order. Half the values are at or below it, and half at or above. The values must be sorted first.</p><p>Put the values in order, then cross off the ends.</p>",
    check: {
      kind: "num",
      q: "What is the median of 6, 2, 9, 4, 7?",
      answer: 6,
      misc: [
        [9, "9 is the middle of the list as written. Put the values in order first: 2, 4, 6, 7, 9."],
        [5.6, "That’s the mean. The median is the middle value of the sorted list."],
      ],
      explain: "In order: 2, 4, 6, 7, 9. The middle value is 6.",
    },
  },
  {
    title: "An even number of values",
    widget: wEvenOdd,
    body: "<p>With an even number of values there are two in the middle. The median is halfway between them: add them and divide by 2. It doesn’t have to be one of the values.</p><p>Change how many values there are.</p>",
    check: {
      kind: "num",
      q: "What is the median of 10, 3, 8, 5?",
      answer: 6.5,
      misc: [
        [5, "5 is one of the two middle values. The median is halfway between 5 and 8."],
        [8, "8 is one of the two middle values. The median is halfway between 5 and 8."],
        [5.5, "That’s halfway between the middle two as written, 3 and 8. Put the values in order first: 3, 5, 8, 10."],
      ],
      explain: "In order: 3, 5, 8, 10. The middle two are 5 and 8, and halfway between them is (5 + 8) ÷ 2 = 6.5.",
    },
  },
  {
    title: "Mean or median?",
    widget: wOutlier,
    body: "<p>The mean uses every value, so one value far from the rest pulls it toward that value. The median only cares about the middle, so it barely moves. When a distribution is skewed or has a far-off value, the median is usually a better typical value.</p><p>Move the seventh value.</p>",
    check: {
      kind: "mc",
      q: "Five friends’ weekly allowances are $5, $6, $6, $7, and $36. Which better describes a typical allowance?",
      choices: [
        { id: "a", label: "the median, $6" },
        { id: "b", label: "the mean, $12" },
        { id: "c", label: "the greatest, $36" },
      ],
      answer: "a",
      why: {
        b: "The one big allowance, $36, pulls the mean up to $12, more than four of the five friends get.",
        c: "Only one friend gets $36. It’s far from the others, not typical.",
      },
      explain: "$36 pulls the mean up to $12, but the median, $6, is right among the other allowances.",
    },
  },
];
