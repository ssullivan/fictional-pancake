# Checklist: Learn Expressions and Equations (Grade 6 Unit 6)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, sliders end to end, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–19. Not covered: the partner activities (info gaps and card sorts) and the open-ended parts of Lesson 19.

## Chapter 1: Tape diagrams and equations · `learn/equations.html` · Lessons 1–2

### Step 1: Tapes and equations
- [ ] A piece and 4: four equations, written both ways: `see x + 4 = 12; see 12 = x + 4; see 12 − 4 = x; count .work-lines li = 4`
- [ ] Find x writes in the unknown and checks it: `click Find x; see x = 8; see 12 − 4 = 8, so x = 8. Check: 8 + 4 = 12 ✓; enabled Hide x`
- [ ] 4 equal pieces, each x: `click 4 equal pieces; see x + x + x + x = 12; see 4x = 12; count rect.tape = 4`
- [ ] Edge: a new tape hides the unknown again: `click Find x; click The whole is unknown; nosee x = 15; click Find x; see x = 15`
- Quick check: Which equation matches this tape? Answer: “3x = 18”. Mistakes it names: “x + 3 = 18”, “18 · 3 = x”.

### Step 2: True or false?
- [ ] x = 6 makes 8 + 4 = x + 5 false: `see 8 + 4 ≠ 6 + 5 is false; see the left side is 12 and the right side is 11`
- [ ] x = 7 balances it: `click x: one more; see 8 + 4 = 7 + 5 is true; see both sides are 12`
- [ ] 2x = 3 + 7 is true for 5: `click 2x = 3 + 7; click x: one less; see 2 · 5 = 3 + 7 is true`
- [ ] The unknown can be on the right: `click 18 = 3x; see 18 = 3 · 6 is true`
- [ ] Edge: x stops at 0 and at 12: `click x: one less ×8; see With x = 0,; click x: one more ×14; see With x = 12,`
- Quick check: What number goes in the box to make this true? 9 + 6 = □ + 10 Answer: 5. Mistakes it names: 15, 25.

### Step 3: Solutions
- [ ] It starts by trying 0: `see 5 · 0 = 35 is false; count .chip = 1`
- [ ] Trying up to 7 finds the solution, and every try is listed: `click Try x =: one more ×7; see 5 · 7 = 35 is true; see 7 is the solution; count .chip = 8; count .chip.found = 1`
- [ ] Decimal values: `click x + 2.5 = 9; click Try x =: one more ×3; see 6.5 + 2.5 = 9 is true`
- [ ] Edge: the tries stop at each equation's last value: `click x + 2.5 = 9; click Try x =: one more ×10; see x = 8 makes`
- [ ] Edge: a new equation clears the list: `click Try x =: one more ×2; click 18 = 2x; count .chip = 1; see 18 = 2 · 0 is false`
- Quick check: Which value of x is a solution to 12 = 4 + x? Answer: “8”. Mistakes it names: “16”, “3”.

## Chapter 2: Staying in balance · `learn/balance.html` · Lessons 3–5

### Step 1: Hangers
- [ ] It starts balanced: `see x + 3 = 7; see Still balanced`
- [ ] Taking from one side tips it: `click Take 1 off the left; see x + 2 ≠ 7; see The hanger tipped.`
- [ ] The same off each side three times leaves x alone: `click Take 1 off the left; click Start over; click Take 1 off each side ×3; see x = 4; see Check in the first equation: 4 + 3 = 7 ✓; disabled Take 1 off each side; disabled Take 1 off the left`
- [ ] Edge: the right side empties and stops at 0: `click Take 1 off the right ×7; disabled Take 1 off the right; see x + 3 ≠ 0`
- Quick check: This hanger is balanced. Which move keeps it balanced and leaves x alone? Answer: “Take 5 off each side”. Mistakes it names: “Take 5 off the left side”, “Take 9 off each side”.

### Step 2: Equal groups on each side
- [ ] 3 circles balance 12 squares: `count circle.hg-x = 3; count rect.hg-one = 12`
- [ ] Dividing each side by 3 leaves one x and 4 squares: `click Divide each side by 3; see x = 4; see check: 3 · 4 = 12 ✓; count circle.hg-x = 1; count rect.hg-one = 4`
- [ ] Edge: the groups go back: `click Divide each side by 3; click Put the groups back; count circle.hg-x = 3`
- [ ] 4x = 20: `click 4x = 20; click Divide each side by 4; see x = 5; count rect.hg-one = 5`
- [ ] Edge: another equation starts unsplit: `click Divide each side by 3; click 2x = 10; count circle.hg-x = 2; see Divide each side by 2`
- Quick check: A balanced hanger has 5 circles on one side and 30 unit squares on the other. How much does one circle weigh? Answer: 6. Mistakes it names: 150, 25.

### Step 3: Same move, any numbers
- [ ] Before a move: the equation, and the tape's way: `count .work-lines li = 1; see Pick a move.; see so x is 4 − 1.5`
- [ ] Subtracting 1.5 from each side gets x alone, with the check: `click Subtract 1.5 from each side; see x = 2.5; see check: 2.5 + 1.5 = 4 ✓; pressed Subtract 1.5 from each side`
- [ ] A wrong move keeps it true but doesn't get x alone: `click Add 1.5 to each side; see Still true; see x isn’t alone; count .work-lines li.bad = 1`
- [ ] Fractions work the same way: `tap [data-top] button[data-m="b"]; tap [data-bot] button[data-m="sub"]; see x is alone; count .work-lines li = 4`
- [ ] Multiplying: divide each side: `tap [data-top] button[data-m="c"]; click Divide each side by 4; see x = 1.8; see check: 4 · 1.8 = 7.2 ✓`
- [ ] Subtracting doesn't undo multiplying: `tap [data-top] button[data-m="c"]; click Subtract 4 from each side; see Subtracting doesn’t undo multiplying`
- [ ] Edge: a new equation clears the move: `click Subtract 1.5 from each side; tap [data-top] button[data-m="d"]; count .work-lines li = 1; see 15 ÷ 6`
- Quick check: Solve: 5x = 8.5 Answer: 1.7. Mistakes it names: 3.5, 42.5.

### Step 4: a/b means a ÷ b
- [ ] 3x = 7: the tape of 7 in 3 parts, and x = 7/3: `see x = 7 ÷ 3; see check: 3 · 7/3 = 21/3 = 7 ✓; count rect.tape = 3`
- [ ] Edge: a total that divides evenly gives a whole number: `click Total (a): one less; see 6/3 = 2`
- [ ] Less than one whole: `click Total (a): one less ×6; see x = 1/3`
- [ ] Edge: the steppers stop at 6 pieces and 12: `click Pieces (b): one more ×9; click Total (a): one more ×9; see 6x = 12; count rect.tape = 6`
- Quick check: Solve: 8x = 3 Answer: 0.375. Mistakes it names: 2.67, 24, 5.

### Step 5: Stories to equations
- [ ] The letter is a number: `see n is the number of markers in one pack.; count .work-lines li = 0`
- [ ] Write and solve, with the check: `click Write and solve; see 4n = 36; see n = 36 ÷ 4 = 9; see check: 4 · 9 = 36 ✓`
- [ ] Tickets, in dollars: `click Tickets; click Write and solve; see 3t = 13.50; see $4.50 for each ticket`
- [ ] Edge: a new story hides the equation: `click Write and solve; click Bus; see Write and solve; count .work-lines li = 0`
- Quick check: 6 packs of pens hold 42 pens in all, the same number in each. Let m be the number of pens in one pack. Which equation fits? Answer: “6m = 42”. Mistakes it names: “m + 6 = 42”, “42 · 6 = m”, “6p = 42m”.

## Chapter 3: Letters stand for numbers · `learn/expressions.html` · Lessons 6–7

### Step 1: Writing expressions
- [ ] 5 more than n, with n = 20: `see n + 5 = 20 + 5 = 25`
- [ ] Order matters in subtraction: `click 5 less than n; see n − 5 = 20 − 5 = 15; click n subtracted from 40; see 40 − n = 40 − 20 = 20`
- [ ] 5 times n: `click 5 times n; slide n = 30; see 5n = 5 · 30 = 150`
- [ ] Edge: the smallest n gives 0: `click 5 less than n; slide n = 5; see n − 5 = 5 − 5 = 0`
- [ ] n divided by 5: `click n divided by 5; slide n = 15; see n ÷ 5 = 15 ÷ 5 = 3`
- Quick check: Which expression means “7 less than t”? Answer: “t − 7”. Mistakes it names: “7 − t”, “7t”.

### Step 2: Coefficients
- [ ] x = 4: 3x is 12, not 34: `see 3x is 3 · 4 = 12, not 34; see 6 + 3 · 4`
- [ ] x = 7: `click x: one more ×3; see 3x is 3 · 7 = 21, not 37; see 3.5`
- [ ] Edge: at 10 there's no “not 310”: `click x: one more ×8; see 3x is 3 · 10 = 30.; nosee not 310`
- [ ] Edge: x = 0: `click x: one less ×5; see 3x is 3 · 0 = 0`
- Quick check: What is 10 + 2x when x = 3? Answer: 16. Mistakes it names: 33, 36, 15.

### Step 3: Percentages with letters
- [ ] 40%: 0.4x = 30, with the whole asked: `see 0.4x = 30; count .qb = 1; nosee 30 ÷ 0.4`
- [ ] Solve it shows the whole and the check: `click Solve it; see x = 30 ÷ 0.4 = 75; see check: 40% of 75 is 0.4 · 75 = 30 ✓; count .qb = 0`
- [ ] 10% makes a big tank: `click 10%; click Solve it; see x = 30 ÷ 0.1 = 300`
- [ ] 75%: `click 75%; click Solve it; see A full tank holds 40 liters`
- Quick check: 18 seats in a theater are filled. That’s 30% of the seats. How many seats are there? Answer: 60 seats. Mistakes it names: 5.4, 0.6, 48.

## Chapter 4: Equal and equivalent · `learn/equivalent.html` · Lesson 8

### Step 1: Test values
- [ ] At x = 2 they agree, which isn't enough: `see Equal at x = 2.; see doesn’t make them equivalent; count tbody tr = 1`
- [ ] One more value shows they aren't equivalent: `click x: one more; see Not equivalent.; see At x = 3, 2x is 6 but x + 2 is 5; count tbody tr = 2`
- [ ] x + x + x and 3x are equal for every value tried: `click x + x + x and 3x; click x: one more ×3; see Equal for every value you tried.; count tbody tr = 4`
- [ ] 4x and x + 12: `click 4x and x + 12; see Not equivalent.`
- [ ] Edge: a new pair clears the table: `click x: one more; click 4x and x + 12; count tbody tr = 1`
- [ ] Edge: x stops at 0: `click x: one less ×4; see 2 · 0 = 0`
- Quick check: Lin says 2x and x + 2 are equivalent, because when x = 2, both are 4. Is Lin right? Answer: “No: at x = 3 they’re 6 and 5”. Mistakes it names: “Yes: they’re equal at x = 2”, “Yes: they use the same numbers”.

### Step 2: Pictures that prove it
- [ ] x + x + x is 3 pieces: `count rect.tape = 3; see 3 + 3 + 3 = 9`
- [ ] 7x − 2x: 2 of 7 pieces crossed out: `click 7x − 2x; count rect.tape.gap = 2; count path.xr-cut = 2; see 7 · 3 − 2 · 3 = 15`
- [ ] Sliding x keeps them equal: `click 2x + 3x; slide x = 8; see 2 · 8 + 3 · 8 = 40; see 5 · 8 = 40`
- [ ] Edge: x = 1: `slide x = 1; see 1 + 1 + 1 = 3`
- Quick check: Which expression is equivalent to 8x − 3x? Answer: “5x”. Mistakes it names: “5”, “11x”.

## Chapter 5: The distributive property · `learn/distributive.html` · Lessons 9–11

### Step 1: Split a rectangle
- [ ] One piece is hard: `see 6 · 45 = ?; count .qb = 1`
- [ ] 40 + 5: `click 40 + 5; see 6 · 45 = 6 · 40 + 6 · 5 = 240 + 30 = 270`
- [ ] Every split gives 270: `click 20 + 25; see 120 + 150 = 270; click 30 + 15; see 180 + 90 = 270`
- Quick check: Which is equal to 8 · 26? Answer: “8 · 20 + 8 · 6”. Mistakes it names: “8 · 20 + 6”, “8 · 2 + 8 · 6”.

### Step 2: With a letter
- [ ] 3(x + 4) = 3x + 12, checked at x = 6: `see 3(x + 4) = 3x + 12; see 3(6 + 4) = 3 · 10 = 30`
- [ ] 5(x + 2) at x = 10: `click 5(x + 2); slide x = 10; see 5(x + 2) = 5x + 10; see 5 · 10 + 10 = 50 + 10 = 60`
- [ ] Edge: x = 1: `slide x = 1; see 3(1 + 4) = 3 · 5 = 15`
- Quick check: Which is equivalent to 4(x + 5)? Answer: “4x + 20”. Mistakes it names: “4x + 5”, “x + 20”.

### Step 3: Backwards: take out a factor
- [ ] 2 works, but isn't the greatest: `see 12x + 18 = 2(6x + 9); see still have a common factor, 3`
- [ ] 6 is the greatest common factor: `click Take out 6; see 12x + 18 = 6(2x + 3); see 6 is the greatest common factor of 12 and 18`
- [ ] 4 doesn't go into 18: `click Take out 4; see 4 doesn’t go evenly into 18; see 4(? + ?)`
- [ ] Edge: a new expression starts at the first factor: `click Take out 6; click 8x + 20; pressed Take out 2; see 8x + 20 = 2(4x + 10)`
- [ ] 5 doesn't go into 6: `click 6x + 15; click Take out 5; see 5 doesn’t go evenly into 6`
- Quick check: Which is equivalent to 10x + 15, written with the greatest common factor? Answer: “5(2x + 3)”. Mistakes it names: “5(2x + 15)”, “10(x + 5)”.

### Step 4: Subtraction, and finding a mistake
- [ ] The strip taken away: `see 5(x − 2) = 5x − 10; see 5 · 5 = 25, and 35 − 10 = 25 ✓; count rect.as-part.cut = 1`
- [ ] 4(x − 3) at x = 10: `click 4(x − 3); slide x = 10; see 4(x − 3) = 4x − 12; see 4 · 7 = 28, and 40 − 12 = 28 ✓`
- [ ] Edge: the smallest x: `slide x = 4; see 5 · 2 = 10, and 20 − 10 = 10 ✓`
- Quick check: Noah wrote 3(x − 4) = 3x − 4. What went wrong? Answer: “The 3 should multiply the 4 too: 3x − 12”. Mistakes it names: “Nothing: it’s right”, “It should be 3x + 12”.

## Chapter 6: Meaning of exponents · `learn/exponents.html` · Lessons 12–13

### Step 1: Repeated multiplication
- [ ] 3 folds in half make 8 layers: `see 8 layers; count line.crease = 4`
- [ ] 7 folds is the most: `click Folds: one more ×6; see 128 layers; count line.crease = 22`
- [ ] Thirds: `click In thirds; see 3 · 3 · 3; see 27 layers; count line.crease = 10`
- [ ] Edge: thirds stop at 4 folds: `click In thirds; click Folds: one more ×5; see 81 layers`
- [ ] Edge: 1 fold: `click Folds: one less ×4; see 1 fold in half; see = 2 layers`
- Quick check: What is 43? Answer: 64. Mistakes it names: 12, 7, 81, 16.

### Step 2: Squares and cubes
- [ ] A 3 cm square: `see 9 square cm; count rect.rg = 9`
- [ ] A 3 cm cube: `click Cube; see 27 cubic cm`
- [ ] Edge: side 6 is the most: `click Side: one more ×5; see 36 square cm; count rect.rg = 36`
- [ ] Edge: side 1: `click Cube; click Side: one less ×4; see 1 cubic cm`
- Quick check: A cube is 5 inches on each edge. What is its volume? Answer: 125 cubic inches. Mistakes it names: 15, 25, 150.

### Step 3: A part of a part
- [ ] Half of a half of a half: one part of 8: `see 1/8 of the square; count line.crease = 4; count rect.part-on = 1`
- [ ] Thirds: `click 1 / 3; see 1/27 of the square`
- [ ] Edge: thirds stop at an exponent of 4: `click 1 / 3; click Exponent: one more ×4; see 1/81 of the square`
- [ ] Edge: halves go to 6: `click Exponent: one more ×5; see 1/64 of the square`
- Quick check: What is (2/3)2? Answer: 0.44. Mistakes it names: 1.33, 0.22, 0.67.

## Chapter 7: Evaluating expressions with exponents · `learn/evaluate.html` · Lessons 14–15

### Step 1: Exponents first
- [ ] It starts with the exponent marked: `count mark = 1; see The marked part is done next.`
- [ ] Two steps finish it: `click Next step ×2; see = 48; disabled Next step; count mark = 0`
- [ ] Parentheses come first: `tap button[data-m="b"]; click Next step; see Then the exponent`
- [ ] Start over: `click Next step; click Start over; count .work-lines li = 1; enabled Next step`
- [ ] Dividing: `tap button[data-m="e"]; click Next step ×2; see 18 ÷ 32 = 2.; see = 18 ÷ 9`
- Quick check: What is 5 + 23? Answer: 13. Mistakes it names: 343, 11.

### Step 2: Letters with exponents
- [ ] At x = 2, x² and 2x match: `see and 2x are both 4`
- [ ] At x = 3 they don't: `click x: one more; see but 2x is 2 · 3 = 6; see 12 · 12`
- [ ] Edge: x stops at 6: `click x: one more ×5; see 24 · 24; see 576`
- [ ] Edge: x stops at 1: `click x: one less ×2; see 1 · 1 · 1`
- Quick check: What is 6x2 when x = 3? Answer: 54. Mistakes it names: 324, 36.

### Step 3: Solving with exponents
- [ ] x = 3 is too small: `see x = 3 gives 9, too small.`
- [ ] x = 7 works: `click Try x =: one more ×4; see x = 7 works: 49 is 49.`
- [ ] Too big: `click Try x =: one more ×5; see too big`
- [ ] Working backward: `tap button[data-m="two"]; click Work backward; see five 2s multiply to 32, so x = 5.`
- [ ] Edge: a new equation hides it: `click Work backward; tap button[data-m="cube"]; nosee Work backward:`
- Quick check: What value of x makes 3x = 81 true? Answer: 4. Mistakes it names: 27, 78.

## Chapter 8: Two related quantities · `learn/relationships.html` · Lessons 16–18

### Step 1: Table to equation
- [ ] g = 6m, with 3 rows: `see g = 6m; count tbody tr = 3; see 6 · 3 = 18`
- [ ] 8 rows is the most: `click Rows: one more ×6; count tbody tr = 8; see 6 · 8 = 48`
- [ ] Walking: `click Walking; see d = 4t; see independent variable`
- [ ] Edge: 1 row: `click Rows: one less ×3; count tbody tr = 1`
- Quick check: Which equation fits this table? Answer: “y = 5x”. Mistakes it names: “y = x + 8”, “x = 5y”.

### Step 2: Graph it
- [ ] 3 points: `count circle.gq-pt = 3; see The point (3, 18) means 3 minutes and 18 gallons`
- [ ] Draw the line: `click Draw the line; count line.gq-line = 1; see through (0, 0)`
- [ ] Walking, 8 points: `click Walking; click Points: one more ×6; count circle.gq-pt = 8; see (8, 32)`
- [ ] Edge: hide the line: `click Draw the line; click Hide the line; count line.gq-line = 0`
- Quick check: Noah rides a bike: d = 9t, where t is hours and d is miles. What does the point (2, 18) on its graph mean? Answer: “In 2 hours, Noah rides 18 miles”. Mistakes it names: “In 18 hours, Noah rides 2 miles”, “Noah rides 2 miles each hour”.

### Step 3: More relationships
- [ ] Adding 5: `see d = m + 5; count tbody tr = 5; see the difference stays 5`
- [ ] Multiplying by 5: `click Times 5; see p = 5n; see 0 packs hold 0 pens`
- [ ] Edge: up to 6 is the most: `click Up to: one more ×3; count tbody tr = 7; count circle.gq-pt = 7`
- Quick check: Andre is 3 years older than Jada. Let j be Jada’s age and a be Andre’s age, in years. Which equation fits? Answer: “a = j + 3”. Mistakes it names: “a = 3j”, “j = a + 3”.

## Chapter 9: Tables, equations, and graphs · `learn/put-together.html` · Lesson 19

### Step 1: One situation, four ways
- [ ] h = 3 in all four views: `see e = 8 · 3 = 24; see the point (3, 24); count circle.gq-pt.hi = 1; count tbody tr.rev = 1`
- [ ] Bus riders: `click Bus riders; see t = 3 + 12 = 15; see 3 more riders make 15 in all`
- [ ] Edge: one rider: `click Bus riders; click Value: one less ×2; see 1 more rider makes 13 in all`
- [ ] Edge: 0 hours: `click Value: one less ×4; see 0 hours of babysitting earns $0`
- Quick check: Pencils cost $3 each. Which table fits c = 3n, where n is the number of pencils and c is the cost in dollars? Answer: “n: 1, 2, 3 → c: 3, 6, 9”. Mistakes it names: “n: 1, 2, 3 → c: 4, 5, 6”, “n: 3, 6, 9 → c: 1, 2, 3”.

### Step 2: Choose, solve, and check
- [ ] It asks for the wrong line: `see One line has a mistake.; count .solved button = 3`
- [ ] A fine line says so: `click 4t = 180; see This line is fine; see Keep looking.`
- [ ] The wrong line explains the fix: `click t = 180 − 4 = 176; see Here’s the mistake.; see t = 180 ÷ 4 = 45 tickets`
- [ ] Kiran's work: `click Kiran’s work; click b = 12 · 0.25 = 3; see b = 12 ÷ 0.25 = 48 bikes`
- [ ] Edge: another problem starts over: `click t = 180 − 4 = 176; click Kiran’s work; see One line has a mistake.`
- Quick check: Tickets to a school play cost $6 each. Andre’s class collected $138. How many tickets did the class sell? Answer: 23 tickets. Mistakes it names: 828, 132.
