/* SVG and table diagrams from class: double number lines, tables of equivalent ratios, rows of shapes, recipe batches,
   paint colors, tape diagrams, coins, and percent tapes and number lines. Styles are in figures.css.
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

/* ---------- ratio diagrams (Grade 6 Unit 2) ---------- */
/* shapes to count in ratio diagrams, each with its names and d(x, y, size) that draws it */
const STAR=[[12,2],[15,9],[22.5,9.3],[16.6,14],[18.7,21.5],[12,17.2],[5.3,21.5],[7.4,14],[1.5,9.3],[9,9]];
const MARKS=[
  {one:'circle',many:'circles',d:(x,y,s)=>`<circle class="ic-a" cx="${x+s/2}" cy="${y+s/2}" r="${s/2-2}"/>`},
  {one:'square',many:'squares',d:(x,y,s)=>`<rect class="ic-b" x="${x+2}" y="${y+2}" width="${s-4}" height="${s-4}" rx="3"/>`},
  {one:'triangle',many:'triangles',d:(x,y,s)=>`<polygon class="ic-c" points="${x+s/2},${y+2} ${x+s-2},${y+s-2} ${x+2},${y+s-2}"/>`},
  {one:'star',many:'stars',d:(x,y,s)=>`<polygon class="ic-d" points="${STAR.map(p=>`${x+p[0]*s/24},${y+p[1]*s/24}`).join(' ')}"/>`}
];
/* Two rows of shapes. With groups=k, each row is split into k equal groups boxed together. */
function rowsDiagram(rows,{groups=0,s=30,label='Diagram of shapes'}={}){
  const g=s+6,P=10;let out='',w;
  if(groups){
    const per=rows.map(r=>r.n/groups),gw=Math.max(...per)*g+10;
    w=P*2+groups*gw+(groups-1)*14;
    for(let j=0;j<groups;j++){
      const x0=P+j*(gw+14);
      out+=`<rect class="grp" x="${x0}" y="${P-4}" width="${gw}" height="${rows.length*g+8}" rx="8"/>`;
      rows.forEach((r,i)=>{for(let q=0;q<per[i];q++)out+=r.sh.d(x0+5+q*g,P+i*g,s);});
    }
  }else{
    w=P*2+Math.max(...rows.map(r=>r.n))*g;
    rows.forEach((r,i)=>{for(let q=0;q<r.n;q++)out+=r.sh.d(P+q*g,P+i*g,s);});
  }
  return svgWrap(w,P*2+rows.length*g,out,label);
}
/* n batches of a recipe with a of one thing and b of another (rec: {dish, x: [one, many], y: [one, many]}), drawn with shapes A and B */
function batchDiagram(a,b,n,rec,A=MARKS[0],B=MARKS[1]){
  const s=26,g=32,L=88,rowH=40;let out='';
  const w=L+(a+b)*g+30,h=n*rowH+64;
  for(let i=0;i<n;i++){
    const y=12+i*rowH;
    out+=`<text class="ftxt${i?' rev':''}" x="6" y="${y+19}">Batch ${i+1}</text>`;
    for(let q=0;q<a;q++)out+=A.d(L+q*g,y,s);
    for(let q=0;q<b;q++)out+=B.d(L+a*g+18+q*g,y,s);
  }
  if(n>1)out+=`<rect class="grp new" x="2" y="${12+rowH-6}" width="${w-4}" height="${(n-1)*rowH+2}" rx="8"/>`;
  const ly=n*rowH+30;
  out+=A.d(6,ly-4,20)+`<text class="ftxt" x="32" y="${ly+11}">= 1 ${rec.x[0]}</text>`;
  out+=B.d(6,ly+20,20)+`<text class="ftxt" x="32" y="${ly+35}">= 1 ${rec.y[0]}</text>`;
  return svgWrap(Math.max(w,300),h+22,out,`${n} batches of ${rec.dish}`);
}
/* the color of a paint mix of bl parts blue and ye parts yellow: equivalent mixes get the same color */
const mixColor=(bl,ye)=>{const t=ye/(bl+ye);return `hsl(${Math.round(225-t*170)} 72% ${Math.round(42+t*16)}%)`;};
/* A tape diagram for a part-part-whole ratio a : b with k in each box (c: {A, B} names for the two parts). The options mark
   what's unknown (qa, qb, qt get a "?") and what's shown. Returns a figure: a function of show (the box values). */
function tapeFig(c,a,b,k,{qa,qb,qt,showA,showB,showT}){
  return show=>{
    const bw=46,x0=10,y1=34,y2=112,n=Math.max(a,b),xr=x0+n*bw;let out='';
    const row=(y,m,cls,label,val,q)=>{
      let s=`<text class="ftxt" x="${x0}" y="${y-10}">${label}</text>`;
      for(let i=0;i<m;i++){s+=`<rect class="tape ${cls}" x="${x0+i*bw}" y="${y}" width="${bw}" height="38"/>`;if(show)s+=`<text class="ftxt big mid rev" x="${x0+i*bw+bw/2}" y="${y+26}">${k}</text>`;}
      const ex=x0+m*bw+26;
      if(q)s+=qbox(ex+8,y+19);else if(val!=null)s+=`<text class="ftxt big" x="${ex-10}" y="${y+26}">${val}</text>`;
      return s;
    };
    out+=row(y1,a,'',c.A,showA?k*a:null,qa)+row(y2,b,'b',c.B,showB?k*b:null,qb);
    const bx=xr+90;
    out+=`<path class="brace" d="M${bx},${y1} q14,0 14,14 v${(y2+38-y1)/2-24} q0,10 10,10 q-10,0 -10,10 v${(y2+38-y1)/2-24} q0,14 -14,14"/>`;
    const my=(y1+y2+38)/2;
    if(qt)out+=qbox(bx+52,my);else if(showT)out+=`<text class="ftxt big" x="${bx+32}" y="${my+7}">${k*(a+b)}</text>`;
    out+=`<text class="ftxt" x="${bx+32}" y="${my+30}">total</text>`;
    return svgWrap(bx+110,170,out,'Tape diagram');
  };
}

/* ---------- percents (Grade 6 Unit 3) ---------- */
/* coins to count in cents (a percent of a dollar), drawn in a row by coinsFig(list) */
const COIN_SET=[{v:25,r:24,n:'quarter'},{v:10,r:18,n:'dime'},{v:5,r:21,n:'nickel'},{v:1,r:19,n:'penny',cu:1}];
function coinsFig(list){
  let x=6,out='';list.forEach(c=>{out+=`<circle class="coin${c.cu?' cu':''}" cx="${x+c.r}" cy="34" r="${c.r}"/><text class="coin-t" x="${x+c.r}" y="35">${c.v}¢</text>`;x+=c.r*2+8;});
  return ()=>svgWrap(x,68,out,'Coins');
}
/* A percent tape: the whole split into n equal boxes worth each, with m of them as the part, and a 0%–100% scale under it.
   W and part are the amounts; qW, qP put a "?" on the one to find. Returns a figure: a function of show (the box values). */
function pctTape(n,m,{W,part,qW,qP,each}){
  return show=>{
    const w=460,bw=w/n,x0=10;let out=`<text class="ftxt" x="${x0}" y="18">whole</text>`;
    for(let i=0;i<n;i++){out+=`<rect class="tape b" x="${x0+i*bw}" y="26" width="${bw}" height="38"/>`;if(show)out+=`<text class="ftxt mid rev" x="${x0+i*bw+bw/2}" y="51">${fmt(each)}</text>`;}
    out+=qW?qbox(x0+w+34,45):`<text class="ftxt big" x="${x0+w+12}" y="52">${fmt(W)}</text>`;
    out+=`<text class="ftxt" x="${x0}" y="96">part</text>`;
    for(let i=0;i<m;i++){out+=`<rect class="tape" x="${x0+i*bw}" y="104" width="${bw}" height="38"/>`;if(show)out+=`<text class="ftxt mid rev" x="${x0+i*bw+bw/2}" y="129">${fmt(each)}</text>`;}
    out+=qP?qbox(x0+m*bw+34,123):`<text class="ftxt big" x="${x0+m*bw+12}" y="130">${fmt(part)}</text>`;
    for(let i=0;i<=n;i++)out+=`<line class="tick" x1="${x0+i*bw}" y1="150" x2="${x0+i*bw}" y2="160"/><text class="ftxt mid" x="${x0+i*bw}" y="178">${fmt(100*i/n)}%</text>`;
    out+=`<line class="nl" x1="${x0}" y1="155" x2="${x0+w}" y2="155"/>`;
    return svgWrap(w+80,188,out,'Percent tape diagram');
  };
}
/* A double number line for a percent problem: the amount on top and 0%–100% below. The whole W is 100%, and x is P%;
   askA, askP, askW put a "?" on the amount, the percent, or the whole. Returns a figure: a function of show. */
function pctLine(W,P,x,{askA,askP,askW}){
  const top=Math.max(100,P),ticks=[];
  for(let p=0;p<=top;p+=10){if(p===P)continue;ticks.push({t:W*p/100,b:p,st:p===100&&!askW?1:(p===10&&Math.abs(P-10)>=10?2:(p===0?1:0)),sb:p===0||p===100||(p===10&&Math.abs(P-10)>=10)?(p===10?2:1):0,q:p===100&&askW?'t':null});}
  ticks.push({t:x,b:P,st:askA?0:1,sb:askP?0:1,q:askA?'t':askP?'b':null});
  ticks.sort((a,b)=>a.t-b.t);
  return dnl('amount','percent',ticks,{fb:v=>fmt(v)+'%'});
}
