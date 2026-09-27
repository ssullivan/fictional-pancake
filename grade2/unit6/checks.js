/* Clockwork Carnival: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most
   nonzero digits, max = largest value, for the answer and every number in the prompt. */
const L = {dp: 0, nz: 2, max: 100};
// when each activity makes sense, in hours after midnight
const WHEN = {'eat breakfast': [6, 9], 'get to school': [7.5, 9], 'play at recess': [9, 11.5], 'watch the sun come up': [5, 7.5],
  'be sound asleep': [0, 5], 'go home from school': [14, 16], 'go to soccer practice': [15, 18], 'eat dinner': [17, 19.5], 'go to bed': [19, 21.5]};
// realistic prices: prizes in cents, bigger things in dollars
const CENTS = {sticker: [5, 30], pencil: [20, 50], eraser: [10, 35], 'bouncy ball': [25, 75], whistle: [25, 60], bookmark: [15, 40], 'yo-yo': [40, 90], 'toy car': [50, 100]};
const DOLLARS = {book: [3, 12], kite: [4, 15], puzzle: [3, 12], 'T-shirt': [5, 15], 'stuffed animal': [5, 15]};
const COIN = {quarter: 25, dime: 10, nickel: 5, penny: 1};
const plain = t => t.replace(/<[^>]*>/g, '');
module.exports = {
  limits: {shapes: L, parts: L, time: L, coins: L, shop: L, boss: L},
  check(p) {
    const labels = (p.choices || []).map(c => plain(c.label)), text = plain([p.prompt, ...labels].join(' ')), bad = [];
    // times: hours 1 to 12, and minutes to 5 (a wrong choice may read the minute hand's number as minutes, like 3:07)
    const right = p.kind === 'mc' ? plain(p.choices.find(c => c.id === p.answer).label) : '';
    for (const [t, h, m] of text.matchAll(/\b(\d+):(\d\d)\b/g)) if (+h < 1 || +h > 12 || +m > 59) bad.push(`${t} is not a time`);
    for (const [t, , m] of plain(p.prompt + ' ' + right).matchAll(/\b(\d+):(\d\d)\b/g)) if (+m % 5) bad.push(`${t} is not a time to 5 minutes`);
    for (const [, c] of text.matchAll(/(\d+)¢/g)) if (+c > 100) bad.push(`${c}¢ is more than a dollar`);
    for (const [, d] of text.matchAll(/\$(\d+)/g)) if (+d > 20) bad.push(`$${d} is too much money for this unit`);
    // no "3 halves": never more parts than the shape was cut into
    for (const [t, k, w] of text.matchAll(/(\d+) (half|halves|third|thirds|fourth|fourths)\b/g)) if (+k > {h: 2, t: 3, f: 4}[w[0]]) bad.push(`${t} is more than a whole`);
    // a.m. or p.m.: the answer fits the activity and no other choice does
    const act = p.prompt.match(/makes sense for \w+ to <b>([^<]+)<\/b>/);
    if (act) {
      const [lo, hi] = WHEN[act[1]] || [NaN, NaN];
      if (isNaN(lo)) bad.push(`no times for "${act[1]}"`);
      p.choices.forEach(c => {
        const [, h, m, ap] = c.label.match(/(\d+):(\d\d) (a|p)\.m\./), at = +h % 12 + (ap === 'p' ? 12 : 0) + m / 60, fits = at >= lo && at <= hi;
        if (fits !== (c.id === p.answer)) bad.push(`${c.label} ${fits ? 'fits' : 'doesn’t fit'} "${act[1]}"`);
      });
    }
    // exactly one set of coins makes a dollar
    if (/make exactly/.test(p.prompt)) p.choices.forEach(c => {
      const t = [...c.label.matchAll(/(\d+) (quarter|dime|nickel|penn)/g)].reduce((s, [, n, k]) => s + n * COIN[k === 'penn' ? 'penny' : k], 0);
      if ((t === 100) !== (c.id === p.answer)) bad.push(`${c.label} makes ${t}¢`);
    });
    // prices are realistic
    for (const [, item, c] of text.matchAll(/\ban? ([\w -]+?) (?:for|that costs) (\d+)¢/g)) {
      const r = CENTS[item];
      if (!r) bad.push(`no price range for ${item}`); else if (c < r[0] || c > r[1]) bad.push(`${item} for ${c}¢`);
    }
    for (const [, item, d] of text.matchAll(/\b[Aa]n? ([\w -]+?) costs \$(\d+)/g)) {
      const r = DOLLARS[item];
      if (!r) bad.push(`no price range for ${item}`); else if (d < r[0] || d > r[1]) bad.push(`${item} for $${d}`);
    }
    return bad;
  },
};
