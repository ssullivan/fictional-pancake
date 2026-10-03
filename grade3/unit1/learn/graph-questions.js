/* Learn Introducing Multiplication (Grade 3 Unit 1), chapter 3: Questions about bar graphs. Its widgets and steps; loaded by graph-questions.html. */
const LENT=[{label:'Mon',day:'Monday',n:25,c:'red'},{label:'Tue',day:'Tuesday',n:15,c:'yellow'},{label:'Wed',day:'Wednesday',n:35,c:'green'},{label:'Thu',day:'Thursday',n:20,c:'blue'}];
/* the LENT bar graph; options add to barGraph's */
const lent=options=>barGraph(LENT,{max:40,scale:5,title:'Books the library lent',...options});
/* the pairs of days to compare (indexes into LENT) */
const PAIRS=[[2,1],[0,3],[2,0],[3,1]];
/* Compare two days: the shorter bar, then the taller one, with how much taller. */
function wCompare(el){
  const q=Q(el);let pairIndex=0;
  el.innerHTML=seg('Compare',PAIRS.map(([a,b],i)=>[i,`${LENT[a].label} and ${LENT[b].label}`]))+`<div class="fig" data-f></div><p class="readout" data-o></p>`;
  const draw=()=>{
    const [a,b]=PAIRS[pairIndex],[fewer,more]=LENT[a].n<LENT[b].n?[LENT[a],LENT[b]]:[LENT[b],LENT[a]],diff=more.n-fewer.n;press(el,pairIndex);
    q('f').innerHTML=barGraph([fewer,more],{max:40,scale:5,diff:[0,1],showDiff:true,title:'Books the library lent',label:`Bar graph: ${fewer.day} ${fewer.n}, ${more.day} ${more.n}, and ${diff} more on ${more.day}`});
    q('o').innerHTML=`${more.day}: ${more.n}. ${fewer.day}: ${fewer.n}. ${more.n} − ${fewer.n} = ${diff}.<br><span class="ok">The library lent ${diff} more books on ${more.day} than on ${fewer.day}, so ${fewer.day} had ${diff} fewer.</span>`;
  };
  el.addEventListener('click',e=>{const pairBtn=e.target.closest('[data-m]');if(pairBtn){pairIndex=+pairBtn.dataset.m;draw();}});
  draw();
}
/* Tap bars to add them up; tap one again to take it out. */
function wTotal(el){
  /* tapped: the indexes of the bars being added */
  const q=Q(el),tapped=new Set();
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-clr>Clear</button></div><p class="readout" data-o></p>`;
  const draw=()=>{
    const picked=[...tapped].sort(),sum=picked.reduce((total,i)=>total+LENT[i].n,0);
    q('f').innerHTML=lent({hi:picked,tap:true});
    q('o').innerHTML=!picked.length?'Tap bars to add them up. Tap a bar again to take it out.'
      :picked.length===1?`${LENT[picked[0]].day}: <b>${LENT[picked[0]].n} books</b>. Tap another bar to add it.`
      :`${picked.map(i=>LENT[i].label).join(' + ')}: ${picked.map(i=>LENT[i].n).join(' + ')} = <b>${sum} books</b>`+(picked.length===4?'.<br><span class="ok">That’s every day: the library lent 95 books in all.</span>':'.');
  };
  el.addEventListener('click',e=>{const bar=e.target.closest('[data-r]');if(!bar)return;const i=+bar.dataset.r;if(tapped.has(i))tapped.delete(i);else tapped.add(i);draw();});
  q('clr').onclick=()=>{tapped.clear();draw();};
  draw();
}
/* the quick checks' figures */
const F={
  sold:barGraph([{label:'Apples',n:70,c:'red'},{label:'Pears',n:40,c:'green'},{label:'Plums',n:55,c:'blue'}],{max:80,scale:10,title:'Fruit sold at the stand'}),
  fruit:barGraph([{label:'Apples',n:35,c:'red'},{label:'Pears',n:20,c:'green'},{label:'Plums',n:15,c:'blue'}],{max:40,scale:5,title:'Fruit sold on Saturday'})
};
const STEPS=[
    {title:'How many more? How many fewer?',widget:wCompare,
      body:'<p>To find <b>how many more</b>, find how much taller one bar is than the other: subtract the smaller number from the bigger one. The same difference tells <b>how many fewer</b>.</p><p>Pick two days to compare.</p>',
      check:{kind:'num',q:'How many more apples than pears were sold?',fig:F.sold,answer:30,unit:'apples',
        misc:[[110,'That’s apples and pears together. How many more means subtract: 70 − 40.'],[3,'The apple bar is 3 spaces taller, but each space is 10.']],
        explain:'70 − 40 = 30. The apple bar is 3 spaces taller, and each space is 10.'}},
    {title:'How many in all?',widget:wTotal,
      body:'<p>To find <b>how many in all</b>, add the numbers the bars show.</p><p>Tap bars to add them up.</p>',
      check:{kind:'num',q:'How many apples and plums were sold in all?',fig:F.fruit,answer:50,unit:'',
        misc:[[20,'That’s how many more apples than plums. In all means add.'],[70,'That’s all three fruits. Add just the apples and plums.']],
        explain:'Apples 35 and plums 15: 35 + 15 = 50.'}}
  ];
