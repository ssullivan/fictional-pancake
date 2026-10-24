/* Learn Rigid Transformations and Congruence (Grade 8 Unit 1): the unit's chapters and their icons. Loaded by learn.html and
   every chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js
   has the format. */
const ICON = {
  moves:
    '<polygon points="8,50 26,50 8,36" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2.5" stroke-linejoin="round"/><polygon points="38,50 56,50 56,36" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5" stroke-linejoin="round"/><path d="M32,12 V56" stroke="#f3f6fb" stroke-width="2" stroke-dasharray="4 4"/>',
  grid: '<path d="M8,8 H56 M8,24 H56 M8,40 H56 M8,56 H56 M8,8 V56 M24,8 V56 M40,8 V56 M56,8 V56" stroke="rgba(170,205,255,.35)" stroke-width="1.5"/><polygon points="8,56 24,56 8,40" fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="2.5"/><polygon points="40,24 56,24 40,8" fill="rgba(127,227,255,.4)" stroke="#7fe3ff" stroke-width="2.5"/><path d="M16,46 L44,18" stroke="#f3f6fb" stroke-width="2.5"/>',
  coords:
    '<path d="M32,6 V58 M6,32 H58" stroke="#f3f6fb" stroke-width="2.5"/><circle cx="44" cy="20" r="5" fill="#ffc93c"/><circle cx="20" cy="44" r="5" fill="#7fe3ff"/><path d="M40,24 L25,39" stroke="#f3f6fb" stroke-width="2" stroke-dasharray="3 3"/>',
  describe:
    '<polygon points="8,40 24,40 8,24" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2.5"/><polygon points="40,56 56,56 56,40" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/><text x="44" y="24" fill="#f3f6fb" font-size="18" font-weight="800" text-anchor="middle" font-family="monospace">?</text>',
  keep: '<polygon points="6,50 30,50 6,22" fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="2.5"/><polygon points="58,14 34,14 58,42" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/><text x="18" y="60" fill="#f3f6fb" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">5</text><text x="46" y="10" fill="#f3f6fb" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">5</text>',
  congruent:
    '<polygon points="6,44 26,44 26,24 14,18" fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="2.5"/><polygon points="38,44 58,44 58,24 46,18" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/><text x="32" y="58" fill="#5fe0a8" font-size="16" font-weight="800" text-anchor="middle" font-family="monospace">≅</text>',
  parallel:
    '<path d="M4,22 H60 M4,44 H60" stroke="#f3f6fb" stroke-width="3"/><path d="M18,60 L46,6" stroke="#7fe3ff" stroke-width="3"/><path d="M44,22 A8,8 0 0 0 41,15" fill="none" stroke="#ffc93c" stroke-width="2.5"/><path d="M33,44 A8,8 0 0 0 30,37" fill="none" stroke="#ffc93c" stroke-width="2.5"/>',
  triangle:
    '<polygon points="6,54 58,54 22,12" fill="rgba(255,201,60,.3)" stroke="#ffc93c" stroke-width="3" stroke-linejoin="round"/><text x="32" y="44" fill="#f3f6fb" font-size="13" font-weight="800" text-anchor="middle" font-family="monospace">180</text>',
};
const UNIT = {
  saveKey: "g8u1-learn",
  game: "Sprite Studio",
  icons: ICON,
  chapters: [
    {
      id: "moves",
      icon: "moves",
      title: "Slides, turns, and flips",
      game: { zone: "moves", name: "Name the Move" },
      lessons: "Lessons 1–2",
      blurb: "Translations slide, rotations turn, and reflections flip. Name each move and what it needs.",
      steps: 2,
    },
    {
      id: "grid-moves",
      icon: "grid",
      title: "Moves on a grid",
      game: { zone: "grid", name: "Grid Moves" },
      lessons: "Lessons 3–4",
      blurb: "Count squares to translate, turn a segment around a center to rotate, and measure to a line to reflect.",
      steps: 3,
    },
    {
      id: "coordinates",
      icon: "coords",
      title: "Coordinate moves",
      game: { zone: "coords", name: "Coordinate Moves" },
      lessons: "Lesson 5",
      blurb: "Each move changes the coordinates in its own way. Write the rule, like (x, y) → (x, −y).",
      steps: 3,
    },
    {
      id: "describing",
      icon: "describe",
      title: "Describing moves",
      game: { zone: "describe", name: "Describe It" },
      lessons: "Lesson 6",
      blurb: "Look at a shape and its image and say which move, or which moves in order, take one to the other.",
      steps: 2,
    },
    {
      id: "properties",
      icon: "keep",
      title: "What rigid moves keep",
      game: { zone: "keep", name: "No Stretching" },
      lessons: "Lessons 7–10",
      blurb:
        "Lengths, angles, and area stay the same. Lines go to parallel lines, and copies fit together into new shapes.",
      steps: 3,
    },
    {
      id: "congruence",
      icon: "congruent",
      title: "Congruence",
      game: { zone: "congruent", name: "Congruence Check" },
      lessons: "Lessons 11–13",
      blurb:
        "Congruent shapes fit exactly onto each other by rigid moves. Match their parts, and see when sides aren’t enough.",
      steps: 3,
    },
    {
      id: "parallel-angles",
      icon: "parallel",
      title: "Angles and parallel lines",
      game: { zone: "parallel", name: "Parallel Lines" },
      lessons: "Lesson 14",
      blurb:
        "A line crossing two parallel lines makes just two sizes of angle. Find vertical, corresponding, and alternate interior angles.",
      steps: 2,
    },
    {
      id: "triangle-angles",
      icon: "triangle",
      title: "Angles in a triangle",
      game: { zone: "triangle", name: "Triangle Angles" },
      lessons: "Lessons 15–16",
      blurb: "Every triangle’s angles add up to 180°. A line through one corner, parallel to the far side, shows why.",
      steps: 2,
    },
  ],
};
