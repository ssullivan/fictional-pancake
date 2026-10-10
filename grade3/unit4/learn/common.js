/* Learn Relating Multiplication to Division (Grade 3 Unit 4): code used by more than one chapter. Loaded by the chapter pages
   in learn/, after ../figs.js (dealFig, timesTable, tableRow) and chapters.js. */
/* n and the word for it: "1 group", "3 groups" (plural: the word for more than one) */
const pl = (n, word, plural = word + "s") => `${n} ${n === 1 ? word : plural}`;

/* Widget: a problem picked with a row of buttons, worked one step at a time with Next and Start over. problems: [{label,
   steps}], where steps is how many steps the problem has. show(problem, made) returns {fig, text}: the picture and what to
   say once `made` steps are done (0 before any). next: what the Next button says. */
const stepsWidget =
  (problems, show, next = "Next step") =>
  (el) => {
    /* made: how many steps of the picked problem are done */
    const q = Q(el);
    let problemIndex = 0,
      made = 0;
    el.innerHTML =
      seg(
        "Problem",
        problems.map((problem, i) => [i, problem.label]),
      ) +
      `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>${next}</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
    const draw = () => {
      const problem = problems[problemIndex],
        { fig, text } = show(problem, made);
      press(el, problemIndex);
      q("go").disabled = made === problem.steps;
      q("f").innerHTML = fig;
      q("r").innerHTML = text;
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
      problemIndex = +id;
      made = 0;
      draw();
    });
    draw();
  };
