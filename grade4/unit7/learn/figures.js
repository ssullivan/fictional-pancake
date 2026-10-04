/* Learn Angles and Angle Measurement (Grade 4 Unit 7), chapter 1: Points, lines, rays, and segments. Its widgets and steps; loaded by figures.html. */
/* the four figures: [kind, what it is] */
const KINDS = [
  ["point", "A <b>point</b> is an exact location. It has no length. Name it with a letter: point A."],
  [
    "segment",
    "A <b>segment</b> is part of a line with two endpoints. Name it with its endpoints, in either order: segment AB or segment BA.",
  ],
  [
    "ray",
    "A <b>ray</b> starts at one point and goes on forever in one direction. Name it starting from its endpoint: ray AB starts at A and goes through B.",
  ],
  [
    "line",
    "A <b>line</b> goes on forever in both directions, shown with arrows at both ends. Name it with any two of its points: line AB or line BA.",
  ],
];
/* Pick point, segment, ray, or line: see it drawn, and how it's named. */
function wKinds(el) {
  const q = Q(el);
  let kind = "segment";
  el.innerHTML =
    seg(
      "Figure",
      KINDS.map(([id]) => [id, id[0].toUpperCase() + id.slice(1)]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    press(el, kind);
    q("f").innerHTML = geoFig(kind, { tilt: 15 });
    q("r").innerHTML = KINDS.find(([id]) => id === kind)[1];
  };
  onPick(el, (m) => {
    kind = m;
    draw();
  });
  draw();
}
/* rays to name: [button, the two letters in the ray's name, which way it points] */
const RAYS = [
  ["Ray AB", ["A", "B"], 0],
  ["Ray BA", ["B", "A"], 180],
  ["Ray PQ", ["P", "Q"], 60],
];
/* Pick a ray's name: the ray starts at its first letter and goes through its second. */
function wNames(el) {
  const q = Q(el);
  let rayIndex = 0;
  el.innerHTML =
    seg(
      "Ray",
      RAYS.map(([name], i) => [i, name]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [name, [start, through], tilt] = RAYS[rayIndex];
    press(el, rayIndex);
    q("f").innerHTML = geoFig("ray", { names: [start, through], tilt, label: `${name}, starting at ${start}` });
    q("r").innerHTML =
      `<b>${name}</b> starts at ${start} and goes through ${through}, on forever past it. The first letter is always the endpoint, so ray ${through}${start} would point the other way.`;
  };
  onPick(el, (m) => {
    rayIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Points, segments, rays, and lines",
    widget: wKinds,
    body: "<p>Lines, rays, and segments are all straight. What makes them different is where they stop: a segment stops at both ends, a ray at one end, and a line at neither.</p><p>Pick a figure to see it.</p>",
    check: {
      kind: "mc",
      q: "Which one is a ray?",
      choices: [
        { id: "a", label: geoFig("segment", { names: ["C", "D"] }) },
        { id: "b", label: geoFig("ray", { names: ["C", "D"] }) },
        { id: "c", label: geoFig("line", { names: ["C", "D"] }) },
      ],
      answer: "b",
      why: {
        a: "That stops at both C and D: it’s a segment.",
        c: "That goes on forever both ways: it’s a line.",
      },
      explain: "A ray starts at one point and goes on forever in one direction: one endpoint and one arrow.",
    },
  },
  {
    title: "Name a ray",
    widget: wNames,
    body: "<p>The order of the letters matters for a ray. Its name starts with its endpoint, then a point it goes through. For segments and lines, either order works.</p><p>Pick a ray to see where it starts.</p>",
    check: {
      kind: "mc",
      q: "Ray PQ starts at which point?",
      choices: [
        { id: "a", label: "Point P" },
        { id: "b", label: "Point Q" },
        { id: "c", label: "It has no endpoint" },
      ],
      answer: "a",
      why: {
        b: "Ray PQ goes through Q. Its name starts with its endpoint: P.",
        c: "A line has no endpoint. A ray has one, where it starts.",
      },
      explain: "A ray’s name starts with its endpoint, so ray PQ starts at P and goes through Q.",
    },
  },
];
