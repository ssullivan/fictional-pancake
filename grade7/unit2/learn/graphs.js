/* Learn Introducing Proportional Relationships (Grade 7 Unit 2), chapter 4: Graphs of proportional relationships. Its
   widgets and steps; loaded by graphs.html. */
/* Change the constant: the points of the table lie on a straight line through (0, 0) and (1, k). */
function wLine(el) {
  const q = Q(el),
    values = { k: 3 };
  el.innerHTML = `<div class="wrow">${stepper("k", "Constant k")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { k } = values,
      points = range(6).map((x) => ({ x, y: k * x, cls: x === 1 ? "b" : "", t: x === 1 ? `(1, ${k})` : "" }));
    q("k").textContent = k;
    q("f").innerHTML = lineGraph(k, points, { xMax: 6, label: `The graph of y = ${k}x with its points` });
    q("r").innerHTML =
      `The points (0, 0), (1, ${k}), (2, ${2 * k}), … of ${mv("y")} = ${k}${mv("x")} all lie on a <b>straight line through (0, 0)</b>. ` +
      `It passes through <b>(1, ${k})</b>: at 1 across, it’s up ${k}, the constant.`;
  };
  steppers(el, values, { k: [1, 6] }, draw);
  draw();
}

/* points on the graph of tacos at $2.50 each, and what they mean */
const TACO_POINTS = [
  [0, "0 tacos cost $0. Every proportional graph starts here."],
  [1, "1 taco costs $2.50: the constant of proportionality."],
  [4, "4 tacos cost $10."],
];
/* Pick a point on the taco graph: across is tacos, up is dollars. */
function wPoint(el) {
  const q = Q(el),
    price = 2.5;
  el.innerHTML =
    seg(
      "Point",
      TACO_POINTS.map(([x], i) => [i, `(${x}, ${fmt(x * price)})`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [x, meaning] = TACO_POINTS[index];
    press(el, index);
    q("f").innerHTML = lineGraph(price, [{ x, y: x * price, t: `(${x}, ${fmt(x * price)})` }], {
      xMax: 6,
      heads: ["tacos", "cost ($)"],
      label: `The taco graph with the point (${x}, ${fmt(x * price)})`,
    });
    q("r").innerHTML = `(${x}, ${fmt(x * price)}) is ${x} across and ${fmt(x * price)} up: <b>${meaning}</b>`;
  };
  onPick(el, (id) => draw(+id));
  draw(1);
}

/* two trucks' prices per taco */
const TRUCK_PAIRS = [
  [3, 2],
  [2.5, 4],
  [3.5, 3],
];
/* Pick two trucks: the steeper line charges more for each taco. */
function wSteep(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Trucks",
      TRUCK_PAIRS.map(([a, b], i) => [i, `${money(a)} and ${money(b)}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [kA, kB] = TRUCK_PAIRS[index],
      /* each line runs from (0, 0) until it reaches the top, 24 */
      end = (k) => [Math.min(6, 24 / k), Math.min(6, 24 / k) * k];
    press(el, index);
    q("f").innerHTML = coordPlane(
      [
        { x: 2, y: 2 * kA, t: "A" },
        { x: 5, y: 5 * kB, t: "B", cls: "b" },
      ],
      {
        xMax: 6,
        yMax: 24,
        yStep: 4,
        xLabel: "tacos",
        yLabel: "cost ($)",
        shapes: [{ pts: [[0, 0], end(kA)] }, { pts: [[0, 0], end(kB)], cls: "walk" }],
        label: `Truck A at ${money(kA)} a taco and truck B at ${money(kB)}`,
      },
    );
    const steeper = kA > kB ? "A" : "B";
    q("r").innerHTML =
      `Truck A’s line goes up ${money(kA)} for each taco, and truck B’s ${money(kB)}. ` +
      `Truck <b>${steeper}</b>’s line is <b>steeper</b>, so it charges more per taco.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* Swap the axes of the printer's graph: pages against minutes has k = 6, minutes against pages has k = 1/6. */
function wSwap(el) {
  const q = Q(el);
  el.innerHTML =
    seg("Graph", [
      ["pm", "pages up, minutes across"],
      ["mp", "minutes up, pages across"],
    ]) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (which) => {
    const pagesUp = which === "pm";
    press(el, which);
    q("f").innerHTML = pagesUp
      ? lineGraph(6, [{ x: 1, y: 6, t: "(1, 6)" }], { xMax: 5, heads: ["time (minutes)", "pages"] })
      : coordPlane([{ x: 6, y: 1, t: "(6, 1)" }], {
          xMax: 30,
          xStep: 6,
          yMax: 5,
          xLabel: "pages",
          yLabel: "time (minutes)",
          line: [1 / 6, 0],
          label: "The graph of minutes against pages",
        });
    q("r").innerHTML = pagesUp
      ? `Pages against minutes: up 6 for each minute across. <b>${mv("k")} = 6</b> pages per minute.`
      : `Minutes against pages: up 1 for each 6 pages across, so up 1/6 for each page. <b>${mv("k")} = 1/6</b> minute per page, the reciprocal of 6.`;
  };
  onPick(el, draw);
  draw("pm");
}

const STEPS = [
  {
    title: "A line through (0, 0)",
    widget: wLine,
    body: `<p>The graph of a proportional relationship is a <b>straight line through (0, 0)</b>. It also passes through (1, ${mv("k")}), where ${mv("k")} is the constant of proportionality.</p><p>Change the constant.</p>`,
    check: {
      kind: "num",
      q: "The graph of a proportional relationship is a line through (4, 10). What is the constant of proportionality?",
      answer: 2.5,
      misc: [
        [10, "That’s the y of the point. Divide it by its x: 10 ÷ 4."],
        [0.4, "That divides 4 by 10. The constant is y ÷ x."],
      ],
      explain: "10 ÷ 4 = 2.5, so the line also passes through (1, 2.5).",
    },
  },
  {
    title: "What a point means",
    widget: wPoint,
    body: "<p>Each point on the graph is a pair of numbers that go together: the first is across, the second is up. (0, 0) means none of one goes with none of the other, and (1, k) is the constant.</p><p>Pick a point.</p>",
    check: {
      kind: "mc",
      q: "A graph shows the miles a truck drives against the hours it drives. What does the point (3, 150) mean?",
      choices: [
        { id: "a", label: "In 3 hours, the truck drives 150 miles" },
        { id: "b", label: "In 150 hours, the truck drives 3 miles" },
        { id: "c", label: "The truck drives 3 miles an hour" },
      ],
      answer: "a",
      stack: true,
      why: {
        b: "That swaps the numbers. The first number, 3, is across: hours.",
        c: "3 is the hours, not the speed. The speed is 150 ÷ 3 = 50 miles per hour.",
      },
      explain: "3 across (hours) and 150 up (miles): in 3 hours, the truck drives 150 miles.",
    },
  },
  {
    title: "Steeper lines",
    widget: wSteep,
    body: "<p>When two proportional relationships share a graph, the <b>steeper</b> line has the greater constant of proportionality: it goes up more for each step across.</p><p>Compare two trucks.</p>",
    check: {
      kind: "mc",
      q: "Line A passes through (2, 8) and line B through (3, 9). Both start at (0, 0). Which has the greater constant of proportionality?",
      choices: [
        { id: "a", label: "Line A" },
        { id: "b", label: "Line B" },
        { id: "c", label: "They’re the same" },
      ],
      answer: "a",
      why: {
        b: "Line B’s point is higher, but it’s farther across. Divide: 9 ÷ 3 = 3, and 8 ÷ 2 = 4.",
        c: "Divide each y by its x: 8 ÷ 2 = 4 and 9 ÷ 3 = 3.",
      },
      explain: "Line A’s constant is 8 ÷ 2 = 4 and line B’s is 9 ÷ 3 = 3, so line A is steeper.",
    },
  },
  {
    title: "Two graphs for each relationship",
    widget: wSwap,
    body: "<p>You can graph a relationship either way round. Swapping the axes changes the constant to its <b>reciprocal</b>, just like going back in a table.</p><p>Swap the axes.</p>",
    check: {
      kind: "num",
      q: "A graph of pay (up) against hours (across) is a line through (1, 15). If you graph hours (up) against pay (across) instead, what is the constant of proportionality?",
      answer: 0.0667,
      frac: true,
      misc: [[15, "That’s the first graph’s constant. Swapping the axes gives the reciprocal, 1/15."]],
      explain: "Each dollar goes with 1/15 of an hour, so the constant is 1/15.",
    },
  },
];
