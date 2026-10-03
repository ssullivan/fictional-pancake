/* Learn Numbers to 1,000 (Grade 2 Unit 5): the unit's chapters and their icons. Loaded by learn.html and every chapter page in learn/.
   Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  hundred:
    '<rect x="6" y="10" width="40" height="40" fill="#ffc93c" stroke="#0a2340"/><path d="M14,10v40M22,10v40M30,10v40M38,10v40M6,18h40M6,26h40M6,34h40M6,42h40" stroke="rgba(10,35,64,.5)"/><rect x="52" y="10" width="6" height="40" fill="#7fe3ff" stroke="#0a2340"/>',
  digits:
    '<g font-family="monospace" font-weight="700" font-size="22" text-anchor="middle"><text x="14" y="40" fill="#ffc93c">3</text><text x="32" y="40" fill="#7fe3ff">4</text><text x="50" y="40" fill="#5fe0a8">2</text></g>',
  expand:
    '<g font-family="monospace" font-weight="700" font-size="12" text-anchor="middle"><text x="32" y="22" fill="#f3f6fb">342 =</text><text x="32" y="44" fill="#ffc93c">300+40+2</text></g>',
  line: '<path d="M4,40H56" stroke="#f3f6fb" stroke-width="3"/><polygon points="62,40 54,35 54,45" fill="#f3f6fb"/><path d="M8,32v16M28,32v16M48,32v16" stroke="#f3f6fb" stroke-width="2.5"/><circle cx="38" cy="40" r="6" fill="#ffc93c"/>',
  order:
    '<g font-family="monospace" font-weight="700" font-size="12" text-anchor="middle"><text x="32" y="18" fill="#7fe3ff">65</text><text x="32" y="34" fill="#f3f6fb">506</text><text x="32" y="50" fill="#ffc93c">560</text></g>',
};
const UNIT = {
  saveKey: "g2u5-learn",
  game: "Dragon Duel",
  readAloud: true,
  icons: ICON,
  /* the order of the chapters when the unit was one page (learn.html#c2s1), for progress saved then and old links */
  legacy: ["hundred", "three-digit", "expanded-form", "number-line", "compare-and-order"],
  chapters: [
    {
      id: "hundred",
      icon: "hundred",
      title: "Make a hundred",
      game: { zone: "hundred", name: "Tower of Tens" },
      lessons: "Lessons 1–2",
      blurb: "Put 10 tens together to make a hundred, and count how many hundreds you can make.",
      steps: 2,
    },
    {
      id: "three-digit",
      icon: "digits",
      title: "Three-digit numbers",
      game: { zone: "build", name: "Block Forge" },
      lessons: "Lessons 3–4",
      blurb: "Build numbers with hundreds, tens, and ones, and read and write their names.",
      steps: 2,
    },
    {
      id: "expanded-form",
      icon: "expand",
      title: "Expanded form",
      game: { zone: "expand", name: "Spell Scrolls" },
      lessons: "Lessons 5–6",
      blurb: "Write a number as hundreds plus tens plus ones, and make the same number different ways.",
      steps: 2,
    },
    {
      id: "number-line",
      icon: "line",
      title: "The number line to 1,000",
      game: { zone: "line", name: "Number Bridge" },
      lessons: "Lessons 8–9",
      blurb: "Find three-digit numbers on number lines counting by hundreds and tens, and compare them.",
      steps: 2,
    },
    {
      id: "compare-and-order",
      icon: "order",
      title: "Compare and order",
      game: { zone: "compare", name: "Knight’s Challenge" },
      lessons: "Lessons 10–12",
      blurb: "Compare numbers place by place, starting with hundreds, and put numbers in order.",
      steps: 2,
    },
  ],
};
