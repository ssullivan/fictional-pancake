# Checklist: Learn Adding & Subtracting within 100 (Grade 2 Unit 2)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

Not covered: Center Days (Lessons 4, 10, and 15) and Our Market’s Inventory (Lesson 16) are hands-on, optional lessons that work better in class. There’s no practice game for this unit yet.

## Chapter 1: Add and subtract to compare · `learn/compare.html` · Lessons 1–3

### Step 1: How many more?
- [ ] It asks how many more before taking away: `see Jada has 47 beads. Han has 25. How many more beads does Jada have?`
- [ ] Taking away Han’s 25 leaves 22: `click Take away Han’s 25; see Tens: 4 − 2 = 2 tens. Ones: 7 − 5 = 2.; see 47 − 25 = 22. Jada has 22 more beads than Han.`
- [ ] 56 and 34: `click Jada 56, Han 34; click Take away Han’s 34; see 56 − 34 = 22`
- [ ] Start over: `click Take away Han’s 25; click Start over; see How many more beads does Jada have?`
- [ ] Edge: other numbers start again: `click Take away Han’s 25; click Jada 38, Han 16; see Jada has 38 beads. Han has 16.`
- Quick check: Lin has 68 stickers. Noah has 35 stickers. How many more stickers does Lin have than Noah? Answer: 33 stickers. Mistakes it names: 103, 68, 35.

### Step 2: Find the missing number
- [ ] 2 tens and 4 ones get from 34 to 58: `click + 1 ten ×2; click + 1 one ×4; see 34 + 24 = 58. You added 2 tens and 4 ones: the missing number is 24.`
- [ ] Edge: too many says so: `click + 1 ten ×3; see 34 + 30 = 64; see That’s more than 58. Start over and add fewer.`
- [ ] Start over: `click + 1 ten ×2; click Start over; see 34 + 0 = 34`
- [ ] 27 + ? = 49: `click 27 + ? = 49; click + 1 ten ×2; click + 1 one ×2; see the missing number is 22.`
- Quick check: What number makes this true? 26 + ? = 49 Answer: 23. Mistakes it names: 75, 49.

### Step 3: Add or subtract?
- [ ] Get more: add: `see Diego has 35 cards.; click Show the equation; see 35 + 21 = ?; see Diego gets more, so add: 35 + 21 = 56 cards.`
- [ ] Take away: subtract: `click Take away; click Show the equation; see 58 − 25 = ?; see Priya uses some up, so subtract`
- [ ] How many were added: `click How many were added?; click Show the equation; see 24 + ? = 45, or 45 − 24 = ?`
- [ ] Edge: another story hides the equation: `click Show the equation; click Take away; see Where is the ? in the tape?`
- Quick check: Elena has 62 blocks. Elena puts 30 blocks away. How many blocks are still out? Answer: “62 − 30 = ?”. Mistakes it names: “62 + 30 = ?”, “? − 62 = 30”.

## Chapter 2: Subtract your way · `learn/subtract-your-way.html` · Lessons 5–6

### Step 1: Take away tens, then ones
- [ ] Taking away 2 tens and 3 ones: 58 − 23 = 35: `click Take away 1 ten ×2; click Take away 1 one ×3; see You took away 2 tens and 3 ones. 58 − 23 = 35.`
- [ ] Partway it counts what’s taken: `click Take away 1 ten; see Taken away: 10 of 23; see 48 blocks are left.`
- [ ] Edge: too many tens says so: `click Take away 1 ten ×3; see That’s more than 23.`
- [ ] Edge: the ones run out: `click Take away 1 one ×8; disabled Take away 1 one`
- [ ] 76 − 41: `click 76 − 41; click Take away 1 ten ×4; click Take away 1 one; see 76 − 41 = 35.`
- [ ] Start over: `click Take away 1 ten ×2; click Start over; see Taken away: 0 of 23`
- Quick check: Han has 67 marbles. Han gives 34 marbles to Lin. How many marbles does Han have now? Answer: 33 marbles. Mistakes it names: 101, 34, 37, 63.

### Step 2: Not enough ones
- [ ] It starts with the problem: not enough ones: `see There are only 3 ones in 63, but 18 has 8 ones.`
- [ ] Getting to a ten first, in three jumps: `click Next jump ×3; see Take away 3 to get to 60.; see Every way gets 63 − 18 = 45.`
- [ ] Adding up from 18: `click Add up from 18; see Start at 18 and count up to 63.; click Next jump ×3; see 2 + 40 + 3 = 45.`
- [ ] Tens first: `click Tens first; click Next jump ×3; see Take away the ten: 53.`
- [ ] Edge: after the last jump, Start over: `click Next jump ×3; click Start over; see There are only 3 ones in 63`
- Quick check: Which way works for 52 − 7? Answer: “52 − 2 = 50, then 50 − 5 = 45”. Mistakes it names: “7 − 2 = 5, so the answer is 55”, “52 − 2 = 50, then 50 − 7 = 43”.

## Chapter 3: Break a ten · `learn/break-a-ten.html` · Lessons 7–8

### Step 1: Trade a ten for 10 ones
- [ ] It starts with what to take away, “1 ten”: `see Take away 1 ten and 7 ones.; see 42 has only 2 ones. Will you need to break a ten?`
- [ ] Edge: running out of ones says to break a ten: `click Take away 1 one ×2; see Only 2 ones!; see Break a ten into 10 ones.`
- [ ] Breaking a ten, then taking away: 42 − 17 = 25: `click Break a ten; click Take away 1 ten; click Take away 1 one ×7; see You took away 17. 42 − 17 = 25.`
- [ ] Breaking a ten makes 12 ones, and it can only break once: `click Break a ten; see 42 is now 3 tens and 12 ones.; disabled Break a ten`
- [ ] Start over: `click Break a ten; click Start over; enabled Break a ten`
- Quick check: Priya has 54 beads. Priya uses 28 beads on a bracelet. How many beads are left? Answer: 26 beads. Mistakes it names: 34, 82, 36.

### Step 2: Different ways to show a number
- [ ] 45 is 4 tens and 5 ones: `see 4 tens and 5 ones: 40 + 5 = 45`
- [ ] Breaking a ten: 3 tens and 15 ones, still 45: `click Break a ten; see 3 tens and 15 ones: 30 + 15 = 45; see Still 45!`
- [ ] Edge: it breaks at most two tens: `click Break a ten ×2; see 2 tens and 25 ones: 20 + 25 = 45; disabled Break a ten`
- [ ] Putting 10 ones back: `click Break a ten; click Put 10 ones back; see 4 tens and 5 ones; disabled Put 10 ones back`
- [ ] Edge: 1 ten says “ten”: `click 31; click Break a ten ×2; see 1 ten and 21 ones: 10 + 21 = 31`
- Quick check: Which one shows 52? Answer: “(picture)”. Mistakes it names: “(picture)”, “(picture)”.

## Chapter 4: Add and subtract within 100 · `learn/within-100.html` · Lesson 9

### Step 1: Make a new ten
- [ ] 45 + 38 makes a new ten: `click Put tens with tens and ones with ones; see 13 ones is 1 ten and 3 ones, so make a new ten.; see 45 + 38 = 83`
- [ ] 34 + 25 needs no new ten: `click 34 + 25; click Put tens with tens and ones with ones; see 34 + 25 = 59; nosee new ten`
- Quick check: Mai has 45 stickers. Mai gets 38 more stickers. How many stickers does Mai have now? Answer: 83 stickers. Mistakes it names: 73, 7, 713.

### Step 2: New ten or break a ten?
- [ ] 36 + 27 makes a new ten: `see Will the ones make a new ten?; click Put them together; see a new ten and 3 ones.; see 36 + 27 = 63`
- [ ] 36 + 23 makes no new ten: `click 36 + 23; click Put them together; see No new ten this time.; see 36 + 23 = 59`
- [ ] 64 − 28 breaks a ten: `click 64 − 28; click Take it away; see Only 4 ones, so break a ten: now there are 14 ones.; see 64 − 28 = 36`
- [ ] 64 − 23 needs no break: `click 64 − 23; click Take it away; see No ten to break.; see 64 − 23 = 41`
- [ ] Start over: `click Put them together; click Start over; see Will the ones make a new ten?`
- Quick check: Which one needs you to break a ten? Answer: “57 − 29”. Mistakes it names: “57 − 24”, “57 + 29”.

## Chapter 5: Story problems · `learn/story-problems.html` · Lessons 11–14

### Step 1: Story problems and diagrams
- [ ] The whole unknown: add: `see Which number in the story is the whole?; click Show the answer; see 36 + 25 = 61 cubes.`
- [ ] A part unknown: `click Part unknown; click Show the answer; see 70 − 45 = 25 crayons.`
- [ ] The start unknown: `click Start unknown; click Show the answer; see 60 − 24 = 36 stickers.`
- [ ] Edge: another story hides the answer: `click Show the answer; click Part unknown; see Which number in the story is the whole?`
- Quick check: Jada picks 28 apples. Han picks some apples too. Together they pick 64 apples. Which diagram matches the story? Answer: “(picture)”. Mistakes it names: “(picture)”, “(picture)”.

### Step 2: Story problems and equations
- [ ] It asks to tap an equation: `see Tap an equation. Does it match the story?`
- [ ] Both equations for story 1 give 35: `click ? + 25 = 60; see Both equations give 35.; click 60 − 25 = ?; see Check: 35 + 25 = 60.`
- [ ] Story 2 gives 42: `click Story 2; click 40 + ? = 82; see Both equations give 42.`
- [ ] Edge: another story clears the equation: `click ? + 25 = 60; click Story 2; see Tap an equation.`
- Quick check: Diego had some marbles. Diego got 18 more marbles. Now Diego has 45 marbles. How many marbles did Diego have at first? Answer: 27 marbles. Mistakes it names: 63, 18, 37.

### Step 3: Two-step stories
- [ ] It starts by asking what happens first: `see This story has two steps. What happens first?`
- [ ] Step 1: 28 + 15 = 43: `click Step 1: gets more; see Step 1: 28 + 15 = 43 stickers.`
- [ ] Step 2: 43 − 20 = 23: `click Step 1: gets more; click Step 2: gives some away; see Step 2: 43 − 20 = 23.`
- [ ] Edge: after step 2, Start over: `click Step 1: gets more; click Step 2: gives some away; click Start over; see This story has two steps.`
- Quick check: Elena has 34 cards. Elena buys 25 more cards. Then Elena gives 30 cards away. How many cards does Elena have now? Answer: 29 cards. Mistakes it names: 59, 89, 4.
