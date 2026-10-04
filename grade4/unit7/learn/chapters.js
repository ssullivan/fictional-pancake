/* Learn Angles and Angle Measurement (Grade 4 Unit 7): the unit's chapters and their icons. Loaded by learn.html and every chapter page in learn/.
   Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  ray: '<path d="M8,44L50,20" stroke="#f3f6fb" stroke-width="3"/><polygon points="58,15 46,18 51,26" fill="#f3f6fb"/><circle cx="8" cy="44" r="4" fill="#ffc93c"/><circle cx="32" cy="30" r="4" fill="#ffc93c"/>',
  lines:
    '<path d="M6,24H58M6,40H58" stroke="#f3f6fb" stroke-width="3"/><path d="M32,8V56" stroke="#7fe3ff" stroke-width="3"/>',
  turn: '<path d="M14,48H56" stroke="#ffc93c" stroke-width="3.5"/><path d="M14,48L42,14" stroke="#ffc93c" stroke-width="3.5"/><path d="M34,48A20,20 0 0,0 27,33" fill="none" stroke="#7fe3ff" stroke-width="2.5"/>',
  prot: '<path d="M6,50A26,26 0 0,1 58,50Z" fill="rgba(170,205,255,.2)" stroke="#f3f6fb" stroke-width="2"/><path d="M32,50H58M32,50L46,28" stroke="#ffc93c" stroke-width="3"/>',
  types:
    '<path d="M8,52H28L20,34M36,52H56V32" fill="none" stroke="#ffc93c" stroke-width="3"/><rect x="50" y="46" width="6" height="6" fill="none" stroke="#7fe3ff" stroke-width="2"/>',
  split:
    '<path d="M32,52H58M32,52L46,22M32,52L12,30" stroke="#ffc93c" stroke-width="3"/><text x="32" y="16" fill="#7fe3ff" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">?°</text>',
};
const UNIT = {
  saveKey: "g4u7-learn",
  game: "Angle Arcade",
  icons: ICON,
  chapters: [
    {
      id: "figures",
      icon: "ray",
      title: "Points, lines, rays, and segments",
      game: { zone: "figures", name: "Shape Spotter" },
      lessons: "Lessons 1–2",
      blurb: "Tell lines, rays, and segments apart, and name them with letters.",
      steps: 2,
    },
    {
      id: "parallel",
      icon: "lines",
      title: "Parallel and perpendicular",
      game: { zone: "lines", name: "Light Beams" },
      lessons: "Lessons 3–4",
      blurb: "Turn a line to make it parallel or perpendicular, and find both in letters.",
      steps: 2,
    },
    {
      id: "turns",
      icon: "turn",
      title: "Angles as turns",
      game: { zone: "turns", name: "Clock Tower" },
      lessons: "Lessons 5–7",
      blurb: "Open an angle and compare it to a right angle, and turn a clock’s minute hand.",
      steps: 2,
    },
    {
      id: "protractor",
      icon: "prot",
      title: "Measure with a protractor",
      game: { zone: "protractor", name: "Protractor Panel" },
      lessons: "Lessons 8–10",
      blurb: "Read an angle on the right scale of a protractor, and turn a ray to any degree.",
      steps: 2,
    },
    {
      id: "draw",
      icon: "types",
      title: "Draw and name angles",
      game: { zone: "kinds", name: "Angle Sorter" },
      lessons: "Lessons 11–12",
      blurb: "Draw an angle of a given size, and tell acute, right, obtuse, and straight apart.",
      steps: 2,
    },
    {
      id: "unknown",
      icon: "split",
      title: "Find unknown angles",
      game: { zone: "unknown", name: "Missing Angle" },
      lessons: "Lessons 13–15",
      blurb: "Angles that make a right angle, a straight angle, or a full turn add up to 90°, 180°, or 360°.",
      steps: 2,
    },
  ],
};
