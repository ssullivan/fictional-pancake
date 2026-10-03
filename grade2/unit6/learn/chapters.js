/* Learn Geometry, Time, and Money (Grade 2 Unit 6): the unit's chapters and their icons. Loaded by learn.html and every chapter page in learn/.
   Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  shapes:
    '<polygon points="8,52 24,14 40,52" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="3" stroke-linejoin="round"/><polygon points="44,20 58,30 53,48 35,48 30,30" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="3" stroke-linejoin="round"/>',
  parts:
    '<circle cx="32" cy="32" r="24" fill="rgba(170,205,255,.12)" stroke="#f3f6fb" stroke-width="3"/><path d="M32,32V8A24,24 0 0 1 56,32Z" fill="#ffc93c" stroke="#f3f6fb" stroke-width="3"/><path d="M32,32V56M8,32H32" stroke="#f3f6fb" stroke-width="3"/>',
  clock:
    '<circle cx="32" cy="32" r="25" fill="#f3f6fb" stroke="#ffc93c" stroke-width="4"/><path d="M32,32L42,40" stroke="#0a2340" stroke-width="5" stroke-linecap="round"/><path d="M32,32V12" stroke="#e0445e" stroke-width="3.5" stroke-linecap="round"/><circle cx="32" cy="32" r="2.5" fill="#0a2340"/>',
  coins:
    '<circle cx="24" cy="36" r="18" fill="#cdd6e1" stroke="#f3f6fb" stroke-width="2"/><circle cx="24" cy="36" r="14" fill="none" stroke="rgba(10,35,64,.3)"/><circle cx="46" cy="22" r="13" fill="#d9895a" stroke="#f5c6a5" stroke-width="2"/><text x="24" y="40" font-family="monospace" font-weight="700" font-size="11" text-anchor="middle" fill="#0a2340">25¢</text>',
  shop: '<path d="M10,26L28,8H54V34L36,52Z" fill="rgba(255,201,60,.3)" stroke="#ffc93c" stroke-width="3" stroke-linejoin="round"/><circle cx="45" cy="17" r="4" fill="none" stroke="#ffc93c" stroke-width="2.5"/><text x="32" y="36" font-family="monospace" font-weight="700" font-size="13" text-anchor="middle" fill="#f3f6fb" transform="rotate(-45 32 32)">45¢</text>',
};
const UNIT = {
  saveKey: "g2u6-learn",
  game: "Clockwork Carnival",
  readAloud: true,
  icons: ICON,
  /* the order of the chapters when the unit was one page (learn.html#c2s1), for progress saved then and old links */
  legacy: ["shapes", "halves-thirds-fourths", "time", "coins", "money"],
  chapters: [
    {
      id: "shapes",
      icon: "shapes",
      title: "Shapes",
      game: { zone: "shapes", name: "Shape Tent" },
      lessons: "Lessons 1–4",
      blurb:
        "Count sides and corners, draw shapes, look at side lengths and square corners, and count the faces of solid shapes.",
      steps: 4,
    },
    {
      id: "halves-thirds-fourths",
      icon: "parts",
      title: "Halves, thirds, and fourths",
      game: { zone: "parts", name: "Pie Stand" },
      lessons: "Lessons 6–9",
      blurb:
        "Build shapes from smaller shapes, cut shapes into equal parts, and see that more parts means smaller parts.",
      steps: 4,
    },
    {
      id: "time",
      icon: "clock",
      title: "Tell time",
      game: { zone: "time", name: "Clock Tower" },
      lessons: "Lessons 11–13",
      blurb: "Read half past, quarter past, and quarter till, count by 5s to tell time, and use a.m. and p.m.",
      steps: 3,
    },
    {
      id: "coins",
      icon: "coins",
      title: "Coins",
      game: { zone: "coins", name: "Coin Toss" },
      lessons: "Lessons 15–17",
      blurb: "Know pennies, nickels, dimes, and quarters, count coins, and make a dollar.",
      steps: 3,
    },
    {
      id: "money",
      icon: "shop",
      title: "Money problems",
      game: { zone: "shop", name: "Prize Shop" },
      lessons: "Lessons 18–19",
      blurb: "Count dollars and cents together, and solve story problems about buying things.",
      steps: 2,
    },
  ],
};
