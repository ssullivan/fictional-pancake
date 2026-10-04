# Checklist: Learn Multiplying and Dividing Multi-digit Numbers (Grade 4 Unit 6)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–24. Not covered: Lesson 25 (Paper Flower Decorations), optional. Multiplying up to 4 digits × 1 digit and 2 digits × 2 digits; dividing up to 4 digits ÷ 1 digit.

## Chapter 1: Patterns · `learn/patterns.html` · Lessons 1–4

### Step 1: Patterns that grow
- [ ] It starts at 3, adding 4, all odd: `see 3, 7, 11, 15, 19, 23, 27, 31, …; see every number is odd; see The 10th number is 3 + 9 × 4 = 39`
- [ ] Adding an odd number switches: `click Add: one less; see 3, 6, 9, 12; see the numbers go odd, even, odd, even`
- [ ] An even start stays even: `click Start at: one less; see 2, 6, 10; see every number is even`
- [ ] Edge: add stops at 9: `click Add: one more ×6; see 3, 12, 21`
- [ ] Edge: the start stops at 1 and at 9: `click Start at: one less ×3; see 1, 5, 9; click Start at: one more ×9; see 9, 13, 17`
- Quick check: The rule is “start at 3 and add 4.” Which number is in the pattern? Answer: “27”. Mistakes it names: “25”, “30”.

### Step 2: Patterns that repeat
- [ ] It starts at position 14 of circle, square, triangle: `see 14 = 4 × 3 + 2; see 4 whole repeats use 12 shapes, then position 14 is shape 2 of the repeat: a square.; count .ps = 12; count .ps.mk = 0`
- [ ] A position in the picture is outlined: `click Position: one less ×4; see 10 = 3 × 3 + 1; see a circle; count .ps.mk = 1`
- [ ] One repeat, singular: `click Position: one less ×9; see 1 whole repeat uses 3 shapes, then position 5 is shape 2`
- [ ] Edge: position stops at 1: `click Position: one less ×15; see 1 = 0 × 3 + 1; see Then position 1 is shape 1 of the repeat: a circle.`
- [ ] Edge: position stops at 40: `click Position: one more ×30; see 40 = 13 × 3 + 1`
- [ ] Other patterns: `click Circle, square; see 14 = 6 × 2 + 2; see a square; click Circle, square, square, triangle; see 14 = 3 × 4 + 2; see a square`
- Quick check: A string of beads goes red, blue, yellow, red, blue, yellow, … What color is the 14th bead? Answer: “Blue”. Mistakes it names: “Red”, “Yellow”.

## Chapter 2: Multiply by a one-digit number · `learn/multiply-one.html` · Lessons 5–7, 9

### Step 1: Multiply on an area diagram
- [ ] It starts with 6 × 23: `see 6 × 23 = 120 + 18 = 138; see 23 is 20 + 3. Multiply each part by 6, then add the partial products: 138.; count rect.am = 2`
- [ ] Three places: `click 236; see 6 × 236 = 1,200 + 180 + 36 = 1,416; count rect.am = 3`
- [ ] A zero is left out: `click 1,205; see 6 × 1,205 = 6,000 + 1,200 + 30 = 7,230; count rect.am = 3`
- [ ] Edge: times stops at 9 and 2: `click Times: one more ×4; see 9 × 23 = 180 + 27 = 207; click Times: one less ×9; see 2 × 23 = 40 + 6 = 46`
- Quick check: What is 6 × 34? Answer: 204. Mistakes it names: 184, 1824.

### Step 2: Record the partial products
- [ ] It starts with none written: `see 2,145 has 4 nonzero places: 2,000, 100, 40, 5. Tap + to write 3 × each one.`
- [ ] One partial product: `click Partial products: one more; see 3 × 2,000 = 6,000. 3 more to go.`
- [ ] Edge: all of them, and + stops there: `click Partial products: one more ×5; see All 4 partial products are written. Their sum is 6,435`
- [ ] A two-digit number has 2: `click 87 × 6; see 87 has 2 nonzero places; click Partial products: one more ×3; see Their sum is 522`
- [ ] Edge: a shorter product keeps the count inside it: `click Partial products: one more ×4; click 87 × 6; see All 2 partial products are written.`
- [ ] Edge: − stops at none: `click Partial products: one less; see 2,145 has 4 nonzero places`
- Quick check: What is 3 × 2,145? Answer: 6435. Mistakes it names: 6420, 2148.

## Chapter 3: Multiply two two-digit numbers · `learn/two-digit.html` · Lessons 8, 10

### Step 1: Four partial products
- [ ] It starts with 36 × 27, nothing filled in: `see 36 is 30 + 6 and 27 is 20 + 7, so there are 4 partial products.; count rect.am = 4`
- [ ] One piece: `click Partial products: one more; see 20 × 30 = 600.`
- [ ] Edge: all four, and + stops there: `click Partial products: one more ×5; see Add them: 600 + 120 + 210 + 42 = 972.`
- [ ] Another product starts over: `click Partial products: one more; click 18 × 16; see 18 is 10 + 8 and 16 is 10 + 6`
- [ ] 45 × 32: `click 45 × 32; click Partial products: one more ×4; see 30 × 40 = 1,200, 30 × 5 = 150, 2 × 40 = 80, 2 × 5 = 10. Add them: 1,200 + 150 + 80 + 10 = 1,440.`
- Quick check: What is 24 × 13? Answer: 312. Mistakes it names: 212, 37.

### Step 2: Record the four partial products
- [ ] It starts with nothing written: `see so there are 4 partial products`
- [ ] All four written and added: `click Partial products: one more ×4; see Add them: 600 + 120 + 210 + 42 = 972.`
- [ ] Back one: `click Partial products: one more ×4; click Partial products: one less; see 7 × 30 = 210.`
- [ ] 18 × 16: `click 18 × 16; click Partial products: one more ×4; see = 288`
- Quick check: Which partial products add up to 46 × 23? Answer: “800 + 120 + 120 + 18”. Mistakes it names: “800 + 18”, “80 + 12 + 12 + 18”.

## Chapter 4: The standard algorithm to multiply · `learn/standard.html` · Lessons 11–12

### Step 1: Multiply column by column
- [ ] It starts at the ones: `see Start with the ones: 7 × 6. Tap + to work each column.`
- [ ] The ones carry: `click Columns: one more; see 7 × 6 = 42. Write 2 and carry 4 to the tens column.`
- [ ] The tens add the carry: `click Columns: one more ×2; see 4 × 6 + 4 carried = 24 + 4 = 28. Write 8 and carry 2 to the hundreds column.`
- [ ] Edge: the last column writes it all, and + stops there: `click Columns: one more ×5; see 3 × 6 + 2 carried = 18 + 2 = 20. It’s the last column, so write all of 20. 347 × 6 = 2,082.`
- [ ] Nothing to carry: `click 1,205 × 4; click Columns: one more ×2; see 0 × 4 + 2 carried = 0 + 2 = 2. Write 2. Nothing to carry.`
- [ ] Four columns: `click 2,618 × 3; click Columns: one more ×4; see 2,618 × 3 = 7,854`
- Quick check: A theater has 3 sections with 245 seats in each. How many seats is that? Answer: 735 seats. Mistakes it names: 625, 248.

### Step 2: Choose a way
- [ ] It starts with the pencils on an area diagram: `see A school orders 6 boxes of 144 pencils. How many pencils is that?; see Every way gives 864 pencils.; count rect.am = 3`
- [ ] Partial products: `click Partial products; see Partial products write each piece’s product, then add.; see 864 pencils`
- [ ] The standard algorithm: `click Standard algorithm; see by carrying.; see 864 pencils`
- [ ] Another story keeps the way: `click Standard algorithm; click 9 × 125; see Every way gives 1,125 apples.; see by carrying.`
- Quick check: A theater has 24 rows with 18 seats in each row. How many seats is that? Answer: 432 seats. Mistakes it names: 232, 42.

## Chapter 5: Division situations · `learn/situations.html` · Lessons 13–15

### Step 1: How many groups, or how many in each?
- [ ] It starts sharing 24 into 3 bags: `see 24 ÷ 3 = 8; see Share 24 apples equally into 3 bags: 8 in each bag. Check: 3 × 8 = 24.; count .plate = 3`
- [ ] How many groups: `click How many groups?; see Put 24 apples into bags of 3: 8 bags.; count .plate = 8`
- [ ] A remainder: `click Number: one more ×2; see 24 ÷ 5 = 4 R 4; see 4 apples are left over, because 5 × 4 = 20.`
- [ ] Edge: the number stops at 6 and 2: `click Number: one more ×5; see 24 ÷ 6 = 4; click Number: one less ×6; see 24 ÷ 2 = 12`
- [ ] Another total: `click 12 apples; see 12 ÷ 3 = 4`
- Quick check: A teacher has 96 crayons. They come in boxes of 8. How many boxes is that? Answer: 12 boxes. Mistakes it names: 88, 768.

### Step 2: A missing side from the area
- [ ] It starts with 84 square meters, 7 wide: `see 7 × ? = 84, so ? = 84 ÷ 7 = 12; see so the garden is 12 meters long.`
- [ ] Another width: `click 4 m wide; see 84 ÷ 4 = 21`
- [ ] Edge: a width that doesn't fit the new area moves to the nearest one that does: `click 96 sq m; see 96 ÷ 6 = 16`
- [ ] Edge: a width that fits stays: `click 4 m wide; click 120 sq m; see 120 ÷ 4 = 30`
- [ ] A long garden: `click 120 sq m; click 10 m wide; see 120 ÷ 10 = 12`
- Quick check: A garden has an area of 96 square meters. It is 8 meters wide. How long is it? Answer: 12 meters. Mistakes it names: 88, 768.

## Chapter 6: Divide with base-ten blocks and partial quotients · `learn/divide.html` · Lessons 16–18

### Step 1: Share base-ten blocks
- [ ] It starts with 72 in blocks: `see 72 is 7 tens, 2 ones. Share them into 3 equal groups, starting with the biggest blocks.; count .dgrp = 0`
- [ ] Shared, with a trade: `click Shared; see 7 tens: 2 in each group, 1 left to trade for 10 ones.; see 12 ones (10 of them traded in): 4 in each group.; see 72 ÷ 3 = 24; count .dgrp = 3`
- [ ] One hundred, singular, traded for tens: `click 146 ÷ 2; see 146 is 1 hundred, 4 tens, 6 ones.; click Shared; see 1 hundred: 0 in each group, 1 left to trade for 10 tens.; see 14 tens (10 of them traded in): 7 in each group.`
- [ ] No trades: `click 69 ÷ 3; click Shared; see 6 tens: 2 in each group. 9 ones: 3 in each group.`
- [ ] Back to before: `click Shared; click Before sharing; count .dgrp = 0`
- Quick check: Share 72 stickers equally among 3 friends. How many stickers does each friend get? Answer: 24 stickers. Mistakes it names: 21, 69.

### Step 2: Partial quotients
- [ ] It starts with 568 ÷ 4: `see How many groups of 4 are in 568? Take away big, easy chunks first, like 100 groups of 4.`
- [ ] One chunk: `click Chunks: one more; see 100 groups of 4 is 100 × 4 = 400. 168 left.`
- [ ] Edge: all the chunks, and + stops there: `click Chunks: one more ×4; see Nothing left to share, so add the chunks: 100 + 40 + 2 = 142.`
- [ ] Two chunks: `click 345 ÷ 5; click Chunks: one more ×3; see 60 + 9 = 69`
- [ ] Another division starts over: `click Chunks: one more; click 928 ÷ 8; see How many groups of 8 are in 928?; click Chunks: one more ×2; see 10 groups of 8 is 10 × 8 = 80. 48 left.`
- Quick check: A farmer packs 252 eggs into cartons of 6. How many cartons is that? Answer: 42 cartons. Mistakes it names: 1512, 246.

## Chapter 7: Remainders · `learn/remainders.html` · Lessons 19–20

### Step 1: What’s left over
- [ ] It starts with 29 cards for 4 friends: `see 29 ÷ 4 = 7 R 1; see 1 card is left over: the remainder.; count .dgrp = 5`
- [ ] None left over: `click Cards: one less; see 28 ÷ 4 = 7; see none left over; count .dgrp = 4`
- [ ] More friends: `click 6 friends; see 29 ÷ 6 = 4 R 5; see 5 cards are left over`
- [ ] Edge: cards stop at 40 and 20: `click Cards: one more ×12; see 40 ÷ 4 = 10; click Cards: one less ×21; see 20 ÷ 4 = 5`
- Quick check: 50 students make teams of 6. How many full teams can they make? Answer: 8 teams. Mistakes it names: 9, 2.

### Step 2: What the remainder means
- [ ] It starts with vans, rounding up: `see 50 students ride in vans that hold 6 each.; see round up to 9; see Answer: 9 vans.`
- [ ] Teams drop the remainder: `click Teams; see the answer is the quotient, 8; see Answer: 8 teams.`
- [ ] The remainder is the answer: `click Left over; see the answer is the remainder, 2; see Answer: 2 stickers.`
- Quick check: A van holds 7 students. 31 students go on a field trip. How many vans do they need? Answer: “5 vans”. Mistakes it names: “4 vans”, “3 vans”.

## Chapter 8: Solve and check · `learn/solve.html` · Lessons 21–24

### Step 1: Is the answer reasonable?
- [ ] It starts with a claim and no pick: `see Someone says 48 × 21 = 1,808. Round to friendly numbers and estimate. Is it reasonable?`
- [ ] Not reasonable, picked right: `click Not reasonable; see Yes! Estimate: 50 × 20 = 1,000.; see The right answer is 1,008.`
- [ ] A wrong pick says so: `click Reasonable; see Not quite.`
- [ ] A reasonable claim: `click 396 ÷ 4 = 99; see Someone says 396 ÷ 4 = 99.; click Reasonable; see Yes! Estimate: 400 ÷ 4 = 100.; see It’s right: 99.`
- [ ] Another claim clears the pick: `click Reasonable; click 6 × 512 = 3,072; see Is it reasonable?`
- Quick check: Jada says 52 × 19 = 2,988. Is that reasonable? Answer: “No: 50 × 20 is about 1,000”. Mistakes it names: “Yes: it has 4 digits”, “Yes: 52 + 19 is about 70”.

### Step 2: Problems with more than one step
- [ ] It starts with the pencils: `see A school buys 6 boxes of 144 pencils; see What do you need to find first? Tap + to work the first step.`
- [ ] The first step: `click Steps: one more; see Step 1: 6 × 144 = 864 pencils bought.`
- [ ] Edge: both steps and the answer, and + stops there: `click Steps: one more ×3; see Step 2: 864 − 250 = 614 pencils left.; see Answer: 614 pencils left.`
- [ ] Muffins divide: `click Muffins; click Steps: one more ×2; see Answer: 24 boxes.`
- [ ] Another story starts over: `click Steps: one more; click Tickets; see What do you need to find first?`
- Quick check: A store has 5 boxes of 120 pencils. It sells 275 pencils. How many pencils are left? Answer: 325 pencils. Mistakes it names: 600, 875.
