// Checks the math facts engine (facts/facts.js): every fact in every set, many times over.
//
//   node tools/facts.mjs                (tools/check.mjs runs it too)
//
// For each fact: 4 different whole-number choices, exactly one of them the answer, every wrong one with a reason; help and a
// hint that never show a broken value, whose every equation is true, and a hint that never gives the answer away. For each
// set: the facts are the ones it should have, and the picker never deals the same fact twice in a row, deals only facts
// from the set, and brings a missed fact back within 3 to 5 facts. Loads the scripts facts/practice.html loads, except
// practice.js, which needs a page.
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import vm from "node:vm";

const ROOT = resolve(import.meta.dirname, "..");
const html = readFileSync(join(ROOT, "facts/practice.html"), "utf8");
const ctx = vm.createContext({ console });
for (const [, src] of html.matchAll(/<script src="([^"?]+)(?:\?[^"]*)?"><\/script>/g))
  if (!src.endsWith("practice.js"))
    vm.runInContext(readFileSync(join(ROOT, "facts", src), "utf8"), ctx, { filename: src });
const names = [
    "FACT_OPS",
    "factsIn",
    "factKey",
    "factAnswer",
    "factText",
    "askable",
    "factValue",
    "factPrompt",
    "factChoices",
    "factHelp",
    "factHint",
    "makePicker",
  ],
  {
    FACT_OPS,
    factsIn,
    factKey,
    factAnswer,
    factText,
    askable,
    factValue,
    factPrompt,
    factChoices,
    factHelp,
    factHint,
    makePicker,
  } = vm.runInContext(`({${names.join(", ")}})`, ctx);

const failures = new Map();
const fail = (what, example) => {
  if (!failures.has(what)) failures.set(what, { count: 0, example });
  failures.get(what).count++;
};
const BROKEN = /NaN|undefined|Infinity|\[object |\bnull\b/;
// every word a fact shows: its help, hint, and the reason for each wrong choice
const words = (f) =>
  [
    factHelp(f).text,
    factHint(f),
    ...factChoices(f)
      .filter((c) => c.why)
      .map((c) => c.why),
  ].join(" ");
// the value of "7 × 5 + 7 × 3" or "56 ÷ 7" (× and ÷ first, left to right), for checking the equations help states
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

// every set: addition and subtraction within 10 and 20, each times table alone, and all of them together
const sets = [
  ["add", "10", 66],
  ["add", "20", 121],
  ["sub", "10", 66],
  ["sub", "20", 121],
  ...FACT_OPS.mult.tables.map((t) => ["mult", [t], 13]),
  ["mult", FACT_OPS.mult.tables, 91],
  ...FACT_OPS.div.tables.map((t) => ["div", [t], 13]),
  ["div", FACT_OPS.div.tables, 156],
];
for (const [op, choice, expected] of sets) {
  const facts = factsIn(op, choice),
    name = `${op} ${choice}`;
  if (facts.length !== expected) fail(`${name}: ${facts.length} facts, not ${expected}`, "");
  if (new Set(facts.map(factKey)).size !== facts.length) fail(`${name}: a fact twice`, "");
  for (const fact of facts) {
    const answer = factAnswer(fact),
      text = factText(fact);
    if (op === "add" && (fact.a > 10 || fact.b > 10 || (choice === "10" && answer > 10)))
      fail(`${name}: ${text} isn't in it`, text);
    if (op === "sub" && (answer < 0 || fact.b > 10 || answer > 10 || fact.a > +choice))
      fail(`${name}: ${text} isn't in it`, text);
    if (op === "mult" && !(choice.includes(fact.a) || choice.includes(fact.b)))
      fail(`${name}: ${text} isn't in it`, text);
    if (op === "div" && !(choice.includes(fact.b) && Number.isInteger(answer) && answer <= 12))
      fail(`${name}: ${text} isn't in it`, text);
    // both orders of a multiplication fact, each asked for its answer and with each number hidden (when that has one
    // answer), many deals each
    const orders = op === "mult" ? [fact, { ...fact, a: fact.b, b: fact.a }] : [fact],
      asked = orders.flatMap((f) => [null, "a", "b"].filter((ask) => askable(f, ask)).map((ask) => ({ ...f, ask })));
    for (const f of asked) {
      const value = factValue(f),
        prompt = factPrompt(f);
      if ((f.ask === "a" ? f.a : f.ask === "b" ? f.b : answer) !== value)
        fail(`${name}: ${prompt} asks for the wrong number`, prompt);
      if (prompt.split("?").length !== 2) fail(`${name}: ${prompt} doesn't hide one number`, prompt);
      for (let k = 0; k < 40; k++) {
        const choices = factChoices(f),
          values = choices.map((c) => c.value);
        if (choices.length !== 4) fail(`${name}: ${choices.length} choices`, prompt);
        if (new Set(values).size !== values.length) fail(`${name}: the same choice twice`, `${prompt}: ${values}`);
        if (values.filter((v) => v === value).length !== 1)
          fail(`${name}: the answer isn't one choice`, `${prompt}: ${values}`);
        if (values.some((v) => !Number.isInteger(v) || v < 0))
          fail(`${name}: a choice isn't a whole number`, `${prompt}: ${values}`);
        if (choices.some((c) => (c.value === value) !== (c.why === null)))
          fail(`${name}: a reason is missing or on the answer`, prompt);
      }
      const help = factHelp(f),
        hint = factHint(f);
      for (const [what, words] of [
        ["help", help.text],
        ["hint", hint],
        ["picture", help.fig],
        ...factChoices(f)
          .filter((c) => c.why)
          .map((c) => ["reason", c.why]),
      ])
        if (BROKEN.test(words)) fail(`${name}: ${what} shows a broken value`, `${prompt}: ${words}`);
      if (/÷ 0\b/.test(words(f))) fail(`${name}: something is divided by 0`, prompt);
      if (!help.text.includes(String(value))) fail(`${name}: help doesn't give the answer`, `${prompt}: ${help.text}`);
      // (rules like times 0 or a number divided by itself can't hide their answer, and neither can a hidden number that's
      // the same as the one shown, as in ? × 1 = 7)
      const rule =
        (!f.ask && (((op === "mult" || op === "div") && answer === 0) || (op === "div" && f.a === f.b))) ||
        (f.ask && value === answer);
      if (!rule && new RegExp(`(= |\\bis )${value}\\b(?!\\d)`).test(hint))
        fail(`${name}: the hint gives the answer away`, `${prompt}: ${hint}`);
      for (const [statement, left, right] of `${help.text} ${hint}`.matchAll(
        /(\d+(?: [+−×÷] \d+)+) = (\d+)\b(?! [+−×÷])/g,
      ))
        if (evaluate(left) !== +right) fail(`${name}: says ${statement}`, prompt);
    }
  }
  // the picker: 3,000 deals, missing every 7th fact
  const memory = {},
    picker = makePicker(facts, memory),
    keys = new Set(facts.map(factKey)),
    missedAt = new Map();
  let last = null;
  for (let i = 1; i <= 3000; i++) {
    const fact = picker.next(),
      key = factKey(fact);
    if (!keys.has(key)) fail(`${name}: the picker dealt ${factText(fact)}, not in the set`, factText(fact));
    if (facts.length > 1 && key === last) fail(`${name}: the same fact twice in a row`, factText(fact));
    if (missedAt.has(key)) {
      const gap = i - missedAt.get(key);
      if (gap < 3 && facts.length > 3) fail(`${name}: a missed fact came back after ${gap}`, factText(fact));
      missedAt.delete(key);
    }
    for (const [missedKey, at] of missedAt)
      if (i - at > 7 && facts.length > 2) {
        fail(`${name}: a missed fact didn't come back within 7`, missedKey);
        missedAt.delete(missedKey);
      }
    const ok = i % 7 !== 0;
    picker.record(fact, ok);
    if (!ok) missedAt.set(key, i);
    last = key;
  }
}

for (const [what, { count, example }] of failures)
  console.log(`FAIL facts ${what} [${count}×]${example ? `\n     ${example}` : ""}`);
console.log(`math facts: ${sets.length} sets, ${failures.size} kind(s) of failure`);
process.exit(failures.size ? 1 : 0);
