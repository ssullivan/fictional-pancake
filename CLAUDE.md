# Math games

Static HTML math games served with GitHub Pages at https://ssullivan.github.io/fictional-pancake/ (from `main`, repo root). Grades so far: 2 (`grade2/`), 3 (`grade3/`), 4 (`grade4/`), and 6 (`grade6/`).

Maintainability comes first: anything two pages share belongs in `shared/`, not in copies.

## Layout

```
index.html                grade picker (one card per grade)
shared/                   used by every grade; each file's header comment documents its API
  theme.css               colors, fonts, page header, pills, buttons, rows of choice buttons (seg), feedback boxes: every page
  game.css, engine.js     game screens and the game engine (Game.init)
  figures.css, figures.js double number lines, ratio tables, diagram styles
  fracmath.css, .js       exact fractions ([n, d] pairs) for Grade 6: the math, fractions in pictures (fT), rectangles in small squares (rectGrid), boxes of small cubes (cubeBox)
  learn.css, learn.js     Learn pages: a unit's chapter list and its chapter pages (Learn.home, Learn.chapter)
  pictures.css, .js       K–5 pictures: labels, number-line marks, tap targets, counters, stacked fractions (fr, frT), part names (PART)
    blocks                ten-frames, cubes, base-ten blocks, place-value charts, number words, the standard algorithms, sharing blocks, partial quotients
    numlines              tape diagrams, number lines, open number lines (jumps), rounding number lines
    fractions             fraction strips, fraction number lines, hundred grids
    graphs                line plots, scaled picture and bar graphs
    shapes                flat shapes, pictures in a row, solid shapes, equal parts, pattern blocks, rectangles with their sides, rectangles cut in two
    measure               clocks, the day bar, coins and dollar bills
    multiply              factors, hops of n, tiles, number charts, arrays, equal groups, area diagrams, partial products
    angles                points, lines, rays, segments, angles and their marks, protractors, parallel and perpendicular lines
  solids.css, solids.js   prisms and pyramids (faces, edges, vertices, names), their drawings, curved solids, and nets: Grade 6
  algebra.css, .js        letters for numbers (mathVar, withVars) and coordinate planes, one quadrant or four (coordPlane): Grade 6
  landing.css             grade cards (root page) and unit cards (grade pages)
  util.js                 R, pick, range, shuffle, miscOf, mcOf, problemKey, gcd, lcm, roundTo, $, Q, parseNum, and Learn controls (seg, press, onPick, segHit, stepper)
  speak.js                Read to me buttons for K–2 Learn pages and games (readAloud)
facts/                    Math Facts, for any grade (see Math facts)
  index.html              hub: a card for addition, subtraction, multiplication, and division
  practice.html, .js      Quick Pick: pick a set, then answer facts for as long as you like (#add, #sub, #mult, #div)
  facts.js, facts.css     the facts engine (sets, choices, help, hints, which fact next) and the facts pages' styles
tools/                    check.mjs, fuzz.mjs, facts.mjs, snap.mjs, same.mjs (see Checking a change)
.prettierrc.json          Prettier settings for the JavaScript (.prettierignore leaves out HTML, CSS, and docs)
grade6/
  index.html              grade page: one card per IM unit, with Learn/Play links
  CLAUDE.md               that grade's games, grade-specific rules, and IM curriculum reference
  unit3/index.html        game page: HTML, unit-only CSS, and Game.init({...})
  unit3/stations.js       the game's problem generators, ZONES, and ICON
  unit3/checks.js         the game's number limits and real-world checks for the fuzz test
  unit1/learn.html        Learn page: the unit's list of chapters and its "For grown-ups" notes (Learn.home)
  unit1/learn/chapters.js the unit's chapters (UNIT) and their icons, loaded by learn.html and every chapter page
  unit1/learn/<id>.html   one page per chapter (Learn.chapter); its widgets and steps are in learn/<id>.js
  unit1/learn/common.js   code more than one of the unit's chapters uses; learn/unit.css holds the unit's styles
  unit1/study.html        printable study guide for the whole unit; its diagrams are drawn by unit1/study.js
grade4/unit1/figs.js      pictures a unit's game and its Learn pages both use, and nothing else does (figs.css for their styles)
```

- Everything for a unit lives in `grade<N>/unit<M>/`. Pages load `shared/` with `../../shared/...`.
- K–5 pictures come in topic files (`shared/<topic>.js` and `.css`, listed above under `pictures`). Every K–5 page loads `pictures.css`; a page loads the topic files it uses (`.js` and `.css`) in the order listed, and `pictures.js` when it or one of those files uses it (each file's header says what it needs). `node tools/check.mjs` fails when a page uses a shared file it doesn't load or loads one it doesn't use. A picture only one unit draws goes in that unit (`figs.js`, or `learn/common.js` when only its Learn pages use it); move it to `shared/` when a second unit needs it.
- When adding a game or tutorial, add its link to that unit's card on `grade<N>/index.html` (and turn a "Coming soon" card into a real one). When adding a grade, create `grade<N>/index.html` and `grade<N>/CLAUDE.md` from Grade 6's (or Grade 2's for K–5), add a card to the root `index.html` in grade order, and update its "Grades …" eyebrow.
- Games and tutorials link back to their grade page with `href="../"` ("← Grade N").
- The old top-level folders (`area_and_surface_area/`, `introducing_ratios/`, `unit_rates_and_percentages/`, `arithmetic_in_base_ten/`) are redirect stubs so old links and bookmarks keep working (the hash is kept). Don't put new content there.
- Use relative links only (the site is served under `/fictional-pancake/`, not `/`).
- `.nojekyll` disables Jekyll processing so files are served as-is.
- `localStorage` is shared by the whole site, so keys must be unique across grades. Existing pages keep their keys (`bb-save`, `mm-save`, `rr-save`, `dd-save`, `bb-learn`) so saved progress survives; new ones use `g<N>u<M>-save` / `g<N>u<M>-learn`, and the math facts use `facts-save`.
- Local CSS and JS are loaded with a `?v=<hash>` cache stamp; `node tools/check.mjs --fix` writes them. Never edit a stamp by hand.

## Code style

Someone new to a file must be able to tell what each function does and what each variable holds.

- Formatting: every `.js` and `.mjs` file is formatted with Prettier (pinned in `package.json`, 120-character lines). When you're done changing JavaScript, run `node tools/check.mjs --fix`: it formats the files, then rewrites the cache stamps from the formatted files (`npm run format` only formats, which leaves the stamps stale). Don't hand-format or fight Prettier's layout. `node tools/check.mjs` (and CI) fails on an unformatted file. Script inside an HTML page's `<script>` isn't formatted, so lay it out the same way by hand. A tool or test that reads source text (like `tests/games.spec.js` finding `ZONES`) must allow any spacing and either quote, and fail when it finds nothing.
- Names: loop indices (`i`, `j`, `k`), SVG coordinates (`x`, `y`), the numbers in pure math (`gcd(a, b)`), and events (`e`) can be one letter. Everything else is named for what it holds: `width` not `W`, `markup` not `o`, `scale` not `k`, `problem` not `p`, `chapterIndex` not `ci`, `stepsDone` not `d`. Helpers that place things say what they give: `colX(i)`, `rowY(i)`.
- Name the numbers in layout code (`colW = 30, commaGap = 12`), or comment them where a name doesn't fit.
- Give a condition used more than once, or a long one, a name (`const makesTen = onesSum >= 10`).
- Don't give a local the name of a shared global (`R`, `near`, `$`, `Q`).
- Comments: one line above every function saying what it returns or draws and what its options mean (a shared file also lists its API in its header). Inside a function, a short comment above each block that isn't obvious says what it does and why ("ones fill each column of 5 from the bottom up"). Put the math in words: what a cross product, a shoelace sum, or a winding sign is for. Write plain sentences like the existing comments; no JSDoc.
- Split long template strings at element boundaries, one part per line.
- Names other files use are an API, so leave them alone unless you rename them in every page that uses them; document them instead. That covers top-level names in `shared/` (`check.mjs` tracks which file owns each), option names (`{lab, tap, hi}`), fields of returned objects (`Game.state`'s `p`, `z`, `i`, `done`; `algSteps`' steps; `solidOf`'s `V`, `F`, `E`), CSS classes, ids, and `data-*` attributes.
- A change for readability must not change behavior: keep the math in the same order so numbers in the markup come out the same, and confirm with `node tools/same.mjs` as you go (seconds) and `snap.mjs --compare` before committing (0 differences for both; see Checking a change).

## Building games

Games are aligned to Illustrative Mathematics (IM): IM K–5 Math for Grades K–5, IM 6–8 Math for Grades 6–8. Each grade's `CLAUDE.md` has its curriculum reference and any rules for that age. Every game runs on `shared/engine.js` (stations, 8 problems a round and 10 for the boss with no repeats, 10/5 points, hints, stars in `localStorage`, `#<zone id>` links). To build one, copy `grade6/unit3/` (index.html, stations.js, checks.js), or `grade2/unit5/` for K–2 (read aloud, young styles, K–5 pictures), or `grade3/unit1/` or `grade4/unit1/` for Grades 3–5 (K–5 pictures, standard styles), then:
- write the generators in `stations.js`: each returns a problem (`num`, `pair`, `mc`, or `tap`; the shapes are documented at the top of `engine.js`), and `ZONES` lists the stations with the boss last as `id:'boss'`;
- set the save key, words, and any hooks in `Game.init` (Unit 1 shows the hooks: its own figure drawing, a zone note, and a Build-it mode);
- set limits for every station in `checks.js`, plus a `check` for each real-world rule. Answers must be positive unless `checks.js` sets `signed: true` (Grade 6 Unit 7 on); then give every typed problem `neg: true`, which opens the full keyboard (phone number pads have no minus key), and type points as `pair` problems with `point: true`.
- make `check` work every answer out again, not just look at it. When a problem's numbers are only in its picture (a line plot, a point on a number line, a shape), give it `facts` (the numbers it was made from) for `check` to use. To be sure the checks catch mistakes, change each answer to a wrong one and confirm `check` complains.
- when typed answers can be hundredths (decimals, money, cents of a dollar), pass `near: (x, y) => Math.abs(x - y) < 0.005` to `Game.init`: the default ±0.011 counts 0.92 as right for 0.91. It still accepts 0.33 for 1/3.

Only add to `shared/` what more than one unit needs, and keep the engine free of unit-specific words; pass them in through `Game.init`.

When building a game:
- Generated problems must make sense in the real world, not just compute (no part bigger than its whole, no 150% of a full tank, realistic amounts).
- A named mistake (`misc`) must never equal the answer: when it doesn't apply to these numbers (÷ 10 for 10%), leave it out; when a wrong method lands on the answer (16 ÷ 4 for the side of a square of area 16), deal other numbers.
- Keep numbers friendly enough to do in your head (basic facts, few nonzero digits, at most one regroup) so the concept is the challenge, not the arithmetic. Enforce these limits in `checks.js`.
- Skip open-ended lessons (Fermi problems, projects); say so in the game's "For grown-ups" section.
- Avoid gendered pronouns for named students; reword instead.

## Math facts

`facts/` is practice for any grade, linked from the root page under the grade cards. It doesn't use `shared/engine.js`, whose rounds end: Quick Pick plays forever. `facts/facts.js` (its header documents the API) holds the sets (addition and subtraction within 10 or 20, multiplication tables 0 to 12, division by 1 to 12), facts shown plainly (7 + 8 = ?) or with a number hidden (7 + ? = 15, `fact.ask`), four choices for each fact (the answer and three named mistakes), how to work a fact out (`factHelp`, with ten-frames, arrays, or a rectangle broken apart) and a hint that doesn't give the answer away (`factHint`), and the picker: missed or hinted facts come back 3 to 5 facts later until they're right twice in a row, and known facts come up less. Progress is saved per fact under `facts-save`. `tools/facts.mjs` (run by `check.mjs`) deals every fact of every set many times and checks the choices, help, hints, and picker; `tests/facts.spec.js` plays it. A new facts game (typing the answer, missing numbers, a sprint) gets its own page in `facts/` on the same engine, and a card on `facts/index.html`.

## Learn pages

Interactive tutorials live next to each game. A unit's `grade<N>/unit<M>/learn.html` lists its chapters and gets the Learn link on the unit's card on the grade page; each chapter is a page of its own, `learn/<id>.html`, with its widgets and steps in `learn/<id>.js`. They run on `shared/learn.js` (its header documents `UNIT`); Grade 6 Unit 1 is the template.

- Each unit has a checklist, `learn/CHECKLIST.md`: every chapter and step, with items saying what it must do (including edge cases), each followed by a short test script that `tests/checklists.spec.js` runs (the commands are in `tools/checklists.mjs`). `node tools/check.mjs` fails when a step has no items; `--fix` adds headings for new chapters and steps and refreshes the quick-check lines, which come from the chapters' code. Write the items as you build a step.
- To add a chapter: add it to `learn/chapters.js` in lesson order (with its step count), then copy a chapter page and script and rename them to the new id. Code two of the unit's chapters use goes in `learn/common.js`; code other units could use goes in `shared/`. `node tools/check.mjs` checks that every chapter has its page and the right number of steps.

- Chapters follow the IM sections in lesson order. Each step has one idea, something to move (slider, tap, drag), and a quick check with named mistakes; `Next` unlocks after the check.
- A chapter page routes by hash (`#s2`, `#done`); progress for the unit is saved in `localStorage` under chapter ids, so chapters can be added or moved without losing it. Units that used to be one page (`learn.html#c2s1`) keep a `legacy` list in `UNIT` so that progress and old links still find their chapter. When the unit has a game, each chapter ends with a link to the matching game zone (`../#<zone id>` starts that zone); leave out `game` until it does.
- For young readers (Grades K–2), use `<body class="young">` on the unit's pages and `readAloud: true` in `UNIT`. Grade 2 Unit 1 (`grade2/unit1/`) is the template for those. K–5 pages load `shared/pictures.css` and the picture files they use (see Layout).
- 3D uses three.js (pinned version, loaded through an import map from cdn.jsdelivr.net, only when a 3D step opens). Every 3D widget needs a flat SVG fallback for devices or networks without WebGL. Grade 6 Unit 1's `learn/common.js` has the viewers: `solid3D` folds a net, and `polyView` turns a polyhedron (from `shared/solids.js`) so students can tap its faces, edges, or vertices; its fallback is `solidSvg`.
- Nets are defined as flat faces hinged to a parent face; `buildNet(...).check()` confirms a net folds closed. Run it on every net (and confirm invalid cube nets fail) before shipping.

## Study guides

A unit can have a printable study guide, `grade<N>/unit<M>/study.html`, linked from its card on the grade page as `<a class="study">Study guide →</a>`. Grade 6 Unit 1's is the only one so far: a formula sheet, one part per IM section (what to know, a worked example, the mistake to watch for, practice), a practice test, and an answer key. Its text is in the HTML and its diagrams are drawn by `study.js` into `<figure data-fig="name">` placeholders. Unlike the rest of the site, it's a plain white page with dark ink, on screen just as on paper (it loads `theme.css` only for the fonts and resets, and turns off the navy grid); its `@media print` styles fit it to letter paper, drop the back link, and start the test and the key on new pages. Its styles and its `Diagram` helper live in the unit; move them to `shared/` when a second unit gets a study guide. `tests/study.spec.js` checks every study guide.

## Checking a change

- `npm test` runs the Playwright tests in `tests/` on a desktop and a phone (touch) screen, with real clicks, taps, typing, and drags: every station of every game played to the end, and negative and point answers typed (`games.spec.js`), every Learn unit walked chapter by chapter through its quick checks (`learn-walk.spec.js`), every step's edge cases (`learn-steps.spec.js`: every widget button, steppers past their limits, sliders end to end, every named mistake, empty and formatted answers, progress after a reload, no sideways scrolling), every checklist item (`checklists.spec.js`), the 3D steps tapped and turned (`learn-3d.spec.js`), flat shapes dragged by mouse, finger, and arrow keys (`learn-drag.spec.js`), every study guide opened from its grade page, with each diagram drawn and print styles on (`study.spec.js`), and the math facts played with right and wrong answers, hints, saved settings, and the fact map (`facts.spec.js`). Run `npm install` and `npx playwright install chromium` once first. A test fails if the page throws. 3D views have a test hook (`polyView`'s `api.targets()`) that says where each face, edge, and vertex is on screen. When you add a widget, add a test that uses it the way a student would, including the edge cases (limits, a second tap, a wrong answer).

- `node tools/check.mjs` before every commit (run `npm install` once first, for Prettier; GitHub Actions also runs it on every push and pull request, in `.github/workflows/check.yml`; Pages deploys `main` regardless, so fix a red check right away): every JavaScript file is formatted with Prettier (`--fix` formats them), relative links resolve, cache stamps are current (`--fix` rewrites them), every page loads the shared scripts it uses and no picture file it doesn't, no two shared files declare the same name, typed answers parse (`parseNum`), and `tools/fuzz.mjs` deals 5,000 problems per station (`N=20000` for more) checking for NaN/undefined, duplicate choices, a missing answer, a named mistake that gives the right answer, too few different problems for a round, the limits, and the real-world checks; and `tools/facts.mjs` checks the math facts engine.
- `node tools/snap.mjs <dir>` screenshots every landing page, station, answer state, results screen, and Learn step (it finds `grade*/index.html`, `grade*/unit*/stations.js`, and `grade*/unit*/learn.html` itself) at desktop and phone width, with a seeded `Math.random` and outside files (fonts, three.js) cached in `tools/.cache/`, so runs are identical. It also prints an `OVERFLOW` line for any page that scrolls sideways; there must be none. For a change that shouldn't alter how pages look (anything in `shared/`, any refactor), take shots before and after and run `node tools/snap.mjs --compare <before> <after>`: it must report 0 differences. Take the "before" shots from a clean checkout (`git worktree add <dir> HEAD`). For a change that should alter the look, look at the differing shots.
- `node tools/same.mjs [rev] [file …]` loads the `shared/` picture and helper files (all but engine.js, learn.js, and speak.js) as they are at `rev` (default `HEAD`) and as they are now, runs the same few thousand calls in both with a seeded `Math.random`, and fails if any result differs or a call throws. It takes about a second, so run it after each step of a refactor; `snap.mjs --compare` still decides before a commit. Its calls are listed in `CALLS` at the top of the file: when you add a shared function or option, add calls that reach it. Give it a unit folder (`node tools/same.mjs HEAD grade3/unit1`) to check that unit's own code the same way: the problems every station deals (300 each, with 0 and 3 stars) and each Learn chapter's steps and quick-check figures. It doesn't run widgets, which need a page; `npm test` and `snap.mjs --compare` cover those.
