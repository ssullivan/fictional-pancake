/* Learn Data Sets and Distributions (Grade 6 Unit 8), chapter 2: Dot plots. Its widgets and steps; loaded by dotplots.html. */
/* 12 students' answers to "How many pets do you have?", in the order they answered */
const PET_ANSWERS = [2, 1, 0, 3, 1, 2, 4, 1, 2, 0, 1, 6];
/* Add the answers to a dot plot one at a time: each answer is a dot above its number. */
function wBuild(el) {
  const q = Q(el);
  let added = 0;
  el.innerHTML =
    `<div class="chips" data-c></div>` +
    `<div class="wrow"><button type="button" class="ghost-btn" data-add>Add the next answer</button><button type="button" class="ghost-btn" data-all>Add them all</button><button type="button" class="ghost-btn" data-reset>Start over</button></div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const shown = PET_ANSWERS.slice(0, added),
      done = added === PET_ANSWERS.length;
    q("add").disabled = done;
    q("all").disabled = done;
    q("c").innerHTML = PET_ANSWERS.map(
      (a, i) => `<span class="chip${i < added ? " found" : ""}${i === added - 1 ? " cur" : ""}">${a}</span>`,
    ).join("");
    q("f").innerHTML = dotPlot(shown, {
      lo: 0,
      hi: 6,
      xLabel: "number of pets",
      blue: added ? (v) => v === PET_ANSWERS[added - 1] : null,
      label: `Dot plot with ${added} answers`,
    });
    q("r").innerHTML = !added
      ? "12 students said how many pets they have. Add their answers to the dot plot."
      : done
        ? `All 12 answers are on the dot plot: <b>one dot for each student</b>. The tallest stack is at 1: the most common answer.`
        : `${added} of 12 answers so far. The last one, ${PET_ANSWERS[added - 1]}, went in the stack above ${PET_ANSWERS[added - 1]}.`;
  };
  q("add").addEventListener("click", () => {
    added = Math.min(added + 1, PET_ANSWERS.length);
    draw();
  });
  q("all").addEventListener("click", () => {
    added = PET_ANSWERS.length;
    draw();
  });
  q("reset").addEventListener("click", () => {
    added = 0;
    draw();
  });
  draw();
}

/* 20 students' scores on a quiz out of 10 */
const QUIZ = [7, 8, 6, 9, 10, 7, 8, 8, 5, 9, 7, 8, 10, 6, 8, 9, 7, 4, 8, 9];
/* Pick a score: how many students scored at least that much, and what fraction of the class that is. */
function wAtLeast(el) {
  const q = Q(el),
    values = { cut: 8 };
  el.innerHTML =
    `<div class="wrow">${stepper("cut", "At least")}</div>` +
    `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const cut = values.cut,
      count = QUIZ.filter((v) => v >= cut).length,
      common = gcd(count, QUIZ.length) || 1;
    q("cut").textContent = cut;
    q("f").innerHTML = dotPlot(QUIZ, {
      lo: 3,
      hi: 10,
      xLabel: "quiz score (out of 10)",
      blue: (v) => v >= cut,
      label: `Dot plot of 20 quiz scores, the ones at least ${cut} in blue`,
    });
    q("e").textContent =
      `${count} of ${QUIZ.length} = ${count}/${QUIZ.length}${common > 1 && count ? ` = ${count / common}/${QUIZ.length / common}` : ""}`;
    q("r").innerHTML =
      `<b>${count}</b> student${count === 1 ? "" : "s"} scored at least ${cut}: the blue dots. That’s ${count} out of ${QUIZ.length}, or ${fmt((100 * count) / QUIZ.length)}% of the class.` +
      `<br><span class="dimline">Count dots, not columns: each dot is one student.</span>`;
  };
  steppers(el, values, { cut: [4, 10] }, draw);
  draw();
}

/* two classes' travel times to school, in minutes: about the same typical time, but class B's spread out much more */
const TRAVEL = {
  A: [10, 12, 12, 13, 14, 14, 14, 15, 15, 16, 16, 18],
  B: [4, 6, 8, 10, 12, 14, 14, 16, 20, 22, 25, 28],
};
/* Pick a class and a guess at a typical travel time: how many dots are close to the guess (within 2 minutes). */
function wTypical(el) {
  const q = Q(el),
    values = { guess: 14 };
  let classId = "A";
  el.innerHTML =
    seg("Class", [
      ["A", "Class A"],
      ["B", "Class B"],
    ]) +
    `<div class="wrow">${stepper("guess", "Typical time")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const times = TRAVEL[classId],
      guess = values.guess,
      near = times.filter((v) => Math.abs(v - guess) <= 2).length;
    press(el, classId);
    q("guess").textContent = `${guess} min`;
    q("f").innerHTML = dotPlot(times, {
      lo: 0,
      hi: 30,
      step: 2,
      every: 4,
      xLabel: "minutes to get to school",
      mark: { v: guess, text: `guess ${guess}` },
      blue: (v) => Math.abs(v - guess) <= 2,
      label: `Dot plot of class ${classId}’s travel times`,
    });
    q("r").innerHTML =
      `${near} of class ${classId}’s 12 times are within 2 minutes of ${guess}. ` +
      (classId === "A"
        ? "Class A’s times are bunched together, from 10 to 18 minutes: <b>not very spread out</b>, so a typical time like 14 describes most students well."
        : "Class B’s times are spread from 4 to 28 minutes: <b>very spread out</b>, so no single typical time is close to most students.");
  };
  onPick(el, (id) => {
    classId = id;
    draw();
  });
  steppers(el, values, { guess: [4, 28] }, draw);
  draw();
}

const STEPS = [
  {
    title: "Building a dot plot",
    widget: wBuild,
    body: "<p>A <b>dot plot</b> shows numerical data on a number line, with one dot for each answer. Dots with the same value stack up, so you can see which values are common and how spread out the data are.</p><p>Add the answers one at a time.</p>",
    check: {
      kind: "num",
      q: "The dot plot shows the hours 15 students slept. How many students slept <b>at least 9 hours</b>?",
      fig: dotPlot([7, 8, 8, 9, 9, 9, 10, 8, 7, 9, 10, 8, 6, 9, 11], { lo: 6, hi: 11, xLabel: "hours of sleep" }),
      answer: 8,
      unit: "students",
      misc: [
        [3, "That counts the columns (9, 10, and 11). Count the dots: each one is a student."],
        [5, "Those are just the dots at 9. “At least 9” includes 10 and 11 too."],
      ],
      explain: "5 dots at 9, 2 at 10, and 1 at 11: 5 + 2 + 1 = 8 students.",
    },
  },
  {
    title: "How many, and what fraction",
    widget: wAtLeast,
    body: "<p>To answer a question with a dot plot, count the dots that fit. Comparing that count with the total gives a fraction or percent of the group.</p><p>Change the score.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "In the quiz above, what fraction of the 20 students scored <b>at least 9</b>?",
      answer: 0.3,
      misc: [
        [6, "6 is how many students. As a fraction of all 20: 6/20."],
        [14 / 20, "That’s the students who scored less than 9. At least 9 is the other 6."],
      ],
      explain: "6 students scored 9 or 10, out of 20: 6/20 = 3/10 (or 30%).",
    },
  },
  {
    title: "Typical and spread out",
    widget: wTypical,
    body: "<p>Two things describe a data set: a <b>typical</b> value (its center) and how <b>spread out</b> the values are. When the data are bunched together, one typical value describes most of them; when they’re spread out, it describes fewer.</p><p>Pick a class and move the typical time.</p>",
    check: {
      kind: "mc",
      q: "Which class’s travel times are more spread out?",
      fig:
        `<p class="figcap">Class A</p>${dotPlot(TRAVEL.A, { lo: 0, hi: 30, step: 2, every: 4, xLabel: "minutes", label: "Dot plot of class A’s travel times" })}` +
        `<p class="figcap">Class B</p>${dotPlot(TRAVEL.B, { lo: 0, hi: 30, step: 2, every: 4, xLabel: "minutes", label: "Dot plot of class B’s travel times" })}`,
      choices: [
        { id: "a", label: "Class B" },
        { id: "b", label: "Class A" },
        { id: "c", label: "They’re about the same" },
      ],
      answer: "a",
      why: {
        b: "Class A’s dots are bunched from 10 to 18 minutes. Class B’s stretch from 4 to 28.",
        c: "Both are centered near 14 minutes, but class B’s dots stretch much farther.",
      },
      explain: "Class B’s times go from 4 to 28 minutes; class A’s only from 10 to 18. Class B’s are more spread out.",
    },
  },
];
