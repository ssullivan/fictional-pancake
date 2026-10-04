/* Learn Data Sets and Distributions (Grade 6 Unit 8), chapter 1: Statistical questions. Its widgets and steps; loaded by
   questions.html. */
/* questions to ask 8 people, with the 8 answers they'd give: the same answer every time, or answers that vary */
const ASKS = [
  {
    id: "pets",
    label: "Our pets",
    q: "How many pets do our classmates have?",
    answers: [2, 0, 1, 3, 1, 0, 2, 5],
  },
  {
    id: "lin",
    label: "Lin’s pets",
    q: "How many pets does Lin have?",
    answers: [2, 2, 2, 2, 2, 2, 2, 2],
  },
  {
    id: "ages",
    label: "Ages",
    q: "How old are the students in our school?",
    answers: [11, 12, 13, 11, 14, 12, 12, 13],
  },
  {
    id: "march",
    label: "March",
    q: "How many days are in March?",
    answers: [31, 31, 31, 31, 31, 31, 31, 31],
  },
];
/* Pick a question and ask 8 people: a statistical question gets answers that vary. */
function wAsk(el) {
  const q = Q(el);
  let askId = "pets",
    asked = false;
  el.innerHTML =
    seg(
      "Question",
      ASKS.map((a) => [a.id, a.label]),
    ) +
    `<p class="eq sm" data-q></p><div class="wrow"><button type="button" class="ghost-btn" data-ask></button></div>` +
    `<div class="chips" data-c></div><p class="readout" data-r></p>`;
  const draw = () => {
    const ask = ASKS.find((a) => a.id === askId),
      varies = new Set(ask.answers).size > 1;
    press(el, askId);
    q("q").textContent = ask.q;
    q("ask").textContent = asked ? "Hide the answers" : "Ask 8 people";
    q("c").innerHTML = asked ? ask.answers.map((a) => `<span class="chip">${a}</span>`).join("") : "";
    q("r").innerHTML = !asked
      ? "Would 8 different people give different answers? Ask them."
      : varies
        ? `<span class="ok">The answers vary</span>, from ${Math.min(...ask.answers)} to ${Math.max(...ask.answers)}. This is a <b>statistical question</b>: answering it takes data, and the data vary.`
        : `<span class="no">Every answer is ${ask.answers[0]}</span>. There’s just one answer, so this is <b>not a statistical question</b>.`;
  };
  onPick(el, (id) => {
    askId = id;
    asked = false;
    draw();
  });
  q("ask").addEventListener("click", () => {
    asked = !asked;
    draw();
  });
  draw();
}

/* data sets of each kind: categorical ones become bar graphs (rows), numerical ones dot plots (values on an axis) */
const KIND_SETS = [
  {
    id: "fruit",
    label: "Favorite fruit",
    kind: "categorical",
    rows: [
      { label: "apple", n: 6, c: "red" },
      { label: "banana", n: 4, c: "yellow" },
      { label: "grape", n: 7, c: "blue" },
      { label: "kiwi", n: 3, c: "green" },
    ],
  },
  {
    id: "pets",
    label: "Number of pets",
    kind: "numerical",
    values: [2, 0, 1, 3, 1, 0, 2, 5, 1, 1, 2, 0, 4, 1, 2, 3, 1, 0, 2, 1],
    lo: 0,
    hi: 6,
    axis: "number of pets",
  },
  {
    id: "travel",
    label: "Way to school",
    kind: "categorical",
    rows: [
      { label: "walk", n: 5, c: "green" },
      { label: "bus", n: 8, c: "yellow" },
      { label: "car", n: 6, c: "blue" },
      { label: "bike", n: 1, c: "red" },
    ],
  },
  {
    id: "sleep",
    label: "Hours of sleep",
    kind: "numerical",
    values: [8, 9, 7, 8, 10, 9, 8, 6, 9, 8, 7, 9, 8, 10, 9, 8, 7, 8, 9, 11],
    lo: 6,
    hi: 11,
    axis: "hours of sleep",
  },
];
/* Pick a data set: categories make a bar graph, numbers a dot plot on a number line. */
function wKinds(el) {
  const q = Q(el);
  let setId = "fruit";
  el.innerHTML =
    seg(
      "Data",
      KIND_SETS.map((d) => [d.id, d.label]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const set = KIND_SETS.find((d) => d.id === setId),
      count = set.rows ? set.rows.reduce((s, r) => s + r.n, 0) : set.values.length;
    press(el, setId);
    q("f").innerHTML = set.rows
      ? barGraph(set.rows, { max: 10, scale: 2, label: `Bar graph of ${set.label.toLowerCase()}` })
      : dotPlot(set.values, {
          lo: set.lo,
          hi: set.hi,
          xLabel: set.axis,
          label: `Dot plot of ${set.label.toLowerCase()}`,
        });
    q("r").innerHTML =
      set.kind === "categorical"
        ? `${set.label} is <b>categorical</b> data: each of the ${count} students gives a category, not a number. A <b>bar graph</b> shows how many are in each category, and the bars could go in any order.`
        : `${set.label} is <b>numerical</b> data: each of the ${count} students gives a number. Numbers go on a number line, so a <b>dot plot</b> fits: one dot for each student.`;
  };
  onPick(el, (id) => {
    setId = id;
    draw();
  });
  draw();
}

const STEPS = [
  {
    title: "Statistical or not?",
    widget: wAsk,
    body: "<p>A <b>statistical question</b> is answered with data that vary. “How many pets do our classmates have?” gets different answers from different people. “How many pets does Lin have?” has just one answer.</p><p>Pick a question and ask 8 people.</p>",
    check: {
      kind: "mc",
      q: "Which is a statistical question?",
      stack: true,
      choices: [
        { id: "a", label: "How long do sixth graders spend on homework each night?" },
        { id: "b", label: "How long did Mai spend on homework last night?" },
        { id: "c", label: "How many minutes are in an hour?" },
      ],
      answer: "a",
      why: {
        b: "That asks about one person on one night, so there’s just one answer.",
        c: "That has one answer, 60, that never varies.",
      },
      explain:
        "Different sixth graders spend different amounts of time on homework, so the answers vary: it’s a statistical question.",
    },
  },
  {
    title: "Two kinds of data",
    widget: wKinds,
    body: "<p>Data can be <b>numerical</b> (numbers, like heights or how many pets) or <b>categorical</b> (groups, like favorite fruit). The kind of data decides the display: categories go in a bar graph; numbers go on a number line, like a dot plot.</p><p>Pick a data set.</p>",
    check: {
      kind: "mc",
      q: "Which data set is numerical?",
      stack: true,
      choices: [
        { id: "a", label: "the heights of the players on a team" },
        { id: "b", label: "the favorite colors of the students in a class" },
        { id: "c", label: "the kinds of pets in a pet store" },
      ],
      answer: "a",
      why: {
        b: "Colors are categories, not numbers: that’s categorical data.",
        c: "Kinds of pets are categories, not numbers: that’s categorical data.",
      },
      explain: "Heights are numbers you could put on a number line, so they’re numerical data.",
    },
  },
];
