/* Mix Masters (Grade 6 Unit 2): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs. */
const fmt=n=>(Math.round(n*100)/100).toLocaleString('en-US');
const money=n=>'$'+n.toFixed(2);
const pl=(w,n)=>`${fmt(n)} ${w[n===1?0:1]}`;

/* ---------- shapes for diagrams ---------- */
const STAR=[[12,2],[15,9],[22.5,9.3],[16.6,14],[18.7,21.5],[12,17.2],[5.3,21.5],[7.4,14],[1.5,9.3],[9,9]];
const SHAPES=[
  {one:'circle',many:'circles',d:(x,y,s)=>`<circle class="ic-a" cx="${x+s/2}" cy="${y+s/2}" r="${s/2-2}"/>`},
  {one:'square',many:'squares',d:(x,y,s)=>`<rect class="ic-b" x="${x+2}" y="${y+2}" width="${s-4}" height="${s-4}" rx="3"/>`},
  {one:'triangle',many:'triangles',d:(x,y,s)=>`<polygon class="ic-c" points="${x+s/2},${y+2} ${x+s-2},${y+s-2} ${x+2},${y+s-2}"/>`},
  {one:'star',many:'stars',d:(x,y,s)=>`<polygon class="ic-d" points="${STAR.map(p=>`${x+p[0]*s/24},${y+p[1]*s/24}`).join(' ')}"/>`}
];
const nm=(sh,n)=>n===1?sh.one:sh.many;
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

/* ---------- Station 1: ratio language ---------- */
function genLang(){
  const [A,B]=shuffle(SHAPES).slice(0,2);
  const type=pick(['write','write','sentence','sentence','pick','total']);
  if(type==='write'){
    let nA=R(2,9),nB=R(2,9);while(nB===nA)nB=R(2,9);
    const [P,Q,p,q]=Math.random()<.5?[A,B,nA,nB]:[B,A,nB,nA],g=gcd(p,q);
    return {kind:'pair',labels:[P.many,Q.many],answer:[p,q],equiv:true,
      fig:()=>rowsDiagram([{sh:A,n:nA},{sh:B,n:nB}]),
      prompt:`Write the ratio of <b>${P.many}</b> to <b>${Q.many}</b>.`,
      hint:`Count each kind of shape. The first number goes with the first thing named: ${P.many}.`,
      pmisc:[[[q,p],`Order matters. “${P.many} to ${Q.many}” means the number of ${P.many} comes first.`],[[p,p+q],`That compares ${P.many} to all the shapes. This asks for ${P.many} to ${Q.many}.`]],
      explain:`There are ${p} ${P.many} and ${q} ${Q.many}, so the ratio is ${p} : ${q}.${g>1?` The equivalent ratio ${p/g} : ${q/g} is also correct.`:''}`};
  }
  if(type==='total'){
    let nA=R(2,7),nB=R(2,7);while(nB===nA)nB=R(2,7);
    return {kind:'pair',labels:[A.many,'all shapes'],answer:[nA,nA+nB],equiv:true,
      fig:()=>rowsDiagram([{sh:A,n:nA},{sh:B,n:nB}]),
      prompt:`Write the ratio of <b>${A.many}</b> to <b>all the shapes</b>.`,
      hint:`“All the shapes” means the total. Add the ${A.many} and the ${B.many}.`,
      pmisc:[[[nA,nB],`That is ${A.many} to ${B.many}. This one asks for ${A.many} to <i>all</i> the shapes, including the ${A.many}.`],[[nA+nB,nA],'Order matters. The number of '+A.many+' comes first.']],
      explain:`${nA} ${A.many} out of ${nA} + ${nB} = ${nA+nB} shapes. The ratio is ${nA} : ${nA+nB}.`};
  }
  let a=R(1,4),b=R(1,5);while(b===a)b=R(1,5);
  if(type==='sentence'){
    const k=R(2,3),are=n=>n===1?'is':'are';
    const right=pick([`For every ${a} ${nm(A,a)}, there ${are(b)} ${b} ${nm(B,b)}.`,`The ratio of ${A.many} to ${B.many} is ${a*k} : ${b*k}.`]);
    const wrong=[
      {t:`For every ${b} ${nm(A,b)}, there ${are(a)} ${a} ${nm(B,a)}.`,why:'The numbers are switched. Count each shape inside one dashed group.'},
      {t:`The ratio of ${B.many} to ${A.many} is ${a*k} : ${b*k}.`,why:`This names ${B.many} first, so the number of ${B.many} has to come first.`},
      {t:`The ratio of ${A.many} to ${B.many} is ${a} : ${a+b}.`,why:`${a+b} is how many shapes are in one whole group, not how many ${B.many}.`}
    ];
    const cs=shuffle([{t:right,ok:1},...wrong]),why={};let ans;
    const choices=cs.map((c,i)=>{const id='abcd'[i];if(c.ok)ans=id;else why[id]=c.why;return {id,label:c.t};});
    return {kind:'mc',stack:true,choices,answer:ans,why,
      fig:()=>rowsDiagram([{sh:A,n:a*k},{sh:B,n:b*k}],{groups:k}),
      prompt:'Which sentence describes this diagram correctly?',
      hint:'Each dashed box is one group. Count the shapes of each kind inside one box.',
      explain:`Each group has ${a} ${nm(A,a)} and ${b} ${nm(B,b)}. With ${k} groups there are ${a*k} ${A.many} and ${b*k} ${B.many}. ${a*k} : ${b*k} is equivalent to ${a} : ${b}.`};
  }
  const opts=shuffle([{p:[a,b],ok:1},{p:[b,a],why:`That diagram has ${b} ${nm(A,b)} and ${a} ${nm(B,a)}: the numbers are switched.`},{p:[a,a+b],why:`That diagram has ${a+b} ${B.many}. The ratio asks for ${b}.`},{p:[a+1,b],why:`That diagram has ${a+1} ${A.many}. Count again.`}]);
  const why={};let ans;
  const choices=opts.map((o,i)=>{const id='abcd'[i];if(o.ok)ans=id;else why[id]=o.why;return {id,label:rowsDiagram([{sh:A,n:o.p[0]},{sh:B,n:o.p[1]}],{s:22,label:`${o.p[0]} ${nm(A,o.p[0])} and ${o.p[1]} ${nm(B,o.p[1])}`})};});
  return {kind:'mc',choices,answer:ans,why,
    prompt:`Which diagram shows a ratio of <b>${a} ${nm(A,a)} to ${b} ${nm(B,b)}</b>?`,
    hint:`Find the diagrams with exactly ${a} ${nm(A,a)} first. Then check the ${B.many}.`,
    explain:`The right diagram has ${a} ${nm(A,a)} and ${b} ${nm(B,b)}. The first number in a ratio goes with the first thing named.`};
}

/* ---------- Station 2: recipes & color mixtures ---------- */
const RECIPES=[
  {dish:'lemonade',x:['cup of lemon juice','cups of lemon juice'],y:['cup of water','cups of water']},
  {dish:'pancakes',x:['cup of flour','cups of flour'],y:['egg','eggs']},
  {dish:'trail mix',x:['cup of peanuts','cups of peanuts'],y:['cup of raisins','cups of raisins']},
  {dish:'fruit punch',x:['cup of mango juice','cups of mango juice'],y:['cup of orange juice','cups of orange juice']},
  {dish:'granola',x:['cup of oats','cups of oats'],y:['spoonful of honey','spoonfuls of honey']}
];
function batchDiagram(a,b,n,rec,A=SHAPES[0],B=SHAPES[1]){
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
const mixColor=(bl,ye)=>{const t=ye/(bl+ye);return `hsl(${Math.round(225-t*170)} 72% ${Math.round(42+t*16)}%)`;};
function genEquiv(){
  const type=pick(['batch','scale','scale','color','color','yesno','missing']);
  if(type==='batch'||type==='scale'){
    const rec=pick(RECIPES);let a=R(1,4),b=R(2,6);while(b===a)b=R(2,6);const n=R(2,5);
    const fig=show=>batchDiagram(a,b,show?n:1,rec);
    if(type==='batch')return {kind:'num',unit:rec.y[1],answer:n*b,fig,
      prompt:`One batch of ${rec.dish} uses ${pl(rec.x,a)} and ${pl(rec.y,b)}. How many ${rec.y[1]} are in <b>${n} batches</b>?`,
      hint:`Picture ${n} copies of the batch. Each one has ${pl(rec.y,b)}.`,
      misc:[[b+n,`Each batch has ${b}, so ${n} batches is ${n} groups of ${b}. Multiply.`],[n*a,`That is the ${rec.x[1]}. The question asks for ${rec.y[1]}.`]],
      explain:`${n} batches × ${b} = ${n*b} ${rec.y[1]}. The ratio ${a} : ${b} becomes ${n*a} : ${n*b}.`};
    return {kind:'num',unit:rec.y[1],answer:n*b,fig,
      prompt:`A recipe for ${rec.dish} uses ${pl(rec.x,a)} for every ${pl(rec.y,b)}. Jada uses <b>${pl(rec.x,n*a)}</b>. How many ${rec.y[1]} does she need so it tastes the same?`,
      hint:`${n*a} is ${n} × ${a}, so Jada is making ${n} batches. Multiply the ${rec.y[1]} by ${n} too.`,
      misc:[[b+(n*a-a),`You added ${n*a-a} to both amounts. To keep the same taste, <b>multiply</b> both amounts by the same number.`],[n*a*b,`${n*a} ${rec.x[1]} is ${n} batches, not ${n*a}. Divide ${n*a} by ${a} first.`]],
      explain:`${n*a} ÷ ${a} = ${n} batches. ${b} × ${n} = ${n*b} ${rec.y[1]}. ${a} : ${b} and ${n*a} : ${n*b} are equivalent.`};
  }
  let a=R(1,5),b=R(1,5);while(b===a)b=R(1,5);const k=R(2,4);
  if(type==='color'){
    const opts=shuffle([
      {p:[k*a,k*b],ok:1},
      {p:[k*a,b+(k-1)*a],why:`${(k-1)*a} cups were added to both colors. Adding the same amount changes the shade. Multiply both amounts by ${k} instead.`},
      {p:[k*b,k*a],why:'Blue and yellow are switched, so this shade has more of the other color.'},
      {p:[k*a,b],why:`Only the blue was multiplied by ${k}. The yellow has to be multiplied by ${k} too.`}
    ]);
    const why={};let ans;
    const choices=opts.map((o,i)=>{const id='ABCD'[i];if(o.ok)ans=id;else why[id]=o.why;return {id,label:`${id}. ${o.p[0]} blue : ${o.p[1]} yellow`,p:o.p};});
    const fig=show=>{
      let out=`<text class="ftxt" x="10" y="22">Target mix</text>`;
      for(let q=0;q<a;q++)out+=`<circle class="ic-blue" cx="${24+q*30}" cy="48" r="12"/>`;
      for(let q=0;q<b;q++)out+=`<circle class="ic-yel" cx="${24+(a+q)*30+12}" cy="48" r="12"/>`;
      out+=`<text class="ftxt" x="10" y="88">${a} cup${a>1?'s':''} blue : ${b} cup${b>1?'s':''} yellow</text>`;
      let w=Math.max(360,(a+b)*30+60);
      if(show){
        out+=`<rect class="swatch" x="10" y="104" width="64" height="44" rx="8" fill="${mixColor(a,b)}"/><text class="ftxt mid" x="42" y="168">target</text>`;
        choices.forEach((c,i)=>{const x=94+i*76;out+=`<rect class="swatch" x="${x}" y="104" width="64" height="44" rx="8" fill="${mixColor(...c.p)}"/><text class="ftxt mid" x="${x+32}" y="168">${c.id}</text>`;});
        w=Math.max(w,94+4*76);
      }
      return svgWrap(w,show?180:100,out,'Paint mixture');
    };
    return {kind:'mc',choices,answer:ans,why,fig,
      prompt:'Which mixture makes <b>the same shade</b> as the target mix?',
      hint:'Same shade means an equivalent ratio: both colors multiplied by the same number. The swatches show each mix.',
      explain:`${a} × ${k} = ${k*a} and ${b} × ${k} = ${k*b}. ${k*a} : ${k*b} is ${k} batches of the target mix, so it is the same shade.`};
  }
  if(type==='yesno'){
    const eq=Math.random()<.5;
    const [c,d,why]=eq?[k*a,k*b]:pick([
      [a+k,b+k,`Adding ${k} to both numbers does not keep the ratio the same.`],
      [k*a,k*b+pick([1,-1]),`${a} was multiplied by ${k}, but ${b} was not.`],
      [k*a,(k+1)*b,`${a} was multiplied by ${k}, but ${b} was multiplied by ${k+1}.`]
    ]);
    return {kind:'mc',choices:[{id:'y',label:'Yes, equivalent'},{id:'n',label:'No, not equivalent'}],answer:eq?'y':'n',
      why:{y:why||'',n:`Both numbers were multiplied by ${k}, so they are equivalent.`},
      prompt:`Are <b>${a} : ${b}</b> and <b>${c} : ${d}</b> equivalent ratios?`,
      explain:eq?`${a} × ${k} = ${c} and ${b} × ${k} = ${d}. Both parts are multiplied by the same number.`:`To get from ${a} to ${c} you multiply by ${fmt(c/a)}. But ${b} × ${fmt(c/a)} = ${fmt(b*c/a)}, not ${d}.`};
  }
  const left=Math.random()<.5;
  return {kind:'num',unit:'',answer:left?k*a:k*b,
    prompt:left?`<b>? : ${k*b}</b> is equivalent to <b>${a} : ${b}</b>. What is the missing number?`:`<b>${a} : ${b}</b> is equivalent to <b>${k*a} : ?</b>. What is the missing number?`,
    hint:left?`What do you multiply ${b} by to get ${k*b}? Do the same to ${a}.`:`What do you multiply ${a} by to get ${k*a}? Do the same to ${b}.`,
    misc:left?[[a+(k*b-b),'You added the same amount. For equivalent ratios, multiply both numbers by the same number.']]:[[b+(k*a-a),'You added the same amount. For equivalent ratios, multiply both numbers by the same number.']],
    explain:`Both numbers are multiplied by ${k}: ${a} : ${b} = ${k*a} : ${k*b}.`};
}

function genDnl(){
  const type=pick(['mult','mult','unit','speed','speed']);
  if(type==='mult'){
    const rec=pick(RECIPES);let a=R(2,5),b=R(2,9);while(b===a)b=R(2,9);
    const m=R(4,6),j=R(3,m),rev=Math.random()<.3;
    const ticks=[];for(let i=0;i<=m;i++)ticks.push({t:i*a,b:i*b,st:rev&&i===j?0:(rev?(i<=1?1:2):1),sb:!rev&&i===j?0:(rev?1:(i<=1?1:2)),q:i===j?(rev?'t':'b'):null});
    const [ansN,units,other]=rev?[j*a,rec.x[1],rec.y[1]]:[j*b,rec.y[1],rec.x[1]];
    const given=rev?j*b:j*a;
    return {kind:'num',unit:units,answer:ansN,fig:dnl(rec.x[1],rec.y[1],ticks),
      prompt:`A ${rec.dish} recipe uses ${pl(rec.x,a)} for every ${pl(rec.y,b)}. How many ${units} go with <b>${given} ${other}</b>?`,
      hint:`Each tick adds one more batch: ${a} more on top and ${b} more on the bottom. The hint fills in the ticks.`,
      misc:[[rev?a+(j*b-b):b+(j*a-a),'You added the same amount to both lines. Every step adds a full batch: '+a+' on top and '+b+' on the bottom.']],
      explain:`${given} is ${j} batches (${j} × ${rev?b:a}). ${j} × ${rev?a:b} = ${ansN} ${units}.`};
  }
  if(type==='unit'){
    const item=pick([['pound of apples','pounds of apples'],['bag of rice','bags of rice'],['notebook','notebooks'],['bottle of water','bottles of water']]);
    const a=R(2,6),u=pick([.5,.75,1.25,1.5,2,2.5,3,3.5,4.5]),c=a*u;
    const ticks=[];for(let i=0;i<=a;i++)ticks.push({t:i,b:i*u,st:1,sb:i===0||i===a?1:0,q:i===1?'b':null});
    return {kind:'num',unit:'dollars',answer:u,fig:dnl(item[1],'cost (dollars)',ticks,{fb:money}),
      prompt:`${pl(item,a)} cost ${money(c)}. <b>How much for one?</b>`,
      hint:`The cost is split equally among ${a} ${item[1]}. Divide ${money(c)} by ${a}.`,
      misc:[[a/c,`That is how many ${item[1]} you get for one dollar. Divide the cost by the number of ${item[1]}.`],[c*a,`Multiplying makes it bigger. One ${item[0]} should cost less than ${a} of them.`]],
      explain:`${money(c)} ÷ ${a} = ${money(u)} for one ${item[0]}. This is called the unit price.`};
  }
  const who=pick(['A scooter','A turtle robot','A train','A skateboarder','A toy car']);
  const t0=R(2,5),v=R(2,9),T=pick([...Array(11).keys()].filter(x=>x>t0&&x%t0&&x<=10)),d0=t0*v;
  const ticks=[];for(let i=0;i<=T;i++)ticks.push({t:i,b:i*v,st:1,sb:i===0||i===t0?1:(i===T?0:(i===1?2:0)),q:i===T?'b':null});
  return {kind:'num',unit:'meters',answer:v*T,fig:dnl('time (seconds)','distance (meters)',ticks),
    prompt:`${who} moves at a constant speed. It goes ${d0} meters in ${t0} seconds. How far does it go in <b>${T} seconds</b>?`,
    hint:`Find how far it goes in 1 second first: ${d0} ÷ ${t0}. Then multiply by ${T}.`,
    misc:[[d0+(T-t0),`Each extra second adds ${v} meters, not 1. Find the distance for 1 second first.`],[d0*T,`${d0} meters is for ${t0} seconds, not 1. Divide by ${t0} first.`]],
    explain:`${d0} ÷ ${t0} = ${v} meters per second. ${v} × ${T} = ${v*T} meters.`};
}

/* ---------- Station 4: tables ---------- */
const TCTX=[
  {hx:'Minutes',hy:'Pages read',s:'Priya reads at a constant rate.',ux:'minutes',uy:'pages',ra:[2,3,4,5],rr:[2,3,4]},
  {hx:'Hours worked',hy:'Dollars earned',s:'Andre earns the same amount each hour.',ux:'hours',uy:'dollars',ra:[2,3,4,5],rr:[8,9,12,15,10.5]},
  {hx:'Gallons of gas',hy:'Miles driven',s:'A car uses gas at a constant rate.',ux:'gallons',uy:'miles',ra:[2,3,4],rr:[25,30,32,35]},
  {hx:'Cups of flour',hy:'Muffins',s:'A muffin recipe always uses flour at the same rate.',ux:'cups of flour',uy:'muffins',ra:[2,3,4],rr:[6,8,12]},
  {hx:'Bags of soil',hy:'Plants potted',s:'Kiran pots plants using the same amount of soil for each group.',ux:'bags',uy:'plants',ra:[2,3,4,5],rr:[4,5,6]}
];
function genTable(){
  const c=pick(TCTX),a=pick(c.ra),r=pick(c.rr),b=a*r;
  const type=pick(['scale','unit','unit','rev']);
  if(type==='scale'){
    const k=R(3,9),k2=pick([2,10].filter(z=>z!==k));
    const rows=[{x:a,y:b},{x:k2*a,y:k2*b},{x:k*a,y:k*b,q:'y',note:`× ${k} from the first row`}];
    return {kind:'num',unit:c.uy,answer:k*b,fig:tableFig(c,rows),
      prompt:`${c.s} How many ${c.uy} for <b>${k*a} ${c.ux}</b>?`,
      hint:`${k*a} is ${k} × ${a}. Multiply the other column by ${k} too.`,
      misc:[[b+(k*a-a),'You added. In a table of equivalent ratios, both columns are multiplied by the same number.']],
      explain:`${k*a} ÷ ${a} = ${k}. ${b} × ${k} = ${fmt(k*b)} ${c.uy}.`};
  }
  const X=pick([...Array(12).keys()].filter(x=>x>1&&x%a&&x!==a));
  if(type==='unit'){
    const rows=[{x:a,y:b,note:''},{x:1,y:r,h:1,note:`÷ ${a}`},{x:X,y:X*r,q:'y',note:`× ${X}`}];
    return {kind:'num',unit:c.uy,answer:X*r,fig:tableFig(c,rows),
      prompt:`${c.s} How many ${c.uy} for <b>${X} ${c.ux}</b>?`,
      hint:`${X} is not a multiple of ${a}. Go through 1 first: divide both columns by ${a}, then multiply by ${X}.`,
      misc:[[b+(X-a),'You added the same amount to both columns. Find the row for 1 first.'],[X*b,`${fmt(b)} is for ${a} ${c.ux}, not 1. Divide by ${a} first.`]],
      explain:`${fmt(b)} ÷ ${a} = ${fmt(r)} ${c.uy} for 1. ${fmt(r)} × ${X} = ${fmt(X*r)} ${c.uy}.`};
  }
  const k=R(2,8),rows=[{x:a,y:b},{x:1,y:r,h:1,note:`÷ ${a}`},{x:k*a,y:k*b,q:'x',note:`× ${k} from the first row`}];
  return {kind:'num',unit:c.ux,answer:k*a,fig:tableFig(c,rows),
    prompt:`${c.s} How many ${c.ux} for <b>${fmt(k*b)} ${c.uy}</b>?`,
    hint:`What do you multiply ${fmt(b)} by to get ${fmt(k*b)}? Multiply ${a} by the same number.`,
    misc:[[a+(k*b-b),'You added. Multiply both columns by the same number.'],[k*b,`That is the number of ${c.uy}. The question asks for ${c.ux}.`]],
    explain:`${fmt(k*b)} ÷ ${fmt(b)} = ${k}. ${a} × ${k} = ${k*a} ${c.ux}.`};
}

/* ---------- Station 5: part-part-whole (tape diagrams) ---------- */
const PCTX=[
  {A:'red beads',B:'blue beads',all:'beads'},
  {A:'students who walk',B:'students who ride the bus',all:'students'},
  {A:'cups of juice',B:'cups of sparkling water',all:'cups of punch'},
  {A:'dogs',B:'cats',all:'animals at the shelter'},
  {A:'chocolate chip cookies',B:'oatmeal cookies',all:'cookies'}
];
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
function genPpw(){
  const c=pick(PCTX);let a=R(1,5),b=R(1,5);while(b===a)b=R(1,5);const k=R(2,12),T=k*(a+b);
  const type=pick(['part','part','total','other','diff']);
  const ratio=`The ratio of ${c.A} to ${c.B} is <b>${a} : ${b}</b>.`;
  const hint=`The tape diagram has ${a+b} equal boxes in all. Find what one box is worth, then use it.`;
  if(type==='part'){
    const wantA=Math.random()<.5,[n,name,other]=wantA?[a,c.A,c.B]:[b,c.B,c.A];
    return {kind:'num',unit:name,answer:k*n,fig:tapeFig(c,a,b,k,{qa:wantA,qb:!wantA,showT:1}),
      prompt:`${ratio} There are ${T} ${c.all} in all. How many are <b>${name}</b>?`,hint,
      misc:[[k,`That is one box. The ${name} take up ${n} boxes.`],[T/2,`The two parts are not equal. Split ${T} into ${a+b} equal boxes.`],[k*(a+b-n),`That is the number of ${other}.`],[T/n,`Divide the total by the number of boxes in all (${a+b}), not by ${n}.`]],
      explain:`${a} + ${b} = ${a+b} boxes. ${T} ÷ ${a+b} = ${k} in each box. ${n} × ${k} = ${k*n} ${name}.`};
  }
  if(type==='total')return {kind:'num',unit:c.all,answer:T,fig:tapeFig(c,a,b,k,{showA:1,qt:1}),
    prompt:`${ratio} There are ${k*a} ${c.A}. How many ${c.all} are there <b>in all</b>?`,hint,
    misc:[[k*b,`That is only the ${c.B}. Add the ${c.A} too.`],[k*a+b,`${b} is the number of boxes, not the number of ${c.B}. Find what one box is worth first.`],[k*a*(a+b),`${k*a} is ${a} boxes. Divide by ${a} to get one box.`]],
    explain:`${k*a} ÷ ${a} = ${k} in each box. ${a+b} boxes × ${k} = ${T} ${c.all}.`};
  if(type==='other')return {kind:'num',unit:c.B,answer:k*b,fig:tapeFig(c,a,b,k,{showA:1,qb:1}),
    prompt:`${ratio} There are ${k*a} ${c.A}. How many <b>${c.B}</b> are there?`,hint:`${k*a} fills ${a} boxes. Find one box, then fill ${b} boxes.`,
    misc:[[k*a+(b-a),'You added the difference in the ratio. Find what one box is worth instead.'],[T,'That is the total. The question asks only for the '+c.B+'.']],
    explain:`${k*a} ÷ ${a} = ${k} in each box. ${b} × ${k} = ${k*b} ${c.B}.`};
  if(a>b)[a,b]=[b,a];
  return {kind:'num',unit:'more',answer:k*(b-a),fig:tapeFig(c,a,b,k,{showT:1}),
    prompt:`The ratio of ${c.A} to ${c.B} is <b>${a} : ${b}</b>. There are ${T} ${c.all} in all. How many <b>more</b> ${c.B} than ${c.A} are there?`,hint,
    misc:[[b-a,`The ${c.B} have ${b-a} more <i>boxes</i>. Each box is worth ${k}.`],[k*b,`That is how many ${c.B} there are. Subtract the ${c.A}.`]],
    explain:`${T} ÷ ${a+b} = ${k} in each box. ${c.B}: ${k*b}, ${c.A}: ${k*a}. ${k*b} − ${k*a} = ${k*(b-a)} more.`};
}

/* ---------- Station 6: comparing ---------- */
const NAMES=[['Noah','Priya'],['Lin','Andre'],['Kiran','Jada'],['Mai','Diego'],['Elena','Tyler']];
function cmpMc(prompt,labels,va,vb,bigger,explain,trapWhy,hint){
  // bigger: true if the larger value wins
  const win=va===vb?'S':((va>vb)===bigger?'A':'B');
  const choices=[{id:'A',label:labels[0]},{id:'B',label:labels[1]},{id:'S',label:labels[2]}];
  const why={A:trapWhy,B:trapWhy,S:'They are not the same. Compare the amount for one.'};
  if(win==='S')why.A=why.B='Find the amount for one in each. They come out the same.';
  return {kind:'mc',choices,answer:win,why,prompt,explain,hint};
}
function genCompare(){
  const type=pick(['price','price','speed','mix','unitp']);
  if(type==='price'||type==='unitp'){
    const item=pick([['can of soup','cans of soup'],['granola bar','granola bars'],['notebook','notebooks'],['bottle of water','bottles of water']]);
    let n1=R(2,8),n2=R(2,8);while(n2===n1)n2=R(2,8);
    const U=[.4,.5,.6,.75,.8,1.2,1.25,1.5];const u1=pick(U),u2=Math.random()<.2?u1:pick(U.filter(x=>x!==u1));
    if(type==='unitp')return {kind:'num',unit:'dollars',answer:u1,
      prompt:`A store sells ${pl(item,n1)} for ${money(n1*u1)}. What is the <b>price for one</b> ${item[0]}?`,
      hint:`Share the cost equally: ${money(n1*u1)} ÷ ${n1}.`,
      misc:[[n1/(n1*u1),`That is ${item[1]} per dollar. Divide the cost by the number of ${item[1]}.`]],
      explain:`${money(n1*u1)} ÷ ${n1} = ${money(u1)} for each ${item[0]}.`};
    return cmpMc(`<b>Store A:</b> ${pl(item,n1)} for ${money(n1*u1)}<br><b>Store B:</b> ${pl(item,n2)} for ${money(n2*u2)}<br>Which is the better deal?`,
      ['Store A','Store B','Same deal'],u1,u2,false,
      `Price for one: Store A ${money(n1*u1)} ÷ ${n1} = ${money(u1)}. Store B ${money(n2*u2)} ÷ ${n2} = ${money(u2)}. ${u1===u2?'Same price for one.':`The lower price for one wins: Store ${u1<u2?'A':'B'}.`}`,
      'The store with the lower total isn’t always the better deal. Compare the price for one.',
      'Find the price for one at each store. The lower one is the better deal.');
  }
  if(type==='speed'){
    const [p,q]=shuffle(pick(NAMES));
    let v1=R(2,8),v2=R(2,8);if(Math.random()<.8)while(v2===v1)v2=R(2,8);
    let t1=R(3,12),t2=R(3,12);while(t2===t1)t2=R(3,12);
    return cmpMc(`${p} runs ${v1*t1} meters in ${t1} seconds. ${q} runs ${v2*t2} meters in ${t2} seconds. Both run at a constant speed. <b>Who is faster?</b>`,
      [p,q,'Same speed'],v1,v2,true,
      `${p}: ${v1*t1} ÷ ${t1} = ${v1} meters per second. ${q}: ${v2*t2} ÷ ${t2} = ${v2} meters per second.`,
      'Running farther doesn’t mean running faster. Compare the meters in 1 second.',
      'Find the meters per second for each runner.');
  }
  let a1=R(1,4),b1=R(2,6),a2,b2;
  if(Math.random()<.2){const k=R(2,3);a2=a1*k;b2=b1*k;}
  else{do{a2=R(1,5);b2=R(2,7);}while(a1*b2===a2*b1||(a1===a2&&b1===b2));}
  const L=lcm(b1,b2);
  return cmpMc(`<b>Drink A:</b> ${a1} cup${a1>1?'s':''} of lemon juice for every ${b1} cups of water<br><b>Drink B:</b> ${a2} cup${a2>1?'s':''} of lemon juice for every ${b2} cups of water<br>Which drink tastes <b>more lemony</b>?`,
    ['Drink A','Drink B','Same taste'],a1/b1,a2/b2,true,
    `Make the water the same: A is ${a1*L/b1} : ${L} and B is ${a2*L/b2} : ${L}. ${a1*b2===a2*b1?'Same lemon juice for the same water.':`More lemon juice for the same water: Drink ${a1/b1>a2/b2?'A':'B'}.`}`,
    'More lemon juice isn’t enough on its own: check how much water goes with it.',
    `Scale both recipes so they use the same amount of water (try ${L} cups). Then compare the lemon juice.`);
}

/* ---------- stations ---------- */
const ICON={
  lang:'<circle cx="16" cy="18" r="9" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="2.5"/><circle cx="38" cy="18" r="9" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="2.5"/><rect x="8" y="36" width="17" height="17" rx="3" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/><rect x="30" y="36" width="17" height="17" rx="3" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/><rect x="52" y="36" width="10" height="17" rx="3" fill="none" stroke="#7fe3ff" stroke-width="2.5" stroke-dasharray="3 3"/>',
  equiv:'<circle cx="18" cy="32" r="12" fill="#3d7bff" stroke="#9dbcff" stroke-width="2"/><circle cx="46" cy="32" r="12" fill="#ffd23c" stroke="#fff1b8" stroke-width="2"/><circle cx="32" cy="32" r="9" fill="hsl(130 72% 48%)" stroke="#f3f6fb" stroke-width="2"/>',
  dnl:'<g stroke="#f3f6fb" stroke-width="2.5"><line x1="4" y1="20" x2="60" y2="20"/><line x1="4" y1="44" x2="60" y2="44"/><line x1="10" y1="14" x2="10" y2="26"/><line x1="26" y1="14" x2="26" y2="26"/><line x1="42" y1="14" x2="42" y2="26"/><line x1="10" y1="38" x2="10" y2="50"/><line x1="26" y1="38" x2="26" y2="50"/><line x1="42" y1="38" x2="42" y2="50"/></g><rect x="50" y="50" width="12" height="12" rx="3" fill="#ffc93c"/>',
  table:'<rect x="8" y="8" width="48" height="48" rx="4" fill="rgba(127,227,255,.12)" stroke="#7fe3ff" stroke-width="2.5"/><line x1="32" y1="8" x2="32" y2="56" stroke="#7fe3ff" stroke-width="2.5"/><line x1="8" y1="20" x2="56" y2="20" stroke="#7fe3ff" stroke-width="2.5"/><line x1="8" y1="32" x2="56" y2="32" stroke="#7fe3ff" stroke-width="1.5"/><line x1="8" y1="44" x2="56" y2="44" stroke="#7fe3ff" stroke-width="1.5"/><rect x="37" y="46" width="14" height="8" rx="2" fill="#ffc93c"/>',
  ppw:'<g stroke-width="2.5"><rect x="6" y="14" width="14" height="14" fill="rgba(255,201,60,.25)" stroke="#ffc93c"/><rect x="20" y="14" width="14" height="14" fill="rgba(255,201,60,.25)" stroke="#ffc93c"/><rect x="6" y="36" width="14" height="14" fill="rgba(127,227,255,.2)" stroke="#7fe3ff"/><rect x="20" y="36" width="14" height="14" fill="rgba(127,227,255,.2)" stroke="#7fe3ff"/><rect x="34" y="36" width="14" height="14" fill="rgba(127,227,255,.2)" stroke="#7fe3ff"/><path d="M52,14 q6,0 6,6 v8 q0,4 4,4 q-4,0 -4,4 v8 q0,6 -6,6" fill="none" stroke="#f3f6fb"/></g>',
  compare:'<g stroke="#f3f6fb" stroke-width="2.5" fill="none"><line x1="32" y1="8" x2="32" y2="54"/><line x1="10" y1="16" x2="54" y2="12"/><path d="M4,34 L10,16 L18,34 Z" fill="rgba(255,201,60,.35)" stroke="#ffc93c"/><path d="M46,30 L54,12 L62,30 Z" fill="rgba(127,227,255,.3)" stroke="#7fe3ff"/><line x1="22" y1="56" x2="42" y2="56"/></g>',
  boss:'<rect x="6" y="6" width="52" height="52" rx="4" fill="none" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="5 4"/><polygon points="32,12 38,26 53,27 41,37 45,52 32,43 19,52 23,37 11,27 26,26" fill="#ffc93c"/>'
};
const ZONES=[
  {id:'lang',name:'Ratio Language Lab',lessons:'Lessons 1–2',blurb:'Read diagrams and write ratios in the right order.',gen:genLang},
  {id:'equiv',name:'Recipe & Paint Shop',lessons:'Lessons 3–5',blurb:'Same taste, same shade: multiply both amounts by the same number.',gen:genEquiv},
  {id:'dnl',name:'Double Number Line Track',lessons:'Lessons 6–9',blurb:'Fill in ticks, find how much for one, and work with constant speed.',gen:genDnl},
  {id:'table',name:'Table Town',lessons:'Lessons 11–14',blurb:'Complete tables of equivalent ratios, going through 1 when you need to.',gen:genTable},
  {id:'ppw',name:'Tape Diagram Workshop',lessons:'Lessons 15–16',blurb:'Part-part-whole problems: split the total into equal boxes.',gen:genPpw},
  {id:'compare',name:'Better Deal Market',lessons:'Lessons 8–10, 14',blurb:'Cheaper, faster, or more lemony? Compare by finding the amount for one.',gen:genCompare},
  {id:'boss',name:'Final Mix',lessons:'Whole unit · 10 problems',blurb:'A mixed review from every station. Aim for 3 stars.',gen:()=>pick([genLang,genEquiv,genDnl,genTable,genPpw,genCompare])()}
];
