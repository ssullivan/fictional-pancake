/* Learn Expressions and Equations (Grade 6 Unit 6): the unit's chapters and their icons. Loaded by learn.html and every chapter
   page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  tape: '<rect x="4" y="24" width="18" height="18" fill="rgba(127,227,255,.35)" stroke="#7fe3ff" stroke-width="2"/><rect x="22" y="24" width="18" height="18" fill="rgba(127,227,255,.35)" stroke="#7fe3ff" stroke-width="2"/><rect x="40" y="24" width="18" height="18" fill="rgba(127,227,255,.35)" stroke="#7fe3ff" stroke-width="2"/><path d="M5,18v-5H57v5" fill="none" stroke="#f3f6fb" stroke-width="2"/><text x="31" y="38" fill="#f3f6fb" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace" font-style="italic">x  x  x</text>',
  hanger:
    '<line x1="32" y1="4" x2="32" y2="16" stroke="#a9c4e4" stroke-width="2"/><line x1="8" y1="16" x2="56" y2="16" stroke="#f3f6fb" stroke-width="4" stroke-linecap="round"/><line x1="12" y1="16" x2="12" y2="26" stroke="#a9c4e4" stroke-width="2"/><line x1="52" y1="16" x2="52" y2="26" stroke="#a9c4e4" stroke-width="2"/><circle cx="12" cy="36" r="9" fill="rgba(127,227,255,.35)" stroke="#7fe3ff" stroke-width="2"/><rect x="45" y="27" width="14" height="14" fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="2"/><rect x="45" y="43" width="14" height="14" fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="2"/>',
  letters:
    '<text x="32" y="42" fill="#f3f6fb" font-size="24" font-weight="700" text-anchor="middle" font-family="monospace">3<tspan fill="#7fe3ff" font-style="italic">n</tspan>+1</text>',
  equiv:
    '<text x="32" y="28" fill="#ffc93c" font-size="16" font-weight="700" text-anchor="middle" font-family="monospace">x+x+x</text><text x="32" y="52" fill="#7fe3ff" font-size="18" font-weight="700" text-anchor="middle" font-family="monospace">3x</text><text x="32" y="40" fill="#f3f6fb" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">=</text>',
  area: '<rect x="6" y="18" width="34" height="30" fill="rgba(255,201,60,.35)" stroke="#f3f6fb" stroke-width="2.5"/><rect x="40" y="18" width="18" height="30" fill="rgba(127,227,255,.3)" stroke="#f3f6fb" stroke-width="2.5"/><text x="23" y="14" fill="#f3f6fb" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace" font-style="italic">x</text><text x="49" y="14" fill="#f3f6fb" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">4</text>',
  power:
    '<g fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="1.5">' +
    [0, 1, 2]
      .map((i) => [0, 1, 2].map((j) => `<rect x="${6 + i * 11}" y="${22 + j * 11}" width="11" height="11"/>`).join(""))
      .join("") +
    '</g><text x="50" y="38" fill="#f3f6fb" font-size="18" font-weight="700" text-anchor="middle" font-family="monospace">3²</text>',
  order:
    '<text x="32" y="40" fill="#f3f6fb" font-size="17" font-weight="700" text-anchor="middle" font-family="monospace">3·<tspan fill="#ffc93c">4²</tspan></text><path d="M38,46 h14" stroke="#ffc93c" stroke-width="2.5"/>',
  graph:
    '<path d="M8,6 V56 H58" fill="none" stroke="#f3f6fb" stroke-width="2.5"/><line x1="8" y1="56" x2="52" y2="12" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="4 3"/><circle cx="19" cy="45" r="4" fill="#ffc93c"/><circle cx="30" cy="34" r="4" fill="#ffc93c"/><circle cx="41" cy="23" r="4" fill="#ffc93c"/>',
  together:
    '<rect x="6" y="8" width="22" height="22" rx="3" fill="none" stroke="#ffc93c" stroke-width="2"/><rect x="36" y="8" width="22" height="22" rx="3" fill="none" stroke="#7fe3ff" stroke-width="2"/><rect x="6" y="36" width="22" height="22" rx="3" fill="none" stroke="#7fe3ff" stroke-width="2"/><rect x="36" y="36" width="22" height="22" rx="3" fill="none" stroke="#ffc93c" stroke-width="2"/><path d="M28,19h8M17,30v6M47,30v6M28,47h8" stroke="#f3f6fb" stroke-width="2"/>',
};
const UNIT = {
  saveKey: "g6u6-learn",
  game: "Balance Lab",
  icons: ICON,
  chapters: [
    {
      id: "equations",
      icon: "tape",
      title: "Tape diagrams and equations",
      game: { zone: "tape", name: "Tape Match" },
      lessons: "Lessons 1–2",
      blurb:
        "Many equations can match one tape, and what the equal sign really says. A solution makes an equation true.",
      steps: 3,
    },
    {
      id: "balance",
      icon: "hanger",
      title: "Staying in balance",
      game: { zone: "hang", name: "Hanger Lab" },
      lessons: "Lessons 3–5",
      blurb:
        "Keep a hanger balanced by doing the same thing to each side, solve equations with decimals and fractions, and turn stories into equations.",
      steps: 5,
    },
    {
      id: "expressions",
      icon: "letters",
      title: "Letters stand for numbers",
      game: { zone: "write", name: "Story Lab" },
      lessons: "Lessons 6–7",
      blurb: "Write expressions from words, read 3x as 3 times x, and write percent problems as equations.",
      steps: 3,
    },
    {
      id: "equivalent",
      icon: "equiv",
      title: "Equal and equivalent",
      game: { zone: "equiv", name: "Twin Test" },
      lessons: "Lesson 8",
      blurb: "Test expressions with many values, and use pictures to see why two expressions are always equal.",
      steps: 2,
    },
    {
      id: "distributive",
      icon: "area",
      title: "The distributive property",
      game: { zone: "split", name: "Area Split" },
      lessons: "Lessons 9–11",
      blurb: "Split a rectangle to multiply, write 3(x + 4) another way, take a common factor out, and find a mistake.",
      steps: 4,
    },
    {
      id: "exponents",
      icon: "power",
      title: "Meaning of exponents",
      game: { zone: "power", name: "Power Up" },
      lessons: "Lessons 12–13",
      blurb: "Fold paper to see repeated multiplication, build squares and cubes, and take a part of a part.",
      steps: 3,
    },
    {
      id: "evaluate",
      icon: "order",
      title: "Evaluating expressions with exponents",
      game: { zone: "power", name: "Power Up" },
      lessons: "Lessons 14–15",
      blurb: "What to do first, expressions like 6x², and finding the exponent that makes an equation true.",
      steps: 3,
    },
    {
      id: "relationships",
      icon: "graph",
      title: "Two related quantities",
      game: { zone: "graph", name: "Data Lab" },
      lessons: "Lessons 16–18",
      blurb: "Tables, equations, and graphs for two amounts that change together, and adding versus multiplying.",
      steps: 3,
    },
    {
      id: "put-together",
      icon: "together",
      title: "Tables, equations, and graphs",
      game: { zone: "boss", name: "Grand Balance" },
      lessons: "Lesson 19",
      blurb: "One situation four ways, and a solved problem with a mistake to find.",
      steps: 2,
    },
  ],
};
