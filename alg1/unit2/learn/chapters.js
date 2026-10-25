/* Learn Linear Equations, Inequalities, and Systems (Algebra 1 Unit 2): the unit's chapters and their icons. Loaded by
   learn.html and every chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js;
   shared/learn.js has the format. */
const ICON = {
  pizza:
    '<circle cx="32" cy="32" r="24" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="3"/><path d="M32,32 L32,8 M32,32 L53,44 M32,32 L11,44" stroke="#ffc93c" stroke-width="2.5"/><g fill="#ff8ac4"><circle cx="24" cy="22" r="3.5"/><circle cx="42" cy="26" r="3.5"/><circle cx="32" cy="46" r="3.5"/></g>',
  write:
    '<text x="32" y="30" fill="#f3f6fb" font-size="15" font-weight="800" text-anchor="middle" font-family="monospace">c=5p</text><text x="32" y="50" fill="#ffc93c" font-size="15" font-weight="800" text-anchor="middle" font-family="monospace">+40</text>',
  table:
    '<rect x="10" y="8" width="44" height="48" rx="4" fill="rgba(9,32,61,.6)" stroke="#f3f6fb" stroke-width="2"/><path d="M32,8 V56 M10,20 H54 M10,32 H54 M10,44 H54" stroke="rgba(170,205,255,.6)" stroke-width="1.5"/><path d="M40,26 L46,26 M40,38 L46,38 M40,50 L46,50" stroke="#ffc93c" stroke-width="3"/>',
  solve:
    '<text x="32" y="28" fill="#f3f6fb" font-size="14" font-weight="800" text-anchor="middle" font-family="monospace">4c+5=27</text><path d="M18,40 L28,50 L48,30" fill="none" stroke="#5fe0a8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
  graph:
    '<path d="M8,56 H58 M8,56 V6" stroke="#f3f6fb" stroke-width="2.5"/><path d="M8,14 L52,56" stroke="#ffc93c" stroke-width="3"/><circle cx="24" cy="29" r="4.5" fill="#5fe0a8"/><circle cx="44" cy="22" r="4.5" fill="#ff6b6b"/>',
};
const UNIT = {
  saveKey: "alg1u2-learn",
  icons: ICON,
  chapters: [
    {
      id: "pizza-party",
      icon: "pizza",
      title: "Planning a pizza party",
      lessons: "Lesson 1",
      blurb:
        "Letters stand for quantities in a plan. Read what an equation says, and find the constraints that limit it.",
      steps: 2,
    },
    {
      id: "writing-equations",
      icon: "write",
      title: "Writing equations",
      lessons: "Lesson 2",
      blurb: "Turn a situation into an equation: a cost per person plus a fixed cost, and a price plus tax and fees.",
      steps: 2,
    },
    {
      id: "finding-relationships",
      icon: "table",
      title: "Finding the relationship",
      lessons: "Lesson 3",
      blurb:
        "Look for a pattern in a table: a sum that stays the same, a difference, or a product. Test it on every row.",
      steps: 2,
    },
    {
      id: "solutions",
      icon: "solve",
      title: "Equations and their solutions",
      lessons: "Lesson 4",
      blurb:
        "A solution makes an equation true. With two variables, a solution is a pair of values, and there can be many.",
      steps: 2,
    },
    {
      id: "graphs",
      icon: "graph",
      title: "Equations and their graphs",
      lessons: "Lesson 5",
      blurb:
        "The graph of an equation is all its solutions. Points on the line meet the constraint; points off it don’t.",
      steps: 2,
    },
  ],
};
