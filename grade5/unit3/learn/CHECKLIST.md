# Checklist: Learn Multiplying and Dividing Fractions (Grade 5 Unit 3)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–8, 11–19. Not covered: Lessons 9 (My Own Flag), 10 (Concepts of Division), and 20 (How Much in the Group?), optional. Fractions multiplied or divided have denominators 2 to 6.

## Chapter 1: A piece of a part · `learn/piece.html` · Lessons 1–4

### Step 1: Take a piece of one part
- [ ] It starts with 1/2 of 1/3: `see The light strip is 1/3 of the square. Cut it into 2 equal pieces and take 1. Pieces that size cut the whole square into 2 × 3 = 6: 1/2 × 1/3 = 1/6.; pressed Strip 1/3; pressed Take 1/2; count rect.ag.lt = 1; count rect.ag.on = 1`
- [ ] Smaller pieces: `click Strip 1/5; click Take 1/4; see 4 × 5 = 20: 1/4 × 1/5 = 1/20.`
- [ ] The same fraction twice: `click Take 1/3; see 3 × 3 = 9: 1/3 × 1/3 = 1/9.`
- Quick check: What is 1/2 × 1/4? Answer: 0.125. Mistakes it names: 0.16666666666666666, 0.75.

### Step 2: Multiply the bottoms
- [ ] It starts at 1/2 × 1/4: `see 1/2 × 1/4 = 1/8; see 2 columns × 4 rows = 8 equal pieces, and 1 of them is dark.`
- [ ] Edge: both stop at 6: `click First bottom: one more ×5; click Second bottom: one more ×3; see 1/6 × 1/6 = 1/36; see 36 equal pieces`
- [ ] Edge: both stop at 2: `click First bottom: one less ×2; click Second bottom: one less ×3; see 1/2 × 1/2 = 1/4`
- Quick check: 1/3 of a garden is for vegetables. 1/4 of the vegetable part is carrots. What fraction of the whole garden is carrots? Answer: 0.08333333333333333 of the garden. Mistakes it names: 0.14285714285714285, 0.25.

## Chapter 2: Multiply any fractions · `learn/multiply.html` · Lessons 5–8

### Step 1: Tops times tops, bottoms times bottoms
- [ ] It starts at 2/3 × 3/4: `see The square is cut into 3 × 4 = 12 pieces. The dark part is 2 × 3 = 6 of them: 2/3 × 3/4 = 6/12 = 1/2.; pressed ?/3; pressed × ?/4`
- [ ] A smaller bottom keeps its top less than it: `click ?/2; see The dark part is 1 × 3 = 3 of them: 1/2 × 3/4 = 3/8.`
- [ ] Edge: a top stops one short of its bottom: `click First top: one more ×3; see 2/3 × 3/4`
- [ ] Sixths: `click × ?/6; click Second top: one more ×4; see 2/3 × 5/6 = 10/18 = 5/9.`
- [ ] Edge: tops stop at 1: `click First top: one less ×3; click Second top: one less ×4; see 1/3 × 1/4 = 1/12.`
- Quick check: What is 3/5 × 1/2? Answer: 0.3. Mistakes it names: 0.5714285714285714, 0.5.

### Step 2: Fraction of a fraction stories
- [ ] It starts with the tulips: `see 3/4 of a garden bed is planted. 2/3 of the planted part is tulips.; see 2/3 of 3/4 is 2/3 × 3/4 = 6/12 = 1/2: 1/2 of the bed is tulips.`
- [ ] The path: `click Path; see 1/2 of 4/5 is 1/2 × 4/5 = 4/10 = 2/5: 2/5 mile is paved.`
- [ ] The cornbread: `click Cornbread; see 1/4 of 2/3 is 1/4 × 2/3 = 2/12 = 1/6: 1/6 of the pan is what Mai eats.`
- Quick check: A watering can holds 3/4 gallon. A plant gets 1/3 of the can. How many gallons does the plant get? Answer: 0.25 gallon. Mistakes it names: 0.75, 0.5714285714285714.

## Chapter 3: Share a unit fraction · `learn/divide-unit.html` · Lessons 11–12

### Step 1: Cut a unit fraction into equal pieces
- [ ] It starts with 1/3 shared by 2: `see Cut the 1/3 into 2 equal pieces. If every 1/3 were cut that way, the whole would have 3 × 2 = 6 pieces, so each share is 1/3 ÷ 2 = 1/6.; count rect.fs.on.b = 1; pressed 1/3`
- [ ] Edge: people stop at 5: `click People: one more ×4; see 3 × 5 = 15 pieces, so each share is 1/3 ÷ 5 = 1/15.`
- [ ] Fifths shared by 5: `click People: one more ×3; click 1/5; see 1/5 ÷ 5 = 1/25.`
- [ ] Edge: people stop at 2: `click People: one less ×2; click 1/2; see 1/2 ÷ 2 = 1/4.`
- Quick check: Elena has 1/4 pound of seeds to share equally among 2 pots. How much does each pot get? Answer: 0.125 pound. Mistakes it names: 0.5, 8.

## Chapter 4: How many fit? · `learn/divide-whole.html` · Lessons 13–14

### Step 1: Count how many fit
- [ ] It starts with fourths in 3: `see Each whole holds 4 pieces of 1/4, so 3 wholes hold 3 × 4 = 12: 3 ÷ 1/4 = 12.; count rect.fs.on = 12`
- [ ] Edge: one whole, and − stops: `click Wholes: one less ×3; see so 1 whole holds 1 × 4 = 4: 1 ÷ 1/4 = 4.`
- [ ] Edge: four wholes of fifths: `click Wholes: one more ×2; click 1/5; see 4 × 5 = 20: 4 ÷ 1/5 = 20.; count rect.fs.on = 20`
- [ ] Halves: `click 1/2; see 3 ÷ 1/2 = 6.`
- Quick check: A watering can holds 5 liters. How many 1/3-liter scoops fill it? Answer: 15 scoops. Mistakes it names: 1.6666666666666667, 8.

## Chapter 5: Multiply or divide? · `learn/which.html` · Lessons 15–19

### Step 1: Bigger or smaller?
- [ ] It starts with 6 × 1/2: `see 6 × 1/2 is 1/2 of 6: 3, less than 6.; pressed 6 × 1/2; count rect.tape = 2`
- [ ] Dividing by 1/2 gives more: `click 6 ÷ 1/2; see 12, more than 6`
- [ ] Sharing 1/2 gives less: `click 1/2 ÷ 6; see 1/12, less than 1/2`
- [ ] A part of a part: `click 1/3 × 1/2; see 1/6, less than 1/2`
- Quick check: Without working it out: which is greater than 4? Answer: “4 ÷ 1/3”. Mistakes it names: “4 × 1/3”, “1/3 ÷ 4”.

### Step 2: Pick the operation
- [ ] It starts with sharing: `see Lin shares 1/2 pound of soil equally among 3 flower pots.; see 1/2 ÷ 3 = 1/6 pound; see divide the fraction by the whole number`
- [ ] How many fit: `click How many fit; see 3 ÷ 1/4 = 12 scoops; see divide the whole number by the fraction`
- [ ] Part of a part: `click Part of a part; see 1/3 × 1/2 = 1/6 of the garden; see multiply`
- Quick check: A garden row is 4 meters long. A seed goes in every 1/2 meter. Which expression gives how many 1/2-meter spaces there are? Answer: “4 ÷ 1/2”. Mistakes it names: “1/2 ÷ 4”, “1/2 × 4”.
