/* Learn Numbers to 1,000 (Grade 2 Unit 5), chapter 2: Three-digit numbers. Its widgets and steps; loaded by three-digit.html. */
function wBuild(el){
  const q=Q(el),st={h:2,t:3,o:5};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('h','Hundreds')}${stepper('t','Tens')}${stepper('o','Ones')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {h,t,o}=st,n=h*100+t*10+o;['h','t','o'].forEach(k=>{q(k).textContent=st[k];});
    q('f').innerHTML=numBlocks(n);
    q('r').innerHTML=`${h} hundreds, ${t} tens, ${o} ones<br><span class="ok"><b>${n}</b>: ${numWords(n)}</span>`+(h&&(!t||!o)?`<br><span class="dimline">${!t&&!o?'No tens and no ones: write 0 in both places.':!t?'No tens: write 0 in the tens place.':'No ones: write 0 in the ones place.'}</span>`:'');
  };
  steppers(el,st,{h:[1,9],t:[0,9],o:[0,9]},draw);
  draw();
}
const NAMES=[406,460,517,830];
function wNames(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Number',NAMES.map((n,i)=>[i,n]))+`<p class="eq" data-w></p><div data-c></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const n=NAMES[p],[h,t,o]=digits(n);press(el,p);
    q('w').textContent=numWords(n);q('c').innerHTML=pvChart([['',n]]);q('f').innerHTML=numBlocks(n);
    q('r').innerHTML=`<b>${numWords(n)}</b> is ${h} hundreds, ${t} tens, and ${o} ones: <b>${n}</b>.`+(!t||!o?`<br><span class="dimline">There are no ${!t?'tens':'ones'}, so that place gets a 0.</span>`:'');
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  n205:htoFig(2,0,5,{cls:{t:'b',o:'c'}},'2 hundreds and 5 ones')
};
const STEPS=[
    {title:'Hundreds, tens, and ones',widget:wBuild,
      body:'<p>A three-digit number tells how many <b>hundreds</b>, <b>tens</b>, and <b>ones</b>. In 235, the 2 means 2 hundreds.</p><p>Change the blocks and watch the number.</p>',
      check:{kind:'num',answer:205,fig:F.n205,q:'What number do the blocks show?',
        misc:[[25,'The big squares are hundreds. 2 hundreds is 200.'],[250,'There are no tens, so the tens place is 0.'],[7,'Each big square is 100, and each small square is 1.']],
        explain:'2 hundreds, 0 tens, and 5 ones is 205.'}},
    {title:'Number names',widget:wNames,
      body:'<p>We say a number the way we write it: hundreds first, then the rest. <b>517</b> is “five hundred seventeen”.</p><p>Pick a number to see its name and its places.</p>',
      check:{kind:'mc',q:'Which number is four hundred six?',
        choices:[{id:'a',label:'460'},{id:'b',label:'406'},{id:'c',label:'4,006'}],answer:'b',
        why:{a:'460 is four hundred sixty. Six is ones, not tens.',c:'Four hundred is 400. It only needs three digits: 4 hundreds, 0 tens, 6 ones.'},
        explain:'Four hundred six is 4 hundreds, 0 tens, and 6 ones: 406.'}}
  ];
