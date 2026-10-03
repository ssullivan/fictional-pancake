/* Learn Dividing Fractions (Grade 6 Unit 4), chapter 5: Dividing fractions. Its widgets and steps; loaded by algorithm.html. */
/* dividing by a whole number is multiplying by a unit fraction */
const WHOLE_N=[2,3,4,6];
function wWhole(el){
  const q=Q(el);let n=3;
  el.innerHTML=seg('Divide 12 by',WHOLE_N.map(v=>[v,String(v)]))+`<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    press(el,n);
    q('f').innerHTML=groupTape(frac(12),frac(n),{label:`Tape diagram: 12 in groups of ${n}`});
    q('e').innerHTML=`12 ÷ ${n} = ${12/n} and 12 × ${fr(1,n)} = ${fr(12,n)} = ${12/n}`;
    q('r').innerHTML=`How many ${n}s are in 12? <b>${12/n}</b>. And ${fr(1,n)} of 12, which is 12 groups of ${fr(1,n)}, is also <b>${12/n}</b>.<br><span class="dimline">Dividing by ${n} gives the same as multiplying by ${fr(1,n)}. ${n} and ${fr(1,n)} are <b>reciprocals</b>: their product is 1.</span>`;
  };
  onPick(el,m=>{n=+m;draw();});
  draw();
}

/* dividing by a unit fraction: each whole holds b of them */
const UNIT_B=[2,3,4,5,6,8];
function wUnitFrac(el){
  const q=Q(el),st={a:3};let b=4;
  el.innerHTML=seg('Divide by',UNIT_B.map(v=>[v,fr(1,v)]))+`<div class="wrow">${stepper('a','Wholes')}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const {a}=st;press(el,b);q('a').textContent=a;
    q('f').innerHTML=groupTape(frac(a),frac(1,b),{label:`Tape diagram: ${a} wholes cut into ${PART[b][1]}`});
    q('e').innerHTML=`${a} ÷ ${fr(1,b)} = ${a} × ${b} = ${a*b}`;
    q('r').innerHTML=`Each whole holds ${b} ${PART[b][1]}, so ${a} whole${a>1?'s hold':' holds'} ${a} × ${b} = <b>${a*b} ${PART[b][1]}</b>.<br><span class="dimline">Dividing by ${fr(1,b)} is the same as multiplying by ${b}.</span>`;
  };
  steppers(el,st,{a:[1,6]},draw);
  onPick(el,m=>{b=+m;draw();});
  draw();
}

/* dividing by a non-unit fraction: cut into parts (× the bottom), then make groups (÷ the top) */
const NONUNIT=[frac(2,3),frac(3,2),frac(2,5),frac(4,3),frac(5,6)];
function wNonUnit(el){
  const q=Q(el);let p=0,k=0;
  el.innerHTML=seg('Divide 6 by',NONUNIT.map((b,i)=>[i,fx(b)]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Cut into parts</button><button type="button" class="btn" data-gr>Make groups</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><div data-w></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const b=NONUNIT[p],[c,d]=b,qt=fDiv(frac(6),b);press(el,p);
    q('f').innerHTML=groupTape(frac(6),b,{upto:k>1?Infinity:0,parts:k>0,label:`Tape diagram: 6 wholes${k?` cut into ${PART[d][1]}`:''}${k>1?`, in groups of ${ftx(b)}`:''}`});
    q('go').disabled=k>0;q('gr').disabled=k!==1;
    q('w').innerHTML=workLines([`Cut each whole into ${PART[d][1]}: 6 × ${d} = ${6*d} ${PART[d][1]}.`,`A group of ${fx(b)} is ${partName(d,c)}: ${6*d} ÷ ${c} = ${fx(qt)} groups.`],k);
    q('r').innerHTML=k<2?`How many groups of ${fx(b)} are in 6?`
      :`<span class="ok">6 ÷ ${fx(b)} = 6 × ${d} ÷ ${c} = <b>${fx(qt)}</b>.</span><br><span class="dimline">Multiply by the bottom number (to count the parts), then divide by the top number (to put them in groups). That’s multiplying by ${fim(fInv(b))}.</span>`;
  };
  q('go').onclick=()=>{k=1;draw();};
  q('gr').onclick=()=>{k=2;draw();};
  q('clr').onclick=()=>{k=0;draw();};
  onPick(el,m=>{p=+m;k=0;draw();});
  draw();
}

/* the algorithm, a line at a time: fractions, the reciprocal, multiply, and check */
const ALGO=[[frac(8,9),frac(4)],[frac(3,4),frac(1,2)],[frac(10,3),frac(2,9)],[frac(9,2),frac(3,8)],[frac(32,5),frac(3)]];
function wAlgo(el){
  const q=Q(el);let p=0,k=1;
  el.innerHTML=seg('Divide',ALGO.map(([a,b],i)=>[i,`${fx(a)} ÷ ${fx(b)}`]))+`<div class="wrow"><button type="button" class="btn" data-go>Next step</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><div data-w></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=ALGO[p],r=fInv(b),qt=fDiv(a,b),isMixed=a[1]>1&&a[0]>a[1];press(el,p);
    const lines=[
      isMixed||b[1]===1?`Write each number as a fraction: ${fx(a)} ÷ ${fx(b)} = ${fr(a[0],a[1])} ÷ ${fr(b[0],b[1])}.`:`Both numbers are fractions: ${fr(a[0],a[1])} ÷ ${fr(b[0],b[1])}.`,
      `Dividing by ${fr(b[0],b[1])} is multiplying by its reciprocal, ${fr(r[0],r[1])}: ${fr(a[0],a[1])} × ${fr(r[0],r[1])}.`,
      `Multiply the tops and the bottoms: ${fr(a[0]*r[0],a[1]*r[1])} = <b>${fx(qt)}</b>.`,
      `Check by multiplying back: ${fx(qt)} × ${fx(b)} = ${fx(a)}.`];
    q('w').innerHTML=workLines(lines,k);
    q('go').disabled=k>=lines.length;
    q('r').innerHTML=k<lines.length?'Press Next step to keep going.'
      :`<span class="ok">${fx(a)} ÷ ${fx(b)} = ${fx(qt)}.</span><br><span class="dimline">Why the reciprocal: dividing by ${fr(b[0],b[1])} means multiplying by ${b[1]} and dividing by ${b[0]}, and that’s × ${fr(r[0],r[1])}.</span>`;
  };
  q('go').onclick=()=>{k++;draw();};
  q('clr').onclick=()=>{k=1;draw();};
  onPick(el,m=>{p=+m;k=1;draw();});
  draw();
}

/* another way: write both with the same denominator, then divide the numerators */
const SAME=[[frac(3,4),frac(1,8)],[frac(2,3),frac(1,6)],[frac(3,2),frac(3,8)],[frac(9,10),frac(3,5)],[frac(1,2),frac(1,3)]];
function wSame(el){
  const q=Q(el);let p=0,same=false;
  el.innerHTML=seg('Divide',SAME.map(([a,b],i)=>[i,`${fx(a)} ÷ ${fx(b)}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Same-size pieces</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=SAME[p],D=lcm(a[1],b[1]),A=a[0]*D/a[1],B=b[0]*D/b[1],qt=fDiv(a,b),W=Math.ceil(Math.max(fVal(a),fVal(b)));press(el,p);
    const rows=same?[{d:D,k:A,lab:[A,D]},{d:D,k:B,cls:'b',lab:[B,D]}]:[{d:a[1],k:a[0],lab:a},{d:b[1],k:b[0],cls:'b',lab:b}];
    q('f').innerHTML=strips(rows,{wholes:W,empty:true,label:`Fraction strips: ${same?`${A}/${D} and ${B}/${D}`:`${a[0]}/${a[1]} and ${b[0]}/${b[1]}`}`});
    q('go').disabled=same;
    q('e').innerHTML=same?`${fr(A,D)} ÷ ${fr(B,D)} = ${A} ÷ ${B} = ${fx(qt)}`:`${fx(a)} ÷ ${fx(b)} = <span class="q">?</span>`;
    q('r').innerHTML=!same?`The pieces are different sizes, so they’re hard to compare. Cut both into the same size pieces.`
      :`${fx(a)} is ${partName(D,A)} and ${fx(b)} is ${partName(D,B)}. How many groups of ${partName(D,B)} are in ${partName(D,A)}? <b>${A} ÷ ${B} = ${fx(qt)}</b>.<br><span class="dimline">With the same denominator, just divide the numerators. The answer matches multiplying by the reciprocal: ${fim(a)} × ${fim(fInv(b))} = ${fx(qt)}.</span>`;
  };
  q('go').onclick=()=>{same=true;draw();};
  q('clr').onclick=()=>{same=false;draw();};
  onPick(el,m=>{p=+m;same=false;draw();});
  draw();
}

/* is it reasonable? compare the dividend and the divisor before dividing */
const TOPS=[frac(1,2),frac(3,4),frac(4,3),frac(5,2)],BOTS=[frac(1,3),frac(2,3),frac(5,4),frac(3)];
function wSense(el){
  const q=Q(el);let i=1,j=1;
  el.innerHTML=`<div data-top>${seg('Dividend',TOPS.map((v,k)=>[k,fx(v)]))}</div><div data-bot>${seg('Divisor',BOTS.map((v,k)=>[k,fx(v)]))}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const a=TOPS[i],b=BOTS[j],qt=fDiv(a,b),A=fx(a),B=fx(b);
    q('top').querySelectorAll('[data-m]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.m===String(i)));
    q('bot').querySelectorAll('[data-m]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.m===String(j)));
    q('f').innerHTML=groupTape(a,b,{label:`Tape diagram: ${ftx(a)} in groups of ${ftx(b)}`});
    q('e').innerHTML=`${A} ÷ ${B} = ${fx(qt)}`;
    q('r').innerHTML=`<b>Is it more or less than 1?</b> ${A} is ${fVal(a)>fVal(b)?`more than ${B}, so more than 1 group fits: more than 1`:`less than ${B}, so not even 1 group fits: less than 1`}.<br>`
      +`<b>Is it more or less than ${A}?</b> ${B} is ${fVal(b)<1?`less than 1, so there are more groups than wholes: more than ${A}`:`more than 1, so there are fewer groups than wholes: less than ${A}`}.`
      +`<br><span class="dimline">Estimate first, then check your answer against it.</span>`;
  };
  el.addEventListener('click',e=>{const h=segHit(e,['top','bot']);if(!h)return;if(h[0]==='top')i=+h[1];else j=+h[1];draw();});
  draw();
}

const STEPS=[
  {title:'Dividing by a whole number',widget:wWhole,
    body:'<p>12 ÷ 3 asks how many 3s are in 12: 4. And 12 × '+fr(1,3)+' (a third of 12) is also 4. Dividing by a whole number is the same as multiplying by 1 over that number.</p><p>Pick a number to divide by.</p>',
    check:{kind:'mc',q:'Which is the same as 15 ÷ 5?',
      choices:[{id:'a',label:'15 × '+fr(1,5)},{id:'b',label:'15 × 5'},{id:'c',label:'5 × '+fr(1,15)}],answer:'a',
      why:{b:'15 × 5 = 75, and 15 ÷ 5 = 3. Dividing by 5 is multiplying by '+fr(1,5)+'.',c:'5 × '+fr(1,15)+' = '+fr(1,3)+', not 3. Keep the 15 and multiply it by '+fr(1,5)+'.'},
      explain:'15 ÷ 5 = 3, and 15 × '+fr(1,5)+' = '+fr(15,5)+' = 3.'}},
  {title:'Dividing by a unit fraction',widget:wUnitFrac,
    body:'<p>How many '+fr(1,4)+'s are in 3? Each whole holds 4 fourths, so 3 wholes hold 3 × 4 = 12. Dividing by '+fr(1,4)+' is the same as multiplying by 4.</p><p>Pick a unit fraction and change the number of wholes.</p>',
    check:{kind:'num',answer:18,frac:true,q:'What is 4 '+fr(1,2)+' ÷ '+fr(1,4)+'?',
      misc:[[1.13,'That’s 4 '+fr(1,2)+' × '+fr(1,4)+'. Dividing by '+fr(1,4)+' is multiplying by 4.'],[16,'That counts the fourths in 4 wholes. The '+fr(1,2)+' holds 2 more fourths.'],[0.06,'That’s '+fr(1,4)+' ÷ 4 '+fr(1,2)+'. Ask how many fourths are in 4 '+fr(1,2)+'.']],
      explain:'Each whole holds 4 fourths: 4 wholes hold 16 and the '+fr(1,2)+' holds 2 more, so 18. 4 '+fr(1,2)+' × 4 = 18.'}},
  {title:'Dividing by a non-unit fraction',widget:wNonUnit,
    body:'<p>To find 6 ÷ '+fr(2,3)+', first cut every whole into thirds: 6 × 3 = 18 thirds. Then put them in groups of 2 thirds: 18 ÷ 2 = 9. So dividing by '+fr(2,3)+' means multiplying by 3, then dividing by 2.</p><p>Pick a divisor, then cut and group.</p>',
    check:{kind:'mc',q:'Which expression is the same as 6 ÷ '+fr(3,4)+'?',
      choices:[{id:'a',label:'6 × 4 ÷ 3'},{id:'b',label:'6 ÷ 4 × 3'},{id:'c',label:'6 ÷ 4 ÷ 3'},{id:'d',label:'6 × 4 × 3'}],answer:'a',
      why:{b:'Each whole holds 4 fourths, so 6 wholes hold 6 × 4, not 6 ÷ 4.',c:'Each whole holds 4 fourths: multiply by 4 to count them, then divide by 3 to make groups of 3 fourths.',d:'Groups of 3 fourths are fewer than single fourths, so divide the 24 fourths by 3.'},
      explain:'6 wholes are 6 × 4 = 24 fourths, and groups of 3 fourths make 24 ÷ 3 = 8. So 6 ÷ '+fr(3,4)+' = 6 × 4 ÷ 3 = 8.'}},
  {title:'Multiply by the reciprocal',widget:wAlgo,
    body:'<p>Multiplying by the bottom number and dividing by the top number is the same as multiplying by the fraction flipped over, its <b>reciprocal</b>. So to divide by a fraction, multiply by its reciprocal: '+fr(3,4)+' ÷ '+fr(1,2)+' = '+fr(3,4)+' × '+fr(2,1)+'. Only the divisor flips. Write mixed numbers as fractions first.</p><p>Pick a division and go step by step.</p>',
    check:{kind:'num',answer:6,frac:true,q:'What is '+fr(15,4)+' ÷ '+fr(5,8)+'?',
      misc:[[2.34,'That’s '+fr(15,4)+' × '+fr(5,8)+'. Flip the divisor: '+fr(15,4)+' × '+fr(8,5)+'.'],[0.17,'You flipped '+fr(15,4)+' instead of '+fr(5,8)+'. Only the divisor (the second number) flips.'],[0.43,'You flipped both fractions. Keep '+fr(15,4)+' and flip only '+fr(5,8)+'.']],
      explain:fr(15,4)+' × '+fr(8,5)+' = '+fr(120,20)+' = 6. Check: 6 × '+fr(5,8)+' = '+fr(30,8)+' = '+fr(15,4)+'.'}},
  {title:'Same-size pieces',widget:wSame,
    body:'<p>Another way: write both fractions with the same denominator. Then they’re counted in the same size pieces, and you only have to divide the numerators. '+fr(3,4)+' ÷ '+fr(1,8)+' is 6 eighths ÷ 1 eighth: 6.</p><p>Pick a division and cut both into same-size pieces.</p>',
    check:{kind:'num',answer:2.5,frac:true,q:'What is '+fr(5,6)+' ÷ '+fr(1,3)+'?',
      misc:[[0.28,'That’s '+fr(5,6)+' × '+fr(1,3)+'. Write '+fr(1,3)+' as '+fr(2,6)+', then ask how many 2 sixths are in 5 sixths.'],[0.4,'That’s '+fr(1,3)+' ÷ '+fr(5,6)+'. Ask how many '+fr(1,3)+'s are in '+fr(5,6)+'.'],[2,'2 groups of 2 sixths use 4 sixths, and 1 sixth is left: that’s '+fr(1,2)+' of a group more.']],
      explain:fr(1,3)+' = '+fr(2,6)+', so '+fr(5,6)+' ÷ '+fr(2,6)+' = 5 ÷ 2 = 2 '+fr(1,2)+'.'}},
  {title:'Does the answer make sense?',widget:wSense,
    body:'<p>Before you divide, estimate. If the dividend is bigger than the divisor, the quotient is more than 1. If the divisor is less than 1, the quotient is more than the dividend. An answer that breaks these is wrong.</p><p>Pick a dividend and a divisor.</p>',
    check:{kind:'mc',stack:true,q:'Clare worked out '+fr(4,3)+' ÷ '+fr(5,2)+' = '+fr(10,3)+'. What do you think?',
      choices:[{id:'a',label:'It can’t be right: '+fr(4,3)+' is less than '+fr(5,2)+', so the answer is less than 1.'},{id:'b',label:'It’s right: '+fr(4,3)+' × 5 = '+fr(20,3)+', and '+fr(20,3)+' ÷ 2 = '+fr(10,3)+'.'},{id:'c',label:'It can’t be right: dividing always makes a number smaller, so it’s less than '+fr(4,3)+'.'}],answer:'a',
      why:{b:'That multiplies by the top number and divides by the bottom: backwards. Dividing by '+fr(5,2)+' is multiplying by '+fr(2,5)+'.',c:'Dividing by a number less than 1 makes it bigger. Here it is smaller, but because '+fr(5,2)+' is more than 1.'},
      explain:fr(4,3)+' ÷ '+fr(5,2)+' = '+fr(4,3)+' × '+fr(2,5)+' = '+fr(8,15)+', less than 1, just as the estimate says.'}}
];
