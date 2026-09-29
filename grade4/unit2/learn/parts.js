/* Learn Fraction Equivalence and Comparison (Grade 4 Unit 2), chapter 1: Parts of a whole. Its widgets and steps; loaded by parts.html. */
/* shade parts of one whole */
function wParts(el){
  const q=Q(el),st={sh:3},lim={sh:[0,8]};let d=8;
  el.innerHTML=seg('Equal parts',DEN.map(v=>[v,PART[v][1]]))+`<div class="fig" data-f></div><div class="wrow">${stepper('sh','Shaded parts')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const k=st.sh;press(el,d);q('sh').textContent=k;
    q('f').innerHTML=strips([{d,k}]);
    q('r').innerHTML=`1 whole is cut into <b>${d}</b> equal parts, so each part is ${fr(1,d)}.<br>`
      +(k?`${k} ${k===1?'part is':'parts are'} shaded: <b>${fr(k,d)}</b>, or ${partName(d,k)}.`+(k===d?` <span class="ok">All ${d} parts: ${fr(d,d)} is 1 whole.</span>`:'')
        :`No parts are shaded yet: ${fr(0,d)}.`)
      +`<br><span class="dimline">The bottom number says how many equal parts make 1 whole. The top number counts the parts.</span>`;
  };
  steppers(el,st,lim,draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){d=+b.dataset.m;lim.sh[1]=d;st.sh=Math.min(st.sh,d);draw();}});
  draw();
}
/* keep shading past 1 whole */
const WD=[2,3,4,6];
function wWholes(el){
  const q=Q(el),st={sh:5},lim={sh:[0,12]};let d=4;
  el.innerHTML=seg('Equal parts',WD.map(v=>[v,PART[v][1]]))+`<div class="fig" data-f></div><div class="wrow">${stepper('sh','Shaded parts')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const k=st.sh,W=Math.floor(k/d),r=k%d;press(el,d);q('sh').textContent=k;
    q('f').innerHTML=strips([{d,k}],{wholes:3,stack:true});
    q('r').innerHTML=`<b>${fr(k,d)}</b>: ${partName(d,k)}. `+(k<d?`That’s less than 1 whole.`
      :k===d?`<span class="ok">That’s exactly 1 whole.</span>`
      :`<span class="ok">That’s more than 1: ${W} whole${W>1?'s':''}${r?` and ${fr(r,d)} more`:''}.</span>`)
      +`<br><span class="dimline">Every ${d} ${PART[d][1]} make 1 whole.</span>`;
  };
  steppers(el,st,lim,draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){d=+b.dataset.m;lim.sh[1]=3*d;st.sh=Math.min(st.sh,3*d);draw();}});
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
