# Checklist: Learn Wrapping Up Multiplication and Division with Multi-digit Numbers (Grade 5 Unit 4)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–16, 18–20. Not covered: Lessons 17 (Fractions as Partial Quotients) and 21 (Food Waste Journal), optional. Multiplying up to 3 digits × 2 digits; dividing up to 4 digits ÷ 2 digits.

## Chapter 1: Estimate products · `learn/estimate.html` · Lesson 1

### Step 1: Round, then multiply
- [ ] It starts with 389 × 21: `see 389 × 21 ≈ 400 × 20 = 8,000; see 389 rounds to 400 and 21 to 20. 4 × 2 = 8, and the zeros make it 8,000. The exact product is 8,169; pressed 389 × 21`
- [ ] 612 × 39: `click 612 × 39; see 612 × 39 ≈ 600 × 40 = 24,000; see The exact product is 23,868`
- [ ] 745 × 52: `click 745 × 52; see 745 × 52 ≈ 700 × 50 = 35,000; see The exact product is 38,740`
- Quick check: Which is the best estimate for 412 × 28? Answer: “12,000”. Mistakes it names: “1,200”, “120,000”.

## Chapter 2: Partial products · `learn/partial.html` · Lessons 2–3

### Step 1: Split both numbers by place
- [ ] It starts with 234 × 56, nothing filled in: `see 234 is 200 + 30 + 4 and 56 is 50 + 6, so there are 6 pieces. Tap + to fill them in.; count rect.am = 6`
- [ ] One piece: `click Pieces: one more; see 50 × 200 = 10,000. 5 more to go.`
- [ ] Edge: all six, and + stops there: `click Pieces: one more ×7; see All 6 pieces: 10,000 + 1,500 + 200 + 1,200 + 180 + 24 = 13,104.`
- [ ] A zero makes fewer pieces, and a new product starts over: `click Pieces: one more ×2; click 305 × 42; see 305 is 300 + 5 and 42 is 40 + 2, so there are 4 pieces.; click Pieces: one more ×5; see All 4 pieces: 12,000 + 200 + 600 + 10 = 12,810.`
- [ ] 128 × 31: `click 128 × 31; click Pieces: one more ×6; see = 3,968.`
- [ ] Edge: − stops at none: `click Pieces: one less; see so there are 6 pieces`
- Quick check: Use partial products to find 213 × 32. Answer: 6816. Mistakes it names: 6390, 245.

### Step 2: Record the partial products
- [ ] It starts with none written: `see Each part of 56 times each part of 234: 6 partial products. Tap + to write them.`
- [ ] One row: `click Partial products: one more; see 50 × 200 = 10,000. 5 more to go.`
- [ ] Edge: all six, and + stops there: `click Partial products: one more ×7; see Add all 6: 234 × 56 = 13,104.`
- [ ] Edge: − stops at none: `click Partial products: one less; see 6 partial products. Tap + to write them.`
- Quick check: Which partial products add up to 124 × 23? Answer: “2,000 + 400 + 80 + 300 + 60 + 12”. Mistakes it names: “2,000 + 60 + 12”, “200 + 40 + 8 + 300 + 60 + 12”.

## Chapter 3: The standard algorithm · `learn/standard.html` · Lessons 4–9

### Step 1: Multiply by a one-digit number
- [ ] It starts with 1,236 × 4, no columns worked: `see Start with the ones: 6 × 4. Tap + to work each column.`
- [ ] A carry: `click Columns: one more; see 6 × 4 = 24. Write 4 and carry 2 to the tens column.`
- [ ] A carry added in: `click Columns: one more ×2; see 3 × 4 + 2 carried = 12 + 2 = 14. Write 4 and carry 1 to the hundreds column.`
- [ ] Nothing to carry: `click Columns: one more ×3; see 2 × 4 + 1 carried = 8 + 1 = 9. Write 9. Nothing to carry.`
- [ ] Edge: the last column, and + stops: `click Columns: one more ×5; see 1 × 4 = 4. It’s the last column, so write all of 4. 1,236 × 4 = 4,944.`
- [ ] The last column writes two digits: `click 3,415 × 6; click Columns: one more ×4; see 3 × 6 + 2 carried = 18 + 2 = 20. It’s the last column, so write all of 20. 3,415 × 6 = 20,490.`
- [ ] A zero digit: `click 2,047 × 3; click Columns: one more ×3; see 0 × 3 + 1 carried = 0 + 1 = 1. Write 1. Nothing to carry.`
- Quick check: Use the standard algorithm: what is 1,342 × 4? Answer: 5368. Mistakes it names: 4268, 1346.

### Step 2: Multiply by a two-digit number
- [ ] It starts with 347 × 26, no rows: `see First multiply 347 by the 6 ones, then by the 2 tens. Tap + to write each row.`
- [ ] The ones row: `click Rows: one more; see 347 × 6 = 2,082.`
- [ ] The tens row ends in 0: `click Rows: one more ×2; see 347 × 20 = 6,940. It ends in 0, since the 2 is 2 tens.`
- [ ] Edge: the sum, and + stops: `click Rows: one more ×4; see Add the rows: 2,082 + 6,940 = 9,022.`
- [ ] Other products start over: `click Rows: one more; click 128 × 34; see First multiply 128 by the 4 ones; click Rows: one more ×3; see 512 + 3,840 = 4,352.; click 205 × 43; click Rows: one more ×3; see 615 + 8,200 = 8,815.`
- Quick check: Use the standard algorithm: what is 214 × 23? Answer: 4922. Mistakes it names: 1070, 642.

## Chapter 4: Partial quotients · `learn/quotients.html` · Lessons 10–14

### Step 1: Different chunks, same quotient
- [ ] It starts with 50 + 20 + 2: `see 3 chunks this way. However you chunk it, they add up to the same quotient: 1,728 ÷ 24 = 72.; see 50 + 20 + 2 = 72`
- [ ] Bigger chunks, fewer steps: `click 70 + 2; see 2 chunks this way.`
- [ ] Tens first: `click 10s first; see 8 chunks this way.; see 1,728 ÷ 24 = 72`
- Quick check: Which partial quotients work for 1,350 ÷ 25? Answer: “50 + 4”. Mistakes it names: “50”, “50 + 5”.

### Step 2: Take away one chunk at a time
- [ ] It starts with nothing taken: `see How many 24s can you take away from 1,728 at once? Tap + to take a chunk.`
- [ ] One chunk: `click Chunks: one more; see 50 × 24 = 1,200. 528 is left: take away more 24s.`
- [ ] Edge: all the chunks, and + stops: `click Chunks: one more ×4; see Nothing is left. Add the chunks: 50 + 20 + 2 = 72.`
- [ ] Two chunks: `click 1,560 ÷ 12; see How many 12s; click Chunks: one more ×3; see 100 + 30 = 130.`
- [ ] 2,275 ÷ 25: `click 2,275 ÷ 25; click Chunks: one more; see 90 × 25 = 2,250. 25 is left; click Chunks: one more; see 90 + 1 = 91.`
- Quick check: What is 1,104 ÷ 12? Answer: 92. Mistakes it names: 90, 1092.

## Chapter 5: Missing side lengths · `learn/sides.html` · Lessons 15–16

### Step 1: Divide the area by a side
- [ ] It starts with 864 square feet: `see 24 × ? = 864, so divide: 864 ÷ 24 = 36. The other side is 36 feet.; count svg = 2; pressed 864 sq ft`
- [ ] 1,250 square feet: `click 1,250 sq ft; see 1,250 ÷ 25 = 50. The other side is 50 feet.`
- [ ] 1,092 square feet: `click 1,092 sq ft; see 1,092 ÷ 12 = 91. The other side is 91 feet.`
- Quick check: A rectangular dance floor has an area of 1,350 square feet. One side is 25 feet long. How long is the other side? Answer: 54 feet. Mistakes it names: 1325, 33750.

## Chapter 6: Put it to work · `learn/work.html` · Lessons 18–20

### Step 1: Problems with two steps
- [ ] It starts with the milk, no steps: `see A school serves 240 cartons of milk a day.; see What do you need to find first? Tap + for each step.`
- [ ] The first step: `click Steps: one more; see 1. All the cartons: 240 × 20 = 4,800.`
- [ ] Edge: both steps, and + stops: `click Steps: one more ×3; see 2. Cases of 30: 4,800 ÷ 30 = 160. 160 cases.`
- [ ] Trash: `click Trash; see What do you need to find first?; click Steps: one more ×2; see 1,800 pounds.`
- [ ] Trips round up: `click Trips; click Steps: one more ×2; see 6 + 1 = 7. 7 trips.`
- Quick check: A school serves 150 cartons of milk a day. Milk comes in cases of 25. How many cases does the school need for 20 days? Answer: 120 cases. Mistakes it names: 3000, 6.
