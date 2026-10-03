/* Fractions and decimals for K–5 pages: fraction strips, fraction number lines, and hundred grids. Fractions written stacked
   (fr, frT) and part names (PART) are in pictures.js. Styles are in fractions.css. Needs util.js, figures.js (svgWrap), and pictures.js.

   strips(rows, {wholes, W})         fraction strips: wholes cut into d equal parts, k of them shaded, in groups or taken away (svg)
   fracLine(rows, {wholes, …})       number lines from 0 marked in fractions, one under another, with points and tappable ticks (svg)
   hundredGrid(cells)                1 whole as 10 tenths of 10 hundredths, with squares shaded (svg) */
/* Fraction strips, one row under another, every whole the same width so rows line up.
   rows: [{d, k, cls, lab, parts, grp, out}]: each whole cut into d equal parts and the first k shaded (cls 'b' blue, 'g' green; gold by default);
   k more than d draws more wholes. lab: [n, d] written to the left of the row. parts: false leaves 1/d out of the parts.
   grp: the shaded parts in groups of grp (or of each size in a list, like [2, 3]), every other group blue. out: the last `out` shaded parts are taken away (crossed out).
   wholes: how many wholes each row has room for (default: as many as the rows need), so the strips keep their size as k grows.
   stack: a row's wholes go one under another, each as wide as the picture, instead of side by side.
   empty: draw all `wholes` wholes in every row, the ones not reached yet unshaded. */
function strips(rows,{wholes=0,stack=false,empty=false,W=560,label}={}){
  const nW=r=>Math.max(1,Math.ceil(r.k/r.d)),M=Math.max(wholes,...rows.map(nW)),L=rows.some(r=>r.lab)?54:4,G=M>1&&!stack?14:0,
    U=stack?W-L-4:(W-L-4-G*(M-1))/M,H=50,RG=12,lines=stack?M:1;
  let o='';
  rows.forEach((r,ri)=>{
    const y0=4+ri*lines*(H+RG),p=U/r.d,ends=Array.isArray(r.grp)?r.grp.map((g,i)=>r.grp.slice(0,i+1).reduce((a,b)=>a+b)):null,
      blue=j=>r.grp&&(ends?ends.findIndex(e=>j<e):Math.floor(j/r.grp))%2===1;
    if(r.lab)o+=frT(L/2-2,y0+H/2,...r.lab);
    range(empty?M:nW(r)).forEach(w=>range(r.d).forEach(i=>{
      const x=L+(stack?0:w*(U+G))+i*p,y=y0+(stack?w*(H+RG):0),j=w*r.d+i,on=j<r.k,gone=on&&j>=r.k-(r.out||0);
      o+=`<rect class="fs${on?' on '+(blue(j)?'b':r.cls||''):''}${gone?' gone':''}" x="${x}" y="${y}" width="${p}" height="${H}"/>`;
      if(r.parts!==false&&p>=30)o+=frT(x+p/2,y+H/2,1,r.d,on&&!gone?'dk':'');
      if(gone)o+=xOut(x+p/2-8,y+H/2-8,16,16);
    }));
  });
  return svgWrap(W,8+rows.length*lines*(H+RG)-RG,o,label||'Fraction strips: '+rows.map(r=>`${r.k} ${PART[r.d][r.k===1?0:1]}`).join(', '));
}
/* Number lines from 0 to `wholes`, one under another, lined up. rows: [{d, pts, hops, tap, labs}]: a tick every 1/d (tall at whole
   numbers, which get their number); labs: every tick gets its fraction; pts: [{k, cls}] dots at k/d ('b' blue, 'g' green);
   hops: that many jumps of 1/d from 0, or [[from, to, cls], …]: jumps of 1/d from from/d to to/d ('q' blue);
   tap: each tick can be tapped (data-v = its k, data-r = the row).
   marks: [{v, t}] a dashed line through every row at v (in wholes), with t ([n, d] or text) above it. */
function fracLine(rows,{wholes=1,W=480,marks=[],label}={}){
  const X=26,U=(W-2*X)/wholes,top=marks.length?44:rows[0].hops&&rows[0].hops.length!==0?34:18,RH=rows.some(r=>r.labs)?84:64,x=v=>X+v*U,Y=i=>top+18+i*RH;
  let o='';
  marks.forEach(({v,t})=>{o+=`<line class="guide" x1="${x(v)}" y1="${top-4}" x2="${x(v)}" y2="${Y(rows.length-1)+14}"/>`+(Array.isArray(t)?frT(x(v),top-22,...t,'cy'):`<text class="lbl s cy" x="${x(v)}" y="${top-16}">${t}</text>`);});
  rows.forEach((r,ri)=>{
    const y=Y(ri),n=r.d*wholes;
    o+=`<line class="axis" x1="${x(0)-6}" y1="${y}" x2="${x(wholes)+6}" y2="${y}"/>`;
    range(n+1).forEach(k=>{
      const whole=k%r.d===0,tx=x(k/r.d);
      o+=`<line class="tick" x1="${tx}" y1="${y-(whole?11:7)}" x2="${tx}" y2="${y+(whole?11:7)}"/>`;
      if(r.labs&&k)o+=frT(tx,y+32,k,r.d);
      else if(whole)o+=`<text class="lbl" x="${tx}" y="${y+26}">${k/r.d}</text>`;
    });
    (Array.isArray(r.hops)?r.hops:[[0,r.hops||0,'']]).forEach(([f,t,c=''])=>range(t-f).forEach(i=>{const a=x((f+i)/r.d),b=x((f+i+1)/r.d);o+=`<path class="hop${c?' '+c:''}" d="M${a},${y-3}Q${(a+b)/2},${y-3-Math.min(40,(b-a)*.8)} ${b},${y-3}"/>`;}));
    (r.pts||[]).forEach(({k,cls=''})=>{o+=`<circle class="pt ${cls}" cx="${x(k/r.d)}" cy="${y}" r="8"/>`;});
    if(r.tap)range(n+1).forEach(k=>{const w=U/r.d;o+=`<rect class="hit" data-r="${ri}" data-v="${k}" x="${x(k/r.d)-w/2}" y="${y-24}" width="${w}" height="48"/>`;});
  });
  return svgWrap(W,Y(rows.length-1)+RH-26,o,label||`Number line${rows.length>1?'s':''} from 0 to ${wholes}`);
}
/* A hundred grid: 1 whole cut into 10 columns (tenths) of 10 squares (hundredths). cells: a class for each square filled, column by
   column from the top left ('a' gold, 'b' blue), like cellsOf([30, 'a'], [25, 'b']). */
function hundredGrid(cells,{label}={}){
  const C=26,X=4;let o='';
  range(100).forEach(i=>{const c=cells[i];o+=`<rect class="hg${c?' '+c:''}" x="${X+Math.floor(i/10)*C}" y="${X+i%10*C}" width="${C}" height="${C}"/>`;});
  o+=range(9).map(i=>`<line class="hgt" x1="${X+(i+1)*C}" y1="${X}" x2="${X+(i+1)*C}" y2="${X+10*C}"/>`).join('')+`<rect class="hgw" x="${X}" y="${X}" width="${10*C}" height="${10*C}"/>`;
  return svgWrap(10*C+2*X,10*C+2*X,o,label||`A hundred grid with ${cells.filter(Boolean).length} of 100 squares shaded`);
}
