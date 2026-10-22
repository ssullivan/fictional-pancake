/* Learn Angles, Triangles, and Prisms (Grade 7 Unit 7): the unit's chapters and their icons. Loaded by learn.html and every
   chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has
   the format. */
const ICON = {
  angles:
    '<path d="M6,52 H58" stroke="#f3f6fb" stroke-width="3"/><path d="M32,52 L50,14" stroke="#7fe3ff" stroke-width="3"/><path d="M44,52 A12,12 0 0 0 37,41" fill="none" stroke="#ffc93c" stroke-width="2.5"/><path d="M24,52 A8,8 0 0 1 36,44" fill="none" stroke="#ff8ac4" stroke-width="2.5"/>',
  equations:
    '<path d="M6,48 H58" stroke="#f3f6fb" stroke-width="3"/><path d="M32,48 L18,14" stroke="#7fe3ff" stroke-width="3"/><text x="46" y="38" fill="#ffc93c" font-size="12" font-weight="800" text-anchor="middle" font-family="monospace">2x</text><text x="14" y="42" fill="#ffc93c" font-size="12" font-weight="800" text-anchor="middle" font-family="monospace">x</text>',
  triangles:
    '<polygon points="8,52 56,52 26,14" fill="rgba(255,201,60,.3)" stroke="#ffc93c" stroke-width="3" stroke-linejoin="round"/>',
  slices:
    '<path d="M14,20 L32,10 L50,20 V46 L32,56 L14,46 Z" fill="rgba(127,227,255,.15)" stroke="#f3f6fb" stroke-width="2"/><path d="M14,33 L32,23 L50,33 L32,43 Z" fill="rgba(255,201,60,.55)" stroke="#ffc93c" stroke-width="2.5"/>',
  volume:
    '<polygon points="8,52 50,52 8,24" fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="2.5" stroke-linejoin="round"/><path d="M8,24 L18,16 L60,44 L50,52 M60,44 V44" fill="none" stroke="#f3f6fb" stroke-width="2"/><path d="M18,16 V16" stroke="#f3f6fb"/>',
};
const UNIT = {
  saveKey: "g7u7-learn",
  game: "Skate Park Builders",
  icons: ICON,
  chapters: [
    {
      id: "angle-pairs",
      icon: "angles",
      title: "Angle pairs",
      game: { zone: "angles", name: "Ramp Angles" },
      lessons: "Lessons 1–3",
      blurb: "Complementary angles make 90°, supplementary make 180°, and vertical angles are equal.",
      steps: 2,
    },
    {
      id: "angle-equations",
      icon: "equations",
      title: "Equations for angles",
      game: { zone: "equations", name: "Angle Equations" },
      lessons: "Lessons 4–5",
      blurb: "Write an equation from what the angles add up to, and solve it.",
      steps: 1,
    },
    {
      id: "triangles",
      icon: "triangles",
      title: "Building triangles",
      game: { zone: "triangles", name: "Triangle Test" },
      lessons: "Lessons 8–10",
      blurb: "Two sides must reach past the third. Some measures make one triangle, some many, some none.",
      steps: 2,
    },
    {
      id: "slicing",
      icon: "slices",
      title: "Slicing solids",
      game: { zone: "slices", name: "Cross Sections" },
      lessons: "Lesson 11",
      blurb: "The shape of the cut face depends on the solid and the way you slice it.",
      steps: 1,
    },
    {
      id: "prisms",
      icon: "volume",
      title: "Volume and surface area",
      game: { zone: "volume", name: "Ramp Volume" },
      lessons: "Lessons 12–16",
      blurb: "Volume is the base’s area times the height; surface area adds up every face.",
      steps: 3,
    },
  ],
};
