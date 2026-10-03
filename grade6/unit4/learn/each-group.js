/* Learn Dividing Fractions (Grade 6 Unit 4), chapter 4: How much in each group? Its widgets and steps; loaded by each-group.html. */
/* part of a container is full: A fills k of its d parts */
const FILLS = [
  { A: frac(5), k: 2, d: 3, c: "pitcher", of: "iced tea", u: ["cup", "cups"] },
  { A: frac(15), k: 1, d: 3, c: "pail", of: "water", u: ["cup", "cups"] },
  { A: frac(6), k: 3, d: 4, c: "bucket", of: "paint", u: ["gallon", "gallons"] },
  { A: frac(5, 4), k: 1, d: 2, c: "batch of rolls", of: "flour", u: ["cup", "cups"] },
  { A: frac(3, 4), k: 1, d: 3, c: "section of road", of: "new paving", u: ["mile", "miles"] },
];
/* Part of a container is full: find one part, then the whole (a button for each step). */
function wFill(el) {
  /* stage: 0 at the start, 1 one part found, 2 the whole */
  const q = Q(el);
  let fillIndex = 0,
    stage = 0;
  el.innerHTML =
    seg(
      "Problem",
      FILLS.map((fill, i) => [i, `${fx(fill.A)} fills ${fx(frac(fill.k, fill.d))}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Next step</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><div data-w></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* P: the fraction full; each: one part; W: the whole */
    const fill = FILLS[fillIndex],
      P = frac(fill.k, fill.d),
      each = fDiv(fill.A, frac(fill.k)),
      W = fDiv(fill.A, P);
    press(el, fillIndex);
    q("f").innerHTML = oneGroup(fill.d, fill.k, {
      top: [fill.A, unitOf(fill.A, fill.u)],
      each: stage ? [each, ""] : null,
      eachShaded: stage < 2,
      whole: stage > 1 ? [W, unitOf(W, fill.u)] : null,
      q: stage > 1 ? null : "whole",
      label: `Tape diagram: one ${fill.c} cut into ${fill.d} equal parts, ${fill.k} of them holding ${ftx(fill.A)} ${fill.u[1]}`,
    });
    q("go").disabled = stage >= 2;
    q("w").innerHTML = workLines(
      [
        fill.k === 1
          ? `1 ${PART[fill.d][0]} of the ${fill.c} is ${fx(fill.A)} ${unitOf(fill.A, fill.u)}.`
          : `${partName(fill.d, fill.k)} of the ${fill.c} is ${fx(fill.A)} ${unitOf(fill.A, fill.u)}, so 1 ${PART[fill.d][0]} is ${fx(fill.A)} ÷ ${fill.k} = ${fx(each)} ${unitOf(each, fill.u)}.`,
        `The whole ${fill.c} is ${fill.d} ${PART[fill.d][1]}: ${fill.d} × ${fx(each)} = <b>${fx(W)} ${unitOf(W, fill.u)}</b>.`,
      ],
      stage,
    );
    q("r").innerHTML = !stage
      ? `${fx(fill.A)} ${unitOf(fill.A, fill.u)} of ${fill.of} fill ${fx(P)} of a ${fill.c}. How much fills the whole ${fill.c}? That’s ${fx(P)} × ? = ${fx(fill.A)}.`
      : stage < 2
        ? "Now fill the rest of the parts."
        : `<span class="ok">${fx(fill.A)} ÷ ${fx(P)} = ${fx(W)}. Check: ${fx(P)} × ${fx(W)} = ${fx(fill.A)}.</span><br><span class="dimline">Divide by ${fill.k === 1 ? "" : fill.k + " and multiply by "}${fill.d}: that’s the same as multiplying by ${fim(fInv(P))}.</span>`;
  };
  q("go").onclick = () => {
    stage++;
    draw();
  };
  q("clr").onclick = () => {
    stage = 0;
    draw();
  };
  onPick(el, (id) => {
    fillIndex = +id;
    stage = 0;
    draw();
  });
  draw();
}

/* two amounts to keep track of: a fills the fraction p of a container */
const TWO = [
  { a: frac(3, 4), p: frac(2, 5), top: "pounds of rice", bot: "containers", one: "pound" },
  { a: frac(5, 4), p: frac(5, 6), top: "gallons of water", bot: "buckets", one: "gallon" },
  { a: frac(3, 4), p: frac(3, 5), top: "liters of juice", bot: "bottles", one: "liter" },
];
/* a decimal written as a fraction, for the number line's labels */
const fFmt = (v) => ftx(toFrac(v));
/* A fraction of a pound fills a fraction of a container, on a double number line: how much fills 1, or what 1 fills. */
function wTwo(el) {
  /* ask: 'whole' (how much fills 1 container) or 'one' (what 1 unit fills) */
  const q = Q(el);
  let problemIndex = 0,
    ask = "whole";
  el.innerHTML = `<div data-top>${seg(
    "Problem",
    TWO.map((problem, i) => [i, `${fx(problem.a)} fills ${fx(problem.p)}`]),
  )}</div><div data-bot>${seg("Question", [
    ["whole", "How much fills 1?"],
    ["one", "What does 1 fill?"],
  ])}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    /* p is k/d of a container; perPart: the amount in 1/d of it; W: the amount that fills 1; one: what 1 unit fills */
    const problem = TWO[problemIndex],
      d = problem.p[1],
      k = problem.p[0],
      perPart = fVal(problem.a) / k,
      W = fDiv(problem.a, problem.p),
      one = fInv(W);
    q("top")
      .querySelectorAll("[data-m]")
      .forEach((b) => b.setAttribute("aria-pressed", b.dataset.m === String(problemIndex)));
    q("bot")
      .querySelectorAll("[data-m]")
      .forEach((b) => b.setAttribute("aria-pressed", b.dataset.m === ask));
    const ticks = range(d + 1).map((i) => ({
      t: i * perPart,
      b: i / d,
      st: i === 0 || i === k ? 1 : i === d && ask === "whole" ? 2 : 0,
      sb: i === 0 || i === k || i === d ? 1 : 0,
    }));
    if (ask === "one") ticks.push({ t: 1, b: fVal(one), st: 1, sb: 2 });
    ticks.sort((x, y) => x.t - y.t);
    q("f").innerHTML = dnl(problem.top, problem.bot, ticks, { ft: fFmt, fb: fFmt })(true);
    if (ask === "whole") {
      q("e").innerHTML =
        `${fx(problem.p)} × <span class="q">?</span> = ${fx(problem.a)}, so ${fx(problem.a)} ÷ ${fx(problem.p)} = ${fx(W)}`;
      q("r").innerHTML =
        `${fx(problem.a)} ${problem.top} fill ${fx(problem.p)} of the ${problem.bot.slice(0, -1)}. Each ${fr(1, d)} holds ${fx(problem.a)} ÷ ${k} = ${fx(frac(problem.a[0], problem.a[1] * k))}, and the whole is ${d} of those: <b>${fx(W)} ${problem.top.split(" ")[0]}</b> fill 1 ${problem.bot.slice(0, -1)}.`;
    } else {
      q("e").innerHTML = `<span class="q">?</span> × ${fx(W)} = 1, so 1 ÷ ${fx(W)} = ${fx(one)}`;
      q("r").innerHTML =
        `A full ${problem.bot.slice(0, -1)} holds ${fx(W)} ${problem.top.split(" ")[0]}. 1 ${problem.one} is <b>${fx(one)} of a ${problem.bot.slice(0, -1)}</b>.<br><span class="dimline">The two questions have reciprocal answers: ${fx(W)} and ${fx(one)}.</span>`;
    }
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") problemIndex = +id;
    else ask = id;
    draw();
  });
  draw();
}

/* buys: an amount of something for a price */
const PER = [
  { amt: frac(4, 5), price: 2, what: "baking soda", u: ["kilogram", "kilograms"] },
  { amt: frac(5, 2), price: 15, what: "fabric", u: ["yard", "yards"] },
  { amt: frac(3, 4), price: 3, what: "rope", u: ["meter", "meters"] },
  { amt: frac(5, 4), price: 10, what: "cheese", u: ["pound", "pounds"] },
];
/* How much for 1: a price for part of a unit, or for more than one. */
function wPer(el) {
  const q = Q(el);
  let buyIndex = 0;
  el.innerHTML =
    seg(
      "Buy",
      PER.map((buy, i) => [i, `${fx(buy.amt)} ${unitOf(buy.amt, buy.u)} for ${cash(buy.price)}`]),
    ) + `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    /* the amount is k/d: each 1/d costs `each`, and 1 unit costs `one` */
    const buy = PER[buyIndex],
      [k, d] = buy.amt,
      each = buy.price / k,
      one = (buy.price * d) / k;
    press(el, buyIndex);
    q("f").innerHTML =
      k < d
        ? oneGroup(d, k, {
            top: cash(buy.price),
            each: cash(each),
            eachShaded: true,
            whole: cash(one),
            label: `Tape diagram: 1 ${buy.u[0]} cut into ${d} parts, ${k} of them cost ${cash(buy.price)}`,
          })
        : groupTape(buy.amt, frac(1), {
            label: `Tape diagram: ${ftx(buy.amt)} ${buy.u[1]} with each whole ${buy.u[0]} bracketed`,
          });
    q("e").innerHTML =
      `${cash(buy.price)} ÷ ${fx(buy.amt)} = ${cash(buy.price)} × ${fim(fInv(buy.amt))} = ${cash(one)}`;
    q("r").innerHTML =
      `${fx(buy.amt)} ${unitOf(buy.amt, buy.u)} of ${buy.what} cost ${cash(buy.price)}. That’s ${partName(d, k)} of a ${buy.u[0]}, so 1 ${PART[d][0]} costs ${cash(buy.price)} ÷ ${k} = ${cash(each)}, and 1 ${buy.u[0]} (${d} ${PART[d][1]}) costs <b>${cash(one)}</b>.` +
      `<br><span class="dimline">${fx(buy.amt)} × ${cash(one)} = ${cash(buy.price)}: the price for 1 times how much you buy is what you pay.</span>`;
  };
  onPick(el, (id) => {
    buyIndex = +id;
    draw();
  });
  draw();
}

const STEPS = [
  {
    title: "Part of the group is known",
    widget: wFill,
    body:
      "<p>Jada pours 5 cups of iced tea and fills " +
      fr(2, 3) +
      " of a pitcher. How much does the whole pitcher hold? Here the <b>size of one group</b> (one pitcher) is unknown: " +
      fr(2, 3) +
      " × ? = 5, so 5 ÷ " +
      fr(2, 3) +
      " = ?. Find one part, then all the parts.</p><p>Pick a problem and go step by step.</p>",
    check: {
      kind: "num",
      unit: "cups",
      answer: 4 / 3,
      frac: true,
      q:
        "Mai picked 1 cup of strawberries. That’s enough for " +
        fr(3, 4) +
        " of a cake. How many cups does Mai need for the whole cake?",
      misc: [
        [0.75, "That’s " + fr(3, 4) + " of 1 cup. 1 cup is the part (3 fourths of the cake), and you need the whole."],
        [0.33, "That’s 1 fourth of the cake. The whole cake is 4 fourths."],
        [4, "You multiplied by 4 but didn’t divide by 3: 1 cup covers 3 fourths, not 1 fourth."],
      ],
      explain:
        "1 cup covers 3 fourths, so 1 fourth takes " +
        fr(1, 3) +
        " cup, and 4 fourths take " +
        fr(4, 3) +
        " = 1 " +
        fr(1, 3) +
        " cups. 1 ÷ " +
        fr(3, 4) +
        " = " +
        fr(4, 3) +
        ". Check: " +
        fr(3, 4) +
        " × 1 " +
        fr(1, 3) +
        " = 1.",
    },
  },
  {
    title: "Two amounts to keep track of",
    widget: wTwo,
    body:
      "<p>When " +
      fr(3, 4) +
      " pound of rice fills " +
      fr(2, 5) +
      " of a container, there are two wholes: 1 pound and 1 container. A double number line keeps both in line. You can ask how many pounds fill 1 container, or how much of a container 1 pound fills.</p><p>Pick a problem and a question.</p>",
    check: {
      kind: "num",
      unit: "kilograms",
      answer: 1.2,
      frac: true,
      q:
        fr(2, 5) +
        " kilogram of soil fills " +
        fr(1, 3) +
        " of a container. How many kilograms of soil fill the whole container?",
      misc: [
        [
          0.13,
          "That’s " +
            fr(1, 3) +
            " of " +
            fr(2, 5) +
            ". The soil fills only part of the container, so the whole container takes more.",
        ],
        [
          0.83,
          "That’s " +
            fr(1, 3) +
            " ÷ " +
            fr(2, 5) +
            ", how much of a container 1 kilogram fills. Divide the kilograms by the fraction of a container.",
        ],
      ],
      explain:
        fr(2, 5) +
        " fills 1 third, so 3 thirds take 3 × " +
        fr(2, 5) +
        " = " +
        fr(6, 5) +
        " = 1 " +
        fr(1, 5) +
        " kilograms. " +
        fr(2, 5) +
        " ÷ " +
        fr(1, 3) +
        " = 1 " +
        fr(1, 5) +
        ".",
    },
  },
  {
    title: "How much for 1?",
    widget: wPer,
    body:
      "<p>A price for part of a unit works the same way. If " +
      fr(4, 5) +
      " kilogram of baking soda costs $2, then each fifth costs $0.50, and 1 kilogram (5 fifths) costs $2.50. That’s $2 ÷ " +
      fr(4, 5) +
      ".</p><p>Pick something to buy.</p>",
    check: {
      kind: "num",
      unit: "dollars",
      answer: 6,
      q: "3 " + fr(1, 2) + " yards of fabric cost $21. How much does 1 yard cost?",
      misc: [
        [73.5, "That’s $21 × 3 " + fr(1, 2) + ". 1 yard costs less than 3 " + fr(1, 2) + " yards: divide."],
        [3, "That’s the cost of half a yard: $21 ÷ 7 halves. A yard is 2 halves."],
        [0.17, "That’s 3 " + fr(1, 2) + " ÷ 21, yards for each dollar. Divide the cost by the yards."],
      ],
      explain:
        "3 " +
        fr(1, 2) +
        " yards is 7 halves, so each half costs $21 ÷ 7 = $3, and 1 yard costs 2 × $3 = $6. $21 ÷ 3 " +
        fr(1, 2) +
        " = 6.",
    },
  },
];
