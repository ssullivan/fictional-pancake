/* Rate Racers (Grade 6 Unit 3): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs. */
const fmt=n=>(Math.round(n*100)/100).toLocaleString('en-US');
const money=n=>'$'+n.toFixed(2);
const pl=(w,n)=>`${fmt(n)} ${w[n===1?0:1]}`;

const nice2=v=>Math.abs(v*100-Math.round(v*100))<1e-9;
const pctF=v=>fmt(v)+'%';

/* ---------- Station 1: unit conversion ---------- */
const CONV=[
  {big:['foot','feet'],small:['inch','inches'],f:12,kind:'length'},
  {big:['yard','yards'],small:['foot','feet'],f:3,kind:'length'},
  {big:['yard','yards'],small:['inch','inches'],f:36,kind:'length'},
  {big:['meter','meters'],small:['centimeter','centimeters'],f:100,kind:'length'},
  {big:['kilometer','kilometers'],small:['meter','meters'],f:1000,kind:'length'},
  {big:['kilogram','kilograms'],small:['gram','grams'],f:1000,kind:'mass'},
  {big:['pound','pounds'],small:['ounce','ounces'],f:16,kind:'weight'},
  {big:['quart','quarts'],small:['cup','cups'],f:4,kind:'volume'},
  {big:['gallon','gallons'],small:['quart','quarts'],f:4,kind:'volume'},
  {big:['liter','liters'],small:['milliliter','milliliters'],f:1000,kind:'volume'}
];
/* unit → [what it measures, size rank within that kind] */
const UNIT={centimeters:['length',1],meters:['length',2],kilometers:['length',3],inches:['length',1],yards:['length',2],miles:['length',3],
  grams:['mass',1],kilograms:['mass',2],ounces:['weight',1],pounds:['weight',2],cups:['volume',1],gallons:['volume',2],liters:['volume',2],quarts:['volume',2]};
const PICKS=[
  {what:'the length of a pencil',ok:'centimeters',opts:['centimeters','meters','kilometers']},
  {what:'the distance between two cities',ok:'kilometers',opts:['centimeters','meters','kilometers']},
  {what:'the height of a classroom door',ok:'meters',opts:['centimeters','meters','kilometers']},
  {what:'the mass of a paper clip',ok:'grams',opts:['grams','kilograms','liters']},
  {what:'the mass of a bicycle',ok:'kilograms',opts:['grams','kilograms','liters']},
  {what:'the water in a bathtub',ok:'gallons',opts:['cups','gallons','inches']},
  {what:'the water in a drinking glass',ok:'cups',opts:['cups','gallons','pounds']},
  {what:'the length of a football field',ok:'yards',opts:['inches','yards','miles']},
  {what:'the width of a phone screen',ok:'inches',opts:['inches','yards','miles']},
  {what:'the weight of a large dog',ok:'pounds',opts:['ounces','pounds','quarts']}
];
function genConv(){
  const c=pick(CONV),type=pick(['down','down','up','up','more','cmp','pick']);
  if(type==='down'||type==='up'){
    const n=pick(c.f>=100?[2,3,4,5,1.5,2.5]:[2,3,4,5,6,7,1.5,2.5]),m=n*c.f,down=type==='down',step=Number.isInteger(n)?1:.5;
    const ticks=[];for(let t=0;t<=n+1e-9;t+=step){const last=Math.abs(t-n)<1e-9,base=t===0||t===1;
      ticks.push(down?{t,b:t*c.f,st:1,sb:base?1:(last?0:2),q:last?'b':null}:{t,b:t*c.f,st:base?1:(last?0:2),sb:base||last?1:2,q:last?'t':null});}
    const fig=dnl(c.big[1],c.small[1],ticks);
    if(down)return {kind:'num',unit:c.small[1],answer:m,fig,
      prompt:`${fmt(n)} ${c.big[n===1?0:1]} is how many <b>${c.small[1]}</b>?`,
      hint:`1 ${c.big[0]} = ${fmt(c.f)} ${c.small[1]}. ${c.small[1][0].toUpperCase()+c.small[1].slice(1)} are smaller, so there will be more of them. Multiply.`,
      misc:[[n/c.f,`You divided. ${c.small[1]} are smaller than ${c.big[1]}, so it takes <b>more</b> of them. Multiply by ${fmt(c.f)}.`],[n+c.f,`Each ${c.big[0]} is ${fmt(c.f)} ${c.small[1]}. Multiply, don’t add.`]],
      explain:`1 ${c.big[0]} = ${fmt(c.f)} ${c.small[1]}, so ${fmt(n)} × ${fmt(c.f)} = ${fmt(m)} ${c.small[1]}.`};
    return {kind:'num',unit:c.big[1],answer:n,fig,
      prompt:`${fmt(m)} ${c.small[1]} is how many <b>${c.big[1]}</b>?`,
      hint:`1 ${c.big[0]} = ${fmt(c.f)} ${c.small[1]}. ${c.big[1][0].toUpperCase()+c.big[1].slice(1)} are bigger, so there will be fewer of them. Divide.`,
      misc:[[m*c.f,`You multiplied. ${c.big[1]} are bigger, so it takes <b>fewer</b> of them. Divide by ${fmt(c.f)}.`]],
      explain:`Every ${fmt(c.f)} ${c.small[1]} make 1 ${c.big[0]}: ${fmt(m)} ÷ ${fmt(c.f)} = ${fmt(n)} ${c.big[1]}.`};
  }
  if(type==='more'){
    const thing=pick(['a hallway','a rug','a garden hose','a desk']),bigFirst=Math.random()<.5;
    const [u1,u2]=bigFirst?[c.big[1],c.small[1]]:[c.small[1],c.big[1]];
    const ctx=c.kind==='length'?`Andre measures ${thing} in ${u1}, then measures it again in ${u2}.`:c.kind==='volume'?`Mai measures the water in a fish tank in ${u1}, then measures it again in ${u2}.`:`Kiran weighs a bag of rice in ${u1}, then weighs it again in ${u2}.`;
    const ans=bigFirst?'more':'fewer';
    return {kind:'mc',choices:[{id:'more',label:`More ${u2}`},{id:'fewer',label:`Fewer ${u2}`},{id:'same',label:'The same number'}],answer:ans,
      why:{more:`${u2} are bigger than ${u1}, so it takes fewer of them.`,fewer:`${u2} are smaller than ${u1}, so it takes more of them.`,same:'The amount is the same, but the units are different sizes, so the numbers are different.'},
      prompt:`${ctx} Compared with the number of ${u1}, will there be more or fewer ${u2}?`,
      hint:`Which unit is smaller? It takes more small units than big units to measure the same thing.`,
      explain:`1 ${c.big[0]} = ${fmt(c.f)} ${c.small[1]}. ${bigFirst?`${u2} are smaller, so there are more of them.`:`${u2} are bigger, so there are fewer of them.`}`};
  }
  if(type==='cmp'){
    const p=R(2,6),same=Math.random()<.2,d=c.f>=100?pick([-1,1])*R(1,9)*c.f/10:pick([-1,1])*R(1,Math.max(1,c.f-1));
    const q=same?p*c.f:p*c.f+d,word=c.kind==='length'?'longer':c.kind==='volume'?'more liquid':'heavier';
    const win=q===p*c.f?'S':(p*c.f>q?'A':'B');
    return {kind:'mc',choices:[{id:'A',label:`${p} ${c.big[1]}`},{id:'B',label:`${fmt(q)} ${c.small[1]}`},{id:'S',label:'They are equal'}],answer:win,
      why:{A:`Change ${p} ${c.big[1]} into ${c.small[1]} first, then compare.`,B:`Change ${p} ${c.big[1]} into ${c.small[1]} first, then compare.`,S:`Change ${p} ${c.big[1]} into ${c.small[1]}: they don’t match.`},
      prompt:`Which is <b>${word}</b>?`,
      hint:`Use the same unit for both. 1 ${c.big[0]} = ${fmt(c.f)} ${c.small[1]}.`,
      explain:`${p} ${c.big[1]} = ${p} × ${fmt(c.f)} = ${fmt(p*c.f)} ${c.small[1]}. Compare ${fmt(p*c.f)} with ${fmt(q)}.`};
  }
  const it=pick(PICKS),okU=UNIT[it.ok];
  const why={};it.opts.forEach(o=>{if(o===it.ok)return;const u=UNIT[o];why[o]=u[0]!==okU[0]?`${o} measure ${u[0]}, not ${okU[0]}.`:u[1]<okU[1]?`${o} are very small for this. You’d get a huge number.`:`${o} are very big for this. You’d get a tiny fraction.`;});
  return {kind:'mc',choices:it.opts.map(o=>({id:o,label:o})),answer:it.ok,why,
    prompt:`Which unit makes the most sense for measuring <b>${it.what}</b>?`,
    hint:'Think of a unit you know: a centimeter is about the width of a fingernail, a meter is about one big step, a kilometer is a long walk.',
    explain:`${it.ok[0].toUpperCase()+it.ok.slice(1)} give a sensible number for ${it.what}.`};
}

/* ---------- Station 2: rates ---------- */
const RCTX=[
  {s:(x,y)=>`${money(x)} buys ${fmt(y)} pounds of apples.`,xn:'dollars',xs:'dollar',yn:'pounds',ys:'pound',mx:1},
  {s:(x,y)=>`${fmt(x)} cups of flour make ${fmt(y)} batches of cookies.`,xn:'cups',xs:'cup',yn:'batches',ys:'batch',xbig:1},
  {s:(x,y)=>`${fmt(x)} gallons of paint cover ${fmt(y)} walls.`,xn:'gallons',xs:'gallon',yn:'walls',ys:'wall'},
  {s:(x,y)=>`${fmt(x)} liters of water fill ${fmt(y)} bottles.`,xn:'liters',xs:'liter',yn:'bottles',ys:'bottle',ybig:1},
  {s:(x,y)=>`${money(x)} buys ${fmt(y)} ounces of tea.`,xn:'dollars',xs:'dollar',yn:'ounces',ys:'ounce',mx:1}
];
const NICE=[2,4,5,8,10,16,20,25,40];
function ratePair(c){let x,y;do{x=pick(NICE);y=pick(NICE);}while(x===y||!nice2(x/y)||!nice2(y/x)||(c.xbig&&x<y)||(c.ybig&&y<x));return [x,y];}
function genRate(){
  const c=pick(RCTX),[x,y]=ratePair(c),rx=x/y,ry=y/x;
  const type=pick(['rx','ry','meaning','same','use','use']);
  const unitX=c.mx?'dollars':c.xn;
  if(type==='rx'||type==='ry'){
    const wantX=type==='rx',[ans,other,top,bot]=wantX?[rx,ry,c.xn,c.ys]:[ry,rx,c.yn,c.xs];
    return {kind:'num',unit:`${top} per ${bot}`,answer:ans,
      prompt:`${c.s(x,y)} How many <b>${top} per ${bot}</b>?`,
      hint:`“${top} per ${bot}” means ${top} for 1 ${bot}. Divide the ${top} by the ${wantX?c.yn:c.xn}.`,
      misc:[[other,`That is ${wantX?c.yn:c.xn} per ${wantX?c.xs:c.ys}, the other unit rate. Put the ${top} on top: ${fmt(wantX?x:y)} ÷ ${fmt(wantX?y:x)}.`]],
      explain:`${fmt(wantX?x:y)} ÷ ${fmt(wantX?y:x)} = ${fmt(ans)} ${top} per ${bot}.`};
  }
  if(type==='meaning'){
    const cs=shuffle([{t:`It costs or takes ${fmt(rx)} ${c.xn} for each ${c.ys}.`,ok:1},{t:`You get ${fmt(rx)} ${c.yn} for each ${c.xs}.`,why:`That would be ${c.yn} per ${c.xs}, which is ${fmt(y)} ÷ ${fmt(x)} = ${fmt(ry)}.`},{t:`There are ${fmt(rx)} ${c.yn} in all.`,why:`There are ${fmt(y)} ${c.yn} in all. ${fmt(rx)} is a rate: an amount for 1.`}]);
    const why={};let ans;const choices=cs.map((q,i)=>{const id='abc'[i];if(q.ok)ans=id;else why[id]=q.why;return {id,label:q.t.replace('costs or takes',c.mx?'costs':'takes')};});
    return {kind:'mc',stack:true,choices,answer:ans,why,
      prompt:`${c.s(x,y)} ${fmt(x)} ÷ ${fmt(y)} = ${fmt(rx)}. What does <b>${fmt(rx)}</b> mean?`,
      hint:`The number on top of the division (${fmt(x)} ${c.xn}) tells you the unit. The number you divided by (${c.yn}) is the “per”.`,
      explain:`${fmt(x)} ${c.xn} ÷ ${fmt(y)} ${c.yn} = ${fmt(rx)} ${c.xn} per ${c.ys}.`};
  }
  if(type==='same'){
    const ks=shuffle([1,2,3,4,5]).slice(0,4).sort((a,b)=>a-b),bad=R(0,3);
    const rows=ks.map((k,i)=>i===bad?[k*x,k*y+pick([1,2])]:[k*x,k*y]);
    const why={};const choices=rows.map((r,i)=>{if(i!==bad)why['r'+i]=`${fmt(r[0])} ÷ ${fmt(r[1])} = ${fmt(rx)}, the same unit rate as the others.`;return {id:'r'+i,label:`${c.mx?money(r[0]):fmt(r[0])} ${c.mx?'':c.xn+' '}for ${fmt(r[1])} ${c.yn}`};});
    const br=rows[bad];
    return {kind:'mc',stack:true,choices,answer:'r'+bad,why,
      prompt:`Three of these match the same rate. Which one <b>doesn’t belong</b>?`,
      hint:`Find the ${c.xn} per ${c.ys} for each row. Equivalent ratios have the same unit rate.`,
      explain:`The others all have ${fmt(rx)} ${c.xn} per ${c.ys}. This one: ${fmt(br[0])} ÷ ${fmt(br[1])} = ${fmt(br[0]/br[1])}.`};
  }
  let z=R(3,12);while(z===y)z=R(3,12);
  const ans=z*rx;
  return {kind:'num',unit:unitX,answer:ans,
    fig:tableFig({hx:c.mx?'Dollars':c.xn[0].toUpperCase()+c.xn.slice(1),hy:c.yn[0].toUpperCase()+c.yn.slice(1)},[{x,y},{x:rx,y:1,h:1,note:`÷ ${fmt(y)}`},{x:ans,y:z,q:'x',note:`× ${z}`}]),
    prompt:`${c.s(x,y)} At this rate, how many ${unitX} for <b>${z} ${c.yn}</b>?`,
    hint:`Find the ${c.xn} for 1 ${c.ys} first: ${fmt(x)} ÷ ${fmt(y)}. Then multiply by ${z}.`,
    misc:[[z*ry,`You used ${c.yn} per ${c.xs}. You need ${c.xn} per ${c.ys}: ${fmt(x)} ÷ ${fmt(y)} = ${fmt(rx)}.`],[x+(z-y),'You added. Find the amount for 1 first, then multiply.']],
    explain:`${fmt(x)} ÷ ${fmt(y)} = ${fmt(rx)} ${c.xn} per ${c.ys}. ${fmt(rx)} × ${z} = ${fmt(ans)}.`};
}

/* ---------- Station 3: speed & pace ---------- */
const WHO=['Lin','Andre','Priya','Diego','Jada','Noah','Mai','Kiran'];
function genSpeed(){
  const type=pick(['speed','pace','faster','faster','time']);
  const [p1,p2]=shuffle(WHO);
  if(type==='speed'){
    const t=R(2,8),v=R(3,12),d=v*t;
    const ticks=[];for(let i=0;i<=t;i++)ticks.push({t:i,b:i*v,st:1,sb:i===0||i===t?1:0,q:i===1?'b':null});
    return {kind:'num',unit:'meters per second',answer:v,fig:dnl('time (seconds)','distance (meters)',ticks),
      prompt:`${p1} runs ${d} meters in ${t} seconds at a constant speed. What is ${p1}’s <b>speed</b> in meters per second?`,
      hint:`Speed is meters for 1 second. Split ${d} meters into ${t} equal parts.`,
      misc:[[t/d,'That is seconds per meter: the pace. Speed is meters ÷ seconds.']],
      explain:`${d} ÷ ${t} = ${v} meters per second.`};
  }
  if(type==='pace'){
    const p=pick([3,4,5,6,8,10,12,15]),d=R(2,6),t=p*d;
    const ticks=[];for(let i=0;i<=d;i++)ticks.push({t:i,b:i*p,st:1,sb:i===0||i===d?1:0,q:i===1?'b':null});
    return {kind:'num',unit:'minutes per mile',answer:p,fig:dnl('distance (miles)','time (minutes)',ticks),
      prompt:`${p1} bikes ${d} miles in ${t} minutes at a constant speed. What is ${p1}’s <b>pace</b> in minutes per mile?`,
      hint:`Pace is minutes for 1 mile. Split ${t} minutes into ${d} equal parts.`,
      misc:[[d/t,'That is miles per minute: the speed. Pace is minutes ÷ miles.']],
      explain:`${t} ÷ ${d} = ${p} minutes per mile.`};
  }
  if(type==='faster'){
    const usePace=Math.random()<.6;let a=R(6,14),b=R(6,14);while(b===a)b=R(6,14);
    const win=usePace?(a<b?'A':'B'):(a>b?'A':'B');
    const u=usePace?'minutes per mile':'meters per second';
    return {kind:'mc',choices:[{id:'A',label:p1},{id:'B',label:p2}],answer:win,
      why:{A:usePace?`${p1}’s pace is ${a} minutes for each mile. More minutes per mile means slower.`:`${p1} goes fewer meters each second, so ${p1} is slower.`,B:usePace?`${p2}’s pace is ${b} minutes for each mile. More minutes per mile means slower.`:`${p2} goes fewer meters each second, so ${p2} is slower.`},
      prompt:`${p1}’s ${usePace?'pace':'speed'} is ${a} ${u}. ${p2}’s ${usePace?'pace':'speed'} is ${b} ${u}. <b>Who is faster?</b>`,
      explain:usePace?`Pace is time for 1 mile, so a <b>smaller</b> pace is faster. ${win==='A'?p1:p2} takes only ${Math.min(a,b)} minutes per mile.`:`Speed is distance in 1 second, so a <b>bigger</b> speed is faster.`};
  }
  if(Math.random()<.5){
    const v=R(3,12),T=R(3,12),D=v*T;
    return {kind:'num',unit:'seconds',answer:T,
      prompt:`A drone flies at a constant speed of ${v} meters per second. How many seconds does it take to fly <b>${D} meters</b>?`,
      hint:`Each second covers ${v} meters. How many groups of ${v} fit in ${D}?`,
      misc:[[D*v,`That multiplies meters by meters per second. Divide instead: ${D} ÷ ${v}.`]],
      explain:`${D} ÷ ${v} = ${T} seconds.`};
  }
  const p=pick([4,5,6,8,10,12]),d=R(3,9);
  return {kind:'num',unit:'minutes',answer:p*d,
    prompt:`${p1} walks at a pace of ${p} minutes per mile. How many minutes does it take to walk <b>${d} miles</b>?`,
    hint:`Each mile takes ${p} minutes. Add ${p} minutes for every mile.`,
    misc:[[p/d,`${p} minutes is for one mile, so ${d} miles take longer. Multiply.`],[p+d,'Multiply the minutes for 1 mile by the number of miles.']],
    explain:`${p} × ${d} = ${p*d} minutes.`};
}

/* ---------- Station 4: percent strips, double number lines, tapes ---------- */
const PCTX=[
  {whole:(W)=>`A water tank holds ${W} liters.`,part:p=>`How many liters is ${p}% of the tank?`,have:a=>`It has ${a} liters in it.`,u:'liters'},
  {whole:(W)=>`A hiking trail is ${W} kilometers long.`,part:p=>`How far is ${p}% of the trail?`,have:a=>`Priya has hiked ${a} kilometers.`,u:'kilometers'},
  {whole:(W)=>`A phone battery holds ${W} units of charge.`,part:p=>`How many units is ${p}% of a full charge?`,have:a=>`It has ${a} units right now.`,u:'units'},
  {whole:(W)=>`Noah’s savings goal is $${W}.`,part:p=>`How many dollars is ${p}% of the goal?`,have:a=>`Noah has saved $${a}.`,u:'dollars',over:1},
  {whole:(W)=>`A bread recipe calls for ${W} grams of flour.`,part:p=>`Diego makes a batch with ${p}% of that flour. How many grams is that?`,have:a=>`Diego used ${a} grams of flour.`,u:'grams',over:1}
];
function genStrip(){
  const type=pick(['coins','coins','dnlA','dnlA','dnlP','tape','tape']);
  if(type==='coins'){
    let list,tot;do{list=[];const k=R(2,6);for(let i=0;i<k;i++)list.push(pick(COIN_SET));tot=list.reduce((s,c)=>s+c.v,0);}while(tot>100||tot<5);
    list.sort((a,b)=>b.v-a.v);
    return {kind:'num',unit:'%',answer:tot,fig:coinsFig(list),
      prompt:`What <b>percent of a dollar</b> is this?`,
      hint:'A dollar is 100 cents, so each cent is 1% of a dollar. Add up the cents.',
      misc:[[list.length,'That is the number of coins. Add up how many cents they are worth.'],[tot/100,`${fmt(tot/100)} is the amount in dollars. As a percent of a dollar, that is ${tot}%.`]],
      explain:`${list.map(c=>c.v).join(' + ')} = ${tot} cents. ${tot} out of 100 cents is ${tot}%.`};
  }
  if(type==='dnlA'||type==='dnlP'){
    const c=pick(PCTX),s=pick([20,25,50,25]),over=c.over&&s!==20&&Math.random()<.5,top=over?150:100;
    const unit=pick([2,3,4,5,6,8,10,12,15,20,25]),W=unit*100/s;
    const js=[];for(let p=s;p<=top;p+=s)if(p!==100)js.push(p);const P=pick(js),A=W*P/100;
    const ticks=[];for(let p=0;p<=top;p+=s){const hit=p===P;ticks.push({t:W*p/100,b:p,st:p===0||p===100?1:(hit?(type==='dnlP'?1:0):2),sb:type==='dnlA'||!hit?1:0,q:hit?(type==='dnlA'?'t':'b'):null});}
    const fig=dnl(c.u==='dollars'?'dollars':c.u,'percent',ticks,{fb:pctF});
    if(type==='dnlA')return {kind:'num',unit:c.u,answer:A,fig,
      prompt:`${c.whole(W)} ${c.part(P)}`,
      hint:`100% is ${W}. Each step of ${s}% is the same amount: ${W} ÷ ${100/s}.`,
      misc:[[P,`That is the percent. The question asks for ${c.u}.`],[W+P-100,'Percents are parts of the whole. Find the amount for one step, then count steps.']],
      explain:`${s}% of ${W} is ${fmt(W*s/100)}. ${P}% is ${P/s} steps: ${P/s} × ${fmt(W*s/100)} = ${fmt(A)} ${c.u}.${P>100?' More than 100% means more than the whole.':''}`};
    return {kind:'num',unit:'%',answer:P,fig,
      prompt:`${c.whole(W)} ${c.have(fmt(A))} What <b>percent</b> of ${c.u==='dollars'?'the goal':'the whole'} is that?`,
      hint:`Line up the amounts with the percents. Each ${fmt(W*s/100)} ${c.u} is another ${s}%.`,
      misc:[[A,'That is the amount. The question asks what percent it is.'],[A/W,`${fmt(A/W)} is the fraction of the whole. As a percent, multiply by 100.`]],
      explain:`${fmt(A)} is ${fmt(A)} ÷ ${fmt(W*s/100)} = ${P/s} steps of ${s}%, so ${P}%.`};
  }
  const n=pick([4,5,10]),m=R(1,n-1),each=pick([2,3,4,5,6,8,12,15]),W=n*each,part=m*each,P=100*m/n,c=pick(PCTX);
  if(Math.random()<.5)return {kind:'num',unit:c.u,answer:part,fig:pctTape(n,m,{W,part,qP:1,each}),
    prompt:`${c.whole(W)} ${c.part(P)}`,
    hint:`The whole tape is ${n} equal boxes, so each box is ${100/n}% and worth ${W} ÷ ${n}.`,
    misc:[[P,'That is the percent. Find the amount.'],[each,`That is one box. ${P}% is ${m} boxes.`]],
    explain:`${W} ÷ ${n} = ${each} per box. ${m} boxes × ${each} = ${part} ${c.u}.`};
  return {kind:'num',unit:c.u,answer:W,fig:pctTape(n,m,{W,part,qW:1,each}),
    prompt:`${fmt(part)} ${c.u} is ${P}% of the whole. How many ${c.u} is the <b>whole</b> (100%)?`,
    hint:`${P}% fills ${m} boxes. Find one box (${part} ÷ ${m}), then fill all ${n}.`,
    misc:[[part*P/100,`That is ${P}% of ${part}. Here ${part} <i>is</i> the ${P}%: the whole is bigger.`],[each,`That is one box. The whole is ${n} boxes.`]],
    explain:`${part} ÷ ${m} = ${each} per box. ${n} boxes × ${each} = ${W} ${c.u}.`};
}

/* ---------- Station 5: benchmark percentages ---------- */
const BENCH={10:['1/10','÷ 10'],20:['1/5','÷ 5'],25:['1/4','÷ 4'],50:['1/2','÷ 2'],75:['3/4','÷ 4, then × 3'],1:['1/100','÷ 100']};
const BMC={10:['1/10','1/100','0.01'],20:['1/5','1/20','0.02'],25:['1/4','1/25','0.025'],50:['1/2','1/50','0.05'],75:['3/4','1/75','0.075'],1:['1/100','1/10','0.1']};
function genBench(){
  const type=pick(['of','of','of','sale','back','frac']);
  const P=pick(type==='of'?[10,25,50,75,20,1]:[10,25,50,75,20]);
  if(type==='frac'){
    const [ok,...bad]=BMC[P];const cs=shuffle([ok,...bad]);
    return {kind:'mc',choices:cs.map(x=>({id:x,label:x})),answer:ok,
      why:Object.fromEntries(bad.map(b=>[b,`${P}% means ${P} out of 100, which is ${P}/100. ${b} is not the same.`])),
      prompt:`Which is the same as <b>${P}%</b>?`,
      hint:`${P}% means ${P} out of 100. Simplify ${P}/100.`,
      explain:`${P}% = ${P}/100 = ${ok}.`};
  }
  if(type==='back'){
    const W=pick([20,40,60,80,100,120,200,240,400]),x=W*P/100;
    return {kind:'num',unit:'',answer:W,
      prompt:`${P}% of a number is ${fmt(x)}. What is the number?`,
      hint:`${P}% is ${BENCH[P][0]} of the number. How many copies of ${P}% make 100%?`,
      misc:[[x*P/100,`That is ${P}% of ${fmt(x)}. Here ${fmt(x)} <i>is</i> ${P}%: the whole number is bigger.`],[x/P,`That would be 1% of the number. Multiply by 100 to get 100%.`]],
      explain:`${P}% is ${BENCH[P][0]}, so the number is ${fmt(x)} × ${fmt(100/P)} = ${W}.`};
  }
  const W=pick(P===75||P===25?[8,12,16,20,24,36,40,48,60,80,120]:[10,20,30,40,50,60,70,80,90,120,150,200,250,300,340,500]),x=W*P/100;
  if(type==='sale'){
    const item=pick(['jacket','skateboard','video game','pair of shoes','backpack']),askSale=Math.random()<.5;
    return {kind:'num',unit:'dollars',answer:askSale?W-x:x,
      prompt:`A ${item} costs ${money(W)}. It is on sale for <b>${P}% off</b>. ${askSale?'What is the <b>sale price</b>?':'How much money do you <b>save</b>?'}`,
      hint:`${P}% is ${BENCH[P][0]}. Find ${P}% of ${money(W)} (${BENCH[P][1]}).${askSale?' Then subtract it.':''}`,
      misc:askSale?[[x,`That is how much you save. Subtract it from ${money(W)}.`],[W-P,`You subtracted ${P} dollars, not ${P}%. Find ${P}% of ${money(W)} first.`]]:[[W-x,`That is the sale price. The question asks how much you save.`],[W/P,`${P}% is ${BENCH[P][0]}, so ${BENCH[P][1]}.`]],
      explain:`${P}% of ${money(W)} is ${money(x)}.${askSale?` ${money(W)} − ${money(x)} = ${money(W-x)}.`:''}`};
  }
  return {kind:'num',unit:'',answer:x,
    prompt:`What is <b>${P}% of ${W}</b>?`,
    hint:`${P}% is ${BENCH[P][0]}, so ${BENCH[P][1]}.`,
    misc:[[W/P,`${P}% means ${P} out of 100, which is ${BENCH[P][0]}. Use ${BENCH[P][1]}, not ÷ ${P}.`],[W*P,'Multiplying by '+P+' makes it bigger. '+P+'% is only part of the number.']],
    explain:`${P}% = ${BENCH[P][0]}. ${W} ${BENCH[P][1]} = ${fmt(x)}.`};
}

/* ---------- Station 6: percentage problems ---------- */
const DCTX=[
  {all:'students',where:'in the class',verb:'play an instrument'},
  {all:'seats',where:'in the theater',verb:'are filled'},
  {all:'pages',where:'in the book',verb:'have pictures'},
  {all:'cars',where:'in the parking lot',verb:'are red'},
  {all:'plants',where:'in the garden',verb:'are tomatoes'}
];
function genDetect(){
  const c=pick(DCTX),type=pick(['part','whole','pct']);
  const P=pick([10,15,20,25,30,35,40,45,60,65,70,75,80,90]),W=20*R(1,15),x=W*P/100;
  const hint=`Find 10% first (the whole ÷ 10) or 1% (the whole ÷ 100), then scale up.`;
  if(type==='part')return {kind:'num',unit:c.all,answer:x,fig:pctLine(W,P,x,{askA:1}),
    prompt:`There are ${W} ${c.all} ${c.where}. ${P}% of them ${c.verb}. How many ${c.all} ${c.verb}?`,hint,
    misc:[[W/P,`${P}% is not “divide by ${P}”. It means ${P} out of every 100.`],[W*P,`Multiply by ${P}/100, not by ${P}.`],[W-P,'Percents are parts of the whole, not an amount to subtract.']],
    explain:`1% of ${W} is ${fmt(W/100)}. ${P} × ${fmt(W/100)} = ${fmt(x)} ${c.all}.`};
  if(type==='whole'){
    const whole=pick([20,40,60,80,100,120,160,200]),P2=pick([5,10,20,25,30,40,50,60,75,80].filter(p=>nice2(whole*p/100)&&Number.isInteger(whole*p/100))),x2=whole*P2/100;
    return {kind:'num',unit:c.all,answer:whole,fig:pctLine(whole,P2,x2,{askW:1}),
      prompt:`${fmt(x2)} ${c.all} ${c.where} ${c.verb}. That is ${P2}% of all the ${c.all}. How many ${c.all} are ${c.where}?`,
      hint:`${fmt(x2)} is ${P2}%. Divide to find 1% (${fmt(x2)} ÷ ${P2}), then multiply by 100.`,
      misc:[[x2*P2/100,`That is ${P2}% of ${fmt(x2)}. Here ${fmt(x2)} <i>is</i> the ${P2}%, so the whole is bigger.`],[x2/P2,'That is 1%. Multiply by 100 to get the whole.']],
      explain:`${fmt(x2)} ÷ ${P2} = ${fmt(x2/P2)} for 1%. × 100 = ${whole} ${c.all}.`};
  }
  return {kind:'num',unit:'%',answer:P,fig:pctLine(W,P,x,{askP:1}),
    prompt:`There are ${W} ${c.all} ${c.where}. ${fmt(x)} of them ${c.verb}. What <b>percent</b> of the ${c.all} ${c.verb}?`,
    hint:`Divide the part by the whole (${fmt(x)} ÷ ${W}), then multiply by 100.`,
    misc:[[x/W,`${fmt(x/W)} is the part out of 1. Multiply by 100 to get the percent.`],[W/x,'Divide the part by the whole, not the whole by the part.']],
    explain:`${fmt(x)} ÷ ${W} = ${fmt(x/W)}, and ${fmt(x/W)} × 100 = ${P}%.`};
}

/* ---------- stations ---------- */
const ICON={
  conv:'<g stroke="#ffc93c" stroke-width="2.5" fill="rgba(255,201,60,.15)"><rect x="4" y="12" width="56" height="14" rx="2"/></g><g stroke="#ffc93c" stroke-width="2"><line x1="18" y1="12" x2="18" y2="20"/><line x1="32" y1="12" x2="32" y2="20"/><line x1="46" y1="12" x2="46" y2="20"/></g><g stroke="#7fe3ff" stroke-width="2.5" fill="rgba(127,227,255,.15)"><rect x="4" y="38" width="56" height="14" rx="2"/></g><g stroke="#7fe3ff" stroke-width="1.5"><line x1="8.7" y1="38" x2="8.7" y2="44"/><line x1="13.3" y1="38" x2="13.3" y2="44"/><line x1="18" y1="38" x2="18" y2="46"/><line x1="22.7" y1="38" x2="22.7" y2="44"/><line x1="27.3" y1="38" x2="27.3" y2="44"/><line x1="32" y1="38" x2="32" y2="46"/></g>',
  rate:'<text x="32" y="28" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="17" fill="#ffc93c">$12</text><line x1="12" y1="34" x2="52" y2="34" stroke="#f3f6fb" stroke-width="2.5"/><text x="32" y="54" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="15" fill="#7fe3ff">4 lb</text>',
  speed:'<g fill="none" stroke-width="3" stroke-linecap="round"><path d="M10,50 A26,26 0 1 1 54,50" stroke="#f3f6fb"/><line x1="32" y1="36" x2="48" y2="20" stroke="#ffc93c"/></g><circle cx="32" cy="36" r="4" fill="#ffc93c"/><g stroke="#7fe3ff" stroke-width="2"><line x1="15" y1="22" x2="19" y2="25"/><line x1="32" y1="12" x2="32" y2="16"/><line x1="49" y1="22" x2="45" y2="25"/></g>',
  strip:'<rect x="4" y="20" width="56" height="18" fill="rgba(127,227,255,.15)" stroke="#7fe3ff" stroke-width="2.5"/><rect x="4" y="20" width="33.6" height="18" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2.5"/><text x="20" y="54" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="12" fill="#ffc93c">60%</text>',
  bench:'<circle cx="32" cy="32" r="24" fill="rgba(127,227,255,.15)" stroke="#7fe3ff" stroke-width="2.5"/><path d="M32,32 L32,8 A24,24 0 0 1 56,32 Z" fill="rgba(255,201,60,.55)" stroke="#ffc93c" stroke-width="2.5"/>',
  detect:'<circle cx="26" cy="26" r="16" fill="rgba(127,227,255,.12)" stroke="#7fe3ff" stroke-width="3"/><line x1="38" y1="38" x2="56" y2="56" stroke="#7fe3ff" stroke-width="5" stroke-linecap="round"/><text x="26" y="32" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="16" fill="#ffc93c">%</text>',
  boss:'<rect x="6" y="6" width="52" height="52" rx="4" fill="none" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="5 4"/><polygon points="32,12 38,26 53,27 41,37 45,52 32,43 19,52 23,37 11,27 26,26" fill="#ffc93c"/>'
};
const ZONES=[
  {id:'conv',name:'Unit Converter',lessons:'Lessons 2–4',blurb:'Pick sensible units and convert between them. Smaller units mean more of them.',gen:genConv},
  {id:'rate',name:'Rate Lab',lessons:'Lessons 6–7',blurb:'Every ratio has two unit rates. Find them, read them, and use the right one.',gen:genRate},
  {id:'speed',name:'Speed & Pace Track',lessons:'Lessons 5, 8–9',blurb:'Meters per second or minutes per mile? Find who is faster and how long a trip takes.',gen:genSpeed},
  {id:'strip',name:'Percent Strip',lessons:'Lessons 10–12',blurb:'Percent of a dollar, percents on double number lines, and tape diagrams.',gen:genStrip},
  {id:'bench',name:'Benchmark Shop',lessons:'Lesson 13',blurb:'10%, 25%, 50%, 75% in your head. Sales, discounts, and working backward.',gen:genBench},
  {id:'detect',name:'Percent Detective',lessons:'Lessons 14–16',blurb:'Find the part, the whole, or the percent.',gen:genDetect},
  {id:'boss',name:'Final Lap',lessons:'Whole unit · 10 problems',blurb:'A mixed review from every station. Aim for 3 stars.',gen:()=>pick([genConv,genRate,genSpeed,genStrip,genBench,genDetect])()}
];
