/* Learn Measuring Length (Grade 2 Unit 3): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
const NAME={pencil:'pencil',crayon:'crayon',marker:'marker',glue:'glue stick',eraser:'eraser',book:'book',poster:'poster',rope:'jump rope',rug:'rug',box:'shoe box',bench:'bench'};
/* An object lying flat from x, y, w wide: a pencil, crayon, marker, or glue stick, or a plain bar for anything else (book, rug, …). */
function thing(kind,x,y,w,h=26){
  const m=y+h/2,e=x+w,g=b=>`<g class="ob k-${kind}">${b}</g>`;
  switch(w<40?'':kind){
    case 'pencil':return g(`<rect class="er" x="${x}" y="${y}" width="10" height="${h}" rx="3"/><rect class="body" x="${x+10}" y="${y}" width="${w-28}" height="${h}"/><polygon class="wood" points="${e-18},${y} ${e},${m} ${e-18},${y+h}"/><polygon class="lead" points="${e-6},${m-3.5} ${e},${m} ${e-6},${m+3.5}"/>`);
    case 'crayon':return g(`<rect class="body" x="${x}" y="${y}" width="${w-14}" height="${h}" rx="3"/><polygon class="body" points="${e-14},${y+4} ${e},${m-4} ${e},${m+4} ${e-14},${y+h-4}"/><path class="band" d="M${x+8},${y}v${h}M${e-24},${y}v${h}"/>`);
    case 'marker':{const c=Math.round(w*.3);return g(`<rect class="body" x="${x}" y="${y}" width="${w-c+4}" height="${h}" rx="5"/><rect class="cap" x="${e-c}" y="${y-2}" width="${c}" height="${h+4}" rx="5"/>`);}
    case 'glue':return g(`<rect class="body" x="${x}" y="${y}" width="${w-16}" height="${h}" rx="4"/><rect class="cap" x="${e-16}" y="${y-2}" width="16" height="${h+4}" rx="4"/>`);
    default:return g(`<rect class="body" x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/>`);
  }
}
/* A ruler n units long, numbered from start (every other number when units are narrow). obj: {kind, at, len} lies on it from `at`. torn: a torn tape (ragged left end).
   span: shade the part under the object. count: number each unit under the object 1, 2, 3, …  u: pixels per unit. */
const RU={cm:28,in:44},UNITS={cm:'centimeters',in:'inches'};
function ruler(n,{unit='cm',u=RU[unit],start=0,torn=false,obj=null,span=false,count=false,label}={}){
  const X=22,Y=obj?52:8,H=46,W=X+n*u+44,x=v=>X+(v-start)*u;
  let o='';
  if(obj){const a=x(obj.at),b=x(obj.at+obj.len);o+=thing(obj.kind,a,12,b-a)+`<path class="guide" d="M${a},40V${Y}M${b},40V${Y}"/>`;}
  o+=torn?`<path class="rul" d="M${X-12},${Y}H${X+n*u+34}V${Y+H}H${X-12}${range(6).map(i=>`L${X-(i%2?12:20)},${Y+H-(i+1)*H/6}`).join('')}Z"/>`
    :`<rect class="rul" x="${X-12}" y="${Y}" width="${n*u+46}" height="${H}" rx="4"/>`;
  if(obj&&span)o+=`<rect class="span" x="${x(obj.at)}" y="${Y}" width="${obj.len*u}" height="${H}"/>`;
  range(n+1).forEach(i=>{
    const t=X+i*u;
    o+=`<line class="tick" x1="${t}" y1="${Y}" x2="${t}" y2="${Y+(u<24&&i%2?8:14)}"/>`+(u<24&&i%2?'':`<text class="lbl${u<30?' s':''}" x="${t}" y="${Y+28}">${start+i}</text>`);
    if(unit==='in'&&i<n)o+=`<line class="tick" x1="${t+u/2}" y1="${Y}" x2="${t+u/2}" y2="${Y+8}"/>`;
  });
  o+=`<text class="lbl s" x="${X+n*u+22}" y="${Y+28}">${unit}</text>`;
  if(obj&&count)range(obj.len).forEach(i=>{o+=`<text class="lbl s cy" x="${x(obj.at+i)+u/2}" y="${Y+H+14}">${i+1}</text>`;});
  return svgWrap(W,Y+H+(count?28:4),o,label||(obj?`A ${NAME[obj.kind]} on a ruler, from ${obj.at} to ${obj.at+obj.len} ${UNITS[unit]}`:`A ruler in ${UNITS[unit]}`));
}
