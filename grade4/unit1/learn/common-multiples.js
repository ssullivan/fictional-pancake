/* Learn Factors and Multiples (Grade 4 Unit 1), chapter 4: Common multiples and lockers. Its widgets and steps; loaded by common-multiples.html. */
const TWO=[[3,4],[4,6],[5,10],[6,8]];
function wCommon(el){
  const q=Q(el);let p=0,on={a:true,b:false};
  el.innerHTML=seg('Numbers',TWO.map(([a,b],i)=>[i,`${a} and ${b}`]))+`<div class="chips" data-c></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=TWO[p],both=range(100).map(i=>i+1).filter(v=>v%a===0&&v%b===0);press(el,p);
    q('c').innerHTML=[['a',a],['b',b]].map(([k,v])=>`<button type="button" class="chip" data-s="${k}" aria-pressed="${on[k]}">Multiples of ${v}</button>`).join('');
    q('f').innerHTML=chart(100,v=>{const x=on.a&&v%a===0,y=on.b&&v%b===0;return x&&y?'ab':x?'a':y?'b':'';},{label:`Numbers 1 to 100, showing multiples of ${on.a?a:''}${on.a&&on.b?' and ':''}${on.b?b:''}`});
    q('r').innerHTML=on.a&&on.b?`<span class="ok">Green squares are multiples of both: <b>${list(both)}</b>.</span><br>These are <b>common multiples</b> of ${a} and ${b}. The first one is <b>${both[0]}</b>.`
      :`${on.a?`Gold is multiples of ${a}. `:''}${on.b?`Blue is multiples of ${b}. `:''}<span class="dimline">Turn on both to see the numbers that are multiples of ${a} and ${b}.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;on={a:true,b:false};draw();return;}const s=e.target.closest('[data-s]');if(s){on[s.dataset.s]=!on[s.dataset.s];draw();}});
  draw();
}
function wLockers(el){
  const q=Q(el);let s=0,sel=null,open=[];
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button><button type="button" class="ghost-btn" data-end>All the rest</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const touched=k=>range(Math.floor(20/k)).map(i=>(i+1)*k);
  const draw=()=>{
    q('f').innerHTML=lockers(open,{hi:s&&s<20?touched(s):[],sel});
    q('go').textContent=s<20?`Student ${s+1} goes`:'Everyone is done';q('go').disabled=s===20;q('end').disabled=s===20;
    let r=!s?'All 20 lockers are closed. Student 1 opens every locker. Student 2 changes every 2nd locker, student 3 every 3rd, and so on.'
      :s<20?`Student ${s} changed lockers <b>${list(touched(s))}</b>. <span class="dimline">(the multiples of ${s})</span>`
      :`<span class="ok">All 20 students are done. Open lockers: <b>${list(range(20).map(i=>i+1).filter(v=>open[v]))}</b>.</span>`;
    if(sel!==null){
      const by=factors(sel).filter(f=>f<=s);
      r+=`<br>Locker ${sel}: `+(by.length?`changed by student${by.length>1?'s':''} ${list(by)}`:'no one has changed it yet')
        +(s===20?`. That’s ${by.length} changes, the factors of ${sel}, so it ends <b>${by.length%2?'open':'closed'}</b>.`:'.');
    }else r+=`<br><span class="dimline">Tap a locker to see who changed it.</span>`;
    q('r').innerHTML=r;
  };
  const step=()=>{s++;touched(s).forEach(v=>{open[v]=!open[v];});};
  q('go').onclick=()=>{if(s<20)step();draw();};
  q('end').onclick=()=>{while(s<20)step();draw();};
  q('clr').onclick=()=>{s=0;sel=null;open=[];draw();};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(b){sel=+b.dataset.v;draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  buses:hopLine(4,24,6,{cls:'r',label:'Red bus: hops of 4 to 24'})+hopLine(6,24,4,{cls:'b',label:'Blue bus: hops of 6 to 24'}),
  lockers:lockers(Object.fromEntries([1,4,9,16].map(v=>[v,true])),{sel:16})
};
const STEPS=[
    {title:'Common multiples',widget:wCommon,
      body:'<p>A number that is a multiple of two numbers is a <b>common multiple</b>. 12 is a multiple of 3 and of 4.</p><p>Pick two numbers. Show the multiples of each, then both.</p>',
      check:{kind:'num',unit:'minutes',answer:12,fig:F.buses,q:'The red bus leaves every 4 minutes. The blue bus leaves every 6 minutes. Both buses leave at 8:00. In how many minutes do they leave together again?',
        misc:[[24,'4 × 6 = 24 is a common multiple, but not the first one. Look for a smaller one.'],[10,'You added 4 + 6. Find a number that is a multiple of 4 and of 6.'],[2,'That’s 6 − 4. Find a number that is a multiple of 4 and of 6.']],
        explain:'Red: 4, 8, 12. Blue: 6, 12. 12 is the first common multiple, so they leave together again at 8:12.'}},
    {title:'The Locker Problem',widget:wLockers,
      body:'<p>20 lockers start closed. Student 1 opens every locker. Student 2 changes every 2nd locker (open ones close, closed ones open). Student 3 changes every 3rd locker, and so on up to student 20.</p><p>Send in the students one at a time. Which lockers end up open?</p>',
      check:{kind:'mc',stack:true,q:'Why is locker 16 open at the end?',fig:F.lockers,
        choices:[{id:'a',label:'16 is even.'},{id:'b',label:'16 is a multiple of 4.'},{id:'c',label:'16 has an odd number of factors: 1, 2, 4, 8, 16.'}],answer:'c',
        why:{a:'Locker 10 is even too, and it ends closed. Count the students who change locker 16.',b:'Locker 12 is a multiple of 4 too, and it ends closed. Count the factors of 16.'},
        explain:'The students who change locker 16 are its factors: 1, 2, 4, 8, and 16. That’s 5 changes: open, closed, open, closed, open. An odd number of changes leaves it open.'}}
  ];
