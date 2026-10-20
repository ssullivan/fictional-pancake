/* Pictures that Grade 2 Unit 9's game and its Learn pages both use: paths on a map, drawn to scale. Needs util.js and
   figures.js (svgWrap); styles are in figs.css, with pictures.css (the .lbl text styles).

   MAP_CM                            pixels per centimeter on a map
   legsEnd(legs)                     where a path's legs end, in centimeters right of and below its start: [x, y]
   legSum(legs), legTotal(legs)      a path's leg lengths added up, written out ("6 + 5 + 4") and as a number
   pathFig(paths, {label})           paths from one place to another on a map, each leg labelled with its length (svg) */
const MAP_CM = 12;
/* how far one leg goes: right (r), left (l), up (u), or down (d) n centimeters, as [x, y] */
const legStep = ([dir, n]) => [dir === "r" ? n : dir === "l" ? -n : 0, dir === "d" ? n : dir === "u" ? -n : 0];
/* where legs [[dir, n], …] end, from [0, 0] */
const legsEnd = (legs) =>
  legs.reduce(
    ([x, y], leg) => {
      const [dx, dy] = legStep(leg);
      return [x + dx, y + dy];
    },
    [0, 0],
  );
/* "6 + 5 + 4": the lengths of a path's legs, added; and how long the path is in all */
const legSum = (legs) => legs.map(([, n]) => n).join(" + ");
const legTotal = (legs) => legs.reduce((total, [, n]) => total + n, 0);
/* Paths on a map, all starting at the same place: paths [{from, to, legs: [[dir, n], …], cls}] where each leg goes right (r),
   left (l), up (u), or down (d) n centimeters, and cls colors the path ('a' gold, 'b' blue). Each leg is labelled "n cm" beside
   its middle; the start and each end get a pin with the place's name. */
function pathFig(paths, { label = "A map" } = {}) {
  /* each path's corners in centimeters from the start, and the map's edges around all of them */
  const corners = paths.map((path) => {
      let at = [0, 0];
      return [
        at,
        ...path.legs.map((leg) => {
          const [dx, dy] = legStep(leg);
          at = [at[0] + dx, at[1] + dy];
          return at;
        }),
      ];
    }),
    all = corners.flat(),
    minX = Math.min(...all.map(([x]) => x)),
    maxX = Math.max(...all.map(([x]) => x)),
    minY = Math.min(...all.map(([, y]) => y)),
    maxY = Math.max(...all.map(([, y]) => y));
  /* room around the paths for the pins' names (side, about 9 pixels a letter) and the leg labels (top and bottom) */
  const longestName = Math.max(...paths.flatMap((path) => [path.from.length, path.to.length])),
    side = Math.max(70, 24 + 9 * longestName),
    top = 34,
    xOf = (x) => side + (x - minX) * MAP_CM,
    yOf = (y) => top + (y - minY) * MAP_CM;
  let markup = "";
  paths.forEach((path, i) => {
    const points = corners[i];
    markup += `<polyline class="route ${path.cls || "a"}" points="${points.map(([x, y]) => `${xOf(x)},${yOf(y)}`).join(" ")}"/>`;
    /* each leg's length: above a leg that goes across, beside one that goes up or down (on the outside of the map) */
    path.legs.forEach(([dir, n], j) => {
      const [x0, y0] = points[j],
        [x1, y1] = points[j + 1],
        midX = (xOf(x0) + xOf(x1)) / 2,
        midY = (yOf(y0) + yOf(y1)) / 2,
        across = dir === "r" || dir === "l",
        outside = across ? (y0 === minY ? -14 : 16) : x0 === minX ? -30 : 30;
      markup += `<text class="lbl s leg ${path.cls || "a"}" x="${across ? midX : midX + outside}" y="${across ? midY + outside : midY}">${n} cm</text>`;
    });
  });
  /* a pin at a place, with its name to the left of the start and to the right of an end */
  const pin = ([x, y], name, end) =>
    `<circle class="pin" cx="${xOf(x)}" cy="${yOf(y)}" r="7"/><text class="lbl s place ${end ? "st" : "en"}" x="${xOf(x) + (end ? 12 : -12)}" y="${yOf(y) - 12}">${name}</text>`;
  markup += pin([0, 0], paths[0].from, false);
  const ends = new Map();
  paths.forEach((path, i) =>
    ends.set(corners[i][corners[i].length - 1].join(), [corners[i][corners[i].length - 1], path.to]),
  );
  ends.forEach(([at, name]) => (markup += pin(at, name, true)));
  return svgWrap(2 * side + (maxX - minX) * MAP_CM, 2 * top + (maxY - minY) * MAP_CM, markup, label);
}
