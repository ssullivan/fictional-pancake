/* Learn Adding, Subtracting, and Working with Data (Grade 2 Unit 1), chapter 4: Bar graphs. Its widgets and steps; loaded by bar-graphs.html. */
/* Make a bar graph from a table: tap in each column to set its bar (tapping the top again takes one off). */
function wBuildBar(el) {
  /* heights: where each bar ends */
  const q = Q(el),
    heights = SNACKS.map(() => 0);
  el.innerHTML = `<table class="tally"><caption>Snacks our class chose</caption><tr><th>Snack</th><th>Students</th></tr>${SNACKS.map((snack) => `<tr><td>${snack.label}</td><td>${snack.n}</td></tr>`).join("")}</table><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    q("f").innerHTML = barGraph(
      SNACKS.map((snack, i) => ({ ...snack, n: heights[i] })),
      { edit: true, title: "Tap in each column to set its bar" },
    );
    const right = heights.filter((v, i) => v === SNACKS[i].n).length;
    q("r").innerHTML =
      right === SNACKS.length
        ? '<span class="ok">Your bar graph matches the table!</span>'
        : `Bars that match the table: <b>${right}</b> of ${SNACKS.length}`;
  };
  /* a tap target says which bar (data-r) and how high (data-v) */
  q("f").addEventListener("click", (e) => {
    const target = e.target.closest("[data-r]");
    if (target) {
      const bar = +target.dataset.r,
        v = +target.dataset.v;
      heights[bar] = heights[bar] === v ? v - 1 : v;
      draw();
    }
  });
  draw();
}
const BOOKS = [
  { label: "Mai", n: 4, c: "green" },
  { label: "Diego", n: 7, c: "blue" },
  { label: "Elena", n: 5, c: "red" },
];
/* Tap a snack to read its bar. */
function wReadBar(el) {
  /* picked: the bar picked (-1 for none) */
  const q = Q(el);
  let picked = -1;
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow">${SNACKS.map((snack, i) => `<button type="button" class="ghost-btn" data-row="${i}">${snack.label}</button>`).join("")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    q("f").innerHTML = barGraph(SNACKS, { hi: picked, title: "Snacks our class chose" });
    q("r").innerHTML =
      picked < 0
        ? "Tap a snack to read its bar."
        : `Follow the top of the ${SNACKS[picked].label.toLowerCase()} bar across to the numbers: <b>${SNACKS[picked].n} students</b> chose ${SNACKS[picked].label.toLowerCase()}.`;
  };
  el.addEventListener("click", (e) => {
    const snackBtn = e.target.closest("[data-row]");
    if (snackBtn) {
      picked = +snackBtn.dataset.row;
      draw();
    }
  });
  draw();
}
const PETS = [
  { label: "Dogs", n: 7, pic: "dot", c: "yellow" },
  { label: "Cats", n: 5, pic: "dot", c: "blue" },
  { label: "Fish", n: 3, pic: "dot", c: "green" },
];
/* The same data as a picture graph or a bar graph. */
function wTwoGraphs(el) {
  /* kind: 'pic' or 'bar' */
  const q = Q(el);
  let kind = "pic";
  el.innerHTML =
    seg("Graph", [
      ["pic", "Picture graph"],
      ["bar", "Bar graph"],
    ]) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    press(el, kind);
    q("f").innerHTML =
      kind === "pic"
        ? picGraph(PETS, { title: "Pets our class has", unit: "1 pet" })
        : barGraph(PETS, { max: 8, title: "Pets our class has" });
    q("r").innerHTML =
      `Both graphs show <b>7 dogs, 5 cats, and 3 fish</b>. ${kind === "pic" ? "Here you count the pictures." : "Here you read where each bar stops."}`;
  };
  el.addEventListener("click", (e) => {
    const kindBtn = e.target.closest("[data-m]");
    if (kindBtn) {
      kind = kindBtn.dataset.m;
      draw();
    }
  });
  draw();
}
/* questions about the snacks graph: the question, the bar to light up (-1 for none), and the answer */
const ASK = [
  { q: "How many students chose yogurt?", hi: 2, a: "8 students. Read the top of the yogurt bar." },
  { q: "Which snack did the fewest students choose?", hi: 1, a: "Crackers: the shortest bar, 3 students." },
  { q: "How many students chose apples or carrots?", hi: -1, a: "6 + 5 = 11 students. Add the two bars." },
  {
    q: "Which snack tastes the best?",
    hi: -1,
    a: "The graph can’t answer that. It only shows how many students chose each snack.",
  },
];
/* Tap a question to see whether the graph can answer it. */
function wAsk(el) {
  /* asked: the question tapped (-1 for none) */
  const q = Q(el);
  let asked = -1;
  el.innerHTML = `<div class="fig" data-f></div><div class="chips">${ASK.map((ask, i) => `<button type="button" class="chip" data-a="${i}">${ask.q}</button>`).join("")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    el.querySelectorAll("[data-a]").forEach((b) => b.setAttribute("aria-pressed", +b.dataset.a === asked));
    q("f").innerHTML = barGraph(SNACKS, { hi: asked < 0 ? -1 : ASK[asked].hi, title: "Snacks our class chose" });
    q("r").innerHTML = asked < 0 ? "Tap a question. Can the graph answer it?" : ASK[asked].a;
  };
  el.addEventListener("click", (e) => {
    const question = e.target.closest("[data-a]");
    if (question) {
      asked = +question.dataset.a;
      draw();
    }
  });
  draw();
}
/* a bar graph of PETS with these counts, for a quick check's choices */
const petBars = (counts) =>
  barGraph(
    PETS.map((pet, i) => ({ ...pet, n: counts[i] })),
    { max: 8 },
  );
/* this chapter's quick-check figures (common.js has the shared ones) */
Object.assign(F, {
  books: barGraph(BOOKS, { title: "Books read this week" }),
  petsPic: picGraph(PETS, { title: "Pets our class has", unit: "1 pet" }),
});
const STEPS = [
  {
    title: "Build a bar graph",
    widget: wBuildBar,
    body: "<p>A <b>bar graph</b> shows each number as a bar. The numbers on the side tell how tall each bar is.</p><p>Tap in each column to make its bar match the table.</p>",
    check: {
      kind: "mc",
      q: "Which snack did the most students choose?",
      fig: F.snacks,
      choices: [
        { id: "apples", label: "Apples" },
        { id: "crackers", label: "Crackers" },
        { id: "yogurt", label: "Yogurt" },
        { id: "carrots", label: "Carrots" },
      ],
      answer: "yogurt",
      why: {
        apples: "Apples has a tall bar, 6, but yogurt’s bar is taller.",
        crackers: "Crackers has the shortest bar. That’s the fewest.",
        carrots: "Carrots has 5. Look for the tallest bar.",
      },
      explain: "Yogurt has the tallest bar: 8 students.",
    },
  },
  {
    title: "Read a bar graph",
    widget: wReadBar,
    body: "<p>To read a bar, look at the top of the bar and follow the line across to the numbers.</p><p>Tap each snack to read its bar.</p>",
    check: {
      kind: "num",
      unit: "books",
      answer: 7,
      fig: F.books,
      q: "How many books did Diego read?",
      misc: [
        [4, "That’s Mai’s bar. Find the bar labeled Diego."],
        [5, "That’s Elena’s bar. Find the bar labeled Diego."],
        [16, "That’s all three bars together. Read only Diego’s bar."],
      ],
      explain: "The top of Diego’s bar lines up with 7.",
    },
  },
  {
    title: "Two graphs, same data",
    widget: wTwoGraphs,
    body: "<p>A picture graph and a bar graph can show the same numbers.</p><p>Switch between the two graphs.</p>",
    check: {
      kind: "mc",
      q: "Which bar graph shows the same data as this picture graph?",
      fig: F.petsPic,
      choices: [
        { id: "a", label: petBars([5, 7, 3]) },
        { id: "b", label: petBars([7, 5, 3]) },
        { id: "c", label: petBars([7, 5, 4]) },
      ],
      answer: "b",
      why: {
        a: "The dog and cat bars are switched. Dogs have 7 pictures.",
        c: "Count the fish again: 3 pictures, so the bar stops at 3.",
      },
      explain: "7 dogs, 5 cats, and 3 fish: the bars stop at 7, 5, and 3.",
    },
  },
  {
    title: "Ask the graph a question",
    widget: wAsk,
    body: "<p>A graph can answer questions about its numbers: how many, which is most, how many in all.</p><p>Tap each question. Can the graph answer it?</p>",
    check: {
      kind: "mc",
      stack: true,
      q: "Which question can this graph answer?",
      fig: F.snacks,
      choices: [
        { id: "a", label: "What time is snack?" },
        { id: "b", label: "How many students chose apples?" },
        { id: "c", label: "How many apples are at the store?" },
      ],
      answer: "b",
      why: {
        a: "The graph shows which snacks students chose, not times.",
        c: "The graph counts students’ choices, not apples at a store.",
      },
      explain: "The graph shows how many students chose each snack: 6 chose apples.",
    },
  },
];
