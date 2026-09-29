/* Learn Extending Operations to Fractions (Grade 4 Unit 3), chapter 5: Line plots with fractions. Its widgets and steps; loaded by line-plots.html. */
/* beetles from the school garden, in eighths of an inch */
const BEETLES=[5,3,4,6,4,7,5,4],beetlePlot=(counts,o={})=>lineplot(counts,0,8,{d:8,unit:'inches',...o});
const countOf=list=>list.reduce((c,v)=>(c[v]=(c[v]||0)+1,c),{});
function wMake(el){
  const q=Q(el);let i=0,c={},miss=null;
  el.innerHTML=`<p class="story">We measured 8 beetles in the school garden, to the nearest ${fr(1,8)} inch.</p><div class="chips" data-c></div><div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const done=i===BEETLES.length,v=BEETLES[i];
    q('c').innerHTML=BEETLES.map((n,j)=>`<span class="chip${j<i?' done':j===i?' cur':''}">${fr(n,8)} in</span>`).join('');
    q('f').innerHTML=beetlePlot(c,{tap:!done});
    q('r').innerHTML=done?`<span class="ok">You made a line plot! ${BEETLES.length} beetles, ${BEETLES.length} Xs.</span>`
      :(miss!==null?`<span class="no">That’s ${miss%8?fr(miss,8):miss/8}.</span> `:'')+`This beetle is <b>${fr(v,8)} inch</b> long. Tap ${fr(v,8)} on the line plot.`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(!b||i>=BEETLES.length)return;const v=+b.dataset.v;if(v===BEETLES[i]){c[v]=(c[v]||0)+1;i++;miss=null;}else miss=v;draw();});
  q('clr').onclick=()=>{i=0;c={};miss=null;draw();};
  draw();
}
/* questions the line plot answers, with adding, subtracting, and equal groups */
const ASKS=[
  {label:'Longest',mark:7,say:`The longest beetle is <b>${fr(7,8)} inch</b>. It’s the X farthest to the right.`},
  {label:'Shortest',mark:3,say:`The shortest beetle is <b>${fr(3,8)} inch</b>. It’s the X farthest to the left.`},
  {label:'Most beetles',mark:4,say:`<b>${fr(4,8)} inch</b> has the most Xs: 3 beetles are ${fr(4,8)} inch long.`},
  {label:'How much longer?',diff:[3,7],say:`From ${fr(3,8)} to ${fr(7,8)} is <b>${fr(4,8)} inch</b>. ${fr(7,8)} − ${fr(3,8)} = ${fr(4,8)}, so the longest beetle is ${fr(4,8)} inch longer than the shortest.`},
  {label:'In a row',mark:4,say:`The 3 beetles that are ${fr(4,8)} inch long, nose to tail: 3 × ${fr(4,8)} = <b>${fr(12,8)} inches</b>. That’s 1 ${fr(4,8)} inches.`},
];
function wAsk(el){
  const q=Q(el);let k=0;
  el.innerHTML=seg('Question',ASKS.map((a,i)=>[i,a.label]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const A=ASKS[k];press(el,k);
    q('f').innerHTML=beetlePlot(countOf(BEETLES),{mark:A.mark??null,diff:A.diff||null});
    q('r').innerHTML=`<span class="ok">${A.say}</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){k=+b.dataset.m;draw();}});
  draw();
}
const seeds=(counts,label)=>lineplot(counts,0,4,{d:4,u:52,label});
/* the quick checks' figures */
const F={
  snow:lineplot({1:2,2:3,3:1,4:1},0,4,{d:4,unit:'inches of snow',label:'Line plot of snowfall on 7 days, in fourths of an inch: 2 days at 1/4, 3 at 2/4, 1 at 3/4, and 1 at 1'})
};
const STEPS=[
    {title:'Make a line plot',widget:wMake,
      body:'<p>A <b>line plot</b> can show measurements in fractions of an inch. The number line is marked in eighths, and each <b>X</b> is one thing that was measured.</p><p>Tap the line plot to add each beetle.</p>',
      check:{kind:'mc',q:'Kiran measured 4 bean seeds: '+fr(2,4)+', '+fr(3,4)+', '+fr(3,4)+', and 1 inch long. Which line plot shows them?',
        choices:[{id:'a',label:seeds({2:1,3:2,4:1},'Line plot with Xs at 2/4, 3/4, 3/4, and 1')},{id:'b',label:seeds({2:1,3:1,4:1},'Line plot with Xs at 2/4, 3/4, and 1')},{id:'c',label:seeds({1:1,2:1,3:2},'Line plot with Xs at 1/4, 2/4, 3/4, and 3/4')}],answer:'a',
        why:{b:'Two seeds are '+fr(3,4)+' inch long, so '+fr(3,4)+' needs two Xs.',c:'Look at '+fr(1,4)+'. No seed is '+fr(1,4)+' inch long, but one is 1 inch.'},
        explain:'One X at '+fr(2,4)+', two Xs at '+fr(3,4)+', and one X at 1: one X for each seed.'}},
    {title:'Answer questions with a line plot',widget:wAsk,
      body:'<p>A line plot shows the longest and shortest at a glance. To find how much longer, subtract. To find a total, add, or multiply when the lengths are the same.</p><p>Tap each question.</p>',
      check:{kind:'mc',q:'The line plot shows how much snow fell on 7 days. How much more snow fell on the snowiest day than on the least snowy day?',fig:F.snow,
        choices:[{id:'a',label:fr(5,4)+' inches'},{id:'b',label:fr(3,4)+' inch'},{id:'c',label:'1 inch'}],answer:'b',
        why:{a:'You added. How much more means find the difference: 1 − '+fr(1,4)+'.',c:'1 inch fell on the snowiest day. How much more is that than '+fr(1,4)+' inch?'},
        explain:'The snowiest day had 1 inch, which is '+fr(4,4)+'. The least snowy had '+fr(1,4)+' inch. '+fr(4,4)+' − '+fr(1,4)+' = '+fr(3,4)+' inch.'}}
  ];
