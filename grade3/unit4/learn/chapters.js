/* Learn Relating Multiplication to Division (Grade 3 Unit 4): the unit's chapters and their icons. Loaded by learn.html and
   every chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js
   has the format. */
/* an icon's line of text, centered at x, y: `size` pixels, in `fill` */
const iconText = (x, y, text, size, fill) =>
  `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="700" text-anchor="middle" font-family="monospace">${text}</text>`;
/* a counter for an icon at x, y */
const iconDot = (x, y, fill = "#ffc93c") => `<circle cx="${x}" cy="${y}" r="3.2" fill="${fill}"/>`;
const ICON = {
  division:
    '<circle cx="14" cy="20" r="10" fill="none" stroke="#f3f6fb" stroke-width="2"/><circle cx="32" cy="20" r="10" fill="none" stroke="#f3f6fb" stroke-width="2"/><circle cx="50" cy="20" r="10" fill="none" stroke="#f3f6fb" stroke-width="2"/>' +
    [10, 18, 28, 36, 46, 54].map((x) => iconDot(x, 20)).join("") +
    iconText(32, 52, "6 ÷ 3", 13, "#7fe3ff"),
  expressions:
    iconText(32, 24, "12 ÷ 3", 14, "#f3f6fb") +
    '<path d="M14,32H50" stroke="#7fe3ff" stroke-width="2"/>' +
    iconText(20, 50, "3", 12, "#ffc93c") +
    iconText(44, 50, "of 3", 11, "#ffc93c") +
    iconText(32, 50, "|", 12, "#7fe3ff"),
  unknown:
    [0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => iconDot(10 + c * 9, 12 + r * 9)).join("")).join("") +
    '<rect x="44" y="6" width="14" height="24" rx="3" fill="none" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="3 2"/>' +
    iconText(32, 54, "3 × ? = 12", 10, "#f3f6fb"),
  patterns:
    '<rect x="8" y="8" width="48" height="48" fill="rgba(9,32,61,.6)" stroke="#f3f6fb" stroke-width="1.5"/>' +
    '<path d="M20,8V56M32,8V56M44,8V56M8,20H56M8,32H56M8,44H56" stroke="rgba(243,246,251,.4)"/>' +
    '<rect x="20" y="44" width="12" height="12" fill="#ffc93c"/><rect x="44" y="20" width="12" height="12" fill="#7fe3ff"/>' +
    '<path d="M8,8L56,56" stroke="#ff8ac4" stroke-width="1.5" stroke-dasharray="3 3"/>',
  breakApart:
    '<rect x="6" y="14" width="30" height="34" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2"/><rect x="36" y="14" width="22" height="34" fill="rgba(127,227,255,.4)" stroke="#7fe3ff" stroke-width="2"/>' +
    '<path d="M36,10V52" stroke="#ff8ac4" stroke-width="2.5" stroke-dasharray="4 3"/>' +
    iconText(21, 35, "6×5", 10, "#0a2340") +
    iconText(47, 35, "6×2", 9, "#0a2340"),
  tens:
    [0, 1, 2]
      .map((i) => `<rect x="${8 + i * 7}" y="8" width="5" height="30" fill="#7fe3ff" stroke="#0a2340"/>`)
      .join("") +
    [0, 1, 2]
      .map((i) => `<rect x="${36 + i * 7}" y="8" width="5" height="30" fill="#7fe3ff" stroke="#0a2340"/>`)
      .join("") +
    iconText(32, 56, "2 × 30", 12, "#ffc93c"),
  teen:
    '<rect x="8" y="10" width="34" height="30" fill="rgba(255,201,60,.3)" stroke="#ffc93c" stroke-width="2"/><rect x="42" y="10" width="14" height="30" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2"/>' +
    iconText(25, 30, "40", 11, "#f3f6fb") +
    iconText(49, 30, "12", 9, "#f3f6fb") +
    iconText(32, 56, "4 × 13", 12, "#ffc93c"),
  divideLarger:
    '<rect x="6" y="8" width="24" height="30" rx="5" fill="none" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="4 3"/><rect x="34" y="8" width="24" height="30" rx="5" fill="none" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="4 3"/>' +
    '<rect x="11" y="12" width="5" height="22" fill="#7fe3ff" stroke="#0a2340"/><rect x="39" y="12" width="5" height="22" fill="#7fe3ff" stroke="#0a2340"/>' +
    [0, 1, 2]
      .map(
        (i) =>
          `<rect x="20" y="${28 - i * 7}" width="5" height="5" fill="#5fe0a8"/><rect x="48" y="${28 - i * 7}" width="5" height="5" fill="#5fe0a8"/>`,
      )
      .join("") +
    iconText(32, 56, "26 ÷ 2", 12, "#ffc93c"),
  fourOps:
    iconText(20, 24, "×", 18, "#ffc93c") +
    iconText(44, 24, "÷", 18, "#7fe3ff") +
    iconText(20, 50, "+", 18, "#5fe0a8") +
    iconText(44, 50, "−", 18, "#ff8ac4"),
};
const UNIT = {
  saveKey: "g3u4-learn",
  game: "Toy Workshop",
  icons: ICON,
  chapters: [
    {
      id: "what-is-division",
      icon: "division",
      title: "What is division?",
      game: { zone: "groups", name: "Packing Line" },
      lessons: "Lessons 1–2",
      blurb:
        "Split a pile into equal groups: make groups of a size and count them, or share them out and count each group.",
      steps: 2,
    },
    {
      id: "division-expressions",
      icon: "expressions",
      title: "Division expressions",
      game: { zone: "groups", name: "Packing Line" },
      lessons: "Lessons 3–5",
      blurb: "Read 12 ÷ 3 as 3 equal groups or as groups of 3, and write a division expression for a story.",
      steps: 2,
    },
    {
      id: "unknown-factor",
      icon: "unknown",
      title: "Division and unknown factors",
      game: { zone: "unknown", name: "Missing Pieces" },
      lessons: "Lessons 6–7",
      blurb: "Find the missing factor in 4 × ? = 28, and see the family of facts an array shows.",
      steps: 2,
    },
    {
      id: "products-and-patterns",
      icon: "patterns",
      title: "Use products you know",
      game: { zone: "table", name: "Puzzle Wall" },
      lessons: "Lessons 8–9",
      blurb: "Divide by counting on with a fact you know, and find patterns in the multiplication table.",
      steps: 2,
    },
    {
      id: "break-apart",
      icon: "breakApart",
      title: "Break apart rectangles",
      game: { zone: "rectangles", name: "Block Room" },
      lessons: "Lessons 10–11",
      blurb: "Cut a rectangle into two parts to turn a hard fact into two easier ones, with a grid and without.",
      steps: 2,
    },
    {
      id: "multiples-of-ten",
      icon: "tens",
      title: "Multiply multiples of ten",
      game: { zone: "multiply", name: "Crate Stacker" },
      lessons: "Lessons 12–13",
      blurb: "See 4 × 30 as 4 groups of 3 tens, and solve stories with equal groups of 20, 30, or 60.",
      steps: 2,
    },
    {
      id: "larger-numbers",
      icon: "teen",
      title: "Multiply teen and larger numbers",
      game: { zone: "multiply", name: "Crate Stacker" },
      lessons: "Lessons 14–16",
      blurb: "Multiply the tens and the ones of a teen number, and use area diagrams for numbers larger than 20.",
      steps: 2,
    },
    {
      id: "divide-larger",
      icon: "divideLarger",
      title: "Divide larger numbers",
      game: { zone: "divide", name: "Shipping Dock" },
      lessons: "Lessons 18–20",
      blurb: "Share base-ten blocks, trading a ten for ones, and break a number into parts that are easy to divide.",
      steps: 2,
    },
    {
      id: "four-operations",
      icon: "fourOps",
      title: "Solve problems with the four operations",
      game: { zone: "divide", name: "Shipping Dock" },
      lessons: "Lessons 17 and 21",
      blurb: "Solve stories with two steps that multiply or divide, and match them to equations with a letter.",
      steps: 2,
    },
  ],
};
