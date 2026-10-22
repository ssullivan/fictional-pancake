/* Learn Expressions, Equations, and Inequalities (Grade 7 Unit 6), chapter 1: Tape diagrams and equations. Its widgets and
   steps; loaded by tape-diagrams.html. */
const x = mathVar("x");
/* Pick a kind of tape and change x: 3 equal parts plus 4, or 3 equal groups of x and 4, and the total each makes. */
function wTape(el) {
  const q = Q(el),
    p = 3,
    add = 4,
    values = { xv: 5 };
  let groups = false;
  el.innerHTML =
    seg("Kind", [
      ["sum", "3 parts plus 4"],
      ["groups", "3 groups of x and 4"],
    ]) +
    `<div class="wrow">${stepper("xv", "x")}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { xv } = values,
      total = groups ? p * (xv + add) : p * xv + add;
    press(el, groups ? "groups" : "sum");
    q("xv").textContent = xv;
    q("f").innerHTML = tapeFor(p, add, total, { groups, show: true, value: xv });
    q("e").innerHTML = groups ? `${p}(${lin(1, add)}) = ${total}` : `${lin(p, add)} = ${total}`;
    q("r").innerHTML = groups
      ? `Each group is ${x} + ${add} = ${xv + add}, and there are ${p} groups: ${p} × ${xv + add} = <b>${total}</b>. The ${add} is counted ${p} times.`
      : `${p} parts of ${xv} are ${p * xv}, plus ${add} once: <b>${total}</b>. The ${add} is counted once.`;
  };
  steppers(el, values, { xv: [1, 9] }, draw);
  onPick(el, (id) => {
    groups = id === "groups";
    draw();
  });
  draw();
}

/* stories and their tapes: [label, story, groups?, p, q, r] */
const STORIES = [
  ["Notebooks", "Elena buys 4 notebooks that cost the same and a $3 pen, $23 in all.", false, 4, 3, 23],
  ["Snacks", "4 friends each buy a sandwich and a $3 drink, $32 in all.", true, 4, 3, 32],
  ["Plant", "A 5 cm plant grows the same amount each week for 3 weeks, to 20 cm.", false, 3, 5, 20],
  ["Bags", "3 bags each hold some apples and 5 pears, 27 pieces of fruit in all.", true, 3, 5, 27],
];
/* Pick a story: one extra amount makes px + q = r; an extra amount in every group makes p(x + q) = r. */
function wStory(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Story",
      STORIES.map(([label], i) => [i, label]),
    ) +
    `<p class="story" data-s></p><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [, story, groups, p, add, total] = STORIES[index];
    press(el, index);
    q("s").textContent = story;
    q("f").innerHTML = tapeFor(p, add, total, { groups });
    q("e").innerHTML = groups ? `${p}(${lin(1, add)}) = ${total}` : `${lin(p, add)} = ${total}`;
    q("r").innerHTML = groups
      ? `The ${add} comes with <b>every</b> group, so it goes inside the parentheses.`
      : `The ${add} is there only <b>once</b>, so it’s added once.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "Two kinds of tape diagrams",
    widget: wTape,
    body: `<p>A tape diagram shows an equation. Some equal parts plus one more amount is <b>px + q = r</b>. Equal groups, each with an unknown and an extra amount, is <b>p(x + q) = r</b>.</p><p>Pick a kind and change ${x}.</p>`,
    check: {
      kind: "mc",
      q: "A tape has 5 equal groups, and each group is an unknown and 2 more. The whole tape is 35. Which equation matches?",
      choices: [
        { id: "a", label: `5${x} + 2 = 35` },
        { id: "b", label: `5(${x} + 2) = 35` },
        { id: "c", label: `${x} + 2 = 35` },
      ],
      answer: "b",
      why: {
        a: "That adds 2 just once. Every group has its own 2.",
        c: "That’s one group. There are 5 of them.",
      },
      explain: `5 groups of (${x} + 2) make 35: 5(${x} + 2) = 35.`,
    },
  },
  {
    title: "Stories and equations",
    widget: wStory,
    body: "<p>To write an equation for a story, ask whether the extra amount happens once or in every group. Once gives px + q = r; every group gives p(x + q) = r.</p><p>Pick a story.</p>",
    check: {
      kind: "mc",
      q: "Noah buys 6 tickets that cost the same and pays a $4 fee once. The total is $46. Which equation fits?",
      choices: [
        { id: "a", label: `6(${x} + 4) = 46` },
        { id: "b", label: `6${x} + 4 = 46` },
        { id: "c", label: `10${x} = 46` },
      ],
      answer: "b",
      why: {
        a: "That charges the $4 fee with every ticket. It’s paid once.",
        c: "6 tickets and a $4 fee isn’t 10 tickets: the 4 is dollars, not tickets.",
      },
      explain: `6 tickets at ${x} dollars each, plus $4 once: 6${x} + 4 = 46.`,
    },
  },
];
