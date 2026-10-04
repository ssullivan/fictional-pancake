/* Angle Arcade: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. Angles are whole degrees, in fives on a
   protractor. check() works every answer out again from the facts each problem carries. */
const ANGLES = { dp: 0, nz: 3, max: 360 };
const plain = (html) =>
  String(html)
    .replace(/<svg[^]*?<\/svg>/g, "(picture)")
    .replace(/<[^>]*>/g, "");
module.exports = {
  limits: {
    figures: ANGLES,
    lines: ANGLES,
    turns: ANGLES,
    protractor: ANGLES,
    kinds: ANGLES,
    unknown: ANGLES,
    boss: ANGLES,
  },
  // what's wrong with problem p (an empty list when nothing is)
  check(p) {
    const bad = [],
      f = p.facts || {},
      prompt = plain(p.prompt),
      labels = (p.choices || []).map((c) => c.label),
      right = p.kind === "mc" ? labels[p.choices.findIndex((c) => c.id === p.answer)] : null,
      numbers = [...prompt.matchAll(/\d+/g)].map((m) => +m[0]);
    const want = (v, what) => {
      if (p.answer !== v) bad.push(`${what}: ${p.answer} should be ${v}`);
    };
    const shows = (...values) =>
      values.forEach((v) => {
        if (!numbers.includes(v)) bad.push(`the prompt doesn't show ${v}`);
      });
    /* what a picture of a figure is: a line has two arrowheads, a ray one, a segment none */
    const kindOf = (svg) => ["segment", "ray", "line"][(String(svg).match(/class="garrow"/g) || []).length];
    switch (f.t) {
      case "pickKind":
        if (kindOf(right) !== f.kind || prompt !== `Which one is a ${f.kind}?`)
          bad.push(`the ${f.kind} picture is a ${kindOf(right)}`);
        if (new Set(labels.map(kindOf)).size !== 3) bad.push("two pictures are the same kind");
        break;
      case "nameKind":
        if (!plain(right).startsWith({ segment: "Segment", ray: "Ray", line: "Line" }[kindOf(p.fig(false))]))
          bad.push(`${plain(right)} doesn't name the picture`);
        break;
      case "rayStart":
        if (right !== `Point ${f.start}` || !prompt.startsWith(`Ray ${f.start}`))
          bad.push(`ray doesn't start at ${right}`);
        break;
      case "pickLines": {
        /* a perpendicular pair has a right-angle box; a parallel pair's lines never cross (it has no angle mark) */
        const has = (svg, cls) => String(svg).includes(`class="${cls}"`),
          fits = (svg) => (f.want === "perpendicular" ? has(svg, "gbox") : !has(svg, "gbox") && !has(svg, "garc"));
        labels.forEach((svg, i) => {
          if (fits(svg) !== (p.choices[i].id === p.answer))
            bad.push(`choice ${i} is wrongly ${fits(svg) ? "" : "not "}${f.want}`);
        });
        break;
      }
      case "nameLines": {
        const svg = p.fig(false),
          kind = svg.includes('class="gbox"')
            ? "perpendicular"
            : svg.includes('class="garc"')
              ? "crossing"
              : "parallel";
        if (kind !== f.kind || !right.toLowerCase().startsWith(kind)) bad.push(`${right} for ${kind} lines`);
        break;
      }
      case "minutesToDegrees":
        shows(f.minutes);
        want(6 * f.minutes, "degrees");
        break;
      case "degreesToMinutes":
        shows(f.deg);
        want(f.deg / 6, "minutes");
        break;
      case "vsRight":
        if (
          right !==
          (f.deg < 90 ? "Less than a right angle" : f.deg === 90 ? "A right angle" : "More than a right angle")
        )
          bad.push(`${right} for ${f.deg}°`);
        break;
      case "read":
        want(f.deg, "protractor");
        if (f.deg % 5) bad.push("not a multiple of 5");
        break;
      case "kind":
        shows(f.deg);
        if (right !== (f.deg < 90 ? "Acute" : f.deg === 90 ? "Right" : f.deg < 180 ? "Obtuse" : "Straight"))
          bad.push(`${right} for ${f.deg}°`);
        break;
      case "unknown":
        shows(...f.known);
        want(f.total - f.known.reduce((x, y) => x + y, 0), "missing angle");
        if (!(p.answer > 0)) bad.push("no angle left");
        if (!prompt.includes({ 90: "a right angle", 180: "a straight angle", 360: "a full turn" }[f.total]))
          bad.push(`the prompt doesn't name ${f.total}°`);
        break;
      default:
        bad.push("no facts for checks.js");
    }
    // every sum, difference, and product it states is true
    const told = [p.hint, p.explain, ...(p.misc || []).map((m) => m[1])].map(plain).join(" ");
    for (const [text, a, op, b, c] of told.matchAll(/(?<![\d+−×÷] ?)\b(\d+) ([+−×÷]) (\d+) = (\d+)\b(?! [+−×÷])/g)) {
      const result = op === "+" ? +a + +b : op === "−" ? a - b : op === "×" ? a * b : a / b;
      if (result !== +c) bad.push(`says ${text}`);
    }
    return bad;
  },
};
