/* Pictures that Grade 5 Unit 3's game and its Learn pages both use: dividing with fraction strips. Rectangles for multiplying
   fractions are areaFig in shared/fractions.js. Needs fractions.js (strips) and pictures.js (PART).

   divUnitFig(b, n, {cut})           1/b of a whole, and that piece cut into n equal parts: what part of the whole is one (svg)
   divWholeFig(n, b)                 n wholes, each cut into parts of 1/b: how many parts in all (svg) */

/* 1/b ÷ n: a whole in b parts with one shaded, and under it (once cut is on) the same whole in b × n parts with one shaded,
   so one of the n pieces of 1/b shows as a part of the whole */
const divUnitFig = (b, n, { cut = true } = {}) =>
  strips(
    [{ d: b, k: 1, lab: [1, b] }, ...(cut ? [{ d: b * n, k: 1, cls: "b", lab: [1, b * n], parts: b * n <= 12 }] : [])],
    { wholes: 1, W: 480, label: cut ? `1/${b} cut into ${n} equal parts: each is 1/${b * n}` : `1/${b} of a whole` },
  );
/* n ÷ 1/b: n wholes, each cut into b parts of 1/b, all shaded so they can be counted */
const divWholeFig = (n, b) =>
  strips([{ d: b, k: n * b, grp: b }], {
    wholes: n,
    label: `${n} wholes, each cut into ${b} ${PART[b][1]}: ${n * b} in all`,
  });
