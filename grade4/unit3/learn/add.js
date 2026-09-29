/* Learn Extending Operations to Fractions (Grade 4 Unit 3), chapter 3: Add fractions. Its widgets and steps; loaded by add.html. */
/* break a fraction into two parts: the first g parts gold, the rest blue */
const WHOLE=[[5,6],[7,8],[4,5],[6,10]];
function wSplit(el){
  const q=Q(el),st={g:2},lim={g:[1,4]};let p=0;
  el.innerHTML=seg('Fraction',WHOLE.map(([n,d],i)=>[i,fr(n,d)]))+`<div class="fig" data-f></div><div class="wrow">${stepper('g','Gold parts')}</div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const [n,d]=WHOLE[p],g=st.g;press(el,p);q('g').textContent=g;
    q('f').innerHTML=strips([{d,k:n,grp:[g,n-g],lab:[n,d]}],{label:`${n}/${d}: ${g} ${PART[d][g>1?1:0]} gold and ${n-g} blue`});
    q('e').innerHTML=`${fr(n,d)} = ${fr(g,d)} + ${fr(n-g,d)}`;
    q('r').innerHTML=`${partName(d,g)} and ${partName(d,n-g)} make ${partName(d,n)}: ${g} + ${n-g} = ${n}.`
      +`<br><span class="dimline">In unit fractions: ${fr(n,d)} = ${range(n).map(()=>fr(1,d)).join(' + ')}</span>`;
  };
  steppers(el,st,lim,draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;lim.g[1]=WHOLE[p][0]-1;st.g=Math.min(st.g,lim.g[1]);draw();}});
  draw();
}
/* a/d + b/d: gold jumps, then blue jumps, on a number line to 2 */
const AD=[3,4,5,6,8,10];
function wAdd(el){
  const q=Q(el),st={a:3,b:2},lim={a:[1,5],b:[1,5]};let d=5;
  el.innerHTML=seg('Parts',AD.map(v=>[v,PART[v][1]]))+`<div class="fig" data-f></div><div class="wrow">${stepper('a','First')}${stepper('b','Add')}</div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const {a,b}=st,s=a+b;press(el,d);q('a').textContent=a;q('b').textContent=b;
    q('f').innerHTML=fracLine([{d,hops:[[0,a],[a,s,'q']],pts:[{k:s}]}],{wholes:2,label:`Number line from 0 to 2 in ${PART[d][1]}: ${a} gold hops, then ${b} blue hops, landing on ${s}/${d}`});
    q('e').innerHTML=`${fr(a,d)} + ${fr(b,d)} = ${frMix(s,d)}`;
    q('r').innerHTML=`${partName(d,a)} and ${partName(d,b)} more is <b>${partName(d,s)}</b>. ${vsWhole(s,d)}`
      +`<br><span class="dimline">Add the top numbers: ${a} + ${b} = ${s}. The bottom number stays ${d}: the parts are still ${PART[d][1]}.</span>`;
  };
  steppers(el,st,lim,draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){d=+b.dataset.m;lim.a[1]=lim.b[1]=d;st.a=Math.min(st.a,d);st.b=Math.min(st.b,d);draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  walk:fracLine([{d:8,hops:[[0,3],[3,7,'q']],pts:[{k:7}]}],{label:'Number line from 0 to 1 in eighths: 3 gold hops, then 4 blue hops'})
};
const STEPS=[
    {title:'Break a fraction into parts',widget:wSplit,
      body:'<p>Any fraction can be broken into smaller fractions with the same denominator. '+fr(5,6)+' is 2 sixths and 3 sixths, so '+fr(5,6)+' = '+fr(2,6)+' + '+fr(3,6)+'. It’s also 5 unit fractions: '+fr(1,6)+' + '+fr(1,6)+' + '+fr(1,6)+' + '+fr(1,6)+' + '+fr(1,6)+'.</p><p>Pick a fraction, then change how many parts are gold.</p>',
      check:{kind:'mc',q:'Jada’s walk to the library is '+fr(7,10)+' mile. Jada stops at a park on the way. Which could be the distances before and after the park?',
        choices:[{id:'a',label:fr(3,5)+' mile and '+fr(4,5)+' mile'},{id:'b',label:fr(3,10)+' mile and '+fr(4,10)+' mile'},{id:'c',label:fr(2,10)+' mile and '+fr(4,10)+' mile'}],answer:'b',
        why:{a:'Those are fifths, not tenths. 3 fifths and 4 fifths make '+fr(7,5)+', more than a mile.',c:'2 tenths and 4 tenths make '+fr(6,10)+'. The walk is 7 tenths.'},
        explain:'3 tenths and 4 tenths make 7 tenths: '+fr(3,10)+' + '+fr(4,10)+' = '+fr(7,10)+'.'}},
    {title:'Add on a number line',widget:wAdd,
      body:'<p>To add '+fr(3,5)+' + '+fr(2,5)+', start with 3 jumps of '+fr(1,5)+' and jump 2 more. You land on '+fr(5,5)+', which is 1. The parts are all fifths, so only the top numbers are added.</p><p>Pick the parts, then change the two fractions.</p>',
      check:{kind:'mc',q:'Andre rode '+fr(3,8)+' mile to school and then '+fr(4,8)+' mile to the pool. How far did Andre ride?',fig:F.walk,
        choices:[{id:'a',label:fr(7,16)+' mile'},{id:'b',label:fr(1,8)+' mile'},{id:'c',label:fr(7,8)+' mile'}],answer:'c',
        why:{a:'You added the bottom numbers too. The parts are still eighths: 3 eighths and 4 eighths.',b:'That’s how much farther the second ride was. Add to find how far in all.'},
        explain:fr(3,8)+' + '+fr(4,8)+' = '+fr('3 + 4',8)+' = '+fr(7,8)+' mile.'}}
  ];
