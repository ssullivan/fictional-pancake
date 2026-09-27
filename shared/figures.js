/* SVG and table diagrams from class: double number lines and tables of equivalent ratios. Styles are in figures.css.
   Figures are functions of `show` (true once a hint is used or the problem is done) that return markup.
   Labels use the page's own fmt(n) unless you pass a formatter. */
const svgWrap=(w,h,body,label='Diagram')=>`<svg viewBox="0 0 ${w} ${h}" style="max-width:${w}px" role="img" aria-label="${label}">${body}</svg>`;
/* the gold "?" box that marks the unknown */
const qbox=(x,y,t='?')=>`<g class="qb"><rect x="${x-20}" y="${y-15}" width="40" height="30" rx="7"/><text x="${x}" y="${y+1}">${t}</text></g>`;

/* Double number line. ticks: [{t, b, st, sb, q}] where t/b are the top/bottom values,
   st/sb: 0 hidden · 1 shown · 2 shown with the hint, and q: 't' or 'b' puts the "?" on that line. */
function dnl(topL,botL,ticks,{ft=fmt,fb=fmt}={}){
  return show=>{
    const W=620,x0=34,x1=W-60,max=ticks[ticks.length-1].t,X=v=>x0+(x1-x0)*v/max,yT=62,yB=136;
    let out=`<text class="ftxt" x="4" y="18">${topL}</text><text class="ftxt" x="4" y="202">${botL}</text>`;
    [yT,yB].forEach(y=>out+=`<line class="nl" x1="${x0-14}" y1="${y}" x2="${W-30}" y2="${y}"/><polygon class="nl-arrow" points="${W-18},${y} ${W-32},${y-7} ${W-32},${y+7}"/>`);
    ticks.forEach(k=>{
      const x=X(k.t),rt=k.st===2,rb=k.sb===2;
      out+=`<line class="tick${(rt||rb)&&show?' rev':''}" x1="${x}" y1="${yT-9}" x2="${x}" y2="${yT+9}"/><line class="tick${(rt||rb)&&show?' rev':''}" x1="${x}" y1="${yB-9}" x2="${x}" y2="${yB+9}"/>`;
      if(k.q==='t')out+=qbox(x,yT-28);else if(k.st===1||(rt&&show))out+=`<text class="ftxt big mid${rt?' rev':''}" x="${x}" y="${yT-20}">${ft(k.t)}</text>`;
      if(k.q==='b')out+=qbox(x,yB+30);else if(k.sb===1||(rb&&show))out+=`<text class="ftxt big mid${rb?' rev':''}" x="${x}" y="${yB+36}">${fb(k.b)}</text>`;
    });
    return svgWrap(W,212,out,'Double number line');
  };
}

/* Table of equivalent ratios. c: {hx, hy} column headings.
   rows: [{x, y, q, h, note}] where q: 'x' or 'y' marks the unknown, h: row appears only with the hint, note: hint text beside it. */
function tableFig(c,rows){
  return show=>`<table class="rt" aria-label="Table of equivalent ratios"><thead><tr><th>${c.hx}</th><th>${c.hy}</th><th></th></tr></thead><tbody>${rows.filter(r=>show||!r.h).map(r=>`<tr class="${r.h?'rev':''}"><td>${r.q==='x'?'<span class="q">?</span>':fmt(r.x)}</td><td>${r.q==='y'?'<span class="q">?</span>':fmt(r.y)}</td><td class="note">${show&&r.note?r.note:''}</td></tr>`).join('')}</tbody></table>`;
}
