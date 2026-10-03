/* Fraction Workshop (Grade 6 Unit 4): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs,
   after figs.js (fractions and pictures). Every problem carries facts for checks.js: the fractions in it (f), its answer as a
   fraction (ans), the numbers met on the way (work), and real-world facts its context needs. */
const WHO=['Lin','Andre','Priya','Diego','Jada','Noah','Mai','Kiran','Elena','Han','Clare','Tyler'];
/* a fraction with its unit: "3/4 foot", "2 1/2 feet" (u: [unit for 1 or less, unit for more]) */
const qty=(f,u)=>`${fx(f)} ${unitOf(f,u)}`;
/* friendly denominators: no sevenths, ninths, or elevenths */
const nice=f=>[1,2,3,4,5,6,8,10,12].includes(f[1]);
/* a num problem: answer from ans, mistakes given as fractions or numbers, any that land on the answer left out */
function numP(p){
  const answer=fVal(p.ans),misc=(p.misc||[]).map(([v,m])=>[Array.isArray(v)?fVal(v):v,m]).filter(([v])=>isFinite(v)&&v>0&&Math.abs(v-answer)>=.02);
  return {kind:'num',frac:!p.money,...p,answer,misc:miscOf(answer,misc)};
}
/* the "Check:" line: multiply back */
const backCheck=(a,b,t)=>`Check: ${fx(a)} × ${fx(b)} = ${fx(t)}.`;

/* ---------- Station 1: making sense of division (Lessons 1–3) ---------- */
const SIZE_WHY={
  less:'The number you divide is much smaller than the number you divide by, so not even 1 group fits: the quotient is much less than 1.',
  close:'The two numbers are nearly equal, so about 1 group fits: the quotient is close to 1.',
  more:'The number you divide is much bigger than the number you divide by, so many groups fit: the quotient is much more than 1.'
};
function genSize(){
  const type=pick(['size','size','meaning','equation','quotient']);
  if(type==='size'){
    const cat=pick(['less','close','more']);let e;
    if(cat==='more')e=pick([()=>`${pick([6,12,20,45,100,300])} ÷ ${fr(1,pick([10,100,1000]))}`,()=>`${pick([400,750,900,2000])} ÷ ${pick([0.1,0.01,0.5,2])}`,()=>`${pick([12,15,20])} ÷ ${fr(1,pick([8,10,12]))}`])();
    else if(cat==='close'){const n=R(12,98),a=pick([[1,3],[1,4],[1,2],[2,3]]),b=pick([[1,5],[1,6],[1,8],[3,4]]);e=pick([()=>`${n} ${fr(...a)} ÷ ${n} ${fr(...b)}`,()=>{const x=R(30,89)/10,y=x+pick([-.4,-.3,.2,.3,.5]);return `${x} ÷ ${Math.round(y*10)/10}`;},()=>`${fr(...pick([[9,10],[7,8],[5,6]]))} ÷ ${fr(...pick([[8,9],[6,7],[4,5]]))}`])();}
    else e=pick([()=>`${pick([2,3,7,9])} ÷ ${pick([1000,2500,7335,9000]).toLocaleString('en-US')}`,()=>`${fr(...pick([[3,4],[1,2],[2,3]]))} ÷ ${pick([500,800,1000]).toLocaleString('en-US')}`,()=>`${pick([0.002,0.05,0.4])} ÷ ${pick([200,2000,900]).toLocaleString('en-US')}`])();
    const lab={less:'Much less than 1',close:'Close to 1',more:'Much more than 1'},why={};
    ['less','close','more'].forEach(c=>{if(c!==cat)why[c]=SIZE_WHY[cat];});
    return {kind:'mc',choices:['less','close','more'].map(c=>({id:c,label:lab[c]})),answer:cat,why,
      prompt:`Without computing: is <b>${e}</b> much less than 1, close to 1, or much more than 1?`,
      hint:'Compare the two numbers. How many of the second one fit in the first: none, about one, or lots?',
      explain:SIZE_WHY[cat],facts:{t:type}};
  }
  if(type==='meaning'){
    let a,b;do{a=pick(TOT);b=pick(GROUPS);}while(fVal(b)>=fVal(a));
    const A=fx(a),B=fx(b);
    return {kind:'mc',stack:true,...mcOf([[`How many ${B}s are in ${A}?`,null],[`What is ${B} of ${A}?`,`That’s ${B} × ${A}, a multiplication. Division asks how many ${B}s fit in ${A}.`],
      [`What is ${A} groups of ${B}?`,`That’s ${A} × ${B}. Division asks how many groups of ${B} make ${A}.`],[`How many ${A}s are in ${B}?`,`That’s ${B} ÷ ${A}. In ${A} ÷ ${B}, the groups are ${B}.`]]),
      prompt:`Which question does <b>${A} ÷ ${B} = ?</b> answer?`,
      hint:`${A} ÷ ${B} = ? goes with the multiplication ? × ${B} = ${A}: how many groups of ${B} make ${A}?`,
      explain:`${A} ÷ ${B} = ? means ? × ${B} = ${A}: how many ${B}s are in ${A}?`,facts:{t:type,f:[a,b]}};
  }
  if(type==='equation'){
    const kind=pick(['groups','each','total']),who=pick(WHO);let a,b,n,s;
    if(kind==='groups'){do{a=pick(TOT);b=pick(GROUPS);}while(fVal(b)>=fVal(a)||fVal(a)>8);s=`${who} has ${qty(a,['cup','cups'])} of wood glue and uses ${qty(b,['cup','cups'])} for each birdhouse. How many birdhouses can ${who} glue?`;}
    else if(kind==='each'){do{a=pick(TOT);n=R(2,6);}while(fVal(a)<2||isWhole(a));b=frac(n);s=`${who} cuts a board ${qty(a,['foot','feet'])} long into ${n} equal shelves. How long is each shelf?`;}
    else{n=R(2,6);a=frac(n);b=pick(GROUPS);s=`${who} fills ${n} jars with ${qty(b,['cup','cups'])} of paint each. How much paint is that in all?`;}
    const [x,y]=kind==='total'?[a,b]:[a,b],X=fx(x),Y=fx(y);
    const div=`${X} ÷ ${Y} = ?`,mul=`${X} × ${Y} = ?`,rev=`${Y} ÷ ${X} = ?`;
    const right=kind==='total'?mul:div;
    const list=[[div,kind==='total'?`Dividing would find how many groups or how much in each. Here you know the groups and their size, and want the total: multiply.`:null],
      [mul,kind==='total'?null:`Multiplying finds a total, but the total (${X}) is already known. Divide it.`],
      [rev,`That divides the wrong way: the ${kind==='groups'?'total':'board'} is ${X}, so it comes first.`]];
    return {kind:'mc',...mcOf(kind==='total'?[[mul,null],[div,list[0][1]],[rev,'That divides the two numbers, but nothing here needs dividing: multiply to find the total.']]:list),
      prompt:`${s} <b>Which equation fits?</b>`,
      hint:'Is the total known? If so, you are finding how many groups or how much in each group: divide the total. If not, multiply to find it.',
      explain:kind==='total'?`${n} groups of ${qty(b,['cup','cups'])}: ${right}`:`The total is ${X}, so divide: ${right}`,facts:{t:type,f:[a,b]}};
  }
  const it=pick([['screws','bag','bags'],['nails','box','boxes'],['washers','cup','cups'],['bolts','tray','trays']]);
  let g,n;do{g=R(2,9);n=R(2,9);}while(g===n);
  const T=g*n,byGroups=Math.random()<.5,lab=[`${n} ${it[2]}`,`${n} ${it[0]} in each ${it[1]}`,`${n} ${it[0]} left over`];
  const prompt=byGroups?`${T} ${it[0]} are put into ${it[2]}, ${g} in each ${it[1]}. ${T} ÷ ${g} = ${n}. <b>What does the ${n} mean?</b>`:`${T} ${it[0]} are shared equally among ${g} ${it[2]}. ${T} ÷ ${g} = ${n}. <b>What does the ${n} mean?</b>`;
  return {kind:'mc',...mcOf([[lab[0],byGroups?null:`There are ${g} ${it[2]}; ${n} is how many ${it[0]} go in each one.`],[lab[1],byGroups?`Each ${it[1]} gets ${g}; ${n} is how many ${it[2]} you fill.`:null],[lab[2],`${g} × ${n} = ${T}, so nothing is left over.`]]),
    prompt,hint:`What is known: the number of ${it[2]}, or how many go in each ${it[1]}? The quotient is the other one.`,
    explain:byGroups?`${n} groups of ${g} make ${T}: ${n} ${it[2]}.`:`${g} groups of ${n} make ${T}: ${n} ${it[0]} in each ${it[1]}.`,facts:{t:'quotient'}};
}

/* ---------- Station 2: how many groups? (Lessons 4–6) ---------- */
const GROUPS=[[1,2],[1,3],[1,4],[2,3],[3,4],[2,5],[3,5],[4,5],[1,6],[5,6],[3,8],[5,8],[3,2],[5,4],[4,3]];
const TOT=[...range(8).map(i=>frac(i+1)),...[3,5,7,9,11,13,15].map(n=>frac(n,2)),...[4,5,7,8,10,11].map(n=>frac(n,3)),...[5,7,9,11,13,15].map(n=>frac(n,4))];
const CUT=[
  {u:['foot','feet'],max:10,min:1/3,unit:'pieces',w:['piece','pieces'],s:(T,G)=>`A board is ${T} long. How many pieces ${G} long can be cut from it?`},
  {u:['yard','yards'],max:8,min:1/4,unit:'bows',w:['bow','bows'],s:(T,G)=>`A roll has ${T} of ribbon. Each bow uses ${G} of ribbon. How many bows can be made?`},
  {u:['inch','inches'],max:12,min:1/2,unit:'pegs',w:['peg','pegs'],s:(T,G)=>`A dowel ${T} long is cut into pegs ${G} long. How many pegs does it make?`},
];
const FILL=[
  {u:['quart','quarts'],max:8,min:1/4,unit:'jars',w:['jar','jars'],s:(T,G)=>`A can holds ${T} of paint. Each jar holds ${G}. How many jars does the can fill?`},
  {u:['pound','pounds'],max:10,min:1/4,unit:'boxes',w:['box','boxes'],s:(T,G)=>`There are ${T} of nails. Each box holds ${G}. How many boxes do they fill?`},
  {u:['cup','cups'],max:6,min:1/4,unit:'shelves',w:['shelf','shelves'],s:(T,G)=>`Each shelf takes ${G} of stain. How many shelves can ${T} of stain cover?`},
];
/* a total and a group size that draw well on one tape and keep the numbers small */
function groupsPair(whole,max=8,min=0){
  let t,g,a,d;
  do{t=pick(TOT);g=pick(GROUPS);a=fDiv(t,g);d=lcm(t[1],g[1]);}
  while(d>12||t[0]*d/t[1]>40||fVal(g)>=fVal(t)||fVal(t)>max||fVal(g)<min||!nice(a)||fVal(a)>16||t[0]*g[1]>144||(whole!==null&&isWhole(a)!==whole));
  return [t,g,a,d];
}
/* how many groups of g are in t, with the named mistakes */
function groupsMisc(t,g,a,d){
  const N=t[0]*d/t[1],n=g[0]*d/g[1],full=Math.floor(N/n),left=N-full*n,G=fx(g),T=fx(t),out=[
    [fMul(t,g),`That’s ${T} × ${G}. Ask how many groups of ${G} fit in ${T}: divide.`],
    [fDiv(g,t),`That’s ${G} ÷ ${T}, how many ${T}s fit in ${G}. Divide ${T} by ${G}.`]];
  if(left&&full){
    out.push([frac(full),`That counts only the full groups. The ${partName(d,left)} left over make part of another group.`]);
    out.push([frac(full*d+left,d),`The ${partName(d,left)} left over are a fraction of a group, not of a whole: a group is ${partName(d,n)}, so that’s ${fx(frac(left,n))} of a group.`]);
  }
  return out;
}
function genGroups(){
  const type=pick(['cut','cut','fill','fill','fill','bare']);
  if(type==='bare'){
    const [t,g,a,d]=groupsPair(null);
    return numP({unit:'',ans:a,prompt:`How many groups of <b>${fx(g)}</b> are in <b>${fx(t)}</b>?`,
      fig:(show,done)=>groupTape(t,g,{upto:show?Infinity:0,tell:done}),
      hint:`Cut each whole into ${PART[d][1]}. A group of ${fx(g)} is ${partName(d,g[0]*d/g[1])}. Count the groups, and what part of a group is left.`,
      misc:groupsMisc(t,g,a,d),explain:`${fx(t)} ÷ ${fx(g)} = ${fx(a)}. ${backCheck(a,g,t)}`,facts:{t:type,f:[t,g],ans:a,work:[t[0]*g[1],t[1]*g[0]]}});
  }
  const c=pick(type==='cut'?CUT:FILL),[t,g,a,d]=groupsPair(type==='cut'?true:null,c.max,c.min),T=qty(t,c.u),G=qty(g,c.u);
  const N=t[0]*d/t[1],n=g[0]*d/g[1],full=Math.floor(N/n),lf=frac(N-full*n,n);
  return numP({unit:c.unit,ans:a,prompt:c.s(T,G),
    fig:(show,done)=>groupTape(t,g,{upto:show?Infinity:0,tell:done}),
    hint:`How many groups of ${G} are in ${T}? On the tape, each whole is cut into ${PART[d][1]}, and one ${c.w[0]} uses ${partName(d,n)}.`,
    misc:groupsMisc(t,g,a,d),
    explain:`${fx(t)} ÷ ${fx(g)} = ${fx(a)}${isWhole(a)?'':`: ${full} full ${full===1?c.w[0]:c.w[1]} and ${fx(lf)} of another`}. ${backCheck(a,g,t)}`,
    facts:{t:type,f:[t,g],ans:a,work:[t[0]*g[1],t[1]*g[0]],total:fVal(t),max:c.max,piece:fVal(g)}});
}

/* ---------- Station 3: what fraction of a group? (Lessons 7, 12) ---------- */
const BATCH=[{what:'wood filler',of:'powder',u:['cup','cups']},{what:'stain',of:'dye',u:['ounce','ounces']},{what:'concrete',of:'sand',u:['pound','pounds']}];
const LENS=[...[1,2,3,4,5,6,8].map(n=>frac(n)),...[3,5,7,9].map(n=>frac(n,2)),...[4,5,7,8].map(n=>frac(n,3)),...[3,5,7,9,11].map(n=>frac(n,4))];
function genPart(){
  const type=pick(['batch','batch','times','times']),who=pick(WHO);
  if(type==='batch'){
    const b=pick(BATCH);let B,A,a;
    do{B=pick([...range(11).map(i=>frac(i+2)),frac(1,2),frac(3,4),frac(3,2),frac(5,2)]);A=pick(LENS.concat([frac(1,4),frac(1,2),frac(3,4),frac(1,3),frac(2,3)]));a=fDiv(A,B);}
    while(fVal(A)>=fVal(B)||!nice(a)||a[1]<2||lcm(A[1],B[1])>12||A[0]*B[1]>144);
    const d=a[1],k=a[0];
    return numP({unit:'of a batch',ans:a,
      prompt:`One batch of ${b.what} uses ${qty(B,b.u)} of ${b.of}. ${who} has only ${qty(A,b.u)}. <b>What fraction of a batch</b> can ${who} make?`,
      fig:(show,done)=>oneGroup(d,done?k:0,{top:done?[A,unitOf(A,b.u)]:null,whole:[B,unitOf(B,b.u)],label:`Tape diagram: one batch, ${ftx(B)} ${b.u[1]}, cut into ${d} equal parts`}),
      hint:`One batch is ${qty(B,b.u)}. What fraction of ${fx(B)} is ${fx(A)}? Divide: ${fx(A)} ÷ ${fx(B)}.`,
      misc:[[fDiv(B,A),`That’s ${fx(B)} ÷ ${fx(A)}, how many batches the ${b.of} would make if you had ${qty(B,b.u)}. ${who} has less than a batch, so the answer is less than 1.`],[fSub(B,A),`That’s how much more ${b.of} a full batch needs. The question asks what fraction of a batch ${fx(A)} makes.`]],
      explain:`${fx(A)} ÷ ${fx(B)} = ${fx(a)}. ${backCheck(a,B,A)}`,
      facts:{t:type,f:[A,B],ans:a,work:[A[0]*B[1],A[1]*B[0]]}});
  }
  let x,y,q;
  do{x=pick(LENS);y=pick(LENS);q=fDiv(x,y);}while(fVal(x)===fVal(y)||!nice(q)||lcm(x[1],y[1])>12||fVal(q)>6||x[0]*y[1]>144||x[1]*y[0]>144||(q[1]===1&&q[0]===1));
  const objs=pick([['shelf','board'],['table','bench'],['ladder','pole'],['gate','fence post']]),U=['foot','feet'];
  const more=fVal(q)>1,diff=fVal(x)>fVal(y)?fSub(x,y):fSub(y,x);
  return numP({unit:more?'times as long':'',ans:q,
    prompt:more?`A ${objs[0]} is ${qty(x,U)} long and a ${objs[1]} is ${qty(y,U)} long. <b>How many times as long as the ${objs[1]}</b> is the ${objs[0]}?`
      :`A ${objs[0]} is ${qty(x,U)} long and a ${objs[1]} is ${qty(y,U)} long. <b>What fraction of the ${objs[1]}’s length</b> is the ${objs[0]}?`,
    fig:(show,done)=>groupTape(x,y,{upto:show?Infinity:0,tell:done,label:`Tape diagram: the ${objs[0]}, ${ftx(x)} feet, measured in lengths of the ${objs[1]}, ${ftx(y)} feet`}),
    hint:`Think of the ${objs[1]}’s length as 1 group. How many groups of ${fx(y)} are in ${fx(x)}? Divide: ${fx(x)} ÷ ${fx(y)}.`,
    misc:[[fDiv(y,x),`That’s ${fx(y)} ÷ ${fx(x)}: how the ${objs[1]} compares to the ${objs[0]}. Divide the ${objs[0]}’s length by the ${objs[1]}’s.`],[diff,`That’s the difference in length. The question asks how many times as long, so divide.`]],
    explain:`${fx(x)} ÷ ${fx(y)} = ${fx(q)}. ${backCheck(q,y,x)}`,
    facts:{t:type,f:[x,y],ans:q,work:[x[0]*y[1],x[1]*y[0]]}});
}

/* ---------- Station 4: how much in each group? (Lessons 8–9) ---------- */
const CONT=[{c:'can',of:'paint',u:['quart','quarts'],max:16},{c:'bucket',of:'water',u:['gallon','gallons'],max:12},{c:'bin',of:'sawdust',u:['pound','pounds'],max:24},{c:'jar',of:'glue',u:['cup','cups'],max:8}];
const EACH=[frac(1,2),frac(1),frac(3,2),frac(2),frac(5,2),frac(3),frac(4)];
function genFill(){
  const type=pick(['part','part','share','price','two']),who=pick(WHO);
  if(type==='part'){
    const c=pick(CONT);let d,k,e,A,W;
    do{d=pick([2,3,4,5,6,8]);k=R(1,d-1);e=pick(EACH);A=fMul(frac(k),e);W=fMul(frac(d),e);}while(gcd(k,d)>1||fVal(W)>c.max||A[1]>2||A[0]*d>144);
    const p=frac(k,d);
    return numP({unit:c.u[1],ans:W,
      prompt:`${who} pours ${qty(A,c.u)} of ${c.of} into a ${c.c}, and it is ${fx(p)} full. <b>How many ${c.u[1]} does the full ${c.c} hold?</b>`,
      fig:(show,done)=>oneGroup(d,k,{top:[A,unitOf(A,c.u)],each:show?[e,'']:null,whole:done?[W,unitOf(W,c.u)]:null,q:done?null:'whole',label:`Tape diagram: one ${c.c} cut into ${d} equal parts, ${k} of them filled with ${ftx(A)} ${c.u[1]}`}),
      hint:`The ${c.c} is cut into ${PART[d][1]}, and ${partName(d,k)} hold${k===1?'s':''} ${qty(A,c.u)}. How much is in 1 ${PART[d][0]}? Then how much in all ${d}?`,
      misc:[[fMul(A,p),`That’s ${fx(p)} of ${fx(A)}. ${fx(A)} is the part, and you need the whole: ${fx(A)} ÷ ${fx(p)}.`],[fDiv(A,frac(k)),`That’s 1 ${PART[d][0]} of the ${c.c}. The whole ${c.c} is ${d} ${PART[d][1]}.`],[fMul(A,frac(d)),`You multiplied by ${d} but didn’t divide by ${k}: ${fx(A)} fills ${partName(d,k)}, not 1.`]],
      explain:`${fx(A)} ÷ ${fx(p)} = ${fx(W)}: each ${PART[d][0]} holds ${fx(e)}, and ${d} × ${fx(e)} = ${fx(W)}. ${backCheck(p,W,A)}`,
      facts:{t:type,f:[A,p],ans:W,work:[A[0]*d,A[1]*k],part:fVal(p)}});
  }
  if(type==='share'){
    let n,e,t;do{n=R(2,6);e=pick(LENS.concat([frac(1,2),frac(3,4),frac(2,3)]));t=fMul(frac(n),e);}while(fVal(t)>12||t[1]>4||isWhole(t));
    return numP({unit:'feet',ans:e,
      prompt:`${who} cuts a strip of trim ${qty(t,['foot','feet'])} long into ${n} equal pieces. <b>How long is each piece?</b>`,
      fig:(show,done)=>oneGroup(n,n,{whole:[t,'feet'],each:done?[e,'']:null,q:done?null:'each',label:`Tape diagram: ${ftx(t)} feet cut into ${n} equal pieces`}),
      hint:`${n} equal pieces make ${fx(t)}: ${n} × ? = ${fx(t)}. Divide ${fx(t)} by ${n}. Writing ${fx(t)} as ${fim(t)} helps.`,
      misc:[[fMul(t,frac(n)),`That’s ${n} strips. Split the one strip into ${n} pieces: divide.`],[fDiv(frac(n),t),`That’s ${n} ÷ ${fx(t)}. The strip is what gets split: ${fx(t)} ÷ ${n}.`]],
      explain:`${fx(t)} ÷ ${n} = ${fim(t)} × ${fr(1,n)} = ${fx(e)}. ${backCheck(frac(n),e,t)}`,facts:{t:type,f:[t],ans:e,work:[t[0],t[1]*n]}});
  }
  if(type==='price'){
    const it=pick([['brass screws','pound','pounds'],['copper wire','yard','yards'],['wood stain','quart','quarts'],['wood glue','pint','pints']]);
    let d,k,e;do{d=pick([2,3,4,5,8]);k=R(1,d-1);e=pick([1,2,3,1.5,2.5,0.5]);}while(gcd(k,d)>1||(k*e)%0.25||k*e<1);
    const p=frac(k,d),cost=k*e,one=d*e;
    return numP({unit:'dollars',money:true,ans:one%1?frac(one*2,2):frac(one),
      prompt:`${fx(p)} ${it[1]} of ${it[0]} costs ${cash(cost)}. <b>What does 1 ${it[1]} cost?</b>`,
      fig:(show,done)=>oneGroup(d,k,{top:cash(cost),each:show?cash(e):null,whole:done?cash(one):null,q:done?null:'whole',label:`Tape diagram: 1 ${it[1]} cut into ${d} equal parts, ${k} of them cost ${cash(cost)}`}),
      hint:`${partName(d,k)} of a ${it[1]} cost${k===1?'s':''} ${cash(cost)}. Find the cost of 1 ${PART[d][0]}, then of all ${d} ${PART[d][1]}.`,
      misc:[[cost*k/d,`That’s ${fx(p)} of ${cash(cost)}. ${cash(cost)} buys only ${fx(p)} ${it[1]}, so 1 ${it[1]} costs more.`],[e,`That’s the cost of 1 ${PART[d][0]} of a ${it[1]}. A whole ${it[1]} is ${d} ${PART[d][1]}.`]],
      explain:`${cash(cost)} ÷ ${fx(p)} = ${cash(one)}: each ${PART[d][0]} costs ${cash(e)}, and ${d} × ${cash(e)} = ${cash(one)}.`,facts:{t:type,f:[p],ans:frac(one*2,2),work:[cost*d],part:fVal(p)}});
  }
  /* two amounts to keep track of: a fraction of a pound fills a fraction of a mold */
  let a,p,W;do{a=pick([frac(1,2),frac(3,4),frac(1,4),frac(2,3),frac(1,3),frac(3,2),frac(5,4)]);p=pick([frac(1,2),frac(1,3),frac(2,3),frac(1,4),frac(3,4),frac(2,5),frac(3,5)]);W=fDiv(a,p);}
  while(!nice(W)||fVal(W)>6||a[0]*p[1]>144||lcm(a[1],p[1])>12);
  return numP({unit:'pounds',ans:W,
    prompt:`${qty(a,['pound','pounds'])} of clay fills ${fx(p)} of a mold. <b>How many pounds of clay fill the whole mold?</b>`,
    fig:(show,done)=>oneGroup(p[1],p[0],{top:[a,'lb'],whole:done?[W,'lb']:null,q:done?null:'whole',label:`Tape diagram: one mold cut into ${p[1]} equal parts, ${p[0]} of them filled by ${ftx(a)} pound`}),
    hint:`${fx(a)} pound fills ${fx(p)} of the mold: ${fx(p)} × ? = ${fx(a)}. Divide ${fx(a)} by ${fx(p)}.`,
    misc:[[fMul(a,p),`That’s ${fx(p)} of ${fx(a)} pound. The clay fills only part of the mold, so the whole mold takes more.`],[fDiv(p,a),`That’s ${fx(p)} ÷ ${fx(a)}: what fraction of the mold 1 pound fills. Divide the pounds by the fraction of the mold.`]],
    explain:`${fx(a)} ÷ ${fx(p)} = ${fx(W)} pounds. ${backCheck(p,W,a)}`,facts:{t:'two',f:[a,p],ans:W,work:[a[0]*p[1],a[1]*p[0]],part:fVal(p)}});
}

/* ---------- Station 5: dividing fractions (Lessons 10–11) ---------- */
const DIVIDENDS=[...range(8).map(i=>frac(i+1)),frac(1,2),frac(3,4),frac(2,3),frac(5,6),frac(3,8),frac(7,8),frac(9,10),frac(4,5),frac(3,5),frac(5,4),frac(4,3),frac(5,2),frac(7,2),frac(10,3),frac(9,4),frac(15,4)];
const DIVISORS=[frac(1,2),frac(1,3),frac(1,4),frac(1,5),frac(1,6),frac(1,8),frac(2,3),frac(3,4),frac(2,5),frac(3,5),frac(5,6),frac(3,8),frac(5,8),frac(3,2),frac(5,2),frac(4,3),frac(2),frac(3),frac(4)];
function genRecip(){
  const type=pick(['calc','calc','calc','calc','way','size']);
  let a,b,q;
  do{a=pick(DIVIDENDS);b=pick(DIVISORS);q=fDiv(a,b);}
  while(!nice(q)||fVal(q)>40||a[0]*b[1]>144||a[1]*b[0]>144||(type==='way'&&(!isWhole(a)||a[0]<2||b[0]===1||b[1]===1))||(type==='size'&&Math.abs(fVal(a)-fVal(b))<.15)||(fVal(q)===1));
  const A=fx(a),B=fx(b),flip=fInv(b),work=`${A} ÷ ${B} = ${fim(a)} × ${fim(flip)} = ${fim(fMul(a,flip))}${isWhole(q)||q[0]<q[1]?'':` = ${fx(q)}`}`;
  if(type==='way'){
    const [bn,bd]=b,n=a[0],P=PART[bd][1];
    return {kind:'mc',...mcOf([[`${n} × ${bd} ÷ ${bn}`,null],
      [`${n} ÷ ${bd} × ${bn}`,`Each whole holds ${bd} ${P}, so ${n} wholes hold ${n} × ${bd} of them, not ${n} ÷ ${bd}.`],
      [`${n} × ${bd} × ${bn}`,`Groups of ${bn} ${P} are fewer than single ${P}: divide the ${n*bd} ${P} into groups of ${bn}.`],
      [`${n} ÷ ${bd} ÷ ${bn}`,`Each whole holds ${bd} ${P}: multiply by ${bd} to count them, then divide into groups of ${bn}.`]]),
      prompt:`Which is the same as <b>${n} ÷ ${B}</b>?`,
      hint:`${B} is ${bn} ${P}. First count the ${P} in ${n} wholes, then count groups of ${bn}.`,
      explain:`${n} wholes are ${n} × ${bd} = ${n*bd} ${P}, and groups of ${bn} make ${n*bd} ÷ ${bn} = ${ftx(q)}. So ${n} ÷ ${B} = ${n} × ${bd} ÷ ${bn}.`,facts:{t:type,f:[a,b]}};
  }
  if(type==='size'){
    const more=fVal(a)>fVal(b);
    return {kind:'mc',choices:[{id:'more',label:'More than 1'},{id:'less',label:'Less than 1'}],answer:more?'more':'less',
      why:{more:`${A} is less than ${B}, so not even one ${B} fits in ${A}.`,less:`${A} is more than ${B}, so at least one ${B} fits in ${A}.`},
      prompt:`Without computing: is <b>${A} ÷ ${B}</b> more than 1 or less than 1?`,
      hint:`How many ${B}s fit in ${A}? Is ${A} bigger or smaller than ${B}?`,
      explain:`${A} is ${more?'more':'less'} than ${B}, so the quotient is ${more?'more':'less'} than 1: ${A} ÷ ${B} = ${fx(q)}.`,facts:{t:type,f:[a,b]}};
  }
  return numP({unit:'',ans:q,prompt:`What is <b>${A} ÷ ${B}</b>?`,
    fig:isWhole(a)&&fVal(a)*lcm(a[1],b[1])<=40&&fVal(b)<fVal(a)?(show,done)=>groupTape(a,b,{upto:show?Infinity:0,tell:done}):undefined,
    hint:`Dividing by ${fim(b)} is the same as multiplying by its reciprocal, ${fim(flip)}.${a[1]>1&&fVal(a)>1?` Write ${A} as ${fim(a)} first.`:''}`,
    misc:[[fMul(a,b),`That’s ${A} × ${B}. To divide by ${fim(b)}, multiply by its reciprocal, ${fim(flip)}.`],[fDiv(b,a),`That’s ${B} ÷ ${A}: you flipped ${A} instead of ${B}. Only the divisor (the second number) flips.`],
      [fInv(fMul(a,b)),`You flipped both fractions. Keep ${fim(a)} as it is and flip only ${fim(b)}.`]],
    explain:`${work}. ${backCheck(q,b,a)}`,facts:{t:type,f:[a,b],ans:q,work:[a[0]*b[1],a[1]*b[0]]}});
}

/* ---------- Station 6: lengths and areas (Lessons 12–13) ---------- */
const SIDES=[frac(1),frac(2),frac(3),frac(4),frac(5),frac(6),frac(1,2),frac(3,2),frac(5,2),frac(7,2),frac(9,2),frac(3,4),frac(5,4),frac(7,4),frac(9,4),frac(11,4),frac(4,3),frac(5,3),frac(7,3),frac(2,3),frac(8,3)];
function genTile(){
  const type=pick(['area','area','side','side','along']);
  if(type==='area'){
    let w,h,A,p;do{w=pick(SIDES);h=pick(SIDES);A=fMul(w,h);p=lcm(w[1],h[1]);}while(isWhole(w)&&isWhole(h)||p>4||!(nice(A)||A[1]===16)||w[0]*h[0]>144||fVal(w)*p>16||fVal(h)*p>12||fVal(w)<fVal(h));
    const it=pick([['tabletop','ft'],['tile','in'],['picture frame','in'],['shelf top','ft']]),U=it[1]==='ft'?['foot','feet']:['inch','inches'];
    const wp=fMul(frac(Math.floor(fVal(w))),frac(Math.floor(fVal(h))));
    return numP({unit:`square ${U[1]}`,ans:A,
      prompt:`A rectangular ${it[0]} is ${qty(w,U)} by ${qty(h,U)}. <b>What is its area?</b>`,
      fig:show=>rectGrid(w,h,p,{unit:it[1],shade:show?Infinity:0}),
      hint:`Area = length × width: ${fx(w)} × ${fx(h)}. Write them as fractions first: ${fim(w)} × ${fim(h)}. In the picture, each small square is ${fr(1,p*p)} square ${U[0]}.`,
      misc:[[fAdd(w,h),`That’s ${fx(w)} + ${fx(h)}. Area is length times width: multiply.`],[fMul(frac(2),fAdd(w,h)),`That’s the perimeter, the distance around. Area is length times width.`],
        ...(fVal(wp)>0?[[wp,`That multiplies only the whole numbers. Write each side as a fraction and multiply: ${fim(w)} × ${fim(h)}.`]]:[])],
      explain:`${fim(w)} × ${fim(h)} = ${fim(A)}${isWhole(A)||A[0]<A[1]?'':` = ${fx(A)}`} square ${U[1]}.`,facts:{t:type,f:[w,h],ans:A,work:[w[0]*h[0],w[1]*h[1]]}});
  }
  if(type==='side'){
    let s,o,A;do{s=pick(SIDES);o=pick(SIDES);A=fMul(s,o);}while(isWhole(s)||fVal(o)===1||A[1]>4||s[0]*o[0]>144||A[0]*s[1]>144||fVal(A)>30);
    const it=pick([['garden bed','ft'],['rug','ft'],['poster','in'],['cutting board','in']]),U=it[1]==='ft'?['foot','feet']:['inch','inches'];
    return numP({unit:U[1],ans:o,
      prompt:`A rectangular ${it[0]} has an area of ${qty(A,['square '+U[0],'square '+U[1]])}. One side is ${qty(s,U)}. <b>How long is the other side?</b>`,
      hint:`${fx(s)} × ? = ${fx(A)}, so divide: ${fx(A)} ÷ ${fx(s)}.`,
      misc:[[fMul(A,s),`That’s ${fx(A)} × ${fx(s)}. You know the area and one side: divide.`],[fSub(A,s),`That’s ${fx(A)} − ${fx(s)}. Side × side = area, so divide the area by the side.`],[fDiv(s,A),`That’s ${fx(s)} ÷ ${fx(A)}. Divide the area by the side, not the side by the area.`]],
      explain:`${fx(A)} ÷ ${fx(s)} = ${fim(A)} × ${fim(fInv(s))} = ${fx(o)} ${U[1]}. ${backCheck(s,o,A)}`,facts:{t:type,f:[A,s],ans:o,work:[A[0]*s[1],A[1]*s[0]]}});
  }
  let s,n,L;do{s=pick([frac(1,2),frac(3,4),frac(3,2),frac(4,3),frac(5,4),frac(2,3),frac(5,2)]);n=R(4,16);L=fMul(frac(n),s);}while(L[1]>4||fVal(L)>24||isWhole(s)||L[0]*s[1]>144);
  return numP({unit:'tiles',ans:frac(n),
    prompt:`A hallway is ${qty(L,['foot','feet'])} long. Square tiles are ${qty(s,['foot','feet'])} on a side. <b>How many tiles fit along the length?</b>`,
    fig:L[0]*lcm(L[1],s[1])/L[1]<=40?(show,done)=>groupTape(L,s,{upto:show?Infinity:0,tell:done,label:`Tape diagram: ${ftx(L)} feet in tiles ${ftx(s)} feet long`}):undefined,
    hint:`How many ${fx(s)}s are in ${fx(L)}? Divide: ${fx(L)} ÷ ${fx(s)}.`,
    misc:[[fMul(L,s),`That’s ${fx(L)} × ${fx(s)}. Count how many tiles fit: divide.`],[fSub(L,s),`That’s ${fx(L)} − ${fx(s)}. Divide to find how many tiles fit.`]],
    explain:`${fx(L)} ÷ ${fx(s)} = ${fim(L)} × ${fim(fInv(s))} = ${n} tiles. ${backCheck(frac(n),s,L)}`,facts:{t:type,f:[L,s],ans:frac(n),work:[L[0]*s[1],L[1]*s[0]]}});
}

/* ---------- Station 7: triangles and prisms (Lessons 14–15) ---------- */
const EDGES=[frac(1),frac(2),frac(3),frac(4),frac(1,2),frac(3,2),frac(5,2),frac(7,2)];
function genCrate(){
  const type=pick(['tri','tri','cubes','cubes','vol','edge']);
  if(type==='tri'){
    const findH=Math.random()<.5;
    let b,h,A;do{b=pick(SIDES);h=pick(SIDES);A=fMul(frac(1,2),fMul(b,h));}while(isWhole(b)&&isWhole(h)||A[1]>8||b[0]*h[0]>144||fVal(A)>30||(findH&&2*A[0]*b[1]>144));
    if(findH)return numP({unit:'inches',ans:h,
      prompt:`A triangle has an area of ${qty(A,['square inch','square inches'])} and a base of ${qty(b,['inch','inches'])}. <b>What is its height?</b>`,
      hint:`Area = ${fr(1,2)} × base × height, so ${fr(1,2)} × ${fx(b)} × h = ${fx(A)}. Double the area, then divide by the base.`,
      misc:[[fDiv(A,b),`That forgets the ${fr(1,2)}: a triangle is half of a parallelogram. Double the area first: ${fx(fMul(frac(2),A))} ÷ ${fx(b)}.`],[fMul(fMul(frac(1,2),b),A),`That multiplies. You know the area and the base: divide to find the height.`]],
      explain:`2 × ${fx(A)} = ${fx(fMul(frac(2),A))}, and ${fx(fMul(frac(2),A))} ÷ ${fx(b)} = ${fx(h)} inches. Check: ${fr(1,2)} × ${fx(b)} × ${fx(h)} = ${fx(A)}.`,facts:{t:type,f:[A,b],ans:h,work:[A[0]*2*b[1],A[1]*b[0]]}});
    return numP({unit:'square inches',ans:A,
      prompt:`A triangle has a base of ${qty(b,['inch','inches'])} and a height of ${qty(h,['inch','inches'])}. <b>What is its area?</b>`,
      hint:`Area = ${fr(1,2)} × base × height. Write each length as a fraction: ${fr(1,2)} × ${fim(b)} × ${fim(h)}.`,
      misc:[[fMul(b,h),`That’s base × height, the area of a parallelogram. A triangle is half of that.`],[fMul(frac(1,2),fAdd(b,h)),`That adds the base and height. Multiply them, then take half.`]],
      explain:`${fr(1,2)} × ${fim(b)} × ${fim(h)} = ${fx(A)} square inches.`,facts:{t:type,f:[b,h],ans:A,work:[b[0]*h[0],b[1]*h[1]*2]}});
  }
  if(type==='cubes'){
    let l,w,h,p,n;do{p=pick([2,2,3,4]);l=pick(EDGES);w=pick(EDGES);h=pick(EDGES);n=fVal(l)*fVal(w)*fVal(h)*p**3;}while(!Number.isInteger(fVal(l)*p)||!Number.isInteger(fVal(w)*p)||!Number.isInteger(fVal(h)*p)||n>216||fVal(l)*p>8||fVal(w)*p>8||fVal(h)*p>8||fVal(l)*fVal(w)*fVal(h)<1);
    const V=fMul(fMul(l,w),h),c=[l,w,h].map(e=>fVal(e)*p);
    return numP({unit:'cubes',ans:frac(n),
      prompt:`A box is ${fx(l)} by ${fx(w)} by ${fx(h)} inches inside. <b>How many cubes with edges of ${fr(1,p)} inch</b> fill it?`,
      fig:()=>cubeBox(l,w,h,p,{unit:'in'}),
      hint:`Each inch holds ${p} cubes along an edge. How many cubes fit along each edge? Multiply the three.`,
      misc:[[V,`That’s the volume in cubic inches. Each cube is ${fr(1,p)} inch on an edge, so ${p ** 3} of them fit in 1 cubic inch.`],[fMul(V,frac(p)),`That counts ${p} cubes per inch along only one edge. Every edge holds ${p} cubes per inch.`]],
      explain:`${c[0]} × ${c[1]} × ${c[2]} = ${n} cubes. (That’s ${fx(V)} cubic inches: ${n} cubes of ${fr(1,p ** 3)} cubic inch each.)`,facts:{t:type,f:[l,w,h],ans:frac(n),work:[n]}});
  }
  if(type==='vol'){
    let l,w,h,V;do{l=pick(EDGES.concat([frac(5),frac(6)]));w=pick(EDGES);h=pick(EDGES.concat([frac(1,3),frac(2,3),frac(4,3),frac(1,4),frac(3,4)]));V=fMul(fMul(l,w),h);}while(isWhole(l)&&isWhole(w)&&isWhole(h)||V[1]>8||l[0]*w[0]*h[0]>144||fVal(V)>40);
    const it=pick([['crate','ft',['foot','feet']],['toolbox','ft',['foot','feet']],['planter','ft',['foot','feet']]]),pw=Math.floor(fVal(l))*Math.floor(fVal(w))*Math.floor(fVal(h));
    return numP({unit:'cubic feet',ans:V,
      prompt:`A ${it[0]} shaped like a rectangular prism is ${qty(l,it[2])} long, ${qty(w,it[2])} wide, and ${qty(h,it[2])} tall. <b>What is its volume?</b>`,
      hint:`Volume = length × width × height. Write each one as a fraction and multiply: ${fim(l)} × ${fim(w)} × ${fim(h)}.`,
      misc:[[fAdd(fAdd(l,w),h),`That adds the edges. Volume is length × width × height.`],...(pw?[[frac(pw),`That multiplies only the whole numbers. Write each edge as a fraction first.`]]:[])],
      explain:`${fim(l)} × ${fim(w)} × ${fim(h)} = ${fx(V)} cubic feet.`,facts:{t:type,f:[l,w,h],ans:V,work:[l[0]*w[0]*h[0],l[1]*w[1]*h[1]]}});
  }
  let l,w,h,V,B;do{l=pick(EDGES.concat([frac(5),frac(6)]));w=pick(EDGES);h=pick(EDGES.concat([frac(3,4),frac(5,4)]));B=fMul(l,w);V=fMul(B,h);}while(isWhole(h)||V[1]>8||B[1]>4||fVal(V)>40||V[0]*B[1]>144||V[1]*B[0]>144||l[0]*w[0]*h[0]>144);
  return numP({unit:'feet',ans:h,
    prompt:`A storage bin holds ${qty(V,['cubic foot','cubic feet'])}. Its bottom is ${qty(l,['foot','feet'])} by ${qty(w,['foot','feet'])}. <b>How tall is it?</b>`,
    hint:`Volume = length × width × height. ${fx(l)} × ${fx(w)} = ${fx(B)}, so ${fx(B)} × h = ${fx(V)}. Divide.`,
    misc:[[fMul(V,B),`That multiplies. You know the volume and the bottom: divide.`],[fDiv(V,l),`That divides by only one edge of the bottom. Divide by the bottom’s area, ${fx(l)} × ${fx(w)} = ${fx(B)}.`]],
    explain:`${fx(l)} × ${fx(w)} = ${fx(B)}, and ${fx(V)} ÷ ${fx(B)} = ${fx(h)} feet.`,facts:{t:'edge',f:[V,l,w],ans:h,work:[V[0]*B[1],V[1]*B[0]]}});
}

/* ---------- the final round: choosing the operation (Lesson 16), with the other stations ---------- */
function genOps(){
  const who=pick(WHO),kind=pick(['of','fracOf','times','add','sub']),op={of:fMul,fracOf:(x,y)=>fDiv(y,x),times:fDiv,add:fAdd,sub:fSub}[kind];let a,b;
  do{a=pick([frac(3,4),frac(1,2),frac(2,3),frac(1,3),frac(1,4),frac(5,6),frac(3,2),frac(5,4),frac(3,8),frac(5,8)]);b=pick([frac(1,2),frac(1,3),frac(1,4),frac(2,3),frac(3,4),frac(2,5)]);}
  while(fVal(a)===fVal(b)||lcm(a[1],b[1])>12||!nice(op(a,b))||(kind!=='of'&&kind!=='add'&&fVal(b)>=fVal(a))||(kind==='of'&&fVal(b)>=1));
  const A=fx(a),B=fx(b),all={of:fMul(a,b),fracOf:fDiv(b,a),times:fDiv(a,b),add:fAdd(a,b),sub:fSub(a,b)},ans=all[kind];
  const S={
    of:[`${who} had ${qty(a,['liter','liters'])} of varnish and used ${B} of it. <b>How many liters did ${who} use?</b>`,'liters',`${B} of ${A} is ${B} × ${A}.`],
    fracOf:[`The path to the shed is ${qty(a,['kilometer','kilometers'])}. ${who} has walked ${qty(b,['kilometer','kilometers'])}. <b>What fraction of the way</b> has ${who} walked?`,'of the way',`What fraction of ${A} is ${B}? ${B} ÷ ${A}.`],
    times:[`${who}’s goal was to sweep up ${qty(b,['kilogram','kilograms'])} of sawdust. ${who} swept up ${qty(a,['kilogram','kilograms'])}. <b>How many times the goal</b> is that?`,'times the goal',`How many ${B}s are in ${A}? ${A} ÷ ${B}.`],
    add:[`${who} glues a strip ${qty(a,['foot','feet'])} long to the end of a strip ${qty(b,['foot','feet'])} long. <b>How long is the new strip?</b>`,'feet',`Put them together: ${A} + ${B}.`],
    sub:[`A board is ${qty(a,['foot','feet'])} long. ${who} saws off ${qty(b,['foot','feet'])}. <b>How long is the board now?</b>`,'feet',`Take away: ${A} − ${B}.`],
  }[kind];
  const name={of:'multiplied',fracOf:`divided ${B} by ${A}`,times:`divided ${A} by ${B}`,add:'added',sub:'subtracted'};
  const misc=Object.entries(all).filter(([k,v])=>k!==kind&&v[0]>0).map(([k,v])=>[v,`That ${name[k]}. ${S[2]}`]);
  return numP({unit:S[1],ans,prompt:S[0],hint:`Ask what the question wants: a part of an amount (multiply), how many of one fit in another or what fraction one is of another (divide), or putting together or taking away (add or subtract).`,
    misc,explain:`${S[2]} The answer is ${fx(ans)}.`,facts:{t:'ops',f:[a,b],ans,work:[a[0]*b[1],a[1]*b[0]]}});
}

/* ---------- stations ---------- */
const ICON={
  size:'<rect x="6" y="20" width="52" height="12" rx="2" fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="2"/><rect x="6" y="38" width="16" height="12" rx="2" fill="rgba(127,227,255,.4)" stroke="#7fe3ff" stroke-width="2"/><text x="44" y="50" text-anchor="middle" font-family="monospace" font-weight="700" font-size="16" fill="#f3f6fb">÷</text>',
  groups:'<rect x="4" y="22" width="56" height="20" fill="rgba(9,32,61,.6)" stroke="#f3f6fb" stroke-width="2"/><rect x="4" y="22" width="18" height="20" fill="rgba(255,201,60,.55)"/><rect x="22" y="22" width="18" height="20" fill="rgba(127,227,255,.45)"/><rect x="40" y="22" width="12" height="20" fill="rgba(95,224,168,.5)"/><path d="M5,48v4H21v-4M23,48v4H39v-4" fill="none" stroke="#f3f6fb" stroke-width="2"/>',
  part:'<rect x="6" y="24" width="52" height="18" fill="rgba(9,32,61,.6)" stroke="#f3f6fb" stroke-width="2"/><rect x="6" y="24" width="34.7" height="18" fill="rgba(255,201,60,.55)" stroke="#ffc93c" stroke-width="2"/><line x1="23.3" y1="24" x2="23.3" y2="42" stroke="#f3f6fb" stroke-width="1.5"/><line x1="40.7" y1="24" x2="40.7" y2="42" stroke="#f3f6fb" stroke-width="1.5"/>',
  fill:'<path d="M14,12 L50,12 L46,56 L18,56 Z" fill="rgba(9,32,61,.6)" stroke="#f3f6fb" stroke-width="2.5"/><path d="M16.5,30 L47.5,30 L46,56 L18,56 Z" fill="rgba(127,227,255,.45)"/><g stroke="#f3f6fb" stroke-width="1.5"><line x1="10" y1="30" x2="16" y2="30"/><line x1="11" y1="43" x2="17" y2="43"/></g>',
  recip:'<text x="20" y="28" text-anchor="middle" font-family="monospace" font-weight="700" font-size="16" fill="#ffc93c">3</text><line x1="12" y1="33" x2="28" y2="33" stroke="#ffc93c" stroke-width="2"/><text x="20" y="50" text-anchor="middle" font-family="monospace" font-weight="700" font-size="16" fill="#ffc93c">4</text><text x="44" y="28" text-anchor="middle" font-family="monospace" font-weight="700" font-size="16" fill="#7fe3ff">4</text><line x1="36" y1="33" x2="52" y2="33" stroke="#7fe3ff" stroke-width="2"/><text x="44" y="50" text-anchor="middle" font-family="monospace" font-weight="700" font-size="16" fill="#7fe3ff">3</text><path d="M26,14 Q32,6 38,14" fill="none" stroke="#f3f6fb" stroke-width="2"/>',
  tile:'<g fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="1.5">'+[0,1,2,3].map(i=>[0,1,2].map(j=>`<rect x="${8+i*12}" y="${14+j*12}" width="12" height="12"/>`).join('')).join('')+'</g><rect x="8" y="14" width="42" height="36" fill="none" stroke="#f3f6fb" stroke-width="2.5"/>',
  crate:'<polygon points="10,24 40,24 40,54 10,54" fill="rgba(255,201,60,.4)" stroke="#f3f6fb" stroke-width="2.5"/><polygon points="10,24 22,12 52,12 40,24" fill="rgba(255,201,60,.6)" stroke="#f3f6fb" stroke-width="2.5"/><polygon points="40,24 52,12 52,42 40,54" fill="rgba(255,201,60,.25)" stroke="#f3f6fb" stroke-width="2.5"/><g stroke="#f3f6fb" stroke-width="1"><line x1="25" y1="24" x2="25" y2="54"/><line x1="10" y1="39" x2="40" y2="39"/></g>',
  boss:'<rect x="6" y="6" width="52" height="52" rx="4" fill="none" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="5 4"/><polygon points="32,12 38,26 53,27 41,37 45,52 32,43 19,52 23,37 11,27 26,26" fill="#ffc93c"/>'
};
const ZONES=[
  {id:'size',name:'Quotient Check',lessons:'Lessons 1–3',blurb:'Is the answer much less than 1, about 1, or much more? Match questions to division.',gen:genSize},
  {id:'groups',name:'Cut List',lessons:'Lessons 4–6',blurb:'How many pieces, jars, or bows? Count groups of a fraction, and the part of a group left over.',gen:genGroups},
  {id:'part',name:'Part of a Job',lessons:'Lessons 7, 12',blurb:'What fraction of a batch? How many times as long?',gen:genPart},
  {id:'fill',name:'Fill Line',lessons:'Lessons 8–9',blurb:'Part of a can is full. How much does the whole can hold? And what does 1 pound cost?',gen:genFill},
  {id:'recip',name:'Reciprocal Saw',lessons:'Lessons 10–11',blurb:'Divide fractions and mixed numbers by multiplying by the reciprocal.',gen:genRecip},
  {id:'tile',name:'Tile Shop',lessons:'Lessons 12–13',blurb:'Areas with fractional sides, missing sides, and tiles along a hall.',gen:genTile},
  {id:'crate',name:'Crate Packer',lessons:'Lessons 14–15',blurb:'Triangles, small cubes in a box, and volumes with fractional edges.',gen:genCrate},
  {id:'boss',name:'Big Build',lessons:'Whole unit · 10 problems',blurb:'A mixed review from every station, plus choosing the operation. Aim for 3 stars.',gen:()=>pick([genSize,genGroups,genPart,genFill,genRecip,genTile,genCrate,genOps,genOps])()}
];
