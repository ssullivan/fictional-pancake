/* Learn Putting It All Together (Grade 6 Unit 9), chapter 6: Picking representatives. Its widgets and steps; loaded by
   representatives.html. */
/* IM's families and how many school-aged children each has */
const FAMILIES = [
  ["Baum", 4],
  ["Chu", 2],
  ["Davila", 6],
  ["Eno", 2],
  ["Farouz", 2],
];
const CHILDREN = FAMILIES.reduce((s, [, n]) => s + n, 0);
/* Change how many computers there are: children per computer is all the children ÷ the computers, and each family's share
   is its children ÷ that. */
function wComputers(el) {
  const q = Q(el),
    values = { computers: 8 };
  el.innerHTML =
    `<div class="wrow">${stepper("computers", "Computers")}</div>` +
    `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const computers = values.computers,
      perComputer = CHILDREN / computers,
      shares = FAMILIES.map(([, n]) => n / perComputer),
      allWhole = shares.every((share) => Number.isInteger(Math.round(share * 1e9) / 1e9));
    q("computers").textContent = computers;
    q("f").innerHTML = infoTable(
      ["family", "children", "computers"],
      FAMILIES.map(([name, n], i) => [name, n, fmt(shares[i])]),
      "Each family’s fair share of computers",
    );
    q("e").textContent = `${CHILDREN} children ÷ ${computers} computers = ${fmt(perComputer)} children per computer`;
    q("r").innerHTML =
      `Each computer is for <b>${fmt(perComputer)}</b> children, so each family gets its children ÷ ${fmt(perComputer)}. ` +
      (allWhole
        ? `<span class="ok">Every family gets a whole number of computers.</span>`
        : `<span class="no">Some shares aren’t whole numbers</span>, and no one can get part of a computer: there has to be a fair way to round.`);
  };
  steppers(el, values, { computers: [1, 16] }, draw);
  draw();
}

/* IM's school district: very different school sizes and 10 advisors to share */
const SCHOOLS = [
  { k: "king", name: "King", students: 500 },
  { k: "oconnor", name: "O’Connor", students: 200 },
  { k: "magnet", name: "Magnet", students: 140 },
  { k: "trombone", name: "Trombone", students: 10 },
];
const ADVISORS = 10,
  STUDENTS = SCHOOLS.reduce((s, school) => s + school.students, 0),
  PER_ADVISOR = STUDENTS / ADVISORS;
/* Give each school a whole number of advisors (at least 1), 10 in all: how many students each advisor has at each school. */
function wAdvisors(el) {
  const q = Q(el),
    values = { king: 5, oconnor: 2, magnet: 2, trombone: 1 };
  el.innerHTML =
    `<div class="wrow">${SCHOOLS.map((s) => stepper(s.k, s.name)).join("")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const given = SCHOOLS.reduce((s, school) => s + values[school.k], 0),
      perSchool = SCHOOLS.map((school) => school.students / values[school.k]);
    SCHOOLS.forEach((school) => (q(school.k).textContent = values[school.k]));
    q("f").innerHTML = infoTable(
      ["school", "students", "advisors", "per advisor"],
      SCHOOLS.map((school, i) => [school.name, school.students, values[school.k], fmt(perSchool[i])]),
      "Advisors for each school",
    );
    const exact = `${STUDENTS} students ÷ ${ADVISORS} advisors = ${PER_ADVISOR} per advisor. Exact shares: ${SCHOOLS.map((s) => `${s.name} ${fmt(Math.round((10 * s.students) / PER_ADVISOR) / 10)}`).join(", ")}.`;
    q("r").innerHTML =
      given === ADVISORS
        ? `<span class="ok">All ${ADVISORS} advisors given out.</span> Students per advisor go from ${fmt(Math.min(...perSchool))} to ${fmt(Math.max(...perSchool))}. The closer they all are to ${PER_ADVISOR}, the fairer.<br><span class="dimline">${exact}</span>`
        : `<span class="no">${given} advisors given out.</span> Give out exactly ${ADVISORS}.<br><span class="dimline">${exact}</span>`;
  };
  steppers(el, values, Object.fromEntries(SCHOOLS.map((s) => [s.k, [1, 7]])), draw);
  draw();
}

/* A town of 5 rows of 10 blocks: the top 2 rows like banana slugs, the other 3 like sea lions. Each map splits it into 5
   districts of 10 blocks (a digit for each block's district), and each district's representative votes its majority. */
const MAPS = [
  { id: "rows", label: "Rows", grid: ["1111111111", "2222222222", "3333333333", "4444444444", "5555555555"] },
  { id: "cols", label: "Columns", grid: ["1122334455", "1122334455", "1122334455", "1122334455", "1122334455"] },
  { id: "mixed", label: "Another way", grid: ["1112223335", "1112223335", "1112223335", "1442443555", "4444445555"] },
];
const SLUG_ROWS = 2;
/* the map as blocks colored by what they like, with a thick line wherever two districts meet, and each district's number */
function townMap(grid) {
  const cell = 32,
    pad = 6,
    rows = grid.length,
    cols = grid[0].length,
    districtAt = (r, c) => (r >= 0 && r < rows && c >= 0 && c < cols ? grid[r][c] : null);
  let blocks = "",
    lines = "",
    labels = "";
  const labeled = new Set();
  grid.forEach((row, r) =>
    [...row].forEach((district, c) => {
      const x = pad + c * cell,
        y = pad + r * cell;
      blocks += `<rect class="block ${r < SLUG_ROWS ? "slug" : "lion"}" x="${x}" y="${y}" width="${cell}" height="${cell}"/>`;
      /* a border on each side that faces another district or the edge of town */
      if (districtAt(r - 1, c) !== district) lines += `M${x},${y} h${cell} `;
      if (districtAt(r + 1, c) !== district) lines += `M${x},${y + cell} h${cell} `;
      if (districtAt(r, c - 1) !== district) lines += `M${x},${y} v${cell} `;
      if (districtAt(r, c + 1) !== district) lines += `M${x + cell},${y} v${cell} `;
      /* the district's number, in its first block */
      if (!labeled.has(district)) {
        labeled.add(district);
        labels += `<text class="lbl s" x="${x + cell / 2}" y="${y + cell / 2}">${district}</text>`;
      }
    }),
  );
  return svgWrap(
    pad * 2 + cols * cell,
    pad * 2 + rows * cell,
    `${blocks}<path class="district" d="${lines}"/>${labels}`,
    "Town map of districts",
  );
}
/* Pick a map: the same blocks, split into districts different ways. */
function wDistricts(el) {
  const q = Q(el);
  let mapId = "rows";
  el.innerHTML =
    seg(
      "Districts",
      MAPS.map((m) => [m.id, m.label]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { grid } = MAPS.find((m) => m.id === mapId),
      /* each district's banana slug blocks: the blocks in the top rows */
      slugs = {};
    grid.forEach((row, r) => [...row].forEach((d) => (slugs[d] = (slugs[d] || 0) + (r < SLUG_ROWS ? 1 : 0))));
    const districts = Object.keys(slugs).sort(),
      slugWins = districts.filter((d) => slugs[d] > 5),
      lionWins = districts.filter((d) => slugs[d] < 5);
    press(el, mapId);
    q("f").innerHTML = townMap(grid);
    q("r").innerHTML =
      `Banana slug blocks in each district: ${districts.map((d) => `${d}: ${slugs[d]}`).join(", ")}. ` +
      (slugWins.length > lionWins.length
        ? `<b>Banana slugs win ${slugWins.length} to ${lionWins.length}</b>, with only 20 of the 50 blocks.`
        : `<b>Sea lions win ${lionWins.length} to ${slugWins.length}</b>.`) +
      `<br><span class="dimline">Every map has the same 20 banana slug blocks (gold) and 30 sea lion blocks. Only the lines changed.</span>`;
  };
  onPick(el, (id) => {
    mapId = id;
    draw();
  });
  draw();
}

const STEPS = [
  {
    title: "People per representative",
    widget: wComputers,
    body: "<p>To share things (or representatives) fairly among groups of different sizes, find how many people each one is for: all the people ÷ how many there are to share. Then each group gets its people ÷ that number.</p><p>Change the number of computers.</p>",
    check: {
      kind: "num",
      q: "Four schools have 48, 12, 24, and 36 students. They share 10 advisors fairly. How many students per advisor is that?",
      answer: 12,
      unit: "students",
      misc: [
        [30, "That’s the students per school. Share all 120 students among the 10 advisors."],
        [120, "That’s all the students. Divide by the 10 advisors."],
        [2.5, "That’s advisors per school. The question asks for students per advisor."],
      ],
      explain: "48 + 12 + 24 + 36 = 120 students, and 120 ÷ 10 = 12 students per advisor.",
    },
  },
  {
    title: "Whole seats",
    widget: wAdvisors,
    body: "<p>Exact shares often aren’t whole numbers, but representatives come in wholes, and every school should have at least one. Round in a way that keeps the students per advisor as even as you can.</p><p>Give out the 10 advisors.</p>",
    check: {
      kind: "num",
      q: "There are 12 students per advisor. How many advisors should a school with 48 students get?",
      answer: 4,
      unit: "advisors",
      misc: [
        [1, "One per school isn’t fair when schools are different sizes. Use 12 students per advisor."],
        [576, "Divide the students by 12; don’t multiply."],
      ],
      explain: "48 ÷ 12 = 4 advisors.",
    },
  },
  {
    title: "Drawing districts",
    widget: wDistricts,
    body: "<p>A town picks 5 representatives, one for each district of 10 blocks, and each one votes the way most of the district’s blocks want. Where the district lines go can change who wins, even when the votes don’t change.</p><p>Try each map.</p>",
    check: {
      kind: "mc",
      q: "In a town of 50 blocks, 20 blocks want banana slugs and 30 want sea lions. The town is split into 5 districts of 10 blocks. Which is true?",
      answer: "a",
      choices: [
        { id: "a", label: "Banana slugs can win 3 districts if the lines are drawn a certain way." },
        { id: "b", label: "Sea lions must win, since more blocks want them." },
        { id: "c", label: "Every district must split 4 to 6, like the whole town." },
      ],
      why: {
        b: "Look at the third map: with the lines drawn that way, banana slugs win 3 districts to 2.",
        c: "Districts can be drawn many ways. In the first map, two districts are all banana slugs.",
      },
      explain:
        "With the right lines, 3 districts each get 6 banana slug blocks (18 of the 20), and banana slugs win 3 to 2.",
      stack: true,
    },
  },
];
