/* Dragon Duel: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most
   nonzero digits, max = largest value, for the answer and every number in the prompt. */
const L = {dp: 0, nz: 3, max: 1000};
module.exports = {
  limits: {hundred: L, build: L, expand: L, line: L, compare: L, boss: L},
  check(p) {
    const text = [p.prompt, ...(p.choices || []).map(c => c.label)].join(' ').replace(/<[^>]*>/g, ' '), bad = [];
    // another way to make a number breaks at most one hundred or one ten
    for (const [, h, t, o] of text.matchAll(/(\d+) hundreds?, (\d+) tens?, (\d+) ones?/g)) {
      if (+h > 9 || +t > 19 || +o > 19) bad.push(`${h} hundreds, ${t} tens, ${o} ones breaks more than one unit`);
    }
    // number lines stay within 0 to 1,000
    for (const [, v] of (p.fig ? String(p.fig(true, true)) : '').matchAll(/<text[^>]*>(\d+)<\/text>/g)) if (+v > 1000) bad.push(`${v} is past 1,000 on the number line`);
    return bad;
  },
};
