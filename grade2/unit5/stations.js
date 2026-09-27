/* Dragon Duel (Grade 2 Unit 5): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Base-ten diagrams, number names, place-value charts, and number lines come from shared/k5.js; mcOf and miscOf from shared/util.js. */
const place=['hundreds','tens','ones'];
const say=(n,w)=>`${n} ${n===1?w.replace(/s$/,''):w}`;
const htoSay=(h,t,o)=>`${say(h,'hundreds')}, ${say(t,'tens')}, ${say(o,'ones')}`;
/* a three-digit number; zero: its tens or ones digit is 0 */
function num3(zero=Math.random()<.35){
  const h=R(1,9);let t=R(1,9),o=R(1,9);
  if(zero){if(Math.random()<.5)t=0;else o=0;}
  return h*100+t*10+o;
}

/* blocks drawn bigger than the Learn page's: twice as wide, up to 560 pixels */
const zoom=svg=>svg.replace(/max-width:([\d.]+)px/,(m,w)=>`max-width:${Math.min(2*w,560)}px`);
const bigBlocks=(...a)=>zoom(htoFig(...a));

/* t tens in groups of 10 (3 groups to a row); show: outline each full group, which makes a hundred */
function tenGroups(t,show){
  const GW=10*(BT+4)+4,GH=FW+10;let m='';
  range(Math.ceil(t/10)).forEach(g=>{
    const n=Math.min(10,t-g*10),x=8+g%3*(GW+14),y=8+Math.floor(g/3)*(GH+12);
    range(n).forEach(i=>{m+=stick(x+4+i*(BT+4),y+5);});
    if(show&&n===10)m+=`<rect class="grp10" x="${x}" y="${y}" width="${GW}" height="${GH}" rx="6"/>`;
  });
  const cols=Math.min(3,Math.ceil(t/10)),rows=Math.ceil(t/30);
  return zoom(svgWrap(16+cols*GW+(cols-1)*14,16+rows*GH+(rows-1)*12,m,`${t} tens`));
}

/* ---------- Tower of Tens: make a hundred (Lessons 1–2) ---------- */
function genHundred(){
  const k=R(0,3);
  if(k===0){
    const t=pick([3,4,6,7,8,9]);
    return {kind:'num',unit:'more tens',answer:10-t,prompt:`Here are ${t} tens. How many more tens make a hundred?`,
      fig:show=>show?zoom(svgWrap(10*(BT+4)+24,FW+16,range(10).map(i=>stick(8+i*(BT+4)+Math.floor(i/5)*5,8,i<t?'':'ghost')).join(''),`${t} tens and ${10-t} more to make a hundred`)):bigBlocks(0,t,0,{},`${t} tens`),
      misc:miscOf(10-t,[[t,`That’s how many tens there are now. How many more make 10 tens?`],[(10-t)*10,`That’s ${(10-t)*10} ones. How many tens is that?`],[10,'10 tens is the whole hundred. Some are already here.']]),
      hint:`A hundred is 10 tens. The dashed sticks are the missing tens. Count on from ${t} to 10.`,
      explain:`${t} tens and ${10-t} more tens make 10 tens. 10 tens is a hundred.`};
  }
  if(k===1){
    const h=R(2,9),t=h*10;
    return {kind:'num',unit:'hundreds',answer:h,prompt:`How many hundreds can you make with ${t} tens?`,
      fig:show=>tenGroups(t,show),
      misc:miscOf(h,[[t,'That’s the number of tens. Every 10 tens make 1 hundred.'],[t*10,`${t*10} is the number. How many hundreds is that?`]]),
      hint:'Circle groups of 10 tens. Each group is a hundred.',
      explain:`Every 10 tens make a hundred. ${t} tens make ${h} hundreds: ${h*100}.`};
  }
  if(k===2){
    const h=R(2,9);
    return {kind:'num',unit:'tens',answer:h*10,prompt:`How many tens are in ${h*100}?`,
      fig:()=>bigBlocks(h,0,0,{},`${h} hundreds`),
      misc:miscOf(h*10,[[h,`${h} is how many hundreds. Each hundred is 10 tens.`],[h*100,`${h*100} is the number. How many tens is that?`]]),
      hint:'Each hundred is 10 tens. Count by tens for each hundred: 10, 20, …',
      explain:`${h} hundreds is ${h} groups of 10 tens: ${h*10} tens.`};
  }
  let t=R(11,39);if(t%10===0)t++;const h=Math.floor(t/10),r=t%10;
  return {kind:'num',unit:'',answer:t*10,prompt:`What number do ${t} tens make?`,
    fig:show=>tenGroups(t,show),
    misc:miscOf(t*10,[[t,`That’s the number of tens. Each ten is worth 10.`],[h*100+r,`${r} tens is ${r*10}, not ${r}.`]]),
    hint:`Make hundreds: ${t} tens is ${say(h,'hundreds')} and ${say(r,'tens')}.`,
    explain:`${t} tens is ${say(h,'hundreds')} and ${say(r,'tens')}: ${h*100} + ${r*10} = ${t*10}.`};
}

/* ---------- Block Forge: three-digit numbers (Lessons 3–4) ---------- */
function genBuild(){
  const k=R(0,3);
  if(k===0){
    const n=num3(),[h,t,o]=digits(n);
    return {kind:'num',unit:'',answer:n,prompt:'What number do the blocks show?',
      fig:()=>bigBlocks(h,t,o,{cls:{t:'b',o:'c'}},htoSay(h,t,o)),
      misc:miscOf(n,[[h*100+o*10+t,'Tens come before ones. Count the sticks for the tens digit.'],[Number(`${h}${t||''}${o||''}`),`${!t?'There are no tens':'There are no ones'}, so that place gets a 0.`],[h+t+o,'Each big square is 100 and each stick is 10. Don’t just count the pieces.']]),
      hint:'Big squares are hundreds. Sticks are tens. Small squares are ones.',
      explain:`${htoSay(h,t,o)} is ${n}.`};
  }
  if(k===1){
    const n=Math.random()<.6?num3(true):R(1,9)*100+R(11,19),[h,t,o]=digits(n),r=n%100;
    const swap=h*100+o*10+t,long=Number(`${h}00${r}`);
    return {...mcOf([[String(n),null],[String(swap===n?n+100*(h<9?1:-1):swap),swap===n?'Look at the hundreds.':(r>10&&r<20?`${numWords(swap)} is not the same as ${numWords(n)}. Look at the tens.`:`That’s ${numWords(swap)}. Check which digit is tens and which is ones.`)],[long.toLocaleString('en-US'),`${numWords(h*100)} is ${h*100}. The number only needs three digits: ${h} hundreds, ${t} tens, ${o} ones.`]]),
      prompt:`Which number is <b>${numWords(n)}</b>?`,fig:()=>bigBlocks(h,t,o,{cls:{t:'b',o:'c'}},'Base-ten blocks'),
      hint:`Say it in parts: ${numWords(h*100)}, then ${numWords(r)}.`,
      explain:`${numWords(n)} is ${htoSay(h,t,o)}: ${n}.`};
  }
  if(k===2){
    let n=num3(false);const [h,t,o]=digits(n);
    const others=[[h*100+o*10+t,'Look at the sticks. They show the tens.'],[o*100+t*10+h,'Look at the big squares. They show the hundreds.'],[t<9?n+10:n-10,'Count the sticks. Each one is a ten.'],[h<9?n+100:n-100,'Count the big squares. Each one is a hundred.']];
    const picks=others.filter(([v],i)=>v!==n&&others.findIndex(([w])=>w===v)===i).slice(0,2);
    const pic=(v,i)=>{const [a,b,c]=digits(v);return htoFig(a,b,c,{cls:{t:'b',o:'c'}},`Picture ${i}`);};
    const P=mcOf([[n,null],...picks]);
    P.choices.forEach((c,i)=>{c.label=pic(+c.label,'ABC'[i]);});
    return {...P,prompt:`Which blocks show <b>${n}</b>?`,
      hint:`${n} is ${htoSay(h,t,o)}.`,
      explain:`${n} is ${htoSay(h,t,o)}.`};
  }
  const n=num3(false),i=R(0,2),d=digits(n)[i];
  return {...mcOf(place.map((w,j)=>[`${say(d,w)} (${d*[100,10,1][j]})`,j===i?null:`The ${d} is in the ${place[i]} place, not the ${w} place.`])),
    prompt:`In <b>${n}</b>, what does the <b>${d}</b> mean?`,stack:true,fig:()=>pvChart([['',n]],i),
    hint:'The first digit is hundreds, then tens, then ones.',
    explain:`In ${n}, the ${d} is in the ${place[i]} place, so it means ${say(d,place[i])}: ${d*[100,10,1][i]}.`};
}

/* ---------- Spell Scrolls: expanded form (Lessons 5–6) ---------- */
function genExpand(){
  const k=R(0,2);
  if(k===0){
    const n=num3(),[h,t,o]=digits(n),parts=[h*100,t*10,o].filter(v=>v);
    return {kind:'num',unit:'',answer:n,prompt:`What number is <b>${parts.join(' + ')}</b>?`,
      fig:()=>bigBlocks(h,t,o,{cls:{t:'b',o:'c'}},htoSay(h,t,o)),
      misc:miscOf(n,[[Number(parts.join('')),'Each part goes in its own place. The number has only three digits.'],[h+t+o,`The ${h} is ${h*100}. Don’t just add the digits.`],[h*100+o*10+t,'Tens come before ones.'],[Number(`${h}${t||''}${o||''}`),'A place with nothing in it still needs a 0.']]),
      hint:`${h*100} is ${say(h,'hundreds')}, ${t*10} is ${say(t,'tens')}, and ${o} is ${say(o,'ones')}.`,
      explain:`${parts.join(' + ')} is ${htoSay(h,t,o)}: ${n}.`};
  }
  if(k===1){
    const n=num3(false),[h,t,o]=digits(n),i=R(0,1),val=[h*100,t*10][i];
    const eq=i?`${n} = ${h*100} + <span class="q">?</span> + ${o}`:`${n} = <span class="q">?</span> + ${t*10} + ${o}`;
    return {kind:'num',unit:'',answer:val,prompt:`What goes in the box? <span class="eqn">${eq}</span>`,
      fig:()=>bigBlocks(h,t,o,{cls:{t:'b',o:'c'}},htoSay(h,t,o)),
      misc:miscOf(val,[[[h,t][i],`The ${[h,t][i]} is in the ${place[i]} place, so it’s worth ${val}.`],[[t*10,h*100][i],'Check which part is missing.']]),
      hint:`What is the ${[h,t][i]} in ${n} worth?`,
      explain:`${n} = ${h*100} + ${t*10} + ${o}. The missing part is ${val}.`};
  }
  /* another way to make the number: break a hundred into 10 tens, or a ten into 10 ones */
  const n=R(2,9)*100+R(1,8)*10+R(1,8),[h,t,o]=digits(n),ten=Math.random()<.4;
  const right=ten?[h,t-1,o+10]:[h-1,t+10,o],
    wrong=ten?[[[h,t,o+10],`${o+10} ones is ${o+10}. That makes ${n+10}, not ${n}.`],[[h-1,t,o+10],`That’s missing a hundred: ${n-90}.`]]
      :[[[h,t+10,o],`${t+10} tens is ${(t+10)*10}. ${h*100} + ${(t+10)*10} + ${o} is ${n+100}, not ${n}.`],t===o?[[h-1,t,o],`That’s missing a hundred: ${n-100}.`]:[[h,o,t],`That’s ${h*100+o*10+t}. The tens and ones got switched.`]];
  return {...mcOf([[htoSay(...right),null],...wrong.map(([d,m])=>[htoSay(...d),m])]),stack:true,
    prompt:`Which is another way to make <b>${n}</b>?`,
    fig:show=>bigBlocks(...(show?right:[h,t,o]),{cls:{t:'b',o:'c'},tr:show&&!ten?10:0},show?htoSay(...right):htoSay(h,t,o)),
    hint:ten?'Break a ten into 10 ones. The number stays the same.':'Break a hundred into 10 tens. The number stays the same.',
    explain:ten?`Break a ten: ${htoSay(...right)}. ${h*100} + ${(t-1)*10} + ${o+10} = ${n}.`:`Break a hundred: ${htoSay(...right)}. ${(h-1)*100} + ${(t+10)*10} + ${o} = ${n}.`};
}

/* ---------- Number Bridge: the number line to 1,000 (Lessons 8–9) ---------- */
/* a number line with a tick every `by`, numbered at lo, the middle, and hi */
const bridge=(lo,by,o={})=>numLine(lo,lo+10*by,{u:52/by,step:by,big:5*by,ls:'',end:true,...o});
function genLine(){
  const k=R(0,2),big=Math.random()<.35,by=big?100:10,lo=big?0:R(1,9)*100,j=pick([1,2,3,4,6,7,8,9]),v=lo+j*by,mid=lo+5*by;
  const count=`Count by ${by}s from ${lo}: ${range(Math.min(j,5)).map(i=>lo+(i+1)*by).join(', ')}${j>5?', …':'.'}`+(j>5?` Or count on from ${mid}.`:'');
  if(k===0){
    const why=Object.fromEntries(range(11).map(i=>lo+i*by).filter(w=>w!==v).map(w=>[String(w),`That tick is ${w}. ${w<v?'Go farther right.':'Go back to the left.'}`]));
    return {kind:'tap',answer:String(v),why,prompt:`Tap where <b>${v}</b> goes on the number line.`,
      fig:(show,done)=>bridge(lo,by,{tap:'cand',pts:done?[{v,cls:'b',t:v}]:[],label:`A number line from ${lo} to ${lo+10*by} with a tick every ${by}`}),
      hint:`The ticks count by ${by}s. `+count,
      explain:`${v} is ${j} ticks past ${lo}. `+count};
  }
  if(k===1){
    return {kind:'num',unit:'',answer:v,prompt:`The ticks count by ${by}s. What number is the dot at?`,
      fig:()=>bridge(lo,by,{pts:[{v,cls:'b',t:'?'}],label:`A number line from ${lo} to ${lo+10*by} with a tick every ${by}, and a dot`}),
      misc:miscOf(v,[[lo+j*(big?10:1),`Each space is ${by} here, not ${big?10:1}.`],[lo+(j+1)*by,'Count the spaces, not the tick marks.'],[lo+(j-1)*by,'Count every space up to the dot.']]),
      hint:count,
      explain:`The dot is ${j} spaces past ${lo}. `+count};
  }
  /* between which hundreds? */
  const n=num3(),lo2=Math.floor(n/100)*100,hi2=lo2+100,near=n-lo2<=50?lo2:hi2,t0=Math.floor(n/10)*10;
  return {...mcOf([[`${lo2} and ${hi2}`,null],[`${lo2-100} and ${lo2}`,`${n} has ${say(lo2/100,'hundreds')}, so it comes after ${lo2}.`],[`${t0} and ${t0+10}`,`Those are tens. Find the hundreds ${n} is between.`]]),
    prompt:`Between which two hundreds is <b>${n}</b>?`,
    fig:show=>numLine(Math.max(0,lo2-100),Math.min(1000,hi2+100),{u:.9,step:100,big:100,ls:'',end:true,pts:show?[{v:n,cls:'b',t:n}]:[],label:'A number line counting by hundreds'}),
    hint:`${n} has ${say(lo2/100,'hundreds')}. What comes after ${lo2}?`,
    explain:`${n} is more than ${lo2} and less than ${hi2}, so it’s between ${lo2} and ${hi2}. It’s closer to ${near}.`};
}

/* ---------- Knight’s Challenge: compare and order (Lessons 10–12) ---------- */
/* two different three-digit numbers that are easy to mix up */
function pair(){
  const n=num3(false),[h,t,o]=digits(n),k=R(0,3);
  let m=k===0?h*100+o*10+t:k===1?h*100+t*10+((o+R(1,8))%10):k===2?h*100+((t+R(1,8))%10)*10+o:((h+R(0,1)*2-1+9)%9||9)*100+R(0,9)*10+R(0,9);
  if(m===n)m=n<990?n+10:n-10;
  return Math.random()<.5?[n,m]:[m,n];
}
const firstDiff=(a,b)=>{const da=digits(a),db=digits(b);return da.findIndex((d,i)=>d!==db[i]);};
function genCompare(){
  const k=R(0,2);
  if(k===0){
    const eq=Math.random()<.15,[a,b]=pair(),[x,y]=eq?[a,a]:[a,b],[h,t,o]=digits(x),i=firstDiff(x,y);
    const left=eq?`${h*100} + ${t*10} + ${o}`:String(x),rel=x>y?'>':x<y?'<':'=';
    const words={'>':'is greater than','<':'is less than','=':'is equal to'};
    return {...mcOf(['>','<','='].map(s=>[`${left} ${s} ${y}`,s===rel?null:s==='='?'The numbers are different. Look at each place.':eq?`${left} is ${x}, the same number.`:`Look at the ${place[i]}: ${digits(x)[i]} ${place[i]} is ${x>y?'more':'less'} than ${digits(y)[i]} ${place[i]}. The open side faces the bigger number.`])),
      prompt:'Which is true?',fig:()=>pvChart([['',x],['',y]]),
      hint:eq?`Add the parts: ${left} = ?`:'Start with the hundreds. If they’re the same, look at the tens, then the ones.',
      explain:eq?`${left} = ${x}, so the two are equal.`:`${x} ${words[rel]} ${y}: `+(i?`same ${i===1?'hundreds':'hundreds and tens'}, and `:'')+`${digits(x)[i]} ${place[i]} ${x>y?'>':'<'} ${digits(y)[i]} ${place[i]}.`};
  }
  const [a,b]=pair();let c=num3();while(c===a||c===b)c=num3();
  const L=[a,b,c],s=[...L].sort((p,q)=>p-q);
  if(k===1){
    const most=Math.random()<.5,ans=most?s[2]:s[0],w=most?'greatest':'least';
    return {...mcOf(L.map(v=>[String(v),v===ans?null:`Compare ${v} and ${ans} place by place, starting with hundreds. ${ans} is ${most?'greater':'less'}.`])),
      prompt:`Which number is <b>${w}</b>?`,fig:()=>pvChart(L.map(v=>['',v])),
      hint:'Look at the hundreds first. The most hundreds is greatest, and the fewest is least.',
      explain:`In order: ${s.join(' < ')}. The ${w} is ${ans}.`};
  }
  const swap=[s[1],s[0],s[2]],rev=[...s].reverse();
  return {...mcOf([[s.join(', '),null],[swap.join(', '),`Compare ${s[0]} and ${s[1]}: ${s[0]} is less, so it comes first.`],[rev.join(', '),'That goes from greatest to least. Start with the smallest.']]),
    prompt:'Which list goes from <b>least to greatest</b>?',stack:true,fig:()=>pvChart(L.map(v=>['',v])),
    hint:'Find the least number first. Then the next. Compare hundreds, then tens, then ones.',
    explain:`${s[0]} < ${s[1]} < ${s[2]}, so the list is ${s.join(', ')}.`};
}

/* ---------- The Dragon’s Lair: everything ---------- */
const genBoss=()=>pick([genHundred,genBuild,genExpand,genLine,genCompare])();

const ZONES=[
  {id:'hundred',name:'Tower of Tens',lessons:'Lessons 1–2',blurb:'Stack 10 tens to make a hundred, and count how many hundreds you can make.',gen:genHundred},
  {id:'build',name:'Block Forge',lessons:'Lessons 3–4',blurb:'Read numbers from hundreds, tens, and ones, and match number names to numbers.',gen:genBuild},
  {id:'expand',name:'Spell Scrolls',lessons:'Lessons 5–6',blurb:'Put 300 + 40 + 2 together, and find another way to make the same number.',gen:genExpand},
  {id:'line',name:'Number Bridge',lessons:'Lessons 8–9',blurb:'Find numbers on number lines that count by tens and hundreds.',gen:genLine},
  {id:'compare',name:'Knight’s Challenge',lessons:'Lessons 10–12',blurb:'Compare with >, <, and =, and put numbers in order.',gen:genCompare},
  {id:'boss',name:'The Dragon’s Lair',lessons:'All lessons',blurb:'Face the dragon! Every right answer knocks off one of its 10 hearts.',gen:genBoss},
];

/* the dragon, facing right: tail, wing, back spikes, neck, body, legs with claws, horned head, and a puff of fire (also the boss icon) */
const DRAGON='<path d="M22,44C10,44 3,49 4,55C5,60 11,61 15,58L19,62L20,54L14,55C10,55 9,51 13,49C16,47 20,48 22,49Z" fill="#3fbf88" stroke="#0a2340" stroke-width="1.5" stroke-linejoin="round"/><path d="M26,37L9,5Q17,8 19,15Q23,6 28,4Q30,12 34,15Q37,10 42,10L37,35Z" fill="#2f9e70" stroke="#0a2340" stroke-width="1.5" stroke-linejoin="round"/><path d="M31,35L10,6M32,34L28,5M34,34L41,11" stroke="#0a2340" stroke-width="1.2" stroke-linecap="round"/><path d="M17,37L19,31L22,35L25,29L28,34L31,28L33,34" fill="#ffc93c" stroke="#0a2340" stroke-width="1.2" stroke-linejoin="round"/><path d="M36,38Q40,31 41,23L49,24Q47,34 42,44Z" fill="#5fe0a8" stroke="#0a2340" stroke-width="1.5" stroke-linejoin="round"/><ellipse cx="28" cy="43" rx="15" ry="9.5" fill="#5fe0a8" stroke="#0a2340" stroke-width="1.5"/><path d="M17,47Q28,55 40,47Q29,51 17,47Z" fill="#c9f5de"/><path d="M19,49L17,59H24L25,51M33,50L33,59H40L39,48" fill="#5fe0a8" stroke="#0a2340" stroke-width="1.5" stroke-linejoin="round"/><path d="M17,59l1.5,2.5l1.5,-2.5l1.5,2.5l1.5,-2.5M33,59l1.5,2.5l1.5,-2.5l1.5,2.5l1.5,-2.5" fill="none" stroke="#f3f6fb" stroke-width="1.2"/><path d="M39,23L37,19L41,21M40,29L37,27L41,27" fill="#ffc93c" stroke="#0a2340" stroke-width="1"/><path d="M43,13Q41,5 36,3Q41,8 41,14Z" fill="#ffc93c" stroke="#0a2340" stroke-width="1.2" stroke-linejoin="round"/><path d="M47,12Q47,5 43,1Q46,6 45,12Z" fill="#ffc93c" stroke="#0a2340" stroke-width="1.2" stroke-linejoin="round"/><path d="M40,18Q42,11 50,11L58,15Q61,17 60,20L56,22L51,26Q43,27 40,21Z" fill="#5fe0a8" stroke="#0a2340" stroke-width="1.5" stroke-linejoin="round"/><path d="M51,21L59,19.5" stroke="#0a2340" stroke-width="1.2" stroke-linecap="round"/><ellipse cx="47.5" cy="16" rx="2.6" ry="2.2" fill="#ffc93c" stroke="#0a2340" stroke-width="1"/><ellipse cx="47.8" cy="16" rx=".8" ry="1.8" fill="#0a2340"/><circle cx="57" cy="16" r=".9" fill="#0a2340"/><path d="M59,21Q67,20 64,28Q63,25 60,26Q64,29 61,33Q58,28 57,23Z" fill="#ff9a86" stroke="#ff6b4a" stroke-width=".8" stroke-linejoin="round"/><path d="M59,22Q63,23 62,26Q60.5,24.5 58.5,24Z" fill="#ffc93c"/>';
const ICON={
  hundred:'<g stroke="#0a2340" stroke-width="1.5">'+range(5).map(i=>`<rect x="${14+i*8}" y="8" width="7" height="48" fill="#7fe3ff"/>`).join('')+'</g><path d="M10,4H56" stroke="#ffc93c" stroke-width="3"/>',
  build:'<rect x="6" y="14" width="30" height="30" fill="#ffc93c" stroke="#0a2340" stroke-width="1.5"/><path d="M12,14v30M18,14v30M24,14v30M30,14v30M6,20h30M6,26h30M6,32h30M6,38h30" stroke="rgba(10,35,64,.4)"/><rect x="40" y="14" width="6" height="30" fill="#7fe3ff" stroke="#0a2340"/><rect x="50" y="38" width="6" height="6" fill="#5fe0a8" stroke="#0a2340"/>',
  expand:'<rect x="10" y="10" width="44" height="44" rx="6" fill="#f2d0a0" stroke="#d9a066" stroke-width="2"/><g font-family="monospace" font-weight="700" font-size="11" fill="#0a2340" text-anchor="middle"><text x="32" y="26">300+40</text><text x="32" y="42">+2</text></g>',
  line:'<path d="M4,38H60" stroke="#f3f6fb" stroke-width="3"/><path d="M8,30v16M22,32v12M36,32v12M50,32v12" stroke="#f3f6fb" stroke-width="2.5"/><path d="M6,40Q32,62 58,40" fill="none" stroke="#d9a066" stroke-width="3"/><circle cx="36" cy="38" r="5" fill="#7fe3ff"/>',
  compare:'<path d="M14,50L50,14M50,50L14,14" stroke="#cfd8e3" stroke-width="5" stroke-linecap="round"/><path d="M10,54l8-8M54,54l-8-8" stroke="#d9a066" stroke-width="6" stroke-linecap="round"/><text x="32" y="38" fill="#ffc93c" font-size="18" font-weight="700" text-anchor="middle" font-family="monospace">&gt;</text>',
  boss:DRAGON,
};
