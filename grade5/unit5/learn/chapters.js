/* Learn Place Value Patterns and Decimal Operations (Grade 5 Unit 5): the unit's chapters and their icons. Loaded by
   learn.html and every chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js;
   shared/learn.js has the format. */
const ICON = {
  thousandths:
    '<rect x="8" y="10" width="30" height="30" fill="rgba(169,196,228,.1)" stroke="#f3f6fb" stroke-width="2"/><rect x="8" y="10" width="9" height="30" fill="#ffc93c"/><rect x="17" y="10" width="3" height="3" fill="#7fe3ff"/><path d="M20,13L44,22M20,10L44,10" stroke="#7fe3ff" stroke-width="1" stroke-dasharray="2 2"/><rect x="44" y="10" width="14" height="14" fill="none" stroke="#7fe3ff" stroke-width="2"/><text x="32" y="56" fill="#f3f6fb" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">0.325</text>',
  compare:
    '<text x="32" y="28" fill="#ffc93c" font-size="13" font-weight="700" text-anchor="middle" font-family="monospace">0.5</text><text x="32" y="44" fill="#f3f6fb" font-size="13" font-weight="700" text-anchor="middle" font-family="monospace">&gt;</text><text x="32" y="58" fill="#7fe3ff" font-size="13" font-weight="700" text-anchor="middle" font-family="monospace">0.48</text>',
  round:
    '<path d="M6,40H58" stroke="#f3f6fb" stroke-width="2"/><path d="M8,32V48M32,34V46M56,32V48" stroke="#f3f6fb" stroke-width="2"/><circle cx="42" cy="40" r="4.5" fill="#ffc93c"/><path d="M42,30Q49,20 56,28" fill="none" stroke="#ffc93c" stroke-width="2"/>',
  addsub:
    '<g fill="#f3f6fb" font-size="11" font-weight="700" text-anchor="end" font-family="monospace"><text x="50" y="18">2.45</text><text x="50" y="32">+1.30</text></g><path d="M14,36H52" stroke="#f3f6fb" stroke-width="1.5"/><text x="50" y="50" fill="#ffc93c" font-size="11" font-weight="700" text-anchor="end" font-family="monospace">3.75</text>',
  multiply:
    '<rect x="10" y="10" width="44" height="44" fill="rgba(169,196,228,.1)" stroke="#f3f6fb" stroke-width="2"/><rect x="10" y="32" width="44" height="22" fill="rgba(127,227,255,.35)"/><rect x="10" y="32" width="18" height="22" fill="#ffc93c"/>',
  divide:
    '<g stroke="#f3f6fb" stroke-width="1.5"><rect x="6" y="24" width="52" height="14" fill="none"/></g><g fill="#ffc93c" stroke="#0a2340" stroke-width="1"><rect x="6" y="24" width="15.6" height="14"/><rect x="21.6" y="24" width="15.6" height="14" fill="#7fe3ff"/><rect x="37.2" y="24" width="15.6" height="14"/></g>',
};
const UNIT = {
  saveKey: "g5u5-learn",
  game: "Track Meet",
  icons: ICON,
  chapters: [
    {
      id: "thousandths",
      icon: "thousandths",
      title: "Thousandths",
      game: { zone: "read", name: "Starting Blocks" },
      lessons: "Lessons 1–3",
      blurb: "Cut a hundredth into 10 thousandths, and read and write decimals to thousandths.",
      steps: 2,
    },
    {
      id: "compare",
      icon: "compare",
      title: "Compare and order",
      game: { zone: "compare", name: "Photo Finish" },
      lessons: "Lessons 5–6, 9–10",
      blurb: "Compare decimals place by place, and zoom in on a number line to see where they are.",
      steps: 2,
    },
    {
      id: "round",
      icon: "round",
      title: "Round decimals",
      game: { zone: "round", name: "Scoreboard" },
      lessons: "Lessons 7–8",
      blurb: "Round to the nearest whole number, tenth, or hundredth on a number line.",
      steps: 1,
    },
    {
      id: "add-subtract",
      icon: "addsub",
      title: "Add and subtract decimals",
      game: { zone: "addsub", name: "Relay Race" },
      lessons: "Lessons 11–16",
      blurb: "Line up the decimal points, add or subtract place by place, and regroup when you need to.",
      steps: 2,
    },
    {
      id: "multiply",
      icon: "multiply",
      title: "Multiply decimals",
      game: { zone: "multiply", name: "Long Jump" },
      lessons: "Lessons 17–21",
      blurb: "Multiply a whole number by tenths, and tenths by tenths, using facts you know.",
      steps: 2,
    },
    {
      id: "divide",
      icon: "divide",
      title: "Divide decimals",
      game: { zone: "divide", name: "Water Station" },
      lessons: "Lessons 22–25",
      blurb: "Count how many tenths fit, and share tenths equally.",
      steps: 2,
    },
  ],
};
