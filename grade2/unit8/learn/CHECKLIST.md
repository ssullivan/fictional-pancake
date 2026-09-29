# Checklist: Learn Equal Groups (Grade 2 Unit 8)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

Not covered: Patterns with Even and Odd Numbers (Lesson 5) and the Center Days (Lessons 6 and 13) are optional lessons that work better in class. There’s no practice game for this unit yet.

## Chapter 1: Share and make pairs · `learn/share-and-pair.html` · Lessons 1–2

### Step 1: Share fairly
- [ ] It starts with 12 counters to share: `see 12 counters to share fairly: Mai and Diego get the same number.; see Tap Give 1 to each.`
- [ ] Giving 1 to each: `click Give 1 to each; see Mai has 1. Diego has 1. 10 left to share.`
- [ ] 12 shares fairly: `click Share them all; see Mai and Diego each get 6, with none left over.; see 12 can be shared fairly.; disabled Give 1 to each; disabled Share them all`
- [ ] Edge: 13 leaves 1 over: `click Counters: one more; click Share them all; see each get 6, and 1 is left over.; see That 1 can’t be shared fairly.`
- [ ] Edge: one at a time until they’re all shared: `click Give 1 to each ×6; see each get 6, with none left over.; disabled Give 1 to each`
- [ ] Edge: 2 counters is the least: `click Counters: one less ×12; see 2 counters to share; click Give 1 to each; see Mai and Diego each get 1, with none left over.`
- [ ] Edge: changing the counters starts over: `click Give 1 to each ×2; click Counters: one more; see 13 counters to share fairly; enabled Give 1 to each`
- [ ] Start over: `click Share them all; click Start over; see 12 counters to share fairly; enabled Share them all`
- Quick check: Lin and Han share 14 crackers fairly. How many crackers does each one get? Answer: 7 crackers. Mistakes it names: 14, 28, 6, 8.

### Step 2: Partners make pairs
- [ ] It asks if every counter has a partner: `see 9 counters. Does every counter have a partner?`
- [ ] 9 is 4 pairs and 1 more: `click Make pairs; see 4 pairs and 1 more.; see 1 counter has no partner.; see Mix them up`
- [ ] 10 is 5 pairs: `click Counters: one more; click Make pairs; see 5 pairs.; see Every counter has a partner.`
- [ ] Edge: 2 counters are 1 pair: `click Counters: one less ×7; click Make pairs; see 1 pair.; see Every counter has a partner.`
- [ ] Edge: 1 counter has no partner: `click Counters: one less ×9; click Make pairs; see 1 counter has no partner.`
- [ ] Edge: changing the counters mixes them up: `click Make pairs; click Counters: one more; see Does every counter have a partner?; see Make pairs`
- Quick check: 11 students line up with a partner. Does every student have a partner? Answer: “No, 1 student has no partner.”. Mistakes it names: “Yes, every student has a partner.”, “No, 2 students have no partner.”.

## Chapter 2: Odd and even · `learn/odd-and-even.html` · Lessons 3–4

### Step 1: Odd or even?
- [ ] It asks you to tap a number: `see Tap a number to put it in pairs.`
- [ ] 7 is odd: `click 7; see 7 is odd. 3 pairs and 1 left over.; pressed 7; see Tap more numbers.`
- [ ] 8 is even: `click 8; see 8 is even. 4 pairs, none left over.`
- [ ] After 5 numbers, the pattern: `click 1; click 2; click 3; click 4; click 5; see Even numbers are gold. Odd numbers are blue.; count .nums .ev = 2; count .nums .od = 3`
- [ ] Edge: the same number 5 times is just 1 number: `click 4 ×5; see Tap more numbers.`
- [ ] Edge: 20 is 10 pairs: `click 20; see 20 is even. 10 pairs, none left over.`
- [ ] Edge: 1: `click 1; see 1 is odd. 0 pairs and 1 left over.`
- Quick check: Which number is even? Answer: “16”. Mistakes it names: “9”, “15”, “11”.

### Step 2: Count by 2s
- [ ] It starts at 0: `see You say 0; see Tap Hop 2.`
- [ ] From 0, the even numbers: `click Hop 2 ×3; see You say 0, 2, 4, 6; see From 0, you land on the even numbers.`
- [ ] From 1, the odd numbers: `click Start at 1; click Hop 2 ×3; see You say 1, 3, 5, 7; see From 1, you land on the odd numbers`
- [ ] Edge: from 0, it stops at 20: `click Hop 2 ×10; see 16, 18, 20; disabled Hop 2`
- [ ] Edge: from 1, it stops at 19: `click Start at 1; click Hop 2 ×9; see 15, 17, 19; disabled Hop 2`
- [ ] Start over: `click Hop 2 ×2; click Start over; see You say 0; enabled Hop 2`
- Quick check: Han counts by 2s, starting at 0. Which number will Han say? Answer: “18”. Mistakes it names: “15”, “9”.

### Step 3: Make two equal trains
- [ ] It starts not fair: `see 12 + 4 = 16. Not fair yet!`
- [ ] 16 makes two equal trains: `click Move 1 down ↓ ×4; see 8 + 8 = 16. Two equal trains!; see 16 is even.`
- [ ] 11 is as close as it gets: `click 11 cubes; click Move 1 down ↓ ×2; see 6 + 5 = 11. That’s as close as it gets: 5 + 5 + 1.; see 11 is odd.`
- [ ] Edge: one past the middle is still as close as it gets: `click 9 cubes; click Move 1 down ↓ ×3; see 4 + 5 = 9. That’s as close as it gets: 4 + 4 + 1.`
- [ ] Moving cubes up: 14: `click 14 cubes; click Move 1 up ↑ ×4; see 7 + 7 = 14. Two equal trains!`
- [ ] Edge: an empty train: `click 13 cubes; click Move 1 down ↓ ×2; see 0 + 13 = 13. Not fair yet!; disabled Move 1 down ↓`
- [ ] 20 cubes: `click 20 cubes; click Move 1 down ↓ ×4; see 10 + 10 = 20. Two equal trains!`
- Quick check: Elena breaks this train of 16 cubes into 2 trains that are the same length. How many cubes are in each train? Answer: 8 cubes. Mistakes it names: 16, 32, 7, 9.

### Step 4: A double and 1 more
- [ ] 14 is a double: `see 14 = 7 + 7; see Two equal addends, so 14 is even.`
- [ ] 15 is a double and 1 more: `click Number: one more; see 15 = 7 + 7 + 1; see A double and 1 more, so 15 is odd.`
- [ ] Edge: 2 is the least: `click Number: one less ×15; see 2 = 1 + 1`
- [ ] Edge: 3: `click Number: one less ×11; see 3 = 1 + 1 + 1`
- [ ] Edge: 20 is the most: `click Number: one more ×9; see 20 = 10 + 10`
- Quick check: Which one shows 11 as a double and 1 more? Answer: “11 = 5 + 5 + 1”. Mistakes it names: “11 = 6 + 6”, “11 = 10 + 1”.

## Chapter 3: Arrays · `learn/arrays.html` · Lessons 7–8

### Step 1: What is an array?
- [ ] 3 rows of 4 is 12: `see 3 rows of 4: 4 in each row.; see 4 columns of 3: 3 in each column. 12 in all.; count .ctr = 12`
- [ ] Edge: 1 row says “row”: `click Rows: one less ×2; see 1 row of 4; see 4 columns of 1: 1 in each column. 4 in all.`
- [ ] Edge: 1 row of 1: `click Rows: one less ×3; click Columns: one less ×4; see 1 row of 1: 1 in each row.; see 1 column of 1`
- [ ] Edge: 5 rows of 5 is the most: `click Rows: one more ×3; click Columns: one more ×2; see 5 rows of 5; see 25 in all.; count .ctr = 25`
- Quick check: Which picture is an array? Answer: “(picture)”. Mistakes it names: “(picture)”, “(picture)”.

### Step 2: Rows and columns
- [ ] It asks you to tap a counter: `see 3 rows of 4. Tap any counter.`
- [ ] A counter’s row and column: `tap [data-i="6"]; see This counter is in row 2 and column 3.; see Its row goes across and has 4. Its column goes up and down and has 3.`
- [ ] Edge: the last counter of 5 rows of 5: `click 5 rows of 5; tap [data-i="24"]; see row 5 and column 5.`
- [ ] Edge: the first counter: `tap [data-i="0"]; see row 1 and column 1.`
- [ ] Edge: another array clears the counter: `tap [data-i="0"]; click 2 rows of 5; see 2 rows of 5. Tap any counter.`
- Quick check: How many rows are in this array? Answer: 4. Mistakes it names: 3, 12, 7.

### Step 3: Count by rows or columns
- [ ] It asks how to count: `see 3 rows of 5. Count them by rows or by columns.`
- [ ] By rows: 5, 10, 15: `click Count a row ×3; see Count by rows: 5, 10, 15; see 15 in all: 3 rows of 5.`
- [ ] By columns: 3, 6, 9, 12, 15: `click Count a column ×5; see Count by columns: 3, 6, 9, 12, 15; see 15 in all: 5 columns of 3.`
- [ ] Edge: switching from rows to columns starts the count over: `click Count a row ×2; click Count a column; see Count by columns: 3; see Each column has 3. Tap Count a column again.`
- [ ] Edge: after the last row, it starts over: `click Count a row ×4; see Count by rows: 5; nosee 15 in all`
- [ ] 4 rows of 2 by columns: `click 4 rows of 2; click Count a column ×2; see 8 in all: 2 columns of 4.`
- Quick check: How many counters are in each column? Answer: 2. Mistakes it names: 5, 10.

## Chapter 4: Equal addends · `learn/equal-addends.html` · Lessons 9–10

### Step 1: Add the rows
- [ ] 3 rows of 4: 4 + 4 + 4 = 12: `see 4 + 4 + 4 = 12; see 3 rows of 4. Each row is one addend.`
- [ ] More rows, more addends: `click Rows: one more ×2; see 4 + 4 + 4 + 4 + 4 = 20`
- [ ] Edge: 2 rows of 2 is the least: `click Rows: one less ×3; click Columns: one less ×4; see 2 + 2 = 4`
- [ ] Edge: 5 rows of 5 is the most: `click Rows: one more ×4; click Columns: one more ×3; see 5 + 5 + 5 + 5 + 5 = 25`
- Quick check: Each row has 5 counters. How many counters are there in all? Answer: 15. Mistakes it names: 8, 10, 20.

### Step 2: By rows or by columns
- [ ] By rows: `see 4 + 4 + 4 = 12; pressed Add the rows`
- [ ] By columns, and both give the same total: `click Add the columns; see 3 + 3 + 3 + 3 = 12; see 4 columns of 3. Each column is one addend.; see By rows or by columns, it’s 12 in all.`
- [ ] Edge: a square array: `click Columns: one less; click Add the columns; see 3 + 3 + 3 = 9`
- Quick check: Which equation does not match this array? Answer: “2 + 4 = 6”. Mistakes it names: “4 + 4 = 8”, “2 + 2 + 2 + 2 = 8”.

### Step 3: Build an array
- [ ] It asks for an array for 3 + 3 + 3 + 3: `see Your array: 2 rows of 2. Make one that shows 3 + 3 + 3 + 3.; see Each 3 is one row. How many 3s are there?`
- [ ] 4 rows of 3: `click Rows: one more ×2; click Columns: one more; see Yes! 4 rows of 3: 3 + 3 + 3 + 3 = 12.`
- [ ] Edge: 4 columns of 3 works too: `click Rows: one more; click Columns: one more ×2; see Yes! 4 columns of 3: 3 + 3 + 3 + 3 = 12.; see Columns work too.`
- [ ] 5 + 5: `click 5 + 5; click Columns: one more ×3; see Yes! 2 rows of 5: 5 + 5 = 10.`
- [ ] Edge: 1 row says “row”: `click Rows: one less; see Your array: 1 row of 2.`
- [ ] 2 + 2 + 2 + 2 + 2: `click 2 + 2 + 2 + 2 + 2; click Rows: one more ×3; see Yes! 5 rows of 2: 2 + 2 + 2 + 2 + 2 = 10.`
- Quick check: Priya sets up chairs in 4 rows, with 5 chairs in each row. How many chairs is that? Answer: 20 chairs. Mistakes it names: 9, 15, 16.

## Chapter 5: Rectangles and squares · `learn/rectangles.html` · Lessons 11–12

### Step 1: Arrays make rectangles
- [ ] 12 tiles with gaps: `see 12 tiles in 3 rows of 4.; see Tap Push them together.`
- [ ] Pushed together they make a rectangle: `click Push them together; see A rectangle made of 12 squares!; see No gaps and no overlaps. 3 rows of 4: 4 + 4 + 4 = 12.; see Pull them apart`
- [ ] Edge: 1 tile: `click Rows: one less ×2; click Columns: one less ×3; see 1 tile in 1 row of 1.; click Push them together; see A rectangle made of 1 square!`
- [ ] Edge: changing the tiles pulls them apart: `click Push them together; click Rows: one more; see 16 tiles in 4 rows of 4.; see Push them together`
- Quick check: How many squares make this rectangle? Answer: 10 squares. Mistakes it names: 7, 5.

### Step 2: Cut into squares
- [ ] 2 by 2 pieces are wider than tall: `see 2 rows and 2 columns. These pieces are wider than they are tall.; see Try more columns, or fewer rows.`
- [ ] 3 rows of 4 are squares: `click Rows: one more; click Columns: one more ×2; see Same-size squares! 3 rows of 4: 12 squares.`
- [ ] Edge: too many columns makes them taller than wide: `click Columns: one more ×3; see These pieces are taller than they are wide.; see Try more rows, or fewer columns.`
- [ ] Rectangle 2: 2 rows of 5: `click Rectangle 2; click Columns: one more ×3; see Same-size squares! 2 rows of 5: 10 squares.`
- [ ] Edge: Rectangle 3 has two answers: `click Rectangle 3; click Rows: one less; see Same-size squares! 1 row of 2: 2 squares.; click Rows: one more; click Columns: one more ×2; see Same-size squares! 2 rows of 4: 8 squares.`
- Quick check: Which rectangle is cut into same-size squares? Answer: “(picture)”. Mistakes it names: “(picture)”, “(picture)”.

### Step 3: Count the squares
- [ ] It asks you to tap each square: `see Tap each square to count it.`
- [ ] Counting as you tap: `tap [data-i="0"]; tap [data-i="5"]; see You counted 2 so far.`
- [ ] Edge: a square counts only once: `tap [data-i="0"] ×3; see You counted 1 so far.`
- [ ] Counting all of 2 rows of 2: `click Rows: one less; click Columns: one less ×2; tap [data-i="0"]; tap [data-i="1"]; tap [data-i="2"]; tap [data-i="3"]; see 4 squares!; see 2 rows of 2: 2 + 2 = 4.`
- [ ] Edge: 1 square: `click Rows: one less ×2; click Columns: one less ×3; tap [data-i="0"]; see 1 square!; see 1 row of 1: 1 = 1.`
- [ ] Edge: changing the rectangle starts over: `tap [data-i="0"]; click Rows: one more; see Tap each square to count it.`
- [ ] Start over: `tap [data-i="0"]; click Start over; see Tap each square to count it.`
- Quick check: A pan of cornbread is cut into 4 rows, with 3 pieces in each row. How many pieces are there? Answer: 12 pieces. Mistakes it names: 7, 9, 16.
