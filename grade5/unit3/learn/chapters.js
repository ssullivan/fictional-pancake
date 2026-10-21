/* Learn Multiplying and Dividing Fractions (Grade 5 Unit 3): the unit's chapters and their icons. Loaded by learn.html and
   every chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js
   has the format. */
const ICON = {
  piece:
    '<rect x="10" y="10" width="44" height="44" fill="rgba(169,196,228,.1)" stroke="#f3f6fb" stroke-width="2"/><rect x="10" y="40" width="44" height="14" fill="rgba(127,227,255,.35)"/><rect x="10" y="40" width="22" height="14" fill="#ffc93c"/><path d="M32,10V54M10,40H54" stroke="#f3f6fb" stroke-width="1.5"/>',
  multiply:
    '<rect x="10" y="10" width="44" height="44" fill="rgba(169,196,228,.1)" stroke="#f3f6fb" stroke-width="2"/><rect x="10" y="21" width="44" height="33" fill="rgba(127,227,255,.35)"/><rect x="10" y="21" width="29" height="33" fill="#ffc93c"/><path d="M25,10V54M39,10V54M10,21H54M10,32H54M10,43H54" stroke="#0a2340" stroke-width="1"/>',
  divunit:
    '<rect x="6" y="14" width="52" height="14" fill="none" stroke="#f3f6fb" stroke-width="2"/><rect x="6" y="14" width="17" height="14" fill="#ffc93c" stroke="#f3f6fb" stroke-width="2"/><path d="M40,14V28" stroke="#f3f6fb" stroke-width="2"/><rect x="6" y="36" width="52" height="14" fill="none" stroke="#f3f6fb" stroke-width="2"/><rect x="6" y="36" width="8.5" height="14" fill="#7fe3ff" stroke="#f3f6fb" stroke-width="2"/>',
  divwhole:
    '<g stroke="#f3f6fb" stroke-width="2"><rect x="6" y="22" width="24" height="20" fill="#ffc93c"/><rect x="34" y="22" width="24" height="20" fill="#7fe3ff"/></g><path d="M14,22V42M22,22V42M42,22V42M50,22V42" stroke="#0a2340" stroke-width="1.5"/>',
  which:
    '<text x="32" y="30" fill="#ffc93c" font-size="18" font-weight="700" text-anchor="middle" font-family="monospace">×</text><text x="32" y="54" fill="#7fe3ff" font-size="18" font-weight="700" text-anchor="middle" font-family="monospace">÷</text><text x="14" y="42" fill="#f3f6fb" font-size="16" font-weight="700" text-anchor="middle" font-family="monospace">?</text><text x="50" y="42" fill="#f3f6fb" font-size="16" font-weight="700" text-anchor="middle" font-family="monospace">?</text>',
};
const UNIT = {
  saveKey: "g5u3-learn",
  game: "Community Garden",
  icons: ICON,
  chapters: [
    {
      id: "piece",
      icon: "piece",
      title: "A piece of a part",
      game: { zone: "piece", name: "Seed Trays" },
      lessons: "Lessons 1–4",
      blurb: "Take a unit fraction of a unit fraction on a square, and see why 1/a × 1/b = 1/(a × b).",
      steps: 2,
    },
    {
      id: "multiply",
      icon: "multiply",
      title: "Multiply any fractions",
      game: { zone: "multiply", name: "Flower Beds" },
      lessons: "Lessons 5–8",
      blurb: "Multiply the tops and multiply the bottoms, and use it in stories.",
      steps: 2,
    },
    {
      id: "divide-unit",
      icon: "divunit",
      title: "Share a unit fraction",
      game: { zone: "divunit", name: "Seed Packets" },
      lessons: "Lessons 11–12",
      blurb: "Divide a unit fraction by a whole number by cutting it into equal pieces.",
      steps: 1,
    },
    {
      id: "divide-whole",
      icon: "divwhole",
      title: "How many fit?",
      game: { zone: "divwhole", name: "Watering Cans" },
      lessons: "Lessons 13–14",
      blurb: "Divide a whole number by a unit fraction by counting how many fit.",
      steps: 1,
    },
    {
      id: "which",
      icon: "which",
      title: "Multiply or divide?",
      game: { zone: "which", name: "Garden Shed" },
      lessons: "Lessons 15–19",
      blurb: "Tell whether an answer will be bigger or smaller, and pick the operation a story needs.",
      steps: 2,
    },
  ],
};
