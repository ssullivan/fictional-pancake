/* Learn Addition and Subtraction on the Number Line (Grade 2 Unit 4), chapter 2: Compare and estimate. Its widgets and steps; loaded by compare-and-estimate.html. */
const PAIRS=[[38,83],[47,52],[65,56],[29,31]];
/* Two numbers on a number line: the one farther right is greater. */
function wCompare(el){
  const q=Q(el);let pairIndex=0;
  el.innerHTML=seg('Numbers',PAIRS.map(([a,b],i)=>[i,`${a} and ${b}`]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=PAIRS[pairIndex],[lo,hi]=around(a,b),bigger=Math.max(a,b),smaller=Math.min(a,b);press(el,pairIndex);
    q('f').innerHTML=line(lo,hi,{pts:[{v:a,t:a},{v:b,cls:'b',t:b}],label:`A number line with dots at ${a} and ${b}`});
    q('r').innerHTML=`<b>${bigger}</b> is farther right, so ${bigger} is greater.<br><span class="ok"><b>${a} ${a>b?'>':'<'} ${b}</b></span><br><span class="dimline">${a>b?`${a} is greater than ${b}`:`${a} is less than ${b}`}. ${Math.floor(a/10)!==Math.floor(b/10)?`Look at the tens: ${Math.floor(bigger/10)} tens is more than ${Math.floor(smaller/10)} tens.`:`Same tens, so look at the ones: ${bigger%10} ones is more than ${smaller%10} ones.`}</span>`;
  };
  el.addEventListener('click',e=>{const pairBtn=e.target.closest('[data-m]');if(pairBtn){pairIndex=+pairBtn.dataset.m;draw();}});
  draw();
}
/* a 0 to 100 line with only 0, 50, and 100 marked, and a dot at v to estimate; shown: mark every 10 and write v at the dot */
const estLine=(v,shown,dotText=shown?v:null)=>line(0,100,{u:5,step:shown?10:50,big:shown?10:50,lab:tick=>tick%(shown?10:50)===0,pts:[{v,cls:'b',t:dotText}],label:shown?`A number line from 0 to 100 marked every 10, with a dot at ${v}`:'A number line with 0, 50, and 100, and a dot to estimate'});
/* dots to estimate (v) and the best estimate of the GUESS choices (ok) */
const EST=[{v:48,ok:50},{v:21,ok:20},{v:88,ok:90}],GUESS=[20,50,90];
/* Estimate where a dot is on a line with only 0, 50, and 100, then show the tens to check. */
function wEstimate(el){
  /* guessIndex: the estimate tapped (-1 for none); shown: the tens are shown */
  const q=Q(el);let dotIndex=0,guessIndex=-1,shown=false;
  el.innerHTML=seg('Dot',EST.map((_,i)=>[i,`Dot ${'ABC'[i]}`]))+`<div class="fig" data-f></div><div class="chips" data-c></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {v,ok}=EST[dotIndex];press(el,dotIndex);
    q('f').innerHTML=estLine(v,shown);
    q('c').innerHTML=GUESS.map((g,i)=>`<button type="button" class="chip" data-e="${i}" aria-pressed="${i===guessIndex}"${shown?' disabled':''}>about ${g}</button>`).join('');
    q('go').disabled=guessIndex<0;q('go').textContent=shown?'Try another':'Show the tens';
    q('r').innerHTML=guessIndex<0?'About what number is the dot at? Is it near 0, 50, or 100? Tap an estimate.'
      :!shown?`Your estimate: <b>about ${GUESS[guessIndex]}</b>. Now show the tens to check.`
      :`The dot is at <b>${v}</b>. You said about ${GUESS[guessIndex]}.<br>`+(GUESS[guessIndex]===ok?'<span class="ok">Great estimate!</span>':`<span class="dimline">About ${ok} is closer. An estimate doesn’t have to be exact.</span>`);
  };
  el.addEventListener('click',e=>{
    const dotBtn=e.target.closest('[data-m]');if(dotBtn){dotIndex=+dotBtn.dataset.m;guessIndex=-1;shown=false;draw();return;}
    const guessBtn=e.target.closest('[data-e]');if(guessBtn&&!shown){guessIndex=+guessBtn.dataset.e;draw();}
  });
  /* show the tens, or once shown, go on to the next dot */
  q('go').onclick=()=>{if(shown){dotIndex=(dotIndex+1)%EST.length;guessIndex=-1;shown=false;}else shown=true;draw();};
  draw();
}
/* the quick checks' figures */
const F={
  cmp:line(40,70,{pts:[{v:46,t:46},{v:64,cls:'b',t:64}],label:'A number line with dots at 46 and 64'}),
  est:estLine(73,false,'?')
};
const STEPS=[
    {title:'Compare numbers',widget:wCompare,
      body:'<p>The number farther to the <b>right</b> is <b>greater</b>. We write <b>&gt;</b> for “is greater than” and <b>&lt;</b> for “is less than”.</p><p>The open side faces the bigger number. Pick two numbers.</p>',
      check:{kind:'mc',q:'Which is true?',fig:F.cmp,
        choices:[{id:'a',label:'46 > 64'},{id:'b',label:'46 < 64'},{id:'c',label:'46 = 64'}],answer:'b',
        why:{a:'46 is to the left of 64, so 46 is less. The open side faces the bigger number.',c:'They aren’t the same number. 46 is to the left of 64.'},
        explain:'46 is to the left of 64, so 46 is less than 64: 46 < 64. 4 tens is less than 6 tens.'}},
    {title:'Estimate on a number line',widget:wEstimate,
      body:'<p>When there aren’t many tick marks, you can still <b>estimate</b>. Is the dot near 0, near 50 (the middle), or near 100?</p><p>Pick a dot and an estimate. Then show the tens to check.</p>',
      check:{kind:'mc',q:'About what number is the dot at?',fig:F.est,
        choices:[{id:'a',label:'about 25'},{id:'b',label:'about 75'},{id:'c',label:'about 95'}],answer:'b',
        why:{a:'25 is between 0 and 50. The dot is past 50.',c:'95 is very close to 100. The dot is about halfway between 50 and 100.'},
        explain:'The dot is about halfway between 50 and 100, so it’s about 75. (It’s really at 73.)'}}
  ];
