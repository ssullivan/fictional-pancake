/* Learn Wrapping Up Addition and Subtraction within 1,000 (Grade 3 Unit 3): the unit's chapters and their icons. Loaded by
   learn.html and every chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js;
   shared/learn.js has the format. */
/* an icon's line of text, centered at x, y: `size` pixels, in `fill` */
const iconText = (x, y, text, size, fill) =>
  `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="700" text-anchor="middle" font-family="monospace">${text}</text>`;
/* an open number line for an icon: a line with two jumps, labelled */
const iconJumps = (first, second) =>
  '<path d="M2,52H62" stroke="#f3f6fb" stroke-width="2.5"/>' +
  '<path d="M6,50Q20,18 34,48" fill="none" stroke="#7fe3ff" stroke-width="2.5"/><path d="M34,50Q46,30 58,48" fill="none" stroke="#7fe3ff" stroke-width="2.5"/>' +
  iconText(20, 26, first, 11, "#ffc93c") +
  iconText(47, 34, second, 10, "#ffc93c");
const ICON = {
  represent:
    '<rect x="4" y="10" width="26" height="26" fill="#ffc93c" stroke="#0a2340"/><path d="M4,23h26M17,10v26" stroke="rgba(10,35,64,.4)"/>' +
    '<rect x="35" y="10" width="6" height="26" fill="#7fe3ff" stroke="#0a2340"/><rect x="44" y="10" width="6" height="26" fill="#7fe3ff" stroke="#0a2340"/>' +
    '<rect x="54" y="30" width="6" height="6" fill="#5fe0a8" stroke="#0a2340"/>' +
    iconText(32, 56, "100+20+1", 10, "#f3f6fb"),
  addway: iconJumps("+100", "+2"),
  addalg:
    '<g fill="#f3f6fb" font-size="13" font-weight="700" text-anchor="end" font-family="monospace"><text x="50" y="26">358</text><text x="50" y="40">+167</text></g>' +
    '<path d="M14,45H52" stroke="#f3f6fb" stroke-width="2"/>' +
    '<text x="50" y="58" fill="#ffc93c" font-size="13" font-weight="700" text-anchor="end" font-family="monospace">525</text>' +
    iconText(34, 13, "1 1", 9, "#7fe3ff"),
  subway: iconJumps("+2", "+100"),
  subalg:
    '<g fill="#f3f6fb" font-size="13" font-weight="700" text-anchor="end" font-family="monospace"><text x="50" y="26">462</text><text x="50" y="40">−237</text></g>' +
    '<path d="M14,45H52" stroke="#f3f6fb" stroke-width="2"/>' +
    '<text x="50" y="58" fill="#ffc93c" font-size="13" font-weight="700" text-anchor="end" font-family="monospace">225</text>' +
    '<path d="M37,28L47,16" stroke="#7fe3ff" stroke-width="2"/>' +
    iconText(48, 12, "12", 9, "#7fe3ff"),
  strategy:
    '<circle cx="26" cy="28" r="16" fill="none" stroke="#7fe3ff" stroke-width="3"/><path d="M38,40L54,56" stroke="#7fe3ff" stroke-width="4" stroke-linecap="round"/>' +
    iconText(26, 33, "?", 16, "#ffc93c"),
  round:
    '<path d="M4,44H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M8,36V52M32,38V50M56,36V52" stroke="#f3f6fb" stroke-width="2"/>' +
    '<circle cx="45" cy="44" r="5" fill="#ffc93c"/><path d="M47,34Q52,22 56,32" fill="none" stroke="#7fe3ff" stroke-width="2.5"/>' +
    iconText(32, 20, "≈ 300", 11, "#7fe3ff"),
  estimate:
    iconText(32, 26, "487+316", 11, "#f3f6fb") +
    iconText(32, 44, "≈ 500+300", 10, "#7fe3ff") +
    iconText(32, 59, "= 800", 11, "#ffc93c"),
  twostep:
    '<rect x="4" y="26" width="18" height="18" fill="rgba(255,201,60,.3)" stroke="#ffc93c" stroke-width="2"/><rect x="22" y="26" width="16" height="18" fill="rgba(127,227,255,.25)" stroke="#7fe3ff" stroke-width="2"/>' +
    '<rect x="38" y="26" width="22" height="18" fill="rgba(255,201,60,.3)" stroke="#ffc93c" stroke-width="2"/><path d="M4,20v-6H60v6" fill="none" stroke="#f3f6fb" stroke-width="2"/>' +
    iconText(49, 39, "?", 12, "#7fe3ff") +
    iconText(32, 60, "a − b − c", 10, "#f3f6fb"),
};
const UNIT = {
  saveKey: "g3u3-learn",
  game: "Treasure Cove",
  icons: ICON,
  chapters: [
    {
      id: "represent",
      icon: "represent",
      title: "Numbers in different ways",
      game: { zone: "place", name: "Counting House" },
      lessons: "Lesson 1",
      blurb:
        "Build numbers from hundreds, tens, and ones, write them in expanded form, and trade a hundred for 10 tens.",
      steps: 2,
    },
    {
      id: "add-your-way",
      icon: "addway",
      title: "Add your way",
      game: { zone: "add", name: "Cargo Dock" },
      lessons: "Lessons 2–3",
      blurb: "Jump on an open number line, and move a little from one number to the other to make a friendly number.",
      steps: 2,
    },
    {
      id: "add-algorithms",
      icon: "addalg",
      title: "Addition algorithms",
      game: { zone: "add", name: "Cargo Dock" },
      lessons: "Lessons 4–6",
      blurb: "Add by place in expanded form, then use the standard algorithm, one column at a time.",
      steps: 2,
    },
    {
      id: "subtract-your-way",
      icon: "subway",
      title: "Subtract your way",
      game: { zone: "subtract", name: "Supply Shop" },
      lessons: "Lesson 7",
      blurb: "Jump back to take away, or count up from the smaller number to find the difference.",
      steps: 2,
    },
    {
      id: "subtract-algorithms",
      icon: "subalg",
      title: "Subtraction algorithms",
      game: { zone: "subtract", name: "Supply Shop" },
      lessons: "Lessons 8–10",
      blurb: "Regroup a ten or a hundred so each place can take away, then use the standard algorithm.",
      steps: 2,
    },
    {
      id: "subtract-strategically",
      icon: "strategy",
      title: "Subtract strategically",
      game: { zone: "subtract", name: "Supply Shop" },
      lessons: "Lessons 11–12",
      blurb: "Find the mistake in someone’s work, check with addition, and pick the easiest way to subtract.",
      steps: 2,
    },
    {
      id: "round",
      icon: "round",
      title: "Round",
      game: { zone: "round", name: "Lighthouse Point" },
      lessons: "Lessons 13–15",
      blurb: "Find the nearest ten or hundred on a number line, and see which numbers round to the same one.",
      steps: 2,
    },
    {
      id: "estimate",
      icon: "estimate",
      title: "Estimate",
      game: { zone: "estimate", name: "Crow’s Nest" },
      lessons: "Lessons 16–17",
      blurb: "Round first to estimate a sum or difference, and use an estimate to check that an answer makes sense.",
      steps: 2,
    },
    {
      id: "two-step",
      icon: "twostep",
      title: "Two-step problems",
      game: { zone: "twostep", name: "Voyage Planner" },
      lessons: "Lessons 18–20",
      blurb: "Draw a tape diagram for a story with two steps, and write an equation with a letter for the unknown.",
      steps: 2,
    },
  ],
};
