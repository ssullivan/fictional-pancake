/* Learn Extending Operations to Fractions (Grade 4 Unit 3), chapter 2: Equal groups of any fraction. Its widgets and steps; loaded by any-fraction.html. */
/* n groups of a/d: each group is a parts, every other group blue */
const GF=[[2,3],[3,4],[2,5],[3,8],[3,10]];
function wGroups(el){
  const q=Q(el),st={n:3},lim={n:[1,4]};let p=1;
  el.innerHTML=seg('Each group is',GF.map(([a,d],i)=>[i,fr(a,d)]))+`<div class="fig" data-f></div><div class="wrow">${stepper('n','Groups')}</div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,d]=GF[p],n=st.n,k=n*a;press(el,p);q('n').textContent=n;
    q('f').innerHTML=strips([{d,k,grp:a}],{wholes:Math.ceil(4*a/d),empty:true,label:`${n} group${n>1?'s':''} of ${a}/${d}: ${k} ${PART[d][1]} shaded, every other group blue`});
    q('e').innerHTML=`${n} × ${fr(a,d)} = ${fr(`${n} × ${a}`,d)} = ${frMix(k,d)}`;
    q('r').innerHTML=`${n} group${n>1?'s':''} of ${partName(d,a)} is <b>${partName(d,k)}</b>. ${vsWhole(k,d)}`
      +`<br><span class="dimline">Multiply the number of groups by the top number: ${n} × ${a} = ${k}. The parts are still ${PART[d][1]}.</span>`;
  };
  steppers(el,st,lim,draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}
/* tap the ones that make the same amount: n × m/d, where n × m is the target's top number */
const SAMEX=[{t:[6,8],ex:[[6,1],[3,2],[3,3],[2,3],[2,4]]},{t:[8,5],ex:[[8,1],[6,2],[4,2],[2,4],[4,4]]},{t:[10,12],ex:[[10,1],[4,3],[5,2],[2,5],[5,5]]}];
function wSame(el){
  const q=Q(el);let p=0,sel=null,found=[];
  el.innerHTML=seg('Make',SAMEX.map(({t},i)=>[i,fr(...t)]))+`<div class="chips" data-c></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {t:[N,d],ex}=SAMEX[p],right=ex.filter(([n,m])=>n*m===N),W=Math.ceil(Math.max(N,...ex.map(([n,m])=>n*m))/d);press(el,p);
    q('c').innerHTML=ex.map(([n,m],i)=>`<button type="button" class="chip${found.includes(i)?' found':''}" data-t="${i}" aria-pressed="${i===sel}">${n} × ${fr(m,d)}</button>`).join('');
    const rows=[{d,k:N,lab:[N,d]}];
    if(sel!==null){const [n,m]=ex[sel];rows.push({d,k:n*m,grp:m,cls:'g'});}
    q('f').innerHTML=strips(rows,{wholes:W,label:`${N}/${d}`+(sel===null?'':`, and ${ex[sel][0]} groups of ${ex[sel][1]}/${d} under it`)});
    if(sel===null){q('r').innerHTML=`Which of these make ${fr(N,d)}? Tap one to see its groups.`;return;}
    const [n,m]=ex[sel],k=n*m,all=found.length===right.length;
    q('r').innerHTML=(k===N?`<span class="ok">Yes! ${n} groups of ${partName(d,m)} is ${partName(d,k)}: <b>${n} × ${fr(m,d)} = ${fr(N,d)}</b>.</span>`
      :`<span class="no">${n} groups of ${partName(d,m)} is ${partName(d,k)}: ${n} × ${fr(m,d)} = ${fr(k,d)}, not ${fr(N,d)}.</span>`)
      +`<br><span class="dimline">`+(all?`You found all ${right.length}: ${right.map(([n,m])=>`${n} × ${m}`).join(', ')}. Each makes ${N}.`:`Found ${found.length} of ${right.length}. The number of groups times the top number must make ${N}.`)+`</span>`;
  };
  el.addEventListener('click',e=>{
    const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;sel=null;found=[];draw();return;}
    const c=e.target.closest('[data-t]');if(!c)return;
    sel=+c.dataset.t;const [n,m]=SAMEX[p].ex[sel];if(n*m===SAMEX[p].t[0]&&!found.includes(sel))found.push(sel);
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F={
  laps:strips([{d:4,k:9,grp:3}],{label:'Three groups of 3 fourths, one after another: 9 fourths shaded across 3 wholes'})
};
const STEPS=[
    {title:'Groups of any fraction',widget:wGroups,
      body:'<p>A group can be more than one part. 3 groups of '+fr(2,5)+' is 3 groups of 2 fifths: 6 fifths. So <b>3 × '+fr(2,5)+' = '+fr('3 × 2',5)+' = '+fr(6,5)+'</b>.</p><p>Pick the size of each group, then change how many groups.</p>',
      check:{kind:'mc',q:'One lap around the school track is '+fr(3,4)+' mile. Priya runs 3 laps. How far does Priya run?',fig:F.laps,
        choices:[{id:'a',label:fr(9,12)+' mile'},{id:'b',label:fr(6,4)+' miles'},{id:'c',label:fr(9,4)+' miles'}],answer:'c',
        why:{a:'You multiplied the bottom number too. Each lap is still in fourths: 3 laps of 3 fourths is 9 fourths.',b:'You added 3 to the top. 3 laps is 3 groups of 3 fourths: multiply 3 × 3.'},
        explain:'3 × '+fr(3,4)+' = '+fr('3 × 3',4)+' = '+fr(9,4)+'. That’s 2 '+fr(1,4)+' miles.'}},
    {title:'Same amount, different groups',widget:wSame,
      body:'<p>6 groups of '+fr(1,8)+', 3 groups of '+fr(2,8)+', and 2 groups of '+fr(3,8)+' all make '+fr(6,8)+'. When the number of groups times the top number is the same, the amount is the same.</p><p>Pick an amount. Tap each one that makes it.</p>',
      check:{kind:'mc',q:'Sam pours 4 glasses of juice with '+fr(3,10)+' liter in each. Which is the same amount of juice?',
        choices:[{id:'a',label:'12 × '+fr(1,10)+' liter'},{id:'b',label:'7 × '+fr(1,10)+' liter'},{id:'c',label:'12 × '+fr(3,10)+' liter'}],answer:'a',
        why:{b:'You added 4 and 3. 4 glasses of 3 tenths is 4 × 3 tenths.',c:'That’s 12 glasses of '+fr(3,10)+' liter, 3 times as much. 12 tenths is 12 groups of '+fr(1,10)+'.'},
        explain:'4 × '+fr(3,10)+' = '+fr(12,10)+', and 12 × '+fr(1,10)+' = '+fr(12,10)+' too. Both are 12 tenths of a liter.'}}
  ];
