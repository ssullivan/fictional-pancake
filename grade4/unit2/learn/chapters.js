/* Learn Fraction Equivalence and Comparison (Grade 4 Unit 2): the unit's chapters and their icons. Loaded by learn.html and every chapter page in learn/.
   Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  strip:
    '<g stroke="#0a2340" stroke-width="1.5"><rect x="6" y="22" width="13" height="20" fill="#ffc93c"/><rect x="19" y="22" width="13" height="20" fill="#ffc93c"/><rect x="32" y="22" width="13" height="20" fill="#ffc93c"/><rect x="45" y="22" width="13" height="20" fill="rgba(243,246,251,.25)"/></g>',
  sizes:
    '<g stroke="#0a2340" stroke-width="1.5"><rect x="6" y="12" width="17.3" height="16" fill="#ffc93c"/><rect x="23.3" y="12" width="17.3" height="16" fill="#ffc93c"/><rect x="40.6" y="12" width="17.4" height="16" fill="rgba(243,246,251,.25)"/><rect x="6" y="34" width="10.4" height="16" fill="#7fe3ff"/><rect x="16.4" y="34" width="10.4" height="16" fill="#7fe3ff"/><rect x="26.8" y="34" width="10.4" height="16" fill="rgba(243,246,251,.25)"/><rect x="37.2" y="34" width="10.4" height="16" fill="rgba(243,246,251,.25)"/><rect x="47.6" y="34" width="10.4" height="16" fill="rgba(243,246,251,.25)"/></g>',
  line: '<path d="M4,40H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M8,32V48M22,35V45M36,35V45M50,35V45M56,32V48" stroke="#f3f6fb" stroke-width="2"/><path d="M8,37Q15,22 22,37M22,37Q29,22 36,37" fill="none" stroke="#ffc93c" stroke-width="2.5"/><circle cx="36" cy="40" r="5" fill="#ffc93c"/>',
  equal:
    '<g stroke="#0a2340" stroke-width="1.5"><rect x="6" y="12" width="26" height="16" fill="#ffc93c"/><rect x="32" y="12" width="26" height="16" fill="rgba(243,246,251,.25)"/><rect x="6" y="34" width="13" height="16" fill="#7fe3ff"/><rect x="19" y="34" width="13" height="16" fill="#7fe3ff"/><rect x="32" y="34" width="13" height="16" fill="rgba(243,246,251,.25)"/><rect x="45" y="34" width="13" height="16" fill="rgba(243,246,251,.25)"/></g>',
  times:
    '<text x="32" y="28" fill="#ffc93c" font-size="16" font-weight="700" text-anchor="middle" font-family="monospace">×2</text><text x="32" y="52" fill="#7fe3ff" font-size="16" font-weight="700" text-anchor="middle" font-family="monospace">÷3</text>',
  compare:
    '<text x="32" y="42" fill="#ffc93c" font-size="30" font-weight="700" text-anchor="middle" font-family="monospace">&lt;&gt;</text>',
};
const UNIT = {
  saveKey: "g4u2-learn",
  icons: ICON,
  chapters: [
    {
      id: "parts",
      icon: "strip",
      title: "Parts of a whole",
      lessons: "Lessons 1–2",
      blurb: "Shade fraction strips to see what the top and bottom numbers mean, and go past 1 whole.",
      steps: 2,
    },
    {
      id: "sizes",
      icon: "sizes",
      title: "Sizes of parts",
      lessons: "Lessons 3–4",
      blurb: "Compare fractions with the same denominator or the same numerator, and split parts in half.",
      steps: 2,
    },
    {
      id: "number-lines",
      icon: "line",
      title: "Fractions on number lines",
      lessons: "Lessons 5–6",
      blurb: "Name points on a number line, and tell how close a fraction is to 0, 1/2, or 1.",
      steps: 2,
    },
    {
      id: "equivalent",
      icon: "equal",
      title: "Equivalent fractions",
      lessons: "Lessons 7–9",
      blurb: "Find fractions that are the same amount, on strips and on number lines.",
      steps: 2,
    },
    {
      id: "multiply-divide",
      icon: "times",
      title: "Multiply or divide to find equivalent fractions",
      lessons: "Lessons 10–11",
      blurb: "Split every part to multiply, or group parts together to divide.",
      steps: 2,
    },
    {
      id: "compare",
      icon: "compare",
      title: "Compare and order fractions",
      lessons: "Lessons 12–16",
      blurb: "Choose a way to compare, use a common denominator, and put fractions in order.",
      steps: 3,
    },
  ],
};
