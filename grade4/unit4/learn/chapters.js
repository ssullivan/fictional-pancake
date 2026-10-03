/* Learn From Hundredths to Hundred-thousands (Grade 4 Unit 4): the unit's chapters and their icons. Loaded by learn.html and every chapter page in learn/.
   Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  dec: '<text x="32" y="42" fill="#ffc93c" font-size="24" font-weight="700" text-anchor="middle" font-family="monospace">0.47</text>',
  decline:
    '<path d="M4,40H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M8,32V48M56,32V48" stroke="#f3f6fb" stroke-width="2"/><path d="M12.8,36V44M17.6,36V44M22.4,36V44M27.2,36V44M32,34V46M36.8,36V44M41.6,36V44M46.4,36V44M51.2,36V44" stroke="#f3f6fb" stroke-width="1.5"/><circle cx="41.6" cy="40" r="5" fill="#ffc93c"/><text x="41.6" y="24" fill="#7fe3ff" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">0.7</text>',
  big: '<text x="32" y="30" fill="#ffc93c" font-size="15" font-weight="700" text-anchor="middle" font-family="monospace">100,000</text><text x="32" y="50" fill="#7fe3ff" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">10 × 10,000</text>',
  times:
    '<text x="32" y="30" fill="#f3f6fb" font-size="15" font-weight="700" text-anchor="middle" font-family="monospace">450</text><text x="32" y="52" fill="#ffc93c" font-size="15" font-weight="700" text-anchor="middle" font-family="monospace">4,500</text><path d="M50,24Q58,36 50,44" fill="none" stroke="#7fe3ff" stroke-width="2"/>',
  compare:
    '<text x="32" y="30" fill="#f3f6fb" font-size="13" font-weight="700" text-anchor="middle" font-family="monospace">45,302</text><text x="32" y="44" fill="#ffc93c" font-size="14" font-weight="700" text-anchor="middle" font-family="monospace">&gt;</text><text x="32" y="58" fill="#f3f6fb" font-size="13" font-weight="700" text-anchor="middle" font-family="monospace">45,230</text>',
  round:
    '<path d="M4,44H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M8,36V52M32,38V50M56,36V52" stroke="#f3f6fb" stroke-width="2"/><circle cx="20" cy="44" r="5" fill="#ffc93c"/><path d="M18,34Q12,22 8,32" fill="none" stroke="#7fe3ff" stroke-width="2.5"/><text x="32" y="20" fill="#7fe3ff" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">about</text>',
  alg: '<g fill="#f3f6fb" font-size="13" font-weight="700" text-anchor="end" font-family="monospace"><text x="52" y="26">4625</text><text x="52" y="40">+2318</text></g><path d="M14,45H54" stroke="#f3f6fb" stroke-width="2"/><text x="52" y="58" fill="#ffc93c" font-size="13" font-weight="700" text-anchor="end" font-family="monospace">6943</text><text x="36" y="13" fill="#7fe3ff" font-size="9" font-weight="700" font-family="monospace">1</text>',
};
const UNIT = {
  saveKey: "g4u4-learn",
  icons: ICON,
  chapters: [
    {
      id: "decimals",
      icon: "dec",
      title: "Decimals",
      lessons: "Lessons 1–2",
      blurb: "Write tenths and hundredths as decimals like 0.47, and see why 0.5 and 0.50 are the same.",
      steps: 2,
    },
    {
      id: "decimal-lines",
      icon: "decline",
      title: "Decimals on number lines",
      lessons: "Lessons 3–5",
      blurb: "Find decimals on number lines, and compare and order decimals and fractions.",
      steps: 2,
    },
    {
      id: "big-numbers",
      icon: "big",
      title: "Numbers to 1,000,000",
      lessons: "Lessons 6–9",
      blurb: "Make 10,000 and 100,000 from thousands, and find what each digit is worth.",
      steps: 2,
    },
    {
      id: "ten-times",
      icon: "times",
      title: "Ten times as much",
      lessons: "Lessons 10–11",
      blurb: "Watch digits move a place when you multiply by 10, and read large numbers on number lines.",
      steps: 2,
    },
    {
      id: "compare-order",
      icon: "compare",
      title: "Compare and order",
      lessons: "Lessons 12–13",
      blurb: "Compare big numbers place by place, and put them in order.",
      steps: 2,
    },
    {
      id: "round",
      icon: "round",
      title: "Round",
      lessons: "Lessons 14–17",
      blurb: "Find the nearest thousand, ten thousand, or hundred thousand, and estimate with rounded numbers.",
      steps: 2,
    },
    {
      id: "add-subtract",
      icon: "alg",
      title: "Add and subtract",
      lessons: "Lessons 18–22",
      blurb: "Add and subtract in columns with the standard algorithm, including across zeros.",
      steps: 3,
    },
  ],
};
