/* Learn Geometry, Time, and Money (Grade 2 Unit 6), chapter 5: Money problems. Its widgets and steps; loaded by money.html. */
function wDollarsCents(el){
  const q=Q(el),st={bills:2,qs:1,ds:1,ps:3};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('bills','Dollar bills')}${stepper('qs','Quarters')}${stepper('ds','Dimes')}${stepper('ps','Pennies')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const list=coinList(fromSteps(st)),t=centsOf(list),c=t%100,d=st.bills;Object.keys(st).forEach(k=>{q(k).textContent=st[k];});
    q('f').innerHTML=list.length?moneyFig(list,{vals:true}):empty('No money yet');
    q('r').innerHTML=`Dollars: <b>${d}</b>. Cents: ${c?`${countUp(list.filter(k=>k!=='B'))}, so <b>${c}</b>`:'<b>0</b>'}.<br><span class="ok"><b>${d} dollar${d===1?'':'s'} and ${c} cent${c===1?'':'s'}</b>${t?`: ${amt(t)}`:''}</span><br><span class="dimline">Count the dollars. Then count the cents.</span>`;
  };
  steppers(el,st,{bills:[0,5],qs:[0,3],ds:[0,2],ps:[0,4]},draw);
  draw();
}
const SHOP=[['sticker',15],['pencil',30],['eraser',20],['bouncy ball',45],['whistle',35]];
function wShop(el){
  const q=Q(el);let got=[];
  el.innerHTML=`<p class="story">You have <b>$1</b>. That’s 100¢. Tap things to buy them. Tap again to put them back.</p><div class="chips" data-c></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const t=got.reduce((s,i)=>s+SHOP[i][1],0);
    q('c').innerHTML=SHOP.map(([n,c],i)=>`<button type="button" class="chip" data-e="${i}" aria-pressed="${got.includes(i)}"${!got.includes(i)&&t+c>100?' disabled':''}>${n}: ${c}¢</button>`).join('');
    q('r').innerHTML=got.length?`You spent ${got.map(i=>SHOP[i][1]).join(' + ')} = <b>${t}¢</b>.<br><span class="ok">100 − ${t} = <b>${100-t}¢</b> left.</span>`+(t===100?'<br><span class="dimline">You spent the whole dollar!</span>':'')
      :'What can you buy with 100¢?';
  };
  el.addEventListener('click',e=>{const c=e.target.closest('[data-e]');if(!c||c.disabled)return;const i=+c.dataset.e;got=got.includes(i)?got.filter(j=>j!==i):[...got,i];draw();});
  draw();
}
const STEPS=[
    {title:'Dollars and cents',widget:wDollarsCents,
      body:'<p>We count <b>dollars</b> and <b>cents</b> separately. 2 dollar bills and 35¢ is 2 dollars and 35 cents. We write it <b>$2 and 35¢</b>.</p><p>Change the money and count.</p>',
      check:{kind:'mc',q:'How much money is this?',fig:moneyFig(coinList({B:2,q:1,d:1})),
        choices:[{id:'a',label:'37¢'},{id:'b',label:'$2 and 35¢'},{id:'c',label:'$4'}],answer:'b',
        why:{a:'A dollar bill is worth 100¢, not 1¢.',c:'There are 2 dollar bills. The coins are cents, not dollars.'},
        explain:'Dollars: 2. Cents: 25, 35. That’s 2 dollars and 35 cents: $2 and 35¢.'}},
    {title:'Story problems',widget:wShop,
      body:'<p>When you buy something, you spend money, so you have <b>less</b> left. To find what’s left, subtract. To find what two things cost together, add.</p>',
      check:{kind:'num',unit:'cents',answer:35,q:'Mai has 80¢. Mai buys a bouncy ball for 45¢. How much money does Mai have left?',
        misc:[[125,'That’s adding. Mai spends money, so there is less left.'],[45,'That’s the price of the ball. How much is left after paying?'],[80,'That’s what Mai had before buying the ball.']],
        explain:'80 − 45 = 35. Or count up from 45: 55, 65, 75 is 30 more, and 5 more is 80. Mai has 35¢ left.'}}
  ];
