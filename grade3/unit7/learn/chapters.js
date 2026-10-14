/* Learn Two-dimensional Shapes and Perimeter (Grade 3 Unit 7): the unit's chapters and their icons. Loaded by learn.html and
   every chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js
   has the format. */
/* an icon's line of text, centered at x, y: `size` pixels, in `fill` */
const iconText = (x, y, text, size, fill) =>
  `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="700" text-anchor="middle" font-family="monospace">${text}</text>`;
const ICON = {
  corners:
    '<polygon points="8,54 8,14 50,54" fill="rgba(255,201,60,.3)" stroke="#ffc93c" stroke-width="3"/><path d="M8,44H18V54" fill="none" stroke="#f3f6fb" stroke-width="2"/>' +
    '<rect x="34" y="8" width="22" height="22" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/>',
  quad:
    '<polygon points="10,14 40,8 56,44 18,54" fill="rgba(95,224,168,.3)" stroke="#5fe0a8" stroke-width="3"/>' +
    iconText(33, 36, "4", 16, "#f3f6fb"),
  rhombus:
    '<polygon points="14,12 44,12 52,40 22,40" fill="rgba(255,138,196,.35)" stroke="#ff8ac4" stroke-width="2.5"/>' +
    '<rect x="20" y="44" width="28" height="16" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/>',
  walk:
    '<path d="M8,12V52M18,12V52M28,12V52M38,12V52M48,12V52M58,12V52M8,12H58M8,22H58M8,32H58M8,42H58M8,52H58" stroke="rgba(170,205,255,.3)" stroke-width="1"/>' +
    '<rect x="18" y="22" width="30" height="20" fill="rgba(255,201,60,.3)" stroke="#ffc93c" stroke-width="3"/><path d="M18,22H38" stroke="#7fe3ff" stroke-width="4"/>',
  fence:
    '<polygon points="12,50 12,22 32,10 52,22 52,50" fill="rgba(255,201,60,.25)" stroke="#ffc93c" stroke-width="2.5"/>' +
    iconText(32, 40, "P", 16, "#7fe3ff"),
  compare:
    '<rect x="4" y="26" width="28" height="12" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/><rect x="38" y="18" width="20" height="20" fill="rgba(255,201,60,.3)" stroke="#ffc93c" stroke-width="2.5"/>' +
    iconText(32, 56, "P = 16", 10, "#f3f6fb"),
  robot:
    '<rect x="20" y="8" width="24" height="16" rx="2" fill="#7fe3ff"/><rect x="16" y="26" width="32" height="22" rx="2" fill="#ffc93c"/>' +
    '<rect x="8" y="28" width="6" height="16" fill="#f3f6fb"/><rect x="50" y="28" width="6" height="16" fill="#f3f6fb"/>' +
    '<rect x="20" y="50" width="8" height="10" fill="#f3f6fb"/><rect x="36" y="50" width="8" height="10" fill="#f3f6fb"/>',
};
const UNIT = {
  saveKey: "g3u7-learn",
  game: "Playground Planners",
  icons: ICON,
  chapters: [
    {
      id: "attributes",
      icon: "corners",
      title: "Sides and right angles",
      game: { zone: "shapes", name: "Shape Sorter" },
      lessons: "Lessons 1–2",
      blurb: "Sort shapes by their sides and corners, and find the right angles: the square corners.",
      steps: 2,
    },
    {
      id: "quadrilaterals",
      icon: "quad",
      title: "What makes a quadrilateral",
      game: { zone: "shapes", name: "Shape Sorter" },
      lessons: "Lesson 3",
      blurb: "A quadrilateral is a closed shape with 4 straight sides. Build shapes and find the quadrilaterals.",
      steps: 2,
    },
    {
      id: "rhombus-rectangle-square",
      icon: "rhombus",
      title: "Rhombuses, rectangles, and squares",
      game: { zone: "quads", name: "Kite Corner" },
      lessons: "Lessons 4–5",
      blurb:
        "Equal sides make a rhombus, right angles make a rectangle, and a square is both. Then meet other quadrilaterals.",
      steps: 3,
    },
    {
      id: "perimeter",
      icon: "walk",
      title: "Distance around",
      game: { zone: "grid", name: "Chalk Trail" },
      lessons: "Lessons 6–7",
      blurb: "Walk around a shape on a grid to find its perimeter, then build shapes with the same perimeter.",
      steps: 2,
    },
    {
      id: "find-perimeter",
      icon: "fence",
      title: "Find the perimeter",
      game: { zone: "fence", name: "Fence Line" },
      lessons: "Lessons 8–9",
      blurb: "Add the side lengths, use what you know about rectangles and squares, and find a missing side.",
      steps: 3,
    },
    {
      id: "area-and-perimeter",
      icon: "compare",
      title: "Area and perimeter",
      game: { zone: "sandbox", name: "Sandbox Plans" },
      lessons: "Lessons 10–12",
      blurb:
        "Pick area or perimeter for a job, and see rectangles with the same perimeter or the same area change shape.",
      steps: 3,
    },
    {
      id: "design",
      icon: "robot",
      title: "Design with perimeter and area",
      game: { zone: "design", name: "Design Studio" },
      lessons: "Lessons 13–15",
      blurb: "Find the perimeter of a figure made of rectangles, and build a robot to fit an area and a perimeter.",
      steps: 2,
    },
  ],
};
