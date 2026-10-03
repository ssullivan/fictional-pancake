/* Learn Measuring Length (Grade 2 Unit 3): the unit's chapters and their icons. Loaded by learn.html and every chapter page in learn/.
   Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  ruler:
    '<rect x="4" y="20" width="56" height="24" rx="3" fill="rgba(255,201,60,.3)" stroke="#ffc93c" stroke-width="2"/><path d="M12,20v10M20,20v6M28,20v10M36,20v6M44,20v10M52,20v6" stroke="#f3f6fb" stroke-width="2"/>',
  meter:
    '<rect x="6" y="18" width="16" height="10" rx="2" fill="#ff7b7b"/><rect x="2" y="36" width="30" height="12" fill="#ffc93c"/><rect x="32" y="36" width="30" height="12" fill="#7fe3ff"/>',
  foot: '<rect x="4" y="16" width="56" height="18" rx="2" fill="rgba(127,227,255,.25)" stroke="#7fe3ff" stroke-width="2"/><path d="M8.7,16v5M13.3,16v5M18,16v5M22.7,16v5M27.3,16v5M32,16v9M36.7,16v5M41.3,16v5M46,16v5M50.7,16v5M55.3,16v5" stroke="#f3f6fb" stroke-width="1.5"/><text x="32" y="52" fill="#ffc93c" font-size="14" font-weight="700" text-anchor="middle" font-family="monospace">12 in</text>',
  silk: '<path d="M4,50H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M6,36H32" stroke="#7fe3ff" stroke-width="3"/><polygon points="40,36 31,31 31,41" fill="#7fe3ff"/><path d="M40,20H50" stroke="#ffc93c" stroke-width="3"/><polygon points="58,20 49,15 49,25" fill="#ffc93c"/>',
  plot: '<path d="M4,50H60" stroke="#f3f6fb" stroke-width="2.5"/><g fill="#ffc93c" font-size="13" font-weight="700" font-family="monospace" text-anchor="middle"><text x="14" y="44">X</text><text x="32" y="44">X</text><text x="32" y="32">X</text><text x="32" y="20">X</text><text x="50" y="44">X</text><text x="50" y="32">X</text></g>',
};
const UNIT = {
  saveKey: "g2u3-learn",
  readAloud: true,
  icons: ICON,
  /* the order of the chapters when the unit was one page (learn.html#c2s1), for progress saved then and old links */
  legacy: ["units", "cm-and-m", "inches-and-feet", "length-stories", "line-plots"],
  chapters: [
    {
      id: "units",
      icon: "ruler",
      title: "Units of length",
      lessons: "Lessons 1–3",
      blurb: "Measure with same-size units, line up centimeter cubes, and use a ruler the right way.",
      steps: 3,
    },
    {
      id: "cm-and-m",
      icon: "meter",
      title: "Centimeters and meters",
      lessons: "Lessons 4–6",
      blurb: "Estimate lengths, use meters for long things, and find how much longer one reptile is than another.",
      steps: 3,
    },
    {
      id: "inches-and-feet",
      icon: "foot",
      title: "Inches and feet",
      lessons: "Lessons 8–10",
      blurb: "Measure in inches, see that a foot is 12 inches, and measure with a torn tape.",
      steps: 3,
    },
    {
      id: "length-stories",
      icon: "silk",
      title: "Length stories",
      lessons: "Lessons 11–12",
      blurb: "Tie pieces of silk together, cut some off, and compare with number lines.",
      steps: 2,
    },
    {
      id: "line-plots",
      icon: "plot",
      title: "Line plots",
      lessons: "Lessons 14–16",
      blurb: "Read a line plot, make one from measurements, and see what the data says.",
      steps: 3,
    },
  ],
};
