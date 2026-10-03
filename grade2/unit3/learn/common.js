/* Learn Measuring Length (Grade 2 Unit 3): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
/* what each kind of object is called */
const NAME = {
  pencil: "pencil",
  crayon: "crayon",
  marker: "marker",
  glue: "glue stick",
  eraser: "eraser",
  book: "book",
  poster: "poster",
  rope: "jump rope",
  rug: "rug",
  box: "shoe box",
  bench: "bench",
};
/* An object lying flat from x, y, width wide and height tall: a pencil, crayon, marker, or glue stick, or a plain bar for anything
   else (book, rug, …) and for anything narrower than 40. */
function thing(kind, x, y, width, height = 26) {
  /* mid: the middle of its height; end: its right end; wrap: puts the parts in the object's group */
  const mid = y + height / 2,
    end = x + width,
    wrap = (parts) => `<g class="ob k-${kind}">${parts}</g>`;
  switch (width < 40 ? "" : kind) {
    /* an eraser, the body, then the sharpened wood and lead at the right end */
    case "pencil":
      return wrap(
        `<rect class="er" x="${x}" y="${y}" width="10" height="${height}" rx="3"/><rect class="body" x="${x + 10}" y="${y}" width="${width - 28}" height="${height}"/><polygon class="wood" points="${end - 18},${y} ${end},${mid} ${end - 18},${y + height}"/><polygon class="lead" points="${end - 6},${mid - 3.5} ${end},${mid} ${end - 6},${mid + 3.5}"/>`,
      );
    case "crayon":
      return wrap(
        `<rect class="body" x="${x}" y="${y}" width="${width - 14}" height="${height}" rx="3"/><polygon class="body" points="${end - 14},${y + 4} ${end},${mid - 4} ${end},${mid + 4} ${end - 14},${y + height - 4}"/><path class="band" d="M${x + 8},${y}v${height}M${end - 24},${y}v${height}"/>`,
      );
    /* the cap is 3 tenths of the marker */
    case "marker": {
      const capW = Math.round(width * 0.3);
      return wrap(
        `<rect class="body" x="${x}" y="${y}" width="${width - capW + 4}" height="${height}" rx="5"/><rect class="cap" x="${end - capW}" y="${y - 2}" width="${capW}" height="${height + 4}" rx="5"/>`,
      );
    }
    case "glue":
      return wrap(
        `<rect class="body" x="${x}" y="${y}" width="${width - 16}" height="${height}" rx="4"/><rect class="cap" x="${end - 16}" y="${y - 2}" width="16" height="${height + 4}" rx="4"/>`,
      );
    default:
      return wrap(`<rect class="body" x="${x}" y="${y}" width="${width}" height="${height}" rx="4"/>`);
  }
}
/* A ruler n units long, numbered from start (every other number when units are narrow). obj: {kind, at, len} lies on it from `at`. torn: a torn tape (ragged left end).
   span: shade the part under the object. count: number each unit under the object 1, 2, 3, …  u: pixels per unit. */
const RU = { cm: 28, in: 44 },
  UNITS = { cm: "centimeters", in: "inches" };
function ruler(
  n,
  { unit = "cm", u = RU[unit], start = 0, torn = false, obj = null, span = false, count = false, label } = {},
) {
  /* the ruler starts at left (its 0 mark) and rulerY down, below room for the object; xOf(v) is where mark v is */
  const left = 22,
    rulerY = obj ? 52 : 8,
    rulerH = 46,
    width = left + n * u + 44,
    xOf = (v) => left + (v - start) * u;
  /* narrow units label every other mark */
  const narrow = u < 24;
  let markup = "";
  if (obj) {
    const a = xOf(obj.at),
      b = xOf(obj.at + obj.len);
    markup += thing(obj.kind, a, 12, b - a) + `<path class="guide" d="M${a},40V${rulerY}M${b},40V${rulerY}"/>`;
  }
  /* a torn tape's left end zigzags */
  markup += torn
    ? `<path class="rul" d="M${left - 12},${rulerY}H${left + n * u + 34}V${rulerY + rulerH}H${left - 12}${range(6)
        .map((i) => `L${left - (i % 2 ? 12 : 20)},${rulerY + rulerH - ((i + 1) * rulerH) / 6}`)
        .join("")}Z"/>`
    : `<rect class="rul" x="${left - 12}" y="${rulerY}" width="${n * u + 46}" height="${rulerH}" rx="4"/>`;
  if (obj && span)
    markup += `<rect class="span" x="${xOf(obj.at)}" y="${rulerY}" width="${obj.len * u}" height="${rulerH}"/>`;
  range(n + 1).forEach((i) => {
    const x = left + i * u;
    markup +=
      `<line class="tick" x1="${x}" y1="${rulerY}" x2="${x}" y2="${rulerY + (narrow && i % 2 ? 8 : 14)}"/>` +
      (narrow && i % 2 ? "" : `<text class="lbl${u < 30 ? " s" : ""}" x="${x}" y="${rulerY + 28}">${start + i}</text>`);
    /* inches get a half-inch mark */
    if (unit === "in" && i < n)
      markup += `<line class="tick" x1="${x + u / 2}" y1="${rulerY}" x2="${x + u / 2}" y2="${rulerY + 8}"/>`;
  });
  markup += `<text class="lbl s" x="${left + n * u + 22}" y="${rulerY + 28}">${unit}</text>`;
  if (obj && count)
    range(obj.len).forEach((i) => {
      markup += `<text class="lbl s cy" x="${xOf(obj.at + i) + u / 2}" y="${rulerY + rulerH + 14}">${i + 1}</text>`;
    });
  return svgWrap(
    width,
    rulerY + rulerH + (count ? 28 : 4),
    markup,
    label ||
      (obj
        ? `A ${NAME[obj.kind]} on a ruler, from ${obj.at} to ${obj.at + obj.len} ${UNITS[unit]}`
        : `A ruler in ${UNITS[unit]}`),
  );
}
