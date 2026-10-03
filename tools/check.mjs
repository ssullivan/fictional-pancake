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
    if (!existsSync(list)) fail(`${dirname(home)} has no learn/CHECKLIST.md: start one with another unit's opening lines, then --fix adds its chapters and steps`);
    else if (Object.keys(steps).length === u.chapters.length) {
      let text = readFileSync(list, 'utf8');
      if (fix) { const want = render(u, steps, text); if (want !== text) { writeFileSync(list, want); text = want; console.log(`updated ${dirname(home)}/learn/CHECKLIST.md`); } }
      for (const p of listProblems(u, steps, text)) fail(`${dirname(home)}/learn/CHECKLIST.md: ${p}`);
    }
    for (const f of globSync('learn/*.html', {cwd: dir})) if (!ids.includes(f.slice(6, -5))) fail(`${dirname(home)}/${f} is not in learn/chapters.js`);
  } catch (e) { fail(`${home}: ${e.message.split('\n')[0]}`); }
}

// parseNum (shared/util.js) reads every typed answer, so each way a student might write a number must read right
{
  const ctx = vm.createContext({});
  vm.runInContext(readFileSync(join(ROOT, 'shared/util.js'), 'utf8') + ';globalThis.parseNum=parseNum', ctx);
  const cases = [['12', 12], ['$4.50', 4.5], ['1,200', 1200], ['3/4', .75], ['2 1/2', 2.5], ['12 cm', 12], ['-7', -7], ['-3/4', -.75],
    ['-2 1/2', -2.5], ['-1 1/2', -1.5], ['$-4.50', -4.5], ['.5', .5], ['', NaN], ['abc', NaN]];
  for (const [s, want] of cases) {
    const got = ctx.parseNum(s);
    if (!Object.is(got, want) && Math.abs(got - want) > 1e-9) fail(`parseNum(${JSON.stringify(s)}) is ${got}, not ${want}`);
  }
}

// Shared scripts: each top-level name in shared/*.js belongs to one file, a page loads every shared file its code uses (and the
// files those use), and no shared file it doesn't use (pages load only the picture files they need). Uses are read from the code
// with strings and comments taken out, so words in sentences don't count, and a name the page's own code declares again (a local
// chart or fr) isn't a use. util, figures, engine, learn, and speak are part of every page that loads them, so they are never unused.
{
  const SKELETON = ['util', 'figures', 'engine', 'learn', 'speak'];
  /* src with comments, strings, and regular expressions blanked out, keeping the code inside a template's ${…} */
  const codeOnly = src => {
    let i = 0;
    const skipStr = q => { i++; while (i < src.length && src[i] !== q) { if (src[i] === '\\') i++; i++; } i++; };
    const tmpl = () => {
      let out = '';
      while (i < src.length && src[i] !== '`') { if (src[i] === '\\') i += 2; else if (src[i] === '$' && src[i + 1] === '{') { i += 2; out += ' ' + code() + ' '; } else i++; }
      i++;
      return out;
    };
    /* code up to an unmatched } (the end of a ${…}) or the end */
    const code = () => {
      let out = '', depth = 0, prev = '';
      while (i < src.length) {
        const c = src[i], n = src[i + 1];
        if (c === '/' && n === '*') { const e = src.indexOf('*/', i + 2); i = e < 0 ? src.length : e + 2; out += ' '; continue; }
        if (c === '/' && n === '/') { const e = src.indexOf('\n', i); i = e < 0 ? src.length : e; continue; }
        if (c === "'" || c === '"') { skipStr(c); out += ' 0 '; prev = '0'; continue; }
        if (c === '`') { i++; out += ' ' + tmpl() + ' '; prev = '0'; continue; }
        if (c === '/' && (!prev || /[(,=:[!&|?{};+\-*%<>~^]/.test(prev))) {
          let cls = false;
          for (i++; i < src.length && src[i] !== '\n'; i++) { const d = src[i]; if (d === '\\') i++; else if (d === '[') cls = true; else if (d === ']') cls = false; else if (d === '/' && !cls) break; }
          for (i++; /[a-z]/.test(src[i] || ''); i++);
          out += ' 0 '; prev = '0'; continue;
        }
        if (c === '{') depth++;
        if (c === '}') { if (!depth) { i++; return out; } depth--; }
        out += c; if (!/\s/.test(c)) prev = c; i++;
      }
      return out;
    };
    return code();
  };
  /* names used in code (not .property, not an object key), and names it declares: variables, functions, and parameters */
  const ID = /[A-Za-z_$][\w$]*/g;
  const usedIn = c => new Set([...c.matchAll(/(?<![\w$.])([A-Za-z_$][\w$]*)(?!\s*:(?!:))/g)].map(m => m[1]));
  const declaredIn = c => new Set([
    ...[...c.matchAll(/(?:\b(?:const|let|var)\s+|,\s*)([A-Za-z_$][\w$]*)\s*=(?![=>])|\bfunction\s+([A-Za-z_$][\w$]*)|([A-Za-z_$][\w$]*)\s*=>/g)].map(m => m[1] || m[2] || m[3]),
    ...[...c.matchAll(/\(([^()]*)\)\s*=>|\bfunction\s*[\w$]*\s*\(([^()]*)\)/g)].flatMap(m => (m[1] ?? m[2]).match(ID) || [])]);
  const files = globSync('shared/*.js', {cwd: ROOT}).map(f => f.slice(7, -3)).sort(), owner = new Map(), deps = {};
  for (const f of files) {
    const src = readFileSync(join(ROOT, `shared/${f}.js`), 'utf8');
    for (const [, name] of src.matchAll(/^(?:const|let|var|function)\s+([A-Za-z_$][\w$]*)/gm)) {
      if (owner.has(name) && owner.get(name) !== f) fail(`${name} is declared in both shared/${owner.get(name)}.js and shared/${f}.js`);
      owner.set(name, f);
    }
  }
  for (const f of files) {
    if (SKELETON.includes(f)) continue;
    const c = codeOnly(readFileSync(join(ROOT, `shared/${f}.js`), 'utf8'));
    deps[f] = new Set([...usedIn(c)].map(n => owner.get(n)).filter(o => o && o !== f));
  }
  for (const page of pages) {
    const file = join(ROOT, page), html = readFileSync(file, 'utf8'), srcs = scriptsOf(html);
    const loaded = srcs.filter(s => /(^|\/)shared\/[^/]+\.js$/.test(s)).map(s => s.split('/').pop().slice(0, -3));
    if (!loaded.length) continue;
    const own = codeOnly([...html.matchAll(/<script>([^]*?)<\/script>/g)].map(m => m[1]).concat(
      srcs.filter(s => !s.includes('shared/')).map(s => join(dirname(file), s)).filter(existsSync).map(f => readFileSync(f, 'utf8'))).join('\n;\n'));
    const mine = declaredIn(own), need = new Map();
    for (const n of usedIn(own)) if (owner.has(n) && !mine.has(n) && !need.has(owner.get(n))) need.set(owner.get(n), n);
    for (const f of loaded) for (const d of deps[f] || []) if (!need.has(d)) need.set(d, `shared/${f}.js`);
    for (const [f, why] of need) if (!loaded.includes(f)) fail(`${page}: uses shared/${f}.js (${why.startsWith('shared/') ? 'for ' + why : why}) but doesn't load it`);
    for (const f of loaded) if (!SKELETON.includes(f) && !need.has(f)) fail(`${page}: loads shared/${f}.js but uses nothing from it`);
  }
}

const fuzz = spawnSync(process.execPath, [join(ROOT, 'tools/fuzz.mjs')], {stdio: 'inherit'});
if (fuzz.status) problems++;
console.log(problems ? `${problems} problem(s)` : 'All checks passed.');
process.exit(problems ? 1 : 0);
