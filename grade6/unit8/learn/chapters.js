/* Learn Data Sets and Distributions (Grade 6 Unit 8): the unit's chapters and their icons. Loaded by learn.html and every
   chapter page in learn/. Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the
   format. */
const ICON = {
  questions:
    '<rect x="12" y="6" width="40" height="52" rx="4" fill="rgba(9,32,61,.6)" stroke="#f3f6fb" stroke-width="2.5"/><text x="32" y="42" fill="#ffc93c" font-size="28" font-weight="700" text-anchor="middle" font-family="monospace">?</text>',
  dots: '<path d="M6,52 H58" stroke="#f3f6fb" stroke-width="2.5"/><g fill="#ffc93c"><circle cx="14" cy="45" r="4"/><circle cx="26" cy="45" r="4"/><circle cx="26" cy="35" r="4"/><circle cx="38" cy="45" r="4"/><circle cx="38" cy="35" r="4"/><circle cx="38" cy="25" r="4"/><circle cx="50" cy="45" r="4"/></g>',
  hist: '<path d="M6,56 H58 M6,56 V8" stroke="#f3f6fb" stroke-width="2.5"/><g fill="rgba(255,201,60,.6)" stroke="#f3f6fb" stroke-width="1.5"><rect x="8" y="40" width="10" height="16"/><rect x="18" y="24" width="10" height="32"/><rect x="28" y="14" width="10" height="42"/><rect x="38" y="30" width="10" height="26"/><rect x="48" y="46" width="10" height="10"/></g>',
  mean: '<path d="M6,40 H58" stroke="#f3f6fb" stroke-width="2.5"/><polygon points="32,40 24,54 40,54" fill="#7fe3ff"/><g fill="#ffc93c"><circle cx="12" cy="33" r="4"/><circle cx="24" cy="33" r="4"/><circle cx="44" cy="33" r="4"/><circle cx="48" cy="23" r="4"/></g>',
  mad: '<path d="M6,52 H58" stroke="#f3f6fb" stroke-width="2.5"/><path d="M32,10 V52" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="4 3"/><path d="M12,40 H32 M50,28 H32" stroke="#ff8ac4" stroke-width="2.5"/><circle cx="12" cy="40" r="4" fill="#ffc93c"/><circle cx="50" cy="28" r="4" fill="#ffc93c"/>',
  median:
    '<g fill="rgba(9,32,61,.6)" stroke="#f3f6fb" stroke-width="2"><rect x="4" y="24" width="10" height="16" rx="2"/><rect x="16" y="24" width="10" height="16" rx="2"/><rect x="40" y="24" width="10" height="16" rx="2"/><rect x="52" y="24" width="8" height="16" rx="2"/></g><rect x="27" y="20" width="12" height="24" rx="2" fill="rgba(255,201,60,.6)" stroke="#ffc93c" stroke-width="2"/>',
  quartiles:
    '<g stroke="#f3f6fb" stroke-width="2"><rect x="4" y="24" width="12" height="16" rx="2" fill="rgba(255,201,60,.45)"/><rect x="18" y="24" width="12" height="16" rx="2" fill="rgba(127,227,255,.4)"/><rect x="34" y="24" width="12" height="16" rx="2" fill="rgba(255,201,60,.45)"/><rect x="48" y="24" width="12" height="16" rx="2" fill="rgba(127,227,255,.4)"/></g><path d="M32,16 V48" stroke="#ffc93c" stroke-width="2.5"/>',
  box: '<path d="M6,32 H18 M46,32 H58 M6,24 V40 M58,24 V40" stroke="#f3f6fb" stroke-width="2.5"/><rect x="18" y="20" width="28" height="24" fill="rgba(127,227,255,.25)" stroke="#f3f6fb" stroke-width="2.5"/><path d="M30,20 V44" stroke="#ffc93c" stroke-width="3.5"/>',
  together:
    '<circle cx="26" cy="26" r="15" fill="rgba(127,227,255,.15)" stroke="#f3f6fb" stroke-width="3"/><path d="M37,37 L56,56" stroke="#ffc93c" stroke-width="6" stroke-linecap="round"/><g fill="#ffc93c"><circle cx="20" cy="30" r="3"/><circle cx="26" cy="24" r="3"/><circle cx="32" cy="30" r="3"/></g>',
};
const UNIT = {
  saveKey: "g6u8-learn",
  game: "Data Detectives",
  icons: ICON,
  chapters: [
    {
      id: "questions",
      icon: "questions",
      title: "Statistical questions",
      game: { zone: "question", name: "Case Files" },
      lessons: "Lessons 1–3",
      blurb: "Questions whose answers vary, and the two kinds of data: categories and numbers.",
      steps: 2,
    },
    {
      id: "dotplots",
      icon: "dots",
      title: "Dot plots",
      game: { zone: "dot", name: "Dot Plot Clues" },
      lessons: "Lessons 4–5",
      blurb: "Build a dot plot, read how many and what fraction, and describe what’s typical and how spread out.",
      steps: 3,
    },
    {
      id: "histograms",
      icon: "hist",
      title: "Histograms",
      game: { zone: "hist", name: "Histogram Hunt" },
      lessons: "Lessons 6–8",
      blurb: "Group data into intervals, read what the bars mean, and name a distribution’s shape.",
      steps: 3,
    },
    {
      id: "mean",
      icon: "mean",
      title: "The mean",
      game: { zone: "mean", name: "Mean Machine" },
      lessons: "Lessons 9–10",
      blurb: "The mean as a fair share and as a balance point, then the arithmetic and a missing value.",
      steps: 3,
    },
    {
      id: "mad",
      icon: "mad",
      title: "Variability and MAD",
      game: { zone: "mad", name: "Spread Scanner" },
      lessons: "Lessons 11–12",
      blurb: "Measure spread as the average distance from the mean, and compare groups with the mean and MAD.",
      steps: 2,
    },
    {
      id: "median",
      icon: "median",
      title: "The median",
      game: { zone: "median", name: "Middle Finder" },
      lessons: "Lessons 13–14",
      blurb: "The middle of the sorted data, an even number of values, and when the median beats the mean.",
      steps: 3,
    },
    {
      id: "quartiles",
      icon: "quartiles",
      title: "Quartiles and IQR",
      game: { zone: "median", name: "Middle Finder" },
      lessons: "Lesson 15",
      blurb: "Split sorted data into quarters, and measure the spread of the middle half.",
      steps: 2,
    },
    {
      id: "boxplots",
      icon: "box",
      title: "Box plots",
      game: { zone: "box", name: "Box Plot Lab" },
      lessons: "Lessons 16–17",
      blurb: "Build a box plot over its dots, see that each part holds a quarter, and compare two groups.",
      steps: 3,
    },
    {
      id: "put-together",
      icon: "together",
      title: "Using data to solve problems",
      game: { zone: "boss", name: "Case Closed" },
      lessons: "Lesson 18",
      blurb: "Pick the measures that fit a distribution’s shape, and find the mistake in a solved problem.",
      steps: 2,
    },
  ],
};
