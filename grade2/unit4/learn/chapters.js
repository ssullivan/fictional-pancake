/* Learn Addition and Subtraction on the Number Line (Grade 2 Unit 4): the unit's chapters and their icons. Loaded by learn.html and every chapter page in learn/.
   Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  line: '<path d="M4,40H56" stroke="#f3f6fb" stroke-width="3"/><polygon points="62,40 54,35 54,45" fill="#f3f6fb"/><path d="M8,34v12M20,36v8M32,34v12M44,36v8" stroke="#f3f6fb" stroke-width="2.5"/><circle cx="44" cy="40" r="6" fill="#ffc93c"/>',
  compare:
    '<path d="M4,44H60" stroke="#f3f6fb" stroke-width="3"/><circle cx="18" cy="44" r="6" fill="#ffc93c"/><circle cx="46" cy="44" r="6" fill="#7fe3ff"/><text x="32" y="28" fill="#5fe0a8" font-size="22" font-weight="700" text-anchor="middle" font-family="monospace">&lt;</text>',
  jump: '<path d="M4,48H60" stroke="#f3f6fb" stroke-width="3"/><path d="M12,46Q32,6 50,42" fill="none" stroke="#ffc93c" stroke-width="3.5"/><polygon points="52,47 44,40 53,36" fill="#ffc93c"/>',
  tens: '<path d="M2,50H62" stroke="#f3f6fb" stroke-width="3"/><path d="M6,48Q16,28 26,46M26,48Q36,28 46,46" fill="none" stroke="#ffc93c" stroke-width="3"/><path d="M46,48Q51,38 56,46" fill="none" stroke="#7fe3ff" stroke-width="3"/><text x="16" y="24" fill="#ffc93c" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">+10</text><text x="36" y="24" fill="#ffc93c" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">+10</text>',
  story:
    '<path d="M4,50H60" stroke="#f3f6fb" stroke-width="3"/><path d="M10,48Q32,12 54,46" fill="none" stroke="#7fe3ff" stroke-width="3.5"/><text x="32" y="24" fill="#7fe3ff" font-size="18" font-weight="700" text-anchor="middle" font-family="monospace">?</text>',
};
const UNIT = {
  saveKey: "g2u4-learn",
  readAloud: true,
  icons: ICON,
  /* the order of the chapters when the unit was one page (learn.html#c2s1), for progress saved then and old links */
  legacy: ["number-line", "compare-and-estimate", "jumps", "tens-and-ones", "stories"],
  chapters: [
    {
      id: "number-line",
      icon: "line",
      title: "Numbers on the number line",
      lessons: "Lessons 1–3",
      blurb: "See each number as a length from 0, learn the parts of a number line, and find numbers at tick marks.",
      steps: 3,
    },
    {
      id: "compare-and-estimate",
      icon: "compare",
      title: "Compare and estimate",
      lessons: "Lessons 4–5",
      blurb: "Use the number line to see which number is greater, and estimate where a dot is.",
      steps: 2,
    },
    {
      id: "jumps",
      icon: "jump",
      title: "Jumps on the number line",
      lessons: "Lessons 7–9",
      blurb: "Add by jumping right and subtract by jumping left, match jumps to equations, and find the difference.",
      steps: 3,
    },
    {
      id: "tens-and-ones",
      icon: "tens",
      title: "Jump by tens and ones",
      lessons: "Lessons 10–11",
      blurb: "Make big jumps of ten, then small jumps of ones, and jump to a ten to make it easy.",
      steps: 2,
    },
    {
      id: "stories",
      icon: "story",
      title: "Unknowns and stories",
      lessons: "Lessons 12–13",
      blurb: "Find the missing jump in an equation, and show story problems on a number line.",
      steps: 2,
    },
  ],
};
