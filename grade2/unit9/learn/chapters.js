/* Learn Putting It All Together (Grade 2 Unit 9): the unit's chapters and their icons. Loaded by learn.html and every chapter page in learn/.
   Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  flip: '<rect x="6" y="12" width="24" height="36" rx="4" fill="#ffc93c" stroke="#0a2340" stroke-width="1.5"/><rect x="34" y="16" width="24" height="36" rx="4" fill="#7fe3ff" stroke="#0a2340" stroke-width="1.5"/><text x="18" y="35" fill="#0a2340" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">8+7</text><text x="46" y="39" fill="#0a2340" font-size="13" font-weight="700" text-anchor="middle" font-family="monospace">15</text>',
  map: '<rect x="4" y="8" width="56" height="48" rx="5" fill="rgba(95,224,168,.2)" stroke="#5fe0a8" stroke-width="1.5"/><polyline points="12,18 36,18 36,46 52,46" fill="none" stroke="#ffc93c" stroke-width="4" stroke-linejoin="round"/><circle cx="12" cy="18" r="5" fill="#ff7b7b" stroke="#fff" stroke-width="1.5"/><circle cx="52" cy="46" r="5" fill="#ff7b7b" stroke="#fff" stroke-width="1.5"/>',
  blocks:
    '<rect x="6" y="14" width="26" height="26" fill="#ffc93c" stroke="#0a2340" stroke-width="1.5"/><path d="M11,14v26M16,14v26M21,14v26M27,14v26M6,19h26M6,24h26M6,30h26M6,35h26" stroke="rgba(10,35,64,.4)"/><rect x="36" y="14" width="5" height="26" fill="#7fe3ff" stroke="#0a2340"/><rect x="44" y="14" width="5" height="26" fill="#7fe3ff" stroke="#0a2340"/><rect x="53" y="35" width="5" height="5" fill="#5fe0a8" stroke="#0a2340"/><text x="32" y="56" fill="#f3f6fb" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">100+20+1</text>',
  jump: '<path d="M4,48H60" stroke="#f3f6fb" stroke-width="2.5"/><circle cx="10" cy="48" r="5" fill="#ffc93c"/><path d="M10,42Q26,14 42,42" fill="none" stroke="#7fe3ff" stroke-width="2.5"/><path d="M42,42Q48,32 54,42" fill="none" stroke="#7fe3ff" stroke-width="2.5"/><text x="26" y="20" fill="#7fe3ff" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">+400</text>',
  tape: '<rect x="4" y="14" width="56" height="14" rx="2" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="2"/><rect x="4" y="36" width="34" height="14" rx="2" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2"/><rect x="38" y="36" width="22" height="14" rx="2" fill="none" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="3 3"/><text x="49" y="47" fill="#ffc93c" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">?</text>',
};
const UNIT = {
  saveKey: "g2u9-learn",
  readAloud: true,
  icons: ICON,
  game: "Field Trip",
  chapters: [
    {
      id: "fluency",
      icon: "flip",
      title: "Sums and differences within 20",
      lessons: "Lessons 1–2",
      blurb: "Make a ten, use a double, and think addition to subtract.",
      steps: 3,
      game: { zone: "facts", name: "Bus Ride" },
    },
    {
      id: "map",
      icon: "map",
      title: "Measure on a map",
      lessons: "Lessons 3–4",
      blurb: "Add up the parts of a path, find the shorter way, and plot the lengths.",
      steps: 3,
      game: { zone: "map", name: "Trail Map" },
    },
    {
      id: "numbers",
      icon: "blocks",
      title: "Numbers to 1,000",
      lessons: "Lessons 5–6",
      blurb: "Build a number with hundreds, tens, and ones in different ways, and write it as an expression.",
      steps: 2,
      game: { zone: "numbers", name: "Number Museum" },
    },
    {
      id: "add-subtract",
      icon: "jump",
      title: "Add and subtract within 1,000",
      lessons: "Lessons 7–8",
      blurb: "Jump to a hundred, add and take away by place, and count on to subtract.",
      steps: 2,
      game: { zone: "addsub", name: "Ticket Booth" },
    },
    {
      id: "stories",
      icon: "tape",
      title: "Story problems",
      lessons: "Lessons 9–13",
      blurb: "Sort stories by kind, ask a question a story can answer, and solve with tape diagrams.",
      steps: 3,
      game: { zone: "stories", name: "Story Stage" },
    },
  ],
};
