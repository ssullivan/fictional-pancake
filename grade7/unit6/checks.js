/* Code Breakers: limits and real-world checks for tools/fuzz.mjs. Answers may be negative (signed), and max limits their
   size. Per station: dp = most decimal places, nz = most nonzero digits, max = largest value, for the answer and every
   number in the prompt. check() puts every answer back into its equation or inequality, works out each expression choice
   at a few values of x (only the answer may match), and checks budgets and goals by trying every whole number. */
const close = (a, b) => Math.abs(a - b) < 1e-9;
/* a label as plain text, with plain minus signs */
const plain = (html) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/−/g, "-")
    .replace(/\s+/g, " ")
    .trim();
const answerLabel = (p) => plain(p.choices.find((c) => c.id === p.answer).label);
/* an expression in x as written (3(2x + 5), -x - 4) turned into a function of x */
const toFunction = (text) =>
  new Function("x", "return " + text.replace(/(\d|\))\s*(x|\()/g, "$1*$2").replace(/(^|[^\d)])x/g, "$1(x)"));
/* does v make "v sign b" true? */
const holds = (v, sign, b) => (sign === ">" ? v > b : sign === "<" ? v < b : sign === "≥" ? v >= b : v <= b);
module.exports = {
  signed: true,
  limits: {
    tape: { dp: 2, nz: 3, max: 120 },
    solve: { dp: 0, nz: 3, max: 200 },
    story: { dp: 2, nz: 3, max: 120 },
    ineq: { dp: 0, nz: 2, max: 60 },
    model: { dp: 0, nz: 2, max: 150 },
    equiv: { dp: 0, nz: 2, max: 60 },
  },
  // what's wrong with problem p (an empty list when nothing is), from the facts it carries
  check(p) {
    const bad = [],
      facts = p.facts || {};
    if (!facts.t) return ["no facts for checks.js"];
    const wrongAnswer = (want) => {
      if (p.kind === "num" && !close(p.answer, want)) bad.push(`answer ${p.answer}, but it works out to ${want}`);
    };
    // tape diagrams: the choice is the equation of the tape's kind, and the unknown fits it
    if ((facts.t === "match" || facts.t === "story") && p.kind === "mc") {
      const want = facts.groups ? `${facts.p}(x + ${facts.q}) = ${facts.r}` : `${facts.p}x + ${facts.q} = ${facts.r}`;
      if (answerLabel(p) !== want) bad.push(`"${answerLabel(p)}" isn't ${want}`);
    }
    if (facts.t === "find") wrongAnswer(facts.groups ? facts.r / facts.p - facts.q : (facts.r - facts.q) / facts.p);
    if (facts.r !== undefined && facts.p > 0 && facts.q > 0 && (facts.t === "find" || facts.t.startsWith("story"))) {
      const value =
        facts.t === "storyGroups" || facts.groups ? facts.r / facts.p - facts.q : (facts.r - facts.q) / facts.p;
      if (!(Number.isInteger(value) && value > 0)) bad.push(`an unknown of ${value}`);
    }
    // equations: put the answer back in
    if (facts.t === "sum" && !close(facts.p * p.answer + facts.q, facts.r))
      bad.push("the answer doesn't solve px + q = r");
    if (facts.t === "groups" && !close(facts.p * (p.answer + facts.q), facts.r))
      bad.push("the answer doesn't solve p(x + q) = r");
    if (facts.t === "storySum" && !close(facts.p * p.answer + facts.q, facts.r)) bad.push("the story's answer is off");
    if (facts.t === "storyGroups" && !close(facts.p * (p.answer + facts.q), facts.r))
      bad.push("the story's answer is off");
    if (facts.t === "percent") {
      wrongAnswer(facts.price);
      if (!close((facts.price * (100 - facts.off)) / 100 + facts.fee, facts.paid)) bad.push("the total paid is off");
    }
    // inequalities
    if (facts.t === "graph") {
      const m = answerLabel(p).match(/^x (.) (-?\d+)$/);
      if (!m || m[1] !== facts.sign || +m[2] !== facts.b)
        bad.push(`"${answerLabel(p)}" isn't x ${facts.sign} ${facts.b}`);
    }
    if (facts.t === "test") {
      const yes = holds(facts.p * facts.v + facts.q, facts.sign, facts.edge);
      if (/^Yes/.test(answerLabel(p)) !== yes) bad.push("yes or no is the wrong way round");
    }
    if (facts.t === "solve") {
      const m = answerLabel(p).match(/^x (.) (-?\d+)$/);
      if (!m) bad.push(`"${answerLabel(p)}" isn't an inequality`);
      else
        for (const t of [+m[2] - 1, +m[2], +m[2] + 1])
          if (holds(t, m[1], +m[2]) !== holds(facts.p * t + facts.q, facts.sign, facts.r))
            bad.push(`x = ${t} goes the wrong way in "${answerLabel(p)}"`);
    }
    // budgets and goals: try every whole number
    if (facts.t === "most") {
      let most = 0;
      while (facts.fee + facts.each * (most + 1) <= facts.budget) most++;
      wrongAnswer(most);
    }
    if (facts.t === "least") {
      let fewest = 0;
      while (facts.start + facts.each * fewest < facts.goal) fewest++;
      wrongAnswer(fewest);
    }
    // equivalent expressions: only the answer matches a·x + b at several values of x
    if (facts.expr) {
      const [a, b] = facts.expr;
      p.choices.forEach((c) => {
        const f = toFunction(plain(c.label)),
          same = [-2, 1, 3].every((v) => close(f(v), a * v + b));
        if (same !== (c.id === p.answer)) bad.push(`"${plain(c.label)}" ${same ? "is" : "isn't"} equivalent`);
      });
    }
    return bad;
  },
};
