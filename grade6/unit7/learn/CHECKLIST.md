# Checklist: Learn Rational Numbers (Grade 6 Unit 7)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, sliders end to end, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–19. Not covered: the partner activities (info gaps and card sorts) and the open-ended drawing in Lesson 19.

## Chapter 1: Positive and negative numbers · `learn/signed.html` · Lessons 1–2

### Step 1: Above and below zero
- [ ] It starts at −4 °C, below zero: `see −4 °C is 4 degrees below zero; see Temperatures below zero are negative; pressed Temperature`
- [ ] Up to 0, which is neither positive nor negative: `click Temperature: one more ×4; see 0 °C is zero; see Zero is neither positive nor negative`
- [ ] Above zero is positive: `click Temperature: one more ×9; see 5 °C is 5 degrees above zero`
- [ ] Elevation starts below sea level: `click Elevation; see −100 m is 100 meters below sea level; pressed Elevation`
- [ ] Edge: elevation stops at −300 and 300: `click Elevation; click Elevation: one less ×6; see −300 m is 300 meters below; click Elevation: one more ×14; see 300 m is 300 meters above`
- [ ] Edge: temperature stops at −15 and 15: `click Temperature: one less ×20; see −15 °C is 15 degrees below; click Temperature: one more ×40; see 15 °C is 15 degrees above`
- Quick check: A diver is 12 meters below sea level. What number is the diver’s elevation? Answer: -12 m. Mistakes it names: 12.

### Step 2: Opposites
- [ ] It starts at −3.5 with the opposite hidden: `see −3.5 is 3.5 to the left of 0. Where is its opposite?; count circle.pt = 1`
- [ ] Show the opposite: the same distance on the other side: `click Show the opposite; see The opposite of −3.5 is 3.5; count circle.pt = 2; count path.sl-span = 2; enabled Hide the opposite`
- [ ] Moving keeps the opposite shown: `click Show the opposite; click Number: one more ×2; see The opposite of −2.5 is 2.5`
- [ ] Edge: 0 is its own opposite: `click Show the opposite; click Number: one more ×7; see 0 is its own opposite; count circle.pt = 1`
- [ ] Edge: the number stops at −6 and 6: `click Number: one less ×10; see −6 is 6 to the left; click Number: one more ×30; see 6 is 6 to the right`
- Quick check: What is the opposite of −6.5? Answer: 6.5. Mistakes it names: -6.5.

### Step 3: Between the whole numbers
- [ ] Halves: the point at −1 1/2: `see −1 1/2 = −1.5; see 3 ticks of 1/2 to the left of 0; pressed Halves`
- [ ] One tick right lands on a whole number: `click Move the point: one more; see 2 ticks of 1/2 to the left of 0: −1.`
- [ ] Quarters: −3/4 is between 0 and −1: `click Quarters; see −3/4 = −0.75; see between 0 and −1`
- [ ] Tenths: `click Tenths; see −3/10 = −0.3`
- [ ] Edge: the point stops at the ends: `click Quarters; click Move the point: one less ×10; see 8 ticks of 1/4 to the left of 0: −2.; click Move the point: one more ×20; see 8 ticks of 1/4 to the right of 0: 2.`
- [ ] Edge: a new split starts the point over: `click Move the point: one more ×3; click Tenths; click Halves; see −1 1/2 = −1.5`
- Quick check: A point is halfway between −3 and −2. What number is it? Answer: -2.5. Mistakes it names: 2.5, -3.5, -1.5.

## Chapter 2: Comparing and ordering · `learn/compare.html` · Lessons 3–4

### Step 1: Farther right is greater
- [ ] Two negatives: −5 < −2, even though 5 > 2: `see −5 < −2; see −5 is to the left of −2; see 5 is more than 2, but −5 is less than −2`
- [ ] Equal numbers: `click Second number: one less ×3; see −5 = −5; see Both numbers are −5`
- [ ] A negative and a positive: `click Second number: one more ×6; see −5 < 4; nosee even when the digits are bigger`
- [ ] The comparison turns around when the first passes the second: `click First number: one more ×5; see 0 > −2`
- [ ] Edge: the numbers stop at −8 and 8: `click First number: one less ×5; see −8 < −2; click First number: one more ×20; see 8 > −2`
- Quick check: Which is true? Answer: “−7 < −4”. Mistakes it names: “−7 > −4”, “−7 = −4”.

### Step 2: Two ways to say it
- [ ] It reads −6 < 1 first: `see −6 < 1 reads “−6 is less than 1.”; pressed −6 and 1`
- [ ] Flip it: `click Flip it; see 1 > −6 reads “1 is greater than −6.”`
- [ ] Two negatives, as temperatures: `click −7 and −2.5; see −7 < −2.5; see −7 °C is colder than −2.5 °C`
- [ ] Edge: a new pair starts unflipped: `click Flip it; click −0.5 and 3; see −0.5 < 3 reads`
- Quick check: Which says the same thing as −4 < 1? Answer: “1 > −4”. Mistakes it names: “−4 > 1”, “1 < −4”.

### Step 3: Putting numbers in order
- [ ] Before placing, the numbers are as given and the line is empty: `see Where does each number go on the line?; count circle.pt = 0; count .chip = 5`
- [ ] On the line, least to greatest is left to right: `click Put them on the line; see Least to greatest is left to right: −3, −1.5, 0, 2.5, 4.; count circle.pt = 5; count .chip.found = 5`
- [ ] Temperatures: the coldest comes first: `click Temperatures; click Put them on the line; see −12 °F, −8 °F, −1 °F, 0 °F, 3 °F; see The coldest is −12 °F.`
- [ ] Edge: take them off, and a new set starts off the line: `click Put them on the line; click Take them off the line; count circle.pt = 0; click Put them on the line; click Decimals; count circle.pt = 0`
- Quick check: Which list is in order from least to greatest? Answer: “−5.5, −2, 0.5, 3”. Mistakes it names: “0.5, −2, 3, −5.5”, “3, 0.5, −2, −5.5”.

## Chapter 3: Negative numbers in the world · `learn/contexts.html` · Lesson 5

### Step 1: What the sign means
- [ ] It starts with $20: `see Balance: $20; see you have $20 in the account`
- [ ] Taking out more than is there owes the bank: `click Withdraw $10 ×3; see Balance: −$10; see you owe the bank $10; count .chip = 3`
- [ ] Exactly $0: `click Withdraw $10 ×2; see A balance of $0`
- [ ] A deposit is positive: `click Deposit $10; see +$10; see Balance: $30`
- [ ] Edge: withdrawals stop at −$50 and deposits at $50: `click Withdraw $10 ×7; disabled Withdraw $10; see Balance: −$50; click Start over; click Deposit $10 ×3; disabled Deposit $10`
- [ ] Start over clears the history: `click Withdraw $10 ×2; click Start over; count .chip = 0; see Balance: $20`
- Quick check: Which bank balance means owing the most money? Answer: “−$45”. Mistakes it names: “−$15”, “$30”.

### Step 2: Deeper and colder
- [ ] The submarine is deeper than the whale: `see −120 < −80; see The submarine (−120 m) is deeper than the whale (−80 m)`
- [ ] The same depth: `click Submarine: one more ×2; see −80 = −80; see The submarine and the whale are both at −80 m.`
- [ ] Then the whale is deeper: `click Submarine: one more ×4; see The whale (−80 m) is deeper than the submarine (−40 m)`
- [ ] Temperatures: `click Temperatures; see Tonight (−8 °F) is colder than last night (−3 °F): −8 < −3.`
- [ ] Edge: the submarine stops at −200 and 0: `click Submarine: one less ×6; see the submarine −200 m; click Submarine: one more ×12; see deeper than the submarine (0 m)`
- Quick check: A submarine is at −150 m and a whale is at −80 m. Which statement is true? Answer: “−150 < −80, so the submarine is deeper”. Mistakes it names: “−150 > −80, so the submarine is higher”, “−80 < −150, so the whale is deeper”.

## Chapter 4: Absolute value · `learn/absolute.html` · Lessons 6–7

### Step 1: Distance from zero
- [ ] |−7| = 7, and absolute value is never negative: `see |−7| = 7; see −7 is 7 units from 0; see never negative`
- [ ] A positive number: `click Number: one more ×10; see |3| = 3; nosee never negative`
- [ ] Edge: 0 is 0 from 0: `click Number: one more ×7; see |0| = 0; count path.sl-span = 0`
- [ ] Edge: the number stops at −10 and 10: `click Number: one less ×5; see |−10| = 10; click Number: one more ×25; see |10| = 10`
- Quick check: What is |−9|? Answer: 9. Mistakes it names: -9.

### Step 2: Two numbers, one distance
- [ ] Two numbers 5 from 0: `see |5| = 5 and |−5| = 5; see Two numbers are 5 from 0: 5 and −5; count circle.pt = 2`
- [ ] Edge: only 0 is 0 from 0: `click Distance from 0: one less ×6; see Only one number is 0 from 0; count circle.pt = 1`
- [ ] Edge: the distance stops at 9: `click Distance from 0: one more ×6; see Two numbers are 9 from 0`
- Quick check: Which numbers have an absolute value of 4? Answer: “4 and −4”. Mistakes it names: “only 4”, “only −4”.

### Step 3: Less, but farther
- [ ] Andre’s balance is less, but Andre owes more: `see −30 < −10, but |−30| > |−10|; see Andre owes more`
- [ ] Jada’s drops below Andre’s: `click Jada’s balance: one less ×6; see −30 > −40; see Jada owes more`
- [ ] The same balance: `click Jada’s balance: one less ×4; see they owe the same, $30`
- [ ] Edge: both at $0: `click Andre’s balance: one more ×6; click Jada’s balance: one more ×2; see nobody owes anything; count path.sl-span = 0`
- [ ] Edge: balances stop at −$60: `click Andre’s balance: one less ×8; see Andre owes more: $60`
- Quick check: Lin’s bank balance is −$40 and Noah’s is −$25. Who owes more? Answer: “Lin”. Mistakes it names: “Noah”, “They owe the same”.

## Chapter 5: Inequalities · `learn/inequalities.html` · Lessons 8–10

### Step 1: Graphing inequalities
- [ ] x > 2: an open circle and a ray to the right: `see every number greater than 2, so the ray goes right; see its circle is open; pressed >; count circle.sl-end.open = 1`
- [ ] ≤ fills the circle and points left: `click ≤; see the ray goes left; see filled in; count circle.sl-end.open = 0`
- [ ] Moving the boundary: `click Boundary: one less ×5; see x > −3`
- [ ] Edge: the boundary stops at −5 and 5: `click Boundary: one less ×10; see x > −5:; click Boundary: one more ×12; see x > 5:`
- Quick check: Which inequality matches the graph? Answer: “x ≥ −1”. Mistakes it names: “x > −1”, “x ≤ −1”.

### Step 2: Testing solutions
- [ ] 0 isn’t a solution of x < −2: `see Is 0 < −2? No; count .chip = 1; count .chip.found = 0`
- [ ] −2.5 is, and every try is listed: `click Try x =: one less ×5; see Is −2.5 < −2? Yes; count .chip = 6; count .chip.found = 1`
- [ ] The boundary of < isn’t a solution: `click Try x =: one less ×4; see the boundary isn’t a solution of <`
- [ ] The boundary of ≥ is: `click x ≥ 1.5; click Try x =: one more ×3; see ≥ includes 1.5 itself`
- [ ] Edge: a new inequality clears the list: `click Try x =: one less ×2; click x ≤ −3; count .chip = 1`
- [ ] Edge: tries stop at −5 and 5: `click Try x =: one less ×12; see Is −5 < −2? Yes; click Try x =: one more ×25; see Is 5 < −2? No`
- Quick check: Which value of x is a solution to x ≤ −3? Answer: “−3”. Mistakes it names: “−2”, “3”.

### Step 3: Inequalities in stories
- [ ] Roller coaster: at least 48 includes 48: `see Riders must be at least 48 inches tall; see h ≥ 48; see 48 is included`
- [ ] Elevator: only whole numbers, so dots: `click Elevator; see p ≤ 12; see not every point on a ray; count circle.pt = 13; count line.sl-ray = 0`
- [ ] Freezer: colder is less: `click Freezer; see t ≤ −18; see colder means less`
- [ ] Sleeping bag: above −10 leaves −10 out: `click Sleeping bag; see t > −10; count circle.sl-end.open = 1`
- Quick check: To ride the go-karts, you must be at least 52 inches tall. Let h be your height in inches. Which inequality says who can ride? Answer: “h ≥ 52”. Mistakes it names: “h > 52”, “h ≤ 52”.

## Chapter 6: The coordinate plane · `learn/plane.html` · Lessons 11–12

### Step 1: Four quadrants
- [ ] (−3, 2) is in Quadrant II: `see (−3, 2) is in Quadrant II; count rect.gq-shade = 1`
- [ ] Quadrant IV: `click x: one more ×6; click y: one less ×4; see (3, −2) is in Quadrant IV`
- [ ] Edge: a point on an axis is in no quadrant: `click y: one less ×2; see (−3, 0) is on the x-axis, so it isn’t in any quadrant; count rect.gq-shade = 0`
- [ ] Edge: the origin: `click x: one more ×3; click y: one less ×2; see (0, 0) is the origin`
- [ ] Edge: x and y stop at −6 and 6: `click x: one less ×5; click y: one more ×6; see (−6, 6) is in Quadrant II`
- Quick check: In which quadrant is the point (4, −7)? Answer: “Quadrant IV”. Mistakes it names: “Quadrant I”, “Quadrant II”, “Quadrant III”.

### Step 2: Reading a point
- [ ] Point A, across and then up: `see From the origin: 4 left, then 3 up; see A is at (−4, 3); pressed Point A`
- [ ] Point C, left and down: `click Point C; see 2 left, then 5 down; see C is at (−2, −5)`
- [ ] Point B, right and down: `click Point B; see 5 right, then 2 down`
- Quick check: Which point is at (−2, 5)? Answer: “A”. Mistakes it names: “B”, “C”, “D”.

### Step 3: Choosing a scale
- [ ] 1 apart: only one point fits: `see P (−8, 4), Q (10, −6), R (4, 12) don’t fit; count circle.gq-pt = 1`
- [ ] 2 apart: all four fit: `click 2 apart; see All four points fit; count circle.gq-pt = 4`
- [ ] 5 apart: they fit, but crowded: `click 5 apart; see they’re crowded near the middle; pressed 5 apart`
- Quick check: The grid lines on the x-axis are 5 apart. A point is 3 grid lines to the left of the y-axis. What is its x-coordinate? Answer: -15. Mistakes it names: -3, 15.

## Chapter 7: Reflections and distances · `learn/distance.html` · Lessons 13–14

### Step 1: Reflecting across an axis
- [ ] Across the x-axis, y changes sign: `see Across the x-axis, (3, −4) lands on (3, 4); pressed Across the x-axis`
- [ ] Both reflections: `click Across the y-axis; see lands on (−3, −4); count circle.gq-pt = 3`
- [ ] Neither: `click Across the x-axis; see Pick an axis to reflect across.; count circle.gq-pt = 1`
- [ ] Edge: a point on the axis stays put: `click y: one more ×4; see (3, 0) is on the x-axis, so reflecting across it leaves it where it is`
- Quick check: The point (−3, 5) is reflected across the x-axis. Where does it land? Answer: “(−3, −5)”. Mistakes it names: “(3, 5)”, “(5, −3)”.

### Step 2: Distance along a grid line
- [ ] Opposite sides of the axis: add: `see distance = 10; see Add their distances to it: |−4| + |6| = 4 + 6 = 10`
- [ ] The same side: subtract: `click First point: one more ×6; see Subtract their distances to it: 6 − 2 = 4`
- [ ] Up and down: `click Up and down; see opposite sides of the x-axis; see (2, −4)`
- [ ] Edge: a point on the axis: `click First point: one more ×4; see One point is on the y-axis`
- [ ] Edge: the same place: `click First point: one more ×10; see 0 apart`
- Quick check: What is the distance between (−4, 3) and (6, 3)? Answer: 10 units. Mistakes it names: 2, -10.

### Step 3: Getting around town
- [ ] Library to pool: `see |2| + |−5| = 2 + 5 = 7; see 7 blocks apart`
- [ ] School to park: `click school to park; see they’re 8 blocks apart`
- [ ] Park to museum: `click park to museum; see they’re 6 blocks apart; pressed park to museum`
- Quick check: On the town map, the bakery is at (−5, −2) and the fire station is at (3, −2). How many blocks apart are they? Answer: 8 blocks. Mistakes it names: 2.

## Chapter 8: Shapes on the coordinate plane · `learn/shapes.html` · Lessons 15, 19

### Step 1: Rectangles from their vertices
- [ ] The rectangle’s sides, perimeter, and area: `see perimeter 24 units · area 35 square units; see Across, from x = −3 to x = 4: |−3| + |4| = 3 + 4 = 7`
- [ ] A side on one side of the axis subtracts: `click Corner x: one less ×5; see from x = −3 to x = −1: 3 − 1 = 2`
- [ ] Edge: a corner on the axis: `click Corner y: one more ×2; see from y = 0 to y = 3: 3 from 0`
- [ ] Edge: the corner stops at x = 6 and y = −5: `click Corner x: one more ×5; click Corner y: one less ×5; see Vertices: (−3, 3), (6, 3), (6, −5), (−3, −5)`
- Quick check: A rectangle has vertices at (−3, 2), (4, 2), (4, −1), and (−3, −1). What is its perimeter? Answer: 20 units. Mistakes it names: 21, 10, 4.

### Step 2: Drawing with points
- [ ] The first point: `see Point 1 of 5: (−4, −4); count .chip = 1`
- [ ] Every point plotted closes the house: `click Next point ×4; see All 5 points are plotted; disabled Next point; count polygon.gq-shape = 1`
- [ ] The star has 10 points: `click Star; click Next point ×9; see All 10 points are plotted`
- [ ] Edge: start over: `click Next point ×2; click Start over; count .chip = 1`
- Quick check: Three vertices of a square are (−2, 1), (2, 1), and (2, −3). Where is the fourth vertex? Answer: “(−2, −3)”. Mistakes it names: “(−3, −2)”, “(2, 3)”.

## Chapter 9: Common factors and multiples · `learn/factors.html` · Lessons 16–18

### Step 1: Common factors
- [ ] 4 bags don’t work: 18 doesn’t split 4 ways: `see 4 fruit bags don’t work; see 18 ÷ 4 = 4 R 2`
- [ ] 6 is the greatest common factor: `click Kits: one more ×2; see 6 fruit bags work; see It’s the greatest common factor`
- [ ] Other amounts: `click 16 and 24; click Kits: one more ×4; see 8 school kits work: each gets 2 pencils and 3 erasers`
- [ ] Edge: 1 kit always works: `click Kits: one less ×5; see 1 fruit bag works`
- [ ] Edge: kits stop at 12: `click Kits: one more ×10; see 12 fruit bags don’t work`
- Quick check: What is the greatest common factor of 16 and 24? Answer: 8. Mistakes it names: 4, 2, 48, 384.

### Step 2: Common multiples
- [ ] 4s and 6s up to 24: `see Both counts land on 12, 24; see The first one, 12, is the least common multiple`
- [ ] Not far enough yet: `click 3s and 5s; click Count up to: one less ×2; see never land on the same number`
- [ ] 6s and 8s: `click 6s and 8s; see The first one, 24`
- [ ] Edge: counting stops at 60: `click Count up to: one more ×10; see common multiples up to 60`
- Quick check: What is the least common multiple of 6 and 8? Answer: 24. Mistakes it names: 48, 2, 14.

### Step 3: Which one fits the story?
- [ ] Kits need a common factor: `see 24 pencils and 36 erasers; click Solve it; see a common factor; see The greatest common factor is 12`
- [ ] Hot dogs need a common multiple: `click Hot dogs; click Solve it; see The least common multiple is 40`
- [ ] Shuttles: `click Shuttles; click Solve it; see The least common multiple is 36`
- [ ] Edge: a new story hides the answer: `click Solve it; click Bracelets; see Decide, then solve it.`
- Quick check: Hot dogs come in packs of 10 and buns in packs of 8. To find the fewest hot dogs to buy with exactly one bun each, what do you need? Answer: “the least common multiple of 10 and 8”. Mistakes it names: “the greatest common factor of 10 and 8”, “10 × 8”.
