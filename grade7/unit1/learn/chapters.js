/* Learn Scale Drawings (Grade 7 Unit 1): the unit's chapters and their icons. Loaded by learn.html and every chapter page in
   learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  copies:
    '<polygon points="8,46 20,46 20,34 8,34" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2.5"/><polygon points="28,56 56,56 56,28 28,28" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/><path d="M40,14 l5,6 9,-12" fill="none" stroke="#5fe0a8" stroke-width="3.5"/>',
  making:
    '<polygon points="6,50 22,50 22,38 6,38" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2.5"/><polygon points="28,56 58,56 58,32 28,32" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/><text x="40" y="22" fill="#ffc93c" font-size="14" font-weight="700" text-anchor="middle" font-family="monospace">×2</text>',
  size: '<rect x="2" y="40" width="12" height="12" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/><rect x="17" y="32" width="20" height="20" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2.5"/><rect x="40" y="30" width="22" height="22" fill="rgba(255,138,196,.3)" stroke="#ff8ac4" stroke-width="2.5"/>',
  area: '<rect x="14" y="14" width="36" height="36" fill="rgba(127,227,255,.25)" stroke="#7fe3ff" stroke-width="2.5"/><rect x="14" y="14" width="18" height="18" fill="rgba(255,201,60,.55)" stroke="#ffc93c" stroke-width="2"/><path d="M32,14 V50 M14,32 H50" stroke="#f3f6fb" stroke-width="1.5" stroke-dasharray="3 3"/>',
  map: '<rect x="6" y="8" width="52" height="40" rx="5" fill="rgba(95,224,168,.15)" stroke="#f3f6fb" stroke-width="2"/><path d="M14,40 L28,22 L48,30" fill="none" stroke="#ffc93c" stroke-width="3.5" stroke-linecap="round"/><circle cx="14" cy="40" r="3.5" fill="#f3f6fb"/><circle cx="48" cy="30" r="3.5" fill="#f3f6fb"/><rect x="8" y="52" width="16" height="5" fill="#f3f6fb"/><rect x="24" y="52" width="16" height="5" fill="none" stroke="#f3f6fb" stroke-width="1.5"/>',
  rescale:
    '<rect x="6" y="10" width="34" height="24" fill="rgba(127,227,255,.25)" stroke="#7fe3ff" stroke-width="2.5"/><rect x="34" y="38" width="22" height="16" fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="2.5"/><path d="M42,16 Q56,20 50,32" fill="none" stroke="#f3f6fb" stroke-width="2.5"/><path d="M45,30 l5,3 2,-6" fill="none" stroke="#f3f6fb" stroke-width="2.5"/>',
  ratio:
    '<text x="32" y="38" fill="#ffc93c" font-size="17" font-weight="800" text-anchor="middle" font-family="monospace">1:100</text><path d="M8,48 H56" stroke="#f3f6fb" stroke-width="2.5"/><path d="M8,44 V52 M56,44 V52" stroke="#f3f6fb" stroke-width="2.5"/>',
};
const UNIT = {
  saveKey: "g7u1-learn",
  game: "Model Makers",
  icons: ICON,
  chapters: [
    {
      id: "scaled-copies",
      icon: "copies",
      title: "Scaled copies",
      game: { zone: "copies", name: "Copy or Not?" },
      lessons: "Lessons 1–2",
      blurb:
        "A scaled copy multiplies every length by the same number. Match corresponding parts and find the scale factor.",
      steps: 3,
    },
    {
      id: "making-copies",
      icon: "making",
      title: "Making scaled copies",
      game: { zone: "missing", name: "Copy Shop" },
      lessons: "Lessons 3–4",
      blurb: "Multiply every side by the scale factor, keep every angle the same, and go back with the reciprocal.",
      steps: 3,
    },
    {
      id: "factor-size",
      icon: "size",
      title: "The size of the scale factor",
      game: { zone: "factor", name: "Scale Factor" },
      lessons: "Lesson 5",
      blurb: "A scale factor greater than 1 makes a bigger copy, less than 1 a smaller one. Scale a copy again.",
      steps: 2,
    },
    {
      id: "area",
      icon: "area",
      title: "Scaling and area",
      game: { zone: "area", name: "Area Scaler" },
      lessons: "Lesson 6",
      blurb: "Scale the sides by a factor and the area grows by the factor times itself.",
      steps: 2,
    },
    {
      id: "scale-drawings",
      icon: "map",
      title: "Scale drawings and maps",
      game: { zone: "map", name: "Map Room" },
      lessons: "Lessons 7–8",
      blurb:
        "Use a scale like 1 cm to 2 m to go from a drawing to the real thing and back, and find distances and speeds on maps.",
      steps: 3,
    },
    {
      id: "changing-scales",
      icon: "rescale",
      title: "Creating and changing scales",
      game: { zone: "rescale", name: "Blueprint Desk" },
      lessons: "Lessons 9–10",
      blurb: "Choose a scale that fits the paper, and redraw a drawing at a new scale.",
      steps: 2,
    },
    {
      id: "scales-without-units",
      icon: "ratio",
      title: "Scales without units",
      game: { zone: "ratio", name: "Scale Ratios" },
      lessons: "Lessons 11–12",
      blurb:
        "A scale like 1 to 50 works in any unit. Write a scale with units without them, and spot scales that are the same.",
      steps: 3,
    },
  ],
};
