/* Learn Two-dimensional Shapes and Perimeter (Grade 3 Unit 7), chapter 6: Area and perimeter. Its widgets and steps; loaded by
   area-and-perimeter.html. */
/* jobs on a rectangle 5 units long and 3 wide: [button, the job, what it needs, what goes around or covers it] */
const JOBS = [
  ["Fence", "A fence goes all the way around a garden.", "perimeter", "fence"],
  ["Carpet", "Carpet covers the floor of a room.", "area", "carpet"],
  ["Ribbon", "Ribbon goes around the edge of a card.", "perimeter", "ribbon"],
  ["Tiles", "Square tiles cover a patio.", "area", "tiles"],
];
/* the rectangle every job is on */
const JOB_RECT = rectCells(3, 5);
/* Pick a job, then pick area or perimeter: the picture shows the measure picked, and the readout says if it fits the job. */
function wJob(el) {
  /* measure: the measure picked, or null before one is */
  const q = Q(el);
  let jobIndex = 0,
    measure = null;
  el.innerHTML =
    `<div data-top>${seg(
      "Job",
      JOBS.map(([button], i) => [i, button]),
    )}</div><div data-bot>${seg("Measure", [
      ["area", "Area"],
      ["perimeter", "Perimeter"],
    ])}</div>` + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [, job, needs, what] = JOBS[jobIndex],
      area = JOB_RECT.length,
      perimeter = perimeterOf(JOB_RECT);
    press(q("top"), jobIndex);
    press(q("bot"), measure);
    q("f").innerHTML = gridFig(JOB_RECT, { walk: measure === "perimeter" ? perimeter : 0, count: measure === "area" });
    q("r").innerHTML =
      `${job} Does it need the area or the perimeter?` +
      (measure === null
        ? ""
        : `<br>${measure === "area" ? `Area: the ${area} squares inside.` : `Perimeter: the ${perimeter} unit lengths around.`} ` +
          (measure === needs
            ? `<span class="ok">Yes: the ${what} ${needs === "area" ? "covers the inside" : "goes around the outside"}.</span>`
            : `<span class="no">Not this one: the ${what} ${needs === "area" ? "covers the inside" : "goes around the outside"}.</span>`));
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") {
      jobIndex = +id;
      measure = null;
    } else measure = id;
    draw();
  });
  draw();
}
/* half the perimeter every rectangle keeps in wSamePerimeter (a perimeter of 16) */
const HALF = 8;
/* Change a rectangle's length (a stepper) while its perimeter stays 16: the width is what's left, and the area changes. */
function wSamePerimeter(el) {
  /* values.len: the rectangle's length in units */
  const q = Q(el),
    values = { len: 6 };
  el.innerHTML = `<div class="wrow">${stepper("len", "Length")}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const len = values.len,
      wid = HALF - len;
    q("len").textContent = len;
    q("f").innerHTML = gridFig(rectCells(wid, len), { label: `A rectangle ${len} units long and ${wid} wide` });
    q("e").textContent = `${len} + ${wid} + ${len} + ${wid} = ${2 * HALF}`;
    q("r").innerHTML =
      `${len} long and ${wid} wide: the perimeter is ${2 * HALF} units. The area is ${len} × ${wid} = <b>${len * wid} square units</b>.<br>` +
      (len === wid
        ? `<span class="ok">A square: the biggest area a perimeter of ${2 * HALF} can make.</span>`
        : `<span class="dimline">Same perimeter, different area. The longer and thinner it gets, the smaller the area.</span>`);
  };
  steppers(el, values, { len: [1, HALF - 1] }, draw);
  draw();
}
/* rectangles with an area of 12 square units: [width, length] */
const AREA_12 = [
  [1, 12],
  [2, 6],
  [3, 4],
];
/* Pick a rectangle with an area of 12 square units: its perimeter changes. */
function wSameArea(el) {
  const q = Q(el);
  let rectIndex = 0;
  el.innerHTML =
    seg(
      "Rectangle",
      AREA_12.map(([wid, len], i) => [i, `${len} by ${wid}`]),
    ) + `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const [wid, len] = AREA_12[rectIndex],
      perimeter = 2 * (len + wid);
    press(el, rectIndex);
    q("f").innerHTML = gridFig(rectCells(wid, len), { label: `A rectangle ${len} units long and ${wid} wide` });
    q("e").textContent = `${len} + ${wid} + ${len} + ${wid} = ${perimeter}`;
    q("r").innerHTML =
      `${len} × ${wid} = 12 square units, and the perimeter is <b>${perimeter} units</b>.<br>` +
      `<span class="dimline">Same area, different perimeter. ${rectIndex === 0 ? "Long and thin has the longest perimeter." : rectIndex === 2 ? "Closest to a square has the shortest perimeter." : "Try the others."}</span>`;
  };
  onPick(el, (id) => {
    rectIndex = +id;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  twelve: gridRow([rectCells(1, 5), rectCells(2, 4), rectCells(3, 3)], { letters: true, label: "Rectangle" }),
};
const STEPS = [
  {
    title: "Area or perimeter?",
    widget: wJob,
    body: "<p><b>Area</b> is the space inside a shape, counted in square units. <b>Perimeter</b> is the distance around it, counted in units. A job that covers a shape needs its area. A job that goes around the edge needs its perimeter.</p><p>Pick a job, then pick the measure it needs.</p>",
    check: {
      kind: "mc",
      q: "Jada covers a bulletin board with paper. Does Jada need the area or the perimeter of the board?",
      choices: [
        { id: "a", label: "The area" },
        { id: "b", label: "The perimeter" },
      ],
      answer: "a",
      why: { b: "Perimeter is the length around the edge. The paper covers the inside." },
      explain: "The paper covers the whole board, so it’s the area.",
    },
  },
  {
    title: "Same perimeter, different area",
    widget: wSamePerimeter,
    body: "<p>Rectangles can have the same perimeter but different areas. With a perimeter of 16 units, the length and the width always add to 8: half the perimeter.</p><p>Change the length and watch the area.</p>",
    check: {
      kind: "mc",
      q: "These rectangles all have a perimeter of 12 units. Which one has the biggest area?",
      fig: F.twelve,
      choices: [
        { id: "a", label: "Rectangle A" },
        { id: "b", label: "Rectangle B" },
        { id: "c", label: "Rectangle C" },
      ],
      answer: "c",
      why: {
        a: "Rectangle A is 5 by 1: its area is 5 square units.",
        b: "Rectangle B is 4 by 2: its area is 8 square units.",
      },
      explain: "Rectangle C is 3 by 3: its area is 9 square units, the biggest.",
    },
  },
  {
    title: "Same area, different perimeter",
    widget: wSameArea,
    body: "<p>Rectangles can have the same area but different perimeters. Each of these covers 12 squares, but they go around different distances.</p><p>Pick each rectangle and compare the perimeters.</p>",
    check: {
      kind: "num",
      q: "A rectangle has an area of 16 square units. It is 2 units wide. What is its perimeter?",
      answer: 20,
      unit: "units",
      misc: [
        [16, "That’s the area. First find the length: 2 × 8 = 16, so it’s 8 long."],
        [10, "That’s one length and one width. Go all the way around."],
      ],
      explain: "2 × 8 = 16, so it’s 8 units long. 8 + 2 + 8 + 2 = 20 units.",
    },
  },
];
