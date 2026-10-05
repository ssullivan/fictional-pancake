/* Learn Wrapping Up Addition and Subtraction within 1,000 (Grade 3 Unit 3): code used by more than one chapter. Loaded by the
   chapter pages in learn/, after ../figs.js (placeValues, expanded, regrouped, expandedFig, nearestWord, roundWhy) and
   chapters.js. Open number lines (jumps) are in shared/numlines.js; the standard algorithm (algWidget) in shared/blocks.js. */
/* n and the word for it: "1 hundred", "3 hundreds" (plural: the word for more than one) */
const pl = (n, word, plural = word + "s") => `${n} ${n === 1 ? word : plural}`;
/* a jump in words: +100 or −30 written "+ 100", "− 30" */
const jumpText = (move) => `${move > 0 ? "+" : "−"} ${Math.abs(move)}`;
/* The place names, hundreds first, for the expanded-form widget */
const PLACES = ["Hundreds", "Tens", "Ones"];

/* Widget: an open number line, one jump at a time. problems: [{label, start, moves}], picked with a row of buttons. find:
   'land' when the answer is where the jumps land (adding, or taking away), 'total' when it's how far they go (counting up
   from the smaller number to the bigger one to subtract). */
const jumpWidget = (problems, find) => (el) => {
  /* made: how many jumps are drawn so far */
  const q = Q(el);
  let problemIndex = 0,
    made = 0;
  el.innerHTML =
    seg(
      "Problem",
      problems.map((problem, i) => [i, problem.label]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Next jump</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { label, start, moves } = problems[problemIndex],
      done = made === moves.length,
      landing = moves.reduce((sum, move) => sum + move, start),
      total = moves.reduce((sum, move) => sum + move, 0);
    press(el, problemIndex);
    q("go").disabled = done;
    q("f").innerHTML = jumps(start, moves, made);
    /* each jump made so far, as an equation */
    let at = start;
    const lines = moves.slice(0, made).map((move) => {
      const from = at;
      at += move;
      return `${from} ${jumpText(move)} = ${at}`;
    });
    q("r").innerHTML =
      (made
        ? lines.join("<br>")
        : find === "total"
          ? `Start at ${start}. Jump up to ${landing}: first to the next hundred, then hundreds, then the rest.`
          : `Start at ${start}. Jump ${moves.map((move) => jumpText(move)).join(", then ")}.`) +
      (done
        ? find === "total"
          ? `<br><span class="ok">The jumps add up to ${moves.join(" + ")} = ${total}. So ${label} = <b>${total}</b>.</span>`
          : `<br><span class="ok">${label} = <b>${landing}</b>.</span>`
        : made
          ? `<br><span class="dimline">Next jump: ${jumpText(moves[made])}.</span>`
          : "");
  };
  q("go").onclick = () => {
    if (made < problems[problemIndex].moves.length) made++;
    draw();
  };
  q("clr").onclick = () => {
    made = 0;
    draw();
  };
  onPick(el, (id) => {
    problemIndex = +id;
    made = 0;
    draw();
  });
  draw();
};

/* Widget: add or subtract by place in expanded form, one step at a time. problems: [[a, b], …]; op: '+' or '−'. Each step
   works a place, hundreds first, and the last adds the parts; for −, regrouping comes first when a place is too small. */
const expandedWidget = (problems, op) => (el) => {
  /* stage: how many steps are done */
  const q = Q(el);
  let problemIndex = 0,
    stage = 0;
  el.innerHTML =
    seg(
      "Problem",
      problems.map(([a, b], i) => [i, `${a} ${op} ${b}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Next step</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  /* the steps for a − b or a + b: {shown, rewrite, say}, what the picture shows after each one and what it says */
  function stepsOf(a, b) {
    const plus = op === "+",
      tops = placeValues(a),
      bots = placeValues(b),
      used = plus ? tops : regrouped(a, b),
      parts = used.map((value, i) => (plus ? value + bots[i] : value - bots[i])),
      steps = [];
    /* for −: regroup the way regrouped() does, saying each trade. h, t, o are a's hundreds, tens, and ones as values; with no
       tens to take a ten from, a hundred becomes 10 tens first */
    if (!plus && used.some((value, i) => value !== tops[i])) {
      const said = [];
      let [h, t, o] = tops;
      if (o < bots[2]) {
        if (t === 0) {
          said.push(`There are no tens to take, so take 1 hundred: ${h} becomes ${h - 100}, and the tens become 100.`);
          h -= 100;
          t = 100;
        }
        said.push(
          `${pl(o, "one")} can’t give ${bots[2]}, so take 1 ten: ${t} becomes ${t - 10}, and ${o} becomes ${o + 10}.`,
        );
        t -= 10;
        o += 10;
      }
      if (t < bots[1]) {
        said.push(
          `${pl(t / 10, "ten")} can’t give ${bots[1] / 10}, so take 1 hundred: ${h} becomes ${h - 100}, and ${t} becomes ${t + 100}.`,
        );
        h -= 100;
        t += 100;
      }
      steps.push({
        shown: 0,
        rewrite: true,
        say: `<b>Regroup:</b> ${said.join(" ")} ${a} is ${used.join(" + ")}.`,
      });
    }
    PLACES.forEach((place, i) => {
      steps.push({
        shown: i + 1,
        rewrite: !plus,
        say: `<b>${place}:</b> ${used[i]} ${op} ${bots[i]} = ${parts[i]}.`,
      });
    });
    steps.push({
      shown: 4,
      rewrite: !plus,
      say: `<b>${plus ? "Add the parts" : "Put the parts together"}:</b> ${parts.join(" + ")} = ${plus ? a + b : a - b}.`,
    });
    return steps;
  }
  const draw = () => {
    const [a, b] = problems[problemIndex],
      steps = stepsOf(a, b),
      done = stage === steps.length,
      now = stage ? steps[stage - 1] : { shown: 0, rewrite: false };
    press(el, problemIndex);
    q("go").disabled = done;
    q("f").innerHTML = expandedFig(a, b, op, {
      shown: now.shown,
      rewrite: now.rewrite,
    });
    q("r").innerHTML =
      (stage
        ? steps
            .slice(0, stage)
            .map((step) => step.say)
            .join("<br>")
        : `${a} is ${expanded(a)}, and ${b} is ${expanded(b)}. Work one place at a time.`) +
      (done ? `<br><span class="ok">${a} ${op} ${b} = <b>${op === "+" ? a + b : a - b}</b>.</span>` : "");
  };
  q("go").onclick = () => {
    if (stage < stepsOf(...problems[problemIndex]).length) stage++;
    draw();
  };
  q("clr").onclick = () => {
    stage = 0;
    draw();
  };
  onPick(el, (id) => {
    problemIndex = +id;
    stage = 0;
    draw();
  });
  draw();
};
