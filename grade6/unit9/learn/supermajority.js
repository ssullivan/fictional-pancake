/* Learn Putting It All Together (Grade 6 Unit 9), chapter 4: Majorities and who decides. Its widgets and steps; loaded by
   supermajority.html. */
/* the rules a vote can need: more than half, or at least a fraction of the votes (num/den) */
const RULES = [
  { id: "half", label: "More than half" },
  { id: "23", label: "At least 2/3", frac: [2, 3], name: "2/3" },
  { id: "55", label: "At least 55%", frac: [11, 20], name: "55%" },
  { id: "34", label: "At least 3/4", frac: [3, 4], name: "3/4" },
];
/* Pick a rule, the number of voters, and the yes votes: does it pass, and what's the fewest that would? */
function wRule(el) {
  const q = Q(el),
    values = { voters: 30, yes: 18 };
  let ruleId = "23";
  el.innerHTML =
    seg(
      "Rule",
      RULES.map((r) => [r.id, r.label]),
    ) +
    `<div class="wrow">${stepper("voters", "Voters")}${stepper("yes", "Yes votes")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const limits = { voters: [10, 60], yes: [0, 30] };
  const draw = () => {
    const rule = RULES.find((r) => r.id === ruleId),
      { voters, yes } = values,
      exact = rule.frac ? (voters * rule.frac[0]) / rule.frac[1] : voters / 2,
      /* the fewest whole votes that meet the rule: round a fraction up; more than half is one more than half, rounded down */
      need = rule.frac ? Math.ceil(exact - 1e-9) : Math.floor(voters / 2) + 1,
      passes = yes >= need;
    press(el, ruleId);
    q("voters").textContent = voters;
    q("yes").textContent = yes;
    q("f").innerHTML = classFig(voters, yes, { label: `${yes} yes votes of ${voters}` });
    const needText = rule.frac
      ? `${rule.name} of ${voters} is ${fmt(exact)}${Number.isInteger(exact) ? "" : `. Votes come in wholes, so round up`}: it takes at least <b>${need}</b> yes votes.`
      : `Half of ${voters} is ${fmt(exact)}, so more than half is at least <b>${need}</b> yes votes.`;
    q("r").innerHTML =
      `${needText} ` +
      (passes
        ? `<span class="ok">${yes} yes votes: it passes.</span>`
        : `<span class="no">${yes} yes votes: it fails, ${need - yes} short.</span>`);
  };
  onPick(el, (id) => {
    ruleId = id;
    draw();
  });
  /* the yes votes can't be more than the voters */
  steppers(el, values, limits, () => {
    limits.yes[1] = values.voters;
    values.yes = Math.min(values.yes, values.voters);
    draw();
  });
  draw();
}

/* the steps, from the whole town down: what each group is, and its starting percent of the group before it */
const LEVELS = [
  { k: "sub", label: "Subscribe", name: "subscribers", start: 25 },
  { k: "vote", label: "Voted", name: "voters", start: 20 },
  { k: "like", label: "Chose Darnell’s", name: "chose Darnell’s", start: 80 },
];
/* Change the three percents: the percent of the whole town is a percent of a percent of a percent. Steppers count in 5s. */
function wDecided(el) {
  const q = Q(el),
    fives = Object.fromEntries(LEVELS.map((l) => [l.k, l.start / 5]));
  el.innerHTML =
    `<div class="wrow">${LEVELS.map((l) => stepper(l.k, l.label)).join("")}</div>` +
    `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const percents = LEVELS.map((l) => fives[l.k] * 5),
      /* out of 100 people in town: each group is its percent of the group before it */
      counts = percents.reduce((list, p) => [...list, (list[list.length - 1] * p) / 100], [100]).slice(1),
      town = counts[counts.length - 1];
    LEVELS.forEach((l, i) => (q(l.k).textContent = `${percents[i]}%`));
    q("f").innerHTML = nestBars(
      [{ name: "the town", part: 1 }, ...LEVELS.map((l, i) => ({ name: l.name, part: percents[i] / 100 }))],
      { label: "The town, its subscribers, the voters, and who chose Darnell’s" },
    );
    q("e").textContent = `${percents.map((p) => `${p}%`).join(" of ")} = ${fmt(town)}% of the town`;
    q("r").innerHTML =
      `Out of 100 people in town: ${fmt(counts[0])} subscribe, ${fmt(counts[1])} of them vote, and ${fmt(counts[2])} of those choose Darnell’s. ` +
      `Darnell’s sign says “${percents[2]}% say we’re the best,” but only <b>${fmt(town)}%</b> of the town said so.`;
  };
  steppers(el, fives, Object.fromEntries(LEVELS.map((l) => [l.k, [1, 20]])), draw);
  draw();
}

const STEPS = [
  {
    title: "Majorities and supermajorities",
    widget: wRule,
    body: "<p>A <b>majority</b> is more than half the votes. Some big decisions need a <b>supermajority</b>, like at least 2/3 or at least 55% of the votes. Votes come in wholes, so when the share isn’t a whole number, round <b>up</b>: one vote short doesn’t pass.</p><p>Pick a rule, then change the votes.</p>",
    check: {
      kind: "num",
      q: "A rule needs at least 2/3 of the votes to pass. 40 students vote. What is the fewest yes votes that will pass it?",
      answer: 27,
      unit: "votes",
      misc: [
        [26, "26 is less than 2/3 of 40, which is 26.67. Round up to pass the rule."],
        [21, "21 is just more than half. This rule needs at least 2/3."],
        [13, "That’s how many could vote no. The question asks for yes votes."],
      ],
      explain: "2/3 of 40 is 26.67, and votes come in wholes, so it takes 27 yes votes.",
    },
  },
  {
    title: "Who really decided?",
    widget: wDecided,
    body: "<p>A town newspaper held a contest for the best restaurant, and only its subscribers could vote. Darnell’s won 80% of the votes. But 80% of the <i>voters</i> isn’t 80% of the <i>town</i>: take each percent of the group before it.</p><p>Change the percents.</p>",
    check: {
      kind: "num",
      q: "40% of the students voted for a field trip, and 75% of the voters chose the zoo. What percent of all the students chose the zoo?",
      answer: 30,
      unit: "%",
      misc: [
        [75, "75% of the <i>voters</i>, not of all the students. Most of them didn’t vote."],
        [40, "That’s the percent who voted. Take 75% of them."],
        [115, "Percents of different groups don’t add. Take 75% of the 40%."],
      ],
      explain: "Out of 100 students, 40 voted, and 75% of 40 is 30. So 30% of all the students chose the zoo.",
    },
  },
];
