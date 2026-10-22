# Checklist: Learn Shapes on the Coordinate Plane (Grade 5 Unit 7)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1, 3–4, 6–10, 12–13. Not covered: Lessons 2 (Points on the Coordinate Grid), 5 (Trapezoids), and 11 (Patterns and Ordered Pairs), optional. The first quadrant, whole-number coordinates.

## Chapter 1: The coordinate grid · `learn/grid.html` · Lessons 1, 3

### Step 1: Across, then up
- [ ] It starts at (3, 5): `see Start at (0, 0). Go 3 across, then 5 up: the point is (3, 5).; count circle.gq-pt = 1`
- [ ] Edge: the origin, and − stops at 0: `click Across: one less ×4; click Up: one less ×6; see (0, 0) is the origin, where the two axes meet.`
- [ ] Edge: the far corner, and + stops at 10 and 8: `click Across: one more ×8; click Up: one more ×4; see the point is (10, 8).`
- [ ] Only across: `click Up: one less ×5; see Go 3 across, then 0 up: the point is (3, 0).`
- Quick check: Which point is at (2, 5)? Answer: “B”. Mistakes it names: “A”, “C”.

### Step 2: Read coordinates
- [ ] It starts with the tent: `see The tent is 3 across and 4 up: (3, 4).; count circle.gq-pt = 4; count circle.gq-pt.hi = 1; pressed Tent`
- [ ] The lake: `click Lake; see The lake is 7 across and 2 up: (7, 2).`
- [ ] The lookout and the cave: `click Lookout; see (1, 7); click Cave; see The cave is 8 across and 6 up: (8, 6).`
- Quick check: What are the coordinates of point L? Answer: “(6, 3)”. Mistakes it names: “(3, 6)”, “(6, 4)”.

## Chapter 2: Sort quadrilaterals · `learn/quadrilaterals.html` · Lessons 4, 6–7

### Step 1: Parallel sides, right angles, equal sides
- [ ] It starts with the square: `see 2 pairs of parallel sides, 4 right angles, all 4 sides equal. It’s a trapezoid, a parallelogram, a rectangle, a rhombus, a square. Most specifically: a square.; count polygon.gq-shape = 1; pressed Square`
- [ ] A rectangle isn’t a rhombus: `click Rectangle; see sides not all equal. It’s a trapezoid, a parallelogram, a rectangle. Most specifically: a rectangle.`
- [ ] A rhombus has no right angles: `click Rhombus; see 2 pairs of parallel sides, 0 right angles, all 4 sides equal.; see Most specifically: a rhombus.`
- [ ] A parallelogram: `click Parallelogram; see It’s a trapezoid, a parallelogram. Most specifically: a parallelogram.`
- [ ] One pair of parallel sides: `click Trapezoid; see 1 pair of parallel sides, 0 right angles; see Most specifically: a trapezoid.`
- [ ] No parallel sides: `click Kite; see 0 pairs of parallel sides; see No parallel sides, so it’s just a quadrilateral.`
- Quick check: A quadrilateral has 4 right angles, and 2 pairs of parallel sides, but its sides aren’t all equal. What is its most specific name? Answer: “rectangle”. Mistakes it names: “parallelogram”, “square”.

### Step 2: Names inside names
- [ ] It starts with the rectangle: `see A rectangle is a parallelogram with 4 right angles. So every rectangle is also a quadrilateral, a trapezoid, and a parallelogram. It includes squares.; count li.up = 3; count li.on = 1`
- [ ] A square has every name: `click Square; see So every square is also a quadrilateral, a trapezoid, a parallelogram, a rectangle, and a rhombus.; count li.up = 5`
- [ ] A rhombus isn’t a rectangle: `click Rhombus; see So every rhombus is also a quadrilateral, a trapezoid, and a parallelogram.; count li.up = 3`
- [ ] A trapezoid: `click Trapezoid; see A trapezoid has at least 1 pair of parallel sides. So every trapezoid is also a quadrilateral.`
- [ ] A quadrilateral has nothing above it: `click Quadrilateral; see A quadrilateral has 4 sides. It includes every shape below.; count li.up = 0`
- Quick check: Which statement is always true? Answer: “Every square is a rhombus.”. Mistakes it names: “Every rhombus is a square.”, “Every trapezoid is a parallelogram.”.

## Chapter 3: Sort triangles · `learn/triangles.html` · Lesson 8

### Step 1: By sides and by angles
- [ ] It starts acute and isosceles: `see Two sides are the same length, and every angle is less than a square corner: an acute isosceles triangle.; pressed Acute; pressed Isosceles`
- [ ] Right and scalene: `click Right; click Scalene; see No two sides are the same length, and one angle is a square corner: a right scalene triangle.`
- [ ] Obtuse and isosceles: `click Obtuse; see one angle is wider than a square corner: an obtuse isosceles triangle.`
- [ ] Obtuse and scalene: `click Obtuse; click Scalene; see an obtuse scalene triangle.`
- Quick check: Which name fits this triangle? Answer: “right scalene triangle”. Mistakes it names: “right isosceles triangle”, “acute scalene triangle”.

## Chapter 4: Two patterns at once · `learn/patterns.html` · Lessons 9–10, 12

### Step 1: Compare two rules
- [ ] It starts with 3 and 6: `see Rule B adds 2 times as much, so each Rule B number is 2 times the Rule A number: 6 × 2 = 12.; count td = 12`
- [ ] Not a whole number times: `click Rule B adds: one more; see Rule B adds 7, and 7 isn’t a whole number times 3: each Rule B number is 7/3 of the Rule A number.`
- [ ] Edge: Rule A stops at 1, Rule B at 9: `click Rule A adds: one less ×3; click Rule B adds: one more ×4; see each Rule B number is 9 times the Rule A number: 2 × 9 = 18.`
- [ ] The same rule: `click Rule B adds: one less ×3; see each Rule B number is 1 times the Rule A number`
- Quick check: Rule A starts at 0 and adds 3. Rule B starts at 0 and adds 6. When Rule A’s number is 12, what is Rule B’s? Answer: 24. Mistakes it names: 15, 36.

### Step 2: Graph the pairs
- [ ] It starts with Rule B adding 3: `see Rule A adds 2 and Rule B adds 3. The pairs are (0, 0), (2, 3), (4, 6), (6, 9), (8, 12).; count circle.gq-pt = 5`
- [ ] Edge: Rule B stops at 1: `click Rule B adds: one less ×3; see The pairs are (0, 0), (2, 1), (4, 2), (6, 3), (8, 4).`
- Quick check: Rule A starts at 0 and adds 2. Rule B starts at 0 and adds 6. Which ordered pair belongs to the patterns? Answer: “(4, 12)”. Mistakes it names: “(4, 10)”, “(12, 4)”.

## Chapter 5: Rectangles on the grid · `learn/rectangles.html` · Lesson 13

### Step 1: Perimeter and area from corners
- [ ] It starts at 5 by 3: `see It’s 6 − 1 = 5 across and 4 − 1 = 3 up. Perimeter: 5 + 3 + 5 + 3 = 16 units. Area: 5 × 3 = 15 square units.; count circle.gq-pt = 4`
- [ ] Edge: the biggest: `click Across: one more ×4; click Up: one more ×4; see Perimeter: 8 + 6 + 8 + 6 = 28 units. Area: 8 × 6 = 48 square units.`
- [ ] Edge: one square: `click Across: one less ×5; click Up: one less ×3; see Perimeter: 1 + 1 + 1 + 1 = 4 units. Area: 1 × 1 = 1 square unit.`
- Quick check: A garden plot has corners at (1, 1), (6, 1), (6, 4), and (1, 4). Each grid unit is 1 meter. What is its perimeter? Answer: 16 meters. Mistakes it names: 15, 8.
