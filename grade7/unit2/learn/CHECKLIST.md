# Checklist: Learn Introducing Proportional Relationships (Grade 7 Unit 2)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, sliders end to end, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–14 (v.III). Not covered: Lesson 15 (Using Water Efficiently), an open-ended project.

## Chapter 1: Proportional relationships in tables · `learn/tables.html` · Lessons 1–3

### Step 1: Multiply by the same number
- [ ] It starts at 3 cups per scoop with 3 rows: `pressed 3 cups per scoop; see water = scoops × 3; see The last row, 3 × 3 = 9; count tbody tr = 3`
- [ ] 2 cups per scoop: `click 2 cups per scoop; see The last row, 3 × 2 = 6`
- [ ] A constant that isn't whole: `click 1 1/2 cups per scoop; see scoops × 1 1/2; see 3 × 1 1/2 = 4.5`
- [ ] Edge: the rows stop at 6: `click Rows: one more ×5; count tbody tr = 6; see The last row, 6 × 3 = 18`
- [ ] Edge: and at 2: `click Rows: one less ×3; count tbody tr = 2`
- Quick check: A table shows a proportional relationship: 4 batches of muffins take 10 cups of flour, and 6 batches take 15 cups. What is the constant of proportionality? Answer: 2.5. Mistakes it names: 0.4, 5, 6.

### Step 2: Finding the constant
- [ ] It starts on the first row: `pressed 2 tacos; see 5 ÷ 2 = 2.5. Any row gives the same number: each taco costs $2.50`
- [ ] Another row gives the same: `click 4 tacos; see 10 ÷ 4 = 2.5`
- [ ] The last row: `click 6 tacos; see 15 ÷ 6 = 2.5`
- [ ] Only the picked row is worked out: `click 6 tacos; count td.note:not(:empty) = 1`
- Quick check: In a proportional relationship, 3 hours of work pays $36. How much do 5 hours pay? Answer: 60 dollars. Mistakes it names: 38, 12.

### Step 3: Going the other way
- [ ] It starts with minutes to pages: `pressed minutes → pages; see Minutes to pages: × 6, 6 pages per minute; see 30`
- [ ] Pages to minutes uses the reciprocal: `click pages → minutes; see × 1/6; see 6 and 1/6 are reciprocals: 6 × 1/6 = 1`
- Quick check: A food truck drives 50 miles per hour. What is the constant of proportionality going the other way, in hours per mile? Answer: 0.02. Mistakes it names: 50.

## Chapter 2: Equations like y = kx · `learn/equations.html` · Lessons 4–6

### Step 1: y = kx
- [ ] It starts at 4 tacos: `see c = 2.5 × 4 = 10; see 4 tacos cost $10.`
- [ ] Cents show when there are some: `click Tacos: one more; see 5 tacos cost $12.50`
- [ ] One taco: `click Tacos: one less ×3; see 1 taco costs $2.50`
- [ ] Edge: no tacos cost nothing: `click Tacos: one less ×5; see 0 tacos cost $0`
- [ ] Edge: the tacos stop at 10: `click Tacos: one more ×8; see 10 tacos cost $25`
- Quick check: Each scoop of lemonade mix takes 3 cups of water. Which equation gives the cups of water w for s scoops? Answer: “w = 3s”. Mistakes it names: “s = 3w”, “w = s + 3”.

### Step 2: Two equations for each relationship
- [ ] It starts with the printer: `pressed Printer; see when m = 5, p = 6 × 5 = 30; see when p = 30, m = 1/6 × 30 = 5`
- [ ] The truck: `click Truck; see d = 50 × 3 = 150; see h = 1/50 × 150 = 3`
- [ ] Lemonade: `click Lemonade; see w = 3 × 4 = 12; see Multiplying by 1/3 undoes multiplying by 3`
- Quick check: A truck goes d miles in h hours: d = 40h. Which equation gives the hours h for d miles? Answer: “h = 1/40d”. Mistakes it names: “h = 40d”, “h = d − 40”.

### Step 3: Using an equation
- [ ] It starts with water for 7 scoops: `pressed Water for 7 scoops; see w = 3 × 7 = 21 cups of water`
- [ ] Going back divides: `click Scoops for 21 cups; see 21 = 3s. Divide by 3: s = 21 ÷ 3 = 7 scoops`
- [ ] Water for 10 scoops: `click Water for 10 scoops; see = 30 cups`
- [ ] Scoops for 12 cups: `click Scoops for 12 cups; see s = 12 ÷ 3 = 4 scoops`
- Quick check: Water and lemonade mix follow w = 3s. How many scoops of mix go with 27 cups of water? Answer: 9 scoops. Mistakes it names: 81, 24.

## Chapter 3: Proportional or not? · `learn/proportional-or-not.html` · Lessons 7–9

### Step 1: Testing a table
- [ ] Table A is proportional: `pressed Table A; see Every row gives 3: proportional, with y = 3x`
- [ ] Table B adds 4: `click Table B; see The rows give different numbers: not proportional; see Here y is always x + 4`
- [ ] Table C is a multiple plus 2: `click Table C; see 6 ÷ 2 = 3; see 4 ÷ 1 = 4; see Here y is 2x + 2`
- Quick check: Which set of rows (x, y) could be a proportional relationship? Answer: “(2, 5), (4, 10), (6, 15)”. Mistakes it names: “(1, 5), (2, 6), (3, 7)”, “(1, 3), (2, 6), (3, 10)”.

### Step 2: Equations and stories
- [ ] It starts with y = 4x: `pressed y = 4x; see proportional. y is 4 times x: k = 4.`
- [ ] Dividing by 4 is proportional too: `click y = x/4; see k = 1/4; see ÷ 2 = 0.25`
- [ ] Adding 4 isn't: `click y = x + 4; see not proportional. Adding 4 isn’t multiplying; see ÷ 1 = 5; see ÷ 2 = 3`
- [ ] A multiple plus 1 isn't: `click y = 4x + 1; see when x is 0, y is 1, not 0`
- Quick check: Which of these is not a proportional relationship? Answer: “A $5 fee plus $2 for each ride”. Mistakes it names: “Pay of $12 for each hour worked”, “A printer that prints 6 pages each minute”.

## Chapter 4: Graphs of proportional relationships · `learn/graphs.html` · Lessons 10–13

### Step 1: A line through (0, 0)
- [ ] It starts at k = 3, with six points: `see of y = 3x all lie on a straight line through (0, 0); see It passes through (1, 3); count circle.gq-pt = 6`
- [ ] A bigger constant: `click Constant k: one more; see (1, 4), (2, 8)`
- [ ] Edge: the constant stops at 1: `click Constant k: one less ×5; see (1, 1), (2, 2)`
- [ ] Edge: and at 6: `click Constant k: one more ×5; see (1, 6), (2, 12)`
- Quick check: The graph of a proportional relationship is a line through (4, 10). What is the constant of proportionality? Answer: 2.5. Mistakes it names: 10, 0.4.

### Step 2: What a point means
- [ ] It starts at (1, 2.5): `pressed (1, 2.5); see 1 taco costs $2.50: the constant of proportionality`
- [ ] The origin: `click (0, 0); see 0 tacos cost $0. Every proportional graph starts here.`
- [ ] Another point: `click (4, 10); see 4 across and 10 up: 4 tacos cost $10.`
- Quick check: A graph shows the miles a truck drives against the hours it drives. What does the point (3, 150) mean? Answer: “In 3 hours, the truck drives 150 miles”. Mistakes it names: “In 150 hours, the truck drives 3 miles”, “The truck drives 3 miles an hour”.

### Step 3: Steeper lines
- [ ] It starts with A steeper: `pressed $3 and $2; see Truck A’s line is steeper`
- [ ] B steeper: `click $2.50 and $4; see Truck B’s line is steeper`
- [ ] Prices with cents: `click $3.50 and $3; see goes up $3.50 for each taco; see Truck A’s line is steeper`
- Quick check: Line A passes through (2, 8) and line B through (3, 9). Both start at (0, 0). Which has the greater constant of proportionality? Answer: “Line A”. Mistakes it names: “Line B”, “They’re the same”.

### Step 4: Two graphs for each relationship
- [ ] It starts with pages up: `pressed pages up, minutes across; see k = 6 pages per minute`
- [ ] Swapped, the constant is the reciprocal: `click minutes up, pages across; see k = 1/6 minute per page, the reciprocal of 6`
- Quick check: A graph of pay (up) against hours (across) is a line through (1, 15). If you graph hours (up) against pay (across) instead, what is the constant of proportionality? Answer: 0.0667. Mistakes it names: 15.

## Chapter 5: Four representations · `learn/four-ways.html` · Lesson 14

### Step 1: One relationship, four ways
- [ ] It starts with tacos, shown four ways: `pressed Tacos; see Each taco costs $2.50.; see c = 2.5t; see The constant 2.5 is in all four; count table.rt = 1; count svg = 1`
- [ ] The printer: `click Printer; see p = 6m; see the point (1, 6) on the line`
- [ ] The shower: `click Shower; see g = 2m; see every row of the table (4 ÷ 2)`
- Quick check: A proportional relationship’s graph passes through (2, 7). Which equation matches it? Answer: “y = 3.5x”. Mistakes it names: “y = x + 5”, “y = 7x”.
