/* Learn Putting It All Together (Grade 7 Unit 9): the unit's chapters and their icons. Loaded by learn.html and every
   chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has
   the format. */
const ICON = {
  recipe:
    '<path d="M12,30 h40 v6 a20,20 0 0 1 -40,0 z" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2.5"/><path d="M22,22 q4,-8 0,-14 M32,22 q4,-8 0,-14 M42,22 q4,-8 0,-14" fill="none" stroke="#f3f6fb" stroke-width="2.5"/>',
  costs:
    '<rect x="12" y="8" width="40" height="48" rx="4" fill="rgba(243,246,251,.1)" stroke="#f3f6fb" stroke-width="2.5"/><path d="M20,22 H44 M20,32 H44 M20,42 H36" stroke="#7fe3ff" stroke-width="2.5"/><text x="46" y="52" fill="#ffc93c" font-size="14" font-weight="800" text-anchor="middle" font-family="monospace">$</text>',
  plan: '<rect x="8" y="12" width="48" height="40" fill="rgba(255,201,60,.15)" stroke="#ffc93c" stroke-width="2.5"/><g fill="rgba(127,227,255,.5)" stroke="#7fe3ff" stroke-width="1.5"><circle cx="22" cy="26" r="5"/><circle cx="42" cy="26" r="5"/><circle cx="22" cy="40" r="5"/><circle cx="42" cy="40" r="5"/></g>',
  measure:
    '<circle cx="24" cy="40" r="16" fill="none" stroke="#7fe3ff" stroke-width="3"/><path d="M24,40 L50,10" stroke="#f3f6fb" stroke-width="3" stroke-linecap="round"/><path d="M4,58 H60" stroke="#ffc93c" stroke-width="3"/>',
};
const UNIT = {
  saveKey: "g7u9-learn",
  game: "Grand Opening",
  icons: ICON,
  chapters: [
    {
      id: "recipes",
      icon: "recipe",
      title: "Planning recipes",
      game: { zone: "recipe", name: "Recipe Scaler" },
      lessons: "Lesson 1",
      blurb: "Scale a recipe up or down: every amount times the same factor.",
      steps: 1,
    },
    {
      id: "costs",
      icon: "costs",
      title: "Costs and profit",
      game: { zone: "costs", name: "Menu Prices" },
      lessons: "Lessons 2–3",
      blurb: "Mark up food costs to set prices, and find the profit after the night’s costs.",
      steps: 2,
    },
    {
      id: "floor-plan",
      icon: "plan",
      title: "The floor plan and the neighborhood",
      game: { zone: "plan", name: "Floor Plan" },
      lessons: "Lessons 4–5",
      blurb: "Turn a scale drawing into real sizes and areas, and compare how crowded neighborhoods are.",
      steps: 2,
    },
    {
      id: "measuring",
      icon: "measure",
      title: "Measuring the course",
      game: { zone: "measure", name: "Course Measure" },
      lessons: "Lessons 8–12",
      blurb: "Measure with a trundle wheel, and find the percent error of a measurement.",
      steps: 2,
    },
  ],
};
