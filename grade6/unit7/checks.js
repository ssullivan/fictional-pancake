/* Expedition Zero: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest size (absolute value), for the answer and every number in the prompt. Answers may be negative
   (signed: true): this is the unit where negative numbers come in. check() holds the contexts to realistic values, using the
   facts each problem carries. */
module.exports = {
  signed: true,
  limits: {
    line: { dp: 2, nz: 3, max: 400 },
    compare: { dp: 2, nz: 3, max: 250 },
    abs: { dp: 2, nz: 3, max: 150 },
    ineq: { dp: 1, nz: 2, max: 100 },
    plane: { dp: 0, nz: 2, max: 12 },
    dist: { dp: 0, nz: 3, max: 110 },
    factor: { dp: 0, nz: 2, max: 60 },
  },
  // what's wrong with problem p in the real world (an empty list when nothing is), from the facts it carries
  check(p, zone) {
    const bad = [],
      facts = p.facts || {};
    if (!facts.t) bad.push("no facts for checks.js");
    // temperatures people really see: −30 to 45 °C, −25 to 110 °F
    for (const [v, unit] of facts.temp || []) {
      const [lo, hi] = unit === "F" ? [-25, 110] : [-30, 45];
      if (!(v >= lo && v <= hi)) bad.push(`a temperature of ${v} °${unit}`);
    }
    // elevations from a deep submarine (−400 m) to a mountain lake (3,000 m), in whole meters
    for (const v of facts.elev || [])
      if (!(Number.isInteger(v) && v >= -400 && v <= 3000)) bad.push(`an elevation of ${v} m`);
    // bank balances and changes from −$200 to $200, in whole dollars or quarters, and never $0
    for (const v of facts.money || [])
      if (!(Math.abs(v) <= 200 && Math.round(v * 100) % 25 === 0 && v !== 0)) bad.push(`a balance of $${v}`);
    // heights for a ride are a child's height in inches
    for (const v of facts.height || []) if (!(v >= 36 && v <= 60)) bad.push(`a height rule of ${v} inches`);
    // counts of people and things are positive whole numbers
    for (const v of facts.count || []) if (!(Number.isInteger(v) && v > 0)) bad.push(`a count of ${v}`);
    // a number line problem's number is on its line
    if (facts.line && !(facts.v > facts.line[0] && facts.v < facts.line[1]))
      bad.push(`${facts.v} isn't inside the line from ${facts.line[0]} to ${facts.line[1]}`);
    // points are inside the grid that's drawn, and whole numbers
    if (facts.grid)
      for (const [x, y] of facts.pts || [])
        if (!(Number.isInteger(x) && Number.isInteger(y) && Math.abs(x) <= facts.grid && Math.abs(y) <= facts.grid))
          bad.push(`point (${x}, ${y}) is off a grid of ${facts.grid}`);
    // a greatest common factor is more than 1 and really the greatest, for numbers up to 60
    const gcd = (a, b) => (b ? gcd(b, a % b) : a);
    if (facts.gcf) {
      const [a, b, g] = facts.gcf;
      if (g < 2 || gcd(a, b) !== g) bad.push(`${g} is not the greatest common factor of ${a} and ${b}`);
      if (a > 60 || b > 60) bad.push(`${a} and ${b} are too big to factor in your head`);
    }
    // a least common multiple really is the least, and is at most 60
    if (facts.lcm) {
      const [a, b, l] = facts.lcm;
      if (l !== (a * b) / gcd(a, b)) bad.push(`${l} is not the least common multiple of ${a} and ${b}`);
      if (l > 60) bad.push(`a least common multiple of ${l} is too big`);
    }
    return bad;
  },
};
