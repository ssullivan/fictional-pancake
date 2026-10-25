/* Learn One-variable Statistics (Algebra 1 Unit 1): the unit's chapters and their icons. Loaded by learn.html and every
   chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has
   the format. */
const ICON = {
  survey:
    '<rect x="12" y="6" width="40" height="52" rx="4" fill="rgba(9,32,61,.6)" stroke="#f3f6fb" stroke-width="2.5"/><path d="M20,20 H44 M20,32 H44 M20,44 H36" stroke="rgba(170,205,255,.6)" stroke-width="2.5" stroke-linecap="round"/><circle cx="44" cy="44" r="9" fill="#ffc93c"/><text x="44" y="49" fill="#1a1300" font-size="13" font-weight="800" text-anchor="middle" font-family="monospace">?</text>',
};
const UNIT = {
  saveKey: "alg1u1-learn",
  icons: ICON,
  chapters: [
    {
      id: "getting-to-know-you",
      icon: "survey",
      title: "Getting to know you",
      lessons: "Lesson 1",
      blurb:
        "Statistical questions have answers that vary. Sort data into numbers and categories, and turn a one-answer question into a statistical one.",
      steps: 4,
    },
  ],
};
