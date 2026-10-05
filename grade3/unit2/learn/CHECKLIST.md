# Checklist: Learn Area and Multiplication (Grade 3 Unit 2)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–10, 12–14. Not covered: Lessons 11 and 15 (Area and the Multiplication Table, New Room), optional. Side lengths go up to 10 and areas stay within 100.

## Chapter 1: What is area? · `learn/what-is-area.html` · Lessons 1–2

### Step 1: Area is the space a shape covers
- [ ] It starts with Pair 1 and no tiles: `pressed Pair 1; see Shape A: 0 squares covered so far.; count .atile = 0; count .acell = 17`
- [ ] A tap covers a square: `tap [data-i="0.2"]; see Shape A: 1 square covered so far.; count .atile = 1`
- [ ] Edge: a second tap takes the tile off: `tap [data-i="0.2"] ×2; see Shape A: 0 squares covered so far.; count .atile = 0`
- [ ] Cover them all, and the square covers more than the long strip: `click Cover them all; see Shape A: covered with 8 squares ✓; see Shape B covers more space: its area is bigger.; count .atile = 17`
- [ ] Pair 2 looks different but covers the same: `click Pair 2; click Cover them all; see They look different, but they cover the same space: both areas are 7 square units.`
- [ ] Edge: with a square uncovered there's no comparison yet: `click Cover them all; tap [data-i="1.0"]; see Shape B: 8 squares covered so far.; nosee covers more space`
- [ ] Start over clears the tiles: `click Cover them all; click Start over; see Shape B: 0 squares covered so far.; count .atile = 0`
- [ ] Edge: another pair starts uncovered: `tap [data-i="0.0"]; click Pair 2; see Shape A: 0 squares covered so far.; count .acell = 14`
- Quick check: Which shape has the bigger area? Answer: “Shape B”. Mistakes it names: “Shape A”, “They’re the same”.

### Step 2: No gaps, no overlaps
- [ ] It starts with fair tiles: `pressed No gaps or overlaps; see 12 tiles, all the same size, with no gaps or overlaps. The area is 12 square units.; count .atile = 12`
- [ ] Gaps leave space uncounted: `click Gaps; see Only 6 tiles, with gaps between them.; see 6 is too small; count .atile = 6`
- [ ] Overlaps count space twice: `click Overlaps; see 18 tiles, but they overlap, so some space is counted twice.; see 18 is too big; count .atile = 18`
- [ ] Different sizes: `click Different sizes; see 9 tiles, but the pink one is as big as 4 small ones.; count .atile.big = 1`
- [ ] Edge: back to fair tiles: `click Gaps; click No gaps or overlaps; see The area is 12 square units.`
- Quick check: Tyler covered this rectangle with tiles. The pink tile is as big as 4 small ones. What is the area in small squares? Answer: 15 square units. Mistakes it names: 12, 16.

## Chapter 2: Tile rectangles · `learn/tile-rectangles.html` · Lessons 3–4

### Step 1: Rows of tiles
- [ ] It starts with no rows: `pressed 3 rows of 5; see Each row holds 5 tiles. Tap Add a row.; count .atile = 0`
- [ ] One row: `click Add a row; see 1 row of 5. Count by 5s: 5. That’s 5 tiles so far.; count .atile = 5`
- [ ] All the rows, then Add a row stops: `click Add a row ×3; see 3 rows of 5. Count by 5s: 5, 10, 15.; see 3 × 5 = 15 tiles. The area is 15 square units.; disabled Add a row`
- [ ] Another rectangle: `click 4 rows of 6; click Add a row ×4; see 4 × 6 = 24 tiles.; count .atile = 24`
- [ ] Start over: `click Add a row ×2; click Start over; see Each row holds 5 tiles.; count .atile = 0; enabled Add a row`
- [ ] Edge: another rectangle starts over: `click Add a row; click 5 rows of 4; see Each row holds 4 tiles.; count .atile = 0`
- Quick check: What is the area of this rectangle? Answer: 28 square units. Mistakes it names: 11, 22, 7.

### Step 2: Picture the missing tiles
- [ ] It starts with the top row and side: `pressed Rectangle 1; pressed Top row and side; see The top row has 6 tiles, so every row has 6. The left side has 4 tiles, so there are 4 rows.; see 4 × 6 = 24 tiles cover it.; count .atile = 9`
- [ ] Top row only, with marks for the rows: `click Top row only; see The marks on the left side show 4 rows.; count .atile = 6; count .atick = 5`
- [ ] Show and hide the rest: `click Show the rest of the tiles; see All 24 are showing now.; count .atile = 24; click Hide the rest of the tiles; count .atile = 9`
- [ ] Another rectangle: `click Rectangle 3; see The top row has 8 tiles; see 3 × 8 = 24 tiles cover it.`
- [ ] Edge: another rectangle hides the tiles again: `click Show the rest of the tiles; click Rectangle 2; count .atile = 7; see Show the rest of the tiles`
- Quick check: How many tiles will cover the whole rectangle? Answer: 30 tiles. Mistakes it names: 10, 11, 22.

## Chapter 3: Products as areas · `learn/products-as-areas.html` · Lesson 5

### Step 1: A rectangle is a multiplication
- [ ] It starts at 4 rows of 6: `see 4 rows of 6: 4 × 6 = 24 square units.; see Turned on its side, it’s 6 rows of 4: 6 × 4 = 24 too.; count .atile = 24`
- [ ] One more row: `click Rows: one more; see 5 rows of 6: 5 × 6 = 30 square units.; count .atile = 30`
- [ ] A square: `click Rows: one more ×2; see 6 rows of 6; see The rows and columns match: it’s a square.`
- [ ] Edge: 1 row stops there: `click Rows: one less ×5; see 1 row of 6: 1 × 6 = 6 square units.; count .atile = 6`
- [ ] Edge: 10 by 10 stops there: `click In each row: one more ×6; click Rows: one more ×8; see 10 rows of 10: 10 × 10 = 100 square units.; count .atile = 100`
- Quick check: Which expression gives the area of this rectangle in square units? Answer: “3 × 7”. Mistakes it names: “3 + 7”, “2 × 7”.

### Step 2: Same area, different rectangles
- [ ] It starts at 12, with its other rectangles: `pressed 12 square units; see Rectangle 1 of 4: 2 rows of 6. 2 × 6 = 12 square units.; see These have an area of 12 too: 3 × 4, 4 × 3, 6 × 2.; count .atile = 12`
- [ ] Next rectangle: `click Next rectangle; see Rectangle 2 of 4: 3 rows of 4.`
- [ ] Edge: after the last it starts again: `click Next rectangle ×4; see Rectangle 1 of 4: 2 rows of 6.`
- [ ] Another area: `click 24 square units; see Rectangle 1 of 4: 3 rows of 8. 3 × 8 = 24 square units.; count .atile = 24`
- [ ] Edge: another area starts at its first rectangle: `click Next rectangle ×2; click 18 square units; see Rectangle 1 of 4: 2 rows of 9.`
- Quick check: Which rectangle has an area of 20 square units? Answer: “(picture)”. Mistakes it names: “(picture)”, “(picture)”.

## Chapter 4: Square units · `learn/square-units.html` · Lessons 6–7

### Step 1: Squares of different sizes
- [ ] It starts with the small squares: `pressed Small squares; see A square centimeter is about the size of the tip of your finger. A square inch is about the size of a postage stamp.; see About 6 square centimeters fit in 1 square inch.; count .agrid = 4`
- [ ] The big squares: `click Big squares; see A square foot is about the size of a floor tile. A square meter is about the size of a small table top.; see About 11 square feet fit in 1 square meter.; see These are drawn much smaller than they really are.; count .agrid = 6`
- [ ] Edge: back to the small squares drops the note: `click Big squares; click Small squares; nosee drawn much smaller`
- Quick check: Lin covers a notebook with square inches. Han covers the same notebook with square centimeters. Who needs more squares? Answer: “Han”. Mistakes it names: “Lin”, “They need the same number”.

### Step 2: Pick a unit that fits
- [ ] It starts with the stamp, and no unit: `pressed Stamp; see Which square unit makes sense for the area of a postage stamp?`
- [ ] A small unit for a small thing: `click square centimeters; see Yes: a postage stamp is small, so square centimeters make sense ✓`
- [ ] A big unit for a small thing: `click square meters; see Square meters are much too big for a postage stamp.`
- [ ] A small unit for a big thing: `click Classroom; click square inches; see Square inches are much too small: it would take far too many to cover a classroom floor.`
- [ ] A big unit for a big thing: `click Rug; click square feet; see Yes: a rug is big, so square feet make sense ✓`
- [ ] Edge: another thing clears the unit: `click square inches; click Book; see Which square unit makes sense for the area of a book cover?`
- Quick check: Which unit makes the most sense for the area of a basketball court? Answer: “square meters”. Mistakes it names: “square centimeters”, “square inches”.

## Chapter 5: Area without a grid · `learn/no-grid.html` · Lessons 8–9

### Step 1: Multiply the side lengths
- [ ] It starts at 6 by 4, with no squares: `see 6 cm long and 4 cm wide. Picture 4 rows of 6 square centimeters.; see 4 × 6 = 24 square centimeters.; count .rgrid = 0`
- [ ] Show and hide the squares: `click Show the squares; count .rgrid = 8; click Hide the squares; count .rgrid = 0`
- [ ] Other sides: `click Length: one more ×2; click Width: one less; see 8 cm long and 3 cm wide.; see 3 × 8 = 24 square centimeters.`
- [ ] Edge: 1 by 1: `click Length: one less ×6; click Width: one less ×4; see 1 cm long and 1 cm wide. Picture 1 row of 1 square centimeter.; see 1 × 1 = 1 square centimeter.`
- [ ] Edge: 10 by 10: `click Length: one more ×5; click Width: one more ×7; see 10 × 10 = 100 square centimeters.`
- Quick check: What is the area of this rectangle? Answer: 35 square meters. Mistakes it names: 12, 24.

### Step 2: Measure, then multiply
- [ ] It starts with nothing measured: `pressed Rectangle 1; see Top: not measured yet. Side: not measured yet.; count .aread = 0`
- [ ] Measure the top: `click Measure the top; see Top: 6 cm.; disabled Measure the top; count .aread = 1`
- [ ] Both sides, then multiply: `click Measure the top; click Measure the side; see 3 × 6 = 18 square centimeters.; count .aring = 2`
- [ ] An inch ruler: `click Rectangle 2; click Measure the top; click Measure the side; see Top: 5 in. Side: 2 in.; see 2 × 5 = 10 square inches.`
- [ ] Edge: another rectangle starts unmeasured: `click Measure the top; click Rectangle 3; see Top: not measured yet.; enabled Measure the top`
- Quick check: Measure the sides with the rulers. What is the area of the rectangle? Answer: 15 square centimeters. Mistakes it names: 8, 16.

## Chapter 6: Area problems · `learn/area-problems.html` · Lesson 10

### Step 1: Area stories
- [ ] It starts with the rug: `pressed Rug; see Elena’s rug is 8 feet long and 5 feet wide. How much floor does it cover?; see 5 × 8 = 40 square feet.`
- [ ] The patio, in meters: `click Patio; see The patio is 7 meters long and 6 meters wide.; see 6 × 7 = 42 square meters.`
- [ ] Show and hide the squares: `click Show the squares; count .rgrid = 11; click Hide the squares; count .rgrid = 0`
- [ ] Edge: another story hides the squares: `click Show the squares; click Garden; count .rgrid = 0; see Han’s garden bed is 6 meters long`
- Quick check: A patio is 6 meters long and 8 meters wide. What is its area? Answer: 48 square meters. Mistakes it names: 14, 28.

### Step 2: Find a missing side
- [ ] It starts at 24 with a side of 4: `pressed 24 square feet; see A garden bed has an area of 24 square feet. One side is 4 feet.; see 4 × 6 = 24, so the other side is 6 feet.`
- [ ] A side that doesn't make full rows: `click One side (feet): one more; see 24 squares don’t make 5 full rows: 5 × 4 = 20, with 4 left over.; count .ftile.left = 4`
- [ ] Another area: `click 18 square feet; see 18 squares don’t make 4 full rows: 4 × 4 = 16, with 2 left over.`
- [ ] Edge: a side of 1: `click One side (feet): one less ×4; see 1 × 24 = 24, so the other side is 24 feet.`
- [ ] Edge: a side of 8: `click One side (feet): one more ×5; see 8 × 3 = 24, so the other side is 3 feet.`
- Quick check: A rug has an area of 32 square feet. It is 4 feet wide. How long is it? Answer: 8 feet. Mistakes it names: 28, 4, 36.

## Chapter 7: Area and addition · `learn/area-and-addition.html` · Lesson 12

### Step 1: Cut a rectangle in two
- [ ] It starts cut after 5: `pressed 6 × 7; see The gold part is 6 × 5 and the blue part is 6 × 2.; see 6 × 7 = 6 × 5 + 6 × 2 = 30 + 12 = 42`
- [ ] Slide the cut: `slide Cut after = 3; see 6 × 7 = 6 × 3 + 6 × 4 = 18 + 24 = 42`
- [ ] Another rectangle: `click 7 × 9; slide Cut after = 8; see 7 × 9 = 7 × 8 + 7 × 1 = 56 + 7 = 63`
- [ ] Edge: the first cut: `slide Cut after = 1; see 6 × 7 = 6 × 1 + 6 × 6 = 6 + 36 = 42`
- [ ] Edge: a cut past a narrower rectangle moves back inside it: `click 7 × 9; slide Cut after = 8; click 4 × 8; see 4 × 8 = 4 × 7 + 4 × 1 = 28 + 4 = 32`
- Quick check: 4 × 9 = 4 × 5 + 4 × ? Answer: 4. Mistakes it names: 9, 5, 16.

### Step 2: Use facts you know
- [ ] It starts with no cut: `pressed 7 × 8; see Don’t know 7 × 8? Cut the 8 into two numbers.; count .acut = 0`
- [ ] Cut 5 + 3: `click 5 + 3; see 7 × 8 = 7 × 5 + 7 × 3 = 35 + 21 = 56; see Facts with 5 are easy to count by 5s.; count .acut = 1`
- [ ] Cut in half: `click 4 + 4; see 7 × 8 = 7 × 4 + 7 × 4 = 28 + 28 = 56; see Both parts are the same fact`
- [ ] An odd side has no half: `click 6 × 9; click 2 + 7; see 6 × 9 = 6 × 2 + 6 × 7 = 12 + 42 = 54; see Facts with 2 are doubles.; count [data-bot] button = 2`
- [ ] Edge: another fact clears the cut: `click 5 + 3; click 8 × 6; see Don’t know 8 × 6?; count .acut = 0`
- Quick check: Which expression gives the area of the whole rectangle? Answer: “6 × 5 + 6 × 3”. Mistakes it names: “6 × 5 + 3”, “6 × 8 + 6 × 3”.

## Chapter 8: Figures made of rectangles · `learn/composite-figures.html` · Lessons 13–14

### Step 1: Cut it into rectangles
- [ ] It starts uncut: `pressed Figure 1; see Pick a way to cut it into two rectangles.; count .acut = 0`
- [ ] Cut up and down: `click Cut up and down; see The gold rectangle is 5 × 6 = 30. The blue one is 3 × 4 = 12.; see 30 + 12 = 42 square units.; count .acut = 1`
- [ ] Cut across, the same area: `click Cut across; see The gold rectangle is 5 × 2 = 10. The blue one is 8 × 4 = 32.; see 10 + 32 = 42 square units.`
- [ ] Another figure, both ways: `click Figure 2; click Cut up and down; see 21 + 16 = 37 square units.; click Cut across; see 9 + 28 = 37 square units.`
- [ ] Edge: another figure starts uncut: `click Cut across; click Figure 3; see Pick a way to cut it; count .acut = 0`
- Quick check: What is the area of this figure? Answer: 42 square units. Mistakes it names: 48, 30, 28.

### Step 2: Find the missing sides
- [ ] It starts with the top hidden: `pressed Side a; see Look at the sides that go across. The whole side is 8, and the ? side and the 3 side make it together.; see ? = 8 − 3 = 5.; count .lbl.cy = 1`
- [ ] A side that goes up and down: `click Side b; see Look at the sides that go up and down.; see ? = 6 − 4 = 2.`
- [ ] The other two sides: `click Side c; see ? = 8 − 5 = 3.; click Side d; see ? = 6 − 2 = 4.`
- [ ] Another figure, and its area: `click Figure 3; click Side d; see ? = 5 − 2 = 3.; see the area is 35 square units.`
- [ ] Edge: another figure keeps the hidden side: `click Side c; click Figure 2; pressed Side c; see ? = 7 − 3 = 4.`
- Quick check: How long is the side marked ? Answer: 5 units. Mistakes it names: 9, 13.
