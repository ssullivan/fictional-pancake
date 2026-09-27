# Math games

Static HTML math games served with GitHub Pages at https://ssullivan.github.io/fictional-pancake/ (from `main`, repo root).

## Layout

```
index.html              grade picker (one card per grade)
grade6/
  index.html            grade page: one card per IM unit, with Learn/Play links
  CLAUDE.md             that grade's games and IM curriculum reference
  unit1/index.html      game for Unit 1
  unit1/learn.html      Learn tutorial for Unit 1
  ...
```

- Everything for a unit lives in `grade<N>/unit<M>/`: the game is `index.html` (self-contained), the tutorial is `learn.html`.
- When adding a game or tutorial, add its link to that unit's card on `grade<N>/index.html` (and turn a "Coming soon" card into a real one). When adding a grade, create `grade<N>/index.html` and `grade<N>/CLAUDE.md` from Grade 6's, and add a card to the root `index.html`.
- Games and tutorials link back to their grade page with `href="../"` ("← Grade N").
- The old top-level folders (`area_and_surface_area/`, `introducing_ratios/`, `unit_rates_and_percentages/`, `arithmetic_in_base_ten/`) are redirect stubs so old links and bookmarks keep working (the hash is kept). Don't put new content there.
- Use relative links only (the site is served under `/fictional-pancake/`, not `/`).
- `.nojekyll` disables Jekyll processing so files are served as-is.
- `localStorage` is shared by the whole site, so keys must be unique across grades. Existing games keep their keys (`bb-save`, `mm-save`, `rr-save`, `dd-save`, `bb-learn`) so saved progress survives; new games use `g<N>u<M>-save` / `g<N>u<M>-learn`.

## Building games

Games are aligned to Illustrative Mathematics (IM) 6–8 Math. Grade 6 Units 2, 3, and 5 share one engine (stations, 8 problems a round, 10/5 points, hints, `localStorage` save); build new games from `grade6/unit3/index.html`.

When building a game:
- Generated problems must make sense in the real world, not just compute (no part bigger than its whole, no 150% of a full tank, realistic amounts).
- Keep numbers friendly enough to do in your head (basic facts, few nonzero digits, at most one regroup) so the concept is the challenge, not the arithmetic. Enforce these limits in the fuzz test too.
- Fuzz-test every generator in Node before shipping (thousands of problems per station: no NaN/undefined, no duplicate choices, answer present, plus a check for each real-world constraint), and screenshot each station with headless Chrome, including one at phone width.
- Skip open-ended lessons (Fermi problems, projects); say so in the game's "For grown-ups" section.
- Avoid gendered pronouns for named students; reword instead.

## Learn pages

Interactive tutorials live next to each game as `grade<N>/unit<M>/learn.html` and get a Learn link on the unit's card on the grade page. Grade 6 Unit 1 (`grade6/unit1/learn.html`) is the template.

- Chapters follow the IM sections in lesson order. Each step has one idea, something to move (slider, tap, drag), and a quick check with named mistakes; `Next` unlocks after the check.
- Routing is by hash (`#c2s1`, `#c2done`); progress is saved in `localStorage`. Each chapter ends with a link to the matching game zone (`./#<zone id>` starts that zone).
- 3D uses three.js (pinned version, loaded through an import map from cdn.jsdelivr.net, only when a 3D step opens). Every 3D widget needs a flat SVG fallback for devices or networks without WebGL.
- Nets are defined as flat faces hinged to a parent face; `buildNet(...).check()` confirms a net folds closed. Run it on every net (and confirm invalid cube nets fail) before shipping.
- Screenshot every step with headless Chrome (`--use-angle=swiftshader --enable-unsafe-swiftshader` for WebGL), including phone width.
