/* Small helpers shared by every game, every Learn page, and the fuzz tests (tools/fuzz.mjs loads this file in Node).
   Number formatting (fmt, money) stays in each page, because units round differently. */
/* R(a, b): a random whole number from a to b, both included */
const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
/* pick(list): a random item from the list */
const pick = (a) => a[Math.floor(Math.random() * a.length)];
/* range(n) is [0, 1, …, n-1] */
const range = (n) => [...Array(n).keys()];
/* shuffle(list): a copy of the list in random order (Fisher–Yates: swap each item with a random one at or before it) */
const shuffle = (a) => {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
/* For generators. miscOf: wrong answers [[value, message], …], leaving out any that repeat an earlier value (the engine shows
   the first match). A wrong answer must never equal the answer (tools/fuzz.mjs checks): when a mistake doesn't apply to these
   numbers (÷ 10 for 10%), leave it out; when a wrong method lands on the answer (16 ÷ 4 for the side of a square of area 16),
   deal other numbers. The answer is passed for readability at the call; miscOf doesn't use it.
   mcOf: an mc problem with choices a, b, c (d) in random order from [[label, message, or null for the answer], …]. */
const miscOf = (answer, list) => list.filter(([value], i) => list.findIndex(([v]) => v === value) === i);
/* Two problems are the same when they ask the same thing with the same worked answer and choices. The engine deals again
   rather than repeat one in a round, and tools/fuzz.mjs checks that every station has enough different problems. */
const problemKey = (p) => [p.prompt, p.explain, ...(p.choices || []).map((c) => c.label).sort()].join("|");
function mcOf(list, extra = {}) {
  /* give each choice a random letter (from a–c, or a–d for four), then list the choices in letter order */
  const letters = shuffle(["a", "b", "c", "d"].slice(0, Math.max(3, list.length))).slice(0, list.length),
    why = {};
  let answer;
  const choices = list
    .map(([label, msg], i) => {
      if (msg === null) answer = letters[i];
      else why[letters[i]] = msg;
      return { id: letters[i], label };
    })
    .sort((x, y) => (x.id < y.id ? -1 : 1));
  return { kind: "mc", choices, answer, why, ...extra };
}
/* greatest common factor and least common multiple */
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const lcm = (a, b) => (a * b) / gcd(a, b);
/* n rounded to the nearest multiple of unit (halfway rounds up): roundTo(245, 10) is 250, roundTo(1340, 1000) is 1000 */
const roundTo = (n, unit) => Math.floor(n / unit + 0.5) * unit;
const $ = (id) => document.getElementById(id);
/* Q(el)('x') finds the element marked data-x inside el */
const Q = (el) => (a) => el.querySelector(`[data-${a}]`);
/* Reads what a student typed: "12", "$4.50", "1,200", "3/4", "2 1/2", "-2 1/2", "−2 1/2", "12 cm". NaN if there is no number. */
function parseNum(s) {
  /* pages print a true minus sign (−) and some keyboards type a dash (–): both read as a minus */
  s = String(s).trim().replace(/[,$]/g, "").replace(/[−–]/g, "-");
  /* a mixed number: optional minus, whole, space, numerator/denominator ("-2 1/2") */
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\/(\d+)/);
  if (mixed) {
    const [, minus, whole, num, den] = mixed;
    return (minus ? -1 : 1) * (+whole + num / den);
  }
  /* a fraction, where either part may be a decimal ("3/4", "1.5/2") */
  const fraction = s.match(/^(-?\d*\.?\d+)\s*\/\s*(\d*\.?\d+)/);
  if (fraction) return +fraction[1] / +fraction[2];
  /* otherwise the first number in it ("12 cm", "4.50") */
  const number = s.match(/-?\d*\.?\d+/);
  return number ? +number[0] : NaN;
}
/* For Learn widgets: seg makes a row of choice buttons (data-m, with the ids and labels in opts: [[id, label], …]);
   press(el, m) marks the one with id m pressed (aria-pressed). */
const seg = (label, opts) =>
  `<div class="seg" role="group" aria-label="${label}">${opts.map(([id, text]) => `<button type="button" data-m="${id}">${text}</button>`).join("")}</div>`;
const press = (el, m) =>
  el.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.m === String(m)));
/* run fn(id) when a choice button (data-m) in el is pressed (not one in a two-row widget's data-top or data-bot row) */
const onPick = (el, fn) =>
  el.addEventListener("click", (e) => {
    const choice = e.target.closest("[data-m]");
    if (choice && !choice.closest("[data-top],[data-bot]")) fn(choice.dataset.m);
  });
/* For widgets with two rows of choice buttons, each in its own box (<div data-top>${seg(…)}</div>): which row a click was in.
   Returns [row, id] or null. */
const segHit = (e, rows) => {
  const button = e.target.closest("[data-m]");
  if (!button) return null;
  const row = rows.find((name) => button.closest(`[data-${name}]`));
  return row ? [row, button.dataset.m] : null;
};
/* − n + buttons. Markup for one number k; wire them all with steppers(). The number is shown in <b data-(k)>, which Q(el)(k)
   finds; the buttons are marked data-sk, so they never match it. */
const stepper = (k, label) =>
  `<span class="stepper"><span>${label}</span><button type="button" class="ghost-btn" data-sk="${k}" data-d="-1" aria-label="${label}: one less">−</button><b data-${k}></b><button type="button" class="ghost-btn" data-sk="${k}" data-d="1" aria-label="${label}: one more">+</button></span>`;
/* steppers(el, values, limits, draw): a − or + click in el changes values[k] by 1, staying within limits[k] = [min, max],
   then calls draw() */
function steppers(el, values, limits, draw) {
  el.addEventListener("click", (e) => {
    const button = e.target.closest("[data-d]");
    if (!button) return;
    const k = button.dataset.sk,
      value = values[k] + +button.dataset.d,
      [min, max] = limits[k];
    if (value < min || value > max) return;
    values[k] = value;
    draw();
  });
}
