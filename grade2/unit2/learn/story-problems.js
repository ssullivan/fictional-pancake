/* Learn Adding and Subtracting within 100 (Grade 2 Unit 2), chapter 5: Story problems. Its widgets and steps; loaded by story-problems.html. */
const WHERE=[
  {label:'Whole unknown',story:'Andre has 36 red cubes and 25 blue cubes. How many cubes does Andre have?',parts:[[36,'36'],[25,'25']],total:'?',ans:'The whole is missing, so add the parts: 36 + 25 = 61 cubes.'},
  {label:'Part unknown',story:'Lin had 70 crayons. Some crayons broke. Now Lin has 45 crayons that aren’t broken. How many crayons broke?',parts:[[45,'45'],[25,'?']],total:'70',ans:'A part is missing: 45 + ? = 70, or 70 − 45 = 25 crayons.'},
  {label:'Start unknown',story:'Noah had some stickers. Noah got 24 more stickers. Now Noah has 60. How many stickers did Noah have at first?',parts:[[36,'?'],[24,'24']],total:'60',ans:'The start is missing: ? + 24 = 60, or 60 − 24 = 36 stickers.'},
];
function wWhere(el){
  const q=Q(el);let k=0,shown=false;
  el.innerHTML=seg('Kind of story',WHERE.map((x,i)=>[i,x.label]))+`<p class="story" data-s></p><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Show the answer</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const K=WHERE[k];press(el,k);
    q('s').textContent=K.story;
    q('f').innerHTML=partWhole(K.parts.map(([n,show])=>({n,show,hi:show==='?'})),K.total);
    q('go').hidden=shown;
    q('r').innerHTML=shown?`<span class="ok">${K.ans}</span>`:'Which number in the story is the whole? Which are parts?';
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){k=+b.dataset.m;shown=false;draw();}});
  q('go').onclick=()=>{shown=true;draw();};
  draw();
}
const EQS=[
  {story:'Some ducks were in the pond. 25 more ducks came. Now there are 60 ducks. How many ducks were in the pond at first?',eqs:['? + 25 = 60','60 − 25 = ?'],parts:[[35,'?'],[25,'25']],total:'60',a:35,check:'35 + 25 = 60'},
  {story:'Elena had 82 pages to read. Elena read some pages. Now Elena has 40 pages left. How many pages did Elena read?',eqs:['82 − ? = 40','40 + ? = 82'],parts:[[40,'40'],[42,'?']],total:'82',a:42,check:'82 − 42 = 40'},
];
function wEquations(el){
  const q=Q(el);let k=0,e=-1;
  el.innerHTML=seg('Story',EQS.map((_,i)=>[i,`Story ${i+1}`]))+`<p class="story" data-s></p><div class="fig" data-f></div><div class="chips" data-c></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const K=EQS[k];press(el,k);
    q('s').textContent=K.story;
    q('f').innerHTML=partWhole(K.parts.map(([n,show])=>({n,show})),K.total);
    q('c').innerHTML=K.eqs.map((x,i)=>`<button type="button" class="chip" data-e="${i}" aria-pressed="${i===e}">${x}</button>`).join('');
    q('r').innerHTML=e<0?'Tap an equation. Does it match the story?':`<b>${K.eqs[e].replace('?',`<span class="ok">${K.a}</span>`)}</b><br><span class="dimline">It matches the story. Both equations give ${K.a}. Check: ${K.check}.</span>`;
  };
  el.addEventListener('click',ev=>{const b=ev.target.closest('[data-m]');if(b){k=+b.dataset.m;e=-1;draw();return;}const c=ev.target.closest('[data-e]');if(c){e=+c.dataset.e;draw();}});
  draw();
}
function wTwoStep(el){
  const q=Q(el);let n=0;
  el.innerHTML=`<p class="story">Kiran has 28 stickers. Kiran gets 15 more stickers. Then Kiran gives 20 stickers to Mai. How many stickers does Kiran have now?</p><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    q('f').innerHTML=n===0?partWhole([{n:28,show:'28'},{n:15,show:'15'}],'?','28 and 15 make the whole')
      :partWhole([{n:28,show:'28'},{n:15,show:'15'}],'43','28 and 15 make 43')+partWhole([{n:20,show:'20'},{n:23,show:n>1?'23':'?',hi:true}],'43','43 is 20 and a part left');
    q('go').textContent=n===0?'Step 1: gets more':n===1?'Step 2: gives some away':'Start over';
    q('r').innerHTML=n===0?'This story has two steps. What happens first?':n===1?`Step 1: <b>28 + 15 = 43</b> stickers.<br><span class="dimline">Now Kiran gives 20 away. What’s left?</span>`:`Step 1: <b>28 + 15 = 43</b>. Step 2: <b>43 − 20 = 23</b>.<br><span class="ok">Kiran has 23 stickers now.</span>`;
  };
  q('go').onclick=()=>{n=(n+1)%3;draw();};
  draw();
}
const apples=(p,total,label)=>partWhole(p.map(([n,show])=>({n,show})),total,label);
/* the quick checks' figures */
const F={
  diego:partWhole([{n:27,show:'?'},{n:18,show:'18'}],'45','Some marbles and 18 more make 45'),
  cards:partWhole([{n:34,show:'34'},{n:25,show:'25'}],'?','34 and 25 make the whole')
};
const STEPS=[
    {title:'Story problems and diagrams',widget:wWhere,
      body:'<p>In a story, the <b>?</b> can be the whole, a part, or even the start. A tape diagram shows where it goes.</p><p>Tap each kind of story.</p>',
      check:{kind:'mc',q:'Jada picks 28 apples. Han picks some apples too. Together they pick 64 apples. Which diagram matches the story?',
        choices:[{id:'a',label:apples([[28,'28'],[36,'?']],'64','Parts 28 and question mark, total 64')},{id:'b',label:apples([[28,'28'],[64,'64']],'?','Parts 28 and 64, total question mark')},{id:'c',label:apples([[28,'28'],[36,'?']],'?','Parts 28 and question mark, total question mark')}],answer:'a',
        why:{b:'64 is how many they pick together: the whole, not a part.',c:'The story tells you 64. Where does 64 go? It’s how many they pick together: the whole.'},
        explain:'28 is Jada’s part, Han’s part is ?, and 64 is the whole. 28 + ? = 64, so Han picks 36.'}},
    {title:'Story problems and equations',widget:wEquations,
      body:'<p>More than one equation can match a story. <b>? + 25 = 60</b> and <b>60 − 25 = ?</b> both find the missing part.</p><p>Tap each equation to see that it matches.</p>',
      check:{kind:'num',unit:'marbles',answer:27,fig:F.diego,q:'Diego had some marbles. Diego got 18 more marbles. Now Diego has 45 marbles. How many marbles did Diego have at first?',
        misc:[[63,'You added 45 and 18. 45 is how many Diego has now, after getting more. Diego had fewer at first.'],[18,'That’s how many Diego got. How many did Diego have before that?'],[37,'You broke a ten but kept 4 tens. After breaking a ten, 45 is 3 tens and 15 ones: 3 − 1 = 2 tens.']],
        explain:'? + 18 = 45, so 45 − 18 = 27. Check: 27 + 18 = 45.'}},
    {title:'Two-step stories',widget:wTwoStep,
      body:'<p>Some stories have <b>two steps</b>. Solve the first step, then use that answer in the second step.</p><p>Tap to do one step at a time.</p>',
      check:{kind:'num',unit:'cards',answer:29,fig:F.cards,q:'Elena has 34 cards. Elena buys 25 more cards. Then Elena gives 30 cards away. How many cards does Elena have now?',
        misc:[[59,'That’s step 1: 34 + 25 = 59. Now Elena gives 30 away.'],[89,'You added all three. Elena gives 30 away, so subtract that part.'],[4,'You skipped the cards Elena bought. First add 34 + 25.']],
        explain:'Step 1: 34 + 25 = 59. Step 2: 59 − 30 = 29 cards.'}}
  ];
