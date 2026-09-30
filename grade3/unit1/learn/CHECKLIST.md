# Checklist: Learn Introducing Multiplication (Grade 3 Unit 1)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–20. Not covered: Lesson 21 (Game Night Seating Plan), optional. Graphs use a scale of 2, 5, or 10; factors up to 10.

## Chapter 1: Scaled picture graphs · `learn/picture-graphs.html` · Lessons 1–4

### Step 1: Each picture can show more than 1
- [ ] It starts with each picture showing 2, asking for a tap: `pressed 2 votes; see Each picture shows 2 votes. Tap a row to count it.; count .sticky = 17; count clipPath = 1`
- [ ] A row with half a picture: `tap [data-r="1"]; see Bananas: 3 and a half pictures. Each picture shows 2 votes, and half a picture shows 1.; see Count by 2s: 2, 4, 6, and 1 more. 7 votes.`
- [ ] A row of whole pictures: `tap [data-r="3"]; see Pears: 2 pictures. Each picture shows 2 votes.; see Count by 2s: 2, 4. 4 votes.`
- [ ] Each picture shows 1: a picture for every vote, and no half pictures: `click 1 vote; tap [data-r="0"]; see Apples: 12 pictures, and each one shows 1 vote. 12 votes.; count .sticky = 33; count clipPath = 0`
- [ ] Edge: the tapped row stays when the key changes: `tap [data-r="2"]; click 1 vote; see Grapes: 10 pictures; click 2 votes; see Grapes: 5 pictures`
- Quick check: How many students chose jump rope? Answer: 7 students. Mistakes it names: 4, 6, 8.

### Step 2: Make a scaled picture graph
- [ ] It starts empty, with each picture showing 5: `pressed 5 votes; see Zoo: 0. The table says 20.; count .sticky = 0`
- [ ] + adds a picture of 5 votes: `click Zoo: one more; see Zoo: 5. The table says 20.; count .sticky = 1`
- [ ] Matching the table: `click Zoo: one more ×4; click Museum: one more ×2; click Farm: one more ×3; see Zoo: 20 ✓; see Your graph matches the table, with 9 pictures in all.; count .sticky = 9`
- [ ] Each picture shows 10: the same votes in fewer pictures, with a half: `click Zoo: one more ×4; click Museum: one more ×2; click Farm: one more ×3; click 10 votes; see Each picture shows 10 votes, and half a picture shows 5.; see with 4½ pictures in all.; count clipPath = 1`
- [ ] Edge: − stops at 0 and + stops at 30: `click Museum: one less; see Museum: 0. The table says 10.; click Zoo: one more ×8; see Zoo: 30. The table says 20.`
- Quick check: In a picture graph, each picture shows 10 votes. Soccer got 30 votes. How many pictures go in the soccer row? Answer: 3 pictures. Mistakes it names: 30, 10, 6.

## Chapter 2: Scaled bar graphs · `learn/bar-graphs.html` · Lessons 5–6

### Step 1: Bars on a scale
- [ ] It starts with no bars: `see The table says: Room 1 25, Room 2 40, Room 3 15.; see Room 1: no bar yet.; count rect.bar = 0`
- [ ] A bar halfway between two lines: `tap [data-r="0"][data-v="25"]; see Room 1: 25, halfway between 20 and 30 ✓.; count rect.bar = 1`
- [ ] A bar on a line: `tap [data-r="1"][data-v="40"]; see Room 2: 40, on the 40 line ✓.`
- [ ] A wrong height gets no check mark: `tap [data-r="2"][data-v="20"]; see Room 3: 20, on the 20 line.; nosee Room 3: 20, on the 20 line ✓`
- [ ] All three bars match: `tap [data-r="0"][data-v="25"]; tap [data-r="1"][data-v="40"]; tap [data-r="2"][data-v="15"]; see All three bars match.`
- [ ] Edge: the top of the graph, and tapping the same place twice: `tap [data-r="1"][data-v="50"] ×2; see Room 2: 50, on the 50 line.; count rect.bar = 1`
- [ ] Start over clears the bars: `tap [data-r="0"][data-v="25"]; click Start over; see Room 1: no bar yet.; count rect.bar = 0`
- Quick check: How many books were read on Tuesday? Answer: 9 books. Mistakes it names: 8, 10.

### Step 2: Choose a scale
- [ ] It starts counting by 5s, the best fit: `pressed Count by 5s; see A line every 5 makes 8 spaces.; see This scale fits best.; count .gl = 9`
- [ ] By 2s: tall, with lots of lines: `click Count by 2s; see A line every 2 makes 20 spaces.; count .gl = 21`
- [ ] By 10s: short, with bars between lines: `click Count by 10s; see A line every 10 makes only 4 spaces.; see Tuesday and Wednesday end between lines; count .gl = 5`
- Quick check: A class counted birds: 30 robins, 60 sparrows, and 90 pigeons. Which scale is best for a bar graph? Answer: “A line every 10”. Mistakes it names: “A line every 1”, “A line every 2”.

## Chapter 3: Questions about bar graphs · `learn/graph-questions.html` · Lessons 7–8

### Step 1: How many more? How many fewer?
- [ ] It starts comparing Wednesday and Tuesday: `pressed Wed and Tue; see Wednesday: 35. Tuesday: 15. 35 − 15 = 20.; see The library lent 20 more books on Wednesday than on Tuesday, so Tuesday had 20 fewer.; count rect.bar = 2`
- [ ] The taller bar goes second, whichever day is picked first: `click Mon and Thu; see Monday: 25. Thursday: 20. 25 − 20 = 5.; see so Thursday had 5 fewer.`
- [ ] Every pair: `click Wed and Mon; see 35 − 25 = 10.; click Thu and Tue; see 20 − 15 = 5.`
- Quick check: How many more apples than pears were sold? Answer: 30 apples. Mistakes it names: 110, 3.

### Step 2: How many in all?
- [ ] It starts with no bars picked: `see Tap bars to add them up. Tap a bar again to take it out.; count rect.bar.hi = 0`
- [ ] One bar: `tap [data-r="0"]; see Monday: 25 books. Tap another bar to add it.; count rect.bar.hi = 1`
- [ ] Two bars add up: `tap [data-r="0"]; tap [data-r="2"]; see Mon + Wed: 25 + 35 = 60 books.; count rect.bar.hi = 2`
- [ ] Every bar: `tap [data-r="0"]; tap [data-r="1"]; tap [data-r="2"]; tap [data-r="3"]; see 25 + 15 + 35 + 20 = 95 books; see That’s every day: the library lent 95 books in all.`
- [ ] Edge: a second tap takes a bar out: `tap [data-r="0"]; tap [data-r="2"]; tap [data-r="0"]; see Wednesday: 35 books.; count rect.bar.hi = 1`
- [ ] Clear: `tap [data-r="1"]; click Clear; see Tap bars to add them up.; count rect.bar.hi = 0`
- Quick check: How many apples and plums were sold in all? Answer: 50. Mistakes it names: 20, 70.

## Chapter 4: Equal groups · `learn/equal-groups.html` · Lessons 9–10

### Step 1: Equal groups
- [ ] It starts with 4 groups of 3: `see 4 groups of 3. 3 + 3 + 3 + 3 = 12.; see Count by 3s: 3, 6, 9, 12.; count .plate = 4; count .ctr = 12`
- [ ] One group, singular: `click Groups: one less ×3; see 1 group of 3 is just 3.; count .plate = 1`
- [ ] Edge: + stops at 6 groups of 10: `click Groups: one more ×4; click In each group: one more ×9; see 6 groups of 10. 10 + 10 + 10 + 10 + 10 + 10 = 60.; count .ctr = 60`
- [ ] Edge: − stops at 1 in each group: `click In each group: one less ×4; see 4 groups of 1. 1 + 1 + 1 + 1 = 4.; count .ctr = 4`
- Quick check: Each plate has the same number of strawberries. How many strawberries are there in all? Answer: 20 strawberries. Mistakes it names: 9, 5, 4.

### Step 2: Drawings and diagrams
- [ ] It starts with the juice-box drawing: `pressed 3 packs; pressed Drawing; see 3 packs of juice boxes, 6 in each pack: 3 groups of 6.; see 6 + 6 + 6 = 18 juice boxes.; count .plate = 3`
- [ ] The same story as a diagram: `click Diagram; see The diagram has 3 equal parts, one for each of the packs. Each part is 6.; count .tape = 3; count .plate = 0`
- [ ] Another story keeps the diagram: `click Diagram; click 5 vases; see 5 vases with 2 flowers in each: 5 groups of 2.; see 2 + 2 + 2 + 2 + 2 = 10 flowers.; count .tape = 5`
- [ ] The crayons: `click 4 boxes; see 8 + 8 + 8 + 8 = 32 crayons.; count .ctr = 32`
- Quick check: Which diagram shows 4 bags with 5 oranges in each bag? Answer: “(picture)”. Mistakes it names: “(picture)”, “(picture)”.

## Chapter 5: Expressions and equations · `learn/expressions.html` · Lessons 11–13

### Step 1: Multiplication expressions
- [ ] It starts with 4 bags of 5, and no product yet: `see 4 bags with 5 apples each: 4 × 5.; see 4 and 5 are the factors.; enabled Find the product; nosee is the product`
- [ ] Find the product: `click Find the product; see 5, 10, 15, 20. 4 × 5 = 20, so there are 20 apples. 20 is the product.; disabled Find the product`
- [ ] Another story hides the product again: `click Find the product; click 3 spiders; see 3 spiders with 8 legs each: 3 × 8.; enabled Find the product; nosee is the product`
- [ ] Hands: `click 2 hands; click Find the product; see 2 × 5 = 10, so there are 10 fingers.`
- Quick check: Mai puts 3 flowers in each of 6 vases. Which expression matches the story? Answer: “6 × 3”. Mistakes it names: “3 × 6”, “6 + 3”.

### Step 2: Multiplication equations
- [ ] It starts with 3 groups of 4: `see 3 groups of 4 is 12.; see 3 × 4 = 12`
- [ ] Written the other way: `click Write it the other way; see 12 = 3 × 4`
- [ ] A second tap turns it back: `click Write it the other way ×2; see 3 × 4 = 12`
- [ ] One group, singular: `click Groups: one less ×2; see 1 group of 4 is 4.; count .plate = 1`
- [ ] Edge: + stops at 5 groups of 10: `click Groups: one more ×3; click In each group: one more ×7; see 5 groups of 10 is 50.; count .ctr = 50`
- Quick check: Which equation matches the picture? Answer: “15 = 3 × 5”. Mistakes it names: “3 + 5 = 8”, “5 = 3 × 15”.

## Chapter 6: Find the unknown · `learn/unknowns.html` · Lessons 14–15

### Step 1: Find the unknown
- [ ] It starts at 1, too few: `pressed 4 × ? = 20; see Find the ? in 4 × ? = 20: 4 groups of how many make 20?; see 4 × 1 = 4. That’s too few: you need 20.`
- [ ] The right number: `click Try: one more ×4; see 4 × 5 = 20. The unknown is 5.; count .ctr = 20`
- [ ] Too many: `click Try: one more ×5; see 4 × 6 = 24. That’s too many: you need 20.`
- [ ] An unknown number of groups: `click ? × 6 = 18; see how many groups of 6 make 18?; click Try: one more ×2; see 3 × 6 = 18. The unknown is 3.; count .plate = 3`
- [ ] Another equation starts over at 1: `click Try: one more ×3; click 6 × ? = 24; see 6 × 1 = 6.`
- [ ] Edge: tries stop at 1 and 10: `click Try: one less; see 4 × 1 = 4.; click Try: one more ×12; see 4 × 10 = 40. That’s too many`
- Quick check: Kiran puts 4 pencils in each cup and uses 28 pencils. How many cups are there? (? × 4 = 28) Answer: 7 cups. Mistakes it names: 24, 32, 4.

### Step 2: More factors, more problems
- [ ] It starts with 3 hops of 7: `pressed Hops of 7; see 3 hops of 7: 3 × 7 = 21.; see Count by 7s: 7, 14, 21.; count .hop = 3`
- [ ] Another factor: `click Hops of 9; click Hops: one more ×2; see 5 hops of 9: 5 × 9 = 45.; count .hop = 5`
- [ ] One hop, singular: `click Hops: one less ×2; see 1 hop of 7: 1 × 7 = 7.`
- [ ] Edge: hops stop at 10: `click Hops: one more ×9; see 10 hops of 7: 10 × 7 = 70.; count .hop = 10`
- Quick check: A spider has 8 legs. How many legs do 6 spiders have? Which equation matches? Answer: “6 × 8 = ?”. Mistakes it names: “6 + 8 = ?”, “8 × ? = 6”.

## Chapter 7: Arrays · `learn/arrays.html` · Lessons 16–19

### Step 1: Arrays
- [ ] It starts with 3 rows of 5: `see 3 rows of 5: 3 × 5 = 15.; see Count by 5s: 5, 10, 15.; count .ctr = 15; count rect.band = 3`
- [ ] One row, singular: `click Rows: one less ×2; see 1 row of 5: 1 × 5 = 5.; count rect.band = 1`
- [ ] Edge: + stops at 5 rows of 10: `click Rows: one more ×3; click In each row: one more ×6; see 5 rows of 10: 5 × 10 = 50.; count .ctr = 50`
- Quick check: Which expression matches this array? Answer: “4 × 6”. Mistakes it names: “4 + 6”, “6 + 6 + 6”.

### Step 2: Solve array problems
- [ ] It starts with the chairs, not counted yet: `pressed Chairs; see 5 rows of chairs, with 6 chairs in each row.; see How many in all? Tap Count a row.; count rect.band = 0`
- [ ] One row at a time: `click Count a row; see Count by 6s: 6…; count rect.band = 1`
- [ ] Every row: `click Count a row ×5; see Count by 6s: 6, 12, 18, 24, 30.; see 5 × 6 = 30 chairs.; disabled Count a row`
- [ ] The egg carton: `click Eggs; click Count a row ×2; see 2 × 6 = 12 eggs.`
- [ ] Start over: `click Count a row ×2; click Start over; see How many in all?; enabled Count a row; count rect.band = 0`
- Quick check: A muffin pan has 3 rows with 4 muffins in each row. How many muffins does it hold? Answer: 12 muffins. Mistakes it names: 7, 3, 4.

## Chapter 8: Turn it around · `learn/commutative.html` · Lesson 20

### Step 1: Turn the array
- [ ] It starts with 3 rows of 5: `see 3 rows of 5: 3 × 5 = 15.; see Turn the array and see what changes.; count rect.band = 3`
- [ ] Turned: `click Turn it; see 5 rows of 3: 5 × 3 = 15.; see Same counters, just turned. So 3 × 5 = 5 × 3.; count rect.band = 5; count .ctr = 15`
- [ ] A second tap turns it back: `click Turn it; click Turn it back; see 3 rows of 5: 3 × 5 = 15.`
- [ ] Another array starts unturned: `click Turn it; click 2 × 7; see 2 rows of 7: 2 × 7 = 14.; enabled Turn it`
- Quick check: Andre knows 6 × 4 = 24. Which equation is also true? Answer: “4 × 6 = 24”. Mistakes it names: “4 × 6 = 10”, “4 × 6 = 46”.

### Step 2: Use a fact you know
- [ ] It starts with 9 hops of 2: `pressed 2 and 9; pressed 9 hops of 2; see 9 hops of 2: 9 × 2 = 18.; count .hop = 9`
- [ ] The other way lands in the same place: `click 2 hops of 9; see 2 hops of 9: 2 × 9 = 18.; count .hop = 2`
- [ ] Other factors: `click 5 and 8; see 8 hops of 5: 8 × 5 = 40.; click 5 hops of 8; see 5 hops of 8: 5 × 8 = 40.`
- Quick check: Priya knows 5 × 8 = 40. What is 8 × 5? Answer: 40. Mistakes it names: 13, 35, 85.
