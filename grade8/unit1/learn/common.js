/* Learn Rigid Transformations and Congruence (Grade 8 Unit 1): code more than one chapter uses. Loaded by coordinates.html and
   describing.html, after ../figs.js. */
/* the right triangle ABC the coordinate chapters move: A (1, 1), B (4, 1), C (1, 3) */
const ABC = [
  [1, 1],
  [4, 1],
  [1, 3],
];
/* A table of each corner before and after the moves: A (1, 1) → A′ (−1, 1). times: how many moves (A′ after one, A″ after
   two). */
const cornerTable = (before, after, times = 1) =>
  `<table class="corners"><tr><th>Corner</th><th></th><th>Image</th></tr>${before
    .map(
      (point, i) =>
        `<tr><td>${LETTERS[i]} ${ptText(point)}</td><td>→</td><td>${prime(LETTERS[i], times)} ${ptText(after[i])}</td></tr>`,
    )
    .join("")}</table>`;
