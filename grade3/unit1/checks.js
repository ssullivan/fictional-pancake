/* Orchard Market: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most
   nonzero digits, max = largest value, for the answer and every number in the prompt. Everything stays within 100. */
const L = {dp: 0, nz: 2, max: 100};
const plain = t => String(t).replace(/<[^>]*>/g, '');
// things with a fixed count, and the most that fit in one group of the others
const FIXED = {spiders: 8, cars: 4, tricycles: 3, hands: 5, cows: 4, ants: 6};
const MOST = {apples: 10, oranges: 10, peaches: 10, flowers: 10, strawberries: 10, 'juice boxes': 8};
// arrays that only come in some sizes
const SIZES = {muffins: ['2 × 6', '3 × 4', '4 × 6'], eggs: ['2 × 6']};
module.exports = {
  limits: {pics: L, bars: L, groups: L, equations: L, arrays: L, flip: L, boss: L},
  check(p) {
    const bad = [], prompt = plain(p.prompt), labels = (p.choices || []).map(c => c.label);
    const right = p.kind === 'mc' ? labels[p.choices.findIndex(c => c.id === p.answer)] : null;
    const wrong = p.kind === 'mc' ? labels.filter((l, i) => p.choices[i].id !== p.answer) : [];
    // what the game tells a student: the prompt, hint, worked answer, the message for each mistake, and the right choice
    const told = [p.prompt, p.hint, p.explain, ...(p.misc || []).map(m => m[1]), ...Object.entries(p.why || {}).filter(([id]) => id !== String(p.answer)).map(([, m]) => m), right].map(plain).join(' ');
    // every product it states is right, and factors stay within 10 (a wrong choice can show a total as a factor, like 24 × 3 = ?)
    for (const [t, a, b, c] of told.matchAll(/\b(\d+) × (\d+) = (\d+)\b(?! ×)/g)) if (a * b !== +c) bad.push(`${t} is wrong`);
    for (const [t, a, b, c] of told.matchAll(/(?<!× )\b(\d+) = (\d+) × (\d+)\b/g)) if (b * c !== +a) bad.push(`${t} is wrong`);
    for (const [t, a, b] of told.matchAll(/\b(\d+) × (\d+)\b/g)) if (+a > 10 || +b > 10 || a * b > 100) bad.push(`${t} is past 10 × 10`);
    // an equation with an unknown is true with the answer in it
    let m;
    if (p.kind === 'num' && (m = prompt.match(/(\d+|\?) × (\d+|\?) = (\d+|\?)$/))) {
      const [a, b, c] = m.slice(1).map(v => v === '?' ? p.answer : +v);
      if (a * b !== c) bad.push(`${m[0]} is not true with ${p.answer}`);
    }
    // graphs use a scale of 2, 5, or 10
    for (const [t, s] of prompt.matchAll(/Each picture shows (\d+)/g)) if (![2, 5, 10].includes(+s)) bad.push(`${t}: not a scale of 2, 5, or 10`);
    // things with a fixed count have it, and groups aren't overfull
    for (const [t, , what, n] of prompt.matchAll(/(\d+) (spiders|cars|tricycles|hands|cows|ants) with (\d+)/g)) if (FIXED[what] !== +n) bad.push(`${t}: ${what} don't have ${n}`);
    for (const [t, n, what] of prompt.matchAll(/(\d+) (apples|oranges|peaches|flowers|strawberries|juice boxes) (?:in|on) each/g)) if (+n > MOST[what]) bad.push(`${t}: too many in one`);
    if ((m = prompt.match(/has (\d+) rows, with (\d+) (muffins|eggs) in each row/)) && !SIZES[m[3]].includes(`${m[1]} × ${m[2]}`)) bad.push(`no pan or carton is ${m[1]} × ${m[2]}`);
    // mc answers: exactly the right choice fits
    const each = (fits, what) => labels.forEach((l, i) => { if (fits(l) !== (p.choices[i].id === p.answer)) bad.push(`${plain(l).slice(0, 40)} ${fits(l) ? 'is' : 'is not'} ${what}`); });
    if (/Which scale is best/.test(prompt)) {
      const v = [...prompt.split(':')[1].matchAll(/(\d+)/g)].map(x => +x[1]), best = [10, 5, 2].find(s => v.every(x => x % s === 0));
      each(l => +l.match(/\d+/)[0] === best, `the best scale for ${v}`);
    }
    if ((m = prompt.match(/^There are (\d+) \w+ with (\d+) .* Which expression matches\?/))) each(l => l === `${m[1]} × ${m[2]}`, `${m[1]} groups of ${m[2]}`);
    if ((m = prompt.match(/^There are (\d+) \w+ with (\d+) .* Which diagram matches\?/))) each(l => l.includes(`aria-label="Tape diagram: ${m[1]} equal parts of ${m[2]}"`), `${m[1]} groups of ${m[2]}`);
    if (/Which expression matches this array\?/.test(prompt)) {
      const [, r, c] = plain(right).match(/(\d+) × (\d+)/) || [];
      if (!p.fig(false).includes(`An array: ${r} rows with ${c} in each row`)) bad.push(`${plain(right)} doesn't match the array`);
      each(l => /^\d+ × \d+$/.test(l), 'the array’s expression');
    }
    if ((m = prompt.match(/Which array shows (\d+) × (\d+)/))) each(l => l.includes(`An array: ${m[1]} rows with ${m[2]} in each row`), `${m[1]} rows of ${m[2]}`);
    if ((m = prompt.match(/This array has (\d+) rows of (\d+)\. Which array is the same one turned/))) each(l => l.includes(`An array: ${m[2]} rows with ${m[1]} in each row`), 'the array turned');
    if ((m = prompt.match(/knows (\d+) × (\d+) = (\d+)\. Which equation is also true\?/))) each(l => { const [, a, b, c] = l.match(/(\d+) × (\d+) = (\d+)/); return a * b === +c && a === m[2] && b === m[1]; }, 'the turnaround');
    if (/Which equation matches\?/.test(prompt)) each(l => {
      // the right equation for the story: groups × in each = total, with the unknown where the story's question is
      const g = /How many (?:\w+ )*go (?:in|on) each/.test(prompt) ? 'n' : /How many \w+ does \w+ fill/.test(prompt) ? 'g' : 'p';
      return g === 'p' ? /^\d+ × \d+ = \?$/.test(l) : g === 'n' ? /^\d+ × \? = \d+$/.test(l) : /^\? × \d+ = \d+$/.test(l);
    }, 'the equation for the story');
    return bad;
  }
};
