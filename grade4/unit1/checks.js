/* Factor Factory: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most
   nonzero digits, max = largest value, for the answer and every number in the prompt. Everything stays within 100. */
const LIMITS = {dp: 0, nz: 2, max: 100};
// the text without its markup
const plain = html => String(html).replace(/<[^>]*>/g, '');
// the factors of n, the same as shared/multiply.js's
const factors = n => Array.from({length: n}, (_, i) => i + 1).filter(d => n % d === 0);
const isPrime = n => factors(n).length === 2;
const gcd = (a, b) => b ? gcd(b, a % b) : a, lcm = (a, b) => a * b / gcd(a, b);
// pack sizes that match the store, the most of each thing in a story, and the longest wait
const PACK = {'tennis balls': 3, batteries: 4, cupcakes: 4, 'granola bars': 5, 'juice boxes': 6, eggs: 6, 'yogurt cups': 6, crayons: 8, 'hot dogs': 8, stickers: 9};
const MOST = {chairs: 60, 'tomato plants': 48, photos: 40, tiles: 100, cookies: 72, students: 36, books: 60};
module.exports = {
  limits: {hops: LIMITS, tiles: LIMITS, prime: LIMITS, lockers: LIMITS, gears: LIMITS, boss: LIMITS},
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [], prompt = plain(p.prompt), labels = (p.choices || []).map(c => plain(c.label));
    const right = p.kind === 'mc' ? labels[p.choices.findIndex(c => c.id === p.answer)] : null;
    // what the game tells a student: the prompt, hint, worked answer, and the message for each mistake
    const told = [p.prompt, p.hint, p.explain, ...(p.misc || []).map(mistake => mistake[1]), ...Object.entries(p.why || {}).filter(([id]) => id !== p.answer).map(([, message]) => message), right].map(plain).join(' ');
    // every product it states is right, and so is every "prime" or "composite"
    for (const [text, a, b, c] of [...told, ...labels].join(' ').matchAll(/(\d+) × (\d+) = (\d+)/g)) if (a * b !== +c) bad.push(`${text} is wrong`);
    for (const [text, n] of told.matchAll(/(?<!says )\b(\d+) is prime\b/g)) if (!isPrime(+n)) bad.push(`says ${text}`);
    for (const [text, n] of told.matchAll(/\b(\d+) is composite\b/g)) if (+n < 4 || isPrime(+n)) bad.push(`says ${text}`);
    for (const [text, n] of told.matchAll(/only factor pair (?:of|is) (\d+)|(\d+)’s only factor pair/g)) if (!isPrime(+(n || text.match(/\d+/)[0]))) bad.push(`says ${text}`);
    // mc answers: exactly the right choice fits. onlyRight(fits, what): fits(label) holds for the right choice and no other;
    // what says what fitting means
    const onlyRight = (fits, what) => labels.forEach((label, i) => { if (fits(label) !== (p.choices[i].id === p.answer)) bad.push(`${label} ${fits(label) ? 'is' : 'is not'} ${what}`); });
    if (/^Which number is prime\?/.test(prompt)) onlyRight(label => isPrime(+label), 'prime');
    if (/^Which number is composite\?/.test(prompt)) onlyRight(label => !isPrime(+label) && +label > 1, 'composite');
    let match;
    if ((match = prompt.match(/Which is a factor pair of (\d+)\?/))) onlyRight(label => { const [a, b] = label.split(' × ').map(Number); return a * b === +match[1]; }, `a factor pair of ${match[1]}`);
    if ((match = prompt.match(/all the factor pairs of (\d+)\?/))) {
      const n = +match[1], all = factors(n).filter(a => a * a <= n).map(a => `${a} × ${n / a}`).join(', ');
      onlyRight(label => label === all, `every factor pair of ${n}`);
    }
    if ((match = prompt.match(/common multiple of (\d+) and (\d+)\?/))) onlyRight(label => +label % match[1] === 0 && +label % match[2] === 0, 'a common multiple');
    if ((match = prompt.match(/not a factor of (\d+)\?/))) onlyRight(label => +match[1] % +label !== 0, `not a factor of ${match[1]}`);
    if ((match = prompt.match(/^(?:\w+ packs |\w+ puts |)(\d+) (cookies|students|books) .*could/))) {
      if (+match[1] > MOST[match[2]]) bad.push(`${match[1]} ${match[2]} is too many`);
      onlyRight(label => +match[1] % +label === 0, `a factor of ${match[1]}`);
    }
    if ((match = prompt.match(/come in \w+ of (\d+)\. Which number of ([\w ]+?) can/))) {
      if (PACK[match[2]] !== +match[1]) bad.push(`${match[2]} don’t come in ${match[1]}s`);
      onlyRight(label => +label % match[1] === 0, `a whole number of packs of ${match[1]}`);
    }
    if ((match = prompt.match(/Which students change locker (\d+)\?/))) onlyRight(label => label === `Students ${factors(+match[1]).join(', ')}`, `the factors of ${match[1]}`);
    if ((match = prompt.match(/is locker (\d+) open or closed\?/))) if ((right === 'Open') !== (factors(+match[1]).length % 2 === 1)) bad.push(`locker ${match[1]} is not ${right}`);
    // num answers
    if ((match = prompt.match(/How many students change locker (\d+)\?/)) && p.answer !== factors(+match[1]).length) bad.push(`${p.answer} students change locker ${match[1]}`);
    if ((match = prompt.match(/How many lockers does student (\d+) change\?/)) && p.answer !== Math.floor(20 / match[1])) bad.push(`student ${match[1]} changes ${p.answer} lockers`);
    if ((match = prompt.match(/How many factors does (\d+) have\?/)) && p.answer !== factors(+match[1]).length) bad.push(`${match[1]} has ${p.answer} factors`);
    if ((match = prompt.match(/How many prime numbers are there from (\d+) to (\d+)\?/)) && p.answer !== Array.from({length: match[2] - match[1] + 1}, (_, i) => +match[1] + i).filter(isPrime).length) bad.push(`wrong count of primes`);
    if ((match = prompt.match(/(\d+) and what number make a factor pair of (\d+)\?/)) && match[1] * p.answer !== +match[2]) bad.push(`${match[1]} × ${p.answer} is not ${match[2]}`);
    if ((match = prompt.match(/Which multiple of (\d+) is between (\d+) and (\d+)\?/))) {
      const [, a, lo, hi] = match.map(Number), all = Array.from({length: hi - lo + 1}, (_, i) => lo + i).filter(v => v % a === 0);
      if (all.length !== 1 || all[0] !== p.answer || p.answer === lo || p.answer === hi) bad.push(`multiples of ${a} from ${lo} to ${hi}: ${all}`);
    }
    // two things that happen every a and every b meet first at the least common multiple, within the hour
    if ((match = prompt.match(/every (\d+)(?:th)? (?:minutes|seconds|box)\b.*every (\d+)(?:th)? (?:minutes|seconds|box)\b/)) || (match = prompt.match(/packs of (\d+)\. Buns come in packs of (\d+)/))) {
      const first = lcm(+match[1], +match[2]);
      if (p.answer !== first) bad.push(`${match[1]} and ${match[2]} meet at ${first}, not ${p.answer}`);
      if (first > 60) bad.push(`waits ${first}, more than an hour`);
      if (+match[1] % +match[2] === 0 || +match[2] % +match[1] === 0) bad.push(`${match[1]} and ${match[2]}: one is a multiple of the other`);
    }
    if (p.kind === 'tap' && (match = prompt.match(/multiple of both (\d+) and (\d+)/)) && +p.answer !== lcm(+match[1], +match[2])) bad.push(`first common multiple is not ${p.answer}`);
    // equal rows: at least 2 rows of at least 2, and no more things than would fit the story
    if ((match = prompt.match(/(\d+) ([a-z ]+?) (?:in|on a wall in) (\d+) (?:equal )?rows/))) {
      const [, n, what, rows] = match;
      if (n % rows || rows < 2 || n / rows < 2) bad.push(`${n} ${what} in ${rows} rows`);
      if (MOST[what] && +n > MOST[what]) bad.push(`${n} ${what} is too many`);
    }
    for (const [text, n] of prompt.matchAll(/locker (\d+)/g)) if (+n > 20) bad.push(`${text}: there are 20 lockers`);
    return bad;
  },
};
