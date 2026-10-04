# Checklist: Learn Multiplicative Comparison and Measurement (Grade 4 Unit 5)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–17. Not covered: Lesson 18 (Two Truths and a Lie), optional. Units change only from larger to smaller; parts of a pound or an hour are halves and fourths.

## Chapter 1: Times as many · `learn/times-as-many.html` · Lessons 1–3

### Step 1: Times as many
- [ ] It starts with 3 times as many as 4: `see 3 × 4 = 12; see Lin has 3 times as many as Han: 3 groups of 4. 12 is 3 times as many as 4.; count rect.tt1 = 3`
- [ ] One more time adds a copy: `click Times as many: one more; see 4 × 4 = 16; count rect.tt1 = 4`
- [ ] Edge: 1 time as many is the same amount: `click Times as many: one less ×3; see 1 time as many is the same amount: Lin has 4, just like Han.; count rect.tt1 = 1`
- [ ] Edge: Han stops at 9 and at 1: `click Han has: one more ×7; see 3 × 9 = 27; click Han has: one less ×10; see 3 × 1 = 3`
- [ ] Edge: times stops at 6: `click Times as many: one more ×5; see 6 × 4 = 24; count rect.tt1 = 6`
- Quick check: Andre has 6 shells. Clare has 4 times as many. How many shells does Clare have? Answer: “24 shells”. Mistakes it names: “10 shells”, “4 shells”.

### Step 2: Find the missing number
- [ ] It starts with Lin's amount missing: `see Han has 5 books. Lin has 3 times as many. How many books does Lin have?; see ? = 3 × 5; see Multiply: 3 × 5 = 15. Lin has 15 books.`
- [ ] How many times, found by dividing: `click How many times; see 15 = ? × 5; see Divide: 15 ÷ 5 = 3. Lin has 3 times as many.; count rect.tt1 = 1`
- [ ] Han's amount, found by dividing: `click Han’s amount; see 15 = 3 × ?; see Divide: 15 ÷ 3 = 5. Han has 5 books.; count rect.tt1 = 3`
- [ ] Another comparison keeps the missing number: `click Han’s amount; click 6 × 4; see Lin has 24 stickers. That’s 6 times as many as Han has.; see 24 ÷ 6 = 4`
- Quick check: A school bus is 12 meters long. A car is 4 meters long. How many times as long as the car is the bus? Answer: 3 times. Mistakes it names: 8, 48.

## Chapter 2: More than or times as many · `learn/comparisons.html` · Lessons 4–6

### Step 1: More than or times as many
- [ ] It starts with 3 more: `see 4 + 3 = 7; see 3 more than 4 adds 3: Lin has 7.; count rect.tgap = 1`
- [ ] Times as many, and how many more that is: `click Times as many; see 3 × 4 = 12; see That’s 8 more than Han, because the 3 groups are Han’s 1 group and 2 more.; count rect.tgap = 0; count rect.tt1 = 3`
- [ ] Edge: the number stops at 5 and Han at 1: `click Number: one more ×4; see 4 + 5 = 9; click Han has: one less ×5; see 1 + 5 = 6`
- [ ] Edge: the number stops at 2: `click Number: one less ×3; see 4 + 2 = 6`
- Quick check: Mai picked 5 apples. Noah picked 4 times as many. How many more apples did Noah pick than Mai? Answer: “15 apples”. Mistakes it names: “20 apples”, “9 apples”.

### Step 2: Bigger amounts
- [ ] It starts with 4 times 300 as hundreds: `see 4 × 300 = 1,200; see 300 is 3 hundreds, so 4 times as much is 4 × 3 = 12 hundreds: 1,200.`
- [ ] A one-digit amount: `click 6; see 4 × 6 = 24; see 4 groups of 6: 24.`
- [ ] Ten times as much moves the digits: `click Times as much: one more ×6; see 10 × 300 = 3,000; see Ten times as much moves every digit one place to the left.`
- [ ] Edge: times stops at 2: `click Times as much: one less ×4; see 2 × 300 = 600`
- [ ] Thousands: `click 2,000; see 2,000 is 2 thousands, so 4 times as much is 4 × 2 = 8 thousands: 8,000.`
- Quick check: A small dog weighs 6 kilograms. A lion weighs 30 times as much. How much does the lion weigh? Answer: 180 kilograms. Mistakes it names: 36, 18.

## Chapter 3: Metric units · `learn/metric.html` · Lessons 7–10

### Step 1: Meters, centimeters, and kilometers
- [ ] It starts with 3 meters: `see 3 × 100 = 300; see 1 meter is 100 centimeters, so 3 meters are 3 × 100 = 300 centimeters.; count table.conv tbody tr = 3`
- [ ] Edge: 1 meter, singular, and − stops there: `click How many: one less ×4; see so 1 meter is 1 × 100 = 100 centimeters.; count table.conv tbody tr = 1`
- [ ] Kilometers: `click Kilometers to meters; see 3 × 1,000 = 3,000; see 1 kilometer is 1,000 meters`
- [ ] Edge: + stops at 9: `click How many: one more ×7; see 9 × 100 = 900; count table.conv tbody tr = 9`
- Quick check: Elena’s school is 2 kilometers from home. How many meters is that? Answer: 2000 meters. Mistakes it names: 200, 1002.

### Step 2: Grams and kilograms, liters and milliliters
- [ ] It starts with 3 kilograms, more than 2,500 grams: `see 3 kilograms are 3 × 1,000 = 3,000 grams. That’s more than 2,500 grams, by 500 grams.`
- [ ] Less than 2,500: `click How many: one less; see 2,000 grams. That’s less than 2,500 grams, by 500 grams.`
- [ ] Liters: `click Liters to milliliters; see 1 liter is 1,000 milliliters`
- [ ] Edge: + stops at 9: `click How many: one more ×8; see 9 × 1,000 = 9,000; see by 6,500 grams.`
- Quick check: A bag holds 3 kilograms of rice. The cook uses 1,200 grams. How many grams of rice are left? Answer: 1800 grams. Mistakes it names: 1197, 4200.

## Chapter 4: Pounds, ounces, and time · `learn/pounds-time.html` · Lessons 11–13

### Step 1: Pounds and ounces
- [ ] It starts with 3 pounds: `see 3 × 16 = 48; see So 3 pounds are 48 ounces.`
- [ ] A half pound more: `click and 1/2; see 3 × 16 + 8 = 56; see 1/2 pound is 1/2 of 16: 8 ounces; count table.conv tbody tr = 4`
- [ ] Edge: 0 pounds: `click Pounds: one less ×4; see 0 pounds is 0 ounces. Add some pounds.`
- [ ] Only a part of a pound: `click Pounds: one less ×3; click and 1/4; see 1/4 × 16 = 4; see So 1/4 pound is 4 ounces.`
- [ ] Edge: + stops at 6: `click Pounds: one more ×4; see 6 × 16 = 96`
- Quick check: A puppy weighs 3 pounds. How many ounces is that? Answer: 48 ounces. Mistakes it names: 30, 19.

### Step 2: Hours, minutes, and seconds
- [ ] It starts with 1 1/2 hours, half the clock shaded: `see 1 × 60 + 30 = 90; see So 1 1/2 hours are 90 minutes.; count .clk-sh = 1`
- [ ] Whole hours only: `click Whole ones; see 1 × 60 = 60; see So 1 hour is 60 minutes.; count .clk-sh = 0`
- [ ] Minutes to seconds: `click Minutes to seconds; see 1 minute is 60 seconds; see 90 seconds`
- [ ] Three fourths: `click and 3/4; see 1 × 60 + 45 = 105`
- [ ] Edge: nothing at all: `click Whole ones; click Whole ones: one less ×2; see 0 hours is 0 minutes. Add some hours.`
- [ ] Edge: + stops at 4: `click Whole ones: one more ×5; see 4 × 60 + 30 = 270`
- Quick check: A movie is 1 1/2 hours long. How many minutes is that? Answer: 90 minutes. Mistakes it names: 110, 75.

## Chapter 5: Perimeter · `learn/perimeter.html` · Lessons 14–17

### Step 1: Perimeter of a rectangle
- [ ] It starts with 6 by 4: `see 6 + 4 + 6 + 4 = 20, or 2 × 6 + 2 × 4 = 20; see The perimeter is the distance all the way around: 20 meters.; see 6 × 4 = 24 square meters`
- [ ] A square: `click Width: one more ×2; see it’s a square, so 4 × 6 works too.`
- [ ] Edge: the biggest rectangle: `click Length: one more ×7; click Width: one more ×5; see 12 + 8 + 12 + 8 = 40`
- [ ] Edge: the smallest, a 1 by 1 square: `click Length: one less ×6; click Width: one less ×4; see 1 + 1 + 1 + 1 = 4; see it’s a square`
- Quick check: A garden is 8 meters long and 3 meters wide. How many meters of fence go all the way around it? Answer: 22 meters. Mistakes it names: 24, 11.

### Step 2: Find a missing side
- [ ] It starts with a perimeter of 20 and a length of 7: `see 20 ÷ 2 = 10, and 10 − 7 = 3; see So the width is 10 − 7 = 3 meters.`
- [ ] Edge: the length stops where the width is 1: `click Length: one more ×3; see 10 − 9 = 1`
- [ ] A bigger perimeter: `click 30 m; see 30 ÷ 2 = 15, and 15 − 7 = 8`
- [ ] Edge: a smaller perimeter shortens a long length: `click 30 m; click Length: one more ×10; see 15 − 14 = 1; click 20 m; see 10 − 9 = 1`
- [ ] Edge: the length stops at 1: `click Length: one less ×8; see 10 − 1 = 9`
- Quick check: A rectangle has a perimeter of 30 centimeters. It is 9 centimeters long. How wide is it? Answer: 6 centimeters. Mistakes it names: 21, 12.
