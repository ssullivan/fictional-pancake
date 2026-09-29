/* Learn Factors and Multiples (Grade 4 Unit 1), chapter 3: Prime and composite. Its widgets and steps; loaded by prime.html. */
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
