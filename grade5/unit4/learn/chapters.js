/* Learn Wrapping Up Multiplication and Division with Multi-digit Numbers (Grade 5 Unit 4): the unit's chapters and their
   icons. Loaded by learn.html and every chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in
   learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  estimate:
    '<path d="M8,46A24,24 0 0 1 56,46" fill="none" stroke="#f3f6fb" stroke-width="3"/><path d="M32,46L46,26" stroke="#ffc93c" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="46" r="4" fill="#ffc93c"/><text x="32" y="60" fill="#7fe3ff" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">≈ 8,000</text>',
  partial:
    '<g stroke-width="2"><rect x="6" y="12" width="30" height="26" fill="rgba(255,201,60,.3)" stroke="#ffc93c"/><rect x="36" y="12" width="14" height="26" fill="rgba(127,227,255,.3)" stroke="#7fe3ff"/><rect x="50" y="12" width="8" height="26" fill="rgba(255,201,60,.3)" stroke="#ffc93c"/><rect x="6" y="38" width="30" height="14" fill="rgba(127,227,255,.3)" stroke="#7fe3ff"/><rect x="36" y="38" width="14" height="14" fill="rgba(255,201,60,.3)" stroke="#ffc93c"/><rect x="50" y="38" width="8" height="14" fill="rgba(127,227,255,.3)" stroke="#7fe3ff"/></g>',
  standard:
    '<g fill="#f3f6fb" font-size="11" font-weight="700" text-anchor="end" font-family="monospace"><text x="54" y="16">347</text><text x="54" y="28">× 26</text></g><path d="M14,32H56M14,50H56" stroke="#f3f6fb" stroke-width="1.5"/><g fill="#ffc93c" font-size="10" font-weight="700" text-anchor="end" font-family="monospace"><text x="54" y="42">2082</text><text x="54" y="61">9022</text></g>',
  quotients:
    '<text x="14" y="22" fill="#f3f6fb" font-size="11" font-weight="700" font-family="monospace">24)1728</text><text x="16" y="38" fill="#7fe3ff" font-size="10" font-weight="700" font-family="monospace">−1200 50</text><text x="16" y="54" fill="#7fe3ff" font-size="10" font-weight="700" font-family="monospace">− 528 22</text>',
  sides:
    '<rect x="10" y="16" width="44" height="30" fill="rgba(255,201,60,.3)" stroke="#ffc93c" stroke-width="2"/><text x="32" y="35" fill="#f3f6fb" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">864</text><text x="32" y="12" fill="#7fe3ff" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">?</text><text x="4" y="35" fill="#7fe3ff" font-size="9" font-weight="700" font-family="monospace">24</text>',
  work: '<path d="M20,10L28,24H12Z" fill="#5fe0a8"/><path d="M48,24L56,38H40Z" fill="#5fe0a8" transform="rotate(120 48 31)"/><path d="M18,42L26,56H10Z" fill="#5fe0a8" transform="rotate(240 18 49)"/><circle cx="32" cy="34" r="16" fill="none" stroke="#5fe0a8" stroke-width="3" stroke-dasharray="20 8"/>',
};
const UNIT = {
  saveKey: "g5u4-learn",
  game: "Record Breakers",
  icons: ICON,
  chapters: [
    {
      id: "estimate",
      icon: "estimate",
      title: "Estimate products",
      game: { zone: "estimate", name: "Guess-o-Meter" },
      lessons: "Lesson 1",
      blurb: "Round to friendly numbers to estimate a product, and use the estimate to check an answer.",
      steps: 1,
    },
    {
      id: "partial",
      icon: "partial",
      title: "Partial products",
      game: { zone: "partial", name: "Big Build" },
      lessons: "Lessons 2–3",
      blurb: "Split both numbers by place on an area diagram, then record and add the partial products.",
      steps: 2,
    },
    {
      id: "standard",
      icon: "standard",
      title: "The standard algorithm",
      game: { zone: "standard", name: "Stack Attack" },
      lessons: "Lessons 4–9",
      blurb: "Multiply column by column, carrying, then by a two-digit number in two rows.",
      steps: 2,
    },
    {
      id: "quotients",
      icon: "quotients",
      title: "Partial quotients",
      game: { zone: "quotients", name: "Dance Floor" },
      lessons: "Lessons 10–14",
      blurb: "Divide by a two-digit number in friendly chunks, more than one way.",
      steps: 2,
    },
    {
      id: "sides",
      icon: "sides",
      title: "Missing side lengths",
      game: { zone: "sides", name: "Noodle Soup" },
      lessons: "Lessons 15–16",
      blurb: "Divide an area by one side to find the other.",
      steps: 1,
    },
    {
      id: "work",
      icon: "work",
      title: "Put it to work",
      game: { zone: "work", name: "Recycling Center" },
      lessons: "Lessons 18–20",
      blurb: "Solve problems with more than one step about milk, trash, and recycling.",
      steps: 1,
    },
  ],
};
