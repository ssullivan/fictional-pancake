// Screenshot every page, every station of every game, and every Learn step in a fixed, seeded order, so a change to shared/ can be
// checked against the previous version pixel for pixel.
//
//   node tools/snap.mjs <out dir>              take screenshots
//   node tools/snap.mjs --compare <dir a> <dir b>   list screenshots that differ
//
// Needs Node 22+ and google-chrome (or set CHROME=/path/to/chrome).
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {readFile, mkdir, writeFile, readdir, rm} from 'node:fs/promises';
import {globSync} from 'node:fs';
import {join, extname, resolve, dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';

const ROOT = resolve(import.meta.dirname, '..');
const GAMES = globSync('grade*/unit*/stations.js', {cwd: ROOT}).map(dirname).sort();
const PAGES = ['', ...globSync('grade*/index.html', {cwd: ROOT}).map(f => dirname(f) + '/').sort()];
const LEARN = globSync('grade*/unit*/learn.html', {cwd: ROOT}).sort();
const WIDTHS = [1200, 390];

if (process.argv[2] === '--compare') {
  const [a, b] = process.argv.slice(3);
  const hash = async f => createHash('sha1').update(await readFile(f)).digest('hex');
  const names = new Set([...await readdir(a), ...await readdir(b)]);
  let diff = 0;
  for (const n of [...names].sort()) {
    const [ha, hb] = await Promise.all([hash(join(a, n)).catch(() => 'missing'), hash(join(b, n)).catch(() => 'missing')]);
    if (ha !== hb) { console.log('DIFF', n); diff++; }
  }
  console.log(`${names.size} screenshots, ${diff} differ`);
  process.exit(diff ? 1 : 0);
}

const OUT = process.argv[2];
if (!OUT) { console.error('usage: node tools/snap.mjs <out dir> | --compare <a> <b>'); process.exit(2); }
await mkdir(OUT, {recursive: true});

// static server for the repo
const TYPES = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png'};
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  let body;
  try { body = await readFile(join(ROOT, p)); } catch { res.writeHead(404); return res.end(); }
  res.writeHead(200, {'content-type': TYPES[extname(p)] || 'application/octet-stream'}); res.end(body);
}).listen(0);
const BASE = `http://127.0.0.1:${server.address().port}/`;

// headless Chrome over the DevTools protocol
const profile = join(tmpdir(), 'snap-' + process.pid);
const chrome = spawn(process.env.CHROME || 'google-chrome', ['--headless=new', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-rasterization', '--disable-gpu-compositing', '--hide-scrollbars', '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'], {stdio: ['ignore', 'ignore', 'pipe']});
const wsUrl = await new Promise((ok, fail) => {
  let buf = '';
  chrome.stderr.on('data', d => { buf += d; const m = buf.match(/ws:\/\/\S+/); if (m) ok(m[0]); });
  chrome.on('exit', () => fail(new Error('Chrome exited')));
});
const port = new URL(wsUrl).port;
const tab = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t => t.type === 'page');
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let seq = 0; const pending = {}; const events = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; } else if (m.method === 'Fetch.requestPaused') onPaused(m.params).catch(err => console.error('cache:', err.message)); else if (m.method) events.push(m); };
const cmd = (method, params = {}) => new Promise((ok, fail) => { pending[++seq] = m => m.error ? fail(new Error(method + ': ' + m.error.message)) : ok(m.result); ws.send(JSON.stringify({id: seq, method, params})); });
const wait = ms => new Promise(r => setTimeout(r, ms));
const ev = async expr => {
  const r = await cmd('Runtime.evaluate', {expression: expr, returnByValue: true, awaitPromise: true});
  if (r.exceptionDetails) throw new Error(expr + '\n' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
  return r.result.value;
};

// Outside files (Google Fonts, three.js) are cached in tools/.cache on first use, so every run renders the same
// font files even if the CDN changes what it serves. Delete the folder to refresh.
const CACHE = join(ROOT, 'tools/.cache');
await mkdir(CACHE, {recursive: true});
await cmd('Fetch.enable', {patterns: [{urlPattern: 'https://*', requestStage: 'Request'}, {urlPattern: 'https://*', requestStage: 'Response'}]});
async function onPaused({requestId, request, responseStatusCode, responseHeaders}) {
  const file = join(CACHE, createHash('sha1').update(request.url).digest('hex'));
  if (responseStatusCode === undefined) {  // request stage: answer from the cache if we can
    try {
      const {headers, body} = JSON.parse(await readFile(file, 'utf8'));
      return cmd('Fetch.fulfillRequest', {requestId, responseCode: 200, responseHeaders: headers, body});
    } catch { return cmd('Fetch.continueRequest', {requestId}); }
  }
  // response stage: save it for next time
  const {body, base64Encoded} = await cmd('Fetch.getResponseBody', {requestId});
  if (responseStatusCode === 200) {
    const headers = responseHeaders.filter(h => /^(content-type|access-control-allow-origin)$/i.test(h.name));
    await writeFile(file, JSON.stringify({headers, body: base64Encoded ? body : Buffer.from(body).toString('base64')}));
  }
  return cmd('Fetch.fulfillRequest', {requestId, responseCode: responseStatusCode, responseHeaders, body: base64Encoded ? body : Buffer.from(body).toString('base64')});
}
await cmd('Page.enable');
await cmd('Emulation.setEmulatedMedia', {features: [{name: 'prefers-reduced-motion', value: 'reduce'}]});
// Seeded Math.random (mulberry32) so every run deals the same problems. Smooth scrolling off so shots are stable.
await cmd('Page.addScriptToEvaluateOnNewDocument', {source: `
  (()=>{let a=0x2f6b1d;Math.random=()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};})();
  Element.prototype.scrollIntoView=function(){};window.scrollTo=()=>{};
  // a blinking text cursor or a half-finished transition would make shots differ from run to run
  document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent='*,*::before,*::after{caret-color:transparent!important;transition:none!important;animation:none!important}';document.head.append(s);});
`});

async function load(url, width) {
  await cmd('Emulation.setDeviceMetricsOverride', {width, height: 800, deviceScaleFactor: 1, mobile: false});
  events.length = 0;
  await cmd('Page.navigate', {url});
  for (let i = 0; i < 100 && !events.some(e => e.method === 'Page.loadEventFired'); i++) await wait(50);
  if (url !== 'about:blank') await ev('document.fonts.ready.then(()=>1)');
}
async function shot(name) {
  await wait(80);
  const {cssContentSize: s} = await cmd('Page.getLayoutMetrics');
  const {data} = await cmd('Page.captureScreenshot', {format: 'png', captureBeyondViewport: true, clip: {x: 0, y: 0, width: s.width, height: s.height, scale: 1}});
  await writeFile(join(OUT, name + '.png'), Buffer.from(data, 'base64'));
  // pages must never scroll sideways (figures scroll inside their own box)
  const [sw, iw] = await ev('[document.documentElement.scrollWidth, innerWidth]');
  if (sw > iw) { console.log(`OVERFLOW ${name}: page is ${sw}px wide on a ${iw}px screen`); overflows++; }
}
let overflows = 0;

// The game state: a top-level `G` in the older inline games, `Game.state` in shared/engine.js.
const STATE = `(typeof Game!=='undefined'?Game.state:G)`;
// Answer the current problem right or wrong, whatever its kind.
const answer = right => ev(`(()=>{
  const g=${STATE},p=g.p;
  if(p.kind==='num'){const i=document.getElementById('inp');i.value=${right}?String(p.answer):'98765';document.getElementById('checkBtn').click();return;}
  if(p.kind==='pair'){const [x,y]=${right}?p.answer:[98765,1];document.getElementById('inp').value=x;document.getElementById('inp2').value=y;document.getElementById('checkBtn').click();return;}
  if(p.kind==='mc'){const c=${right}?p.answer:p.choices.find(c=>c.id!==p.answer).id;document.querySelector('.choice[data-c="'+c+'"]').click();return;}
  if(p.kind==='tap'){const el=[...document.querySelectorAll('#fig .cand')].find(e=>${right}?e.dataset.id===p.answer:e.dataset.id!==p.answer);el.dispatchEvent(new MouseEvent('click',{bubbles:true}));return;}
  throw new Error('unknown kind '+p.kind);
})()`);

let n = 0;
for (const width of WIDTHS) {
  for (const page of PAGES) { await load(BASE + page, width); await shot(`${width}-${page.replace(/\W/g, '') || 'root'}`); n++; }
  for (const game of GAMES) {
    const tag = `${width}-${game.replace(/\W/g, '')}`;
    await load(BASE + game + '/', width);
    await ev('localStorage.clear()');
    await load(BASE + game + '/', width);
    await shot(`${tag}-home`); n++;
    const zones = await ev(`[...document.querySelectorAll('#zones .zone')].map(b=>b.dataset.z)`);
    for (const z of zones) {
      const t = `${tag}-${z}`;
      await ev(`document.querySelector('.zone[data-z="${z}"]').click()`);
      // Deal problems until every answer kind in this zone has been seen or 6 problems have passed.
      const seen = new Set();
      for (let q = 0; q < 6; q++) {
        const kind = await ev(`${STATE}.p.kind`);
        const first = !seen.has(kind); seen.add(kind);
        if (first) await shot(`${t}-q${q}-${kind}`), n++;
        if (first && await ev(`!!document.getElementById('hintBtn')`)) { await ev(`document.getElementById('hintBtn').click()`); await shot(`${t}-q${q}-hint`); n++; }
        await answer(false);
        if (first) await shot(`${t}-q${q}-wrong`), n++;
        // Unit 1 frame problems switch to "Build it" after a wrong answer: fill every row in.
        if (await ev(`!!document.getElementById('bf')`)) {
          await ev(`(()=>{const b=${STATE}.p.build;document.getElementById('b-R').value=b.R;b.pieces.forEach(q=>document.getElementById('b-'+q.k).value=q.area);document.getElementById('buildCheck').click();})()`);
        } else if (!await ev(`${STATE}.done`)) {
          await answer(true);
        }
        if (first) await shot(`${t}-q${q}-done`), n++;
        await ev(`document.getElementById('nextBtn').click()`);
      }
      // Jump to the last problem and finish the round to see the results screen.
      await ev(`(()=>{const g=${STATE};g.i=g.n-1;})()`);
      await answer(true);
      if (!await ev(`${STATE}.done`)) await answer(true);
      await ev(`document.getElementById('nextBtn').click()`);
      await shot(`${t}-results`); n++;
      await ev(`document.getElementById('tomap').click()`);
    }
    await shot(`${tag}-home-after`); n++;
    // Learn pages link straight to a zone: index.html#<zone id> starts it (from another page, so load a blank one first)
    await load('about:blank', width);
    await load(`${BASE}${game}/#${zones[0]}`, width);
    await shot(`${tag}-link-${zones[0]}`); n++;
  }
}
// Learn pages: every step of every chapter page, then a wrong answer (or the first choice) to its quick check.
for (const width of WIDTHS) {
  for (const page of LEARN) {
    const tag = `${width}-${page.replace(/\W/g, '')}`;
    await load(BASE + page, width);
    await ev('localStorage.clear()');
    await load(BASE + page, width);
    await shot(`${tag}-home`); n++;
    // each chapter is its own page (learn/<id>.html), listed on the unit's Learn page
    const chapters = await ev(`[...document.querySelectorAll('#chapters .zone')].map(a=>a.getAttribute('href').split('#')[0])`);
    for (let c = 1; c <= chapters.length; c++) {
      await load(BASE + page.replace(/learn\.html$/, '') + chapters[c - 1], width);
      for (let s = 1; ; s++) {
        await ev(`location.hash='#s${s}'`);
        await wait(700);  // 3D steps load three.js
        const [at, of] = await ev(`document.getElementById('snum').textContent.match(/\\d+/g).map(Number)`);
        if (at !== s) break;
        await shot(`${tag}-c${c}s${s}`); n++;
        const kind = await ev(`(()=>{const c=document.querySelector('#check .check');if(!c)return null;return document.getElementById('cin')?'num':'mc';})()`);
        if (kind === 'num') {
          await ev(`(()=>{const i=document.getElementById('cin');i.value='98765';i.form.requestSubmit();})()`);
          await shot(`${tag}-c${c}s${s}-wrong`); n++;
        } else if (kind === 'mc') {
          await ev(`document.querySelector('#check .choice').click()`);
          await shot(`${tag}-c${c}s${s}-picked`); n++;
        }
        if (at === of) break;
      }
      await ev(`location.hash='#done'`); await wait(100);
      await shot(`${tag}-c${c}done`); n++;
    }
    await load(BASE + page, width);
    await shot(`${tag}-home-after`); n++;
  }
}
console.log(`${n} screenshots in ${OUT}` + (overflows ? `, ${overflows} scroll sideways` : ''));
ws.close(); server.close();
await new Promise(r => { chrome.on('exit', r); chrome.kill(); });
await rm(profile, {recursive: true, force: true, maxRetries: 10, retryDelay: 200});
