/* Learn Area & Surface Area (Grade 6 Unit 1), chapter 1: What is area?. Its widgets and steps; loaded by area.html. */
/* tile an outlined shape: tap a square to place or remove a tile; Place a square fills the next one in order */
function wTile(el) {
  const q = Q(el),
    cells = [
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 1],
      [1, 2],
      [2, 2],
      [3, 2],
    ];
  const key = (x, y) => x + "," + y,
    inShape = new Set(cells.map((c) => key(...c))),
    placed = new Set(),
    P = plane({ xmax: 8, ymax: 4, u: 44 });
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-one>Place a square</button><button type="button" class="ghost-btn" data-clr>Clear</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    let markup = P.grid();
    const size = P.u;
    cells.forEach(([x, y]) => {
      const k = key(x, y);
      markup += placed.has(k)
        ? `<rect class="tile" data-k="${k}" x="${P.X(x) + 3}" y="${P.Y(y + 1) + 3}" width="${size - 6}" height="${size - 6}" rx="3"/>`
        : `<rect class="hit" data-k="${k}" x="${P.X(x)}" y="${P.Y(y + 1)}" width="${size}" height="${size}"/>`;
    });
    /* the outline: each cell's sides that don't touch another cell of the shape */
    cells.forEach(([x, y]) =>
      [
        [0, -1, [x, y], [x + 1, y]],
        [0, 1, [x, y + 1], [x + 1, y + 1]],
        [-1, 0, [x, y], [x, y + 1]],
        [1, 0, [x + 1, y], [x + 1, y + 1]],
      ].forEach(([dx, dy, a, b]) => {
        if (!inShape.has(key(x + dx, y + dy))) markup += P.line(a, b, "edge");
      }),
    );
    q("f").innerHTML = P.svg(markup, "An outlined shape on a grid. Tap squares to tile it.");
    q("r").innerHTML =
      placed.size === cells.length
        ? `<span class="ok">Covered with no gaps and no overlaps! It took <b>${cells.length}</b> unit squares, so the area is ${cells.length} square units.</span>`
        : `Squares placed: <b>${placed.size}</b>`;
  };
  q("f").addEventListener("click", (e) => {
    const k = e.target.dataset && e.target.dataset.k;
    if (!k) return;
    placed.has(k) ? placed.delete(k) : placed.add(k);
    draw();
  });
  q("one").onclick = () => {
    const next = cells.find((c) => !placed.has(key(...c)));
    if (next) {
      placed.add(key(...next));
      draw();
    }
  };
  q("clr").onclick = () => {
    placed.clear();
    draw();
  };
  draw();
}
/* slide a piece of the shape into a gap: the area stays 18 */
function wSlide(el) {
  const q = Q(el),
    P = plane({ xmax: 6, ymax: 4, u: 46 });
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow"><label class="slider">Slide the gold piece <input type="range" min="0" max="100" value="0" data-s></label></div><p class="readout" data-r></p>`;
  const draw = () => {
    const progress = q("s").value / 100,
      dx = -4 * progress,
      dy = -3 * progress;
    const main = [
        [2, 0],
        [6, 0],
        [6, 3],
        [0, 3],
        [0, 1],
        [2, 1],
      ],
      bump = [
        [4, 3],
        [6, 3],
        [6, 4],
        [4, 4],
      ].map(([x, y]) => [x + dx, y + dy]);
    const markup =
      P.grid() +
      P.poly(
        [
          [0, 0],
          [2, 0],
          [2, 1],
          [0, 1],
        ],
        "ghost",
      ) +
      P.poly(main, "sh-b") +
      P.text(3.5, 1.9, "16") +
      P.poly(bump, "sh-a") +
      P.text(5 + dx, 3.5 + dy, "2");
    q("f").innerHTML = P.svg(markup, "A shape with a piece that slides into a gap");
    q("r").innerHTML =
      progress === 1
        ? `<span class="ok">Now it’s a 6 × 3 rectangle: 6 × 3 = <b>18</b> square units. Same area as before!</span>`
        : `Area: 16 + 2 = <b>18</b> square units`;
  };
  q("s").addEventListener("input", draw);
  draw();
}
/* one shape's area two ways: split into pieces and added, or framed and subtracted */
function wTwoWays(el) {
  const q = Q(el),
    P = plane({ xmax: 6, ymax: 4, u: 46 }),
    shape = [
      [0, 0],
      [6, 0],
      [6, 2],
      [4, 4],
      [0, 4],
    ];
  let method = "split";
  el.innerHTML = `<div class="seg" role="group" aria-label="Method"><button type="button" data-m="split">Split it</button><button type="button" data-m="frame">Frame it</button></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    let markup = P.grid(),
      message;
    if (method === "split") {
      markup +=
        P.poly(
          [
            [0, 0],
            [4, 0],
            [4, 4],
            [0, 4],
          ],
          "sh-a",
        ) +
        P.poly(
          [
            [4, 0],
            [6, 0],
            [6, 2],
            [4, 2],
          ],
          "sh-b",
        ) +
        P.poly(
          [
            [4, 2],
            [6, 2],
            [4, 4],
          ],
          "sh-c",
        ) +
        P.text(2, 2, "16") +
        P.text(5, 1, "4") +
        P.text(4.62, 2.62, "2", "lbl s");
      message =
        "Split: 4 × 4 = 16, 2 × 2 = 4, and the triangle is half of a 2 × 2 square, so 2. <b>16 + 4 + 2 = 22</b> square units.";
    } else {
      markup +=
        P.poly(
          [
            [0, 0],
            [6, 0],
            [6, 4],
            [0, 4],
          ],
          "ghost",
        ) +
        P.poly(shape, "sh-a") +
        P.poly(
          [
            [6, 2],
            [6, 4],
            [4, 4],
          ],
          "sh-c cut",
        ) +
        P.text(2.5, 2, "shape") +
        P.text(5.35, 3.35, "2", "lbl s");
      message =
        "Frame: 6 × 4 = 24. Take away the corner triangle (half of a 2 × 2 square = 2). <b>24 − 2 = 22</b> square units.";
    }
    q("f").innerHTML = P.svg(
      markup,
      method === "split"
        ? "The shape split into a square, a rectangle, and a triangle"
        : "The shape inside a 6 by 4 rectangle",
    );
    q("r").innerHTML = message + '<br><span class="dimline">Both ways give the same area.</span>';
    el.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.m === method));
  };
  el.querySelectorAll("[data-m]").forEach(
    (b) =>
      (b.onclick = () => {
        method = b.dataset.m;
        draw();
      }),
  );
  draw();
}
/* the quick checks' figures */
const F = {};
{
  const P = plane({ xmax: 5, ymax: 3, u: 44 });
  F.rect53 = P.svg(P.grid() + P.poly(Rect(0, 0, 5, 3), "sh-a"), "A 5 by 3 rectangle on a grid");
}
{
  const P = plane({ xmax: 5, ymax: 4, u: 42 });
  F.notch = P.svg(
    P.grid() +
      P.poly(
        [
          [0, 0],
          [5, 0],
          [5, 4],
          [3, 4],
          [3, 3],
          [1, 3],
          [1, 4],
          [0, 4],
        ],
        "sh-a",
      ),
    "A 5 by 4 rectangle with a 2 by 1 notch cut from the top",
  );
}
const STEPS = [
  {
    title: "Cover it with squares",
    widget: wTile,
    body: "<p>The <b>area</b> of a shape is the number of unit squares it takes to cover it, with no gaps and no overlaps.</p><p>Tap each square inside the outline to tile the shape.</p>",
    check: {
      kind: "num",
      unit: "square units",
      answer: 15,
      fig: F.rect53,
      q: "How many unit squares cover this rectangle?",
      misc: [
        [8, "That’s 5 + 3, the two side lengths added. Count the squares inside: 3 rows of 5."],
        [16, "That’s the distance around the outside (perimeter). Area counts the squares inside."],
      ],
      explain: "3 rows of 5 squares: 3 × 5 = 15 square units.",
    },
  },
  {
    title: "Cut and move: same area",
    widget: wSlide,
    body: "<p>Cut a shape into pieces and move them around without overlapping, and the area stays the same. Every piece is still there.</p><p>Slide the gold piece into the gap.</p>",
    check: {
      kind: "mc",
      q: "Andre cuts a paper shape into two pieces and tapes them together a new way, with no gaps or overlaps. What happens to the area?",
      choices: [
        { id: "up", label: "It gets bigger" },
        { id: "down", label: "It gets smaller" },
        { id: "same", label: "It stays the same" },
      ],
      answer: "same",
      why: {
        up: "No paper was added. The same pieces cover the same number of squares.",
        down: "No paper was lost. The same pieces cover the same number of squares.",
      },
      explain: "Moving pieces changes the shape, not the amount of space it covers.",
    },
  },
  {
    title: "Two ways to find area",
    widget: wTwoWays,
    body: "<p><b>Split it:</b> cut the shape into pieces you know, then add. <b>Frame it:</b> draw a rectangle around it, then subtract the parts that aren’t in the shape.</p><p>Try both buttons.</p>",
    check: {
      kind: "num",
      unit: "square units",
      answer: 18,
      fig: F.notch,
      q: "A 5 × 4 rectangle has a notch cut out of the top. What is the area of the shape?",
      misc: [
        [20, "That’s the whole 5 × 4 rectangle. Subtract the notch."],
        [22, "The notch is missing, so subtract it instead of adding it."],
      ],
      explain: "Frame it: 5 × 4 = 20. The notch is 2 × 1 = 2. 20 − 2 = 18 square units.",
    },
  },
];
