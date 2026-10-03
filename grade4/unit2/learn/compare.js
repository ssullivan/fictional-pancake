/* Learn Fraction Equivalence and Comparison (Grade 4 Unit 2), chapter 6: Compare and order fractions. Its widgets and steps; loaded by compare.html. */
/* one pair for each way to compare */
const WAYS=[[[5,8],[3,8]],[[2,6],[2,4]],[[3,8],[4,6]],[[5,6],[7,8]]];
/* Pick <, =, or > for a pair of fractions, then see their strips and why. */
function wWays(el){
  /* choice: the sign picked (null before one is) */
  const q=Q(el);let pairIndex=0,choice=null;
  el.innerHTML=seg('Fractions',WAYS.map(([a,b],i)=>[i,`${frA(a)} and ${frA(b)}`]))+`<div class="chips" data-c></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=WAYS[pairIndex],compared=cmpWhy(a,b);press(el,pairIndex);
    q('c').innerHTML=['<','=','>'].map(s=>`<button type="button" class="chip" data-s="${s}" aria-pressed="${s===choice}">${frA(a)} ${SYM[s]} ${frA(b)}</button>`).join('');
    q('f').hidden=!choice;q('f').innerHTML=choice?strips([{d:a[1],k:a[0],lab:a},{d:b[1],k:b[0],cls:'b',lab:b}]):'';
    q('r').innerHTML=!choice?`Which is true? Think first, then tap.`
      :(choice===compared.s?`<span class="ok">Yes!</span> `:`<span class="no">Not quite.</span> `)+`<b>${compared.how}.</b> ${compared.why}`;
  };
  el.addEventListener('click',e=>{
    const pairBtn=e.target.closest('[data-m]');if(pairBtn){pairIndex=+pairBtn.dataset.m;choice=null;draw();return;}
    const signBtn=e.target.closest('[data-s]');if(signBtn){choice=signBtn.dataset.s;draw();}
  });
  draw();
}
/* pairs with different denominators that a common denominator compares */
const CD=[[[2,3],[5,6]],[[3,4],[5,8]],[[5,6],[3,4]],[[2,5],[3,10]]];
/* Split the parts of each fraction (a stepper for each) until the denominators match, then compare. */
function wCommon(el){
  /* the steppers' values: how many pieces each part of the first (a) and second (b) is split into, and their limits */
  const q=Q(el),values={a:1,b:1},limits={a:[1,1],b:[1,1]};let pairIndex=0;
  el.innerHTML=seg('Fractions',CD.map(([a,b],i)=>[i,`${frA(a)} and ${frA(b)}`]))+`<div class="fig" data-f></div><div class="wrow" data-w></div><p class="readout" data-r></p>`;
  const draw=()=>{
    /* splitA and splitB: the two fractions as split */
    const [[na,da],[nb,db]]=CD[pairIndex],splitA=[na*values.a,da*values.a],splitB=[nb*values.b,db*values.b];press(el,pairIndex);q('a').textContent=values.a;q('b').textContent=values.b;
    q('f').innerHTML=strips([{d:splitA[1],k:splitA[0],lab:splitA},{d:splitB[1],k:splitB[0],cls:'b',lab:splitB}]);
    q('r').innerHTML=splitA[1]!==splitB[1]?`${cap(PART[splitA[1]][1])} and ${PART[splitB[1]][1]} are different sizes. Split the parts until both strips have the same parts.`
      :`<span class="ok">Both are in ${PART[splitA[1]][1]}!</span> ${splitA[0]} ${PART[splitA[1]][1]} ${sign(splitA,splitB)==='='?'is the same as':sign(splitA,splitB)==='<'?'is less than':'is more than'} ${splitB[0]}.<br><b>${frA(splitA)} ${SYM[sign(splitA,splitB)]} ${frA(splitB)}</b>, so <b>${fr(na,da)} ${SYM[sign(splitA,splitB)]} ${fr(nb,db)}</b>.`;
  };
  /* a new pair: unsplit, and steppers that split each part only as far as DEN goes */
  const choosePair=i=>{
    pairIndex=i;const [[na,da],[nb,db]]=CD[pairIndex];values.a=values.b=1;limits.a[1]=maxSplit(da);limits.b[1]=maxSplit(db);
    q('w').innerHTML=stepper('a',`Split each part of ${na}/${da} into`)+stepper('b',`Split each part of ${nb}/${db} into`);
  };
  steppers(el,values,limits,draw);
  el.addEventListener('click',e=>{const pairBtn=e.target.closest('[data-m]');if(pairBtn){choosePair(+pairBtn.dataset.m);draw();}});
  choosePair(0);draw();
}
/* sets of fractions to put in order */
const ORDER=[[[5,8],[1,3],[7,8],[1,10]],[[2,3],[1,4],[5,12],[7,8]],[[1,2],[5,6],[3,10],[1,5]]];
/* Tap fractions from least to greatest; each goes onto the number line, and a wrong tap says why. */
function wOrder(el){
  /* placed: the fractions in order so far; miss: the last wrong tap */
  const q=Q(el);let setIndex=0,placed=[],miss=null;
  el.innerHTML=seg('Set',ORDER.map((_,i)=>[i,`Set ${i+1}`]))+`<div class="chips" data-c></div><div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const set=ORDER[setIndex],left=set.filter(f=>!placed.includes(f)),least=left.reduce((min,f)=>sign(f,min)==='<'?f:min,left[0]);press(el,setIndex);
    q('c').innerHTML=set.map((f,i)=>`<button type="button" class="chip${placed.includes(f)?' found':''}" data-t="${i}"${placed.includes(f)?' disabled':''}>${frA(f)}</button>`).join('');
    q('f').innerHTML=fracLine([{d:1}],{marks:placed.map(f=>({v:f[0]/f[1],t:f})),label:'Number line from 0 to 1'+(placed.length?', with '+placed.map(([n,d])=>`${n}/${d}`).join(', '):'')});
    q('r').innerHTML=(miss?`<span class="no">${frA(miss)} isn’t the least one left.</span> ${cmpWhy(least,miss).why}<br>`:'')
      +(!left.length?`<span class="ok">In order: <b>${placed.map(frA).join(', ')}</b>.</span>`:placed.length?`Next: which is the least of the rest?`:`Tap the fractions from least to greatest.`);
  };
  el.addEventListener('click',e=>{
    const setBtn=e.target.closest('[data-m]');if(setBtn){setIndex=+setBtn.dataset.m;placed=[];miss=null;draw();return;}
    const chip=e.target.closest('[data-t]');if(!chip||chip.disabled)return;
    /* right when it's no more than any fraction left */
    const set=ORDER[setIndex],f=set[+chip.dataset.t],left=set.filter(x=>!placed.includes(x));
    if(left.every(x=>sign(f,x)!=='>')){placed.push(f);miss=null;}else miss=f;
    draw();
  });
  q('clr').onclick=()=>{placed=[];miss=null;draw();};
  draw();
}
/* the quick checks' figures */
const F={
  pitchers:strips([{d:3,k:2,lab:[2,3]},{d:12,k:7,cls:'b',lab:[7,12]}],{label:'A strip in thirds with 2 shaded, above a strip in twelfths with 7 shaded'})
};
const STEPS=[
    {title:'Ways to compare',widget:wWays,
      body:'<p>Pick a way that fits the numbers. <b>Same denominator:</b> compare the tops. <b>Same numerator:</b> the smaller parts make the smaller fraction. <b>Benchmarks:</b> is one less than '+fr(1,2)+' and the other more? Or which is closer to 1?</p><p>Pick two fractions. Which sign makes it true?</p>',
      check:{kind:'mc',q:'Mai walked '+fr(5,6)+' of a mile. Andre walked '+fr(3,4)+' of a mile. Who walked farther?',
        choices:[{id:'a',label:'Mai'},{id:'b',label:'Andre'},{id:'c',label:'They walked the same'}],answer:'a',
        why:{b:'Fourths are bigger than sixths, but Mai walked more of them. Compare how far each is from 1 mile.',c:'Each is 1 part away from 1 mile, but the parts are not the same size. '+fr(1,6)+' is less than '+fr(1,4)+'.'},
        explain:'Mai is '+fr(1,6)+' mile from 1 mile, and Andre is '+fr(1,4)+' mile from it. '+fr(1,6)+' is smaller, so Mai is closer to 1 mile: '+fr(5,6)+' > '+fr(3,4)+'.'}},
    {title:'Use a common denominator',widget:wCommon,
      body:'<p>When no shortcut fits, make the parts the same size. Write both fractions with the same denominator, a <b>common denominator</b>. Then compare the tops. To compare '+fr(2,3)+' and '+fr(5,6)+', write '+fr(2,3)+' as '+fr(4,6)+'.</p><p>Pick two fractions. Split the parts until the denominators match.</p>',
      check:{kind:'num',unit:'twelfths',answer:8,fig:F.pitchers,q:'Kai’s pitcher is '+fr(2,3)+' full. Rosa’s is '+fr(7,12)+' full. To compare, write '+fr(2,3)+' in twelfths. '+fr(2,3)+' is how many twelfths?',
        misc:[[2,fr(2,12)+' is much less than '+fr(2,3)+'. Each third is 4 twelfths.'],[4,fr(4,12)+' is 1 third. You need 2 thirds.'],[7,'7 twelfths is Rosa’s pitcher. Write Kai’s '+fr(2,3)+' in twelfths.']],
        explain:'3 × 4 = 12, so '+fr(2,3)+' = '+fr('2 × 4','3 × 4')+' = '+fr(8,12)+'. 8 twelfths is more than 7 twelfths, so Kai’s pitcher has more.'}},
    {title:'Put them in order',widget:wOrder,
      body:'<p>To put fractions in order, find the least one, then the least of the rest, and so on. Use any way to compare that works. A number line helps you check.</p><p>Pick a set. Tap the fractions from least to greatest.</p>',
      check:{kind:'mc',stack:true,q:'Friends drank water from bottles the same size: '+fr(1,2)+', '+fr(3,4)+', '+fr(1,8)+', and '+fr(1,3)+' of a bottle. Which list goes from least to greatest?',
        choices:[{id:'a',label:fr(1,2)+', '+fr(1,3)+', '+fr(1,8)+', '+fr(3,4)},{id:'b',label:fr(3,4)+', '+fr(1,2)+', '+fr(1,3)+', '+fr(1,8)},{id:'c',label:fr(1,8)+', '+fr(1,3)+', '+fr(1,2)+', '+fr(3,4)}],answer:'c',
        why:{a:'With the same numerator, the bigger denominator makes the smaller fraction. '+fr(1,8)+' is less than '+fr(1,3)+', and '+fr(1,3)+' is less than '+fr(1,2)+'.',b:'That goes from greatest to least. Turn it around.'},
        explain:fr(1,8)+' < '+fr(1,3)+' < '+fr(1,2)+', because eighths are smaller than thirds, and thirds smaller than halves. '+fr(3,4)+' is more than '+fr(1,2)+', so it’s last.'}}
  ];
