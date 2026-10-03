/* Learn Dividing Fractions (Grade 6 Unit 4), chapter 3: What fraction of a group? Its widgets and steps; loaded by fraction-of-group.html. */
/* less than one batch: k of the batch's d equal parts */
const BATCHES=[
  {name:'ice cream',of:'milk',d:9,step:frac(1),u:['cup','cups']},
  {name:'bread',of:'flour',d:6,step:frac(1),u:['cup','cups']},
  {name:'cookies',of:'butter',d:4,step:frac(1,8),u:['pound','pounds']},
];
function wLess(el){
  const q=Q(el),st={k:6},lim={k:[1,9]};let p=0;
  el.innerHTML=seg('Recipe',BATCHES.map((b,i)=>[i,b.name]))+`<div class="wrow">${stepper('k','Amount')}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const b=BATCHES[p],{k}=st,A=fMul(frac(k),b.step),B=fMul(frac(b.d),b.step),a=frac(k,b.d);press(el,p);
    q('k').innerHTML=`${fx(A)} ${unitOf(A,b.u)}`;
    q('f').innerHTML=oneGroup(b.d,k,{top:[A,unitOf(A,b.u)],whole:[B,unitOf(B,b.u)+' = 1 batch'],label:`Tape diagram: one batch of ${b.name}, ${ftx(B)} ${b.u[1]} of ${b.of}, with ${ftx(A)} shaded`});
    q('r').innerHTML=k===b.d?`<span class="ok">${fx(A)} ${unitOf(A,b.u)} is exactly <b>1 batch</b>: ${fx(A)} ÷ ${fx(B)} = 1.</span>`
      :`One batch of ${b.name} uses ${fx(B)} ${unitOf(B,b.u)} of ${b.of}. ${fx(A)} ${unitOf(A,b.u)} is ${k} of its ${b.d} equal parts: <b>${fx(a)} of a batch</b>.`
        +`<br>${fx(A)} ÷ ${fx(B)} = ${fx(a)}. Check: ${fx(a)} × ${fx(B)} = ${fx(A)}.<br><span class="dimline">“What fraction of ${fx(B)} is ${fx(A)}?” is the division ${fx(A)} ÷ ${fx(B)}, with an answer less than 1.</span>`;
  };
  steppers(el,st,lim,draw);
  onPick(el,m=>{p=+m;lim.k[1]=BATCHES[p].d;st.k=Math.min(st.k,lim.k[1]);draw();});
  draw();
}

/* how many times as much: measure one amount in groups of the other, either way round */
const PAIRS=[
  {a:'Whiskers',x:frac(8,3),b:'Piglio',y:frac(4),u:'kg',adj:'heavy'},
  {a:'the short song',x:frac(3,2),b:'the long song',y:frac(15,4),u:'minutes',adj:'long'},
  {a:'Clare’s rope',x:frac(5,2),b:'Andre’s rope',y:frac(15,2),u:'meters',adj:'long'},
];
function wTimes(el){
  const q=Q(el);let p=0,way='ab';
  el.innerHTML=`<div data-top>${seg('Compare',PAIRS.map((c,i)=>[i,`${c.a} and ${c.b}`]))}</div><div data-bot>${seg('Way',[['ab','First to second'],['ba','Second to first']])}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const c=PAIRS[p],[A,X,B,Y]=way==='ab'?[c.a,c.x,c.b,c.y]:[c.b,c.y,c.a,c.x],qt=fDiv(X,Y),cap=s=>s[0].toUpperCase()+s.slice(1);
    q('top').querySelectorAll('[data-m]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===String(p)));
    q('bot').querySelectorAll('[data-m]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===way));
    q('f').innerHTML=groupTape(X,Y,{label:`Tape diagram: ${ftx(X)} ${c.u} measured in groups of ${ftx(Y)} ${c.u}`});
    q('e').innerHTML=`<span class="q">?</span> × ${fx(Y)} = ${fx(X)}, so ${fx(X)} ÷ ${fx(Y)} = ${fx(qt)}`;
    q('r').innerHTML=`${cap(A)}: ${fx(X)} ${c.u}. ${cap(B)}: ${fx(Y)} ${c.u}. Make ${B} 1 group.<br>`
      +(fVal(qt)>1?`${cap(A)} is <b>${fx(qt)} times as ${c.adj}</b> as ${B}.`:`${cap(A)} is <b>${fx(qt)} as ${c.adj}</b> as ${B}.`)
      +`<br><span class="dimline">Switch the way round: the two answers are reciprocals, ${fx(qt)} and ${fx(fInv(qt))}.</span>`;
  };
  el.addEventListener('click',e=>{const h=segHit(e,['top','bot']);if(!h)return;if(h[0]==='top')p=+h[1];else way=h[1];draw();});
  draw();
}

const STEPS=[
  {title:'Less than one group',widget:wLess,
    body:'<p>Sometimes there isn’t enough for even one group. If a batch needs 9 cups of milk and you have 6, you can make part of a batch. “What fraction of 9 is 6?” is the division 6 ÷ 9 = '+fr(6,9)+' = '+fr(2,3)+'.</p><p>Pick a recipe and change the amount.</p>',
    check:{kind:'num',unit:'of a batch',answer:5/6,frac:true,q:'One batch of ice cream uses 9 cups of milk. On Friday, Noah used 7 '+fr(1,2)+' cups. What fraction of a batch did Noah make?',
      misc:[[1.2,'That’s 9 ÷ 7 '+fr(1,2)+'. Noah made less than one batch, so the answer is less than 1: 7 '+fr(1,2)+' ÷ 9.'],[1.5,'That’s how many cups short of a batch Noah was. Find what fraction of 9 is 7 '+fr(1,2)+'.'],[67.5,'That’s 7 '+fr(1,2)+' × 9. Divide to find what fraction of 9 cups 7 '+fr(1,2)+' cups is.']],
      explain:'7 '+fr(1,2)+' ÷ 9 = '+fr(15,2)+' × '+fr(1,9)+' = '+fr(15,18)+' = '+fr(5,6)+' of a batch. Check: '+fr(5,6)+' × 9 = 7 '+fr(1,2)+'.'}},
  {title:'How many times as much?',widget:wTimes,
    body:'<p>To compare two amounts, make one of them 1 group and ask how many groups the other is. Whiskers weighs 2 '+fr(2,3)+' kg and Piglio 4 kg: 2 '+fr(2,3)+' ÷ 4 = '+fr(2,3)+', so Whiskers is '+fr(2,3)+' as heavy as Piglio.</p><p>Pick two things and compare them both ways.</p>',
    check:{kind:'mc',stack:true,q:'Andre is walking to a festival 1 '+fr(5,8)+' km away and has walked '+fr(1,3)+' km so far. Which question does ? × 1 '+fr(5,8)+' = '+fr(1,3)+' answer?',
      choices:[{id:'a',label:'What fraction of the way has Andre walked?'},{id:'b',label:'What fraction of the way is left?'},{id:'c',label:'How many more kilometers does Andre have to walk?'},{id:'d',label:'How long is the trip there and back?'}],answer:'a',
      why:{b:'The '+fr(1,3)+' km in the equation is the part Andre has walked, not the part that’s left.',c:'That’s 1 '+fr(5,8)+' − '+fr(1,3)+', a subtraction. The equation asks what fraction of 1 '+fr(5,8)+' is '+fr(1,3)+'.',d:'That’s 2 × 1 '+fr(5,8)+'. The equation asks what fraction of the trip '+fr(1,3)+' km is.'},
      explain:'? × 1 '+fr(5,8)+' = '+fr(1,3)+' asks what fraction of the whole trip (1 '+fr(5,8)+' km) is the '+fr(1,3)+' km Andre has walked.'}}
];
