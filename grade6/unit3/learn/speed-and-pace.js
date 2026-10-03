/* Learn Unit Rates and Percentages (Grade 6 Unit 3), chapter 3: Speed and pace. Its widgets and steps; loaded by speed-and-pace.html. */
/* runners: miles in minutes. Speed is miles per hour; pace is minutes per mile. */
const RUNNERS=[{name:'Mai',miles:3,min:24},{name:'Kiran',miles:2,min:20},{name:'Elena',miles:4,min:30},{name:'Noah',miles:1,min:8}];
/* A runner's pace and speed, and who is fastest (the smallest pace). */
function wPace(el){
  const q=Q(el);let runnerIndex=0;
  el.innerHTML=seg('Runner',RUNNERS.map((runner,i)=>[i,runner.name]))+`<p class="readout" data-r></p>`;
  const draw=()=>{
    const runner=RUNNERS[runnerIndex],pace=runner.min/runner.miles,mph=runner.miles*60/runner.min;press(el,runnerIndex);
    /* fastest: the smallest pace; same: the other runners with this one's pace */
    const fastest=RUNNERS.reduce((best,other)=>other.min/other.miles<best.min/best.miles?other:best);
    const same=RUNNERS.filter(other=>other!==runner&&other.min/other.miles===pace).map(other=>other.name);
    q('r').innerHTML=`${runner.name} runs ${nOf(runner.miles,['mile','miles'])} in ${runner.min} minutes.<br>Pace: ${runner.min} ÷ ${runner.miles} = <b>${fmt(pace)} minutes per mile</b>.<br>Speed: ${runner.miles} miles in ${runner.min} minutes is <b>${fmt(mph)} miles per hour</b>.<br>`
      +(runner===fastest||same.includes(fastest.name)?`<span class="ok">${runner.name} is the fastest${same.length?`, tied with ${same.join(' and ')}`:''}: the smallest pace and the biggest speed.</span>`:`<span class="dimline">${fastest.name} is faster: fewer minutes for each mile.${same.length?` ${runner.name} has the same pace as ${same.join(' and ')}.`:''}</span>`);
  };
  el.addEventListener('click',e=>{const runnerBtn=e.target.closest('[data-m]');if(runnerBtn){runnerIndex=+runnerBtn.dataset.m;draw();}});
  draw();
}

/* ride lengths in kilometers */
const RIDES=[3,6,15,24];
/* How long a ride takes at 12 km per hour, a pace of 5 minutes per kilometer. */
function wHowLong(el){
  const q=Q(el);let rideIndex=0;
  el.innerHTML=`<p class="note">A bike goes 12 kilometers each hour: a pace of 60 ÷ 12 = 5 minutes for each kilometer.</p>`+seg('Ride',RIDES.map((km,i)=>[i,`${km} km`]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const km=RIDES[rideIndex];press(el,rideIndex);
    q('f').innerHTML=dnl('kilometers','minutes',[{t:0,b:0,st:1,sb:1},{t:1,b:5,st:1,sb:1},{t:km,b:5*km,st:2,sb:2}])(true);
    q('r').innerHTML=`${km} kilometers × 5 minutes for each = <b>${5*km} minutes</b>${5*km>=60?` (${Math.floor(5*km/60)} hour${5*km>=120?'s':''}${5*km%60?` ${5*km%60} minutes`:''})`:''}.`;
  };
  el.addEventListener('click',e=>{const rideBtn=e.target.closest('[data-m]');if(rideBtn){rideIndex=+rideBtn.dataset.m;draw();}});
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
