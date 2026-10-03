/* Learn From Hundredths to Hundred-thousands (Grade 4 Unit 4), chapter 3: Numbers to 1,000,000. Its widgets and steps; loaded by big-numbers.html. */
/* thousands as small blocks: 10 make a ten-thousand bar, 10 bars a hundred-thousand square, 10 squares a million.
   Level i is drawn as 10 of level i − 1, every other one blue. */
const LEVELS = [
  { v: 1000, name: "one thousand" },
  { v: 10000, name: "ten thousand" },
  { v: 100000, name: "one hundred thousand" },
  { v: 1000000, name: "one million" },
];
/* one block `size` square at x, y; a bar of 10 blocks; a sheet of 10 bars */
const blk = (x, y, size, cls) => `<rect class="hg ${cls}" x="${x}" y="${y}" width="${size}" height="${size}"/>`;
const bar = (x, y, size, cls) =>
  range(10)
    .map((i) => blk(x + i * size, y, size, cls))
    .join("");
const sheet = (x, y, size, cls) =>
  range(10)
    .map((row) => bar(x, y + row * size, size, cls))
    .join("");
/* level i of LEVELS (svg): 1 block, or 10 of the level before */
function thousandsFig(i) {
  const colorOf = (j) => (j % 2 ? "b" : "a");
  let markup, width, height;
  if (i === 0) {
    markup = blk(10, 10, 60, "a");
    width = height = 80;
  } else if (i === 1) {
    markup = range(10)
      .map((j) => blk(10 + j * 30, 10, 30, colorOf(j)))
      .join("");
    width = 320;
    height = 50;
  } else if (i === 2) {
    markup = range(10)
      .map((j) => bar(10, 10 + j * 22, 22, colorOf(j)))
      .join("");
    width = 240;
    height = 240;
  }
  /* a million: 10 sheets in two rows of 5 */
  else {
    markup = range(10)
      .map((j) => sheet(10 + (j % 5) * 96, 10 + Math.floor(j / 5) * 96, 8.8, colorOf(j)))
      .join("");
    width = 490;
    height = 204;
  }
  return svgWrap(
    width,
    height,
    markup,
    i ? `10 groups of ${commas(LEVELS[i - 1].v)}: ${commas(LEVELS[i].v)}` : "1 block: 1,000",
  );
}
/* Make 10 of them, again and again: a thousand, ten thousand, a hundred thousand, a million. */
function wTen(el) {
  const q = Q(el);
  let level = 0;
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Make 10 of them</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const now = LEVELS[level];
    q("go").disabled = level === LEVELS.length - 1;
    q("f").innerHTML = thousandsFig(level);
    q("e").innerHTML = level ? `10 × ${commas(LEVELS[level - 1].v)} = ${commas(now.v)}` : "1,000";
    q("r").innerHTML = !level
      ? `Each block is <b>1,000</b>: one thousand. Make 10 of them.`
      : `<span class="ok">10 ${LEVELS[level - 1].name.replace(/^one /, "")}s make <b>${commas(now.v)}</b>: ${now.name}.</span>` +
        `<br><span class="dimline">10 times as many: one more 0.${level < LEVELS.length - 1 ? " Make 10 again." : ""}</span>`;
  };
  q("go").onclick = () => {
    if (level < LEVELS.length - 1) level++;
    draw();
  };
  q("clr").onclick = () => {
    level = 0;
    draw();
  };
  draw();
}
/* the numbers to read */
const NUMS = [305020, 47600, 800009, 303030];
/* n in expanded form: "300,000 + 5,000 + 20" */
const expanded = (n) =>
  WIDE.filter((e) => digitAt(n, e))
    .map((e) => commas(digitAt(n, e) * 10 ** e))
    .join(" + ");
/* Tap a digit in a place-value chart to see what it's worth, with the number in words and in expanded form. */
function wPlace(el) {
  /* place: the place tapped, as a power of 10 (null before one is) */
  const q = Q(el);
  let numberIndex = 0,
    place = null;
  el.innerHTML =
    seg(
      "Number",
      NUMS.map((v, i) => [i, commas(v)]),
    ) + `<div data-c></div><p class="readout" data-r></p>`;
  const draw = () => {
    const n = NUMS[numberIndex];
    press(el, numberIndex);
    q("c").innerHTML = pvChart([["", n]], -1, { places: WIDE, tap: true });
    if (place !== null) q("c").querySelector(`[data-e="${place}"]`).setAttribute("aria-pressed", "true");
    const digit = place === null ? 0 : digitAt(n, place);
    q("r").innerHTML =
      (place === null
        ? "Tap a digit to see what it’s worth."
        : `The ${digit} is in the <b>${PLACE[place].toLowerCase()}</b> place, so it’s worth ${digit} ${PL[place][digit === 1 ? 0 : 1]}: <b>${commas(digit * 10 ** place)}</b>.`) +
      `<br><b>${commas(n)}</b>: ${numWords(n)}.<br><span class="dimline">Expanded: ${expanded(n)}.</span>`;
  };
  el.addEventListener("click", (e) => {
    const numberBtn = e.target.closest("[data-m]");
    if (numberBtn) {
      numberIndex = +numberBtn.dataset.m;
      place = null;
      draw();
      return;
    }
    const digitBtn = e.target.closest("[data-e]");
    if (digitBtn) {
      place = +digitBtn.dataset.e;
      draw();
    }
  });
  draw();
}
const STEPS = [
  {
    title: "How much is 10,000?",
    widget: wTen,
    body: "<p>10 hundreds make 1,000. In the same way, <b>10 thousands make 10,000</b>, and 10 ten-thousands make 100,000. Each place is worth 10 times the place to its right.</p><p>Make 10 of them, again and again.</p>",
    check: {
      kind: "num",
      unit: "seats",
      answer: 10000,
      q: "A stadium has 10 sections. Each section has 1,000 seats. How many seats does the stadium have?",
      misc: [
        [1010, "You added 10. There are 10 groups of 1,000: that’s 10 × 1,000."],
        [100000, "That’s 100 thousands. 10 groups of 1,000 is 10 thousands."],
      ],
      explain: "10 thousands is 10,000. The stadium has 10,000 seats.",
    },
  },
  {
    title: "What each digit is worth",
    widget: wPlace,
    body: "<p>In 305,020, the 3 is in the hundred-thousands place, so it’s worth 300,000. The 5 is worth 5,000 and the 2 is worth 20. Written as a sum, that’s <b>300,000 + 5,000 + 20</b>. The comma sits between the thousands and the hundreds.</p><p>Pick a number. Tap a digit.</p>",
    check: {
      kind: "mc",
      q: "A city has 406,500 people. What is the 6 worth?",
      choices: [
        { id: "a", label: "600" },
        { id: "b", label: "6,000" },
        { id: "c", label: "60,000" },
      ],
      answer: "b",
      why: {
        a: "Count the places from the right: ones, tens, hundreds, thousands. The 6 is in the thousands place, just left of the comma.",
        c: "The 6 is just left of the comma, in the thousands place. 60,000 would need the 6 one place farther left.",
      },
      explain: "406,500 is 4 hundred-thousands, 0 ten-thousands, 6 thousands, and 5 hundreds. The 6 is worth 6,000.",
    },
  },
];
