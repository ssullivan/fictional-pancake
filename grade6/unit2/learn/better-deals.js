/* Learn Introducing Ratios (Grade 6 Unit 2), chapter 4: Better deals. Its widgets and steps; loaded by better-deals.html. */
/* two offers, [count, price], of one thing */
const DEALS=[
  {what:['pen','pens'],a:[3,6],b:[5,9]},
  {what:['muffin','muffins'],a:[4,6],b:[6,9]},
  {what:['kilogram of rice','kilograms of rice'],a:[2,5],b:[5,11]},
];
const offer=(what,[n,c])=>`${n} ${what[n===1?0:1]} for ${money(c)}`;
function wDeal(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Compare',DEALS.map((d,i)=>[i,d.what[1]]))+`<div class="fig dnl2" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {what,a,b}=DEALS[p],ua=a[1]/a[0],ub=b[1]/b[0];press(el,p);
    const line=([n,c])=>dnl(what[1],'dollars',[{t:0,b:0,st:1,sb:1},{t:1,b:c/n,st:2,sb:2},{t:n,b:c,st:1,sb:1}],{fb:money})(true);
    q('f').innerHTML=line(a)+line(b);
    const best=Math.abs(ua-ub)<1e-9?null:ua<ub?a:b;
    q('r').innerHTML=`${offer(what,a)}: <b>${money(ua)}</b> for each ${what[0]}.<br>${offer(what,b)}: <b>${money(ub)}</b> for each ${what[0]}.<br>`
      +(best?`<span class="ok">${offer(what,best)} is the better deal: each ${what[0]} costs less.</span>`:`<span class="ok">They’re the same deal: the same price for each ${what[0]}.</span>`);
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

/* two runners, [meters, seconds] */
const RACES=[
  {a:['Noah',[100,20]],b:['Priya',[150,25]]},
  {a:['Lin',[200,40]],b:['Andre',[120,24]]},
  {a:['Kiran',[90,15]],b:['Jada',[60,12]]},
];
function wRace(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Race',RACES.map(({a,b},i)=>[i,`${a[0]} and ${b[0]}`]))+`<p class="readout" data-r></p>`;
  const draw=()=>{
    const {a,b}=RACES[p],va=a[1][0]/a[1][1],vb=b[1][0]/b[1][1];press(el,p);
    const say=([name,[m,s]],v)=>`${name} runs ${m} meters in ${s} seconds: ${m} ÷ ${s} = <b>${fmt(v)} meters per second</b>.`;
    q('r').innerHTML=`${say(a,va)}<br>${say(b,vb)}<br>`+(va===vb?`<span class="ok">They run at the same speed.</span>`:`<span class="ok">${(va>vb?a:b)[0]} is faster: more meters every second.</span>`);
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

const STEPS=[
  {title:'Which is the better deal?',widget:wDeal,
    body:'<p>To compare two offers, find the price of <b>one</b> in each. The one that costs less for each is the better deal, even if its total is higher.</p><p>Pick two offers to compare.</p>',
    check:{kind:'mc',q:'Which is the better deal?',
      choices:[{id:'a',label:'4 bags of chips for $6'},{id:'b',label:'6 bags of chips for $8'},{id:'c',label:'They cost the same for each bag'}],answer:'b',
      why:{a:'It costs less in all, but you get fewer bags: $6 ÷ 4 = $1.50 a bag. 6 bags for $8 is about $1.33 a bag.',c:'Find the price of 1 bag in each: $6 ÷ 4 = $1.50 and $8 ÷ 6 ≈ $1.33.'},
      explain:'$6 ÷ 4 = $1.50 for each bag, and $8 ÷ 6 ≈ $1.33. 6 bags for $8 is the better deal.'}},
  {title:'Who is faster?',widget:wRace,
    body:'<p>To compare speeds, find the distance each goes in <b>one</b> second. More meters every second means faster.</p><p>Pick a race.</p>',
    check:{kind:'mc',q:'Lin runs 200 meters in 40 seconds. Andre runs 150 meters in 25 seconds. Who is faster?',
      choices:[{id:'l',label:'Lin'},{id:'a',label:'Andre'},{id:'s',label:'They run at the same speed'}],answer:'a',
      why:{l:'Lin runs farther, but takes longer: 200 ÷ 40 = 5 meters every second. Andre runs 6.',s:'Find the meters in 1 second for each: 200 ÷ 40 = 5 and 150 ÷ 25 = 6.'},
      explain:'Lin: 200 ÷ 40 = 5 meters per second. Andre: 150 ÷ 25 = 6 meters per second. Andre is faster.'}}
];
