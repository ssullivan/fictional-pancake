// Checklists: each unit's learn/CHECKLIST.md lists every chapter and step of its Learn pages, what each should do as items
// (each with a test script that tests/checklists.spec.js runs), and a quick-check line made from the chapter's code.
//
// tools/check.mjs checks every checklist with checklist(); with --fix it rewrites the headings and quick-check lines.
// The format, for one step:
//
//   ## Chapter 1: Multiples · `learn/multiples.html` · Lesson 1
//   ### Step 1: Skip-count to find multiples
//   - [ ] Counting by 6s, three hops land on 18: `click by 6s; click Hops: one more ×3; see 3 × 6 = 18`
//   - Quick check: … Answer: 30. Mistakes it names: 11, 36, 24.
//
// Test script commands (separated by "; "), all inside the step's widget unless they say otherwise:
//   click NAME [×N]      press the button (or link) with that accessible name, N times
//   tap SELECTOR [×N]    tap the middle of the element the CSS selector finds, like a finger, N times
//   slide NAME = V       move the slider with that name to V
//   see TEXT, nosee TEXT the widget shows (or doesn't show) the text; /…/ for a pattern
//   pressed NAME         that choice button is the pressed one
//   enabled NAME, disabled NAME   that button can (or can't) be pressed
//   count SELECTOR = N   the widget has N elements like that
//   spec FILE: TITLE     another test covers it: tests/FILE has a test with that title
//   read TEXT            the step's text (above the widget) says it
//   answer V             answer the quick check: type V, or pick the choice with id V
//   feedback TEXT        the quick check's reply says it ("Nice!" when the answer was right)
export const plain = s => String(s).replace(/<svg[^]*?<\/svg>/g, '(picture)').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

// the quick-check line for a step
export function quickLine(step) {
  const c = step.check;
  if (!c) return '- No quick check.';
  const q = t => `“${plain(t)}”`;
  const answer = c.kind === 'num' ? `${c.answer}${c.unit ? ' ' + c.unit : ''}` : q(c.choices.find(x => x.id === c.answer).label);
  const wrong = c.kind === 'num' ? (c.misc || []).map(([v]) => v) : c.choices.filter(x => x.id !== c.answer).map(x => q(x.label));
  return `- Quick check: ${plain(c.q)} Answer: ${answer}.${wrong.length ? ` Mistakes it names: ${wrong.join(', ')}.` : ''}`;
}

// read a checklist: the text before the first chapter, and the items of each step ('id/step' → lines)
export function parse(text) {
  const head = text.split(/^## /m)[0], items = new Map();
  let chapter = null, step = null;
  for (const line of text.split('\n')) {
    let m;
    if ((m = line.match(/^## Chapter \d+: .* · `learn\/([\w-]+)\.html`/))) { chapter = m[1]; step = null; }
    else if ((m = line.match(/^### Step (\d+):/))) { step = `${chapter}/${m[1]}`; items.set(step, []); }
    else if (step && /^- \[[ x]\] /.test(line)) items.get(step).push(line);
  }
  return {head, items};
}

// the checklist as it should be, given the unit (UNIT) and each chapter's steps ({id: STEPS}), keeping the items written so far
export function render(unit, steps, text) {
  const {head, items} = parse(text), out = [head.trimEnd(), ''];
  unit.chapters.forEach((c, ci) => {
    out.push(`## Chapter ${ci + 1}: ${c.title} · \`learn/${c.id}.html\` · ${c.lessons}`, '');
    steps[c.id].forEach((s, si) => {
      out.push(`### Step ${si + 1}: ${s.title}`, ...(items.get(`${c.id}/${si + 1}`) || []), quickLine(s), '');
    });
  });
  return out.join('\n');
}

// what's wrong with a checklist: out of date, a step with no items, an item without a test script, or items for a step that's gone
export function problems(unit, steps, text) {
  const bad = [], {items} = parse(text), want = render(unit, steps, text);
  const keys = new Set(unit.chapters.flatMap(c => steps[c.id].map((_, si) => `${c.id}/${si + 1}`)));
  for (const k of items.keys()) if (!keys.has(k)) bad.push(`items for ${k}, which isn't a step any more`);
  if (want !== text) bad.push('headings or quick-check lines are out of date (node tools/check.mjs --fix)');
  for (const k of keys) {
    const its = items.get(k) || [];
    if (!its.length) bad.push(`${k} has no checklist items`);
    for (const line of its) if (!/: `[^`]+`$/.test(line)) bad.push(`${k}: "${line.slice(6, 60)}…" has no test script`);
  }
  return bad;
}
