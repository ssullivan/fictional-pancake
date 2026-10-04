/* Learn Multiplying and Dividing Multi-digit Numbers (Grade 4 Unit 6), chapter 7: Remainders. Its widgets and steps; loaded by remainders.html. */
/* Pick how many cards there are and how many friends share them (a stepper and buttons): each friend's share and what's left. */
function wLeft(el) {
  /* the stepper's value: cards, how many there are to share */
  const q = Q(el),
    values = { cards: 29 },
    limits = { cards: [20, 40] };
  let friends = 4;
  el.innerHTML =
    seg(
      "Friends",
      [3, 4, 5, 6].map((f) => [f, `${f} friends`]),
    ) +
    `<div class="wrow">${stepper("cards", "Cards")}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const cards = values.cards,
      each = Math.floor(cards / friends),
      left = cards % friends;
    press(el, friends);
    q("cards").textContent = cards;
    q("f").innerHTML = divideFig(cards, friends);
    q("e").innerHTML = `${cards} ÷ ${friends} = ${each}${left ? ` R ${left}` : ""}`;
    q("r").innerHTML = left
      ? `Each friend gets ${each}, and <b>${left} ${left === 1 ? "card is" : "cards are"} left over</b>: the remainder. It’s less than ${friends}, so there aren’t enough for everyone to get another. Check: ${friends} × ${each} + ${left} = ${cards}.`
      : `Each friend gets ${each}, with <b>none left over</b>. Check: ${friends} × ${each} = ${cards}.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    friends = +m;
    draw();
  });
  draw();
}
/* stories that all divide 50 by 6, each wanting something different from 8 R 2: [id, button, story, answer, why] */
const MEANINGS = [
  [
    "vans",
    "Vans",
    "50 students ride in vans that hold 6 each. How many vans do they need?",
    "9 vans",
    "8 vans hold only 48 students. The 2 left over need a van too, so <b>round up to 9</b>.",
  ],
  [
    "teams",
    "Teams",
    "50 students make teams of 6. How many full teams are there?",
    "8 teams",
    "Only full teams count. The 2 left over can’t make a team, so <b>the answer is the quotient, 8</b>.",
  ],
  [
    "left",
    "Left over",
    "50 stickers are shared equally among 6 students. How many stickers are left over?",
    "2 stickers",
    "Each student gets 8, which uses 48 stickers. The question is about what’s left, so <b>the answer is the remainder, 2</b>.",
  ],
];
/* Pick a story: the same division, 50 ÷ 6 = 8 R 2, answers each one differently. */
function wMeaning(el) {
  const q = Q(el);
  let meaning = "vans";
  el.innerHTML =
    seg(
      "Story",
      MEANINGS.map(([id, name]) => [id, name]),
    ) + `<p class="readout" data-s></p><p class="eq">50 ÷ 6 = 8 R 2</p><p class="readout" data-r></p>`;
  const draw = () => {
    const [, , story, answer, why] = MEANINGS.find(([id]) => id === meaning);
    press(el, meaning);
    q("s").innerHTML = story;
    q("r").innerHTML = `${why} Answer: <b>${answer}</b>.`;
  };
  onPick(el, (m) => {
    meaning = m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "What’s left over",
    widget: wLeft,
    body: "<p>Sometimes a number can’t be shared evenly. What’s left over is the <b>remainder</b>, and it’s always less than the number you divide by. 29 ÷ 4 = 7 R 1 means 4 groups of 7, with 1 left over.</p><p>Change the number of cards and friends.</p>",
    check: {
      kind: "num",
      q: "50 students make teams of 6. How many full teams can they make?",
      answer: 8,
      unit: "teams",
      misc: [
        [9, "9 teams of 6 would need 54 students. Only full teams count."],
        [2, "That’s how many students are left over. How many full teams are there?"],
      ],
      explain: "50 ÷ 6 = 8 R 2: 8 full teams use 48 students, and 2 are left over.",
    },
  },
  {
    title: "What the remainder means",
    widget: wMeaning,
    body: "<p>In a story, decide what to do with the remainder. Sometimes you need one more (round up), sometimes only full groups count (drop it), and sometimes the remainder is the answer.</p><p>Pick a story.</p>",
    check: {
      kind: "mc",
      q: "A van holds 7 students. 31 students go on a field trip. How many vans do they need?",
      choices: [
        { id: "a", label: "4 vans" },
        { id: "b", label: "5 vans" },
        { id: "c", label: "3 vans" },
      ],
      answer: "b",
      why: {
        a: "4 vans hold only 28 students. The 3 left over need a van too.",
        c: "3 is the remainder: 31 ÷ 7 = 4 R 3. The question asks for vans.",
      },
      explain: "31 ÷ 7 = 4 R 3. 4 vans hold 28 students, and the other 3 need one more van: 5 vans.",
    },
  },
];
