/* Game engine shared by every game: a home screen of stations (zones), rounds of 8 problems (10 for the boss, never the same
   one twice in a round), 10 points for a first-try answer and 5 after a miss or a hint, stars saved in localStorage.
   Needs util.js (and speak.js with readAloud). Screens and ids are in the page's HTML (#home, #play, #done); styles are in game.css.

   Game.init({
     saveKey: 'g6u3-save',          localStorage key; unique across the whole site
     zones: [{id, name, lessons, blurb, gen}],   gen() deals one problem; the zone with id 'boss' is the final round
     icons: {zoneId: '<svg markup, 64×64 viewBox>'},
     words: {
       right: 'Nailed it!',         title after a right answer
       miss: 'Not quite. …',        fallback message when a wrong number matches no known mistake
       titles: [0★, 1★, 2★, 3★],    results title for each star count
       next: 'Try the next station, or go for the Final Lap.',   results message at 3 stars
       stuck: 'Use "Show me a hint" when you’re stuck. …',       results message at 0–1 stars
       tap: 'Tap your answer in the picture.',                     note under a tap problem
     },
     readAloud?: true,              a "Read to me" button that reads the problem, its choices, and the feedback (young readers)
     near: (x, y) => boolean,       optional: how close a typed number must be (default ±0.011)
     figure: (p, show) => html,     optional: draw p.fig another way (default p.fig(show, done))
     zoneNote: zone => html,        optional: extra line on a station card
     onQuestion: state => {},       optional: runs before each problem is shown
     onMiss: msg => boolean,        optional: runs after a wrong answer; return true to take over the screen
     onAnswer: (state, ok) => {},   optional: runs when a problem ends, right (ok) or out of tries
   })

   A problem from gen() is {kind, prompt, explain, hint?, fig?} plus, by kind:
     num:  answer, unit, misc?: [[wrong value, message]], frac?: true when the answer may be a fraction or mixed number
           (a keyboard with / and space on phones, instead of the decimal keypad)
     pair: answer: [x, y], labels: [x label, y label], equiv?: any equivalent ratio counts, pmisc?: [[[x, y], message]]
     mc:   answer: choice id, choices: [{id, label}], why?: {choice id: message}, stack?: one choice per row
     tap:  answer: id of the right .cand element in the figure (data-id), why?: {id: message}
   A 2-choice mc problem gets one try; everything else gets two.
   Links can start a station directly: index.html#<zone id>.

   Also: Game.state (the round in progress), Game.stars(zoneId) (best stars so far), and
   Game.drawFig, Game.finishQ, Game.advance for games that add their own answer modes.
   Game.state, which the hooks also get, is null before the first round and otherwise {
     z: the zone being played,  i: which problem this is (0 first),  n: how many problems the round has,
     p: the problem on screen,  tries: answers checked so far,  hinted: the hint was shown,  done: the problem is over,
     pts: points this round,  streak: right answers in a row,  seen: problemKeys dealt this round,
     marks: {id: 'right' | 'wrong'} for tapped .cand elements
   }; a game may add its own fields (Unit 1's build). */
const Game = (() => {
  let cfg,
    save,
    round = null;
  /* is a typed number x close enough to y? */
  const near = (x, y) => (cfg.near || ((a, b) => Math.abs(a - b) < 0.011))(x, y);
  /* is u : v the same ratio as x : y (both positive)? Compared by cross-multiplying, so no dividing by zero */
  const sameRatio = (u, v, x, y) => u > 0 && v > 0 && near(u * y, v * x);
  const persist = () => {
    try {
      localStorage.setItem(cfg.saveKey, JSON.stringify(save));
    } catch (e) {}
  };
  const starSvg = (on) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true"><polygon class="${on ? "star-on" : "star-off"}" points="12,2 15,9 22.5,9.3 16.6,14 18.7,21.5 12,17.2 5.3,21.5 7.4,14 1.5,9.3 9,9"/></svg>`;
  /* three stars, the first `lit` of them filled in */
  const starRow = (lit) => [0, 1, 2].map((i) => starSvg(i < lit)).join("");
  const hush = () => {
    if (typeof Say !== "undefined") Say.hush();
  };

  /* ---------- screens ---------- */
  /* show one screen ('home', 'play', or 'done') and hide the others */
  function showScreen(id) {
    ["home", "play", "done"].forEach((s) => ($(s).hidden = s !== id));
    window.scrollTo(0, 0);
  }
  /* the home screen: total points and stars, and a card for each station with its best stars */
  function renderHome() {
    $("hp").textContent = save.points;
    $("hs").textContent = Object.values(save.stars).reduce((a, b) => a + b, 0);
    $("hsMax").textContent = cfg.zones.length * 3;
    $("zones").innerHTML = cfg.zones
      .map((zone) => {
        const stars = save.stars[zone.id] || 0;
        return `
    <button class="zone ${zone.id === "boss" ? "boss" : ""}" data-z="${zone.id}" type="button">
      <svg class="icon" viewBox="0 0 64 64" aria-hidden="true">${cfg.icons[zone.id]}</svg>
      <p class="eyebrow">${zone.lessons}</p>
      <h3>${zone.name}</h3>
      <p>${zone.blurb}</p>${cfg.zoneNote ? cfg.zoneNote(zone) : ""}
      <span class="meta"><span class="stars" aria-label="${stars} of 3 stars">${starRow(stars)}</span><span class="go">Play →</span></span>
    </button>`;
      })
      .join("");
  }

  /* ---------- a round ---------- */
  function startRound(zoneId) {
    const zone = cfg.zones.find((z) => z.id === zoneId);
    round = { z: zone, i: 0, n: zoneId === "boss" ? 10 : 8, pts: 0, streak: 0, seen: new Set() };
    $("zname").textContent = zone.name;
    showScreen("play");
    nextProblem();
  }
  function advance() {
    round.i++;
    nextProblem();
  }
  function nextProblem() {
    hush();
    if (round.i >= round.n) return finishRound();
    /* deal again when this round already had the problem (problemKey, util.js); after 20 tries, allow the repeat */
    let key;
    for (let attempt = 0; attempt < 20; attempt++) {
      round.p = round.z.gen();
      key = problemKey(round.p);
      if (!round.seen.has(key)) break;
    }
    round.seen.add(key);
    round.tries = 0;
    round.hinted = false;
    round.done = false;
    round.marks = {};
    if (cfg.onQuestion) cfg.onQuestion(round);
    renderProblem();
  }
  /* (re)draw the problem's picture: values the hint reveals show once there's a hint or the problem is over,
     and tapped .cand elements keep their right/wrong color */
  function drawFig() {
    const problem = round.p,
      fig = $("fig");
    fig.hidden = !problem.fig;
    if (!problem.fig) return;
    const reveal = round.hinted || round.done;
    fig.innerHTML = cfg.figure ? cfg.figure(problem, reveal) : problem.fig(reveal, round.done);
    Object.entries(round.marks).forEach(([id, cls]) => {
      const el = fig.querySelector(`.cand[data-id="${id}"]`);
      if (el) el.classList.add(cls);
    });
  }
  function setStreak() {
    $("streak").innerHTML = `Streak <b>${round.streak}</b>`;
    $("streak").classList.toggle("hot", round.streak >= 3);
  }
  /* the answer area for a problem: number boxes and Check (num, pair), choice buttons (mc), or a note to tap the picture (tap) */
  function answerHtml(problem) {
    const hintBtn = problem.hint ? `<button type="button" class="link-btn" id="hintBtn">Show me a hint</button>` : "";
    if (problem.kind === "num") {
      /* a fraction answer needs / and space, so it gets the full keyboard instead of the number pad */
      const keyboard = problem.frac
        ? 'inputmode="text" placeholder="like 2 1/3"'
        : 'inputmode="decimal" placeholder="?"';
      const fields = `<label for="inp" class="sr">Your answer</label><input id="inp" ${keyboard}><span class="unit">${problem.unit}</span>`;
      return `<form class="ans" id="af" autocomplete="off">${fields}<button class="btn" id="checkBtn">Check</button></form><div class="tools" style="margin-top:12px">${hintBtn}</div>`;
    }
    if (problem.kind === "pair") {
      const [xLabel, yLabel] = problem.labels;
      const fields =
        `<span class="pairlab"><input id="inp" class="sm" inputmode="decimal" placeholder="?" aria-label="Number of ${xLabel}"><small>${xLabel}</small></span>` +
        `<span class="colon">:</span>` +
        `<span class="pairlab"><input id="inp2" class="sm" inputmode="decimal" placeholder="?" aria-label="Number of ${yLabel}"><small>${yLabel}</small></span>`;
      return `<form class="ans" id="af" autocomplete="off">${fields}<button class="btn" id="checkBtn">Check</button></form><div class="tools" style="margin-top:12px">${hintBtn}</div>`;
    }
    if (problem.kind === "mc") {
      const buttons = problem.choices
        .map((c) => `<button type="button" class="choice" data-c="${c.id}">${c.label}</button>`)
        .join("");
      return `<div class="choices${problem.stack ? " stack" : ""}">${buttons}</div><div class="tools" style="margin-top:12px">${hintBtn}</div>`;
    }
    return `<div class="tools"><span class="tapnote">${cfg.words.tap || "Tap your answer in the picture."}</span>${hintBtn}</div>`;
  }
  function renderProblem() {
    const problem = round.p;
    $("qnum").textContent = `Problem ${round.i + 1} of ${round.n}`;
    $("prompt").innerHTML = problem.prompt;
    $("prog").style.width = (round.i / round.n) * 100 + "%";
    $("pts").textContent = round.pts;
    setStreak();
    $("hint").hidden = true;
    $("feedback").innerHTML = "";
    drawFig();
    $("answer").innerHTML = answerHtml(problem);
    if (problem.kind === "num" || problem.kind === "pair") {
      /* Enter checks the answer, or goes on once the problem is over */
      $("af").addEventListener("submit", (e) => {
        e.preventDefault();
        if (round.done) return advance();
        submit(problem.kind === "num" ? $("inp").value : [$("inp").value, $("inp2").value]);
      });
      /* focus the first box for a mouse and keyboard (not on a phone, where it would pop up the keyboard),
         unless the player is already in one */
      setTimeout(() => {
        const input = $("inp"),
          form = $("af");
        if (input && !(form && form.contains(document.activeElement)) && window.matchMedia("(pointer:fine)").matches)
          input.focus();
      }, 30);
    } else if (problem.kind === "mc") {
      $("answer")
        .querySelectorAll(".choice")
        .forEach((b) =>
          b.addEventListener("click", () => {
            if (!round.done && !b.disabled) submit(b.dataset.c);
          }),
        );
    }
    const hintBtn = $("hintBtn");
    if (hintBtn) hintBtn.addEventListener("click", showHint);
  }
  function showHint() {
    if (round.hinted) return;
    round.hinted = true;
    drawFig();
    $("hint").innerHTML = round.p.hint;
    $("hint").hidden = false;
    const hintBtn = $("hintBtn");
    if (hintBtn) hintBtn.disabled = true;
  }
  /* Marks a choice right ('yes') or wrong ('no'): a choice button, or a .cand element in a tap figure. */
  function mark(id, verdict) {
    if (round.p.kind === "tap") {
      round.marks[id] = verdict === "yes" ? "right" : "wrong";
      return drawFig();
    }
    const b = $("answer").querySelector(`.choice[data-c="${id}"]`);
    if (b) {
      b.classList.add(verdict);
      if (verdict === "no") b.disabled = true;
    }
  }
  /* Checks an answer: a typed string (num), two typed strings (pair), or a choice or .cand id (mc, tap). A right answer ends the
     problem. A wrong one shows its named mistake (misc, pmisc, why) and allows another try, or ends the problem when out of tries. */
  function submit(value) {
    if (round.done) return;
    const problem = round.p;
    let ok, msg;
    if (problem.kind === "num") {
      const n = parseNum(value);
      if (isNaN(n)) {
        $("feedback").innerHTML = '<div class="fb info"><p>Type a number first.</p></div>';
        return;
      }
      ok = near(n, problem.answer);
      if (!ok) {
        const mistake = (problem.misc || []).find(([wrong]) => near(n, wrong));
        msg = mistake ? mistake[1] : cfg.words.miss;
      }
    } else if (problem.kind === "pair") {
      const [u, v] = value.map(parseNum);
      if (isNaN(u) || isNaN(v)) {
        $("feedback").innerHTML = '<div class="fb info"><p>Fill in both numbers first.</p></div>';
        return;
      }
      const [x, y] = problem.answer;
      ok = problem.equiv ? sameRatio(u, v, x, y) : near(u, x) && near(v, y);
      if (!ok) {
        const mistake = (problem.pmisc || []).find(([[wx, wy]]) => sameRatio(u, v, wx, wy));
        msg = mistake ? mistake[1] : "Not quite. Count each kind again.";
      }
    } else {
      ok = value === problem.answer;
      if (!ok) msg = (problem.why && problem.why[value]) || "Not quite.";
    }
    round.tries++;
    const picked = problem.kind === "mc" || problem.kind === "tap";
    if (ok) {
      const gain = round.tries === 1 && !round.hinted ? 10 : 5;
      round.pts += gain;
      round.streak++;
      if (picked) mark(value, "yes");
      return finishQ(true, `${cfg.words.right} +${gain}`, "");
    }
    round.streak = 0;
    setStreak();
    /* with only two choices, a second try would give the answer away */
    const maxTries = problem.kind === "mc" && problem.choices.length === 2 ? 1 : 2;
    if (picked) mark(value, "no");
    if (cfg.onMiss && cfg.onMiss(msg)) return;
    if (round.tries < maxTries) {
      $("feedback").innerHTML =
        `<div class="fb bad"><h4>Not yet</h4><p>${msg}</p><p>Try once more${round.hinted || !problem.hint ? "" : ", or tap <b>Show me a hint</b>"}.</p></div>`;
      const input = $("inp");
      if (input) input.select();
      return;
    }
    if (picked) mark(problem.answer, "yes");
    finishQ(false, "Here’s how it works", msg);
  }
  /* Ends the problem: shows the worked answer and a Next button. */
  function finishQ(ok, title, msg) {
    round.done = true;
    if (cfg.onAnswer) cfg.onAnswer(round, ok);
    drawFig();
    $("pts").textContent = round.pts;
    setStreak();
    $("answer")
      .querySelectorAll("button")
      .forEach((b) => (b.disabled = true));
    $("answer")
      .querySelectorAll("input")
      .forEach((i) => (i.readOnly = true));
    const last = round.i + 1 >= round.n;
    $("feedback").innerHTML =
      `<div class="fb ${ok ? "good" : "bad"}"><h4>${title}</h4>${msg ? `<p>${msg}</p>` : ""}<p class="work">${round.p.explain}</p><button type="button" class="btn" id="nextBtn">${last ? "See results" : "Next problem →"}</button></div>`;
    $("nextBtn").addEventListener("click", advance);
    $("nextBtn").focus({ preventScroll: true });
    $("feedback").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  /* The results screen: 3 stars for 90% of the points, 2 for 70%, 1 for 50%. Saves the best stars and adds up the points. */
  function finishRound() {
    const max = round.n * 10,
      share = round.pts / max,
      stars = share >= 0.9 ? 3 : share >= 0.7 ? 2 : share >= 0.5 ? 1 : 0;
    save.stars[round.z.id] = Math.max(save.stars[round.z.id] || 0, stars);
    save.points += round.pts;
    persist();
    $("dzone").textContent = round.z.name;
    $("dstars").innerHTML = starRow(stars);
    $("dtitle").textContent = cfg.words.titles[stars];
    $("dmsg").textContent =
      `You scored ${round.pts} of ${max} points. ` +
      (stars === 3 ? cfg.words.next : stars === 2 ? "One more round could get you 3 stars." : cfg.words.stuck);
    showScreen("done");
  }

  /* ---------- tap answers ---------- */
  /* How far the point (x, y) on screen is from the line inside a .cand element (0 when it has no line). */
  function lineDist(cand, x, y) {
    const line = cand.querySelector("line.seg,line");
    if (!line) return 0;
    /* the line's two ends in screen pixels */
    const toScreen = line.getScreenCTM(),
      end = (ax, ay) => {
        const p = new DOMPoint(+line.getAttribute(ax), +line.getAttribute(ay)).matrixTransform(toScreen);
        return [p.x, p.y];
      };
    const [x1, y1] = end("x1", "y1"),
      [x2, y2] = end("x2", "y2"),
      dx = x2 - x1,
      dy = y2 - y1;
    /* t is how far along the line (0 at one end, 1 at the other) the nearest point is */
    const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy || 1)));
    return Math.hypot(x - x1 - t * dx, y - y1 - t * dy);
  }
  /* A tap answers with the .cand under it. Where tap areas overlap (a line's area is wider than the line), the one whose
     line is nearest the pointer wins, not the one drawn last. Keyboard presses use the focused .cand. Returns true when it answered. */
  function tap(e) {
    let cand = e.target.closest(".cand");
    /* e.detail is 0 for a click made with the keyboard */
    if (e.type === "click" && e.detail) {
      const under = document
        .elementsFromPoint(e.clientX, e.clientY)
        .map((el) => el.closest(".cand"))
        .filter((c) => c && !c.classList.contains("wrong"));
      const open = [...new Set(under)];
      if (open.length)
        cand = open.reduce((best, c) =>
          lineDist(c, e.clientX, e.clientY) < lineDist(best, e.clientX, e.clientY) ? c : best,
        );
    }
    if (cand && round && !round.done && round.p.kind === "tap" && !cand.classList.contains("wrong")) {
      submit(cand.dataset.id);
      return true;
    }
  }

  function init(config) {
    cfg = config;
    save = { stars: {}, points: 0 };
    try {
      const saved = JSON.parse(localStorage.getItem(cfg.saveKey) || "null");
      if (saved && typeof saved === "object") save = Object.assign(save, saved);
    } catch (e) {}
    $("zones").addEventListener("click", (e) => {
      const b = e.target.closest(".zone");
      if (b) startRound(b.dataset.z);
    });
    $("fig").addEventListener("click", tap);
    $("fig").addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && tap(e)) e.preventDefault();
    });
    $("quit").addEventListener("click", () => {
      hush();
      renderHome();
      showScreen("home");
    });
    /* read the problem, then its choices, then any hint and feedback; never the picture, which could give the answer away */
    if (cfg.readAloud && typeof Say !== "undefined" && Say.ok()) {
      $("prompt").before(
        Say.btn("Read to me", () => [
          $("prompt"),
          ...$("answer").querySelectorAll(".choice"),
          ...($("hint").hidden ? [] : [$("hint")]),
          ...$("feedback").querySelectorAll("h4,p:not(.work)"),
        ]),
      );
    }
    $("again").addEventListener("click", () => startRound(round.z.id));
    $("tomap").addEventListener("click", () => {
      renderHome();
      showScreen("home");
    });
    renderHome();
    /* index.html#<zone id> starts that station */
    const zoneId = location.hash.slice(1);
    if (cfg.zones.some((z) => z.id === zoneId)) startRound(zoneId);
  }

  return {
    init,
    drawFig,
    finishQ,
    advance,
    stars: (id) => save.stars[id] || 0,
    get state() {
      return round;
    },
  };
})();
