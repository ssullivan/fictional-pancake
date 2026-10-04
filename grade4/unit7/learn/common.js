/* Learn Angles and Angle Measurement (Grade 4 Unit 7): code used by more than one chapter. Loaded by the chapter pages in learn/,
   after ../figs.js (angleKind, splitFig) and chapters.js. */
/* a slider in degrees, with its value shown after it (markup); wire it with onSlide */
const degSlider = (label, min, max, value) =>
  `<div class="wrow"><label class="slider">${label} <input type="range" min="${min}" max="${max}" step="5" value="${value}" data-s><b data-sv>${value}°</b></label></div>`;
/* run fn(degrees) when el's slider moves, and keep the value shown beside it */
const onSlide = (el, fn) => {
  const input = el.querySelector("[data-s]"),
    shown = el.querySelector("[data-sv]");
  input.addEventListener("input", () => {
    shown.textContent = `${input.value}°`;
    fn(+input.value);
  });
};
