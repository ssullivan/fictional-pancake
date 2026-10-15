/* Learn Putting It All Together (Grade 3 Unit 8): the unit's chapters and their icons. Loaded by learn.html and every chapter
   page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
/* an icon's line of text, centered at x, y: `size` pixels, in `fill` */
const iconText = (x, y, text, size, fill) =>
  `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="700" text-anchor="middle" font-family="monospace">${text}</text>`;
const ICON = {
  estimate:
    '<rect x="6" y="22" width="52" height="18" fill="rgba(170,205,255,.15)" stroke="#f3f6fb" stroke-width="2"/><rect x="6" y="22" width="34" height="18" fill="#ffc93c"/>' +
    '<path d="M19,18V44M32,18V44M45,18V44" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="4 3"/>',
  line:
    '<path d="M4,40H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M8,32V48M32,32V48M56,32V48M20,36V44M44,36V44" stroke="#f3f6fb" stroke-width="2"/>' +
    '<circle cx="44" cy="40" r="5" fill="#ffc93c"/>' +
    iconText(32, 18, "3/2 > 3/4", 10, "#7fe3ff"),
  house:
    '<path d="M8,30L32,10L56,30" fill="none" stroke="#ffc93c" stroke-width="3"/><rect x="12" y="30" width="40" height="26" fill="rgba(255,201,60,.25)" stroke="#ffc93c" stroke-width="2.5"/>' +
    '<path d="M32,30V56" stroke="#f3f6fb" stroke-width="2"/>' +
    iconText(48, 22, "$", 12, "#5fe0a8"),
  survey:
    '<path d="M8,8V56H58" fill="none" stroke="#f3f6fb" stroke-width="2"/><rect x="14" y="30" width="9" height="26" fill="#ff7b7b"/><rect x="27" y="16" width="9" height="40" fill="#6fa8ff"/>' +
    '<rect x="40" y="38" width="9" height="18" fill="#5fe0a8"/>',
  muldiv:
    '<g fill="#ffc93c"><circle cx="12" cy="14" r="4"/><circle cx="24" cy="14" r="4"/><circle cx="36" cy="14" r="4"/><circle cx="12" cy="26" r="4"/><circle cx="24" cy="26" r="4"/><circle cx="36" cy="26" r="4"/></g>' +
    iconText(32, 48, "6 ÷ 2 = 3", 11, "#7fe3ff"),
};
const UNIT = {
  saveKey: "g3u8-learn",
  game: "Field Day",
  icons: ICON,
  chapters: [
    {
      id: "estimate",
      icon: "estimate",
      title: "Estimate fractions",
      game: { zone: "estimate", name: "Guessing Booth" },
      lessons: "Lesson 1",
      blurb: "Guess how much of a strip is shaded, or where a point is, then cut it into equal parts to check.",
      steps: 2,
    },
    {
      id: "number-line",
      icon: "line",
      title: "Fractions on the number line",
      game: { zone: "relay", name: "Fraction Relay" },
      lessons: "Lessons 2–3",
      blurb: "Put fractions greater than 1 on the number line, and compare fractions with >, =, and <.",
      steps: 2,
    },
    {
      id: "tiny-house",
      icon: "house",
      title: "Tiny houses",
      game: { zone: "house", name: "Tiny House Lot" },
      lessons: "Lessons 4–5",
      blurb: "Split a tiny house into rooms, find their area and perimeter, and shop for it on a budget.",
      steps: 2,
    },
    {
      id: "survey",
      icon: "survey",
      title: "Survey and graph",
      game: { zone: "survey", name: "Survey Tent" },
      lessons: "Lessons 6–7",
      blurb: "Choose a scale for a bar graph of a survey, then ask and answer questions about it.",
      steps: 2,
    },
    {
      id: "multiply-divide",
      icon: "muldiv",
      title: "Multiplication and division",
      game: { zone: "gameday", name: "Game Day" },
      lessons: "Lessons 8–11",
      blurb: "See one multiplication in groups, arrays, rectangles, and tapes, and divide with a fact you know.",
      steps: 2,
    },
  ],
};
