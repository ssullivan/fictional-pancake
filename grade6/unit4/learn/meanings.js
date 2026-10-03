/* Learn Dividing Fractions (Grade 6 Unit 4), chapter 1: Making sense of division. Its widgets and steps; loaded by meanings.html. */
/* the numbers to divide 12 by, smaller and smaller */
const DIVS=[frac(24),frac(12),frac(6),frac(4),frac(2),frac(1),frac(1,2),frac(1,4)];
/* 12 divided by smaller and smaller numbers: how many of each fit. */
function wSize(el){
  const q=Q(el);let divisorIndex=3;
  el.innerHTML=seg('Divide 12 by',DIVS.map((v,i)=>[i,fx(v)]))+`<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const b=DIVS[divisorIndex],v=fVal(b),quotient=fDiv(frac(12),b);press(el,divisorIndex);
    q('f').innerHTML=groupTape(frac(12),b,{label:`Tape diagram: 12 with groups of ${ftx(b)} marked`});
    q('e').innerHTML=`12 ÷ ${fx(b)} = ${fx(quotient)}`;
    q('r').innerHTML=(v>12?`${fx(b)} is more than 12, so not even 1 group of ${fx(b)} fits in 12: the quotient is <b>less than 1</b>.`
      :v===12?`${fx(b)} is the same as 12, so exactly 1 group fits: the quotient is <b>1</b>.`
      :`${fx(b)} is less than 12, so more than 1 group of ${fx(b)} fits in 12: the quotient is <b>more than 1</b>.`)
      +`<br><span class="dimline">The smaller the divisor, the more groups fit, and the bigger the quotient. Dividing by a number less than 1 gives more than you started with.</span>`;
  };
  onPick(el,id=>{divisorIndex=+id;draw();});
  draw();
}

/* the numbers of boxes, or bagels in each */
const BOX_N=[2,3,4,6,8];
/* 24 bagels: shared into n boxes, or n in each box (one row of choices for each). */
function wMeaning(el){
  /* how: 'share' into n boxes, or 'fill' boxes with n each */
  const q=Q(el);let how='share',n=3;
  el.innerHTML=`<div data-top>${seg('How',[['share','Share into boxes'],['fill','Fill boxes']])}</div><div data-bot>${seg('Number',BOX_N.map(v=>[v,String(v)]))}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const m=24/n;
    q('top').querySelectorAll('[data-m]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===how));
    q('bot').querySelectorAll('[data-m]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===String(n)));
    if(how==='share'){
      q('f').innerHTML=oneGroup(n,n,{each:String(m),whole:'24 bagels',label:`Tape diagram: 24 bagels in ${n} equal boxes of ${m}`});
      q('e').innerHTML=`${n} × <span class="q">?</span> = 24, so 24 ÷ ${n} = ${m}`;
      q('r').innerHTML=`24 bagels are shared equally into <b>${n} boxes</b>. 24 ÷ ${n} = ${m}: <b>${m} bagels in each box</b>.<br><span class="dimline">You know how many groups. Division finds how much is in each group.</span>`;
    }else{
      q('f').innerHTML=oneGroup(m,m,{each:String(n),whole:'24 bagels',label:`Tape diagram: 24 bagels in ${m} boxes of ${n}`});
      q('e').innerHTML=`<span class="q">?</span> × ${n} = 24, so 24 ÷ ${n} = ${m}`;
      q('r').innerHTML=`24 bagels go into boxes, <b>${n} in each box</b>. 24 ÷ ${n} = ${m}: <b>${m} boxes</b>.<br><span class="dimline">You know how much is in each group. Division finds how many groups.</span>`;
    }
  };
  el.addEventListener('click',e=>{const [row,id]=segHit(e,['top','bot'])||[];if(!row)return;if(row==='top')how=id;else n=+id;draw();});
  draw();
}

/* groups, size of a group, and total: any one can be the unknown */
const KINDS=[
  {id:'total',label:'How much in all?',fig:()=>oneGroup(3,3,{each:[frac(13,2),'oz'],q:'whole',label:'Tape diagram: 3 bottles of 6 1/2 ounces, total unknown'}),
    eq:`3 × 6 ${fr(1,2)} = <span class="q">?</span>`,say:`3 bottles hold 6 ${fr(1,2)} ounces each. The groups and the size of each are known, so multiply: 3 × 6 ${fr(1,2)} = <b>19 ${fr(1,2)} ounces</b>.`},
  {id:'each',label:'How much in each?',fig:()=>oneGroup(6,6,{whole:[frac(20),'oz'],q:'each',label:'Tape diagram: 20 ounces in 6 equal bottles, each unknown'}),
    eq:`6 × <span class="q">?</span> = 20, so 20 ÷ 6 = <span class="q">?</span>`,say:`20 ounces of water fill 6 bottles equally. The total and the number of groups are known, so divide: 20 ÷ 6 = <b>3 ${fr(1,3)} ounces</b> in each.`},
  {id:'groups',label:'How many groups?',fig:()=>groupTape(frac(40),frac(12),{label:'Tape diagram: 40 ounces in groups of 12'}),
    eq:`<span class="q">?</span> × 12 = 40, so 40 ÷ 12 = <span class="q">?</span>`,say:`40 ounces of water, 12 ounces in each bottle. The total and the size of each group are known, so divide: 40 ÷ 12 = <b>3 ${fr(1,3)} bottles</b> (3 full and ${fr(1,3)} of another).`},
];
/* Pick which one is unknown to see its tape, equation, and operation. */
function wKinds(el){
  const q=Q(el);let unknown='total';
  el.innerHTML=seg('Unknown',KINDS.map(kind=>[kind.id,kind.label]))+`<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const kind=KINDS.find(x=>x.id===unknown);press(el,unknown);
    q('f').innerHTML=kind.fig();q('e').innerHTML=kind.eq;
    q('r').innerHTML=`${kind.say}<br><span class="dimline">Number of groups × size of each group = total. When the total is known, divide it to find either of the others.</span>`;
  };
  onPick(el,id=>{unknown=id;draw();});
  draw();
}

const STEPS=[
  {title:'Size of the divisor, size of the quotient',widget:wSize,
    body:'<p>In 12 ÷ 4 = 3, 12 is the <b>dividend</b>, 4 is the <b>divisor</b>, and 3 is the <b>quotient</b>. You can tell a lot about the quotient without computing: how many divisors fit in the dividend?</p><p>Divide 12 by bigger and smaller numbers.</p>',
    check:{kind:'mc',q:'Without computing: is 100 ÷ '+fr(1,1000)+' much less than 1, close to 1, or much more than 1?',
      choices:[{id:'a',label:'Much less than 1'},{id:'b',label:'Close to 1'},{id:'c',label:'Much more than 1'}],answer:'c',
      why:{a:fr(1,1000)+' is tiny, so a huge number of them fit in 100. The quotient is much more than 1.',b:'100 and '+fr(1,1000)+' are far apart, not nearly equal, so the quotient isn’t close to 1.'},
      explain:'1 has 1,000 thousandths, so 100 has 100,000 of them: 100 ÷ '+fr(1,1000)+' = 100,000, much more than 1.'}},
  {title:'Two meanings of division',widget:wMeaning,
    body:'<p>24 ÷ 3 = 8 can answer two different questions. If 24 bagels are shared into 3 boxes, 8 is how many are <b>in each box</b>. If 24 bagels go 3 to a box, 8 is <b>how many boxes</b>.</p><p>Switch between the two meanings, and try other numbers.</p>',
    check:{kind:'mc',q:'36 screws are put into bags, with 4 screws in each bag. 36 ÷ 4 = 9. What does the 9 mean?',
      choices:[{id:'a',label:'9 bags'},{id:'b',label:'9 screws in each bag'},{id:'c',label:'9 screws left over'}],answer:'a',
      why:{b:'Each bag gets 4 screws: that’s the size of a group. The 9 is how many groups (bags) there are.',c:'4 × 9 = 36, so nothing is left over.'},
      explain:'The size of each group (4 screws) is known, so 36 ÷ 4 finds the number of groups: 9 bags. 9 × 4 = 36.'}},
  {title:'Groups, size, and total',widget:wKinds,
    body:'<p>Every equal-groups problem has three amounts: the <b>number of groups</b>, the <b>size of each group</b>, and the <b>total</b>. Multiply when the total is unknown. Divide when the number of groups or the size of a group is unknown.</p><p>Pick which amount is unknown.</p>',
    check:{kind:'mc',q:'Mai has $36 to spend on movie tickets. Each ticket costs $4.50. Which equation finds how many tickets Mai can buy?',
      choices:[{id:'a',label:'? × 4.50 = 36'},{id:'b',label:'36 × 4.50 = ?'},{id:'c',label:'? × 36 = 4.50'}],answer:'a',
      why:{b:'That finds a total, but the total ($36) is already known. The unknown is how many tickets.',c:'Each ticket costs $4.50 and the total is $36, so the groups of $4.50 make 36, not the other way around.'},
      explain:'? tickets × $4.50 each = $36, so 36 ÷ 4.50 = 8 tickets.'}}
];
