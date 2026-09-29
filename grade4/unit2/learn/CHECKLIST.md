# Checklist: Learn Fraction Equivalence and Comparison (Grade 4 Unit 2)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–16. Not covered: Lesson 17 (Paper Clip Games), optional. Denominators 2, 3, 4, 5, 6, 8, 10, and 12.

## Chapter 1: Parts of a whole · `learn/parts.html` · Lessons 1–2

### Step 1: Equal parts
- [ ] It starts with 3 of 8 equal parts shaded: `see 3 parts are shaded: 3/8, or 3 eighths.; count .fs.on = 3; pressed eighths`
- [ ] One part is shaded, singular: `click Shaded parts: one less ×2; see 1 part is shaded: 1/8, or 1 eighth.`
- [ ] Shading every part makes 1 whole: `click fourths; click Shaded parts: one more; see All 4 parts: 4/4 is 1 whole.`
- [ ] Edge: + stops when every part is shaded: `click halves; click Shaded parts: one more ×3; see All 2 parts: 2/2 is 1 whole.; count .fs = 2`
- [ ] Edge: − stops at 0: `click Shaded parts: one less ×5; see No parts are shaded yet: 0/8.; count .fs.on = 0`
- [ ] Twelfths: 12 parts, each 1/12: `click twelfths; see so each part is 1/12.; count .fs = 12`
- Quick check: A granola bar is cut into equal pieces. Diego ate the shaded pieces. What fraction of the bar did Diego eat? Answer: “5/6”. Mistakes it names: “1/6”, “6/5”.

### Step 2: More than 1 whole
- [ ] It starts at 5 fourths, more than 1 whole: `see 5/4: 5 fourths. That’s more than 1: 1 whole and 1/4 more.; count .fs = 8`
- [ ] 4 fourths is exactly 1 whole: `click Shaded parts: one less; see That’s exactly 1 whole.; count .fs = 4`
- [ ] Less than 1 whole: `click Shaded parts: one less ×2; see 3/4: 3 fourths. That’s less than 1 whole.`
- [ ] Halves: 5 halves is 2 wholes and 1/2, and 4 halves is 2 wholes: `click halves; see 5/2: 5 halves. That’s more than 1: 2 wholes and 1/2 more.; click Shaded parts: one less; see That’s more than 1: 2 wholes.`
- [ ] Edge: + stops at 3 wholes: `click thirds; click Shaded parts: one more ×12; see 9/3: 9 thirds. That’s more than 1: 3 wholes.; count .fs = 9`
- [ ] Edge: − stops at 0: `click Shaded parts: one less ×10; see 0/4: 0 fourths. That’s less than 1 whole.; count .fs.on = 0`
- Quick check: Each strip is a sandwich cut into 3 equal pieces. The class ate the shaded pieces. How many sandwiches did the class eat? Answer: “5/3”. Mistakes it names: “5/6”, “3/5”.

## Chapter 2: Sizes of parts · `learn/sizes.html` · Lessons 3–4

### Step 1: Same denominator or same numerator
- [ ] Same denominator: more of the same parts is more: `see Same denominator. Both are eighths, so the parts are the same size. 5 parts are more than 3. 3/8 < 5/8.`
- [ ] Same numerator: fifths are smaller than thirds: `click 2 / 3 and 2 / 5; see Same numerator. Both are 2 parts. A fifth is smaller than a third, because the whole is cut into more parts. 2/3 > 2/5.`
- [ ] 4 sixths and 4 twelfths are both drawn: `click 4 / 6 and 4 / 12; see 4/6 > 4/12; count .fs.on = 8`
- [ ] Tenths are smaller than fourths: `click 3 / 4 and 3 / 10; see A tenth is smaller than a fourth; pressed 3 / 4 and 3 / 10`
- Quick check: Two pizzas are the same size. Noor ate 3/5 of one. Sam ate 3/8 of the other. Who ate more pizza? Answer: “Noor”. Mistakes it names: “Sam”, “They ate the same”.

### Step 2: Split the parts
- [ ] It starts with halves: `see 1 whole cut into 2 equal parts: halves. One part is 1/2.; count .fs = 2`
- [ ] Splitting halves makes fourths: `click Split each part in 2; see Each half split in 2 makes fourths; see 2 fourths make 1 half: 2/4 = 1/2.; count .fs = 6`
- [ ] Edge: after eighths, it can’t split again: `click Split each part in 2 ×2; see 4 eighths make 1 half: 4/8 = 1/2.; disabled Split each part in 2`
- [ ] Thirds split twice make twelfths: `click thirds, sixths, twelfths; click Split each part in 2 ×2; see 4 twelfths make 1 third: 4/12 = 1/3.; count .fs = 21`
- [ ] Fifths split once make tenths, the last split: `click fifths, tenths; click Split each part in 2; see 2 tenths make 1 fifth; disabled Split each part in 2`
- [ ] Start over goes back to one strip: `click Split each part in 2; click Start over; see 1 whole cut into 2 equal parts; enabled Split each part in 2; count .fs = 2`
- Quick check: A pan of cornbread is cut into 6 equal pieces. Then every piece is cut in half, into twelfths. How many twelfths are the same as 1 sixth of the pan? Answer: 2 twelfths. Mistakes it names: 6, 12.

## Chapter 3: Fractions on number lines · `learn/number-lines.html` · Lessons 5–6

### Step 1: Name the point
- [ ] It starts in fourths, asking for a tap: `see Each whole is cut into 4 equal parts, so each jump is 1/4. Tap a tick mark.; count .pt = 0`
- [ ] A point less than 1, with its jumps: `tap [data-v="3"]; see This point is 3/4: 3 jumps of 1/4 from 0.; see It’s less than 1.; count .hop = 3`
- [ ] A point more than 1: `tap [data-v="5"]; see It’s more than 1: 1 and 1/4.`
- [ ] Edge: a whole number: `tap [data-v="8"]; see 8/4 = 2.`
- [ ] Edge: 0: `tap [data-v="0"]; see That’s 0: no jumps yet.; count .hop = 0`
- [ ] Picking other parts clears the point: `tap [data-v="3"]; click sixths; see each jump is 1/6. Tap a tick mark.; count .pt = 0`
- Quick check: The number line is a trail 1 mile long. Andre stopped at the dot. How far along the trail is Andre? Answer: “3/8 mile”. Mistakes it names: “4/8 mile”, “3/9 mile”.

### Step 2: Close to 0, 1/2, or 1
- [ ] 1/4 is halfway between 0 and 1/2: `see 1/4 is less than 1/2 (1/2 is 2/4).; see It’s halfway between 0 and 1/2: 1/4 from each.`
- [ ] 5/8 is closest to 1/2: `click 5 / 8; see 5/8 is more than 1/2 (1/2 is 4/8).; see It’s closest to 1/2: just 1/8 away.`
- [ ] 5/6 is closest to 1: `click 5 / 6; see It’s closest to 1: just 1/6 away.`
- [ ] Tenths: every distance is shown: `click 7 / 10; see Distance to 0: 7/10. To 1/2: 2/10. To 1: 3/10.; see It’s closest to 1/2: just 2/10 away.`
- Quick check: Which of these fills a measuring cup less than 1/2 full? Answer: “3/8 cup”. Mistakes it names: “5/8 cup”, “4/6 cup”.

## Chapter 4: Equivalent fractions · `learn/equivalent.html` · Lessons 7–9

### Step 1: Same amount, different parts
- [ ] It starts matching 3/4 with no eighths shaded: `see 0/8 is less than 3/4. Shade more eighths.; pressed 3 / 4; pressed eighths`
- [ ] 6 eighths match 3/4: `click Shaded parts: one more ×6; see Same amount! 6/8 = 3/4. They are equivalent fractions.`
- [ ] Too many: `click Shaded parts: one more ×7; see 7/8 is more than 3/4. Shade fewer eighths.`
- [ ] Edge: fifths can’t make 3/4: `click fifths; see Fifths can’t make exactly 3/4: 3 fifths are too little and 4 fifths too much.`
- [ ] 3 sixths match 1/2: `click 1 / 2; click sixths; click Shaded parts: one more ×3; see Same amount! 3/6 = 1/2.`
- [ ] Edge: + stops at every part: `click halves; click Shaded parts: one more ×4; see 2/2 is more than 3/4.; count .fs.on = 5`
- [ ] 8 twelfths match 2/3: `click 2 / 3; click twelfths; click Shaded parts: one more ×8; see Same amount! 8/12 = 2/3.`
- Quick check: Jada has hiked 3/4 of a trail. The trail map is marked in eighths. How many eighths of the trail has Jada hiked? Answer: 6 eighths. Mistakes it names: 7, 3, 4.

### Step 2: Same point on the number line
- [ ] It starts asking for a tap: `see Tap a tick mark on either line.; count .pt = 0`
- [ ] 3/4 lines up with 6/8: `tap [data-r="0"][data-v="3"]; see 3/4 = 6/8: they are at the same point, so they are equivalent.; see Each fourth is 2 eighths.; count .pt = 2`
- [ ] Edge: an eighth with no fourth under it: `tap [data-r="1"][data-v="3"]; see 3/8 is between 1/4 and 2/4. No tick for fourths lands on it.; count .pt = 1`
- [ ] Thirds and twelfths: `click thirds and twelfths; tap [data-r="0"][data-v="2"]; see 2/3 = 8/12; see Each third is 4 twelfths.`
- [ ] Edge: 0 and 1 line up too: `tap [data-r="1"][data-v="0"]; see 0/8 = 0/4; tap [data-r="0"][data-v="4"]; see 4/4 = 8/8`
- [ ] Picking other lines clears the point: `tap [data-r="0"][data-v="1"]; click fifths and tenths; see Tap a tick mark on either line.; count .pt = 0`
- Quick check: Which fraction is at the same point as 2/3? Answer: “4/6”. Mistakes it names: “3/4”, “2/6”.

## Chapter 5: Multiply or divide to find equivalent fractions · `learn/multiply-divide.html` · Lessons 10–11

### Step 1: Split every part
- [ ] It starts with 3/4 split in 2: `see 3/4 = 3 × 2/4 × 2 = 6/8; see Same amount: 3/4 = 6/8.; count .fs = 12`
- [ ] Split in 3 makes twelfths: `click Split each part into: one more; see 3/4 = 3 × 3/4 × 3 = 9/12; count .fs = 16`
- [ ] Edge: fourths stop at twelfths: `click Split each part into: one more ×3; see = 9/12`
- [ ] Edge: − stops at 1, not split: `click Split each part into: one less ×3; see Not split yet. Tap + to split every part.`
- [ ] Halves go up to 6 pieces: `click 1 / 2; click Split each part into: one more ×6; see 1/2 = 1 × 6/2 × 6 = 6/12`
- [ ] Edge: sixths stop at 2 pieces: `click 5 / 6; click Split each part into: one more ×3; see = 10/12`
- [ ] Edge: picking a fraction keeps the split within its limit: `click 1 / 2; click Split each part into: one more ×4; click 2 / 5; see Same amount: 2/5 = 4/10.`
- Quick check: A recipe needs 2/5 cup of oats. Kiran’s measuring cup is marked in tenths. How many tenths of a cup should Kiran use? Answer: 4 tenths. Mistakes it names: 7, 2.

### Step 2: Group the parts
- [ ] It starts with 6/12, asking for group sizes: `see Put the parts in equal groups. Which group sizes work for both 6 and 12?; count .fs = 12`
- [ ] Groups of 3: `click Groups of 3; see 12 parts make 4 groups of 3, and the 6 shaded parts make 2 groups.; see = 2/4; count .fs = 16`
- [ ] Groups of 6 make halves: `click Groups of 6; see 6/12 = 6 ÷ 6/12 ÷ 6 = 1/2`
- [ ] Edge: a size that isn’t a factor of the whole: `click 8 / 10; click Groups of 4; see 10 parts don’t make equal groups of 4. 4 is not a factor of 10.; count .fs = 10`
- [ ] Edge: a size that isn’t a factor of the shaded parts: `click 9 / 12; click Groups of 2; see The 12 parts make groups of 2, but the 9 shaded parts don’t. 2 is not a factor of 9.`
- [ ] Picking another fraction clears the groups: `click Groups of 2; click 4 / 8; see Which group sizes work for both 4 and 8?; count .fs = 8`
- Quick check: Ana’s class painted 9/12 of a mural. Which fraction is the same amount? Answer: “3/4”. Mistakes it names: “5/8”, “9/6”.

## Chapter 6: Compare and order fractions · `learn/compare.html` · Lessons 12–16

### Step 1: Ways to compare
- [ ] It asks first, with no strips yet: `see Which is true? Think first, then tap.; count .fs = 0`
- [ ] The right sign: `click 5 / 8 > 3 / 8; see Yes! Same denominator.; count .fs = 16`
- [ ] A wrong sign says why: `click 5 / 8 < 3 / 8; see Not quite. Same denominator.`
- [ ] Compare to 1/2: `click 3 / 8 and 4 / 6; click 3 / 8 < 4 / 6; see Yes! Compare to 1/2. 3/8 is less than 1/2 (1/2 is 4/8), and 4/6 is more than 1/2 (1/2 is 3/6). 3/8 < 4/6.`
- [ ] Compare to 1: `click 5 / 6 and 7 / 8; click 5 / 6 < 7 / 8; see Yes! Compare to 1. Each is 1 part away from 1 whole.; see An eighth is smaller, so 7/8 is closer to 1.`
- [ ] Edge: = is wrong for different amounts: `click 2 / 6 and 2 / 4; click 2 / 6 = 2 / 4; see Not quite. Same numerator.`
- [ ] Picking another pair clears the answer: `click 5 / 8 > 3 / 8; click 2 / 6 and 2 / 4; see Which is true?; count .fs = 0`
- Quick check: Mai walked 5/6 of a mile. Andre walked 3/4 of a mile. Who walked farther? Answer: “Mai”. Mistakes it names: “Andre”, “They walked the same”.

### Step 2: Use a common denominator
- [ ] It starts with different parts: `see Thirds and sixths are different sizes.`
- [ ] Splitting thirds makes sixths: `click Split each part of 2/3 into: one more; see Both are in sixths! 4 sixths is less than 5.; see 4/6 < 5/6, so 2/3 < 5/6.`
- [ ] Both split to twelfths: `click 5 / 6 and 3 / 4; click Split each part of 5/6 into: one more; click Split each part of 3/4 into: one more ×2; see 10/12 > 9/12, so 5/6 > 3/4.`
- [ ] Edge: thirds stop at sixths: `click Split each part of 2/3 into: one more ×3; see Both are in sixths!; count .fs = 12`
- [ ] Edge: splitting too far gives different parts again: `click 3 / 4 and 5 / 8; click Split each part of 3/4 into: one more ×2; see Twelfths and eighths are different sizes.`
- [ ] Fifths and tenths: `click 2 / 5 and 3 / 10; click Split each part of 2/5 into: one more; see 4/10 > 3/10, so 2/5 > 3/10.`
- Quick check: Kai’s pitcher is 2/3 full. Rosa’s is 7/12 full. To compare, write 2/3 in twelfths. 2/3 is how many twelfths? Answer: 8 twelfths. Mistakes it names: 2, 4, 7.

### Step 3: Put them in order
- [ ] It starts asking for the least: `see Tap the fractions from least to greatest.; count .chip.found = 0`
- [ ] The least goes onto the line: `click 1 / 10; see Next: which is the least of the rest?; count .chip.found = 1; disabled 1 / 10`
- [ ] A wrong tap says why: `click 5 / 8; see 5/8 isn’t the least one left.; see 1/10 is less than 1/2 (1/2 is 5/10), and 5/8 is more than 1/2 (1/2 is 4/8).; count .chip.found = 0`
- [ ] The whole set in order: `click 1 / 10; click 1 / 3; click 5 / 8; click 7 / 8; see In order: 1/10, 1/3, 5/8, 7/8.; count .chip.found = 4`
- [ ] Set 2, with a wrong tap compared to 1: `click Set 2; click 1 / 4; click 5 / 12; click 7 / 8; see 7/8 isn’t the least one left.; see Each is 1 part away from 1 whole.; click 2 / 3; click 7 / 8; see In order: 1/4, 5/12, 2/3, 7/8.`
- [ ] Set 3, with a wrong tap compared in tenths: `click Set 3; click 3 / 10; see Write both in tenths: 1/5 = 2/10 and 3/10.`
- [ ] Start over clears the line: `click 1 / 10; click Start over; count .chip.found = 0; see Tap the fractions from least to greatest.`
- Quick check: Friends drank water from bottles the same size: 1/2, 3/4, 1/8, and 1/3 of a bottle. Which list goes from least to greatest? Answer: “1/8, 1/3, 1/2, 3/4”. Mistakes it names: “1/2, 1/3, 1/8, 3/4”, “3/4, 1/2, 1/3, 1/8”.
