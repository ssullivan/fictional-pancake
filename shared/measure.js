/* Time and money for K–5 pages: clocks, the day from midnight to midnight, and coins and dollar bills.
   Styles are in measure.css. Needs util.js and figures.js (svgWrap).

   clockFig(h, m, {shade, fives}), hm(h, m), dayBar(at)   a clock face, "3:05", and the day from midnight to midnight
   COINS, moneyFig(list, {vals}), centsOf(list), amt(c)   coins and dollar bills, their total, and "$2 and 35¢" */
/* A clock showing h:m (h 1 to 12). r: radius. shade: [from, to] minutes of the face to color in (a half or a quarter).
   fives: write the minutes (00, 05, … 55) around the outside. */
/* "3:05" */
const hm=(h,m)=>`${h}:${String(m).padStart(2,'0')}`;
function clockFig(h,m,{r=100,shade=null,fives=false,label}={}){
  /* center: the middle of the clock (both x and y), with room outside the face for the fives */
  const center=r+(fives?34:6),round1=v=>+v.toFixed(1),
    /* the point at minute `min` on the face (0 at the top, going clockwise), dist from the center */
    at=(min,dist)=>{const a=(min*6-90)*Math.PI/180;return [round1(center+dist*Math.cos(a)),round1(center+dist*Math.sin(a))];};
  let markup=`<circle class="clk" cx="${center}" cy="${center}" r="${r}"/>`;
  if(shade){
    /* a wedge from minute `from` to minute `to`; more than 30 minutes takes the long way round */
    const [from,to]=shade,[x1,y1]=at(from,r-3),[x2,y2]=at(to,r-3);
    markup+=`<path class="clk-sh" d="M${center},${center}L${x1},${y1}A${r-3},${r-3} 0 ${to-from>30?1:0} 1 ${x2},${y2}Z"/>`;
  }
  /* a tick for each minute, longer (f) at every 5 */
  range(60).forEach(i=>{const [x1,y1]=at(i,r-(i%5?7:14)),[x2,y2]=at(i,r-3);markup+=`<line class="clk-t${i%5?'':' f'}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;});
  range(12).forEach(i=>{
    const [x,y]=at(i*5,r*.72);
    markup+=`<text class="clk-n" x="${x}" y="${y}" style="font-size:${round1(r*.2)}px">${i||12}</text>`;
    if(fives){const [fx,fy]=at(i*5,r+18);markup+=`<text class="lbl s cy" x="${fx}" y="${fy}">${String(i*5).padStart(2,'0')}</text>`;}
  });
  /* the hour hand moves between the hours as the minutes go by: 5 minute-marks an hour, plus m/12 */
  const [hourX,hourY]=at((h%12)*5+m/12,r*.5),[minX,minY]=at(m,r*.8);
  markup+=`<line class="clk-h" x1="${center}" y1="${center}" x2="${hourX}" y2="${hourY}"/><line class="clk-m" x1="${center}" y1="${center}" x2="${minX}" y2="${minY}"/>`
    +`<circle class="clk-c" cx="${center}" cy="${center}" r="${round1(r*.06)}"/>`;
  return svgWrap(2*center,2*center,markup,label||`A clock showing ${hm(h,m)}`);
}

/* The day from midnight to midnight: a.m. from midnight to noon and p.m. from noon to midnight. at: an arrow at that hour (0 to 24), or null. */
function dayBar(at,label){
  /* 14 pixels an hour */
  const xOf=hour=>14+hour*14;
  const halves=`<rect class="dayam" x="${xOf(0)}" y="22" width="168" height="34"/><rect class="daypm" x="${xOf(12)}" y="22" width="168" height="34"/>`
    +`<text class="lbl dk" x="${xOf(6)}" y="39">a.m.</text><text class="lbl" x="${xOf(18)}" y="39">p.m.</text>`;
  /* ticks at midnight, noon, and midnight, each name nudged inward so it fits */
  const ticks=[[0,'midnight',42],[12,'noon',0],[24,'midnight',-42]].map(([hour,name,nudge])=>
    `<line class="tick" x1="${xOf(hour)}" y1="16" x2="${xOf(hour)}" y2="62"/><text class="lbl s" x="${xOf(hour)+nudge}" y="80">${name}</text>`).join('');
  const arrow=at==null?'':`<polygon class="arrh" points="${xOf(at)},20 ${xOf(at)-9},4 ${xOf(at)+9},4"/>`;
  return svgWrap(364,96,halves+ticks+arrow,label||'A bar for the whole day: a.m. from midnight to noon, and p.m. from noon to midnight');
}

/* Coins and dollar bills. COINS: each one's name, plural, value in cents, and radius (sizes follow the real coins: a dime is smallest). */
const COINS={q:{name:'quarter',pl:'quarters',v:25,r:35},d:{name:'dime',pl:'dimes',v:10,r:26},n:{name:'nickel',pl:'nickels',v:5,r:31},p:{name:'penny',pl:'pennies',v:1,r:28},B:{name:'dollar bill',pl:'dollar bills',v:100}};
/* the total of a list of COINS keys, in cents */
const centsOf=list=>list.reduce((t,k)=>t+COINS[k].v,0);
/* "$2 and 35¢", "$3", or "35¢" */
const amt=cents=>{const dollars=Math.floor(cents/100),left=cents%100;return dollars&&left?`$${dollars} and ${left}¢`:dollars?`$${dollars}`:`${left}¢`;};
/* Money: a list of 'B' (a dollar bill), 'q', 'd', 'n', and 'p', drawn bills first and then coins, in rows no wider than W.
   vals: write what each one is worth under it. */
function moneyFig(list,{vals=false,W=470,label}={}){
  const bills=list.filter(k=>k==='B'),coins=list.filter(k=>k!=='B'),valueH=vals?22:0;
  /* (x, y): where the next thing goes; widest: the widest row so far; rowH: the tallest thing in this row */
  let markup='',x=6,y=6,widest=0,rowH=0;
  /* place a thing w wide and h tall, starting a new row when it doesn't fit; returns its top left */
  const put=(w,h)=>{
    if(x>6&&x+w>W){x=6;y+=rowH+10+valueH;rowH=0;}
    const topLeft=[x,y];x+=w+10;widest=Math.max(widest,x-4);rowH=Math.max(rowH,h);
    return topLeft;
  };
  bills.forEach(()=>{
    const [a,b]=put(118,54);
    markup+=`<g class="bill"><rect x="${a}" y="${b}" width="118" height="54" rx="4"/><rect class="in" x="${a+5}" y="${b+5}" width="108" height="44" rx="2"/><ellipse class="in" cx="${a+59}" cy="${b+27}" rx="15" ry="18"/><text x="${a+22}" y="${b+27}">1</text><text x="${a+96}" y="${b+27}">1</text></g>`
      +(vals?`<text class="lbl s gd" x="${a+59}" y="${b+68}">$1</text>`:'');
  });
  /* coins start a row of their own after the bills */
  if(bills.length&&coins.length)x=W;
  coins.forEach(k=>{
    const {name,v,r}=COINS[k],[a,b]=put(2*r,70);
    markup+=`<g class="cn ${k==='p'?'cu':'ag'}"><circle cx="${a+r}" cy="${b+35}" r="${r}"/><circle class="in" cx="${a+r}" cy="${b+35}" r="${r-5}"/><text x="${a+r}" y="${b+35}">${name.toUpperCase()}</text></g>`
      +(vals?`<text class="lbl s gd" x="${a+r}" y="${b+84}">${v}¢</text>`:'');
  });
  /* "2 dollar bills and 3 coins" */
  const say=(count,word)=>count?`${count} ${word}${count>1?'s':''}`:'';
  return svgWrap(widest,y+rowH+6+valueH,markup,label||[say(bills.length,'dollar bill'),say(coins.length,'coin')].filter(Boolean).join(' and '));
}
