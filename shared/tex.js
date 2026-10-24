/* Math typeset with KaTeX (shared/vendor/katex), for Grade 8 and up. A page loads vendor/katex/katex.min.css, tex.css, and
   vendor/katex/katex.min.js before tex.js. engine.js and learn.js pass every string they show through typeset when this file is
   loaded, so a problem's text can hold math between \( and \) (in the line) or \[ and \] (on a line of its own).

   math(source)              TeX marked for typeset: "\(" + source + "\)", for building problem text
   tex(source, display)      one piece of TeX as html, in the line or (display) centered on a line of its own
   typeset(html)             html with every \( … \) and \[ … \] in it typeset

   In a JavaScript string, TeX's backslashes must be doubled ("\\frac{1}{2}") or the string written with String.raw: in a plain
   string, \f and \t are a form feed and a tab, so "\frac" loses its backslash (tools/fuzz.mjs catches that).
   TeX that KaTeX can't read is drawn in red (.katex-error) instead of throwing; tools/fuzz.mjs fails on it.
   Without KaTeX (the script didn't load) the TeX is shown as it was typed, so the problem can still be read.
   Pictures (svg) keep plain labels: KaTeX's html can't go inside an svg. */

/* the TeX marked so typeset finds it */
const math = (source) => "\\(" + source + "\\)";

/* one piece of TeX as html: KaTeX's drawing, with MathML beside it for screen readers */
function tex(source, display = false) {
  if (typeof katex === "undefined") return texFallback(source);
  return katex.renderToString(source, { displayMode: display, throwOnError: false, output: "htmlAndMathml" });
}

/* the TeX as typed, with < > & made safe for html: what a page shows when KaTeX didn't load */
const texFallback = (source) =>
  `<code class="tex-plain">${source.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>`;

/* Typesets every \( … \) (in the line) and \[ … \] (display) in a string of html. Html written inside the math for the page's
   sake (&lt;, &gt;, &amp;) goes back to < > & first, since KaTeX reads TeX, not html. */
const typeset = (html) =>
  String(html).replace(/\\\(([^]*?)\\\)|\\\[([^]*?)\\\]/g, (all, inLine, display) => {
    const source = (inLine ?? display).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    return tex(source, display !== undefined);
  });
