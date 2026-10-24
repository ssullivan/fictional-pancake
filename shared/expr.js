/* Expressions, equations, and inequalities that students type, for Grade 8 and up: read them, work them out, tell whether two are
   the same, check they're written the way a problem asks (expanded, factored, y = …), and write them out as TeX or text.
   No page needed (tools/fuzz.mjs and tools/check.mjs run it in Node). Needs util.js (gcd and the fraction math: frac, fAdd, …).
   mathbox.js is the answer box that uses it; engine.js and learn.js judge 'expr' answers with Expr.judge.

   Expr.parse(text, vars)            the tree for what a student typed (below), or throws an Error whose message says, in a
                                     student's words, what's wrong ("There’s a ( with no )."). vars: the problem's letters; a
                                     capital that isn't one of them reads as its small letter, and e is Euler's number unless
                                     it's one of them. Reads 2x, 3(x + 1), (x + 1)(x − 2), xy, x^2, x**2, x², 2·x, 2×x, 6÷3,
                                     −x (any minus or dash), √x, sqrt(x), π, pi, |x|, abs(x), sin x, cos, tan, ln, log (base 10),
                                     [ ] and { } as ( ), and one =, <, >, <=, >=, ≤, or ≥.
                                     Implicit products read left to right like ×, so 1/2x is ½·x (the preview shows it).
   Expr.value(tree, scope)           the tree worked out with scope's numbers for its letters ({x: 2}); NaN where it isn't defined
   Expr.letters(tree)                the letters the tree uses, as a Set
   Expr.same(a, b, vars)             are a and b equal for every value of their letters? (each may be text or a tree) Worked out
                                     at a fixed list of points, skipping any where either isn't defined. Two equations are the
                                     same when one's (left − right) is a nonzero number times the other's, so 2x − y = −3 is
                                     y = 2x + 3; two inequalities likewise, with a positive number (x > 2 is 2 < x).
   Expr.terms(tree)                  the tree as a polynomial: {monomial: [n, d]}, keyed like "x^2*y" ("" for the number term), or
                                     null when it isn't one (a letter in a denominator, a root, π, a function)
   Expr.poly(tree, v)                coefficients [c0, c1, …] (each [n, d]) of a polynomial in the one letter v, or null
   Expr.form.expanded, .factored, .simplified, .slopeIntercept, .standardForm, .solvedFor(v)
                                     the ways a problem can ask an answer to be written: each is (tree, vars) => null when the
                                     answer is written that way, or a message saying what to change. A unit can write its own.
   Expr.judge(typed, {answer, vars, form?, misc?})
                                     what engine.js and learn.js do with a typed answer: {verdict, message}, where verdict is
                                     'unread' (couldn't read it, or it has a letter the problem doesn't; message says why),
                                     'form' (equal to the answer but not written as form asks; message from form), 'right',
                                     or 'wrong' (message from the first misc [[text, message]] equal to what was typed, or null)
   Expr.tex(tree), Expr.text(tree)   the tree written out as TeX (for math() in tex.js) or as plain text, with − for minus. Text is
                                     read with Expr.parse and tidied first, so `${a}x^2+${b}x+${c}` prints cleanly for any signs.
   Expr.tidy(tree)                   the tree without its 0 terms, 1 factors, ^1 powers, and double minuses, with a product's minus
                                     signs moved to its front

   The tree. Every node has a type:
     num    {text, value, q}        a number as typed ("0.25"), its value, and its exact fraction q = [n, d]
     const  {name}                  'pi' or 'e'
     var    {name}                  a letter
     neg    {arg}                   −arg; a − b is the sum of a and neg b
     add    {terms}                 terms added, never itself an add
     mul    {factors}               factors multiplied (2x, 3·4, x(x + 1)), never itself a mul
     div    {num, den}              num ÷ den
     pow    {base, exp}             base to the power exp
     call   {name, arg}             sqrt, abs, sin, cos, tan, ln, or log of arg
     rel    {op, left, right}       left op right, op one of = < > <= >= */
const Expr = (() => {
  /* the functions a student can type: a name before its input, sqrt(x) or sin x */
  const FUNCS = ["sqrt", "sin", "cos", "tan", "abs", "ln", "log"];
  /* names to find in a run of letters, longest first, so "sinx" is sin x and "pix" is π·x */
  const NAMES = [...FUNCS, "pi"].sort((a, b) => b.length - a.length);
  const SUPERSCRIPTS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const RELATIONS = ["=", "<", ">", "<=", ">="];
  /* what each function does to a number: log is base 10, as on a calculator */
  const APPLY = {
    sqrt: Math.sqrt,
    abs: Math.abs,
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    ln: Math.log,
    log: Math.log10,
  };
  const fail = (message) => {
    throw new Error(message);
  };
  const num = (n) => ({ type: "num", text: String(n), value: n, q: frac(n) });

  /* ---------- reading ---------- */
  /* What a student typed, with every other way of writing a sign turned into one: any minus or dash is -, ** is ^, × and · are *,
     ÷ is /, ≤ and ≥ are <= and >=, π is pi, √ is sqrt, brackets and braces are parentheses, and superscripts (x², x⁻¹) are ^. */
  function normalize(text) {
    return String(text)
      .replace(/[−–—]/g, "-")
      .replace(/\*\*/g, "^")
      .replace(/[×·∙⋅]/g, "*")
      .replace(/÷/g, "/")
      .replace(/≤/g, "<=")
      .replace(/≥/g, ">=")
      .replace(/π/g, "pi")
      .replace(/√/g, "sqrt")
      .replace(/[[{]/g, "(")
      .replace(/[\]}]/g, ")")
      .replace(/⁻?[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (sup) => {
        const digits = [...sup.replace("⁻", "")].map((c) => SUPERSCRIPTS.indexOf(c)).join("");
        return "^" + (sup[0] === "⁻" ? "-" : "") + digits;
      });
  }
  /* The tokens in normalized text: numbers {type: 'num', text}, letters and π {type: 'name', name}, functions
     {type: 'fn', name}, and signs {type: 'op', op}. A run of letters is split into function names and single letters; a capital
     that isn't one of the problem's letters reads as its small letter. */
  function tokenize(s, vars) {
    const tokens = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) {
        i++;
        continue;
      }
      const number = s.slice(i).match(/^(\d+\.?\d*|\.\d+)/);
      if (number) {
        tokens.push({ type: "num", text: number[0] });
        i += number[0].length;
        continue;
      }
      if (/[A-Za-z]/.test(c)) {
        const run = s.slice(i).match(/^[A-Za-z]+/)[0];
        for (let j = 0; j < run.length;) {
          const name = NAMES.find((n) => run.startsWith(n, j));
          if (name) {
            tokens.push(name === "pi" ? { type: "name", name } : { type: "fn", name });
            j += name.length;
            continue;
          }
          const letter = run[j];
          const isSmall = !vars.includes(letter) && vars.includes(letter.toLowerCase());
          tokens.push({ type: "name", name: isSmall ? letter.toLowerCase() : letter });
          j++;
        }
        i += run.length;
        continue;
      }
      const two = s.slice(i, i + 2);
      if (two === "<=" || two === ">=") {
        tokens.push({ type: "op", op: two });
        i += 2;
        continue;
      }
      if ("+-*/^()|=<>".includes(c)) {
        tokens.push({ type: "op", op: c });
        i++;
        continue;
      }
      fail(`I can’t read the “${c}”.`);
    }
    return tokens;
  }
  /* how a token looks in a message */
  const shown = (token) =>
    token.type === "num"
      ? token.text
      : token.type === "op"
        ? token.op.replace("-", "−")
        : token.name === "sqrt"
          ? "√"
          : token.name === "pi"
            ? "π"
            : token.name;
  /* a product of a and b, flattened so a mul is never inside a mul */
  const product = (a, b) => ({
    type: "mul",
    factors: [...(a.type === "mul" ? a.factors : [a]), ...(b.type === "mul" ? b.factors : [b])],
  });

  /* Reads text into a tree, by the usual order of operations: a relation is two sums; a sum is terms added or subtracted; a term
     is factors multiplied or divided, with or without a sign; a factor may have a minus in front and a power after. */
  function parse(text, vars = []) {
    const tokens = tokenize(normalize(text), vars);
    if (!tokens.length) fail("Type an answer first.");
    let pos = 0,
      absDepth = 0;
    const peek = () => tokens[pos];
    const isOp = (token, op) => token && token.type === "op" && token.op === op;
    const isRelation = (token) => token && token.type === "op" && RELATIONS.includes(token.op);
    /* a factor can start here without a sign before it: 2x, x(x + 1), 2√x; a | starts one only outside another | … | */
    const startsFactor = (token) =>
      token && (token.type !== "op" || token.op === "(" || (token.op === "|" && absDepth === 0));
    const missing = () =>
      fail(pos > 0 ? `Something’s missing after ${shown(tokens[pos - 1])}.` : "Something’s missing at the start.");

    function relation() {
      const left = sum();
      if (!isRelation(peek())) return left;
      const op = tokens[pos++].op;
      const right = sum();
      if (isRelation(peek())) fail("Use just one =, <, or > in an answer.");
      return { type: "rel", op, left, right };
    }
    function sum() {
      const terms = [term()];
      while (isOp(peek(), "+") || isOp(peek(), "-")) {
        const sign = tokens[pos++].op,
          next = term();
        terms.push(sign === "-" ? { type: "neg", arg: next } : next);
      }
      if (terms.length === 1) return terms[0];
      return { type: "add", terms: terms.flatMap((t) => (t.type === "add" ? t.terms : [t])) };
    }
    /* factors multiplied or divided, left to right; a factor right after another (2x, 3(x + 1)) is multiplied. A number can't
       follow without a sign: x2 is more likely x^2, and 2 3 a typo. */
    function term() {
      /* a minus in front applies to the whole term: −5x is −(5x), and −2·3 is −(2·3) */
      if (isOp(peek(), "-")) {
        pos++;
        return { type: "neg", arg: term() };
      }
      if (isOp(peek(), "+")) {
        pos++;
        return term();
      }
      let node = power();
      for (;;) {
        const token = peek();
        if (isOp(token, "*") || isOp(token, "/")) {
          pos++;
          const right = signed();
          node = token.op === "*" ? product(node, right) : { type: "div", num: node, den: right };
        } else if (startsFactor(token)) {
          if (token.type === "num")
            fail(
              node.type === "num"
                ? `Put a sign between ${node.text} and ${token.text}.`
                : "Write the number first, like 2x, or use ^ for a power, like x^2.",
            );
          node = product(node, power());
        } else return node;
      }
    }
    function signed() {
      if (isOp(peek(), "-")) {
        pos++;
        return { type: "neg", arg: signed() };
      }
      if (isOp(peek(), "+")) {
        pos++;
        return signed();
      }
      return power();
    }
    /* a factor and its power; powers group from the right (2^3^2 is 2^9), and a power may be negative (x^-2) */
    function power() {
      const base = atom();
      if (!isOp(peek(), "^")) return base;
      pos++;
      return { type: "pow", base, exp: signed() };
    }
    function atom() {
      const token = peek();
      if (!token) missing();
      if (token.type === "num") {
        pos++;
        /* exact: 0.25 is 25/100 */
        const [whole, decimals = ""] = token.text.split(".");
        const q = frac(+(whole + decimals), 10 ** decimals.length);
        return { type: "num", text: token.text.replace(/\.$/, ""), value: +token.text, q };
      }
      if (token.type === "name") {
        pos++;
        if (token.name === "pi" || (token.name === "e" && !vars.includes("e")))
          return { type: "const", name: token.name };
        return { type: "var", name: token.name };
      }
      if (token.type === "fn") {
        pos++;
        /* sin^2 x is (sin x)^2 */
        let exponent = null;
        if (isOp(peek(), "^") && token.name !== "sqrt" && token.name !== "abs") {
          pos++;
          exponent = signed();
        }
        if (!peek()) fail(`Something’s missing after ${shown(token)}.`);
        /* √ and abs take the next factor (√2x is √2·x); the others its power too (sin x^2 is sin(x^2)) */
        const arg = token.name === "sqrt" || token.name === "abs" ? atom() : power();
        const call = { type: "call", name: token.name, arg };
        return exponent ? { type: "pow", base: call, exp: exponent } : call;
      }
      if (token.op === "(") {
        pos++;
        if (isOp(peek(), ")")) fail("Something’s missing inside ( ).");
        const inside = sum();
        if (!isOp(peek(), ")")) fail(peek() ? `I can’t read the ${shown(peek())} there.` : "There’s a ( with no ).");
        pos++;
        return inside;
      }
      if (token.op === "|" && absDepth === 0) {
        pos++;
        absDepth++;
        const inside = sum();
        if (!isOp(peek(), "|")) fail("There’s a | with no | to close it.");
        pos++;
        absDepth--;
        return { type: "call", name: "abs", arg: inside };
      }
      if (token.op === ")") fail("There’s a ) with no (.");
      missing();
    }

    const tree = relation();
    if (pos < tokens.length) {
      const extra = peek();
      if (isOp(extra, ")")) fail("There’s a ) with no (.");
      fail(`I can’t read the ${shown(extra)} there.`);
    }
    return tree;
  }
  /* text is read; a tree is used as it is */
  const treeOf = (node, vars) => (typeof node === "string" ? parse(node, vars) : node);

  /* ---------- working out ---------- */
  function value(node, scope = {}) {
    switch (node.type) {
      case "num":
        return node.value;
      case "const":
        return node.name === "pi" ? Math.PI : Math.E;
      case "var":
        return node.name in scope ? scope[node.name] : NaN;
      case "neg":
        return -value(node.arg, scope);
      case "add":
        return node.terms.reduce((total, t) => total + value(t, scope), 0);
      case "mul":
        return node.factors.reduce((total, f) => total * value(f, scope), 1);
      case "div":
        return value(node.num, scope) / value(node.den, scope);
      case "pow":
        return Math.pow(value(node.base, scope), value(node.exp, scope));
      case "call":
        return APPLY[node.name](value(node.arg, scope));
      default:
        return NaN;
    }
  }
  /* the nodes directly inside this one */
  const children = (node) =>
    node.type === "add"
      ? node.terms
      : node.type === "mul"
        ? node.factors
        : node.type === "div"
          ? [node.num, node.den]
          : node.type === "pow"
            ? [node.base, node.exp]
            : node.type === "rel"
              ? [node.left, node.right]
              : node.arg
                ? [node.arg]
                : [];
  /* is this node, or any node inside it, one that test picks out? */
  const anyNode = (node, test) => test(node) || children(node).some((c) => anyNode(c, test));
  function letters(node) {
    const found = new Set();
    anyNode(node, (child) => {
      if (child.type === "var") found.add(child.name);
      return false;
    });
    return found;
  }

  /* Where same() works expressions out: values with no pattern, so two different expressions don't agree at all of them by
     chance (x² and 2x agree at 2). Half are negative, so √x and ln x still have 7 points to work with. */
  const SAMPLES = [-4.31, -3.17, -2.43, -1.71, -1.13, -0.67, -0.29, 0.37, 0.71, 1.19, 1.83, 2.57, 3.41, 4.63];
  /* fewest points where both must be defined for same() to say yes */
  const MIN_POINTS = 6;
  /* the points: each letter takes the samples in its own order (the second letter starts 5 along, the third 10), so x and y
     never move together */
  const points = (names) =>
    SAMPLES.map((_, k) => Object.fromEntries(names.map((name, j) => [name, SAMPLES[(k + 5 * j) % SAMPLES.length]])));
  /* equal, allowing for rounding in the last digits */
  const close = (u, v) => Math.abs(u - v) <= 1e-9 * Math.max(1, Math.abs(u), Math.abs(v));

  function same(a, b, vars = []) {
    a = treeOf(a, vars);
    b = treeOf(b, vars);
    if ((a.type === "rel") !== (b.type === "rel")) return false;
    const names = [...new Set([...vars, ...letters(a), ...letters(b)])];
    if (a.type === "rel") return sameRelation(a, b, names);
    let usable = 0;
    for (const scope of points(names)) {
      const u = value(a, scope),
        v = value(b, scope);
      if (!isFinite(u) || !isFinite(v)) continue;
      if (!close(u, v)) return false;
      usable++;
    }
    return usable >= MIN_POINTS;
  }
  /* Two relations are the same when they hold for the same values. Each is turned around to (something) = 0, < 0, or <= 0;
     then one something must be a fixed number times the other at every point: any nonzero number for =, a positive one for
     < and <= (multiplying by a negative would flip the sign). */
  function sameRelation(a, b, names) {
    const FLIP = { ">": "<", ">=": "<=" };
    const asZero = (relation) =>
      FLIP[relation.op]
        ? { op: FLIP[relation.op], at: (scope) => value(relation.right, scope) - value(relation.left, scope) }
        : { op: relation.op, at: (scope) => value(relation.left, scope) - value(relation.right, scope) };
    const [first, second] = [asZero(a), asZero(b)];
    if (first.op !== second.op) return false;
    let ratio = null,
      usable = 0;
    for (const scope of points(names)) {
      const u = first.at(scope),
        v = second.at(scope);
      if (!isFinite(u) || !isFinite(v)) continue;
      const uZero = Math.abs(u) < 1e-9,
        vZero = Math.abs(v) < 1e-9;
      usable++;
      if (uZero && vZero) continue;
      if (uZero !== vZero) return false;
      if (ratio === null) ratio = u / v;
      else if (!close(u / v, ratio)) return false;
    }
    if (usable < MIN_POINTS) return false;
    /* both 0 everywhere: both true for every value */
    if (ratio === null) return true;
    return first.op === "=" || ratio > 0;
  }

  /* ---------- polynomials ---------- */
  /* A monomial's key: its letters in order with their powers, like "x^2*y^1"; "" for a number. */
  const keyOf = (powers) =>
    Object.keys(powers)
      .filter((name) => powers[name])
      .sort()
      .map((name) => `${name}^${powers[name]}`)
      .join("*");
  const powersOf = (key) =>
    Object.fromEntries(key ? key.split("*").map((part) => [part.split("^")[0], +part.split("^")[1]]) : []);
  /* the polynomial for one monomial: {key: coefficient} */
  const single = (key, q) => ({ [key]: q });
  /* polynomial arithmetic on {key: [n, d]}: sums drop terms that come to 0 */
  function addPolys(p, q) {
    const total = { ...p };
    for (const [key, c] of Object.entries(q)) total[key] = total[key] ? fAdd(total[key], c) : c;
    for (const key of Object.keys(total)) if (total[key][0] === 0) delete total[key];
    return total;
  }
  const scalePoly = (p, c) => addPolys({}, Object.fromEntries(Object.entries(p).map(([key, v]) => [key, fMul(v, c)])));
  function mulPolys(p, q) {
    let total = {};
    for (const [keyP, cp] of Object.entries(p))
      for (const [keyQ, cq] of Object.entries(q)) {
        const powers = powersOf(keyP);
        for (const [name, n] of Object.entries(powersOf(keyQ))) powers[name] = (powers[name] || 0) + n;
        total = addPolys(total, single(keyOf(powers), fMul(cp, cq)));
      }
    return total;
  }
  /* highest whole-number power terms() will multiply out */
  const MAX_POWER = 12;
  function terms(node) {
    switch (node.type) {
      case "num":
        return addPolys({}, single("", node.q));
      case "var":
        return single(`${node.name}^1`, [1, 1]);
      case "neg": {
        const polynomial = terms(node.arg);
        return polynomial && scalePoly(polynomial, [-1, 1]);
      }
      case "add":
      case "mul": {
        const parts = (node.type === "add" ? node.terms : node.factors).map(terms);
        if (parts.includes(null)) return null;
        return parts.reduce(node.type === "add" ? addPolys : mulPolys, node.type === "add" ? {} : single("", [1, 1]));
      }
      case "div": {
        /* dividing by a number only: x/2 is a polynomial, 2/x isn't */
        const top = terms(node.num),
          den = terms(node.den);
        if (!top || !den || Object.keys(den).some((key) => key !== "") || !den[""]) return null;
        return scalePoly(top, fInv(den[""]));
      }
      case "pow": {
        const base = terms(node.base),
          exp = terms(node.exp);
        /* the power, when it's a number: 0 when its polynomial is empty */
        const power = exp && Object.keys(exp).every((key) => key === "") ? (exp[""] ? fVal(exp[""]) : 0) : NaN;
        if (!base || !Number.isInteger(power) || power < 0 || power > MAX_POWER) return null;
        let total = single("", [1, 1]);
        for (let i = 0; i < power; i++) total = mulPolys(total, base);
        return total;
      }
      default:
        return null;
    }
  }
  function poly(node, v) {
    const polynomial = terms(treeOf(node, [v]));
    if (!polynomial) return null;
    const coefficients = [];
    for (const [key, coefficient] of Object.entries(polynomial)) {
      const powers = powersOf(key),
        names = Object.keys(powers);
      if (names.some((name) => name !== v)) return null;
      coefficients[powers[v] || 0] = coefficient;
    }
    /* powers with no term have coefficient 0 */
    return Array.from(coefficients, (coefficient) => coefficient || [0, 1]);
  }
  /* Is there a rational number r where the polynomial (coefficients c0, c1, …) is 0? Each candidate is ± a factor of the
     number term over a factor of the leading one (the rational root theorem), after clearing denominators. Polynomials whose
     numbers are too big to list the factors of say no. */
  function hasRationalRoot(coefficients) {
    const scale = coefficients.reduce((m, [, d]) => lcm(m, d), 1),
      whole = coefficients.map(([n, d]) => (n * scale) / d);
    if (whole[0] === 0) return true;
    const last = Math.abs(whole[whole.length - 1]),
      first = Math.abs(whole[0]);
    if (last > 10000 || first > 10000) return false;
    const factors = (n) =>
      range(n)
        .map((i) => i + 1)
        .filter((f) => n % f === 0);
    for (const p of factors(first))
      for (const q of factors(last))
        for (const r of [frac(p, q), frac(-p, q)]) {
          let total = [0, 1];
          for (let i = whole.length - 1; i >= 0; i--) total = fAdd(fMul(total, r), frac(whole[i]));
          if (total[0] === 0) return true;
        }
    return false;
  }

  /* ---------- forms ---------- */
  /* is the node one term written in its simplest form: a number, letters with whole-number powers, or one number times them,
     each letter once (3x^2y, x/2, −4)? */
  function isMonomial(node) {
    if (node.type === "neg") return isMonomial(node.arg);
    if (node.type === "div") return isMonomial(node.num) && node.num.type !== "div" && node.den.type === "num";
    if (node.type !== "mul") return isPart(node);
    const numbers = node.factors.filter((f) => f.type === "num"),
      names = node.factors.map((f) => (f.type === "pow" ? f.base.name : f.name)).filter(Boolean);
    return (
      node.factors.every(isPart) &&
      numbers.length <= 1 &&
      (numbers.length === 0 || node.factors[0].type === "num") &&
      new Set(names).size === names.length
    );
  }
  /* one factor of a monomial: a number, a letter, or a letter to a whole-number power */
  const isPart = (node) =>
    node.type === "num" ||
    node.type === "var" ||
    (node.type === "pow" && node.base.type === "var" && node.exp.type === "num" && Number.isInteger(node.exp.value));
  /* a monomial's key ("x^2*y^1"), or "0" when it comes to 0 */
  const monomialKey = (node) => Object.keys(terms(node))[0] ?? "0";
  const hasSum = (node) => anyNode(node, (child) => child.type === "add");
  /* the terms of a sum, or the expression as one term */
  const termsOf = (node) => (node.type === "add" ? node.terms : [node]);

  /* a sum of monomials with like terms combined: 2x^2 + 5x − 3 */
  function expanded(node) {
    if (node.type === "rel") return expanded(node.left) || expanded(node.right);
    const parts = termsOf(node);
    if (parts.some(hasSum)) return "Multiply out the parentheses, so there are none left.";
    if (!parts.every(isMonomial)) return "Write each term in its simplest form, like \\(3x^2\\).";
    return likeTerms(parts);
  }
  /* a message when two of the terms are like terms (the same letters to the same powers, or two numbers) */
  function likeTerms(parts) {
    const keys = parts.filter(isMonomial).map(monomialKey);
    const repeated = keys.find((key, i) => keys.indexOf(key) !== i);
    if (repeated === undefined) return null;
    return repeated === "" ? "Add the numbers together." : "Combine like terms: two have the same letters and powers.";
  }

  /* A product: factors multiplied, like 3(x + 2) or (x + 1)(x − 4), each as far as it goes: no factor left with a common factor
     or (with one letter) a rational root. */
  function factored(node, vars = []) {
    if (node.type === "rel") return "Write an expression, not an equation.";
    /* a minus in front doesn't change what the factors are */
    const unsigned = node.type === "neg" ? node.arg : node;
    const factors = unsigned.type === "mul" ? unsigned.factors : unsigned.type === "pow" ? [unsigned] : [];
    const notProduct =
      "Write it as a product: factors multiplied together, like \\(3(x + 2)\\) or \\((x + 1)(x - 4)\\).";
    if (!factors.some((f) => letters(f).size)) return notProduct;
    for (const f of factors) {
      const inside = f.type === "pow" ? f.base : f;
      if (inside.type !== "add") continue;
      const tidyMessage = expanded(inside);
      if (tidyMessage) return `Inside each factor: ${tidyMessage[0].toLowerCase()}${tidyMessage.slice(1)}`;
      const polynomial = terms(inside);
      if (!polynomial) continue;
      /* a number every coefficient shares (only for whole-number coefficients) */
      const coefficients = Object.values(polynomial);
      if (coefficients.every(([, d]) => d === 1)) {
        const shared = coefficients.reduce((g, [n]) => gcd(g, Math.abs(n)), 0);
        if (shared > 1) return `${inMath(inside)} still has a common factor, ${shared}.`;
      }
      /* a letter every term shares */
      const keys = Object.keys(polynomial).map(powersOf),
        sharedLetter = [...letters(inside)].find((name) => keys.every((powers) => powers[name] > 0));
      if (sharedLetter) return `${inMath(inside)} still has a common factor, ${sharedLetter}.`;
      /* with one letter, a rational root r means (letter − r) is still a factor */
      const names = [...letters(inside)];
      if (names.length === 1) {
        const oneLetter = poly(inside, names[0]);
        if (oneLetter && oneLetter.length > 2 && hasRationalRoot(oneLetter))
          return `${inMath(inside)} can still be factored.`;
      }
    }
    return unsigned.type === "mul" || unsigned.type === "pow" ? null : notProduct;
  }

  /* no like terms left in any sum, and no numbers left to multiply or raise to a power */
  function simplified(node) {
    let message = null;
    anyNode(node, (child) => {
      if (child.type === "add") message = likeTerms(child.terms);
      else if (child.type === "mul" && child.factors.filter((f) => f.type === "num").length > 1)
        message = "Multiply the numbers together.";
      else if (child.type === "pow" && child.base.type === "num" && child.exp.type === "num")
        message = `Work out ${inMath(child)}.`;
      return message !== null;
    });
    return message;
  }

  /* an equation with the letter v alone on one side: y = 3x − 2 */
  const solvedFor = (v) => (node) => {
    if (node.type !== "rel" || node.op !== "=") return `Write an equation that starts \\(${v} =\\).`;
    const isV = (side) => side.type === "var" && side.name === v;
    const other = isV(node.left) ? node.right : isV(node.right) ? node.left : null;
    if (!other) return `Get \\(${v}\\) by itself on one side: \\(${v} = \\dots\\)`;
    if (letters(other).has(v)) return `\\(${v}\\) is on both sides; get it on one side only.`;
    return null;
  };
  /* y = mx + b: y alone, and the other side a number times x plus a number */
  function slopeIntercept(node) {
    const message = solvedFor("y")(node);
    if (message) return message;
    const other = node.left.type === "var" && node.left.name === "y" ? node.right : node.left;
    const inX = poly(other, "x");
    if (!inX || inX.length > 2 || expanded(other))
      return "Write it as \\(y = mx + b\\): a number times \\(x\\), plus a number.";
    return null;
  }
  /* Ax + By = C: the x and y terms on one side, the number on the other */
  function standardForm(node) {
    const shape = "Write it as \\(Ax + By = C\\): the \\(x\\) and \\(y\\) terms on one side, a number on the other.";
    if (node.type !== "rel" || node.op !== "=") return shape;
    const isNumber = (side) => letters(side).size === 0;
    const lettered = isNumber(node.right) ? node.left : isNumber(node.left) ? node.right : null;
    if (!lettered || expanded(lettered)) return shape;
    const polynomial = terms(lettered);
    const allowed = ["x^1", "y^1"];
    if (!polynomial || !Object.keys(polynomial).every((key) => allowed.includes(key))) return shape;
    return null;
  }

  /* ---------- judging an answer ---------- */
  function judge(typed, { answer, vars = [], form, misc = [] }) {
    let tree;
    try {
      tree = parse(typed, vars);
    } catch (error) {
      return { verdict: "unread", message: error.message };
    }
    const stray = [...letters(tree)].find((name) => !vars.includes(name));
    if (stray) {
      const use = vars.length ? `; use ${vars.map((name) => `\\(${name}\\)`).join(" and ")}` : "";
      return { verdict: "unread", message: `There’s no \\(${stray}\\) in this problem${use}.` };
    }
    const right = parse(answer, vars);
    if (right.type === "rel" && tree.type !== "rel")
      return {
        verdict: "unread",
        message:
          right.op === "="
            ? "Write an equation, with an = sign."
            : "Write an inequality, with \\(<\\), \\(>\\), \\(\\le\\), or \\(\\ge\\).",
      };
    if (right.type !== "rel" && tree.type === "rel")
      return { verdict: "unread", message: "Write an expression, without an = or < sign." };
    if (same(tree, right, vars)) {
      const message = form ? form(tree, vars) : null;
      return message ? { verdict: "form", message } : { verdict: "right", message: null };
    }
    const mistake = misc.find(([wrong]) => same(tree, parse(wrong, vars), vars));
    return { verdict: "wrong", message: mistake ? mistake[1] : null };
  }

  /* ---------- writing out ---------- */
  /* Tidies a tree: drops 0 terms and 1 factors, x^1 is x and x^0 is 1, −(−x) is x, and a product's minus signs move to its
     front (2·(−3)x is −2·3x). */
  function tidy(node) {
    const isZero = (part) => part.type === "num" && part.value === 0,
      isOne = (part) => part.type === "num" && part.value === 1;
    switch (node.type) {
      case "neg": {
        const arg = tidy(node.arg);
        if (isZero(arg)) return arg;
        return arg.type === "neg" ? arg.arg : { type: "neg", arg };
      }
      case "add": {
        const parts = node.terms
          .map(tidy)
          .filter((t) => !isZero(t))
          .flatMap((t) => (t.type === "add" ? t.terms : [t]));
        return parts.length === 0 ? num(0) : parts.length === 1 ? parts[0] : { type: "add", terms: parts };
      }
      case "mul": {
        let factors = node.factors.map(tidy);
        if (factors.some(isZero)) return num(0);
        let negative = false;
        factors = factors
          .map((f) => {
            if (f.type !== "neg") return f;
            negative = !negative;
            return f.arg;
          })
          .flatMap((f) => (f.type === "mul" ? f.factors : [f]))
          .filter((f) => !isOne(f));
        const whole = factors.length === 0 ? num(1) : factors.length === 1 ? factors[0] : { type: "mul", factors };
        return negative ? { type: "neg", arg: whole } : whole;
      }
      case "div": {
        const top = tidy(node.num),
          den = tidy(node.den);
        if (isOne(den)) return top;
        if (top.type === "neg") return { type: "neg", arg: { type: "div", num: top.arg, den } };
        return { type: "div", num: top, den };
      }
      case "pow": {
        const base = tidy(node.base),
          exp = tidy(node.exp);
        if (isOne(exp)) return base;
        if (isZero(exp)) return num(1);
        return { type: "pow", base, exp };
      }
      case "call":
        return { type: "call", name: node.name, arg: tidy(node.arg) };
      case "rel":
        return { type: "rel", op: node.op, left: tidy(node.left), right: tidy(node.right) };
      default:
        return node;
    }
  }
  /* text is read and tidied; a tree is written as it is */
  const writable = (node) => (typeof node === "string" ? tidy(parse(node)) : node);
  /* does the node need parentheses as a factor of a product, or as a base? */
  const needsParens = (part) => ["add", "neg", "rel"].includes(part.type);
  const isAtom = (node) =>
    node.type === "var" ||
    node.type === "const" ||
    node.type === "num" ||
    (node.type === "call" && (node.name === "sqrt" || node.name === "abs"));
  /* does the factor's writing start with a digit, so a product needs a × sign before it (2·3, not 23)? */
  const startsWithDigit = (node) => node.type === "num" || (node.type === "pow" && startsWithDigit(node.base));
  const TEX_RELATIONS = { "=": "=", "<": "<", ">": ">", "<=": "\\le", ">=": "\\ge" };
  const TEXT_RELATIONS = { "=": "=", "<": "<", ">": ">", "<=": "≤", ">=": "≥" };

  /* Writes a tree out in one of two styles, sharing the order of operations: TeX (for KaTeX) or plain text. */
  function writer(style) {
    const isTex = style === "tex",
      minus = isTex ? "-" : "−";
    const paren = (s) => (isTex ? `\\left(${s}\\right)` : `(${s})`);
    function write(node) {
      switch (node.type) {
        case "num":
          return node.text;
        case "const":
          return node.name === "pi" ? (isTex ? "\\pi " : "π") : "e";
        case "var":
          return node.name;
        case "neg":
          return minus + (needsParens(node.arg) ? paren(write(node.arg)) : write(node.arg));
        case "add":
          return node.terms
            .map((t, i) => {
              if (i === 0) return write(t);
              if (t.type !== "neg") return " + " + write(t);
              return ` ${minus} ` + (needsParens(t.arg) ? paren(write(t.arg)) : write(t.arg));
            })
            .join("");
        case "mul":
          return node.factors
            .map((f, i) => {
              const written = needsParens(f) || (i > 0 && f.type === "div" && !isTex) ? paren(write(f)) : write(f);
              /* a × sign between two numbers, and before a fraction that follows a number (2 · ½, not 2½) */
              const prev = node.factors[i - 1];
              const needsSign =
                i > 0 && (startsWithDigit(f) || (f.type === "div" && (prev.type === "num" || prev.type === "div")));
              return (needsSign ? (isTex ? " \\cdot " : " · ") : "") + written;
            })
            .join("");
        case "div":
          if (isTex) return `\\frac{${write(node.num)}}{${write(node.den)}}`;
          return [node.num, node.den].map((part) => (isAtom(part) ? write(part) : paren(write(part)))).join("/");
        case "pow": {
          const base = isAtom(node.base) && node.base.type !== "call" ? write(node.base) : paren(write(node.base));
          return isTex
            ? `${base}^{${write(node.exp)}}`
            : `${base}^${isAtom(node.exp) ? write(node.exp) : paren(write(node.exp))}`;
        }
        case "call": {
          const arg = write(node.arg);
          if (node.name === "sqrt") return isTex ? `\\sqrt{${arg}}` : `√${isAtom(node.arg) ? arg : paren(arg)}`;
          if (node.name === "abs") return isTex ? `\\left|${arg}\\right|` : `|${arg}|`;
          const name = isTex ? `\\${node.name}` : node.name;
          return isAtom(node.arg) && node.arg.type !== "call" ? `${name} ${arg}` : name + paren(arg);
        }
        case "rel":
          return `${write(node.left)} ${(isTex ? TEX_RELATIONS : TEXT_RELATIONS)[node.op]} ${write(node.right)}`;
      }
    }
    return (node) => write(writable(node));
  }
  const tex = writer("tex"),
    text = writer("text");
  /* a tree as TeX marked for typeset (tex.js), for the forms' messages */
  const inMath = (node) => "\\(" + tex(node) + "\\)";

  return {
    parse,
    value,
    letters,
    same,
    terms,
    poly,
    form: { expanded, factored, simplified, slopeIntercept, standardForm, solvedFor },
    judge,
    tex,
    text,
    tidy,
  };
})();
