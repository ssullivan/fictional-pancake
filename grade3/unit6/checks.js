/* Science Fair: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. Lengths are in halves and fourths of an inch
   (two decimal places), weights up to 1,000 grams, and times are written like 9:52 (read here as 9 and 52). */
const LIMITS = { dp: 0, nz: 3, max: 1000 };
// the text without its markup
const plain = (html) => String(html).replace(/<[^>]*>/g, "");
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
// "3:05", and minutes after midnight as a time from 1:00 to 12:59
const hm = (h, m) => `${h}:${String(m).padStart(2, "0")}`;
const clockTime = (t) => hm(((Math.floor(t / 60) + 11) % 12) + 1, t % 60);
// a length in fourths of an inch as plain text, halves written as halves: 18 → "4 1/2"
function inchesText(fourths) {
  const whole = Math.floor(fourths / 4),
    rest = fourths % 4,
    [n, d] = rest === 2 ? [1, 2] : [rest, 4];
  return !rest ? `${whole}` : whole ? `${whole} ${n}/${d}` : `${n}/${d}`;
}
// k/d written with whole inches first, keeping d: (18, 4) → "4 2/4"
const lenText = (k, d) => (k % d ? `${Math.floor(k / d) ? Math.floor(k / d) + " " : ""}${k % d}/${d}` : `${k / d}`);
// how long each thing can be, in fourths of an inch (the same table as stations.js)
const THINGS = {
  crayon: [12, 16],
  pencil: [16, 30],
  eraser: [5, 10],
  "paper clip": [4, 8],
  marker: [18, 24],
  "glue stick": [12, 16],
  ribbon: [8, 30],
  leaf: [6, 20],
};
// about how much things weigh and hold
const WEIGHED = {
  "a paper clip": "1 gram",
  "a grape": "5 grams",
  "an apple": "200 grams",
  "a baseball": "150 grams",
  "a bag of flour": "2 kilograms",
  "a big watermelon": "8 kilograms",
  "a bike": "15 kilograms",
  "a big dog": "30 kilograms",
};
const HELD = {
  "a mug": "less than 1 liter",
  "a big water bottle": "about 1 liter",
  "a bucket": "about 10 liters",
  "a kitchen sink": "about 20 liters",
  "a fish tank": "about 40 liters",
  "a bathtub": "about 200 liters",
};
// things measured, and the unit that makes sense for each
const UNIT_SENSE = {
  "The fish tank holds 40": "liters",
  "The big dog weighs 30": "kilograms",
  "The apple weighs 200": "grams",
  "Recess lasts 20": "minutes",
  "The bathtub holds 200": "liters",
  "The pencil is 6": "inches",
};
// each two-step story's answer from its numbers
const TWO_STEPS = {
  pitchers: ([pitchers, each, poured]) => pitchers * each - poured,
  beans: ([each, box, bags]) => each * bags + box,
  practice: ([practice, days, warm]) => practice * days + warm,
  vet: ([dog, cat, bag]) => dog - cat - bag,
};

module.exports = {
  limits: {
    ruler: { dp: 2, nz: 3, max: 8 },
    plots: LIMITS,
    weight: LIMITS,
    volume: LIMITS,
    time: { dp: 0, nz: 3, max: 60 },
    stories: LIMITS,
    boss: { dp: 2, nz: 3, max: 1000 },
  },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      prompt = plain(p.prompt),
      facts = p.facts || {},
      raw = (p.choices || []).map((c) => c.label),
      labels = raw.map(plain),
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
    // every equation it states is true
    for (const [text, left, total] of told.matchAll(/(?<![\d+−×÷] )\b(\d+(?: [+−×÷] \d+)+) = (\d+)\b(?! [+−×÷])/g))
      if (evaluate(left) !== +total) bad.push(`${text} is wrong`);
    if (/\b(he|she|his|her|him)\b/i.test(told)) bad.push("a student gets a gendered pronoun");
    // mc answers: exactly the right choice fits. onlyRight(fits, what): fits(label) holds for the right choice and no other
    const onlyRight = (fits, what) =>
      labels.forEach((label, i) => {
        if (fits(label) !== (p.choices[i].id === p.answer))
          bad.push(`${label} ${fits(label) ? "is" : "is not"} ${what}`);
      });
    // the answer worked out again from the numbers the problem was made from, and those are the picture's
    if (facts.t === "measure") {
      const { len, byHalves } = facts,
        thing = (prompt.match(/How long is the (.+?)\?/) || [])[1],
        [lo, hi] = THINGS[thing] || [0, 0];
      if (p.answer !== len / 4) bad.push(`the ${thing} is ${len / 4} inches`);
      if (len < lo || len > hi) bad.push(`a ${thing} isn't ${len / 4} inches long`);
      if (len % 4 === 0 || (byHalves && len % 2))
        bad.push(`${len / 4} inches isn't a ${byHalves ? "half" : "fourth"} mark`);
      if (!fig.includes(`with a bar ${inchesText(len)} inches long on it from 0`))
        bad.push("the picture isn't the length");
    }
    if (facts.t === "tapLength") {
      const { target } = facts;
      if (p.answer !== String(target) || !fig.includes(`data-id="${target}"`)) bad.push(`tap ${target} fourths`);
      if (!prompt.includes(`Tap the mark for ${inchesText(target)} inches.`)) bad.push("the prompt isn't the length");
    }
    if (facts.t === "plot") {
      const { counts, d, loK, hiK, ask, k, k2 } = facts,
        lengths = Object.keys(counts).map(Number),
        total = lengths.reduce((sum, x) => sum + counts[x], 0),
        say = (x) => `${lenText(x, d)} inches`,
        most = Math.max(...Object.values(counts));
      // the plot shows these counts
      for (let x = loK; x <= hiK; x++)
        if (!fig.includes(`${counts[x] || 0} at ${x % d ? lenText(x, d) : x / d}`))
          bad.push(`the plot doesn't show ${counts[x] || 0} at ${say(x)}`);
      if (lengths.filter((x) => counts[x] === most).length !== 1) bad.push("more than one length is the most common");
      const answer = {
        at: counts[k],
        longer: lengths.filter((x) => x > k).reduce((sum, x) => sum + counts[x], 0),
        total,
        more: counts[k] - counts[k2],
      }[ask];
      if (ask === "most")
        onlyRight((label) => label === say(lengths.find((x) => counts[x] === most)), "the most common length");
      else if (p.answer !== answer) bad.push(`the answer should be ${answer}`);
      if (ask !== "most" && ask !== "total" && !prompt.includes(say(k))) bad.push("the prompt isn't the length");
    }
    if (facts.t === "dial") {
      const { max, step, value } = facts;
      if (p.answer !== value || value % (step / 2) || value <= 0 || value >= max) bad.push(`the needle is at ${value}`);
      if (!fig.includes(`its needle at ${value} `)) bad.push("the scale isn't the reading");
    }
    if (facts.t === "estimateWeight") {
      if (WEIGHED[facts.thing] !== facts.right) bad.push(`${facts.thing} doesn't weigh ${facts.right}`);
      onlyRight((label) => label === WEIGHED[facts.thing], `what ${facts.thing} weighs`);
    }
    if (facts.t === "unit") {
      const kg = WEIGHED[facts.thing].includes("kilo");
      onlyRight((label) => label === (kg ? "Kilograms" : "Grams"), `the unit for ${facts.thing}`);
    }
    if (facts.t === "estimateVolume") {
      if (HELD[facts.thing] !== facts.right) bad.push(`${facts.thing} doesn't hold ${facts.right}`);
      onlyRight((label) => label.toLowerCase() === HELD[facts.thing], `what ${facts.thing} holds`);
    }
    if (facts.t === "story") {
      const [a, b] = facts.nums,
        answer = evaluate(`${a} ${facts.op} ${b}`);
      if (p.answer !== answer || !Number.isInteger(answer) || answer <= 0)
        bad.push(`${a} ${facts.op} ${b} is ${answer}`);
      if (!prompt.includes(String(a)) || !prompt.includes(String(b))) bad.push("the story isn't these numbers");
    }
    if (facts.t === "beaker") {
      const { max, level } = facts;
      if (p.answer !== level || level <= 0 || level >= max) bad.push(`the water is at ${level}`);
      if (!fig.includes(`with ${level} liter`)) bad.push("the picture isn't the water");
    }
    if (facts.t === "clock") {
      const { h, m } = facts;
      onlyRight((label) => label === hm(h, m), "the time");
      if (!fig.includes(`A clock showing ${hm(h, m)}`)) bad.push("the clock isn't the time");
    }
    if (facts.t === "elapsed" || facts.t === "endTime" || facts.t === "startTime") {
      const start = facts.start ?? facts.end - facts.length,
        end = facts.end ?? facts.start + facts.length,
        length = end - start;
      if (Math.floor(start / 720) !== Math.floor((end - 1) / 720) || start % 720 < 60)
        bad.push("it crosses 12 o'clock");
      if (length < 10 || length > 59) bad.push(`${length} minutes is out of range`);
      if (facts.t === "elapsed" && p.answer !== length) bad.push(`it's ${length} minutes long`);
      if (facts.t === "endTime") onlyRight((label) => label === clockTime(end), "when it ends");
      if (facts.t === "startTime") onlyRight((label) => label === clockTime(start), "when it starts");
      if (!prompt.includes(clockTime(facts.t === "startTime" ? end : start))) bad.push("the prompt isn't the time");
      if (!shown.includes(`from ${clockTime(Math.floor(start / 15) * 15)} to ${clockTime(Math.ceil(end / 15) * 15)}`))
        bad.push("the number line isn't the times");
    }
    if (facts.t === "two") {
      const answer = TWO_STEPS[facts.id] ? TWO_STEPS[facts.id](facts.nums) : NaN;
      if (p.answer !== answer || !(answer > 0)) bad.push(`the answer should be ${answer}`);
      if (facts.nums.some((n) => !prompt.includes(String(n)))) bad.push("the story isn't these numbers");
    }
    if (facts.t === "missing") onlyRight((label) => label === facts.need, "what's missing");
    if (facts.t === "unitSense") {
      const unit = UNIT_SENSE[prompt.replace(/ ___\..*$/, "")];
      if (!unit) bad.push("no unit for this sentence");
      onlyRight((label) => label === unit, "the unit that makes sense");
    }
    return bad;
  },
};
