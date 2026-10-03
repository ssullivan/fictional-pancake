/* Factor Factory (Grade 4 Unit 1): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Factors, number lines with hops, tiles, number charts, and lockers come from shared/k5.js; mcOf and miscOf from shared/util.js. */
const KIDS=['Mai','Diego','Lin','Han','Priya','Kiran','Elena','Jada','Noah','Clare','Andre','Tyler'];
const cap=s=>s[0].toUpperCase()+s.slice(1);
const list=a=>a.join(', ');
const nth=k=>k+(k===1?'st':k===2?'nd':k===3?'rd':'th');
const upTo=n=>range(n).map(i=>i+1);
const PRIMES=upTo(100).filter(isPrime);
/* n as its smallest factor pair other than 1 × n: split(21) is "3 × 7" */
const split=n=>{const a=factors(n)[1];return `${a} × ${n/a}`;};
/* "7 packs is 56 and 8 packs is 64" for a number w between two multiples of n */
const between=(w,n,one,many)=>{const k=Math.floor(w/n);return `${k} ${k===1?one:many} ${k===1?'is':'are'} ${k*n} and ${k+1} ${many} are ${(k+1)*n}. ${w} is in between.`;};
const plural=w=>w==='box'?'boxes':w+'s';

/* ---------- Hop Belt: multiples (Lesson 1) ---------- */
/* things sold in packs, for "which number can you buy with whole packs?" */
const PACKS=[['tennis balls','can',3],['batteries','pack',4],['cupcakes','box',4],['granola bars','box',5],['juice boxes','pack',6],['eggs','carton',6],['yogurt cups','pack',6],['crayons','box',8],['hot dogs','pack',8],['stickers','sheet',9]];
function genHops(){
  const k=R(0,3),name=pick(KIDS);
  if(k===0){
    /* where the hops land: a hop-bot, or counting by n */
    const n=R(2,9),j=R(4,Math.min(10,Math.floor(90/n))),m=n*j,count=Math.random()<.5;
    return {kind:'num',unit:'',answer:m,
      prompt:count?`${name} counts by ${n}s: ${n}, ${2*n}, ${3*n}, … What is the ${nth(j)} number ${name} says?`:`The hop-bot starts at 0 and hops by ${n}s. Where does it land after ${j} hops?`,
      fig:show=>hopLine(n,n*(j+2),j,{nums:show?Infinity:count?3:1,label:`Number line with ${j} hops of ${n} from 0`}),
      misc:miscOf(m,[[m+n,`That’s ${j+1} hops. Count the hops again.`],[m-n,`That’s only ${j-1} hops. Count them again.`],[n+j,`You added ${n} + ${j}. ${j} hops of ${n} is ${j} × ${n}.`]]),
      hint:`Each hop is ${n}. Keep counting by ${n}s until you have ${j} numbers, or multiply ${j} × ${n}.`,
      explain:`${upTo(j).map(i=>i*n).join(', ')}. The ${nth(j)} multiple of ${n} is ${j} × ${n} = ${m}.`};
  }
  if(k===1){
    /* which amount is a whole number of packs, up to 10 packs? One wrong choice ends in the pack size's digit, like 16 for packs of 6. */
    const [it,unit,n]=pick(PACKS),top=10*n,j=R(3,10),m=n*j,not=v=>v>n&&v<top&&v%n!==0;
    const look=range(9).map(t=>10*t+n).filter(v=>not(v)&&v!==m),w1=look.length?pick(look):0;
    const other=(...no)=>{let w;do{w=n*R(2,9)+R(1,n-1);}while(!not(w)||no.includes(w));return w;},w2=other(w1,m);
    const opts=w1?[w1,w2]:[w2,other(w2,m)];
    return {...mcOf([[String(m),null],...opts.map(w=>[String(w),(w===w1?`It ends in ${n}, but that doesn’t matter. `:'')+between(w,n,unit,plural(unit))])]),
      prompt:`${cap(it)} come in ${plural(unit)} of ${n}. Which number of ${it} can ${name} buy with whole ${plural(unit)}?`,
      hint:`Count by ${n}s: ${n}, ${2*n}, ${3*n}, … Which number do you land on?`,
      explain:`${j} × ${n} = ${m}, so ${j} ${plural(unit)} is ${m} ${it}. ${m} is a multiple of ${n}.`};
  }
  if(k===2){
    /* only multiples of n: one list has a number that is off by a little, one is multiples of a nearby number */
    const n=R(3,9),s=R(1,Math.floor(90/n)-4),L=range(4).map(i=>(s+i)*n);
    const off=L.slice();let at=R(1,3);off[at]+=pick([-2,-1,1,2]);if(off[at]%n===0)off[at]+=1;
    const o=pick([n-1,n+1].filter(v=>v>=2)),os=Math.max(1,Math.round(L[0]/o)),L2=range(4).map(i=>(os+i)*o);
    const stray=L2.filter(v=>v%n);
    return {...mcOf([[list(L),null],[list(off),`${off[at]} is not a multiple of ${n}. `+between(off[at],n,`hop of ${n}`,`hops of ${n}`)],
      [list(L2),`${list(stray)} ${stray.length>1?'aren’t multiples':'isn’t a multiple'} of ${n}. Those are multiples of ${o}.`]],{stack:true}),
      prompt:`Which list has only multiples of ${n}?`,
      hint:`A multiple of ${n} is ${n} times a whole number. Check each number: does counting by ${n}s land on it?`,
      explain:L.map(v=>`${v/n} × ${n} = ${v}`).join(', ')+'.'};
  }
  /* how many hops to land on m */
  const n=R(3,9),j=R(4,Math.min(10,Math.floor(90/n))),m=n*j;
  return {kind:'num',unit:'hops',answer:j,prompt:`The hop-bot starts at 0 and hops by ${n}s. How many hops does it take to land on ${m}?`,
    fig:show=>hopLine(n,n*(j+1),show?j:1,{mark:m,nums:show?Infinity:1,label:`Number line counting by ${n}s, pointing at ${m}`}),
    misc:miscOf(j,[[j+1,`${j+1} hops of ${n} is ${(j+1)*n}. That goes past ${m}.`],[j-1,`${j-1} hops of ${n} is only ${(j-1)*n}.`],[m-n,`That’s where the hop before ${m} lands. How many hops is it?`]]),
    hint:`Count by ${n}s to ${m} and count the hops. Or think: what times ${n} is ${m}?`,
    explain:`${j} × ${n} = ${m}, so it takes ${j} hops. ${m} is a multiple of ${n}.`};
}

/* ---------- Tile Press: factor pairs (Lesson 2) ---------- */
/* r rows of c tiles. Before the hint: one column and a box for the rest of each row. */
function pressFig(r,c,show,label){
  if(show)return tiles(r,r*c,label);
  const s=Math.min(28,280/r),W=5*s;
  const o=range(r).map(i=>`<rect class="ftile" x="4" y="${4+i*s}" width="${s}" height="${s}"/>`).join('')
    +`<rect class="guide" x="${4+s+4}" y="4" width="${W}" height="${r*s}" rx="4"/><text class="lbl big gd" x="${8+s+W/2}" y="${4+r*s/2}">?</text>`;
  return svgWrap(12+s+W,8+r*s,o,label);
}
/* things set out in equal rows, and the most there would be */
const ROWS=[
  [(n,r,who)=>`${who} sets up ${n} chairs in ${r} equal rows for a show. How many chairs are in each row?`,'chairs',60],
  [(n,r)=>`A gardener plants ${n} tomato plants in ${r} equal rows. How many plants are in each row?`,'plants',48],
  [(n,r,who)=>`${who} hangs ${n} photos on a wall in ${r} equal rows. How many photos are in each row?`,'photos',40],
  [(n,r)=>`The Tile Press makes a rectangle from ${n} tiles in ${r} rows. How many tiles are in each row?`,'tiles',100],
];
/* composite numbers with at least two factor pairs besides 1 × n */
const RICH=upTo(100).filter(n=>n>=12&&pairsOf(n).length>=3);
function genTiles(){
  const k=R(0,4),name=pick(KIDS);
  if(k===0){
    const [say,unit,max]=pick(ROWS);let r,c;do{r=R(2,9);c=R(2,10);}while(r*c>max||r*c<12);const n=r*c;
    return {kind:'num',unit,answer:c,prompt:say(n,r,name),fig:show=>pressFig(r,c,show,`${n} ${unit} in ${r} equal rows`),
      misc:miscOf(c,[[n-r,`You subtracted. Equal rows means ${r} × ? = ${n}.`],[n+r,`You added. Equal rows means ${r} × ? = ${n}.`],[n*r,`That’s ${n} × ${r}. Find the number that goes with ${r} to make ${n}.`]]),
      hint:`Think: ${r} × ? = ${n}.`,
      explain:`${r} × ${c} = ${n}, so there are ${c} in each row. ${r} and ${c} are a factor pair of ${n}.`};
  }
  if(k===1){
    /* a factor pair of n; the wrong pairs multiply to a number close to n */
    const n=pick(RICH),P=pairsOf(n).filter(([a])=>a>1),[a,b]=pick(P);
    const near=shuffle(range(11).flatMap(i=>range(11).map(j=>[i+2,j+2]))).filter(([x,y])=>x<=y&&x*y!==n&&Math.abs(x*y-n)<=Math.max(4,n/8));
    const wrong=[];near.forEach(q=>{if(wrong.length<2&&!wrong.some(w=>w[0]*w[1]===q[0]*q[1]))wrong.push(q);});
    return {...mcOf([[`${a} × ${b}`,null],...wrong.map(([x,y])=>[`${x} × ${y}`,`${x} × ${y} = ${x*y}, not ${n}.`])]),
      prompt:`Which is a factor pair of ${n}?`,
      hint:'Multiply each pair. Which one makes '+n+'?',
      explain:`${a} × ${b} = ${n}, so ${a} and ${b} are a factor pair of ${n}.`};
  }
  if(k===2){
    /* all the factor pairs: one list misses a pair, one has a pair that doesn't work */
    const n=pick(RICH.filter(v=>v<=48)),P=pairsOf(n),show=P.map(([a,b])=>`${a} × ${b}`);
    const miss=P.length-1,short=show.filter((q,i)=>i!==miss),[ma,mb]=P[miss];
    /* a pair that multiplies to a number close to n, put in order among the others */
    const [x,y]=pick(upTo(ma+1).filter(v=>v>1).flatMap(v=>upTo(12).filter(w=>w>=v&&w*v!==n&&Math.abs(w*v-n)<=3).map(w=>[v,w]))),at=P.findIndex(([a])=>a>x),extra=show.slice();
    extra.splice(at<0?extra.length:at,0,`${x} × ${y}`);
    return {...mcOf([[list(show),null],[list(short),`${ma} × ${mb} = ${n} too.`+(ma===mb?' A square is a rectangle, so it counts.':'')],[list(extra),`${x} × ${y} = ${x*y}, not ${n}.`]],{stack:true}),
      prompt:`Which list shows all the factor pairs of ${n}?`,
      fig:show=>show?allRects(n):tiles(1,n,`${n} tiles in 1 row`),
      hint:`Try 1 row, 2 rows, 3 rows, … of ${n} tiles. Stop when the pairs start to turn around.`,
      explain:`Try 1, 2, 3, … rows: ${list(show)} work. After ${P[miss][0]}, the pairs turn around.`};
  }
  if(k===3){
    /* how many rectangles: turnarounds count once */
    const n=pick(upTo(60).filter(v=>v>=6&&pairsOf(v).length>=2)),P=pairsOf(n),nf=factors(n).length;
    return {kind:'num',unit:'rectangles',answer:P.length,
      prompt:`How many different rectangles can the Tile Press make with ${n} tiles? (A 2 × 3 and a 3 × 2 rectangle count as the same.)`,
      fig:show=>show?allRects(n):tiles(1,n,`${n} tiles in 1 row`),
      misc:miscOf(P.length,[[nf,'That’s the number of factors. Each rectangle uses a factor pair, and turnarounds count once.'],[P.length-1,`Don’t forget 1 row of ${n}. That’s a rectangle too.`],[P.length+1,'Check each pair. Did you count a turnaround twice?']]),
      hint:'Each factor pair makes one rectangle. Try 1 row, 2 rows, 3 rows, … and stop when the pairs turn around.',
      explain:`The factor pairs of ${n} are ${list(P.map(([a,b])=>`${a} × ${b}`))}. That’s ${P.length} rectangles.`};
  }
  /* the other factor in a pair: up to 10 rows of up to 12 */
  const [a,b]=pick(RICH.flatMap(n=>pairsOf(n).filter(([a])=>a>1).flatMap(([a,b])=>a===b?[[a,b]]:[[a,b],[b,a]])).filter(([a,b])=>a<=10&&b<=12)),n=a*b;
  return {kind:'num',unit:'',answer:b,prompt:`${a} and what number make a factor pair of ${n}?`,
    fig:show=>pressFig(a,b,show,`${n} tiles in ${a} rows`),
    misc:miscOf(b,[[n-a,`You subtracted. A factor pair multiplies: ${a} × ? = ${n}.`],[n+a,`You added. A factor pair multiplies: ${a} × ? = ${n}.`],[n*a,`That’s ${n} × ${a}. Find ${a} × ? = ${n}.`]]),
    hint:`Put ${n} tiles in ${a} equal rows. How many are in each row? ${a} × ? = ${n}`,
    explain:`${a} × ${b} = ${n}, so ${a} and ${b} are a factor pair of ${n}.`};
}

/* ---------- Prime Sorter: prime and composite (Lesson 3) ---------- */
/* composite numbers that look prime: odd, and not multiples of 5 */
const TRICKY=upTo(99).filter(n=>n>8&&n%2&&n%5&&!isPrime(n));
function genPrime(){
  const k=R(0,4),name=pick(KIDS);
  if(k===0){
    const p=pick(PRIMES.filter(v=>v>10)),C=shuffle(TRICKY.filter(v=>Math.abs(v-p)<=24)).slice(0,2);
    return {...mcOf([[String(p),null],...C.map(c=>[String(c),`${split(c)} = ${c}, so ${c} has more than one factor pair. It’s composite.`])]),
      prompt:'Which number is prime?',
      hint:'Try to split each number into a factor pair besides 1 × itself. Does 3 go into it? 7?',
      explain:`${p}’s only factor pair is 1 × ${p}, so ${p} is prime.`+(C.length?` ${C.map(c=>`${c} = ${split(c)}`).join(' and ')}.`:'')};
  }
  if(k===1){
    const c=Math.random()<.7?pick(TRICKY):pick(upTo(98).filter(v=>v>10&&v%2===0)),P=shuffle(PRIMES.filter(v=>v>2&&Math.abs(v-c)<=20)).slice(0,2);
    return {...mcOf([[String(c),null],...P.map(p=>[String(p),`${p}’s only factor pair is 1 × ${p}. It’s prime.`])]),
      prompt:'Which number is composite?',
      hint:'A composite number has a factor pair besides 1 × itself. Try 2, 3, 5, and 7.',
      explain:`${split(c)} = ${c}, so ${c} has more than one factor pair. It’s composite.`};
  }
  if(k===2){
    /* prime, composite, or neither (the number 1) */
    const n=Math.random()<.1?1:Math.random()<.1?2:R(3,40),P=pairsOf(n),kind=n===1?'n':P.length===1?'p':'c';
    const W={
      p:n===1?'A prime number has exactly two factors: 1 and itself. 1 has only one factor.':`${split(n)} = ${n} too, so ${n} has more than one factor pair.`,
      c:n===1?'1 has only one factor, 1. A composite number has more than two.':`The only factor pair of ${n} is 1 × ${n}. There is no other, so it’s not composite.`,
      n:`Only the number 1 is neither. ${n} is bigger than 1, so it’s prime or composite.`};
    return {kind:'mc',choices:[{id:'p',label:'Prime'},{id:'c',label:'Composite'},{id:'n',label:'Neither'}],answer:kind,
      why:Object.fromEntries(['p','c','n'].filter(q=>q!==kind).map(q=>[q,W[q]])),
      prompt:`Is ${n} prime, composite, or neither?`,
      fig:show=>show?allRects(n):tiles(1,n,`${n} tile${n>1?'s':''} in 1 row`),
      hint:n===1?'How many factors does 1 have?':`${n} tiles make a rectangle 1 row long. Can they make any other rectangle?`,
      explain:n===1?'1’s only factor is 1, so it is neither prime nor composite.'
        :kind==='p'?`${n}’s only factor pair is 1 × ${n}, so ${n} is prime.`+(n===2?' 2 is the only even prime.':'')
        :`${n} has the factor pairs ${list(P.map(([a,b])=>`${a} × ${b}`))}. More than one pair means ${n} is composite.`};
  }
  if(k===3){
    /* how many primes in a row of ten */
    const lo=10*R(0,9)+1,hi=lo+9,row=range(10).map(i=>lo+i),pr=row.filter(isPrime),n=pr.length,odd=row.find(v=>v>1&&v%2&&!isPrime(v));
    return {kind:'num',unit:'primes',answer:n,prompt:`How many prime numbers are there from ${lo} to ${hi}?`,
      fig:show=>chart(hi,v=>show&&isPrime(v)?'a':'',{lo,label:`Numbers ${lo} to ${hi}`+(show?`. Prime: ${list(pr)}`:'')}),
      misc:miscOf(n,[[5,`There are 5 odd numbers, but not all odd numbers are prime: ${odd} = ${split(odd)}.`],...(lo===1?[[n+1,'1 is not prime. Its only factor is 1.'],[n-1,'2 is prime too. It’s the only even prime.']]:[])]),
      hint:lo===1?'1 is not prime, and 2 is the only even prime. Check the odd numbers.':'Even numbers here are composite: 2 is a factor. Check each odd number for a factor pair.',
      explain:`The primes from ${lo} to ${hi} are ${list(pr)}. That’s ${n}.`};
  }
  /* "it's odd, so it's prime" */
  const c=pick(TRICKY),a=factors(c)[1];
  return {...mcOf([[`No. ${split(c)} = ${c}, so ${c} is composite.`,null],['Yes. Odd numbers are always prime.',`9 is odd, and 3 × 3 = 9. Odd numbers can be composite. Try ${a} for ${c}.`],
    [`No. ${c} is odd, so it’s neither prime nor composite.`,'Only the number 1 is neither. Every other whole number is prime or composite.']],{stack:true}),
    prompt:`${name} says ${c} is prime because it is odd. Is ${name} right?`,
    fig:show=>show?allRects(c):tiles(1,c,`${c} tiles in 1 row`),
    hint:`Try to split ${c} into a factor pair besides 1 × ${c}. Does ${a} go into it?`,
    explain:`${split(c)} = ${c}. ${c} has more than one factor pair, so it is composite, even though it is odd.`};
}

/* ---------- Locker Room: common multiples and the Locker Problem (Lessons 5–6) ---------- */
/* when two things happen every a and every b: the story, its unit, the times allowed, and the largest answer */
const TOGETHER=[
  {say:(a,b)=>`The red bus leaves every ${a} minutes. The blue bus leaves every ${b} minutes. Both buses leave at 8:00. In how many minutes do they leave together again?`,unit:'minutes',t:[4,5,6,8,10,12,15,20],max:60},
  {say:(a,b)=>`A green light on the factory wall blinks every ${a} seconds. A red light blinks every ${b} seconds. They just blinked together. In how many seconds do they blink together again?`,unit:'seconds',t:[2,3,4,5,6,8,9,10,12],max:60},
  {say:(a,b)=>`On the belt, one robot stamps every ${a}th box. Another paints every ${b}th box. Which box is the first to be stamped and painted?`,unit:'',t:[4,5,6,7,8,9,10,12],max:60,box:true},
  {say:(a,b,who)=>`Hot dogs come in packs of ${a}. Buns come in packs of ${b}. ${who} wants the same number of hot dogs and buns. What is the smallest number of each ${who} can buy?`,unit:'of each',t:[],hot:[[8,6],[8,12],[10,6],[10,8],[10,12]],max:60},
];
/* two numbers from t with a first common multiple that isn't just the bigger one, up to max */
function twoOf(t,max){let a,b;do{[a,b]=shuffle(t).slice(0,2);}while(b%a===0||a%b===0||lcm(a,b)>max);return [a,b];}
const bothLines=(a,b,show)=>{const L=lcm(a,b),M=L+Math.max(a,b);return hopLine(a,M,show?M/a|0:2,{cls:'r',nums:show?Infinity:2,label:`Hops of ${a}`})+hopLine(b,M,show?M/b|0:2,{cls:'b',nums:show?Infinity:2,label:`Hops of ${b}`});};
const open20=()=>Object.fromEntries(upTo(20).filter(v=>Math.sqrt(v)%1===0).map(v=>[v,true]));
function genLockers(){
  const k=R(0,5),name=pick(KIDS);
  if(k===0){
    const T=pick(TOGETHER),[a,b]=T.hot?pick(T.hot):twoOf(T.t,T.max),L=lcm(a,b);
    return {kind:'num',unit:T.unit,answer:L,prompt:T.say(a,b,name),fig:show=>bothLines(a,b,show),
      misc:miscOf(L,[...(a*b!==L?[[a*b,`${a} × ${b} = ${a*b} is a common multiple, but not the first one. Look for a smaller one.`]]:[]),[a+b,`You added ${a} + ${b}. Find a number that is a multiple of ${a} and of ${b}.`],[Math.max(a,b),`${Math.max(a,b)} is not a multiple of ${Math.min(a,b)}.`]]),
      hint:`List the multiples of ${a} and of ${b}. What is the first number on both lists?`,
      explain:`${a}: ${upTo(L/a).map(i=>i*a).join(', ')}. ${b}: ${upTo(L/b).map(i=>i*b).join(', ')}. ${L} is the first common multiple of ${a} and ${b}.`};
  }
  if(k===1){
    /* a common multiple, a multiple of a only, and a multiple of b only */
    /* within the times tables: each number is at most 12 times a or b */
    const [a,b]=twoOf([2,3,4,5,6,8,9,10],50),L=lcm(a,b),cm=L*R(1,Math.max(1,Math.floor(12*Math.min(a,b)/L)));
    const only=(x,y)=>{let v;do{v=x*R(2,Math.min(12,Math.floor(100/x)));}while(v%y===0);return v;};
    const va=only(a,b);let vb;do{vb=only(b,a);}while(vb===va);
    return {...mcOf([[String(cm),null],[String(va),`${va} is a multiple of ${a}, but not of ${b}.`],[String(vb),`${vb} is a multiple of ${b}, but not of ${a}.`]]),
      prompt:`Which number is a common multiple of ${a} and ${b}?`,
      hint:`A common multiple is on both lists: counting by ${a}s and counting by ${b}s.`,
      explain:`${cm/a} × ${a} = ${cm} and ${cm/b} × ${b} = ${cm}, so ${cm} is a multiple of both.`};
  }
  if(k===2){
    /* tap the first common multiple on a number chart */
    const [a,b]=twoOf([2,3,4,5,6,8,9,10],60),L=lcm(a,b),max=Math.max(20,10*Math.ceil((L+1)/10));
    const why=Object.fromEntries(upTo(max).filter(v=>v!==L).map(v=>[String(v),
      v%a===0&&v%b===0?`${v} is a common multiple, but not the first one.`:v%a===0?`${v} is a multiple of ${a}, but not of ${b}.`:v%b===0?`${v} is a multiple of ${b}, but not of ${a}.`:`${v} is not a multiple of ${a} or ${b}.`]));
    return {kind:'tap',answer:String(L),why,prompt:`Tap the first number that is a multiple of both ${a} and ${b}.`,
      fig:show=>chart(max,v=>show?(v%a===0&&v%b===0?'ab':v%a===0?'a':v%b===0?'b':''):'',{tap:'cand',label:`Numbers 1 to ${max}`}),
      hint:`Gold squares are multiples of ${a}. Blue squares are multiples of ${b}. Green squares are both.`,
      explain:`${a}: ${upTo(L/a).map(i=>i*a).join(', ')}. ${b}: ${upTo(L/b).map(i=>i*b).join(', ')}. ${L} is the first common multiple.`};
  }
  const intro='20 lockers start closed. Student 1 opens every locker, student 2 changes every 2nd locker, and so on up to student 20.';
  if(k===3){
    /* which students change locker n: its factors */
    const n=pick(upTo(20).filter(v=>v>5&&!isPrime(v))),F=factors(n);
    const x=pick(upTo(9).filter(v=>v>1&&n%v)),plus=[...F,x].sort((p,q)=>p-q),minus=Math.random()<.5?F.slice(1):F.slice(0,-1);
    return {...mcOf([[`Students ${list(F)}`,null],[`Students ${list(minus)}`,minus[0]===1?`Student ${n} changes every ${nth(n)} locker, starting with locker ${n}.`:`Student 1 changes every locker, so locker ${n} too.`],
      [`Students ${list(plus)}`,`Student ${x} changes lockers ${x}, ${2*x}, ${3*x}, … and skips ${n}. ${x} is not a factor of ${n}.`]],{stack:true}),
      prompt:`${intro} Which students change locker ${n}?`,
      fig:()=>lockers({},{sel:n}),
      hint:`Student k changes the lockers that are multiples of k. Which numbers is ${n} a multiple of?`,
      explain:`Locker ${n} is changed by the students whose numbers are factors of ${n}: ${list(F)}.`};
  }
  if(k===4){
    /* how many changes, and open or closed at the end */
    const n=R(2,20),F=factors(n),c=F.length,sq=Math.sqrt(n)%1===0;
    if(Math.random()<.5)return {kind:'num',unit:'students',answer:c,prompt:`${intro} How many students change locker ${n}?`,
      fig:()=>lockers({},{sel:n}),
      misc:miscOf(c,[[c-1,`Don’t forget student 1 and student ${n}.`],...(sq?[[c+1,`${Math.sqrt(n)} × ${Math.sqrt(n)} = ${n}, but student ${Math.sqrt(n)} is only one student.`]]:[]),[pairsOf(n).length,'That’s the number of factor pairs. Each pair has two factors.']]),
      hint:`The students who change locker ${n} are the factors of ${n}. Find its factor pairs.`,
      explain:`The factors of ${n} are ${list(F)}. That’s ${c} students.`};
    const end=c%2?'Open':'Closed';
    return {kind:'mc',choices:[{id:'o',label:'Open'},{id:'c',label:'Closed'}],answer:end[0].toLowerCase(),
      why:{[c%2?'c':'o']:`Locker ${n} is changed ${c} times (by students ${list(F)}). ${c%2?'An odd':'An even'} number of changes leaves it ${end.toLowerCase()}.`},
      prompt:`${intro} When they are done, is locker ${n} open or closed?`,
      fig:(show,done)=>lockers(done?open20():{},{sel:n}),
      hint:`Count the students who change locker ${n}: the factors of ${n}. Open, closed, open, …`,
      explain:`The factors of ${n} are ${list(F)}: ${c} changes, so it ends ${end.toLowerCase()}.`+(sq?` ${Math.sqrt(n)} × ${Math.sqrt(n)} = ${n}, so ${n} has an odd number of factors.`:'')};
  }
  /* how many lockers student s changes */
  const s=R(2,9),c=Math.floor(20/s),hi=upTo(c).map(i=>i*s);
  return {kind:'num',unit:'lockers',answer:c,prompt:`${intro} How many lockers does student ${s} change?`,
    fig:show=>lockers({},{hi:show?hi:[]}),
    misc:miscOf(c,[[s,`${s} is the student’s number. Count the multiples of ${s} up to 20.`],[c+1,`${(c+1)*s} is more than 20, and there are only 20 lockers.`],[20-s,'Student '+s+' changes every '+nth(s)+' locker, not every locker after '+s+'.']]),
    hint:`Student ${s} changes lockers ${s}, ${2*s}, … Count the multiples of ${s} up to 20.`,
    explain:`Student ${s} changes lockers ${list(hi)}: ${c} lockers.`};
}

/* ---------- Gear Works: factors and multiples together (Lesson 7) ---------- */
/* equal groups with none left over: the story, what is in each group, and the most there would be */
const GROUPS=[
  [(n,who)=>`${who} packs ${n} cookies into bags, the same number in each bag, with none left over. How many cookies could go in each bag?`,'bags','bag','cookies',72],
  [n=>`${n} students split into teams of the same size, with no one left over. How many students could be on each team?`,'teams','team','students',36],
  [(n,who)=>`${who} puts ${n} books on shelves, the same number on each shelf, with none left over. How many books could go on each shelf?`,'shelves','shelf','books',60],
];
function genGears(){
  const k=R(0,4),name=pick(KIDS);
  if(k===0){
    /* factor and multiple statements, when a is a factor of b and when it isn't */
    const a=R(3,9);
    if(Math.random()<.6){
      const j=R(3,Math.min(12,Math.floor(100/a))),b=a*j;
      return {...mcOf([[`${a} is a factor of ${b}, and ${b} is a multiple of ${a}.`,null],[`${b} is a factor of ${a}.`,`${b} is bigger than ${a}, so it can’t be a factor of ${a}. Try it the other way around.`],
        [`${a} is a multiple of ${b}.`,`A multiple is the number you land on counting by ${a}s. ${j} × ${a} = ${b}, so ${b} is the multiple.`]],{stack:true}),
        prompt:`Which is true about ${a} and ${b}?`,
        fig:show=>hopLine(a,b+a,show?j:1,{mark:b,nums:show?Infinity:1,label:`Number line counting by ${a}s, pointing at ${b}`}),
        hint:`Count by ${a}s. Do you land on ${b}?`,
        explain:`${j} × ${a} = ${b}. So ${a} and ${j} are factors of ${b}, and ${b} is a multiple of ${a} and of ${j}.`};
    }
    const j=R(3,Math.min(11,Math.floor(100/a)-1)),b=a*j+R(1,a-1);
    return {...mcOf([[`${a} is not a factor of ${b}.`,null],[`${a} is a factor of ${b}.`,`${j} × ${a} = ${j*a} and ${j+1} × ${a} = ${(j+1)*a}. Counting by ${a}s skips ${b}.`],
      [`${b} is a multiple of ${a}.`,`Counting by ${a}s goes ${j*a}, ${(j+1)*a}, and skips ${b}. So ${b} is not a multiple of ${a}.`]],{stack:true}),
      prompt:`Which is true about ${a} and ${b}?`,
      fig:show=>hopLine(a,(j+1)*a,show?j+1:1,{mark:b,nums:show?Infinity:1,label:`Number line counting by ${a}s, pointing at ${b}`}),
      hint:`Count by ${a}s. Do you land on ${b}, or jump over it?`,
      explain:`${j} × ${a} = ${j*a} and ${j+1} × ${a} = ${(j+1)*a}. ${b} is in between, so ${a} is not a factor of ${b}.`};
  }
  if(k===1||k===2){
    /* k 1: which could be the size of each group (a factor); k 2: which is NOT a factor */
    const [say,grps,grp,things,max]=pick(GROUPS),n=pick(RICH.filter(v=>v<=max&&factors(v).filter(f=>f>1&&f<v&&f<=12).length>=2));
    const F=factors(n).filter(f=>f>1&&f<n&&f<=12),NF=upTo(12).filter(v=>v>2&&n%v);
    const left=w=>{const q=Math.floor(n/w);return `${q} ${q===1?grp:grps} of ${w} is ${q*w}, with ${n-q*w} left over.`;};
    const yes=f=>`${n/f} ${grps} of ${f} is ${n}, so ${f} is a factor of ${n}.`;
    if(k===1){
      const f=pick(F),W=shuffle(NF).slice(0,2);
      return {...mcOf([[String(f),null],...W.map(w=>[String(w),`${w} doesn’t work: ${left(w)}`])]),
        prompt:say(n,name),
        hint:`The number in each ${grp} has to be a factor of ${n}. Which one goes into ${n} with none left over?`,
        explain:`${n/f} × ${f} = ${n}. ${cap(yes(f))}`};
    }
    const [f1,f2]=shuffle(F).slice(0,2),w=pick(NF);
    return {...mcOf([[String(w),null],[String(f1),`${f1} × ${n/f1} = ${n}, so ${f1} is a factor of ${n}.`],[String(f2),`${f2} × ${n/f2} = ${n}, so ${f2} is a factor of ${n}.`]]),
      prompt:`Which number is <b>not</b> a factor of ${n}?`,
      hint:`Check each number: is there a whole number that times it makes ${n}?`,
      explain:`Counting by ${w}s goes ${Math.floor(n/w)*w}, ${(Math.floor(n/w)+1)*w}, and skips ${n}. So ${w} is not a factor of ${n}.`};
  }
  if(k===3){
    /* how many factors */
    const n=pick(RICH.filter(v=>v<=64)),P=pairsOf(n),F=factors(n),sq=Math.sqrt(n)%1===0;
    return {kind:'num',unit:'factors',answer:F.length,prompt:`How many factors does ${n} have?`,
      fig:show=>show?allRects(n):tiles(1,n,`${n} tiles in 1 row`),
      misc:miscOf(F.length,[[P.length,'That’s the number of factor pairs. Each pair has two factors.'],...(sq?[[F.length+1,`${Math.sqrt(n)} × ${Math.sqrt(n)} uses the same factor twice. Count it once.`]]:[]),[F.length-2,`Don’t forget 1 and ${n}. 1 × ${n} is a factor pair too.`]]),
      hint:`Find every factor pair: try 1, 2, 3, … and stop when the pairs turn around. Each pair gives two factors.`,
      explain:`The factor pairs are ${list(P.map(([a,b])=>`${a} × ${b}`))}. The factors are ${list(F)}: ${F.length} factors.`};
  }
  /* the one multiple of a in a decade */
  const opts=[];[6,7,8,9].forEach(a=>range(8).forEach(i=>{const d=10*(i+2),M=upTo(9).map(j=>d+j).filter(v=>v%a===0);if(M.length===1&&d%a&&(d+10)%a)opts.push([a,d,M[0]]);}));
  const [a,d,m]=pick(opts),j=m/a;
  return {kind:'num',unit:'',answer:m,prompt:`Which multiple of ${a} is between ${d} and ${d+10}?`,
    fig:show=>hopLine(a,d+10,show?j:1,{nums:show?Infinity:1,label:`Number line counting by ${a}s to ${d+10}`}),
    misc:miscOf(m,[[m-a,`${m-a} is a multiple of ${a}, but it’s less than ${d}.`],[m+a,`${m+a} is a multiple of ${a}, but it’s more than ${d+10}.`]]),
    hint:`Count by ${a}s until you get past ${d}.`,
    explain:`${j} × ${a} = ${m}. The multiples of ${a} near there are ${m-a}, ${m}, and ${m+a}, and only ${m} is between ${d} and ${d+10}.`};
}

/* ---------- The Mega-Bot: everything ---------- */
const genBoss=()=>pick([genHops,genTiles,genPrime,genLockers,genGears])();

const ZONES=[
  {id:'hops',name:'Hop Belt',lessons:'Lesson 1',blurb:'Skip-count along the belt to find multiples, and pick amounts you can buy in whole packs.',gen:genHops},
  {id:'tiles',name:'Tile Press',lessons:'Lesson 2',blurb:'Press tiles into rectangles to find factor pairs, and find every pair for a number.',gen:genTiles},
  {id:'prime',name:'Prime Sorter',lessons:'Lesson 3',blurb:'Sort numbers into prime and composite, and catch the odd numbers that aren’t prime.',gen:genPrime},
  {id:'lockers',name:'Locker Room',lessons:'Lessons 5–6',blurb:'Find when buses and lights line up again, and solve the Locker Problem.',gen:genLockers},
  {id:'gears',name:'Gear Works',lessons:'Lesson 7',blurb:'Say which number is a factor and which is a multiple, and count all the factors.',gen:genGears},
  {id:'boss',name:'The Mega-Bot',lessons:'All lessons',blurb:'Power up the Mega-Bot! Every right answer charges one of its 10 battery cells.',gen:genBoss},
];

/* the Mega-Bot: a robot with a 10-cell battery on its chest. lit: how many cells are charged (the boss icon draws all of them). */
const bot=lit=>'<path d="M32,4V11" stroke="#a9c4e4" stroke-width="2.5"/><circle cx="32" cy="4" r="3" fill="#ff8ac4"/><rect x="16" y="11" width="32" height="17" rx="4" fill="#7fb0e6" stroke="#0a2340" stroke-width="1.5"/>'
  +'<circle cx="25" cy="19.5" r="3.5" fill="#0a2340"/><circle cx="39" cy="19.5" r="3.5" fill="#0a2340"/><circle cx="25" cy="19.5" r="1.5" fill="#7fe3ff"/><circle cx="39" cy="19.5" r="1.5" fill="#7fe3ff"/>'
  +'<rect x="10" y="30" width="44" height="30" rx="5" fill="#5f8fca" stroke="#0a2340" stroke-width="1.5"/><path d="M10,36H4V50M54,36H60V50" fill="none" stroke="#a9c4e4" stroke-width="3" stroke-linecap="round"/>'
  +'<rect x="14" y="37" width="36" height="16" rx="2" fill="#0a2340"/>'
  +range(10).map(i=>`<rect x="${16+i*3.4}" y="39" width="2.6" height="12" fill="${i<lit?'#5fe0a8':'#1b467a'}"/>`).join('');
const ICON={
  hops:'<rect x="4" y="44" width="56" height="10" rx="5" fill="#1b467a" stroke="#a9c4e4" stroke-width="2"/><circle cx="10" cy="49" r="2.5" fill="#a9c4e4"/><circle cx="54" cy="49" r="2.5" fill="#a9c4e4"/><path d="M8,42Q20,14 32,42M32,42Q44,14 56,42" fill="none" stroke="#ffc93c" stroke-width="3"/><circle cx="32" cy="42" r="3.5" fill="#ffc93c"/><circle cx="56" cy="42" r="3.5" fill="#ffc93c"/>',
  tiles:'<rect x="6" y="4" width="52" height="12" rx="2" fill="#a9c4e4" stroke="#0a2340" stroke-width="1.5"/><path d="M26,16V22M38,16V22" stroke="#a9c4e4" stroke-width="3"/><g fill="rgba(255,201,60,.55)" stroke="#0a2340" stroke-width="1.5">'+range(12).map(i=>`<rect x="${8+i%4*12}" y="${24+Math.floor(i/4)*12}" width="12" height="12"/>`).join('')+'</g>',
  prime:'<path d="M8,6H56L40,28V40H24V28Z" fill="#1b467a" stroke="#a9c4e4" stroke-width="2" stroke-linejoin="round"/><text x="32" y="22" fill="#ffc93c" font-size="13" font-weight="700" text-anchor="middle" font-family="monospace">7 9</text><rect x="6" y="46" width="22" height="14" rx="3" fill="#ffc93c"/><rect x="36" y="46" width="22" height="14" rx="3" fill="#7fe3ff"/><path d="M28,40L17,46M36,40L47,46" stroke="#a9c4e4" stroke-width="2"/>',
  lockers:'<g stroke="#7fe3ff" stroke-width="2"><rect x="6" y="10" width="15" height="44" fill="rgba(127,227,255,.35)"/><rect x="24.5" y="10" width="15" height="44" fill="#061528"/><rect x="43" y="10" width="15" height="44" fill="rgba(127,227,255,.35)"/></g><polygon points="24.5,10 30,15 30,49 24.5,54" fill="rgba(127,227,255,.6)" stroke="#7fe3ff" stroke-width="1.5"/>',
  gears:'<g fill="#ffc93c" stroke="#0a2340" stroke-width="1.5">'+range(8).map(i=>`<rect x="20" y="8" width="8" height="8" transform="rotate(${i*45} 24 24)"/>`).join('')+'<circle cx="24" cy="24" r="13"/></g><circle cx="24" cy="24" r="4" fill="#0a2340"/>'
    +'<g fill="#7fe3ff" stroke="#0a2340" stroke-width="1.5">'+range(6).map(i=>`<rect x="39" y="30" width="8" height="8" transform="rotate(${i*60+30} 43 44)"/>`).join('')+'<circle cx="43" cy="44" r="11"/></g><circle cx="43" cy="44" r="3.5" fill="#0a2340"/>',
  boss:bot(10),
};
