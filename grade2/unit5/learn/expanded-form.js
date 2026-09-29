/* Learn Numbers to 1,000 (Grade 2 Unit 5), chapter 3: Expanded form. Its widgets and steps; loaded by expanded-form.html. */
const EXP=[342,508,760];
function wExpanded(el){
  const q=Q(el);let p=0,k=-1;
  el.innerHTML=seg('Number',EXP.map((n,i)=>[i,n]))+`<div class="chips" data-c></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const n=EXP[p],[h,t,o]=digits(n),parts=[h*100,t*10,o],dim=i=>k>=0&&k!==i?' fade':'';press(el,p);
    q('c').innerHTML=parts.map((v,i)=>v?`<button type="button" class="chip" data-e="${i}" aria-pressed="${i===k}">${v}</button>`:'').join('');
    q('f').innerHTML=htoFig(h,t,o,{cls:{h:dim(0),t:'b'+dim(1),o:'c'+dim(2)}},`${n} in base-ten blocks`);
    q('r').innerHTML=`<b>${n} = ${parts.filter(v=>v).join(' + ')}</b><br><span class="dimline">`+(k<0?'Tap each part to find its blocks.':`${parts[k]} is ${[h,t,o][k]} ${['hundreds','tens','ones'][k]}.`)+`</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;k=-1;draw();return;}const c=e.target.closest('[data-e]');if(c){k=+c.dataset.e;draw();}});
  draw();
}
function wTrade(el){
  const q=Q(el);let b=0;
  el.innerHTML=`<p class="story">342 is 3 hundreds, 4 tens, and 2 ones. Is there another way to make 342?</p><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const h=3-b,t=4+10*b;
    q('f').innerHTML=htoFig(h,t,2,{cls:{t:'b',o:'c'},tr:10*b},`${h} hundreds, ${t} tens, and 2 ones`);
    q('go').disabled=b>=2;q('clr').disabled=!b;
    q('go').textContent='Break a hundred into 10 tens';
    q('r').innerHTML=`<b>${h} hundreds, ${t} tens, 2 ones</b><br><span class="ok">${h*100} + ${t*10} + 2 = 342</span>`+(b?`<br><span class="dimline">The green tens came from a hundred. Same number, different blocks!</span>`:'');
  };
  q('go').onclick=()=>{b++;draw();};
  q('clr').onclick=()=>{b=0;draw();};
  draw();
}
const STEPS=[
    {title:'Hundreds + tens + ones',widget:wExpanded,
      body:'<p><b>Expanded form</b> shows what each digit is worth. 342 = 300 + 40 + 2.</p><p>Pick a number. Tap each part to find its blocks.</p>',
      check:{kind:'num',answer:567,q:'What number is 500 + 60 + 7?',fig:htoFig(5,6,7,{cls:{t:'b',o:'c'}},'5 hundreds, 6 tens, and 7 ones'),
        misc:[[576,'60 is 6 tens and 7 is 7 ones: 5, then 6, then 7.'],[5607,'Each part goes in its own place: 5 hundreds, 6 tens, 7 ones. That’s three digits.'],[18,'The 5 is 500 and the 6 is 60. Don’t just add the digits.']],
        explain:'5 hundreds, 6 tens, and 7 ones: 567.'}},
    {title:'Different ways',widget:wTrade,
      body:'<p>You can break a hundred into 10 tens. The blocks change, but the number stays the same.</p><p>Break a hundred and see.</p>',
      check:{kind:'mc',q:'Which one is another way to make 452?',stack:true,
        choices:[{id:'a',label:'4 hundreds, 15 tens, 2 ones'},{id:'b',label:'3 hundreds, 15 tens, 2 ones'},{id:'c',label:'4 hundreds, 2 tens, 5 ones'}],answer:'b',
        why:{a:'15 tens is 150. 400 + 150 + 2 is 552, not 452.',c:'That’s 425. The 5 tens and 2 ones got switched.'},
        explain:'Break 1 of the 4 hundreds into 10 tens: 3 hundreds, 10 + 5 = 15 tens, 2 ones. 300 + 150 + 2 = 452.'}}
  ];
