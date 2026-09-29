/* Learn Fraction Equivalence and Comparison (Grade 4 Unit 2), chapter 4: Equivalent fractions. Its widgets and steps; loaded by equivalent.html. */
/* shade a second strip to match the first */
const TOP=[[1,2],[2,3],[3,4]];
function wMatch(el){
  const q=Q(el),st={sh:0},lim={sh:[0,8]};let t=2,d=8;
  el.innerHTML=`<div data-top>${seg('Match',TOP.map((f,i)=>[i,frA(f)]))}</div><div class="fig" data-f></div><div data-bot>${seg('Equal parts',DEN.map(v=>[v,PART[v][1]]))}</div><div class="wrow">${stepper('sh','Shaded parts')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=TOP[t],k=st.sh,s=sign([k,d],[a,b]),lo=Math.floor(a*d/b);press(q('top'),t);press(q('bot'),d);q('sh').textContent=k;
    q('f').innerHTML=strips([{d:b,k:a,lab:[a,b]},{d,k,cls:'b',lab:[k,d]}]);
    q('r').innerHTML=s==='='?`<span class="ok">Same amount! <b>${fr(k,d)} = ${fr(a,b)}</b>. They are <b>equivalent</b> fractions.</span>`
      :`${fr(k,d)} is ${s==='<'?'less':'more'} than ${fr(a,b)}. Shade ${s==='<'?'more':'fewer'} ${PART[d][1]}.`
        +(a*d%b?`<br><span class="dimline">${cap(PART[d][1])} can’t make exactly ${fr(a,b)}: ${partName(d,lo)} ${lo===1?'is':'are'} too little and ${partName(d,lo+1)} too much.</span>`:'');
  };
  steppers(el,st,lim,draw);
  el.addEventListener('click',e=>{const h=segHit(e,['top','bot']);if(!h)return;if(h[0]==='top')t=+h[1];else{d=+h[1];lim.sh[1]=d;st.sh=Math.min(st.sh,d);}draw();});
  draw();
}
/* two number lines: tap a tick, see what lines up with it */
const LINES=[[4,8],[3,6],[3,12],[5,10]];
function wLines(el){
  const q=Q(el);let p=0,sel=null;
  el.innerHTML=seg('Number lines',LINES.map(([a,b],i)=>[i,`${PART[a][1]} and ${PART[b][1]}`]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [d1,d2]=LINES[p],D=[d1,d2];press(el,p);
    /* the selected point in the other line's parts, when a tick is there */
    const at=r=>sel&&sel.k*D[r]%D[sel.r]===0?sel.k*D[r]/D[sel.r]:null,on=r=>at(r)===null?[]:[{k:at(r),cls:r?'b':''}];
    q('f').innerHTML=fracLine([{d:d1,tap:true,labs:true,pts:on(0)},{d:d2,tap:true,labs:true,pts:on(1)}],{marks:sel?[{v:sel.k/D[sel.r],t:''}]:[],label:`Number lines from 0 to 1 in ${PART[d1][1]} and in ${PART[d2][1]}`});
    if(!sel){q('r').innerHTML='Tap a tick mark on either line.';return;}
    const o=1-sel.r,ko=at(o),me=[sel.k,D[sel.r]],lo=Math.floor(sel.k*D[o]/D[sel.r]);
    q('r').innerHTML=ko===null?`${frA(me)} is between ${fr(lo,D[o])} and ${fr(lo+1,D[o])}. No tick for ${PART[D[o]][1]} lands on it.`
      :`<span class="ok"><b>${frA(me)} = ${fr(ko,D[o])}</b>: they are at the same point, so they are equivalent.</span><br><span class="dimline">Each ${PART[d1][0]} is ${partName(d2,d2/d1)}.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;sel=null;draw();return;}const t=e.target.closest('[data-v]');if(t){sel={r:+t.dataset.r,k:+t.dataset.v};draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  trail:strips([{d:4,k:3},{d:8,k:0,cls:'b'}],{label:'A strip in fourths with 3 shaded, above a strip in eighths'}),
  lines:fracLine([{d:3,pts:[{k:2}]},{d:6}],{label:'A number line in thirds with a point at 2 thirds, above a number line in sixths'})
};
const STEPS=[
    {title:'Same amount, different parts',widget:wMatch,
      body:'<p>Fractions that are the same amount are <b>equivalent</b>, even though their numbers are different. '+fr(1,2)+' of a strip is the same as '+fr(2,4)+' of it.</p><p>Pick a fraction to match. Then cut the blue strip into parts and shade the same amount.</p>',
      check:{kind:'num',unit:'eighths',answer:6,fig:F.trail,q:'Jada has hiked '+fr(3,4)+' of a trail. The trail map is marked in eighths. How many eighths of the trail has Jada hiked?',
        misc:[[7,'You added 4 to the top and the bottom. Adding changes the amount. Each fourth is 2 eighths.'],[3,fr(3,8)+' is less than '+fr(3,4)+': an eighth is half of a fourth.'],[4,fr(4,8)+' is '+fr(1,2)+'. '+fr(3,4)+' is more than half.']],
        explain:'Each fourth is 2 eighths, so 3 fourths is 6 eighths: '+fr(3,4)+' = '+fr(6,8)+'.'}},
    {title:'Same point on the number line',widget:wLines,
      body:'<p>Equivalent fractions sit at the same point on a number line. On a line in fourths and a line in eighths, '+fr(1,4)+' and '+fr(2,8)+' line up.</p><p>Pick two number lines and tap tick marks. Which ones line up?</p>',
      check:{kind:'mc',q:'Which fraction is at the same point as '+fr(2,3)+'?',fig:F.lines,
        choices:[{id:'a',label:fr(3,4)},{id:'b',label:fr(2,6)},{id:'c',label:fr(4,6)}],answer:'c',
        why:{a:'Adding 1 to the top and the bottom changes the amount. Look at the line in sixths under the dot.',b:'Sixths are smaller than thirds, so 2 sixths is less than 2 thirds. Each third is 2 sixths.'},
        explain:'Each third is 2 sixths, so 2 thirds is 4 sixths. '+fr(2,3)+' and '+fr(4,6)+' are at the same point.'}}
  ];
