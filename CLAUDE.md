# Math games

Static HTML math games served with GitHub Pages at https://ssullivan.github.io/fictional-pancake/ (from `main`, repo root). Grades so far: 2 (`grade2/`, page skeleton only) and 6 (`grade6/`).

Maintainability comes first: anything two pages share belongs in `shared/`, not in copies.

## Layout

```
index.html                grade picker (one card per grade)
shared/                   used by every grade; each file's header comment documents its API
  theme.css               colors, fonts, page header, pills, buttons, feedback boxes: every page
  game.css, engine.js     game screens and the game engine (Game.init)
  figures.css, figures.js double number lines, ratio tables, diagram styles
  learn.css, learn.js     Learn page screens and framework (Learn.init)
  k5.css, k5.js           ten-frames, cubes, base-ten blocks, tape diagrams, steppers: K–5 Learn pages
  landing.css             grade cards (root page) and unit cards (grade pages)
  util.js                 R, pick, shuffle, gcd, lcm, $, Q, parseNum
tools/                    check.mjs, fuzz.mjs, snap.mjs (see Checking a change)
grade6/
  index.html              grade page: one card per IM unit, with Learn/Play links
  CLAUDE.md               that grade's games, grade-specific rules, and IM curriculum reference
  unit3/index.html        game page: HTML, unit-only CSS, and Game.init({...})
  unit3/stations.js       the game's problem generators, ZONES, and ICON
  unit3/checks.js         the game's number limits and real-world checks for the fuzz test
  unit1/learn.html        Learn page: HTML, unit-only CSS, and Learn.init({...})
  unit1/lessons.js        the Learn page's widgets and chapters (CH, ICON)
```

- Everything for a unit lives in `grade<N>/unit<M>/`. Pages load `shared/` with `../../shared/...`.
- When adding a game or tutorial, add its link to that unit's card on `grade<N>/index.html` (and turn a "Coming soon" card into a real one). When adding a grade, create `grade<N>/index.html` and `grade<N>/CLAUDE.md` from Grade 6's (or Grade 2's for K–5), add a card to the root `index.html` in grade order, and update its "Grades …" eyebrow.
- Games and tutorials link back to their grade page with `href="../"` ("← Grade N").
- The old top-level folders (`area_and_surface_area/`, `introducing_ratios/`, `unit_rates_and_percentages/`, `arithmetic_in_base_ten/`) are redirect stubs so old links and bookmarks keep working (the hash is kept). Don't put new content there.
- Use relative links only (the site is served under `/fictional-pancake/`, not `/`).
- `.nojekyll` disables Jekyll processing so files are served as-is.
- `localStorage` is shared by the whole site, so keys must be unique across grades. Existing pages keep their keys (`bb-save`, `mm-save`, `rr-save`, `dd-save`, `bb-learn`) so saved progress survives; new ones use `g<N>u<M>-save` / `g<N>u<M>-learn`.
- Local CSS and JS are loaded with a `?v=<hash>` cache stamp; `node tools/check.mjs --fix` writes them. Never edit a stamp by hand.

## Building games

Games are aligned to Illustrative Mathematics (IM): IM K–5 Math for Grades K–5, IM 6–8 Math for Grades 6–8. Each grade's `CLAUDE.md` has its curriculum reference and any rules for that age. Every game runs on `shared/engine.js` (stations, 8 problems a round and 10 for the boss, 10/5 points, hints, stars in `localStorage`, `#<zone id>` links). To build one, copy `grade6/unit3/` (index.html, stations.js, checks.js), then:
- write the generators in `stations.js`: each returns a problem (`num`, `pair`, `mc`, or `tap`; the shapes are documented at the top of `engine.js`), and `ZONES` lists the stations with the boss last as `id:'boss'`;
- set the save key, words, and any hooks in `Game.init` (Unit 1 shows the hooks: its own figure drawing, a zone note, and a Build-it mode);
- set limits for every station in `checks.js`, plus a `check` for each real-world rule.

Only add to `shared/` what more than one page needs, and keep the engine free of unit-specific words; pass them in through `Game.init`.

When building a game:
- Generated problems must make sense in the real world, not just compute (no part bigger than its whole, no 150% of a full tank, realistic amounts).
- Keep numbers friendly enough to do in your head (basic facts, few nonzero digits, at most one regroup) so the concept is the challenge, not the arithmetic. Enforce these limits in `checks.js`.
- Skip open-ended lessons (Fermi problems, projects); say so in the game's "For grown-ups" section.
- Avoid gendered pronouns for named students; reword instead.

## Learn pages

Interactive tutorials live next to each game as `grade<N>/unit<M>/learn.html` and get a Learn link on the unit's card on the grade page. They run on `shared/learn.js`; Grade 6 Unit 1 (`learn.html` + `lessons.js`) is the template.

- Chapters follow the IM sections in lesson order. Each step has one idea, something to move (slider, tap, drag), and a quick check with named mistakes; `Next` unlocks after the check.
- Routing is by hash (`#c2s1`, `#c2done`); progress is saved in `localStorage`. When the unit has a game, each chapter ends with a link to the matching game zone (`./#<zone id>` starts that zone); leave out `game` until it does.
- For young readers (Grades K–2), use `<body class="young">` and `Learn.init({readAloud: true})`. Grade 2 Unit 1 (`grade2/unit1/`) is the template for those. K–5 pages load `shared/k5.css` and `k5.js` for their pictures and controls.
- 3D uses three.js (pinned version, loaded through an import map from cdn.jsdelivr.net, only when a 3D step opens). Every 3D widget needs a flat SVG fallback for devices or networks without WebGL.
- Nets are defined as flat faces hinged to a parent face; `buildNet(...).check()` confirms a net folds closed. Run it on every net (and confirm invalid cube nets fail) before shipping.

## Checking a change

- `node tools/check.mjs` before every commit (GitHub Actions also runs it on every push and pull request, in `.github/workflows/check.yml`; Pages deploys `main` regardless, so fix a red check right away): relative links resolve, cache stamps are current (`--fix` rewrites them), and `tools/fuzz.mjs` deals 5,000 problems per station (`N=20000` for more) checking for NaN/undefined, duplicate choices, a missing answer, the limits, and the real-world checks.
- `node tools/snap.mjs <dir>` screenshots every landing page, station, answer state, results screen, and Learn step (it finds `grade*/index.html`, `grade*/unit*/stations.js`, and `grade*/unit*/learn.html` itself) at desktop and phone width, with a seeded `Math.random` and outside files (fonts, three.js) cached in `tools/.cache/`, so runs are identical. It also prints an `OVERFLOW` line for any page that scrolls sideways; there must be none. For a change that shouldn't alter how pages look (anything in `shared/`, any refactor), take shots before and after and run `node tools/snap.mjs --compare <before> <after>`: it must report 0 differences. Take the "before" shots from a clean checkout (`git worktree add <dir> HEAD`). For a change that should alter the look, look at the differing shots.
