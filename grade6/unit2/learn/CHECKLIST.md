# Checklist: Learn Introducing Ratios (Grade 6 Unit 2)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–16. Not covered: Lesson 17 (A Fermi Problem), an optional open-ended project.

## Chapter 1: Ratios · `learn/ratios.html` · Lessons 1–2

### Step 1: What is a ratio?
- [ ] It starts at 3 circles and 2 squares, with the ratio both ways: `see The ratio of circles to squares is 3 : 2.; see The ratio of squares to circles is 2 : 3.; count circle.ic-a = 3; count rect.ic-b = 2`
- [ ] More squares change the ratio and the sentence: `click Squares: one more ×3; see is 3 : 5.; see For every 3 circles, there are 5 squares.`
- [ ] Edge: one of each says “1 circle” and “is 1 square”: `click Circles: one less ×5; click Squares: one less ×5; see For every 1 circle, there is 1 square.; count circle.ic-a = 1`
- [ ] Edge: 9 is the most: `click Circles: one more ×10; see is 9 : 2.; count circle.ic-a = 9`
- Quick check: A recipe uses 3 cups of flour and 2 cups of sugar. What is the ratio of sugar to flour? Answer: “2 : 3”. Mistakes it names: “3 : 2”, “2 : 5”.

### Step 2: Equal groups
- [ ] It starts with 6 circles and 9 squares, not grouped: `see 6 circles and 9 squares: the ratio is 6 : 9.; count rect.grp = 0`
- [ ] Grouping 6 : 9 makes 3 groups of 2 circles and 3 squares: `click Put them in equal groups; see 3 equal groups, each with 2 circles and 3 squares.; count rect.grp = 3`
- [ ] 8 : 4 in groups says “there is 1 square”: `click 8 : 4; click Put them in equal groups; see For every 2 circles, there is 1 square`
- [ ] 12 : 8 makes 4 groups of 3 and 2: `click 12 : 8; click Put them in equal groups; see 4 equal groups, each with 3 circles and 2 squares.`
- [ ] Ungroup goes back: `click Put them in equal groups; click Ungroup; count rect.grp = 0`
- [ ] Edge: picking another ratio starts ungrouped: `click Put them in equal groups; click 10 : 15; count rect.grp = 0; see the ratio is 10 : 15.`
- Quick check: A jar has 12 red beads and 8 blue beads. Which sentence is true? Answer: “For every 3 red beads, there are 2 blue beads.”. Mistakes it names: “For every 3 blue beads, there are 2 red beads.”, “There are 4 more red beads, so the ratio is 4 : 1.”.

## Chapter 2: Equivalent ratios · `learn/equivalent.html` · Lessons 3–5

### Step 1: Batches of a recipe
- [ ] It starts with 1 batch of lemonade: `see 1 batch: 1 cup of lemon juice and 3 cups of water, a ratio of 1 : 3.`
- [ ] 3 batches are 3 : 9, and every batch so far is listed: `click Batches: one more ×2; see 3 batches: 3 cups of lemon juice and 9 cups of water, a ratio of 3 : 9.; see 1 : 3, 2 : 6, 3 : 9`
- [ ] 4 batches of pancakes: `click pancakes; click Batches: one more ×3; see 12 cups of flour and 8 eggs, a ratio of 12 : 8.`
- [ ] Edge: 5 batches is the most: `click Batches: one more ×8; see 5 batches: 5 cups of lemon juice and 15 cups of water`
- [ ] Edge: another recipe starts again at 1 batch: `click Batches: one more ×2; click trail mix; see 1 batch: 2 cups of peanuts and 1 cup of raisins, a ratio of 2 : 1.`
- Quick check: A pancake recipe uses 3 cups of flour for 2 eggs. How many cups of flour go with 8 eggs? Answer: 12 cups of flour. Mistakes it names: 9, 24, 16.

### Step 2: The same color
- [ ] It starts with mix B 4 : 5, bluer than mix A: `see A different color. Mix B is bluer.; count .mixbar = 2`
- [ ] 4 blue to 6 yellow is the same color, 2 : 3 times 2: `click Yellow cups: one more; see The same color! 4 : 6 is 2 : 3 times 2.`
- [ ] Too much yellow: `click Yellow cups: one more ×5; see Mix B is more yellow.`
- [ ] Edge: 10 : 15 at the top of both steppers: `click Blue cups: one more ×6; click Yellow cups: one more ×10; see The same color! 10 : 15 is 2 : 3 times 5.`
- [ ] Edge: 2 : 3 itself is the same color: `click Blue cups: one less ×2; click Yellow cups: one less ×2; see The same color! 2 : 3 is 2 : 3 times 1.`
- Quick check: Which mix is the same color as 2 cups of red to 5 cups of white? Answer: “4 red : 10 white”. Mistakes it names: “3 red : 6 white”, “5 red : 2 white”.

### Step 3: Equivalent ratios
- [ ] 6 : 9 simplifies to 2 : 3, so it’s equivalent: `see 6 : 9 divided by 3 is 2 : 3; see Equivalent: both are 2 : 3 times a number.`
- [ ] 8 : 10 simplifies to 4 : 5, so it isn’t: `click 8 : 10; see 8 : 10 divided by 2 is 4 : 5; see Not equivalent.`
- [ ] Edge: 2 : 3 can’t be divided any more, and is equivalent: `click 2 : 3; see 2 : 3 can’t be divided any more; see Equivalent: both`
- [ ] Edge: 6 : 4 is 4 : 6 turned around, not equivalent: `click 6 : 4; see 3 : 2 isn’t 2 : 3.`
- [ ] 12 : 18 divides by 6: `click 12 : 18; see 12 : 18 divided by 6 is 2 : 3`
- Quick check: Which ratio is equivalent to 4 : 6? Answer: “10 : 15”. Mistakes it names: “6 : 8”, “8 : 6”.

## Chapter 3: Double number lines · `learn/double-number-lines.html` · Lessons 6–9

### Step 1: Double number lines
- [ ] It starts at 1 batch of blue paint: `see 1 batch: 2 cups of blue lines up with 5 cups of yellow.`
- [ ] 4 batches line up 8 with 20: `click Batches: one more ×3; see 4 batches: 8 cups of blue lines up with 20 cups of yellow.`
- [ ] 6 batches of laps: 18 laps and 24 minutes: `click running laps; click Batches: one more ×5; see 18 laps lines up with 24 minutes.`
- [ ] Edge: 0 batches is 0 and 0: `click Batches: one less ×2; see 0 batches: 0 cups of blue lines up with 0 cups of yellow.`
- [ ] Edge: 6 batches is the most: `click Batches: one more ×9; see 6 batches: 12 cups of blue`
- Quick check: 5 pounds of apples cost $15. How much do 2 pounds cost? Answer: 6 dollars. Mistakes it names: 12, 30, 7.5.

### Step 2: How much for one?
- [ ] 4 tacos for $10: 1 taco costs $2.50: `see 1 taco costs $10 ÷ 4 = $2.50.`
- [ ] 6 tickets for $18: $3 each: `click 6 for $18; see 1 ticket costs $18 ÷ 6 = $3.`
- [ ] Edge: a unit price under a dollar: `click 8 for $2; see 1 pencil costs $2 ÷ 8 = $0.25.`
- [ ] Edge: a price with cents: `click 5 for $7.50; see 1 pound of grapes costs $7.50 ÷ 5 = $1.50.`
- Quick check: 6 tickets cost $18. How much does 1 ticket cost? Answer: 3 dollars. Mistakes it names: 108, 12, 0.33.

### Step 3: Constant speed
- [ ] 4 seconds at 2 meters per second is 8 meters: `see In 4 seconds at 2 meters per second, it goes 8 meters.`
- [ ] 10 seconds at 5 meters per second is 50 meters: `click 5 meters per second; click Seconds: one more ×6; see it goes 50 meters.`
- [ ] Edge: 1 second says “second”: `click Seconds: one less ×3; see In 1 second at 2 meters per second, it goes 2 meters.`
- [ ] Edge: 0 seconds is 0 meters: `click Seconds: one less ×6; see it goes 0 meters.`
- [ ] Edge: 10 seconds is the most: `click Seconds: one more ×9; see In 10 seconds`
- Quick check: A snail crawls 12 cm in 4 minutes at a constant speed. How far does it crawl in 10 minutes? Answer: 30 cm. Mistakes it names: 18, 48, 120.

## Chapter 4: Better deals · `learn/better-deals.html` · Lessons 8–10

### Step 1: Which is the better deal?
- [ ] Pens: $2 each against $1.80 each, so 5 for $9 wins: `see 3 pens for $6: $2 for each pen.; see 5 pens for $9: $1.80 for each pen.; see 5 pens for $9 is the better deal; count svg = 2`
- [ ] Edge: muffins cost the same for each, so neither wins: `click muffins; see They’re the same deal: the same price for each muffin.`
- [ ] Rice: 5 for $11 wins at $2.20: `click kilograms of rice; see $2.20 for each kilogram of rice; see 5 kilograms of rice for $11 is the better deal`
- Quick check: Which is the better deal? Answer: “6 bags of chips for $8”. Mistakes it names: “4 bags of chips for $6”, “They cost the same for each bag”.

### Step 2: Who is faster?
- [ ] Noah runs 5 meters a second and Priya 6, so Priya is faster: `see Noah runs 100 meters in 20 seconds: 100 ÷ 20 = 5 meters per second.; see Priya is faster`
- [ ] Edge: Lin and Andre run at the same speed: `click Lin and Andre; see They run at the same speed.`
- [ ] Kiran is faster than Jada: `click Kiran and Jada; see Kiran is faster`
- Quick check: Lin runs 200 meters in 40 seconds. Andre runs 150 meters in 25 seconds. Who is faster? Answer: “Andre”. Mistakes it names: “Lin”, “They run at the same speed”.

## Chapter 5: Tables · `learn/tables.html` · Lessons 11–14

### Step 1: Tables of equivalent ratios
- [ ] It starts with 3 rows of flour and milk: `see Row 3: 6 : 9, the first row times 3.; count tbody tr = 3; see × 3`
- [ ] 6 rows: `click Rows: one more ×3; see Row 6: 12 : 18; count tbody tr = 6`
- [ ] Edge: 1 row is the least: `click Rows: one less ×4; see Row 1: 2 : 3, the first row times 1.; count tbody tr = 1`
- [ ] Edge: 6 rows is the most: `click Rows: one more ×10; count tbody tr = 6`
- [ ] Minutes and pages: row 3 is 15 : 12: `click minutes and pages read; see Row 3: 15 : 12`
- Quick check: Juice and water are mixed in the ratio in this table. How much water goes with 12 cups of juice? Answer: 20 cups of water. Mistakes it names: 16, 15, 60.

### Step 2: Go through 1
- [ ] 4 notebooks for $10: 1 is $2.50, 6 are $15: `see 1 costs $10 ÷ 4 = $2.50.; see 6 notebooks cost 6 × $2.50 = $15.`
- [ ] Edge: 1 notebook says “costs”: `click How many: one less ×5; see 1 notebook costs 1 × $2.50 = $2.50.`
- [ ] Edge: 12 is the most: `click How many: one more ×10; see 12 notebooks cost 12 × $2.50 = $30.`
- [ ] Rice: $2.40 each, 6 for $14.40: `click bags of rice; see 1 costs $12 ÷ 5 = $2.40.; see 6 bags of rice cost 6 × $2.40 = $14.40.`
- [ ] Water: 75 cents each: `click bottles of water; see 1 costs $6 ÷ 8 = $0.75.`
- Quick check: 4 notebooks cost $10. How much do 6 notebooks cost? Answer: 15 dollars. Mistakes it names: 12, 60, 2.5.

## Chapter 6: Part-part-whole · `learn/part-part-whole.html` · Lessons 15–16

### Step 1: Tape diagrams
- [ ] 2 : 3 with 4 in each box: `see Red: 2 × 4 = 8.; see Blue: 3 × 4 = 12.; see Total: 5 boxes × 4 = 20 beads.; count rect.tape = 5`
- [ ] 3 : 5 with 9 in each box is 72 in all: `click 3 : 5; click In each box: one more ×5; see Total: 8 boxes × 9 = 72 beads.`
- [ ] Edge: 1 in each box: `click In each box: one less ×5; see Each box is 1.`
- [ ] Edge: 1 : 4 has a single red box: `click 1 : 4; see Red: 1 × 4 = 4.; count rect.tape = 5`
- Quick check: The ratio of boys to girls in a club is 2 : 3. There are 25 students. How many are girls? Answer: 15 girls. Mistakes it names: 10, 5, 75.

### Step 2: From a part to the whole
- [ ] It starts with the red paint known and the boxes hidden: `see There are 12 cups of red paint.; see Which boxes does the amount you know fill?`
- [ ] Showing the boxes: 12 fills 3 boxes, so 32 in all: `click Show the boxes; see 12 fills 3 boxes, so each box is 12 ÷ 3 = 4.; see In all: 8 × 4 = 32.`
- [ ] Knowing the total: 25 students fill 5 boxes, 15 girls: `click boys : girls; click Show the boxes; see 25 fills 5 boxes, so each box is 25 ÷ 5 = 5.; see girls: 3 × 5 = 15.`
- [ ] Edge: a part that fills 1 box: `click dogs : cats; click Show the boxes; see 6 fills 1 box, so each box is 6 ÷ 1 = 6.; see dogs: 4 × 6 = 24.`
- [ ] Edge: hiding the boxes, and switching problems, hides the answer: `click Show the boxes; click Hide the boxes; see Which boxes; click Show the boxes; click boys : girls; see Which boxes`
- Quick check: Paint is mixed 3 cups of red to 5 cups of white. Kiran uses 12 cups of red. How many cups of paint are there in all? Answer: 32 cups. Mistakes it names: 20, 4, 96.
