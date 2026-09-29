/* Learn Introducing Ratios (Grade 6 Unit 2), chapter 5: Tables. Its widgets and steps; loaded by tables.html. */
/* a table of equivalent ratios, one row at a time */
const TABLES=[
  {hx:'cups of flour',hy:'cups of milk',a:2,b:3},
  {hx:'minutes',hy:'pages read',a:5,b:4},
  {hx:'dollars',hy:'songs',a:3,b:2},
];
function wTable(el){
  const q=Q(el),st={k:3};let p=0;
  el.innerHTML=seg('Table',TABLES.map((t,i)=>[i,`${t.hx} and ${t.hy}`]))+`<div class="wrow">${stepper('k','Rows')}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {a,b,...c}=TABLES[p],{k}=st;press(el,p);q('k').textContent=k;
    q('f').innerHTML=tableFig(c,Array.from({length:k},(_,i)=>({x:a*(i+1),y:b*(i+1),note:i?`× ${i+1}`:''})))(true);
    q('r').innerHTML=`Row ${k}: <b>${a*k} : ${b*k}</b>, the first row times ${k}.<br><span class="dimline">Every row is ${a} : ${b} times the same number, so every row is an equivalent ratio.</span>`;
  };
  steppers(el,st,{k:[1,6]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

/* go through 1: n things cost c, so 1 costs c ÷ n and m cost m × that */
const THROUGH=[
  {n:4,what:['notebook','notebooks'],cost:10},
  {n:5,what:['bag of rice','bags of rice'],cost:12},
  {n:8,what:['bottle of water','bottles of water'],cost:6},
];
function wThrough(el){
  const q=Q(el),st={m:6};let p=0;
  el.innerHTML=seg('Buy',THROUGH.map((t,i)=>[i,t.what[1]]))+`<div class="wrow">${stepper('m','How many')}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {n,what,cost}=THROUGH[p],{m}=st,one=cost/n;press(el,p);q('m').textContent=m;
    q('f').innerHTML=tableFig({hx:what[1],hy:'dollars'},[{x:n,y:cost},{x:1,y:one,note:`÷ ${n}`},{x:m,y:m*one,note:`× ${m}`}])(true);
    q('r').innerHTML=`${n} ${what[1]} cost ${money(cost)}, so 1 costs ${money(cost)} ÷ ${n} = <b>${money(one)}</b>.<br>${m} ${what[m===1?0:1]} ${m===1?'costs':'cost'} ${m} × ${money(one)} = <b>${money(m*one)}</b>.`;
  };
  steppers(el,st,{m:[1,12]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

/* the quick checks' figures */
const F={
  juice:tableFig({hx:'cups of juice',hy:'cups of water'},[{x:3,y:5},{x:6,y:10},{x:12,q:'y'}])(false),
};
const STEPS=[
  {title:'Tables of equivalent ratios',widget:wTable,
    body:'<p>A <b>table</b> of equivalent ratios lists pairs in the same ratio, one pair to a row. Every row is the first row times the same number.</p><p>Pick a table and add rows.</p>',
    check:{kind:'num',unit:'cups of water',answer:20,fig:F.juice,q:'Juice and water are mixed in the ratio in this table. How much water goes with 12 cups of juice?',
      misc:[[16,'You added 6 because 12 is 6 more than 6. Multiply: 12 is 6 × 2, so the water is 10 × 2.'],[15,'That’s 3 × 5. 12 cups of juice is 4 times 3, so the water is 4 times 5.'],[60,'That’s 12 × 5. The juice went × 4 (3 to 12), so the water goes × 4 too: 5 × 4.']],
      explain:'12 cups of juice is 3 × 4, so the water is 5 × 4 = 20 cups.'}},
  {title:'Go through 1',widget:wThrough,
    body:'<p>When one amount doesn’t multiply neatly into the other, go through <b>1</b>: divide to find the amount for one, then multiply to get any amount.</p><p>Pick something to buy and change how many.</p>',
    check:{kind:'num',unit:'dollars',answer:15,q:'4 notebooks cost $10. How much do 6 notebooks cost?',
      misc:[[12,'You added $2 because there are 2 more notebooks. Find 1 notebook first: $10 ÷ 4 = $2.50.'],[60,'That’s $10 × 6. Go through 1 notebook: $2.50, then × 6.'],[2.5,'That’s 1 notebook. Now multiply by 6.']],
      explain:'1 notebook costs $10 ÷ 4 = $2.50, so 6 notebooks cost 6 × $2.50 = $15.'}}
];
