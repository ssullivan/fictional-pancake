/* Learn Introducing Ratios (Grade 6 Unit 2), chapter 2: Equivalent ratios. Its widgets and steps; loaded by equivalent.html. */
/* recipes: a of x to b of y in one batch */
const RECIPES=[
  {dish:'lemonade',a:1,b:3,x:['cup of lemon juice','cups of lemon juice'],y:['cup of water','cups of water']},
  {dish:'pancakes',a:3,b:2,x:['cup of flour','cups of flour'],y:['egg','eggs']},
  {dish:'trail mix',a:2,b:1,x:['cup of peanuts','cups of peanuts'],y:['cup of raisins','cups of raisins']},
];
function wBatch(el){
  const q=Q(el),st={n:1};let p=0;
  el.innerHTML=seg('Recipe',RECIPES.map((r,i)=>[i,r.dish]))+`<div class="wrow">${stepper('n','Batches')}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const r=RECIPES[p],{n}=st;press(el,p);q('n').textContent=n;
    q('f').innerHTML=batchDiagram(r.a,r.b,n,r);
    q('r').innerHTML=`${n} ${n===1?'batch':'batches'}: <b>${nOf(r.a*n,r.x)}</b> and <b>${nOf(r.b*n,r.y)}</b>, a ratio of <b>${r.a*n} : ${r.b*n}</b>.<br><span class="dimline">Every batch has ${r.a} : ${r.b}, so they all taste the same: ${Array.from({length:n},(_,i)=>`${r.a*(i+1)} : ${r.b*(i+1)}`).join(', ')}.</span>`;
  };
  steppers(el,st,{n:[1,5]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;st.n=1;draw();}});
  draw();
}

/* two paint mixes: the same color when their ratios are equivalent */
function wPaint(el){
  const q=Q(el),st={bl:4,ye:5};
  el.innerHTML=`<p class="note">Mix A is 2 cups of blue to 3 cups of yellow. Make mix B.</p><div class="wrow">${stepper('bl','Blue cups')}${stepper('ye','Yellow cups')}</div><div class="swatches" data-s></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {bl,ye}=st,same=bl*3===ye*2;q('bl').textContent=bl;q('ye').textContent=ye;
    /* each swatch, with a bar that shows its share of blue and of yellow (close mixes can look alike) */
    const card=(name,b,y)=>`<div class="swatch-card"><span style="background:${mixColor(b,y)}"></span><div class="mixbar" role="img" aria-label="${b} parts blue to ${y} parts yellow"><i class="bl" style="flex:${b}"></i><i class="ye" style="flex:${y}"></i></div>${name} ${b} : ${y}</div>`;
    q('s').innerHTML=card('Mix A',2,3)+card('Mix B',bl,ye);
    q('r').innerHTML=same?`<span class="ok">The same color! ${bl} : ${ye} is 2 : 3 times ${bl/2}.</span>`
      :`<span class="no">A different color.</span> Mix B is ${bl*3>ye*2?'bluer':'more yellow'}.<br><span class="dimline">For the same color, blue and yellow have to be 2 : 3 times the same number, like 4 : 6 or 6 : 9.</span>`;
  };
  steppers(el,st,{bl:[1,10],ye:[1,15]},draw);
  draw();
}

/* is it equivalent to 4 : 6? Both simplify to the same ratio */
const TRY=[[6,9],[8,10],[2,3],[12,18],[6,4]];
function wEquiv(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Compare 4 : 6 with',TRY.map(([a,b],i)=>[i,`${a} : ${b}`]))+`<p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=TRY[p],g=gcd(a,b),yes=a*6===b*4;press(el,p);
    q('r').innerHTML=`4 : 6 divided by 2 is <b>2 : 3</b>. ${a} : ${b}${g>1?` divided by ${g} is <b>${a/g} : ${b/g}</b>`:' can’t be divided any more'}.<br>`
      +(yes?`<span class="ok">Equivalent: both are 2 : 3 times a number.</span>`:`<span class="no">Not equivalent.</span> <span class="dimline">${a/g} : ${b/g} isn’t 2 : 3.</span>`);
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

const STEPS=[
  {title:'Batches of a recipe',widget:wBatch,
    body:'<p>Make more of a recipe by making more <b>batches</b>. Each batch uses the same amounts, so 2 batches of 1 : 3 lemonade is 2 : 6, and it tastes the same.</p><p>Pick a recipe and add batches.</p>',
    check:{kind:'num',unit:'cups of flour',answer:12,q:'A pancake recipe uses 3 cups of flour for 2 eggs. How many cups of flour go with 8 eggs?',
      misc:[[9,'You added 6 to both. For the same pancakes, multiply both: 8 eggs is 4 batches of 2 eggs.'],[24,'That’s 3 × 8. 8 eggs is 4 batches, not 8: 4 × 3.'],[16,'That’s 8 × 2. Find how many batches 8 eggs is: 8 ÷ 2 = 4.']],
      explain:'8 eggs is 4 batches of 2 eggs. 4 batches of 3 cups of flour is 12 cups.'}},
  {title:'The same color',widget:wPaint,
    body:'<p>Two paint mixes are the same color when their ratios are <b>equivalent</b>: one is the other times the same number. Adding the same amount to both changes the color.</p><p>Change mix B until it matches mix A.</p>',
    check:{kind:'mc',q:'Which mix is the same color as 2 cups of red to 5 cups of white?',
      choices:[{id:'a',label:'4 red : 10 white'},{id:'b',label:'3 red : 6 white'},{id:'c',label:'5 red : 2 white'}],answer:'a',
      why:{b:'That adds 1 cup to each. Adding doesn’t keep the color: 3 : 6 is 1 : 2, a redder pink.',c:'Order matters: that’s 5 red to 2 white, much redder.'},
      explain:'4 : 10 is 2 : 5 times 2, so it’s the same color.'}},
  {title:'Equivalent ratios',widget:wEquiv,
    body:'<p>Ratios are <b>equivalent</b> when you can multiply (or divide) both numbers of one by the same number to get the other. 4 : 6 and 6 : 9 are both 2 : 3 times a number.</p><p>Pick a ratio to compare with 4 : 6.</p>',
    check:{kind:'mc',q:'Which ratio is equivalent to 4 : 6?',
      choices:[{id:'a',label:'10 : 15'},{id:'b',label:'6 : 8'},{id:'c',label:'8 : 6'}],answer:'a',
      why:{b:'That adds 2 to each number. Equivalent ratios multiply (or divide) both by the same number.',c:'Only the first number doubled. Multiply both: 8 : 12.'},
      explain:'4 : 6 is 2 : 3 times 2, and 10 : 15 is 2 : 3 times 5. They’re equivalent.'}}
];
