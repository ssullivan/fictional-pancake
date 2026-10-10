# Checklist: Learn Measuring Length, Time, Liquid Volume, and Weight (Grade 3 Unit 6)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–15. Not covered: Lesson 16 (Design a Carnival Game), optional. Lengths are to the nearest half or fourth of an inch.

## Chapter 1: Halves and fourths of an inch · `learn/halves-fourths.html` · Lessons 1–3

### Step 1: Halves of an inch
- [ ] It starts at 3 1/2 inches: `see The bar ends halfway from 3 to 4: 3 1/2 inches.; count .mbar = 1`
- [ ] A half inch more: `click Bar length: one more; see The bar ends at 4: 4 inches.`
- [ ] Edge: the shortest is a half inch: `click Bar length: one less ×9; see The bar ends halfway from 0 to 1: 1/2 inch.`
- [ ] Edge: the longest is 6 inches: `click Bar length: one more ×9; see The bar ends at 6: 6 inches.`
- Quick check: How long is the bar? Measure to the nearest half inch. Answer: 3.5 inches. Mistakes it names: 3, 3.25.

### Step 2: Fourths of an inch
- [ ] It starts at 2 1/4 inches: `see The bar ends 1 fourth of the way from 2 to 3: 2 1/4 inches.`
- [ ] Two fourths is the half mark: `click Bar length: one more; see The bar ends halfway from 2 to 3: 2 1/2 inches.; see 2 2/4 is the same as 2 1/2`
- [ ] Three fourths: `click Bar length: one more ×2; see 3 fourths of the way from 2 to 3: 2 3/4 inches.; nosee the same as`
- [ ] Edge: from a fourth of an inch to 6 inches: `click Bar length: one less ×10; see 1 fourth of the way from 0 to 1: 1/4 inch.; click Bar length: one more ×30; see at 6: 6 inches.`
- Quick check: How long is the bar? Measure to the nearest fourth of an inch. Answer: 2.75 inches. Mistakes it names: 2, 11.

## Chapter 2: Line plots · `learn/line-plots.html` · Lessons 4–5

### Step 1: Read a line plot
- [ ] It starts with nothing tapped: `see Each X is one pencil. Tap a length to count its Xs.; count .xm = 11`
- [ ] The tallest stack: `tap [data-v="18"]; see 4 pencils are 4 2/4 inches long.`
- [ ] Edge: one pencil: `tap [data-v="19"]; see 1 pencil is 4 3/4 inches long.`
- [ ] Edge: a length with no Xs: `tap [data-v="21"]; see No pencils are 5 1/4 inches long.`
- [ ] A whole number of inches: `tap [data-v="20"]; see 3 pencils are 5 inches long.; count .xm.hi = 3`
- Quick check: How many pencils are 5 inches long? Answer: 3 pencils. Mistakes it names: 11.

### Step 2: Make a line plot
- [ ] It starts empty: `see Press Next ribbon to put the first one on the plot.; count .xm = 0`
- [ ] The first ribbon: `click Next ribbon; see Ribbon 1 is 3 1/2 inches: an X above 3 1/2.; count .xm = 1`
- [ ] Every ribbon: `click Next ribbon ×8; see All 8 ribbons are on the plot. The most common length is 3 1/2 inches.; disabled Next ribbon; count .xm = 8`
- [ ] Start over: `click Next ribbon ×3; click Start over; count .xm = 0; enabled Next ribbon`
- Quick check: How many ribbons are longer than 3 1/2 inches? Answer: 4 ribbons. Mistakes it names: 7.

## Chapter 3: Grams and kilograms · `learn/weight.html` · Lesson 6

### Step 1: Read a scale
- [ ] It starts with 3 blocks: `see 3 blocks of 100 grams: the needle points to 300 grams.`
- [ ] Ten blocks are a kilogram: `click 100-gram blocks: one more ×7; see 10 blocks of 100 grams: the needle points to 1,000 grams.; see 1,000 grams is 1 kilogram.`
- [ ] Edge: no blocks: `click 100-gram blocks: one less ×5; see 0 blocks of 100 grams: the needle points to 0 grams.; nosee kilogram`
- [ ] Edge: it stops at 1,000 grams: `click 100-gram blocks: one more ×12; see the needle points to 1,000 grams.`
- Quick check: What does the scale show? Answer: 650 grams. Mistakes it names: 700, 600.

### Step 2: Grams or kilograms?
- [ ] It starts with a paper clip: `pressed A paper clip; see Would you weigh a paper clip in grams or kilograms?`
- [ ] Grams for light things: `click Grams; see Yes: a paper clip weighs about 1 gram.`
- [ ] A wrong unit says why: `click A bike; click Grams; see A bike weighs about 15 kilograms. That would be thousands of grams.`
- [ ] Kilograms for heavy things: `click A bag of flour; click Kilograms; see Yes: a bag of flour weighs about 2 kilograms.`
- [ ] Edge: kilograms for something light: `click An apple; click Kilograms; see An apple weighs about 200 grams. A kilogram is much more than that.`
- [ ] Another thing clears the pick: `click Grams; click An apple; see Would you weigh an apple in grams or kilograms?`
- Quick check: About how much does a bag of flour weigh? Answer: “2 kilograms”. Mistakes it names: “2 grams”, “200 kilograms”.

## Chapter 4: Liters · `learn/liquid-volume.html` · Lessons 7–8

### Step 1: Measure in liters
- [ ] It starts at 3 liters: `see The water comes up to the 3 mark: 3 liters.`
- [ ] Edge: full: `click Liters poured: one more ×6; see The water is at the top mark: 8 liters. The container is full.`
- [ ] Edge: empty: `click Liters poured: one less ×4; see The container is empty.`
- [ ] One liter: `click Liters poured: one less ×2; see The water comes up to the 1 mark: 1 liter.`
- Quick check: How many liters of water are in the container? Answer: 4 liters. Mistakes it names: 6, 2.

### Step 2: Estimate in liters
- [ ] It starts with a mug: `pressed A mug; see How much water does a mug hold?`
- [ ] The right guess: `click Less than 1 liter; see Yes: a mug holds less than 1 liter.`
- [ ] A wrong guess: `click More than 1 liter; see A mug holds less than 1 liter. A big water bottle holds about 1 liter.`
- [ ] A bucket: `click A bucket; click More than 1 liter; see Yes: a bucket holds more than 1 liter.`
- [ ] About 1 liter: `click A big water bottle; click About 1 liter; see Yes: a big water bottle holds about 1 liter.`
- Quick check: About how much water does a bathtub hold? Answer: “About 200 liters”. Mistakes it names: “About 2 liters”, “Less than 1 liter”.

## Chapter 5: Time to the minute · `learn/time.html` · Lesson 9

### Step 1: Set the clock
- [ ] It starts at 4:37: `see It’s 4:37.; see Count by 5s to 35, then by 1s: 36, 37.`
- [ ] Five minutes on: `click 5 minutes on; see It’s 4:42.`
- [ ] On a 5: `click Minutes: one less ×7; see It’s 4:30.; see The minute hand is at 30 minutes.`
- [ ] Edge: the minutes stop at 59: `click Minutes: one more ×30; see It’s 4:59.; disabled 5 minutes on`
- [ ] Edge: on the hour: `click Minutes: one less ×40; see It’s 4:00.; see The hour hand is on 4; disabled 5 minutes back`
- [ ] Edge: 12 o’clock’s next hour is 1: `click Hour: one more ×10; see It’s 12:37.; see between 12 and 1`
- Quick check: What time does the clock show? Answer: “7:38”. Mistakes it names: “7:35”, “8:38”.

### Step 2: Count the minutes
- [ ] It starts with nothing read: `pressed Clock 1; see What time is it? Read it one step at a time.`
- [ ] The hour first: `click Next step; see The hour hand is between 3 and 4: it’s after 3.`
- [ ] Then 5s and 1s: `click Next step ×3; see Count by 5s from the 12: 5, 10, 15, 20, 25.; see Then by 1s: 26, 27. It’s 3:27.; disabled Next step`
- [ ] Another clock: `click Clock 3; click Next step ×3; see It’s 11:52.`
- [ ] Start over: `click Next step; click Start over; see What time is it?; enabled Next step`
- Quick check: How many minutes after 2 o’clock does the clock show? Answer: 18 minutes. Mistakes it names: 15, 20.

## Chapter 6: Elapsed time · `learn/elapsed.html` · Lessons 10–11

### Step 1: How long?
- [ ] It starts with no jumps: `pressed 8:40 to 9:15; see How long is it from 8:40 to 9:15? Jump to the next hour first.; count .hop = 0`
- [ ] A jump to the hour: `click Next jump; see 8:40 to 9:00: 20 minutes.; count .hop = 1`
- [ ] Then the rest, added up: `click Next jump ×2; see 9:00 to 9:15: 15 minutes.; see 20 + 15 = 35 minutes.; disabled Next jump`
- [ ] Edge: no hour crossed takes one jump: `click 10:25 to 10:50; click Next jump; see 10:25 to 10:50: 25 minutes.; disabled Next jump; count .hop = 1`
- [ ] Across 2:00: `click 1:50 to 2:35; click Next jump ×2; see 10 + 35 = 45 minutes.`
- Quick check: Recess starts at 10:45 and ends at 11:10. How many minutes long is recess? Answer: 25 minutes. Mistakes it names: 65, 10.

### Step 2: When does it end?
- [ ] It starts with 25 minutes from 2:50: `pressed 25 minutes; see Start at 2:50 and jump 25 minutes. 10 minutes reach 3:00, and 15 more land on 3:15.`
- [ ] Forty minutes: `click 40 minutes; see 10 minutes reach 3:00, and 30 more land on 3:30.`
- [ ] Edge: just past the hour: `click 15 minutes; see 10 minutes reach 3:00, and 5 more land on 3:05.`
- Quick check: The bus leaves at 1:50. The ride takes 30 minutes. When does the bus arrive? Answer: “2:20”. Mistakes it names: “1:20”, “1:80”.

## Chapter 7: Measurement stories · `learn/measurement-stories.html` · Lessons 12–15

### Step 1: Two-step stories
- [ ] It starts with the story: `pressed Pitchers; see Mai fills 3 pitchers with 4 liters of water each; see It takes two steps. What do you find first?`
- [ ] The first step: `click Next step; see Step 1: 3 × 4 = 12 liters in the pitchers.`
- [ ] The second step: `click Next step ×2; see Step 2: 12 − 5 = 7.; see 7 liters are left.; disabled Next step`
- [ ] Another story: `click Beans; click Next step ×2; see 600 + 250 = 850.; see They weigh 850 grams.`
- [ ] Start over: `click Next step; click Start over; nosee Step 1; enabled Next step`
- Quick check: A jug holds 5 liters. Han fills 4 jugs, then uses 6 liters to water plants. How many liters are left? Answer: 14 liters. Mistakes it names: 20, 3.

### Step 2: What’s missing?
- [ ] It starts with the first story: `pressed Story 1; see A bucket holds 9 liters.; see What do you need to know to answer the question?`
- [ ] What it needs: `click How many liters the fish tank holds; see Yes: with that, you can answer it.`
- [ ] A wrong pick says why: `click How many fish there are; see The fish don’t change how much water the tank holds.`
- [ ] Another story clears the pick: `click How tall the bucket is; click Story 2; see The play started at 2:15.; see What do you need to know; click When the play ended; see Yes: with that, you can answer it.`
- Quick check: Han’s dog weighs 18 kilograms. How many kilograms heavier is the dog than Han’s cat? What do you need to know? Answer: “How much the cat weighs”. Mistakes it names: “How old the dog is”, “What color the cat is”.
