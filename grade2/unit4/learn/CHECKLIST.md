# Checklist: Learn the Number Line (Grade 2 Unit 4)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

Not covered: Center Days (Lessons 6 and 14) and Riddles (Lesson 15) are optional lessons that work better in class. There’s no practice game for this unit yet.

## Chapter 1: Numbers on the number line · `learn/number-line.html` · Lessons 1–3

### Step 1: Numbers are lengths
- [ ] The dot at 6 is 6 lengths from 0: `see The dot is at 6. It is 6 lengths from 0.; see Count them: 1, 2, 3, 4, 5, 6.`
- [ ] Edge: 1 says “1 length”: `click Number: one less ×5; see It is 1 length from 0.; see One space from 0 is 1.`
- [ ] Edge: 0 is where we start: `click Number: one less ×7; see The dot is at 0. That’s where we start.`
- [ ] Edge: 20 is the most, counted with “…”: `click Number: one more ×16; see The dot is at 20.; see Count them: 1, 2, 3, … 20.`
- Quick check: What number is the dot at? Answer: 14. Mistakes it names: 16, 4, 13.

### Step 2: Parts of a number line
- [ ] Equal spaces: `see Every space is the same length: 1.`
- [ ] Bigger to the right: `click Bigger to the right; see 8 is to the right of 3, and 8 is more than 3.`
- [ ] It keeps going: `click Keeps going; see The arrow means the line keeps going`
- Quick check: Which number line is made the right way? Answer: “(picture)”. Mistakes it names: “(picture)”, “(picture)”.

### Step 3: Tick marks with no numbers
- [ ] It asks which number goes there: `see Which number goes there?`
- [ ] A tick near 30 counts on: `tap [data-v="33"]; see That tick is 33.; see Count on from 30: 31, 32, 33.`
- [ ] A tick near 50 counts back: `tap [data-v="48"]; see That tick is 48.; see Count back from 50: 49, 48.`
- [ ] Edge: a ten has its number already: `tap [data-v="40"]; see That’s 40. It has its number already!`
- [ ] Edge: halfway counts on: `tap [data-v="35"]; see Count on from 30: 31, 32, 33, 34, 35.`
- Quick check: What number is the dot at? Answer: 74. Mistakes it names: 75, 76, 64.

## Chapter 2: Compare and estimate · `learn/compare-and-estimate.html` · Lessons 4–5

### Step 1: Compare numbers
- [ ] 38 and 83: `see 83 is farther right, so 83 is greater.; see 38 < 83; see 38 is less than 83.`
- [ ] 65 and 56: `click 65 and 56; see 65 > 56; see 65 is greater than 56.`
- [ ] 29 and 31: `click 29 and 31; see 31 is farther right, so 31 is greater.`
- Quick check: Which is true? Answer: “46 < 64”. Mistakes it names: “46 > 64”, “46 = 64”.

### Step 2: Estimate on a number line
- [ ] It asks for an estimate first: `see About what number is the dot at?; disabled Show the tens`
- [ ] A close estimate: `click about 50; click Show the tens; see The dot is at 48. You said about 50.; see Great estimate!`
- [ ] Edge: a far estimate names the closer one: `click about 90; click Show the tens; see About 50 is closer.`
- [ ] Dot C is at 88: `click Dot C; click about 90; click Show the tens; see The dot is at 88.`
- [ ] Try another goes to the next dot: `click about 50; click Show the tens; click Try another; see About what number is the dot at?; pressed Dot B`
- Quick check: About what number is the dot at? Answer: “about 75”. Mistakes it names: “about 25”, “about 95”.

## Chapter 3: Jumps on the number line · `learn/jumps.html` · Lessons 7–9

### Step 1: Jump to add and subtract
- [ ] Adding jumps right: `see Start at 26. Jump 5 to the right. You land on 31.; see 26 + 5 = 31`
- [ ] Subtracting jumps left: `click Subtract: jump left; see Jump 5 to the left. You land on 21.; see 26 − 5 = 21`
- [ ] Edge: the biggest start and jump: `click Start: one more ×6; click Jump: one more ×6; see 30 + 9 = 39`
- [ ] Edge: the smallest start, jumping back 9: `click Subtract: jump left; click Start: one less ×3; click Jump: one more ×6; see 25 − 9 = 16`
- Quick check: Start at 47. Jump 6 to the left. Where do you land? Answer: 41. Mistakes it names: 53, 42.

### Step 2: Equations and jumps
- [ ] It asks which equation matches: `see Which equation matches the jump?`
- [ ] The right equation: `click 18 + 7 = 25; see Yes! Start at 18, jump 7 right, land on 25: 18 + 7 = 25.`
- [ ] Edge: the wrong way names the mistake: `click 25 − 7 = 18; see Not that one. The jump goes right, so it’s adding, not subtracting.`
- [ ] Picture 2 jumps left: `click Picture 2; click 25 − 7 = 18; see Yes! Start at 25, jump 7 left, land on 18`
- [ ] Picture 3: counting the jump: `click Picture 3; click 18 + 7 = 25; see Count the jump: it’s 5.`
- [ ] Edge: another picture clears the choice: `click 18 + 7 = 25; click Picture 2; see Which equation matches the jump?`
- Quick check: Which equation matches the jump? Answer: “52 − 8 = 44”. Mistakes it names: “52 + 8 = 60”, “44 − 8 = 36”.

### Step 3: The difference
- [ ] It explains the difference first: `see The difference between 27 and 33 is how far apart they are.`
- [ ] Jumping through 30: 3 + 3 = 6: `click Jump from 27 to 33; see 27 to 30 is 3. 30 to 33 is 3. 3 + 3 = 6.; see The difference is 6`
- [ ] 38 to 61: 2 + 21 = 23: `click 38 and 61; click Jump from 38 to 61; see 38 to 40 is 2. 40 to 61 is 21. 2 + 21 = 23.`
- [ ] Start over: `click Jump from 27 to 33; click Start over; see how far apart they are.`
- Quick check: What is the difference between 46 and 53? Answer: 7. Mistakes it names: 99, 4, 3, 13.

## Chapter 4: Jump by tens and ones · `learn/tens-and-ones.html` · Lessons 10–11

### Step 1: Tens, then ones
- [ ] It says to jump tens first: `see 34 + 23: start at 34.; see Jump by tens first, then the ones.`
- [ ] The first jump is a ten: `click Jump!; see 34 + 10 = 44`
- [ ] All the jumps: 34 + 23 = 57: `click Jump!; click Next jump ×2; see 44 + 10 = 54; see 54 + 3 = 57; see 34 + 23 = 57`
- [ ] Subtracting jumps back: `click 78 − 25; click Jump!; click Next jump ×2; see 78 − 10 = 68; see 78 − 25 = 53`
- [ ] Edge: after the last jump, Start over: `click Jump!; click Next jump ×2; click Start over; see 34 + 23: start at 34.`
- Quick check: What is 45 + 32? Where do the jumps land? Answer: 77. Mistakes it names: 75, 65, 50.

### Step 2: Jump to a ten
- [ ] Jump up to a ten first: `see 28 + 7: start at 28.; see First jump up to 30. Then jump the rest.`
- [ ] 28 + 2, then + 5: `click Jump!; click Next jump; see 28 + 2 = 30; see 30 + 5 = 35; see 28 + 7 = 35`
- [ ] Subtracting jumps back to a ten: `click 43 − 6; see First jump back to 40.; click Jump!; click Next jump; see 43 − 6 = 37`
- Quick check: What is 36 + 8? Answer: 44. Mistakes it names: 48, 28, 43.

## Chapter 5: Unknowns and stories · `learn/stories.html` · Lessons 12–13

### Step 1: Find the missing jump
- [ ] It asks how far: `see Start at 27. How far is it to 50?`
- [ ] Adding the jumps: 23: `click Jump to find ?; see Add up the jumps: 3 + 20 = 23; see ? = 23, because 27 + 23 = 50.`
- [ ] A missing number in subtraction: `click 64 − ? = 40; click Jump to find ?; see ? = 24, because 64 − 24 = 40.`
- [ ] Start over: `click Jump to find ?; click Start over; see How far is it to 50?`
- Quick check: 38 + ? = 60. What is the missing number? Answer: 22. Mistakes it names: 98, 2, 20, 32.

### Step 2: Story problems
- [ ] More stickers: `see Lin has 35 stickers.; click Show the jumps; see 35 + 20 = 55; see Lin has 55 stickers now.`
- [ ] Kids go inside: `click Kids go inside; click Show the jumps; see 52 − 8 = 44`
- [ ] Pages to read: `click Pages to read; click Show the jumps; see Clare needs to read 14 more pages.`
- [ ] Edge: another story hides the jumps: `click Show the jumps; click Kids go inside; see Where do you start?`
- Quick check: The class library has 43 books. The class gives away 9 books. How many books are left? Answer: 34. Mistakes it names: 52, 33, 36.
