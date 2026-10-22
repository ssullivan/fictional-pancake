/* Learn Angles, Triangles, and Prisms (Grade 7 Unit 7), chapter 2: Equations for angles. Its widgets and steps; loaded by
   angle-equations.html. */
const x = mathVar("x");
/* problems: [label, the rays and marks, the equation, the solving, x's value] */
const ANGLE_PROBLEMS = [
  {
    label: "x and 2x on a line",
    fig: () =>
      raysFig([[60, "b"]], {
        line: true,
        marks: [
          { from: 0, to: 60, text: `2<tspan class="mvt">x</tspan>`, r: 40 },
          { from: 60, to: 180, text: `<tspan class="mvt">x</tspan>`, r: 58 },
        ],
      }),
    equation: `2${x} + ${x} = 180`,
    solving: `3${x} = 180, so ${x} = 60. The angles are 120° and 60°.`,
  },
  {
    label: "x + 20 and 50 in a right angle",
    fig: () =>
      raysFig([[0], [50, "b"], [90]], {
        marks: [
          { from: 0, to: 90 },
          { from: 0, to: 50, text: "50°", r: 46 },
          { from: 50, to: 90, text: `<tspan class="mvt">x</tspan> + 20`, r: 64 },
        ],
      }),
    equation: `${x} + 20 + 50 = 90`,
    solving: `${x} + 70 = 90, so ${x} = 20. The angle is 40°.`,
  },
  {
    label: "3x and 45 vertical",
    fig: () => crossFig(45, { texts: ["45°", "", `3<tspan class="mvt">x</tspan>`, ""] }),
    equation: `3${x} = 45`,
    solving: `Vertical angles are equal, so 3${x} = 45 and ${x} = 15.`,
  },
];
/* Pick a problem: say what the angles add up to (or that they're equal), write the equation, and solve. */
function wEquation(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Problem",
      ANGLE_PROBLEMS.map((p, i) => [i, p.label]),
    ) + `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = (index) => {
    const problem = ANGLE_PROBLEMS[index];
    press(el, index);
    q("f").innerHTML = problem.fig();
    q("e").innerHTML = problem.equation;
    q("r").innerHTML = problem.solving;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "Writing and solving",
    widget: wEquation,
    body: "<p>To find an unknown angle, say what you know about the angles: they make a right angle, or a straight line, or they’re vertical angles. That gives an equation. Solve it, then put the value back in to find each angle.</p><p>Pick a problem.</p>",
    check: {
      kind: "num",
      q: `Two angles make a straight line. One is 3${x} and the other is ${x} + 20. What is ${x}?`,
      answer: 40,
      misc: [
        [17.5, "They make 180°, not 90°."],
        [53.33, `There are 4 ${x}s in all: 3${x} + ${x}. And take the 20 off first.`],
        [120, `That’s the angle 3${x}. The question asks for ${x}.`],
      ],
      explain: "3x + x + 20 = 180, so 4x = 160 and x = 40.",
    },
  },
];
