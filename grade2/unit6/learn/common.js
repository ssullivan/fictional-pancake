/* Learn Geometry, Time, and Money (Grade 2 Unit 6): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
/* a blank picture that says so */
const empty=text=>svgWrap(200,40,`<text class="lbl s" x="100" y="20">${text}</text>`,text);
/* a list of coins from counts {B, q, d, n, p}, the biggest value first */
const coinList=counts=>['B','q','d','n','p'].flatMap(coin=>Array(counts[coin]||0).fill(coin));
/* stepper keys for coins (a stepper named d would clash with the buttons' data-d), and the coin counts from the steppers' values */
const SK={B:'bills',q:'qs',d:'ds',n:'ns',p:'ps'},fromSteps=values=>Object.fromEntries(Object.entries(SK).map(([coin,key])=>[coin,values[key]||0]));
/* the running total, counting the biggest coins first: "10, 20, 25, 26" */
const countUp=coins=>{let total=0;return coins.map(coin=>total+=COINS[coin].v).join(', ');};
