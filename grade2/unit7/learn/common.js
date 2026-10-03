/* Learn Adding and Subtracting within 1,000 (Grade 2 Unit 7): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
const PL = ["hundreds", "tens", "ones"];
/* "1 ten", "3 tens": n of place i (0 hundreds, 1 tens, 2 ones) */
const cnt = (n, i) => `${n} ${n === 1 ? PL[i].slice(0, -1) : PL[i]}`;
/* A place-value mat: a row of blocks for each number, with hundreds, tens, and ones in lined-up columns.
   rows: [{lab, h, t, o}]; h, t, o give a class for each block (build them with cellsOf): 'a' gold, 'b' blue,
   'new' a new ten or hundred, 'tr' from a broken ten or hundred, plus ' gone' to cross it out.
   fit: {h, t, o} how many blocks each column needs room for, so the columns stay put as blocks come and go. */
function mat(rows, label, fit = {}) {
  /* most(k): the most blocks column k needs room for; labelW: room for the row labels */
  const most = (k) => Math.max(fit[k] || 0, ...rows.map((row) => row[k].length)),
    hundreds = most("h"),
    tens = most("t"),
    ones = most("o"),
    labelW = rows.some((row) => row.lab) ? 64 : 0;
  /* each column's width: hundreds 5 to a row, tens side by side in fives, ones in stacks of 5 */
  const colW = [
    Math.max(Math.min(hundreds, 5) * (FW + 8) - 8, 76),
    Math.max(tens * (BT + 4) + Math.floor((tens - 1) / 5) * 5 - 4, 50),
    Math.max(Math.ceil(ones / 5) * (BT + 5) - 5, 50),
  ];
  const colX = [10 + labelW, 34 + labelW + colW[0], 58 + labelW + colW[0] + colW[1]],
    gone = (cls) => cls.includes("gone");
  let y = 34,
    markup = "";
  rows.forEach((row) => {
    row.h.forEach((cls, i) => {
      const x = colX[0] + (i % 5) * (FW + 8),
        blockY = y + Math.floor(i / 5) * (FW + 8);
      markup += flat(x, blockY, cls) + (gone(cls) ? xOut(x, blockY, FW, FW) : "");
    });
    row.t.forEach((cls, i) => {
      const x = colX[1] + i * (BT + 4) + Math.floor(i / 5) * 5;
      markup += stick(x, y, cls) + (gone(cls) ? xOut(x, y, BT, FW) : "");
    });
    /* ones fill each column of 5 from the bottom up */
    row.o.forEach((cls, i) => {
      const x = colX[2] + Math.floor(i / 5) * (BT + 5),
        blockY = y + FW - BT - (i % 5) * (BT + 5);
      markup += cube1(x, blockY, cls) + (gone(cls) ? xOut(x, blockY, BT, BT) : "");
    });
    if (row.lab) markup += `<text class="lbl en" x="${labelW}" y="${y + FW / 2}">${row.lab}</text>`;
    y += Math.max(FW, Math.ceil(row.h.length / 5) * (FW + 8) - 8) + 20;
  });
  /* the column names, and lines between the columns */
  const head =
    PL.map((name, i) => `<text class="lbl s dm" x="${colX[i] + colW[i] / 2}" y="14">${name}</text>`).join("") +
    [1, 2].map((i) => `<path class="guide" d="M${colX[i] - 12},4V${y - 10}"/>`).join("");
  return svgWrap(colX[2] + colW[2] + 10, y - 6, head + markup, label);
}
/* n as one row of the mat, every block in class cls */
const bl = (n, cls = "a", lab) => {
  const [hundreds, tens, ones] = digits(n);
  return { lab, h: cellsOf([hundreds, cls]), t: cellsOf([tens, cls]), o: cellsOf([ones, cls]) };
};
/* a + b on the mat, one row each */
const apart = (a, b) => mat([bl(a, "a", a), bl(b, "b", `+ ${b}`)], `${a} and ${b} in base-ten blocks`);
/* lines like "700 − 300 = 400", one under the other */
const byPlace = (lines) => `<div class="bp">${lines.map((line) => `<p class="eq">${line}</p>`).join("")}</div>`;
/* "1 hundred, 3 tens, and 2 ones", leaving out places with 0 */
function partsOf(n) {
  const parts = digits(n)
    .map((d, i) => (d ? cnt(d, i) : ""))
    .filter(Boolean);
  return parts.length > 1
    ? parts.slice(0, -1).join(", ") + (parts.length > 2 ? "," : "") + " and " + parts[parts.length - 1]
    : parts[0];
}
/* The blocks for a + b, one stage at a time: apart, together, then a new ten and a new hundred when the ones or tens make 10.
   Each stage is {rows} (apart) or {h, t, o, made}: the blocks together, and 'ten' or 'hundred' when that stage made one. */
function addStages(a, b) {
  const [hundredsA, tensA, onesA] = digits(a),
    [hundredsB, tensB, onesB] = digits(b),
    stages = [{ rows: [bl(a, "a", a), bl(b, "b", `+ ${b}`)] }];
  let h = cellsOf([hundredsA, "a"], [hundredsB, "b"]),
    t = cellsOf([tensA, "a"], [tensB, "b"]),
    o = cellsOf([onesA, "a"], [onesB, "b"]);
  stages.push({ h, t, o });
  if (o.length >= 10) {
    o = o.slice(10);
    t = [...t, "new"];
    stages.push({ h, t, o, made: "ten" });
  }
  if (t.length >= 10) {
    t = t.slice(10);
    h = [...h, "new"];
    stages.push({ h, t, o, made: "hundred" });
  }
  return stages;
}
/* the mat for one stage of addStages (all its stages), with room in each column for every stage */
function stageFig(a, b, stages, stage) {
  const fit = {};
  ["h", "t", "o"].forEach((k) => {
    fit[k] = Math.max(...stages.slice(1).map((s) => s[k].length));
  });
  return stage.rows
    ? mat(stage.rows, `${a} and ${b} in base-ten blocks`, fit)
    : mat([stage], `${cnt(stage.h.length, 0)}, ${cnt(stage.t.length, 1)}, and ${cnt(stage.o.length, 2)}`, fit);
}
/* Widget: pick a + b, then put the blocks together and make each new ten or hundred. PROBS: [[a, b], …] */
const addW = (PROBS) => (el) => {
  /* stageIndex: the stage shown (0 apart, 1 together, then each new ten or hundred) */
  const q = Q(el);
  let problemIndex = 0,
    stageIndex = 0;
  el.innerHTML =
    seg(
      "Problem",
      PROBS.map(([a, b], i) => [i, `${a} + ${b}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b] = PROBS[problemIndex],
      [hundredsA, tensA, onesA] = digits(a),
      [hundredsB, tensB, onesB] = digits(b),
      stages = addStages(a, b),
      stage = stages[stageIndex],
      nextStage = stages[stageIndex + 1];
    press(el, problemIndex);
    q("f").innerHTML = stageFig(a, b, stages, stage);
    q("go").textContent = !nextStage
      ? "Start over"
      : !stageIndex
        ? "Put them together"
        : nextStage.made === "ten"
          ? "Make a new ten"
          : "Make a new hundred";
    /* what comes next: the answer at the last stage, or the trade to make */
    const next = !nextStage
      ? `<br><span class="ok"><b>${a} + ${b} = ${a + b}</b></span><br><span class="dimline">${cnt(stage.h.length, 0)}, ${cnt(stage.t.length, 1)}, ${cnt(stage.o.length, 2)}: ${stage.h.length * 100} + ${stage.t.length * 10} + ${stage.o.length}</span>`
      : nextStage.made === "ten"
        ? `<br><span class="dimline">${stage.o.length} ones! Trade 10 ones for a new ten.</span>`
        : nextStage.made === "hundred"
          ? `<br><span class="dimline">${stage.t.length} tens! Trade 10 tens for a new hundred.</span>`
          : "";
    q("r").innerHTML = !stageIndex
      ? `<b>${a} + ${b}</b><br><span class="dimline">Big squares are hundreds, sticks are tens, and small squares are ones.</span>`
      : stageIndex === 1
        ? `Hundreds: <b>${hundredsA} + ${hundredsB} = ${hundredsA + hundredsB}</b>. Tens: <b>${tensA} + ${tensB} = ${tensA + tensB}</b>. Ones: <b>${onesA} + ${onesB} = ${onesA + onesB}</b>.` +
          next
        : stage.made === "ten"
          ? `10 ones make <b>a new ten</b>. Now there are ${cnt(stage.t.length, 1)} and ${cnt(stage.o.length, 2)}.` +
            next
          : `10 tens make <b>a new hundred</b>. Now there are ${cnt(stage.h.length, 0)} and ${cnt(stage.t.length, 1)}.` +
            next;
  };
  el.addEventListener("click", (e) => {
    const problemBtn = e.target.closest("[data-m]");
    if (problemBtn) {
      problemIndex = +problemBtn.dataset.m;
      stageIndex = 0;
      draw();
    }
  });
  q("go").onclick = () => {
    stageIndex = stageIndex + 1 < addStages(...PROBS[problemIndex]).length ? stageIndex + 1 : 0;
    draw();
  };
  draw();
};
/* Widget: pick a − b, then take away the ones, tens, and hundreds. brk: which breaks it offers ('t' a ten, 'h' a hundred, 'th' both, '' none). */
const subW =
  (PROBS, brk = "") =>
  (el) => {
    /* done: what's been done so far: bh and bt, a hundred and a ten broken; h, t, o, that place taken away; msg, why the last tap didn't work */
    const q = Q(el);
    let problemIndex = 0,
      done;
    const reset = () => {
      done = { bh: 0, bt: 0, h: 0, t: 0, o: 0, msg: "" };
    };
    el.innerHTML =
      seg(
        "Problem",
        PROBS.map(([a, b], i) => [i, `${a} − ${b}`]),
      ) +
      `<div class="fig" data-f></div><div class="wrow">` +
      (brk.includes("h") ? '<button type="button" class="btn" data-bh>Break a hundred</button>' : "") +
      (brk.includes("t") ? '<button type="button" class="btn" data-bt>Break a ten</button>' : "") +
      `<button type="button" class="ghost-btn" data-to>Take away ones</button><button type="button" class="ghost-btn" data-tt>Take away tens</button><button type="button" class="ghost-btn" data-th>Take away hundreds</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
    /* the blocks now: hundreds; goldTens and tradedTens (from a broken hundred), and tens, both of them; goldOnes, and ones with
     the 10 from a broken ten. Breaking a ten takes a gold ten when there is one. */
    const now = () => {
      const [startHundreds, startTens, goldOnes] = digits(PROBS[problemIndex][0]);
      let goldTens = startTens,
        tradedTens = 10 * done.bh;
      if (done.bt) {
        if (goldTens) goldTens--;
        else tradedTens--;
      }
      return {
        hundreds: startHundreds - done.bh,
        goldTens,
        tradedTens,
        tens: goldTens + tradedTens,
        goldOnes,
        ones: goldOnes + 10 * done.bt,
      };
    };
    /* blocks with the last n crossed out, when that place has been taken away */
    const cross = (blocks, n, takenAway) =>
      takenAway ? blocks.map((cls, i) => (i >= blocks.length - n ? cls + " gone" : cls)) : blocks;
    const draw = () => {
      const [a, b] = PROBS[problemIndex],
        [hundredsB, tensB, onesB] = digits(b),
        { hundreds, goldTens, tradedTens, tens, goldOnes, ones } = now(),
        all = done.h && done.t && done.o;
      press(el, problemIndex);
      /* the columns have room for the blocks a breaks into */
      q("f").innerHTML = mat(
        [
          {
            h: cross(cellsOf([hundreds, "a"]), hundredsB, done.h),
            t: cross(cellsOf([goldTens, "a"], [tradedTens, "tr"]), tensB, done.t),
            o: cross(cellsOf([goldOnes, "a"], [10 * done.bt, "tr"]), onesB, done.o),
          },
        ],
        `${cnt(hundreds, 0)}, ${cnt(tens, 1)}, and ${cnt(ones, 2)}` +
          (done.h || done.t || done.o ? ", with some crossed out" : ""),
        {
          h: digits(a)[0],
          t: digits(a)[1] + (brk.includes("h") ? 10 : 0),
          o: digits(a)[2] + (brk.includes("t") ? 10 : 0),
        },
      );
      /* a break can't come after that place is taken away, and each happens once */
      if (q("bh")) q("bh").disabled = !!(done.bh || done.t);
      if (q("bt")) q("bt").disabled = !!(done.bt || done.o);
      q("to").disabled = !!done.o;
      q("tt").disabled = !!done.t;
      q("th").disabled = !!done.h;
      const green =
        done.bh && done.bt
          ? "The green tens came from a broken hundred, and the green ones from a broken ten."
          : done.bh
            ? "The green tens came from a broken hundred."
            : done.bt
              ? "The green ones came from a broken ten."
              : "";
      q("r").innerHTML = all
        ? `<span class="ok">You took away ${b}. <b>${a} − ${b} = ${a - b}</b>.</span><br><span class="dimline">${cnt(hundreds - hundredsB, 0)}, ${cnt(tens - tensB, 1)}, and ${cnt(ones - onesB, 2)} are left.</span>`
        : (done.msg ? `<span class="no">${done.msg}</span>` : `Take away <b>${b}</b>: ${partsOf(b)}.`) +
          `<br><span class="dimline">${green ? `${a} is now ${cnt(hundreds, 0)}, ${cnt(tens, 1)}, and ${cnt(ones, 2)}. ${green}` : brk === "t" ? "Are there enough ones to take away?" : brk === "h" ? "Are there enough tens to take away?" : brk ? "Check the ones first, then the tens." : "Take away each place."}</span>`;
    };
    /* a button's action: it returns why it can't be done, or nothing when it worked */
    const act = (tryIt) => () => {
      done.msg = tryIt() || "";
      draw();
    };
    if (q("bh"))
      q("bh").onclick = act(() => {
        const { hundreds } = now();
        if (hundreds - (done.h ? digits(PROBS[problemIndex][1])[0] : 0) < 1)
          return "There are no hundreds left to break.";
        done.bh = 1;
      });
    if (q("bt"))
      q("bt").onclick = act(() => {
        const { tens } = now();
        if (tens - (done.t ? digits(PROBS[problemIndex][1])[1] : 0) < 1)
          return "There are no tens to break. Break a hundred first.";
        done.bt = 1;
      });
    q("to").onclick = act(() => {
      const { tens, ones } = now(),
        onesB = digits(PROBS[problemIndex][1])[2];
      if (ones < onesB)
        return (
          `Only ${cnt(ones, 2)}, and you need to take away ${onesB}. ` +
          (!brk ? "" : tens ? "Break a ten first." : "There are no tens to break. Break a hundred first.")
        );
      done.o = 1;
    });
    q("tt").onclick = act(() => {
      const { tens } = now(),
        tensB = digits(PROBS[problemIndex][1])[1];
      if (tens < tensB) return `Only ${cnt(tens, 1)}, and you need to take away ${tensB}. Break a hundred first.`;
      done.t = 1;
    });
    q("th").onclick = act(() => {
      done.h = 1;
    });
    q("clr").onclick = () => {
      reset();
      draw();
    };
    el.addEventListener("click", (e) => {
      const problemBtn = e.target.closest("[data-m]");
      if (problemBtn) {
        problemIndex = +problemBtn.dataset.m;
        reset();
        draw();
      }
    });
    reset();
    draw();
  };
/* Widget: one problem done different ways. ways: [{label, fig, say}]. Once every way has been seen, it says they all agree. */
const waysW = (eq, ans, ways) => (el) => {
  const q = Q(el),
    seen = new Set();
  let wayIndex = 0;
  el.innerHTML =
    `<p class="eq">${eq} = <b class="q">?</b></p>` +
    seg(
      "Way",
      ways.map((way, i) => [i, way.label]),
    ) +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    press(el, wayIndex);
    seen.add(wayIndex);
    q("f").innerHTML = ways[wayIndex].fig;
    q("r").innerHTML =
      ways[wayIndex].say +
      (seen.size === ways.length
        ? `<br><span class="ok">Every way gets <b>${eq} = ${ans}</b>.</span>`
        : `<br><span class="dimline">Now tap another way.</span>`);
  };
  el.addEventListener("click", (e) => {
    const wayBtn = e.target.closest("[data-m]");
    if (wayBtn) {
      wayIndex = +wayBtn.dataset.m;
      draw();
    }
  });
  draw();
};
