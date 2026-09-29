/* Learn Measuring Length (Grade 2 Unit 3), chapter 3: Inches and feet. Its widgets and steps; loaded by inches-and-feet.html. */
/* foot rulers end to end (8 pixels per inch), with the inches so far under each join, or "12 in" under each one (each) */
const footRow=(x,y,k,each)=>range(k).map(i=>{
  const a=x+i*96;
  return `<rect class="rul" x="${a}" y="${y}" width="96" height="30" rx="2"/>`+range(11).map(j=>`<line class="tick" x1="${a+(j+1)*8}" y1="${y}" x2="${a+(j+1)*8}" y2="${y+(j===5?14:8)}"/>`).join('')+(each?`<text class="lbl s" x="${a+48}" y="${y+46}">12 in</text>`:`<text class="lbl cy" x="${a+96}" y="${y+46}">${12*(i+1)}</text>`);
}).join('');
/* a thing ft feet long with k foot rulers under it, room for max of them */
const feetFig=(kind,ft,k,max=ft,each=false)=>svgWrap(40+max*96,110,thing(kind,20,10,ft*96)+footRow(20,52,k,each),`A ${NAME[kind]} with ${k} foot rulers under it`);
const INCH=[['crayon',4,10],['eraser',2,5],['marker',5,13]];
function wInch(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Object',INCH.map(([k],i)=>[i,NAME[k]]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [k,i,c]=INCH[p];press(el,p);
    q('f').innerHTML=ruler(6,{unit:'in',u:48,obj:{kind:k,at:0,len:i}})+ruler(16,{unit:'cm',u:19,obj:{kind:k,at:0,len:c}});
    q('r').innerHTML=`Inch ruler: <b>${i} inches</b>. Centimeter ruler: about <b>${c} cm</b>.<br><span class="dimline">Same ${NAME[k]}! An inch is longer than a centimeter, so it takes fewer inches.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}
const FEET=[['box',1],['rug',3],['bench',4]];
function wFeet(el){
  const q=Q(el),st={k:0};let p=0;
  el.innerHTML=seg('Thing',FEET.map(([k],i)=>[i,NAME[k]]))+`<div class="fig" data-f></div><div class="wrow">${stepper('k','Foot rulers')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [k,ft]=FEET[p],n=st.k,sum=range(n).map(()=>12).join(' + ');press(el,p);q('k').textContent=n;
    q('f').innerHTML=feetFig(k,ft,n,ft+1);
    q('r').innerHTML=n===ft?`<span class="ok">The ${NAME[k]} is <b>${ft} ${ft>1?'feet':'foot'}</b> long. That’s ${ft>1?sum+' = ':''}<b>${12*ft} inches</b>.</span>`
      :!n?`A foot ruler is 12 inches long. Lay foot rulers under the ${NAME[k]}.`
      :`<b>${n} ${n>1?'feet':'foot'}</b>: ${n>1?sum+' = ':''}${12*n} inches<br><span class="dimline">${n>ft?'That goes past the end. Take one away.':'Not to the end yet.'}</span>`;
  };
  const lim={k:[0,FEET[0][1]+1]};
  steppers(el,st,lim,draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;st.k=0;lim.k[1]=FEET[p][1]+1;draw();}});
  draw();
}
const TORN=[['crayon',4],['marker',5],['glue',3]];
function wTorn(el){
  const q=Q(el),st={at:6};let p=0;
  el.innerHTML=seg('Object',TORN.map(([k],i)=>[i,NAME[k]]))+`<div class="fig" data-f></div><div class="wrow">${stepper('at','Start at')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [k,len]=TORN[p],a=st.at,b=a+len;press(el,p);q('at').textContent=a;
    q('f').innerHTML=ruler(10,{unit:'in',u:40,start:4,torn:true,obj:{kind:k,at:a,len},span:true,count:true});
    q('r').innerHTML=`It starts at <b>${a}</b> and ends at <b>${b}</b>.<br><span class="ok">Count the spaces: ${range(len).map(i=>i+1).join(', ')}. That’s <b>${len} inches</b>. Or subtract: ${b} − ${a} = ${len}.</span>`;
  };
  steppers(el,st,{at:[4,9]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;st.at=6;draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  crayon4:ruler(6,{unit:'in',u:48,obj:{kind:'crayon',at:0,len:4}}),
  poster:feetFig('poster',2,2,2,true),
  torn:ruler(10,{unit:'in',u:40,start:4,torn:true,obj:{kind:'pencil',at:5,len:6}})
};
const STEPS=[
    {title:'What is an inch?',widget:wInch,
      body:'<p>An <b>inch</b> is another unit of length. An inch is longer than a centimeter.</p><p>Pick a thing. Measure it in inches and in centimeters.</p>',
      check:{kind:'mc',q:'A crayon is 4 inches long. About how many centimeters long is it?',fig:F.crayon4,
        choices:[{id:'a',label:'about 2 cm'},{id:'b',label:'about 4 cm'},{id:'c',label:'about 10 cm'}],answer:'c',
        why:{a:'A centimeter is smaller than an inch, so it takes more centimeters, not fewer.',b:'Inches and centimeters are different sizes. A centimeter is smaller, so it takes more of them.'},
        explain:'A centimeter is smaller than an inch, so the number of centimeters is bigger. The crayon is about 10 cm long.'}},
    {title:'Feet and inches',widget:wFeet,
      body:'<p>A <b>foot</b> is 12 inches long. Use feet for bigger things, like a rug.</p><p>Pick a thing, then lay foot rulers under it.</p>',
      check:{kind:'num',unit:'inches',answer:24,fig:F.poster,q:'A poster is 2 feet long. How many inches long is it?',
        misc:[[2,'That’s in feet. Each foot is 12 inches.'],[14,'2 feet is 12 inches and 12 more inches, not 12 + 2.'],[12,'That’s 1 foot. The poster is 2 feet long.']],
        explain:'Each foot is 12 inches. 12 + 12 = 24, so the poster is 24 inches long.'}},
    {title:'Measure with a torn tape',widget:wTorn,
      body:'<p>This tape is torn, so it doesn’t start at 0. You can still measure! Count the spaces, or subtract the start from the end.</p><p>Pick a thing, then slide it along the tape.</p>',
      check:{kind:'num',unit:'inches',answer:6,fig:F.torn,q:'The tape is torn. How long is the pencil?',
        misc:[[11,'11 is where the pencil ends. The tape doesn’t start at 0.'],[5,'5 is where the pencil starts. Count the spaces from 5 to 11.'],[16,'You added. Subtract: 11 − 5.']],
        explain:'The pencil starts at 5 and ends at 11. 11 − 5 = 6, so it’s 6 inches long.'}}
  ];
