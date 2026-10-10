/* Learn Measuring Length, Time, Liquid Volume, and Weight (Grade 3 Unit 6), chapter 5: Time to the minute. Its widgets and
   steps; loaded by time.html. */
/* Set a clock: move the hour, and the minutes by 1 or by 5. */
function wSetClock(el) {
  /* values.h: the hour (1 to 12); values.m: the minutes after it */
  const q = Q(el),
    values = { h: 4, m: 37 };
  el.innerHTML =
    `<div class="wrow">${stepper("h", "Hour")}${stepper("m", "Minutes")}</div>` +
    `<div class="wrow"><button type="button" class="ghost-btn" data-back>5 minutes back</button><button type="button" class="ghost-btn" data-on>5 minutes on</button></div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { h, m } = values,
      fives = m - (m % 5);
    q("h").textContent = h;
    q("m").textContent = m;
    q("back").disabled = m < 5;
    q("on").disabled = m > 54;
    q("f").innerHTML = clockFig(h, m, { fives: true });
    q("e").textContent = hm(h, m);
    q("r").innerHTML =
      `The hour hand is ${m ? `between ${h} and ${(h % 12) + 1}` : `on ${h}`}, so it’s after ${h}. ` +
      (m % 5
        ? `Count by 5s to ${fives}, then by 1s: ${range(m % 5)
            .map((i) => fives + i + 1)
            .join(", ")}.`
        : `The minute hand is at ${m} minutes.`) +
      `<br>It’s <b>${hm(h, m)}</b>.`;
  };
  steppers(el, values, { h: [1, 12], m: [0, 59] }, draw);
  q("back").onclick = () => {
    values.m -= 5;
    draw();
  };
  q("on").onclick = () => {
    values.m += 5;
    draw();
  };
  draw();
}
/* clocks to read, counting by 5s then by 1s: [hour, minutes] */
const CLOCKS = [
  [3, 27],
  [8, 44],
  [11, 52],
];
/* Read a clock a step at a time: the hour, then 5s to the last 5, then 1s to the minute hand. */
function wReadClock(el) {
  const q = Q(el);
  let clockIndex = 0,
    made = 0;
  el.innerHTML =
    seg(
      "Clock",
      CLOCKS.map((c, i) => [i, `Clock ${i + 1}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Next step</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [h, m] = CLOCKS[clockIndex],
      fives = m - (m % 5),
      lines = [
        `The hour hand is between ${h} and ${(h % 12) + 1}: it’s after ${h}.`,
        `Count by 5s from the 12: ${range(fives / 5)
          .map((i) => 5 * (i + 1))
          .join(", ")}.`,
        `Then by 1s: ${range(m % 5)
          .map((i) => fives + i + 1)
          .join(", ")}. <span class="ok">It’s <b>${hm(h, m)}</b>.</span>`,
      ];
    press(el, clockIndex);
    q("go").disabled = made === 3;
    q("f").innerHTML = clockFig(h, m, { fives: made >= 2 });
    q("r").innerHTML = made ? lines.slice(0, made).join("<br>") : "What time is it? Read it one step at a time.";
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
    clockIndex = +id;
    made = 0;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  clock: clockFig(7, 38),
  clock2: clockFig(2, 18),
};
const STEPS = [
  {
    title: "Set the clock",
    widget: wSetClock,
    body: "<p>The short hand shows the hour. The long hand shows the minutes: each number is 5 minutes, and each little mark is 1 minute. To read 4:37, count by 5s to 35, then by 1s: 36, 37.</p><p>Move the hands and read the time.</p>",
    check: {
      kind: "mc",
      q: "What time does the clock show?",
      fig: F.clock,
      choices: [
        { id: "a", label: "7:38" },
        { id: "b", label: "7:35" },
        { id: "c", label: "8:38" },
      ],
      answer: "a",
      why: {
        b: "Count by 5s to 35, then by 1s: 36, 37, 38.",
        c: "The hour hand hasn’t reached 8 yet. It’s still after 7.",
      },
      explain: "The hour hand is after 7, and the minute hand is 38 minutes past the 12: 7:38.",
    },
  },
  {
    title: "Count the minutes",
    widget: wReadClock,
    body: "<p>Read a clock in steps. First the hour: the number the short hand has passed. Then count by 5s around to the last number before the long hand, and by 1s for the little marks.</p><p>Pick a clock and read it one step at a time.</p>",
    check: {
      kind: "num",
      q: "How many minutes after 2 o’clock does the clock show?",
      fig: F.clock2,
      answer: 18,
      unit: "minutes",
      misc: [
        [15, "Count by 5s to 15, then by 1s for the little marks: 16, 17, 18."],
        [20, "The long hand hasn’t reached the 4 yet. Count the little marks after 15."],
      ],
      explain: "Count by 5s to 15, then by 1s: 16, 17, 18. It’s 2:18.",
    },
  },
];
