/* Learn Factors and Multiples (Grade 4 Unit 1): the unit's chapters and their icons. Loaded by learn.html and every chapter page in learn/.
   Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  hops: '<path d="M4,46H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M8,44Q20,18 32,44M32,44Q44,18 56,44" fill="none" stroke="#ffc93c" stroke-width="3"/><circle cx="32" cy="46" r="3.5" fill="#ffc93c"/><circle cx="56" cy="46" r="3.5" fill="#ffc93c"/>',
  rect: '<g fill="rgba(255,201,60,.55)" stroke="#0a2340" stroke-width="1.5"><rect x="8" y="14" width="12" height="12"/><rect x="20" y="14" width="12" height="12"/><rect x="32" y="14" width="12" height="12"/><rect x="44" y="14" width="12" height="12"/><rect x="8" y="26" width="12" height="12"/><rect x="20" y="26" width="12" height="12"/><rect x="32" y="26" width="12" height="12"/><rect x="44" y="26" width="12" height="12"/><rect x="8" y="38" width="12" height="12"/><rect x="20" y="38" width="12" height="12"/><rect x="32" y="38" width="12" height="12"/><rect x="44" y="38" width="12" height="12"/></g>',
  prime:
    '<g fill="rgba(255,201,60,.55)" stroke="#0a2340" stroke-width="1.5">' +
    range(7)
      .map((i) => `<rect x="${4 + i * 8}" y="24" width="8" height="8"/>`)
      .join("") +
    '</g><text x="32" y="52" fill="#7fe3ff" font-size="13" font-weight="700" text-anchor="middle" font-family="monospace">1 × 7</text>',
  lockers:
    '<g stroke="#7fe3ff" stroke-width="2"><rect x="6" y="10" width="15" height="44" fill="rgba(127,227,255,.35)"/><rect x="24.5" y="10" width="15" height="44" fill="#061528"/><rect x="43" y="10" width="15" height="44" fill="rgba(127,227,255,.35)"/></g><polygon points="24.5,10 30,15 30,49 24.5,54" fill="rgba(127,227,255,.6)" stroke="#7fe3ff" stroke-width="1.5"/>',
  pair: '<text x="32" y="30" fill="#ffc93c" font-size="17" font-weight="700" text-anchor="middle" font-family="monospace">6 × 7</text><text x="32" y="52" fill="#7fe3ff" font-size="17" font-weight="700" text-anchor="middle" font-family="monospace">= 42</text>',
};
const UNIT = {
  saveKey: "g4u1-learn",
  game: "Factor Factory",
  icons: ICON,
  /* the order of the chapters when the unit was one page (learn.html#c2s1), for progress saved then and old links */
  legacy: ["multiples", "factor-pairs", "prime", "common-multiples", "factors-and-multiples"],
  chapters: [
    {
      id: "multiples",
      icon: "hops",
      title: "Multiples",
      game: { zone: "hops", name: "Hop Belt" },
      lessons: "Lesson 1",
      blurb: "Skip-count on a number line to find multiples, and tell whether a number is a multiple.",
      steps: 2,
    },
    {
      id: "factor-pairs",
      icon: "rect",
      title: "Factor pairs",
      game: { zone: "tiles", name: "Tile Press" },
      lessons: "Lesson 2",
      blurb: "Arrange tiles in equal rows to find factor pairs, then find every pair for a number.",
      steps: 2,
    },
    {
      id: "prime",
      icon: "prime",
      title: "Prime and composite",
      game: { zone: "prime", name: "Prime Sorter" },
      lessons: "Lesson 3",
      blurb: "See which numbers make only one rectangle, and sort the numbers to 30.",
      steps: 2,
    },
    {
      id: "common-multiples",
      icon: "lockers",
      title: "Common multiples and lockers",
      game: { zone: "lockers", name: "Locker Room" },
      lessons: "Lessons 5–6",
      blurb: "Find multiples two numbers share, and solve the Locker Problem.",
      steps: 2,
    },
    {
      id: "factors-and-multiples",
      icon: "pair",
      title: "Factors and multiples together",
      game: { zone: "gears", name: "Gear Works" },
      lessons: "Lesson 7",
      blurb: "Say how a factor and a multiple are related, and find all the factors of a number.",
      steps: 2,
    },
  ],
};
