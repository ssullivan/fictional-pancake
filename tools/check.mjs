// Run before every commit:
//
//   node tools/check.mjs          check links, cache stamps, and generators (tools/fuzz.mjs)
//   node tools/check.mjs --fix    also rewrite stale cache stamps
//
// Cache stamps: every local stylesheet and script a page loads is referenced as file.js?v=<hash of its contents>.
// GitHub Pages lets browsers cache files for 10 minutes, so without the stamp a returning visitor could get new
// HTML with an old shared/engine.js. The stamp changes whenever the file does, so the new copy is fetched.
import {readFileSync, writeFileSync, existsSync, statSync, globSync} from 'node:fs';
import {join, dirname, resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

const ROOT = resolve(import.meta.dirname, '..');
const fix = process.argv.includes('--fix');
const pages = globSync('**/*.html', {cwd: ROOT, exclude: ['node_modules/**', '.git/**']}).sort();
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

const fuzz = spawnSync(process.execPath, [join(ROOT, 'tools/fuzz.mjs')], {stdio: 'inherit'});
if (fuzz.status) problems++;
console.log(problems ? `${problems} problem(s)` : 'All checks passed.');
process.exit(problems ? 1 : 0);
