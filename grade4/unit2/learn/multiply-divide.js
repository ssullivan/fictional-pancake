/* Learn Fraction Equivalence and Comparison (Grade 4 Unit 2), chapter 5: Multiply or divide to find equivalent fractions. Its widgets and steps; loaded by multiply-divide.html. */
/* the fractions to split */
const TIMES=[[1,2],[2,3],[3,4],[2,5],[5,6]];
/* Split every part into n (a stepper): that multiplies the top and bottom by n. */
function wTimes(el){
  const q=Q(el),values={n:2},limits={n:[1,6]};let fracIndex=2;
  el.innerHTML=seg('Fraction',TIMES.map((f,i)=>[i,frA(f)]))+`<div class="fig" data-f></div><div class="wrow">${stepper('n','Split each part into')}</div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=TIMES[fracIndex],n=values.n;press(el,fracIndex);q('n').textContent=n;
    q('f').innerHTML=strips([{d:b,k:a,lab:[a,b]},{d:b*n,k:a*n,cls:'b',lab:[a*n,b*n]}]);
    q('e').innerHTML=`${fr(a,b)} = ${fr(`${a} × ${n}`,`${b} × ${n}`)} = ${fr(a*n,b*n)}`;
    q('r').innerHTML=n===1?'Not split yet. Tap + to split every part.'
      :`Every part is split into ${n}, so there are ${n} times as many parts (${b} × ${n} = ${b*n}), and ${n} times as many are shaded (${a} × ${n} = ${a*n}).<br><span class="ok">Same amount: <b>${fr(a,b)} = ${fr(a*n,b*n)}</b>.</span>`;
  };
  /* a new fraction: the stepper splits only as far as DEN goes */
  const chooseFraction=i=>{fracIndex=i;limits.n[1]=maxSplit(TIMES[fracIndex][1]);values.n=Math.min(values.n,limits.n[1]);};
  steppers(el,values,limits,draw);
  el.addEventListener('click',e=>{const fracBtn=e.target.closest('[data-m]');if(fracBtn){chooseFraction(+fracBtn.dataset.m);draw();}});
  chooseFraction(fracIndex);draw();
}
/* the fractions to group, and the group sizes to try */
const GROUP=[[6,12],[8,10],[9,12],[4,8]],GS=[2,3,4,6];
/* Put the parts in equal groups: a group size that works for the top and bottom divides both. */
function wGroup(el){
  /* groupSize: the size picked (null before one is) */
  const q=Q(el);let fracIndex=0,groupSize=null;
  el.innerHTML=`<div data-top>${seg('Fraction',GROUP.map((f,i)=>[i,frA(f)]))}</div><div class="fig" data-f></div><div data-bot>${seg('Groups of',GS.map(v=>[v,`Groups of ${v}`]))}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=GROUP[fracIndex],g=groupSize,works=g&&b%g===0&&a%g===0;press(q('top'),fracIndex);press(q('bot'),g);
    q('f').innerHTML=strips([{d:b,k:a,lab:[a,b]}].concat(works?[{d:b/g,k:a/g,cls:'g',lab:[a/g,b/g]}]:[]));
    q('r').innerHTML=!g?`Put the parts in equal groups. Which group sizes work for both ${a} and ${b}?`
      :b%g?`<span class="no">${b} parts don’t make equal groups of ${g}.</span> ${g} is not a factor of ${b}.`
      :a%g?`<span class="no">The ${b} parts make groups of ${g}, but the ${a} shaded parts don’t.</span> ${g} is not a factor of ${a}.`
      :`${b} parts make ${b/g} groups of ${g}, and the ${a} shaded parts make ${a/g} groups.<br><span class="ok">${fr(a,b)} = ${fr(`${a} ÷ ${g}`,`${b} ÷ ${g}`)} = <b>${fr(a/g,b/g)}</b></span>`;
  };
  el.addEventListener('click',e=>{const [row,id]=segHit(e,['top','bot'])||[];if(!row)return;if(row==='top'){fracIndex=+id;groupSize=null;}else groupSize=+id;draw();});
  draw();
}
const STEPS=[
    {title:'Split every part',widget:wTimes,
      body:'<p>Split every part of a strip into 2 and you get twice as many parts, with twice as many shaded. The amount stays the same. So multiplying the top and bottom by the same number makes an equivalent fraction: '+fr(3,4)+' = '+fr(6,8)+'.</p><p>Pick a fraction, then split its parts.</p>',
      check:{kind:'num',unit:'tenths',answer:4,q:'A recipe needs '+fr(2,5)+' cup of oats. Kiran’s measuring cup is marked in tenths. How many tenths of a cup should Kiran use?',
        misc:[[7,'You added 5 to the top and the bottom. Adding changes the amount. Multiply both by 2: 5 × 2 = 10.'],[2,fr(2,10)+' is less than '+fr(2,5)+'. Each fifth is 2 tenths.']],
        explain:'5 × 2 = 10, so multiply the top by 2 too: '+fr(2,5)+' = '+fr('2 × 2','5 × 2')+' = '+fr(4,10)+'. Kiran should use 4 tenths.'}},
    {title:'Group the parts',widget:wGroup,
      body:'<p>You can also go the other way. Put the parts in equal groups: '+fr(6,12)+' in groups of 3 is 2 groups out of 4, or '+fr(2,4)+'. Dividing the top and bottom by the same number makes an equivalent fraction. The number has to be a factor of both.</p><p>Pick a fraction, then try group sizes.</p>',
      check:{kind:'mc',q:'Ana’s class painted '+fr(9,12)+' of a mural. Which fraction is the same amount?',
        choices:[{id:'a',label:fr(5,8)},{id:'b',label:fr(3,4)},{id:'c',label:fr(9,6)}],answer:'b',
        why:{a:'You took 4 away from the top and the bottom. Subtracting changes the amount. Divide both by the same number instead.',c:'You divided only the bottom by 2. Divide the top and the bottom by the same number.'},
        explain:'3 is a factor of 9 and 12. '+fr(9,12)+' = '+fr('9 ÷ 3','12 ÷ 3')+' = '+fr(3,4)+'.'}}
  ];
