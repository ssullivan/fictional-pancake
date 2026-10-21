/* Learn Fractions as Quotients and Fraction Multiplication (Grade 5 Unit 2): the unit's chapters and their icons. Loaded by
   learn.html and every chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js;
   shared/learn.js has the format. */
const ICON = {
  share:
    '<g stroke="#8a6a2c" stroke-width="2"><rect x="6" y="14" width="52" height="18" rx="5" fill="#e9d2a0"/><rect x="6" y="38" width="52" height="18" rx="5" fill="#e9d2a0"/><rect x="6" y="14" width="17" height="18" rx="4" fill="#ffc93c"/><rect x="6" y="38" width="17" height="18" rx="4" fill="#ffc93c"/></g><path d="M23,16V30M40,16V30M23,40V54M40,40V54" stroke="#5b4520" stroke-width="2" stroke-dasharray="3 2"/>',
  line: '<path d="M4,40H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M8,32V48M32,32V48M56,32V48" stroke="#f3f6fb" stroke-width="2"/><path d="M20,36V44M44,36V44" stroke="#f3f6fb" stroke-width="1.5"/><circle cx="44" cy="40" r="5" fill="#ffc93c"/><text x="32" y="20" fill="#f3f6fb" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">3 ÷ 2</text>',
  of: '<g fill="#c9584b" stroke="#0a2340" stroke-width="1"><circle cx="16" cy="24" r="7"/><circle cx="32" cy="24" r="7"/><circle cx="48" cy="24" r="7"/></g><g fill="#5a6fd6" stroke="#0a2340" stroke-width="1"><circle cx="16" cy="44" r="7"/><circle cx="32" cy="44" r="7"/><circle cx="48" cy="44" r="7"/></g><path d="M8,34H56" stroke="#f3f6fb" stroke-width="1.5" stroke-dasharray="3 2"/>',
  area: '<rect x="8" y="12" width="48" height="40" fill="none" stroke="#f3f6fb" stroke-width="2"/><rect x="8" y="32" width="48" height="20" fill="#ffc93c"/><path d="M24,12V52M40,12V52M8,32H56" stroke="#0a2340" stroke-width="1.5"/><path d="M8,42H56" stroke="#0a2340" stroke-width="1" stroke-dasharray="2 2"/>',
  split:
    '<rect x="6" y="14" width="36" height="36" fill="#ffc93c" stroke="#0a2340" stroke-width="1.5"/><rect x="42" y="14" width="16" height="36" fill="#7fe3ff" stroke="#0a2340" stroke-width="1.5"/><path d="M14,58l4,-6l4,6M30,58l4,-6l4,6" fill="none" stroke="#5fe0a8" stroke-width="2"/>',
};
const UNIT = {
  saveKey: "g5u2-learn",
  game: "Picnic Park",
  icons: ICON,
  chapters: [
    {
      id: "sharing",
      icon: "share",
      title: "Share sandwiches",
      game: { zone: "share", name: "Sandwich Table" },
      lessons: "Lessons 1–3",
      blurb: "Share sandwiches equally, and see why a ÷ b is the fraction a/b.",
      steps: 2,
    },
    {
      id: "division",
      icon: "line",
      title: "Division and fractions",
      game: { zone: "stories", name: "Lemonade Stand" },
      lessons: "Lessons 4–5",
      blurb: "Put a ÷ b on a number line, and share what’s left over instead of stopping at a remainder.",
      steps: 1,
    },
    {
      id: "fraction-of",
      icon: "of",
      title: "A fraction of a number",
      game: { zone: "of", name: "Berry Patch" },
      lessons: "Lessons 6–8",
      blurb: "Divide a whole number into equal parts, take some of them, and multiply a fraction by a whole number.",
      steps: 3,
    },
    {
      id: "area",
      icon: "area",
      title: "Area with a fraction side",
      game: { zone: "area", name: "Picnic Blankets" },
      lessons: "Lessons 9–11",
      blurb:
        "Find the area of a rectangle with a side that’s a fraction, or a mixed number, on a grid of unit squares.",
      steps: 2,
    },
    {
      id: "split",
      icon: "split",
      title: "Split and solve",
      game: { zone: "decompose", name: "Garden Beds" },
      lessons: "Lessons 12–15",
      blurb: "Split a mixed number into its whole and fraction parts to multiply, and solve area stories.",
      steps: 2,
    },
  ],
};
