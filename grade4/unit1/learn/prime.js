/* Learn Factors and Multiples (Grade 4 Unit 1), chapter 3: Prime and composite. Its widgets and steps; loaded by prime.html. */
/* the numbers to choose from */
const PRN=[5,7,9,11,12,13,15,16];
/* Every rectangle n tiles make: just one means n is prime, more means composite. */
function wPrime(el){
  const q=Q(el);let n=PRN[0];
  el.innerHTML=seg('Number',PRN.map(v=>[v,v]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const pairs=pairsOf(n);press(el,n);
    q('f').innerHTML=allRects(n);
    q('r').innerHTML=pairs.length===1?`${n} tiles make just <b>1 rectangle</b>: 1 × ${n}.<br><span class="ok">${n} is <b>prime</b>. Its only factors are 1 and ${n}.</span>`
      :`${n} tiles make <b>${pairs.length} rectangles</b>: ${pairs.map(([a,b])=>`${a} × ${b}`).join(', ')}.<br><span class="ok">${n} is <b>composite</b>. Its factors are ${list(factors(n))}.</span>`;
  };
  el.addEventListener('click',e=>{const numberBtn=e.target.closest('[data-m]');if(numberBtn){n=+numberBtn.dataset.m;draw();}});
  draw();
}
/* Tap numbers 1 to 30 to sort them: gold for prime, blue for composite, and 1 for neither. */
function wSort(el){
  /* sorted: the numbers tapped so far; picked: the one tapped last */
  const q=Q(el),sorted=new Set();let picked=null;
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-all>Show them all</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    q('f').innerHTML=chart(30,x=>(sorted.has(x)?(x===1?'one':isPrime(x)?'a':'b'):'')+(x===picked?' cur':''),{tap:true,label:'Numbers 1 to 30. '+(sorted.size?'Prime: '+list([...sorted].filter(isPrime).sort((a,b)=>a-b)):'Tap a number.')});
    if(picked===null){q('r').innerHTML='Tap a number to sort it. <span class="dimline">Gold means prime. Blue means composite.</span>';return;}
    /* a composite number's second factor pair shows it has more than 1 × itself */
    const pairs=pairsOf(picked);
    q('r').innerHTML=picked===1?`<b>1</b> has only one factor: 1. It’s <b>neither</b> prime nor composite.`
      :pairs.length===1?`<b>${picked}</b>: the only factor pair is 1 × ${picked}. <span class="ok">Prime.</span>`
      :`<b>${picked}</b> = ${pairs[1][0]} × ${pairs[1][1]}, so it has more than one factor pair. <span class="ok">Composite.</span><br><span class="dimline">Factors: ${list(factors(picked))}</span>`;
  };
  el.addEventListener('click',e=>{const square=e.target.closest('[data-v]');if(square){picked=+square.dataset.v;sorted.add(picked);draw();}});
  q('all').onclick=()=>{range(30).forEach(i=>sorted.add(i+1));picked=null;draw();q('r').innerHTML=`Primes up to 30: <b>${list(range(30).map(i=>i+1).filter(isPrime))}</b>.<br><span class="dimline">2 is the only even prime. Every other even number has 2 as a factor.</span>`;};
  q('clr').onclick=()=>{sorted.clear();picked=null;draw();};
  draw();
}
const STEPS=[
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
  ];
