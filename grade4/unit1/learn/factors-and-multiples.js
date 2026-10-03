/* Learn Factors and Multiples (Grade 4 Unit 1), chapter 5: Factors and multiples together. Its widgets and steps; loaded by factors-and-multiples.html. */
/* pairs [a, b] to ask: is a a factor of b? */
const FM=[[6,42],[8,50],[9,72],[7,40]];
/* Hop by a toward b: landing on b means a is a factor of b and b a multiple of a. */
function wFM(el){
  const q=Q(el);let pairIndex=0;
  el.innerHTML=seg('Numbers',FM.map(([a,b],i)=>[i,`${a} and ${b}`]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    /* hops: whole hops of a that fit in b; the line runs to b, or to the first multiple past it */
    const [a,b]=FM[pairIndex],hops=Math.floor(b/a),lands=b%a===0,lineEnd=(hops+(lands?0:1))*a;press(el,pairIndex);
    q('f').innerHTML=hopLine(a,lineEnd,lineEnd/a,{mark:b});
    q('r').innerHTML=lands?`Hops of ${a} land on ${b}: <b>${a} × ${hops} = ${b}</b>.<br><span class="ok">${a} is a <b>factor</b> of ${b}, and ${b} is a <b>multiple</b> of ${a}.</span><br><span class="dimline">${hops} is a factor of ${b} too.</span>`
      :`Hops of ${a} land on ${hops*a} and ${(hops+1)*a}, and skip ${b}.<br><span class="no">${a} is not a factor of ${b}, and ${b} is not a multiple of ${a}.</span>`;
  };
  el.addEventListener('click',e=>{const pairBtn=e.target.closest('[data-m]');if(pairBtn){pairIndex=+pairBtn.dataset.m;draw();}});
  draw();
}
const STEPS=[
    {title:'Factor or multiple?',widget:wFM,
      body:'<p>6 × 7 = 42 says two things: 6 is a <b>factor</b> of 42, and 42 is a <b>multiple</b> of 6. The multiple is the number you land on. The size of the hops and the number of hops are its factors.</p><p>Pick two numbers. Do the hops land on the bigger one?</p>',
      check:{kind:'mc',stack:true,q:'Which is true about 7 and 56?',
        choices:[{id:'a',label:'56 is a factor of 7.'},{id:'b',label:'7 is a multiple of 56.'},{id:'c',label:'7 is a factor of 56, and 56 is a multiple of 7.'}],answer:'c',
        why:{a:'56 is bigger than 7, so it can’t be a factor of 7. Try it the other way around.',b:'A multiple is the number you land on when you count by 7s. 7 × 8 = 56, so 56 is the multiple.'},
        explain:'7 × 8 = 56. So 7 and 8 are factors of 56, and 56 is a multiple of 7 and of 8.'}},
    {title:'Find all the factors',widget:pairsHunt([48,60,100]),
      body:'<p>Every factor pair gives you two factors. Find all the pairs and you have all the factors. (In a pair like 10 × 10, the factor counts once.)</p><p>Pick a number and keep trying rows.</p>',
      check:{kind:'num',unit:'factors',answer:9,q:'How many factors does 36 have?',
        misc:[[10,'6 × 6 = 36 has the same factor twice. Count 6 just once.'],[8,'Find the pairs: 1 × 36, 2 × 18, 3 × 12, 4 × 9, 6 × 6. Did you miss one?'],[5,'That’s the number of factor pairs. Each pair has two factors (except 6 × 6).']],
        explain:'The factor pairs are 1 × 36, 2 × 18, 3 × 12, 4 × 9, and 6 × 6. The factors are 1, 2, 3, 4, 6, 9, 12, 18, and 36: 9 factors.'}}
  ];
