/* Learn Equal Groups (Grade 2 Unit 8), chapter 1: Share and make pairs. Its widgets and steps; loaded by share-and-pair.html. */
const NAMES = ["Mai", "Diego"];
/* n counters from x, y in rows of 10, with a gap after every 5 */
const pileAt = (x, y, n, cls = "a") =>
  range(n)
    .map((i) => ctr(x + (i % 10) * 36 + (i % 10 >= 5 ? 10 : 0), y + Math.floor(i / 10) * 36, cls))
    .join("");
/* a pile of n counters on its own (svg) */
const pile = (n, label) =>
  svgWrap(
    Math.min(n, 10) * 36 + (n > 5 ? 10 : 0) + 12,
    Math.ceil(n / 10) * 36 + 12,
    pileAt(24, 24, n),
    label || `${n} counters`,
  );
/* n counters being shared by 2 friends, 1 to each at a time: `given` of them are on the plates, the rest wait on top.
   When 1 is left that can't be shared, it gets a ring. */
function plateFig(n, given) {
  /* platesY: the plates go under the pile */
  const left = n - given,
    each = given / 2,
    platesY = Math.ceil(n / 10) * 36 + 34,
    alone = left === 1 && given > 0;
  let markup =
    `<text class="lbl s dm st" x="10" y="12">To share</text>` +
    pileAt(24, 40, left, alone ? "b" : "a") +
    (alone ? ring(24, 40) : "");
  [0, 1].forEach((friend) => {
    const x = 10 + friend * 236;
    markup +=
      `<rect class="plate" x="${x}" y="${platesY}" width="214" height="96" rx="20"/><text class="lbl" x="${x + 107}" y="${platesY + 116}">${NAMES[friend]}</text>` +
      range(each)
        .map((i) => ctr(x + 35 + (i % 5) * 36, platesY + 30 + Math.floor(i / 5) * 36))
        .join("");
  });
  return svgWrap(
    460,
    platesY + 130,
    markup,
    `${n} counters. ${NAMES[0]} has ${each}, ${NAMES[1]} has ${each}, and ${left} ${left === 1 ? "is" : "are"} left`,
  );
}
/* Share counters (a stepper) fairly between two friends, 1 to each at a time. */
function wShare(el) {
  /* given: the counters on the plates so far */
  const q = Q(el),
    values = { n: 12 };
  let given = 0;
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow">${stepper("n", "Counters")}</div><div class="wrow"><button type="button" class="btn" data-one>Give 1 to each</button><button type="button" class="ghost-btn" data-all>Share them all</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* done once fewer than 2 are left to share */
    const { n } = values,
      left = n - given,
      each = given / 2,
      done = left < 2,
      [first, second] = NAMES;
    q("n").textContent = n;
    q("f").innerHTML = plateFig(n, given);
    q("one").disabled = q("all").disabled = done;
    q("r").innerHTML = !given
      ? `<b>${n}</b> counters to share fairly: ${first} and ${second} get the same number.<br><span class="dimline">Tap Give 1 to each.</span>`
      : !done
        ? `${first} has <b>${each}</b>. ${second} has <b>${each}</b>. ${left} left to share.`
        : left
          ? `<b>${first} and ${second} each get ${each}</b>, and <b>1 is left over</b>.<br><span class="dimline">That 1 can’t be shared fairly. Try another number.</span>`
          : `<span class="ok"><b>${first} and ${second} each get ${each}</b>, with none left over.</span><br><span class="dimline">${n} can be shared fairly. Try another number.</span>`;
  };
  steppers(el, values, { n: [2, 20] }, () => {
    given = 0;
    draw();
  });
  q("one").onclick = () => {
    given += 2;
    draw();
  };
  q("all").onclick = () => {
    given = values.n - (values.n % 2);
    draw();
  };
  q("clr").onclick = () => {
    given = 0;
    draw();
  };
  draw();
}
/* Put counters (a stepper) in pairs: does every one have a partner? */
function wPairs(el) {
  const q = Q(el),
    values = { n: 9 };
  let paired = false;
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow">${stepper("n", "Counters")}<button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { n } = values,
      pairs = Math.floor(n / 2);
    q("n").textContent = n;
    q("go").textContent = paired ? "Mix them up" : "Make pairs";
    q("f").innerHTML = paired ? pairsFig(n) : pile(n);
    q("r").innerHTML = !paired
      ? `<b>${n}</b> counters. Does every counter have a partner?<br><span class="dimline">Tap Make pairs.</span>`
      : n % 2
        ? `<b>${pl(pairs, "pair")} and 1 more.</b><br><span class="dimline">1 counter has no partner.</span>`
        : `<span class="ok"><b>${pl(pairs, "pair")}.</b></span><br><span class="dimline">Every counter has a partner.</span>`;
  };
  steppers(el, values, { n: [1, 20] }, () => {
    paired = false;
    draw();
  });
  q("go").onclick = () => {
    paired = !paired;
    draw();
  };
  draw();
}
/* the quick checks' figures */
const F = {
  crackers: pile(14, "14 crackers"),
  line11: pairsFig(11, { mark: false, label: "11 students standing in pairs" }),
};
const STEPS = [
  {
    title: "Share fairly",
    widget: wShare,
    body: "<p>To <b>share fairly</b> with 2 friends, each friend gets the same number.</p><p>Pick how many counters. Give 1 to each friend until you can’t anymore. Is any left over?</p>",
    check: {
      kind: "num",
      unit: "crackers",
      answer: 7,
      fig: F.crackers,
      q: "Lin and Han share 14 crackers fairly. How many crackers does each one get?",
      misc: [
        [14, "That’s all the crackers. Split them into 2 equal groups."],
        [28, "That’s 14 + 14. Sharing splits 14 into 2 equal groups."],
        [6, "6 + 6 = 12. There are 14 crackers."],
        [8, "8 + 8 = 16. That’s too many."],
      ],
      explain: "Give 1 to each, again and again. Each one gets 7, with none left over: 7 + 7 = 14.",
    },
  },
  {
    title: "Partners make pairs",
    widget: wPairs,
    body: "<p>A <b>pair</b> is 2 things that go together. If every counter has a partner, none are left over.</p><p>Pick how many counters. Then make pairs.</p>",
    check: {
      kind: "mc",
      stack: true,
      fig: F.line11,
      q: "11 students line up with a partner. Does every student have a partner?",
      choices: [
        { id: "a", label: "Yes, every student has a partner." },
        { id: "b", label: "No, 1 student has no partner." },
        { id: "c", label: "No, 2 students have no partner." },
      ],
      answer: "b",
      why: {
        a: "Look at the end of the line. 1 student is alone.",
        c: "2 students left over would make one more pair.",
      },
      explain: "11 makes 5 pairs and 1 more. 1 student has no partner.",
    },
  },
];
