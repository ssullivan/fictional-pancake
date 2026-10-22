/* Learn Putting It All Together (Grade 7 Unit 9), chapter 1: Planning recipes. Its widgets and steps; loaded by
   recipes.html. */
/* a fraction [n, d] as a number */
const val = ([n, d]) => n / d;
/* a soup recipe for 4: [ingredient, amount as [n, d], unit] */
const SOUP = [
  ["rice", [3, 4], "cup"],
  ["olive oil", [1, 3], "cup"],
  ["broth", [5, 2], "cups"],
];
/* Change the servings: every amount is multiplied by servings ÷ 4. */
function wRecipe(el) {
  const q = Q(el),
    values = { servings: 8 };
  el.innerHTML = `<div class="wrow">${stepper("servings", "Servings")}</div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { servings } = values,
      factor = frac(servings, 4);
    q("servings").textContent = servings;
    q("e").innerHTML = `${servings} ÷ 4 = ${fim(factor)}`;
    q("r").innerHTML =
      `The recipe serves 4, so multiply every amount by ${fim(factor)}: ` +
      SOUP.map(
        ([name, amount]) =>
          `${name} ${fim(amount)} × ${fim(factor)} = <b>${fim(fMul(amount, factor))}</b> cup${val(fMul(amount, factor)) > 1 ? "s" : ""}`,
      ).join("; ") +
      ".";
  };
  steppers(el, values, { servings: [1, 20] }, draw);
  draw();
}

const STEPS = [
  {
    title: "Scaling a recipe",
    widget: wRecipe,
    body: "<p>A recipe is a set of proportional relationships. To serve more or fewer people, multiply every amount by the same scale factor: the new servings divided by the old.</p><p>Change the servings.</p>",
    check: {
      kind: "num",
      q: "A recipe for 6 uses 2/3 cup of sugar. How much sugar for 9 servings?",
      answer: 1,
      frac: true,
      unit: "cup",
      misc: [
        [3.67, "That adds 3. Scale it: multiply by 9 ÷ 6 = 3/2."],
        [0.44, "That divides. More servings need more sugar: multiply by 3/2."],
        [6, "That’s 2/3 cup for each serving, but it’s for 6 servings."],
      ],
      explain: "9 ÷ 6 = 3/2, and 2/3 × 3/2 = 1 cup.",
    },
  },
];
