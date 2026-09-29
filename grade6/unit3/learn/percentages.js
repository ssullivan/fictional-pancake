/* Learn Unit Rates and Percentages (Grade 6 Unit 3), chapter 4: Percentages. Its widgets and steps; loaded by percentages.html. */
/* coins as a percent of a dollar */
function wCoins(el){
  const q=Q(el),st={qu:2,di:1,ni:0,pe:0};
  el.innerHTML=`<div class="wrow">${stepper('qu','Quarters')}${stepper('di','Dimes')}</div><div class="wrow">${stepper('ni','Nickels')}${stepper('pe','Pennies')}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [Qu,Di,Ni,Pe]=COIN_SET,{qu,di,ni,pe}=st,c=25*qu+10*di+5*ni+pe;
    ['qu','di','ni','pe'].forEach(k=>q(k).textContent=st[k]);
    const list=[...Array(qu).fill(Qu),...Array(di).fill(Di),...Array(ni).fill(Ni),...Array(pe).fill(Pe)];
    q('f').innerHTML=list.length?coinsFig(list)():'<p class="note">No coins yet.</p>';
    q('r').innerHTML=`${c}¢ is <b>${c}% of a dollar</b>${c>100?': more than a whole dollar':c===100?': a whole dollar':''}.<br><span class="dimline">A dollar is 100 cents, so each cent is 1% of a dollar.</span>`;
  };
  steppers(el,st,{qu:[0,4],di:[0,5],ni:[0,5],pe:[0,5]},draw);
  draw();
}

/* a percent of a whole on a tape split into tenths */
const WHOLES=[{w:80,u:'liters'},{w:40,u:'kilometers'},{w:250,u:'grams'}];
function wTape(el){
  const q=Q(el),st={t:3};let p=0;
  el.innerHTML=seg('Whole',WHOLES.map((x,i)=>[i,`${x.w} ${x.u}`]))+`<div class="wrow">${stepper('t','Tenths')}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {w,u}=WHOLES[p],{t}=st,each=w/10;press(el,p);q('t').textContent=t;
    q('f').innerHTML=pctTape(10,t,{W:w,part:each*t,each})(true);
    q('r').innerHTML=`${t*10}% is ${t} tenth${t===1?'':'s'} of the whole. Each tenth is ${w} ÷ 10 = ${fmt(each)}, so <b>${t*10}% of ${w} ${u} is ${fmt(each*t)} ${u}</b>.`;
  };
  steppers(el,st,{t:[0,10]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

/* percents on a double number line, past 100% too */
const LINES=[50,120,15];
function wLine(el){
  const q=Q(el),st={k:6};let p=0;
  el.innerHTML=seg('Whole',LINES.map((w,i)=>[i,`100% is ${w}`]))+`<div class="wrow">${stepper('k','Tens of percent')}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const w=LINES[p],{k}=st,P=10*k,x=w*k/10;press(el,p);q('k').textContent=k;
    q('f').innerHTML=pctPoint(w,P,x);
    q('r').innerHTML=`<b>${P}% of ${w} is ${fmt(x)}</b>: ${k} × 10% (${fmt(w/10)} each).`+(P>100?`<br><span class="dimline">More than 100% is more than the whole.</span>`:P===100?`<br><span class="dimline">100% is the whole.</span>`:'');
  };
  steppers(el,st,{k:[0,15]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

const STEPS=[
  {title:'Percent of a dollar',widget:wCoins,
    body:'<p><b>Percent</b> means “for each 100.” A dollar is 100 cents, so 25¢ is 25% of a dollar and 100¢ is 100%, the whole dollar.</p><p>Change the coins.</p>',
    check:{kind:'num',unit:'%',answer:85,q:'3 quarters and 1 dime are what percent of a dollar?',
      misc:[[4,'That’s the number of coins. Add their values: 75¢ + 10¢.'],[0.85,'That’s $0.85. As a percent of a dollar, 85¢ is 85%.'],[35,'That’s 1 quarter and 1 dime. There are 3 quarters: 75¢.']],
      explain:'3 quarters are 75¢ and a dime is 10¢: 85¢, which is 85% of a dollar.'}},
  {title:'Percent of a whole',widget:wTape,
    body:'<p>To find a percent of any whole, split the whole into 10 equal parts: each is 10%. Then count the parts you need.</p><p>Pick a whole and change the tenths.</p>',
    check:{kind:'num',unit:'liters',answer:20,q:'A tank holds 80 liters. How many liters is 25% of the tank?',
      misc:[[55,'That’s 80 − 25. 25% is 25 of every 100: a quarter of the tank.'],[2000,'That’s 80 × 25. 25% is 25 hundredths: 80 × 0.25.'],[8,'That’s 10% of 80. 25% is a quarter: 80 ÷ 4.']],
      explain:'25% is a quarter, and 80 ÷ 4 = 20 liters.'}},
  {title:'Percents on a double number line',widget:wLine,
    body:'<p>A double number line puts the amounts on top and the percents below, with the whole at 100%. Percents can go past 100%: 150% is one and a half of the whole.</p><p>Pick a whole and step along.</p>',
    check:{kind:'num',unit:'kilometers',answer:9,q:'Priya has hiked 60% of a 15-kilometer trail. How many kilometers is that?',
      misc:[[6,'That’s the 40% of the trail left to hike. 60% is 6 tenths of 15.'],[900,'That’s 15 × 60. 60% is 60 hundredths: 15 × 0.6.'],[1.5,'That’s 10% of 15. 60% is 6 of those.']],
      explain:'10% of 15 is 1.5, so 60% is 6 × 1.5 = 9 kilometers.'}}
];
