/* Learn Measuring Length (Grade 2 Unit 3), chapter 2: Centimeters and meters. Its widgets and steps; loaded by cm-and-m.html. */
/* an object with a 10 cm strip under it, for estimating (24 pixels per cm, like the 20 cm ruler it's measured on) */
const estFig=(kind,len)=>svgWrap(Math.max(len,10)*24+110,90,thing(kind,22,12,len*24)+`<rect class="ref" x="22" y="56" width="240" height="20" rx="3"/><text class="lbl st" x="274" y="66">10 cm</text>`,`A ${NAME[kind]} above a strip 10 centimeters long`);
const EST=[['eraser',6],['glue',9],['pencil',17]],GUESS=[5,10,20];
function wEstimate(el){
  const q=Q(el);let p=0,e=-1,shown=false;
  el.innerHTML=seg('Object',EST.map(([k],i)=>[i,NAME[k]]))+`<div class="fig" data-f></div><div class="chips" data-c></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [k,len]=EST[p],best=GUESS.reduce((b,g)=>Math.abs(g-len)<Math.abs(b-len)?g:b);press(el,p);
    q('f').innerHTML=shown?ruler(20,{u:24,obj:{kind:k,at:0,len}}):estFig(k,len);
    q('c').innerHTML=GUESS.map((g,i)=>`<button type="button" class="chip" data-e="${i}" aria-pressed="${i===e}"${shown?' disabled':''}>about ${g} cm</button>`).join('');
    q('go').disabled=e<0;q('go').textContent=shown?'Try another':'Measure it';
    q('r').innerHTML=e<0?`About how long is the ${NAME[k]}? Use the 10 cm strip to help. Tap an estimate.`
      :!shown?`Your estimate: <b>about ${GUESS[e]} cm</b>. Now measure it.`
      :`It’s <b>${len} cm</b> long. You said about ${GUESS[e]} cm.<br>`+(GUESS[e]===best?`<span class="ok">Great estimate!</span>`:`<span class="dimline">About ${best} cm is closer. An estimate doesn’t have to be exact.</span>`);
  };
  el.addEventListener('click',ev=>{const b=ev.target.closest('[data-m]');if(b){p=+b.dataset.m;e=-1;shown=false;draw();return;}const c=ev.target.closest('[data-e]');if(c&&!shown){e=+c.dataset.e;draw();}});
  q('go').onclick=()=>{if(shown){p=(p+1)%EST.length;e=-1;shown=false;}else shown=true;draw();};
  draw();
}
const MTH=[{k:'crayon',cm:9,u:'cm'},{k:'book',cm:25,u:'cm'},{k:'rope',cm:200,u:'m'},{k:'rug',cm:300,u:'m'}];
function wMeters(el){
  const q=Q(el);let p=0,e=null;
  el.innerHTML=seg('Thing',MTH.map((t,i)=>[i,NAME[t.k]]))+`<div class="fig" data-f></div><div class="chips" data-c></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {k,cm,u}=MTH[p],name=NAME[k],m=cm/100;press(el,p);
    q('f').innerHTML=svgWrap(380,90,thing(k,10,10,cm*1.2)+range(3).map(i=>`<rect class="mst ${i%2?'b':'a'}" x="${10+i*120}" y="50" width="120" height="26"/><text class="lbl s dk" x="${70+i*120}" y="63">1 meter</text>`).join(''),`A ${name} above 3 meter sticks`);
    q('c').innerHTML=[['cm','Centimeters'],['m','Meters']].map(([id,t])=>`<button type="button" class="chip" data-e="${id}" aria-pressed="${id===e}">${t}</button>`).join('');
    q('r').innerHTML=!e?`Would you measure the ${name} in centimeters or meters?`
      :e===u?(u==='cm'?`<span class="ok">Yes! The ${name} is much shorter than a meter stick. It’s about <b>${cm} cm</b> long.</span>`:`<span class="ok">Yes! The ${name} is about ${m} meter sticks long: <b>${m} meters</b>.</span>`)
      :(u==='cm'?`<span class="dimline">The ${name} is much shorter than 1 meter stick. Try centimeters.</span>`:`<span class="dimline">That’s a lot of centimeters to count! The ${name} is about ${m} meter sticks long. Try meters.</span>`);
  };
  el.addEventListener('click',ev=>{const b=ev.target.closest('[data-m]');if(b){p=+b.dataset.m;e=null;draw();return;}const c=ev.target.closest('[data-e]');if(c){e=c.dataset.e;draw();}});
  draw();
}
const REPS=[
  {a:['Dragon',55,'bearded dragon'],b:['Gecko',22,'leopard gecko']},
  {a:['Skink',48,'blue-tongued skink'],b:['Turtle',15,'box turtle']},
  {a:['Dragon',55,'bearded dragon'],b:['Skink',48,'blue-tongued skink']},
];
function wReptiles(el){
  const q=Q(el);let p=0,shown=false;
  el.innerHTML=seg('Reptiles',REPS.map(({a,b},i)=>[i,`${a[0]} and ${b[0].toLowerCase()}`]))+`<div class="fig" data-t></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {a:[la,a,na],b:[lb,b,nb]}=REPS[p],d=a-b;press(el,p);
    q('t').innerHTML=tapes([{label:la,n:a,show:a},{label:lb,n:b,show:b}],{diff:shown?d:'?'});
    q('go').textContent=shown?'Start over':'How much longer?';
    q('r').innerHTML=shown?`<b>${b} + ${d} = ${a}</b>, or <b>${a} − ${b} = ${d}</b>.<br><span class="ok">The ${na} is ${d} cm longer.</span>`
      :`A ${na} is ${a} cm long. A ${nb} is ${b} cm long.<br><span class="dimline">How much longer is the ${na}? That’s the dashed part.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;shown=false;draw();}});
  q('go').onclick=()=>{shown=!shown;draw();};
  draw();
}
/* the quick checks' figures */
const F={
  marker:estFig('marker',14),
  meter:svgWrap(260,40,`<rect class="mst a" x="10" y="8" width="240" height="26"/><text class="lbl s dk" x="130" y="21">1 meter = 100 centimeters</text>`,'A meter stick: 1 meter is 100 centimeters'),
  snake:tapes([{label:'Snake',n:60,show:60},{label:'Gecko',n:24,show:24}],{diff:'?'})
};
const STEPS=[
    {title:'Estimate, then measure',widget:wEstimate,
      body:'<p>An <b>estimate</b> is a smart guess. Compare with something you know, like a 10 cm strip. Then measure to check.</p><p>Pick a thing and an estimate. Then measure it.</p>',
      check:{kind:'mc',q:'About how long is this marker?',fig:F.marker,
        choices:[{id:'a',label:'about 2 cm'},{id:'b',label:'about 14 cm'},{id:'c',label:'about 100 cm'}],answer:'b',
        why:{a:'2 cm is about as long as a paper clip. The marker is longer than the 10 cm strip.',c:'100 cm is a whole meter stick! The marker is only a little longer than the 10 cm strip.'},
        explain:'The marker is a little longer than the 10 cm strip, so about 14 cm is a good estimate.'}},
    {title:'Meters',widget:wMeters,
      body:'<p>A meter stick is <b>1 meter</b> long. That’s <b>100 centimeters</b>. Use meters for long things and centimeters for short things.</p><p>Pick a thing. Would you use centimeters or meters?</p>',
      check:{kind:'mc',q:'Which one would you measure in meters?',fig:F.meter,
        choices:[{id:'a',label:'A crayon'},{id:'b',label:'The hallway'},{id:'c',label:'A shoe'}],answer:'b',
        why:{a:'A crayon is much shorter than a meter stick. Use centimeters.',c:'A shoe is much shorter than a meter stick. Use centimeters.'},
        explain:'A hallway is many meter sticks long, so meters are a good unit. Crayons and shoes are short, so use centimeters.'}},
    {title:'Compare lengths',widget:wReptiles,
      body:'<p>To find <b>how much longer</b>, find the difference. You can count on from the shorter length or subtract.</p><p>Pick two reptiles, then find how much longer one is.</p>',
      check:{kind:'num',unit:'cm',answer:36,fig:F.snake,q:'A garter snake is 60 cm long. A gecko is 24 cm long. How much longer is the snake than the gecko?',
        misc:[[84,'You added. “How much longer” asks for the difference, so subtract.'],[60,'That’s how long the snake is. How much longer is it than the gecko?'],[44,'60 has 0 ones, so break a ten: 10 − 4 = 6 ones, and 5 − 2 = 3 tens.']],
        explain:'60 − 24 = 36. Or count on: 24 + 6 = 30, and 30 + 30 = 60. 6 + 30 = 36 cm.'}}
  ];
