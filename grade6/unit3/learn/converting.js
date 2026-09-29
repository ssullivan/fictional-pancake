/* Learn Unit Rates and Percentages (Grade 6 Unit 3), chapter 1: Converting units. Its widgets and steps; loaded by converting.html. */
/* bigger units into smaller ones: 1 big = f small */
const CONV=[
  {big:['yard','yards'],small:['foot','feet'],f:3},
  {big:['foot','feet'],small:['inch','inches'],f:12},
  {big:['gallon','gallons'],small:['quart','quarts'],f:4},
  {big:['meter','meters'],small:['centimeter','centimeters'],f:100},
  {big:['kilogram','kilograms'],small:['gram','grams'],f:1000},
];
/* the same length measured two ways: n big units on top, n × f small ones below (drawn one by one when there are few) */
function convBars(n,f,big,small){
  const W=520,x0=10,bw=W/n,m=n*f,few=m<=48;let o='';
  for(let i=0;i<n;i++)o+=`<rect class="tape" x="${x0+i*bw}" y="24" width="${bw}" height="30"/>`;
  if(few)for(let i=0;i<m;i++)o+=`<rect class="tape b" x="${x0+i*W/m}" y="84" width="${W/m}" height="30"/>`;
  else for(let i=0;i<n;i++)o+=`<rect class="tape b" x="${x0+i*bw}" y="84" width="${bw}" height="30"/><text class="ftxt mid rev" x="${x0+i*bw+bw/2}" y="104">${fmt(f)}</text>`;
  o+=`<text class="ftxt" x="${x0}" y="16">${nOf(n,big)}</text><text class="ftxt" x="${x0}" y="134">${nOf(m,small)}</text>`;
  return svgWrap(W+20,142,o,`${nOf(n,big)} is ${nOf(m,small)}`);
}
function wConvert(el){
  const q=Q(el),st={n:2};let p=0;
  el.innerHTML=seg('Units',CONV.map((c,i)=>[i,`${c.big[1]} to ${c.small[1]}`]))+`<div class="wrow">${stepper('n','How many')}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {big,small,f}=CONV[p],{n}=st;press(el,p);q('n').textContent=n;
    q('f').innerHTML=convBars(n,f,big,small);
    q('r').innerHTML=`1 ${big[0]} is ${nOf(f,small)}, so ${nOf(n,big)} ${n===1?'is':'are'} ${n} × ${fmt(f)} = <b>${nOf(n*f,small)}</b>.<br><span class="dimline">A smaller unit takes more of them to measure the same thing.</span>`;
  };
  steppers(el,st,{n:[1,10]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

/* the same thing measured in three units: the sensible one has a number that is easy to picture */
const THINGS=[
  {what:'a pencil',v:[18,0.18,0.00018],u:['centimeters','meters','kilometers'],ok:0},
  {what:'a classroom door',v:[210,2.1,0.0021],u:['centimeters','meters','kilometers'],ok:1},
  {what:'the trip between two cities',v:[15000000,150000,150],u:['centimeters','meters','kilometers'],ok:2},
  {what:'a paper clip',v:[1,0.001],u:['grams','kilograms'],ok:0},
  {what:'a bicycle',v:[12000,12],u:['grams','kilograms'],ok:1},
];
function wSensible(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Measure',THINGS.map((t,i)=>[i,t.what]))+`<p class="readout" data-r></p>`;
  const draw=()=>{
    const t=THINGS[p];press(el,p);
    q('r').innerHTML=`${t.what[0].toUpperCase()+t.what.slice(1)} is about:<br>`
      +t.v.map((v,i)=>`${i===t.ok?'<b>':''}${v.toLocaleString('en-US',{maximumFractionDigits:5})} ${v===1?t.u[i].replace(/s$/,''):t.u[i]}${i===t.ok?'</b>':''}`).join(' = ')
      +`<br><span class="ok">${t.u[t.ok][0].toUpperCase()+t.u[t.ok].slice(1)} make sense: the number is easy to read and to picture.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

const STEPS=[
  {title:'Bigger units, fewer of them',widget:wConvert,
    body:'<p>To change bigger units into smaller ones, multiply: each yard is 3 feet, so 2 yards is 2 × 3 = 6 feet. The length doesn’t change, but it takes more of the smaller unit to measure it.</p><p>Pick two units and change how many.</p>',
    check:{kind:'num',unit:'feet',answer:12,q:'A rope is 4 yards long. How many feet long is it?',
      misc:[[1.33,'That’s 4 ÷ 3. A foot is smaller than a yard, so it takes more feet: multiply.'],[7,'That’s 4 + 3. Each yard is 3 feet: 4 × 3.'],[48,'4 × 12 is inches in 4 feet. A yard is 3 feet.']],
      explain:'Each yard is 3 feet, so 4 yards is 4 × 3 = 12 feet.'}},
  {title:'Which unit makes sense?',widget:wSensible,
    body:'<p>You can measure anything in any unit of the right kind, but one unit usually makes the number easy to read and to picture. A pencil is 18 centimeters, not 0.00018 kilometers.</p><p>Pick something to measure.</p>',
    check:{kind:'mc',q:'Which unit makes sense for the mass of a bicycle?',
      choices:[{id:'kg',label:'kilograms'},{id:'g',label:'grams'},{id:'l',label:'liters'}],answer:'kg',
      why:{g:'A bicycle is about 12,000 grams: a big, hard number to picture. In kilograms it’s about 12.',l:'Liters measure how much space something takes up, not how heavy it is.'},
      explain:'A bicycle is about 12 kilograms, an easy number to picture.'}}
];
