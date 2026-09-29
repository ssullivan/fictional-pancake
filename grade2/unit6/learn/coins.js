/* Learn Geometry, Time, and Money (Grade 2 Unit 6), chapter 4: Coins. Its widgets and steps; loaded by coins.html. */
function wPND(el){
  const q=Q(el),st={ds:2,ns:1,ps:3};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('ds','Dimes')}${stepper('ns','Nickels')}${stepper('ps','Pennies')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const list=coinList(fromSteps(st)),t=centsOf(list);Object.keys(st).forEach(k=>{q(k).textContent=st[k];});
    q('f').innerHTML=list.length?moneyFig(list,{vals:true}):empty('No coins yet');
    q('r').innerHTML=t?`Count by 10s, then 5s, then 1s: ${countUp(list)}.<br><span class="ok"><b>${t}¢</b></span>`+(st.ds&&st.ns?'<br><span class="dimline">A dime is smaller than a nickel, but it’s worth more!</span>':'')
      :'A dime is 10¢, a nickel is 5¢, and a penny is 1¢. Add some coins.';
  };
  steppers(el,st,{ds:[0,5],ns:[0,4],ps:[0,5]},draw);
  draw();
}
function wQuarter(el){
  const q=Q(el),st={q:2};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('q','Quarters')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const n=st.q;q('q').textContent=n;
    q('f').innerHTML=n?moneyFig(coinList({q:n}),{vals:true}):empty('No quarters yet');
    q('r').innerHTML=n===4?'Count by 25s: 25, 50, 75, 100.<br><span class="ok"><b>4 quarters is 100¢. That’s 1 dollar!</b></span>'
      :n?`Count by 25s: ${countUp(coinList({q:n}))}.<br><span class="ok"><b>${n*25}¢</b></span><br><span class="dimline">${4-n} more ${4-n>1?'quarters make':'quarter makes'} a dollar.</span>`
      :'A quarter is worth 25¢. Add some quarters.';
  };
  steppers(el,st,{q:[0,4]},draw);
  draw();
}
function wDollar(el){
  const q=Q(el);let list=[];
  el.innerHTML=`<p class="story">Make a dollar: 100¢. Add coins until you get there.</p><div class="wrow">${['q','d','n','p'].map(k=>`<button type="button" class="ghost-btn" data-add="${k}">+ ${COINS[k].name}</button>`).join('')}<button type="button" class="ghost-btn" data-clr>Start over</button></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const t=centsOf(list);
    el.querySelectorAll('[data-add]').forEach(b=>{b.disabled=t+COINS[b.dataset.add].v>100||list.length>=20;});
    const sorted=['q','d','n','p'].flatMap(k=>list.filter(c=>c===k));
    q('f').innerHTML=list.length?moneyFig(sorted):empty('No coins yet');
    q('r').innerHTML=t===100?`<span class="ok"><b>You made a dollar!</b> ${countUp(sorted)}. 100¢ = $1.</span><br><span class="dimline">Start over and find another way.</span>`
      :t?`<b>${t}¢</b> so far. <b>${100-t}¢</b> more to make a dollar.`:'Tap a coin to add it.';
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b&&!b.disabled){list.push(b.dataset.add);draw();}});
  q('clr').onclick=()=>{list=[];draw();};
  draw();
}
const STEPS=[
    {title:'Pennies, nickels, and dimes',widget:wPND,
      body:'<p>A <b>penny</b> is 1 cent (1¢). A <b>nickel</b> is 5¢. A <b>dime</b> is 10¢.</p><p>To count coins, start with the ones worth the most. Count by 10s, then 5s, then 1s.</p>',
      check:{kind:'num',unit:'cents',answer:28,fig:moneyFig(coinList({d:2,n:1,p:3})),q:'How much money is this?',
        misc:[[6,'That’s the number of coins. A dime is 10¢, a nickel is 5¢, and a penny is 1¢.'],[18,'A dime is worth 10¢. The nickel is the one worth 5¢.'],[24,'A nickel is worth 5¢, not 1¢.']],
        explain:'Count by 10s, then 5s, then 1s: 10, 20, 25, 26, 27, 28. That’s 28¢.'}},
    {title:'Quarters',widget:wQuarter,
      body:'<p>A <b>quarter</b> is 25¢. It’s the biggest coin here.</p><p>4 quarters make 100¢. That’s 1 dollar. Add quarters and count by 25s.</p>',
      check:{kind:'num',unit:'cents',answer:75,fig:moneyFig(coinList({q:3})),q:'How much money is 3 quarters?',
        misc:[[3,'That’s how many quarters. Each one is worth 25¢.'],[30,'A quarter is 25¢, not 10¢.'],[15,'A quarter is 25¢, not 5¢.'],[50,'Count all 3 quarters: 25, 50, …']],
        explain:'Count by 25s: 25, 50, 75. 3 quarters is 75¢.'}},
    {title:'Make a dollar',widget:wDollar,
      body:'<p>100¢ is the same as <b>1 dollar</b> ($1). There are lots of ways to make a dollar with coins.</p>',
      check:{kind:'num',unit:'cents',answer:30,fig:moneyFig(coinList({q:2,d:2})),q:'How much more money do you need to make a dollar?',
        misc:[[70,'That’s how much is here. How much more to get to 100¢?'],[100,'A dollar is 100¢, but some of it is here already.'],[40,'Count the coins again: 25, 50, 60, 70.']],
        explain:'25, 50, 60, 70. From 70¢, count on by 10s to 100: 80, 90, 100. That’s 30¢ more.'}}
  ];
