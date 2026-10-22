/* Learn Finding Volume (Grade 5 Unit 1): the unit's chapters and their icons. Loaded by learn.html and every chapter page in
   learn/, after shared/shapes.js (the icons' cubes, iconCube). Each chapter is learn/<id>.html with its widgets and steps in
   learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  volume: iconCube(10, 56, 16) + iconCube(26, 56, 16) + iconCube(10, 40, 16) + iconCube(42, 56, 16),
  layers:
    iconCube(8, 58, 14, "#7fe3ff") +
    iconCube(22, 58, 14, "#7fe3ff") +
    iconCube(36, 58, 14, "#7fe3ff") +
    iconCube(8, 44, 14) +
    iconCube(22, 44, 14) +
    iconCube(36, 44, 14),
  edges:
    iconCube(14, 50, 28) +
    '<g fill="#f3f6fb" font-size="9" font-weight="700" text-anchor="middle" font-family="monospace"><text x="28" y="61">4</text><text x="8" y="38">3</text><text x="56" y="50">2</text></g>',
  units:
    iconCube(8, 56, 12) +
    iconCube(28, 56, 30, "#7fe3ff") +
    '<text x="14" y="30" fill="#f3f6fb" font-size="9" font-weight="700" text-anchor="middle" font-family="monospace">1 cm</text>',
  combo: iconCube(8, 56, 16) + iconCube(8, 40, 16) + iconCube(24, 56, 16, "#7fe3ff") + iconCube(40, 56, 16, "#7fe3ff"),
  solve:
    iconCube(10, 58, 24) +
    '<text x="48" y="22" fill="#ffc93c" font-size="14" font-weight="700" text-anchor="middle" font-family="monospace">?</text>',
};
const UNIT = {
  saveKey: "g5u1-learn",
  game: "Cargo Port",
  icons: ICON,
  chapters: [
    {
      id: "volume",
      icon: "volume",
      title: "What is volume?",
      game: { zone: "count", name: "Cube Yard" },
      lessons: "Lessons 1–2",
      blurb: "Build figures from unit cubes, and count the cubes that fill a box, even the ones you can’t see.",
      steps: 2,
    },
    {
      id: "layers",
      icon: "layers",
      title: "Layers of cubes",
      game: { zone: "layers", name: "Loading Dock" },
      lessons: "Lessons 3–4",
      blurb: "Count a box’s cubes one layer at a time: bottom to top, front to back, or side to side.",
      steps: 2,
    },
    {
      id: "edges",
      icon: "edges",
      title: "Length × width × height",
      game: { zone: "edges", name: "Measuring Shed" },
      lessons: "Lessons 5–6",
      blurb: "Multiply a box’s edges to find its volume, or multiply the area of its base by its height.",
      steps: 2,
    },
    {
      id: "cubic-units",
      icon: "units",
      title: "Cubic units",
      game: { zone: "edges", name: "Measuring Shed" },
      lessons: "Lesson 7",
      blurb: "Measure volume in cubic centimeters, inches, feet, or meters, and pick the right size.",
      steps: 1,
    },
    {
      id: "two-prisms",
      icon: "combo",
      title: "Figures made of prisms",
      game: { zone: "combo", name: "Stacking Yard" },
      lessons: "Lessons 8–10",
      blurb: "Split a figure into two boxes, add their volumes, and write it as one expression.",
      steps: 2,
    },
    {
      id: "solve",
      icon: "solve",
      title: "Solve volume problems",
      game: { zone: "solve", name: "Harbor Office" },
      lessons: "Lesson 11",
      blurb: "Find a missing edge from the volume, and compare and combine boxes.",
      steps: 2,
    },
  ],
};
