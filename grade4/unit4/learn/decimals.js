/* Learn From Hundredths to Hundred-thousands (Grade 4 Unit 4), chapter 1: Decimals. Its widgets and steps; loaded by decimals.html. */
/* a hundred grid with k squares shaded */
const grid=(k,cls='a',label)=>hundredGrid(cellsOf([k,cls]),{label:label||`A hundred grid with ${k} of 100 squares shaded: ${dS(k)}`});
/* Tenths and hundredths on a hundred grid (a stepper for each), written as a fraction and a decimal. */
function wDec(el){
  const q=Q(el),values={t:4,h:7},limits={t:[0,9],h:[0,9]};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('t','Tenths')}${stepper('h','Hundredths')}</div><div data-c></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const {t:tenths,h:hundredths}=values,k=10*tenths+hundredths;q('t').textContent=tenths;q('h').textContent=hundredths;
    q('f').innerHTML=hundredGrid(cellsOf([10*tenths,'a'],[hundredths,'b']),{label:`A hundred grid with ${tenths} columns and ${hundredths} more squares shaded: ${k} of 100`});
    q('c').innerHTML=pvChart([['',k/100]],-1,{places:[0,-1,-2]});
    q('e').innerHTML=`${fr(k,100)} = ${(k/100).toFixed(2)}`;
    q('r').innerHTML=`${tenths} ${PART[10][tenths===1?0:1]} and ${hundredths} ${PART[100][hundredths===1?0:1]} is <b>${k} ${PART[100][k===1?0:1]}</b>: ${(k/100).toFixed(2)}, said “${numWords(k)} ${PART[100][k===1?0:1]}.”`
      +`<br><span class="dimline">The first digit after the decimal point counts tenths. The next one counts hundredths.</span>`;
  };
  steppers(el,values,limits,draw);
  draw();
}
/* a target t in hundredths, and ways to write numbers [as written, in hundredths] to test against it */
const SAMES=[{t:50,ex:[['0.50',50],['0.05',5],[fr(5,10),50],[fr(50,100),50],[fr(5,100),5]]},{t:30,ex:[['0.03',3],['0.30',30],[fr(3,100),3],[fr(3,10),30],[fr(30,100),30]]},{t:80,ex:[[fr(80,100),80],['0.08',8],['0.80',80],[fr(8,10),80],['0.18',18]]}];
/* Tap each one that is the same amount as the target, to see it on a grid beside the target's. */
function wSame(el){
  /* picked: the one tapped last; found: the right ones tapped so far */
  const q=Q(el);let targetIndex=0,picked=null,found=[];
  el.innerHTML=seg('Same as',SAMES.map(({t},i)=>[i,dS(t)]))+`<div class="chips" data-c></div><div class="fig picrow" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {t:target,ex}=SAMES[targetIndex],right=ex.filter(([,v])=>v===target).length;press(el,targetIndex);
    q('c').innerHTML=ex.map(([written],i)=>`<button type="button" class="chip${found.includes(i)?' found':''}" data-t="${i}" aria-pressed="${i===picked}">${written}</button>`).join('');
    q('f').innerHTML=grid(target)+(picked===null?'':grid(ex[picked][1],'b'));
    if(picked===null){q('r').innerHTML=`Which of these are the same amount as ${dS(target)}? Tap one to see it on a grid.`;return;}
    const [written,v]=ex[picked];
    q('r').innerHTML=(v===target?`<span class="ok">Yes! ${written} is ${v} hundredths, and ${dS(target)} is ${target} hundredths too.</span>`
      :`<span class="no">${written} is ${v} hundredths, but ${dS(target)} is ${target} hundredths.</span>`)
      +`<br><span class="dimline">`+(found.length===right?`You found all ${right}. A 0 at the end of a decimal doesn’t change it: ${dS(target)} = ${(target/100).toFixed(2)}.`:`Found ${found.length} of ${right}.`)+`</span>`;
  };
  el.addEventListener('click',e=>{
    const targetBtn=e.target.closest('[data-m]');if(targetBtn){targetIndex=+targetBtn.dataset.m;picked=null;found=[];draw();return;}
    const chip=e.target.closest('[data-t]');if(!chip)return;
    picked=+chip.dataset.t;if(SAMES[targetIndex].ex[picked][1]===SAMES[targetIndex].t&&!found.includes(picked))found.push(picked);
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F={
  coins:moneyFig(['d','d','d','p','p','p','p','p'],{label:'3 dimes and 5 pennies'})
};
const STEPS=[
    {title:'Tenths and hundredths as decimals',widget:wDec,
      body:'<p>A <b>decimal</b> is another way to write tenths and hundredths. '+fr(47,100)+' is 4 tenths and 7 hundredths, so it’s written <b>0.47</b>. The 4 is in the tenths place and the 7 in the hundredths place.</p><p>Change the tenths and hundredths.</p>',
      check:{kind:'mc',q:'A dime is '+fr(1,10)+' of a dollar, and a penny is '+fr(1,100)+' of a dollar. How much money is this, in dollars?',fig:F.coins,
        choices:[{id:'a',label:'$0.35'},{id:'b',label:'$3.5'},{id:'c',label:'$0.53'}],answer:'a',
        why:{b:'$3.5 is 3 whole dollars and 5 tenths. Dimes are tenths of a dollar, so the 3 goes right after the decimal point.',c:'The digits are switched. The 3 dimes are tenths, the first place after the point. The 5 pennies are hundredths.'},
        explain:'3 dimes is 3 tenths and 5 pennies is 5 hundredths: 35 hundredths of a dollar, or $0.35.'}},
    {title:'Equivalent decimals',widget:wSame,
      body:'<p>5 tenths is the same as 50 hundredths, so <b>0.5 = 0.50</b>. These are <b>equivalent decimals</b>. A 0 at the end after the point doesn’t change the amount, but a 0 right after the point does: 0.05 is just 5 hundredths.</p><p>Pick an amount. Tap each one that’s the same.</p>',
      check:{kind:'mc',q:'A bottle holds 0.7 liter of water. Which is the same amount?',
        choices:[{id:'a',label:'0.07 liter'},{id:'b',label:fr(7,100)+' liter'},{id:'c',label:'0.70 liter'}],answer:'c',
        why:{a:'0.07 is 7 hundredths. 0.7 is 7 tenths, which is 70 hundredths.',b:fr(7,100)+' is 7 hundredths. 0.7 is 7 tenths, which is '+fr(70,100)+'.'},
        explain:'0.7 is 7 tenths, and 7 tenths is 70 hundredths: 0.7 = 0.70.'}}
  ];
