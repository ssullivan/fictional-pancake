/* Learn Putting It All Together (Grade 6 Unit 9), chapter 1: If our class were the world. Its widgets and steps; loaded by
   world.html. */
/* facts about the world's 8 billion people, rounded to "about num in den" (UN and ITU figures, 2024): what's true, and the
   words after "would" */
const FACTS = [
  { id: "young", label: "Under 15", are: "are under 15", be: "be under 15", frac: [1, 4] },
  { id: "asia", label: "Asia", are: "live in Asia", be: "live in Asia", frac: [3, 5] },
  { id: "net", label: "Internet", are: "use the internet", be: "use the internet", frac: [2, 3] },
  { id: "left", label: "Left-handed", are: "are left-handed", be: "be left-handed", frac: [1, 10] },
];
/* Pick a fact and a class size: the class's share is the class size × num/den, rounded to whole students. */
function wWorld(el) {
  const q = Q(el),
    values = { size: 20 };
  let factId = "young";
  el.innerHTML =
    seg(
      "Fact",
      FACTS.map((f) => [f.id, f.label]),
    ) +
    `<div class="wrow">${stepper("size", "Class size")}</div>` +
    `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const fact = FACTS.find((f) => f.id === factId),
      [num, den] = fact.frac,
      size = values.size,
      exact = (size * num) / den,
      students = Math.round(exact);
    press(el, factId);
    q("size").textContent = size;
    q("f").innerHTML = classFig(size, students, { label: `${students} of a class of ${size}` });
    q("e").textContent = `${size} ÷ ${den} × ${num} = ${fmt(exact)}`;
    q("r").innerHTML =
      `About ${num} in ${den} people in the world ${fact.are}. In a class of ${size}, about <b>${students}</b> students would ${fact.be}.` +
      (Number.isInteger(exact)
        ? ""
        : `<br><span class="dimline">${fmt(exact)} isn’t a whole number of students, so round to ${students}.</span>`);
  };
  onPick(el, (id) => {
    factId = id;
    draw();
  });
  steppers(el, values, { size: [10, 40] }, draw);
  draw();
}

/* class sizes that split 8 billion into friendly pieces */
const CLASSES = [20, 32, 40];
/* Pick a class size and a number of students: each student stands for 8 billion ÷ the class size. */
function wBack(el) {
  const q = Q(el),
    values = { students: 8 };
  let size = 40;
  el.innerHTML =
    seg(
      "Class size",
      CLASSES.map((n) => [n, `Class of ${n}`]),
    ) +
    `<div class="wrow">${stepper("students", "Students")}</div>` +
    `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const limits = { students: [1, size] };
  const draw = () => {
    const each = 8 / size,
      billions = values.students * each;
    press(el, size);
    q("students").textContent = values.students;
    q("f").innerHTML = classFig(size, values.students, { label: `${values.students} of a class of ${size}` });
    q("e").textContent = `${values.students} × ${fmt(each)} = ${fmt(billions)} billion`;
    q("r").innerHTML =
      `Each student stands for 8 billion ÷ ${size} = <b>${fmt(each)} billion</b> people (${fmt(each * 1000)} million). ` +
      `${values.students} student${values.students === 1 ? " stands" : "s stand"} for ${values.students} × ${fmt(each)} = <b>${fmt(billions)} billion</b> people.`;
  };
  onPick(el, (id) => {
    size = +id;
    limits.students = [1, size];
    values.students = Math.min(values.students, size);
    draw();
  });
  steppers(el, values, limits, draw);
  draw();
}

const STEPS = [
  {
    title: "The world as a class",
    widget: wWorld,
    body: "<p>There are about 8 billion people in the world: too many to picture. Shrink the world to a class, and keep every group the same share: if about 1 in 4 people in the world are under 15, about 1 in 4 students in the class would be too.</p><p>Pick a fact and change the class size.</p>",
    check: {
      kind: "num",
      q: "About 3 in 5 people in the world live in Asia. If the world were a class of 30, about how many students would live in Asia?",
      answer: 18,
      unit: "students",
      misc: [
        [6, "That’s 1 in 5. 3 in 5 is 3 of every 5: 30 ÷ 5 × 3."],
        [12, "That’s how many would <i>not</i> live in Asia. Find the 3 in 5 who would."],
      ],
      explain: "30 ÷ 5 = 6 groups of 5, and 3 from each group is 6 × 3 = 18 students.",
    },
  },
  {
    title: "From the class back to the world",
    widget: wBack,
    body: "<p>Going the other way, each student in the class stands for the same number of people in the world: 8 billion ÷ the class size. Multiply by the number of students to find how many people in the world.</p><p>Pick a class size and change the number of students.</p>",
    check: {
      kind: "num",
      q: "If the world (about 8 billion people) were a class of 20, 12 students would live in Asia. About how many billion people live in Asia?",
      answer: 4.8,
      unit: "billion people",
      misc: [
        [12, "12 is the number of students. Each one stands for 8 ÷ 20 = 0.4 billion people."],
        [0.4, "That’s how many billion each student stands for. 12 students stand for 12 times as many."],
        [96, "Each student stands for 8 ÷ 20 billion, not 8 billion: 12 × 0.4."],
      ],
      explain: "Each student stands for 8 ÷ 20 = 0.4 billion people, so 12 students stand for 12 × 0.4 = 4.8 billion.",
    },
  },
];
