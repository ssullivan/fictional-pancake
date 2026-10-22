/* Learn Putting It All Together (Grade 5 Unit 8): the unit's chapters and their icons. Loaded by learn.html and every chapter
   page in learn/, after shared/shapes.js (the icons' cubes, iconCube). Each chapter is learn/<id>.html with its widgets and
   steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  whole:
    '<g fill="#f3f6fb" stroke="#0a2340" stroke-width="1.5"><rect x="6" y="18" width="12" height="18" rx="2"/><rect x="20" y="18" width="12" height="18" rx="2"/><rect x="34" y="18" width="12" height="18" rx="2"/><rect x="48" y="18" width="12" height="18" rx="2"/></g><g fill="#0a2340" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace"><text x="12" y="31">9</text><text x="26" y="31">6</text><text x="40" y="31">8</text><text x="54" y="31">7</text></g>',
  volume:
    iconCube(8, 44, 20) +
    '<circle cx="14" cy="52" r="5" fill="#0a2340" stroke="#f3f6fb" stroke-width="2"/><circle cx="40" cy="52" r="5" fill="#0a2340" stroke="#f3f6fb" stroke-width="2"/>',
  fractions:
    '<g stroke="#f3f6fb" stroke-width="1.5"><rect x="6" y="14" width="52" height="12" fill="none"/><rect x="6" y="14" width="26" height="12" fill="#ffc93c"/><rect x="6" y="34" width="52" height="12" fill="none"/><rect x="6" y="34" width="17.3" height="12" fill="#7fe3ff"/></g>',
  mixed:
    '<rect x="10" y="10" width="44" height="44" fill="rgba(169,196,228,.1)" stroke="#f3f6fb" stroke-width="2"/><rect x="10" y="21" width="44" height="33" fill="rgba(127,227,255,.35)"/><rect x="10" y="21" width="29" height="33" fill="#ffc93c"/><text x="32" y="16" fill="#f3f6fb" font-size="8" font-weight="700" text-anchor="middle" font-family="monospace">0.7 × 0.6</text>',
};
const UNIT = {
  saveKey: "g5u8-learn",
  game: "Moving Up Day",
  icons: ICON,
  chapters: [
    {
      id: "whole-numbers",
      icon: "whole",
      title: "Multiply and divide",
      game: { zone: "products", name: "Number Booth" },
      lessons: "Lessons 1–5",
      blurb: "Make the largest product from four digit cards, and divide in friendly chunks.",
      steps: 2,
    },
    {
      id: "volume",
      icon: "volume",
      title: "Volume again",
      game: { zone: "volume", name: "Big Wagon" },
      lessons: "Lessons 6–8",
      blurb: "Find the volume of a wagon bed, and estimate the volume of the world’s largest wagon.",
      steps: 2,
    },
    {
      id: "fractions",
      icon: "fractions",
      title: "Fraction sums and differences",
      game: { zone: "fractions", name: "Fraction Fair" },
      lessons: "Lessons 10–11",
      blurb: "Add and subtract fractions with unlike denominators.",
      steps: 1,
    },
    {
      id: "decimals-fractions",
      icon: "mixed",
      title: "Decimals and fraction products",
      game: { zone: "decimals", name: "Decimal Derby" },
      lessons: "Lessons 12–13",
      blurb: "Add, subtract, multiply, and divide decimals, and multiply fractions on a square.",
      steps: 2,
    },
  ],
};
