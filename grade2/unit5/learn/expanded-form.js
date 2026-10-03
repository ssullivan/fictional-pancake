/* Learn Numbers to 1,000 (Grade 2 Unit 5), chapter 3: Expanded form. Its widgets and steps; loaded by expanded-form.html. */
const EXP=[342,508,760];
/* A number in expanded form: tap a part to light up its blocks (the others fade). */
function wExpanded(el){
  /* partIndex: the part tapped (0 hundreds, 1 tens, 2 ones; −1 for none) */
  const q=Q(el);let numberIndex=0,partIndex=-1;
  el.innerHTML=seg('Number',EXP.map((n,i)=>[i,n]))+`<div class="chips" data-c></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    /* fade(i): the class that fades place i's blocks when another part is tapped */
    const n=EXP[numberIndex],[hundreds,tens,ones]=digits(n),parts=[hundreds*100,tens*10,ones],fade=i=>partIndex>=0&&partIndex!==i?' fade':'';press(el,numberIndex);
    q('c').innerHTML=parts.map((v,i)=>v?`<button type="button" class="chip" data-e="${i}" aria-pressed="${i===partIndex}">${v}</button>`:'').join('');
    q('f').innerHTML=htoFig(hundreds,tens,ones,{cls:{h:fade(0),t:'b'+fade(1),o:'c'+fade(2)}},`${n} in base-ten blocks`);
    q('r').innerHTML=`<b>${n} = ${parts.filter(v=>v).join(' + ')}</b><br><span class="dimline">`+(partIndex<0?'Tap each part to find its blocks.':`${parts[partIndex]} is ${[hundreds,tens,ones][partIndex]} ${['hundreds','tens','ones'][partIndex]}.`)+`</span>`;
  };
  el.addEventListener('click',e=>{
    const numberBtn=e.target.closest('[data-m]');if(numberBtn){numberIndex=+numberBtn.dataset.m;partIndex=-1;draw();return;}
    const partBtn=e.target.closest('[data-e]');if(partBtn){partIndex=+partBtn.dataset.e;draw();}
  });
  draw();
}
/* Another way to make 342: break a hundred into 10 tens (up to twice). */
function wTrade(el){
  /* broken: how many hundreds are broken into tens */
  const q=Q(el);let broken=0;
  el.innerHTML=`<p class="story">342 is 3 hundreds, 4 tens, and 2 ones. Is there another way to make 342?</p><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const hundreds=3-broken,tens=4+10*broken;
    q('f').innerHTML=htoFig(hundreds,tens,2,{cls:{t:'b',o:'c'},tr:10*broken},`${hundreds} hundreds, ${tens} tens, and 2 ones`);
    q('go').disabled=broken>=2;q('clr').disabled=!broken;
    q('go').textContent='Break a hundred into 10 tens';
    q('r').innerHTML=`<b>${hundreds} hundred${hundreds===1?'':'s'}, ${tens} tens, 2 ones</b><br><span class="ok">${hundreds*100} + ${tens*10} + 2 = 342</span>`+(broken?`<br><span class="dimline">The green tens came from a hundred. Same number, different blocks!</span>`:'');
  };
  q('go').onclick=()=>{broken++;draw();};
  q('clr').onclick=()=>{broken=0;draw();};
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
