# Checklist: Learn Wrapping Up Addition and Subtraction within 1,000 (Grade 3 Unit 3)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–20. Not covered: Lesson 21 (Classroom Supplies), optional. Every number stays within 1,000.

## Chapter 1: Numbers in different ways · `learn/represent.html` · Lesson 1

### Step 1: Hundreds, tens, and ones
- [ ] It starts at 346, in blocks, expanded form, and words: `see 3 hundreds, 4 tens, and 6 ones make 346.; see Expanded form: 300 + 40 + 6.; see In words: three hundred forty-six.; count .flat = 3; count .rod = 4; count .unit1 = 6`
- [ ] One more ten: `click Tens: one more; see 3 hundreds, 5 tens, and 6 ones make 356.; see Expanded form: 300 + 50 + 6.; count .rod = 5`
- [ ] Edge: with no tens, expanded form leaves them out: `click Tens: one less ×4; see 3 hundreds, 0 tens, and 6 ones make 306.; see Expanded form: 300 + 6.; count .rod = 0`
- [ ] Edge: the ones stop at 9 and at 0: `click Ones: one more ×5; see and 9 ones make 349.; click Ones: one less ×12; see and 0 ones make 340.`
- [ ] Edge: the biggest is 999: `click Hundreds: one more ×8; click Tens: one more ×7; click Ones: one more ×5; see make 999.; see In words: nine hundred ninety-nine.`
- Quick check: What number do the blocks show? Answer: 407. Mistakes it names: 47, 470.

### Step 2: Trade to make the same number
- [ ] It starts at 325, untraded: `pressed 325; see 3 hundreds, 2 tens, and 5 ones: 300 + 20 + 5 = 325.; see Make a trade. Does the number change?; count .flat = 3`
- [ ] Trading a hundred for 10 tens keeps the number: `click Trade a hundred for 10 tens; see 2 hundreds, 12 tens, and 5 ones: 200 + 120 + 5 = 325.; see Different blocks, the same number: still 325.; count .rod = 12; disabled Trade a hundred for 10 tens`
- [ ] Then a ten for 10 ones: `click Trade a hundred for 10 tens; click Trade a ten for 10 ones; see 2 hundreds, 11 tens, and 15 ones: 200 + 110 + 15 = 325.; disabled Trade a ten for 10 ones; count .unit1 = 15`
- [ ] Edge: 504 has no ten to trade until a hundred is traded: `click 504; disabled Trade a ten for 10 ones; click Trade a hundred for 10 tens; see 4 hundreds, 10 tens, and 4 ones: 400 + 100 + 4 = 504.; enabled Trade a ten for 10 ones`
- [ ] Start over: `click Trade a hundred for 10 tens; click Start over; see 3 hundreds, 2 tens, and 5 ones: 300 + 20 + 5 = 325.; enabled Trade a hundred for 10 tens`
- [ ] Edge: another number starts untraded: `click Trade a ten for 10 ones; click 640; see 6 hundreds, 4 tens, and 0 ones: 600 + 40 + 0 = 640.; enabled Trade a ten for 10 ones; count .unit1 = 0`
- Quick check: Which is another way to make 436? Answer: “3 hundreds, 13 tens, 6 ones”. Mistakes it names: “4 hundreds, 13 tens, 6 ones”, “3 hundreds, 3 tens, 6 ones”.

## Chapter 2: Add your way · `learn/add-your-way.html` · Lessons 2–3

### Step 1: Jump on a number line
- [ ] It starts with no jumps: `pressed 245 + 132; see Start at 245. Jump + 100, then + 30, then + 2.; count .jarc = 0`
- [ ] One jump: `click Next jump; see 245 + 100 = 345; see Next jump: + 30.; count .jarc = 1`
- [ ] All the jumps land on the sum: `click Next jump ×3; see 345 + 30 = 375; see 375 + 2 = 377; see 245 + 132 = 377.; disabled Next jump; count .jarc = 3`
- [ ] Edge: a jump past a hundred: `click 358 + 167; click Next jump ×2; see 458 + 60 = 518`
- [ ] Start over: `click Next jump ×2; click Start over; count .jarc = 0; enabled Next jump`
- [ ] Edge: another problem starts over: `click Next jump; click 476 + 238; see Start at 476.; count .jarc = 0`
- Quick check: Elena found 268 + 134 with these jumps. Where does Elena land? Answer: 402. Mistakes it names: 398, 392.

### Step 2: Make a friendly number
- [ ] It starts with nothing moved: `pressed 398 + 245; see 398 + 245 = 643; see Move a little from 245 to 398. The sum stays 643.; count .jarc = 1`
- [ ] Moving 1 keeps the sum: `click Move to the first number: one more; see 399 + 244 = 643; see 398 gets 1 more and 245 gets 1 less; nosee friendly number; count .jarc = 2`
- [ ] Moving 2 makes a friendly hundred: `click Move to the first number: one more ×2; see 400 + 243 = 643; see 400 is a friendly number!`
- [ ] Edge: it moves at most 5: `click Move to the first number: one more ×7; see 403 + 240 = 643`
- [ ] Edge: it stops at nothing moved: `click Move to the first number: one more; click Move to the first number: one less ×3; see 398 + 245 = 643`
- [ ] Another problem starts over: `click Move to the first number: one more ×2; click 197 + 366; see 197 + 366 = 563; click Move to the first number: one more ×3; see 200 is a friendly number!`
- Quick check: Which has the same sum as 299 + 436? Answer: “300 + 435”. Mistakes it names: “300 + 436”, “300 + 437”.

## Chapter 3: Addition algorithms · `learn/add-algorithms.html` · Lessons 4–6

### Step 1: Add by place
- [ ] It starts with nothing added: `pressed 245 + 132; see 245 is 200 + 40 + 5, and 132 is 100 + 30 + 2.; count .ares = 0`
- [ ] The hundreds first: `click Next step; see Hundreds: 200 + 100 = 300.; count .ares = 1`
- [ ] Every place, then the parts: `click Next step ×4; see Tens: 40 + 30 = 70.; see Ones: 5 + 2 = 7.; see Add the parts: 300 + 70 + 7 = 377.; see 245 + 132 = 377.; disabled Next step`
- [ ] Edge: places that add past 9: `click 358 + 167; click Next step ×4; see Tens: 50 + 60 = 110.; see Ones: 8 + 7 = 15.; see Add the parts: 400 + 110 + 15 = 525.`
- [ ] Start over: `click Next step ×2; click Start over; count .ares = 0; enabled Next step`
- [ ] Edge: another problem starts over: `click Next step; click 476 + 238; see 476 is 400 + 70 + 6; count .ares = 0`
- Quick check: Each place of 256 + 378 is added. What is 256 + 378? Answer: 634. Mistakes it names: 524, 624.

### Step 2: The standard algorithm
- [ ] It starts at the ones: `pressed 358 + 167; see Line up the places. Start with the ones, on the right.`
- [ ] The ones make a new ten: `click Next column; see Ones: 8 + 7 = 15. That’s 1 ten and 5 ones: write 5, and put the 1 above the tens.; see Next: the tens.; count .amk = 1`
- [ ] The tens make a new hundred: `click Next column ×2; see Tens: 5 + 6 + 1 = 12. That’s 1 hundred and 2 tens: write 2, and put the 1 above the hundreds.; count .amk = 2`
- [ ] The hundreds finish it: `click Next column ×3; see Hundreds: 3 + 1 + 1 = 5. Write 5.; see 358 + 167 = 525.; disabled Next column`
- [ ] Edge: no new ten: `click 245 + 132; click Next column; see Ones: 5 + 2 = 7. Write 7.; count .amk = 0`
- [ ] Start over: `click Next column ×2; click Start over; see Line up the places.; enabled Next column`
- Quick check: The ferry carried 186 people in the morning and 247 people in the afternoon. How many people did it carry in all? Answer: 433 people. Mistakes it names: 323, 61.

## Chapter 4: Subtract your way · `learn/subtract-your-way.html` · Lesson 7

### Step 1: Jump back
- [ ] It starts with no jumps: `pressed 534 − 212; see Start at 534. Jump − 200, then − 10, then − 2.; count .jarc = 0`
- [ ] All the jumps land on the difference: `click Next jump ×3; see 534 − 200 = 334; see 334 − 10 = 324; see 324 − 2 = 322; see 534 − 212 = 322.; disabled Next jump`
- [ ] Edge: a jump back past a ten: `click 645 − 328; click Next jump ×3; see 325 − 8 = 317; see 645 − 328 = 317.`
- [ ] Start over: `click Next jump; click Start over; count .jarc = 0; enabled Next jump`
- [ ] Edge: another problem starts over: `click Next jump ×2; click 720 − 255; see Start at 720.; count .jarc = 0`
- Quick check: Han found 763 − 345 with these jumps. Where does Han land? Answer: 418. Mistakes it names: 423, 428.

### Step 2: Count up
- [ ] It starts at the smaller number: `pressed 512 − 398; see Start at 398. Jump up to 512; count .jarc = 0`
- [ ] The jumps add up to the difference: `click Next jump ×3; see 398 + 2 = 400; see 400 + 100 = 500; see 500 + 12 = 512; see The jumps add up to 2 + 100 + 12 = 114. So 512 − 398 = 114.; disabled Next jump`
- [ ] Another problem: `click 625 − 280; click Next jump ×3; see The jumps add up to 20 + 300 + 25 = 345. So 625 − 280 = 345.`
- [ ] Edge: one jump says what's next: `click 703 − 597; click Next jump; see 597 + 3 = 600; see Next jump: + 100.`
- [ ] Start over: `click Next jump ×2; click Start over; count .jarc = 0`
- Quick check: How far is it from 296 to 625? Add the jumps to find 625 − 296. Answer: 329. Mistakes it names: 325, 625.

## Chapter 5: Subtraction algorithms · `learn/subtract-algorithms.html` · Lessons 8–10

### Step 1: Regroup, then subtract by place
- [ ] It starts with nothing regrouped: `pressed 462 − 237; see 462 is 400 + 60 + 2, and 237 is 200 + 30 + 7.; count .axd = 0`
- [ ] Regrouping a ten comes first: `click Next step; see Regroup: 2 ones can’t give 7, so take 1 ten: 60 becomes 50, and 2 becomes 12. 462 is 400 + 50 + 12.; count .axd = 2; count .ares = 0`
- [ ] Then each place, and the parts: `click Next step ×5; see Hundreds: 400 − 200 = 200.; see Tens: 50 − 30 = 20.; see Ones: 12 − 7 = 5.; see Put the parts together: 200 + 20 + 5 = 225.; see 462 − 237 = 225.; disabled Next step`
- [ ] Edge: regrouping a hundred for the tens: `click 528 − 163; click Next step; see Regroup: 2 tens can’t give 6, so take 1 hundred: 500 becomes 400, and 20 becomes 120. 528 is 400 + 120 + 8.`
- [ ] Edge: no tens to take, so a hundred first: `click 503 − 278; click Next step; see There are no tens to take, so take 1 hundred: 500 becomes 400, and the tens become 100. 3 ones can’t give 8, so take 1 ten: 100 becomes 90, and 3 becomes 13. 503 is 400 + 90 + 13.; count .axd = 3`
- [ ] Start over: `click Next step ×3; click Start over; count .axd = 0; enabled Next step`
- Quick check: To find 352 − 128 by place, how can you write 352 so you can take away each place of 128? Answer: “300 + 40 + 12”. Mistakes it names: “300 + 50 + 2”, “200 + 150 + 2”.

### Step 2: The standard algorithm
- [ ] It starts at the ones: `pressed 462 − 237; see Line up the places. Start with the ones, on the right.`
- [ ] The ones regroup a ten: `click Next column; see Ones: 2 is less than 7, so regroup 1 ten: 6 tens become 5, and 2 ones become 12. 12 − 7 = 5. Write 5.; count .axd = 2`
- [ ] Then the tens and hundreds: `click Next column ×3; see Hundreds: 4 − 2 = 2. Write 2.; see 462 − 237 = 225.; disabled Next column`
- [ ] Edge: regrouping across a zero: `click 503 − 278; click Next column; see 3 is less than 8, so regroup, but there are no tens. Regroup 1 hundred: 5 hundreds become 4, the 0 tens become 9, and 3 ones become 13. 13 − 8 = 5. Write 5.`
- [ ] Start over: `click Next column ×2; click Start over; see Line up the places.; count .axd = 0`
- Quick check: The trail around the cove is 604 meters long. Jada has walked 258 meters. How many meters are left to walk? Answer: 346 meters. Mistakes it names: 454, 446.

## Chapter 6: Subtract strategically · `learn/subtract-strategically.html` · Lessons 11–12

### Step 1: Check with addition
- [ ] It starts with Kiran's answer: `pressed Kiran; see Kiran says 452 − 268 is 216.; see Is Kiran right?; disabled Show the right way; count svg = 0`
- [ ] Adding shows the mistake: `click Check by adding; see 216 + 268 = 484. That’s not 452, so 216 can’t be right.; see Kiran took the smaller digit from the bigger one in each place; disabled Check by adding; enabled Show the right way`
- [ ] The right way, checked: `click Check by adding; click Show the right way; see 452 − 268 = 184, and 184 + 268 = 452.; count svg = 1; disabled Show the right way`
- [ ] Edge: a right answer checks out: `click Noah; click Check by adding; see 316 + 325 = 641. That’s 641, so Noah is right.`
- [ ] Edge: another student starts over: `click Check by adding; click Elena; see Is Elena right?; enabled Check by adding; count svg = 0`
- Quick check: Lin says 623 − 147 is 524. Add to check Lin’s answer. Then find 623 − 147. Answer: 476. Mistakes it names: 524, 770.

### Step 2: Pick a strategy
- [ ] It starts with counting up for numbers close together: `pressed 701 − 698; pressed Count up; see Count up from 698 to 701: 2 + 1 = 3. That’s 2 jumps.; see A good pick for 701 − 698`
- [ ] The algorithm works, but isn't the best pick here: `click Algorithm; see The standard algorithm, one column at a time, gives 3.; see It works, but try count up for these numbers.`
- [ ] Jump back for a friendly hundred: `click 745 − 300; click Jump back; see Jump back from 745: − 300 lands on 445. That’s 1 jump.; see A good pick for 745 − 300`
- [ ] Edge: counting up far takes more jumps: `click 523 − 167; click Count up; see 33 + 300 + 23 = 356. That’s 3 jumps.; see try algorithm for these numbers.`
- Quick check: Which is the quickest way to find 802 − 797? Answer: “Count up from 797”. Mistakes it names: “Jump back 797 by place”, “The standard algorithm”.

## Chapter 7: Round · `learn/round.html` · Lessons 13–15

### Step 1: The nearest ten or hundred
- [ ] It starts at 342, to the nearest ten: `pressed 342; pressed Nearest ten; see 342 is between 340 and 350. Halfway is 345.; see 342 rounded to the nearest ten is 340.`
- [ ] To the nearest hundred: `click Nearest hundred; see 342 is between 300 and 400. Halfway is 350.; see 342 rounded to the nearest hundred is 300.`
- [ ] Edge: halfway rounds up: `click Number: one more ×3; see 345 is exactly halfway, and then we round up to 350.; see 345 rounded to the nearest ten is 350.`
- [ ] Edge: a multiple of ten stays: `click Number: one less ×2; see 340 is already a multiple of 10, so rounded to the nearest ten it stays 340.`
- [ ] Edge: halfway to the nearest hundred: `click 450; click Nearest hundred; see 450 is exactly halfway, and then we round up to 500.`
- [ ] Edge: the stepper stays within 10 of the number picked: `click 718; click Number: one more ×12; see 728 rounded to the nearest ten is 730.`
- Quick check: A ship carries 649 barrels. What is 649 rounded to the nearest hundred? Answer: “600”. Mistakes it names: “700”, “650”.

### Step 2: Numbers that round the same
- [ ] It starts with nothing tapped: `pressed 350, the nearest ten; see Tap a tick. Does it round to 350?; see Found 0 of the 10 ticks that round to 350.; count .pt = 0`
- [ ] A tick that rounds to the target: `tap [data-v="346"]; see 346 rounded to the nearest ten is 350 ✓.; see Found 1 of the 10; count .pt.b = 1`
- [ ] A tick that doesn't: `tap [data-v="344"]; see 344 rounded to the nearest ten is 340, not 350.; count .pt = 1; count .pt.b = 0`
- [ ] Edge: halfway past the target rounds up past it: `tap [data-v="355"]; see 355 rounded to the nearest ten is 360, not 350.`
- [ ] Edge: a second tap takes the mark off: `tap [data-v="346"] ×2; count .pt = 0; see Found 0 of the 10`
- [ ] Show them all: `click Show them all; see Found 10 of the 10 ticks that round to 350.; see Every number from 345 to 354 rounds to 350.; count .pt.b = 10; disabled Show them all`
- [ ] The nearest hundred: `click 400, the nearest hundred; click Show them all; see Every number from 350 to 449 rounds to 400.; count .pt.b = 10`
- [ ] Start over: `tap [data-v="346"]; click Start over; count .pt = 0; see Tap a tick.`
- Quick check: What is the largest whole number that rounds to 300 when you round to the nearest hundred? Answer: 349. Mistakes it names: 350, 399.

## Chapter 8: Estimate · `learn/estimate.html` · Lessons 16–17

### Step 1: Round to estimate
- [ ] It starts rounding to the nearest hundred: `pressed 487 + 316; pressed Nearest hundred; see 500 + 300 = 800; see So 487 + 316 is about 800.`
- [ ] The exact answer is close: `click Find the exact answer; see Exact: 487 + 316 = 803. The estimate is off by 3.; disabled Find the exact answer`
- [ ] The nearest ten: `click Nearest ten; see 490 + 320 = 810; enabled Find the exact answer`
- [ ] A difference: `click 612 − 289; see 600 − 300 = 300; click Find the exact answer; see Exact: 612 − 289 = 323. The estimate is off by 23.`
- [ ] Edge: another problem hides the exact answer: `click Find the exact answer; click 238 + 455; nosee Exact:; see 200 + 500 = 700`
- Quick check: The ferry carried 386 people on Saturday and 412 people on Sunday. Round each to the nearest hundred, then add. About how many people did it carry? Answer: 800 people. Mistakes it names: 798, 700.

### Step 2: Does it make sense?
- [ ] It starts with Lin's answer: `pressed Lin; see Lin says 487 + 316 is 603.; see Does 603 make sense?`
- [ ] A far answer doesn't make sense: `click Estimate to check; see 487 + 316 is about 500 + 300 = 800. 603 is far from 800, so it doesn’t make sense. The exact answer is 803.; disabled Estimate to check`
- [ ] A close answer makes sense: `click Diego; click Estimate to check; see 612 − 289 is about 600 − 300 = 300. 323 is close to 300, so it makes sense.`
- [ ] Edge: another student hides the estimate: `click Estimate to check; click Mai; see Does 893 make sense?; enabled Estimate to check; click Estimate to check; see 893 is far from 700`
- Quick check: Han says 594 − 207 is 187. Round each number to the nearest hundred to check. Does 187 make sense? Answer: “No, it should be about 400”. Mistakes it names: “Yes, it makes sense”, “No, it should be about 300”.

## Chapter 9: Two-step problems · `learn/two-step.html` · Lessons 18–20

### Step 1: Two steps with a tape diagram
- [ ] It starts with the kites story: `pressed Kites; see The harbor shop had 600 kites.; see Find the part you need first.`
- [ ] The first step: `click Next step; see Step 1: 600 − 245 = 355`
- [ ] The second step finds the answer: `click Next step ×2; see Step 2: 355 − 178 = 177; see That’s 177 kites.; disabled Next step`
- [ ] A comparison story: `click Pages; click Next step ×2; see Step 1: 214 + 85 = 299; see Step 2: 214 + 299 = 513; see That’s 513 pages.`
- [ ] Start over: `click Next step; click Start over; see Find the part you need first.; enabled Next step`
- [ ] Edge: another story starts over: `click Next step ×2; click Shells; see Clare’s class wants to collect 500 shells.; enabled Next step`
- Quick check: The ferry had 412 people on board. At the first stop, 135 people got off. At the second stop, 160 people got on. How many people are on the ferry now? Answer: 437 people. Mistakes it names: 277, 117.

### Step 2: Equations with a letter
- [ ] It starts with one equation: `pressed Kites; pressed One equation; see 600 − 245 − 178 = k; see The letter k is the kites left.`
- [ ] Two equations, one per step: `click Two equations; see 600 − 245 = 355; see 355 − 178 = k`
- [ ] Find the letter: `click Find the letter; see k = 177: 177 kites.; disabled Find the letter`
- [ ] Another story: `click Find the letter; click Shells; see 500 − 186 − 207 = s; enabled Find the letter; click Find the letter; see s = 107: 107 shells.`
- [ ] Edge: one or two equations keep the letter found: `click Find the letter; click Two equations; see k = 177`
- Quick check: Mai read 214 pages. Han read 85 more pages than Mai. Which equation shows how many pages they read in all? The letter p stands for all the pages. Answer: “214 + 214 + 85 = p”. Mistakes it names: “214 + 85 = p”, “214 + 214 − 85 = p”.
