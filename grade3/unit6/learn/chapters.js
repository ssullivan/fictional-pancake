/* Learn Measuring Length, Time, Liquid Volume, and Weight (Grade 3 Unit 6): the unit's chapters and their icons. Loaded by
   learn.html and every chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js;
   shared/learn.js has the format. */
/* an icon's line of text, centered at x, y: `size` pixels, in `fill` */
const iconText = (x, y, text, size, fill) =>
  `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="700" text-anchor="middle" font-family="monospace">${text}</text>`;
const ICON = {
  ruler:
    '<rect x="4" y="30" width="56" height="20" rx="2" fill="#f0d9a8" stroke="#c9a86a"/><path d="M8,30V42M22,30V36M36,30V42M50,30V36M15,30V33M29,30V33M43,30V33" stroke="#0a2340" stroke-width="1.5"/>' +
    '<rect x="8" y="14" width="35" height="10" rx="4" fill="#ffc93c"/>',
  plot:
    '<path d="M4,48H60" stroke="#f3f6fb" stroke-width="2"/>' +
    iconText(16, 44, "X", 11, "#ffc93c") +
    iconText(32, 44, "X", 11, "#ffc93c") +
    iconText(32, 33, "X", 11, "#ffc93c") +
    iconText(48, 44, "X", 11, "#ffc93c") +
    iconText(32, 60, "1 1/2", 9, "#7fe3ff"),
  weight:
    '<path d="M10,40A22,22 0 0 1 54,40Z" fill="#f3f6fb" stroke="#ffc93c" stroke-width="3"/><path d="M32,40L44,24" stroke="#e0445e" stroke-width="3"/><circle cx="32" cy="40" r="3" fill="#0a2340"/>' +
    iconText(32, 56, "1 kg", 10, "#7fe3ff"),
  volume:
    '<path d="M18,10V54H46V10" fill="none" stroke="#f3f6fb" stroke-width="3"/><rect x="19" y="30" width="26" height="23" fill="#7fe3ff" opacity=".7"/>' +
    '<path d="M18,20H26M18,30H26M18,40H26" stroke="#f3f6fb" stroke-width="2"/>',
  clock:
    '<circle cx="32" cy="32" r="24" fill="#f3f6fb" stroke="#ffc93c" stroke-width="3"/><path d="M32,32V16M32,32L42,38" stroke="#0a2340" stroke-width="3" stroke-linecap="round"/>',
  elapsed:
    '<path d="M4,44H60" stroke="#f3f6fb" stroke-width="2"/><path d="M10,40Q22,16 36,40M36,40Q44,26 52,40" fill="none" stroke="#ffc93c" stroke-width="2.5"/>' +
    iconText(22, 58, "8:40", 8, "#f3f6fb") +
    iconText(52, 58, "9:15", 8, "#7fe3ff"),
  stories:
    '<rect x="6" y="20" width="16" height="16" fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="2"/><rect x="22" y="20" width="16" height="16" fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="2"/><rect x="38" y="20" width="20" height="16" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2"/>' +
    iconText(32, 54, "2 steps", 10, "#f3f6fb"),
};
const UNIT = {
  saveKey: "g3u6-learn",
  game: "Science Fair",
  icons: ICON,
  chapters: [
    {
      id: "halves-fourths",
      icon: "ruler",
      title: "Halves and fourths of an inch",
      game: { zone: "ruler", name: "Measuring Lab" },
      lessons: "Lessons 1–3",
      blurb: "Read a ruler to the nearest half inch and the nearest fourth of an inch.",
      steps: 2,
    },
    {
      id: "line-plots",
      icon: "plot",
      title: "Line plots",
      game: { zone: "plots", name: "Data Corner" },
      lessons: "Lessons 4–5",
      blurb: "Read and make line plots of lengths in halves and fourths of an inch.",
      steps: 2,
    },
    {
      id: "weight",
      icon: "weight",
      title: "Grams and kilograms",
      game: { zone: "weight", name: "Weigh Station" },
      lessons: "Lesson 6",
      blurb: "Read a scale in grams, see 1,000 grams make a kilogram, and pick the unit for a weight.",
      steps: 2,
    },
    {
      id: "liquid-volume",
      icon: "volume",
      title: "Liters",
      game: { zone: "volume", name: "Water Works" },
      lessons: "Lessons 7–8",
      blurb: "Read the water in a container marked in liters, and estimate how much things hold.",
      steps: 2,
    },
    {
      id: "time",
      icon: "clock",
      title: "Time to the minute",
      game: { zone: "time", name: "Clock Tower" },
      lessons: "Lesson 9",
      blurb: "Set and read clocks to the minute, counting by 5s and then by 1s.",
      steps: 2,
    },
    {
      id: "elapsed",
      icon: "elapsed",
      title: "Elapsed time",
      game: { zone: "time", name: "Clock Tower" },
      lessons: "Lessons 10–11",
      blurb: "Find how long things last and when they end, jumping on a number line of times.",
      steps: 2,
    },
    {
      id: "measurement-stories",
      icon: "stories",
      title: "Measurement stories",
      game: { zone: "stories", name: "Problem Lab" },
      lessons: "Lessons 12–15",
      blurb: "Solve two-step stories in liters, grams, and minutes, and find what a story is missing.",
      steps: 2,
    },
  ],
};
