/* Learn Probability and Sampling (Grade 7 Unit 8), chapter 4: Samples. Its widgets and steps; loaded by sampling.html. */
/* ways to pick 30 of a school's 600 students to ask about lunch: [label, fair?, why] */
const METHODS = [
  [
    "Names drawn from a hat",
    true,
    "Every student has the same chance to be picked, so the sample is likely to look like the whole school.",
  ],
  [
    "The soccer team",
    false,
    "Soccer players may eat differently from everyone else, and only some students could ever be picked.",
  ],
  ["Volunteers", false, "Only students who care enough to volunteer are counted."],
  ["The first 30 in line", false, "Students who rush to lunch may like it more than others."],
];
/* Pick a way to choose a sample: random picks are fair; the others leave some students out. */
function wMethod(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Sample",
      METHODS.map(([label], i) => [i, label]),
    ) + `<p class="readout" data-r></p>`;
  const draw = (index) => {
    const [label, fair, why] = METHODS[index];
    press(el, index);
    q("r").innerHTML =
      `${label}: ${fair ? `<span class="ok">a random sample.</span>` : `<span class="no">biased.</span>`} ${why}`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "Fair samples",
    widget: wMethod,
    body: "<p>The <b>population</b> is the whole group you want to know about; a <b>sample</b> is the part you actually ask. A sample is most likely to be <b>representative</b>, like the population, when it’s picked at random.</p><p>Pick a way to choose a sample.</p>",
    check: {
      kind: "mc",
      q: "A town wants to know how many residents would use a new library. Which sample is best?",
      choices: [
        { id: "a", label: "200 people at the old library" },
        { id: "b", label: "200 addresses picked at random from the town list" },
        { id: "c", label: "200 people who answer an online poll" },
      ],
      answer: "b",
      stack: true,
      why: {
        a: "People at a library already use libraries more than most.",
        c: "Only people who choose to answer are counted.",
      },
      explain: "A random pick from the whole town gives everyone the same chance to be asked.",
    },
  },
];
