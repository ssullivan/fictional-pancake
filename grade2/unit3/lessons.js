/* Learn Measuring Length (Grade 2 Unit 3): figures, widgets, and the chapters. Loaded by learn.html.
   Cubes, tape diagrams, and the controls come from shared/k5.js. */

/* ---------- figures ---------- */
const NAME={pencil:'pencil',crayon:'crayon',marker:'marker',glue:'glue stick',eraser:'eraser',book:'book',poster:'poster',rope:'jump rope',rug:'rug',box:'shoe box',bench:'bench'};
/* An object lying flat from x, y, w wide: a pencil, crayon, marker, or glue stick, or a plain bar for anything else (book, rug, …). */
function thing(kind,x,y,w,h=26){
  const m=y+h/2,e=x+w,g=b=>`<g class="ob k-${kind}">${b}</g>`;
  switch(w<40?'':kind){
    case 'pencil':return g(`<rect class="er" x="${x}" y="${y}" width="10" height="${h}" rx="3"/><rect class="body" x="${x+10}" y="${y}" width="${w-28}" height="${h}"/><polygon class="wood" points="${e-18},${y} ${e},${m} ${e-18},${y+h}"/><polygon class="lead" points="${e-6},${m-3.5} ${e},${m} ${e-6},${m+3.5}"/>`);
    case 'crayon':return g(`<rect class="body" x="${x}" y="${y}" width="${w-14}" height="${h}" rx="3"/><polygon class="body" points="${e-14},${y+4} ${e},${m-4} ${e},${m+4} ${e-14},${y+h-4}"/><path class="band" d="M${x+8},${y}v${h}M${e-24},${y}v${h}"/>`);
    case 'marker':{const c=Math.round(w*.3);return g(`<rect class="body" x="${x}" y="${y}" width="${w-c+4}" height="${h}" rx="5"/><rect class="cap" x="${e-c}" y="${y-2}" width="${c}" height="${h+4}" rx="5"/>`);}
    case 'glue':return g(`<rect class="body" x="${x}" y="${y}" width="${w-16}" height="${h}" rx="4"/><rect class="cap" x="${e-16}" y="${y-2}" width="16" height="${h+4}" rx="4"/>`);
    default:return g(`<rect class="body" x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/>`);
  }
}
/* A ruler n units long, numbered from start (every other number when units are narrow). obj: {kind, at, len} lies on it from `at`. torn: a torn tape (ragged left end).
   span: shade the part under the object. count: number each unit under the object 1, 2, 3, …  u: pixels per unit. */
const RU={cm:28,in:44},UNITS={cm:'centimeters',in:'inches'};
function ruler(n,{unit='cm',u=RU[unit],start=0,torn=false,obj=null,span=false,count=false,label}={}){
  const X=22,Y=obj?52:8,H=46,W=X+n*u+44,x=v=>X+(v-start)*u;
  let o='';
  if(obj){const a=x(obj.at),b=x(obj.at+obj.len);o+=thing(obj.kind,a,12,b-a)+`<path class="guide" d="M${a},40V${Y}M${b},40V${Y}"/>`;}
  o+=torn?`<path class="rul" d="M${X-12},${Y}H${X+n*u+34}V${Y+H}H${X-12}${range(6).map(i=>`L${X-(i%2?12:20)},${Y+H-(i+1)*H/6}`).join('')}Z"/>`
    :`<rect class="rul" x="${X-12}" y="${Y}" width="${n*u+46}" height="${H}" rx="4"/>`;
  if(obj&&span)o+=`<rect class="span" x="${x(obj.at)}" y="${Y}" width="${obj.len*u}" height="${H}"/>`;
  range(n+1).forEach(i=>{
    const t=X+i*u;
    o+=`<line class="tick" x1="${t}" y1="${Y}" x2="${t}" y2="${Y+(u<24&&i%2?8:14)}"/>`+(u<24&&i%2?'':`<text class="lbl${u<30?' s':''}" x="${t}" y="${Y+28}">${start+i}</text>`);
    if(unit==='in'&&i<n)o+=`<line class="tick" x1="${t+u/2}" y1="${Y}" x2="${t+u/2}" y2="${Y+8}"/>`;
  });
  o+=`<text class="lbl s" x="${X+n*u+22}" y="${Y+28}">${unit}</text>`;
  if(obj&&count)range(obj.len).forEach(i=>{o+=`<text class="lbl s cy" x="${x(obj.at+i)+u/2}" y="${Y+H+14}">${i+1}</text>`;});
  return svgWrap(W,Y+H+(count?28:4),o,label||(obj?`A ${NAME[obj.kind]} on a ruler, from ${obj.at} to ${obj.at+obj.len} ${UNITS[unit]}`:`A ruler in ${UNITS[unit]}`));
}
/* units laid end to end: cubes (1 cm), paper clips (3 cm), erasers (5 cm) */
const UNITK={cube:{cm:1,name:'cubes'},clip:{cm:3,name:'paper clips'},eraser:{cm:5,name:'erasers'}};
const unitRow=(k,n,x,y,u)=>range(n).map(i=>{
  const s=UNITK[k].cm*u,a=x+i*s;
  return k==='cube'?`<rect class="cube a" x="${a+1}" y="${y}" width="${s-2}" height="${s-2}" rx="2"/>`
    :k==='clip'?`<g class="clip"><rect x="${a+2}" y="${y}" width="${s-4}" height="16" rx="8"/><rect x="${a+7}" y="${y+4}" width="${s-16}" height="8" rx="4"/></g>`
    :`<rect class="eraser" x="${a+1}" y="${y}" width="${s-2}" height="18" rx="4"/>`;
}).join('');
/* an object len cm long with rows of units under it: rows [[unit, how many], …]; u: pixels per cm */
function unitsFig(kind,len,rows,u){
  let o=thing(kind,10,8,len*u),y=46;
  rows.forEach(([k,n])=>{o+=unitRow(k,n,10,y,u);y+=(k==='cube'?u:18)+14;});
  return svgWrap(20+len*u,y,o,`A ${NAME[kind]} measured with `+rows.map(([k,n])=>`${n} ${UNITK[k].name}`).join(' and '));
}
/* an object with a 10 cm strip under it, for estimating (24 pixels per cm, like the 20 cm ruler it's measured on) */
const estFig=(kind,len)=>svgWrap(Math.max(len,10)*24+110,90,thing(kind,22,12,len*24)+`<rect class="ref" x="22" y="56" width="240" height="20" rx="3"/><text class="lbl st" x="274" y="66">10 cm</text>`,`A ${NAME[kind]} above a strip 10 centimeters long`);
/* foot rulers end to end (8 pixels per inch), with the inches so far under each join, or "12 in" under each one (each) */
const footRow=(x,y,k,each)=>range(k).map(i=>{
  const a=x+i*96;
  return `<rect class="rul" x="${a}" y="${y}" width="96" height="30" rx="2"/>`+range(11).map(j=>`<line class="tick" x1="${a+(j+1)*8}" y1="${y}" x2="${a+(j+1)*8}" y2="${y+(j===5?14:8)}"/>`).join('')+(each?`<text class="lbl s" x="${a+48}" y="${y+46}">12 in</text>`:`<text class="lbl cy" x="${a+96}" y="${y+46}">${12*(i+1)}</text>`);
}).join('');
/* a thing ft feet long with k foot rulers under it, room for max of them */
const feetFig=(kind,ft,k,max=ft,each=false)=>svgWrap(40+max*96,110,thing(kind,20,10,ft*96)+footRow(20,52,k,each),`A ${NAME[kind]} with ${k} foot rulers under it`);
/* A number line from 0 to max with arrows above it: [{a, b, lv, q}] goes from a to b at level lv (0 is lowest) and is labelled
   with its length, or ? when q and not shown. */
function lenLine(max,arrows,shown,label){
  const u=Math.min(18,380/max),X=16,top=Math.max(0,...arrows.map(r=>r.lv||0)),Y=40+top*38,x=v=>X+v*u;
  let o=`<line class="axis" x1="${X}" y1="${Y}" x2="${x(max)}" y2="${Y}"/>`;
  range(max+1).forEach(v=>{const big=v%5===0;o+=`<line class="tick" x1="${x(v)}" y1="${Y-(big?8:4)}" x2="${x(v)}" y2="${Y+(big?8:4)}"/>`+(big?`<text class="lbl s" x="${x(v)}" y="${Y+22}">${v}</text>`:'');});
  arrows.forEach(({a,b,lv=0,q})=>{
    const y=Y-18-lv*38,d=b>a?1:-1,t=q&&!shown?'?':Math.abs(b-a);
    o+=`<path class="guide" d="M${x(b)},${y}V${Y}${a?`M${x(a)},${y}V${Y}`:''}"/><line class="arr${q?' q':''}" x1="${x(a)}" y1="${y}" x2="${x(b)-d*6}" y2="${y}"/><polygon class="arrh${q?' q':''}" points="${x(b)},${y} ${x(b)-d*10},${y-6} ${x(b)-d*10},${y+6}"/><text class="lbl s${q?' cy':''}" x="${(x(a)+x(b))/2}" y="${y-12}">${t}</text>`;
  });
  return svgWrap(X*2+max*u,Y+32,o,label);
}
/* A line plot: counts {length: how many} from lo to hi, one X for each. mark: highlight that length.
   tap: lengths can be tapped (data-v). diff: [a, b] draws an arrow from a to b under the line. */
function lineplot(counts,lo,hi,{mark=null,tap=false,diff=null,unit='inches',u=56,label}={}){
  const top=Math.max(3,...Object.values(counts)),X=30,Y=16+top*26,x=v=>X+(v-lo)*u;
  let o='',y=Y+44;
  if(mark!==null)o+=`<rect class="colhi" x="${x(mark)-u/2+3}" y="4" width="${u-6}" height="${Y+30}" rx="8"/>`;
  o+=`<line class="axis" x1="${X-18}" y1="${Y}" x2="${x(hi)+18}" y2="${Y}"/>`;
  range(hi-lo+1).forEach(i=>{
    const v=lo+i,h=v===mark;
    o+=`<line class="tick" x1="${x(v)}" y1="${Y-6}" x2="${x(v)}" y2="${Y+6}"/><text class="lbl${h?' cy':''}" x="${x(v)}" y="${Y+22}">${v}</text>`;
    range(counts[v]||0).forEach(j=>{o+=`<text class="xm${h?' hi':''}" x="${x(v)}" y="${Y-16-j*26}">X</text>`;});
    if(tap)o+=`<rect class="hit" data-v="${v}" x="${x(v)-u/2}" y="0" width="${u}" height="${Y+34}"/>`;
  });
  if(diff){
    const [a,b]=diff;
    o+=`<line class="arr" x1="${x(a)+6}" y1="${y}" x2="${x(b)-6}" y2="${y}"/><polygon class="arrh" points="${x(a)},${y} ${x(a)+10},${y-6} ${x(a)+10},${y+6}"/><polygon class="arrh" points="${x(b)},${y} ${x(b)-10},${y-6} ${x(b)-10},${y+6}"/><text class="lbl s cy" x="${(x(a)+x(b))/2}" y="${y-10}">${b-a}</text>`;
    y+=24;
  }
  o+=`<text class="lbl s" x="${(X+x(hi))/2}" y="${y}">${unit}</text>`;
  return svgWrap(X*2+(hi-lo)*u,y+12,o,label||`Line plot of lengths in ${unit}: `+range(hi-lo+1).map(i=>`${counts[lo+i]||0} at ${lo+i}`).join(', '));
}

/* ---------- Chapter 1: units of length ---------- */
function wUnits(el){
  const q=Q(el);let k='cube';
  el.innerHTML=seg('Unit',Object.keys(UNITK).map(id=>[id,UNITK[id].name.replace(/^./,c=>c.toUpperCase())]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const U=UNITK[k],n=15/U.cm;press(el,k);
    q('f').innerHTML=unitsFig('pencil',15,[[k,n]],24);
    q('r').innerHTML=`The pencil is <b>${n} ${U.name}</b> long.<br><span class="dimline">${k==='cube'?'Cubes are small, so it takes a lot of them.':k==='clip'?'A paper clip is longer than a cube, so it takes fewer.':'An eraser is the longest unit here, so it takes the fewest.'}</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){k=b.dataset.m;draw();}});
  draw();
}
const CUBEIT=[['crayon',9],['marker',13],['glue',10]];
function wCubes(el){
  const q=Q(el),st={n:0};let p=0;
  el.innerHTML=seg('Object',CUBEIT.map(([k],i)=>[i,NAME[k]]))+`<div class="fig" data-f></div><div class="wrow">${stepper('n','Cubes')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [k,len]=CUBEIT[p],n=st.n;press(el,p);q('n').textContent=n;
    q('f').innerHTML=svgWrap(20+16*CUBE,86,thing(k,10,8,len*CUBE)+cubes(10,48,n,'a'),`A ${NAME[k]} with ${n} cubes under it`);
    q('r').innerHTML=n===len?`<span class="ok">The ${NAME[k]} is <b>${len} cubes</b> long. Each cube is 1 centimeter, so it’s <b>${len} cm</b> long.</span>`
      :`<b>${n}</b> cubes<br><span class="dimline">${n>len?'That goes past the end. Take some away.':n?'Not to the end yet. Add more cubes.':`Line up cubes from one end of the ${NAME[k]}. No gaps!`}</span>`;
  };
  steppers(el,st,{n:[0,16]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;st.n=0;draw();}});
  draw();
}
const RULEIT=[['pencil',7],['crayon',9],['glue',5]];
function wRuler(el){
  const q=Q(el),st={at:0};let p=0;
  el.innerHTML=seg('Object',RULEIT.map(([k],i)=>[i,NAME[k]]))+`<div class="fig" data-f></div><div class="wrow">${stepper('at','Start at')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [k,len]=RULEIT[p],a=st.at,b=a+len;press(el,p);q('at').textContent=a;
    q('f').innerHTML=ruler(15,{obj:{kind:k,at:a,len},span:true});
    q('r').innerHTML=a===0?`It starts at <b>0</b> and ends at <b>${b}</b>.<br><span class="ok">The ${NAME[k]} is <b>${len} cm</b> long.</span><br><span class="dimline">Now slide it so it starts at another number.</span>`
      :`It starts at <b>${a}</b> and ends at <b>${b}</b>. Is it ${b} cm long? No!<br><span class="ok">Count the spaces, or subtract: <b>${b} − ${a} = ${len} cm</b>.</span>`;
  };
  steppers(el,st,{at:[0,6]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;st.at=0;draw();}});
  draw();
}

/* ---------- Chapter 2: centimeters and meters ---------- */
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

/* ---------- Chapter 3: inches and feet ---------- */
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

/* ---------- Chapter 4: length stories ---------- */
/* one kind of silk story at a time: pick a story, then show the ? on the number line */
const silkStories=(list,prompt)=>el=>{
  const q=Q(el);let k=0,shown=false;
  el.innerHTML=seg('Story',list.map((x,i)=>[i,x.label]))+`<p class="story" data-s></p><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const K=list[k];press(el,k);
    q('s').textContent=K.story;
    q('f').innerHTML=lenLine(K.max,K.arrows,shown,K.label+': a number line in inches');
    q('go').textContent=shown?'Start over':'Find the ?';
    q('r').innerHTML=shown?`<b>${K.eq}</b><br><span class="ok">${K.ans}</span>`:prompt;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){k=+b.dataset.m;shown=false;draw();}});
  q('go').onclick=()=>{shown=!shown;draw();};
  draw();
};
const JOIN=[
  {label:'Necklace',story:'Mai has a piece of silk 18 inches long and a piece 7 inches long. Mai ties them together to make a necklace. How long is the necklace?',max:30,
    arrows:[{a:0,b:18},{a:18,b:25},{a:0,b:25,lv:1,q:true}],eq:'18 + 7 = 25',ans:'The necklace is 25 inches long.'},
  {label:'Bracelet',story:'Han ties a 4-inch piece of silk to a 3-inch piece to make a bracelet. How long is the bracelet?',max:10,
    arrows:[{a:0,b:4},{a:4,b:7},{a:0,b:7,lv:1,q:true}],eq:'4 + 3 = 7',ans:'The bracelet is 7 inches long.'},
  {label:'Headband',story:'Jada ties a 12-inch piece of silk to a 9-inch piece to make a headband. How long is the headband?',max:25,
    arrows:[{a:0,b:12},{a:12,b:21},{a:0,b:21,lv:1,q:true}],eq:'12 + 9 = 21',ans:'The headband is 21 inches long.'},
];
const LEFT=[
  {label:'Cut some off',story:'Elena has 30 inches of silk. Elena cuts off 7 inches for a bracelet. How much silk is left?',max:30,
    arrows:[{a:0,b:30,lv:2},{a:30,b:23,lv:1},{a:0,b:23,q:true}],eq:'30 − 7 = 23',ans:'23 inches of silk are left.'},
  {label:'How much longer?',story:'Jada’s necklace is 24 inches long. Han’s necklace is 18 inches long. How much longer is Jada’s necklace?',max:25,
    arrows:[{a:0,b:24,lv:1},{a:0,b:18},{a:18,b:24,q:true}],eq:'18 + ? = 24, or 24 − 18 = 6',ans:'Jada’s necklace is 6 inches longer.'},
  {label:'How much more?',story:'Kiran needs 20 inches of silk for a necklace. Kiran has 13 inches. How much more silk does Kiran need?',max:20,
    arrows:[{a:0,b:20,lv:1},{a:0,b:13},{a:13,b:20,q:true}],eq:'13 + ? = 20, or 20 − 13 = 7',ans:'Kiran needs 7 more inches.'},
];

/* ---------- Chapter 5: line plots ---------- */
const PENCILS={3:1,4:2,5:2,6:4,7:3,8:1},CRAYONS={5:1,6:3,7:2,8:5,9:2},LEAVES=[5,7,4,5,6,5,7,3];
function wReadPlot(el){
  const q=Q(el);let v=null;
  el.innerHTML=`<p class="story">Our class measured our pencils. Each X is one pencil.</p><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const n=PENCILS[v]||0;
    q('f').innerHTML=lineplot(PENCILS,3,8,{mark:v,tap:true});
    q('r').innerHTML=v===null?'Tap a number on the line plot.':`<b>${n} ${n===1?'pencil is':'pencils are'} ${v} inches long.</b><br><span class="dimline">Count the Xs above ${v}.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(b){v=+b.dataset.v;draw();}});
  draw();
}
function wMakePlot(el){
  const q=Q(el);let i=0,c={},miss=null;
  el.innerHTML=`<p class="story">We measured 8 leaves, in inches.</p><div class="chips" data-c></div><div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const done=i===LEAVES.length;
    q('c').innerHTML=LEAVES.map((n,j)=>`<span class="chip${j<i?' done':j===i?' cur':''}">${n} in</span>`).join('');
    q('f').innerHTML=lineplot(c,3,8,{tap:!done});
    q('r').innerHTML=done?`<span class="ok">You made a line plot! ${LEAVES.length} leaves, ${LEAVES.length} Xs.</span>`
      :miss!==null?`<span class="no">That’s ${miss}.</span> This leaf is <b>${LEAVES[i]} inches</b>. Find ${LEAVES[i]} on the line.`
      :`Next leaf: <b>${LEAVES[i]} inches</b>. Tap ${LEAVES[i]} on the line plot.`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(!b||i>=LEAVES.length)return;const v=+b.dataset.v;if(v===LEAVES[i]){c[v]=(c[v]||0)+1;i++;miss=null;}else miss=v;draw();});
  q('clr').onclick=()=>{i=0;c={};miss=null;draw();};
  draw();
}
const ASKS=[
  {label:'Longest',mark:8,say:'The longest pencil is <b>8 inches</b>. It’s the X farthest to the right.'},
  {label:'Shortest',mark:3,say:'The shortest pencil is <b>3 inches</b>. It’s the X farthest to the left.'},
  {label:'Most pencils',mark:6,say:'<b>6 inches</b> has the most Xs: 4 pencils are 6 inches long.'},
  {label:'How much longer?',diff:[3,8],say:'From 3 to 8 is <b>5 inches</b>. 8 − 3 = 5, so the longest pencil is 5 inches longer than the shortest.'},
];
function wSays(el){
  const q=Q(el);let k=0;
  el.innerHTML=seg('Question',ASKS.map((a,i)=>[i,a.label]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const A=ASKS[k];press(el,k);
    q('f').innerHTML=lineplot(PENCILS,3,8,{mark:A.mark??null,diff:A.diff||null});
    q('r').innerHTML=`<span class="ok">${A.say}</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){k=+b.dataset.m;draw();}});
  draw();
}

/* ---------- quick-check figures ---------- */
const F={
  book:unitsFig('book',24,[['clip',8],['cube',24]],14),
  pencil12:svgWrap(20+12*CUBE,86,thing('pencil',10,8,12*CUBE)+cubes(10,48,12,'a'),'A pencil with 12 cubes under it'),
  crayon29:ruler(15,{obj:{kind:'crayon',at:2,len:7}}),
  marker:estFig('marker',14),
  meter:svgWrap(260,40,`<rect class="mst a" x="10" y="8" width="240" height="26"/><text class="lbl s dk" x="130" y="21">1 meter = 100 centimeters</text>`,'A meter stick: 1 meter is 100 centimeters'),
  snake:tapes([{label:'Snake',n:60,show:60},{label:'Gecko',n:24,show:24}],{diff:'?'}),
  crayon4:ruler(6,{unit:'in',u:48,obj:{kind:'crayon',at:0,len:4}}),
  poster:feetFig('poster',2,2,2,true),
  torn:ruler(10,{unit:'in',u:40,start:4,torn:true,obj:{kind:'pencil',at:5,len:6}}),
  diego:lenLine(30,[{a:0,b:16},{a:16,b:25},{a:0,b:25,lv:1,q:true}],false,'Number line: 16 inches, then 9 more inches'),
  priya:lenLine(35,[{a:0,b:32,lv:2},{a:32,b:24,lv:1},{a:0,b:24,q:true}],false,'Number line: 32 inches, then 8 inches cut off'),
  crayons:lineplot(CRAYONS,5,9,{unit:'centimeters'}),
};
const ribbon=(counts,label)=>lineplot(counts,2,5,{u:44,label});

/* ---------- chapters ---------- */
const ICON={
  ruler:'<rect x="4" y="20" width="56" height="24" rx="3" fill="rgba(255,201,60,.3)" stroke="#ffc93c" stroke-width="2"/><path d="M12,20v10M20,20v6M28,20v10M36,20v6M44,20v10M52,20v6" stroke="#f3f6fb" stroke-width="2"/>',
  meter:'<rect x="6" y="18" width="16" height="10" rx="2" fill="#ff7b7b"/><rect x="2" y="36" width="30" height="12" fill="#ffc93c"/><rect x="32" y="36" width="30" height="12" fill="#7fe3ff"/>',
  foot:'<rect x="4" y="16" width="56" height="18" rx="2" fill="rgba(127,227,255,.25)" stroke="#7fe3ff" stroke-width="2"/><path d="M8.7,16v5M13.3,16v5M18,16v5M22.7,16v5M27.3,16v5M32,16v9M36.7,16v5M41.3,16v5M46,16v5M50.7,16v5M55.3,16v5" stroke="#f3f6fb" stroke-width="1.5"/><text x="32" y="52" fill="#ffc93c" font-size="14" font-weight="700" text-anchor="middle" font-family="monospace">12 in</text>',
  silk:'<path d="M4,50H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M6,36H32" stroke="#7fe3ff" stroke-width="3"/><polygon points="40,36 31,31 31,41" fill="#7fe3ff"/><path d="M40,20H50" stroke="#ffc93c" stroke-width="3"/><polygon points="58,20 49,15 49,25" fill="#ffc93c"/>',
  plot:'<path d="M4,50H60" stroke="#f3f6fb" stroke-width="2.5"/><g fill="#ffc93c" font-size="13" font-weight="700" font-family="monospace" text-anchor="middle"><text x="14" y="44">X</text><text x="32" y="44">X</text><text x="32" y="32">X</text><text x="32" y="20">X</text><text x="50" y="44">X</text><text x="50" y="32">X</text></g>',
};
const CH=[
  {icon:'ruler',title:'Units of length',lessons:'Lessons 1–3',blurb:'Measure with same-size units, line up centimeter cubes, and use a ruler the right way.',steps:[
    {title:'Same-size units',widget:wUnits,
      body:'<p>To measure, line up <b>units</b> that are all the same size, end to end, with no gaps. Then count them.</p><p>Tap each unit. See how many it takes to go across the pencil.</p>',
      check:{kind:'mc',q:'Lin measures a book with paper clips and gets 8. Han measures the same book with cubes and gets 24. Who is right?',fig:F.book,
        choices:[{id:'a',label:'Both of them'},{id:'b',label:'Only Lin'},{id:'c',label:'Only Han'}],answer:'a',
        why:{b:'Han’s cubes are small, so it takes more of them. Han is right too.',c:'Lin’s paper clips are longer than cubes, so it takes fewer. Lin is right too.'},
        explain:'Both are right. A paper clip is longer than a cube, so it takes fewer paper clips (8) than cubes (24) to go across the same book.'}},
    {title:'Measure in centimeters',widget:wCubes,
      body:'<p>A small cube is <b>1 centimeter</b> long. We write <b>cm</b>. Everyone’s centimeter is the same size, so everyone gets the same answer.</p><p>Pick a thing, then add cubes until they reach the end.</p>',
      check:{kind:'num',unit:'cm',answer:12,fig:F.pencil12,q:'Each cube is 1 centimeter long. How long is the pencil?',
        misc:[[11,'Count every cube, even the last one.'],[13,'Count each cube just one time.']],
        explain:'12 cubes go from one end of the pencil to the other. Each is 1 cm, so the pencil is 12 cm long.'}},
    {title:'Use a ruler',widget:wRuler,
      body:'<p>A ruler is like cubes in a row, with numbers. Line the end of the thing up with <b>0</b>. The number at the other end is its length.</p><p>What if it doesn’t start at 0? Slide it and see.</p>',
      check:{kind:'num',unit:'cm',answer:7,fig:F.crayon29,q:'How long is the crayon?',
        misc:[[9,'9 is where the crayon ends. It starts at 2, not 0.'],[2,'2 is where the crayon starts. How many spaces does it cover?'],[11,'You added. Count the spaces from 2 to 9, or subtract: 9 − 2.']],
        explain:'The crayon starts at 2 and ends at 9. 9 − 2 = 7, so it’s 7 cm long.'}}
  ]},
  {icon:'meter',title:'Centimeters and meters',lessons:'Lessons 4–6',blurb:'Estimate lengths, use meters for long things, and find how much longer one reptile is than another.',steps:[
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
  ]},
  {icon:'foot',title:'Inches and feet',lessons:'Lessons 8–10',blurb:'Measure in inches, see that a foot is 12 inches, and measure with a torn tape.',steps:[
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
  ]},
  {icon:'silk',title:'Length stories',lessons:'Lessons 11–12',blurb:'Tie pieces of silk together, cut some off, and compare with number lines.',steps:[
    {title:'Put pieces together',widget:silkStories(JOIN,'Each arrow is one piece of silk. Where does the long arrow end?'),
      body:'<p>Saree silk is ribbon made from old saris. Tie two pieces together and the lengths <b>add</b>.</p><p>A number line shows it: each arrow is a piece. Pick a story, then find the <b>?</b>.</p>',
      check:{kind:'num',unit:'inches',answer:25,fig:F.diego,q:'Diego ties a 16-inch piece of silk to a 9-inch piece. How long is the silk now?',
        misc:[[7,'You subtracted. Diego ties the pieces together, so add.'],[15,'6 + 9 = 15 ones. That’s a new ten, so there are 2 tens now, not 1.']],
        explain:'16 + 9 = 25. 16 + 4 = 20, and 5 more is 25 inches.'}},
    {title:'Cut off and compare',widget:silkStories(LEFT,'Which arrow has the ? Is it a part or the whole?'),
      body:'<p>If you <b>cut some off</b>, subtract. To find <b>how much longer</b> or <b>how much more</b>, count on or subtract.</p><p>Pick a story, then find the <b>?</b>.</p>',
      check:{kind:'num',unit:'inches',answer:24,fig:F.priya,q:'Priya has 32 inches of silk. Priya cuts off 8 inches for a bracelet. How many inches are left?',
        misc:[[40,'You added. Priya cuts some off, so there is less left.'],[36,'32 has only 2 ones. Break a ten: 12 − 8 = 4 ones, and 2 tens are left.'],[8,'That’s how much Priya cut off. How much is left?']],
        explain:'32 − 8 = 24. 32 − 2 = 30, and 6 more is 24 inches.'}}
  ]},
  {icon:'plot',title:'Line plots',lessons:'Lessons 14–16',blurb:'Read a line plot, make one from measurements, and see what the data says.',steps:[
    {title:'Read a line plot',widget:wReadPlot,
      body:'<p>A <b>line plot</b> shows lengths on a number line. Each <b>X</b> is one thing that was measured.</p><p>Tap a number to count its Xs.</p>',
      check:{kind:'num',unit:'crayons',answer:5,fig:F.crayons,q:'We measured our crayons. How many crayons are 8 cm long?',
        misc:[[8,'8 is the length. Count the Xs above 8.'],[13,'That’s all the crayons. Count only the Xs above 8.']],
        explain:'There are 5 Xs above 8, so 5 crayons are 8 cm long.'}},
    {title:'Make a line plot',widget:wMakePlot,
      body:'<p>To make a line plot, put one <b>X</b> above the number for each length.</p><p>Tap the line plot to add each leaf.</p>',
      check:{kind:'mc',q:'Ribbons are 2, 3, 3, and 5 inches long. Which line plot shows them?',
        choices:[{id:'a',label:ribbon({2:1,3:2,4:1},'Line plot with Xs at 2, 3, 3, and 4')},{id:'b',label:ribbon({2:1,3:2,5:1},'Line plot with Xs at 2, 3, 3, and 5')},{id:'c',label:ribbon({2:1,3:1,5:1},'Line plot with Xs at 2, 3, and 5')}],answer:'b',
        why:{a:'Look at 4. No ribbon is 4 inches long.',c:'Two ribbons are 3 inches long, so 3 needs two Xs.'},
        explain:'One X at 2, two Xs at 3, and one X at 5: one X for each ribbon.'}},
    {title:'What the data says',widget:wSays,
      body:'<p>A line plot helps you see the <b>longest</b>, the <b>shortest</b>, and which length has the most. You can find how much longer, too.</p><p>Tap each question.</p>',
      check:{kind:'num',unit:'cm',answer:4,fig:F.crayons,q:'How much longer is the longest crayon than the shortest crayon?',
        misc:[[14,'You added. How much longer means find the difference: 9 − 5.'],[9,'9 cm is the longest crayon. How much longer is it than the shortest?'],[5,'5 cm is the shortest crayon. Find the difference between the longest and shortest.']],
        explain:'The longest crayon is 9 cm. The shortest is 5 cm. 9 − 5 = 4 cm.'}}
  ]}
];
