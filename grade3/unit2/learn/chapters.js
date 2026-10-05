/* Learn Area and Multiplication (Grade 3 Unit 2): the unit's chapters and their icons. Loaded by learn.html and every chapter page in learn/.
   Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
/* a row of unit squares for an icon: [col, row] squares, `size` pixels each from x0, y0, in `fill` */
const iconSquares = (cells, size, x0, y0, fill) =>
  cells
    .map(
      ([c, r]) =>
        `<rect x="${x0 + c * size}" y="${y0 + r * size}" width="${size}" height="${size}" fill="${fill}" stroke="#0a2340" stroke-width="1.2"/>`,
    )
    .join("");
const ICON = {
  cover:
    iconSquares(
      [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      12,
      6,
      14,
      "#ffc93c",
    ) +
    iconSquares(
      [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 2],
      ],
      12,
      40,
      14,
      "#7fe3ff",
    ),
  tile:
    '<rect x="8" y="12" width="48" height="36" fill="none" stroke="#7fe3ff" stroke-width="2.5"/>' +
    iconSquares(
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [0, 1],
        [0, 2],
      ],
      12,
      8,
      12,
      "#ffc93c",
    ),
  product:
    iconSquares(
      [0, 1, 2, 3, 4, 5, 6, 7].map((i) => [i % 4, Math.floor(i / 4)]),
      11,
      10,
      8,
      "#ffc93c",
    ) +
    '<text x="32" y="56" fill="#f3f6fb" font-size="13" font-weight="700" text-anchor="middle" font-family="monospace">2 × 4</text>',
  units:
    '<rect x="6" y="40" width="10" height="10" fill="#5fe0a8"/><rect x="22" y="26" width="24" height="24" fill="#7fe3ff"/><line x1="4" y1="54" x2="60" y2="54" stroke="#f3f6fb" stroke-width="2"/><text x="11" y="36" fill="#f3f6fb" font-size="8" font-weight="700" text-anchor="middle" font-family="monospace">cm</text><text x="34" y="20" fill="#f3f6fb" font-size="8" font-weight="700" text-anchor="middle" font-family="monospace">in</text>',
  sides:
    '<rect x="16" y="14" width="40" height="28" fill="rgba(95,224,168,.25)" stroke="#5fe0a8" stroke-width="2.5"/><text x="36" y="10" fill="#f3f6fb" font-size="9" font-weight="700" text-anchor="middle" font-family="monospace">6 cm</text><text x="12" y="31" fill="#f3f6fb" font-size="9" font-weight="700" text-anchor="end" font-family="monospace">4</text><text x="36" y="58" fill="#ffc93c" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">4×6=24</text>',
  story:
    '<rect x="8" y="14" width="48" height="32" rx="2" fill="#c97b4b" stroke="#f3f6fb" stroke-width="2"/><path d="M8,22H56M8,38H56" stroke="#8a4a2b" stroke-width="2"/><text x="32" y="60" fill="#ffc93c" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">4×?=24</text>',
  split:
    '<rect x="8" y="12" width="30" height="40" fill="rgba(255,201,60,.5)"/><rect x="38" y="12" width="18" height="40" fill="rgba(127,227,255,.45)"/><rect x="8" y="12" width="48" height="40" fill="none" stroke="#f3f6fb" stroke-width="2"/><line x1="38" y1="8" x2="38" y2="56" stroke="#ff8ac4" stroke-width="2.5" stroke-dasharray="4 3"/>',
  ell: '<path d="M8,10H34V30H56V54H8Z" fill="rgba(95,224,168,.3)" stroke="#5fe0a8" stroke-width="2.5"/><line x1="34" y1="30" x2="34" y2="54" stroke="#ff8ac4" stroke-width="2" stroke-dasharray="4 3"/><text x="21" y="8" fill="#f3f6fb" font-size="8" font-weight="700" text-anchor="middle" font-family="monospace">?</text>',
};
const UNIT = {
  saveKey: "g3u2-learn",
  game: "Tile Town",
  icons: ICON,
  chapters: [
    {
      id: "what-is-area",
      icon: "cover",
      title: "What is area?",
      game: { zone: "cover", name: "Tile Shop" },
      lessons: "Lessons 1–2",
      blurb: "Cover shapes with squares to see which takes up more space, with no gaps or overlaps.",
      steps: 2,
    },
    {
      id: "tile-rectangles",
      icon: "tile",
      title: "Tile rectangles",
      game: { zone: "cover", name: "Tile Shop" },
      lessons: "Lessons 3–4",
      blurb: "Tile a rectangle row by row, and picture the tiles that aren’t there yet.",
      steps: 2,
    },
    {
      id: "products-as-areas",
      icon: "product",
      title: "Products as areas",
      game: { zone: "build", name: "Mosaic Wall" },
      lessons: "Lesson 5",
      blurb: "See 4 × 6 as a rectangle 4 rows of 6, and find rectangles with the same area.",
      steps: 2,
    },
    {
      id: "square-units",
      icon: "units",
      title: "Square units",
      game: { zone: "units", name: "Unit Store" },
      lessons: "Lessons 6–7",
      blurb: "Square centimeters, inches, feet, and meters, and which one fits what you measure.",
      steps: 2,
    },
    {
      id: "no-grid",
      icon: "sides",
      title: "Area without a grid",
      game: { zone: "plots", name: "Garden Plots" },
      lessons: "Lessons 8–9",
      blurb: "Multiply the side lengths, and measure them with a ruler first.",
      steps: 2,
    },
    {
      id: "area-problems",
      icon: "story",
      title: "Area problems",
      game: { zone: "plots", name: "Garden Plots" },
      lessons: "Lesson 10",
      blurb: "Solve stories about rugs and gardens, and find a missing side from the area.",
      steps: 2,
    },
    {
      id: "area-and-addition",
      icon: "split",
      title: "Area and addition",
      game: { zone: "split", name: "Split Street" },
      lessons: "Lesson 12",
      blurb: "Cut a rectangle in two to use facts you know: 6 × 7 = 6 × 5 + 6 × 2.",
      steps: 2,
    },
    {
      id: "composite-figures",
      icon: "ell",
      title: "Figures made of rectangles",
      game: { zone: "floors", name: "Floor Plans" },
      lessons: "Lessons 13–14",
      blurb: "Cut a figure into rectangles and add their areas, and find the sides that aren’t marked.",
      steps: 2,
    },
  ],
};
