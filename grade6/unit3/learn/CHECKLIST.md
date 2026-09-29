# Checklist: Learn Unit Rates and Percentages (Grade 6 Unit 3)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–16. Not covered: Lesson 17 (Painting a Room), an optional open-ended project.

## Chapter 1: Converting units · `learn/converting.html` · Lessons 2–4

### Step 1: Bigger units, fewer of them
- [ ] It starts with 2 yards: 6 feet, drawn as 6 boxes: `see 1 yard is 3 feet, so 2 yards are 2 × 3 = 6 feet.; count rect.tape.b = 6`
- [ ] 5 feet are 60 inches: `click feet to inches; click How many: one more ×3; see 5 feet are 5 × 12 = 60 inches.`
- [ ] Edge: 1 yard says “is”: `click How many: one less ×3; see so 1 yard is 1 × 3 = 3 feet.`
- [ ] Edge: 10 is the most: `click How many: one more ×12; see 10 yards are 10 × 3 = 30 feet.`
- [ ] Edge: big numbers get commas: `click kilograms to grams; click How many: one more ×8; see 10 kilograms are 10 × 1,000 = 10,000 grams.`
- [ ] Edge: with too many small units to draw, each big unit is labeled instead: `click meters to centimeters; count rect.tape.b = 2`
- Quick check: A rope is 4 yards long. How many feet long is it? Answer: 12 feet. Mistakes it names: 1.33, 7, 48.

### Step 2: Which unit makes sense?
- [ ] A pencil makes sense in centimeters: `see 18 centimeters = 0.18 meters = 0.00018 kilometers; see Centimeters make sense`
- [ ] A trip between cities makes sense in kilometers: `click the trip between two cities; see 15,000,000 centimeters = 150,000 meters = 150 kilometers; see Kilometers make sense`
- [ ] A bicycle makes sense in kilograms: `click a bicycle; see 12,000 grams = 12 kilograms; see Kilograms make sense`
- [ ] Edge: 1 gram says “gram”: `click a paper clip; see 1 gram = 0.001 kilograms; see Grams make sense`
- [ ] A door makes sense in meters: `click a classroom door; see 210 centimeters = 2.1 meters = 0.0021 kilometers; see Meters make sense`
- Quick check: Which unit makes sense for the mass of a bicycle? Answer: “kilograms”. Mistakes it names: “grams”, “liters”.

## Chapter 2: Unit rates · `learn/unit-rates.html` · Lessons 1, 6–7

### Step 1: Two unit rates
- [ ] Flour and muffins: 4 muffins for each cup, and 0.25 cups for each muffin: `see 4 muffins for each cup of flour (12 ÷ 3); see 0.25 cups of flour for each muffin (3 ÷ 12)`
- [ ] Dollars and apples: 2.5 apples for each dollar, 0.4 dollars for each apple: `click 4 dollars : 10 apples; see 2.5 apples for each dollar; see 0.4 dollars for each apple`
- [ ] Minutes and windows: `click 5 minutes : 20 windows; see 4 windows washed for each minute; see 0.25 minutes for each window washed`
- Quick check: It takes 3 cups of flour to make 12 muffins. How many muffins can you make with 1 cup of flour? Answer: 4 muffins. Mistakes it names: 0.25, 36, 9.

### Step 2: Use the rate that fits
- [ ] 90 miles takes 3 gallons: `see 90 ÷ 30 = 3 gallons.`
- [ ] 150 miles takes 5 gallons, and 240 takes 8: `click 150 miles; see 150 ÷ 30 = 5 gallons.; click 240 miles; see 240 ÷ 30 = 8 gallons.`
- Quick check: A car goes 30 miles on each gallon of gas. How many gallons does it need for 150 miles? Answer: 5 gallons. Mistakes it names: 4500, 120, 0.2.

## Chapter 3: Speed and pace · `learn/speed-and-pace.html` · Lessons 5, 8–9

### Step 1: Speed and pace
- [ ] Mai: a pace of 8 minutes per mile, 7.5 miles per hour, and Elena is faster: `see Pace: 24 ÷ 3 = 8 minutes per mile.; see 7.5 miles per hour; see Elena is faster`
- [ ] Edge: Mai and Noah have the same pace: `see Mai has the same pace as Noah.`
- [ ] Elena is the fastest: `click Elena; see Pace: 30 ÷ 4 = 7.5 minutes per mile.; see Elena is the fastest: the smallest pace and the biggest speed.`
- [ ] Edge: 1 mile says “mile”: `click Noah; see Noah runs 1 mile in 8 minutes.`
- [ ] Kiran has the biggest pace and the smallest speed: `click Kiran; see 10 minutes per mile; see 6 miles per hour`
- Quick check: Mai runs at a pace of 8 minutes per mile. Kiran’s pace is 10 minutes per mile. Who is faster? Answer: “Mai”. Mistakes it names: “Kiran”, “They are the same speed”.

### Step 2: How long will it take?
- [ ] 3 kilometers takes 15 minutes: `see 3 kilometers × 5 minutes for each = 15 minutes.`
- [ ] Edge: more than an hour shows hours and minutes: `click 15 km; see = 75 minutes (1 hour 15 minutes).`
- [ ] Edge: exactly 2 hours: `click 24 km; see = 120 minutes (2 hours).`
- Quick check: A train goes 60 kilometers every 40 minutes. How many minutes does it take to go 150 kilometers? Answer: 100 minutes. Mistakes it names: 225, 6000, 130.

## Chapter 4: Percentages · `learn/percentages.html` · Lessons 10–12

### Step 1: Percent of a dollar
- [ ] It starts with 2 quarters and a dime: 60%: `see 60¢ is 60% of a dollar.; count circle.coin = 3`
- [ ] Edge: a whole dollar is 100%: `click Quarters: one more ×2; click Dimes: one less; see 100¢ is 100% of a dollar: a whole dollar.`
- [ ] Edge: more than a dollar is more than 100%: `click Quarters: one more ×2; click Dimes: one more ×4; see 150¢ is 150% of a dollar: more than a whole dollar.`
- [ ] Edge: no coins at all: `click Quarters: one less ×2; click Dimes: one less; see No coins yet.; see 0¢ is 0% of a dollar.`
- [ ] Pennies count 1% each: `click Pennies: one more ×3; see 63¢ is 63% of a dollar.`
- Quick check: 3 quarters and 1 dime are what percent of a dollar? Answer: 85 %. Mistakes it names: 4, 0.85, 35.

### Step 2: Percent of a whole
- [ ] 30% of 80 liters is 24 liters, on a tape of 10 boxes: `see 30% of 80 liters is 24 liters; count rect.tape.b = 10`
- [ ] 70% of 250 grams: `click 250 grams; click Tenths: one more ×4; see 70% of 250 grams is 175 grams`
- [ ] Edge: 0%: `click Tenths: one less ×4; see 0% of 80 liters is 0 liters`
- [ ] Edge: 100% is the whole: `click Tenths: one more ×8; see 100% of 80 liters is 80 liters`
- [ ] Edge: 1 tenth says “tenth”: `click Tenths: one less ×2; see 10% is 1 tenth of the whole.`
- Quick check: A tank holds 80 liters. How many liters is 25% of the tank? Answer: 20 liters. Mistakes it names: 55, 2000, 8.

### Step 3: Percents on a double number line
- [ ] 60% of 50 is 30: `see 60% of 50 is 30: 6 × 10% (5 each).`
- [ ] Edge: past 100%: `click Tens of percent: one more ×9; see 150% of 50 is 75; see More than 100% is more than the whole.`
- [ ] Edge: 100% is the whole: `click Tens of percent: one more ×4; see 100% is the whole.`
- [ ] A whole of 15 has tenths of 1.5: `click 100% is 15; see 60% of 15 is 9: 6 × 10% (1.5 each).`
- [ ] Edge: 0%: `click Tens of percent: one less ×7; see 0% of 50 is 0`
- Quick check: Priya has hiked 60% of a 15-kilometer trail. How many kilometers is that? Answer: 9 kilometers. Mistakes it names: 6, 900, 1.5.

## Chapter 5: Benchmark percents · `learn/benchmarks.html` · Lesson 13

### Step 1: 10%, 25%, 50%, and 75%
- [ ] It starts at 25% of $40: `see 25% is 1/4, so 25% of $40 is $40 ÷ 4 = $10.; pressed 25%`
- [ ] 75% is 3/4: `click 75%; see 75% of $40 is $40 ÷ 4 × 3 = $30.`
- [ ] Edge: an answer with cents: `click book $12; click 10%; see 10% of $12 is $12 ÷ 10 = $1.20.`
- [ ] 50% of $200: `click bike $200; click 50%; see 50% of $200 is $200 ÷ 2 = $100.`
- Quick check: A $40 jacket is 25% off. How many dollars is the discount? Answer: 10 dollars. Mistakes it names: 30, 15, 1.6.

### Step 2: Sale prices
- [ ] 25% off $40 leaves $30, 75% of the price: `see Sale price: $40 − $10 = $30, which is 75% of the price.`
- [ ] 25% off $80 is $60: `click pair of shoes $80; see $80 − $20 = $60`
- [ ] Edge: half off: `click 50%; see which is 50% of the price.`
- [ ] Edge: a sale price with cents: `click book $12; click 10%; see $12 − $1.20 = $10.80`
- Quick check: Shoes cost $80. They are 25% off. What is the sale price? Answer: 60 dollars. Mistakes it names: 20, 55, 100.

## Chapter 6: Part, whole, or percent · `learn/part-whole-percent.html` · Lessons 14–16

### Step 1: Find the whole
- [ ] It asks the question before showing the whole: `see 12 is 30% of what?; see The part fills 3 of the 10 boxes.`
- [ ] 12 is 30% of 40: `click Find the whole; see 30% is 3 tenths. 12 ÷ 3 = 4 in each tenth, so the whole is 10 × 4 = 40.`
- [ ] 9 is 90% of 10: `click 9 is 90%; click Find the whole; see so the whole is 10 × 1 = 10.`
- [ ] 35 is 70% of 50: `click 35 is 70%; click Find the whole; see the whole is 10 × 5 = 50.`
- [ ] Edge: hiding the whole, and switching parts, hides the answer: `click Find the whole; click Hide the whole; see of what?; click Find the whole; click 18 is 60%; see 18 is 60% of what?`
- Quick check: 12 is 30% of what number? Answer: 40. Mistakes it names: 3.6, 4, 42.

### Step 2: Find the percent
- [ ] 18 of 24 is 75%: `see 18 ÷ 24 = 0.75, so 18 is 75% of 24.`
- [ ] 9 of 36 is 25%, and 14 of 20 is 70%: `click 9 of 36; see 9 is 25% of 36.; click 14 of 20; see 14 is 70% of 20.`
- [ ] Edge: a part bigger than the whole is more than 100%: `click 30 of 25; see 30 is 120% of 25.; see The part is more than the whole, so it’s more than 100%.`
- Quick check: 18 of the 24 students in a class play an instrument. What percent of the class plays one? Answer: 75 %. Mistakes it names: 18, 133.33, 25.
