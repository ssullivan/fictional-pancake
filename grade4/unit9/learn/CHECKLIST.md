# Checklist: Learn Putting It All Together (Grade 4 Unit 9)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–8, 10. Not covered: Lessons 9, 11, and 12 (Create Word Problems, Which One Doesn’t Belong?, Number Talk), open-ended.

## Chapter 1: Reason with fractions · `learn/fractions.html` · Lessons 1–3

### Step 1: Add, subtract, and multiply fractions
- [ ] It starts adding 5/8 + 3/8: `see 5/8 + 3/8 = 8/8 = 1; see add the numerators, 5 + 3 = 8.`
- [ ] Subtract crosses parts out: `click Subtract; see 5/8 − 3/8 = 2/8; see Take 3 of the 5 eighths away: 2 eighths left.; count .gone = 3`
- [ ] One eighth left, singular: `click Subtract; click Second: one more; see 5/8 − 4/8 = 1/8; see 1 eighth left.`
- [ ] Edge: not enough to take away: `click Subtract; click First: one less ×3; see You can’t take 3 eighths from 2.`
- [ ] Multiply: `click Multiply; see = 15/5 = 3`
- [ ] Edge: steppers stop at 7 and 1: `click First: one more ×4; see 7/8 + 3/8; click Second: one less ×4; see 7/8 + 1/8`
- Quick check: What is 3/8 + 6/8? Answer: 1.125. Mistakes it names: 0.5625.

### Step 2: Which operation?
- [ ] It starts with the ribbon and no pick: `see Each bow takes 3/4 yard of ribbon.; see Which operation does the story need? Tap one.`
- [ ] The right operation: `click Multiply; see Yes! Here there are equal groups of the same amount.`
- [ ] A wrong one says so: `click Add; see Not quite.`
- [ ] Another story clears the pick: `click Juice; see Which operation does the story need?; click Subtract; see 7/8 − 3/8 = 4/8 liter.`
- [ ] Mixed numbers: `click Hike; click Add; see 2 1/4 + 1 2/4 = 3 3/4 miles.`
- Quick check: Each muffin takes 2/3 cup of flour. Which expression shows the flour for 6 muffins? Answer: “6 × 2/3”. Mistakes it names: “6 + 2/3”, “2/3 − 6”.

## Chapter 2: Whole-number operations · `learn/operations.html` · Lessons 4–6

### Step 1: The standard algorithms
- [ ] It starts at the ones: `see Start with the ones column.`
- [ ] Edge: all 4 columns, and + stops there: `click Columns: one more ×5; see All 4 columns worked: 4,625 + 2,318 = 6,943.`
- [ ] Subtracting across zeros: `click 7,005 − 2,348; click Columns: one more ×4; see 7,005 − 2,348 = 4,657`
- [ ] Multiplying: `click 1,305 × 4; click Columns: one more; see 1 column worked. Carry the tens`
- Quick check: What is 7,005 − 2,348? Answer: 4657. Mistakes it names: 5343, 9353.

### Step 2: Divide with partial quotients
- [ ] It starts with 896 ÷ 7: `see How many groups of 7 are in 896?`
- [ ] One chunk: `click Chunks: one more; see 100 groups of 7 is 700.`
- [ ] Edge: all the chunks, and + stops there: `click Chunks: one more ×4; see 100 + 20 + 8 = 128`
- [ ] A 0 in the quotient: `click 1,236 ÷ 4; click Chunks: one more ×3; see 300 + 9 = 309`
- Quick check: What is 1,236 ÷ 4? Answer: 309. Mistakes it names: 39, 4944.

## Chapter 3: Multiplication and division problems · `learn/problems.html` · Lessons 7–8

### Step 1: Comparison problems
- [ ] It starts asking for the bigger amount: `see Noah plants 4 times as many. How many seeds does Noah plant?; see 4 × 6 = 24`
- [ ] How many times: `click How many times; see 24 ÷ 6 = 4`
- [ ] The smaller amount: `click The smaller amount; see 24 ÷ 4 = 6`
- [ ] How many more: `click How many more; see 4 × 6 = 24, and 24 − 6 = 18`
- [ ] Edge: the steppers stop at 9 and 2: `click Seeds in a cup: one more ×4; see 4 × 9 = 36; click Times as many: one less ×3; see 2 × 9 = 18`
- Quick check: A giraffe is 18 feet tall. A kangaroo is 6 feet tall. How many times as tall as the kangaroo is the giraffe? Answer: 3 times. Mistakes it names: 12, 108.

### Step 2: Multiply or divide?
- [ ] It starts with the train and no pick: `see A train has 9 cars; see Multiply or divide? Tap one.`
- [ ] Multiply: `click Multiply; see Yes!; see 9 × 64 = 576 seats.`
- [ ] A wrong pick: `click Boxes; click Multiply; see Not quite.; see 156 ÷ 12 = 13 cartons.`
- [ ] A remainder: `click Teams; click Divide; see 87 ÷ 6 = 14 R 3`
- Quick check: A theater has 8 rows with 45 seats in each row. How many seats are there? Answer: 360 seats. Mistakes it names: 53, 320.

## Chapter 4: Estimate · `learn/estimate.html` · Lesson 10

### Step 1: Round to estimate
- [ ] It starts rounding 48 × 21 to tens: `see 50 × 20 = 1,000; see The exact answer is 1,008. The estimate is off by 8.`
- [ ] Edge: rounding too far makes 0: `click Hundred; see Rounding to the nearest hundred turns a number into 0`
- [ ] A sum to tens: `click 3,489 + 2,516; see 3,490 + 2,520 = 6,010`
- [ ] A sum to thousands: `click 3,489 + 2,516; click Thousand; see 3,000 + 3,000 = 6,000`
- Quick check: Which is the best estimate of 39 × 52? Answer: “2,000”. Mistakes it names: “200”, “20,000”.

### Step 2: About how many?
- [ ] It starts with a guess that's too high: `see About how many seats are in 18 rows of 23 seats?; see 500 is too high.`
- [ ] A close guess: `click Your guess: one less; see Close!`
- [ ] Another story: `click Pages; see 500 is too low.; click Your guess: one more ×7; see Close!`
- [ ] Edge: the guess stops at 5,000 and 100: `click Your guess: one more ×50; see 5,000 is too high.; click Your guess: one less ×55; see 100 is too low.`
- Quick check: Estimate 612 + 389 by rounding each number to the nearest hundred. Answer: 1000. Mistakes it names: 900, 1001.
