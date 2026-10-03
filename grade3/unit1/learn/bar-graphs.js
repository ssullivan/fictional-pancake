/* Learn Introducing Multiplication (Grade 3 Unit 1), chapter 2: Scaled bar graphs. Its widgets and steps; loaded by bar-graphs.html. */
/* where a value sits on a scale: "on the 40 line", or "halfway between 20 and 30" */
const onScale=(value,scale)=>value%scale?`halfway between ${value-value%scale} and ${value-value%scale+scale}`:`on the ${value} line`;
const CANS=[{label:'Room 1',n:25,c:'red'},{label:'Room 2',n:40,c:'blue'},{label:'Room 3',n:15,c:'green'}];
/* Set each bar by tapping, on a scale of 10, in steps of 5, to match the table. */
function wBars(el){
  /* heights: where each bar ends (0 for no bar yet) */
  const q=Q(el),heights=[0,0,0];
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-o></p>`;
  const draw=()=>{
    q('f').innerHTML=barGraph(CANS.map((row,i)=>({...row,n:heights[i]})),{max:50,scale:10,step:5,uh:48,edit:true,title:'Cans collected: tap to set each bar'});
    const done=CANS.every((row,i)=>heights[i]===row.n);
    q('o').innerHTML=`The table says: ${CANS.map(row=>`${row.label} ${row.n}`).join(', ')}.<br>`
      +CANS.map((row,i)=>!heights[i]?`${row.label}: no bar yet.`:`${row.label}: ${heights[i]}, ${onScale(heights[i],10)}${heights[i]===row.n?' ✓':''}.`).join('<br>')
      +(done?'<br><span class="ok">All three bars match. A bar can end between two lines: 25 is halfway between 20 and 30.</span>':'');
  };
  /* a tap target says which bar (data-r) and how high (data-v) */
  el.addEventListener('click',e=>{const target=e.target.closest('[data-v]');if(target){heights[+target.dataset.r]=+target.dataset.v;draw();}});
  q('clr').onclick=()=>{heights.fill(0);draw();};
  draw();
}
const PICKED=[{label:'Mon',n:40,c:'red'},{label:'Tue',n:25,c:'yellow'},{label:'Wed',n:35,c:'green'},{label:'Thu',n:20,c:'blue'}];
const SCALE_WHY={
  2:'A line every 2 makes 20 spaces. That’s a very tall graph with lots of lines to count, and 25 and 35 still end between lines.',
  5:'A line every 5 makes 8 spaces. Every bar ends right on a line, and the graph isn’t too tall. <span class="ok">This scale fits best.</span>',
  10:'A line every 10 makes only 4 spaces. It’s short, but Tuesday and Wednesday end between lines, so they’re harder to read.'
};
/* The same data on scales of 2, 5, and 10, and what each scale is like to read. */
function wScale(el){
  const q=Q(el);let scale=5;
  el.innerHTML=seg('Scale',[[2,'Count by 2s'],[5,'Count by 5s'],[10,'Count by 10s']])+`<div class="fig" data-f></div><p class="readout" data-o></p>`;
  const draw=()=>{
    press(el,scale);
    q('f').innerHTML=barGraph(PICKED,{max:40,scale,title:'Apples picked'});
    q('o').innerHTML=`Apples picked: ${PICKED.map(row=>`${row.label} ${row.n}`).join(', ')}.<br>${SCALE_WHY[scale]}`;
  };
  el.addEventListener('click',e=>{const scaleBtn=e.target.closest('[data-m]');if(scaleBtn){scale=+scaleBtn.dataset.m;draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  books:barGraph([{label:'Mon',n:6,c:'blue'},{label:'Tue',n:9,c:'green'},{label:'Wed',n:4,c:'red'}],{max:10,scale:2,title:'Books read'})
};
const STEPS=[
    {title:'Bars on a scale',widget:wBars,
      body:'<p>In a <b>scaled bar graph</b>, the lines go up by the same amount each time, like 10, 20, 30. That amount is the <b>scale</b>. A bar can end between two lines: halfway between 20 and 30 is 25.</p><p>Tap in each column to make its bar match the table.</p>',
      check:{kind:'num',q:'How many books were read on Tuesday?',fig:F.books,answer:9,unit:'books',
        misc:[[8,'The bar goes past 8. It ends halfway between 8 and 10.'],[10,'The bar doesn’t reach 10. It ends halfway between 8 and 10.']],
        explain:'The lines go up by 2s. The Tuesday bar ends halfway between 8 and 10, so it shows 9.'}},
    {title:'Choose a scale',widget:wScale,
      body:'<p>The same data can use different scales. A good scale keeps the graph from being too tall and lets most bars end on a line.</p><p>Try each scale.</p>',
      check:{kind:'mc',q:'A class counted birds: 30 robins, 60 sparrows, and 90 pigeons. Which scale is best for a bar graph?',
        choices:[{id:'a',label:'A line every 1'},{id:'b',label:'A line every 2'},{id:'c',label:'A line every 10'}],answer:'c',
        why:{a:'That needs 90 spaces. The graph would be much too tall.',b:'That needs 45 spaces. That’s still a lot to draw and count.'},
        explain:'30, 60, and 90 are all counted in tens. A line every 10 makes 9 spaces, and every bar ends on a line.'}}
  ];
