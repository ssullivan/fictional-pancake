/* Learn More Decimal and Fraction Operations (Grade 5 Unit 6): the unit's chapters and their icons. Loaded by learn.html and
   every chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js
   has the format. */
const ICON = {
  powers:
    '<text x="32" y="32" fill="#f3f6fb" font-size="18" font-weight="700" text-anchor="middle" font-family="monospace">10</text><text x="48" y="20" fill="#ffc93c" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">3</text><text x="32" y="54" fill="#7fe3ff" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">1,000</text>',
  metric:
    '<path d="M30,58V10" stroke="#a9822a" stroke-width="4"/><path d="M32,12H56L50,20L56,28H32Z" fill="#5fe0a8" stroke="#0a2340" stroke-width="1.5"/><text x="43" y="23" fill="#0a2340" font-size="8" font-weight="700" text-anchor="middle" font-family="monospace">km</text>',
  customary:
    '<rect x="4" y="26" width="56" height="12" fill="#ffc93c" stroke="#0a2340" stroke-width="1.5"/><path d="M8,26V32M13,26V30M18,26V34M23,26V30M28,26V32M33,26V30M38,26V34M43,26V30M48,26V32M53,26V30" stroke="#0a2340" stroke-width="1.2"/><text x="32" y="52" fill="#f3f6fb" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">1 ft</text>',
  unlike:
    '<g stroke="#f3f6fb" stroke-width="1.5"><rect x="6" y="14" width="52" height="12" fill="none"/><rect x="6" y="14" width="26" height="12" fill="#ffc93c"/><rect x="6" y="34" width="52" height="12" fill="none"/><rect x="6" y="34" width="17.3" height="12" fill="#7fe3ff"/></g><path d="M23.3,34V46M40.6,34V46" stroke="#f3f6fb" stroke-width="1.5"/>',
  plots:
    '<path d="M6,48H58" stroke="#f3f6fb" stroke-width="2"/><g fill="#ffc93c" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace"><text x="16" y="42">X</text><text x="28" y="42">X</text><text x="28" y="32">X</text><text x="40" y="42">X</text><text x="40" y="32">X</text><text x="40" y="22">X</text><text x="52" y="42">X</text></g>',
  size: '<rect x="6" y="18" width="40" height="12" rx="3" fill="#ffc93c"/><rect x="6" y="36" width="52" height="12" rx="3" fill="#7fe3ff"/><text x="32" y="14" fill="#f3f6fb" font-size="9" font-weight="700" text-anchor="middle" font-family="monospace">&lt; or &gt;?</text>',
};
const UNIT = {
  saveKey: "g5u6-learn",
  game: "Trail Rangers",
  icons: ICON,
  chapters: [
    {
      id: "powers",
      icon: "powers",
      title: "Powers of 10",
      game: { zone: "powers", name: "Ranger Station" },
      lessons: "Lessons 1–2",
      blurb:
        "Watch the digits move when you multiply or divide by 10, 100, or 1,000, and write powers of 10 with exponents.",
      steps: 2,
    },
    {
      id: "metric",
      icon: "metric",
      title: "Metric conversions",
      game: { zone: "metric", name: "Trail Markers" },
      lessons: "Lessons 3–6",
      blurb: "Multiply to change to a smaller unit, divide to change to a bigger one.",
      steps: 2,
    },
    {
      id: "customary",
      icon: "customary",
      title: "Yards, feet, and inches",
      game: { zone: "customary", name: "Rope Bridge" },
      lessons: "Lesson 7",
      blurb: "Change yards to feet and feet to inches.",
      steps: 1,
    },
    {
      id: "unlike",
      icon: "unlike",
      title: "Unlike denominators",
      game: { zone: "unlike", name: "Trail Mix" },
      lessons: "Lessons 8–13",
      blurb: "Write fractions with a common denominator to add and subtract, and trade a whole when you need to.",
      steps: 2,
    },
    {
      id: "line-plots",
      icon: "plots",
      title: "Line plots",
      game: { zone: "plots", name: "Rain Gauge" },
      lessons: "Lessons 14–15",
      blurb: "Answer questions about measurements in eighths of an inch.",
      steps: 1,
    },
    {
      id: "size",
      icon: "size",
      title: "The size of products",
      game: { zone: "size", name: "Lookout Point" },
      lessons: "Lessons 16–19",
      blurb: "Tell whether a product is more or less than a number without multiplying.",
      steps: 1,
    },
  ],
};
