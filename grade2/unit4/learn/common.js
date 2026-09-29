/* Learn Addition and Subtraction on the Number Line (Grade 2 Unit 4): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
/* a number line from lo to hi with every number shown when there's room, else every 5 or 10 */
const line=(lo,hi,o={})=>numLine(lo,hi,{u:Math.min(34,560/(hi-lo)),ls:'',end:true,lab:v=>hi-lo<=12||v%(hi-lo<=30?5:10)===0,...o});
/* jumps from a by each of steps (signed), labelled +n or −n: hopsFrom(34, [10, 10, 3]) */
const sgn=n=>n>0?`+${n}`:`−${-n}`;
function hopsFrom(a,steps){
  let v=a;
  return steps.map(n=>{const h={a:v,b:v+n,t:sgn(n)};v+=n;return h;});
}
/* the tens around a and b: [lo, hi] so the line has room for both */
const around=(a,b)=>[Math.floor(Math.min(a,b)/10)*10,Math.ceil((Math.max(a,b)+1)/10)*10];
