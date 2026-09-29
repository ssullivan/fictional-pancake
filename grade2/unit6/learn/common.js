/* Learn Geometry, Time, and Money (Grade 2 Unit 6): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
/* a blank picture that says so */
const empty=t=>svgWrap(200,40,`<text class="lbl s" x="100" y="20">${t}</text>`,t);
/* a list of coins from counts {B, q, d, n, p}, the biggest value first */
const coinList=c=>['B','q','d','n','p'].flatMap(k=>Array(c[k]||0).fill(k));
/* stepper keys for coins (a stepper named d would clash with the buttons' data-d) */
const SK={B:'bills',q:'qs',d:'ds',n:'ns',p:'ps'},fromSteps=st=>Object.fromEntries(Object.entries(SK).map(([k,v])=>[k,st[v]||0]));
/* the running total, counting the biggest coins first: "10, 20, 25, 26" */
const countUp=list=>{let t=0;return list.map(k=>t+=COINS[k].v).join(', ');};
