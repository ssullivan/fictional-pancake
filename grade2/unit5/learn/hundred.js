/* Learn Numbers to 1,000 (Grade 2 Unit 5), chapter 1: Make a hundred. Its widgets and steps; loaded by hundred.html. */
function wTenTens(el){
  const q=Q(el),st={t:4};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('t','Tens')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const t=st.t;q('t').textContent=t;
    q('f').innerHTML=t===10?htoFig(1,0,0,{cls:{h:'new'}},'10 tens make 1 hundred'):htoFig(0,t,0,{},`${t} tens`);
    q('r').innerHTML=t===10?`<span class="ok"><b>10 tens make 1 hundred!</b> 10, 20, 30, … 100.</span><br><span class="dimline">A hundred is 10 tens put together.</span>`
      :`<b>${t} ${t===1?'ten':'tens'}</b> is <b>${t*10}</b>.<br><span class="dimline">${10-t} more ${10-t===1?'ten':'tens'} to make a hundred.</span>`;
  };
  steppers(el,st,{t:[0,10]},draw);
  draw();
}
const TENSETS=[12,20,27,35,40];
function wMakeHundreds(el){
  const q=Q(el);let p=0,made=false;
  el.innerHTML=seg('Tens',TENSETS.map((t,i)=>[i,`${t} tens`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const t=TENSETS[p],h=Math.floor(t/10),r=t%10;press(el,p);
    q('f').innerHTML=made?htoFig(h,r,0,{cls:{h:'new'}},`${h} hundreds and ${r} tens`):htoFig(0,t,0,{},`${t} tens`);
    q('go').textContent=made?'Break them apart':'Make hundreds';
    q('r').innerHTML=made?`${t} tens is <b>${h} ${h===1?'hundred':'hundreds'}</b>${r?` and <b>${r} ${r===1?'ten':'tens'}</b>`:''}.<br><span class="ok"><b>${t} tens = ${t*10}</b></span>`
      :`<b>${t} tens</b>. Every 10 tens make a hundred.<br><span class="dimline">How many hundreds can you make?</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;made=false;draw();}});
  q('go').onclick=()=>{made=!made;draw();};
  draw();
}
/* the quick checks' figures */
const F={
  seven:htoFig(0,7,0,{},'7 tens'),
  forty:htoFig(0,40,0,{},'40 tens')
};
const STEPS=[
    {title:'10 tens make a hundred',widget:wTenTens,
      body:'<p>A <b>ten</b> is 10 ones in a stick. Put <b>10 tens</b> together and you get a <b>hundred</b>.</p><p>Tap <b>+</b> to add tens until you have a hundred.</p>',
      check:{kind:'num',unit:'tens',answer:3,fig:F.seven,q:'Here are 7 tens. How many more tens do you need to make a hundred?',
        misc:[[7,'That’s how many tens there are now. How many more to get to 10 tens?'],[30,'That’s 30 ones. How many tens is that?'],[10,'10 tens is the whole hundred. You already have 7.']],
        explain:'7 tens and 3 more tens make 10 tens. 10 tens is a hundred.'}},
    {title:'Make hundreds',widget:wMakeHundreds,
      body:'<p>Every 10 tens make a hundred. 20 tens make 2 hundreds. 30 tens make 3 hundreds.</p><p>Pick some tens. Make as many hundreds as you can.</p>',
      check:{kind:'num',unit:'hundreds',answer:4,fig:F.forty,q:'How many hundreds can you make with 40 tens?',
        misc:[[40,'That’s the number of tens. Every 10 tens make 1 hundred.'],[400,'400 is the number. How many hundreds is that?']],
        explain:'10 tens make 1 hundred, so 40 tens make 4 hundreds. That’s 400.'}}
  ];
