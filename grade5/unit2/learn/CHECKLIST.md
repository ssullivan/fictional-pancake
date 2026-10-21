# Checklist: Learn Fractions as Quotients and Fraction Multiplication (Grade 5 Unit 2)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–15. Not covered: Lessons 16 (Estimate Products) and 17 (Mosaic Pictures), optional. Denominators 2 to 6; whole numbers small enough to divide in your head.

## Chapter 1: Share sandwiches · `learn/sharing.html` · Lessons 1–3

### Step 1: Share sandwiches equally
- [ ] It starts with 3 sandwiches for 4 friends: `see Cut each sandwich into 4 equal pieces, one for each friend. Each friend gets 3 pieces of 1/4 (gold): 3 ÷ 4 = 3/4 sandwich.; count rect.sw.mine = 3; count line.swcut = 9`
- [ ] One sandwich, one piece each: `click Sandwiches: one less ×2; see Each friend gets 1 piece of 1/4 (gold): 1 ÷ 4 = 1/4 sandwich.`
- [ ] More sandwiches than friends: `click Sandwiches: one more ×3; see 6 ÷ 4 = 6/4 = 1 2/4 sandwiches.; count rect.sw.mine = 6`
- [ ] As many sandwiches as friends: `click Sandwiches: one more; see 4 ÷ 4 = 4/4 = 1 sandwich.`
- [ ] Edge: sandwiches stop at 6 and at 1: `click Sandwiches: one more ×5; see Each friend gets 6 pieces; click Sandwiches: one less ×7; see Each friend gets 1 piece`
- [ ] Edge: friends stop at 6 and at 2: `click Friends: one more ×4; see Cut each sandwich into 6 equal pieces; click Friends: one less ×6; see Cut each sandwich into 2 equal pieces; see 3 ÷ 2 = 3/2 = 1 1/2 sandwiches.`
- Quick check: 2 sandwiches are shared equally by 5 friends. How much does each friend get? Answer: 0.4 sandwich. Mistakes it names: 2.5, 0.2.

### Step 2: a ÷ b is a/b
- [ ] It starts at 5 ÷ 3: `see 5 ÷ 3 = 5/3; see 5 sandwiches shared equally by 3 people. Each gets 5 pieces of 1/3: 5/3 = 1 2/3.; count rect.fs.on = 5`
- [ ] Less than 1: `click Shared: one less ×4; see 1 sandwich shared equally by 3 people. Each gets 1 piece of 1/3: 1/3.`
- [ ] A whole number: `click Shared: one more ×3; click People: one less; see 8 ÷ 2 = 8/2; see 8/2 = 4.`
- [ ] Edge: shared stops at 8 and 1, people at 6 and 2: `click Shared: one more ×5; see 8 ÷ 3; click Shared: one less ×9; see 1 ÷ 3; click People: one more ×5; see 1 ÷ 6; click People: one less ×6; see 1 ÷ 2`
- Quick check: Which story matches 5 ÷ 3 = 5/3? Answer: “5 sandwiches shared equally by 3 friends”. Mistakes it names: “3 sandwiches shared equally by 5 friends”, “5 friends each get 3 sandwiches”.

## Chapter 2: Division and fractions · `learn/division.html` · Lessons 4–5

### Step 1: Share what’s left over
- [ ] It starts at 7 ÷ 4, with jumps to the point: `see 7 ÷ 4 = 7/4 = 1 3/4: 7 jumps of 1/4 from 0. 4 goes into 7 1 time with 3 left over, and the 3 left over shared by 4 is 3/4 more.; count circle.pt = 1; count path.hop = 7`
- [ ] Nothing left over: `click Divide: one more; see 8 ÷ 4 = 2: 8 jumps of 1/4 from 0. 4 goes into 8 exactly 2 times, with nothing left over.`
- [ ] Less than 1: `click Divide: one less ×4; see 3 ÷ 4 = 3/4: 3 jumps of 1/4 from 0. 3 is less than 4, so each share is less than 1.`
- [ ] Edge: the biggest, 12 ÷ 2: `click Divide: one more ×6; click By: one less ×3; see 12 ÷ 2 = 6`
- [ ] Edge: divide stops at 1, by at 6: `click Divide: one less ×8; see 1 ÷ 4 = 1/4; click By: one more ×3; see 1 ÷ 6 = 1/6`
- Quick check: A 7-meter rope is cut into 2 equal pieces. How long is each piece? Answer: 3.5 meters. Mistakes it names: 0.2857142857142857, 3.

## Chapter 3: A fraction of a number · `learn/fraction-of.html` · Lessons 6–8

### Step 1: One part of a number
- [ ] It starts with 1/4 of 12: `see Split 12 into 4 equal parts: each part is 12 ÷ 4 = 3. 1/4 × 12 = 12 ÷ 4 = 3.; count rect.tape = 4; pressed 1/4`
- [ ] Halves: `click 1/2; see 1/2 × 12 = 12 ÷ 2 = 6.; count rect.tape = 2`
- [ ] Thirds and sixths: `click 1/3; see 1/3 × 12 = 12 ÷ 3 = 4.; click 1/6; see 1/6 × 12 = 12 ÷ 6 = 2.; count rect.tape = 6`
- Quick check: Lin picks 15 berries. 1/5 of them are strawberries. How many strawberries does Lin pick? Answer: 3 strawberries. Mistakes it names: 75, 5.

### Step 2: Some parts of a number
- [ ] It starts with 3 of 4 parts: `see Each of the 4 parts is 12 ÷ 4 = 3. Take 3: 3/4 × 12 = 3 × (12 ÷ 4) = 3 × 3 = 9.; count rect.tape.hi = 3`
- [ ] Edge: take stops at all the parts: `click Take: one more ×3; see 4/4 × 12 = 4 × (12 ÷ 4) = 4 × 3 = 12.`
- [ ] Edge: take stops at 1: `click Take: one less ×4; see 1/4 × 12 = 1 × (12 ÷ 4) = 1 × 3 = 3.`
- [ ] Fewer parts keep take inside them: `click 2 parts; see Take 2: 2/2 × 12 = 2 × (12 ÷ 2) = 2 × 6 = 12.`
- [ ] Sixths: `click 6 parts; click Take: one more ×2; see 5/6 × 12 = 5 × (12 ÷ 6) = 5 × 2 = 10.`
- Quick check: There are 12 apples in a basket. 2/3 of them are red. How many red apples are there? Answer: 8 apples. Mistakes it names: 4, 24.

### Step 3: When it doesn’t split evenly
- [ ] It starts with 2/3 of 5 pounds: `see 2/3 of each pound is 2 pieces of 1/3. 5 pounds give 5 × 2 = 10 pieces: 2/3 × 5 = 10/3 = 3 1/3 pounds.; count rect.fs.on = 10`
- [ ] Edge: one pound, and − stops: `click Pounds: one less ×5; see 1 pound gives 1 × 2 = 2 pieces: 2/3 × 1 = 2/3 pound.`
- [ ] It comes out whole: `click 3/4; click Pounds: one less; see 3/4 × 4 = 3 pounds.`
- [ ] One piece of each: `click 1/3; click Pounds: one less ×2; see 1/3 of each pound is 1 piece of 1/3. 3 pounds give 3 × 1 = 3 pieces: 1/3 × 3 = 1 pound.`
- [ ] Edge: pounds stop at 5: `click 2/5; click Pounds: one more ×2; see 2/5 × 5 = 2 pounds.`
- Quick check: Jada has 5 pounds of blueberries and uses 3/4 of them in muffins. How many pounds is that? Answer: 3.75 pounds. Mistakes it names: 15, 0.15.

## Chapter 4: Area with a fraction side · `learn/area.html` · Lessons 9–11

### Step 1: A side less than 1
- [ ] It starts at 3 by 2/5: `see Each unit square is cut into 5 parts of 1/5 square unit. The rectangle covers 2 in each of 3 squares: 6 parts. 3 × 2/5 = 6/5 = 1 1/5 square units.; pressed 5 parts`
- [ ] Edge: the width stops one part short of 1: `click Width parts: one more ×4; see 3 × 4/5 = 12/5 = 2 2/5 square units.`
- [ ] Fewer parts keep the width less than 1: `click Width parts: one more ×2; click 2 parts; see 3 × 1/2 = 3/2 = 1 1/2 square units.`
- [ ] Edge: one square long, and − stops: `click Length: one less ×3; see The rectangle covers 2 in each of 1 square: 2 parts. 1 × 2/5 = 2/5 square unit.`
- [ ] It comes out whole: `click 3 parts; click Width parts: one less; see 3 × 1/3 = 3/3 = 1 square unit.`
- [ ] Edge: length stops at 5: `click Length: one more ×3; see 5 × 2/5 = 10/5 = 2 square units.`
- Quick check: Each square is 1 unit by 1 unit. What is the area of the shaded rectangle? Answer: 2.6666666666666665 square units. Mistakes it names: 4.666666666666667, 0.6666666666666666.

### Step 2: A side more than 1
- [ ] It starts at 3 by 2 1/4: `see Gold: 3 × 2 = 6. Blue: 3 × 1/4 = 3/4. 3 × 2 1/4 = 6 + 3/4 = 6 3/4 square units.; count rect.ag.on.b = 1; pressed 1/4`
- [ ] A blue part more than 1: `click 3/4; see Blue: 3 × 3/4 = 9/4 = 2 1/4. 3 × 2 3/4 = 6 + 9/4 = 8 1/4 square units.`
- [ ] Edge: the biggest, and a whole-number answer: `click 1/2; click Length: one more ×2; click Whole part: one less ×2; see Gold: 4 × 1 = 4. Blue: 4 × 1/2 = 4/2 = 2. 4 × 1 1/2 = 4 + 4/2 = 6 square units.`
- [ ] Edge: length stops at 1, whole part at 2: `click Length: one less ×3; click Whole part: one more ×2; see Gold: 1 × 2 = 2.`
- Quick check: A picnic blanket is 3 meters long and 2 1/4 meters wide. What is its area? Answer: 6.75 square meters. Mistakes it names: 6, 6.25.

## Chapter 5: Split and solve · `learn/split.html` · Lessons 12–15

### Step 1: Split a mixed number to multiply
- [ ] It starts with 4 × 2 1/3: `see 4 × 2 1/3 = (4 × 2) + (4 × 1/3); see Gold: 4 × 2 = 8. Blue: 4 × 1/3 = 4/3. Add: 8 + 4/3 = 9 1/3.; count rect.ag.on.b = 1`
- [ ] 3 × 1 3/4: `click 3 × 1 3/4; see Gold: 3 × 1 = 3. Blue: 3 × 3/4 = 9/4. Add: 3 + 9/4 = 5 1/4.`
- [ ] Whole-number answers: `click 2 × 3 1/2; see Add: 6 + 2/2 = 7.; click 5 × 1 2/5; see Add: 5 + 10/5 = 7.`
- Quick check: Which expression has the same value as 5 × 2 1/2? Answer: “(5 × 2) + (5 × 1/2)”. Mistakes it names: “(5 × 2) + 1/2”, “5 × 2 × 1/2”.

### Step 2: Area stories
- [ ] It starts with the garden path: `see A garden path is 6 meters long and 3/4 meter wide. What is its area?; see Length × width: 6 × 3/4 = 18/4 = 4 2/4 square meters.`
- [ ] The patio splits its width: `click Patio; see Split the width into 2 + 1/2. 3 × 2 = 6, and 3 × 1/2 = 3/2. 6 + 3/2 = 7 1/2 square meters.; count rect.ag.on.b = 1`
- [ ] The quilt, in square yards: `click Quilt; see 2 + 4/3 = 3 1/3 square yards.`
- Quick check: A garden path is 5 meters long and 2/3 meter wide. What is its area? Answer: 3.3333333333333335 square meters. Mistakes it names: 5.666666666666667, 0.13333333333333333.
