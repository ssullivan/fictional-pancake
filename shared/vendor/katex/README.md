# KaTeX

KaTeX 0.19.1 (https://katex.org, MIT license in `LICENSE`), copied here unchanged so math renders without a CDN.
`shared/tex.js` is the only file that calls it; pages load `katex.min.css`, `katex.min.js`, then `tex.js`.

Only the `.woff2` fonts are kept: `katex.min.css` lists woff2 first, and every browser the site supports reads it,
so the `.woff` and `.ttf` copies are never fetched.

To update: `npm pack katex@<version>`, unpack it, copy `dist/katex.min.js`, `dist/katex.min.css`,
`dist/fonts/*.woff2`, and `LICENSE` over these, change the version above, and run `node tools/check.mjs --fix`
(new cache stamps) and `npm test`.
