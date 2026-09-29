/* Learn Adding, Subtracting, and Working with Data (Grade 2 Unit 1): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
/* pictures for picture graphs, centered at x, y */
const PIC={
  note:(x,y,c)=>`<rect class="sticky ${c}" x="${x-13}" y="${y-13}" width="26" height="26" rx="4"/>`,
  sun:(x,y)=>`<g class="p-sun"><circle cx="${x}" cy="${y}" r="8"/>${range(8).map(i=>{const a=i*Math.PI/4,c=Math.cos(a),s=Math.sin(a);return `<line x1="${x+c*11}" y1="${y+s*11}" x2="${x+c*15}" y2="${y+s*15}"/>`;}).join('')}</g>`,
  cloud:(x,y)=>`<g class="p-cloud"><circle cx="${x-6}" cy="${y+2}" r="7"/><circle cx="${x+2}" cy="${y-3}" r="9"/><circle cx="${x+8}" cy="${y+3}" r="6"/><rect x="${x-13}" y="${y+2}" width="21" height="7" rx="3"/></g>`,
  rain:(x,y)=>`<path class="p-rain" d="M${x},${y-13} C${x+4},${y-5} ${x+10},${y} ${x+10},${y+5} A10,10 0 0 1 ${x-10},${y+5} C${x-10},${y} ${x-4},${y-5} ${x},${y-13}Z"/>`,
  dot:(x,y,c)=>`<circle class="sticky ${c}" cx="${x}" cy="${y}" r="12"/>`,
};
/* Picture graph: rows [{label, n, pic, c}], one picture = 1. hi: index of a row to highlight. */
function picGraph(rows,{hi=-1,max=Math.max(...rows.map(r=>r.n)),title='',unit='1'}={}){
  const L=92,P=34,T=title?30:6,W=Math.max(L+max*P+16,title.length*10+16),H=T+rows.length*P+34;
  let o=title?`<text class="lbl st" x="4" y="16">${title}</text>`:'';
  rows.forEach((r,i)=>{
    const y=T+i*P;
    if(i===hi)o+=`<rect class="rowhi" x="2" y="${y}" width="${W-4}" height="${P}" rx="6"/>`;
    o+=`<text class="lbl en" x="${L-10}" y="${y+P/2}">${r.label}</text><line class="axis" x1="${L}" y1="${y}" x2="${L}" y2="${y+P}"/>`;
    range(r.n).forEach(k=>o+=PIC[r.pic](L+P/2+k*P,y+P/2,r.c));
  });
  o+=`<text class="lbl s st" x="4" y="${H-10}">Each picture shows ${unit}.</text>`;
  return svgWrap(W,H,o,'Picture graph: '+rows.map(r=>`${r.label} ${r.n}`).join(', '));
}
/* Bar graph with a scale of 1. rows [{label, n, c}]. edit: every square of every column can be tapped (data-r, data-v).
   hi: index of a bar to highlight. diff: [small, big] row indexes, shows how much taller the big bar is (with its size if showDiff). */
function barGraph(rows,{max=10,edit=false,hi=-1,diff=null,showDiff=false,title=''}={}){
  const BW=58,GAP=32,UH=24,L=36,T=title?44:12,W=Math.max(L+rows.length*(BW+GAP)+GAP,title.length*10+16),H=T+max*UH+36,Y=v=>T+(max-v)*UH,X=i=>L+GAP+i*(BW+GAP);
  let o=title?`<text class="lbl st" x="4" y="18">${title}</text>`:'';
  range(max+1).forEach(v=>o+=`<line class="gl" x1="${L}" y1="${Y(v)}" x2="${W-6}" y2="${Y(v)}"/><text class="lbl s en" x="${L-8}" y="${Y(v)}">${v}</text>`);
  o+=`<line class="axis" x1="${L}" y1="${Y(0)}" x2="${W-6}" y2="${Y(0)}"/><line class="axis" x1="${L}" y1="${Y(max)}" x2="${L}" y2="${Y(0)}"/>`;
  rows.forEach((r,i)=>{
    if(r.n)o+=`<rect class="bar ${r.c}${i===hi?' hi':''}" x="${X(i)}" y="${Y(r.n)}" width="${BW}" height="${r.n*UH}"/>`;
    o+=`<text class="lbl s" x="${X(i)+BW/2}" y="${Y(0)+18}">${r.label}</text>`;
    if(edit)range(max).forEach(v=>o+=`<rect class="hit" data-r="${i}" data-v="${v+1}" x="${X(i)}" y="${Y(v+1)}" width="${BW}" height="${UH}"/>`);
  });
  if(diff){
    const [s,b]=diff,ys=Y(rows[s].n),yb=Y(rows[b].n),xb=X(b)+BW+6;
    o+=`<line class="match" x1="${X(s)}" y1="${ys}" x2="${X(b)+BW}" y2="${ys}"/><path class="brace" d="M${xb},${yb} h6 V${ys} h-6"/>`;
    o+=`<text class="lbl cy st" x="${xb+10}" y="${(ys+yb)/2}">${showDiff?rows[b].n-rows[s].n:'?'}</text>`;
  }
  return svgWrap(W+(diff?18:0),H,o,'Bar graph: '+rows.map(r=>`${r.label} ${r.n}`).join(', '));
}
const SNACKS=[{label:'Apples',n:6,c:'red'},{label:'Crackers',n:3,c:'yellow'},{label:'Yogurt',n:8,c:'blue'},{label:'Carrots',n:5,c:'green'}];
/* quick-check figures that more than one chapter uses; each chapter adds its own */
const F={
  snacks:barGraph(SNACKS,{title:'Snacks our class chose'})
};
