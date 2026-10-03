/* Learn Area & Surface Area (Grade 6 Unit 1), chapter 3: Triangles. Its widgets and steps; loaded by triangles.html. */
/* turn a copy of a triangle half a turn about the middle of its slanted side: the two make a parallelogram.
   SETS: [base, height, the top corner's x] */
function wTriCopy(el) {
  const q = Q(el),
    SETS = [
      [6, 4, 2],
      [6, 3, 5],
      [4, 4, 1],
      [5, 4, -1],
    ];
  let setIndex = 0;
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow"><label class="slider">Turn the copy <input type="range" min="0" max="100" value="0" data-s></label><button type="button" class="ghost-btn" data-n>New triangle</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* M: the slanted side's middle, the turn's center; r: how far the triangle reaches from it, so the plane fits every turn */
    const [b, h, c] = SETS[setIndex],
      progress = q("s").value / 100,
      M = [(b + c) / 2, h / 2],
      r = Math.max(Math.hypot(...M), Math.hypot(b - M[0], M[1]));
    const xmin = Math.floor(Math.min(0, c, M[0] - r)),
      xmax = Math.ceil(Math.max(b, c, M[0] + r)),
      ymin = Math.floor(M[1] - r),
      ymax = Math.ceil(Math.max(h, M[1] + r));
    const P = plane({ xmin, xmax, ymin, ymax, u: Math.min(34, 440 / (xmax - xmin)) }),
      angle = Math.PI * progress;
    /* a point turned by angle about M */
    const rot = ([x, y]) => {
      const dx = x - M[0],
        dy = y - M[1];
      return [M[0] + dx * Math.cos(angle) - dy * Math.sin(angle), M[1] + dx * Math.sin(angle) + dy * Math.cos(angle)];
    };
    const triangle = [
      [0, 0],
      [b, 0],
      [c, h],
    ];
    const markup =
      P.grid() +
      P.poly(triangle.map(rot), "sh-b") +
      P.poly(triangle, "sh-a") +
      heightMark(P, c, h, 0, b) +
      `<circle class="pt" cx="${P.X(M[0])}" cy="${P.Y(M[1])}" r="4"/>` +
      P.text(b / 2, 0, `${b}`, "lbl", 0, 16) +
      (c < (b + c) / 3 ? P.text(c, h / 2, `${h}`, "lbl en", -8) : P.text(c, h / 2, `${h}`, "lbl st", 8));
    q("f").innerHTML = P.svg(markup, `Triangle with base ${b} and height ${h}, and a turning copy`);
    q("r").innerHTML =
      progress === 1
        ? `<span class="ok">Two copies make a parallelogram: ${b} × ${h} = ${b * h}. One triangle is half of that: <b>${(b * h) / 2}</b> square units.</span>`
        : `Turn the blue copy around the dot in the middle of the slanted side.`;
  };
  q("s").addEventListener("input", draw);
  q("n").onclick = () => {
    setIndex = (setIndex + 1) % SETS.length;
    q("s").value = 0;
    draw();
  };
  draw();
}
/* slide the top corner along a line: base and height stay 6 and 4, so the area stays 12 */
function wTriApex(el) {
  const q = Q(el),
    P = plane({ xmin: -3, xmax: 9, ymax: 4, u: 34 });
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow"><label class="slider">Slide the top corner <input type="range" min="-3" max="9" step="0.5" value="2" data-s></label></div><p class="readout" data-r></p>`;
  const draw = () => {
    const c = +q("s").value,
      out = c < 0 || c > 6;
    const markup =
      P.grid() +
      P.line([-3, 4], [9, 4], "ext") +
      P.poly(
        [
          [0, 0],
          [6, 0],
          [c, 4],
        ],
        "sh-a",
      ) +
      heightMark(P, c, 4, 0, 6) +
      P.text(3, 0, "6", "lbl", 0, 16) +
      (c < (6 + c) / 3 ? P.text(c, 2, "4", "lbl en", -8) : P.text(c, 2, "4", "lbl st", 8));
    q("f").innerHTML = P.svg(markup, "Triangle with base 6 and height 4");
    q("r").innerHTML =
      `Base <b>6</b> · Height <b>4</b> · Area = ½ × 6 × 4 = <b>12</b> square units${out ? '<br><span class="dimline">The height lands outside the triangle, so the base is extended with a dotted line.</span>' : ""}`;
  };
  q("s").addEventListener("input", draw);
  draw();
}
/* the quick checks' figures */
const F = {};
{
  const P = plane({ xmax: 8, ymax: 5, u: 40 });
  F.tri85 = P.svg(
    P.grid() +
      P.poly(
        [
          [0, 0],
          [8, 0],
          [3, 5],
        ],
        "sh-a",
      ) +
      heightMark(P, 3, 5, 0, 8) +
      P.text(4, 0, "8", "lbl", 0, 16) +
      P.text(3, 2.5, "5", "lbl st", 8),
    "Triangle with base 8 and height 5",
  );
}
{
  const P = plane({ xmax: 16, ymax: 3, u: 28 });
  F.threeTri = P.svg(
    P.grid() +
      P.poly(
        [
          [0, 0],
          [4, 0],
          [1, 3],
        ],
        "sh-a",
      ) +
      P.poly(
        [
          [5, 0],
          [9, 0],
          [9, 3],
        ],
        "sh-b",
      ) +
      P.poly(
        [
          [10, 0],
          [14, 0],
          [15.5, 3],
        ],
        "sh-c",
      ) +
      P.text(2, 0, "A", "lbl", 0, 14) +
      P.text(7, 0, "B", "lbl", 0, 14) +
      P.text(12, 0, "C", "lbl", 0, 14),
    "Three triangles, A, B, and C, on the same grid",
  );
}
{
  const P = plane({ xmax: 7, ymax: 5, u: 40 });
  F.obtuse = P.svg(
    P.grid() +
      P.poly(
        [
          [0, 0],
          [4, 0],
          [7, 5],
        ],
        "sh-a",
      ) +
      heightMark(P, 7, 5, 0, 4) +
      P.text(2, 0, "4", "lbl", 0, 16) +
      P.text(7, 2.5, "5", "lbl en", -10),
    "A leaning triangle with base 4 and height 5, drawn outside the triangle",
  );
}
const STEPS = [
  {
    title: "A triangle is half a parallelogram",
    widget: wTriCopy,
    body: "<p>Make a copy of any triangle and turn it around. The two copies fit together into a parallelogram.</p><p>So a triangle’s area is <b>½ × base × height</b>.</p>",
    check: {
      kind: "num",
      unit: "square units",
      answer: 20,
      fig: F.tri85,
      q: "What is the area of this triangle?",
      misc: [
        [40, "8 × 5 = 40 is the whole parallelogram. A triangle is half of it."],
        [13, "Multiply the base and height, then take half."],
      ],
      explain: "½ × 8 × 5 = ½ × 40 = 20 square units.",
    },
  },
  {
    title: "Slide the top corner",
    widget: wTriApex,
    body: "<p>Slide the top corner left and right, staying at the same height. The base stays 6 and the height stays 4, so the area never changes, even when the triangle leans way over.</p>",
    check: {
      kind: "mc",
      fig: F.threeTri,
      q: "Which triangle has the <b>most</b> area?",
      choices: [
        { id: "A", label: "A" },
        { id: "B", label: "B" },
        { id: "C", label: "C" },
        { id: "S", label: "All the same" },
      ],
      answer: "S",
      why: {
        A: "Count the grid squares: every triangle has base 4 and height 3.",
        B: "B looks different because it has a right angle, but its base is 4 and its height is 3, like the others.",
        C: "C leans the most, but its base is still 4 and its height is still 3.",
      },
      explain: "All three have base 4 and height 3, so each area is ½ × 4 × 3 = 6 square units.",
    },
  },
  {
    title: "Heights outside the triangle",
    body: "<p>For a triangle that leans past its base, the height lands outside. Extend the base with a dotted line and measure straight up from it to the top corner.</p>",
    check: {
      kind: "num",
      unit: "square units",
      answer: 10,
      fig: F.obtuse,
      q: "What is the area of this triangle?",
      misc: [
        [20, "That’s the whole parallelogram. Take half: ½ × 4 × 5."],
        [17.5, "The base is only 4. The dotted part is just an extension of the base line."],
      ],
      explain: "Base 4, height 5 (measured outside the triangle): ½ × 4 × 5 = 10 square units.",
    },
  },
];
