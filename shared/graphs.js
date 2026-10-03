/* Data graphs for K–5 pages: line plots, picture graphs, and bar graphs. Styles are in graphs.css.
   Needs util.js, figures.js (svgWrap), and pictures.js.

   lineplot(counts, lo, hi, {d, …})  a line plot: an X for each measurement, in whole numbers or fractions (svg)
   PIC, picGraph(rows, {scale, …})   picture graphs, where each picture shows 1 or a scale like 2, 5, or 10 (half pictures too) (svg)
   barGraph(rows, {max, scale, …})   bar graphs with a line every 1, 2, 5, or 10; bars to read, set by tapping, or compare (svg) */
/* A line plot: counts {k: how many} from lo to hi, one X for each, at k/d (d 1: whole numbers; otherwise every tick is a fraction).
   mark: highlight k. tap: ticks can be tapped (data-v = k). diff: [a, b] draws an arrow from a to b under the line, labelled with b − a.
   unit: written under the line. u: pixels between ticks. */
function lineplot(counts,lo,hi,{d=1,mark=null,tap=false,diff=null,unit='inches',u=56,label}={}){
  const top=Math.max(3,...Object.values(counts)),X=30,Y=16+top*26,x=v=>X+(v-lo)*u,F=d>1,say=k=>F?`${k}/${d}`:k;
  let o='',y=Y+(F?60:44);
  if(mark!==null)o+=`<rect class="colhi" x="${x(mark)-u/2+3}" y="4" width="${u-6}" height="${Y+(F?46:30)}" rx="8"/>`;
  o+=`<line class="axis" x1="${X-18}" y1="${Y}" x2="${x(hi)+18}" y2="${Y}"/>`;
  range(hi-lo+1).forEach(i=>{
    const v=lo+i,h=v===mark;
    o+=`<line class="tick" x1="${x(v)}" y1="${Y-6}" x2="${x(v)}" y2="${Y+6}"/>`+(F&&v%d?frT(x(v),Y+28,v,d,h?'cy':''):`<text class="lbl${h?' cy':''}" x="${x(v)}" y="${Y+22}">${v/d}</text>`);
    range(counts[v]||0).forEach(j=>{o+=`<text class="xm${h?' hi':''}" x="${x(v)}" y="${Y-16-j*26}">X</text>`;});
    if(tap)o+=`<rect class="hit" data-v="${v}" x="${x(v)-u/2}" y="0" width="${u}" height="${Y+(F?50:34)}"/>`;
  });
  if(diff){
    const [a,b]=diff;
    o+=`<line class="arr" x1="${x(a)+6}" y1="${y}" x2="${x(b)-6}" y2="${y}"/><polygon class="arrh" points="${x(a)},${y} ${x(a)+10},${y-6} ${x(a)+10},${y+6}"/><polygon class="arrh" points="${x(b)},${y} ${x(b)-10},${y-6} ${x(b)-10},${y+6}"/>`
      +(F?frT((x(a)+x(b))/2,y-22,b-a,d,'cy'):`<text class="lbl s cy" x="${(x(a)+x(b))/2}" y="${y-10}">${b-a}</text>`);
    y+=24;
  }
  o+=`<text class="lbl s" x="${(X+x(hi))/2}" y="${y}">${unit}</text>`;
  return svgWrap(X*2+(hi-lo)*u,y+12,o,label||`Line plot of lengths in ${unit}: `+range(hi-lo+1).map(i=>`${counts[lo+i]||0} at ${say(lo+i)}`).join(', '));
}
/* ---------- data graphs ---------- */
/* pictures for picture graphs, centered at x, y */
const PIC={
  note:(x,y,c)=>`<rect class="sticky ${c}" x="${x-13}" y="${y-13}" width="26" height="26" rx="4"/>`,
  sun:(x,y)=>`<g class="p-sun"><circle cx="${x}" cy="${y}" r="8"/>${range(8).map(i=>{const a=i*Math.PI/4,c=Math.cos(a),s=Math.sin(a);return `<line x1="${x+c*11}" y1="${y+s*11}" x2="${x+c*15}" y2="${y+s*15}"/>`;}).join('')}</g>`,
  cloud:(x,y)=>`<g class="p-cloud"><circle cx="${x-6}" cy="${y+2}" r="7"/><circle cx="${x+2}" cy="${y-3}" r="9"/><circle cx="${x+8}" cy="${y+3}" r="6"/><rect x="${x-13}" y="${y+2}" width="21" height="7" rx="3"/></g>`,
  rain:(x,y)=>`<path class="p-rain" d="M${x},${y-13} C${x+4},${y-5} ${x+10},${y} ${x+10},${y+5} A10,10 0 0 1 ${x-10},${y+5} C${x-10},${y} ${x-4},${y-5} ${x},${y-13}Z"/>`,
  dot:(x,y,c)=>`<circle class="sticky ${c}" cx="${x}" cy="${y}" r="12"/>`,
};
let picClip=0;
/* Picture graph: rows [{label, n, pic, c}] (pic names a PIC drawing, c its color). Each picture shows `scale`; half the scale left
   over is drawn as half a picture. max: the most any row could have (sets the width). unit: what the key says each picture
   shows ("2 votes"). hi: index of a row to highlight. tap: each row can be tapped (data-r); tap 'cand' makes each row a tap
   answer for engine.js instead (.cand, data-id = its index). */
function picGraph(rows,{hi=-1,max=Math.max(...rows.map(r=>r.n)),title='',scale=1,unit=String(scale),tap=false,label}={}){
  const L=Math.max(92,20+10*Math.max(...rows.map(r=>r.label.length))),P=34,T=title?30:6,W=Math.max(L+Math.ceil(max/scale)*P+16,title.length*10+16),H=T+rows.length*P+34;
  let o=title?`<text class="lbl st" x="4" y="16">${title}</text>`:'';
  rows.forEach((r,i)=>{
    const y=T+i*P,whole=Math.floor(r.n/scale),half=r.n%scale>0;
    if(i===hi)o+=`<rect class="rowhi" x="2" y="${y}" width="${W-4}" height="${P}" rx="6"/>`;
    o+=`<text class="lbl en" x="${L-10}" y="${y+P/2}">${r.label}</text><line class="axis" x1="${L}" y1="${y}" x2="${L}" y2="${y+P}"/>`;
    range(whole).forEach(k=>o+=PIC[r.pic](L+P/2+k*P,y+P/2,r.c));
    if(half){const id=`pich${++picClip}`,x=L+whole*P;o+=`<clipPath id="${id}"><rect x="${x}" y="${y}" width="${P/2}" height="${P}"/></clipPath><g clip-path="url(#${id})">${PIC[r.pic](x+P/2,y+P/2,r.c)}</g>`;}
    if(tap)o+=`<rect class="${tap==='cand'?'cand ':''}hit" ${tap==='cand'?`data-id="${i}" tabindex="0" role="button" aria-label="${r.label}"`:`data-r="${i}"`} x="2" y="${y}" width="${W-4}" height="${P}" rx="6"/>`;
  });
  o+=`<text class="lbl s st" x="4" y="${H-10}">Each picture shows ${unit}.</text>`;
  return svgWrap(W,H,o,label||'Picture graph: '+rows.map(r=>`${r.label} ${r.n}`).join(', '));
}
/* Bar graph: rows [{label, n, c}], with a line every `scale` up to max (a multiple of scale), each line numbered. A bar can end
   between two lines, uh pixels apart. edit: each column can be tapped in steps of `step` (data-r, data-v). hi: index of a bar to highlight, or a
   list of them. diff: [small, big] row indexes, shows how much taller the big bar is (with its size if showDiff).
   tap: each bar's column can be tapped (data-r); tap 'cand' makes each bar a tap answer for engine.js instead (.cand, data-id = its index). */
function barGraph(rows,{max=10,scale=1,step=scale,uh=24,edit=false,hi=-1,diff=null,showDiff=false,title='',tap=false,label}={}){
  const BW=58,GAP=32,UH=uh,L=max>=100?44:36,T=title?44:12,N=max/scale,W=Math.max(L+rows.length*(BW+GAP)+GAP,title.length*10+16),H=T+N*UH+36,
    Y=v=>T+(max-v)/scale*UH,X=i=>L+GAP+i*(BW+GAP);
  let o=title?`<text class="lbl st" x="4" y="18">${title}</text>`:'';
  range(N+1).forEach(k=>{const v=k*scale;o+=`<line class="gl" x1="${L}" y1="${Y(v)}" x2="${W-6}" y2="${Y(v)}"/><text class="lbl s en" x="${L-8}" y="${Y(v)}">${v}</text>`;});
  o+=`<line class="axis" x1="${L}" y1="${Y(0)}" x2="${W-6}" y2="${Y(0)}"/><line class="axis" x1="${L}" y1="${Y(max)}" x2="${L}" y2="${Y(0)}"/>`;
  rows.forEach((r,i)=>{
    if(r.n)o+=`<rect class="bar ${r.c}${[].concat(hi).includes(i)?' hi':''}" x="${X(i)}" y="${Y(r.n)}" width="${BW}" height="${r.n/scale*UH}"/>`;
    o+=`<text class="lbl s" x="${X(i)+BW/2}" y="${Y(0)+18}">${r.label}</text>`;
    if(edit)range(max/step).forEach(k=>o+=`<rect class="hit" data-r="${i}" data-v="${(k+1)*step}" x="${X(i)}" y="${Y((k+1)*step)}" width="${BW}" height="${step/scale*UH}"/>`);
    if(tap)o+=`<rect class="${tap==='cand'?'cand ':''}hit" ${tap==='cand'?`data-id="${i}" tabindex="0" role="button" aria-label="${r.label}"`:`data-r="${i}"`} x="${X(i)-6}" y="${T}" width="${BW+12}" height="${N*UH+30}" rx="6"/>`;
  });
  if(diff){
    const [s,b]=diff,ys=Y(rows[s].n),yb=Y(rows[b].n),xb=X(b)+BW+6;
    o+=`<line class="match" x1="${X(s)}" y1="${ys}" x2="${X(b)+BW}" y2="${ys}"/><path class="brace" d="M${xb},${yb} h6 V${ys} h-6"/>`;
    o+=`<text class="lbl cy st" x="${xb+10}" y="${(ys+yb)/2}">${showDiff?rows[b].n-rows[s].n:'?'}</text>`;
  }
  return svgWrap(W+(diff?18:0),H,o,label||'Bar graph: '+rows.map(r=>`${r.label} ${r.n}`).join(', '));
}
