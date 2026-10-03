/* Learn Geometry, Time, and Money (Grade 2 Unit 6), chapter 3: Tell time. Its widgets and steps; loaded by time.html. */
/* minutes past the hour, and how to say them */
const QTR = [
  ["0", "o’clock"],
  ["15", "Quarter past"],
  ["30", "Half past"],
  ["45", "Quarter till"],
];
/* O'clock, quarter past, half past, and quarter till on a clock (a stepper sets the hour). */
function wQuarters(el) {
  const q = Q(el),
    values = { h: 3 };
  let minute = 15;
  el.innerHTML =
    seg("Minutes", QTR) +
    `<div class="fig" data-f></div><div class="wrow">${stepper("h", "Hour")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    /* the shaded part runs from 12 to the minute hand, or from it to 12 for quarter till */
    const hour = values.h,
      nextHour = (hour % 12) + 1;
    press(el, minute);
    q("h").textContent = hour;
    q("f").innerHTML = clockFig(hour, minute, {
      shade: minute ? [minute === 45 ? 45 : 0, minute === 45 ? 60 : minute] : null,
    });
    const spoken = {
      0: `${hour} o’clock`,
      15: `quarter past ${hour}`,
      30: `half past ${hour}`,
      45: `quarter till ${nextHour}`,
    }[minute];
    q("r").innerHTML =
      `<span class="ok"><b>${hm(hour, minute)}</b> is <b>${spoken}</b>.</span><br><span class="dimline">` +
      {
        0: `The long minute hand points straight up to 12. The short hour hand points to ${hour}.`,
        15: `The minute hand went a quarter of the way around: 15 minutes past ${hour}.`,
        30: `The minute hand went halfway around: 30 minutes. The hour hand is halfway between ${hour} and ${nextHour}.`,
        45: `The minute hand went three quarters of the way around: 45 minutes. One more quarter and it’s ${nextHour} o’clock.`,
      }[minute] +
      "</span>";
  };
  steppers(el, values, { h: [1, 12] }, draw);
  el.addEventListener("click", (e) => {
    const minuteBtn = e.target.closest("[data-m]");
    if (minuteBtn) {
      minute = +minuteBtn.dataset.m;
      draw();
    }
  });
  draw();
}
/* Steppers for the hour and the minutes (by 5s): count by 5s to the minute hand. */
function wFives(el) {
  /* the steppers' values: h, the hour; mn, the number the minute hand points to (shown as minutes) */
  const q = Q(el),
    values = { h: 2, mn: 7 };
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow">${stepper("h", "Hour")}${stepper("mn", "Minutes")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const { h: hour, mn: number } = values,
      minute = number * 5;
    q("h").textContent = hour;
    q("mn").textContent = minute;
    q("f").innerHTML = clockFig(hour, minute, { fives: true });
    q("r").innerHTML =
      (number
        ? `The minute hand points to the <b>${number}</b>. Count by 5s: ${range(Math.min(number, 4))
            .map((i) => 5 * (i + 1))
            .join(", ")}${number > 4 ? `, … <b>${minute}</b>` : ""} minutes.`
        : "The minute hand points to 12: <b>0 minutes</b>, so it’s o’clock.") +
      `<br>The hour hand ${number ? `is past ${hour}` : `points to ${hour}`}, so the hour is <b>${hour}</b>.<br><span class="ok"><b>${hm(hour, minute)}</b></span>`;
  };
  steppers(el, values, { h: [1, 12], mn: [0, 11] }, draw);
  draw();
}
/* times of day: [what, hour, minute, a.m.] */
const DAY = [
  ["Wake up", 7, 0, 1],
  ["School starts", 8, 30, 1],
  ["Lunch", 11, 45, 1],
  ["Soccer practice", 4, 15, 0],
  ["Dinner", 6, 0, 0],
  ["Bedtime", 8, 0, 0],
  ["Sound asleep", 2, 0, 1],
];
/* a.m. or p.m.: a time of day on a clock and on a bar for the whole day. */
function wAmPm(el) {
  const q = Q(el);
  let timeIndex = 0;
  el.innerHTML =
    seg(
      "Time of day",
      DAY.map(([what], i) => [i, what]),
    ) + `<div class="fig" data-f></div><div class="fig" data-d></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* at: hours after midnight */
    const [what, hour, minute, am] = DAY[timeIndex],
      at = (am ? hour % 12 : (hour % 12) + 12) + minute / 60;
    press(el, timeIndex);
    q("f").innerHTML = clockFig(hour, minute, { r: 90 });
    q("d").innerHTML = dayBar(
      at,
      `A bar for the whole day, from midnight to noon (a.m.) and noon to midnight (p.m.), with an arrow at ${what.toLowerCase()}`,
    );
    q("r").innerHTML =
      `${what}: <b>${hm(hour, minute)} ${am ? "a.m." : "p.m."}</b><br><span class="dimline">` +
      (am
        ? "<b>a.m.</b> is from midnight to noon: night and morning."
        : "<b>p.m.</b> is from noon to midnight: afternoon, evening, and night.") +
      ` The clock looks the same at ${hm(hour, minute)} a.m. and ${hm(hour, minute)} p.m.</span>`;
  };
  el.addEventListener("click", (e) => {
    const timeBtn = e.target.closest("[data-m]");
    if (timeBtn) {
      timeIndex = +timeBtn.dataset.m;
      draw();
    }
  });
  draw();
}
const STEPS = [
  {
    title: "Half past and quarter past",
    widget: wQuarters,
    body: "<p>The <b>short hand</b> shows the hour. The <b>long hand</b> shows the minutes.</p><p>When the long hand goes halfway around, it’s <b>half past</b>. A quarter of the way around is <b>quarter past</b>. Three quarters around is <b>quarter till</b> the next hour.</p>",
    check: {
      kind: "mc",
      q: "What time is it?",
      fig: clockFig(8, 30, { shade: [0, 30], r: 90 }),
      choices: [
        { id: "a", label: "Half past 9" },
        { id: "b", label: "Half past 8" },
        { id: "c", label: "Quarter past 8" },
      ],
      answer: "b",
      why: {
        a: "The hour hand is between 8 and 9. It hasn’t gotten to 9 yet.",
        c: "A quarter is 15 minutes. The shaded part is half the clock.",
      },
      explain: "The long hand went halfway around: 30 minutes. The short hand is past 8. Half past 8 is 8:30.",
    },
  },
  {
    title: "Count by 5",
    widget: wFives,
    body: "<p>The minute hand moves 5 minutes from one number to the next. To tell the minutes, <b>count by 5s</b>.</p><p>Change the hour and the minutes.</p>",
    check: {
      kind: "mc",
      q: "What time does the clock show?",
      fig: clockFig(2, 40, { r: 90 }),
      choices: [
        { id: "a", label: "2:40" },
        { id: "b", label: "8:10" },
        { id: "c", label: "2:08" },
      ],
      answer: "a",
      why: {
        b: "The short hand shows the hour. The long hand shows the minutes.",
        c: "The long hand points to the 8. Count by 5s: 8 fives is 40 minutes.",
      },
      explain:
        "The short hand is between 2 and 3, so the hour is 2. The long hand points to 8: 5, 10, 15, 20, 25, 30, 35, 40. It’s 2:40.",
    },
  },
  {
    title: "a.m. or p.m.?",
    widget: wAmPm,
    body: "<p>A clock goes around twice every day. <b>a.m.</b> times are from midnight to noon. <b>p.m.</b> times are from noon to midnight.</p><p>Pick a time of day.</p>",
    check: {
      kind: "mc",
      q: "Which time makes sense for eating dinner?",
      choices: [
        { id: "a", label: "6:00 a.m." },
        { id: "b", label: "11:00 p.m." },
        { id: "c", label: "6:00 p.m." },
      ],
      answer: "c",
      why: {
        a: "6:00 a.m. is early in the morning, before breakfast.",
        b: "11:00 p.m. is late at night, when most people are asleep.",
      },
      explain: "Dinner is in the evening, after noon. 6:00 p.m. makes sense.",
    },
  },
];
