/* Learn Arithmetic in Base Ten (Grade 6 Unit 5), chapter 3: Area diagrams and grids. Its widgets and steps; loaded by area-models.html. */
/* a 1 m by 1 m square in hundredths, with a w-tenths by h-tenths rectangle shaded from the bottom left */
function grid(w,h){
  const c=24,x0=58,y0=28,N=10*c;let o='';
  for(let i=0;i<10;i++)for(let j=0;j<10;j++)o+=`<rect class="${i<w&&j>=10-h?'shade':'cell'}" x="${x0+i*c}" y="${y0+j*c}" width="${c}" height="${c}"/>`;
  o+=`<rect class="frame" x="${x0}" y="${y0}" width="${N}" height="${N}"/><rect class="frame" style="stroke:var(--gold)" x="${x0}" y="${y0+N-h*c}" width="${w*c}" height="${h*c}"/>`;
  o+=`<text class="ftxt mid" x="${x0+N/2}" y="${y0-10}">1 m</text><text class="ftxt mid" x="${x0+w*c/2}" y="${y0+N+22}">${fmt(w/10)} m</text><text class="ftxt" text-anchor="end" x="${x0-8}" y="${y0+N-h*c/2+5}">${fmt(h/10)} m</text>`;
  return svgWrap(x0+N+20,y0+N+34,o,`A 1 meter square in hundredths, with ${fmt(w/10)} by ${fmt(h/10)} meters shaded`);
}
function wGrid(el){
  const q=Q(el),st={w:6,h:3};
  el.innerHTML=`<div class="wrow">${stepper('w','Width (tenths)')}${stepper('h','Height (tenths)')}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {w,h}=st;q('w').textContent=w;q('h').textContent=h;
    q('f').innerHTML=grid(w,h);
    q('r').innerHTML=`${fmt(w/10)} m × ${fmt(h/10)} m = ${w} × ${h} = <b>${w*h} hundredth${w*h===1?'':'s'}</b> of a square meter = <b>${fmt(w*h/100)} square meters</b>.`+(w*h===100?`<br><span class="ok">The whole square: 1 square meter.</span>`:'');
  };
  steppers(el,st,{w:[1,10],h:[1,10]},draw);
  draw();
}

/* a price times a weight, split into the whole pounds and the part of a pound */
const BUY=[{what:'grapes',price:2.4,lb:1.5},{what:'cherries',price:3.2,lb:2.5},{what:'apples',price:1.8,lb:3.5}];
function wParts(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Buy',BUY.map((b,i)=>[i,`${fmt(b.lb)} lb of ${b.what}`]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {what,price,lb}=BUY[p],w=Math.floor(lb),d=Math.round((lb-w)*10)/10,A=price*w,B=price*d;press(el,p);
    const W=380,x0=70,y0=34,H=110,w1=W*w/lb,w2=W-w1;
    q('f').innerHTML=svgWrap(W+x0+20,y0+H+20,`<rect class="part-a" x="${x0}" y="${y0}" width="${w1}" height="${H}"/><rect class="part-b" x="${x0+w1}" y="${y0}" width="${w2}" height="${H}"/>`
      +`<text class="ftxt big mid" x="${x0+w1/2}" y="${y0-12}">${w}</text><text class="ftxt big mid" x="${x0+w1+w2/2}" y="${y0-12}">${fmt(d)}</text><text class="ftxt big mid" x="${x0-34}" y="${y0+H/2+7}">${money(price)}</text>`
      +`<text class="ftxt big mid rev" x="${x0+w1/2}" y="${y0+H/2+7}">${money(A)}</text><text class="ftxt big mid rev" x="${x0+w1+w2/2}" y="${y0+H/2+7}">${money(B)}</text>`,`${money(price)} times ${w} and ${fmt(d)} pounds, split into two rectangles`);
    q('r').innerHTML=`${fmt(lb)} pounds is ${w} + ${fmt(d)}.<br>${money(price)} × ${w} = ${money(A)} and ${money(price)} × ${fmt(d)} = ${money(B)}.<br><b>${fmt(lb)} pounds of ${what} cost ${money(A+B)}.</b>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

const STEPS=[
  {title:'Multiply on a hundredths grid',widget:wGrid,
    body:'<p>A 1 meter by 1 meter square split into 100 small squares shows hundredths. A rectangle 0.6 m by 0.3 m covers 6 × 3 = 18 small squares: 0.18 square meters.</p><p>Change the width and the height.</p>',
    check:{kind:'num',unit:'square meters',answer:0.28,q:'A rectangle is 0.4 m wide and 0.7 m tall. What is its area?',
      misc:[[28,'4 × 7 = 28 small squares, and each is a hundredth of a square meter: 0.28.'],[1.1,'That’s 0.4 + 0.7, the two sides added. Area multiplies them.'],[0.028,'Tenths times tenths make hundredths, not thousandths: 28 hundredths.']],
      explain:'0.4 × 0.7 = 4 × 7 hundredths = 28 hundredths = 0.28 square meters.'}},
  {title:'Split it into parts',widget:wParts,
    body:'<p>To multiply a price by a weight like 1.5 pounds, split the weight: 1 pound and 0.5 pound. Find each part and add. The two rectangles together are the whole product.</p><p>Pick something to buy.</p>',
    check:{kind:'num',unit:'dollars',answer:3.6,q:'Grapes cost $2.40 a pound. How much do 1.5 pounds cost?',
      misc:[[36,'Put the decimal point back: 24 × 15 = 360, with 2 decimal places, is 3.60.'],[3.9,'That’s $2.40 + 1.5. Multiply: 1 pound is $2.40 and half a pound is $1.20.'],[2.4,'That’s just 1 pound. Add the half pound: $1.20.']],
      explain:'1 pound is $2.40 and 0.5 pound is $1.20. $2.40 + $1.20 = $3.60.'}}
];
