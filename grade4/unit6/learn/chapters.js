/* Learn Multiplying and Dividing Multi-digit Numbers (Grade 4 Unit 6): the unit's chapters and their icons. Loaded by learn.html and every chapter page in learn/.
   Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  pattern:
    '<g stroke="#0a2340" stroke-width="1.5"><circle cx="10" cy="32" r="6" fill="#ffc93c"/><rect x="20" y="26" width="12" height="12" fill="#7fe3ff"/><circle cx="42" cy="32" r="6" fill="#ffc93c"/><rect x="52" y="26" width="12" height="12" fill="#7fe3ff"/></g><text x="32" y="56" fill="#f3f6fb" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">3, 7, 11, …</text>',
  area: '<g stroke-width="2"><rect x="8" y="14" width="34" height="36" fill="rgba(255,201,60,.3)" stroke="#ffc93c"/><rect x="42" y="14" width="14" height="36" fill="rgba(127,227,255,.3)" stroke="#7fe3ff"/></g><text x="25" y="10" fill="#f3f6fb" font-size="9" font-weight="700" text-anchor="middle" font-family="monospace">30</text><text x="49" y="10" fill="#f3f6fb" font-size="9" font-weight="700" text-anchor="middle" font-family="monospace">4</text>',
  area2:
    '<g stroke-width="2"><rect x="8" y="10" width="34" height="28" fill="rgba(255,201,60,.3)" stroke="#ffc93c"/><rect x="42" y="10" width="14" height="28" fill="rgba(127,227,255,.3)" stroke="#7fe3ff"/><rect x="8" y="38" width="34" height="14" fill="rgba(127,227,255,.3)" stroke="#7fe3ff"/><rect x="42" y="38" width="14" height="14" fill="rgba(255,201,60,.3)" stroke="#ffc93c"/></g>',
  alg: '<g fill="#f3f6fb" font-size="13" font-weight="700" text-anchor="end" font-family="monospace"><text x="52" y="28">347</text><text x="52" y="42">×  6</text></g><path d="M18,47H54" stroke="#f3f6fb" stroke-width="2"/><text x="52" y="60" fill="#ffc93c" font-size="13" font-weight="700" text-anchor="end" font-family="monospace">2082</text><text x="36" y="14" fill="#7fe3ff" font-size="9" font-weight="700" font-family="monospace">2 4</text>',
  groups:
    '<g fill="none" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="4 3"><circle cx="16" cy="32" r="12"/><circle cx="48" cy="32" r="12"/></g><g fill="#ffc93c"><circle cx="12" cy="28" r="3"/><circle cx="20" cy="28" r="3"/><circle cx="16" cy="36" r="3"/><circle cx="44" cy="28" r="3"/><circle cx="52" cy="28" r="3"/><circle cx="48" cy="36" r="3"/></g>',
  blocks:
    '<g fill="rgba(127,227,255,.5)" stroke="#0a2340" stroke-width="1"><rect x="8" y="12" width="6" height="40"/><rect x="16" y="12" width="6" height="40"/><rect x="24" y="12" width="6" height="40"/></g><g fill="#5fe0a8" stroke="#0a2340" stroke-width="1"><rect x="38" y="44" width="6" height="6"/><rect x="46" y="44" width="6" height="6"/><rect x="38" y="36" width="6" height="6"/><rect x="46" y="36" width="6" height="6"/></g>',
  rem: '<text x="32" y="30" fill="#f3f6fb" font-size="13" font-weight="700" text-anchor="middle" font-family="monospace">29 ÷ 4</text><text x="32" y="50" fill="#ffc93c" font-size="13" font-weight="700" text-anchor="middle" font-family="monospace">7 R 1</text>',
  check:
    '<text x="32" y="28" fill="#f3f6fb" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">48 × 21</text><text x="32" y="48" fill="#7fe3ff" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">≈ 1,000</text>',
};
const UNIT = {
  saveKey: "g4u6-learn",
  game: "City Builders",
  icons: ICON,
  chapters: [
    {
      id: "patterns",
      icon: "pattern",
      title: "Patterns",
      game: { zone: "patterns", name: "Pattern Park" },
      lessons: "Lessons 1–4",
      blurb: "Follow a rule to grow a number pattern, and find any shape in a pattern that repeats.",
      steps: 2,
    },
    {
      id: "multiply-one",
      icon: "area",
      title: "Multiply by a one-digit number",
      game: { zone: "multiply", name: "Brick Yard" },
      lessons: "Lessons 5–7, 9",
      blurb: "Split a number into its places on an area diagram, and add the partial products.",
      steps: 2,
    },
    {
      id: "two-digit",
      icon: "area2",
      title: "Multiply two two-digit numbers",
      game: { zone: "twodigit", name: "Tile Plaza" },
      lessons: "Lessons 8, 10",
      blurb: "Find the four partial products of a two-digit by two-digit product.",
      steps: 2,
    },
    {
      id: "standard",
      icon: "alg",
      title: "The standard algorithm to multiply",
      game: { zone: "standard", name: "Crane Works" },
      lessons: "Lessons 11–12",
      blurb: "Multiply column by column, carrying to the next place, and choose a way to solve a problem.",
      steps: 2,
    },
    {
      id: "situations",
      icon: "groups",
      title: "Division situations",
      game: { zone: "divide", name: "Bus Depot" },
      lessons: "Lessons 13–15",
      blurb: "Find how many groups or how many in each group, and a missing side from an area.",
      steps: 2,
    },
    {
      id: "divide",
      icon: "blocks",
      title: "Divide with base-ten blocks and partial quotients",
      game: { zone: "divide", name: "Bus Depot" },
      lessons: "Lessons 16–18",
      blurb: "Share base-ten blocks, trading when you need to, then divide in chunks.",
      steps: 2,
    },
    {
      id: "remainders",
      icon: "rem",
      title: "Remainders",
      game: { zone: "remainder", name: "Delivery Trucks" },
      lessons: "Lessons 19–20",
      blurb: "Find what’s left over, and decide what to do with it in a story.",
      steps: 2,
    },
    {
      id: "solve",
      icon: "check",
      title: "Solve and check",
      game: { zone: "solve", name: "City Hall" },
      lessons: "Lessons 21–24",
      blurb: "Estimate to tell whether an answer makes sense, and solve problems with more than one step.",
      steps: 2,
    },
  ],
};
