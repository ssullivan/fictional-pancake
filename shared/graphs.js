/* Data graphs for K–5 pages: line plots, picture graphs, and bar graphs. Styles are in graphs.css.
   Needs util.js, figures.js (svgWrap), and pictures.js.

   lineplot(counts, lo, hi, {d, …})  a line plot: an X for each measurement, in whole numbers or fractions (svg)
   PIC, picGraph(rows, {scale, …})   picture graphs, where each picture shows 1 or a scale like 2, 5, or 10 (half pictures too) (svg)
   barGraph(rows, {max, scale, …})   bar graphs with a line every 1, 2, 5, or 10; bars to read, set by tapping, or compare (svg) */
/* A line plot: counts {k: how many} from lo to hi, one X for each, at k/d (d 1: whole numbers; otherwise every tick is a fraction).
   mark: highlight k. tap: ticks can be tapped (data-v = k). diff: [a, b] draws an arrow from a to b under the line, labelled with b − a.
   unit: written under the line. u: pixels between ticks. */
function lineplot(counts,lo,hi,{d=1,mark=null,tap=false,diff=null,unit='inches',u=56,label}={}){
  /* the line is low enough for the tallest stack of Xs (room for at least 3), 26 pixels each */
  const tallest=Math.max(3,...Object.values(counts)),left=30,lineY=16+tallest*26,xOf=v=>left+(v-lo)*u,
    isFraction=d>1,say=k=>isFraction?`${k}/${d}`:k;
  /* belowY: where the next thing under the line goes (fractions under the ticks take more room) */
  let markup='',belowY=lineY+(isFraction?60:44);
  if(mark!==null)markup+=`<rect class="colhi" x="${xOf(mark)-u/2+3}" y="4" width="${u-6}" height="${lineY+(isFraction?46:30)}" rx="8"/>`;
  markup+=`<line class="axis" x1="${left-18}" y1="${lineY}" x2="${xOf(hi)+18}" y2="${lineY}"/>`;
  range(hi-lo+1).forEach(i=>{
    const v=lo+i,marked=v===mark;
    /* a tick and its number: a fraction, or a whole number when it comes out even */
    markup+=`<line class="tick" x1="${xOf(v)}" y1="${lineY-6}" x2="${xOf(v)}" y2="${lineY+6}"/>`
      +(isFraction&&v%d?frT(xOf(v),lineY+28,v,d,marked?'cy':''):`<text class="lbl${marked?' cy':''}" x="${xOf(v)}" y="${lineY+22}">${v/d}</text>`);
    range(counts[v]||0).forEach(j=>{markup+=`<text class="xm${marked?' hi':''}" x="${xOf(v)}" y="${lineY-16-j*26}">X</text>`;});
    if(tap)markup+=`<rect class="hit" data-v="${v}" x="${xOf(v)-u/2}" y="0" width="${u}" height="${lineY+(isFraction?50:34)}"/>`;
  });
  if(diff){
    /* a two-headed arrow from a to b, with b − a above it */
    const [a,b]=diff;
    markup+=`<line class="arr" x1="${xOf(a)+6}" y1="${belowY}" x2="${xOf(b)-6}" y2="${belowY}"/>`
      +`<polygon class="arrh" points="${xOf(a)},${belowY} ${xOf(a)+10},${belowY-6} ${xOf(a)+10},${belowY+6}"/>`
      +`<polygon class="arrh" points="${xOf(b)},${belowY} ${xOf(b)-10},${belowY-6} ${xOf(b)-10},${belowY+6}"/>`
      +(isFraction?frT((xOf(a)+xOf(b))/2,belowY-22,b-a,d,'cy'):`<text class="lbl s cy" x="${(xOf(a)+xOf(b))/2}" y="${belowY-10}">${b-a}</text>`);
    belowY+=24;
  }
  markup+=`<text class="lbl s" x="${(left+xOf(hi))/2}" y="${belowY}">${unit}</text>`;
  return svgWrap(left*2+(hi-lo)*u,belowY+12,markup,label||`Line plot of lengths in ${unit}: `+range(hi-lo+1).map(i=>`${counts[lo+i]||0} at ${say(lo+i)}`).join(', '));
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
/* counts the half pictures drawn on the page, so each one's clipPath gets an id of its own */
let picClip=0;
/* Picture graph: rows [{label, n, pic, c}] (pic names a PIC drawing, c its color). Each picture shows `scale`; half the scale left
   over is drawn as half a picture. max: the most any row could have (sets the width). unit: what the key says each picture
   shows ("2 votes"). hi: index of a row to highlight. tap: each row can be tapped (data-r); tap 'cand' makes each row a tap
   answer for engine.js instead (.cand, data-id = its index). */
function picGraph(rows,{hi=-1,max=Math.max(...rows.map(r=>r.n)),title='',scale=1,unit=String(scale),tap=false,label}={}){
  /* labelW fits the longest row label; each picture takes a cell cellSize square; the title, if any, takes titleH at the top */
  const labelW=Math.max(92,20+10*Math.max(...rows.map(r=>r.label.length))),cellSize=34,titleH=title?30:6,
    width=Math.max(labelW+Math.ceil(max/scale)*cellSize+16,title.length*10+16),height=titleH+rows.length*cellSize+34;
  let markup=title?`<text class="lbl st" x="4" y="16">${title}</text>`:'';
  rows.forEach((r,i)=>{
    const y=titleH+i*cellSize,whole=Math.floor(r.n/scale),half=r.n%scale>0;
    if(i===hi)markup+=`<rect class="rowhi" x="2" y="${y}" width="${width-4}" height="${cellSize}" rx="6"/>`;
    markup+=`<text class="lbl en" x="${labelW-10}" y="${y+cellSize/2}">${r.label}</text><line class="axis" x1="${labelW}" y1="${y}" x2="${labelW}" y2="${y+cellSize}"/>`;
    range(whole).forEach(k=>markup+=PIC[r.pic](labelW+cellSize/2+k*cellSize,y+cellSize/2,r.c));
    /* half a picture: the next picture, clipped to the left half of its cell */
    if(half){
      const id=`pich${++picClip}`,x=labelW+whole*cellSize;
      markup+=`<clipPath id="${id}"><rect x="${x}" y="${y}" width="${cellSize/2}" height="${cellSize}"/></clipPath><g clip-path="url(#${id})">${PIC[r.pic](x+cellSize/2,y+cellSize/2,r.c)}</g>`;
    }
    if(tap){
      const target=tap==='cand'?`data-id="${i}" tabindex="0" role="button" aria-label="${r.label}"`:`data-r="${i}"`;
      markup+=`<rect class="${tap==='cand'?'cand ':''}hit" ${target} x="2" y="${y}" width="${width-4}" height="${cellSize}" rx="6"/>`;
    }
  });
  markup+=`<text class="lbl s st" x="4" y="${height-10}">Each picture shows ${unit}.</text>`;
  return svgWrap(width,height,markup,label||'Picture graph: '+rows.map(r=>`${r.label} ${r.n}`).join(', '));
}
/* Bar graph: rows [{label, n, c}], with a line every `scale` up to max (a multiple of scale), each line numbered. A bar can end
   between two lines, uh pixels apart. edit: each column can be tapped in steps of `step` (data-r, data-v). hi: index of a bar to highlight, or a
   list of them. diff: [small, big] row indexes, shows how much taller the big bar is (with its size if showDiff).
   tap: each bar's column can be tapped (data-r); tap 'cand' makes each bar a tap answer for engine.js instead (.cand, data-id = its index). */
function barGraph(rows,{max=10,scale=1,step=scale,uh=24,edit=false,hi=-1,diff=null,showDiff=false,title='',tap=false,label}={}){
  /* axisX: room left of the axis for its numbers (wider for 3 digits); topY: where the scale starts, below any title */
  const barW=58,gap=32,axisX=max>=100?44:36,topY=title?44:12,lines=max/scale,
    width=Math.max(axisX+rows.length*(barW+gap)+gap,title.length*10+16),height=topY+lines*uh+36,
    /* yOf(v): the height of value v; barX(i): the left edge of bar i */
    yOf=v=>topY+(max-v)/scale*uh,barX=i=>axisX+gap+i*(barW+gap);
  let markup=title?`<text class="lbl st" x="4" y="18">${title}</text>`:'';
  range(lines+1).forEach(k=>{const v=k*scale;markup+=`<line class="gl" x1="${axisX}" y1="${yOf(v)}" x2="${width-6}" y2="${yOf(v)}"/><text class="lbl s en" x="${axisX-8}" y="${yOf(v)}">${v}</text>`;});
  markup+=`<line class="axis" x1="${axisX}" y1="${yOf(0)}" x2="${width-6}" y2="${yOf(0)}"/><line class="axis" x1="${axisX}" y1="${yOf(max)}" x2="${axisX}" y2="${yOf(0)}"/>`;
  rows.forEach((r,i)=>{
    if(r.n)markup+=`<rect class="bar ${r.c}${[].concat(hi).includes(i)?' hi':''}" x="${barX(i)}" y="${yOf(r.n)}" width="${barW}" height="${r.n/scale*uh}"/>`;
    markup+=`<text class="lbl s" x="${barX(i)+barW/2}" y="${yOf(0)+18}">${r.label}</text>`;
    /* edit: a target for each step up the column; tapping it sets the bar to that height */
    if(edit)range(max/step).forEach(k=>markup+=`<rect class="hit" data-r="${i}" data-v="${(k+1)*step}" x="${barX(i)}" y="${yOf((k+1)*step)}" width="${barW}" height="${step/scale*uh}"/>`);
    if(tap){
      const target=tap==='cand'?`data-id="${i}" tabindex="0" role="button" aria-label="${r.label}"`:`data-r="${i}"`;
      markup+=`<rect class="${tap==='cand'?'cand ':''}hit" ${target} x="${barX(i)-6}" y="${topY}" width="${barW+12}" height="${lines*uh+30}" rx="6"/>`;
    }
  });
  if(diff){
    /* a dashed line from the small bar's top across to the big bar, and a bracket beside the big bar for the difference */
    const [small,big]=diff,smallY=yOf(rows[small].n),bigY=yOf(rows[big].n),bracketX=barX(big)+barW+6;
    markup+=`<line class="match" x1="${barX(small)}" y1="${smallY}" x2="${barX(big)+barW}" y2="${smallY}"/><path class="brace" d="M${bracketX},${bigY} h6 V${smallY} h-6"/>`;
    markup+=`<text class="lbl cy st" x="${bracketX+10}" y="${(smallY+bigY)/2}">${showDiff?rows[big].n-rows[small].n:'?'}</text>`;
  }
  return svgWrap(width+(diff?18:0),height,markup,label||'Bar graph: '+rows.map(r=>`${r.label} ${r.n}`).join(', '));
}
