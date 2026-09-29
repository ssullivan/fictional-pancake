/* Learn Arithmetic in Base Ten (Grade 6 Unit 5): the unit's chapters and their icons. Loaded by learn.html and every chapter page in learn/.
   Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON={
  add:'<g fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="1.5"><rect x="6" y="10" width="7" height="44"/><rect x="16" y="10" width="7" height="44"/><rect x="26" y="10" width="7" height="44"/></g><g fill="rgba(127,227,255,.45)" stroke="#7fe3ff" stroke-width="1.5"><rect x="40" y="44" width="7" height="7"/><rect x="50" y="44" width="7" height="7"/><rect x="40" y="34" width="7" height="7"/><rect x="50" y="34" width="7" height="7"/></g>',
  point:'<text x="32" y="40" fill="#f3f6fb" font-size="20" font-weight="700" text-anchor="middle" font-family="monospace">0.06</text><circle cx="21" cy="40" r="4" fill="#ffc93c"/>',
  grid:'<g stroke="rgba(243,246,251,.5)" stroke-width="1" fill="none">'+Array.from({length:6},(_,i)=>`<line x1="${8+i*9.6}" y1="8" x2="${8+i*9.6}" y2="56"/><line x1="8" y1="${8+i*9.6}" x2="56" y2="${8+i*9.6}"/>`).join('')+'</g><rect x="8" y="27.2" width="28.8" height="28.8" fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="2"/>',
  divide:'<text x="32" y="40" fill="#f3f6fb" font-size="16" font-weight="700" text-anchor="middle" font-family="monospace">12)156</text><line x1="26" y1="24" x2="58" y2="24" stroke="#ffc93c" stroke-width="2.5"/>',
  pour:'<path d="M8,14 L34,14 L32,52 L10,52 Z" fill="rgba(127,227,255,.2)" stroke="#7fe3ff" stroke-width="2.5"/><path d="M40,34 L56,34 L54,54 L42,54 Z" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="2.5"/>',
  receipt:'<rect x="14" y="6" width="36" height="52" rx="3" fill="rgba(255,201,60,.15)" stroke="#ffc93c" stroke-width="2.5"/><g stroke="#a9c4e4" stroke-width="2"><line x1="20" y1="17" x2="44" y2="17"/><line x1="20" y1="26" x2="44" y2="26"/><line x1="20" y1="35" x2="36" y2="35"/></g><text x="32" y="52" text-anchor="middle" font-family="monospace" font-weight="700" font-size="11" fill="#7fe3ff">1.85</text>',
};
const UNIT={saveKey:'g6u5-learn',game:'Decimal Diner',icons:ICON,
  chapters:[
  {id:'add-subtract',icon:'add',title:'Adding and subtracting decimals',game:{zone:'reg',name:'Cash Register'},lessons:'Lessons 1–4',blurb:'Bundle ten hundredths into a tenth, and line up the decimal points.',steps:2},
  {id:'decimal-point',icon:'point',title:'Where the decimal point goes',game:{zone:'point',name:'Decimal Point Drop'},lessons:'Lessons 5–6',blurb:'Tenths times tenths make hundredths, and counting decimal places.',steps:2},
  {id:'area-models',icon:'grid',title:'Area diagrams and grids',game:{zone:'weigh',name:'Weigh Station'},lessons:'Lessons 7–8',blurb:'Multiply decimals on a hundredths grid, and split a product into parts.',steps:2},
  {id:'divide-whole',icon:'divide',title:'Dividing whole numbers',game:{zone:'share',name:'Fair Share'},lessons:'Lessons 9–11',blurb:'Divide in chunks with partial quotients, and keep going past the ones place.',steps:2},
  {id:'divide-decimals',icon:'pour',title:'Dividing decimals',game:{zone:'pour',name:'Pour & Cut'},lessons:'Lessons 12–13',blurb:'Multiply both numbers by 10 or 100 until you divide by a whole number.',steps:1},
  {id:'put-together',icon:'receipt',title:'Putting it together',game:{zone:'rush',name:'Rush Order'},lessons:'Lesson 14',blurb:'Add up an order, make change, and see when the money runs short.',steps:1},
]};
