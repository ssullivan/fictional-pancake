/* Learn Numbers to 1,000 (Grade 2 Unit 5), chapter 4: The number line to 1,000. Its widgets and steps; loaded by number-line.html. */
/* a number line from lo to hi with a tick every `by`, numbered every `every` */
const line=(lo,hi,by,every,o={})=>numLine(lo,hi,{u:Math.min(40,520/(hi-lo)),step:by,big:every,ls:'',end:true,...o});
const SPOT=[350,720,480,905];
function wLocate(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Number',SPOT.map((n,i)=>[i,n]))+`<div class="fig" data-f></div><div class="fig" data-z></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const n=SPOT[p],lo=Math.floor(n/100)*100,t=Math.floor((n-lo)/10),o=(n-lo)%10;press(el,p);
    q('f').innerHTML=line(0,1000,100,100,{pts:[{v:n,t:n}],label:`A number line from 0 to 1,000 by hundreds with a dot at ${n}`});
    q('z').innerHTML=line(lo,lo+100,10,50,{pts:[{v:n,cls:'b',t:n}],label:`A number line from ${lo} to ${lo+100} by tens with a dot at ${n}`});
    q('r').innerHTML=`<b>${n}</b> is between <b>${lo}</b> and <b>${lo+100}</b>.<br><span class="dimline">Zoom in: count by tens from ${lo}${t?`: ${range(t).map(i=>lo+10*(i+1)).join(', ')}`:''}. That’s ${t} ten${t===1?'':'s'}${o?` and ${o} one${o===1?'':'s'}`:''} past ${lo}.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}
const CMPS=[[628,682],[395,410],[750,705]];
function wCompareLine(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Numbers',CMPS.map(([a,b],i)=>[i,`${a} and ${b}`]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=CMPS[p],lo=Math.floor(Math.min(a,b)/100)*100,hi=Math.ceil((Math.max(a,b)+1)/100)*100,big=Math.max(a,b);press(el,p);
    q('f').innerHTML=line(lo,hi,10,50,{pts:[{v:a,t:a},{v:b,cls:'b',t:b}],label:`A number line from ${lo} to ${hi} with dots at ${a} and ${b}`});
    q('r').innerHTML=`<b>${big}</b> is farther right, so it’s greater.<br><span class="ok"><b>${a} ${a>b?'>':'<'} ${b}</b></span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  dot470:line(400,500,10,50,{pts:[{v:470,cls:'b',t:'?'}],label:'A number line from 400 to 500 by tens with a dot'}),
  cmp:line(570,590,1,5,{pts:[{v:587,t:587},{v:578,cls:'b',t:578}],label:'A number line with dots at 578 and 587'})
};
const STEPS=[
    {title:'Find a number',widget:wLocate,
      body:'<p>On a number line to 1,000, the ticks can count by <b>hundreds</b>. To find a number, find its hundreds first. Then zoom in and count by <b>tens</b>.</p><p>Pick a number.</p>',
      check:{kind:'num',answer:470,fig:F.dot470,q:'The ticks count by tens. What number is the dot at?',
        misc:[[407,'Each space is 10 here, not 1.'],[480,'Count by tens from 400: 410, 420, 430, 440, 450, 460, 470.'],[460,'Count the spaces after 450: 460, 470.']],
        explain:'Count by tens from 400: 410, 420, … 470. Or from 450, two more tens is 470.'}},
    {title:'Compare on the number line',widget:wCompareLine,
      body:'<p>Just like with smaller numbers, the one farther <b>right</b> is <b>greater</b>.</p><p>Pick two numbers.</p>',
      check:{kind:'mc',q:'Which is true?',fig:F.cmp,
        choices:[{id:'a',label:'587 > 578'},{id:'b',label:'587 < 578'},{id:'c',label:'587 = 578'}],answer:'a',
        why:{b:'587 is to the right of 578, so 587 is greater. The open side faces the bigger number.',c:'They have the same digits, but not in the same places.'},
        explain:'587 is to the right of 578, so 587 > 578. Same hundreds, and 8 tens is more than 7 tens.'}}
  ];
