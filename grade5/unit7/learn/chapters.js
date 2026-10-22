/* Learn Shapes on the Coordinate Plane (Grade 5 Unit 7): the unit's chapters and their icons. Loaded by learn.html and every
   chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the
   format. */
const ICON = {
  grid: '<path d="M10,54H58M10,54V6" stroke="#f3f6fb" stroke-width="2"/><path d="M10,30H34V54" fill="none" stroke="#7fe3ff" stroke-width="1.5" stroke-dasharray="3 3"/><circle cx="34" cy="30" r="5" fill="#ffc93c"/><text x="44" y="24" fill="#f3f6fb" font-size="9" font-weight="700" font-family="monospace">(4,4)</text>',
  quads:
    '<path d="M8,48L20,16H56L44,48Z" fill="rgba(255,201,60,.25)" stroke="#ffc93c" stroke-width="2.5"/><path d="M14,32L18,28M48,32L52,28" stroke="#7fe3ff" stroke-width="2"/>',
  family:
    '<rect x="4" y="6" width="56" height="52" rx="6" fill="none" stroke="#a9c4e4" stroke-width="1.5"/><rect x="10" y="16" width="44" height="36" rx="5" fill="none" stroke="#7fe3ff" stroke-width="1.5"/><rect x="16" y="26" width="32" height="20" rx="4" fill="none" stroke="#ffc93c" stroke-width="1.5"/><rect x="26" y="31" width="12" height="10" fill="#ffc93c"/>',
  triangles:
    '<path d="M6,56L26,14L36,34L44,22L58,56Z" fill="#3d5a80" stroke="#0a2340" stroke-width="1.5"/><path d="M20,28L26,14L32,26" fill="#f3f6fb"/>',
  patterns:
    '<g fill="#ffc93c"><circle cx="10" cy="52" r="4"/><circle cx="24" cy="40" r="4"/><circle cx="38" cy="28" r="4"/><circle cx="52" cy="16" r="4"/></g><path d="M10,52L52,16" stroke="#7fe3ff" stroke-width="1.5" stroke-dasharray="3 3"/>',
  rect: '<rect x="10" y="16" width="44" height="30" fill="rgba(95,224,168,.3)" stroke="#5fe0a8" stroke-width="2.5"/><path d="M10,24H54M10,32H54M10,40H54M18,16V46M26,16V46M34,16V46M42,16V46" stroke="#5fe0a8" stroke-width=".8"/>',
};
const UNIT = {
  saveKey: "g5u7-learn",
  game: "Map Makers",
  icons: ICON,
  chapters: [
    {
      id: "grid",
      icon: "grid",
      title: "The coordinate grid",
      game: { zone: "plot", name: "Base Camp" },
      lessons: "Lessons 1, 3",
      blurb: "Plot a point by going across, then up, and read a point’s coordinates.",
      steps: 2,
    },
    {
      id: "quadrilaterals",
      icon: "quads",
      title: "Sort quadrilaterals",
      game: { zone: "quads", name: "Shape Survey" },
      lessons: "Lessons 4, 6–7",
      blurb:
        "Check a quadrilateral’s parallel sides, right angles, and side lengths, and see how the names fit inside each other.",
      steps: 2,
    },
    {
      id: "triangles",
      icon: "triangles",
      title: "Sort triangles",
      game: { zone: "triangles", name: "Triangle Peaks" },
      lessons: "Lesson 8",
      blurb: "Name triangles by their sides and by their angles.",
      steps: 1,
    },
    {
      id: "patterns",
      icon: "patterns",
      title: "Two patterns at once",
      game: { zone: "patterns", name: "Trail Patterns" },
      lessons: "Lessons 9–10, 12",
      blurb: "Follow two rules side by side, compare their numbers, and graph them as ordered pairs.",
      steps: 2,
    },
    {
      id: "rectangles",
      icon: "rect",
      title: "Rectangles on the grid",
      game: { zone: "rect", name: "Land Plots" },
      lessons: "Lesson 13",
      blurb: "Find a rectangle’s perimeter and area from its corners.",
      steps: 1,
    },
  ],
};
