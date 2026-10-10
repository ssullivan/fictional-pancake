/* Learn Measuring Length, Time, Liquid Volume, and Weight (Grade 3 Unit 6), chapter 6: Elapsed time. Its widgets and steps;
   loaded by elapsed.html. */
/* how long things last: [start, end] in minutes after midnight */
const SPANS = [
  [8 * 60 + 40, 9 * 60 + 15],
  [10 * 60 + 25, 10 * 60 + 50],
  [1 * 60 + 50, 2 * 60 + 35],
];
/* the jumps from start to end: to the next hour first when it's crossed, then the rest */
function jumpsBetween(start, end) {
  const nextHour = Math.ceil(start / 60) * 60;
  return nextHour > start && nextHour < end
    ? [
        [start, nextHour],
        [nextHour, end],
      ]
    : [[start, end]];
}
/* the number line around start and end, from the quarter hour before to the quarter hour after */
const lineAround = (start, end, hops, pts) =>
  timeLine(Math.floor(start / 15) * 15, Math.ceil(end / 15) * 15, {
    hops: hops.map(([a, b]) => ({ a, b, t: `${b - a} min` })),
    pts,
  });
/* How long from start to end: jump to the hour, then on to the end, and add the jumps. */
function wHowLong(el) {
  const q = Q(el);
  let spanIndex = 0,
    made = 0;
  el.innerHTML =
    seg(
      "Times",
      SPANS.map(([a, b], i) => [i, `${clockTime(a)} to ${clockTime(b)}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Next jump</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [start, end] = SPANS[spanIndex],
      jumps = jumpsBetween(start, end),
      done = made === jumps.length;
    press(el, spanIndex);
    q("go").disabled = done;
    q("f").innerHTML = lineAround(start, end, jumps.slice(0, made), [
      { v: start, t: clockTime(start) },
      { v: end, t: clockTime(end), cls: "b" },
    ]);
    q("r").innerHTML =
      (made
        ? jumps
            .slice(0, made)
            .map(([a, b]) => `${clockTime(a)} to ${clockTime(b)}: ${b - a} minutes.`)
            .join("<br>")
        : `How long is it from ${clockTime(start)} to ${clockTime(end)}? Jump to the next hour first.`) +
      (done
        ? `<br><span class="ok">${jumps.length > 1 ? `${jumps.map(([a, b]) => b - a).join(" + ")} = ` : ""}<b>${end - start} minutes</b>.</span>`
        : "");
  };
  q("go").onclick = () => {
    made++;
    draw();
  };
  q("clr").onclick = () => {
    made = 0;
    draw();
  };
  onPick(el, (id) => {
    spanIndex = +id;
    made = 0;
    draw();
  });
  draw();
}
/* how long something lasts, picked with a row of buttons */
const LENGTHS = [15, 25, 40];
/* When does it end? Start at 2:50 and jump forward the minutes picked. */
function wEndTime(el) {
  const q = Q(el),
    start = 2 * 60 + 50;
  let length = 25;
  el.innerHTML =
    seg(
      "Lasts",
      LENGTHS.map((n) => [n, `${n} minutes`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const end = start + length,
      jumps = jumpsBetween(start, end);
    press(el, length);
    q("f").innerHTML = lineAround(start, end, jumps, [
      { v: start, t: clockTime(start) },
      { v: end, t: clockTime(end), cls: "b" },
    ]);
    q("r").innerHTML =
      `Start at ${clockTime(start)} and jump ${length} minutes. ` +
      (jumps.length > 1
        ? `${jumps[0][1] - start} minutes reach ${clockTime(jumps[0][1])}, and ${end - jumps[0][1]} more land on <b>${clockTime(end)}</b>.`
        : `That lands on <b>${clockTime(end)}</b>.`);
  };
  onPick(el, (id) => {
    length = +id;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  recess: lineAround(
    10 * 60 + 45,
    11 * 60 + 10,
    [],
    [
      { v: 10 * 60 + 45, t: "10:45" },
      { v: 11 * 60 + 10, t: "11:10", cls: "b" },
    ],
  ),
};
const STEPS = [
  {
    title: "How long?",
    widget: wHowLong,
    body: "<p>To find how long something lasts, jump on a number line of times. From 8:40 to 9:15, jump 20 minutes to 9:00, then 15 more to 9:15: 20 + 15 = 35 minutes. An hour is 60 minutes, not 100.</p><p>Pick two times and jump from one to the other.</p>",
    check: {
      kind: "num",
      q: "Recess starts at 10:45 and ends at 11:10. How many minutes long is recess?",
      fig: F.recess,
      answer: 25,
      unit: "minutes",
      misc: [
        [65, "That subtracts the times like numbers. An hour is 60 minutes, not 100: jump to 11:00 first."],
        [10, "That’s only the part after 11:00. Add the 15 minutes before it too."],
      ],
      explain: "10:45 to 11:00 is 15 minutes, and 11:00 to 11:10 is 10 minutes. 15 + 10 = 25 minutes.",
    },
  },
  {
    title: "When does it end?",
    widget: wEndTime,
    body: "<p>To find when something ends, start at the start time and jump forward. When the minutes pass 60, it’s the next hour: 2:50 and 25 minutes is 10 minutes to 3:00, then 15 more, 3:15.</p><p>Pick how long it lasts.</p>",
    check: {
      kind: "mc",
      q: "The bus leaves at 1:50. The ride takes 30 minutes. When does the bus arrive?",
      choices: [
        { id: "a", label: "2:20" },
        { id: "b", label: "1:20" },
        { id: "c", label: "1:80" },
      ],
      answer: "a",
      why: {
        b: "The minutes went past 60, so it’s the next hour.",
        c: "There are only 60 minutes in an hour. 10 minutes reach 2:00, then 20 more.",
      },
      explain: "10 minutes from 1:50 is 2:00, and 20 more is 2:20.",
    },
  },
];
