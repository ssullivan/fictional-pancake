/* Learn Extending Operations to Fractions (Grade 4 Unit 3), chapter 1: Equal groups of unit fractions. Its widgets and steps; loaded by equal-groups.html. */
/* the unit fractions 1/d to choose from */
const UD=[2,3,4,5,6,8,10,12];
/* n groups of 1/d (a stepper sets n): each group is one part, every other one blue. */
function wUnit(el){
  const q=Q(el),values={n:3},limits={n:[1,8]};let d=4;
  el.innerHTML=seg('Each group is',UD.map(v=>[v,fr(1,v)]))+`<div class="fig" data-f></div><div class="wrow">${stepper('n','Groups')}</div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const n=values.n;press(el,d);q('n').textContent=n;
    q('f').innerHTML=strips([{d,k:n,grp:1}],{wholes:2,empty:true,label:`${n} group${n>1?'s':''} of 1/${d}: ${n} ${PART[d][n>1?1:0]} shaded`});
    q('e').innerHTML=`${n} × ${fr(1,d)} = ${frMix(n,d)}`;
    q('r').innerHTML=`${n} group${n>1?'s':''} of ${fr(1,d)} is <b>${partName(d,n)}</b>. ${vsWhole(n,d)}`
      +`<br><span class="dimline">Each group is 1 ${PART[d][0]}, so the number of groups is the top number: ${n} × ${fr(1,d)} = ${fr(n,d)}.</span>`;
  };
  steppers(el,values,limits,draw);
  el.addEventListener('click',e=>{const denBtn=e.target.closest('[data-m]');if(denBtn){d=+denBtn.dataset.m;limits.n[1]=2*d;values.n=Math.min(values.n,2*d);draw();}});
  draw();
}
/* "a fifth", "an eighth" */
const aPart=d=>(PART[d][0][0]==='e'?'an ':'a ')+PART[d][0];
/* the hop sizes 1/d to choose from */
const PD=[3,4,5,6];
/* Hops of 1/d on a number line (a stepper sets how many), with the products so far: 1 × 1/5, 2 × 1/5, … */
function wPattern(el){
  const q=Q(el),values={n:2},limits={n:[1,10]};let d=5;
  el.innerHTML=seg('Hops of',PD.map(v=>[v,fr(1,v)]))+`<div class="fig" data-f></div><div class="wrow">${stepper('n','Hops')}</div><div class="chips" data-c></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const n=values.n;press(el,d);q('n').textContent=n;
    q('f').innerHTML=fracLine([{d,hops:n,pts:[{k:n}]}],{wholes:2,label:`Number line from 0 to 2 in ${PART[d][1]}, with ${n} hops of 1/${d} landing on ${n}/${d}`});
    q('c').innerHTML=range(n).map(i=>`<span class="chip${i===n-1?' cur':''}">${i+1} × ${fr(1,d)} = ${fr(i+1,d)}</span>`).join('');
    q('r').innerHTML=`<b>${n} × ${fr(1,d)} = ${fr(n,d)}</b>: ${n} hop${n>1?'s':''} of ${fr(1,d)} from 0. ${vsWhole(n,d)}`
      +`<br><span class="dimline">One more hop adds 1 to the top number. The bottom number stays ${d}: every hop is still ${aPart(d)}.</span>`;
  };
  steppers(el,values,limits,draw);
  el.addEventListener('click',e=>{const denBtn=e.target.closest('[data-m]');if(denBtn){d=+denBtn.dataset.m;limits.n[1]=2*d;values.n=Math.min(values.n,2*d);draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  path:fracLine([{d:5,hops:8,pts:[{k:8}]}],{wholes:2,label:'Number line from 0 to 2 in fifths, with 8 hops of 1/5'})
};
const STEPS=[
    {title:'Groups of a unit fraction',widget:wUnit,
      body:'<p>A <b>unit fraction</b> has 1 on top, like '+fr(1,4)+'. It’s one of the equal parts. 3 groups of '+fr(1,4)+' is 3 fourths, so we write <b>3 × '+fr(1,4)+' = '+fr(3,4)+'</b>.</p><p>Pick the size of each group, then change how many groups.</p>',
      check:{kind:'mc',q:'Kiran’s pancake recipe uses '+fr(1,4)+' cup of milk. Kiran makes the recipe 3 times. How much milk is that?',
        choices:[{id:'a',label:fr(3,12)+' cup'},{id:'b',label:fr(3,4)+' cup'},{id:'c',label:'3 '+fr(1,4)+' cups'}],answer:'b',
        why:{a:'You multiplied the bottom number too. The parts are still fourths: 3 groups of 1 fourth is 3 fourths.',c:'That’s 3 cups and '+fr(1,4)+' more. Kiran used '+fr(1,4)+' cup 3 times: 3 groups of '+fr(1,4)+'.'},
        explain:'3 groups of '+fr(1,4)+' cup is 3 fourths: 3 × '+fr(1,4)+' = '+fr(3,4)+' cup.'}},
    {title:'Patterns on the number line',widget:wPattern,
      body:'<p>Each group of '+fr(1,5)+' is a hop of '+fr(1,5)+' on the number line. 2 hops land on '+fr(2,5)+', 3 hops on '+fr(3,5)+', and so on. The number of hops is the top number.</p><p>Pick a hop size, then add hops. Look at the pattern.</p>',
      check:{kind:'mc',q:'Mai walks around a garden path that is '+fr(1,5)+' mile long, 8 times. How far does Mai walk?',fig:F.path,
        choices:[{id:'a',label:fr(8,5)+' miles'},{id:'b',label:fr(8,40)+' mile'},{id:'c',label:fr(13,5)+' miles'}],answer:'a',
        why:{b:'You multiplied the bottom number by 8 too. Each lap is still '+fr(1,5)+' mile: 8 laps is 8 fifths.',c:'You added 8 and 5. Mai walked 8 laps of '+fr(1,5)+' mile: 8 × '+fr(1,5)+'.'},
        explain:'8 × '+fr(1,5)+' = '+fr(8,5)+'. That’s 1 '+fr(3,5)+' miles: more than 1 mile, because 5 fifths make 1.'}}
  ];
