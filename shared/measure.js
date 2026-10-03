/* Time and money for K–5 pages: clocks, the day from midnight to midnight, and coins and dollar bills.
   Styles are in measure.css. Needs util.js and figures.js (svgWrap).

   clockFig(h, m, {shade, fives}), hm(h, m), dayBar(at)   a clock face, "3:05", and the day from midnight to midnight
   COINS, moneyFig(list, {vals}), centsOf(list), amt(c)   coins and dollar bills, their total, and "$2 and 35¢" */
/* A clock showing h:m (h 1 to 12). r: radius. shade: [from, to] minutes of the face to color in (a half or a quarter).
   fives: write the minutes (00, 05, … 55) around the outside. */
const hm=(h,m)=>`${h}:${String(m).padStart(2,'0')}`;
function clockFig(h,m,{r=100,shade=null,fives=false,label}={}){
  const c=r+(fives?34:6),f=v=>+v.toFixed(1),pt=(min,d)=>{const a=(min*6-90)*Math.PI/180;return [f(c+d*Math.cos(a)),f(c+d*Math.sin(a))];};
  let o=`<circle class="clk" cx="${c}" cy="${c}" r="${r}"/>`;
  if(shade){const [a,b]=shade,[x1,y1]=pt(a,r-3),[x2,y2]=pt(b,r-3);o+=`<path class="clk-sh" d="M${c},${c}L${x1},${y1}A${r-3},${r-3} 0 ${b-a>30?1:0} 1 ${x2},${y2}Z"/>`;}
  range(60).forEach(i=>{const [x1,y1]=pt(i,r-(i%5?7:14)),[x2,y2]=pt(i,r-3);o+=`<line class="clk-t${i%5?'':' f'}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;});
  range(12).forEach(i=>{const [x,y]=pt(i*5,r*.72);o+=`<text class="clk-n" x="${x}" y="${y}" style="font-size:${f(r*.2)}px">${i||12}</text>`;
    if(fives){const [a,b]=pt(i*5,r+18);o+=`<text class="lbl s cy" x="${a}" y="${b}">${String(i*5).padStart(2,'0')}</text>`;}});
  const [hx,hy]=pt((h%12)*5+m/12,r*.5),[mx,my]=pt(m,r*.8);
  o+=`<line class="clk-h" x1="${c}" y1="${c}" x2="${hx}" y2="${hy}"/><line class="clk-m" x1="${c}" y1="${c}" x2="${mx}" y2="${my}"/><circle class="clk-c" cx="${c}" cy="${c}" r="${f(r*.06)}"/>`;
  return svgWrap(2*c,2*c,o,label||`A clock showing ${hm(h,m)}`);
}

/* The day from midnight to midnight: a.m. from midnight to noon and p.m. from noon to midnight. at: an arrow at that hour (0 to 24), or null. */
function dayBar(at,label){
  const x=v=>14+v*14;
  return svgWrap(364,96,`<rect class="dayam" x="${x(0)}" y="22" width="168" height="34"/><rect class="daypm" x="${x(12)}" y="22" width="168" height="34"/><text class="lbl dk" x="${x(6)}" y="39">a.m.</text><text class="lbl" x="${x(18)}" y="39">p.m.</text>`
    +[[0,'midnight',42],[12,'noon',0],[24,'midnight',-42]].map(([v,t,d])=>`<line class="tick" x1="${x(v)}" y1="16" x2="${x(v)}" y2="62"/><text class="lbl s" x="${x(v)+d}" y="80">${t}</text>`).join('')
    +(at==null?'':`<polygon class="arrh" points="${x(at)},20 ${x(at)-9},4 ${x(at)+9},4"/>`),label||'A bar for the whole day: a.m. from midnight to noon, and p.m. from noon to midnight');
}

/* Coins and dollar bills. COINS: each one's name, plural, value in cents, and radius (sizes follow the real coins: a dime is smallest). */
const COINS={q:{name:'quarter',pl:'quarters',v:25,r:35},d:{name:'dime',pl:'dimes',v:10,r:26},n:{name:'nickel',pl:'nickels',v:5,r:31},p:{name:'penny',pl:'pennies',v:1,r:28},B:{name:'dollar bill',pl:'dollar bills',v:100}};
const centsOf=list=>list.reduce((t,k)=>t+COINS[k].v,0);
/* "$2 and 35¢", "$3", or "35¢" */
const amt=c=>{const d=Math.floor(c/100),r=c%100;return d&&r?`$${d} and ${r}¢`:d?`$${d}`:`${r}¢`;};
/* Money: a list of 'B' (a dollar bill), 'q', 'd', 'n', and 'p', drawn bills first and then coins, in rows no wider than W.
   vals: write what each one is worth under it. */
function moneyFig(list,{vals=false,W=470,label}={}){
  const bills=list.filter(k=>k==='B'),coins=list.filter(k=>k!=='B'),L=vals?22:0;
  let o='',x=6,y=6,w=0,row=0;
  /* place a thing iw wide and ih tall, starting a new row when it doesn't fit */
  const put=(iw,ih)=>{if(x>6&&x+iw>W){x=6;y+=row+10+L;row=0;}const at=[x,y];x+=iw+10;w=Math.max(w,x-4);row=Math.max(row,ih);return at;};
  bills.forEach(()=>{
    const [a,b]=put(118,54);
    o+=`<g class="bill"><rect x="${a}" y="${b}" width="118" height="54" rx="4"/><rect class="in" x="${a+5}" y="${b+5}" width="108" height="44" rx="2"/><ellipse class="in" cx="${a+59}" cy="${b+27}" rx="15" ry="18"/><text x="${a+22}" y="${b+27}">1</text><text x="${a+96}" y="${b+27}">1</text></g>`+(vals?`<text class="lbl s gd" x="${a+59}" y="${b+68}">$1</text>`:'');
  });
  if(bills.length&&coins.length)x=W;
  coins.forEach(k=>{
    const {name,v,r}=COINS[k],[a,b]=put(2*r,70);
    o+=`<g class="cn ${k==='p'?'cu':'ag'}"><circle cx="${a+r}" cy="${b+35}" r="${r}"/><circle class="in" cx="${a+r}" cy="${b+35}" r="${r-5}"/><text x="${a+r}" y="${b+35}">${name.toUpperCase()}</text></g>`+(vals?`<text class="lbl s gd" x="${a+r}" y="${b+84}">${v}¢</text>`:'');
  });
  const say=(n,w)=>n?`${n} ${w}${n>1?'s':''}`:'';
  return svgWrap(w,y+row+6+L,o,label||[say(bills.length,'dollar bill'),say(coins.length,'coin')].filter(Boolean).join(' and '));
}
