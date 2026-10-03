/* Learn Measuring Length (Grade 2 Unit 3), chapter 5: Line plots. Its widgets and steps; loaded by line-plots.html. */
/* pencils and crayons as {length: how many}, and the leaves' lengths one by one */
const PENCILS={3:1,4:2,5:2,6:4,7:3,8:1},CRAYONS={5:1,6:3,7:2,8:5,9:2},LEAVES=[5,7,4,5,6,5,7,3];
/* Tap a length on the pencils' line plot to count its Xs. */
function wReadPlot(el){
  /* picked: the length tapped (null before one is) */
  const q=Q(el);let picked=null;
  el.innerHTML=`<p class="story">Our class measured our pencils. Each X is one pencil.</p><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const count=PENCILS[picked]||0;
    q('f').innerHTML=lineplot(PENCILS,3,8,{mark:picked,tap:true});
    q('r').innerHTML=picked===null?'Tap a number on the line plot.':`<b>${count} ${count===1?'pencil is':'pencils are'} ${picked} inches long.</b><br><span class="dimline">Count the Xs above ${picked}.</span>`;
  };
  el.addEventListener('click',e=>{const spot=e.target.closest('[data-v]');if(spot){picked=+spot.dataset.v;draw();}});
  draw();
}
/* Make a line plot: tap each leaf's length in turn to add its X. */
function wMakePlot(el){
  /* placed: how many leaves have their X; counts: the Xs so far; miss: the last wrong tap */
  const q=Q(el);let placed=0,counts={},miss=null;
  el.innerHTML=`<p class="story">We measured 8 leaves, in inches.</p><div class="chips" data-c></div><div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const done=placed===LEAVES.length;
    q('c').innerHTML=LEAVES.map((n,j)=>`<span class="chip${j<placed?' done':j===placed?' cur':''}">${n} in</span>`).join('');
    q('f').innerHTML=lineplot(counts,3,8,{tap:!done});
    q('r').innerHTML=done?`<span class="ok">You made a line plot! ${LEAVES.length} leaves, ${LEAVES.length} Xs.</span>`
      :miss!==null?`<span class="no">That’s ${miss}.</span> This leaf is <b>${LEAVES[placed]} inches</b>. Find ${LEAVES[placed]} on the line.`
      :`Next leaf: <b>${LEAVES[placed]} inches</b>. Tap ${LEAVES[placed]} on the line plot.`;
  };
  el.addEventListener('click',e=>{
    const spot=e.target.closest('[data-v]');if(!spot||placed>=LEAVES.length)return;
    const v=+spot.dataset.v;if(v===LEAVES[placed]){counts[v]=(counts[v]||0)+1;placed++;miss=null;}else miss=v;
    draw();
  });
  q('clr').onclick=()=>{placed=0;counts={};miss=null;draw();};
  draw();
}
/* questions the pencils' line plot answers: what to mark on it, and the answer */
const ASKS=[
  {label:'Longest',mark:8,say:'The longest pencil is <b>8 inches</b>. It’s the X farthest to the right.'},
  {label:'Shortest',mark:3,say:'The shortest pencil is <b>3 inches</b>. It’s the X farthest to the left.'},
  {label:'Most pencils',mark:6,say:'<b>6 inches</b> has the most Xs: 4 pencils are 6 inches long.'},
  {label:'How much longer?',diff:[3,8],say:'From 3 to 8 is <b>5 inches</b>. 8 − 3 = 5, so the longest pencil is 5 inches longer than the shortest.'},
];
/* Pick a question to see the line plot answer it. */
function wSays(el){
  const q=Q(el);let askIndex=0;
  el.innerHTML=seg('Question',ASKS.map((ask,i)=>[i,ask.label]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const ask=ASKS[askIndex];press(el,askIndex);
    q('f').innerHTML=lineplot(PENCILS,3,8,{mark:ask.mark??null,diff:ask.diff||null});
    q('r').innerHTML=`<span class="ok">${ask.say}</span>`;
  };
  el.addEventListener('click',e=>{const askBtn=e.target.closest('[data-m]');if(askBtn){askIndex=+askBtn.dataset.m;draw();}});
  draw();
}
/* a line plot of ribbons from 2 to 5 inches, for a quick check's choices */
const ribbon=(counts,label)=>lineplot(counts,2,5,{u:44,label});
/* the quick checks' figures */
const F={
  crayons:lineplot(CRAYONS,5,9,{unit:'centimeters'})
};
const STEPS=[
    {title:'Read a line plot',widget:wReadPlot,
      body:'<p>A <b>line plot</b> shows lengths on a number line. Each <b>X</b> is one thing that was measured.</p><p>Tap a number to count its Xs.</p>',
      check:{kind:'num',unit:'crayons',answer:5,fig:F.crayons,q:'We measured our crayons. How many crayons are 8 cm long?',
        misc:[[8,'8 is the length. Count the Xs above 8.'],[13,'That’s all the crayons. Count only the Xs above 8.']],
        explain:'There are 5 Xs above 8, so 5 crayons are 8 cm long.'}},
    {title:'Make a line plot',widget:wMakePlot,
      body:'<p>To make a line plot, put one <b>X</b> above the number for each length.</p><p>Tap the line plot to add each leaf.</p>',
      check:{kind:'mc',q:'Ribbons are 2, 3, 3, and 5 inches long. Which line plot shows them?',
        choices:[{id:'a',label:ribbon({2:1,3:2,4:1},'Line plot with Xs at 2, 3, 3, and 4')},{id:'b',label:ribbon({2:1,3:2,5:1},'Line plot with Xs at 2, 3, 3, and 5')},{id:'c',label:ribbon({2:1,3:1,5:1},'Line plot with Xs at 2, 3, and 5')}],answer:'b',
        why:{a:'Look at 4. No ribbon is 4 inches long.',c:'Two ribbons are 3 inches long, so 3 needs two Xs.'},
        explain:'One X at 2, two Xs at 3, and one X at 5: one X for each ribbon.'}},
    {title:'What the data says',widget:wSays,
      body:'<p>A line plot helps you see the <b>longest</b>, the <b>shortest</b>, and which length has the most. You can find how much longer, too.</p><p>Tap each question.</p>',
      check:{kind:'num',unit:'cm',answer:4,fig:F.crayons,q:'How much longer is the longest crayon than the shortest crayon?',
        misc:[[14,'You added. How much longer means find the difference: 9 − 5.'],[9,'9 cm is the longest crayon. How much longer is it than the shortest?'],[5,'5 cm is the shortest crayon. Find the difference between the longest and shortest.']],
        explain:'The longest crayon is 9 cm. The shortest is 5 cm. 9 − 5 = 4 cm.'}}
  ];
