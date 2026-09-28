/* Learn Factors and Multiples (Grade 4 Unit 1): widgets and the chapters. Loaded by learn.html.
   Factors, number lines with hops, tiles, number charts, lockers, steppers, and choice buttons come from shared/k5.js. */

const list=a=>a.join(', ');

/* ---------- Chapter 1: multiples ---------- */
const HOPN=[2,3,4,5,6,7,8,9];
function wHops(el){
  const q=Q(el),st={hops:0};let n=3;
  el.innerHTML=seg('Count by',HOPN.map(v=>[v,`by ${v}s`]))+`<div class="fig" data-f></div><div class="wrow">${stepper('hops','Hops')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const k=st.hops;press(el,n);q('hops').textContent=k;
    q('f').innerHTML=hopLine(n,10*n,k);
    q('r').innerHTML=k?`<b>${k} × ${n} = ${k*n}</b>, so ${k*n} is a multiple of ${n}.<br><span class="dimline">Multiples of ${n} so far: ${list(range(k).map(i=>(i+1)*n))}</span>`
      :`Start at 0. Tap + to hop by ${n}s.`;
  };
  steppers(el,st,{hops:[0,10]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){n=+b.dataset.m;st.hops=0;draw();}});
  draw();
}
const TARGET=[{n:4,t:[18,20,30]},{n:6,t:[34,36,40]},{n:7,t:[27,28,45]},{n:9,t:[45,50,54]}];
function wIsMultiple(el){
  const q=Q(el);let p=0,t=null;
  el.innerHTML=seg('Count by',TARGET.map(({n},i)=>[i,`by ${n}s`]))+`<div class="chips" data-c></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {n,t:T}=TARGET[p];press(el,p);
    q('c').innerHTML=T.map(v=>`<button type="button" class="chip" data-t="${v}" aria-pressed="${v===t}">Is ${v} a multiple of ${n}?</button>`).join('');
    if(t===null){q('f').innerHTML=hopLine(n,10*n,10);q('r').innerHTML=`Tap a question. Do the hops of ${n} land on the number?`;return;}
    const k=Math.floor(t/n),yes=t%n===0;
    q('f').innerHTML=hopLine(n,(k+1)*n,yes?k:k+1,{mark:t});
    q('r').innerHTML=yes?`<span class="ok">Yes! ${k} hops of ${n} land right on ${t}: <b>${k} × ${n} = ${t}</b>.</span><br>${t} is a multiple of ${n}.`
      :`<span class="no">No.</span> Hops of ${n} land on <b>${k*n}</b> and <b>${(k+1)*n}</b>, and ${t} is in between.<br><span class="dimline">${t} is not a multiple of ${n}.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;t=null;draw();return;}const c=e.target.closest('[data-t]');if(c){t=+c.dataset.t;draw();}});
  draw();
}

/* ---------- Chapter 2: factor pairs ---------- */
const RECTN=[12,18,24];
function wRows(el){
  const q=Q(el),st={rows:1},lim={rows:[1,RECTN[0]]};let n=RECTN[0];
  el.innerHTML=seg('Tiles',RECTN.map(v=>[v,`${v} tiles`]))+`<div class="fig" data-f></div><div class="wrow">${stepper('rows','Rows')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const r=st.rows,c=Math.floor(n/r),left=n%r;press(el,n);q('rows').textContent=r;
    q('f').innerHTML=tiles(r,n);
    q('r').innerHTML=!left?`<span class="ok"><b>${r} × ${c} = ${n}</b>. ${r} and ${c} are a <b>factor pair</b> of ${n}.</span><br><span class="dimline">Try another number of rows.</span>`
      :`${r} rows of ${c} is ${r*c}, with <b>${left}</b> left over.<br><span class="dimline">${r} rows don’t work, so ${r} is not a factor of ${n}.</span>`;
  };
  steppers(el,st,lim,draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){n=+b.dataset.m;st.rows=1;lim.rows[1]=n;draw();}});
  draw();
}
/* Try 1, 2, 3, … rows in turn; each one that works is a factor pair. Stop when the next pair would be a turnaround. */
const pairsHunt=NUMS=>el=>{
  const q=Q(el);let n=NUMS[0],k=0;
  el.innerHTML=seg('Number',NUMS.map(v=>[v,v]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button><button type="button" class="ghost-btn" data-clr>Start over</button></div><div class="chips" data-c></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const done=(k+1)*(k+1)>n,found=pairsOf(n).filter(([a])=>a<=k);press(el,n);
    q('f').innerHTML=k?tiles(k,n):`<p class="note">${n} tiles. Try 1 row, then 2 rows, then 3 rows, …</p>`;
    q('go').textContent=k?`Try ${k+1} rows`:'Try 1 row';q('go').disabled=done;
    q('c').innerHTML=found.map(([a,b])=>`<span class="chip found">${a} × ${b}</span>`).join('');
    q('r').innerHTML=!k?`Find every factor pair of <b>${n}</b>.`
      :(n%k?`${k} rows leave ${n%k} left over. ${k} is not a factor of ${n}.`:`<b>${k} × ${n/k} = ${n}</b>. That’s a factor pair!`)
      +(done?`<br><span class="ok">Done! ${k+1} × ${k+1} is more than ${n}, so any other pair is a turnaround of one you have.</span><br>Factors of ${n}: <b>${list(factors(n))}</b>`:'');
  };
  q('go').onclick=()=>{k++;draw();};
  q('clr').onclick=()=>{k=0;draw();};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){n=+b.dataset.m;k=0;draw();}});
  draw();
};

/* ---------- Chapter 3: prime and composite ---------- */
const PRN=[5,7,9,11,12,13,15,16];
function wPrime(el){
  const q=Q(el);let n=PRN[0];
  el.innerHTML=seg('Number',PRN.map(v=>[v,v]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const P=pairsOf(n);press(el,n);
    q('f').innerHTML=allRects(n);
    q('r').innerHTML=P.length===1?`${n} tiles make just <b>1 rectangle</b>: 1 × ${n}.<br><span class="ok">${n} is <b>prime</b>. Its only factors are 1 and ${n}.</span>`
      :`${n} tiles make <b>${P.length} rectangles</b>: ${P.map(([a,b])=>`${a} × ${b}`).join(', ')}.<br><span class="ok">${n} is <b>composite</b>. Its factors are ${list(factors(n))}.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){n=+b.dataset.m;draw();}});
  draw();
}
function wSort(el){
  const q=Q(el),seen=new Set();let v=null;
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-all>Show them all</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    q('f').innerHTML=chart(30,x=>(seen.has(x)?(x===1?'one':isPrime(x)?'a':'b'):'')+(x===v?' cur':''),{tap:true,label:'Numbers 1 to 30. '+(seen.size?'Prime: '+list([...seen].filter(isPrime).sort((a,b)=>a-b)):'Tap a number.')});
    if(v===null){q('r').innerHTML='Tap a number to sort it. <span class="dimline">Gold means prime. Blue means composite.</span>';return;}
    const P=pairsOf(v);
    q('r').innerHTML=v===1?`<b>1</b> has only one factor: 1. It’s <b>neither</b> prime nor composite.`
      :P.length===1?`<b>${v}</b>: the only factor pair is 1 × ${v}. <span class="ok">Prime.</span>`
      :`<b>${v}</b> = ${P[1][0]} × ${P[1][1]}, so it has more than one factor pair. <span class="ok">Composite.</span><br><span class="dimline">Factors: ${list(factors(v))}</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(b){v=+b.dataset.v;seen.add(v);draw();}});
  q('all').onclick=()=>{range(30).forEach(i=>seen.add(i+1));v=null;draw();q('r').innerHTML=`Primes up to 30: <b>${list(range(30).map(i=>i+1).filter(isPrime))}</b>.<br><span class="dimline">2 is the only even prime. Every other even number has 2 as a factor.</span>`;};
  q('clr').onclick=()=>{seen.clear();v=null;draw();};
  draw();
}

/* ---------- Chapter 4: common multiples and the Locker Problem ---------- */
const TWO=[[3,4],[4,6],[5,10],[6,8]];
function wCommon(el){
  const q=Q(el);let p=0,on={a:true,b:false};
  el.innerHTML=seg('Numbers',TWO.map(([a,b],i)=>[i,`${a} and ${b}`]))+`<div class="chips" data-c></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=TWO[p],both=range(100).map(i=>i+1).filter(v=>v%a===0&&v%b===0);press(el,p);
    q('c').innerHTML=[['a',a],['b',b]].map(([k,v])=>`<button type="button" class="chip" data-s="${k}" aria-pressed="${on[k]}">Multiples of ${v}</button>`).join('');
    q('f').innerHTML=chart(100,v=>{const x=on.a&&v%a===0,y=on.b&&v%b===0;return x&&y?'ab':x?'a':y?'b':'';},{label:`Numbers 1 to 100, showing multiples of ${on.a?a:''}${on.a&&on.b?' and ':''}${on.b?b:''}`});
    q('r').innerHTML=on.a&&on.b?`<span class="ok">Green squares are multiples of both: <b>${list(both)}</b>.</span><br>These are <b>common multiples</b> of ${a} and ${b}. The first one is <b>${both[0]}</b>.`
      :`${on.a?`Gold is multiples of ${a}. `:''}${on.b?`Blue is multiples of ${b}. `:''}<span class="dimline">Turn on both to see the numbers that are multiples of ${a} and ${b}.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;on={a:true,b:false};draw();return;}const s=e.target.closest('[data-s]');if(s){on[s.dataset.s]=!on[s.dataset.s];draw();}});
  draw();
}
function wLockers(el){
  const q=Q(el);let s=0,sel=null,open=[];
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button><button type="button" class="ghost-btn" data-end>All the rest</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const touched=k=>range(Math.floor(20/k)).map(i=>(i+1)*k);
  const draw=()=>{
    q('f').innerHTML=lockers(open,{hi:s&&s<20?touched(s):[],sel});
    q('go').textContent=s<20?`Student ${s+1} goes`:'Everyone is done';q('go').disabled=s===20;q('end').disabled=s===20;
    let r=!s?'All 20 lockers are closed. Student 1 opens every locker. Student 2 changes every 2nd locker, student 3 every 3rd, and so on.'
      :s<20?`Student ${s} changed lockers <b>${list(touched(s))}</b>. <span class="dimline">(the multiples of ${s})</span>`
      :`<span class="ok">All 20 students are done. Open lockers: <b>${list(range(20).map(i=>i+1).filter(v=>open[v]))}</b>.</span>`;
    if(sel!==null){
      const by=factors(sel).filter(f=>f<=s);
      r+=`<br>Locker ${sel}: `+(by.length?`changed by student${by.length>1?'s':''} ${list(by)}`:'no one has changed it yet')
        +(s===20?`. That’s ${by.length} changes, the factors of ${sel}, so it ends <b>${by.length%2?'open':'closed'}</b>.`:'.');
    }else r+=`<br><span class="dimline">Tap a locker to see who changed it.</span>`;
    q('r').innerHTML=r;
  };
  const step=()=>{s++;touched(s).forEach(v=>{open[v]=!open[v];});};
  q('go').onclick=()=>{if(s<20)step();draw();};
  q('end').onclick=()=>{while(s<20)step();draw();};
  q('clr').onclick=()=>{s=0;sel=null;open=[];draw();};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(b){sel=+b.dataset.v;draw();}});
  draw();
}

/* ---------- Chapter 5: factors and multiples together ---------- */
const FM=[[6,42],[8,50],[9,72],[7,40]];
function wFM(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Numbers',FM.map(([a,b],i)=>[i,`${a} and ${b}`]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=FM[p],k=Math.floor(b/a),yes=b%a===0,m=(k+(yes?0:1))*a;press(el,p);
    q('f').innerHTML=hopLine(a,m,m/a,{mark:b});
    q('r').innerHTML=yes?`Hops of ${a} land on ${b}: <b>${a} × ${k} = ${b}</b>.<br><span class="ok">${a} is a <b>factor</b> of ${b}, and ${b} is a <b>multiple</b> of ${a}.</span><br><span class="dimline">${k} is a factor of ${b} too.</span>`
      :`Hops of ${a} land on ${k*a} and ${(k+1)*a}, and skip ${b}.<br><span class="no">${a} is not a factor of ${b}, and ${b} is not a multiple of ${a}.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

/* ---------- quick-check figures ---------- */
const F={
  six:hopLine(6,36,3,{label:'Number line counting by 6s: 6, 12, 18'}),
  plants:tiles(4,24,'24 plants in 4 equal rows'),
  buses:hopLine(4,24,6,{cls:'r',label:'Red bus: hops of 4 to 24'})+hopLine(6,24,4,{cls:'b',label:'Blue bus: hops of 6 to 24'}),
  lockers:lockers(Object.fromEntries([1,4,9,16].map(v=>[v,true])),{sel:16}),
};

/* ---------- chapters ---------- */
const ICON={
  hops:'<path d="M4,46H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M8,44Q20,18 32,44M32,44Q44,18 56,44" fill="none" stroke="#ffc93c" stroke-width="3"/><circle cx="32" cy="46" r="3.5" fill="#ffc93c"/><circle cx="56" cy="46" r="3.5" fill="#ffc93c"/>',
  rect:'<g fill="rgba(255,201,60,.55)" stroke="#0a2340" stroke-width="1.5"><rect x="8" y="14" width="12" height="12"/><rect x="20" y="14" width="12" height="12"/><rect x="32" y="14" width="12" height="12"/><rect x="44" y="14" width="12" height="12"/><rect x="8" y="26" width="12" height="12"/><rect x="20" y="26" width="12" height="12"/><rect x="32" y="26" width="12" height="12"/><rect x="44" y="26" width="12" height="12"/><rect x="8" y="38" width="12" height="12"/><rect x="20" y="38" width="12" height="12"/><rect x="32" y="38" width="12" height="12"/><rect x="44" y="38" width="12" height="12"/></g>',
  prime:'<g fill="rgba(255,201,60,.55)" stroke="#0a2340" stroke-width="1.5">'+range(7).map(i=>`<rect x="${4+i*8}" y="24" width="8" height="8"/>`).join('')+'</g><text x="32" y="52" fill="#7fe3ff" font-size="13" font-weight="700" text-anchor="middle" font-family="monospace">1 × 7</text>',
  lockers:'<g stroke="#7fe3ff" stroke-width="2"><rect x="6" y="10" width="15" height="44" fill="rgba(127,227,255,.35)"/><rect x="24.5" y="10" width="15" height="44" fill="#061528"/><rect x="43" y="10" width="15" height="44" fill="rgba(127,227,255,.35)"/></g><polygon points="24.5,10 30,15 30,49 24.5,54" fill="rgba(127,227,255,.6)" stroke="#7fe3ff" stroke-width="1.5"/>',
  pair:'<text x="32" y="30" fill="#ffc93c" font-size="17" font-weight="700" text-anchor="middle" font-family="monospace">6 × 7</text><text x="32" y="52" fill="#7fe3ff" font-size="17" font-weight="700" text-anchor="middle" font-family="monospace">= 42</text>',
};
const CH=[
  {icon:'hops',title:'Multiples',game:{zone:'hops',name:'Hop Belt'},lessons:'Lesson 1',blurb:'Skip-count on a number line to find multiples, and tell whether a number is a multiple.',steps:[
    {title:'Skip-count to find multiples',widget:wHops,
      body:'<p>Counting by 3s from 0 lands on 3, 6, 9, 12, … These are the <b>multiples</b> of 3. Each one is 3 times a whole number: 4 × 3 = 12.</p><p>Pick a number, then hop along the number line.</p>',
      check:{kind:'num',answer:30,fig:F.six,q:'Kiran counts by 6s: 6, 12, 18, … What is the 5th number Kiran says?',
        misc:[[11,'You added 5 + 6. Five hops of 6 is 5 × 6.'],[36,'That’s the 6th number. Count them: 6, 12, 18, 24, 30.'],[24,'That’s the 4th number. Hop one more time.']],
        explain:'6, 12, 18, 24, 30. The 5th multiple of 6 is 5 × 6 = 30.'}},
    {title:'Is it a multiple?',widget:wIsMultiple,
      body:'<p>A number is a multiple of 4 if hops of 4 from 0 land right on it. If the hops jump over it, it’s not.</p><p>Pick a number to count by, then tap a question.</p>',
      check:{kind:'mc',q:'Stickers come in packs of 7. Which number of stickers can Lin get by buying whole packs?',
        choices:[{id:'a',label:'17'},{id:'b',label:'27'},{id:'c',label:'21'}],answer:'c',
        why:{a:'2 packs is 14 and 3 packs is 21. 17 is in between, so it’s not a multiple of 7.',b:'It ends in 7, but that doesn’t matter. 3 packs is 21 and 4 packs is 28, so 27 is not a multiple of 7.'},
        explain:'3 × 7 = 21, so 3 packs is 21 stickers. 21 is a multiple of 7.'}}
  ]},
  {icon:'rect',title:'Factor pairs',game:{zone:'tiles',name:'Tile Press'},lessons:'Lesson 2',blurb:'Arrange tiles in equal rows to find factor pairs, then find every pair for a number.',steps:[
    {title:'Rectangles and factor pairs',widget:wRows,
      body:'<p>Put 12 tiles in 3 equal rows and you get a rectangle: 3 × 4 = 12. So <b>3 and 4 are a factor pair</b> of 12, and each is a <b>factor</b> of 12.</p><p>Pick a number of tiles, then change the rows. When do they make a rectangle?</p>',
      check:{kind:'num',unit:'plants',answer:6,fig:F.plants,q:'A gardener plants 24 tomato plants in 4 equal rows. How many plants are in each row?',
        misc:[[20,'You subtracted. Equal rows means 4 × ? = 24.'],[28,'You added. Equal rows means 4 × ? = 24.'],[96,'That’s 24 × 4. Find the number that goes with 4 to make 24.']],
        explain:'4 × 6 = 24, so there are 6 plants in each row. 4 and 6 are a factor pair of 24.'}},
    {title:'Find all the factor pairs',widget:pairsHunt([20,30,36]),
      body:'<p>To find every factor pair, try 1 row, 2 rows, 3 rows, and so on. Once the pairs start to turn around (5 × 4 after 4 × 5), you have them all.</p><p>Pick a number and keep trying rows.</p>',
      check:{kind:'mc',stack:true,q:'Which list shows all the factor pairs of 16?',
        choices:[{id:'a',label:'1 × 16, 2 × 8'},{id:'b',label:'1 × 16, 2 × 8, 3 × 5'},{id:'c',label:'1 × 16, 2 × 8, 4 × 4'}],answer:'c',
        why:{a:'4 × 4 = 16 too. A square is a rectangle, so 4 × 4 counts.',b:'3 × 5 = 15, not 16. 3 is not a factor of 16.'},
        explain:'Try 1, 2, 3, and 4 rows: 1 × 16, 2 × 8, and 4 × 4 work, and 3 doesn’t. After 4, the pairs turn around.'}}
  ]},
  {icon:'prime',title:'Prime and composite',game:{zone:'prime',name:'Prime Sorter'},lessons:'Lesson 3',blurb:'See which numbers make only one rectangle, and sort the numbers to 30.',steps:[
    {title:'One rectangle or more?',widget:wPrime,
      body:'<p>A number with exactly one factor pair (1 and itself) is <b>prime</b>. Its tiles make only one rectangle. A number with more factor pairs is <b>composite</b>.</p><p>Pick a number and see all its rectangles.</p>',
      check:{kind:'mc',q:'Which number is prime?',
        choices:[{id:'a',label:'21'},{id:'b',label:'23'},{id:'c',label:'25'}],answer:'b',
        why:{a:'3 × 7 = 21, so 21 has more than one factor pair. It’s composite.',c:'5 × 5 = 25, so 25 has more than one factor pair. It’s composite.'},
        explain:'23’s only factor pair is 1 × 23. It makes just one rectangle, so 23 is prime.'}},
    {title:'Primes up to 30',widget:wSort,
      body:'<p>Every whole number bigger than 1 is prime or composite. The number <b>1</b> is neither: its only factor is 1.</p><p>Tap numbers to sort them. Which even numbers are prime?</p>',
      check:{kind:'mc',stack:true,q:'Why is every even number bigger than 2 composite?',
        choices:[{id:'a',label:'2 is a factor, so it has more than one factor pair.'},{id:'b',label:'Even numbers are big.'},{id:'c',label:'Even numbers end in 0.'}],answer:'a',
        why:{b:'4 isn’t big, and it’s composite: 2 × 2 = 4. It’s about the factor 2.',c:'Only some end in 0, like 10 and 20. 4, 6, and 8 are even too.'},
        explain:'An even number is 2 × something. So besides 1 × the number, it has a pair with 2 in it. That makes it composite. 2 itself is prime: 1 × 2 is its only pair.'}}
  ]},
  {icon:'lockers',title:'Common multiples and lockers',game:{zone:'lockers',name:'Locker Room'},lessons:'Lessons 5–6',blurb:'Find multiples two numbers share, and solve the Locker Problem.',steps:[
    {title:'Common multiples',widget:wCommon,
      body:'<p>A number that is a multiple of two numbers is a <b>common multiple</b>. 12 is a multiple of 3 and of 4.</p><p>Pick two numbers. Show the multiples of each, then both.</p>',
      check:{kind:'num',unit:'minutes',answer:12,fig:F.buses,q:'The red bus leaves every 4 minutes. The blue bus leaves every 6 minutes. Both buses leave at 8:00. In how many minutes do they leave together again?',
        misc:[[24,'4 × 6 = 24 is a common multiple, but not the first one. Look for a smaller one.'],[10,'You added 4 + 6. Find a number that is a multiple of 4 and of 6.'],[2,'That’s 6 − 4. Find a number that is a multiple of 4 and of 6.']],
        explain:'Red: 4, 8, 12. Blue: 6, 12. 12 is the first common multiple, so they leave together again at 8:12.'}},
    {title:'The Locker Problem',widget:wLockers,
      body:'<p>20 lockers start closed. Student 1 opens every locker. Student 2 changes every 2nd locker (open ones close, closed ones open). Student 3 changes every 3rd locker, and so on up to student 20.</p><p>Send in the students one at a time. Which lockers end up open?</p>',
      check:{kind:'mc',stack:true,q:'Why is locker 16 open at the end?',fig:F.lockers,
        choices:[{id:'a',label:'16 is even.'},{id:'b',label:'16 is a multiple of 4.'},{id:'c',label:'16 has an odd number of factors: 1, 2, 4, 8, 16.'}],answer:'c',
        why:{a:'Locker 10 is even too, and it ends closed. Count the students who change locker 16.',b:'Locker 12 is a multiple of 4 too, and it ends closed. Count the factors of 16.'},
        explain:'The students who change locker 16 are its factors: 1, 2, 4, 8, and 16. That’s 5 changes: open, closed, open, closed, open. An odd number of changes leaves it open.'}}
  ]},
  {icon:'pair',title:'Factors and multiples together',game:{zone:'gears',name:'Gear Works'},lessons:'Lesson 7',blurb:'Say how a factor and a multiple are related, and find all the factors of a number.',steps:[
    {title:'Factor or multiple?',widget:wFM,
      body:'<p>6 × 7 = 42 says two things: 6 is a <b>factor</b> of 42, and 42 is a <b>multiple</b> of 6. The multiple is the number you land on. The size of the hops and the number of hops are its factors.</p><p>Pick two numbers. Do the hops land on the bigger one?</p>',
      check:{kind:'mc',stack:true,q:'Which is true about 7 and 56?',
        choices:[{id:'a',label:'56 is a factor of 7.'},{id:'b',label:'7 is a multiple of 56.'},{id:'c',label:'7 is a factor of 56, and 56 is a multiple of 7.'}],answer:'c',
        why:{a:'56 is bigger than 7, so it can’t be a factor of 7. Try it the other way around.',b:'A multiple is the number you land on when you count by 7s. 7 × 8 = 56, so 56 is the multiple.'},
        explain:'7 × 8 = 56. So 7 and 8 are factors of 56, and 56 is a multiple of 7 and of 8.'}},
    {title:'Find all the factors',widget:pairsHunt([48,60,100]),
      body:'<p>Every factor pair gives you two factors. Find all the pairs and you have all the factors. (In a pair like 10 × 10, the factor counts once.)</p><p>Pick a number and keep trying rows.</p>',
      check:{kind:'num',unit:'factors',answer:9,q:'How many factors does 36 have?',
        misc:[[10,'6 × 6 = 36 has the same factor twice. Count 6 just once.'],[8,'Find the pairs: 1 × 36, 2 × 18, 3 × 12, 4 × 9, 6 × 6. Did you miss one?'],[5,'That’s the number of factor pairs. Each pair has two factors (except 6 × 6).']],
        explain:'The factor pairs are 1 × 36, 2 × 18, 3 × 12, 4 × 9, and 6 × 6. The factors are 1, 2, 3, 4, 6, 9, 12, 18, and 36: 9 factors.'}}
  ]}
];
