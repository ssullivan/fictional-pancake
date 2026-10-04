/* Learn Properties of Two-dimensional Shapes (Grade 4 Unit 8): the unit's chapters and their icons. Loaded by learn.html and every chapter page in learn/.
   Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  tri: '<polygon points="32,8 58,54 6,54" fill="rgba(127,227,255,.25)" stroke="#7fe3ff" stroke-width="2.5"/><path d="M16,28L22,32M42,32L48,28" stroke="#ffc93c" stroke-width="2.5"/>',
  quad: '<polygon points="18,14 58,14 46,50 6,50" fill="rgba(127,227,255,.25)" stroke="#7fe3ff" stroke-width="2.5"/><path d="M36,10V18M26,46V54" stroke="#ffc93c" stroke-width="2.5"/>',
  sym: '<polygon points="32,6 54,30 32,58 10,30" fill="rgba(127,227,255,.25)" stroke="#7fe3ff" stroke-width="2.5"/><path d="M32,2V62" stroke="#ff8ac4" stroke-width="2.5" stroke-dasharray="5 4"/>',
  len: '<polygon points="8,10 30,10 30,32 56,32 56,54 8,54" fill="rgba(127,227,255,.25)" stroke="#7fe3ff" stroke-width="2.5"/><text x="43" y="27" fill="#ffc93c" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">?</text>',
};
const UNIT = {
  saveKey: "g4u8-learn",
  game: "Shape Gallery",
  icons: ICON,
  chapters: [
    {
      id: "triangles",
      icon: "tri",
      title: "Triangles",
      game: { zone: "triangles", name: "Triangle Lab" },
      lessons: "Lessons 1–2",
      blurb: "Name triangles by their sides (equilateral, isosceles, scalene) and by their angles.",
      steps: 2,
    },
    {
      id: "quadrilaterals",
      icon: "quad",
      title: "Quadrilaterals",
      game: { zone: "quads", name: "Quad Corner" },
      lessons: "Lesson 3",
      blurb: "Look at parallel sides, right angles, and equal sides, and sort four-sided shapes.",
      steps: 2,
    },
    {
      id: "symmetry",
      icon: "sym",
      title: "Lines of symmetry",
      game: { zone: "symmetry", name: "Mirror Hall" },
      lessons: "Lessons 4–5",
      blurb: "Fold a shape on a line to see if the halves match, and count a shape’s lines of symmetry.",
      steps: 2,
    },
    {
      id: "lengths",
      icon: "len",
      title: "Find unknown lengths",
      game: { zone: "lengths", name: "Measure Up" },
      lessons: "Lessons 7–8",
      blurb: "Use equal sides and right angles to find a side from a perimeter, or a missing side of a shape.",
      steps: 2,
    },
  ],
};
