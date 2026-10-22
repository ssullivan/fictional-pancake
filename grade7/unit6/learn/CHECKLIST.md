# Checklist: Learn Expressions, Equations, and Inequalities (Grade 7 Unit 6)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, sliders end to end, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–22 (v.III). Not covered: Lesson 23 (Applications of Expressions), an open-ended project.

## Chapter 1: Tape diagrams and equations · `learn/tape-diagrams.html` · Lessons 1–6

### Step 1: Two kinds of tape diagrams
- [ ] It starts with 3 parts plus 4: `pressed 3 parts plus 4; see 3x + 4 = 19; see 3 parts of 5 are 15, plus 4 once: 19; count rect.tx = 3`
- [ ] Groups count the 4 three times: `click 3 groups of x and 4; see 3(x + 4) = 27; see The 4 is counted 3 times; count rect.tq = 3`
- [ ] A bigger x: `click x: one more ×2; see 3 parts of 7 are 21, plus 4 once: 25`
- [ ] Edge: x stops at 1: `click x: one less ×9; see 3 parts of 1 are 3, plus 4 once: 7`
- [ ] Edge: and at 9: `click x: one more ×9; see 3 parts of 9 are 27`
- Quick check: A tape has 5 equal groups, and each group is an unknown and 2 more. The whole tape is 35. Which equation matches? Answer: “5(x + 2) = 35”. Mistakes it names: “5x + 2 = 35”, “x + 2 = 35”.

### Step 2: Stories and equations
- [ ] It starts with notebooks: `pressed Notebooks; see 4x + 3 = 23; see The 3 is there only once`
- [ ] Snacks come in groups: `click Snacks; see 4(x + 3) = 32; see The 3 comes with every group`
- [ ] The plant: `click Plant; see 3x + 5 = 20`
- [ ] Bags: `click Bags; see 3(x + 5) = 27; count rect.tq = 3`
- Quick check: Noah buys 6 tickets that cost the same and pays a $4 fee once. The total is $46. Which equation fits? Answer: “6x + 4 = 46”. Mistakes it names: “6(x + 4) = 46”, “10x = 46”.

## Chapter 2: Solving equations · `learn/solving.html` · Lessons 7–12

### Step 1: Keeping the hanger balanced
- [ ] It starts with three unknowns: `pressed Start; see 3x + 4 = 19; see 3 unknowns and 4 balance 19.; count circle.hg-x = 3`
- [ ] Take 4 off each side: `click Take 4 off; see 3x = 15; see Take 4 off each side`
- [ ] Split in 3: `click Split in 3; see x = 5; see Check: 3 × 5 + 4 = 19 ✓; count circle.hg-x = 1`
- Quick check: Solve: 4x + 3 = 23 Answer: 5. Mistakes it names: 6.5, 5.75.

### Step 2: p(x + q) = r: two ways
- [ ] It starts dividing first: `pressed Divide first; see Divide both sides by 3: x + 2 = 7. Subtract 2: x = 5`
- [ ] Distributing first gets the same answer: `click Distribute first; see Multiply out: 3x + 6 = 21. Subtract 6: 3x = 15. Divide by 3: x = 5`
- Quick check: Solve: 5(x − 1) = 30 Answer: 7. Mistakes it names: 5, 6.2.

### Step 3: Negative numbers
- [ ] It starts with −3x + 4 = 19: `pressed −3x + 4 = 19; see Divide by −3: x = −5`
- [ ] Subtracting first: `click 2x − 7 = −13; see Add 7: 2x = −6`
- [ ] Groups with a negative: `click −4(x − 1) = 20; see x = −4. Check: −4 × (−4 − 1) = 20 ✓`
- Quick check: Solve: −2x + 5 = 17 Answer: -6. Mistakes it names: 6, -11.

### Step 4: Percent problems
- [ ] It starts at 20% off: `pressed 20% off; see 0.8x + 5 = 45; see x = 40 ÷ 0.8 = $50`
- [ ] Half off: `click 50% off; see 0.5x + 5 = 45; see = $80`
- [ ] 60% off: `click 60% off; see 0.4x + 5 = 45; see = $100`
- Quick check: A game is 25% off, and tax adds $3. Diego pays $33 in all. What was the price before the discount? Answer: 40 dollars. Mistakes it names: 30, 37.5.

## Chapter 3: Inequalities · `learn/inequalities.html` · Lessons 13–17

### Step 1: Graphing solutions
- [ ] It starts with x > −2, a hollow circle: `pressed >; see x > −2: every number greater than −2. The circle at −2 is hollow; see the ray points right; count circle.sl-end.open = 1`
- [ ] ≤ fills the circle and points left: `click ≤; see x ≤ −2: every number less than or equal to −2; see is filled in; see the ray points left`
- [ ] Move the boundary: `click ≥; click Boundary: one more ×5; see x ≥ 3`
- [ ] Edge: the boundary stops at −6: `click Boundary: one less ×10; see x > −6`
- Quick check: Which number is a solution of x ≤ −3? Answer: “−3”. Mistakes it names: “−2”, “0”.

### Step 2: Solving inequalities
- [ ] It starts with 3x + 2 > 14: `pressed 3x + 2 > 14; see So x > 4.`
- [ ] A negative coefficient turns it around: `click −2x + 1 ≥ 9; see the solutions are on the other side; see So x ≤ −4.`
- [ ] Subtracting x: `click 5 − x < 2; see Test 4: 5 − 4 = 1 < 2 ✓; see So x > 3.`
- Quick check: Solve: −3x > 12 Answer: “x < −4”. Mistakes it names: “x > −4”, “x > 4”.

### Step 3: The most a budget allows
- [ ] It starts at 8 rides: `see 8 rides cost 10 + 4 × 8 = $42. That fits the $50.`
- [ ] The most: `click Rides: one more ×2; see 10 rides cost 10 + 4 × 10 = $50; see It’s the most: 11 rides would cost $54.`
- [ ] Over budget: `click Rides: one more ×3; see Over the $50.`
- [ ] Edge: the rides stop at 12: `click Rides: one more ×10; see 12 rides cost`
- [ ] Edge: and at 0: `click Rides: one less ×10; see 0 rides cost 10 + 4 × 0 = $10`
- Quick check: A gym charges $15 to join and $6 a class. Jada can spend at most $60. What is the most classes Jada can take? Answer: 7 classes. Mistakes it names: 7.5, 8, 10.

## Chapter 4: Equivalent expressions · `learn/equivalent.html` · Lessons 18–22

### Step 1: Distributing and factoring
- [ ] It starts with 3(2x + 5): `pressed 3(2x + 5); see 3(2x + 5) = 6x + 15; see When x = 2, both are 27`
- [ ] A negative outside: `click −2(x + 4); see −2(x + 4) = −2x − 8`
- [ ] A negative inside, and a negative x: `click 4(3x − 2); see 4(3x − 2) = 12x − 8; click x: one less ×5; see When x = −3, both are −44`
- [ ] Edge: x stops at 5: `click x: one more ×5; see When x = 5`
- Quick check: Which expression is equivalent to −3(x − 4)? Answer: “−3x + 12”. Mistakes it names: “−3x − 12”, “−3x − 4”.

### Step 2: Subtracting a group
- [ ] It starts with 10 − (3x + 4): `pressed 10 − (3x + 4); see 10 − (3x + 4) = 10 − 3x − 4 = −3x + 6; see Both are taken away.`
- [ ] Subtracting a negative adds: `click 8 − (2x − 5); see = −2x + 13; see Subtracting (−5) adds 5.`
- [ ] The numbers cancel: `click 6 − (x + 6); see = −x`
- Quick check: Which expression is equivalent to 12 − (2x − 5)? Answer: “17 − 2x”. Mistakes it names: “7 − 2x”, “17 + 2x”.

### Step 3: Combining like terms
- [ ] It starts at x = 1: `see When x = 1: 5 × 1 + 3 − 2 × 1 + 4 = 10, and 3 × 1 + 7 = 10`
- [ ] A negative x: `click x: one less ×3; see When x = −2: 5 × (−2) + 3 − 2 × (−2) + 4 = 1`
- [ ] Edge: x stops at −4: `click x: one less ×10; see When x = −4`
- [ ] Edge: and at 6: `click x: one more ×10; see When x = 6`
- Quick check: Which expression is equivalent to 7x − 2 − 3x + 9? Answer: “4x + 7”. Mistakes it names: “10x + 7”, “11x”.
