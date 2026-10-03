// Deals thousands of problems from every station of every game and checks each one.
//
//   node tools/fuzz.mjs                 every game (grade*/unit*/stations.js)
//   node tools/fuzz.mjs grade6/unit3    one game
//   N=20000 node tools/fuzz.mjs         more problems per station (default 5000)
//
// Each game's stations.js is loaded the way its index.html loads it: the shared scripts it lists
// (except engine.js, which needs a page) and then stations.js, all in one context like browser scripts.
// Every problem gets the checks below. A game adds its own limits in checks.js next to stations.js:
//   module.exports = {
//     limits: {zoneId: {dp, nz, max}},   most decimal places, most nonzero digits, largest value, for the
//                                        answer and every number in the prompt (the boss gets the widest)
//     check: (p, zoneId) => [messages],   optional real-world checks; an empty list when the problem is fine
//   };
import {readFileSync, existsSync, globSync} from 'node:fs';
import {join, resolve, dirname} from 'node:path';
import vm from 'node:vm';

const ROOT = resolve(import.meta.dirname, '..');
const N = +process.env.N || 5000;
const games = process.argv.slice(2).length ? process.argv.slice(2) : globSync('grade*/unit*/stations.js', {cwd: ROOT}).map(dirname).sort();

// the text a student sees must never show a broken value
const BROKEN = /NaN|undefined|Infinity|\[object |\bnull\b/;
const KINDS = ['num', 'pair', 'mc', 'tap'];

function load(game, stars) {
  const html = readFileSync(join(ROOT, game, 'index.html'), 'utf8');
  const srcs = [...html.matchAll(/<script src="([^"?]+)(?:\?[^"]*)?"><\/script>/g)].map(m => m[1]).filter(s => !s.endsWith('/engine.js'));
  // Game.stars stands in for saved progress, so generators that unlock harder problems get tested both ways
  const ctx = vm.createContext({console, Game: {stars: () => stars}});
  for (const src of srcs) vm.runInContext(readFileSync(join(ROOT, game, src), 'utf8'), ctx, {filename: join(game, src)});
  return vm.runInContext('({zones: ZONES, icons: ICON, problemKey, fmt: typeof fmt === "function" ? fmt : null})', ctx);
}

// every string a student can see for this problem, labelled
function texts(p) {
  const out = [['prompt', p.prompt], ['explain', p.explain]];
  if (p.hint !== undefined) out.push(['hint', p.hint]);
  if (p.unit !== undefined) out.push(['unit', p.unit]);
  (p.misc || []).forEach(([v, m], i) => out.push([`misc[${i}]`, m]));
  (p.pmisc || []).forEach(([v, m], i) => out.push([`pmisc[${i}]`, m]));
  (p.choices || []).forEach((c, i) => out.push([`choice ${c.id}`, c.label]));
  Object.entries(p.why || {}).forEach(([id, m]) => { if (id !== String(p.answer)) out.push([`why ${id}`, m]); });  // the right answer's is never shown
  (p.labels || []).forEach((l, i) => out.push([`label[${i}]`, l]));
  if (p.fig) for (const show of [false, true]) out.push([`fig(${show})`, figure(p, show)]);
  return out;
}
function figure(p, show) {
  if (typeof p.fig === 'function') return p.fig(show, show);
  if (p.fig && typeof p.fig.svg === 'function') return p.fig.svg(show, show ? ['build'] : []);  // Unit 1's Fig
  return String(p.fig);
}

// how the engine matches typed numbers (its default near, and sameRatio for pairs)
const near = (a, b) => Math.abs(a - b) < .011;
const sameRatio = (u, v, x, y) => u > 0 && v > 0 && near(u * y, v * x);
// A named mistake (misc, pmisc) whose wrong value is the right answer: a student making that mistake gets it right. When the
// mistake doesn't apply to these numbers, the generator leaves it out; when a wrong method lands on the answer, it deals others.
const mistakes = (list, isAnswer) => (list || []).filter(([v]) => isAnswer(v))
  .map(([v, m]) => `mistake "${String(m).replace(/<[^>]*>/g, '').slice(0, 60)}" gives the right answer ${JSON.stringify(v)}`);

function check(p) {
  const bad = [];
  if (!p || typeof p !== 'object') return ['gen() did not return a problem'];
  if (!KINDS.includes(p.kind)) bad.push(`unknown kind ${p.kind}`);
  for (const [name, t] of texts(p)) {
    if (typeof t !== 'string' || !t.trim()) { if (name !== 'unit') bad.push(`${name} is empty`); continue; }
    if (BROKEN.test(t.replace(/<[^>]*>/g, ' ').replace(/data-[a-z]+="[^"]*"/g, ''))) bad.push(`${name} shows a broken value: ${t.slice(0, 160)}`);
  }
  if (p.kind === 'num') {
    if (!Number.isFinite(p.answer)) bad.push(`answer is ${p.answer}`);
    (p.misc || []).forEach(([v], i) => { if (!Number.isFinite(v)) bad.push(`misc[${i}] value is ${v}`); });
    bad.push(...mistakes(p.misc, v => near(v, p.answer)));
  }
  if (p.kind === 'pair') {
    if (!Array.isArray(p.answer) || p.answer.length !== 2 || !p.answer.every(Number.isFinite)) bad.push(`pair answer is ${JSON.stringify(p.answer)}`);
    if (!Array.isArray(p.labels) || p.labels.length !== 2) bad.push('pair needs two labels');
    const [x, y] = p.answer || [];
    bad.push(...mistakes(p.pmisc, ([u, v]) => p.equiv ? sameRatio(u, v, x, y) : near(u, x) && near(v, y)));
  }
  if (p.kind === 'mc') {
    const ids = p.choices.map(c => c.id), labels = p.choices.map(c => c.label.replace(/\s+/g, ' ').trim());
    if (p.choices.length < 2) bad.push('fewer than 2 choices');
    if (new Set(ids).size !== ids.length) bad.push(`duplicate choice ids: ${ids}`);
    if (new Set(labels).size !== labels.length) bad.push(`duplicate choices: ${labels.join(' | ')}`);
    if (!ids.includes(p.answer)) bad.push(`answer ${p.answer} is not a choice`);
  }
  if (p.kind === 'tap') {
    const svg = figure(p, false), cands = [...svg.matchAll(/class="cand[^"]*"[^>]*data-id="([^"]+)"|data-id="([^"]+)"[^>]*class="cand/g)].map(m => m[1] || m[2]);
    if (!cands.includes(String(p.answer))) bad.push(`tap answer ${p.answer} is not in the figure`);
    if (new Set(cands).size < 2) bad.push('tap figure has fewer than 2 things to tap');
  }
  return bad;
}

// numbers as written: decimal places and nonzero digits
const dp = v => (String(Math.round(v * 1e6) / 1e6).split('.')[1] || '').length;
const nz = v => String(Math.round(v * 1e6) / 1e6).replace(/[^1-9]/g, '').length;
function withinLimits(p, lim) {
  const bad = [], nums = [...p.prompt.replace(/<[^>]*>/g, ' ').matchAll(/\d[\d,]*(?:\.\d+)?/g)].map(m => +m[0].replace(/,/g, ''));
  const answers = p.kind === 'num' ? [p.answer] : p.kind === 'pair' ? p.answer : [];
  for (const a of answers) if (!(a > 0)) bad.push(`answer ${a} is not positive`);
  for (const [what, v] of [...answers.map(a => ['answer', a]), ...nums.map(n => ['prompt number', n])]) {
    if (dp(v) > lim.dp) bad.push(`${what} ${v} has more than ${lim.dp} decimal places`);
    if (nz(v) > lim.nz) bad.push(`${what} ${v} has more than ${lim.nz} nonzero digits`);
    if (v > lim.max) bad.push(`${what} ${v} is over ${lim.max}`);
  }
  return bad;
}

let failures = 0, dealt = 0;
for (const game of games) {
  const extra = existsSync(join(ROOT, game, 'checks.js')) ? (await import(join(ROOT, game, 'checks.js'))).default : {};
  if (!extra.limits) { console.log(`FAIL ${game}: no limits in checks.js`); failures++; }
  for (const stars of [0, 3]) {
    const {zones, icons, problemKey} = load(game, stars);
    for (const z of zones) {
      if (stars === 0 && !icons[z.id]) { console.log(`FAIL ${game} ${z.id}: no icon`); failures++; }
      const limits = extra.limits || {}, lim = limits[z.id] || (z.id === 'boss' && Object.keys(limits).length &&
        Object.values(limits).reduce((a, b) => ({dp: Math.max(a.dp, b.dp), nz: Math.max(a.nz, b.nz), max: Math.max(a.max, b.max)})));
      if (stars === 0 && extra.limits && !lim) { console.log(`FAIL ${game} ${z.id}: no limits in checks.js`); failures++; }
      const seen = new Map(), different = new Set();
      for (let i = 0; i < N; i++) {
        let p, bad;
        try {
          p = z.gen(); bad = check(p); different.add(problemKey(p));
          if (!bad.length && lim) bad = withinLimits(p, lim);
          if (!bad.length && extra.check) bad = extra.check(p, z.id);
        }
        catch (e) { bad = [`threw ${e.stack.split('\n').slice(0, 3).join(' ')}`]; }
        dealt++;
        for (const b of bad) {
          const key = b.replace(/\d+(\.\d+)?/g, '#').slice(0, 80);
          if (!seen.has(key)) seen.set(key, {n: 0, b, prompt: p && p.prompt});
          seen.get(key).n++;
        }
      }
      // the engine deals again rather than repeat a problem in a round, so a station needs plenty to deal from
      const round = z.id === 'boss' ? 10 : 8;
      if (different.size < 2 * round) { console.log(`FAIL ${game} ${z.id}${stars ? ' (unlocked)' : ''}: only ${different.size} different problems; a round of ${round} needs at least ${2 * round} to deal from`); failures++; }
      for (const {n, b, prompt} of seen.values()) {
        failures++;
        console.log(`FAIL ${game} ${z.id}${stars ? ' (unlocked)' : ''}: ${b}  [${n}×]\n     ${String(prompt).replace(/<[^>]*>/g, '').slice(0, 200)}`);
      }
    }
  }
}
console.log(`${dealt} problems from ${games.length} game(s), ${failures} kind(s) of failure`);
process.exit(failures ? 1 : 0);
