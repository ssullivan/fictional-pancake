/* Learn Fraction Equivalence and Comparison (Grade 4 Unit 2), chapter 1: Parts of a whole. Its widgets and steps; loaded by parts.html. */
/* Shade parts of one whole cut into d equal parts; a stepper sets how many are shaded. */
function wParts(el){
  /* the stepper's value: sh shaded parts, at most d */
  const q=Q(el),values={sh:3},limits={sh:[0,8]};let d=8;
  el.innerHTML=seg('Equal parts',DEN.map(v=>[v,PART[v][1]]))+`<div class="fig" data-f></div><div class="wrow">${stepper('sh','Shaded parts')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const shaded=values.sh;press(el,d);q('sh').textContent=shaded;
    q('f').innerHTML=strips([{d,k:shaded}]);
    q('r').innerHTML=`1 whole is cut into <b>${d}</b> equal parts, so each part is ${fr(1,d)}.<br>`
      +(shaded?`${shaded} ${shaded===1?'part is':'parts are'} shaded: <b>${fr(shaded,d)}</b>, or ${partName(d,shaded)}.`+(shaded===d?` <span class="ok">All ${d} parts: ${fr(d,d)} is 1 whole.</span>`:'')
        :`No parts are shaded yet: ${fr(0,d)}.`)
      +`<br><span class="dimline">The bottom number says how many equal parts make 1 whole. The top number counts the parts.</span>`;
  };
  steppers(el,values,limits,draw);
  el.addEventListener('click',e=>{const denBtn=e.target.closest('[data-m]');if(denBtn){d=+denBtn.dataset.m;limits.sh[1]=d;values.sh=Math.min(values.sh,d);draw();}});
  draw();
}
/* the denominators to choose from when shading past 1 */
const WD=[2,3,4,6];
/* Keep shading past 1 whole, up to 3 wholes. */
function wWholes(el){
  const q=Q(el),values={sh:5},limits={sh:[0,12]};let d=4;
  el.innerHTML=seg('Equal parts',WD.map(v=>[v,PART[v][1]]))+`<div class="fig" data-f></div><div class="wrow">${stepper('sh','Shaded parts')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const shaded=values.sh,wholes=Math.floor(shaded/d),rest=shaded%d;press(el,d);q('sh').textContent=shaded;
    q('f').innerHTML=strips([{d,k:shaded}],{wholes:3,stack:true});
    q('r').innerHTML=`<b>${fr(shaded,d)}</b>: ${partName(d,shaded)}. `+(shaded<d?`That’s less than 1 whole.`
      :shaded===d?`<span class="ok">That’s exactly 1 whole.</span>`
      :`<span class="ok">That’s more than 1: ${wholes} whole${wholes>1?'s':''}${rest?` and ${fr(rest,d)} more`:''}.</span>`)
      +`<br><span class="dimline">Every ${d} ${PART[d][1]} make 1 whole.</span>`;
  };
  steppers(el,values,limits,draw);
  el.addEventListener('click',e=>{const denBtn=e.target.closest('[data-m]');if(denBtn){d=+denBtn.dataset.m;limits.sh[1]=3*d;values.sh=Math.min(values.sh,3*d);draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  bar:strips([{d:6,k:5,parts:false}],{label:'A strip cut into 6 equal parts, with 5 shaded'}),
  sandwiches:strips([{d:3,k:5,parts:false}],{label:'Two strips, each cut into 3 equal parts: all 3 shaded in the first, 2 in the second'})
};
const STEPS=[
    {title:'Equal parts',widget:wParts,
      body:'<p>A fraction counts equal parts of 1 whole. In '+fr(3,8)+', the bottom number, the <b>denominator</b>, says the whole is cut into 8 equal parts. The top number, the <b>numerator</b>, says we have 3 of them.</p><p>Pick how many parts to cut the strip into, then shade some.</p>',
      check:{kind:'mc',q:'A granola bar is cut into equal pieces. Diego ate the shaded pieces. What fraction of the bar did Diego eat?',fig:F.bar,
        choices:[{id:'a',label:fr(1,6)},{id:'b',label:fr(5,6)},{id:'c',label:fr(6,5)}],answer:'b',
        why:{a:'That’s the piece that is left, the one not shaded. Diego ate the shaded pieces.',c:'The top and bottom are switched. The bottom number is how many equal pieces make the bar: 6. The top counts what Diego ate: 5.'},
        explain:'The bar is cut into 6 equal pieces, so each is '+fr(1,6)+'. Diego ate 5 of them: '+fr(5,6)+' of the bar.'}},
    {title:'More than 1 whole',widget:wWholes,
      body:'<p>When the parts fill 1 whole, keep going into the next whole. 4 fourths make 1 whole, so '+fr(5,4)+' is 1 whole and '+fr(1,4)+' more.</p><p>Shade more parts than one whole has.</p>',
      check:{kind:'mc',q:'Each strip is a sandwich cut into 3 equal pieces. The class ate the shaded pieces. How many sandwiches did the class eat?',fig:F.sandwiches,
        choices:[{id:'a',label:fr(5,6)},{id:'b',label:fr(3,5)},{id:'c',label:fr(5,3)}],answer:'c',
        why:{a:'Each sandwich is cut into 3 pieces, so the pieces are thirds, not sixths. Count the shaded thirds.',b:'The top and bottom are switched. Each piece is '+fr(1,3)+' of a sandwich, and the class ate 5 of them.'},
        explain:'Each piece is '+fr(1,3)+' of a sandwich. 5 pieces is '+fr(5,3)+': 1 whole sandwich and '+fr(2,3)+' more.'}}
  ];
