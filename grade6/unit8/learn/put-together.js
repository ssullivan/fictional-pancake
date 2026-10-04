/* Learn Data Sets and Distributions (Grade 6 Unit 8), chapter 9: Using data to solve problems. Its widgets and steps; loaded
   by put-together.html. */
/* data sets of different shapes, and the summary that fits each */
const SUMMARY_SETS = [
  {
    id: "quiz",
    label: "Quiz scores",
    values: [5, 6, 6, 7, 7, 7, 8, 8, 9],
    lo: 0,
    hi: 10,
    step: 1,
    axis: "quiz score (out of 10)",
    says: "is roughly <b>symmetric</b>, so the mean and median are about the same. The <b>mean and MAD</b> describe it well.",
  },
  {
    id: "phone",
    label: "Phone minutes",
    values: [5, 10, 10, 15, 15, 20, 25, 40, 60, 90],
    lo: 0,
    hi: 90,
    step: 5,
    axis: "minutes on the phone",
    says: "is <b>skewed right</b>: a few students spent much longer. Those pull the mean up, so the <b>median and IQR</b> describe a typical student better.",
  },
  {
    id: "allowance",
    label: "Allowances",
    values: [5, 6, 6, 7, 8, 30],
    lo: 0,
    hi: 30,
    step: 1,
    axis: "weekly allowance ($)",
    says: "has one value far from the rest, $30. It pulls the mean above $10, so the <b>median and IQR</b> describe a typical allowance better.",
  },
];
/* Pick a data set: its mean and median, and which summary fits its shape. */
function wChoose(el) {
  const q = Q(el);
  let setId = "quiz";
  el.innerHTML =
    seg(
      "Data",
      SUMMARY_SETS.map((s) => [s.id, s.label]),
    ) + `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const set = SUMMARY_SETS.find((s) => s.id === setId),
      mean = meanOf(set.values),
      median = medianOf(set.values),
      [, q1, , q3] = fiveOf(set.values);
    press(el, setId);
    q("f").innerHTML = dotPlot(set.values, {
      lo: set.lo,
      hi: set.hi,
      step: set.step,
      every: set.hi > 30 ? 10 : set.hi > 10 ? 5 : 1,
      mean,
      median,
      xLabel: set.axis,
      label: `Dot plot of ${set.label.toLowerCase()}`,
    });
    q("e").textContent =
      `mean ${fmt(mean)}, MAD ${fmt(madOf(set.values))}   median ${fmt(median)}, IQR ${fmt(q3 - q1)}`;
    q("r").innerHTML = `This distribution ${set.says}`;
  };
  onPick(el, (id) => {
    setId = id;
    draw();
  });
  draw();
}

/* a solved problem with a mistake in it: each line, whether it's the mistake, and what to say about it */
const SOLVED = [
  { line: "The minutes are 12, 5, 9, 15, 7, 10.", bad: false, say: "That line just lists the data. It’s fine." },
  {
    line: "There are 6 values, so the median is halfway between the 3rd and 4th.",
    bad: false,
    say: "That’s right: with 6 values, the median is halfway between the two middle ones.",
  },
  {
    line: "The 3rd and 4th values are 9 and 15.",
    bad: true,
    say: "<b>That’s the mistake.</b> The values weren’t put in order. In order they’re 5, 7, 9, 10, 12, 15, so the 3rd and 4th are 9 and 10, and the median is 9.5.",
  },
  {
    line: "Halfway between 9 and 15 is 12, so the median is 12.",
    bad: false,
    say: "The arithmetic is right: halfway between 9 and 15 is 12. But the 9 and 15 came from the mistake above.",
  },
];
/* Andre's solved problem: tap each line to check it, and find the one with the mistake. */
function wSolved(el) {
  const q = Q(el);
  let picked = null;
  el.innerHTML =
    `<div class="solved"><p class="who">Andre found the median of 6 students’ reading times:</p>` +
    SOLVED.map((s, i) => `<button type="button" data-line="${i}">${s.line}</button>`).join("") +
    `</div><p class="readout" data-r></p>`;
  const draw = () => {
    el.querySelectorAll("[data-line]").forEach((b) => {
      const i = +b.dataset.line;
      b.setAttribute("aria-pressed", i === picked);
      b.classList.toggle("bad", SOLVED[i].bad);
      b.classList.toggle("fine", !SOLVED[i].bad);
    });
    q("r").innerHTML = picked === null ? "Which line has the mistake? Tap a line to check it." : SOLVED[picked].say;
  };
  el.addEventListener("click", (e) => {
    const b = e.target.closest("[data-line]");
    if (!b) return;
    picked = +b.dataset.line;
    draw();
  });
  draw();
}

const STEPS = [
  {
    title: "Which summary fits?",
    widget: wChoose,
    body: "<p>Choose the measures by the shape. For a roughly symmetric distribution, the <b>mean and MAD</b> work well. For a skewed one, or one with a value far from the rest, the <b>median and IQR</b> describe it better.</p><p>Pick a data set.</p>",
    check: {
      kind: "mc",
      q: "A dot plot of house prices on a street is skewed right: a few houses cost much more than the rest. Which measures describe a typical price and the spread best?",
      stack: true,
      choices: [
        { id: "a", label: "the median and IQR" },
        { id: "b", label: "the mean and MAD" },
        { id: "c", label: "the greatest price and the range" },
      ],
      answer: "a",
      why: {
        b: "The few very expensive houses pull the mean (and the MAD) up. The median and IQR aren’t thrown off by them.",
        c: "The greatest price is one far-off house, not a typical one.",
      },
      explain:
        "The distribution is skewed, so the median and IQR describe a typical price and the spread better than the mean and MAD.",
    },
  },
  {
    title: "Find the mistake",
    widget: wSolved,
    body: "<p>Checking someone else’s work is a good way to catch mistakes in your own. Andre found a median, but one line has a mistake.</p><p>Tap the line with the mistake.</p>",
    check: {
      kind: "num",
      q: "What is the correct median of 12, 5, 9, 15, 7, 10?",
      answer: 9.5,
      unit: "minutes",
      misc: [
        [12, "That’s Andre’s answer, from values that weren’t in order. Sort them first: 5, 7, 9, 10, 12, 15."],
        [9, "9 is one of the two middle values. The median is halfway between 9 and 10."],
        [10, "10 is one of the two middle values. The median is halfway between 9 and 10."],
      ],
      explain: "In order: 5, 7, 9, 10, 12, 15. The middle two are 9 and 10, so the median is 9.5 minutes.",
    },
  },
];
