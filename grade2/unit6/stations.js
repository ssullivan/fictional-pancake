/* Clockwork Carnival (Grade 2 Unit 6): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Flat and solid shapes, equal parts, pattern blocks, clocks, the day bar, and money come from shared/k5.js; mcOf and miscOf from shared/util.js. */
const KIDS=['Mai','Diego','Lin','Han','Priya','Kiran','Elena','Jada','Noah','Clare','Andre','Tyler'];
const cap=s=>s[0].toUpperCase()+s.slice(1);
const plural=w=>w==='rhombus'?'rhombuses':w+'s';
/* mc choices that are pictures: build the choices from values, then draw each as "Picture A", "Picture B", … */
function picChoices(list,draw,extra){
  const P=mcOf(list.map(([v,m])=>[JSON.stringify(v),m]),extra);
  P.choices.forEach((c,i)=>{c.label=draw(JSON.parse(c.label),`Picture ${'ABCD'[i]}`);});
  return P;
}

/* ---------- Shape Tent: shapes (Lessons 1–4) ---------- */
function genShapes(){
  const k=R(0,4);
  if(k===0){
    const n=R(3,6),others=shuffle([3,4,5,6].filter(m=>m!==n)).slice(0,2),list=shuffle([n,...others]).map(m=>pick(SHAPES[m])),at=list.findIndex(s=>s.length===n),name=SHAPE_NAME[n];
    return {kind:'tap',answer:String(at),prompt:`Tap the <b>${name}</b>.`,
      why:Object.fromEntries(list.map((s,i)=>[String(i),`That shape has ${s.length} sides. A ${name} has ${n}.`]).filter(([i])=>i!==String(at))),
      fig:show=>shapeRow(list.map(s=>[s,{nums:show}]),{tap:'Shape',label:'Shape'}),
      hint:`A ${name} has ${n} sides. Count the sides of each shape.`,
      explain:`A ${name} has ${n} sides and ${n} corners. Shape ${at+1} has ${n} sides.`};
  }
  if(k===1){
    const n=R(3,6),s=pick(SHAPES[n].slice(1)),near=shuffle([n-1,n+1].filter(m=>m>=3&&m<=6).concat([3,4,5,6].filter(m=>Math.abs(m-n)>1))).slice(0,2);
    return {...mcOf([[cap(SHAPE_NAME[n]),null],...near.map(m=>[cap(SHAPE_NAME[m]),`A ${SHAPE_NAME[m]} has ${m} sides. Count the sides again.`])]),
      prompt:'What is this shape called?',fig:show=>shapeFig(s,{s:200,nums:show}),
      hint:'Count the sides: 3 is a triangle, 4 is a quadrilateral, 5 is a pentagon, and 6 is a hexagon.',
      explain:`It has ${n} sides and ${n} corners, so it’s a ${SHAPE_NAME[n]}.`};
  }
  if(k===2){
    const n=R(4,6),s=pick(SHAPES[n]),w=pick(['sides','corners']);
    return {kind:'num',unit:w,answer:n,prompt:`How many ${w} does this shape have?`,fig:show=>shapeFig(s,{s:200,nums:show}),
      misc:[[n-1,'Count again. Start at one corner and go all the way around.'],[n+1,'Count again. Don’t count your first one twice.']],
      hint:'Put your finger on one corner. Count each side as you go all the way around.',
      explain:`It has ${n} sides and ${n} corners: it’s a ${SHAPE_NAME[n]}.`};
  }
  if(k===3){
    /* side lengths: all the same, or a square (the same lengths and square corners) */
    const e=R(2,5),w=e+R(1,3),h=R(2,e),t=R(2,3),square=Math.random()<.5,same=square?'rhombus':pick(['square','rhombus']);
    const L={square:[e,e,e,e],rhombus:[e,e,e,e],rectangle:[w,h,w,h],trapezoid:[t,t+1,t+3,t+1]};
    const kinds=square?['square','rectangle','rhombus']:[same,'rectangle','trapezoid'],order=shuffle(kinds),ans=square?'square':same;
    const why={rectangle:square?'Shape {} has square corners, but its sides are not all the same length.':'Shape {} has sides of two lengths.',
      rhombus:'Shape {} has sides that are all the same length, but its corners are not square corners.',trapezoid:'Shape {} has sides of different lengths.'};
    const lab=i=>'ABC'[i];
    return {kind:'mc',choices:order.map((q,i)=>({id:'abc'[i],label:lab(i)})),answer:'abc'[order.indexOf(ans)],
      why:Object.fromEntries(order.map((q,i)=>[ 'abc'[i],(why[q]||'').replace('{}',lab(i))]).filter(([,m])=>m)),
      prompt:square?'Which shape is a <b>square</b>?':'Which shape has <b>4 sides that are all the same length</b>?',
      fig:()=>shapeRow(order.map(q=>[QUADS[q],{lens:L[q].map(v=>`${v} cm`),sq:true}]),{letters:true,label:'Shape'}),
      hint:square?'A square has 4 sides that are all the same length and 4 square corners.':'Read the side lengths of each shape. Are all 4 the same?',
      explain:square?`Shape ${lab(order.indexOf('square'))} has 4 sides of ${e} cm and 4 square corners, so it’s a square.`:`Every side of shape ${lab(order.indexOf(same))} is ${e} cm.`};
  }
  /* solid shapes: count the faces */
  const kind=pick(['cube','cube','box','pyramid','prism']),S=SOLIDS[kind],seen=(solidFig(kind).match(/class="sf /g)||[]).length,all=S.faces.reduce((t,[n])=>t+n,0);
  const TYPE={pyramid:['triangle',4,[[2,'You can see 2 triangles. There are 2 more on the back.'],[5,'That’s all the faces. How many are triangles?']]],
    prism:['rectangle',3,[[1,'You can see 1 rectangle. There are more on the bottom and the left.'],[5,'That’s all the faces. How many are rectangles?']]]};
  const list=S.faces.map(([n,w])=>`${n} ${n>1?plural(w):w}`).join(' and ');
  if(TYPE[kind]&&Math.random()<.5){
    const [w,n,misc]=TYPE[kind];
    return {kind:'num',unit:`${plural(w)}`,answer:n,prompt:`How many faces of this ${S.name} are <b>${plural(w)}</b>?`,fig:show=>solidFig(kind,{back:show,s:120}),
      misc,hint:'The dashed lines show the edges on the back. Count the faces on the back too.',
      explain:`A ${S.name} has ${all} faces: ${list}.`};
  }
  return {kind:'num',unit:'faces',answer:all,prompt:`How many faces does this ${S.name} have?`,fig:show=>solidFig(kind,{back:show,s:120}),
    misc:miscOf(all,[[seen,'That’s how many faces you can see. Some faces are on the back and the bottom.'],...(kind==='cube'||kind==='box'?[[8,'8 is the number of corners. Count the flat faces.'],[12,'12 is the number of edges. Count the flat faces.']]:[])]),
    hint:'Count the faces you can see. The dashed lines show edges on the back, so count the faces there too.',
    explain:`A ${S.name} has ${all} faces: ${list}.`};
}

/* ---------- Pie Stand: halves, thirds, and fourths (Lessons 6–9) ---------- */
const FOOD={circle:['pizza','pie','pancake','tortilla'],square:['sandwich','waffle','slice of bread','cracker'],rect:['granola bar','brownie','sheet of paper','cake']};
/* an equal way to cut this shape into n parts */
const cutOf=(shape,n)=>shape==='circle'?'v':pick(shape==='square'?(n===2?['v','h','diag']:n===4?['v','h','grid','diag']:['v','h']):['v','h'].concat(n===4?['grid']:[]));
function genParts(){
  const k=R(0,4),shape=pick(['circle','circle','square','rect']),food=pick(FOOD[shape]),n=R(2,4),how=cutOf(shape,n),name=pick(KIDS);
  if(k===0){
    const m=pick([2,3,4].filter(v=>v!==n)),list=shuffle([{n,how,ok:1},{n,how:'uneq'},{n:m,how:cutOf(shape,m)}]),at=list.findIndex(q=>q.ok);
    return {kind:'tap',answer:String(at),prompt:`Tap the ${food} cut into <b>${PART[n][1]}</b>.`,
      why:Object.fromEntries(list.map((q,i)=>[String(i),q.how==='uneq'?`That one has ${n} pieces, but they are not the same size.`:`That one has ${q.n} equal pieces: ${PART[q.n][1]}.`]).filter(([i])=>i!==String(at))),
      fig:()=>shareRow(shape,list,{tap:'Picture',label:'Picture'}),
      hint:`${cap(PART[n][1])} means ${n} pieces that are all the same size.`,
      explain:`Picture ${at+1} has ${n} equal pieces, so each piece is 1 ${PART[n][0]}.`};
  }
  if(k===1){
    /* mistakes: naming the part that isn't shaded, or miscounting the pieces (never "3 halves") */
    const s=R(1,n-1),wrong=[...(s!==n-s?[[partName(n,n-s),'That’s the part that is not shaded.']]:[]),...[2,3,4].filter(v=>v!==n&&v>=s).map(v=>[partName(v,s),`Count all the pieces. There are ${n}, not ${v}.`])].slice(0,2);
    return {...mcOf([[partName(n,s),null],...wrong]),prompt:`What part of the ${food} is shaded?`,
      fig:()=>shareFig(shape,n,how,{shade:range(s),s:150,label:`A ${food} cut into ${n} equal pieces, ${s} shaded`}),
      hint:`Count all the equal pieces: that tells if they are halves, thirds, or fourths. Then count the shaded ones.`,
      explain:`There are ${n} equal pieces, so each is 1 ${PART[n][0]}. ${s} ${s>1?'are':'is'} shaded: ${partName(n,s)}.`};
  }
  if(k===2){
    const whole=Math.random()<.5;
    return {kind:'num',unit:whole?PART[n][1]:'pieces',answer:n,
      prompt:whole?`${name} cuts a ${food} into ${PART[n][1]}. How many ${PART[n][1]} make the whole ${food}?`:`${name} cuts a ${food} into ${PART[n][1]}. How many equal pieces are there?`,
      fig:show=>shareFig(shape,show?n:1,show?how:'v',{s:150,label:show?`A ${food} cut into ${n} equal pieces`:`A whole ${food}`}),
      misc:[2,3,4].filter(v=>v!==n).map(v=>[v,`${cap(PART[v][1])} would be ${v} pieces. ${cap(PART[n][1])} are ${n}.`]),
      hint:'Halves are 2 equal pieces, thirds are 3, and fourths are 4.',
      explain:`${cap(PART[n][1])} are ${n} equal pieces. ${partName(n,n)} make the whole ${food}.`};
  }
  if(k===3){
    const [a,b]=shuffle([2,3,4]).slice(0,2),other=pick(KIDS.filter(x=>x!==name)),big=a<b?name:other,small=a<b?other:name;
    return {...mcOf([[`${big}’s`,null],[`${small}’s`,`${small} cut more pieces, so each piece is smaller.`],['They’re the same size','Both start the same size, but one is cut into more pieces. Look at 1 piece of each.']]),
      prompt:`${name} and ${other} each have a ${food}, the same size. ${name} cuts it into <b>${PART[a][1]}</b>. ${other} cuts it into <b>${PART[b][1]}</b>. Whose pieces are bigger?`,
      fig:show=>shareRow(shape,[{n:a,how:'v',shade:show?[0]:[]},{n:b,how:'v',shade:show?[0]:[]}],{label:cap(food)}),
      hint:'More pieces means smaller pieces. Look at 1 piece of each.',
      explain:`${cap(PART[Math.min(a,b)][1])} are bigger than ${PART[Math.max(a,b)][1]}: fewer pieces means bigger pieces. ${big}’s pieces are bigger.`};
  }
  /* pattern blocks */
  const [big,small]=pick([['hexagon','triangle'],['hexagon','triangle'],['hexagon','rhombus'],['hexagon','trapezoid'],['trapezoid','triangle'],['rhombus','triangle']]),n2=PB[big][small];
  return {kind:'num',unit:plural(small),answer:n2,prompt:`How many ${plural(small)} fill this ${big}?`,
    fig:show=>pbFig(big,small,{show:show?true:0,s:80}),
    misc:miscOf(n2,[1,2,3,4,6].map(v=>[v,v<n2?`That’s not enough to fill the ${big}. Picture more ${plural(small)} inside it.`:`That’s too many. They won’t all fit inside the ${big}.`])),
    hint:`One ${small} is drawn inside the dashed ${big}. How many would fill it with no gaps?`,
    explain:`${n2} ${plural(small)} fill the ${big}.`+(big==='hexagon'?' A hexagon is 6 triangles, 3 rhombuses, or 2 trapezoids.':'')};
}

/* ---------- Clock Tower: time (Lessons 11–13) ---------- */
const pad=m=>String(m).padStart(2,'0');
const next=h=>h%12+1,prev=h=>(h+10)%12+1;
/* times of day: what, when (hours and minutes), and whether it's a.m. */
const DAY=[['eat breakfast',[[7,0],[7,30],[8,0]],1],['get to school',[[8,0],[8,15],[8,30]],1],['play at recess',[[10,0],[10,30]],1],['watch the sun come up',[[6,0],[6,30]],1],['be sound asleep',[[1,0],[2,0],[3,0]],1],
  ['go home from school',[[3,0],[3,15],[3,30]],0],['go to soccer practice',[[4,0],[4,30],[5,0]],0],['eat dinner',[[5,30],[6,0],[6,30]],0],['go to bed',[[7,30],[8,0],[8,30]],0]];
const when=(h,am)=>am?(h<5?'in the middle of the night':'in the morning'):(h<5?'in the afternoon':h<8?'in the evening':'at night');
function genTime(){
  const k=R(0,4),h=R(1,12),m=5*R(0,11),mm=pad(m),name=pick(KIDS);
  /* common mistakes: the hands switched, the next hour once the hour hand is past halfway, the number the long hand points to */
  const mistakes=[[[m/5||12,h*5%60],'The short hand shows the hour. The long hand shows the minutes.'],
    m>=30?[[next(h),m],`The hour hand is between ${h} and ${next(h)}. It hasn’t gotten to ${next(h)} yet, so the hour is still ${h}.`]:[[prev(h),m],m?`The hour hand is a little past ${h}, so the hour is ${h}.`:`The short hand points to ${h}.`],
    m?[[h,m/5],`The long hand points to the ${m/5}. Count by 5s: ${m/5} fives is ${m} minutes.`]:[[h,30],'The long hand points straight up to 12: that’s 0 minutes.']];
  const wrongs=mistakes.filter(([[a,b]],i)=>!(a===h&&b===m)&&mistakes.findIndex(([[c,d]])=>c===a&&d===b)===i).slice(0,2);
  const count=m?`The long hand points to the ${m/5}: count by 5s to ${m}.`:'The long hand points to 12: o’clock.';
  const hourSay=m?`The short hand is between ${h} and ${next(h)}, so the hour is ${h}.`:`The short hand points to ${h}.`;
  if(k===0)return {...mcOf([[hm(h,m),null],...wrongs.map(([[a,b],w])=>[hm(a,b),w])]),prompt:'What time does the clock show?',
    fig:show=>clockFig(h,m,{fives:show}),hint:'The short hand shows the hour. Count by 5s to the long hand for the minutes.',explain:`${hourSay} ${count} It’s ${hm(h,m)}.`};
  if(k===1)return {...picChoices([[[h,m],null],...wrongs.map(([t,w])=>[t,w])],([a,b],l)=>clockFig(a,b,{r:64,label:l})),prompt:`Which clock shows <b>${hm(h,m)}</b>?`,
    hint:`The short hour hand should be at ${h}${m?` or a bit past it`:''}. The long minute hand should point to ${m/5||12}.`,explain:`${hourSay} ${count}`};
  if(k===2){
    const q=pick([15,30,45]),say=q===15?`quarter past ${h}`:q===30?`half past ${h}`:`quarter till ${next(h)}`,shade=q===45?[45,60]:[0,q];
    const wrong=q===15?[[`quarter till ${h}`,`Quarter till is 15 minutes <b>before</b> the hour. ${hm(h,15)} is 15 minutes after ${h}.`],[`half past ${h}`,'Half past is 30 minutes. 15 minutes is a quarter of the way around.']]
      :q===30?[[`half past ${next(h)}`,`The hour hand is between ${h} and ${next(h)}. It’s still ${h}-something.`],[`quarter past ${h}`,'Quarter past is 15 minutes. 30 minutes is halfway around.']]
      :[[`quarter till ${h}`,`Quarter till ${h} is 15 minutes before ${h} o’clock. ${hm(h,45)} is 15 minutes before ${next(h)} o’clock.`],[`quarter past ${h}`,'Quarter past is 15 minutes. 45 minutes is three quarters of the way around.']];
    if(Math.random()<.5)return {...mcOf([[cap(say),null],...wrong.map(([t,w])=>[cap(t),w])]),prompt:`What is another way to say <b>${hm(h,q)}</b>?`,
      fig:show=>clockFig(h,q,{shade:show?shade:null}),hint:'15 minutes is a quarter of the way around the clock. 30 minutes is halfway.',explain:`${hm(h,q)} is ${say}.`};
    const times={15:[[h,15],[prev(h),45],[h,45]],30:[[h,30],[next(h),30],[h,15]],45:[[h,45],[next(h),45],[next(h),15]]}[q];
    const msg=[null,q===30?`Half past ${h} is 30 minutes after ${h} o’clock.`:q===15?`${hm(prev(h),45)} is quarter till ${h}. Quarter past is after ${h} o’clock.`:`Quarter till ${next(h)} is before ${next(h)} o’clock, so the hour is still ${h}.`,
      q===30?'Half past means 30 minutes, halfway around.':q===15?'Quarter past means 15 minutes after the hour.':`${hm(next(h),15)} is quarter <b>past</b> ${next(h)}.`];
    return {...mcOf(times.map(([a,b],i)=>[hm(a,b),msg[i]])),prompt:`It’s <b>${say}</b>. What time is it?`,
      fig:show=>clockFig(h,q,{shade:show?shade:null}),hint:'A quarter of an hour is 15 minutes. Half an hour is 30 minutes.',explain:`${cap(say)} is ${hm(h,q)}.`};
  }
  if(k===3){
    const f=R(1,11);
    return {kind:'num',unit:'minutes',answer:5*f,prompt:`The long hand points to the <b>${f}</b>. How many minutes after ${h} o’clock is it?`,
      fig:show=>clockFig(h,5*f,{fives:show}),
      misc:miscOf(5*f,[[f,'Each number on the clock is 5 minutes. Count by 5s.'],[5*f-5,`Count by 5s all the way to the ${f}.`],[5*f+5,`Count by 5s, and stop at the ${f}.`],[10*f,'Count by 5s, not 10s.']]),
      hint:`Count by 5s from the 12 to the ${f}: 5, 10, 15, …`,explain:`${range(f).map(i=>5*(i+1)).join(', ')}. The long hand at ${f} means ${5*f} minutes: ${hm(h,5*f)}.`};
  }
  /* a.m. or p.m.: which time makes sense? */
  const [what,times,am]=pick(DAY),[th,tm]=pick(times),sfx=a=>a?'a.m.':'p.m.';
  let oh,om;do [oh,om]=pick(pick(DAY.filter(d=>d[2]!==am))[1]);while(oh===th&&om===tm);
  return {...mcOf([[`${hm(th,tm)} ${sfx(am)}`,null],[`${hm(th,tm)} ${sfx(!am)}`,`${hm(th,tm)} ${sfx(!am)} is ${when(th,!am)}.`],[`${hm(oh,om)} ${sfx(!am)}`,`${hm(oh,om)} ${sfx(!am)} is ${when(oh,!am)}.`]]),
    prompt:`Which time makes sense for ${name} to <b>${what}</b>?`,fig:show=>dayBar(show?(am?th%12:th%12+12)+tm/60:null),
    hint:'a.m. is from midnight to noon: night and morning. p.m. is from noon to midnight: afternoon, evening, and night.',
    explain:`People ${what.replace(/^be /,'are ')} ${when(th,am)}. ${hm(th,tm)} ${sfx(am)} is ${when(th,am)}.`};
}

/* ---------- Coin Toss: coins (Lessons 15–17) ---------- */
/* coins from counts {q, d, n, p}, most valuable first */
const coinList=c=>['B','q','d','n','p'].flatMap(k=>Array(c[k]||0).fill(k));
const countUp=list=>{let t=0;return list.map(k=>t+=COINS[k].v).join(', ');};
const coinSay=(n,k)=>`${n} ${n===1?COINS[k].name:COINS[k].pl}`;
const coinsSay=c=>['q','d','n','p'].filter(k=>c[k]).map(k=>coinSay(c[k],k)).join(', ');
/* coins that make t cents (a multiple of 5 from 5 to 95): quarters, then dimes, then a nickel */
const makeCents=t=>{const q=R(0,Math.floor(t/25));let r=t-25*q;const d=R(Math.max(0,Math.floor(r/10)-1),Math.floor(r/10));r-=10*d;return {q,d,n:r/5};};
function genCoins(){
  const k=R(0,4);
  if(k<2){
    let c;
    do c=k?{q:R(1,3),d:R(0,2),n:R(0,1),p:R(0,4)}:{d:R(1,5),n:R(0,3),p:R(0,5)};
    while(centsOf(coinList(c))>100||Object.values(c).filter(v=>v).length<2);
    const list=coinList(c),t=centsOf(list),as=(k,v)=>t-(c[k]||0)*(COINS[k].v-v);
    return {kind:'num',unit:'cents',answer:t,prompt:'How much money is this?',fig:show=>moneyFig(list,{vals:show}),
      misc:miscOf(t,[[list.length,'That’s the number of coins. Each kind of coin is worth a different amount.'],...(c.q?[[as('q',10),'A quarter is 25¢, not 10¢.']]:[]),[as('d',5),'A dime is 10¢. The nickel is the one worth 5¢.'],[as('n',1),'A nickel is 5¢, not 1¢.'],[as('n',10),'A nickel is 5¢. The dime is the one worth 10¢.']]),
      hint:(c.q?'Count the quarters by 25s. ':'')+'Count dimes by 10s, then nickels by 5s, then pennies by 1s.',
      explain:`Start with the coins worth the most: ${countUp(list)}. That’s ${t}¢.`};
  }
  if(k===2){
    if(Math.random()<.35){
      const ans=pick(['p','n','d','q']),list=shuffle(['p','n','d','q']).filter(x=>x!==ans).slice(0,2);
      return {...picChoices([[ans,null],...list.map(x=>[x,`That’s a ${COINS[x].name}. It’s worth ${COINS[x].v}¢.`])],(x,l)=>moneyFig([x],{label:l})),
        prompt:`Which coin is worth <b>${COINS[ans].v} ${COINS[ans].v>1?'cents':'cent'}</b>?`,
        hint:'A penny is 1¢, a nickel is 5¢, a dime is 10¢, and a quarter is 25¢.',explain:`A ${COINS[ans].name} is worth ${COINS[ans].v}¢.`};
    }
    const [small,big]=pick([['p','n'],['p','d'],['n','d'],['n','q'],['d','B'],['q','B'],['n','B']]),n=COINS[big].v/COINS[small].v,S=COINS[small],B=COINS[big];
    return {kind:'num',unit:S.pl,answer:n,prompt:`How many <b>${S.pl}</b> make ${big==='B'?'<b>1 dollar</b>':`a <b>${B.name}</b>`}?`,
      fig:show=>moneyFig(show?[big,...Array(n).fill(small)]:[big,small],{vals:true}),
      misc:miscOf(n,[[B.v,`${big==='B'?'A dollar':`A ${B.name}`} is ${B.v}¢. How many ${S.pl} is that?`],[S.v,`A ${S.name} is ${S.v}¢. How many make ${B.v}¢?`]]),
      hint:`${big==='B'?'A dollar':`A ${B.name}`} is ${B.v}¢. Count by ${S.v}s to ${B.v}.`,
      explain:`Count by ${S.v}s: ${range(Math.min(n,5)).map(i=>S.v*(i+1)).join(', ')}${n>5?', …':''} ${B.v}. That’s ${n} ${S.pl}.`};
  }
  if(k===3){
    const t=5*R(6,19),c=makeCents(t),list=coinList(c);
    return {kind:'num',unit:'cents',answer:100-t,prompt:'How much more money do you need to make <b>1 dollar</b>?',fig:show=>moneyFig(list,{vals:show}),
      misc:miscOf(100-t,[[t,'That’s how much is here. How much more to get to 100¢?'],[100,'A dollar is 100¢, but some of it is here already.'],[100-t+10,`Count the coins again: ${countUp(list)}.`],[100-t-10,`Count the coins again: ${countUp(list)}.`]]),
      hint:'A dollar is 100¢. Count the coins, then count on to 100.',
      explain:`The coins make ${t}¢ (${countUp(list)}). ${t} + ${100-t} = 100, so you need ${100-t}¢ more.`};
  }
  /* which coins make exactly a dollar? */
  const q=R(1,3),r=100-25*q,d=R(Math.max(0,Math.ceil((r-20)/10)),Math.floor(r/10)),right={q,d,n:(r-10*d)/5};
  const tweak=[[{...right,d:right.d-1},'short'],[{...right,n:right.n+1},'over'],[{...right,q:right.q-1,d:right.d+2},'short'],[{...right,d:right.d+1},'over']].filter(([c])=>c.d>=0&&c.q>=0&&c.n<=5&&Object.values(c).some(v=>v));
  const wrong=shuffle(tweak).slice(0,2).map(([c])=>{const t=centsOf(coinList(c));return [coinsSay(c),`That’s ${t}¢: ${t<100?`${100-t}¢ less than`:`${t-100}¢ more than`} a dollar.`];});
  return {...mcOf([[coinsSay(right),null],...wrong]),stack:true,prompt:'Which coins make exactly <b>1 dollar</b>?',
    fig:show=>moneyFig(show?coinList(right):['B'],{vals:true}),
    hint:'A dollar is 100¢. Count each group of coins: quarters by 25s, dimes by 10s, nickels by 5s.',
    explain:`${coinsSay(right)}: ${countUp(coinList(right))}. That’s 100¢, 1 dollar.`};
}

/* ---------- Prize Shop: money problems (Lessons 18–19) ---------- */
/* prizes and their prices in cents: [name, lowest, highest] */
const PRIZE=[['sticker',10,25],['pencil',25,40],['eraser',15,30],['bouncy ball',40,60],['whistle',30,50],['bookmark',20,35],['yo-yo',50,75],['toy car',60,85]];
/* bigger things in whole dollars */
const BIG=[['book',4,9],['kite',5,10],['puzzle',3,8],['T-shirt',8,12],['stuffed animal',6,12]];
const priceOf=([,a,b])=>5*R(a/5,b/5);
const an=w=>/^[aeiou]/.test(w)?'an':'a';
/* price tags: list [[name, price text], …] */
const tags=list=>svgWrap(list.length*170,90,list.map(([n,p],i)=>{const x=i*170+8;return `<path class="tag" d="M${x+22},6H${x+156}V78H${x+22}L${x},42Z"/><circle class="tagh" cx="${x+18}" cy="42" r="5"/><text class="lbl s" x="${x+90}" y="28">${n}</text><text class="lbl gd" x="${x+90}" y="56">${p}</text>`;}).join(''),'Price tags: '+list.map(([n,p])=>`${n}, ${p}`).join('; '));
function genShop(){
  const k=R(0,4),name=pick(KIDS);
  if(k===0){
    const b=R(1,4),c=makeCents(5*R(1,19)),list=coinList({B:b,...c}),t=centsOf(list),ct=t%100,n=list.length-b;
    return {...mcOf([[amt(t),null],[`${b+ct}¢`,'A dollar bill is 100¢, not 1¢.'],[`$${b+n}`,'The coins are cents, not dollars. Only the bills are dollars.']]),
      prompt:'How much money is this?',fig:show=>moneyFig(list,{vals:show}),
      hint:'Count the dollar bills first. Then count the cents.',
      explain:`Dollars: ${b}. Cents: ${countUp(list.slice(b))}. That’s ${b} dollar${b>1?'s':''} and ${ct} cents: ${amt(t)}.`};
  }
  const it=pick(PRIZE),p=priceOf(it);
  if(k===1){
    const h=5*R(p/5+1,20),c=makeCents(h);
    return {kind:'num',unit:'cents',answer:h-p,prompt:`${name} has ${h}¢. ${name} buys ${an(it[0])} ${it[0]} for ${p}¢. How much money does ${name} have left?`,
      fig:show=>tags([[it[0],`${p}¢`]])+(show?moneyFig(coinList(c),{vals:true,label:`${name}’s ${h}¢`}):''),
      misc:miscOf(h-p,[[h+p,`That’s adding. ${name} spends money, so there is less left.`],[p,`That’s the price of the ${it[0]}.`],[h,`That’s what ${name} had before buying the ${it[0]}.`]]),
      hint:`Take away the price: ${h} − ${p}. Or count up from ${p} to ${h}.`,
      explain:`${h} − ${p} = ${h-p}. ${name} has ${h-p}¢ left.`};
  }
  if(k===2){
    let it2,p2;do{it2=pick(PRIZE);p2=priceOf(it2);}while(it2===it||p+p2>100);
    return {kind:'num',unit:'cents',answer:p+p2,prompt:`${name} buys ${an(it[0])} ${it[0]} for ${p}¢ and ${an(it2[0])} ${it2[0]} for ${p2}¢. How much does ${name} spend in all?`,
      fig:()=>tags([[it[0],`${p}¢`],[it2[0],`${p2}¢`]]),
      misc:miscOf(p+p2,[[Math.abs(p-p2),'That’s the difference. Add to find what both cost together.'],[p+p2+10,'Add the tens, then the ones.'],[p+p2-10,'Add the tens, then the ones. Did you make a new ten?']]),
      hint:`Add the two prices: ${p} + ${p2}. Add the tens, then the ones.`,
      explain:`${p} + ${p2} = ${p+p2}. ${name} spends ${p+p2}¢.`};
  }
  if(k===3){
    const h=5*R(1,p/5-1),c=makeCents(h);
    return {kind:'num',unit:'cents',answer:p-h,prompt:`${name} has ${h}¢. ${name} wants ${an(it[0])} ${it[0]} that costs ${p}¢. How much more money does ${name} need?`,
      fig:()=>tags([[it[0],`${p}¢`]])+moneyFig(coinList(c),{label:`${name}’s ${h}¢`}),
      misc:miscOf(p-h,[[p+h,`That’s adding. ${name} needs the difference between ${h}¢ and ${p}¢.`],[p,`That’s the whole price. ${name} already has ${h}¢.`],[h,`That’s what ${name} has now.`]]),
      hint:`Count up from ${h} to ${p}.`,
      explain:`${h} + ${p-h} = ${p}, so ${name} needs ${p-h}¢ more.`};
  }
  const g=pick(BIG),bp=R(g[1],g[2]),bh=R(1,bp-1);
  return {kind:'num',unit:'dollars',answer:bp-bh,prompt:`${cap(an(g[0]))} ${g[0]} costs $${bp}. ${name} has $${bh}. How many more dollars does ${name} need?`,
    fig:()=>tags([[g[0],`$${bp}`]])+moneyFig(coinList({B:bh}),{label:`${name}’s $${bh}`}),
    misc:miscOf(bp-bh,[[bp+bh,`That’s adding. ${name} needs the difference.`],[bp,`That’s the whole price. ${name} already has $${bh}.`],[bh,`That’s what ${name} has now.`]]),
    hint:`Count up from $${bh} to $${bp}.`,
    explain:`$${bh} + $${bp-bh} = $${bp}, so ${name} needs $${bp-bh} more.`};
}

/* ---------- The Big Wheel: everything ---------- */
const genBoss=()=>pick([genShapes,genParts,genTime,genCoins,genShop])();

const ZONES=[
  {id:'shapes',name:'Shape Tent',lessons:'Lessons 1–4',blurb:'Name shapes by their sides, find squares, and count the faces of solid shapes.',gen:genShapes},
  {id:'parts',name:'Pie Stand',lessons:'Lessons 6–9',blurb:'Cut pies and sandwiches into halves, thirds, and fourths, and fill shapes with pattern blocks.',gen:genParts},
  {id:'time',name:'Clock Tower',lessons:'Lessons 11–13',blurb:'Tell time by 5s, say half past and quarter till, and pick a.m. or p.m.',gen:genTime},
  {id:'coins',name:'Coin Toss',lessons:'Lessons 15–17',blurb:'Count pennies, nickels, dimes, and quarters, and make a dollar.',gen:genCoins},
  {id:'shop',name:'Prize Shop',lessons:'Lessons 18–19',blurb:'Count dollars and cents, and buy prizes: how much in all, and how much is left?',gen:genShop},
  {id:'boss',name:'The Big Wheel',lessons:'All lessons',blurb:'Ride the Ferris wheel! Every right answer lights up one of its 10 cars.',gen:genBoss},
];

/* the Ferris wheel: a rim with spokes and 10 cars on a stand. lit: how many cars are lit (the boss icon draws all of them lit). */
const wheel=lit=>`<path d="M32,32L18,62M32,32L46,62M12,62H52" stroke="#a9c4e4" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="30" r="22" fill="none" stroke="#f3f6fb" stroke-width="2.5"/>`
  +range(10).map(i=>{const a=i*Math.PI/5-Math.PI/2,x=+(32+22*Math.cos(a)).toFixed(1),y=+(30+22*Math.sin(a)).toFixed(1);return `<path d="M32,30L${x},${y}" stroke="rgba(243,246,251,.45)" stroke-width="1.2"/><rect x="${x-4}" y="${y-2}" width="8" height="7" rx="2" fill="${i<lit?'#ffc93c':'#1b467a'}" stroke="#0a2340" stroke-width="1"/>`;}).join('')
  +'<circle cx="32" cy="30" r="3.5" fill="#ff8ac4"/>';
const ICON={
  shapes:'<path d="M8,52L32,8L56,52Z" fill="#ff8ac4" stroke="#0a2340" stroke-width="2" stroke-linejoin="round"/><path d="M32,8V52" stroke="#0a2340" stroke-width="1.5"/><path d="M20,52L32,30L44,52Z" fill="#0a2340"/><path d="M32,8L32,2L40,5L32,7" fill="#ffc93c"/><polygon points="44,44 50,40 56,44 54,51 46,51" fill="#7fe3ff" stroke="#0a2340" stroke-width="1.2"/>',
  parts:'<circle cx="32" cy="34" r="24" fill="#f2d0a0" stroke="#d9a066" stroke-width="3"/><circle cx="32" cy="34" r="18" fill="#ff7b7b"/><path d="M32,34V10M32,34L52.8,46M32,34L11.2,46" stroke="#0a2340" stroke-width="2.5"/>',
  time:'<path d="M14,60V26L32,8L50,26V60Z" fill="#d9a066" stroke="#0a2340" stroke-width="2" stroke-linejoin="round"/><circle cx="32" cy="32" r="12" fill="#f3f6fb" stroke="#ffc93c" stroke-width="3"/><path d="M32,32V24M32,32L37,35" stroke="#0a2340" stroke-width="2.5" stroke-linecap="round"/><rect x="26" y="48" width="12" height="12" fill="#0a2340"/>',
  coins:'<circle cx="22" cy="40" r="16" fill="#cdd6e1" stroke="#f3f6fb" stroke-width="2"/><circle cx="42" cy="26" r="13" fill="#d9895a" stroke="#f5c6a5" stroke-width="2"/><circle cx="46" cy="50" r="10" fill="#cdd6e1" stroke="#f3f6fb" stroke-width="2"/><path d="M8,14l4,4M14,6l1,6M4,24l6,0" stroke="#ffc93c" stroke-width="2.5" stroke-linecap="round"/>',
  shop:'<path d="M8,22H56V58H8Z" fill="#12365f" stroke="#f3f6fb" stroke-width="2"/><path d="M4,22L10,8H54L60,22Z" fill="#ff7b7b" stroke="#f3f6fb" stroke-width="2" stroke-linejoin="round"/><path d="M18,8L16,22M28,8L27,22M36,8L37,22M46,8L48,22" stroke="#f3f6fb" stroke-width="2"/><circle cx="22" cy="42" r="8" fill="#5fe0a8"/><rect x="34" y="34" width="14" height="16" rx="2" fill="#ffc93c"/>',
  boss:wheel(10),
};
