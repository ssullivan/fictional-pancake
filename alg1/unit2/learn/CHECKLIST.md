# Checklist: Learn Linear Equations, Inequalities, and Systems (Algebra 1 Unit 2)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, sliders end to end, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–5 so far (Section 1, Writing and Modeling with Equations). Each chapter follows one IM lesson. Left out: Lesson 1's group project and Lesson 2's Platonic solids puzzle, which are open-ended.

## Chapter 1: Planning a pizza party · `learn/pizza-party.html` · Lesson 1

### Step 1: What the letters say
- [ ] It starts on m = 7.50, with what each letter means: `pressed m = 7.50; see The main dish costs $7.50; count .legend li = 4; count .eq .katex = 1`
- [ ] m = s + 4.50 compares two prices: `click m = s + 4.50; see costs $4.50 more than a side dish; see A side dish at $3 means a main dish at $7.50`
- [ ] ns = 6 has many solutions: `click ns = 6; see 2 sides at $3, 3 sides at $2, or 4 sides at $1.50`
- [ ] m + ns = t adds up the meal: `click m + ns = t; see The total is the main dish plus all the side dishes; see 7.50 + 2 × 3 = 13.50`
- [ ] Edge: picking the same equation twice keeps it: `click ns = 6 ×2; pressed ns = 6; count .eq .katex = 1`
- Quick check: Which equation says “a meal with 3 side dishes costs $15 in all”? Answer: “\(m + 3s = 15\)”. Mistakes it names: “\(3(m + s) = 15\)”, “\(m + s + 3 = 15\)”, “\(3s = 15\)”.

### Step 2: Plans and constraints
- [ ] It starts with 20 people at 3 slices, rounded up to whole pizzas: `see 20 people × 3 slices = 60 slices; see but pizzas come whole: 8 pizzas; see (4 slices left over); see within the $120 budget`
- [ ] 24 people need exactly 9 pizzas: `click People: one more ×4; see 72 slices; see 72 ÷ 8 = 9 pizzas, with no slices left over; see $108`
- [ ] Edge: exactly the budget still fits: `click Slices each: one more; see 80 slices; see $120: within the $120 budget`
- [ ] Over the budget: `click People: one more ×10; click Slices each: one more ×3; see 30 people × 4 slices = 120 slices; see $180: over the $120 budget`
- [ ] Edge: the smallest party is one pizza: `click People: one less ×15; click Slices each: one less ×5; see 8 people × 1 slice = 8 slices; see 8 ÷ 8 = 1 pizza, with no slices left over`
- Quick check: 24 people each eat 3 slices. A pizza has 8 slices and costs $12. How much do the pizzas cost? Answer: 108 dollars. Mistakes it names: 9, 864, 36.

## Chapter 2: Writing equations · `learn/writing-equations.html` · Lesson 2

### Step 1: A cost for each, plus a cost once
- [ ] It starts with 28 students and 3 teachers: `see 28 students and 3 teachers are 31 people; see $217 in admission; see $397`
- [ ] One more student adds $7: `click Students: one more; see 32 people; see $404`
- [ ] Edge: the most teachers: `click Teachers: one more ×5; see 28 students and 4 teachers are 32 people`
- [ ] Edge: the smallest trip: `click Students: one less ×10; click Teachers: one less ×5; see 20 students and 1 teacher are 21 people; see $327`
- [ ] The answer counts written either way round: `answer 40 + 5p = c; feedback Nice!`
- [ ] Edge: an expression with no = sign gets a note and keeps its try: `answer 5p + 40; feedback Write an equation; answer c = 5p + 40; feedback Nice!`
- Quick check: A bowling party costs $5 a person, plus $40 for the lane. Write an equation for the total cost \(c\) for \(p\) people. Answer: “c=5p+40”. Mistakes it names: “c=40p+5”, “c=5(p+40)”, “c=45p”.

### Step 2: Price, tax, and fees
- [ ] It starts at $10,000: `pressed $10,000; see 6% of $10,000 is 0.06 × 10,000 = $600; see $10,720`
- [ ] $8,000: `click $8,000; see $480; see $8,600`
- [ ] $15,000: `click $15,000; see $900; see $16,020`
- [ ] $20,000: `click $20,000; see $1,200; see $21,320`
- [ ] The answer counts before it's simplified: `answer c = p + 0.08p + 50; feedback Nice!`
- Quick check: Sales tax is 8%, and there’s a $50 fee. Write an equation for the total cost \(c\) of a bike whose price is \(p\). Answer: “c=1.08p+50”. Mistakes it names: “c=0.08p+50”, “c=1.8p+50”, “c=p+58”.

## Chapter 3: Finding the relationship · `learn/finding-relationships.html` · Lesson 3

### Step 1: Test it on every row
- [ ] It starts with Table A and an equation that doesn't fit: `pressed Table A; pressed y = 400 + x; see y = 400 + x doesn’t fit Table A; see When x is 0, it makes y 400, but the table says 0; count .dtab tbody tr = 5`
- [ ] Table A is 400 times: `click y = 400x; see fits every row of Table A; see a lap is 400 meters; nosee ✗`
- [ ] Table B adds to 400: `click Table B; click x + y = 400; see fits every row of Table B; see the two distances add to 400`
- [ ] Table C is 400 more: `click Table C; click y = 400 + x; see fits every row of Table C`
- [ ] Table D is 400 less: `click Table D; click y = x − 400; see fits every row of Table D; count .dtab tbody tr = 4`
- [ ] A new table keeps the equation, and names the first row that fails: `click y = 400x; click Table B; see y = 400x doesn’t fit Table B; see When x is 0, it makes y 0, but the table says 400`
- [ ] The answer counts solved for y: `answer y = 15 - x; feedback Nice!`
- Quick check: Write an equation for the relationship between x and y in this table. Answer: “x+y=15”. Mistakes it names: “y=x+11”, “x+y=13”.

### Step 2: A product that stays the same
- [ ] It starts with 4 winners: `pressed 4 winners; see 4 winners get $75 each; count .shares span = 4`
- [ ] One winner gets it all: `click 1 winner; see 1 winner gets $300 each; count .shares span = 1`
- [ ] More winners, smaller shares: `click 6 winners; see $50 each; click 10 winners; see 10 winners get $30 each; count .shares span = 10`
- [ ] Edge: bh = 48 is true, but not solved for h: `answer bh = 48; feedback divide both sides by b; answer h = 48/b; feedback Got it!`
- Quick check: A parallelogram has an area of 48 square inches. Write an equation for its height \(h\) when its base is \(b\). Answer: “h=48/b”. Mistakes it names: “h=48b”, “h=48-b”, “bh=48”.

## Chapter 4: Equations and their solutions · `learn/solutions.html` · Lesson 4

### Step 1: A solution makes it true
- [ ] It starts at 3 grams, too few: `see 3 isn’t a solution: it makes 17 calories; see fewer than 27; see Try more grams`
- [ ] 5.5 grams is the solution: `click Grams of carbs (c): one more ×5; see 5.5 is the solution`
- [ ] Past it is too many: `click Grams of carbs (c): one more ×6; see 6 isn’t a solution: it makes 29 calories; see more than 27; see Try fewer grams`
- [ ] Edge: no carbohydrate at all: `click Grams of carbs (c): one less ×10; see 0 isn’t a solution: it makes 5 calories`
- [ ] Edge: the most grams: `click Grams of carbs (c): one more ×20; see 8 isn’t a solution: it makes 37 calories`
- Quick check: Jada earns $12 an hour and pays $7 bus fare each day. One day Jada took home $77: \(12h - 7 = 77\). How many hours did Jada work? Answer: 7 hours. Mistakes it names: 84, 70.

### Step 2: Solutions in two variables
- [ ] It starts at 2 shirts and 4 pairs of socks, not a solution: `see That’s $30, less than $45; count .chip = 0`
- [ ] Finding a solution lists it: `click Pairs of socks (p): one more ×6; see Exactly $45; see t = 2 and p = 10 is a solution; see Solutions found: 1 of 5; see (2, 10)`
- [ ] Too much: `click Shirts (t): one more; click Pairs of socks (p): one more ×6; see $55, more than $45`
- [ ] Edge: finding the same solution again doesn't count it twice: `click Pairs of socks (p): one more ×6; click Shirts (t): one more; click Pairs of socks (p): one less ×4; see Solutions found: 2 of 5; click Shirts (t): one less; click Pairs of socks (p): one more ×4; see Solutions found: 2 of 5`
- [ ] Edge: socks only: `click Shirts (t): one less ×3; click Pairs of socks (p): one more ×20; see t = 0 and p = 18 is a solution`
- Quick check: A snack has 60 calories from \(p\) grams of protein and \(f\) grams of fat: \(4p + 9f = 60\). Which pair is a solution? Answer: “\(p = 10.5,\ f = 2\)”. Mistakes it names: “\(p = 5,\ f = 2\)”, “\(p = 8,\ f = 4\)”, “\(p = 6,\ f = 3\)”.

## Chapter 5: Equations and their graphs · `learn/graphs.html` · Lesson 5

### Step 1: Points on the line
- [ ] It starts on (2, 7), on the line: `pressed (2, 7); see 6 × 2 + 9 × 7 = $75: on the line; count circle.gq-pt = 5; count circle.gq-pt.hi = 1`
- [ ] Above the line costs more: `click (10, 4); see $96; see more than $75, so the point is above the line`
- [ ] Below the line costs less: `click (4, 2); see $42; see below the line`
- [ ] Other points on the line: `click (8, 3); see on the line; click (11, 1); see 6 × 11 + 9 × 1 = $75: on the line`
- Quick check: Which point is on the graph of \(6a + 9f = 75\)? Answer: “(11, 1)”. Mistakes it names: “(1, 11)”, “(5, 4)”, “(12, 0)”.

### Step 2: Graph a situation
- [ ] It starts at 5 minutes: `see After 5 minutes: 450 − 20 × 5 = 350 gallons; see (5, 350); count circle.gq-pt = 1`
- [ ] Later, less water: `click Minutes (t): one more ×5; see 250 gallons; see (10, 250)`
- [ ] Edge: the last whole minute: `click Minutes (t): one more ×20; see After 22 minutes; see 10 gallons; see empty after 22.5 minutes`
- [ ] Edge: the start: `click Minutes (t): one less ×6; see After 0 minutes: 450 − 20 × 0 = 450 gallons`
- Quick check: A savings account starts with $475, and $125 goes in each week: \(b = 475 + 125w\). After how many weeks does it have $1,350? Answer: 7 weeks. Mistakes it names: 10.8, 14.6.
