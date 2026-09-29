/* Learn Extending Operations to Fractions (Grade 4 Unit 3), chapter 6: Tenths and hundredths. Its widgets and steps; loaded by tenths-hundredths.html. */
/* shade tenths, one column each, and count them in hundredths */
function wTenths(el){
  const q=Q(el),st={t:3},lim={t:[0,10]};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('t','Tenths')}</div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const t=st.t;q('t').textContent=t;
    q('f').innerHTML=hundredGrid(cellsOf([10*t,'a']),{label:`A hundred grid with ${t} of 10 columns shaded: ${10*t} of 100 squares`});
    q('e').innerHTML=`${fr(t,10)} = ${fr(10*t,100)}`+(t===10?' = 1':'');
    q('r').innerHTML=`${partName(10,t)} ${t===1?'is':'are'} <b>${partName(100,10*t)}</b>.`+(t===10?' <span class="ok">All 10 tenths make 1 whole: 100 hundredths.</span>':'')
      +`<br><span class="dimline">Each column is 1 tenth of the square, and it’s made of 10 hundredths. ${t} × 10 = ${10*t}.</span>`;
  };
  steppers(el,st,lim,draw);
  draw();
}
/* a/10 + b/100: write the tenths as hundredths, then add */
const TH=[[3,25],[6,7],[4,45],[2,8]];
function wAddTH(el){
  const q=Q(el);let p=0,rw=false;
  el.innerHTML=seg('Add',TH.map(([a,b],i)=>[i,`${fr(a,10)} + ${fr(b,100)}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Write the tenths as hundredths</button></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=TH[p],s=10*a+b;press(el,p);q('go').disabled=rw;
    q('f').innerHTML=hundredGrid(cellsOf([10*a,'a'],[b,'b']),{label:`A hundred grid with ${a} tenths shaded gold and ${b} hundredths shaded blue`});
    q('e').innerHTML=`${fr(a,10)} + ${fr(b,100)} = `+(rw?`${fr(10*a,100)} + ${fr(b,100)} = <b>${fr(s,100)}</b>`:'?');
    q('r').innerHTML=!rw?`Tenths and hundredths are different sizes, so you can’t just add ${a} + ${b}. Write the ${PART[10][a>1?1:0]} as hundredths first.`
      :`<span class="ok">${partName(10,a)} ${a===1?'is':'are'} ${partName(100,10*a)}. ${10*a} + ${b} = ${s}, so the sum is <b>${partName(100,s)}</b>.</span>`;
  };
  q('go').onclick=()=>{rw=true;draw();};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;rw=false;draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  fence:hundredGrid(cellsOf([40,'a'],[35,'b']),{label:'A hundred grid with 4 columns shaded gold and 35 more squares shaded blue'})
};
const STEPS=[
    {title:'Tenths are hundredths',widget:wTenths,
      body:'<p>Cut 1 whole into 10 equal columns and each is 1 <b>tenth</b>. Cut every column into 10 squares and there are 100 squares: each is 1 <b>hundredth</b>. 1 tenth is 10 hundredths, so '+fr(3,10)+' = '+fr(30,100)+'.</p><p>Change how many tenths are shaded.</p>',
      check:{kind:'num',unit:'hundredths',answer:70,q:'A dime is '+fr(1,10)+' of a dollar, and a penny is '+fr(1,100)+' of a dollar. 7 dimes is how many hundredths of a dollar?',
        misc:[[7,'7 is how many tenths. Each tenth is 10 hundredths.'],[700,'Each tenth is 10 hundredths, not 100. 7 dimes is 7 × 10 pennies.']],
        explain:'Each tenth is 10 hundredths, so '+fr(7,10)+' = '+fr(70,100)+'. 7 dimes is worth the same as 70 pennies.'}},
    {title:'Add tenths and hundredths',widget:wAddTH,
      body:'<p>To add tenths and hundredths, first make the parts the same size. Write the tenths as hundredths, then add: '+fr(3,10)+' + '+fr(25,100)+' = '+fr(30,100)+' + '+fr(25,100)+' = '+fr(55,100)+'.</p><p>Pick a sum, then write the tenths as hundredths.</p>',
      check:{kind:'num',unit:'hundredths',answer:75,fig:F.fence,q:'Lin painted '+fr(4,10)+' of a fence on Monday and '+fr(35,100)+' of it on Tuesday. How many hundredths of the fence has Lin painted?',
        misc:[[39,'You added 4 and 35, but 4 tenths is 40 hundredths.'],[35,'That’s just Tuesday. Add Monday’s '+fr(4,10)+', which is '+fr(40,100)+'.']],
        explain:fr(4,10)+' = '+fr(40,100)+', and '+fr(40,100)+' + '+fr(35,100)+' = '+fr(75,100)+'. Lin has painted 75 hundredths of the fence.'}}
  ];
