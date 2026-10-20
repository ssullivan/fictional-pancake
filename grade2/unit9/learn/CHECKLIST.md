# Checklist: Learn Putting It All Together (Grade 2 Unit 9)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

Not covered: Lesson 2 (Fluency Flip) is a card game best played with a partner; its fact families are in the first chapter. Writing your own story problems (Lessons 12–13) works better in class. Practice it all in Field Trip, the game for this unit.

## Chapter 1: Sums and differences within 20 · `learn/fluency.html` · Lessons 1–2

### Step 1: Make a ten or use a double
- [ ] It starts with 8 + 7 in the ten-frames: `see 8 + 7 = ?; pressed 8 + 7; count .ctr = 15`
- [ ] Making a ten moves 2 blue counters up: `click Make a ten; see 8 needs 2 more to make 10.; see 8 + 7 = 10 + 5 = 15; count .ctr.moved = 2`
- [ ] Using a double starts from 7 + 7: `click Use a double; see 7 + 7 = 14 is a double. 8 is 1 more than 7.; see 8 + 7 = 14 + 1 = 15; count .cube = 15`
- [ ] 6 + 7 needs 4 to make a ten: `click 6 + 7; click Make a ten; see 6 needs 4 more to make 10.; see 6 + 7 = 10 + 3 = 13`
- [ ] Edge: 9 + 5 is 4 past a double: `click 9 + 5; click Use a double; see 5 + 5 = 10 is a double. 9 is 4 more than 5.; see 9 + 5 = 10 + 4 = 14`
- [ ] Edge: another fact starts with no way picked: `click Make a ten; click 6 + 7; see 6 + 7 = ?`
- Quick check: What is 9 + 6? Answer: 15. Mistakes it names: 3, 14, 16.

### Step 2: Think addition to subtract
- [ ] It starts at 6 with nothing counted on: `see 6 + 0 = 6; see Count on from 6 until you get to 14.`
- [ ] Counting on 8 finds 14 − 6: `click Count on: one more ×8; see 6 + 8 = 14, so 14 − 6 = 8.; count .ctr.b = 8`
- [ ] 13 − 8 counts on 5: `click 13 − 8; click Count on: one more ×5; see 8 + 5 = 13, so 13 − 8 = 5.`
- [ ] Edge: counting past the total says so: `click Count on: one more ×9; see 6 + 9 = 15; see That’s more than 14. Take some back.`
- [ ] Edge: the stepper stops at 11: `click Count on: one more ×14; see 6 + 11 = 17`
- [ ] Edge: another fact starts over at 0: `click Count on: one more ×3; click 16 − 9; see 9 + 0 = 9`
- Quick check: What is 15 − 8? Think: 8 + ? = 15. Answer: 7. Mistakes it names: 23, 8, 6.

### Step 3: Flip a fact
- [ ] It starts on side 1 of 7 + 9: `see Side 1 of 4: 7 + 9 = 16; see Every fact uses 7, 9, and 16.; count .cube.off = 0`
- [ ] Flipping shows the turnaround fact: `click Flip the card; see Side 2 of 4: 9 + 7 = 16`
- [ ] Side 3 takes away the blue cubes: `click Flip the card ×2; see 16 − 9 = 7; see take away the blue ones; count .cube.off = 9`
- [ ] Side 4 takes away the yellow cubes: `click Flip the card ×3; see 16 − 7 = 9; count .cube.off = 7`
- [ ] Edge: after side 4 it comes back to side 1: `click Flip the card ×4; see Side 1 of 4`
- [ ] Another card starts on its side 1: `click Flip the card ×2; click 8 + 6; see Side 1 of 4: 8 + 6 = 14; see Every fact uses 8, 6, and 14.`
- Quick check: You know 7 + 8 = 15. Which subtraction fact do you know too? Answer: “15 − 8 = 7”. Mistakes it names: “15 − 7 = 9”, “8 − 7 = 1”.

## Chapter 2: Measure on a map · `learn/map.html` · Lessons 3–4

### Step 1: Add the parts of a path
- [ ] It starts with Home to School and its 3 parts: `see The path from Home to School has 3 parts.; count .route = 1; count .leg = 3`
- [ ] Adding the parts: `click Add the parts; see 6 + 5 + 4 = 15. The path is 15 cm long.`
- [ ] Hiding the total: `click Add the parts; click Hide the total; nosee cm long`
- [ ] A path that goes up still adds: `click Zoo to Pool; click Add the parts; see 8 + 5 + 7 = 20. The path is 20 cm long.`
- [ ] Edge: another trip hides the total: `click Add the parts; click Park to Library; see The path from Park to Library has 3 parts.; nosee cm long`
- Quick check: How long is the path from the Library to the Pool? Answer: 18 cm. Mistakes it names: 15, 9, 12.

### Step 2: Which way is shorter?
- [ ] It starts with both paths drawn: `see Tap a path to measure it.; count .route = 2`
- [ ] Measuring the gold path: `click The gold path; see The gold path: 7 + 6 = 13 cm; pressed The gold path`
- [ ] Measuring the blue path: `click The blue path; see The blue path: 8 + 7 + 2 = 17 cm`
- [ ] Comparing them: `click Compare; see 17 − 13 = 4. The gold path is 4 cm shorter.`
- [ ] Edge: picking a path after comparing measures it again: `click Compare; click The blue path; nosee shorter; see 17 cm`
- Quick check: How much shorter is the gold path than the blue path? Answer: 4 cm. Mistakes it names: 32, 18, 14.

### Step 3: Measure and plot
- [ ] It asks for the first path: `see Next path: 14 cm. Tap 14 on the line plot.; count .xm = 0`
- [ ] Tapping the right length adds an X: `tap [data-v="14"]; see Next path: 16 cm; count .xm = 1`
- [ ] Edge: a wrong tap says so and adds nothing: `tap [data-v="13"]; see That’s 13.; see This path is 14 cm.; count .xm = 0`
- [ ] All 8 paths make the plot: `tap [data-v="14"]; tap [data-v="16"]; tap [data-v="13"]; tap [data-v="14"]; tap [data-v="15"]; tap [data-v="14"]; tap [data-v="16"]; tap [data-v="12"]; see You made a line plot! 8 paths, 8 Xs.; count .xm = 8`
- [ ] Start over clears the plot: `tap [data-v="14"]; click Start over; count .xm = 0; see Next path: 14 cm.`
- Quick check: How many paths are 14 cm long? Answer: 4 paths. Mistakes it names: 14, 10, 2.

## Chapter 3: Numbers to 1,000 · `learn/numbers.html` · Lessons 5–6

### Step 1: Build a number many ways
- [ ] It starts with no blocks: `see 0 + 0 + 0 = 0; see You need 352 more to make 352.; pressed Make 352`
- [ ] 3 hundreds, 5 tens, 2 ones make 352: `click Hundreds: one more ×3; click Tens: one more ×5; click Ones: one more ×2; see 300 + 50 + 2 = 352; see You made 352!; see trade a hundred for 10 tens`
- [ ] 2 hundreds, 15 tens, 2 ones make it too: `click Hundreds: one more ×2; click Tens: one more ×15; click Ones: one more ×2; see 200 + 150 + 2 = 352; see That’s another way to make it.; count .flat = 2; count .rod = 15`
- [ ] Edge: too many says how many: `click Hundreds: one more ×4; see That’s 48 too many.`
- [ ] Edge: tens stop at 20: `click Tens: one more ×25; see 0 + 200 + 0 = 200`
- [ ] Edge: another number starts over: `click Hundreds: one more ×2; click Make 407; see 0 + 0 + 0 = 0; see You need 407 more to make 407.`
- Quick check: Which one also makes 465? Answer: “3 hundreds, 16 tens, 5 ones”. Mistakes it names: “4 hundreds, 16 tens, 5 ones”, “3 hundreds, 6 tens, 15 ones”.

### Step 2: Expressions for a number
- [ ] It starts with 500 and no expression picked: `see Does it land on 500?; pressed 500`
- [ ] 250 + 250 lands on 500: `click 250 + 250; see 250 + 250 = 500; see It lands on 500.`
- [ ] 600 − 100 lands on 500 too: `click 600 − 100; see 600 − 100 = 500`
- [ ] Edge: 510 + 10 misses: `click 510 + 10; see 510 + 10 = 520; see It lands on 520, not 500.`
- [ ] 340’s expressions: `click 340; click 200 + 140; see 200 + 140 = 340; click 400 − 40; see It lands on 360, not 340.`
- [ ] Edge: another number clears the expression: `click 250 + 250; click 340; see Does it land on 340?`
- Quick check: Which expression equals 600? Answer: “550 + 50”. Mistakes it names: “500 + 10”, “700 − 10”.

## Chapter 4: Add and subtract within 1,000 · `learn/add-subtract.html` · Lessons 7–8

### Step 1: Pick a way to add
- [ ] It starts at 245: `see 398 + 245 = ?; see Start at 245.`
- [ ] The first jump adds 400: `click Next jump; see You’re at 645.`
- [ ] Then it takes away 2: `click Next jump ×2; see 398 is 2 less than 400.; see 398 + 245 = 643`
- [ ] 256 + 137 by place: `click 256 + 137; click Next jump ×3; see 256 + 137 = 393`
- [ ] 47 + 38 jumps to 50 first: `click 47 + 38; click Next jump ×3; see 47 + 38 = 85`
- [ ] Start over: `click Next jump ×2; click Start over; see 398 + 245 = ?`
- Quick check: What is 299 + 436? 299 is 1 less than 300. Answer: 735. Mistakes it names: 736, 635.

### Step 2: Pick a way to subtract
- [ ] It starts at 496 to count on: `see 503 − 496 = ?; see Start at 496.`
- [ ] Counting on 4 and 3: `click Next jump ×2; see 4 + 3 = 7, so 503 − 496 = 7.`
- [ ] 645 − 218 by place: `click 645 − 218; click Next jump ×4; see 645 − 218 = 427`
- [ ] 82 − 47 takes away 40 first: `click 82 − 47; click Next jump; see You’re at 42.`
- [ ] 82 − 47 all the way: `click 82 − 47; click Next jump ×3; see 82 − 47 = 35`
- [ ] Edge: another problem starts over: `click Next jump; click 645 − 218; see Start at 645.`
- Quick check: What is 602 − 597? Answer: 5. Mistakes it names: 1199, 3, 2.

## Chapter 5: Story problems · `learn/stories.html` · Lessons 9–13

### Step 1: Sort the stories
- [ ] It starts with Story 1 and no kind picked: `see Mai had 25 shells. Mai found 13 more shells.; see Tap one.`
- [ ] Story 1 is add to: `click Add to; see Yes! Mai gets more shells, so it’s add to.`
- [ ] Edge: a wrong kind says so: `click Compare; see Not compare.`
- [ ] Story 2 is take from: `click Story 2; click Take from; see Lin gives some away, so it’s take from.`
- [ ] Story 3 is put together: `click Story 3; click Put together; see so it’s put together.`
- [ ] Story 4 is compare: `click Story 4; click Compare; see so it’s compare.`
- [ ] Edge: another story clears the kind: `click Add to; click Story 2; see Tap one.`
- Quick check: What kind of story is this? Elena has 40 beads. Elena uses 16 beads to make a bracelet. Answer: “Take from”. Mistakes it names: “Add to”, “Compare”.

### Step 2: What’s the question?
- [ ] It asks for a question: `see A story needs a question.; count .tape.gap = 0`
- [ ] In all puts them together: `click How many apples are in the basket?; see 45 + 28 = 73 apples.`
- [ ] How many more compares them: `click How many more red apples are there than green apples?; see 45 − 28 = 17 more red apples.; count .tape.gap = 1`
- [ ] Edge: a question the story can’t answer: `click How many apples are on the tree?; see can’t answer that.`
- Quick check: Jada has 52 stickers. Han has 38 stickers. Which question asks you to subtract? Answer: “How many more stickers does Jada have than Han?”. Mistakes it names: “How many stickers do they have in all?”, “How many stickers does Jada want?”.

### Step 3: Tape diagrams
- [ ] It starts with the berries and a ?: `see Kiran picked 64 berries.; see Where is the ? in the tape?`
- [ ] Showing the answer: `click Show the answer; see 36 berries were blue.`
- [ ] Hiding it again: `click Show the answer; click Hide the answer; nosee 36 berries`
- [ ] The ropes compare: `click Ropes; click Show the answer; see It’s 34 cm long.`
- [ ] The start is unknown on the bus: `click Bus; click Show the answer; see 28 kids were on the bus at first.`
- [ ] Edge: another story hides the answer: `click Show the answer; click Ropes; see Where is the ? in the tape?`
- Quick check: Tyler has 73 marbles. 45 are blue and the rest are green. How many are green? Answer: 28 marbles. Mistakes it names: 118, 45, 32.
