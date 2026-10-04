/* Learn Putting It All Together (Grade 6 Unit 9): the unit's chapters and their icons. Loaded by learn.html and every chapter
   page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  world:
    '<circle cx="32" cy="32" r="24" fill="rgba(127,227,255,.2)" stroke="#f3f6fb" stroke-width="2.5"/><path d="M14,24 Q24,18 28,26 T42,22 M12,38 Q22,34 30,42 T50,40" fill="none" stroke="#5fe0a8" stroke-width="3"/><g fill="#ffc93c"><circle cx="24" cy="32" r="3"/><circle cx="34" cy="32" r="3"/><circle cx="44" cy="32" r="3"/></g>',
  squares:
    '<rect x="6" y="14" width="52" height="36" fill="none" stroke="#f3f6fb" stroke-width="2.5"/><rect x="6" y="14" width="36" height="36" fill="rgba(255,201,60,.45)" stroke="#f3f6fb" stroke-width="2"/><rect x="42" y="14" width="16" height="16" fill="rgba(127,227,255,.4)" stroke="#f3f6fb" stroke-width="2"/><rect x="42" y="30" width="16" height="16" fill="rgba(127,227,255,.4)" stroke="#f3f6fb" stroke-width="2"/>',
  yessier:
    '<rect x="8" y="22" width="20" height="34" fill="rgba(255,201,60,.6)" stroke="#f3f6fb" stroke-width="2"/><rect x="36" y="12" width="20" height="44" fill="rgba(127,227,255,.45)" stroke="#f3f6fb" stroke-width="2"/><path d="M12,40 l5,5 9,-12" fill="none" stroke="#5fe0a8" stroke-width="3.5"/>',
  super:
    '<rect x="6" y="26" width="52" height="14" fill="rgba(170,205,255,.15)" stroke="#f3f6fb" stroke-width="2"/><rect x="6" y="26" width="38" height="14" fill="rgba(255,201,60,.6)"/><path d="M40,16 V50" stroke="#ff8ac4" stroke-width="3"/><text x="40" y="12" fill="#ff8ac4" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">2/3</text>',
  ballot:
    '<rect x="14" y="8" width="36" height="48" rx="4" fill="rgba(9,32,61,.6)" stroke="#f3f6fb" stroke-width="2.5"/><g fill="#ffc93c" font-size="11" font-weight="700" font-family="monospace"><text x="20" y="24">1</text><text x="20" y="38">2</text><text x="20" y="52">3</text></g><path d="M30,20 H44 M30,34 H44 M30,48 H44" stroke="#7fe3ff" stroke-width="3"/>',
  seats:
    '<g fill="rgba(255,201,60,.6)" stroke="#f3f6fb" stroke-width="2"><rect x="6" y="34" width="12" height="22"/><rect x="24" y="22" width="12" height="34"/><rect x="42" y="10" width="16" height="46"/></g><g fill="#7fe3ff"><circle cx="12" cy="28" r="3"/><circle cx="30" cy="16" r="3"/><circle cx="46" cy="5" r="3"/><circle cx="54" cy="5" r="3"/></g>',
};
const UNIT = {
  saveKey: "g6u9-learn",
  game: "Town Hall",
  icons: ICON,
  chapters: [
    {
      id: "world",
      icon: "world",
      title: "If our class were the world",
      game: { zone: "world", name: "World in a Class" },
      lessons: "Lesson 2",
      blurb: "Shrink the world’s 8 billion people to a class, and scale a class back up to the world.",
      steps: 2,
    },
    {
      id: "rectangles",
      icon: "squares",
      title: "Rectangle madness",
      game: { zone: "squares", name: "Square Cutter" },
      lessons: "Lesson 3",
      blurb: "Cut the largest square from a rectangle again and again. The last square is the greatest common factor.",
      steps: 3,
    },
    {
      id: "yessier",
      icon: "yessier",
      title: "Which was yessier?",
      game: { zone: "yessier", name: "Which Was Yessier?" },
      lessons: "Lesson 4",
      blurb: "Compare two votes fairly: yes to no, yes out of all, and percents.",
      steps: 2,
    },
    {
      id: "supermajority",
      icon: "super",
      title: "Majorities and who decides",
      game: { zone: "super", name: "Supermajority" },
      lessons: "Lesson 4",
      blurb: "The fewest votes for a majority or a supermajority, and how few people decide when many don’t vote.",
      steps: 2,
    },
    {
      id: "choices",
      icon: "ballot",
      title: "More than two choices",
      game: { zone: "ballot", name: "Ballot Count" },
      lessons: "Lesson 5",
      blurb: "Count the same ranked ballots three ways: plurality, runoff, and instant runoff points.",
      steps: 3,
    },
    {
      id: "representatives",
      icon: "seats",
      title: "Picking representatives",
      game: { zone: "seats", name: "Fair Seats" },
      lessons: "Lesson 6",
      blurb: "Share representatives fairly by people per representative, and see how district lines change a winner.",
      steps: 3,
    },
  ],
};
