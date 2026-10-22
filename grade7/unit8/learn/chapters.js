/* Learn Probability and Sampling (Grade 7 Unit 8): the unit's chapters and their icons. Loaded by learn.html and every
   chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has
   the format. */
const ICON = {
  chance:
    '<path d="M6,40 H58" stroke="#f3f6fb" stroke-width="2.5"/><path d="M6,34 v12 M32,34 v12 M58,34 v12" stroke="#f3f6fb" stroke-width="2.5"/><circle cx="44" cy="40" r="6" fill="#ffc93c"/>',
  estimate:
    '<rect x="8" y="34" width="10" height="22" fill="#ffc93c"/><rect x="22" y="22" width="10" height="34" fill="#6fb8ff"/><rect x="36" y="28" width="10" height="28" fill="#ffc93c"/><rect x="50" y="14" width="10" height="42" fill="#6fb8ff"/>',
  multi:
    '<circle cx="8" cy="32" r="4" fill="#f3f6fb"/><path d="M8,32 L28,16 M8,32 L28,48 M28,16 L54,8 M28,16 L54,24 M28,48 L54,40 M28,48 L54,56" stroke="#7fe3ff" stroke-width="2.5"/><path d="M8,32 L28,16 L54,24" fill="none" stroke="#ffc93c" stroke-width="3.5"/>',
  sample:
    '<g fill="#7fe3ff"><circle cx="12" cy="14" r="4"/><circle cx="26" cy="12" r="4"/><circle cx="40" cy="16" r="4"/><circle cx="54" cy="12" r="4"/><circle cx="16" cy="30" r="4"/><circle cx="32" cy="32" r="4"/><circle cx="48" cy="30" r="4"/><circle cx="12" cy="48" r="4"/><circle cx="28" cy="50" r="4"/><circle cx="44" cy="48" r="4"/><circle cx="56" cy="52" r="4"/></g><g fill="#ffc93c"><circle cx="26" cy="12" r="4"/><circle cx="48" cy="30" r="4"/><circle cx="12" cy="48" r="4"/></g>',
  estimatePop:
    '<rect x="6" y="26" width="18" height="18" rx="3" fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="2"/><path d="M28,35 H36" stroke="#f3f6fb" stroke-width="3"/><polygon points="40,35 33,30 33,40" fill="#f3f6fb"/><rect x="42" y="16" width="18" height="38" rx="3" fill="rgba(127,227,255,.35)" stroke="#7fe3ff" stroke-width="2"/>',
};
const UNIT = {
  saveKey: "g7u8-learn",
  game: "Carnival of Chance",
  icons: ICON,
  chapters: [
    {
      id: "chance",
      icon: "chance",
      title: "Chance and probability",
      game: { zone: "prob", name: "Spin to Win" },
      lessons: "Lessons 1–3",
      blurb:
        "From impossible to certain, and the probability of an outcome: the ways it can happen out of all the equally likely outcomes.",
      steps: 2,
    },
    {
      id: "experiments",
      icon: "estimate",
      title: "Experiments",
      game: { zone: "estimate", name: "Repeat and Count" },
      lessons: "Lessons 4–6",
      blurb: "Spin again and again: the fraction of times something happens gets close to its probability.",
      steps: 2,
    },
    {
      id: "compound",
      icon: "multi",
      title: "Two-step experiments",
      game: { zone: "multi", name: "Two-Step Games" },
      lessons: "Lessons 7–9",
      blurb: "Tables and tree diagrams list every outcome of two steps, so you can count the ones that count.",
      steps: 2,
    },
    {
      id: "sampling",
      icon: "sample",
      title: "Samples",
      game: { zone: "sample", name: "Fair Samples" },
      lessons: "Lessons 11–14",
      blurb: "A sample picked at random from the whole population is the fairest way to learn about it.",
      steps: 1,
    },
    {
      id: "using-samples",
      icon: "estimatePop",
      title: "Using samples",
      game: { zone: "compare", name: "Compare Crowds" },
      lessons: "Lessons 15–19",
      blurb: "Scale a sample up to estimate a population, see samples vary, and compare two populations in MADs.",
      steps: 3,
    },
  ],
};
