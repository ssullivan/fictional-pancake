/* Small helpers shared by every game, every Learn page, and the fuzz tests (tools/fuzz.mjs loads this file in Node).
   Number formatting (fmt, money) stays in each page, because units round differently. */
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
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
