/* Learn Rational Numbers (Grade 6 Unit 7): the unit's chapters and their icons. Loaded by learn.html and every chapter page in
   learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  signed:
    '<rect x="26" y="4" width="12" height="42" rx="6" fill="none" stroke="#f3f6fb" stroke-width="2"/><rect x="29" y="26" width="6" height="24" fill="#6fb8ff"/><circle cx="32" cy="52" r="8" fill="#6fb8ff"/><path d="M40,14h6M40,26h8M40,38h6" stroke="#f3f6fb" stroke-width="2"/><text x="14" y="30" fill="#7fe3ff" font-size="14" font-weight="700" text-anchor="middle" font-family="monospace">−</text>',
  compare:
    '<path d="M4,40 H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M12,34v12M32,32v16M52,34v12" stroke="#f3f6fb" stroke-width="2"/><circle cx="12" cy="40" r="5" fill="#ffc93c"/><circle cx="52" cy="40" r="5" fill="#7fe3ff"/><text x="32" y="22" fill="#f3f6fb" font-size="18" font-weight="700" text-anchor="middle" font-family="monospace">&lt;</text>',
  contexts:
    '<rect x="8" y="12" width="48" height="40" rx="6" fill="rgba(255,201,60,.18)" stroke="#ffc93c" stroke-width="2"/><text x="32" y="38" fill="#f3f6fb" font-size="15" font-weight="700" text-anchor="middle" font-family="monospace">−$20</text>',
  absolute:
    '<path d="M4,44 H60" stroke="#f3f6fb" stroke-width="2"/><path d="M32,38v12" stroke="#f3f6fb" stroke-width="3"/><path d="M12,30 v-6 H32 v6 M32,30 v-6 H52 v6" fill="none" stroke="#7fe3ff" stroke-width="2"/><circle cx="12" cy="44" r="4" fill="#ffc93c"/><circle cx="52" cy="44" r="4" fill="#ffc93c"/><text x="32" y="16" fill="#f3f6fb" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">|−4|=4</text>',
  ineq: '<path d="M4,36 H60" stroke="#f3f6fb" stroke-width="2"/><path d="M24,36 H56" stroke="#7fe3ff" stroke-width="6" stroke-linecap="round"/><polygon points="62,36 52,29 52,43" fill="#7fe3ff"/><circle cx="22" cy="36" r="6" fill="#7fe3ff"/><text x="30" y="20" fill="#ffc93c" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">x≥−2</text>',
  plane:
    '<path d="M32,4 V60 M4,32 H60" stroke="#f3f6fb" stroke-width="2.5"/><rect x="5" y="5" width="26" height="26" fill="rgba(127,227,255,.18)"/><text x="18" y="22" fill="#a9c4e4" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">II</text><text x="46" y="22" fill="#a9c4e4" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">I</text><circle cx="46" cy="46" r="5" fill="#ffc93c"/>',
  distance:
    '<path d="M32,4 V60 M4,32 H60" stroke="#f3f6fb" stroke-width="2"/><circle cx="14" cy="18" r="5" fill="#ffc93c"/><circle cx="50" cy="18" r="5" fill="#7fe3ff"/><path d="M14,18 H50" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="4 3"/><circle cx="14" cy="46" r="5" fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="2"/>',
  shapes:
    '<path d="M32,4 V60 M4,32 H60" stroke="#a9c4e4" stroke-width="1.5"/><rect x="12" y="14" width="38" height="28" fill="rgba(255,201,60,.25)" stroke="#ffc93c" stroke-width="2.5"/><circle cx="12" cy="14" r="3.5" fill="#f3f6fb"/><circle cx="50" cy="14" r="3.5" fill="#f3f6fb"/><circle cx="50" cy="42" r="3.5" fill="#f3f6fb"/><circle cx="12" cy="42" r="3.5" fill="#f3f6fb"/>',
  factors:
    '<rect x="6" y="20" width="22" height="30" rx="3" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="2"/><rect x="36" y="20" width="22" height="30" rx="3" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="2"/><circle cx="13" cy="32" r="3" fill="#7fe3ff"/><circle cx="21" cy="40" r="3" fill="#7fe3ff"/><circle cx="43" cy="32" r="3" fill="#7fe3ff"/><circle cx="51" cy="40" r="3" fill="#7fe3ff"/><path d="M12,20 v-6 h10 v6 M42,20 v-6 h10 v6" fill="none" stroke="#f3f6fb" stroke-width="2"/>',
};
const UNIT = {
  saveKey: "g6u7-learn",
  game: "Expedition Zero",
  icons: ICON,
  chapters: [
    {
      id: "signed",
      icon: "signed",
      title: "Positive and negative numbers",
      game: { zone: "line", name: "Number Line" },
      lessons: "Lessons 1–2",
      blurb: "Temperatures below zero, places below sea level, opposites, and the numbers between the whole numbers.",
      steps: 3,
    },
    {
      id: "compare",
      icon: "compare",
      title: "Comparing and ordering",
      game: { zone: "compare", name: "Colder or Warmer" },
      lessons: "Lessons 3–4",
      blurb: "Farther right is greater, < and > read both ways, and putting signed numbers in order.",
      steps: 3,
    },
    {
      id: "contexts",
      icon: "contexts",
      title: "Negative numbers in the world",
      game: { zone: "compare", name: "Colder or Warmer" },
      lessons: "Lesson 5",
      blurb: "What a negative bank balance means, and comparing depths and temperatures.",
      steps: 2,
    },
    {
      id: "absolute",
      icon: "absolute",
      title: "Absolute value",
      game: { zone: "abs", name: "Sea Level" },
      lessons: "Lessons 6–7",
      blurb: "Distance from zero, two numbers with the same absolute value, and debts that are less but bigger.",
      steps: 3,
    },
    {
      id: "inequalities",
      icon: "ineq",
      title: "Inequalities",
      game: { zone: "ineq", name: "Safe Limits" },
      lessons: "Lessons 8–10",
      blurb: "Graph inequalities with open and closed circles, test solutions, and write rules from stories.",
      steps: 3,
    },
    {
      id: "plane",
      icon: "plane",
      title: "The coordinate plane",
      game: { zone: "plane", name: "Map Grid" },
      lessons: "Lessons 11–12",
      blurb: "Four quadrants, reading a point across and then up or down, and choosing a scale for the axes.",
      steps: 3,
    },
    {
      id: "distance",
      icon: "distance",
      title: "Reflections and distances",
      game: { zone: "dist", name: "Trail Map" },
      lessons: "Lessons 13–14",
      blurb: "Reflect points across the axes, find distances along a grid line, and get around a town map.",
      steps: 3,
    },
    {
      id: "shapes",
      icon: "shapes",
      title: "Shapes on the coordinate plane",
      game: { zone: "dist", name: "Trail Map" },
      lessons: "Lessons 15, 19",
      blurb: "Rectangles from their vertices, their perimeter and area, and drawing by connecting points.",
      steps: 2,
    },
    {
      id: "factors",
      icon: "factors",
      title: "Common factors and multiples",
      game: { zone: "factor", name: "Supply Packs" },
      lessons: "Lessons 16–18",
      blurb:
        "Identical kits with the greatest common factor, packs that match with the least common multiple, and which one a story needs.",
      steps: 3,
    },
  ],
};
