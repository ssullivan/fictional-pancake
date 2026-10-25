// Run before every commit:
//
//   node tools/check.mjs          check formatting, links, cache stamps, Learn chapter pages, and generators (tools/fuzz.mjs)
//   node tools/check.mjs --fix    also format the JavaScript with Prettier, rewrite stale cache stamps, and write sitemap.xml
//
// Cache stamps: every local stylesheet and script a page loads is referenced as file.js?v=<hash of its contents>.
// GitHub Pages lets browsers cache files for 10 minutes, so without the stamp a returning visitor could get new
// HTML with an old shared/engine.js. The stamp changes whenever the file does, so the new copy is fetched.
import { readFileSync, writeFileSync, existsSync, statSync, globSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import vm from "node:vm";
import { render, problems as listProblems } from "./checklists.mjs";

const ROOT = resolve(import.meta.dirname, "..");
const fix = process.argv.includes("--fix");
const pages = globSync("**/*.html", {
  cwd: ROOT,
  exclude: ["node_modules/**", ".git/**", "test-results/**", "playwright-report/**"],
}).sort();
const stamp = (f) => createHash("sha1").update(readFileSync(f)).digest("hex").slice(0, 8);
let problems = 0;
const fail = (msg) => {
  console.log("FAIL " + msg);
  problems++;
};

// Formatting: every .js and .mjs file is formatted with Prettier (.prettierrc.json; .prettierignore leaves out the rest).
// This runs first, so --fix formats a file before its cache stamp is taken.
const prettier = await import("prettier").catch(() => null);
if (!prettier) fail("Prettier is not installed: run npm install");
else
  for (const f of globSync("**/*.{js,mjs}", {
    cwd: ROOT,
    exclude: ["node_modules/**", ".git/**", "tools/.cache/**"],
  }).sort()) {
    const file = join(ROOT, f);
    if ((await prettier.getFileInfo(file, { ignorePath: join(ROOT, ".prettierignore") })).ignored) continue;
    const src = readFileSync(file, "utf8"),
      options = { ...(await prettier.resolveConfig(file)), filepath: file };
    if (await prettier.check(src, options)) continue;
    if (fix) {
      writeFileSync(file, await prettier.format(src, options));
      console.log(`formatted ${f}`);
    } else fail(`${f} is not formatted with Prettier (run node tools/check.mjs --fix)`);
  }

for (const page of pages) {
  const file = join(ROOT, page);
  let html = readFileSync(file, "utf8"),
    changed = false;
  // links and file references, skipping other sites, in-page anchors, and template placeholders
  for (const [, attr, ref] of html.matchAll(/\b(href|src)="([^"]*)"/g)) {
    if (/^([a-z]+:|#|\/\/)/i.test(ref) || ref.includes("${")) continue;
    if (ref.startsWith("/")) {
      fail(`${page}: ${ref} is absolute; the site is served under /fictional-pancake/, so use a relative link`);
      continue;
    }
    let target = join(dirname(file), ref.split(/[?#]/)[0]);
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, "index.html");
    if (!existsSync(target)) fail(`${page}: ${attr}="${ref}" points to a missing file`);
  }
  // cache stamps on local .css and .js
  html = html.replace(
    /(<(?:script|link)\b[^>]*\b(?:src|href)=")([^":#]+\.(?:css|js))(?:\?v=([0-9a-f]*))?(")/g,
    (all, pre, ref, v, post) => {
      const target = join(dirname(file), ref);
      if (!existsSync(target)) return all;
      const want = stamp(target);
      if (v === want) return all;
      if (!fix) {
        fail(`${page}: ${ref} needs ?v=${want} (run node tools/check.mjs --fix)`);
        return all;
      }
      changed = true;
      return `${pre}${ref}?v=${want}${post}`;
    },
  );
  if (changed) {
    writeFileSync(file, html);
    console.log(`stamped ${page}`);
  }
}

// sitemap.xml: every page a visitor can reach, for search engines (submit SITE + "sitemap.xml" in Google Search Console).
// Test pages and the old folders' redirect stubs (a meta refresh) are left out, and a folder's index.html is listed as the
// folder, the way the site links to it. --fix writes it.
{
  const SITE = "https://ssullivan.github.io/fictional-pancake/";
  const listed = pages.filter(
    (page) => !page.startsWith("tests/") && !/http-equiv="refresh"/.test(readFileSync(join(ROOT, page), "utf8")),
  );
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...listed.map((page) => `  <url><loc>${SITE}${page.replace(/(^|\/)index\.html$/, "$1")}</loc></url>`),
    "</urlset>",
    "",
  ].join("\n");
  const file = join(ROOT, "sitemap.xml");
  if (!existsSync(file) || readFileSync(file, "utf8") !== sitemap) {
    if (fix) {
      writeFileSync(file, sitemap);
      console.log("wrote sitemap.xml");
    } else fail("sitemap.xml is out of date (run node tools/check.mjs --fix)");
  }
}

// Learn pages: every chapter in a unit's learn/chapters.js has its page (learn/<id>.html), the page runs its own chapter
// with as many steps as the list says, and every page in learn/ is on the list. Each page's scripts run here as they would
// in the browser, with Learn.chapter caught instead of drawing (and the few browser calls a script makes at load stubbed).
const run = (page, srcs, inline) => {
  let got = null;
  const ctx = vm.createContext({
    console,
    matchMedia: () => ({ matches: false }),
    speechSynthesis: undefined,
    window: {},
  });
  for (const src of srcs)
    vm.runInContext(readFileSync(join(dirname(page), src), "utf8").replace(/^const Learn\s*=/m, "var Learn ="), ctx, {
      filename: src,
    });
  vm.runInContext(
    "Learn={home:u=>{globalThis.__got={u}},chapter:(u,id,steps)=>{globalThis.__got={u,id,steps}}};" + inline,
    ctx,
  );
  got = ctx.__got;
  return got;
};
const scriptsOf = (html) => [...html.matchAll(/<script src="([^"?]+)(?:\?[^"]*)?"><\/script>/g)].map((m) => m[1]);
const inlineOf = (html) => (html.match(/<script>\n([^]*?)<\/script>/) || [])[1] || "";
for (const home of globSync("grade*/unit*/learn.html", { cwd: ROOT }).sort()) {
  const file = join(ROOT, home),
    dir = dirname(file),
    html = readFileSync(file, "utf8");
  try {
    const { u } = run(file, scriptsOf(html), inlineOf(html));
    const ids = u.chapters.map((c) => c.id),
      steps = {};
    for (const c of u.chapters) {
      const page = join(dir, "learn", c.id + ".html");
      if (!existsSync(page)) {
        fail(`${home}: chapter ${c.id} has no page learn/${c.id}.html`);
        continue;
      }
      const ph = readFileSync(page, "utf8"),
        got = run(page, scriptsOf(ph), inlineOf(ph));
      if (!got || got.id !== c.id) fail(`learn/${c.id}.html runs chapter ${got && got.id}, not ${c.id}`);
      else if (got.steps.length !== c.steps)
        fail(`${home}: chapter ${c.id} has ${got.steps.length} steps, but learn/chapters.js says ${c.steps}`);
      if (got) steps[c.id] = got.steps;
    }
    // the unit's checklist (tools/checklists.mjs): every chapter and step, each with items that tests/checklists.spec.js runs
    const list = join(dir, "learn/CHECKLIST.md");
    if (!existsSync(list))
      fail(
        `${dirname(home)} has no learn/CHECKLIST.md: start one with another unit's opening lines, then --fix adds its chapters and steps`,
      );
    else if (Object.keys(steps).length === u.chapters.length) {
      let text = readFileSync(list, "utf8");
      if (fix) {
        const want = render(u, steps, text);
        if (want !== text) {
          writeFileSync(list, want);
          text = want;
          console.log(`updated ${dirname(home)}/learn/CHECKLIST.md`);
        }
      }
      for (const p of listProblems(u, steps, text)) fail(`${dirname(home)}/learn/CHECKLIST.md: ${p}`);
    }
    for (const f of globSync("learn/*.html", { cwd: dir }))
      if (!ids.includes(f.slice(6, -5))) fail(`${dirname(home)}/${f} is not in learn/chapters.js`);
  } catch (e) {
    fail(`${home}: ${e.message.split("\n")[0]}`);
  }
}

// parseNum (shared/util.js) reads every typed answer, so each way a student might write a number must read right
{
  const ctx = vm.createContext({});
  vm.runInContext(readFileSync(join(ROOT, "shared/util.js"), "utf8") + ";globalThis.parseNum=parseNum", ctx);
  const cases = [
    ["12", 12],
    ["$4.50", 4.5],
    ["1,200", 1200],
    ["3/4", 0.75],
    ["2 1/2", 2.5],
    ["12 cm", 12],
    ["-7", -7],
    ["-3/4", -0.75],
    ["-2 1/2", -2.5],
    ["-1 1/2", -1.5],
    ["$-4.50", -4.5],
    [".5", 0.5],
    ["−7", -7],
    ["−2 1/2", -2.5],
    ["–3", -3],
    ["−0.25", -0.25],
    ["", NaN],
    ["abc", NaN],
  ];
  for (const [s, want] of cases) {
    const got = ctx.parseNum(s);
    if (!Object.is(got, want) && Math.abs(got - want) > 1e-9)
      fail(`parseNum(${JSON.stringify(s)}) is ${got}, not ${want}`);
  }
}

// Expr (shared/expr.js) reads and judges every typed expression answer, and tex.js typesets the math: each way a student might
// write an answer must read right, equal answers must match and unequal ones not, each form must pass what it asks for and
// fail what it doesn't, and KaTeX must draw what the pages write.
{
  const ctx = vm.createContext({});
  for (const f of ["vendor/katex/katex.min", "util", "tex", "expr"])
    vm.runInContext(readFileSync(join(ROOT, `shared/${f}.js`), "utf8").replace(/^(const|let) /gm, "var "), ctx);
  const { Expr } = ctx,
    vars = ["x", "y"];
  /* each text, and its value at x = 2, y = 3 */
  const values = [
    ["2x^2+3x-1", 13],
    ["x²−4", 0],
    ["(x+1)(x-2)", 0],
    ["1/2x", 1],
    ["-5x+3", -7],
    ["-x^2", -4],
    ["2^3^2", 512],
    ["x^-1", 0.5],
    ["3(x+1)y", 27],
    ["xy", 6],
    ["√(x+2)", 2],
    ["sqrt x", Math.SQRT2],
    ["|1-x|", 1],
    ["2·x×y÷3", 4],
    ["x**3", 8],
    ["[x+1]{y}", 9],
    ["X+Y", 5],
    ["0.25x", 0.5],
    ["πx", 2 * Math.PI],
    ["ln e^x", 2],
  ];
  for (const [text, want] of values) {
    let got;
    try {
      got = Expr.value(Expr.parse(text, vars), { x: 2, y: 3 });
    } catch (e) {
      got = e.message;
    }
    if (typeof got !== "number" || Math.abs(got - want) > 1e-9)
      fail(`Expr: ${text} at x = 2, y = 3 is ${got}, not ${want}`);
  }
  /* what can't be read, and what each says */
  const unreadable = [
    ["", "Type an answer first."],
    ["(x+1", "There’s a ( with no )."],
    ["x+1)", "There’s a ) with no (."],
    ["x2", "Write the number first, like 2x, or use ^ for a power, like x^2."],
    ["2 3", "Put a sign between 2 and 3."],
    ["x+*3", "Something’s missing after +."],
    ["x=1=2", "Use just one =, <, or > in an answer."],
    ["x#1", "I can’t read the “#”."],
    ["sqrt", "Something’s missing after √."],
  ];
  for (const [text, want] of unreadable) {
    let got = "(read it)";
    try {
      Expr.parse(text, vars);
    } catch (e) {
      got = e.message;
    }
    if (got !== want)
      fail(`Expr.parse(${JSON.stringify(text)}) says ${JSON.stringify(got)}, not ${JSON.stringify(want)}`);
  }
  /* pairs that are equal, and pairs that aren't */
  const pairs = [
    ["x^2+5x+6", "(x+2)(x+3)", true],
    ["x^2+5x+6", "(x+2)(x+2)", false],
    ["x^2", "2x", false],
    ["3x+2y", "2y+3x", true],
    ["|x|", "x", false],
    ["y=2x+3", "2x-y=-3", true],
    ["y=2x+3", "y=3x+2", false],
    ["x=3", "2x=6", true],
    ["x^2=9", "x=3", false],
    ["x>2", "2<x", true],
    ["x>2", "x<2", false],
    ["x>2", "x>=2", false],
    ["-2x<4", "x>-2", true],
    ["x+1", "x+1=0", false],
  ];
  for (const [a, b, want] of pairs) if (Expr.same(a, b, vars) !== want) fail(`Expr.same(${a}, ${b}) should be ${want}`);
  /* each form: texts written that way (null), and texts that aren't (a message) */
  const forms = [
    ["expanded", "x^2+5x+6", true],
    ["expanded", "-x^2+x/2-1", true],
    ["expanded", "x^2+2x+3x+6", false],
    ["expanded", "(x+2)(x+3)", false],
    ["expanded", "x*x+5x", false],
    ["factored", "(x+2)(x+3)", true],
    ["factored", "2(x+3)", true],
    ["factored", "-(x-1)^2", true],
    ["factored", "(x-y)(x+y)", true],
    ["factored", "(x+1)(x^2+1)", true],
    ["factored", "x^2+5x+6", false],
    ["factored", "2(x^2-4)", false],
    ["factored", "(2x+4)(x+1)", false],
    ["factored", "x(x^2+x)", false],
    ["simplified", "5x+4", true],
    ["simplified", "3x+4+2x", false],
    ["simplified", "2*3x", false],
    ["slopeIntercept", "y=2x+3", true],
    ["slopeIntercept", "y=3-x", true],
    ["slopeIntercept", "2x-y=-3", false],
    ["slopeIntercept", "y=2(x+1)", false],
    ["standardForm", "2x+3y=6", true],
    ["standardForm", "y=2x+3", false],
  ];
  for (const [form, text, ok] of forms) {
    const message = Expr.form[form](Expr.parse(text, vars), vars);
    if ((message === null) !== ok) fail(`Expr.form.${form}(${text}) should ${ok ? "pass" : "fail"}, not ${message}`);
  }
  if (Expr.form.solvedFor("y")(Expr.parse("y=x+y", vars)) === null) fail("Expr.form.solvedFor('y') passes y = x + y");
  /* TeX written out, after tidying */
  const written = [
    ["x^2+-3x+0+1x", "x^{2} - 3x + x"],
    ["-1(x+-2)", "-\\left(x - 2\\right)"],
    ["2*3x", "2 \\cdot 3x"],
    ["x<=3", "x \\le 3"],
  ];
  for (const [text, want] of written)
    if (Expr.tex(text) !== want) fail(`Expr.tex(${text}) is ${Expr.tex(text)}, not ${want}`);
  /* KaTeX draws what pages write, marks what it can't read, and typeset leaves money alone */
  for (const source of ["x^2 + \\frac{1}{2}", "\\sqrt{x + 1}", "y = mx + b", "x \\le 3", "\\left|x\\right|"])
    if (!ctx.tex(source).includes('class="katex"') || ctx.tex(source).includes("katex-error"))
      fail(`tex(${source}) isn't drawn`);
  if (!ctx.tex("\\frac{1}{").includes("katex-error")) fail("tex() doesn't mark TeX it can't read");
  if (ctx.typeset("$4.50 and $5") !== "$4.50 and $5") fail("typeset() changes text with no \\( \\)");
}

// Shared scripts: each top-level name in shared/*.js belongs to one file, a page loads every shared file its code uses (and the
// files those use), and no shared file it doesn't use (pages load only the picture files they need). Uses are read from the code
// with strings and comments taken out, so words in sentences don't count, and a name the page's own code declares again (a local
// chart or fr) isn't a use. util, figures, engine, learn, and speak are part of every page that loads them, so they are never unused.
{
  const SKELETON = ["util", "figures", "engine", "learn", "speak"];
  /* src with comments, strings, and regular expressions blanked out, keeping the code inside a template's ${…} */
  const codeOnly = (src) => {
    let i = 0;
    const skipStr = (q) => {
      i++;
      while (i < src.length && src[i] !== q) {
        if (src[i] === "\\") i++;
        i++;
      }
      i++;
    };
    const tmpl = () => {
      let out = "";
      while (i < src.length && src[i] !== "`") {
        if (src[i] === "\\") i += 2;
        else if (src[i] === "$" && src[i + 1] === "{") {
          i += 2;
          out += " " + code() + " ";
        } else i++;
      }
      i++;
      return out;
    };
    /* code up to an unmatched } (the end of a ${…}) or the end */
    const code = () => {
      let out = "",
        depth = 0,
        prev = "";
      while (i < src.length) {
        const c = src[i],
          n = src[i + 1];
        if (c === "/" && n === "*") {
          const e = src.indexOf("*/", i + 2);
          i = e < 0 ? src.length : e + 2;
          out += " ";
          continue;
        }
        if (c === "/" && n === "/") {
          const e = src.indexOf("\n", i);
          i = e < 0 ? src.length : e;
          continue;
        }
        if (c === "'" || c === '"') {
          skipStr(c);
          out += " 0 ";
          prev = "0";
          continue;
        }
        if (c === "`") {
          i++;
          out += " " + tmpl() + " ";
          prev = "0";
          continue;
        }
        if (c === "/" && (!prev || /[(,=:[!&|?{};+\-*%<>~^]/.test(prev))) {
          let cls = false;
          for (i++; i < src.length && src[i] !== "\n"; i++) {
            const d = src[i];
            if (d === "\\") i++;
            else if (d === "[") cls = true;
            else if (d === "]") cls = false;
            else if (d === "/" && !cls) break;
          }
          for (i++; /[a-z]/.test(src[i] || ""); i++);
          out += " 0 ";
          prev = "0";
          continue;
        }
        if (c === "{") depth++;
        if (c === "}") {
          if (!depth) {
            i++;
            return out;
          }
          depth--;
        }
        out += c;
        if (!/\s/.test(c)) prev = c;
        i++;
      }
      return out;
    };
    return code();
  };
  /* names used in code (not .property, not an object key), and names it declares: variables, functions, and parameters. A name
     is matched whole ((?![\w$])), so one before a : isn't cut short to a shorter name (text in "c ? text : …" isn't tex). */
  const ID = /[A-Za-z_$][\w$]*/g;
  const usedIn = (c) =>
    new Set([...c.matchAll(/(?<![\w$.])([A-Za-z_$][\w$]*)(?![\w$])(?!\s*:(?!:))/g)].map((m) => m[1]));
  const declaredIn = (c) =>
    new Set([
      ...[
        ...c.matchAll(
          /(?:\b(?:const|let|var)\s+|,\s*)([A-Za-z_$][\w$]*)\s*=(?![=>])|\bfunction\s+([A-Za-z_$][\w$]*)|([A-Za-z_$][\w$]*)\s*=>/g,
        ),
      ].map((m) => m[1] || m[2] || m[3]),
      ...[...c.matchAll(/\(([^()]*)\)\s*=>|\bfunction\s*[\w$]*\s*\(([^()]*)\)/g)].flatMap(
        (m) => (m[1] ?? m[2]).match(ID) || [],
      ),
    ]);
  const files = globSync("shared/*.js", { cwd: ROOT })
      .map((f) => f.slice(7, -3))
      .sort(),
    owner = new Map(),
    deps = {};
  for (const f of files) {
    const src = readFileSync(join(ROOT, `shared/${f}.js`), "utf8");
    for (const [, name] of src.matchAll(/^(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/gm)) {
      if (owner.has(name) && owner.get(name) !== f)
        fail(`${name} is declared in both shared/${owner.get(name)}.js and shared/${f}.js`);
      owner.set(name, f);
    }
  }
  for (const f of files) {
    if (SKELETON.includes(f)) continue;
    /* a name the file declares for itself (a local inside a function, or Expr's helpers) isn't a use of another file's */
    const c = codeOnly(readFileSync(join(ROOT, `shared/${f}.js`), "utf8")),
      mine = declaredIn(c);
    deps[f] = new Set(
      [...usedIn(c)]
        .filter((n) => !mine.has(n) || owner.get(n) === f)
        .map((n) => owner.get(n))
        .filter((o) => o && o !== f),
    );
  }
  for (const page of pages) {
    const file = join(ROOT, page),
      html = readFileSync(file, "utf8"),
      srcs = scriptsOf(html);
    const loaded = srcs.filter((s) => /(^|\/)shared\/[^/]+\.js$/.test(s)).map((s) => s.split("/").pop().slice(0, -3));
    if (!loaded.length) continue;
    const source = [...html.matchAll(/<script>([^]*?)<\/script>/g)]
        .map((m) => m[1])
        .concat(
          srcs
            .filter((s) => !s.includes("shared/"))
            .map((s) => join(dirname(file), s))
            .filter(existsSync)
            .map((f) => readFileSync(f, "utf8")),
        )
        .join("\n;\n"),
      own = codeOnly(source);
    const mine = declaredIn(own),
      need = new Map();
    for (const n of usedIn(own)) if (owner.has(n) && !mine.has(n) && !need.has(owner.get(n))) need.set(owner.get(n), n);
    /* engine.js and learn.js reach these only for what the page's problems hold: expr problems and checks need the MathBox
       (which needs expr.js and tex.js), and math between \\( \\) in a string needs tex.js to be typeset */
    if (/\bkind:\s*["']expr["']/.test(source)) for (const f of ["mathbox", "expr", "tex"]) need.set(f, "expr problems");
    if (/\\\\[([]/.test(source) && !need.has("tex")) need.set("tex", "math between \\( \\)");
    /* tex.js draws with KaTeX, loaded before it with its styles; tex.js and mathbox.js have styles of their own */
    const styles = [...html.matchAll(/<link rel="stylesheet" href="([^"?]+)/g)].map((m) => m[1]);
    const katexAt = srcs.findIndex((s) => s.endsWith("shared/vendor/katex/katex.min.js")),
      texAt = srcs.findIndex((s) => /(^|\/)shared\/tex\.js$/.test(s));
    if (texAt >= 0 && !(katexAt >= 0 && katexAt < texAt))
      fail(`${page}: loads shared/tex.js without shared/vendor/katex/katex.min.js before it`);
    for (const [script, style] of [
      ["shared/tex.js", "shared/tex.css"],
      ["shared/tex.js", "shared/vendor/katex/katex.min.css"],
      ["shared/mathbox.js", "shared/mathbox.css"],
    ])
      if (srcs.some((s) => s.endsWith(script)) && !styles.some((s) => s.endsWith(style)))
        fail(`${page}: loads ${script} but not ${style}`);
    for (const f of loaded) for (const d of deps[f] || []) if (!need.has(d)) need.set(d, `shared/${f}.js`);
    for (const [f, why] of need)
      if (!loaded.includes(f))
        fail(`${page}: uses shared/${f}.js (${why.startsWith("shared/") ? "for " + why : why}) but doesn't load it`);
    for (const f of loaded)
      if (!SKELETON.includes(f) && !need.has(f)) fail(`${page}: loads shared/${f}.js but uses nothing from it`);
  }
}

const fuzz = spawnSync(process.execPath, [join(ROOT, "tools/fuzz.mjs")], { stdio: "inherit" });
if (fuzz.status) problems++;
// the math facts engine: every fact's choices, help, and hint, and the picker (tools/facts.mjs)
const facts = spawnSync(process.execPath, [join(ROOT, "tools/facts.mjs")], { stdio: "inherit" });
if (facts.status) problems++;
console.log(problems ? `${problems} problem(s)` : "All checks passed.");
process.exit(problems ? 1 : 0);
