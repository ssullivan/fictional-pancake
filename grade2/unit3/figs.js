/* Pictures that Grade 2 Unit 3's game and its Learn pages both use: things to measure, rulers, units laid end to end, foot
   rulers, and a 10 cm strip for estimating. Styles are in figs.css. Needs util.js and figures.js (svgWrap), and pictures.css
   (the .lbl text styles) and blocks.css (cubes).

   NAME, thing(kind, x, y, width, height)   what each kind of object is called, and the object lying flat (markup)
   RU, UNITS, ruler(n, {unit, u, start, torn, obj, span, count, label})   a ruler in centimeters or inches, with an object on it (svg)
   UNITK, unitRow(kind, count, x, y, u)   cubes, paper clips, or erasers laid end to end (markup)
   unitsFig(kind, len, rows, u)      an object with rows of units under it (svg)
   footRow(x, y, count, each), feetFig(kind, ft, count, most, each)   foot rulers end to end (markup), and a thing above them (svg)
   estFig(kind, len)                 an object above a 10 cm strip, for estimating (svg) */
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
/* units laid end to end: cubes (1 cm), paper clips (3 cm), erasers (5 cm) */
const UNITK = {
  cube: { cm: 1, name: "cubes" },
  clip: { cm: 3, name: "paper clips" },
  eraser: { cm: 5, name: "erasers" },
};
/* `count` units of one kind end to end from x, y; u: pixels per cm */
const unitRow = (kind, count, x, y, u) =>
  range(count)
    .map((i) => {
      const size = UNITK[kind].cm * u,
        left = x + i * size;
      return kind === "cube"
        ? `<rect class="cube a" x="${left + 1}" y="${y}" width="${size - 2}" height="${size - 2}" rx="2"/>`
        : kind === "clip"
          ? `<g class="clip"><rect x="${left + 2}" y="${y}" width="${size - 4}" height="16" rx="8"/><rect x="${left + 7}" y="${y + 4}" width="${size - 16}" height="8" rx="4"/></g>`
          : `<rect class="eraser" x="${left + 1}" y="${y}" width="${size - 2}" height="18" rx="4"/>`;
    })
    .join("");
/* an object len cm long with rows of units under it: rows [[unit, how many], …]; u: pixels per cm */
function unitsFig(kind, len, rows, u) {
  let markup = thing(kind, 10, 8, len * u),
    y = 46;
  rows.forEach(([unit, count]) => {
    markup += unitRow(unit, count, 10, y, u);
    y += (unit === "cube" ? u : 18) + 14;
  });
  return svgWrap(
    20 + len * u,
    y,
    markup,
    `A ${NAME[kind]} measured with ` + rows.map(([unit, count]) => `${count} ${UNITK[unit].name}`).join(" and "),
  );
}
/* `count` foot rulers end to end from x, y (8 pixels per inch), with the inches so far under each join, or "12 in" under each one (each) */
const footRow = (x, y, count, each) =>
  range(count)
    .map((i) => {
      const left = x + i * 96;
      return (
        `<rect class="rul" x="${left}" y="${y}" width="96" height="30" rx="2"/>` +
        range(11)
          .map(
            (j) =>
              `<line class="tick" x1="${left + (j + 1) * 8}" y1="${y}" x2="${left + (j + 1) * 8}" y2="${y + (j === 5 ? 14 : 8)}"/>`,
          )
          .join("") +
        (each
          ? `<text class="lbl s" x="${left + 48}" y="${y + 46}">12 in</text>`
          : `<text class="lbl cy" x="${left + 96}" y="${y + 46}">${12 * (i + 1)}</text>`)
      );
    })
    .join("");
/* a thing ft feet long with `count` foot rulers under it, room for most of them */
const feetFig = (kind, ft, count, most = ft, each = false) =>
  svgWrap(
    40 + most * 96,
    110,
    thing(kind, 20, 10, ft * 96) + footRow(20, 52, count, each),
    `A ${NAME[kind]} with ${count} foot rulers under it`,
  );
/* an object with a 10 cm strip under it, for estimating (24 pixels per cm, like the 20 cm ruler it's measured on) */
const estFig = (kind, len) =>
  svgWrap(
    Math.max(len, 10) * 24 + 110,
    90,
    thing(kind, 22, 12, len * 24) +
      `<rect class="ref" x="22" y="56" width="240" height="20" rx="3"/><text class="lbl st" x="274" y="66">10 cm</text>`,
    `A ${NAME[kind]} above a strip 10 centimeters long`,
  );
