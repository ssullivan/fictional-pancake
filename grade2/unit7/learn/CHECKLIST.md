# Checklist: Learn Adding & Subtracting within 1,000 (Grade 2 Unit 7)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

Not covered: Center Days (Lessons 5, 11, and 17) and Paint Splattered Bar Graph (Lesson 18) are optional lessons that work better in class. There’s no practice game for this unit yet.

## Chapter 1: Count on and count back · `learn/count-on-and-back.html` · Lessons 1–3

### Step 1: Jump by hundreds, tens, and ones
- [ ] 245 + 132 starts at 245 and splits 132 by place: `see 245 + 132: start at 245.; see 132 is 1 hundred, 3 tens, and 2 ones. Jump on by hundreds, then tens, then ones.`
- [ ] Three jumps land on 377: `click Jump!; see 245 + 100 = 345; click Next jump; see 345 + 30 = 375; click Next jump; see 375 + 2 = 377; see 245 + 132 = 377`
- [ ] Jumping back for 468 − 225: `click 468 − 225; see Jump back by hundreds; click Jump!; click Next jump ×2; see 468 − 200 = 268; see 268 − 20 = 248; see 248 − 5 = 243; see 468 − 225 = 243`
- [ ] Edge: no ones means only two jumps: `click 327 + 250; see 250 is 2 hundreds and 5 tens.; click Jump!; click Next jump; see 327 + 250 = 577; see Start over`
- [ ] Edge: Start over, and another problem, go back to the start: `click Jump!; click Next jump ×2; click Start over; see start at 245.; click Jump!; click 468 − 225; see 468 − 225: start at 468.`
- Quick check: Start at 356. Jump on 200, then 10, then 3. Where do you land? Answer: 569. Mistakes it names: 559, 566, 143.

### Step 2: 10 more, 100 more
- [ ] It asks which digit changes: `see Tap a button. Which digit changes?`
- [ ] 100 more changes the hundreds digit: `click + 100; see 100 more than 347 is 447.; see Only the hundreds digit changed: 3 hundreds to 4 hundreds.`
- [ ] 10 less changes the tens digit: `click − 10; see 10 less than 347 is 337.; see 4 tens to 3 tens.`
- [ ] Edge: 1 ten says “ten”, and 0 tens can’t go lower: `click − 10 ×4; see 10 less than 317 is 307.; see 1 ten to 0 tens.; disabled − 10; enabled + 10`
- [ ] Edge: 9 hundreds is the most: `click + 100 ×6; see 947; disabled + 100`
- [ ] Edge: 1 hundred is the least: `click − 100 ×2; see 100 less than 247 is 147.; see 2 hundreds to 1 hundred.; disabled − 100`
- [ ] Edge: 9 tens is the most: `click + 10 ×5; see 10 more than 387 is 397.; disabled + 10`
- Quick check: What is 100 less than 572? Answer: 472. Mistakes it names: 562, 672, 571.

### Step 3: Count on to subtract
- [ ] It asks how far from 196 to 403: `see How far is it from 196 to 403?; see Stop at the next hundred on the way.`
- [ ] Counting on: 4, then 200, then 3 is 207: `click Jump!; click Next jump ×2; see 196 + 4 = 200; see 200 + 200 = 400; see 400 + 3 = 403; see Add up the jumps: 4 + 200 + 3 = 207.; see 403 − 196 = 207`
- [ ] 520 − 480 is 40: `click 520 − 480; click Jump!; click Next jump; see 480 + 20 = 500; see 500 + 20 = 520; see 520 − 480 = 40`
- [ ] 610 − 350 is 260: `click 610 − 350; click Jump!; click Next jump ×2; see 50 + 200 + 10 = 260.`
- Quick check: What is 402 − 396? Count on from 396. Answer: 6. Mistakes it names: 798, 4, 2, 194.

## Chapter 2: Add and subtract by place · `learn/by-place.html` · Lesson 4

### Step 1: Hundreds with hundreds
- [ ] It shows both numbers first: `see 342 + 235; see Big squares are hundreds, sticks are tens, and small squares are ones.`
- [ ] Hundreds, tens, and ones add by place: `click Put them together; see Hundreds: 3 + 2 = 5. Tens: 4 + 3 = 7. Ones: 2 + 5 = 7.; see 342 + 235 = 577; see 5 hundreds, 7 tens, 7 ones: 500 + 70 + 7`
- [ ] Edge: 0 ones in one number: `click 530 + 264; click Put them together; see Ones: 0 + 4 = 4.; see 530 + 264 = 794`
- [ ] Start over: `click Put them together; click Start over; see Big squares are hundreds`
- Quick check: A library has 526 picture books and 243 chapter books. How many books is that? Answer: 769 books. Mistakes it names: 283, 7609, 569.

### Step 2: Take away by place
- [ ] It says what to take away: `see Take away 235: 2 hundreds, 3 tens, and 5 ones.; see Take away each place.`
- [ ] Taking away each place: 578 − 235 = 343: `click Take away ones; click Take away tens; click Take away hundreds; see You took away 235. 578 − 235 = 343.; see 3 hundreds, 4 tens, and 3 ones are left.`
- [ ] Edge: any order works, and each place is taken once: `click 865 − 431; click Take away hundreds; disabled Take away hundreds; click Take away ones; click Take away tens; see 865 − 431 = 434.; see 4 hundreds, 3 tens, and 4 ones are left.`
- [ ] Start over: `click Take away ones; click Start over; enabled Take away ones; see Take away 235`
- Quick check: A theater has 687 seats. People sit in 452 of them. How many seats are empty? Answer: 235 seats. Mistakes it names: 1139, 635, 287.

### Step 3: Different ways
- [ ] It starts by place and asks for another way: `see Take away the hundreds, the tens, and the ones.; see Now tap another way.`
- [ ] After every way, they all agree: `click Count back; see You land on 443.; click Count on; see Every way gets 785 − 342 = 443.`
- [ ] Edge: the same way twice doesn’t count: `click By place; click Count back; click By place; see Now tap another way.`
- Quick check: Which one is a right way to find 563 − 241? Answer: “563 − 200 = 363, then 363 − 40 = 323, then 323 − 1 = 322”. Mistakes it names: “5 − 2 = 3, 6 − 4 = 2, 3 − 1 = 2, so it’s 3 + 2 + 2 = 7”, “563 − 200 = 363, then 363 − 4 = 359, then 359 − 1 = 358”.

## Chapter 3: Make a new ten or hundred · `learn/new-ten.html` · Lessons 6–8

### Step 1: Make a new ten
- [ ] 12 ones make a new ten: `click Put them together; see Hundreds: 3 + 1 = 4. Tens: 4 + 2 = 6. Ones: 7 + 5 = 12.; see 12 ones! Trade 10 ones for a new ten.; click Make a new ten; see 10 ones make a new ten. Now there are 7 tens and 2 ones.; see 347 + 125 = 472`
- [ ] 268 + 217 = 485: `click 268 + 217; click Put them together; click Make a new ten; see Now there are 8 tens and 5 ones.; see 268 + 217 = 485`
- [ ] Edge: a two-digit number has 0 hundreds: `click 456 + 38; click Put them together; see Hundreds: 4 + 0 = 4.; click Make a new ten; see 456 + 38 = 494; see 4 hundreds, 9 tens, 4 ones`
- [ ] Start over: `click Put them together; click Make a new ten; click Start over; see 347 + 125; see Put them together`
- Quick check: A school food drive got 238 cans on Monday and 145 cans on Tuesday. How many cans is that? Answer: 383 cans. Mistakes it names: 373, 3713, 93.

### Step 2: Trade up
- [ ] It starts at 276: `see 2 hundreds, 7 tens, and 6 ones is 200 + 70 + 6 = 276.; see Add ones or tens until you have 10.; disabled Trade 10 ones for a ten; disabled Trade 10 tens for a hundred`
- [ ] 10 ones trade for a ten, same number: `click + 1 one ×4; see 10 ones! Trade them for 1 ten.; disabled + 1 one; click Trade 10 ones for a ten; see 2 hundreds, 8 tens, and 0 ones is 200 + 80 + 0 = 280.; see 10 ones became 1 ten. Same number, fewer blocks!`
- [ ] 10 tens trade for a hundred: `click + 1 ten ×3; see 10 tens! Trade them for 1 hundred.; disabled + 1 ten; click Trade 10 tens for a hundred; see 3 hundreds, 0 tens, and 6 ones is 300 + 0 + 6 = 306.; see 10 tens became 1 hundred.`
- [ ] Edge: 1 ten and 1 one say “ten” and “one”: `click + 1 ten ×3; click Trade 10 tens for a hundred; click + 1 ten; click + 1 one ×4; click Trade 10 ones for a ten; click + 1 one; see 3 hundreds, 2 tens, and 1 one is 300 + 20 + 1 = 321.`
- [ ] Start over: `click + 1 one ×2; click Start over; see = 276.`
- Quick check: What number do these blocks show? Answer: 335. Mistakes it names: 2135, 235.

### Step 3: Make a new hundred
- [ ] 11 tens make a new hundred: `click Put them together; see Hundreds: 2 + 1 = 3. Tens: 6 + 5 = 11. Ones: 3 + 2 = 5.; see 11 tens! Trade 10 tens for a new hundred.; click Make a new hundred; see Now there are 4 hundreds and 1 ten.; see 263 + 152 = 415; see 4 hundreds, 1 ten, 5 ones: 400 + 10 + 5`
- [ ] 381 + 145 = 526: `click 381 + 145; click Put them together; click Make a new hundred; see Now there are 5 hundreds and 2 tens.; see 381 + 145 = 526`
- [ ] Edge: a two-digit number: `click 574 + 62; click Put them together; see Hundreds: 5 + 0 = 5. Tens: 7 + 6 = 13.; click Make a new hundred; see 574 + 62 = 636`
- Quick check: A zoo had 372 visitors in the morning and 145 visitors in the afternoon. How many visitors is that? Answer: 517 visitors. Mistakes it names: 417, 4117, 227.

## Chapter 4: Add three-digit numbers · `learn/add.html` · Lessons 9–10

### Step 1: A new ten and a new hundred
- [ ] A new ten, then a new hundred: 367 + 258: `click Put them together; see 15 ones!; click Make a new ten; see Now there are 12 tens and 5 ones.; see 12 tens! Trade 10 tens for a new hundred.; click Make a new hundred; see Now there are 6 hundreds and 2 tens.; see 367 + 258 = 625`
- [ ] 178 + 145 = 323: `click 178 + 145; click Put them together; click Make a new ten; click Make a new hundred; see 178 + 145 = 323; see 3 hundreds, 2 tens, 3 ones`
- [ ] 459 + 376 = 835: `click 459 + 376; click Put them together; click Make a new ten; click Make a new hundred; see 459 + 376 = 835`
- [ ] Start over after the last step: `click Put them together; click Make a new ten; click Make a new hundred; click Start over; see Big squares are hundreds`
- Quick check: Which one makes a new ten and a new hundred? Answer: “365 + 247”. Mistakes it names: “365 + 224”, “365 + 182”.

### Step 2: Add your way
- [ ] It starts with making a hundred: `see 298 is close to 300.; see Now tap another way.`
- [ ] After every way, they all agree: `click By place; see 300 + 120 + 13 = 433; click Blocks; see make a new hundred.; see Every way gets 298 + 135 = 433.`
- [ ] Edge: two of three ways isn’t all of them: `click By place; click Make a hundred; see Now tap another way.`
- Quick check: What is 199 + 346? Hint: 199 is 1 away from 200. Answer: 545. Mistakes it names: 546, 147, 445.

## Chapter 5: Subtract three-digit numbers · `learn/subtract.html` · Lessons 12–16

### Step 1: Break a ten
- [ ] It asks if there are enough ones: `see Take away 128: 1 hundred, 2 tens, and 8 ones.; see Are there enough ones to take away?`
- [ ] Edge: not enough ones says to break a ten: `click Take away ones; see Only 2 ones, and you need to take away 8. Break a ten first.`
- [ ] Break a ten, then take away: 352 − 128 = 224: `click Break a ten; see 352 is now 3 hundreds, 4 tens, and 12 ones. The green ones came from a broken ten.; disabled Break a ten; click Take away ones; click Take away tens; click Take away hundreds; see 352 − 128 = 224.; see 2 hundreds, 2 tens, and 4 ones are left.`
- [ ] Edge: 0 ones: 690 − 315: `click 690 − 315; click Take away ones; see Only 0 ones, and you need to take away 5.; click Break a ten; see 690 is now 6 hundreds, 8 tens, and 10 ones.; click Take away ones; click Take away tens; click Take away hundreds; see 690 − 315 = 375.`
- [ ] 574 − 249 = 325: `click 574 − 249; click Break a ten; click Take away ones; click Take away tens; click Take away hundreds; see 574 − 249 = 325.`
- [ ] Start over: `click Break a ten; click Start over; enabled Break a ten; see Are there enough ones`
- Quick check: A school has 463 students. 238 students ride the bus. How many students don’t ride the bus? Answer: 225 students. Mistakes it names: 235, 701.

### Step 2: Break a hundred
- [ ] It asks if there are enough tens: `see Take away 253: 2 hundreds, 5 tens, and 3 ones.; see Are there enough tens to take away?`
- [ ] Edge: not enough tens says to break a hundred: `click Take away tens; see Only 2 tens, and you need to take away 5. Break a hundred first.`
- [ ] Break a hundred, then take away: 527 − 253 = 274: `click Break a hundred; see 527 is now 4 hundreds, 12 tens, and 7 ones. The green tens came from a broken hundred.; click Take away ones; click Take away tens; click Take away hundreds; see 527 − 253 = 274.; see 2 hundreds, 7 tens, and 4 ones are left.`
- [ ] Edge: 1 ten says “ten”: `click 416 − 182; click Take away tens; see Only 1 ten, and you need to take away 8.; click Break a hundred; see 416 is now 3 hundreds, 11 tens, and 6 ones.`
- [ ] Edge: after taking away tens, you can’t break a hundred: `click Break a hundred; click Take away tens; disabled Break a hundred`
- [ ] 635 − 271 = 364: `click 635 − 271; click Break a hundred; click Take away ones; click Take away tens; click Take away hundreds; see 635 − 271 = 364.`
- Quick check: A party store had 436 balloons. It sold 172 balloons. How many balloons are left? Answer: 264 balloons. Mistakes it names: 344, 364, 608.

### Step 3: Think before you subtract
- [ ] It asks you to look before you subtract: `see Look at each place. Will you need to break a ten? A hundred?`
- [ ] 645 − 328 needs a ten: `click Show me; see so break a ten.; see 645 − 328 = 317`
- [ ] 645 − 382 needs a hundred: `click 645 − 382; click Show me; see so break a hundred.; see 645 − 382 = 263`
- [ ] Edge: nothing to break: `click 645 − 321; click Show me; see Nothing to break!; see 645 − 321 = 324`
- [ ] Edge: close numbers, count on: `click 503 − 498; click Show me; see Count on instead: 498 + 2 = 500, and 3 more is 503.; see 503 − 498 = 5`
- [ ] Edge: another problem hides the answer: `click Show me; click 645 − 382; see Look at each place.; nosee 645 − 382 =`
- Quick check: Which one needs you to break a hundred? Answer: “734 − 291”. Mistakes it names: “734 − 218”, “734 − 212”.

### Step 4: Break a ten and a hundred
- [ ] It says to check the ones first: `see Check the ones first, then the tens.`
- [ ] 432 − 158: break a ten and a hundred: `click Break a ten; see 432 is now 4 hundreds, 2 tens, and 12 ones.; click Take away tens; see Only 2 tens, and you need to take away 5. Break a hundred first.; click Break a hundred; see 432 is now 3 hundreds, 12 tens, and 12 ones. The green tens came from a broken hundred, and the green ones from a broken ten.; click Take away ones; click Take away tens; click Take away hundreds; see 432 − 158 = 274.`
- [ ] Edge: 400 has no tens to break: `click 400 − 125; click Break a ten; see There are no tens to break. Break a hundred first.; click Take away ones; see Only 0 ones, and you need to take away 5. There are no tens to break.`
- [ ] Edge: 400 − 125: a hundred, then a ten: `click 400 − 125; click Break a hundred; see 400 is now 3 hundreds, 10 tens, and 0 ones.; click Break a ten; see 400 is now 3 hundreds, 9 tens, and 10 ones.; click Take away ones; click Take away tens; click Take away hundreds; see 400 − 125 = 275.; see 2 hundreds, 7 tens, and 5 ones are left.`
- [ ] 523 − 268 = 255: `click 523 − 268; click Break a ten; click Break a hundred; click Take away ones; click Take away tens; click Take away hundreds; see 523 − 268 = 255.`
- Quick check: What do you need to break to find 423 − 167? Answer: “A ten and a hundred”. Mistakes it names: “Just a ten”, “Nothing”.
