/* Factor Factory: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most
   nonzero digits, max = largest value, for the answer and every number in the prompt. Everything stays within 100. */
const L = {dp: 0, nz: 2, max: 100};
const plain = t => String(t).replace(/<[^>]*>/g, '');
const factors = n => Array.from({length: n}, (_, i) => i + 1).filter(d => n % d === 0);
const isPrime = n => factors(n).length === 2;
const gcd = (a, b) => b ? gcd(b, a % b) : a, lcm = (a, b) => a * b / gcd(a, b);
// pack sizes that match the store, the most of each thing in a story, and the longest wait
const PACK = {'tennis balls': 3, batteries: 4, cupcakes: 4, 'granola bars': 5, 'juice boxes': 6, eggs: 6, 'yogurt cups': 6, crayons: 8, 'hot dogs': 8, stickers: 9};
const MOST = {chairs: 60, 'tomato plants': 48, photos: 40, tiles: 100, cookies: 72, students: 36, books: 60};
module.exports = {
  limits: {hops: L, tiles: L, prime: L, lockers: L, gears: L, boss: L},
  check(p) {
    const bad = [], prompt = plain(p.prompt), labels = (p.choices || []).map(c => plain(c.label));
    const right = p.kind === 'mc' ? labels[p.choices.findIndex(c => c.id === p.answer)] : null;
    // what the game tells a student: the prompt, hint, worked answer, and the message for each mistake
    const told = [p.prompt, p.hint, p.explain, ...(p.misc || []).map(m => m[1]), ...Object.entries(p.why || {}).filter(([id]) => id !== p.answer).map(([, m]) => m), right].map(plain).join(' ');
    // every product it states is right, and so is every "prime" or "composite"
    for (const [t, a, b, c] of [...told, ...labels].join(' ').matchAll(/(\d+) × (\d+) = (\d+)/g)) if (a * b !== +c) bad.push(`${t} is wrong`);
    for (const [t, n] of told.matchAll(/(?<!says )\b(\d+) is prime\b/g)) if (!isPrime(+n)) bad.push(`says ${t}`);
    for (const [t, n] of told.matchAll(/\b(\d+) is composite\b/g)) if (+n < 4 || isPrime(+n)) bad.push(`says ${t}`);
    for (const [t, n] of told.matchAll(/only factor pair (?:of|is) (\d+)|(\d+)’s only factor pair/g)) if (!isPrime(+(n || t.match(/\d+/)[0]))) bad.push(`says ${t}`);
    // mc answers: exactly the right choice fits
    const each = (fits, what) => labels.forEach((l, i) => { if (fits(l) !== (p.choices[i].id === p.answer)) bad.push(`${l} ${fits(l) ? 'is' : 'is not'} ${what}`); });
    if (/^Which number is prime\?/.test(prompt)) each(l => isPrime(+l), 'prime');
    if (/^Which number is composite\?/.test(prompt)) each(l => !isPrime(+l) && +l > 1, 'composite');
    let m;
    if ((m = prompt.match(/Which is a factor pair of (\d+)\?/))) each(l => { const [a, b] = l.split(' × ').map(Number); return a * b === +m[1]; }, `a factor pair of ${m[1]}`);
    if ((m = prompt.match(/all the factor pairs of (\d+)\?/))) {
      const n = +m[1], all = factors(n).filter(a => a * a <= n).map(a => `${a} × ${n / a}`).join(', ');
      each(l => l === all, `every factor pair of ${n}`);
    }
    if ((m = prompt.match(/common multiple of (\d+) and (\d+)\?/))) each(l => +l % m[1] === 0 && +l % m[2] === 0, 'a common multiple');
    if ((m = prompt.match(/not a factor of (\d+)\?/))) each(l => +m[1] % +l !== 0, `not a factor of ${m[1]}`);
    if ((m = prompt.match(/^(?:\w+ packs |\w+ puts |)(\d+) (cookies|students|books) .*could/))) {
      if (+m[1] > MOST[m[2]]) bad.push(`${m[1]} ${m[2]} is too many`);
      each(l => +m[1] % +l === 0, `a factor of ${m[1]}`);
    }
    if ((m = prompt.match(/come in \w+ of (\d+)\. Which number of ([\w ]+?) can/))) {
      if (PACK[m[2]] !== +m[1]) bad.push(`${m[2]} don’t come in ${m[1]}s`);
      each(l => +l % m[1] === 0, `a whole number of packs of ${m[1]}`);
    }
    if ((m = prompt.match(/Which students change locker (\d+)\?/))) each(l => l === `Students ${factors(+m[1]).join(', ')}`, `the factors of ${m[1]}`);
    if ((m = prompt.match(/is locker (\d+) open or closed\?/))) if ((right === 'Open') !== (factors(+m[1]).length % 2 === 1)) bad.push(`locker ${m[1]} is not ${right}`);
    // num answers
    if ((m = prompt.match(/How many students change locker (\d+)\?/)) && p.answer !== factors(+m[1]).length) bad.push(`${p.answer} students change locker ${m[1]}`);
    if ((m = prompt.match(/How many lockers does student (\d+) change\?/)) && p.answer !== Math.floor(20 / m[1])) bad.push(`student ${m[1]} changes ${p.answer} lockers`);
    if ((m = prompt.match(/How many factors does (\d+) have\?/)) && p.answer !== factors(+m[1]).length) bad.push(`${m[1]} has ${p.answer} factors`);
    if ((m = prompt.match(/How many prime numbers are there from (\d+) to (\d+)\?/)) && p.answer !== Array.from({length: m[2] - m[1] + 1}, (_, i) => +m[1] + i).filter(isPrime).length) bad.push(`wrong count of primes`);
    if ((m = prompt.match(/(\d+) and what number make a factor pair of (\d+)\?/)) && m[1] * p.answer !== +m[2]) bad.push(`${m[1]} × ${p.answer} is not ${m[2]}`);
    if ((m = prompt.match(/Which multiple of (\d+) is between (\d+) and (\d+)\?/))) {
      const [, a, lo, hi] = m.map(Number), all = Array.from({length: hi - lo + 1}, (_, i) => lo + i).filter(v => v % a === 0);
      if (all.length !== 1 || all[0] !== p.answer || p.answer === lo || p.answer === hi) bad.push(`multiples of ${a} from ${lo} to ${hi}: ${all}`);
    }
    // two things that happen every a and every b meet first at the least common multiple, within the hour
    if ((m = prompt.match(/every (\d+)(?:th)? (?:minutes|seconds|box)\b.*every (\d+)(?:th)? (?:minutes|seconds|box)\b/)) || (m = prompt.match(/packs of (\d+)\. Buns come in packs of (\d+)/))) {
      const L = lcm(+m[1], +m[2]);
      if (p.answer !== L) bad.push(`${m[1]} and ${m[2]} meet at ${L}, not ${p.answer}`);
      if (L > 60) bad.push(`waits ${L}, more than an hour`);
      if (+m[1] % +m[2] === 0 || +m[2] % +m[1] === 0) bad.push(`${m[1]} and ${m[2]}: one is a multiple of the other`);
    }
    if (p.kind === 'tap' && (m = prompt.match(/multiple of both (\d+) and (\d+)/)) && +p.answer !== lcm(+m[1], +m[2])) bad.push(`first common multiple is not ${p.answer}`);
    // equal rows: at least 2 rows of at least 2, and no more things than would fit the story
    if ((m = prompt.match(/(\d+) ([a-z ]+?) (?:in|on a wall in) (\d+) (?:equal )?rows/))) {
      const [, n, what, r] = m;
      if (n % r || r < 2 || n / r < 2) bad.push(`${n} ${what} in ${r} rows`);
      if (MOST[what] && +n > MOST[what]) bad.push(`${n} ${what} is too many`);
    }
    for (const [t, n] of prompt.matchAll(/locker (\d+)/g)) if (+n > 20) bad.push(`${t}: there are 20 lockers`);
    return bad;
  },
};
