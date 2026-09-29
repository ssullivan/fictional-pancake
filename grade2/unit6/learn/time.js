/* Learn Geometry, Time, and Money (Grade 2 Unit 6), chapter 3: Tell time. Its widgets and steps; loaded by time.html. */
const QTR=[['0',"o’clock"],['15','Quarter past'],['30','Half past'],['45','Quarter till']];
function wQuarters(el){
  const q=Q(el),st={h:3};let m=15;
  el.innerHTML=seg('Minutes',QTR)+`<div class="fig" data-f></div><div class="wrow">${stepper('h','Hour')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const h=st.h,nx=h%12+1;press(el,m);q('h').textContent=h;
    q('f').innerHTML=clockFig(h,m,{shade:m?[m===45?45:0,m===45?60:m]:null});
    const say={0:`${h} o’clock`,15:`quarter past ${h}`,30:`half past ${h}`,45:`quarter till ${nx}`}[m];
    q('r').innerHTML=`<span class="ok"><b>${hm(h,m)}</b> is <b>${say}</b>.</span><br><span class="dimline">`+{
      0:`The long minute hand points straight up to 12. The short hour hand points to ${h}.`,
      15:`The minute hand went a quarter of the way around: 15 minutes past ${h}.`,
      30:`The minute hand went halfway around: 30 minutes. The hour hand is halfway between ${h} and ${nx}.`,
      45:`The minute hand went three quarters of the way around: 45 minutes. One more quarter and it’s ${nx} o’clock.`}[m]+'</span>';
  };
  steppers(el,st,{h:[1,12]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){m=+b.dataset.m;draw();}});
  draw();
}
function wFives(el){
  const q=Q(el),st={h:2,mn:7};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('h','Hour')}${stepper('mn','Minutes')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {h,mn:f}=st,m=f*5;q('h').textContent=h;q('mn').textContent=m;
    q('f').innerHTML=clockFig(h,m,{fives:true});
    q('r').innerHTML=(f?`The minute hand points to the <b>${f}</b>. Count by 5s: ${range(Math.min(f,4)).map(i=>5*(i+1)).join(', ')}${f>4?`, … <b>${m}</b>`:''} minutes.`
      :'The minute hand points to 12: <b>0 minutes</b>, so it’s o’clock.')
      +`<br>The hour hand ${f?`is past ${h}`:`points to ${h}`}, so the hour is <b>${h}</b>.<br><span class="ok"><b>${hm(h,m)}</b></span>`;
  };
  steppers(el,st,{h:[1,12],mn:[0,11]},draw);
  draw();
}
const DAY=[['Wake up',7,0,1],['School starts',8,30,1],['Lunch',11,45,1],['Soccer practice',4,15,0],['Dinner',6,0,0],['Bedtime',8,0,0],['Sound asleep',2,0,1]];
function wAmPm(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Time of day',DAY.map(([t],i)=>[i,t]))+`<div class="fig" data-f></div><div class="fig" data-d></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [what,h,m,am]=DAY[p],at=(am?h%12:h%12+12)+m/60;press(el,p);
    q('f').innerHTML=clockFig(h,m,{r:90});
    q('d').innerHTML=dayBar(at,`A bar for the whole day, from midnight to noon (a.m.) and noon to midnight (p.m.), with an arrow at ${what.toLowerCase()}`);
    q('r').innerHTML=`${what}: <b>${hm(h,m)} ${am?'a.m.':'p.m.'}</b><br><span class="dimline">`+(am?'<b>a.m.</b> is from midnight to noon: night and morning.':'<b>p.m.</b> is from noon to midnight: afternoon, evening, and night.')+` The clock looks the same at ${hm(h,m)} a.m. and ${hm(h,m)} p.m.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}
const STEPS=[
    {title:'Half past and quarter past',widget:wQuarters,
      body:'<p>The <b>short hand</b> shows the hour. The <b>long hand</b> shows the minutes.</p><p>When the long hand goes halfway around, it’s <b>half past</b>. A quarter of the way around is <b>quarter past</b>. Three quarters around is <b>quarter till</b> the next hour.</p>',
      check:{kind:'mc',q:'What time is it?',fig:clockFig(8,30,{shade:[0,30],r:90}),
        choices:[{id:'a',label:'Half past 9'},{id:'b',label:'Half past 8'},{id:'c',label:'Quarter past 8'}],answer:'b',
        why:{a:'The hour hand is between 8 and 9. It hasn’t gotten to 9 yet.',c:'A quarter is 15 minutes. The shaded part is half the clock.'},
        explain:'The long hand went halfway around: 30 minutes. The short hand is past 8. Half past 8 is 8:30.'}},
    {title:'Count by 5',widget:wFives,
      body:'<p>The minute hand moves 5 minutes from one number to the next. To tell the minutes, <b>count by 5s</b>.</p><p>Change the hour and the minutes.</p>',
      check:{kind:'mc',q:'What time does the clock show?',fig:clockFig(2,40,{r:90}),
        choices:[{id:'a',label:'2:40'},{id:'b',label:'8:10'},{id:'c',label:'2:08'}],answer:'a',
        why:{b:'The short hand shows the hour. The long hand shows the minutes.',c:'The long hand points to the 8. Count by 5s: 8 fives is 40 minutes.'},
        explain:'The short hand is between 2 and 3, so the hour is 2. The long hand points to 8: 5, 10, 15, 20, 25, 30, 35, 40. It’s 2:40.'}},
    {title:'a.m. or p.m.?',widget:wAmPm,
      body:'<p>A clock goes around twice every day. <b>a.m.</b> times are from midnight to noon. <b>p.m.</b> times are from noon to midnight.</p><p>Pick a time of day.</p>',
      check:{kind:'mc',q:'Which time makes sense for eating dinner?',
        choices:[{id:'a',label:'6:00 a.m.'},{id:'b',label:'11:00 p.m.'},{id:'c',label:'6:00 p.m.'}],answer:'c',
        why:{a:'6:00 a.m. is early in the morning, before breakfast.',b:'11:00 p.m. is late at night, when most people are asleep.'},
        explain:'Dinner is in the evening, after noon. 6:00 p.m. makes sense.'}}
  ];
