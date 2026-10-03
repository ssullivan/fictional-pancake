/* Learn Adding, Subtracting, and Working with Data (Grade 2 Unit 1): the unit's chapters and their icons. Loaded by learn.html and every chapter page in learn/.
   Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON = {
  cubes:
    '<g stroke="#f3f6fb" stroke-width="1.5"><rect x="4" y="24" width="12" height="12" rx="2" fill="#ffc93c"/><rect x="16" y="24" width="12" height="12" rx="2" fill="#ffc93c"/><rect x="28" y="24" width="12" height="12" rx="2" fill="#ffc93c"/><rect x="40" y="24" width="12" height="12" rx="2" fill="#7fe3ff"/><rect x="52" y="24" width="10" height="12" rx="2" fill="#7fe3ff"/></g>',
  ten: '<g fill="none" stroke="#a9c4e4" stroke-width="1.5"><rect x="4" y="18" width="56" height="24"/><line x1="15.2" y1="18" x2="15.2" y2="42"/><line x1="26.4" y1="18" x2="26.4" y2="42"/><line x1="37.6" y1="18" x2="37.6" y2="42"/><line x1="48.8" y1="18" x2="48.8" y2="42"/><line x1="4" y1="30" x2="60" y2="30"/></g><g fill="#ffc93c"><circle cx="9.6" cy="24" r="4"/><circle cx="20.8" cy="24" r="4"/><circle cx="32" cy="24" r="4"/><circle cx="43.2" cy="24" r="4"/><circle cx="54.4" cy="24" r="4"/><circle cx="9.6" cy="36" r="4"/><circle cx="20.8" cy="36" r="4"/></g><g fill="#7fe3ff"><circle cx="32" cy="36" r="4"/><circle cx="43.2" cy="36" r="4"/><circle cx="54.4" cy="36" r="4"/></g>',
  pic: '<g><rect x="6" y="10" width="12" height="12" rx="2" fill="#ff7b7b"/><rect x="22" y="10" width="12" height="12" rx="2" fill="#ff7b7b"/><rect x="6" y="26" width="12" height="12" rx="2" fill="#6fa8ff"/><rect x="22" y="26" width="12" height="12" rx="2" fill="#6fa8ff"/><rect x="38" y="26" width="12" height="12" rx="2" fill="#6fa8ff"/><rect x="6" y="42" width="12" height="12" rx="2" fill="#5fe0a8"/></g>',
  bar: '<line x1="6" y1="56" x2="60" y2="56" stroke="#f3f6fb" stroke-width="2"/><rect x="10" y="30" width="12" height="26" fill="#ff7b7b"/><rect x="26" y="16" width="12" height="40" fill="#6fa8ff"/><rect x="42" y="38" width="12" height="18" fill="#5fe0a8"/>',
  tape: '<rect x="4" y="14" width="56" height="14" rx="2" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="2"/><rect x="4" y="36" width="34" height="14" rx="2" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2"/><rect x="38" y="36" width="22" height="14" rx="2" fill="none" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="3 3"/>',
};
const UNIT = {
  saveKey: "g2u1-learn",
  readAloud: true,
  icons: ICON,
  /* the order of the chapters when the unit was one page (learn.html#c2s1), for progress saved then and old links */
  legacy: ["within-20", "add-your-way", "picture-graphs", "bar-graphs", "compare"],
  chapters: [
    {
      id: "within-20",
      icon: "cubes",
      title: "Add and subtract within 20",
      lessons: "Lessons 1–3",
      blurb: "Put groups together, take some away, and see how adding and subtracting fit together.",
      steps: 4,
    },
    {
      id: "add-your-way",
      icon: "ten",
      title: "Add your way",
      lessons: "Lessons 4–5",
      blurb: "Make a ten, use doubles, and add bigger numbers with tens and ones.",
      steps: 3,
    },
    {
      id: "picture-graphs",
      icon: "pic",
      title: "Picture graphs",
      lessons: "Lessons 7–8",
      blurb: "Sort votes into a picture graph, then read it to find the most, the fewest, and the total.",
      steps: 3,
    },
    {
      id: "bar-graphs",
      icon: "bar",
      title: "Bar graphs",
      lessons: "Lessons 9–11",
      blurb: "Build bar graphs, read them with the scale, and ask questions a graph can answer.",
      steps: 4,
    },
    {
      id: "compare",
      icon: "tape",
      title: "Compare",
      lessons: "Lessons 13–16",
      blurb: "Find how many more or fewer with bar graphs and tape diagrams.",
      steps: 3,
    },
  ],
};
