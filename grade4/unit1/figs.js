/* Pictures that Grade 4 Unit 1's game and its Learn pages both use. Styles are in figs.css. Needs util.js and figures.js (svgWrap).

   lockers(open, {hi, sel})          the Locker Problem's 20 lockers, open or closed (svg) */
function lockers(open,{hi=[],sel=null}={}){
  const L=28,G=2,H=64;let o='';
  range(20).forEach(i=>{
    const v=i+1,x=2+i%10*(L+G),y=4+Math.floor(i/10)*(H+34);
    o+=`<g data-v="${v}"><rect class="lk${open[v]?' open':''}${hi.includes(v)?' hi':''}${v===sel?' sel':''}" x="${x}" y="${y}" width="${L}" height="${H}" rx="2"/>`
      +(open[v]?`<polygon class="door" points="${x},${y} ${x+9},${y+8} ${x+9},${y+H-8} ${x},${y+H}"/>`:`<path class="vent" d="M${x+7},${y+10}h14M${x+7},${y+15}h14M${x+7},${y+20}h14"/>`)
      +`<text class="lbl s${v===sel?' cy':''}" x="${x+L/2}" y="${y+H+16}">${v}</text></g>`;
  });
  return svgWrap(10*(L+G)+2,2*(H+34),o,'20 lockers. Open: '+(range(20).filter(i=>open[i+1]).map(i=>i+1).join(', ')||'none'));
}
