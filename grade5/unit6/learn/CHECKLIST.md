# Checklist: Learn More Decimal and Fraction Operations (Grade 5 Unit 6)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–19. Not covered: Lessons 20 (Will it Always Work?) and 21 (Weekend Investigation), optional. Common denominators up to 24.

## Chapter 1: Powers of 10 · `learn/powers.html` · Lessons 1–2

### Step 1: The digits move
- [ ] It starts with 3.5 × 100: `see Each digit moves 2 places left: 3.5 × 100 = 350.; pressed 3.5; pressed × 100`
- [ ] Three places left: `click 42; click × 1,000; see Each digit moves 3 places left: 42 × 1,000 = 42,000.`
- [ ] One place right: `click 0.7; click ÷ 10; see Each digit moves 1 place right: 0.7 ÷ 10 = 0.07.`
- [ ] Two places right: `click ÷ 100; see 3.5 ÷ 100 = 0.035.`
- [ ] One place left: `click 42; click × 10; see 42 × 10 = 420.`
- Quick check: What is 0.45 × 100? Answer: 45. Mistakes it names: 4.5, 0.0045.

### Step 2: Exponents
- [ ] It starts at 4 × 10³: `see = 10 × 10 × 10 = 1,000: 1 followed by 3 zeros. Times 4 is 4,000.`
- [ ] Edge: the exponent stops at 6: `click Exponent: one more ×4; see = 10 × 10 × 10 × 10 × 10 × 10 = 1,000,000: 1 followed by 6 zeros. Times 4 is 4,000,000.`
- [ ] Edge: the exponent stops at 1, one zero: `click Exponent: one less ×3; see = 10: 1 followed by 1 zero. Times 4 is 40.`
- [ ] Edge: the number stops at 9 and 1: `click Number: one more ×6; see Times 9 is 9,000.; click Number: one less ×9; see Times 1 is 1,000.`
- Quick check: What is 7 × 103? Answer: 7000. Mistakes it names: 21, 700.

## Chapter 2: Metric conversions · `learn/metric.html` · Lessons 3–6

### Step 1: Big units to small: multiply
- [ ] It starts with 2.5 kilometers: `see 2.5 kilometers = 2,500 meters; see 1 kilometer = 1,000 meters. The smaller unit takes more of them, so multiply: 2.5 × 1,000 = 2,500. Each digit moves 3 places left.`
- [ ] One kilometer: `click 1 kilometer; see 1 kilometer = 1,000 meters`
- [ ] Meters to centimeters: `click m and cm; see 1.75 meters = 175 centimeters; see Each digit moves 2 places left.; click 0.6 meters; see 0.6 meters = 60 centimeters`
- [ ] Liters and kilograms: `click L and mL; see 2.5 liters = 2,500 milliliters; click kg and g; see 3.2 kilograms = 3,200 grams`
- Quick check: A trail is 3.4 kilometers long. How many meters is that? Answer: 3400 meters. Mistakes it names: 340, 0.0034.

### Step 2: Small units to big: divide
- [ ] It starts with 1,500 meters: `see 1,500 meters = 1.5 kilometers; see The bigger unit takes fewer of them, so divide: 1,500 ÷ 1,000 = 1.5. Each digit moves 3 places right.`
- [ ] Less than 1: `click 250 meters; see 250 meters = 0.25 kilometers`
- [ ] Centimeters to meters: `click m and cm; see 125 centimeters = 1.25 meters; see Each digit moves 2 places right.`
- [ ] Milliliters and grams: `click L and mL; see 1,250 milliliters = 1.25 liters; click kg and g; see 2,500 grams = 2.5 kilograms`
- Quick check: Each canteen holds 750 milliliters. How many liters do 4 canteens hold? Answer: 3 liters. Mistakes it names: 3000, 0.75.

## Chapter 3: Yards, feet, and inches · `learn/customary.html` · Lesson 7

### Step 1: Change to a smaller unit
- [ ] It starts with 4 yards: `see 4 yards = 12 feet; see 1 yard = 3 feet, so 4 × 3 = 12.; pressed Yards to feet`
- [ ] Feet to inches: `click Feet to inches; see 4 feet = 48 inches; see 1 foot = 12 inches`
- [ ] Yards to inches, and + stops at 9: `click Yards to inches; click Amount: one more ×6; see 9 yards = 324 inches; see 9 × 36 = 324.`
- [ ] Edge: one yard, and − stops: `click Amount: one less ×4; see 1 yard = 3 feet, so 1 × 3 = 3.`
- Quick check: A tent pole is 5 feet 4 inches long. How many inches is that? Answer: 64 inches. Mistakes it names: 54, 9.

## Chapter 4: Unlike denominators · `learn/unlike.html` · Lessons 8–13

### Step 1: Find a common denominator
- [ ] It starts with 1/2 + 1/3: `see Both strips cut into 6ths: 1/2 = 3/6 and 1/3 = 2/6. Now the parts are the same size: 3/6 + 2/6 = 5/6.; count rect.fs.on = 5; pressed 1/2; pressed + 1/3`
- [ ] More than 1: `click 3/4; click + 3/8; see 3/4 = 6/8 and 3/8 = 3/8; see 6/8 + 3/8 = 9/8 = 1 1/8.`
- [ ] One denominator already works: `click 2/3; click + 1/6; see 4/6 + 1/6 = 5/6.`
- [ ] Twelfths: `click 2/3; click + 1/4; see 8/12 + 3/12 = 11/12.`
- [ ] It comes out whole: `click 3/4; click + 1/4; see 3/4 + 1/4 = 4/4 = 1.`
- Quick check: A trail mix recipe uses 1/2 cup of nuts and 1/3 cup of raisins. How many cups is that in all? Answer: 0.8333333333333334 cup. Mistakes it names: 0.4, 0.3333333333333333.

### Step 2: Subtract mixed numbers
- [ ] It starts with 3 1/4 − 1 1/2: `see In 4ths: 3 1/4 = 3 1/4 and 1 1/2 = 1 2/4. 1/4 is less than 2/4, so trade 1 whole for 4/4: 3 1/4 = 2 5/4. 2 − 1 = 1 and 5/4 − 2/4 = 3/4: 1 3/4.`
- [ ] Sixths: `click 4 1/3 − 2 5/6; see 4 1/3 = 4 2/6 and 2 5/6 = 2 5/6; see 3 − 2 = 1 and 8/6 − 5/6 = 3/6: 1 1/2.`
- [ ] A whole number: `click 5 − 2 3/8; see There’s no fraction to subtract from, so trade 1 whole for 8/8: 5 = 4 8/8. 4 − 2 = 2 and 8/8 − 3/8 = 5/8: 2 5/8.`
- Quick check: The trail is 4 1/3 miles. The hikers have gone 1 1/2 miles. How far is left? Answer: 2.8333333333333335 miles. Mistakes it names: 3.1666666666666665, 3.

## Chapter 5: Line plots · `learn/line-plots.html` · Lessons 14–15

### Step 1: Read a line plot of fractions
- [ ] It starts with the wettest and driest days: `see The wettest day had 7/8 inch and the driest 1/8 inch: 7/8 − 1/8 = 6/8 = 3/4 inch more.; count text.xm = 10`
- [ ] One column, marked: `click Rain on 3/8 days; see 3 days had 3/8 inch each: 3 × 3/8 = 9/8 = 1 1/8 inches in all.; count text.xm.hi = 3`
- [ ] More than a half: `click Days over 1/2 inch; see 1/2 inch is 4/8.; see 2 + 1 + 1 = 4 days.`
- [ ] All the rain: `click All the rain; see = 36/8 = 4 1/2 inches.`
- Quick check: Use the line plot. How much rain fell in all on the days with 5/8 inch? Answer: 1.25 inches. Mistakes it names: 0.625, 2.

## Chapter 6: The size of products · `learn/size.html` · Lessons 16–19

### Step 1: More, less, or the same?
- [ ] It starts with 3/4 × 12: `see 3/4 is less than 1, so 3/4 × 12 is less than 12: it’s 9.; count rect.tape = 2; pressed 3/4 × 12`
- [ ] Half: `click 1/2 × 12; see it’s 6.`
- [ ] Equal to 1: `click 4/4 × 12; see 4/4 is equal to 1, so 4/4 × 12 is equal to 12: it’s 12.`
- [ ] More than 1: `click 5/4 × 12; see 5/4 is more than 1, so 5/4 × 12 is more than 12: it’s 15.; click 3/2 × 12; see it’s 18.`
- Quick check: Without multiplying: is 7/8 × 20 more than, less than, or equal to 20? Answer: “Less than 20”. Mistakes it names: “Equal to 20”, “More than 20”.
