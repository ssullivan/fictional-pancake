# Checklist: Learn Numbers to 1,000 (Grade 2 Unit 5)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

Not covered: Center Days (Lessons 7 and 13) and Hundreds of Objects (Lesson 14) are optional lessons that work better in class. Practice it all in Dragon Duel, the game for this unit.

## Chapter 1: Make a hundred · `learn/hundred.html` · Lessons 1–2

### Step 1: 10 tens make a hundred
- [ ] 4 tens is 40, 6 more to make a hundred: `see 4 tens is 40.; see 6 more tens to make a hundred.`
- [ ] Edge: 10 tens make 1 hundred: `click Tens: one more ×6; see 10 tens make 1 hundred!; count .flat = 1`
- [ ] Edge: 1 ten says “ten”: `click Tens: one less ×3; see 1 ten is 10.; see 9 more tens to make a hundred.`
- [ ] Edge: 9 tens needs “1 more ten”: `click Tens: one more ×5; see 1 more ten to make a hundred.`
- [ ] Edge: 0 tens: `click Tens: one less ×4; see 0 tens is 0.`
- Quick check: Here are 7 tens. How many more tens do you need to make a hundred? Answer: 3 tens. Mistakes it names: 7, 30, 10.

### Step 2: Make hundreds
- [ ] It starts with 12 tens: `see 12 tens. Every 10 tens make a hundred.`
- [ ] 12 tens make 1 hundred and 2 tens: `click Make hundreds; see 12 tens is 1 hundred and 2 tens.; see 12 tens = 120`
- [ ] Edge: 20 tens make exactly 2 hundreds: `click 20 tens; click Make hundreds; see 20 tens is 2 hundreds.; nosee and 0 tens`
- [ ] 35 tens make 3 hundreds and 5 tens: `click 35 tens; click Make hundreds; see 3 hundreds and 5 tens.; count .flat = 3`
- [ ] Breaking them apart: `click Make hundreds; click Break them apart; see Every 10 tens make a hundred.`
- Quick check: How many hundreds can you make with 40 tens? Answer: 4 hundreds. Mistakes it names: 40, 400.

## Chapter 2: Three-digit numbers · `learn/three-digit.html` · Lessons 3–4

### Step 1: Hundreds, tens, and ones
- [ ] 2 hundreds, 3 tens, 5 ones is 235: `see 2 hundreds, 3 tens, 5 ones; see 235: two hundred thirty-five`
- [ ] Edge: no tens writes a 0: `click Tens: one less ×3; see 205: two hundred five; see No tens: write 0 in the tens place.`
- [ ] Edge: no tens and no ones: `click Tens: one less ×3; click Ones: one less ×5; see 200: two hundred; see No tens and no ones: write 0 in both places.`
- [ ] Edge: 1 of each says “hundred”, “ten”, “one”: `click Hundreds: one less; click Tens: one less ×2; click Ones: one less ×4; see 1 hundred, 1 ten, 1 one; see 111: one hundred eleven`
- [ ] Edge: 999 is the most: `click Hundreds: one more ×8; click Tens: one more ×7; click Ones: one more ×5; see 999: nine hundred ninety-nine`
- Quick check: What number do the blocks show? Answer: 205. Mistakes it names: 25, 250, 7.

### Step 2: Number names
- [ ] 406: no tens, so a 0: `see four hundred six is 4 hundreds, 0 tens, and 6 ones: 406.; see There are no tens, so that place gets a 0.`
- [ ] 460: no ones: `click 460; see There are no ones, so that place gets a 0.`
- [ ] 517: `click 517; see five hundred seventeen is 5 hundreds, 1 tens, and 7 ones: 517.`
- Quick check: Which number is four hundred six? Answer: “406”. Mistakes it names: “460”, “4,006”.

## Chapter 3: Expanded form · `learn/expanded-form.html` · Lessons 5–6

### Step 1: Hundreds + tens + ones
- [ ] 342 = 300 + 40 + 2: `see 342 = 300 + 40 + 2; see Tap each part to find its blocks.`
- [ ] Tapping a part names its blocks: `click 40; see 40 is 4 tens.`
- [ ] Edge: a zero part is left out: `click 508; see 508 = 500 + 8`
- [ ] 760: `click 760; click 60; see 60 is 6 tens.`
- Quick check: What number is 500 + 60 + 7? Answer: 567. Mistakes it names: 576, 5607, 18.

### Step 2: Different ways
- [ ] It starts as 3 hundreds, 4 tens, 2 ones: `see 3 hundreds, 4 tens, 2 ones; see 300 + 40 + 2 = 342; disabled Start over`
- [ ] Breaking a hundred: 2 hundreds and 14 tens: `click Break a hundred into 10 tens; see 2 hundreds, 14 tens, 2 ones; see 200 + 140 + 2 = 342; see Same number, different blocks!`
- [ ] Edge: it breaks at most two, and says “1 hundred”: `click Break a hundred into 10 tens ×2; see 1 hundred, 24 tens, 2 ones; disabled Break a hundred into 10 tens`
- [ ] Start over: `click Break a hundred into 10 tens; click Start over; see 3 hundreds, 4 tens, 2 ones`
- Quick check: Which one is another way to make 452? Answer: “3 hundreds, 15 tens, 2 ones”. Mistakes it names: “4 hundreds, 15 tens, 2 ones”, “4 hundreds, 2 tens, 5 ones”.

## Chapter 4: The number line to 1,000 · `learn/number-line.html` · Lessons 8–9

### Step 1: Find a number
- [ ] 350 is between 300 and 400, 5 tens past 300: `see 350 is between 300 and 400.; see Zoom in: count by tens from 300: 310, 320, 330, 340, 350. That’s 5 tens past 300.`
- [ ] Edge: 905 is 0 tens and 5 ones past 900: `click 905; see 905 is between 900 and 1000.; see That’s 0 tens and 5 ones past 900.`
- [ ] 720: `click 720; see That’s 2 tens past 700.`
- Quick check: The ticks count by tens. What number is the dot at? Answer: 470. Mistakes it names: 407, 480, 460.

### Step 2: Compare on the number line
- [ ] 628 and 682: `see 682 is farther right, so it’s greater.; see 628 < 682`
- [ ] 395 and 410, across a hundred: `click 395 and 410; see 395 < 410`
- [ ] 750 and 705: `click 750 and 705; see 750 > 705`
- Quick check: Which is true? Answer: “587 > 578”. Mistakes it names: “587 < 578”, “587 = 578”.

## Chapter 5: Compare and order · `learn/compare-and-order.html` · Lessons 10–12

### Step 1: Compare by place
- [ ] 436 and 463: same hundreds, look at the tens: `see Same hundreds, so look at the tens.; see 3 tens is less than 6 tens.; see 436 < 463`
- [ ] 718 and 299: the hundreds decide: `click 718 and 299; see Start with the biggest place: hundreds.; see 718 > 299`
- [ ] Edge: the same hundreds and tens: `click 652 and 658; see Same hundreds and tens, so look at the ones.; see 652 < 658`
- Quick check: Which number is greatest? Answer: “412”. Mistakes it names: “389”, “398”.

### Step 2: Put numbers in order
- [ ] It asks for the least: `see Which number is least?`
- [ ] In order: 65, 506, 560, 605: `click 65; click 506; click 560; click 605; see Least to greatest!`
- [ ] Edge: out of order says so: `click 506; see Not 506 yet. Is there a number less than 506?`
- [ ] A tapped number can’t be tapped again: `click 65; disabled 65; see Which number is next?`
- [ ] Start over: `click 65; click Start over; enabled 65; see Which number is least?`
- Quick check: Which list goes from least to greatest? Answer: “247, 274, 427”. Mistakes it names: “274, 247, 427”, “427, 274, 247”.
