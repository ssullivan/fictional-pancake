/* Learn Putting It All Together (Grade 6 Unit 9), chapter 3: Which was yessier? Its widgets and steps; loaded by
   yessier.html. */
/* Each class as a bar the same length, split into its yes part (gold) and its no part, so the parts show each class's share
   whatever its size. classes: [{name, yes, no}]; showPct: write the percent yes at the end of each bar. */
function yesBars(classes, { showPct = false } = {}) {
  const barW = 320,
    barH = 30,
    left = 8,
    rowH = 64;
  const markup = classes
    .map(({ name, yes, no }, i) => {
      const y = 24 + i * rowH,
        total = yes + no,
        yesW = total ? (barW * yes) / total : 0;
      return (
        `<text class="lbl s st dm" x="${left}" y="${y - 12}">class ${name}: ${yes} yes, ${no} no</text>` +
        `<rect class="vote-no" x="${left}" y="${y}" width="${barW}" height="${barH}"/>` +
        `<rect class="vote-yes" x="${left}" y="${y}" width="${yesW}" height="${barH}"/>` +
        (showPct && total
          ? `<text class="lbl s st gd" x="${left + barW + 8}" y="${y + barH / 2}">${fmt((100 * yes) / total)}%</text>`
          : "")
      );
    })
    .join("");
  return svgWrap(barW + 80, 24 + classes.length * rowH - 26, markup, "Each class’s yes and no votes");
}

/* IM's two classes: the yes choice won in both */
const POETRY = [
  { name: "A", yes: 24, no: 16 },
  { name: "B", yes: 18, no: 9 },
];
/* the ways to compare, and what each one says about POETRY */
const WAYS = [
  {
    id: "count",
    label: "Yes votes",
    text: "Class A has more yes votes, 24 to 18. But class A is bigger too, 40 students to 27, so counting yes votes doesn’t compare the classes <b>fairly</b>.",
  },
  {
    id: "ratio",
    label: "Yes to no",
    text: "Class A: 24 to 16 is 3 to 2, so 1.5 yes for every no. Class B: 18 to 9 is 2 to 1, so 2 yes for every no. <b>Class B</b> was more in favor.",
  },
  {
    id: "share",
    label: "Yes out of all",
    text: "Class A: 24 of 40 is 3/5. Class B: 18 of 27 is 2/3. 2/3 is more than 3/5, so <b>class B</b> was more in favor.",
  },
  {
    id: "pct",
    label: "Percent",
    text: "Class A: 24 of 40 is 60%. Class B: 18 of 27 is about 67%. <b>Class B</b> was more in favor.",
  },
];
/* Pick a way to compare the two classes' votes. */
function wWays(el) {
  const q = Q(el);
  let wayId = "count";
  el.innerHTML =
    seg(
      "Compare by",
      WAYS.map((w) => [w.id, w.label]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    press(el, wayId);
    q("f").innerHTML = yesBars(POETRY, { showPct: wayId === "pct" });
    q("r").innerHTML = WAYS.find((w) => w.id === wayId).text;
  };
  onPick(el, (id) => {
    wayId = id;
    draw();
  });
  draw();
}

/* Change class B's votes and compare its share of yes votes with class A's (15 yes, 5 no: 75%). */
function wShare(el) {
  const q = Q(el),
    classA = { name: "A", yes: 15, no: 5 },
    values = { yes: 20, no: 10 };
  el.innerHTML =
    `<div class="wrow">${stepper("yes", "Class B yes")}${stepper("no", "Class B no")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const classB = { name: "B", ...values },
      totalB = values.yes + values.no,
      /* compare 15/20 with yes/total by cross-multiplying, so equal shares come out exactly equal */
      diff = values.yes * 20 - 15 * totalB;
    q("yes").textContent = values.yes;
    q("no").textContent = values.no;
    q("f").innerHTML = yesBars([classA, classB], { showPct: true });
    if (!totalB) {
      q("r").innerHTML = "No one in class B has voted yet.";
      return;
    }
    const shares = `Class A: 15 of 20 is 75%. Class B: ${values.yes} of ${totalB} is ${fmt((100 * values.yes) / totalB)}%.`;
    q("r").innerHTML =
      `${shares} ` +
      (diff === 0
        ? "<b>Equally</b> in favor."
        : diff > 0
          ? "<b>Class B</b> was more in favor."
          : `<b>Class A</b> was more in favor${values.yes > 15 ? ", even though class B has more yes votes" : ""}.`);
  };
  steppers(el, values, { yes: [0, 30], no: [0, 30] }, draw);
  draw();
}

const STEPS = [
  {
    title: "Three ways to compare",
    widget: wWays,
    body: "<p>Two classes voted, and yes won in both. Which class was <b>more</b> in favor? The classes are different sizes, so the number of yes votes doesn’t tell you. Compare yes to no, yes out of the whole class, or the percent that voted yes.</p><p>Try each way.</p>",
    check: {
      kind: "mc",
      q: "Class A voted 26 yes and 14 no. Class B voted 31 yes and 19 no. Which class was more in favor?",
      answer: "a",
      choices: [
        { id: "a", label: "class A" },
        { id: "b", label: "class B" },
        { id: "c", label: "They were equally in favor" },
      ],
      why: {
        b: "Class B has more yes votes, but it’s bigger too. 26 of 40 is 65%, and 31 of 50 is 62%.",
        c: "Yes won in both, but the shares differ: 26 of 40 is 65%, and 31 of 50 is 62%.",
      },
      explain: "26 of 40 is 65%, and 31 of 50 is 62%, so class A was more in favor.",
    },
  },
  {
    title: "More votes, or more in favor?",
    widget: wShare,
    body: "<p>A bigger class can have more yes votes and still be less in favor. What matters is the <b>share</b>: the yes votes out of the whole class, as a fraction or a percent.</p><p>Change class B’s votes.</p>",
    check: {
      kind: "num",
      q: "In a class of 25, 17 students voted yes. What percent of the class voted yes?",
      answer: 68,
      unit: "%",
      misc: [
        [17, "17 is how many voted yes. Write it out of 100: 17 out of 25 = ? out of 100."],
        [32, "That’s the percent that voted no."],
      ],
      explain: "17 out of 25 = 68 out of 100 (multiply both by 4), so 68%.",
    },
  },
];
