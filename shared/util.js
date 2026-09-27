/* Small helpers shared by every game, every Learn page, and the fuzz tests (tools/fuzz.mjs loads this file in Node).
   Number formatting (fmt, money) stays in each page, because units round differently. */
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
/* For generators. miscOf: wrong answers [[value, message], …], leaving out any that equal the answer or repeat.
   mcOf: an mc problem with choices a, b, c (d) in random order from [[label, message, or null for the answer], …]. */
const miscOf=(answer,list)=>list.filter(([v],i)=>v!==answer&&list.findIndex(([w])=>w===v)===i);
function mcOf(list,extra={}){
  const ids=shuffle(['a','b','c','d'].slice(0,Math.max(3,list.length))).slice(0,list.length),why={};let answer;
  const choices=list.map(([label,msg],i)=>{if(msg===null)answer=ids[i];else why[ids[i]]=msg;return {id:ids[i],label};}).sort((x,y)=>x.id<y.id?-1:1);
  return {kind:'mc',choices,answer,why,...extra};
}
const gcd=(a,b)=>b?gcd(b,a%b):a;
const lcm=(a,b)=>a*b/gcd(a,b);
const $=id=>document.getElementById(id);
/* Q(el)('x') finds the element marked data-x inside el */
const Q=el=>a=>el.querySelector(`[data-${a}]`);
/* Reads what a student typed: "12", "$4.50", "1,200", "3/4", "2 1/2", "12 cm". NaN if there is no number. */
function parseNum(s){
  s=String(s).trim().replace(/[,$]/g,'');
  const mixed=s.match(/^(\d+)\s+(\d+)\/(\d+)/);if(mixed)return +mixed[1]+mixed[2]/mixed[3];
  const m=s.match(/^(-?\d*\.?\d+)\s*\/\s*(\d*\.?\d+)/);if(m)return +m[1]/+m[2];
  const n=s.match(/-?\d*\.?\d+/);return n?+n[0]:NaN;
}
