/* Learn Arithmetic in Base Ten (Grade 6 Unit 5), chapter 2: Where the decimal point goes. Its widgets and steps; loaded by decimal-point.html. */
const PLACE=['ones','tenths','hundredths','thousandths','ten-thousandths'];
const DEN=['1','10','100','1,000','10,000'];
/* a decimal as a whole number over 10, 100, …: 0.06 is 6 over 100 */
const asInt=n=>Math.round(n*10**places(n));

/* each factor as a fraction: tenths times tenths make hundredths */
const FRAC=[[0.3,0.2],[0.4,0.02],[1.5,0.4],[0.06,0.5]];
function wFraction(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Multiply',FRAC.map(([a,b],i)=>[i,`${fmt(a)} × ${fmt(b)}`]))+`<p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=FRAC[p],pa=places(a),pb=places(b),k=pa+pb,ia=asInt(a),ib=asInt(b);press(el,p);
    q('r').innerHTML=`${fmt(a)} × ${fmt(b)} = ${ia}/${DEN[pa]} × ${ib}/${DEN[pb]} = <b>${ia*ib}/${DEN[k]}</b> = <b>${fmt(a*b)}</b><br><span class="dimline">${PLACE[pa]} times ${PLACE[pb]} make ${PLACE[k]}.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

/* multiply as whole numbers, then put back all the decimal places */
const COUNT=[[1.25,0.4],[2.5,0.12],[0.35,0.2],[12,0.05]];
function wPlaces(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Multiply',COUNT.map(([a,b],i)=>[i,`${fmt(a)} × ${fmt(b)}`]))+`<p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=COUNT[p],pa=places(a),pb=places(b),k=pa+pb,P=asInt(a)*asInt(b),r=P/10**k,full=r.toFixed(k);press(el,p);
    q('r').innerHTML=`Multiply without the decimal points: ${asInt(a)} × ${asInt(b)} = <b>${P}</b>.<br>${fmt(a)} has ${pl2(pa)} and ${fmt(b)} has ${pl2(pb)}: ${pl2(k)} in all.<br>So ${fmt(a)} × ${fmt(b)} = <b>${full}</b>${full!==fmt(r)?` = <b>${fmt(r)}</b>`:''}.`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}
const pl2=n=>`${n} decimal place${n===1?'':'s'}`;

const STEPS=[
  {title:'Tenths times tenths',widget:wFraction,
    body:'<p>Write each decimal as a fraction. 0.3 × 0.2 is 3/10 × 2/10 = 6/100, which is 0.06. Tenths times tenths make <b>hundredths</b>, so the product is smaller than either number.</p><p>Pick a product.</p>',
    check:{kind:'num',unit:'',answer:0.08,q:'What is 0.4 × 0.2?',
      misc:[[0.8,'Tenths times tenths make hundredths: 4 × 2 = 8 hundredths.'],[8,'4 × 2 = 8, but these are tenths times tenths: 8 hundredths.'],[0.6,'That’s 0.4 + 0.2. Multiply: 4/10 × 2/10.']],
      explain:'0.4 × 0.2 = 4/10 × 2/10 = 8/100 = 0.08.'}},
  {title:'Count the decimal places',widget:wPlaces,
    body:'<p>A quick way: multiply as if there were no decimal points, then put back as many decimal places as the two numbers have together. Zeros at the end of the answer can go: 0.500 is 0.5.</p><p>Pick a product.</p>',
    check:{kind:'mc',q:'Which is 2.5 × 0.12?',
      choices:[{id:'a',label:'0.3'},{id:'b',label:'3'},{id:'c',label:'0.03'}],answer:'a',
      why:{b:'25 × 12 = 300, and there are 3 decimal places to put back: 0.300.',c:'Count the places: 2.5 has 1 and 0.12 has 2, so 3 in all. 300 becomes 0.300, which is 0.3.'},
      explain:'25 × 12 = 300. 3 decimal places in all: 0.300 = 0.3.'}}
];
