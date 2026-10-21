/* Learn Fractions as Quotients and Fraction Multiplication (Grade 5 Unit 2), chapter 1: Share sandwiches. Its widgets and
   steps; loaded by sharing.html. */
/* n/d as a fraction, then as a mixed number or whole number when it's more than 1: "5/3 = 1 2/3" (html) */
const asMixed = (n, d) => (n > d ? `${fr(n, d)} = ${mixed(n, d)}` : n === d ? `${fr(n, d)} = 1` : fr(n, d));
/* Share sandwiches among friends (steppers): every sandwich is cut into a piece for each friend, and one friend's pieces are gold. */
function wShare(el) {
  const q = Q(el),
    values = { sandwiches: 3, friends: 4 },
    limits = { sandwiches: [1, 6], friends: [2, 6] };
  el.innerHTML =
    `<div class="wrow">${stepper("sandwiches", "Sandwiches")}${stepper("friends", "Friends")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { sandwiches, friends } = values;
    q("sandwiches").textContent = sandwiches;
    q("friends").textContent = friends;
    q("f").innerHTML = sandwichFig(sandwiches, friends);
    q("r").innerHTML =
      `Cut each sandwich into ${friends} equal pieces, one for each friend. Each friend gets ${sandwiches} ${sandwiches === 1 ? "piece" : "pieces"} of ${fr(1, friends)} (gold): ` +
      `<b>${sandwiches} ÷ ${friends} = ${asMixed(sandwiches, friends)}</b> ${sandwiches <= friends ? "sandwich" : "sandwiches"}.`;
  };
  steppers(el, values, limits, draw);
  draw();
}
/* Read a ÷ b as a story, and see one person's share put together in fraction strips (steppers for a and b). */
function wEquation(el) {
  const q = Q(el),
    values = { top: 5, bottom: 3 },
    limits = { top: [1, 8], bottom: [2, 6] };
  el.innerHTML =
    `<div class="wrow">${stepper("top", "Shared")}${stepper("bottom", "People")}</div>` +
    `<p class="eq" data-e></p><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { top, bottom } = values;
    q("top").textContent = top;
    q("bottom").textContent = bottom;
    q("e").innerHTML = `${top} ÷ ${bottom} = ${fr(top, bottom)}`;
    q("f").innerHTML = strips([{ d: bottom, k: top }], {
      wholes: Math.max(1, Math.ceil(top / bottom)),
      label: `${top} pieces of 1/${bottom}`,
    });
    q("r").innerHTML =
      `${top} ${top === 1 ? "sandwich" : "sandwiches"} shared equally by ${bottom} people. Each gets ${top} ${top === 1 ? "piece" : "pieces"} of ${fr(1, bottom)}: ` +
      `<b>${asMixed(top, bottom)}</b>.`;
  };
  steppers(el, values, limits, draw);
  draw();
}
const STEPS = [
  {
    title: "Share sandwiches equally",
    widget: wShare,
    body: "<p>To share sandwiches equally, cut every sandwich into one piece for each friend. Each friend gets one piece of every sandwich. So 3 sandwiches shared by 4 friends gives each friend 3 pieces of 1/4: <b>3 ÷ 4 = 3/4</b>.</p><p>Change the sandwiches and the friends.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "2 sandwiches are shared equally by 5 friends. How much does each friend get?",
      fig: sandwichFig(2, 5, { cut: false, label: "2 sandwiches" }),
      answer: 2 / 5,
      unit: "sandwich",
      misc: [
        [5 / 2, "That’s 5 ÷ 2: 5 sandwiches shared by 2. Here 2 sandwiches are shared by 5 friends."],
        [1 / 5, "That’s one piece of one sandwich. Each friend gets a piece of both sandwiches: 2 pieces."],
      ],
      explain: "Cut each sandwich into 5 pieces. Each friend gets 2 pieces of 1/5: 2 ÷ 5 = 2/5 sandwich.",
    },
  },
  {
    title: "a ÷ b is a/b",
    widget: wEquation,
    body: "<p>Any division can be written as a fraction: <b>a ÷ b = a/b</b>. The top number is what’s shared, and the bottom number is how many share it. When more is shared than there are people, each gets more than 1.</p><p>Change the numbers and read the story.</p>",
    check: {
      kind: "mc",
      q: "Which story matches 5 ÷ 3 = 5/3?",
      answer: "b",
      choices: [
        { id: "a", label: "3 sandwiches shared equally by 5 friends" },
        { id: "b", label: "5 sandwiches shared equally by 3 friends" },
        { id: "c", label: "5 friends each get 3 sandwiches" },
      ],
      why: {
        a: "That’s 3 ÷ 5: the first number is what’s shared.",
        c: "That’s 5 × 3. The equation divides.",
      },
      explain: "5 ÷ 3: 5 sandwiches shared by 3 friends, so each gets 5/3 = 1 2/3 sandwiches.",
    },
  },
];
