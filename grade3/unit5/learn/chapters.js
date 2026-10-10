/* Learn Fractions as Numbers (Grade 3 Unit 5): the unit's chapters and their icons. Loaded by learn.html and every chapter
   page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the
   format. */
/* an icon's line of text, centered at x, y: `size` pixels, in `fill` */
const iconText = (x, y, text, size, fill) =>
  `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="700" text-anchor="middle" font-family="monospace">${text}</text>`;
/* a strip for an icon from x, y, cut into `parts` with the first `shaded` filled */
const iconStrip = (x, y, w, parts, shaded, fill = "#ffc93c") =>
  Array.from({ length: parts }, (_, i) => {
    const partW = w / parts;
    return `<rect x="${x + i * partW}" y="${y}" width="${partW}" height="12" fill="${i < shaded ? fill : "none"}" stroke="#f3f6fb" stroke-width="1.5"/>`;
  }).join("");
/* a number line for an icon at height y, with `parts` jumps of which `hops` are drawn */
const iconLine = (y, parts, hops) =>
  `<path d="M4,${y}H60" stroke="#f3f6fb" stroke-width="2"/>` +
  Array.from(
    { length: parts + 1 },
    (_, j) => `<path d="M${8 + (j * 48) / parts},${y - 5}V${y + 5}" stroke="#f3f6fb" stroke-width="2"/>`,
  ).join("") +
  Array.from({ length: hops }, (_, j) => {
    const xa = 8 + (j * 48) / parts,
      xb = 8 + ((j + 1) * 48) / parts;
    return `<path d="M${xa},${y - 3}Q${(xa + xb) / 2},${y - 16} ${xb},${y - 3}" fill="none" stroke="#ffc93c" stroke-width="2"/>`;
  }).join("");
const ICON = {
  parts:
    '<circle cx="32" cy="28" r="20" fill="none" stroke="#f3f6fb" stroke-width="2"/><path d="M32,28V8M32,28H52M32,28V48M32,28H12" stroke="#f3f6fb" stroke-width="2"/>' +
    '<path d="M32,28V8A20,20 0 0 1 52,28Z" fill="#ffc93c"/>' +
    iconText(32, 62, "1/4", 11, "#7fe3ff"),
  build: iconStrip(6, 18, 52, 4, 3) + iconText(32, 52, "3 × 1/4", 11, "#7fe3ff"),
  line: iconLine(36, 4, 3) + iconText(44, 58, "3/4", 11, "#7fe3ff"),
  wholes: iconLine(36, 6, 6) + iconText(32, 58, "6/3 = 2", 11, "#7fe3ff"),
  equivalent:
    iconStrip(6, 12, 52, 2, 1) + iconStrip(6, 32, 52, 4, 2, "#7fe3ff") + iconText(32, 60, "1/2 = 2/4", 10, "#f3f6fb"),
  equivalentLine:
    iconLine(20, 2, 1) +
    iconLine(46, 4, 2) +
    '<path d="M32,12V54" stroke="#7fe3ff" stroke-width="1.5" stroke-dasharray="3 3"/>',
  same:
    iconStrip(6, 12, 52, 8, 3) + iconStrip(6, 32, 52, 8, 5, "#7fe3ff") + iconText(32, 60, "3/8 < 5/8", 10, "#f3f6fb"),
  compare: iconText(32, 38, "? &gt; ?", 18, "#ffc93c") + iconText(32, 56, "&lt; =", 12, "#7fe3ff"),
};
const UNIT = {
  saveKey: "g3u5-learn",
  game: "Fraction Farm",
  icons: ICON,
  chapters: [
    {
      id: "name-parts",
      icon: "parts",
      title: "Name the parts",
      game: { zone: "parts", name: "Pie Stand" },
      lessons: "Lessons 1–2",
      blurb:
        "Cut shapes into equal parts, name halves, thirds, fourths, sixths, and eighths, and write unit fractions.",
      steps: 2,
    },
    {
      id: "build-fractions",
      icon: "build",
      title: "Build fractions",
      game: { zone: "build", name: "Garden Rows" },
      lessons: "Lessons 3–4",
      blurb: "Shade parts to make fractions like 3/4, and build them from unit fractions.",
      steps: 2,
    },
    {
      id: "number-line",
      icon: "line",
      title: "Fractions on the number line",
      game: { zone: "line", name: "Fence Line" },
      lessons: "Lessons 5–7",
      blurb: "Turn a fraction strip into a number line, and find fractions by jumping from 0.",
      steps: 2,
    },
    {
      id: "whole-numbers",
      icon: "wholes",
      title: "Fractions and whole numbers",
      game: { zone: "wholes", name: "Big Barn" },
      lessons: "Lessons 8–9",
      blurb: "Find fractions equal to whole numbers, and fractions more than 1.",
      steps: 2,
    },
    {
      id: "equivalent",
      icon: "equivalent",
      title: "Equivalent fractions",
      game: { zone: "equivalent", name: "Garden Plots" },
      lessons: "Lessons 10–11",
      blurb: "Find fractions that are the same size with strips, and cut parts again to make new ones.",
      steps: 2,
    },
    {
      id: "equivalent-line",
      icon: "equivalentLine",
      title: "Equivalent fractions on the number line",
      game: { zone: "equivalent", name: "Garden Plots" },
      lessons: "Lessons 12–13",
      blurb: "See equivalent fractions at the same point on two number lines, and write whole numbers as fractions.",
      steps: 2,
    },
    {
      id: "compare-same",
      icon: "same",
      title: "Same denominator or numerator",
      game: { zone: "compare", name: "Harvest Contest" },
      lessons: "Lessons 14–16",
      blurb:
        "Compare fractions with the same denominator by their parts, and with the same numerator by the size of the parts.",
      steps: 2,
    },
    {
      id: "compare",
      icon: "compare",
      title: "Compare fractions",
      game: { zone: "compare", name: "Harvest Contest" },
      lessons: "Lesson 17",
      blurb: "Pick a way to compare two fractions, and compare them on the number line.",
      steps: 2,
    },
  ],
};
