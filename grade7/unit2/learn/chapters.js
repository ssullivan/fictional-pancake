/* Learn Introducing Proportional Relationships (Grade 7 Unit 2): the unit's chapters and their icons. Loaded by learn.html
   and every chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js;
   shared/learn.js has the format. */
const ICON = {
  table:
    '<rect x="10" y="8" width="44" height="48" rx="4" fill="rgba(9,32,61,.6)" stroke="#f3f6fb" stroke-width="2"/><path d="M32,8 V56 M10,22 H54" stroke="#f3f6fb" stroke-width="2"/><g fill="#ffc93c" font-size="10" font-weight="700" font-family="monospace" text-anchor="middle"><text x="21" y="36">2</text><text x="43" y="36">6</text><text x="21" y="50">4</text><text x="43" y="50">12</text></g>',
  equation:
    '<text x="32" y="40" fill="#ffc93c" font-size="18" font-weight="800" text-anchor="middle" font-family="monospace">y=kx</text>',
  which:
    '<path d="M8,52 L56,12" stroke="#5fe0a8" stroke-width="3.5"/><path d="M8,40 L56,16" stroke="#ff9a86" stroke-width="3.5" stroke-dasharray="5 4"/><path d="M8,8 V56 H58" fill="none" stroke="#f3f6fb" stroke-width="2.5"/>',
  graph:
    '<path d="M8,8 V56 H58" fill="none" stroke="#f3f6fb" stroke-width="2.5"/><path d="M8,56 L52,14" stroke="#7fe3ff" stroke-width="3"/><circle cx="30" cy="35" r="5" fill="#ffc93c"/>',
  four: '<rect x="6" y="6" width="24" height="24" rx="3" fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="2"/><rect x="34" y="6" width="24" height="24" rx="3" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2"/><rect x="6" y="34" width="24" height="24" rx="3" fill="rgba(255,138,196,.3)" stroke="#ff8ac4" stroke-width="2"/><rect x="34" y="34" width="24" height="24" rx="3" fill="rgba(95,224,168,.3)" stroke="#5fe0a8" stroke-width="2"/>',
};
const UNIT = {
  saveKey: "g7u2-learn",
  game: "Food Truck Rally",
  icons: ICON,
  chapters: [
    {
      id: "tables",
      icon: "table",
      title: "Proportional relationships in tables",
      game: { zone: "table", name: "Table Talk" },
      lessons: "Lessons 1–3",
      blurb:
        "Every row is the same number times the first column: the constant of proportionality. Going back uses its reciprocal.",
      steps: 3,
    },
    {
      id: "equations",
      icon: "equation",
      title: "Equations like y = kx",
      game: { zone: "equation", name: "Equation Station" },
      lessons: "Lessons 4–6",
      blurb:
        "Write a proportional relationship as y = kx, write the equation that goes back, and use them to solve problems.",
      steps: 3,
    },
    {
      id: "proportional-or-not",
      icon: "which",
      title: "Proportional or not?",
      game: { zone: "which", name: "Proportional or Not?" },
      lessons: "Lessons 7–9",
      blurb:
        "Divide each y by its x. If you always get the same number, it’s proportional; an added fee or a squared side isn’t.",
      steps: 2,
    },
    {
      id: "graphs",
      icon: "graph",
      title: "Graphs of proportional relationships",
      game: { zone: "graph", name: "Graph Grill" },
      lessons: "Lessons 10–13",
      blurb:
        "A straight line through (0, 0) and (1, k). Read what a point means, compare steepness, and swap the axes.",
      steps: 4,
    },
    {
      id: "four-ways",
      icon: "four",
      title: "Four representations",
      game: { zone: "four", name: "Four Ways" },
      lessons: "Lesson 14",
      blurb: "One relationship as a story, a table, an equation, and a graph, all with the same constant.",
      steps: 1,
    },
  ],
};
