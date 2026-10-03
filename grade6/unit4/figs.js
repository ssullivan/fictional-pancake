/* Fractions and the pictures that Grade 6 Unit 4's game (Fraction Workshop) and its Learn pages both use. Styles are in figs.css.
   Needs util.js, figures.js (svgWrap), and pictures.js (fr, frT, mixed).

   A fraction is a pair [n, d] in lowest terms, with d > 0.
   frac(n, d)                        [n, d] in lowest terms; frac(3) is [3, 1]
   fAdd, fSub, fMul, fDiv (a, b)     a + b, a − b, a × b, a ÷ b, in lowest terms
   fVal(a), fInv(a), isWhole(a)      its value as a number, its reciprocal, and whether it's a whole number
   fx(a), ftx(a)                     written as a whole number, a fraction, or a mixed number: html (stacked), and plain text "4 2/3"
   fim(a)                            written as a fraction even when it's more than 1 (html): 14/3
   cash(n)                           dollars: $6, $4.50
   unitOf(a, [one, many])            the unit for a: 'cup' for 1 or less, 'cups' for more
   fT(x, y, a, {cls, unit})          the same in a picture, centered on x, y (markup)
   groupTape(total, group, {…})      how many groups of `group` are in `total`: one tape, the groups bracketed under it (svg)
   oneGroup(d, k, {…})               one group cut into d equal parts, k of them shaded, with labels above and below (svg)
   rectGrid(w, h, p, {…})            a rectangle w by h tiled in squares 1/p on a side (svg)
   cubeBox(l, w, h, p, {…})          a box l by w by h filled with cubes 1/p on an edge, drawn at an angle (svg) */
const frac=(n,d=1)=>{if(d<0){n=-n;d=-d;}const g=gcd(Math.abs(n),d)||1;return [n/g,d/g];};
const fAdd=([a,b],[c,d])=>frac(a*d+c*b,b*d);
const fSub=([a,b],[c,d])=>frac(a*d-c*b,b*d);
const fMul=([a,b],[c,d])=>frac(a*c,b*d);
const fDiv=([a,b],[c,d])=>frac(a*d,b*c);
const fVal=([n,d])=>n/d;
const fInv=([n,d])=>frac(d,n);
const isWhole=f=>f[1]===1;
const fx=([n,d])=>mixed(n,d);
const ftx=([n,d])=>{const w=Math.floor(n/d),r=n%d;return !r?`${w}`:w?`${w} ${r}/${d}`:`${r}/${d}`;};
const fim=([n,d])=>d===1?`${n}`:fr(n,d);
const cash=n=>'$'+(Number.isInteger(n)?n:n.toFixed(2));
const unitOf=(f,u)=>fVal(f)<=1?u[0]:u[1];

/* a mixed number in a picture: the whole number, then the fraction stacked, then the unit; about 10 px a character */
function fT(x,y,[n,d],{cls='',unit=''}={}){
  const w=Math.floor(n/d),r=n%d,ws=w||!r?String(w):'',fw=r?10+9*Math.max(String(r).length,String(d).length):0,uw=unit?8+unit.length*9:0,
    tw=ws.length*10+(ws&&r?4:0)+fw+uw;let x0=x-tw/2,o='';
  if(ws){o+=`<text class="lbl ${cls}" x="${x0+ws.length*5}" y="${y}">${ws}</text>`;x0+=ws.length*10+(r?4:0);}
  if(r){o+=frT(x0+fw/2,y,r,d,cls);x0+=fw;}
  if(unit)o+=`<text class="lbl s st ${cls}" x="${x0+6}" y="${y}">${unit}</text>`;
  return o;
}

/* How many groups of `group` are in `total` (both fractions): one tape of the wholes, cut into equal parts (the smallest
   denominator that fits both), with the whole numbers above (only every 2nd, 5th, or 10th when they're close). The groups are
   bracketed and numbered under it, every other one blue; a part of a group left at the end is green, with the rest of that group
   dashed past the end and "2/3 of a group" under it.
   upto: how many groups to show (0 for just the tape); parts: false leaves out the lines between parts (just the wholes);
   tell: false leaves out the "2/3 of a group" label (a game hint shows the groups but not the answer); W: width. The tape keeps its size as groups appear. */
function groupTape(total,group,{upto=Infinity,parts=true,tell=true,W=600,label}={}){
  const d=lcm(total[1],group[1]),N=total[0]*d/total[1],g=group[0]*d/group[1],full=Math.floor(N/g),left=N-full*g,
    k=Math.min(upto,full+(left?1:0)),span=left?(full+1)*g:N,X=14,u=(W-2*X)/span,x=i=>X+i*u,Y=40,H=42,lf=frac(left,g);
  let o='';
  range(N).forEach(i=>{const j=Math.floor(i/g);o+=`<rect class="gt${j<k?(j<full?(j%2?' b':' a'):' p'):''}" x="${x(i)}" y="${Y}" width="${u}" height="${H}"/>`;});
  if(left&&k>full)range(g-left).forEach(i=>{o+=`<rect class="gt gh" x="${x(N+i)}" y="${Y}" width="${u}" height="${H}"/>`;});
  if(u>=5&&parts)range(N+1).forEach(i=>{if(i%d)o+=`<line class="gt-part" x1="${x(i)}" y1="${Y}" x2="${x(i)}" y2="${Y+H}"/>`;});
  const every=[1,2,5,10].find(k=>k*u*d>=24)||20;
  range(Math.floor(N/d)+1).forEach(i=>{o+=`<line class="gt-whole" x1="${x(i*d)}" y1="${Y-6}" x2="${x(i*d)}" y2="${Y+H+6}"/>`+(i%every?'':`<text class="lbl s" x="${x(i*d)}" y="${Y-15}">${i}</text>`);});
  if(N%d)o+=`<line class="gt-whole" x1="${x(N)}" y1="${Y-6}" x2="${x(N)}" y2="${Y+H+6}"/>`+fT(x(N),Y-20,total,{cls:'cy'});
  const yb=Y+H+10;
  range(k).forEach(j=>{
    const a=x(j*g)+2,b=x(Math.min((j+1)*g,N))-2,m=(a+b)/2;
    o+=`<path class="gt-br${j<full?'':' p'}" d="M${a},${yb}v6H${b}v-6"/>`;
    if(j<full){if(b-a>=16||j===0||j===full-1)o+=`<text class="lbl s" x="${m}" y="${yb+20}">${j+1}</text>`;}
    else if(tell)o+=frT(m,yb+26,lf[0],lf[1],'gn')+`<text class="lbl s gn" x="${Math.min(Math.max(m,64),W-64)}" y="${yb+52}">of a group</text>`;
  });
  const lab=label||`Tape diagram: ${ftx(total)} cut into parts of 1/${d}, with ${k} group${k===1?'':'s'} of ${ftx(group)} marked`;
  return svgWrap(W,Y+H+(left&&k>full?74:k?42:14),o,lab);
}

/* One group (a pitcher, a batch, a board) cut into d equal parts, the first k shaded. Labels are text, or a fraction with a
   unit: [[n, d], 'cups']. top: over the shaded parts; each: inside every part (or inside the shaded ones with eachShaded);
   whole: under the whole tape; q: 'top', 'each', or 'whole' puts the gold "?" there instead. */
function oneGroup(d,k,{top=null,each=null,eachShaded=false,whole=null,q=null,W=520,label}={}){
  const X=14,u=(W-2*X)/d,x=i=>X+i*u,Y=52,H=46;
  const say=(lab,cx,cy,cls='')=>Array.isArray(lab)?fT(cx,cy,lab[0],{cls,unit:lab[1]}):`<text class="lbl ${cls}" x="${cx}" y="${cy}">${lab}</text>`;
  let o='';
  range(d).forEach(i=>{o+=`<rect class="gt${i<k?' a':''}" x="${x(i)}" y="${Y}" width="${u}" height="${H}"/>`;});
  range(d-1).forEach(i=>{o+=`<line class="gt-sep" x1="${x(i+1)}" y1="${Y}" x2="${x(i+1)}" y2="${Y+H}"/>`;});
  o+=`<rect class="gt-out" x="${x(0)}" y="${Y}" width="${d*u}" height="${H}"/>`;
  if(each!==null||q==='each')range(eachShaded?k:d).forEach(i=>{o+=q==='each'&&i===0?qbox(x(i)+u/2,Y+H/2):say(each??'',x(i)+u/2,Y+H/2,q==='each'?'dm':'');});
  if(k&&(top!==null||q==='top')){
    o+=`<path class="gt-br" d="M${x(0)+2},${Y-8}v-6H${x(k)-2}v6"/>`;
    o+=q==='top'?qbox((x(0)+x(k))/2,Y-30):say(top,(x(0)+x(k))/2,Y-30,'cy');
  }
  if(whole!==null||q==='whole'){
    o+=`<path class="gt-br" d="M${x(0)+2},${Y+H+8}v6H${x(d)-2}v-6"/>`;
    o+=q==='whole'?qbox((x(0)+x(d))/2,Y+H+36):say(whole,(x(0)+x(d))/2,Y+H+36);
  }
  return svgWrap(W,Y+H+60,o,label||`Tape diagram: one group cut into ${d} equal parts, ${k} of them shaded`);
}

/* A rectangle w by h (fractions) tiled in squares 1/p on a side, with bold lines at every whole unit and its sides labeled.
   shade: how many columns of small squares to shade gold, left to right (default all). unit: for the side labels. */
function rectGrid(w,h,p,{shade=Infinity,unit='in',label}={}){
  const cols=w[0]*p/w[1],rows=h[0]*p/h[1],c=Math.min(30,440/cols,260/rows),X=70,Y=12,x=i=>X+i*c,y=j=>Y+j*c;
  let o='';
  range(cols).forEach(i=>range(rows).forEach(j=>{o+=`<rect class="rg${i<shade?' on':''}" x="${x(i)}" y="${y(j)}" width="${c}" height="${c}"/>`;}));
  range(Math.floor(cols/p)+1).forEach(i=>{o+=`<line class="rg-whole" x1="${x(i*p)}" y1="${y(0)}" x2="${x(i*p)}" y2="${y(rows)}"/>`;});
  range(Math.floor(rows/p)+1).forEach(j=>{o+=`<line class="rg-whole" x1="${x(0)}" y1="${y(rows-j*p)}" x2="${x(cols)}" y2="${y(rows-j*p)}"/>`;});
  o+=`<rect class="rg-out" x="${x(0)}" y="${y(0)}" width="${cols*c}" height="${rows*c}"/>`;
  o+=fT(x(cols/2),y(rows)+24,w,{unit})+fT(X-34,y(rows/2),h,{unit});
  return svgWrap(x(cols)+16,y(rows)+44,o,label||`A rectangle ${ftx(w)} by ${ftx(h)} ${unit}, tiled in squares 1/${p} ${unit} on a side`);
}

/* A box l wide, w deep, and h tall (fractions) filled with cubes 1/p on an edge: the front, top, and right faces drawn at an
   angle with a line between every cube, bold lines at every whole unit, and the edges labeled. */
function cubeBox(l,w,h,p,{unit='in',label}={}){
  const nl=l[0]*p/l[1],nw=w[0]*p/w[1],nh=h[0]*p/h[1],c=Math.min(34,300/(nl+nw*.6),200/(nh+nw*.45)),ox=c*.6,oy=c*.45,
    X=56,Y=14+nw*oy,P=(a,b,k)=>[X+a*c+k*ox,Y+nh*c-b*c-k*oy];
  const pt=([a,b])=>`${a.toFixed(1)},${b.toFixed(1)}`,face=(cls,ps)=>`<polygon class="${cls}" points="${ps.map(pt).join(' ')}"/>`,
    line=(a,b,cls)=>`<line class="${cls}" x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"/>`;
  let o=face('cb f',[P(0,0,0),P(nl,0,0),P(nl,nh,0),P(0,nh,0)])+face('cb t',[P(0,nh,0),P(nl,nh,0),P(nl,nh,nw),P(0,nh,nw)])+face('cb r',[P(nl,0,0),P(nl,0,nw),P(nl,nh,nw),P(nl,nh,0)]);
  const cls=i=>i%p?'cb-l':'cb-w';
  range(nl+1).forEach(i=>{o+=line(P(i,0,0),P(i,nh,0),cls(i))+line(P(i,nh,0),P(i,nh,nw),cls(i));});
  range(nh+1).forEach(j=>{o+=line(P(0,j,0),P(nl,j,0),cls(j))+line(P(nl,j,0),P(nl,j,nw),cls(j));});
  range(nw+1).forEach(k=>{o+=line(P(0,nh,k),P(nl,nh,k),cls(k))+line(P(nl,0,k),P(nl,nh,k),cls(k));});
  const [bx,by]=P(nl/2,0,0),[hx,hy]=P(0,nh/2,0),[dx,dy]=P(nl,0,nw/2);
  o+=fT(bx,by+22,l,{unit})+fT(hx-30,hy,h,{unit})+fT(dx+36,dy+8,w,{unit});
  const [rx]=P(nl,0,nw);
  return svgWrap(rx+90,Y+nh*c+42,o,label||`A box ${ftx(l)} by ${ftx(w)} by ${ftx(h)} ${unit} filled with cubes 1/${p} ${unit} on an edge`);
}
