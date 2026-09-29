// Run before every commit:
//
//   node tools/check.mjs          check links, cache stamps, Learn chapter pages, and generators (tools/fuzz.mjs)
//   node tools/check.mjs --fix    also rewrite stale cache stamps
//
// Cache stamps: every local stylesheet and script a page loads is referenced as file.js?v=<hash of its contents>.
// GitHub Pages lets browsers cache files for 10 minutes, so without the stamp a returning visitor could get new
// HTML with an old shared/engine.js. The stamp changes whenever the file does, so the new copy is fetched.
import {readFileSync, writeFileSync, existsSync, statSync, globSync} from 'node:fs';
import {join, dirname, resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';
import {render, problems as listProblems} from './checklists.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const fix = process.argv.includes('--fix');
const pages = globSync('**/*.html', {cwd: ROOT, exclude: ['node_modules/**', '.git/**', 'test-results/**', 'playwright-report/**']}).sort();
const stamp = f => createHash('sha1').update(readFileSync(f)).digest('hex').slice(0, 8);
let problems = 0;
const fail = msg => { console.log('FAIL ' + msg); problems++; };

for (const page of pages) {
  const file = join(ROOT, page);
  let html = readFileSync(file, 'utf8'), changed = false;
  // links and file references, skipping other sites, in-page anchors, and template placeholders
  for (const [, attr, ref] of html.matchAll(/\b(href|src)="([^"]*)"/g)) {
    if (/^([a-z]+:|#|\/\/)/i.test(ref) || ref.includes('${')) continue;
    if (ref.startsWith('/')) { fail(`${page}: ${ref} is absolute; the site is served under /fictional-pancake/, so use a relative link`); continue; }
    let target = join(dirname(file), ref.split(/[?#]/)[0]);
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
    if (!existsSync(target)) fail(`${page}: ${attr}="${ref}" points to a missing file`);
  }
  // cache stamps on local .css and .js
  html = html.replace(/(<(?:script|link)\b[^>]*\b(?:src|href)=")([^":#]+\.(?:css|js))(?:\?v=([0-9a-f]*))?(")/g, (all, pre, ref, v, post) => {
    const target = join(dirname(file), ref);
    if (!existsSync(target)) return all;
    const want = stamp(target);
    if (v === want) return all;
    if (!fix) { fail(`${page}: ${ref} needs ?v=${want} (run node tools/check.mjs --fix)`); return all; }
    changed = true;
    return `${pre}${ref}?v=${want}${post}`;
  });
  if (changed) { writeFileSync(file, html); console.log(`stamped ${page}`); }
}

// Learn pages: every chapter in a unit's learn/chapters.js has its page (learn/<id>.html), the page runs its own chapter
// with as many steps as the list says, and every page in learn/ is on the list. Each page's scripts run here as they would
// in the browser, with Learn.chapter caught instead of drawing (and the few browser calls a script makes at load stubbed).
const run = (page, srcs, inline) => {
  let got = null;
  const ctx = vm.createContext({console, matchMedia: () => ({matches: false}), speechSynthesis: undefined, window: {}});
  for (const src of srcs) vm.runInContext(readFileSync(join(dirname(page), src), 'utf8').replace(/^const Learn=/m, 'var Learn='), ctx, {filename: src});
  vm.runInContext('Learn={home:u=>{globalThis.__got={u}},chapter:(u,id,steps)=>{globalThis.__got={u,id,steps}}};' + inline, ctx);
  got = ctx.__got;
  return got;
};
const scriptsOf = html => [...html.matchAll(/<script src="([^"?]+)(?:\?[^"]*)?"><\/script>/g)].map(m => m[1]);
const inlineOf = html => (html.match(/<script>\n([^]*?)<\/script>/) || [])[1] || '';
for (const home of globSync('grade*/unit*/learn.html', {cwd: ROOT}).sort()) {
  const file = join(ROOT, home), dir = dirname(file), html = readFileSync(file, 'utf8');
  try {
    const {u} = run(file, scriptsOf(html), inlineOf(html));
    const ids = u.chapters.map(c => c.id), steps = {};
    for (const c of u.chapters) {
      const page = join(dir, 'learn', c.id + '.html');
      if (!existsSync(page)) { fail(`${home}: chapter ${c.id} has no page learn/${c.id}.html`); continue; }
      const ph = readFileSync(page, 'utf8'), got = run(page, scriptsOf(ph), inlineOf(ph));
      if (!got || got.id !== c.id) fail(`learn/${c.id}.html runs chapter ${got && got.id}, not ${c.id}`);
      else if (got.steps.length !== c.steps) fail(`${home}: chapter ${c.id} has ${got.steps.length} steps, but learn/chapters.js says ${c.steps}`);
      if (got) steps[c.id] = got.steps;
    }
    // the unit's checklist (tools/checklists.mjs): every chapter and step, each with items that tests/checklists.spec.js runs
    const list = join(dir, 'learn/CHECKLIST.md');
    if (!existsSync(list)) console.log(`note: ${dirname(home)} has no learn/CHECKLIST.md yet`);
    else if (Object.keys(steps).length === u.chapters.length) {
      let text = readFileSync(list, 'utf8');
      if (fix) { const want = render(u, steps, text); if (want !== text) { writeFileSync(list, want); text = want; console.log(`updated ${dirname(home)}/learn/CHECKLIST.md`); } }
      for (const p of listProblems(u, steps, text)) fail(`${dirname(home)}/learn/CHECKLIST.md: ${p}`);
    }
    for (const f of globSync('learn/*.html', {cwd: dir})) if (!ids.includes(f.slice(6, -5))) fail(`${dirname(home)}/${f} is not in learn/chapters.js`);
  } catch (e) { fail(`${home}: ${e.message.split('\n')[0]}`); }
}

const fuzz = spawnSync(process.execPath, [join(ROOT, 'tools/fuzz.mjs')], {stdio: 'inherit'});
if (fuzz.status) problems++;
console.log(problems ? `${problems} problem(s)` : 'All checks passed.');
process.exit(problems ? 1 : 0);
