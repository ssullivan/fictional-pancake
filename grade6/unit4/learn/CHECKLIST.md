# Checklist: Learn Dividing Fractions (Grade 6 Unit 4)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–16. Not covered: Lesson 17 (Fitting Boxes into Boxes), a hands-on project, and Lesson 12's info gap, a partner activity.

## Chapter 1: Making sense of division · `learn/meanings.html` · Lessons 1–3

### Step 1: Size of the divisor, size of the quotient
- [ ] 12 ÷ 4 = 3, more than 1, with 3 groups bracketed: `see 12 ÷ 4 = 3; see so more than 1 group of 4 fits in 12: the quotient is more than 1.; count path.gt-br = 3`
- [ ] Edge: a divisor bigger than 12 gives less than 1, half a group: `click 24; see 12 ÷ 24 = 1/2; see the quotient is less than 1.; see of a group`
- [ ] Edge: dividing by 12 gives exactly 1: `click 12; see 12 ÷ 12 = 1; see exactly 1 group fits`
- [ ] Dividing by a fraction less than 1 gives more than 12: `click 1 / 4; see 12 ÷ 1/4 = 48; see the quotient is more than 1.`
- Quick check: Without computing: is 100 ÷ 1/1000 much less than 1, close to 1, or much more than 1? Answer: “Much more than 1”. Mistakes it names: “Much less than 1”, “Close to 1”.

### Step 2: Two meanings of division
- [ ] Shared into 3 boxes: 8 in each box, drawn as 3 parts: `see 24 ÷ 3 = 8: 8 bagels in each box.; count line.gt-sep = 2`
- [ ] 3 in each box: 8 boxes, drawn as 8 parts: `click Fill boxes; see 24 ÷ 3 = 8: 8 boxes.; count line.gt-sep = 7`
- [ ] Edge: the meaning stays when the number changes: `click Fill boxes; click 8; pressed Fill boxes; see 24 ÷ 8 = 3: 3 boxes.`
- [ ] Shared into 2 boxes: `click 2; see 24 ÷ 2 = 12: 12 bagels in each box.`
- Quick check: 36 screws are put into bags, with 4 screws in each bag. 36 ÷ 4 = 9. What does the 9 mean? Answer: “9 bags”. Mistakes it names: “9 screws in each bag”, “9 screws left over”.

### Step 3: Groups, size, and total
- [ ] Total unknown: multiply: `see 3 × 6 1/2 = ?; see 3 × 6 1/2 = 19 1/2 ounces.`
- [ ] Size of each unknown: divide: `click How much in each?; see 6 × ? = 20, so 20 ÷ 6 = ?; see 20 ÷ 6 = 3 1/3 ounces in each.`
- [ ] Number of groups unknown, with a part of a group left over: `click How many groups?; see 40 ÷ 12 = 3 1/3 bottles; see of a group`
- Quick check: Mai has $36 to spend on movie tickets. Each ticket costs $4.50. Which equation finds how many tickets Mai can buy? Answer: “? × 4.50 = 36”. Mistakes it names: “36 × 4.50 = ?”, “? × 36 = 4.50”.

## Chapter 2: How many groups? · `learn/how-many-groups.html` · Lessons 4–6

### Step 1: Pattern blocks
- [ ] 2 hexagons hold 12 triangles: `see 12 × 1/6 = 2, so 2 ÷ 1/6 = 12; count polygon.pb.triangle = 12`
- [ ] 3 hexagons hold 9 rhombuses: `click rhombuses ( 1 / 3 ); click Hexagons: one more; see 3 hexagons hold 9 rhombuses; count polygon.pb.rhombus = 9`
- [ ] Trapezoids are halves: `click trapezoids ( 1 / 2 ); see a trapezoid is 1/2; see 2 hexagons hold 4 trapezoids`
- [ ] Edge: 1 hexagon says “holds”: `click Hexagons: one less; see 1 hexagon holds 6 triangles`
- [ ] Edge: 4 hexagons is the most: `click Hexagons: one more ×3; see 4 hexagons hold 24 triangles; count polygon.pb.triangle = 24`
- Quick check: A hexagon is 1 whole, so a rhombus is 1/3. How many 1/3s are in 1 2/3? Answer: 5 rhombuses. Mistakes it names: 1.67, 3, 0.56.

### Step 2: Groups of a non-unit fraction
- [ ] It starts with no groups: `see Cut 4 into thirds. A group of 2/3 is 2 thirds.; count path.gt-br = 0`
- [ ] 2 groups so far: `click Groups: one more ×2; see 2 groups of 2/3 so far: 2 × 2/3 = 1 1/3.; count path.gt-br = 2`
- [ ] Edge: the tape fills at 6 groups and stops there: `click Groups: one more ×8; see The tape is full: 6 groups of 2/3 make 4.; count path.gt-br = 6`
- [ ] 2 ÷ 2/5 = 5: `click 2 ÷ 2 / 5; click Groups: one more ×5; see 5 groups of 2/5 make 2. 5 × 2/5 = 2, so 2 ÷ 2/5 = 5.`
- [ ] Edge: a new division starts over: `click Groups: one more ×3; click 3 ÷ 3 / 4; see Cut 3 into fourths.; count path.gt-br = 0`
- Quick check: A bag holds 3 pounds of cat food. A cat eats 3/4 pound each week. How many weeks does the bag last? Answer: 4 weeks. Mistakes it names: 2.25, 0.25, 12.

### Step 3: A part of a group left over
- [ ] Before the groups: `see Each whole is 4 fourths, and a group is 3 fourths.; enabled Make the groups; count path.gt-br = 0`
- [ ] 3 1/2 ÷ 3/4: the 2 fourths left are 2/3 of a group, not 2/4: `click Make the groups; see 4 full groups, and 2 fourths left over.; see so the leftover is 2/3 of a group.; see 3 1/2 ÷ 3/4 = 4 2/3; see Not 4 2/4; disabled Make the groups`
- [ ] 3 ÷ 2/5: 1 fifth left is half a group: `click 3 ÷ 2 / 5; click Make the groups; see 7 full groups, and 1 fifth left over.; see 3 ÷ 2/5 = 7 1/2`
- [ ] Edge: picking another division hides the groups: `click Make the groups; click 2 ÷ 3 / 4; enabled Make the groups; count path.gt-br = 0`
- Quick check: A batch of granola uses 2/3 cup of oats. How many batches can be made with 3 cups of oats? Answer: 4.5 batches. Mistakes it names: 4.33, 4, 2, 0.22.

### Step 4: Hops on a ruler
- [ ] It starts at 0: `see Hop 3/8 inch at a time from 0.; count path.hop = 0`
- [ ] 3 hops of 3/8 reach 1 1/8 inches: `click Hops: one more ×3; see 3 hops of 3/8 inch reach 1 1/8 inches: 3 × 3/8 = 1 1/8.; count path.hop = 3`
- [ ] Edge: 1 hop says “reaches” and “inch”: `click Hops: one more; see 1 hop of 3/8 inch reaches 3/8 inch`
- [ ] Edge: 16 hops land on 6 and the hops stop there: `click Hops: one more ×18; see 16 hops land exactly on 6: there are 16 groups of 3/8 in 6; count path.hop = 16`
- [ ] Hops of 3/4 inch: `click 3 / 4 inch; click Hops: one more ×8; see 8 hops land exactly on 6`
- Quick check: How many hops of 3/8 inch go from 0 to 3 3/4 inches? Answer: 10 hops. Mistakes it names: 1.41, 0.1, 30.

## Chapter 3: What fraction of a group? · `learn/fraction-of-group.html` · Lesson 7

### Step 1: Less than one group
- [ ] 6 of 9 cups is 2/3 of a batch: `see 6 cups is 6 of its 9 equal parts: 2/3 of a batch.; see 6 ÷ 9 = 2/3`
- [ ] Edge: 9 cups is exactly 1 batch: `click Amount: one more ×4; see 9 cups is exactly 1 batch`
- [ ] Edge: 1 cup says “cup”: `click Amount: one less ×6; see 1 cup is 1 of its 9 equal parts: 1/9 of a batch.`
- [ ] A batch with a fraction of a pound: `click cookies; see 1/2 pound is exactly 1 batch; click Amount: one less ×2; see 1/4 pound is 2 of its 4 equal parts: 1/2 of a batch.`
- Quick check: One batch of ice cream uses 9 cups of milk. On Friday, Noah used 7 1/2 cups. What fraction of a batch did Noah make? Answer: 0.8333333333333334 of a batch. Mistakes it names: 1.2, 1.5, 67.5.

### Step 2: How many times as much?
- [ ] Whiskers is 2/3 as heavy as Piglio: `see Whiskers is 2/3 as heavy as Piglio.; see ? × 4 = 2 2/3, so 2 2/3 ÷ 4 = 2/3`
- [ ] The other way round is the reciprocal: `click Second to first; see Piglio is 1 1/2 times as heavy as Whiskers.`
- [ ] Songs: `click the short song and the long song; see The short song is 2/5 as long as the long song.; click Second to first; see The long song is 2 1/2 times as long as the short song.`
- [ ] Edge: a whole number of times: `click Clare’s rope and Andre’s rope; click Second to first; see Andre’s rope is 3 times as long as Clare’s rope.`
- Quick check: Andre is walking to a festival 1 5/8 km away and has walked 1/3 km so far. Which question does ? × 1 5/8 = 1/3 answer? Answer: “What fraction of the way has Andre walked?”. Mistakes it names: “What fraction of the way is left?”, “How many more kilometers does Andre have to walk?”, “How long is the trip there and back?”.

## Chapter 4: How much in each group? · `learn/each-group.html` · Lessons 8–9

### Step 1: Part of the group is known
- [ ] It starts with the question: `see 5 cups of iced tea fill 2/3 of a pitcher.; count .qb = 1`
- [ ] One part first: `click Next step; see 2 thirds of the pitcher is 5 cups, so 1 third is 5 ÷ 2 = 2 1/2 cups.; see Now fill the rest of the parts.`
- [ ] Then the whole: `click Next step ×2; see The whole pitcher is 3 thirds: 3 × 2 1/2 = 7 1/2 cups.; see 5 ÷ 2/3 = 7 1/2; disabled Next step; count .qb = 0`
- [ ] Edge: 1 part known skips the dividing: `click 15 fills 1 / 3; click Next step; see 1 third of the pail is 15 cups.; click Next step; see 3 × 15 = 45 cups.`
- [ ] Edge: a fraction fills a fraction: `click 3 / 4 fills 1 / 3; click Next step ×2; see 3 × 3/4 = 2 1/4 miles.`
- [ ] Start over: `click Next step ×2; click Start over; enabled Next step; nosee The whole pitcher`
- Quick check: Mai picked 1 cup of strawberries. That’s enough for 3/4 of a cake. How many cups does Mai need for the whole cake? Answer: 1.3333333333333333 cups. Mistakes it names: 0.75, 0.33, 4.

### Step 2: Two amounts to keep track of
- [ ] How much fills 1 container: `see 2/5 × ? = 3/4, so 3/4 ÷ 2/5 = 1 7/8; see 1 7/8 pounds fill 1 container.`
- [ ] What 1 pound fills, the reciprocal: `click What does 1 fill?; see 1 ÷ 1 7/8 = 8/15; see 1 pound is 8/15 of a container.`
- [ ] Buckets: `click 1 1 / 4 fills 5 / 6; see 1 1/4 ÷ 5/6 = 1 1/2; click What does 1 fill?; see 1 gallon is 2/3 of a bucket.`
- [ ] Bottles: `click 3 / 4 fills 3 / 5; see 3/4 ÷ 3/5 = 1 1/4`
- Quick check: 2/5 kilogram of soil fills 1/3 of a container. How many kilograms of soil fill the whole container? Answer: 1.2 kilograms. Mistakes it names: 0.13, 0.83.

### Step 3: How much for 1?
- [ ] 4/5 kilogram for $2: $2.50 a kilogram: `see $2 ÷ 4/5 = $2 × 5/4 = $2.50; see 1 kilogram (5 fifths) costs $2.50.`
- [ ] More than 1 yard: `click 2 1 / 2 yards for $15; see $15 ÷ 2 1/2 = $15 × 2/5 = $6; see 1 half costs $15 ÷ 5 = $3`
- [ ] Rope: `click 3 / 4 meter for $3; see 1 meter (4 fourths) costs $4.`
- [ ] Cheese: `click 1 1 / 4 pounds for $10; see 1 pound (4 fourths) costs $8.`
- Quick check: 3 1/2 yards of fabric cost $21. How much does 1 yard cost? Answer: 6 dollars. Mistakes it names: 73.5, 3, 0.17.

## Chapter 5: Dividing fractions · `learn/algorithm.html` · Lessons 10–11

### Step 1: Dividing by a whole number
- [ ] 12 ÷ 3 and 12 × 1/3 are both 4: `see 12 ÷ 3 = 4 and 12 × 1/3 = 12/3 = 4; count path.gt-br = 4`
- [ ] Dividing by 6: `click 6; see 12 ÷ 6 = 2 and 12 × 1/6 = 12/6 = 2; count path.gt-br = 2`
- [ ] Dividing by 2: `click 2; count path.gt-br = 6; see 2 and 1/2 are reciprocals`
- Quick check: Which is the same as 15 ÷ 5? Answer: “15 × 1/5”. Mistakes it names: “15 × 5”, “5 × 1/15”.

### Step 2: Dividing by a unit fraction
- [ ] 3 ÷ 1/4 = 3 × 4 = 12: `see 3 ÷ 1/4 = 3 × 4 = 12; count path.gt-br = 12`
- [ ] Fifths: `click 1 / 5; see 3 ÷ 1/5 = 3 × 5 = 15`
- [ ] Edge: 1 whole says “holds”: `click Wholes: one less ×3; see 1 whole holds 1 × 4 = 4 fourths.`
- [ ] Edge: 6 wholes of eighths is the most: `click 1 / 8; click Wholes: one more ×4; see 6 ÷ 1/8 = 6 × 8 = 48; count path.gt-br = 48`
- Quick check: What is 4 1/2 ÷ 1/4? Answer: 18. Mistakes it names: 1.13, 16, 0.06.

### Step 3: Dividing by a non-unit fraction
- [ ] It starts with whole numbers only: `see How many groups of 2/3 are in 6?; enabled Cut into parts; disabled Make groups; count line.gt-part = 0`
- [ ] Cut into thirds: 18: `click Cut into parts; see Cut each whole into thirds: 6 × 3 = 18 thirds.; disabled Cut into parts; enabled Make groups; count line.gt-part = 12`
- [ ] Groups of 2 thirds: 9: `click Cut into parts; click Make groups; see A group of 2/3 is 2 thirds: 18 ÷ 2 = 9 groups.; see 6 ÷ 2/3 = 6 × 3 ÷ 2 = 9.`
- [ ] Edge: a divisor more than 1 leaves a part of a group: `click 1 1 / 3; click Cut into parts; click Make groups; see 6 ÷ 1 1/3 = 6 × 3 ÷ 4 = 4 1/2.`
- [ ] Fifths: `click 2 / 5; click Cut into parts; click Make groups; see 30 ÷ 2 = 15 groups.`
- [ ] Start over: `click Cut into parts; click Start over; enabled Cut into parts; disabled Make groups`
- Quick check: Which expression is the same as 6 ÷ 3/4? Answer: “6 × 4 ÷ 3”. Mistakes it names: “6 ÷ 4 × 3”, “6 ÷ 4 ÷ 3”, “6 × 4 × 3”.

### Step 4: Multiply by the reciprocal
- [ ] It starts with the first line: `see Write each number as a fraction: 8/9 ÷ 4 = 8/9 ÷ 4/1.; see Press Next step to keep going.`
- [ ] All four lines: `click Next step ×3; see Multiply the tops and the bottoms: 8/36 = 2/9.; see Check by multiplying back: 2/9 × 4 = 8/9.; disabled Next step`
- [ ] Two fractions: `click 3 / 4 ÷ 1 / 2; see Both numbers are fractions: 3/4 ÷ 1/2.; click Next step ×2; see 6/4 = 1 1/2.`
- [ ] A mixed number: `click 3 1 / 3 ÷ 2 / 9; click Next step ×2; see 10/3 × 9/2; see 90/6 = 15.`
- [ ] Edge: dividing by a whole number flips it to a unit fraction: `click 6 2 / 5 ÷ 3; click Next step ×2; see 32/5 × 1/3; see 32/15 = 2 2/15.`
- [ ] Start over: `click Next step ×2; click Start over; nosee Multiply the tops; enabled Next step`
- Quick check: What is 15/4 ÷ 5/8? Answer: 6. Mistakes it names: 2.34, 0.17, 0.43.

### Step 5: Same-size pieces
- [ ] Different-size pieces first: `see The pieces are different sizes; count rect.fs.on = 4`
- [ ] Same-size pieces: 6 eighths ÷ 1 eighth: `click Same-size pieces; see 6/8 ÷ 1/8 = 6 ÷ 1 = 6; see 3/4 is 6 eighths and 1/8 is 1 eighth.; count rect.fs.on = 7; disabled Same-size pieces`
- [ ] Tenths: `click 9 / 10 ÷ 3 / 5; click Same-size pieces; see 9/10 ÷ 6/10 = 9 ÷ 6 = 1 1/2`
- [ ] Neither denominator works for both: `click 1 / 2 ÷ 1 / 3; click Same-size pieces; see 3/6 ÷ 2/6 = 3 ÷ 2 = 1 1/2`
- [ ] Edge: a dividend more than 1: `click 1 1 / 2 ÷ 3 / 8; click Same-size pieces; see 12/8 ÷ 3/8 = 12 ÷ 3 = 4`
- [ ] Start over: `click Same-size pieces; click Start over; enabled Same-size pieces; see The pieces are different sizes`
- Quick check: What is 5/6 ÷ 1/3? Answer: 2.5. Mistakes it names: 0.28, 0.4, 2.

### Step 6: Does the answer make sense?
- [ ] 3/4 ÷ 2/3: more than 1, and more than 3/4: `see 3/4 ÷ 2/3 = 1 1/8; see 3/4 is more than 2/3, so more than 1 group fits: more than 1.; see 2/3 is less than 1, so there are more groups than wholes: more than 3/4.`
- [ ] 1/2 ÷ 3: less than 1, and less than 1/2: `click 1 / 2; click 3; see 1/2 ÷ 3 = 1/6; see not even 1 group fits: less than 1.; see fewer groups than wholes: less than 1/2.`
- [ ] 2 1/2 ÷ 1/3: `click 2 1 / 2; click 1 / 3; see 2 1/2 ÷ 1/3 = 7 1/2; pressed 2 1 / 2; pressed 1 / 3`
- Quick check: Clare worked out 4/3 ÷ 5/2 = 10/3. What do you think? Answer: “It can’t be right: 4/3 is less than 5/2, so the answer is less than 1.”. Mistakes it names: “It’s right: 4/3 × 5 = 20/3, and 20/3 ÷ 2 = 10/3.”, “It can’t be right: dividing always makes a number smaller, so it’s less than 4/3.”.

## Chapter 6: Lengths and areas · `learn/lengths-areas.html` · Lessons 12–13

### Step 1: How many times as long?
- [ ] The question first: `see How many times as long as the short song (1 1/2 minutes) is the long song (3 3/4 minutes)?`
- [ ] Edge: 1 copy says “reaches”: `click Copies: one more; see 1 copy of the short song reaches 1 1/2 minutes.`
- [ ] 2 copies: `click Copies: one more ×2; see 2 copies of the short song reach 3 minutes.`
- [ ] The answer: `click Copies: one more ×4; see 3 3/4 ÷ 1 1/2 = 2 1/2: the long song is 2 1/2 times as long as the short song.`
- [ ] A whole number of copies: `click 4 1 / 2 and 3 / 4 feet; click Copies: one more ×6; see the shelf is 6 times as long as a book.`
- Quick check: A zookeeper is 6 1/4 feet tall. A young giraffe is 9 3/8 feet tall. How many times as tall as the zookeeper is the giraffe? Answer: 1.5 times as tall. Mistakes it names: 3.13, 0.67, 58.59.

### Step 2: Area with fractional sides
- [ ] 3 1/2 by 2 1/4 is 126 small squares: `see 3 1/2 × 2 1/4 = 14/4 × 9/4 = 126/16 = 7 7/8; count rect.rg = 126`
- [ ] Edge: the smallest is 1 small square: `click Width: one less ×14; click Height: one less ×9; see 1/4 × 1/4 = 1/4 × 1/4 = 1/16; see There is 1 × 1 = 1 small square; count rect.rg = 1`
- [ ] Edge: the biggest, a whole number of square inches: `click Width: one more ×3; click Height: one more ×4; see 4 × 3 = 16/4 × 12/4 = 192/16 = 12; count rect.rg = 192`
- [ ] Whole-inch sides: `click Width: one less ×6; click Height: one less; see 2 × 2 = 8/4 × 8/4 = 64/16 = 4`
- Quick check: A rectangle is 2 1/2 inches by 4 3/4 inches. What is its area? Answer: 11.875 square inches. Mistakes it names: 8, 7.25, 14.5.

### Step 3: Find a missing side
- [ ] Area 11, side 3 2/3: `see 3 2/3 × ? = 11; see 11 ÷ 3 2/3 = 11 × 3/11 = 3 meters.`
- [ ] Area 50 5/8, side 11 1/4: `click Area 50 5 / 8 , side 11 1 / 4; see = 4 1/2 inches.`
- [ ] Tiles that fit exactly: `click 10 1 / 2 ft in 1 1 / 2 ft tiles; see 10 1/2 ÷ 1 1/2 = 7. The tiles fit exactly.`
- [ ] Edge: tiles that don’t fit exactly: `click 6 1 / 2 ft in 1 1 / 2 ft tiles; see 6 1/2 ÷ 1 1/2 = 4 1/3. That’s 4 whole tiles and 1/3 of a tile`
- Quick check: A rectangle has an area of 17 1/2 square inches. Its shorter side is 3 1/2 inches. How long is its longer side? Answer: 5 inches. Mistakes it names: 14, 61.25, 0.2.

## Chapter 7: Triangles and prisms · `learn/triangles-prisms.html` · Lessons 14–15

### Step 1: Triangles with fractional sides
- [ ] Base 4 1/2, height 3: `see 1/2 × 4 1/2 × 3 = 6 3/4; see = 6 3/4 square cm.; see 13 1/2 ÷ 4 1/2 = 3.`
- [ ] Edge: the smallest: `click Base: one less ×9; click Height: one less ×6; see 1/2 × 1/2 × 1/2 = 1/8`
- [ ] Edge: the biggest: `click Base: one more ×2; click Height: one more ×3; see 1/2 × 5 × 4 = 10`
- Quick check: A triangle has an area of 7 7/8 square cm and a base of 5 1/4 cm. What is its height? Answer: 3 cm. Mistakes it names: 1.5, 20.67, 0.33.

### Step 2: Cubes with fractional edges
- [ ] Half-inch cubes in a 1-inch cube: `see 2 × 2 × 2 = 8 small cubes; see 8 × 1/8 = 1 cubic inch`
- [ ] Third-inch cubes: `click 1 / 3 inch; see 27 small cubes; see 1/27 cubic inch`
- [ ] A 2-inch cube: `click Big cube edge: one more; see 4 × 4 × 4 = 64 small cubes; see 64 × 1/8 = 8 cubic inches`
- [ ] Edge: the most, 3 inches in quarter-inch cubes: `click 1 / 4 inch; click Big cube edge: one more ×3; see 12 × 12 × 12 = 1728 small cubes; see = 27 cubic inches`
- Quick check: Clare builds a cube with 4-inch edges out of little cubes with 1/2-inch edges. How many little cubes does Clare need? Answer: 512 cubes. Mistakes it names: 8, 64, 128.

### Step 3: Volume of a box
- [ ] 1 1/2 by 1 by 2 1/2: `see 3 × 2 × 5 = 30 cubes; see 30 × 1/8 = 3 3/4 cubic inches; see 1 1/2 × 1 × 2 1/2 = 3 3/4`
- [ ] Edge: one cube: `click Length: one less ×3; click Width: one less ×2; click Height: one less ×5; see 1 × 1 × 1 = 1 cube,; see 1/8 cubic inch.`
- [ ] Edge: the biggest: `click Length: one more ×6; click Width: one more ×5; click Height: one more ×2; see 8 × 6 × 6 = 288 cubes; see = 36 cubic inches`
- Quick check: A pool shaped like a rectangular prism is 24 feet long and 15 feet wide. The water is 1 1/3 feet deep. What is the volume of the water? Answer: 480 cubic feet. Mistakes it names: 360, 40.33, 270.

## Chapter 8: Putting it together · `learn/put-together.html` · Lesson 16

### Step 1: Which operation?
- [ ] Half of 3/4 liter: multiply: `see Andre had 3/4 liter of water; see 1/2 × 3/4 = 3/8; see of a group`
- [ ] What fraction of the way: divide: `click Walk; see 1/2 ÷ 3/4 = 2/3`
- [ ] How many times the goal: divide: `click Goal; see 3/4 ÷ 1/2 = 1 1/2`
- [ ] 3/4 of a park: multiply: `click Park; see 3/4 × 1/2 = 3/8; see 3/8 square mile.`
- Quick check: An orange has about 1/4 cup of juice. How many oranges does it take to make 2 1/2 cups of juice? Which equation fits? Answer: “2 1/2 ÷ 1/4 = ?”. Mistakes it names: “1/4 ÷ 2 1/2 = ?”, “2 1/2 × 1/4 = ?”, “? × 2 1/2 = 1/4”.

### Step 2: Two amounts, one answer
- [ ] Mai: the butter runs out before 1 batch: `see Flour is enough for 2 ÷ 3/4 = 2 2/3 batches. Butter is enough for 1/4 ÷ 1/3 = 3/4 batches.; see Mai can make 0 whole batches: the butter runs out first.`
- [ ] Kiran: `click Kiran; see Kiran can make 1 whole batch: the flour runs out first.`
- [ ] Clare: `click Clare; see Clare can make 1 whole batch: the flour runs out first.`
- [ ] All three together: `click All three; see Together they can make 4 whole batches: the butter runs out first.`
- Quick check: Using the same recipe, Han has 3 cups of flour and 1 cup of butter. How many whole batches can Han make? Answer: 3 batches. Mistakes it names: 4, 7, 2.25.
