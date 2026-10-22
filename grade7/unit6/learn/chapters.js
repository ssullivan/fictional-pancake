/* Learn Expressions, Equations, and Inequalities (Grade 7 Unit 6): the unit's chapters and their icons. Loaded by learn.html
   and every chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js;
   shared/learn.js has the format. */
const ICON = {
  tape: '<rect x="4" y="20" width="16" height="18" fill="rgba(127,227,255,.3)" stroke="#f3f6fb" stroke-width="2"/><rect x="20" y="20" width="16" height="18" fill="rgba(127,227,255,.3)" stroke="#f3f6fb" stroke-width="2"/><rect x="36" y="20" width="24" height="18" fill="rgba(255,201,60,.45)" stroke="#f3f6fb" stroke-width="2"/><path d="M4,44 q0,6 6,6 H26 q6,0 6,6 q0,-6 6,-6 H54 q6,0 6,-6" fill="none" stroke="#7fe3ff" stroke-width="2.5"/>',
  solve:
    '<rect x="14" y="26" width="36" height="28" rx="4" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2.5"/><path d="M22,26 V18 a10,10 0 0 1 20,0 V26" fill="none" stroke="#f3f6fb" stroke-width="3"/><circle cx="32" cy="38" r="3.5" fill="#0a2340"/><path d="M32,40 v7" stroke="#0a2340" stroke-width="3"/>',
  ineq: '<path d="M4,40 H60" stroke="#f3f6fb" stroke-width="2.5"/><circle cx="24" cy="40" r="6" fill="#0a2340" stroke="#7fe3ff" stroke-width="3"/><path d="M30,40 H54" stroke="#7fe3ff" stroke-width="5"/><polygon points="60,40 52,34 52,46" fill="#7fe3ff"/><text x="24" y="22" fill="#ffc93c" font-size="14" font-weight="800" text-anchor="middle" font-family="monospace">&gt;</text>',
  equiv:
    '<text x="32" y="28" fill="#ffc93c" font-size="12" font-weight="800" text-anchor="middle" font-family="monospace">3(x+2)</text><text x="32" y="40" fill="#f3f6fb" font-size="12" font-weight="800" text-anchor="middle" font-family="monospace">=</text><text x="32" y="54" fill="#7fe3ff" font-size="12" font-weight="800" text-anchor="middle" font-family="monospace">3x+6</text>',
};
const UNIT = {
  saveKey: "g7u6-learn",
  game: "Code Breakers",
  icons: ICON,
  chapters: [
    {
      id: "tape-diagrams",
      icon: "tape",
      title: "Tape diagrams and equations",
      game: { zone: "tape", name: "Tape Codes" },
      lessons: "Lessons 1–6",
      blurb: "Some equal parts plus one more is px + q = r; equal groups of two things is p(x + q) = r.",
      steps: 2,
    },
    {
      id: "solving",
      icon: "solve",
      title: "Solving equations",
      game: { zone: "solve", name: "Crack the Code" },
      lessons: "Lessons 7–12",
      blurb:
        "Undo the steps in reverse order, the same on both sides: on a hanger, with negative numbers, and in percent problems.",
      steps: 4,
    },
    {
      id: "inequalities",
      icon: "ineq",
      title: "Inequalities",
      game: { zone: "ineq", name: "Inequality Lock" },
      lessons: "Lessons 13–17",
      blurb: "Graph solutions, solve by finding the boundary and testing a side, and find the most a budget allows.",
      steps: 3,
    },
    {
      id: "equivalent",
      icon: "equiv",
      title: "Equivalent expressions",
      game: { zone: "equiv", name: "Equivalent Codes" },
      lessons: "Lessons 18–22",
      blurb: "Distribute and factor, subtract a whole group, and combine like terms.",
      steps: 3,
    },
  ],
};
