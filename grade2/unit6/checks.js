/* Clockwork Carnival: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most
   nonzero digits, max = largest value, for the answer and every number in the prompt. */
const LIMITS = {dp: 0, nz: 2, max: 100};
// when each activity makes sense, in hours after midnight
const WHEN = {'eat breakfast': [6, 9], 'get to school': [7.5, 9], 'play at recess': [9, 11.5], 'watch the sun come up': [5, 7.5],
  'be sound asleep': [0, 5], 'go home from school': [14, 16], 'go to soccer practice': [15, 18], 'eat dinner': [17, 19.5], 'go to bed': [19, 21.5]};
// realistic prices: prizes in cents, bigger things in dollars
const CENTS = {sticker: [5, 30], pencil: [20, 50], eraser: [10, 35], 'bouncy ball': [25, 75], whistle: [25, 60], bookmark: [15, 40], 'yo-yo': [40, 90], 'toy car': [50, 100]};
const DOLLARS = {book: [3, 12], kite: [4, 15], puzzle: [3, 12], 'T-shirt': [5, 15], 'stuffed animal': [5, 15]};
const COIN = {quarter: 25, dime: 10, nickel: 5, penny: 1};
// the text without its markup
const plain = html => html.replace(/<[^>]*>/g, '');
module.exports = {
  limits: {shapes: LIMITS, parts: LIMITS, time: LIMITS, coins: LIMITS, shop: LIMITS, boss: LIMITS},
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const labels = (p.choices || []).map(c => plain(c.label)), text = plain([p.prompt, ...labels].join(' ')), bad = [];
    // times: hours 1 to 12, and minutes to 5 (a wrong choice may read the minute hand's number as minutes, like 3:07)
    const right = p.kind === 'mc' ? plain(p.choices.find(c => c.id === p.answer).label) : '';
    for (const [time, h, m] of text.matchAll(/\b(\d+):(\d\d)\b/g)) if (+h < 1 || +h > 12 || +m > 59) bad.push(`${time} is not a time`);
    for (const [time, , m] of plain(p.prompt + ' ' + right).matchAll(/\b(\d+):(\d\d)\b/g)) if (+m % 5) bad.push(`${time} is not a time to 5 minutes`);
    for (const [, cents] of text.matchAll(/(\d+)¢/g)) if (+cents > 100) bad.push(`${cents}¢ is more than a dollar`);
    for (const [, dollars] of text.matchAll(/\$(\d+)/g)) if (+dollars > 20) bad.push(`$${dollars} is too much money for this unit`);
    // no "3 halves": never more parts than the shape was cut into
    for (const [parts, k, word] of text.matchAll(/(\d+) (half|halves|third|thirds|fourth|fourths)\b/g)) if (+k > {h: 2, t: 3, f: 4}[word[0]]) bad.push(`${parts} is more than a whole`);
    // a.m. or p.m.: the answer fits the activity and no other choice does
    const act = p.prompt.match(/makes sense for \w+ to <b>([^<]+)<\/b>/);
    if (act) {
      const [lo, hi] = WHEN[act[1]] || [NaN, NaN];
      if (isNaN(lo)) bad.push(`no times for "${act[1]}"`);
      p.choices.forEach(choice => {
        // at: the choice's time in hours after midnight
        const [, h, m, ap] = choice.label.match(/(\d+):(\d\d) (a|p)\.m\./), at = +h % 12 + (ap === 'p' ? 12 : 0) + m / 60, fits = at >= lo && at <= hi;
        if (fits !== (choice.id === p.answer)) bad.push(`${choice.label} ${fits ? 'fits' : 'doesn’t fit'} "${act[1]}"`);
      });
    }
    // exactly one set of coins makes a dollar
    if (/make exactly/.test(p.prompt)) p.choices.forEach(choice => {
      const cents = [...choice.label.matchAll(/(\d+) (quarter|dime|nickel|penn)/g)].reduce((sum, [, n, coin]) => sum + n * COIN[coin === 'penn' ? 'penny' : coin], 0);
      if ((cents === 100) !== (choice.id === p.answer)) bad.push(`${choice.label} makes ${cents}¢`);
    });
    // prices are realistic
    for (const [, item, cents] of text.matchAll(/\ban? ([\w -]+?) (?:for|that costs) (\d+)¢/g)) {
      const range = CENTS[item];
      if (!range) bad.push(`no price range for ${item}`); else if (cents < range[0] || cents > range[1]) bad.push(`${item} for ${cents}¢`);
    }
    for (const [, item, dollars] of text.matchAll(/\b[Aa]n? ([\w -]+?) costs \$(\d+)/g)) {
      const range = DOLLARS[item];
      if (!range) bad.push(`no price range for ${item}`); else if (dollars < range[0] || dollars > range[1]) bad.push(`${item} for $${dollars}`);
    }
    return bad;
  },
};
