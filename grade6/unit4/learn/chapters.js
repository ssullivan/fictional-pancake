/* Learn Dividing Fractions (Grade 6 Unit 4): the unit's chapters and their icons. Loaded by learn.html and every chapter page in learn/.
   Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  meanings:
    '<text x="32" y="42" fill="#f3f6fb" font-size="24" font-weight="700" text-anchor="middle" font-family="monospace">12÷?</text><line x1="8" y1="52" x2="56" y2="52" stroke="#ffc93c" stroke-width="2.5"/>',
  groups:
    '<rect x="4" y="22" width="56" height="20" fill="rgba(9,32,61,.6)" stroke="#f3f6fb" stroke-width="2"/><rect x="4" y="22" width="18" height="20" fill="rgba(255,201,60,.55)"/><rect x="22" y="22" width="18" height="20" fill="rgba(127,227,255,.45)"/><rect x="40" y="22" width="12" height="20" fill="rgba(95,224,168,.5)"/><path d="M5,48v4H21v-4M23,48v4H39v-4" fill="none" stroke="#f3f6fb" stroke-width="2"/>',
  part: '<rect x="6" y="24" width="52" height="18" fill="rgba(9,32,61,.6)" stroke="#f3f6fb" stroke-width="2"/><rect x="6" y="24" width="34.7" height="18" fill="rgba(255,201,60,.55)" stroke="#ffc93c" stroke-width="2"/><line x1="23.3" y1="24" x2="23.3" y2="42" stroke="#f3f6fb" stroke-width="1.5"/>',
  each: '<path d="M14,12 L50,12 L46,56 L18,56 Z" fill="rgba(9,32,61,.6)" stroke="#f3f6fb" stroke-width="2.5"/><path d="M16.5,30 L47.5,30 L46,56 L18,56 Z" fill="rgba(127,227,255,.45)"/><text x="32" y="25" fill="#ffc93c" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">?</text>',
  recip:
    '<text x="20" y="28" text-anchor="middle" font-family="monospace" font-weight="700" font-size="16" fill="#ffc93c">2</text><line x1="12" y1="33" x2="28" y2="33" stroke="#ffc93c" stroke-width="2"/><text x="20" y="50" text-anchor="middle" font-family="monospace" font-weight="700" font-size="16" fill="#ffc93c">3</text><text x="44" y="28" text-anchor="middle" font-family="monospace" font-weight="700" font-size="16" fill="#7fe3ff">3</text><line x1="36" y1="33" x2="52" y2="33" stroke="#7fe3ff" stroke-width="2"/><text x="44" y="50" text-anchor="middle" font-family="monospace" font-weight="700" font-size="16" fill="#7fe3ff">2</text><path d="M26,14 Q32,6 38,14" fill="none" stroke="#f3f6fb" stroke-width="2"/>',
  area:
    '<g fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="1.5">' +
    [0, 1, 2, 3]
      .map((i) => [0, 1, 2].map((j) => `<rect x="${8 + i * 12}" y="${14 + j * 12}" width="12" height="12"/>`).join(""))
      .join("") +
    '</g><rect x="8" y="14" width="42" height="36" fill="none" stroke="#f3f6fb" stroke-width="2.5"/>',
  prism:
    '<polygon points="10,24 40,24 40,54 10,54" fill="rgba(255,201,60,.4)" stroke="#f3f6fb" stroke-width="2.5"/><polygon points="10,24 22,12 52,12 40,24" fill="rgba(255,201,60,.6)" stroke="#f3f6fb" stroke-width="2.5"/><polygon points="40,24 52,12 52,42 40,54" fill="rgba(255,201,60,.25)" stroke="#f3f6fb" stroke-width="2.5"/><g stroke="#f3f6fb" stroke-width="1"><line x1="25" y1="24" x2="25" y2="54"/><line x1="10" y1="39" x2="40" y2="39"/></g>',
  together:
    '<text x="32" y="30" fill="#ffc93c" font-size="20" font-weight="700" text-anchor="middle" font-family="monospace">+ −</text><text x="32" y="54" fill="#7fe3ff" font-size="20" font-weight="700" text-anchor="middle" font-family="monospace">× ÷</text>',
};
const UNIT = {
  saveKey: "g6u4-learn",
  game: "Fraction Workshop",
  icons: ICON,
  chapters: [
    {
      id: "meanings",
      icon: "meanings",
      title: "Making sense of division",
      game: { zone: "size", name: "Quotient Check" },
      lessons: "Lessons 1–3",
      blurb: "How the divisor changes the quotient, the two meanings of division, and groups, size, and total.",
      steps: 3,
    },
    {
      id: "how-many-groups",
      icon: "groups",
      title: "How many groups?",
      game: { zone: "groups", name: "Cut List" },
      lessons: "Lessons 4–6",
      blurb:
        "Count groups of a fraction with pattern blocks, tape diagrams, and a ruler, and name the part of a group left over.",
      steps: 4,
    },
    {
      id: "fraction-of-group",
      icon: "part",
      title: "What fraction of a group?",
      game: { zone: "part", name: "Part of a Job" },
      lessons: "Lesson 7",
      blurb: "When there isn’t a whole group, and comparing two amounts with “times as much.”",
      steps: 2,
    },
    {
      id: "each-group",
      icon: "each",
      title: "How much in each group?",
      game: { zone: "fill", name: "Fill Line" },
      lessons: "Lessons 8–9",
      blurb: "Part of a pitcher is full: how much does the whole thing hold? And how much for 1?",
      steps: 3,
    },
    {
      id: "algorithm",
      icon: "recip",
      title: "Dividing fractions",
      game: { zone: "recip", name: "Reciprocal Saw" },
      lessons: "Lessons 10–11",
      blurb:
        "Why dividing by a fraction is multiplying by its reciprocal, another way with same-size pieces, and checking that an answer makes sense.",
      steps: 6,
    },
    {
      id: "lengths-areas",
      icon: "area",
      title: "Lengths and areas",
      game: { zone: "tile", name: "Tile Shop" },
      lessons: "Lessons 12–13",
      blurb: "How many times as long, rectangles with fractional sides, and finding a missing side.",
      steps: 3,
    },
    {
      id: "triangles-prisms",
      icon: "prism",
      title: "Triangles and prisms",
      game: { zone: "crate", name: "Crate Packer" },
      lessons: "Lessons 14–15",
      blurb: "Triangles with fractional sides, small cubes in a big one, and the volume of a box.",
      steps: 3,
    },
    {
      id: "put-together",
      icon: "together",
      title: "Putting it together",
      game: { zone: "boss", name: "Big Build" },
      lessons: "Lesson 16",
      blurb: "Choose the operation, and find how many batches two amounts allow.",
      steps: 2,
    },
  ],
};
