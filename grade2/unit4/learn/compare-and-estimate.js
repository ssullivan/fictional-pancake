/* Learn Addition and Subtraction on the Number Line (Grade 2 Unit 4), chapter 2: Compare and estimate. Its widgets and steps; loaded by compare-and-estimate.html. */
const PAIRS=[[38,83],[47,52],[65,56],[29,31]];
function wCompare(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Numbers',PAIRS.map(([a,b],i)=>[i,`${a} and ${b}`]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=PAIRS[p],[lo,hi]=around(a,b),big=Math.max(a,b),sm=Math.min(a,b);press(el,p);
    q('f').innerHTML=line(lo,hi,{pts:[{v:a,t:a},{v:b,cls:'b',t:b}],label:`A number line with dots at ${a} and ${b}`});
    q('r').innerHTML=`<b>${big}</b> is farther right, so ${big} is greater.<br><span class="ok"><b>${a} ${a>b?'>':'<'} ${b}</b></span><br><span class="dimline">${a>b?`${a} is greater than ${b}`:`${a} is less than ${b}`}. ${Math.floor(a/10)!==Math.floor(b/10)?`Look at the tens: ${Math.floor(big/10)} tens is more than ${Math.floor(sm/10)} tens.`:`Same tens, so look at the ones: ${big%10} ones is more than ${sm%10} ones.`}</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}
/* a 0 to 100 line with only 0, 50, and 100 marked, and a dot to estimate */
const estLine=(v,shown,t=shown?v:null)=>line(0,100,{u:5,step:shown?10:50,big:shown?10:50,lab:v=>v%(shown?10:50)===0,pts:[{v,cls:'b',t}],label:shown?`A number line from 0 to 100 marked every 10, with a dot at ${v}`:'A number line with 0, 50, and 100, and a dot to estimate'});
const EST=[{v:48,ok:50},{v:21,ok:20},{v:88,ok:90}],GUESS=[20,50,90];
function wEstimate(el){
  const q=Q(el);let p=0,e=-1,shown=false;
  el.innerHTML=seg('Dot',EST.map((_,i)=>[i,`Dot ${'ABC'[i]}`]))+`<div class="fig" data-f></div><div class="chips" data-c></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {v,ok}=EST[p];press(el,p);
    q('f').innerHTML=estLine(v,shown);
    q('c').innerHTML=GUESS.map((g,i)=>`<button type="button" class="chip" data-e="${i}" aria-pressed="${i===e}"${shown?' disabled':''}>about ${g}</button>`).join('');
    q('go').disabled=e<0;q('go').textContent=shown?'Try another':'Show the tens';
    q('r').innerHTML=e<0?'About what number is the dot at? Is it near 0, 50, or 100? Tap an estimate.'
      :!shown?`Your estimate: <b>about ${GUESS[e]}</b>. Now show the tens to check.`
      :`The dot is at <b>${v}</b>. You said about ${GUESS[e]}.<br>`+(GUESS[e]===ok?'<span class="ok">Great estimate!</span>':`<span class="dimline">About ${ok} is closer. An estimate doesn’t have to be exact.</span>`);
  };
  el.addEventListener('click',ev=>{const b=ev.target.closest('[data-m]');if(b){p=+b.dataset.m;e=-1;shown=false;draw();return;}const c=ev.target.closest('[data-e]');if(c&&!shown){e=+c.dataset.e;draw();}});
  q('go').onclick=()=>{if(shown){p=(p+1)%EST.length;e=-1;shown=false;}else shown=true;draw();};
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
