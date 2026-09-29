/* Learn Unit Rates and Percentages (Grade 6 Unit 3): the unit's chapters and their icons. Loaded by learn.html and every chapter page in learn/.
   Each chapter is learn/<id>.html with its widgets and steps in learn/<id>.js; shared/learn.js has the format. */
const ICON={
  conv:'<rect x="6" y="14" width="52" height="12" rx="3" fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="2"/><g stroke="#7fe3ff" stroke-width="2" fill="rgba(127,227,255,.25)"><rect x="6" y="36" width="13" height="12"/><rect x="19" y="36" width="13" height="12"/><rect x="32" y="36" width="13" height="12"/><rect x="45" y="36" width="13" height="12"/></g>',
  rate:'<text x="32" y="28" fill="#ffc93c" font-size="15" font-weight="700" text-anchor="middle" font-family="monospace">4 per</text><line x1="10" y1="36" x2="54" y2="36" stroke="#f3f6fb" stroke-width="2"/><text x="32" y="54" fill="#7fe3ff" font-size="15" font-weight="700" text-anchor="middle" font-family="monospace">1</text>',
  speed:'<circle cx="32" cy="36" r="22" fill="none" stroke="#f3f6fb" stroke-width="3"/><path d="M32,36L46,22" stroke="#ffc93c" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="36" r="4" fill="#ffc93c"/><path d="M14,36h4M46,36h4M32,18v4" stroke="#7fe3ff" stroke-width="2.5"/>',
  pct:'<rect x="6" y="20" width="52" height="24" rx="3" fill="rgba(127,227,255,.2)" stroke="#7fe3ff" stroke-width="2"/><rect x="6" y="20" width="31" height="24" rx="3" fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="2"/><text x="22" y="37" fill="#1a1300" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">60%</text>',
  bench:'<path d="M8,20H40L56,36L40,52H8Z" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="2.5" stroke-linejoin="round"/><circle cx="16" cy="36" r="4" fill="#0a2340"/><text x="34" y="41" fill="#f3f6fb" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">25%</text>',
  detect:'<circle cx="26" cy="26" r="16" fill="rgba(127,227,255,.2)" stroke="#7fe3ff" stroke-width="3"/><path d="M38,38L56,56" stroke="#7fe3ff" stroke-width="5" stroke-linecap="round"/><text x="26" y="31" fill="#ffc93c" font-size="14" font-weight="700" text-anchor="middle" font-family="monospace">%</text>',
};
const UNIT={saveKey:'g6u3-learn',game:'Rate Racers',icons:ICON,
  chapters:[
  {id:'converting',icon:'conv',title:'Converting units',game:{zone:'conv',name:'Unit Converter'},lessons:'Lessons 2–4',blurb:'Change bigger units into smaller ones, and pick the unit that makes sense.',steps:2},
  {id:'unit-rates',icon:'rate',title:'Unit rates',game:{zone:'rate',name:'Rate Lab'},lessons:'Lessons 1, 6–7',blurb:'Every ratio has two unit rates. Find them both, and use the one that fits the question.',steps:2},
  {id:'speed-and-pace',icon:'speed',title:'Speed and pace',game:{zone:'speed',name:'Speed & Pace Track'},lessons:'Lessons 5, 8–9',blurb:'Miles per hour or minutes per mile: tell who is faster, and how long a trip takes.',steps:2},
  {id:'percentages',icon:'pct',title:'Percentages',game:{zone:'strip',name:'Percent Strip'},lessons:'Lessons 10–12',blurb:'Percents of a dollar, of a tape, and on a double number line.',steps:3},
  {id:'benchmarks',icon:'bench',title:'Benchmark percents',game:{zone:'bench',name:'Benchmark Shop'},lessons:'Lesson 13',blurb:'10%, 25%, 50%, and 75% in your head, and sale prices.',steps:2},
  {id:'part-whole-percent',icon:'detect',title:'Part, whole, or percent',game:{zone:'detect',name:'Percent Detective'},lessons:'Lessons 14–16',blurb:'Work backward from a part to the whole, and find what percent a part is.',steps:2},
]};
