/* Learn Measuring Circles (Grade 7 Unit 3): the unit's chapters and their icons. Loaded by learn.html and every chapter page
   in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  parts:
    '<circle cx="32" cy="32" r="24" fill="rgba(127,227,255,.15)" stroke="#7fe3ff" stroke-width="3"/><path d="M15,49 L49,15" stroke="#ffc93c" stroke-width="3.5"/><path d="M32,32 L56,32" stroke="#f3f6fb" stroke-width="3"/><circle cx="32" cy="32" r="3.5" fill="#f3f6fb"/>',
  circum:
    '<circle cx="32" cy="32" r="22" fill="none" stroke="#ffc93c" stroke-width="5" stroke-dasharray="100 40"/><text x="32" y="38" fill="#f3f6fb" font-size="16" font-weight="800" text-anchor="middle" font-family="monospace">π</text>',
  wheels:
    '<circle cx="22" cy="34" r="14" fill="none" stroke="#7fe3ff" stroke-width="3"/><path d="M22,34 L22,20" stroke="#f3f6fb" stroke-width="2.5"/><path d="M4,50 H60" stroke="#ffc93c" stroke-width="3.5"/><path d="M40,50 v-6 M58,50 v-6" stroke="#ffc93c" stroke-width="3"/>',
  area: '<circle cx="32" cy="32" r="24" fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="3"/><circle cx="24" cy="26" r="4" fill="#ff8ac4"/><circle cx="40" cy="30" r="4" fill="#ff8ac4"/><circle cx="30" cy="42" r="4" fill="#ff8ac4"/>',
  which:
    '<circle cx="32" cy="32" r="22" fill="rgba(127,227,255,.25)" stroke="#ffc93c" stroke-width="5"/><text x="32" y="38" fill="#f3f6fb" font-size="16" font-weight="800" text-anchor="middle" font-family="monospace">?</text>',
};
const UNIT = {
  saveKey: "g7u3-learn",
  game: "Wheel Works",
  icons: ICON,
  chapters: [
    {
      id: "circles",
      icon: "parts",
      title: "Radius and diameter",
      game: { zone: "parts", name: "Circle Parts" },
      lessons: "Lesson 2",
      blurb:
        "Every point on a circle is the same distance from its center: the radius. The diameter goes across, two radii long.",
      steps: 1,
    },
    {
      id: "circumference",
      icon: "circum",
      title: "Circumference and π",
      game: { zone: "circum", name: "Around the Rim" },
      lessons: "Lessons 3–4",
      blurb: "Around any circle is a bit more than 3 diameters: π. Find C = πd, and go back to the diameter.",
      steps: 3,
    },
    {
      id: "wheels",
      icon: "wheels",
      title: "Circumference and wheels",
      game: { zone: "wheels", name: "Wheel Shop" },
      lessons: "Lesson 5",
      blurb: "Each turn of a wheel rolls it one circumference. How far, and how many turns?",
      steps: 2,
    },
    {
      id: "area",
      icon: "area",
      title: "The area of a circle",
      game: { zone: "area", name: "Pizza Area" },
      lessons: "Lessons 7–8",
      blurb: "Cut a circle into wedges and lay them out: a shape πr long and r tall, so A = πr².",
      steps: 3,
    },
    {
      id: "circumference-or-area",
      icon: "which",
      title: "Circumference or area?",
      game: { zone: "which", name: "Rim or Inside?" },
      lessons: "Lessons 9–10",
      blurb: "Half and quarter circles, and choosing between the distance around and the space inside.",
      steps: 2,
    },
  ],
};
