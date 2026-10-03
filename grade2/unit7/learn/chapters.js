/* Learn Adding and Subtracting within 1,000 (Grade 2 Unit 7): the unit's chapters and their icons. Loaded by learn.html and every chapter page in learn/.
   Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  jump: '<path d="M2,50H62" stroke="#f3f6fb" stroke-width="3"/><path d="M6,48Q22,14 38,46" fill="none" stroke="#7fe3ff" stroke-width="3"/><path d="M38,48Q46,32 54,46" fill="none" stroke="#7fe3ff" stroke-width="3"/><text x="22" y="22" fill="#ffc93c" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">+100</text><text x="47" y="32" fill="#ffc93c" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">+10</text>',
  place:
    '<rect x="4" y="12" width="26" height="26" fill="#ffc93c" stroke="#0a2340"/><path d="M4,25h26M17,12v26" stroke="rgba(10,35,64,.4)"/><rect x="36" y="12" width="6" height="26" fill="#ffc93c" stroke="#0a2340"/><rect x="46" y="12" width="6" height="26" fill="#ffc93c" stroke="#0a2340"/><rect x="56" y="32" width="6" height="6" fill="#ffc93c" stroke="#0a2340"/><path d="M4,46H60" stroke="#f3f6fb" stroke-width="2.5"/><text x="32" y="60" fill="#f3f6fb" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">+ − by place</text>',
  newten:
    '<g fill="#ffc93c" stroke="#0a2340" stroke-width="1"><rect x="6" y="16" width="7" height="7"/><rect x="6" y="26" width="7" height="7"/><rect x="6" y="36" width="7" height="7"/><rect x="6" y="46" width="7" height="7"/><rect x="16" y="16" width="7" height="7"/><rect x="16" y="26" width="7" height="7"/><rect x="16" y="36" width="7" height="7"/><rect x="16" y="46" width="7" height="7"/></g><path d="M28,34h10m-4,-4l4,4l-4,4" stroke="#f3f6fb" stroke-width="2" fill="none"/><rect x="44" y="8" width="8" height="48" fill="#5fe0a8" stroke="#fff" stroke-width="2"/>',
  add3: '<rect x="4" y="8" width="22" height="22" fill="#ffc93c" stroke="#0a2340"/><rect x="4" y="34" width="22" height="22" fill="#7fe3ff" stroke="#0a2340"/><text x="34" y="37" fill="#f3f6fb" font-size="18" font-weight="700" text-anchor="middle" font-family="monospace">+</text><rect x="42" y="20" width="20" height="20" fill="#5fe0a8" stroke="#fff" stroke-width="2"/>',
  sub3: '<rect x="4" y="10" width="30" height="30" fill="#ffc93c" stroke="#0a2340"/><path d="M4,25h30M19,10v30" stroke="rgba(10,35,64,.4)"/><path d="M38,40h10m-4,-4l4,4l-4,4" stroke="#f3f6fb" stroke-width="2" fill="none"/><g fill="#5fe0a8" stroke="#0a2340" stroke-width="1"><rect x="52" y="10" width="4" height="30"/><rect x="58" y="10" width="4" height="30"/></g><path d="M2,56L36,6" stroke="#ff7b7b" stroke-width="3" stroke-linecap="round" opacity=".8"/>',
};
const UNIT = {
  saveKey: "g2u7-learn",
  readAloud: true,
  icons: ICON,
  /* the order of the chapters when the unit was one page (learn.html#c2s1), for progress saved then and old links */
  legacy: ["count-on-and-back", "by-place", "new-ten", "add", "subtract"],
  chapters: [
    {
      id: "count-on-and-back",
      icon: "jump",
      title: "Count on and count back",
      lessons: "Lessons 1–3",
      blurb: "Jump by hundreds, tens, and ones, see which digit changes, and count on to find a difference.",
      steps: 3,
    },
    {
      id: "by-place",
      icon: "place",
      title: "Add and subtract by place",
      lessons: "Lesson 4",
      blurb: "Put hundreds with hundreds, tens with tens, and ones with ones, and find more than one way.",
      steps: 3,
    },
    {
      id: "new-ten",
      icon: "newten",
      title: "Make a new ten or hundred",
      lessons: "Lessons 6–8",
      blurb: "Trade 10 ones for a ten and 10 tens for a hundred when you add.",
      steps: 3,
    },
    {
      id: "add",
      icon: "add3",
      title: "Add three-digit numbers",
      lessons: "Lessons 9–10",
      blurb: "Make a new ten and a new hundred in one problem, and pick the easiest way to add.",
      steps: 2,
    },
    {
      id: "subtract",
      icon: "sub3",
      title: "Subtract three-digit numbers",
      lessons: "Lessons 12–16",
      blurb: "Break a ten or a hundred when you need to, and think before you subtract.",
      steps: 4,
    },
  ],
};
