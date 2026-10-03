/* Learn Equal Groups (Grade 2 Unit 8): the unit's chapters and their icons. Loaded by learn.html and every chapter page in learn/.
   Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  share:
    '<ellipse cx="16" cy="48" rx="14" ry="8" fill="none" stroke="#f3f6fb" stroke-width="2.5"/><ellipse cx="48" cy="48" rx="14" ry="8" fill="none" stroke="#f3f6fb" stroke-width="2.5"/><g fill="#ffc93c"><circle cx="10" cy="42" r="4.5"/><circle cx="22" cy="42" r="4.5"/><circle cx="42" cy="42" r="4.5"/><circle cx="54" cy="42" r="4.5"/></g><circle cx="32" cy="16" r="5" fill="#7fe3ff"/><circle cx="32" cy="16" r="10" fill="none" stroke="#f3f6fb" stroke-width="1.5" stroke-dasharray="3 3"/>',
  oddeven:
    '<g fill="none" stroke="#f3f6fb" stroke-width="2"><rect x="3" y="12" width="14" height="36" rx="7"/><rect x="19" y="12" width="14" height="36" rx="7"/><rect x="35" y="12" width="14" height="36" rx="7"/></g><g fill="#ffc93c"><circle cx="10" cy="22" r="5"/><circle cx="10" cy="38" r="5"/><circle cx="26" cy="22" r="5"/><circle cx="26" cy="38" r="5"/><circle cx="42" cy="22" r="5"/><circle cx="42" cy="38" r="5"/></g><circle cx="57" cy="22" r="5" fill="#7fe3ff"/>',
  array:
    '<rect x="3" y="7" width="58" height="16" rx="8" fill="none" stroke="#ffc93c" stroke-width="2"/><g fill="#ffc93c">' +
    range(12)
      .map((i) => `<circle cx="${11 + (i % 4) * 14}" cy="${15 + Math.floor(i / 4) * 16}" r="5"/>`)
      .join("") +
    "</g>",
  addends:
    '<g fill="#ffc93c">' +
    range(6)
      .map((i) => `<circle cx="${14 + (i % 3) * 18}" cy="${10 + Math.floor(i / 3) * 16}" r="6"/>`)
      .join("") +
    '</g><text x="32" y="56" fill="#f3f6fb" font-size="14" font-weight="700" text-anchor="middle" font-family="monospace">3 + 3</text>',
  squares:
    '<g fill="none" stroke="#f3f6fb" stroke-width="2"><rect x="4" y="10" width="56" height="42"/><path d="M18,10V52M32,10V52M46,10V52M4,24H60M4,38H60"/></g><g fill="#ffc93c"><rect x="5" y="11" width="12" height="12"/><rect x="19" y="11" width="12" height="12"/><rect x="33" y="11" width="12" height="12"/></g>',
};
const UNIT = {
  saveKey: "g2u8-learn",
  readAloud: true,
  icons: ICON,
  /* the order of the chapters when the unit was one page (learn.html#c2s1), for progress saved then and old links */
  legacy: ["share-and-pair", "odd-and-even", "arrays", "equal-addends", "rectangles"],
  chapters: [
    {
      id: "share-and-pair",
      icon: "share",
      title: "Share and make pairs",
      lessons: "Lessons 1–2",
      blurb: "Share things fairly between 2 friends, and see if everyone gets a partner.",
      steps: 2,
    },
    {
      id: "odd-and-even",
      icon: "oddeven",
      title: "Odd and even",
      lessons: "Lessons 3–4",
      blurb: "Tell if a number is odd or even with pairs, counting by 2s, and doubles.",
      steps: 4,
    },
    {
      id: "arrays",
      icon: "array",
      title: "Arrays",
      lessons: "Lessons 7–8",
      blurb: "Put things in rows and columns, and count them by rows or by columns.",
      steps: 3,
    },
    {
      id: "equal-addends",
      icon: "addends",
      title: "Equal addends",
      lessons: "Lessons 9–10",
      blurb: "Add the rows or the columns of an array, and build an array from an equation.",
      steps: 3,
    },
    {
      id: "rectangles",
      icon: "squares",
      title: "Rectangles and squares",
      lessons: "Lessons 11–12",
      blurb: "Push square tiles into a rectangle, and cut a rectangle into same-size squares.",
      steps: 3,
    },
  ],
};
