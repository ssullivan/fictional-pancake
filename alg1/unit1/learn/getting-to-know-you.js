/* Learn One-variable Statistics (Algebra 1 Unit 1), chapter 1: Getting to know you (Lesson 1). Its widgets and steps;
   loaded by getting-to-know-you.html. */
/* a number as written in the readouts and on dot plot axes: at most one decimal place, with commas (stats.js uses it too) */
const fmt = (n) => (Math.round(n * 10) / 10).toLocaleString("en-US", { maximumFractionDigits: 1 });
/* how many times each answer comes up, most common first (ties in the order they first came up): [[answer, count], …] */
const tallyOf = (answers) => {
  const counts = new Map();
  answers.forEach((a) => counts.set(a, (counts.get(a) || 0) + 1));
  return [...counts].sort((a, b) => b[1] - a[1]);
};
/* answers as chips, one per person */
const answerChips = (answers) => answers.map((a) => `<span class="chip">${a}</span>`).join("");
/* a tally as chips: each answer with how many gave it */
const tallyChips = (answers) =>
  tallyOf(answers)
    .map(([a, n]) => `<span class="chip">${a} <b>×${n}</b></span>`)
    .join("");

/* The warm-up's four questions about potato chips. Each has a kind of answer (numbers or categories), whether the answers
   vary (statistical) or not, what it takes to answer it, and why it's the one that doesn't belong. */
const CHIP_QUESTIONS = [
  {
    id: "A",
    q: "How many potato chips are in this bag of chips?",
    numbers: true,
    varies: false,
    how: "count the chips in this one bag: 47",
    odd: "it’s the only one whose answer is a single number",
  },
  {
    id: "B",
    q: "What is the typical number of chips in a bag of chips?",
    numbers: true,
    varies: true,
    how: "count the chips in many bags (47, 52, 45, 50, 49, 53, …), then find a typical count",
    odd: "it’s the only one whose answers are numbers that vary, from bag to bag",
  },
  {
    id: "C",
    q: "What type of chips are these?",
    numbers: false,
    varies: false,
    how: "read this one bag: barbecue",
    odd: "it’s the only one whose answer is a single category",
  },
  {
    id: "D",
    q: "What type of chips do students in this class prefer?",
    numbers: false,
    varies: true,
    how: "ask everyone (barbecue, plain, sour cream, plain, jalapeño, …), then see which type comes up most",
    odd: "it’s the only one whose answers are categories that vary, from student to student",
  },
];
/* the four places a question can go: [numbers?, varies?, the cell's name] */
const SORT_CELLS = [
  [true, false, "One number"],
  [true, true, "Numbers that vary"],
  [false, false, "One category"],
  [false, true, "Categories that vary"],
];
/* Which one doesn't belong? Pick A to D: the question lights up in a 2 × 2 sort (numbers or categories, one answer or
   answers that vary), and each lands in a square of its own. */
function wOdd(el) {
  const q = Q(el);
  el.innerHTML =
    `<ol class="qlist">${CHIP_QUESTIONS.map((c) => `<li data-q="${c.id}"><b>${c.id}</b> ${c.q}</li>`).join("")}</ol>` +
    seg(
      "Question",
      CHIP_QUESTIONS.map((c) => [c.id, c.id]),
    ) +
    `<div class="sort" data-s></div><p class="readout" data-r></p>`;
  const draw = (id) => {
    const pick = CHIP_QUESTIONS.find((c) => c.id === id),
      /* the other question with the same kind of answer, and the other one with the same number of answers */
      sameKind = CHIP_QUESTIONS.find((c) => c !== pick && c.numbers === pick.numbers),
      sameCount = CHIP_QUESTIONS.find((c) => c !== pick && c.varies === pick.varies);
    press(el, id);
    el.querySelectorAll(".qlist li").forEach((li) => li.classList.toggle("cur", li.dataset.q === id));
    /* the sort: answers are numbers or categories across the top, one answer or answers that vary down the side */
    const cell = (numbers, varies) => {
      const here = CHIP_QUESTIONS.find((c) => c.numbers === numbers && c.varies === varies),
        name = SORT_CELLS.find(([n, v]) => n === numbers && v === varies)[2];
      return `<td class="${here === pick ? "cur" : ""}"><b>${here.id}</b><span>${name}</span></td>`;
    };
    q("s").innerHTML =
      `<table><thead><tr><th></th><th>Numbers</th><th>Categories</th></tr></thead><tbody>` +
      `<tr><th>One answer</th>${cell(true, false)}${cell(false, false)}</tr>` +
      `<tr><th>Answers vary</th>${cell(true, true)}${cell(false, true)}</tr>` +
      `</tbody></table>`;
    q("r").innerHTML =
      `<b>${pick.id} doesn’t belong</b>: ${pick.odd}. To answer it, ${pick.how}. ` +
      `${sameKind.id} also has ${pick.numbers ? "numbers" : "categories"} for answers, but ` +
      `${sameKind.varies ? "they vary" : "just one"}; ${sameCount.id} also has ` +
      `${pick.varies ? "answers that vary" : "just one answer"}, but ${sameCount.numbers ? "numbers" : "categories"}.`;
  };
  onPick(el, draw);
  draw("A");
}

/* Questions for 15 classmates, each with the 15 answers they gave, the unit of a number answer, and what different
   answers are called (for the readout: "7 different lengths").
   The first two are statistical (the answers vary); the last two have one answer for everyone. */
const SURVEY = [
  {
    id: "names",
    label: "Family names",
    q: "How many letters are in the family names of students in this class?",
    answers: [5, 7, 6, 8, 4, 6, 9, 5, 6, 7, 11, 6, 5, 8, 7],
    unit: "letters",
    kinds: "lengths",
  },
  {
    id: "birthdays",
    label: "Birthdays",
    q: "Which month has the most birthdays in this class?",
    answers: [
      "March",
      "July",
      "October",
      "January",
      "March",
      "August",
      "December",
      "May",
      "March",
      "October",
      "February",
      "June",
      "September",
      "July",
      "November",
    ],
    unit: "",
    kinds: "months",
  },
  {
    id: "periods",
    label: "Periods",
    q: "How many periods are there before math class?",
    answers: range(15).map(() => 3),
    unit: "",
    kinds: "counts",
  },
  {
    id: "start",
    label: "First bell",
    q: "What time does first period start?",
    answers: range(15).map(() => "8:05"),
    unit: "",
    kinds: "times",
  },
];
/* Pick a question and ask 15 classmates: when the answers vary, the data have variability and the question is
   statistical; when everyone gives the same answer, it isn't. */
function wSurvey(el) {
  const q = Q(el);
  let surveyId = "names",
    asked = false;
  el.innerHTML =
    seg(
      "Question",
      SURVEY.map((s) => [s.id, s.label]),
    ) +
    `<p class="eq sm" data-q></p><div class="wrow"><button type="button" class="ghost-btn" data-ask></button></div>` +
    `<div class="chips" data-c></div><div class="chips tally" data-t></div><p class="readout" data-r></p>`;
  const draw = () => {
    const survey = SURVEY.find((s) => s.id === surveyId),
      tally = tallyOf(survey.answers),
      different = tally.length,
      [top, topCount] = tally[0],
      isNumbers = typeof top === "number";
    press(el, surveyId);
    q("q").textContent = survey.q;
    q("ask").textContent = asked ? "Hide the answers" : "Ask 15 classmates";
    q("c").innerHTML = asked ? answerChips(survey.answers) : "";
    q("t").innerHTML = asked && different > 1 ? tallyChips(survey.answers) : "";
    /* the spread of number answers, from least to greatest */
    const spread = isNumbers
      ? ` (from ${Math.min(...survey.answers)} to ${Math.max(...survey.answers)} ${survey.unit})`
      : "";
    q("r").innerHTML = !asked
      ? "Before you ask: would different classmates give different answers?"
      : different > 1
        ? `15 answers, ${different} different ${survey.kinds}${spread}. They aren’t all the same, so the data have ` +
          `<b>variability</b>, and this is a <b>statistical question</b>. The data answer it: ` +
          `${top}${survey.unit ? ` ${survey.unit}` : ""} came up most, ${topCount} times.`
        : `<span class="no">All 15 classmates said ${top}</span>. With no variability there’s one answer, so this is ` +
          `<b>not a statistical question</b>: asking one person, or the schedule, would do.`;
  };
  onPick(el, (id) => {
    surveyId = id;
    asked = false;
    draw();
  });
  q("ask").addEventListener("click", () => {
    asked = !asked;
    draw();
  });
  draw();
}

/* A class survey: what 15 classmates answered for each question. Numerical ones get a dot plot (lo to hi on the axis);
   categorical ones a tally. why: what makes it that kind of data. */
const CLASS_DATA = [
  {
    id: "height",
    label: "Height",
    numerical: true,
    values: [158, 165, 171, 162, 168, 175, 160, 166, 163, 180, 155, 169, 172, 164, 167],
    lo: 150,
    hi: 185,
    every: 5,
    axis: "height (cm)",
    unit: "cm",
    why: "Heights are measurements",
  },
  {
    id: "siblings",
    label: "Siblings",
    numerical: true,
    values: [1, 2, 0, 1, 3, 1, 2, 0, 1, 4, 2, 1, 0, 1, 2],
    lo: 0,
    hi: 5,
    every: 1,
    axis: "number of siblings",
    unit: "siblings",
    why: "Numbers of siblings are counts",
  },
  {
    id: "zip",
    label: "Zip code",
    numerical: false,
    values: [
      "60614",
      "60618",
      "60625",
      "60618",
      "60640",
      "60614",
      "60625",
      "60618",
      "60614",
      "60647",
      "60618",
      "60625",
      "60614",
      "60640",
      "60618",
    ],
    why: "Zip codes are written with digits, but they’re labels for places",
  },
  {
    id: "season",
    label: "Season",
    numerical: false,
    values: [
      "summer",
      "fall",
      "summer",
      "winter",
      "spring",
      "summer",
      "fall",
      "summer",
      "spring",
      "summer",
      "fall",
      "winter",
      "summer",
      "spring",
      "fall",
    ],
    why: "Favorite seasons are names of groups",
  },
];
/* Pick a column of the class survey: numerical data go on a dot plot and their mean means something; categorical data
   are counted, and a zip code's "mean" is nonsense. */
function wKinds(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Survey question",
      CLASS_DATA.map((d) => [d.id, d.label]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (id) => {
    const data = CLASS_DATA.find((d) => d.id === id),
      numbers = data.values.map(Number),
      mean = meanOf(numbers);
    press(el, id);
    q("f").innerHTML = data.numerical
      ? dotPlot(numbers, {
          lo: data.lo,
          hi: data.hi,
          every: data.every,
          mean,
          xLabel: data.axis,
          label: `Dot plot of 15 classmates’ ${data.axis}`,
        })
      : `<div class="chips tally">${tallyChips(data.values)}</div>`;
    q("r").innerHTML = data.numerical
      ? `${data.why}, so this is <b>numerical data</b>. Adding and averaging make sense: the mean is ` +
        `${fmt(mean)} ${data.unit}. Numbers go on a number line, one dot for each classmate.`
      : `${data.why}, so this is <b>categorical data</b>. ` +
        (id === "zip"
          ? `Their “mean” is ${fmt(mean)}: not a zip code, and rounded to ${Math.round(mean)} it names a place where none ` +
            "of these classmates live. Count how many classmates are in each zip code instead."
          : "There’s nothing to average. Count how many classmates are in each category instead.");
  };
  onPick(el, draw);
  draw("height");
}

/* Topics to ask about: a question about one person or thing (one answer) and about a group (answers that vary), with
   the answers each gets. */
const REWRITES = [
  {
    id: "sleep",
    label: "Sleep",
    one: { q: "How many hours did Kiran sleep last night?", answers: [8] },
    group: {
      q: "How many hours do students in this class usually sleep on a school night?",
      answers: [8, 7, 9, 6, 8, 7, 10, 8, 7, 9, 6, 8, 8, 7, 9],
    },
  },
  {
    id: "trip",
    label: "Trip to school",
    one: { q: "How many minutes is Kiran’s trip to school?", answers: [12] },
    group: {
      q: "How many minutes are the trips to school for students in this class?",
      answers: [12, 25, 8, 15, 30, 10, 20, 5, 18, 12, 40, 15, 22, 10, 7],
    },
  },
  {
    id: "music",
    label: "Music",
    one: { q: "What is Kiran’s favorite kind of music?", answers: ["pop"] },
    group: {
      q: "What kinds of music do students at this school like best?",
      answers: ["pop", "hip-hop", "country", "pop", "rock", "hip-hop", "pop", "Latin", "R&B", "pop", "rock", "hip-hop"],
    },
  },
  {
    id: "price",
    label: "Chips",
    one: { q: "What does this bag of chips cost?", answers: ["$3.49"] },
    group: {
      q: "What do bags of chips cost at stores in our town?",
      answers: ["$3.49", "$2.99", "$4.29", "$3.79", "$1.99", "$3.49", "$4.99", "$2.49"],
    },
  },
];
/* Pick a topic, then ask about one person or a group: the same topic gives one answer or answers that vary. */
function wRewrite(el) {
  const q = Q(el);
  let topicId = "sleep",
    who = "one";
  el.innerHTML =
    `<div data-top>${seg(
      "Topic",
      REWRITES.map((t) => [t.id, t.label]),
    )}</div>` +
    `<div data-bot>${seg("Ask about", [
      ["one", "One person or thing"],
      ["group", "A group"],
    ])}</div>` +
    `<p class="eq sm" data-q></p><div class="chips" data-c></div><p class="readout" data-r></p>`;
  const draw = () => {
    const topic = REWRITES.find((t) => t.id === topicId),
      asked = topic[who],
      count = asked.answers.length;
    press(q("top"), topicId);
    press(q("bot"), who);
    q("q").textContent = asked.q;
    q("c").innerHTML = answerChips(asked.answers);
    q("r").innerHTML =
      who === "one"
        ? `<span class="no">One answer: ${asked.answers[0]}</span>. It’s about one ` +
          `${topicId === "price" ? "thing" : "person"}, so there’s no variability: <b>not a statistical question</b>.`
        : `<span class="ok">${count} answers that vary</span>. It names a group to collect data from and expects ` +
          `the answers to differ: a <b>statistical question</b>.`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (row === "top") topicId = id;
    if (row === "bot") who = id;
    if (row) draw();
  });
  draw();
}

const STEPS = [
  {
    title: "Which one doesn’t belong?",
    widget: wOdd,
    body:
      "<p>Statistics is using data to answer questions. Here are four questions about potato chips. Each one is the odd one out for a different reason.</p>" +
      "<p>Two things set them apart. Some answers are <b>numbers</b> and some are <b>categories</b> (types, names, kinds). And some questions have <b>one answer</b>, while others get <b>answers that vary</b>, so you’d collect data to answer them.</p>" +
      "<p>Pick a question to see why it doesn’t belong.</p>",
    check: {
      kind: "mc",
      q: "Where does this question go? “What brand of phone do students at this school have?”",
      choices: [
        { id: "b", label: "Numbers that vary" },
        { id: "a", label: "Categories that vary" },
        { id: "c", label: "One category" },
        { id: "d", label: "One number" },
      ],
      answer: "a",
      why: {
        b: "A brand is a name, not a number, so the answers are categories.",
        c: "Different students have different brands, so the answers vary.",
        d: "A brand is a name, not a number, and different students have different ones.",
      },
      explain: "Brands are categories, and different students have different ones: categories that vary.",
    },
  },
  {
    title: "Statistical questions",
    widget: wSurvey,
    body:
      "<p>A <b>statistical question</b> is one you answer by collecting data that you expect to vary. Data have <b>variability</b> when not all the values are the same.</p>" +
      "<p>A <b>non-statistical question</b> has one answer, with no variability. You could answer it by looking it up or measuring once.</p>" +
      "<p>Pick a question and ask 15 classmates.</p>",
    check: {
      kind: "mc",
      q: "Which question is <em>not</em> a statistical question?",
      stack: true,
      choices: [
        { id: "b", label: "How tall are the students in this class?" },
        { id: "a", label: "How tall is the flagpole in front of the school?" },
        { id: "c", label: "How long does it take students in this class to get to school?" },
        { id: "d", label: "Which sport do students at this school like best?" },
      ],
      answer: "a",
      why: {
        b: "Students have different heights, so the answers vary: that’s statistical.",
        c: "Some students live close and some far, so the times vary: that’s statistical.",
        d: "Students like different sports, so the answers vary. Categories can vary too: that’s statistical.",
      },
      explain: "The flagpole has one height. Measure it once and you’re done: no variability.",
    },
  },
  {
    title: "Numbers or categories",
    widget: wKinds,
    body:
      "<p><b>Numerical data</b> are numbers you get by measuring or counting, like heights or numbers of siblings. Adding them, averaging them, and putting them on a number line all make sense.</p>" +
      "<p><b>Categorical data</b> are characteristics, like favorite seasons or phone brands. Some categories are written with digits, like zip codes and jersey numbers, but they’re labels. Ask: would the average mean anything?</p>" +
      "<p>Pick a question from the class survey.</p>",
    check: {
      kind: "mc",
      q: "A coach writes down the jersey number of every player on the team. What kind of data is that?",
      stack: true,
      choices: [
        { id: "b", label: "Numerical: the data are numbers" },
        { id: "a", label: "Categorical: the numbers are labels" },
        { id: "c", label: "Numerical: you can put them in order" },
      ],
      answer: "a",
      why: {
        b: "They’re written with digits, but they only name the players. The mean jersey number tells you nothing about the team.",
        c: "Putting labels in order doesn’t make them measurements: number 23 isn’t more of anything than number 7.",
      },
      explain: "A jersey number names a player, like a name on the back would. It’s a category.",
    },
  },
  {
    title: "Make it statistical",
    widget: wRewrite,
    body:
      "<p>A question about one person or one thing usually has one answer. To make it statistical, ask it about a group, so you’d collect data that vary: “students in this class,” “bags of chips,” “stores in our town.” Words like <b>typical</b> and <b>usually</b> are clues, too.</p>" +
      "<p>Pick a topic, then ask about one person or thing, or a group.</p>",
    check: {
      kind: "mc",
      q: "Which question turns “How many text messages did Ana send yesterday?” into a statistical question?",
      stack: true,
      choices: [
        { id: "b", label: "How many text messages did Ana send last week?" },
        { id: "a", label: "How many text messages do students at this school typically send in a day?" },
        { id: "c", label: "Did Ana send more than 50 text messages yesterday?" },
      ],
      answer: "a",
      why: {
        b: "That’s still one person over one week, so it still has one answer.",
        c: "That’s a yes or no about one person on one day: still one answer.",
      },
      explain: "Students at a school send different numbers of texts, so the data vary: it’s a statistical question.",
    },
  },
];
