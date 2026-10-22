/* Learn Rational Number Arithmetic (Grade 7 Unit 5): the unit's chapters and their icons. Loaded by learn.html and every
   chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has
   the format. */
const ICON = {
  add: '<path d="M4,46 H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M32,40 v12" stroke="#f3f6fb" stroke-width="3"/><path d="M32,32 H50" stroke="#ffc93c" stroke-width="3.5"/><polygon points="56,32 48,27 48,37" fill="#ffc93c"/><path d="M50,20 H18" stroke="#7fe3ff" stroke-width="3.5"/><polygon points="12,20 20,15 20,25" fill="#7fe3ff"/>',
  subtract:
    '<rect x="4" y="30" width="56" height="30" fill="rgba(64,140,255,.3)"/><path d="M4,30 H60" stroke="#7fe3ff" stroke-width="2"/><circle cx="20" cy="48" r="5" fill="#ffc93c"/><path d="M44,12 v30" stroke="#f3f6fb" stroke-width="2.5"/><path d="M40,16 l4,-6 4,6 M40,38 l4,6 4,-6" fill="none" stroke="#f3f6fb" stroke-width="2.5"/>',
  multiply:
    '<text x="32" y="40" fill="#ffc93c" font-size="18" font-weight="800" text-anchor="middle" font-family="monospace">−×−</text>',
  divide:
    '<path d="M8,14 L28,30 L42,24 L58,50" fill="none" stroke="#7fe3ff" stroke-width="3.5" stroke-linejoin="round"/><polygon points="58,50 50,46 56,40" fill="#7fe3ff"/>',
  equations:
    '<text x="32" y="38" fill="#ffc93c" font-size="15" font-weight="800" text-anchor="middle" font-family="monospace">−4x=8</text>',
};
const UNIT = {
  saveKey: "g7u5-learn",
  game: "Deep Dive",
  icons: ICON,
  chapters: [
    {
      id: "adding",
      icon: "add",
      title: "Adding signed numbers",
      game: { zone: "add", name: "Current Jumps" },
      lessons: "Lessons 1–4",
      blurb:
        "Temperatures that rise and fall, jumps on a number line, and the rule for adding numbers with different signs.",
      steps: 2,
    },
    {
      id: "subtracting",
      icon: "subtract",
      title: "Subtracting signed numbers",
      game: { zone: "subtract", name: "Depth Gauge" },
      lessons: "Lessons 5–7",
      blurb: "Subtracting asks what to add. It’s the same as adding the opposite.",
      steps: 2,
    },
    {
      id: "multiplying",
      icon: "multiply",
      title: "Multiplying signed numbers",
      game: { zone: "multiply", name: "Sonar Sweep" },
      lessons: "Lessons 8–10",
      blurb: "Speed, direction, and time explain why a negative times a negative is positive.",
      steps: 2,
    },
    {
      id: "dividing",
      icon: "divide",
      title: "Dividing and negative rates",
      game: { zone: "divide", name: "Pressure Drop" },
      lessons: "Lessons 11–12",
      blurb: "Dividing undoes multiplying, signs and all. A negative rate goes down over time.",
      steps: 2,
    },
    {
      id: "expressions",
      icon: "equations",
      title: "Expressions and equations",
      game: { zone: "equations", name: "Signal Decoder" },
      lessons: "Lessons 13–16",
      blurb: "Put negative numbers into expressions, and solve equations with them.",
      steps: 2,
    },
  ],
};
