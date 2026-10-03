/* Learn Adding and Subtracting within 100 (Grade 2 Unit 2): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
const tensOf=n=>Math.floor(n/10);
/* Base-ten blocks in a row. items: numbers, {n, cls, opt} (opt goes to blocks()), or strings like '+' drawn between them. */
function bpic(items,label){
  let x=6,o='';
  items.forEach(it=>{
    if(typeof it==='string'){o+=`<text class="lbl big" x="${x+14}" y="${10+BLOCK*5}">${it}</text>`;x+=34;return;}
    const {n,t=tensOf(n),u=n%10,cls='a',opt={}}=typeof it==='number'?{n:it}:it,[m,w]=blocks(x,10,t,u,cls,opt);
    o+=m;x+=w+14;
  });
  return svgWrap(Math.max(x,120),BLOCK*10+20,o,label);
}
