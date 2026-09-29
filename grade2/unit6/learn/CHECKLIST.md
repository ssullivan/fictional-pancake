# Checklist: Learn Geometry, Time, and Money (Grade 2 Unit 6)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

Not covered: Center Days (Lessons 5, 10, 14, and 20) and Pattern Block Puzzles (Lesson 21) are optional lessons that work better in class. Practice it all in Clockwork Carnival, the game for this unit.

## Chapter 1: Shapes · `learn/shapes.html` · Lessons 1–4

### Step 1: Sides and corners
- [ ] It asks you to count first: `see How many sides? Put your finger on one side; see Count the sides`
- [ ] Counting the first shape: a triangle: `click Count the sides; see 3 sides and 3 corners.; see It’s a triangle.`
- [ ] Edge: a hexagon shaped like an L is still a hexagon: `click Shape 5; click Count the sides; see 6 sides and 6 corners.; see It’s a hexagon.`
- [ ] A pentagon: `click Shape 4; click Count the sides; see It’s a pentagon.`
- [ ] Edge: picking another shape hides the count: `click Count the sides; click Shape 2; see How many sides?; see Count the sides`
- [ ] Hiding the numbers: `click Count the sides; click Hide the numbers; see How many sides?`
- Quick check: How many sides does this shape have? Answer: 6 sides. Mistakes it names: 4, 5, 2.

### Step 2: Draw shapes
- [ ] It starts by asking for a triangle: `see Draw a triangle. Tap dots to make its corners.`
- [ ] Drawing a triangle and closing it: `tap [data-i="0"]; tap [data-i="2"]; tap [data-i="14"]; see 3 corners so far. Tap the gold dot to close the shape.; tap [data-i="0"]; see You drew a triangle! It has 3 sides and 3 corners.`
- [ ] A square for a quadrilateral: `click A quadrilateral; tap [data-i="0"]; tap [data-i="2"]; tap [data-i="14"]; tap [data-i="12"]; tap [data-i="0"]; see You drew a quadrilateral! It has 4 sides and 4 corners.`
- [ ] Edge: the wrong number of sides is named and explained: `click A pentagon; tap [data-i="0"]; tap [data-i="2"]; tap [data-i="14"]; tap [data-i="0"]; see That shape has 3 sides and 3 corners: a triangle.; see A pentagon has 5 sides. Start over and try again.`
- [ ] Edge: a dot in the middle of a side isn’t a corner: `tap [data-i="0"]; tap [data-i="1"]; tap [data-i="2"]; tap [data-i="14"]; see 4 corners so far.; tap [data-i="0"]; see You drew a triangle!`
- [ ] Edge: dots in a line aren’t a shape: `tap [data-i="0"]; tap [data-i="1"]; tap [data-i="2"]; tap [data-i="0"]; see Those dots are all in a line. That’s not a shape. Start over.`
- [ ] Edge: sides that cross: `click A quadrilateral; tap [data-i="0"]; tap [data-i="2"]; tap [data-i="12"]; tap [data-i="14"]; tap [data-i="0"]; see The sides cross each other.`
- [ ] Edge: tapping a dot twice doesn’t add a corner: `tap [data-i="0"]; tap [data-i="2"]; tap [data-i="2"]; see Draw a triangle.`
- [ ] Edge: a closed shape ignores more taps: `tap [data-i="0"]; tap [data-i="2"]; tap [data-i="14"]; tap [data-i="0"]; tap [data-i="20"]; see You drew a triangle!`
- [ ] Start over: `tap [data-i="0"]; tap [data-i="2"]; tap [data-i="14"]; click Start over; see Draw a triangle. Tap dots to make its corners.`
- Quick check: Lin drew a shape with 5 corners. How many sides does it have? Answer: 5 sides. Mistakes it names: 4, 6.

### Step 3: Side lengths
- [ ] 5 cm by 3 cm is a rectangle: `see Sides: 5 cm, 3 cm, 5 cm, 3 cm. 4 square corners.; see It’s a rectangle.`
- [ ] Edge: equal sides make a square: `click Long: one less ×2; see Sides: 3 cm, 3 cm, 3 cm, 3 cm.; see It’s a square!`
- [ ] Edge: the smallest square is 1 cm: `click Long: one less ×4; click Tall: one less ×2; see 1 cm, 1 cm, 1 cm, 1 cm; see It’s a square!`
- [ ] Edge: the biggest rectangle is 6 cm by 5 cm, even with more taps: `click Long: one more ×3; click Tall: one more ×4; see 6 cm, 5 cm, 6 cm, 5 cm`
- Quick check: Which shape has 4 sides that are all the same length? Answer: “B”. Mistakes it names: “A”, “C”.

### Step 4: Solid shapes
- [ ] A cube shows its faces from the front, then all 6: `see /You can see \d faces from the front\./; click Show the back; see A cube has 6 faces: 6 squares.`
- [ ] A pyramid has 5 faces: `click Pyramid; click Show the back; see A pyramid has 5 faces: 1 square and 4 triangles.`
- [ ] A triangle prism has 5 faces: `click Triangle prism; click Show the back; see A triangle prism has 5 faces: 2 triangles and 3 rectangles.`
- [ ] A box has 6 rectangles: `click Box; click Show the back; see 6 rectangles.`
- [ ] Edge: picking another shape hides the back: `click Show the back; click Pyramid; see How many faces in all?; see Show the back`
- Quick check: How many faces does a cube have? Answer: 6 faces. Mistakes it names: 3, 8, 12, 4.

## Chapter 2: Halves, thirds, and fourths · `learn/halves-thirds-fourths.html` · Lessons 6–9

### Step 1: Build with blocks
- [ ] It starts with 1 triangle: `see 1 triangle. Tap + to fill the hexagon.`
- [ ] 6 triangles make a hexagon: `click Blocks: one more ×5; see 6 triangles make a hexagon!; click Blocks: one more; see 6 triangles make a hexagon!`
- [ ] 3 rhombuses make a hexagon: `click Rhombuses; click Blocks: one more ×2; see 3 rhombuses make a hexagon!`
- [ ] Edge: 2 trapezoids fill it, and + stops there: `click Trapezoids; click Blocks: one more ×3; see 2 trapezoids make a hexagon!`
- [ ] Edge: a new block starts over at 1: `click Blocks: one more ×2; click Rhombuses; see 1 rhombus. Tap + to fill`
- Quick check: How many triangles make this trapezoid? Answer: 3 triangles. Mistakes it names: 6, 2, 1.

### Step 2: Equal parts
- [ ] It starts with halves of a circle: `see 2 equal parts. Each part is 1 half of the circle.; see Tap a part to color it in.; pressed Halves`
- [ ] Coloring halves: `tap [data-i="0"]; see 1 half colored in.; tap [data-i="1"]; see 2 halves make the whole circle!`
- [ ] Edge: tapping a colored part uncolors it: `tap [data-i="0"]; tap [data-i="0"]; see Tap a part to color it in.`
- [ ] Thirds of a rectangle: `click Rectangle; click Thirds; see Each part is 1 third of the rectangle.; tap [data-i="0"]; tap [data-i="2"]; see 2 thirds colored in.`
- [ ] Fourths: `click Fourths; tap [data-i="0"]; see 1 fourth colored in.`
- [ ] Edge: changing the parts clears the colors: `tap [data-i="0"]; click Fourths; see Tap a part to color it in.`
- Quick check: What part of the circle is shaded? Answer: “1 third”. Mistakes it names: “1 half”, “1 fourth”.

### Step 3: Same size, different shape
- [ ] Squares: 4 equal pieces are fourths: `see 4 equal pieces: each one is 1 fourth of the square.`
- [ ] Strips and triangles are fourths too: `click Strips; see each one is 1 fourth; click Triangles; see each one is 1 fourth`
- [ ] Edge: uneven pieces are not fourths: `click Uneven; see 4 pieces, but they are not the same size.; see Fourths have to be equal.`
- Quick check: Which picture shows fourths? Answer: “(picture)”. Mistakes it names: “(picture)”, “(picture)”.

### Step 4: The whole thing
- [ ] It starts with halves: `see Each piece is 1 half.`
- [ ] Eating both halves: `click Eat a piece; see You ate 1 half.; click Eat a piece; see You ate the whole thing! 2 halves make 1 whole bar.; disabled Eat a piece`
- [ ] Fourths: `click Pieces: one more ×2; click Eat a piece ×3; see Each piece is 1 fourth. You ate 3 fourths.`
- [ ] Edge: changing the pieces starts a new bar: `click Eat a piece; click Pieces: one more; see Each piece is 1 third.; nosee You ate; enabled Eat a piece`
- [ ] More pieces means smaller pieces: `see 1 fourth is less than 1 third, and 1 third is less than 1 half.`
- Quick check: Two pizzas are the same size. One is cut into halves. The other is cut into fourths. Which piece is bigger? Answer: “1 half”. Mistakes it names: “1 fourth”, “They’re the same”.

## Chapter 3: Tell time · `learn/time.html` · Lessons 11–13

### Step 1: Half past and quarter past
- [ ] It starts at quarter past 3: `see 3:15 is quarter past 3.; pressed Quarter past`
- [ ] Half past: the hour hand is halfway: `click Half past; see 3:30 is half past 3.; see The hour hand is halfway between 3 and 4.`
- [ ] Quarter till is before the next hour: `click Quarter till; see 3:45 is quarter till 4.`
- [ ] O’clock: `click o’clock; see 3:00 is 3 o’clock.`
- [ ] Edge: quarter till 12 goes to 1: `click Hour: one more ×9; click Quarter till; see 12:45 is quarter till 1.`
- [ ] Edge: 1 is the first hour, even with more taps: `click Hour: one less ×4; see 1:15 is quarter past 1.`
- Quick check: What time is it? Answer: “Half past 8”. Mistakes it names: “Half past 9”, “Quarter past 8”.

### Step 2: Count by 5
- [ ] 2:35, counting by 5s: `see The minute hand points to the 7. Count by 5s: 5, 10, 15, 20, … 35 minutes.; see 2:35`
- [ ] Edge: 0 minutes is o’clock: `click Minutes: one less ×7; see 0 minutes, so it’s o’clock.; see The hour hand points to 2; see 2:00`
- [ ] Edge: 5 minutes: `click Minutes: one less ×6; see Count by 5s: 5 minutes.; see 2:05`
- [ ] Edge: 55 is the most, even with more taps: `click Minutes: one more ×6; see 2:55`
- [ ] Edge: 12:50: `click Hour: one more ×10; click Minutes: one more ×3; see 12:50`
- Quick check: What time does the clock show? Answer: “2:40”. Mistakes it names: “8:10”, “2:08”.

### Step 3: a.m. or p.m.?
- [ ] Wake up is a.m.: `see Wake up: 7:00 a.m.; see a.m. is from midnight to noon`
- [ ] Soccer practice is p.m.: `click Soccer practice; see Soccer practice: 4:15 p.m.; see p.m. is from noon to midnight`
- [ ] Edge: the middle of the night is a.m.: `click Sound asleep; see Sound asleep: 2:00 a.m.`
- [ ] Edge: just before noon is a.m.: `click Lunch; see Lunch: 11:45 a.m.`
- [ ] Bedtime: `click Bedtime; see Bedtime: 8:00 p.m.; see The clock looks the same at 8:00 a.m. and 8:00 p.m.`
- Quick check: Which time makes sense for eating dinner? Answer: “6:00 p.m.”. Mistakes it names: “6:00 a.m.”, “11:00 p.m.”.

## Chapter 4: Coins · `learn/coins.html` · Lessons 15–17

### Step 1: Pennies, nickels, and dimes
- [ ] 2 dimes, a nickel, and 3 pennies make 28¢: `see Count by 10s, then 5s, then 1s: 10, 20, 25, 26, 27, 28.; see 28¢; see A dime is smaller than a nickel`
- [ ] Edge: no coins: `click Dimes: one less ×2; click Nickels: one less; click Pennies: one less ×3; see No coins yet; see Add some coins.`
- [ ] Edge: without nickels there’s no dime-and-nickel note: `click Nickels: one less; see 23¢; nosee smaller than a nickel`
- [ ] Edge: the most coins: `click Dimes: one more ×3; click Nickels: one more ×3; click Pennies: one more ×2; see 75¢`
- Quick check: How much money is this? Answer: 28 cents. Mistakes it names: 6, 18, 24.

### Step 2: Quarters
- [ ] 2 quarters are 50¢, 2 more make a dollar: `see Count by 25s: 25, 50.; see 50¢; see 2 more quarters make a dollar.`
- [ ] Edge: 1 more quarter: `click Quarters: one more; see 75¢; see 1 more quarter makes a dollar.`
- [ ] Edge: 4 quarters are a dollar, and + stops there: `click Quarters: one more ×4; see 4 quarters is 100¢. That’s 1 dollar!`
- [ ] Edge: no quarters: `click Quarters: one less ×2; see No quarters yet; see A quarter is worth 25¢.`
- Quick check: How much money is 3 quarters? Answer: 75 cents. Mistakes it names: 3, 30, 15, 50.

### Step 3: Make a dollar
- [ ] It starts empty: `see Tap a coin to add it.; see No coins yet`
- [ ] 4 quarters make a dollar, and no more coins fit: `click + quarter ×4; see You made a dollar!; see 25, 50, 75, 100.; disabled + penny`
- [ ] Coins are counted biggest first: `click + penny; click + dime; click + quarter; see 36¢ so far. 64¢ more to make a dollar.`
- [ ] Edge: a coin that would go past a dollar can’t be added: `click + quarter ×3; click + dime ×2; see 95¢ so far. 5¢ more; disabled + quarter; disabled + dime; enabled + nickel`
- [ ] Edge: 20 coins is the most: `click + penny ×20; see 20¢ so far.; disabled + penny; disabled + quarter`
- [ ] Start over: `click + quarter ×2; click Start over; see Tap a coin to add it.`
- Quick check: How much more money do you need to make a dollar? Answer: 30 cents. Mistakes it names: 70, 100, 40.

## Chapter 5: Money problems · `learn/money.html` · Lessons 18–19

### Step 1: Dollars and cents
- [ ] 2 dollars and 38 cents: `see Dollars: 2. Cents: 25, 35, 36, 37, 38, so 38.; see 2 dollars and 38 cents: $2 and 38¢`
- [ ] Edge: 1 dollar and 1 cent say “dollar” and “cent”: `click Dollar bills: one less; click Quarters: one less; click Dimes: one less; click Pennies: one less ×2; see 1 dollar and 1 cent: $1 and 1¢`
- [ ] Edge: whole dollars have 0 cents: `click Quarters: one less; click Dimes: one less; click Pennies: one less ×3; see Cents: 0.; see 2 dollars and 0 cents: $2`
- [ ] Edge: no money at all: `click Dollar bills: one less ×2; click Quarters: one less; click Dimes: one less; click Pennies: one less ×3; see No money yet; see 0 dollars and 0 cents`
- [ ] Edge: cents only: `click Dollar bills: one less ×2; see 0 dollars and 38 cents: 38¢`
- [ ] Edge: the most money: `click Dollar bills: one more ×3; click Quarters: one more ×2; click Dimes: one more; click Pennies: one more; see 5 dollars and 99 cents: $5 and 99¢`
- Quick check: How much money is this? Answer: “$2 and 35¢”. Mistakes it names: “37¢”, “$4”.

### Step 2: Story problems
- [ ] It starts with nothing bought: `see What can you buy with 100¢?`
- [ ] A sticker and a pencil leave 55¢: `click sticker: 15¢; click pencil: 30¢; see You spent 15 + 30 = 45¢.; see 100 − 45 = 55¢ left.`
- [ ] Edge: spending the whole dollar: `click bouncy ball: 45¢; click whistle: 35¢; click eraser: 20¢; see 100 − 100 = 0¢ left.; see You spent the whole dollar!; disabled sticker: 15¢`
- [ ] Edge: something too expensive can’t be bought: `click bouncy ball: 45¢; click whistle: 35¢; see 20¢ left.; disabled pencil: 30¢; enabled eraser: 20¢`
- [ ] Tapping again puts it back: `click pencil: 30¢; click pencil: 30¢; see What can you buy with 100¢?`
- Quick check: Mai has 80¢. Mai buys a bouncy ball for 45¢. How much money does Mai have left? Answer: 35 cents. Mistakes it names: 125, 45, 80.
