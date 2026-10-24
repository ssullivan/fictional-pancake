/* The answer box for typing an expression, equation, or inequality (engine.js's and learn.js's 'expr' answers): a text box, a row
   of keys for what's hard to find on a phone keyboard, and a line under it showing how the answer reads ("Reads as 2x² + 3x") or
   what's wrong with it. Needs expr.js (Expr.parse, Expr.tex) and tex.js (math, typeset). Styles are in mathbox.css.

   MathBox.html({id, vars, keys, placeholder})
                         the box (html) for a form: id is the text box's id, vars the problem's letters, keys the text each key
                         types (default: the letters, then ^ ( ) / √), and placeholder what the empty box shows
   MathBox.wire(el)      makes every box in el work: a key types at the cursor without moving focus (so a phone's keyboard
                         doesn't open or close), and the line under the box follows what's typed. The form around the box
                         submits it, as with any text box. */
const MathBox = (() => {
  /* the keys when a problem names none: its letters, a power, parentheses, a fraction bar, and a square root */
  const defaultKeys = (vars) => [...vars, "^", "(", ")", "/", "√"];
  /* what a key shows: the text it types, with an accessible name for the ones a screen reader would misread */
  const KEY_NAMES = {
    "^": "to the power",
    "√": "square root",
    "/": "divided by",
    π: "pi",
    "≤": "at most",
    "≥": "at least",
  };
  const escapeAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

  function html({ id, vars = [], keys = defaultKeys(vars), placeholder = "like 2x + 3" }) {
    const buttons = keys
      .map((key) => {
        const name = KEY_NAMES[key] ? ` aria-label="${KEY_NAMES[key]}"` : "";
        return `<button type="button" data-key="${escapeAttr(key)}"${name}>${escapeAttr(key)}</button>`;
      })
      .join("");
    return (
      `<div class="mbox" data-mbox data-vars="${vars.join(",")}">` +
      `<label for="${id}" class="sr">Your answer</label>` +
      `<input id="${id}" class="mbox-in" inputmode="text" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="${escapeAttr(placeholder)}">` +
      `<div class="mbox-keys" role="group" aria-label="Math keys">${buttons}</div>` +
      `<p class="mbox-read" aria-live="polite"></p>` +
      `</div>`
    );
  }

  /* the line under the box: how the answer reads, or what's wrong with it, or nothing while it's empty */
  function showReading(box, input, vars) {
    const line = box.querySelector(".mbox-read");
    const typed = input.value.trim();
    line.classList.remove("err");
    if (!typed) {
      line.innerHTML = "";
      return;
    }
    try {
      line.innerHTML = "Reads as " + typeset(math(Expr.tex(Expr.parse(typed, vars))));
    } catch (error) {
      line.classList.add("err");
      line.textContent = error.message;
    }
  }

  function wire(el) {
    el.querySelectorAll("[data-mbox]").forEach((box) => {
      const input = box.querySelector("input"),
        vars = box.dataset.vars ? box.dataset.vars.split(",") : [];
      input.addEventListener("input", () => showReading(box, input, vars));
      box.querySelectorAll("[data-key]").forEach((key) => {
        /* keep focus where it is: in the box on a computer, and off it on a phone, so its keyboard stays as it was */
        key.addEventListener("mousedown", (e) => e.preventDefault());
        key.addEventListener("click", () => {
          if (input.readOnly) return;
          /* type at the cursor when the box has focus, otherwise at the end */
          const focused = document.activeElement === input,
            start = focused ? input.selectionStart : input.value.length,
            end = focused ? input.selectionEnd : input.value.length;
          input.setRangeText(key.dataset.key, start, end, "end");
          showReading(box, input, vars);
        });
      });
    });
  }

  return { html, wire };
})();
