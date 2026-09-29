/* Learn Arithmetic in Base Ten (Grade 6 Unit 5), chapter 1: Adding and subtracting decimals. Its widgets and steps; loaded by add-subtract.html. */
const pl=(n,w)=>`${n} ${w}${n===1?'':'s'}`;
/* a number drawn as tenth strips and hundredth squares, from x; returns [markup, width] */
function pieces(t,h,x){
  let o='';
  for(let i=0;i<t;i++)o+=`<rect class="bt-t" x="${x+i*14}" y="10" width="10" height="100"/>`;
  const hx=x+t*14+(t?8:0);
  for(let i=0;i<h;i++)o+=`<rect class="bt-h" x="${hx+Math.floor(i/5)*14}" y="${100-(i%5)*14}" width="10" height="10"/>`;
  return [o,hx+Math.ceil(h/5)*14-x];
}
function wBundle(el){
  const q=Q(el),st={at:4,ah:7,bt:3,bh:8};
  el.innerHTML=`<div class="wrow">${stepper('at','First: tenths')}${stepper('ah','First: hundredths')}</div><div class="wrow">${stepper('bt','Second: tenths')}${stepper('bh','Second: hundredths')}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {at,ah,bt,bh}=st,A=(10*at+ah)/100,B=(10*bt+bh)/100,T=at+bt,H=ah+bh;
    ['at','ah','bt','bh'].forEach(k=>q(k).textContent=st[k]);
    const [pa,wa]=pieces(at,ah,10),[pb,wb]=pieces(bt,bh,10+wa+40);
    q('f').innerHTML=svgWrap(Math.max(60+wa+wb,120),120,pa+`<text class="ftxt big mid" x="${10+wa+20}" y="66">+</text>`+pb,`${fmt(A)} and ${fmt(B)} in strips (tenths) and small squares (hundredths)`);
    const c=H>=10?1:0,T2=T+c;
    q('r').innerHTML=`${fmt(A)} + ${fmt(B)} is ${pl(T,'tenth')} and ${pl(H,'hundredth')}.`
      +(c?`<br>Bundle 10 hundredths into 1 tenth: ${pl(T2,'tenth')} and ${pl(H-10,'hundredth')}.`:'')
      +(T2>=10?`<br>Bundle 10 tenths into 1 one: 1 one, ${pl(T2-10,'tenth')}, and ${pl(H-10*c,'hundredth')}.`:'')
      +`<br><b>${fmt(A)} + ${fmt(B)} = ${fmt(A+B)}</b>`;
  };
  steppers(el,st,{at:[0,9],ah:[0,9],bt:[0,9],bh:[0,9]},draw);
  draw();
}

/* decimal points lined up, with zeros filled in */
const SUMS=[[2.5,0.75,'+'],[3,1.25,'−'],[10,0.4,'−'],[1.23,4.5,'+']];
function wColumns(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Problem',SUMS.map(([a,b,op],i)=>[i,`${fmt(a)} ${op} ${fmt(b)}`]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b,op]=SUMS[p],r=op==='+'?a+b:a-b,k=Math.max(places(a),places(b));press(el,p);
    q('f').innerHTML=columns([a,b],op,r);
    const fill=[a,b].filter(n=>places(n)<k).map(n=>`${fmt(n)} as ${n.toFixed(k)}`);
    q('r').innerHTML=`Line up the decimal points, so ones are over ones and tenths over tenths.${fill.length?` Write ${fill.join(' and ')}.`:''}<br><b>${fmt(a)} ${op} ${fmt(b)} = ${fmt(r)}</b>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

const STEPS=[
  {title:'Bundle ten hundredths',widget:wBundle,
    body:'<p>A strip is 1 tenth (0.1) and a small square is 1 hundredth (0.01). To add, put tenths with tenths and hundredths with hundredths. Ten hundredths make 1 tenth, and ten tenths make 1 one.</p><p>Change the two numbers.</p>',
    check:{kind:'num',unit:'',answer:0.85,q:'What is 0.47 + 0.38?',
      misc:[[0.715,'You wrote 7 tenths, then 15 hundredths after it. 15 hundredths is 1 tenth and 5 hundredths: bundle them.'],[0.75,'You left out the bundled tenth: 7 + 8 = 15 hundredths, which is 1 tenth and 5 hundredths.'],[8.5,'That’s 85 tenths. 0.47 + 0.38 is less than 1.']],
      explain:'4 + 3 = 7 tenths and 7 + 8 = 15 hundredths. Bundle 10 hundredths into a tenth: 8 tenths and 5 hundredths = 0.85.'}},
  {title:'Line up the decimal points',widget:wColumns,
    body:'<p>To add or subtract in columns, line up the decimal points so each digit sits over the same place. Fill in zeros so every number has the same number of places: 3 is 3.00.</p><p>Pick a problem.</p>',
    check:{kind:'num',unit:'liters',answer:1.25,q:'A bottle has 2 liters of juice. Jada pours out 0.75 liters. How many liters are left?',
      misc:[[2.75,'You subtracted the smaller digit from the bigger one in each column. Write 2 as 2.00 and regroup.'],[0.55,'You lined the 2 up with the tenths. 2 is 2 ones: 2.00 − 0.75.']],
      explain:'2.00 − 0.75 = 1.25 liters.'}}
];
