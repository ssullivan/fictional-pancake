/* Learn Unit Rates and Percentages (Grade 6 Unit 3), chapter 3: Speed and pace. Its widgets and steps; loaded by speed-and-pace.html. */
/* runners: miles in minutes. Speed is miles per hour; pace is minutes per mile. */
const RUNNERS=[{name:'Mai',miles:3,min:24},{name:'Kiran',miles:2,min:20},{name:'Elena',miles:4,min:30},{name:'Noah',miles:1,min:8}];
function wPace(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Runner',RUNNERS.map((r,i)=>[i,r.name]))+`<p class="readout" data-r></p>`;
  const draw=()=>{
    const r=RUNNERS[p],pace=r.min/r.miles,mph=r.miles*60/r.min;press(el,p);
    const fastest=RUNNERS.reduce((a,b)=>b.min/b.miles<a.min/a.miles?b:a);
    const same=RUNNERS.filter(x=>x!==r&&x.min/x.miles===pace).map(x=>x.name);
    q('r').innerHTML=`${r.name} runs ${nOf(r.miles,['mile','miles'])} in ${r.min} minutes.<br>Pace: ${r.min} ÷ ${r.miles} = <b>${fmt(pace)} minutes per mile</b>.<br>Speed: ${r.miles} miles in ${r.min} minutes is <b>${fmt(mph)} miles per hour</b>.<br>`
      +(r===fastest||same.includes(fastest.name)?`<span class="ok">${r.name} is the fastest${same.length?`, tied with ${same.join(' and ')}`:''}: the smallest pace and the biggest speed.</span>`:`<span class="dimline">${fastest.name} is faster: fewer minutes for each mile.${same.length?` ${r.name} has the same pace as ${same.join(' and ')}.`:''}</span>`);
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

/* how long a trip takes at 12 km per hour, a pace of 5 minutes per kilometer */
const RIDES=[3,6,15,24];
function wHowLong(el){
  const q=Q(el);let p=0;
  el.innerHTML=`<p class="note">A bike goes 12 kilometers each hour: a pace of 60 ÷ 12 = 5 minutes for each kilometer.</p>`+seg('Ride',RIDES.map((k,i)=>[i,`${k} km`]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const k=RIDES[p];press(el,p);
    q('f').innerHTML=dnl('kilometers','minutes',[{t:0,b:0,st:1,sb:1},{t:1,b:5,st:1,sb:1},{t:k,b:5*k,st:2,sb:2}])(true);
    q('r').innerHTML=`${k} kilometers × 5 minutes for each = <b>${5*k} minutes</b>${5*k>=60?` (${Math.floor(5*k/60)} hour${5*k>=120?'s':''}${5*k%60?` ${5*k%60} minutes`:''})`:''}.`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

const STEPS=[
  {title:'Speed and pace',widget:wPace,
    body:'<p><b>Speed</b> is distance for each unit of time, like miles per hour: bigger is faster. <b>Pace</b> is time for each unit of distance, like minutes per mile: <b>smaller</b> is faster.</p><p>Pick a runner.</p>',
    check:{kind:'mc',q:'Mai runs at a pace of 8 minutes per mile. Kiran’s pace is 10 minutes per mile. Who is faster?',
      choices:[{id:'m',label:'Mai'},{id:'k',label:'Kiran'},{id:'s',label:'They are the same speed'}],answer:'m',
      why:{k:'A bigger pace means more minutes for each mile, so Kiran is slower.',s:'Their paces are different: 8 and 10 minutes for each mile.'},
      explain:'Mai takes 8 minutes for each mile and Kiran takes 10, so Mai is faster.'}},
  {title:'How long will it take?',widget:wHowLong,
    body:'<p>To find how long a trip takes, use the pace: multiply the distance by the time for each unit of distance. Or divide the distance by the speed.</p><p>Pick a ride.</p>',
    check:{kind:'num',unit:'minutes',answer:100,q:'A train goes 60 kilometers every 40 minutes. How many minutes does it take to go 150 kilometers?',
      misc:[[225,'That’s 150 × 1.5, the kilometers times the speed. Divide the distance by the speed: 150 ÷ 1.5.'],[6000,'That’s 150 × 40: 40 minutes for every kilometer. It’s 40 minutes for every 60 kilometers.'],[130,'That’s 40 + 90. Each kilometer takes 40 ÷ 60 of a minute: 150 × 2/3.']],
      explain:'The train goes 60 ÷ 40 = 1.5 kilometers each minute, so 150 kilometers takes 150 ÷ 1.5 = 100 minutes.'}}
];
