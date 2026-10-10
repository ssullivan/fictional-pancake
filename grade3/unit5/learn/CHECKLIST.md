# Checklist: Learn Fractions as Numbers (Grade 3 Unit 5)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–17. Not covered: Lesson 18 (Design With Fractions), optional. Denominators are 2, 3, 4, 6, and 8.

## Chapter 1: Name the parts · `learn/name-parts.html` · Lessons 1–2

### Step 1: Equal parts
- [ ] It starts with a circle in 4 equal parts: `pressed Circle; pressed 4 parts; pressed Equal parts; see 4 equal parts: fourths. Each part is a fourth, written 1/4.; count .pc = 4; count .pc.on = 1`
- [ ] Another number of parts: `click 6 parts; see 6 equal parts: sixths. Each part is a sixth, written 1/6.; count .pc = 6`
- [ ] Parts not the same size aren't fourths: `click Not the same size; see 4 parts, but they aren’t the same size, so they aren’t fourths.`
- [ ] Edge: 6 or 8 parts are always equal: `click Not the same size; click 8 parts; pressed Equal parts; disabled Not the same size; see 8 equal parts: eighths. Each part is an eighth`
- [ ] Other shapes: `click Rectangle; count .pc = 4; click Square; click 2 parts; see 2 equal parts: halves. Each part is a half, written 1/2.`
- Quick check: Which rectangle is cut into fourths? Answer: “(picture)”. Mistakes it names: “(picture)”, “(picture)”.

### Step 2: Unit fractions
- [ ] It starts on fourths: `pressed Fourth; see 1/4 is 1 of 4 equal parts: a fourth.; see It’s smaller than 1/3; count .fs.on = 5; count .fs.on.b = 1`
- [ ] Eighths are the smallest: `click Eighth; see 1/8 is 1 of 8 equal parts: an eighth.; see It’s smaller than 1/6`
- [ ] Edge: halves are the biggest: `click Half; see 1/2 is 1 of 2 equal parts: a half.; see It’s the biggest unit fraction here`
- Quick check: A pizza is cut into 8 equal slices. What fraction of the pizza is 1 slice? Answer: 0.125 of the pizza. Mistakes it names: 8, 0.875.

## Chapter 2: Build fractions · `learn/build-fractions.html` · Lessons 3–4

### Step 1: Shade parts
- [ ] It starts with nothing shaded: `pressed Rectangle; pressed Fourths; see Tap parts to shade them.; count .pc.on = 0`
- [ ] Shading three fourths: `tap [data-i="0"]; tap [data-i="1"]; tap [data-i="2"]; see 3 fourths shaded: 3/4. That’s 3 parts of 1/4.; count .pc.on = 3`
- [ ] Edge: a second tap takes the shading off: `tap [data-i="0"]; tap [data-i="0"]; see Tap parts to shade them.; count .pc.on = 0`
- [ ] Edge: every part is 1 whole: `click Thirds; tap [data-i="0"]; tap [data-i="1"]; tap [data-i="2"]; see All 3 parts: 3/3, 1 whole.`
- [ ] Another shape clears the shading: `tap [data-i="0"]; click Circle; count .pc.on = 0; count .pc = 4`
- Quick check: What fraction of the pie is shaded? Answer: 0.8333333333333334 of the pie. Mistakes it names: 0.16666666666666666, 1.2.

### Step 2: Count unit fractions
- [ ] It starts with 1 fourth: `pressed Fourths; see 1 part of 1/4 makes 1/4.; count .fs.on = 1`
- [ ] Three parts: `click Parts: one more ×2; see 3 parts of 1/4 make 3/4.; count .fs.on = 3`
- [ ] Edge: every part makes 1 whole: `click Parts: one more ×5; see 4 parts of 1/4 make 4/4: 1 whole.; count .fs.on = 4`
- [ ] Edge: no parts: `click Parts: one less ×3; see No parts of 1/4 yet.; count .fs.on = 0`
- [ ] Eighths: `click Eighths; see 1 part of 1/8 makes 1/8.; click Parts: one more ×9; see 8 parts of 1/8 make 8/8: 1 whole.`
- Quick check: How many 1/8s make 5/8? Answer: 5. Mistakes it names: 8.

## Chapter 3: Fractions on the number line · `learn/number-line.html` · Lessons 5–7

### Step 1: From a strip to a number line
- [ ] It starts with 1 fourth: `pressed Fourths; see Each part of the strip is one jump of 1/4 on the line.; see 1 part reaches 1/4.; count .pt = 1`
- [ ] Three parts reach 3/4: `click Parts shaded: one more ×2; see 3 parts reach 3/4.; count .fs.on = 3`
- [ ] Edge: none shaded, no point: `click Parts shaded: one less ×2; count .pt = 0; nosee reach`
- [ ] Edge: the whole strip reaches 1: `click Parts shaded: one more ×5; see 4 parts reach 4/4.; count .fs.on = 4`
- [ ] Thirds: `click Thirds; see one jump of 1/3 on the line.; see 1 part reaches 1/3.; count .fs = 3`
- Quick check: What fraction is the point at? Answer: 0.75. Mistakes it names: 1, 0.6.

### Step 2: Find a fraction on the line
- [ ] It starts with nothing tapped: `pressed 2/3; see Tap where 2/3 goes. The line from 0 to 1 is cut into thirds.; count .pt = 0`
- [ ] A wrong tick says what it is: `tap [data-v="1"]; see That tick is 1/3. Count jumps of 1/3 from 0 to 2/3.`
- [ ] The right tick: `tap [data-v="2"]; see Yes! 2/3 is 2 jumps of 1/3 from 0.; count .pt.g = 1`
- [ ] Edge: the ends of the line: `tap [data-v="0"]; see That tick is 0.; tap [data-v="3"]; see That tick is 3/3, 1 whole.`
- [ ] Another fraction clears the tap: `tap [data-v="1"]; click 5/8; see Tap where 5/8 goes.; count .pt = 0; tap [data-v="5"]; see Yes! 5/8 is 5 jumps of 1/8 from 0.`
- Quick check: A trail is 1 mile long, with a sign every 1/6 mile. Lin walks from the start to sign 4. How far does Lin walk? Answer: 0.6666666666666666 mile. Mistakes it names: 4, 0.3333333333333333.

## Chapter 4: Fractions and whole numbers · `learn/whole-numbers.html` · Lessons 8–9

### Step 1: Fractions that are whole numbers
- [ ] It starts at 2 halves, 1 whole: `pressed Halves; see 2 jumps of 1/2: 2/2.; see 2/2 = 1. Every 2 halves make 1 whole.`
- [ ] Not a whole number: `click Jumps: one more; see 3 jumps of 1/2: 3/2.; nosee Every`
- [ ] Edge: no jumps: `click Jumps: one less ×3; see No jumps yet: you’re at 0.; count .pt = 0`
- [ ] Edge: the line ends at 3: `click Jumps: one more ×6; see 6 jumps of 1/2: 6/2.; see 6/2 = 3.`
- [ ] Thirds start at 1 whole: `click Thirds; see 3/3 = 1.; click Jumps: one more ×3; see 6/3 = 2.`
- Quick check: 12/4 is a whole number. Which one? Answer: 3. Mistakes it names: 12, 4.

### Step 2: More than 1 whole
- [ ] It starts past 1 whole: `pressed Fourths; see 5/4: 5 parts of 1/4. That’s 1 whole strip and 1 fourth more: more than 1.; count .fs.on = 5; count .fs = 8`
- [ ] Exactly 1 whole: `click Parts: one less; see 4/4 = 1 whole.`
- [ ] Less than 1: `click Parts: one less ×3; see Less than 1 whole.`
- [ ] Two wholes: `click Parts: one more ×3; see 8/4 = 2: two whole strips.; count .fs.on = 8`
- [ ] Edge: the parts stay 1 to 8: `click Parts: one more ×9; see 8/4 = 2; click Parts: one less ×12; see 1/4: 1 part of 1/4.`
- [ ] Halves: `click Halves; see 3/2: 3 parts of 1/2. That’s 1 whole strip and 1 half more`
- Quick check: Which fraction is equal to 2? Answer: “6/3”. Mistakes it names: “2/3”, “3/6”.

## Chapter 5: Equivalent fractions · `learn/equivalent.html` · Lessons 10–11

### Step 1: Same size, different names
- [ ] It starts with nothing shaded below: `pressed 1/2; pressed Fourths; see 0/4 is shorter than 1/2.; count .fs.on = 1`
- [ ] Two fourths match: `click Parts shaded: one more ×2; see Same length! 1/2 = 2/4: they’re equivalent.`
- [ ] Too many: `click Parts shaded: one more ×3; see 3/4 is longer than 1/2.`
- [ ] Edge: no number of fourths matches 1/3: `click 1/3; click Fourths; see No number of fourths is exactly as long as 1/3.`
- [ ] Three fourths in eighths: `click 3/4; click Eighths; click Parts shaded: one more ×6; see 3/4 = 6/8`
- [ ] Edge: the parts stop at the whole: `click Halves; click Parts shaded: one more ×4; see 2/2 is longer than 1/2.`
- Quick check: 1/2 = ?/8. What number goes in the box? Answer: 4. Mistakes it names: 7, 8.

### Step 2: Cut the parts again
- [ ] It starts uncut: `pressed 1/2; see Cut each part of 1/2 in two. What happens?; count .fs = 4`
- [ ] One cut: `click Cut each part in two; see Each part is cut in two: 4 parts instead of 2, and 2 shaded instead of 1.; see 1/2 = 2/4. The shaded length didn’t change.; count .fs = 6`
- [ ] Edge: cuts stop at eighths: `click Cut each part in two ×2; see 1/2 = 4/8.; disabled Cut each part in two`
- [ ] Edge: thirds cut once make sixths: `click 2/3; click Cut each part in two; see 2/3 = 4/6.; disabled Cut each part in two`
- [ ] Start over: `click Cut each part in two; click Start over; see Cut each part of 1/2 in two.; enabled Cut each part in two`
- Quick check: Which fraction is equivalent to 2/3? Answer: “4/6”. Mistakes it names: “2/6”, “3/4”.

## Chapter 6: Equivalent fractions on the number line · `learn/equivalent-line.html` · Lessons 12–13

### Step 1: The same point, different names
- [ ] It starts with nothing tapped: `pressed Top: halves; pressed Bottom: fourths; see Tap a tick on the top line.`
- [ ] Half is two fourths: `tap [data-r="0"][data-v="1"]; see 1/2 is right above 2/4: 1/2 = 2/4.; count .pt.b = 1`
- [ ] Edge: no fourths tick under a third: `click Top: thirds; tap [data-r="0"][data-v="1"]; see No tick on the bottom line is right under 1/3`
- [ ] Edge: 0: `tap [data-r="0"][data-v="0"]; see Both lines start at 0.`
- [ ] Fourths and eighths: `click Top: fourths; click Bottom: eighths; tap [data-r="0"][data-v="3"]; see 3/4 is right above 6/8`
- [ ] Another line clears the tap: `tap [data-r="0"][data-v="1"]; click Bottom: sixths; see Tap a tick on the top line.; count .pt = 0`
- Quick check: Which fraction is at the same point as 3/4? Answer: “6/8”. Mistakes it names: “3/8”, “4/8”.

### Step 2: Whole numbers as fractions
- [ ] It starts with 2 in halves: `pressed 2; pressed Halves; see 2 = 4/2; see Each whole is 2 halves, so 2 wholes are 4 halves: 2 = 4/2.`
- [ ] Three in sixths: `click 3; click Sixths; see 3 = 18/6; see 3 wholes are 18 sixths`
- [ ] Edge: 1 whole: `click 1; click Thirds; see Each whole is 3 thirds, so 1 whole is 3 thirds: 1 = 3/3.`
- Quick check: 3 = ?/4. What number goes in the box? Answer: 12. Mistakes it names: 3, 7.

## Chapter 7: Same denominator or numerator · `learn/compare-same.html` · Lessons 14–16

### Step 1: The same denominator
- [ ] It starts with 3/8 and 5/8: `pressed Eighths; see 5 parts are more than 3.; see 3/8 < 5/8`
- [ ] The same number of parts: `click Gold: one more ×2; see They have the same number of parts.; see 5/8 = 5/8`
- [ ] Edge: gold stops at the whole: `click Gold: one more ×7; see 8/8 > 5/8; count .fs.on = 13`
- [ ] Edge: fewer parts keep the fractions within 1 whole: `click Fourths; see 3/4 < 4/4`
- [ ] Edge: a fraction has at least 1 part: `click Fourths; click Blue: one less ×6; see 3/4 > 1/4`
- Quick check: Mai eats 4/6 of a granola bar. Han eats 2/6 of a bar the same size. Which is true? Answer: “4/6 &gt; 2/6”. Mistakes it names: “4/6 &lt; 2/6”, “4/6 = 2/6”.

### Step 2: The same numerator
- [ ] It starts with 1/2 and 1/4: `pressed Gold: halves; pressed Blue: fourths; see Halves are bigger than fourths; see 1/2 > 1/4`
- [ ] Two parts of each: `click Parts of each: one more; see Both have 2 parts.; see 2/2 > 2/4`
- [ ] Edge: no more parts than the smaller whole has: `click Parts of each: one more ×4; see 2/2 > 2/4`
- [ ] Eighths and thirds: `click Gold: eighths; click Blue: thirds; click Parts of each: one more ×2; see 3/8 < 3/3`
- [ ] Edge: the same parts are the same fraction: `click Blue: halves; see Both are halves: the same fraction.; see 1/2 = 1/2`
- Quick check: Diego paints 3/4 of a fence. Clare paints 3/8 of a fence the same size. Which is true? Answer: “3/4 &gt; 3/8”. Mistakes it names: “3/4 &lt; 3/8”, “3/4 = 3/8”.

## Chapter 8: Compare fractions · `learn/compare.html` · Lesson 17

### Step 1: Pick a way to compare
- [ ] It starts with nothing picked: `pressed 3/8 and 5/8; see Is 3/8 less than, equal to, or greater than 5/8? Pick a sign.; count .fs.on = 0`
- [ ] The right sign: `click <; see Yes: 3/8 < 5/8.; see Both are eighths, the same size of part.; count .fs.on = 8`
- [ ] A wrong sign: `click >; see Not 3/8 > 5/8. Look at the strips.`
- [ ] Equivalent: `click 2/4 and 1/2; click =; see Yes: 2/4 = 1/2.; see They cover the same length, so they’re equivalent.`
- [ ] The same numerator: `click 2/3 and 2/6; click >; see Both have 2 parts, but thirds are bigger than sixths.`
- [ ] Another pair clears the sign: `click =; click 3/4 and 3/8; count .fs.on = 0; see Pick a sign.`
- Quick check: Which is true? Answer: “2/4 = 1/2”. Mistakes it names: “2/4 &gt; 1/2”, “2/4 &lt; 1/2”.

### Step 2: Compare on the number line
- [ ] It starts with 3/8 and 5/8: `pressed 3/8 and 5/8; see 5/8 is farther right, so it’s greater.; see 3/8 < 5/8; count .pt = 2`
- [ ] Equivalent: `click 2/4 and 1/2; see The points are at the same place: they’re equivalent.; see 2/4 = 1/2`
- [ ] The same numerator: `click 3/4 and 3/8; see 3/4 is farther right, so it’s greater.; see 3/4 > 3/8`
- Quick check: Kiran runs 2/3 mile. Elena runs 2/6 mile. Who runs farther? Answer: “Kiran”. Mistakes it names: “Elena”, “They run the same distance”.
