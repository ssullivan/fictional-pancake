/* Learn Fraction Equivalence and Comparison (Grade 4 Unit 2), chapter 2: Sizes of parts. Its widgets and steps; loaded by sizes.html. */
/* pairs with the same denominator or the same numerator */
const SAME=[[[3,8],[5,8]],[[2,3],[2,5]],[[4,6],[4,12]],[[3,4],[3,10]]];
/* Two fractions with the same denominator or the same numerator, as strips, and how they compare. */
function wSame(el){
  const q=Q(el);let pairIndex=0;
  el.innerHTML=seg('Fractions',SAME.map(([a,b],i)=>[i,`${frA(a)} and ${frA(b)}`]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=SAME[pairIndex],compared=cmpWhy(a,b);press(el,pairIndex);
    q('f').innerHTML=strips([{d:a[1],k:a[0],lab:a},{d:b[1],k:b[0],cls:'b',lab:b}]);
    q('r').innerHTML=`<b>${compared.how}.</b> ${compared.why}`;
  };
  el.addEventListener('click',e=>{const pairBtn=e.target.closest('[data-m]');if(pairBtn){pairIndex=+pairBtn.dataset.m;draw();}});
  draw();
}
/* families of denominators, each twice the one before */
const FAM=[[2,4,8],[3,6,12],[5,10]];
/* Split every part in 2, again and again: twice as many parts, each half as big. */
function wSplit(el){
  /* splits: how many times the parts have been split */
  const q=Q(el);let familyIndex=0,splits=0;
  el.innerHTML=seg('Start with',FAM.map((family,j)=>[j,family.map(d=>PART[d][1]).join(', ')]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Split each part in 2</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    /* first: the family's first denominator; d: the one now */
    const family=FAM[familyIndex],first=family[0],d=family[splits];press(el,familyIndex);q('go').disabled=splits===family.length-1;
    q('f').innerHTML=strips(family.slice(0,splits+1).map((den,j)=>({d:den,k:den/first,cls:['','b','g'][j]})),{label:family.slice(0,splits+1).map(den=>`A strip in ${PART[den][1]}, with ${partName(den,den/first)} shaded`).join('. ')});
    q('r').innerHTML=!splits?`1 whole cut into ${first} equal parts: <b>${PART[first][1]}</b>. One part is ${fr(1,first)}.<br><span class="dimline">Split each part in 2.</span>`
      :`Each ${PART[family[splits-1]][0]} split in 2 makes <b>${PART[d][1]}</b>: twice as many parts, each half as big.<br><span class="ok">${partName(d,d/first)} make ${partName(first,1)}: ${fr(d/first,d)} = ${fr(1,first)}.</span>`
        +(splits===family.length-1?'':`<br><span class="dimline">Split again.</span>`);
  };
  q('go').onclick=()=>{if(splits<FAM[familyIndex].length-1)splits++;draw();};
  q('clr').onclick=()=>{splits=0;draw();};
  el.addEventListener('click',e=>{const familyBtn=e.target.closest('[data-m]');if(familyBtn){familyIndex=+familyBtn.dataset.m;splits=0;draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  cornbread:strips([{d:6,k:0},{d:12,k:0,cls:'b'}],{label:'A strip in sixths above a strip in twelfths'})
};
const STEPS=[
    {title:'Same denominator or same numerator',widget:wSame,
      body:'<p>When the <b>denominators</b> are the same, the parts are the same size, so more parts is more. When the <b>numerators</b> are the same, you have the same number of parts, so look at their size: the more parts a whole is cut into, the smaller each part.</p><p>Pick two fractions to compare.</p>',
      check:{kind:'mc',q:'Two pizzas are the same size. Noor ate '+fr(3,5)+' of one. Sam ate '+fr(3,8)+' of the other. Who ate more pizza?',
        choices:[{id:'a',label:'Noor'},{id:'b',label:'Sam'},{id:'c',label:'They ate the same'}],answer:'a',
        why:{b:'8 is more than 5, but eighths are smaller pieces than fifths. 3 small pieces are less than 3 bigger ones.',c:'They each ate 3 pieces, but the pieces are not the same size. Fifths are bigger than eighths.'},
        explain:'Both ate 3 pieces. A pizza cut into 5 has bigger pieces than one cut into 8, so '+fr(3,5)+' > '+fr(3,8)+'. Noor ate more.'}},
    {title:'Split the parts',widget:wSplit,
      body:'<p>Fold a strip in half and you get halves. Fold again and every half becomes 2 fourths. Each time you split every part in 2, there are twice as many parts, and each one is half as big.</p><p>Pick a strip and split its parts.</p>',
      check:{kind:'num',unit:'twelfths',answer:2,fig:F.cornbread,q:'A pan of cornbread is cut into 6 equal pieces. Then every piece is cut in half, into twelfths. How many twelfths are the same as 1 sixth of the pan?',
        misc:[[6,'6 is how many sixths make the whole pan. Cutting 1 sixth in half makes how many pieces?'],[12,'12 twelfths make the whole pan. Just 1 sixth was cut in half.']],
        explain:'Cutting 1 sixth in half makes 2 twelfths. So '+fr(2,12)+' = '+fr(1,6)+'.'}}
  ];
