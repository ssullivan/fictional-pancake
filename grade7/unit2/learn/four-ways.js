/* Learn Introducing Proportional Relationships (Grade 7 Unit 2), chapter 5: Four representations. Its widgets and steps;
   loaded by four-ways.html. */
/* stories, each with its letters, constant, and table headings: [label, story, y letter, x letter, k, [across, up]] */
const FOUR = [
  ["Tacos", "Each taco costs $2.50.", "c", "t", 2.5, ["tacos", "cost ($)"]],
  ["Printer", "The menu printer prints 6 pages each minute.", "p", "m", 6, ["time (minutes)", "pages"]],
  ["Shower", "The shower uses 2 gallons of water each minute.", "g", "m", 2, ["time (minutes)", "water (gallons)"]],
];
/* Pick a story: its table, equation, and graph all show the same constant. */
function wFour(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Story",
      FOUR.map(([label], i) => [i, label]),
    ) +
    `<p class="story" data-s></p><p class="eq" data-e></p><div class="four"><div data-t></div><div data-g></div></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [, story, yl, xl, k, heads] = FOUR[index],
      rows = [1, 2, 4].map((x) => ({ x, y: x * k }));
    press(el, index);
    q("s").textContent = story;
    q("e").innerHTML = `${mv(yl)} = ${fmt(k)}${mv(xl)}`;
    q("t").innerHTML = tableFig({ hx: heads[0], hy: heads[1] }, rows)(false);
    q("g").innerHTML = lineGraph(k, [{ x: 1, y: k, t: `(1, ${fmt(k)})` }], { xMax: 5, heads });
    q("r").innerHTML =
      `The constant <b>${fmt(k)}</b> is in all four: the story’s “each,” every row of the table (${rows[1].y} ÷ 2), ` +
      `the number in front of ${mv(xl)}, and the point (1, ${fmt(k)}) on the line.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "One relationship, four ways",
    widget: wFour,
    body: "<p>A proportional relationship can be shown as a story, a table, an equation, or a graph. Each one shows the same constant of proportionality, so you can go from any one to the others.</p><p>Pick a story.</p>",
    check: {
      kind: "mc",
      q: "A proportional relationship’s graph passes through (2, 7). Which equation matches it?",
      choices: [
        { id: "a", label: `${mv("y")} = 3.5${mv("x")}` },
        { id: "b", label: `${mv("y")} = ${mv("x")} + 5` },
        { id: "c", label: `${mv("y")} = 7${mv("x")}` },
      ],
      answer: "a",
      why: {
        b: "That works for (2, 7), but it isn’t proportional: at x = 0, y would be 5, not 0.",
        c: "7 is the y at x = 2. The constant is y at x = 1: 7 ÷ 2.",
      },
      explain: "7 ÷ 2 = 3.5, so the equation is y = 3.5x.",
    },
  },
];
