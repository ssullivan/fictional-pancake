/* Learn Numbers to 1,000 (Grade 2 Unit 5): figures, widgets, and the chapters. Loaded by learn.html.
   Base-ten diagrams (htoFig, numBlocks), place-value charts (pvChart), number names (numWords), number lines (numLine), steppers, and choice buttons come from shared/k5.js. */

/* ---------- figures ---------- */

/* ---------- Chapter 1: make a hundred ---------- */
function wTenTens(el){
  const q=Q(el),st={t:4};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('t','Tens')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const t=st.t;q('t').textContent=t;
    q('f').innerHTML=t===10?htoFig(1,0,0,{cls:{h:'new'}},'10 tens make 1 hundred'):htoFig(0,t,0,{},`${t} tens`);
    q('r').innerHTML=t===10?`<span class="ok"><b>10 tens make 1 hundred!</b> 10, 20, 30, … 100.</span><br><span class="dimline">A hundred is 10 tens put together.</span>`
      :`<b>${t} ${t===1?'ten':'tens'}</b> is <b>${t*10}</b>.<br><span class="dimline">${10-t} more ${10-t===1?'ten':'tens'} to make a hundred.</span>`;
  };
  steppers(el,st,{t:[0,10]},draw);
  draw();
}
const TENSETS=[12,20,27,35,40];
function wMakeHundreds(el){
  const q=Q(el);let p=0,made=false;
  el.innerHTML=seg('Tens',TENSETS.map((t,i)=>[i,`${t} tens`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const t=TENSETS[p],h=Math.floor(t/10),r=t%10;press(el,p);
    q('f').innerHTML=made?htoFig(h,r,0,{cls:{h:'new'}},`${h} hundreds and ${r} tens`):htoFig(0,t,0,{},`${t} tens`);
    q('go').textContent=made?'Break them apart':'Make hundreds';
    q('r').innerHTML=made?`${t} tens is <b>${h} ${h===1?'hundred':'hundreds'}</b>${r?` and <b>${r} ${r===1?'ten':'tens'}</b>`:''}.<br><span class="ok"><b>${t} tens = ${t*10}</b></span>`
      :`<b>${t} tens</b>. Every 10 tens make a hundred.<br><span class="dimline">How many hundreds can you make?</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;made=false;draw();}});
  q('go').onclick=()=>{made=!made;draw();};
  draw();
}

/* ---------- Chapter 2: three-digit numbers ---------- */
function wBuild(el){
  const q=Q(el),st={h:2,t:3,o:5};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('h','Hundreds')}${stepper('t','Tens')}${stepper('o','Ones')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {h,t,o}=st,n=h*100+t*10+o;['h','t','o'].forEach(k=>{q(k).textContent=st[k];});
    q('f').innerHTML=numBlocks(n);
    q('r').innerHTML=`${h} hundreds, ${t} tens, ${o} ones<br><span class="ok"><b>${n}</b>: ${numWords(n)}</span>`+(h&&(!t||!o)?`<br><span class="dimline">${!t&&!o?'No tens and no ones: write 0 in both places.':!t?'No tens: write 0 in the tens place.':'No ones: write 0 in the ones place.'}</span>`:'');
  };
  steppers(el,st,{h:[1,9],t:[0,9],o:[0,9]},draw);
  draw();
}
const NAMES=[406,460,517,830];
function wNames(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Number',NAMES.map((n,i)=>[i,n]))+`<p class="eq" data-w></p><div data-c></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const n=NAMES[p],[h,t,o]=digits(n);press(el,p);
    q('w').textContent=numWords(n);q('c').innerHTML=pvChart([['',n]]);q('f').innerHTML=numBlocks(n);
    q('r').innerHTML=`<b>${numWords(n)}</b> is ${h} hundreds, ${t} tens, and ${o} ones: <b>${n}</b>.`+(!t||!o?`<br><span class="dimline">There are no ${!t?'tens':'ones'}, so that place gets a 0.</span>`:'');
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

/* ---------- Chapter 3: expanded form ---------- */
const EXP=[342,508,760];
function wExpanded(el){
  const q=Q(el);let p=0,k=-1;
  el.innerHTML=seg('Number',EXP.map((n,i)=>[i,n]))+`<div class="chips" data-c></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const n=EXP[p],[h,t,o]=digits(n),parts=[h*100,t*10,o],dim=i=>k>=0&&k!==i?' fade':'';press(el,p);
    q('c').innerHTML=parts.map((v,i)=>v?`<button type="button" class="chip" data-e="${i}" aria-pressed="${i===k}">${v}</button>`:'').join('');
    q('f').innerHTML=htoFig(h,t,o,{cls:{h:dim(0),t:'b'+dim(1),o:'c'+dim(2)}},`${n} in base-ten blocks`);
    q('r').innerHTML=`<b>${n} = ${parts.filter(v=>v).join(' + ')}</b><br><span class="dimline">`+(k<0?'Tap each part to find its blocks.':`${parts[k]} is ${[h,t,o][k]} ${['hundreds','tens','ones'][k]}.`)+`</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;k=-1;draw();return;}const c=e.target.closest('[data-e]');if(c){k=+c.dataset.e;draw();}});
  draw();
}
function wTrade(el){
  const q=Q(el);let b=0;
  el.innerHTML=`<p class="story">342 is 3 hundreds, 4 tens, and 2 ones. Is there another way to make 342?</p><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const h=3-b,t=4+10*b;
    q('f').innerHTML=htoFig(h,t,2,{cls:{t:'b',o:'c'},tr:10*b},`${h} hundreds, ${t} tens, and 2 ones`);
    q('go').disabled=b>=2;q('clr').disabled=!b;
    q('go').textContent='Break a hundred into 10 tens';
    q('r').innerHTML=`<b>${h} hundreds, ${t} tens, 2 ones</b><br><span class="ok">${h*100} + ${t*10} + 2 = 342</span>`+(b?`<br><span class="dimline">The green tens came from a hundred. Same number, different blocks!</span>`:'');
  };
  q('go').onclick=()=>{b++;draw();};
  q('clr').onclick=()=>{b=0;draw();};
  draw();
}

/* ---------- Chapter 4: the number line to 1,000 ---------- */
/* a number line from lo to hi with a tick every `by`, numbered every `every` */
const line=(lo,hi,by,every,o={})=>numLine(lo,hi,{u:Math.min(40,520/(hi-lo)),step:by,big:every,ls:'',end:true,...o});
const SPOT=[350,720,480,905];
function wLocate(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Number',SPOT.map((n,i)=>[i,n]))+`<div class="fig" data-f></div><div class="fig" data-z></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const n=SPOT[p],lo=Math.floor(n/100)*100,t=(n-lo)/10;press(el,p);
    q('f').innerHTML=line(0,1000,100,100,{pts:[{v:n,t:n}],label:`A number line from 0 to 1,000 by hundreds with a dot at ${n}`});
    q('z').innerHTML=line(lo,lo+100,10,50,{pts:[{v:n,cls:'b',t:n}],label:`A number line from ${lo} to ${lo+100} by tens with a dot at ${n}`});
    q('r').innerHTML=`<b>${n}</b> is between <b>${lo}</b> and <b>${lo+100}</b>.<br><span class="dimline">Zoom in: count by tens from ${lo}. ${range(t).map(i=>lo+10*(i+1)).join(', ')}. That’s ${t} tens past ${lo}.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}
const CMPS=[[628,682],[395,410],[750,705]];
function wCompareLine(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Numbers',CMPS.map(([a,b],i)=>[i,`${a} and ${b}`]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=CMPS[p],lo=Math.floor(Math.min(a,b)/100)*100,hi=Math.ceil((Math.max(a,b)+1)/100)*100,big=Math.max(a,b);press(el,p);
    q('f').innerHTML=line(lo,hi,10,50,{pts:[{v:a,t:a},{v:b,cls:'b',t:b}],label:`A number line from ${lo} to ${hi} with dots at ${a} and ${b}`});
    q('r').innerHTML=`<b>${big}</b> is farther right, so it’s greater.<br><span class="ok"><b>${a} ${a>b?'>':'<'} ${b}</b></span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

/* ---------- Chapter 5: compare and order ---------- */
const PVC=[[436,463],[718,299],[652,658]];
function wPlaceCompare(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Numbers',PVC.map(([a,b],i)=>[i,`${a} and ${b}`]))+`<div data-c></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=PVC[p],da=digits(a),db=digits(b),i=da.findIndex((d,j)=>d!==db[j]),pl=['hundreds','tens','ones'][i];press(el,p);
    q('c').innerHTML=pvChart([['',a],['',b]],i);
    q('r').innerHTML=(i?`Same ${i===1?'hundreds':'hundreds and tens'}, so look at the ${pl}.<br>`:'Start with the biggest place: hundreds.<br>')+`${da[i]} ${pl} ${da[i]>db[i]?'is more than':'is less than'} ${db[i]} ${pl}.<br><span class="ok"><b>${a} ${a>b?'>':'<'} ${b}</b></span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}
const ORDER=[506,560,65,605];
function wOrder(el){
  const q=Q(el),sorted=[...ORDER].sort((a,b)=>a-b);let got=[],miss=null;
  el.innerHTML=`<p class="story">Tap the numbers from least to greatest.</p><div class="chips" data-c></div><p class="eq" data-s></p><div class="wrow"><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    q('c').innerHTML=ORDER.map(n=>`<button type="button" class="chip" data-e="${n}"${got.includes(n)?' disabled aria-pressed="true"':''}>${n}</button>`).join('');
    q('s').textContent=got.length?got.join(', '):'';
    q('r').innerHTML=got.length===ORDER.length?'<span class="ok">Least to greatest! 65 has no hundreds, so it’s least. Then 506, 560, 605.</span>'
      :miss!==null?`<span class="no">Not ${miss} yet.</span> Is there a number less than ${miss}? Look at the hundreds first.`
      :`Which number is ${got.length?'next':'least'}?`;
  };
  el.addEventListener('click',e=>{const c=e.target.closest('[data-e]');if(!c||c.disabled)return;const n=+c.dataset.e;if(n===sorted[got.length]){got.push(n);miss=null;}else miss=n;draw();});
  q('clr').onclick=()=>{got=[];miss=null;draw();};
  draw();
}

/* ---------- quick-check figures ---------- */
const F={
  seven:htoFig(0,7,0,{},'7 tens'),
  forty:htoFig(0,40,0,{},'40 tens'),
  n205:htoFig(2,0,5,{cls:{t:'b',o:'c'}},'2 hundreds and 5 ones'),
  dot470:line(400,500,10,50,{pts:[{v:470,cls:'b',t:'?'}],label:'A number line from 400 to 500 by tens with a dot'}),
  cmp:line(570,590,1,5,{pts:[{v:587,t:587},{v:578,cls:'b',t:578}],label:'A number line with dots at 578 and 587'}),
};

/* ---------- chapters ---------- */
const ICON={
  hundred:'<rect x="6" y="10" width="40" height="40" fill="#ffc93c" stroke="#0a2340"/><path d="M14,10v40M22,10v40M30,10v40M38,10v40M6,18h40M6,26h40M6,34h40M6,42h40" stroke="rgba(10,35,64,.5)"/><rect x="52" y="10" width="6" height="40" fill="#7fe3ff" stroke="#0a2340"/>',
  digits:'<g font-family="monospace" font-weight="700" font-size="22" text-anchor="middle"><text x="14" y="40" fill="#ffc93c">3</text><text x="32" y="40" fill="#7fe3ff">4</text><text x="50" y="40" fill="#5fe0a8">2</text></g>',
  expand:'<g font-family="monospace" font-weight="700" font-size="12" text-anchor="middle"><text x="32" y="22" fill="#f3f6fb">342 =</text><text x="32" y="44" fill="#ffc93c">300+40+2</text></g>',
  line:'<path d="M4,40H56" stroke="#f3f6fb" stroke-width="3"/><polygon points="62,40 54,35 54,45" fill="#f3f6fb"/><path d="M8,32v16M28,32v16M48,32v16" stroke="#f3f6fb" stroke-width="2.5"/><circle cx="38" cy="40" r="6" fill="#ffc93c"/>',
  order:'<g font-family="monospace" font-weight="700" font-size="12" text-anchor="middle"><text x="32" y="18" fill="#7fe3ff">65</text><text x="32" y="34" fill="#f3f6fb">506</text><text x="32" y="50" fill="#ffc93c">560</text></g>',
};
const CH=[
  {icon:'hundred',title:'Make a hundred',game:{zone:'hundred',name:'Tower of Tens'},lessons:'Lessons 1–2',blurb:'Put 10 tens together to make a hundred, and count how many hundreds you can make.',steps:[
    {title:'10 tens make a hundred',widget:wTenTens,
      body:'<p>A <b>ten</b> is 10 ones in a stick. Put <b>10 tens</b> together and you get a <b>hundred</b>.</p><p>Tap <b>+</b> to add tens until you have a hundred.</p>',
      check:{kind:'num',unit:'tens',answer:3,fig:F.seven,q:'Here are 7 tens. How many more tens do you need to make a hundred?',
        misc:[[7,'That’s how many tens there are now. How many more to get to 10 tens?'],[30,'That’s 30 ones. How many tens is that?'],[10,'10 tens is the whole hundred. You already have 7.']],
        explain:'7 tens and 3 more tens make 10 tens. 10 tens is a hundred.'}},
    {title:'Make hundreds',widget:wMakeHundreds,
      body:'<p>Every 10 tens make a hundred. 20 tens make 2 hundreds. 30 tens make 3 hundreds.</p><p>Pick some tens. Make as many hundreds as you can.</p>',
      check:{kind:'num',unit:'hundreds',answer:4,fig:F.forty,q:'How many hundreds can you make with 40 tens?',
        misc:[[40,'That’s the number of tens. Every 10 tens make 1 hundred.'],[400,'400 is the number. How many hundreds is that?']],
        explain:'10 tens make 1 hundred, so 40 tens make 4 hundreds. That’s 400.'}}
  ]},
  {icon:'digits',title:'Three-digit numbers',game:{zone:'build',name:'Block Forge'},lessons:'Lessons 3–4',blurb:'Build numbers with hundreds, tens, and ones, and read and write their names.',steps:[
    {title:'Hundreds, tens, and ones',widget:wBuild,
      body:'<p>A three-digit number tells how many <b>hundreds</b>, <b>tens</b>, and <b>ones</b>. In 235, the 2 means 2 hundreds.</p><p>Change the blocks and watch the number.</p>',
      check:{kind:'num',answer:205,fig:F.n205,q:'What number do the blocks show?',
        misc:[[25,'The big squares are hundreds. 2 hundreds is 200.'],[250,'There are no tens, so the tens place is 0.'],[7,'Each big square is 100, and each small square is 1.']],
        explain:'2 hundreds, 0 tens, and 5 ones is 205.'}},
    {title:'Number names',widget:wNames,
      body:'<p>We say a number the way we write it: hundreds first, then the rest. <b>517</b> is “five hundred seventeen”.</p><p>Pick a number to see its name and its places.</p>',
      check:{kind:'mc',q:'Which number is four hundred six?',
        choices:[{id:'a',label:'460'},{id:'b',label:'406'},{id:'c',label:'4,006'}],answer:'b',
        why:{a:'460 is four hundred sixty. Six is ones, not tens.',c:'Four hundred is 400. It only needs three digits: 4 hundreds, 0 tens, 6 ones.'},
        explain:'Four hundred six is 4 hundreds, 0 tens, and 6 ones: 406.'}}
  ]},
  {icon:'expand',title:'Expanded form',game:{zone:'expand',name:'Spell Scrolls'},lessons:'Lessons 5–6',blurb:'Write a number as hundreds plus tens plus ones, and make the same number different ways.',steps:[
    {title:'Hundreds + tens + ones',widget:wExpanded,
      body:'<p><b>Expanded form</b> shows what each digit is worth. 342 = 300 + 40 + 2.</p><p>Pick a number. Tap each part to find its blocks.</p>',
      check:{kind:'num',answer:567,q:'What number is 500 + 60 + 7?',fig:htoFig(5,6,7,{cls:{t:'b',o:'c'}},'5 hundreds, 6 tens, and 7 ones'),
        misc:[[576,'60 is 6 tens and 7 is 7 ones: 5, then 6, then 7.'],[5607,'Each part goes in its own place: 5 hundreds, 6 tens, 7 ones. That’s three digits.'],[18,'The 5 is 500 and the 6 is 60. Don’t just add the digits.']],
        explain:'5 hundreds, 6 tens, and 7 ones: 567.'}},
    {title:'Different ways',widget:wTrade,
      body:'<p>You can break a hundred into 10 tens. The blocks change, but the number stays the same.</p><p>Break a hundred and see.</p>',
      check:{kind:'mc',q:'Which one is another way to make 452?',stack:true,
        choices:[{id:'a',label:'4 hundreds, 15 tens, 2 ones'},{id:'b',label:'3 hundreds, 15 tens, 2 ones'},{id:'c',label:'4 hundreds, 2 tens, 5 ones'}],answer:'b',
        why:{a:'15 tens is 150. 400 + 150 + 2 is 552, not 452.',c:'That’s 425. The 5 tens and 2 ones got switched.'},
        explain:'Break 1 of the 4 hundreds into 10 tens: 3 hundreds, 10 + 5 = 15 tens, 2 ones. 300 + 150 + 2 = 452.'}}
  ]},
  {icon:'line',title:'The number line to 1,000',game:{zone:'line',name:'Number Bridge'},lessons:'Lessons 8–9',blurb:'Find three-digit numbers on number lines counting by hundreds and tens, and compare them.',steps:[
    {title:'Find a number',widget:wLocate,
      body:'<p>On a number line to 1,000, the ticks can count by <b>hundreds</b>. To find a number, find its hundreds first. Then zoom in and count by <b>tens</b>.</p><p>Pick a number.</p>',
      check:{kind:'num',answer:470,fig:F.dot470,q:'The ticks count by tens. What number is the dot at?',
        misc:[[407,'Each space is 10 here, not 1.'],[480,'Count by tens from 400: 410, 420, 430, 440, 450, 460, 470.'],[460,'Count the spaces after 450: 460, 470.']],
        explain:'Count by tens from 400: 410, 420, … 470. Or from 450, two more tens is 470.'}},
    {title:'Compare on the number line',widget:wCompareLine,
      body:'<p>Just like with smaller numbers, the one farther <b>right</b> is <b>greater</b>.</p><p>Pick two numbers.</p>',
      check:{kind:'mc',q:'Which is true?',fig:F.cmp,
        choices:[{id:'a',label:'587 > 578'},{id:'b',label:'587 < 578'},{id:'c',label:'587 = 578'}],answer:'a',
        why:{b:'587 is to the right of 578, so 587 is greater. The open side faces the bigger number.',c:'They have the same digits, but not in the same places.'},
        explain:'587 is to the right of 578, so 587 > 578. Same hundreds, and 8 tens is more than 7 tens.'}}
  ]},
  {icon:'order',title:'Compare and order',game:{zone:'compare',name:'Knight’s Challenge'},lessons:'Lessons 10–12',blurb:'Compare numbers place by place, starting with hundreds, and put numbers in order.',steps:[
    {title:'Compare by place',widget:wPlaceCompare,
      body:'<p>To compare, start with the <b>hundreds</b>. If they’re the same, look at the <b>tens</b>. Then the <b>ones</b>.</p><p>Pick two numbers.</p>',
      check:{kind:'mc',q:'Which number is greatest?',
        choices:[{id:'a',label:'389'},{id:'b',label:'412'},{id:'c',label:'398'}],answer:'b',
        why:{a:'389 has only 3 hundreds. Is there a number with more hundreds?',c:'398 has big tens and ones, but only 3 hundreds. 412 has 4 hundreds.'},
        explain:'412 has 4 hundreds. The others have 3 hundreds, so 412 is greatest.'}},
    {title:'Put numbers in order',widget:wOrder,
      body:'<p>To put numbers in order, compare them place by place. <b>Least</b> is the smallest, and <b>greatest</b> is the biggest.</p>',
      check:{kind:'mc',q:'Which list goes from least to greatest?',
        choices:[{id:'a',label:'247, 274, 427'},{id:'b',label:'274, 247, 427'},{id:'c',label:'427, 274, 247'}],answer:'a',
        why:{b:'274 and 247 have the same hundreds. Compare the tens: 4 tens is less than 7 tens, so 247 comes first.',c:'That goes from greatest to least. Start with the smallest.'},
        explain:'247 and 274 both have 2 hundreds, and 4 tens < 7 tens, so 247 comes first. 427 has 4 hundreds, so it’s greatest.'}}
  ]}
];
