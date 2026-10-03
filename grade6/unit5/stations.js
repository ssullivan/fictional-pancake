/* Decimal Diner (Grade 6 Unit 5): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Each generator deals one of a few kinds of problem (type), each with a comment saying what it asks. Every problem also
   carries m: what it's made of (its type, its numbers, and the form of its answer). Prices are often in cents (ca, cb). */
/* n rounded to 4 decimal places, to clear floating-point dust */
const r4=n=>Math.round(n*1e4)/1e4;
/* a number as written, up to 4 decimal places, with commas */
const fmt=n=>r4(n).toLocaleString('en-US',{maximumFractionDigits:4});
/* dollars and cents: $4.50; cash leaves whole dollars without cents: $6 */
const money=n=>'$'+(Math.round(n*100)/100).toFixed(2);
const cash=n=>Number.isInteger(n)?'$'+n:money(n);
/* 10 to the power p, and n as a whole number of 10^-p pieces (toInt(1.25, 2) is 125) */
const S=p=>10**p;
const toInt=(n,p)=>Math.round(n*S(p));
/* decimal places and nonzero digits of a number as written */
const places=n=>{const s=String(r4(n)),i=s.indexOf('.');return i<0?0:s.length-i-1;};
const nz=n=>String(r4(n)).replace(/[^1-9]/g,'').length;
/* how the engine matches a typed answer (Game.init's near): equal to 4 decimal places */
const near=(x,y)=>Math.round(x*1e4)===Math.round(y*1e4);
const WHO=['Lin','Andre','Priya','Diego','Jada','Noah','Mai','Kiran','Elena','Han'];
/* place names by decimal places: PN for many, PN1 for one; pn(k, p): "3 tenths", "1 hundredth" */
const PN=['ones','tenths','hundredths','thousandths','ten-thousandths'];
const PN1=['one','tenth','hundredth','thousandth','ten-thousandth'];
const pn=(k,p)=>`${k} ${k===1?PN1[p]:PN[p]}`;

/* Column-by-column add (or subtract, with sub) of a and b. Returns {n: regroups needed,
   naive: the answer if you skip regrouping (add: drop the carry; subtract: smaller digit from bigger)}. */
function colOps(a,b,sub){
  /* digitsA and digitsB: a and b as whole numbers of their smallest place; carry: what's carried or borrowed; place: the place value */
  const p=Math.max(places(a),places(b));let digitsA=toInt(a,p),digitsB=toInt(b,p),carry=0,regroups=0,naive=0,place=1;
  while(digitsA||digitsB){
    const x=digitsA%10,y=digitsB%10;
    if(sub){const diff=x-y-carry;carry=diff<0?1:0;naive+=Math.abs(x-y)*place;}
    else{const sum=x+y+carry;carry=sum>=10?1:0;naive+=((x+y)%10)*place;}
    regroups+=carry;digitsA=Math.floor(digitsA/10);digitsB=Math.floor(digitsB/10);place*=10;
  }
  return {n:regroups,naive:naive/S(p)};
}
/* friendly prices in cents: quarters, or dimes under $5 */
const moneyOK=cents=>Number.isInteger(cents)&&(cents%25===0||(cents%10===0&&cents<500));

/* ---------- shared figures ---------- */
/* a op b written in columns (a figure function). p: decimal places to write (default the most either has); raw: write the
   numbers as they are, not lined up by place; res: a wrong result to show under the line (default a "?") */
function vertFig(a,b,op,{p=null,raw=false,res=null}={}){
  return ()=>{
    const shownPlaces=p??Math.max(places(a),places(b));
    const textA=raw?fmt(a):a.toFixed(shownPlaces),textB=raw?fmt(b):b.toFixed(shownPlaces),textResult=res??'?';
    const width=Math.max(textA.length,textB.length,textResult.length)+1;
    const rows=[`  ${textA.padStart(width)}`,`${op} ${textB.padStart(width)}`,`  ${'─'.repeat(width)}`,
      res==null?`  ${' '.repeat(width-1)}<span class="q">?</span>`:`  <span class="bad">${textResult.padStart(width)}</span>`];
    return `<pre class="vert" role="img" aria-label="${textA} ${op} ${textB} written in columns">${rows.join('\n')}</pre>`;
  };
}
/* base-ten diagram: strip = 0.1, small square = 0.01. groups: [{t: strips, h: small squares}], joined by "+"; the hint writes each group's value */
function blocksFig(groups){
  return show=>{
    let x=14,markup='';const top=20,stripH=100;
    groups.forEach((group,groupIndex)=>{
      const groupX=x;
      for(let i=0;i<group.t;i++){markup+=`<rect class="ic-a" x="${x}" y="${top}" width="10" height="${stripH}"/>`;x+=16;}
      x+=6;
      /* small squares in columns of 5 from the bottom up, 5 to a row */
      for(let i=0;i<group.h;i++){const col=i%5,row=Math.floor(i/5);markup+=`<rect class="ic-b" x="${x+col*16}" y="${top+stripH-10-row*16}" width="10" height="10"/>`;}
      x+=Math.min(5,group.h)*16;
      if(show)markup+=`<text class="ftxt big mid rev" x="${(groupX+x)/2}" y="${top+stripH+30}">${fmt(group.t/10+group.h/100)}</text>`;
      if(groupIndex<groups.length-1){markup+=`<text class="ftxt big mid" x="${x+22}" y="${top+stripH/2+7}">+</text>`;x+=46;}
    });
    return svgWrap(x+10,top+stripH+44,markup,'Base-ten diagram: strips are tenths, small squares are hundredths');
  };
}
/* area diagram, not to scale: a rectangle (whole + tenths/10) by b, split into the whole part and the tenths part; the hint fills in both areas */
function areaFig(whole,tenths,b){
  return show=>{
    const width=320,left=44,top=34,height=130,wholeW=width*.62,tenthsW=width-wholeW;
    let markup=`<rect class="ic-a" x="${left}" y="${top}" width="${wholeW}" height="${height}"/><rect class="ic-b" x="${left+wholeW}" y="${top}" width="${tenthsW}" height="${height}"/>`;
    markup+=`<text class="ftxt big mid" x="${left+wholeW/2}" y="${top-12}">${whole}</text><text class="ftxt big mid" x="${left+wholeW+tenthsW/2}" y="${top-12}">${fmt(tenths/10)}</text><text class="ftxt big mid" x="${left-24}" y="${top+height/2+7}">${b}</text>`;
    if(show)markup+=`<text class="ftxt big mid rev" x="${left+wholeW/2}" y="${top+height/2+7}">${whole*b}</text><text class="ftxt big mid rev" x="${left+wholeW+tenthsW/2}" y="${top+height/2+7}">${fmt(tenths*b/10)}</text>`;
    return svgWrap(width+left+14,top+height+12,markup,'Area diagram split into two rectangles');
  };
}
/* 1 m by 1 m square in hundredths, with a d1 by d2 tenths rectangle shaded in its bottom left; the hint and answer add notes */
function gridFig(d1,d2){
  return (show,done)=>{
    const cell=22,left=80,top=30,side=10*cell;let markup='';
    for(let i=0;i<10;i++)for(let j=0;j<10;j++)markup+=`<rect class="${i<d1&&j>=10-d2?'shade':'cell'}" x="${left+i*cell}" y="${top+j*cell}" width="${cell}" height="${cell}"/>`;
    markup+=`<rect class="frame" x="${left}" y="${top}" width="${side}" height="${side}"/><rect class="frame" style="stroke:var(--gold)" x="${left}" y="${top+side-d2*cell}" width="${d1*cell}" height="${d2*cell}"/>`;
    markup+=`<text class="ftxt mid" x="${left+side/2}" y="${top-10}">1 m</text><text class="ftxt mid" x="${left+d1*cell/2}" y="${top+side+24}">${fmt(d1/10)} m</text><text class="ftxt" text-anchor="end" x="${left-8}" y="${top+side-d2*cell/2+5}">${fmt(d2/10)} m</text>`;
    if(show)markup+=`<text class="ftxt rev" x="${left+side+10}" y="${top+20}">each</text><text class="ftxt rev" x="${left+side+10}" y="${top+40}">square</text><text class="ftxt rev" x="${left+side+10}" y="${top+60}">= 0.01</text>`;
    if(done)markup+=`<text class="ftxt rev" x="${left+side+10}" y="${top+side-28}">${d1*d2}</text><text class="ftxt rev" x="${left+side+10}" y="${top+side-8}">shaded</text>`;
    return svgWrap(left+side+90,top+side+34,markup,'Hundredths grid with a shaded rectangle');
  };
}
/* partial quotients for dividend ÷ d, taking out each of chunks in turn: the hint shows the first chunk, the answer shows them all */
function pqFig(dividend,d,chunks){
  return (show,done)=>{
    /* digits: the dividend's width; indent and minus line the columns up under it */
    const digits=String(dividend).length,divisor=String(d),indent=' '.repeat(divisor.length+3),minus=' '.repeat(divisor.length+1)+'− ';
    let rest=dividend;const lines=[`${divisor} ) ${dividend}`];
    const shown=done?chunks.length:show?1:0;
    for(let i=0;i<shown;i++){const chunk=chunks[i],taken=chunk*d;rest-=taken;lines.push(`${minus}${String(taken).padStart(digits)}   <span class="rev">${chunk} × ${d}</span>`,`${indent}${String(rest).padStart(digits)}`);}
    if(done)lines.push(`<span class="rev">${chunks.join(' + ')} = ${chunks.reduce((a,b)=>a+b)} groups</span>`);
    return `<pre class="vert" role="img" aria-label="Partial quotients for ${dividend} divided by ${d}">${lines.join('\n')}</pre>`;
  };
}
/* X ÷ n, dividing past the ones place: leftovers become tenths, then hundredths (at most 3 places). The hint shows the first steps, the answer all of them. */
function longFig(X,n){
  const quotient=Math.floor(X/n),steps=[`${n} × ${quotient} = ${n*quotient}, ${X-n*quotient} left over`];
  let left=X%n,p=0;
  while(left&&p<3){const asNext=left*10,digit=Math.floor(asNext/n),over=asNext%n;steps.push(`${pn(left,p)} = ${pn(asNext,p+1)}`,`${pn(asNext,p+1)} ÷ ${n} = ${pn(digit,p+1)}${over?`, ${over} left over`:''}`);left=over;p++;}
  return (show,done)=>{
    const lines=[`${X} ÷ ${n} = <span class="q">?</span>`];
    if(show)lines.push(...steps.slice(0,done?steps.length:2).map(step=>`<span class="rev">${step}</span>`));
    if(done)lines.push(`${X} ÷ ${n} = ${fmt(X/n)}`);
    return `<pre class="vert sm" role="img" aria-label="${X} divided by ${n}, step by step">${lines.join('\n')}</pre>`;
  };
}
/* a ÷ b, and (with the hint) both multiplied by 10^s: the same answer with whole numbers */
function scaleFig(a,b,s){
  return show=>{
    const factor=S(s);let markup=`<text class="ftxt big mid" x="90" y="34">${fmt(a)}</text><text class="ftxt big mid" x="170" y="34">÷</text><text class="ftxt big mid" x="250" y="34">${fmt(b)}</text>`;
    if(show){
      [90,250].forEach(x=>markup+=`<line class="tick rev" x1="${x}" y1="46" x2="${x}" y2="80"/><polygon points="${x},92 ${x-7},80 ${x+7},80" style="fill:var(--cyan)"/><text class="ftxt rev" x="${x+12}" y="74">× ${factor}</text>`);
      markup+=`<text class="ftxt big mid rev" x="90" y="122">${fmt(toInt(a,s))}</text><text class="ftxt big mid rev" x="170" y="122">÷</text><text class="ftxt big mid rev" x="250" y="122">${fmt(toInt(b,s))}</text>`;
    }
    return svgWrap(340,show?136:48,markup,'Division scaled by '+factor);
  };
}
/* a receipt. rows: [label, cents, when shown: 1 always · 'show' with hint · 'done' after answering, row class] */
function receiptFig(rows){
  return (show,done)=>`<table class="rt" aria-label="Receipt"><tbody>${rows.map(([label,cents,when,cls])=>`<tr class="${cls||''}"><td class="l">${label}</td><td>${(when===1||(when==='show'&&show)||done)?`<span${when===1?'':' style="color:var(--cyan)"'}>${money(cents/100)}</span>`:'<span class="q">?</span>'}</td></tr>`).join('')}</tbody></table>`;
}

/* ---------- menu ---------- */
/* menu items: the name (n), its plural, and the prices it can have, in cents (c) */
const MENU=[
  {n:'taco',pl:'tacos',c:[200,225,250,275]},
  {n:'burrito',pl:'burritos',c:[450,475,500,525]},
  {n:'grilled cheese',pl:'grilled cheeses',c:[325,350,375]},
  {n:'fruit cup',pl:'fruit cups',c:[150,175,200]},
  {n:'lemonade',pl:'lemonades',c:[125,140,150,175]},
  {n:'bottle of water',pl:'bottles of water',c:[75,100,120]},
  {n:'bag of chips',pl:'bags of chips',c:[75,90,100,125]},
  {n:'cookie',pl:'cookies',c:[50,60,75]},
  {n:'smoothie',pl:'smoothies',c:[350,375,400,425]},
  {n:'veggie wrap',pl:'veggie wraps',c:[425,450,475]}
];
/* the bill that pays for `cents`: the smallest one bigger */
const BILLS=[5,10,20];
const billFor=cents=>BILLS.find(bill=>bill*100>cents);
/* two different menu items a and b at prices ca and cb (cents) that add with at most one regroup */
function order2(){let a,b,ca,cb;do{[a,b]=shuffle(MENU);ca=pick(a.c);cb=pick(b.c);}while(colOps(ca/100,cb/100).n>1);return {a,b,ca,cb};}

/* ---------- Station 1: add & subtract (Lessons 1–4) ---------- */
/* how-much-is-left stories: s(who, a, b), the unit, and the least and most a can be */
const DIFF=[
  {s:(w,a,b)=>`A bottle has ${a} liters of juice. ${w} pours out ${b} liters. How many liters are left?`,u:'liters',min:.5,max:2},
  {s:(w,a,b)=>`A ribbon is ${a} meters long. ${w} cuts off ${b} meters. How many meters are left?`,u:'meters',min:1,max:5},
  {s:(w,a,b)=>`A bag has ${a} kilograms of rice. ${w} uses ${b} kilograms. How many kilograms are left?`,u:'kilograms',min:1,max:3}
];
function genAdd(){
  const type=pick(['blocks','total','total','change','diff','diff','error']),who=pick(WHO);
  if(type==='blocks'){
    /* two groups of tenths (t) and hundredths (h) whose hundredths make a new tenth: T tenths and H hundredths in all */
    let t1,h1,t2,h2;do{t1=R(1,5);t2=R(1,5);h1=R(1,9);h2=R(1,9);}while(h1+h2<10||t1+t2+1>9);
    const A=(10*t1+h1)/100,B=(10*t2+h2)/100,T=t1+t2,H=h1+h2,sum=(10*T+H)/100;
    return {kind:'num',unit:'',answer:sum,fig:blocksFig([{t:t1,h:h1},{t:t2,h:h2}]),
      prompt:`Each strip is 0.1 and each small square is 0.01. What number do the two groups make <b>altogether</b>?`,
      hint:`Count all the strips (tenths) and all the small squares (hundredths). 10 small squares make 1 strip, so bundle 10 of them.`,
      misc:[[T/10+(H-10)/100,'You have 10 or more small squares. Bundle 10 of them into 1 more strip (0.1).'],[+`0.${T}${H}`,`${H} hundredths won’t fit in the hundredths place. Bundle 10 hundredths into 1 tenth.`]],
      explain:`${fmt(A)} + ${fmt(B)} is ${T} tenths and ${H} hundredths. Bundle 10 hundredths into 1 tenth: ${T+1} tenths and ${H-10} hundredths = ${fmt(sum)}.`,
      m:{t:type,nums:[A,B],ans:'num',regroup:colOps(A,B).n}};
  }
  if(type==='total'){
    /* the total of two menu items */
    const {a,b,ca,cb}=order2(),total=ca+cb,op=colOps(ca/100,cb/100);
    return {kind:'num',unit:'dollars',answer:total/100,fig:vertFig(ca/100,cb/100,'+',{p:2}),
      prompt:`${who} orders a ${a.n} for ${money(ca/100)} and a ${b.n} for ${money(cb/100)}. What is the <b>total</b>?`,
      hint:'Line up the decimal points and add each place: hundredths, tenths, then ones. If a place adds up to 10 or more, regroup it as 1 of the next place.',
      misc:[[op.naive,'Check your regrouping. When a place adds up to 10 or more, carry 1 to the next place to the left.']],
      explain:`${money(ca/100)} + ${money(cb/100)} = ${money(total/100)}.`,
      m:{t:type,cash:[ca,cb],ans:'cash',regroup:op.n}};
  }
  if(type==='change'){
    /* the change from a bill for one or two items (two) */
    const order=order2(),two=Math.random()<.5,items=two?[[order.a,order.ca],[order.b,order.cb]]:[[order.a,order.ca]];
    const total=items.reduce((sum,item)=>sum+item[1],0),bill=billFor(total),change=bill*100-total,nextDollar=Math.ceil(total/100);
    const list=items.map(([food,cents])=>`a ${food.n} (${money(cents/100)})`).join(' and ');
    return {kind:'num',unit:'dollars',answer:change/100,fig:vertFig(bill,total/100,'−',{p:2}),
      prompt:`${who} buys ${list} and pays with a $${bill} bill. How much <b>change</b> does ${who} get?`,
      hint:`${two?`Add to find the total first. Then c`:'C'}ount up from the total: first to the next whole dollar, then to $${bill}.`,
      misc:[[colOps(bill,total/100,true).naive,`Watch the zeros in $${bill}.00. You can’t take a digit from 0 without regrouping, so regroup or count up instead.`],[total/100,'That’s the total. Change is what’s left of the bill.'],[bill+total/100,'Change means subtract: bill − total.']],
      explain:`${two?`Total: ${money(order.ca/100)} + ${money(order.cb/100)} = ${money(total/100)}. `:''}${total%100?`Count up: ${money(total/100)} + ${money((nextDollar*100-total)/100)} = ${money(nextDollar)}, then + ${money(bill-nextDollar)} = ${money(bill)}. `:''}Change: ${money(bill)} − ${money(total/100)} = ${money(change/100)}.`,
      m:{t:type,cash:items.map(item=>item[1]),ans:'cash',total,bill}};
  }
  if(type==='diff'){
    /* how much is left: a (placesA decimal places) take away b (placesB), at most one regroup; fewer: the one with fewer places */
    const story=pick(DIFF);let a,b,placesA,placesB,d,op;
    do{placesA=pick([1,2]);placesB=3-placesA;a=R(2,story.max*S(placesA))/S(placesA);b=R(1,placesB===1?story.max*10:99)/S(placesB);left=(toInt(a,2)-toInt(b,2))/100;op=colOps(a,b,true);}
    while(places(a)!==placesA||places(b)!==placesB||nz(a)>2||nz(b)>2||a<story.min||b<.1||left<.1||nz(left)>2||op.n>1);
    const fewer=placesA===1?a:b;
    return {kind:'num',unit:story.u,answer:left,fig:vertFig(a,b,'−',{p:2}),
      prompt:story.s(who,fmt(a),fmt(b)),
      hint:`Write ${fmt(fewer)} as ${fewer.toFixed(2)} so both numbers have hundredths. Line up the decimal points, then subtract place by place.`,
      misc:[[op.naive,'In each place, subtract the bottom digit from the top digit. If the top digit is smaller, regroup from the place to the left.'],[(toInt(a,2)+toInt(b,2))/100,'That’s the sum. The question asks how much is left, so subtract.']],
      explain:`${a.toFixed(2)} − ${b.toFixed(2)} = ${fmt(left)} ${story.u}.`,
      m:{t:type,nums:[a,b],ans:'num',regroup:op.n,min:story.min,max:story.max}};
  }
  /* error: what went wrong when the last digits were lined up instead of the decimal points (wrong is that sum) */
  let a,b,wrong;
  do{a=R(2,39)/10;b=R(1,299)/100;wrong=(toInt(a,1)+toInt(b,2))/100;}
  while(places(a)!==1||places(b)!==2||nz(a)>2||nz(b)>2||colOps(a,b).n||colOps(toInt(a,1),toInt(b,2)).n||near(wrong,Math.abs(a-b)));
  const sum=(toInt(a,2)+toInt(b,2))/100;
  return {kind:'mc',stack:true,answer:'align',
    choices:[{id:'align',label:`${who} lined up the last digits instead of the decimal points.`},{id:'regroup',label:`${who} forgot to regroup.`},{id:'op',label:`${who} subtracted instead of adding.`}],
    why:{regroup:'No place adds up to 10 or more here, so there’s nothing to regroup. Look at where the decimal points are.',op:'Subtracting gives a different answer. Look at where the decimal points are.'},
    fig:vertFig(a,b,'+',{raw:true,res:wrong.toFixed(2)}),
    prompt:`${who} added ${fmt(a)} + ${fmt(b)} like this and got ${wrong.toFixed(2)}. <b>What went wrong?</b>`,
    hint:'Tenths must line up with tenths and hundredths with hundredths. Are the decimal points in a straight column?',
    explain:`Line up the decimal points: ${a.toFixed(2)} + ${fmt(b)} = ${fmt(sum)}.`,
    m:{t:'error',nums:[a,b],regroup:0}};
}

/* ---------- Station 2: where the decimal point goes (Lessons 5–6) ---------- */
/* multiplication facts to shift */
const FACTS=[[12,4],[15,3],[25,4],[14,5],[16,3],[25,3],[12,6],[15,6],[18,5],[35,2],[45,2],[24,3],[12,8],[15,5],[16,5],[25,2]];
/* a decimal as a whole number of pieces: "0.25 = 25 × 1/100" */
const asFrac=(d,p)=>`${fmt(d/S(p))} = ${d} × 1/${S(p)}`;
function genPoint(){
  const type=pick(['place','place','word','fact','fact','size']);
  if(type==='place'){
    /* where the point goes in d1 × 10^-p1 times d2 × 10^-p2: the product of the digits, in pieces of 10^-exp; the wrong
       choices put it up to two places off */
    let d1,d2,p1,p2;do{d1=R(2,9);d2=R(2,9);p1=R(0,2);p2=R(0,2);}while(p1+p2<1||p1+p2>3);
    const a=d1/S(p1),b=d2/S(p2),product=d1*d2,exp=p1+p2,answer=product/S(exp);
    const others=shuffle([exp-2,exp-1,exp+1,exp+2].filter(e=>e>=0&&e<=4)).slice(0,3),all=[exp,...others].sort((x,y)=>x-y);
    const why={};others.forEach(e=>why['e'+e]=`${e<exp?'Too big':'Too small'}. That’s ${product} ${PN[e]}, but ${fmt(a)} × ${fmt(b)} is ${product} ${PN[exp]}.`);
    const parts=[[d1,p1],[d2,p2]].filter(x=>x[1]).map(x=>asFrac(...x));
    return {kind:'mc',choices:all.map(e=>({id:'e'+e,label:fmt(product/S(e))})),answer:'e'+exp,why,
      prompt:`What is <b>${fmt(a)} × ${fmt(b)}</b>?`,
      hint:`${d1} × ${d2} = ${product}. Then ${parts.join(' and ')}. What size are the pieces when you multiply the fractions?`,
      explain:`${d1} × ${d2} = ${product}, and the pieces are ${PN[exp]} (1/${S(exp)}). ${product} ${PN[exp]} = ${fmt(answer)}.`,
      m:{t:type,nums:[a,b]}};
  }
  if(type==='word'){
    /* what size the pieces of the product are */
    let d1,d2,p1,p2;do{d1=R(2,4);d2=R(2,4);p1=R(1,2);p2=R(1,2);}while(d1*d2>9||p1+p2>3);
    const a=d1/S(p1),b=d2/S(p2),product=d1*d2,exp=p1+p2,why={};
    [1,2,3,4].forEach(k=>{if(k!==exp)why['u'+k]=`1/${S(p1)} × 1/${S(p2)} = 1/${S(exp)}, so the pieces are ${PN[exp]}, not ${PN[k]}.`;});
    return {kind:'mc',choices:[1,2,3,4].map(k=>({id:'u'+k,label:PN[k]})),answer:'u'+exp,why,
      prompt:`${fmt(a)} × ${fmt(b)} is ${d1} ${PN[p1]} times ${d2} ${PN[p2]}. ${d1} × ${d2} = ${product}. So the product is ${product} <b>what</b>?`,
      hint:`A ${PN1[p1]} is 1/${S(p1)} and a ${PN1[p2]} is 1/${S(p2)}. Multiply those fractions.`,
      explain:`1/${S(p1)} × 1/${S(p2)} = 1/${S(exp)}, so ${fmt(a)} × ${fmt(b)} = ${product} ${PN[exp]} = ${fmt(product/S(exp))}.`,
      m:{t:type,nums:[a,b]}};
  }
  if(type==='fact'){
    /* a decimal product from a whole-number fact: x × y shifted by exp places */
    const [x,y]=pick(FACTS);let placesA,placesB;do{placesA=R(0,2);placesB=R(0,1);}while(placesA+placesB<1);
    const a=x/S(placesA),b=y/S(placesB),xy=x*y,exp=placesA+placesB,answer=xy/S(exp);
    const parts=[];if(placesA)parts.push(`${fmt(a)} is ${x} ÷ ${S(placesA)}`);if(placesB)parts.push(`${fmt(b)} is ${y} ÷ ${S(placesB)}`);
    return {kind:'num',unit:'',answer,
      prompt:`${x} × ${y} = ${xy}. Use that to find <b>${fmt(a)} × ${fmt(b)}</b>.`,
      hint:`${parts.join(' and ')}. So divide ${xy} by ${S(exp)}.`,
      misc:[[xy/S(exp-1),'Close! Check how many times you divided by 10.'],[xy/S(exp+1),'Close! Check how many times you divided by 10.'],[xy,`${fmt(a)} × ${fmt(b)} is not the same as ${x} × ${y}. Divide ${xy} by ${S(exp)}.`]],
      explain:`${xy} ÷ ${S(exp)} = ${fmt(answer)}.`,
      m:{t:type,nums:[a,b],ans:'num'}};
  }
  /* size: whether m × n is more or less than n, without multiplying */
  const n=pick([8,12,20,30,40,60]),m=pick([0.5,0.4,0.9,0.25,0.8,1.5,2.5,1.2]),less=m<1;
  return {kind:'mc',choices:[{id:'less',label:`Less than ${n}`},{id:'more',label:`More than ${n}`},{id:'same',label:`Equal to ${n}`}],answer:less?'less':'more',
    why:{less:`${fmt(m)} is more than 1, so ${fmt(m)} groups of ${n} is more than ${n}.`,more:`${fmt(m)} is less than 1, so you only get part of ${n}.`,same:`Only 1 × ${n} equals ${n}.`},
    prompt:`Without multiplying: is <b>${fmt(m)} × ${n}</b> more or less than ${n}?`,
    hint:`Is ${fmt(m)} more than 1 or less than 1? ${fmt(m)} × ${n} means ${fmt(m)} groups of ${n}.`,
    explain:`${fmt(m)} × ${n} = ${fmt(m*n)}. Multiplying by a number ${less?'less':'more'} than 1 makes it ${less?'smaller':'bigger'}.`,
    m:{t:'size',nums:[m]}};
}

/* ---------- Station 3: multiplying decimals (Lessons 7–8) ---------- */
/* produce sold by the pound (prices p, in dollars), things to find the area of (bmax: the widest), and fractions of a pound in words */
const PRODUCE=[{n:'apples',p:[2,3]},{n:'grapes',p:[3,4]},{n:'cheese',p:[6,8]},{n:'cherries',p:[4,6]},{n:'tomatoes',p:[2,4]},{n:'trail mix',p:[6,8]},{n:'bananas',p:[0.6,0.8]},{n:'carrots',p:[1.2,1.5]}];
const AREA=[{n:'garden bed',bmax:4},{n:'patio',bmax:6},{n:'rug',bmax:3}];
const QUARTERS={0.25:'a quarter',0.5:'half',0.75:'three quarters'};
function genMul(){
  const type=pick(['price','price','area','area','grid','grid']),who=pick(WHO);
  if(type==='price'){
    /* the cost of a weight of produce: a fraction of a pound at a whole-dollar price, or whole pounds at a decimal price */
    const item=pick(PRODUCE),price=pick(item.p),weight=Number.isInteger(price)?pick([0.25,0.5,0.75,1.5,2.5]):pick([2,3,4,5]),cost=toInt(weight*price,2)/100;
    const wholePounds=Math.floor(weight),partPound=weight-wholePounds;
    const hint=Number.isInteger(price)
      ?(wholePounds?`${fmt(weight)} = ${wholePounds} + ${fmt(partPound)}. Find ${wholePounds} × ${cash(price)} and ${fmt(partPound)} × ${cash(price)} (that’s ${QUARTERS[partPound]} of ${cash(price)}), then add.`:`${fmt(weight)} pound is ${QUARTERS[weight]} of a pound, so find ${QUARTERS[weight]} of ${cash(price)}.`)
      :`Think in cents: ${cash(price)} is ${toInt(price,2)} cents. What is ${weight} × ${toInt(price,2)} cents?`;
    return {kind:'num',unit:'dollars',answer:cost,
      prompt:`${who} buys ${fmt(weight)} pound${weight===1?'':'s'} of ${item.n} at ${cash(price)} per pound. How much does it cost?`,hint,
      misc:[[cost*10,'Too big. Check where the decimal point goes.'],[cost/10,'Too small. Check where the decimal point goes.'],[weight+price,'Multiply the pounds by the price per pound.']],
      explain:`${fmt(weight)} × ${cash(price)} = ${money(cost)}.`,
      m:{t:type,nums:[weight],cash:[toInt(price,2)],ans:'cash'}};
  }
  if(type==='area'){
    /* the area of whole.tenths by b meters, split into the whole part and the tenths part */
    const thing=pick(AREA);let whole,tenths,b,answer;
    do{whole=R(1,4);tenths=R(1,9);b=R(2,thing.bmax);answer=(10*whole+tenths)*b/10;}while(nz(answer)>2||colOps(whole*b,tenths*b/10).n>1);
    const a=(10*whole+tenths)/10;
    return {kind:'num',unit:'square meters',answer,fig:areaFig(whole,tenths,b),
      prompt:`A ${thing.n} is ${fmt(a)} meters long and ${b} meters wide. What is its <b>area</b>?`,
      hint:`Split ${fmt(a)} into ${whole} + ${fmt(tenths/10)}. Find ${whole} × ${b} and ${fmt(tenths/10)} × ${b}, then add.`,
      misc:[[whole*b,`That’s only ${whole} × ${b}. Add the other piece: ${fmt(tenths/10)} × ${b}.`],[whole*b+tenths*b,`${fmt(tenths/10)} × ${b} is ${tenths*b} tenths, which is ${fmt(tenths*b/10)}, not ${tenths*b}.`],[2*(10*whole+tenths+10*b)/10,'That’s the perimeter. Area is length × width.']],
      explain:`${whole} × ${b} = ${whole*b} and ${fmt(tenths/10)} × ${b} = ${fmt(tenths*b/10)}. ${whole*b} + ${fmt(tenths*b/10)} = ${fmt(answer)} square meters.`,
      m:{t:type,nums:[a,b],ans:'num',regroup:colOps(whole*b,tenths*b/10).n}};
  }
  /* grid: the area of a d1 by d2 tenths rectangle in a meter square */
  const d1=R(2,9),d2=R(2,9),answer=d1*d2/100;
  return {kind:'num',unit:'square meters',answer,fig:gridFig(d1,d2),
    prompt:`The big square is 1 meter on each side. The shaded rectangle is ${fmt(d1/10)} m by ${fmt(d2/10)} m. What is its <b>area</b>?`,
    hint:'Each small square is 0.1 m by 0.1 m, so its area is 0.01 square meters. How many small squares are shaded?',
    misc:[[d1*d2/10,'Each small square is 0.01, not 0.1. It takes 100 of them to fill the big square.'],[d1*d2,'That’s the number of small squares. Each one is only 0.01 square meters.'],[(d1+d2)/10,'To find area, multiply the length by the width.'],[d1*d2/1000,'Too small. Each small square is 0.01.']],
    explain:`${fmt(d1/10)} × ${fmt(d2/10)} = ${d1*d2} hundredths = ${fmt(answer)} square meters.`,
    m:{t:'grid',nums:[d1/10,d2/10],ans:'num'}};
}

/* ---------- Station 4: dividing whole numbers (Lessons 9–11) ---------- */
/* partial-quotient stories: the divisors that make sense (d), the largest dividend, and the story s(N, d) */
const PQ=[
  {d:[12],max:600,s:(N,d)=>`A farm packs ${N} eggs into cartons of ${d}. How many cartons does it fill?`},
  {d:[6,8,12,15],max:750,s:(N,d)=>`${N} chairs are set up in rows of ${d}. How many rows are there?`},
  {d:[4,6,12],max:300,s:(N,d)=>`The food truck bakes ${N} muffins and packs them in boxes of ${d}. How many boxes?`},
  {d:[4,5,8],max:500,s:(N,d)=>`${N} stickers come on sheets of ${d}. How many sheets are there?`}
];
/* sharing stories with a decimal answer: cash, the largest amount, the story s(X, n), and the unit */
const SHARE=[
  {cash:1,max:40,s:(X,n)=>`${n} friends split a $${X} lunch bill equally. How much does each friend pay?`,u:'dollars'},
  {max:15,s:(X,n)=>`${[8,11,18].includes(X)?'An':'A'} ${X}-meter rope is cut into ${n} equal pieces. How long is each piece?`,u:'meters'},
  {max:8,s:(X,n)=>`${X} liters of lemonade is poured equally into ${n} pitchers. How many liters go in each pitcher?`,u:'liters'}
];
/* X shared n ways for a story: the answer v isn't whole (friendly cents for cash), q remainder r */
function shareNums(story){
  let X,n,v;do{n=pick([2,4,5]);X=R(3,story.max);v=X/n;}while(X<n||Number.isInteger(v)||nz(v)>(story.cash?3:2)||(story.cash&&!moneyOK(toInt(v,2))));
  return {X,n,v,q:Math.floor(X/n),r:X%n};
}
function genDiv(){
  const type=pick(['pq','pq','pq','share','share','rem']);
  if(type==='pq'){
    /* partial quotients: N ÷ d is tens tens and ones ones (a quotient q), taking out 10 × tens groups first */
    const story=pick(PQ);let d,tens,ones,N;do{d=pick(story.d);tens=R(1,4);ones=R(1,9);N=d*(10*tens+ones);}while(N>story.max||N<60);
    const q=10*tens+ones,left=N-10*tens*d;
    return {kind:'num',unit:'',answer:q,fig:pqFig(N,d,[10*tens,ones]),
      prompt:story.s(N,d),
      hint:`Take out an easy chunk first: ${10*tens} groups of ${d} is ${10*tens*d}. How many more groups of ${d} fit in what’s left?`,
      misc:[[10*tens,`${10*tens} groups of ${d} only uses ${10*tens*d}. There are ${left} left: keep going.`],[tens+ones,`The first chunk is ${10*tens} groups, not ${tens}.`],[N-d,`Divide: how many groups of ${d} fit in ${N}?`]],
      explain:`${10*tens} × ${d} = ${10*tens*d}. ${N} − ${10*tens*d} = ${left}. ${ones} × ${d} = ${ones*d}. ${10*tens} + ${ones} = ${q}.`,
      m:{t:type,whole:[N,d],ans:'count'}};
  }
  /* share: X split n ways, as a decimal; rem: what the remainder becomes (not cash). leftWords: the remainder in words */
  const story=type==='rem'?pick(SHARE.slice(1)):pick(SHARE),{X,n,v,q,r}=shareNums(story);
  const write=story.cash?money:fmt,leftWords=story.cash?`${r} dollar${r>1?'s':''}`:`${r} ${story.u.replace(/s$/,'')}${r>1?'s':''}`;
  if(type==='rem'){
    const why={dot:`The remainder is ${r} whole${r>1?'s':''}, not ${r} tenths. Split the ${r} into ${n} equal parts too: ${r} ÷ ${n} = ${fmt(r/n)}.`,hun:`The remainder is ${r} whole${r>1?'s':''}, not ${r} hundredths. ${r} ÷ ${n} = ${fmt(r/n)}.`};
    return {kind:'mc',choices:shuffle([{id:'ok',label:fmt(v)},{id:'dot',label:fmt(q+r/10)},{id:'hun',label:fmt(q+r/100)}]),answer:'ok',why,fig:longFig(X,n),
      prompt:`${X} ÷ ${n} is ${q} with ${r} left over. What is ${X} ÷ ${n} <b>as a decimal</b>?`,
      hint:`The ${r} left over is ${r*10} tenths. Keep dividing: split the tenths into ${n} equal groups.`,
      explain:`${q} with ${r} left over. ${r} ÷ ${n} = ${fmt(r/n)}, so ${X} ÷ ${n} = ${fmt(v)}.`,
      m:{t:type,whole:[X,n]}};
  }
  return {kind:'num',unit:story.u,answer:v,fig:longFig(X,n),
    prompt:story.s(X,n),
    hint:`${X} ÷ ${n} is ${q} with ${leftWords} left over. Keep going: ${r} = ${r*10} tenths. Split those into ${n} equal groups.`,
    misc:[[q+r/10,`${q} remainder ${r} is not ${q}.${r}. The ${leftWords} left over still has to be split ${n} ways.`],[q,`Don’t drop the ${leftWords} left over. Split it into tenths${story.cash?' (dimes)':''} and keep dividing.`],[X*n,'Splitting into equal parts means dividing.']],
    explain:`${X} ÷ ${n} = ${q} with ${r} left over. ${r} ÷ ${n} = ${fmt(r/n)}. So each ${story.cash?'friend pays':'is'} ${write(v)}${story.cash?'':' '+story.u}.`,
    m:{t:story.cash?'split':'share',whole:[X,n],ans:story.cash?'cash':'num',max:story.max}};
}

/* ---------- Station 5: dividing decimals (Lessons 12–13) ---------- */
/* dividing a decimal by a whole number: the largest amount, the unit, and the story s(X, n) */
const DW=[
  {max:6,u:'liters',s:(X,n)=>`${fmt(X)} liters of juice is poured equally into ${n} pitchers. How many liters go in each pitcher?`},
  {max:5,u:'meters',s:(X,n)=>`A ${fmt(X)}-meter board is cut into ${n} equal pieces. How long is each piece?`},
  {max:5,u:'dollars',cash:1,s:(X,n)=>`${n} pencils cost ${money(X)}. How much does one pencil cost?`}
];
/* dividing by a decimal: the divisors (bs), the largest dividend, the unit, and the story s(a, b, who) */
const SC=[
  {bs:[0.2,0.25,0.3,0.4,0.5],max:4,u:'cups',s:(a,b)=>`A jug holds ${fmt(a)} liters of lemonade. Each cup holds ${fmt(b)} liters. How many cups can be filled?`},
  {bs:[0.2,0.25,0.3,0.4,0.5,0.6,0.75,0.8],max:6,u:'pieces',s:(a,b,w)=>`A ribbon is ${fmt(a)} meters long. ${w} cuts it into pieces that are ${fmt(b)} meters long. How many pieces?`},
  {bs:[0.2,0.25,0.5],max:3,u:'snack bags',s:(a,b)=>`A bag holds ${fmt(a)} kilograms of trail mix. It is split into snack bags of ${fmt(b)} kilograms each. How many snack bags?`}
];
/* a ÷ b = k for a story (c), and the power of ten s that makes both whole: A ÷ B */
function scaleNums(){
  const story=pick(SC);let b,k,a;do{b=pick(story.bs);k=R(2,12);a=toInt(k*b,2)/100;}while(a>story.max||a<1||nz(a)>2);
  const s=Math.max(places(a),places(b));
  return {c:story,a,b,k,s,A:toInt(a,s),B:toInt(b,s)};
}
function genDdiv(){
  const type=pick(['dw','dw','scale','scale','same','bigger']);
  if(type==='dw'){
    /* a decimal X (d × n tenths) split n ways: d tenths each */
    const story=pick(DW);let d,n,X;do{d=R(2,9);n=R(2,9);X=d*n/10;}while(X>story.max||X<1||Number.isInteger(X));
    const v=d/10,write=story.cash?money:fmt;
    return {kind:'num',unit:story.u,answer:v,
      prompt:story.s(X,n),
      hint:`Think in tenths: ${fmt(X)} is ${d*n} tenths. ${d*n} tenths ÷ ${n} = how many tenths?`,
      misc:[[d,`${fmt(X)} is ${d*n} tenths, so the answer is ${d} tenths, not ${d}.`],[d/100,'Too small. Check the decimal point.'],[X*n,'Splitting into equal parts means dividing.']],
      explain:`${d*n} tenths ÷ ${n} = ${d} tenths, so ${write(X)} ÷ ${n} = ${write(v)}.`,
      m:{t:type,nums:[X],ans:story.cash?'cash':'num',cash:story.cash?[toInt(X,2)]:[],max:story.max}};
  }
  /* scale: a ÷ b in a story, by scaling both by 10^s; same: which division has the same answer */
  const {c,a,b,k,s,A,B}=scaleNums();
  if(type==='scale')return {kind:'num',unit:c.u,answer:k,fig:scaleFig(a,b,s),
    prompt:c.s(a,b,pick(WHO)),
    hint:`Multiply both numbers by ${S(s)}. ${fmt(a)} ÷ ${fmt(b)} has the same answer as ${fmt(A)} ÷ ${fmt(B)}.`,
    misc:[[k/10,'Check the decimal point. Multiply both numbers by the same amount first.'],[k*10,'Multiply both numbers by the same amount, not just one of them.'],[a*b,`How many groups of ${fmt(b)} fit in ${fmt(a)}? That’s division.`]],
    explain:`${fmt(a)} ÷ ${fmt(b)} = ${fmt(A)} ÷ ${fmt(B)} = ${k} ${c.u}.`,
    m:{t:type,nums:[a,b],ans:'count',max:c.max}};
  if(type==='same'){
    const K=S(s);
    return {kind:'mc',choices:shuffle([{id:'ok',label:`${fmt(A)} ÷ ${fmt(B)}`},{id:'top',label:`${fmt(A)} ÷ ${fmt(b)}`},{id:'bot',label:`${fmt(a)} ÷ ${fmt(B)}`},{id:'mix',label:`${fmt(A*10)} ÷ ${fmt(B)}`}]),answer:'ok',
      why:{top:`Only ${fmt(a)} was multiplied by ${K}. Multiply both numbers by the same amount.`,bot:`Only ${fmt(b)} was multiplied by ${K}. Multiply both numbers by the same amount.`,mix:`${fmt(a)} was multiplied by ${K*10} but ${fmt(b)} by ${K}. Use the same number for both.`},
      prompt:`Which has the <b>same answer</b> as ${fmt(a)} ÷ ${fmt(b)}?`,
      hint:'If you multiply both numbers in a division by the same amount, the answer stays the same.',
      explain:`Multiply both by ${K}: ${fmt(a)} ÷ ${fmt(b)} = ${fmt(A)} ÷ ${fmt(B)} = ${k}.`,
      m:{t:type,nums:[a,b]}};
  }
  /* bigger: whether n ÷ m is more or less than n, without dividing */
  const n=pick([6,8,12,20]),m=pick([0.5,0.25,0.2,0.1,2,4]),more=m<1;
  return {kind:'mc',choices:[{id:'more',label:`More than ${n}`},{id:'less',label:`Less than ${n}`},{id:'same',label:`Equal to ${n}`}],answer:more?'more':'less',
    why:{more:`${n} ÷ ${fmt(m)} splits ${n} into ${fmt(m)} equal parts, so each part is less than ${n}.`,less:`How many ${fmt(m)}s fit in ${n}? Each one is less than 1, so more than ${n} of them fit.`,same:`Only ${n} ÷ 1 equals ${n}.`},
    prompt:`Without dividing: is <b>${n} ÷ ${fmt(m)}</b> more or less than ${n}?`,
    hint:`${n} ÷ ${fmt(m)} asks “how many ${fmt(m)}s fit in ${n}?” Is ${fmt(m)} more or less than 1?`,
    explain:`${n} ÷ ${fmt(m)} = ${fmt(n/m)}. Dividing by a number ${more?'less':'more'} than 1 gives ${more?'more':'less'} than you started with.`,
    m:{t:'bigger',nums:[m]}};
}

/* ---------- Station 6: multi-step orders (Lesson 14) ---------- */
const PACKS=['granola bars','juice boxes','tortillas','bottles of water','muffins'];
/* unit prices in cents, and how many come in a pack */
const US=[25,40,50,60,75,80,100,125,150],NS=[2,3,4,5,6,8,10,12];
function genRush(){
  const type=pick(['change','change','split','deal','deal','rate']),who=pick(WHO);
  if(type==='change'){
    /* the change from a bill for k of one item and one of another */
    let a,b,ca,cb,k,total;do{[a,b]=shuffle(MENU);ca=pick(a.c);cb=pick(b.c);k=R(2,3);total=k*ca+cb;}while(total>=2000);
    const bill=billFor(total),change=bill*100-total;
    return {kind:'num',unit:'dollars',answer:change/100,
      fig:receiptFig([[`${k} × ${a.n} at ${money(ca/100)}`,k*ca,'show'],[`1 × ${b.n}`,cb,1],['Total',total,'show','tot'],['Paid',bill*100,1],['Change',change,'done','tot']]),
      prompt:`${who} orders ${k} ${a.pl} at ${money(ca/100)} each and a ${b.n} for ${money(cb/100)}, then pays with a $${bill} bill. How much <b>change</b> does ${who} get?`,
      hint:`Step 1: ${k} × ${money(ca/100)}. Step 2: add the ${b.n}. Step 3: subtract the total from $${bill}.`,
      misc:[[total/100,`That’s the total. Now find the change from $${bill}.`],[bill-(ca+cb)/100,`${k} ${a.pl} cost ${k} × ${money(ca/100)}, not just ${money(ca/100)}.`]],
      explain:`${k} × ${money(ca/100)} = ${money(k*ca/100)}. ${money(k*ca/100)} + ${money(cb/100)} = ${money(total/100)}. ${money(bill)} − ${money(total/100)} = ${money(change/100)}.`,
      m:{t:'rchange',cash:[ca,cb],ans:'cash',total,bill}};
  }
  if(type==='split'){
    /* each friend's share of k items split n ways */
    let a,ca,k,n,total,each;do{a=pick(MENU.filter(x=>x.c[0]>=200));ca=pick(a.c);k=R(2,4);n=pick([2,3,4]);total=k*ca;each=total/n;}while(!moneyOK(each)||k<=n);
    return {kind:'num',unit:'dollars',answer:each/100,
      fig:receiptFig([[`${k} × ${a.n} at ${money(ca/100)}`,total,'show','tot'],[`Each of ${n} friends`,each,'done']]),
      prompt:`${n} friends order ${k} ${a.pl} at ${money(ca/100)} each and split the cost equally. How much does each friend pay?`,
      hint:`Find the whole bill first (${k} × ${money(ca/100)}), then split it into ${n} equal parts.`,
      misc:[[total/100,`That’s the whole bill. Split it ${n} ways.`],[ca/100,`That’s the price of one ${a.n}. Find the whole bill, then split it.`],[ca/100/n,`Find the price of all ${k} ${a.pl} first.`]],
      explain:`${k} × ${money(ca/100)} = ${money(total/100)}. ${money(total/100)} ÷ ${n} = ${money(each/100)}.`,
      m:{t:'rsplit',cash:[ca],ans:'cash'}};
  }
  const item=pick(PACKS);
  if(type==='deal'){
    /* the better deal: nA for nA × uA cents or nB for nB × uB (sometimes the same unit price) */
    let uA,uB,nA,nB;const same=Math.random()<.15;
    do{uA=pick(US);uB=same?uA:pick(US);nA=pick(NS);nB=pick(NS);}while(nA===nB||nA*uA>1500||nB*uB>1500||(!same&&Math.abs(uA-uB)<10)||!moneyOK(nA*uA)||!moneyOK(nB*uB));
    const ans=uA===uB?'S':uA<uB?'A':'B',each=`Pack A costs ${money(uA/100)} each and Pack B costs ${money(uB/100)} each.`;
    return {kind:'mc',choices:[{id:'A',label:'Pack A'},{id:'B',label:'Pack B'},{id:'S',label:'Same price each'}],answer:ans,
      why:{A:each,B:each,S:each},
      prompt:`Pack A: ${nA} ${item} for ${money(nA*uA/100)}. Pack B: ${nB} ${item} for ${money(nB*uB/100)}. Which is the <b>better deal</b>?`,
      hint:`Find the price of 1 in each pack: divide the price by the number of ${item}.`,
      explain:`A: ${money(nA*uA/100)} ÷ ${nA} = ${money(uA/100)} each. B: ${money(nB*uB/100)} ÷ ${nB} = ${money(uB/100)} each. ${ans==='S'?'They cost the same.':`Pack ${ans} costs less for each one.`}`,
      m:{t:type,cash:[nA*uA,nB*uB,uA,uB]}};
  }
  /* rate: the cost of n2, from the cost of n1 at u cents each */
  let u,n1,n2;do{u=pick(US);n1=pick([2,3,4,5,6]);n2=R(2,10);}while(n1===n2||!moneyOK(n1*u)||!moneyOK(n2*u)||n2*u>2000);
  return {kind:'num',unit:'dollars',answer:n2*u/100,
    prompt:`${n1} ${item} cost ${money(n1*u/100)}. At that price, how much do ${n2} ${item} cost?`,
    hint:`Find the price of 1 first: ${money(n1*u/100)} ÷ ${n1}. Then multiply by ${n2}.`,
    misc:[[n1*u/100+(n2-n1),'Find the price of 1 first, then multiply. Don’t add.'],[u/100,`That’s the price of 1. Now multiply by ${n2}.`]],
    explain:`${money(n1*u/100)} ÷ ${n1} = ${money(u/100)} each. ${n2} × ${money(u/100)} = ${money(n2*u/100)}.`,
    m:{t:type,cash:[n1*u,u],ans:'cash'}};
}

/* ---------- stations ---------- */
/* drop mistake values that happen to equal the answer */
const fin=p=>{if(p.misc)p.misc=p.misc.filter(([x])=>isFinite(x)&&!near(x,p.answer));return p;};
const ICON={
  reg:'<rect x="14" y="6" width="36" height="52" rx="3" fill="rgba(255,201,60,.15)" stroke="#ffc93c" stroke-width="2.5"/><g stroke="#a9c4e4" stroke-width="2"><line x1="20" y1="17" x2="44" y2="17"/><line x1="20" y1="26" x2="44" y2="26"/><line x1="20" y1="35" x2="36" y2="35"/></g><text x="32" y="52" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="11" fill="#7fe3ff">4.25</text>',
  point:'<g fill="rgba(127,227,255,.15)" stroke="#7fe3ff" stroke-width="2"><rect x="4" y="30" width="16" height="24" rx="3"/><rect x="24" y="30" width="16" height="24" rx="3"/><rect x="44" y="30" width="16" height="24" rx="3"/></g><circle cx="22" cy="10" r="5" fill="#ffc93c"/><path d="M22,18 L22,26" stroke="#ffc93c" stroke-width="2.5" stroke-dasharray="3 3"/>',
  weigh:'<line x1="32" y1="14" x2="32" y2="54" stroke="#f3f6fb" stroke-width="3"/><line x1="10" y1="18" x2="54" y2="18" stroke="#f3f6fb" stroke-width="3"/><path d="M3,34 L10,18 L17,34 Z" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="2"/><path d="M47,34 L54,18 L61,34 Z" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2"/><rect x="20" y="54" width="24" height="5" fill="#f3f6fb"/>',
  share:'<circle cx="32" cy="32" r="24" fill="rgba(127,227,255,.15)" stroke="#7fe3ff" stroke-width="2.5"/><path d="M32,8 L32,56 M8,32 L56,32" stroke="#7fe3ff" stroke-width="2.5"/><path d="M32,32 L32,8 A24,24 0 0 1 56,32 Z" fill="rgba(255,201,60,.55)" stroke="#ffc93c" stroke-width="2.5"/>',
  pour:'<path d="M8,14 L34,14 L32,52 L10,52 Z" fill="rgba(127,227,255,.2)" stroke="#7fe3ff" stroke-width="2.5"/><path d="M40,34 L56,34 L54,54 L42,54 Z" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="2.5"/><path d="M34,18 Q44,20 47,30" fill="none" stroke="#7fe3ff" stroke-width="2.5" stroke-dasharray="3 3"/>',
  rush:'<circle cx="32" cy="36" r="20" fill="rgba(255,201,60,.12)" stroke="#ffc93c" stroke-width="3"/><line x1="32" y1="36" x2="32" y2="24" stroke="#f3f6fb" stroke-width="3" stroke-linecap="round"/><line x1="32" y1="36" x2="41" y2="40" stroke="#f3f6fb" stroke-width="3" stroke-linecap="round"/><rect x="27" y="8" width="10" height="6" rx="2" fill="#ffc93c"/>',
  boss:'<rect x="6" y="6" width="52" height="52" rx="4" fill="none" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="5 4"/><polygon points="32,12 38,26 53,27 41,37 45,52 32,43 19,52 23,37 11,27 26,26" fill="#ffc93c"/>'
};
const ZONES=[
  {id:'reg',name:'Cash Register',lessons:'Lessons 1–4',blurb:'Add up orders and make change. Line up the decimal points and regroup.',gen:genAdd},
  {id:'point',name:'Decimal Point Drop',lessons:'Lessons 5–6',blurb:'Tenths times hundredths makes what? Put the decimal point in the right place.',gen:genPoint},
  {id:'weigh',name:'Weigh Station',lessons:'Lessons 7–8',blurb:'Price by the pound, area diagrams, and hundredths grids.',gen:genMul},
  {id:'share',name:'Fair Share',lessons:'Lessons 9–11',blurb:'Partial quotients, and splitting leftovers into tenths.',gen:genDiv},
  {id:'pour',name:'Pour & Cut',lessons:'Lessons 12–13',blurb:'Divide decimals by scaling: 1.8 ÷ 0.3 is the same as 18 ÷ 3.',gen:genDdiv},
  {id:'rush',name:'Rush Order',lessons:'Lesson 14',blurb:'Multi-step orders: totals, change, splitting the bill, and the better deal.',gen:genRush},
  {id:'boss',name:'Dinner Rush',lessons:'Whole unit · 10 problems',blurb:'A mixed review from every station. Aim for 3 stars.',gen:()=>pick([genAdd,genPoint,genMul,genDiv,genDdiv,genRush])()}
];
ZONES.forEach(z=>{const g=z.gen;z.gen=()=>fin(g());});
