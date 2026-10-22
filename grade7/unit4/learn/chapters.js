/* Learn Proportional Relationships and Percentages (Grade 7 Unit 4): the unit's chapters and their icons. Loaded by
   learn.html and every chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js;
   shared/learn.js has the format. */
const ICON = {
  rates:
    '<text x="32" y="30" fill="#ffc93c" font-size="15" font-weight="800" text-anchor="middle" font-family="monospace">3/4</text><path d="M14,36 H50" stroke="#f3f6fb" stroke-width="2.5"/><text x="32" y="54" fill="#7fe3ff" font-size="15" font-weight="800" text-anchor="middle" font-family="monospace">1/4</text>',
  again:
    '<rect x="6" y="22" width="34" height="20" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/><rect x="40" y="22" width="17" height="20" fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="2.5"/><text x="48" y="16" fill="#ffc93c" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">+½</text>',
  change:
    '<path d="M10,26 L30,8 H54 V44 H30 Z" fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="2.5" stroke-linejoin="round"/><circle cx="24" cy="26" r="3.5" fill="#0a2340"/><text x="42" y="31" fill="#f3f6fb" font-size="12" font-weight="800" text-anchor="middle" font-family="monospace">%</text><path d="M20,56 l8,-8 8,8" fill="none" stroke="#5fe0a8" stroke-width="3"/>',
  tax: '<rect x="12" y="6" width="40" height="52" rx="3" fill="rgba(243,246,251,.12)" stroke="#f3f6fb" stroke-width="2.5"/><path d="M18,18 H46 M18,28 H46 M18,38 H40" stroke="#7fe3ff" stroke-width="2.5"/><text x="32" y="53" fill="#ffc93c" font-size="10" font-weight="800" text-anchor="middle" font-family="monospace">+6%</text>',
  error:
    '<rect x="6" y="24" width="52" height="16" rx="2" fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="2"/><path d="M14,24 v6 M22,24 v9 M30,24 v6 M38,24 v9 M46,24 v6" stroke="#0a2340" stroke-width="2"/><text x="32" y="56" fill="#f3f6fb" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">±2%</text>',
};
const UNIT = {
  saveKey: "g7u4-learn",
  game: "Mall Rush",
  icons: ICON,
  chapters: [
    {
      id: "fraction-rates",
      icon: "rates",
      title: "Rates with fractions",
      game: { zone: "rates", name: "Fraction Rates" },
      lessons: "Lessons 1–3, 5",
      blurb: "Divide by a fraction of an hour to find a rate per hour, and multiply prices with decimals.",
      steps: 2,
    },
    {
      id: "half-again",
      icon: "again",
      title: "Half as much again",
      game: { zone: "again", name: "Half Again" },
      lessons: "Lesson 4",
      blurb: "Growing by a fraction is multiplying by 1 plus that fraction; shrinking is 1 minus it.",
      steps: 1,
    },
    {
      id: "percent-change",
      icon: "change",
      title: "Percent increase and decrease",
      game: { zone: "change", name: "Price Tags" },
      lessons: "Lessons 6–9",
      blurb:
        "A new price is a percent of the old one: 120% after a 20% increase. Work back to 100%, and write the equation.",
      steps: 3,
    },
    {
      id: "tax-tip",
      icon: "tax",
      title: "Tax, tips, and deals",
      game: { zone: "tax", name: "Checkout" },
      lessons: "Lessons 10–12",
      blurb: "Sales tax, tips, discounts, markups, commission, interest, and the percent a price changed.",
      steps: 3,
    },
    {
      id: "error",
      icon: "error",
      title: "Measurement error",
      game: { zone: "error", name: "Measure Up" },
      lessons: "Lessons 13–15",
      blurb:
        "How far off a measurement is, as an amount and as a percent of the real size, and the range a size can be in.",
      steps: 2,
    },
  ],
};
