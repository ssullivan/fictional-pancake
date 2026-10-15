/* Field Day: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero digits,
   max = largest value, for the answer and every number in the prompt. Typed fractions (5/3 is 1.666667) make dp and nz loose at
   the fraction stations; check() holds every fraction to Grade 3's denominators and works every answer out again from the
   problem's facts and from its picture (the shading in a strip, the dot on a line, the bars in a graph). */
const FRACTIONS = { dp: 6, nz: 7, max: 24 };
const DENS = [2, 3, 4, 6, 8];
// the tiny houses from class: width and length of the floor, in feet
const HOUSES = [
  [8, 20],
  [7, 14],
  [8, 10],
];
// the text without its markup, with < and > written out
const plain = (html) =>
  String(html)
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
// the value of an expression with +, −, ×, and ÷, where × and ÷ go first, left to right: "3 × 4 − 5" is 7
function evaluate(expression) {
  const terms = expression.split(/ ([+−]) /),
    // a term's ×s and ÷s, left to right
    product = (term) => {
      const parts = term.split(/ ([×÷]) /);
      let value = +parts[0];
      for (let i = 1; i < parts.length; i += 2)
        value = parts[i] === "×" ? value * +parts[i + 1] : value / +parts[i + 1];
      return value;
    };
  let value = product(terms[0]);
  for (let i = 1; i < terms.length; i += 2) value += (terms[i] === "+" ? 1 : -1) * product(terms[i + 1]);
  return value;
}
// is "a/b s c/d" true? Cross-multiplying compares them without dividing
const holds = (n1, d1, s, n2, d2) => Math.sign(n1 * d2 - n2 * d1) === { "<": -1, "=": 0, ">": 1 }[s];
const near = (x, y) => Math.abs(x - y) < 1e-6;
const sum = (nums) => nums.reduce((total, n) => total + n, 0);
// can Grade 3 multiply a × b? Within 100, or a one-digit number times a multiple of 10
const gradeThree = (a, b) => a * b <= 100 || (Math.min(a, b) < 10 && Math.max(a, b) % 10 === 0);
// what each place carries when the numbers are added in columns, ones first
const carries = (nums) => {
  let carry = 0;
  return [1, 10, 100].map(
    (place) => (carry = Math.floor((sum(nums.map((n) => Math.floor(n / place) % 10)) + carry) / 10)),
  );
};
// the shaded part of a strip picture: the shaded width over the whole width, for each strip in it
const shadedParts = (svg) => {
  const wholes = [...svg.matchAll(/<rect class="fs" x="[\d.]+" y="[\d.]+" width="([\d.]+)"/g)].map((m) => +m[1]),
    shaded = [...svg.matchAll(/<rect class="fs on" x="[\d.]+" y="[\d.]+" width="([\d.]+)"/g)].map((m) => +m[1]);
  return shaded.map((w, i) => w / wholes[i]);
};
// where a dot is on a number line from 0 to `wholes` (480 wide, 26 in from each end), as a number
const dotsAt = (svg, wholes) =>
  [...svg.matchAll(/<circle class="pt[^"]*" cx="([\d.]+)"/g)].map((m) => ((+m[1] - 26) * wholes) / 428);
// the bars a bar graph draws, left to right, as the numbers they show (30 pixels a line)
const barsIn = (svg, scale) =>
  [...svg.matchAll(/<rect class="bar [a-z]+[^"]*" x="[\d.]+" y="[\d.]+" width="[\d.]+" height="([\d.]+)"/g)].map(
    (m) => (+m[1] / 30) * scale,
  );

module.exports = {
  limits: {
    estimate: FRACTIONS,
    relay: FRACTIONS,
    house: { dp: 0, nz: 3, max: 200 },
    shop: { dp: 0, nz: 3, max: 1000 },
    survey: { dp: 0, nz: 2, max: 200 },
    gameday: { dp: 0, nz: 2, max: 100 },
    boss: { dp: 6, nz: 7, max: 1000 },
  },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      prompt = plain(p.prompt),
      facts = p.facts || {},
      labels = (p.choices || []).map((c) => plain(c.label)),
      fig = p.fig ? p.fig(false) : "",
      shown = p.fig ? p.fig(true) : "";
    const right = p.kind === "mc" ? labels[p.choices.findIndex((c) => c.id === p.answer)] : null;
    // what the game tells a student: the prompt, hint, worked answer, the message for each mistake, and the right choice
    const told = [
      p.prompt,
      p.hint,
      p.explain,
      ...(p.misc || []).map((m) => m[1]),
      ...Object.entries(p.why || {})
        .filter(([id]) => id !== String(p.answer))
        .map(([, m]) => m),
      right,
    ]
      .map(plain)
      .join(" ");
    // every equation it states is true, every fraction uses Grade 3's denominators, and every comparison holds
    for (const [text, left, total] of told.matchAll(/(?<![\d+−×÷] )\b(\d+(?: [+−×÷] \d+)+) = (\d+)\b(?! [+−×÷])/g))
      if (evaluate(left) !== +total) bad.push(`${text} is wrong`);
    for (const [text, d] of [told, ...labels].join(" ").matchAll(/(?:\b\d+|\?)\/(\d+)\b/g))
      if (!DENS.includes(+d)) bad.push(`${text}: ${d} is not a Grade 3 denominator`);
    for (const [text, n, d, whole] of told.matchAll(/\b(\d+)\/(\d+) = (\d+)\b(?!\/)/g))
      if (n / d !== +whole) bad.push(`${text} is wrong`);
    for (const [text, n1, d1, s, n2, d2] of told.matchAll(/\b(\d+)\/(\d+) ([<=>]) (?=(\d+)\/(\d+)\b)/g))
      if (!holds(+n1, +d1, s, +n2, +d2)) bad.push(`says ${text}${n2}/${d2}`);
    if (/\b(he|she|his|her|him)\b/i.test(told)) bad.push("a student gets a gendered pronoun");
    // mc answers: exactly the right choice fits. onlyRight(fits, what): fits(label) holds for the right choice and no other
    const onlyRight = (fits, what) =>
      labels.forEach((label, i) => {
        if (fits(label) !== (p.choices[i].id === p.answer))
          bad.push(`${label} ${fits(label) ? "is" : "is not"} ${what}`);
      });
    // tap answers: exactly the right thing fits, and the picture has it to tap
    const onlyTap = (ids, fits, what) =>
      ids.forEach((id) => {
        if (fits(id) !== (String(id) === p.answer)) bad.push(`${id} ${fits(id) ? "is" : "is not"} ${what}`);
        if (!fig.includes(`data-id="${id}"`)) bad.push(`${id} can't be tapped`);
      });
    // a fraction choice's value ("5/4" is 1.25)
    const valueOf = (label) => {
      const [n, d] = label.split("/").map(Number);
      return n / d;
    };

    // ---------- estimating ----------
    if (facts.t === "stripGuess" || facts.t === "guessCall") {
      const { k, d } = facts,
        [part] = shadedParts(fig);
      if (!near(part, k / d)) bad.push(`the strip shows ${part}, not ${k}/${d}`);
      if (fig.includes('class="gcut"')) bad.push("the strip gives the parts away");
      if ((shown.match(/class="gcut"/g) || []).length !== d - 1)
        bad.push("the hint doesn't cut the strip into the parts");
      if (k >= d) bad.push("the shading is a whole strip or more");
      if (facts.t === "stripGuess") {
        onlyRight((label) => near(valueOf(label), k / d), `${k}/${d}`);
        labels.forEach((label) => {
          if (!near(valueOf(label), k / d) && Math.abs(valueOf(label) - k / d) < 0.2)
            bad.push(`${label} is too close to ${k}/${d} to tell apart`);
        });
      } else {
        const guess = facts.g / facts.h,
          call = near(guess, k / d)
            ? "About right"
            : guess <= k / d - 0.25
              ? "Too low"
              : guess >= k / d + 0.25
                ? "Too high"
                : null;
        if (!call) bad.push(`${facts.g}/${facts.h} is too close to ${k}/${d} to call`);
        onlyRight((label) => label === call, "the call");
        if (!prompt.includes(`${facts.g}/${facts.h}`)) bad.push("the prompt isn't the guess");
      }
    }
    if (facts.t === "lineGuess") {
      const { k, d } = facts,
        [dot] = dotsAt(fig, 2);
      if (!near(dot, k / d)) bad.push(`the dot is at ${dot}, not ${k}/${d}`);
      if (k % d === 0 || k / d >= 2) bad.push("the point is a whole number or off the line");
      if ((fig.match(/class="tick"/g) || []).length !== 3) bad.push("the line shows more than the whole numbers");
      onlyRight((label) => near(valueOf(label), k / d), `${k}/${d}`);
      labels.forEach((label) => {
        if (!near(valueOf(label), k / d) && Math.abs(valueOf(label) - k / d) < 0.4)
          bad.push(`${label} is too close to ${k}/${d} to tell apart`);
      });
    }
    if (facts.t === "tapStrip") {
      const { list, target } = facts,
        parts = shadedParts(fig);
      onlyTap([0, 1, 2], (i) => near(parts[i], target[0] / target[1]), `${target[0]}/${target[1]} shaded`);
      parts.forEach((part, i) => {
        if (!near(part, list[i][0] / list[i][1])) bad.push(`strip ${i + 1} isn't its fraction`);
        if (!near(part, target[0] / target[1]) && Math.abs(part - target[0] / target[1]) < 0.2)
          bad.push(`strip ${i + 1} is too close to the target to tell apart`);
      });
      if (!prompt.includes(`${target[0]}/${target[1]}`)) bad.push("the prompt isn't the target");
    }

    // ---------- fractions on the number line ----------
    if (facts.t === "tapFrac") {
      const { k, d, wholes } = facts;
      onlyTap(
        Array.from({ length: d * wholes + 1 }, (_, j) => j),
        (j) => j === k,
        `${k}/${d}`,
      );
      if (k <= d) bad.push("the fraction isn't more than 1");
      if (!prompt.includes(`${k}/${d}`)) bad.push("the prompt isn't the fraction");
    }
    if (facts.t === "readPoint") {
      const { k, d, wholes } = facts,
        [dot] = dotsAt(fig, wholes);
      if (!near(p.answer, k / d)) bad.push(`the answer is ${k}/${d}`);
      if (!near(dot, k / d)) bad.push(`the dot is at ${dot}`);
      if (k % d === 0 || k <= d) bad.push("the point is a whole number, or less than 1");
      if ((fig.match(/class="tick"/g) || []).length !== d * wholes + 1) bad.push("the ticks aren't every 1/d");
    }
    if (facts.t === "wholeFrac") {
      const { n, d, ask } = facts;
      if (n % d) bad.push(`${n}/${d} isn't a whole number`);
      if (p.answer !== (ask === "whole" ? n / d : n)) bad.push("the answer is wrong");
      if (ask === "whole" && !prompt.includes(`${n}/${d} = ?`)) bad.push("the prompt isn't the fraction");
      if (ask === "top" && !prompt.startsWith(`${n / d} = ?/${d}`)) bad.push("the prompt isn't the whole number");
    }
    if (facts.t === "compare") {
      const { a, b, kind } = facts;
      onlyRight((label) => {
        const [, n1, d1, s, n2, d2] = label.match(/(\d+)\/(\d+) ([<=>]) (\d+)\/(\d+)/);
        return holds(+n1, +d1, s, +n2, +d2);
      }, "true");
      if (labels.some((label) => !label.startsWith(`${a[0]}/${a[1]} `) || !label.endsWith(` ${b[0]}/${b[1]}`)))
        bad.push("a choice compares other fractions");
      // the kind of comparison is one Grade 3 can reason out
      const fits = {
        sameDen: a[1] === b[1] && a[0] !== b[0],
        sameNum: a[0] === b[0] && a[1] !== b[1],
        acrossOne: a[0] > a[1] !== b[0] > b[1] && a[0] !== a[1] && b[0] !== b[1],
        equal: a[0] % a[1] === 0 && a[0] / a[1] === b[0] / b[1],
      }[kind];
      if (!fits) bad.push(`${a.join("/")} and ${b.join("/")} aren't a ${kind} comparison`);
      const dots = dotsAt(fig, Math.max(2, Math.ceil(Math.max(a[0] / a[1], b[0] / b[1]))));
      if (!near(dots[0], a[0] / a[1]) || !near(dots[1], b[0] / b[1])) bad.push("the dots aren't the fractions");
    }

    // ---------- tiny houses ----------
    const isHouse = (wide, long) => HOUSES.some(([w, l]) => w === wide && l === long);
    // the rooms fill the house, each at least 4 feet long, with a floor Grade 3 can multiply
    const roomsFit = (wide, rooms) => {
      if (!HOUSES.some(([w, l]) => w === wide && l === sum(rooms))) bad.push("the rooms don't fill a tiny house");
      if (rooms.some((len) => len < 4)) bad.push("a room is too small");
      if (rooms.some((len) => !gradeThree(wide, len))) bad.push("a room's area is too hard to multiply");
      rooms.forEach((len, i) => {
        if (i !== facts.i && !fig.includes(`>${len}<`)) bad.push(`a room's length ${len} isn't written`);
      });
    };
    if (facts.t === "houseArea" || facts.t === "housePerimeter") {
      const { wide, long } = facts;
      if (!isHouse(wide, long)) bad.push(`${wide} by ${long} isn't a tiny house from class`);
      const want = facts.t === "houseArea" ? wide * long : 2 * (wide + long);
      if (p.answer !== want) bad.push(`the answer is ${want}`);
      if (!prompt.includes(`${wide} feet by ${long} feet`)) bad.push("the prompt isn't the house");
    }
    if (facts.t === "roomArea") {
      const { wide, rooms, i } = facts;
      roomsFit(wide, rooms);
      if (p.answer !== wide * rooms[i]) bad.push(`the room is ${wide * rooms[i]} square feet`);
      if (!fig.includes(`>${rooms[i]}<`)) bad.push("the room's length isn't written");
    }
    if (facts.t === "roomLength") {
      const { wide, rooms, i, from } = facts;
      roomsFit(wide, rooms);
      if (p.answer !== rooms[i]) bad.push(`the room is ${rooms[i]} feet long`);
      if ((fig.match(/>\?</g) || []).length !== 1) bad.push("one length should be marked ?");
      if (from === "area" && !prompt.includes(`area of ${wide * rooms[i]} square feet`))
        bad.push("the prompt isn't the area");
      if (from === "long" && !prompt.includes(`${sum(rooms)} feet long`))
        bad.push("the prompt isn't the house's length");
    }
    if (facts.t === "trim") {
      const { wide, rooms, i } = facts;
      roomsFit(wide, rooms);
      if (p.answer !== 2 * (wide + rooms[i])) bad.push(`the trim is ${2 * (wide + rooms[i])} feet`);
    }
    if (facts.t === "cabin") {
      const { wide, long, loft } = facts;
      if (!isHouse(wide, long)) bad.push("the downstairs isn't the cabin");
      if (loft > long || loft < 4) bad.push("the loft is bigger than the downstairs, or too small");
      if (p.answer !== wide * long + wide * loft) bad.push(`the floors are ${wide * long + wide * loft} square feet`);
      if (sum(carries([wide * long, wide * loft])) > 1) bad.push("adding the floors regroups more than once");
    }

    // ---------- costs ----------
    // every price in the prompt is a sensible price
    for (const [, price] of prompt.matchAll(/\$([\d,]+)/g))
      if (+price.replace(/,/g, "") < 2 || +price.replace(/,/g, "") > 1000) bad.push(`$${price} isn't a sensible price`);
    if (facts.t === "flooring") {
      const { wide, long, price } = facts,
        area = wide * long;
      if (p.answer !== area * price) bad.push(`the flooring costs ${area * price}`);
      if (price < 2 || price > 5) bad.push(`$${price} a square foot isn't a flooring price`);
      if (area % 10 || area > 90 || !gradeThree(wide, long)) bad.push(`${wide} × ${long} × ${price} is too hard`);
    }
    if (facts.t === "sum" || facts.t === "left") {
      const { prices } = facts,
        spent = sum(prices),
        regrouped = carries(prices);
      if (regrouped.some((carry) => carry > 1)) bad.push("a place regroups more than once");
      if (prices.length > 2 && regrouped.filter((carry) => carry).length > 1)
        bad.push("three prices regroup in two places");
      prices.forEach((price) => {
        if (!prompt.includes(`$${price}`)) bad.push(`the price $${price} isn't in the prompt`);
      });
      if (facts.t === "sum") {
        if (p.answer !== spent) bad.push(`it costs ${spent}`);
        if (spent > 1000) bad.push("it costs more than $1,000");
      } else {
        if (p.answer !== facts.budget - spent) bad.push(`$${facts.budget - spent} is left`);
        if (!(facts.budget - spent > 0)) bad.push("they spend the whole budget");
        if (!prompt.includes("$1,000")) bad.push("the prompt isn't the budget");
      }
    }
    if (facts.t === "times" || facts.t === "twoStep") {
      const { price, count } = facts,
        first = price * count;
      if (!gradeThree(count, price)) bad.push(`${count} × ${price} is too hard`);
      if (facts.t === "times" && p.answer !== first) bad.push(`it costs ${first}`);
      if (facts.t === "twoStep") {
        if (p.answer !== first + facts.other) bad.push(`it costs ${first + facts.other}`);
        if (carries([first, facts.other]).some((carry) => carry > 1))
          bad.push("adding regroups more than once in a place");
      }
    }

    // ---------- surveys ----------
    if (["moreFewer", "twoStepBar", "total", "tapMore"].includes(facts.t)) {
      const { rows, scale } = facts,
        counts = rows.map((row) => row.n);
      if (![2, 5, 10].includes(scale)) bad.push(`a scale of ${scale}`);
      if (counts.some((n) => n % scale || n <= 0 || n > 90)) bad.push("a count isn't on a line of the scale");
      if (new Set(counts).size !== counts.length) bad.push("two answers tie");
      if (barsIn(fig, scale).some((n, i) => !near(n, counts[i]))) bad.push("the bars aren't the counts");
      if (facts.t === "moreFewer") {
        const diff = rows[facts.a].n - rows[facts.b].n;
        if (p.answer !== diff || !(diff > 0)) bad.push(`the difference is ${diff}`);
      }
      if (facts.t === "twoStepBar") {
        const diff = rows[facts.a].n - rows[facts.b].n - rows[facts.c].n;
        if (p.answer !== diff || !(diff > 0)) bad.push(`the difference is ${diff}`);
        if (new Set([facts.a, facts.b, facts.c]).size !== 3) bad.push("a bar is used twice");
      }
      if (facts.t === "total" && p.answer !== sum(counts)) bad.push(`${sum(counts)} answered`);
      if (facts.t === "tapMore")
        onlyTap(
          [0, 1, 2, 3],
          (i) => counts[i] === counts[facts.base] + facts.diff,
          `${facts.diff} more than ${rows[facts.base].label}`,
        );
      rows.forEach((row) => {
        if (!fig.includes(`>${row.label}<`)) bad.push(`the bar for ${row.label} isn't labelled`);
      });
    }
    if (facts.t === "scale") {
      const { counts } = facts,
        // the best scale: the biggest of 2, 5, and 10 that every count is a multiple of
        best = [10, 5, 2].find((scale) => counts.every((n) => n % scale === 0));
      onlyRight((label) => label === `A line every ${best}`, "the best scale");
      counts.forEach((n) => {
        if (!prompt.includes(` ${n}`)) bad.push(`${n} isn't in the prompt`);
      });
    }

    // ---------- multiplying and dividing ----------
    if (facts.t === "match") {
      const { pic, a, b } = facts,
        want = pic === "tape" ? `${a * b} ÷ ${a} = ?` : `${a} × ${b} = ?`;
      onlyRight((label) => label === want, "the picture's equation");
      const counters = (fig.match(/class="ctr /g) || []).length;
      if (pic === "groups" && ((fig.match(/class="plate"/g) || []).length !== a || counters !== a * b))
        bad.push("the picture isn't the groups");
      if (pic === "array" && counters !== a * b) bad.push("the picture isn't the array");
      if (pic === "tape" && ((fig.match(/class="tape /g) || []).length !== a || !fig.includes(`>${a * b}<`)))
        bad.push("the picture isn't the tape");
      if (pic === "area" && (!fig.includes(`>${a}<`) || !fig.includes(`>${b}<`)))
        bad.push("the picture isn't the rectangle");
      if (a * b > 100) bad.push("the product is over 100");
    }
    if (facts.t === "fact") {
      if (p.answer !== facts.a * facts.b || p.answer > 100) bad.push(`${facts.a} × ${facts.b} is ${facts.a * facts.b}`);
      if (!prompt.startsWith(`${facts.a} × ${facts.b} = ?`)) bad.push("the prompt isn't the fact");
    }
    if (facts.t === "unknown") {
      const { product, divisor } = facts;
      if (p.answer * divisor !== product || product > 100) bad.push(`the missing factor is ${product / divisor}`);
      if (!prompt.includes(`${product} ÷ ${divisor} = ?`) && !prompt.includes(`${divisor} × ? = ${product}`))
        bad.push("the prompt isn't the division");
    }
    if (facts.t === "story") {
      const { ask, groups, each } = facts,
        want = { total: groups * each, each, groups }[ask];
      if (p.answer !== want) bad.push(`the answer is ${want}`);
      if (groups * each > 100) bad.push("the total is over 100");
      const given = { total: [groups, each], each: [groups * each, groups], groups: [groups * each, each] }[ask];
      given.forEach((n) => {
        if (!new RegExp(`\\b${n}\\b`).test(prompt)) bad.push(`${n} isn't in the story`);
      });
    }
    if (facts.t === "helper") {
      const { product, divisor } = facts;
      onlyRight((label) => label === `${divisor} × ${product / divisor} = ${product}`, "the helping fact");
    }
    return bad;
  },
};
