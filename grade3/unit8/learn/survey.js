/* Learn Putting It All Together (Grade 3 Unit 8), chapter 4: Survey and graph. Its widgets and steps; loaded by survey.html. */
/* two surveys' results: the graph's title and each answer's count */
const SURVEYS = [
  {
    button: "Recess games",
    title: "Favorite recess game",
    rows: [
      { label: "Tag", n: 25, c: "red" },
      { label: "Soccer", n: 35, c: "blue" },
      { label: "Jump rope", n: 15, c: "green" },
      { label: "Swings", n: 30, c: "yellow" },
    ],
  },
  {
    button: "Getting to school",
    title: "How we get to school",
    rows: [
      { label: "Walk", n: 20, c: "red" },
      { label: "Bus", n: 40, c: "blue" },
      { label: "Car", n: 30, c: "green" },
      { label: "Bike", n: 10, c: "yellow" },
    ],
  },
];
/* the top of a bar graph's scale: room for the tallest bar and one more line, and at least 4 lines */
const topOf = (rows, scale) =>
  Math.max(scale * 4, Math.ceil(Math.max(...rows.map((row) => row.n)) / scale) * scale + scale);
/* items joined in a sentence: "a, b, and c" */
const andList = (items) =>
  items.length < 3 ? items.join(" and ") : `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
/* Graph a survey with a line every 2, 5, or 10 (two rows of buttons): which bars end between lines, and how many lines it takes. */
function wScale(el) {
  const q = Q(el);
  let surveyIndex = 0,
    scale = 2;
  el.innerHTML =
    `<div data-top>${seg(
      "Survey",
      SURVEYS.map((survey, i) => [i, survey.button]),
    )}</div>` +
    `<div data-bot>${seg(
      "Scale",
      [2, 5, 10].map((s) => [s, `A line every ${s}`]),
    )}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { title, rows } = SURVEYS[surveyIndex],
      top = topOf(rows, scale),
      lines = top / scale,
      /* the answers whose bars end between lines, and the best scale: the biggest one every bar ends on */
      offLine = rows.filter((row) => row.n % scale).map((row) => row.label),
      best = [10, 5, 2].find((s) => rows.every((row) => row.n % s === 0));
    press(q("top"), surveyIndex);
    press(q("bot"), scale);
    /* each line gets less room when there are many, so the graph stays about the same height */
    q("f").innerHTML = barGraph(rows, { max: top, scale, uh: Math.min(28, 300 / lines), title });
    q("r").innerHTML = offLine.length
      ? `${andList(offLine)} end${offLine.length === 1 ? "s" : ""} between lines, so ${offLine.length === 1 ? "it’s" : "they’re"} hard to read. Try another scale.`
      : scale === best
        ? `<span class="ok">The best scale: every bar ends on a line, with just ${lines} lines.</span>`
        : `Every bar ends on a line, but ${lines} lines is more to count than you need. Try a bigger scale.`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (row === "top") surveyIndex = +id;
    if (row === "bot") scale = +id;
    if (row) draw();
  });
  draw();
}
/* Tap two bars to compare them: how many more chose one than the other. A third tap starts again from that bar. */
function wAsk(el) {
  /* picked: the bars tapped, in order (at most 2) */
  const q = Q(el),
    { title, rows } = SURVEYS[0];
  let picked = [];
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [more, fewer] = [...picked].sort((a, b) => rows[b].n - rows[a].n),
      diff = picked.length === 2 ? rows[more].n - rows[fewer].n : 0;
    q("f").innerHTML = barGraph(rows, { max: 40, scale: 5, uh: 28, title, tap: true, hi: picked });
    q("r").innerHTML = !picked.length
      ? "Tap a bar, then another, to compare them."
      : picked.length === 1
        ? `${rows[picked[0]].label}: <b>${rows[picked[0]].n} students</b>. Tap another bar to compare.`
        : `${rows[more].label}: ${rows[more].n}. ${rows[fewer].label}: ${rows[fewer].n}. ${rows[more].n} − ${rows[fewer].n} = ${diff}.<br>` +
          `<span class="ok">${diff} more students chose ${rows[more].label} than ${rows[fewer].label}, so ${diff} fewer chose ${rows[fewer].label}.</span>`;
  };
  el.addEventListener("click", (e) => {
    const bar = e.target.closest("[data-r]");
    if (!bar) return;
    const i = +bar.dataset.r;
    if (picked.length === 1 && picked[0] === i) return;
    picked = picked.length === 2 ? [i] : [...picked, i];
    draw();
  });
  q("clr").onclick = () => {
    picked = [];
    draw();
  };
  draw();
}
/* the quick checks' figures */
const F = {
  bus: barGraph(
    [
      { label: "Bus", n: 70, c: "blue" },
      { label: "Walk", n: 40, c: "red" },
      { label: "Car", n: 20, c: "green" },
      { label: "Bike", n: 10, c: "yellow" },
    ],
    { max: 80, scale: 10, uh: 28, title: "How we get to school" },
  ),
};
const STEPS = [
  {
    title: "Choose a scale",
    widget: wScale,
    body: "<p>A survey asks a question and counts the answers. A bar graph of the counts needs a <b>scale</b>: how much each line counts for. A good scale makes every bar end on a line, without too many lines to count.</p><p>Pick a survey and try each scale.</p>",
    check: {
      kind: "mc",
      q: "A survey of favorite fruit: Apples 60, Pears 80, Plums 30, and Grapes 50. Which scale is best for a bar graph?",
      answer: "c",
      choices: [
        { id: "a", label: "A line every 2" },
        { id: "b", label: "A line every 5" },
        { id: "c", label: "A line every 10" },
      ],
      why: {
        a: "That needs 40 lines for Pears. The graph would be much too tall.",
        b: "Every bar ends on a line, but that needs 16 lines for Pears: more than you need.",
      },
      explain:
        "60, 80, 30, and 50 are all tens. With a line every 10, every bar ends on a line, and Pears needs just 8 lines.",
    },
  },
  {
    title: "Ask and answer",
    widget: wAsk,
    body: "<p>A graph answers questions. <b>How many more</b> or <b>how many fewer</b>: read both bars and subtract. Some questions take two steps: to compare one answer with two others together, add those two first.</p><p>Tap two bars to compare them.</p>",
    check: {
      kind: "num",
      q: "How many more students ride the bus than walk and bike together?",
      fig: F.bus,
      answer: 20,
      unit: "students",
      misc: [
        [30, "That compares the bus with walking only. Put walk and bike together first."],
        [60, "That compares the bus with biking only. Put walk and bike together first."],
        [50, "That’s walk and bike together. Now compare it with the bus."],
      ],
      explain: "Walk and bike together: 40 + 10 = 50. Bus: 70. 70 − 50 = 20.",
    },
  },
];
