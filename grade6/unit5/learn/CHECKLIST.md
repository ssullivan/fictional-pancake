# Checklist: Learn Arithmetic in Base Ten (Grade 6 Unit 5)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–14. Not covered: Lesson 15 (Making and Measuring Boxes), a hands-on project.

## Chapter 1: Adding and subtracting decimals · `learn/add-subtract.html` · Lessons 1–4

### Step 1: Bundle ten hundredths
- [ ] 0.47 + 0.38: 15 hundredths bundle into a tenth, 0.85: `see 0.47 + 0.38 is 7 tenths and 15 hundredths.; see Bundle 10 hundredths into 1 tenth: 8 tenths and 5 hundredths.; see 0.47 + 0.38 = 0.85; count rect.bt-t = 7; count rect.bt-h = 15`
- [ ] With fewer than 10 hundredths there’s nothing to bundle: `click First: hundredths: one less ×6; see 0.41 + 0.38 is 7 tenths and 9 hundredths.; nosee Bundle; see = 0.79`
- [ ] Edge: 10 tenths bundle into a one: `click First: tenths: one more ×5; click Second: tenths: one more ×4; see Bundle 10 tenths into 1 one: 1 one, 7 tenths, and 5 hundredths.; see 0.97 + 0.78 = 1.75`
- [ ] Edge: adding to 0: `click First: tenths: one less ×5; click First: hundredths: one less ×8; see 0 + 0.38 is 3 tenths and 8 hundredths.; see 0 + 0.38 = 0.38`
- [ ] Edge: 1 tenth says “tenth”: `click First: tenths: one less ×3; click First: hundredths: one less ×8; click Second: tenths: one less ×4; click Second: hundredths: one less ×9; see is 1 tenth and 0 hundredths.`
- Quick check: What is 0.47 + 0.38? Answer: 0.85. Mistakes it names: 0.715, 0.75, 8.5.

### Step 2: Line up the decimal points
- [ ] 2.5 + 0.75: write 2.5 as 2.50: `see Write 2.5 as 2.50.; see 2.5 + 0.75 = 3.25`
- [ ] 3 − 1.25: write 3 as 3.00: `click 3 − 1.25; see Write 3 as 3.00.; see 3 − 1.25 = 1.75`
- [ ] Edge: a whole number minus a tenth: `click 10 − 0.4; see Write 10 as 10.0.; see 10 − 0.4 = 9.6`
- [ ] 1.23 + 4.5: `click 1.23 + 4.5; see Write 4.5 as 4.50.; see 1.23 + 4.5 = 5.73`
- Quick check: A bottle has 2 liters of juice. Jada pours out 0.75 liters. How many liters are left? Answer: 1.25 liters. Mistakes it names: 2.75, 0.55.

## Chapter 2: Where the decimal point goes · `learn/decimal-point.html` · Lessons 5–6

### Step 1: Tenths times tenths
- [ ] 0.3 × 0.2 = 6/100: `see 0.3 × 0.2 = 3/10 × 2/10 = 6/100 = 0.06; see tenths times tenths make hundredths.`
- [ ] Tenths times hundredths make thousandths: `click 0.4 × 0.02; see = 8/1,000 = 0.008; see tenths times hundredths make thousandths.`
- [ ] Edge: a factor bigger than 1: `click 1.5 × 0.4; see 15/10 × 4/10 = 60/100 = 0.6`
- [ ] Hundredths times tenths: `click 0.06 × 0.5; see = 30/1,000 = 0.03`
- Quick check: What is 0.4 × 0.2? Answer: 0.08. Mistakes it names: 0.8, 8, 0.6.

### Step 2: Count the decimal places
- [ ] 1.25 × 0.4: 500 with 3 places is 0.5: `see 125 × 4 = 500.; see 3 decimal places in all.; see So 1.25 × 0.4 = 0.500 = 0.5.`
- [ ] 2.5 × 0.12 = 0.3: `click 2.5 × 0.12; see So 2.5 × 0.12 = 0.300 = 0.3.`
- [ ] Edge: a whole number has 0 decimal places: `click 12 × 0.05; see 12 has 0 decimal places; see = 0.60 = 0.6.`
- [ ] 0.35 × 0.2 = 0.07: `click 0.35 × 0.2; see = 0.070 = 0.07.`
- Quick check: Which is 2.5 × 0.12? Answer: “0.3”. Mistakes it names: “3”, “0.03”.

## Chapter 3: Area diagrams and grids · `learn/area-models.html` · Lessons 7–8

### Step 1: Multiply on a hundredths grid
- [ ] 0.6 by 0.3 shades 18 squares: `see 18 hundredths of a square meter = 0.18 square meters.; count rect.shade = 18`
- [ ] Edge: the whole square is 1 square meter: `click Width (tenths): one more ×5; click Height (tenths): one more ×8; see 1 m × 1 m = 10 × 10 = 100 hundredths; see The whole square: 1 square meter.; count rect.shade = 100`
- [ ] Edge: the smallest rectangle is 1 hundredth: `click Width (tenths): one less ×7; click Height (tenths): one less ×4; see = 1 hundredth of a square meter = 0.01 square meters.; count rect.shade = 1`
- [ ] 0.4 by 0.7 is 0.28: `click Width (tenths): one less ×2; click Height (tenths): one more ×4; see = 28 hundredths of a square meter = 0.28 square meters.`
- Quick check: A rectangle is 0.4 m wide and 0.7 m tall. What is its area? Answer: 0.28 square meters. Mistakes it names: 28, 1.1, 0.028.

### Step 2: Split it into parts
- [ ] 1.5 pounds of grapes: $2.40 + $1.20 = $3.60: `see $2.40 × 1 = $2.40 and $2.40 × 0.5 = $1.20.; see 1.5 pounds of grapes cost $3.60.`
- [ ] 2.5 pounds of cherries cost $8.00: `click 2.5 lb of cherries; see $3.20 × 2 = $6.40 and $3.20 × 0.5 = $1.60.; see cost $8.00.`
- [ ] 3.5 pounds of apples cost $6.30: `click 3.5 lb of apples; see cost $6.30.`
- Quick check: Grapes cost $2.40 a pound. How much do 1.5 pounds cost? Answer: 3.6 dollars. Mistakes it names: 36, 3.9, 2.4.

## Chapter 4: Dividing whole numbers · `learn/divide-whole.html` · Lessons 9–11

### Step 1: Partial quotients
- [ ] It starts by asking how many groups: `see How many groups of 12 are in 156?`
- [ ] A chunk of 10 groups leaves 36: `click Take a chunk; see 10 groups so far, with 36 left.`
- [ ] Two chunks finish it: 13 groups: `click Take a chunk ×2; see 10 + 3 = 13 groups, so 156 ÷ 12 = 13.; disabled Take a chunk`
- [ ] Edge: a big number: 1,000 ÷ 8 = 125: `click 1,000 ÷ 8; click Take a chunk ×2; see 100 + 25 = 125 groups, so 1,000 ÷ 8 = 125.`
- [ ] Start over: `click Take a chunk; click Start over; see How many groups of 12 are in 156?; enabled Take a chunk`
- [ ] Edge: another division starts from the beginning: `click Take a chunk ×2; click 252 ÷ 7; see How many groups of 7 are in 252?`
- Quick check: A baker packs 156 cookies into boxes of 12. How many boxes does the baker fill? Answer: 13 boxes. Mistakes it names: 12, 168, 1872.

### Step 2: Keep going past the ones
- [ ] 7 ÷ 4 = 1.75, through tenths and hundredths: `see 7 ÷ 4 = 1 one, with 3 ones left.; see 30 ÷ 4 = 7 tenths, with 2 tenths left.; see 7 ÷ 4 = 1.75`
- [ ] Edge: less than 1: 3 ÷ 8 = 0.375: `click 3 ÷ 8; see 3 ÷ 8 = 0 ones, with 3 ones left.; see 3 ÷ 8 = 0.375`
- [ ] 12 ÷ 5 = 2.4: `click 12 ÷ 5; see 2 ones = 20 tenths. 20 ÷ 5 = 4 tenths.; see 12 ÷ 5 = 2.4`
- [ ] Edge: 1 left says “1 one”: `click 9 ÷ 2; see with 1 one left.; see 1 one = 10 tenths.`
- Quick check: 5 friends share $12 equally. How much does each friend get? Answer: 2.4 dollars. Mistakes it names: 2, 2.2, 60.

## Chapter 5: Dividing decimals · `learn/divide-decimals.html` · Lessons 12–13

### Step 1: Make it a whole number
- [ ] It starts with the idea: `see Multiply both numbers by 10 until you divide by a whole number.`
- [ ] 1.8 ÷ 0.3 becomes 18 ÷ 3 = 6, and stops there: `click Multiply both by 10; see 18 ÷ 3 = 6, so 1.8 ÷ 0.3 = 6.; disabled Multiply both by 10`
- [ ] 4.5 ÷ 0.05 takes two steps: 450 ÷ 5 = 90: `click 4.5 ÷ 0.05; click Multiply both by 10 ×2; see Both numbers × 100: 4.5 ÷ 0.05 is the same as 450 ÷ 5.; see = 90`
- [ ] 3 ÷ 0.25 is 300 ÷ 25 = 12: `click 3 ÷ 0.25; click Multiply both by 10 ×2; see 300 ÷ 25 = 12`
- [ ] Edge: after one step 0.8 isn’t whole yet: `click 0.96 ÷ 0.08; click Multiply both by 10; see 9.6 ÷ 0.8; enabled Multiply both by 10`
- [ ] Start over: `click Multiply both by 10; click Start over; see Multiply both numbers by 10 until`
- Quick check: How many 0.25-liter cups can you fill from 3 liters of juice? Answer: 12 cups. Mistakes it names: 0.75, 1.2.

## Chapter 6: Putting it together · `learn/put-together.html` · Lesson 14

### Step 1: Orders and change
- [ ] 2 tacos and a lemonade from $10: $4.10 change: `see Total: $5.90. Change from $10: $10.00 − $5.90 = $4.10.; count tbody tr = 3`
- [ ] Edge: a $5 bill is $0.90 short: `click $5 bill; see $0.90 short`
- [ ] Edge: an empty order: `click Tacos ($2.25): one less ×2; click Lemonades ($1.40): one less; see Add something to the order.; see Nothing ordered yet.`
- [ ] Lin’s order: 3 tacos and a lemonade, $1.85 change: `click Tacos ($2.25): one more; see $10.00 − $8.15 = $1.85.`
- [ ] Edge: the biggest order, paid with $20: `click $20 bill; click Tacos ($2.25): one more ×5; click Lemonades ($1.40): one more ×5; click Cookies ($0.75): one more ×5; see Total: $16.20; see $20.00 − $16.20 = $3.80.`
- Quick check: Lin buys 3 tacos at $2.25 each and a lemonade for $1.40, then pays with a $10 bill. How much change does Lin get? Answer: 1.85 dollars. Mistakes it names: 8.15, 6.35.
