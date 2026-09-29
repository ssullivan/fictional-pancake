# Checklist: Learn Adding, Subtracting & Data (Grade 2 Unit 1)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

Not covered: Center Days (Lessons 6, 12, and 17) and Class Surveys (Lesson 18) are hands-on, optional lessons that work better in class. There’s no practice game for this unit yet.

## Chapter 1: Add and subtract within 20 · `learn/within-20.html` · Lessons 1–3

### Step 1: Put together to add
- [ ] 6 yellow and 5 blue fill the first frame and 1 more: `see 6 + 5 = 11; see The first frame is full: 10 and 1 more make 11.; count .ctr.a = 6; count .ctr.b = 5`
- [ ] Exactly 10 fills a whole frame: `click Blue: one less; see 6 + 4 = 10; see That fills a whole frame: 10!`
- [ ] Edge: 10 + 10 fills both frames: `click Yellow: one more ×6; click Blue: one more ×6; see 10 + 10 = 20; see 10 and 10 more make 20.`
- [ ] Edge: 0 + 0 shows no counters: `click Yellow: one less ×7; click Blue: one less ×6; see 0 + 0 = 0; count .ctr = 0`
- Quick check: How many counters are there in all? Answer: 12. Mistakes it names: 8, 4.

### Step 2: Take away to subtract
- [ ] It starts with all 14 counters: `see 14 − 0 = 14; see Tap a counter to take it away.`
- [ ] Tapping 3 counters takes 3 away: `tap [data-i="13"]; tap [data-i="12"]; tap [data-i="11"]; see 14 − 3 = 11; count .ctr.gone = 3`
- [ ] Edge: tapping a counter again puts it back: `tap [data-i="5"]; tap [data-i="5"]; see 14 − 0 = 14`
- [ ] Start over puts them all back: `tap [data-i="0"]; tap [data-i="1"]; click Start over; see 14 − 0 = 14; count .ctr.gone = 0`
- Quick check: Mai has 15 stickers. Mai gives 6 stickers to Diego. How many stickers does Mai have now? Answer: 9 stickers. Mistakes it names: 21, 6.

### Step 3: One picture, four facts
- [ ] It starts by putting the cubes together: `see Put the yellow and blue cubes together: 8 + 5 = 13.; pressed 8 + 5 = 13`
- [ ] Subtracting the blue cubes fades them: `click 13 − 5 = 8; see Start with all 13 and take away the blue ones: 13 − 5 = 8.; count .cube.off = 5`
- [ ] Subtracting the yellow cubes: `click 13 − 8 = 5; see take away the yellow ones; count .cube.off = 8`
- [ ] New cubes shows the next fact family: `click New cubes; see 6 + 9 = 15; pressed 6 + 9 = 15`
- [ ] Edge: after the last family it comes back to the first: `click New cubes ×3; see 8 + 5 = 13`
- Quick check: Which fact goes with 9 + 6 = 15? Answer: “15 − 6 = 9”. Mistakes it names: “9 − 6 = 3”, “15 + 6 = 21”, “6 + 3 = 9”.

### Step 4: Find the missing number
- [ ] It starts at 8 with none added: `see 8 + 0 = 8; see Tap empty squares to add more. You need 13 in all.`
- [ ] Adding 5 blue counters finds the missing number: `tap [data-i="19"] ×5; see 8 + 5 = 13. The missing number is 5.; count .ctr.b = 5`
- [ ] Edge: adding too many says so: `tap [data-i="19"] ×7; see 8 + 7 = 15; see That’s more than 13. Tap a blue counter to take it back.`
- [ ] Edge: tapping a blue counter takes one back: `tap [data-i="19"] ×2; tap [data-i="8"]; see 8 + 1 = 9`
- [ ] Edge: tapping a yellow counter changes nothing: `tap [data-i="0"]; see 8 + 0 = 8`
- [ ] Start over: `tap [data-i="19"] ×3; click Start over; see 8 + 0 = 8`
- Quick check: What number makes this true? 7 + ? = 16 Answer: 9. Mistakes it names: 23, 16.

## Chapter 2: Add your way · `learn/add-your-way.html` · Lessons 4–5

### Step 1: Make a ten
- [ ] 9 + 5: the first frame needs 1 more: `see The first frame needs 1 more to make a ten.`
- [ ] Moving 1 makes a ten: 10 + 4: `click Move 1 to make a ten; see 9 + 5 = 10 + 4 = 14; see 1 blue moved over to fill the first frame. 4 are left.; count .ctr.moved = 1`
- [ ] 7 + 5 moves 3: `click 7 + 5; click Move 3 to make a ten; see 7 + 5 = 10 + 2 = 12`
- [ ] Moving them back: `click Move 1 to make a ten; click Move them back; see The first frame needs 1 more`
- [ ] Edge: another sum starts unmoved: `click Move 1 to make a ten; click 8 + 7; see The first frame needs 2 more to make a ten.`
- Quick check: Which is the same as 8 + 6? Answer: “10 + 4”. Mistakes it names: “10 + 6”, “8 + 10”, “10 + 2”.

### Step 2: Doubles and one more
- [ ] A double: 6 + 6: `see 6 + 6 = 12; see A double: two rows the same length.; count .cube = 12`
- [ ] One more: 6 + 7: `click One more; see 6 + 7 = 13; see 6 + 6 = 12, and 1 more makes 13.; count .cube = 13`
- [ ] Edge: 9 is the most: `click Cubes: one more ×5; see 9 + 9 = 18`
- [ ] Edge: 1 is the least: `click Cubes: one less ×7; click One more; see 1 + 2 = 3`
- Quick check: You know 6 + 6 = 12. What is 6 + 7? Answer: 13. Mistakes it names: 12, 14.

### Step 3: Tens and ones
- [ ] 24 + 13: tens with tens and ones with ones: `click Put tens with tens and ones with ones; see Tens: 20 + 10 = 30. Ones: 4 + 3 = 7.; see 24 + 13 = 37`
- [ ] Edge: 13 ones make a new ten: `click 26 + 17; click Put tens with tens and ones with ones; see 13 ones is 1 ten and 3 ones, so make a new ten.; see 26 + 17 = 43`
- [ ] Split them again: `click Put tens with tens and ones with ones; click Split them again; nosee Tens:`
- Quick check: Lin has 23 marbles. Noah gives Lin 14 more marbles. How many marbles does Lin have now? Answer: 37 marbles. Mistakes it names: 9, 27, 33.

## Chapter 3: Picture graphs · `learn/picture-graphs.html` · Lessons 7–8

### Step 1: Sort the votes
- [ ] It starts with nothing sorted: `see Sorted: 0 of 12`
- [ ] Tapping a vote sorts it: `tap [data-i="0"]; see Sorted: 1 of 12`
- [ ] Sorting all 12 counts each color: `click Sort one ×12; see All 12 votes sorted! Red 3, Blue 5, Green 2, Yellow 2.`
- [ ] Edge: Sort one after all are sorted changes nothing: `click Sort one ×14; see All 12 votes sorted!`
- [ ] Start over: `click Sort one ×3; click Start over; see Sorted: 0 of 12`
- Quick check: How many students chose yellow? Answer: 5 students. Mistakes it names: 18, 6, 4.

### Step 2: Read a picture graph
- [ ] It asks to tap a kind of weather: `see Tap a kind of weather to count its row.`
- [ ] Sunny is the longest row: `click Sunny; see There were 9 sunny days. That’s the longest row: the most days.`
- [ ] Rainy is the shortest row: `click Rainy; see There were 5 rainy days. That’s the shortest row: the fewest days.`
- [ ] Cloudy is neither: `click Cloudy; see There were 7 cloudy days.; nosee longest`
- Quick check: Which kind of day happened the fewest times? Answer: “Rainy”. Mistakes it names: “Sunny”, “Cloudy”.

### Step 3: How many in all?
- [ ] It starts with nothing added: `see Add each row to find how many days in all.`
- [ ] Adding two rows, and a row can’t be added twice: `click Add sunny; click Add cloudy; see 9 + 7 = 16; disabled Add sunny`
- [ ] All three rows make 21 days: `click Add sunny; click Add cloudy; click Add rainy; see 9 + 7 + 5 = 21; see There were 21 school days in all.`
- [ ] Edge: rows add in the order you tap them: `click Add rainy; click Add sunny; see 5 + 9 = 14`
- [ ] Start over: `click Add sunny; click Start over; see Add each row; enabled Add sunny`
- Quick check: How many pets are in this graph in all? Answer: 13 pets. Mistakes it names: 6, 10, 3.

## Chapter 4: Bar graphs · `learn/bar-graphs.html` · Lessons 9–11

### Step 1: Build a bar graph
- [ ] It starts with no bars: `see Bars that match the table: 0 of 4; count rect.bar = 0`
- [ ] Setting the apples bar to 6 matches the table: `tap [data-r="0"][data-v="6"]; see Bars that match the table: 1 of 4; count rect.bar = 1`
- [ ] All four bars match: `tap [data-r="0"][data-v="6"]; tap [data-r="1"][data-v="3"]; tap [data-r="2"][data-v="8"]; tap [data-r="3"][data-v="5"]; see Your bar graph matches the table!`
- [ ] Edge: tapping the top of a bar again lowers it by 1: `tap [data-r="0"][data-v="6"]; tap [data-r="0"][data-v="6"]; see 0 of 4`
- [ ] Edge: tapping the bottom square twice empties the bar: `tap [data-r="1"][data-v="1"]; tap [data-r="1"][data-v="1"]; count rect.bar = 0`
- Quick check: Which snack did the most students choose? Answer: “Yogurt”. Mistakes it names: “Apples”, “Crackers”, “Carrots”.

### Step 2: Read a bar graph
- [ ] It asks to tap a snack: `see Tap a snack to read its bar.`
- [ ] Yogurt reads 8, crackers 3: `click Yogurt; see 8 students chose yogurt.; click Crackers; see 3 students chose crackers.`
- Quick check: How many books did Diego read? Answer: 7 books. Mistakes it names: 4, 5, 16.

### Step 3: Two graphs, same data
- [ ] The picture graph and the bar graph show the same pets: `see Both graphs show 7 dogs, 5 cats, and 3 fish.; see Here you count the pictures.`
- [ ] The bar graph: `click Bar graph; see Here you read where each bar stops.; count rect.bar = 3`
- Quick check: Which bar graph shows the same data as this picture graph? Answer: “(picture)”. Mistakes it names: “(picture)”, “(picture)”.

### Step 4: Ask the graph a question
- [ ] How many chose yogurt: `click How many students chose yogurt?; see 8 students. Read the top of the yogurt bar.`
- [ ] The fewest: `click Which snack did the fewest students choose?; see Crackers: the shortest bar, 3 students.`
- [ ] Two bars added: `click How many students chose apples or carrots?; see 6 + 5 = 11 students.`
- [ ] Edge: a question the graph can’t answer: `click Which snack tastes the best?; see The graph can’t answer that.`
- Quick check: Which question can this graph answer? Answer: “How many students chose apples?”. Mistakes it names: “What time is snack?”, “How many apples are at the store?”.

## Chapter 5: Compare · `learn/compare.html` · Lessons 13–16

### Step 1: How many more?
- [ ] It asks how many more before showing: `see How many more dogs than cats?`
- [ ] Showing the difference: 4 more dogs: `click Show how many more; see 9 − 5 = 4, or 5 + 4 = 9.; see There are 4 more dogs than cats.`
- [ ] Edge: 1 more says “is 1 more cat”: `click Cats: one more ×5; click Show how many more; see There is 1 more cat than dogs.`
- [ ] Edge: the same number: `click Cats: one more ×4; see 9 dogs and 9 cats: the same number, so neither has more.`
- Quick check: How many more students chose apples than crackers? Answer: 3 students. Mistakes it names: 9, 6.

### Step 2: Tape diagrams
- [ ] Priya has 5 more: `see 12 − 7 = 5; see Priya has 5 more stickers than Kiran.`
- [ ] Edge: the same number: `click Kiran: one more ×5; see Priya and Kiran each have 12 stickers.`
- [ ] Kiran has more: `click Kiran: one more ×13; see 20 − 12 = 8; see Kiran has 8 more stickers than Priya.`
- [ ] Edge: 1 more says “sticker”: `click Kiran: one more ×4; see Priya has 1 more sticker than Kiran.`
- Quick check: Noah has 6 fewer stickers than Elena. Elena has 15 stickers. How many stickers does Noah have? Answer: 9 stickers. Mistakes it names: 21, 6.

### Step 3: Three kinds of compare problems
- [ ] How many more: `see Jada has 34 books. Han has 22 books.; click Show the answer; see 34 − 22 = 12`
- [ ] The bigger one unknown: `click Bigger one unknown; click Show the answer; see Jada has more, so add: 22 + 12 = 34 books.`
- [ ] The smaller one unknown: `click Smaller one unknown; click Show the answer; see Han has fewer, so subtract: 34 − 12`
- [ ] Edge: another kind hides the answer: `click Show the answer; click Bigger one unknown; see Where is the ? in the tapes?`
- Quick check: Andre read 25 pages. Han read 13 more pages than Andre. How many pages did Han read? Answer: 38 pages. Mistakes it names: 12.
