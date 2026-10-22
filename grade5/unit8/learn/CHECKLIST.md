# Checklist: Learn Putting It All Together (Grade 5 Unit 8)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–8, 10–13. Not covered: Lesson 9 (Problem Solving with Volume: Water), optional, and Lessons 14–18 (Creation and Design), open-ended.

## Chapter 1: Multiply and divide · `learn/whole-numbers.html` · Lessons 1–5

### Step 1: The largest product
- [ ] It starts with 98 × 76: `see 98 × 76 = 7,448. The largest is 8,352: 904 more.; count text.ares = 11; pressed 98 × 76`
- [ ] The largest: `click 96 × 87; see 96 × 87 = 8,352, the largest product`
- [ ] Close to the largest: `click 97 × 86; see 97 × 86 = 8,342. The largest is 8,352: 10 more.`
- [ ] The smallest: `click 69 × 78; see 69 × 78 = 5,382.`
- Quick check: What is 305 × 24? Answer: 7320. Mistakes it names: 1830, 1220.

### Step 2: Divide in chunks
- [ ] It starts with 1,575 ÷ 25: `see Take away friendly chunks of 25: 60 × 25 = 1,500, then 3 × 25 = 75. 1,575 ÷ 25 = 63. Check: 63 × 25 = 1,575.`
- [ ] A chunk of 100: `click 1,248 ÷ 12; see 100 × 12 = 1,200, then 4 × 12 = 48. 1,248 ÷ 12 = 104.`
- [ ] 2,340 ÷ 45: `click 2,340 ÷ 45; see 2,340 ÷ 45 = 52. Check: 52 × 45 = 2,340.`
- Quick check: What is 1,575 ÷ 25? Answer: 63. Mistakes it names: 60, 1550.

## Chapter 2: Volume again · `learn/volume.html` · Lessons 6–8

### Step 1: Fill the wagon
- [ ] It starts at 6 by 3 by 2: `see 6 × 3 = 18 cubic feet in a layer, and 2 layers: 6 × 3 × 2 = 36 cubic feet.; count text.lbl = 3`
- [ ] Edge: the biggest: `click Length: one more ×4; click Width: one more ×3; click Depth: one more ×2; see 9 × 5 × 3 = 135 cubic feet.`
- [ ] Edge: the smallest, one layer: `click Length: one less ×5; click Width: one less ×2; click Depth: one less ×2; see 2 × 2 = 4 cubic feet in a layer, and 1 layer: 2 × 2 × 1 = 4 cubic feet.`
- Quick check: A wagon bed is 8 feet long, 4 feet wide, and 2 feet deep. How many cubic feet of hay fill it? Answer: 64 cubic feet. Mistakes it names: 14, 32.

### Step 2: Estimate a giant wagon
- [ ] It starts with Wagon A: `see 27 ft × 13 ft × 2 ft; see Round to 30 × 10 × 2: about 600 cubic feet. Exactly, it’s 27 × 13 × 2 = 702, a bit more.`
- [ ] Wagon B: `click Wagon B; see Round to 30 × 20 × 3: about 1,800 cubic feet. Exactly, it’s 34 × 18 × 3 = 1,836`
- [ ] Wagon C: `click Wagon C; see about 800 cubic feet. Exactly, it’s 22 × 11 × 4 = 968`
- Quick check: A giant wagon is 29 feet long, 12 feet wide, and 3 feet deep. About how much does it hold? Answer: “about 900 cubic feet”. Mistakes it names: “about 44 cubic feet”, “about 9,000 cubic feet”.

## Chapter 3: Fraction sums and differences · `learn/fractions.html` · Lessons 10–11

### Step 1: A common denominator
- [ ] It starts with 2/3 + 1/4: `see 12 is a multiple of 3 and of 4: 2/3 = 8/12 and 1/4 = 3/12. 8/12 + 3/12 = 11/12.; count rect.fs.on = 11`
- [ ] More than 1: `click 5/6 + 3/4; see 10/12 + 9/12 = 19/12 = 1 7/12.`
- [ ] Subtract: `click 7/8 − 1/2; see 7/8 − 4/8 = 3/8.; click 4/5 − 1/3; see 12/15 − 5/15 = 7/15.`
- Quick check: What is 3/4 − 1/6? Answer: 0.5833333333333334. Mistakes it names: 1, 0.16666666666666666.

## Chapter 4: Decimals and fraction products · `learn/decimals-fractions.html` · Lessons 12–13

### Step 1: Decimals, all four ways
- [ ] It starts with adding: `see Line up the decimal points: 1.3 is 1.30. 2.45 + 1.30 = 3.75.; pressed 2.45 + 1.3`
- [ ] Subtracting: `click 6.4 − 2.35; see 6.40 − 2.35 = 4.05.`
- [ ] Multiplying: `click 0.7 × 0.6; see tenths × tenths make hundredths: 0.7 × 0.6 = 0.42.`
- [ ] Dividing: `click 2.4 ÷ 0.3; see 24 ÷ 3 = 8: 2.4 ÷ 0.3 = 8.`
- Quick check: What is 0.8 × 0.4? Answer: 0.32. Mistakes it names: 3.2, 0.032.

### Step 2: Multiply fractions
- [ ] It starts with 2/3 × 3/4: `see The square is cut into 3 × 4 = 12 pieces, and 2 × 3 = 6 are gold: 2/3 × 3/4 = 6/12 = 1/2.; count rect.ag.lt = 1`
- [ ] 1/2 × 4/5: `click 1/2 × 4/5; see 2 × 5 = 10 pieces, and 1 × 4 = 4 are gold: 1/2 × 4/5 = 4/10 = 2/5.`
- [ ] 5/6 × 2/3: `click 5/6 × 2/3; see 5/6 × 2/3 = 10/18 = 5/9.`
- Quick check: What is 3/5 × 2/3? Answer: 0.4. Mistakes it names: 0.625, 0.6666666666666666.
