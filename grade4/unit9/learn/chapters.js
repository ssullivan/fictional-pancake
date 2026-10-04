/* Learn Putting It All Together (Grade 4 Unit 9): the unit's chapters and their icons. Loaded by learn.html and every chapter page in learn/.
   Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  frac: '<g stroke="#0a2340" stroke-width="1.5"><rect x="6" y="22" width="13" height="20" fill="#ffc93c"/><rect x="19" y="22" width="13" height="20" fill="#ffc93c"/><rect x="32" y="22" width="13" height="20" fill="#7fe3ff"/><rect x="45" y="22" width="13" height="20" fill="rgba(243,246,251,.25)"/></g><text x="32" y="16" fill="#f3f6fb" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">+ − ×</text>',
  alg: '<g fill="#f3f6fb" font-size="13" font-weight="700" text-anchor="end" font-family="monospace"><text x="52" y="26">7005</text><text x="52" y="40">−2348</text></g><path d="M14,45H54" stroke="#f3f6fb" stroke-width="2"/><text x="52" y="58" fill="#ffc93c" font-size="13" font-weight="700" text-anchor="end" font-family="monospace">4657</text>',
  tape: '<g stroke-width="1.5"><rect x="6" y="14" width="13" height="14" fill="rgba(255,201,60,.55)" stroke="#ffc93c"/><rect x="6" y="36" width="13" height="14" fill="rgba(127,227,255,.45)" stroke="#7fe3ff"/><rect x="19" y="36" width="13" height="14" fill="rgba(127,227,255,.45)" stroke="#7fe3ff"/><rect x="32" y="36" width="13" height="14" fill="rgba(127,227,255,.45)" stroke="#7fe3ff"/></g><text x="54" y="47" fill="#f3f6fb" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">÷?</text>',
  est: '<text x="32" y="28" fill="#f3f6fb" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">39 × 52</text><text x="32" y="48" fill="#7fe3ff" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">≈ 2,000</text>',
};
const UNIT = {
  saveKey: "g4u9-learn",
  game: "Year-End Fair",
  icons: ICON,
  chapters: [
    {
      id: "fractions",
      icon: "frac",
      title: "Reason with fractions",
      game: { zone: "fractions", name: "Pie Booth" },
      lessons: "Lessons 1–3",
      blurb: "Add, subtract, and multiply fractions on strips, and pick the operation a story needs.",
      steps: 2,
    },
    {
      id: "operations",
      icon: "alg",
      title: "Whole-number operations",
      game: { zone: "algorithms", name: "Ring Toss" },
      lessons: "Lessons 4–6",
      blurb: "Add, subtract, and multiply with the standard algorithm, and divide with partial quotients.",
      steps: 2,
    },
    {
      id: "problems",
      icon: "tape",
      title: "Multiplication and division problems",
      game: { zone: "compare", name: "Ferris Wheel" },
      lessons: "Lessons 7–8",
      blurb: "Solve comparison problems with tape diagrams, and choose whether to multiply or divide.",
      steps: 2,
    },
    {
      id: "estimate",
      icon: "est",
      title: "Estimate",
      game: { zone: "estimate", name: "Guessing Jar" },
      lessons: "Lesson 10",
      blurb: "Round to friendly numbers to estimate, and check whether an answer makes sense.",
      steps: 2,
    },
  ],
};
