/* Learn Introducing Multiplication (Grade 3 Unit 1), chapter 5: Expressions and equations. Its widgets and steps; loaded by expressions.html. */
/* stories of g groups with n in each: what the groups and things are */
const EXS = [
  { g: 4, n: 5, groups: "bags", things: "apples" },
  { g: 3, n: 8, groups: "spiders", things: "legs" },
  { g: 2, n: 5, groups: "hands", things: "fingers" },
  { g: 6, n: 4, groups: "cars", things: "wheels" },
];
/* Pick a story to see it as a multiplication expression; a button finds its product. */
function wExpr(el) {
  /* shown: the product has been found */
  const q = Q(el);
  let storyIndex = 0,
    shown = false;
  el.innerHTML =
    seg(
      "Story",
      EXS.map((story, i) => [i, `${story.g} ${story.groups}`]),
    ) +
    `<div class="fig" data-f></div><p class="eq" data-e></p><div class="wrow"><button type="button" class="btn" data-go>Find the product</button></div><p class="readout" data-o></p>`;
  const draw = () => {
    const { g: groupCount, n: perGroup, groups, things } = EXS[storyIndex],
      product = groupCount * perGroup;
    press(el, storyIndex);
    q("go").disabled = shown;
    q("f").innerHTML = groupsFig(groupCount, perGroup, {
      label: `${groupCount} ${groups} with ${perGroup} ${things} each`,
    });
    q("e").innerHTML = shown ? `${groupCount} × ${perGroup} = ${product}` : `${groupCount} × ${perGroup}`;
    q("o").innerHTML =
      `${groupCount} ${groups} with ${perGroup} ${things} each: <b>${groupCount} × ${perGroup}</b>.<br><span class="dimline">Say “${groupCount} times ${perGroup}”: ${groupCount} groups of ${perGroup}. ${groupCount} and ${perGroup} are the <b>factors</b>.</span>` +
      (shown
        ? `<br><span class="ok">${countBy(perGroup, groupCount)}. ${groupCount} × ${perGroup} = ${product}, so there are ${product} ${things}. ${product} is the <b>product</b>.</span>`
        : "");
  };
  q("go").onclick = () => {
    shown = true;
    draw();
  };
  el.addEventListener("click", (e) => {
    const storyBtn = e.target.closest("[data-m]");
    if (storyBtn) {
      storyIndex = +storyBtn.dataset.m;
      shown = false;
      draw();
    }
  });
  draw();
}
/* Steppers for groups and how many in each, and their equation, which a button writes either way around. */
function wEq(el) {
  /* the steppers' values: g groups, n in each; flip: write the product first */
  const q = Q(el),
    values = { g: 3, n: 4 };
  let flip = false;
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow">${stepper("g", "Groups")}${stepper("n", "In each group")}</div><p class="eq" data-e></p><div class="wrow"><button type="button" class="btn" data-go>Write it the other way</button></div><p class="readout" data-o></p>`;
  const draw = () => {
    const { g: groups, n: perGroup } = values,
      product = groups * perGroup;
    q("g").textContent = groups;
    q("n").textContent = perGroup;
    q("f").innerHTML = groupsFig(groups, perGroup);
    q("e").innerHTML = flip ? `${product} = ${groups} × ${perGroup}` : `${groups} × ${perGroup} = ${product}`;
    q("o").innerHTML =
      `${pl(groups, "group")} of ${perGroup} is ${product}.<br><span class="dimline">The = sign means both sides are worth the same, so ${groups} × ${perGroup} = ${product} and ${product} = ${groups} × ${perGroup} say the same thing.</span>`;
  };
  q("go").onclick = () => {
    flip = !flip;
    draw();
  };
  steppers(el, values, { g: [1, 5], n: [1, 10] }, draw);
  draw();
}
/* the quick checks' figures */
const F = {
  g35: groupsFig(3, 5, { label: "3 circles with 5 dots in each" }),
};
const STEPS = [
  {
    title: "Multiplication expressions",
    widget: wExpr,
    body: "<p>An <b>expression</b> like <b>4 × 5</b> means 4 groups of 5. The first number tells how many groups, and the second tells how many in each group. The numbers you multiply are <b>factors</b>, and the answer is the <b>product</b>.</p><p>Pick a story, then find the product.</p>",
    check: {
      kind: "mc",
      q: "Mai puts 3 flowers in each of 6 vases. Which expression matches the story?",
      choices: [
        { id: "a", label: "3 × 6" },
        { id: "b", label: "6 × 3" },
        { id: "c", label: "6 + 3" },
      ],
      answer: "b",
      why: {
        a: "That’s 3 groups of 6. There are 6 vases, with 3 flowers in each.",
        c: "That adds 3 to 6. For equal groups, multiply: 6 groups of 3.",
      },
      explain: "6 vases are 6 groups, with 3 flowers in each: 6 × 3.",
    },
  },
  {
    title: "Multiplication equations",
    widget: wEq,
    body: "<p>An <b>equation</b> uses an = sign to show that two things are worth the same, like <b>3 × 4 = 12</b>. It can be written either way around: 12 = 3 × 4.</p><p>Change the groups, then write the equation the other way.</p>",
    check: {
      kind: "mc",
      q: "Which equation matches the picture?",
      fig: F.g35,
      choices: [
        { id: "a", label: "3 + 5 = 8" },
        { id: "b", label: "15 = 3 × 5" },
        { id: "c", label: "5 = 3 × 15" },
      ],
      answer: "b",
      why: {
        a: "That adds a group and a count. The picture shows 3 groups of 5.",
        c: "15 is the total. It goes by itself on one side: 15 = 3 × 5.",
      },
      explain: "3 groups of 5 is 15. 15 = 3 × 5 says the same thing as 3 × 5 = 15.",
    },
  },
];
