# Checklist: Learn Relating Multiplication to Division (Grade 3 Unit 4)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–21. Not covered: Lesson 22 (School Community Garden), optional. Facts stay within 10 × 10, and division has no remainders.

## Chapter 1: What is division? · `learn/what-is-division.html` · Lessons 1–2

### Step 1: How many groups?
- [ ] It starts with 12 counters and no groups: `pressed 12 counters; see Make groups of 4 from 12 counters.; count .plate = 0; count .ctr = 12`
- [ ] One group: `click Make a group; see 1 group of 4. 8 left.; count .plate = 1`
- [ ] Groups of 4 use them all: `click Make a group ×3; see 12 in groups of 4 make 3 groups. 12 ÷ 4 = 3.; disabled Make a group; count .plate = 3`
- [ ] Edge: groups of 5 leave some over: `click In each group: one more; click Make a group ×2; see Only 2 left: not enough for another group of 5.; disabled Make a group`
- [ ] Edge: a group has 2 to 6: `click In each group: one less ×5; see Make groups of 2 from 12; click In each group: one more ×9; see Make groups of 6 from 12`
- [ ] Changing the size starts over: `click Make a group; click In each group: one more; count .plate = 0; see Make groups of 5`
- [ ] Another pile starts over: `click Make a group; click 20 counters; see Make groups of 4 from 20 counters.; count .plate = 0; count .ctr = 20`
- [ ] Start over: `click Make a group ×2; click Start over; count .plate = 0; enabled Make a group`
- Quick check: There are 18 toy cars. Each box holds 6 cars. How many boxes do the cars fill? Answer: 3 boxes. Mistakes it names: 12, 6.

### Step 2: How many in each group?
- [ ] It starts with 3 empty groups: `pressed 12 into 3 groups; see Share 12 counters into 3 groups.; count .plate = 3; count .ctr = 12`
- [ ] One to each: `click Deal one to each; see Each group has 1. 9 left.`
- [ ] Dealt out, each group gets 4: `click Deal one to each ×4; see Each group gets 4. 12 ÷ 3 = 4.; disabled Deal one to each`
- [ ] Edge: 15 into 5 groups takes 3 deals: `click 15 into 5 groups; click Deal one to each ×3; see 15 ÷ 5 = 3.; disabled Deal one to each; count .plate = 5`
- [ ] Start over: `click Deal one to each ×2; click Start over; see Share 12 counters; enabled Deal one to each`
- [ ] Another problem starts over: `click Deal one to each; click 20 into 4 groups; see Share 20 counters into 4 groups.; count .plate = 4`
- Quick check: Han shares 20 stickers equally among 4 friends. How many stickers does each friend get? Answer: 5 stickers. Mistakes it names: 16, 4.

## Chapter 2: Division expressions · `learn/division-expressions.html` · Lessons 3–5

### Step 1: Two ways to read ÷
- [ ] It starts with 12 ÷ 3 as 3 equal groups: `pressed 12 ÷ 3; pressed 3 equal groups; see 12 shared into 3 equal groups: each group has 4.; count .plate = 3`
- [ ] Read as groups of 3: `click Groups of 3; see 12 in groups of 3: there are 4 groups.; see Either way, 12 ÷ 3 = 4.; count .plate = 4`
- [ ] Another expression keeps the reading: `click Groups of 3; click 20 ÷ 4; pressed Groups of 4; see 20 in groups of 4: there are 5 groups.; count .plate = 5`
- [ ] Edge: 18 ÷ 6 as 6 groups of 3: `click 18 ÷ 6; click 6 equal groups; see each group has 3.; count .plate = 6; count .ctr = 18`
- Quick check: Diego puts 24 blocks into towers of 6. Diego writes 24 ÷ 6 = 4. What does the 4 stand for? Answer: “The number of towers”. Mistakes it names: “The blocks in each tower”, “All the blocks”.

### Step 2: Write a division expression
- [ ] It starts with nothing picked: `pressed Story 1; see Lin has 24 stickers; see ? ÷ ?; see Pick the number to start with`
- [ ] The total divided by the group size: `click Start with 24; click ÷ 6; see 24 ÷ 6 = 4 pages.`
- [ ] Turned around, it says to start with the total: `click Start with 6; click ÷ 24; see Start with all the stickers: 24.`
- [ ] Edge: the same number twice: `click Start with 24; click ÷ 24; see 24 ÷ 24 splits 24 into groups of 24.`
- [ ] Another story clears the picks: `click Start with 24; click Story 2; see ? ÷ ?; see 35 crayons are shared`
- [ ] The last story: `click Story 3; click Start with 32; click ÷ 8; see 32 ÷ 8 = 4 trucks.`
- Quick check: Jada has 30 stickers. Jada puts 5 stickers on each page. Which expression shows how many pages Jada fills? Answer: “30 ÷ 5”. Mistakes it names: “5 ÷ 30”, “30 − 5”.

## Chapter 3: Division and unknown factors · `learn/unknown-factor.html` · Lessons 6–7

### Step 1: Find the missing factor
- [ ] It starts with 1 in each row: `pressed 4 × ? = 28; see 4 rows of 1: 4 × 1 = 4. Not 28 yet.; count .ctr = 4`
- [ ] 7 in each row makes 28: `click In each row: one more ×6; see 4 × 7 = 28, so the missing factor is 7. That’s 28 ÷ 4 = 7.; count .ctr = 28`
- [ ] Edge: too many: `click In each row: one more ×7; see That’s more than 28. Put fewer in each row.`
- [ ] Edge: 1 to 10 in each row: `click In each row: one less; see 4 rows of 1:; click In each row: one more ×12; see 4 rows of 10:`
- [ ] Another equation starts over: `click In each row: one more ×3; click 6 × ? = 30; see 6 rows of 1:; click In each row: one more ×4; see 6 × 5 = 30, so the missing factor is 5.`
- Quick check: What number makes this true? 5 × ? = 35 Answer: 7. Mistakes it names: 30, 8.

### Step 2: Fact families
- [ ] It starts with 3 rows of 5 and its four facts: `see 3 × 5 = 15 and 5 × 3 = 15.; see 15 ÷ 3 = 5 and 15 ÷ 5 = 3.; see One array, four facts: a family.; count .ctr = 15`
- [ ] Another row: `click Rows: one more; see 4 × 5 = 20 and 5 × 4 = 20.; see 20 ÷ 4 = 5 and 20 ÷ 5 = 4.; count .ctr = 20`
- [ ] Edge: the same factors make only two facts: `click Rows: one more ×2; see 5 × 5 = 25 and 25 ÷ 5 = 5.; see the family has only these two facts.`
- [ ] Edge: factors stay 2 to 9: `click Rows: one less ×3; see 2 × 5 = 10; click In each row: one more ×6; see 2 × 9 = 18`
- Quick check: 6 × 8 = 48. Which division equation is also true? Answer: “48 ÷ 8 = 6”. Mistakes it names: “8 ÷ 6 = 48”, “48 ÷ 6 = 6”.

## Chapter 4: Use products you know · `learn/products-and-patterns.html` · Lessons 8–9

### Step 1: Divide with a product you know
- [ ] It starts with no hops: `pressed 42 ÷ 6; see Count by 6s to 42. How many hops?; count .hop = 0`
- [ ] Two hops: `click Hop ×2; see 6, 12: 2 hops of 6.; count .hop = 2`
- [ ] Seven hops land on 42: `click Hop ×7; see 7 hops of 6 land on 42: 7 × 6 = 42. So 42 ÷ 6 = 7.; disabled Hop; count .hop = 7`
- [ ] Another division: `click 36 ÷ 4; click Hop ×9; see So 36 ÷ 4 = 9.; count .hop = 9`
- [ ] Start over: `click Hop ×3; click Start over; count .hop = 0; enabled Hop`
- Quick check: 8 × 7 = 56. Use it to find 56 ÷ 8. Answer: 7. Mistakes it names: 8, 48.

### Step 2: Patterns in the multiplication table
- [ ] It starts on turnarounds, nothing tapped: `pressed Turnarounds; see Tap a square in the table.; count .hc.a = 0`
- [ ] A square and its turnaround light up: `tap [data-v="3-8"]; see 3 × 8 = 24, and its turnaround 8 × 3 = 24 too.; count .hc.a = 1; count .hc.b = 1`
- [ ] Edge: a square on the diagonal is its own turnaround: `tap [data-v="6-6"]; see It’s on the diagonal, so it’s its own turnaround.; count .hc.b = 0`
- [ ] Odd products: `click Odd and even; see The odd products are blue.; count .hc.b = 25`
- [ ] A tapped product says odd or even: `click Odd and even; tap [data-v="3-7"]; see 3 × 7 = 21, odd.; tap [data-v="4-7"]; see 4 × 7 = 28, even.`
- [ ] Doubles: `click Doubles; tap [data-v="3-7"]; see Double it: 6 × 7 = 42, since 21 + 21 = 42.; count .hc.b = 1`
- [ ] Edge: a row past 5 has no double in the table: `click Doubles; tap [data-v="8-4"]; see Tap a square in the rows of 1 to 5.; count .hc.b = 0`
- Quick check: Which product is odd? Answer: “5 × 7”. Mistakes it names: “4 × 7”, “5 × 6”.

## Chapter 5: Break apart rectangles · `learn/break-apart.html` · Lessons 10–11

### Step 1: Cut a rectangle in two
- [ ] It starts with 6 × 7 cut after 5: `pressed 6 × 7; see 6 × 7 = 6 × 5 + 6 × 2; see 6 × 5 = 30 and 6 × 2 = 12. 30 + 12 = 42.; see a cut after 5 is a good one; count .aprod = 2`
- [ ] Moving the cut keeps the total: `click Cut after: one less ×2; see 6 × 7 = 6 × 3 + 6 × 4; see 18 + 24 = 42.; nosee a good one`
- [ ] Edge: the cut stays inside the rectangle: `click Cut after: one less ×6; see 6 × 7 = 6 × 1 + 6 × 6; click Cut after: one more ×9; see 6 × 7 = 6 × 6 + 6 × 1`
- [ ] Another fact: `click 7 × 8; see 7 × 8 = 7 × 5 + 7 × 3; see 35 + 21 = 56.; click Cut after: one more ×5; see 7 × 8 = 7 × 7 + 7 × 1`
- Quick check: The rectangle is cut into two parts. What is the area of the whole rectangle? Answer: 56 square units. Mistakes it names: 35, 38.

### Step 2: Rectangles without a grid
- [ ] It starts with 8 × 7, breaking the 7: `pressed 8 × 7; pressed Break the 7; see 8 × 7 = 8 × 5 + 8 × 2; see 40 + 16 = 56, so 8 × 7 = 56.; count .agrid = 0`
- [ ] Breaking the other factor gives the same product: `click Break the 8; see 7 × 8 = 7 × 5 + 7 × 3; see 35 + 21 = 56, so 8 × 7 = 56.`
- [ ] Another fact keeps which factor is broken: `click Break the 8; click 9 × 6; pressed Break the 9; see 6 × 9 = 6 × 5 + 6 × 4; see 30 + 24 = 54`
- [ ] Edge: a part of 1: `click 9 × 6; click Break the 6; see 9 × 6 = 9 × 5 + 9 × 1; see 45 + 9 = 54`
- Quick check: What number is missing? 9 × 7 = 9 × 5 + 9 × ? Answer: 2. Mistakes it names: 7, 18.

## Chapter 6: Multiply multiples of ten · `learn/multiples-of-ten.html` · Lessons 12–13

### Step 1: Groups of tens
- [ ] It starts with 4 groups of 3 tens: `see 4 × 30 = 120; see 4 groups of 3 tens is 4 × 3 tens = 12 tens.; see 12 tens is 120.; count .rod = 12`
- [ ] One more ten in each: `click Tens in each: one more; see 4 × 40 = 160; count .rod = 16`
- [ ] Edge: one ten in each: `click Tens in each: one less ×4; see 4 × 10 = 40; see 4 groups of 1 ten; see 4 tens is 40.`
- [ ] Edge: the biggest is 9 × 90: `click Groups: one more ×7; see 9 × 30 = 270; click Tens in each: one more ×8; see 9 × 90 = 810; count .rod = 81`
- [ ] Edge: the fewest groups is 2: `click Groups: one less ×4; see 2 × 30 = 60`
- Quick check: What is 6 × 40? Answer: 240. Mistakes it names: 24, 46.

### Step 2: Equal groups problems
- [ ] It starts with the story: `pressed Marbles; see There are 5 bags with 20 marbles in each. How many marbles are there?; nosee tens`
- [ ] Count the tens: `click Next step; see 20 is 2 tens. 5 × 2 tens = 10 tens.`
- [ ] Then the total: `click Next step ×2; see 10 tens is 100. 5 × 20 = 100 marbles.; disabled Next step`
- [ ] Another story: `click Crayons; click Next step ×2; see 24 tens is 240. 8 × 30 = 240 crayons.`
- [ ] Start over: `click Next step; click Start over; nosee tens; enabled Next step`
- Quick check: There are 7 boxes with 30 crayons in each box. How many crayons are there? Answer: 210 crayons. Mistakes it names: 21, 37.

## Chapter 7: Multiply teen and larger numbers · `learn/larger-numbers.html` · Lessons 14–16

### Step 1: Groups of a teen number
- [ ] It starts with 4 groups of 13 in blocks: `pressed 4 × 13; see 4 groups of 13: each has 1 ten and 3 ones.; count .rod = 4; count .unit1 = 12`
- [ ] The tens: `click Next step; see The tens: 4 × 10 = 40.`
- [ ] Then the ones, then add: `click Next step ×3; see The ones: 4 × 3 = 12.; see 40 + 12 = 52, so 4 × 13 = 52.; disabled Next step`
- [ ] Another problem: `click 6 × 12; click Next step ×3; see 60 + 12 = 72, so 6 × 12 = 72.; count .rod = 6; count .unit1 = 12`
- [ ] Start over: `click Next step ×2; click Start over; nosee The tens; enabled Next step`
- Quick check: What is 5 × 14? Answer: 70. Mistakes it names: 54, 30.

### Step 2: Area diagrams for larger numbers
- [ ] It starts with an empty diagram: `pressed 3 × 24; see Break 24 into 20 and 4.; count .am = 2`
- [ ] One part: `click Next step; see 3 × 20 = 60.`
- [ ] Both parts, then add: `click Next step ×3; see 3 × 4 = 12.; see 60 + 12 = 72, so 3 × 24 = 72.; disabled Next step`
- [ ] Another problem: `click 2 × 37; click Next step ×3; see 60 + 14 = 74, so 2 × 37 = 74.`
- [ ] Start over: `click Next step; click Start over; nosee 3 × 20 = 60.; enabled Next step`
- Quick check: What is 4 × 23? Answer: 92. Mistakes it names: 83, 32.

## Chapter 8: Divide larger numbers · `learn/divide-larger.html` · Lessons 18–20

### Step 1: Share base-ten blocks
- [ ] It starts with all the blocks still to share: `pressed 48 ÷ 4; see Share 48 into 4 equal groups.; see Still to share; count .dgrp = 4; count .rod = 4; count .unit1 = 8`
- [ ] Share the tens: `click Next step; see Share the 4 tens: 1 ten in each group.`
- [ ] Then the ones: `click Next step ×2; see Share the 8 ones: 2 in each group.; see Each group has 1 ten and 2 ones: 48 ÷ 4 = 12.; disabled Next step; nosee Still to share`
- [ ] Edge: a ten left over is traded for ones: `click 52 ÷ 4; click Next step ×2; see Share the 5 tens: 1 ten in each group, and 1 ten left over.; see Trade the 1 ten left for 10 ones. Now there are 12 ones to share.; count .rod = 4; count .unit1 = 12`
- [ ] Edge: two tens traded: `click 75 ÷ 5; click Next step ×3; see Trade the 2 tens left for 20 ones.; see Each group has 1 ten and 5 ones: 75 ÷ 5 = 15.; count .unit1 = 25`
- [ ] Start over: `click Next step; click Start over; nosee Share the 4 tens; enabled Next step`
- Quick check: Share 72 blocks equally into 4 boxes. How many blocks go in each box? Answer: 18 blocks. Mistakes it names: 10, 4.

### Step 2: Break the number apart
- [ ] It starts with nothing picked: `pressed 72 ÷ 6; see Pick a way to break 72 apart.`
- [ ] Parts that divide evenly: `click 60 + 12; see 60 ÷ 6 = 10 and 12 ÷ 6 = 2.; see 10 + 2 = 12, so 72 ÷ 6 = 12.; count .aprod = 2`
- [ ] Edge: a part that doesn't divide evenly: `click 70 + 2; see 70 doesn’t split into 6 equal groups.; count .aprod = 0`
- [ ] Any parts that divide evenly work: `click 36 + 36; see 6 + 6 = 12, so 72 ÷ 6 = 12.`
- [ ] Another division clears the pick: `click 60 + 12; click 84 ÷ 4; see Pick a way to break 84 apart.; click 40 + 44; see 10 + 11 = 21`
- [ ] Edge: the second part doesn't divide: `click 65 ÷ 5; click 62 + 3; see 62 doesn’t split into 5 equal groups.`
- Quick check: Which is a way to find 56 ÷ 4? Answer: “40 ÷ 4 + 16 ÷ 4”. Mistakes it names: “40 ÷ 4 + 16”, “40 ÷ 2 + 16 ÷ 2”.

## Chapter 9: Solve problems with the four operations · `learn/four-operations.html` · Lessons 17 and 21

### Step 1: Two steps with × and ÷
- [ ] It starts with the story: `pressed Cars; see The workshop makes 3 boxes of 12 toy cars.; nosee Step 1`
- [ ] The first step: `click Next step; see Step 1: 3 × 12 = 36 cars in all.`
- [ ] The second step: `click Next step ×2; see Step 2: 36 ÷ 4 = 9.; see Each shop gets 9 cars.; disabled Next step`
- [ ] Edge: a story that divides first: `click Crayons; click Next step ×2; see Step 1: 48 ÷ 6 = 8 crayons in each box.; see 32 crayons are left.`
- [ ] Start over: `click Next step; click Start over; nosee Step 1; enabled Next step`
- Quick check: The workshop makes 4 boxes of 15 toy cars. It shares the cars equally among 3 shops. How many cars does each shop get? Answer: 20 cars. Mistakes it names: 60, 5.

### Step 2: Equations with a letter
- [ ] It starts with the first story: `pressed Story 1; see Lin has 6 bags of 8 marbles.; see Which equation matches the story?`
- [ ] The right equation: `click 6 × 8 − 10 = m; see That’s the one. 6 × 8 = 48, and 48 − 10 = 38. So m = 38.`
- [ ] A wrong one says why: `click 6 + 8 − 10 = m; see that’s 6 × 8, not 6 + 8.`
- [ ] Another story clears the pick: `click 6 × 8 − 10 = m; click Story 2; see Which equation matches the story?; click 40 ÷ 4 + 3 = b; see So b = 13.`
- [ ] The last story: `click Story 3; click 7 × 5 × 9 = t; see The shop sells 9 bears: subtract them.`
- Quick check: Kiran has 4 packs of 9 markers. Kiran gives 6 markers away. Which equation matches? The letter k stands for the markers Kiran has left. Answer: “4 × 9 − 6 = k”. Mistakes it names: “4 + 9 − 6 = k”, “4 × 9 + 6 = k”.
