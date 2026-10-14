# Checklist: Learn Two-dimensional Shapes and Perimeter (Grade 3 Unit 7)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–15. Lessons 13–15 are open design projects: the last chapter practices their math (perimeter and area of figures made of rectangles, and rectangles with a given area and perimeter), not the open designing. Side lengths are whole numbers.

## Chapter 1: Sides and right angles · `learn/attributes.html` · Lessons 1–2

### Step 1: Sort by sides and corners
- [ ] It starts sorted by 3 sides, with the rest faded: `pressed 3 sides; see Shapes A and B have 3 sides.; count .shp.dimshp = 4`
- [ ] Four sides: `click 4 sides; see Shapes C, D, and E have 4 sides.; count .shp.dimshp = 3`
- [ ] A right angle, with every right angle marked: `click A right angle; see Shapes B, C, E, and F have at least one right angle.; count .sqc = 11`
- [ ] Sides all the same: `click Sides all the same; see Shapes A, C, and D have sides that are all the same length.`
- [ ] Edge: back to 3 sides: `click Sides all the same; click 3 sides; see Shapes A and B have 3 sides.`
- Quick check: Which triangle has a right angle? Answer: “Triangle B”. Mistakes it names: “Triangle A”, “Triangle C”.

### Step 2: Find the right angles
- [ ] It starts with corner 1 circled and nothing marked: `pressed Shape 1; see Is corner 1 (circled) a square corner?; count .cring = 1; count .sqc = 0`
- [ ] The first corner is a right angle: `click Check the next corner; see Corner 1: a right angle ✓; count .sqc = 1`
- [ ] Every corner checked: `click Check the next corner ×4; see Corner 2: not a right angle; see Corner 4: a right angle ✓; see It has 4 corners and 2 right angles.; disabled Check the next corner; count .cring = 0; count .sqc = 2`
- [ ] A shape with 5 corners: `click Shape 2; click Check the next corner ×5; see It has 5 corners and 2 right angles.`
- [ ] Edge: no right angles: `click Shape 3; click Check the next corner ×4; see It has 4 corners and no right angles.; count .sqc = 0`
- [ ] Start over: `click Check the next corner ×2; click Start over; see Is corner 1 (circled); enabled Check the next corner; count .sqc = 0`
- [ ] Edge: another shape starts over: `click Check the next corner; click Shape 2; see Is corner 1 (circled); count .sqc = 0`
- Quick check: How many right angles does this shape have? Answer: 2 right angles. Mistakes it names: 5, 3.

## Chapter 2: What makes a quadrilateral · `learn/quadrilaterals.html` · Lesson 3

### Step 1: Closed, with 4 straight sides
- [ ] It starts as a quadrilateral: `pressed Closed; pressed Straight sides; see 4 straight sides, and it’s closed: it’s a quadrilateral.`
- [ ] Five sides: `click Sides: one more; see Not a quadrilateral: it has 5 sides, not 4.; see It’s a pentagon.`
- [ ] Open: `click Open; see Not a quadrilateral: it isn’t closed: its sides don’t all meet.; nosee It’s a`
- [ ] A curved side: `click A curved side; see Not a quadrilateral: one side is curved.`
- [ ] Edge: all three reasons at once: `click Sides: one less; click Open; click A curved side; see it has 3 sides, not 4, it isn’t closed: its sides don’t all meet, and one side is curved.`
- [ ] Edge: from 3 to 6 sides: `click Sides: one less ×3; see It’s a triangle.; click Sides: one more ×5; see It’s a hexagon.`
- Quick check: Which shape is a quadrilateral? Answer: “Shape B”. Mistakes it names: “Shape A”, “Shape C”.

### Step 2: Find the quadrilaterals
- [ ] It starts with nothing tapped: `see Tap each shape you think is a quadrilateral.; see Quadrilaterals found: 0 of 3.; count .cand.right = 0`
- [ ] A quadrilateral turns green: `tap [data-id="1"]; see Shape B is a quadrilateral: 4 straight sides, closed.; see Quadrilaterals found: 1 of 3.; count .cand.right = 1`
- [ ] An open shape turns red: `tap [data-id="0"]; see Shape A isn’t a quadrilateral: it isn’t closed.; count .cand.wrong = 1`
- [ ] A corner that bends in is fine: `tap [data-id="3"]; see One corner bends in, and that’s fine.`
- [ ] All three found: `tap [data-id="1"]; tap [data-id="3"]; tap [data-id="5"]; see You found all 3 quadrilaterals!; count .cand.right = 3`
- [ ] Edge: a second tap doesn't count twice: `tap [data-id="1"] ×2; see Quadrilaterals found: 1 of 3.`
- [ ] Start over: `tap [data-id="1"]; tap [data-id="4"]; click Start over; see Quadrilaterals found: 0 of 3.; count .cand.right = 0; count .cand.wrong = 0`
- Quick check: How many of these shapes are quadrilaterals? Answer: 2 shapes. Mistakes it names: 3, 4.

## Chapter 3: Rhombuses, rectangles, and squares · `learn/rhombus-rectangle-square.html` · Lessons 4–5

### Step 1: Rhombuses and rectangles
- [ ] It starts as a rhombus: `pressed All the same length; pressed Leaning; see 4 sides the same length, but no right angles: a rhombus.; count .sqc = 0`
- [ ] Right angles make a square: `click Right angles; see 4 sides the same length and 4 right angles: a square.; count .sqc = 4`
- [ ] Two lengths make a rectangle: `click Right angles; click Two lengths; see 4 right angles, but two lengths of side: a rectangle.`
- [ ] Edge: neither: `click Two lengths; see Two lengths of side and no right angles: a quadrilateral, but not a rhombus, a rectangle, or a square.; count .sqc = 0`
- Quick check: A quadrilateral has 4 sides that are all the same length, and no right angles. What is it? Answer: “A rhombus”. Mistakes it names: “A rectangle”, “A square”.

### Step 2: A square is both
- [ ] It starts with a turned square, in both circles: `pressed Shape A; see All 4 sides the same length? Yes. Right angles: 4.; see It’s in both circles: a rhombus and a rectangle. That’s a square.; count .vring.on = 2`
- [ ] A rhombus: `click Shape B; see It goes in the rhombus circle only: a rhombus.; count .vring.on = 1`
- [ ] A rectangle: `click Shape C; see All 4 sides the same length? No. Right angles: 4.; see It goes in the rectangle circle only: a rectangle.`
- [ ] Edge: neither: `click Shape D; see It’s a quadrilateral, but it goes outside both circles.; count .vring.on = 0`
- [ ] A square that isn't turned, and a turned rectangle: `click Shape E; see That’s a square.; click Shape F; see a rectangle.; count .vring.on = 1`
- Quick check: Han says a square is not a rectangle. Is Han right? Answer: “No. A square has 4 right angles, so it is a rectangle.”. Mistakes it names: “Yes. A rectangle has two long sides and two short sides.”, “Yes. A square is a rhombus, so it can’t be a rectangle.”.

### Step 3: Other quadrilaterals
- [ ] It starts as a square: `see Sides all the same length? Yes. Right angles: 4.; see It’s a square, so it’s a rhombus and a rectangle too.; count .sqc = 4`
- [ ] Moving D makes another quadrilateral: `click D across: one more; see Sides all the same length? No. Right angles: 2.; see It’s a quadrilateral, but not a rhombus, a rectangle, or a square.; count .sqc = 2`
- [ ] Edge: D in line with A and C: `click D across: one more ×2; click D up: one more ×2; see D is in line with A and C, so the shape flattens into a triangle.; count .sqc = 0`
- [ ] A corner that bends in: `click D across: one more ×3; click D up: one more ×2; see One corner bends in.`
- [ ] Edge: D stops at the grid's edges: `click D across: one less ×5; click D up: one more ×5; see Right angles: 1.; click D across: one more ×9; see It’s a quadrilateral`
- Quick check: Which shape is a quadrilateral, but not a rhombus, a rectangle, or a square? Answer: “Shape B”. Mistakes it names: “Shape A”, “Shape C”.

## Chapter 4: Distance around · `learn/perimeter.html` · Lessons 6–7

### Step 1: Walk around the shape
- [ ] It starts at the top left, nothing counted: `pressed Rectangle; see Start at the top left corner.; count .gwalk = 0`
- [ ] One unit length, numbered: `click Next unit length; see 1 unit length so far.; count .gwalk = 1; count .gdot = 1`
- [ ] All the way around: `click All the way around; see All the way around: 10 unit lengths. The perimeter is 10 units.; see its area is 6 square units.; disabled Next unit length; disabled All the way around; count .gwalk = 10`
- [ ] An L shape: `click L shape; click All the way around; see The perimeter is 12 units.; see its area is 5 square units.`
- [ ] Edge: a U shape counts the notch: `click U shape; click Next unit length ×12; see The perimeter is 12 units.; disabled Next unit length`
- [ ] Start over: `click Next unit length ×3; click Start over; see Start at the top left corner.; count .gwalk = 0; enabled All the way around`
- Quick check: Each side of a square is 1 unit. What is the perimeter of this shape? Answer: 12 units. Mistakes it names: 7, 6.

### Step 2: Same perimeter, different shapes
- [ ] It starts with a 2 by 3 rectangle: `see Area: 6 square units. Perimeter: 10 units.; see Make a shape with a perimeter of 12 units.; count .gcell = 6`
- [ ] A square added makes 12: `tap [data-c="3.0"]; see Area: 7 square units. Perimeter: 12 units.; see A perimeter of 12 units!`
- [ ] Edge: a second tap takes it away: `tap [data-c="3.0"] ×2; see Area: 6 square units. Perimeter: 10 units.`
- [ ] Another shape with the same perimeter: `tap [data-c="3.0"]; tap [data-c="3.1"]; see Area: 8 square units. Perimeter: 12 units.`
- [ ] Edge: a square that isn't joined: `tap [data-c="5.3"]; see Keep the squares joined side to side; nosee Perimeter:`
- [ ] Edge: no squares: `tap [data-c="0.0"]; tap [data-c="1.0"]; tap [data-c="2.0"]; tap [data-c="0.1"]; tap [data-c="1.1"]; tap [data-c="2.1"]; see Tap squares to make a shape.; count .gcell = 0`
- [ ] Start over: `tap [data-c="3.0"]; click Start over; see Area: 6 square units.; count .gcell = 6`
- Quick check: Which shape has a perimeter of 12 units? Answer: “Shape B”. Mistakes it names: “Shape A”, “Shape C”.

## Chapter 5: Find the perimeter · `learn/find-perimeter.html` · Lessons 8–9

### Step 1: Add the sides
- [ ] It starts with no sides added: `pressed Pentagon; see The sides are in centimeters.; count .gwalk = 0`
- [ ] Two sides: `click Add the next side ×2; see 5 + 5 = 10; see 2 sides of 5 added.; count .gwalk = 2`
- [ ] Every side: `click Add the next side ×5; see 5 + 5 + 6 + 5 + 5 = 26; see All 5 sides: the perimeter is 26 centimeters.; disabled Add the next side`
- [ ] A trapezoid in meters: `click Trapezoid; click Add the next side ×4; see 8 + 10 + 20 + 10 = 48; see the perimeter is 48 meters.`
- [ ] Edge: a hexagon has 6 sides: `click Hexagon; click Add the next side ×6; see 12 + 9 + 9 + 9 + 21 + 18 = 78; see the perimeter is 78 inches.`
- [ ] Start over: `click Add the next side ×3; click Start over; count .gwalk = 0; enabled Add the next side`
- Quick check: The sides are in meters. What is the perimeter of this shape? Answer: 24 meters. Mistakes it names: 20, 5.

### Step 2: Rectangles and squares
- [ ] It starts 6 by 3: `see 6 + 3 + 6 + 3 = 18; see The side across from the 6 cm side is 6 cm too, and across from 3 cm is 3 cm. The perimeter is 18 centimeters.`
- [ ] A square: `click Width: one more ×3; see 6 + 6 + 6 + 6 = 24; see it’s a square, so 4 × 6 = 24 works too.`
- [ ] Edge: the smallest: `click Length: one less ×9; click Width: one less ×5; see 2 + 1 + 2 + 1 = 6`
- [ ] Edge: the biggest: `click Length: one more ×12; click Width: one more ×9; see 12 + 8 + 12 + 8 = 40`
- Quick check: What is the perimeter of this rectangle? Answer: 26 meters. Mistakes it names: 13, 36.

### Step 3: Find a missing side
- [ ] It starts with a guess of 1: `pressed Shape 1; see 5 + 5 + 4 + 1 = 15; see The perimeter is 22 cm. That’s too short. Try a longer side.`
- [ ] The right side: `click Side marked ?: one more ×7; see That’s it: the side is 8 cm.; see the sides you know add to 14, and 22 − 14 = 8.`
- [ ] Too long: `click Side marked ?: one more ×8; see That’s too long. Try a shorter side.`
- [ ] Another shape starts the guess over: `click Side marked ?: one more ×3; click Shape 2; see 5 + 5 + 5 + 5 + 1 = 21; click Side marked ?: one more ×5; see the side is 6 cm.`
- [ ] A triangle: `click Shape 3; click Side marked ?: one more ×13; see the side is 14 cm.`
- [ ] Edge: the guess stops at 1 and 20: `click Side marked ?: one less ×3; see + 1 = 15; click Side marked ?: one more ×25; see 5 + 5 + 4 + 20 = 34`
- Quick check: This triangle’s perimeter is 32 centimeters. How long is the side marked ? Answer: 10 centimeters. Mistakes it names: 22, 54.

## Chapter 6: Area and perimeter · `learn/area-and-perimeter.html` · Lessons 10–12

### Step 1: Area or perimeter?
- [ ] It starts with the fence and no measure picked: `pressed Fence; see A fence goes all the way around a garden. Does it need the area or the perimeter?; nosee Yes; count .gwalk = 0`
- [ ] Perimeter, numbered around: `click Perimeter; see Perimeter: the 16 unit lengths around. Yes: the fence goes around the outside.; count .gwalk = 16`
- [ ] Edge: the wrong measure: `click Area; see Area: the 15 squares inside. Not this one: the fence goes around the outside.; count .gsq = 15`
- [ ] Carpet needs the area: `click Carpet; click Area; see Yes: the carpet covers the inside.`
- [ ] Edge: another job clears the measure: `click Perimeter; click Tiles; see Square tiles cover a patio.; nosee Yes; count .gwalk = 0`
- Quick check: Jada covers a bulletin board with paper. Does Jada need the area or the perimeter of the board? Answer: “The area”. Mistakes it names: “The perimeter”.

### Step 2: Same perimeter, different area
- [ ] It starts 6 by 2: `see 6 + 2 + 6 + 2 = 16; see The area is 6 × 2 = 12 square units.; see Same perimeter, different area.`
- [ ] A square has the biggest area: `click Length: one less ×2; see The area is 4 × 4 = 16 square units.; see A square: the biggest area a perimeter of 16 can make.`
- [ ] Edge: the longest: `click Length: one more ×5; see 7 + 1 + 7 + 1 = 16; see The area is 7 × 1 = 7 square units.`
- [ ] Edge: the shortest: `click Length: one less ×9; see 1 + 7 + 1 + 7 = 16; see The area is 1 × 7 = 7 square units.`
- Quick check: These rectangles all have a perimeter of 12 units. Which one has the biggest area? Answer: “Rectangle C”. Mistakes it names: “Rectangle A”, “Rectangle B”.

### Step 3: Same area, different perimeter
- [ ] It starts long and thin: `pressed 12 by 1; see 12 × 1 = 12 square units, and the perimeter is 26 units.; see Long and thin has the longest perimeter.`
- [ ] 6 by 2: `click 6 by 2; see 6 × 2 = 12 square units, and the perimeter is 16 units.`
- [ ] Closest to a square: `click 4 by 3; see the perimeter is 14 units.; see Closest to a square has the shortest perimeter.`
- Quick check: A rectangle has an area of 16 square units. It is 2 units wide. What is its perimeter? Answer: 20 units. Mistakes it names: 16, 10.

## Chapter 7: Design with perimeter and area · `learn/design.html` · Lessons 13–15

### Step 1: Figures made of rectangles
- [ ] It starts with two sides marked ?: `pressed Figure 1; see Two sides are marked ?.; count .lbl.cy = 2`
- [ ] The side across: `click Next step; see Across: 8 − 3 = 5. The side marked ? is 5 meters.; count .lbl.cy = 1`
- [ ] The side up and down: `click Next step ×2; see Up and down: 6 − 2 = 4. The side marked ? is 4 meters.; count .lbl.cy = 0`
- [ ] All 6 sides added: `click Next step ×3; see 5 + 2 + 3 + 4 + 8 + 6 = 28. The perimeter is 28 meters.; disabled Next step`
- [ ] Edge: a whole side is two parts put together: `click Figure 2; click Next step ×3; see Across: 9 − 5 = 4.; see Up and down: 3 + 4 = 7.; see 5 + 3 + 4 + 4 + 9 + 7 = 32.`
- [ ] Start over: `click Next step ×2; click Start over; see Two sides are marked ?.; count .lbl.cy = 2; enabled Next step`
- Quick check: The sides are in feet. What is the perimeter of this figure? Answer: 24 feet. Mistakes it names: 21, 29.

### Step 2: Design a robot
- [ ] It starts 4 by 2, not a fit: `pressed Body; see The body needs an area of 12 square units and a perimeter of 14 units.; see Area: 4 × 2 = 8 ✗. Perimeter: 4 + 2 + 4 + 2 = 12 ✗.`
- [ ] It fits: `click Width: one more; see Area: 4 × 3 = 12 ✓. Perimeter: 4 + 3 + 4 + 3 = 14 ✓.; see It fits! That’s the robot’s body.`
- [ ] Edge: the right area only: `click Length: one more ×2; see The area is right. Try another rectangle with the same area.`
- [ ] Edge: the right perimeter only: `click Length: one more; see The perimeter is right. Try another rectangle with the same perimeter.`
- [ ] The head is a square: `click Head; click Length: one less; click Width: one more; see It fits! That’s the robot’s head.`
- [ ] The arm is long and thin: `click Arm; click Length: one more ×2; click Width: one less; see It fits! That’s the robot’s arm.`
- [ ] Edge: the biggest: `click Length: one more ×12; click Width: one more ×9; see Area: 12 × 8 = 96 ✗.`
- Quick check: A robot’s screen is a rectangle with an area of 8 square units and a perimeter of 12 units. Which rectangle is it? Answer: “2 by 4”. Mistakes it names: “1 by 8”, “3 by 3”.
