/* Counting and place value for K–5 pages: ten-frames, connecting cubes, base-ten blocks (tens and ones, and small ones with
   hundreds), place-value charts, number words, and the standard algorithm to add or subtract. Styles are in blocks.css.
   Needs util.js, figures.js (svgWrap), and pictures.js.

   tenFrames(cells, {frames, out, tap, label})
   CUBE, cubes(x, y, n, cls)         a row of connecting cubes (markup), CUBE pixels each
   BLOCK, rod(x, y, cls), one(x, y, cls)   one ten, one one (markup), BLOCK pixels a cube
   blocks(x, y, tens, ones, cls, {traded, outT, outO})   tens and ones; returns [markup, width]
   addBlocks(a, b, joined)           a + b in blocks, apart or tens with tens and ones with ones (svg)
   tensOnesAdd(pairs)                widget: pick a + b, then join tens and ones
   BT, flat, stick, cube1, hto(x, y, h, t, o, {cls, tr}), htoFig(h, t, o, opt, label)   small base-ten diagrams with hundreds;
                                     numBlocks(n) draws n
   digits(n), numWords(n)            [hundreds, tens, ones] of n, and its name up to 999,999 ("four hundred six")
   pvChart(rows, hi, {places, tap}), PLACE, digitAt(n, e), commas(n)   a place-value chart (html table), hundredths to hundred-thousands; "305,020"
   algSteps(a, b, op), algFig(a, b, op, done)   the standard algorithm to add or subtract, column by column (svg) */
/* Ten-frames, 2 rows of 5 each. cells: a class for each filled cell in order ('a' gold, 'b' blue, null empty).
   out: set of crossed-out cells. tap: empty cells can be tapped (data-i). */
const CELL=44;
function tenFrames(cells,{frames=2,out=new Set(),tap=false,label='Ten-frames'}={}){
  const G=18,W=frames*5*CELL+(frames-1)*G+4,H=2*CELL+4;let o='';
  range(frames*10).forEach(i=>{
    const x=2+Math.floor(i/10)*(5*CELL+G)+i%5*CELL,y=2+Math.floor(i%10/5)*CELL,c=cells[i];
    o+=`<rect class="cell" x="${x}" y="${y}" width="${CELL}" height="${CELL}"/>`;
    if(c){
      const g=out.has(i);
      o+=`<g class="ctr ${c}${g?' gone':''}" data-i="${i}"><circle cx="${x+CELL/2}" cy="${y+CELL/2}" r="${CELL/2-6}"/>${g?`<path d="M${x+11},${y+11}L${x+CELL-11},${y+CELL-11}M${x+CELL-11},${y+11}L${x+11},${y+CELL-11}"/>`:''}</g>`;
    }else if(tap)o+=`<rect class="hit" data-i="${i}" x="${x}" y="${y}" width="${CELL}" height="${CELL}"/>`;
  });
  return svgWrap(W,H,o,label);
}
/* a row of connecting cubes starting at x, y */
const CUBE=32;
const cubes=(x,y,n,cls)=>range(n).map(i=>`<rect class="cube ${cls}" x="${x+i*CUBE}" y="${y}" width="${CUBE-2}" height="${CUBE-2}" rx="3"/>`).join('');
/* base-ten blocks: tens are rods of 10, ones are single cubes */
const BLOCK=16;
const rod=(x,y,cls='')=>`<g class="rod ${cls}"><rect x="${x}" y="${y}" width="${BLOCK}" height="${BLOCK*10}"/>${range(9).map(i=>`<line x1="${x}" y1="${y+BLOCK*(i+1)}" x2="${x+BLOCK}" y2="${y+BLOCK*(i+1)}"/>`).join('')}</g>`;
const one=(x,y,cls='')=>`<rect class="unit1 ${cls}" x="${x}" y="${y}" width="${BLOCK}" height="${BLOCK}"/>`;
/* Tens and ones as blocks from x, ones in columns of 5; returns [markup, width].
   traded: the last `traded` ones came from a broken ten (drawn in green). outT, outO: the last tens and ones are crossed out. */
function blocks(x,y,tens,ones,cls='',{traded=0,outT=0,outO=0}={}){
  let o='';
  range(tens).forEach(i=>{const g=i>=tens-outT,rx=x+i*(BLOCK+6);o+=rod(rx,y,cls+(g?' gone':''))+(g?xOut(rx,y,BLOCK,BLOCK*10):'');});
  const ox=x+tens*(BLOCK+6)+(tens?6:0);
  range(ones).forEach(i=>{
    const g=i>=ones-outO,ux=ox+Math.floor(i/5)*(BLOCK+4),uy=y+BLOCK*10-BLOCK-(i%5)*(BLOCK+4);
    o+=one(ux,uy,(i>=ones-traded?'tr':cls)+(g?' gone':''))+(g?xOut(ux,uy,BLOCK,BLOCK):'');
  });
  return [o,ox+Math.ceil(ones/5)*(BLOCK+4)-x];
}

/* a + b in base-ten blocks: side by side, or (joined) tens with tens and ones with ones, where 10 ones make a new ten (outlined).
   Returns the svg. */
function addBlocks(a,b,joined){
  let svg,w;
  if(!joined){
    const [m1,w1]=blocks(6,10,Math.floor(a/10),a%10,'a'),[m2,w2]=blocks(6+w1+34,10,Math.floor(b/10),b%10,'b');
    svg=m1+`<text class="lbl big" x="${6+w1+17}" y="${10+BLOCK*5}">+</text>`+m2;w=6+w1+34+w2+6;
  }else{
    const o=a%10+b%10,ta=Math.floor(a/10),tb=Math.floor(b/10),[mt1,wt1]=blocks(6,10,ta,0,'a'),[mt2,wt2]=blocks(6+wt1,10,tb,0,'b');
    let x=6+wt1+wt2;svg=mt1+mt2;
    if(o>=10){svg+=rod(x,10,'new');x+=BLOCK+6;}
    const oa=o>=10?0:a%10,ob=o>=10?o-10:b%10,[mo1,wo1]=blocks(x+10,10,0,oa,'a'),[mo2,wo2]=blocks(x+10+wo1+(oa?4:0),10,0,ob,'b');
    svg+=mo1+mo2;w=x+10+wo1+wo2+10;
  }
  return svgWrap(Math.max(w,160),BLOCK*10+24,svg,joined?'Tens together and ones together':`${a} and ${b} in base-ten blocks`);
}
/* Widget: pick a + b from pairs, then put tens with tens and ones with ones. */
const tensOnesAdd=PAIRS=>el=>{
  const q=Q(el);let p=0,joined=false;
  el.innerHTML=seg('Numbers',PAIRS.map(([a,b],i)=>[i,`${a} + ${b}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=PAIRS[p],t=Math.floor(a/10)+Math.floor(b/10),o=a%10+b%10;press(el,p);
    q('f').innerHTML=addBlocks(a,b,joined);
    q('go').textContent=joined?'Split them again':'Put tens with tens and ones with ones';
    q('r').innerHTML=joined?`Tens: <b>${Math.floor(a/10)*10} + ${Math.floor(b/10)*10} = ${t*10}</b>. Ones: <b>${a%10} + ${b%10} = ${o}</b>.`+(o>=10?`<br><span class="dimline">${o} ones is 1 ten and ${o-10} ones, so make a new ten.</span>`:'')+`<br><span class="ok"><b>${a} + ${b} = ${a+b}</b></span>`:`<b>${a} + ${b}</b><br><span class="dimline">Tall rods are tens. Small squares are ones.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;joined=false;draw();}});
  q('go').onclick=()=>{joined=!joined;draw();};
  draw();
};
/* Base-ten diagrams small enough for hundreds: a hundred is a 10 × 10 square, a ten a stick of 10, a one a small square (BT pixels each). */
const BT=7,FW=10*BT;
const btGrid=(x,y,cols,rows)=>range(cols-1).map(i=>`<line x1="${x+(i+1)*BT}" y1="${y}" x2="${x+(i+1)*BT}" y2="${y+rows*BT}"/>`).join('')+range(rows-1).map(i=>`<line x1="${x}" y1="${y+(i+1)*BT}" x2="${x+cols*BT}" y2="${y+(i+1)*BT}"/>`).join('');
const flat=(x,y,cls='')=>`<g class="flat ${cls}"><rect x="${x}" y="${y}" width="${FW}" height="${FW}"/>${btGrid(x,y,10,10)}</g>`;
const stick=(x,y,cls='')=>`<g class="rod ${cls}"><rect x="${x}" y="${y}" width="${BT}" height="${FW}"/>${btGrid(x,y,1,10)}</g>`;
const cube1=(x,y,cls='')=>`<rect class="unit1 ${cls}" x="${x}" y="${y}" width="${BT}" height="${BT}"/>`;
/* h hundreds (rows of 5), t tens (a gap after every 5), and o ones (columns of 5) from x, y.
   cls: {h, t, o} classes for each place; tr: the last tr tens came from a broken hundred. Returns [markup, width, height]. */
function hto(x,y,h,t,o,{cls={},tr=0}={}){
  let m='',X=x;
  range(h).forEach(i=>{m+=flat(x+i%5*(FW+8),y+Math.floor(i/5)*(FW+8),cls.h||'');});
  if(h)X+=Math.min(h,5)*(FW+8)+6;
  range(t).forEach(i=>{m+=stick(X+i*(BT+4)+Math.floor(i/5)*5,y,(i>=t-tr?'tr':'')+' '+(cls.t||''));});
  if(t)X+=t*(BT+4)+Math.floor((t-1)/5)*5+10;
  range(o).forEach(i=>{m+=cube1(X+Math.floor(i/5)*(BT+5),y+FW-BT-(i%5)*(BT+5),cls.o||'');});
  if(o)X+=Math.ceil(o/5)*(BT+5);
  return [m,X-x,Math.max(FW,Math.ceil(h/5)*(FW+8)-8)];
}
const htoFig=(h,t,o,opt={},label)=>{const [m,w,ht]=hto(8,8,h,t,o,opt);return svgWrap(Math.max(w+16,120),ht+16,m,label||`${h} hundreds, ${t} tens, and ${o} ones`);};
const digits=n=>[Math.floor(n/100),Math.floor(n/10)%10,n%10];
/* n in blocks: hundreds gold, tens blue, ones green */
const numBlocks=(n,label)=>{const [h,t,o]=digits(n);return htoFig(h,t,o,{cls:{t:'b',o:'c'}},label||`${n} in base-ten blocks`);};
/* the name of a whole number up to 999,999: numWords(406) is "four hundred six", numWords(35020) "thirty-five thousand twenty" */
const numWords=(()=>{
  const ONES=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],
    TENS=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  const w=n=>{
    const h=Math.floor(n/100),r=n%100,rw=r<20?ONES[r]:TENS[Math.floor(r/10)]+(r%10?'-'+ONES[r%10]:'');
    return h?`${ONES[h]} hundred${r?' '+rw:''}`:rw;
  };
  return n=>n<1000?w(n):`${w(Math.floor(n/1000))} thousand${n%1000?' '+w(n%1000):''}`;
})();
/* A place-value chart: rows [[label, n]]; hi: the column to outline in every row (0 is the first: hundreds by default).
   places: the columns, as powers of 10 (5 hundred-thousands … 0 ones, -1 tenths, -2 hundredths); default hundreds, tens, ones.
   Charts past hundreds group the columns into thousands and ones, headed H, T, O, and leave zeros before a number blank.
   tap: each digit is a button (data-row = its row, data-e = its place). */
const PLACE={5:'Hundred-thousands',4:'Ten-thousands',3:'Thousands',2:'Hundreds',1:'Tens',0:'Ones','-1':'Tenths','-2':'Hundredths'};
const digitAt=(n,e)=>Math.floor(Math.round(n*100)/10**(e+2))%10;
function pvChart(rows,hi=-1,{places=[2,1,0],tap=false}={}){
  const big=places[0]>2,col=e=>`p${((2-e)%3+3)%3}`,th=places.filter(e=>e>2).length;
  const head=big?`<tr><th></th><th class="per" colspan="${th}">Thousands</th><th class="per pb" colspan="${places.length-th}">Ones</th></tr><tr><th></th>${places.map(e=>`<th class="${e===2?'pb':''}" title="${PLACE[e]}">${'OTH'[(e%3+3)%3]}</th>`).join('')}</tr>`
    :`<tr><th></th>${places.map(e=>`<th>${PLACE[e]}</th>`).join('')}</tr>`;
  return `<table class="pv${big?' big':''}">${head}${rows.map(([l,n],r)=>`<tr><th>${l}</th>${places.map((e,i)=>{
    const d=big&&e>0&&n<10**e?'':digitAt(n,e),c=`${col(e)}${i===hi?' hi':''}${big&&e===2?' pb':''}${e===0&&places.includes(-1)?' dp':''}`;
    return `<td class="${c}">${tap&&d!==''?`<button type="button" class="pvb" data-row="${r}" data-e="${e}" aria-label="${d}, ${PLACE[e].toLowerCase()} place">${d}</button>`:d}</td>`;
  }).join('')}</tr>`).join('')}</table>`;
}
/* 305020 → "305,020" */
const commas=n=>n.toLocaleString('en-US');
/* ---------- the standard algorithm ---------- */
/* a + b or a − b (a ≥ b), one column at a time from the ones (column 0). Each step: {i, top, bot, cin, val, digit, carry, from, marks}:
   top and bot are the column's digits (top after any regrouping), cin the 1 carried in, val what the column makes (top + bot + cin,
   or top − bot), digit what's written under it (the last column of a sum writes all of val), carry 1 when a sum makes a new ten.
   For −: from is the column a ten was taken from when top was too small (null if none), and marks are the digits rewritten above
   the top number, [{i, v}], zeros in between becoming 9; blank: a zero in front of the difference, not written. */
function algSteps(a,b,op){
  const A=[...String(a)].reverse().map(Number),B=[...String(b)].reverse().map(Number),N=A.length,T=A.slice(),out=[];let c=0;
  for(let i=0;i<Math.max(N,B.length);i++){
    const u=B[i]||0;
    if(op==='+'){const t=T[i]||0,v=t+u+c,last=i===Math.max(N,B.length)-1;out.push({i,top:t,bot:u,cin:c,val:v,digit:last?v:v%10,carry:!last&&v>=10?1:0,from:null,marks:[]});c=v>=10?1:0;continue;}
    let from=null;const marks=[];
    if(T[i]<u){
      let j=i+1;while(T[j]===0)j++;
      from=j;T[j]--;marks.push({i:j,v:T[j]});
      for(let k=j-1;k>i;k--){T[k]=9;marks.push({i:k,v:9});}
      T[i]+=10;marks.push({i,v:T[i]});
    }
    out.push({i,top:T[i],bot:u,cin:0,val:T[i]-u,digit:T[i]-u,carry:0,from,marks});
  }
  /* zeros in front of a difference aren't written */
  if(op==='−')out.forEach(st=>{if(st.i>=String(a-b).length)st.blank=true;});
  return out;
}
/* The algorithm drawn in columns, with the first `done` columns worked: carried 1s (+) or rewritten digits (−) above, and the
   answer's digits below. The next column to work is outlined. A comma sits between the thousands and the hundreds. */
function algFig(a,b,op,done=0,label){
  const S=algSteps(a,b,op),N=Math.max(String(a).length,String(b).length),W=N+(op==='+'&&String(a+b).length>N?1:0),CW=30,G=12,X=40,
    x=i=>X+(W-1-i)*CW+(W>3&&i<3?G:0)+CW/2,Y={mk:22,a:56,b:96,r:150},A=[...String(a)].reverse(),B=[...String(b)].reverse();
  let o='';
  if(done<S.length){const i=S[done].i;o+=`<rect class="acur" x="${x(i)-CW/2+1}" y="4" width="${CW-2}" height="${Y.r+18}" rx="6"/>`;}
  const row=(ds,y,cls='')=>ds.map((d,i)=>`<text class="adg${cls}" x="${x(i)}" y="${y}">${d}</text>`).join('')+(ds.length>3?`<text class="adg${cls}" x="${x(3)+CW/2+G/2}" y="${y+6}">,</text>`:'');
  /* rewritten digits: the latest value in each column, and the original crossed out */
  const mk={};S.slice(0,done).forEach(st=>{st.marks.forEach(m=>{mk[m.i]=m.v;});if(st.carry)mk[st.i+1]=1;});
  o+=row(A,Y.a)+row(B,Y.b)+`<text class="adg" x="${X-18}" y="${Y.b}">${op}</text><line class="aline" x1="${X-30}" y1="${Y.b+22}" x2="${x(0)+CW/2+4}" y2="${Y.b+22}"/>`;
  Object.entries(mk).forEach(([i,v])=>{i=+i;o+=op==='+'?`<text class="amk" x="${x(i)}" y="${Y.mk}">1</text>`:`<line class="axd" x1="${x(i)-10}" y1="${Y.a+10}" x2="${x(i)+10}" y2="${Y.a-12}"/><text class="amk" x="${x(i)}" y="${Y.mk}">${v}</text>`;});
  const R=[];S.slice(0,done).forEach(st=>{if(st.blank)return;const ds=[...String(st.digit)].reverse();ds.forEach((d,k)=>{R[st.i+k]=d;});});
  o+=R.map((d,i)=>d==null?'':`<text class="adg ares" x="${x(i)}" y="${Y.r}">${d}</text>`).join('')+(R.length>3&&R[3]!=null?`<text class="adg ares" x="${x(3)+CW/2+G/2}" y="${Y.r+6}">,</text>`:'');
  return svgWrap(X+W*CW+(W>3?G:0)+12,Y.r+26,o,label||`${commas(a)} ${op==='+'?'plus':'minus'} ${commas(b)} in columns`+(done?`, ${done} column${done>1?'s':''} worked`:''));
}
