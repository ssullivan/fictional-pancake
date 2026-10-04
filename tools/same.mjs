// Checks that a change to shared/ drew and computed exactly what it did before: a quick test for a refactor
// (new names, comments, reorganized code) that runs in seconds, where snap.mjs --compare takes minutes.
//
//   node tools/same.mjs                    the working tree against HEAD
//   node tools/same.mjs main               against another revision
//   node tools/same.mjs HEAD blocks shapes only those files' calls
//   node tools/same.mjs HEAD grade3/unit1  a unit's own code: its game's problems and its Learn chapters' quick checks
//
// The shared files that don't need a page (everything but engine.js, learn.js, and speak.js) are loaded twice, as they are
// at the revision and as they are now, each set in its own context like a page's scripts. Every call in CALLS below then
// runs in both, with the same seeded Math.random, and the results (markup, numbers, objects) must match exactly.
// A function's calls should reach every option and branch; add calls when you add a function or an option.
// This only covers what CALLS covers, so a change that should look the same still needs snap.mjs --compare before it ships.
//
// A unit folder (grade<N>/unit<M>) loads that unit's pages instead, at the revision and now: its game's scripts as
// index.html lists them, dealing PROBLEMS problems from every station (with 0 and 3 stars saved) with the same seed, and
// each Learn chapter's scripts as its page lists them, comparing its steps (titles, text, quick checks) and quick-check
// figures (F). Widgets need a page, so they aren't run: snap.mjs --compare and npm test cover them.
import { readFileSync, existsSync, globSync } from "node:fs";
import { join, resolve, dirname, basename, normalize } from "node:path";
import { execFileSync } from "node:child_process";
import vm from "node:vm";

const ROOT = resolve(import.meta.dirname, "..");
const [rev = "HEAD", ...args] = process.argv.slice(2);
const isUnit = (a) => /^grade\d+\/unit\d+\/?$/.test(a);
const only = args.filter((a) => !isUnit(a)),
  units = args.filter(isUnit).map((a) => a.replace(/\/$/, ""));
// in load order: each file may use the ones before it
const FILES = [
  "util",
  "pictures",
  "figures",
  "fracmath",
  "algebra",
  "blocks",
  "numlines",
  "fractions",
  "graphs",
  "shapes",
  "measure",
  "multiply",
  "angles",
  "solids",
];

function load(atRev) {
  // fmt is a page's own number formatting, which figures.js uses
  const context = vm.createContext({
    Math,
    JSON,
    console,
    document: {},
    window: {},
    fmt: (v) => String(+(+v).toFixed(2)),
  });
  for (const f of FILES) {
    const path = `shared/${f}.js`;
    let src;
    try {
      src = atRev
        ? execFileSync("git", ["show", `${atRev}:${path}`], {
            cwd: ROOT,
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"],
          })
        : readFileSync(join(ROOT, path), "utf8");
    } catch {
      continue;
    } // a file that didn't exist yet
    // top-level const and let become var, so they're visible to the calls below
    vm.runInContext(src.replace(/^(const|let) /gm, "var "), context, { filename: `${atRev || "now"}:${path}` });
  }
  return context;
}

const TF = ["false", "true"];
const each = (list, f) => list.flatMap(f);
const CALLS = {
  util: [
    "R(3, 9)",
    "pick([1, 2, 3, 4])",
    "shuffle(range(9))",
    "gcd(84, 36)",
    "lcm(6, 15)",
    `miscOf(5, [[4, 'a'], [6, 'b'], [4, 'c']])`,
    `problemKey({prompt: 'p', explain: 'e', choices: [{label: 'b'}, {label: 'a'}]})`,
    `mcOf([['1', null], ['2', 'no'], ['3', 'no']])`,
    `mcOf([['1', 'no'], ['2', null], ['3', 'no'], ['4', 'no']], {stack: true})`,
    ...[
      "12",
      "$4.50",
      "1,200",
      "3/4",
      "2 1/2",
      "-2 1/2",
      "12 cm",
      "1.5/2",
      "abc",
      "",
      "-7",
      ".5",
      "−7",
      "−2 1/2",
      "–3",
    ].map((s) => `parseNum(${JSON.stringify(s)})`),
    `seg('Pick', [[1, 'One'], ['b', 'Two']])`,
    `stepper('n', 'Rows')`,
  ],
  pictures: [
    `cellsOf([3, 'a'], [2, 'b'], [1, null])`,
    "xOut(3, 4, 10, 12)",
    "fr(3, 4)",
    "frT(10, 20, 3, 4)",
    `frT(10, 20, 12, 100, 'cy')`,
    ...[0, 3, 4, 9, 12].map((k) => `mixed(${k}, 4)`),
    "partName(3, 2)",
    "partName(4)",
    "partName(100, 1)",
  ],
  figures: [
    'svgWrap(100, 50, "<g/>")',
    "qbox(10, 20)",
    `qbox(10, 20, 'x')`,
    ...each(TF, (show) => [
      `dnl('cups', 'cost', [{t: 0, b: 0, st: 1, sb: 1}, {t: 2, b: 5, st: 2, sb: 2, q: 'b'}, {t: 4, b: 10, st: 0, sb: 1, q: 't'}, {t: 6, b: 15, st: 1, sb: 0}])(${show})`,
      `dnl('a', 'b', [{t: 0, b: 0, st: 1, sb: 1}, {t: 3, b: 1.5, st: 2, sb: 1}], {fb: v => v + '%'})(${show})`,
      `tableFig({hx: 'x', hy: 'y'}, [{x: 3, y: 5}, {x: 6, y: 10, h: 1, note: '× 2'}, {x: 12, q: 'y', note: '× 4'}, {q: 'x', y: 7}])(${show})`,
      `tapeFig({A: 'red', B: 'blue'}, 3, 2, 4, {qa: 0, qb: 1, qt: 0, showA: 1, showB: 0, showT: 1})(${show})`,
      `tapeFig({A: 'red', B: 'blue'}, 2, 5, 3, {qa: 1, qb: 0, qt: 1, showA: 0, showB: 1, showT: 0})(${show})`,
      `pctTape(4, 3, {W: 80, part: 60, qW: 0, qP: 1, each: 20})(${show})`,
      `pctTape(10, 7, {W: 50, part: 35, qW: 1, qP: 0, each: 5})(${show})`,
      ...["{askA: 1}", "{askP: 1}", "{askW: 1}"].flatMap((ask) =>
        [
          [200, 30, 60],
          [40, 10, 4],
          [80, 125, 100],
          [50, 15, 7.5],
        ].map(([W, P, x]) => `pctLine(${W}, ${P}, ${x}, ${ask})(${show})`),
      ),
    ]),
    `rowsDiagram([{n: 6, sh: MARKS[0]}, {n: 4, sh: MARKS[3]}])`,
    `rowsDiagram([{n: 6, sh: MARKS[1]}, {n: 9, sh: MARKS[2]}], {groups: 3, s: 24, label: 'L'})`,
    ...[1, 2, 4].map((n) => `batchDiagram(2, 3, ${n}, {dish: 'soup', x: ['cup', 'cups'], y: ['spoon', 'spoons']})`),
    ...each(TF, (show) =>
      [
        [100, 100, 100],
        [60, 5, 3],
        [30, 20, 6],
        [90, 150, 135],
      ].map(([W, P, x]) => `pctLine(${W}, ${P}, ${x}, {askP: 1})(${show})`),
    ),
    `tableFig({hx: 'a', hy: 'b'}, [{x: 1, y: 2}, {x: 2.5, y: 5}])(false)`,
    `coinsFig([])()`,
    "mixColor(2, 3)",
    "mixColor(5, 0)",
    `coinsFig([COIN_SET[0], COIN_SET[3], COIN_SET[1]])()`,
  ],
  fracmath: [
    "frac(-6, -8)",
    "frac(5)",
    "fAdd([1, 2], [1, 3])",
    "fSub([3, 4], [1, 4])",
    "fMul([2, 3], [3, 4])",
    "fDiv([3, 4], [1, 8])",
    "fVal([7, 4])",
    "fInv([2, 5])",
    "isWhole([6, 1])",
    ...["[14, 3]", "[2, 3]", "[6, 1]"].flatMap((a) => [`fx(${a})`, `ftx(${a})`, `fim(${a})`]),
    "fT(40, 20, [14, 3])",
    `fT(40, 20, [3, 4], {cls: 'cy', unit: 'cups'})`,
    "fT(40, 20, [2, 1], {unit: 'in'})",
    "rectGrid([3, 1], [2, 1], 1)",
    `rectGrid([3, 2], [1, 1], 4, {shade: 3, unit: 'ft'})`,
    `rectGrid([5, 4], [3, 4], 4, {label: 'A grid'})`,
    "cubeBox([2, 1], [1, 1], [3, 2], 2)",
    `cubeBox([3, 1], [3, 1], [3, 1], 1, {unit: 'cm', label: 'A cube'})`,
  ],
  blocks: [
    ...[1, 2, 3].map(
      (f) =>
        `tenFrames(['a', 'b', null, 'a', 'a', 'b', 'a', null, 'b', 'a', 'a', 'b', 'a'], {frames: ${f}, out: new Set([1, 4]), tap: true})`,
    ),
    `tenFrames(['a', 'a'])`,
    `cubes(3, 4, 7, 'b')`,
    ...each(
      [
        [0, 0],
        [3, 7],
        [4, 0],
        [0, 9],
        [9, 12],
      ],
      ([t, o]) => ["{}", "{traded: 3, outT: 1, outO: 2}"].map((opt) => `blocks(5, 6, ${t}, ${o}, 'a', ${opt})`),
    ),
    ...each(range(0, 100, 7), (a) =>
      each(range(1, 100, 9), (b) => TF.map((joined) => `addBlocks(${a}, ${b}, ${joined})`)),
    ),
    ...each(
      [
        [0, 0, 0],
        [1, 2, 3],
        [7, 11, 13],
        [0, 5, 0],
        [3, 0, 9],
      ],
      ([h, t, o]) => [
        `hto(3, 4, ${h}, ${t}, ${o}, {cls: {h: 'x', t: 'y', o: 'z'}, tr: 2})`,
        `htoFig(${h}, ${t}, ${o})`,
      ],
    ),
    ...range(0, 1000, 37).map((n) => `numBlocks(${n})`),
    ...range(0, 999999, 1237).map((n) => `numWords(${n})`),
    ...each([0, 1, 0.3, 12.34, 305020, 999999, 45.06], (v) =>
      [-2, -1, 0, 1, 2, 3, 4, 5].map((e) => `digitAt(${v}, ${e})`),
    ),
    ...each(["[2, 1, 0]", "[5, 4, 3, 2, 1, 0]", "[3, 2, 1, 0]", "[1, 0, -1, -2]", "[0, -1]"], (places) =>
      each([-1, 0, 2], (hi) =>
        TF.map(
          (tap) =>
            `pvChart([['A', 305020], ['B', 7], ['C', 45.06], ['D', 1200]], ${hi}, {places: ${places}, tap: ${tap}})`,
        ),
      ),
    ),
    "commas(305020)",
    ...each(
      [
        [5, 3],
        [47, 38],
        [1000, 1],
        [1203, 987],
        [5000, 2346],
        [99, 99],
        [909, 908],
        [4005, 1997],
        [20300, 10456],
        [99999, 1],
      ],
      ([a, b]) =>
        each(["+", "−"], (op) => [
          `algSteps(${a}, ${b}, '${op}')`,
          ...range(0, 7).map((done) => `algFig(${a}, ${b}, '${op}', ${done})`),
        ]),
    ),
    ...each(
      [
        [347, 6],
        [1205, 4],
        [9, 9],
        [2000, 3],
      ],
      ([a, b]) => [`mulSteps(${a}, ${b})`, ...range(0, 5).map((done) => `mulFig(${a}, ${b}, ${done})`)],
    ),
    `mulFig(52, 3, 1, 'L')`,
    ...each(
      [
        [146, 3],
        [57, 4],
        [96, 8],
        [405, 5],
      ],
      ([n, g]) => [`divideFig(${n}, ${g})`, `divideFig(${n}, ${g}, {split: false})`],
    ),
    `divideFig(30, 2, {label: 'L'})`,
    ...range(0, 4).map((shown) => `quotientFig(568, 4, [100, 40, 2], ${shown})`),
    `quotientFig(95, 4, [20, 3])`,
    `quotientFig(1250, 5, [200, 50], 1, 'L')`,
  ],
  numlines: [
    ...["null", `'?'`, "3"].map(
      (diff) => `tapes([{label: 'Ana', n: 12, show: 12}, {label: 'Bo', n: 7, show: '?'}], {diff: ${diff}})`,
    ),
    `tapes([{label: 'A', n: 40, show: 40}, {label: 'B', n: 90, show: 90}, {label: 'C', n: 55, show: '?'}])`,
    `partWhole([{n: 5, show: 5}, {n: 8, show: '?', hi: 1}], 13)`,
    `partWhole([{n: 2, show: 2}, {n: 3, show: 3}, {n: 4, show: 4}], '?', 'Parts')`,
    "numLine(0, 20)",
    'numLine(0, 10, {step: 1, big: 10, end: true, ls: ""})',
    "numLine(30, 70, {step: 5, big: 10, fmt: v => v * 10, pad: 30})",
    `numLine(0, 20, {arrows: [{a: 0, b: 8}, {a: 8, b: 13, lv: 1, q: 1}], shown: false})`,
    `numLine(0, 20, {arrows: [{a: 4, b: 8, q: 1}], shown: true})`,
    `numLine(0, 20, {hops: [{a: 2, b: 9, t: '+7'}, {a: 9, b: 4, t: '−5', q: 1}]})`,
    `numLine(0, 20, {pts: [{v: 3}, {v: 12, cls: 'b', t: 12}, {v: 14, t: 'x'}]})`,
    "numLine(0, 10, {tap: true})",
    `numLine(0, 100, {step: 10, big: 50, tap: 'cand', lab: v => v % 20 === 0})`,
    `numLine(10, 30, {u: 15.3, step: 2, big: 10, end: true, pts: [{v: 20, t: 20}, {v: 21, cls: 'b'}], hops: [{a: 10, b: 30, t: 20}],
      arrows: [{a: 0, b: 12}, {a: 12, b: 26, lv: 2, q: 1}], shown: true, tap: 'cand'})`,
    `numLine(-5, 5, {u: 33, pts: [{v: -2, t: '−2', cls: 'b'}, {v: 4, t: 4}], hops: [{a: 5, b: -5, t: '−10', q: 1}, {a: -1, b: 0, t: '+1'}]})`,
    `numLine(0, 1000, {step: 100, big: 500, fmt: v => v + 'k', ls: '', pad: 40, arrows: [{a: 200, b: 700, lv: 0}]})`,
    "jumps(45, [-3, -5, -10])",
    "jumps(45, [10, 3, -1], 2)",
    "jumps(20, [5, 5], 2, true)",
    "jumps(8, [2], 0)",
    "jumps(8, [2], 0, true)",
    "jumps(100, [-30, -4, 10, 1], 4, true)",
    "jumps(3, [1, 1, 1, 1, 1, 1])",
    `tapes([{label: 'A', n: 5, show: 5}, {label: 'B', n: 5, show: 5}], {diff: 'diff'})`,
    `tapes([{label: 'Long label', n: 1, show: '?'}, {label: 'B', n: 13, show: 13}], {diff: '?'})`,
    `partWhole([{n: 7, show: 7}], '?')`,
    `partWhole([{n: 1, show: 1, hi: 1}, {n: 99, show: 99}], 100)`,
    `timesTape([{label: 'A', times: 1, each: 4, total: 4}, {label: 'B', times: 3, each: 4, total: '?'}])`,
    `timesTape([{label: 'A', times: 1, each: '?', total: '?'}, {label: 'B', times: 1, span: 4, each: 20, total: '? × 5'}], {label: 'L'})`,
    `timesTape([{label: 'A', times: 1, each: 4, total: 4}, {label: 'B', times: 1, each: 4, total: 7, plus: '+3', plusBoxes: 0.75}])`,
    `timesTape([{label: 'A', times: 10, each: '2,000', total: '20,000'}])`,
  ],
  fractions: [
    `strips([{d: 4, k: 3}])`,
    `strips([{d: 3, k: 5, cls: 'b', lab: [5, 3]}, {d: 6, k: 2, parts: false}], {wholes: 2})`,
    `strips([{d: 8, k: 6, grp: 2}, {d: 10, k: 10, grp: [2, 3, 5], out: 3}], {W: 480, label: 'L'})`,
    `strips([{d: 4, k: 7, cls: 'g'}], {stack: true, empty: true, wholes: 3})`,
    `strips([{d: 12, k: 5, out: 2}], {empty: true, wholes: 2})`,
    `fracLine([{d: 4}])`,
    `fracLine([{d: 3, pts: [{k: 2}, {k: 4, cls: 'b'}], labs: true}, {d: 6, hops: 4, tap: true}], {wholes: 2, W: 520})`,
    `fracLine([{d: 4, hops: [[0, 3, 'q'], [3, 5]]}], {wholes: 2, marks: [{v: 0.75, t: [3, 4]}, {v: 1.5, t: 'here'}]})`,
    `fracLine([{d: 2, hops: 0}], {label: 'L'})`,
    `fracLine([{d: 5, tap: 'cand', pts: [{k: 2}]}], {wholes: 2})`,
    `strips([{d: 2, k: 1, lab: [1, 2]}, {d: 4, k: 2, lab: [2, 4]}, {d: 8, k: 4, lab: [4, 8]}])`,
    `strips([{d: 6, k: 6, grp: 3}, {d: 5, k: 12, grp: [4, 4, 4], out: 2, cls: 'b'}])`,
    `strips([{d: 3, k: 8, out: 4}, {d: 12, k: 9, parts: false}], {stack: true, wholes: 3, W: 400})`,
    `strips([{d: 100, k: 37}])`,
    `fracLine([{d: 8, labs: true, pts: [{k: 3, cls: 'g'}], hops: [[1, 4, ''], [4, 6, 'q']], tap: true}, {d: 4, pts: [{k: 7}]}], {wholes: 3, W: 600, marks: [{v: 2, t: '2'}]})`,
    `fracLine([{d: 3, hops: 5}, {d: 6, labs: true}, {d: 12}], {wholes: 2})`,
    `hundredGrid(cellsOf([30, 'a'], [25, 'b']))`,
    `hundredGrid([], {label: 'Empty'})`,
    `hundredGrid(cellsOf([100, 'a']))`,
  ],
  graphs: [
    `lineplot({3: 2, 4: 5, 6: 1}, 2, 7)`,
    `lineplot({3: 2, 4: 1}, 2, 7, {mark: 4, tap: true, diff: [3, 6], unit: 'cm', u: 48, label: 'L'})`,
    `lineplot({5: 2, 6: 3, 9: 1}, 4, 10, {d: 4, mark: 6, diff: [5, 9]})`,
    `lineplot({2: 1}, 0, 4, {d: 2, tap: true})`,
    ...each(
      ["{}", `{hi: 1, title: 'Weather', scale: 2, unit: '2 days'}`, `{tap: true, max: 12}`, `{tap: 'cand', scale: 5}`],
      (o) => [
        `picGraph([{label: 'Sunny', n: 7, pic: 'sun'}, {label: 'Cloudy', n: 4, pic: 'cloud'}, {label: 'Rainy', n: 5, pic: 'rain'}], ${o})`,
      ],
    ),
    `picGraph([{label: 'A', n: 3, pic: 'note', c: 'b'}, {label: 'Bee', n: 6, pic: 'dot', c: 'a'}], {scale: 2})`,
    `picGraph([{label: 'Strawberry', n: 15, pic: 'dot', c: 'b'}, {label: 'Kiwi', n: 0, pic: 'note', c: 'a'}, {label: 'Fig', n: 25, pic: 'sun'}], {scale: 10, unit: '10 votes', hi: 2, title: 'A rather long title for this graph', tap: 'cand'})`,
    `lineplot({8: 1, 9: 6, 11: 2}, 8, 12, {d: 8, tap: true, mark: 11, unit: 'pounds', u: 64})`,
    `lineplot({}, 0, 5, {diff: [1, 4]})`,
    `barGraph([{label: 'Red', n: 35, c: 'a'}, {label: 'Blue', n: 50, c: 'b'}], {max: 50, scale: 5, step: 1, uh: 20, edit: true, title: 'Votes', diff: [0, 1]})`,
    `barGraph([{label: 'A', n: 3, c: 'a'}, {label: 'B', n: 7, c: 'b'}, {label: 'C', n: 7, c: 'c'}, {label: 'D', n: 1, c: 'a'}], {hi: 3, diff: [0, 2], showDiff: true, tap: true})`,
    ...each(
      [
        "{}",
        `{max: 20, scale: 2, hi: 1, title: 'Pets'}`,
        `{max: 10, edit: true, step: 1, diff: [1, 0], showDiff: true}`,
        `{max: 100, scale: 10, uh: 18, hi: [0, 2], tap: true, diff: [2, 0]}`,
        `{max: 10, tap: 'cand'}`,
      ],
      (o) => [
        `barGraph([{label: 'Cats', n: 8, c: 'a'}, {label: 'Dogs', n: 3, c: 'b'}, {label: 'Fish', n: 0, c: 'c'}], ${o})`,
      ],
    ),
  ],
  shapes: [
    "regular(7, 10)",
    "SHAPES",
    ...each([3, 4, 5, 6], (k) =>
      each(range(0, 6), (i) => {
        const p = `SHAPES[${k}][${i}]`;
        return [
          ...each(
            [
              "{}",
              "{nums: true}",
              `{lens: ['a', 'b', 'c', 'd', 'e', 'f']}`,
              "{sq: true}",
              `{sq: true, nums: true, cls: 'x'}`,
            ],
            (o) => [
              `${p} ? shapeAt(${p}, 3, 4, 150, ${o}) : 0`,
              `${p} ? shapeFig(${p}, ${o}) : 0`,
              `${p} ? shapeFig(${p}, {s: 120, ...${o}}, 'L') : 0`,
            ],
          ),
          `${p} ? shapeAt(${p}.slice().reverse(), 0, 0, 200, {sq: true, nums: true}) : 0`,
        ];
      }),
    ),
    ...["square", "rectangle", "rhombus", "trapezoid"].map(
      (q) => `shapeFig(QUADS.${q}, {sq: true, lens: [1, 2, 3, 4]})`,
    ),
    `picRow(3, 100, 80, i => '<g>' + i + '</g>')`,
    `picRow(4, 100, 80, i => 'x', {letters: true, tap: 'Shape', label: 'Pic'})`,
    `shapeRow([[SHAPES[3][0], {nums: true}], [SHAPES[4][1], {lens: [1, 2, 3, 4]}], [SHAPES[5][0]]], {tap: 'Shape'})`,
    ...each(["cube", "box", "pyramid", "prism"], (k) =>
      each(TF, (back) => [110, 60].map((s) => `solidFig('${k}', {back: ${back}, s: ${s}})`)),
    ),
    // uneq only comes in 2, 3, or 4 parts
    ...each(["circle", "square", "rect"], (shape) =>
      each(["v", "h", "grid", "diag", "uneq"], (how) =>
        each(how === "uneq" ? [2, 3, 4] : [1, 2, 3, 4, 5, 6, 8], (n) => [
          `shareParts('${shape}', ${n}, '${how}', 6, 6, 150)`,
          `shareFig('${shape}', ${n}, '${how}', {shade: [0, 2], tap: true})`,
        ]),
      ),
    ),
    `shareRow('circle', [{n: 2}, {n: 4, how: 'grid', shade: [1]}, {n: 3, how: 'uneq'}])`,
    `shareRow('rect', [{n: 2, how: 'h'}], {letters: true})`,
    ...each(
      [
        ["hexagon", "triangle"],
        ["hexagon", "rhombus"],
        ["hexagon", "trapezoid"],
        ["trapezoid", "triangle"],
        ["rhombus", "triangle"],
      ],
      ([big, small]) =>
        each(["true", "false", "0", "1", "2", "3"], (show) => [
          `pbFig('${big}', '${small}', {show: ${show}})`,
          `pbFig('${big}', '${small}', {show: ${show}, s: 40})`,
        ]),
    ),
    `rectFig(6, 4)`,
    `rectFig(12, 8, {unit: 'm', ask: 'width'})`,
    `rectFig(20, 3, {unit: 'cm', ask: 'length', label: 'L'})`,
    `rectFig(5, 5, {grid: false})`,
  ],
  measure: [
    "hm(3, 5)",
    "hm(12, 30)",
    ...each(
      [
        [3, 0],
        [7, 45],
        [12, 15],
        [9, 59],
        [1, 30],
      ],
      ([h, m]) => [`clockFig(${h}, ${m})`, `clockFig(${h}, ${m}, {r: 70, fives: true, label: 'L'})`],
    ),
    "clockFig(6, 0, {shade: [0, 30]})",
    "clockFig(6, 0, {shade: [15, 60], fives: true})",
    "clockFig(6, 0, {shade: [0, 15]})",
    "dayBar(null)",
    "dayBar(0)",
    'dayBar(13.5, "L")',
    "dayBar(24)",
    `centsOf(['B', 'q', 'd', 'n', 'p'])`,
    ...[0, 5, 35, 100, 235, 300].map((c) => `amt(${c})`),
    `moneyFig(['q', 'd', 'n', 'p'])`,
    `moneyFig(['B', 'B', 'q', 'q', 'q', 'd', 'n', 'p', 'p', 'p', 'p'], {vals: true})`,
    `moneyFig(['B', 'B', 'B', 'B'], {W: 300})`,
    `moneyFig(['B'])`,
    `moneyFig(['p'], {vals: true})`,
    `moneyFig(['B', 'p'], {vals: true, W: 600})`,
    "clockFig(11, 55, {fives: true, shade: [30, 60]})",
    "clockFig(12, 0, {r: 40})",
    `moneyFig(['q', 'q', 'q', 'q', 'q', 'q', 'q', 'q'], {vals: true, W: 260, label: 'L'})`,
  ],
  multiply: [
    ...[1, 7, 12, 24, 36, 97].flatMap((n) => [`factors(${n})`, `pairsOf(${n})`, `isPrime(${n})`]),
    "hopLine(3, 30, 4)",
    `hopLine(5, 50, 6, {mark: 30, cls: 'r'})`,
    `hopLine(4, 40, 3, {mark: 18, cls: 'b', nums: 5, label: 'L'})`,
    "hopLine(10, 100, 10)",
    "tiles(3, 12)",
    "tiles(4, 14)",
    'tiles(1, 7, "L")',
    "tiles(6, 40)",
    "allRects(12)",
    "allRects(7)",
    "allRects(36)",
    `chart(30, v => v % 3 ? '' : 'a')`,
    `chart(100, v => v % 2 ? 'b' : v === 50 ? 'cur' : null, {tap: true})`,
    `chart(20, v => 'ab', {lo: 11, tap: 'cand', label: 'L'})`,
    "hopLine(6, 36, 0, {mark: 24})",
    "hopLine(7, 70, 10, {nums: 0, mark: 7})",
    "hopLine(25, 100, 2, {mark: 60})",
    "ctr(3, 4)",
    `ctr(3, 4, 'b moved', 9)`,
    "arrayFig(3, 4)",
    `arrayFig(3, 4, {band: 'r'})`,
    `arrayFig(3, 5, {band: 'c', k: 2, sum: true})`,
    `arrayFig(2, 6, {band: 'r', k: 1, sum: true, hi: [1, 3], tap: true})`,
    `arrayFig(4, 4, {hi: [0, 0], tap: true, label: 'L'})`,
    ...each([1, 3, 5, 6, 8, 10], (g) => [1, 4, 5, 8, 9, 10].map((n) => `groupsFig(${g}, ${n})`)),
    ...[7, 30, 2036, 405].map((n) => `placeParts(${n})`),
    ...each(
      [
        [236, 7],
        [36, 27],
        [4123, 6],
        [40, 30],
      ],
      ([a, b]) => [
        `areaModel(${a}, ${b})`,
        `areaModel(${a}, ${b}, {filled: 1})`,
        `partialFig(${a}, ${b})`,
        `partialFig(${a}, ${b}, 2)`,
      ],
    ),
    `areaModel(12, 3, {filled: 0, label: 'L'})`,
    `partialFig(12, 3, 0, 'L')`,
  ],
  angles: [
    `polar(10, 20, 30, 45)`,
    ...["point", "line", "ray", "segment"].map((kind) => `geoFig('${kind}')`),
    `geoFig('ray', {names: ['P', 'Q'], tilt: 30, label: 'L'})`,
    `angleMark(100, 100, 0, 90)`,
    `angleMark(100, 100, 20, 250, {r: 20, text: '230°'})`,
    ...[30, 90, 135, 180, 270, 360].map((deg) => `angleFig(${deg})`),
    `angleFig(50, {turn: 40, letters: ['A', 'B', 'C'], text: '?', label: 'L'})`,
    `angleFig(90, {mark: false, r: 80})`,
    ...[0, 35, 90, 160].map((deg) => `protractor(${deg})`),
    `protractor(65, {base: 'left'})`,
    `protractor(0, {ray: false, label: 'L'})`,
    ...[0, 40, 90, 120].map((cross) => `linesFig(${cross})`),
    `linesFig(0, {gap: 30, label: 'L'})`,
  ],
  solids: [
    ...[3, 4, 5, 6, 7, 8].map((n) => `basePoly(${n}, {a: 1.5})`),
    "basePoly(4, {rect: [3, 2]})",
    "view3([1, 2, 3], .4, .3)",
    `countsOf('prism', 5)`,
    `cap1('hexagon')`,
    ...each(["prism", "pyramid"], (kind) =>
      each([3, 4, 5, 6, 7, 8], (n) =>
        each(
          [
            "{}",
            "{a: 2, h: 2}",
            "{a: 3, h: 1.5}",
            "{rect: [3, 2], h: 2}",
            "{rect: [2, 2], h: 2}",
            "{rect: [2, 2], h: 3}",
          ],
          (o) => {
            const s = `solidOf('${kind}', ${n}, ${o})`;
            return [
              s,
              `solidSvg(${s})`,
              ...each(
                [
                  [-28, 22],
                  [0, 0],
                  [40, 60],
                  [-170, -30],
                  [90, 10],
                ],
                ([yaw, pitch]) => [
                  `seenOf(${s}, {yaw: ${yaw}, pitch: ${pitch}})`,
                  `solidSvg(${s}, {yaw: ${yaw}, pitch: ${pitch}, dots: true, bases: true, W: 200})`,
                ],
              ),
              ...each(
                [
                  [1, 0],
                  [0, 2],
                  [2, 1],
                ],
                ([top, bottom]) => {
                  const net = `netOf('${kind}', ${n}, {...${o}, top: ${top % n}, bottom: ${bottom % n}})`;
                  return [net, `netFig(${net}, {W: 280})`];
                },
              ),
            ];
          },
        ),
      ),
    ),
    ...each(["cylinder", "cone", "sphere", "open"], (k) => [160, 100, 230].map((W) => `curvedSvg('${k}', {W: ${W}})`)),
  ],
  algebra: [
    `mathVar('x')`,
    `withVars('3x + 4 = y, a cat, 2s, <b>t</b> and Lin’s z')`,
    `coordPlane([{x: 1, y: 3, id: 'a', t: 'A'}, {x: 4, y: 0, cls: 'b'}], {xMax: 6, yMax: 12, yStep: 2, xLabel: 'hours', yLabel: 'miles'})`,
    `coordPlane([{x: 2, y: 4, id: 'p'}, {x: 3, y: 6, id: 'q', cls: 'hi'}], {xMax: 20, yMax: 100, xStep: 1, yStep: 4, tap: true, line: [2, 1]})`,
    `coordPlane([], {xMax: 5, yMax: 5, line: [-1, 5], label: 'Falling line'})`,
    `coordPlane([{x: -3, y: 2, id: 'a', t: 'A'}, {x: 4, y: -5, id: 'b', cls: 'r'}], {xMin: -6, xMax: 6, yMin: -6, yMax: 6, width: 300, height: 300, quads: true, shade: 'II', tap: true})`,
    `coordPlane([{x: -2.5, y: 0}], {xMin: -5, xMax: 5, yMin: -10, yMax: 10, xStep: 0.5, yStep: 5, shapes: [{pts: [[-4, 5], [3, 5], [3, -5]], closed: true, cls: 'fill'}, {pts: [[0, 0], [-4, 0], [-4, 5]], cls: 'walk'}]})`,
    `coordPlane([], {xMin: -4, xMax: 4, yMin: -3, yMax: 3, shade: 'IV', line: [1, 0]})`,
  ],
};
function range(a, b, step = 1) {
  const out = [];
  for (let v = a; v < b; v += step) out.push(v);
  return out;
}

const before = load(rev),
  now = load(null);
// the same random numbers in both, for every call
const SEED = "Math.random = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })()";
const result = (context, expr) => {
  vm.runInContext(SEED, context);
  try {
    return JSON.stringify(vm.runInContext(expr, context));
  } catch (e) {
    return `throws ${e.message}`;
  }
};
// where two strings first differ, with a little around it
const firstDiff = (a, b) => {
  let i = 0;
  while (a[i] === b[i]) i++;
  const from = Math.max(0, i - 60);
  return [a.slice(from, i + 60), b.slice(from, i + 60)];
};

let calls = 0,
  differ = 0,
  broken = 0;
for (const [file, list] of Object.entries(CALLS)) {
  if (only.length ? !only.includes(file) : units.length) continue;
  let bad = 0;
  for (const expr of list) {
    const a = result(before, expr),
      b = result(now, expr);
    calls++;
    // a call that throws either way tests nothing: fix the call
    if (a === b && a.startsWith("throws ")) {
      broken++;
      console.log(`${file}: ${expr} ${a} (fix the call in tools/same.mjs)`);
      continue;
    }
    if (a === b) continue;
    bad++;
    differ++;
    if (bad <= 3) {
      const [was, is] = firstDiff(String(a), String(b));
      console.log(`${file}: ${expr}\n  was ${was}\n  now ${is}`);
    }
  }
  if (bad > 3) console.log(`${file}: ${bad - 3} more differ`);
}

// ---------- a unit's own code ----------
const PROBLEMS = 300;
// a file at the revision (null when it didn't exist yet) or now
const fileAt = (path, atRev) => {
  if (!atRev) return existsSync(join(ROOT, path)) ? readFileSync(join(ROOT, path), "utf8") : null;
  try {
    return execFileSync("git", ["show", `${atRev}:${path}`], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }
};
// the local scripts a page loads, in order, as paths from the repo root, leaving out the ones that need a page
const NEEDS_PAGE = ["engine.js", "learn.js", "speak.js"];
const scriptsOf = (page) =>
  [...readFileSync(join(ROOT, page), "utf8").matchAll(/<script src="([^"?]+)(?:\?[^"]*)?"><\/script>/g)]
    .map((m) => normalize(join(dirname(page), m[1])))
    .filter((path) => !NEEDS_PAGE.includes(basename(path)));
// a page's scripts loaded into one context, as they are at atRev (or now); Game.stars stands in for saved progress
function loadPage(page, atRev, globals = {}) {
  const context = vm.createContext({
    Math,
    JSON,
    console,
    document: {},
    window: {},
    matchMedia: () => ({ matches: false }),
    ...globals,
  });
  for (const path of scriptsOf(page)) {
    const src = fileAt(path, atRev);
    if (src !== null) vm.runInContext(src, context, { filename: `${atRev || "now"}:${path}` });
  }
  return context;
}
// a problem as text: its figure drawn both ways (without and with the hint), and any other function by name
function problemText(p) {
  if (!p || typeof p !== "object") return JSON.stringify(p);
  const figs = [false, true].map((show) =>
    typeof p.fig === "function"
      ? p.fig(show, show)
      : p.fig && typeof p.fig.svg === "function"
        ? p.fig.svg(show, show ? ["build"] : [])
        : p.fig,
  );
  return JSON.stringify({ ...p, fig: figs }, (key, v) => (typeof v === "function" ? `function ${v.name}` : v));
}
// runs the same thing in both and counts a difference; what() names it in the report
function compare(what, a, b) {
  calls++;
  if (a === b) return;
  differ++;
  const [was, is] = firstDiff(String(a), String(b));
  console.log(`${what}\n  was ${was}\n  now ${is}`);
}
const seeded = (context, f) => {
  vm.runInContext(SEED, context);
  try {
    return f();
  } catch (e) {
    return `throws ${e.message}`;
  }
};
for (const unit of units) {
  if (existsSync(join(ROOT, unit, "stations.js")))
    for (const stars of [0, 3]) {
      const [before, now] = [rev, null].map((atRev) =>
        loadPage(`${unit}/index.html`, atRev, { Game: { stars: () => stars } }),
      );
      const zonesOf = (context) => vm.runInContext("ZONES", context);
      zonesOf(now).forEach((zone, i) => {
        // every problem the station deals, one after another from the same seed
        const deal = (context) =>
          seeded(context, () =>
            range(0, PROBLEMS)
              .map(() => problemText(zonesOf(context)[i].gen()))
              .join("\n"),
          );
        compare(`${unit} game, ${zone.id} with ${stars} stars`, deal(before), deal(now));
      });
      compare(
        `${unit} game, icons`,
        JSON.stringify(vm.runInContext("ICON", before)),
        JSON.stringify(vm.runInContext("ICON", now)),
      );
    }
  for (const page of globSync(`${unit}/learn/*.html`, { cwd: ROOT }).sort()) {
    // a chapter's steps and quick-check figures; widgets are left as their names
    const chapter = (context) =>
      seeded(context, () =>
        JSON.stringify(vm.runInContext('({STEPS, F: typeof F === "undefined" ? null : F})', context), (key, v) =>
          typeof v === "function" ? `function ${v.name}` : v,
        ),
      );
    compare(`${page} steps`, chapter(loadPage(page, rev)), chapter(loadPage(page, null)));
  }
}
console.log(`${calls} calls against ${rev}, ${differ} differ${broken ? `, ${broken} throw` : ""}`);
process.exit(differ || broken ? 1 : 0);
