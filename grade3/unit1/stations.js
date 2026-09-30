/* Orchard Market (Grade 3 Unit 1): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Picture graphs, bar graphs, equal groups, arrays, tape diagrams, and hop lines come from shared/k5.js; mcOf and miscOf from shared/util.js. */
const KIDS=['Mai','Diego','Lin','Han','Priya','Kiran','Elena','Jada','Noah','Clare','Andre','Tyler'];
const cap=s=>s[0].toUpperCase()+s.slice(1);
const list=a=>a.join(', ');
const upTo=n=>range(n).map(i=>i+1);
const pl=(n,w,ws=w+'s')=>`${n} ${n===1?w:ws}`;
const addends=(n,a)=>Array(n).fill(a).join(' + ');
const countBy=(n,k)=>list(upTo(k).map(i=>i*n));
const COLORS=['red','blue','green','yellow'];

/* ---------- Picture Barn and Bar Silo: scaled graphs (Lessons 1–8) ---------- */
/* what the market counted: a title, what each count is (one, many), and the rows */
const DATA=[
  {title:'Pies sold at the market',one:'pie',many:'pies',rows:['Monday','Tuesday','Wednesday','Thursday']},
  {title:'Jars of honey sold',one:'jar',many:'jars',rows:['Monday','Tuesday','Wednesday','Thursday']},
  {title:'Apples picked by each team',one:'apple',many:'apples',rows:['Team A','Team B','Team C','Team D']},
  {title:'Eggs collected at the farm',one:'egg',many:'eggs',rows:['Monday','Tuesday','Wednesday','Thursday']},
  {title:'Favorite fruit at our school',one:'vote',many:'votes',rows:['Apples','Pears','Plums','Peaches']}
];
const SHORT={Monday:'Mon',Tuesday:'Tue',Wednesday:'Wed',Thursday:'Thu'};
const short=l=>SHORT[l]||l;
/* n values on a scale of s, up to `most` scale steps; half a step (s = 2 or 10) when halves. Values differ from each other. */
function values(n,s,most,halves){
  const step=halves?s/2:s,top=most*s/step;let v;
  do{v=range(n).map(()=>R(1,top)*step);}while(new Set(v).size<n);
  return v;
}
/* a data set: [data, rows as {label, n}], n rows */
function dataSet(n,s,most,halves){
  const d=pick(DATA),v=values(n,s,most,halves),labels=shuffle(d.rows).slice(0,n).sort((a,b)=>d.rows.indexOf(a)-d.rows.indexOf(b));
  return [d,labels.map((l,i)=>({label:l,n:v[i],c:COLORS[i],pic:'note'}))];
}
const figRows=rows=>rows.map(r=>({...r,label:short(r.label)}));
const topOf=(rows,s)=>Math.max(s*4,Math.ceil(Math.max(...rows.map(r=>r.n))/s)*s+s);
/* "halfway between 20 and 30", or "on the 40 line" */
const onScale=(v,s)=>v%s?`halfway between ${v-v%s} and ${v-v%s+s}`:`on the ${v} line`;

function genPics(){
  const k=R(0,3);
  if(k===0){
    /* how many a row shows, with half pictures on scales of 2 and 10 */
    const s=pick([2,5,10]),halves=s!==5&&Math.random()<.6,[d,rows]=dataSet(R(3,4),s,s===10?8:10,halves);
    const i=halves&&rows.some(r=>r.n%s)?pick(rows.map((r,j)=>j).filter(j=>rows[j].n%s)):R(0,rows.length-1),r=rows[i],whole=Math.floor(r.n/s),half=r.n%s;
    const m=[[whole+(half?1:0),`That’s the number of pictures. Each picture shows ${s}.`]];
    if(half)m.push([whole*s,`Don’t forget the half picture. It shows ${half} more.`],[(whole+1)*s,`The last picture is only half, so it shows ${half}, not ${s}.`]);
    return {kind:'num',unit:d.many,answer:r.n,
      prompt:`Each picture shows ${pl(s,d.one,d.many)}. How many ${d.many} does the graph show for ${r.label}?`,
      fig:show=>picGraph(figRows(rows),{scale:s,unit:pl(s,d.one,d.many),title:d.title,hi:show?i:-1}),
      misc:miscOf(r.n,m),
      hint:`Count by ${s}s for the whole pictures${half?`. Half a picture is ${half}.`:'.'}`,
      explain:`${r.label} has ${half?`${whole} and a half pictures`:pl(whole,'picture')}. Count by ${s}s: ${countBy(s,whole)}${half?`, and ${half} more`:''}. That’s ${r.n}.`};
  }
  if(k===1){
    /* tap the row that shows n */
    const s=pick([2,5,10]),halves=s!==5&&Math.random()<.5,[d,rows]=dataSet(4,s,s===10?8:10,halves),i=R(0,3),r=rows[i],why={};
    rows.forEach((q,j)=>{if(j!==i)why[j]=`${q.label} shows ${q.n}. Count by ${s}s for each picture.`;});
    return {kind:'tap',answer:String(i),why,
      prompt:`Each picture shows ${pl(s,d.one,d.many)}. Tap the row that shows ${r.n} ${d.many}.`,
      fig:show=>picGraph(figRows(rows),{scale:s,unit:pl(s,d.one,d.many),title:d.title,tap:'cand'}),
      hint:`${r.n} is ${r.n%s?`${Math.floor(r.n/s)} and a half`:r.n/s} ${r.n/s===1?'picture':'pictures'}: count by ${s}s until you reach ${r.n}.`,
      explain:`${r.label} has ${r.n%s?`${Math.floor(r.n/s)} and a half pictures`:pl(r.n/s,'picture')}, and each shows ${s}. That’s ${r.n}.`};
  }
  if(k===2){
    /* how many pictures to draw */
    const s=pick([2,5,10]),d=pick(DATA),j=R(2,8),n=j*s,l=pick(d.rows);
    return {kind:'num',unit:'pictures',answer:j,
      prompt:`${d.title}: ${n} ${d.many} on ${l}. In a picture graph where each picture shows ${s}, how many pictures go in the ${l} row?`,
      fig:show=>picGraph([{label:short(l),n:show?n:0,pic:'note',c:'green'}],{scale:s,max:n,unit:pl(s,d.one,d.many),title:d.title}),
      misc:miscOf(j,[[n,`That’s the number of ${d.many}. Each picture shows ${s}.`],[s,`That’s what one picture shows. How many ${s}s make ${n}?`],[n-s,`You subtracted. Count by ${s}s to ${n}.`]]),
      hint:`Count by ${s}s to ${n}. Each number you say is one picture.`,
      explain:`Count by ${s}s: ${countBy(s,j)}. That’s ${j} pictures.`};
  }
  /* how many more, from a picture graph */
  const s=pick([2,5,10]),[d,rows]=dataSet(3,s,s===10?8:10,false),[a,b]=shuffle([0,1,2]).slice(0,2).sort((x,y)=>rows[y].n-rows[x].n),hi=rows[a],lo=rows[b],diff=hi.n-lo.n;
  return {kind:'num',unit:d.many,answer:diff,
    prompt:`Each picture shows ${pl(s,d.one,d.many)}. How many more ${d.many} for ${hi.label} than for ${lo.label}?`,
    fig:show=>picGraph(figRows(rows),{scale:s,unit:pl(s,d.one,d.many),title:d.title}),
    misc:miscOf(diff,[[hi.n+lo.n,`That’s both rows together. How many more means subtract: ${hi.n} − ${lo.n}.`],[diff/s,`That’s how many more pictures. Each picture shows ${s}.`]]),
    hint:`Find each row’s number first: count by ${s}s. Then subtract.`,
    explain:`${hi.label}: ${hi.n}. ${lo.label}: ${lo.n}. ${hi.n} − ${lo.n} = ${diff}.`};
}

function genBars(){
  const k=R(0,4);
  if(k===0){
    /* read a bar, maybe halfway between two lines */
    const s=pick([2,5,10]),halves=s!==5&&Math.random()<.6,[d,rows]=dataSet(R(3,4),s,8,halves),i=halves&&rows.some(r=>r.n%s)?pick(rows.map((r,j)=>j).filter(j=>rows[j].n%s)):R(0,rows.length-1),r=rows[i],top=topOf(rows,s);
    const lo=r.n-r.n%s,m=r.n%s?[[lo,`The bar goes past ${lo}. It ends ${onScale(r.n,s)}.`],[lo+s,`The bar doesn’t reach ${lo+s}. It ends ${onScale(r.n,s)}.`]]:[[r.n/s,`That’s the number of spaces. Each space is ${s}.`],[r.n+s,'Read the number on the line where the bar ends.']];
    return {kind:'num',unit:d.many,answer:r.n,
      prompt:`How many ${d.many} does the bar for ${r.label} show?`,
      fig:show=>barGraph(figRows(rows),{max:top,scale:s,uh:32,title:d.title,hi:show?i:-1}),
      misc:miscOf(r.n,m),
      hint:`The lines go up by ${s}s. Find where the top of the ${short(r.label)} bar is.`,
      explain:`The lines go up by ${s}s. The ${short(r.label)} bar ends ${onScale(r.n,s)}, so it shows ${r.n}.`};
  }
  if(k===1||k===2){
    /* how many more or fewer (k 1), or how many in all (k 2) */
    const s=pick([5,10]),[d,rows]=dataSet(3,s,k===2?5:8,false),top=topOf(rows,s),[a,b]=shuffle([0,1,2]).slice(0,2).sort((x,y)=>rows[y].n-rows[x].n),hi=rows[a],lo=rows[b],diff=hi.n-lo.n,sum=hi.n+lo.n;
    if(k===1){
      const fewer=Math.random()<.5;
      return {kind:'num',unit:d.many,answer:diff,
        prompt:fewer?`How many fewer ${d.many} for ${lo.label} than for ${hi.label}?`:`How many more ${d.many} for ${hi.label} than for ${lo.label}?`,
        fig:show=>barGraph(figRows(rows),{max:top,scale:s,uh:32,title:d.title,hi:show?[a,b]:-1}),
        misc:miscOf(diff,[[sum,`That’s both bars together. How many ${fewer?'fewer':'more'} means subtract: ${hi.n} − ${lo.n}.`],[diff/s,`That’s how many spaces taller. Each space is ${s}.`]]),
        hint:`Read both bars, then subtract the smaller number from the bigger one.`,
        explain:`${hi.label}: ${hi.n}. ${lo.label}: ${lo.n}. ${hi.n} − ${lo.n} = ${diff}.`};
    }
    return {kind:'num',unit:d.many,answer:sum,
      prompt:`How many ${d.many} for ${lo.label} and ${hi.label} in all?`,
      fig:show=>barGraph(figRows(rows),{max:top,scale:s,uh:32,title:d.title,hi:show?[a,b]:-1}),
      misc:miscOf(sum,[[diff,`That’s how many more for ${hi.label}. In all means add.`],[rows.reduce((t,r)=>t+r.n,0),`That’s all three bars. Add just ${lo.label} and ${hi.label}.`]]),
      hint:'Read both bars, then add.',
      explain:`${lo.label}: ${lo.n}. ${hi.label}: ${hi.n}. ${lo.n} + ${hi.n} = ${sum}.`};
  }
  if(k===3){
    /* tap the bar that shows n */
    const s=pick([2,5,10]),[d,rows]=dataSet(4,s,8,s!==5&&Math.random()<.5),top=topOf(rows,s),i=R(0,3),r=rows[i],why={};
    rows.forEach((q,j)=>{if(j!==i)why[j]=`That bar shows ${q.n}. The lines go up by ${s}s.`;});
    return {kind:'tap',answer:String(i),why,
      prompt:`Tap the bar that shows ${r.n} ${d.many}.`,
      fig:show=>barGraph(figRows(rows),{max:top,scale:s,uh:32,title:d.title,tap:'cand'}),
      hint:`The lines go up by ${s}s. Find ${r.n} on the side, then look across.`,
      explain:`The ${short(r.label)} bar ends ${onScale(r.n,s)}. That’s ${r.n}.`};
  }
  /* choose the best scale: the biggest of 2, 5, 10 that every number fits */
  const best=pick([2,5,10]);let v;
  do{v=best===10?range(3).map(()=>R(1,9)*10):best===5?range(3).map(()=>R(1,10)*5):range(3).map(()=>R(1,10)*2);}
  while(new Set(v).size<3||Math.max(...v)<(best===10?60:best===5?25:10)||(best===5&&v.every(x=>x%10===0))||(best===2&&v.every(x=>x%5===0)));
  const d=pick(DATA),M=Math.max(...v),between=s=>v.filter(x=>x%s),wrong=best===10?[1,2]:best===5?[1,10]:[5,10];
  const why=s=>between(s).length?`${list(between(s))} would end between lines, so ${between(s).length>1?'they’re':'it’s'} harder to read.`:`That needs ${M/s} spaces. The graph would be much too tall.`;
  return {...mcOf([[`A line every ${best}`,null],...wrong.map(s=>[`A line every ${s}`,why(s)])]),
    prompt:`${d.title}: ${list(v.map((x,i)=>`${d.rows[i]} ${x}`))}. Which scale is best for a bar graph?`,
    hint:'A good scale makes every bar end on a line, without too many lines to count.',
    explain:`${list(v)} are all ${best===10?'tens':`multiples of ${best}`}. With a line every ${best}, every bar ends on a line, and there are ${M/best} spaces.`};
}

/* ---------- Basket Row: equal groups, expressions (Lessons 9–12) ---------- */
/* equal-group stories: groups (one, many), things, the numbers in each that make sense, and how to say it */
const GROUPS=[
  {one:'basket',many:'baskets',t:'apples',n:upTo(10).slice(1),each:'in each basket'},
  {one:'bag',many:'bags',t:'oranges',n:[3,4,5,6,8,10],each:'in each bag'},
  {one:'box',many:'boxes',t:'peaches',n:[4,6,8,10],each:'in each box'},
  {one:'vase',many:'vases',t:'flowers',n:upTo(10).slice(1),each:'in each vase'},
  {one:'plate',many:'plates',t:'strawberries',n:upTo(10).slice(1),each:'on each plate'},
  {one:'pack',many:'packs',t:'juice boxes',n:[3,4,6,8],each:'in each pack'},
  {one:'spider',many:'spiders',t:'legs',n:[8],each:'on each spider'},
  {one:'car',many:'cars',t:'wheels',n:[4],each:'on each car'},
  {one:'tricycle',many:'tricycles',t:'wheels',n:[3],each:'on each tricycle'},
  {one:'hand',many:'hands',t:'fingers',n:[5],each:'on each hand'},
  {one:'cow',many:'cows',t:'legs',n:[4],each:'on each cow'},
  {one:'ant',many:'ants',t:'legs',n:[6],each:'on each ant'}
];
/* a story and its numbers: g groups of n, with g ≠ n */
function story(containers){
  const S=pick(containers?GROUPS.filter(q=>q.each.startsWith('in')):GROUPS),n=pick(S.n);let g;do{g=R(2,S.many==='hands'?10:9);}while(g===n||S.many==='hands'&&g%2);
  return {S,g,n,p:g*n,say:`${g} ${S.many} with ${n} ${S.t} ${S.each}`};
}
const tape=(g,n,total,label)=>partWhole(range(g).map(()=>({n:1,show:n})),total,label||`Tape diagram: ${g} equal parts of ${n}`);
function genGroups(){
  const k=R(0,3),{S,g,n,p,say}=story();
  if(k===0){
    /* count equal groups in a picture */
    return {kind:'num',unit:S.t,answer:p,
      prompt:`There are ${say}. How many ${S.t} are there in all?`,
      fig:show=>groupsFig(g,n,{label:`${g} circles with ${n} dots in each`}),
      misc:miscOf(p,[[g+n,`You added ${g} + ${n}. There are ${g} groups of ${n}.`],[g,`That’s the number of ${S.many}. Count the ${S.t}.`],[n,`That’s the ${S.t} ${S.each}. There are ${g} ${S.many}.`],[(g-1)*n,`That’s ${pl(g-1,'group')}. Count the ${S.many} again.`]]),
      hint:`Count by ${n}s, once for each of the ${g} ${S.many}.`,
      explain:`${g} groups of ${n}: ${countBy(n,g)}. ${g} × ${n} = ${p}.`};
  }
  if(k===1){
    /* which expression matches the story */
    return {...mcOf([[`${g} × ${n}`,null],[`${n} × ${g}`,`That’s ${n} groups of ${g}. There are ${g} ${S.many}, with ${n} ${S.each}.`],[`${g} + ${n}`,`That adds. For equal groups, multiply: ${g} groups of ${n}.`]]),
      prompt:`There are ${say}. Which expression matches?`,
      fig:show=>groupsFig(g,n,{label:`${g} circles with ${n} dots in each`}),
      hint:`The first number is how many groups. The second is how many in each group.`,
      explain:`${g} ${S.many} are ${g} groups, with ${n} ${S.each}: ${g} × ${n}.`};
  }
  if(k===2){
    /* which diagram matches the story */
    return {...mcOf([[tape(g,n,'?'),null],[tape(n,g,'?'),`That’s ${n} groups of ${g}. There are ${g} ${S.many}, so the diagram needs ${g} parts.`],[partWhole([{n:g,show:g},{n,show:n}],'?','Tape diagram with 2 parts'),`That’s just ${g} and ${n}. Each of the ${g} ${S.many} has ${n}.`]],{stack:true}),
      prompt:`There are ${say}. Which diagram matches?`,
      hint:`Look for one part for each of the ${S.many}, with ${n} in each part.`,
      explain:`The diagram has ${g} equal parts, one for each of the ${S.many}, and each part is ${n}.`};
  }
  /* solve the story; the drawing comes with the hint */
  return {kind:'num',unit:S.t,answer:p,
    prompt:`There are ${say}. How many ${S.t} are there?`,
    fig:show=>show?groupsFig(g,n,{label:`${g} circles with ${n} dots in each`}):tape(g,n,'?'),
    misc:miscOf(p,[[g+n,`You added. ${g} groups of ${n} is ${g} × ${n}.`],[(g+1)*n,`That’s ${g+1} groups. There are ${g} ${S.many}.`],[(g-1)*n,`That’s ${pl(g-1,'group')}. There are ${g} ${S.many}.`]]),
    hint:`${g} × ${n}: count by ${n}s ${g} times.`,
    explain:`${g} × ${n} = ${p}. Count by ${n}s: ${countBy(n,g)}.`};
}

/* ---------- Equation Shed: equations with unknowns (Lessons 13–15) ---------- */
function genEquations(){
  const k=R(0,3);
  if(k===0){
    /* find the unknown: a × ? = c, ? × b = c, or a × b = ? */
    const a=R(2,10),b=R(2,10),c=a*b,u=pick(['a','b','c']),ans=u==='a'?a:u==='b'?b:c,eq=`${u==='a'?'?':a} × ${u==='b'?'?':b} = ${u==='c'?'?':c}`;
    const misc=u==='c'?[[a+b,`That’s ${a} + ${b}. Multiply: ${a} groups of ${b}.`],[c-b,`That’s ${a-1} × ${b}. Count by ${b}s ${a} times.`],...(a<10?[[c+b,`That’s ${a+1} × ${b}. Count by ${b}s ${a} times.`]]:[])]
      :u==='a'?[[c-b,`That’s ${c} − ${b}. How many ${b}s make ${c}?`],[c+b,`That’s ${c} + ${b}. How many ${b}s make ${c}?`],[b,`${b} is the other factor. How many ${b}s make ${c}?`]]
      :[[c-a,`That’s ${c} − ${a}. ${a} groups of how many make ${c}?`],[c+a,`That’s ${c} + ${a}. ${a} groups of how many make ${c}?`],[a,`${a} is the number of groups. How many are in each?`]];
    return {kind:'num',unit:'',answer:ans,
      prompt:`What number makes this equation true? <span class="eqn">${eq}</span>`,
      fig:u==='b'?(show=>tape(a,show?b:'?',c,`Tape diagram: ${a} equal parts making ${c}`)):(show=>hopLine(b,c+b,show?a:0,{mark:u==='a'?c:null,nums:show?Infinity:1,label:u==='a'?`Number line counting by ${b}s, pointing at ${c}`:`Number line counting by ${b}s`})),
      misc:miscOf(ans,misc),
      hint:u==='b'?`${a} equal parts make ${c}. What goes in each part?`:u==='a'?`Count by ${b}s to ${c}. How many hops?`:`Count by ${b}s, ${a} times.`,
      explain:`${a} × ${b} = ${c}, so the unknown is ${ans}.`};
  }
  const u=pick(['p','n','g']),{S,g,n,p}=story(k===2||u!=='p'),name=pick(KIDS);
  if(k===1){
    /* which equation matches a story with an unknown */
    if(u==='p')return {...mcOf([[`${g} × ${n} = ?`,null],[`${g} + ${n} = ?`,`That adds. ${g} ${S.many} are ${g} groups of ${n}.`],[`${g} × ? = ${n}`,`${n} is how many ${S.each}. The unknown is the total.`]]),
      prompt:`There are ${g} ${S.many} with ${n} ${S.t} ${S.each}. How many ${S.t} are there? Which equation matches?`,
      fig:show=>groupsFig(g,n,{label:`${g} circles with ${n} dots in each`}),
      hint:'Which number is the groups, which is how many in each, and which one is unknown?',
      explain:`${g} groups of ${n}, and the total is unknown: ${g} × ${n} = ?. The unknown is ${p}.`};
    if(u==='n')return {...mcOf([[`${g} × ? = ${p}`,null],[`${p} × ${g} = ?`,`${p} is the total. It goes by itself on one side.`],[`${g} + ? = ${p}`,`That adds. ${g} equal groups make ${p}.`]]),
      prompt:`${name} puts ${p} ${S.t} into ${g} ${S.many}, the same number ${S.each}. How many go ${S.each}? Which equation matches?`,
      fig:show=>tape(g,show?n:'?',p,`Tape diagram: ${g} equal parts making ${p}`),
      hint:'Which number is the groups, which is the total, and which one is unknown?',
      explain:`${g} groups of an unknown number make ${p}: ${g} × ? = ${p}. The unknown is ${n}.`};
    return {...mcOf([[`? × ${n} = ${p}`,null],[`${p} × ${n} = ?`,`${p} is the total. The unknown is how many ${S.many}.`],[`${n} + ? = ${p}`,`That adds. Equal groups of ${n} make ${p}.`]]),
      prompt:`${name} puts ${p} ${S.t} into ${S.many}, with ${n} ${S.each}. How many ${S.many} does ${name} fill? Which equation matches?`,
      fig:show=>hopLine(n,p+n,show?g:0,{mark:p,nums:show?Infinity:1,label:`Number line counting by ${n}s, pointing at ${p}`}),
      hint:'Which number is how many in each, which is the total, and which one is unknown?',
      explain:`An unknown number of groups of ${n} make ${p}: ? × ${n} = ${p}. The unknown is ${g}.`};
  }
  /* a story with an unknown number of groups or an unknown group size */
  const bags=Math.random()<.5;
  if(bags)return {kind:'num',unit:S.many,answer:g,
    prompt:`${name} has ${p} ${S.t} and puts ${n} ${S.each}. How many ${S.many} does ${name} fill?`,
    fig:show=>hopLine(n,p+n,show?g:0,{mark:p,nums:show?Infinity:1,label:`Number line counting by ${n}s, pointing at ${p}`}),
    misc:miscOf(g,[[p-n,`That’s ${p} − ${n}. How many ${n}s make ${p}?`],[p+n,`That’s ${p} + ${n}. How many ${n}s make ${p}?`],[n,`That’s the ${S.t} ${S.each}.`]]),
    hint:`? × ${n} = ${p}. Count by ${n}s to ${p}, and count how many times.`,
    explain:`Count by ${n}s: ${countBy(n,g)}. That’s ${g} ${S.many}, because ${g} × ${n} = ${p}.`};
  return {kind:'num',unit:S.t,answer:n,
    prompt:`${name} puts ${p} ${S.t} into ${g} ${S.many}, the same number ${S.each}. How many ${S.t} go ${S.each}?`,
    fig:show=>tape(g,show?n:'?',p,`Tape diagram: ${g} equal parts making ${p}`),
    misc:miscOf(n,[[p-g,`That’s ${p} − ${g}. ${g} groups of how many make ${p}?`],[p+g,`That’s ${p} + ${g}. ${g} groups of how many make ${p}?`],[g,`That’s the number of ${S.many}.`]]),
    hint:`${g} × ? = ${p}. Try numbers until ${g} groups make ${p}.`,
    explain:`${g} × ${n} = ${p}, so ${n} ${S.t} go ${S.each}.`};
}

/* ---------- Tree Rows: arrays (Lessons 16–19) ---------- */
/* array stories: what's in rows, the rows and columns that make sense, and the unit */
const ARRAYS=[
  {say:(r,c)=>`An orchard has ${r} rows of apple trees, with ${c} trees in each row.`,r:[3,8],c:[4,10],u:'trees'},
  {say:(r,c)=>`The market has ${r} rows of chairs, with ${c} chairs in each row.`,r:[2,8],c:[4,10],u:'chairs'},
  {say:(r,c)=>`A garden has ${r} rows of plants, with ${c} plants in each row.`,r:[2,6],c:[3,10],u:'plants'},
  {say:(r,c)=>`A sheet of stamps has ${r} rows, with ${c} stamps in each row.`,r:[2,5],c:[4,10],u:'stamps'},
  {say:(r,c)=>`A muffin pan has ${r} rows, with ${c} muffins in each row.`,fix:[[2,6],[3,4],[4,6]],u:'muffins'},
  {say:(r,c)=>`An egg carton has ${r} rows, with ${c} eggs in each row.`,fix:[[2,6]],u:'eggs'},
  {say:(r,c)=>`A window has ${r} rows of glass panes, with ${c} panes in each row.`,r:[2,4],c:[2,4],u:'panes'}
];
function arrayStory(){
  const A=pick(ARRAYS);let r,c;
  if(A.fix)[r,c]=pick(A.fix);else{r=R(...A.r);c=R(...A.c);}
  return {A,r,c,p:r*c};
}
function genArrays(){
  const k=R(0,3);
  if(k===0){
    /* count an array */
    const r=R(2,5),c=R(3,10),p=r*c;
    return {kind:'num',unit:'trees',answer:p,
      prompt:`The apple trees are planted in an array. How many trees are there?`,
      fig:show=>arrayFig(r,c,{band:show?'r':null,label:`An array: ${r} rows with ${c} in each row`}),
      misc:miscOf(p,[[r+c,`You added the rows and the columns. ${r} rows of ${c} is ${r} × ${c}.`],[r,'That’s the number of rows.'],[c,'That’s how many are in one row.'],[(r-1)*c,`That’s ${pl(r-1,'row')}. Count the rows again.`]]),
      hint:`Count the rows, and how many are in each row. Then count by ${c}s.`,
      explain:`${pl(r,'row')} of ${c}: ${countBy(c,r)}. ${r} × ${c} = ${p}.`};
  }
  if(k===1){
    /* which expression matches the array */
    const r=R(2,5),o=r>2?r-1:r+1;let c;do{c=R(3,10);}while(c===r);
    return {...mcOf([[`${r} × ${c}`,null],[`${r} + ${c}`,`That adds a row and a column. There are ${r} rows of ${c}.`],[addends(o,c),`That’s ${pl(o,'row')} of ${c}. Count the rows again.`]]),
      prompt:'Which expression matches this array?',
      fig:show=>arrayFig(r,c,{band:show?'r':null,label:`An array: ${r} rows with ${c} in each row`}),
      hint:'Count the rows first, then how many are in each row.',
      explain:`${pl(r,'row')} with ${c} in each row: ${r} × ${c}. That’s ${addends(r,c)} = ${r*c}.`};
  }
  if(k===2){
    /* an array story; the array comes with the hint */
    const {A,r,c,p}=arrayStory();
    return {kind:'num',unit:A.u,answer:p,
      prompt:`${A.say(r,c)} How many ${A.u} are there?`,
      fig:show=>arrayFig(r,c,show?{band:'r',k:r,sum:true}:{}),
      misc:miscOf(p,[[r+c,`You added ${r} + ${c}. Multiply: ${r} rows of ${c}.`],[(r-1)*c,`That’s only ${pl(r-1,'row')}.`],[(r+1)*c,`That’s ${r+1} rows.`]]),
      hint:`${r} rows of ${c}: count by ${c}s ${r} times.`,
      explain:`${r} × ${c} = ${p}. Count by ${c}s: ${countBy(c,r)}.`};
  }
  /* which array shows r × c: r rows of c */
  const r=R(2,4),c=R(3,6),opts=[[r,c,null],[r,c+1,`That’s ${r} rows of ${c+1}.`],[r+1,c,`That’s ${r+1} rows of ${c}.`]];
  return {...mcOf(opts.map(([a,b,m])=>[arrayFig(a,b),m]),{stack:true}),
    prompt:`Which array shows ${r} × ${c}: ${r} rows with ${c} in each row?`,
    hint:'Count the rows first, then how many are in each row.',
    explain:`${r} rows with ${c} in each row is ${r} × ${c} = ${r*c}.`};
}

/* ---------- Flip Field: the commutative property (Lesson 20) ---------- */
function genFlip(){
  const k=R(0,3);let a=R(2,10),b;do{b=R(2,10);}while(b===a);const p=a*b,name=pick(KIDS);
  if(k===0){
    /* a × b = b × ? */
    return {kind:'num',unit:'',answer:a,
      prompt:`What number makes this equation true? <span class="eqn">${a} × ${b} = ${b} × ?</span>`,
      fig:show=>arrayFig(show?b:a,show?a:b),
      misc:miscOf(a,[[b,`${b} is already there. Turn the factors around: ${a} × ${b} = ${b} × ${a}.`],[p,`${p} is the product. The ? is a factor.`]]),
      hint:'Turning an array doesn’t change how many are in it. The same two factors are on both sides.',
      explain:`You can multiply in any order: ${a} × ${b} = ${b} × ${a}. Both are ${p}.`};
  }
  if(k===1){
    /* which equation is also true */
    const w1=[`${b} × ${a} = ${a+b}`,`${b} + ${a} = ${a+b}, but ${b} × ${a} is ${b} groups of ${a}.`],
      w2=a<10?[`${b} × ${a} = ${b*(a+1)}`,`That’s ${b} × ${a+1}. Turning the factors around doesn’t change the product.`]:[`${b} × ${a} = ${b*(a-1)}`,`That’s ${b} × ${a-1}. Turning the factors around doesn’t change the product.`];
    return {...mcOf([[`${b} × ${a} = ${p}`,null],w1,w2]),
      prompt:`${name} knows ${a} × ${b} = ${p}. Which equation is also true?`,
      hint:'Turn the factors around. Does the product change?',
      explain:`You can multiply in any order, so ${b} × ${a} = ${a} × ${b} = ${p}.`};
  }
  if(k===2){
    /* a fact you know: the turnaround */
    return {kind:'num',unit:'',answer:p,
      prompt:`${name} knows ${a} × ${b} = ${p}. What is ${b} × ${a}?`,
      fig:show=>hopLine(b,p+Math.max(a,b),show?a:0,{nums:show?Infinity:1}),
      misc:miscOf(p,[[a+b,`That’s ${b} + ${a}. Multiply: ${b} groups of ${a}.`],[p-a,`That’s ${b-1} × ${a}. Turning the factors around doesn’t change the product.`]]),
      hint:`${b} × ${a} is the turnaround of ${a} × ${b}.`,
      explain:`${b} × ${a} = ${a} × ${b}, so it’s ${p} too.`};
  }
  /* which array has the same number of counters: the one turned */
  const r=R(2,4),c=R(r+1,6);
  return {...mcOf([[arrayFig(c,r),null],[arrayFig(c,r+1),`That’s ${c} rows of ${r+1}: ${c} × ${r+1} = ${c*(r+1)}.`],[arrayFig(c-1,r),`That’s ${pl(c-1,'row')} of ${r}: ${(c-1)} × ${r} = ${(c-1)*r}.`]],{stack:true}),
    prompt:`This array has ${r} rows of ${c}. Which array is the same one turned, with the same number of counters?`,
    fig:show=>arrayFig(r,c),
    hint:'Turn the array a quarter turn: the rows become the columns.',
    explain:`Turned, ${r} rows of ${c} become ${c} rows of ${r}. ${r} × ${c} = ${c} × ${r} = ${r*c}.`};
}

const genBoss=()=>pick([genPics,genBars,genGroups,genEquations,genArrays,genFlip])();

const ZONES=[
  {id:'pics',name:'Picture Barn',lessons:'Lessons 1–4',blurb:'Read picture graphs where each picture shows 2, 5, or 10, and find how many pictures to draw.',gen:genPics},
  {id:'bars',name:'Bar Silo',lessons:'Lessons 5–8',blurb:'Read bars that end between the lines, find how many more or in all, and pick a good scale.',gen:genBars},
  {id:'groups',name:'Basket Row',lessons:'Lessons 9–12',blurb:'Count equal groups, and match stories to expressions and diagrams.',gen:genGroups},
  {id:'equations',name:'Equation Shed',lessons:'Lessons 13–15',blurb:'Find the unknown number in an equation, and pick the equation for a story.',gen:genEquations},
  {id:'arrays',name:'Tree Rows',lessons:'Lessons 16–19',blurb:'Count trees planted in arrays, and match arrays to expressions and stories.',gen:genArrays},
  {id:'flip',name:'Flip Field',lessons:'Lesson 20',blurb:'Turn arrays and factors around: 3 × 5 = 5 × 3.',gen:genFlip},
  {id:'boss',name:'Harvest Festival',lessons:'All lessons',blurb:'Fill the harvest basket! Every right answer adds one of its 10 apples.',gen:genBoss},
];

/* the harvest basket: 10 apples, `lit` of them picked (the boss icon draws all of them) */
const basket=lit=>'<path d="M14,30Q32,2 50,30" fill="none" stroke="#c98a4b" stroke-width="3"/>'
  +[[20,24],[29,22],[38,22],[46,25],[16,32],[25,31],[34,30],[43,31],[21,38],[40,38]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="5" fill="${i<lit?'#ff7b7b':'rgba(255,255,255,.12)'}" stroke="#0a2340" stroke-width="1"/>`).join('')
  +'<path d="M6,32H58L52,60H12Z" fill="#c98a4b" stroke="#0a2340" stroke-width="1.5"/><path d="M9,41H55M11,50H53" stroke="#8a5a2b" stroke-width="2"/>';
const ICON={
  pics:'<path d="M6,26L32,8L58,26V58H6Z" fill="#b5483f" stroke="#0a2340" stroke-width="1.5"/><rect x="14" y="30" width="36" height="24" fill="#0a2340"/><g stroke="#0a2340" stroke-width="1"><rect x="17" y="33" width="8" height="8" rx="1.5" fill="#ff7b7b"/><rect x="27" y="33" width="8" height="8" rx="1.5" fill="#ff7b7b"/><rect x="37" y="33" width="4" height="8" fill="#ff7b7b"/><rect x="17" y="44" width="8" height="8" rx="1.5" fill="#5fe0a8"/></g>',
  bars:'<rect x="12" y="10" width="40" height="48" rx="20" fill="#a9c4e4" stroke="#0a2340" stroke-width="1.5"/><rect x="18" y="26" width="28" height="28" fill="#0a2340"/><rect x="21" y="40" width="6" height="14" fill="#ff7b7b"/><rect x="29" y="30" width="6" height="24" fill="#6fa8ff"/><rect x="37" y="36" width="6" height="18" fill="#5fe0a8"/>',
  groups:'<g fill="#c98a4b" stroke="#0a2340" stroke-width="1.5"><path d="M4,40H28L25,56H7Z"/><path d="M36,40H60L57,56H39Z"/></g><g fill="#ff7b7b" stroke="#0a2340" stroke-width="1"><circle cx="11" cy="35" r="5"/><circle cx="21" cy="35" r="5"/><circle cx="16" cy="27" r="5"/><circle cx="43" cy="35" r="5"/><circle cx="53" cy="35" r="5"/><circle cx="48" cy="27" r="5"/></g>',
  equations:'<path d="M8,24L32,8L56,24V58H8Z" fill="#7fb0e6" stroke="#0a2340" stroke-width="1.5"/><rect x="14" y="30" width="36" height="20" rx="3" fill="#0a2340"/><text x="32" y="45" fill="#ffc93c" font-size="13" font-weight="700" text-anchor="middle" font-family="monospace">4×?</text>',
  arrays:'<g>'+range(9).map(i=>{const x=12+i%3*20,y=14+Math.floor(i/3)*18;return `<rect x="${x-1.5}" y="${y+4}" width="3" height="7" fill="#8a5a2b"/><circle cx="${x}" cy="${y}" r="7" fill="#5fe0a8" stroke="#0a2340" stroke-width="1"/>`;}).join('')+'</g>',
  flip:'<g fill="#ffc93c">'+range(6).map(i=>`<circle cx="${8+i%3*9}" cy="${26+Math.floor(i/3)*9}" r="3.5"/>`).join('')+'</g><g fill="#7fe3ff">'+range(6).map(i=>`<circle cx="${46+i%2*9}" cy="${20+Math.floor(i/2)*9}" r="3.5"/>`).join('')+'</g><path d="M28,14Q34,4 42,12" fill="none" stroke="#f3f6fb" stroke-width="2.5"/><path d="M42,12l-6,0M42,12l-1,-6" stroke="#f3f6fb" stroke-width="2.5"/><text x="32" y="58" fill="#f3f6fb" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">2×3=3×2</text>',
  boss:basket(10),
};
