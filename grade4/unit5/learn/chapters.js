/* Learn Multiplicative Comparison and Measurement (Grade 4 Unit 5): the unit's chapters and their icons. Loaded by learn.html and every chapter page in learn/.
   Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  tape: '<g stroke-width="1.5"><rect x="6" y="14" width="13" height="14" fill="rgba(255,201,60,.55)" stroke="#ffc93c"/><rect x="6" y="36" width="13" height="14" fill="rgba(127,227,255,.45)" stroke="#7fe3ff"/><rect x="19" y="36" width="13" height="14" fill="rgba(127,227,255,.45)" stroke="#7fe3ff"/><rect x="32" y="36" width="13" height="14" fill="rgba(127,227,255,.45)" stroke="#7fe3ff"/></g><text x="54" y="47" fill="#f3f6fb" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">×3</text>',
  more: '<g stroke-width="1.5"><rect x="6" y="12" width="20" height="14" fill="rgba(255,201,60,.55)" stroke="#ffc93c"/><rect x="6" y="38" width="20" height="14" fill="rgba(127,227,255,.45)" stroke="#7fe3ff"/><rect x="26" y="38" width="16" height="14" fill="rgba(255,138,196,.3)" stroke="#ff8ac4" stroke-dasharray="4 3"/></g><text x="52" y="24" fill="#f3f6fb" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">+3</text>',
  metric:
    '<rect x="4" y="24" width="56" height="16" rx="2" fill="#ffc93c" stroke="#0a2340" stroke-width="1.5"/><path d="M10,24V32M16,24V30M22,24V30M28,24V30M34,24V32M40,24V30M46,24V30M52,24V30M58,24V32" stroke="#0a2340" stroke-width="1.5"/><text x="32" y="56" fill="#7fe3ff" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">1 m=100 cm</text>',
  clock:
    '<circle cx="32" cy="32" r="24" fill="rgba(243,246,251,.12)" stroke="#f3f6fb" stroke-width="2.5"/><path d="M32,32V14M32,32L44,38" stroke="#ffc93c" stroke-width="3" stroke-linecap="round"/><path d="M32,8A24,24 0 0,1 56,32L32,32Z" fill="rgba(127,227,255,.35)"/>',
  fence:
    '<rect x="10" y="14" width="44" height="32" fill="rgba(95,224,168,.2)" stroke="#5fe0a8" stroke-width="3"/><text x="32" y="10" fill="#f3f6fb" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">8 m</text><text x="32" y="58" fill="#ffc93c" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">P = ?</text>',
};
const UNIT = {
  saveKey: "g4u5-learn",
  game: "Zoo Crew",
  icons: ICON,
  chapters: [
    {
      id: "times-as-many",
      icon: "tape",
      title: "Times as many",
      game: { zone: "times", name: "Feeding Line" },
      lessons: "Lessons 1–3",
      blurb: "Draw “3 times as many” as a tape diagram, and find the number that’s missing.",
      steps: 2,
    },
    {
      id: "comparisons",
      icon: "more",
      title: "More than or times as many",
      game: { zone: "bigger", name: "Big Animals" },
      lessons: "Lessons 4–6",
      blurb: "Tell “3 more” from “3 times as many,” and compare big amounts.",
      steps: 2,
    },
    {
      id: "metric",
      icon: "metric",
      title: "Metric units",
      game: { zone: "metric", name: "Food Prep" },
      lessons: "Lessons 7–10",
      blurb: "Change kilometers, meters, kilograms, and liters into smaller units.",
      steps: 2,
    },
    {
      id: "pounds-time",
      icon: "clock",
      title: "Pounds, ounces, and time",
      game: { zone: "customary", name: "Clock & Scale" },
      lessons: "Lessons 11–13",
      blurb: "Change pounds to ounces, and hours and minutes to smaller units, even parts of an hour.",
      steps: 2,
    },
    {
      id: "perimeter",
      icon: "fence",
      title: "Perimeter",
      game: { zone: "perimeter", name: "Fence Builder" },
      lessons: "Lessons 14–17",
      blurb: "Find the distance around a rectangle, and a missing side from the perimeter.",
      steps: 2,
    },
  ],
};
