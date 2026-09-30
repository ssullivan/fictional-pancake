/* Learn From Hundredths to Hundred-thousands (Grade 4 Unit 4), chapter 4: Ten times as much. Its widgets and steps; loaded by ten-times.html. */
/* multiply by 10 again and again: every digit moves one place to the left */
const STARTS=[3,45,207];
function wTimes(el){
  const q=Q(el),st={tm:1},lim={tm:[0,5]};let p=1;
  el.innerHTML=seg('Start with',STARTS.map((v,i)=>[i,v]))+`<div class="wrow">${stepper('tm','Times 10')}</div><div data-c></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const s=STARTS[p],k=st.tm,v=s*10**k,top=String(s).length-1,d=+String(s)[0];press(el,p);q('tm').textContent=k;
    q('c').innerHTML=pvChart(range(k+1).map(j=>[j?'× 10':'',s*10**j]),-1,{places:WIDE});
    q('e').innerHTML=k?`${commas(s)}${' × 10'.repeat(k)} = ${commas(v)}`:commas(s);
    q('r').innerHTML=!k?`Start with ${commas(s)}. Multiply by 10.`
      :`Each × 10 moves every digit one place to the left, and a 0 fills the ones place. <b>${commas(v)}</b> is ${k===1?'10':k===2?'100':k===3?'1,000':k===4?'10,000':'100,000'} times ${commas(s)}.`
        +`<br><span class="dimline">The ${d} was ${d} ${PL[top][d===1?0:1]}. Now it’s ${d} ${PL[top+k][d===1?0:1]}.</span>`;
  };
  const pick=i=>{p=i;lim.tm[1]=5-(String(STARTS[p]).length-1);st.tm=Math.min(st.tm,lim.tm[1]);};
  steppers(el,st,lim,draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){pick(+b.dataset.m);draw();}});
  pick(p);draw();
}
/* large numbers on number lines, in thousands: tap a tick to name it */
const BIG=[{name:'0 to 100,000',lo:0,hi:100,step:10,big:50},{name:'70,000 to 80,000',lo:70,hi:80,step:1,big:5},{name:'200,000 to 300,000',lo:200,hi:300,step:10,big:50}];
const kLine=(L,o={})=>numLine(L.lo,L.hi,{u:360/((L.hi-L.lo)/L.step)/L.step,pad:36,step:L.step,big:L.big,fmt:v=>commas(v*1000),...o});
function wBigLine(el){
  const q=Q(el);let p=0,k=null;
  el.innerHTML=seg('Number line',BIG.map((L,i)=>[i,L.name]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const L=BIG[p];press(el,p);
    q('f').innerHTML=kLine(L,{tap:true,pts:k===null?[]:[{v:k,t:commas(k*1000)}],label:`Number line from ${commas(L.lo*1000)} to ${commas(L.hi*1000)}, a tick every ${commas(L.step*1000)}`+(k===null?'':`, with a point at ${commas(k*1000)}`)});
    q('r').innerHTML=k===null?`The line goes from ${commas(L.lo*1000)} to ${commas(L.hi*1000)} in 10 equal jumps, so each tick is <b>${commas(L.step*1000)}</b> more. Tap a tick mark.`
      :`<b>${commas(k*1000)}</b>: ${(k-L.lo)/L.step} jump${(k-L.lo)/L.step===1?'':'s'} of ${commas(L.step*1000)} from ${commas(L.lo*1000)}.`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;k=null;draw();return;}const t=e.target.closest('[data-v]');if(t){k=+t.dataset.v;draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  line:kLine(BIG[2],{pts:[{v:240}],label:'Number line from 200,000 to 300,000 with a tick every 10,000, and a point at the fourth tick after 200,000'})
};
const STEPS=[
    {title:'Ten times as much',widget:wTimes,
      body:'<p>Each place is worth 10 times the place to its right. So when you multiply a number by 10, every digit moves one place to the left: 45 × 10 = 450, and 450 × 10 = 4,500.</p><p>Pick a number, then multiply by 10 again and again.</p>',
      check:{kind:'mc',q:'The school library has 4,500 books. The city library has 10 times as many. How many books does the city library have?',
        choices:[{id:'a',label:'4,510'},{id:'b',label:'45,000'},{id:'c',label:'450,000'}],answer:'b',
        why:{a:'You added 10. 10 times as many means multiply by 10.',c:'That’s 100 times as many: the digits moved two places. 10 times moves them one place.'},
        explain:'4,500 × 10 = 45,000. The 4 thousands become 4 ten-thousands, and the 5 hundreds become 5 thousands.'}},
    {title:'Large numbers on a number line',widget:wBigLine,
      body:'<p>To read a number line, find how much each jump is worth. From 0 to 100,000 in 10 equal jumps, each jump is 10,000. From 70,000 to 80,000 in 10 jumps, each jump is 1,000.</p><p>Pick a number line. Tap a tick to name it.</p>',
      check:{kind:'mc',q:'What number is at the dot?',fig:F.line,
        choices:[{id:'a',label:'240,000'},{id:'b',label:'204,000'},{id:'c',label:'24,000'}],answer:'a',
        why:{b:'Each jump here is 10,000, not 1,000. 4 jumps of 10,000 from 200,000 is 240,000.',c:'The line starts at 200,000, not 0. Start counting from 200,000.'},
        explain:'From 200,000 to 300,000 in 10 jumps, each jump is 10,000. The dot is 4 jumps past 200,000: 240,000.'}}
  ];
