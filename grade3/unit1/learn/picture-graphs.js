/* Learn Introducing Multiplication (Grade 3 Unit 1), chapter 1: Scaled picture graphs. Its widgets and steps; loaded by picture-graphs.html. */
/* how one row of a picture graph adds up (html), when each picture shows `scale` of the unit */
function rowWhy(row, scale, unit) {
  const whole = Math.floor(row.n / scale),
    half = row.n % scale;
  if (scale === 1)
    return `${row.label}: ${pl(whole, "picture")}, and each one shows 1 ${unit}. <b>${pl(row.n, unit)}</b>.`;
  return (
    `${row.label}: ${half ? `${whole} and a half pictures` : pl(whole, "picture")}. Each picture shows ${scale} ${unit}s${half ? `, and half a picture shows ${half}` : ""}.` +
    `<br>Count by ${scale}s: ${countBy(scale, whole)}${half ? `, and ${half} more` : ""}. <b>${pl(row.n, unit)}</b>.`
  );
}
const FRUIT = [
  { label: "Apples", n: 12, pic: "dot", c: "red" },
  { label: "Bananas", n: 7, pic: "dot", c: "yellow" },
  { label: "Grapes", n: 10, pic: "dot", c: "green" },
  { label: "Pears", n: 4, pic: "dot", c: "blue" },
];
/* Read a picture graph with each picture showing 1 or 2 votes; tap a row to see how it adds up. */
function wKey(el) {
  const q = Q(el);
  let scale = 2,
    tapped = -1;
  el.innerHTML =
    seg("Each picture shows", [
      [1, "1 vote"],
      [2, "2 votes"],
    ]) + `<div class="fig" data-f></div><p class="readout" data-o></p>`;
  const draw = () => {
    press(el, scale);
    q("f").innerHTML = picGraph(FRUIT, {
      scale,
      unit: pl(scale, "vote"),
      hi: tapped,
      tap: true,
      title: "Favorite fruit in Room 9",
    });
    q("o").innerHTML =
      tapped < 0
        ? `Each picture shows <b>${pl(scale, "vote")}</b>. Tap a row to count it.`
        : rowWhy(FRUIT[tapped], scale, "vote");
  };
  el.addEventListener("click", (e) => {
    const scaleBtn = e.target.closest("[data-m]"),
      row = e.target.closest("[data-r]");
    if (scaleBtn) {
      scale = +scaleBtn.dataset.m;
      draw();
    } else if (row) {
      tapped = +row.dataset.r;
      draw();
    }
  });
  draw();
}
const TRIP = [
  { label: "Zoo", n: 20, pic: "note", c: "green" },
  { label: "Museum", n: 10, pic: "note", c: "blue" },
  { label: "Farm", n: 15, pic: "note", c: "yellow" },
];
/* how many pictures show `votes` when each shows `scale`: "3", "2½", or "½" */
const pics = (votes, scale) => {
  const whole = Math.floor(votes / scale);
  return votes % scale ? (whole ? `${whole}½` : "½") : String(whole);
};
/* Make a picture graph from a table: + and − add or take away 5 votes, which is a picture or half a picture. */
function wBuild(el) {
  /* fives counts the 5s of votes in each row, keyed by the steppers' ids */
  const q = Q(el),
    fives = { zoo: 0, museum: 0, farm: 0 },
    keys = Object.keys(fives);
  let scale = 5;
  el.innerHTML =
    seg("Each picture shows", [
      [5, "5 votes"],
      [10, "10 votes"],
    ]) +
    `<div class="fig" data-f></div><div class="wrow">${TRIP.map((row, i) => stepper(keys[i], row.label)).join("")}</div><p class="readout" data-o></p>`;
  const draw = () => {
    press(el, scale);
    const rows = TRIP.map((row, i) => ({ ...row, n: fives[keys[i]] * 5 })),
      done = rows.every((row, i) => row.n === TRIP[i].n);
    keys.forEach((key) => {
      q(key).textContent = pics(fives[key] * 5, scale);
    });
    q("f").innerHTML = picGraph(rows, { scale, max: 30, unit: `${scale} votes`, title: "Our class trip vote" });
    q("o").innerHTML =
      `Each picture shows ${scale} votes${scale === 10 ? ", and half a picture shows 5" : ""}.<br>` +
      rows
        .map((row, i) => {
          const want = TRIP[i].n;
          return row.n === want ? `${row.label}: ${row.n} ✓` : `${row.label}: ${row.n}. The table says ${want}.`;
        })
        .join("<br>") +
      (done
        ? `<br><span class="ok">Your graph matches the table, with ${pics(45, scale)} pictures in all.</span>`
        : "");
  };
  steppers(el, fives, { zoo: [0, 6], museum: [0, 6], farm: [0, 6] }, draw);
  el.addEventListener("click", (e) => {
    const scaleBtn = e.target.closest("[data-m]");
    if (scaleBtn) {
      scale = +scaleBtn.dataset.m;
      draw();
    }
  });
  draw();
}
/* the quick checks' figures */
const F = {
  recess: picGraph(
    [
      { label: "Tag", n: 8, pic: "note", c: "red" },
      { label: "Jump rope", n: 7, pic: "note", c: "blue" },
      { label: "Soccer", n: 10, pic: "note", c: "green" },
      { label: "Swings", n: 4, pic: "note", c: "yellow" },
    ],
    { scale: 2, unit: "2 students", title: "Favorite recess games" },
  ),
};
const STEPS = [
  {
    title: "Each picture can show more than 1",
    widget: wKey,
    body: "<p>In a <b>scaled picture graph</b>, each picture can stand for more than 1. The <b>key</b> under the graph tells how many. When each picture shows 2, count by 2s, and half a picture shows 1.</p><p>Switch the key, then tap a row to count it.</p>",
    check: {
      kind: "num",
      q: "How many students chose jump rope?",
      fig: F.recess,
      answer: 7,
      unit: "students",
      misc: [
        [4, "That’s the number of pictures. Each picture shows 2 students."],
        [6, "Don’t forget the half picture. It shows 1 more."],
        [8, "The last picture is only half, so it shows 1, not 2."],
      ],
      explain: "Jump rope has 3 and a half pictures. Count by 2s: 2, 4, 6, and the half picture is 1 more. 7 students.",
    },
  },
  {
    title: "Make a scaled picture graph",
    widget: wBuild,
    body: "<p>A class voted on a trip: <b>Zoo 20, Museum 10, Farm 15</b>. To make a picture graph, pick a key, then draw enough pictures for each number.</p><p>Use + and − to match the table. Then switch the key and match it again.</p>",
    check: {
      kind: "num",
      q: "In a picture graph, each picture shows 10 votes. Soccer got 30 votes. How many pictures go in the soccer row?",
      answer: 3,
      unit: "pictures",
      misc: [
        [30, "That’s the number of votes. Each picture shows 10 votes."],
        [10, "That’s what one picture shows. How many 10s make 30?"],
        [6, "That would be right if each picture showed 5 votes."],
      ],
      explain: "Count by 10s: 10, 20, 30. That’s 3 pictures.",
    },
  },
];
